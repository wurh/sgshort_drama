# 草薙京 · 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 依据 SNK 官方设定 + 用户权威造型规范，风格目标：**照片级真实感**——像一个真实存在的 20 岁日本青年男演员被摄影机拍下，**不是动漫、不是漫画、不是 cosplay、不是游戏渲染**。
> 造型版本：KOF'94 学生装（浅棕中分短发 + 白色头巾 + 白无袖开襟学生装 + 背后巨大金色草薙烈阳徽章 + 赤炎）。
> 火焰色系铁律：**草薙京 = 红色火焰（赤炎）**，区别于八神庵紫焰、二阶堂红丸电光。
> ⚠️ 已按用户规范修正两处旧误：发色 = **棕色**（非金色）；烈阳徽章 = **背后**（非额头，去掉玄幻发光符）。

## 〇、脸型锚点（Kyo 锁脸基准，2026-10-18 定稿）

> 用户指定这张真实男演员脸为草薙京的**脸型锚点**，以后所有草薙京镜头都用它锁脸（跨段一张脸、不再漂）。
> - 脸型参照（稳定路径）：`05_资产库/参考图/草薙京_脸型参照.png`
> - 出图法：ImageGen image-to-image，`input_fidelity=medium`（锁住这张脸）+ 草薙学生装拟人化 prompt。
> - 定稿出图（ImageGen，右下角带引擎固定"AI生成"水印，按用户要求保留）：
>   - 半身近景：`05_资产库/AI生成图/imagegen/A_REAL_East_Asian_young_man_in_2026-10-18T13-41-56.png`
>   - 全身白底锁脸主基准：`05_资产库/AI生成图/imagegen/A_REAL_East_Asian_young_man_in_2026-10-18T13-52-18.png`
> - 锚点（缺一即换人）：你贴的脸型 + 浅棕发 + 白头巾 + 白开襟无袖学生装 + 深蓝牛仔裤 + 露指手套 + 痞笑。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 体型 | **181cm / 75kg**，匀称精壮、**肌肉线条流畅**（非健美块状），重心微微下沉，街头格斗家的好战本能 |
| 肤色 | **健康的浅古铜色（小麦色）**，质感真实、毛孔肌理、**带一点微汗的光泽** |
| 脸型 | 真实东亚 20 岁男面孔，**棱角分明**，薄唇微扬，**不羁的轻狂 + 桀骜挑衅**（炎之贵公子，傲慢戏谑笑意） |
| 眼神 | 锐利自信，带戏谑与挑衅，**蓝灰冷瞳** |
| 发型 | **浅棕色中分短发**（center part，"万年不变"标志），碎发、**发梢微翘**，不羁感，发丝根根分明（**非金色、非马尾、非长发**） |
| 头巾 | **白色大手帕/头巾**系在头顶（垂出巾角），KOF94 标志 |
| 徽章 | **背后一枚巨大的金色"烈阳"徽章**（草薙家族纹章），金属织印反光（**只在背后，不在额头**） |
| 上衣 | **白色无袖学生制服上衣，领口敞开**（无袖，露出前臂肌肉线条） |
| 手套 | **露指手套 + 手腕护腕**（实战武斗手套） |
| 下装 | **深色牛仔裤 / 宽松长裤**，脚蹬**运动鞋** |
| 火焰 | 出招时**红色火焰（赤炎）**，拳风拖红橙火光轨迹、火星（体积光，**非爆炸、非玄幻光效**） |
| 气质 | 桀骜不驯、过于自信、毒舌、慵懒；**日常双手插兜或自然下垂，轻松写意** |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, cinematic lighting, 8k, shot on cinema camera`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no comic, no manga panel, no illustration, no 3d render, no cgi, no chibi, no cel shading, no fantasy glow, no aura, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no gore, no realistic blood, consistent facial identity`

### ① 全身·白底参考照（**锁脸主基准，最优先出这张**）
> 用户规范：全身摄影、纯白背景、无落地阴影、双手不持物、平视自然站立。

