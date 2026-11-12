# user-config.md（本文件不会被 skill 升级覆盖，你的修改永久保留）
# 官方配置更新时，另存 user-config.upstream.md 对照文件，可手动合并新配置点

```yaml
CONFIG_VERSION: 1  # 配置结构版本，skill 升级迁移依据

# 提交收集口径
REPO: auto          # git 仓库根目录；auto = 当前工作目录向上探测 .git；也可写绝对路径
SCOPE_HINT:         # 可选：本次发版主题一句话（如「发版说明聚焦 CLI 与文档」），空 = 全量归纳

# 产出形态
LANG: both          # 说明语言：zh / en / both（双语两份）
CHANGELOG_FILE: CHANGELOG.md   # 条目插入位置（相对 REPO 根）；both 时同步生成 CHANGELOG.en.md
REL_DIR: releases/  # RELEASE-{tag}.md 落盘目录（相对 REPO 根，不存在则创建）
STATS: true         # 是否附提交统计（提交数 / 净增删行数 / 提交者分布）
