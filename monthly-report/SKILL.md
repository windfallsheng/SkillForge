---
name: monthly-report
description: 生成工作月报（默认月度概览/本月关键成果/问题与改进/下月计划四段结构，中文顿号序号），适配各行业（内置 12 行业职业词典，可指定角色身份）。数据来源灵活：直接口述、给一段文字、发文件（Word/PDF/Excel/PPT 等）或图片，都能整理成月报；开发类用户可聚合代码仓库当月提交。支持自定义模板（可永久或临时指定）。支持自然语言指定月份（这个月/上个月/10月/近一个月/最近30天等）。当用户请求写月报、月度总结、月度复盘、本月总结、月总结、/monthly-report，或询问月报用法（月报怎么用/月报使用说明）时使用。用户说「写总结/工作总结/写个汇报」等未言明周期的词时，先 AskUserQuestion 分流（日报/周报/月报/季报/年报）再执行，不擅自默认。
allowed-tools: Bash, Read, Write
disable-model-invocation: false
---

# 月度总结生成

聚合各仓库 git 当月提交 + 本次会话口述内容生成四段式月度总结（月度概览/本月关键成果/问题与改进/下月计划），对话输出 md 正文 + 落盘 md/txt/html/content-png 并自动打开 html。

## 生成流程

0.5 **周期歧义分流**：用户说「写总结/工作总结/写个汇报/做一份总结」等未言明周期的词 → AskUserQuestion 五选一（日报/周报/月报/季报/年报）确认周期再继续，不擅自默认
0. **读用户配置**（DISK/FORMATS/DIR/OPEN_HTML/TEMPLATE/ROLE/CONFIRM、自定义模板）→ 先 Read 同目录 `user-config.md`
1. **解析月份**（自然语言 → 目标月份区间）→ 读 `resources/date-parsing.md`
2. **收集数据**（git 当月提交聚合 + 会话口述 + 口头补充，合并去重）→ 读 `resources/data-collection.md`
3. **内容归类与润色**（四段式结构 / 聚合来源 / 纯文字模式 / 输出格式 / 写作风格）→ 读 `resources/content-rules.md`
4. **行业词条**（话术含职业词时按词典取词）→ 读 `resources/industry-dictionary.md`
5. **落盘与截图**（md/txt/html/content-png + 自动打开 html）→ 读 `resources/disk-and-html.md`
5.5 **交付前自检**（落盘与截图前必做，硬门禁不可跳过）：monthly-report-YYYY-MM.html 文件写好后——
   - Bash 起 `python3 -m http.server 8945`（后台，端口占用换 8946/8947…）
   - Playwright headless 自检（缺则 `pip3 install --user playwright`；用系统 Chrome，channel="chrome" 无需下载浏览器）：goto 页面 → 挂 pageerror 监听（零容忍）→ 滚动到底部 → 断言头部标题卡与月度概览/本月关键成果/问题与改进/下月计划四张分节卡存在（证明主体结构完整未被破坏）
   - 截全页 PNG Read 自查：头部标题卡与月度概览/本月关键成果/问题与改进/下月计划四张分节卡齐全、文字无溢出截断、无豆腐块缺字
   - 任何报错或视觉问题：修 HTML → 重检；全绿才进第 6 步
6. **使用咨询**（用户只问「月报怎么用」等用法、未要求生成）→ 读 `resources/usage-guide.md`，将其内容原样输出（首行标题改为「月度总结生成器使用指南」），不收集 git、不生成报告、不落盘、不开浏览器

## ⚙️ 配置与自定义模板

