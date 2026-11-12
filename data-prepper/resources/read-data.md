# 读取数据（阶段 1）

## 格式探测与解析

1. **xlsx/xls**：优先 `python3 -c "import openpyxl"` 探测；可用则 openpyxl 读全部 sheet（表名 + 行数列数 + 前 5 行采样）；不可用则 LibreOffice `soffice --headless --convert-to csv` 兜底（多 sheet 取第一个，对话注明）
2. **csv**：编码探测——先试 utf-8，失败试 gbk/gb18030；`python3` 读行数与表头 + 前 5 行采样；分隔符探测（逗号 / 制表符 / 分号）
3. **json**：直接 Read 或 python3 json.load；数组 / 对象两种结构分别处理（对象按顶层键拆表）

## 采样预览

- 先输出结构画像：格式、表（sheet）清单、行数列数、表头清单、前 5 行采样
- 大文件（> 5000 行）只采样首尾各 5 行 + 中间 5 行，禁止全文 Read 撑爆上下文
- 把结构画像展示给用户，等确认口径（哪个 sheet / 哪些列进结构化）后再进清洗
