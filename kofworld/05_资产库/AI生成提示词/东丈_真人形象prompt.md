# 东丈（崔·东次 / Choi Jae-Jung）· 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 依据 SNK 官方设定（KOF 韩国跆拳道选手"Jungle Choi"，赤膊 + 红短裤 + 白护额红点经典款）整理。
> **风格目标：照片级真实感**——像一个真实存在的 24 岁韩国跆拳道运动员被摄影机抓拍，**不是动漫、不是 cosplay、不是游戏渲染**。
> ⚠️ 定位：东丈是**韩国跆拳道格斗家**（**无元素特效**，纯跆拳道腿法/拳法，出招是高速拳腿 + 尘土，不做火焰/光弧）。**无特效阵营**（与大门/特瑞/安迪同档）。
> 造型：赤膊 + 红色跆拳道短裤 + 白色护额（红点）+ 白缠手带 + 棕缠腿带 + 黑色短刺头。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 体型 | 178cm 精壮，肩宽腹肌真实（跆拳道运动员型，非健美块状），双拳护颌、重心沉稳 |
| 肤色 | **浅白人/浅古铜肤色**，带真实毛孔、日晒健康光泽、微汗 |
| 脸型 | 真实韩国人男性面孔，方下颌、挺直鼻梁、**凶狠专注**（野兽般的斗志） |
| 眼神 | 冷而锐利**黑/深褐眼**，眼神凶狠不服输 |
| 发型 | **黑色短刺猬头**（短寸竖起、带几根碎发，非长发、非刘海） |
| 头饰 | **白色护额**系额头，**正中一枚红色圆点纹章**（实物，非发光） |
| 上装 | **赤膊（无上衣）**，露出胸肩腹肌线条 |
| 护具 | **白色缠手带**（缠绕双腕至小臂） |
| 下装 | **红色跆拳道短裤**（腰头黑 + 金色带扣小铭牌） |
| 腿 | **棕色缠腿带 / 护胫**（缠绕至胫骨） |
| 鞋 | **赤脚 / 低帮**（跆拳道不穿鞋出招） |
| 能量 | **无元素特效**（纯跆拳道拳腿法，出招带拳风/尘土，不做火焰/光弧） |
| 气质 | 凶狠、桀骜、街头野兽（"Jungle"野兽之名） |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, candid documentary lighting, subtle film grain`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no comic, no manga panel, no illustration, no 3d render, no cgi, no chibi, no cel shading, no plastic skin, no airbrushed skin, no perfect symmetry, no video game model, no video game render, no fantasy glow, no aura, no game character, no elemental effects, no fire, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, no studio fashion portrait, consistent facial identity`

### ① 全身·白底参考照（锁脸主基准）
`a REAL 24-year-old Korean taekwondo fighter, 178cm lean athletic with a real toned tanned physique (naturally proportioned, not bodybuilder-blocky), light-tanned skin with realistic pores and a subtle sweat sheen, square jaw with a fierce focused expression, cold dark eyes, black short SPIKY hair with a few flyaway strands, a white cloth headband tied across the forehead with a small RED dot crest on the center, bare-chested with visible chest and ab muscles, thick white hand wraps on both wrists and forearms, loose RED taekwondo shorts with a black waist belt and a small gold name-plate, brown leg wraps on both shins, barefoot, a wide stable fighting stance with both fists raised at guard height, a fierce street-beast presence, realistic fabric and skin, pure white seamless studio background, no cast shadow, candid documentary, 35mm film grain` + 负面提示。

### ② 近景·脸（凶狠眼神，写实大头）
`extreme close-up portrait of a REAL 24-year-old Korean man, fierce focused expression, strong square jaw, realistic skin texture with pores and a light sweat sheen, cold dark eyes, black short spiky hair under a white headband with a red dot crest, slight facial asymmetry and a few natural skin blemishes, natural window side-light, candid documentary photograph, 35mm film grain, shallow depth of field, NOT airbrushed, NOT a 3d render` + 负面提示。

