# 落盘根目录（自动按目标日期建子目录；目录不存在时回退用户主目录下 reports）
DIR_MAC: ~/reports
DIR_WIN: %USERPROFILE%\reports

# pptx 主题（与报告五主题同源）
# 可选：tech 深蓝科技（默认）/ biz 浅色商务 / mono IDEA 黑亮 / light IDEA 白亮 / warm 温暖渐变
THEME: tech

# 成片方式（三问模型第三问的默认答案）
# 可选：page-by-page 逐页确认（默认，每页先报排版方案，OK 才出片）/ once 一键成片
MODE: page-by-page

# 受众画像（演讲备注话术参考：开场白/数据解读/过渡句的语气与深度）
AUDIENCE: 内部汇报

# 是否生成演讲备注（每页 notes：开场白/数据解读/过渡句）
NOTES: true

# 生成后是否自动打开 pptx（macOS open / Windows start）
OPEN_PPTX: true

# 落盘前是否先确认目标目录
CONFIRM: false

# 配置结构版本（升级迁移用，勿手改）
CONFIG_VERSION: 2
