---
name: article-to-html
description: Converts Word (.docx), Markdown, or plain-text articles into a polished standalone HTML page using Source Han Sans SC + Roboto fonts (both free for commercial use), redrawing all charts/diagrams with HTML/CSS instead of embedding source images, then captures per-chapter element-level screenshots (Retina 2x, uniform width, shadow-safe margins). Use when the user provides a document or article file (a bare file path with no instruction also triggers it), asks to make an HTML page, beautify an article for publishing, or generate screenshots of article sections. Also handles existing HTML files directly: captures per-chapter screenshots from a ready-made HTML page, or restyles/beautifies an existing HTML page first (then screenshots on request). Use when the user hands over an already-built .html file and asks to screenshot it or make it prettier. Also responds with a plain-language usage guide when the user asks how to use this skill (e.g. "使用说明", "怎么用", "能干什么").
---

# Article to Beautiful HTML + Chapter Screenshots

Turn any Word/Markdown/plain-text article into a standalone styled HTML page and a set of per-chapter screenshots, all saved locally.

## 用户使用说明（User Guide）

当用户问「这个技能怎么用」「使用说明」「能干什么」时，读 `resources/usage-guide.md` 将其内容原样输出（首行标题改为「文章装裱师使用指南」），不执行任何转换或截图动作。

## ⚙️ 配置与自定义主题

**执行本 skill 前必须先 Read 同目录 `user-config.md`**：`THEME` 配置决定 A 款页面的默认主题色（tech 科技蓝 / gold 暖棕金 / forest 墨绿 / plum 梅紫）；`DIR` 配置决定产物落盘根目录（auto 按系统选 DIR_MAC/DIR_WIN，目录不存在时回退用户主目录，用户口头指定目录永远优先）。升级技能时 user-config.md 不会被覆盖，你的修改永久保留。

## 配置版本机制（升级保护）

本 skill 当前配置版本为 `2`（对应 user-config.md 中的 `CONFIG_VERSION`）。执行时若发现 user-config.md 的 CONFIG_VERSION 与本节声明不一致：
1. 将旧 user-config.md 备份为 `user-config.bak-<时间戳>.md`
2. 保留用户全部自定义字段，按本节「当前版本变更记录」逐项改写旧字段
3. 更新 CONFIG_VERSION 为当前版本
4. 对话中明确告知用户「检测到配置版本从 X 升级到 Y，旧配置已备份至 <路径>」

升级本 skill 时，配置结构如有变化必须同步更新本节的当前版本号与迁移说明；禁止在未声明版本变更的情况下静默修改配置语义。

**无法迁移项处理**（值域失效 / 语义漂移 / 数据不兼容）：三情形——①旧值不在新值域（如旧模板/主题名已移除）②同名键含义变化（单位/枚举变更）③数据文件 schema 不兼容。三绝不：绝不静默（无法迁移项停下问，不猜值）、绝不丢失（旧值永远在 .bak-时间戳）、一次说清（升级报告三段式：⚠️ 版本与备份路径 → ✅ 已自动迁移清单 → 🟡 无法迁移项逐条附原因+影响+建议替代）；随后 AskUserQuestion 三选项（A 用建议值 / B 用户给新值 / C 保持旧配置——不更新 CONFIG_VERSION，每次执行再提醒）；报告必附回滚一句话；数据文件迁移前先复制 .bak-时间戳，能映射则映射、不能则写兼容层或留备份提示手动整理

当前版本变更记录：
- v1→v2：新增 `DIR: auto` + `DIR_MAC: ~/articles` + `DIR_WIN: %USERPROFILE%\articles`（产物落盘根目录，auto 按系统选、目录不存在回退用户主目录、口头指定优先）；其余字段不变。

## 产物升级（回炉）

