#!/usr/bin/env python3
"""谋定 · 本地静态服务：GET 静态 + PUT 写回 data/*.json 白名单 + 异步刷新链。

用法：python3 serve.py <看板目录> [端口，默认 8933，占用自动顺延 5 次]
设计：零依赖（仅标准库）；PUT 仅允许白名单三文件，JSON 校验 + tmp+rename 原子写；
写回前旧档自动滚动备份到 <看板>/backup/（每文件只留最近 3 份）；backup/ 不对 HTTP 暴露。
"""
import json
import os
import shutil
import subprocess
import sys
import threading
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(sys.argv[1]).expanduser().resolve() if len(sys.argv) > 1 else Path.home() / "mentor"
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8933
ALLOWED_PUT = {"data/config.json", "data/holdings.json", "data/presets.json",
               "outputs/signals.json"}  # 白名单（相对 ROOT）
BACKUP_KEEP = 3  # 滚动备份上限：每文件只留最近 N 份

# ── 刷新链：PYXIS_HOME 优先环境变量，其次 user-config.md（含存在性校验）──
_CFG_FILE = Path(__file__).resolve().parent.parent / "user-config.md"
PYXIS_HOME = os.environ.get("PYXIS_HOME", "").strip() or None
if not PYXIS_HOME and _CFG_FILE.exists():
    import re as _re
    try:
        _m = _re.search(r"PYXIS_HOME:\s*(\S+)", _CFG_FILE.read_text(encoding="utf-8"))
        if _m:
            PYXIS_HOME = Path(_m.group(1)).expanduser()
    except Exception:
        PYXIS_HOME = None
if PYXIS_HOME is not None and not (Path(PYXIS_HOME) / "pyxis").is_dir():
    PYXIS_HOME = None  # 配置过时/失效一律视为未配置，刷新时友好报错

# 后台刷新任务状态（异步化：点刷新立即返回，跑完页面自动重载）
_REFRESH_LOCK = threading.Lock()
_REFRESH = {"running": False, "started_at": None, "finished_at": None, "ok": None, "detail": ""}


def _run_refresh_job() -> None:
    """后台线程跑 refresh.py（--dir ROOT --pyxis PYXIS_HOME，单槽互斥）。"""
    ok, detail = False, ""
    try:
        refresh = Path(__file__).resolve().parent / "refresh.py"
        if PYXIS_HOME is None:
            detail = "PYXIS_HOME 未配置或失效：请编辑 user-config.md 填 Pyxis 仓库实际路径"
        elif not refresh.exists():
            detail = "scripts/refresh.py 缺失"
        else:
            proc = subprocess.run([sys.executable, str(refresh), "--dir", str(ROOT), "--pyxis", str(PYXIS_HOME)],
                                  capture_output=True, text=True, timeout=3600)
            if proc.returncode != 0:
                tail = (proc.stderr or proc.stdout or "")[-400:]
                detail = f"刷新链失败：{tail}"
            else:
                ok, detail = True, (proc.stdout or "").strip()[-200:]
    except subprocess.TimeoutExpired:
        detail = "刷新超时（3600s）"
    except Exception as e:
        detail = f"刷新失败: {e}"
    with _REFRESH_LOCK:
        _REFRESH.update(running=False, finished_at=time.strftime("%Y-%m-%d %H:%M:%S"), ok=ok, detail=detail)


# 后台回测任务状态（照刷新模式：POST 立即 202，跑完页面打开报告）
_BACKTEST_LOCK = threading.Lock()
_BACKTEST = {"running": False, "started_at": None, "finished_at": None, "ok": None, "detail": ""}


