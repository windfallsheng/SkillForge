# Design System Reference

本文件提供文章 HTML 的设计系统：CSS 变量 + 组件类名 + 关键样式片段。执行时按需复制到 `<style>` 中，并根据文章内容裁剪不需要的组件。

> ⚠️ **真相源铁律**：本文件与 `resources/reference.html` 构成双轨——reference.html 是 A 款完整组装示范（骨架 + 18 组件实例 + 换肤坞），本文件提供六款版式参数与裁剪说明。生成 / 修复任何 A 款页面前必须先 Read 两份，**冲突以 reference.html 为准**；修改 CSS 时两份必须同步更新。

## 0. 风格菜单（构建前按文章气质选一款）

六款版式范式，每款给适用气质与关键参数。选定后其余章节的组件按需裁剪。字体白名单锁死为 Roboto + 思源黑体，任何风格都不许引入其他字体。

| 风格 | 适用气质 | 关键参数 |
|:---|:---|:---|
| **A. 暗色封面长文风**（默认款） | 科技文、产品文、深度技术长文 | 深色渐变 hero + 浅灰 `--bg:#f6f8fb` 正文 + 彩色圆角组件（第 2-5 节全套）。主题色四款命名主题（第 1 节 `[data-theme]` 块）：tech 科技蓝 `#2563eb`（默认）/ gold 暖棕金 `#b45309` / forest 墨绿 `#0f766e` / plum 梅紫 `#7c3aed`；生成时按 THEME 配置定默认（写入 `<html data-theme>`），页面右下角换肤坞随点随换 |
| **B. 文艺排版风** | 散文、人物稿、随笔、书评 | 字体仍为思源黑体（**不改宋体**）；背景米白 `#faf7f1`；封面极简：居中大标题 + 细线 + 作者名，无深色块；行距 1.9、字号 17px、栏宽 680px；`p:first-of-type::first-letter{font-size:3em;float:left}` 首字下沉；引用用居中大字号灰字，分割用 `1px solid #e8e0d0` 细线；禁彩色卡片与重阴影——文艺感全靠排版营造 |
| **C. 极简白** | 干货教程、方法论、SOP | `--bg:#ffffff`；封面白底大黑标题 + 蓝字点缀；组件只用白卡细边框 `1px solid var(--line)`，单色点缀 `#2563eb`，不用多彩色系统；行距 1.8 |
| **D. 终端极客风** | 硬核技术文、命令行主题 | 全页暗色 `--bg:#0d1117`，正文 `#c9d1d9`，强调绿 `#7ee787`/蓝 `#58a6ff`；封面命令行提示符风格（`$` 前缀标题 + ASCII 装饰）；组件边框 `#30363d`、圆角 ≤8、阴影弱化；代码块为主导视觉；`--mono` 仍为思源黑体（禁等宽商业字体） |
| **E. 卡片流** | 清单体、科普、碎片知识 | `--bg:#f5f6f8`；内容全卡片化（白卡圆角 16 + `--shadow-sm` + emoji 图标领衔）；封面渐变卡 + 大 emoji；段间距拉大 |
| **F. 报纸分栏风** | 深度报道、行业观察 | 白底；正文双栏 `column-count:2;column-gap:40px`（小屏单栏）；封面特大黑标题 + 摘要 + 细双线；小标题黑体 + 上下细线；表格跨栏 `column-span:all` |

选择原则：科技/产品长文默认 A；文艺散文 B；教程干货 C；硬核技术 D；科普清单 E；报道评论 F。拿不准时用 AskUserQuestion 让用户挑（每款附一句话气质描述）。

主题换肤坞只随 A 款出现：A 款生成时按 THEME 配置写 `<html data-theme>`，页面右下角四色点随时切换；B/C/D/E/F 五款本色锁定（D 深色极客、C 纯白等定式），不配坞。

## 1. 字体与设计变量（必用）

