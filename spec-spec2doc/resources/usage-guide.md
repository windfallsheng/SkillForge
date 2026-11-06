# spec2doc 使用指南

## 能干什么

把 Markdown 规格 / 技术文档导出为 Word / PDF 交付文档：AI 先整理排版，Pandoc 机械转换，AI 回验纠错直到通过。Word 支持模板（默认探测源目录 template.docx，可配置）；PDF 双路径（LaTeX 或 Chrome 打印，免装 LaTeX 也有兜底）；输出默认与源文档同目录，可配置。

## 使用方式

1. 直接说「把这份规格导出成 Word」「生成 PDF 交付文档」并给出文件路径
2. 未装 Pandoc 时按引导安装（macOS brew / Windows winget / Linux apt-get）
3. AI 整理排版（标题层级/表格/图片路径），Pandoc 输出 .docx（主路径）或 .pdf（xelatex / Chrome 打印双路径）
4. AI 回验内容完整与格式正确（发现问题修正重转，≤3 轮）后交付

## 支持格式

- 输出 Word（.docx，主路径，支持模板与目录）
- 输出 PDF（.pdf，LaTeX 引擎或 Chrome 打印）

## 常用说法

- 「输出到桌面」→ 临时改输出目录
- 「用公司模板」+ 路径 → 指定 Word 模板
- 「不要目录」→ 去掉 TOC
- 「必须用 LaTeX 出 PDF」→ 强制 LaTeX 路径（无引擎则引导安装）

## 产出

与源文档同目录的 .docx / .pdf，附回验结论与兜底说明。

## 触发词

导出成 Word / 生成 PDF / 规格转文档 / 打包交付文档 / /spec2doc
