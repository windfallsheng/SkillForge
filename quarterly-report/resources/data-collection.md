# 数据收集（季度）

三种来源合并去重：口述与文字/文件/图片并重（业务结果以口述为准、统计数字以提交记录兜底）；没有提交记录也适用——给一段文字、文件里的描述或图片即可成稿。开发类用户可另做代码仓库当季提交聚合与环比/同比双基准统计（见第 1 节）。

## 1. 代码仓库当季提交聚合（可选，开发类用户）

清单形状（每项 name 唯一名称 + type 类型 + 路径；完整填写说明见 user-config.md「默认配置」的 DATA_SOURCES 注释）：

```yaml
DATA_SOURCES:
  - name: 主项目仓库          # name = 唯一 key（重名视为同一数据源；口述「只聚合 xxx」按 name 匹配）
    type: git                # git = 代码仓库（git log 聚合提交）
    mac: ~/Projects/main-app  # macOS 路径（绝对路径或 ~ 开头）
    win: D:\Projects\main-app # Windows 路径；「-」= 该系统不存在，自动跳过
  - name: 季度例会纪要
    type: file               # file = 普通文件/目录（直接 Read 内容聚合）
    mac: ~/Documents/meeting-notes.md
    win: -
  - name: 数据接口
    type: remote             # remote = 远程网络源（联网拉取 url 内容）
    url: https://example.com/data.json
```
- 遍历 user-config.md 的 DATA_SOURCES 清单（type: git 项；个人数据源必须写在 user-config.md，本文件随升级覆盖），对每仓执行当季统计：
  - 总提交数：`git log --since={季首} --until={季末 23:59} --oneline | wc -l`
  - 增删行数：`git log --since=... --until=... --numstat --pretty=tformat: | awk` 汇总 add/del
  - **先剔除生成物路径**（.build/code-graph/、node_modules、dist、*.lock 等，用 grep -vE 按制表符+路径过滤），否则 graph.json 之类单文件可贡献数十万行噪音
  - Q1-Q4 走势数据：对当年各季度分别统计总提交数（`git log --since={各季首} --until={各季末} --oneline | wc -l`），喂给 HTML 概览区的 Q1-Q4 季度走势图（当年未到的季度不统计，图形只画已有季度）
  - 里程碑：`git tag` / `git log --merges --oneline` 提取版本发布与重要合并，读 tag 信息取版本号与日期，筛选落在目标季度内的
  - **双基准统计**（概览卡「较上季度/较去年同期」两行小字的数据来源）：
    - 环比：同样口径统计上季度总提交数/完成任务数
    - 同比：同样口径统计去年同季度（如 2025-Q4）总提交数
- 仓库按系统取有效路径（mac / win 双字段，「-」= 该系统不存在跳过）

## 2. 会话口述与文字材料

- 用户口述的季度大事（「这季度上了 XX」「Q4 初做了 YY」）逐条记录
- 用户提供的总结草稿/文档（md/txt/docx）Read 提取要点；图片逐张 Read 识别内容
- DATA_SOURCES 清单中 type: file 的文件 Read 全文、目录逐个 Read 文本文件提取要点（二进制跳过、路径无效静默跳过）；type: remote 只需 url 字段（mac/win 忽略）联网拉取内容提取要点（拉取失败静默跳过；仅收集时联网，HTML 产物仍零外链）；未知 type 忽略该项并在生成时提示
- 聊天记录/周报/月报/会议纪要文件也可作为素材；本季度已生成的月报直接引用其核心指标（同源数据不重复统计）

## 3. 合并去重与口径

- 同一成果提交数据与口述重合时合并为一条，量化以提交统计为准、定性以口述为准；file/remote 提取要点与口述同等对待
- 提交信息/文档素材中的工程内部标识（仓库名/目录/组件/接口/文件名）仅作内部聚合线索，写入报告正文时按 content-rules.md 的「任务描述通用化纪律」钝化为通用表述，不直接照抄
- 无法量化的条目写定性描述，不编造数字
- 季度核心指标（概览卡数据）优先取：总提交数/季度增删行数/版本发布数（研发），其它行业按职业词典量化指标
- 双基准口径：环比/同比数据仅在用户要求对比或数据卡有基准需求时统计；「较上季度/较去年同期」必须同口径（同仓库、同剔除规则），口径不同宁可不写
