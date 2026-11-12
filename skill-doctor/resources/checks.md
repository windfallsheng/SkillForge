# 扫描与逐项检查（阶段 1-2）

## 扫描

TARGET: auto 时按序探测技能目录（~/.qoder-cn/skills → ~/.claude/skills → ~/.cursor/rules → 当前项目 .agents/skills），汇总发现清单（技能名 / 目录 / 有无 SKILL.md）展示给用户确认范围；指定目录时直接扫描该目录。

## 检查项（CHECKS: full）

### 通用项（每个技能）

1. **frontmatter 完整性**：name 与目录名一致且非占位符；description 非空且含触发词；allowed-tools 存在
2. **resource 引用可达**：SKILL.md 中每个 `读 resources/xxx.md` 的文件真实存在（grep 提取 → ls 核对）
3. **配置标准**：user-config.md 存在且含 `CONFIG_VERSION:` 声明 + 「升级不会被覆盖」说明；SKILL.md 含「配置版本机制」节
4. **机制节齐全**：SKILL.md 含使用咨询接线（读 usage-guide.md）+ 文档同步自检纪律节
5. **旧词零残留**：SKILL.md 与 resources 全文 grep 占位符（skill-name / TODO / REF- 残留）与废弃字段名

### HTML 产出技能专属项（含 reference.html 的技能）

6. **reference 双轨**：resources/reference.html 存在；SKILL.md 流程节点标注先 Read reference.html
7. **字体零侵权**：reference.html 全文 grep 品牌字体（PingFang/YaHei/苹方/雅黑/apple-system）零出现；无 CDN 外链（@import / https:// 资源引用）
8. **多文件隔离**（页面有 localStorage 记忆时）：grep 所有 localStorage 键——带命名空间拼接（内嵌 ID），固定键零残留；HTML 头部含 `<meta name="{前缀}-id">` 且 content 为合法 UUID v4
9. **产物版本戳**：reference.html 头部含 `<meta name="sf-template" content="{技能名}@N">`（N≥1）；SKILL.md 含「产物升级（回炉）」节与主动提示语
10. **入场动画兜底**：含滚动入场动画时脚本有 2s 兜底强制全显代码

### slim（核心项）

只跑通用项 1-3，其余跳过并在报告注明。
