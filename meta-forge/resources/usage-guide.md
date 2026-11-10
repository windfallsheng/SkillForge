# 元锻炉使用指南

meta-forge 是「造 skill 的 skill」：把一段重复劳作，按 SkillForge 工坊规范锻造成完整技能包。

## 能干什么

- 一句话起造：「做一个 XX 技能」「把 XX 流程固化成技能」
- 产出完整技能包：薄入口 SKILL.md + 按阶段拆分的 resources/ + 用户配置 user-config.md + 咨询应答 usage-guide.md
- 自动植入四大机制（工坊标准，缺一不可）：
  1. CONFIG_VERSION 钥匙——配置结构带版本号，升级时自动备份迁移，不丢用户设置
  2. user-config 抽离——用户可改配置全部出站到 user-config.md，升级永不覆盖
  3. reference 双轨——技能含 HTML 输出时，reference.html 是定稿样式真相源，改样式三处同步
  4. 自检纪律——改任一文件 grep 全仓核对关键词，旧词零残留
- 技能入 SkillForge 仓库时，自动登记 README 技能分类表/技能清单/目录结构与 cli.js CATEGORIES

## 怎么用

直接说需求即可，例如：

- 「做一个会议纪要技能」→ 澄清需求后生成技能包
- 「把 git 提交统计流程做成技能，含 HTML 报告」→ 生成并植入 reference 双轨机制
- 「做一个 XX 技能，不用登记进仓库」→ 只生成技能包

只问用法（如「元锻炉怎么用」）时，本指南原样输出，不创建任何文件。

## 新技能长什么样

```
{skill-name}/
├── SKILL.md               # 薄入口：frontmatter + 生成流程 + 配置节 + 机制节 + 规则速览
├── user-config.md         # 用户可改配置（含 CONFIG_VERSION），升级永不覆盖
└── resources/             # 重内容按生成阶段拆分，一文件一职责
    ├── usage-guide.md     # 咨询应答原样输出源（必建）
    └── {阶段名}.md        # 每个生成阶段一份，独立可读、不互相引用
```

## 常见问题

- **和宿主自带的 create-skill / create-plugin 有什么区别？** 它们是宿主通用指引；meta-forge 是工坊专属流水线，产出直接符合 SkillForge 拆分规范与四大机制，可被 skill-forge CLI 安全升级
- **生成后怎么用？** 技能包落盘到 DIR 配置的目录；要安装到 AI 助手，跑 `skill-forge init --skills <技能名>`
- **已有技能怎么升级？** 官方配置结构变化时 CONFIG_VERSION 递增并写明迁移规则，`skill-forge update` 与 AI 执行时都会按版本备份迁移
