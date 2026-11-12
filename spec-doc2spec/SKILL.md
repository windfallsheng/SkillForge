---
name: spec-doc2spec
description: >
  文档转高质量 Markdown Skill（doc2spec）。把 Word / PDF / Markdown 文档转成结构化 Markdown——Pandoc 负责机械转换，AI 全程校对防错（量化校验断言、双通道完整性比对、表格列表修复、图片提取与 EMF/WMF 自动转 PNG、乱码与修订痕清理），转换后整理成干净的正文稿落盘。
  可选「需求加工档」：用户要求整理成需求规格时，另出需求点+验收标准与功能单元切片。
  图片自动提取到 assets/images（可配置 IMG_DIR）；输出默认源文档同目录下 {文档名}-spec/ 子目录，可配置 OUTPUT_DIR（绝对路径同样按文档名建子目录，多文档互不覆盖）。
  跨系统适配 macOS / Windows / Linux（Pandoc 安装、EMF 转换工具链探测）。支持 .docx（Pandoc 转换）/ .md（直接读取）/ .pdf（LibreOffice 转 docx 优先保留图片版式，降级 pdftotext 纯文本）。
  不处理一般性的文档内容讨论（如「帮我看看这份文档讲了什么」），只处理「文档 → Markdown / 需求规格」的转换任务。
  用户询问用法（doc2spec 怎么用/使用说明/能干什么）时走使用说明应答：读 resources/usage-guide.md 原样输出（首行标题改为「doc2spec 使用指南」），不执行任何转换命令。
allowed-tools: ["Bash", "Read", "Write", "Edit"]
disable-model-invocation: false
---

# 文档 → 高质量 Markdown（doc2spec）

将 Word / PDF / Markdown 文档转换为结构化 Markdown。分工原则：**Pandoc 负责机械转换，AI 负责校对防错与整理**——Pandoc 对复杂表格（合并单元格拆裂）、文本框（内容丢失）、图片（EMF 格式浏览器不可渲染）、修订痕（删除线残留）存在已知局限，机械产物一律只作底稿，AI 必须对照原文逐段校对、纠错补漏后再整理成稿。用户要求「整理成需求规格」时另启用需求加工档。

## 生成流程

0. **读用户配置**（OUTPUT_DIR/IMG_DIR/EMF_POLICY/CONFIRM/CONFIG_VERSION）→ 先 Read 同目录 `user-config.md`
1. **依赖检测**（每次必做）→ `pandoc --version`；未安装按「安装指引」输出并停止，不执行任何转换命令
2. **格式路由** → `.docx` 走 Pandoc 机械转换；`.md` 直接 Read 原文（跳过第 3 步转换，第 4 步校对照做）；`.pdf` 先 `soffice --headless --convert-to docx --outdir <临时目录> <输入.pdf>` 转 docx 再走完整 docx 路径（保留图片与版式；无 LibreOffice 或转换失败时降级 `pdftotext -layout <输入.pdf> 00-plain.txt` 纯文本提取——仅文本无图，如实告知用户）
3. **建目录 + Pandoc 机械转换** → 先 `mkdir -p <输出目录>`（输出目录规则见 `resources/structure.md`）→ **cd 到输出目录再执行**（图片提取以输出目录为基准，引用路径才正确）：`pandoc <输入绝对路径.docx> -f docx -t gfm --extract-media=<IMG_DIR> -o 00-converted.md`；另生成 `pandoc <输入绝对路径.docx> -t plain -o 00-plain.txt` 纯文本底稿供完整性核对
4. **AI 逐段校对（防错防漏，必做）** → 读 `resources/checklist.md`：量化校验断言 + 双通道比对 + 专项排查，发现错误直接在 00-converted.md 上修正
5. **图片处理** → 读 `resources/images.md`：图片拍平到 IMG_DIR、引用校验、EMF/WMF 跨系统转 PNG、图片内容抽检
6. **AI 整理与落盘** → 读 `resources/structure.md`：整理 01-正文.md（去噪 + 表格列表修复 + 图片引用就位）；用户要求「整理成需求规格 / 提炼需求点」时另出需求加工档（01-需求规格.md / requirements/ 切片）；生成 README 索引与 _clarify.md 澄清清单
7. **报告** → 产出路径、章节清单、校对修正记录、待澄清点

## ⚙️ 配置与自定义

**执行本 skill 前必须先 Read 同目录 `user-config.md`**：默认配置（OUTPUT_DIR/IMG_DIR/EMF_POLICY/CONFIRM/CONFIG_VERSION）与临时口头要求说明都在该文件中，以它为准。升级技能时 user-config.md 不会被覆盖，你的修改永久保留；官方更新配置时另存 `user-config.md.upstream` 对照文件，可按需手动合并新配置点。

