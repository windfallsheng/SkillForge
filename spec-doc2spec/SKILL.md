---
name: spec-doc2spec
description: >
  SpecCore 文档导入专属 Skill（doc2spec）。仅在用户明确提到 speccore、迭代、期次、Spec、/doc2spec 等关键词，
  或明确要求通过 speccore 导入需求文档时使用：将 PRD / Word / PDF 需求文档导入迭代目录，
  产出需求文档与功能单元切片，后续可接 unitize / analyze / taskify 全流程。
  参数提取与前置校验（文件存在性、格式检测）由 speccore ask 引擎执行；参数缺失时引擎输出 [SPECCORE_NEEDS_INFO] 交互式提示。
  不影响 speccore ask 的意图识别能力。
  不处理一般性的文档内容讨论（如「帮我看看这份文档讲了什么」），只处理 speccore 上下文中的文档导入。
allowed-tools: ["Bash", "Read", "Write", "Edit"]
disable-model-invocation: false
---

# 文档 → 需求规格（doc2spec）

将需求文档（PRD / Word / PDF / Markdown）导入 SpecCore 迭代目录，产出 `010-requirements/` 下的需求文档与功能单元切片。.docx/.pdf 走 Pandoc 转换 + AI 双路交叉验证，导入后可继续 unitize 切分功能单元。

## 前置依赖

- SpecCore CLI 已安装（`speccore` 命令可用）
- 项目已有迭代目录（无迭代时引擎会引导创建）
- speccore ask 引擎随 SpecCore 提供：负责参数提取、前置校验（文件存在性、格式检测）与命令构造，本技能不自行解析参数

## 执行机制

直接执行: execute_command("speccore ask '用户原话'")

不要输出命令文本，不要分析意图，一切交给 speccore ask。

底层命令为 doc2spec（-f 指定文件、--iter 指定迭代、--files 批量导入多个文档），由引擎构造，本技能不自行拼命令。

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

用户仅询问使用方法（「spec-doc2spec 怎么用 / 使用说明 / 使用步骤 / 能干什么」）时不启动流程，输出以下纯文字指南，不执行任何 speccore 命令：

本技能将 PRD / Word / PDF 需求文档导入 SpecCore 迭代目录，产出需求文档与功能单元切片。

**使用步骤**：1. 确保已安装 SpecCore CLI 且项目已有迭代（speccore iteration create）；2. 直接说「导入需求 产品需求文档.docx」「把这份 PRD 转成 Spec」「分析这个 PRD 文档」等；3. 引擎自动提取文件与迭代参数，文件不存在、格式不支持或参数缺失时会交互式提问；4. 导入完成后产出 010-requirements/ 下的转换文档与切片，可继续 unitize 切分功能单元。

**支持格式**：.docx（Pandoc + AI 双路验证）/ .pdf / .md。

**触发词**：导入需求 / 把 PRD 转成 Spec / Word 转需求文档 / 分析这个 PRD / /doc2spec。
