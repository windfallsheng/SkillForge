# 生成产物（阶段 2）

## 三件套（全部落盘到 DIR）

1. **reports.json**（数据真相源）：数组结构 `[{"name":"张工","date":"2026-11-12","progress":"…","plan":"…","risk":""}]`；每次生成整体重写该文件，页面导出的更新以它为准合并
2. **team-report.html**（收集台）：先 Read `resources/reference.html` 全文，以其为骨架模板逐处替换数据——①头部 meta：`sf-template` 版本戳保持当前模板版本、`trc-id` 换成新 UUID（crypto.randomUUID() 标准 v4，落盘前顺扫落盘目录下本技能命名的 html 读 id meta 查重，撞号重掷）②`<title>` 与头部标题卡文字换成 TITLE ③`window.TRC_DATA = [...]` 初始数据数组换成本次收集结果（JSON 序列化，注意转义引号）④日期徽章换成 REPORT_DATE。其余（CSS/JS/结构）一律不许动；样式参数解释与禁止项见 `resources/html-rules.md`
3. **summary.md**（汇总）：按日期分组的 Markdown 汇总——`## 2026-11-12（N 人已报）` 下每位成员一段（进展/计划/风险三行），末尾「风险集中项」小节聚合非空 risk 条目；对话中照常输出汇总正文

## 落盘纪律

- 文件名：`team-report.html` + `reports.json` + `summary.md`（同目录并存，目录已存在直接复用，只覆盖本清单内同名文件）
- OPEN_HTML: true 且落盘了 html 时自动打开浏览器（macOS：open <html文件>；Windows PowerShell：Start-Process <html文件>）
- **落盘完成后对话报告落盘位置**：完整路径清单（三件套），并注明 html 是否已在浏览器打开
- 同一目录重复生成时：以最新收集数据为准重写三件套；页面里用户新增但未导出的本地数据无法读取，提示用户「先导出 JSON 再发我，我帮你并入」
