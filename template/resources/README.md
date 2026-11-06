# resources/ 拆分规范

重内容按生成阶段一文件一职责拆分；SKILL.md 流程节点标注「读 resources/xxx.md」，AI 执行到对应阶段才读取对应文件，不提前全部加载。

常用拆分（按技能实际情况增删）：

| 文件 | 职责 |
|:---|:---|
| `usage-guide.md` | 用户可读使用说明；咨询应答（只问用法）时的原样输出源 |
| `date-parsing.md` | 时间/日期/周的自然语言解析规则 |
| `data-collection.md` | 数据收集：来源清单 / 命令模板 / 口径过滤规则 |
| `content-rules.md` | 内容聚合与写作规则 + 输出格式模板 |
| `industry-dictionary.md` | 行业 / 角色词典（触发词与词条表） |
| `disk-and-html.md` | 落盘行为 / HTML 样式 / 截图规范 |

约定：

- 每份 resource 独立可读，不互相引用（避免读取链断裂）
- 用户可手改的配置（默认配置 / 自定义模板）必须留在 SKILL.md，不进 resources
- resource 内标题用原章节标题，内容从旧版单文件 SKILL.md 原样迁移
