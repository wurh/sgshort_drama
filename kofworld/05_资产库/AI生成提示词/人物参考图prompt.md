# 人物参考图 · AI 生成 Prompt（第一季）

> 用途：喂给 AI 图生图，产出固定角色参考图。每段 prompt 含【主体描述 + 固定视觉锚点 + 风格 + 负面提示】。
> **全库统一为真人写实风**（本文件与专用真人 prompt 文件一致：草薙京 / 二阶堂红丸 / 八神庵 / 椎拳崇 / 大门五郎 / 特瑞博加德 各有一份"全套写实版"）。
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
- 🔒 **脸型锚点（2026-10-18 定稿）**：草薙京统一用真实男演员脸 `05_资产库/参考图/草薙京_脸型参照.png` 锁脸（ImageGen image-to-image `input_fidelity=medium`）；定稿图 = 半身近景 `.../AI生成图/imagegen/A_REAL_East_Asian_young_man_in_2026-10-18T13-41-56.png` + 全身白底 `.../AI生成图/imagegen/A_REAL_East_Asian_young_man_in_2026-10-18T13-52-18.png`（右下角带引擎"AI生成"水印，按用户要求保留）。
- ⚠️ 发色=**浅棕**（非金色）；烈阳徽章=**背后**（非额头）；火焰为**红焰**（八神=紫焰、二阶堂=电光，勿混色）。

## P03b 草薙京 · 黑衣/西装版（KOF'99–'2000，真人写实风）

`hyper-realistic photograph of a real 20-year-old East Asian man, 181cm lean athletic with flowing natural muscle definition, light-bronze skin with a subtle sweat sheen, sharp angular jaw with a cocky defiant smirk, cold grey eyes, light BROWN hair in a clean center part (NOT golden, NOT a ponytail, NOT long), a white bandana tied on top, an open SOLID BLACK blazer-style jacket with gold button trim (NOT navy, sleeves rolled up to the forearms with bare skin forearms and hands exposed, NO orange fabric on the arms) over a white sleeveless undershirt, black fingerless gloves with a small printed GOLD SUN-CREST on the back of the hand (NOT orange gloves), a gold-buckle belt with woven sash, slim black trousers, white leather shoes, one hand reaching forward with fingers spread (Kyo fire-charge stance) or both hands empty at sides, pure white seamless studio background, no cast shadow, photorealistic, NO face scars` + 负面提示。
- **全身白底锁脸主基准**（近景/侧背/出招红焰/静立全套）见同目录 `草薙京_黑衣版_真人形象prompt.md`。
- 🔒 **脸型锚点（2026-10-18 定稿）**：黑衣版锁脸用 `05_资产库/参考图/草薙京_脸型参照.png`（ImageGen image-to-image `input_fidelity=medium`，双图=黑衣参照2+脸型参照）；定稿=全身白底（**撸袖露小臂·无橙**）`.../imagegen/A_REAL_East_Asian_young_man_in_2026-10-18T14-21-49.png` + 赤焰出招 `.../imagegen/A_REAL_East_Asian_young_man_in_2026-10-18T14-06-40.png`。
- **配色铁律（用户 2026-10-18 最终）**：外套=**纯黑**（非深蓝）；**袖子撸到小臂、露出小臂与手（无橙色布料、也非全黑垂袖）**；手套=**黑+金色太阳纹章**（非橙色）；**白色皮鞋**；火焰=**赤炎红焰**。
- ⚠️ 与 **P03 KOF94 学生装版**（白开襟学生装 + 蓝裤）是**同一张脸、两个造型版本**，整部剧统一 1994 用 P03，走现代/黑衣用 P03b；出图时发色易漂成金色/中长发 → 负面务必带 `no golden hair, no long hair`；外套易漂深蓝、前臂易冒橙色 → 负面加 `no navy jacket, no orange, no orange sleeves`。

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

## P04d 特瑞·博加德（真人写实风，美式街头拳手）

