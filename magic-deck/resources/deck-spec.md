# magic-deck HTML 幻灯片完整规范

> ⛔ **Reference 铁律（最高优先）**：本目录 `reference.html` 是定稿骨架源码（默认 classic 模板 + 四主题 + 全部组件 + 播放引擎 + 单页主题）。生成 HTML 时必须先 Read `resources/reference.html` 与本文件两份，以 reference.html 为骨架逐处替换内容；两者冲突时**以 reference.html 为准**。修改本 skill 的 HTML 效果时，必须同步更新 `resources/reference.html` 与本文档的对应描述，禁止只改一处。

生成单文件 HTML 幻灯片（HTML 形态、PPT 体验），所有实现细节以本文为准。

## 0. 铁律

- **单文件零依赖**：禁用 CDN/@import/外链 CSS/JS/图片/网络字体，双击离线可打开；字体用系统栈 `ui-monospace,'SF Mono',SFMono-Regular,Menlo,Consolas,'Microsoft YaHei',monospace`
- **舞台 1280×720（16:9）**，按窗口等比缩放（--sc），窗口任意大小不变形
- **截图与复制只含主体**：截图克隆当前 slide、复制取 slide innerText，绝不包含工具栏/页码/箭头/提示等操作元素
- **全屏纯净**：`:root:fullscreen` 下所有操作元素与背景氛围层（.bg-glow/.bg-grid）全部隐藏、页面底色纯黑 `#000`，只留舞台主体（与 PPT 软件放映一致：幻灯按比例充满画面，比例不匹配处补黑边，绝无主题氛围边框/光斑/网格）
- 操作元素（toolbar/pageno/hint/nav/help-mask）全部 fixed 定位在舞台之外，永远不进 slide 内部

## 1. 骨架结构（body 顺序固定）

```html
<div class="bg-glow"></div>          <!-- 背景光斑（两个径向渐变 + 底色） -->
<div class="bg-grid"></div>          <!-- 网格纹理（72px 格，径向 mask 渐隐） -->
<div class="progress"><div class="fill" id="progFill"></div></div>  <!-- 顶部 3px 渐变进度 -->
<div class="toolbar">                <!-- 右上工具栏：主题组 + 播放组 + 工具组 -->
  <div class="group"><button class="tbtn theme" data-theme="tech|biz|mono|warm">…×4
    <button class="tbtn" id="btnScope" title="仅本页/全部">⭮ 仅本页</button></div>
  <div class="group"><button class="tbtn" id="btnPlay">▶ 自动播放</button>
    <select class="tbtn" id="selInterval">3s/5s/8s/10s</select>
    <label class="tbtn"><input type="checkbox" id="chkLoop">循环</label>
    <label class="tbtn"><input type="checkbox" id="chkFromStart" checked>从头</label></div>
  <div class="group"><button class="tbtn" id="btnCopy">⧉ 复制本页</button>
    <button class="tbtn" id="btnCopyMulti">▦ 选页复制</button>
    <button class="tbtn" id="btnShot">📷 截图本页</button>
    <button class="tbtn" id="btnShotMulti">▦ 选页截图</button>
    <button class="tbtn" id="btnFull">⛶ 全屏</button>
    <button class="tbtn help" id="btnHelp">?</button></div>
</div>
<div class="pageno" id="pageNo"><b>1</b> / N</div>
<div class="hint">← → 翻页 · 空格下一页 · P 播放 · S 截图 · C 复制 · F 全屏 · ? 操作说明</div>
<button class="nav prev" id="btnPrev">‹</button>
<button class="nav next" id="btnNext">›</button>
<main class="stage"><div class="deck" id="deck">
  <section class="slide cover active" data-title="封面">…</section>
  <section class="slide" data-title="目录">…</section>
  …（每页一个 section.slide，第一页带 active）
</div></main>
<div class="help-mask" id="helpMask">…说明弹层…</div>
<div class="help-mask" id="copyMask">…选页复制面板…</div>
<div class="help-mask" id="shotMask">…选页截图面板…</div>
<script>播放引擎（见 §6）</script>
```

## 2. 四主题 CSS 变量（完整色值，全部 8 变量齐备）

```css
:root, [data-theme="tech"]{ /* 深蓝科技（默认） */
  --bg:#0a1929; --bg2:#071525; --panel:rgba(11,30,55,.72); --panel-solid:#0b1e37;
  --text:#bae6fd; --muted:#5b7fa5; --accent:#0ea5e9; --accent2:#14b8a6;
  --border:rgba(14,165,233,.18); --glow:rgba(14,165,233,.35);
  --title-grad:linear-gradient(90deg,#7dd3fc,#0ea5e9 45%,#818cf8);
  --tag-bg:rgba(14,165,233,.12);
}
[data-theme="biz"]{ /* 浅色商务 */
  --bg:#f4f6fb; --bg2:#e9edf5; --panel:rgba(255,255,255,.85); --panel-solid:#ffffff;
  --text:#1e293b; --muted:#64748b; --accent:#2563eb; --accent2:#0891b2;
  --border:rgba(37,99,235,.14); --glow:rgba(37,99,235,.18);
  --title-grad:linear-gradient(90deg,#1e40af,#2563eb 55%,#0891b2);
  --tag-bg:rgba(37,99,235,.08);
}
[data-theme="mono"]{ /* 极简黑白 */
  --bg:#fafafa; --bg2:#f0f0f0; --panel:rgba(255,255,255,.9); --panel-solid:#ffffff;
  --text:#16181d; --muted:#6b7280; --accent:#111111; --accent2:#4b5563;
  --border:rgba(17,17,17,.14); --glow:rgba(17,17,17,.08);
  --title-grad:linear-gradient(90deg,#111,#333 60%,#666);
  --tag-bg:rgba(17,17,17,.06);
}
[data-theme="warm"]{ /* 温暖渐变 */
  --bg:#fdf3e7; --bg2:#f7e7d3; --panel:rgba(255,250,243,.85); --panel-solid:#fffaf3;
  --text:#43301f; --muted:#8a7565; --accent:#d97706; --accent2:#ea580c;
  --border:rgba(217,119,6,.18); --glow:rgba(217,119,6,.22);
  --title-grad:linear-gradient(90deg,#b45309,#d97706 50%,#ea580c);
  --tag-bg:rgba(217,119,6,.1);
}
```
主题切换（全局）：`document.documentElement.setAttribute('data-theme', name)`，工具栏色点与色板卡同步 .on/.active-theme。

### 2.1 单页主题（整份或单页自由换肤）

- 主题色点点击默认改全局；工具栏主题组旁有「仅本页」toggle 按钮（#btnScope，⭮ 图标，.on 高亮）：开启后色点点击只改当前页 `slides[cur].setAttribute('data-theme', name)`；再点一次恢复全局，且全局切换时 JS 遍历 slides 移除所有 slide 级 data-theme
- CSS 变量就近解析天然支持：`[data-theme="xxx"]` 属性选择器写在 slide 上即覆盖该页全部 var()；`.slide` 必须自带背景 `background:var(--bg)`（页背景跟随主题，全局 .bg-glow/.bg-grid 作为舞台外围氛围层）
- 单页主题的 slide 上保留 data-theme 属性持久生效；截图（§7）克隆 slide 时该属性自然入图，无需特殊处理
- 生成时按 user-config 的 THEME 给 documentElement 设默认主题，单页差异化主题由用户放映时点选

## 2.2 模板库（五套版式骨架，与主题正交：模板管版式结构、主题管配色）

生成时按 user-config 的 `TEMPLATE` 选一套版式骨架；用户口头点名模板名（如「用杂志风模板」）当次生效不改配置。五套模板共用 §4 全部组件与 CSS 变量，只换结构：

### T1 classic 经典商务（默认，现骨架不动）
- 封面：logo 块 76px + 64px 大标题 + sub + 底部署名
- 内容页：`.s-head` 左色条标题 + `.grid2/.grid3` 卡片栅格；数据页：`.bignum` 大数字卡栅格；目录：`.toc` 条目列表

### T2 minimal 极简留白
- 骨架：`<div class="t-minimal">` 包整页内容；封面：无 logo 块，76px 大标题居中 + 细线分隔 + sub + 署名右上角
- 内容页：标题 44px 居中无色条 + 要点列表 `.points`（每条 28px/1.9 行距，窄栏 640px 居中）；禁止 .card 描边与 .panel 面板，只用文字与留白
- 数据页：`.bignum` 大数字 88px 居中 + 标签
- CSS：`.t-minimal .s-title{font-size:44px;text-align:center}`；`.t-minimal .points{margin:0 auto;max-width:640px}`；`.t-minimal .points li{padding:12px 0;border-bottom:1px solid var(--border)}`；`.t-minimal .bignum b{font-size:88px}`

### T3 magazine 杂志画册
- 骨架：`<div class="t-magazine">`；封面：超大标题 96px 跨版左对齐 + 右上 .tag 期号 + 底部双栏署名行
- 内容页：左右分栏 `.m-split`（grid 46% 54%）：左文（标题 36px + 段落）+ 右图位 `.m-figure`（高 380px 圆角 18 渐变块 var(--accent) 系 + 内嵌 .chip 标注）
- 数据页：横向大数字带 `.m-strip`（flex 三项，每项 64px 数字 + 标签，项间 1px var(--border) 分隔）
- CSS：`.t-magazine .s-title{font-size:96px;line-height:1.05}`；`.m-split{display:grid;grid-template-columns:46% 54%;gap:56px;align-items:center}`；`.m-figure{height:380px;border-radius:18px;background:linear-gradient(135deg,var(--accent),var(--accent2));opacity:.85}`；`.m-strip{display:flex;justify-content:space-between}`；`.m-strip>div{flex:1;text-align:center;border-left:1px solid var(--border)}`

### T4 keynote 黑金发布
- 骨架：`<div class="t-keynote">`；封面：巨号 112px 标题居中 + 副题 24px + 底部小字日期署名
- 内容页：每页只放一个核心观点——`.k-big` 64px 加粗大字居中 + `.k-sub` 22px muted 一句解释 + 底部细进度横线；禁止栅格卡片堆料
- 数据页：单个 `.bignum` 160px 巨型数字居中 + 标签 + 环形进度装饰 `.k-ring`（conic-gradient 圆环 120px，数字在环内）
- CSS：`.t-keynote .s-title{font-size:112px}`；`.k-big{font-size:64px;font-weight:900;text-align:center;margin:auto}`；`.k-sub{font-size:22px;color:var(--muted);text-align:center}`；`.k-ring{width:120px;height:120px;border-radius:50%;background:conic-gradient(var(--accent) 0 72%,var(--border) 72% 100%);display:flex;align-items:center;justify-content:center}`

### T5 timeline 时间线叙事
- 骨架：`<div class="t-timeline">`；封面/结束页同 classic
- 内容页：纵向时间线 `.tl`（左侧 3px var(--accent) 竖线 + 节点圆点 14px + 每条 .tl-item 卡片：时间 .tl-time 24px 加粗 + 标题 + 描述）
- 数据页：时间线节点上挂 .bignum 小数字
- CSS：`.tl{position:relative;padding-left:32px}`；`.tl::before{content:'';position:absolute;left:6px;top:8px;bottom:8px;width:3px;background:var(--accent)}`；`.tl-item{position:relative;padding:18px 0 18px 24px}`；`.tl-item::before{content:'';position:absolute;left:-32px;top:24px;width:14px;height:14px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px var(--tag-bg)}`

模板选择仅在生成时定版式（user-config TEMPLATE 或口头点名），工具栏不提供运行时模板切换；运行时切换的是主题（全局/单页）。

## 3. 舞台与切换

```css
.stage{ position:fixed; inset:0; z-index:1; display:flex; align-items:center; justify-content:center; }
.deck{ position:relative; width:1280px; height:720px; transform:scale(var(--sc,1)); transform-origin:center center; flex:0 0 auto; }
.slide{ position:absolute; inset:0; padding:64px 80px; background:var(--bg); display:flex; flex-direction:column;
  opacity:0; visibility:hidden; transform:translateX(36px);
  transition:opacity .45s ease, transform .45s ease, visibility 0s linear .45s; }
.slide.active{ opacity:1; visibility:visible; transform:translateX(0); transition:opacity .45s ease, transform .45s ease; }
.slide.dim{ opacity:0; transform:translateX(-36px); }
```
缩放：`fit()` 里 `--sc = min(innerWidth/1280, innerHeight/720)`，resize 监听重算。

## 4. 版式组件（全部主题变量驱动，不写死颜色）

- `.s-title`：40px/900 渐变文字（background-clip:text + color:transparent + text-shadow var(--glow)）
- `.s-head`：左色条（6×34px 渐变 + 发光）+ 标题 + 右上 `.tag` 胶囊；页标题一般 32px
- `.panel`：主题面板（--panel 底 + 细边 + 圆角 14 + backdrop blur）
- `.grid2/.grid3/.grid4`：栅格布局（22/22/18px gap）
- `.card`：内容卡（圆角 12，hover 上浮 + 发光）；`.card h4 .en` 英文小标签
- `.bignum`：大数字卡（52px 渐变数字 + 标签）
- `.toc`：目录条目（data-goto 跳页、序号块、页码），hover 右移
- `.checklist`：对勾清单（::before ✓ 渐变方块）
- `.theme-card`：主题色板卡（swatches 色块 + 名称 + 描述，点击切主题）
- `.cover`：封面（logo 块 76px + 64px 大标题 + sub + 底部署名，含 SIGNATURE）
- `.endpage`：结束页（56px 标题 + 致谢）
- `.chip`：内容小标签；`.chip.new` 加 chipPulse 呼吸

## 5. 操作元素（固定样式，禁止改动定位语义）

- `.toolbar`：right:18px top:14px，`display:flex + align-items:center + gap:10px`（各组垂直居中、组间留白）
- `.group`：胶囊组（圆角 999），`display:flex + align-items:center + gap:8px + padding:4px 6px`
- `.tbtn`：`display:inline-flex + align-items:center + justify-content:center + gap:6px + padding:7px 12px + line-height:1`（button/select/label 三种控件统一 flex 垂直居中，图标与文字 6px 间距、文字不贴边）；`.tbtn.on` 高亮；`.tbtn.theme` 16px 圆形色点，.on 加 outline
- `select.tbtn`：与按钮同高同 padding，文字垂直居中；`label.tbtn`：cursor:pointer，内 `input[type=checkbox]` 14×14 + margin:0 + flex:0 0 auto（复选框与文字 gap 6px 垂直居中，不与文字贴靠）
- 禁止「文字直接贴控件边缘/控件内文字上下偏斜」的写法：一律走 flex + gap 规则
- `.pageno`：left:18px bottom:16px 胶囊页码
- `.nav`：左右 46px 圆钮，**默认 opacity:0 不常驻**；`body:hover .nav{ opacity:1 }` 鼠标在页面内才显现；`@media (hover:none){ .nav{ opacity:1 } }` 触屏保持可见；hover 时边框/文字变 accent 加发光
- `.hint`：底部居中 11px 键位提示
- `.help-mask`：全屏遮罩（open 类显示）；`.help-panel` 内 kbd 键帽表格列全部热键 + `.help-note` 说明截图/复制只含主体、全屏自动隐藏操作元素、?shot 全量截图用法
- `#copyMask`：选页复制面板；`#shotMask`：选页截图面板——两面板结构同款，均复用 help-mask 遮罩类（全屏自动隐藏）；`.copy-panel` 430px 宽纵向 flex（头部标题+全选 / 中部 `.cp-list` 页清单滚动区 / 底部取消+执行 / 末尾 .help-note 小字提示）；`.cp-item` 行 = checkbox + 页码（accent 加粗）+ 首行预览（muted 单行省略），hover 用 --tag-bg；`.cp-foot .tbtn.primary` 主按钮 accent 底；勾选项截图面板用 `.sp-check`、复制面板用 `.cp-check`，各面板容器内自查询互不干扰

## 6. 播放引擎 JS（核心，逐条照做）

```js
var cur = 0, timer = null, playing = false;
function go(i){
  cur = Math.max(0, Math.min(N - 1, i));
  slides.forEach(function(s, k){
    s.classList.toggle('active', k === cur);
    s.classList.toggle('dim', k !== cur);
  });
  progFill.style.width = ((cur + 1) / N * 100) + '%';
  pageNo.innerHTML = '<b>' + (cur + 1) + '</b> / ' + N;
  if (location.hash !== '#/' + (cur + 1)) history.replaceState(null, '', '#/' + (cur + 1));
}
function next(){ if (cur < N - 1) go(cur + 1); else if (chkLoop.checked) go(0); }
function prev(){ if (cur > 0) go(cur - 1); else if (chkLoop.checked) go(N - 1); }
```
- **自动播放**：startPlay 里 `var sec = parseInt(selInterval.value, 10); if (!isFinite(sec) || sec < 1) sec = 5;` 兜底（防 NaN 连翻）；到末页未勾循环则 stopPlay；播放时按钮变「⏸ 暂停」加 .on
- **键盘**：`document.addEventListener('keydown', …)`，先 `if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;`（防在控件内误触），再 `if (e.repeat) return;`（长按只响应首次）
- **热键表**：
  - ←/→/↑/↓/PageUp/PageDown：上/下一页；Space：下一页（均 preventDefault）
  - Home/End：首页/末页；1-9：数字直达对应页（`/^[1-9]$/.test(e.key)`）
  - P：播放/暂停；S：截图本页；C：复制本页；F：全屏；?：说明弹层；Esc：关弹层 + 退全屏
- **全屏**：`toggleFull()` = fullscreenElement 存在则 exitFullscreen，否则 document.documentElement.requestFullscreen
- **主题作用域**：btnScope 未 .on 时主题点击 → `documentElement.setAttribute('data-theme', name)` + 遍历 slides 移除所有 slide 级 data-theme；btnScope .on 时 → `slides[cur].setAttribute('data-theme', name)`（仅当前页变色）；`?theme=biz` 参数走全局；工具栏色点 .on 态按全局主题显示
- **页内连接**：deck 上事件委托，`closest('[data-goto]')` 跳页；目录条目/任意元素都可用
- **外部链接**：任意 `<a href="https://…">` 正常打开，不拦截
- **hash 定位**：`#/N` 定位第 N 页，hashchange 监听；**初始跳页用 jumped 标记**——`var jumped = false; if (sm){ go(parseInt(sm[1],10)-1); jumped = true; } … 最后 if (!jumped) go(0);`（init 末尾无条件 go(0) 会覆盖 ?shot 跳页，必须跳过）
- **?shot 参数**：`?shot=N` 定位第 N 页（配合 Chrome headless 逐页截图）；`?shot=all` 不跳页（外部逐页访问 ?shot=N 抓全量）；`?theme=biz` 切主题（只认 tech/biz/mono/warm）

## 7. 截图与复制（只含主体，是硬性要求）

- **复制**：`btnCopy` 取 `slides[cur].innerText`，压缩连续空行为单行、trim；clipboard.writeText 主路径 + textarea/execCommand 兜底；成功按钮变「✓ 已复制」1.5s
- **选页复制**：`btnCopyMulti` 打开 `#copyMask` 面板——`openCopyPanel` 按页生成 `.cp-item` 清单（checkbox 默认全选 + 页码 + 首行文字预览 escapeHtml）；`cpAll` 全选/清空联动、勾选变化实时更新按钮计数「复制所选（N 页）」；`copySelectedPages` 收集选中页各自 innerText 压缩 trim，按「【第 N 页】」分隔 join '\n\n' 后走 fallbackCopy；默认全选时一次点击=复制全部页文字；Esc/点遮罩/取消关闭；文字通道不含图片（图片走截图）
- **截图（零依赖 SVG foreignObject → Canvas → PNG 2x，本页/选页共用 `renderShot(i, cb)`）**：
  1. `clone = slides[i].cloneNode(true)`，移除 dim 类，inline 重设 position/inset/padding/display/opacity/visibility/transform/transition 为终态
  2. 收集页面全部 `<style>` 文本拼进克隆 wrap 的 style；wrap 设 `data-theme` 全局主题兜底 + `width:1280px;height:720px;background:var(--bg)`（slide 级 data-theme 随克隆自然携带，单页主题页无需处理）
  3. `svg(1280×720 viewBox) + foreignObject(1280×720)` 装 wrap，`new XMLSerializer().serializeToString(svg)` → `data:image/svg+xml;charset=utf-8,` + encodeURIComponent 赋给 `new Image()`
  4. onload 里 `canvas 2560×1440`（2 倍清晰度）drawImage 后 `a.download = 'slide-页码-主题.png'` 点击下载并 `cb()` 接力；onerror 走 `cb(err)` 同样接力不断链；单页成功按钮变「✓ 已保存」1.5s；onerror 变「✗ 失败」
  - **克隆只取 slide 本体**——工具栏/页码/箭头/提示在 slide 之外，天然不入图；slide 内也不得放任何操作元素
- **选页截图**：`btnShotMulti` 打开 `#shotMask` 面板——`openShotPanel` 按页生成清单（checkbox 默认全选 + 页码 + 首行文字预览）；`spAll` 全选/清空联动、勾选变化实时更新主按钮「截图所选（N 页）」；`shotSelectedPages` 收集选中页**串行**逐张 `renderShot(idx[k], step)`（上一张 onload 后才起下一张，避免并发下载乱序与浏览器吞下载），进度文案「已保存 k/N 页…」，全部完成按钮变「✓ 已保存 N 页」1.5s 并自动关面板；面板底部 .help-note 注明浏览器首次会询问「下载多个文件」许可；与选页复制面板互斥打开；Esc/点遮罩/取消关闭

## 8. 全屏放映纯净模式（PPT 放映规范：黑底 + 幻灯充满画面）

```css
/* 左右箭头不常驻：鼠标在页面内时才显现，放映画面保持干净 */
.nav{ … opacity:0; }
body:hover .nav{ opacity:1; }
@media (hover:none){ .nav{ opacity:1; } } /* 触屏无 hover，箭头保持可见 */

/* 全屏放映模式：与 PPT 软件放映一致——黑底、幻灯按比例充满画面、比例不匹配处补黑边 */
:root:fullscreen{ background:#000; }
:root:fullscreen .bg-glow,
:root:fullscreen .bg-grid{ display:none !important; } /* 氛围层只在窗口浏览态，放映时退场 */
:root:fullscreen .toolbar,
:root:fullscreen .pageno,
:root:fullscreen .hint,
:root:fullscreen .nav,
:root:fullscreen .help-mask{ display:none !important; }
```
- **黑底规则**：全屏放映背景纯黑 `#000`，.bg-glow/.bg-grid 氛围层全屏下退场——幻灯自身 `background:var(--bg)` 保持主题配色（浅色主题=白页浮在黑底上、深色主题=深蓝页与黑底自然衔接），画面四周除比例补黑外无任何边框/光斑/网格，与 PowerPoint/Keynote/WPS 放映行为一致
- 全屏下热键照常（键盘监听在 document 上，按钮隐藏不影响 S/P/C/F/Esc）
- 说明弹层打开时进全屏也一并隐藏（!important 覆盖 .open 的 display:flex）
- 退出全屏自动恢复（规则随 :fullscreen 伪类失效）

## 9. 背景装饰

- `.bg-glow`：fixed 全屏，两个 radial-gradient 光斑（顶部 60%/50% + 右下 40%/35%，var(--glow)）+ var(--bg) 底色
- `.bg-grid`：fixed 全屏 72px 网格线（var(--border) 1px 纵横双向），radial mask 由中心向四周渐隐（mask-image + -webkit-mask-image 双写）

## 10. 页数与版式建议

- 推荐结构：封面 → 目录 → 内容页×N → 结束页；单页信息密度适中（每页 ≤5 要点）
- 目录条目 `.toc-item` 带 `data-goto="页序号-1"`（第 3 页写 2）
- 数据类内容优先 .bignum 大数字卡 / .grid 栅格；流程类优先 .checklist；叙事类用 .panel 段落
- 结束页/封面署名用 user-config 的 SIGNATURE

## 11. 落盘与命名（生成侧规则，与 HTML 骨架无关）

- 落盘目录取 user-config 的 DIR；目录不存在则创建，已存在则复用——**不清空、不改动目录内既有文件**
- 文件名三级优先：①用户口头指定 → 用指定名；②未指定且 FILENAME=auto → 按本次内容主题+用途总结中文名（格式 `{主题}-{用途}`，如「智能探针系统-产品介绍」，只用中英文数字与连字符）；③FILENAME 写死固定名 → 用固定名
- 重名一律自动加日期后缀（如 -20261109），绝不覆盖既有文件
- 生成后按 user-config 的 OPEN_HTML 自动打开浏览器放映
