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

- git = 代码仓库：取 mac / win 中当前系统对应路径（「-」= 该系统不存在，跳过；当前系统全部为「-」的陌生机器时跳过 git 收集，只按会话/文字内容生成），用下方命令模板聚合该仓当日提交，只汇总有提交的仓库
- file = 普通文件/目录：路径指向文件 → Read 全文提取要点；指向目录 → 列目录逐个 Read 文本文件（md/txt/csv/日志等，二进制/超大文件跳过）；路径无效或全部不可读 → 静默跳过该数据源（不报错、不写入）
- remote = 远程网络源：只需 url 字段（mac/win 忽略）；AI 联网拉取 url 内容（网页或数据接口均可）提取要点；拉取失败/超时 → 静默跳过该数据源不阻塞生成；仅收集时联网，HTML 产物仍零外链
- 未知 type（拼写错误/未支持）→ 忽略该项，生成时一句话提示用户该项未识别（不猜、不中断）
- 多来源合并：同件事去重合并——量化数字以 git 提交统计为准、定性描述以口述/文件要点为准；file/remote 提取要点与口述同等对待

命令模板：

```bash
git -C <仓库路径> log --since="YYYY-MM-DD 00:00:00" --until="YYYY-MM-DD 23:59:59" --pretty=format:"%h %s" --stat
```

- 汇总每个提交涉及的**文件数**与**增删行数**（来自 --stat），作为量化数据
- **行数统计口径（防生成物噪音）**：统计增删行数前必须先剔除生成物路径（如 `.build/code-graph/` 下的 graph.json：单文件可能贡献数十万行，会撑爆指标）；numstat 输出为 `add\tdel\tpath` 三列，用 `grep -vE $'\t\.build/code-graph/'` 按制表符+路径过滤（正则匹配行首无效）；统计后若行数仍异常巨大（>5 万行），用 `sort -rn | head -8` 定位元凶文件再排除；日报指标卡（提交次数/涉及文件数/代码行数）与 HTML 量化指标行均用过滤后口径
- 同主题多提交（含多次提交与 MR 合并记录）合并为一条任务点，量化数据累加
- 提交记录无法给出实际耗时，用时取合理估算值，允许用户事后修正
- 无当日提交的仓库不写入日报
- 仓库路径（当前系统字段）不存在/非代码仓库时静默跳过该仓库（不报错、不写入）
- 用户说「只写 xxx 的日报 / 只聚合 xxx」时按 name 匹配只收集指定数据源
- 提交记录之外的默认来源：本次会话中用户已提及/口述的工作内容（任务、进度、风险等对话信息）一并聚合，与 提交记录去重合并
- 会议纪要文件也可作为素材：会议行动项可直接列为当日任务或进度来源（汇报链源头）
- 用户明确说"只整理这段文字/只按这段"时，忽略提交记录与会话上下文，只用指定文字