```css
@font-face { font-family:'Roboto'; font-style:normal; font-weight:400; font-display:swap; src:url('assets/fonts/roboto-latin-400-normal.woff2') format('woff2'); }
@font-face { font-family:'Roboto'; font-style:normal; font-weight:500; font-display:swap; src:url('assets/fonts/roboto-latin-500-normal.woff2') format('woff2'); }
@font-face { font-family:'Roboto'; font-style:normal; font-weight:700; font-display:swap; src:url('assets/fonts/roboto-latin-700-normal.woff2') format('woff2'); }
@font-face { font-family:'Roboto'; font-style:normal; font-weight:900; font-display:swap; src:url('assets/fonts/roboto-latin-900-normal.woff2') format('woff2'); }

:root{
  --blue:#2563eb; --blue-bg:#ebf0ff; --blue-line:#a1bdfa; /* 多彩组件固定蓝（layers/fnode/ask/mode 等），不随主题变 */
  --red:#e24b4a; --red-bg:#fcebeb; --red-line:#f09595; --red-dark:#a32d2d;
  --green:#16a34a; --green-bg:#ecfdf5; --green-line:#86efac; --green-dark:#15803d;
  --purple:#7c3aed; --purple-bg:#f5f0ff; --purple-line:#c4b5fd; --purple-dark:#6d28d9;
  --teal:#0d9488; --teal-bg:#f0fdfa; --teal-line:#5eead4;
  --orange:#ea580c; --orange-bg:#fff7ed; --orange-line:#fdba74;
  --ink:#1f2937; --ink-2:#4b5563; --ink-3:#6b7280; --ink-4:#9ca3af;
  --bg:#f6f8fb; --card:#ffffff; --line:#e5e7eb;
  /* ── 主题色令牌（tech 默认值；gold/forest/plum 见下方 [data-theme] 块；A 款强调色一律引用 --accent 家族，禁止硬编码）── */
  --accent:#2563eb; --accent-bg:#ebf0ff; --accent-line:#a1bdfa; --accent-ink:#1e4ad6;
  --hero-base:linear-gradient(160deg,#0b1220 0%,#0e1a33 45%,#131c3a 100%);
  --hero-glow:radial-gradient(1200px 600px at 15% -10%,rgba(96,165,250,.35),transparent 55%),radial-gradient(1000px 500px at 110% 30%,rgba(167,139,250,.30),transparent 55%),radial-gradient(900px 700px at 50% 120%,rgba(45,212,191,.22),transparent 60%);
  --title-grad:linear-gradient(90deg,#7dd3fc,#a5b4fc,#c4b5fd);
  --kicker-color:#93c5fd; --kicker-bg:rgba(59,130,246,.14); --kicker-line:rgba(96,165,250,.35);
  --shadow-sm:0 1px 3px rgba(17,24,39,.06),0 1px 2px rgba(17,24,39,.04);
  --shadow-md:0 4px 12px rgba(17,24,39,.08),0 2px 4px rgba(17,24,39,.04);
  --shadow-lg:0 12px 32px rgba(17,24,39,.12),0 4px 8px rgba(17,24,39,.06);
  --sans:'Roboto','Source Han Sans SC';
  --mono:'Source Han Sans SC';
}
/* ── 三款独立主题：html[data-theme] 运行时切换（A 款专用）── */
[data-theme="gold"]{
  --accent:#b45309; --accent-bg:#fdf4e7; --accent-line:#f0d5b5; --accent-ink:#92400e;
  --hero-base:linear-gradient(160deg,#171009 0%,#241708 45%,#2e1f0d 100%);
  --hero-glow:radial-gradient(1200px 600px at 15% -10%,rgba(251,191,36,.30),transparent 55%),radial-gradient(1000px 500px at 110% 30%,rgba(251,146,60,.26),transparent 55%),radial-gradient(900px 700px at 50% 120%,rgba(45,212,191,.16),transparent 60%);
  --title-grad:linear-gradient(90deg,#fcd34d,#fdba74,#fca5a5);
  --kicker-color:#fde68a; --kicker-bg:rgba(251,191,36,.12); --kicker-line:rgba(251,191,36,.35);
}
[data-theme="forest"]{
  --accent:#0f766e; --accent-bg:#e6f4f2; --accent-line:#a7e8dd; --accent-ink:#115e59;
  --hero-base:linear-gradient(160deg,#071512 0%,#0a1f1a 45%,#0d2a22 100%);
  --hero-glow:radial-gradient(1200px 600px at 15% -10%,rgba(52,211,153,.30),transparent 55%),radial-gradient(1000px 500px at 110% 30%,rgba(45,212,191,.28),transparent 55%),radial-gradient(900px 700px at 50% 120%,rgba(96,165,250,.16),transparent 60%);
  --title-grad:linear-gradient(90deg,#6ee7b7,#5eead4,#93c5fd);
  --kicker-color:#a7f3d0; --kicker-bg:rgba(52,211,153,.12); --kicker-line:rgba(52,211,153,.35);
}
[data-theme="plum"]{
  --accent:#7c3aed; --accent-bg:#f5f0ff; --accent-line:#d5c7fd; --accent-ink:#6d28d9;
  --hero-base:linear-gradient(160deg,#120b20 0%,#1a1133 45%,#221540 100%);
  --hero-glow:radial-gradient(1200px 600px at 15% -10%,rgba(167,139,250,.34),transparent 55%),radial-gradient(1000px 500px at 110% 30%,rgba(196,181,253,.28),transparent 55%),radial-gradient(900px 700px at 50% 120%,rgba(45,212,191,.16),transparent 60%);
  --title-grad:linear-gradient(90deg,#c4b5fd,#a5b4fc,#7dd3fc);
  --kicker-color:#ddd6fe; --kicker-bg:rgba(167,139,250,.14); --kicker-line:rgba(167,139,250,.35);
}
/* ── 主题换肤坞（A 款页面专用）：右下角四色点随点随换，记忆上次选择；打印与 ?shot 截图模式隐藏 ── */
.theme-dock{position:fixed;right:18px;bottom:18px;z-index:1001;display:flex;gap:8px;padding:8px 10px;border-radius:999px;background:rgba(255,255,255,.92);border:1px solid var(--line);box-shadow:0 4px 18px rgba(17,24,39,.15)}
.theme-dock .th-dot{width:22px;height:22px;border-radius:50%;cursor:pointer;border:2px solid transparent;padding:0;transition:transform .15s ease,border-color .15s ease}
.theme-dock .th-dot:hover{transform:scale(1.18)}
.theme-dock .th-dot.on{border-color:var(--ink)}
.theme-dock .th-dot[data-theme="tech"]{background:#2563eb}
.theme-dock .th-dot[data-theme="gold"]{background:#b45309}
.theme-dock .th-dot[data-theme="forest"]{background:#0f766e}
.theme-dock .th-dot[data-theme="plum"]{background:#7c3aed}
@media print{.theme-dock{display:none}}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--sans);background:var(--bg);color:var(--ink);line-height:1.75;font-size:16px}
.wrap{max-width:880px;margin:0 auto;padding:0 28px}
section{padding:56px 0 8px}
h1,h2,h3,h4{line-height:1.35;font-weight:700}
p{margin:0 0 1.1em}
```

