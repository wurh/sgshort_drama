# 克拉克·斯蒂尔 · 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 依据 SNK 官方参照图（KOF 美式街头拳手·克拉克·斯蒂尔 "Clark Still" 经典款）整理。
> **风格目标：照片级真实感**——像一个真实存在的 30 岁健美街头拳手（街头警察）被摄影机抓拍，**不是动漫、不是 cosplay、不是游戏渲染**。
> ⚠️ 造型定位（**已按用户"帽子是蓝色"二次纠正**）：**蓝色棒球帽 + 黑 wayfarer 方框墨镜 + 深藏青/钢蓝 padded 无袖战术马甲（立领敞开领、露黑背心打底 + 精壮胸腹）+ 黑色露指战术手套 + 深藏青 cargo 工装裤（大腿大口袋）+ 深棕皮鞋**，一脚在前 + 一臂横胸 + 另一只戴拳套的手抬起 + 张口呐喊狂笑。
> ⚠️ 纠正说明：初版误把整套配成官方标题图（参照3）的"棕褐马甲 + 白背心 + 蓝拳套"，**实际以经典款（参照2）为准 = 藏青 padded 马甲 + 黑背心 + 黑露指手套 + 蓝工装裤**，只把**帽子改蓝色**。旧"棕褐马甲+白背心+蓝拳套"版（T10-45-10）与"灰褐鸭舌帽+黑全指手套+深藏青马甲"版（T10-37-42）均作废。
> 能力色系铁律：**克拉克·斯蒂尔 = 无元素特效**（纯拳法/街头格斗，出图务必 `no fire, no elemental effects`；与大门/特瑞/安迪/东丈/哈维·D/洛奇/拜仁/金家藩/陈国汉/蔡宝健/哈迪伦/拉尔夫·琼斯同属"无特效"阵营，区别 = 蓝棒球帽 + 藏青 padded 无袖马甲 + 黑露指手套 + 蓝 cargo 工装裤 + 呐喊 pose）。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 体型 | 30 岁健美街头拳手/街头警察，精壮肌肉（胸/肩/臂明显），重心下沉 |
| 肤色 | 浅古铜/小麦肤色（Caucasian tanned），带真实毛孔、微汗光泽 |
| 脸型 | 真实白人成年男，方下颌、凶狠狂放神情 |
| 眼神 | 黑色墨镜后藏着的挑衅杀气（张口呐喊狂笑） |
| 发型 | 帽下**浅金/dirty-blonde 短发**（帽檐外露） |
| 头饰 | **蓝色棒球帽（BLUE baseball cap）**（⚠️ 非灰褐鸭舌帽） |
| 眼镜 | **黑色 wayfarer 方框墨镜** |
| 上衣 | **深藏青/钢蓝 padded 无袖战术马甲（立领、敞开前襟、露黑背心打底 + 精壮胸腹）** |
| 打底 | **黑色背心（black tank top）** |
| 手 | **黑色露指战术手套（black fingerless combat gloves）**（⚠️ 非蓝色拳击手套） |
| 下装 | **深藏青 cargo 工装裤（大腿两侧大贴袋 patch pockets）** |
| 鞋 | **深棕色皮鞋（brown leather shoes）** |
| 姿势 | **一脚在前 + 一臂横胸 + 另一只戴拳套的手抬起 + 张口呐喊狂笑** |
| 能量 | **无元素特效**（纯拳法，出图务必 `no fire, no elemental effects`） |
| 气质 | 张扬狂放、自信挑衅的街头拳王（特库摩 3K 小队队长，特瑞/安迪/拉尔夫 的队长） |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, candid documentary lighting, subtle film grain`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no comic, no manga panel, no illustration, no 3d render, no cgi, no chibi, no cel shading, no plastic skin, no airbrushed skin, no perfect symmetry, no video game model, no video game render, no fantasy glow, no aura, no game character, no fire, no elemental effects, no deformed hands, no extra fingers, no watermark, no text, no 8k, no studio fashion portrait, consistent facial identity`

