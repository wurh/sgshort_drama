# 拉尔夫·琼斯 · 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 依据 SNK 官方参照图（KOF 美式街头拳手·拉尔夫·琼斯 "Ralf Jones" 经典款）整理。
> **风格目标：照片级真实感**——像一个真实存在的 30 岁健美街头拳手被摄影机抓拍，**不是动漫、不是 cosplay、不是游戏渲染**。
> ⚠️ 造型定位：**深棕短发 + 红绿条纹（绿星）长头巾（飘带垂后）+ 深紫/茄紫无袖战术背心（露精壮胸腹）+ 深绿长袖打底 + 红色拳击手套 + 棕色皮腰带 + 军绿 cargo 工装裤（大腿大口袋）+ 棕色军靴**，右拳前送 + 左拳护颌。
> 能力色系铁律：**拉尔夫·琼斯 = 无元素特效**（纯拳法，出图务必 `no fire, no elemental effects`；与大门/特瑞/安迪/东丈/哈维·D/洛奇/拜仁/金家藩/陈国汉/蔡宝健/哈迪伦同属"无特效"阵营，区别 = 红绿条纹长头巾 + 深紫无袖背心 + 军绿工装裤 + 红拳套）。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 体型 | 30 岁健美街头拳手，精壮肌肉（胸/肩/臂明显），重心下沉 |
| 肤色 | 浅古铜/小麦亚洲肤色，带真实毛孔、微汗光泽 |
| 脸型 | 真实东亚成年男，方下颌、凶猛专注神情 |
| 眼神 | 锐利杀气（拳手专注） |
| 发型 | **深棕色短发（微乱、侧面推短）** |
| 头饰 | **红绿条纹（红底绿星/绿三角）长头巾，绑额、长飘带垂身后** |
| 上衣 | **深紫/茄紫无袖战术背心（敞领露胸腹）+ 深绿长袖打底（sleeveless vest over long-sleeve shirt）** |
| 手 | **红色拳击手套（RED boxing gloves）+ 红色护腕** |
| 腰带 | **棕色皮腰带（金属扣）** |
| 下装 | **军绿色 cargo 工装裤（大腿两侧大贴袋 patch pockets）** |
| 鞋 | **棕色军靴/皮靴（brown leather combat boots）** |
| 姿势 | **右拳前送直拳 + 左拳护颌、前脚在前马步** |
| 能量 | **无元素特效**（纯拳法，出图务必 `no fire, no elemental effects`） |
| 气质 | 热血勇武的街头拳手（特瑞/安迪 师兄） |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, candid documentary lighting, subtle film grain`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no comic, no manga panel, no illustration, no 3d render, no cgi, no chibi, no cel shading, no plastic skin, no airbrushed skin, no perfect symmetry, no video game model, no video game render, no fantasy glow, no aura, no game character, no fire, no elemental effects, no deformed hands, no extra fingers, no watermark, no text, no 8k, no studio fashion portrait, consistent facial identity`

### ① 全身·白底参考照（锁脸主基准）
`a REAL 30-year-old muscular East Asian street fighter, tanned sun-bronzed skin with heavy muscle definition and a subtle sweat sheen and visible pores, short dark-brown hair, a long RED headband with GREEN STAR / GREEN TRIANGLE pattern tied across his forehead with the long tail fluttering behind him, a dark PURPLE / aubergine SLEEVELESS tactical vest over a dark olive-green long-sleeved shirt, dark RED boxing gloves on both hands, a brown leather waist belt with a metal buckle, loose olive-drab CARGO military trousers with two large patch pockets on the thighs, tall brown leather combat boots, one foot forward with the right fist thrust forward in a straight punch and the left fist at guard near the chin, an intense fierce determined expression, pure white seamless studio background, no cast shadow, candid documentary, 35mm film grain` + 负面提示。

### ② 近景·脸（热血拳手，写实大头）
`extreme close-up portrait of a REAL 30-year-old muscular East Asian man, a fierce focused expression, a red-and-green patterned headband across his forehead, tanned skin with realistic pores, slight facial asymmetry, natural window side-light, candid documentary photograph, 35mm film grain, shallow depth of field, NOT airbrushed, NOT a 3d render` + 负面提示。

### ③ 侧脸 / 背影（悬念镜头）
`realistic back view of the same East Asian street fighter, his dark purple sleeveless vest over an olive long-sleeve shirt, the long red-and-green headband tail fluttering behind, olive cargo trousers with thigh patch pockets, brown combat boots, cold cinematic silhouette against a dark urban alley at night, moody low-key lighting, film still` + 负面提示。

