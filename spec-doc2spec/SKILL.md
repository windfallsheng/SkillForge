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

1. **依赖检测**（每次必做）→ `pandoc --version`；未安装按「安装指引」输出并停止，不执行任何转换命令
2. **格式路由** → `.docx` 走 Pandoc 机械转换；`.md` 直接 Read 原文（跳过第 3 步转换，第 4 步校对照做）；`.pdf` 走 `pdftotext` 文本提取（仅文本、无图无版式）或提示用户先转 Word
3. **Pandoc 机械转换** → `pandoc <输入.docx> -f docx -t gfm --extract-media=<IMG_DIR> -o 00-converted.md`（标题/表格/列表保留、图片提取到 IMG_DIR）；另生成 `pandoc <输入.docx> -t plain -o 00-plain.txt` 纯文本底稿供完整性核对
4. **AI 逐段校对（防错防漏，必做）** → 读 `resources/checklist.md`：对照源文档逐段核对完整性/表格/列表/图片/乱码/修订痕/页眉页脚噪音，发现错误直接在 00-converted.md 上修正
5. **图片处理** → 读 `resources/images.md`：校验图片引用路径、检测 EMF/WMF 并跨系统转 PNG、处理缺失图片
6. **AI 结构加工与落盘** → 读 `resources/structure.md`：提炼需求点与验收标准、按功能单元切分章节、生成澄清清单，按目录规范落盘
7. **报告** → 产出路径、功能单元清单、校对修正记录、待澄清需求点

## ⚙️ 默认配置（用户可手动修改；临时口头要求永远优先）

```yaml
OUTPUT_DIR: auto              # 输出目录：auto = 源文档同目录下新建 {文档名}-spec/ 子目录；也可写死绝对路径
IMG_DIR: assets/images        # 图片提取目录（相对输出目录）；Pandoc --extract-media 提取到此处
EMF_POLICY: convert           # EMF/WMF 图片策略：convert = 自动跨系统转 PNG（LibreOffice 兜底）；keep = 保留原样并在澄清清单注明不可渲染
CONFIRM: never                # 落盘前确认：never = 直接生成落盘；always = 先出加工预览确认后再落盘
```

> 临时口头要求（仅当次生效）：说「输出到 XX 目录」→ 当次改 OUTPUT_DIR；说「图片放 XX」→ 当次改 IMG_DIR；说「先看看效果」→ 当次先出预览确认再落盘。

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
