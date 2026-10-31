# 金家藩 · 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 依据 SNK 官方参照图（KOF 中国风·金家藩 "Kick Master" 经典款）整理。
> **风格目标：照片级真实感**——像一个真实存在的 28 岁中国武运动员被摄影机抓拍，**不是动漫、不是 cosplay、不是游戏渲染**。
> ⚠️ 造型定位：**深棕短发 + 米白 V 领无袖道服（藏青滚边 + 藏青胸前双扣）+ 黑腰带 + 藏青护腕 + 米白宽松道裤 + 藏青草履（赤脚穿）+ 双手叉腰站姿**。
> 能力色系铁律：**金家藩 = 无元素特效**（纯腿法/音速踢 Sonic Break，出图务必 `no fire, no elemental effects`；与大门/特瑞/安迪/东丈/哈维·D/洛奇/拜仁同属"无特效"阵营，区别 = 深棕短发 + 米白 V 领无袖道服藏青滚边 + 藏青草履赤脚）。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 体型 | 28 岁精壮亚洲男，柔道/腿法手型体态，精瘦肌肉线条 |
| 肤色 | 浅亚洲暖白肤色，带真实毛孔、健康光泽 |
| 脸型 | 真实东亚男青年，方下颌、冷静专注神情 |
| 眼神 | 沉静锐利（腿法手"蓄势"眼神） |
| 发型 | **深棕色短发（微乱、侧分刘海）**（非黑寸非金发） |
| 上衣 | **米白 V 领无袖道服（kimono-style sleeveless top），藏青滚边（领口/前襟），胸前两枚藏青矩形扣** |
| 腰带 | **黑色布腰带** |
| 护腕 | **藏青护腕缠手带**（双手叉腰位） |
| 下装 | **米白色宽松道裤（wide martial-arts trousers）** |
| 鞋 | **藏青色草履/凉鞋（赤脚穿，露脚趾）** |
| 姿势 | **双手叉腰、站姿沉稳（双腿微开的蓄势站姿）** |
| 能量 | **无元素特效**（纯腿法/音速踢，出图务必 `no fire, no elemental effects`） |
| 气质 | 冷静内敛、蓄势待发的腿法宗师 |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, candid documentary lighting, subtle film grain`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no comic, no manga panel, no illustration, no 3d render, no cgi, no chibi, no cel shading, no plastic skin, no airbrushed skin, no perfect symmetry, no video game model, no video game render, no fantasy glow, no aura, no game character, no fire, no elemental effects, no deformed hands, no extra fingers, no watermark, no text, no 8k, no studio fashion portrait, consistent facial identity`

### ① 全身·白底参考照（锁脸主基准）
`a REAL 28-year-old East Asian man, lean and athletic with defined muscle, warm light-tanned East Asian skin with realistic pores, a square jaw with a calm focused gaze, short dark-brown hair slightly messy with side-swept bangs, a sleeveless off-white V-neck martial-arts gi top with NAVY trim on the collar and front opening and two small navy rectangular fastenings on the chest, a black fabric waist belt, navy wrist wraps on both wrists, loose off-white wide martial-arts trousers, navy straw sandals worn barefoot, hands resting on the hips in a stable ready stance, pure white seamless studio background, no cast shadow, candid documentary, 35mm film grain` + 负面提示。

### ② 近景·脸（冷静蓄势，写实大头）
`extreme close-up portrait of a REAL 28-year-old East Asian man, a calm focused gaze, short dark-brown hair, warm light-tanned skin with realistic pores, slight facial asymmetry, natural window side-light, candid documentary photograph, 35mm film grain, shallow depth of of field, NOT airbrushed, NOT a 3d render` + 负面提示。

### ③ 侧脸 / 背影（悬念镜头）
`realistic back view of the same East Asian martial-arts kicker, his sleeveless off-white V-neck gi with navy trim, loose off-white trousers, a calm poised silhouette, cold cinematic silhouette against a dark empty dojang at night, moody low-key lighting, film still` + 负面提示。

