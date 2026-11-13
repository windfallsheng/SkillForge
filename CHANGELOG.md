# CHANGELOG

[English](CHANGELOG.en.md)

SkillForge（技能锻造坊）npm 包 `skill-forge-hub`（命令名 `skill-forge`）版本变更记录。

## 1.3.12（2026-11-13）

**one-pager 特许模板「氛围响应」：六款风格固有色随主题明暗冷暖适配（@14）**

- 问题修复：acid / glitch / vaporwave / 水墨 / 宫廷 / 青绿山水六款特许模板此前硬编码风格本体色，切换主题时只有页面壳（换肤坞 / 容器）在变、海报主体纹丝不动——用户反馈「主题切换只是浏览器的壳在变化」
- 氛围响应方案：特许本色一律改为 CSS color-mix() 与主题变量按比例混合——背景色混 var(--bg) 22%、强调装饰色混 var(--accent) 20%、墨字混 var(--text) 20%、灰字混 var(--muted) 25%，本色主导（气质不丢）又随主题明暗冷暖微调（切换有感），零映射表天然覆盖全部 25 主题
- 渐变兼容：34 个交互换肤 HTML 的瞬态过渡列表统一加 background 属性——纯色背景（宣纸底 / 山峦等）切主题平滑渐变，渐变背景按浏览器标准离散切换；既有 color / border / 阴影渐变不受影响
- 版本戳 one-pager@13 → @14

## 1.3.11（2026-11-13）

**换肤渐变全覆盖：22 份安装引导页补齐过渡，12 模板缓动升级 Material 标准曲线**

- 盘点补漏：skillforge-guide.html 安装引导页（仓库根 + 21 个 skill resources 下同源副本）此前点色瞬切，本轮全部补齐瞬态 .theming 渐变机制，与 12 个产物模板同款效果
- 缓动升级：过渡曲线由默认 ease 换为 Material Design 标准缓动 cubic-bezier(.4,0,.2,1)——快启柔收，切换观感更利落专业；时长 0.45s 不变
- 12 模板版本戳再 +1：日报/周报/月报/季报 @3→4、年报/会议纪要 @4→5、锦囊 @16→17、一页纸 @12→13、文章页 @3→4、热力图/收集台 @2→3、演示稿 @3→4
- 说明：封面模板（deck-stage cover-template）主题由 AI 生成时静态写入、无交互换肤，无需过渡；未引入 View Transitions API——整页快照交叉淡化适合路由切换，换肤场景颜色过渡观感更干净，不叠加双重动画

## 1.3.10（2026-11-13）

**one-pager 主题面板点色不关闭，改由 × 按钮收起（@12）**

- 25 色面板点选主题后不再自动折叠，可连续试色对比效果；面板右上角新增 × 圆钮（悬浮于色板角上，随主题换色），点 × 收起，底部「主题」标签随时可重新展开
- 模板坞保持原交互（选中即收起，无 ×）：主题是反复试色的场合，模板是选中即定的场合
- 版本戳 one-pager@11 → @12（面板交互变化）

## 1.3.9（2026-11-13）

**十二模板主题切换渐变：换肤不再生硬闪切，全页颜色 0.45s 平滑过渡**

- 换肤机制升级：点击换肤坞/主题面板的瞬间给 <html> 挂瞬态 .theming 类（650ms 后自动摘除），期间全页背景/文字/边框/阴影/SVG 填充描边六项颜色属性以 0.45s 匀速渐变，切换如墨晕开；平时类不存在，各元素既有动画与 hover 零影响
- 细节三保障：页面加载恢复记忆主题不触发动画（首屏不闪）；快速连点换肤计时器防抖互不打架；系统「减弱动态效果」偏好自动跳过渐变（无障碍惯例）
- 版本戳全量 +1：日报/周报/月报/季报 @2→3、年报/会议纪要 @3→4、锦囊 @15→16、文章页 @2→3、热力图/收集台 @1→2、一页纸 @10→11、演示稿 @2→3（旧产物说「升级旧页面」即可回炉换新）

## 1.3.8（2026-11-13）

**报告七技能数据收集配置归位：配置落 user-config，机制文档收敛（五件套 v4 / 会议纪要 v3）**

- 数据源配置统一归位：DATA_SOURCES / REPO 等数据收集配置一律只写 user-config.md（升级保护区，永不覆盖）；机制文档（data-collection.md / content-rules.md / collect.md）顶部加「不是配置区」定位声明，内置 YAML 清单示例移除，只留收集规则（type 行为 / git 命令模板 / 行数口径 / 合并去重）
- 日报/周报/月报/季报/年报 CONFIG_VERSION 3→4：升级后首次执行自动提示「数据收集配置归位」，已填数据源原样保留；此前误写在机制文档里的数据源，提示手动搬回 user-config.md
- 会议纪要 CONFIG_VERSION 2→3：素材来源节加定位声明，DATA_SOURCES 注释按实际支持类型（file）修正
- 提交热力图 / 发版说明：collect.md 顶部补定位声明（配置无变化，版本不动）
- 种草文 prompt-pouch-intro.md 升级图文版：嵌入 10 张锦囊功能截图与 ▲ 交互说明（配图落 docs/prompt-pouch-intro/，仓库页直接渲染）

## 1.3.7（2026-11-13）

**prompt-pouch 修复全屏弹框按钮被换肤坞遮挡（@15）**

- 换肤坞 z-index 1001 → 40：归位为页面层（低于弹框 50 / 确认框 300 / 通知 400），全屏弹框右下角「取消 / 复制」按钮不再被五色圆点遮挡
- 版本戳 prompt-pouch@14 → @15（层级修复）

## 1.3.6（2026-11-13）

**prompt-pouch 填充面板全屏变量区收缩，空白让给预览区（@14）**

- 全屏态变量输入区由 flex 均分改为按内容收缩（flex:0 1 auto）：变量少时中部不再出现空白，腾出的空间由顶部模板预览与底部复制结果两区分食；变量多时限高 45vh 滚动兜底，不挤爆
- 编辑弹窗全屏内容输入框弹性吃满保持（fp-fields 显式 flex:1，不受基础规则影响）
- 版本戳 prompt-pouch@13 → @14（全屏布局调整）
- 注：1.3.5 因 npm staged 冲突误发、已在 registry 弃用（内容与 1.3.4 重复），版本号顺延至 1.3.6

## 1.3.4（2026-11-13）

**prompt-pouch 弹窗全屏 + 填充面板预览区加高（@13）**

- 三个弹窗（详情 / 变量填充 / 新增编辑）头部新增 ⛶ 全屏按钮（置于头部最右）：一键铺满 96vw × 96vh，再点 ⤡ 或关闭弹窗自动还原；详情内容区、填充面板顶部预览与底部实时结果按 flex 弹性分配剩余高度，变量少时两区都放大、变量多时自动收缩且滚动兜底
- 填充面板常规态预览区加高：顶部预览 110px → 220px 上限，底部实时结果 textarea 96px → 150px
- 编辑弹窗全屏态内容输入框弹性吃满剩余空间（min 40vh 保底，仍可手动拉伸）
- 版本戳 prompt-pouch@12 → @13（页面交互与布局变化）；SKILL.md / usage-guide.md 同步（顺手修正 usage-guide「详情弹窗限高 52vh」历史笔误为 56vh）

## 1.3.3（2026-11-13）

**prompt-pouch「取用」任务类型 + 调优/效果反馈闭环（@12）**

- 新增「取用」任务（先查后用）：说「锦囊里有什么适合 XX 的」→ AI 读 prompts.json 语义匹配列候选（序号/标题/分组/匹配理由），选定直接套用执行；日常任务（写日报/周报/复盘/邮件等）动手前先静默快扫锦囊——有模板告知并套用、无则完成后轻问是否入囊；SKILL.md 任务类型三类→四类，usage-guide 新增第 11 条取用与「主动取用」场景
- 调优与效果反馈闭环：说「这条不好用，帮我改」→ 读原文 + 反馈 → 改版对照（旧→新）→ 确认写回（updatedAt 时间线可查）；说「这条好用」→ 记入可选 notes 字段（AI 代笔专属），页面详情弹窗新增「📝 使用心得」区只读展示（无则不显示，旧数据兼容），data-format.md schema 示例/字段约定/维护规则三处同步
- user-config.md 对齐 SkillForge 规范形态：yaml 围栏 + 「⚙️ 默认配置」小节 + 顶部升级保护说明 + 底部临时口头要求引用块（键值不变，CONFIG_VERSION 仍 4）
- 版本戳 prompt-pouch@11 → @12（详情弹窗新增使用心得区，页面结构变化）

## 1.3.2（2026-11-13）

**prompt-pouch 页内使用场景三处布道 + 功能体检**

- 功能体检全绿：18/18 卡片数、零 JS 报错，搜索/详情/删除确认/新增/排序/换肤全交互验证通过；删除非空分组走 toast 保护提示（组空才弹确认框，均设计内）；模板页三级兜底探测 404 为设计内行为
- 页内「锦囊用法」侧栏说明卡与「使用帮助」面板（4 段扩 6 段）补充对话保存场景：对 AI 说「把上一轮/最近几轮对话存进锦囊」两段确认入囊、删除先确认且落盘前留 prompts.json.bak-时间戳、「回退/恢复锦囊数据」选档回滚
- usage-guide 新增「典型使用场景」章节：对话沉淀 / 从零开始 / 对话删除与回退 / 换电脑迁移
- 版本戳 prompt-pouch@10 → @11（帮助面板结构变化）

## 1.3.1（2026-11-12）

**日报/周报模板示例数据通用化 + CSDN 推广文图文改版**

- 日报/周报 reference.html 模板示例彻底通用化：清除全部真实工程名/组件名/产品专名（srf-web-user/srf-web-wx/srf-web-h5-teacher、MyServiceMenu/PaymentZone/ServiceMenuGrid、MoreServicesSection/StudentProfileCard、DISPATCHING、邻音号、萤火、43001、wsprobe、APK、微信/支付宝、观众端等），业务端名与具体组件名一律换通用表述（多端、菜单/支付/网格等模块、信息卡片、支付渠道绑定、应用安装包版本门禁、观看体验等），仅保留业界通用技术术语（客户端/服务端/网关、API/JWT/SSL 等）与量化数据；DOM 展示区与 TXT 复制源逐处同步；weekly 示例「对外称呼正名」语句顺带修通
- CSDN 推广文图文并茂改版：换标题 + 六张技能实拍截图 + 两张 mermaid 结构图

## 1.3.0（2026-11-12）

**prompt-pouch 原生弹框清零：页内统一确认弹框三形态**

- 新增 cfMask 统一确认弹框（确认 / 提示 / 输入三形态），Promise 化 uiConfirm / uiAlert / uiPrompt；11 处原生 window.confirm / alert / prompt 全部收编——删除提示词/分组、标签快捷加、覆盖导入、恢复备份（损坏提示 ×2 + 覆盖确认）、自动备份授权（「授权目录」/「暂不」双语义）、更换备份目录，浏览器原生白底弹框清零
- 弹框风格与页面同源：复用 .modal-mask 遮罩体系（毛玻璃 + 弹入动画），吃五主题变量（暖棕金 / 深蓝科技 / IDEA 黑亮 / IDEA 白亮 / 薄荷绿自动换色）；危险操作（删除/覆盖/恢复）确认键红调按钮；Esc / 遮罩点击均可取消，prompt 形态 Enter 提交、默认值回填
- 版本戳 prompt-pouch@9 → @10；usage-guide 补充「统一确认弹框」说明条目

## 1.2.0（2026-11-12）

**海报国风八式 + 双坞折叠 + 目录能见度三件套**

- one-pager 国风雅韵组三套（水墨 / 红金宫廷 / 青绿山水，风格本体固定色相特许）+ 场景专用水印公文一套（跟随主题令牌）：28 → 32 套布局模板，七组流派 × 25 套配色主题 = 800 种版式（one-pager@2 → @10）；主题坞升级三件套——色点 14 → 18px、hover 弹出主题名浮签、把手常显「主题 · 当前主题名」
- one-pager 模板坞 / 主题坞折叠展开：默认折叠成胶囊把手不遮主体（把手实时显示当前模板名 / 主题名），点把手展开、选中自动收起
- prompt-pouch 排序下拉改自绘组件（弹框吃五主题变量，下拉选项与弹框统一主题渲染）+ 排序箭头贴边修复（自定义箭头留出边距）
- 目录能见度三件套：新增 SKILLS_CATALOG.md（21 技能逐条中英双语独立简介，供 skills.sh / awesome-claude-skills 等目录收录与文章引用时整段摘录）；README 双版 one-pager 漂移修复（8 套×10 主题 80 种 → 32 套七组×25 主题 800 种）+ 文档导航挂 CATALOG / 文章 / 素材包；新增 docs/articles/ 两篇实操文章（用 AI 技能包管提示词、AI 写日报的正确姿势）；新增 docs/directory-submission.md 目录收录素材包（awesome-claude-skills PR 素材与步骤 / skills.sh 发布指引 / gh 登录指引）
- skillforge-guide（根引导页 + 21 技能内置 txt/html 双版）通用小抄补文档入口行：SKILLS_CATALOG.md / docs/articles/ / docs/directory-submission.md

## 1.1.0（2026-11-12）

**技能丰收季 8 连发：13 技能扩至 21 技能七分类 + 内置使用指引 + 主题体系对齐**