### ③ 侧脸 / 背影（威慑镜头）
`realistic side profile and back view of the same Korean taekwondo fighter, the back of his bare chest and the white headband's red dot crest, black spiky hair, brown leg wraps visible, cold cinematic silhouette in a dark empty dojang at night, moody low-key lighting, film still` + 负面提示。

### ④ 出招·跆拳道腿法（高速拳腿，非爆炸，无元素特效）
`a REAL Korean taekwondo fighter mid-roundhouse kick, a fast spinning leg strike, faint motion blur and a small puff of dust, NO fire and NO fantasy aura, realistic skin and fabric, gritty dojang at dusk, candid documentary, 35mm film grain` + 负面提示。

### ⑤ 白底静立（不动基准）
`full body, a REAL 24-year-old Korean man standing still and facing camera at eye level, all clothing details above, both fists raised at guard height or hands empty at his sides, neutral dark studio-like background with soft cinematic key light, no flames, photorealistic, fierce intense gaze` + 负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**真人写实基准：**
> 摄影级真实抓拍画面：一名 24 岁韩国跆拳道选手，**浅白人肤色带日晒光泽与微汗**、皮肤有真实毛孔。方下颌、**凶狠专注**、深色锐利眼；**黑色短刺猬头（带几根碎发）**；**白色护额系额头（正中一枚红色圆点纹章，实物非发光）**；**赤膊露胸肩腹肌**、**白色缠手带（缠双腕至小臂）**、**红色跆拳道短裤（黑腰头 + 金色带扣小铭牌）**、**棕色缠腿带（缠至胫骨）**、**赤脚**；双拳护颌、重心沉稳，街头野兽般的凶狠气。

**出招（跆拳道腿法）：**
> 出招是**高速跆拳道腿法/拳法**——回旋踢、拳腿带轻微运动模糊与一小撮尘土，**无火焰、无光弧、无玄幻气**；皮肤与衣物保持真实材质。

---

## 四、一致性锚点 + 颜色铁律

- 锚点（缺一即换人）：**白护额 + 正中红色圆点 + 赤膊 + 白色缠手带 + 红跆拳道短裤 + 棕缠腿带 + 黑短刺猬头**，跨镜头保留。
- 颜色铁律：东丈=**无元素特效**（纯跆拳道拳腿/尘土）；草薙京=红焰 / 八神=紫焰 / 二阶堂=黄白电光 / 椎拳崇=青白气旋 / 大门=无特效。**东丈与大门/特瑞/安迪同属"无特效"，区别=赤膊 + 红跆拳道短裤 + 白护额红点 + 黑刺猬头。**

---

## 五、出图登记

- **✅ ImageGen 图生图定稿（2026-10-18，全身白底锁脸基准）**：`05_资产库/AI生成图/imagegen/Re_render_this_martial_arts_fi_2026-10-18T15-11-42.png`
  - 出图法：ImageGen image-to-image，`image1=东丈_经典款_参照.png`，`input_fidelity=low`。
  - 命中：黑刺猬头 / 白护额红点 / 赤膊 / 白缠手带 / 红跆拳道短裤（金扣黑腰带）/ 棕缠腿带 / 双拳护颌马步 / 真人皮肤。
  - 右下角带引擎固定"AI生成"水印（按用户选择 ImageGen 出图、暂留水印；要无水印走 Agnes）。

**Agnes 图生图 · 拟人化 prompt（无水印版可用）**
> Re-render this martial-arts fighter as a REAL 24-year-old Korean taekwondo fighter, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature outfit and stance: bare-chested with a real athletic tanned physique, black short SPIKY hair, a white cloth headband with a small RED dot crest on the forehead, thick white hand wraps, loose RED taekwondo shorts with a black waist belt, brown leg wraps, a wide stable stance with fists at guard height. Light tanned skin with realistic pores and a subtle sweat sheen. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no fantasy aura. Pure white seamless studio background, no cast shadow, full body. NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no elemental effects, no fire, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity
