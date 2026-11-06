---
name: weekly-report
description: 生成工作周报（默认本周完成任务/下周计划/风险阻塞点三段结构，中文顿号序号，1D=8H），适配各行业（内置 12 行业职业词典，可指定角色身份）。数据来源灵活：各仓库 git 提交聚合、纯文字、图片或文件整理，无 git 也适用。支持自定义模板（可永久或临时指定）、周结束日可配置（默认周五，可改周日等）。支持自然语言定位周（本周/上周/10月第2周/10月20号所在周等）。当用户请求写周报、本周周报、上周周报、生成周报、/weekly-report，或询问周报用法（周报怎么用/周报使用说明/周报有哪些使用方式）时使用。
allowed-tools: Bash, Read, Write
disable-model-invocation: false
---

# 周报生成

聚合各仓库 git 提交 + 本次会话口述内容生成三段式周报（本周完成任务/下周计划/风险阻塞点 + 本周概览卡），对话输出 md 正文 + 落盘 md/txt/html/content-png 并自动打开 html。

## 生成流程

0. **读用户配置**（DISK/FORMATS/DIR/OPEN_HTML/TEMPLATE/ROLE/CONFIRM、自定义模板）→ 先 Read 同目录 `user-config.md`
1. **解析周**（自然语言 → 目标周：周一起点、WEEK_END 结束日）→ 读 `resources/date-parsing.md`
2. **收集数据**（本周 git + 会话口述 + 口头补充，合并去重；同取上周数据供概览环比）→ 读 `resources/data-collection.md`
3. **内容归类与润色**（聚合来源 / 补充任务 / 纯文字模式 / 输出格式 / 写作风格）→ 读 `resources/content-rules.md`
4. **行业词条**（话术含职业词时按词典取词）→ 读 `resources/industry-dictionary.md`
5. **落盘与截图**（md/txt/html/content-png + 自动打开 html）→ 读 `resources/disk-and-html.md`
6. **使用咨询**（用户只问「周报怎么用」等用法、未要求生成）→ 读 `resources/usage-guide.md`，将其内容原样输出（首行标题改为「周报生成器使用指南」），不收集 git、不生成报告、不落盘、不开浏览器

## ⚙️ 配置与自定义模板

**执行本 skill 前必须先 Read 同目录 `user-config.md`**：默认配置（DISK/FORMATS/DIR/OPEN_HTML/TEMPLATE/ROLE/CONFIRM）与自定义模板都在该文件中，以它为准。升级技能时 user-config.md 不会被覆盖，你的修改永久保留。

## 规则速览

- 完成任务 5-15 点、每点 30-60 字；序号用中文顿号（1、2、3）
- 三段兜底写「暂无」；计划点带进度百分比与预估用时；风险阻塞点三环（问题+影响+建议）
- 用时单位 X.XD（天，1D=8H），估算值注明「约」；落盘子目录名 = 当周最后一天（WEEK_END）日期
- 完整规则（聚合来源 / 纯文字模式 / 写作风格约束 / 使用提示）见 `resources/content-rules.md`