- 新增 8 个技能（七分类成型）：报表汇演补 team-report-collector（团队日报收集台：口述 / 文件批量 / 页面导出三路收日报 → reports.json 数据真相源 + 单文件离线收集台 HTML + 按日期分组汇总 md）；文档装裱补 twin-docs（中英孪生文档：术语表对齐、逐项对应、双向同步检查）与 one-pager（一页纸海报：大标题渐变 + 金句 + 要点块 + 可选 PNG 截图）；工程提效补 release-notes（版本标签间提交 → 中英双语发版说明 + CHANGELOG 条目 + npm 发布自检清单）；新设数据整备类（data-prepper 清洗结构化 + commit-heatmap 提交热力图）；新设沟通协作类（decision-log 决策日志，meeting-minutes 与 prompt-pouch 迁入）；技能自造补 skill-doctor（技能体检：静态检查 + 三段式报告行级定位）；cli.js CATEGORIES 七分类映射与 README 双版同步登记
- 内置使用指引：每个技能 resources/ 内置 skillforge-guide txt+html 双版；SKILL.md 加「skillforge 怎么用」整体咨询触发规则；guide 典型链路卡场景分条（html 四卡 20 条 + txt 同步）；根 index.html 跳转 skillforge-guide.html，GitHub Pages 根地址直达在线引导页；README 双版链接改绝对地址 + package.json 补 homepage 字段
- 主题体系对齐：team-report-collector 收集台从双主题升级五主题（tech/biz/mono/light/warm 12 核心契约）+ 科技感背景层四件套 + 容器加宽 clamp(640px,60%,1200px)；one-pager 海报从三主题升级五主题 + 背景层 + 要点块三列网格铺满版心（模板升级 one-pager@2）；收集台与海报换肤坞固定右下角（right/bottom 18px）对齐报表体系
- 升级命令文档补全：README/install/usage-examples/guide 共 43 份文档补充 npm update -g skill-forge-hub（升级 CLI 本体）与 skill-forge update（升级技能）两层口径，非技术用户照抄即可
- 文档体检修复：README.en 技能清单补齐丰收季 8 行；README 双版年报口径对齐（多源数据，开发类用户可聚合 git 全年提交）；收集台「双主题」、海报「三主题」旧表述清零；产物型技能落盘后强制对话报告产物路径；meta-forge 生成技能内置 SkillForge 指引
## 1.0.7（2026-11-12）

**文档中英分离 + meta-forge 坑教训全量入规**

- 文档中英分离：README/docs/CHANGELOG 由中英混排改为纯中文 + 纯英文一一对应（README.en.md、docs/install.en.md、docs/architecture.en.md、CHANGELOG.en.md，全量英译 0.1.0→1.0.6），每份文档顶部互相链接切换；architecture 机制表四大 → 八大（CONFIG_VERSION 钥匙 / user-config 抽离 / reference 双轨 / 自检纪律 / preserve 保护清单 / 多文件隔离 / 零侵权脱敏离线 / 产物升级回炉，与 forge-rules 编号对齐）；README 两版「配置留在 SKILL.md」旧表述改为配置出站 user-config.md；package.json files 补 README.en.md 与 CHANGELOG.en.md
- meta-forge 坑教训入规补全：①仓库登记清单补 package.json files——1.0.5 体检③教训（漏 monthly-report/meeting-minutes/quarterly-report 三技能，装包却无技能）正式入规，登记后跑 `npm pack --dry-run` 验证；②验证环补自愈块双检查——静态门禁 A-14（HTML 内嵌 JS 含 id meta 校验 + 路径键自愈回写 + console.warn 报警）+ 运行时实测 B-5（改坏 id meta → 重开自愈为合法 v4 + 记忆经路径键恢复），机制六执行层自愈从此有验证兜底；SKILL.md description/流程第 4-5 步/usage-guide/README 中英文同步

## 1.0.6（2026-11-12）

**meta-forge 规范与模板对齐：三大实战教训入规 + template 模板现代化**

- template/ 模板对齐 forge-rules 新规范：SKILL.md 重写（第 0 步读 user-config、配置版本机制节、产物升级回炉节（条件）、文档同步自检纪律节、交付自检硬门禁）；新增 template/user-config.md（CONFIG_VERSION: 1 + 保护声明）与 template/resources/usage-guide.md（咨询应答模板）；README 拆掉「配置必须留在 SKILL.md」旧句改为配置出站
- forge-rules 机制三补入场动画兜底：reference.html 含滚动入场动画（IntersectionObserver + JS 门控）必须带 2s 兜底 setTimeout 强制全显——IO 不触发的环境（headless 截图/打印预览/PDF 导出/嵌入式 webview）卡片不得永久隐藏（meeting-minutes 1.0.5 空白截图教训入规）
- forge-rules 机制六补页面执行层自愈：id meta 非法/缺失时按路径键（sf-heal: + pathname）自愈为标准 UUID v4 并回写 meta、console.warn 报警——执行层第三防线入规
- forge-rules 机制八补用户数据类细则：深升级重建必须沿用原页稳定 ID meta 值（换 ID = 数据失联），数据文件一概不动
- 验证环扩充：静态门禁加第 13 项（入场动画兜底检查）；运行时实测加第 4 项（headless 截图验证内容完整，截图空白即失败）
- meta-forge 自身对齐：SKILL.md description/流程第 3 步/规则速览补 preserve 保护清单与机制条件（含 HTML 加机制三七八、localStorage 记忆加六、半定制资产加五）；usage-guide 机制清单对齐 forge-rules 八项编号；user-config.md 修复 CONFIG_VERSION 行尾注释吞掉 DIR 行的换行 bug

## 1.0.5（2026-11-12）

**月报技能上线：monthly-report + 报表家族四选一分流 + 登台月报映射**

