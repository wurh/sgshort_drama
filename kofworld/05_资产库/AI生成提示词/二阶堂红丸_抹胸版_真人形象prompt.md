# 二阶堂红丸（抹胸造型版）· 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 造型版本依据：参考图 `C:\Users\Administrator\.workbuddy\clipboard-images\clipboard-2026-10-18T11-27-04-209Z-a756ce39.png`（KOF 后期抹胸造型：金发竖立 + 黑色抹胸短上衣 + 米白长裤 + 双手举头旁 + 蓝白电光）。
> 风格目标：**照片级真实感**——像一个真实存在的日美混血 20 岁青年男演员被摄影机拍下，**不是动漫/漫画/cosplay/游戏渲染/玄幻立绘**。
> ⚠️ 这是与"KOF94 蓝背心版"（`二阶堂红丸_真人形象prompt.md`）**不同的第二个造型版本**：本版 = **黑色抹胸短上衣（露腰腹）+ 米白长裤**。两版可并存，同一张脸、换服装。
> 能量色系铁律：**二阶堂红丸 = 黄白色电光（雷电）**，区别于草薙京红焰、八神庵紫焰、椎拳崇青白气旋。
> 实测成功图：`05_资产库/AI生成图/Photorealistic_*_11-27-48.png`（二阶堂红丸）。

> ### 🔑 关键方法：知名 IP 角色务必"图生图"，别纯文字硬拍
> 纯文字还原不出特定 IP 的脸 / 标志性姿态 / 专属配色。正确做法：拿**官方参照图**做 **image-to-image**（`input_fidelity=medium`），prompt 里逐条写死官方参照里"文字易漏"的细节（竖发/抹胸露腹/电光/双手举头旁）。

---

## 一、真人化特征拆解（prompt 事实依据）

| 部位 | 真人化描述（写实） |
|---|---|
| 体型 | **180cm 精壮匀称**，肌肉线条流畅（非健美块状），日美混血俊美脸、高鼻梁 |
| 肤色 | **偏深小麦色/健康古铜**，毛孔真实 |
| 脸型 | **棱角分明俊美脸**，自信坏笑 |
| 眼神 | **深蓝瞳**，锐利自信、带玩味 |
| 发型 | **金色竖立短发**（因静电把发根根顶起、"扫把头"，**非长发、非红发**），发丝根根分明 |
| 上衣 | **黑色抹胸/无袖短上衣**（crop top），**露出腰腹与腹肌** |
| 下装 | **米白/乳白长裤 + 细深色侧条纹** |
| 手套 | **黑色露指手套 + 腕部缠布** |
| 鞋 | **深色皮鞋/短靴** |
| 手势 | **双手举至头旁**（招牌起手式），指尖**蓝白电光** |
| 能量 | **黄白色电光（雷电）**，指尖迸蓝白电弧（体积光效，**非火焰、非玄幻光环**） |
| 气质 | 好胜、自信、街头浪子、玩世不恭 |

---

## 二、英文 Prompt（直接喂图生图，真·写实风）