**执行本 skill 前必须先 Read 同目录 `user-config.md`**：默认配置（DISK/FORMATS/DIR/OPEN_HTML/TEMPLATE/ROLE/CONFIRM）与自定义模板都在该文件中，以它为准。升级技能时 user-config.md 不会被覆盖，你的修改永久保留。
- **THEME**：html 页面主题，tech 深蓝科技（默认）/ biz 浅色商务 / mono IDEA 黑亮 / light IDEA 白亮 / warm 温暖渐变；生成时写 `<html data-theme="THEME值">` 定默认，页面右下角换肤坞随点随换（localStorage 记忆（键按页内嵌唯一 ID 隔离、多份产物互不串台、改名/移动目录记忆不丢（生成时头部写 `<meta name="monthly-id" content="<UUID>">`，每次 crypto.randomUUID() 生成标准 UUID v4（8-4-4-4-12 十六进制，禁止手写变体、禁止沿用占位与旧值）；落盘写文件前顺扫落盘目录下本技能命名的 html，读各文件 id meta 查重，撞号重掷至不重复））、?shot 截图模式与打印隐藏）
- **DATA_SOURCES**：数据源清单（默认空清单 + git/file/remote 三类型示例注释），个人数据源只写 user-config.md，本文件随升级覆盖
- **DATA_SOURCES 意图路由**：用户说「把这些 git 地址 / 目录配置到这个 skill」「数据源加一下」「以后数据从 XX 仓库取」→ 默认指配置到 `user-config.md` 的 `DATA_SOURCES` 数据源清单（不是 SKILL.md、不是 disk-and-html.md）；「git 地址」给的是 URL 或本地仓库路径、目录给的是本地路径都写进 DATA_SOURCES。用户话术只指向某个特定数据源（如「只算这个仓库」）→ 当次生效，不写配置。意图仍有歧义（如分不清「数据收集配置」与「落盘目录配置」）→ 一句话与用户确认后写入，不猜

## 配置版本机制（升级保护）

本 skill 当前配置版本为 `3`（对应 user-config.md 中的 `CONFIG_VERSION`）。执行时若发现 user-config.md 的 CONFIG_VERSION 与本节声明的当前版本不一致：先将旧 user-config.md 备份为 `user-config.bak-<时间戳>.md`（同目录，绝不删除旧值）→ 按本节「当前版本变更记录」迁移字段（新增字段补默认值、改名字段按映射改写、删除字段的值保留在备份中并在对话提示用户手动确认）→ 更新 CONFIG_VERSION 为当前版本 → 对话中明确告知用户「检测到配置版本从 X 升级到 Y，旧配置已备份至 <路径>」。禁止在未声明版本变更的情况下静默修改配置语义。

**无法迁移项处理**（值域失效 / 语义漂移 / 数据不兼容）：三情形——①旧值不在新值域（如旧模板/主题名已移除）②同名键含义变化（单位/枚举变更）③数据文件 schema 不兼容。三绝不：绝不静默（无法迁移项停下问，不猜值）、绝不丢失（旧值永远在 .bak-时间戳）、一次说清（升级报告三段式：⚠️ 版本与备份路径 → ✅ 已自动迁移清单 → 🟡 无法迁移项逐条附原因+影响+建议替代）；随后 AskUserQuestion 三选项（A 用建议值 / B 用户给新值 / C 保持旧配置——不更新 CONFIG_VERSION，每次执行再提醒）；报告必附回滚一句话。

当前版本变更记录：v1→v2 新增 THEME 字段（默认 tech）。v2→v3 新增 DATA_SOURCES 数据源清单段（默认空清单 + git/file/remote 三类型示例注释）。

## 产物升级（回炉）

