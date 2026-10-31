# pavo / Agnes-Image-2.5-Flash · 全剧角色 prompt 总表（直接复制即用）

> 用途：在 pavo 上做**图生图**出"真·照片级真人"角色锁脸基准图；也可走 ImageGen（Hunyuan，快但有固定水印）或 Agnes（免费、水印干净，但常 503 队列忙）。
> 每个角色卡片固定 5 块：**① 上传参照图** · **② 正向 prompt** · **③ 反向 prompt** · **④ 中文对照/微调** · **⑤ 定稿图**。
> 同源脚本：`tools/agnes_img2img.py`（一键跑 Agnes，自动扛 503 队列满；角色 key 见各卡片的 Agnes key）。
> 引擎备注：`ImageGen` 出图快、锁脸稳、有右下角固定"AI生成"水印（置空 footnote 去不掉）；`Agnes` 免费、水印干净、慢。快就用 ImageGen，交付要干净走 Agnes。

---

## 0. 角色总览索引（全剧人物）

| 角色 | 阵营/定位 | 特效铁律 | 造型版本 | Agnes key | 定稿基准图 | 卡片 |
|---|---|---|---|---|---|---|
| 草薙京 | 日·炎之贵公子 | **红焰（赤炎）** | KOF94 学生装 / **黑衣版** | `kyo_black` | 黑衣·撸袖无橙 | §1 |
| 二阶堂红丸 | 日美混血·电 | **黄白电光** | 抹胸造型 | `nikido` | ✅ | §2 |
| 八神庵 | 日·八神家 | **紫焰（无式焚天）** | KOF95–XI 经典款 | `iori` | ✅（头发偏短可再调） | §3 |
| 椎拳崇 | 日·龙拳 | **青白气旋** | 蓝色牛仔外套+白连帽卫衣+蓝短裤+棕色中分短发（旧蓝发紫道服/白外套黑袖作废） | `kunkuragi` | ✅ | §4 |
| 大门五郎 | 日·古武术相扑 | **无特效（纯摔技）** | 相扑袴 | `daimon` | ✅ | §5 |
| 特瑞·博加德 | 美·街头拳手 | **无特效（拳法/尘土）** | 红帽金发撕裂红背心 | `terry` | ✅ | §6 |
| 安迪·博加德 | 美·街头拳手（特瑞之弟） | **无特效（拳法/尘土）** | 金长发白背心红火焰边 | `andy` | ✅ | §7 |
| 吴真 | 主角·程序员 | 无（信息差预知） | 怂态(现代)/燃态(94武道服) | —（纯文字） | 待出 | §8 |
| 东丈 / 崔·东次 | 韩·跆拳道 | **无特效（跆拳道拳腿/尘土）** | 赤膊+红跆拳道短裤+白护额红点 | `dongzhang` | ✅ | §9 |
| 麻宫雅典娜 | 日·偶像+精神力（女） | **粉白念动力（非火焰/电光）** | 黑长发+红白啦啦演出服 | `athena` | ✅ | §10 |
| 镇元斋 | 中·KOF中国队老拳师 | **无特效（古武道/气功）** | 橄榄绿军帽+全白长须+橄榄绿盘扣练功服+背后铜球 | `zhenyuanzhai` | ✅ | §11 |
| 哈维·D | 美·拳击手（黑人） | **无特效（纯拳击）** | 顶髻莫西干+黑墨镜+黑红白条纹夹克敞开露胸腹+黑拳击短裤 | `harveyD` | ✅ | §12 |
| 洛奇·古洛巴 | 篮球主题（黑人） | **无特效（纯篮球）** | 粉色反戴帽+粉藏青拼色连帽卫衣+粉篮球短裤+抱橙篮球 | `rocky` | ✅ | §13 |
| 拜仁·巴特乐 | 美·肌肉拳手 | **无特效（纯拳法）** | 红橙刺发+蓝T恤黄星+右肩银色金属罐+浅蓝长裤 | `bayern` | ✅（肤色偏浅待调） | §14 |
| 金家藩 | 中·KOF中国风·腿法 | **无特效（纯腿法/音速踢）** | 深棕短发+米白V领无袖道服藏青滚边+藏青草履赤脚 | `jinfan` | ✅ | §15 |
| 陈国汉 | 中·KOF中国风·链拳 | **无特效（纯链拳 Heavy Chain）** | 光头黑络腮胡+军橄榄灰作训服+缠绕全身粗铁链+赤脚 | `guohan` | ✅ | §16 |
| 蔡宝健 | 中·KOF中国僵尸街头格斗家 | **无特效（纯利爪拳法）** | 棕色宽檐帽蓝带+黑墨镜+米白背心藏青滚边+双手金属利爪+藏青灯笼裤 | `caibaojian` | ✅（肤色偏浅待调） | §17 |
| 哈迪伦 | 日·KOF军装系格斗家 | **无特效（军装格斗/摔技）** | 蓝色军帽（金属徽）+右眼黑皮眼罩（非墨镜）+蓝军装（金扣）+右肩红橙护肩/胸前红橙拼块+黑内衬+黑全指手套+蓝军裤+黑高帮皮靴 | `hadren` | ✅（肤色偏浅待调） | §18 |
| 拉尔夫·琼斯 | 美·KOF街头拳手（特瑞/安迪师兄） | **无特效（纯拳法）** | 深棕短发+红绿条纹（绿星）长头巾飘带+深紫无袖背心（深绿长袖打底）+红拳套+棕皮腰带+军绿cargo工装裤（大腿大口袋）+棕军靴 | `ralf` | ✅（肤色偏浅待调） | §19 |
| 克拉克·斯蒂尔 | 美·KOF街头拳手（特库摩3K队长） | **无特效（纯拳法/街头格斗）** | 蓝棒球帽+黑wayfarer墨镜+深藏青padded无袖战术马甲（立领敞开露黑背心打底）+黑露指战术手套+深藏青cargo工装裤（大腿大口袋）+深棕皮鞋+呐喊pose | `clark` | ✅（肤色偏浅待调） | §20 |
| 哈迪伦 | 军装格斗家 | **无特效（纯军装格斗/摔技）** | 蓝军帽+右眼黑皮眼罩+蓝军装制服+红橙色护肩+黑高帮皮靴 | `hadren` | ✅（肤色偏浅待调） | §18 |

> **特效配色铁律（互不混色）**：草薙京=**红焰** / 二阶堂=**黄白电光** / 八神=**紫焰** / 椎拳崇=**青白气旋**；**大门、特瑞、安迪=无元素特效**（纯拳法/摔技/尘土，出图务必 `no fire, no elemental effects`）。

---

## 通用铁律（每个角色都适用）
1. **务必上传官方参照图做"图生图"**——只给纯文字、不上图，模型会自由发挥跑偏（发色漂、漏专属配色、站姿错）。
2. **比例** `9:16` 竖版；**尺寸**先 `1K` 验证、满意再 `2K`。
3. **拟人化配方**（压 3D 塑料脸）：脸加不对称/毛孔/眼下细纹/瑕疵/肤色不均 + 24岁 + 头发微乱 + 自然侧窗光 + 抓拍感 + 35mm胶片去8k；负面强化 `no plastic skin / no airbrushed / no perfect symmetry / no video game model / no 8k`。
4. **出图带平台水印**：ImageGen 右下角"AI生成"固定去不掉（要无水印走 Agnes）；正式素材前开无水印或裁掉右下角。
5. **锁脸主基准 = 全身白底参考照**：纯白无缝#fff / 无落地阴影 / 双手不持物 / 平视自然站立，先出这张定脸，其余镜头都锚定它的脸。

---

## 1. 草薙京（黑衣/西装版，最终定稿：撸袖露小臂·无橙）

**① 上传参照图**
- 锁衣（黑衣全身）：`05_资产库/参考图/草薙京_黑衣版_参照2.png`
- 锁脸（真人脸锚点）：`05_资产库/参考图/草薙京_脸型参照.png`
- 双图 ImageGen：`image1`=黑衣参照2，`image2`=脸型参照，`input_fidelity=medium`

