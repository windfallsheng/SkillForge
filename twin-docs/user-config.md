# user-config.md（本文件不会被 skill 升级覆盖，你的修改永久保留）
# 官方配置更新时，另存 user-config.md.upstream 对照文件，可手动合并新配置点

```yaml
CONFIG_VERSION: 1  # 配置结构版本，skill 升级迁移依据

DIRECTION: zh2en   # 翻译方向：zh2en 中文→英文 / en2zh 英文→中文
GLOSSARY_FILE: docs/glossary.csv  # 术语表（term,zh,en 三列 CSV）；不存在则按规则翻译并顺带收集术语建议
LINK_RULE: mutual  # 顶部互链规则：mutual 中英互链 / oneway 仅中文链英文 / none 不互链
STYLE: concise     # 翻译风格：concise 简洁直译（默认）/ literal 更贴近原文语序
SYNC_MODE: both    # 执行动作：translate 只翻译 / check 只检查同步 / both 翻译后顺带检查