def _run_backtest_job() -> None:
    """后台线程跑网格回测（cwd=PYXIS_HOME，报告落到看板 outputs/，页面自动打开）。"""
    ok, detail = False, ""
    try:
        bt = Path(PYXIS_HOME) / "pyxis" / "backtest.py"
        if PYXIS_HOME is None:
            detail = "PYXIS_HOME 未配置或失效：请编辑 user-config.md 填 Pyxis 仓库实际路径"
        elif not bt.exists():
            detail = "Pyxis 仓库缺少 pyxis/backtest.py（回测引擎缺失）"
        else:
            proc = subprocess.run(
                [sys.executable, "-m", "pyxis.backtest", "--config", "config.yaml",
                 "--html", "--out", str(ROOT / "outputs" / "backtest_report.html")],
                cwd=str(PYXIS_HOME), capture_output=True, text=True, timeout=900)
            if proc.returncode != 0:
                tail = (proc.stderr or proc.stdout or "")[-400:]
                detail = f"回测失败：{tail}"
            else:
                ok, detail = True, (proc.stdout or "").strip()[-200:]
    except subprocess.TimeoutExpired:
        detail = "回测超时（900s）"
    except Exception as e:
        detail = f"回测失败: {e}"
    with _BACKTEST_LOCK:
        _BACKTEST.update(running=False, finished_at=time.strftime("%Y-%m-%d %H:%M:%S"), ok=ok, detail=detail)

def _validate_config(data, prefix="config.json") -> str | None:
    """config 结构校验（config.json 与 presets.json 的方案快照共用同一契约）。"""
    if not isinstance(data, dict) or "capital" not in data:
        return f"{prefix} 必须含 capital 字段"
    for key in ("grid", "risk", "convertible_bond"):
        if not isinstance(data.get(key), dict):
            return f"{prefix} 缺少 {key} 段"
    if not isinstance(data.get("grid", {}).get("targets"), list):
        return "grid.targets 必须是数组"
    for i, t in enumerate(data["grid"]["targets"]):
        if not isinstance(t, dict) or not str(t.get("symbol", "")).isdigit() or len(str(t.get("symbol", ""))) != 6:
            return f"标的第 {i + 1} 行：symbol 应为 6 位数字"
    return None


def _validate(rel: str, data) -> str | None:
    """契约级基础校验（字段语义见 resources/data-contract.md）。"""
    if rel == "data/config.json":
        err = _validate_config(data, "config.json")
        if err:
            return err
    if rel == "data/presets.json":
        if not isinstance(data, dict) or not isinstance(data.get("presets"), dict):
            return "presets.json 的 presets 必须是对象"
        if data.get("active") and data.get("active") not in data["presets"]:
            return "active 必须指向 presets 中存在的方案名"
        for name, cfg in data["presets"].items():
            if not isinstance(name, str) or not name.strip():
                return "方案名必须是非空字符串"
            err = _validate_config(cfg, f"方案「{name}」")
            if err:
                return err
    if rel == "data/holdings.json":
        if not isinstance(data, dict) or not isinstance(data.get("positions"), list):
            return "holdings.json 的 positions 必须是数组"
        for i, p in enumerate(data["positions"]):
            if not isinstance(p, dict) or not p.get("code") or not p.get("name"):
                return f"持仓第 {i + 1} 行：code 与 name 不能为空"
    if rel == "outputs/signals.json":
        if not isinstance(data, dict) or "generated_at" not in data or not isinstance(data.get("signals"), list):
            return "signals.json 必须含 generated_at 与 signals 数组"
    return None

def _backup(target) -> None:
    """写回前把旧档滚动存入 <ROOT>/backup/，同名前缀按时间戳只留最近 BACKUP_KEEP 份。"""
    if not target.exists():
        return
    bdir = ROOT / "backup"
    bdir.mkdir(parents=True, exist_ok=True)
    stamp = time.strftime("%Y%m%d-%H%M%S")
    dst = bdir / f"{target.name}.bak-{stamp}"
    n = 1
    while dst.exists():  # 同秒多次写回不互相覆盖
        dst = bdir / f"{target.name}.bak-{stamp}-{n}"
        n += 1
    shutil.copy2(target, dst)
    olds = sorted(bdir.glob(f"{target.name}.bak-*"), key=lambda p: p.name, reverse=True)
    for old in olds[BACKUP_KEEP:]:
        old.unlink()

