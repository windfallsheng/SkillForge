#!/usr/bin/env node
"use strict";
/**
 * SkillForge CLI —— 技能锻造坊安装器
 *
 *   skill-forge ls     列出全部技能（分类 + 名称 + 说明）
 *   skill-forge init   交互式挑选技能，装进 AI 助手的技能目录
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

function copyDir(src, dest, preserve, hits) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    if (fs.statSync(s).isDirectory()) copyDir(s, d, preserve, hits);
    else if (preserve.has(entry.toLowerCase()) && fs.existsSync(d)) hits.push(d);
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

async function cmdInit(argv) {
  const skills = scanSkills();
  if (skills.length === 0) {
    console.log("未发现任何技能。");
    return;
  }

  // 1. 目标目录
  let target = argv.target ? expandHome(argv.target) : null;
  if (!target) {
    const detected = detectTargetDirs();
    if (detected.length === 1) {
      target = detected[0];
      console.log(`检测到技能目录：${target}`);
    } else if (detected.length > 1 && process.stdin.isTTY) {
      console.log("检测到多个技能目录：");
      detected.forEach((d, i) => console.log(`  [${i + 1}] ${d}`));
      const ans = await ask("选择目标目录编号（回车取第一个）：");
      const i = parseInt(ans, 10) - 1;
      target = detected[isNaN(i) || i < 0 || i >= detected.length ? 0 : i];
    } else if (detected.length > 1) {
      target = detected[0];
      console.log(`检测到多个技能目录，非交互环境取第一个：${target}`);
    } else {
      console.log("未检测到常见 AI 助手的技能目录。");
      console.log("请用 --target 指定，例如：skill-forge init --target ~/.claude/skills");
      return;
    }
  }

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

  // 4. 复制
  for (const s of chosen) {
    const src = path.join(PKG_DIR, s.dir);
    const dest = path.join(target, s.dir);
    const existed = fs.existsSync(dest);
    const hits = [];
    copyDir(src, dest, loadPreserveSet(src), hits);
    let note = existed ? "已更新" : "已安装";
    if (hits.length > 0) {
      const names = hits.map((h) => path.basename(h)).join("、");
      note += `（保留你的本地修改未覆盖：${names}）`;
    }
    console.log(`${note}：${s.name} → ${dest}`);
  }
  console.log(`\n完成。共 ${chosen.length} 件技能。`);
}

// ---------- 入口 ----------

function printHelp() {
  console.log(`技能锻造坊 SkillForge v${VERSION}

用法：
  skill-forge ls                      列出全部技能（分类 + 名称 + 说明）
  skill-forge init                    交互式挑选技能并安装到 AI 助手技能目录
  skill-forge init --target <目录>    指定技能目录（默认自动探测常见助手目录）
  skill-forge init --skills a,b       跳过选择，直接安装指定技能（适合脚本）
  skill-forge init --yes              跳过确认，直接安装
  skill-forge --version               显示版本

升级保护：目标目录已存在的 user-config.md（及技能 .preserve 清单声明的文件）不会被覆盖，你的本地配置永久保留

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