### ④ 出招·音速踢（纯腿法，无特效）
`a REAL 28-year-old East Asian martial-arts man mid high spinning kick, his barefoot in a navy sandal whipping through the air, dramatic motion blur on the leg, the power shown through real body rotation and the snap of the kick NOT an explosion and NOT a fantasy aura or elemental effect, dark dojang at night, cinematic slow-motion` + 负面提示。

### ⑤ 白底静立（不动基准）
`full body, a REAL 28-year-old East Asian man standing and facing camera at eye level, all clothing details above, both hands relaxed at his sides, neutral dark studio-like background with soft cinematic key light, no energy effects, photorealistic, calm focused gaze` + 负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**真人写实基准：**
> 摄影级真实抓拍画面：一名 28 岁中国武运动员（KOF 中国风·腿法手 "Kick Master"），精壮匀称、腿法手型体态、精瘦肌肉线条，**浅亚洲暖白肤色 + 真实毛孔**。方下颌、**冷静专注眼神**、**深棕色短发（微乱侧分刘海）**。着**米白色 V 领无袖道服（藏青滚边领口/前襟 + 胸前两枚藏青矩形扣）+ 黑色布腰带 + 藏青护腕缠手带 + 米白色宽松道裤 + 藏青色草履（赤脚穿、露脚趾）**；**双手叉腰、双腿微开蓄势站姿**，冷静内敛的腿法宗师气质。

**出招（音速踢，无特效）：**
> 出招是**腿法（旋踢/音速踢）**——赤脚藏青草履快速旋踢、身体旋转蓄力，**以真实身体与腿部动作表达力量，不做火焰、不做气旋、不做电光、不做玄幻光环**；皮肤与道服保持真实材质。

---

## 四、一致性锚点 + 颜色铁律

- 锚点（缺一即换人）：**深棕色短发 + 米白 V 领无袖道服（藏青滚边 + 胸前双扣）+ 黑色布腰带 + 藏青护腕 + 米白宽松道裤 + 藏青草履（赤脚）+ 双手叉腰蓄势站姿 + 浅亚洲暖白肤色**，跨镜头保留。
- 颜色铁律：**金家藩 = 无元素特效**（纯腿法/音速踢）；草薙京=红焰 / 八神=紫焰 / 二阶堂=黄白电光 / 椎拳崇=青白气旋 / 麻宫=粉白念动力。**金家藩出招务必 `no fire, no elemental effects`，与所有"有特效"角色互不混色。**

---

## 五、出图登记

> ⚠️ 本角色为 KOF 中国风腿法手（金家藩 / Kick Master），**无元素特效**（纯腿法/音速踢，出图务必 `no fire, no elemental effects`）。

- **✅ ImageGen 图生图定稿（2026-10-22，全身白底锁脸基准）**：`05_资产库/AI生成图/imagegen/Re_render_this_Chinese_martial_2026-10-22T15-38-24.png`
  - 出图法：ImageGen image-to-image，`image1=金家藩_经典款_参照.png`，`input_fidelity=low`。
  - 命中：深棕短发 / 米白 V 领无袖道服（藏青滚边 + 胸前双扣）/ 黑腰带 / 藏青护腕 / 米白宽松道裤 / 藏青草履赤脚 / 双手叉腰站姿 / 浅亚洲暖白真人皮肤。
  - 右下角带引擎固定"AI生成"水印（要无水印走 Agnes key=`jinfan`）。

**Agnes 图生图 · 拟人化 prompt（可直接粘贴，无水印版）**
> Re-render this Chinese martial-arts kicker as a REAL 28-year-old East Asian man, lean and athletic with defined muscle, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature hands-on-hips pose and outfit: short dark-brown hair, a sleeveless off-white V-neck martial-arts gi / kimono top with NAVY trim on the collar and front opening and two small navy rectangular fastenings on the chest, a black fabric waist belt, navy wrist wraps on both wrists, loose off-white wide martial-arts trousers, navy straw sandals (barefoot), a confident calm focused expression. Warm light-tanned East Asian skin with realistic pores. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no elemental effects. Pure white seamless studio background, no cast shadow, full body. NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no elemental effects, no fire, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity
