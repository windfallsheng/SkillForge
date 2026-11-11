# CHANGELOG

SkillForge（技能锻造坊）npm 包 `skill-forge-hub`（命令名 `skill-forge`）版本变更记录。

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