**② 正向 prompt**
```
Re-render this fighting character as a REAL 24-year-old East Asian street-fighter man, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his outfit: a SOLID BLACK open-front blazer-style jacket with gold buttons (NOT navy) over a white sleeveless undershirt, the jacket sleeves ROLLED UP to the forearms so the bare skin forearms and hands are exposed (NO orange fabric anywhere on the arms), BLACK fingerless gloves with a small printed gold sun-crest on the back of the hand, a gold-buckle belt with a woven sash, slim black trousers, WHITE leather shoes, light BROWN tousled hair, a white cloth headband tied on top, a cocky confident smirk, light-tanned skin with realistic pores. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire. Pure white seamless studio background, no cast shadow, soft natural side light. Full body.
```

**③ 反向 prompt**
```
no navy jacket, no blue jacket, no orange, no orange sleeves, no orange arm warmers, no orange fabric, no orange gloves, no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity
```

**④ 中文对照 / 微调**
> 20 岁东亚成年男性，35mm 纪实抓拍、胶片颗粒、侧窗光。**纯黑开襟西装外套（金扣，非深蓝）**、内搭白色背心、**袖子撸到小臂露出小臂皮肤与手（无橙色布料、也非全黑垂袖）**、**黑露指手套（手背金色太阳纹章）**、金扣皮带 + 编织带、黑修身裤、**白色皮鞋**、浅棕微乱发、白头巾。脸要真人瑕疵，不磨皮、不 3D、不塑料。纯白底无阴影。
- 外套漂深蓝 → 正面写 `SOLID BLACK (NOT navy)` + 负面 `no navy jacket`。
- 前臂冒橙色 → 正面写 `bare skin forearms exposed (NO orange fabric)` + 负面 `no orange, no orange sleeves`。
- 脸太假 → 参考图换成 `草薙京_脸型参照.png` 双图锁脸。

**⑤ 定稿基准图**
- 全身白底（撸袖·无橙，最终）：`05_资产库/AI生成图/imagegen/A_REAL_East_Asian_young_man_in_2026-10-18T14-21-49.png`
- 赤焰出招：`05_资产库/AI生成图/imagegen/A_REAL_East_Asian_young_man_in_2026-10-18T14-06-40.png`（前臂略带橙，可再用撸袖无橙版重出）
- 已废弃版本：橙色前臂 `...T14-05-30.png` / 全黑垂袖 `...T14-10-59.png`

> ⚠️ KOF94 **学生装版**（白开襟学生装 + 蓝裤 + 红焰，发色浅棕非金）见 `草薙京_真人形象prompt.md`；整部剧统一 1994 用那版，走现代/黑衣用本版——**同一张脸、换服装**。

---

## 2. 二阶堂红丸（抹胸造型版）

**① 上传参照图**
`C:\Users\Administrator\.workbuddy\clipboard-images\clipboard-2026-10-18T11-27-04-209Z-a756ce39.png`（建议归档到 `05_资产库/参考图/二阶堂红丸_抹胸版_参照.png` 用稳定路径）

**② 正向 prompt**
```
Re-render this fighting character as a REAL adult Japanese-American mixed-heritage man in his early 20s, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature pose (both hands raised near his head) and outfit: BLOND spiky SHORT hair standing up with static flyaway strands (NOT long, NOT red), a black cropped sleeveless tank top revealing his toned midsection and abs, loose cream trousers with thin dark side stripes, black fingerless gloves with wrist wraps, a wide athletic stance, faint yellow-white ELECTRIC sparks at his fingertips. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. Pure white seamless studio background, no cast shadow, soft natural side light. Full body.
```

**③ 反向 prompt**
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity
```

**④ 中文对照 / 微调**
> 20 岁日美混血成年男性，35mm 纪实抓拍。保留"双手举头旁"招牌势 + 服装：金色竖立短发（非长发非红发）、黑色抹胸无袖短上衣（露腰腹）、米白长裤细深色侧条、黑露指手套 + 腕布、马步、指尖黄白电光。脸要真人瑕疵，不磨皮、不 3D、不塑料。纯白底无阴影。
- 电光偏黄 → 把 `yellow-white` 改 `blue-white`（官方偏蓝白）。
- 头发偏长 → 强化 `SHORT hair, NOT long`。

**⑤ 定稿基准图**：`05_资产库/AI生成图/agnes/nikido.png`（Agnes 照片级）

---

## 3. 八神庵（KOF95–XI 经典款：黑外套 + 中长发）

**① 上传参照图**
`05_资产库/参考图/八神庵_经典款_参照.png`

**② 正向 prompt**
```
Re-render this fighting character as a REAL lean East Asian young man in his early 20s, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature outfit and low crouched fighting stance: deep wine-red LONG hair, chin-length falling behind the ears and over the nape (NOT short-cropped), with thick straight front bangs falling across the face and FULLY COVERING his left eye (his signature), a fitted SOLID BLACK half-buttoned collar jacket with a thin white crescent-moon crest on the back, an open white long shirt reaching to the thighs, dark maroon-red trousers with a red leather strap binding the shins, black boots, a black choker, a silver ring on the right ring finger. Cold narrow upturned eyes, dark violet-purple irises, a sharp jawline and thin lips with a subtle cruel smirk. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire. Pure white seamless studio background, no cast shadow, soft natural side light. Full body.
```

**③ 反向 prompt**
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity
```

**④ 中文对照 / 微调**
> 20 岁东亚青年男，182cm 高瘦精壮；**深酒红中长发（垂耳后/后颈，非短寸）**、**厚重直刘海斜垂遮左眼**；**纯黑半扣立领皮外套（背后白色月牙家纹，非深绿）**、白长衬衫、酒红裤红皮绑腿、黑 choker、右手银戒、黑短靴；紫罗兰眼、邪魅冷笑。出招=紫焰（无式焚天，非爆炸）。**无脸疤**。
- 头发偏短 → 强化 `chin-to-shoulder wine-red LONG hair`。
- 刘海没遮左眼 → 强化 `front bangs FULLY covering / hiding his left eye`。
- 外套变绿 → 正面 `SOLID BLACK (NOT green)`。

**⑤ 定稿基准图**：Agnes `05_资产库/AI生成图/agnes/iori.png`；ImageGen 黑外套版 `05_资产库/AI生成图/imagegen/Re_render_this_fighting_charac_2026-10-18T13-34-35.png`（头发仍偏短，刘海没遮眼，可再按 ④ 强化重出一版）

---

## 4. 椎拳崇（龙拳·青白气旋）

**① 上传参照图**
`05_资产库/参考图/椎拳崇_经典款_参照.jpg`（ImageGen image-to-image，`input_fidelity=low`；无水印版走 Agnes key=`kunkuragi`）

**② 正向 prompt**
```
Re-render this martial-arts fighter as a REAL 20-year-old East Asian man, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature pose (right fist wrapped in white bandage raised overhead, left arm extended forward with open hand) and outfit: medium-length BROWN hair in a CENTER part, shorter on the sides with slightly messy loose strands hanging to the forehead and nape (NOT long-to-shoulders, NOT blue, NO goggles), a bright BLUE denim-style open cropped jacket with gold snap buttons over a WHITE hooded sweatshirt, matching bright BLUE athletic shorts, dark navy knee guards, grey-blue sneakers, white hand wraps, a confident focused expression. Light-tanned East Asian skin with realistic pores. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no elemental effects. Pure white seamless studio background, no cast shadow, full body.
```

