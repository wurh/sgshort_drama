# 哈迪伦 · 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 依据 SNK 官方参照图（KOF 军装格斗家·哈迪伦 Hadren 经典款）整理。
> **风格目标：照片级真实感**——像一个真实存在的 35 岁军人格斗家被摄影机抓拍，**不是动漫、不是 cosplay、不是游戏渲染**。
> ⚠️ 造型定位（按官方参照图纠正 2026-10-24 二次）：**蓝色军帽 + 右眼黑色皮眼罩（EYEPATCH，非墨镜）+ 蓝色军装制服（长袖金扣）+ 红橙色护肩/肩章 + 金扣腰带 + 黑战术手套 + 蓝色军裤 + 黑高帮皮靴**，右手抬起握拳（fingers curled）+ 左手垂放。
> ⚠️ 二次纠正点：**右眼是黑色皮眼罩（EYEPATCH 皮套，不是黑墨镜/黑方框太阳镜）**；军装**蓝色系**（**非深绿/橄榄绿**）；护肩**红橙色**（**非纯红色**）。
> ⚠️ 出图排除项：官方图两侧黄色三角箭头（UI 导航）、浅蓝底属图层元素，非角色，prompt 写 `NO text, NO arrows, NO watermark`。
> 能力色系铁律：**哈迪伦 = 无元素特效**（纯军装格斗/摔技，出图务必 `no fire, no elemental effects`；与大门/特瑞/安迪/东丈/哈维·D/洛奇/拜仁/金家藩/陈国汉/蔡宝健同属"无特效"阵营，区别 = 蓝军帽 + 右眼黑眼罩 + 蓝军装制服 + 红橙色护肩 + 黑高帮皮靴）。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 体型 | 35 岁精壮亚洲男，军装格斗家，精瘦肌肉、纪律化体态，重心下沉 |
| 肤色 | 浅古铜/小麦亚洲肤色，带真实毛孔 |
| 脸型 | 真实东亚成年男，方下颌、冷峻军容 |
| 眼神 | **右眼戴黑色皮眼罩（EYEPATCH，皮套），左眼冷冽杀气**（非墨镜） |
| 发型/帽 | **蓝色军帽（peaked cap），帽顶蓝色 + 蓝色帽带 + 金属徽（实体织印，非发光）** |
| 头饰 | **黑色皮眼罩（leather EYEPATCH 皮套，右眼覆盖）—— 非墨镜** |
| 上衣 | **蓝色军装制服（长袖、金扣、修身剪裁）+ 右肩红橙色护肩/肩章（RED-ORANGE shoulder epaulet）+ 红色橙色胸前拼块** |
| 腰带 | **黑色皮质战术腰带 + 金属/金色带扣** |
| 内搭 | **黑色内衬背心/打底（领口露出）** |
| 手 | **黑色全指战术手套（combat gloves）** |
| 下装 | **蓝色军裤（long military trousers，与上衣同色）** |
| 鞋 | **黑色高帮皮靴（service boots）** |
| 姿势 | **右手抬起握拳（fingers curled）+ 左手垂放（military guard）** |
| 能量 | **无元素特效**（纯军装格斗/摔技，出图务必 `no fire, no elemental effects`） |
| 气质 | 冷峻纪律、杀气内敛的军人格斗家（独眼眼罩 = 老兵印记） |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, candid documentary lighting, subtle film grain`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no comic, no manga panel, no illustration, no 3d render, no cgi, no chibi, no cel shading, no plastic skin, no airbrushed skin, no perfect symmetry, no video game model, no video game render, no fantasy glow, no aura, no game character, no fire, no elemental effects, no sunglasses, no green uniform, no text, no arrows, no watermark, no deformed hands, no extra fingers, no 8k, no studio fashion portrait, consistent facial identity`

### ① 全身·白底参考照（锁脸主基准）
`a REAL 35-year-old East Asian man, lean and highly muscular with a disciplined military physique, tanned realistic East Asian skin with visible pores, a square jaw with a cold stern military expression, a BLUE military peaked cap with a small crest on the front, a black leather EYEPATCH over his RIGHT eye (NOT sunglasses, just one eye covered), a fitted long-sleeved BLUE military / utility jacket with a small gold button and a RED-ORANGE padded shoulder EPaulet on the right shoulder and a red-orange panel on the chest, a black inner undershirt, a black leather belt with a gold buckle, matching BLUE military trousers, tall black leather service boots, black full-finger combat gloves, one hand raised with fingers curled and the other relaxed at his side in a military guard, pure white seamless studio background, no cast shadow, NO text, NO arrows, candid documentary, 35mm film grain` + 负面提示。

### ② 近景·脸（右眼眼罩，写实大头）
`extreme close-up portrait of a REAL 35-year-old East Asian man, a cold stern military expression, a BLUE military peaked cap with a small crest, a black leather EYEPATCH over his RIGHT eye (NOT sunglasses, just a leather strap across the face with a single eye covered), the visible LEFT eye cold and sharp, tanned East Asian skin with realistic pores, slight facial asymmetry, natural window side-light, candid documentary photograph, 35mm film grain, shallow depth of field, NOT airbrushed, NOT a 3d render` + 负面提示。

### ③ 侧脸 / 背影（军装宗师·悬念镜头）
`realistic back view of the same military fighter, his BLUE military dress uniform jacket with a RED-ORANGE shoulder epaulet, matching blue trousers, black service boots, one hand raised with fingers curled, cold cinematic silhouette against a dark barracks hall at night, moody low-key lighting, film still, NO text, NO arrows` + 负面提示。