> 字体纯化原则（绝对纯粹）：`--sans` 仅 `'Roboto','Source Han Sans SC'`；`--mono` 仅 `'Source Han Sans SC'`。任何别名（Noto Sans SC、思源黑体）与兜底（苹方/雅黑/系统字体/sans-serif）一律禁止——未装思源黑体时宁可缺字，不可静默回退，截图抽检即能发现。SVG 内 font-family 同样仅两字体。
> 主题色纯化原则（A 款）：组件强调色一律 `var(--accent)` / `var(--accent-bg)` / `var(--accent-line)` / `var(--accent-ink)`，封面一律 `var(--hero-glow)` / `var(--hero-base)` / `var(--title-grad)` / `var(--kicker-*)`——换肤坞才能随点随换；多彩组件（layers/fnode/ask/mode 等）保留固定色系，不随主题变。
> 纯白背景版：把 `--bg:#f6f8fb` 改为 `--bg:#ffffff`（深色 hero/ending/term 组件不受影响）。

## 2. 封面 hero（深色渐变 + 流程节点）

```css
.hero{position:relative;overflow:hidden;color:#fff;padding:96px 0 88px;text-align:center;
  background:var(--hero-glow),var(--hero-base)}
.hero::before{content:"";position:absolute;inset:0;background-image:
  linear-gradient(rgba(148,163,184,.05) 1px,transparent 1px),
  linear-gradient(90deg,rgba(148,163,184,.05) 1px,transparent 1px);
  background-size:44px 44px;pointer-events:none}
.hero .inner{position:relative;z-index:2}
.hero .kicker{display:inline-flex;align-items:center;gap:8px;font-size:13px;letter-spacing:.14em;color:var(--kicker-color);
  background:var(--kicker-bg);border:1px solid var(--kicker-line);padding:7px 18px;border-radius:999px;margin-bottom:30px}
.hero h1{font-size:44px;font-weight:900;margin-bottom:18px}
.hero h1 .grad{background:var(--title-grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.hero .sub{font-size:19px;color:#cbd5e1;margin-bottom:12px}
.hero .flow{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:44px;flex-wrap:wrap}
.hero .flow .node{display:flex;align-items:center;gap:8px;background:rgba(30,41,59,.7);border:1px solid rgba(148,163,184,.3);
  padding:9px 18px;border-radius:12px;font-size:14px;color:#e2e8f0}
.hero .flow .node .n{width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;
  font-size:12px;font-weight:700;color:#fff;background:var(--title-grad)}
.hero .flow .arrow{color:#64748b;font-size:18px}
.hero .tagline{margin-top:34px;font-size:15px;color:#94a3b8;letter-spacing:.08em}
```

## 3. 章节标题 + 通用卡片

```css
.sec-head{display:flex;align-items:baseline;gap:14px;margin:0 0 26px;padding-bottom:14px;border-bottom:1px solid var(--line)}
.sec-head .no{font-weight:900;font-size:30px;color:var(--accent);letter-spacing:-.02em;min-width:52px}
.sec-head h2{font-size:26px}
.sec-head .en{font-size:12px;letter-spacing:.12em;color:var(--ink-4);text-transform:uppercase;margin-left:auto}
.lead{font-size:17px;color:var(--ink-2);margin-bottom:28px}
.h3{font-size:19px;margin:34px 0 14px;display:flex;align-items:center;gap:10px}
.h3::before{content:"";width:4px;height:18px;border-radius:2px;background:var(--accent)}
.card{background:var(--card);border-radius:16px;box-shadow:var(--shadow-sm);border:1px solid var(--line)}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
@media(max-width:720px){.grid-2,.grid-3{grid-template-columns:1fr}}
```

