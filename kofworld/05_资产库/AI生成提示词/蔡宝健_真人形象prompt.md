# 蔡宝健 · 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 依据 SNK 官方参照图（KOF 中国队·僵尸街头格斗家 经典款）整理。
> **风格目标：照片级真实感**——像一个真实存在的 32 岁中国街头格斗家被摄影机抓拍，**不是动漫、不是 cosplay、不是游戏渲染、不是绿皮肤卡通僵尸**。
> ⚠️ 造型定位（按官方参照图纠正）：**棕色宽檐毡帽（蓝帽带）+ 黑墨镜 + 米白/浅灰无袖背心（藏青滚边 + 藏青腰带）+ 藏青宽松灯笼裤 + 棕色靴 + 双手护腕各伸出多根金属利爪（claw gloves）**，蹲踞前探、咧嘴狂笑。
> ⚠️ 招牌是**双手金属利爪（claw gloves，每只护腕伸出多根尖爪）**，**不是拳头/直拳**。
> ⚠️ "僵尸"主题**必须写实成人化**：皮肤用古铜偏冷灰调（slightly cold ashen cast），**不做绿皮肤、不做发光、不做玄幻光环**，出图务必 `no green skin, no zombie caricature, no elemental effects`。
> ⚠️ 出图排除项：官方图底部"全网号 初衷说游戏"是**网站水印，非角色元素**，出图务必 `NO text, NO watermark, NO letters, NO Chinese text`。
> 能力色系铁律：**蔡宝健 = 无元素特效**（纯利爪拳法，出图务必 `no fire, no elemental effects`；利爪是实物金属武器不发光，与大门/特瑞/安迪/东丈/哈维·D/洛奇/拜仁/金家藩/陈国汉/哈迪伦同属"无特效"阵营，区别 = 棕色宽檐帽蓝带 + 黑墨镜 + 米白无袖背心藏青滚边 + 藏青灯笼裤 + 双手金属利爪 + 冷灰古铜肤）。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 体型 | 32 岁精瘦神经质街头格斗家，细长、筋骨外露（wiry/feral），重心下沉 |
| 肤色 | **古铜偏冷灰调（tanned with a slightly cold ashen cast）**，带真实毛孔（僵尸写实质感，非绿皮） |
| 脸型 | 真实东亚成年男，瘦削棱角脸、疯野咧嘴狂笑 |
| 眼神 | 黑墨镜遮住，透出狠戾野性（嗜战眼神） |
| 发型/帽 | **棕色宽檐毡帽/软呢帽（wide-brim FEDORA / felt hat）+ 蓝色帽带**（磨损街头感，非毛皮护耳帽） |
| 头饰 | **黑色方框墨镜（black sunglasses）** |
| 上衣 | **米白/浅灰无袖背心（sleeveless off-white / light-grey vest）+ 藏青滚边 + 藏青腰带（navy sash belt）** |
| 手 | **双手护腕各伸出多根金属利爪（wrist-mounted metal CLAW GLOVES，尖爪伸出）** |
| 下装 | **藏青/深蓝宽松灯笼裤（loose dark-navy wide lantern trousers）** |
| 鞋 | **棕色工作靴（brown work boots）** |
| 姿势 | **蹲踞前探，双手护腕利爪前伸、咧嘴狂笑** |
| 能量 | **无元素特效**（纯利爪拳法，出图务必 `no fire, no elemental effects`；利爪=实物金属武器不发光） |
| 气质 | 疯野嗜战、冷峻危险的街头僵尸格斗家 |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, candid documentary lighting, subtle film grain`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no comic, no manga panel, no illustration, no 3d render, no cgi, no chibi, no cel shading, no plastic skin, no airbrushed skin, no perfect symmetry, no video game model, no video game render, no fantasy glow, no aura, no green skin, no zombie caricature, no game character, no fire, no elemental effects, no deformed hands, no extra fingers, no watermark, no text, no letters, no Chinese text, no 8k, no studio fashion portrait, consistent facial identity`

