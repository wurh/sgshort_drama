# 椎拳崇 · 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 依据 SNK 官方参照图（本角色定稿造型，非旧版"蓝发紫道服护目镜"设定）整理。
> **风格目标：照片级真实感**——像一个真实存在的 20 岁日本青年男运动员被摄影机抓拍，**不是动漫、不是 cosplay、不是游戏渲染**。
> ⚠️ 设定更正（按官方参照图 2026-10-18 二次纠正）：本造型 = **棕色中短发（中分、两侧较短、顶部微乱垂到额/后颈）+ 蓝色牛仔风开襟短外套（金色按扣）+ 白色连帽卫衣内搭 + 蓝色运动短裤 + 深蓝护膝 + 灰蓝运动鞋 + 右手缠白绷拳举过头 + 左手张开前伸**。核心配色 = **蓝色系（外套+短裤同蓝）+ 棕色中短发**，非"白外套黑袖/深灰短裤/垂肩长发"。
> 能力色系铁律：**椎拳崇 = 青白色气旋（龙拳/气功）**，出招是青白气流旋、体积光、非爆炸；区别于草薙京红焰、八神紫焰、二阶堂黄白电光。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 体型 | 175cm 精壮匀称，柔道/拳击手型体态，重心轻、跳跃前倾 |
| 肤色 | 浅白人/亚洲暖白肤色，带真实毛孔、健康光泽 |
| 脸型 | 真实日本男青年，圆润鹅蛋脸、**温和带斗志的笑** |
| 眼神 | 温和而专注的黑/深褐眼 |
| 发型 | **棕色中短发（中分、两侧较短、顶部微乱垂到额/后颈，非垂肩长发、非蓝发、无护目镜）** |
| 外套 | **蓝色牛仔风开襟短外套（金色按扣、敞穿、短款收腰）** + 内搭**白色连帽卫衣** |
| 腰带 | （无红色斜跨带，本版为白色连帽卫衣 + 蓝牛仔外套） |
| 下装 | **蓝色运动短裤（与外套同蓝） + 深蓝护膝** |
| 鞋 | **灰蓝色运动鞋 + 深色袜** |
| 姿势 | **右手缠白色拳套举过头顶、左手张开前伸、马步前倾**（招牌出招势） |
| 能量 | **青白色气旋/气流**（龙拳/气功，体积光、非爆炸非玄幻光环） |
| 气质 | 表面温和憨直、实则气功深厚，带点不羁 |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, candid documentary lighting, subtle film grain`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no comic, no manga panel, no illustration, no 3d render, no cgi, no chibi, no cel shading, no plastic skin, no airbrushed skin, no perfect symmetry, no video game model, no video game render, no fantasy glow, no aura, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, no studio fashion portrait, consistent facial identity`

### ① 全身·白底参考照（锁脸主基准）
`a REAL 20-year-old East Asian young man, 175cm lean well-proportioned athletic build, light warm-toned skin with realistic pores, a round friendly face with a confident focused gaze, warm brown eyes, medium-length BROWN hair in a CENTER part, shorter on the sides with slightly messy loose strands hanging to the forehead and nape (NOT long-to-shoulders, NOT blue, NO goggles), a bright BLUE denim-style open cropped jacket with gold snap buttons over a WHITE hooded sweatshirt, matching bright BLUE athletic shorts, dark navy knee guards, grey-blue sneakers, the right fist wrapped in a white bandage raised overhead and the left arm extended forward with an open hand in a stable low crouch, realistic fabric and skin, pure white seamless studio background, no cast shadow, candid documentary, 35mm film grain` + 负面提示。

### ② 近景·脸（温和/斗志，写实大头）
`extreme close-up portrait of a REAL 20-year-old East Asian man, a gentle confident grin, a round friendly face, warm dark-brown eyes, medium-length straight brown hair with side-swept bangs, realistic skin texture with pores, slight facial asymmetry and a few natural skin blemishes, natural window side-light, candid documentary photograph, 35mm film grain, shallow depth of field, NOT airbrushed, NOT a 3d render` + 负面提示。

### ③ 侧脸 / 背影（悬念镜头）
`realistic side profile and back view of the same young East Asian man, the back of his open white jacket with black short sleeves, medium-length brown hair falling to the shoulders, a RED diagonal sash, a faint swirl of pale-blue ki-glow along his back, cold cinematic silhouette against a dark empty dojang at night, moody low-key lighting, film still` + 负面提示。

