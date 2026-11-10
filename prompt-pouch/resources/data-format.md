# prompts.json 结构规范与维护操作

## Schema（version 1）

```json
{
  "version": 1,
  "groups": [
    { "id": "writing", "name": "写作", "icon": "✍️" }
  ],
  "prompts": [
    {
      "id": "w01",
      "group": "writing",
      "title": "日报速写",
      "content": "提示词正文，支持 {变量} 插值占位……",
      "tags": ["日报", "工作"],
      "order": 1,
      "favorite": true
    }
  ]
}
```

## 字段约定

- `groups[].id`：英文 slug（如 writing），不可含中文；`name` 中文显示名；`icon` 一个 emoji
- `prompts[].id`：组 slug + 两位序号（w01、c02…），新增取该组现有最大序号 +1；删条目不回收旧 id（避免与备份/指令混淆）
- `prompts[].group`：必须引用存在的组 id，写回前逐一校验
- `prompts[].order`：组内排序权重，从 1 递增且尽量连续；重排时按新顺序整体重写
- `prompts[].favorite`：收藏星标（页面点星为本地态，指令「收藏/取消收藏 XX」由 AI 落盘）
- `prompts[].tags`：1-3 个短标签，用于搜索与归类

## 维护操作规则

- **新增提示词**：用户说「把 XX 加到锦囊的写作分组」→ 补一条 prompts 记录（id/group/title/content/tags/order/favorite 齐全）；未指定分组时，优先选语义最匹配的现有分组，实在没有才新建分组并先询问
- **修改**：定位 id 或标题，只改用户指定的字段；「修改锦囊里『日报速写』的内容」→ 整段替换 content
- **删除**：删 prompts 条目；删分组前须先处理组内条目（移组或一并删除，需与用户确认）
- **排序**：用户粘贴「复制排序指令」文本 → 按指令每组列表顺序重写 order；指令含「未保存」提示时，说明用户拖拽后未复制最新指令，按指令内容为准
- **新建分组**：id 英文 slug（拼音或英译），name 中文，icon 一个 emoji
- **写回格式**：UTF-8、2 空格缩进、末尾换行；不压缩不重排无关字段
