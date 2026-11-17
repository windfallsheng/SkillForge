# 刷新信号执行指南（refresh-guide）

「刷新信号」= 助手代跑一条 Python 计算链：拉数（AkShare 主源 + BaoStock 备源 + 集思录）→ 引擎计算（网格 grid / 转债 cb / 风控 risk_gate）→ 聚合落 `outputs/signals.json` → 用户刷新页面即见。

## 命令

```bash
python3 scripts/refresh.py --dir <DIR> --pyxis <PYXIS_HOME>
```

- `--dir`：看板落盘根目录（user-config 的 DIR，脚本内也有默认值）
- `--pyxis`：计算核心仓库路径（user-config 的 PYXIS_HOME，默认 ~/Pyxis）
- 脚本以目录内 `python3` 或 `python3` 运行；依赖 akshare / baostock / pandas / requests 缺失时先 pip 安装（见「依赖缺失」行）

## 全链步骤（refresh.py 内部）

1. **读参数**：`<DIR>/data/config.json` → dict（缺失/损坏时用 data-contract.md 4.1 默认值并警告，不中断）
2. **读持仓**：`<DIR>/data/holdings.json` → positions（用于组合计算；空列表合法）
3. **挂载核心**：`sys.path.insert(0, <PYXIS_HOME>)` → `import pyxis`（失败走「核心缺失」行）
4. **拉行情**：pyxis.fetch_market（AkShare 主源，超时/失败自动切 BaoStock 备源，两源皆败的标的标 `ok:false` 进 health.warnings）
5. **拉转债**：pyxis.fetch_cb（集思录；数据量不足时 cb.candidates 为空并附注「数据不足，宁缺毋滥」）
6. **算信号**：grid_engine（按 targets 逐标的网格档位与买卖点）→ cb_engine（双低轮动候选/卖出）→ risk_gate（预留流动性/总仓位/单边下跌闸门，闸门 blocked 时 signals 全部标 blocked 语义）
7. **聚合**：signals/levels/portfolio/quotes/risk_gate/cb/health 汇总进 signals.json（字段契约见 data-contract.md 4.3），`ai_review` 缺省空串
8. **原子落盘**：覆写前旧 signals.json 滚动备份到 `<DIR>/backup/`（只留最近 3 份）→ 写 `<DIR>/outputs/signals.json.tmp` → `os.replace` 覆盖（防止读到半截 JSON）
9. **收尾告知**：一句概括「已刷新：N 条操作、风控状态 X、健康警告 Y 条」，提醒用户刷新页面

## 失败处理表

| 失败 | 处理 |
|:---|:---|
| 依赖缺失（ModuleNotFoundError: akshare/baostock…） | 提示用户 `pip3 install akshare baostock pandas requests`（或项目目录 venv），装完重跑 |
| 核心缺失（PYXIS_HOME 不存在或无 pyxis/ 包） | 明确报错：「计算核心不在 <路径>，请检查 user-config.md 的 PYXIS_HOME」；绝不内置副本硬跑 |
| 主源超时（AkShare 15s 读超时） | 引擎自动切 BaoStock 备源；两源皆败标 ok:false，信号对缺失标的标「数据缺失、暂停判断」，不硬算 |
| 转债数据不足（集思录 < 30 行） | cb.candidates 置空 + health.warnings 附注；不出转债信号（保守决策） |
| config.json 缺失/损坏 | 用 4.1 默认值跑并在 health.warnings 附注「配置缺失，用默认参数」；不中断 |
| 引擎异常（其他） | 完整报错栈给用户看 + 保留上次 signals.json 不覆盖（原子写保证）；不静默吞错 |
| 网络整体不可用 | 告知用户网络问题 + 建议稍后重试；不产出假信号 |

## 纪律

- 刷新必须走 refresh.py 全链，**不跳过引擎直写 signals.json**（页面/助手都只读它）
- signals.json 只允许 refresh.py 写（页面「⇧ 导入恢复」除外，经 serve.py 白名单 PUT 写前留档）；参数/持仓只允许页面表单或助手代笔写 data/*.json（代笔前备份 .bak-时间戳，滚动上限留最近 3 份）
- 刷新频率提醒：A 股数据是收盘快照（15:30 后数据才完整），盘中刷新拿到的是上一交易日数据，属正常
- 备份三件套：页面写回与刷新落盘前自动滚动留档 backup/（每文件留 3 份）；页面「⇩」一键导出四份 JSON、「⇧」选备份文件校验后逐份写回
