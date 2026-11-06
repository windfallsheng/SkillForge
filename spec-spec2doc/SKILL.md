---
name: spec-spec2doc
description: >
  SpecCore 文档导出专属 Skill（spec2doc）。仅在用户明确提到 speccore、迭代、期次、Spec、/spec2doc 等关键词，
  或明确要求通过 speccore 导出文档时使用：将迭代 / Task 的规格文档导出为 Word / PDF 交付文档（AI 排版 + 验证）。
  参数提取与前置校验（迭代/Task 存在性）由 speccore ask 引擎执行；参数缺失时引擎输出 [SPECCORE_NEEDS_INFO] 交互式提示。
  不影响 speccore ask 的意图识别能力。
  不处理一般性的文档转换（如「把这个 md 转成 Word」非 speccore 语境），只处理 speccore 上下文中的规格导出。
allowed-tools: ["Bash", "Read", "Write", "Edit"]
disable-model-invocation: false
---

# 规格 → 交付文档（spec2doc）

将 SpecCore 迭代 / Task 的规格文档（`020-specs/`、`030-tasks/`）导出为 Word / PDF 交付文档，由引擎编排 AI 排版与验证，产出可直接交付的文档文件。

## 前置依赖

- SpecCore CLI 已安装（`speccore` 命令可用）
- 已有迭代且规格文档已产出（analyze / taskify 之后）
- speccore ask 引擎随 SpecCore 提供：负责参数提取、前置校验（迭代/Task 存在性）与命令构造，本技能不自行解析参数

## 执行机制

直接执行: execute_command("speccore ask '用户原话'")

不要输出命令文本，不要分析意图，一切交给 speccore ask。

底层命令为 spec2doc（-i 指定迭代、-o 指定输出文件名与格式 .docx/.pdf、--all 导出全部规格），由引擎构造，本技能不自行拼命令。

## 输出标记处理

- `[SPECCORE_EXEC: <cmd>]` → 立即执行该命令，不要向用户复述命令文本
- `[SPECCORE_PROMPT]` → 将后续 Prompt 内容作为你的工作指令执行
- `[SPECCORE_NEEDS_INFO]` → 用交互式提问向用户收集缺失参数，收齐后重新执行
- `[SPECCORE_CONFIRM_NEEDED]` → 向用户展示确认项，等确认后再继续
- `[SPECCORE_STEP_DONE]` → 告知用户本步完成，下一步请在同一会话继续执行提示中的命令；上下文紧张时才开新会话用 --resume 继续
- `[SPECCORE_CONTINUE: <path>]` → 优先在同一会话继续下一批（按标记中的命令执行）；上下文紧张时开新对话，先读取 <path> 恢复上下文
- `[SPECCORE_INTENT]` / `[SPECCORE_RESULT]` → 原样转达用户
- 其他 `[SPECCORE_*]` 标记 → 参照 SpecCore 自带 speccore-router 技能的 SKILL.md 处理

## 使用说明

用户仅询问使用方法（「spec-spec2doc 怎么用 / 使用说明 / 使用步骤 / 能干什么」）时不启动流程，输出以下纯文字指南，不执行任何 speccore 命令：

本技能将 SpecCore 迭代 / Task 的规格文档导出为 Word / PDF 交付文档（AI 排版 + 验证）。

**使用步骤**：1. 确保已有迭代且规格文档已产出（analyze / taskify 之后）；2. 直接说「导出文档」「生成 Word/PDF」「导出 Q1 迭代的文档」「打包技术文档」等；3. 引擎自动提取迭代与输出格式参数，迭代不存在时会交互式提问；4. 导出完成后产出 .docx / .pdf 交付文档，可用 --all 导出全部规格。

**支持格式**：Word（.docx）/ PDF（.pdf）。

**触发词**：导出文档 / 生成 Word/PDF / 打包技术文档 / 导出全部 Spec / /spec2doc。
