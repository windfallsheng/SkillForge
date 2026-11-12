# 数据收集（年度）

三种来源合并去重：口述与文字/文件/图片并重（业务结果以口述为准、统计数字以提交记录兜底）；没有提交记录也适用——给一段文字、文件里的描述或图片即可成稿。开发类用户可另做代码仓库全年提交聚合（见第 1 节）。

## 1. 代码仓库全年提交聚合（可选，开发类用户）

清单形状（每项 name 唯一名称 + type 类型 + 路径；完整填写说明见 user-config.md「默认配置」的 DATA_SOURCES 注释）：

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
- 遍历 user-config.md 的 DATA_SOURCES 清单（type: git 项；个人数据源必须写在 user-config.md，本文件随升级覆盖），对每仓执行全年统计：
  - 总提交数：`git log --since={区间起} --until={区间止} --oneline | wc -l`
  - 增删行数：`git log --since=... --until=... --numstat --pretty=tformat: | awk` 汇总 add/del
  - **先剔除生成物路径**（.speccore/code-graph/、node_modules、dist、*.lock 等，用 grep -vE 按制表符+路径过滤），否则 graph.json 之类单文件可贡献数十万行噪音
  - 月度分布：`git log --since=... --until=... --format='%ad' --date=format:'%Y-%m' | sort | uniq -c`（12 个月柱图数据）
  - 里程碑：`git tag` / `git log --merges --oneline` 提取版本发布与重要合并，读 tag 信息取版本号与日期
- 仓库按系统取有效路径（mac / win 双字段，「-」= 该系统不存在跳过）

## 2. 会话口述与文字材料

- 用户口述的年度大事（「年初做了 X」「Q3 上了 Y」）逐条记录
- 用户提供的总结草稿/文档（md/txt/docx）Read 提取要点；图片逐张 Read 识别内容
- DATA_SOURCES 清单中 type: file 的文件/目录直接 Read 提取要点；type: remote 的 url 联网拉取内容提取要点（仅收集时联网，HTML 产物仍零外链）
- 聊天记录/周报/日报文件也可作为素材

## 3. 合并去重与口径

- 同一成果 提交数据与口述重合时合并为一条，量化以 提交统计为准、定性以口述为准
- 无法量化的条目写定性描述，不编造数字
- 年度核心指标（概览卡数据）优先取：总提交数/年度增删行数/里程碑数（研发），其它行业按职业词典量化指标
