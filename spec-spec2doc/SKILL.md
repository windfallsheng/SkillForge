---
name: spec-spec2doc
description: >
  规格转交付文档 Skill（spec2doc）。仅在用户要求把 Markdown 规格 / 技术文档导出为 Word / PDF 交付文档时使用。
  内置 Pandoc 检测：默认先探测 pandoc 是否安装，已装直接转换，未装引导用户按系统安装
  （macOS brew / Windows winget 或官网 / Linux apt-get 等）。
  主路径 Markdown → Word（Pandoc 原生支持）；Markdown → PDF 需 LaTeX 引擎（basictex / MiKTeX / texlive），
  未装 LaTeX 时先出 Word 并提示用 Word 另存 PDF。转换前由 AI 整理排版，转换后由 AI 回验内容完整性与格式正确性（纠错补漏）。
  不处理一般性的文档格式转换（如「把这个 txt 转成 Word」），只处理「规格 → 交付文档」的转换任务。
allowed-tools: ["Bash", "Read", "Write", "Edit"]
disable-model-invocation: false
---

# 规格 → 交付文档（spec2doc）

将 Markdown 规格 / 技术文档转换为 Word / PDF 交付文档：AI 先整理排版（标题层级、表格、图片引用），再由 Pandoc 输出成品文档。

## ① 前置依赖检测（每次执行前必做）

本技能依赖开源转换工具 **Pandoc**（Markdown 转 Word/PDF 的通用文档转换器，开源免费）。执行转换前，先探测安装状态：

```bash
pandoc --version
```

- **输出版本号**（如 `pandoc 3.x`）→ 已安装，进入「② 执行机制」
- **报错或退出码非 0**（`command not found` / `'pandoc' 不是内部或外部命令` / 无法识别 cmdlet 等）→ 未安装，按「③ 安装指引」引导用户，**不执行任何转换命令**

## ② 执行机制

1. 确认输入（Markdown 规格文档路径）与目标格式：
   - **Markdown → Word**（主路径，Pandoc 原生支持）：`pandoc <输入.md> -f gfm -t docx -o <输出.docx>`
   - **Markdown → PDF**：需 LaTeX 引擎，`pandoc <输入.md> -o <输出.pdf> --pdf-engine=xelatex`；未装 LaTeX 时先出 Word，并提示用户可用 Word「另存为 PDF」（不强行要求装 LaTeX）
2. 转换前 AI 先整理排版：统一标题层级、规整表格、处理图片引用路径，保证产出文档可直接交付
3. Pandoc 输出后 **AI 回验（防错防漏，必做）**：核对产出文档内容完整（无章节/段落/表格遗漏）、标题层级与表格正确、无乱码与格式错乱；发现问题修正源 md 后重新转换，直到回验通过
4. 完成后向用户报告：输出路径与格式、回验结论；若 PDF 走了 Word 兜底则注明

## ③ 安装指引（仅当检测未安装时输出给用户）

Pandoc 跨系统安装（开源免费，官网 https://pandoc.org/installing.html）：

1. **macOS**：`brew install pandoc`（未装 Homebrew 先装 brew，或从官网下载 .pkg 安装包双击安装）
2. **Windows**：`winget install --id JohnMacFarlane.Pandoc`（无 winget 时从官网下载 .msi 安装包双击安装，默认选项即可）
3. **Linux**：Debian/Ubuntu 系 `sudo apt-get install pandoc`；Fedora 系 `sudo dnf install pandoc`；Arch 系 `sudo pacman -S pandoc`
4. **验证**：`pandoc --version` 输出版本号即成功；Windows 若提示找不到命令，关闭并重新打开终端刷新 PATH

安装完成后，请用户重新说一次需求，再走「② 执行机制」。

## ④ 使用说明

用户仅询问使用方法（「spec-spec2doc 怎么用 / 使用说明 / 使用步骤 / 能干什么」）时不启动流程，输出以下纯文字指南，不执行任何转换命令：

本技能把 Markdown 规格 / 技术文档导出为 Word / PDF 交付文档（AI 排版 + Pandoc 转换）。执行前自动检测 Pandoc：已安装直接转换，未安装给出 macOS / Windows / Linux 安装指引。

**使用步骤**：1. 直接说「把这份规格导出成 Word」「生成 PDF 交付文档」并给出文件路径；2. 未装 Pandoc 时按引导安装；3. AI 整理排版，Pandoc 输出 .docx（主路径）或 .pdf（需 LaTeX 引擎）；4. AI 回验内容完整与格式正确后交付 Word / PDF 文档。

**支持格式**：输出 Word（.docx，主路径）/ PDF（.pdf，需 LaTeX 引擎）。

**触发词**：导出成 Word / 生成 PDF / 规格转文档 / 打包交付文档 / /spec2doc。
