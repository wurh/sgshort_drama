# 草薙京（黑衣/西装版）· 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 造型版本依据：参考图 `05_资产库/参考图/草薙京_黑衣版_参照2.png`（项目内归档，稳定路径；出招参照 `05_资产库/参考图/草薙京_黑衣版_出招参照.jpg`）。KOF'99–'2000 风格"黑衣版"。
> 风格目标：**照片级真实感**——像一个真实存在的 20 岁日本青年男演员被摄影机拍下，**不是动漫/漫画/cosplay/游戏渲染/玄幻立绘**。
> ⚠️ 这是与"KOF94 学生装版"（`草薙京_真人形象prompt.md`）**不同的第二个造型版本**：发色=**棕色**、外套=**纯黑（SOLID BLACK，非深蓝）**、内搭=**白色背心**、**袖子撸到小臂、露出小臂与手（无橙色布料、也非全黑垂袖）**、**黑色露指手套（手背金色太阳纹章）**、下装=**黑色修身长裤 + 金色腰带 + 白色皮鞋**。两版可并存，锁脸时同一张脸、换服装。
> 🔒 **脸型锚点（2026-10-18 定稿）**：黑衣版锁脸用真实演员脸 `05_资产库/参考图/草薙京_脸型参照.png`（ImageGen image-to-image `input_fidelity=medium`，双图=黑衣参照2+脸型参照）。**最终定稿（撸袖露小臂·无橙）**：全身白底基准 `05_资产库/AI生成图/imagegen/A_REAL_East_Asian_young_man_in_2026-10-18T14-21-49.png` + 赤焰出招 `05_资产库/AI生成图/imagegen/A_REAL_East_Asian_young_man_in_2026-10-18T14-06-40.png`。
> 火焰色系铁律：**草薙京 = 红色火焰（赤炎）**，区别于八神庵紫焰、二阶堂红丸电光。

> ### 🔑 关键方法：知名 IP 角色务必"图生图"，别纯文字硬拍
> **纯文字 prompt 无法还原特定 IP 角色的脸 / 标志性姿态 / 专属配色**（实测：第一次纯文字出图 → 发色漂金、头巾变蝴蝶结、漏橙色袖套、站姿错误）。
> 正确做法：拿**官方参照图**做 **image-to-image（图生图）**，用 `input_fidelity` 控制贴近度（medium 较稳），prompt 里补全文字易漏的细节。
> 实测成功锚点（已出图 `05_资产库/AI生成图/Photorealistic_live_action_pho_*.png`）：**单指上指天手势 + 橙黄肘套 + 额头白护额 + 红棕短发 + 黑夹克灰背心**——这些是草薙京的"魂"，文字必须逐条写死。
> **🎯 拟人化强化版（最新，3D 味最轻）**：`05_资产库/AI生成图/candid_documentary_photograph__*.png`——在图生图基础上叠加"不换引擎拟人化配方"（脸加瑕疵/不对称/毛孔 + 24岁 + 自然侧窗光 + 抓拍感 + 35mm胶片质感 + 删8k + 负面 no plastic skin / no video game model / no airbrushed / no perfect symmetry + `footnote` 置空去水印），3D 渲染脸进一步压成"真人照片"。

> **✅ Agnes-Image-2.5-Flash 实测成功图（照片级真人，最推荐）**：`05_资产库/AI生成图/agnes/kyo_black.png`——用官方参照图走 Agnes 图生图（脚本 `tools/agnes_img2img.py` key=`kyo_black`），命中：右手食指上指天 / 红棕短发+额头白护额（发色未漂金）/ 黑开襟外套金扣+灰背心 / **橙色肘套** / 黑露指手套+棕皮带+黑修身裤+银鞋 / 真人皮肤质感 / 纯白底无阴影。小瑕疵：脸偏中性严肃，要更贴官方轻狂感在 prompt 加 `a cocky playful smirk`。