生成 HTML 时头部写版本戳 `<meta name="sf-template" content="article-to-html@2">`（模板升级时递增 @N 并同步 reference.html 与本文档）。用户说「升级旧产物/回炉旧页面/旧文章页换新样式」时：扫落盘目录下本技能生成的 html，读版本戳筛出旧版（无版本戳或缺少 `<meta name="article-id">` 稳定 ID 的产物视为 v0 最旧版，一并进清单）→ 列清单（文件/旧版本/手改状态——html 与同目录 md 底稿正文对比，不一致视为可能手改过；无 md 底稿时标记「无法比对」）→ AskUserQuestion 选全部或部分 → 逐份升级：浅升级（仅 CSS/JS 变化）对旧页替换 `<style>` 块与交互脚本、正文内容原样保留；深升级（DOM 结构变化）从 md 底稿按当前 reference.html 重建（无 md 底稿则提取旧 html 正文重建），先备份旧版 `.bak-时间戳` → 报告三段式：✅ 已升级清单 / ⚠️ 手改保留说明 / 🟡 失败项原因。模板改动分级：业务改动（板块/段落/标题体系）、数据格式改动（字段/存储结构）、页面改动（样式/布局/交互）任一发生即模板升级，版本戳 +1 并同步 reference.html 与本文档；纯措辞润色不 bump。每次生成 HTML 时顺扫落盘目录读版本戳：发现旧版产物（vN-1 或无版本戳的历史产物）主动告知「技能模板已升级至 vN，检测到 X 份旧版文章页，说『把我旧文章页都升级成新样式』即可一键升级」，不让用户背触发语。

## Prerequisites（新用户准备）

1. **Qoder 环境**：本 Skill 依赖 AI agent + Browser 子代理，在 Qoder 中直接可用，无需额外安装
2. **安装 Skill**：将 `article-to-html/` 目录放入 `~/.qoder-cn/skills/`（个人全局，推荐）或项目 `.qoder/skills/`，重启 Qoder 即可被识别
3. **Python 3（可选，非硬依赖）**：脚本依赖，macOS 验证 `python3 --version`，缺失则 `xcode-select --install`（Windows 到 python.org 安装）。没有 Python 时用 Bash 降级路径：docx 解析 `unzip` + Read XML、字体内嵌 `base64 -i xxx.woff2`、字体检测 `ls` 字体目录、下载 `curl`、解压 `unzip`、安装 `cp`
4. **思源黑体（自动检测安装）**：执行时先运行 `python3 scripts/install_sourcehan.py` 检测系统是否已装；缺失则自动从 Adobe Fonts 官方 release（2.005R，OFL 免费可商用）下载并安装到用户字体目录（macOS `~/Library/Fonts` / Windows 用户字体目录），含 SHA-256 校验与 ghfast.top 镜像兜底。安装失败或未装时，浏览器会 fallback 到苹方（macOS）/ 微软雅黑（Windows），同为免费可商用黑体风格，观感接近
5. **网络**：Roboto woff2 在执行时自动从 cdn.jsdelivr.net 下载到 `assets/fonts/`，需能访问该 CDN
6. **无需安装**：Roboto（自动下载）、浏览器（系统自带）、HTTP 服务器（python3 内置）、截图能力（Browser 子代理提供）

## Fonts (mandatory, free for commercial use)

- 中文：思源黑体，字体栈**绝对纯粹**——`--sans` 仅 `'Roboto','Source Han Sans SC'`，`--mono` 仅 `'Source Han Sans SC'`（代码块也强制思源黑体）；别名（Noto Sans SC/思源黑体）与兜底（苹方/雅黑/系统字体/sans-serif）一律清除；SVG 内 font-family 同样仅此两字体。未装思源黑体时宁可缺字（截图抽检必发现），不可静默回退
- 英文/数字：Roboto，self-hosted woff2（400/500/700/900），从 `https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.2.6/files/roboto-latin-{w}-normal.woff2` 下载到 `assets/fonts/`（每个约 20KB）
- 两者均为 SIL Open Font License，免费可商用

## Workflow

### 0. 意图分流（先辨场景，选对分支）

