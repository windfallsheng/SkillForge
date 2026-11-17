# user-config.md（本文件不会被 skill 升级覆盖，你的修改永久保留）
# 官方配置更新时，另存 user-config.upstream.md 对照文件，可手动合并新配置点

> 你的个人配置全放在这里。skill-forge 升级技能时官方只更新 SKILL.md 与 resources/，
> 本文件始终保留你的版本——数据源清单、追加剔除表放心改。

## ⚙️ 默认配置（用户可手动修改；临时口头要求永远优先）

```yaml
CONFIG_VERSION: 1              # 配置结构版本：skill 升级时若配置结构变化会递增；AI 每次执行前对比 SKILL.md「配置版本机制」节声明的当前版本，不一致时按 SKILL.md 的迁移规则处理（先备份本文件为带时间戳 .bak，再迁移，最后对话告知用户）
DATA_SOURCES: []               # 数据源清单（升级不覆盖；AI 每次采集前 Read 本文件按此清单收集；空清单 = 无自动化数据源，只按会话/文字内容生成）。本清单是数据源唯一真相源：日报/周报/月报/季报/年报五个统计技能收集数据时也读本清单跑采集器。每项：name 唯一名称 + type 类型 + 路径。三种类型示例（把下方 # 注释示例改成你的真实数据源后填入上方数组；未知 type（拼写错误）忽略该项并在采集摘要中一句话提示，不中断）：
  # - name: 主项目仓库          # 名称：唯一 key（重名视为同一数据源；口述「只聚合 xxx」按 name 匹配）
  #   type: git                # git = 代码仓库（git log 聚合提交/增删行数/日周月分布/里程碑；路径不存在/非代码仓库时静默跳过）
  #   mac: ~/Projects/main-app  # macOS 路径（绝对路径或 ~ 开头）
  #   win: D:\Projects\main-app # Windows 路径；「-」= 该系统不存在，自动跳过
  # - name: 周例会纪要
  #   type: file               # file = 普通文件/目录（文件提取要点；目录递归扫文本文件 md/txt/csv/log/json/yaml，二进制跳过；路径无效静默跳过）
  #   mac: ~/Documents/meeting-notes.md
  #   win: -
  # - name: 数据接口
  #   type: remote             # remote = 远程网络源（只需 url 字段忽略 mac/win；脚本联网拉取提取要点；失败静默跳过不阻塞）
  #   url: https://example.com/data.json
EXCLUDE_EXTRA: []              # 追加生成物剔除表（升级不覆盖）：内置表已含 node_modules/dist/build/vendor/.venv/__pycache__/.git/.next/.nuxt/.cache/coverage/.speccore/.build/*.lock/*.min.js/*.min.css/*.map/.DS_Store；仓库另有独特生成物时在此追加路径正则（追加不覆盖内置表），示例：
  # - (^|/)generated/           # 命中路径不计入增删行数，透明记入 JSON 的 excluded 字段
```

> 临时口头要求（仅对当次生效，不修改上方配置）：说「只聚合 xxx / 只算这个仓库」→ 当次按 name 匹配只采集指定数据源；说「加个数据源：xx 仓库在 <路径>」→ 写入 DATA_SOURCES 清单（永久生效）；说「这个目录的生成物也别算」→ 追加到 EXCLUDE_EXTRA。

## 📖 详细引导

数据源逐字段填写说明、五种周期的窗口参数对照、增量缓存与失败兜底语义，见 `resources/usage-guide.md`（使用指南）与 `resources/collect.md`（采集机制）。数据源配置写好后，五个统计技能（daily/weekly/monthly/quarterly/annual-report）会自动按本清单取数，无需在五份 user-config.md 里重复配置。
