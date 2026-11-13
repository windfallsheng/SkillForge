# 用户配置（升级技能时本文件不会被覆盖）

> 你的个人配置全放在这里。skill-forge 升级技能时官方只更新 SKILL.md 与 resources/，
> 本文件始终保留你的版本——锦囊落盘目录、预览端口、初始化数据、主题放心改。
> 官方升级若带来新配置点，会另存 `user-config.upstream.md` 对照文件到同目录，
> 你按需查看并手动合并新配置点到本文件。

## ⚙️ 默认配置（用户可手动修改；临时口头要求永远优先）

```yaml
CONFIG_VERSION: 4              # 配置结构版本：skill 升级时若配置结构变化会递增；AI 每次执行前对比 SKILL.md「配置版本机制」节声明的当前版本，不一致时按 SKILL.md 的迁移规则处理（先备份本文件为带时间戳 .bak，再迁移，最后对话告知用户）
DIR: ~/prompt-pouch            # 落盘根目录（prompt-pouch.html 与 prompts.json 的落盘处，目录不存在时初始化自动创建）
DIR_WIN: %USERPROFILE%\prompt-pouch   # Windows 落盘根目录
PORT: 8933                     # 本地预览端口（HTTP 方式访问 data/prompts.json；端口被占时自动换 PORT+1 再试）
DATA_DIR: data                 # 数据子目录（相对 DIR；空串 = 平铺在 DIR 根下，旧行为）。v4 起默认 data（语义正名：目录放的是全量数据不是缓存；v3 及以前默认 cache）
BACKUP_DIR: backup             # 备份子目录（相对 DIR；页面自动备份滚动双档，AI 代笔落盘前留 prompts.json.bak-时间戳）
INIT_DATA: example             # 首次初始化数据：example = 示例五组（写作输出/沟通协作/规划执行/复盘成长/提问艺术，各职业通用）；empty = 空结构
THEME: gold                    # 页面主题（初始化时写入页面根标签 data-theme；页面右下角换肤坞可随时切换）——gold 暖棕金（默认）/ tech 深蓝科技 / mono IDEA 黑亮 / light IDEA 白亮 / mint 薄荷绿
CONFIRM: false                 # 初始化/落盘前是否先确认目标目录
```

> 临时口头要求（仅对当次生效，不修改上方配置）：说「把锦囊建在 XX 目录」→ 当次 DIR 改用该目录（仅初始化时）；说「先确认目录」→ 当次 CONFIRM=true、说「不用确认」→ 当次 CONFIRM=false；说「锦囊要示例数据」→ 当次 INIT_DATA=example、说「空锦囊就行」→ 当次 INIT_DATA=empty；说「不用查锦囊」→ 当次跳过取用纪律（日常任务不先翻锦囊）。

---
> 更多用法见 SKILL.md 与 resources/ 分册。
