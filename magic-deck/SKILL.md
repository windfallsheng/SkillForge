---
name: magic-deck
description: 把内容做成 HTML 形态、PPT 体验的魔法幻灯（单文件离线打开、零外部依赖）。内置播放引擎（自动播放/循环/间隔可设/从头或当前播放）、键盘热键（翻页/直达/截图/复制/全屏）、十六套内置模板（经典商务/极简留白/杂志画册/黑金发布/时间线叙事/流程步骤/海报宣传/复古报纸/金融报表/蓝图工程/教学板书/高管简报/扁平磁贴/模块网格/暗夜深色/自然清新，放映时经「🎨 模板」面板随时切换
+ 模板面板「💼 领域」Tab 二十一套成套模板（六分类：教育学术——毕业答辩/开题报告/教学课件；职场商务——年终汇报/竞聘述职/商业计划书/求职简历；企业运营——产品发布/科技发布会/营销方案/企业培训/年会盛典；专业领域——金融分析/医疗科普/法律合规；党政政务——政务汇报/党建汇报；生活场景——餐饮品牌/旅游攻略/节日庆典/公益慈善，一键生成整套页面——封面+目录+内容页+图表页，两段确认可撤销）+ 图表动画五式（柱状生长/折线描画/饼图扇入/仪表扫弧/数字滚动，图表挂 data-anim-chart 翻页自动播放、翻回重放，保留图表自身动画）——可应用到全部页/仅本页/勾选页，支持「预览本页」先看效果再应用，标题自动映射到模板固定位置）、编辑能力（撤销/重做 Ctrl+Z、右侧页面管理边栏：缩略图跳页/新页/复页/排序/删页）+ 十六套主题面板即点即换（全部页/仅本页自由换肤）、动画库（右侧边栏「⚙ 工具」Tab：翻页风格八套 / 元素入场十二式 / 离场十二式 / 强调八式 / 标题文字动画四式，应用范围全部页面或仅本页，即点即换、选择记忆）、页内连接与外部链接、逐页 PNG 截图（本页/选页批量，选页面板默认全选=一键导出全部页）与本页/选页批量文字复制（均不含任何操作元素）、全屏放映纯净模式（无关元素自动退场）。当用户请求把内容做成幻灯片/PPT/演示文稿、生成 HTML 幻灯、做分享页/汇报页，提到 magic-deck 或 /magic-deck，或询问其用法（怎么用/使用说明/能干什么）时使用。
allowed-tools: Bash, Read, Write
disable-model-invocation: false
---

# 魔法幻灯生成（magic-deck）

把用户内容排版为单文件 HTML 幻灯片（16:9 舞台 + 播放引擎 + 十六套风格 + 全屏放映），落盘并自动打开。

## 生成流程

0. **读用户配置**（TEMPLATE/THEME/TRANSITION/ANIM/WIDTH/HEIGHT/SEC/FILENAME/DIR 等）→ 先 Read 同目录 `user-config.md`
1. **收集内容**：解析用户提供的内容（文字/文件/结构化要点），确定页数与每页版式 → 先 Read `resources/content-guide.md` 按内容气质选版式骨架 / 按领域选成套模板 / 按用途定页数节奏 / 按数据挑图表形式
2. **生成 HTML**（每页写语义结构——.s-head 标题 / .card 卡片 / .points 要点 / .bignum 数据，按 TEMPLATE 在对应页 slide 挂 data-template 声明默认版式；十六主题 CSS 变量、主题面板、动画库（deck 标签 data-transition 翻页八套 + 元素 data-anim 入场十二式 / data-anim-leave 离场 / data-anim-emphasis 强调 + 标题文字拆分 + 边栏 ⚙ 工具 Tab 控制）、模板面板（16 套 + 预览本页）、编辑能力（撤销/重做/页面管理边栏：新页/复页/排序/删页）、播放引擎、热键、截图/复制、全屏纯净模式）→ 先 Read `resources/reference.html` + `resources/deck-spec.md` 两份，以 reference.html 为骨架逐处替换内容
2.5 **交付前自检**（落盘前必做，硬门禁不可跳过）：写工作区 `outputs/<文件名>.html` 后——
   - Bash 起 `python3 -m http.server 8941`（后台，端口占用换 8942/8943…）
   - Playwright headless 自检（缺则 `pip3 install --user playwright`；用系统 Chrome，无需 playwright install 下载浏览器）：`p.chromium.launch(channel="chrome", headless=True)` → goto 页面 → 挂 pageerror 监听（零容忍）→ 按页数循环 `go(i)` 把每一页翻完
   - 截首 / 中 / 末三页 PNG，Read 自查：版式正常、文字无溢出截断、图表数据到位、无豆腐块缺字
   - 任何报错或视觉问题：修 HTML → 重检；全绿才进第 3 步
3. **落盘与命名**：自检通过后 `cp` 到 DIR 目录，自动打开浏览器供用户放映。命名三级优先：①用户口头指定文件名 → 用指定名；②未指定且 FILENAME=auto → 按本次内容主题+用途总结中文名（如「智能探针系统-产品介绍」，让用户日后能按名找回继续改）；③FILENAME 写死固定名 → 用固定名。重名一律自动加日期后缀，绝不覆盖；落盘目录复用不清空、不改动目录内既有文件
4. **使用咨询**（用户只问「怎么用 / 使用说明 / 能干什么」等用法、未要求生成）→ 读 `resources/usage-guide.md`，将其内容原样输出（首行标题改为「魔法幻灯生成器使用指南」），不生成 HTML

## ⚙️ 配置与自定义

**执行本 skill 前必须先 Read 同目录 `user-config.md`**：默认配置（TEMPLATE/THEME/TRANSITION/ANIM/WIDTH/HEIGHT/SEC/FILENAME/DIR 等）与用户模板都在该文件中，以它为准。升级技能时 user-config.md 不会被覆盖，你的修改永久保留；官方更新配置时另存 `user-config.md.upstream` 对照文件，可按需手动合并新配置点。

## 规则速览

- 单文件 HTML 离线双击可打开：禁用 CDN/@import/外链 CSS/JS/图片/网络字体，字体用系统栈
- 模板十六套（版式骨架）与主题十六套（配色）正交组合，均运行时即点即换：模板经「🎨 模板」面板应用（全部页/仅本页/勾选页），先「👁 预览本页」看效果（不落 data-template，取消自动还原）；生成时按 TEMPLATE/口头点名在 slide 挂 data-template 声明默认版式；标题自动映射——timeline 取卡片标题做节点、keynote 取页标题做大观点、magazine 左文右图分栏、steps 卡片转箭头步骤条、vintage 卡片收双栏报纸、poster 要点转斜切色带、finance 百分比转仪表环，切回经典商务恢复原排版内容不丢；`.slide` 自带 `background:var(--bg)` 使单页换肤整页变色
- 编辑操作全套可回退：Ctrl+Z 撤销 / Ctrl+Shift+Z 重做（工具栏 ↶↷）；「▤ 页导航 / G 键」右侧页面管理边栏：点击缩略图跳页、悬停操作条复页/上移/下移/删页；「＋ 新页」在边栏头部，16 版式任选插在当前页后；全部编辑只作用于内存，刷新后回到原始 deck
- 工具栏控件统一 flex 垂直居中：`.toolbar/.group` flex + align-items:center + gap；`.tbtn` inline-flex + gap:6px + line-height:1；checkbox 14×14 与文字 6px 间距，文字不贴控件、上下不偏斜
- 页面 1280×720 舞台 + 按窗口等比缩放（--sc），窗口任意大小不变形
- 领域/业务成套模板 21 套（thesis/proposal/teaching/report/competition/plan/hiring/product/tech/marketing/training/ceremony/finance/medical/law/gov/party/food/travel/festival/charity，六分类）：面板「💼 领域」Tab 点选后一键生成整套页面（P 生成器产封面+目录+内容页+图表页+结束页，每套 6-8 页，主版式各不相同）；两段确认（profArmed）防误触，pushUndo 可撤销；生成后与版式/主题正交——每页照常挂 data-template 运行时换版式、主题照常换肤；演示页 15 的 21 张 .prof-demo 卡点击直达面板并选中
- 图表五式动画（L6，容器挂 data-anim-chart）：bars 柱状生长（--h 定高 + --bi 错峰）/ line 折线描画（dashoffset 归零 + 圆点按序浮现）/ pie 饼图扇入（弧段 rotate 定起点 + --po 扫入）/ ring 仪表扫弧（顶部起扫 + 中心数字）/ count 数字滚动（data-count + data-count-dec，go() 里 rAF 900ms 缓动）；图表动画独立于元素入场体系（图表是「会动的数据」不挂 data-anim）；prefers-reduced-motion 全部直显；全部主题变量驱动换肤即变色
- 动画库与模板/主题正交，收纳在右侧边栏「⚙ 工具」Tab（工具栏 ⚙ 按钮或 G 键进入，应用范围 radio 全部页面/仅本页）：翻页八套（slide-lr 左右滑移默认 / fade / slide-ud / zoom / flip 3D / cube 立方翻转 / wipe 平移擦除 / dissolve 溶解模糊，deck 标签 data-transition）即点即切；元素入场十二式（fade-up/fade-in/fade-down/zoom-in/slide-left/slide-right/slide-up/slide-down/pop/bounce-in/flip-in/blur + none，元素挂 data-anim + data-anim-delay 八档错落）翻到该页自动播放；离场十二式（同套离场方向，元素挂 data-anim-leave）翻页前元素先离场 0.45s 再切页；强调八式（pulse/swing/shake/breathe/flash/tada/spin/glow，元素挂 data-anim-emphasis 循环播放）；标题文字动画四式（none 无动画默认 / char 逐字 / word 逐词 / line 逐行，运行时拆分标题文字）；「开启」复选框一键全关，选择均 localStorage 记忆；prefers-reduced-motion 下全部退化为直切
- 结构顺序：背景装饰 → 顶部进度条 → 工具栏 → 页码 → 提示 → 左右箭头 → 右侧边栏（sp-tabs 双 Tab：▤ 页面 / ⚙ 工具）→ 舞台页组 → 说明弹层 → 播放引擎
- 左右箭头不常驻：默认透明，鼠标在页面内才显现；触屏设备（hover:none）保持可见
- 全屏放映纯净模式：`:root:fullscreen` 下工具栏/页码/提示/箭头/弹层与背景氛围层全部隐藏、页面黑底 `#000`（与 PPT 软件放映一致：幻灯按比例充满画面，比例不匹配处补黑边，绝无主题氛围边框），只留主体；热键全屏下照常生效
- 截图与复制只含主体内容，绝不包含工具栏/页码/箭头等操作元素（按钮收纳在边栏 ⚙ 工具 Tab，热键 S/C 照常）；复制分「⧉ 复制本页」（当前页文字）与「▦ 选页复制」（面板勾选任意页、默认全选=一键复制全部，按「【第 N 页】」分隔）；截图分「📷 截图本页」与「▦ 选页截图」（面板勾选任意页、默认全选=串行逐张下载全部页 slide-页码-主题.png，进度实时显示已保存 k/N 页；文字通道不含图片，图片走截图）
- 落盘命名三级优先：口头指定 > FILENAME=auto 按主题+用途总结中文名 > 写死固定名；重名加日期后缀不覆盖，目录复用不清空
- 完整规范（骨架/主题色值/模板库/单页主题/播放引擎/热键表/截图实现）见 `resources/deck-spec.md`

## 🔧 配置版本机制（升级保护）

`user-config.md` 首行有 `CONFIG_VERSION` 字段，声明配置结构版本。本 skill 当前要求版本为 2。每次执行前先读 user-config.md：

1. 若 CONFIG_VERSION 缺失或小于当前要求版本：先将旧 `user-config.md` 备份为 `user-config.md.bak-<时间戳>`
2. 按版本迁移规则迁移字段（新增字段补默认值、改名字段按映射改名、删除字段保留在备份并在对话中提示用户）
3. 更新 `CONFIG_VERSION` 为当前版本
4. 对话告知用户「配置已升级到 vN：新增 X、改名 Y」

禁止在未声明版本变更的情况下静默修改配置语义；

**无法迁移项处理**（值域失效 / 语义漂移 / 数据不兼容）：三情形——①旧值不在新值域（如旧模板/主题名已移除）②同名键含义变化（单位/枚举变更）③数据文件 schema 不兼容。三绝不：绝不静默（无法迁移项停下问，不猜值）、绝不丢失（旧值永远在 .bak-时间戳）、一次说清（升级报告三段式：⚠️ 版本与备份路径 → ✅ 已自动迁移清单 → 🟡 无法迁移项逐条附原因+影响+建议替代）；随后 AskUserQuestion 三选项（A 用建议值 / B 用户给新值 / C 保持旧配置——不更新 CONFIG_VERSION，每次执行再提醒）；报告必附回滚一句话；数据文件迁移前先复制 .bak-时间戳，能映射则映射、不能则写兼容层或留备份提示手动整理

升级技能时 user-config.md 不会被覆盖（官方更新另存 `user-config.md.upstream` 对照文件）。

## 📏 文档同步自检纪律（维护者必读）

- 修改本 skill 任何文件后，必须 grep 全文核对：新词已命中、旧词零残留（改一处查一处）
- 修改 HTML 效果必须双处同步：`resources/reference.html` 与 `resources/deck-spec.md` 对应描述同时更新，禁止只改一处
- 修改配置键必须三处同步：user-config.md 的 yaml、SKILL.md 配置键清单、deck-spec.md 对应规则
