#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""report-collect — SkillForge 通用数据采集器

一个采集器，五种周期复用：
  python3 report-collect.py --config <user-config.md> --since 2026-11-17 --until 2026-11-17
  日报传当天、周报传本周、月报传当月、季报传当季、年报传全年并加 --full。

三通道（按 DATA_SOURCES 清单每项 type 分流）：
  git    —— git log 聚合：提交数 / 增删行数 / 按日·周·月分布 / 里程碑（tag+merge），
            内置生成物剔除表（node_modules / dist / *.lock / .build 等），剔除项透明记录
  file   —— 文件 Read 全文要点；目录递归扫文本文件（md/txt/csv/log/json/yaml，二进制跳过）
  remote —— url 拉取（urllib，10s 超时），失败静默跳过不阻塞

增量缓存 report-state.json（默认 ~/.skillforge/report-state.json）：
  同一 git 源、同一时间窗口、上次成功 → 直接复用上次结果（from_cache: true）；
  --full 忽略缓存全量重扫（年报用）。

输出：stdout 标准 JSON（schema_version: 1，五统计 skill 的统一输入）；
      stderr 人类可读采集摘要（--quiet 关闭）。
零依赖：仅 Python 3.8+ 标准库；user-config.md 的 yaml 块解析优先 PyYAML，
        缺失时内置 mini 解析器兜底（支持 SkillForge DATA_SOURCES 固定形状）。
"""

REPORT_COLLECT_VERSION = 1
SCHEMA_VERSION = 1

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request

from datetime import datetime

# ---------------------------------------------------------------------------
# 生成物剔除表（numstat 路径正则，命中即不计入增删行数，但透明记入 excluded）
# ---------------------------------------------------------------------------
EXCLUDE_PATTERNS = [
    r"^\.build/code-graph/",        # SpecCore 代码图谱（graph.json 单文件可贡献数十万行）
    r"(^|/)\.speccore/",              # SpecCore 元数据目录（code-graph/cache 等，全生成物）
    r"(^|/)\.build/",
    r"(^|/)node_modules/",
    r"(^|/)dist/",
    r"(^|/)build/",
    r"(^|/)vendor/",
    r"(^|/)\.venv/",
    r"(^|/)venv/",
    r"(^|/)__pycache__/",
    r"(^|/)\.git/",
    r"(^|/)\.next/",
    r"(^|/)\.nuxt/",
    r"(^|/)\.cache/",
    r"(^|/)coverage/",
    r"\.lock$",                     # package-lock.json / yarn.lock / pnpm-lock.yaml
    r"\.min\.(js|css)$",
    r"\.map$",
    r"\.DS_Store$",
]

# file 通道：目录递归跳过这些目录名
FILE_SKIP_DIRS = {".git", ".svn", ".hg", "node_modules", "dist", "build",
                  "__pycache__", ".venv", "venv", ".next", ".nuxt", ".cache",
                  ".build", ".speccore"}

# file 通道：文本文件扩展名白名单（白名单外不扫，保持要点提取聚焦）
FILE_TEXT_EXTS = {".md", ".txt", ".csv", ".log", ".json", ".yaml", ".yml"}

# 上限
MAX_FILE_ENTRIES = 200        # file 通道单源最大条目数
MAX_FILE_BYTES = 1024 * 1024  # 单文件最大 1MB
MAX_REMOTE_BYTES = 512 * 1024 # remote 单次最大 512KB
REMOTE_TIMEOUT = 10           # remote 超时（秒）
MAX_MILESTONES = 50           # 每仓里程碑上限
PREVIEW_CHARS = 200           # file/remote 预览字符数
MAX_COMMITS_DEFAULT = 2000    # 每仓逐条提交输出上限


# ---------------------------------------------------------------------------
# user-config.md 解析：提取 yaml 块中的 DATA_SOURCES 与 EXCLUDE_EXTRA
# ---------------------------------------------------------------------------
def strip_inline_comment(value):
    """去掉「空格#注释」；# 前无空格（URL 锚点）不切。"""
    m = re.search(r"\s+#", value)
    return value[:m.start()].strip() if m else value.strip()


