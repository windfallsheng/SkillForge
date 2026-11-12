---
name: deck-stage
description: >
  登台 deck-stage：把日报/周报/月报/季报/年报（md/HTML/口述大纲）或散装素材（目录/文件/随手文字）转成专业 .pptx 演示文稿。
  三问交互——先问素材（指定目录/指定文件/贴文字/口述主题）、再报页结构大纲表确认、后选成片方式（一键成片/逐页确认）。
  混合模式——常规页原生生成（文本/数据卡/时间线/柱图/饼图/折线，全部可编辑），封面与结尾页用 HTML 截图贴图（视觉保真）。
  视觉与报告深蓝面板体系同源：tech 深蓝科技（默认）/biz 浅色商务/mono IDEA 黑亮/light IDEA 白亮/warm 温暖渐变五主题，
  五段节色（蓝/绿/紫/玫红/橙）。每页可带演讲备注（notes），bullets 页可配图。
  数据经结构化 data.json 交给 resources/pptx-builder.js（PptxGenJS，本目录 node_modules 离线可用）产出 16:9 pptx。
  当用户请求把报告/日报/周报/月报/季报/年报转成 PPT、做成 PPT、导出 pptx、生成演示文稿、登台，或询问本 skill 用法时使用。用户要 HTML 网页幻灯（网页放映/分享）时不用本 skill（交给 magic-deck）；「做 PPT/演示文稿」未言明产出形态时先 AskUserQuestion 二选一（.pptx 可编辑文件 → 本 skill；HTML 网页幻灯 → magic-deck），不擅自默认。
allowed-tools: ["Bash", "Read", "Write", "Edit"]
disable-model-invocation: false
---

# 登台 deck-stage

把报告五件套（日报/周报/月报/季报/年报）的产出——或任何散装素材——转成专业 .pptx 演示文稿。常规页原生可编辑（文本/数据卡/时间线/柱图/饼图/折线），封面/结尾页 HTML 截图保真，每页可带演讲备注，视觉与报告同源。写报告 → 放映（magic-deck）→ 登台（本 skill），最后一公里闭环。

## 意图边界（与 magic-deck 分流）

- 本 skill 产 **.pptx 可编辑文件**（PowerPoint/WPS 打开可改）；用户要 HTML 网页幻灯（网页放映/分享）→ 交给 magic-deck
- 「做 PPT / 做演示文稿」未言明产出形态 → AskUserQuestion 二选一：A .pptx 可编辑文件（继续本 skill）/ B HTML 网页幻灯（交给 magic-deck），不擅自默认

## 三问交互模型（生成前必走，一问不跳）

**第一问 · 素材**：你手上有什么？四通道可单选可组合——
- 指定目录：扫描目录下 md/txt/docx 找报告素材
- 指定文件：直接给一个或多个文件路径
- 贴文字：把报告正文/要点随手发我，文字随意，我来提炼
- 口述主题：只给方向，按专业汇报 A/B/C 档（结论先行、量化优先、计划可验证）先提炼要点

**第二问 · 骨架**：先报页结构大纲表（页码 | 页型 | 标题 | 要点 | 数据/图表），用户增删改后确认定型。

**第三问 · 成片方式**（user-config.md 的 MODE 可设默认）：
- A 一键成片：确认骨架后直接生成完整 pptx
- B 逐页确认：每页先报排版方案（版式 + 内容 + 图表 + 演讲备注），用户 OK 一页出一页，可中途改单页/换主题/增删页

## 逐页确认交互细则（成片方式 B）

- 每页简报格式：页码 / 页型 / 节色 / 标题 / 内容要点 / 数据或图表 / 演讲备注（NOTES 开启时）
- 用户回复语义：
  - 「OK」/「下一页」→ 出当前页，继续下一页
  - 「第 N 页改成 XX」→ 单页重出（只重出该页，其余不动）
  - 「第 2-4 页 OK」→ 批量确认
  - 「换主题 biz」→ 全局换主题，已出页同步重出
  - 「加一页 XX」/「删掉第 N 页」→ 骨架增删
