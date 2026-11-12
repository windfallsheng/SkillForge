---
name: daily-report
description: 生成工作日报（默认任务进度/明日计划/风险阻塞点三段结构，中文顿号序号），适配各行业（内置 12 行业职业词典，可指定角色身份）。数据来源灵活：直接口述、给一段文字、发文件（Word/PDF/Excel/PPT 等）或图片，都能整理成日报。支持自定义模板（可永久或临时指定）。支持自然语言指定日期（今天/昨天/上周三/10月20号等）。当用户请求写日报、今日日报、昨天的日报、生成日报、/daily-report，或询问日报用法（日报怎么用/日报使用说明/日报有哪些使用方式）时使用。用户说「写总结/工作总结/写个汇报」等未言明周期的词时，先 AskUserQuestion 分流（日报/周报/月报/季报/年报）再执行，不擅自默认。
allowed-tools: Bash, Read, Write
disable-model-invocation: false
---

# 日报生成

多源数据生成三段式日报（今日任务进度/明日计划/风险阻塞点）——数据来源灵活：一段文字、文件里的描述、图片或口头补充皆可成稿；对话输出 md 正文 + 落盘 md/txt/html/content-png 并自动打开 html。

## 生成流程

0.5 **周期歧义分流**：用户说「写总结/工作总结/写个汇报/做一份总结」等未言明周期的词 → AskUserQuestion 五选一（日报/周报/月报/季报/年报）确认周期再继续，不擅自默认
0. **读用户配置**（DISK/FORMATS/DIR/OPEN_HTML/THEME/TEMPLATE/ROLE/CONFIRM/CONFIG_VERSION/DATA_SOURCES、自定义模板）→ 先 Read 同目录 `user-config.md`
1. **解析日期**（自然语言 → 目标日期 YYYY-MM-DD）→ 读 `resources/date-parsing.md`
2. **收集数据**（多源：会话口述 / 文字 / 文件 / 图片 / 代码提交记录，合并去重）→ 读 `resources/data-collection.md`
3. **内容归类与润色**（聚合来源 / 补充任务 / 纯文字模式 / 输出格式 / 写作风格）→ 读 `resources/content-rules.md`
4. **行业词条**（话术含职业词时按词典取词）→ 读 `resources/industry-dictionary.md`
5. **落盘与截图**（md/txt/html/content-png + 自动打开 html）→ 读 `resources/disk-and-html.md`
6. **使用咨询**（用户只问「日报怎么用」等用法、未要求生成）→ 读 `resources/usage-guide.md`，将其内容原样输出（首行标题改为「日报生成器使用指南」），不收集数据、不生成报告、不落盘、不开浏览器

## ⚙️ 配置与自定义模板

**执行本 skill 前必须先 Read 同目录 `user-config.md`**：默认配置（DISK/FORMATS/DIR/OPEN_HTML/THEME/TEMPLATE/ROLE/CONFIRM/CONFIG_VERSION/DATA_SOURCES）与自定义模板都在该文件中，以它为准。升级技能时 user-config.md 不会被覆盖，你的修改永久保留；官方更新配置时另存 `user-config.md.upstream` 对照文件，可按需手动合并新配置点。

- **THEME**：html 页面主题，tech 深蓝科技（默认）/ biz 浅色商务 / mono IDEA 黑亮 / light IDEA 白亮 / warm 温暖渐变；生成时写 `<html data-theme="THEME值">` 定默认，页面右下角换肤坞随点随换（localStorage 记忆、?shot 截图模式与打印隐藏）

## 配置版本机制（升级保护）

本 skill 当前配置版本为 `3`（对应 user-config.md 中的 `CONFIG_VERSION`）。执行时若发现 user-config.md 的 CONFIG_VERSION 与本节声明的当前版本不一致：

1. 先将旧 user-config.md 备份为 `user-config.md.bak-<时间戳>`（同目录，绝不删除旧值）
2. 按本节「配置升级规则」迁移字段：新增字段补默认值、改名字段按映射改写、删除字段的值保留在备份中并在对话提示用户手动确认
3. 更新 CONFIG_VERSION 为当前版本
4. 对话中明确告知用户「检测到配置版本从 X 升级到 Y，旧配置已备份至 <路径>」

升级本 skill 时，配置结构如有变化必须同步更新本节的当前版本号与迁移说明；禁止在未声明版本变更的情况下静默修改配置语义。

**无法迁移项处理**（值域失效 / 语义漂移 / 数据不兼容）：三情形——①旧值不在新值域（如旧模板/主题名已移除）②同名键含义变化（单位/枚举变更）③数据文件 schema 不兼容。三绝不：绝不静默（无法迁移项停下问，不猜值）、绝不丢失（旧值永远在 .bak-时间戳）、一次说清（升级报告三段式：⚠️ 版本与备份路径 → ✅ 已自动迁移清单 → 🟡 无法迁移项逐条附原因+影响+建议替代）；随后 AskUserQuestion 三选项（A 用建议值 / B 用户给新值 / C 保持旧配置——不更新 CONFIG_VERSION，每次执行再提醒）；报告必附回滚一句话；数据文件迁移前先复制 .bak-时间戳，能映射则映射、不能则写兼容层或留备份提示手动整理

当前版本变更记录：v1→v2 新增 THEME 字段（默认 tech；发现旧配置时按迁移规则补默认值）。v2→v3 新增 DATA_SOURCES 数据源清单段（默认空清单 + git/file/remote 三类型示例注释；DIR_MAC/DIR_WIN 默认值通用化——已配置用户保留原值不受影响）。

## 文档同步自检纪律（维护者必读）

修改本 skill 任一文件（SKILL.md / user-config.md / resources/*）后，必须 grep 全文核对相关关键词在各文件间一致（如章节名/字段名/效果参数改名时新旧词全仓核对，旧词零残留才算完成）。修改 HTML 效果必须同步更新 `resources/reference.html` 与 `disk-and-html.md` 对应描述，三者以 reference.html 为真相源；改完后互相 grep 关键参数确认对齐。

## 规则速览

- 任务进度 3-6 点、每点 20-40 字；序号用中文顿号（1、2、3）
- 三段兜底写「暂无」；计划点带进度百分比与预估用时+完成标准（口述有时必写）；风险阻塞点四环（问题+影响+建议+责任与时间，第四环口述有时必写）
- 用时单位 XH（小时），估算值注明「约」
- 数字凡有对比基准必带；业务结果指标优先于提交统计；流水无主语、结论判断归因处允许「我」；落笔前五问自检（结论/基准/闭环/可验证/归属）
- 页面主题五选一（tech 深蓝科技默认 / biz 浅色商务 / mono IDEA 黑亮 / light IDEA 白亮 / warm 温暖渐变）：THEME 配置定默认，右下角换肤坞随点随换
- 完整规则（聚合来源 / 纯文字模式 / 写作风格约束 / 使用提示）见 `resources/content-rules.md`