### ④ 出招·龙拳气旋（青白气旋，非爆炸）
`a REAL young East Asian man mid-spinning kick, a swirling VORTEX of pale-blue and white wind/ki energy spiraling around his body, streaks of glowing wind-trail, dramatic motion blur, realistic skin and fabric, the energy is volumetric wind-glow NOT an explosion and NOT a fantasy aura, dark arena at night, cinematic slow-motion` + 负面提示。

### ⑤ 白底静立（不动基准）
`full body, a REAL 20-year-old East Asian man standing still and facing camera at eye level, all clothing details above, both hands empty and relaxed at his sides, neutral dark studio-like background with soft cinematic key light, no energy effects, photorealistic, calm confident gaze` + 负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**真人写实基准：**
> 摄影级真实抓拍画面：一名 20 岁日本男青年，175cm 精壮匀称、柔道/拳击手型体态、重心轻；**浅亚洲暖白肤色、皮肤有真实毛孔**。圆润鹅蛋脸、**温和带斗志的笑**、深褐眼；**棕色中长直发垂到肩（侧分刘海、微乱，无护目镜、非蓝发）**。着**白色开襟短外套（袖子为黑色短袖、敞穿）+ 白色无袖内搭**、**红色斜跨带（斜过胸前）**、**深灰蓝运动短裤 + 黑色护膝**、**灰蓝色运动鞋 + 黑袜**；**双手向两侧张开、掌心朝外、轻盈跳跃/前倾**（招牌"摊手"势）。

**出招（龙拳气旋）：**
> 出招是**青白色气旋/气流**——回旋腿法、身体卷起青白气流旋，拖出发光风痕；**体积光表达、不做实拍爆炸、不做玄幻光环**；皮肤与衣物保持真实材质。

---

## 四、一致性锚点 + 颜色铁律

- 锚点（缺一即换人）：**棕色中长直发（垂肩，无护目镜） + 白色开襟黑袖外套 + 白无袖内搭 + 红色斜跨带 + 深蓝短裤黑护膝 + 双手张开掌心朝外**，跨镜头保留。
- 颜色铁律：椎拳崇=**青白气旋**（龙拳/气功）；草薙京=红焰 / 八神=紫焰 / 二阶堂=黄白电光。**四者互不混色；青白气旋不是火焰、不是电光。**

---

## 五、出图登记

> ⚠️ 本角色旧设定（蓝发 + 紫道服 + 护目镜）已作废，全部按本官方参照图纠正。

- **✅ ImageGen 图生图定稿（2026-10-18 二次纠正·蓝色系，全身白底锁脸基准）**：`05_资产库/AI生成图/imagegen/Re_render_this_martial_arts_fi_2026-10-18T16-02-25.png`
  - 出图法：ImageGen image-to-image，`image1=椎拳崇_经典款_参照.jpg`（新官方蓝牛仔图，已覆盖归档），`input_fidelity=low`。
  - 命中：棕色中分短发（两侧较短、顶部微乱）/ 蓝色牛仔开襟短外套（金按扣）/ 白连帽卫衣内搭 / 蓝色运动短裤（与外套同蓝）/ 深蓝护膝 / 灰蓝运动鞋 / 右手缠白绷拳举过头 + 左手张开前伸 / 真人皮肤。
  - 旧"白外套黑袖+深灰短裤"版定稿 `...T15-48-57.png` 作废（配色不符，被本蓝色系版取代）。
  - 右下角带引擎固定"AI生成"水印（要无水印走 Agnes key=`kunkuragi`）。

**Agnes 图生图 · 拟人化 prompt（可直接粘贴，无水印版）**
> Re-render this martial-arts fighter as a REAL 20-year-old East Asian man, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature pose (right fist wrapped in white bandage raised overhead, left arm extended forward with open hand) and outfit: medium-length BROWN hair in a CENTER part, shorter on the sides with slightly messy loose strands hanging to the forehead and nape (NOT long-to-shoulders, NOT blue, NO goggles), a bright BLUE denim-style open cropped jacket with gold snap buttons over a WHITE hooded sweatshirt, matching bright BLUE athletic shorts, dark navy knee guards, grey-blue sneakers, white hand wraps, a confident focused expression. Light-tanned East Asian skin with realistic pores. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no elemental effects. Pure white seamless studio background, no cast shadow, full body. NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no goggles, no purple gi, no white jacket, no grey shorts, no long hair to the shoulders, no elemental effects, no fire, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity
