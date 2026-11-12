# 用户配置（升级技能时本文件不会被覆盖）

> 你的个人配置全放在这里。skill-forge 升级技能时官方只更新 SKILL.md 与 resources/，
> 本文件始终保留你的版本——输出目录、模板与引擎策略、确认方式放心改。
> 官方升级若带来新配置点，会另存 `user-config.upstream.md` 对照文件到同目录，
> 你按需查看并手动合并新配置点到本文件。


## ⚙️ 默认配置（用户可手动修改；临时口头要求永远优先）

```yaml
CONFIG_VERSION: 1              # 配置结构版本：skill 升级时若配置结构变化会递增；AI 每次执行前对比 SKILL.md「配置版本机制」节声明的当前版本，不一致时按 SKILL.md 的迁移规则处理（先备份本文件为带时间戳 .bak，再迁移，最后对话告知用户）
OUTPUT_DIR: auto              # 输出目录：auto = 与源 md 同目录；可写死绝对路径
TEMPLATE_DOCX: auto           # Word 模板：auto = 依次探测 <源目录>/template.docx → reference.docx → 无则 Pandoc 默认样式；可指定模板路径
TOC: true                     # Word/PDF 是否生成目录（--toc --toc-depth=3）
PDF_ENGINE: auto              # PDF 引擎：auto = 探测 xelatex（有则 LaTeX 路径）→ 无则 Chrome 打印路径
```

> 临时口头要求（仅对当次生效，不修改上方配置）：说「输出到 XX」→ 当次改 OUTPUT_DIR；说「用这个模板」+ 路径 → 当次换模板；说「不要目录」→ 当次 TOC=false；说「必须用 LaTeX 出 PDF」→ 当次 PDF_ENGINE=xelatex（无引擎则引导安装）。

---
> 更多用法见 SKILL.md 的「生成流程」与 resources/ 分册。
