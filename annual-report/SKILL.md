---
name: annual-report
description: 生成年度总结（默认五段式：年度概览/核心成果与里程碑/经验与成长/不足与反思/新年展望与规划），适配各行业（内置 12 行业职业词典，可指定角色身份）。数据来源灵活：各仓库 git 全年提交聚合、纯文字、图片或文件整理，无 git 也适用。支持自定义模板（可永久或临时指定）。支持自然语言指定年度（2026年/去年/近一年/最近12个月等）。当用户请求写年度总结、年终总结、年度复盘、年总结、/annual-report，或询问年度总结用法（年度总结怎么用/年度总结使用说明）时使用。
allowed-tools: Bash, Read, Write
disable-model-invocation: false
---

# 年度总结生成

聚合各仓库 git 全年提交 + 本次会话口述内容生成五段式年度总结（年度概览/核心成果与里程碑/经验与成长/不足与反思/新年展望与规划），对话输出 md 正文 + 落盘 md/txt/html/content-png 并自动打开 html。

## 生成流程

0. **读用户配置**（DISK/FORMATS/DIR/OPEN_HTML/TEMPLATE/ROLE/CONFIRM/CONFIG_VERSION、自定义模板）→ 先 Read 同目录 `user-config.md`
1. **解析年度**（自然语言 → 目标年度区间）→ 读 `resources/date-parsing.md`
2. **收集数据**（git 全年提交聚合 + 会话口述 + 口头补充，合并去重）→ 读 `resources/data-collection.md`
3. **内容归类与润色**（五段式结构 / 聚合来源 / 纯文字模式 / 输出格式 / 写作风格）→ 读 `resources/content-rules.md`
4. **行业词条**（话术含职业词时按词典取词）→ 读 `resources/industry-dictionary.md`
5. **落盘与截图**（md/txt/html/content-png + 自动打开 html）→ 读 `resources/disk-and-html.md`
6. **使用咨询**（用户只问「年度总结怎么用」等用法、未要求生成）→ 读 `resources/usage-guide.md`，将其内容原样输出（首行标题改为「年度总结生成器使用指南」），不收集 git、不生成报告、不落盘、不开浏览器

## ⚙️ 配置与自定义模板

**执行本 skill 前必须先 Read 同目录 `user-config.md`**：默认配置（DISK/FORMATS/DIR/OPEN_HTML/TEMPLATE/ROLE/CONFIRM/CONFIG_VERSION）与自定义模板都在该文件中，以它为准。升级技能时 user-config.md 不会被覆盖，你的修改永久保留；官方更新配置时另存 `user-config.md.upstream` 对照文件，可按需手动合并新配置点。

## 配置版本机制（升级保护）

本 skill 当前配置版本为 `1`（对应 user-config.md 中的 `CONFIG_VERSION`）。执行时若发现 user-config.md 的 CONFIG_VERSION 与本节声明的当前版本不一致：

1. 先将旧 user-config.md 备份为 `user-config.md.bak-<时间戳>`（同目录，绝不删除旧值）
2. 按本节「配置升级规则」迁移字段：新增字段补默认值、改名字段按映射改写、删除字段的值保留在备份中并在对话提示用户手动确认
3. 更新 CONFIG_VERSION 为当前版本
4. 对话中明确告知用户「检测到配置版本从 X 升级到 Y，旧配置已备份至 <路径>」

升级本 skill 时，配置结构如有变化必须同步更新本节的当前版本号与迁移说明；禁止在未声明版本变更的情况下静默修改配置语义。

## 文档同步自检纪律（维护者必读）

修改本 skill 任一文件（SKILL.md / user-config.md / resources/*）后，必须 grep 全文核对相关关键词在各文件间一致（如章节名/字段名/效果参数改名时新旧词全仓核对，旧词零残留才算完成）。修改 HTML 效果必须同步更新 `resources/reference.html` 与 `disk-and-html.md` 对应描述，三者以 reference.html 为真相源；改完后互相 grep 关键参数确认对齐。

## 规则速览

- 五段式骨架行业无关：年度概览（一句话 TL;DR + 3-6 项核心数据卡，数字带同比基准）/ 核心成果与里程碑（按季度 Q1-Q4 时间线 8-12 项，每项 20-40 字 + 价值归因）/ 经验与成长（3-5 条，个人成长允许「我」）/ 不足与反思（2-4 条三环：问题+影响+改进，改进带可验证动作与时间）/ 新年展望与规划（3-5 项目标，各带量化指标、完成标准与分季度行动节点）
- 中文顿号序号（1、2、3）；段内无内容写「暂无」；量化优先（业务结果指标优先于 git 统计），杜绝空话套话；落笔前五问自检（结论/基准/闭环/可验证/归属）
- 行业术语/指标/里程碑主题/风险话术/标题按 `resources/industry-dictionary.md` 职业词典取词（未提职业按 ROLE 画像；标题 = 年份前缀 + 词典「标题」变量，如「2026 研发年度总结」）
- 完整规则（聚合来源 / 纯文字模式 / 写作风格约束 / 使用提示）见 `resources/content-rules.md`