### ① 全身·白底参考照（锁脸主基准）
`a REAL 32-year-old East Asian man, lean and wiry with a feral weathered look, tanned skin with a slightly cold ashen cast and realistic pores, a gaunt angular face with a wild manic grin, a brown wide-brim FEDORA / felt hat with a BLUE hat band, black square-frame sunglasses, a sleeveless off-white / light-grey vest with thin navy trim and a navy sash belt, loose dark-navy wide lantern trousers, brown work boots, both arms thrust forward in a crouch with each hand wearing a wrist-mounted metal CLAW GLOVE with several long pointed FINGER CLAWS extended, pure white seamless studio background, no cast shadow, NOT a green-skinned cartoon zombie, NOT glowing, NO text, NO watermark, NO letters, NO Chinese text, candid documentary, 35mm film grain` + 负面提示。

### ② 近景·脸（疯野咧嘴，写实大头）
`extreme close-up portrait of a REAL 32-year-old East Asian man with a gaunt angular face, a wild manic feral grin, a brown wide-brim felt hat with a blue band, black square-frame sunglasses, tanned skin with a slightly cold ashen cast, visible skin pores, slight facial asymmetry, a few natural skin blemishes, natural window side-light, candid documentary photograph, 35mm film grain, shallow depth of field, NOT green, NOT a cartoon zombie, NOT airbrushed, NOT a 3d render` + 负面提示。

### ③ 侧脸 / 背影（悬念镜头）
`realistic back view of the same wiry street claw fighter, his brown wide-brim felt hat, sleeveless off-white vest, loose dark-navy lantern trousers, brown boots, both claw-gloved hands reaching forward with metal claws, crouched low, cold cinematic silhouette against a dark alley at night, moody low-key lighting, film still, NO text, NO watermark` + 负面提示。

### ④ 出招·利爪快击（纯武器，无特效）
`a REAL wiry East Asian man mid claw-strike, his wrist-mounted metal CLAW GLOVES snapping forward with real metallic motion blur, a low crouched lunge, the power shown through real body movement and speed NOT an explosion and NOT a fantasy aura or elemental effect, the claws are real metal weapons NOT glowing, a slightly cold ashen skin tone NOT green, dark alley at night, cinematic slow-motion` + 负面提示。

### ⑤ 白底静立（不动基准）
`full body, a REAL 32-year-old East Asian man standing and facing camera at eye level, all clothing details above (brown wide-brim felt hat with blue band, black sunglasses, sleeveless off-white vest with navy trim, dark-navy lantern trousers, brown boots, claw gloves at his sides), both hands relaxed at his sides, neutral dark studio-like background with soft cinematic key light, no energy effects, NOT green, NO text, NO watermark, photorealistic, feral grin` + 负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**真人写实基准：**
> 摄影级真实抓拍画面：一名 32 岁中国街头僵尸格斗家（KOF 中国队），精瘦神经质、筋骨外露（细长 wiry/feral 体态）、重心下沉；**古铜偏冷灰调肤色 + 真实毛孔（僵尸写实质感，非绿皮、不发光）**。瘦削棱角脸、**疯野咧嘴狂笑 + 黑方框墨镜**，戴**棕色宽檐毡帽（蓝色帽带、磨损街头感）**，着**米白/浅灰无袖背心（藏青滚边 + 藏青腰带）+ 藏青色宽松灯笼裤 + 棕色工作靴**，**双手护腕各伸出多根金属利爪、蹲踞前探**，疯野嗜战、冷峻危险。

**出招（利爪快击，无特效）：**
> 出招是**利爪快击（金属爪快速连抓/蹲踞突进）**——双手金属利爪前送、弓步下沉，**以真实出招与脚步表达力量，利爪是实物金属武器不发光，不做火焰、不做气旋、不做电光、不做玄幻光环；皮肤保持古铜偏冷灰调（非绿皮、不发光）**；衣物保持真实材质。
> ⚠️ 排除项：官方图底部"全网号 初衷说游戏"是网站水印，非角色元素，出图 prompt 写死 `NO text, NO watermark, NO letters, NO Chinese text`。

---

