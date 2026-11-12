---
name: twin-docs
description: 把中文文档翻译并同步为英文版（或反向），术语一致性对齐、标题层级 / 表格 / 代码块 / 链接锚点逐项对应，双向同步检查出差异清单。当用户请求出英文版、翻译成英文、中英同步、双语文档、文档翻译时使用。
allowed-tools: Bash, Read, Write
disable-model-invocation: false
---

# 孪生文档（twin-docs）

中英双语文档保持孪生同步：翻译时术语对齐、结构对齐；改一边时另一边的差异能被查出来。

## 生成流程

0. **读用户配置**（DIRECTION/GLOSSARY_FILE/LINK_RULE/STYLE/SYNC_MODE）→ 先 Read 同目录 `user-config.md`
1. **术语对齐**（glossary 术语表机制，先读后用）→ 读 `resources/glossary.md`
2. **翻译与排版对齐**（结构逐项对应 + 落盘 {name}.en.md）→ 读 `resources/translate.md`
3. **同步自检**（两边结构 diff，输出差异清单与修复）→ 读 `resources/sync-check.md`
4. **使用咨询**（用户只问「孪生文档怎么用」等用法、未要求翻译）→ 读 `resources/usage-guide.md`，将其内容原样输出（首行标题改为「孪生文档使用指南」），不翻译、不落盘

## ⚙️ 配置与自定义

**执行本 skill 前必须先 Read 同目录 `user-config.md`**：默认配置（DIRECTION/GLOSSARY_FILE/LINK_RULE/STYLE/SYNC_MODE）都在该文件中，以它为准。升级技能时 user-config.md 不会被覆盖，你的修改永久保留；官方更新配置时另存 `user-config.md.upstream` 对照文件，可按需手动合并新配置点。

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

- 技术术语 / 命令 / 路径 / 文件名 / 版本号一律不翻译；段落语义对齐，不逐字直译
- 结构逐项对应：标题层级、表格行列、代码块、列表、链接锚点一一对应，中文版有的一行英文版必须有一行
- 术语一致性：同一概念两份文档同一译法；有术语表先读术语表，没有则按规则翻译并顺带收集术语建议
- 同步检查双向：翻译后查英文缺漏，改中文后查英文待同步，差异清单必须落到对话里

---

## 🔍 SkillForge 使用指引（整体咨询时触发）

当用户询问 **SkillForge 本身**（不是单个技能用法）——「skillforge 怎么用 / 使用说明 / 使用指引 / 是什么」「技能怎么安装 / 怎么升级 / 装了哪些技能 / 技能清单」「skill-forge ls / init / update 等命令怎么用」「技能安装器 / 技能锻造坊」等（中英文、近似说法均可，关键词可自由扩展）：
1. Read 同目录 `resources/skillforge-guide.txt` 全文，按其内容整理回答（命令与参数以 txt 为准，勿自行编造）
2. 用系统命令打开同目录 `resources/skillforge-guide.html`（macOS `open`，Windows `start`），让用户在浏览器看排版版
3. 用户只问单个技能怎么用时（如「日报怎么用」）不触发本指引，走本技能的使用说明
