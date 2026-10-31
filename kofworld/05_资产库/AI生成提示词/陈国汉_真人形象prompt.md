# 陈国汉 · 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 依据 SNK 官方参照图（KOF 中国风·"Heavy Chain" 链拳手·赵豹之父 经典款）整理。
> **风格目标：照片级真实感**——像一个真实存在的 40 岁中国大汉被摄影机抓拍，**不是动漫、不是 cosplay、不是游戏渲染**。
> ⚠️ 造型定位：**光头 + 浓密黑络腮胡 + 军橄榄灰作训服 + 缠绕全身粗铁链 + 赤脚**，蹲踞出招（一手握铁链顶、一手护头）。
> ⚠️ 官方图底部 "aigei.com" 是**网站水印，非角色元素**，出图务必 `NO text, NO watermark, NO letters`。
> 能力色系铁律：**陈国汉 = 无元素特效**（纯链拳 Heavy Chain，出图务必 `no fire, no elemental effects`；铁链是实物武器不发光，与大门/特瑞/安迪/东丈/哈维·D/洛奇/拜仁/金家藩同属"无特效"阵营，区别 = 光头黑络腮胡大汉 + 军橄榄灰作训服 + 缠绕全身粗铁链 + 赤脚）。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 体型 | 40 岁大汉，宽肩、粗壮（相扑级/举重级体态），重心极低 |
| 肤色 | 古铜/小麦色（tanned），带真实毛孔、微汗光泽 |
| 脸型 | 真实东亚大汉，方下颌、浓密黑络腮胡覆盖半脸 |
| 眼神 | 凶狠杀气（链拳手"蓄势"眼神） |
| 发型 | **光头（shaved head，非寸头非发胶）** |
| 须发 | **浓密黑络腮胡（thick full black beard，及胸）** |
| 上衣 | **军橄榄灰/深卡其军用作训服（military-style work jacket + 同色长裤）** |
| 标志物 | **缠绕全身粗铁链（heavy iron chain wrapped around torso / 挂双肩，实物武器不发光）** |
| 手 | 一手握铁链顶、另一手护头（蹲踞蓄势） |
| 脚 | **赤脚（barefoot）** |
| 姿势 | **蹲踞出招（low crouch，一手握链顶 + 一手护头）** |
| 能量 | **无元素特效**（纯链拳，出图务必 `no fire, no elemental effects`；铁链是实物武器） |
| 气质 | 凶悍嗜战、压迫感极强的重装链拳手 |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, candid documentary lighting, subtle film grain`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no comic, no manga panel, no illustration, no 3d render, no cgi, no chibi, no cel shading, no plastic skin, no airbrushed skin, no perfect symmetry, no video game model, no video game render, no fantasy glow, no aura, no game character, no fire, no elemental effects, no text, no watermark, no deformed hands, no extra fingers, no 8k, no studio fashion portrait, consistent facial identity`

### ① 全身·白底参考照（锁脸主基准）
`a REAL large broad-shouldered bald East Asian man in his 40s with a heavy sumo-like / strongman build, tanned sun-bronzed skin with realistic pores, a thick full BLACK beard covering the lower half of his face, a military olive-grey work jacket and matching dark trousers, a heavy IRON CHAIN wrapped around his torso and hanging across his shoulders (a real metal weapon, NOT glowing), barefoot, one hand gripping the top of the chain and the other hand held to his head in a low crouching ready stance, an intense fierce expression, pure white seamless studio background, no cast shadow, NO text, NO watermark, NO letters, candid documentary, 35mm film grain` + 负面提示。

### ② 近景·脸（凶悍大汉，写实大头）
`extreme close-up portrait of a REAL large bald East Asian man in his 40s, a fierce expression, a thick full black beard, tanned sun-bronzed skin with realistic pores and a subtle sheen, slight facial asymmetry, a few natural skin blemishes, natural window side-light, candid documentary photograph, 35mm film grain, shallow depth of field, NOT airbrushed, NOT a 3d render` + 负面提示。

### ③ 侧脸 / 背影（链拳宗师·悬念镜头）
`realistic back view of the same bald chain fighter, his heavy IRON CHAIN draped across his shoulders and wrapping around his back, military olive-grey work jacket, crouched low, cold cinematic silhouette against a dark industrial arena at night, moody low-key lighting, film still, NO text, NO watermark` + 负面提示。

