---
name: spec-doc2spec
description: >
  文档转需求规格 Skill（doc2spec）。仅在用户要求把 PRD / Word / Markdown 需求文档转成结构化需求文档
  （需求点提炼、功能单元切分）时使用。内置 Pandoc 检测：默认先探测 pandoc 是否安装，已装直接转换，
  未装引导用户按系统安装（macOS brew / Windows winget 或官网 / Linux apt-get 等）。
  支持 .docx（Pandoc 转换）/ .md（直接读取）；.pdf 需先转 Word 或提取文本。
  Word 机械转换后由 AI 加工为结构化需求文档。
  不处理一般性的文档内容讨论（如「帮我看看这份文档讲了什么」），只处理「文档 → 需求规格」的转换任务。
allowed-tools: ["Bash", "Read", "Write", "Edit"]
disable-model-invocation: false
---

# 文档 → 需求规格（doc2spec）

将产品需求文档（PRD）转换为结构化的 Markdown 需求文档：Word 版先经 Pandoc 机械转换，再由 AI 阅读加工——提炼需求点与验收标准、按功能单元切分章节、整理成可直接进入开发评审的规格文档。

## ① 前置依赖检测（每次执行前必做）

本技能依赖开源转换工具 **Pandoc**（Word 转 Markdown 的通用文档转换器，开源免费）。执行转换前，先探测安装状态：

```bash
pandoc --version
```

- **输出版本号**（如 `pandoc 3.x`）→ 已安装，进入「② 执行机制」
- **报错或退出码非 0**（`command not found` / `'pandoc' 不是内部或外部命令` / 无法识别 cmdlet 等）→ 未安装，按「③ 安装指引」引导用户，**不执行任何转换命令**

> 输入为纯 `.md` 文档时无需 Pandoc：直接 Read 原文，跳过转换进入 AI 加工。

## ② 执行机制

1. 确认输入文件路径与格式：
   - `.docx` → Pandoc 转 Markdown：`pandoc <输入.docx> -f docx -t gfm -o <输出.md>`（标题、表格、列表均保留）
   - `.md` → 直接 Read 原文
   - `.pdf` → Pandoc 不能直接读 PDF：提示用户先转成 Word（或提取文本）后再来，不硬转
2. 转换完成后 Read 产出 md，**AI 加工**为结构化需求文档：
   - 提炼需求点与验收标准，剔除 Word 排版噪音（页码、页眉页脚残留）
   - 按功能单元切分章节，保留原文关键表述，不臆造内容
   - 输出到用户指定目录（默认与源文档同目录，文件名由用户定或沿用原名）
3. 完成后向用户报告：产出路径、切分出的功能单元清单、疑似需要澄清的需求点

## ③ 安装指引（仅当检测未安装时输出给用户）

Pandoc 跨系统安装（开源免费，官网 https://pandoc.org/installing.html）：

1. **macOS**：`brew install pandoc`（未装 Homebrew 先装 brew，或从官网下载 .pkg 安装包双击安装）
2. **Windows**：`winget install --id JohnMacFarlane.Pandoc`（无 winget 时从官网下载 .msi 安装包双击安装，默认选项即可）
3. **Linux**：Debian/Ubuntu 系 `sudo apt-get install pandoc`；Fedora 系 `sudo dnf install pandoc`；Arch 系 `sudo pacman -S pandoc`
4. **验证**：`pandoc --version` 输出版本号即成功；Windows 若提示找不到命令，关闭并重新打开终端刷新 PATH

安装完成后，请用户重新说一次需求，再走「② 执行机制」。

## ④ 使用说明

用户仅询问使用方法（「spec-doc2spec 怎么用 / 使用说明 / 使用步骤 / 能干什么」）时不启动流程，输出以下纯文字指南，不执行任何转换命令：

本技能把 PRD / Word / Markdown 需求文档转成结构化 Markdown 需求文档（需求点提炼 + 功能单元切分）。执行前自动检测 Pandoc（开源 Word→Markdown 转换工具）：已安装直接转换，未安装给出 macOS / Windows / Linux 安装指引。

**使用步骤**：1. 直接说「把这份 PRD 转成需求文档」「Word 转需求切片」并给出文件路径；2. 未装 Pandoc 时按引导安装；3. Pandoc 完成 Word→Markdown 机械转换，AI 随后提炼需求点、按功能单元切分；4. 产出结构化需求文档到指定目录。

**支持格式**：.docx（Pandoc 转换）/ .md（直接读取）；.pdf 需先转 Word 或提取文本。

**触发词**：把 PRD 转成需求文档 / Word 转需求切片 / 文档转规格 / /doc2spec。
