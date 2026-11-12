# 用户配置（升级技能时本文件不会被覆盖）

> 你的个人配置全放在这里。skill-forge 升级技能时官方只更新 SKILL.md 与 resources/，
> 本文件始终保留你的版本——输出目录、模板与引擎策略、确认方式放心改。
> 官方升级若带来新配置点，会另存 `user-config.md.upstream` 对照文件到同目录，
> 你按需查看并手动合并新配置点到本文件。


## ⚙️ 默认配置（用户可手动修改；临时口头要求永远优先）

```yaml
CONFIG_VERSION: 2              # 配置结构版本：skill 升级时若配置结构变化会递增；AI 每次执行前对比 SKILL.md「配置版本机制」节声明的当前版本，不一致时按 SKILL.md 的迁移规则处理（先备份本文件为带时间戳 .bak，再迁移，最后对话告知用户）
OUTPUT_DIR: auto              # 输出目录：auto = 源文档同目录下新建 {文档名}-spec/ 子目录；写绝对路径时以其为产物根目录、其下仍建 {文档名}-spec/ 子目录（说「直接放这个目录」才平铺）
IMG_DIR: assets/images        # 图片提取目录（相对输出目录）；Pandoc --extract-media 提取到此处
EMF_POLICY: convert           # EMF/WMF 图片策略：convert = 自动跨系统转 PNG（LibreOffice 兜底）；keep = 保留原样并在澄清清单注明不可渲染
CONFIRM: never                # 落盘前确认：never = 直接生成落盘；always = 先出加工预览确认后再落盘
```

> 临时口头要求（仅对当次生效，不修改上方配置）：说「输出到 XX 目录」→ 当次改 OUTPUT_DIR；说「图片放 XX」→ 当次改 IMG_DIR；说「先看看效果」→ 当次先出预览确认再落盘。

---
> 更多用法见 SKILL.md 的「生成流程」与 resources/ 分册。