- 用户丢来 **docx / md / txt**（或仅一个文件路径）→ 走全流程 1→5
- 用户丢来 **已有 HTML + 要截图**（「把这个页面按章节截一下」）→ 走第 6 步「只截图」分支
- 用户丢来 **已有 HTML + 要美化**（「美化一下」「按你的风格装修」）→ 走第 6 步「只美化」分支，定稿后按需截图
- 拿不准时用一句话确认意图，不擅自走全流程

**识别词表（用户说法千变万化，按意图对号入座）**：

| 用户意图 | 常见说法（听到任一即进对应分支） |
|:---|:---|
| **全流程**（文档→HTML→截图） | 转成网页 / 做成 HTML / 生成页面 / 排版 / 装裱 / 公众号排版 / 把 Word 变成网页 / 这篇文章做个好看的页面 / 处理这个文档 |
| **只美化**（已有 HTML） | 美化 / 装修 / 改样式 / 换配色 / 调排版 / 好看点 / 精致一点 / 优化页面 / 升级版式 / 换个风格 |
| **只截图**（已有 HTML） | 截图 / 按章节截图 / 逐章截图 / 截成长图 / 每章一张图 / 生成配图 / 出图 / 导出图片 / 公众号配图 / 要长图 |
| **问用法** | 使用说明 / 怎么用 / 能干什么 / 有什么功能 / 怎么操作 / 帮助 / 介绍一下 |

- 按文件类型兜底：`*.docx / *.doc / *.md / *.txt` → 全流程；`*.html` → 按其余关键词分流到只美化 / 只截图
- 说「截图」且文件是 html → 只截图；说「截图」且文件是 docx/md → 全流程（含截图）
- 词表未覆盖且拿不准时，一句话反问确认，不瞎猜

### 1. Parse the source document

- `.docx`：运行 `python3 scripts/extract_docx.py input.docx --media-dir /tmp/docx-extract > /tmp/extracted.json`，输出正文段落（`texts`）、表格结构（`tables`，行优先二维数组，重建表格时按行列还原）、图片清单（`media`）并落盘到 media-dir
- `.md` / `.txt`：直接用 Read 读取
- **用 Read 工具逐张查看文档内嵌图片**，弄清每张图表内容，然后**用 HTML/CSS 重绘**——绝不嵌入原图（位图截图会糊）

### 2. Prepare fonts

- 下载 4 个 Roboto 字重：`python3 scripts/download_roboto.py <目标目录>/assets/fonts`（脚本自动跳过已存在的文件）
- 思源黑体：先运行 `python3 scripts/install_sourcehan.py` 检测（已装则直接跳过，无任何动作）
- **缺失时用 AskUserQuestion 询问，并完整告知**：①不安装则无法使用思源黑体，中文将 fallback 到苹方/微软雅黑（观感接近但不是思源黑体）；②字体白名单锁死为 Roboto + 思源黑体，无任何替代字体
- 询问选项：「自动安装思源黑体（推荐）/ 跳过用系统 fallback」——字体白名单锁死为 Roboto + 思源黑体，不接受第三方字体；默认不擅自修改用户系统，除非用户明确要求全自动
- 自动安装细节：脚本内置 ghfast.top 镜像兜底 + SHA-256 校验，装完提示用户重启浏览器生效
- 严禁执行 `atsutil databases -removeUser`（会破坏 macOS 字体数据库，用 `killall fontd` 刷新缓存）

### 2.5 按气质选版式（构建前）

