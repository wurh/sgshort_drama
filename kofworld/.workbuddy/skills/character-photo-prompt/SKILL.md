---
name: character-photo-prompt
description: 根据用户提供的角色图片（参考图/COS图/官方立绘/游戏截图）+ 角色名称，生成"照片级真人"的角色外观描述与 AI 图生图 prompt（英文+中文），用于 Midjourney/可灵/SD 等做角色参考图锁脸。强制去动漫/漫画/游戏风，产出可跨镜头保持一致的写实 prompt。触发词：角色图片、角色描述、真人形象、写实prompt、角色锁脸、参考图prompt、生成角色、人物形象、cos描述、角色外观、character photo prompt、realistic character description。
---

# 角色图片 → 真人写实描述 / Prompt

把"一张角色参考图 + 角色名称"转换成**照片级真人**的外观描述与 AI 图生图 prompt。产出的 prompt 直接可喂给 Midjourney / 可灵 / Stable Diffusion 等做角色参考图（锁脸基准），并带跨镜头一致性锚点。

**核心目标**：像"一个真实存在的真人男/女演员被摄影机拍下"，**不是动漫、不是漫画、不是 cosplay、不是游戏渲染、不是玄幻立绘**。

---

## 何时使用本 skill

满足任一条件即触发：
1. 用户给了一张**角色图片**（官方立绘 / COS 实拍 / 游戏截图 / 真人照片 / 动漫角色）+ **角色名称**，要求生成"真人形象描述 / 写实 prompt / 角色锁脸参考图"。
2. 用户说"把这个角色生成真人风格描述""按官方设定出角色 prompt""角色外观参考图"。
3. 已有角色设定（文字）但想要"去漫画风、改成照片级真人"的 prompt。

> 若用户只给**纯文字设定**（没有图），也走本流程——把"文字设定"当作输入源，跳到"步骤1 特征拆解"。

---

## 输入与输出

**输入（任一即可）**
- 角色参考图片（路径或直接贴进对话）。
- 角色名称（必填；用于命名输出文件、标注一致性锚点）。
- （可选）官方设定补充、服装版本（如 KOF94 / 现代）、能量特效颜色、用途（锁脸主基准图 / 出招镜头 / 悬念侧背影）。

**输出（固定 4 件套）**
1. **真人化特征拆解表**：逐部位列出写实描述（体型/肤色/脸型/眼神/发型/服饰/能量/气质），并标注"与原版/官方差异是否已纠正"。
2. **英文写实 Prompt 5 套**：①全身白底参考照（锁脸主基准）②近景大头 ③侧脸/背影（悬念）④出招/能量镜头 ⑤白底静立。每套都是可直接粘贴的完整 prompt。
3. **中文描述版**：国内图生图 / 团队沟通口吻。
4. **一致性锚点清单**：跨镜头必须保留的 N 个视觉特征，缺一即"换人"。

---

## 工作流程（5 步，顺序执行）

> ### ⚠️ 出图前先判断：是"知名 IP 角色"还是"原创角色"？
> **知名 IP 角色（拳皇/火影/海贼 等已有大量官方素材的）→ 强烈优先"图生图"，别纯文字硬拍。**
> 原因（实测）：纯文字 prompt 还原不出特定 IP 的脸 / 标志性姿态 / 专属配色，会漂成"通用真人"（发色漂移、头巾变形、漏专属配色、站姿错误）。
> 做法：拿**官方参照图**走 `ImageGen` 的 **image-to-image**（传 `image1`=参照图路径，`input_fidelity` 用 `medium` 较稳），prompt 里**逐条写死官方参照里"文字容易漏"的细节**（标志性手势/专属配色/护额/袖套等）。
> 若用户没给参照图、只有文字设定 → 才走纯文字流程；或先建议用户提供一张官方/参照图再出图。

### 步骤 1 · 读图 + 特征拆解
- **先读图**：用 Read 工具查看用户给的角色图片（图片可直接读），逐项识别：发色/发型、瞳色、脸型、体型/身高（如有）、服饰细节、能量/特效颜色、气质。
- **若用户提供了官方设定文字**，以官方文字为准，**用图核对**；**两者冲突时以用户给的官方规范为准**，并在拆解表标注"已纠正"。
- 产出"真人化特征拆解表"（见上）。**重点纠偏**：很多立绘/游戏图会把发色/服饰画得夸张（玄幻发光、卡通配色），要还原成**真实人类**可呈现的样子。

### 步骤 2 · 写真·通用风格前缀 + 负面提示（去漫画风核心）
所有 prompt 都套这套模板，**逐字保留**：

**通用风格前缀（放每条 prompt 开头）**
> `hyper-realistic photograph, full-bleed 35mm live-action film still, real human, photorealistic skin texture and pores, natural skin tone, realistic hair strands, cinematic lighting, 8k, shot on cinema camera`

