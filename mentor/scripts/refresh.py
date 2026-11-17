#!/usr/bin/env python3
"""谋定 · 刷新信号：挂载 Pyxis 计算核心，拉数 → 引擎计算 → 聚合落 outputs/signals.json。

用法：python3 refresh.py --dir <看板目录> --pyxis <Pyxis仓库路径>
原则：只做编排，不拷贝引擎逻辑（引擎单一真相源在 Pyxis 仓库 pyxis/ 包内）；
      signals.json 全量覆写、tmp+rename 原子落盘；覆写前旧档滚动备份到 <看板>/backup/
      （只留最近 3 份，与 serve.py 同一约定）。
"""
import argparse
import json
import os
import shutil
import sys
import time
from datetime import datetime
from pathlib import Path

BACKUP_KEEP = 3  # 滚动备份上限：signals.json 只留最近 N 份

DEFAULT_CFG = {
    "capital": 50000,
    "grid": {
        "grid_step": 0.025, "base_ratio": 0.4, "levels": 5, "level_amount": 4000,
        "max_position_ratio": 0.2, "stop_loss_ratio": 0.1, "floor_buffer": 0.1, "lookback_days": 120,
        "targets": [
            {"symbol": "510888", "name": "示例ETF", "type": "etf"},
            {"symbol": "600000", "name": "示例银行", "type": "stock", "level_amount": 3000},
        ],
    },
    "risk": {"reserve_liquidity": 0.12, "max_total_position": 0.88, "single_side_down_days": 3},
    "convertible_bond": {
        "max_holdings": 7, "per_amount": 3500, "max_position_ratio": 0.15,
        "double_low_top": 7, "buy_price_max": 124.0, "buy_premium_max": 20.0,
        "sell_price_gt": 130.0, "sell_premium_gt": 30.0,
        "sell_double_low_pct": 0.2, "combo_stop_loss": 0.08,
    },
}

HOLDINGS_COLS = ["type", "code", "name", "quantity", "cost_price", "current_price", "note"]


def _load_json(path: Path, fallback):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return fallback


def _last_close(market_dir: Path, symbol: str):
    """parquet 最新收盘、日期与涨跌幅%（quotes 区块用；无 pct_change 列时按前收自算）。"""
    f = market_dir / f"{symbol}.parquet"
    if not f.exists():
        return None, None, None
    try:
        import pandas as pd
        df = pd.read_parquet(f)
        if df.empty:
            return None, None, None
        last = df.iloc[-1]
        close = last.get("close", last.get("price", None))
        date_str = str(last.get("date", ""))[:10]
        pct = last.get("pct_change", None)
        if pct is None and len(df) > 1:
            prev = float(df.iloc[-2].get("close"))
            pct = round((float(close) / prev - 1) * 100, 2) if prev else None
        return ((float(close) if close is not None else None), date_str,
                (float(pct) if pct is not None else None))
    except Exception:
        return None, None, None


def _backup(wd, target) -> None:
    """落盘前把旧档滚动存入 <DIR>/backup/，同名前缀按时间戳只留最近 BACKUP_KEEP 份。"""
    if not target.exists():
        return
    bdir = wd / "backup"
    bdir.mkdir(parents=True, exist_ok=True)
    stamp = time.strftime("%Y%m%d-%H%M%S")
    dst = bdir / f"{target.name}.bak-{stamp}"
    n = 1
    while dst.exists():  # 同秒多次刷新不互相覆盖
        dst = bdir / f"{target.name}.bak-{stamp}-{n}"
        n += 1
    shutil.copy2(target, dst)
    olds = sorted(bdir.glob(f"{target.name}.bak-*"), key=lambda p: p.name, reverse=True)
    for old in olds[BACKUP_KEEP:]:
        old.unlink()