class Handler(SimpleHTTPRequestHandler):
    def do_PUT(self):
        rel = self.path.lstrip("/").split("?")[0]
        if rel not in ALLOWED_PUT:
            self._send_json_error(403, "PUT 仅允许 data/config.json、data/holdings.json、data/presets.json 与 outputs/signals.json")
            return
        length = int(self.headers.get("Content-Length", 0))
        if length <= 0 or length > 2 * 1024 * 1024:
            self._send_json_error(400, "空请求体或超过 2MB")
            return
        try:
            data = json.loads(self.rfile.read(length).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as e:
            self._send_json_error(400, f"JSON 解析失败: {e}")
            return
        err = _validate(rel, data)
        if err:
            self._send_json_error(422, err)
            return
        target = (ROOT / rel).resolve()
        if not str(target).startswith(str(ROOT)):
            self._send_json_error(403, "路径越界")
            return
        target.parent.mkdir(parents=True, exist_ok=True)
        tmp = target.with_suffix(target.suffix + ".tmp")
        tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        _backup(target)  # 旧档先留备份再覆盖
        os.replace(tmp, target)
        body = json.dumps({"ok": True, "path": rel}, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        rel = self.path.lstrip("/").split("?")[0]
        if rel == "api/refresh":
            with _REFRESH_LOCK:
                if _REFRESH["running"]:
                    self._send_json_error(409, f"已在刷新中（{_REFRESH['started_at']} 启动）")
                    return
                _REFRESH.update(running=True, started_at=time.strftime("%Y-%m-%d %H:%M:%S"),
                                finished_at=None, ok=None, detail="")
            threading.Thread(target=_run_refresh_job, daemon=True).start()
            body = json.dumps({"ok": True, "code": "started"}, ensure_ascii=False).encode("utf-8")
            self.send_response(202)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if rel == "api/backtest":
            if PYXIS_HOME is None:
                self._send_json_error(501, "本机模式未配置 Pyxis：请编辑 user-config.md 填 Pyxis 仓库实际路径，或对助手说「跑回测」")
                return
            with _BACKTEST_LOCK:
                if _BACKTEST["running"]:
                    self._send_json_error(409, f"回测已在运行中（{_BACKTEST['started_at']} 启动）")
                    return
                _BACKTEST.update(running=True, started_at=time.strftime("%Y-%m-%d %H:%M:%S"),
                                 finished_at=None, ok=None, detail="")
            threading.Thread(target=_run_backtest_job, daemon=True).start()
            body = json.dumps({"ok": True, "code": "started"}, ensure_ascii=False).encode("utf-8")
            self.send_response(202)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        self._send_json_error(404, "未知接口")

    def _send_json_error(self, code, msg):
        """send_error 的状态行只能 latin-1，中文消息会炸连接；错误一律走 UTF-8 JSON 体。"""
        body = json.dumps({"ok": False, "error": msg}, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _guard_backup(self) -> bool:
        """backup/ 目录存历史数据，一律 404 不出网。返回 True 表示已拦截。"""
        rel = self.path.lstrip("/").split("?")[0]
        if rel.startswith("backup/"):
            self._send_json_error(404, "备份目录不对 HTTP 暴露")
            return True
        return False

    def do_GET(self):
        if self._guard_backup():
            return
        rel = self.path.lstrip("/").split("?")[0]
        if rel == "api/refresh-status":
            with _REFRESH_LOCK:
                body = json.dumps({"ok": True, "refresh": dict(_REFRESH)}, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if rel == "api/backtest-status":
            with _BACKTEST_LOCK:
                body = json.dumps({"ok": True, "backtest": dict(_BACKTEST),
                                   "report_url": "outputs/backtest_report.html"}, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def do_HEAD(self):
        if self._guard_backup():
            return
        super().do_HEAD()

    def log_message(self, fmt, *args):
        sys.stderr.write("[serve] %s\n" % (fmt % args))


def main() -> None:
    ROOT.mkdir(parents=True, exist_ok=True)
    handler = partial(Handler, directory=str(ROOT))
    for offset in range(5):
        try:
            httpd = ThreadingHTTPServer(("127.0.0.1", PORT + offset), handler)
            break
        except OSError:
            httpd = None
    if httpd is None:
        print(f"[serve] 端口 {PORT}-{PORT + 4} 全部被占，请指定其他端口", file=sys.stderr)
        sys.exit(1)
    print(f"[serve] 谋定看板: http://localhost:{PORT + offset}/mentor.html （Ctrl+C 停止）")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[serve] 已停止")


if __name__ == "__main__":
    main()