### ④ 出招·链拳重击（纯武器，无特效）
`a REAL bald East Asian man mid-swing with a heavy IRON CHAIN wrapped around his body, the chain whipping through the air with a real metallic motion blur, his body twisting with the strike, the power shown through real body rotation NOT an explosion and NOT a fantasy aura or elemental effect, the chain is a real metal weapon NOT glowing, dark industrial arena at night, cinematic slow-motion` + 负面提示。

### ⑤ 白底静立（不动基准）
`full body, a REAL large bald East Asian man in his 40s with a thick black beard standing and facing camera at eye level, all clothing details above (military olive-grey work jacket, heavy iron chain, barefoot), both hands at his sides, neutral dark studio-like background with soft cinematic key light, no energy effects, photorealistic, fierce gaze, NO text, NO watermark` + 负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**真人写实基准：**
> 摄影级真实抓拍画面：一名 40 岁中国大汉（KOF 中国风·链拳手 "Heavy Chain"，赵豹之父），宽肩粗壮（相扑级/举重级体态）、重心极低，**古铜/小麦色肤色 + 真实毛孔微汗光泽**。**光头 + 浓密黑络腮胡（覆盖半脸）**，着**军橄榄灰/深卡其军用作训服 + 同色长裤**，**缠绕全身粗铁链（挂双肩，实物武器不发光）**，**赤脚**；**蹲踞出招（一手握铁链顶 + 一手护头蓄势）**，凶悍嗜战、压迫感极强。

**出招（链拳，无特效）：**
> 出招是**链拳（Heavy Chain 铁链重击）**——盘绕身体粗铁链快速挥舞、身体旋转蓄力，**以真实出招与身体动作表达力量，铁链是实物金属武器不发光，不做火焰、不做气旋、不做电光、不做玄幻光环**；皮肤与衣物保持真实材质。
> ⚠️ 排除项：官方图底部 "aigei.com" 是网站水印，非角色元素，出图 prompt 写死 `NO text, NO watermark, NO letters`。

---

## 四、一致性锚点 + 颜色铁律

- 锚点（缺一即换人）：**光头 + 浓密黑络腮胡 + 军橄榄灰作训服 + 缠绕全身粗铁链（挂双肩）+ 赤脚 + 蹲踞出招姿态 + 古铜肤色 + 凶悍气质**，跨镜头保留。
- 颜色铁律：**陈国汉 = 无元素特效**（纯链拳 Heavy Chain）；草薙京=红焰 / 八神=紫焰 / 二阶堂=黄白电光 / 椎拳崇=青白气旋 / 麻宫=粉白念动力。**陈国汉出招务必 `no fire, no elemental effects`，铁链是实物武器不发光；与所有"有特效"角色互不混色。**

---

## 五、出图登记

> ⚠️ 本角色为 KOF 中国风链拳手（"Heavy Chain"，赵豹之父），**无元素特效**（纯链拳，出图务必 `no fire, no elemental effects`；铁链=实物武器不发光）。

- **✅ ImageGen 图生图定稿（2026-10-22，全身白底锁脸基准）**：`05_资产库/AI生成图/imagegen/Re_render_this_Chinese_heavy_c_2026-10-22T15-45-46.png`
  - 出图法：ImageGen image-to-image，`image1=陈国汉_经典款_参照.png`，`input_fidelity=low`。
  - 命中：光头 / 浓密黑络腮胡 / 军橄榄灰作训服（长裤）/ 缠绕全身粗铁链（挂双肩）/ 赤脚 / 蹲踞出招（一手握链顶 + 一手护头）/ 古铜真人皮肤 / **已排除 "aigei.com" 水印**。
  - 右下角带引擎固定"AI生成"水印（要无水印走 Agnes key=`guohan`）。

**Agnes 图生图 · 拟人化 prompt（可直接粘贴，无水印版）**
> Re-render this Chinese heavy-chain fighter as a REAL large, broad-shouldered, bald East Asian man in his 40s with a heavy build and a thick black beard, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature low crouching pose (one hand gripping the top of a heavy iron chain that loops across his chest and shoulders, the other hand held to his head) and outfit: a bald head, a thick full black beard, an olive-grey / dark khaki military-style work jacket and matching dark trousers, a heavy IRON CHAIN wrapped around his torso and hanging across his shoulders (a real metal weapon, not glowing), barefoot, an intense fierce expression. Tanned sun-bronzed skin with visible pores and a subtle sheen. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, a few natural skin blemishes, uneven skin tone, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no elemental effects. PURE WHITE seamless studio background, no cast shadow, NO text, NO watermark, NO letters, full body. NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no face scars, no deformed hands, no extra fingers, no watermark, no text, no letters, no 8k, consistent facial identity