**③ 反向 prompt**
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no goggles, no purple gi, no white jacket, no grey shorts, no long hair to the shoulders, no fire, no elemental effects, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity
```

**④ 中文对照 / 微调**
> ⚠️ 设定更正（按官方参照图 2026-10-18 二次纠正）：旧"深蓝短发+紫道服+护目镜"及"白外套黑袖+深灰短裤"均作废。本造型 = **棕色中分短发（两侧较短、顶部微乱）+ 蓝色牛仔风开襟短外套（金按扣）+ 白连帽卫衣内搭 + 蓝色运动短裤（同蓝）+ 深蓝护膝 + 灰蓝运动鞋**，右手缠白绷拳举过头 + 左手张开前伸。配色核心 = **蓝色系 + 棕色短发**。出招=**青白色气旋（龙拳/气功）**，体积光、非爆炸、非玄幻光环；与草薙红焰/八神紫焰/二阶堂电光互不混色。

**⑤ 定稿基准图**
`05_资产库/AI生成图/imagegen/Re_render_this_martial_arts_fi_2026-10-18T16-02-25.png`（ImageGen 图生图·蓝色系版，全身白底锁脸基准；右下角带引擎"AI生成"水印，要无水印走 Agnes key=`kunkuragi`；旧"白外套"版 T15-48-57 作废）

---

## 5. 大门五郎（相扑手·无特效纯摔技）

**① 上传参照图**
`D:\短剧业务\KOF\t04157768c0c226865b.jpg`

**② 正向 prompt**
```
Re-render this sumo-wrestler fighting character as a REAL heavyset Japanese man in his late 20s, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature pose (both arms raised, open palms outward) and outfit: bare-chested with a real sumo-wrestler physique (massive but naturally proportioned, not bodybuilder-blocky), tanned skin, short black hair, a white headband with a red circular crest on the forehead, white wrist wraps, a black belt, loose white sumo-style hakama trousers, wooden geta sandals, a wide stable sumo stance. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. Pure white seamless studio background, no cast shadow, soft natural side light. Full body.
```

**③ 反向 prompt**（纯摔技、**无元素特效**，额外强调）
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no elemental effects, no fire, no lightning, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity
```

**④ 中文对照 / 微调**
> 20 岁末相扑手体型日本成年男性（大块头但比例自然、非健美块状），35mm 纪实抓拍。保留"双手摊开掌心朝外"招牌势 + 服装：赤膊（相扑体型）、晒黑皮肤、黑色短发、额头白护额 + 红色圆形纹章、白护腕、黑腰带、白色相扑袴裤、木屐、马步宽站。脸要真人瑕疵。**出招无元素特效**（防模型乱加火焰/电光，反向已加 `no elemental effects`）。

**⑤ 定稿基准图**：Agnes `05_资产库/AI生成图/agnes/daimon.png`（若尚未出，跑 `python tools/agnes_img2img.py daimon 2K 9:16`）

---

## 6. 特瑞·博加德（Terry，美式街头拳手）

**① 上传参照图**
`05_资产库/参考图/特瑞博加德_经典款_参照.png`

**② 正向 prompt**
```
Re-render this street fighter as a REAL 24-year-old American street-fighter man, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature outfit and stance: light BLONDE short hair with a slightly spiky fringe and ONE long blonde ponytail/braid hanging down the BACK of his head over his back (NOT a side-lock in front of the chest), a red-and-white snapback cap with a small red "TERRY B." fabric print on the front, a red SLEEVELESS vest with shredded white-fleece frayed edges over a plain white tank top, medium-blue straight jeans, a black belt, black hand wraps on both wrists, red high-top canvas sneakers, walking forward with fists at guard height. Light tanned Caucasian skin, a square jaw with a confident cocky grin, steel-blue eyes. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no fantasy aura. Pure white seamless studio background, no cast shadow, soft natural side light. Full body.
```

**③ 反向 prompt**
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no elemental effects, no fire, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity
```

**④ 中文对照 / 微调**
> 24 岁美国街头拳手，浅白人肤色 + 天然金发（**无需纠成棕**）；红白 **TERRY B.** 棒球帽、**脑后金色长辫垂背后/后颈（非侧辫）**、红色撕裂毛边无袖背心（内搭白背心）、中蓝牛仔裤、黑缠手绷、**红色高帮帆布鞋**；钢蓝眼、痞气自信一笑。出招=纯拳法/尘土，**无元素特效**。
- 辫子方向 → 写 `ONE long blonde ponytail/braid hanging down the BACK of his head`（脑后，非侧辫垂前胸）+ 负面 `NOT a side-lock in front of the chest`。
- 表情太中性 → 加 `a cocky playful grin`。

**⑤ 定稿基准图**
- ImageGen（**脑后辫·最终**）`05_资产库/AI生成图/imagegen/Re_render_this_street_fighter__2026-10-18T15-35-46.png`（红帽 TERRY B./红撕裂背心白背心/蓝牛仔裤/黑缠手绷/红高帮鞋/金色短发+脑后长辫垂背后；带引擎"AI生成"水印）
- （旧"侧辫垂前胸"版 `...T13-38-50.png` 方向错，已废弃）
- Agnes key = `terry`（要无水印跑 `python tools/agnes_img2img.py terry 2K 9:16`）

---

## 7. 安迪·博加德（Andy，特瑞之弟·美式街头拳手）

**① 上传参照图**
`05_资产库/参考图/安迪博加德_经典款_参照.png`

**② 正向 prompt**
```
Re-render this street fighter as a REAL 24-year-old American street-fighter man, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature outfit and stance: long light BLONDE straight hair falling to the shoulders, a white SLEEVELESS tank top with a RED FLAME-TIP trim along the neckline and hem, RED forearm wraps, a black waist belt, white shorts with RED leg wraps extending down the shins, tall RED leather boots with white laces, arms crossed over the chest. Light tanned Caucasian skin, a square jaw with a cold stern expression, steel-blue eyes. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no fantasy aura. Pure white seamless studio background, no cast shadow, soft natural side light. Full body.
```

**③ 反向 prompt**
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no elemental effects, no fire, no lightning, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity
```

**④ 中文对照 / 微调**
> 24 岁美国街头拳手（特瑞之弟，比哥哥更冷峻孤傲）；浅白人肤色 + 天然**金发中长直发（垂肩，非短寸）**；**白无袖背心（领口下摆红色火焰纹边，实物非发光）**、**红色前臂护腕**、黑腰带、白短裤 + **红绑腿**、**红色高筒皮靴（白鞋带）**、**抱臂站姿**、钢蓝眼冷峻。出招=纯拳法/尘土，**无元素特效**。
- 跟特瑞区分：安迪=金**长发**+白背心红火焰边；特瑞=金**短发侧辫**+红帽+撕裂红背心。

**⑤ 定稿基准图**：ImageGen `05_资产库/AI生成图/imagegen/Re_render_this_street_fighter__2026-10-18T14-29-10.png`（全中；带引擎"AI生成"水印）

---

## 8. 吴真（主角·程序员，原创角色）

**① 上传参照图**
原创主角，无官方参照；**三态同脸**——以"怂态"脸为基准，燃态/摘镜只改体态与眼镜、不换脸型。

**② 正向 prompt**
- **[怂态 / 现代 2026]**
```
a real 30-year-old Chinese man, software engineer, messy black hair, black-framed glasses, an old worn T-shirt and jeans, slightly hunched, tired wide eyes, an old worn sports wristband on the right wrist, 2026 tech festival hall background, photorealistic skin with visible pores, candid documentary, 35mm film grain, cinematic lighting
```
- **[燃态 / 94 年擂台]**
```
the same real 30-year-old Chinese man, now in a martial-arts gi, upright posture, sharp intense eyes, a confident smirk, black-framed glasses removed and tucked into a pocket, the same old sports wristband still on the right wrist, glowing under arena light, a dark empty dojo, photorealistic skin, cinematic lighting
```

**③ 反向 prompt**
```
no anime, no cartoon, no comic, no manga, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity
```

**④ 中文对照 / 微调**
> 30 岁中国程序员，**怂态**（黑框眼镜 + 乱黑发 + 旧 T 恤牛仔裤 + 微驼 + 眼神涣散 + 右手腕旧运动手环）→ 时光机回 94 年后**燃态**（武道服 + 站直 + 眼神锐利 + 眼镜摘下塞口袋 + **手环仍在**，同一张脸）。**金手指=信息差预知（速度/改写/反制三道锁）**。三条必须同一张脸。
> ⚠️ 时代例外：仅"看 KOF16 广告"那个现代镜头（镜002）允许出现智能手机，其余镜头无现代电子。

**⑤ 定稿基准图**：待出（建议先出一张"怂态"真人脸定基准，燃态/摘镜都以它锁脸）

