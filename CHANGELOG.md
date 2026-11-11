# CHANGELOG

SkillForge（技能锻造坊）npm 包 `skill-forge-hub`（命令名 `skill-forge`）版本变更记录。

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
