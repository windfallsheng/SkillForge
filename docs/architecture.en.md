# Architecture & Conventions

[中文](architecture.md)

> This document describes the repository layout, skill anatomy (thin entry + resources), the eight core mechanisms, and the splitting conventions.

## Directory Layout

```
.
├── README.md                    # intro + output gallery + categories + skill list (English: README.en.md)
├── CHANGELOG.md                 # version changelog (English: CHANGELOG.en.md)
├── docs/                        # docs (install / architecture / usage examples / output screenshots; Chinese & English one-to-one)
│   ├── install.md               # installation & upgrade in depth (English: install.en.md)
│   ├── architecture.md          # this document (English: architecture.en.md)
│   ├── usage-examples.md        # skill usage scenario examples (English: usage-examples.en.md)
│   └── images/                  # output screenshots
├── cli.js                       # installer (ls / init / update, zero-dependency Node>=14)
├── package.json                 # npm package definition (skill-forge-hub, command name skill-forge)
├── template/                    # new-skill template (thin entry + resources splitting conventions)
├── meta-forge/                  # meta skill: forges skills (eight-mechanism embedding + repo registration)
├── article-to-html/
│   ├── SKILL.md                 # document → polished HTML full flow + per-chapter screenshots (with embedded usage guide)
│   ├── design-system.md         # design system (fonts / colors / typography / chart redrawing)
│   ├── user-config.md           # ⚙️ user config (THEME etc., never overwritten on upgrade)
│   ├── .preserve                # upgrade preserve list (design-system.md is user-editable)
│   └── scripts/                 # font install / docx extraction / font inlining scripts
├── daily-report/ (weekly-report / monthly-report / quarterly-report / annual-report share the same shape)
│   ├── SKILL.md                 # thin entry: frontmatter + generation flow + rules summary
│   ├── user-config.md           # ⚙️ user config (CONFIG_VERSION + default config + custom templates)
│   └── resources/               # heavy content split by generation stage, read on demand
│       ├── usage-guide.md       # 📖 usage guide (verbatim source for usage-only answers)
│       ├── date-parsing.md      # 🗓 date parsing (natural language first)
│       ├── data-collection.md   # 📥 data collection (multi-source: verbal / text / files / images)
│       ├── content-rules.md     # ✍️ content rules (aggregation sources / text-only mode / output format / writing style)
│       ├── industry-dictionary.md # 🏭 industry adaptation (12-industry dictionary)
│       └── disk-and-html.md     # 💾 local save / HTML styles / content-png capture spec
├── magic-deck/
│   ├── SKILL.md                 # thin entry: magic deck generation flow + rules summary
│   ├── user-config.md           # ⚙️ user config
│   └── resources/
│       ├── usage-guide.md       # 📖 usage guide (features / hotkeys / capture / copy / fullscreen)
│       ├── deck-spec.md         # full spec (skeleton / theme colors / template library / hotkey table / capture implementation)
│       └── reference.html       # output skeleton (generation clones it and swaps content piece by piece)
├── deck-stage/
│   ├── SKILL.md                 # thin entry: stage-deck three-question interaction + generation flow
│   ├── user-config.md           # ⚙️ user config
│   ├── package.json             # dependency declaration (pptxgenjs)
│   └── resources/
│       ├── usage-guide.md       # 📖 usage guide
│       ├── data-schema.md       # data.json structure (paragraph → page type / section color mapping)
│       ├── pptx-builder.js      # source of truth: reads data.json, produces 16:9 pptx
│       └── cover-template.html  # cover/closing capture template
├── prompt-pouch/
│   ├── SKILL.md                 # thin entry: prompt-pouch console generation flow
│   ├── user-config.md           # ⚙️ user config (DIR/DATA_DIR/BACKUP_DIR etc.)
│   └── resources/
│       ├── usage-guide.md       # 📖 usage guide
│       ├── data-format.md       # prompts.json data format
│       └── reference.html       # output skeleton
├── spec-doc2spec/ (spec-spec2doc shares the same shape)
│   ├── SKILL.md                 # thin entry: Pandoc conversion + AI proofreading flow
│   ├── user-config.md           # ⚙️ user config
│   └── resources/               # volumes: checklist proofreading / images handling / structure organizing / pdf-path dual PDF paths / usage-guide
├── quarterly-report/            # same shape as daily-report; quarterly specifics: QoQ/YoY dual baselines / Q1-Q4 trend chart / M1-M3 monthly timeline
├── meeting-minutes/             # same shape as daily-report; minutes specifics: five sections / action-item triads / 12 meeting-type dictionaries
└── weekly-report/               # same shape as daily-report; weekly specifics: WEEK_END week end / week targeting / weekly overview card / X.XD duration (1D=8H)
```

