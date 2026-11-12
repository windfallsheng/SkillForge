# 安装与升级

[English](install.en.md)

> 本文档详述 SkillForge 的两种安装方式、命令参考，以及升级时的配置保护机制。

## 方式一：npm 全局安装（推荐）

```bash
npm i -g skill-forge-hub
skill-forge ls        # 列出全部技能与说明（只读）
skill-forge init      # 交互式挑选技能，自动探测并安装到 AI 助手技能目录
npm update -g skill-forge-hub    # 官方发新版后升级 CLI 本体（只升级本包）
skill-forge update    # 升级已安装技能（配置版本感知，见下）
```

非交互 / 指定目录场景：

```bash
skill-forge init --target ~/.claude/skills --skills daily-report,weekly-report
```

> **deck-stage 依赖说明**：deck-stage 需要 PptxGenJS。从本仓库直接 init 会连带复制技能目录内 node_modules，离线可用；npm 全局装出的包不含 node_modules，安装时会提示 `cd <技能目录>/deck-stage && npm install` 补装一次即可。

## 方式二：手动复制

将技能目录复制到你所用的 AI 助手的技能目录（支持 SKILL.md 格式、本地加载技能的助手均可）。

```bash
cp -R daily-report weekly-report monthly-report quarterly-report annual-report <你的 AI 助手技能目录>/
cp -R magic-deck prompt-pouch <你的 AI 助手技能目录>/
cp -R spec-doc2spec spec-spec2doc <你的 AI 助手技能目录>/
```

复制后直接说「写日报」「写周报」「写月报」「写季报」「写年报」「记会议」或丢给它一个文档即可触发；问「日报怎么用 / 周报怎么用 / 月报怎么用 / 季报怎么用 / 会议纪要怎么用 / 登台怎么用」输出使用说明。

## 命令参考

| 命令 | 说明 |
|:---|:---|
| `skill-forge ls` | 列出全部技能（分类 + 名称 + 说明），只读 |
| `skill-forge init` | 列清单交互挑选：a=全部安装 / 编号挑选（已装标 ★，确认时可 s 跳过已装只装新） |
| `skill-forge update` | 升级全部已安装技能（配置版本感知） |
| `skill-forge update --skills a,b` | 只升级指定技能（未安装的提示跳过） |
| `skill-forge --version` | 显示版本号 |
| `skill-forge --help` | 显示完整帮助 |

通用参数（init / update 通用）：

| 参数 | 说明 |
|:---|:---|
| `--target <目录>`（`-t`） | 指定技能目录；缺省自动探测常见助手目录（~/.qoder-cn、~/.claude、~/.cursor 等），探测到多个时交互选择 |
| `--skills a,b`（`-s`） | 指定技能名列表：init 时跳过选择直接安装/升级指定技能（适合脚本与单件补装）；update 时只升级指定技能 |
| `--yes`（`-y`） | 跳过确认直接执行；配置版本变化时默认「保留我的 + 官方版另存 .upstream 对照」 |

命令别名：`list` = `ls`、`install` = `init`、`upgrade` = `update`。

## 场景化使用流程

### 场景一：新用户首次接入（从零到可用）

```bash
npm i -g skill-forge-hub     # 1. 全局安装 CLI
skill-forge ls               # 2. 先浏览技能清单（只读，不写任何文件）
skill-forge init             # 3. 交互式挑选要装的技能
```

`skill-forge init` 的交互过程：列出全部技能（分类 + 名称 + 一句话说明）→ 输入 `a` 全装，或输入编号挑选（如 `1,3,5`，已装技能标 ★）→ 确认时输 `s` 跳过已装、只装新技能 → 自动探测 AI 助手技能目录（探测到多个时按编号选择）→ 完成安装。

装完即可直接对话触发：「写日报」「写周报」「写月报」「写季报」「写年报」「记会议」，或直接丢给它一个文档。

### 场景二：单件补装（脚本 / 只想要某一个）

```bash
skill-forge init --skills prompt-pouch --target ~/.qoder-cn/skills
```

跳过挑选环节，只装指定技能到指定目录——适合脚本化、CI 或补装单个技能。

### 场景三：官方发新版后升级

```bash
npm update -g skill-forge-hub                    # 先升级 CLI 本体（只升级本包）
skill-forge update                              # 再升级全部已装技能
skill-forge update --skills daily-report        # 只升级某一个
```

- **配置结构没变**：无感升级——技能文件更新，你的 `user-config.md` 原样保留
- **配置结构变了**（官方 `CONFIG_VERSION` 升了）：先自动备份 `user-config.md.bak-<时间戳>`，再交互三选一：
  - `[1] 官方覆盖`：换成全新官方配置（旧配置随时可从备份找回）
  - `[2] 保留我的`（默认，最安全）：你的配置不动，官方新版另存 `user-config.md.upstream` 对照文件，自己对比后按需合并新配置点
  - `[3] 稍后处理`：本次跳过，不生成对照文件
- **官方删了文件**：按 `.installed-manifest` 安装清单精准清理官方已删除的文件与空目录；你自建的文件一律不动

### 场景四：非交互 / 自动化

```bash
skill-forge init --skills daily-report,weekly-report --yes
```

`--yes` 跳过一切确认；配置版本冲突时默认走 `[2] 保留我的`（最安全分支）。

### 场景五：换机器 / 换 AI 助手

新环境重新 `npm i -g skill-forge-hub && skill-forge init` 即可；要保留个人配置，把旧机器技能目录里的 `user-config.md` 一并拷过去（升级永不覆盖，覆盖安装时也保留）。

### 常见问题

- **装完对话没触发技能**：确认装进了当前 AI 助手实际读取的技能目录（`init` 完成时输出的路径）
- **deck-stage 报缺依赖**：`cd <技能目录>/deck-stage && npm install` 补装 PptxGenJS 一次即可
- **升级后配置会丢吗**：不会。`user-config.md`（与 `.preserve` 清单内文件）升级永不覆盖，本地修改永久保留

## 升级与配置保护

`skill-forge update`（默认升级全部已装技能，可用 `--skills a,b` 指定）在覆盖技能文件前自动保护你的配置。

- **常驻保护**：目标目录已存在的 `user-config.md`（及技能 `.preserve` 清单声明的文件）永不被覆盖，你的本地配置永久保留；官方配置内容有更新时另存 `.upstream` 对照文件，可按需手动合并新配置点
- **版本感知**：官方 `user-config.md` 首行的 `CONFIG_VERSION` 高于你的本地版本（配置结构增/减/改名）时——
  1. 先把你的配置备份为 `user-config.md.bak-<时间戳>`
  2. 交互三选一：`[1] 官方覆盖`（旧配置在备份中随时找回）/ `[2] 保留我的` + 官方版另存 `.upstream` 对照（默认）/ `[3] 稍后处理`（本次不生成对照文件）
  3. `--yes` 或非交互环境默认 `[2]`，最安全
- **版本一致**：无感升级，只更新技能文件，配置原样保留
- **结构同步**：升级按 `.installed-manifest` 安装清单精准同步官方文件增删——只清理清单内官方已删除的文件与空目录，用户自建文件一律不动（旧版本安装无清单时跳过清理，升级后补写）；`user-config.md`、`.preserve` 清单文件、`.upstream` 对照、`.bak-*` 备份与 `node_modules` 依赖永远不动

技能维护者约定：官方配置结构每次变化（新增/改名/删除配置键）时，`user-config.md` 的 `CONFIG_VERSION` 递增 1，并在 SKILL.md「配置版本机制」节写明迁移规则（AI 每次执行前也会自检该版本）。
