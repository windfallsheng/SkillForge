#!/usr/bin/env node
"use strict";
/**
 * SkillForge CLI —— 技能锻造坊安装器
 *
 *   skill-forge ls       列出全部技能（分类 + 名称 + 说明）
 *   skill-forge init     交互式挑选技能，装进 AI 助手的技能目录
 *   skill-forge update   升级已安装技能（无参数时列出已装清单：a=全部 / 编号
 *                        挑部分升级；配置版本感知：官方配置结构变化时
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
  { name: "报表汇演", en: "Reports", skills: ["daily-report", "weekly-report", "monthly-report", "quarterly-report", "annual-report", "team-report-collector"] },
  { name: "文档装裱", en: "Documents", skills: ["article-to-html", "twin-docs", "one-pager"] },
  { name: "工程提效", en: "Engineering", skills: ["spec-doc2spec", "spec-spec2doc", "release-notes"] },
  { name: "演示汇演", en: "Slides", skills: ["magic-deck", "deck-stage"] },
  { name: "数据整备", en: "Data", skills: ["data-prepper", "commit-heatmap"] },
  { name: "沟通协作", en: "Communication", skills: ["meeting-minutes", "prompt-pouch", "decision-log"] },
  { name: "技能自造", en: "Meta", skills: ["meta-forge", "skill-doctor"] },
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

// 复制时排除的杂质（macOS 元数据 / 嵌套版本库目录）
const COPY_EXCLUDE = new Set([".ds_store", ".git"]);

// 安装清单：记录上次安装的官方文件（相对路径）。升级清理只删清单内官方已删除的文件，
// 用户自建文件与清单外文件一律不动（无清单 = 旧版本安装，跳过清理，升级后补写）
const MANIFEST_FILE = ".installed-manifest";

function loadManifest(dest) {
  const set = new Set();
  const mf = path.join(dest, MANIFEST_FILE);
  if (fs.existsSync(mf)) {
    for (const line of fs.readFileSync(mf, "utf8").split(/\r?\n/)) {
      const t = line.trim();
      if (t && !t.startsWith("#")) set.add(t.toLowerCase());
    }
  }
  return set;
}

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

// 复制官方技能文件；files 收集相对路径清单（供 .installed-manifest 安装清单）
function copyDir(src, dest, preserve, hits, upstreams, genUpstream, rel, files) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    if (COPY_EXCLUDE.has(entry.toLowerCase())) continue; // 跳过 .DS_Store 等杂质
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    const r = rel ? rel + "/" + entry : entry;
    if (fs.statSync(s).isDirectory()) copyDir(s, d, preserve, hits, upstreams, genUpstream, r, files);
    else {
      files.push(r);
      if (preserve.has(entry.toLowerCase()) && fs.existsSync(d)) {
        hits.push(d);
        // 配置演进：官方版与本地版内容不同时，另存 user-config.upstream.md 对照文件（.md 结尾双击即开），供用户手动合并新配置点
        const sData = fs.readFileSync(s, "utf8");
        const dData = fs.readFileSync(d, "utf8");
        if (sData !== dData) {
          if (genUpstream !== false) {
            const upFile = d.replace(/\.md$/i, "") + ".upstream.md"; // 保留 .md 结尾，双击即开
            fs.writeFileSync(upFile, sData);
            upstreams.push(upFile);
          }
        } else {
          // 内容已一致（用户已手动合并或本就相同），旧对照文件已无意义
          try { fs.unlinkSync(d.replace(/\.md$/i, "") + ".upstream.md"); } catch (e) {}
        }
      }
      else fs.copyFileSync(s, d);
    }
  }
}

// 升级前清理：删除官方已移除的文件（仅限安装清单内记录过的官方文件，用户自建文件不受影响）
// 保护：preserve 清单文件、.upstream 对照、.bak- 备份、node_modules 依赖、安装清单、COPY_EXCLUDE 项一律不动
function pruneDir(src, dest, preserve, manifest, rel) {
  if (!fs.existsSync(dest) || manifest.size === 0) return; // 无清单（旧版本安装）跳过清理
  for (const entry of fs.readdirSync(dest)) {
    const lower = entry.toLowerCase();
    if (COPY_EXCLUDE.has(lower)) continue;
    if (lower === "node_modules" || lower === MANIFEST_FILE || lower.includes(".upstream") || lower.includes(".bak-")) continue;
    if (preserve.has(lower)) continue; // 用户文件永不删除
    const d = path.join(dest, entry);
    const s = path.join(src, entry);
    const r = rel ? rel + "/" + entry : entry;
    if (fs.statSync(d).isDirectory()) {
      pruneDir(s, d, preserve, manifest, r);
      if (fs.readdirSync(d).length === 0) fs.rmdirSync(d); // 清空后的目录一并删除
    } else if (!fs.existsSync(s) && manifest.has(r.toLowerCase())) {
      fs.unlinkSync(d);
    }
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

async function selectSkillsInteractive(skills, target) {
  const numbered = [];
  const mapped = new Set(CATEGORIES.reduce((acc, c) => acc.concat(c.skills), []));
  const isInstalled = (s) => fs.existsSync(path.join(target, s.dir, "SKILL.md"));
  let installedCount = 0;
  let text = "\n可选技能（a=全部安装；编号挑选，逗号分隔，如 1,3；q=退出）：\n\n";
  const render = (s) => {
    numbered.push(s);
    const installed = isInstalled(s);
    if (installed) installedCount++;
    text += `  [${numbered.length}] ${s.name.padEnd(16)} ${(installed ? "★已装" : "").padEnd(8)}${shortDesc(s.description)}\n`;
  };
  for (const cat of CATEGORIES) {
    const list = cat.skills.map((n) => skills.find((s) => s.name === n)).filter(Boolean);
    if (list.length === 0) continue;
    text += `【${cat.name} ${cat.en}】\n`;
    for (const s of list) render(s);
    text += "\n";
  }
  const rest = skills.filter((s) => !mapped.has(s.name));
  if (rest.length > 0) {
    text += "【未分类】\n";
    for (const s of rest) render(s);
    text += "\n";
  }
  text += `共 ${skills.length} 件技能，目标目录已装 ${installedCount} 件（★ 标注，重选已装=升级）\n`;
  console.log(text);
  const ans = await ask("你的选择：");
  if (/^q$/i.test(ans)) return [];
  if (/^a$/i.test(ans)) return numbered; // 全选返回清单展示顺序，与编号一致
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

// 交互挑选已安装技能：a=全部升级 / 编号挑选（逗号分隔，如 1,3）/ q=退出
async function selectInstalledInteractive(installed) {
  let text = "\n已安装技能（a=全部升级；编号挑选，逗号分隔，如 1,3；q=退出）：\n\n";
  installed.forEach((s, i) => {
    text += `  [${i + 1}] ${s.name.padEnd(16)}${shortDesc(s.description)}\n`;
  });
  text += `\n共 ${installed.length} 件已安装技能\n`;
  console.log(text);
  const ans = await ask("你的选择：");
  if (/^q$/i.test(ans)) return [];
  if (/^a$/i.test(ans)) return installed; // 全部升级
  const chosen = [];
  for (const part of ans.split(/[,，\s]+/)) {
    if (!part) continue;
    const i = parseInt(part, 10);
    if (!isNaN(i) && i >= 1 && i <= installed.length && !chosen.includes(installed[i - 1])) {
      chosen.push(installed[i - 1]);
    }
  }
  if (chosen.length === 0) {
    console.log("未识别任何编号，已取消。");
    return [];
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
      bakFile = localCfg.replace(/\.md$/i, "") + ".bak-" + stamp() + ".md"; // 保留 .md 结尾，双击即开
      fs.copyFileSync(localCfg, bakFile);
      console.log(`\n⚠️  ${path.basename(dest)} 配置结构升级：官方 v${officialVer} > 你的 v${localVer}`);
      console.log(`   已备份你的配置：${path.basename(bakFile)}`);
      if (process.stdin.isTTY && !argv.yes) {
        console.log("   [1] 官方覆盖 —— 用官方新配置替换（旧配置在备份中，随时找回）");
        console.log("   [2] 保留我的 —— 不覆盖，官方新配置另存 user-config.upstream.md 对照（默认）");
        console.log("   [3] 稍后处理 —— 本次只升级技能文件，不生成对照文件，配置改天自己合并");
        const ans = await ask("   你的选择（回车默认 2）：");
        if (ans === "1") mode = "official";
        else if (ans === "3") mode = "later";
      } else {
        console.log("   非交互/--yes：默认保留你的配置，官方新版另存 user-config.upstream.md 对照");
      }
    }
  }

  if (mode === "official") {
    fs.unlinkSync(localCfg); // 备份已做，移除后 copyDir 正常覆盖
    try { fs.unlinkSync(localCfg.replace(/\.md$/i, "") + ".upstream.md"); } catch (e) {} // 旧对照已无意义，清理
  }
  const preserve = loadPreserveSet(src);
  const manifest = loadManifest(dest);
  if (existed) pruneDir(src, dest, preserve, manifest); // 先清理官方已删除的文件（仅限安装清单内），再复制
  const officialFiles = [];
  copyDir(src, dest, preserve, hits, upstreams, mode !== "later", "", officialFiles); // [3] 稍后处理不生成对照文件
  // 写安装清单：本次复制的官方文件（相对路径），下次升级据此精准清理官方已删文件，用户自建文件不受影响
  officialFiles.sort((a, b) => a.localeCompare(b));
  fs.writeFileSync(path.join(dest, MANIFEST_FILE),
    "# SkillForge 安装清单：本次安装的官方文件（相对路径）\n" +
    "# 升级清理仅限本清单内官方已删除的文件，用户自建文件不受影响\n" +
    officialFiles.join("\n") + "\n");

  // 依赖提示：技能自带 package.json（如 deck-stage 依赖 PptxGenJS）且目标无 node_modules 时
  // （本地仓库直装会连带复制 node_modules 离线可用；npm 全局装出的包不含 node_modules）
  let depNote = "";
  if (fs.existsSync(path.join(dest, "package.json")) && !fs.existsSync(path.join(dest, "node_modules"))) {
    depNote = `（缺依赖：cd ${dest} && npm install）`;
  }

  let note = existed ? "已更新" : "已安装";
  if (mode === "official") {
    note += `（已用官方配置覆盖，你的旧配置备份在 ${path.basename(bakFile)}）`;
  } else if (mode === "later") {
    note += `（配置结构有变：你的配置已备份 ${path.basename(bakFile)}，本次未生成对照文件，请稍后自行合并）`;
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
  if (depNote) note += depNote;
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
    chosen = await selectSkillsInteractive(skills, target);
    if (chosen.length === 0) {
      console.log("未选择任何技能，退出。");
      return;
    }
  } else {
    console.log("错误：非交互环境必须显式指定 --skills，例如：--skills daily-report,weekly-report");
    process.exit(1);
  }

  // 3. 确认（已装技能分组提示：默认升级保留本地配置，可 s 跳过已装只装新）
  const already = chosen.filter((s) => fs.existsSync(path.join(target, s.dir, "SKILL.md")));
  if (!argv.yes) {
    console.log(`\n将安装 ${chosen.length} 件技能到：${target}`);
    chosen.filter((s) => !already.includes(s)).forEach((s) => console.log(`  ＋ ${s.name}`));
    if (already.length > 0) {
      already.forEach((s) => console.log(`  ↻ ${s.name}（已装，将升级到官方最新）`));
      console.log("   升级保留你的 user-config.md 等本地文件；配置结构变化时自动备份后询问。");
    }
    if (process.stdin.isTTY) {
      if (already.length > 0) {
        const ans = await ask("确认安装？（y=全部 / s=跳过已装只装新 / N=取消）：");
        if (/^s$/i.test(ans)) {
          chosen = chosen.filter((s) => !already.includes(s));
          if (chosen.length === 0) {
            console.log("已装技能全部跳过，没有新技能可装。");
            return;
          }
          console.log(`已跳过 ${already.length} 件已装技能，仅安装 ${chosen.length} 件新技能。`);
        } else if (!/^y/i.test(ans)) {
          console.log("已取消。");
          return;
        }
      } else {
        const ans = await ask("确认安装？（y/N）：");
        if (!/^y/i.test(ans)) {
          console.log("已取消。");
          return;
        }
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
    const unknown = wanted.filter((n) => !skills.some((s) => s.name === n));
    const notInstalled = wanted.filter(
      (n) =>
        skills.some((s) => s.name === n) && !installed.some((s) => s.name === n)
    );
    if (unknown.length) {
      console.log(
        `错误：仓库中不存在这些技能：${unknown.join(", ")}。可用技能：${skills.map((s) => s.name).join(", ")}`
      );
      process.exit(1);
    }
    if (notInstalled.length) {
      console.log(`提示：以下技能尚未安装到目标目录，本次跳过：${notInstalled.join(", ")}`);
    }
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

  // 2.5 无 --skills 且交互环境：列出已装清单，a=全部 / 编号挑部分升级
  let picked = false;
  if (!argv.skills && !argv.yes && process.stdin.isTTY) {
    installed = await selectInstalledInteractive(installed);
    if (installed.length === 0) {
      console.log("已取消。");
      return;
    }
    picked = true; // 清单选定即确认，不再重复询问
  }

  // 3. 确认
  if (!argv.yes && !picked) {
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
  skill-forge init                    列清单交互挑选：a=全部安装 / 编号挑选（已装标 ★，确认时可跳过已装）
  skill-forge update                  升级已安装技能（无参数时列出已装清单：a=全部 / 编号挑部分升级）
  skill-forge update --skills a,b     只升级指定技能（未安装的提示跳过）
  skill-forge update --yes            跳过清单与确认，直接升级全部已装技能（脚本友好）
  skill-forge init --target <目录>    指定技能目录（默认自动探测常见助手目录）
  skill-forge init --skills a,b       跳过选择，直接安装/升级指定技能（适合脚本与单件补装）
  skill-forge init --yes              跳过确认，直接安装
  skill-forge --version               显示版本

升级保护（init/update 均生效）：
  · 目标目录已存在的 user-config.md（及技能 .preserve 清单声明的文件）不会被覆盖
  · 官方 user-config.md 的 CONFIG_VERSION 高于你的本地版本（配置结构变化）时：
    先备份你的配置为 user-config.bak-<时间戳>.md（保留 .md 结尾，双击即开），再询问三选一——
    [1] 官方覆盖（备份在侧，随时找回）/ [2] 保留我的 + 官方版另存 user-config.upstream.md 对照（默认）
    [3] 稍后处理（不生成对照文件）；--yes 或非交互时默认 [2]
  · 升级按 .installed-manifest 安装清单同步官方文件增删：只清理清单内官方已删除的文件，
    用户自建文件不动；旧版本安装无清单时跳过清理，升级后补写

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
