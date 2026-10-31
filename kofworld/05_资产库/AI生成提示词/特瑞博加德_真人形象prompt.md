# 特瑞·博加德 · 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 依据 SNK 官方设定（KOF / 街头斗士 Terry Bogard，红帽金发 + 脑后金色长辫经典款）整理。
> **风格目标：照片级真实感**——像一个真实存在的 24 岁美国街头拳手被摄影机抓拍，**不是动漫、不是 cosplay、不是游戏渲染**。
> ⚠️ 设定定位：特瑞是**美式街头格斗家**（非 KOF94 东/日组），**浅白人肤色 + 天然金发**（发色无需纠成棕）；**无元素特效**（纯拳法/摔技，区别草薙京红焰/八神紫焰/二阶堂电光/椎拳崇气旋）。
> 造型：红帽 + 红无袖撕裂边背心 + 白背心 + 蓝牛仔裤 + **脑后金色长辫（垂背后/后颈）** 经典款。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 体型 | 178cm 精壮，肩宽、上肢肌理真实（拳击手型，非健美块状），重心略前倾、走动时双拳护颌 |
| 肤色 | **浅白人/浅古铜肤色**，带真实毛孔、日晒健康光泽、微汗 |
| 脸型 | 真实美国人男性面孔，方下颌、挺直鼻梁、**自信轻狂一笑** |
| 眼神 | 冷而不服输的**蓝眼**（写实镜头偏 steel-blue，非卡通亮蓝） |
| 发型 | 浅金色短发（发顶微翘碎发）+ **脑后扎一条金色长辫，垂到背后/后颈**（标志，非侧辫、非全头马尾、非短发寸） |
| 头饰 | **红白拼接棒球帽（snapback）**，正面织印**红色 "TERRY B." 字样**（实体织物，非发光符） |
| 上装 | **红色无袖背心/夹克，肩部与下摆带撕裂毛边（白绒毛边）**，内搭**白色背心** |
| 下装 | **中等蓝直筒牛仔裤** + 黑皮带（金属方扣） |
| 护具 | 双腕**黑色缠带** + 双手**黑色拳击缠手绷/露指护手** |
| 鞋 | 白色运动鞋（可带红色） |
| 能量 | **无元素特效**（纯拳法，出招是高速拳风/尘土，不做火焰/光弧） |
| 气质 | 街头混血硬汉、不服输、带痞气的自信 |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, candid documentary lighting, subtle film grain`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no comic, no manga panel, no illustration, no 3d render, no cgi, no chibi, no cel shading, no plastic skin, no airbrushed skin, no perfect symmetry, no video game model, no video game render, no fantasy glow, no aura, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no gore, no 8k, no studio fashion portrait, consistent facial identity`

### ① 全身·白底参考照（锁脸主基准）
`a REAL 24-year-old American street fighter, light tanned Caucasian skin with realistic pores and a natural sweat sheen, square jaw with a confident cocky grin, steel-blue eyes, light BLONDE short hair with a slightly spiky fringe and ONE long blonde ponytail/braid hanging down the BACK of his head over his back (NOT a side-lock in front of the chest), wearing a RED-and-white snapback cap with a small red "TERRY B." fabric print on the front, a red SLEEVELESS vest with shredded white-fleece frayed edges over a plain white tank top, medium-blue straight jeans with a black belt, black hand wraps on both wrists, white high-top sneakers, walking forward with fists raised at guard height, a confident cocky street-brawler presence, realistic fabric and skin, pure white seamless studio background, no cast shadow, candid documentary, 35mm film grain` + 负面提示。

### ② 近景·脸（眼神/痞笑，写实大头）
`extreme close-up portrait of a REAL 24-year-old American man, confident cocky grin, strong square jaw, realistic skin texture with pores and a light sweat sheen, steel-blue eyes, a few natural skin blemishes and slight facial asymmetry, light blonde hair under a red-and-white snapback cap with a long blonde ponytail/braid falling behind the shoulders, natural window side-light, candid documentary photograph, 35mm film grain, shallow depth of field, NOT airbrushed, NOT a 3d render` + 负面提示。

### ③ 侧脸 / 背影（悬念镜头）
`realistic side profile and back view of the same American street fighter, the back of his red sleeveless vest with frayed white fleece edges, the long blonde ponytail/braid hanging down his back and the "TERRY B." cap visible from behind, a gritty street or boxing-gym background, moody low-key cinematic light, 35mm film still` + 负面提示。

