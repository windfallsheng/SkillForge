---
name: one-pager
description: 把一个主题/一句话想法变成一页纸 HTML 海报（大标题 + 金句 + 要点块 + 页脚，纵向一屏排版、适合分享/打印/截图），内置 32 套布局模板（现代主义/编辑出版/数据商务/艺术流派/国风雅韵/先锋实验/场景专用七组流派分类，含瑞士/包豪斯/蒙德里安/波普/欧普/新艺术/水墨/红金宫廷/青绿山水/酸性/故障/蒸汽波/赛博等设计史与先锋版式）× 25 套配色主题（含莫兰迪/北欧/装饰艺术/波普/经典蓝/酸性荧光/赛博霓虹等业内专业配色）随点随切，并可用 ?shot 参数截出 PNG 图片；用户说「专业设计/带我设计」时走七步专业设计引导（需求诊断→信息架构→版式→配色→字体→焦点→QA）并附设计说明。当用户请求一页纸、一张海报、one-pager、做张海报、一页介绍、金句海报时使用。
allowed-tools: Bash, Read, Write
disable-model-invocation: false
---

# 一页纸海报（one-pager）

一句话主题进 → 一屏海报出：内容提炼 → HTML 海报（32 套布局 × 25 套主题可切换、纵向一屏、打印友好）→ 可选 PNG 截图。

## 生成流程

0. **读用户配置**（TEMPLATE/THEME/TPL_DIR/DIR/OPEN_HTML/SHOT/ASPECT）→ 先 Read 同目录 `user-config.md`
0.5 **Pro 模式**（用户说「专业设计 / 带我设计 / 从零设计 / 从头到尾设计海报 / 走专业流程」时走七步引导，取代第 1 步的默认提炼草稿流程）→ 读 `resources/design-process.md`：需求诊断 Brief → 信息架构 Hierarchy → 版式决策 Layout（32 套按七组流派推荐）→ 配色方案 Color（25 套按行业×情绪推荐）→ 字体情绪 Type → 视觉焦点 Focal → 交付检查 QA；第 1 步必问（AskUserQuestion），第 2-6 步每步给推荐 + 理由、用户可确认/改选/说「你定」，七步结论确定后一次性生成海报并附四段式设计说明（设计定位/版式依据/配色依据/字体与细节）
1. **内容提炼**（主题句 → 标题/金句/要点块，问清再动）→ 读 `resources/content.md`
2. **生成 HTML**（先 Read reference.html 骨架替换数据）→ 读 `resources/generate.md` 与 `resources/html-rules.md` 两份
2.5 **交付前自检**（硬门禁不可跳过）：HTML 文件写好后——
   - 挂 pageerror 监听用 Chrome headless 访问页面（零容忍报错）→ 截全页 PNG Read 自查：标题/金句/要点块齐全、一屏内无溢出、无豆腐块缺字
   - SHOT: true 时用 Chrome headless 带 `?shot` 参数截 PNG 落盘（同海报文件名 .png）
   - 任何报错或视觉问题：修 HTML → 重检；全绿才进第 3 步
3. **使用咨询**（用户只问「一页纸海报怎么用」等用法、未要求生成）→ 读 `resources/usage-guide.md`，将其内容原样输出（首行标题改为「一页纸海报使用指南」），不提炼内容、不落盘、不开浏览器

## ⚙️ 配置与自定义

**执行本 skill 前必须先 Read 同目录 `user-config.md`**：默认配置（TEMPLATE/THEME/TPL_DIR/DIR/OPEN_HTML/SHOT/ASPECT）都在该文件中，以它为准。升级技能时 user-config.md 不会被覆盖，你的修改永久保留；官方更新配置时另存 `user-config.upstream.md` 对照文件，可按需手动合并新配置点。

- **TEMPLATE**：海报布局模板，classic 经典舞台（默认，徽章+渐变巨字+三列要点卡）/ minimal 极简留白（瑞士平面，衬线巨字+编号竖排要点）/ magazine 杂志社论（刊头通栏线+左文右栏+首字下沉金句）/ hero 巨幕大字（电影海报式巨型关键词+底部要点横条）/ timeline 时间叙事（中央竖线+要点左右交替卡片）/ grid 卡片栅格（2×2 大圆角卡片+描边编号角标）/ dashboard 数据仪表（KPI 环形图+要点进度条）/ brutalist 新粗野（撞色块+4px 粗框+硬阴影）/ swiss 瑞士国际（红黑极简+网格对齐）/ bauhaus 包豪斯（圆方三角几何+三原色）/ mondrian 蒙德里安（黑粗线网格+红黄蓝色块）/ editorial 编辑刊（刊头双线+首字下沉+双栏）/ typo 大字报（巨型标题撑满+要点三列）/ memphis 孟菲斯（波点+撞色徽章+卡片微斜）/ exhibit 展览（展签卡片+硬影微斜）/ window 视窗（不对称 2:1 网格开窗）；newspaper 报纸新闻（报头双线+通栏标题+首字下沉+双栏）/ popart 波普艺术（网点底纹+描边大字+硬影卡片）/ opart 欧普艺术（放射纹+同心框视觉震荡）/ artnouveau 新艺术（拱形框+卷草饰线+慕夏气质）/ acid 酸性设计（液态金属 blob+斜切徽章）/ glitch 故障艺术（RGB 错位影+阶梯裁切）/ vaporwave 蒸汽波（落日渐变+透视地平线）/ cyber 赛博霓虹（切角框+霓虹辉光）/ academic 学术会议（横幅+三栏摘要+图表位）/ recruit 招聘（岗位巨字+标签+投递按钮）/ invitation 邀请函（烫金双线框）/ notice 通知公告（红头大字+正文缩进）/ inkwash 水墨（宣纸底+墨色远山+朱印落款）/ palace 红金宫廷（朱红底+回纹金边+衬线金字）/ landscape 青绿山水（层叠山峦+留白题跋）/ watermark 水印公文（斜置大字水印+居中正文）；生成时写 `<html data-template="TEMPLATE值">` 定默认，页面顶部模板坞三十二标签按七组流派分组随点随换（现代主义/编辑出版/数据商务/艺术流派/国风雅韵/先锋实验/场景专用）、与二十五主题正交组合出 800 种版式（localStorage 记忆，键按页内嵌唯一 ID 隔离、多份产物互不串台、改名/移动目录记忆不丢；生成时头部写 `<meta name="poster-id" content="<UUID>">`，每次 crypto.randomUUID() 生成标准 UUID v4（8-4-4-4-12 十六进制，禁止手写变体、禁止沿用占位与旧值）；落盘写文件前顺扫落盘目录下本技能命名的 html，读各文件 id meta 查重，撞号重掷至不重复）
- **THEME**：海报主题，tech 深蓝科技（默认）/ biz 浅色商务 / mono IDEA 黑亮 / light IDEA 白亮 / warm 温暖渐变 / ink 水墨国风 / jade 翡翠绿 / rose 玫瑰金 / midnight 午夜金 / violet 霓虹紫 / swiss 瑞士红黑 / bauhaus 包豪斯三原色 / memphis 孟菲斯撞色 / morandi 莫兰迪 / nordic 北欧 / artdeco 装饰艺术 / noir 黑白电影 / classicblue 经典蓝 / pop 波普 / retro 复古胶片 / coral 珊瑚橙 / acid 酸性荧光 / cyber 赛博霓虹 / cream 奶油纸 / academic 学术蓝；生成时写 `<html data-theme="THEME值">` 定默认，页面右下角主题坞二十五色点 5×5 随点随换，把手常显「主题 · 当前主题名」、hover 色点浮签显示主题名（记忆与隔离机制同 TEMPLATE）
- **TPL_DIR**：用户模板库目录，auto = 与海报库根目录平级的 `user-templates/`（DIR: auto 时 = 当前工作目录 `user-templates/`；DIR 写绝对路径如 `~/MyWork/posters` 时 = `~/MyWork/user-templates/`），所有海报产物共用这一处模板库，也可写绝对路径自定义；目录内的 *.html 模板文件生成海报时自动内嵌（格式见 `resources/user-template-example.html` 三段式注释约定），模板坞出现「我的模板」分组可随点随切；目录在技能目录之外，升级技能不覆盖
- **DIR**：海报库根目录，auto = 当前工作目录 `posters/`（也可写绝对路径）；每张海报一个 slug 子目录——`<DIR>/<主题slug>/` 内 `poster.html` + `poster.md`（内容底稿）+ `poster.png`（SHOT 截图）三件套成组，互不混杂、整目录即一版海报，复制分享/清理删除都以目录为单位

## 配置版本机制（升级保护）

本 skill 当前配置版本为 `4`（对应 user-config.md 中的 `CONFIG_VERSION`）。执行时若发现 user-config.md 的 CONFIG_VERSION 与本节声明不一致：

1. 先将旧 user-config.md 备份为 `user-config.bak-<时间戳>.md`（同目录，绝不删除旧值）
2. 按本节「配置升级规则」迁移字段：新增字段补默认值、改名字段按映射改写、删除字段的值保留在备份中并在对话提示用户手动确认
3. 更新 CONFIG_VERSION 为当前版本
4. 对话中明确告知用户「检测到配置版本从 X 升级到 Y，旧配置已备份至 <路径>」

迁移规则（v1 → v2）：新增 `TEMPLATE` 字段，默认 `classic`，其余字段不变。

迁移规则（v2 → v3）：新增 `TPL_DIR` 字段，默认 `auto`，其余字段不变。

迁移规则（v3 → v4）：TPL_DIR 的 auto 落点从 `~/.skillforge/user-templates` 改为与海报库根目录平级的 `user-templates/`；执行时若发现旧位置（~/.skillforge/user-templates）存在模板文件而新平级位置为空，自动把旧模板移入新位置并在对话中告知；用户已写绝对路径的不动。

升级本 skill 时，配置结构如有变化必须同步更新本节的当前版本号与迁移说明；禁止在未声明版本变更的情况下静默修改配置语义。
## 文档同步自检纪律（维护者必读）

修改本 skill 任一文件（SKILL.md / user-config.md / resources/*）后，必须 grep 全文核对相关关键词在各文件间一致（字段名 / 流程节点 / 模板名改名时新旧词全仓核对，旧词零残留才算完成）。
## 🔧 报修处理流程（用户报页面问题时）

用户说「这个页面效果不对 / 布局乱了 / 有 UI 问题 / 样式错了 / 交互坏了」（常附截图或指出具体现象）→ 按以下流程处理，不以「重新生成一份」敷衍：

1. **立标准**：先 Read 本 skill 目录 `resources/reference.html`——它就是设计标准答案（布局/配色/交互全在代码里）
2. **找问题**：Read 用户那份问题 html 文件，与 reference 逐处比对（结构顺序 / CSS 变量 / 关键类名 / 交互 JS），定位跑偏处；用户给了截图则按截图现象反查
3. **修复**：以 reference 为准修复那份 html（只修跑偏处，不动正确内容；reference 与 html 不一致时以 reference 为准）
4. **自证**：Chrome headless 访问修复后页面截全页 PNG，Read 自查修复点恢复标准效果
5. **汇报**：一句话说清问题根因 + 修复了什么 + 附截图；若根因在 reference.html 自身，顺修 reference.html 对应处并在汇报中说明「参考模板已同步修正」


## 产物升级（回炉）

生成 HTML 时头部写版本戳 `<meta name="sf-template" content="one-pager@13">`（模板升级时递增 @N 并同步 reference.html 与本文档）。用户说「升级旧海报/回炉」时：顺扫海报库根目录（DIR 值）下两种形态——新子目录形态 `<slug>/poster.html` 与旧平铺形态 `poster-*.html`，读版本戳筛旧版（无版本戳或缺少 `<meta name="poster-id">` 稳定 ID 的产物视为 v0 最旧版，一并进清单）→ 列清单（文件/旧版本）→ AskUserQuestion 选全部或部分 → 逐份升级：浅升级（仅 CSS/JS 变化）对旧页替换 `<style>` 块与交互脚本、正文原样保留；深升级（DOM 结构变化）从同目录 md 底稿按当前 reference.html 重建，先备份旧版 `.bak-时间戳`，重建必须沿用原页 poster-id meta 值（换 ID = 模板/主题记忆失联）→ 报告三段式：✅ 已升级清单 / ⚠️ 手改保留说明 / 🟡 失败项原因。模板改动分级：业务改动、数据格式改动、页面改动任一发生即模板升级，版本戳 +1 并同步 reference.html 与本文档；纯措辞润色不 bump。每次生成 HTML 时顺扫落盘目录读版本戳：发现旧版产物主动告知用户「说『把我旧海报都升级成新样式』即可一键升级」。

## 规则速览

- 一屏原则：海报纵向一屏展示（内容自适应缩放不滚动出第二屏）；要点块 3-5 条，每条 15-30 字，禁止长篇大论
- 内容问清再动：主题句不够明确时先与用户确认标题/要点口径，不猜
- 设计专属清爽底：无噪点/网格/星点/扫描线氛围层，背景只有纯色→细腻线性渐变（--bg 12% → --bg2 135%），设计感全靠版式与配色本身
- 零侵权：系统字体栈、禁止 CDN/外链资源，页面离线双击可开；页脚署名固定 GENERATED BY AI TEAM
- 三十二模板 × 二十五主题 = 800 种版式正交组合；模板管布局骨架、主题管配色变量，生成时按 TEMPLATE/THEME 配置定默认，用户可页面顶部模板坞（七组流派分组）与右下角主题坞随手切换，两坞默认折叠成胶囊把手不遮正文，点开选完自动收起
- 落盘完成后对话必须报告落盘位置：完整路径清单（html + 可选 png），并注明 html 是否已在浏览器打开

---

## 🔍 SkillForge 使用指引（整体咨询时触发）

当用户询问 **SkillForge 本身**（不是单个技能用法）——「skillforge 怎么用 / 使用说明 / 使用指引 / 是什么」「技能怎么安装 / 怎么升级 / 装了哪些技能 / 技能清单」「skill-forge ls / init / update 等命令怎么用」「技能安装器 / 技能锻造坊」等（中英文、近似说法均可，关键词可自由扩展）：
1. Read 同目录 `resources/skillforge-guide.txt` 全文，按其内容整理回答（命令与参数以 txt 为准，勿自行编造）
2. 用系统命令打开同目录 `resources/skillforge-guide.html`（macOS `open`，Windows `start`），让用户在浏览器看排版版
3. 用户只问单个技能怎么用时（如「日报怎么用」）不触发本指引，走本技能的使用说明
