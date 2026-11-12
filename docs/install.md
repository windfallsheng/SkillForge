# 安装与升级 · Installation & Upgrade

> 本文档详述 SkillForge 的两种安装方式、命令参考，以及升级时的配置保护机制。This document covers both install methods, the command reference, and the config-protection mechanics applied on upgrade.

## 方式一：npm 全局安装（推荐） · Method 1: Global npm Install (Recommended)

```bash
npm i -g skill-forge-hub
skill-forge ls        # 列出全部技能与说明（只读）· list all skills (read-only)
skill-forge init      # 交互式挑选技能，自动探测并安装到 AI 助手技能目录 · pick skills interactively
skill-forge update    # 升级已安装技能（配置版本感知，见下）· upgrade installed skills (config-version aware)
```

非交互 / 指定目录场景 · Non-interactive or explicit directory:

```bash
skill-forge init --target ~/.claude/skills --skills daily-report,weekly-report
```

> **deck-stage 依赖说明**：deck-stage 需要 PptxGenJS。从本仓库直接 init 会连带复制技能目录内 node_modules，离线可用；npm 全局装出的包不含 node_modules，安装时会提示 `cd <技能目录>/deck-stage && npm install` 补装一次即可。
>
> **deck-stage dependency note**: deck-stage needs PptxGenJS. Installing directly from this repo copies the skill's node_modules along (works offline); the npm global package excludes node_modules, so the CLI prompts `cd <skill dir>/deck-stage && npm install` to install it once.

## 方式二：手动复制 · Method 2: Manual Copy

将技能目录复制到你所用的 AI 助手的技能目录（支持 SKILL.md 格式、本地加载技能的助手均可）。Copy the skill directories into your AI assistant's skill directory (any assistant supporting the SKILL.md format works).

```bash
cp -R daily-report weekly-report monthly-report quarterly-report annual-report <你的 AI 助手技能目录>/
cp -R magic-deck prompt-pouch <你的 AI 助手技能目录>/
cp -R spec-doc2spec spec-spec2doc <你的 AI 助手技能目录>/
```

复制后直接说「写日报」「写周报」「写月报」「写季报」「写年报」「记会议」或丢给它一个文档即可触发；问「日报怎么用 / 周报怎么用 / 月报怎么用 / 季报怎么用 / 会议纪要怎么用 / 登台怎么用」输出使用说明。

After copying, say "写日报" (write a daily report), "记会议" (take minutes), or hand it a document to trigger a skill; asking "how to use X" prints the usage guide.

## 命令参考 · Command Reference

| 命令 Command | 说明 Description |
|:---|:---|
| `skill-forge ls` | 列出全部技能（分类 + 名称 + 说明），只读 · List all skills (category + name + description), read-only |
| `skill-forge init` | 列清单交互挑选：a=全部安装 / 编号挑选（已装标 ★，确认时可 s 跳过已装只装新）· Interactive pick: a=all / numbered (installed marked ★; confirm with s to skip installed) |
| `skill-forge update` | 升级全部已安装技能（配置版本感知）· Upgrade all installed skills (config-version aware) |
| `skill-forge update --skills a,b` | 只升级指定技能（未安装的提示跳过）· Upgrade only the named skills (uninstalled ones are skipped with a notice) |
| `skill-forge --version` | 显示版本号 · Show version |
| `skill-forge --help` | 显示完整帮助 · Show full help |

通用参数（init / update 通用）· Common flags (for init / update):

| 参数 Flag | 说明 Description |
|:---|:---|
| `--target <目录>`（`-t`） | 指定技能目录；缺省自动探测常见助手目录（~/.qoder-cn、~/.claude、~/.cursor 等），探测到多个时交互选择 · Explicit skill directory; defaults to auto-detecting common assistant dirs (~/.qoder-cn, ~/.claude, ~/.cursor, ...), interactive pick when several are found |
| `--skills a,b`（`-s`） | 指定技能名列表：init 时跳过选择直接安装/升级指定技能（适合脚本与单件补装）；update 时只升级指定技能 · Named skill list: init skips the picker and installs/upgrades exactly these (good for scripts); update upgrades only these |
| `--yes`（`-y`） | 跳过确认直接执行；配置版本变化时默认「保留我的 + 官方版另存 .upstream 对照」· Skip confirmation; on config-version change defaults to "keep mine + official copy saved as .upstream" |

命令别名：`list` = `ls`、`install` = `init`、`upgrade` = `update`。Command aliases: `list` = `ls`, `install` = `init`, `upgrade` = `update`.

## 升级与配置保护 · Upgrade & Config Protection

`skill-forge update`（默认升级全部已装技能，可用 `--skills a,b` 指定）在覆盖技能文件前自动保护你的配置。`skill-forge update` (all installed skills by default, or `--skills a,b`) protects your config before overwriting any skill files.

- **常驻保护 · Always preserved**：目标目录已存在的 `user-config.md`（及技能 `.preserve` 清单声明的文件）永不被覆盖，你的本地配置永久保留；官方配置内容有更新时另存 `.upstream` 对照文件，可按需手动合并新配置点
- **版本感知 · Version aware**：官方 `user-config.md` 首行的 `CONFIG_VERSION` 高于你的本地版本（配置结构增/减/改名）时——
  1. 先把你的配置备份为 `user-config.md.bak-<时间戳>`
  2. 交互三选一：`[1] 官方覆盖`（旧配置在备份中随时找回）/ `[2] 保留我的` + 官方版另存 `.upstream` 对照（默认）/ `[3] 稍后处理`（本次不生成对照文件）
  3. `--yes` 或非交互环境默认 `[2]`，最安全
- **版本一致 · Version match**：无感升级，只更新技能文件，配置原样保留
- **结构同步 · Structure sync**：升级按 `.installed-manifest` 安装清单精准同步官方文件增删——只清理清单内官方已删除的文件与空目录，用户自建文件一律不动（旧版本安装无清单时跳过清理，升级后补写）；`user-config.md`、`.preserve` 清单文件、`.upstream` 对照、`.bak-*` 备份与 `node_modules` 依赖永远不动

技能维护者约定 · Maintainer conventions：官方配置结构每次变化（新增/改名/删除配置键）时，`user-config.md` 的 `CONFIG_VERSION` 递增 1，并在 SKILL.md「配置版本机制」节写明迁移规则（AI 每次执行前也会自检该版本）。Whenever the official config structure changes (keys added / renamed / removed), bump `CONFIG_VERSION` in `user-config.md` by 1 and document the migration rules in the SKILL.md "配置版本机制" section (the AI self-checks this version before every run).
