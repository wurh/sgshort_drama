# 洛奇·古洛巴 · 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 依据 SNK 官方参照图（KOF 篮球主题格斗家·洛奇·古洛巴 经典款）整理。
> **风格目标：照片级真实感**——像一个真实存在的 28 岁黑人职业篮球运动员被摄影机抓拍，**不是动漫、不是 cosplay、不是游戏渲染**。
> ⚠️ 造型定位：**粉色反戴棒球帽 + 粉/藏青/白拼色连帽卫衣（白帽兜 + 白色胸前面板 + 抽绳）+ 粉篮球短裤（白滚边）+ 双手白护腕 + 紫粉高帮球鞋 + 单手抱橙色篮球**，街头篮球手架式/轻松站姿。
> ⚠️ 出图排除项：官方图底部的"声优：山岸治雄"文字、篮球上的"›"UI 箭头是**图层/水印文字，非角色元素**，prompt 务必写 `NO text, NO letters, NO arrows, NO Japanese text, NO voice-actor captions`。
> 能力色系铁律：**洛奇·古洛巴 = 无元素特效**（篮球主题，纯运动发力，出图务必 `no fire, no elemental effects`；与大门/特瑞/安迪/东丈/哈维·D 同属"无特效"阵营，区别 = 黑人 + 粉色反戴帽 + 粉藏青拼色连帽卫衣 + 粉篮球短裤 + 单手抱篮球）。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 体型 | 28 岁黑人职业篮球运动员，身高偏高、精壮（职业球员体态），重心轻松 |
| 肤色 | **深褐黑人肤色（dark rich brown Black skin）**，带真实毛孔与微汗光泽 |
| 脸型 | 真实黑人成年男性，方下颌、自信放松神情 |
| 眼神 | 自信从容（街头球员气场） |
| 发型 | **粉色反戴棒球帽（帽檐朝后）**，帽下短寸黑发 |
| 头饰 | **粉色棒球帽（反戴，帽檐朝后）** |
| 上衣 | **粉/藏青/白拼色连帽卫衣：粉色袖+藏青胸前块+白色大帽兜+白色胸前面板+抽绳**（hoodie） |
| 下装 | **粉篮球短裤（膝盖处白色滚边）** |
| 手 | **双手白色护腕缠手带（带粉边）** |
| 鞋 | **紫粉色高帮篮球鞋（白底 + 白鞋带）** |
| 标志物 | **单手抱一颗橙色篮球**（篮球主题招牌，实体篮球） |
| 姿势 | **单手垂放抱篮球、另一手自然垂放、街头轻松站姿** |
| 能量 | **无元素特效**（篮球主题纯运动，出图务必 `no fire, no elemental effects`） |
| 气质 | 街头篮球手·自信从容 |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, candid documentary lighting, subtle film grain`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no comic, no manga panel, no illustration, no 3d render, no cgi, no chibi, no cel shading, no plastic skin, no airbrushed skin, no perfect symmetry, no video game model, no video game render, no fantasy glow, no aura, no game character, no fire, no elemental effects, no text, no letters, no arrows, no Japanese text, no watermark, no deformed hands, no extra fingers, no 8k, no studio fashion portrait, consistent facial identity`

### ① 全身·白底参考照（锁脸主基准）
`a REAL Black/African-American man in his late 20s, a tall athletic professional basketball player physique, dark rich brown Black skin with realistic pores and a subtle sheen, a PINK backwards baseball cap (brim facing the back), a color-blocked hoodie in PINK and NAVY with a large WHITE hood and a white chest panel with drawstrings, PINK basketball shorts with a WHITE band at the hems, thick white wrist wraps on both wrists, high-top sneakers in purple-pink with white soles, holding a single ORANGE basketball in one hand at his side, a confident relaxed street-athlete expression, pure white seamless studio background, no cast shadow, NO text, NO letters, NO arrows, NO Japanese text, candid documentary, 35mm film grain` + 负面提示。

### ② 近景·脸（自信街头，写实大头）
`extreme close-up portrait of a REAL Black man in his late 20s, a confident relaxed expression, a PINK backwards baseball cap, dark rich brown Black skin with realistic pores and a subtle sheen, slight facial asymmetry, a few natural skin blemishes, natural window side-light, candid documentary photograph, 35mm film grain, shallow depth of field, NOT airbrushed, NOT a 3d render` + 负面提示。

### ③ 侧脸 / 背影（悬念镜头）
`realistic back view of the same Black basketball fighter, his color-blocked PINK and NAVY hoodie with a large white hood, PINK backwards cap, PINK basketball shorts, an orange basketball tucked in one hand, cold cinematic silhouette against a dark urban court at night, moody low-key lighting, film still` + 负面提示。