---

## 9. 东丈 / 崔·东次（KOF 韩国跆拳道·无特效）

**① 上传参照图**
`05_资产库/参考图/东丈_经典款_参照.png`

**② 正向 prompt**
```
Re-render this martial-arts fighter as a REAL 24-year-old Korean taekwondo fighter, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature outfit and stance: bare-chested with a real athletic tanned physique (toned but naturally proportioned, not bodybuilder-blocky), black short SPIKY hair with a few flyaway strands, a white cloth headband tied across the forehead with a small RED dot crest on the center, thick white hand wraps on both wrists and forearms, loose RED taekwondo shorts with a black waist belt (a small gold name-plate on the belt), brown leg wraps / shin guards on both shins, a wide stable fighting stance with both fists raised at guard height, an intense focused fierce expression. Light tanned skin with realistic pores and a subtle sweat sheen. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no fantasy aura. Pure white seamless studio background, no cast shadow, soft natural side light. Full body.
```

**③ 反向 prompt**（纯跆拳道、**无元素特效**）
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no elemental effects, no fire, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity
```

**④ 中文对照 / 微调**
> 24 岁韩国跆拳道选手，浅白人肤色带日晒光泽与微汗、皮肤有真实毛孔。方下颌、**凶狠专注**、深色锐利眼；**黑色短刺猬头（带碎发）**；**白色护额系额头（正中一枚红色圆点纹章，实物非发光）**；**赤膊露胸肩腹肌**、**白色缠手带（缠双腕至小臂）**、**红色跆拳道短裤（黑腰头 + 金色带扣小铭牌）**、**棕色缠腿带（缠至胫骨）**、**赤脚**；双拳护颌马步，街头野兽般的凶狠气。出招=高速跆拳道腿法/拳风 + 尘土，**无元素特效**（负面已加 `no elemental effects`）。
- 跟大门/特瑞/安迪区分：东丈=**赤膊 + 红跆拳道短裤 + 白护额红点 + 黑刺猬头**（大门=白头巾+袴裤；特瑞=红帽+撕裂红背心；安迪=金长发+白背心红火焰边）。

**⑤ 定稿基准图**
- ImageGen `05_资产库/AI生成图/imagegen/Re_render_this_martial_arts_fi_2026-10-18T15-11-42.png`（全中：黑刺猬头/白护额红点/赤膊/白缠手带/红跆拳道短裤金扣黑腰带/棕缠腿带/双拳护颌马步；带引擎"AI生成"水印）
- Agnes key = `dongzhang`（要无水印跑 `python tools/agnes_img2img.py dongzhang 2K 9:16`）

---

## 10. 麻宫雅典娜（KOF 偶像 + 精神力·女）

**① 上传参照图**
- 锁衣（官方服装）：`05_资产库/参考图/麻宫雅典娜_经典款_参照.png`
- 锁脸（精致甜美脸锚点）：`05_资产库/参考图/麻宫雅典娜_脸型参照.jpg`（**注意发色锁回黑、别跟着脸漂紫**）
- 双图 ImageGen：`image1`=官方服装参照，`image2`=脸型参照，`input_fidelity=medium`

**② 正向 prompt**（双图锁脸时开头加 `with the EXACT FACE from the face-reference image`；发色务必写死 `long BLACK hair (NOT purple)`，防跟着脸型参照漂紫）
```
Re-render this female idol-psycho fighter as a REAL 20-year-old East Asian woman, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve her signature outfit and idol pose (one arm raised high, the other hand near her hip): long BLACK hair with a PINK/MAGENTA headband, a red and white cheerleader-style idol outfit (white puffy short-sleeve top under an open red vest, a pink beaded necklace, a pleated RED skirt, a red belt, RED tights, RED fingerless gloves with white cuffs, RED Mary-Jane shoes with white straps), a bright cheerful smile, big warm eyes, light-tanned East Asian skin with realistic pores. The face must be a naturally imperfect real adult female face: slight facial asymmetry, visible skin pores, a few natural skin blemishes, uneven skin tone, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire. Pure white seamless studio background, no cast shadow, soft natural side light. Full body.
```

**③ 反向 prompt**（精神力系、**非火焰非电光**）
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no lightning, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity
```

**④ 中文对照 / 微调**
> 20 岁日本女青年，158cm 娇小匀称、少女感轻盈；**浅亚洲暖白肤色、皮肤有真实毛孔（不磨皮）**。圆润鹅蛋脸、**甜美灿烂笑**、黑褐大眼；**黑色长直发垂到腰 + 粉红/红色头巾束额**。着**红白啦啦/偶像演出服**：白色泡泡短袖打底 + **红色背心（前胸开口）** + **粉紫色珠链** + **红色百褶短裙** + 红色腰带 + **红色连裤袜** + **红色露指手套（白边）** + **红色玛丽珍鞋（白横带）**；**一臂高举过头、另一手垂髀旁**，阳光元气少女偶像气质。出招=**念动力/心灵波**（粉白能量，非火焰非电光）。
- **女角色**：prompt 用女性措辞，**不要写 stubble/胡茬**。
- 念动力偏玄幻 → 写 `soft pink-white psychic glow, volumetric, NOT a fantasy aura`。

**⑤ 定稿基准图**
- ImageGen **双图锁脸（漂亮脸·最终）** `05_资产库/AI生成图/imagegen/A_REAL_20_year_old_East_Asian__2026-10-18T15-29-46.png`（image1=官方服装 + image2=脸型参照，`input_fidelity=medium`；黑长发(非紫)/粉红头巾/红白演出服/红连裤袜/红露指手套/红玛丽珍鞋/一臂上举/精致甜美脸；带引擎"AI生成"水印）
- （旧单图脸偏普通版 `.../imagegen/Re_render_this_female_idol_psy_2026-10-18T15-22-59.png` 已废弃）
- Agnes key = `athena`（要无水印跑 `python tools/agnes_img2img.py athena 2K 9:16`）

---

## 11. 镇元斋（KOF 中国队·老拳师·无特效古武道/气功）

**① 上传参照图**
`05_资产库/参考图/镇元斋_经典款_参照.jpg`（ImageGen image-to-image，`input_fidelity=low`；无水印版走 Agnes key=`zhenyuanzhai`）

**② 正向 prompt**
```
Re-render this Chinese martial-arts master as a REAL East Asian elderly man in his 70s, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature low crouching horse-stance pose and outfit: an olive-drab army-peaked cap with a small round embroidered crest on the front, a full WHITE beard and white mustache (long, weathered), wispy WHITE hair, an olive-green traditional Chinese mandarin-collar martial-arts tunic with matching olive trousers and thin WHITE trim on the collar, cuffs and trouser hems, a row of large round COPPER coins/medallions (gong-fu balls) strapped across his back, holding a short wooden staff/stick in both hands, a weathered elderly face. Deeply wrinkled realistic elderly skin with age spots, visible pores, uneven skin tone, the dignity of a seasoned old master. No fire, no elemental effects. Pure white seamless studio background, no cast shadow, full body.
```

