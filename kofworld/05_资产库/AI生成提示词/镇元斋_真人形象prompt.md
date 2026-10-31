# 镇元斋 · 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 依据 SNK 官方参照图（KOF 中国队·老拳师经典款）整理。
> **风格目标：照片级真实感**——像一个真实存在的 70 岁中国老拳师被摄影机抓拍，**不是动漫、不是 cosplay、不是游戏渲染**。
> ⚠️ 造型定位：**橄榄绿军帽（胸前圆章）+ 全白长须 + 橄榄绿中式盘扣练功服（白滚边）+ 背后一横排古铜球（Gong Fu Balls）+ 双手握短棍 + 极低马步蹲姿**。
> 能力色系铁律：**镇元斋 = 无元素特效**（纯古武道 / 气功发力，**无火焰、无气旋、无电光**，出图务必 `no fire, no elemental effects`；与大们/特瑞/安迪/东丈同属"无特效"阵营，区别 = 白发白须老者 + 军帽 + 橄榄绿练功服 + 背后铜球）。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 体型 | 70 岁矮壮精干老拳师，身形偏矮但气劲深厚，重心极低（深蹲马步） |
| 肤色 | 老东亚人，肤色偏暗暖黄，满脸深刻皱纹、真实老年斑、松弛皮肤 |
| 脸型 | 真实老年男性，满脸深刻皱纹、松弛皮肤、岁月沧桑感 |
| 眼神 | 精光内敛、深邃锐利（老拳师"藏锋"眼神） |
| 须发 | **全白短乱发 + 浓密白色长须髯**（标志性，非黑非彩发） |
| 头饰 | **橄榄绿军帽（peaked cap）+ 胸前一枚圆形军徽/圆章**（实体布绣，非发光） |
| 服饰 | **橄榄绿中式盘扣对襟练功服 + 同色长裤，领口/袖口/裤脚白滚边**（mandarin-collar tunic） |
| 标志物 | **背后一横排大铜钱/古铜球（Gong Fu Balls / 铁胆）**——镇元斋招牌武器，实体挂带 |
| 武器 | **双手握短棍/木棒**（古武道器械） |
| 姿势 | **极低马步蹲姿（deep horse stance）**、身体前倾蓄力 |
| 能量 | **无元素特效**（纯古武道/气功发力，出招是身体发力与古武招式，非火焰非气旋非电光） |
| 气质 | 老成持重、深不可测的武林宗师 |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, candid documentary lighting, subtle film grain`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no comic, no manga panel, no illustration, no 3d render, no cgi, no chibi, no cel shading, no plastic skin, no airbrushed skin, no perfect symmetry, no video game model, no video game render, no fantasy glow, no aura, no game character, no fire, no elemental effects, no deformed hands, no extra fingers, no watermark, no text, no 8k, no studio fashion portrait, consistent facial identity`

### ① 全身·白底参考照（锁脸主基准）
`a REAL East Asian elderly man in his 70s, an old Chinese martial-arts grandmaster, short and weathered build, an olive-drab army-peaked cap with a small round embroidered crest on the front, a full WHITE beard and mustache, wispy white hair, an olive-green traditional Chinese mandarin-collar tunic and matching trousers with thin WHITE trim on the collar, cuffs and hems, a row of large round COPPER gong-fu balls/coins strapped across his back, holding a short wooden staff in both hands in a low crouching horse stance, deeply wrinkled elderly skin with age spots, calm deep focused eyes, pure white seamless studio background, no cast shadow, candid documentary, 35mm film grain` + 负面提示。

### ② 近景·脸（老年锐目，写实大头）
`extreme close-up portrait of a REAL East Asian man in his 70s, a weathered elderly face with deep wrinkles, an olive-drab army cap with a round crest, a full white beard, calm piercing deep eyes, visible skin pores and age spots, natural window side-light, candid documentary photograph, 35mm film grain, shallow depth of field, NOT airbrushed, NOT a 3d render` + 负面提示。

### ③ 侧脸 / 背影（古武宗师·悬念镜头）
`realistic back view of the same elderly Chinese master, the row of large COPPER gong-fu balls across his back, his olive-green tunic with white trim, white beard, crouched low, cold cinematic silhouette against a dark old dojang at night, moody low-key lighting, film still` + 负面提示。

