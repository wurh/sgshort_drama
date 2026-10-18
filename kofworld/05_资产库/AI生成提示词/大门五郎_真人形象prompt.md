# 大门五郎 · 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 造型版本依据：参考图 `D:\短剧业务\KOF\t04157768c0c226865b.jpg`（KOF 经典相扑手造型）。
> 风格目标：**照片级真实感**——像一个真实存在的日本相扑手/格斗家被摄影机拍下，**不是动漫/漫画/cosplay/游戏渲染/玄幻立绘**。
> 火焰色系铁律：大门**无元素特效**（纯古武术摔技），与其他角色的火焰/电光/气旋互不冲突。
> 实测成功图：`05_资产库/AI生成图/Photorealistic_live_action_pho_*.png`（大门五郎）。

> ### 🔑 关键方法：知名 IP 角色务必"图生图"，别纯文字硬拍
> 纯文字还原不出特定 IP 的脸 / 标志性姿态 / 体型。正确做法：拿**官方参照图**做 **image-to-image**（`input_fidelity=medium`），prompt 里逐条写死官方参照里"文字易漏"的细节（体型/护额纹章/招牌手势/木屐/马步）。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 体型 | **相扑手体型**（大块头，但**比例自然**，非健美块状），皮肤偏黑褐、真实毛孔 |
| 年龄/气质 | **25-28 岁**敦厚温和，**外表凶悍、内心重情义**（草薙京/红丸的师父兼兄长） |
| 脸型 | 真实东亚圆脸/方脸，**短黑发**，**额头白色护额 + 红色圆形纹章** |
| 手势 | **双手摊开、掌心朝外**（招牌起手式/挑衅），双臂抬起 |
| 护腕 | **白色护腕**缠绕双腕 |
| 腰/下装 | **黑色腰带 + 白色袴裤（宽松相扑道裤）** |
| 鞋 | **木屐（げた）** |
| 站姿 | **马步/相扑宽站**，双腿分开、重心下沉，稳如泰山 |
| 气质 | 沉稳、自信、憨厚、爆发力强 |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, cinematic lighting, 8k, shot on cinema camera`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no comic, no manga panel, no illustration, no 3d render, no cgi, no chibi, no cel shading, no fantasy glow, no aura, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no gore, no realistic blood, consistent facial identity`

### ① 全身·白底参考照（锁脸主基准，最优先出这张）
`full-body studio photograph of a real heavyset Japanese man in his late 20s, a real sumo-wrestler physique (massive but naturally proportioned, not bodybuilder-blocky), tanned skin with realistic pores, short black hair, a white headband tied across the forehead with a red circular crest, both arms raised with open palms facing outward (his signature taunt/stance), white wrist wraps on both wrists, a black belt, loose white sumo-style hakama trousers, wooden geta sandals, a wide stable sumo stance with legs apart, a calm gentle confident expression, pure white seamless studio background (#ffffff), NO cast shadow on the floor, even soft studio key light, photorealistic skin and fabric` + 通用负面提示。

- **4 条白底硬约束**：`pure white seamless studio background (#ffffff)` + `NO cast shadow on the floor` + 体型自然（非健美）+ `wide stable sumo stance`。
- **图生图**：把官方参照图传 `image1`，`input_fidelity=medium`，锁脸锁体型锁姿态。

### ② 近景·脸（敦厚神气，写实大头）
`extreme close-up portrait of a real heavyset East Asian man in his late 20s, short black hair, white headband with a red circular crest on the forehead, tanned skin with realistic pores, calm gentle confident expression, cinematic rim light, shallow depth of field` + 通用负面提示。

### ③ 侧脸 / 背影（大块头体型悬念镜头）
`realistic side profile and back view of the same heavyset man, white headband with red crest, the broad sumo back and shoulders, white hakama trousers, wooden geta, cold cinematic silhouette in a dim dojo at night, moody low-key lighting, film still` + 通用负面提示。

### ④ 出招·投技（古武术摔技，无元素特效）
`a real heavyset Japanese man mid-throw, locking an opponent into a sumo-style slamm / grappling hold, dramatic motion blur, realistic sweat-slicked skin and fabric, powerful grounded movement, NO elemental effects and NO fantasy aura (Daimon uses pure martial-arts throwing, no fire/no lightning), dark arena at night, cinematic slow-motion` + 通用负面提示。

### ⑤ 白底静立（补一张"不动"的纯写实站立基准，与①同背景便于比对同一张脸）
`full body, a real heavyset Japanese man standing still and facing camera, wide stable stance, all clothing details above, pure white seamless studio background (#ffffff), no cast shadow, soft even studio light, no effects, photorealistic, calm confident gaze` + 通用负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**① 全身白底参考照（锁脸主基准）：**
> 摄影级真实画面：一名 **25-28 岁日本大汉**，**相扑手体型**（大块头但比例自然、非健美块状），皮肤偏黑褐、毛孔真实；**短黑发 + 额头白色护额（红色圆形纹章）**；**双手摊开掌心朝外**（招牌手势）、**白色护腕**缠双腕；**黑色腰带 + 白色宽松袴裤**、脚踩**木屐**；**双腿分开的马步/相扑宽站**，重心下沉，神情敦厚温和自信。**纯白无缝棚拍背景、无落地阴影**，均匀柔光。

**出招（投技）：**
> 出招为**古武术摔技**（投技/锁技），**无火焰/电光/气旋等元素特效**（这是大门区别于其他角色的点），皮肤微汗、衣物真实。

---

## 四、一致性锚点 + 颜色铁律

- **锁脸主图 = ① 全身白底参考照**：纯白背景、无阴影，先出这张定脸，其余（近景/侧背/出招）都锚定这张的脸。
- **一致性锚点（跨镜头必保留，缺一即"换人"）**：
  1. 相扑手大块头体型（比例自然）
  2. 短黑发 + **额头白护额 + 红色圆形纹章**
  3. 白色护腕 + 黑色腰带 + 白色袴裤 + 木屐
  4. 双手摊开的招牌手势 / 马步宽站
  5. 敦厚温和的神气
- **颜色铁律**：大门**无元素特效**（纯摔技）；草薙京=红焰 / 八神庵=紫焰 / 二阶堂红丸=电光 / 椎拳崇=青白气旋，四者勿混色。
- **图生图铁律**：知名 IP 角色务必拿官方参照图做 image-to-image（`input_fidelity=medium`），别纯文字硬拍。