### ① 全身·白底参考照（锁脸主基准）
`a REAL 30-year-old muscular Caucasian street cop / street fighter, tanned sun-bronzed skin with heavy muscle definition and a subtle sweat sheen and visible pores, slightly dirty-blonde light-golden short hair under the cap, a BLUE baseball cap, black wayfarer-style sunglasses, a fitted STEEL-BLUE / navy PADDED SLEEVELESS tactical vest with a raised collar open over a BLACK tank-top undershirt revealing a toned muscular chest and abs, dark black fingerless combat gloves on both hands, loose steel-blue cargo work trousers with large side patch pockets, dark brown leather shoes, one foot forward with one arm crossed across the chest and the other gloved fist raised, mouth open in a loud defiant shout / wild grin, intense wild confident expression, pure white seamless studio background, no cast shadow, candid documentary, 35mm film grain` + 负面提示。

### ② 近景·脸（狂放街头拳王，写实大头）
`extreme close-up portrait of a REAL 30-year-old muscular Caucasian man, a wild defiant open-mouth shout / grin, a BLUE baseball cap and black wayfarer sunglasses across his eyes, tanned skin with realistic pores, slight facial asymmetry, natural window side-light, candid documentary photograph, 35mm film grain, shallow depth of field, NOT airbrushed, NOT a 3d render` + 负面提示。

### ③ 侧脸 / 背影（悬念镜头）
`realistic back view of the same street cop, his steel-blue padded sleeveless vest over a black tank top, the BLUE baseball cap, steel-blue cargo trousers with thigh patch pockets, brown leather shoes, cold cinematic silhouette against a dark urban street at night, moody low-key lighting, film still` + 负面提示。

### ④ 出招·直拳/擒拿重击（纯拳法，无特效）
`a REAL muscular Caucasian street fighter mid straight-jab / grappling combination, his black-gloved fist snapping forward with real motion blur, the power shown through real body rotation and footwork NOT an explosion and NOT a fantasy aura or elemental effect, dark urban street at night, cinematic slow-motion` + 负面提示。

### ⑤ 白底静立（不动基准）
`full body, a REAL 30-year-old muscular Caucasian man standing and facing camera at eye level, all clothing details above (BLUE baseball cap, black sunglasses, steel-blue padded sleeveless vest over black tank top, black fingerless gloves, steel-blue cargo trousers, brown leather shoes), both hands relaxed at his sides, neutral dark studio-like background with soft cinematic key light, no energy effects, photorealistic, wild confident gaze` + 负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**真人写实基准：**
> 摄影级真实抓拍画面：一名 30 岁健美街头拳手（KOF 美式街头拳手·克拉克·斯蒂尔 Clark Still，特库摩 3K 小队队长，特瑞/安迪/拉尔夫 的队长），精壮肌肉（胸/肩/臂明显）、重心下沉，**浅古铜/小麦肤色 + 真实毛孔微汗光泽**。方下颌、**狂放挑衅神情 + 张口呐喊/咧嘴狂笑**，戴**蓝色棒球帽 + 黑色 wayfarer 方框墨镜**，帽下浅金短发外露，着**深藏青/钢蓝 padded 无袖战术马甲（立领、敞开前襟、露黑背心打底 + 精壮胸腹）+ 黑色露指战术手套 + 深藏青 cargo 工装裤（大腿两侧大贴袋）+ 深棕色皮鞋**；**一脚在前 + 一臂横胸 + 另一只戴拳套的手抬起**，张扬狂放。

**出招（拳法，无特效）：**
> 出招是**拳击组合（刺拳/直拳连击、抱摔擒拿）**——黑手套快速前送、身体旋转蓄力，**以真实出拳与脚步表达力量，不做火焰、不做气旋、不做电光、不做玄幻光环**；皮肤与衣物保持真实材质。

---

## 四、一致性锚点 + 颜色铁律

- 锚点（缺一即换人）：**蓝色棒球帽 + 黑 wayfarer 方框墨镜 + 深藏青/钢蓝 padded 无袖战术马甲（立领敞开 + 黑背心打底）+ 黑色露指战术手套 + 深藏青 cargo 工装裤（大腿大口袋）+ 深棕皮鞋 + 呐喊 pose（一臂横胸另一手抬起）+ 浅古铜肤色**，跨镜头保留。
- 颜色铁律：**克拉克·斯蒂尔 = 无元素特效**（纯拳法）；草薙京=红焰 / 八神=紫焰 / 二阶堂=黄白电光 / 椎拳崇=青白气旋 / 麻宫=粉白念动力。**克拉克·斯蒂尔出招务必 `no fire, no elemental effects`，与所有"有特效"角色互不混色；帽子=蓝色（非灰褐）、马甲=深藏青/钢蓝 padded（非棕褐/黑）、打底=黑背心（非白）、手套=黑色露指（非蓝拳套）、工装裤=深藏青（勿漂成浅蓝/军绿）**。

---

## 五、出图登记

> ⚠️ 本角色为 KOF 美式街头拳手（克拉克·斯蒂尔 Clark Still），**无元素特效**（纯拳法/街头格斗，出图务必 `no fire, no elemental effects`）。

- **✅ ImageGen 图生图定稿（2026-10-24，全身白底锁脸基准·纠正版）**：`05_资产库/AI生成图/imagegen/Re_render_this_American_street_2026-10-24T10-54-46.png`
  - 出图法：ImageGen image-to-image，`image1=克拉克斯蒂尔_经典款_参照2.png`（经典款官方画风，藏青马甲+黑手套+蓝工装），`input_fidelity=low`，**帽子改蓝色**。
  - 命中：蓝色棒球帽 / 黑 wayfarer 方框墨镜 / 深藏青 padded 无袖战术马甲（立领敞开 + 黑背心打底露胸腹）/ 黑色露指战术手套（右拳抬起）/ 深藏青 cargo 工装裤（大腿大口袋）/ 深棕皮鞋 / 呐喊 pose / 真人肌肉皮肤。
  - 失分：脸偏浅白人（应为浅古铜小麦色，按④肤色强化重跑）。
  - 右下角带引擎固定"AI生成"水印（要无水印走 Agnes key=`clark`）。
  - 作废：旧"棕褐马甲+白背心+蓝拳套"版 T10-45-10（造型照官方标题图误配）；旧"灰褐鸭舌帽+黑全指手套"版 T10-37-42。
  - 参照：经典款官方画风 `05_资产库/参考图/克拉克斯蒂尔_经典款_参照2.png`（**主参照**，藏青 padded 马甲 + 黑露指手套 + 蓝工装裤 + 呐喊）；官方 KOF 标题图 `05_资产库/参考图/克拉克斯蒂尔_经典款_参照3.png`（配色偏棕褐，仅备用）；呐喊版 `05_资产库/参考图/克拉克斯蒂尔_经典款_参照.png`（备用）。

**Agnes 图生图 · 拟人化 prompt（可直接粘贴，无水印版）**
> Re-render this American street fighter as a REAL 30-year-old muscular Caucasian street cop / street fighter, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature roaring stance (one foot forward, one arm crossed in front of the chest with the other gloved fist raised, mouth open in a loud defiant shout / wild grin) and outfit: a BLUE baseball cap, black wayfarer-style sunglasses, a fitted STEEL-BLUE / navy PADDED SLEEVELESS tactical vest with a raised collar, open front over a BLACK tank-top undershirt revealing a toned muscular chest and abs, dark black fingerless combat gloves on both hands, loose steel-blue work/cargo trousers with side pockets, dark brown leather shoes, tanned sun-bronzed skin with heavy muscle definition and a subtle sheen of sweat, visible pores. The face must be a naturally imperfect real adult male face: slightly dirty-blonde light-golden short hair under the cap, slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no elemental effects. PURE WHITE seamless studio background, no cast shadow, NO text, NO watermark, full body. NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no brown vest, no white tank top, no blue boxing gloves, no grey cap, no face scars, no deformed hands, no extra fingers, no watermark, no text, no letters, no Chinese text, no 8k, consistent facial identity
