# CHANGELOG

SkillForge（技能锻造坊）npm 包 `skill-forge-hub`（命令名 `skill-forge`）版本变更记录。

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
