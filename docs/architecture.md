# 架构与规范

[English](architecture.en.md)

> 本文档描述仓库目录结构、技能形态（薄入口 + resources）、八大机制与拆分规范。

## 目录结构

```
.
├── README.md                    # 介绍 + 产物画廊 + 技能分类 + 技能清单（英文版 README.en.md）
├── CHANGELOG.md                 # 版本变更记录（英文版 CHANGELOG.en.md）
├── docs/                        # 文档（安装升级 / 架构规范 / 使用示例 / 产物截图，中英一一对应）
│   ├── install.md               # 安装与升级详解（英文版 install.en.md）
│   ├── architecture.md          # 本文档（英文版 architecture.en.md）
│   ├── usage-examples.md        # 技能使用场景示例（英文版 usage-examples.en.md）
│   └── images/                  # 产物成品截图
├── cli.js                       # 安装器（ls / init / update，零依赖 Node>=14）
├── package.json                 # npm 包定义（skill-forge-hub，命令名 skill-forge）
├── template/                    # 新技能模板（薄入口 + resources 拆分规范）
├── meta-forge/                  # 元技能：造 skill 的 skill（八大机制植入 + 仓库登记）
├── article-to-html/
│   ├── SKILL.md                 # 文档 → 精美 HTML 完整流程 + 逐章截图（含内嵌使用说明）
│   ├── design-system.md         # 设计系统（字体 / 配色 / 排版 / 图表重绘）
│   ├── user-config.md           # ⚙️ 用户配置（THEME 等，升级不覆盖）
│   ├── .preserve                # 升级保留清单（design-system.md 用户可改）
│   └── scripts/                 # 字体安装 / docx 抽取 / 字体内联脚本
├── daily-report/（weekly-report / monthly-report / quarterly-report / annual-report 同构）
│   ├── SKILL.md                 # 薄入口：frontmatter + 生成流程 + 规则速览
│   ├── user-config.md           # ⚙️ 用户配置（CONFIG_VERSION + 默认配置 + 自定义模板）
│   └── resources/               # 重内容按生成阶段拆分，AI 按需读取
│       ├── usage-guide.md       # 📖 使用说明（咨询应答的原样输出源）
│       ├── date-parsing.md      # 🗓 日期解析（自然语言优先）
│       ├── data-collection.md   # 📥 数据收集（多源聚合：口述 / 文字 / 文件 / 图片）
│       ├── content-rules.md     # ✍️ 内容规则（聚合来源 / 纯文字模式 / 输出格式 / 写作风格）
│       ├── industry-dictionary.md # 🏭 行业适配（12 行业职业词典）
│       └── disk-and-html.md     # 💾 本地落盘 / HTML 样式 / content-png 截图规范
├── magic-deck/
│   ├── SKILL.md                 # 薄入口：魔法幻灯生成流程 + 规则速览
│   ├── user-config.md           # ⚙️ 用户配置
│   └── resources/
│       ├── usage-guide.md       # 📖 使用说明（功能/热键/截图/复制/全屏）
│       ├── deck-spec.md         # 完整规范（骨架/主题色值/模板库/热键表/截图实现）
│       └── reference.html       # 成品骨架（生成时以此为骨逐处替换内容）
├── deck-stage/
│   ├── SKILL.md                 # 薄入口：登台 PPTX 三问交互 + 生成流程
│   ├── user-config.md           # ⚙️ 用户配置
│   ├── package.json             # 依赖声明（pptxgenjs）
│   └── resources/
│       ├── usage-guide.md       # 📖 使用说明
│       ├── data-schema.md       # data.json 结构（段落 → 页类型/节色映射）
│       ├── pptx-builder.js      # 真相源：读 data.json 产 16:9 pptx
│       └── cover-template.html  # 封面/结尾截图底版
├── prompt-pouch/
│   ├── SKILL.md                 # 薄入口：锦囊管理台生成流程
│   ├── user-config.md           # ⚙️ 用户配置（DIR/DATA_DIR/BACKUP_DIR 等）
│   └── resources/
│       ├── usage-guide.md       # 📖 使用说明
│       ├── data-format.md       # prompts.json 数据格式
│       └── reference.html       # 成品骨架
├── spec-doc2spec/（spec-spec2doc 同构）
│   ├── SKILL.md                 # 薄入口：Pandoc 转换 + AI 校对流程
│   ├── user-config.md           # ⚙️ 用户配置
│   └── resources/               # 分册：checklist 校对清单 / images 图片处理 / structure 目录组织 / pdf-path PDF 双路径 / usage-guide
├── quarterly-report/            # 结构同 daily-report，季报专属差异：环比/同比双基准 / Q1-Q4 走势图 / M1-M3 月时间线
├── meeting-minutes/             # 结构同 daily-report，纪要专属差异：五段式 / 行动项三要素 / 12 类会议词典
└── weekly-report/               # 结构同 daily-report，周报专属差异：WEEK_END 周结束日 / 周定位解析 / 本周概览卡 / 用时 X.XD（1D=8H）
```