## Skill Anatomy

- **SKILL.md keeps only**: the frontmatter, the generation-flow overview (each step names the resource it reads), the "⚙️ config & custom templates" pointer section (all user-editable config lives in user-config.md — must be read before every run), and a rules summary (3–5 hard rules).
- **resources/ is one-file-one-job**: split by generation stage, with SKILL.md flow nodes annotated `read resources/xxx.md`; each resource is self-contained and readable on its own, with no cross-references.
- **Usage-only answers**: when the user only asks how to use a skill without requesting generation, read `resources/usage-guide.md` and echo it verbatim (retitle the first heading to "<Skill> Usage Guide").
- **User config extraction**: all user-editable content lives in `user-config.md` (with `CONFIG_VERSION` on the first line), never overwritten on upgrade.

## The Eight Core Mechanisms

| Mechanism | Description |
|:---|:---|
| CONFIG_VERSION key | The first line of user-config.md declares the config-structure version; bump by 1 whenever the official structure changes (keys added / renamed / removed) and document the migration rules in the SKILL.md "config version mechanism" section. Both the CLI updater and the AI self-check this version before running: version went up → back up as `.bak-<timestamp>` → interactive three-way choice (official overwrite / keep mine + `.upstream` companion / decide later). |
| user-config extraction | User-editable content (default config + custom templates) is extracted from SKILL.md into a standalone `user-config.md`; SKILL.md keeps only the pointer section (must be read before every run). BUILTIN_PRESERVE plus the skill's `.preserve` list guard it doubly on upgrade, so local edits persist forever. Skills with user-editable content sections (custom templates etc.) must name the protected section in SKILL.md plus a template-preservation statement in the config-version section (migration touches only the yaml block, user content section kept verbatim). |
| reference dual-track | Skills that produce HTML (report family / magic deck / prompt pouch) keep a `resources/reference.html` as the visual source of truth: generation clones its skeleton and swaps content piece by piece, so output matches the official demo. Outputs carry an `sf-template` version stamp + a stable ID meta, enabling "reforge" upgrades of old outputs per the output-upgrade section. |
| doc-sync self-check discipline | After touching any file, grep the whole repo to verify keywords — zero stale terms allowed; hard gates before delivery: headless (Playwright/Chrome) open with zero JS errors + screenshot proof that content is complete; static gates (frontmatter matches the declared version). IDs are locked to the standard UUID v4 format (crypto.randomUUID()) and checked for collisions by scanning the output directory before writing. |
| .preserve list | Skills with semi-customizable assets (design systems / template drafts, files users may edit) declare them in a `.preserve` list: the CLI never overwrites these on upgrade, and official updates are saved as `.upstream` companions for manual merging. |
| multi-file isolation | Pages with localStorage memory namespace their keys by an in-page embedded unique ID (standard UUID v4) — multiple outputs never cross-talk, and memories survive renames/moves; page-level self-healing: when the id meta is invalid/missing, the page heals itself to a standard v4 via a path key and writes it back to the meta. |
| infringement-free, desensitized & offline | Zero brand fonts (free-for-commercial-use fonts only), no CDN so pages open offline, zero real identities in sample data (generic placeholders). |
| output reforge upgrades | HTML carries a template version stamp (bumped on business / data-format / page changes); after an upgrade, old outputs can be interactively reforged (shallow upgrade = block replacement; deep upgrade = md rebuild), and generation proactively scans for old versions and suggests the trigger phrase; deep rebuilds of user-data skills must keep the page's stable ID (a new ID = lost data), and data files are never touched. Repeated .bak-<timestamp> snapshots (AI write-back backups, reforge/repair page backups) roll to keep only the latest 3; one-off structure-migration archives do not roll. |

## Splitting Conventions

- **New skills follow the `template/` structure**, directory name = skill name (lowercase-hyphen), and must be registered in the README category table + cli.js CATEGORIES + package.json files.
- **Existing skills keep their own shape**: article-to-html uses a flat SKILL.md + design-system.md + scripts/ layout (its usage guide is embedded in the SKILL.md "user usage guide" section).
- **General principles**: zero external dependencies (no CDN / external links, offline double-click works), cross-platform (macOS / Windows).
- **Config upgrades**: bump CONFIG_VERSION and document migration rules; both CLI update and AI execution back up and prompt accordingly.
- **Meta skill**: for meta-forge, `resources/forge-rules.md` is the source of truth (clarification checklist / structure / eight mechanisms / validation / repo registration); the SKILL.md flow and template/ both align with it.
