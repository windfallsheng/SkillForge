# 锻造规范（forge-rules）

造一个新技能要过的全部关口：澄清清单 → 结构规范 → 四大机制 → 校验清单 → 仓库登记。本文档是 meta-forge 的规范真相源，SKILL.md 流程节点与 template/ 模板均与本文档对齐。

## 一、澄清清单（开造前必问）

以下问题未答清不动手：

1. **技能名**：英文短横线（如 daily-report），与目录名一致，2-4 个单词
2. **触发场景**：用户说什么话会触发？写进 description 的触发词；是否只在特定关键词出现时使用（如 speccore 专属技能）
3. **产出形态**：对话输出？落盘文件（哪些格式）？HTML？截图？浏览器打开？
4. **可配置项**：哪些行为用户会想改？→ 全部进 user-config.md
5. **是否含 HTML 输出**：是 → 必须建 reference.html 双轨机制（机制三）；否 → 无此要求
6. **归属**：入 SkillForge 仓库（需登记）还是独立技能（不登记）？

## 二、结构规范（薄入口 + resources 拆分）

```
{skill-name}/
├── SKILL.md               # 薄入口：frontmatter + 生成流程 + 配置节 + 机制节 + 规则速览
├── user-config.md         # 用户可改配置（含 CONFIG_VERSION），升级永不覆盖
└── resources/             # 重内容按生成阶段拆分，一文件一职责
    ├── usage-guide.md     # 咨询应答原样输出源（必建）
    └── {阶段名}.md        # 每个生成阶段一份，独立可读、不互相引用
```

- **SKILL.md 只保留**：frontmatter（name/description/allowed-tools/disable-model-invocation）、生成流程总览（每步标注读哪个 resource；第 0 步固定为「读用户配置 → 先 Read user-config.md」，最后一步固定为「使用咨询 → 读 usage-guide.md 原样输出」）、配置节、配置版本机制节、文档同步自检纪律节、规则速览（3-5 条硬性规则）
- **resources/ 一文件一职责**：按生成阶段拆分；每份独立可读，不互相引用；SKILL.md 流程节点标注 `读 resources/xxx.md`
- **咨询应答**：用户只问用法不要求生成时，读 resources/usage-guide.md 原样输出（首行标题按技能改为「XX使用指南」），不执行任何生成动作

## 三、四大机制（缺一不可）

### 机制一：CONFIG_VERSION 钥匙（配置版本机制）

- user-config.md 的 yaml 块含 `CONFIG_VERSION: N`（初始 1），注释写明用途
- SKILL.md 含「配置版本机制（升级保护）」节，声明当前版本 + 迁移四步（备份 .bak-时间戳 → 按规则迁移 → 更新版本号 → 对话告知用户）
- 配置结构变化（增/删/改名键）时：CONFIG_VERSION 递增 1，SKILL.md 该节写明迁移规则
- 双层校验：CLI update 比对官方/本地版本做备份+询问；AI 每次执行时自检版本，不一致按迁移规则处理
- **无法迁移项处理**（值域失效 / 语义漂移 / 数据不兼容）：三绝不——绝不静默（无法迁移项停下问，不猜值）、绝不丢失（旧值永远在 .bak-时间戳）、一次说清（升级报告三段式：⚠️ 版本与备份路径 / ✅ 已自动迁移清单 / 🟡 无法迁移项逐条附原因+影响+建议替代）；随后 AskUserQuestion 三选项（A 用建议值 / B 用户给新值 / C 保持旧配置——不更新 CONFIG_VERSION，每次执行再提醒）；报告必附回滚一句话；数据文件迁移前先复制 .bak-时间戳，能映射则映射、不能则写兼容层或留备份提示手动整理
- 禁止在未声明版本变更的情况下静默修改配置语义

### 机制二：user-config 抽离（配置出站）

- 用户可能改的一切配置（目录/格式/开关/角色/模板）全部放进 user-config.md，SKILL.md 只在第 0 步引用，不内嵌配置值
- user-config.md 头部写「升级技能时本文件不会被覆盖」+ .upstream 对照说明
- CLI 层：user-config.md 常驻保护（升级永不覆盖）+ 官方新配置另存 .upstream 对照

### 机制三：reference 双轨（仅含 HTML 输出的技能）

- resources/reference.html = 定稿样式真相源；SKILL.md 与样式文档的样式描述只是参数解释与禁止项
- 生成 HTML 必须先 Read reference.html 与样式文档两份，以 reference.html 为骨架模板逐处替换数据
- 修改 HTML 效果必须同步更新 reference.html + 样式文档描述，禁止只改一处；改完互相 grep 关键参数确认对齐
- 铁律写入样式文档首段：「Reference 铁律（最高优先）」

### 机制四：文档同步自检纪律

- 修改技能任一文件（SKILL.md / user-config.md / resources/*）后，必须 grep 全文核对相关关键词在各文件间一致（章节名/字段名/效果参数改名时新旧词全仓核对，旧词零残留才算完成）
- 写入 SKILL.md「文档同步自检纪律（维护者必读）」节

### 机制五：.preserve 保护清单（条件植入）

- 技能含「用户可改的官方文件」（半定制资产：设计系统、模板底稿等，SKILL.md 会引导用户直接修改）时，在技能目录放 `.preserve` 清单（每行一个文件名，# 注释）
- CLI 升级时清单内文件永不覆盖；官方版内容有更新时另存 `.upstream` 对照，供手动合并
- 纯官方资源（resources/ 下 AI 只读不改的文件）不进清单；user-config.md 由 CLI 内置名单保护，无需声明

## 四、校验清单（交付前全过）

1. frontmatter：name 与目录名一致且非占位符 skill-name；description 含触发词
2. resource 引用可达：SKILL.md 每个 `读 resources/xxx.md` 的文件真实存在
3. 配置抽离完整：SKILL.md 无内嵌配置值；user-config.md 含 CONFIG_VERSION: 1
4. 四大机制四节齐全：配置节 / 配置版本机制节 / 自检纪律节 / usage-guide 接线
4b. 用户可改官方文件已声明：含半定制资产（设计系统/模板底稿）时 .preserve 清单存在且列全
5. 旧词零残留：全文 grep 无占位符、无废弃字段名
6. 语言一致：正文中文；技术术语保留原文

## 五、仓库登记（技能入 SkillForge 时）

1. README.md「技能分类」表：有对应分类则收录，无则新增分类行（分类只按「最终产出」归类，一个技能只归一类）
2. README.md「技能清单」表：新增一行（技能 / 分类 / 目录 / 一句话说明）
3. cli.js 的 CATEGORIES 数组：同步登记（name/en/skills），与 README 分类表一致
4. README「目录结构」图：按需补新技能目录
5. 登记后跑 `skill-forge ls` 验证技能出现在正确分类下
