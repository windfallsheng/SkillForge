# CHANGELOG

[中文](CHANGELOG.md)

Version history of the SkillForge npm package `skill-forge-hub` (command name `skill-forge`).

## 1.3.14 (2026-11-13)

**Custom-template upgrade protection + backup rolling cap: edits never lost, snapshots never pile up**

- Six report skills (daily/weekly/monthly/quarterly/annual/meeting-minutes) now name the "📝 custom templates" section as an upgrade-protected zone in SKILL.md: edits there are never overwritten by upgrades, and official built-in template updates land as a separate user-config.upstream.md for comparison; the config-version section gains a template-preservation statement (migration touches only the yaml block, user content section kept verbatim); usage guides fixed and annotated accordingly
- prompt-pouch backup rolling cap: AI write-back backups, repair-overwrite backups and reforge-upgrade backups all roll to keep only the latest 3 .bak files and delete older ones — dense operations no longer pile up backups (the page's own backup/ double-snapshot mechanism is unchanged)
- meta-forge sync: mechanism 2 gains "user content section announcement" + static gate #16; mechanism 8 gains the "backup rolling cap" rule + gate #17; template/SKILL.md reforge section synced
- docs sync: architecture (zh/en) mechanism tables and usage-examples (zh/en) reforge flows annotated with the rolling cap

## 1.3.13 (2026-11-13)

**one-pager template dock slimmer, no auto-close on pick, × close button (@15); version self-check for prompt-pouch & meta-forge**

- one-pager template dock: width tightened from 720px to 480px (fits the content instead of spanning 80% of the screen); picking a template no longer auto-folds the panel (users may click through to compare), close via the new × round button, handle reopens; stamp one-pager@14 → @15
- prompt-pouch version self-check at all touchpoints: every invocation (generate / init / maintain / retrieve / open) silently compares the page stamp against the current template (two meta lines, zero network, no data touched); the result only affects prompting, never execution — open asks proactively (with an update-point list, rebuild keeps the original pouch-id, prompts.json untouched), maintain/retrieve ends with a one-line nudge, declined once means silent for the session
- meta-forge mechanism #8 gains "tool-type product version self-check": the clarification list adds a product-type question (tool-type vs snapshot), forging tool-type skills (fixed page reopened often, accumulating data) automatically embeds the all-touchpoint self-check + per-scenario prompting; the static gate adds a matching check, and the template's rebuild section syncs the tool-type branch

## 1.3.12 (2026-11-13)

**one-pager privilege templates get "mood response": six signature palettes now track the theme's light/dark mood (@14)**

- Fix: acid / glitch / vaporwave / inkwash / palace / landscape previously hardcoded their signature hues, so theme switching only changed the page chrome (docks / container) while the poster body stayed frozen — the reported "only the browser shell changes"
- Mood-response approach: every signature hue now uses CSS color-mix() against theme tokens — backgrounds mix var(--bg) at 22%, accents mix var(--accent) at 20%, ink text mixes var(--text) at 20%, muted text mixes var(--muted) at 25%; the signature look dominates (character preserved) while brightness/warmth subtly follow the theme (the switch is felt), covering all 25 themes with zero lookup tables
- Fade compatibility: the transient transition list across all 34 interactive-skin HTML files now also includes background — solid backgrounds (paper base, mountain layers) fade smoothly on theme switch, gradient backgrounds switch discretely per browser standard; existing color / border / shadow fades unaffected
- Template stamp one-pager@13 → @14

## 1.3.11 (2026-11-13)

**Theme-fade full coverage: 22 install guide pages get the transition, 12 templates upgrade to Material easing**

- Gap audit: skillforge-guide.html install pages (repo root + 21 identical copies under skill resources) previously switched instantly — all now carry the transient .theming fade, matching the 12 product templates
- Easing upgrade: transition curve changed from default ease to the Material Design standard cubic-bezier(.4,0,.2,1) — quick start, soft landing, crisper feel; duration stays 0.45s
- All 12 template stamps bumped again: daily/weekly/monthly/quarterly @3→4, annual/meeting-minutes @4→5, prompt-pouch @16→17, one-pager @12→13, article-to-html @3→4, commit-heatmap/team-report-collector @2→3, magic-deck @3→4
- Notes: the deck-stage cover template sets its theme statically at generation time (no interactive switching), so no transition is needed; View Transitions API deliberately not adopted — full-page snapshot crossfade suits route changes, while color transitions look cleaner for theme switching without double animation

## 1.3.10 (2026-11-13)

**one-pager theme panel stays open on color pick, closes via a new × button (@12)**

- Picking a color from the 25-swatch panel no longer auto-folds it — keep trying themes side by side; a floating circular × button sits on the panel's top-right corner to close it, and the bottom 主题 bar reopens it anytime
- Template dock keeps its original behavior (auto-close on pick, no ×): theme picking is exploratory, template picking is decisive
- Template stamp one-pager@11 → @12 (panel interaction change)

## 1.3.9 (2026-11-13)

**Theme-switch fade across twelve templates: 0.45s color transition instead of a hard flip**

- Skin mechanism upgrade: clicking the theme dock / theme panel briefly adds a transient .theming class to <html> (auto-removed after 650ms), during which background/text/border/shadow/SVG fill-stroke colors transition smoothly at 0.45s — the switch now dissolves like ink; outside that window the class is absent, so existing element animations and hover effects stay untouched
- Three guards: restoring a remembered theme on page load triggers no animation (no first-paint flicker); rapid consecutive theme clicks are debounced via timer reset; prefers-reduced-motion users get an instant switch (accessibility)
- All template stamps bumped: daily/weekly/monthly/quarterly @2→3, annual/meeting-minutes @3→4, prompt-pouch @15→16, article-to-html @2→3, commit-heatmap/team-report-collector @1→2, one-pager @10→11, magic-deck @2→3 (say "upgrade my old pages" to remelt existing artifacts)

## 1.3.8 (2026-11-13)

**Data-collection config consolidation across seven report skills (five-suite v4 / meeting-minutes v3)**

- Data source config (DATA_SOURCES / REPO) now lives only in user-config.md (upgrade-protected, never overwritten); mechanism docs (data-collection.md / content-rules.md / collect.md) get a "not a config zone" header, inline YAML examples removed, keeping only collection rules (type behaviors / git command templates / line-count filters / merge-dedup)
- daily/weekly/monthly/quarterly/annual-report CONFIG_VERSION 3→4: first run after upgrade auto-prompts "data-collection config consolidated"; existing sources preserved as-is; sources mistakenly written in mechanism docs prompt manual relocation to user-config.md
- meeting-minutes CONFIG_VERSION 2→3: source-material section gets placement note; DATA_SOURCES comments corrected to the actually supported type (file)
- commit-heatmap / release-notes: placement note added atop collect.md (no config change, version untouched)
- prompt-pouch-intro.md upgraded to illustrated edition: 10 pouch feature screenshots with ▲ interaction captions (images under docs/prompt-pouch-intro/, rendered directly on repo pages)

## 1.3.7 (2026-11-13)

**prompt-pouch fixes theme dock covering fullscreen modal buttons (@15)**

- Theme dock z-index 1001 → 40: back to page layer (below modal 50 / confirm 300 / toast 400) — fullscreen modal's bottom-right cancel/copy buttons are no longer hidden behind the color dots
- Template stamp prompt-pouch@14 → @15 (stacking-order fix)

## 1.3.6 (2026-11-13)

**prompt-pouch fullscreen fill-panel variable area shrinks, space goes to previews (@14)**

- In fullscreen the variable input area changes from flex equal-split to content-sized (flex:0 1 auto): no more mid-panel blank gap when there are few variables — the freed space is split by the top template preview and the bottom live result; with many variables it caps at 45vh with scrolling fallback
- Add-edit modal fullscreen keeps its flexible content textarea (fp-fields explicitly flex:1, unaffected by the base rule)
- Template stamp prompt-pouch@13 → @14 (fullscreen layout change)
- Note: 1.3.5 was mistakenly published due to an npm staged conflict and deprecated on the registry (content duplicated 1.3.4); version number skips to 1.3.6

## 1.3.4 (2026-11-13)

**prompt-pouch fullscreen modals + taller fill-panel previews (@13)**

- All three modals (detail / variable fill / add-edit) gain a ⛶ fullscreen button at the far right of the header: one click expands to 96vw × 96vh, click again (⤡) or close the modal to restore; detail content, fill-panel top preview and bottom live result split the remaining height via flex — both areas grow when there are few variables, shrink automatically with scrolling fallback when there are many
- Fill panel regular-size previews taller: top preview cap 110px → 220px, bottom live result textarea 96px → 150px
- Add-edit modal in fullscreen: content textarea flexibly fills the remaining space (min 40vh floor, still manually resizable)
- Template stamp prompt-pouch@12 → @13 (page interaction & layout change); SKILL.md / usage-guide.md synced (also fixed the stale "detail modal capped at 52vh" note to 56vh)

## 1.3.3 (2026-11-13)

**prompt-pouch "retrieval" task type + tuning/feedback loop (@12)**

- New "retrieval" task (check-before-use): "what in the pouch fits XX?" → AI reads prompts.json, semantically matches and lists candidates (index/title/group/match reason), applies the chosen one directly; for daily tasks (daily/weekly reports, retrospectives, emails) AI silently scans the pouch first — reuse when a template matches, otherwise finish normally and ask once whether to stash the result; SKILL.md task types 3 → 4, usage-guide gains item 11 "retrieval" plus an "active retrieval" scenario
- Tuning & feedback loop: "this one doesn't work, fix it" → read original + feedback → before/after diff → confirm and write back (updatedAt timeline visible); "this one is good" → recorded into the optional notes field (AI-maintained only); detail modal gains a read-only "📝 使用心得" (usage notes) section (hidden when absent, legacy data compatible); data-format.md schema example / field spec / maintenance rules updated in three places
- user-config.md aligned to the SkillForge standard shape: yaml fence + "⚙️ 默认配置" section + upgrade-protection intro + temporary verbal override block (keys unchanged, CONFIG_VERSION still 4)
- Template stamp prompt-pouch@11 → @12 (detail modal gains the usage-notes section, page structure change)

## 1.3.2 (2026-11-13)

**prompt-pouch in-page usage scenarios + full functional check**

- Functional check all green: 18/18 cards, zero JS errors; search/detail/delete-confirm/add/sort/theme-switch interactions verified; deleting a non-empty group triggers toast guard (confirm only for empty groups, both by design); the template page's three-tier fallback 404 probes are by design
- In-page "usage tips" sidebar card and help panel (4 → 6 blocks) now cover conversation-saving scenarios: "save the last few rounds of chat into the pouch" with two-step confirmation, delete-first-confirm with prompts.json.bak-timestamp backup before write, and "rollback/restore pouch data" archive selection
- usage-guide gains a "Typical scenarios" section: conversation capture / starting from scratch / delete & rollback / migration to a new machine
- Template stamp prompt-pouch@10 → @11 (help panel structure change)

## 1.3.1 (2026-11-12)

**Daily/weekly template sample data generalized + CSDN article visual refresh**

- Daily/weekly reference.html template samples fully generalized: all real project/component/product names removed (srf-web-* end names, MyServiceMenu/PaymentZone/ServiceMenuGrid, MoreServicesSection/StudentProfileCard, DISPATCHING state machine, product alias names, error code 43001, wsprobe probe, APK gate, WeChat/Alipay binding, viewer-side, etc.); concrete business-side names and component names replaced with generic wording (multi-side, menu/payment/grid modules, info cards, payment-channel binding, app-package version gate, viewing experience); only industry-generic technical terms (client/server/gateway, API/JWT/SSL) and quantitative data kept; DOM display and TXT copy source updated in lockstep
- CSDN promo article visual refresh: new title + six skill screenshots + two mermaid structure diagrams

## 1.3.0 (2026-11-12)

**prompt-pouch native dialogs eliminated: unified in-page confirm dialog in three modes**

- New cfMask unified dialog (confirm / alert / prompt modes) with Promise-based uiConfirm / uiAlert / uiPrompt; all 11 native window.confirm / alert / prompt calls absorbed — delete prompt/group, quick tag add, overwrite import, restore backup (corrupt notices x2 + overwrite confirm), auto-backup authorization (dual-semantics "Authorize directory" / "Not now"), change backup directory — zero native white dialogs left
- Dialog styling matches the page: reuses the .modal-mask overlay system (frosted glass + pop-in animation), adopts the five theme variables (warm gold / tech blue / IDEA dark / IDEA light / mint auto-recolor); destructive actions (delete / overwrite / restore) get a red-tinted confirm button; Esc / mask click cancel, prompt mode submits on Enter with default value prefilled
- Version stamp prompt-pouch@9 -> @10; usage-guide gains a "unified confirm dialog" entry

## 1.2.0 (2026-11-12)

**Chinese-style poster octet + collapsible dual docks + directory-visibility trio**

- one-pager gains the Chinese-style school (inkwash / red-gold palace / blue-green landscape, style-native fixed palettes by charter) plus the scenario-specific watermark memo template (follows theme tokens): 28 → 32 layout templates, seven schools × 25 color themes = 800 combos (one-pager@2 → @10); theme dock trio upgrade — dots 14 → 18px, hover shows a theme-name tooltip, the handle always displays "Theme · current name"
- one-pager template dock / theme dock collapsible: folded into capsule handles by default so they never block the poster (handles show the current template / theme name in real time); click to expand, auto-collapse after selection
- prompt-pouch sort dropdown rebuilt as a self-drawn component (the dialog adopts the five-theme variables, dropdown options rendered with the unified theme) + sort-arrow edge fix (custom arrow with proper margin)
- Directory-visibility trio: new SKILLS_CATALOG.md (per-skill bilingual standalone profiles for all 21 skills, ready to excerpt for skills.sh / awesome-claude-skills submissions and article citations); both READMEs fix the one-pager drift (8 templates × 10 themes / 80 combos → 32 templates in seven schools × 25 themes / 800 combos) + documentation navigation links the catalog / articles / submission kit; new docs/articles/ with two hands-on articles (managing prompts with AI skill packs, the right way to write daily reports with AI); new docs/directory-submission.md submission kit (awesome-claude-skills PR material & steps / skills.sh publishing guide / gh login guide)
- skillforge-guide (root page + the 21 skills' bundled txt/html copies) gains a document-entry row in the cheat sheet: SKILLS_CATALOG.md / docs/articles/ / docs/directory-submission.md

## 1.1.0 (2026-11-12)

**Harvest season: 8 new skills (13 → 21, seven categories) + built-in usage guide + theme system alignment**

- 8 new skills (seven categories take shape): team-report-collector joins Report showcase (team daily-report collector: three intake paths — verbal / file batch / page export → reports.json as the single source of truth + a single-file offline collection HTML + a date-grouped summary md); twin-docs (Chinese ↔ English twin documents) and one-pager (one-page poster: big gradient title + quote + key-point blocks + optional PNG capture) join Document mounting; release-notes joins Engineering efficiency (commits between two version tags → bilingual release notes + CHANGELOG entry + pre-publish npm self-check list); the new Data preparation category (data-prepper cleaning & structuring + commit-heatmap commit heatmaps); the new Communication & collaboration category (decision-log decision logs, with meeting-minutes and prompt-pouch moved in); skill-doctor joins Skill crafting (skill health check: static checks + three-section report with line-level locations); cli.js CATEGORIES seven-category mapping and both READMEs updated
- Built-in usage guide: every skill ships skillforge-guide txt+html dual copies in resources/; SKILL.md gains the "how do I use skillforge" overall consultation trigger; guide typical-workflow cards reorganized into scenario bullets (html four cards 20 items + txt sync); root index.html redirects to skillforge-guide.html, making the online guide reachable directly at the GitHub Pages root; both READMEs switch links to absolute addresses + package.json gains the homepage field
- Theme system alignment: team-report-collector upgrades from two themes to the five-theme system (tech/biz/mono/light/warm 12 core contracts) + tech background layer quartet + container widened to clamp(640px,60%,1200px); one-pager upgrades from three themes to five themes + background layer + key-point three-column grid filling the page width (template upgraded one-pager@2); the skin docks of the collector and the poster are pinned to the bottom-right corner (right/bottom 18px), aligned with the report family
- Upgrade-command docs completed: 43 documents across README/install/usage-examples/guide gain npm update -g skill-forge-hub (upgrade the CLI itself) alongside skill-forge update (upgrade the skills) — two-tier wording, copy-paste friendly for non-technical users
- Doc checkup fixes: README.en skill list gains the 8 missing rows; both READMEs align the annual-report wording (multi-source data, developer users can aggregate the year's git commits); stale "two themes" (collector) and "three themes" (poster) wording cleared; output-producing skills now always report output paths in conversation after saving; meta-forge-generated skills embed the SkillForge guide
## 1.0.7 (2026-11-12)

**Docs split into pure Chinese & English mirrors + meta-forge lessons fully codified**

- Docs Chinese/English split: README/docs/CHANGELOG switched from mixed bilingual to pure Chinese + pure English one-to-one mirrors (README.en.md, docs/install.en.md, docs/architecture.en.md, CHANGELOG.en.md — full translation 0.1.0→1.0.6), cross-linked at the top of every document; architecture mechanism table four → eight (CONFIG_VERSION key / user-config extraction / reference dual-track / doc-sync self-check discipline / preserve list / multi-file isolation / infringement-free, desensitized & offline / output reforge upgrades, aligned with the forge-rules numbering); both READMEs drop the outdated "config stays in SKILL.md" wording — config moves out to user-config.md; package.json files gains README.en.md and CHANGELOG.en.md
- meta-forge lessons fully codified: ① repo registration checklist gains package.json files — the 1.0.5 exam③ lesson (monthly-report/meeting-minutes/quarterly-report missing from the npm package) is now a rule, verified with `npm pack --dry-run` after registration; ② validation ring gains the self-heal double check — static gate A-14 (embedded JS validates the id meta, heals via the path key and writes back, console.warn alert) + runtime test B-5 (break the id meta → reopen heals to a valid v4 + memories recovered via the path key), so mechanism 6's page-level self-healing is now backed by validation; SKILL.md description / flow steps 4-5 / usage-guide / README both languages synced

## 1.0.6 (2026-11-12)

**meta-forge spec & template alignment: three real-world lessons codified + template modernization**

- template/ aligned with the new forge-rules spec: SKILL.md rewritten (step 0 reads user-config, config-version mechanism section, output-reforge section (conditional), doc-sync self-check section, pre-delivery self-check hard gate); new template/user-config.md (CONFIG_VERSION: 1 + protection declaration) and template/resources/usage-guide.md (usage-answer template); README drops the outdated "config must stay in SKILL.md" sentence — config now moves out
- forge-rules mechanism 3 gains the entry-animation fallback: reference.html with scroll-entry animations (IntersectionObserver + JS gating) must carry a 2s fallback setTimeout that forces everything visible — in environments where IO never fires (headless capture / print preview / PDF export / embedded webviews), cards must never stay permanently hidden (the meeting-minutes 1.0.5 blank-screenshot lesson, codified)
- forge-rules mechanism 6 gains page-level self-healing: when the id meta is invalid/missing, heal it to a standard UUID v4 via a path key (sf-heal: + pathname) and write it back to the meta, with a console.warn alert — the third line of defense at the execution layer, codified
- forge-rules mechanism 8 gains user-data specifics: deep-upgrade rebuilds must keep the page's original stable ID meta value (a new ID = data loss), data files are never touched
- validation ring expanded: static gates gain item 13 (entry-animation fallback check); runtime tests gain item 4 (headless capture proves content complete — a blank capture fails)
- meta-forge self-alignment: SKILL.md description / flow step 3 / rules summary gain the preserve list and mechanism conditions (HTML gains mechanisms 3-7-8, localStorage memory gains 6, semi-custom assets gain 5); usage-guide mechanism list aligned to the eight forge-rules numbers; user-config.md fixes the newline bug where the CONFIG_VERSION end-of-line comment swallowed the DIR line

## 1.0.5 (2026-11-12)

**monthly-report joins the forge: four-way report-family disambiguation + deck-stage monthly mapping**

- New monthly-report skill: four-section monthly report (monthly overview / key achievements / problems & improvements / next month's plan), differentiated assets — data cards with QoQ subtext (vs last month ±x%, green up red down), W1-W4 week timeline, monthly calendar heatmap (echarts calendar heatmap, CSS-variable-driven five-theme skinning); data collection supports monthly git aggregation + same-caliber last-month comparison + daily heatmap statistics; natural-language month targeting (this month / last month / last 30 days / 2026-10); isomorphic with the three report skills: 12-industry dictionary, custom templates, five-theme deep-blue panel, content-png captures
- Disambiguation upgrade: daily/weekly/annual SKILL.md cycle-ambiguity routing three-way → four-way (daily / weekly / monthly / annual)
- deck-stage linkage: report four-piece mapping gains the monthly segment (overview→overview, achievements→timeline W1-W4, problems/plan→bullets, calendar heatmap→chart-heatmap); usage-guide examples gain monthly
- CLI & docs: cli.js CATEGORIES report showcase includes monthly-report; README category row / skill table / install command synced
- Real-device: monthly reference.html headless rendering of the four section cards + calendar heatmap + skin dock all pass; content-capture height formula calibrated on real captures (~2020px at 760px width baseline + linear item scaling), fixing the old formula's underestimation truncation

**Minutes-series grouping + article save governance + ID uniqueness hardening + four exam fixes + bilingual docs**

- Minutes-series grouping: meeting-minutes gains SERIES_GROUP three-state (auto extracts series names into meetings/{series}/, series always uses series dirs, off flat months); series-name extraction rules + illegal-character dir-name cleaning + rename mechanism ("call this series XX" applies now / "always call this series XX" persists) + one-shot organizing command (scan all old minutes → move-plan confirmation → three-part report, empty month dirs kept); CONFIG_VERSION 1→2
- article-to-html save governance: captures isolated per article as 文章截图/<title-slug>/C00-cover.png (the redundant "chapter captures" layer removed, same-name articles across different docs no longer overwrite each other); DIR configurable (DIR: auto + DIR_MAC default ~/articles + DIR_WIN, nonexistent dir falls back to the user home); same-name different-article slugs append -2/-3; CONFIG_VERSION 1→2
- ID uniqueness, two hardenings: ① format locked — crypto.randomUUID() standard UUID v4 (8-4-4-4-12 lowercase hex), handwritten variants / reusing placeholders or old values forbidden; ② pre-write collision check — before writing a file, scan the save directory for this skill's html files and read their id metas, re-roll on collision. Three lines of defense: generation rules in 8 SKILL.mds + the "format self-heal block" in 9 reference.html files (invalid/missing meta heals to a valid v4 via a path key, stable reuse across opens on the same path, console.warn alert) + meta-forge forge-rules mechanism sentence & validation ring; Playwright 9/9 real-device pass
- Four exam fixes: ① quarterly-report user-config CONFIG_VERSION 1→3 (content was already v3-shaped, the version number was never bumped); ② prompt-pouch gains the sf-template@2 version stamp + the SKILL.md "output upgrade (reforge)" section (deep-upgrade rebuilds must keep the original page pouch-id — IndexedDB user data is namespaced by pouch-id, a new ID = data loss; prompts.json data files never touched); ③ package.json files gains monthly-report/meeting-minutes/quarterly-report (the npm package was missing these three skills); ④ meeting-minutes gains the 2s entry-animation fallback setTimeout (environments where IntersectionObserver never fires — headless capture / print preview — suffered permanently hidden cards; aligned with the rest of the report family) + version stamp @2→@3
- Bilingual docs rework: README rebuilt as a full bilingual mirror + new "output gallery" (6 real screenshots of skill outputs, richly illustrated); split out docs/install.md (both install methods / command reference / upgrade & config-protection mechanics in depth) + docs/architecture.md (directory layout / skill anatomy / four mechanisms / splitting conventions), all Chinese-English mirrored

## 1.0.4 (2026-11-11)

**Charts echarts-ized + data sources generalized + upgrade mechanism strengthened**

- Charts echarts-ized: the weekly/annual four chart types (monthly commit bars / daily commit bars / ring chart / heatmap) switched to CDN echarts rendering (jsdelivr 5.5.1) — five-theme linked skinning, animations stopped in shot capture mode, offline auto-degradation notice (.ech-off hint); fixed the weekly overview DOM nesting (ov-bento nine-child structure restored) and ring center text overflow
- Data sources generalized: the three reports gain a DATA_SOURCES source list (git repo aggregation / file directory / remote source, three type examples, mac/win dual fields); default templates no longer show real machine paths (~/reports, %USERPROFILE%\reports generic path templates); CONFIG_VERSION 2→3; deck-stage/prompt-pouch template values generalized too; zero real addresses left anywhere in the repo
- Upgrade mechanism strengthened: ① new .installed-manifest install list — upgrades only clean files the manifest shows the official version deleted, plus now-empty directories; user-created files are never touched (older installs without a manifest skip cleanup and get it written after upgrade); ② article-to-html embeds the .preserve list (design-system.md never overwritten, official updates saved as .upstream companions); ③ meta-forge mechanism 5 — conditional .preserve list embedding spec + validation-list item 4b
- Verified: upgrade-mechanism three-scenario real-device test, 12 assertions all pass (old-version-no-manifest upgrade / official-file-deletion precise cleanup / user-created & customized file protection)

## 1.0.3 (2026-11-11)

**Narrow-screen responsive adaptation + default chart animations**

- Narrow-screen: the three reports converge at <680px breakpoints (wrap full-width flow, tightened margins, unified 26px h1, clamp 640px floor — no more horizontal overflow); annual monthly-commit chart 12 columns flex-shrink + tip layer first/last column anchoring; weekly daily-commit chart tip long-text wrap width limit; cover page <1280px viewport proportional zoom preview (calc division length÷length type-correct; captures use headless 1280×720, unaffected)
- Default chart animations: annual monthly-commit bars gain cbGrow growth animation (aligned with weekly); weekly ring chart gains ringSweep sweep stroke (--ring-offset data-driven, animation stops exactly at the target); weekly heatmap gains hmOn staggered lighting (morning/afternoon/evening three batches)
- Verified: nine viewports (1920→390) zero overflow; cover right edge pixel-precise per viewport; animation timing sampled + mid-state captures accepted; zero pageerrors

## 1.0.2 (2026-11-11)

**Three reports scroll-entry: off-screen cards float in as they scroll into view**

- Scroll-entry: cards initially outside the viewport float up and fade in as they scroll into view (first-screen cards keep the staggered load animation; IntersectionObserver + html.js gating, always fully visible in no-JS / print / capture modes)
- translate as an independent property, not touching transform — zero conflict with hover 3D tilt; transition-delay cleared after entry so hover stays snappy; stagger 70ms capped at 280ms; 2s fallback force-show

## 1.0.1 (2026-11-11)

**Post-release triple fix: three reports mono ambience reskin + prompt-pouch four-layer tech ambience + daily/weekly noise fade-out**

- Daily/weekly/annual mono ambience reskin: stripes retained in the black theme, colors de-saturated — star dots become neutral gray-white, grid/scan-line/light-band follow --scan-dim using IDEA text-color low-opacity gray-white, body solid #1e1f22 no longer polluted by the blue ambience (previously bluish (38,45,60); after reskin the pure background recovers pixel-perfect (30,31,34), stripe rows gray-white neutral); tech/biz/light/warm ambience unchanged
- Daily/weekly mono noise layer fade-out: body::before grayscale grain hidden in mono (annual/pouch never had noise), pure background pixel-identical with annual; colored themes keep the noise
- Prompt-pouch gains four-layer tech ambience: grid/stars/scan-line/light-band from the same source as the three reports (opacity one half-step lighter so reading stays comfortable), cards gain 8px fine horizontal stripes, mono reskinned gray-white

## 1.0.0 (2026-11-11)

**1.0.0 official release**: through a dozen versions from 0.1.x to 0.5.x, nine skills + the upgrade-protection CLI + the five-theme system are all stable — officially promoted. This release closes three big changes: whole-forge exam with three fixes, CLI init/update mechanism review & repair, prompt-pouch continued forging (two-stage confirmation / full tag interactions / emoji panel / dialog enlargement / background renaming).

**Whole-forge exam, three fixes: intent routing + usage guidance + three prompt-pouch features**

- Intent routing ①: magic-deck (HTML web slides) and deck-stage (.pptx editable files) gain an "intent boundary" section — when "make a PPT" doesn't specify the form, AskUserQuestion two-way choice, no more two-skill collision; also fixed the magic-deck description's stale "sixteen themes" → "seventeen"
- Intent routing ②: daily/weekly/annual gain "0.5 cycle-ambiguity routing" — "write a summary / work summary" without a stated cycle triggers an AskUserQuestion three-way choice, never silently defaults
- Intent routing ③: spec-doc2spec / spec-spec2doc descriptions gain usage-query trigger words (asking "how to use / usage" routes to the usage-guide answer instead of missing the trigger)
- Usage guidance: article-to-html's usage instructions extracted from SKILL.md into a standalone resources/usage-guide.md ("Article Mounting Master Usage Guide"), aligned with the other 8 forge skills
- Three prompt-pouch features: ① import/export — top-bar "⤓ export" downloads a full JSON backup (timestamped), "⤒ import" picks a file for whole-library overwrite (auto-backup before import for rollback, import disabled in unauthorized directories); ② tag click filtering — clicking a card tag filters by that tag (top-bar pill shows the current tag, click ✕ or re-click the same tag to cancel, switching groups auto-clears, stacks with search); ③ group sidebar drag sorting — dragging group bars reorders the groups list (authorized directories write through immediately; unauthorized ones produce a "reorder groups to…" instruction for the AI to save)

**CLI init/update mechanism review & repair**

- Copy excludes impurities: copyDir skips .DS_Store/.git and other metadata files, no longer copied into user directories with skills
- Upgrade structure sync: new pruneDir — cleans files the official version deleted (and empty directories) before upgrade (historically grow-only stale files no longer linger); user-config.md, .preserve list files, .upstream companions, .bak- backups, node_modules dependencies are all left untouched
- Three-way [3] differentiation: [3] decide later no longer generates a .upstream companion (truly distinct from [2] keep mine); when the config content matches the official version, old .upstream companions are auto-cleaned
- deck-stage gains the "config version mechanism (upgrade protection)" section (current required version 2), aligned with the rest of the forge; the whole-repo "four themes" wording unified to five themes (including light IDEA white)
- prompt-pouch mechanism section gains an explicit "current required version is 4" declaration
- README upgrade-protection notes synced (three-way [3] semantics + new "structure sync" item)

**Prompt-pouch continued forging: batch-organize two-stage confirmation + full tag interactions + emoji quick panel**

- Batch-organize upgraded to two-stage confirmation: stage one settles entries (default AI smart tagging — each entry auto-fitted with 1-3 semantic tags, user-editable & deletable + interpolation generalization suggestions) → stage two settles groups (grouping rationale + recommended new group names); few entries (≤3) merge both stages
- Full tag interactions: card tag hover shows "✕" to delete a single tag, tags under 3 hover shows "+" to quickly add (authorized directories write through immediately, unauthorized produce instructions for the AI); closes the loop with the existing click-to-filter and edit-form tag editing
- Group dialog emoji quick panel: 95 common emoji preset grid under the icon input (9 columns scrollable, click to fill, current selection highlighted), the input keeps manual typing / pasting any character
- Group dialog enlargement: width 460→640px, emoji panel font 17→28px, larger grid spacing, taller view (96→200px multi-row), more comfortable
- mono/light body background renaming: body's three-layer composite background (top glow + grid lines + 160° gradient) becomes theme solid colors — mono solid #1e1f22, light solid #ffffff, removing the "gray-top black-bottom" gradient seam, consistent with the IDE editor area (tech/mint keep their ambience backgrounds)

## 0.5.5 (2026-11-11)

**Whole-forge theme reskin: IDEA dark + new IDEA light**

- mono "black" theme upgraded to IDEA dark (JetBrains New UI Dark official palette): editor/body #1e1f22 + panel/dialog #2b2d30 + border #3c3f41 + text #dfe1e5 + IDEA blue #3574f0, fixing the previous old Darcula palette (#2b2b2b family) mismatch with the IDE look
- New light "white" theme (IntelliJ Light official palette): white editor #ffffff + light-gray panels #f2f2f2 + border #d1d1d1 + IDEA blue #2675bf
- Coverage: prompt-pouch (4→5 themes), daily/weekly/annual (4→5), magic-deck (16→17), deck-stage (4→5); skin dock / theme arrays / doc lists all synced
- article-to-html excluded: its A-set four themes are an "accent color" system, not light/dark semantics; D terminal-geek (black) and C minimal-white (white) are already covered by style variants

## 0.5.4 (2026-11-11)

**Prompt-pouch interaction polish (SKILL.md)**

- Intent recognition & confirmation: explicit pouch-entry trigger phrases (put this passage / this conversation / this file into the pouch, etc.); vague intent ("save this") confirms first; ordinary chat never triggers file operations
- Existing page three-branch: when creating and the directory already has a page → open existing (recommended) / overwrite rebuild (old page backed up .bak, data dir untouched) / cancel
- Save confirmation: show the content to be written and wait for user confirmation before writing back ("save directly" skips); group smart matching (semantically matches existing groups and explains why)
- Interpolation generalization suggestions: on add/organize, detect generalizable concrete words, suggest turning them into {variables} (with rewrite examples and reuse effects), only change with user confirmation

## 0.5.3 (2026-11-11)

**Prompt-pouch data directory rename: cache/ → data/**

- DATA_DIR default `cache` → `data` (semantic rename: the directory holds full data, not cache; "cache" semantics reserved for future true process caches); CONFIG_VERSION v3 → v4
- Page read-side three-tier fallback: `data/prompts.json` → old default `cache/prompts.json` → root-level old flat files; write side always writes `data/`; page copy all synced
- Upgrade migration: when the AI finds a v3 old-default cache/ dir → back up, rename-migrate to data/ and inform the user (explicitly customized directory names are respected and left alone)

## 0.5.2 (2026-11-11)

**Prompt-pouch mono theme reskin to JetBrains Darcula**

- From "Linear-style pure black" to the Darcula official palette: background `#2b2b2b` / panel `#3c3f41` / card gradient `#313335` / body blue-gray `#a9b7c6` / border `#4e5254` — dark-gray base + blue-gray text + gray-scale panels, consistent with the JetBrains IDE look, easy on the eyes for long sessions
- Components fully blue-gray adapted: wand/icon filters, tags, stars, popovers, input area, card inner borders and hover borders, skin-dock color dots
- Theme names synced: "minimal black-white" → "Darcula dark gray-blue" (SKILL.md / user-config.md / usage-guide.md / skin-dock titles)

## 0.5.1 (2026-11-11)

**Self-check loop completed** (hard gates before delivery, all four skills covered)

- magic-deck: SKILL.md gains "2.5 pre-delivery self-check" (Playwright zero errors + flip through every page + first/middle/last three-page capture self-inspection); new resources/content-guide.md content adaptation manual (content temperament → layout / domain → template packs / page pacing / chart selection)
- Prompt-pouch: SKILL.md gains "2.5 pre-delivery self-check" (json machine validation + zero page errors + card count equals data count)
- deck-stage: step 5 validation strengthened into the "pre-delivery self-check" hard gate (slide XML count matches pages, no empty pages)
- template: new-skill template gains a "3.5 pre-delivery self-check" placeholder (pick check methods by skill type)

## 0.5.0 (2026-11-11)

**New**

- **deck-stage joins the forge**: reports / materials → professional .pptx stage decks — three-question interaction (materials → page skeleton table → build method), regular pages natively editable (data cards / timelines / bar charts / pie charts / line charts), cover & closing pages captured losslessly from HTML, speaker notes per page; visuals share the same source as the reports (tech/biz/mono/warm four themes)
- magic-deck "💼 domain" tab gains 21 template packs (six categories, one-click full deck generation, two-stage confirmation with undo)
- magic-deck gains resources/usage-guide.md (usage-answer source), hooked at SKILL.md step 4

**Improvements**

- Prompt-pouch time fields precise to the second (cards / detail timeline / AI copy)
- Prompt-pouch default save structure: data & backups subdirectorized (`cache/prompts.json` + `backup/` rolling backups), `DATA_DIR` / `BACKUP_DIR` configurable, old flat structure still readable
- Prompt-pouch sidebar partial scrolling (favorites + groups scroll when groups are many; "all" / new group / usage stay fixed) + wider dialog + backup-area buttons no wrap
- magic-deck template panel dialog widened; "profession" wording unified to "domain" (more general, fits six categories)
- CLI: init/update run dependency detection for skills with a package.json (prompts npm install when node_modules missing)
- README rewritten: full command reference (complete flag tables), deck-stage registered, directory layout fully updated, stale copy fixed

**Fixes**

- **npm package content omission**: 0.4.0's `files` list missed prompt-pouch (the package had no pouch), fixed and deck-stage added

## 0.4.0 (2026-11-10)

- magic-deck template runtime switching: toolbar "🎨 templates" panel five layouts click-to-apply (all pages / this page only / checked pages), titles auto-mapped, switching back to classic business restores without losing content
- Prompt-pouch time fields: createdAt / updatedAt saved and displayed
- Report skills' outward wording de-git-ified: multi-source data reworded as a paragraph / file descriptions / images / verbal additions, fitting all industries
- Prompt-pouch default save directory migrated to MyWork/prompt-pouch (html/json/backups collected in one directory)

## 0.3.0 (2026-11-09)

- magic-deck magic slide deck joins the forge (16:9 stage + playback engine + templates & themes + page-select captures + fullscreen presentation)
- meta-forge meta-smithy joins the forge (the skill that forges skills, four mechanisms self-referential)
- Three-piece mechanism backfill: CONFIG_VERSION key, reference dual-track, self-check discipline
- spec-doc2spec / spec-spec2doc fully detached from Speccore, reborn as standalone Pandoc-centric skills (detection & install guidance + AI proofreading loop), config extracted to user-config
- Three-piece professional reporting conventions (conclusion-first, risk four-ring, value translation) + HTML effect layer upgrade

## 0.2.0 (2026-11-08)

- New annual-report skill (five sections, industry-agnostic skeleton)
- Upgrade protection: user-config.md config extraction + copyDir preserve list + .preserve list
- Daily & weekly whole-page content-area captures + meteor progress-bar particle polish
- spec-doc2spec / spec-spec2doc advanced upgrade with resources volumes

## 0.1.0 (2026-11-06)

- First npm release: `skill-forge-hub` (command name `skill-forge`), zero-dependency Node>=14
- CLI: ls list / init interactive multi-select install (auto-detects common AI assistant skill directories, supports --target/--skills)
- Skills included: daily-report, weekly-report, article-to-html, spec-doc2spec, spec-spec2doc