- 新增 monthly-report 技能：四段式月报（月度概览/本月关键成果/问题与改进/下月计划），差异化资产——数据卡环比小字（较上月 ±x%，绿涨红跌）、W1-W4 周时间线、月度日历热力图（echarts calendar heatmap，CSS 变量驱动五主题换肤）；数据收集支持 git 月度聚合 + 环比上月同口径 + 日历热力图逐日统计；自然语言月份定位（这个月/上个月/近一个月/2026-10）；与三报表同构：12 行业词典、自定义模板、五主题深蓝面板、content-png 截图
- 分流升级：日报/周报/年报 SKILL.md 周期歧义分流 三选一 → 四选一（日报/周报/月报/年报）
- 登台联动：deck-stage 报告四件套（补月报段映射：概览→overview、成果→timeline W1-W4、问题/计划→bullets、日历热力图→chart-heatmap）；usage-guide 示例补月报
- CLI 与文档：cli.js CATEGORIES 报表汇演收编 monthly-report；README 分类行/技能表/安装命令同步
- 实测：月度 reference.html headless 渲染四段卡片 + 日历热力图 + 换肤坞全通过；content 截图高度公式实测校准（760 宽基准 ~2020px + 条目增减线性外推），修正旧公式低估截断问题

**纪要系列分组 + article 落盘治理 + ID 唯一性加固 + 体检四修 + 文档双语化**

- 纪要系列分组：meeting-minutes 新增 SERIES_GROUP 三态（auto 自动提取系列名建 meetings/{系列名}/、series 一律系列目录、off 纯月份平铺）；系列名提取规则 + 目录名非法字符清洗 + 改口机制（「这个系列叫 XX」当次改 /「以后这个系列叫 XX」永久记）+ 一次性整理指令（扫全部旧纪要 → 移动计划确认 → 三段式报告，不删空月份目录）；CONFIG_VERSION 1→2
- article-to-html 落盘治理：截图按篇隔离 文章截图/<标题slug>/C00-封面.png（消掉「章节截图」冗余层，多篇同名不再互相覆盖）；DIR 配置化（DIR: auto + DIR_MAC 默认 ~/articles + DIR_WIN，目录不存在回退用户主目录）；同名不同篇 slug 追加 -2/-3 序号；CONFIG_VERSION 1→2
- ID 唯一性两条加固：①格式定死——crypto.randomUUID() 标准 UUID v4（8-4-4-4-12 十六进制小写），禁止手写变体/沿用占位与旧值；②落盘前查重——写文件前顺扫落盘目录本技能命名 html 读各 id meta，撞号重掷。三层防线：8 技能 SKILL.md 生成规则 + 9 技能 reference.html「格式自愈块」（meta 非法/缺失时按路径键自愈为合法 v4，同路径跨打开稳定复用，console.warn 显性报警）+ meta-forge forge-rules 机制句与验证环；Playwright 9/9 实测通过
- 全仓体检四修：①quarterly-report user-config CONFIG_VERSION 1→3（内容已是 v3 形态，版本号漏 bump）；②prompt-pouch 补 sf-template@2 版本戳 + SKILL.md「产物升级（回炉）」节（深升级重建必须沿用原页 pouch-id——IndexedDB 用户数据按 pouch-id 命名空间，换 ID 即数据失联，prompts.json 数据文件一概不动）；③package.json files 补 monthly-report/meeting-minutes/quarterly-report（npm 包此前缺失这三个技能）；④meeting-minutes 补 2s 入场动画兜底 setTimeout（IntersectionObserver 不触发的环境——headless 截图/打印预览——卡片永久隐藏缺陷，与其余报表族对齐）+ 版本戳 @2→@3
- 文档双语化改造：README 重构为中英双语全量对应 + 新增「产物画廊」（6 张技能成品真实截图，图文并茂）；拆分 docs/install.md（两种安装方式/命令参考/升级与配置保护机制详解）+ docs/architecture.md（目录结构/技能形态/四大机制/拆分规范），全部中英对照

## 1.0.4（2026-11-11）

**图表 echarts 化 + 数据源通用化 + 升级机制强化**

- 图表 echarts 化：周报/年报四类图表（月提交柱图/日提交柱图/环形图/热力图）改 CDN echarts 渲染（jsdelivr 5.5.1）——五主题联动换肤、shot 截图模式停动画、离线自动降级提示（.ech-off 提示文案）；修复 weekly 概览 DOM 闭合层级（ov-bento 九子结构归位）与环中心文字溢出
- 数据源通用化：三报表新增 DATA_SOURCES 数据源清单（git 仓库聚合 / file 文件目录 / remote 远程源三类型示例，mac/win 双字段），默认模板不再出现真实机器地址（~/reports、%USERPROFILE%\reports 通用路径模板）；CONFIG_VERSION 2→3；deck-stage/prompt-pouch 模板值同步通用化；全仓零真实地址残留
- 升级机制强化：①新增 .installed-manifest 安装清单——升级时只清理清单内官方已删除的文件与空目录，用户自建文件一律不动（旧版本安装无清单时跳过清理，升级后补写清单）；②article-to-html 植入 .preserve 保护清单（design-system.md 永不覆盖，官方更新另存 .upstream 对照）；③meta-forge 机制五——.preserve 清单条件植入规范 + 校验清单 4b 项
- 验证：升级机制三场景真机测试 12 项断言全过（旧版无清单升级 / 官方删文件精准清理 / 用户自建与定制文件保护）

