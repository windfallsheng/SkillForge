# 数据收集（月度）

> ⚠️ **本文件是收集机制说明，不是配置区**——随 skill 升级会被官方版覆盖，写在这里的内容会丢。
> **数据源唯一真相源**：report-collector 技能的 `user-config.md` 顶部「默认配置」的 `DATA_SOURCES` 数组（升级保护区，五报通用）。
> 本 skill 自己的 `user-config.md` 的 `DATA_SOURCES` 为「单技能补充源」（可选，只在月报生成时追加采集），两处按 name 去重、以 report-collector 为准。
> 清单形状与逐字段填写说明，一律以 report-collector 的 user-config.md「默认配置」注释为准，本文件不再重复清单示例。

三种来源合并去重：口述与文字/文件/图片并重（业务结果以口述为准、统计数字以提交记录兜底）；没有提交记录也适用——给一段文字、文件里的描述或图片即可成稿。开发类用户可另做代码仓库当月提交聚合（见第 1 节）。

## 1. 运行通用采集器（首选路径）

先 Read report-collector 技能的 `user-config.md`，其 DATA_SOURCES 非空时运行：

```bash
python3 "<report-collector 技能目录>/scripts/report-collect.py" \
  --config "<report-collector 技能目录>/user-config.md" \
  [--config "<本 skill 目录>/user-config.md"] \
  --since <月首> --until <月末> \
  [--out <临时路径>]
```

- 本 skill 的 user-config.md 配了补充源时才加第二行 `--config`（重名数据源以先传的 report-collector 为准）
- 窗口参数：目标月首 00:00 ~ 月末 23:59（YYYY-MM-DD，含端点）
- **上月环比**：另跑一次 `--since <上月首> --until <上月末>`，取 summary.commits_total 供概览卡「较上月」环比行使用（同口径：同数据源、同剔除规则）
- 解读 JSON 按 report-collector 的 `resources/json-contract.md` 契约：先看 summary（ok == 0 时告知用户并退回纯口述）；量化数字只认 git 数组的 commits_total/additions/deletions/files_touched 聚合字段；commits_total == 0 的仓库不写入月报；daily 分布喂日历热力图；milestones 的 tag（版本发布）/merge（重要合并）筛选落在目标月内的进成果段
- **采集摘要反馈**：生成前先回一句数据来源摘要（引用脚本 stderr），如「已从 3 个仓库聚合 47 次提交、2 个文件提取要点、1 个远程源失败已跳过」
- 采集器未安装 → 走第 2 节手工路径，成稿末尾轻提示用户「装 report-collector 技能可自动聚合数据（说『装数据采集器』即可）」；已安装但 DATA_SOURCES 为空清单 → 走第 2 节手工路径，成稿末尾轻提示「数据采集器已装、还没配数据源——说『数据源加一下』把仓库路径/目录告诉它，以后自动取数」；Python 不可用（采集器已装）→ 走第 2 节手工路径

## 2. 手工收集（fallback：采集器未安装 / 未配数据源 / Python 不可用时）

先 Read 本 skill 的 `user-config.md` 与 report-collector 的 `user-config.md` 两份 DATA_SOURCES 清单（重名以 report-collector 为准），对每仓（type: git 项；个人数据源必须写在 user-config.md，本文件随升级覆盖）执行当月统计：

- 总提交数：`git log --since={月首} --until={月末 23:59} --oneline | wc -l`
- 增删行数：`git log --since=... --until=... --numstat --pretty=tformat: | awk` 汇总 add/del
- **先剔除生成物路径**（`.speccore/`、`.build/code-graph/`、`node_modules`、`dist`、`*.lock` 等，用 grep -vE 按制表符+路径过滤），否则 graph.json 之类单文件可贡献数十万行噪音
- 日历热力图数据：`git log --since=... --until=... --format='%ad' --date=format:'%Y-%m-%d' | sort | uniq -c`（逐日提交数，喂给 HTML 的月度日历热力图）
- 里程碑：`git tag` / `git log --merges --oneline` 提取版本发布与重要合并，读 tag 信息取版本号与日期，筛选落在目标月内的
- 环比上月：同样口径统计上月总提交数/完成任务数，供概览卡「较上月」环比行使用
- 仓库按系统取有效路径（mac / win 双字段，「-」= 该系统不存在跳过）

file/remote 行为与第 3 节一致。

## 3. 会话口述与文字材料

- 用户口述的月度大事（「这个月上了 XX」「月初做了 YY」）逐条记录
- 用户提供的总结草稿/文档（md/txt/docx）Read 提取要点；图片逐张 Read 识别内容
- DATA_SOURCES 清单中 type: file 的文件 Read 全文、目录逐个 Read 文本文件提取要点（二进制跳过、路径无效静默跳过）；type: remote 按清单 url 联网拉取内容提取要点（拉取失败静默跳过；仅收集时联网，HTML 产物仍零外链）；未知 type 忽略该项并在生成时提示
- 聊天记录/周报/日报/会议纪要文件也可作为素材；本月已生成的周报/日报直接引用其核心指标（同源数据不重复统计）
- 用户说「只写 xxx 的月报 / 只聚合 xxx」时按 name 匹配只收集指定数据源

## 4. 合并去重与口径

- 同一成果提交数据与口述重合时合并为一条，量化以提交统计为准、定性以口述为准；file/remote 提取要点与口述同等对待
- 无法量化的条目写定性描述，不编造数字
- 月度核心指标（概览卡数据）优先取：总提交数/月度增删行数/版本发布数（研发），其它行业按职业词典量化指标
- 环比口径：上月同口径数据仅在用户要求对比或数据卡有基准需求时统计；「较上月」必须同口径（同仓库、同剔除规则），口径不同宁可不写

## 5. 首次使用引导（数据从哪来，一句话说清）

生成前按数据丰度判断是否主动引导（只在「无任何数据：DATA_SOURCES 空清单且会话/文字无工作内容」时触发，有数据时直接生成不打扰）：
- 无数据时先向用户说明三种取数方式再生成：
  ① 口述——「直接告诉我这个月做了什么，我整理成月报」
  ② 贴素材——「把这段文字 / 这个文件 / 这张图整理成月报」（非开发岗位主路径）
  ③ 自动取数——「以后自动聚合我的 git 提交」：说「数据源加一下」并把仓库路径/本地目录告诉助手，配置一次、以后每次自动取数（git 数据自动生成概览卡与图表；没有 git 仓库可跳过）
  等用户回应后按其选择生成；用户说「先随便生成/直接生成」→ 按空数据生成（各段「暂无」）
- 有 git 数据但无口述 → 生成前轻提示一句「已聚合 N 次提交，还可口述补充业务结果与风险（说『补充一下…』即可）」，不打断流程
