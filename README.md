# Ferne & Schwarm: Works on Paper 2001-2006
**Concept: Bridging High-Resolution Fine Art and Generative Shaders**

## Project Description
An experimental web archive for my works on paper,  
exploring the visual concepts of "Ferne" (distance)  
and swarm-like organic density through generative shaders.  
  
The site presents high-resolution scans of artworks  
combined with real-time GLSL effects.

## 🌐 Core Concepts & Visual Logic

### 1. Swarm-like Essence (etwas Schwarmartiges / うじゃうじゃした感じ)
- **JP:** 飛行機や山頂から地上を俯瞰した際に感じるような、有機的な密度。
- **DE:** Eine organische Dichte und ein Wuseln, wie man es beim Blick aus dem Flugzeug oder von einem Berggipfel auf die Erde wahrnimmt.
- **EN:** An organic density and movement, reminiscent of the teeming patterns of the earth seen from an airplane or a mountain peak.
- **Implementation:** GLSL-driven particles that amplify the energy of images through fluid real-time animation.

### 2. The Faraway (Ferne / 遠さ)
- **JP:** 距離という感覚をデジタル上の透明度と時間軸で表現。
- **DE:** Das Gefühl von Ferne wird durch digitale Transparenz und Zeitachsen ausgedrückt.
- **EN:** Expressing the sense of distance through digital opacity and temporal transitions.
- **Implementation:** Translucent layers and "evaporating" effects, reconstructing spatial remoteness through digital opacity and temporal transitions.

---

## 🛠️ Technical Highlights

### High-Fidelity Assets (.avif)
- **JP:** 原画の高解像度スキャンデータを .avif 形式で最適化。書き込みの細部を損なわずに高速な読み込みを実現。
- **DE:** Hochauflösende Scans der Originalwerke wurden im .avif-Format optimiert, um feinste Details ohne Qualitätsverlust und bei hoher Ladegeschwindigkeit zu bewahren.
- **EN:** High-resolution scans of original works optimized in .avif format to preserve intricate details and textures while maintaining fast loading speeds.

### Responsive Composition Logic
- **JP:** - **PC:** 抽象画は横長、具象画は2枚並列配置で画面を埋め尽くす。
  - **Mobile:** 縦構図を活かしたフルスクリーン表示。抽象画を縦に置くことで解決。
- **DE:**
  - **Desktop:** Abstrakte Werke werden im Querformat angezeigt; gegenständliche Werke füllen den Bildschirm durch eine parallele Anordnung von zwei Bildern.
  - **Mobil:** Fullscreen-Anzeige unter Nutzung des Hochformats. Abstrakte Werke werden vertikal ausgerichtet.
- **EN:**
  - **Desktop:** Abstract works are displayed in landscape; figurative works fill the screen via a side-by-side layout of two images.
  - **Mobile:** Full-screen display leveraging portrait orientation. Abstract works are adapted through vertical placement.

### Shader Integration (GLSL)
- **JP:** - AI（v0/Cursor）との共創により、数理的なエフェクト（粒子化、透過）を作品ごとにカスタマイズ。
  - GLSL（GPU向け言語）を扱う際、低レイヤーの視点（基本情報・アセンブラ）によって計算効率やメモリを意識した抽象思考が可能。
- **DE:**
  - In Co-Creation mit KI (v0/Cursor) wurden mathematische Effekte (Partikelbildung, Transparenz) für jedes Werk individuell angepasst.
  - Beim Umgang mit GLSL ermöglicht meine Low-Level-Perspektive (Assembler-Kenntnisse) ein abstraktes Denken, das Recheneffizienz und Speichermanagement berücksichtigt.
- **EN:**
  - In co-creation with AI (v0/Cursor), mathematical effects such as unitization (particles) and transparency are customized for each work.
  - When working with GLSL, my low-level perspective (rooted in Assembler experience) enables abstract thinking that prioritizes computational efficiency and memory management.

## Tech Stack  
  
HTML  
CSS  
JavaScript  
GLSL

AI-assisted development:  
ChatGPT  
DeepSeek  
Gemini  
Claude  
Cursor

---

## 🚀 Future Roadmap
- **Data Layer:** Vector Database for artwork element indexing.
- **AI Synthesis:** Generating virtual compositions by combining latent features of existing works.
- **Backend:** Integration with Python (FastAPI).