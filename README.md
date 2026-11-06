# Qoder Report Skills

Qoder（QoderCN）技能仓库：工作日报 / 周报生成技能集合。所有技能均为「薄入口 SKILL.md + 按需读取 resources」结构——入口只保留 frontmatter、生成流程、用户可改配置与资源指引，重内容按生成阶段拆分，AI 执行到对应阶段才读取，降低常驻上下文占用。

## 技能清单

| 技能 | 目录 | 说明 |
|:---|:---|:---|
| daily-report | [daily-report/](daily-report/) | 聚合各仓库 git 提交 + 会话口述生成日报（今日完成任务/明日计划/风险阻塞点），支持自然语言日期（今天/昨天/上周三/10月20号）、连续多日批量、纯文字/图片/文件整理、自定义模板、12 行业词条 |
| weekly-report | [weekly-report/](weekly-report/) | 同上生成周报（本周完成任务/下周计划/风险阻塞点 + 本周概览卡），周结束日可配置（默认周五，可改周日等），支持自然语言周定位（本周/上周/10月第2周/节假日锚定） |

## 安装

将技能目录复制到 Qoder 技能目录（任选其一）：

```bash
# 全局技能目录（QoderCN 默认加载）
cp -R daily-report weekly-report ~/.qoder-cn/skills/

# 或自定义技能集合目录
cp -R daily-report weekly-report ~/SmartDeveloper/DevWorkspace/AI/MySkills/
```

复制后直接说「写日报」「写周报」即可触发；问「日报怎么用 / 周报怎么用」输出使用说明。

## 目录结构

```
.
├── README.md                    # 本文件
├── template/                    # 新技能模板（薄入口 + resources 拆分规范）
├── daily-report/
│   ├── SKILL.md                 # 薄入口：frontmatter + 生成流程 + 默认配置 + 自定义模板
│   └── resources/               # 重内容按生成阶段拆分，AI 按需读取
│       ├── usage-guide.md       # 📖 使用说明（咨询应答的原样输出源）
│       ├── date-parsing.md      # 🗓 日期解析（自然语言优先）
│       ├── data-collection.md   # 📥 数据收集（仓库表 / git 命令 / 行数口径）
│       ├── content-rules.md     # ✍️ 内容规则（聚合来源 / 补充任务 / 纯文字模式 / 输出格式 / 写作风格）
│       ├── industry-dictionary.md # 🏭 行业适配（12 行业职业词典）
│       └── disk-and-html.md     # 💾 本地落盘 / HTML 样式 / content-png 截图规范
└── weekly-report/
    ├── SKILL.md
    └── resources/               # 结构同 daily-report，周报专属差异：
                                 #   WEEK_END 周结束日 / 周定位解析 / 本周概览卡 / 用时 X.XD（1D=8H）
```

## 拆分规范（薄入口 + resources）

- **SKILL.md 只保留**：frontmatter、生成流程总览（每步标注读哪个 resource）、「⚙️ 默认配置」「📝 自定义模板」（用户手改的配置必须留在入口）、规则速览（3-5 条硬性规则）
- **resources/ 一文件一职责**：按生成阶段拆分，SKILL.md 流程节点标注 `读 resources/xxx.md`；每份 resource 独立可读，不互相引用
- **咨询应答**：用户只问用法不要求生成时，读 `resources/usage-guide.md` 原样输出（首行标题按技能改为「XX生成器使用指南」）
- **新技能按 `template/` 结构创建**，目录名 = 技能名（英文短横线）