- 通读解析出的内容，判断文章气质（科技 / 文艺 / 教程 / 科普 / 报道 / 商业等），从 [design-system.md](design-system.md)「0. 风格菜单」的六款版式中选一款
- 默认款（暗色封面长文风）适用于大多数科技 / 产品文；文艺散文选文艺排版风；教程干货选极简白；硬核技术选终端极客风；科普清单选卡片流；深度报道选报纸分栏
- 拿不准或用户有明确偏好时，用 AskUserQuestion 让用户在 2-4 款候选里挑（每款附一句话气质描述），不替用户做有风格争议的决定
- A 款页面主题色默认取 user-config.md 的 `THEME` 值写入 `<html data-theme>`，页面右下角换肤坞四色点随点随换（浏览器本地记忆，键按页内嵌唯一 ID 隔离、多份产物互不串台、改名/移动目录记忆不丢（生成时头部写 `<meta name="article-id" content="<UUID>">`，每次 crypto.randomUUID() 生成标准 UUID v4（8-4-4-4-12 十六进制，禁止手写变体、禁止沿用占位与旧值）；落盘写文件前顺扫落盘目录下本技能命名的 html，读各文件 id meta 查重，撞号重掷至不重复））
- 任何风格都不许引入第三个字体：文艺排版风同样只用思源黑体，文艺感靠排版营造（大行距、留白、首字下沉、细分割线），不得改用宋体
- 无论哪款风格：字体白名单锁死（Roboto + 思源黑体）、零兜底、第 3.5 步核查照跑

### 3. Build the HTML

- **先 Read `resources/reference.html`**（A 款骨架与 18 组件全集，设计真相源）再动手——骨架结构、组件用法、主题令牌以 reference.html 为准，与 design-system.md 冲突时 reference.html 说了算
- 先写入当前工作区（如 `outputs/<标题>.html`），完成后用 Bash `cp` 到用户目标目录——Write 工具被沙盒限制在工作区内
- 大文件分片写：Write 创建文件（head + 封面 + 前几章），后续用 SearchReplace 以文件末尾 `</section>\n</div>\n</body>\n</html>` 为锚点追加章节
- 使用 [design-system.md](design-system.md) 中的 CSS 变量与组件模式；源文档中每张图表必须有对应的 HTML/CSS 组件；表格 `td` 一律 `vertical-align:middle`
- A 款生成时 `<html>` 标签必须带 `data-theme="<THEME值>"` + 换肤坞 HTML 与坞 JS（见 design-system.md 骨架模板）；主题色一律用 --accent 家族令牌，禁止硬编码色值
- 页面背景默认浅灰 `#f6f8fb`；用户要纯白截图时改 `--bg:#ffffff`（深色封面 hero 保持不动）

### 3.5 交付前零侵权核查（必做，不可跳过）

生成 HTML 后、交付与截图前，逐文件执行以下 grep 扫描，**任何命中都必须清零**：

```bash
grep -nE "PingFang|YaHei|apple-system|sans-serif|serif|monospace|SF Mono|Menlo|Monaco|Consolas|Arial|Helvetica|宋体|黑体|楷体|微软雅黑|system-ui|googleapis" <产出.html>
```

全页字体只允许两个家族名：`Source Han Sans SC`（SIL OFL 1.1）与 `Roboto`（Apache 2.0，仅本地 woff2，禁引任何字体 CDN）。宁可缺字方框，不可出现任何未经授权字体——合规性高于美观性。

**六类逐项核查表**（中文 / 英文 / 数字 / 代码 / SVG / emoji）：

| 类别 | 合法字体 | 禁用 |
|:---|:---|:---|
| 中文正文/标题 | Source Han Sans SC（OFL） | 宋体/黑体/楷体/仿宋/方正/汉仪/华文及一切商业字体 |
| 英文 | Roboto（Apache 2.0） | Arial/Helvetica/Verdana/Georgia/Times 等 |
| 数字 | Roboto（Apache 2.0） | 同上 |
| 代码 code/pre | Source Han Sans SC（--mono 仅此一家） | 等宽商业字体、系统等宽字体 |
| SVG 内文字 | Roboto + Source Han Sans SC | 其他任何字体名 |
| emoji | 系统内置 emoji 字体（无风险，无需处理） | — |

**外部资源核查**：grep `https?://|<link|<script|@import` 确认无字体 CDN、无外部样式/脚本；SVG 命名空间 `w3.org/2000/svg` 与文内引文链接属正常，不构成字体风险。

### 4. Local deliverables

- 标准版：`<标题>.html` + 同级 `assets/fonts/`
- 单文件自包含版：`python3 scripts/inline_fonts.py <src.html> <out.html> <fonts_dir>`，将 Roboto 以 base64 内嵌，双击即开、可随意移动分享

