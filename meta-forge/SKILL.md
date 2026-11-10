---
name: meta-forge
description: 锻造新技能的元技能（造 skill 的 skill）。按 SkillForge 工坊规范从需求出发生成完整技能包（薄入口 SKILL.md + 按阶段拆分的 resources/ + 用户配置 user-config.md），自动植入四大机制：CONFIG_VERSION 配置版本钥匙、user-config 配置抽离、reference 双轨（含 HTML 输出时）、文档同步自检纪律；技能入 SkillForge 仓库时同步登记 README 分类表与 cli.js CATEGORIES。当用户请求创建新技能、造一个 skill、做一个 XX 技能、把 XX 流程固化成技能，或询问 meta-forge 用法（怎么造技能/元锻炉怎么用）时使用。
allowed-tools: Bash, Read, Write
disable-model-invocation: false
---

# 元锻炉（meta-forge）

把一段重复劳作锻造为标准技能包：薄入口 SKILL.md + 按阶段拆分的 resources/ + 用户配置 user-config.md，植入工坊四大机制后交付——产出可直接安装、可安全升级、可跨宿主迁移的技能。

## 生成流程

0. **读用户配置**（DIR/REGISTER/CONFIG_VERSION）→ 先 Read 同目录 `user-config.md`
1. **需求澄清**（技能名、触发场景、产出形态、可配置项、是否含 HTML 输出、是否入仓库）→ 读 `resources/forge-rules.md` 的「一、澄清清单」
2. **结构生成**（薄入口 + resources 拆分 + 咨询应答接线）→ 读 `resources/forge-rules.md` 的「二、结构规范」
3. **机制植入**（CONFIG_VERSION 钥匙 / user-config 抽离 / reference 双轨 / 自检纪律，四大机制缺一不可）→ 读 `resources/forge-rules.md` 的「三、四大机制」
4. **校验**（frontmatter 格式、resource 引用可达、配置抽离完整、旧词零残留）→ 读 `resources/forge-rules.md` 的「四、校验清单」
5. **仓库登记**（技能入 SkillForge 仓库时：README 技能分类表/技能清单/目录结构 + cli.js CATEGORIES 同步登记，登记后跑 `skill-forge ls` 验证）→ 读 `resources/forge-rules.md` 的「五、仓库登记」
6. **使用咨询**（用户只问「怎么造技能」等用法、未要求创建）→ 读 `resources/usage-guide.md`，将其内容原样输出（首行标题改为「元锻炉使用指南」），不创建任何文件

## ⚙️ 配置与自定义

**执行本 skill 前必须先 Read 同目录 `user-config.md`**：默认配置（DIR/REGISTER/CONFIG_VERSION）都在该文件中，以它为准。升级技能时 user-config.md 不会被覆盖，你的修改永久保留；官方更新配置时另存 `user-config.md.upstream` 对照文件，可按需手动合并新配置点。

## 配置版本机制（升级保护）

本 skill 当前配置版本为 `1`（对应 user-config.md 中的 `CONFIG_VERSION`）。执行时若发现 user-config.md 的 CONFIG_VERSION 与本节声明的当前版本不一致：

1. 先将旧 user-config.md 备份为 `user-config.md.bak-<时间戳>`（同目录，绝不删除旧值）
2. 按本节「配置升级规则」迁移字段：新增字段补默认值、改名字段按映射改写、删除字段的值保留在备份中并在对话提示用户手动确认
3. 更新 CONFIG_VERSION 为当前版本
4. 对话中明确告知用户「检测到配置版本从 X 升级到 Y，旧配置已备份至 <路径>」

升级本 skill 时，配置结构如有变化必须同步更新本节的当前版本号与迁移说明；禁止在未声明版本变更的情况下静默修改配置语义。

## 文档同步自检纪律（维护者必读）

修改本 skill 任一文件（SKILL.md / user-config.md / resources/*）后，必须 grep 全文核对相关关键词在各文件间一致（如机制名/流程节点/字段名改名时新旧词全仓核对，旧词零残留才算完成）。修改 forge-rules.md 的机制规范必须同步检查本 SKILL.md 流程节点与 template/ 模板是否对齐，三者以 forge-rules.md 为规范真相源；改完后互相 grep 关键参数确认对齐。

## 规则速览

- 四大机制缺一不可：CONFIG_VERSION 钥匙（配置版本机制节 + user-config 配置块首行 CONFIG_VERSION: 1）、user-config 抽离（用户可改配置全部出站，SKILL.md 只引用不内嵌）、reference 双轨（含 HTML 输出的技能以 reference.html 为样式真相源）、自检纪律（改一处 grep 全仓）
- 薄入口：SKILL.md 只留 frontmatter / 生成流程 / 配置节 / 机制节 / 规则速览；重内容按阶段拆 resources/，一文件一职责
- 新技能必须带 user-config.md（含 CONFIG_VERSION: 1）与 resources/usage-guide.md（咨询应答原样输出源）
- 完整规则（澄清清单 / 结构规范 / 四大机制 / 校验清单 / 仓库登记）见 `resources/forge-rules.md`
