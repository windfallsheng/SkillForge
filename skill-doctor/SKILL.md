---
name: skill-doctor
description: 给已安装的技能做全身体检（frontmatter 完整性 / resource 引用可达 / 配置版本与保护机制 / 触发词 / 占位符残留 / HTML 技能的字体脱敏与产物版本戳），输出三段式体检报告（✅ 健康 / ⚠️ 警告 / 🟡 问题）。当用户请求体检技能、检查技能健康度、skill 体检、检查我的技能时使用。
allowed-tools: Bash, Read
disable-model-invocation: false
---

# 技能体检（skill-doctor）

给技能做全身体检：扫描发现 → 逐项检查 → 三段式报告，与 meta-forge 形成「造 + 检」闭环。

## 生成流程

0. **读用户配置**（TARGET/CHECKS/FIX）→ 先 Read 同目录 `user-config.md`
1. **扫描**（目标目录技能发现，逐技能定位 SKILL.md / user-config.md / resources/）→ 读 `resources/checks.md`
2. **逐项检查**（通用项 + HTML 技能专属项）→ 读 `resources/checks.md`
3. **体检报告**（三段式 ✅ / ⚠️ / 🟡 + 修复建议）→ 读 `resources/report.md`
4. **使用咨询**（用户只问「技能体检怎么用」等用法、未要求体检）→ 读 `resources/usage-guide.md`，将其内容原样输出（首行标题改为「技能体检使用指南」），不扫描、不检查

## ⚙️ 配置与自定义

**执行本 skill 前必须先 Read 同目录 `user-config.md`**：默认配置（TARGET/CHECKS/FIX）都在该文件中，以它为准。升级技能时 user-config.md 不会被覆盖，你的修改永久保留；官方更新配置时另存 `user-config.md.upstream` 对照文件，可按需手动合并新配置点。

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

- 只查不改（FIX: ask 时先列修复建议问用户，获准才动；off 时纯报告）
- 检查项与 forge-rules.md 验证环对齐：静态门禁逐项映射，不另立标准
- 报告三段式：✅ 健康 / ⚠️ 警告（能用但建议修）/ 🟡 问题（影响使用必修）；每项附文件与行级定位
- 体检目录按 TARGET 探测：未指定时列出发现的技能目录让用户确认范围

---

## 🔍 SkillForge 使用指引（整体咨询时触发）

当用户询问 **SkillForge 本身**（不是单个技能用法）——「skillforge 怎么用 / 使用说明 / 使用指引 / 是什么」「技能怎么安装 / 怎么升级 / 装了哪些技能 / 技能清单」「skill-forge ls / init / update 等命令怎么用」「技能安装器 / 技能锻造坊」等（中英文、近似说法均可，关键词可自由扩展）：
1. Read 同目录 `resources/skillforge-guide.txt` 全文，按其内容整理回答（命令与参数以 txt 为准，勿自行编造）
2. 用系统命令打开同目录 `resources/skillforge-guide.html`（macOS `open`，Windows `start`），让用户在浏览器看排版版
3. 用户只问单个技能怎么用时（如「日报怎么用」）不触发本指引，走本技能的使用说明