**通用负面提示（放每条 prompt 结尾）**
> `no anime, no cartoon, no comic, no manga panel, no illustration, no 3d render, no cgi, no chibi, no cel shading, no fantasy glow, no aura, no game character, no face scars, no deformed hands, no extra fingers, no watermark, no text, no gore, no realistic blood, consistent facial identity`

**⚠️ 去漫画风的几条铁律（务必检查）**
- **不要**写 `anime style / manga / KOF / 90s retro / fighting game character / cosplay / character reference sheet` 这类词——它们会把模型拉回动漫/游戏风。
- 发色/瞳色**用真实人类的措辞**（如 `light brown hair` 而非 `golden hair`；`cold blue-grey eyes` 而非纯 `blue eyes`；深紫瞳写 `dark violet-purple` 而非纯紫，避免"红眼病/异色瞳"诡异感）。
- 徽章/纹章是**实体织印在衣服上**，**不是额头发光符/悬浮光环**（玄幻味的最大来源，务必落地到 fabric 上）。
- 能量/火焰写**体积光效**（`volumetric glow`），**明确 `NOT an explosion, NOT a fantasy aura`**。
- 肌肉写 `flowing natural muscle definition`（线条流畅），**非健美块状**。
- 皮肤写 `realistic skin texture with pores`，出招镜头可加 `a subtle sheen of sweat`（微汗，**但别写成油污/脏**）。

**🎯 若出图"仍偏 3D/塑料脸"——不换引擎、纯 prompt 的"拟人化"配方（实测有效）**
当用户说"还是太动漫/太假/要真实"，且**不换生图引擎**时，在 prompt 上叠加这套（针对 3D 渲染脸的根因逐条打）：
- **脸加真人瑕疵**：`SLIGHT FACIAL ASYMMETRY`（轻微左右不对称，真人都有）、`visible skin pores`、`fine lines under the eyes`、`a few natural skin blemishes`、`uneven skin tone`、`subtle stubble`，并写明 `do NOT airbrush, do NOT make it perfect`。
- **年龄拉大**：early 20s 的"少年精壮感"容易出 3D 味 → 改成 `a REAL 24-year-old` 成年男性。
- **头发加乱**：`slightly messy ... with a few flyaway strands`（非整齐造型）。
- **光换自然侧光**：`natural window side-lighting casting a gentle shadow to one side`（替代均匀棚光/`even soft studio key light`）。
- **抓拍感**：`candid documentary photograph`、`mid-movement not a dramatic pose`、`natural candid posture`（替代戏剧摆 pose）。
- **胶片质感替代超清**：删 `8k / shot on cinema camera`，改 `35mm film camera, subtle film grain, shallow depth of field`（`8k` 会强化数字 CG 感）。
- **`input_fidelity` 降到 `low`**：让参照图只借姿态/服装骨架，**脸与皮肤从真人文字描述重生成**，不照抄原图 3D 渲染脸。
- **负面再加**：`no plastic skin, no airbrushed skin, no perfect symmetry, no video game model, no 3d render, no cgi, no 8k, no studio fashion portrait, no model, no hyper-detailed`。
- **去水印**：ImageGen 出图右下角若带平台"AI生成"水印，把 `footnote` 参数置空（传空格）可去掉。
> ⚠️ 引擎局限：若用的是 **3D 世界模型**类引擎（出图带 `World Model` 水印），它能压到"照片↔3D"之间，但**纯 2D 摄影级真人**做不到位——此时最干净的解法仍是换照片级引擎（如可灵 Kling 真人模式）。

### 步骤 3 · 生成英文 Prompt 5 套
按"输入与输出"里的 5 类镜头逐个写，每套 = 通用前缀 + 角色写实细节 + 通用负面提示。**①全身白底参考照（锁脸主基准）必须带这 4 条硬约束**（用户强需求，写死）：
- `pure white seamless studio background (#ffffff)`（纯白无缝棚拍背景）
- `no cast shadow on the floor`（无落地阴影）
- `both hands empty and relaxed at his/her sides, holding nothing`（双手不持物、自然垂放）
- `standing straight facing the camera at eye level`（平视自然站立）

### 步骤 4 · 一致性锚点 + 中文描述版
- **一致性锚点**：从特征拆解里挑 4-6 个"缺了就会换人"的硬特征（发色发型 + 头饰 + 服饰主色 + 标志物 + 气质笑意），列成清单。
- **中文描述版**：把 ①白底参考照 和 ④出招镜头 用国内团队沟通口吻写成 2 段自然语言。

