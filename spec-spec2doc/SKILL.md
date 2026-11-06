---
name: spec-spec2doc
description: >
  SpecCore 文档导出专属 Skill（spec2doc）。仅在用户明确提到 speccore、迭代、期次、Spec、/spec2doc 等关键词，
  或明确要求通过 speccore 导出文档时使用：将迭代 / Task 的规格文档导出为 Word / PDF 交付文档（AI 排版 + 验证）。
  执行前默认检测 Speccore CLI 安装状态，未安装则引导跨系统安装。
  参数提取与前置校验（迭代/Task 存在性）由 speccore ask 引擎执行；参数缺失时引擎输出 [SPECCORE_NEEDS_INFO] 交互式提示。
  不影响 speccore ask 的意图识别能力。
  不处理一般性的文档转换（如「把这个 md 转成 Word」非 speccore 语境），只处理 speccore 上下文中的规格导出。
allowed-tools: ["Bash", "Read", "Write", "Edit"]
disable-model-invocation: false
---

# 规格 → 交付文档（spec2doc）

将 SpecCore 迭代 / Task 的规格文档（`020-specs/`、`030-tasks/`）导出为 Word / PDF 交付文档，由引擎编排 AI 排版与验证，产出可直接交付的文档文件。

## ① 前置依赖检测（每次执行前必做）

本技能依赖 SpecCore CLI（npm 包名 `speccore`，全局命令 `speccore`）。执行任何 speccore 操作前，先终端探测安装状态：

```bash
speccore --version
```

- **输出版本号**（如 `8.3.x`）→ 已安装，进入「② 执行机制」
- **报错或退出码非 0**（`command not found` / `'speccore' 不是内部或外部命令` / 无法识别 cmdlet 等）→ 未安装，按「③ 安装指引」引导用户，**不执行任何 speccore 命令**

## ② 执行机制（检测通过后）

直接执行: execute_command("speccore ask '用户原话'")

不要输出命令文本，不要分析意图，一切交给 speccore ask。

底层命令为 spec2doc（-i 指定迭代、-o 指定输出文件名与格式 .docx/.pdf、--all 导出全部规格），由引擎构造，本技能不自行拼命令。

## ③ 安装指引（仅当检测未安装时输出给用户）

SpecCore CLI 跨系统安装（npm 包名 `speccore`，需要 Node.js）：

1. **确认 Node.js**：`node --version`；未安装先装 Node.js LTS——macOS：官网下载 .pkg 或 `brew install node`；Windows：官网下载 .msi 安装包并勾选「Add to PATH」；Linux：发行版包管理器或 nvm
2. **全局安装**：`npm install -g speccore`——Windows 报权限错误时改用管理员终端；macOS/Linux 报 EACCES 时用 `sudo npm install -g speccore`，或改用 nvm 管理的 Node 后免 sudo
3. **验证**：`speccore --version` 输出版本号即成功；Windows 若仍提示找不到命令，关闭并重新打开终端刷新 PATH
4. **不想全局安装**：项目内 `npm i -D speccore`，之后用 `npx speccore` 调用

安装完成后，请用户重新说一次需求，再走「② 执行机制」。

## ④ 输出标记处理

- `[SPECCORE_EXEC: <cmd>]` → 立即执行该命令，不要向用户复述命令文本
- `[SPECCORE_PROMPT]` → 将后续 Prompt 内容作为你的工作指令执行
- `[SPECCORE_NEEDS_INFO]` → 用交互式提问向用户收集缺失参数，收齐后重新执行
- `[SPECCORE_CONFIRM_NEEDED]` → 向用户展示确认项，等确认后再继续
- `[SPECCORE_STEP_DONE]` → 告知用户本步完成，下一步请在同一会话继续执行提示中的命令；上下文紧张时才开新会话用 --resume 继续
- `[SPECCORE_CONTINUE: <path>]` → 优先在同一会话继续下一批（按标记中的命令执行）；上下文紧张时开新对话，先读取 <path> 恢复上下文
- `[SPECCORE_INTENT]` / `[SPECCORE_RESULT]` → 原样转达用户
- 其他 `[SPECCORE_*]` 标记 → 参照 SpecCore 自带 speccore-router 技能的 SKILL.md 处理

## ⑤ 使用说明

用户仅询问使用方法（「spec-spec2doc 怎么用 / 使用说明 / 使用步骤 / 能干什么」）时不启动流程，输出以下纯文字指南，不执行任何 speccore 命令：

本技能将 SpecCore 迭代 / Task 的规格文档导出为 Word / PDF 交付文档（AI 排版 + 验证）。执行前自动检测 SpecCore CLI（`speccore` 命令）：已安装直接使用，未安装会给出 macOS / Windows / Linux 的安装指引。

**使用步骤**：1. 直接说「导出文档」「生成 Word/PDF」「导出 Q1 迭代的文档」「打包技术文档」等；2. 未装 CLI 时按引导安装（`npm install -g speccore`）；3. 引擎自动提取迭代与输出格式参数，迭代不存在时会交互式提问；4. 导出完成后产出 .docx / .pdf 交付文档，可用 --all 导出全部规格。

**支持格式**：Word（.docx）/ PDF（.pdf）。

**触发词**：导出文档 / 生成 Word/PDF / 打包技术文档 / 导出全部 Spec / /spec2doc。
