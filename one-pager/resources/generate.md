# 生成 HTML（阶段 2）

## 用户模板内嵌（TPL_DIR 非空时，先于三处替换）

读 user-config.md 的 `TPL_DIR`（auto = 与海报库根目录平级的 `user-templates/`：DIR: auto 时 = 当前工作目录 `user-templates/`，DIR 为绝对路径时 = 其父目录下的 `user-templates/`；也可写绝对路径）。若目录存在且有 *.html 文件，按 `resources/user-template-example.html` 三段式约定逐份解析，内嵌进 reference.html 副本四处：

1. **TPL_CSS 块**（原样）：插到 CSS 内嵌点注释（`/* ▼ 用户模板 CSS 内嵌点`）**之前**
2. **TPL_FN 块**（原样）：插到 FN 内嵌点注释（`/* ▼ 用户模板渲染函数内嵌点`）**之后**
3. **模板坞**：在按钮内嵌点注释（`<!-- ▼ 用户模板按钮内嵌点`）**之后**插分组标 `<span class="tp-sep">我的模板</span>`（多份模板只插一次）+ 每份一个 `<button class="tp-btn" data-tpl="{name}" title="{label}">{label}</button>`
4. **TPLS 数组**：数组末尾（`'notice'` 之后）追加 `,'{name}'`

约束：name 必须唯一且不与官方 28 个（classic/minimal/swiss/window/magazine/editorial/typo/newspaper/dashboard/grid/timeline/hero/bauhaus/mondrian/memphis/exhibit/popart/opart/artnouveau/brutalist/acid/glitch/vaporwave/cyber/academic/recruit/invitation/notice）重名；缺区块/重名的文件跳过并在对话中提醒用户。TPL_DIR 不存在或无 html 文件则跳过本步。

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
