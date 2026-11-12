---
name: release-notes
description: 从 git 两个版本标签之间的提交生成中英双语发版说明与 CHANGELOG 条目（分类归纳 + 用户视角改写，附提交统计），并给出 npm 发布前自检清单。当用户请求写发版说明、release notes、生成 CHANGELOG 条目、准备发版、发布说明时使用。
allowed-tools: Bash, Read, Write
disable-model-invocation: false
---

# 发版说明（release-notes）

把 git 提交流变成人能读的发版说明：收集提交 → 分类归纳 → 用户视角改写 → 中英双语落盘 → 发布自检清单。

## 生成流程

0. **读用户配置**（REPO/LANG/CHANGELOG_FILE/REL_DIR/STATS/SCOPE_HINT）→ 先 Read 同目录 `user-config.md`
1. **收集提交**（git log 区间聚合 + 口述补充合并去重）→ 读 `resources/collect.md`
2. **分类与改写**（feat/fix/docs 归类，用户视角重写，禁止流水账）→ 读 `resources/write.md`
3. **双语产出与落盘**（RELEASE-{tag}.md 双语 + CHANGELOG 条目插入）→ 读 `resources/write.md`
4. **发布自检清单**（版本号一致性 / npm pack 验证 / tag 推送要点）→ 读 `resources/publish-checklist.md`
5. **使用咨询**（用户只问「发版说明怎么用」等用法、未要求生成）→ 读 `resources/usage-guide.md`，将其内容原样输出（首行标题改为「发版说明生成器使用指南」），不收集提交、不生成任何文件

## ⚙️ 配置与自定义

**执行本 skill 前必须先 Read 同目录 `user-config.md`**：默认配置（REPO/LANG/CHANGELOG_FILE/REL_DIR/STATS/SCOPE_HINT）都在该文件中，以它为准。升级技能时 user-config.md 不会被覆盖，你的修改永久保留；官方更新配置时另存 `user-config.upstream.md` 对照文件，可按需手动合并新配置点。

## 配置版本机制（升级保护）

本 skill 当前配置版本为 `1`（对应 user-config.md 中的 `CONFIG_VERSION`）。执行时若发现 user-config.md 的 CONFIG_VERSION 与本节声明不一致：

1. 先将旧 user-config.md 备份为 `user-config.bak-<时间戳>.md`（同目录，绝不删除旧值）
2. 按本节「配置升级规则」迁移字段：新增字段补默认值、改名字段按映射改写、删除字段的值保留在备份中并在对话提示用户手动确认
3. 更新 CONFIG_VERSION 为当前版本
4. 对话中明确告知用户「检测到配置版本从 X 升级到 Y，旧配置已备份至 <路径>」

升级本 skill 时，配置结构如有变化必须同步更新本节的当前版本号与迁移说明；禁止在未声明版本变更的情况下静默修改配置语义。
## 文档同步自检纪律（维护者必读）

修改本 skill 任一文件（SKILL.md / user-config.md / resources/*）后，必须 grep 全文核对相关关键词在各文件间一致（字段名 / 流程节点 / 模板名改名时新旧词全仓核对，旧词零残留才算完成）。


## 规则速览

- 区间口径：优先两个 tag 之间（git log vA..vB）；只有一个 tag 时取该 tag 到 HEAD；没有 tag 时按提交日期区间或最近 N 次提交，先与用户确认口径
- 用户视角改写：每条「做了什么 + 带来什么价值」，禁止照抄 commit message 流水账；同类合并、无价值提交（chore 琐碎项）一句话带过或忽略
- 中英对照：术语一致性（同一概念同一译法），命令 / 路径 / 文件名 / 版本号不翻译；两份内容语义对齐，排版结构一致
- 发布前必须跑自检清单，版本号三处一致（package.json / README / 源码内嵌）未过不动发布

---

## 🔍 SkillForge 使用指引（整体咨询时触发）

当用户询问 **SkillForge 本身**（不是单个技能用法）——「skillforge 怎么用 / 使用说明 / 使用指引 / 是什么」「技能怎么安装 / 怎么升级 / 装了哪些技能 / 技能清单」「skill-forge ls / init / update 等命令怎么用」「技能安装器 / 技能锻造坊」等（中英文、近似说法均可，关键词可自由扩展）：
1. Read 同目录 `resources/skillforge-guide.txt` 全文，按其内容整理回答（命令与参数以 txt 为准，勿自行编造）
2. 用系统命令打开同目录 `resources/skillforge-guide.html`（macOS `open`，Windows `start`），让用户在浏览器看排版版
3. 用户只问单个技能怎么用时（如「日报怎么用」）不触发本指引，走本技能的使用说明
