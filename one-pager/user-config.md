# user-config.md（本文件不会被 skill 升级覆盖，你的修改永久保留）
# 官方配置更新时，另存 user-config.md.upstream 对照文件，可手动合并新配置点

```yaml
CONFIG_VERSION: 2  # 配置结构版本，skill 升级迁移依据

TEMPLATE: classic  # 海报模板：classic 经典舞台 / minimal 极简留白 / magazine 杂志社论 / hero 巨幕大字 / timeline 时间叙事 / grid 卡片栅格 / dashboard 数据仪表 / brutalist 新粗野
THEME: tech        # 海报主题：tech 深蓝科技 / biz 浅色商务 / mono IDEA 黑亮 / light IDEA 白亮 / warm 温暖渐变 / ink 水墨国风 / jade 翡翠绿 / rose 玫瑰金 / midnight 午夜金 / violet 霓虹紫
DIR: auto           # 海报库根目录：auto = 当前工作目录 posters/；也可写绝对路径；每张海报一个 slug 子目录（poster.html / poster.md / poster.png 三件套）
OPEN_HTML: true     # 落盘后是否自动打开海报 html
SHOT: true          # 是否顺带用 ?shot 截一张 PNG（与 html 同名）
ASPECT: 3:4         # 截图纵横比：3:4 竖版海报（默认）/ 1:1 方版 / 16:9 横版
```