def unquote(value):
    v = value.strip()
    if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
        return v[1:-1]
    return v


def _mini_parse_sources(block):
    """针对 SkillForge DATA_SOURCES 固定形状的极简 YAML 解析：
    DATA_SOURCES: 后接缩进两格的 '- key: value' 条目与再缩进的键值行；
    注释行（# 开头）跳过。形状以外的情况返回空，由报错提示兜底。"""
    lines = block.splitlines()
    idx = None
    for i, ln in enumerate(lines):
        if re.match(r"^\s*DATA_SOURCES\s*:", ln):
            idx = i
            break
    if idx is None:
        return []
    items, cur = [], None
    for ln in lines[idx + 1:]:
        stripped = ln.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if stripped.startswith("- "):
            content = stripped[2:].strip()
            k, _, v = content.partition(":")
            k = k.strip()
            cur = {}
            if k:
                cur[k] = unquote(strip_inline_comment(v))
            items.append(cur)
        elif cur is not None and re.match(r"^[\w-]+\s*:", stripped):
            k, _, v = stripped.partition(":")
            cur[k.strip()] = unquote(strip_inline_comment(v))
    return items


def _mini_parse_extra_exclude(block):
    """提取 EXCLUDE_EXTRA: 下缩进的 '- xxx' 列表。"""
    lines = block.splitlines()
    out = []
    for i, ln in enumerate(lines):
        if re.match(r"^\s*EXCLUDE_EXTRA\s*:", ln):
            for sub in lines[i + 1:]:
                s = sub.strip()
                if not s:
                    continue
                if s.startswith("#"):
                    continue
                if s.startswith("- "):
                    out.append(unquote(strip_inline_comment(s[2:])))
                elif re.match(r"^\s*[A-Za-z_][\w-]*\s*:", s):
                    break  # 下一个配置键，列表结束
            break
    return out


def extract_config(md_path):
    """从 user-config.md 提取 (data_sources, exclude_extra)。"""
    try:
        with open(md_path, "r", encoding="utf-8") as f:
            text = f.read()
    except OSError:
        return [], []
    m = re.search(r"```ya?ml\s*\n(.*?)```", text, re.S)
    if not m:
        return [], []
    block = m.group(1)
    try:
        import yaml  # PyYAML 优先（非标准库，多数环境已装）
        data = yaml.safe_load(block) or {}
        sources = data.get("DATA_SOURCES") or []
        extra = data.get("EXCLUDE_EXTRA") or []
        return sources, extra
    except Exception:
        return _mini_parse_sources(block), _mini_parse_extra_exclude(block)


def parse_source_item(item):
    """校验单条数据源：name 必填、type 必填且受支持；返回 (name, kind, payload) 或 None。"""
    if not isinstance(item, dict):
        return None
    name = str(item.get("name", "")).strip()
    kind = str(item.get("type", "")).strip().lower()
    if not name:
        return None
    if kind in ("git", "file"):
        mac = item.get("mac")
        win = item.get("win")
        path = win if sys.platform.startswith("win") else mac
        if path is None or str(path).strip() in ("", "-"):
            return None  # 当前系统无此路径
        expanded = os.path.expandvars(os.path.expanduser(str(path)))
        return (name, kind, {"name": name, "path": expanded})
    if kind == "remote":
        url = str(item.get("url", "")).strip()
        if not url:
            return None
        return (name, "remote", {"name": name, "url": url})
    return None  # 未知 type：忽略


def load_sources(config_paths, note):
    """合并多个 user-config.md 的 DATA_SOURCES；按 name 去重（先传者优先）。"""
    sources = {}
    for cfg in config_paths:
        items, extra = extract_config(cfg)
        for it in items:
            parsed = parse_source_item(it)
            if parsed is None:
                continue
            name, kind, payload = parsed
            if name in sources:
                note("[report-collect] ⊘ 数据源「%s」重名，保留先传配置中的定义" % name)
                continue
            sources[name] = (kind, payload)
        for pat in extra:
            if pat and pat not in EXCLUDE_PATTERNS:
                EXCLUDE_PATTERNS.append(pat)
    return sources


# ---------------------------------------------------------------------------
# git 通道
# ---------------------------------------------------------------------------
class _R:
    def __init__(self, code=127, out="", err=""):
        self.returncode = code
        self.stdout = out
        self.stderr = err


def _run(cmd):
    try:
        return subprocess.run(cmd, capture_output=True, text=True, errors="replace")
    except FileNotFoundError:
        return _R(err="git 命令不可用")


def is_excluded(path):
    for pat in EXCLUDE_PATTERNS:
        if re.search(pat, path):
            return True
    return False


def _parse_numstat_log(raw):
    """解析 git log --numstat 输出（--pretty=format:%x00%H%x00%ad%x00%s）。"""
    commits = []
    excluded = {"files": 0, "additions": 0, "deletions": 0, "paths": {}}
    parts = raw.split("\x00")
    if len(parts) < 4:
        return commits, excluded
    triples = parts[1:]  # 首段为空
    for i in range(0, len(triples) - 2, 3):
        h, date, block = triples[i], triples[i + 1], triples[i + 2]
        lines = block.splitlines()
        subject = lines[0].strip() if lines else ""
        if not subject:
            subject = "<无提交说明>"
        adds = dels = 0
        nfiles = 0
        for ln in lines[1:]:
            ln = ln.strip()
            if not ln:
                continue
            cols = ln.split("\t", 2)
            if len(cols) < 3:
                continue
            a, d, p = cols[0], cols[1], cols[2]
            if a == "-" or d == "-":
                continue  # 二进制文件无行数
            try:
                ai, di = int(a), int(d)
            except ValueError:
                continue
            if is_excluded(p):
                excluded["additions"] += ai
                excluded["deletions"] += di
                excluded["paths"][p] = excluded["paths"].get(p, 0) + ai
                continue
            adds += ai
            dels += di
            nfiles += 1
        commits.append({
            "hash": h, "date": date, "subject": subject,
            "files": nfiles, "additions": adds, "deletions": dels,
        })
    return commits, excluded


def _bucketize(commits):
    daily, weekly, monthly = {}, {}, {}
    for c in commits:
        d = c["date"][:10]
        if d not in daily:
            daily[d] = {"date": d, "commits": 0, "additions": 0, "deletions": 0}
        daily[d]["commits"] += 1
        daily[d]["additions"] += c["additions"]
        daily[d]["deletions"] += c["deletions"]
        try:
            iso = datetime.strptime(d, "%Y-%m-%d").isocalendar()
            wk = "%d-W%02d" % (iso[0], iso[1])
        except ValueError:
            wk = d[:7] + "-W00"
        if wk not in weekly:
            weekly[wk] = {"week": wk, "commits": 0, "additions": 0, "deletions": 0}
        weekly[wk]["commits"] += 1
        weekly[wk]["additions"] += c["additions"]
        weekly[wk]["deletions"] += c["deletions"]
        mon = d[:7]
        if mon not in monthly:
            monthly[mon] = {"month": mon, "commits": 0, "additions": 0, "deletions": 0}
        monthly[mon]["commits"] += 1
        monthly[mon]["additions"] += c["additions"]
        monthly[mon]["deletions"] += c["deletions"]
    return (
        sorted(daily.values(), key=lambda x: x["date"]),
        sorted(weekly.values(), key=lambda x: x["week"]),
        sorted(monthly.values(), key=lambda x: x["month"]),
    )