生成 HTML 时头部写版本戳 `<meta name="sf-template" content="monthly-report@2">`（模板升级时递增 @N 并同步 reference.html 与本文档）。用户说「升级旧产物/回炉旧页面/旧月报换新样式」时：扫落盘目录下本技能命名的 html，读版本戳筛出旧版（无版本戳或缺少 `<meta name="monthly-id">` 稳定 ID 的产物视为 v0 最旧版，一并进清单） → 列清单（文件/旧版本/手改状态——旧 html 正文与同目录 md 正文对比，不一致视为可能手改过）→ AskUserQuestion 选全部或部分 → 逐份升级：浅升级（仅 CSS/JS 变化）对旧页替换 `<style>` 块与交互脚本、正文内容原样保留；深升级（DOM 结构变化）从同目录 md 底稿按当前 reference.html 重建，先备份旧版 `.bak-时间戳` → 报告三段式：✅ 已升级清单 / ⚠️ 手改保留说明 / 🟡 失败项原因。模板改动分级：业务改动（板块/段落/标题体系）、数据格式改动（字段/存储结构）、页面改动（样式/布局/交互）任一发生即模板升级，版本戳 +1 并同步 reference.html 与本文档；纯措辞润色不 bump。每次生成 HTML 时顺扫落盘目录读版本戳：发现旧版产物主动告知「技能模板已升级至 vN，检测到 X 份旧版月报（vN-1 或无版本戳的历史产物），说『把我旧月报都升级成新样式』即可一键升级」，不让用户背触发语。

## 🔧 报修处理流程（用户报页面问题时）

用户说「这个页面效果不对 / 布局乱了 / 有 UI 问题 / 样式错了 / 交互坏了」（常附截图或指出具体现象）→ 按以下流程处理，不以「重新生成一份」敷衍：

1. **立标准**：先 Read 本 skill 目录 `resources/reference.html`——它就是设计标准答案（布局/配色/交互全在代码里）
2. **找问题**：Read 用户那份问题 html 文件，与 reference 逐处比对（结构顺序 / CSS 变量 / 关键类名 / 交互 JS），定位跑偏处；用户给了截图则按截图现象反查
3. **修复**：以 reference 为准修复那份 html（只修跑偏处，不动正确内容；reference 与 html 不一致时以 reference 为准）
4. **自证**：Chrome headless 访问修复后页面截全页 PNG，Read 自查修复点恢复标准效果；用户给了问题截图时尽量复现同视角截图做前后对比
5. **汇报**：一句话说清问题根因 + 修复了什么 + 附截图；若根因在 reference.html 自身（生成结果与 reference 一模一样但仍有问题），顺修 reference.html 对应处并在汇报中说明「参考模板已同步修正」，避免下一份重蹈覆辙

## 规则速览

- 四段式骨架行业无关：月度概览（一句话 TL;DR + 3-5 项核心数据卡，数字必带环比上月基准）/ 本月关键成果（按周 W1-W4 时间线 6-10 项，每项 20-40 字）/ 问题与改进（2-4 条三环：问题+影响+改进）/ 下月计划（3-5 项目标，各带量化指标与周级行动节点）
- 中文顿号序号（1、2、3）；段内无内容写「暂无」；量化优先，杜绝空话套话
- 行业术语/指标/里程碑主题/风险话术按 `resources/industry-dictionary.md` 职业词典取词（未提职业按 ROLE 画像）
- 完整规则（聚合来源 / 纯文字模式 / 写作风格约束 / 使用提示）见 `resources/content-rules.md`


---

## 🔍 SkillForge 使用指引（整体咨询时触发）

当用户询问 **SkillForge 本身**（不是单个技能用法）——「skillforge 怎么用 / 使用说明 / 使用指引 / 是什么」「技能怎么安装 / 怎么升级 / 装了哪些技能 / 技能清单」「skill-forge ls / init / update 等命令怎么用」「技能安装器 / 技能锻造坊」等（中英文、近似说法均可，关键词可自由扩展）：
1. Read 同目录 `resources/skillforge-guide.txt` 全文，按其内容整理回答（命令与参数以 txt 为准，勿自行编造）
2. 用系统命令打开同目录 `resources/skillforge-guide.html`（macOS `open`，Windows `start`），让用户在浏览器看排版版
3. 用户只问单个技能怎么用时（如「日报怎么用」）不触发本指引，走本技能的使用说明
