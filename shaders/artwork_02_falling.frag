//HTMLの　Texture.flipY ＝ false; の操作で上下逆にできる
precision mediump float;

varying vec2 vUv;
uniform sampler2D u_texture;
uniform float u_time;
uniform bool u_isFalling;
uniform vec2 u_resolution;
uniform float u_density;

// 軽量な乱数関数
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// 2Dノイズ
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// カールノイズ（渦）
vec2 curl(vec2 p, float t) {
    float e = 0.1;
    float n1 = noise(p + vec2(0.0, t * 0.1));
    float n2 = noise(p + vec2(e, t * 0.1));
    float n3 = noise(p + vec2(0.0, e + t * 0.1));
    return vec2((n3 - n1) / e, -(n2 - n1) / e);
}

void main() {
    vec2 uv = vUv;
    float alpha = 1.0;
    
    vec2 res = (u_resolution.x <= 0.0) ? vec2(1000.0) : u_resolution;
    vec2 grid = res * u_density;
    vec2 seed = floor(vUv * grid) / grid;
    float r = random(seed);

    if (u_isFalling) {
        // 1. バラバラな上昇速度 (浮力)
        // 粒子ごとに異なる速度 (0.4 ~ 0.9) で上昇
        float buoyancy = u_time * (0.3 + r * 0.5);
        uv.y += buoyancy; 

        // 2. カールノイズによる拡散
        // 時間が経つほど、また上にいくほど渦の影響を強くして「バラバラ感」を出す
        float spread = u_time * 0.15;
        vec2 swirl = curl(seed * 3.0, u_time * 2.6);
        uv += swirl * spread;

        // 3. 蒸発 (上に行くほど消える)
        // 全体の時間経過 + 上に昇った距離に応じて透明にする
        alpha = clamp(1.0 - (u_time * 0.5 + buoyancy * 0.2), 0.0, 1.0);
    }

    if (uv.y > 1.0 || uv.y < 0.0 || uv.x > 1.0 || uv.x < 0.0 || alpha <= 0.0) {
        discard;
    } else {
        vec4 color = texture2D(u_texture, uv);
        gl_FragColor = vec4(color.rgb, alpha);
    }
}