---
name: mentor
description: 谋定个人投资罗盘技能：生成并维护本地单文件投资看板页面（mentor.html，夜空金七套主题 + 换肤坞 + 9 数据区块（含大盘行情：A股/港股/美股指数 + 黄金白银贵金属行情（国际惯例涨绿跌红，仅行情参考不参与网格））+ 三区配置弹框 + 持仓表单 + 方案匣 + 卡片式档位带（数字带 + SVG 价格阶梯图）+ 持仓市值占比堆叠条，区块标题与按钮为内联 SVG 图标随主题色、页面响应式适配手机端（375px 窄屏：网格单列、弹框全屏、表单两列换行、坞栏图标化）、卡片标题右侧统计徽章（数据健康三态计数/大盘指数分组数/快照涨跌家数/信号买卖计数/持仓只数/阶梯标的数）、表格隔行斑马纹）），数据契约 data/config.json（参数配置）+ data/holdings.json（持仓回填）+ data/presets.json（方案匣多套参数快照）+ outputs/signals.json（信号结果），页面表单写回 JSON、数据走本地 HTTP 服务（file:// 陷阱绕开），「刷新信号」异步后台跑 Python 计算链（页面「刷新」按钮一键触发，跑完页面自动更新；助手代跑亦可；「回测」按钮后台跑网格回测压力测试，跑完自动打开报告）（拉数 AkShare/BaoStock/集思录 + 新浪指数源 → 网格/转债/风控引擎计算 → 落 JSON，页面刷新即见）。当用户说「谋定/投资看板/投资罗盘/刷新信号/更新信号/持仓回填/打开谋定」，或询问谋定用法（谋定怎么用/谋定使用说明）时使用。
allowed-tools: Read, Write, Bash, Grep, Glob
disable-model-invocation: true
---

# 谋定（Mentor）· 个人投资罗盘

本地单文件投资看板技能，仿锦囊形态：**页面纯 HTML 双击即开**（无需 Python 环境），数据四份 JSON 本地读写，「刷新信号」= AI 助手代跑 Python 计算链。页面与数据严格分离，页面永远可从 resources/reference.html 重建。

## 四大任务（先辨场景，选对分支）

| 用户意图 | 常见说法 | 走哪支 |
|:---|:---|:---|
| 初始化 | 建看板 / 生成谋定 / 装一个投资看板 / 我要谋定页面 | 任务① |
| 维护 | 改参数 / 回填持仓 / 加个标的 / 备份 / 导出 / 导入恢复 / 这个字段什么意思 | 任务② |
| 取用 | 今天有什么操作 / 查信号 / 现在什么仓位 | 任务③ |
| 打开 | 打开谋定 / 打开看板 | 任务④ |
| 刷新 | 刷新信号 / 更新信号 / 跑一下计算 | 「刷新信号」节 |
| 问用法 | 使用说明 / 怎么用 / 能干什么 | usage-guide.md 原样输出 |

## 执行流程

**第 0 步（固定）**：读用户配置 → 先 Read 同目录 `user-config.md`（DIR/PYXIS_HOME/THEME/PORT/CONFIG_VERSION）。

**版本自检（静默前置，全时机）**：每次调用本 skill 先静默比对——读目标页面 `mentor.html` 版本戳（`<meta name="sf-template" content="mentor@N">`）与 reference.html 当前版（读 resources/reference.html 的 sf-template meta 值），零网络、不碰数据；结果只影响提示不影响执行，版本旧也绝不拒绝本次任务。提示分场景：打开场景主动问（起服务前 AskUserQuestion：A 升级后打开（推荐）——走回炉流程、沿用原页 mentor-id meta 值、数据文件一概不动；B 直接打开旧版——本次会话不再询问；附更新点 2-5 条）；维护/取用场景照常执行、收尾一句轻提示（「页面还是旧版（@N，当前 @18），说『升级谋定』即可换新」）；用户拒绝过升级则本次会话静默。

### 任务① 初始化（建看板）

1. 确认目标目录：默认 user-config 的 `DIR`；目录不存在时回退用户主目录；用户口头指定目录永远优先。
2. 生成页面：拷 `resources/reference.html` → `<DIR>/mentor.html`；用 Bash 在 `<head>` 内注入全局唯一内嵌 ID `<meta name="mentor-id" content="<UUID>">`（UUID 用 `python3 -c "import uuid;print(uuid.uuid4())"` 生成标准 v4，禁止手写；落盘前顺扫 `<DIR>/` 下 mentor 命名的 html 读 id meta 查重，撞号重掷）。
3. 建数据：`<DIR>/data/config.json`（默认参数，见 data-contract.md 4.1 默认值）、`<DIR>/data/holdings.json`（空持仓模板，positions: []）、`<DIR>/data/presets.json`（方案匣模板：active=default，内置四套预置方案——default 兜底 + 新手稳健/均衡成长/进取积极，各为完整参数快照，见 data-contract.md 4.5）；`<DIR>/outputs/`（空目录，刷新信号落盘）。
4. 起服务并打开：`python3 scripts/serve.py <DIR> <PORT>`（默认 8933，占用则顺延 8934/8935）→ 打开浏览器访问 `http://localhost:<PORT>/mentor.html`。
5. 收尾告知：页面首屏无信号时显示「尚未刷新」占位，告诉用户「对助手说『刷新信号』即可出首批信号」；并说明 file:// 直开会被浏览器拦 JSON 读取，务必走 HTTP 服务。

