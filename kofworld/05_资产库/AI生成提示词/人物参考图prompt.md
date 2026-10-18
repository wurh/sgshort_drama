# 人物参考图 · AI 生成 Prompt（第一季）

> 用途：喂给 AI 图生图，产出固定角色参考图。每段 prompt 含【主体描述 + 固定视觉锚点 + 风格 + 负面提示】。
> **全库统一为真人写实风**（本文件与三个专用真人 prompt 文件一致：草薙京 / 二阶堂红丸 / 八神庵 / 椎拳崇 各有一份"全套写实版"）。
> 通用风格前缀（加在每条开头）：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, dramatic cinematic lighting, shallow depth of field, subtle film grain, 8k`
> 通用负面提示（加在每条结尾）：
> `no anime, no cartoon, no illustration, no 3d render, no cgi, no chibi, no cel shading, no manga, no painted, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no gore, no realistic blood, consistent facial identity`
> ⚠️ 时代例外：仅镜002（现代 2026，吴真看 KOF16 广告）允许出现智能手机；其余所有镜头无现代电子。

---

## P01 吴真（主角）

**[怂态 / 现代 2026]**
`hyper-realistic photograph of a real 30-year-old Chinese man, software engineer, messy black hair, black-framed glasses, old worn T-shirt and jeans, slightly hunched, tired wide eyes, an old worn sports wristband on the right wrist, 2026 tech festival hall background, photorealistic skin, cinematic lighting` + 负面提示。
- 锚点：黑框眼镜（戴）+ 右手腕旧运动手环 + 黑发乱翘 + 微驼 + 眼神涣散

**[燃态 / 94 年擂台]**
`hyper-realistic photograph of the same real 30-year-old Chinese man, now in a martial-arts gi, upright posture, sharp intense eyes, confident smirk, black-framed glasses removed and tucked into pocket, the same old sports wristband still on the right wrist, glowing under arena light, a dark empty dojo, photorealistic skin` + 负面提示。
- 锚点：武道服 + 站直 + 眼神锐利 + **眼镜摘下** + 手环仍在（与怂态同一人，脸须一致）

**[摘镜出招]**
`extreme close-up of the real man's face, black-framed glasses held in hand being taken off, wristband visible, focused expression, motion blur on a punch, martial-arts gi, cinematic rim light, photorealistic skin texture` + 负面提示。

> ⚠️ 三条须**同一张脸**：以怂态脸为基准，燃态/摘镜仅改体态与眼镜，不换手环与脸型。

---

## P02 董泉博士（真人写实风）

`hyper-realistic photograph of a real 48-year-old Chinese man, physicist, white lab coat, thin frame, gray-streaked white hair, tired but sharp eyes, a pen in the coat pocket, a modern 2026 laboratory background, photorealistic skin, cinematic lighting` + 负面提示。

## P03 草薙京（真人写实风）