`hyper-realistic photograph of a real 24-year-old American street-fighter man, light tanned Caucasian skin with realistic pores and a light sweat sheen, square jaw with a confident cocky grin, steel-blue eyes, light BLONDE short hair with a slightly spiky fringe and ONE long blonde ponytail/braid hanging down the BACK of his head over his back (NOT a side-lock in front of the chest), a red-and-white snapback cap with a small red "TERRY B." fabric print on the front, a red SLEEVELESS vest with shredded white-fleece frayed edges over a plain white tank top, medium-blue straight jeans with a black belt, black hand wraps on both wrists, red high-top canvas sneakers, walking forward with fists at guard height, pure white seamless studio background (#ffffff), no cast shadow, photorealistic, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/拳法无特效/静立 + Agnes 图生图）见同目录 `特瑞博加德_真人形象prompt.md`。
- ⚠️ 美式街头拳手，**浅白人肤色 + 天然金发**（无需纠成棕）；**无元素特效**（纯拳法/尘土，区别于草薙红焰/八神紫焰/二阶堂电光/椎拳崇气旋；与大门同属"无特效"，区别=金发+红帽+撕裂红背心）。
- 🔒 **脑后辫（2026-10-18 修正）**：特瑞金发是**脑后扎长辫垂背后/后颈**（非侧辫垂前胸）；定稿图 `05_资产库/AI生成图/imagegen/Re_render_this_street_fighter__2026-10-18T15-35-46.png`（脑后辫版，旧侧辫版 `...T13-38-50.png` 废弃）。
- **参照图（图生图锚点）**：`05_资产库/参考图/特瑞博加德_经典款_参照.png`；Agnes key = `terry`（`python tools/agnes_img2img.py terry 2K 9:16`）。

## P04e 安迪·博加德（真人写实风，美式街头拳手，特瑞之弟）

`hyper-realistic photograph of a real 24-year-old American street-fighter man, light tanned Caucasian skin with realistic pores, square jaw with a cold stern expression, steel-blue eyes, long light BLONDE straight hair falling to the shoulders, a white SLEEVELESS tank top with a RED FLAME-TIP trim along the neckline and hem, RED forearm wraps, a black waist belt, white shorts with RED leg wraps extending down the shins, tall RED leather boots with white laces, arms crossed over the chest, pure white seamless studio background (#ffffff), no cast shadow, photorealistic, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/拳法无特效/静立 + Agnes 图生图）见同目录 `安迪博加德_真人形象prompt.md`。
- ⚠️ 美式街头拳手（**特瑞之弟**，美系无特效阵营）；**金发中长直发（垂肩，非短寸）**；**白背心红色火焰纹边 + 红护腕 + 红绑腿 + 红色长靴**；**无元素特效**（纯拳法/尘土；与特瑞=金短发侧辫+红帽+撕裂红背心区别开；与大门同属"无特效"）。
- **参照图（图生图锚点）**：`05_资产库/参考图/安迪博加德_经典款_参照.png`；Agnes key = `andy`（`python tools/agnes_img2img.py andy 2K 9:16`）。

## P04f 东丈 / 崔·东次（真人写实风，韩国跆拳道·无特效）

`hyper-realistic photograph of a real 24-year-old Korean taekwondo fighter, light-tanned skin with realistic pores and a subtle sweat sheen, square jaw with a fierce focused expression, cold dark eyes, black short SPIKY hair with a few flyaway strands, a white cloth headband tied across the forehead with a small RED dot crest on the center, bare-chested with visible chest and ab muscles, thick white hand wraps on both wrists and forearms, loose RED taekwondo shorts with a black waist belt and a small gold name-plate, brown leg wraps on both shins, barefoot, a wide stable fighting stance with both fists raised at guard height, pure white seamless studio background (#ffffff), no cast shadow, photorealistic, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/跆拳道腿法无特效/静立 + Agnes 图生图）见同目录 `东丈_真人形象prompt.md`。
- ⚠️ 韩国跆拳道格斗家，**无元素特效**（纯跆拳道拳腿法/尘土，与大门/特瑞/安迪同属"无特效"）；**赤膊 + 红跆拳道短裤 + 白护额红点 + 棕缠腿带 + 黑短刺猬头**，出图务必 `no elemental effects, no fire`。
- **参照图（图生图锚点）**：`05_资产库/参考图/东丈_经典款_参照.png`；定稿图 `05_资产库/AI生成图/imagegen/Re_render_this_martial_arts_fi_2026-10-18T15-11-42.png`（ImageGen，带引擎水印）；Agnes key = `dongzhang`（`python tools/agnes_img2img.py dongzhang 2K 9:16`）。

## P04h 哈维·D（真人写实风，美式拳击手·黑人·无特效）

`hyper-realistic photograph of a real Black/African-American man in his 30s, a tall lean heavily-muscled professional boxer, dark rich brown Black skin with realistic pores and a subtle sheen, a tall high MOPPYCORN / mohawk (sides shaved, a high vertical crest of black hair on top), black sunglasses, an OPEN black varsity/letterman jacket with RED and WHITE stripe trim on the collar, cuffs and hem (unbuttoned, revealing bare defined chest and abs), black boxing shorts with a WHITE band at the hems, white fingerless boxing gloves with white wrist wraps, tall black high-top boxing boots, fists up at guard, pure white seamless studio background (#ffffff), no cast shadow, photorealistic, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/拳法无特效/静立 + Agnes 图生图）见同目录 `哈维D_真人形象prompt.md`。
- ⚠️ KOF 美式拳击手（"The Real McCoy"，与特瑞/安迪同系美系，**黑人**），**无元素特效**（纯拳击，出图务必 `no fire, no elemental effects`）；**顶髻莫西干 + 黑墨镜 + 黑红白条纹棒球夹克（敞开露胸腹）+ 黑拳击短裤（膝盖白滚边）+ 白露指拳套 + 黑高帮靴**。
- **参照图（图生图锚点）**：`05_资产库/参考图/哈维D_经典款_参照.png`；定稿图 `05_资产库/AI生成图/imagegen/Re_render_this_boxer_as_a_REAL_2026-10-22T15-09-10.png`（ImageGen，带引擎水印）；Agnes key = `harveyD`（`python tools/agnes_img2img.py harveyD 2K 9:16`）。

## P04i 洛奇·古洛巴（真人写实风，篮球主题格斗家·黑人·无特效）

`hyper-realistic photograph of a real Black/African-American man in his late 20s, a tall athletic professional basketball player physique, dark rich brown Black skin with realistic pores and a subtle sheen, a PINK backwards baseball cap (brim facing the back), a color-blocked hoodie in PINK and NAVY with a large WHITE hood and a white chest panel with drawstrings, PINK basketball shorts with a WHITE band at the hems, thick white wrist wraps on both wrists, high-top sneakers in purple-pink with white soles, holding a single ORANGE basketball in one hand, a confident relaxed street-athlete stance, pure white seamless studio background (#ffffff), no cast shadow, NO text, NO arrows, NO Japanese text, photorealistic, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/篮球动作无特效/静立 + Agnes 图生图）见同目录 `洛奇古洛巴_真人形象prompt.md`。
- ⚠️ KOF 篮球主题格斗家（**黑人**），**无元素特效**（纯篮球运动，出图务必 `no fire, no elemental effects`）；**粉色反戴棒球帽 + 粉/藏青/白拼色连帽卫衣（白帽兜）+ 粉篮球短裤（白滚边）+ 双手白护腕 + 紫粉高帮球鞋 + 橙色篮球**；⚠️ 官方图底部"声优：山岸治雄"字幕与球上"›"是 UI/水印，**出图务必排除**（`NO text, NO letters, NO arrows, NO Japanese text`）。
- **参照图（图生图锚点）**：`05_资产库/参考图/洛奇古洛巴_经典款_参照.png`；定稿图 `05_资产库/AI生成图/imagegen/Re_render_this_basketball_them_2026-10-22T15-24-56.png`（ImageGen，带引擎水印）；Agnes key = `rocky`（`python tools/agnes_img2img.py rocky 2K 9:16`）。

## P04j 拜仁·巴特乐（真人写实风，美式肌肉拳手·右肩金属罐·无特效）

`hyper-realistic photograph of a real muscular 30-year-old man with a deeply tanned sun-bronzed / medium-brown complexion (NOT pale, NOT white), short spiky REDDISH-ORANGE / ginger hair, a BLUE t-shirt with a large YELLOW five-pointed STAR on the chest and RED-WHITE striped cuffs, a SILVER METAL TANK / pressurized canister strapped to his right shoulder with a brown leather diagonal harness, thick white wrist wraps on both wrists, loose light-blue / teal trousers, white high-top sneakers with blue accents, one straight punch extended with the other at guard, heavy muscle definition, photorealistic skin, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/直拳无特效/静立 + Agnes 图生图）见同目录 `拜仁巴特乐_真人形象prompt.md`。
- ⚠️ 美式肌肉拳手（与特瑞/安迪/哈维同系美系），**无元素特效**（纯拳法，出图务必 `no fire, no elemental effects`）；**红橙刺发 + 蓝T恤（胸前黄星 + 红白条纹袖口）+ 右肩银色金属罐（棕色斜跨绑带，实物道具非武器）+ 双手白护腕 + 浅蓝长裤 + 蓝白高帮鞋**；**肤色=古铜/小麦色（勿出成浅白人）**，调法=肤色句写 `a deeply tanned sun-bronzed complexion (NOT pale)`。
- **参照图（图生图锚点）**：`05_资产库/参考图/拜仁巴特乐_经典款_参照.png`；定稿图 `05_资产库/AI生成图/imagegen/Re_render_this_heavyweight_box_2026-10-22T15-32-17.png`（ImageGen，带引擎水印，肤色偏浅待调）；Agnes key = `bayern`（`python tools/agnes_img2img.py bayern 2K 9:16`）。

## P04k 金家藩（真人写实风，KOF中国风·腿法/音速踢·无特效）

`hyper-realistic photograph of a real 28-year-old East Asian man, lean athletic with defined muscle, warm light-tanned East Asian skin with realistic pores, a square jaw with a calm focused gaze, short dark-brown hair with side-swept bangs, a sleeveless off-white V-neck martial-arts gi top with NAVY trim on the collar and front opening and two small navy rectangular fastenings on the chest, a black fabric waist belt, navy wrist wraps, loose off-white wide martial-arts trousers, navy straw sandals (barefoot), hands on hips in a stable ready stance, pure white seamless studio background (#ffffff), no cast shadow, photorealistic, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/音速踢无特效/静立 + Agnes 图生图）见同目录 `金家藩_真人形象prompt.md`。
- ⚠️ KOF 中国风腿法手（"Kick Master" 音速踢 Sonic Break），**无元素特效**（纯腿法，出图务必 `no fire, no elemental effects`）；**深棕短发 + 米白 V 领无袖道服（藏青滚边 + 胸前双扣）+ 黑腰带 + 藏青护腕 + 米白道裤 + 藏青草履（赤脚）+ 双手叉腰**。
- **参照图（图生图锚点）**：`05_资产库/参考图/金家藩_经典款_参照.png`；定稿图 `05_资产库/AI生成图/imagegen/Re_render_this_Chinese_martial_2026-10-22T15-38-24.png`（ImageGen，带引擎水印）；Agnes key = `jinfan`（`python tools/agnes_img2img.py jinfan 2K 9:16`）。

## P04l 陈国汉（真人写实风，KOF中国风·链拳 Heavy Chain·赵豹之父·无特效）

`hyper-realistic photograph of a real large broad-shouldered bald East Asian man in his 40s with a heavy strongman build, tanned sun-bronzed skin with realistic pores, a thick full BLACK beard, a military olive-grey work jacket and matching dark trousers, a heavy IRON CHAIN wrapped around his torso and hanging across his shoulders (a real metal weapon, NOT glowing), barefoot, one hand gripping the top of the chain and the other held to his head in a low crouching stance, an intense fierce expression, pure white seamless studio background (#ffffff), no cast shadow, NO text, NO watermark, NO letters, photorealistic, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/链拳无特效/静立 + Agnes 图生图）见同目录 `陈国汉_真人形象prompt.md`。
- ⚠️ KOF 中国风链拳手（"Heavy Chain" 赵豹之父），**无元素特效**（纯链拳，出图务必 `no fire, no elemental effects`；铁链=实物武器不发光）；**光头 + 浓密黑络腮胡 + 军橄榄灰作训服 + 缠绕全身粗铁链 + 赤脚**；官方图底部 "aigei.com" 是网站水印，**出图务必排除**（`NO text, NO watermark, NO letters`）。
- **参照图（图生图锚点）**：`05_资产库/参考图/陈国汉_经典款_参照.png`；定稿图 `05_资产库/AI生成图/imagegen/Re_render_this_Chinese_heavy_c_2026-10-22T15-45-46.png`（ImageGen，带引擎水印）；Agnes key = `guohan`（`python tools/agnes_img2img.py guohan 2K 9:16`）。

## P04m 蔡宝健（真人写实风，KOF中国僵尸街头格斗家·双手金属利爪·无特效·写实成人非绿皮）

`hyper-realistic photograph of a real 32-year-old East Asian man, lean and wiry with a feral weathered look, tanned sun-bronzed skin with a slightly cold ashen cast (NOT pale) and realistic pores, a gaunt angular face with a wild manic grin, a brown wide-brim FEDORA / felt hat with a BLUE hat band, black square-frame sunglasses, a sleeveless off-white / light-grey vest with thin navy trim and a navy sash belt, loose dark-navy wide lantern trousers, brown work boots, both arms thrust forward in a crouch with each hand wearing a wrist-mounted metal CLAW GLOVE with several long pointed FINGER CLAWS extended, NOT a green-skinned cartoon zombie, NOT glowing, NO text, NO watermark, NO letters, pure white seamless studio background (#ffffff), no cast shadow, photorealistic, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/利爪快击无特效/静立 + Agnes 图生图）见同目录 `蔡宝健_真人形象prompt.md`。
- ⚠️ KOF 中国僵尸街头格斗家，**无元素特效**（纯利爪拳法，出图务必 `no fire, no elemental effects`）；**招牌=双手护腕各伸出多根金属利爪（claw gloves），不是拳头/直拳**；**"僵尸"主题必须写实成人化**：皮肤古铜偏冷灰调（slightly cold ashen cast），**不做绿皮肤、不做发光、不做卡通僵尸**（`no green skin, no zombie caricature`）；**棕色宽檐毡帽（蓝帽带）+ 黑墨镜 + 米白无袖背心（藏青滚边+藏青腰带）+ 藏青灯笼裤 + 棕色靴**；⚠️ 官方图底部"全网号 初衷说游戏"是网站水印，出图务必排除（`NO text, NO watermark, NO letters, NO Chinese text`）。
- **参照图（图生图锚点）**：`05_资产库/参考图/蔡宝健_经典款_参照.png`（新官方伸爪图，已覆盖）；定稿图 `05_资产库/AI生成图/imagegen/Re_render_this_Chinese_street__2026-10-22T16-04-15.png`（ImageGen 伸爪版，带引擎水印，肤色偏浅待调；旧直拳版 T15-57-09 作废）；Agnes key = `caibaojian`（`python tools/agnes_img2img.py caibaojian 2K 9:16`）。

## P04n 哈迪伦（真人写实风，KOF军装格斗家·右眼黑眼罩·蓝军装·无特效纯军装格斗/摔技）

`hyper-realistic photograph of a real 35-year-old East Asian man, lean and highly muscular with a disciplined military physique, tanned sun-bronzed East Asian skin with visible pores, a square jaw with a cold stern military expression, a BLUE military peaked cap with a small crest, a black leather EYEPATCH over his RIGHT eye (NOT sunglasses), a fitted long-sleeved BLUE military / utility jacket with a small gold button and a RED-ORANGE padded shoulder EPaulet on the right shoulder and a red-orange panel on the chest, a black inner undershirt, a black leather belt with a gold buckle, matching BLUE military trousers, tall black leather service boots, black full-finger combat gloves, one hand raised with fingers curled and the other relaxed at his side in a military guard, pure white seamless studio background (#ffffff), no cast shadow, NO text, NO arrows, photorealistic, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/军装格斗无特效/静立 + Agnes 图生图）见同目录 `哈迪伦_真人形象prompt.md`。
- ⚠️ KOF 军装格斗家（Hadren），**无元素特效**（纯军装格斗/摔技，出图务必 `no fire, no elemental effects`）；**蓝色军帽（金属徽）+ 右眼黑色皮眼罩（EYEPATCH 皮套，非墨镜）+ 蓝色军装制服（金扣）+ 右肩红橙色护肩 + 胸前红橙色拼块 + 黑色内衬打底 + 黑战术腰带金扣 + 黑全指战术手套 + 蓝色军裤 + 黑高帮皮靴 + 右手握拳+左手垂放**；军装=**蓝色系（非深绿/橄榄绿）**、护肩=**红橙色（非纯红）**、右眼=**黑皮眼罩（非墨镜）**；⚠️ 官方图两侧黄色三角箭头是 UI 导航，出图务必排除（`NO text, NO arrows`）。
- **参照图（图生图锚点）**：`05_资产库/参考图/哈迪伦_经典款_参照.png`（新官方眼罩+蓝军装图，已覆盖）；定稿图 `05_资产库/AI生成图/imagegen/Re_render_this_military_style__2026-10-24T08-14-07.png`（ImageGen 眼罩+蓝军装版，带引擎水印，肤色偏浅待调；旧"黑墨镜+深绿军装"版 T08-06-53 作废）；Agnes key = `hadren`（`python tools/agnes_img2img.py hadren 2K 9:16`）。

## P04o 拉尔夫·琼斯（真人写实风，KOF美式街头拳手·无特效纯拳法）

`hyper-realistic photograph of a real 30-year-old muscular East Asian street fighter, tanned sun-bronzed skin with heavy muscle definition and a subtle sweat sheen and visible pores, short dark-brown hair, a long RED headband with GREEN STAR / GREEN TRIANGLE pattern tied across his forehead with the long tail fluttering behind him, a dark PURPLE / aubergine SLEEVELESS tactical vest over a dark olive-green long-sleeved shirt, dark RED boxing gloves on both hands, a brown leather waist belt with a metal buckle, loose olive-drab CARGO military trousers with two large patch pockets on the thighs, tall brown leather combat boots, one foot forward with the right fist thrust forward in a straight punch and the left fist at guard near the chin, an intense fierce determined expression, pure white seamless studio background (#ffffff), no cast shadow, photorealistic, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/拳法无特效/静立 + Agnes 图生图）见同目录 `拉尔夫琼斯_真人形象prompt.md`。
- ⚠️ KOF 美式街头拳手（拉尔夫·琼斯 Ralf Jones，特瑞/安迪 师兄），**无元素特效**（纯拳法，出图务必 `no fire, no elemental effects`）；**深棕短发 + 红绿条纹（绿星）长头巾飘带 + 深紫无袖战术背心（深绿长袖打底）+ 红色拳击手套 + 棕色皮腰带 + 军绿 cargo 工装裤（大腿大口袋）+ 棕色军靴 + 右拳前送左拳护颌**；头巾=红绿条纹（绿星）、背心=深紫/茄紫，勿漂色。
- **参照图（图生图锚点）**：`05_资产库/参考图/拉尔夫琼斯_经典款_参照.png`；定稿图 `05_资产库/AI生成图/imagegen/Re_render_this_American_street_2026-10-24T08-31-38.png`（ImageGen，带引擎水印）；Agnes key = `ralf`（`python tools/agnes_img2img.py ralf 2K 9:16`）。

## P04p 克拉克·斯蒂尔（真人写实风，KOF美式街头拳手·无特效纯拳法）

`hyper-realistic photograph of a real 30-year-old muscular Caucasian street cop / street fighter, tanned sun-bronzed skin with heavy muscle definition and a subtle sweat sheen and visible pores, slightly dirty-blonde light-golden short hair under the cap, a BLUE baseball cap, black wayfarer-style sunglasses, a fitted STEEL-BLUE / navy PADDED SLEEVELESS tactical vest with a raised collar open over a BLACK tank-top undershirt revealing a toned muscular chest and abs, dark black fingerless combat gloves on both hands, loose steel-blue cargo work trousers with large side patch pockets, dark brown leather shoes, one foot forward with one arm crossed across the chest and the other gloved fist raised, mouth open in a loud defiant shout / wild grin, an intense wild confident expression, pure white seamless studio background (#ffffff), no cast shadow, photorealistic, NO face scars, NO text, NO watermark` + 负面提示。
- **真人写实全套**（近景/侧背/拳法无特效/静立 + Agnes 图生图）见同目录 `克拉克斯蒂尔_真人形象prompt.md`。
- ⚠️ KOF 美式街头拳手（克拉克·斯蒂尔 Clark Still，特库摩 3K 小队队长，特瑞/安迪/拉尔夫 的队长），**无元素特效**（纯拳法/街头格斗，出图务必 `no fire, no elemental effects`）；**蓝色棒球帽 + 黑 wayfarer 方框墨镜 + 深藏青/钢蓝 padded 无袖战术马甲（立领敞开、露黑背心打底 + 精壮胸腹）+ 黑色露指战术手套 + 深藏青 cargo 工装裤（大腿大口袋）+ 深棕皮鞋 + 呐喊 pose（一臂横胸另一手抬起）**；⚠️ 造型二次纠正（用户"帽子是蓝色"）：**帽子=蓝色棒球帽（非灰褐鸭舌帽）**、**马甲=深藏青/钢蓝 padded（非棕褐/黑）**、**打底=黑背心（非白背心）**、**手套=黑色露指战术手套（非蓝色拳击手套）**、**工装裤=深藏青（非浅蓝/军绿）**。旧"棕褐马甲+白背心+蓝拳套"版（照官方标题图误配）与"灰褐鸭舌帽+黑全指手套"版均作废。
- **参照图（图生图锚点）**：`05_资产库/参考图/克拉克斯蒂尔_经典款_参照2.png`（经典款官方画风，藏青 padded 马甲+黑露指手套+蓝工装裤+呐喊，**主参照**，帽子改蓝）；定稿图 `05_资产库/AI生成图/imagegen/Re_render_this_American_street_2026-10-24T10-54-46.png`（ImageGen，带引擎水印）；备用官方 KOF 标题图 `05_资产库/参考图/克拉克斯蒂尔_经典款_参照3.png`（配色偏棕褐，仅备用）；Agnes key = `clark`（`python tools/agnes_img2img.py clark 2K 9:16`）。

## P04g 麻宫雅典娜（真人写实风，偶像+精神力·女）

`hyper-realistic photograph of a real 20-year-old East Asian woman, 158cm petite well-proportioned, light warm-toned Asian skin with realistic pores, a round sweet face with a bright cheerful smile, big warm dark-brown eyes, long BLACK straight hair with a PINK/MAGENTA headband tied across the forehead, a red and white cheerleader-style idol outfit (white puffy short-sleeve top under an open red vest, a pink beaded necklace, a pleated RED skirt, a red belt, RED tights, RED fingerless gloves with white cuffs, RED Mary-Jane shoes with white straps), one arm raised high with the other hand near her hip, a bright sunny idol presence, photorealistic skin, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/精神力念动力粉白能量/静立 + Agnes 图生图）见同目录 `麻宫雅典娜_真人形象prompt.md`。
- ⚠️ **女角色**（prompt 女性措辞，无 stubble/胡茬）；**精神力（Psychic）系 + 偶像**，出招=**粉白念动力/心灵波**（**非火焰、非电光**，单独一档）；**黑长直发 + 粉红头巾 + 红白啦啦演出服 + 红连裤袜 + 红露指手套 + 红色玛丽珍鞋**。
- **参照图（图生图锚点）**：`05_资产库/参考图/麻宫雅典娜_经典款_参照.png`（衣）+ `05_资产库/参考图/麻宫雅典娜_脸型参照.jpg`（脸，精致甜美脸；**出图时发色锁回黑、别跟着脸漂紫**）；定稿图 `05_资产库/AI生成图/imagegen/A_REAL_20_year_old_East_Asian__2026-10-18T15-29-46.png`（ImageGen 双图锁脸，`input_fidelity=medium`，带引擎水印）；Agnes key = `athena`（`python tools/agnes_img2img.py athena 2K 9:16`）。

## P05 椎拳崇（真人写实风）

`hyper-realistic photograph of a real 20-year-old East Asian man with a round friendly face and a confident focused gaze, medium-length BROWN hair in a CENTER part, shorter on the sides with slightly messy strands to the forehead/nape (NOT long-to-shoulders, NOT blue, NO goggles), a bright BLUE denim-style open cropped jacket with gold snap buttons over a WHITE hooded sweatshirt, matching bright BLUE athletic shorts, dark navy knee guards, grey-blue sneakers, the right white-wrapped fist raised overhead and the left arm extended forward with an open hand, photorealistic skin with pores, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/龙拳青白气旋/静立 + Agnes 图生图）见同目录 `椎拳崇_真人形象prompt.md`。
- ⚠️ **设定已更正（按官方参照图 2026-10-18 二次纠正）**：旧版"蓝发+紫道服+护目镜"及"白外套黑袖+深灰短裤"均作废；现为**棕色中分短发（两侧较短、顶部微乱）+ 蓝色牛仔开襟短外套（金按扣）+ 白连帽卫衣内搭 + 蓝色运动短裤（同蓝）+ 深蓝护膝 + 右手缠白绷拳举过头 + 左手张开前伸**，配色核心 = 蓝色系 + 棕色短发。
- 能量为**青白色气旋**（草薙京=红焰、八神=紫焰、二阶堂=电光，勿混色；气旋非火焰非电光）。
- **参照图（图生图锚点）**：`05_资产库/参考图/椎拳崇_经典款_参照.jpg`（新官方蓝牛仔图，已覆盖）；定稿图 `05_资产库/AI生成图/imagegen/Re_render_this_martial_arts_fi_2026-10-18T16-02-25.png`（ImageGen 蓝色系版，带引擎水印；旧"白外套"版 T15-48-57 作废）；Agnes key = `kunkuragi`（`python tools/agnes_img2img.py kunkuragi 2K 9:16`）。

## P05b 镇元斋（KOF 中国队·老拳师，真人写实风，无特效）

`hyper-realistic photograph of a real East Asian elderly man in his 70s, an old Chinese martial-arts grandmaster, short and weathered build, an olive-drab army-peaked cap with a small round embroidered crest on the front, a full WHITE beard and white mustache, wispy white hair, an olive-green traditional Chinese mandarin-collar tunic with matching trousers and thin WHITE trim on the collar, cuffs and hems, a row of large round COPPER gong-fu balls/coins strapped across his back, holding a short wooden staff in both hands in a low crouching horse stance, deeply wrinkled elderly skin with age spots, calm deep focused eyes, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/古武道出招无特效/静立 + Agnes 图生图）见同目录 `镇元斋_真人形象prompt.md`。
- ⚠️ **无元素特效**（纯古武道/气功，出图务必 `no fire, no elemental effects`，与大们/特瑞/安迪/东丈同属"无特效"阵营；区别 = 白发白须老者 + 橄榄绿军帽 + 橄榄绿盘扣练功服 + 背后铜球）。
- **参照图（图生图锚点）**：`05_资产库/参考图/镇元斋_经典款_参照.jpg`；定稿图 `05_资产库/AI生成图/imagegen/Re_render_this_Chinese_martial_2026-10-18T16-09-42.png`（ImageGen，带引擎水印）；Agnes key = `zhenyuanzhai`（`python tools/agnes_img2img.py zhenyuanzhai 2K 9:16`）。

## P06 八神庵（真人写实风）

`hyper-realistic photograph of a real 20-year-old East Asian man, 182cm lean athletic, sharp jaw, deep wine-red LONG hair, chin-length falling behind ears and over the nape, thick straight bangs COVERING the left eye, dark violet-purple eyes, subtle cruel smirk, fitted SOLID BLACK half-buttoned jacket with a thin white crescent-moon crest on the back, open white long shirt, dark maroon-red trousers tied at shins with a red leather strap, black choker, silver ring, low crouched fighting stance, realistic skin texture, cinematic lighting, NO face scars` + 负面提示。
- **真人写实全套**（近景/侧背/无式焚天紫焰/静立 + Agnes 图生图）见同目录 `八神庵_真人形象prompt.md`。
- ⚠️ 官方**无脸疤**；火焰为**紫焰**（草薙京=红焰，勿混色）；**外套色=纯黑**（非绿）；**头发=中长发**（垂耳后/后颈，非短寸）；背后**白色月牙家纹**。
- **参照图（图生图锚点）**：`05_资产库/参考图/八神庵_经典款_参照.png`；Agnes key = `iori`（`python tools/agnes_img2img.py iori 2K 9:16`）。
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