## 配置版本机制（升级保护）

本 skill 当前配置版本为 `2`（对应 user-config.md 中的 `CONFIG_VERSION`）。执行时若发现 user-config.md 的 CONFIG_VERSION 与本节声明的当前版本不一致：

1. 先将旧 user-config.md 备份为 `user-config.md.bak-<时间戳>`（同目录，绝不删除旧值）
2. 按本节「配置升级规则」迁移字段：新增字段补默认值、改名字段按映射改写、删除字段的值保留在备份中并在对话提示用户手动确认
3. 更新 CONFIG_VERSION 为当前版本
4. 对话中明确告知用户「检测到配置版本从 X 升级到 Y，旧配置已备份至 <路径>」

升级本 skill 时，配置结构如有变化必须同步更新本节的当前版本号与迁移说明；禁止在未声明版本变更的情况下静默修改配置语义。

当前版本变更记录：v1→v2 OUTPUT_DIR 绝对路径模式同样按 {文档名}-spec/ 建子目录（多文档互不覆盖，说「直接放这个目录」才平铺）；PDF 输入改 LibreOffice 转 docx 优先（保留图片版式，降级 pdftotext）；图片提取改「输出目录内执行 pandoc + media/ 拍平」。

## 文档同步自检纪律（维护者必读）

修改本 skill 任一文件（SKILL.md / user-config.md / resources/*）后，必须 grep 全文核对相关关键词在各文件间一致（如配置键名/流程节点/阶段名改名时新旧词全仓核对，旧词零残留才算完成）。

## 安装指引（仅当检测未安装时输出给用户）

Pandoc 跨系统安装（开源免费，官网 https://pandoc.org/installing.html）：

1. **macOS**：`brew install pandoc`（未装 Homebrew 先装 brew，或从官网下载 .pkg 双击安装）
2. **Windows**：`winget install --id JohnMacFarlane.Pandoc`（无 winget 时从官网下载 .msi 双击安装，默认选项即可）
3. **Linux**：Debian/Ubuntu `sudo apt-get install pandoc`；Fedora `sudo dnf install pandoc`；Arch `sudo pacman -S pandoc`
4. **验证**：`pandoc --version` 输出版本号即成功；Windows 若提示找不到命令，关闭并重新打开终端刷新 PATH

EMF 图片转 PNG 依赖 LibreOffice（可选，仅当文档含 EMF 图）：macOS `brew install --cask libreoffice`；Windows `winget install TheDocumentFoundation.LibreOffice`；Linux `sudo apt-get install libreoffice`。

安装完成后，请用户重新说一次需求，再走「生成流程」。

## 使用说明

用户仅询问使用方法（「spec-doc2spec 怎么用 / 使用说明 / 使用步骤 / 能干什么」）时不启动流程，读 `resources/usage-guide.md` 将其内容原样输出（首行标题改为「doc2spec 使用指南」），不执行任何转换命令。

## 规则速览

- 机械产物只作底稿：AI 校对（量化断言 + 双通道比对 + 专项排查）与整理（01-正文.md）缺一不可
- 图片一律进 IMG_DIR（默认 assets/images，拍平无 media/ 残留），EMF/WMF 必须先转 PNG（soffice headless → qlmanage → magick 按系统探测）
- 输出目录默认 {文档名}-spec/（auto 或绝对路径均按文档名建子目录），00-converted.md 底稿保留溯源、整理稿另写不覆盖底稿
- 需求加工是可选档：用户说「整理成需求规格 / 提炼需求点」才出 01-需求规格.md 与 requirements/ 切片
- 有疑点进 _clarify.md，不臆造内容；落盘后向用户报告产出路径/章节清单/校对记录/待澄清点


---

## 🔍 SkillForge 使用指引（整体咨询时触发）

当用户询问 **SkillForge 本身**（不是单个技能用法）——「skillforge 怎么用 / 使用说明 / 使用指引 / 是什么」「技能怎么安装 / 怎么升级 / 装了哪些技能 / 技能清单」「skill-forge ls / init / update 等命令怎么用」「技能安装器 / 技能锻造坊」等（中英文、近似说法均可，关键词可自由扩展）：
1. Read 同目录 `resources/skillforge-guide.txt` 全文，按其内容整理回答（命令与参数以 txt 为准，勿自行编造）
2. 用系统命令打开同目录 `resources/skillforge-guide.html`（macOS `open`，Windows `start`），让用户在浏览器看排版版
3. 用户只问单个技能怎么用时（如「日报怎么用」）不触发本指引，走本技能的使用说明