### ④ 出招·军装格斗（摔技/军礼格挡，无特效）
`a REAL 35-year-old East Asian man mid military-grip takedown, his gloved hand snapping forward with real motion blur, one hand raised with fingers curled, the power shown through real body rotation and stance NOT an explosion and NOT a fantasy aura or elemental effect, dark barracks hall at night, cinematic slow-motion` + 负面提示。

### ⑤ 白底静立（不动基准）
`full body, a REAL 35-year-old East Asian man standing at attention and facing camera at eye level, all clothing details above (BLUE military cap with crest, black leather eyepatch over the right eye, BLUE uniform jacket with RED-ORANGE epaulet, blue trousers, black gloves, black service boots), both hands at his sides, neutral dark studio-like background with soft cinematic key light, no energy effects, NO text, NO arrows, photorealistic, stern military gaze` + 负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**真人写实基准：**
> 摄影级真实抓拍画面：一名 35 岁军人格斗家（KOF 军装系·哈迪伦 Hadren），精壮、纪律化体态、重心下沉，**浅古铜/小麦亚洲肤色 + 真实毛孔**。方下颌、**冷峻军容**，戴**蓝色军帽（金属徽）+ 右眼黑色皮眼罩（EYEPATCH 皮套，非墨镜）**，着**蓝色军装制服（长袖金扣、修身剪裁）+ 右肩红橙色护肩/肩章 + 胸前红橙色拼块 + 黑色内衬打底 + 黑色皮质战术腰带（金扣）+ 黑全指战术手套 + 蓝色军裤 + 黑色高帮皮靴**；**右手抬起握拳（fingers curled）+ 左手垂放**的军礼格挡姿势，冷峻纪律、独眼老兵印记。

**出招（军装格斗/摔技，无特效）：**
> 出招是**军装格斗/摔技（军礼格挡 + 快速扣腕摔）**——黑战术手套快速前送、身体旋转蓄力，**以真实出招与脚步表达力量，不做火焰、不做气旋、不做电光、不做玄幻光环**；皮肤与军装保持真实材质。

---

## 四、一致性锚点 + 颜色铁律

- 锚点（缺一即换人）：**蓝色军帽（金属徽）+ 右眼黑色皮眼罩（EYEPATCH 皮套，非墨镜）+ 蓝色军装制服（金扣）+ 右肩红橙色护肩/肩章 + 胸前红橙色拼块 + 黑色内衬打底 + 黑色战术腰带（金扣）+ 黑全指战术手套 + 蓝色军裤 + 黑高帮皮靴 + 右手握拳 + 左手垂放的军礼格挡姿势 + 冷峻军容 + 独眼老兵印记**，跨镜头保留。
- 颜色铁律：**哈迪伦 = 无元素特效**（纯军装格斗/摔技）；草薙京=红焰 / 八神=紫焰 / 二阶堂=黄白电光 / 椎拳崇=青白气旋 / 麻宫=粉白念动力。**哈迪伦出招务必 `no fire, no elemental effects`，军装=蓝色系（非深绿/橄榄绿），护肩=红橙色（非纯红），右眼=黑皮眼罩（非黑墨镜）；与所有"有特效"角色互不混色。**

---

## 五、出图登记

> ⚠️ 本角色为 KOF 军装格斗家（哈迪伦 / Hadren），**无元素特效**（纯军装格斗/摔技，出图务必 `no fire, no elemental effects`；**右眼黑色皮眼罩非墨镜 + 蓝色军装非深绿 + 红橙色护肩非纯红**）。

- **✅ ImageGen 图生图定稿（2026-10-24 二次纠正·眼罩+蓝军装版，全身白底锁脸基准）**：`05_资产库/AI生成图/imagegen/Re_render_this_military_style__2026-10-24T08-14-07.png`
  - 出图法：ImageGen image-to-image，`image1=哈迪伦_经典款_参照.png`（新官方眼罩+蓝军装图，已覆盖归档），`input_fidelity=low`。
  - 命中：蓝色军帽（金属徽）/ 右眼黑色皮眼罩（EYEPATCH）/ 蓝色军装制服（金扣）/ 右肩红橙色护肩 / 胸前红橙色拼块 / 黑色内衬打底 / 黑色战术腰带（金扣）/ 黑全指战术手套 / 蓝色军裤 / 黑高帮皮靴 / 右手握拳+左手垂放的军礼格挡姿势。
  - 小失分：脸偏浅白人，官方为浅古铜/小麦肤色——调法：prompt 肤色句强化 `a tanned sun-bronzed East Asian skin tone (NOT pale, NOT white)` 重跑。
  - 旧"黑墨镜 + 深绿/橄榄绿军装"版定稿 `.../Re_render_this_military_style__2026-10-24T08-06-53.png` 作废（眼罩误判成墨镜、军装色误判成深绿，被本眼罩+蓝军装版取代）。
  - 右下角带引擎固定"AI生成"水印（要无水印走 Agnes key=`hadren`）。

**Agnes 图生图 · 拟人化 prompt（可直接粘贴，无水印版）**
> Re-render this military-style fighter as a REAL 35-year-old East Asian man, lean and highly muscular with a disciplined military physique, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature stance (right hand raised with fingers curled, left hand at his side) and outfit: a BLUE military peaked cap with a small crest on the front, a black leather EYEPATCH over his RIGHT eye (NOT sunglasses, just one eye covered), a fitted long-sleeved BLUE military / utility jacket with a small gold button and a RED-ORANGE padded shoulder patch on the right shoulder and a red-orange panel on the chest, a black inner undershirt, a black leather belt with a gold buckle, matching BLUE military trousers, tall black service boots, black full-finger combat gloves, an intense focused stern expression. Tanned sun-bronzed East Asian skin with visible pores. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no elemental effects. PURE WHITE seamless studio background, no cast shadow, NO text, NO arrows, NO watermark, full body. NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no sunglasses, no green uniform, no pale white skin, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity
