# 生成 HTML（阶段 2）

先 Read `resources/reference.html` 全文，以其为骨架模板，**只替换三处**，其余（CSS/JS/结构）一律不许动：

1. **`<meta name="poster-id">`**：换成新 UUID（crypto.randomUUID() 标准 v4，落盘前顺扫落盘目录下本技能命名的 html 读 id meta 查重，撞号重掷）
2. **`<title>`**：与海报标题一致
3. **`<script>` 内 DATA 对象**：只改 `tag`（角标徽章文案，默认 "ONE PAGER"）/ `title`（标题）/ `quote`（金句）/ `points` 数组（要点块 3-5 条逐条 `{ t: "..." }`）/ `footnote`（页脚注，可空字符串）/ `kpi`（dashboard 模板的环形指标值，如 "82%"）六字段，其余 JS 一律不动

样式参数解释与禁止项见 `resources/html-rules.md`。

## 落盘与截图

- 落盘组织一海报一目录：`<DIR>/<主题slug>/` 内三件套成组——`poster.html`（海报）+ `poster.md`（内容底稿：标题/金句/要点/页脚四要素纯文本，html 永远可从它重建——数据真相源）+ `poster.png`（SHOT 截图，与 html 同名）；DIR: auto = 当前工作目录 posters/（不存在则创建）
- 旧版平铺产物（posters/poster-<slug>.html 等）保持原位不迁移；回炉升级扫描时两种形态（子目录 poster.html + 平铺 poster-*.html）都扫
- OPEN_HTML: true 且落盘了 html 时自动打开浏览器（macOS：open <html文件>；Windows PowerShell：Start-Process <html文件>）
- SHOT: true 时用 Chrome headless 截 PNG：`--headless --disable-gpu --no-sandbox --hide-scrollbars --user-data-dir=<临时目录> --screenshot=<png路径> --window-size=<宽>,<高> --virtual-time-budget=4000 "file:///<html路径>?shot"`（Windows 用 node url.pathToFileURL 生成 URL）；按 ASPECT 定窗口（3:4 → 900,1200；1:1 → 1000,1000；16:9 → 1600,900）；禁止用 `--headless=new`；Chrome 不存在换 Edge，都无则跳过并对话注明
- **落盘完成后对话报告落盘位置**：完整路径清单（html + md + 可选 png），并注明 html 是否已在浏览器打开、截图是否跳过
