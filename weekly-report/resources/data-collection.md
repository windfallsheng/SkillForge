# 数据收集（周报）

> ⚠️ **本文件是收集机制说明，不是配置区**——随 skill 升级会被官方版覆盖，写在这里的内容会丢。
> **数据源唯一真相源**：report-collector 技能的 `user-config.md` 顶部「默认配置」的 `DATA_SOURCES` 数组（升级保护区，五报通用）。
> 本 skill 自己的 `user-config.md` 的 `DATA_SOURCES` 为「单技能补充源」（可选，只在周报生成时追加采集），两处按 name 去重、以 report-collector 为准。
> 清单形状与逐字段填写说明，一律以 report-collector 的 user-config.md「默认配置」注释为准，本文件不再重复清单示例。

## 1. 运行通用采集器（首选路径）

先 Read report-collector 技能的 `user-config.md`，其 DATA_SOURCES 非空时运行：

```bash
python3 "<report-collector 技能目录>/scripts/report-collect.py" \
  --config "<report-collector 技能目录>/user-config.md" \
  [--config "<本 skill 目录>/user-config.md"] \
  --since <本周一> --until <本周结束日> \
  [--out <临时路径>]
```

- 本 skill 的 user-config.md 配了补充源时才加第二行 `--config`（重名数据源以先传的 report-collector 为准）
- 窗口参数：本周周一 00:00 ~ 周结束日（WEEK_END，默认周五）23:59（YYYY-MM-DD，含端点）；缺省参数时以当前日期所在周为准
- **上周环比**：另跑一次 `--since <上周一> --until <上周结束日>`，取 summary.commits_total 供概览卡「较上周」环比行使用（同口径：同数据源、同剔除规则）
- 解读 JSON 按 report-collector 的 `resources/json-contract.md` 契约：先看 summary（ok == 0 时告知用户并退回纯口述）；量化数字只认 git 数组的 commits_total/additions/deletions/files_touched 聚合字段；commits_total == 0 的仓库不写入周报；daily 分布喂热力图/柱图；同主题多日提交合并为一条任务点、量化数据累加
- **采集摘要反馈**：生成前先回一句数据来源摘要（引用脚本 stderr），如「已从 3 个仓库聚合 47 次提交、2 个文件提取要点、1 个远程源失败已跳过」
- 采集器未安装 / Python 不可用 → 走第 2 节手工路径

## 2. 手工收集（fallback：采集器未安装或 Python 不可用时）

先检测当前系统（macOS：`uname -s` 返回 Darwin；Windows：`node -e "console.log(process.platform)"` 返回 win32），再 Read 本 skill 的 `user-config.md` 与 report-collector 的 `user-config.md` 两份 DATA_SOURCES 清单（重名以 report-collector 为准），按清单逐项收集（均空清单 = 只按会话/文字内容生成）。

每项按 type 分三种行为：

- git = 代码仓库：取 mac / win 中当前系统对应路径（「-」= 该系统不存在，跳过；当前系统全部为「-」的陌生机器时跳过 git 收集），用下方命令模板聚合该仓本周（周一至周结束日 WEEK_END，默认周五）提交，聚合产出；同时统计上周同范围（周一至上周周结束日）提交数/完成任务数，供概览卡环比行使用。只汇总有提交的仓库
- file = 普通文件/目录：路径指向文件 → Read 全文提取要点；指向目录 → 列目录逐个 Read 文本文件（md/txt/csv/日志等，二进制/超大文件跳过）；路径无效或全部不可读 → 静默跳过该数据源
- remote = 远程网络源：按清单 url 联网拉取内容提取要点；拉取失败/超时 → 静默跳过；仅收集时联网，HTML 产物仍零外链
- 未知 type（拼写错误/未支持）→ 忽略该项，生成时一句话提示

命令模板：

```bash
git -C <仓库路径> log --since="YYYY-MM-DD 00:00:00" --until="YYYY-MM-DD 23:59:59" --pretty=format:"%h %s" --stat
```

- 日期范围取本周周一 00:00 至周结束日（WEEK_END，默认周五）23:59
- 汇总每个提交涉及的**文件数**与**增删行数**（来自 --stat），作为量化数据
- **行数统计口径（防生成物噪音）**：统计增删行数前必须先剔除生成物路径（`.speccore/`、`.build/code-graph/`、`node_modules`、`dist`、`*.lock` 等，graph.json 单文件可贡献数十万行）；numstat 输出为 `add\tdel\tpath` 三列，用 `grep -vE $'\t\.speccore/'` 按制表符+路径过滤（正则匹配行首无效）；统计后若行数仍异常巨大（>5 万行），用 `sort -rn | head -8` 定位元凶文件再排除；周报指标卡（提交数/活跃天数/涉及文件/代码行数）与 HTML 热力图/柱图均用过滤后口径

## 3. 会话口述与其他素材

- 提交记录之外的默认来源：本次会话中用户已提及/口述的工作内容（任务、进度、风险等对话信息）一并聚合，与提交记录去重合并
- 用户提供的文件（md/txt/docx）Read 提取要点；图片逐张 Read 识别内容
- 会议纪要文件也可作为素材：会议行动项可直接列为本周任务或进度来源（汇报链源头）
- 用户明确说"只整理这段文字/只按这段"时，忽略提交记录与会话上下文，只用指定文字
- 用户说「只写 xxx 的周报 / 只聚合 xxx」时按 name 匹配只收集指定数据源

## 4. 合并去重与口径

- 同件事去重合并——量化数字以 git 提交统计为准、定性描述以口述/文件要点为准；file/remote 提取要点与口述同等对待
- 提交记录无法给出实际耗时，用时取合理估算值（1D=8H 口径），允许用户事后修正
- 本周无提交的仓库不写入周报；仓库路径（当前系统字段）不存在/非代码仓库时静默跳过

## 5. 首次使用引导（数据从哪来，一句话说清）

生成前按数据丰度判断是否主动引导（只在「无任何数据：DATA_SOURCES 空清单且会话/文字无工作内容」时触发，有数据时直接生成不打扰）：
- 无数据时先向用户说明三种取数方式再生成：
  ① 口述——「直接告诉我这周做了什么，我整理成周报」
  ② 贴素材——「把这段文字 / 这个文件 / 这张图整理成周报」（非开发岗位主路径）
  ③ 自动取数——「以后自动聚合我的 git 提交」：说「数据源加一下」并把仓库路径/本地目录告诉助手，配置一次、以后每次自动取数（git 数据自动生成概览卡与图表；没有 git 仓库可跳过）
  等用户回应后按其选择生成；用户说「先随便生成/直接生成」→ 按空数据生成（各段「暂无」）
- 有 git 数据但无口述 → 生成前轻提示一句「已聚合 N 次提交，还可口述补充业务结果与风险（说『补充一下…』即可）」，不打断流程
