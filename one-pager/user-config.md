# user-config.md（本文件不会被 skill 升级覆盖，你的修改永久保留）
# 官方配置更新时，另存 user-config.upstream.md 对照文件，可手动合并新配置点

```yaml
CONFIG_VERSION: 3  # 配置结构版本，skill 升级迁移依据

TEMPLATE: classic  # 海报模板（六组流派共 28 套）：现代主义 classic 经典舞台 / minimal 极简留白 / swiss 瑞士国际 / window 视窗；编辑出版 magazine 杂志社论 / editorial 编辑刊 / typo 大字报 / newspaper 报纸新闻；数据商务 dashboard 数据仪表 / grid 卡片栅格 / timeline 时间叙事 / hero 巨幕大字；艺术流派 bauhaus 包豪斯 / mondrian 蒙德里安 / memphis 孟菲斯 / exhibit 展览 / popart 波普艺术 / opart 欧普艺术 / artnouveau 新艺术；先锋实验 brutalist 新粗野 / acid 酸性设计 / glitch 故障艺术 / vaporwave 蒸汽波 / cyber 赛博霓虹；场景专用 academic 学术会议 / recruit 招聘 / invitation 邀请函 / notice 通知公告
THEME: tech        # 海报主题（25 套）：tech 深蓝科技 / biz 浅色商务 / mono IDEA 黑亮 / light IDEA 白亮 / warm 温暖渐变 / ink 水墨国风 / jade 翡翠绿 / rose 玫瑰金 / midnight 午夜金 / violet 霓虹紫 / swiss 瑞士红黑 / bauhaus 包豪斯三原色 / memphis 孟菲斯撞色 / morandi 莫兰迪 / nordic 北欧 / artdeco 装饰艺术 / noir 黑白电影 / classicblue 经典蓝 / pop 波普 / retro 复古胶片 / coral 珊瑚橙 / acid 酸性荧光 / cyber 赛博霓虹 / cream 奶油纸 / academic 学术蓝
TPL_DIR: auto      # 用户模板库目录（你的专属模板存放处，升级不覆盖）：auto = ~/.skillforge/user-templates（Windows 下 %USERPROFILE%\.skillforge\user-templates）；也可写绝对路径；模板文件格式见 resources/user-template-example.html
DIR: auto           # 海报库根目录：auto = 当前工作目录 posters/；也可写绝对路径；每张海报一个 slug 子目录（poster.html / poster.md / poster.png 三件套）
OPEN_HTML: true     # 落盘后是否自动打开海报 html
SHOT: true          # 是否顺带用 ?shot 截一张 PNG（与 html 同名）
ASPECT: 3:4         # 截图纵横比：3:4 竖版海报（默认）/ 1:1 方版 / 16:9 横版
```
