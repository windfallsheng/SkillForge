# user-config.md（本文件不会被 skill 升级覆盖，你的修改永久保留）
# 官方配置更新时，另存 user-config.md.upstream 对照文件，可手动合并新配置点

```yaml
CONFIG_VERSION: 1  # 配置结构版本，skill 升级迁移依据

THEME: deepblue     # 海报主题：deepblue 深蓝 / gold 暖金 / mint 薄荷
DIR: auto           # 落盘目录：auto = 当前工作目录 posters/；也可写绝对路径
OPEN_HTML: true     # 落盘后是否自动打开海报 html
SHOT: true          # 是否顺带用 ?shot 截一张 PNG（与 html 同名）
ASPECT: 3:4         # 截图纵横比：3:4 竖版海报（默认）/ 1:1 方版 / 16:9 横版