### 4.5 用户确认（先确认后截图，必做）

**时机**：HTML 交付后、截图前。用 RunPreview 打开页面，同时把本地文件路径告知用户（双击即开），再 AskUserQuestion 询问。

**询问设计**：
「页面效果是否满意？」
- **满意，开始截图** → 进入第 5 步
- **需要调整** → 请用户自由描述哪里不满意（配色/布局/字号/图表样式/内容组织/封面），不限于预设选项
- **全自动模式**：用户曾明确表示「不用问、一路做完」时，跳过本节点直接截图；否则一律先问

**调整执行纪律**：
- 只改工作区 HTML → `cp` 覆盖目标目录标准版 → 再次 RunPreview + 询问确认，循环至满意
- 小调整（改色/间距/字号）只动 CSS；大调整（重排章节/换图表形式）才动结构
- **调整期间暂不重铸单文件版**（每次重铸费时且无必要）；最终定稿后再用 `inline_fonts.py` 重铸一次即可
- **每轮调整后重跑第 3.5 步零侵权核查**——防止调整过程引入新字体污染

**轮次控制**：
- 至多 3 轮调整；仍不满意时请用户给出具体参照（参考页面/颜色值/样式截图），避免盲目迭代

**截图后确认（确认二）**：
- 请用户抽查封面 + 最长章节两张图
- 发现方框缺字（字体问题）、截断、宽度不一致 → 定位修复后**只重截该章节**，不全部重来
- 用户点头 → 完工，收尾汇报交付物清单

### 5. Capture screenshots (per chapter)

- 目标目录起服务：`python3 -m http.server 8931`（后台运行），再 RunPreview
- 派发 **一个** Browser 子代理，明确指令如下：
  - 打开页面，**先做字体自检**：`document.fonts.check('16px Roboto')` 与 `document.fonts.check('16px "Source Han Sans SC"')` 必须为 true；再用测量法复核——把一段中文与一段英文渲染到 canvas，分别用目标字体与苹方/Arial 测量宽度，实际渲染宽度与目标字体一致才继续截图；不一致则停止并报告（说明用户系统缺思源黑体，需先安装）
  - 截图对象：封面 `.hero` + `.wrap` 内每个 `section`（引言 + 各章 + 写在最后 + 作者），一章节一张
  - **统一宽度**：JS 注入 `.hero` → `width:730px;margin:0 auto;padding:112px 16px 104px;box-sizing:border-box`；每个 section → `padding:72px 16px 24px`；DPR=2 时所有图宽度一致（1460px）
  - 元素级截图，截前先 `scrollIntoView`；四周 16px 内边距保证 box-shadow 阴影完整显示
  - 命名与顺序：`C00-封面.png`、`C00-引言.png`、`C01-<章节短名>.png` … `C13-作者介绍.png`，保存到 `<目标目录>/文章截图/<标题slug>/`（slug 用简洁英文或拼音；每篇文章一个目录，多篇文章截图互不覆盖；同一目标目录下已有同 slug 目录时对话确认归属，同名不同篇则 slug 追加 -2/-3 序号）
  - 若子代理报浏览器窗口不可见（`NATIVE_BROWSER_VIEWPORT_UNAVAILABLE`），请用户把浏览器窗口置前，然后重新派发子代理；不要无限重试

- **窗口不可见时的 headless 兜底**（三轮置前失败后直接走此路，无需可见窗口）：
  - 工具链：`pip3 install --user playwright`；启动用系统 Chrome：`p.chromium.launch(channel="chrome", headless=True)`（无需 playwright install 下载浏览器）
  - 脚本要点：`new_page(device_scale_factor=2)`（Retina 2x）→ `goto(file://或 http://)` → `wait_for_load_state("networkidle")` → 等 `document.fonts.ready` → 字体自检双 true → `page.evaluate(JS注入样式)` → 逐元素 `el.scroll_into_view_if_needed()` + `el.screenshot(path=…)`
  - 注入样式与 Browser 子代理完全一致（宽 730px + 四边 16px padding + box-sizing:border-box），产出同规格 1460px；file:// 协议下 woff2 相对路径可正常加载
  - 完成后 `sips -g pixelWidth` 批量验证宽度，Read 抽 2 帧自查
