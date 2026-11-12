# 技能使用示例

[English](usage-examples.en.md)

> 从安装到日常使用的完整链路示例。挑选四个代表性技能：日报（报表族代表，覆盖配置修改与旧产物回炉）、锦囊（本地管理台，覆盖用户数据与多文件隔离）、魔法幻灯与登台（PPT 两种形态，覆盖意图分流与依赖补装）、会议纪要（汇报链源头，覆盖系列分组）。其余技能形态与这四个同构，可举一反三。

每个示例按同一节奏展开：**安装 → 首次生成 → 修改配置 → 官方升级后的操作 → 旧产物升级（回炉）**。

## 示例一：daily-report 日报（报表族代表）

1. **安装**：`skill-forge init --skills daily-report`
2. **首次生成**：直接说「写日报」，口述今天干了什么（或丢一段文字 / 一个文件 / 一张图）→ 生成 `daily-report-YYYYMMDD.md` + `.txt` + `.html`（自动打开），附整页截图 content-png
3. **修改配置**：让 AI 打开技能目录的 `user-config.md`，改 `DIR`（落盘目录）、`THEME`（tech/biz/mono/light/warm 五主题）、`TEMPLATE: custom` 换自定义模板；临时口头要求（如「今天只写 3 条」）当次生效、不写配置
4. **官方升级后**：`npm update -g skill-forge-hub`（升级 CLI 本体）→ `skill-forge update`（升级技能）→ 若官方配置结构变了，先自动备份再交互三选一，选 `[2] 保留我的`，然后对照 `user-config.upstream.md` 手动合并新配置点（如新增的 DATA_SOURCES 数据源清单）
5. **旧产物回炉**：官方模板版本戳升了（`sf-template@N`）→ 下次生成时提示「检测到 X 份旧版日报」→ 说「把我旧日报都升级成新样式」→ 选全部或部分 → 浅升级（样式变化）替换样式块、深升级（结构变化）从同目录 md 底稿重建，旧版先备份

## 示例二：prompt-pouch 锦囊（本地管理台 + 用户数据）

1. **安装**：`skill-forge init --skills prompt-pouch`
2. **首次生成**：「做一个锦囊管理页面」→ 生成锦囊管理台 html + `data/prompts.json` 数据文件
3. **日常使用**：分组侧栏 / 搜索 / 收藏 / 标签点击过滤 / `{变量}` 插值一键复制 / 导入导出 JSON 备份 / 分组 emoji 快捷面板；数据存 `data/prompts.json`、滚动备份在 `backup/`——页面与数据分离，删页面不丢数据
4. **修改配置**：`user-config.md` 改 `DIR`（页面目录）、`DATA_DIR` / `BACKUP_DIR`（数据与备份目录）
5. **官方升级后**：数据目录与数据文件一概不动；深升级重建沿用原页 pouch-id → 原有收藏 / 分组照旧读回
6. **页面版本升级（回炉）**：官方模板升级（版本戳 sf-template@N +1）后，下次「做一个锦囊管理页面」时 AI 主动提示「技能模板已升级至 vN，检测到 X 份旧版锦囊」——说「把我旧锦囊都升级成新样式」→ AI 列清单（文件 / 旧版本 / 有无用户数据）→ 选全部或部分 → 逐份升级：样式类变化替换 style 块与脚本（浅升级）、结构类变化从模板重建但沿用原页 pouch-id（深升级，收藏分组照旧读回），prompts.json 数据一概不动、旧页先备份 .bak-时间戳 → 报告三段式（✅ 已升级 / ⚠️ 手改保留 / 🟡 失败原因）；纯措辞润色不升版本戳，无需回炉
7. **多文件隔离**：两份锦囊各自独立（内嵌 ID 命名空间，互不串台）；复制文件副本 = 同一身份共享同一份数据（要独立身份请重新生成一份，勿复制文件冒充新产物）

## 示例三：magic-deck + deck-stage（PPT 两种形态）

1. **意图分流**：说「做个 PPT」时，AI 会先问形态——HTML 幻灯（magic-deck）还是 .pptx 可编辑文稿（deck-stage）
2. **magic-deck**：生成单文件 HTML 幻灯 → 浏览器打开全屏放映（自动播放 / 循环 / 热键翻页）→ 需要图片时逐页 PNG 截图
3. **deck-stage**：三问交互（素材 → 页骨架表 → 成片方式）→ 生成 .pptx：常规页原生可编辑（数据卡 / 时间线 / 图表），封面与结尾页 HTML 截图保真
4. **依赖补装**：deck-stage 依赖 PptxGenJS——npm 包不含 node_modules，装完按提示 `cd <技能目录>/deck-stage && npm install` 补装一次
5. **配置**：五主题（tech/biz/mono/light/warm）、页面尺寸、演讲备注开关等均在 `user-config.md`

## 示例四：meeting-minutes 会议纪要（汇报链源头）

1. **安装**：`skill-forge init --skills meeting-minutes`
2. **首次生成**：「记会议」→ 口述会议材料 → 五段式纪要（会议信息 / 会议结论 / 议题讨论 / 决议与行动项 / 下次会议），行动项带负责人与截止时间——这份行动项就是后续日报 / 周报 / 月报 / 季报的汇报链源头
3. **系列分组**：`SERIES_GROUP` 三态——`auto` 自动提取系列名归入 `meetings/{系列名}/`、`series` 一律按系列建目录、`off` 纯月份平铺；改口机制：「以后这个系列叫 XX」永久生效
4. **官方升级后**：同报表族——配置三选一保护 + 旧纪要回炉（说「把旧纪要升级成新样式」）

## 通用小抄

| 需求 | 做法 |
|:---|:---|
| 换落盘目录 / 主题 / 模板 | 改 `user-config.md`（升级永不覆盖） |
| 官方发新版 | 先 `npm update -g skill-forge-hub`（CLI 本体）再 `skill-forge update`，配置冲突选 `[2] 保留我的` |
| 旧产物换新样式 | 说「把我旧 XX 都升级成新样式」 |
| 装漏技能 | `skill-forge init --skills 技能名` |
| 看全部命令 | `skill-forge --help` |
