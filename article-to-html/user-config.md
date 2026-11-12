# 用户配置（升级技能时本文件不会被覆盖）

> 你的个人配置全放在这里。skill-forge 升级技能时官方只更新 SKILL.md、design-system.md 与 resources/scripts，
> 本文件始终保留你的版本——页面主题色默认值放心改。
> 官方升级若带来新配置点，会另存 `user-config.md.upstream` 对照文件到同目录，
> 你按需查看并手动合并新配置点到本文件。

## ⚙️ 默认配置（用户可手动修改；临时口头要求永远优先）

```yaml
CONFIG_VERSION: 2              # 配置结构版本：skill 升级时若配置结构变化会递增；AI 每次执行前对比 SKILL.md「配置版本机制」节声明的当前版本，不一致时按 SKILL.md 的迁移规则处理（先备份本文件为带时间戳 .bak，再迁移，最后对话告知用户）
DIR: auto                      # 产物落盘根目录：auto = 按当前系统自动选 DIR_MAC / DIR_WIN（也可直接写死某个绝对路径）；用户口头指定目录永远优先
DIR_MAC: ~/articles            # macOS 落盘根目录（目录不存在时回退用户主目录）
DIR_WIN: %USERPROFILE%\articles # Windows 落盘根目录（目录/盘符不存在时回退用户主目录）
THEME: tech                    # A 款（暗色封面长文风）页面主题色：tech 科技蓝（默认）/ gold 暖棕金 / forest 墨绿 / plum 梅紫；生成时写入 <html data-theme="THEME值"> 定默认，页面右下角换肤坞可随时切换（浏览器本地记忆（键按页内嵌唯一 ID 隔离、多份产物互不串台、改名/移动目录记忆不丢；生成时头部写 `<meta name="article-id" content="<UUID>">`，每次新 UUID），?shot 截图模式自动隐藏，打印隐藏）；其余五款风格（B 文艺/C 极简白/D 终端极客/E 卡片流/F 报纸）本色锁定不参与换肤
```

> 临时口头要求（仅对当次生效，不修改上方配置）：说「写到桌面」→ 当次落盘到桌面（macOS=~/Desktop、Windows=%USERPROFILE%\Desktop）；说「存到 ~/articles / D:\articles」→ 当次用指定目录；说「主题色用暖棕金/金色」→ 当次 data-theme="gold"；说「这次用墨绿主题」→ 当次 data-theme="forest"；说「以后默认用梅紫主题」→ 永久把 THEME 改为 plum。

---
> 更多用法见 SKILL.md 的「Workflow」与 design-system.md 设计系统参考。
