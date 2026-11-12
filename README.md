# SkillForge · 技能锻造坊

> 一处集中收纳「AI 手艺」的工坊——把日复一日的重复劳作，锻造成一句指令就能完成的顺手工具。坊中每一件技能都是一份写给 AI 的手艺说明，一句自然语言即可唤起，按既定工序产出标准化成果；手艺与宿主无关——换一份薄薄的 frontmatter 信封，就能从一位 AI 助手带去另一位。

**SkillForge** is a curated collection of AI craft skills — repetitive daily work, forged into tools that answer with a single command. Each skill is a set of craft instructions written for the AI: one natural-language request sets it in motion, and a polished, standardized deliverable comes out the other end. The craft is host-agnostic — a thin frontmatter envelope is all it takes to carry it from one AI assistant to another.

所有技能均以 SKILL.md 为入口——frontmatter、生成流程、用户可改配置留在入口，重内容按生成阶段拆到 resources/ 或平铺辅助文件（如 design-system.md、scripts/），AI 执行到对应阶段才读取，降低常驻上下文占用。

Every skill enters through its SKILL.md — frontmatter, generation flow, and user-editable config stay at the entry; heavy content is split into resources/ (or flat helper files such as design-system.md, scripts/) and read only when the AI reaches that stage, keeping resident context small.

## 产物画廊 · Output Gallery

以下均为各技能产出的真实成品截图。These are real screenshots of what each skill produces.

<table>
<tr>
<td align="center" width="50%">
  <img src="docs/images/daily-report.png" alt="日报成品页 Daily report page" width="100%"/><br/>
  <sub>日报成品页（任务进度 / 明日计划 / 风险阻塞三段卡）<br/>Daily report page — progress, plans, blockers</sub>
</td>
<td align="center" width="50%">
  <img src="docs/images/meeting-minutes.png" alt="会议纪要成品页 Meeting minutes page" width="100%"/><br/>
  <sub>会议纪要成品页（会议信息 / 结论 / 议题 / 行动项五段卡）<br/>Meeting minutes page — five-section cards with action items</sub>
</td>
</tr>
<tr>
<td align="center" width="50%">
  <img src="docs/images/article-to-html.png" alt="文档装裱成品页 Article-to-HTML page" width="100%"/><br/>
  <sub>文档装裱成品页（暗色封面 + 组件化正文，图表矢量重绘）<br/>Article-to-HTML page — hero cover + component layout</sub>
</td>
<td align="center" width="50%">
  <img src="docs/images/magic-deck.png" alt="魔法幻灯封面 Magic-deck slide cover" width="100%"/><br/>
  <sub>魔法幻灯封面（16:9 舞台，放映 + 模板 + 主题）<br/>Magic-deck slide cover — 16:9 stage, playback + templates + themes</sub>
</td>
</tr>
<tr>
<td align="center" width="50%">
  <img src="docs/images/deck-stage.png" alt="登台 PPTX 封面页 Deck-stage PPTX cover" width="100%"/><br/>
  <sub>登台 PPTX 封面页（HTML 保真截图，原生可编辑页）<br/>Deck-stage PPTX cover — HTML-rendered, pages stay editable</sub>
</td>
<td align="center" width="50%">
  <img src="docs/images/prompt-pouch.png" alt="锦囊提示词管理台 Prompt pouch manager" width="100%"/><br/>
  <sub>锦囊提示词管理台（分组 / 搜索 / 收藏 / 标签 / 导入导出）<br/>Prompt pouch manager — groups, search, favorites, tags, JSON backup</sub>
</td>
</tr>
</table>

## 技能分类 · Categories

按「技能最终产出什么」归类，一个技能只归一类；分类只用于本仓库组织与导航，安装时始终平铺复制到目标 AI 助手的技能目录，与分类无关。

Skills are grouped by what they ultimately produce — one skill, one category. Categories only organize this repository; installation always copies skills flat into the target AI assistant's skill directory.

| 分类 Category | 说明（中） Description | 收录技能 Skills |
|:---|:---|:---|
| 报表汇演<br>Reports | 多源数据整理（一段文字 / 文件里的描述 / 图片与素材 / 口头补充，什么材料都能成稿），按周期产出报告（日报 / 周报 / 月报 / 季报 / 年报）<br>Multi-source reports on a schedule — daily, weekly, monthly, quarterly, annual; any material (text, files, images, voice notes) can become a draft | daily-report、weekly-report、monthly-report、quarterly-report、annual-report |
| 文档装裱<br>Documents | 文档转换与美化：Word / Markdown / 纯文本 → 精美 HTML + 逐章截图<br>Document conversion & beautification: Word / Markdown / plain text → polished HTML + per-chapter screenshots | article-to-html |
| 工程提效<br>Engineering | 基于 Pandoc 的文档 ↔ 规格互转（需求文档切片 / 规格导出 Word·PDF），Pandoc 机械转换 + AI 校对防错<br>Pandoc-based document ↔ spec conversion (requirement slicing / spec export to Word·PDF), mechanical conversion plus AI proofreading | spec-doc2spec、spec-spec2doc |
| 演示汇演<br>Slides | 从内容到演示：HTML 形态的魔法幻灯（放映 + 模板 + 主题）与 .pptx 登台文稿（原生可编辑页 + 封面截图）<br>From content to presentation: HTML magic slides (playback + templates + themes) and .pptx stage decks (editable pages + HTML cover) | magic-deck、deck-stage |
| 数据整备<br>Data | Excel / CSV / 图表、数据清洗与模板整理（规划中）<br>Excel / CSV / charts, data cleaning & template tidying (planned) | （规划中 planned） |
| 沟通协作<br>Communication | 会议纪要（行动项带负责人与截止时间，汇报链源头）与提示词管理（锦囊本地管理台）<br>Meeting minutes (action items with owners & deadlines, the source of the reporting chain) and prompt management (local pouch dashboard) | meeting-minutes、prompt-pouch |
| 技能自造<br>Meta | 锻造技能本身的元技能（创建技能 / 插件）<br>Meta skills that forge skills themselves (create skill / plugin) | meta-forge |

## 技能清单 · Skill List

| 技能 Skill | 分类 Category | 目录 Dir | 说明（中） Description |
|:---|:---|:---|:---|
| daily-report | 报表汇演 Reports | [daily-report/](daily-report/) | 多源数据生成日报（今日任务进度/明日计划/风险阻塞点）：一段文字、文件里的描述、图片或口头补充皆可成稿；支持自然语言日期（今天/昨天/上周三/10月20号）、连续多日批量、自定义模板、12 行业词条<br>Daily reports (progress / plans / blockers) from any source; natural-language dates, batch multi-day runs, custom templates, 12-industry vocabulary |
| weekly-report | 报表汇演 Reports | [weekly-report/](weekly-report/) | 多源数据生成周报（本周结论 + 本周任务进度/下周计划/风险阻塞点 + 本周概览卡）；周结束日可配置（默认周五），支持自然语言周定位（本周/上周/10月第2周/节假日锚定）<br>Weekly reports with a conclusion, progress/plans/blockers and an overview card; configurable week-end day (default Friday), natural-language week locating |
| monthly-report | 报表汇演 Reports | [monthly-report/](monthly-report/) | 多源数据生成月报（四段式：月度概览/本月关键成果/问题与改进/下月计划），开发类用户可聚合当月 git 提交；12 行业职业词典，支持自定义模板与自然语言月份定位<br>Monthly reports (overview / key results / issues & improvements / next-month plans); optional git commit aggregation, custom templates, natural-language month locating |
| quarterly-report | 报表汇演 Reports | [quarterly-report/](quarterly-report/) | 多源数据生成季度总结（四段式：季度概览/季度关键成果/问题与改进/下季度计划）：核心数据卡带环比（较上季度）+ 同比（较去年同期）双基准，概览附 Q1-Q4 季度走势图；成果段按 M1/M2/M3 月时间线；12 行业职业词典，支持自定义模板<br>Quarterly reviews with QoQ + YoY metric cards and a Q1-Q4 trend chart; results laid out on an M1/M2/M3 monthly timeline; 12-industry vocabulary, custom templates |
| annual-report | 报表汇演 Reports | [annual-report/](annual-report/) | 多源数据生成年度总结（五段式：年度概览/核心成果/经验成长/不足反思/新年规划）：git 全年提交聚合 + 会话口述；12 行业职业词典，支持自定义模板与自然语言年度定位<br>Annual summaries in five sections; year-round git commit aggregation plus oral input; 12-industry vocabulary, custom templates, natural-language year locating |
| article-to-html | 文档装裱 Documents | [article-to-html/](article-to-html/) | Word / Markdown / 纯文本 → 精美独立 HTML（思源黑体 + Roboto 商用免费字体，图表 HTML/CSS 重绘），逐章截图（Retina 2x）；现成 HTML 可直接截图或先美化<br>Word / Markdown / plain text → polished standalone HTML (free commercial fonts, vector-redrawn charts), per-chapter Retina screenshots; ready-made HTML can be screenshotted or restyled first |
| spec-doc2spec | 工程提效 Engineering | [spec-doc2spec/](spec-doc2spec/) | Word / Markdown 需求文档转结构化需求切片（薄入口 + resources 分册）；自动检测 Pandoc，未装引导跨系统安装<br>Word / Markdown requirements → structured requirement slices; auto-detects Pandoc, guides cross-platform install when missing |
| spec-spec2doc | 工程提效 Engineering | [spec-spec2doc/](spec-spec2doc/) | Markdown 规格导出为 Word / PDF 交付文档；自动检测 Pandoc，未装引导跨系统安装；PDF 双路径（xelatex / Chrome 打印兜底）<br>Markdown specs → Word / PDF deliverables; Pandoc auto-detect, dual PDF paths (xelatex / Chrome print fallback) |
| magic-deck | 演示汇演 Slides | [magic-deck/](magic-deck/) | 内容 → 单文件 HTML 幻灯（16:9 舞台 + 播放引擎 + 十六套版式模板 + 十七套主题 + 领域成套模板 21 套 + 图表动画五式 + 动画库 + 全屏放映纯净模式）：自动播放/循环/间隔、键盘热键、页内连接、逐页 PNG 截图与主体复制<br>Content → single-file HTML slides (16:9 stage, playback engine, 16 layouts, 17 themes, 21 domain template packs, chart animations); autoplay, hotkeys, per-slide PNG capture |
| deck-stage | 演示汇演 Slides | [deck-stage/](deck-stage/) | 报告/素材 → 专业 .pptx 登台文稿：三问交互（素材 → 页骨架表 → 成片方式），常规页原生可编辑（数据卡/时间线/柱图/饼图/折线），封面与结尾页 HTML 截图保真，每页可带演讲备注；视觉与报表同源（tech/biz/mono/light/warm 五主题）<br>Reports/materials → editable .pptx decks: three-question flow, native editable pages (data cards / timelines / charts), HTML-rendered cover & closing, speaker notes per page |
| meta-forge | 技能自造 Meta | [meta-forge/](meta-forge/) | 元技能：从需求出发锻造完整技能包（薄入口 + resources 拆分 + user-config），自动植入四大机制（CONFIG_VERSION 钥匙 / user-config 抽离 / reference 双轨 / 自检纪律），入仓库时自动登记 README 与 cli.js 分类表<br>Meta skill: forge complete skill packages from requirements (thin entry + resources split + user-config) with four built-in mechanisms and automatic repo registration |
| meeting-minutes | 沟通协作 Communication | [meeting-minutes/](meeting-minutes/) | 多源材料生成会议纪要（五段式：会议信息/会议结论/议题讨论/决议与行动项/下次会议）：行动项带负责人与截止时间（汇报链源头，可被日报/周报/月报/季报引用）；内置 12 类会议类型词典，支持自定义模板<br>Meeting minutes in five sections; action items with owners & deadlines (source of the reporting chain, citable by daily/weekly/monthly/quarterly reports); 12 meeting-type dictionaries, custom templates |
| prompt-pouch | 沟通协作 Communication | [prompt-pouch/](prompt-pouch/) | 锦囊提示词管理台：生成并维护本地 HTML 管理页面（分组侧栏/搜索/拖拽与按钮排序/收藏/{变量}插值/一键复制/标签全交互/导入导出 JSON 备份/分组 emoji 快捷面板），数据存 data/prompts.json、滚动备份在 backup/ 子目录，页面与数据分离，双笔协作（页面直写 + AI 代笔）<br>Local prompt manager page (groups, search, drag & button sorting, favorites, {variable} interpolation, one-click copy, full tag interaction, JSON import/export); data lives in prompts.json with rolling backups, page and data stay separate |

## 快速开始 · Quick Start

```bash
npm i -g skill-forge-hub        # 全局安装 · global install
skill-forge ls                  # 列出全部技能（只读）· list all skills
skill-forge init                # 交互式挑选技能，自动探测并安装到 AI 助手技能目录 · pick & install interactively
skill-forge update              # 升级已安装技能（配置版本感知，本地配置受保护）· upgrade with config protection
```

安装后直接说「写日报」「写周报」「写月报」「写季报」「写年报」「记会议」或丢给它一个文档即可触发；问「日报怎么用 / 会议纪要怎么用 / 登台怎么用」等输出使用说明。

Once installed, just say "写日报" (write a daily report), "记会议" (take meeting minutes), or hand it a document to trigger a skill; ask "how to use X" for a plain-language guide.

## 文档导航 · Documentation

| 文档 Document | 内容 Contents |
|:---|:---|
| [docs/install.md](docs/install.md) | 安装与升级详解：两种安装方式、命令参考、升级与配置保护机制、维护者约定（CONFIG_VERSION 递增规则）<br>Installation & upgrade in depth: two install methods, command reference, upgrade & config protection, maintainer conventions |
| [docs/architecture.md](docs/architecture.md) | 架构与规范：目录结构、技能形态（薄入口 + resources）、四大机制、拆分规范、通用原则<br>Architecture & conventions: directory layout, skill anatomy, the four core mechanisms, splitting rules, general principles |
| [CHANGELOG.md](CHANGELOG.md) | 版本变更记录 · Version changelog |

## 许可证 · License

[MIT](LICENSE)