### ④ 出招·古武道发力（气功/拳法，无特效）
`a REAL elderly Chinese martial-arts master mid-strike with a short wooden staff, the old man coiling his whole body to throw a powerful Chinese kung-fu technique, dramatic motion blur, the force is shown through his real body movement and stance, NOT an explosion and NOT a fantasy aura or elemental effect, dark old dojang at night, cinematic slow-motion` + 负面提示。

### ⑤ 白底静立（不动基准）
`full body, a REAL East Asian elderly man in his 70s standing and facing camera at eye level, all clothing details above, both hands relaxed at his sides holding the short staff, neutral dark studio-like background with soft cinematic key light, no energy effects, photorealistic, calm deep gaze` + 负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**真人写实基准：**
> 摄影级真实抓拍画面：一名 70 岁中国老拳师（KOF 中国队·老宗师），身形矮壮精干、气劲深厚；**暗暖黄老肤色，满脸深刻皱纹与真实老年斑**。着**橄榄绿军帽（胸前圆形军徽）+ 全白长须**、**橄榄绿中式盘扣对襟练功服 + 同色长裤（领口/袖口/裤脚白滚边）**，**背后一横排大铜钱（Gong Fu Balls / 铁胆，镇元斋招牌武器）**，**双手握短棍**、**极低马步蹲姿、身体前倾蓄力**；眼神精光内敛、深藏锋芒。

**出招（古武道/气功，无特效）：**
> 出招是**古武道发力**——整个身体盘沉蓄力、短棍/拳法一记老拳，**以真实身体动作与重心表达力量，不做火焰、不做气旋、不做电光、不做玄幻光环**；皮肤与衣物保持真实材质。

---

## 四、一致性锚点 + 颜色铁律

- 锚点（缺一即换人）：**橄榄绿军帽（胸前圆章）+ 全白长须 + 橄榄绿盘扣练功服（白滚边）+ 背后一横排古铜球（Gong Fu Balls）+ 双手握短棍 + 极低马步 + 70 岁真实老人皱纹**，跨镜头保留。
- 颜色铁律：**镇元斋 = 无元素特效**（纯古武道/气功）；草薙京=红焰 / 八神=紫焰 / 二阶堂=黄白电光 / 椎拳崇=青白气旋。**镇元斋出招务必 `no fire, no elemental effects`，与所有"有特效"角色互不混色。**

---

## 五、出图登记

> ⚠️ 本角色为 KOF 中国队老拳师，**无元素特效**（纯古武道/气功，出图务必 `no fire, no elemental effects`）。

- **✅ ImageGen 图生图定稿（2026-10-18，全身白底锁脸基准）**：`05_资产库/AI生成图/imagegen/Re_render_this_Chinese_martial_2026-10-18T16-09-42.png`
  - 出图法：ImageGen image-to-image，`image1=镇元斋_经典款_参照.jpg`，`input_fidelity=low`。
  - 命中：橄榄绿军帽胸前圆章 / 全白长须 / 橄榄绿盘扣练功服（白滚边）/ 背后一横排古铜球 / 双手握短棍 / 极低马步蹲姿 / 70 岁真实老人皮肤皱纹老年斑。
  - 右下角带引擎固定"AI生成"水印（要无水印走 Agnes key=`zhenyuanzhai`）。

**Agnes 图生图 · 拟人化 prompt（可直接粘贴，无水印版）**
> Re-render this Chinese martial-arts master as a REAL East Asian elderly man in his 70s, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature low crouching horse-stance pose and outfit: an olive-drab army-peaked cap with a small round embroidered crest on the front, a full WHITE beard and white mustache (long, weathered), wispy WHITE hair, an olive-green traditional Chinese mandarin-collar martial-arts tunic with matching olive trousers and thin WHITE trim on the collar, cuffs and trouser hems, a row of large round COPPER coins/medallions (gong-fu balls) strapped across his back, holding a short wooden staff/stick in both hands, a weathered elderly face. Deeply wrinkled realistic elderly skin with age spots, visible pores, uneven skin tone, the dignity of a seasoned old master. No fire, no elemental effects. Pure white seamless studio background, no cast shadow, full body. NEGATIVE: no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no fire, no elemental effects, no deformed hands, no extra fingers, no watermark, no text, no 8k, consistent facial identity
