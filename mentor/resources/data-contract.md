# 谋定数据契约（data-contract）

四份 JSON 的字段级契约。页面表单 PUT 写回 data/ 下三份（config/holdings/presets）；outputs/signals.json 由 refresh.py 落盘、页面只读（仅「导入备份」经白名单 PUT 恢复）。所有 JSON 均为 UTF-8、2 空格缩进。

## 4.1 data/config.json —— 参数配置（页面表单 ↔ 计算参数）

与部署版 config.yaml 同构（无注释版），refresh.py 直接喂引擎。**初始化默认值**（本表同时是表单初始值）：

```json
{
  "capital": 50000,
  "grid": {
    "grid_step": 0.025, "base_ratio": 0.4, "levels": 5, "level_amount": 4000,
    "max_position_ratio": 0.2, "stop_loss_ratio": 0.1, "floor_buffer": 0.1, "lookback_days": 120,
    "targets": [
      {"symbol": "510888", "name": "示例ETF", "type": "etf"},
      {"symbol": "600000", "name": "示例银行", "type": "stock", "level_amount": 3000}
    ]
  },
  "risk": {"reserve_liquidity": 0.12, "max_total_position": 0.88, "single_side_down_days": 3},
  "convertible_bond": {
    "max_holdings": 7, "per_amount": 3500, "max_position_ratio": 0.15,
    "double_low_top": 7, "buy_price_max": 124.0, "buy_premium_max": 20.0,
    "sell_price_gt": 130.0, "sell_premium_gt": 30.0,
    "sell_double_low_pct": 0.2, "combo_stop_loss": 0.08
  }
}
```

字段语义（页面表单帮助文案同源）：

| 字段 | 含义 | 取值边界 |
|:---|:---|:---|
| capital | 总资金（元），所有信号按这笔钱算账 | 10000 ~ 1 亿 |
| grid.grid_step | 网格间距（小数，2.5% = 0.025） | 0.005 ~ 0.2 |
| grid.base_ratio | 底仓占比（小数，40% = 0.4） | 0 ~ 1 |
| grid.levels | 档位数 | 2 ~ 20 |
| grid.level_amount | 每档金额（元）；个股建议一手整数倍 | ≥100 |
| grid.max_position_ratio | 单标的上限（小数） | 0.01 ~ 1 |
| grid.stop_loss_ratio | 单标的止损线（小数，10% = 0.1） | 0.01 ~ 0.5 |
| grid.floor_buffer | 下限缓冲（小数，10% = 0.1） | 0 ~ 0.5 |
| grid.lookback_days | 回看窗口（交易日），120 ≈ 半年 | 20 ~ 500 |
| grid.targets[] | 标的池：symbol 6 位代码；name 显示名；type ∈ etf/index/stock；level_amount 可选（0 或缺省 = 用全局每档金额） | symbol 必填 6 位数字 |
| risk.reserve_liquidity | 预留流动性（小数，始终保留的现金比例） | 0 ~ 0.5 |
| risk.max_total_position | 总仓位上限（小数，88% = 0.88） | 0.1 ~ 1 |
| risk.single_side_down_days | 单边下跌观察（天），连续 N 天下跌信号标「观察」 | 1 ~ 10 |
| convertible_bond.max_holdings | 转债最多持有（只） | 1 ~ 20 |
| convertible_bond.per_amount | 每只转债金额（元） | ≥500 |
| convertible_bond.max_position_ratio | 单只转债上限（小数） | 0.01 ~ 1 |
| convertible_bond.double_low_top | 双低候选（只），双低 = 价格 + 溢价率×100 | 1 ~ 50 |
| convertible_bond.buy_price_max | 买入价上限（元），买入条件 A | 50 ~ 300 |
| convertible_bond.buy_premium_max | 买入溢价上限（%），买入条件 B | 0 ~ 100 |
| convertible_bond.sell_price_gt | 卖出价阈值（元），卖出条件 A | 50 ~ 500 |
| convertible_bond.sell_premium_gt | 卖出溢价阈值（%），卖出条件 B | 0 ~ 200 |
| convertible_bond.sell_double_low_pct | 双低排名阈值（小数，20% = 0.2），卖出条件 C | 0.01 ~ 1 |
| convertible_bond.combo_stop_loss | 组合止损（小数，8% = 0.08） | 0.01 ~ 0.5 |