## 技能形态

- **SKILL.md 只保留**：frontmatter、生成流程总览（每步标注读哪个 resource）、「⚙️ 配置与自定义模板」指引段（用户可改配置全部出站在 user-config.md，执行前必须先 Read）、规则速览（3-5 条硬性规则）。
- **resources/ 一文件一职责**：按生成阶段拆分，SKILL.md 流程节点标注 `读 resources/xxx.md`；每份 resource 独立可读，不互相引用。
- **咨询应答**：用户只问用法不要求生成时，读 `resources/usage-guide.md` 原样输出（首行标题按技能改为「XX生成器使用指南」）。
- **用户配置抽离**：所有用户可改内容在 `user-config.md`（首行 `CONFIG_VERSION`），升级永不覆盖。

## 八大机制

| 机制 | 说明 |
|:---|:---|
| CONFIG_VERSION 钥匙 | `user-config.md` 首行声明配置结构版本；官方结构变化（新增/改名/删除配置键）时递增 1 并在 SKILL.md「配置版本机制」节写明迁移规则。CLI 升级与 AI 执行前都自检该版本：版本升了 → 备份 `.bak-时间戳` → 交互三选一（官方覆盖 / 保留我的 + `.upstream` 对照 / 稍后处理）。 |
| user-config 抽离 | 用户可改内容（默认配置 + 自定义模板）从 SKILL.md 抽离到独立 `user-config.md`，SKILL.md 只留指引段（执行前必须先 Read）。升级时 BUILTIN_PRESERVE + 技能 `.preserve` 清单双重保护，本地修改永久保留。含自定义模板等内容节的技能，SKILL.md 须点名用户内容节为升级保护区 + 配置版本机制节含模板保全声明（迁移只动 yaml 块字段、用户内容节原样保留）。 |
| reference 双轨 | 成品 HTML 形态的技能（报表族 / 魔法幻灯 / 锦囊）以 `resources/reference.html` 为视觉真相源：生成时以此为骨逐处替换内容，保证产物样式与官方演示一致；产物头部带 `sf-template` 版本戳 + 稳定 ID meta，按「产物升级（回炉）」节可把旧产物升级到新模板。 |
| 文档同步自检纪律 | 改任一文件 grep 全仓核对关键词，旧词零残留；交付前硬门禁：Playwright/Chrome headless 打开产物零 JS 错误 + 截图验证内容完整；静态门禁（frontmatter 与版本声明一致）。ID 格式定死（crypto.randomUUID() 标准 v4），落盘前顺扫目录查重。 |
| .preserve 保护清单 | 技能含半定制资产（设计系统 / 模板底稿等用户可改文件）时，用 `.preserve` 清单声明：CLI 升级永不覆盖这些文件，官方更新另存 `.upstream` 对照，可按需手动合并。 |
| 多文件隔离 | 页面有 localStorage 记忆时，键按页内嵌唯一 ID（标准 UUID v4）命名空间——多份产物互不串台、改名/移动目录记忆不丢；页面执行层自愈：id meta 非法/缺失时按路径键自愈为标准 v4 并回写 meta。 |
| 零侵权脱敏离线 | 品牌字体零出现（只用免费商用字体）、禁 CDN 页面离线可开、示例数据零真实身份（通用占位）。 |
| 产物升级回炉 | HTML 带模板版本戳（业务/数据格式/页面改动均 bump），升级后可扫旧产物交互式回炉（浅升级区块替换 / 深升级 md 重建），生成时顺扫旧版主动提示触发语；用户数据类深升级重建必须沿用原页稳定 ID（换 ID = 数据失联），数据文件一概不动；重复性 .bak-时间戳 留档（AI 代笔写回前备份、回炉/报修旧页备份）滚动只留最近 3 份、超出删旧，一次性结构迁移档不滚。 |

## 拆分规范

- **新技能按 `template/` 结构创建**，目录名 = 技能名（英文短横线），并归入 README「技能分类」表对应分类 + 同步 cli.js CATEGORIES 与 package.json files。
- **已有技能按各自结构维护**：article-to-html 采用 SKILL.md + design-system.md + scripts/ 平铺结构（使用说明内嵌 SKILL.md「用户使用说明」节）。
- **通用原则**：零外部依赖（禁 CDN / 外链，内网离线双击可开）、双系统兼容（macOS / Windows）。
- **配置升级**：user-config.md 首行带 `CONFIG_VERSION`，官方配置结构变化时递增并写明迁移规则；CLI update 与 AI 执行时均按该版本做备份 + 迁移提示。
- **元技能**：meta-forge 造技能时的规范真相源在 `resources/forge-rules.md`（澄清清单 / 结构规范 / 八大机制 / 校验清单 / 仓库登记），SKILL.md 流程节点与 template/ 模板均与之对齐。
