# user-config.md（本文件不会被 skill 升级覆盖，你的修改永久保留）
# 官方配置更新时，另存 user-config.upstream.md 对照文件，可手动合并新配置点

```yaml
CONFIG_VERSION: 1  # 配置结构版本，skill 升级迁移依据

TARGET: auto       # 体检目标：auto = 自动探测 ~/.qoder-cn/skills、~/.claude/skills、~/.cursor/rules 等技能目录；也可写指定目录
CHECKS: full       # 检查范围：full 全项 / slim 核心项（frontmatter + 资源可达 + 配置版本）
FIX: ask           # 发现问题是否顺修：ask 先列建议问用户 / off 只报告