**③ 反向 prompt**
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity
```

**④ 中文对照 / 微调**
> 70 岁中国老拳师（KOF 中国队·老宗师，矮壮精干、气劲深厚），暗暖黄老肤色、满脸深刻皱纹与真实老年斑。着**橄榄绿军帽（胸前圆形军徽）+ 全白长须**、**橄榄绿中式盘扣对襟练功服 + 同色长裤（领口/袖口/裤脚白滚边）**，**背后一横排大铜钱（Gong Fu Balls / 铁胆，招牌武器）**，**双手握短棍 + 极低马步蹲姿、身体前倾蓄力**；眼神精光内敛、深藏锋芒。出招=**古武道/气功发力**（纯身体发力，**无火焰、无气旋、无电光、无玄幻光环**），与大们/特瑞/安迪/东丈同属"无特效"阵营。

**⑤ 定稿基准图**
`05_资产库/AI生成图/imagegen/Re_render_this_Chinese_martial_2026-10-18T16-09-42.png`（ImageGen 图生图，全身白底锁脸基准；命中：橄榄绿军帽圆章/全白长须/橄榄绿盘扣练功服白滚边/背后古铜球/双手握棍/极低马步/70 岁真实老人皮肤；右下角带引擎"AI生成"水印，要无水印走 Agnes key=`zhenyuanzhai`）

---

## 12. 哈维·D（KOF 美式拳击手·黑人·无特效纯拳击）

**① 上传参照图**
`05_资产库/参考图/哈维D_经典款_参照.png`（ImageGen image-to-image，`input_fidelity=low`；无水印版走 Agnes key=`harveyD`）

**② 正向 prompt**
```
Re-render this boxer as a REAL Black/African-American man in his 30s, a tall lean heavily-muscled professional boxer, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature boxer's stance (fists up at guard) and outfit: a tall high MOPPYCORN / mohawk hairstyle (sides shaved, a high vertical crest of black hair on top), black sunglasses, an OPEN black varsity/letterman jacket with RED and WHITE stripe trim on the collar, cuffs and hem (worn open, unbuttoned, revealing a bare well-defined chest and abs), black boxing shorts with a WHITE band at the hems, white fingerless boxing gloves with white wrist wraps, tall black high-top boxing boots, an intense focused expression. Dark rich brown Black skin with realistic pores and a subtle sheen. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, a few natural skin blemishes, uneven skin tone, subtle stubble/short beard, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no elemental effects. Pure white seamless studio background, no cast shadow, full body.
```

**③ 反向 prompt**
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity
```

**④ 中文对照 / 微调**
> 30 岁黑人职业拳击手（KOF 美式拳击手 "The Real McCoy"，与特瑞/安迪同系美系），身高偏高、精壮肌肉（胸腹明显）、重心下沉，**深褐黑人肤色 + 真实毛孔微汗光泽**。**顶髻莫西干（两侧剃光、头顶高耸一簇）+ 黑色方框墨镜**，着**敞开（不扣）黑棒球夹克（领口/袖口/下摆红白条纹滚边、露精壮胸腹）+ 黑拳击短裤（膝盖白滚边）+ 白露指拳击手套（白护腕）+ 黑色高帮拳击靴（白滚边）**；**双拳护颌上提、前后脚马步**的拳击架式。出招=**纯拳击**（**无火焰、无气旋、无电光、无玄幻光环**），与大门/特瑞/安迪/东丈同属"无特效"阵营。

**⑤ 定稿基准图**
`05_资产库/AI生成图/imagegen/Re_render_this_boxer_as_a_REAL_2026-10-22T15-09-10.png`（ImageGen 图生图，全身白底锁脸基准；命中：顶髻莫西干/黑墨镜/敞开黑红白条纹棒球夹克露胸腹/黑拳击短裤膝盖白滚边/白露指拳套/黑高帮靴/拳击架式/深褐黑人皮肤；右下角带引擎"AI生成"水印，要无水印走 Agnes key=`harveyD`）

---

## 13. 洛奇·古洛巴（KOF 篮球主题格斗家·黑人·无特效纯篮球）

**① 上传参照图**
`05_资产库/参考图/洛奇古洛巴_经典款_参照.png`（ImageGen image-to-image，`input_fidelity=low`；无水印版走 Agnes key=`rocky`；⚠️ 官方图底部"声优：山岸治雄"字幕与球上"›"是 UI/水印，出图务必排除）

**② 正向 prompt**
```
Re-render this basketball-themed fighter as a REAL Black/African-American man in his late 20s, a tall athletic professional basketball player physique, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature pose (holding a single ORANGE basketball in one hand at his side, the other hand relaxed) and outfit: a PINK backwards baseball cap, a color-blocked hoodie in PINK and NAVY with a large WHITE hood and a white chest panel with drawstrings, PINK basketball shorts with a WHITE band at the hems, thick white wrist wraps on both wrists, high-top sneakers in purple-pink with white soles, a confident relaxed street-athlete expression. Dark rich brown Black skin with realistic pores and a subtle sheen. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, a few natural skin blemishes, uneven skin tone, subtle stubble/short beard, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no elemental effects. PURE WHITE seamless studio background, no cast shadow, NO text, NO letters, NO arrows, NO Japanese text, NO voice-actor captions. Full body.
```

**③ 反向 prompt**
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no text, no letters, no arrows, no Japanese text, no face scars, no deformed hands, no extra fingers, no watermark, no 8k, consistent facial identity
```

**④ 中文对照 / 微调**
> 28 岁黑人职业篮球运动员（KOF 篮球主题格斗家，身高偏高、精壮、重心轻松），**深褐黑人肤色 + 真实毛孔微汗光泽**。**粉色反戴棒球帽（帽檐朝后）**，着**粉/藏青/白拼色连帽卫衣（粉袖 + 藏青胸前块 + 白色大帽兜 + 白色胸前面板 + 抽绳）+ 粉篮球短裤（膝盖白滚边）+ 双手白色护腕缠手带（带粉边）+ 紫粉色高帮篮球鞋（白底白鞋带）**，**右手抱一颗橙色篮球**、左手自然垂放，街头篮球手轻松站姿。出招=**篮球动作（运球/转身/扣篮）**（**无火焰、无气旋、无电光、无玄幻光环**），与大门/特瑞/安迪/东丈/哈维·D 同属"无特效"阵营。⚠️ 排除官方图 UI：`NO text, NO letters, NO arrows, NO Japanese text`。

**⑤ 定稿基准图**
`05_资产库/AI生成图/imagegen/Re_render_this_basketball_them_2026-10-22T15-24-56.png`（ImageGen 图生图，全身白底锁脸基准；命中：粉色反戴棒球帽/粉藏青拼色连帽卫衣（白帽兜+白胸前面板）/粉篮球短裤（白滚边）/双手白护腕/紫粉高帮球鞋/橙色篮球/黑人深肤/已排除"声优"字幕与"›"UI；右下角带引擎"AI生成"水印，要无水印走 Agnes key=`rocky`）

---

## 14. 拜仁·巴特乐（KOF 美式肌肉拳手·右肩金属罐·无特效纯拳法）

**① 上传参照图**
`05_资产库/参考图/拜仁巴特乐_经典款_参照.png`（ImageGen image-to-image，`input_fidelity=low`；无水印版走 Agnes key=`bayern`）

**② 正向 prompt**
```
Re-render this heavyweight boxer as a REAL muscular 30-year-old man with a deeply tanned sun-bronzed / medium-brown complexion (NOT pale, NOT white), a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature punching pose (one straight punch extended, the other at guard) and outfit: short spiky REDDISH-ORANGE / ginger hair, a BLUE t-shirt with a large YELLOW five-pointed STAR on the chest and RED-WHITE striped cuffs, a SILVER METAL TANK / pressurized canister strapped to his right shoulder with a brown leather diagonal harness, thick white wrist wraps on both wrists, loose light-blue / teal trousers, white high-top sneakers with blue accents, an intense focused fierce expression. Heavy muscle definition, realistic skin pores and a subtle sheen. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. The metal tank is a real prop, NOT a weapon, NOT glowing. No fire, no elemental effects. PURE WHITE seamless studio background, no cast shadow, NO text, NO arrows, full body.
```

**③ 反向 prompt**
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no pale white skin, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity
```

**④ 中文对照 / 微调**
> 30 岁健美拳手（KOF 美式肌肉拳手，肩背手臂粗壮），**古铜/小麦色肤色 + 真实毛孔微汗光泽**。**红橙色短刺发**，着**蓝色 T 恤（胸前一枚黄色五角星 + 红白条纹袖口）+ 右肩背一只银色金属罐（棕色皮革斜跨绑带，实物道具非武器、不发光）+ 双手白色护腕 + 浅蓝/青绿长裤 + 蓝白高帮运动鞋（白袜圈）**；**一记直拳前伸 + 另一拳护颌**的出拳姿态，精悍杀气眼神。出招=**纯拳法（直拳/组合拳）**（**无火焰、无气旋、无电光、无玄幻光环**），与大门/特瑞/安迪/东丈/哈维·D/洛奇·古洛巴同属"无特效"阵营；⚠️ 金属罐=实物道具不发光。
- **肤色微调**：本角色官方为**古铜/小麦色**，若出图脸偏浅白人，把 prompt 肤色句强化 `a deeply tanned sun-bronzed / medium-brown complexion (NOT pale, NOT white)` + 负面加 `no pale white skin` 重跑。

**⑤ 定稿基准图**
`05_资产库/AI生成图/imagegen/Re_render_this_heavyweight_box_2026-10-22T15-32-17.png`（ImageGen 图生图，全身白底锁脸基准；命中：红橙刺发/蓝T恤（黄星+红白条纹袖口）/右肩银色金属罐+棕色斜跨绑带/双手白护腕/浅蓝长裤/蓝白高帮鞋/出拳姿态/精壮肌肉；**失分：脸偏浅白人，应为古铜色（按④微调重跑）**；右下角带引擎"AI生成"水印，要无水印走 Agnes key=`bayern`）

---

## 15. 金家藩（KOF 中国风·腿法/音速踢·无特效纯腿法）

**① 上传参照图**
`05_资产库/参考图/金家藩_经典款_参照.png`（ImageGen image-to-image，`input_fidelity=low`；无水印版走 Agnes key=`jinfan`）

**② 正向 prompt**
```
Re-render this Chinese martial-arts kicker as a REAL 28-year-old East Asian man, lean and athletic with defined muscle, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature hands-on-hips pose and outfit: short dark-brown hair, a sleeveless off-white V-neck martial-arts gi / kimono top with NAVY trim on the collar and front opening and two small navy rectangular fastenings on the chest, a black fabric waist belt, navy wrist wraps on both wrists, loose off-white wide martial-arts trousers, navy straw sandals (barefoot), a confident calm focused expression. Warm light-tanned East Asian skin with realistic pores. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no elemental effects. Pure white seamless studio background, no cast shadow, full body.
```

**③ 反向 prompt**
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity
```

**④ 中文对照 / 微调**
> 28 岁中国武运动员（KOF 中国风·腿法手 "Kick Master" 音速踢 Sonic Break），精壮匀称、腿法手型体态、精瘦肌肉线条，**浅亚洲暖白肤色 + 真实毛孔**。方下颌、**冷静专注眼神**、**深棕色短发（微乱侧分刘海）**。着**米白色 V 领无袖道服（藏青滚边领口/前襟 + 胸前两枚藏青矩形扣）+ 黑色布腰带 + 藏青护腕缠手带 + 米白色宽松道裤 + 藏青色草履（赤脚穿、露脚趾）**；**双手叉腰、双腿微开蓄势站姿**。出招=**腿法（旋踢/音速踢）**（**无火焰、无气旋、无电光、无玄幻光环**），与大门/特瑞/安迪/东丈/哈维·D/洛奇·古洛巴/拜仁·巴特乐同属"无特效"阵营。

**⑤ 定稿基准图**
`05_资产库/AI生成图/imagegen/Re_render_this_Chinese_martial_2026-10-22T15-38-24.png`（ImageGen 图生图，全身白底锁脸基准；命中：深棕短发/米白V领无袖道服藏青滚边胸前双扣/黑腰带/藏青护腕/米白宽松道裤/藏青草履赤脚/双手叉腰站姿/浅亚洲暖白真人皮肤；右下角带引擎"AI生成"水印，要无水印走 Agnes key=`jinfan`）

---

## 16. 陈国汉（KOF 中国风·链拳 Heavy Chain·赵豹之父·无特效）

**① 上传参照图**
`05_资产库/参考图/陈国汉_经典款_参照.png`（ImageGen image-to-image，`input_fidelity=low`；无水印版走 Agnes key=`guohan`；⚠️ 官方图底部 "aigei.com" 是网站水印，出图务必排除）

**② 正向 prompt**
```
Re-render this Chinese heavy-chain fighter as a REAL large, broad-shouldered, bald East Asian man in his 40s with a heavy strongman build and a thick black beard, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature low crouching pose (one hand gripping the top of a heavy iron chain that loops across his chest and shoulders, the other hand held to his head) and outfit: a bald head, a thick full black beard, an olive-grey / dark khaki military-style work jacket and matching dark trousers, a heavy IRON CHAIN wrapped around his torso and hanging across his shoulders (a real metal weapon, NOT glowing), barefoot, an intense fierce expression. Tanned sun-bronzed skin with visible pores and a subtle sheen. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, a few natural skin blemishes, uneven skin tone, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no elemental effects. PURE WHITE seamless studio background, no cast shadow, NO text, NO watermark, NO letters, full body.
```

**③ 反向 prompt**
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no face scars, no deformed hands, no extra fingers, no watermark, no text, no letters, no 8k, consistent facial identity
```

**④ 中文对照 / 微调**
> 40 岁中国大汉（KOF 中国风·链拳手 "Heavy Chain"，赵豹之父），宽肩粗壮（相扑级/举重级体态）、重心极低，**古铜/小麦色肤色 + 真实毛孔微汗光泽**。**光头 + 浓密黑络腮胡（覆盖半脸）**，着**军橄榄灰/深卡其军用作训服 + 同色长裤**，**缠绕全身粗铁链（挂双肩，实物武器不发光）**，**赤脚**；**蹲踞出招（一手握铁链顶 + 一手护头蓄势）**，凶悍嗜战、压迫感极强。出招=**链拳 Heavy Chain**（**无火焰、无气旋、无电光、无玄幻光环**），铁链是实物金属武器不发光，与大门/特瑞/安迪/东丈/哈维·D/洛奇·古洛巴/拜仁·巴特乐/金家藩同属"无特效"阵营；⚠️ 排除官方图 UI：`NO text, NO watermark, NO letters`。

**⑤ 定稿基准图**
`05_资产库/AI生成图/imagegen/Re_render_this_Chinese_heavy_c_2026-10-22T15-45-46.png`（ImageGen 图生图，全身白底锁脸基准；命中：光头/浓密黑络腮胡/军橄榄灰作训服长裤/缠绕全身粗铁链挂双肩/赤脚/蹲踞出招/古铜真人皮肤/已排除 "aigei.com" 水印；右下角带引擎"AI生成"水印，要无水印走 Agnes key=`guohan`）

---

## 17. 蔡宝健（KOF 中国僵尸街头格斗家·双手金属利爪·无特效·写实成人非绿皮）

**① 上传参照图**
`05_资产库/参考图/蔡宝健_经典款_参照.png`（新官方伸爪图，已覆盖；ImageGen image-to-image，`input_fidelity=low`；无水印版走 Agnes key=`caibaojian`；⚠️ 官方图底部"全网号 初衷说游戏"是网站水印，出图务必排除）

**② 正向 prompt**
```
Re-render this Chinese street claw fighter as a REAL 32-year-old East Asian man, lean and wiry with a feral weathered look, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature pose (crouched, BOTH hands thrust forward, each hand wearing a wrist-mounted metal CLAW GLOVE with several long pointed FINGER CLAWS extended, a wild manic grin) and outfit: a brown wide-brim FEDORA / felt hat with a BLUE hat band, black square-frame sunglasses, a sleeveless off-white / light-grey vest with thin navy trim and a navy sash belt, loose dark-navy wide lantern trousers, brown work boots, an intense excited feral grin. Weathered tanned sun-bronzed skin with a slightly cold ashen cast (NOT pale), realistic pores. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic, NOT a green-skinned cartoon zombie, NOT glowing. The claw gloves are real metal weapons, NOT glowing. No fire, no elemental effects, no green skin, no supernatural glow. PURE WHITE seamless studio background, no cast shadow, NO text, NO watermark, NO letters, NO Chinese text, full body.
```

