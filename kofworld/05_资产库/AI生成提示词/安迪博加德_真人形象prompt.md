# 安迪·博加德 · 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 依据 SNK 官方设定（KOF 安迪·博加德 Andy Bogard，金发长发 + 白背心红火焰边经典款）整理。
> **风格目标：照片级真实感**——像一个真实存在的 24 岁美国街头拳手被摄影机抓拍，**不是动漫、不是 cosplay、不是游戏渲染**。
> ⚠️ 定位：安迪是**美式街头拳手**（特瑞·博加德的弟弟，与特瑞同属"美系/无元素特效"阵营，区别=**金发长发**、**白背心红火焰边**、抱臂气场更冷峻）。**无元素特效**（纯拳法，区别草薙红焰/八神紫焰/二阶堂电光/椎拳崇气旋）。
> 造型：金发长直发 + 白无袖背心（红火焰边）+ 红色护腕 + 黑腰带 + 红绑腿 + 红色长靴 + 抱臂。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 体型 | 178cm 精壮，肩宽上肢肌理真实（拳击手型，非健美块状），抱臂站姿、重心沉稳 |
| 肤色 | **浅白人/浅古铜肤色**，带真实毛孔、日晒健康光泽 |
| 脸型 | 真实美国人男性面孔，方下颌、挺直鼻梁、**冷峻不服输** |
| 眼神 | 冷而锐利**蓝眼**（写实镜头偏 steel-blue，非卡通亮蓝） |
| 发型 | 浅金色**中长直发**（垂到肩、发梢微分），真人发丝根根分明（非短寸、非全头马尾） |
| 上装 | **白色无袖背心**，领口与下摆带**红色火焰纹边**（实体织印，非发光） |
| 护具 | **红色前臂护腕/绷带**（双臂交叉时可见） |
| 下装 | **白短裤** + **红色绑腿/长护腿**（缠绕至膝下），黑色腰带 |
| 鞋 | **红色高筒皮靴**（带白鞋带） |
| 能量 | **无元素特效**（纯拳法，出招是高速拳风/尘土，不做火焰/光弧） |
| 气质 | 冷峻、孤傲、克制（比哥哥特瑞更沉更冷） |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, candid documentary lighting, subtle film grain`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no comic, no manga panel, no illustration, no 3d render, no cgi, no chibi, no cel shading, no plastic skin, no airbrushed skin, no perfect symmetry, no video game model, no video game render, no fantasy glow, no aura, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no gore, no 8k, no studio fashion portrait, consistent facial identity`

### ① 全身·白底参考照（锁脸主基准）
`a REAL 24-year-old American street fighter, light tanned Caucasian skin with realistic pores, square jaw with a cold stern expression, steel-blue eyes, long light BLONDE straight hair falling to the shoulders, wearing a white SLEEVELESS tank top with a RED FLAME-TIP trim along the neckline and hem, RED forearm wraps, black waist belt, white shorts with RED leg wraps extending down the shins, tall RED leather boots with white laces, arms crossed over the chest, a cold arrogant presence, realistic fabric and skin, pure white seamless studio background, no cast shadow, candid documentary, 35mm film grain` + 负面提示。

### ② 近景·脸（眼神/冷峻，写实大头）
`extreme close-up portrait of a REAL 24-year-old American man, cold stern expression, strong square jaw, realistic skin texture with pores, steel-blue eyes, slight facial asymmetry and a few natural skin blemishes, long light blonde hair, natural window side-light, candid documentary photograph, 35mm film grain, shallow depth of field, NOT airbrushed, NOT a 3d render` + 负面提示。

### ③ 侧脸 / 背影（悬念镜头）
`realistic side profile and back view of the same American street fighter, the back of his white tank top with red flame-tip trim, long blonde hair falling over the shoulders, cold cinematic silhouette against a dark empty dojo at night, moody low-key lighting, film still` + 负面提示。