`hyper-realistic photograph of a real 20-year-old East Asian man, 181cm/75kg lean athletic with flowing natural muscle definition and slightly lowered center of gravity, light-bronze skin with realistic pores and a subtle sweat sheen, sharp angular jaw with a cocky defiant smirk, cold blue-grey eyes, light BROWN hair in a clean center part with tousled flyaway tips (NOT golden, NOT a ponytail, NOT long), a white bandana/head-scarf tied on top with hanging corners, a LARGE golden sun-crest emblem printed on the BACK of the jacket (NOT on the forehead), a white SLEEVELESS open-collar student uniform, fingerless gloves with wrist wraps, dark blue jeans, white sneakers, relaxed confident stance, pure white seamless studio background, no cast shadow, photorealistic, NO face scars` + 负面提示。
- **锁脸主基准 = 全身白底参考照**：纯白无缝棚拍背景(#fff)、无落地阴影、双手不持物、平视自然站立；近景/侧背/草薙之火红焰/静立全套见同目录 `草薙京_真人形象prompt.md`。
- ⚠️ 发色=**浅棕**（非金色）；烈阳徽章=**背后**（非额头）；火焰为**红焰**（八神=紫焰、二阶堂=电光，勿混色）。

## P03b 草薙京 · 黑衣/西装版（KOF'99–'2000，真人写实风）

`hyper-realistic photograph of a real 20-year-old East Asian man, 181cm lean athletic with flowing natural muscle definition, light-bronze skin with a subtle sweat sheen, sharp angular jaw with a cocky defiant smirk, cold grey eyes, light BROWN hair in a clean center part (NOT golden, NOT a ponytail, NOT long), a white bandana tied on top, an open DARK-NAVY blazer-style jacket with gold button trim over a white sleeveless undershirt, black fingerless gloves with a small printed GOLD SUN-CREST on the back of the glove, a gold-buckle belt with woven sash, slim black trousers, white sneakers, one hand reaching forward with fingers spread (Kyo fire-charge stance) or both hands empty at sides, pure white seamless studio background, no cast shadow, photorealistic, NO face scars` + 负面提示。
- **全身白底锁脸主基准**（近景/侧背/出招红焰/静立全套）见同目录 `草薙京_黑衣版_真人形象prompt.md`。
- ⚠️ 与 **P03 KOF94 学生装版**（白开襟学生装 + 蓝裤）是**同一张脸、两个造型版本**，整部剧统一 1994 用 P03，走现代/黑衣用 P03b；出图时发色易漂成金色/中长发 → 负面务必带 `no golden hair, no long hair`。

## P04 二阶堂红丸（真人写实风）

`hyper-realistic photograph of a real 21-year-old Japanese-American mixed-heritage man, 180cm lean athletic, handsome angular face with a high nose bridge and a bright grin, short golden buzz/flat-top hair with strands standing UP (static, NOT long hair, NOT red), blue eyes, blue sleeveless vest with cross embroidery, blue knee-length shorts, woven waraji sandals, gold wristwatch, one hand raised with light electric sparks, cocky charismatic presence, realistic skin, cinematic lighting, NO face scars, no long hair` + 负面提示。
- **真人写实全套**（近景/侧背/雷光电光/静立）见同目录 `二阶堂红丸_真人形象prompt.md`。
- ⚠️ 能量为**黄白色电光**（草薙京=红焰、八神=紫焰，勿混色）；发型为金色短寸，勿生成长发/红发。

## P04b 大门五郎（真人写实风，相扑手）

`hyper-realistic photograph of a real heavyset Japanese man in his late 20s, a real sumo-wrestler physique (massive but naturally proportioned, not bodybuilder-blocky), tanned skin with realistic pores, short black hair, a white headband tied across the forehead with a red circular crest, both arms raised with open palms facing outward, white wrist wraps, a black belt, loose white sumo-style hakama trousers, wooden geta sandals, a wide stable sumo stance with legs apart, a calm gentle confident expression, pure white seamless studio background (#ffffff), no cast shadow, photorealistic, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/古武术投技无元素特效/静立）见同目录 `大门五郎_真人形象prompt.md`。
- ⚠️ **无元素特效**（纯摔技，区别于其他角色的火焰/电光/气旋）；体型务必"相扑大块头但比例自然"，勿健美块状。

## P04c 二阶堂红丸 · 抹胸造型版（真人写实风）

`hyper-realistic photograph of a real lean handsome mixed-heritage young man in his early 20s, 180cm fit athletic with flowing muscle definition, tanned skin with realistic pores, a sharp handsome face with a confident grin, dark blue eyes, BLOND spiky SHORT hair standing UP with static strands (NOT long, NOT red), a black cropped sleeveless tank top revealing his toned midsection and abs, loose cream trousers with thin dark side stripes, black fingerless gloves with wrist wraps, dark leather shoes, both hands raised near his head, faint blue-white ELECTRIC sparks at his fingertips, wide athletic stance, pure white seamless studio background (#ffffff), no cast shadow, photorealistic, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/雷光电光/静立）见同目录 `二阶堂红丸_抹胸版_真人形象prompt.md`。
- ⚠️ 本版 = **黑色抹胸 + 米白长裤**（与 P04 KOF94 蓝背心版是**同一张脸两造型**）；能量为**黄白色电光**（草薙京=红焰、八神=紫焰、椎拳崇=青白气旋，勿混色；电光非火）；发型金色竖寸，勿生成长发/红发。

## P05 椎拳崇（真人写实风）

`hyper-realistic photograph of a real 20-year-old East Asian man with a round friendly face and a goofy cheerful grin, deep-blue short hair, round goggles pushed up on his forehead, wearing a purple martial-arts gi, matching purple trousers, a woven ki belt, black martial boots, a low ki-gathering stance, calm confident aura, photorealistic skin, cinematic lighting, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/龙卷飓风气旋/静立）见同目录 `椎拳崇_真人形象prompt.md`。
- ⚠️ 能量为**青白色气旋**（草薙京=红焰、八神=紫焰、二阶堂=电光，勿混色）。

## P06 八神庵（真人写实风）

`hyper-realistic photograph of a real 20-year-old East Asian man, 182cm lean athletic, sharp jaw, wine-red short hair with thick straight bangs COVERING the left eye, dark violet-purple eyes, subtle cruel smirk, black half-buttoned jacket with a thin white crescent-moon crest on the back, open white long shirt, dark red trousers tied at shins with a red leather strap, black choker, silver ring, low crouched fighting stance, realistic skin texture, cinematic lighting, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/无式焚天紫焰/静立）见同目录 `八神庵_真人形象prompt.md`。
- ⚠️ 官方**无脸疤**；火焰为**紫焰**（草薙京=红焰，勿混色）。
- **写实铁律**：出图须照片级真人，负面提示已强制 `no anime / no cartoon / no cgi / no game character`。

## P07 吉斯·南镇（禁全脸，真人写实风）
- **[侧脸]** `hyper-realistic photograph of a real silver-haired middle-aged man in an elegant tailored suit, a serene dangerous smile, cold color grading, ONLY the side profile visible, dark background, photorealistic skin, cinematic low-key lighting, NO face scars` + 负面提示。
- **[手部]** `hyper-realistic close-up of a real refined hand in a suit cuff, holding a pen / tapping, silver hair visible at the edge, cold tone, photorealistic skin texture` + 负面提示。
- **[背影]** `hyper-realistic photograph, back view of a real elegant silver-haired man in a suit, cold cinematic silhouette in front of a black sedan at night, low-key lighting, photorealistic` + 负面提示。
- ⚠️ 三条**绝不露正面全脸**（第二季悬念命门）。

## P08 隐世高人（真人写实风）

`hyper-realistic photograph of a real ancient East Asian master in his 80s, full white beard and hair, gray ragged robes, leaning on a weathered wooden staff, serene powerful aura, a misty bamboo grove / old wooden pavilion, photorealistic skin, cinematic low-key light` + 负面提示。

## P09 街头武者（赤膊，真人写实风）

`hyper-realistic photograph of a real East Asian street brawler in his 30s, bare chest with old tattoos, aggressive stance, loose worn clothes, a back-alley at dusk, rough and gritty, photorealistic skin` + 负面提示。

## P10 大赛 MC（真人写实风）

`hyper-realistic photograph of a real East Asian fighting-tournament host in a formal suit, holding a microphone, confident host expression, a dazzling neon tournament stage with a packed crowd behind, photorealistic skin, cinematic lighting` + 负面提示。

---

## 一致性校验（生成后必查）

- [ ] 吴真三态同脸，手环全程在，眼镜状态符合"怂戴/燃摘"
- [ ] 三强（京/红丸/拳崇）各一固定脸，跨段不变
- [ ] 八神侧/背，吉斯**绝不全脸**
- [ ] 全片无现代电子（除镜002 手机）
- [ ] 无血腥、无变形脸