## 4. 图表组件映射表

| 源文档图表类型 | 使用组件（类名） | 关键样式要点 |
|:---|:---|:---|
| 左右对比（问题 vs 方案） | `.vs-panel`（bad/good 两栏） | 红/绿渐变底、虚线分隔、圆点前缀 |
| 升级/演变图（A→B） | `.upgrade`（vibe/spec 双栏 + mid 箭头） | 底部渐变色带 band、✓/✕ 前缀 |
| 强调数据/警示 | `.callout`（大数字 + 说明） | 左边框 5px 主题色 |
| 原则/铁律条目 | `.rules` + `.rule`（编号角标） | hover 上浮 |
| 数据对比表 | `.tbl-wrap` + `table` | `td{vertical-align:middle}`、Spec 列加蓝底高亮 |
| 分层架构图 | `.layers` + `.layer`（l1/l2/l3） | 蓝绿紫三层、fdoc 文档卡、sync-label 竖排同步线 |
| 特性/优势卡片墙 | `.adv` + `.a`（2×3 或 3×3） | 图标色块 ic-b/g/p/o/t/r |
| 暗色功能面板 | `.dark-panel` + `.ask-card` | 深蓝渐变 + 点阵背景 + 彩色描边卡 |
| 流程图（多步骤） | `.flowchart` + `.frow` + `.fnode` | 彩色节点 tag、反向行 dashed |
| 层级递进（1→2→3） | `.modes` + `.mode`（m1/m2/m3） | 圆形数字 badge、箭头注释 |
| 类型卡片网格 | `.ttypes` + `.tt`（5 列） | mono 类型名 + 文档数角标 |
| 目录/终端展示 | `.term` / `.dirtree` | 深底 mono、两列注释对齐 |
| 推荐/不推荐 | `.rec` + `.rc`（good/bad） | ✓/✕ 前缀列表 |
| 命令安装步骤 | `.cmd-block` | 深底 mono、`<span class="p">` 命令、`.c` 注释 |
| 对话/聊天记录 | `.chat` + `.msg`（u/a 气泡） | 左右气泡 + who 标签 |
| 链接/仓库卡片 | `.oss` + `.o` | logo 色块 + mono URL |
| 结尾升华块 | `.ending` | 深蓝渐变 + 渐变标题 + nospec 大按钮 |
| 作者介绍 | `.author` | avatar 色块 + role 标签 |

## 5. 常用组件样式片段（按需复制）

### 对比双卡 .vs-panel

```css
.vs-panel{display:grid;grid-template-columns:1fr 1fr;gap:0;border-radius:18px;overflow:hidden;box-shadow:var(--shadow-md);border:1px solid var(--line);background:#fff}
.vs-panel .side{padding:28px 30px 24px}
.vs-panel .side.bad{background:linear-gradient(180deg,#fff 0%,#fff7f5 100%)}
.vs-panel .side.good{background:linear-gradient(180deg,#fff 0%,#f4fcf7 100%);border-left:1px solid var(--line)}
.vs-panel h4{font-size:17px;margin-bottom:18px;display:flex;align-items:center;gap:9px}
.vs-panel .side.bad h4{color:var(--red-dark)}
.vs-panel .side.good h4{color:var(--green-dark)}
.vs-panel h4 .ico{width:26px;height:26px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-size:13px}
.vs-panel .bad h4 .ico{background:var(--red-bg);border:1px solid var(--red-line)}
.vs-panel .good h4 .ico{background:var(--green-bg);border:1px solid var(--green-line)}
.vs-panel ul{list-style:none}
.vs-panel li{display:flex;gap:11px;align-items:flex-start;padding:9px 0;border-bottom:1px dashed var(--line);font-size:14.5px;color:var(--ink-2)}
.vs-panel li:last-child{border-bottom:none}
.vs-panel li::before{content:"";flex:none;width:7px;height:7px;border-radius:50%;margin-top:8px}
.vs-panel .bad li::before{background:var(--red)}
.vs-panel .good li::before{background:var(--green)}
```

### 表格 .tbl-wrap

```css
.tbl-wrap{overflow-x:auto;border-radius:14px;box-shadow:var(--shadow-sm);border:1px solid var(--line);background:#fff}
table{border-collapse:collapse;width:100%;font-size:14px;min-width:640px}
th{background:#f0f4fb;color:#334e7e;font-weight:700;text-align:left;padding:12px 16px;border-bottom:2px solid #dbe4f5;white-space:nowrap;font-size:13.5px}
td{padding:11px 16px;border-bottom:1px solid var(--line);color:var(--ink-2);vertical-align:middle}
tr:last-child td{border-bottom:none}
tbody tr:hover{background:#f8fafc}
td.ok{color:var(--green);text-align:center;font-size:15px}
td.no{color:#d1d5db;text-align:center}
td.hl{font-weight:700;color:var(--ink)}
.tbl-cap{font-size:13px;color:var(--ink-3);margin:10px 0 0;text-align:center}
```

