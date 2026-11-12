# 架构与规范 · Architecture & Conventions

> 本文档描述仓库目录结构、技能形态（薄入口 + resources）、四大机制与拆分规范。This document describes the repository layout, skill anatomy (thin entry + resources), the four core mechanisms, and the splitting conventions.

## 目录结构 · Directory Layout

```
.
├── README.md                    # 双语介绍 + 产物画廊 + 技能分类 + 技能清单 · bilingual intro, gallery, categories, skill list
├── CHANGELOG.md                 # 版本变更记录 · version changelog
├── docs/                        # 文档（安装升级 / 架构规范 / 产物截图）· docs (install / architecture / screenshots)
│   ├── install.md               # 安装与升级详解 · installation & upgrade
│   ├── architecture.md          # 本文档 · this document
│   └── images/                  # 产物成品截图 · output screenshots
├── cli.js                       # 安装器（ls / init / update，零依赖 Node>=14）· installer, zero-dependency Node>=14
├── package.json                 # npm 包定义（skill-forge-hub，命令名 skill-forge）· npm package definition
├── template/                    # 新技能模板（薄入口 + resources 拆分规范）· new-skill template
├── meta-forge/                  # 元技能：造 skill 的 skill（四大机制植入 + 仓库登记）· meta skill: forges skills
├── article-to-html/
│   ├── SKILL.md                 # 文档 → 精美 HTML 完整流程 + 逐章截图（含内嵌使用说明）
│   ├── design-system.md         # 设计系统（字体 / 配色 / 排版 / 图表重绘）· design system
│   ├── user-config.md           # ⚙️ 用户配置（THEME 等，升级不覆盖）· user config
│   ├── .preserve                # 升级保留清单（design-system.md 用户可改）· extra preserve list
│   └── scripts/                 # 字体安装 / docx 抽取 / 字体内联脚本 · font & extraction scripts
├── daily-report/（weekly-report / monthly-report / quarterly-report / annual-report 同构 · same shape）
│   ├── SKILL.md                 # 薄入口：frontmatter + 生成流程 + 规则速览 · thin entry
│   ├── user-config.md           # ⚙️ 用户配置（CONFIG_VERSION + 默认配置 + 自定义模板）· user config
│   └── resources/               # 重内容按生成阶段拆分，AI 按需读取 · heavy content split by stage
│       ├── usage-guide.md       # 📖 使用说明（咨询应答的原样输出源）· usage guide
│       ├── date-parsing.md      # 🗓 日期解析（自然语言优先）· date parsing
│       ├── data-collection.md   # 📥 数据收集（多源聚合：口述 / 文字 / 文件 / 图片）· data collection
│       ├── content-rules.md     # ✍️ 内容规则（聚合来源 / 纯文字模式 / 输出格式 / 写作风格）· content rules
│       ├── industry-dictionary.md # 🏭 行业适配（12 行业职业词典）· industry dictionary
│       └── disk-and-html.md     # 💾 本地落盘 / HTML 样式 / content-png 截图规范 · disk & HTML spec
├── magic-deck/
│   ├── SKILL.md                 # 薄入口：魔法幻灯生成流程 + 规则速览 · thin entry
│   ├── user-config.md           # ⚙️ 用户配置 · user config
│   └── resources/
│       ├── usage-guide.md       # 📖 使用说明（功能/热键/截图/复制/全屏）· usage guide
│       ├── deck-spec.md         # 完整规范（骨架/主题色值/模板库/热键表/截图实现）· full deck spec
│       └── reference.html       # 成品骨架（生成时以此为骨逐处替换内容）· output skeleton
├── deck-stage/
│   ├── SKILL.md                 # 薄入口：登台 PPTX 三问交互 + 生成流程 · thin entry
│   ├── user-config.md           # ⚙️ 用户配置 · user config
│   ├── package.json             # 依赖声明（pptxgenjs）· dependency declaration
│   └── resources/
│       ├── usage-guide.md       # 📖 使用说明 · usage guide
│       ├── data-schema.md       # data.json 结构（段落 → 页类型/节色映射）· data schema
│       ├── pptx-builder.js      # 真相源：读 data.json 产 16:9 pptx · source of truth
│       └── cover-template.html  # 封面/结尾截图底版 · cover/closing capture template
├── prompt-pouch/
│   ├── SKILL.md                 # 薄入口：锦囊管理台生成流程 · thin entry
│   ├── user-config.md           # ⚙️ 用户配置（DIR/DATA_DIR/BACKUP_DIR 等）· user config
│   └── resources/
│       ├── usage-guide.md       # 📖 使用说明 · usage guide
│       ├── data-format.md       # prompts.json 数据格式 · data format
│       └── reference.html       # 成品骨架 · output skeleton
├── spec-doc2spec/（spec-spec2doc 同构 · same shape）
│   ├── SKILL.md                 # 薄入口：Pandoc 转换 + AI 校对流程 · thin entry
│   ├── user-config.md           # ⚙️ 用户配置 · user config
│   └── resources/               # 分册：checklist 校对清单 / images 图片处理 / structure 目录组织 / pdf-path PDF 双路径 / usage-guide
├── quarterly-report/            # 结构同 daily-report，季报专属差异：环比/同比双基准 / Q1-Q4 走势图 / M1-M3 月时间线
├── meeting-minutes/             # 结构同 daily-report，纪要专属差异：五段式 / 行动项三要素 / 12 类会议词典
└── weekly-report/               # 结构同 daily-report，周报专属差异：WEEK_END 周结束日 / 周定位解析 / 本周概览卡 / 用时 X.XD（1D=8H）
```