- 全部页确认完毕 → 组装完整 pptx → 落盘并打开

## 生成流程

0. **读用户配置**（DIR/DIR_WIN/THEME/OPEN_PPTX/CONFIRM/MODE/AUDIENCE/NOTES/CONFIG_VERSION）→ 先 Read 同目录 `user-config.md`
1. **三问交互**（见上节）：素材 → 骨架大纲表确认 → 成片方式（MODE 未配置时默认 B 逐页确认）
2. **结构化提炼** → 读 `resources/data-schema.md`（schema + 段落映射：年报五段/季报四段/月报四段/周报四段/日报四段 → 页类型与节色）
3. **封面/结尾截图**（无现成素材时）→ 读 `resources/cover-template.html` 说明：复制模板到临时目录 → 替换 `COVER` 对象（title/subtitle/info/stats 或 mode:closing）→ Chrome headless 截图 1280x720（macOS：`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless --disable-gpu --no-sandbox --hide-scrollbars --screenshot=cover.png --window-size=1280,720 --virtual-time-budget=3000 "file:///<临时html>"`；Windows 按序探测 chrome.exe/msedge.exe，URL 用 node url.pathToFileURL）
4. **生成 pptx**：写 data.json → `cd <skill目录> && node resources/pptx-builder.js --data <data.json绝对路径> --out <DIR>/<文件名>.pptx` → 输出 `PPTX_OK <路径>`
5. **交付前自检**（硬门禁，不可跳过）：文件存在、大小 > 20KB；`unzip -l <pptx>` 校验——`ppt/slides/slideN.xml` 数量与 data.json pages 数一致、每页 slide XML 均存在且非空；builder 已报 `PPTX_OK` 才算通过。未通过 → 修 data.json 后重跑 builder，禁止跳过直接交付
6. **落盘与打开**：按配置 DIR 落盘；`OPEN_PPTX: true` 时打开（macOS：`open <pptx>`；Windows：`start <pptx>`）
7. **使用咨询**（用户只问「登台怎么用」「报告转 PPT 怎么用」等用法、未要求生成）→ 读 `resources/usage-guide.md`，将其内容原样输出（首行标题改为「登台 deck-stage 使用指南」），不执行任何生成动作


## 🔧 报修处理流程（用户报成品问题时）

用户说「封面/结尾页效果不对」「第 N 页版式不对」「ppt 打开有问题」（常附截图或指出具体现象）→ 按以下流程处理，不以「重新生成一份」敷衍：

1. **立标准**：封面/结尾页的标准答案在 `resources/cover-template.html`；常规页版式标准在 `resources/pptx-builder.js`（真相源）+ `resources/data-schema.md`（schema 描述）
2. **分诊**：封面/结尾页问题 → 重新生成截图（按第 3 步流程替换 COVER 对象重截）；常规页版式问题 → Read data.json 与 data-schema.md 比对定位（字段缺/映射错/主题错）
3. **修复**：以 builder 与 data-schema 为准修 data.json 后重跑 builder；封面问题修 cover-template.html 或 COVER 数据后重截
4. **自证**：`unzip -l <pptx>` 校验 slide 数与非空 + 输出 `PPTX_OK`；封面重截后 Read 截图自查
5. **汇报**：一句话说清问题根因 + 修复了什么 + 附截图；若根因在 cover-template.html / pptx-builder.js 自身，顺修仓库模板并在汇报中说明「参考模板已同步修正」

## ⚙️ 默认配置（在 user-config.md，执行前必须先 Read）

DIR（落盘根目录，DIR_MAC/DIR_WIN 双键）、THEME（tech/biz/mono/light/warm）、OPEN_PPTX（生成后是否打开）、CONFIRM（落盘前确认）、MODE（成片方式 page-by-page/once）、AUDIENCE（受众画像，备注话术参考）、NOTES（是否生成演讲备注）——均以 `user-config.md` 为准。升级技能时 user-config.md 不会被覆盖，你的修改永久保留。