## 1.0.3（2026-11-11）

**窄屏分辨率适配 + 图表默认动画补齐**

- 窄屏适配：三报表 <680px 断点收敛（wrap 满宽流式、边距收窄、h1 统一 26px，clamp 640px 下限不再横向溢出）；年报月提交柱图 12 列 flex 收缩 + tip 浮层首末列锚定；周报日提交柱图 tip 长文本换行限宽；封面 <1280px 视口等比缩放预览（calc 除法 length÷length 类型正确，截图走 headless 1280×720 不受影响）
- 图表默认动画：年报月提交柱图 cbGrow 生长动画（对齐周报）；周报环形图 ringSweep sweep 描边（--ring-offset 数据驱动，动画自动停到目标值）；周报热力图 hmOn 错峰点亮（上午/下午/晚上三批）
- 验证：九档视口（1920→390）溢出全清零；封面视觉右缘逐档精确贴边；动画时序采样 + 中间态截图验收；pageerror 零

## 1.0.2（2026-11-11）

**三报表滚动入场：视口外卡片滚到才上浮渐显**

- 滚动入场：初始视口外的卡片滚到视口才上浮渐显（首屏卡维持加载错峰动画；IntersectionObserver + html.js 门控，无 JS/打印/截图模式一律全显）
- translate 独立属性不碰 transform——hover 3D 偏转零冲突；入场完即清 transition-delay 不拖慢 hover；stagger 70ms 封顶 280ms；2s 兜底强制显示

## 1.0.1（2026-11-11）

**发布后三连修：三报表 mono 氛围换装 + 锦囊四层科技氛围 + 日报/周报噪点退隐**

- 日报/周报/年报 mono 氛围换装：黑色主题下条纹留存、颜色去彩——星点改中性灰白、网格/扫描线/光带随 --scan-dim 改用 IDEA 文本色低透明度灰白，body 纯色 #1e1f22 不再被蓝色氛围污染（此前泛蓝 (38,45,60)，换装后纯背景像素级恢复纯正 (30,31,34)，条纹行灰白中性）；tech/biz/light/warm 氛围照旧
- 日报/周报 mono 噪点层退隐：body::before 灰度颗粒在 mono 下 display:none（年报/锦囊本无噪点），纯背景与年报逐像素一致；有色主题噪点照旧保留
- 锦囊披四层科技氛围：网格/星点/扫描线/光带与三报表同源（透明度淡半档不扰读），卡片加 8px 细横纹，mono 换装灰白

## 1.0.0（2026-11-11）

**1.0.0 正式版**：历经 0.1.x—0.5.x 十余版锤炼，九技能 + 升级保护 CLI + 五主题体系均已稳定，正式转正。本版收口三项大改：全坊体检三修、CLI init/update 机制审查修复、锦囊续锻（两段确认/标签全交互/emoji 面板/弹框放大/背景正名）。

**全坊体检三修：意图分流 + 使用指导 + 锦囊三功能**

- 意图分流①：magic-deck（HTML 网页幻灯）与 deck-stage（.pptx 可编辑文件）加「意图边界」节——「做 PPT」未言明形态时 AskUserQuestion 二选一，不再两个 skill 撞车；顺带修正 magic-deck description 遗留「十六套主题」→「十七套」
- 意图分流②：日报/周报/年报加「0.5 周期歧义分流」——「写总结/工作总结」未言明周期时 AskUserQuestion 三选一，不擅自默认
- 意图分流③：spec-doc2spec / spec-spec2doc 的 description 补用法咨询触发词（问「怎么用/使用说明」时走 usage-guide 应答，不再漏触发）
- 使用指导：article-to-html 的使用说明从 SKILL.md 抽出为独立 resources/usage-guide.md（「文章装裱师使用指南」），与工坊其余 8 个技能对齐
- 锦囊三功能：①导入/导出——顶栏「⤓ 导出」下载全量 JSON 备份（带时间戳）、「⤒ 导入」选择文件整库覆盖（导入前自动备份可回滚，未授权目录禁用导入）；②标签点击过滤——点卡片标签即按标签筛选（顶栏胶囊显示当前标签、点 ✕ 或再点同标签取消、切分组自动清除，与搜索叠加）；③分组侧栏拖拽排序——分组条拖拽重排 groups 顺序（授权目录即写即存，未授权生成「分组顺序调整为…」指令给 AI 落盘）

**CLI init/update 机制审查修复**