> **通用风格前缀（每条开头，务必保留）**：
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, cinematic lighting, 8k, shot on cinema camera`
>
> **通用负面提示（每条结尾，务必保留）**：
> `no anime, no cartoon, no comic, no manga panel, no illustration, no 3d render, no cgi, no chibi, no cel shading, no fantasy glow, no aura, no game character, no fire, no red flame, no face scars, no deformed hands, no extra fingers, no watermark, no text, no gore, no realistic blood, consistent facial identity`

### ① 全身·白底参考照（锁脸主基准，最优先出这张）
`full-body studio photograph of a real lean handsome mixed-heritage young man in his early 20s, 180cm fit athletic build with flowing natural muscle definition, tanned skin with realistic pores, a sharp handsome face with a confident grin, dark blue eyes, BLOND spiky SHORT hair standing UP with static strands (NOT long, NOT red), wearing a black cropped sleeveless tank top that reveals his toned midsection and abs, loose cream trousers with thin dark side stripes, black fingerless gloves with wrist wraps, dark leather shoes, both hands raised near his head (his signature taunt), faint blue-white ELECTRIC sparks crackling at his fingertips, a wide athletic stance with legs apart, pure white seamless studio background (#ffffff), NO cast shadow on the floor, even soft studio key light, photorealistic skin and fabric` + 通用负面提示。

- **4 条白底硬约束**：`pure white seamless studio background (#ffffff)` + `NO cast shadow on the floor` + 发型 `NOT long, NOT red` + `wide athletic stance`。
- **图生图**：把官方参照图传 `image1`，`input_fidelity=medium`，锁脸锁竖发锁抹胸锁电光。

### ② 近景·脸（俊美脸/竖发电光，写实大头）
`extreme close-up portrait of a real lean handsome mixed-heritage young man, BLOND spiky short hair standing up, dark blue eyes, confident grin, tanned skin with realistic pores, blue-white electric sparks near the hair, cinematic rim light, shallow depth of field` + 通用负面提示。

### ③ 侧脸 / 背影（抹胸背心 + 竖发悬念镜头）
`realistic side profile and back view of the same young man, the black cropped tank top, BLOND spiky hair standing up, tanned skin, cold cinematic silhouette in a dim arena at night, moody low-key lighting, film still` + 通用负面提示。

### ④ 出招·雷光（黄白电光，非火焰）
`a real lean young man mid-strike, both hands charging with crackling YELLOW-WHITE ELECTRIC LIGHTNING, blue-white electric arcs crackling between his fingers, dramatic motion blur, realistic sweat-slicked skin and fabric, the energy is electric GLOW NOT fire and NOT a fantasy aura, dark arena at night, cinematic slow-motion` + 通用负面提示。

### ⑤ 白底静立（补一张"不动"的纯写实站立基准，与①同背景便于比对同一张脸）
`full body, a real lean handsome young man standing still and facing camera, both hands relaxed at his sides holding nothing, all clothing details above, BLOND spiky hair, pure white seamless studio background (#ffffff), no cast shadow, soft even studio light, no electricity, photorealistic, calm confident gaze` + 通用负面提示。

---

## 三、中文描述版（国内图生图 / 团队沟通，写实口吻）

**① 全身白底参考照（锁脸主基准）：**
> 摄影级真实画面：一名 **20 岁日美混血青年男性**，**180cm 精壮匀称**、肌肉线条流畅，**偏深小麦/古铜肤色**、毛孔真实；**棱角分明俊美脸 + 自信坏笑 + 深蓝瞳**；**金色竖立短发**（静电根根竖起，非长发、非红发）。着**黑色抹胸无袖短上衣（露腰腹腹肌）**、**米白长裤（细深色侧条）**、**黑色露指手套 + 腕布**、**深色皮鞋**；**双手举至头旁**（招牌手势），指尖**蓝白电光**；双腿分开马步。**纯白无缝棚拍背景、无落地阴影**，均匀柔光。

**出招（雷光）：**
> 出招时**双手蓄雷**，指尖迸**黄白色电光 / 蓝白电弧**；电光是**黄白/蓝白**，**不是火焰、不是红焰、不是玄幻光环**；皮肤微汗、衣物真实。

---

## 四、一致性锚点 + 颜色铁律

- **锁脸主图 = ① 全身白底参考照**：纯白背景、无阴影，先出这张定脸，其余（近景/侧背/出招）都锚定这张的脸。
- **一致性锚点（跨镜头必保留，缺一即"换人"）**：
  1. **金色竖立短发**（非长发、非红发）
  2. 日美混血俊美脸 + 深蓝瞳 + 自信坏笑
  3. **黑色抹胸短上衣（露腰腹）+ 米白长裤侧条纹**（本抹胸版）
  4. 黑色露指手套 + 腕布
  5. 双手举头旁 / 指尖蓝白电光
- **颜色铁律**：二阶堂红丸 = **黄白色电光（雷电）**；草薙京 = 红焰 / 八神庵 = 紫焰 / 椎拳崇 = 青白气旋，四者勿混色。出招镜头务必"电光非火"。
- **两版造型**：KOF94 蓝背心版（蓝背心 + 蓝短裤 + 草鞋）见 `二阶堂红丸_真人形象prompt.md`；本版为**抹胸造型**（黑抹胸 + 米白长裤）。同一张脸、换服装。
- **图生图铁律**：知名 IP 角色务必拿官方参照图做 image-to-image（`input_fidelity=medium`），别纯文字硬拍。

---

## 五、pavo / Agnes-Image-2.5-Flash 直接粘贴版 ⭐（本次满意那张图实际用的 prompt）

> 这一节就是**实际出成"满意"那张二阶堂红丸真人图所用的 prompt**，可直接复制到 pavo 的 Agnes 图生图输入框。
> **⚠️ 最关键的一步：务必同时上传官方参照图做"图生图"**（路径 `C:\Users\Administrator\.workbuddy\clipboard-images\clipboard-2026-10-18T11-27-04-209Z-a756ce39.png`）。
> 之前在 pavo 上"严重不对"，根因就是**没上图生图、只用纯文字 + 默认现代都市风**，模型自由发挥成了"穿蓝背心短裤的都市青年"。

### A. 正向提示词（粘到「提示词 / prompt」框）
```
Re-render this fighting character as a REAL adult Japanese-American mixed-heritage man in his early 20s, a natural candid documentary photograph on a 35mm film camera with subtle film grain and natural window side-lighting. Preserve his signature pose (both hands raised near his head) and outfit: BLOND spiky SHORT hair standing up with static flyaway strands (NOT long, NOT red), a black cropped sleeveless tank top revealing his toned midsection and abs, loose cream trousers with thin dark side stripes, black fingerless gloves with wrist wraps, a wide athletic stance, faint yellow-white ELECTRIC sparks at his fingertips. The face must be a naturally imperfect real adult male face: slight facial asymmetry, visible skin pores, fine lines under the eyes, a few natural skin blemishes, uneven skin tone, realistic skin texture, NOT airbrushed, NOT a 3d render, NOT plastic. Pure white seamless studio background, no cast shadow, soft natural side light. Full body.
```

### B. 反向提示词（粘到「反向 / negative」框；若 pavo 只有一个框，就把 A + 下面这段连起来粘）
```
no anime, no manga, no cartoon, no comic, no illustration, no 3d render, no cgi, no plastic skin, no airbrushed skin, no perfect symmetry, no video game render, no video game model, no cel shading, no fantasy glow, no aura, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no hyper-detailed, no 8k, no studio fashion portrait, no model, consistent facial identity
```

### C. 中文对照（给团队/沟通用）
> **图生图**：把该格斗角色重渲染成一名**真实、20 岁上下的日美混血成年男性**，自然纪实抓拍、35mm 胶片相机、轻微胶片颗粒、自然侧窗光。**保留其招牌姿态（双手举至头旁）与服装**：金色竖立短发（静电飞起、非长发、非红发）、黑色抹胸无袖短上衣（露腰腹腹肌）、米白长裤（细深色侧条）、黑色露指手套 + 腕布、宽距马步站姿、指尖淡黄白电光。**脸必须是自然不完美的真人成年男性脸**：轻微不对称、可见毛孔、眼下细纹、少量自然瑕疵、肤色不均、真实皮肤质感，**不要磨皮、不要 3D 渲染、不要塑料感**。纯白无缝棚拍背景、无落地阴影、柔和自然侧光。全身。

### D. pavo 参数建议
- **参照图**：务必上传（图生图锚点，决定脸/姿态/配色还原度）。
- **比例**：`9:16` 竖版（短剧角色立绘）。**尺寸**：先用 `1K` 验证，满意再上 `2K`（`2K` + 大 base64 偶尔触发队列满 503，见脚本自动重试逻辑）。
- **出图不满意时的微调方向**：脸太 3D → 加大 C 段"真实瑕疵"描述比重；电光偏黄 → 把 `yellow-white` 改 `blue-white`；头发偏长 → 强化 `SHORT hair, NOT long`。

> 同源脚本：`D:\workspace\sgpro\sgshort_drama\kofworld\tools\agnes_img2img.py`（内置 nikido/kyo_black/daimon 三段，一键跑 Agnes 图生图）。
