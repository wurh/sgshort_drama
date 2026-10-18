# 二阶堂红丸 · 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 依据 SNK 官方设定（KOF'94–'98 经典造型，原型为 JoJo 波鲁纳雷夫），风格目标：**照片级真实感**——像一个真实存在的 20 岁日美混血青年被摄影机拍下，**不是动漫、不是 cosplay、不是游戏渲染**。
> 造型版本：KOF94 版（蓝色背心 + 蓝色短裤 + 草鞋 + 金色"扫把"短发 + 黄白色电光）。
> 火焰/能量色系铁律：**二阶堂红丸 = 黄白色电光（雷电）**，区别于草薙京红焰、八神庵紫焰。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 脸型 | **日美混血**俊美面孔，轮廓立体、鼻梁高挺、笑容阳光，皮肤真实毛孔/肌理 |
| 发型 | **金色短寸/扫把头**，发因静电**根根向上竖起**（标志"扫把头"），短而乱翘，**不是长发** |
| 眼睛 | **蓝色瞳孔**，阳光自信、带调皮劲 |
| 上装 | **蓝色无袖背心/坎肩**（露出结实手臂），胸口有草鞋/十字刺绣点缀 |
| 下装 | **蓝色短裤**（及膝，运动风） |
| 鞋 | **传统草鞋（waraji）或凉鞋**（写实绳编质感） |
| 配饰 | 手腕/脚腕有时有金色环饰（写实金属），**金色手表**（"造物主眷顾"设定） |
| 能量 | 出招时**黄白色电光/闪电**缠绕周身、拳风拖电弧火花（体积光，非爆炸） |
| 气质 | 轻浮自恋但关键时刻可靠、护短、热；"打就完了"派 |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, dramatic cinematic lighting, shallow depth of field, subtle film grain, 8k, shot on cinema camera`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no illustration, no 3d render, no cgi, no chibi, no cel shading, no manga, no painted, no game character, no face scars, no long hair, no deformed hands, no extra fingers, no watermark, no text, no gore, no realistic blood, consistent facial identity`

### ① 全身·正面（真人锁脸基准，最优先出这张）
`a real 21-year-old Japanese-American mixed-heritage young man, 180cm tall lean athletic build, handsome angular features with a high nose bridge and a bright confident grin, short GOLDEN hair in a messy buzz/flat-top cut with individual strands standing UP (static-charged, NOT long hair), blue eyes, wearing a blue sleeveless vest/kanon with embroidered crosses, blue knee-length shorts, traditional woven waraji sandals, a gold wristwatch on his wrist, standing in a playful ready stance with one hand raised, electric sparks crackling lightly around his fingers, charismatic and cocky presence, realistic fabric and skin, cinematic` + 负面提示。

### ② 近景·脸（阳光笑容/眼神，写实大头）
`extreme close-up portrait of a real young mixed-heritage East Asian man, golden standing-up buzz hair, bright blue eyes, a warm cocky grin, high nose bridge, realistic skin texture with pores, cinematic rim light, yellow-white electric sparkle in the background, shallow depth of field` + 负面提示。

### ③ 侧脸 / 背影（与三强同款悬念手法）
`realistic side profile and back view of the same young man, blue sleeveless vest, golden standing-up short hair, light electric glow along his shoulders, cold cinematic silhouette against a dark dojo at night, film still` + 负面提示。

### ④ 出招·雷火（黄白色电光，光效非爆炸）
`a real young man mid-kick, eruption of YELLOW-WHITE ELECTRICITY and lightning arcs swirling around his body, streaks of blue-white electric light and sparks, dramatic motion blur, realistic skin and fabric, the energy is volumetric electric glow NOT an explosion, dark arena at night, cinematic slow-motion` + 负面提示。

### ⑤ 站姿静立（补一张"不动"的真人立绘基准，纯写实）
`full body, a real 21-year-old Japanese-American mixed-heritage young man standing still and facing camera, all clothing details above, neutral dark studio-like background with soft cinematic key light, no electricity, photorealistic, calm confident gaze` + 负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**真人写实基准：**
> 摄影级真实画面：一名 21 岁**日美混血**青年男性，180cm 高瘦精壮，**轮廓立体、鼻梁高挺、笑容阳光**，皮肤真实毛孔。发型为**金色短寸"扫把头"**——发因静电**根根向上竖起、短而乱翘（不是长发）**。**蓝色无袖背心/坎肩**（胸前十字刺绣）、**蓝色及膝短裤**、**传统绳编草鞋**、**金色手表**。气质轻浮自恋但可靠、护短。

**出招（雷火）：**
> 出招时周身缠绕**黄白色电光与电弧火花**，拖出蓝白电光轨迹；能量用体积光效表达、**不做实拍爆炸**；皮肤与衣物保持真实材质。

---

## 四、与《格斗家世界》第一季的对齐

- 出场镜段：段3（初见三强）/ 段4（护短结盟）/ 段10（团队收束）；**本季"兄弟情锚点"定位**——第一个认可主角的人。
- 一致性锚点（跨镜头必保留）：**金色竖起"扫把"短发 + 蓝色背心 + 蓝色短裤 + 草鞋 + 日美混血俊美脸 + 蓝瞳**，缺一即"换人"。
- 能量颜色铁律：**二阶堂红丸=黄白电光 / 草薙京=红焰 / 八神庵=紫焰**，三者不可混色。
- 写实铁律：出图须"照片级真人"，负面提示已强制 `no anime / no cartoon / no cgi / no game character`；发型易被误生成长发，故负面提示加 `no long hair` 强调短寸。
