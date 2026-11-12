# PDF 双路径

## 路径 A：LaTeX（排版质量高，需安装引擎）

- 引擎探测：`xelatex --version`（xelatex 原生支持 UTF-8 中文）
- 安装（跨系统）：macOS `brew install --cask basictex`（体积小，装完按需 `sudo tlmgr install ctex`）；Windows `winget install MiKTeX.MiKTeX`；Linux Debian/Ubuntu `sudo apt-get install texlive-xetex texlive-lang-chinese`
- CJK 字体：`pandoc <输入.md> -o <输出.pdf> --pdf-engine=xelatex -V CJKmainfont="<字体>"`
  - 字体探测：macOS `fc-list :lang=zh`（常见 Songti SC / PingFang SC）；Windows SimSun / Microsoft YaHei；Linux Noto Sans CJK SC
  - 未指定时列出可用字体让用户选；探测不到中文字体时放弃 LaTeX 路径走 Chrome 打印路径
- 转换：`pandoc <输入.md> -o <输出.pdf> --pdf-engine=xelatex -V CJKmainfont="<字体>" -V geometry:margin=2.5cm [--toc]`

## 路径 B：Chrome headless 打印（免 LaTeX，跨系统兜底）

- 流程：`pandoc <输入.md> -s --self-contained -o <输出.html>` → Chrome headless `--headless --print-to-pdf=<输出.pdf> --no-pdf-header-footer <输出.html>`（--no-pdf-header-footer 去掉默认页眉页脚；不支持的老版本 Chrome 用 --print-to-pdf-no-header）
- Chrome 路径探测（跨系统）：macOS `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`；Windows 按序探测 `C:\Program Files\Google\Chrome\Application\chrome.exe` → `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe` → `%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe`；Linux `google-chrome` / `chromium`；均无则换 Edge（路径同族探测）
- 版式：可加 `--css=<样式.css>` 定制打印版式（页边距、字体）
- 引擎决策：PDF_ENGINE=auto 时先探测 xelatex，无则走 Chrome 打印路径并在报告注明「PDF 由 HTML 打印生成」
- 中文豆腐块检测：`pdftotext <输出.pdf> - | grep -c '�'` 应为 0、中文字符量非 0（无中文字体的 Linux 先装 Noto Sans CJK；检测方法见 checklist.md）

## 引擎缺失兜底

- xelatex 与 Chrome 都缺失：先出 Word（主路径），提示用户用 Word「另存为 PDF」
