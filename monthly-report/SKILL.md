---
name: monthly-report
description: 生成工作月报（默认月度概览/本月关键成果/问题与改进/下月计划四段结构，中文顿号序号），适配各行业（内置 12 行业职业词典，可指定角色身份）。数据来源灵活：直接口述、给一段文字、发文件（Word/PDF/Excel/PPT 等）或图片，都能整理成月报；开发类用户可聚合代码仓库当月提交。支持自定义模板（可永久或临时指定）。支持自然语言指定月份（这个月/上个月/10月/近一个月/最近30天等）。当用户请求写月报、月度总结、月度复盘、本月总结、月总结、/monthly-report，或询问月报用法（月报怎么用/月报使用说明）时使用。用户说「写总结/工作总结/写个汇报」等未言明周期的词时，先 AskUserQuestion 分流（日报/周报/月报/季报/年报）再执行，不擅自默认。
allowed-tools: Bash, Read, Write
disable-model-invocation: false
---

# 月度总结生成

聚合各仓库 git 当月提交 + 本次会话口述内容生成四段式月度总结（月度概览/本月关键成果/问题与改进/下月计划），对话输出 md 正文 + 落盘 md/txt/html/content-png 并自动打开 html。

## 生成流程

0. **读用户配置**（DISK/FORMATS/DIR/OPEN_HTML/TEMPLATE/ROLE/CONFIRM、自定义模板）→ 先 Read 同目录 `user-config.md`
1. **解析月份**（自然语言 → 目标月份区间）→ 读 `resources/date-parsing.md`
2. **收集数据**（git 当月提交聚合 + 会话口述 + 口头补充，合并去重）→ 读 `resources/data-collection.md`
3. **内容归类与润色**（四段式结构 / 聚合来源 / 纯文字模式 / 输出格式 / 写作风格）→ 读 `resources/content-rules.md`
4. **行业词条**（话术含职业词时按词典取词）→ 读 `resources/industry-dictionary.md`
5. **落盘与截图**（md/txt/html/content-png + 自动打开 html）→ 读 `resources/disk-and-html.md`
6. **使用咨询**（用户只问「月报怎么用」等用法、未要求生成）→ 读 `resources/usage-guide.md`，将其内容原样输出（首行标题改为「月度总结生成器使用指南」），不收集 git、不生成报告、不落盘、不开浏览器

## ⚙️ 配置与自定义模板

**执行本 skill 前必须先 Read 同目录 `user-config.md`**：默认配置（DISK/FORMATS/DIR/OPEN_HTML/TEMPLATE/ROLE/CONFIRM）与自定义模板都在该文件中，以它为准。升级技能时 user-config.md 不会被覆盖，你的修改永久保留。

## 规则速览

- 四段式骨架行业无关：月度概览（一句话 TL;DR + 3-5 项核心数据卡，数字必带环比上月基准）/ 本月关键成果（按周 W1-W4 时间线 6-10 项，每项 20-40 字）/ 问题与改进（2-4 条三环：问题+影响+改进）/ 下月计划（3-5 项目标，各带量化指标与周级行动节点）
- 中文顿号序号（1、2、3）；段内无内容写「暂无」；量化优先，杜绝空话套话
- 行业术语/指标/里程碑主题/风险话术按 `resources/industry-dictionary.md` 职业词典取词（未提职业按 ROLE 画像）
- 完整规则（聚合来源 / 纯文字模式 / 写作风格约束 / 使用提示）见 `resources/content-rules.md`