### ④ 出招·篮球动作（运球/扣篮，无特效）
`a REAL Black basketball player mid-dribble-and-spin, his white-wrapped hands snapping a glowing-free ORANGE basketball, dramatic motion blur on the ball and his feet, the power shown through real body movement and footwork NOT an explosion and NOT a fantasy aura or elemental effect, dark urban court at night, cinematic slow-motion` + 负面提示。

### ⑤ 白底静立（不动基准）
`full body, a REAL Black/African-American man in his late 20s standing and facing camera at eye level, all clothing details above (pink cap, pink-navy hoodie, pink shorts, white wraps, purple-pink sneakers), holding one orange basketball at his side, neutral dark studio-like background with soft cinematic key light, no energy effects, no text, no arrows, photorealistic, confident relaxed gaze` + 负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**真人写实基准：**
> 摄影级真实抓拍画面：一名 28 岁黑人职业篮球运动员，身高偏高、精壮（职业球员体态）、重心轻松；**深褐黑人肤色、真实毛孔 + 微汗光泽**。**粉色反戴棒球帽（帽檐朝后）**，着**粉/藏青/白拼色连帽卫衣（粉袖 + 藏青胸前块 + 白色大帽兜 + 白色胸前面板 + 抽绳）+ 粉篮球短裤（膝盖白滚边）+ 双手白色护腕缠手带（带粉边）+ 紫粉色高帮篮球鞋（白底白鞋带）**，**右手抱一颗橙色篮球**、左手自然垂放，街头篮球手轻松站姿，自信从容。

**出招（篮球动作，无特效）：**
> 出招是**篮球动作（运球/转身/扣篮）**——白护腕的手快速运球转身、脚步灵活，**以真实身体与脚步动作表达力量，不做火焰、不做气旋、不做电光、不做玄幻光环**；皮肤与衣物保持真实材质。
> ⚠️ 排除项：官方图底部"声优：山岸治雄"文字与篮球上"›"箭头是**图层水印，不是角色元素**，出图 prompt 写死 `NO text, NO letters, NO arrows, NO Japanese text`。

---

## 四、一致性锚点 + 颜色铁律

- 锚点（缺一即换人）：**粉色反戴棒球帽 + 粉/藏青/白拼色连帽卫衣（白帽兜）+ 粉篮球短裤（白滚边）+ 双手白护腕 + 紫粉高帮球鞋 + 橙色篮球 + 深褐黑人肤色 + 街头轻松站姿**，跨镜头保留。
- 颜色铁律：**洛奇·古洛巴 = 无元素特效**（篮球主题纯运动）；草薙京=红焰 / 八神=紫焰 / 二阶堂=黄白电光 / 椎拳崇=青白气旋 / 麻宫=粉白念动力。**洛奇·古洛巴出招务必 `no fire, no elemental effects`，与所有"有特效"角色互不混色。**

---

## 五、出图登记

> ⚠️ 本角色为 KOF 篮球主题格斗家（黑人），**无元素特效**（纯篮球运动，出图务必 `no fire, no elemental effects`）。

- **✅ ImageGen 图生图定稿（2026-10-22，全身白底锁脸基准）**：`05_资产库/AI生成图/imagegen/Re_render_this_basketball_them_2026-10-22T15-24-56.png`
  - 出图法：ImageGen image-to-image，`image1=洛奇古洛巴_经典款_参照.png`，`input_fidelity=low`。
  - 命中：粉色反戴棒球帽 / 粉藏青拼色连帽卫衣（白帽兜+白胸前面板+抽绳）/ 粉篮球短裤（白滚边）/ 双手白护腕 / 紫粉高帮球鞋 / 橙色篮球 / 黑人深肤 / **无 UI 文字（"声优"与"›"已排除）**。
  - 右下角带引擎固定"AI生成"水印（要无水印走 Agnes key=`rocky`）。

**Agnes 图生图 · 拟人化 prompt（可直接粘贴，无水印版）**
> Re-render this basketball-themed fighter as a REAL Black/African-American man in his late 20s, a tall athletic professional basketball player physique, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature pose (holding a single ORANGE basketball in one hand at his side, the other hand relaxed) and outfit: a PINK backwards baseball cap, a color-blocked hoodie in PINK and NAVY with a large WHITE hood and a white chest panel with drawstrings, PINK basketball shorts with a WHITE band at the hems, thick white wrist wraps on both wrists, high-top sneakers in purple-pink with white soles, a confident relaxed street-athlete expression. Dark rich brown Black skin with realistic pores and a subtle sheen. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, a few natural skin blemishes, uneven skin tone, subtle stubble/short beard, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no elemental effects. PURE WHITE seamless studio background, no cast shadow, NO text, NO letters, NO arrows, NO Japanese text, NO voice-actor captions, full body. NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no text, no letters, no arrows, no Japanese text, no watermark, no face scars, no deformed hands, no extra fingers, no 8k, consistent facial identity