## 四、一致性锚点 + 颜色铁律

- 锚点（缺一即换人）：**棕色宽檐毡帽（蓝帽带）+ 黑方框墨镜 + 米白/浅灰无袖背心（藏青滚边 + 藏青腰带）+ 双手金属利爪（claw gloves）+ 藏青宽松灯笼裤 + 棕色工作靴 + 蹲踞前探咧嘴 + 精瘦 wiry 体态 + 古铜偏冷灰肤色 + 疯野眼神**，跨镜头保留。
- 颜色铁律：**蔡宝健 = 无元素特效**（纯利爪拳法，写实成人非绿皮）；草薙京=红焰 / 八神=紫焰 / 二阶堂=黄白电光 / 椎拳崇=青白气旋 / 麻宫=粉白念动力。**蔡宝健出招务必 `no fire, no elemental effects, no green skin, no zombie caricature`，利爪是实物金属武器不发光；与所有"有特效"角色互不混色。**

---

## 五、出图登记

> ⚠️ 本角色为 KOF 中国僵尸街头格斗家，**无元素特效 + 写实成人化**（纯利爪拳法，出图务必 `no fire, no elemental effects, no green skin`，皮肤做古铜偏冷灰调，不做绿皮/发光/卡通僵尸；招牌=双手金属利爪非拳头）。

- **✅ ImageGen 图生图定稿（2026-10-22 二次纠正·伸爪版，全身白底锁脸基准）**：`05_资产库/AI生成图/imagegen/Re_render_this_Chinese_street__2026-10-22T16-04-15.png`
  - 出图法：ImageGen image-to-image，`image1=蔡宝健_经典款_参照.png`（新官方伸爪图，已覆盖归档），`input_fidelity=low`。
  - 命中：棕色宽檐毡帽（蓝帽带）/ 黑方框墨镜 / 米白无袖背心（藏青滚边 + 藏青腰带）/ 双手护腕各伸出多根金属利爪 / 藏青宽松灯笼裤 / 棕色工作靴 / 蹲踞前探咧嘴 / 精瘦 wiry 真人 / 古铜偏冷灰皮肤（僵尸写实非绿皮）。
  - 小失分：**脸偏浅白人，官方为古铜偏冷灰调**——调法：prompt 肤色句强化 `a tanned sun-bronzed skin with a slightly cold ashen cast (NOT pale)` 重跑。
  - 旧"毛皮毡帽 + 直拳"版定稿 `.../Re_render_this_Chinese_zombie__2026-10-22T15-57-09.png` 作废（招牌动作与帽子识别错，被本伸爪版取代）。
  - 右下角带引擎固定"AI生成"水印（要无水印走 Agnes key=`caibaojian`）。

**Agnes 图生图 · 拟人化 prompt（可直接粘贴，无水印版）**
> Re-render this Chinese street claw fighter as a REAL 32-year-old East Asian man, lean and wiry with a feral weathered look, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature pose (crouched, BOTH hands thrust forward, each hand wearing a wrist-mounted metal CLAW GLOVE with several long pointed FINGER CLAWS extended, a wild manic grin) and outfit: a brown wide-brim FEDORA / felt hat with a BLUE hat band, black square-frame sunglasses, a sleeveless off-white / light-grey vest with thin navy trim and a navy sash belt, loose dark-navy wide lantern trousers, brown work boots, an intense excited feral grin. Weathered tanned sun-bronzed skin with a slightly cold ashen cast (NOT pale), realistic pores. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, a few natural skin blemishes, uneven skin tone, subtle stubble, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic, NOT a green-skinned cartoon zombie, NOT glowing. The claw gloves are real metal weapons, NOT glowing. No fire, no elemental effects, no green skin, no supernatural glow. PURE WHITE seamless studio background, no cast shadow, NO text, NO watermark, NO letters, NO Chinese text, full body. NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no green skin, no zombie caricature, no game character, no fire, no elemental effects, no pale white skin, no face scars, no deformed hands, no extra fingers, no watermark, no text, no letters, no 8k, consistent facial identity
