---
name: spec-spec2doc
description: 文档转 Word/PDF 交付稿 Skill（spec2doc）。把 Markdown 文档（规格/技术文档/说明文档/会议纪要等）导出为 Word / PDF—— Pandoc 负责机械转换，AI 负责转换前排版整理与转换后回验防错（Pandoc 对复杂表格、图片路径、中文字体有局限， 回验发现问题修正源稿重新转换直到通过，机械产物不直接交付）。主路径 Markdown → Word（支持 --reference-doc 模板：默认依次探测源目录 template.docx / reference.docx，可配置 TEMPLATE_DOCX）。 Markdown → PDF 双路径：xelatex（需 LaTeX 引擎与 CJK 中文字体）或 Chrome headless 打印（免 LaTeX、跨系统兜底）， 引擎可配置 PDF_ENGINE。输出目录默认与源文档同目录，可配置 OUTPUT_DIR。 跨系统适配 macOS / Windows / Linux（Pandoc/LaTeX 安装、中文字体探测、Chrome 路径探测）。 .txt 纯文本视为无格式 md 同样可转；不处理一般性的文档内容讨论，只处理「Markdown → Word/PDF」的转换任务。 用户询问用法（spec2doc 怎么用/使用说明/能干什么）时走使用说明应答：读 resources/usage-guide.md 原样输出（首行标题改为「spec2doc 使用指南」），不执行任何转换命令。
allowed-tools: ["Bash", "Read", "Write", "Edit"]
disable-model-invocation: false
---

# Markdown → Word/PDF（spec2doc）

将 Markdown 文档（规格 / 技术文档 / 说明文档 / 会议纪要等）转换为 Word / PDF 交付文档。分工原则：**Pandoc 负责机械转换，AI 负责排版整理与回验防错**——AI 转换前整理标题层级/表格/图片路径，转换后核对产出文档内容完整与格式正确，发现问题修正源稿重新转换，直到回验通过（机械产物不直接交付）。

## 生成流程

0. **读用户配置**（OUTPUT_DIR/TEMPLATE_DOCX/TOC/PDF_ENGINE/CONFIG_VERSION）→ 先 Read 同目录 `user-config.md`
1. **依赖检测**（每次必做）→ `pandoc --version`；未安装按「安装指引」输出并停止。目标为 PDF 时另探测引擎：`xelatex --version`（LaTeX 路径）→ Chrome 路径（打印路径），细节读 `resources/pdf-path.md`
2. **AI 排版整理** → 统一标题层级、规整表格（超宽表拆表或改列表）、检查图片引用路径、确定元信息（标题/作者）
3. **Pandoc 输出** → Word：`pandoc <输入.md> -f gfm -t docx -o <输出.docx> [--reference-doc=<模板>] [--toc --toc-depth=3]`（模板探测与图片路径读 `resources/images-and-template.md`）；PDF：双路径命令读 `resources/pdf-path.md`
4. **AI 回验（防错防漏，必做）** → 读 `resources/checklist.md`：反向转换比对内容完整性、图片嵌入核对、标题层级、中文显示、乱码排查
5. **修正重转** → 发现问题修正源稿重新转换，再次回验；重转不超过 3 轮，仍不通过如实报告「哪些项无法修复 + 原因」，不交付带错文档
6. **报告** → 输出路径与格式、回验结论、PDF 引擎与兜底说明

## ⚙️ 配置与自定义

**执行本 skill 前必须先 Read 同目录 `user-config.md`**：默认配置（OUTPUT_DIR/TEMPLATE_DOCX/TOC/PDF_ENGINE/CONFIG_VERSION）与临时口头要求说明都在该文件中，以它为准。升级技能时 user-config.md 不会被覆盖，你的修改永久保留；官方更新配置时另存 `user-config.upstream.md` 对照文件，可按需手动合并新配置点。

## 配置版本机制（升级保护）

本 skill 当前配置版本为 `1`（对应 user-config.md 中的 `CONFIG_VERSION`）。执行时若发现 user-config.md 的 CONFIG_VERSION 与本节声明的当前版本不一致：

1. 先将旧 user-config.md 备份为 `user-config.bak-<时间戳>.md`（同目录，绝不删除旧值）
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

PDF 的 LaTeX 引擎（仅当要求 LaTeX 出 PDF 时）：macOS `brew install --cask basictex`（装完 `sudo tlmgr install ctex`）；Windows `winget install MiKTeX.MiKTeX`；Linux Debian/Ubuntu `sudo apt-get install texlive-xetex texlive-lang-chinese`。免装 LaTeX 可走 Chrome 打印路径（见 resources/pdf-path.md）。

安装完成后，请用户重新说一次需求，再走「生成流程」。

## 使用说明

用户仅询问使用方法（「spec-spec2doc 怎么用 / 使用说明 / 使用步骤 / 能干什么」）时不启动流程，读 `resources/usage-guide.md` 将其内容原样输出（首行标题改为「spec2doc 使用指南」），不执行任何转换命令。

## 规则速览

- 机械产物不直接交付：AI 排版整理（转换前）与回验防错（转换后）缺一不可，发现问题修正源稿重转直到通过
- Word 是主路径（Pandoc 原生）；PDF 双路径 xelatex / Chrome 打印，引擎缺失先出 Word 并提示 Word 另存 PDF
- 图片相对路径以工作目录为基准：转换前 cd 到源 md 目录或 --resource-path 声明；EMF 源图先转 PNG
- 模板探测链 template.docx → reference.docx → Pandoc 默认样式；目录生成 TOC 默认开启


---

## 🔍 SkillForge 使用指引（整体咨询时触发）

当用户询问 **SkillForge 本身**（不是单个技能用法）——「skillforge 怎么用 / 使用说明 / 使用指引 / 是什么」「技能怎么安装 / 怎么升级 / 装了哪些技能 / 技能清单」「skill-forge ls / init / update 等命令怎么用」「技能安装器 / 技能锻造坊」等（中英文、近似说法均可，关键词可自由扩展）：
1. Read 同目录 `resources/skillforge-guide.txt` 全文，按其内容整理回答（命令与参数以 txt 为准，勿自行编造）
2. 用系统命令打开同目录 `resources/skillforge-guide.html`（macOS `open`，Windows `start`），让用户在浏览器看排版版
3. 用户只问单个技能怎么用时（如「日报怎么用」）不触发本指引，走本技能的使用说明
