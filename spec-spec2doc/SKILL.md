---
name: spec-spec2doc
description: >
  规格转交付文档 Skill（spec2doc）。仅在用户要求把 Markdown 规格 / 技术文档导出为 Word / PDF 交付文档时使用。
  Pandoc 负责机械转换，AI 负责转换前排版整理与转换后回验防错（Pandoc 对复杂表格、图片路径、中文字体有局限，
  回验发现问题修正源稿重新转换直到通过，机械产物不直接交付）。主路径 Markdown → Word（支持 --reference-doc
  模板：默认依次探测源目录 template.docx / reference.docx，可配置 TEMPLATE_DOCX）。
  Markdown → PDF 双路径：xelatex（需 LaTeX 引擎与 CJK 中文字体）或 Chrome headless 打印（免 LaTeX、跨系统兜底），
  引擎可配置 PDF_ENGINE。输出目录默认与源文档同目录，可配置 OUTPUT_DIR。
  跨系统适配 macOS / Windows / Linux（Pandoc/LaTeX 安装、中文字体探测、Chrome 路径探测）。
  不处理一般性的文档格式转换（如「把这个 txt 转成 Word」），只处理「规格 → 交付文档」的转换任务。
allowed-tools: ["Bash", "Read", "Write", "Edit"]
disable-model-invocation: false
---

# 规格 → 交付文档（spec2doc）

将 Markdown 规格 / 技术文档转换为 Word / PDF 交付文档。分工原则：**Pandoc 负责机械转换，AI 负责排版整理与回验防错**——AI 转换前整理标题层级/表格/图片路径，转换后核对产出文档内容完整与格式正确，发现问题修正源稿重新转换，直到回验通过（机械产物不直接交付）。

## 生成流程

1. **依赖检测**（每次必做）→ `pandoc --version`；未安装按「安装指引」输出并停止。目标为 PDF 时另探测引擎：`xelatex --version`（LaTeX 路径）→ Chrome 路径（打印路径），细节读 `resources/pdf-path.md`
2. **AI 排版整理** → 统一标题层级、规整表格（超宽表拆表或改列表）、检查图片引用路径、确定元信息（标题/作者）
3. **Pandoc 输出** → Word：`pandoc <输入.md> -f gfm -t docx -o <输出.docx> [--reference-doc=<模板>] [--toc --toc-depth=3]`（模板探测与图片路径读 `resources/images-and-template.md`）；PDF：双路径命令读 `resources/pdf-path.md`
4. **AI 回验（防错防漏，必做）** → 读 `resources/checklist.md`：反向转换比对内容完整性、图片嵌入核对、标题层级、中文显示、乱码排查
5. **修正重转** → 发现问题修正源稿重新转换，再次回验；重转不超过 3 轮，仍不通过如实报告「哪些项无法修复 + 原因」，不交付带错文档
6. **报告** → 输出路径与格式、回验结论、PDF 引擎与兜底说明

## ⚙️ 默认配置（用户可手动修改；临时口头要求永远优先）

```yaml
OUTPUT_DIR: auto              # 输出目录：auto = 与源 md 同目录；可写死绝对路径
TEMPLATE_DOCX: auto           # Word 模板：auto = 依次探测 <源目录>/template.docx → reference.docx → 无则 Pandoc 默认样式；可指定模板路径
TOC: true                     # Word/PDF 是否生成目录（--toc --toc-depth=3）
PDF_ENGINE: auto              # PDF 引擎：auto = 探测 xelatex（有则 LaTeX 路径）→ 无则 Chrome 打印路径
```

> 临时口头要求（仅当次生效）：说「输出到 XX」→ 当次改 OUTPUT_DIR；说「用这个模板」+ 路径 → 当次换模板；说「不要目录」→ 当次 TOC=false；说「必须用 LaTeX 出 PDF」→ 当次 PDF_ENGINE=xelatex（无引擎则引导安装）。

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
