# 图片处理

## 提取

- Pandoc 转换命令带 `--extract-media=<IMG_DIR>`（默认 assets/images，相对输出目录）：文档内嵌图片自动提取到该目录，md 引用改写为相对路径
- 转换后 Read 00-converted.md 收集全部 `![](...)` 引用，逐一核对 IMG_DIR 下对应文件存在；引用路径以 00-converted.md 所在目录为基准解析

## EMF/WMF 转换（浏览器不可渲染格式）

- 检查 IMG_DIR 下是否出现 .emf/.wmf 文件（Word 图形对象默认 EMF，很常见）：有则必须转 PNG，否则预览/截图/后续加工全部不可见
- 转换链（跨系统，按序探测，成功即止）：
  1. LibreOffice：`soffice --headless --convert-to png --outdir <IMG_DIR> <file.emf>`（三系统通用，首选）
  2. macOS 备选：`qlmanage -t -s 1600 -o <IMG_DIR> <file.emf>`（部分 EMF 不支持）
  3. Windows 备选：ImageMagick `magick <file.emf> <file.png>`
- 转换成功后把 md 引用 .emf → .png 全部替换
- 全部工具缺失时：按 EMF_POLICY=keep 保留原文件，在 _clarify.md 注明「N 张 EMF 图无法渲染，建议在 Word 中另存为 PNG 后重新转换」

## 缺失与异常

- 引用存在但文件缺失：核对 --extract-media 是否执行、路径是否被移动；无法恢复的在 _clarify.md 记录「图片缺失：<原位置>」
- alt 文本：Pandoc 保留 Word 图片 alt 文本，AI 校对时确认关键图片 alt 与原文图注一致；无 alt 的关键图片按原文图注补写
- 图片命名：默认沿用 Pandoc 提取名（image1.png 等）；重名冲突时 AI 重命名并在 md 引用同步更新

## 目录组织

- 默认 IMG_DIR=assets/images（相对输出目录，可配置改绝对路径）
- 严禁图片散落在输出目录根：一律进 IMG_DIR
