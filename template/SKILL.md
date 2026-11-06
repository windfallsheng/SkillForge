---
name: skill-name            # 技能名（英文短横线，与目录名一致）
description: 一句话说清做什么 + 触发词。当用户请求 … 或询问 … 时使用。
allowed-tools: Bash, Read, Write   # 按需裁剪
disable-model-invocation: false
---

# 技能标题

一句话说明技能产出与默认行为。

## 生成流程

1. **阶段一（做什么）** → 读 `resources/xxx.md`
2. **阶段二（做什么）** → 读 `resources/yyy.md`
3. **阶段三（做什么）** → 读 `resources/zzz.md`
4. **使用咨询**（用户只问用法、未要求生成）→ 读 `resources/usage-guide.md` 原样输出（首行标题改为「XX使用指南」），不执行任何生成动作

## ⚙️ 默认配置（用户可手动修改；临时口头要求永远优先）

```yaml
DISK: true      # 示例配置项：是否落盘写文件；false = 默认只在对话输出
DIR: auto       # 示例配置项：落盘根目录
```

> 临时口头要求（仅对当次生效，不修改上方配置）：说「xxx」→ 当次改某行为；……

## 📝 自定义模板（TEMPLATE: custom 时启用，用户可手改）

把顶部 TEMPLATE 改为 custom 后，按下面结构生成（段名、段数、条目格式均可改）：

```text
段一：……（每条：……）
段二：……（每条：……）
```

> 只写段结构与条目格式即可；未写明的细节沿用默认规范。

## 规则速览

- 硬性规则 3-5 条（序号格式 / 条目数量 / 兜底 / 单位等）
- 完整规则见 `resources/content-rules.md`
