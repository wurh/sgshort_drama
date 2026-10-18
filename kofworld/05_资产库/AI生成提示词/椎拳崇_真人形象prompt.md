# 椎拳崇 · 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 依据 SNK 官方设定（KOF'94 经典造型），风格目标：**照片级真实感**——像一个真实存在的 20 岁日本青年被摄影机拍下，**不是动漫、不是 cosplay、不是游戏渲染**。
> 造型版本：KOF94 版（蓝发 + 紫道服 + 护目镜 + 气功系）。
> 能力色系铁律：**椎拳崇 = 气/风（青白色气流光）**，区别于草薙京红焰、八神庵紫焰、二阶堂电光。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 脸型 | **圆脸憨厚**、笑容天真（标志性"卖萌高手脸"），皮肤真实毛孔/肌理，实则高手深不可测 |
| 发型 | **蓝色短发**（蓝发，写实偏深蓝，碎发微翘），头顶戴**圆护目镜**（写实金属/镜片质感） |
| 眼睛 | **圆而明亮的眼睛**，憨笑时眯起，认真时锐利 |
| 上装 | **紫色武道道服（gi）**，盘扣，胸前有家纹点缀，布料写实垂坠 |
| 下装 | **同色紫色武道裤**，裤脚束紧 |
| 腰带 | **编织武道腰带**（青/白色），写实绳结 |
| 鞋 | 黑色武道鞋 |
| 能量 | 出招时**青白色气流/旋风**（气旋、气旋风）环绕，体积光效非爆炸 |
| 气质 | 外表搞笑卖萌、实则气境深厚；"来呀～！"的憨笑是镜头记忆点 |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, dramatic cinematic lighting, shallow depth of field, subtle film grain, 8k, shot on cinema camera`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no illustration, no 3d render, no cgi, no chibi, no cel shading, no manga, no painted, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no gore, no realistic blood, consistent facial identity`

### ① 全身·正面（真人锁脸基准，最优先出这张）
`a real 20-year-old East Asian young man with a round friendly face and a goofy cheerful grin, deep-blue short hair with a pair of ROUND GOGGLES pushed up on his forehead, wearing a purple martial-arts gi (kanon) with white cross-knot buttons, matching purple martial trousers, a woven ki belt tied at the waist, black martial boots, standing in a low ki-gathering stance with hands cupped, calm confident aura, realistic fabric and skin, cinematic` + 负面提示。

### ② 近景·脸（憨笑/摘护目镜，写实大头）
`extreme close-up portrait of a real young East Asian man with a round friendly face, blue hair, round goggles now removed and resting on the forehead, a wide goofy grin, bright round eyes, realistic skin texture with pores, cinematic rim light, soft blue-white qi glow in the background, shallow depth of field` + 负面提示。

### ③ 侧脸 / 背影（与三强同款悬念手法）
`realistic side profile and back view of the same young man, purple martial-arts gi, blue hair, round goggles, a faint swirl of pale-blue ki glow along his back, cold cinematic silhouette against a dark dojo at night, film still` + 负面提示。

### ④ 出招·龙卷飓风（青白气旋，光效非爆炸）
`a real young man mid-spinning kick, a swirling VORTEX of pale-blue and white wind/ki energy spiraling around his body, streaks of glowing wind-trail, dramatic motion blur, realistic skin and fabric, the energy is volumetric wind-glow NOT an explosion, dark arena at night, cinematic slow-motion` + 负面提示。

### ⑤ 站姿静立（补一张"不动"的真人立绘基准，纯写实）
`full body, a real 20-year-old East Asian man standing still and facing camera, all clothing details above, neutral dark studio-like background with soft cinematic key light, no energy effects, photorealistic, calm gentle grin` + 负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**真人写实基准：**
> 摄影级真实画面：一名 20 岁东亚青年男性，**圆脸憨厚、笑容天真（标志"卖萌高手脸"）**，皮肤真实毛孔。**蓝色短发**，头顶戴**圆护目镜**（写实镜片质感）。着**紫色武道道服**（盘扣、胸前家纹）+ **同色紫武道裤** + **青白色编织气腰带** + 黑色武道鞋。气质外表搞笑卖萌、实则气境深厚。

**出招（龙卷飓风）：**
> 出招时周身卷起**青白色气流/旋风**（气旋风、气旋风），拖出旋风光弧；能量用体积光效表达、**不做实拍爆炸**；皮肤与衣物保持真实材质。

---

## 四、与《格斗家世界》第一季的对齐

- 出场镜段：段3（初见三强）/ 段8（vs 主角"计算 vs 气"镜像战）/ 段10（团队收束）；**本季"镜像对手 + 虽败犹荣"定位**。
- 一致性锚点（跨镜头必保留）：**蓝发 + 圆护目镜 + 紫道服 + 圆脸憨笑 + 青白气腰带**，缺一即"换人"。
- 能量颜色铁律：**椎拳崇=青白气旋 / 草薙京=红焰 / 八神庵=紫焰 / 二阶堂=黄白电光**，四者不可混色。
- 写实铁律：出图须"照片级真人"，负面提示已强制 `no anime / no cartoon / no cgi / no game character`。