## 🔧 配置版本机制（升级保护）

`user-config.md` 头部有 `CONFIG_VERSION` 字段，声明配置结构版本。本 skill 当前要求版本为 2。每次执行前先读 user-config.md：

1. 若 CONFIG_VERSION 缺失或小于当前要求版本：先将旧 `user-config.md` 备份为 `user-config.md.bak-<时间戳>`
2. 按版本迁移规则迁移字段（新增字段补默认值、改名字段按映射改名、删除字段保留在备份并在对话中提示用户）
3. 更新 `CONFIG_VERSION` 为当前版本
4. 对话告知用户「配置已升级到 vN：新增 X、改名 Y」

禁止在未声明版本变更的情况下静默修改配置语义；配置结构如有变化必须同步更新本节的当前版本号。

**无法迁移项处理**（值域失效 / 语义漂移）：三绝不——绝不静默（无法迁移项停下问，不猜值）、绝不丢失（旧值永远在 .bak-时间戳）、一次说清（升级报告三段式：⚠️ 版本与备份路径 → ✅ 已自动迁移 → 🟡 无法迁移项逐条附原因+影响+建议替代）；随后 AskUserQuestion 三选项（A 用建议值 / B 用户给新值 / C 保持旧配置——不更新 CONFIG_VERSION，每次执行再提醒）；报告必附回滚一句话。

升级技能时 user-config.md 不会被覆盖（官方更新另存 `user-config.md.upstream` 对照文件）。

## 规则速览

- 混合模式：`cover-image`/`closing-image` 页用 HTML 截图（视觉保真），`overview`/`timeline`/`bullets`/`chart`/`chart-pie`/`chart-line` 页原生生成（可编辑）；截图窗口 1280x720 与 16:9 pptx 同比例
- 页类型分页：timeline 每页 8 条、bullets 每页 6 条自动续页（builder 自动处理，AI 不用拆）
- 节色五档：blue 概览 / green 成果 / purple 成长 / rose 反思 / orange 展望，与年报 HTML 同款
- 数值纪律：业务结果指标优先、git 统计兜底；数字必带对比基准（同比/环比）
- 主题五套与报告 HTML 令牌同源；theme 写在 data.json 里，未写默认 tech
- 演讲备注：NOTES=true 时每页写 notes（单页/第一页）或 notesList（按分页逐页）；话术按 AUDIENCE 画像，写开场白/数据解读/过渡句，不写正文照读
- 图表扩容：chart 自绘柱 / chart-pie 原生饼图（percent/donut 选项）/ chart-line 原生折线（series 多线/smooth 选项）——原生图表在 PowerPoint/WPS 里可直接编辑数据
- bullets 配图：page.image 给绝对路径即右侧配图（contain 等比内嵌），文本区自动缩窄，仅第一页带图
- builder 是真相源：版式改动只改 `resources/pptx-builder.js` 并同步 `data-schema.md` 描述，禁止只改一处
- 封面模板是截图底版：视觉改动只改 `resources/cover-template.html`；模板是静态版式（无动画），保截图零风险；窄屏浏览器直开时按视口等比缩放预览（截图走 headless 1280×720，不受影响）
- 依赖纪律：pptxgenjs 装在 skill 目录 node_modules（离线可用）；不引入其它运行时依赖

## 核心约束

- **页面与数据分离**：data.json 只含结构化内容，绝不含版式参数（颜色/位置由 builder 主题令牌决定）
- **封面截图必填**：`cover-image` 缺 image 字段会被跳过并警告，AI 必须先生成截图再填路径
- **image 路径绝对化**：data.json 里 image 一律写绝对路径，builder 按路径嵌入
- **落盘防覆盖**：同名 pptx 已存在时加日期后缀（如 `-1106`），不覆盖旧文件
- **零外部网络**：生成全程离线（截图用本地 Chrome/Edge headless，依赖本地 node_modules），pptx 双击即开
- **未授权目录不写**：DIR 不存在或不可写时停下问用户，不猜路径
