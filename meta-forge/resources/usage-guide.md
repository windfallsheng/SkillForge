# 元锻炉使用指南

meta-forge 是「造 skill 的 skill」：把一段重复劳作，按 SkillForge 工坊规范锻造成完整技能包。

## 能干什么

- 一句话起造：「做一个 XX 技能」「把 XX 流程固化成技能」
- 产出完整技能包：薄入口 SKILL.md + 按阶段拆分的 resources/ + 用户配置 user-config.md + 咨询应答 usage-guide.md
- 自动植入机制体系（工坊标准，缺一不可）：
  1. CONFIG_VERSION 钥匙——配置结构带版本号，升级时自动备份迁移，不丢用户设置
  2. user-config 抽离——用户可改配置全部出站到 user-config.md，升级永不覆盖
  3. reference 双轨——技能含 HTML 输出时，reference.html 是定稿样式真相源，改样式三处同步
  4. 多文件隔离——页面有 localStorage 记忆时，键按页面路径命名空间，多份产物互不串台
  5. 零侵权脱敏离线——品牌字体零出现、禁 CDN 页面离线可开、示例数据零真实身份（通用占位）
  6. 自检纪律——改任一文件 grep 全仓核对关键词，旧词零残留
  7. 产物升级回炉——HTML 带模板版本戳，升级后可扫旧产物交互式回炉（浅升级区块替换/深升级 md 重建）
- 交付前跑验证环（偏差必被发现）：静态门禁逐项 grep + 含 HTML 时 Playwright 实测（零 JS 错误 / 键带路径 / 刷新恢复 / 多文件隔离），验证证据随交付报告附上
- 技能入 SkillForge 仓库时，自动登记 README 技能分类表/技能清单/目录结构与 cli.js CATEGORIES

## 怎么用

直接说需求即可，例如：

- 「做一个会议纪要技能」→ 澄清需求后生成技能包
- 「把日报生成流程做成技能，含 HTML 报告」→ 生成并植入 reference 双轨机制
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

- **和宿主自带的 create-skill / create-plugin 有什么区别？** 它们是宿主通用指引；meta-forge 是工坊专属流水线，产出直接符合 SkillForge 拆分规范与机制体系，经验证环实测后交付，可被 skill-forge CLI 安全升级
- **生成后怎么用？** 技能包落盘到 DIR 配置的目录；要安装到 AI 助手，跑 `skill-forge init --skills <技能名>`
- **已有技能怎么升级？** 官方配置结构变化时 CONFIG_VERSION 递增并写明迁移规则，`skill-forge update` 与 AI 执行时都会按版本备份迁移
