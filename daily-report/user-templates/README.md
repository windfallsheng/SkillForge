# 用户模板目录（user-templates/）

你的自定义模板放这里：**一个模板一个 .md 文件，文件名即模板名**。
本目录受升级保护（.preserve 清单声明），skill 升级永不覆盖你的模板文件（本 README 除外，官方会随升级更新说明）。

## 三种用法

1. **按名临时用**：说「这次按 XX 模板来」→ 当次用 `user-templates/XX.md`（不存在则查内置 `templates/XX.md`），不改配置
2. **按名长期用**：把 user-config.md 顶部 TEMPLATE 改为模板名（如 `TEMPLATE: custom`）→ 之后默认按 `user-templates/custom.md` 生成
3. **存成新模板**：说「把这段结构存成 XX 模板」→ AI 把当前口述结构写入 `user-templates/XX.md`（不改 TEMPLATE）；说「以后都用这个模板」→ 写入后把 TEMPLATE 改为对应名（永久生效）

## 模板文件写法

只写段结构与条目格式即可（示例见下）；未写明的细节（中文顿号序号、生成时间行、落盘行为、HTML 样式）沿用默认规范。

```text
段一：今日工作内容（每条：工作描述 - 完成情况）
段二：存在问题与困难（只列描述）
段三：明日工作计划（每条：计划描述 - 预计完成时间）
```

## 与内置模板的关系

- 用户模板与内置模板同名 → 用户模板优先（覆盖）
- 想改内置 default 的段结构 → 别改 templates/default.md（升级会覆盖），把改好的结构复制一份存成本目录下的新模板文件（如 custom.md），再把 TEMPLATE 改为对应名
- 查模板顺序完整说明见同级 templates/README.md 与 SKILL.md「⚙️ 配置与自定义模板」节
