CONFIG_VERSION: 4

# 页面与数据目录（prompt-pouch.html 与 prompts.json 的落盘处）
DIR: /Users/luzhaosheng/MyWork/prompt-pouch
DIR_WIN: %USERPROFILE%\prompt-pouch

# 本地预览端口（HTTP 方式访问 data/prompts.json）
PORT: 8933

# 数据与备份子目录（相对 DIR；空串 = 平铺在 DIR 根下，旧行为）。v4 起 DATA_DIR 默认 data（语义正名：目录放的是全量数据不是缓存；v3 及以前默认 cache）
DATA_DIR: data
BACKUP_DIR: backup

# 首次初始化数据：example = 示例五组（写作输出/沟通协作/规划执行/复盘成长/提问艺术，各职业通用）；empty = 空结构
INIT_DATA: example

# 页面主题（初始化时写入页面根标签 data-theme；页面右下角换肤坞可随时切换）
# 可选：gold 暖棕金（默认）/ tech 深蓝科技 / mono IDEA 黑亮 / light IDEA 白亮 / mint 薄荷绿
THEME: gold

# 初始化/落盘前是否先确认目标目录
CONFIRM: false
