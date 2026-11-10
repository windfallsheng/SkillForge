---
name: spec-doc2spec
description: >
  文档转需求规格 Skill（doc2spec）。仅在用户要求把 PRD / Word / Markdown 需求文档转成结构化需求文档
  （需求点提炼、功能单元切分）时使用。Pandoc 负责 Word→Markdown 机械转换，AI 全程参与校对防错——
  Pandoc 对复杂表格（合并单元格拆裂）、文本框（内容丢失）、图片（EMF/WMF 浏览器不可渲染）、修订痕（删除线残留）
  有已知局限，机械产物一律只作底稿，AI 对照原文逐段校对、纠错补漏后再加工成需求规格。
  图片自动提取与目录组织（默认 assets/images/，可配置 IMG_DIR；EMF/WMF 自动检测并跨系统转 PNG）。
  输出目录默认源文档同目录下 {文档名}-spec/ 子目录，可配置 OUTPUT_DIR。
  跨系统适配 macOS / Windows / Linux（Pandoc 安装、EMF 转换工具链探测、路径引用）。
  支持 .docx（Pandoc 转换）/ .md（直接读取）；.pdf 走 pdftotext 文本提取（无图）或提示先转 Word。
  不处理一般性的文档内容讨论（如「帮我看看这份文档讲了什么」），只处理「文档 → 需求规格」的转换任务。
allowed-tools: ["Bash", "Read", "Write", "Edit"]
disable-model-invocation: false
---

# 文档 → 需求规格（doc2spec）

将产品需求文档（PRD）转换为结构化的 Markdown 需求文档。分工原则：**Pandoc 负责机械转换，AI 负责校对防错与需求加工**——Pandoc 对复杂表格（合并单元格拆裂）、文本框（内容丢失）、图片（EMF 格式浏览器不可渲染）、修订痕（删除线残留）存在已知局限，机械产物一律只作底稿，AI 必须对照原文逐段校对、纠错补漏后再加工。

## 生成流程

0. **读用户配置**（OUTPUT_DIR/IMG_DIR/EMF_POLICY/CONFIRM/CONFIG_VERSION）→ 先 Read 同目录 `user-config.md`
1. **依赖检测**（每次必做）→ `pandoc --version`；未安装按「安装指引」输出并停止，不执行任何转换命令
2. **格式路由** → `.docx` 走 Pandoc 机械转换；`.md` 直接 Read 原文（跳过第 3 步转换，第 4 步校对照做）；`.pdf` 走 `pdftotext` 文本提取（仅文本、无图无版式）或提示用户先转 Word
3. **Pandoc 机械转换** → `pandoc <输入.docx> -f docx -t gfm --extract-media=<IMG_DIR> -o 00-converted.md`（标题/表格/列表保留、图片提取到 IMG_DIR）；另生成 `pandoc <输入.docx> -t plain -o 00-plain.txt` 纯文本底稿供完整性核对
4. **AI 逐段校对（防错防漏，必做）** → 读 `resources/checklist.md`：对照源文档逐段核对完整性/表格/列表/图片/乱码/修订痕/页眉页脚噪音，发现错误直接在 00-converted.md 上修正
5. **图片处理** → 读 `resources/images.md`：校验图片引用路径、检测 EMF/WMF 并跨系统转 PNG、处理缺失图片
6. **AI 结构加工与落盘** → 读 `resources/structure.md`：提炼需求点与验收标准、按功能单元切分章节、生成澄清清单，按目录规范落盘
7. **报告** → 产出路径、功能单元清单、校对修正记录、待澄清需求点

## ⚙️ 配置与自定义

**执行本 skill 前必须先 Read 同目录 `user-config.md`**：默认配置（OUTPUT_DIR/IMG_DIR/EMF_POLICY/CONFIRM/CONFIG_VERSION）与临时口头要求说明都在该文件中，以它为准。升级技能时 user-config.md 不会被覆盖，你的修改永久保留；官方更新配置时另存 `user-config.md.upstream` 对照文件，可按需手动合并新配置点。

## 配置版本机制（升级保护）

本 skill 当前配置版本为 `1`（对应 user-config.md 中的 `CONFIG_VERSION`）。执行时若发现 user-config.md 的 CONFIG_VERSION 与本节声明的当前版本不一致：

1. 先将旧 user-config.md 备份为 `user-config.md.bak-<时间戳>`（同目录，绝不删除旧值）
2. 按本节「配置升级规则」迁移字段：新增字段补默认值、改名字段按映射改写、删除字段的值保留在备份中并在对话提示用户手动确认
3. 更新 CONFIG_VERSION 为当前版本
4. 对话中明确告知用户「检测到配置版本从 X 升级到 Y，旧配置已备份至 <路径>」

升级本 skill 时，配置结构如有变化必须同步更新本节的当前版本号与迁移说明；禁止在未声明版本变更的情况下静默修改配置语义。

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

- 机械产物只作底稿：AI 校对（完整性/表格/图片/乱码/修订痕）与需求加工（需求点+验收标准、功能单元切分、澄清清单）缺一不可
- 图片一律进 IMG_DIR（默认 assets/images），EMF/WMF 必须先转 PNG（soffice headless → qlmanage → magick 按系统探测）
- 输出目录默认 {文档名}-spec/，00-converted.md 底稿保留溯源、加工稿另写不覆盖底稿
- 有疑点进 _clarify.md，不臆造内容；落盘后向用户报告产出路径/单元清单/校对记录/待澄清点