### 分层架构 .layers

```css
.layers{position:relative;padding-right:56px}
.layer{border-radius:14px;margin-bottom:20px;overflow:hidden;border:1px solid}
.layer .h{color:#fff;padding:10px 20px;font-size:15px;font-weight:700;display:flex;justify-content:space-between;align-items:center;gap:10px}
.layer .h .d{font-size:12px;font-weight:400;opacity:.85}
.layer .body{padding:16px;display:grid;gap:12px}
.layer.l1{border-color:var(--blue-line);background:var(--blue-bg)}
.layer.l1 .h{background:linear-gradient(90deg,#1d4ed8,#2563eb)}
.layer.l2{border-color:#6ee7b7;background:var(--green-bg)}
.layer.l2 .h{background:linear-gradient(90deg,#15803d,#16a34a)}
.layer.l3{border-color:var(--purple-line);background:var(--purple-bg)}
.layer.l3 .h{background:linear-gradient(90deg,#6d28d9,#7c3aed)}
.layer.l1 .body{grid-template-columns:repeat(4,1fr)}
.layer.l2 .body{grid-template-columns:repeat(3,1fr)}
.layer.l3 .body{grid-template-columns:repeat(3,1fr)}
.fdoc{background:#fff;border-radius:10px;padding:12px 10px;text-align:center;box-shadow:var(--shadow-sm)}
.fdoc .f{font-size:13px;font-weight:700;font-family:var(--mono)}
.fdoc .d{font-size:11.5px;margin-top:2px}
.layer.l1 .fdoc{border:1px solid var(--blue-line)}.layer.l1 .fdoc .f{color:#1e4ad6}
.layer.l2 .fdoc{border:1px solid var(--green-line)}.layer.l2 .fdoc .f{color:#15803d}
.layer.l3 .fdoc{border:1px solid var(--purple-line)}.layer.l3 .fdoc .f{color:#6d28d9}
.fdoc.sync{border-style:dashed;background:#ede9fe}
.layer-arrow{display:flex;justify-content:center;color:var(--ink-3);font-size:18px;margin:-6px 0 14px}
.sync-label{position:absolute;right:0;top:0;bottom:0;width:52px;display:flex;align-items:center;justify-content:center}
.sync-label .vline{border-left:2px dashed var(--purple-line);height:88%;display:flex;align-items:center}
.sync-label span{writing-mode:vertical-rl;font-size:12px;color:#8b5cf6;letter-spacing:.3em;background:var(--bg);padding:8px 0}
```

### 升级图 .upgrade / 铁律 .rules / 警示 .callout

```css
.upgrade{display:grid;grid-template-columns:1fr 64px 1fr;gap:0;align-items:stretch}
.upgrade .col{border-radius:16px;padding:24px 24px 0;position:relative;padding-bottom:52px}
.upgrade .col.vibe{background:var(--red-bg);border:1.5px solid var(--red-line)}
.upgrade .col.spec{background:var(--green-bg);border:1.5px solid var(--green-line)}
.upgrade .col .ttl{font-size:19px;font-weight:900;margin-bottom:2px}
.upgrade .col.vibe .ttl{color:var(--red-dark)}
.upgrade .col.spec .ttl{color:var(--green-dark)}
.upgrade .col .st{font-size:13px;margin-bottom:16px}
.upgrade .col .chip{background:#fff;border-radius:10px;padding:11px 14px;font-size:14px;text-align:center;margin-bottom:16px;box-shadow:var(--shadow-sm)}
.upgrade .col ul{list-style:none;margin:0 0 18px}
.upgrade .col li{font-size:13.5px;padding:6.5px 0 6.5px 22px;position:relative;color:var(--ink-2)}
.upgrade .col.vibe li::before{content:"✕";position:absolute;left:0;top:7px;color:var(--red);font-weight:700;font-size:12px}
.upgrade .col.spec li::before{content:"✓";position:absolute;left:0;top:7px;color:var(--green);font-weight:900;font-size:12px}
.upgrade .col .band{position:absolute;left:0;right:0;bottom:0;border-radius:0 0 14px 14px;padding:12px;text-align:center;color:#fff;font-size:14.5px;font-weight:700}
.upgrade .col.vibe .band{background:linear-gradient(90deg,#dc2626,#e24b4a)}
.upgrade .col.spec .band{background:linear-gradient(90deg,#16a34a,#22c55e)}
.upgrade .mid{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px}
.upgrade .mid .arrow{width:40px;height:40px;border-radius:50%;background:#fff;border:1.5px solid var(--line);display:flex;align-items:center;justify-content:center;color:var(--ink-3);font-size:17px;box-shadow:var(--shadow-sm)}
.upgrade .mid span{font-size:12px;color:var(--ink-3);writing-mode:vertical-lr;letter-spacing:.2em}

.callout{display:flex;gap:16px;align-items:center;background:linear-gradient(90deg,#fef2f2,#fff);border:1px solid var(--red-line);border-left:5px solid var(--red);border-radius:14px;padding:20px 26px;margin:26px 0;box-shadow:var(--shadow-sm)}
.callout .big{font-size:34px;font-weight:900;color:var(--red);white-space:nowrap}
.callout p{margin:0;font-size:15px;color:var(--ink-2)}
.callout p b{color:var(--red-dark)}

.rules{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.rule{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:24px 22px;position:relative;box-shadow:var(--shadow-sm);transition:transform .2s}
.rule:hover{transform:translateY(-3px);box-shadow:var(--shadow-md)}
.rule .num{position:absolute;top:16px;right:18px;font-size:34px;font-weight:900;color:var(--line)}
.rule .en{font-size:16px;font-weight:900;color:var(--accent);margin-bottom:8px}
.rule p{font-size:13.5px;color:var(--ink-2);margin:0;line-height:1.7}
```

