---
name: prompt-pouch
description: >
  锦囊（prompt-pouch）提示词管理 Skill：生成并维护一个本地 HTML 提示词管理页面（锦囊管理台），
  深棕金配色，功能为分组侧栏（带计数徽章）+ 搜索 + 卡片网格 + 拖拽与 ▲▼ 双重排序 + 收藏星标 +
  {变量} 插值填充面板 + 一键复制；数据存同目录 prompts.json，页面与数据严格分离，AI 是唯一的笔。
  两类任务：①初始化——在目标目录生成 prompt-pouch.html（样式真相源为 resources/reference.html，原样复制）
  与 prompts.json（默认示例四组：写作/编程/复盘/演讲）；②维护——按用户口述增删改提示词与分组、调整排序、
  切换收藏，读写 prompts.json（UTF-8、2 空格缩进），用户刷新页面即见。
  数据通过 HTTP 方式访问（file:// 直开会回退浏览器缓存快照，需提示用户起本地服务）。
  当用户问「锦囊怎么用/使用说明」时输出 resources/usage-guide.md 内容，不执行任何文件操作。
allowed-tools: ["Bash", "Read", "Write", "Edit"]
disable-model-invocation: false
---

# 锦囊 · 提示词管理台（prompt-pouch）

妙计入囊、随取随用：一个纯 HTML 的本地提示词管理台，页面与数据分离——AI 是唯一的笔，用户只管说，刷新即见。

## 执行流程

0. **读用户配置**（DIR/DIR_WIN/PORT/INIT_DATA/CONFIRM/CONFIG_VERSION）→ 先 Read 同目录 `user-config.md`
1. **初始化**（目标目录无 `prompt-pouch.html` 时）：
   - 复制 `resources/reference.html` → `<DIR>/prompt-pouch.html`（原样复制，不修改任何样式与脚本）
   - 生成 `<DIR>/prompts.json`：`INIT_DATA: example` 时写入示例四组（写作/编程/复盘/演讲，每组 3-4 条带 {变量} 示例）；`empty` 时写空结构（version + 空 groups/prompts）
   - 收尾提示启动方式：`cd <DIR> && python3 -m http.server <PORT>`，浏览器访问 `http://localhost:<PORT>/prompt-pouch.html`（HTTP 才能读 prompts.json；file:// 直开回退缓存快照）
2. **维护**（页面已存在时）：读 `<DIR>/prompts.json` → 按用户意图修改 → 写回（UTF-8、2 空格缩进、保留 version 字段）→ 提醒用户刷新页面
3. **结构规则与维护操作** → 读 `resources/data-format.md`（schema、id 规范、排序落盘、插值语法）
4. **使用咨询**（用户只问「锦囊怎么用」等用法、未要求生成或修改）→ 读 `resources/usage-guide.md`，将其内容原样输出（首行标题改为「锦囊使用指南」），不读写任何文件

## 核心约束

- **页面与数据分离**：HTML 绝不内嵌任何提示词数据，一切内容只进 prompts.json；样式升级只改仓库 reference.html 后重新复制到目标目录（用户数据不受影响）
- **AI 是唯一的笔**：页面上不提供「新增/编辑」表单，所有增删改由用户口述、AI 落盘
- **prompts.json 结构必须合法**：写回前自查 schema（version/groups[]/prompts[] 各字段齐全、group 引用存在、order 连续）
- **排序闭环**：用户拖拽或点 ▲▼ 后点击页面「复制排序指令」，指令文本会交回 AI——AI 必须按指令中每组列出的顺序重写各条 `order`，写回后提醒用户刷新
- **id 规范**：组 id 为英文 slug（如 writing）；提示词 id = 组 slug + 两位序号（如 w05），新增取该组现有最大序号 +1；禁止中文 id 与重复 id
- **插值语法**：内容里的 `{变量名}`（如「{功能名}」）会被页面自动识别为填充面板变量，写内容时按需保留花括号占位
