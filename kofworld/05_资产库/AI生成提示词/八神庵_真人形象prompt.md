# 八神庵 · 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 依据 SNK 官方设定（snk.fandom / themkingoffighters.fandom / 百度百科 KOF95-XI 经典造型）整理。
> **风格目标：照片级真实感**——像一个真实存在的 20 岁日本青年男演员/格斗家被摄影机拍下，**不是动漫、不是 cosplay、不是游戏渲染**。
> ⚠️ 设定更正：八神庵**脸上无疤**。灵魂特征 = 红发长刘海遮左眼 + 紫罗兰眼 + 背后月牙纹章 + 紫焰。
> 造型：KOF95–XI 经典款（黑外套+月牙家纹+白长衬衫+红裤绑腿）。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 脸型 | 真实亚洲 20 岁男性面孔，**锋利下颌线**、薄唇、鼻梁挺直，皮肤有真实毛孔/质感，**一抹邪魅冷笑** |
| 发型 | 深酒红色中短发，**厚重直刘海斜垂遮住左眼**（标志），两侧碎发贴颊，发丝根根分明（真人发质，非动画糊色块） |
| 眼睛 | 冷窄上挑眼型，**瞳色紫罗兰**（写实镜头下偏深紫，冷冽） |
| 体型 | 182cm 高瘦精壮，肩宽腰窄，肌肉线条真实（非漫画夸张） |
| 外套 | 修身**黑色半扣立领皮/呢外套**，金纽扣，领口袖口微开衩，**背部中央一枚纤细白色月牙家纹** |
| 内衬 | 宽松**白长衬衫**长及大腿、前襟半扣，**露出胸口与腹肌**（真人肌理） |
| 裤 | **酒红修长裤**，**胫部红色皮带交叉绑住双腿**（真人皮质道具） |
| 鞋/配饰 | 黑短靴 + **颈戴黑 choker** + **右手无名指银戒** |
| 火焰 | 出招时**紫罗兰色火焰**（八神家紫焰，非爆炸），拳风拖紫光弧 |
| 气质 | 寡言傲慢、居高临下的压迫性气场 |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, dramatic cinematic lighting, shallow depth of field, subtle film grain, 8k, shot on cinema camera`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no illustration, no 3d render, no cgi, no chibi, no cel shading, no manga, no painted, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no gore, no realistic blood, consistent facial identity`

### ① 全身·正面（真人锁脸基准，最优先出这张）
`a real 20-year-old East Asian young man, 182cm tall lean athletic build, sharp jawline and thin lips with a subtle cruel smirk, deep wine-red short hair with thick straight front bangs falling across and COVERING his left eye, individual realistic hair strands, cold narrow upturned eyes with dark violet-purple irises, wearing a fitted black half-buttoned collar jacket with a thin white crescent-moon crest on the back, an open white long shirt reaching to the thighs partly exposing chest and abs, dark red trousers with a crossing red leather strap binding both shins, black choker, silver ring on the right ring finger, black boots, standing in a low crouched fighting stance, serious arrogant presence, realistic fabric and skin, cinematic` + 负面提示。

### ② 近景·脸（眼神/邪笑，写实大头）
`extreme close-up portrait of a real young East Asian man, only his RIGHT eye visible (left eye hidden under thick wine-red bangs), fierce dark violet eye glare, sharp jawline, a razor-thin malicious smirk, realistic skin texture with pores, natural skin tone, cinematic rim light, violet-purple flame reflections on his face, shallow depth of field` + 负面提示。

### ③ 侧脸 / 背影（威慑镜头，不露全脸）
`realistic side profile and back view of the same young man, the back of his black jacket showing a thin white crescent-moon crest, wine-red hair falling over the nape, cold cinematic silhouette against a dark empty dojo at night, moody low-key lighting, film still` + 负面提示。

### ④ 出招·无式焚天（紫焰光效，非爆炸）
`a real young man mid-punch, eruption of VIOLET-PURPLE fire and glowing embers swirling around his fists, streaks of purple light trails, dramatic motion blur, realistic skin and fabric, the fire is volumetric glow and sparks NOT an explosion, dark arena at night, cinematic slow-motion` + 负面提示。

### ⑤ 站姿静立（补一张"不动"的真人立绘基准，纯写实）
`full body, a real 20-year-old East Asian man standing still and facing camera, all clothing details above, neutral dark studio-like background with soft cinematic key light, no flames, photorealistic, calm intense gaze` + 负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**真人写实基准：**
> 摄影级真实画面：一名 20 岁东亚青年男性，182cm 高瘦精壮、肩宽腰窄，**皮肤有真实毛孔与肌理、发丝根根分明（不是动漫糊色块）**。深酒红色短发，**厚重直刘海斜垂遮住左眼**，两侧碎发贴颊；锋利下颌、薄唇、**一抹邪魅冷笑**，眼型冷窄上挑、**瞳色深紫罗兰**。着修身**黑色半扣立领皮外套**（金纽扣、**背部一枚纤细白色月牙家纹**、领袖微开衩），内搭**宽松白长衬衫**（长及大腿、前襟半扣露出胸口与腹肌），**酒红长裤胫部红皮带交叉绑住双腿**，黑靴 + **黑 choker** + **右手无名指银戒**。气质寡言傲慢、压迫性强。

**出招（无式焚天）：**
> 出招时拳风卷起**紫罗兰色火焰与火星**，拖出紫色光弧；火焰用体积光效表达、**不做实拍爆炸**；皮肤与衣物保持真实材质。

---

## 四、与《格斗家世界》第一季的对齐

- 出场镜段：段7（威慑）+ 季末剪影；**本季"阴影威慑"定位**——不出全力也压场。
- 镜头语言：出现时**画面冷调、BGM 压低**；用 ②/③（侧脸·背影·只露右眼）制造"不露全脸"压迫感（与反派吉斯同款手法）。
- 一致性锚点（跨镜头必保留）：**红发遮左眼 + 背后月牙家纹 + 紫罗兰眼 + 红裤绑腿 + 邪魅冷笑**，缺一即"换人"。
- 火焰颜色铁律：**八神=紫焰 / 草薙京=红焰**，不可混色。
- **写实铁律**：出图须"照片级真人"，负面提示里已强制 `no anime / no cartoon / no cgi / no game character`，避免拉回动漫感。