### 暗色面板 .dark-panel / 流程图 / 模式分级

```css
.dark-panel{background:linear-gradient(160deg,#0f172a,#111c36);border-radius:18px;padding:34px 30px;color:#e2e8f0;box-shadow:var(--shadow-lg);position:relative;overflow:hidden}
.dark-panel::before{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(96,165,250,.09) 1px,transparent 1px);background-size:26px 26px;pointer-events:none}
.dark-panel .dp-title{text-align:center;margin-bottom:6px;font-size:21px;font-weight:700;color:#f1f5f9}
.dark-panel .dp-sub{text-align:center;font-size:13.5px;color:#94a3b8;margin-bottom:28px}
.ask-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;position:relative;z-index:1}
.ask-card{background:rgba(30,41,59,.72);border:1px solid;border-radius:14px;padding:16px 16px 14px}
.ask-card .ac-t{font-weight:700;font-size:15px;margin-bottom:9px;display:flex;align-items:center;gap:8px}
.ask-card .ac-t .dot{width:8px;height:8px;border-radius:50%}
.ask-card .q{font-size:12.5px;color:#94a3b8;margin-bottom:2px}
.ask-card .q code{color:#cbd5e1;background:rgba(148,163,184,.14);padding:1px 6px;border-radius:5px;font-family:var(--mono);font-size:11.5px}
.ask-card .feat{font-size:12px;color:#64748b;margin:8px 0 10px}
.ask-card .btn{display:inline-block;font-size:12px;font-weight:700;color:#fff;padding:4px 12px;border-radius:999px}
.ask-c1{border-color:rgba(45,212,191,.4)}.ask-c1 .ac-t{color:#5eead4}.ask-c1 .dot{background:#2dd4bf}.ask-c1 .btn{background:linear-gradient(90deg,#0d9488,#14b8a6)}
.ask-c2{border-color:rgba(251,146,60,.4)}.ask-c2 .ac-t{color:#fdba74}.ask-c2 .dot{background:#fb923c}.ask-c2 .btn{background:linear-gradient(90deg,#c2410c,#ea580c)}
.ask-c3{border-color:rgba(96,165,250,.4)}.ask-c3 .ac-t{color:#93c5fd}.ask-c3 .dot{background:#60a5fa}.ask-c3 .btn{background:linear-gradient(90deg,#1d4ed8,#3b82f6)}
.ask-c4{border-color:rgba(167,139,250,.4)}.ask-c4 .ac-t{color:#c4b5fd}.ask-c4 .dot{background:#a78bfa}.ask-c4 .btn{background:linear-gradient(90deg,#6d28d9,#8b5cf6)}

.flowchart{background:#fff;border:1px solid var(--line);border-radius:16px;padding:26px;box-shadow:var(--shadow-sm)}
.flowchart .fc-title{text-align:center;font-weight:700;font-size:17px;margin-bottom:20px}
.frow{display:flex;align-items:center;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:8px}
.fnode{padding:9px 15px;border-radius:10px;font-size:13px;font-weight:500;border:1.5px solid;white-space:nowrap}
.fnode.tag{font-weight:700}
.farr{color:var(--ink-3);font-size:15px}
.frow.rev .fnode{border-style:dashed}
.f-tag-f{color:#1d4ed8;border-color:#93c5fd;background:var(--blue-bg)}
.f-node-b{color:#0369a1;border-color:#7dd3fc;background:#f0f9ff}
.f-node-p{color:#6d28d9;border-color:var(--purple-line);background:var(--purple-bg)}
.f-node-g{color:#15803d;border-color:#86efac;background:var(--green-bg)}
.f-node-y{color:#b45309;border-color:#fcd34d;background:#fefce8}
.f-node-r{color:#b91c1c;border-color:#fca5a5;background:var(--red-bg)}
.flow-principle{margin-top:18px;background:linear-gradient(90deg,#eff6ff,#eef2ff);border:1px solid #bfdbfe;border-radius:10px;padding:11px 16px;text-align:center;font-size:13.5px;color:#1e3a8a;font-weight:500}

.modes{display:flex;flex-direction:column;gap:0;max-width:680px;margin:0 auto}
.mode{border-radius:14px;padding:16px 22px 16px 56px;position:relative;border:1px solid;box-shadow:var(--shadow-sm)}
.mode .badge{position:absolute;left:16px;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px}
.mode .mt{font-weight:700;font-size:15.5px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.mode .mt .lbl{font-size:12px;font-weight:700;color:#fff;padding:3px 14px;border-radius:999px;white-space:nowrap}
.mode .md{font-size:13px;margin-top:4px}
.mode.m1{background:var(--blue-bg);border-color:var(--blue-line)}.mode.m1 .badge{background:var(--blue)}.mode.m1 .mt{color:#1e4ad6}
.mode.m2{background:var(--green-bg);border-color:var(--green-line)}.mode.m2 .badge{background:var(--green)}.mode.m2 .mt{color:var(--green-dark)}
.mode.m3{background:var(--purple-bg);border-color:var(--purple-line)}.mode.m3 .badge{background:var(--purple)}.mode.m3 .mt{color:var(--purple-dark)}
.mode-arr{display:flex;align-items:center;justify-content:center;gap:10px;color:var(--ink-4);font-size:11.5px;padding:9px 0}
.mode-arr::before,.mode-arr::after{content:"↓";font-size:14px}
```

### 任务卡片 / 目录树 / 推荐 / 命令 / 对话 / 开源 / 结尾 / 作者

```css
.ttypes{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
.tt{background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px 12px;box-shadow:var(--shadow-sm)}
.tt .ttn{font-family:var(--mono);font-weight:700;font-size:13px;color:var(--accent);margin-bottom:5px}
.tt .tcount{font-size:10.5px;color:var(--ink-4);float:right;font-family:var(--sans)}
.tt p{font-size:12px;color:var(--ink-3);margin:0;line-height:1.6}

.dirtree{background:#0f172a;border-radius:14px;padding:22px 28px;font-family:var(--mono);font-size:13.5px;line-height:2.1;color:#cbd5e1;box-shadow:var(--shadow-md);overflow-x:auto}
.dt-row{display:grid;grid-template-columns:minmax(320px,1.35fr) 1fr;gap:20px}
.dt-row .dt-cmt{color:#64748b;font-family:var(--sans);font-size:12.5px}
.dt-row .dir{color:#7dd3fc;font-weight:700}
.dt-row .file{color:#e2e8f0}
.dt-row.root .dir{color:#f472b6}
.dt-ind1{padding-left:24px}
.dt-ind2{padding-left:48px}

.rec{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.rec .rc{border-radius:16px;overflow:hidden;border:1px solid;box-shadow:var(--shadow-sm);background:#fff}
.rec .rc .rh{padding:13px 22px;color:#fff;font-weight:700;font-size:16px}
.rec .rc.good{border-color:var(--green-line)}.rec .rc.good .rh{background:linear-gradient(90deg,#15803d,#16a34a)}
.rec .rc.bad{border-color:var(--red-line)}.rec .rc.bad .rh{background:linear-gradient(90deg,#dc2626,#e24b4a)}
.rec .rc ul{list-style:none;padding:14px 22px 18px}
.rec .rc li{font-size:14px;color:var(--ink-2);padding:8px 0 8px 22px;position:relative;border-bottom:1px dashed var(--line)}
.rec .rc li:last-child{border-bottom:none}
.rec .good li::before{content:"✓";position:absolute;left:0;top:8px;color:var(--green);font-weight:900;font-size:13px}
.rec .bad li::before{content:"✕";position:absolute;left:0;top:8px;color:var(--red);font-weight:700;font-size:13px}

.cmd-block{background:#0f172a;border-radius:14px;padding:18px 24px;font-family:var(--mono);font-size:13.5px;line-height:2.1;color:#e2e8f0;box-shadow:var(--shadow-md);overflow-x:auto}
.cmd-block .p{color:#f472b6}
.cmd-block .c{color:#94a3b8}
.cmd-block .k{color:#7dd3fc}

.chat{background:#fff;border:1px solid var(--line);border-radius:16px;padding:24px 26px;box-shadow:var(--shadow-sm)}
.chat .chat-title{font-weight:700;font-size:16px;margin-bottom:18px}
.msg{max-width:86%;border-radius:13px;padding:10px 15px;font-size:13.5px;margin-bottom:12px;line-height:1.65}
.msg .who{font-size:11.5px;font-weight:700;opacity:.65;margin-bottom:2px}
.msg.u{background:var(--accent-bg);border:1px solid var(--accent-line);margin-left:auto;border-bottom-right-radius:3px;color:var(--accent-ink)}
.msg.a{background:#f8fafc;border:1px solid var(--line);border-bottom-left-radius:3px;color:var(--ink-2)}

.oss{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.oss .o{display:flex;align-items:center;gap:14px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:18px 20px;box-shadow:var(--shadow-sm);text-decoration:none}
.oss .o .logo{width:42px;height:42px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:17px;color:#fff;flex:none}
.oss .o .nm{font-weight:700;color:var(--ink);font-size:15px}
.oss .o .url{font-size:12.5px;color:var(--ink-3);font-family:var(--mono)}

.ending{background:linear-gradient(160deg,#0f172a,#111c36);border-radius:20px;color:#e2e8f0;padding:46px 40px;text-align:center;box-shadow:var(--shadow-lg);position:relative;overflow:hidden}
.ending .e-t{position:relative;font-size:26px;font-weight:900;margin-bottom:14px}
.ending .e-t .grad{background:var(--title-grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.ending p{position:relative;color:#94a3b8;font-size:14.5px;max-width:620px;margin:0 auto 22px}
.ending .nospec{position:relative;display:inline-block;font-size:21px;font-weight:900;letter-spacing:.08em;color:#fff;background:linear-gradient(90deg,var(--accent),var(--accent-ink));padding:12px 34px;border-radius:12px;box-shadow:0 8px 26px rgba(37,99,235,.5)}

.author{display:flex;gap:20px;align-items:flex-start;background:#fff;border:1px solid var(--line);border-radius:16px;padding:24px 28px;box-shadow:var(--shadow-sm);margin-bottom:60px}
.author .avatar{width:56px;height:56px;border-radius:14px;flex:none;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:#fff;background:var(--title-grad)}
.author .nm{font-weight:700;font-size:16.5px;margin-bottom:6px}
.author .nm .role{display:inline-block;font-size:11.5px;font-weight:500;color:var(--accent-ink);background:var(--accent-bg);border:1px solid var(--accent-line);padding:2px 10px;border-radius:999px;margin-left:10px;vertical-align:2px}
.author p{font-size:13.5px;color:var(--ink-2);margin:0;line-height:1.7}

.foot{text-align:center;padding:34px 0 44px;color:var(--ink-4);font-size:12.5px}
```