## 技能形态 · Skill Anatomy

- **SKILL.md 只保留**：frontmatter、生成流程总览（每步标注读哪个 resource）、「⚙️ 默认配置」「📝 自定义模板」（用户手改的配置必须留在入口）、规则速览（3-5 条硬性规则）。SKILL.md keeps only: frontmatter, the generation-flow overview (each step names its resource), the user-config pointer, and a rules summary (3-5 hard rules).
- **resources/ 一文件一职责**：按生成阶段拆分，SKILL.md 流程节点标注 `读 resources/xxx.md`；每份 resource 独立可读，不互相引用。resources/ is one-file-one-job: split by generation stage, each file standalone, no cross-references.
- **咨询应答**：用户只问用法不要求生成时，读 `resources/usage-guide.md` 原样输出（首行标题按技能改为「XX生成器使用指南」）。Usage-only questions read usage-guide.md and echo it verbatim.
- **用户配置抽离**：所有用户可改内容在 `user-config.md`（首行 `CONFIG_VERSION`），升级永不覆盖。All user-editable content lives in user-config.md (CONFIG_VERSION on the first line), never overwritten on upgrade.

## 四大机制 · The Four Core Mechanisms

| 机制 Mechanism | 说明 Description |
|:---|:---|
| CONFIG_VERSION 钥匙<br>CONFIG_VERSION key | `user-config.md` 首行声明配置结构版本；官方结构变化（新增/改名/删除配置键）时递增 1 并在 SKILL.md「配置版本机制」节写明迁移规则。CLI 升级与 AI 执行前都自检该版本：版本升了 → 备份 `.bak-时间戳` → 交互三选一（官方覆盖 / 保留我的 + `.upstream` 对照 / 稍后处理）。<br>First line of user-config.md declares the config-structure version; bump by 1 whenever the official structure changes (keys added / renamed / removed) and document migration rules in SKILL.md. Both the CLI updater and the AI self-check this version before running. |
| user-config 抽离<br>user-config extraction | 用户可改内容（默认配置 yaml + 自定义模板）从 SKILL.md 抽离到独立 `user-config.md`，SKILL.md 只留指引段（执行前必须先 Read）。升级时 BUILTIN_PRESERVE + 技能 `.preserve` 清单双重保护，本地修改永久保留。<br>User-editable content (default config + custom templates) is extracted from SKILL.md into user-config.md; SKILL.md keeps only the pointer. BUILTIN_PRESERVE plus the skill's .preserve list guard it on upgrade. |
| reference 双轨<br>reference dual-track | 成品 HTML 形态的技能（报表族 / 魔法幻灯 / 锦囊）以 `resources/reference.html` 为视觉真相源：生成时以此为骨逐处替换内容，保证产物样式与官方演示一致；产物头部带 `sf-template` 版本戳 + 稳定 ID meta，按「产物升级（回炉）」节可把旧产物升级到新模板。<br>Skills that produce HTML keep a reference.html as the visual source of truth; generation clones its skeleton, so output matches the official demo. Outputs carry an sf-template version stamp + stable ID meta, enabling "回炉" (reforge) upgrades of old outputs. |
| 自检纪律<br>self-check discipline | 交付前硬门禁：Playwright/Chrome headless 打开产物零 JS 错误 + 截图验证内容完整；静态门禁（grep 残留旧词 / frontmatter 与版本声明一致）。ID 格式定死（crypto.randomUUID() 标准 v4），落盘前顺扫目录查重。<br>Hard gates before delivery: headless open with zero JS errors + screenshot proof; static gates (no stale terms, consistent frontmatter). IDs are locked to the standard UUID v4 format and checked for collisions before writing. |

## 拆分规范 · Splitting Conventions

- **新技能按 `template/` 结构创建**，目录名 = 技能名（英文短横线），并归入 README「技能分类」表对应分类 + 同步 cli.js CATEGORIES 与 package.json files。New skills follow the template/ structure, directory name = skill name (lowercase-hyphen), and must be registered in the README category table + cli.js CATEGORIES + package.json files.
- **已有技能按各自结构维护**：article-to-html 采用 SKILL.md + design-system.md + scripts/ 平铺结构（使用说明内嵌 SKILL.md「用户使用说明」节）。Existing skills keep their own shape; article-to-html uses a flat SKILL.md + design-system.md + scripts/ layout.
- **通用原则**：零外部依赖（禁 CDN / 外链，内网离线双击可开）、双系统兼容（macOS / Windows）。General principles: zero external dependencies (no CDN / external links, offline double-click works), cross-platform (macOS / Windows).
- **配置升级**：user-config.md 首行带 `CONFIG_VERSION`，官方配置结构变化时递增并写明迁移规则；CLI update 与 AI 执行时均按该版本做备份 + 迁移提示。Config upgrades: bump CONFIG_VERSION and document migration rules; both CLI update and AI execution back up and prompt accordingly.
- **元技能**：meta-forge 造技能时的规范真相源在 `resources/forge-rules.md`（澄清清单 / 结构规范 / 四大机制 / 校验清单 / 仓库登记），SKILL.md 流程节点与 template/ 模板均与之对齐。For the meta skill, forge-rules.md is the source of truth (clarification checklist / structure / four mechanisms / validation / repo registration); SKILL.md flow and template/ both align with it.
