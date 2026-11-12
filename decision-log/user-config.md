# user-config.md（本文件不会被 skill 升级覆盖，你的修改永久保留）
# 官方配置更新时，另存 user-config.md.upstream 对照文件，可手动合并新配置点

```yaml
CONFIG_VERSION: 1  # 配置结构版本，skill 升级迁移依据

DIR: auto          # 日志根目录：auto = 当前项目 .decisions/；无项目上下文时回退用户主目录 ~/decisions
TEMPLATE: four-tuple  # 记录模板：four-tuple 四元组（默认）
ASK_CONFIRM: false  # 落盘前是否先展示记录内容等用户确认
