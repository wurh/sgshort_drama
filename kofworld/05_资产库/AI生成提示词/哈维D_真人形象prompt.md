# 哈维·D · 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 依据 SNK 官方参照图（KOF 美式拳击手 "The Real McCoy" 经典款）整理。
> **风格目标：照片级真实感**——像一个真实存在的 30 岁黑人职业拳击手被摄影机抓拍，**不是动漫、不是 cosplay、不是游戏渲染**。
> ⚠️ 造型定位：**顶髻莫西干（两侧剃光、头顶高耸竖立）+ 黑墨镜 + 敞开黑红白条纹棒球夹克（露精壮胸腹）+ 黑拳击短裤（膝盖白滚边）+ 白露指拳套 + 黑高帮靴**，拳击架式（双拳护颌）。
> 能力色系铁律：**哈维·D = 无元素特效**（纯拳击，出图务必 `no fire, no elemental effects`；与大门/特瑞/安迪/东丈同属"无特效"阵营，区别 = 黑人 + 顶髻莫西干 + 黑墨镜 + 黑红白条纹夹克敞开露胸腹）。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 体型 | 30 岁黑人职业拳击手，身高偏高、精壮肌肉（胸/腹肌明显），重心下沉 |
| 肤色 | **深褐黑人肤色（dark rich brown Black skin）**，带真实毛孔与微汗光泽 |
| 脸型 | 真实黑人成年男性，方下颌、冷峻专注神情 |
| 眼神 | 冷冽锐利（黑墨镜遮住，但透出专注杀气） |
| 发型 | **顶髻莫西干 / moppy high-top（两侧剃光、头顶高耸竖立一簇黑发）**（标志性，非平头非寸头） |
| 头饰 | **黑色方框墨镜**（实体戴于脸上） |
| 外套 | **敞开（不扣）的黑色棒球/varsity 夹克，领口/袖口/下摆带红白条纹滚边**，露出精壮胸腹 |
| 下装 | **黑拳击短裤，膝盖处白色滚边** |
| 手 | **白露指拳击手套 + 白色护腕缠手带** |
| 鞋 | **黑色高帮拳击靴（白滚边）** |
| 姿势 | **拳击架式（双拳护颌上提、前后脚马步）** |
| 能量 | **无元素特效**（纯拳击，出图务必 `no fire, no elemental effects`） |
| 气质 | 冷酷霸气、街头职业拳手气场 |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, candid documentary lighting, subtle film grain`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no comic, no manga panel, no illustration, no 3d render, no cgi, no chibi, no cel shading, no plastic skin, no airbrushed skin, no perfect symmetry, no video game model, no video game render, no fantasy glow, no aura, no game character, no fire, no elemental effects, no deformed hands, no extra fingers, no watermark, no text, no 8k, no studio fashion portrait, consistent facial identity`

### ① 全身·白底参考照（锁脸主基准）
`a REAL Black/African-American man in his 30s, a tall lean heavily-muscled professional boxer, dark rich brown Black skin with realistic pores and a subtle sheen, a tall high MOPPYCORN / mohawk hairstyle (sides shaved, a high vertical crest of black hair on top), black sunglasses, an OPEN black varsity/letterman jacket with RED and WHITE stripe trim on the collar, cuffs and hem (unbuttoned, revealing a bare well-defined chest and abs), black boxing shorts with a WHITE band at the hems, white fingerless boxing gloves with white wrist wraps, tall black high-top boxing boots, both fists raised at guard in a boxer's stance, an intense focused expression, pure white seamless studio background, no cast shadow, candid documentary, 35mm film grain` + 负面提示。

### ② 近景·脸（冷峻墨镜，写实大头）
`extreme close-up portrait of a REAL Black man in his 30s, a cold focused expression, black square sunglasses, a tall high mohawk (moppy crown), dark rich brown Black skin with realistic pores and a subtle sheen, slight facial asymmetry, natural window side-light, candid documentary photograph, 35mm film grain, shallow depth of field, NOT airbrushed, NOT a 3d render` + 负面提示。

### ③ 侧脸 / 背影（悬念镜头）
`realistic back view of the same Black boxer, his OPEN black varsity jacket with red-white stripe trim over bare shoulders, a tall high mohawk crest on top, black boxing shorts with white hem bands, fists at guard, cold cinematic silhouette against a dark gym ring at night, moody low-key lighting, film still` + 负面提示。

