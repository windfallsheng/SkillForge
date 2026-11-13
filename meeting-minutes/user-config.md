# 用户配置（升级技能时本文件不会被覆盖）

> 你的个人配置全放在这里。skill-forge 升级技能时官方只更新 SKILL.md 与 resources/，
> 本文件始终保留你的版本——落盘目录、格式、角色画像、自定义模板放心改。
> 官方升级若带来新配置点，会另存 `user-config.upstream.md` 对照文件到同目录，
> 你按需查看并手动合并新配置点到本文件。


## ⚙️ 默认配置（用户可手动修改；临时口头要求永远优先）

```yaml
DISK: true                     # 是否落盘写文件；false = 默认只在对话输出，不写文件不开浏览器
CONFIG_VERSION: 3              # 配置结构版本：skill 升级时若配置结构变化会递增；AI 每次执行前对比 SKILL.md「配置版本机制」节声明的当前版本，不一致时按 SKILL.md 的迁移规则处理（先备份本文件为带时间戳 .bak，再迁移，最后对话告知用户）
FORMATS: [md, txt, html, content-png] # 落盘哪些格式（数组，可删减/增，如 [md, html] / [md, txt, html]（不截图）；content-png = 内容区截图（五张分节卡片整体，不含头部标题/复制按钮/页脚），删除该项即不截图；不影响对话中的 md 正文输出）
SERIES_GROUP: auto             # 纪要系列分组：auto = 提取到稳定系列名（如「产品周例会」）时建系列目录 meetings/{系列名}/，未提取到则回退月份平铺 meetings/YYYY-MM/；series = 一律建系列目录（提取不到就用会议主题做目录名）；off = 纯月份平铺（旧行为）。系列名落盘确认时报给用户，可改口（说「这个系列叫 XX」→ 当次改目录名；说「以后这个系列叫 XX」→ 永久记住该系列名）
DIR: auto                      # 落盘根目录：auto = 按当前系统自动选 DIR_MAC / DIR_WIN（也可直接写死某个绝对路径）
DIR_MAC: ~/reports                               # macOS 落盘根目录（按 SERIES_GROUP 规则建子目录：auto/series 建 meetings/{系列名}/、off 或未提取到系列名建 meetings/YYYY-MM/；目录不存在时回退用户主目录下 reports）
DIR_WIN: %USERPROFILE%\reports                   # Windows 落盘根目录（按 SERIES_GROUP 规则建子目录：auto/series 建 meetings/{系列名}/、off 或未提取到系列名建 meetings/YYYY-MM/；目录/盘符不存在时回退用户主目录下 reports）
OPEN_HTML: true                # 落盘后是否自动用浏览器打开 html（FORMATS 不含 html 时忽略）
THEME: tech                    # html 页面主题：tech 深蓝科技（默认）/ biz 浅色商务 / mono IDEA 黑亮 / light IDEA 白亮 / warm 温暖渐变；生成时写 <html data-theme="THEME值"> 定默认，页面右下角换肤坞五色点随点随换（浏览器本地记忆（键按页内嵌唯一 ID 隔离、多份产物互不串台、改名/移动目录记忆不丢；生成时头部写 `<meta name="minutes-id" content="<UUID>">`，每次新 UUID），?shot 截图模式自动隐藏，打印隐藏）
TEMPLATE: default              # 纪要模板：default = 内置五段式（会议信息/会议结论/议题讨论/决议与行动项/下次会议）；custom = 使用下方「📝 自定义模板」节；口头临时指定模板仅当次生效
ROLE: 全栈开发工程师（企业内技术开发）  # 用户默认职业角色与主要工作内容（两者并存：职业名 + 括号内工作内容，会议类型推断/术语/行动项模板全部按此画像走）；用户随口描述职业时（如「我搞装修的，天天跑工地」）→ AI 提炼为规范表述（装修项目经理（负责工地现场管理、施工进度与质量巡检））更新此处；说「以 XX 的身份写」→ 当次临时换角色不改配置；说「以后默认用 XX 角色 / 我的职业是 XX / 我的主要工作是 XX」→ 永久更新此处
CONFIRM: never                 # 落盘前确认：never = 直接生成落盘不确认（默认）；text = 纯文字整理模式先出效果确认后再落盘；always = 任何方式生成都先确认；临时说「先看看效果」当次先确认、说「不用确认」当次跳过
DATA_SOURCES: []               # 数据源清单（升级不覆盖；AI 每次生成前 Read 本文件按此清单收集；空清单 = 只按会话/文字内容生成）。本清单是数据源唯一配置落点：resources/content-rules.md「素材来源」节只是收集机制说明（随升级覆盖），别把数据源写在那里。本 skill 仅支持 type: file（把下方 # 注释示例改成你的真实数据源后填入上方数组；未知 type（拼写错误）忽略该项并在生成时一句话提示，不中断）：
  # - name: 会议速记目录        # 名称：唯一 key（重名视为同一数据源；口述「只整理 xxx」按 name 匹配）
  #   type: file                # file = 普通文件/目录（文件 Read 全文、目录逐个 Read 文本文件，二进制跳过；路径无效静默跳过）
  #   mac: ~/Documents/meetings  # macOS 路径（绝对路径或 ~ 开头）
  #   win: D:\Documents\meetings # Windows 路径；「-」= 该系统不存在，自动跳过
  # - name: 会议录音转写
  #   type: file
  #   mac: ~/Documents/meeting-transcript.txt
  #   win: -
  # - name: 项目周报
  #   type: file
  #   mac: ~/reports/2026-11/weekly-report-2026-11-06.md
  #   win: -
```

> 临时口头要求（仅对当次生效，不修改上方配置）：说「不落盘/别写文件」→ 当次 DISK=false；说「写到桌面/存到 ~/report（macOS）或 D:\report（Windows）」→ 当次改用该 DIR；说「只要 md / 只出 html / 只要内容区截图」→ 当次只落指定格式；说「这次不截图」→ 当次不生成内容区截图；说「只要截图/重新截个图」→ 当次只对现有 html 执行内容区截图（不重新收集材料、不重写 md/txt/html 内容文件）；说「别开浏览器」→ 当次 OPEN_HTML=false；说「这次按 xxx 模板来」→ 当次临时换模板（不改配置）；说「以后都用这个模板」→ 自动写入下方「📝 自定义模板」节并把 TEMPLATE 改为 custom（永久生效）；说「先看看效果/先出效果再落盘」→ 当次先出效果确认后再落盘；说「不用确认/直接落盘」→ 当次跳过确认直接落盘。说「页面用浅色商务主题/浅色主题」→ 当次 THEME=biz；说「以后默认用暖色主题」→ 永久改 THEME=warm。

## 📝 自定义模板（TEMPLATE: custom 时启用，用户可手改，适配各类会议）

把顶部 TEMPLATE 改为 custom 后，按下面结构生成纪要（段名、段数、条目格式均可改）：

```text
段一：会议信息（主题 - 日期 - 地点 - 主持人 - 参会人）
段二：会议结论（TL;DR + 核心决策）
段三：议题讨论（议题名 - 结论 - 讨论要点）
段四：决议与行动项（事项 - 负责人 - 截止时间）
段五：下次会议（主题 - 时间）
```

> 只写段结构与条目格式即可；未写明的细节（中文顿号序号、生成时间行、落盘行为、HTML 样式）沿用默认规范。

---
> 更多用法见 SKILL.md 的「生成流程」与 resources/ 分册。
