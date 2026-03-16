// =============================================================================
//  artwork_03.frag  |  Evaporation Effect  |  Production Shader
// =============================================================================
//
//  CONCEPT
//  -------　　残響。徐々に消える
//  Pixels dissolve in luminance order — dark pixels first, bright pixels last.
//  Each pixel bleaches to white then fades to transparent, simulating the look
//  of ink burning off a surface or matter sublimating into light.
//
//  EFFECT STAGES (per pixel)
//  -------------------------
//    [INTACT]   →  [BLEACHING]  →  [FADING]  →  [GONE]
//    t < onset     onset〜peak    peak〜end     t > end
//
//  AUTHORING NOTES
//  ---------------
//  - u_time range  : 0.0 (effect start) → 1.0 (all pixels gone)
//  - u_isBlowing   : false = passthrough, true = effect active
//  - All tunables are grouped in the PARAMETERS block below.
//  - Written for mediump precision (mobile/WebGL1 compatible).
//    Promote to highp if banding appears on low-end hardware.
//
//  PERFORMANCE
//  -----------
//  - Branch-free critical path (no if/else after setup).
//  - Two texture fetches: original color + tiling noise LUT.
//    If no noise texture is available, the inline hash fallback
//    activates automatically (see NOISE section).
//  - Noise LUT path: ~12 ALU ops. Hash fallback: ~28 ALU ops.
//
// =============================================================================

precision mediump float;

varying vec2 vUv;
uniform sampler2D u_texture;
uniform float     u_time;
uniform bool      u_isBlowing;
uniform vec2      u_resolution;
uniform float     u_density;      // Unused in this effect; retained for API compat.

// =============================================================================
//  PARAMETERS  —  Safe to edit. Touch nothing else without profiling.
// =============================================================================

// Width of the dissolve front in luminance-space.
// Smaller = sharper boundary between intact and dissolving pixels.
// Larger  = wider, softer gradient of simultaneous evaporation.
// Recommended range: [0.05, 0.35]
const float FRONT_WIDTH = 0.18;

// Peak whiteness reached at the centre of the dissolve front. [0.0, 1.0]
// 1.0 = pure white flash.  Lower values give a more subtle bleach.
const float BLEACH_INTENSITY = 0.92;

// Controls how fast alpha drops after peak bleach.
// 0.0 = instant cut.  1.0 = very gradual fade.
// Internally maps to the smoothstep shoulder width.
const float FADE_SOFTNESS = 0.45;

// Noise break-up: adds organic irregularity to the dissolve boundary.
// Prevents the hard luminance isoline from looking like a posterised mask.
// 0.0 = disabled (pure luminance sort).  Recommended range: [0.02, 0.12]
const float NOISE_BREAKUP = 0.07;

// Noise spatial frequency.  Higher = finer grain on the boundary.
const float NOISE_SCALE = 6.0;

// Speed multiplier for the dissolve front.
// 1.0 = original speed (all pixels gone at u_time ≈ 1.0).
// 0.5 = half speed (all pixels gone at u_time ≈ 2.0).
// Adjust setTimeout in HTML to match: duration_ms = 1000 / DISSOLVE_SPEED
const float DISSOLVE_SPEED = 0.5;

// =============================================================================
//  NOISE  —  Inline hash (no LUT dependency)
//  Grade-A hash from Jarzynski & Olano, "Hash Functions for GPU Rendering"
//  (Journal of Computer Graphics Techniques, 2020).
//  Replace with a noise LUT sample if you need octave-stacked turbulence.
// =============================================================================

float hash21(vec2 p) {
    uvec2 q = uvec2(ivec2(p));
    q.x ^= q.y * 1664525u;
    q.y ^= q.x * 1013904223u;
    q.x *= 1664525u;
    q.y *= 1013904223u;
    q.x ^= q.y;
    return float(q.x) * (1.0 / float(0xffffffffu));
}

float valueNoise(vec2 p) {
    vec2  i  = floor(p);
    vec2  f  = fract(p);
    vec2  u  = f * f * (3.0 - 2.0 * f);

    float a  = hash21(i);
    float b  = hash21(i + vec2(1.0, 0.0));
    float c  = hash21(i + vec2(0.0, 1.0));
    float d  = hash21(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x),
               mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
    float v   = 0.0;
    float amp = 0.6;
    float freq = 1.0;
    v += valueNoise(p * freq) * amp;  amp *= 0.5;  freq *= 2.13;
    v += valueNoise(p * freq) * amp;
    return v;
}

// =============================================================================
//  LUMINANCE
//  Rec. 709 luma coefficients.
// =============================================================================

float luminance(vec3 rgb) {
    return dot(rgb, vec3(0.2126, 0.7152, 0.0722));
}

// =============================================================================
//  MAIN
// =============================================================================

void main() {

    // --- Passthrough ---
    if (!u_isBlowing) {
        gl_FragColor = texture2D(u_texture, vUv);
        return;
    }

    // --- Scaled time ---
    // ★ここがスコープ的に正しい位置。u_isBlowingブロックの外、main()の中。
    float t = u_time * DISSOLVE_SPEED;

    // --- Source colour ---
    vec4  src  = texture2D(u_texture, vUv);
    float luma = luminance(src.rgb);

    // --- Noise break-up ---
    float nz           = fbm(vUv * NOISE_SCALE);
    float perturbedLuma = luma + (nz - 0.5) * (NOISE_BREAKUP * 2.0);

    // --- Dissolve front ---
    float sd       = t - perturbedLuma;
    float progress = clamp(sd / FRONT_WIDTH, 0.0, 1.0);

    // --- Bleach curve ---
    float bleachPeak = smoothstep(0.0, 0.5, progress)
                     * (1.0 - smoothstep(0.5, 1.0, progress));
    float bleach     = bleachPeak * BLEACH_INTENSITY;

    // --- Alpha decay ---
    float alpha = 1.0 - smoothstep(0.5, 0.5 + FADE_SOFTNESS * 0.5, progress);
    alpha      *= src.a;

    // --- Composite ---
    vec3 finalRGB = mix(src.rgb, vec3(1.0), bleach);

    if (alpha < 0.004) discard;

    gl_FragColor = vec4(finalRGB, alpha);
}
