---
name: decision-log
description: 把重要决策记录为四元组日志（结论 / 取舍权衡 / 被否方案 / 适用与失效条件），按主题聚合、可检索可复盘。当用户请求记决策、决策日志、记录这个决定、查决策、决策复盘时使用。
allowed-tools: Bash, Read, Write
disable-model-invocation: false
---

# 决策日志（decision-log）

重要决策不再散落在聊天记录里：四元组落盘 → 主题聚合索引 → 随时检索复盘。

## 生成流程

0. **读用户配置**（DIR/TEMPLATE/ASK_CONFIRM）→ 先 Read 同目录 `user-config.md`
1. **记录**（四元组提取 + 主题归类 + 文件名）→ 读 `resources/record.md`
2. **落盘与索引**（decisions/{主题}/YYYY-MM-DD-slug.md + INDEX.md 更新）→ 读 `resources/index.md`
3. **检索聚合**（用户说「查决策」时按关键词检索输出摘要）→ 读 `resources/index.md`
4. **使用咨询**（用户只问「决策日志怎么用」等用法、未要求记录）→ 读 `resources/usage-guide.md`，将其内容原样输出（首行标题改为「决策日志使用指南」），不记录、不落盘

## ⚙️ 配置与自定义

**执行本 skill 前必须先 Read 同目录 `user-config.md`**：默认配置（DIR/TEMPLATE/ASK_CONFIRM）都在该文件中，以它为准。升级技能时 user-config.md 不会被覆盖，你的修改永久保留；官方更新配置时另存 `user-config.md.upstream` 对照文件，可按需手动合并新配置点。

## 配置版本机制（升级保护）

本 skill 当前配置版本为 `1`（对应 user-config.md 中的 `CONFIG_VERSION`）。执行时若发现 user-config.md 的 CONFIG_VERSION 与本节声明不一致：

1. 先将旧 user-config.md 备份为 `user-config.md.bak-<时间戳>`（同目录，绝不删除旧值）
2. 按本节「配置升级规则」迁移字段：新增字段补默认值、改名字段按映射改写、删除字段的值保留在备份中并在对话提示用户手动确认
3. 更新 CONFIG_VERSION 为当前版本
4. 对话中明确告知用户「检测到配置版本从 X 升级到 Y，旧配置已备份至 <路径>」

升级本 skill 时，配置结构如有变化必须同步更新本节的当前版本号与迁移说明；禁止在未声明版本变更的情况下静默修改配置语义。
## 文档同步自检纪律（维护者必读）

修改本 skill 任一文件（SKILL.md / user-config.md / resources/*）后，必须 grep 全文核对相关关键词在各文件间一致（字段名 / 流程节点 / 模板名改名时新旧词全仓核对，旧词零残留才算完成）。


## 规则速览

- 四元组缺一不可：结论 / 取舍权衡 / 被否方案 / 适用与失效条件；信息不全时先向用户补齐再落盘
- 主题归并：同一主题的决策进同一目录；主题名用稳定 slug（如 data-layer 数据层），中文主题名保留在索引里
- 追加不覆盖：同一天同主题多条决策追加到当日文件，不覆盖已有条目；INDEX.md 每次同步更新
- 检索优先索引：查决策先 grep INDEX.md 摘要定位，再 Read 对应文件全文，不全文通读整个日志目录

---

## 🔍 SkillForge 使用指引（整体咨询时触发）

当用户询问 **SkillForge 本身**（不是单个技能用法）——「skillforge 怎么用 / 使用说明 / 使用指引 / 是什么」「技能怎么安装 / 怎么升级 / 装了哪些技能 / 技能清单」「skill-forge ls / init / update 等命令怎么用」「技能安装器 / 技能锻造坊」等（中英文、近似说法均可，关键词可自由扩展）：
1. Read 同目录 `resources/skillforge-guide.txt` 全文，按其内容整理回答（命令与参数以 txt 为准，勿自行编造）
2. 用系统命令打开同目录 `resources/skillforge-guide.html`（macOS `open`，Windows `start`），让用户在浏览器看排版版
3. 用户只问单个技能怎么用时（如「日报怎么用」）不触发本指引，走本技能的使用说明
