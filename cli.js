#!/usr/bin/env node
"use strict";
/**
 * SkillForge CLI —— 技能锻造坊安装器
 *
 *   skill-forge ls       列出全部技能（分类 + 名称 + 说明）
 *   skill-forge init     交互式挑选技能，装进 AI 助手的技能目录
 *   skill-forge update   升级已安装技能（配置版本感知：官方配置结构变化时
 *                        先备份你的配置，再询问覆盖/保留/稍后处理）
 *
 * 零依赖，Node >= 14。
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");

const PKG_DIR = __dirname;
const VERSION = require(path.join(PKG_DIR, "package.json")).version;

// 分类映射与 README「技能分类」表一致；新增技能时请同步
const CATEGORIES = [
  { name: "报表汇演", en: "Reports", skills: ["daily-report", "weekly-report", "annual-report"] },
  { name: "文档装裱", en: "Documents", skills: ["article-to-html"] },
  { name: "工程提效", en: "Engineering", skills: ["spec-doc2spec", "spec-spec2doc"] },
  { name: "演示汇演", en: "Slides", skills: ["magic-deck"] },
  { name: "沟通协作", en: "Communication", skills: ["prompt-pouch"] },
  { name: "技能自造", en: "Meta", skills: ["meta-forge"] },
];

// 常见 AI 助手的用户级技能目录（宿主中立，init 时自动探测）
const KNOWN_SKILL_DIRS = [
  "~/.qoder-cn/skills",
  "~/.claude/skills",
  "~/.cursor/skills",
  "~/.windsurf/skills",
  "~/.trae/skills",
  "~/.codex/skills",
];

// 包内不视为技能的目录
const SKIP_DIRS = new Set(["template", "node_modules", ".git", ".github"]);

// ---------- 工具 ----------

function expandHome(p) {
  if (p === "~") return os.homedir();
  if (p.startsWith("~/")) return path.join(os.homedir(), p.slice(2));
  return p;
}

function parseFrontmatter(text) {
  const m = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  const lines = m[1].split("\n");
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([A-Za-z-]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let val = kv[2].trim();
    if (val === ">" || val === "|") {
      // 折叠多行 description
      const parts = [];
      while (i + 1 < lines.length && /^\s{2,}\S/.test(lines[i + 1])) {
        i++;
        parts.push(lines[i].trim());
      }
      val = parts.join(" ");
    }
    fm[key] = val;
  }
  return fm;
}

function scanSkills() {
  const skills = [];
  for (const entry of fs.readdirSync(PKG_DIR)) {
    if (SKIP_DIRS.has(entry) || entry.startsWith(".")) continue;
    const skillDir = path.join(PKG_DIR, entry);
    const skillMd = path.join(skillDir, "SKILL.md");
    if (!fs.statSync(skillDir).isDirectory() || !fs.existsSync(skillMd)) continue;
    const fm = parseFrontmatter(fs.readFileSync(skillMd, "utf8"));
    if (!fm.name || fm.name === "skill-name") continue;
    skills.push({ dir: entry, name: fm.name, description: fm.description || "" });
  }
  skills.sort((a, b) => a.name.localeCompare(b.name));
  return skills;
}

function categoryOf(name) {
  for (const c of CATEGORIES) {
    if (c.skills.includes(name)) return c.name;
  }
  return "未分类";
}

function shortDesc(desc, max = 70) {
  // 按中文句号、英文句号+空格、换行切句；避免 (.docx) 这类点被误切
  const first = desc.split(/\n|。|\.\s/)[0].trim();
  return first.length > max ? first.slice(0, max) + "…" : first;
}

// 升级时保留的用户文件：内置名单（user-config.md）+ 技能目录 .preserve 清单（每行一个文件名，# 注释）
const BUILTIN_PRESERVE = new Set(["user-config.md"]);

function loadPreserveSet(skillDir) {
  const set = new Set(BUILTIN_PRESERVE);
  const pf = path.join(skillDir, ".preserve");
  if (fs.existsSync(pf)) {
    for (const line of fs.readFileSync(pf, "utf8").split(/\r?\n/)) {
      const t = line.trim();
      if (t && !t.startsWith("#")) set.add(t.toLowerCase());
    }
  }
  return set;
}

// 解析 user-config.md 首行 yaml 的 CONFIG_VERSION（缺失视为 0=未声明版本）
function parseUserConfigVersion(file) {
  if (!fs.existsSync(file)) return 0;
  const m = fs.readFileSync(file, "utf8").match(/^CONFIG_VERSION:\s*(\d+)/m);
  return m ? parseInt(m[1], 10) : 0;
}

function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return "" + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "-" + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
}

function copyDir(src, dest, preserve, hits, upstreams) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    if (fs.statSync(s).isDirectory()) copyDir(s, d, preserve, hits, upstreams);
    else if (preserve.has(entry.toLowerCase()) && fs.existsSync(d)) {
      hits.push(d);
      // 配置演进：官方版与本地版内容不同时，另存 .upstream 对照文件，供用户手动合并新配置点
      const sData = fs.readFileSync(s, "utf8");
      const dData = fs.readFileSync(d, "utf8");
      if (sData !== dData) {
        fs.writeFileSync(d + ".upstream", sData);
        upstreams.push(d + ".upstream");
      }
    }
    else fs.copyFileSync(s, d);
  }
}

function ask(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans.trim());
    });
  });
}

// ---------- ls ----------

function cmdLs() {
  const skills = scanSkills();
  if (skills.length === 0) {
    console.log("未发现任何技能。");
    return;
  }
  console.log("\n技能锻造坊 SkillForge · 技能清单\n");
  let idx = 0;
  const mapped = new Set(CATEGORIES.reduce((acc, c) => acc.concat(c.skills), []));
  for (const cat of CATEGORIES) {
    const list = cat.skills.map((n) => skills.find((s) => s.name === n)).filter(Boolean);
    if (list.length === 0) continue;
    console.log(`【${cat.name} ${cat.en}】`);
    for (const s of list) {
      idx++;
      console.log(`  [${idx}] ${s.name.padEnd(16)} ${shortDesc(s.description)}`);
    }
    console.log("");
  }
  const rest = skills.filter((s) => !mapped.has(s.name));
  if (rest.length > 0) {
    console.log("【未分类】");
    for (const s of rest) {
      idx++;
      console.log(`  [${idx}] ${s.name.padEnd(16)} ${shortDesc(s.description)}`);
    }
    console.log("");
  }
  console.log(`共 ${skills.length} 件技能。安装：skill-forge init\n`);
}

// ---------- init ----------

function detectTargetDirs() {
  const found = [];
  for (const dir of KNOWN_SKILL_DIRS) {
    const p = expandHome(dir);
    if (fs.existsSync(p)) found.push(p);
  }
  return found;
}

async function selectSkillsInteractive(skills) {
  const numbered = [];
  const mapped = new Set(CATEGORIES.reduce((acc, c) => acc.concat(c.skills), []));
  let text = "\n可选技能（编号多选，逗号分隔；a=全选；q=退出）：\n\n";
  for (const cat of CATEGORIES) {
    const list = cat.skills.map((n) => skills.find((s) => s.name === n)).filter(Boolean);
    if (list.length === 0) continue;
    text += `【${cat.name} ${cat.en}】\n`;
    for (const s of list) {
      numbered.push(s);
      text += `  [${numbered.length}] ${s.name.padEnd(16)} ${shortDesc(s.description)}\n`;
    }
    text += "\n";
  }
  const rest = skills.filter((s) => !mapped.has(s.name));
  if (rest.length > 0) {
    text += "【未分类】\n";
    for (const s of rest) {
      numbered.push(s);
      text += `  [${numbered.length}] ${s.name.padEnd(16)} ${shortDesc(s.description)}\n`;
    }
    text += "\n";
  }
  console.log(text);
  const ans = await ask("你的选择：");
  if (/^q$/i.test(ans)) return [];
  if (/^a$/i.test(ans)) return skills;
  const chosen = [];
  for (const part of ans.split(/[,，\s]+/)) {
    if (!part) continue;
    const i = parseInt(part, 10);
    if (!isNaN(i) && i >= 1 && i <= numbered.length && !chosen.includes(numbered[i - 1])) {
      chosen.push(numbered[i - 1]);
    }
  }
  return chosen;
}

// 解析目标技能目录（--target 优先，否则自动探测；失败返回 null）
async function resolveTarget(argv, cmd) {
  if (argv.target) return expandHome(argv.target);
  const detected = detectTargetDirs();
  if (detected.length === 1) {
    console.log(`检测到技能目录：${detected[0]}`);
    return detected[0];
  }
  if (detected.length > 1 && process.stdin.isTTY) {
    console.log("检测到多个技能目录：");
    detected.forEach((d, i) => console.log(`  [${i + 1}] ${d}`));
    const ans = await ask("选择目标目录编号（回车取第一个）：");
    const i = parseInt(ans, 10) - 1;
    return detected[isNaN(i) || i < 0 || i >= detected.length ? 0 : i];
  }
  if (detected.length > 1) {
    console.log(`检测到多个技能目录，非交互环境取第一个：${detected[0]}`);
    return detected[0];
  }
  console.log("未检测到常见 AI 助手的技能目录。");
  console.log(`请用 --target 指定，例如：skill-forge ${cmd} --target ~/.claude/skills`);
  return null;
}

// 升级单个技能：配置版本感知（官方 CONFIG_VERSION > 本地时备份并询问），返回展示注记
async function upgradeSkill(src, dest, argv, existed) {
  const hits = [];
  const upstreams = [];
  let mode = "preserve"; // preserve=保留我的 | official=官方覆盖 | later=稍后处理
  let bakFile = null;

  const officialCfg = path.join(src, "user-config.md");
  const localCfg = path.join(dest, "user-config.md");
  if (existed && fs.existsSync(officialCfg) && fs.existsSync(localCfg)) {
    const officialVer = parseUserConfigVersion(officialCfg);
    const localVer = parseUserConfigVersion(localCfg);
    if (officialVer > localVer) {
      bakFile = localCfg + ".bak-" + stamp();
      fs.copyFileSync(localCfg, bakFile);
      console.log(`\n⚠️  ${path.basename(dest)} 配置结构升级：官方 v${officialVer} > 你的 v${localVer}`);
      console.log(`   已备份你的配置：${path.basename(bakFile)}`);
      if (process.stdin.isTTY && !argv.yes) {
        console.log("   [1] 官方覆盖 —— 用官方新配置替换（旧配置在备份中，随时找回）");
        console.log("   [2] 保留我的 —— 不覆盖，官方新配置另存 .upstream 对照（默认）");
        console.log("   [3] 稍后处理 —— 本次只升级技能文件，配置改天自己合并");
        const ans = await ask("   你的选择（回车默认 2）：");
        if (ans === "1") mode = "official";
        else if (ans === "3") mode = "later";
      } else {
        console.log("   非交互/--yes：默认保留你的配置，官方新版另存 .upstream 对照");
      }
    }
  }

  if (mode === "official") fs.unlinkSync(localCfg); // 备份已做，移除后 copyDir 正常覆盖
  copyDir(src, dest, loadPreserveSet(src), hits, upstreams);

  let note = existed ? "已更新" : "已安装";
  if (mode === "official") {
    note += `（已用官方配置覆盖，你的旧配置备份在 ${path.basename(bakFile)}）`;
  } else if (bakFile) {
    const ups = upstreams.map((u) => path.basename(u)).join("、");
    note += `（配置结构有变：你的配置已备份 ${path.basename(bakFile)}` +
      (ups ? ` + 官方版对照 ${ups}` : "") + "，请手动合并）";
  } else {
    if (hits.length > 0) {
      const names = hits.map((h) => path.basename(h)).join("、");
      note += `（保留你的本地修改未覆盖：${names}）`;
    }
    if (upstreams.length > 0) {
      const names = upstreams.map((u) => path.basename(u)).join("、");
      note += `；官方配置有更新，已另存对照文件：${names}（可手动合并新配置点）`;
    }
  }
  return note;
}

async function cmdInit(argv) {
  const skills = scanSkills();
  if (skills.length === 0) {
    console.log("未发现任何技能。");
    return;
  }

  // 1. 目标目录
  const target = await resolveTarget(argv, "init");
  if (!target) return;

  // 2. 选择技能
  let chosen;
  if (argv.skills) {
    const wanted = argv.skills.split(",").map((x) => x.trim());
    chosen = skills.filter((s) => wanted.includes(s.name));
    if (chosen.length === 0) {
      console.log(`错误：--skills 指定的技能不存在。可用技能：${skills.map((s) => s.name).join(", ")}`);
      process.exit(1);
    }
  } else if (process.stdin.isTTY) {
    chosen = await selectSkillsInteractive(skills);
    if (chosen.length === 0) {
      console.log("未选择任何技能，退出。");
      return;
    }
  } else {
    console.log("错误：非交互环境必须显式指定 --skills，例如：--skills daily-report,weekly-report");
    process.exit(1);
  }

  // 3. 确认
  if (!argv.yes) {
    console.log(`\n将安装 ${chosen.length} 件技能到：${target}`);
    chosen.forEach((s) => console.log(`  - ${s.name}`));
    if (process.stdin.isTTY) {
      const ans = await ask("确认安装？（y/N）：");
      if (!/^y/i.test(ans)) {
        console.log("已取消。");
        return;
      }
    }
  }

  // 4. 复制（已存在的走版本感知升级）
  for (const s of chosen) {
    const src = path.join(PKG_DIR, s.dir);
    const dest = path.join(target, s.dir);
    const note = await upgradeSkill(src, dest, argv, fs.existsSync(dest));
    console.log(`${note}：${s.name} → ${dest}`);
  }
  console.log(`\n完成。共 ${chosen.length} 件技能。`);
}

// ---------- update ----------

async function cmdUpdate(argv) {
  const skills = scanSkills();
  if (skills.length === 0) {
    console.log("未发现任何技能。");
    return;
  }

  // 1. 目标目录
  const target = await resolveTarget(argv, "update");
  if (!target) return;

  // 2. 已安装技能 = 目标目录下存在同名目录且带 SKILL.md
  let installed = [];
  for (const s of skills) {
    if (fs.existsSync(path.join(target, s.dir, "SKILL.md"))) installed.push(s);
  }
  if (argv.skills) {
    const wanted = argv.skills.split(",").map((x) => x.trim());
    installed = installed.filter((s) => wanted.includes(s.name));
    if (installed.length === 0) {
      console.log(`错误：目标目录没有已安装的指定技能。可用 --skills 仅限已装技能，请先 init。`);
      process.exit(1);
    }
  }
  if (installed.length === 0) {
    console.log(`目标目录没有已安装的 SkillForge 技能，请先 init。`);
    return;
  }

  // 3. 确认
  if (!argv.yes) {
    console.log(`\n将升级 ${installed.length} 件技能：`);
    installed.forEach((s) => console.log(`  - ${s.name}`));
    if (process.stdin.isTTY) {
      const ans = await ask("确认升级？（y/N）：");
      if (!/^y/i.test(ans)) {
        console.log("已取消。");
        return;
      }
    }
  }

  // 4. 逐个升级（配置版本感知）
  for (const s of installed) {
    const src = path.join(PKG_DIR, s.dir);
    const dest = path.join(target, s.dir);
    const note = await upgradeSkill(src, dest, argv, true);
    console.log(`${note}：${s.name} → ${dest}`);
  }
  console.log(`\n完成。共升级 ${installed.length} 件技能。`);
}

// ---------- 入口 ----------

function printHelp() {
  console.log(`技能锻造坊 SkillForge v${VERSION}

用法：
  skill-forge ls                      列出全部技能（分类 + 名称 + 说明）
  skill-forge init                    交互式挑选技能并安装到 AI 助手技能目录
  skill-forge update                  升级已安装技能（配置版本感知，默认全部已装技能）
  skill-forge update --skills a,b     只升级指定技能
  skill-forge init --target <目录>    指定技能目录（默认自动探测常见助手目录）
  skill-forge init --skills a,b       跳过选择，直接安装指定技能（适合脚本）
  skill-forge init --yes              跳过确认，直接安装
  skill-forge --version               显示版本

升级保护（init/update 均生效）：
  · 目标目录已存在的 user-config.md（及技能 .preserve 清单声明的文件）不会被覆盖
  · 官方 user-config.md 的 CONFIG_VERSION 高于你的本地版本（配置结构变化）时：
    先备份你的配置为 user-config.md.bak-<时间戳>，再询问三选一——
    [1] 官方覆盖（备份在侧，随时找回）/ [2] 保留我的 + 官方版另存 .upstream 对照（默认）
    [3] 稍后处理；--yes 或非交互时默认 [2]

示例：
  skill-forge ls
  skill-forge init
  skill-forge init --target ~/.claude/skills --skills daily-report,weekly-report`);
}

function parseArgs(args) {
  const argv = { target: null, skills: null, yes: false };
  const rest = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--target" || a === "-t") argv.target = args[++i];
    else if (a.startsWith("--target=")) argv.target = a.slice(9);
    else if (a === "--skills" || a === "-s") argv.skills = args[++i];
    else if (a.startsWith("--skills=")) argv.skills = a.slice(9);
    else if (a === "--yes" || a === "-y") argv.yes = true;
    else rest.push(a);
  }
  return { argv, rest };
}

async function main() {
  const { argv, rest } = parseArgs(process.argv.slice(2));
  const cmd = rest[0];
  if (!cmd) return printHelp();
  if (cmd === "ls" || cmd === "list") return cmdLs();
  if (cmd === "init" || cmd === "install") return cmdInit(argv);
  if (cmd === "update" || cmd === "upgrade") return cmdUpdate(argv);
  if (cmd === "--version" || cmd === "-v" || cmd === "version") {
    console.log(VERSION);
    return;
  }
  if (cmd === "--help" || cmd === "-h" || cmd === "help") return printHelp();
  printHelp();
}

main().catch((e) => {
  console.error("出错了：", e.message);
  process.exit(1);
});
