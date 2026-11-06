# doc2spec 使用指南

## 能干什么

把 PRD / Word / Markdown 需求文档转成结构化 Markdown 需求规格：Pandoc 机械转换 + AI 逐段校对（纠错补漏）+ 需求点提炼与功能单元切分。图片自动提取到 assets/images/（EMF 等不可渲染格式自动转 PNG）；输出默认「源文档同目录/{文档名}-spec/」子目录，输出与图片目录均可配置。

## 使用方式

1. 直接说「把这份 PRD 转成需求文档」「Word 转需求切片」并给出文件路径
2. 未装 Pandoc 时按引导安装（macOS brew / Windows winget / Linux apt-get）
3. Pandoc 完成 Word→Markdown 机械转换后，AI 对照原文逐段校对（完整性/表格/图片/乱码/修订痕），再提炼需求点、按功能单元切分
4. 产出结构化需求文档到指定目录

## 支持格式

- .docx（Pandoc 转换，图片自动提取）
- .md（直接读取）
- .pdf（pdftotext 文本提取，仅文本无图；需要图片建议先转 Word）

## 常用说法

- 「输出到桌面」→ 临时改输出目录
- 「图片放 figures/」→ 临时改图片目录
- 「先看看效果」→ 先出预览确认再落盘

## 产出

{文档名}-spec/ 目录：README 索引 + 需求规格（含功能单元切片）+ 图片目录 + 澄清清单（有疑点时）。

## 触发词

把 PRD 转成需求文档 / Word 转需求切片 / 文档转规格 / /doc2spec
