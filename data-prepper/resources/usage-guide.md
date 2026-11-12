# 数据整备使用指南

## 能做什么

把 Excel / CSV / JSON 散装数据变成干净的结构化数据：格式探测 → 清洗（去重去空格、类型规整，每一步留痕）→ JSON / CSV 落盘 → 数据概览报告（字段画像 / 分布 / 异常值 / 清洗清单）。

## 怎么用

1. 说「**整理这份数据**」+ 给文件路径（或「把 xx.xlsx 转成 JSON」）
2. 我输出结构画像（sheet / 行列 / 表头采样），你确认口径（哪些列 / 哪个 sheet）
3. 动手前列清洗清单（「去重：按 姓名+日期 删 N 条」），你点头后执行
4. 产出：`cleaned/data.json`（或 .csv）+ `cleaned/overview.md` 概览报告，落盘后报路径

## 可改配置（user-config.md）

- `OUT_FORMAT`：json / csv / both
- `CLEAN_PRESET`：standard 标准清洗 / minimal 只转格式
- `DIR`：落盘目录（默认源文件同目录 cleaned/）
- `ID_FIELDS`：去重主键

## 使用提示

- 原始文件永不修改，结果写新文件
- 缺失值留空标注，不编造；语义不明先问