## 4.2 data/holdings.json —— 持仓回填（页面表单 ↔ 组合计算）

对应部署版 holdings.csv 列（type/code/name/quantity/cost_price/note）；current_price 由行情自动回填，不留人工位。初始化模板 `positions: []`。

```json
{
  "positions": [
    {"type": "stock", "code": "600001", "name": "示例科技", "quantity": 100,
     "cost_price": 33.0, "note": "一手底仓"}
  ],
  "updated_at": "2026-11-13T10:00:00+08:00"
}
```

| 字段 | 含义 | 说明 |
|:---|:---|:---|
| positions[].type | 类型 ∈ stock/etf/index/cb | 网格持仓 etf/index/stock、转债持仓 cb；与引擎 _GRID_TYPES 对齐 |
| positions[].code | 6 位代码 | 与 targets[].symbol 对齐才能联动信号 |
| positions[].name | 显示名 | 任意 |
| positions[].quantity | 持股数量 | 正整数 |
| positions[].cost_price | 成本价（元） | 浮亏/浮盈按此算；0 = 未回填 |
| positions[].note | 备注 | 可选 |
| updated_at | 最近修改时间 | 页面写回时自动刷新 |

## 4.3 outputs/signals.json —— 信号结果（refresh.py 落盘，页面只读）

一张 JSON 聚合部署版全部输出，页面一次 fetch 渲染 9 区块：

```json
{
  "generated_at": "2026-11-13T15:35:00+08:00",
  "source": "RULE",
  "quotes": {"510888": {"price": 4.114, "pct_change": 0.52, "date": "2026-11-12", "src": "baostock"}},
  "market": {"updated_at": "2026-11-13T15:35:00+08:00",
             "indices": [{"code": "s_sh000001", "name": "上证指数", "market": "A股", "price": 3584.58,
                          "pct_change": -0.5, "source": "sina-hq"}]},
  "signals": [
    {"priority": 1, "target_type": "etf", "target_code": "510888", "target_name": "示例ETF",
     "action": "paused", "amount": 0.0, "trigger_reason": "现价已跌破下限，暂停买入",
     "risk_status": "pass"}
  ],
  "levels": [{"symbol": "510888", "name": "示例ETF", "current_price": 4.114, "level": 1,
              "upper_sell": 4.217, "lower_buy": 4.011, "distance_pct": 2.5, "level_amount": 4000}],
  "portfolio": {"total_asset": 63645.0, "cash": 50000.0, "grid_value": 13645.0, "cb_value": 0.0,
                "position_pct": 27.3, "max_single": 11.2, "combo_pnl_pct": 0.0},
  "risk_gate": {"market_status": "normal", "single_side_down_days": 0},
  "cb": {"candidates": [], "sells": []},
  "health": {"ok": true, "markets": {"510888": {"source": "baostock", "stale": false,
              "warnings": ["AkShare 主源超时，BaoStock 接棒"]}}},
  "ai_review": "（可选）AI 审查附注全文"
}
```

| 字段 | 区块 | 语义 |
|:---|:---|:---|
| generated_at / source | 0 状态栏 | 生成时间、来源恒为 RULE |
| quotes | 0.5 实时快照 | 各标的现价快照（price/pct_change/date/src；pct_change 为当日涨跌幅百分比，缺失时按前收自算） |
| market | 0 大盘行情 | indices 指数列表（code/name/market/price/pct_change/source）；market ∈ A股/港股/美股 |
| signals[] | 1 操作清单 | priority 1-3 排序；action ∈ buy/sell/paused/observe/hold；risk_status ∈ pass/blocked |
| levels[] | 4 网格档位 | 每标的档位表：current_price/level/upper_sell/lower_buy/distance_pct/level_amount |
| portfolio | 3 组合总览 | 总资产/现金/网格市值/转债市值/仓位比/单标最大/组合盈亏 |
| risk_gate | 0 状态栏 | market_status ∈ normal/observe/blocked；single_side_down_days 连续下跌天数 |
| cb | 5 转债轮动 | candidates 候选池、sells 卖出清单 |
| health | 6 数据健康 | ok 布尔；markets 逐标的源/新鲜度/警告 |
| ai_review | 2 AI 附注 | 可空字符串；永不与 signals 混排 |

