# user-config.md（本文件不会被 skill 升级覆盖，你的修改永久保留）
# 官方配置更新时，另存 user-config.md.upstream 对照文件，可手动合并新配置点

```yaml
CONFIG_VERSION: 1  # 配置结构版本，skill 升级迁移依据

OUT_FORMAT: json   # 结构化落盘格式：json / csv / both
CLEAN_PRESET: standard  # 清洗预设：standard 标准清洗（去空行/去首尾空格/空值留空不编造）/ minimal 只转格式不洗
DIR: auto          # 落盘目录：auto = 源文件同目录 cleaned/ 子目录；也可写绝对路径
REPORT: true       # 是否生成数据概览报告 md
ID_FIELDS:         # 可选：主键字段名（逗号分隔），用于去重