- 截图完成后**抽查验证**：Read 查看封面 + 最长章节两张图，确认无截断、宽度一致（1460px ±2）、边距完整；同时**抽检字体**：放大细看中文笔画是否锐利、有无豆腐块（□）或缺字——字体栈已无兜底，出现缺字即说明系统缺思源黑体，必须停下装字体后重截
- 端口占用：`python3 -m http.server 8931` 报 Address already in use 时换 8932/8933 等端口

### 6. 只截图 / 只美化已有 HTML（快捷分支）

适用：用户直接给一个已存在的 .html 文件，要求截图或美化。共同第一步是骨架侦察。

**6.1 骨架侦察**

- Read 该 HTML，认出三样：封面容器、正文容器、章节容器。自家设计系统骨架为 `.hero` + `.wrap` 内平铺 `section`
- **自家骨架** → 直接进 6.3 截图，或按用户要求进 6.2 改样式
- **陌生骨架**：
  - 结构清晰可映射（有明显封面区、章节分块、内容宽度集中）→ 记下封面/章节的选择器清单，把第 5 步注入规则换成对应选择器（封面压 730px 宽居中、每章节加 `padding:72px 16px 24px`；DPR=2 时全图 1460px 不变）
  - 无章节概念 / 版面混乱 → 明示用户：直接截会宽窄不一，建议先走 6.2 把版面收拢成标准骨架
- 无论哪种骨架，**截图前都先跑第 3.5 步零侵权核查**——外来 HTML 常带苹方/雅黑/sans-serif 兜底，任何命中必须清零；缺字体则回到第 2 步字体准备

**6.2 只美化**

- 等价于「更新模式」的「仅改样式保留内容」：只动 CSS（配色/间距/字号/组件样式），不动正文；若外来 HTML 缺章节骨架，可顺手改造成自家骨架（文字不动）
- **每轮调整后重跑第 3.5 步核查**，防调整引入新字体污染
- 第 4.5 步双确认闭环照跑：美化完先 RunPreview 问满意，点头才进入截图；至多 3 轮
- 美化 A 款自家骨架时保留换肤坞（坞 HTML + 坞 JS + [data-theme] 块）；被误删时按 reference.html 的坞 HTML/坞 JS 补装
- 美化定稿后用户要截图 → 转 6.3；单文件版如需要，用 inline_fonts.py 重铸

**6.3 只截图**

- 复用第 5 步全部规格（字体自检、统一宽度 1460px、四周 16px 余白、C00 命名顺序、抽查验证），仅把注入选择器换成 6.1 侦察所得
- 章节命名：按侦察到的章节顺序 `C00-封面` → `C00-引言` → `C01…` 依次编号
- 若子代理报窗口不可见，请用户把浏览器置前再重派，不无限重试

## 更新模式（目标目录已有同名 HTML 时）

先检测目标目录是否已有产物；存在时用 AskUserQuestion 询问（本节仅指目标目录已有本 Skill 产物时的三选一；对任意已有 HTML 的直接操作统一走第 6 步快捷分支）：
「覆盖重新生成 / 只重新截图 / 仅改样式保留内容」。改样式类小调整直接 SearchReplace 工作区文件后重新 `cp` + 重截，不要从头重建。

## Output conventions

<目标目录> = 用户口头指定的目录；未指定时取 user-config.md 的 DIR（auto 按系统选 DIR_MAC/DIR_WIN，目录不存在时回退用户主目录）。

```
<目标目录>/
├── <标题>.html                        # 标准版（依赖 assets/fonts）
├── <标题>-单文件版.html                # 字体全内嵌，双击即开
├── assets/fonts/roboto-latin-{400,500,700,900}-normal.woff2
└── 文章截图/<标题slug>/            # 每篇文章一个目录，互不覆盖
    ├── C00-封面.png  C00-引言.png  C01-*.png … C13-作者介绍.png
```