## 4.4 备份与恢复（backup/ + 页面导出导入）

四份 JSON 都有三重保险：写回前自动留档、一键导出、一键导入恢复。

| 能力 | 触发点 | 行为 |
|:---|:---|:---|
| 自动备份 | 页面表单写回 config/holdings（serve.py PUT） | 覆写前旧档滚动存 `<看板>/backup/` |
| 自动备份 | refresh.py 落 signals.json | 覆写前旧档滚动存 `<看板>/backup/` |
| 导出 | 页面右下角「⇩」 | 四份 JSON 合成 `mentor-backup-<时间戳>.json` 下载（signals 尚未生成时为 null，presets 同理） |
| 导入 | 页面右下角「⇧」 | 选备份文件 → 契约校验 → 逐份 PUT 写回 → 页面自动刷新 |

- 备份命名：`<原名>.bak-YYYYMMDD-HHMMSS`（同秒多次写回追加 `-1`/`-2`）；滚动上限：每文件只留最近 3 份，超出自动删旧
- backup/ 目录不对 HTTP 暴露（serve.py 一律 404），历史数据只在本地磁盘
- 导出文件结构：`{exported_at, config, holdings, signals, presets}`（signals/presets 可空，旧备份无 presets 段导入时跳过）
- 导入本身就是写回，写回前旧档同样自动留档——导入前状态永远可找回，可反悔

## 4.5 data/presets.json —— 方案匣（多套参数快照的保存/切换/删除）

初始化模板：内置四套预置方案（default 兜底 + 新手稳健/均衡成长/进取积极，各为完整 config 快照，字段边界与 4.1 同表）：

> 页面兜底：reference.html 内置同款四套种子（与本节模板同源同值），presets.json 缺失/损坏时方案匣仍显示四套预置方案。

```json
{
  "active": "default",
  "presets": {
    "default": {
      "capital": 50000,
      "grid": {
        "grid_step": 0.025, "base_ratio": 0.4, "levels": 5, "level_amount": 4000,
        "max_position_ratio": 0.2, "stop_loss_ratio": 0.1, "floor_buffer": 0.1, "lookback_days": 120,
        "targets": [
          {"symbol": "510888", "name": "示例ETF", "type": "etf"},
          {"symbol": "600000", "name": "示例银行", "type": "stock", "level_amount": 3000}
        ]
      },
      "risk": {"reserve_liquidity": 0.12, "max_total_position": 0.88, "single_side_down_days": 3},
      "convertible_bond": {
        "max_holdings": 7, "per_amount": 3500, "max_position_ratio": 0.15,
        "double_low_top": 7, "buy_price_max": 124.0, "buy_premium_max": 20.0,
        "sell_price_gt": 130.0, "sell_premium_gt": 30.0,
        "sell_double_low_pct": 0.2, "combo_stop_loss": 0.08
      }
    },
    "新手稳健": {
      "capital": 50000,
      "grid": {
        "grid_step": 0.03, "base_ratio": 0.5, "levels": 5, "level_amount": 3000,
        "max_position_ratio": 0.15, "stop_loss_ratio": 0.08, "floor_buffer": 0.15, "lookback_days": 120,
        "targets": []
      },
      "risk": {"reserve_liquidity": 0.25, "max_total_position": 0.6, "single_side_down_days": 3},
      "convertible_bond": {
        "max_holdings": 3, "per_amount": 3000, "max_position_ratio": 0.12,
        "double_low_top": 5, "buy_price_max": 115.0, "buy_premium_max": 15.0,
        "sell_price_gt": 125.0, "sell_premium_gt": 25.0,
        "sell_double_low_pct": 0.25, "combo_stop_loss": 0.06
      }
    },
    "均衡成长": {
      "capital": 50000,
      "grid": {
        "grid_step": 0.025, "base_ratio": 0.45, "levels": 5, "level_amount": 4000,
        "max_position_ratio": 0.2, "stop_loss_ratio": 0.1, "floor_buffer": 0.1, "lookback_days": 120,
        "targets": []
      },
      "risk": {"reserve_liquidity": 0.15, "max_total_position": 0.75, "single_side_down_days": 3},
      "convertible_bond": {
        "max_holdings": 5, "per_amount": 3500, "max_position_ratio": 0.15,
        "double_low_top": 6, "buy_price_max": 120.0, "buy_premium_max": 18.0,
        "sell_price_gt": 128.0, "sell_premium_gt": 28.0,
        "sell_double_low_pct": 0.2, "combo_stop_loss": 0.08
      }
    },
    "进取积极": {
      "capital": 50000,
      "grid": {
        "grid_step": 0.02, "base_ratio": 0.35, "levels": 6, "level_amount": 5000,
        "max_position_ratio": 0.25, "stop_loss_ratio": 0.12, "floor_buffer": 0.08, "lookback_days": 120,
        "targets": []
      },
      "risk": {"reserve_liquidity": 0.08, "max_total_position": 0.9, "single_side_down_days": 2},
      "convertible_bond": {
        "max_holdings": 7, "per_amount": 3500, "max_position_ratio": 0.18,
        "double_low_top": 7, "buy_price_max": 124.0, "buy_premium_max": 20.0,
        "sell_price_gt": 130.0, "sell_premium_gt": 30.0,
        "sell_double_low_pct": 0.18, "combo_stop_loss": 0.1
      }
    }
  }
}
```

