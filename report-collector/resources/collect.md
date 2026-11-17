# 采集机制（collect）

> ⚠️ **本文件是采集机制说明，不是配置区**——随 skill 升级会被官方版覆盖，写在这里的内容会丢。
> 你的真实数据源只写在同目录外的 `user-config.md` 顶部「默认配置」的 `DATA_SOURCES` 数组与 `EXCLUDE_EXTRA` 追加剔除表（升级保护区，永不覆盖）。
> 清单形状与逐字段填写说明，一律以 user-config.md「默认配置」注释为准，本文件不再重复清单示例。

## 1. 运行采集器

先 Read 同目录外的 `user-config.md` 确认 DATA_SOURCES 清单非空（空清单 = 无自动化数据源，跳过脚本直接进入口述收集），然后运行：

```bash
python3 "<本 skill 目录>/scripts/report-collect.py" \
  --config "<本 skill 目录>/user-config.md" \
  --since <起> --until <止> \
  [--only git|file|remote] [--full] [--no-commits] [--out <路径>] [--quiet]
```

- Windows 用 `python`；`python3`/`python` 均不存在时走第 6 节手工降级路径
- `--config` 可传多个 user-config.md（合并采集，先传者优先、重名数据源以先传者为准）。五统计技能协作时：先传本 skill 的 user-config.md（数据源真相源），若调用方 skill 自己的 user-config.md 里也配了补充数据源，再传那份（补充源按 name 去重追加）
- 五个统计技能的窗口参数映射（`--since`/`--until` 均为 YYYY-MM-DD，含端点）：
  - 日报 = 目标日当天；周报 = 周一 ~ 周结束日（默认周五）；月报 = 月首 ~ 月末；季报 = 季首 ~ 季末；年报 = 1 月 1 日 ~ 12 月 31 日（建议加 `--full` 忽略增量缓存）
- 输出：stdout 标准 JSON（结构见 `resources/json-contract.md`）；stderr 人类可读采集摘要（AI 引用于采集反馈）；`--out` 落盘 JSON 时 stdout 静默

## 2. 三通道行为

按 DATA_SOURCES 每项 type 分流（脚本自动完成，此处说明口径）：

| type | 采集什么 | 输出什么 | 跳过条件（静默，记 status=skipped + skip_reason） |
|:---|:---|:---|:---|
| git | 代码仓库窗口内提交 | commits 逐条（hash/date/subject/files/additions/deletions）+ 聚合指标（commits_total/additions/deletions/files_touched）+ daily/weekly/monthly 三分布 + top_files 高频文件 + milestones（窗口内 tag + merge）+ excluded 剔除统计 | 路径不存在 / 非 git 仓库 / 当前系统字段为「-」 |
| file | 文件 Read 全文要点；目录递归扫文本文件 | entries 逐条（path/chars/mtime/preview 前 200 字符），AI 按 preview 挑相关文件 Read 全文 | 路径无效 / 二进制（utf-8、gbk 解码均失败）/ 单文件超 1MB / 目录内无文本文件 |
| remote | url 拉取（10s 超时，最多 512KB） | chars 字符数 + preview 前 200 字符 | 拉取失败 / 超时 |

- 未知 type（拼写错误）→ 忽略该项，采集摘要中一句话提示（不猜、不中断）
- 多来源合并：同件事去重合并——量化数字以 git 提交统计为准、定性描述以口述/文件要点为准；file/remote 提取要点与口述同等对待

## 3. 生成物剔除口径

- **内置剔除表**（numstat 路径正则，命中即不计入增删行数、计入 excluded）：`.speccore/`、`.build/code-graph/`、`.build/`、`node_modules/`、`dist/`、`build/`、`vendor/`、`.venv/`、`venv/`、`__pycache__/`、`.git/`、`.next/`、`.nuxt/`、`.cache/`、`coverage/`、`*.lock`、`*.min.js`、`*.min.css`、`*.map`、`.DS_Store`
- 典型元凶：`.speccore/code-graph/graph.json` 单文件可贡献数十万行（SpecCore 系项目必须剔除）
- 用户可在 user-config.md 的 `EXCLUDE_EXTRA` 追加路径正则（追加不覆盖内置表）
- 剔除透明：JSON 每仓 `excluded` 字段记录 {files, additions, deletions, top}；采集摘要同步展示「剔除生成物 +X/-Y」；剔除后行数仍异常巨大时（单仓 >5 万行）读 `excluded.top` 与 `top_files` 定位元凶文件，确认后追加进 EXCLUDE_EXTRA

## 4. 增量缓存（report-state.json）

- 位置：`~/.skillforge/report-state.json`（Windows：`%USERPROFILE%\.skillforge\report-state.json`），`--state-dir` 可改
- 语义：同一 git 源、同一窗口（since+until 完全相同）、上次成功 → **直接复用上次结果**（JSON 该仓 from_cache: true，采集摘要打「（缓存复用）」）；窗口不同 → 全量重扫该仓
- `--full`：忽略缓存全量重扫（年报建议加，保证年度数据完整）
- 典型收益：同一天反复生成/改模板重跑日报，git 扫描只跑第一次；写日报后同窗口改模板，零重扫
- 缓存可安全删除（下次重扫重建）；file/remote 通道不缓存（内容需要新鲜）

## 5. 采集摘要反馈（交互义务）

脚本跑完后，AI 必须先向用户回一句数据来源摘要（引用脚本 stderr），例：

> 已从 3 个数据源聚合：主项目仓库 47 次提交（+1234/-567 行，剔除生成物 +38000/-32000）、周例会纪要 3 个文本文件；1 个远程源拉取失败已跳过。

- 全部源失败（summary.sources.ok == 0）→ 明确告知「自动化数据源全部不可用，已退回纯口述模式」，不中断、不编造
- 部分源 skipped → 摘要中点名 skipped 项与原因（路径不存在/拉取失败），用户可自行修复配置

## 6. 手工降级路径（环境无 Python 时）

Python 不可用时按旧版命令模板逐仓手工聚合（口径与本脚本一致）：

```bash
git -C <仓库路径> log --since="YYYY-MM-DD 00:00:00" --until="YYYY-MM-DD 23:59:59" --numstat --pretty=format:"%h %ad %s" --date=format:%Y-%m-%d
```

- 统计增删行数前先剔除生成物路径：numstat 输出为 `add\tdel\tpath` 三列，用 `grep -vE $'\t\.speccore/'` 等按制表符+路径过滤（正则匹配行首无效）
- 统计后若行数仍异常巨大（>5 万行），用 `sort -rn | head -8` 定位元凶文件再排除
- file/remote 通道按第 2 节行为手工 Read / 拉取
