# 用户配置（升级技能时本文件不会被覆盖）

> 你的个人配置全放在这里。skill-forge 升级技能时官方只更新 SKILL.md 与 resources/，
> 本文件始终保留你的版本——生成目录、登记方式放心改。
> 官方升级若带来新配置点，会另存 `user-config.md.upstream` 对照文件到同目录，
> 你按需查看并手动合并新配置点到本文件。


## ⚙️ 默认配置（用户可手动修改；临时口头要求永远优先）

```yaml
CONFIG_VERSION: 1              # 配置结构版本：skill 升级时若配置结构变化会递增；AI 每次执行前对比 SKILL.md「配置版本机制」节声明的当前版本，不一致时按 SKILL.md 的迁移规则处理（先备份本文件为带时间戳 .bak，再迁移，最后对话告知用户）
DIR: auto                      # 新技能生成目录：auto = 探测 SkillForge 仓库根（~/SkillForge 或含 cli.js 的当前目录）；也可写死绝对路径
REGISTER: true                 # 仓库登记：true = 生成后自动更新 README 技能分类表/技能清单与 cli.js CATEGORIES；false = 只生成技能包不登记
```

> 临时口头要求（仅对当次生效，不修改上方配置）：说「生成到 XX 目录」→ 当次改 DIR；说「不用登记」→ 当次 REGISTER=false。

---
> 更多用法见 SKILL.md 的「生成流程」与 resources/ 分册。
