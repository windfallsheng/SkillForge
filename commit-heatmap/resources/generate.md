# 生成 HTML（阶段 2）

先 Read `resources/reference.html` 全文，以其为骨架模板逐处替换数据：

1. **meta**：`sf-template` 版本戳保持当前模板版本；`heat-id` 换成新 UUID（crypto.randomUUID() 标准 v4，落盘前顺扫落盘目录下本技能命名的 html 读 id meta 查重，撞号重掷）
2. **`window.HEAT_DATA`**：替换为 `{"2026-11-12": 3, ...}` 计数映射（JSON 序列化）
3. **`window.HEAT_STATS`**：替换为四项统计 `{total, streak, active, topDay, topCount}`
4. **标题与日期区间**：`<title>`、头部标题、区间徽章（YYYY-MM-DD 至 YYYY-MM-DD）替换
5. 其余（CSS/JS/结构）一律不许动；样式参数解释与禁止项见 `resources/html-rules.md`

## 落盘

- 文件名 `commit-heatmap.html`（DIR: auto 时落 REPO 根 reports/ 子目录，不存在则创建；目录已存在直接复用）
- OPEN_HTML: true 且落盘了 html 时自动打开浏览器（macOS：open <html文件>；Windows PowerShell：Start-Process <html文件>）
- **落盘完成后对话报告落盘位置**：完整路径，并注明 html 是否已在浏览器打开；对话中同时输出四项统计数字
