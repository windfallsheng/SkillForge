# user-config.md（本文件不会被 skill 升级覆盖，你的修改永久保留）
# 官方配置更新时，另存 user-config.md.upstream 对照文件，可手动合并新配置点

```yaml
CONFIG_VERSION: 1  # 配置结构版本，skill 升级迁移依据

REPO: auto          # git 仓库根目录：auto = 当前工作目录向上探测 .git；也可写绝对路径
DAYS: 365           # 统计天数（默认近一年 365，可 180/90/30）
DIR: auto           # 落盘目录：auto = REPO 根目录 reports/；也可写绝对路径
OPEN_HTML: true     # 落盘后是否自动打开热力图 html
THEME: github       # 页面主题：github 经典绿 / dark 深夜绿 / amber 琥珀金
EXCLUDE:            # 排除名单（提交者邮箱或路径关键词，逗号分隔，如 bot@example.com,vendor/）