def collect_git(payload, since, until, opts, state):
    """聚合单仓窗口内提交。"""
    name, path = payload["name"], payload["path"]
    base = {"name": name, "path": path, "status": "skipped", "skip_reason": None}

    if not os.path.isdir(path):
        base["skip_reason"] = "路径不存在"
        return base
    if _run(["git", "-C", path, "rev-parse", "--is-inside-work-tree"]).returncode != 0:
        base["skip_reason"] = "非 git 仓库"
        return base

    # —— 增量缓存：同源同窗口且上次成功 → 复用（--full 忽略）——
    state_git = state.setdefault("git", {})
    prev = state_git.get(name)
    if (not opts.full and prev and prev.get("ok")
            and prev.get("since") == since and prev.get("until") == until):
        cached = dict(prev["result"])
        cached["from_cache"] = True
        return cached

    branch = _run(["git", "-C", path, "rev-parse", "--abbrev-ref", "HEAD"]).stdout.strip()
    if not branch:
        branch = "HEAD"

    r = _run(["git", "-C", path, "log",
              "--since=%s 00:00:00" % since, "--until=%s 23:59:59" % until,
              "--numstat", "--date=format:%Y-%m-%d",
              "--pretty=format:%x00%H%x00%ad%x00%s"])
    commits, excluded = _parse_numstat_log(r.stdout)

    # —— 文件级聚合（top_files 需要 numstat 明细）——
    file_agg = {}
    if commits:
        r2 = _run(["git", "-C", path, "log",
                   "--since=%s 00:00:00" % since, "--until=%s 23:59:59" % until,
                   "--numstat", "--pretty=format:"])
        for ln in r2.stdout.splitlines():
            ln = ln.strip()
            if not ln:
                continue
            cols = ln.split("\t", 2)
            if len(cols) < 3 or cols[0] == "-" or cols[1] == "-":
                continue
            try:
                ai, di = int(cols[0]), int(cols[1])
            except ValueError:
                continue
            p = cols[2]
            if is_excluded(p):
                continue
            rec = file_agg.setdefault(p, {"path": p, "additions": 0, "deletions": 0, "commits": 0})
            rec["additions"] += ai
            rec["deletions"] += di
            rec["commits"] += 1
    top_files = sorted(file_agg.values(), key=lambda x: -x["additions"])[:8]

    # —— 里程碑：窗口内 tag + merge ——
    milestones = []
    rt = _run(["git", "-C", path, "tag", "--sort=-creatordate",
               "--format=%(refname:short)\t%(creatordate:format:%Y-%m-%d)"])
    for ln in rt.stdout.splitlines():
        ln = ln.strip()
        if not ln:
            continue
        cols = ln.split("\t", 1)
        tag_name = cols[0].strip()
        tag_date = cols[1].strip() if len(cols) > 1 else ""
        if since <= tag_date <= until and len(milestones) < MAX_MILESTONES:
            milestones.append({"type": "tag", "name": tag_name, "date": tag_date,
                               "subject": None})
    rm = _run(["git", "-C", path, "log", "--merges",
               "--since=%s 00:00:00" % since, "--until=%s 23:59:59" % until,
               "--date=format:%Y-%m-%d",
               "--pretty=format:%x00%H%x00%ad%x00%s"])
    seg = rm.stdout.split("\x00")
    for i in range(1, len(seg) - 2, 3):
        if len(milestones) >= MAX_MILESTONES:
            break
        subject_line = seg[i + 2].splitlines()
        milestones.append({"type": "merge", "name": seg[i][:8], "date": seg[i + 1],
                           "subject": subject_line[0].strip() if subject_line else None})
    milestones.sort(key=lambda x: x["date"], reverse=True)

    daily, weekly, monthly = _bucketize(commits)

    total_add = sum(c["additions"] for c in commits)
    total_del = sum(c["deletions"] for c in commits)
    files_touched = len(file_agg)

    truncated = False
    commits_out = commits
    if len(commits) > opts.max_commits:
        commits_out = commits[: opts.max_commits]
        truncated = True

    excluded_top = sorted(excluded["paths"].items(), key=lambda x: -x[1])[:3]
    result = dict(base)
    result.update({
        "status": "ok", "skip_reason": None, "branch": branch, "from_cache": False,
        "commits_total": len(commits), "additions": total_add, "deletions": total_del,
        "files_touched": files_touched,
        "commits_truncated": truncated,
        "daily": daily, "weekly": weekly, "monthly": monthly,
        "top_files": top_files, "milestones": milestones,
        "commits": [] if opts.no_commits else commits_out,
        "excluded": {
            "files": len(excluded["paths"]), "additions": excluded["additions"],
            "deletions": excluded["deletions"],
            "top": [{"path": p, "additions": a} for p, a in excluded_top],
        },
    })
    state_git[name] = {"since": since, "until": until, "ok": True,
                       "cached_at": datetime.now().isoformat(timespec="seconds"),
                       "result": result}
    return result


