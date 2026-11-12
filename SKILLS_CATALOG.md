# SkillForge 技能目录简介册 · Skills Catalog

> 本文件供技能目录收录引用（skills.sh / awesome-claude-skills 等）：每个技能一段**独立可引用**的双语简介，目录维护者可直接整段摘录；提交 PR 或发布时请引用本文件对应锚点（如 `SKILLS_CATALOG.md#daily-report`）。
> Each section is a self-contained, citable profile for directory submissions (skills.sh, awesome-claude-skills, etc.). Link to anchors like `SKILLS_CATALOG.md#daily-report` when submitting.

**仓库一览**：21 个可复用 Agent 技能（SKILL.md 为入口，一次生成，跨宿主迁移），覆盖报表汇报、文档装裱、工程提效、演示汇演、数据整备、沟通协作、技能自造七类。全部离线可用、零外部依赖、配置抽离（user-config.md，升级不覆盖）。
**Repository at a glance**: 21 reusable agent skills (SKILL.md as entry point, generated once, portable across hosts), covering reporting, document beautification, engineering efficiency, presentations, data preparation, collaboration, and meta-skill crafting. Fully offline, zero external dependencies, user config isolated in user-config.md.

---

## 报表汇演 · Reporting

### daily-report 日报 / Daily Report
一句话总结当天工作 → 结构化日报（任务进度 / 明日计划 / 风险阻塞点），适配 12 行业（内置职业词典），支持自然语言日期（今天/昨天/上周三）、多日批量、自定义模板；一段文字、文件、图片或口头补充皆可成稿。
Turns a one-line summary into a structured daily report (progress / tomorrow's plan / risks & blockers) adapted to 12 industries via a built-in professional glossary. Natural-language dates, multi-day batch generation, custom templates; accepts text, files, images, or spoken notes.

### weekly-report 周报 / Weekly Report
本周结论先行 + 任务进度 / 下周计划 / 风险阻塞点三节，1D=8H 工时口径；周结束日可配置（默认周五），自然语言周定位（本周/上周/10月第2周），12 行业词典与自定义模板。
Conclusion-first weekly report with progress / next-week plan / risks sections. Configurable week end (default Friday), natural-language week selection, industry glossary and custom templates.

### monthly-report 月报 / Monthly Report
四段式月报（月度概览 / 关键成果 / 问题与改进 / 下月计划），开发类用户可聚合当月 git 提交；12 行业词典、自定义模板、自然语言月份定位。
Four-section monthly report (overview / key results / issues & improvements / next-month plan); aggregates the month's git commits for developers; industry glossary, custom templates.

### quarterly-report 季报 / Quarterly Report
四段式季度总结，核心数据卡带环比 + 同比双基准，概览附 Q1-Q4 走势图，成果段按 M1/M2/M3 时间线；12 行业词典、自定义模板。
Four-section quarterly summary with MoM + YoY data cards, Q1-Q4 trend chart, month-by-month timeline; industry glossary, custom templates.

### annual-report 年报 / Annual Report
五段式年度总结（年度概览 / 核心成果与里程碑 / 经验与成长 / 不足与反思 / 新年展望与规划），开发类用户可聚合 git 全年提交；12 行业词典、自定义模板。
Five-section annual review (overview / milestones / growth / reflection / outlook); aggregates a full year of git commits; industry glossary, custom templates.

### team-report-collector 团队日报收集台 / Team Report Collector
团队成员日报收集台：口述 / 文件批量 / 页面导出三种方式收日报 → reports.json 数据真相源 + 单文件离线收集台 HTML（表单填写 + localStorage 草稿 + 导入导出 + 五主题换肤）+ 按日期分组汇总 md。
Collects team members' daily reports via dictation, batch files, or page export into a single-file offline HTML console (forms, drafts, JSON import/export, 5 themes) with date-grouped markdown digests.

## 文档装裱 · Document Beautification

### article-to-html 文档装裱 / Article to HTML
Word / Markdown / 纯文本 → 精美独立 HTML（思源黑体 + Roboto 商用免费字体，图表 HTML/CSS 重绘不嵌图），逐章截图（Retina 2x）；现成 HTML 可直接截图或先美化。
Converts Word / Markdown / plain text into a polished standalone HTML page (free commercial fonts, charts redrawn in HTML/CSS), with per-chapter Retina screenshots; existing HTML can be screenshot or restyled directly.

### twin-docs 孪生文档 / Twin Docs
中文文档翻译并同步为英文版（或反向）：术语表一致性对齐、标题层级 / 表格 / 代码块 / 链接逐项对应、双向同步检查出差。
Translates Chinese docs into English twins (or reverse) with a glossary for term consistency, structural parity for headings/tables/code/links, and bidirectional drift checks.

### one-pager 一页纸海报 / One-Pager Poster
主题 / 一句话想法 → 一页纸 HTML 海报（大标题 + 金句 + 要点块，纵向一屏、打印友好）+ 可选 PNG 截图；32 套布局模板 × 25 套配色主题随点随切（800 种版式），七组流派分类（含国风雅韵：水墨 / 红金宫廷 / 青绿山水），「专业设计」走七步引导。
Turns a topic into a one-screen HTML poster (title + quote + points) with optional PNG export; 32 layout templates × 25 color themes (800 combinations) across seven style schools including Chinese-ink, palace-red, and blue-green landscape styles; a 7-step guided design mode for design requests.

## 工程提效 · Engineering Efficiency

### spec-doc2spec 文档转规格 / Doc to Spec
Word / Markdown 需求文档 → 结构化需求切片（薄入口 + resources 分册）；自动检测 Pandoc，未装引导跨系统安装；Pandoc 机械转换 + AI 校对防错。
Slices Word / Markdown requirement documents into structured requirement units; auto-detects Pandoc with cross-platform install guidance; Pandoc does mechanical conversion, AI does proofreading.

### spec-spec2doc 规格转文档 / Spec to Doc
Markdown 规格 → Word / PDF 交付文档；自动检测 Pandoc，未装引导跨系统安装；PDF 双路径（xelatex / Chrome 打印兜底）。
Exports Markdown specs to Word / PDF deliverables; Pandoc auto-detection; dual-path PDF (xelatex / Chrome print fallback).

### release-notes 发版说明 / Release Notes
git 两标签之间提交 → 中英双语发版说明 + CHANGELOG 条目（分类归纳 + 用户视角改写 + 提交统计）+ npm 发布前自检清单。
Generates bilingual release notes and CHANGELOG entries from git commits between two tags (categorized, user-perspective rewrite, commit stats) plus a pre-publish npm checklist.

## 演示汇演 · Presentations

### magic-deck 魔法幻灯 / Magic Deck
内容 → 单文件 HTML 幻灯（16:9 舞台 + 播放引擎 + 十六套版式模板 + 十七套主题 + 领域成套模板 21 套 + 图表动画五式 + 动画库 + 全屏放映纯净模式）：自动播放 / 循环 / 间隔、键盘热键、页内连接、逐页 PNG 截图与主体复制。
Turns content into a single-file HTML slideshow (16:9 stage, playback engine, 16 layouts, 17 themes, 21 domain template packs, chart animations, clean fullscreen mode) with autoplay, hotkeys, in-page links, per-slide PNG export.

### deck-stage 登台文稿 / Deck Stage
报告 / 素材 → 专业 .pptx 登台文稿：三问交互（素材 → 页骨架表 → 成片方式），常规页原生可编辑（数据卡 / 时间线 / 柱图 / 饼图 / 折线），封面与结尾页 HTML 截图保真，每页可带演讲备注；视觉与报表同源五主题。
Builds a professional .pptx deck from reports or raw material through a three-question flow; regular pages natively editable (data cards, timeline, bar/pie/line charts), cover and closing pages rendered as HTML screenshots, per-page speaker notes.

## 数据整备 · Data Preparation

### data-prepper 数据整备 / Data Prepper
Excel / CSV / JSON 散装数据 → 结构化数据：格式探测 → 清洗（清洗项明示、逐条留痕、不猜不编）→ JSON/CSV 落盘 → 数据概览报告（字段画像 / 分布 / 异常值 / 清洗清单）。
Cleans scattered Excel / CSV / JSON into structured data: format detection, transparent step-by-step cleaning (no guessing), JSON/CSV output, and an overview report (field profiles, distributions, outliers, cleaning log).

### commit-heatmap 提交热力图 / Commit Heatmap
git 近一年提交 → GitHub 风格提交热力图 HTML（53 周 × 7 天格子五档深浅 + 总提交数 / 最长连续天数 / 活跃占比 / 最活跃日统计卡），离线零依赖、三主题切换。
Renders a GitHub-style commit heatmap (53×7 grid, five intensity levels, stats cards for total commits, longest streak, activity ratio, busiest day) from a year of git history; offline, zero dependencies, three themes.

## 沟通协作 · Communication & Collaboration

### meeting-minutes 会议纪要 / Meeting Minutes
多源材料 → 会议纪要（五段式：会议信息 / 会议结论 / 议题讨论 / 决议与行动项 / 下次会议）：行动项带负责人与截止时间（汇报链源头，可被日报 / 周报 / 月报 / 季报引用）；内置 12 类会议类型词典，支持自定义模板。
Generates five-section meeting minutes (info / conclusions / discussions / resolutions & action items / next meeting) with owners and deadlines on action items that feed into daily/weekly/monthly reports; 12 meeting-type glossaries, custom templates.

### prompt-pouch 锦囊 / Prompt Pouch
提示词本地管理台：生成并维护本地 HTML 管理页面（分组侧栏 / 搜索 / 拖拽与按钮排序 / 收藏 / {变量}插值 / 一键复制 / 标签全交互 / 导入导出 JSON 备份），数据存 data/prompts.json、页面与数据分离，双笔协作（页面直写 + AI 代笔）。
A local prompt management console: groups, search, drag-and-drop sorting, favorites, {variable} interpolation, one-click copy, full tag interactions, JSON import/export backups; data stored separately from the page for dual-hand collaboration.

### decision-log 决策日志 / Decision Log
重要决策四元组日志（结论 / 取舍权衡 / 被否方案 / 适用与失效条件）：按主题聚合落盘、INDEX 索引、随时检索复盘。
Logs important decisions as four-tuples (conclusion / trade-offs / rejected alternatives / applicability & expiry conditions), aggregated by topic with an index for retrieval and review.

## 技能自造 · Meta Skills

### meta-forge 元锻炉 / Meta Forge
元技能：从需求出发锻造完整技能包（薄入口 SKILL.md + resources 拆分 + user-config），自动植入八大机制（CONFIG_VERSION 钥匙 / user-config 抽离 / reference 双轨 / 自检纪律 / preserve 保护清单 / 多文件隔离 / 零侵权脱敏离线 / 产物升级回炉），入仓库时自动登记分类表与发布清单。
The meta-skill that forges new skills: generates a complete skill package (thin SKILL.md entry + resources split + user-config) with eight mechanisms auto-implanted (config versioning, config extraction, reference dual-track, self-check discipline, preserve lists, multi-file isolation, zero-infringement offline discipline, artifact upgrade path).

### skill-doctor 技能体检 / Skill Doctor
技能体检：对技能目录跑静态检查（frontmatter 与目录名一致 / 资源引用可达 / 配置版本 / 占位符残留 / HTML 技能字体脱敏与多文件隔离与版本戳），三段式体检报告带文件行级定位。
A static health check for skill directories: frontmatter-name consistency, reachable resource references, config versions, leftover placeholders, HTML skill font sanitization and multi-file isolation; reports issues with file-and-line locations.

---

## 安装 · Installation

```bash
npm i -g skill-forge-hub        # global CLI
skill-forge ls                  # list all skills
skill-forge init                # interactive pick & install to your agent's skill dir
```

Or copy any skill folder directly into your agent's skills directory — each skill is self-contained.