**③ 反向 prompt**
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no green skin, no zombie caricature, no game character, no fire, no elemental effects, no pale white skin, no face scars, no deformed hands, no extra fingers, no watermark, no text, no letters, no 8k, consistent facial identity
```

**④ 中文对照 / 微调**
> 32 岁中国街头僵尸格斗家（KOF 中国队），精瘦神经质、筋骨外露（wiry/feral 体态）、重心下沉，**古铜偏冷灰调肤色（非绿皮、不发光）+ 真实毛孔**。瘦削棱角脸、**疯野咧嘴狂笑 + 黑方框墨镜**，戴**棕色宽檐毡帽（蓝色帽带、磨损街头感）**，着**米白/浅灰无袖背心（藏青滚边 + 藏青腰带）+ 藏青宽松灯笼裤 + 棕色工作靴**，**双手护腕各伸出多根金属利爪（claw gloves）+ 蹲踞前探**，疯野嗜战。出招=**利爪快击（金属爪快速连抓）**（**无火焰、无气旋、无电光、无玄幻光环**；利爪=实物金属武器不发光），与大门/特瑞/安迪/东丈/哈维·D/洛奇·古洛巴/拜仁·巴特乐/金家藩/陈国汉同属"无特效"阵营；⚠️ 招牌=双手金属利爪非拳头/直拳；排除官方图 UI：`NO text, NO watermark, NO letters, NO Chinese text`。
- **肤色微调**：本角色官方为**古铜偏冷灰调**，若出图脸偏浅白人，把 prompt 肤色句强化 `a tanned sun-bronzed skin with a slightly cold ashen cast (NOT pale)` + 负面加 `no pale white skin` 重跑。

**⑤ 定稿基准图**
`05_资产库/AI生成图/imagegen/Re_render_this_Chinese_street__2026-10-22T16-04-15.png`（ImageGen 图生图·伸爪版，全身白底锁脸基准；命中：棕色宽檐毡帽蓝帽带/黑方框墨镜/米白无袖背心藏青滚边藏青腰带/双手护腕各伸出多根金属利爪/藏青灯笼裤/棕色工作靴/蹲踞前探咧嘴/已排除"全网号"水印；**失分：脸偏浅白人，应为古铜偏冷灰（按④微调重跑）**；旧直拳+毛皮毡帽版 T15-57-09 作废；右下角带引擎"AI生成"水印，要无水印走 Agnes key=`caibaojian`）

---

## 18. 哈迪伦（KOF 军装格斗家·右眼黑皮眼罩·蓝军装·无特效纯军装格斗/摔技）

**① 上传参照图**
`05_资产库/参考图/哈迪伦_经典款_参照.png`（新官方眼罩+蓝军装图，已覆盖；ImageGen image-to-image，`input_fidelity=low`；无水印版走 Agnes key=`hadren`；⚠️ 官方图两侧黄色三角箭头是 UI 导航，出图务必排除）

**② 正向 prompt**
```
Re-render this military-style fighter as a REAL 35-year-old East Asian man, lean and highly muscular with a disciplined military physique, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature stance (right hand raised with fingers curled, left hand at his side) and outfit: a BLUE military peaked cap with a small crest on the front, a black leather EYEPATCH over his RIGHT eye (NOT sunglasses, just one eye covered), a fitted long-sleeved BLUE military / utility jacket with a small gold button and a RED-ORANGE padded shoulder patch on the right shoulder and a red-orange panel on the chest, a black inner undershirt, a black leather belt with a gold buckle, matching BLUE military trousers, tall black service boots, black full-finger combat gloves, an intense focused stern expression. Tanned sun-bronzed East Asian skin with visible pores. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no elemental effects. PURE WHITE seamless studio background, no cast shadow, NO text, NO arrows, NO watermark, full body.
```

**③ 反向 prompt**
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no sunglasses, no green uniform, no pale white skin, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity
```

**④ 中文对照 / 微调**
> 35 岁军人格斗家（KOF 军装系·哈迪伦 Hadren），精壮、纪律化体态、重心下沉，**浅古铜/小麦亚洲肤色 + 真实毛孔**。方下颌、**冷峻军容**，戴**蓝色军帽（金属徽）+ 右眼黑色皮眼罩（EYEPATCH 皮套，非墨镜）**，着**蓝色军装制服（长袖金扣、修身剪裁）+ 右肩红橙色护肩/肩章 + 胸前红橙色拼块 + 黑色内衬打底 + 黑色皮质战术腰带（金扣）+ 黑全指战术手套 + 蓝色军裤 + 黑色高帮皮靴**；**右手抬起握拳 + 左手垂放**的军礼格挡姿势。出招=**军装格斗/摔技**（**无火焰、无气旋、无电光、无玄幻光环**），与大门/特瑞/安迪/东丈/哈维·D/洛奇·古洛巴/拜仁·巴特乐/金家藩/陈国汉/蔡宝健同属"无特效"阵营；⚠️ 军装=**蓝色系（非深绿/橄榄绿）**、护肩=**红橙色（非纯红）**、右眼=**黑皮眼罩（非墨镜）**；排除官方图 UI：`NO text, NO arrows`。
- **肤色微调**：本角色官方为**浅古铜/小麦肤色**，若出图脸偏浅白人，把 prompt 肤色句强化 `a tanned sun-bronzed East Asian skin tone (NOT pale, NOT white)` + 负面加 `no pale white skin` 重跑。

**⑤ 定稿基准图**
`05_资产库/AI生成图/imagegen/Re_render_this_military_style__2026-10-24T08-14-07.png`（ImageGen 图生图·眼罩+蓝军装版，全身白底锁脸基准；命中：蓝色军帽（金属徽）/右眼黑色皮眼罩/蓝色军装制服金扣/右肩红橙色护肩/胸前红橙拼块/黑色内衬/黑战术腰带金扣/黑全指手套/蓝军裤/黑高帮皮靴/右手握拳左手垂放；**失分：脸偏浅白人，应为浅古铜小麦色（按④微调重跑）**；旧"黑墨镜+深绿军装"版 T08-06-53 作废；右下角带引擎"AI生成"水印，要无水印走 Agnes key=`hadren`）

---

## §19 拉尔夫·琼斯（KOF 美式街头拳手·Ralf Jones，特瑞/安迪 师兄）

**① 上传参照图**
`05_资产库/参考图/拉尔夫琼斯_经典款_参照.png`（官方经典款图，ImageGen image-to-image，`input_fidelity=low`；无水印版走 Agnes key=`ralf`）

**② 正向 prompt**
```
Re-render this American street fighter as a REAL 30-year-old muscular East Asian street fighter, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature stance (right fist thrust forward in a straight punch, left fist at guard near the chin, one foot forward) and outfit: short dark-brown hair, a long RED headband with GREEN STAR / GREEN TRIANGLE pattern tied across his forehead with the long tail fluttering behind him, a dark PURPLE / aubergine sleeveless tactical vest over a dark olive-green long-sleeved shirt, dark RED boxing gloves on both hands, a brown leather waist belt with a metal buckle, loose olive-drab CARGO military trousers with two large patch pockets on the thighs, tall brown leather combat boots, an intense fierce determined expression. Tanned sun-bronzed East Asian skin with heavy muscle definition and a subtle sheen of sweat, visible pores. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no elemental effects. PURE WHITE seamless studio background, no cast shadow, NO text, NO arrows, NO watermark, full body.
```