### ④ 出招·直拳重击（纯拳法，无特效）
`a REAL muscular East Asian street fighter mid straight-jab combination, his red-gloved fist snapping forward with real motion blur, the power shown through real body rotation and footwork NOT an explosion and NOT a fantasy aura or elemental effect, dark urban ring at night, cinematic slow-motion` + 负面提示。

### ⑤ 白底静立（不动基准）
`full body, a REAL 30-year-old muscular East Asian man standing and facing camera at eye level, all clothing details above (red-green headband, purple sleeveless vest over olive long-sleeve shirt, red gloves, brown belt, olive cargo trousers, brown boots), both hands relaxed at his sides, neutral dark studio-like background with soft cinematic key light, no energy effects, photorealistic, fierce gaze` + 负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**真人写实基准：**
> 摄影级真实抓拍画面：一名 30 岁健美街头拳手（KOF 美式街头拳手·拉尔夫·琼斯，特瑞/安迪 师兄），精壮肌肉（胸/肩/臂明显）、重心下沉，**浅古铜/小麦亚洲肤色 + 真实毛孔微汗光泽**。方下颌、**凶猛专注眼神**、**深棕色短发（微乱）**，绑**红绿条纹（红底绿星/绿三角）长头巾、长飘带垂身后**，着**深紫/茄紫无袖战术背心（敞领露胸腹）+ 深绿长袖打底 + 红色拳击手套（红护腕）+ 棕色皮腰带（金属扣）+ 军绿色 cargo 工装裤（大腿两侧大贴袋）+ 棕色军靴**；**右拳前送直拳 + 左拳护颌、前脚在前马步**，热血勇武。

**出招（拳法，无特效）：**
> 出招是**拳击组合（刺拳/直拳连击）**——红拳套快速前送、身体旋转蓄力，**以真实出拳与脚步表达力量，不做火焰、不做气旋、不做电光、不做玄幻光环**；皮肤与衣物保持真实材质。

---

## 四、一致性锚点 + 颜色铁律

- 锚点（缺一即换人）：**深棕短发 + 红绿条纹（绿星）长头巾飘带 + 深紫无袖战术背心（深绿长袖打底）+ 红色拳击手套 + 棕色皮腰带 + 军绿 cargo 工装裤（大腿大口袋）+ 棕色军靴 + 右拳前送左拳护颌 + 浅古铜肤色**，跨镜头保留。
- 颜色铁律：**拉尔夫·琼斯 = 无元素特效**（纯拳法）；草薙京=红焰 / 八神=紫焰 / 二阶堂=黄白电光 / 椎拳崇=青白气旋 / 麻宫=粉白念动力。**拉尔夫·琼斯出招务必 `no fire, no elemental effects`，与所有"有特效"角色互不混色；头巾=红绿条纹（绿星）、背心=深紫/茄紫，勿漂成其他色。**

---

## 五、出图登记

> ⚠️ 本角色为 KOF 美式街头拳手（拉尔夫·琼斯），**无元素特效**（纯拳法，出图务必 `no fire, no elemental effects`）。

- **✅ ImageGen 图生图定稿（2026-10-24，全身白底锁脸基准）**：`05_资产库/AI生成图/imagegen/Re_render_this_American_street_2026-10-24T08-31-38.png`
  - 出图法：ImageGen image-to-image，`image1=拉尔夫琼斯_经典款_参照.png`，`input_fidelity=low`。
  - 命中：深棕短发 / 红绿条纹（绿星）长头巾飘带 / 深紫无袖战术背心（深绿长袖打底）/ 红拳击手套 / 棕色皮腰带 / 军绿 cargo 工装裤（大腿大口袋）/ 棕色军靴 / 右拳前送左拳护颌 / 真人肌肉皮肤。
  - 右下角带引擎固定"AI生成"水印（要无水印走 Agnes key=`ralf`）。

**Agnes 图生图 · 拟人化 prompt（可直接粘贴，无水印版）**
> Re-render this American street fighter as a REAL 30-year-old muscular East Asian street fighter, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature stance (right fist thrust forward in a straight punch, left fist at guard near the chin, one foot forward) and outfit: short dark-brown hair, a long RED headband with GREEN STAR / GREEN TRIANGLE pattern tied across his forehead with the long tail fluttering behind him, a dark PURPLE / aubergine sleeveless tactical vest over a dark olive-green long-sleeved shirt, dark RED boxing gloves on both hands, a brown leather waist belt with a metal buckle, loose olive-drab CARGO military trousers with two large patch pockets on the thighs, tall brown leather combat boots, an intense fierce determined expression. Tanned sun-bronzed East Asian skin with heavy muscle definition and a subtle sheen of sweat, visible pores. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no elemental effects. PURE WHITE seamless studio background, no cast shadow, full body. NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity
