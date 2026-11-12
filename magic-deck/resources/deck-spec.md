# magic-deck HTML 幻灯片完整规范

> ⛔ **Reference 铁律（最高优先）**：本目录 `reference.html` 是定稿骨架源码（默认 classic 模板 + 十七套版式模板 + 十七主题 + 全部组件 + 播放引擎 + 单页主题 + 模板预览/撤销重做/右侧边栏双 Tab（页面管理 + 动画工具））。生成 HTML 时必须先 Read `resources/reference.html` 与本文件两份，以 reference.html 为骨架逐处替换内容；两者冲突时**以 reference.html 为准**。修改本 skill 的 HTML 效果时，必须同步更新 `resources/reference.html` 与本文档的对应描述，禁止只改一处。

生成单文件 HTML 幻灯片（HTML 形态、PPT 体验），所有实现细节以本文为准。

## 0. 铁律

- **单文件零依赖**：禁用 CDN/@import/外链 CSS/JS/图片/网络字体，双击离线可打开；字体用系统栈 `ui-monospace,'SF Mono',SFMono-Regular,Menlo,Consolas,'Microsoft YaHei',monospace`
- **舞台 1280×720（16:9）**，按窗口等比缩放（--sc），窗口任意大小不变形
- **截图与复制只含主体**：截图克隆当前 slide、复制取 slide innerText，绝不包含工具栏/页码/箭头/提示等操作元素
- **全屏纯净**：`:root:fullscreen` 下所有操作元素与背景氛围层（.bg-glow/.bg-grid）全部隐藏、页面底色纯黑 `#000`，只留舞台主体（与 PPT 软件放映一致：幻灯按比例充满画面，比例不匹配处补黑边，绝无主题氛围边框/光斑/网格）
- **模板运行时切换**：模板（版式）与主题（配色）正交；模板经「🎨 模板」面板随时切换（全部页面/仅本页/勾选页），支持「预览本页」先看效果再应用，标题自动映射到模板固定位置，切回经典商务恢复原排版、内容一条不丢
- **编辑能力**：撤销/重做（Ctrl+Z / Ctrl+Shift+Z，工具栏 ↶↷ 按钮）、右侧边栏（G 键或「▤ 页导航」，双 Tab：▤ 页面管理——缩略图浏览/点击跳转、悬停操作条复页/上移/下移/删页、头部「＋ 新页」16 版式任选插页；⚙ 工具——动画库与复制截图）——全部编辑操作可回退、只作用于内存，不修改 HTML 源文件
- 操作元素（toolbar/pageno/hint/nav/help-mask）全部 fixed 定位在舞台之外，永远不进 slide 内部
- **动画运行时切换**：动画库收纳在右侧边栏「⚙ 工具」Tab——翻页动画八套（deck 根标签 `data-transition`：slide-lr / fade / slide-ud / zoom / flip / cube / wipe / dissolve）、元素入场动画十二式（`data-anim` + 8 级 `data-anim-delay` 错落）、离场动画十二式（`data-anim-leave`，翻页前元素先离场 0.45s 再切页）、强调动画八式（`data-anim-emphasis` 循环）、标题文字动画四式（none/char/word/line，默认 none）；应用范围可选全部页面/仅本页，即点即换、localStorage 记忆；`prefers-reduced-motion` 下全部动画退化为直切，禁用动效

## 1. 骨架结构（body 顺序固定）

```html
<div class="bg-glow"></div>          <!-- 背景光斑（两个径向渐变 + 底色） -->
<div class="bg-grid"></div>          <!-- 网格纹理（72px 格，径向 mask 渐隐） -->
<div class="progress"><div class="fill" id="progFill"></div></div>  <!-- 顶部 3px 渐变进度 -->
<div class="toolbar">                <!-- 右上工具栏：模板主题组 + 编辑组 + 页面组 + 工具入口 + 播放组 + 全屏帮助（动画/复制/截图已收纳到边栏 ⚙ 工具 Tab） -->
  <div class="group"><button class="tbtn" id="btnTemplate">🎨 模板</button>
    <button class="tbtn" id="btnTheme">🎨 主题</button></div>
  <div class="group"><button class="tbtn" id="btnUndo">↶ 撤销</button>
    <button class="tbtn" id="btnRedo">↷ 重做</button></div>
  <div class="group"><button class="tbtn" id="btnPages">▤ 页导航</button></div>
  <div class="group"><button class="tbtn" id="btnTools" title="右侧边栏 ⚙ 工具 Tab：动画库 + 复制与截图">⚙ 工具</button></div>
  <div class="group"><button class="tbtn" id="btnPlay">▶ 自动播放</button>
    <select class="tbtn" id="selInterval">3s/5s/8s/10s</select>
    <label class="tbtn"><input type="checkbox" id="chkLoop">循环</label>
    <label class="tbtn"><input type="checkbox" id="chkFromStart" checked>从头</label></div>
  <div class="group"><button class="tbtn" id="btnFull">⛶ 全屏</button>
    <button class="tbtn help" id="btnHelp">?</button></div>
</div>
<div class="pageno" id="pageNo"><b>1</b> / N</div>
<div class="hint">← → 翻页 · P 播放 · F 全屏 · G 页面/工具 · Ctrl+Z 撤销 · ? 操作说明</div>
<button class="nav prev" id="btnPrev">‹</button>
<button class="nav next" id="btnNext">›</button>
<aside class="sidepanel" id="sidePanel">…右侧边栏（sp-tabs 双 Tab：▤ 页面缩略图管理 / ⚙ 工具动画库+复制截图，open 类滑入）…</aside>
<main class="stage"><div class="deck" id="deck" data-transition="slide-lr" data-anim="on">
  <section class="slide cover active" data-title="封面">…</section>
  <section class="slide" data-title="目录">…</section>
  …（每页一个 section.slide，第一页带 active）
</div></main>
<div class="help-mask" id="helpMask">…说明弹层…</div>
<div class="help-mask" id="tplMask">…模板应用面板（模板卡 + 应用范围 + 页清单）…</div>
<div class="help-mask" id="themeMask">…主题切换面板（16 色点网格 + 全部/仅本页）…</div>
<div class="help-mask" id="copyMask">…选页复制面板…</div>
<div class="help-mask" id="shotMask">…选页截图面板…</div>
<script>播放引擎（见 §6）</script>
```

## 2. 十七主题 CSS 变量（完整色值，12 令牌 × 17 主题，默认 tech）

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
[data-theme="mono"]{ /* IDEA 黑亮 */
  --bg:#1e1f22; --bg2:#2b2d30; --panel:rgba(43,45,48,.92); --panel-solid:#2b2d30;
  --text:#dfe1e5; --muted:#9aa0a6; --accent:#3574f0; --accent2:#5e9aff;
  --border:rgba(53,116,240,.24); --glow:rgba(53,116,240,.3);
  --title-grad:linear-gradient(90deg,#dfe1e5,#5e9aff 50%,#3574f0);
  --tag-bg:rgba(53,116,240,.12);
}
[data-theme="light"]{ /* IDEA 白亮 */
  --bg:#ffffff; --bg2:#f2f2f2; --panel:rgba(255,255,255,.96); --panel-solid:#ffffff;
  --text:#1e1f22; --muted:#6e7781; --accent:#2675bf; --accent2:#4a9be0;
  --border:rgba(38,117,191,.18); --glow:rgba(38,117,191,.2);
  --title-grad:linear-gradient(90deg,#1e5f9f,#2675bf 55%,#4a9be0);
  --tag-bg:rgba(38,117,191,.08);
}
[data-theme="warm"]{ /* 温暖渐变 */
  --bg:#fdf3e7; --bg2:#f7e7d3; --panel:rgba(255,250,243,.85); --panel-solid:#fffaf3;
  --text:#43301f; --muted:#8a7565; --accent:#d97706; --accent2:#ea580c;
  --border:rgba(217,119,6,.18); --glow:rgba(217,119,6,.22);
  --title-grad:linear-gradient(90deg,#b45309,#d97706 50%,#ea580c);
  --tag-bg:rgba(217,119,6,.1);
}
[data-theme="aurora"]{ /* 极光紫（Linear 风） */
  --bg:#0b0b10; --bg2:#08080d; --panel:rgba(30,30,46,.72); --panel-solid:#1e1e2e;
  --text:#e8e8f0; --muted:#8a8aa3; --accent:#5e6ad2; --accent2:#9d8df2;
  --border:rgba(94,106,210,.28); --glow:rgba(94,106,210,.4);
  --title-grad:linear-gradient(90deg,#a8b3ff,#5e6ad2 45%,#9d8df2);
  --tag-bg:rgba(94,106,210,.16);
}
[data-theme="dracula"]{ /* 德古拉紫（Dracula 配色） */
  --bg:#282a36; --bg2:#21222c; --panel:rgba(48,50,64,.85); --panel-solid:#303240;
  --text:#f8f8f2; --muted:#6272a4; --accent:#bd93f9; --accent2:#ff79c6;
  --border:rgba(189,147,249,.28); --glow:rgba(189,147,249,.35);
  --title-grad:linear-gradient(90deg,#ff79c6,#bd93f9 50%,#8be9fd);
  --tag-bg:rgba(189,147,249,.15);
}
[data-theme="nord"]{ /* 北欧冰蓝（Nord 配色） */
  --bg:#2e3440; --bg2:#272c36; --panel:rgba(59,66,82,.85); --panel-solid:#3b4252;
  --text:#eceff4; --muted:#7e8aa0; --accent:#88c0d0; --accent2:#81a1c1;
  --border:rgba(136,192,208,.25); --glow:rgba(136,192,208,.3);
  --title-grad:linear-gradient(90deg,#8fbcbb,#88c0d0 45%,#81a1c1);
  --tag-bg:rgba(136,192,208,.14);
}
[data-theme="midnight"]{ /* 东京夜色（Tokyo Night） */
  --bg:#1a1b26; --bg2:#16161e; --panel:rgba(31,33,48,.85); --panel-solid:#1f2130;
  --text:#c0caf5; --muted:#565f89; --accent:#7aa2f7; --accent2:#bb9af7;
  --border:rgba(122,162,247,.25); --glow:rgba(122,162,247,.32);
  --title-grad:linear-gradient(90deg,#7dcfff,#7aa2f7 45%,#bb9af7);
  --tag-bg:rgba(122,162,247,.14);
}
[data-theme="matrix"]{ /* 终端荧光绿（Matrix） */
  --bg:#0a0f0a; --bg2:#050a05; --panel:rgba(16,26,16,.8); --panel-solid:#101a10;
  --text:#c8ffd8; --muted:#4f8a62; --accent:#00ff9c; --accent2:#3ddc84;
  --border:rgba(0,255,156,.22); --glow:rgba(0,255,156,.32);
  --title-grad:linear-gradient(90deg,#7dffc9,#00ff9c 50%,#3ddc84);
  --tag-bg:rgba(0,255,156,.1);
}
[data-theme="cyber"]{ /* 赛博霓虹（Cyberpunk） */
  --bg:#0b0518; --bg2:#070210; --panel:rgba(24,12,44,.78); --panel-solid:#180c2c;
  --text:#e8e6ff; --muted:#6f6a9e; --accent:#ff2d78; --accent2:#00e5ff;
  --border:rgba(255,45,120,.3); --glow:rgba(255,45,120,.4);
  --title-grad:linear-gradient(90deg,#ff2d78,#ff7ab8 40%,#00e5ff);
  --tag-bg:rgba(255,45,120,.14);
}
[data-theme="apple"]{ /* 苹果极简（Apple 官网） */
  --bg:#f5f5f7; --bg2:#e8e8ed; --panel:rgba(255,255,255,.85); --panel-solid:#ffffff;
  --text:#1d1d1f; --muted:#6e6e73; --accent:#0071e3; --accent2:#42a5ff;
  --border:rgba(0,113,227,.15); --glow:rgba(0,113,227,.2);
  --title-grad:linear-gradient(90deg,#1d1d1f,#0071e3 55%,#42a5ff);
  --tag-bg:rgba(0,113,227,.08);
}
[data-theme="stripe"]{ /* 条纹紫蓝（Stripe） */
  --bg:#f6f8fb; --bg2:#eef1f6; --panel:rgba(255,255,255,.88); --panel-solid:#ffffff;
  --text:#32325d; --muted:#6b7c93; --accent:#635bff; --accent2:#00d4ff;
  --border:rgba(99,91,255,.2); --glow:rgba(99,91,255,.22);
  --title-grad:linear-gradient(90deg,#635bff,#7a73ff 45%,#00d4ff);
  --tag-bg:rgba(99,91,255,.08);
}
[data-theme="notion"]{ /* 纸感暖白（Notion） */
  --bg:#ffffff; --bg2:#f7f6f3; --panel:rgba(251,251,250,.9); --panel-solid:#fbfbfa;
  --text:#37352f; --muted:#787774; --accent:#2383e2; --accent2:#0f9d8f;
  --border:rgba(55,53,47,.14); --glow:rgba(35,131,226,.15);
  --title-grad:linear-gradient(90deg,#37352f,#2383e2 55%,#0f9d8f);
  --tag-bg:rgba(55,53,47,.06);
}
[data-theme="gruvbox"]{ /* 复古暖橙（Gruvbox） */
  --bg:#282828; --bg2:#1d2021; --panel:rgba(50,48,47,.85); --panel-solid:#32302f;
  --text:#ebdbb2; --muted:#a89984; --accent:#fe8019; --accent2:#b8bb26;
  --border:rgba(254,128,25,.3); --glow:rgba(254,128,25,.32);
  --title-grad:linear-gradient(90deg,#fabd2f,#fe8019 50%,#b8bb26);
  --tag-bg:rgba(254,128,25,.12);
}
[data-theme="gold"]{ /* 黑金奢华（发布会） */
  --bg:#0d0b08; --bg2:#080604; --panel:rgba(30,24,14,.8); --panel-solid:#1e180e;
  --text:#f3e9c8; --muted:#9c8a5c; --accent:#d4af37; --accent2:#f5d76e;
  --border:rgba(212,175,55,.28); --glow:rgba(212,175,55,.35);
  --title-grad:linear-gradient(90deg,#f9e08a,#d4af37 45%,#f5d76e);
  --tag-bg:rgba(212,175,55,.12);
}
[data-theme="ocean"]{ /* 深洋蓝（深海） */
  --bg:#04121f; --bg2:#020a13; --panel:rgba(10,32,52,.78); --panel-solid:#0a2034;
  --text:#d6e9ff; --muted:#5b8aad; --accent:#38bdf8; --accent2:#60a5fa;
  --border:rgba(56,189,248,.25); --glow:rgba(56,189,248,.35);
  --title-grad:linear-gradient(90deg,#7dd3fc,#38bdf8 45%,#60a5fa);
  --tag-bg:rgba(56,189,248,.12);
}
```
主题切换（全局）：`document.documentElement.setAttribute('data-theme', name)`，面板色点同步 .on 点亮。

主题面板（「🎨 主题」打开 `#themeMask`）：`.theme-panel` 460px 宽，头部标题 + 范围 radio 胶囊（全部页面/仅本页，切换时 label.sel 高亮 + 重渲染点亮）+ `.theme-grid` 4 列 `.th-item`（`.th-dot` 色点内联 style 取 THEMES 色值 + 主题名，当前主题 .on 高亮）+ 底部「✕ 关闭」；**即点即换**——点 `.th-item` pushUndo → 按范围 setGlobalTheme/setSlideTheme → renderThemeDots 重渲染点亮 → buildThumbs，面板保持打开可连点对比；Esc/点遮罩/✕ 关闭；与模板/选页复制/选页截图/新页面板互斥打开。范围=仅本页时点亮按 `slides[cur]` 的 data-theme，否则按根 data-theme。

### 2.1 单页主题（整份或单页自由换肤）

- 主题面板范围 radio 默认「全部页面」：点色点改全局；选「仅本页」后点色点只改当前页 `slides[cur].setAttribute('data-theme', name)`；全局切换时 JS 遍历 slides 移除所有 slide 级 data-theme
- CSS 变量就近解析天然支持：`[data-theme="xxx"]` 属性选择器写在 slide 上即覆盖该页全部 var()；`.slide` 必须自带背景 `background:var(--bg)`（页背景跟随主题，全局 .bg-glow/.bg-grid 作为舞台外围氛围层）
- 单页主题的 slide 上保留 data-theme 属性持久生效；截图（§7）克隆 slide 时该属性自然入图，无需特殊处理
- 生成时按 user-config 的 THEME 给 documentElement 设默认主题，单页差异化主题由用户放映时点选

## 2.2 模板库（十七套版式骨架，运行时即点即换，与主题正交：模板管版式结构、主题管配色）

十七套模板随放映随时切换——工具栏「🎨 模板」打开模板应用面板，选模板卡（每卡带 mini 结构示意图）+ 应用范围（全部页面/仅本页/选择页面）；点「👁 预览本页」先把当前页临时套上看效果（可连续换卡即时换预览、再点「还原本页」或取消自动还原，预览不落 data-template），点应用才生效。**标题自动映射**：模板的固定标题位自动吃进页面里对应的标题（语义节点）。

### 语义节点约定（标题自动映射的根基）

每页 slide 内容必须按语义约定书写（classic 骨架即语义态）：
- 页标题：`.s-head h2`（色条标题头）或 `.s-title`（无头大标题）；`.tag` 英文角标
- 卡片：`.grid2/.grid3/.grid4 > .card`，卡片内 `.card h4`（标题）+ `.card h4 .en`（英文小标签）+ `.card p`（正文）
- 要点：`ul.points > li`；数据：`.bignum > b`（数字）+ `span`（标签）；目录：`.toc > .toc-item`
- 封面：`.cover`（logo/s-title/sub/sign）；结束页：`.endpage`

模板应用机制：每页首次应用模板时存档原始 innerHTML（`_origin`），应用 = 恢复语义态 → slide 挂 `data-template` 属性 → 按需执行结构包装器。切回 classic 即恢复原始排版，内容一条不丢。生成侧写语义结构（不再写 `.t-minimal` 等包裹 div），每页 slide 挂 `data-template` 声明默认版式。

### T1 classic 经典商务（默认，语义态本身，无前缀规则）
- 封面：logo 块 76px + 64px 大标题 + sub + 底部署名
- 内容页：`.s-head` 左色条标题 + `.grid2/.grid3` 卡片栅格；数据页：`.bignum` 大数字卡栅格；目录：`.toc` 条目列表

### T2 minimal 极简留白（纯 CSS，无包装器）
- `.s-head` 去色条、标题 44px 居中渐变；`.tag` 隐藏；卡片去边框去背景变纯文字；`.bignum` 数字放大 88px；封面隐藏 logo 块整体居中
- CSS 前缀：`[data-template="minimal"] .s-head::before{display:none}`；`[data-template="minimal"] .s-head h2{font-size:44px;text-align:center;…渐变}`；`[data-template="minimal"] .card{background:transparent;border:none}`；`[data-template="minimal"] .bignum b{font-size:88px}`

### T3 magazine 杂志画册（包装器 wrapMagazine 生成分栏）
- 左列：h3=`.s-head h2` 页标题、p=首张卡片正文；右列 `.m-figure` 高 380px 圆角 18 渐变图位 + 卡片标题转 chip 标注；≥2 个 `.bignum` 自动转横向 `.m-strip` 大数字带
- 封面标题放大 96px；卡片圆角加大
- CSS 前缀：`[data-template="magazine"] …` + `.m-split/.m-figure/.m-strip`

### T4 keynote 黑金发布（包装器 wrapKeynote 生成单点大字）
- `.k-big`=页标题（`.s-head h2`）大观点 64px 居中、`.k-sub`=首张卡片正文一句解释、`.k-bar` 细进度线、`.k-ring`=第一个 `.bignum` 数字环形进度 120px、其余卡片标题收成 `.k-note` 小字行
- 封面/结束页标题 112px/96px 居中
- CSS 前缀：`[data-template="keynote"] …` + `.k-big/.k-sub/.k-bar/.k-ring/.k-note`

### T5 timeline 时间线叙事（包装器 wrapTimeline 生成时间线）
- `.card` 组转 `.tl` 竖线时间轴——`.tl-time`=卡内 `.en` 小标签（时间）、节点标题=卡片标题、正文=卡片 p
- CSS：`.tl` 左侧 3px var(--accent) 竖线 + `.tl-item` 节点圆点 14px

### T6 steps 流程步骤（包装器 wrapSteps 生成箭头步骤条）
- `.card` 组转 `.st-wrap` 弹性步骤条——`.st-no` 编号圆徽、卡片标题→步骤标题、卡片 p→步骤说明；步骤间「→」箭头连接（末项隐藏）
- CSS：`.st-wrap` flex 撑满、`.st-step` 圆角面板 + `.st-step::after` 箭头、`.st-no` 渐变圆徽 42px

### T7 poster 海报宣传（包装器 wrapPoster 生成斜切色带）
- `.points li/.card` 转 `.pt-band` 色带——主文字 + 副文字（p/.en）小字收尾；相邻色带左右交替斜切（clip-path polygon），渐变 accent→accent2 底白字
- 页面标题放大 40px、封面大标题 84px 海报感
- CSS：`.pt-band` 两向 clip-path + nth-child 交替

### T8 vintage 复古报纸（包装器 wrapVintage 生成双栏）
- `.card` 收进 `.v-col` 双栏（column-count:2 + column-rule 分隔线），衬线字体（Georgia/宋体系），卡去背景去描边改虚线分隔
- 标题 38px 衬线 + 双线刊头下边框，`.tag` 大字母距
- CSS：`.v-col` 双栏、`[data-template="vintage"]` 衬线族 + 虚线下划卡

### T9 finance 金融报表（包装器 wrapFinance 生成仪表环）
- `.bignum` 数字含 % 的转 `.fn-ring` 仪表环（conic-gradient 按百分比扫弧 + 中空圆 + 中心大字 + 底部 caption），非百分数保留竖线 KPI 样式（左 accent 竖条）
- 页头底部 2px accent 分隔线
- CSS：`.fn-ring` 150px 环（--pn 变量控弧）、`[data-template="finance"] .bignum` 竖线化

### T10 blueprint 蓝图工程（纯 CSS，无包装器）
- 卡片直角 + accent 描边 + 制图坐标刻度（::before 上沿、::after 右沿短标）；slide 加 36px 工程网格背景
- 标题/标签字母距大写感；CSS：`[data-template="blueprint"]` 网格背景 + 卡片刻度伪元素

### T11 education 教学板书（纯 CSS，无包装器）
- `.s-head::before` 隐藏、标题底部 4px accent 粗下划线（板书感）；卡片去框改左侧 accent2 竖条
- CSS：`[data-template="education"]` 下划线标题 + 竖条卡

### T12 executive 高管简报（纯 CSS，无包装器）
- 页头细分隔线、标题色条加高；卡片去框改左侧 3px accent 竖线、直角小圆角，字号克制 17px
- CSS：`[data-template="executive"]` 细线风

### T13 metro 扁平磁贴（纯 CSS，无包装器）
- 卡片 nth-child 轮换 accent/accent2/muted 纯色磁贴、白字、无边框 8px 圆角；hover 无位移
- CSS：`[data-template="metro"] .card:nth-child(4n+1/2/3/4)` 色块轮换

### T14 bento 模块网格（纯 CSS，无包装器）
- grid3 改 1.5fr/1fr/1fr、grid2 改 1.5fr/1fr，首卡 grid-row:span 2 大格拼贴（Bento 风格）
- CSS：`[data-template="bento"]` 非对称网格

### T15 dark 暗夜深色（纯 CSS，页面级变量覆盖）
- slide 挂 `[data-template="dark"]` 即整页反色：--bg 深黑、--text 浅灰、--accent 蓝/绿（GitHub Dark 系），浅色主题下同样全黑
- CSS：`[data-template="dark"]{ --bg:#0d1117; … }` 八变量全套覆盖

### T17 stats 统计图表（纯 CSS，无包装器）
- 数据看板风：`.s-head` 底部 2px accent 双线、标题 30px；`.bignum` 去边框改顶部 3px accent 横条、数字放大 56px；`.chart-card` 加 accent 描边框架
- CSS：`[data-template="stats"]` 看板风

### T16 nature 自然清新（纯 CSS，无包装器）
- 有机圆角：卡片/标签/目录条目不对称圆角（24/8 交替）、hover 轻旋 -0.6deg；色点改旋转叶片形
- CSS：`[data-template="nature"]` 圆润形状语言

### 预览本页（先看效果再应用，不污染内容）
- 面板底部「👁 预览本页」：`previewSnap = { tpl: tplOf(slide), html: slide.innerHTML }` 记下当前页原状态 → `applyTpl(slide, selTpl)` 临时套模板（不落 data-template 语义态、_origin 不受影响）→ 按钮变「还原本页」
- 预览中再点其它模板卡 = 即时换预览；再点「还原本页」或取消/Esc/点遮罩 → 恢复 previewSnap.html 并还原 tpl 属性；点「应用模板」→ 先还原预览态再 pushUndo + applyScope 落盘
- closeTplPanel 统一做还原，Esc 走 closeTplPanel 不直接 classList.remove

### 撤销 / 重做（所有编辑操作可回退）
- `snap()` 快照 = deck.innerHTML + cur + 每页元信息数组（_origin/data-template/data-theme；innerHTML 序列化会丢 JS 属性，必须显式记录）；undoStack 上限 20，push 前 shift 旧项，任何 push 清空 redoStack
- `restore(sn)` = deck.innerHTML 还原 → refreshSlides 重建 slides/N → 逐页恢复元信息 → buildThumbs → go；undo/redo 互为快照交换；工具栏 ↶↷ 按钮 disabled 态随栈空满切换
- pushUndo 时机：模板应用（doApplyTpl，预览还原后）、主题面板点色点（全局/单页）、新增页、复页、上移/下移、删除页——全部在修改前调用
- 键盘 Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y（mac 支持 metaKey），放在 e.repeat 检查之前（允许长按连撤），弹层面板打开时（anyMaskOpen）忽略；URL 参数（?tpl/?theme）初始化不算编辑不入栈

### 页面管理边栏（缩略图浏览/跳转/新页/复页/排序/删页，像专业 PPT 软件）
- 右侧 `.sidepanel` 264px 滑入面板（G 键或「▤ 页导航」开合，open 类 translateX 进场；z-index 11 高于工具栏 10，打开时头部「＋ 新页」不被右上工具栏遮挡，仍低于弹层面板 20）；顶部 `.sp-tabs` 双 Tab（▤ 页面 / ⚙ 工具，末位 tab 记忆）+ 头部「页面导航 + ＋新页 + ✕ 收起」+ `.sp-list` 竖向滚动缩略图列表；⚙ 工具 Tab（`#paneTools` 纵向滚动）收纳动画库与复制截图
- 缩略图 = 各 slide `outerHTML` 克隆入 `.thumb-wrap`（16:9），克隆重置 class 为 `slide thumb-slide`（CSS !important 强制可见 + 1280×720 定宽），JS 按 `wrap 宽/1280` 设 transform:scale 等比缩小；序号角标（左上）+ 页标题 `.thumb-t`（左下，取 data-title，缺省「第 N 页」）+ 当前页 `.cur` 高亮（go() 里 thumbCur() 同步）+ hover 显 `.thumb-ops` 操作条（右下：⧉ 复页 / ↑ 上移 / ↓ 下移 / 🗑 删页，首尾页上/下移 disabled，N=1 删页 disabled）
- 点击缩略图 go(i) 跳页；操作条分发：del → pushUndo + deletePage、dup → pushUndo + dupPage（cloneNode 当前页插其后，去 active，跳新页）、up/down → pushUndo + movePage（insertBefore 前后换位，跳新位）；边栏头部「＋ 新页」打开 addMask（16 版式任选）；全屏时 sidepanel 随操作元素一起隐藏
- 编辑改动后调用 buildThumbs() 重建（模板/主题/增删页/复页/排序/撤销还原都要刷）

### 新增 / 复页 / 排序 / 删除页面
- 「＋ 新页」（边栏头部）打开 addMask：16 版式 mini 卡四列网格，点选 → pushUndo → `blankSlideHtml(tpl)` 生成语义骨架（s-head 新页面标题 + grid2 两张占位卡，非 classic 挂 data-template）→ `deck.insertBefore(s, slides[cur].nextSibling)` 插在当前页后 → refreshSlides → 非 classic 跑 applyTpl 包装 → buildThumbs → go(cur+1)
- 「⧉ 复页」cloneNode(true) 复制当前页（class 去 active）插其后 → refreshSlides → buildThumbs → go(i+1)；「↑/↓」insertBefore 换位（越界不动）→ 同刷 → go(j)
- 「🗑 删页」删该页（N≤1 时禁删）：pushUndo → removeChild → refreshSlides → buildThumbs → cur 越界回退 N-1
- 新增/复页/排序/删除只作用于内存（与模板/主题一致），不修改 HTML 源文件；重开页面回到原始 deck

模板不再只限生成时定版式：user-config 的 `TEMPLATE` 是生成默认（AI 每页写语义结构 + 对应 slide 挂 data-template），用户放映时随时在模板面板切换（全部/仅本页/勾选页）；`?tpl=xxx` URL 参数全局应用（headless 截图用）。

## 2.3 领域/业务成套模板（面板「💼 领域」Tab，二十二套一键生成整套页面）

模板面板头部双 Tab：「🎨 版式」（17 版式应用全部/仅本页/勾选页，原逻辑）与「💼 领域」（22 套成套模板）。领域 Tab 隐藏范围选择与「预览本页」，tplDo 变「生成成套页面（N 页）」并带两段确认（profArmed：第一击变「⚠ 确认：整份替换为「xx」（可撤销）」，第二击才执行）。

- **PROF 数据**：`PROF_CATS` 六分类（教育学术 / 职场商务 / 企业运营 / 专业领域 / 党政政务 / 生活场景）；`PROF` 22 套，每套 `{ id, cat, name, ds, main, pages[] }`，main 指向 16 版式之一，卡片迷你预览取 `tplById(main).mini`
- **P 生成器**（8 函数，产物=语义骨架页字符串，页内结构与演示页一致：s-head/grid/card/points/bignum）：`cover(标题,副题)`（class="slide cover" 特殊页）/ `toc(标题,条目[])`（toc-item data-goto=2+i 自动指向内容页）/ `points(title,tag,tpl,pts[])` / `cards(title,tag,tpl,{h,en,p}[])`（按 2/3/4+ 张选 grid2/3/4）/ `nums(title,tag,tpl,{b,s}[])`（grid4 bignum）/ `chartHtml(kind,spec)`（bars 最高值归一化 --h；line 300×158 均布取点；pie C=351.86 段 stroke-dasharray+rotate 按占比累加；ring CC=389.56 不写 transform——CSS 已预置 rotate(-90deg)）/ `chart(title,tag,tpl,kind,spec,noteH,notes[])`（grid2 图表卡+要点卡）/ `end()`（class="slide endpage"）
- **applyProf 引擎**：pushUndo → deck.innerHTML = pages.join('') → refreshSlides → 非 classic 非特殊页逐页 applyTpl 跑包装器 → buildThumbs → 关面板 → cur=0 go(0) → 按钮反馈「✓ 已套用「xx」」
- **图表页保护**：applyTpl 在 setAttribute 之后先判 `s.querySelector('[data-anim-chart]')`——含图表卡的页直接 return，跳过 timeline/keynote/magazine/steps/poster 等重排包装器（它们会替换容器或清空整页吞掉图表）；图表页保持 grid2 语义结构 + 模板配色，图表动画照常触发。运行时手动切换版式同样受保护
- **演示页 15 联动**：21 张 .prof-demo 紧凑卡（7 列 × 3 行，data-prof + data-anim 错落），deck 点击委托 → openTplPanel + setTplTab('prof') + 选中 + renderProfCards + updateTplBtn
- 二十二套（id · 名称 · 主版式 · 页数）：edu——thesis 毕业答辩 minimal 7 / proposal 开题报告 executive 7 / teaching 教学课件 education 7；biz——report 年终汇报 executive 8 / competition 竞聘述职 timeline 7 / plan 商业计划书 finance 7 / hiring 求职简历 timeline 6；corp——product 产品发布 keynote 7 / tech 科技发布会 blueprint 7 / marketing 营销方案 poster 7 / sales 销售方案 executive 7 / training 企业培训 education 7 / ceremony 年会盛典 poster 7；pro——finance 金融分析 finance 7 / medical 医疗科普 metro 7 / law 法律合规 executive 6；gov——gov 政务汇报 executive 7 / party 党建汇报 executive 7；life——food 餐饮品牌 magazine 7 / travel 旅游攻略 magazine 7 / festival 节日庆典 poster 6 / charity 公益慈善 minimal 7
- 生成后与版式/主题正交：每页照常挂 data-template 运行时任意切换，主题照常换肤；领域模板只在「生成整套」时决定页序+每页版式+图表选型，不新增版式骨架
- 图表页生成规则不变：趋势 line / 占比 pie / 对比 bars / 达成率 ring，图表一律挂 data-anim-chart 保留自身动画（见 3.1 L6），关键数字挂 data-count 滚动

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

## 3.1 动画库（翻页八套 + 入场十二式 + 离场十二式 + 强调八式 + 标题文字，与模板/主题正交）

### L1 翻页动画风格（deck 根标签 data-transition；slide-lr 为基础默认，以下七套覆盖）

```css
.deck[data-transition="fade"] .slide{ transform:none; }
.deck[data-transition="fade"] .slide.active{ transform:none; }
.deck[data-transition="fade"] .slide.dim{ transform:none; }
.deck[data-transition="slide-ud"] .slide{ transform:translateY(44px); }
.deck[data-transition="slide-ud"] .slide.active{ transform:translateY(0); }
.deck[data-transition="slide-ud"] .slide.dim{ transform:translateY(-44px); }
.deck[data-transition="zoom"] .slide{ transform:scale(1.07); }
.deck[data-transition="zoom"] .slide.active{ transform:scale(1); }
.deck[data-transition="zoom"] .slide.dim{ transform:scale(.93); }
.deck[data-transition="flip"]{ perspective:1800px; }
.deck[data-transition="flip"] .slide{ transform-origin:center center; backface-visibility:hidden; transition:opacity .5s ease, transform .6s cubic-bezier(.4,0,.2,1), visibility 0s linear .6s; }
.deck[data-transition="flip"] .slide.active{ transform:rotateY(0deg); }
.deck[data-transition="flip"] .slide.dim{ opacity:0; transform:rotateY(-90deg); }
.deck[data-transition="cube"]{ perspective:1800px; }
.deck[data-transition="cube"] .slide{ transform-origin:center center; backface-visibility:hidden; transition:opacity .5s ease, transform .7s cubic-bezier(.4,0,.2,1), visibility 0s linear .7s; }
.deck[data-transition="cube"] .slide.active{ transform:rotateY(0deg); }
.deck[data-transition="cube"] .slide.dim{ opacity:0; transform:rotateY(90deg); }
.deck[data-transition="wipe"] .slide{ transform:translateX(100%); transition:opacity .45s ease, transform .55s cubic-bezier(.4,0,.2,1), visibility 0s linear .55s; }
.deck[data-transition="wipe"] .slide.active{ transform:translateX(0); }
.deck[data-transition="wipe"] .slide.dim{ transform:translateX(-100%); }
.deck[data-transition="dissolve"] .slide{ transform:none; transition:opacity .5s ease, filter .5s ease, visibility 0s linear .5s; }
.deck[data-transition="dissolve"] .slide.active{ filter:none; }
.deck[data-transition="dissolve"] .slide.dim{ opacity:0; filter:blur(8px); }
```

### L2 元素入场动画（翻到该页自动播放；data-anim-delay 错落入场，十二式 + none）

```css
.slide [data-anim]{ opacity:0; animation-fill-mode:both; }
.slide [data-anim="none"]{ opacity:1 !important; animation:none !important; }
.slide.active [data-anim="fade-up"]{ animation-name:md-fade-up; animation-duration:.6s; animation-timing-function:cubic-bezier(.22,.61,.36,1); }
.slide.active [data-anim="fade-in"]{ animation-name:md-fade-in; animation-duration:.5s; animation-timing-function:ease; }
.slide.active [data-anim="fade-down"]{ animation-name:md-fade-down; animation-duration:.6s; animation-timing-function:cubic-bezier(.22,.61,.36,1); }
.slide.active [data-anim="zoom-in"]{ animation-name:md-zoom-in; animation-duration:.55s; animation-timing-function:cubic-bezier(.22,.61,.36,1); }
.slide.active [data-anim="slide-left"]{ animation-name:md-slide-left; animation-duration:.6s; animation-timing-function:cubic-bezier(.22,.61,.36,1); }
.slide.active [data-anim="slide-right"]{ animation-name:md-slide-right; animation-duration:.6s; animation-timing-function:cubic-bezier(.22,.61,.36,1); }
.slide.active [data-anim="slide-up"]{ animation-name:md-slide-up; animation-duration:.6s; animation-timing-function:cubic-bezier(.22,.61,.36,1); }
.slide.active [data-anim="slide-down"]{ animation-name:md-slide-down; animation-duration:.6s; animation-timing-function:cubic-bezier(.22,.61,.36,1); }
.slide.active [data-anim="pop"]{ animation-name:md-pop; animation-duration:.5s; animation-timing-function:cubic-bezier(.34,1.56,.64,1); }
.slide.active [data-anim="bounce-in"]{ animation-name:md-bounce-in; animation-duration:.7s; animation-timing-function:cubic-bezier(.34,1.56,.64,1); }
.slide.active [data-anim="flip-in"]{ animation-name:md-flip-in; animation-duration:.65s; animation-timing-function:cubic-bezier(.22,.61,.36,1); }
.slide.active [data-anim="blur"]{ animation-name:md-blur; animation-duration:.6s; animation-timing-function:ease; }
.slide.active [data-anim-delay="60"]{ animation-delay:60ms; }
.slide.active [data-anim-delay="120"]{ animation-delay:120ms; }
.slide.active [data-anim-delay="180"]{ animation-delay:180ms; }
.slide.active [data-anim-delay="240"]{ animation-delay:240ms; }
.slide.active [data-anim-delay="300"]{ animation-delay:300ms; }
.slide.active [data-anim-delay="400"]{ animation-delay:400ms; }
.slide.active [data-anim-delay="500"]{ animation-delay:500ms; }
.slide.active [data-anim-delay="600"]{ animation-delay:600ms; }
.deck[data-anim="off"] .slide [data-anim]{ opacity:1 !important; animation:none !important; }
.deck[data-anim="off"] .slide [data-anim-emphasis]{ animation:none !important; }

```

### L3 元素离场动画（翻离该页前播放；.slide.leaving 由 JS leaveThenGo 触发）

```css
.slide [data-anim-leave]{ animation-fill-mode:both; }
.slide.leaving [data-anim-leave="fade-out"]{ animation:md-fade-out .45s ease both; }
.slide.leaving [data-anim-leave="fade-up-out"]{ animation:md-fade-up-out .45s ease both; }
.slide.leaving [data-anim-leave="fade-down-out"]{ animation:md-fade-down-out .45s ease both; }
.slide.leaving [data-anim-leave="slide-left-out"]{ animation:md-slide-left-out .45s ease both; }
.slide.leaving [data-anim-leave="slide-right-out"]{ animation:md-slide-right-out .45s ease both; }
.slide.leaving [data-anim-leave="slide-up-out"]{ animation:md-slide-up-out .45s ease both; }
.slide.leaving [data-anim-leave="slide-down-out"]{ animation:md-slide-down-out .45s ease both; }
.slide.leaving [data-anim-leave="zoom-out"]{ animation:md-zoom-out .45s ease both; }
.slide.leaving [data-anim-leave="zoom-big-out"]{ animation:md-zoom-big-out .45s ease both; }
.slide.leaving [data-anim-leave="flip-out"]{ animation:md-flip-out .45s ease both; }
.slide.leaving [data-anim-leave="drop-out"]{ animation:md-drop-out .5s cubic-bezier(.55,0,.8,.4) both; }
.slide.leaving [data-anim-leave="blur-out"]{ animation:md-blur-out .45s ease both; }
```

### L4 元素强调动画（页面激活期间循环播放；与入场互斥，强调优先）

```css
.slide.active [data-anim-emphasis]{ opacity:1; }
.slide.active [data-anim-emphasis="pulse"]{ animation:md-pulse 1.6s ease-in-out infinite; }
.slide.active [data-anim-emphasis="swing"]{ animation:md-swing 1.8s ease-in-out infinite; transform-origin:top center; }
.slide.active [data-anim-emphasis="shake"]{ animation:md-shake 1.4s ease-in-out infinite; }
.slide.active [data-anim-emphasis="breathe"]{ animation:md-breathe 2.2s ease-in-out infinite; }
.slide.active [data-anim-emphasis="flash"]{ animation:md-flash 1.8s ease-in-out infinite; }
.slide.active [data-anim-emphasis="tada"]{ animation:md-tada 1.8s ease-in-out infinite; }
.slide.active [data-anim-emphasis="spin"]{ animation:md-spin 1.8s linear infinite; }
.slide.active [data-anim-emphasis="glow"]{ animation:md-glow 1.6s ease-in-out infinite; }
```

### L5 标题文字动画（运行时拆分 h1/h2/h3/.s-title 为 span，复用入场机制）

```css
.tchar, .tword{ display:inline-block; }
.tline{ display:block; }
```

### L6 图表动画（bars/line/pie/ring/count 五式，图表容器挂 data-anim-chart，翻页自动播放、翻回重放）

图表动画独立于元素入场动画：图表是「会动的数据」而非「会动的卡片」，翻到页自行生长/描画/扇入，不参与 data-anim 入场体系（可同时用，但不推荐图表卡再挂入场动画）。

- **bars 柱状生长**：`.chart-bars` 容器挂 `data-anim-chart="bars"`；柱 `.bar i` 高度内联 `style="--h:42%"`、序号 `--bi` 控制错峰（`calc(var(--bi)*100ms)`）；激活时 scaleY(0→1) 生长（transform-origin:bottom）
- **line 折线描画**：`.chart-line svg` 内 `polyline.ln` 预置 `stroke-dasharray:600; stroke-dashoffset:600`，激活时 dashoffset 动画归零（走线）+ 圆点 `.pt` 按 `--pi` 序浮现（描画完成后）
- **pie 饼图扇入**：每段 `circle.pc` 预置 `stroke-dasharray:L C-L`（L=段弧长、C=整周长）+ 内联 `--po:C`，段起点用 CSS `transform:rotate(deg)` + `transform-box:fill-box; transform-origin:center`；激活时 dashoffset 从 --po 扫入 0，逐段 `--pi×140ms` 错峰；颜色按 s1/s2/s3 取 accent/accent2/固定绿
- **ring 仪表扫弧**：单段 circle 同 pie 机制（`.rc` 预置 rotate(-90deg) 顶部起扫），底环 `.rc-bg` 用 --tag-bg；中心数字挂 `data-count` + `data-count-dec` 由 JS 滚动
- **count 数字滚动**：`data-count="72" data-count-dec="1"` 元素在 go() 里 rAF 缓动 0→目标（900ms ease-out cubic），与入场动画重播同源，翻回重放
- reduced-motion：图表动画全部退化为直显（柱 scaleY(1)、dashoffset 0、圆点 opacity 1）
- 图表组件全部主题变量驱动（stroke 用 var(--accent)/var(--accent2)、底环 var(--tag-bg)、卡底 var(--panel)），换肤即变色

### keyframes（入场 12 式 + 离场 12 式 + 强调 8 式 + 图表 5 式，与上面对应）

```css
@keyframes md-fade-up{ from{ opacity:0; transform:translateY(24px); } to{ opacity:1; transform:none; } }
@keyframes md-fade-in{ from{ opacity:0; } to{ opacity:1; } }
@keyframes md-fade-down{ from{ opacity:0; transform:translateY(-24px); } to{ opacity:1; transform:none; } }
@keyframes md-zoom-in{ from{ opacity:0; transform:scale(.9); } to{ opacity:1; transform:none; } }
@keyframes md-slide-left{ from{ opacity:0; transform:translateX(-32px); } to{ opacity:1; transform:none; } }
@keyframes md-slide-right{ from{ opacity:0; transform:translateX(32px); } to{ opacity:1; transform:none; } }
@keyframes md-slide-up{ from{ opacity:0; transform:translateY(32px); } to{ opacity:1; transform:none; } }
@keyframes md-slide-down{ from{ opacity:0; transform:translateY(-32px); } to{ opacity:1; transform:none; } }
@keyframes md-pop{ 0%{ opacity:0; transform:scale(.6); } 70%{ transform:scale(1.05); } 100%{ opacity:1; transform:none; } }
@keyframes md-bounce-in{ 0%{ opacity:0; transform:translateY(40px) scale(.9); } 55%{ opacity:1; transform:translateY(-12px) scale(1.03); } 78%{ transform:translateY(6px) scale(.99); } 100%{ opacity:1; transform:none; } }
@keyframes md-flip-in{ from{ opacity:0; transform:perspective(900px) rotateY(-75deg); } to{ opacity:1; transform:none; } }
@keyframes md-blur{ from{ opacity:0; filter:blur(10px); } to{ opacity:1; filter:none; } }
@keyframes md-fade-out{ from{ opacity:1; } to{ opacity:0; } }
@keyframes md-fade-up-out{ from{ opacity:1; transform:none; } to{ opacity:0; transform:translateY(-40px); } }
@keyframes md-fade-down-out{ from{ opacity:1; transform:none; } to{ opacity:0; transform:translateY(40px); } }
@keyframes md-slide-left-out{ from{ opacity:1; transform:none; } to{ opacity:0; transform:translateX(-64px); } }
@keyframes md-slide-right-out{ from{ opacity:1; transform:none; } to{ opacity:0; transform:translateX(64px); } }
@keyframes md-slide-up-out{ from{ opacity:1; transform:none; } to{ opacity:0; transform:translateY(-64px); } }
@keyframes md-slide-down-out{ from{ opacity:1; transform:none; } to{ opacity:0; transform:translateY(64px); } }
@keyframes md-zoom-out{ from{ opacity:1; transform:none; } to{ opacity:0; transform:scale(.82); } }
@keyframes md-zoom-big-out{ from{ opacity:1; transform:none; } to{ opacity:0; transform:scale(1.28); } }
@keyframes md-flip-out{ from{ opacity:1; transform:none; } to{ opacity:0; transform:perspective(900px) rotateY(70deg); } }
@keyframes md-drop-out{ 0%{ opacity:1; transform:none; } 55%{ opacity:1; transform:translateY(12px); } 100%{ opacity:0; transform:translateY(120px); } }
@keyframes md-blur-out{ from{ opacity:1; filter:none; } to{ opacity:0; filter:blur(10px); } }
@keyframes md-pulse{ 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.06); } }
@keyframes md-swing{ 0%,100%{ transform:rotate(0deg); } 20%{ transform:rotate(6deg); } 40%{ transform:rotate(-5deg); } 60%{ transform:rotate(4deg); } 80%{ transform:rotate(-3deg); } }
@keyframes md-shake{ 0%,100%{ transform:translateX(0); } 12%{ transform:translateX(-6px); } 24%{ transform:translateX(6px); } 36%{ transform:translateX(-5px); } 48%{ transform:translateX(5px); } 60%{ transform:translateX(-3px); } 72%{ transform:translateX(3px); } 84%{ transform:translateX(-1px); } }
@keyframes md-breathe{ 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:.82; transform:scale(1.045); } }
@keyframes md-flash{ 0%,100%{ opacity:1; } 50%{ opacity:.3; } }
@keyframes md-tada{ 0%{ transform:scale(1); } 25%{ transform:scale(1.16) rotate(-2.5deg); } 55%{ transform:scale(1.16) rotate(2.5deg); } 100%{ transform:scale(1); } }
@keyframes md-spin{ from{ transform:rotate(0deg); } to{ transform:rotate(360deg); } }
@keyframes md-glow{ 0%,100%{ box-shadow:0 0 6px var(--glow); } 50%{ box-shadow:0 0 26px var(--glow), 0 0 48px var(--glow); } }
@media (prefers-reduced-motion:reduce){
  .slide, .slide.active, .slide.dim{ transition:none; }
  .slide [data-anim], .slide.active [data-anim], .slide [data-anim-emphasis], .slide.leaving [data-anim-leave]{ opacity:1 !important; animation:none !important; }
}
```

### 边栏工具 Tab 与 JS 控制（localStorage 记忆，失败静默）

- 动画库/复制/截图全部收纳在右侧边栏「⚙ 工具」Tab（工具栏 ⚙ 按钮或 G 键进入；边栏双 Tab：▤ 页面缩略图管理 / ⚙ 动画与工具，宽度 264px，工具 Tab 纵向滚动）；动画 CSS 区紧跟全屏规则、位于版式组件之前
- 翻页切换区：八套按钮网格（`data-tg`，当前套 .on 高亮）即点即换 deck `data-transition`
- 元素动画区：`chkAnim` 复选框（入场动画开关，默认勾选）+ 应用范围 radio（`input[name="animScope"]`：all 全部页面 / current 仅本页，`.seg-btn.sel` 高亮）+ 三组网格——入场 12 式（`data-a` + none）、离场 12 式（`data-l` + none）、强调 8 式（`data-e` + none）；标题文字区：四选按钮（none 无动画 / char 逐字 / word 逐词 / line 逐行，`data-ta`）；页面操作区：⧉ 复制本页 / ▦ 选页复制 / 📷 截图本页 / ▦ 选页截图（原工具栏四按钮移入，ID 与事件照旧）
- 应用范围：`animSlides()` = scope 为 all 时全部 slides、current 时仅 slides[cur]；入场/离场/强调/标题文字设置均作用于范围页；互斥规则：挂强调时移除该元素 `data-anim`（强调优先）；applyEnter none = 移除 `data-anim` 与 `data-anim-delay`；applyLeave none = 移除 `data-anim-leave`；applyEmph none = 移除 `data-anim-emphasis`
- 标题文字拆分：splitText 按 `<br>` 分行后逐字（char）/逐词（word，按空白分）/逐行（line）包 `<span class="tchar|tword|tline" data-anim="fade-up" style="animation-delay:min(序号×60,600)ms">`，原文存 `data-md-orig`；restoreText 按原文还原；none 时还原为纯文本（默认无动画）
- deck 根标签：`data-transition="slide-lr" data-anim="on"`；JS 初始化时读 localStorage（`md-deck-transition` / `md-deck-anim` / `md-deck-anim-scope` / `md-deck-text-anim` / `md-deck-side-tab`），命中则回填控件并设置 deck 属性，无记忆则回退 DOM 属性；事件写 deck 属性 + 写 localStorage（try-catch 静默）
- 离场引擎：`leaveThenGo(i)` = leaving 防抖；当前页无 `[data-anim-leave]:not(none)` 或 deck `data-anim="off"` 时直切 `go(i)`；否则 slide 加 `.leaving` 类触发 CSS 离场（0.45s），并重置节点 animation 重播，480ms 后移除类再 `go(i)`；next/prev/自动播放/键盘/缩略图/数字键/Home/End/data-goto/hashchange 全走 leaveThenGo
- 生成侧规则：生成时按 user-config `TRANSITION` 写 deck 的 `data-transition` 初始值（用户口头点名风格当次优先）；`ANIM: false` 时 deck 挂 `data-anim="off"` 且 chkAnim 不勾选
- `data-anim` 十二式选用建议：页标题/封面大字配 `fade-up`，整页要点配 `fade-in`，数据卡/图片配 `zoom-in`，左右分栏内容各配 `slide-left`/`slide-right`，强调结论配 `pop`，轻快元素配 `bounce-in`，翻牌感配 `flip-in`，整卡浮现配 `blur`；同页多元素按视觉次序挂 `data-anim-delay`（60/120/180/240/300/400/500/600 八档）错落入场
- 入场动画纯 CSS 驱动（`.slide.active` 类切换即触发），无需 JS；翻离再翻回会重放入场动画（设计如此）

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

## 4.1 图表组件与动画（L6，全部主题变量驱动，不写死颜色）

- `.chart-card`：图表卡（--panel 底 + --border 细边 + 圆角 14 + `.cc-head` 标题行 h4/en）
- `.chart-bars`：柱状图容器（flex 撑满高 158px；`.bar` 柱列 = `b` 数值 + `i` 柱体 + `em` 标签；柱体渐变 accent→accent2 + 发光）
- `.chart-line`：折线图（SVG polyline + 圆点，dashoffset 描画动画）
- `.chart-pie`：饼图（SVG circle 弧段，rotate 定起点 + dashoffset 扇入，s1/s2/s3 三色）
- `.chart-ring`：仪表环（底环 + accent 弧 + 中心 `.rc-val` 大数字 + 标签）
- 动画触发规则：`.slide.active [data-anim-chart="xxx"]` 播放；翻离再翻回重放；prefers-reduced-motion 直显
- 数字滚动：`[data-count]` 由 go() 挂接 rAF 滚动（见 6. 播放引擎 JS）

## 5. 操作元素（固定样式，禁止改动定位语义）

- `.toolbar`：right:18px top:14px，`display:flex + align-items:center + gap:10px + flex-wrap:wrap + justify-content:flex-end + max-width:calc(100vw - 36px)`（各组垂直居中、组间留白；窄窗口自动折行右对齐，永不出屏）
- `.group`：胶囊组（圆角 999），`display:flex + align-items:center + gap:8px + padding:4px 6px`
- `.tbtn`：`display:inline-flex + align-items:center + justify-content:center + gap:6px + padding:7px 12px + line-height:1`（button/select/label 三种控件统一 flex 垂直居中，图标与文字 6px 间距、文字不贴边）；`.tbtn.on` 高亮；`.tbtn.theme` 16px 圆形色点，.on 加 outline
- `select.tbtn`：与按钮同高同 padding，文字垂直居中；`label.tbtn`：cursor:pointer，内 `input[type=checkbox]` 14×14 + margin:0 + flex:0 0 auto（复选框与文字 gap 6px 垂直居中，不与文字贴靠）
- 禁止「文字直接贴控件边缘/控件内文字上下偏斜」的写法：一律走 flex + gap 规则
- `.pageno`：left:18px bottom:16px 胶囊页码
- `.nav`：左右 46px 圆钮，**默认 opacity:0 不常驻**；`body:hover .nav{ opacity:1 }` 鼠标在页面内才显现；`@media (hover:none){ .nav{ opacity:1 } }` 触屏保持可见；hover 时边框/文字变 accent 加发光
- `.hint`：底部居中 11px 键位提示
- `.help-mask`：全屏遮罩（open 类显示）；`.help-panel` 内 kbd 键帽表格列全部热键 + `.help-note` 说明截图/复制只含主体、全屏自动隐藏操作元素、?shot 全量截图用法
- `#copyMask`：选页复制面板；`#shotMask`：选页截图面板——两面板结构同款，均复用 help-mask 遮罩类（全屏自动隐藏）；`.copy-panel` 430px 宽纵向 flex（头部标题+全选 / 中部 `.cp-list` 页清单滚动区 / 底部取消+执行 / 末尾 .help-note 小字提示）；`.cp-item` 行 = checkbox + 页码（accent 加粗）+ 首行预览（muted 单行省略），hover 用 --tag-bg；`.cp-foot .tbtn.primary` 主按钮 accent 底；勾选项截图面板用 `.sp-check`、复制面板用 `.cp-check`，各面板容器内自查询互不干扰
- `#tplMask`：模板应用面板——`.tpl-panel` 640px 宽纵向 flex（头部标题+「先预览本页」提示 / 中部 `.tpl-cards` 3 列模板卡（mini 结构示意图 + 名 + 描述，当前模板 .on 高亮，点击选中，预览中点击即时换预览）/ `.tpl-scope` 范围 radio 胶囊（全部页面/仅本页/选择页面，选「选择页面」展开 `.cp-list` 页清单勾选，label.sel 高亮当前）/ 底部取消 + 「👁 预览本页」+ 应用模板（N 页）主按钮 / 末尾 .help-note 说明标题自动映射与切回 classic 恢复）；与选页复制/截图面板互斥打开；Esc/点遮罩/取消关闭（关闭时自动还原预览态）
- `#addMask`：新增页面板——`.add-panel` 560px 宽（头部标题+「插在当前页之后」提示 / `.add-cards` 4 列 16 版式 mini 卡 / 底部取消）；点版式卡即 pushUndo + 插页 + 跳新页

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
function next(){ if (cur < N - 1) leaveThenGo(cur + 1); else if (chkLoop.checked) leaveThenGo(0); }
function prev(){ if (cur > 0) leaveThenGo(cur - 1); else if (chkLoop.checked) leaveThenGo(N - 1); }
```
- **离场引擎**：`leaveThenGo(i)` = leaving 防抖；当前页无 `[data-anim-leave]:not(none)` 或 deck `data-anim="off"` 时直切 `go(i)`；否则 slide 加 `.leaving` 类触发 CSS 离场（0.45s），并重置节点 animation 重播，480ms 后移除类再 `go(i)`；next/prev/自动播放间隔/键盘/缩略图/数字键/Home/End/data-goto/hashchange 全走 leaveThenGo
- **自动播放**：startPlay 里 `var sec = parseInt(selInterval.value, 10); if (!isFinite(sec) || sec < 1) sec = 5;` 兜底（防 NaN 连翻）；到末页未勾循环则 stopPlay；播放时按钮变「⏸ 暂停」加 .on
- **键盘**：`document.addEventListener('keydown', …)`，先 `if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;`（防在控件内误触）；Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y 组合判定放在 `if (e.repeat) return;` 之前（按住可连续撤销，主流编辑器行为，弹层面板打开时 anyMaskOpen 忽略）；其余按键 `if (e.repeat) return;`（长按只响应首次）
- **热键表**：
  - ←/→/↑/↓/PageUp/PageDown：上/下一页；Space：下一页（均 preventDefault）
  - Home/End：首页/末页；1-9：数字直达对应页（`/^[1-9]$/.test(e.key)`）
  - P：播放/暂停；S：截图本页；C：复制本页；F：全屏；G：右侧边栏（▤ 页面管理：新页/复页/排序/删页/跳转 + ⚙ 动画与工具）；?：说明弹层；Esc：关弹层 + 退全屏
  - Ctrl+Z：撤销；Ctrl+Shift+Z / Ctrl+Y：重做（弹层面板打开时忽略）
- **全屏**：`toggleFull()` = fullscreenElement 存在则 exitFullscreen，否则 document.documentElement.requestFullscreen
- **主题作用域**：主题面板范围 radio 选「全部页面」时点色点 → `documentElement.setAttribute('data-theme', name)` + 遍历 slides 移除所有 slide 级 data-theme；选「仅本页」时 → `slides[cur].setAttribute('data-theme', name)`（仅当前页变色）；`?theme=biz` 参数走全局；面板色点 .on 态按 activeThemeName()（当前范围下的生效主题）显示
- **模板应用**：TPLS 十七套元信息（id/name/ic/ds/mini 结构示意图）；applyTpl(slide, tpl) = ensureOrigin 存档首次 innerHTML → 恢复语义态 → 挂 data-template（classic 则移除属性）→ 按需 wrapTimeline/wrapKeynote/wrapMagazine/wrapSteps/wrapPoster/wrapVintage/wrapFinance（封面/结束页/目录页 isSpecialPage 保护不包装；blueprint/education/executive/metro/bento/dark/nature/stats 纯 CSS 无包装器）；applyScope(tpl, scope, selected) 按范围应用返回页数；初始化时每页 data-template 声明自动跑 applyTpl 生效；`?tpl=xxx` 参数全局应用（只认 TPLS 内 id）
- **标题自动映射**：包装器从语义节点取内容重建模板结构——timeline 节点标题=卡片标题、keynote 大观点=页标题、magazine 分栏标题=页标题；内容一条不丢
- **页内连接**：deck 上事件委托，`closest('[data-goto]')` 跳页；目录条目/任意元素都可用
- **外部链接**：任意 `<a href="https://…">` 正常打开，不拦截
- **hash 定位**：`#/N` 定位第 N 页，hashchange 监听；**初始跳页用 jumped 标记**——`var jumped = false; if (sm){ go(parseInt(sm[1],10)-1); jumped = true; } … 最后 if (!jumped) go(0);`（init 末尾无条件 go(0) 会覆盖 ?shot 跳页，必须跳过）
- **?shot 参数**：`?shot=N` 定位第 N 页（配合 Chrome headless 逐页截图）；`?shot=all` 不跳页（外部逐页访问 ?shot=N 抓全量）；`?theme=biz` 切主题（只认 tech/biz/mono/warm）

## 7. 截图与复制（只含主体，是硬性要求）

- **复制**（按钮收纳在边栏 ⚙ 工具 Tab，热键 C 照常）：`btnCopy` 取 `slides[cur].innerText`，压缩连续空行为单行、trim；clipboard.writeText 主路径 + textarea/execCommand 兜底；成功按钮变「✓ 已复制」1.5s
- **选页复制**：`btnCopyMulti` 打开 `#copyMask` 面板——`openCopyPanel` 按页生成 `.cp-item` 清单（checkbox 默认全选 + 页码 + 首行文字预览 escapeHtml）；`cpAll` 全选/清空联动、勾选变化实时更新按钮计数「复制所选（N 页）」；`copySelectedPages` 收集选中页各自 innerText 压缩 trim，按「【第 N 页】」分隔 join '\n\n' 后走 fallbackCopy；默认全选时一次点击=复制全部页文字；Esc/点遮罩/取消关闭；文字通道不含图片（图片走截图）
- **截图（零依赖 SVG foreignObject → Canvas → PNG 2x，本页/选页共用 `renderShot(i, cb)`）**：
  1. `clone = slides[i].cloneNode(true)`，移除 dim 类、加 `active` 与 `shot-clone` 类，inline 重设 position/inset/padding/display/opacity/visibility/transform/transition 为终态
  2. 收集页面全部 `<style>` 文本拼进克隆 wrap 的 style，末尾追加 shot-clone 覆盖规则（`.shot-clone [data-anim], .shot-clone [data-anim-emphasis], .shot-clone [data-anim-leave]{ opacity:1 !important; animation:none !important; }`，动画元素以终态全部入图）；wrap 设 `data-theme` 全局主题兜底 + `width:1280px;height:720px;background:var(--bg)`（slide 级 data-theme 随克隆自然携带，单页主题页无需处理）
  3. 序列化前把 wrap.outerHTML 空标签自闭合（回调正则 `replace(/<(br|hr|img|input|meta|link|source|wbr|col)\b([^>]*)>/gi, …)` 补 `/`）——foreignObject 要求 XHTML 良构，`<br>` 等不闭合会 XML 解析失败；再 `svg(1280×720 viewBox) + foreignObject(1280×720)` 装 wrap，`new XMLSerializer().serializeToString(svg)` → `data:image/svg+xml;charset=utf-8,` + encodeURIComponent 赋给 `new Image()`
  4. onload 里 `canvas 2560×1440`（2 倍清晰度）drawImage 后 `a.download = 'slide-页码-主题.png'` 点击下载并 `cb()` 接力；onerror 走 `cb(err)` 同样接力不断链；单页成功按钮变「✓ 已保存」1.5s；onerror 变「✗ 失败」
  - **克隆只取 slide 本体**——工具栏/页码/箭头/提示在 slide 之外，天然不入图；slide 内也不得放任何操作元素
  - slide 级 `data-template` 属性随克隆自然入图（CSS 前缀选择器在收集的 style 文本中生效），模板包装后的 DOM 结构即截图内容，无需特殊处理
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
