---
name: prompt-pouch
description: >
  锦囊（prompt-pouch）提示词管理 Skill：生成并维护一个本地 HTML 提示词管理页面（锦囊管理台），
  深棕金配色，功能为分组侧栏（带计数徽章）+ 搜索 + 卡片网格 + 四种排序（最新添加默认/最近使用/使用频率/手动，
  拖拽与 ▲▼ 自动切手动）+ 使用统计 + 收藏星标 + {变量} 插值填充面板 + 一键复制 + 卡片「👁 详情」弹窗
  （全文滚动查看 / 复制 / 修改 / 创建修改时间线）；数据存同目录 prompts.json，
  页面与数据严格分离，双笔协作（页面经授权目录直写，AI 代笔维护）。三类任务：①初始化——目标目录无页面时确认目录（默认用户配置 DIR）
  并生成 prompt-pouch.html（样式真相源为 resources/reference.html，原样复制）与 prompts.json
  （默认示例四组：写作/编程/复盘/演讲，每条带 createdAt）；②维护——按用户口述增删改提示词与分组、调整排序、
  切换收藏，读写 prompts.json（UTF-8、2 空格缩进），用户刷新页面即见；③打开——用户说「打开锦囊」时
  起本地服务并按平台打开浏览器访问管理页面。
  数据通过 HTTP 方式访问（file:// 直开会回退浏览器缓存快照，需提示用户起本地服务）。
  当用户问「锦囊怎么用/使用说明」时输出 resources/usage-guide.md 内容，不执行任何文件操作。
allowed-tools: ["Bash", "Read", "Write", "Edit"]
disable-model-invocation: false
---

# 锦囊 · 提示词管理台（prompt-pouch）

妙计入囊、随取随用：一个纯 HTML 的本地提示词管理台，页面与数据分离——双笔协作：页面可直写、AI 可代笔，用户只管说，刷新即见。

## 执行流程

0. **读用户配置**（DIR/DIR_WIN/PORT/INIT_DATA/CONFIRM/CONFIG_VERSION）→ 先 Read 同目录 `user-config.md`
1. **初始化**（目标目录无 `prompt-pouch.html` 时）：
   - **目录确认**：用户未提目录 → 用配置 `DIR`；`CONFIRM: true` 时先 AskUserQuestion 确认（选项：用默认目录 / 换目录）；用户已说「放到 XX 目录」→ 直接用该目录（本次会话有效，不改配置文件）
   - 复制 `resources/reference.html` → `<DIR>/prompt-pouch.html`（原样复制，不修改任何样式与脚本）
   - 生成 `<DIR>/prompts.json`：`INIT_DATA: example` 时写入示例四组（写作/编程/复盘/演讲，每组 3-4 条带 {变量} 示例，**每条必带 createdAt 当天日期**）；`empty` 时写空结构（version + 空 groups/prompts）
   - 收尾提示启动方式：`cd <DIR> && python3 -m http.server <PORT>`（Windows 无 python3 时 `py -m http.server`），浏览器访问 `http://localhost:<PORT>/prompt-pouch.html`（HTTP 才能读 prompts.json；file:// 直开回退缓存快照）
2. **维护**（页面已存在时）：读 `<DIR>/prompts.json` → 按用户意图修改 → 写回（UTF-8、2 空格缩进、保留 version 字段）→ 提醒用户刷新页面
   - **分类交互**：用户说「添加 XX」但未说分组 → AskUserQuestion 列出全部现有分组（加「新建分组」选项）让用户选；用户指定的分组不存在 → 明确告知该分组不存在，并问是否新建（新建则补 groups 条目：id 16 位数字主键（雪花规则见 data-format.md）、name 中文、icon 一个 emoji）
3. **打开页面**：用户说「打开锦囊 / 打开提示词页面」→
   - 目标目录无页面时先执行步骤 1（初始化）
   - 后台起本地服务（`cd <DIR> && python3 -m http.server <PORT>`，Windows 用 `py -m http.server`；端口被占则换 PORT+1 再试）
   - 按平台打开浏览器：darwin → `open http://localhost:<PORT>/prompt-pouch.html`；win32 → `start` 同 URL；linux → `xdg-open` 同 URL
4. **结构规则与维护操作** → 读 `resources/data-format.md`（schema、id 规范、createdAt、updatedAt、排序落盘、插值语法、排序模式）
5. **批量整理入囊**（用户给一堆文字/文件/说「把最近对话框内容整理进锦囊」）：
   - 读 `<DIR>/prompts.json` 现状 → 逐条提炼候选提示词（标题/正文/建议归入哪个现有组/标签 1-3 个）
   - 输出整理方案表给用户：每条建议分组与理由；现有组装不下的条目推荐新建分组（中文名 + emoji icon + 一句推荐理由），不擅自落盘
   - 用户口述调整（换组/改名/删条目/改推荐组名）→ 确认后一次性落盘：id 雪花规则、createdAt 当天、各组 order 续排，写回前重读最新文件合并
   - 落盘后提醒用户刷新页面
6. **使用咨询**（用户只问「锦囊怎么用」等用法、未要求生成或修改）→ 读 `resources/usage-guide.md`，将其内容原样输出（首行标题改为「锦囊使用指南」），不读写任何文件

## 核心约束

- **页面与数据分离**：HTML 绝不内嵌任何提示词数据，一切内容只进 prompts.json；样式升级只改仓库 reference.html 后重新复制到目标目录（用户数据不受影响）
- **双笔协作**：页面（授权目录时）与 AI 都可写 prompts.json——页面上有「＋ 新增提示词 / ✎ / 🗑 / 分组管理」表单直写；AI 落盘前必须重读最新文件再合并写回（见「页面双笔纪律」）
- **prompts.json 结构必须合法**：写回前自查 schema（version/groups[]/prompts[] 各字段齐全、group 引用存在、order 连续）
- **排序四模式**：页面顶栏切换「最新添加（默认，按 createdAt 倒序）/ 最近使用 / 使用频率 / 手动顺序」；最近使用与使用频率由页面在复制时自动统计（浏览器本地态，AI 不落盘）；用户在非手动模式下拖动卡片或点 ▲▼ 会自动切回手动顺序、点卡片 ⇄ 可把提示词移到其它分组——用户随后粘贴「复制变更指令」，AI 必须按指令落盘：先执行「分组调整」节（改各条 group），再按「各组顺序」节每组列出的顺序重写各条 `order`，写回后提醒用户刷新并点页面「✓ 已落盘」清除标记
- **id 规范**：组与提示词的 id 均为 16 位纯数字主键（雪花变体 = 13 位毫秒时间戳 + 3 位随机数，如 1762500000123456），全库唯一、删除后不复用、跨导出导入不冲突；AI 生成时按当前日期时间换算 13 位毫秒戳 + 自选 3 位随机数，与现有 id 重复则只换随机段；旧版「slug+序号」字符串 id（如 w05）兼容保留不迁移，新数据一律数字雪花 id（详见 data-format.md「id 生成规则」）
- **createdAt 规范**：新增提示词必写 `createdAt`（当天日期，YYYY-MM-DD 或完整 ISO 8601），它是「最新添加」默认排序的依据；旧数据可无此字段
- **updatedAt 规范**：AI 修改提示词（改标题/分组/内容/标签）时同步写/更新 `updatedAt`（当天日期，格式同 createdAt）；仅重排 order 或改收藏不更新；新增不写（视为无修改）
- **页面双笔纪律**：页面经目录授权后可直写 prompts.json（增删改分组与提示词、排序落盘）。AI 每次维护必须先重读最新 prompts.json 再修改写回，严禁基于会话早期读入的旧内容覆盖写回（会丢失页面刚写入的改动）；页面未授权目录时的操作会生成「复制指令」交回 AI，按指令内容落盘
- **插值语法**：内容里的 `{变量名}`（如「{功能名}」）会被页面自动识别为填充面板变量，写内容时按需保留花括号占位
