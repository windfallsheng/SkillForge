# 图片与模板

## 图片路径

- Pandoc 解析 md 图片相对路径以**当前工作目录**为基准：转换前 cd 到源 md 所在目录，或用 `--resource-path=.:<额外图片目录>` 声明搜索路径
- 图片缺失时 Pandoc 报「[WARNING] Could not fetch resource」→ AI 核对路径后重转
- EMF/WMF 源图浏览器/Word 均不可靠：先跨系统转 PNG 再转 Word（转换链同 doc2spec 的 images.md：LibreOffice `soffice --headless --convert-to png` → macOS `qlmanage -t` → Windows `magick`）
- 转换后回验图片全部嵌入（`unzip -l <输出.docx> | grep media`）

## Word 模板（--reference-doc）

- 探测链（TEMPLATE_DOCX=auto）：<源目录>/template.docx → <源目录>/reference.docx → 无模板用 Pandoc 默认样式
- 生成默认模板供定制：`pandoc -o <template.docx> --print-default-data-file reference.docx`（用户可在 Word 中改样式后保存为 template.docx 放源目录，永久生效）
- 指定模板转换：`pandoc <输入.md> -f gfm -t docx -o <输出.docx> --reference-doc=<template.docx> [--toc --toc-depth=3]`