# ---------------------------------------------------------------------------
# file 通道
# ---------------------------------------------------------------------------
def _readable_text(path):
    """读文本文件（utf-8 → gbk 兜底），二进制/超大/不可读返回 None。"""
    try:
        size = os.path.getsize(path)
        if size > MAX_FILE_BYTES:
            return None
        with open(path, "rb") as f:
            raw = f.read()
        for enc in ("utf-8", "gbk"):
            try:
                return raw.decode(enc), size
            except UnicodeDecodeError:
                continue
        return None
    except OSError:
        return None


def _entry_of(abs_path, base_dir):
    text_size = _readable_text(abs_path)
    if text_size is None:
        return None
    text, size = text_size
    flat = re.sub(r"\s+", " ", text).strip()
    preview = flat[:PREVIEW_CHARS]
    try:
        mtime = datetime.fromtimestamp(os.path.getmtime(abs_path)).strftime("%Y-%m-%d %H:%M")
    except OSError:
        mtime = ""
    rel = os.path.relpath(abs_path, base_dir) if base_dir else abs_path
    return {"path": rel, "chars": len(text), "bytes": size, "mtime": mtime, "preview": preview}


def collect_file(payload):
    name, path = payload["name"], payload["path"]
    base = {"name": name, "path": path, "status": "skipped", "skip_reason": None,
            "kind": None, "entries": []}
    if not os.path.exists(path):
        base["skip_reason"] = "路径不存在"
        return base
    if os.path.isfile(path):
        entry = _entry_of(path, None)
        if entry is None:
            base["skip_reason"] = "二进制或不可读文件"
            return base
        base.update({"status": "ok", "kind": "file", "entries": [entry]})
        return base
    if not os.path.isdir(path):
        base["skip_reason"] = "路径无效"
        return base
    entries = []
    for root, dirs, files in os.walk(path):
        dirs[:] = [d for d in dirs if d not in FILE_SKIP_DIRS and not d.startswith(".")]
        for fn in sorted(files):
            if len(entries) >= MAX_FILE_ENTRIES:
                break
            ext = os.path.splitext(fn)[1].lower()
            if ext not in FILE_TEXT_EXTS:
                continue
            entry = _entry_of(os.path.join(root, fn), path)
            if entry:
                entries.append(entry)
        if len(entries) >= MAX_FILE_ENTRIES:
            break
    if not entries:
        base["skip_reason"] = "目录内无可读文本文件"
        return base
    base.update({"status": "ok", "kind": "dir", "entries": entries})
    return base


# ---------------------------------------------------------------------------
# remote 通道
# ---------------------------------------------------------------------------
def collect_remote(payload):
    name, url = payload["name"], payload["url"]
    base = {"name": name, "url": url, "status": "skipped", "skip_reason": None,
            "chars": 0, "preview": None}
    try:
        req = urllib.request.Request(
            url, headers={"User-Agent": "skillforge-report-collector/%d" % REPORT_COLLECT_VERSION})
        with urllib.request.urlopen(req, timeout=REMOTE_TIMEOUT) as resp:
            data = resp.read(MAX_REMOTE_BYTES + 1)
        truncated = len(data) > MAX_REMOTE_BYTES
        text = data[:MAX_REMOTE_BYTES].decode("utf-8", errors="replace")
        flat = re.sub(r"\s+", " ", text).strip()
        base.update({"status": "ok", "chars": len(text),
                     "preview": flat[:PREVIEW_CHARS],
                     "truncated": truncated})
    except Exception as e:
        base["skip_reason"] = "拉取失败：%s" % e.__class__.__name__
    return base


