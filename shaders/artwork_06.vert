precision highp float;

uniform float u_time;
uniform float u_aspect;
varying vec2 vUv;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vUv = uv;
    vec3 p = position;
    float a = rand(uv);
    float angle = sin(u_time * 0.6 + a * 20.0);
    p.x += cos(angle) * u_time * 0.06;
    p.y += sin(angle) * u_time * 0.06;

    // アスペクト比補正 
    p.x /= u_aspect;
//gl_PointSize = 2.5;で大きさ変更
    gl_PointSize = 3.5;
    gl_Position = vec4(p, 1.0);
}