### ④ 出招·拳击重击（纯拳法，无特效）
`a REAL Black professional boxer mid-jab-cross combination, his white-gloved fists snapping forward in a fast punch, dramatic motion blur, the power shown through real body rotation and footwork NOT an explosion and NOT a fantasy aura or elemental effect, dark boxing ring at night, cinematic slow-motion` + 负面提示。

### ⑤ 白底静立（不动基准）
`full body, a REAL Black/African-American man in his 30s standing and facing camera at eye level, all clothing details above (open varsity jacket, black shorts, white gloves), both hands relaxed at his sides, neutral dark studio-like background with soft cinematic key light, no energy effects, photorealistic, cold focused gaze` + 负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**真人写实基准：**
> 摄影级真实抓拍画面：一名 30 岁黑人职业拳击手，身高偏高、精壮肌肉（胸腹明显）、重心下沉；**深褐黑人肤色、真实毛孔 + 微汗光泽**。**顶髻莫西干（两侧剃光、头顶高耸一簇）+ 黑色方框墨镜**，着**敞开（不扣）黑棒球夹克（领口/袖口/下摆红白条纹滚边，露精壮胸腹）+ 黑拳击短裤（膝盖白滚边）+ 白露指拳击手套（白护腕）+ 黑色高帮拳击靴（白滚边）**；**双拳护颌上提、前后脚马步**的拳击架式，冷峻杀气眼神。

**出招（拳击，无特效）：**
> 出招是**拳击组合（刺拳/直拳连击）**——白拳套快速前送、身体旋转蓄力，**以真实出拳与脚步表达力量，不做火焰、不做气旋、不做电光、不做玄幻光环**；皮肤与衣物保持真实材质。

---

## 四、一致性锚点 + 颜色铁律

- 锚点（缺一即换人）：**顶髻莫西干（两侧剃光头顶高耸）+ 黑墨镜 + 敞开黑棒球夹克（红白条纹滚边）+ 黑拳击短裤（膝盖白滚边）+ 白露指拳套 + 黑高帮靴 + 深褐黑人肤色 + 拳击架式**，跨镜头保留。
- 颜色铁律：**哈维·D = 无元素特效**（纯拳击）；草薙京=红焰 / 八神=紫焰 / 二阶堂=黄白电光 / 椎拳崇=青白气旋 / 麻宫=粉白念动力。**哈维·D 出招务必 `no fire, no elemental effects`，与所有"有特效"角色互不混色。**

---

## 五、出图登记

> ⚠️ 本角色为 KOF 美式拳击手（黑人），**无元素特效**（纯拳击，出图务必 `no fire, no elemental effects`）。

- **✅ ImageGen 图生图定稿（2026-10-22，全身白底锁脸基准）**：`05_资产库/AI生成图/imagegen/Re_render_this_boxer_as_a_REAL_2026-10-22T15-09-10.png`
  - 出图法：ImageGen image-to-image，`image1=哈维D_经典款_参照.png`，`input_fidelity=low`。
  - 命中：顶髻莫西干 / 黑墨镜 / 敞开黑红白条纹棒球夹克（露胸腹）/ 黑拳击短裤（膝盖白滚边）/ 白露指拳套 / 黑高帮靴 / 拳击架式 / 深褐黑人皮肤。
  - 右下角带引擎固定"AI生成"水印（要无水印走 Agnes key=`harveyD`）。

**Agnes 图生图 · 拟人化 prompt（可直接粘贴，无水印版）**
> Re-render this boxer as a REAL Black/African-American man in his 30s, a tall lean heavily-muscled professional boxer, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature boxer's stance (fists up at guard) and outfit: a tall high MOPPYCORN / mohawk hairstyle (sides shaved, a high vertical crest of black hair on top), black sunglasses, an OPEN black varsity/letterman jacket with RED and WHITE stripe trim on the collar, cuffs and hem (worn open, unbuttoned, revealing a bare well-defined chest and abs), black boxing shorts with a WHITE band at the hems, white fingerless boxing gloves with white wrist wraps, tall black high-top boxing boots, an intense focused expression. Dark rich brown Black skin with realistic pores and a subtle sheen. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, a few natural skin blemishes, uneven skin tone, subtle stubble/short beard, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no elemental effects. Pure white seamless studio background, no cast shadow, full body. NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity
