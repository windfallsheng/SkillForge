# SkillForge · 技能锻造坊

> 一处集中收纳「AI 手艺」的工坊——把日复一日的重复劳作，锻造成一句指令就能完成的顺手工具。坊中每一件技能都是一份写给 AI 的手艺说明，一句自然语言即可唤起，按既定工序产出标准化成果；手艺与宿主无关——换一份薄薄的 frontmatter 信封，就能从一位 AI 助手带去另一位。

**SkillForge（技能锻造坊）** is a curated collection of AI craft skills — repetitive daily work, forged into tools that answer with a single command. Each skill is a set of craft instructions written for the AI: one natural-language request sets it in motion, and a polished, standardized deliverable comes out the other end — daily and weekly reports, documents dressed into beautiful pages, deployment pipelines, and more. The craft is host-agnostic — a thin frontmatter envelope is all it takes to carry it from one AI assistant to another. Everything here is built for high-frequency everyday work — reusable across projects, dependable on any machine, battle-tested by repeated use.

所有技能均以 SKILL.md 为入口——frontmatter、生成流程、用户可改配置留在入口，重内容按生成阶段拆到 resources/ 或平铺辅助文件（如 design-system.md、scripts/），AI 执行到对应阶段才读取，降低常驻上下文占用。

## 技能分类

按「技能最终产出什么」归类，一个技能只归一类；分类只用于本仓库组织与导航，安装时始终平铺复制到目标 AI 助手的技能目录，与分类无关。

| 分类 | Category | 说明 | 收录技能 |
|:---|:---|:---|:---|
| 报表汇演 | Reports | 多源数据整理（一段文字 / 文件里的描述 / 图片与素材 / 口头补充，什么材料都能成稿），按周期产出报告（日报 / 周报 / 年报） | daily-report、weekly-report、annual-report |
| 文档装裱 | Documents | 文档转换与美化：Word / Markdown / 纯文本 → 精美 HTML + 逐章截图 | article-to-html |
| 工程提效 | Engineering | 开发流水线技能：部署、发布、审查、测试、文档 ↔ 规格互转 | spec-doc2spec、spec-spec2doc |
| 演示汇演 | Slides | HTML 形态、PPT 体验的魔法幻灯：播放引擎 + 多套风格 + 逐页截图 + 全屏放映 | magic-deck |
| 数据整备 | Data | Excel / CSV / 图表、数据清洗与模板整理 | （规划中） |
| 沟通协作 | Communication | 提示词管理（锦囊本地管理台） | prompt-pouch |
| 技能自造 | Meta | 锻造技能本身的元技能（创建技能 / 插件） | meta-forge |

## 技能清单

| 技能 | 分类 | 目录 | 说明 |
|:---|:---|:---|:---|
| daily-report | 报表汇演 | [daily-report/](daily-report/) | 多源数据生成日报（今日任务进度/明日计划/风险阻塞点）：一段文字、文件里的描述、图片或口头补充皆可成稿；支持自然语言日期（今天/昨天/上周三/10月20号）、连续多日批量、自定义模板、12 行业词条 |
| weekly-report | 报表汇演 | [weekly-report/](weekly-report/) | 多源数据生成周报（本周结论 + 本周任务进度/下周计划/风险阻塞点 + 本周概览卡），数据来源同日报；周结束日可配置（默认周五，可改周日等），支持自然语言周定位（本周/上周/10月第2周/节假日锚定） |
| annual-report | 报表汇演 | [annual-report/](annual-report/) | 多源数据生成年度总结（五段式：年度概览/核心成果/经验成长/不足反思/新年规划）：一段文字、文件里的描述、图片或口头补充皆可成稿；12 行业职业词典，支持自定义模板与自然语言年度定位 |
| article-to-html | 文档装裱 | [article-to-html/](article-to-html/) | Word / Markdown / 纯文本 → 精美独立 HTML（思源黑体 + Roboto 商用免费字体，图表 HTML/CSS 重绘），逐章截图（Retina 2x）；现成 HTML 可直接截图或先美化 |
| spec-doc2spec | 工程提效 | [spec-doc2spec/](spec-doc2spec/) | Word / Markdown 需求文档转结构化需求切片；自动检测 Pandoc，未装引导跨系统安装 |
| spec-spec2doc | 工程提效 | [spec-spec2doc/](spec-spec2doc/) | Markdown 规格导出为 Word / PDF 交付文档；自动检测 Pandoc，未装引导跨系统安装 |
| magic-deck | 演示汇演 | [magic-deck/](magic-deck/) | 内容 → 单文件 HTML 幻灯（16:9 舞台 + 播放引擎 + 四套风格 + 全屏放映纯净模式）：自动播放/循环/间隔、键盘热键、页内连接、逐页 PNG 截图与主体复制（不含操作元素） |
| meta-forge | 技能自造 | [meta-forge/](meta-forge/) | 元技能：从需求出发锻造完整技能包（薄入口 + resources 拆分 + user-config），自动植入四大机制（CONFIG_VERSION 钥匙 / user-config 抽离 / reference 双轨 / 自检纪律），入仓库时自动登记 README 与 cli.js 分类表 |
| prompt-pouch | 沟通协作 | [prompt-pouch/](prompt-pouch/) | 锦囊提示词管理台：生成并维护本地 HTML 管理页面（分组侧栏/搜索/拖拽与按钮排序/收藏/{变量}插值/一键复制），数据存 prompts.json，页面与数据分离，双笔协作（页面直写 + AI 代笔） |

## 安装

### 方式一：npm 全局安装（推荐）