**③ 反向 prompt**
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no pale white skin, no face scars, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity
```

**④ 中文对照 / 微调**
> 30 岁健美街头拳手（KOF 美式街头拳手·拉尔夫·琼斯，特瑞/安迪 师兄），精壮肌肉（胸/肩/臂明显）、重心下沉，**浅古铜/小麦亚洲肤色 + 真实毛孔微汗光泽**。方下颌、**凶猛专注眼神**、**深棕短发（微乱、侧面推短）**，绑**红绿条纹（红底绿星/绿三角）长头巾、长飘带垂身后**，着**深紫/茄紫无袖战术背心（敞领露胸腹）+ 深绿长袖打底 + 红色拳击手套（红护腕）+ 棕色皮腰带（金属扣）+ 军绿色 cargo 工装裤（大腿两侧大贴袋）+ 棕色军靴**；**右拳前送直拳 + 左拳护颌、前脚在前马步**。出招=**拳击组合（刺拳/直拳连击）**（**无火焰、无气旋、无电光、无玄幻光环**），与大门/特瑞/安迪/东丈/哈维·D/洛奇·古洛巴/拜仁·巴特乐/金家藩/陈国汉/蔡宝健/哈迪伦同属"无特效"阵营；⚠️ 头巾=**红绿条纹（绿星，非纯红/纯色）**、背心=**深紫/茄紫（勿漂成黑/蓝）**。
- **肤色微调**：若出图脸偏浅白人，把 prompt 肤色句强化 `a tanned sun-bronzed East Asian skin tone (NOT pale, NOT white)` + 负面加 `no pale white skin` 重跑。

**⑤ 定稿基准图**
`05_资产库/AI生成图/imagegen/Re_render_this_American_street_2026-10-24T08-31-38.png`（ImageGen 图生图，全身白底锁脸基准；命中：深棕短发/红绿条纹（绿星）长头巾飘带/深紫无袖战术背心（深绿长袖打底）/红拳击手套/棕色皮腰带/军绿 cargo 工装裤（大腿大口袋）/棕色军靴/右拳前送左拳护颌；**失分：脸偏浅白人，应为浅古铜小麦色（按④微调重跑）**；右下角带引擎"AI生成"水印，要无水印走 Agnes key=`ralf`）

---

## §20 克拉克·斯蒂尔（KOF 美式街头拳手·Clark Still，特库摩 3K 小队队长）

**① 上传参照图**
`05_资产库/参考图/克拉克斯蒂尔_经典款_参照2.png`（经典款官方画风·藏青 padded 马甲+黑露指手套+蓝工装裤+呐喊，主参照；帽子改蓝色；ImageGen image-to-image，`input_fidelity=low`；无水印版走 Agnes key=`clark`；备用官方 KOF 标题图 `克拉克斯蒂尔_经典款_参照3.png`（配色偏棕褐，仅备用）；⚠️ 官方图 KOF 标题/"游侠网"水印是 UI/网站水印，出图务必排除）

**② 正向 prompt**
```
Re-render this American street fighter as a REAL 30-year-old muscular Caucasian street cop / street fighter, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature roaring stance (one foot forward, one arm crossed in front of the chest with the other gloved fist raised, mouth open in a loud defiant shout / wild grin) and outfit: a BLUE baseball cap, black wayfarer-style sunglasses, a fitted STEEL-BLUE / navy PADDED SLEEVELESS tactical vest with a raised collar, open front over a BLACK tank-top undershirt revealing a toned muscular chest and abs, dark black fingerless combat gloves on both hands, loose steel-blue work/cargo trousers with side pockets, dark brown leather shoes, tanned sun-bronzed skin with heavy muscle definition and a subtle sheen of sweat, visible pores. The face must be a naturally imperfect real adult male face: slightly dirty-blonde light-golden short hair under the cap, slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. No fire, no elemental effects. PURE WHITE seamless studio background, no cast shadow, NO text, NO watermark, full body.
```

**③ 反向 prompt**
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no brown vest, no white tank top, no blue boxing gloves, no grey cap, no face scars, no deformed hands, no extra fingers, no watermark, no text, no letters, no Chinese text, no 8k, consistent facial identity
```

**④ 中文对照 / 微调**
> 30 岁健美街头拳手（KOF 美式街头拳手·克拉克·斯蒂尔 Clark Still，特库摩 3K 小队队长，特瑞/安迪/拉尔夫 的队长），精壮肌肉（胸/肩/臂明显）、重心下沉，**浅古铜/小麦肤色 + 真实毛孔微汗光泽**。方下颌、**狂放挑衅神情 + 张口呐喊/咧嘴狂笑**，戴**蓝色棒球帽 + 黑色 wayfarer 方框墨镜**，帽下浅金短发外露，着**深藏青/钢蓝 padded 无袖战术马甲（立领、敞开前襟、露黑背心打底 + 精壮胸腹）+ 黑色露指战术手套 + 深藏青 cargo 工装裤（大腿两侧大贴袋）+ 深棕色皮鞋**；**一脚在前 + 一臂横胸 + 另一只戴拳套的手抬起**，张扬狂放。出招=**拳击组合（刺拳/直拳连击、抱摔擒拿）**（**无火焰、无气旋、无电光、无玄幻光环**），与大门/特瑞/安迪/东丈/哈维·D/洛奇·古洛巴/拜仁·巴特乐/金家藩/陈国汉/蔡宝健/哈迪伦/拉尔夫·琼斯同属"无特效"阵营；⚠️ 帽子=**蓝色棒球帽（非灰褐鸭舌帽）**、马甲=**深藏青/钢蓝 padded（非棕褐/黑）**、打底=**黑背心（非白）**、手套=**黑色露指（非蓝拳套）**、工装裤=**深藏青（勿漂浅蓝/军绿）**。
- **肤色微调**：本角色官方为**浅古铜/小麦肤色**，若出图脸偏浅白人，把 prompt 肤色句强化 `a tanned sun-bronzed skin tone (NOT pale, NOT white)` + 负面加 `no pale white skin` 重跑。

**⑤ 定稿基准图**
`05_资产库/AI生成图/imagegen/Re_render_this_American_street_2026-10-24T10-54-46.png`（ImageGen 图生图·蓝帽纠正版，全身白底锁脸基准；命中：蓝棒球帽/黑wayfarer墨镜/深藏青padded无袖战术马甲（立领敞开+黑背心打底露胸腹）/黑露指战术手套（右拳抬起）/深藏青cargo工装裤（大腿大口袋）/深棕皮鞋/呐喊pose；**失分：脸偏浅白人，应为浅古铜小麦色（按④微调重跑）**；旧"棕褐马甲+白背心+蓝拳套"版 T10-45-10 与"灰褐鸭舌帽+黑全指手套"版 T10-37-42 作废；右下角带引擎"AI生成"水印，要无水印走 Agnes key=`clark`）

---

## pavo / ImageGen 操作速查
| 步骤 | 操作 |
|---|---|
| 1 | 选引擎（Agnes 干净 / ImageGen 快），选**图生图**模式 |
| 2 | 上传该角色**参照图**（见各卡片 ①；草薙黑衣版用"黑衣参照2 + 脸型参照"双图锁脸） |
| 3 | 「提示词」框粘**正向 prompt**；「反向」框粘**反向 prompt**（只有一个框就把正 + 反连起来，反前面加 `NEGATIVE:`） |
| 4 | 比例 `9:16`、尺寸先 `1K`；`input_fidelity`：锁脸稳用 `medium`，压 3D 脸用 `low` |
| 5 | 出图，不满意按各卡片 ④ 微调 |
| 6 | 满意这张即角色**锁脸主基准**，后续所有镜头都锚定它的脸；要干净去右下角水印（Agnes 更干净） |

---

## 新增角色 · 维护 SOP（每加一个新角色照做，保持全表一致）
1. **归档参照图**到稳定路径 `05_资产库/参考图/<角色名>_<造型>_参照.png`（别用 clipboard 临时路径）。
2. **新建角色卡片** `05_资产库/AI生成提示词/<角色名>_真人形象prompt.md`（套 4 件套：特征拆解表 / 英文 5 套 / 中文 / 锚点+颜色铁律 + Agnes 段）。
3. **主索引** `人物参考图prompt.md` 加一条 `P0x <角色>`（写实版 prompt + 参照路径 + Agnes key + 特效/配色铁律）。
4. **Agnes 脚本** `tools/agnes_img2img.py` 加一个 `<key>`（REF 参照路径 + PROMPTS 拟人化 prompt）+ 更新 docstring 的 key 列表。
5. **本总表**（文件）加一张 §卡片 + 更新 §0 索引行。
6. **出图**：ImageGen 秒出验证（双图锁脸时 image1=衣、image2=脸），满意登记 §卡片 ⑤ 定稿图路径。
7. **配色铁律**：若新角色有特效，务必在 §0 表格 + 各相关角色卡片标注互不混色；无特效阵营加 `no elemental effects`。

> 维护原则：**所有文件同源**（prompt 正文、脚本 PROMPTS、总表三处保持一致），改动时一处改、三处同步，避免自相矛盾。
