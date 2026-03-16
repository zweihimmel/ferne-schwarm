//ライトグレーと茶色(木版)残す
precision highp float;

varying vec2 vUv;
uniform sampler2D u_texture;
uniform float u_time;
uniform bool u_active;

void main() {
    vec4 color = texture2D(u_texture, vUv);
    
    if(!u_active) {
        gl_FragColor = color;
        return;
    }

    // 進行度 (0.0 ～ 1.0)  float t = clamp(u_time * 0.6, 0.0, 1.0);
    float t = clamp(u_time * 0.6, 0.1, 0.9);

    // --- 色の抽出ロジック ---
    
    // 1. 茶色判定 (R > B + 30/255)
    bool isBrown = (color.r > color.b + 0.117);

    // 2. ライトグレー判定 (RGBが220/255 = 0.86近辺)
    // 明度が高く、かつ彩度が低い（各チャンネルの差が小さい）　
    float grayVal = (color.r + color.g + color.b) / 3.0;
    float diff = max(max(color.r, color.g), color.b) - min(min(color.r, color.g), color.b);
    //grayVal > 0.75　数値が低いと暗めのグレーまでライトグレー判定、
    //diff < 0.1　数値が低いと色の偏りがない純粋なグレーとして残る
    bool isLightGray = (grayVal > 0.9 && diff < 0.1);

    // --- 忘却の設計 ---

    // 記憶の核心（茶色とライトグレー）かどうかのフラグ
    bool isCoreMemory = (isBrown || isLightGray);

    vec3 cremeColor = vec3(0.8, 0.8, 0.7); // プルースト・クリーム vec3(0.96, 0.94, 0.88)
    vec3 finalRGB = color.rgb;
    float alpha = color.a;

    if (isCoreMemory) {
        // 【茶色とライトグレー：ゆっくり消える】
        // 0.4付近まで形を保ち、そこから静かにクリーム色に浸透していく smoothstep(0.2, 1.0, t);
        float slowFade = smoothstep(0.1, 1.0, t);
        
        // 彩度を少しずつ抜きつつ、クリーム色へ vec3(0.299, 0.587, 0.114));
        float gray = dot(finalRGB, vec3(0.3, 0.6, 0.12));
        //  finalRGB = mix(finalRGB, vec3(gray), slowFade * 0.5);
        finalRGB = mix(finalRGB, vec3(gray), slowFade * 0.8);
        finalRGB = mix(finalRGB, cremeColor, slowFade);
        
        // アルファは後半まで粘る alpha *= (1.0 - pow(slowFade, 2.0));
        alpha *= (1.0 - pow(slowFade, 2.0));
    } else {
        // 【その他の色（濃いグレー等）：素早く消える】
        // 開始とともに急速に彩度を失い、クリーム色の中に没する smoothstep(0.0, 0.5, t);
        float fastFade = smoothstep(0.0, 0.2, t);
        
        finalRGB = mix(finalRGB, cremeColor, fastFade);
        alpha *= (1.0 - fastFade);
    }

    gl_FragColor = vec4(finalRGB, alpha);
}