### ④ 出招·高速拳法（非爆炸，无火焰光弧）
`a REAL American street fighter mid-punch, a fast straight or rising strike, faint motion blur and a small puff of dust, NO fire and NO fantasy aura, realistic skin and fabric, gritty gym or street at dusk, candid documentary, 35mm film grain` + 负面提示。

### ⑤ 白底静立（不动基准）
`full body, a REAL 24-year-old American man standing still and facing camera at eye level, all clothing details above, arms crossed or hands empty and relaxed at his sides, neutral dark studio-like background with soft cinematic key light, no flames, photorealistic, cold stern gaze` + 负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**真人写实基准：**
> 摄影级真实抓拍画面：一名 24 岁美国街头拳手，**浅白人肤色带日晒光泽**、皮肤有真实毛孔（**金发是天然金，无需纠成棕**）。方下颌、**冷峻不服输**，**钢蓝色眼睛**；**浅金色中长直发垂到肩**。着**白色无袖背心（领口下摆红色火焰纹边，实物非发光）**、**红色前臂护腕**、**黑腰带**、**白短裤 + 红色绑腿/护腿（缠到膝下）**、**红色高筒皮靴（白鞋带）**；**抱臂站姿**，冷峻孤傲（比哥哥特瑞更沉更冷）。

**出招：**
> 出招是**高速拳法**——直拳/上升拳、拳风带轻微运动模糊与一小撮尘土，**无火焰、无光弧、无玄幻气**；皮肤与衣物保持真实材质。

---

## 四、一致性锚点 + 颜色铁律

- 锚点（缺一即换人）：**金发中长直发（垂肩） + 白背心红色火焰纹边 + 红色护腕 + 红绑腿/红色长靴 + 抱臂 + 冷峻蓝眼**，跨镜头保留。
- 颜色铁律：安迪=**无元素特效**（纯拳法/尘土）；草薙京=红焰 / 八神=紫焰 / 二阶堂=黄白电光 / 椎拳崇=青白气旋 / 大门=无特效。**安迪与特瑞、大门同属"无特效"，区别=金发长发 + 白背心红火焰边 + 红绑腿长靴（特瑞=金短发侧辫 + 红帽 + 撕裂红背心）。**

---

## 五、Agnes-Image-2.5-Flash 图生图（本参照出"真·照片级"锁脸图）

> 参照图（稳定路径）：`05_资产库/参考图/安迪博加德_经典款_参照.png`（经典款官方立绘）。
> 引擎：Agnes-Image-2.5-Flash，image-to-image（`extra_body.image` 传参照 base64，`input_fidelity=low`），`response_format=b64_json` 落盘最稳。
> 出图命令：`python tools/agnes_img2img.py andy 2K 9:16`

**Agnes 图生图 · 拟人化 prompt（可直接粘贴）**
> Re-render this street fighter as a REAL 24-year-old American street-fighter man, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature outfit and stance: long light BLONDE straight hair falling to the shoulders, a white SLEEVELESS tank top with a RED FLAME-TIP trim along the neckline and hem, RED forearm wraps, a black waist belt, white shorts with RED leg wraps extending down the shins, tall RED leather boots with white laces, arms crossed over the chest. Light tanned Caucasian skin, a square jaw with a cold stern expression, steel-blue eyes. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no fantasy aura. Pure white seamless studio background, no cast shadow, soft natural side light. Full body. NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity

**✅ ImageGen 图生图实测定稿（2026-10-18，全身白底锁脸基准）**：`05_资产库/AI生成图/imagegen/Re_render_this_street_fighter__2026-10-18T14-29-10.png`
- 出图法：ImageGen image-to-image，`image1=安迪博加德_经典款_参照.png`，`input_fidelity=low`。
- 命中：金发长发垂肩 / 白背心红色火焰纹边 / 红护腕 / 黑腰带 / 白短裤红绑腿 / 红色高筒皮靴(白鞋带) / 抱臂 / 冷峻表情 / 真人皮肤。
- 右下角带引擎固定"AI生成"水印（用户选 ImageGen 出图即可、暂留水印；要无水印走 Agnes）。

