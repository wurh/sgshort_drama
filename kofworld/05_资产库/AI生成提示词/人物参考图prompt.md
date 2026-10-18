# 人物参考图 · AI 生成 Prompt（第一季）

> 用途：喂给 AI 图生图，产出固定角色参考图。每段 prompt 含【主体描述 + 固定视觉锚点 + 风格 + 负面提示】。
> 通用风格前缀（加在每条开头）：
> `cinematic anime style, consistent character reference sheet, front and side view, studio neutral gray background, detailed, high quality, KOF fighting game character, 90s retro era`
> 通用负面提示（加在每条结尾）：
> `no modern smartphones, no modern electronics, no gore, no realistic blood, no extra fingers, no watermark, no text, no deformed face, consistent identity`

---

## P01 吴真（主角）

**[怂态 / 现代 2026]**
`30-year-old Chinese male programmer, messy black hair, black-framed glasses, old worn T-shirt and jeans, slightly hunched, tired wide eyes, right wrist wearing an old worn sports wristband, 2026 tech festival background` + 负面提示。
- 锚点：黑框眼镜（戴）+ 右手腕旧运动手环 + 黑发乱翘 + 微驼 + 眼神涣散

**[燃态 / 94 年擂台]**
`same 30-year-old Chinese man, now in martial arts uniform (dojo gi), upright posture, sharp intense eyes, confident smirk, black-framed glasses OFF (removed, tucked into pocket), right wrist still wearing the same old sports wristband, glowing under arena light, KOF 94 retro dojo` + 负面提示。
- 锚点：武道服 + 站直 + 眼神锐利 + **眼镜摘下** + 手环仍在（与怂态同一人，脸须一致）

**[摘镜出招]**
`close-up of the man's face, black-framed glasses held in hand being taken off, wristband visible, focused expression, motion blur on a punch, dojo gi, cinematic` + 负面提示。

> ⚠️ 三条须**同一张脸**：以怂态脸为基准，燃态/摘镜仅改体态与眼镜，不换手环与脸型。

---

## P02 董泉博士

`48-year-old Chinese male physicist, white lab coat, thin frame, gray-streaked white hair, tired but sharp eyes, a pen in the coat pocket, scientific genius aura, 2026 tech lab background` + 负面提示。

## P03 草薙京

`young Japanese fighter, golden hair in a ponytail with a strand over the forehead, forehead ornament with a subtle flame emblem, white martial arts uniform, arrogant confident expression, KOF 94, 90s retro` + 负面提示。

## P04 二阶堂红丸

`young Japanese fighter, red hair, blue tank top and shorts, muscular build, sunny grin with fierce eyes, cracking his sleeves to summon electricity (lightning arcs at hands), KOF 94, 90s retro` + 负面提示。

## P05 椎拳崇

`young Japanese fighter, blue hair, purple martial arts uniform, round goggles on head (or removed), round friendly face with a goofball grin, ki-arts practitioner, KOF 94, 90s retro` + 负面提示。

## P06 八神庵

`young Japanese fighter, red hair, black leather jacket, three facial scars, cold menacing eyes, shadowy presence, side and back view preferred (not full front), KOF 94, 90s retro` + 负面提示。

## P07 吉斯·南镇（禁全脸）
- **[侧脸]** `elegant villain, silver hair, tailored suit, a serene dangerous smile, cold color grading, ONLY side profile visible, dark background, KOF 94, 90s retro` + 负面提示。
- **[手部]** `close-up of a refined hand in a suit cuff, holding a pen / tapping, silver hair visible at edge, cold tone` + 负面提示。
- **[背影]** `back view of an elegant silver-haired man in a suit, silhouette, cold cinematic tone, in front of a black sedan at night` + 负面提示。
- ⚠️ 三条**绝不露正面全脸**（第二季悬念命门）。

## P08 隐世高人

`ancient wise martial master, full white beard and hair, gray ragged robes, leaning on a wooden staff, serene powerful aura, bamboo forest / old pavilion, 90s retro East Asia` + 负面提示。

## P09 街头武者（赤膊）

`90s Chinese street brawler, bare chest with old tattoos, aggressive stance, loose 90s clothes, back-alley dusk, rough` + 负面提示。

## P10 大赛 MC

`fighting tournament host, formal suit, holding a microphone, confident host expression, neon tournament stage background, KOF 94, 90s retro` + 负面提示。

---

## 一致性校验（生成后必查）

- [ ] 吴真三态同脸，手环全程在，眼镜状态符合"怂戴/燃摘"
- [ ] 三强（京/红丸/拳崇）各一固定脸，跨段不变
- [ ] 八神侧/背，吉斯**绝不全脸**
- [ ] 全片无现代电子（除镜002 手机）
- [ ] 无血腥、无变形脸