- 复制排除杂质：copyDir 跳过 .DS_Store/.git 等元数据文件，不再随技能复制进用户目录
- 升级结构同步：新增 pruneDir——升级前清理官方已删除的文件与空目录（历史只增不删的废弃文件不再残留）；user-config.md、.preserve 清单文件、.upstream 对照、.bak- 备份、node_modules 依赖一律不动
- 三选一 [3] 差异化：[3] 稍后处理不再生成 .upstream 对照文件（与 [2] 保留我的真正区分开）；配置内容与官方一致时自动清理旧 .upstream 对照
- deck-stage 补「配置版本机制（升级保护）」节（当前要求版本 2），与工坊其余技能对齐；全目录「四主题」表述同步为五主题（含 light IDEA 白亮）
- prompt-pouch 机制节补显式「当前要求版本为 4」声明
- README 升级保护说明同步（三选一 [3] 语义 + 新增「结构同步」条目）

**锦囊续锻：批量整理两段确认 + 标签全交互 + emoji 快捷面板**

- 批量整理升级两段确认：第一段定条目（默认 AI 智能打标——每条自动配 1-3 个语义标签，用户可改可删 + 插值泛化建议）→ 第二段定分组（归组理由 + 新组推荐名）；条目少（≤3 条）两段合一
- 标签全交互：卡片标签悬停出「✕」点删单个标签、标签不满 3 个悬停出「＋」快速加标签（授权目录即写即存，未授权生成指令交 AI）；与既有点击过滤、编辑表单改标签组成闭环
- 分组弹窗 emoji 快捷面板：图标输入框下方预置 95 个常用 emoji 网格（9 列可滚动，点击即填入、当前选中高亮），输入框保留手输/粘贴任意字符
- 分组弹框放大：弹框宽度 460→640px，emoji 面板字号 17→28px、格子间距加大、可视区加高（96→200px 多行展示），观感更舒展
- mono/light 主体背景正名：body 三层合成背景（顶部光晕 + 网格线 + 160° 渐变）改为主题纯色——mono 纯 #1e1f22、light 纯 #ffffff，消除「上灰下黑」渐变断层，与 IDE 编辑区观感一致（tech/mint 保留原氛围背景）

## 0.5.5（2026-11-11）

**全坊主题换装 IDEA 黑亮 + 新增 IDEA 白亮**

- mono「黑」主题升级为 IDEA 黑亮（JetBrains New UI Dark 官方色系）：编辑区/主体 #1e1f22 + 面板/弹框 #2b2d30 + 描边 #3c3f41 + 文字 #dfe1e5 + IDEA 蓝 #3574f0，修正上一版老 Darcula 色板（#2b2b2b 系）与 IDE 观感不符的问题
- 新增 light「白」主题（IntelliJ Light 官方色系）：白编辑区 #ffffff + 浅灰面板 #f2f2f2 + 描边 #d1d1d1 + IDEA 蓝 #2675bf
- 覆盖范围：锦囊（四主题→五主题）、日报/周报/年报（四主题→五主题）、magic-deck（十六主题→十七主题）、deck-stage（四主题→五主题），换肤坞/主题数组/文档清单全同步
- article-to-html 不参与：A 款四主题是「主色调 accent」体系非明暗语义，D 终端极客（黑）与 C 极简白（白）已由风格款覆盖

## 0.5.4（2026-11-11）

**锦囊交互完善（SKILL.md）**

- 意图识别与确认：明确入囊触发短语（把这段话/这段对话/这个文件加进锦囊等）；模糊意图（「保存这个」）先确认再执行；普通对话不触发文件操作
- 已有页面三分支：创建时目录已有页面 → 打开现有（推荐）/ 覆盖重建（旧页面 .bak 备份，数据目录不动）/ 取消
- 落盘确认：写回前展示待写入内容等用户确认（「直接存」则跳过）；分组智能匹配（语义匹配现有分组并说明理由）
- 插值泛化建议：新增/整理时识别可泛化具体词，建议改 {变量}（附改写示例与复用效果），用户确认才改

## 0.5.3（2026-11-11）

