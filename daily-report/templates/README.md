# 模板目录（templates/）

内置模板放这里，随 skill 升级更新——升级时本目录会被官方内容覆盖，**勿直接改这里**；自定义模板请放同级 `user-templates/` 目录。

## 模板查找顺序

生成报告时按 TEMPLATE 配置值（或口头「按 {名} 模板来」）依次查：

1. `user-templates/{名}.md`（用户模板，优先）
2. `templates/{名}.md`（内置模板）
3. 都找不到 → 回退 `templates/default.md`（内置默认），并在对话中一句话提示用户该模板名不存在

## 内置模板清单

| 模板名 | 文件 | 说明 |
| :--- | :--- | :--- |
| default | default.md | 内置三段式（今日任务进度/明日计划/风险阻塞点） |

## 与用户模板的关系

用户自己的模板放 `user-templates/`（升级永不覆盖），文件名即模板名；与内置模板同名时用户模板优先覆盖。想改内置 default 的段结构：别改本目录文件（升级会覆盖），把改好的结构复制一份存成 `user-templates/custom.md` 之类，再把 user-config.md 顶部 TEMPLATE 改为对应名。
