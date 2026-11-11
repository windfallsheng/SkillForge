CONFIG_VERSION: 3

# 页面与数据目录（prompt-pouch.html 与 prompts.json 的落盘处）
DIR: /Users/luzhaosheng/MyWork/prompt-pouch
DIR_WIN: %USERPROFILE%\prompt-pouch

# 本地预览端口（HTTP 方式访问 cache/prompts.json）
PORT: 8933

# 数据与备份子目录（相对 DIR；空串 = 平铺在 DIR 根下，旧行为）
DATA_DIR: cache
BACKUP_DIR: backup

# 首次初始化数据：example = 示例五组（写作输出/沟通协作/规划执行/复盘成长/提问艺术，各职业通用）；empty = 空结构
INIT_DATA: example

# 页面主题（初始化时写入页面根标签 data-theme；页面右下角换肤坞可随时切换）
# 可选：gold 暖棕金（默认）/ tech 深蓝科技 / mono 极简黑白 / mint 薄荷绿
THEME: gold

# 初始化/落盘前是否先确认目标目录
CONFIRM: false