**锦囊数据目录正名：cache/ → data/**

- DATA_DIR 默认值 `cache` → `data`（语义正名：目录放的是全量数据不是缓存，缓存语义留给将来真正的过程性缓存）；CONFIG_VERSION v3 → v4
- 页面读侧三级兜底：`data/prompts.json` → 旧默认 `cache/prompts.json` → 根目录旧平铺文件；写侧一律写 `data/`；页面文案全部同步
- 升级迁移：AI 发现 v3 旧默认 cache/ 目录 → 备份后改名迁移为 data/ 并告知用户（用户显式自定义目录名则尊重不动）

## 0.5.2（2026-11-11）

**锦囊 mono 主题换装 JetBrains Darcula**

- 从「Linear 式纯黑」改为 Darcula 官方色板：背景 `#2b2b2b` / 面板 `#3c3f41` / 卡片渐变 `#313335` / 正文蓝灰 `#a9b7c6` / 边框 `#4e5254`——深灰底 + 蓝灰字 + 灰阶面板，与 JetBrains IDE 观感一致，久看不累
- 组件适配全面蓝灰化：魔法棒/图标滤镜、标签、星标、弹层、输入区、卡片内描边与 hover 描边、换肤坞色点
- 主题名同步：「极简黑白」→「Darcula 深灰蓝」（SKILL.md / user-config.md / usage-guide.md / 换肤坞 title）

## 0.5.1（2026-11-11）

**自检闭环补全**（交付前硬门禁，四技能全覆盖）

- magic-deck：SKILL.md 加「2.5 交付前自检」（Playwright 零报错 + 逐页翻完 + 首中末三页截图自查），新增 `resources/content-guide.md` 内容适配手册（内容气质→版式 / 领域→成套模板 / 页数节奏 / 图表选型）
- 锦囊：SKILL.md 加「2.5 交付前自检」（json 机器校验 + 页面零报错 + 卡片数等于数据条数）
- deck-stage：步骤 5 校验强化为「交付前自检」硬门禁（slide XML 数量与 pages 一致、每页非空）
- template：新技能模板加「3.5 交付前自检」占位（按技能类型选自检手段）

## 0.5.0（2026-11-11）

**新增**

- **deck-stage 入坊**：报告 / 素材转专业 .pptx 登台文稿——三问交互（素材 → 页骨架表 → 成片方式），常规页原生可编辑（数据卡/时间线/柱图/饼图/折线），封面与结尾页 HTML 截图保真，每页可带演讲备注；视觉与报表同源（tech/biz/mono/warm 四主题）
- magic-deck「💼 领域」Tab 二十一套成套模板（六分类，一键生成整套页面，两段确认可撤销）
- magic-deck 新增 `resources/usage-guide.md`（使用咨询应答源），SKILL.md 步骤 4 挂接

**改进**

- 锦囊时间字段精确到时分秒（卡片 / 详情时间线 / AI 文案）
- 锦囊默认落盘结构调整：数据与备份子目录化（`cache/prompts.json` + `backup/` 滚动备份），`DATA_DIR` / `BACKUP_DIR` 可配置，旧平铺结构兼容读取
- 锦囊侧栏局部滚动（分组多时收藏+分组区滚动，「全部」/新建分组/用法固定）+ 弹框加宽 + 备份区按钮不换行
- magic-deck 模板面板弹框加宽；「职业」文案统一改「领域」（更通用，适配六分类）
- CLI：init/update 对带 package.json 的技能做依赖检测（缺 node_modules 时提示 npm install）
- README 重写：补命令参考（完整参数表）、deck-stage 登记、目录结构全量更新、过时文案修正

**修复**

- **npm 包内容遗漏**：0.4.0 的 `files` 清单漏了 prompt-pouch（包内没有锦囊），已补上并加 deck-stage

## 0.4.0（2026-11-10）

- magic-deck 模板运行时切换：工具栏「🎨 模板」面板五套版式即点即换（全部页/仅本页/勾选页），标题自动映射，切回经典商务复原不丢内容
- 锦囊提示词时间字段：createdAt / updatedAt 落盘与展示
- 报表技能对外表述去 git 化：多源数据口径改为一段文字 / 文件里的描述 / 图片 / 口头补充，适配各行业
- 锦囊默认落盘目录迁移至 MyWork/prompt-pouch（html/json/备份同目录归集）

## 0.3.0（2026-11-09）

- magic-deck 魔法幻灯入坊（16:9 舞台 + 播放引擎 + 模板主题 + 选页截图 + 全屏放映）
- meta-forge 元锻炉入坊（造 skill 的 skill，四大机制自指）
- 三件套机制回填：CONFIG_VERSION 钥匙、reference 双轨、自检纪律
- spec-doc2spec / spec-spec2doc 彻底脱离 Speccore，改为以 Pandoc 为核心依赖的独立技能（探测安装引导 + AI 校对闭环），配置抽离 user-config
- 三件套专业汇报规范（结论先行、风险四环、价值翻译）+ HTML 效果层升级

## 0.2.0（2026-11-08）

- 新增 annual-report 年度总结技能（五段式，行业无关骨架）
- 升级保护机制：user-config.md 配置抽离 + copyDir 保留名单 + .preserve 清单
- 日报周报整页内容区截图 + 流星进度条粒子流打磨
- spec-doc2spec / spec-spec2doc 高阶升级带 resources 分册

## 0.1.0（2026-11-06）

- 首个 npm 版本：`skill-forge-hub`（命令名 `skill-forge`），零依赖 Node>=14
- CLI：ls 列表 / init 交互多选安装（自动探测常见 AI 助手技能目录，支持 --target/--skills）
- 收录技能：daily-report、weekly-report、article-to-html、spec-doc2spec、spec-spec2doc
