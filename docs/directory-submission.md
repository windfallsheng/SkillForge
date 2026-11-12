# 目录收录素材包 · Directory Submission Kit

> 本文件汇总 SkillForge 提交技能目录（skills.sh / awesome-claude-skills）所需的全部素材与操作指引。
> 当前状态：**素材已就绪**，提交动作（提 PR / 发布 / 改 topics）需账户授权，按下方指引一步到位。

## 三动作执行状态

| 动作 | 状态 | 落点 |
|:---|:---|:---|
| ① 提交进 skills.sh 与 awesome-claude-skills | 素材就绪，待授权执行 | 本文件 |
| ② 每技能独立可引用简介 | ✅ 已完成 | [SKILLS_CATALOG.md](../SKILLS_CATALOG.md) |
| ③ 实操文章 | ✅ 已完成 | [articles/ai-prompt-management-skill-pouch.md](articles/ai-prompt-management-skill-pouch.md)、[articles/ai-daily-report-correct-pose.md](articles/ai-daily-report-correct-pose.md) |

---

## 通道 A：awesome-claude-skills（PR 制目录）

收录方式：fork 目录仓库 → 按目录格式追加条目 → 提 PR。条目文案直接摘录 [SKILLS_CATALOG.md](../SKILLS_CATALOG.md) 对应锚点（每技能一段，独立成文）。

### A1. 条目素材（英文，可直接整段摘录）

```markdown
| [SkillForge](https://github.com/windfallsheng/SkillForge) | 21 reusable agent skills (SKILL.md entry, host-agnostic) spanning reporting (daily/weekly/monthly/quarterly/annual + team collector), document beautification (Word→HTML, bilingual twin docs, one-page posters), engineering (Pandoc doc↔spec, release notes), presentations (HTML decks + editable PPTX), data prep (Excel/CSV cleaning, git heatmaps), collaboration (meeting minutes, prompt management console, decision logs) and meta-skills (skill forge + health check). Fully offline, zero external dependencies, user config isolated in user-config.md. One-line install: `npm i -g skill-forge-hub && skill-forge init`. |
```

> 若目录按单技能分行，则摘录对应锚点，如 `SKILLS_CATALOG.md#daily-report` / `#prompt-pouch` / `#one-pager`（建议先提交旗舰技能 3-5 个，再逐步扩列）。

### A2. PR 标题与描述模板

```
Title: Add SkillForge — 21-skill craft workshop (reports / docs / decks / data / collaboration)

## Summary
SkillForge is a workshop of 21 reusable agent skills, each a thin SKILL.md entry
plus stage-split resources, host-agnostic across Claude Code / Cursor / Qoder / etc.

## Highlights
- Report family: daily / weekly / monthly / quarterly / annual reports + team daily collector,
  12-industry glossary, natural-language dates, custom templates
- prompt-pouch: local HTML prompt management console ({variable} interpolation, groups,
  search, tags, JSON backup)
- one-pager: 32 layout templates × 25 themes (800 combos) one-screen HTML posters
- All offline, zero external dependencies; user config isolated (upgrades never overwrite)

## Links
- Repo: https://github.com/windfallsheng/SkillForge
- Per-skill bilingual profiles: https://github.com/windfallsheng/SkillForge/blob/main/SKILLS_CATALOG.md
```

### A3. 操作步骤（两条路任选）

**路径 1：gh CLI**（先登录，见文末「gh 登录指引」）

```bash
gh auth login                          # 一次性登录
gh repo fork ComposioHQ/awesome-claude-skills --clone
# 编辑 README 追加条目（用 A1 素材）
gh pr create --title "Add SkillForge — 21-skill craft workshop" --body-file pr-body.md
```

**路径 2：网页操作**：GitHub 打开目录仓库 → Fork → 在线编辑 README 追加条目 → Create pull request（描述贴 A2 模板）。

---

## 通道 B：skills.sh（自动索引，收录需发布）

### B1. 收录机制（probe 结论）

skills.sh 由 Vercel 运营，**无 PR 提交入口**：它索引每一个通过 open skills CLI（vercel-labs/skills）生态公开发布的技能。SkillForge 当前以 npm 包 `skill-forge-hub` + GitHub 仓库形态存在，要进 skills.sh 索引，需以 open skills 兼容形态发布技能包。

### B2. 发布步骤（⚠️ 发布动作，需拍板后执行）

```bash
# 1. 为技能补 open skills 元数据（skills.json / 每技能 frontmatter 对齐 open skills 规范）
# 2. 用 open skills CLI 发布（自动进 skills.sh 索引）
npx skills publish
# 3. 验证：skills.sh 搜索 skill-forge / daily-report 可见
```

> 受「未获用户明确指示不得发版本」纪律约束：此通道在用户明确同意发布前不执行。

---

## 通道 C：零成本加码（无授权门槛，建议随 PR 一起做）

1. **GitHub topics**（提高目录与搜索权重，网页 Settings 或 CLI 一键）：

```bash
gh repo edit windfallsheng/SkillForge   --add-topic claude-skills --add-topic agent-skills --add-topic claude-code   --add-topic cursor --add-topic ai-agents --add-topic productivity   --add-topic prompt-management --add-topic reporting
```

2. **文章分发**：将 [docs/articles/](articles/) 两篇转载到掘金 / 知乎 / 博客园，文末带仓库链接（搜索语料 + 引用锚点）。

---

## 附：gh 登录指引

```bash
gh auth login
# 交互选择：GitHub.com → HTTPS 或 SSH → Authenticate Git with your GitHub credentials
#   → Login with a web browser（推荐）→ 复制一次性 code 到浏览器完成授权
# 验证：
gh auth status
```

登录后即可执行通道 A 与通道 C 的全部命令。