def main() -> int:
    parser = argparse.ArgumentParser(description="谋定 · 刷新信号（拉数→引擎→落 signals.json）")
    parser.add_argument("--dir", default=str(Path.home() / "mentor"), help="看板落盘根目录")
    parser.add_argument("--pyxis", default=str(Path.home() / "Pyxis"), help="Pyxis 计算核心仓库路径")
    args = parser.parse_args()

    wd = Path(args.dir).expanduser()
    px = Path(args.pyxis).expanduser()
    if not (px / "pyxis").is_dir():
        print(f"[谋定] 错误：计算核心不在 {px}，请检查 user-config.md 的 PYXIS_HOME（绝不内置副本硬跑）",
              file=sys.stderr)
        return 1

    # 引擎依赖 pandas/akshare/baostock：当前解释器缺失且 Pyxis 自带 .venv 时，切到 venv 重跑自身
    # （venv python3 是指向基础解释器的 symlink，不能用 resolve 比较；venv 内运行时 sys.prefix 指向 venv 目录）
    venv_py = px / ".venv" / "bin" / "python3"
    if venv_py.is_file() and sys.prefix != str(px / ".venv"):
        try:
            import pandas  # noqa: F401
        except ModuleNotFoundError:
            os.execv(str(venv_py), [str(venv_py), str(Path(__file__).resolve()), *sys.argv[1:]])

    sys.path.insert(0, str(px))
    try:
        import pandas as pd
    except ModuleNotFoundError:
        print("[谋定] 依赖缺失：pandas。请 pip3 install pandas akshare baostock requests", file=sys.stderr)
        return 2
    try:
        import pyxis.fetch_market as fetch_market
        import pyxis.fetch_cb as fetch_cb
        import pyxis.fetch_indices as fetch_indices
        import pyxis.grid_engine as grid_engine
        import pyxis.cb_engine as cb_engine
        import pyxis.risk_gate as risk_gate
    except ModuleNotFoundError as e:
        print(f"[谋定] 依赖缺失：{e.name}。请 pip3 install akshare baostock", file=sys.stderr)
        return 2

    warnings: list[str] = []

    # ── 1/2. 读参数与持仓 ──────────────────────────────────
    cfg = _load_json(wd / "data" / "config.json", None)
    if not isinstance(cfg, dict) or "capital" not in cfg:
        cfg = DEFAULT_CFG
        warnings.append("config.json 缺失/损坏，用默认参数")
    hd = _load_json(wd / "data" / "holdings.json", {"positions": []})
    try:
        positions = [
            {"type": p.get("type", "stock"), "code": str(p.get("code", "")), "name": p.get("name", ""),
             "quantity": int(p.get("quantity") or 0), "cost_price": float(p.get("cost_price") or 0),
             "current_price": 0.0, "note": p.get("note", "")}
            for p in hd.get("positions", []) if isinstance(p, dict)
        ]
    except Exception:
        positions = []
        warnings.append("holdings.json 损坏，持仓按空处理")
    holdings = pd.DataFrame(positions, columns=HOLDINGS_COLS) if positions else pd.DataFrame(columns=HOLDINGS_COLS)

    # ── 目录 ──────────────────────────────────────────────
    market_dir = wd / "data" / "market"
    market_dir.mkdir(parents=True, exist_ok=True)
    cb_file = wd / "data" / "cb.parquet"
    out_dir = wd / "outputs"
    out_dir.mkdir(parents=True, exist_ok=True)

    # ── 3/4/5. 拉行情与转债（并发 4 路：akshare 慢时总耗时≈单标的 × 批数，不再串行累加） ──
    health_markets: dict = {}
    targets = cfg["grid"].get("targets", [])

    def _fetch_one(t):
        symbol, mtype = str(t["symbol"]), t.get("type", "etf")
        try:
            status = fetch_market.fetch(symbol, mtype, market_dir / f"{symbol}.parquet")
        except Exception as e:
            status = {"ok": False, "source": "none", "last_date": "", "stale": True, "warnings": [str(e)]}
        return symbol, status

    if len(targets) > 1:
        from concurrent.futures import ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=min(4, len(targets))) as ex:
            for symbol, status in ex.map(_fetch_one, targets):
                health_markets[symbol] = status
    else:
        for t in targets:
            symbol, status = _fetch_one(t)
            health_markets[symbol] = status
    for symbol, status in health_markets.items():
        for w in status.get("warnings", []):
            warnings.append(f"[{symbol}] {w}")

    try:
        health_cb = fetch_cb.fetch(cb_file, stale_days=7)
    except Exception as e:
        health_cb = {"ok": False, "warnings": [str(e)]}
    for w in health_cb.get("warnings", []):
        warnings.append(f"[cb] {w}")

    # ── 5.5 大盘指数（A股/港股/美股，新浪轻量源 + BaoStock 备源） ──
    try:
        idx_list, idx_warns = fetch_indices.fetch()
    except Exception as e:
        idx_list, idx_warns = [], [f"指数拉取失败：{e}"]
    warnings.extend(f"[index] {w}" for w in idx_warns)

    # ── 6. 引擎计算 ───────────────────────────────────────
    levels, grid_sigs = grid_engine.run(cfg, market_dir, holdings)
    try:
        cb_sigs = cb_engine.run(cfg, cb_file, holdings)
    except Exception as e:
        cb_sigs = pd.DataFrame()
        warnings.append(f"转债引擎异常，本轮跳过转债信号：{e}")
    frames = [f for f in (grid_sigs, cb_sigs) if not f.empty]
    if frames:
        signals = pd.concat(frames, ignore_index=True)
    else:
        signals = pd.DataFrame(columns=["priority", "target_type", "target_code", "target_name",
                                        "action", "amount", "trigger_reason", "risk_status",
                                        "source", "date"])
    signals = risk_gate.check(cfg, signals, holdings, market_dir)
    try:
        snap = risk_gate.snapshot(cfg, holdings, market_dir)
    except Exception as e:
        snap = {}
        warnings.append(f"组合快照失败：{e}")

    # ── 7. 聚合 signals.json（字段契约 data-contract.md 4.3） ──
    def _records(df) -> list[dict]:
        out = []
        for _, row in df.iterrows():
            rec = {}
            for k, v in row.items():
                if hasattr(v, "isoformat"):
                    rec[str(k)] = v.isoformat()
                elif hasattr(v, "item"):
                    rec[str(k)] = v.item()
                else:
                    rec[str(k)] = v
            out.append(rec)
        return out

    quotes = {}
    for t in cfg["grid"].get("targets", []):
        symbol = str(t["symbol"])
        close, date_str, pct = _last_close(market_dir, symbol)
        if close is not None:
            quotes[symbol] = {"price": close, "date": date_str or "",
                              "pct_change": pct,
                              "src": health_markets.get(symbol, {}).get("source", "unknown")}

    risk_statuses = [str(s.get("risk_status", "pass")) for s in _records(signals)]
    market_status = "normal"
    if "blocked" in risk_statuses:
        market_status = "blocked"
    elif "observe" in risk_statuses:
        market_status = "observe"

    health_payload = {
        "ok": bool(health_markets) and all(bool(m.get("ok")) for m in health_markets.values())
              and bool(health_cb.get("ok")),
        "markets": {sym: {"source": st.get("source", "unknown"),
                          "stale": bool(st.get("stale")),
                          "warnings": st.get("warnings", [])}
                    for sym, st in health_markets.items()},
        "cb": {"source": health_cb.get("source", "unknown"), "warnings": health_cb.get("warnings", [])},
    }
    if warnings:
        health_payload.setdefault("global_warnings", warnings)

    payload = {
        "generated_at": datetime.now().strftime("%Y-%m-%dT%H:%M:%S%z") + "+08:00",
        "source": "RULE",
        "quotes": quotes,
        "market": {"indices": idx_list,
                   "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")},
        "signals": _records(signals),
        "levels": _records(levels),
        "portfolio": snap,
        "risk_gate": {"market_status": market_status,
                      "blocked": risk_statuses.count("blocked"),
                      "observe": risk_statuses.count("observe")},
        "cb": {"candidates": [r for r in _records(cb_sigs) if str(r.get("action", "")).lower() == "buy"],
               "sells": [r for r in _records(cb_sigs) if str(r.get("action", "")).lower() == "sell"]},
        "health": health_payload,
        "ai_review": "",
    }

    # ── 8. 原子落盘（覆写前旧档滚动备份）──────────────────
    tmp = out_dir / "signals.json.tmp"
    tmp.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    _backup(wd, out_dir / "signals.json")  # 旧档先留备份再覆盖
    os.replace(tmp, out_dir / "signals.json")

    # ── 9. 收尾摘要 ───────────────────────────────────────
    n = len(payload["signals"])
    print(f"[谋定] 已刷新：{n} 条操作、风控状态 {market_status}、"
          f"健康警告 {len(warnings)} 条 → {out_dir / 'signals.json'}（页面刷新即见）")
    for s in payload["signals"][:10]:
        print(f"  · [{s.get('priority', '?')}] {s.get('action', '?').upper()} {s.get('target_name', '')} "
              f"| {s.get('trigger_reason', '')} | {s.get('risk_status', '?')}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