## 6. HTML 骨架模板

```html
<!DOCTYPE html>
<html lang="zh-CN" data-theme="tech">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>文章标题</title>
<style>/* 按需复制上面的变量与组件样式（A 款含四主题 data-theme 块与换肤坞 CSS）；完整组装示范见 resources/reference.html */</style>
</head>
<body>
<div class="hero">…封面…</div>
<div class="wrap">
  <section>…引言…</section>
  <section>
    <div class="sec-head"><span class="no">01</span><h2>章节标题</h2><span class="en">Chapter English</span></div>
    …正文与图表组件…
  </section>
  …更多章节…
  <div class="foot">…页脚…</div>
</div>
<!-- 主题换肤坞（A 款页面专用；data-theme 初始值 = THEME 配置） -->
<div class="theme-dock" id="themeDock">
  <button class="th-dot" type="button" data-theme="tech" title="科技蓝"></button>
  <button class="th-dot" type="button" data-theme="gold" title="暖棕金"></button>
  <button class="th-dot" type="button" data-theme="forest" title="墨绿"></button>
  <button class="th-dot" type="button" data-theme="plum" title="梅紫"></button>
</div>
<script>
/* 主题换肤：html[data-theme] 切换 + 记忆上次选择（localStorage，失败静默）；?shot 截图模式隐藏坞 */
(function(){
  var THEMES=['tech','gold','forest','plum'];
  var dock=document.getElementById('themeDock');
  if(!dock) return;
  if(location.search.indexOf('shot=')!==-1){ dock.style.display='none'; }
  function apply(t){
    document.documentElement.setAttribute('data-theme',t);
    dock.querySelectorAll('.th-dot').forEach(function(d){ d.classList.toggle('on',d.getAttribute('data-theme')===t); });
    try{ localStorage.setItem('sf-article-theme',t); }catch(e){}
  }
  var cur=document.documentElement.getAttribute('data-theme');
  var saved=null;
  try{ saved=localStorage.getItem('sf-article-theme'); }catch(e){}
  if(saved && THEMES.indexOf(saved)!==-1 && saved!==cur){ apply(saved); }
  else{ dock.querySelectorAll('.th-dot').forEach(function(d){ d.classList.toggle('on',d.getAttribute('data-theme')===(cur||'tech')); }); }
  dock.querySelectorAll('.th-dot').forEach(function(d){ d.addEventListener('click',function(){ apply(d.getAttribute('data-theme')); }); });
})();
</script>
</body>
</html>
```