### 步骤 5 · 落盘
- 文件名：`<角色名>_真人形象prompt.md`（角色名用中文，避免空格/特殊字符）。
- 输出目录：**默认与用户当前项目一致**；若用户没指定，写到当前工作目录下的 `05_资产库/AI生成提示词/`（或当前项目等价的资产目录）。
- 若同目录已有**人物总表/主索引**（如 `人物参考图prompt.md`），**同步更新**其中该角色条目，保持"发色/徽章/白底基准"等修正在两个文件一致（避免自相矛盾）。
- 若角色有**能量特效**且存在多个同类角色（如多角色各有不同颜色火焰/电光），在文件末尾写**颜色铁律**（谁=什么色，勿混色）。

### 步骤 6 ·（可选）用 Agnes-Image-2.5-Flash 引擎出"真·照片级"实测图
若用户要"实际出图 / 验证效果"，且要**照片级真人**（而非 3D），优先用 **Agnes-Image-2.5-Flash**（实测比 3D 世界模型真实得多）：
- **端点**：`POST https://apihub.agnes-ai.com/v1/images/generations`；**模型**：`agnes-image-2.5-flash`；**全免费**（输出 + 前 3 张输入参考图 $0）。
- **图生图请求体**：`{"model":"agnes-image-2.5-flash","prompt":<拟人化prompt>,"size":"1K","ratio":"9:16","extra_body":{"image":[<官方参照图 dataURI 或 公共URL>]}}`
  - `extra_body.image` = 输入图（Data URI base64 `data:image/png;base64,...` 或公共 HTTPS URL）；**图生图不要传 `tags`**；`response_format` 必须放 `extra_body` 里（**勿放顶层**）。
  - 返回取 `data[0].url`；也可 `extra_body.response_format:"b64_json"` 取 `data[0].b64_json`（**最稳，避免 url 下载 404**）。
- **坑**：① `503 image queue is full` = 服务端队列忙，**自动重试（间隔 60s，最多 5 次）**；② 函数内**勿局部 `import urllib`**（会 UnboundLocalError，顶部统一 import）；③ 重试会超 120s 前台超时 → **后台 `run_in_background` 跑**。
- 参照图**本地文件**先转 base64 Data URI 再传（Agnes 取不到本地路径）。
- 本 skill 附带可复用脚本（若项目有 `tools/agnes_img2img.py`）：内置各角色拟人化 prompt + base64 + 503 重试 + b64 落盘。

---

## 输出模板（可直接套用）

```markdown
# <角色名> · 真人写实形象提示词（Photorealistic / 照片级真人风格）

> 风格目标：照片级真实感——像一个真实存在的 <N> 岁<男/女>演员被摄影机拍下，不是动漫/漫画/cosplay/游戏渲染。
> 造型版本：<版本/服装>。火焰色系铁律：<本角色=什么色，区别于同类角色什么色>。
> ⚠️ 已按<官方/用户规范>修正：<列出的纠偏点>。

## 一、真人化特征拆解（prompt 事实依据）
| 部位 | 真人化描述（写实） |
|---|---|
| 体型 | <身高/体重 + 肌肉/体态 + 重心> |
| 肤色 | <真实肤色 + 毛孔 + 微汗/光泽> |
| 脸型 | <真实人类脸型 + 表情气质> |
| 眼神 | <瞳色（真实措辞）+ 眼神气质> |
| 发型 | <真实发色发型 + 关键区分（非X）> |
| 服饰 | <逐件，徽章/标志物落地到 fabric> |
| 能量 | <体积光效 + 非爆炸/非玄幻> |
| 气质 | <核心性格关键词> |

## 二、英文 Prompt（直接喂图生图，真·写实风）
> 通用前缀 / 通用负面提示（见步骤2，逐字保留）

### ① 全身·白底参考照（锁脸主基准）
<通用前缀 + 写实细节 + 4 条白底硬约束 + 通用负面提示>

### ② 近景·脸
### ③ 侧脸 / 背影
### ④ 出招 / 能量镜头
### ⑤ 白底静立

## 三、中文描述版
**① 全身白底参考照：** <自然语言段>
**出招：** <自然语言段>

## 四、一致性锚点 + 颜色铁律
- 锚点（缺一即换人）：<4-6 条>
- 颜色铁律：<本角色=色 / 同类角色=色，勿混色>
```

---

## 常见坑（生成后自查清单）

- [ ] 发色/瞳色**没用动漫夸张色**（金→棕、纯紫→深紫灰等）。
- [ ] 徽章/纹章**没有写成额头发光符**（必须是实物织印）。
- [ ] 火焰/特效**写了 `NOT explosion / NOT fantasy aura`**。
- [ ] 负面提示**含 `no anime / no comic / no manga / no cgi / no game character`**。
- [ ] ①白底照**带齐 4 条硬约束**（纯白 #fff / 无阴影 / 双手空 / 平视站立）。
- [ ] 主索引/人物总表**已同步**（避免两文件矛盾）。
- [ ] 多角色时**颜色铁律写清、互不混色**。
