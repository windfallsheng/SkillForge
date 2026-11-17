---
name: report-collector
description: 通用数据采集器：按 DATA_SOURCES 清单（git 仓库 / 本地文件 / 远程 URL 三通道）运行 report-collect.py 聚合数据，输出标准 JSON（提交数 / 增删行数 / 日周月分布 / 里程碑，内置生成物剔除表）与人类可读采集摘要；report-state.json 增量缓存让同窗口重复采集免重扫。日报 / 周报 / 月报 / 季报 / 年报五个统计技能的统一取数入口。当用户请求采集数据、聚合 git 提交、配置数据源、跑 report-collect 时使用。
allowed-tools: Bash, Read, Write
disable-model-invocation: false
---

# 通用数据采集器（report-collector）

一个采集器，五种周期复用：日报传当天窗口、周报传本周、月报传当月、季报传当季、年报传全年——采集逻辑零差异，五统计 skill 共享同一份口径（业内「数据聚合 → 趋势分析 → 报告生成」三 Skill 流水线模式的第一环）。

## 采集流程

0. **读用户配置**（DATA_SOURCES 数据源清单 / EXCLUDE_EXTRA 追加剔除）→ 先 Read 同目录 `user-config.md`（数据源唯一真相源，五统计技能也按它取数）
1. **运行采集器**（三通道行为 / 参数映射 / 增量缓存语义）→ 读 `resources/collect.md`，按其中命令模板运行 `scripts/report-collect.py`
2. **解读标准 JSON**（字段口径 / 状态枚举 / 剔除统计）→ 读 `resources/json-contract.md`
3. **采集摘要反馈**：脚本跑完先回一句人类可读摘要——「已从 3 个仓库聚合 47 次提交、2 个文件提取要点、1 个远程源失败已跳过」（脚本 stderr 已打印，引用即可），让用户看见数据从哪来；全部失败时明确告知并退回纯口述模式
4. **使用咨询**（用户只问「数据采集器怎么用 / report-collect 怎么用」等用法、未要求采集）→ 读 `resources/usage-guide.md`，将其内容原样输出（首行标题改为「通用数据采集器使用指南」），不跑脚本、不采集数据

## ⚙️ 配置与自定义

**执行本 skill 前必须先 Read 同目录 `user-config.md`**：数据源清单（DATA_SOURCES，含 git/file/remote 三种类型与 mac/win 双平台字段）与追加剔除表（EXCLUDE_EXTRA）都在该文件中，以它为准。升级技能时 user-config.md 不会被覆盖，你的修改永久保留；官方更新配置时另存 `user-config.upstream.md` 对照文件，可按需手动合并新配置点。

- **DATA_SOURCES 是数据源唯一真相源**：五个统计技能（daily/weekly/monthly/quarterly/annual-report）收集数据时也先读本清单跑采集器。用户说「把这些 git 地址 / 目录配置到这个 skill」「数据源加一下」「以后数据从 XX 仓库取」→ 写 `user-config.md` 的 `DATA_SOURCES` 清单；说「只聚合 xxx」→ 当次按 name 匹配只采集指定源（不写配置）；意图仍有歧义（如分不清「数据源配置」与「落盘目录配置」）→ 一句话与用户确认后写入，不猜
- **EXCLUDE_EXTRA 追加剔除**：脚本内置生成物剔除表（node_modules / dist / *.lock / .speccore 等），仓库另有独特生成物时在 user-config.md 的 EXCLUDE_EXTRA 追加路径正则（追加不覆盖内置表）

## 配置版本机制（升级保护）

本 skill 当前配置版本为 `1`（对应 user-config.md 中的 `CONFIG_VERSION`）。执行时若发现 user-config.md 的 CONFIG_VERSION 与本节声明不一致：

1. 先将旧 user-config.md 备份为 `user-config.bak-<时间戳>.md`（同目录，绝不删除旧值）
2. 按本节「配置升级规则」迁移字段：新增字段补默认值、改名字段按映射改写、删除字段的值保留在备份中并在对话提示用户手动确认
3. 更新 CONFIG_VERSION 为当前版本
4. 对话中明确告知用户「检测到配置版本从 X 升级到 Y，旧配置已备份至 <路径>」

升级本 skill 时，配置结构如有变化必须同步更新本节的当前版本号与迁移说明；禁止在未声明版本变更的情况下静默修改配置语义。

## 文档同步自检纪律（维护者必读）

修改本 skill 任一文件（SKILL.md / user-config.md / resources/* / scripts/*）后，必须 grep 全文核对相关关键词在各文件间一致（字段名 / 参数名 / 状态枚举 / JSON 字段改名时新旧词全仓核对，旧词零残留才算完成）。**脚本字段与 json-contract.md 必须一一对应**：改 scripts/report-collect.py 的输出字段时同步改 json-contract.md，反之亦然。

## 规则速览

- 零依赖：脚本仅用 Python 3.8+ 标准库（YAML 解析优先 PyYAML，缺失时内置 mini 解析器兜底）；Windows 需自行安装 Python 并确保 python 命令可用，环境无 Python 时按 resources/collect.md 的手工命令模板降级采集
- 静默跳过：路径不存在 / 非 git 仓库 / 二进制文件 / url 拉取失败 / 未知 type 一律静默跳过（记入 JSON 的 status=skipped 与 skip_reason），不报错、不中断、不编造
- 透明剔除：生成物（.speccore/code-graph/ 的 graph.json 单文件可贡献数十万行等）不计入增删行数，但按来源记入 excluded 字段，采集摘要同步展示「剔除生成物 +X/-Y」
- 增量缓存：同 git 源同窗口上次成功 → 直接复用（from_cache: true）；--full 忽略缓存全量重扫（年报用）；缓存文件在 ~/.skillforge/report-state.json，可安全删除
- 不猜不编：采集失败的数据源只记状态不编数据；统计数字一律来自脚本输出，禁止手改
- 采集摘要反馈：每次采集后先向用户回一句数据来源摘要（脚本 stderr 已有），全失败时告知并退回纯口述模式

## 扩展规划（已评估、暂不落地）

Jira/TAPD/禅道 API 后续做成采集器子命令（token 放 user-config.md 用户自填，脚本读取，不落记忆）；飞书/钉钉接口需企业权限、个人场景价值低暂不纳入；本地 iCal 日历导出文件成本低可加。当前仅 git/file/remote 三通道。

---

## 🔍 SkillForge 使用指引（整体咨询时触发）

当用户询问 **SkillForge 本身**（不是单个技能用法）——「skillforge 怎么用 / 使用说明 / 使用指引 / 是什么」「技能怎么安装 / 怎么升级 / 装了哪些技能 / 技能清单」「skill-forge ls / init / update 等命令怎么用」「技能安装器 / 技能锻造坊」等（中英文、近似说法均可，关键词可自由扩展）：
1. Read 同目录 `resources/skillforge-guide.txt` 全文，按其内容整理回答（命令与参数以 txt 为准，勿自行编造）
2. 用系统命令打开同目录 `resources/skillforge-guide.html`（macOS `open`，Windows `start`），让用户在浏览器看排版版
3. 用户只问单个技能怎么用时（如「采集器怎么用」）不触发本指引，走本技能的使用说明
