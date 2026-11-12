# 数据收集

先检测当前系统（macOS：`uname -s` 返回 Darwin；Windows：`node -e "console.log(process.platform)"` 返回 win32），再 Read 同目录外的 `user-config.md` 顶部「默认配置」的 DATA_SOURCES 清单，按清单逐项收集（空清单 = 只按会话/文字内容生成）。清单形状（每项 name 唯一名称 + type 类型 + 路径；完整填写说明见 user-config.md「默认配置」的 DATA_SOURCES 注释）：

```yaml
DATA_SOURCES:
  - name: 主项目仓库          # name = 唯一 key（重名视为同一数据源；口述「只聚合 xxx」按 name 匹配）
    type: git                # git = 代码仓库（git log 聚合提交）
    mac: ~/Projects/main-app  # macOS 路径（绝对路径或 ~ 开头）
    win: D:\Projects\main-app # Windows 路径；「-」= 该系统不存在，自动跳过
  - name: 周例会纪要
    type: file               # file = 普通文件/目录（直接 Read 内容聚合）
    mac: ~/Documents/meeting-notes.md
    win: -
  - name: 数据接口
    type: remote             # remote = 远程网络源（联网拉取 url 内容）
    url: https://example.com/data.json
```

每项按 type 分三种行为：

- git = 代码仓库：取 mac / win 中当前系统对应路径（「-」= 该系统不存在，跳过；当前系统全部为「-」的陌生机器时跳过 git 收集，只按会话/文字内容生成），用下方命令模板聚合该仓本周（周一至周结束日 WEEK_END，默认周五）提交，聚合产出；同时统计上周同范围（周一至上周周结束日）提交数/完成任务数，供概览卡环比行使用。只汇总有提交的仓库
- file = 普通文件/目录：直接 Read 内容（文档/纪要/日志等素材），提取要点并入
- remote = 远程网络源：AI 联网拉取 url 内容提取要点（仅收集时联网，HTML 产物仍零外链）

命令模板：

```bash
git -C <仓库路径> log --since="YYYY-MM-DD 00:00:00" --until="YYYY-MM-DD 23:59:59" --pretty=format:"%h %s" --stat
```

- 日期范围取本周周一 00:00 至周结束日（WEEK_END，默认周五）23:59，缺省参数时以当前日期所在周为准
- 汇总每个提交涉及的**文件数**与**增删行数**（来自 --stat），作为量化数据
- **行数统计口径（防生成物噪音）**：统计增删行数前必须先剔除生成物路径（如 `.speccore/code-graph/` 下的 graph.json：单文件可能贡献数十万行，会撑爆指标）；numstat 输出为 `add\tdel\tpath` 三列，用 `grep -vE $'\t\.speccore/code-graph/'` 按制表符+路径过滤（正则匹配行首无效）；统计后若行数仍异常巨大（>5 万行），用 `sort -rn | head -8` 定位元凶文件再排除；周报指标卡（提交数/活跃天数/涉及文件/代码行数）与 HTML 热力图/柱图均用过滤后口径
- 同主题多日提交合并为一条任务点，量化数据累加
- 提交记录无法给出实际耗时，用时取合理估算值，允许用户事后修正
- 本周无提交的仓库不写入周报
- 仓库路径（当前系统字段）不存在/非代码仓库时静默跳过该仓库（不报错、不写入）
- 用户说「只写 xxx 的周报 / 只聚合 xxx」时按 name 匹配只收集指定数据源
- 提交记录之外的默认来源：本次会话中用户已提及/口述的工作内容（任务、进度、风险等对话信息）一并聚合，与 提交记录去重合并
- 用户明确说"只整理这段文字/只按这段"时，忽略提交记录与会话上下文，只用指定文字
