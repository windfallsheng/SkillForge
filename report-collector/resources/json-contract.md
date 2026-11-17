# 标准 JSON 契约（json-contract）

> 本文件是 report-collect.py 输出 JSON 的字段契约真相源。**脚本字段与本文件必须一一对应**：
> 改 scripts/report-collect.py 的输出字段时同步改本文件，反之亦然（文档同步自检纪律）。
> 消费方（五个统计技能）按本契约解读 JSON，字段名以本文件为准，勿自行猜测。

## 顶层结构

| 字段 | 类型 | 说明 |
|:---|:---|:---|
| collector | string | 固定 `report-collect` |
| collector_version | int | 采集器版本（当前 1），升级时递增 |
| schema_version | int | JSON 契约版本（当前 1），字段结构变化时递增 |
| generated_at | string | 采集时刻 ISO 时间戳 |
| window | object | `{since, until}` 采集窗口（YYYY-MM-DD，含端点） |
| summary | object | 全源汇总（采集摘要反馈的数据来源） |
| git / files / remote | array | 三通道结果，各元素见下文 |

## summary（全源汇总）

| 字段 | 说明 |
|:---|:---|
| sources.total | 有效数据源总数（未知 type 已忽略，不计入） |
| sources.ok | 成功源数（status == "ok"） |
| sources.skipped | 跳过源数（status == "skipped"） |
| commits_total / additions / deletions | 全仓提交数与增删行数合计（**已剔除生成物**） |
| repos_with_commits | 有提交的仓库数（日报/周报「无提交的仓库不写入」判断依据） |
| files_entries | file 通道文本文件条目总数 |
| remote_ok | remote 通道成功源数 |
| excluded_additions / excluded_deletions | 被剔除的生成物增删行数合计（透明披露） |
| from_cache | 命中增量缓存的 git 源数 |

## git[]（每仓一项）

| 字段 | 类型 | 说明 |
|:---|:---|:---|
| name / path | string | 数据源名与路径（来自 DATA_SOURCES） |
| status | string | `ok` 成功 / `skipped` 跳过 |
| skip_reason | string\|null | 跳过原因（`路径不存在` / `非 git 仓库`），成功为 null |
| branch | string | 当前分支（仅 ok） |
| from_cache | bool | 是否命中增量缓存复用（仅 ok） |
| commits_total / additions / deletions | int | 窗口内提交数与增删行数（**已剔除生成物**） |
| files_touched | int | 涉及文件数（去重，剔除后） |
| commits_truncated | bool | 逐条 commits 是否被 --max-commits 截断（聚合指标不受影响） |
| daily[] | array | 按日分布：`{date, commits, additions, deletions}` |
| weekly[] | array | 按 ISO 周分布：`{week: "2026-W47", commits, additions, deletions}` |
| monthly[] | array | 按月分布：`{month: "2026-11", commits, additions, deletions}` |
| top_files[] | array | 高频文件 Top8（按增行数降序）：`{path, additions, deletions, commits}` |
| milestones[] | array | 窗口内里程碑（按日期降序，上限 50）：`{type: "tag"\|"merge", name, date, subject}`（tag 的 subject 恒为 null） |
| commits[] | array | 逐条提交（时间降序；--no-commits 时为空数组）：`{hash, date, subject, files, additions, deletions}`（additions/deletions 已剔除生成物） |
| excluded | object | 剔除统计：`{files, additions, deletions, top: [{path, additions} 前三]}` |

## files[]（每源一项）

| 字段 | 类型 | 说明 |
|:---|:---|:---|
| name / path | string | 数据源名与路径 |
| status | string | `ok` / `skipped` |
| skip_reason | string\|null | 跳过原因（`路径不存在` / `二进制或不可读文件` / `目录内无可读文本文件` 等） |
| kind | string\|null | `file` 单文件 / `dir` 目录 |
| entries[] | array | 文本文件条目（目录递归时按路径排序，上限 200）：`{path, chars, bytes, mtime, preview}`；preview 为前 200 字符（换行压空格），AI 按 preview 挑相关文件再 Read 全文 |

## remote[]（每源一项）

| 字段 | 类型 | 说明 |
|:---|:---|:---|
| name / url | string | 数据源名与 url |
| status | string | `ok` / `skipped` |
| skip_reason | string\|null | 跳过原因（`拉取失败：<异常类名>` 等） |
| chars | int | 正文字符数（仅 ok） |
| preview | string\|null | 前 200 字符预览 |
| truncated | bool | 是否被 512KB 上限截断（仅 ok） |

## 消费方解读要点（五统计技能必读）

1. **先看 summary 再动笔**：summary.sources.ok == 0 → 自动化数据源全部失败，退回纯口述模式并告知用户
2. **量化数字只认 git 数组的聚合字段**（commits_total/additions/deletions/files_touched），禁止用 commits[] 手工重算（截断时算不全）
3. **无提交仓库不写入报告**：commits_total == 0 的仓跳过
4. **里程碑用于成果段**：type=tag 是版本发布（name 即版本号）、type=merge 是重要合并（subject 是合并说明）
5. **分布数组用于图表**：daily 喂日报节奏条/周报热力图、monthly 喂月报日历、年报用 monthly 画 12 月柱图、季报用 weekly 聚合季度走势
6. **excluded 用于口径自证**：用户质疑行数时展示「剔除生成物 +X/-Y」说明口径
7. **file/remote 的 preview 是挑文件线索**：要点提取仍需 Read 全文，preview 只是相关性别断