### ④ 出招·Dynamic Uppercut（高速拳风，非爆炸）
`a REAL American street fighter mid-punch, a fast rising uppercut, faint motion blur and a small puff of dust, no fire and no fantasy aura, realistic skin and fabric, gritty gym or street at dusk, candid documentary, 35mm film grain` + 负面提示。

### ⑤ 白底静立（不动基准）
`full body, a REAL 24-year-old American man standing still and facing camera at eye level, all clothing details above, hands empty and relaxed at his sides, neutral dark studio-like background with soft cinematic key light, photorealistic, calm confident gaze` + 负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**真人写实基准：**
> 摄影级真实抓拍画面：一名 24 岁美国街头拳手，**浅白人肤色带日晒光泽与微汗**、皮肤有真实毛孔（**发色是天然金发，无需纠成棕**）。方下颌、**自信轻狂一笑**，**钢蓝色眼睛**；**浅金色短发 + 脑后扎一条金色长辫垂到背后/后颈**（标志，非侧辫），头戴**红白拼接 snapback 棒球帽（正面织印红色 "TERRY B." 字样）**。上身着**红色无袖撕裂毛边背心（肩/下摆白绒毛边）**、内搭**白色背心**，下着**中等蓝直筒牛仔裤 + 黑皮带**，双腕**黑色缠带** + 双手**黑色拳击缠手绷**，**红色高帮帆布鞋**。走动时双拳护颌、重心前倾，痞气自信。

**出招（Dynamic Uppercut）：**
> 出招是**高速拳法**——上升式勾拳、拳风带轻微运动模糊与一小撮尘土，**无火焰、无光弧、无玄幻气**；皮肤与衣物保持真实材质。

---

## 四、一致性锚点 + 颜色铁律

- 锚点（缺一即换人）：**红白 TERRY B. 棒球帽 + 脑后金色长辫（垂背后/后颈）+ 红色撕裂毛边无袖背心（内搭白背心）+ 钢蓝眼痞笑 + 黑缠手绷**，跨镜头保留。
- 颜色铁律：特瑞=**无元素特效**（纯拳法/尘土）；草薙京=红焰 / 八神=紫焰 / 二阶堂=黄白电光 / 椎拳崇=青白气旋 / 大门=无特效。**特瑞与大门同为"无特效"，区别在于特瑞是金发+红帽+撕裂红背心，大门是相扑手+白头巾。**

---

## 五、Agnes-Image-2.5-Flash 图生图（本参照出"真·照片级"锁脸图）

> 参照图（稳定路径）：`05_资产库/参考图/特瑞博加德_经典款_参照.png`（经典款官方立绘）。
> 引擎：Agnes-Image-2.5-Flash，image-to-image（`extra_body.image` 传参照 base64，`input_fidelity=low` 让脸/皮肤从真人文字重生成、不照抄立绘 3D 渲染脸），`response_format=b64_json` 落盘最稳。
> 出图命令：`python tools/agnes_img2img.py terry 2K 9:16`

**Agnes 图生图 · 拟人化 prompt（可直接粘贴）**
> Re-render this street fighter as a REAL 24-year-old American street-fighter man, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature outfit and stance: light BLONDE short hair with a slightly spiky fringe and ONE long blonde ponytail/braid hanging down the BACK of his head over his back (NOT a side-lock in front of the chest), a red-and-white snapback cap with a small red "TERRY B." fabric print on the front, a red SLEEVELESS vest with shredded white-fleece frayed edges over a plain white tank top, medium-blue straight jeans, a black belt, black hand wraps on both wrists, red high-top canvas sneakers, walking forward with fists at guard height. Light tanned Caucasian skin. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no fantasy aura. Pure white seamless studio background, no cast shadow, soft natural side light. Full body. NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity

**✅ 出图登记**
- **✅ ImageGen 图生图定稿（2026-10-18，脑后辫版，全身白底锁脸基准）**：`05_资产库/AI生成图/imagegen/Re_render_this_street_fighter__2026-10-18T15-35-46.png`
  - 出图法：ImageGen image-to-image，`image1=特瑞博加德_经典款_参照.png`，`input_fidelity=low`。
  - 命中：**红帽（正面 TERRY B.）/ 红色撕裂毛边背心（内搭白背心）/ 蓝牛仔裤 / 黑缠手绷 / 红高帮帆布鞋 / 金色短发 + 脑后金色长辫垂背后** / 真人皮肤。
  - 早期"侧辫垂前胸"版本（`...T13-38-50.png`）造型方向错，已废弃，被脑后辫版取代。
  - 右下角带引擎固定"AI生成"水印（要无水印走 Agnes key=`terry`）。
