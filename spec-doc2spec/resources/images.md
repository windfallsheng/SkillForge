# 图片处理

## 提取与拍平

- Pandoc 转换命令带 `--extract-media=<IMG_DIR>`（默认 assets/images，相对输出目录；**必须在输出目录内执行 pandoc**，图片基准才正确）：图片默认提取到 `<IMG_DIR>/media/` 子目录，md 引用写作 `media/xxx`
- 转换后拍平：把 `<IMG_DIR>/media/*` 全部移到 `<IMG_DIR>/` 根目录，同步把 00-converted.md 中 `media/` 引用前缀改掉，删除空的 media/ 子目录——产物目录里图片直接可见，不留冗余层级
- 重名冲突时 AI 重命名（如 image1-2.png）并在 md 引用同步更新

## 引用校验

- Read 00-converted.md 收集全部 `![](...)` 引用，逐一核对 IMG_DIR 下对应文件存在
- 量化断言：`!\[` 引用数 == IMG_DIR 下图片文件数（见 checklist.md），不等则逐个排查丢图/多图

## 图片内容抽检

- Read 抽检关键图片：有图注的图、流程/架构/截图类图片至少各抽一张，确认图片内容与原文图注对应、无黑图/半截图/错位图；发现异常从源文档重新提取

## EMF/WMF 转换（浏览器不可渲染格式）

- 检查 IMG_DIR 下是否出现 .emf/.wmf 文件（Word 图形对象默认 EMF，很常见）：有则必须转 PNG，否则预览/后续加工全部不可见
- 转换链（跨系统，按序探测，成功即止）：
  1. LibreOffice：`soffice --headless --convert-to png --outdir <IMG_DIR> <file.emf>`（三系统通用，首选）
  2. macOS 备选：`qlmanage -t -s 1600 -o <IMG_DIR> <file.emf>`（部分 EMF 不支持）
  3. Windows 备选：ImageMagick `magick <file.emf> <file.png>`
- 转换成功后把 md 引用 .emf → .png 全部替换
- 全部工具缺失时：按 EMF_POLICY=keep 保留原文件，在 _clarify.md 注明「N 张 EMF 图无法渲染，建议在 Word 中另存为 PNG 后重新转换」

## 缺失与异常

- 引用存在但文件缺失：核对 --extract-media 是否执行、路径是否被移动；无法恢复的在 _clarify.md 记录「图片缺失：<原位置>」
- alt 文本：Pandoc 保留 Word 图片 alt 文本，AI 校对时确认关键图片 alt 与原文图注一致；无 alt 的关键图片按原文图注补写

## 目录组织

- 默认 IMG_DIR=assets/images（相对输出目录，可配置改绝对路径）
- 严禁图片散落在输出目录根：一律进 IMG_DIR