`full-body studio photograph of a real 20-year-old East Asian male, 181cm tall, lean athletic build with flowing natural muscle definition, slightly lowered center of gravity, healthy light-bronze skin with realistic pores and a subtle sheen of sweat, sharp angular jaw, thin lips with a cocky playful smirk, cold blue-grey eyes with a defiant challenging gaze, light BROWN hair in a clean center part with slight tousled flyaway tips (NOT golden, NOT a ponytail, NOT long), a white bandana/head-scarf tied on top of the head with hanging corners, wearing a white sleeveless open-collar student uniform jacket, a LARGE golden sun-crest emblem printed on the BACK of the jacket, fingerless martial-arts gloves with wrist wraps, dark blue jeans, white sneakers, both hands empty and relaxed at his sides holding nothing, standing straight facing the camera at eye level, PURPLE-FREE pure white seamless studio background (#ffffff), NO cast shadow on the floor, even soft studio key light, photorealistic skin and fabric` + 通用负面提示。

- **关键约束（务必带齐）**：`pure white seamless studio background (#ffffff)` + `NO cast shadow on the floor` + `both hands empty ... holding nothing`（无手持道具）+ `standing straight facing the camera at eye level`（平视自然站立）。

### ② 近景·脸（眼神/轻佻笑意，写实大头）
`extreme close-up portrait of a real young East Asian man, light brown center-parted hair, white headscarf above the forehead, confident cocky smirk, cold blue-grey eyes, light-bronze skin with realistic pores, a subtle sheen of sweat, cinematic rim light, red flame reflections on the face, shallow depth of field` + 通用负面提示。

### ③ 侧脸 / 背影（背后巨大烈阳徽章的悬念镜头）
`realistic side profile and back view of the same young man, the LARGE golden sun-crest emblem on the back of the white sleeveless jacket, white headscarf, light brown center-parted hair, cold cinematic silhouette in a dim dojo at night, moody low-key lighting, film still` + 通用负面提示。

### ④ 出招·草薙之火（红色必杀，光效非玄幻）
`a real young man mid-strike, eruption of RED FLAME around his fists and trailing from his body, streaks of red-orange fire-trail light and rising embers, dramatic motion blur, realistic sweat-slicked skin and fabric, the fire is a volumetric glow NOT an explosion and NOT a fantasy aura, dark arena at night, cinematic slow-motion` + 通用负面提示。

### ⑤ 白底静立（补一张"不动"的纯写实站立基准，与①同背景便于比对同一张脸）
`full body, a real 20-year-old East Asian man standing still and facing camera, natural hands-at-sides pose holding nothing, all clothing details above, pure white seamless studio background (#ffffff), no cast shadow, soft even studio light, no flames, photorealistic, calm confident gaze` + 通用负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**① 全身白底参考照（锁脸主基准）：**
> 摄影级真实画面：一名 20 岁东亚青年男性，**181cm/75kg**，匀称精壮、肌肉线条流畅、重心微沉，**健康浅古铜肤色**、毛孔真实、**带微汗光泽**；**棱角分明的脸、薄唇微扬、桀骜挑衅的轻狂笑意**。**浅棕色中分短发**（发梢微翘，非金色、非马尾）、**白色头巾系头顶**、**背后一枚巨大金色草薙烈阳徽章**。着**白色无袖开襟学生装**（领口敞开）、**露指手套 + 护腕**、**深色牛仔裤 + 运动鞋**。**双手不持物、自然垂于体侧**，平视自然站立；**纯白无缝棚拍背景、无落地阴影**，均匀柔光。

**出招（草薙之火）：**
> 出招时拳风卷起**红色火焰（赤炎）**，拖出红橙火光轨迹与火星；火焰用体积光效表达、**不做实拍爆炸、不做玄幻光环**；皮肤（微汗）与衣物保持真实材质。

---

## 四、与《格斗家世界》第一季的对齐

- 出场镜段：段3（初见三强）/ 段5-6（认可+警示）/ 段10（团队收束）；**本季"偶像 + 认可"定位**。
- **锁脸主图 = ① 全身白底参考照**：纯白背景、无阴影、无手持物，先出这张定脸，其余镜段（近景/侧背/出招）都锚定这张的脸。
- 一致性锚点（跨镜头必保留）：**浅棕中分短发 + 白色头巾 + 背后巨大金色草薙烈阳徽章 + 白无袖开襟学生装 + 桀骜轻狂笑意**，缺一即"换人"。
- 火焰颜色铁律：**草薙京=红焰 / 八神庵=紫焰 / 二阶堂红丸=电光**，三者不可混色。
- 写实铁律：出图须"照片级真人"，负面提示已强制 `no anime / no comic / no manga panel / no fantasy glow / no cgi / no game character`。