- 落盘完成后，对话回复必须向用户报告落盘位置：列出实际写入的目录完整路径与文件清单（如「已落盘到 ~/articles/<标题>/：<标题>.html、<标题>-单文件版.html、assets/fonts/、文章截图/<标题slug>/ 的 C00-C13 共 N 张」），并注明 html 是否已在浏览器打开、章节截图是否跳过（Chrome/Edge 都不存在时）


## 🔧 报修处理流程（用户报页面问题时）

用户说「页面 / 截图效果不对 / 第 X 章有 XX 问题 / 布局乱了」（常附截图或指出具体现象）→ 按以下流程处理：

1. **立标准**：先 Read `resources/reference.html`——A 款骨架与组件全集就是本 skill 的设计真相源；六款版式参数对照根目录 `design-system.md`；两者冲突以 reference.html 为准
2. **找问题**：Read 那份问题 html，对照 design-system.md 逐处比对（版式结构 / --accent 令牌 / 字体白名单 / 图表组件），定位跑偏处；用户给了截图则按截图现象反查
3. **修复**：以 design-system.md 为准修复（只修跑偏处）；改完重跑「3.5 交付前零侵权核查」grep 扫描——任何字体污染命中必须清零
4. **自证**：按第 5 步规格重截问题章节（1460px 统一宽度），Read 自查恢复标准效果；用户给了问题截图时尽量复现同视角截图做前后对比
5. **汇报**：一句话说清问题根因 + 修复了什么 + 附截图；若根因在 design-system.md 或 reference.html 自身（版式规范本身有缺陷），顺修这两个文件保持同步（reference.html 是真相源）并在汇报中说明「设计标准已同步修正」

## Pitfalls

1. **Write 沙盒限制**：工作区外无法直接 Write → 写工作区 `outputs/` 再 `cp` 到目标目录
2. **图表必须重绘**：HTML/CSS 矢量重绘在 Retina 截图中保持锐利；嵌原图必糊
3. **大文件追加**：SearchReplace 锚点必须是当前文件末尾唯一片段（`</section>\n</div>\n</body>\n</html>`），禁止整文件重写
4. **子代理窗口不可见**：元素截图会失败——让用户把浏览器置前后重试一次
5. **宽度一致性**：不注入固定宽度时封面是全宽（视口宽）、章节是内容宽（698px），宽窄不一；必须按第 5 步注入样式后再截
6. **字体栈严禁兜底**：--sans/--mono 只许 Roboto + 思源黑体（含 Noto/思源黑体别名），加苹方/雅黑兜底会导致字体缺失时静默回退、截图抽检无法发现
7. **章节截图顺序**：`C00-封面` → `C00-引言` → `C01…C13`，按序拼接即整篇长图
8. **主题色禁止硬编码**：A 款配色一律走 --accent 家族令牌（--accent/--hero-base/--title-grad 等），写死色值会导致换肤坞失灵、四主题渲染错乱


---

## 🔍 SkillForge 使用指引（整体咨询时触发）

当用户询问 **SkillForge 本身**（不是单个技能用法）——「skillforge 怎么用 / 使用说明 / 使用指引 / 是什么」「技能怎么安装 / 怎么升级 / 装了哪些技能 / 技能清单」「skill-forge ls / init / update 等命令怎么用」「技能安装器 / 技能锻造坊」等（中英文、近似说法均可，关键词可自由扩展）：
1. Read 同目录 `resources/skillforge-guide.txt` 全文，按其内容整理回答（命令与参数以 txt 为准，勿自行编造）
2. 用系统命令打开同目录 `resources/skillforge-guide.html`（macOS `open`，Windows `start`），让用户在浏览器看排版版
3. 用户只问单个技能怎么用时（如「日报怎么用」）不触发本指引，走本技能的使用说明