```bash
npm i -g skill-forge-hub
skill-forge ls        # 列出全部技能与说明（只读）
skill-forge init      # 交互式挑选技能，自动探测并安装到 AI 助手技能目录
skill-forge update    # 升级已安装技能（配置版本感知，见下）
```

非交互 / 指定目录场景：

```bash
skill-forge init --target ~/.claude/skills --skills daily-report,weekly-report
```

### 方式二：手动复制

将技能目录复制到你所用的 AI 助手的技能目录（支持 SKILL.md 格式、本地加载技能的助手均可）：

```bash
cp -R daily-report weekly-report article-to-html <你的 AI 助手技能目录>/
cp -R spec-doc2spec spec-spec2doc <你的 AI 助手技能目录>/   # 仅 SpecCore 用户需要
```

复制后直接说「写日报」「写周报」或丢给它一个文档即可触发；问「日报怎么用 / 周报怎么用」输出使用说明。

## 升级与配置保护

`skill-forge update`（默认升级全部已装技能，可用 `--skills a,b` 指定）在覆盖技能文件前自动保护你的配置：

- **常驻保护**：目标目录已存在的 `user-config.md`（及技能 `.preserve` 清单声明的文件）永不被覆盖，你的本地配置永久保留
- **版本感知**：官方 `user-config.md` 首行的 `CONFIG_VERSION` 高于你的本地版本（配置结构增/减/改名）时——
  1. 先把你的配置备份为 `user-config.md.bak-<时间戳>`
  2. 交互三选一：`[1] 官方覆盖`（旧配置在备份中随时找回）/ `[2] 保留我的` + 官方版另存 `.upstream` 对照（默认）/ `[3] 稍后处理`
  3. `--yes` 或非交互环境默认 `[2]`，最安全
- **版本一致**：无感升级，只更新技能文件，配置原样保留

技能维护者约定：官方配置结构每次变化（新增/改名/删除配置键）时，`user-config.md` 的 `CONFIG_VERSION` 递增 1，并在 SKILL.md「配置版本机制」节写明迁移规则（AI 每次执行前也会自检该版本）。

## 目录结构

```
.
├── README.md                    # 本文件（双语介绍 + 技能分类）
├── template/                    # 新技能模板（薄入口 + resources 拆分规范）
├── meta-forge/                  # 元技能：造 skill 的 skill（四大机制植入 + 仓库登记）
├── article-to-html/
│   ├── SKILL.md                 # 文档 → 精美 HTML 完整流程 + 逐章截图
│   ├── design-system.md         # 设计系统（字体 / 配色 / 排版 / 图表重绘）
│   └── scripts/                 # 字体安装 / docx 抽取 / 字体内联脚本
├── daily-report/
│   ├── SKILL.md                 # 薄入口：frontmatter + 生成流程 + 默认配置 + 自定义模板
│   └── resources/               # 重内容按生成阶段拆分，AI 按需读取
│       ├── usage-guide.md       # 📖 使用说明（咨询应答的原样输出源）
│       ├── date-parsing.md      # 🗓 日期解析（自然语言优先）
│       ├── data-collection.md   # 📥 数据收集（多源聚合：口述 / 文字 / 文件 / 图片）
│       ├── content-rules.md     # ✍️ 内容规则（聚合来源 / 补充任务 / 纯文字模式 / 输出格式 / 写作风格）
│       ├── industry-dictionary.md # 🏭 行业适配（12 行业职业词典）
│       └── disk-and-html.md     # 💾 本地落盘 / HTML 样式 / content-png 截图规范
├── spec-doc2spec/
│   └── SKILL.md                 # 文档 → 需求规格（委托 SpecCore ask 引擎）
├── spec-spec2doc/
│   └── SKILL.md                 # 规格 → Word / PDF（委托 SpecCore ask 引擎）
└── weekly-report/
    ├── SKILL.md
    └── resources/               # 结构同 daily-report，周报专属差异：
                                 #   WEEK_END 周结束日 / 周定位解析 / 本周概览卡 / 用时 X.XD（1D=8H）
```

## 拆分规范（薄入口 + resources）

- **SKILL.md 只保留**：frontmatter、生成流程总览（每步标注读哪个 resource）、「⚙️ 默认配置」「📝 自定义模板」（用户手改的配置必须留在入口）、规则速览（3-5 条硬性规则）
- **resources/ 一文件一职责**：按生成阶段拆分，SKILL.md 流程节点标注 `读 resources/xxx.md`；每份 resource 独立可读，不互相引用
- **咨询应答**：用户只问用法不要求生成时，读 `resources/usage-guide.md` 原样输出（首行标题按技能改为「XX生成器使用指南」）
- **新技能按 `template/` 结构创建**，目录名 = 技能名（英文短横线），并归入上方「技能分类」表对应分类
- **已有技能按各自结构维护**：article-to-html 采用 SKILL.md + design-system.md + scripts/ 平铺结构；spec-doc2spec / spec-spec2doc 为单文件薄技能（委托 SpecCore ask 引擎）
- **通用原则**：零外部依赖（禁 CDN / 外链，内网离线双击可开）、双系统兼容（macOS / Windows）
- **配置升级**：user-config.md 首行带 `CONFIG_VERSION`，官方配置结构变化时递增并写明迁移规则；CLI update 与 AI 执行时均按该版本做备份 + 迁移提示
- **元技能**：meta-forge 造技能时的规范真相源在 `resources/forge-rules.md`（澄清清单 / 结构规范 / 四大机制 / 校验清单 / 仓库登记），SKILL.md 流程节点与 template/ 模板均与之对齐
