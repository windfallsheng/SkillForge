# Skill Usage Examples

[中文](usage-examples.md)

> End-to-end examples, from install to everyday use. Four representative skills are picked: daily-report (representative of the report family, covering config tweaks and output reforge), prompt-pouch (local console, covering user data and multi-file isolation), magic-deck & deck-stage (both PPT forms, covering intent routing and dependency install), meeting-minutes (source of the reporting chain, covering series grouping). The other skills share the same shape as these four — easy to generalize.

Every example follows the same rhythm: **install → first generation → config tweaks → what to do after an official upgrade → output reforge**.

## Example 1: daily-report (representative of the report family)

1. **Install**: `skill-forge init --skills daily-report`
2. **First generation**: just say "write a daily report", describe what you did today (or hand it a paragraph / a file / an image) → produces `daily-report-YYYYMMDD.md` + `.txt` + `.html` (auto-opened), plus a full-page content-png capture
3. **Config tweaks**: ask the AI to open the skill's `user-config.md` and change `DIR` (save directory), `THEME` (tech/biz/mono/light/warm five themes), `TEMPLATE: custom` for a custom template; ad-hoc verbal requests ("only 3 items today") apply once and never touch config
4. **After an official upgrade**: `npm update -g skill-forge-hub` (upgrade the CLI itself) → `skill-forge update` (upgrade the skills) → if the official config structure changed, it backs up first then offers a three-way choice; pick `[2] keep mine`, then compare `user-config.upstream.md` and merge new config points manually (e.g. a new DATA_SOURCES list)
5. **Output reforge**: when the official template stamp bumped (`sf-template@N`) → the next generation says "found X old daily reports" → say "upgrade all my old daily reports to the new style" → pick all or some → shallow upgrade (style changes) swaps style blocks, deep upgrade (structure changes) rebuilds from the sibling md draft, old version backed up first (rolling cap: keep only the latest 3)

## Example 2: prompt-pouch (local console + user data)

1. **Install**: `skill-forge init --skills prompt-pouch`
2. **First generation**: "make me a prompt management page" → produces the console html + `data/prompts.json`
3. **Everyday use**: group sidebar / search / favorites / tag click filtering / `{variable}` interpolation one-click copy / JSON import & export / group emoji quick panel; data lives in `data/prompts.json` with rolling backups in `backup/` — page and data are separated, deleting the page never loses data
4. **Config tweaks**: in `user-config.md`, change `DIR` (page directory), `DATA_DIR` / `BACKUP_DIR` (data & backup directories)
5. **After an official upgrade**: the data directory and data files are never touched; a deep rebuild keeps the page's original pouch-id → existing favorites / groups read back unchanged
6. **Page-version upgrade (reforge)**: when the official template bumps (version stamp sf-template@N +1), the next "make a prompt management page" run has the AI proactively say "skill template upgraded to vN, found X old pouches" — say "upgrade all my old pouches to the new style" → the AI lists them (file / old version / has user data) → pick all or some → upgrade one by one: style-only changes swap the style block and scripts (shallow), structural changes rebuild from the template but keep the original pouch-id (deep — favorites and groups read back unchanged); prompts.json is never touched and the old page is backed up as .bak-<timestamp> first (rolling cap: keep only the latest 3) → three-part report (✅ upgraded / ⚠️ hand-edits kept / 🟡 failure reasons); pure wording polish does not bump the stamp — no reforge needed
7. **Multi-file isolation**: two pouches stay independent (embedded-ID namespacing, no cross-talk); copying a file = same identity sharing the same data (for an independent identity, generate a new one — don't copy a file to fake a new output)

## Example 3: magic-deck + deck-stage (both PPT forms)

1. **Intent routing**: saying "make a PPT" prompts the AI to ask the form first — HTML slides (magic-deck) or an editable .pptx (deck-stage)
2. **magic-deck**: produces a single-file HTML slide deck → open in the browser for fullscreen playback (autoplay / loop / hotkey paging) → per-page PNG captures when images are needed
3. **deck-stage**: three-question interaction (materials → page skeleton table → build method) → produces a .pptx: regular pages natively editable (data cards / timelines / charts), cover & closing pages captured losslessly from HTML
4. **Dependency**: deck-stage needs PptxGenJS — the npm package excludes node_modules, so after install run `cd <skill dir>/deck-stage && npm install` once as prompted
5. **Config**: the five themes (tech/biz/mono/light/warm), page size, speaker-notes switch etc. all live in `user-config.md`

## Example 4: meeting-minutes (source of the reporting chain)

1. **Install**: `skill-forge init --skills meeting-minutes`
2. **First generation**: "take meeting minutes" → describe the meeting materials → five-section minutes (meeting info / conclusions / agenda discussion / resolutions & action items / next meeting), action items with owners and deadlines — these action items are the source of the chain that daily / weekly / monthly / quarterly reports cite
3. **Series grouping**: `SERIES_GROUP` three states — `auto` extracts series names into `meetings/{series}/`, `series` always uses series directories, `off` flat month directories; rename mechanism: "always call this series XX" persists
4. **After an official upgrade**: same as the report family — three-way config protection + minutes reforge (say "upgrade my old minutes to the new style")

## Cheat Sheet

| Need | Do |
|:---|:---|
| Change save dir / theme / template | Edit `user-config.md` (never overwritten on upgrade) |
| Official release is out | first `npm update -g skill-forge-hub` (the CLI itself), then `skill-forge update`; on config conflict pick `[2] keep mine` |
| Restyle old outputs | Say "upgrade all my old XX to the new style" |
| A skill is missing | `skill-forge init --skills <skill-name>` |
| See all commands | `skill-forge --help` |