预置方案选型表（普通投资者按阶段与行情选；全部字段取值都在 4.1 边界内）：

| 方案 | 适合谁 / 什么行情 | 核心差异（vs default） |
|:---|:---|:---|
| default | 内置兜底，与 config.json 默认同源 | 中性均衡 |
| 新手稳健 | 刚入门 / 熊市防守 | 留 25% 现金、仓位上限 60%、3% 大网格少折腾、单标的 15%、止损 8%；转债 3 只且买价 115/溢价 15 更严 |
| 均衡成长 | 有一定经验 / 震荡市 | 留 15% 现金、仓位 75%；转债 5 只，买价 120/溢价 18 |
| 进取积极 | 经验丰富 / 牛市主升 | 留 8% 现金、仓位 90%、2% 小网格高频、6 档、单标的 25%、止损 12%；转债 7 只、组合止损 10% |

切换提醒（切换 = 用快照整体覆盖 config.json）：
- **capital 是占位值 50000**——切完在参数配置里改回实际资金（所有预置方案同款占位）
- **targets 为空**（default 是示例标的）——切完填自己的标的池
- 改完对助手说「刷新信号」才生效

| 字段 | 含义 | 取值边界 |
|:---|:---|:---|
| active | 当前生效方案名 | 必须指向 presets 中存在的键（可为空 = 未激活） |
| presets | 方案名 → 完整 config 快照 | 每个快照与 config.json 同契约（serve.py 复用同一校验）；方案名非空字符串；「default」不可删除（页面与助手都拦） |

语义：

- **切换** = 用 `presets[name]` 整体覆写 config.json（写前自动备份）→ active 指向该方案 → 需重新刷新信号才生效
- **另存为** = 把当前已生效 config.json 快照进 presets（同名覆盖）
- **删除** = 只删快照，不影响 config.json；删除的是 active 时 active 指回 default
- presets.json 不参与 refresh.py 计算链——引擎永远只读当前生效的 config.json
- 页面写回走 serve.py PUT（白名单第四文件），备份/导出导入与其他三份同规则

## 兼容承诺

- 新增字段一律加在末尾且带默认值（旧页面读新 JSON 不崩）；删除字段必须模板版本 bump + 深升级。
- signals.json 由 refresh.py 全量覆写（原子写），页面/助手都不允许手改；唯一例外是「⇧ 导入恢复」（经 serve.py 白名单 PUT，写前同样留档）。