---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） | 依据/纠偏 |
|---|---|---|
| 体型 | **181cm**，精壮匀称、**肌肉线条流畅**（非健美块状），站姿重心微沉、好战本能 | 参考图 |
| 肤色 | **健康的浅古铜/小麦色**，毛孔真实、带**微汗光泽** | 真人化 |
| 脸型 | **棱角分明**，薄唇微扬，**桀骜挑衅的轻狂笑意**（炎之贵公子） | 参考图 |
| 眼神 | 冷灰瞳，锐利自信、带戏谑与挑衅 | 参考图 |
| 发型 | **棕色中分短发**（center part），发梢微翘、碎发，不羁感，发丝根根分明（**非金色、非马尾、非长发**） | 参考图（纠偏旧版"金色"） |
| 头巾 | **白色头巾**系头顶（垂出巾角） | 参考图 |
| 外套 | **纯黑（SOLID BLACK）开襟西装式外套**（blazer，非深蓝），领口金边、前襟金色排扣，敞开穿，**袖子撸到小臂（露出小臂皮肤与手，无橙色布料、也非全黑垂袖）** | 参考图（用户 2026-10-18 纠偏：深蓝→纯黑；全黑垂袖→撸袖露小臂·无橙） |
| 内搭 | **白色背心/无袖内衬**（露出胸肩与手臂线条） | 参考图 |
| 手套 | **黑色露指手套**，手背一枚**金色太阳纹章**（实物，非发光） | 参考图（用户纠偏：橙色手套→黑手套） |
| 腰带 | **金色金属扣腰带**，配同色编织腰封 | 参考图 |
| 下装 | **黑色修身长裤**，利落 | 参考图 |
| 鞋 | **白色皮鞋** | 参考图（用户纠偏：运动鞋→白色皮鞋） |
| 手势 | **单手前伸、五指张开**（草薙"召火"招牌起手式），另一手叉腰 | 参考图 |
| 能量 | 出招时**红色火焰（赤炎）**，体积光效、**非爆炸非玄幻光环** | 设定 |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, cinematic lighting, 8k, shot on cinema camera`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no comic, no manga panel, no illustration, no 3d render, no cgi, no chibi, no cel shading, no fantasy glow, no aura, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no gore, no realistic blood, consistent facial identity`

### ① 全身·白底参考照（**锁脸主基准，最优先出这张**）
`full-body studio photograph of a real 20-year-old East Asian male, 181cm tall, lean athletic build with flowing natural muscle definition and slightly lowered center of gravity, healthy light-bronze skin with realistic pores and a subtle sheen of sweat, sharp angular jaw, thin lips with a cocky defiant smirk, cold grey eyes with a challenging gaze, light BROWN hair in a clean center part with slight tousled flyaway tips (NOT golden, NOT a ponytail, NOT long), a white headscarf/bandana tied on top of the head with hanging corners, wearing an open SOLID BLACK blazer-style jacket with gold button trim (NOT navy) over a white sleeveless undershirt, the jacket sleeves ROLLED UP to the forearms so the bare skin forearms and hands are exposed (NO orange fabric anywhere on the arms), BLACK fingerless gloves with a small printed gold sun-crest on the back of the hand (NOT orange gloves), a gold-buckle belt with a matching woven sash, slim black trousers, WHITE leather shoes, both hands empty and relaxed at his sides holding nothing, standing straight facing the camera at eye level, pure white seamless studio background (#ffffff), NO cast shadow on the floor, even soft studio key light, photorealistic skin and fabric` + 通用负面提示。
> 负面提示务必加：`no navy jacket, no blue jacket, no orange, no orange sleeves, no orange arm warmers, no orange fabric, no orange gloves`（防外套漂深蓝 / 前臂冒橙色 / 手套画成橙色）。

- **4 条白底硬约束（务必带齐）**：`pure white seamless studio background (#ffffff)` + `NO cast shadow on the floor` + `both hands empty and relaxed at his sides, holding nothing` + `standing straight facing the camera at eye level`。
- **✅ 已出图（2026-10-18 ImageGen 定稿，脸型锚点法）**：
  - 全身白底锁脸基准（**最终：撸袖露小臂·无橙**）：`05_资产库/AI生成图/imagegen/A_REAL_East_Asian_young_man_in_2026-10-18T14-21-49.png`（纯黑外套金扣/白背心/**袖子撸到小臂露出小臂与手、无橙色**/黑手套+金色太阳纹章/金腰带/黑裤/白皮鞋/白头巾棕发，脸型=真人脸锚点，纯白无阴影双手垂放）
  - 赤焰出招：`05_资产库/AI生成图/imagegen/A_REAL_East_Asian_young_man_in_2026-10-18T14-06-40.png`（右手前推蓄力+红橙赤炎火星光弧，体积光非爆炸）
  - （早期版本 `...T14-05-30.png`（橙色前臂）/ `...T14-10-59.png`（全黑垂袖）已废弃，被撸袖版 `...T14-21-49.png` 取代）

