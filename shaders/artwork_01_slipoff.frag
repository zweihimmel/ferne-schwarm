//紐のようにおちる。若干粘り気あり
precision mediump float; // 演算の精度を中精度に設定

varying vec2 vUv; // Vertex Shaderから渡される描画座標 (0.0〜1.0)
uniform sampler2D u_texture; // 表示する画像テクスチャ
uniform float u_time; // 経過時間
uniform bool u_isFalling; // エフェクト開始のフラグ
uniform vec2 u_resolution; // 画面の解像度
uniform float u_density; // JSから受け取る密度係数（デバイスごとの負荷調整用）

// 入力値xに対して0.0〜1.0の疑似乱数を返す関数
float random(float x) {
    return fract(sin(x * 12.9898) * 43758.5453123);
}

void main() {
    vec2 uv = vUv; // 現在の座標をローカル変数にコピー
    float alpha = 1.0; // 初期透明度を1.0に設定

    if (u_isFalling) { // クリックされてエフェクトが有効な場合
        // 1. スマホなら紐を太くして、計算する紐の数を減らす
        // 密度(u_density)が低いほど紐1本の幅(stripeWidth)を広げ、計算負荷を下げます
        float stripeWidth = 0.002 / u_density; 
        // X座標を幅で割り、何番目の紐かを特定するID（整数）を生成
        float stripeId = floor(uv.x / stripeWidth);
        // 紐ごとに固有の乱数を取得（落下のタイミングや揺れの違いに使用）
        float r = random(stripeId);

        // 紐ごとの重み（落下の勢い）を乱数で決定　weight = 0.8 + r * 2.5;　⭐️ここ変えた
        float weight = 0.1 + r * 0.5;
        // 2. スマホなら少し早く落として、描画時間を短くする
        // 低密度設定(スマホ)の時、speedFactorを大きくして早めに画面外へ逃がします
        float speedFactor = 0.5 * (2.0 - u_density); 
        // 重力による加速（時間の2乗）をシミュレートして落下量を計算
        float drop = u_time * u_time * weight * speedFactor;

        // 紐が左右にわずかに揺れる動き（波）を計算
        float wave = sin(u_time * 5.0 + r * 10.0) * 0.002;

        // 計算した落下量をY座標に加え、揺れをX座標に加える
        uv.y += drop; 
        uv.x += wave;

        // 時間経過とともにアルファ値（透明度）を減衰させる
        alpha = max(0.0, 1.0 - u_time * 0.6);
    }

    // 座標が画像（0.0〜1.0）の範囲外に出た場合は描画をスキップ(discard)
    if (uv.y > 1.0 || uv.y < 0.0 || uv.x > 1.0 || uv.x < 0.0) {
        discard;
    } else {
        // 範囲内の場合、計算後のUV座標に基づいてテクスチャから色を取得
        vec4 color = texture2D(u_texture, uv);
        // 最終的な色と、計算した透明度を出力
        gl_FragColor = vec4(color.rgb, alpha);
    }
}