### 任务② 维护（改参数 / 回填持仓 / 答疑）

- **页面表单优先**：参数配置（三区弹框表单）、持仓回填（页面内表单）在页面里改，保存即 PUT 写回 data/*.json（serve.py 白名单落盘、原子写），用户刷新页面即见。助手不代劳页面能做的。
- **方案匣**：用户说「存个方案/换个方案/删除方案」→ 页面参数配置弹框「方案」页签完成（切换=用方案覆盖 config.json、另存=当前参数快照、删除=只删快照；default 兜底不可删），或口述让助手读写 `data/presets.json`（契约 data-contract.md 4.5，写回前同样备份 .bak-时间戳）。切换后提醒用户「需重新刷新信号才生效」；presets 不参与 refresh 计算链（引擎只读 config.json）。初始化自带四套预置方案（default/新手稳健/均衡成长/进取积极，定位与差异见 data-contract.md 4.5 选型表）；用户说「补预置方案/恢复内置方案」→ 助手把 4.5 的四套预置方案并入 presets.json（同名跳过不覆盖用户方案、default 兜底保证在），保留用户已有方案，写回前同样备份 .bak-时间戳；切换预置方案后提醒用户「capital 为占位值需改回实际资金、targets 需填自己的标的池，改完重新刷新信号才生效」。
- **备份/恢复**：用户说「备份/导出/导入谋定数据」→ 页面右下角「⇩」导出四份 JSON 合成一个备份文件下载、「⇧」选文件校验后逐份写回（页面内完成，助手不代劳）。自动备份：页面写回与刷新信号落盘前，旧文件自动滚动存 `<DIR>/backup/`（每文件留最近 3 份，backup/ 不对 HTTP 暴露）。
- **口述代笔**：用户口述持仓/参数调整时，助手读 data-contract.md 契约写 JSON（UTF-8、2 空格缩进）；**写回前备份** `*.json.bak-<时间戳>`（滚动上限：同目录 `.bak-*` 按时间戳排序只留最近 3 份、超出删旧）。
- **字段答疑**：读 `resources/data-contract.md` 解释字段含义与取值边界。

### 任务③ 取用（查信号）

读 `<DIR>/outputs/signals.json` 汇报：今日操作清单（signals 数组，按 priority 排序，action 语义：buy 买入/sell 卖出/paused 暂停/observe 观察/hold 持有）、风控状态（risk_gate）、组合概览（portfolio）、数据健康（health.warnings 有则醒目提示）。signals.json 不存在时告知「尚未刷新过信号，说『刷新信号』即可」。

### 任务④ 打开

`python3 scripts/serve.py <DIR> <PORT>` 起服务（端口占用顺延）→ 按平台打开浏览器（macOS `open`，Windows `start`）访问 `http://localhost:<PORT>/mentor.html`。

## 刷新信号（页面按钮异步 / 助手代跑双通道）

用户说「刷新信号/更新信号/跑一下计算」→ 优先引导用户点页面右下角「刷新」按钮：POST api/refresh 立即返回 202 后台跑，按钮变「刷新中」转圈，轮询 api/refresh-status（5s 间隔）跑完自动重载；服务未开/后端旧时按钮会友好提示。助手代跑通道（备用）：读 `resources/refresh-guide.md` → 执行 `python3 scripts/refresh.py --dir <DIR> --pyxis <PYXIS_HOME>`（PYXIS_HOME 取 user-config）→ 成功落 `outputs/signals.json` → 告知「已刷新，页面刷新即见新信号」。失败按 guide 的失败处理表逐项处理，不硬来。

## 回测（页面按钮异步 / 助手代跑双通道）

用户说「跑回测/网格回测/回测一下」→ 优先引导用户点页面右下角「回测」按钮：POST api/backtest（仅 admin）立即返回 202 后台跑，按钮变「回测中」转圈，轮询 api/backtest-status（5s 间隔）跑完自动新窗口打开报告 `outputs/backtest_report.html`（服务未开/后端旧时按钮会友好提示）。助手代跑通道（备用）：cwd=PYXIS_HOME 执行 `python3 -m pyxis.backtest --config config.yaml --html --out outputs/backtest_report.html` → 成功告知「回测完成，报告已生成，打开 outputs/backtest_report.html 即见」。历史回测 ≠ 未来收益，报告仅用于压力测试与风控认知，不构成投资建议。

## ⚙️ 配置与自定义

**执行本 skill 前必须先 Read 同目录 `user-config.md`**：`DIR`（看板落盘根目录）、`PYXIS_HOME`（计算核心仓库路径，refresh 链挂载用）、`THEME`（默认主题）、`PORT`（服务端口）都在该文件中，以它为准。升级技能时 user-config.md 不会被覆盖，你的修改永久保留。user-config.md 的「📝 自定义说明」节是升级保护区——改这里升级永不覆盖；配置版本迁移只动 yaml 块字段，「📝 自定义说明」节原样保留一字不碰。

## 配置版本机制（升级保护）

本 skill 当前配置版本为 `1`（对应 user-config.md 中的 `CONFIG_VERSION`）。执行时若发现 user-config.md 的 CONFIG_VERSION 与本节声明不一致：
1. 将旧 user-config.md 备份为 `user-config.bak-<时间戳>.md`
2. 保留用户全部自定义字段，按本节「当前版本变更记录」逐项改写旧字段
3. 更新 CONFIG_VERSION 为当前版本
4. 对话中明确告知用户「检测到配置版本从 X 升级到 Y，旧配置已备份至 <路径>」

升级本 skill 时，配置结构如有变化必须同步更新本节的当前版本号与迁移说明；禁止在未声明版本变更的情况下静默修改配置语义。无法迁移项（值域失效/语义漂移/数据不兼容）停下问不猜值，旧值永远在 .bak-时间戳，升级报告三段式（⚠️ 版本与备份路径 / ✅ 已自动迁移清单 / 🟡 无法迁移项逐条附原因+影响+建议替代），报告必附回滚一句话。

当前版本变更记录：
- v1：初始版本，无迁移。

## 产物升级（回炉）

看板生成时头部写版本戳 `<meta name="sf-template" content="mentor@18">`（模板升级时递增 @N 并同步 reference.html 与本文档）。用户说「升级谋定/回炉谋定页面」时：扫 `<DIR>` 下 mentor 生成的 html 读版本戳筛旧版（无版本戳或缺少 mentor-id meta 的产物视为 v0 最旧版，一并进清单）→ 列清单（文件/旧版本）→ AskUserQuestion 选全部或部分 → 逐份升级：浅升级（仅 CSS/JS 变化）对旧页替换 `<style>` 块与交互脚本、正文与数据契约不变；深升级（DOM 结构变化）从 reference.html 重建（先备份旧版 `.bak-<时间戳>`，滚动上限：同目录 `mentor.html.bak-*` 只留最近 3 份、超出删旧），**重建必须沿用原页 mentor-id meta 值**（换 ID = 换肤记忆失联），`<DIR>/data/`、`<DIR>/outputs/` 数据文件一概不动。版本递增判定：业务改动（区块/表单/标题体系）、数据格式改动（JSON 字段/存储结构）、页面改动（样式/布局/交互）任一发生即模板升级，版本戳 +1 并同步 reference.html 与本文档，同时在本技能 CHANGELOG.md 记一条（版本/日期/改了什么）；纯措辞润色不 bump。

## 文档同步自检纪律（维护者必读）

修改本技能任一文件（SKILL.md / user-config.md / resources/* / scripts/*）后，必须 grep 全文核对相关关键词在各文件间一致（目录名/JSON 字段名/参数名/命令参数改名时新旧词全仓核对，旧词零残留才算完成）。

## 规则速览

- 页面与数据严格分离：页面永远可从 reference.html 重建，数据文件（data/*.json、outputs/*.json）一概不动
- 方案匣只存参数快照：切换/另存/删除都走 presets.json 契约；引擎永远只读当前生效 config.json；default 兜底方案不可删；内置四套预置方案（default/新手稳健/均衡成长/进取积极），「补预置方案」并入时同名跳过、default 保证在
- 一切确定性文件操作经 serve.py / refresh.py 脚本完成，不写新脚本绕过
- 页面表单能做的（参数/持仓写回、备份导出导入）助手不代劳；口述代笔写 JSON 前先备份 .bak-时间戳（滚动上限只留最近 3 份）
- 自动备份双触发：页面 PUT 写回与 refresh 落盘前，旧文件滚动存 <DIR>/backup/（每文件只留最近 3 份）；backup/ 不出 HTTP
- 刷新信号必须走 refresh.py 全链（拉数→引擎→落盘），不跳过引擎直写 signals.json
- 数据走 HTTP 访问：file:// 直开 JSON 读取被浏览器拦截（页面有横幅提示），起服务用 serve.py
- 示例数据脱敏：页面演示数据与技能文档零真实身份（示例持仓用占位标的）

## SkillForge 使用指引（整体咨询时触发）

用户问「skillforge 怎么用 / 使用说明 / 技能怎么安装 / 怎么升级 / 装了哪些技能 / 技能清单 / skill-forge 命令怎么用」等（中英文近似均可）→ Read 同目录 `resources/skillforge-guide.txt` 全文整理回答（命令与参数以 txt 为准，勿自行编造）+ 用系统命令打开同目录 `resources/skillforge-guide.html`（macOS `open`，Windows `start`）；用户只问谋定用法（「谋定怎么用」）不触发本节，走 usage-guide.md。