### ② 近景·脸（眼神/挑衅笑意，写实大头）
`extreme close-up portrait of a real young East Asian man, light brown center-parted hair, white headscarf above the forehead, cold grey eyes, cocky defiant smirk, light-bronze skin with realistic pores and a subtle sweat sheen, cinematic rim light, red flame reflections on the face, shallow depth of field` + 通用负面提示。

### ③ 侧脸 / 背影（外套金扣 + 手套太阳纹章悬念镜头）
`realistic side profile and back view of the same young man, open SOLID BLACK blazer with gold button trim (NOT navy), white headscarf, light brown center-parted hair, a small printed gold sun-crest on the back of the black fingerless glove, cold cinematic silhouette in a dim dojo at night, moody low-key lighting, film still` + 通用负面提示。

### ④ 出招·草薙之火（红色必杀，单手前伸起手式，光效非玄幻）
`a real young man mid-strike, one hand reaching forward with fingers spread (the classic Kyo fire-charge gesture), eruption of RED FLAME between and around his fingers, streaks of red-orange fire-trail light and rising embers, dramatic motion blur, realistic sweat-slicked skin and fabric, the fire is a volumetric glow NOT an explosion and NOT a fantasy aura, dark arena at night, cinematic slow-motion` + 通用负面提示。

### ⑤ 白底静立（补一张"不动"的纯写实站立基准，与①同背景便于比对同一张脸）
`full body, a real 20-year-old East Asian man standing still and facing camera, natural hands-at-sides pose holding nothing, all clothing details above, pure white seamless studio background (#ffffff), no cast shadow, soft even studio light, no flames, photorealistic, calm confident gaze` + 通用负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**① 全身白底参考照（锁脸主基准）：**
> 摄影级真实画面：一名 20 岁东亚青年男性，**181cm**，精壮匀称、肌肉线条流畅、重心微沉，**健康浅古铜肤色**、毛孔真实、**带微汗光泽**；**棱角分明的脸、薄唇微扬、桀骜挑衅的轻狂笑意**。**浅棕色中分短发**（发梢微翘，非金色、非马尾）、**白色头巾系头顶**。着**深藏蓝开襟西装式外套（金边金扣、敞开）**、**白色无袖背心**、**黑色露指手套（手背一枚金色太阳纹章，实物非发光）**、**金色金属扣腰带 + 编织腰封**、**黑色修身长裤**、**白色运动鞋**。**双手不持物、自然垂于体侧**，平视自然站立；**纯白无缝棚拍背景、无落地阴影**，均匀柔光。

**出招（草薙之火）：**
> 出招时**单手前伸、五指张开**（草薙招牌起手式），指尖卷起**红色火焰（赤炎）**，拖出红橙火光轨迹与火星；火焰用体积光效表达、**不做实拍爆炸、不做玄幻光环**；皮肤（微汗）与衣物保持真实材质。

---

## 四、一致性锚点 + 颜色铁律

- **锁脸主图 = ① 全身白底参考照**：纯白背景、无阴影、无手持物，先出这张定脸，其余（近景/侧背/出招）都锚定这张的脸。
- **一致性锚点（跨镜头必保留，缺一即"换人"）**：
  1. 浅棕色中分短发 + 白色头巾（头顶）
  2. 深藏蓝开襟外套（金边金扣）+ 白色无袖背心
  3. 黑色露指手套 + 手背**金色太阳纹章**
  4. 金色金属扣腰带
  5. 黑色修身长裤 + 白色运动鞋
  6. 桀骜挑衅的轻狂笑意 + 冷灰瞳 + 浅古铜肤
- **颜色铁律**：草薙京=**红焰** / 八神庵=紫焰 / 二阶堂红丸=电光，三者不可混色。
- **两版造型**：KOF94 学生装版（白开襟学生装 + 蓝裤）在 `草薙京_真人形象prompt.md`；本文件为**黑衣/西装版**。整部剧若统一 1994，用 94 版；若走现代/黑衣造型，用本版——**同一张脸、换服装**。
