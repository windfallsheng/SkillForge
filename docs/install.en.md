# Installation & Upgrade

[中文](install.md)

> This document covers both install methods, the command reference, and the config-protection mechanics applied on upgrade.

## Method 1: Global npm Install (Recommended)

```bash
npm i -g skill-forge-hub
skill-forge ls        # list all skills & descriptions (read-only)
skill-forge init      # interactive skill picker, auto-detects & installs to the AI assistant's skill directory
skill-forge update    # upgrade installed skills (config-version aware, see below)
```

Non-interactive / explicit directory:

```bash
skill-forge init --target ~/.claude/skills --skills daily-report,weekly-report
```

> **deck-stage dependency note**: deck-stage needs PptxGenJS. Installing directly from this repo copies the skill's node_modules along (works offline); the npm global package excludes node_modules, so the CLI prompts `cd <skill dir>/deck-stage && npm install` to install it once.

## Method 2: Manual Copy

Copy the skill directories into your AI assistant's skill directory (any assistant supporting the SKILL.md format works).

```bash
cp -R daily-report weekly-report monthly-report quarterly-report annual-report <your AI assistant's skill directory>/
cp -R magic-deck prompt-pouch <your AI assistant's skill directory>/
cp -R spec-doc2spec spec-spec2doc <your AI assistant's skill directory>/
```

After copying, say "write a daily report", "write a weekly report", "write a monthly report", "write a quarterly report", "write an annual report", "take meeting minutes", or hand it a document to trigger a skill; asking "how do I use daily-report / weekly-report / monthly-report / quarterly-report / meeting-minutes / deck-stage" prints the usage guide.

## Command Reference

| Command | Description |
|:---|:---|
| `skill-forge ls` | List all skills (category + name + description), read-only |
| `skill-forge init` | Interactive pick from the list: a=install all / pick by number (installed marked ★; confirm with s to skip installed and install only new ones) |
| `skill-forge update` | Upgrade all installed skills (config-version aware) |
| `skill-forge update --skills a,b` | Upgrade only the named skills (uninstalled ones are skipped with a notice) |
| `skill-forge --version` | Show version |
| `skill-forge --help` | Show full help |

Common flags (for init / update):

| Flag | Description |
|:---|:---|
| `--target <dir>` (`-t`) | Explicit skill directory; defaults to auto-detecting common assistant dirs (~/.qoder-cn, ~/.claude, ~/.cursor, ...), interactive pick when several are found |
| `--skills a,b` (`-s`) | Named skill list: init skips the picker and installs/upgrades exactly these (good for scripts); update upgrades only these |
| `--yes` (`-y`) | Skip confirmation; on config-version change defaults to "keep mine + official copy saved as .upstream" |

Command aliases: `list` = `ls`, `install` = `init`, `upgrade` = `update`.

## Upgrade & Config Protection

`skill-forge update` (all installed skills by default, or `--skills a,b`) protects your config before overwriting any skill files.

- **Always preserved**: an existing `user-config.md` in the target directory (and any files declared in the skill's `.preserve` list) is never overwritten — your local config persists forever; when the official config gains updates, a `.upstream` companion file is saved so you can merge new config points manually
- **Version aware**: when the official `user-config.md` declares a `CONFIG_VERSION` on its first line higher than your local version (config structure grew / shrank / was renamed) —
  1. your config is first backed up as `user-config.md.bak-<timestamp>`
  2. interactive three-way choice: `[1] official overwrite` (old config recoverable from the backup) / `[2] keep mine` + official copy saved as `.upstream` (default) / `[3] decide later` (no companion file generated this time)
  3. `--yes` or non-interactive environments default to `[2]`, the safest option
- **Version match**: silent upgrade — only skill files are updated, config stays untouched
- **Structure sync**: upgrades sync official file additions/removals precisely via the `.installed-manifest` — only files listed in the manifest that the official version deleted (and now-empty directories) are cleaned up, self-created user files are never touched (older installs without a manifest skip cleanup and get the manifest written after upgrade); `user-config.md`, `.preserve` list files, `.upstream` companions, `.bak-*` backups and `node_modules` dependencies are never touched

Maintainer conventions: whenever the official config structure changes (keys added / renamed / removed), bump `CONFIG_VERSION` in `user-config.md` by 1 and document the migration rules in the SKILL.md "config version mechanism" section (the AI also self-checks this version before every run).