# ---------------------------------------------------------------------------
# 增量缓存与主流程
# ---------------------------------------------------------------------------
def load_state(state_path):
    try:
        with open(state_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, dict):
            return data
    except (OSError, ValueError):
        pass
    return {"schema_version": SCHEMA_VERSION, "git": {}}


def save_state(state_path, state):
    state["schema_version"] = SCHEMA_VERSION
    try:
        os.makedirs(os.path.dirname(state_path), exist_ok=True)
        with open(state_path, "w", encoding="utf-8") as f:
            json.dump(state, f, ensure_ascii=False, indent=2)
    except OSError:
        pass


def main(argv=None):
    ap = argparse.ArgumentParser(
        prog="report-collect",
        description="SkillForge 通用数据采集器：按 DATA_SOURCES 清单聚合 git/file/remote 三通道，输出标准 JSON")
    ap.add_argument("--config", action="append", required=True,
                    help="数据源配置文件（user-config.md 路径），可传多个：先传者优先，重名数据源以先传者为准")
    ap.add_argument("--since", required=True, help="窗口起点 YYYY-MM-DD（含）")
    ap.add_argument("--until", required=True, help="窗口终点 YYYY-MM-DD（含）")
    ap.add_argument("--only", action="append", choices=["git", "file", "remote"],
                    help="只采集指定通道（可多次指定）")
    ap.add_argument("--full", action="store_true",
                    help="全量扫描，忽略增量缓存（年报建议加）")
    ap.add_argument("--state-dir", default=os.path.join(os.path.expanduser("~"), ".skillforge"),
                    help="report-state.json 存放目录（默认 ~/.skillforge/）")
    ap.add_argument("--out", help="结果 JSON 落盘路径（默认仅 stdout）")
    ap.add_argument("--max-commits", type=int, default=MAX_COMMITS_DEFAULT,
                    help="每仓逐条提交输出上限（默认 %d，超出截断并标记）" % MAX_COMMITS_DEFAULT)
    ap.add_argument("--no-commits", action="store_true",
                    help="不输出逐条 commits（只要聚合指标与分布）")
    ap.add_argument("--quiet", action="store_true", help="不打印人类可读采集摘要（stderr）")
    ap.add_argument("--version", action="version",
                    version="report-collect %d" % REPORT_COLLECT_VERSION)
    opts = ap.parse_args(argv)

    for d in (opts.since, opts.until):
        try:
            datetime.strptime(d, "%Y-%m-%d")
        except ValueError:
            sys.stderr.write("[report-collect] ✗ 日期格式错误：%s（应为 YYYY-MM-DD）\n" % d)
            return 2
    if opts.since > opts.until:
        sys.stderr.write("[report-collect] ✗ --since 晚于 --until\n")
        return 2

    notes = []

    def note(msg):
        notes.append(msg)

    sources = load_sources(opts.config, note)
    if not sources:
        sys.stderr.write("[report-collect] ✗ 未解析到任何有效数据源（请检查 DATA_SOURCES 清单）\n")
        return 2

    state_path = os.path.join(opts.state_dir, "report-state.json")
    state = load_state(state_path)

    only = set(opts.only) if opts.only else {"git", "file", "remote"}
    git_out, file_out, remote_out = [], [], []
    for name, (kind, payload) in sources.items():
        if kind == "git" and "git" in only:
            git_out.append(collect_git(payload, opts.since, opts.until, opts, state))
        elif kind == "file" and "file" in only:
            file_out.append(collect_file(payload))
        elif kind == "remote" and "remote" in only:
            remote_out.append(collect_remote(payload))

    save_state(state_path, state)

    all_out = git_out + file_out + remote_out
    summary = {
        "sources": {
            "total": len(sources),
            "ok": sum(1 for x in all_out if x.get("status") == "ok"),
            "skipped": sum(1 for x in all_out if x.get("status") != "ok"),
        },
        "commits_total": sum(x.get("commits_total", 0) for x in git_out if x.get("status") == "ok"),
        "additions": sum(x.get("additions", 0) for x in git_out if x.get("status") == "ok"),
        "deletions": sum(x.get("deletions", 0) for x in git_out if x.get("status") == "ok"),
        "repos_with_commits": sum(1 for x in git_out if x.get("status") == "ok" and x.get("commits_total")),
        "files_entries": sum(len(x.get("entries", [])) for x in file_out if x.get("status") == "ok"),
        "remote_ok": sum(1 for x in remote_out if x.get("status") == "ok"),
        "excluded_additions": sum(x.get("excluded", {}).get("additions", 0) for x in git_out if x.get("status") == "ok"),
        "excluded_deletions": sum(x.get("excluded", {}).get("deletions", 0) for x in git_out if x.get("status") == "ok"),
        "from_cache": sum(1 for x in git_out if x.get("from_cache")),
    }

    result = {
        "collector": "report-collect",
        "collector_version": REPORT_COLLECT_VERSION,
        "schema_version": SCHEMA_VERSION,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "window": {"since": opts.since, "until": opts.until},
        "summary": summary,
        "git": git_out,
        "files": file_out,
        "remote": remote_out,
    }

    out_text = json.dumps(result, ensure_ascii=False, indent=2)
    if opts.out:
        try:
            with open(opts.out, "w", encoding="utf-8") as f:
                f.write(out_text + "\n")
        except OSError as e:
            sys.stderr.write("[report-collect] ✗ 结果写盘失败：%s\n" % e)
            return 2
    else:
        print(out_text)

    if not opts.quiet:
        sys.stderr.write("[report-collect] 窗口 %s ~ %s\n" % (opts.since, opts.until))
        for n in notes:
            sys.stderr.write(n + "\n")
        for x in git_out:
            if x.get("status") == "ok":
                cache_tag = "（缓存复用）" if x.get("from_cache") else ""
                excl = x.get("excluded", {})
                sys.stderr.write(
                    "[report-collect] ✓ git  %s：%d 提交，+%d/-%d 行（涉及 %d 文件，剔除生成物 +%d/-%d）%s\n"
                    % (x["name"], x["commits_total"], x["additions"], x["deletions"],
                       x["files_touched"], excl.get("additions", 0), excl.get("deletions", 0), cache_tag))
            else:
                sys.stderr.write("[report-collect] ⊘ git  %s（%s）\n" % (x["name"], x.get("skip_reason")))
        for x in file_out:
            if x.get("status") == "ok":
                sys.stderr.write("[report-collect] ✓ file %s：%d 个文本文件\n"
                                 % (x["name"], len(x.get("entries", []))))
            else:
                sys.stderr.write("[report-collect] ⊘ file %s（%s）\n" % (x["name"], x.get("skip_reason")))
        for x in remote_out:
            if x.get("status") == "ok":
                sys.stderr.write("[report-collect] ✓ remote %s：%d 字符\n" % (x["name"], x.get("chars", 0)))
            else:
                sys.stderr.write("[report-collect] ⊘ remote %s（%s）\n" % (x["name"], x.get("skip_reason")))
        sys.stderr.write("[report-collect] 合计：%d/%d 数据源成功，%d 次提交，%d 个文件，%d 个远程源\n"
                         % (summary["sources"]["ok"], summary["sources"]["total"],
                            summary["commits_total"], summary["files_entries"], summary["remote_ok"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
