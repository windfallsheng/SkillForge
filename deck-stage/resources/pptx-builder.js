#!/usr/bin/env node
/**
 * pptx-builder.js — 登台 deck-stage 生成器（真相源）
 * 用法: node pptx-builder.js --data <data.json> --out <输出.pptx>
 * 读 data.json（schema 见 data-schema.md），按页类型渲染 16:9 pptx。
  * 主题五套与报告 HTML 深蓝面板体系同源：tech 深蓝科技（默认）/ biz 浅色商务 / mono IDEA 黑亮 / light IDEA 白亮 / warm 温暖渐变。
 * 依赖: pptxgenjs（本 skill 目录 node_modules，离线可用）。
 */
'use strict';

const path = require('path');
const PptxGenJS = require('pptxgenjs');
let SHAPES, CHART_TYPES;   // pptxgenjs 4.x: ShapeType/ChartType 是实例属性，main 里赋值

/* ── 主题令牌（与报告 HTML CSS 变量同源） ─────────────────────────── */
const THEMES = {
  tech: { bg: '0A1929', panel: '0B1E37', panelLine: '0F3350', text: 'E6F1FF', muted: '8892B0',
          accent: '38BDF8', accent2: '0EA5E9', border: '1E3A5F', soft: '12263F', up: '34D399', down: 'FB7185' },
  biz:  { bg: 'FFFFFF', panel: 'F8FAFC', panelLine: 'E2E8F0', text: '0F172A', muted: '64748B',
          accent: '2563EB', accent2: '1D4ED8', border: 'E2E8F0', soft: 'F1F5F9', up: '059669', down: 'E11D48' },
  mono: { bg: 'FFFFFF', panel: 'FFFFFF', panelLine: 'D4D4D4', text: '111111', muted: '666666',
          accent: '000000', accent2: '333333', border: 'CCCCCC', soft: 'F5F5F5', up: '059669', down: 'DC2626' },
  warm: { bg: '1C0F0F', panel: '2A1717', panelLine: '4A2F1F', text: 'FFF1E6', muted: 'C4A98F',
          accent: 'FDBA74', accent2: 'F97316', border: '4A2F1F', soft: '33201A', up: '4ADE80', down: 'FDA4AF' }
};

/* 五段卡片节色（与年报同款） */
const SECTION_COLORS = {
  blue:   { c: '38BDF8', c2: '0EA5E9' },
  green:  { c: '5EEAD4', c2: '14B8A6' },
  purple: { c: 'A5B4FC', c2: '6366F1' },
  rose:   { c: 'FDA4AF', c2: 'E11D48' },
  orange: { c: 'FDBA74', c2: 'F97316' }
};

const FONT = 'Microsoft YaHei';
const PW = 13.33, PH = 7.5;          // 16:9 英寸
const MARGIN_L = 0.85;                // 内容左边距（节色竖线在 0.5）
const CONTENT_W = PW - MARGIN_L - 0.35;

/* ── CLI ─────────────────────────────────────────────────────────── */
function parseArgs(argv) {
  const o = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--data' && argv[i + 1]) o.data = argv[++i];
    else if (argv[i] === '--out' && argv[i + 1]) o.out = argv[++i];
  }
  if (!o.data || !o.out) {
    console.error('用法: node pptx-builder.js --data <data.json> --out <输出.pptx>');
    process.exit(1);
  }
  return o;
}

/* ── 工具函数 ────────────────────────────────────────────────────── */
function section(name) {
  return SECTION_COLORS[name] || SECTION_COLORS.blue;
}

/* 页面壳：背景 + 页脚 + 节色竖线 */
function shell(slide, t, colorName, footer) {
  slide.background = { color: t.bg };
  // 左侧节色竖线（贯穿整页，同色光晕）
  slide.addShape(SHAPES.rect, {
    x: 0.5, y: 0.72, w: 0.075, h: PH - 1.44, fill: { color: section(colorName).c }, line: { color: section(colorName).c, width: 0 }
  });
  slide.addShape(SHAPES.rect, {
    x: 0.46, y: 0.68, w: 0.155, h: PH - 1.36, fill: { color: section(colorName).c, transparency: 82 }, line: { color: section(colorName).c, width: 0 }
  });
  // 页脚
  if (footer) {
    slide.addText(footer, { x: 7.3, y: PH - 0.42, w: PW - 7.7, h: 0.3, fontSize: 9, color: t.muted, fontFace: FONT, align: 'right', valign: 'middle' });
  }
}

/* 页标题（节色 + 微光晕） */
function pageTitle(slide, t, colorName, text) {
  const c = section(colorName).c;
  slide.addText(text, {
    x: MARGIN_L, y: 0.42, w: CONTENT_W, h: 0.6, fontSize: 25, bold: true, color: c, fontFace: FONT, valign: 'middle',
    shadow: { type: 'outer', color: c, blur: 9, offset: 0, angle: 90, opacity: 0.55 }
  });
}

/* 圆角卡片（panel 底 + 细描边） */
function roundCard(slide, t, x, y, w, h, opts) {
  opts = opts || {};
  slide.addShape(SHAPES.roundRect, {
    x, y, w, h, rectRadius: 0.07,
    fill: { color: opts.fill || t.panel },
    line: { color: opts.line || t.panelLine, width: 1 },
    shadow: opts.noShadow ? undefined : { type: 'outer', color: '000000', blur: 6, offset: 2, angle: 90, opacity: 0.35 }
  });
}

/* 序号圆球徽章（径向受光模拟：主圆 + 左上高光点 + 外光晕） */
function badge(slide, t, colorName, x, y, d, num) {
  const c = section(colorName).c, c2 = section(colorName).c2;
  slide.addShape(SHAPES.ellipse, { x: x - 0.055, y: y - 0.055, w: d + 0.11, h: d + 0.11, fill: { color: c, transparency: 72 }, line: { color: c, width: 0 } });
  slide.addShape(SHAPES.ellipse, { x, y, w: d, h: d, fill: { color: c2 }, line: { color: c, width: 0.75 } });
  slide.addShape(SHAPES.ellipse, { x: x + d * 0.22, y: y + d * 0.16, w: d * 0.3, h: d * 0.22, fill: { color: c, transparency: 38 }, line: { color: c, width: 0 } });
  slide.addText(String(num), { x, y, w: d, h: d, fontSize: 13, bold: true, color: 'FFFFFF', fontFace: FONT, align: 'center', valign: 'middle' });
}

/* 时间线节点圆 */
function timelineDot(slide, colorName, x, y) {
  const c = section(colorName).c;
  slide.addShape(SHAPES.ellipse, { x: x - 0.08, y: y - 0.08, w: 0.32, h: 0.32, fill: { color: c, transparency: 75 }, line: { color: c, width: 0 } });
  slide.addShape(SHAPES.ellipse, { x, y, w: 0.16, h: 0.16, fill: { color: c }, line: { color: c, width: 0 } });
}

/* ── 页渲染 ──────────────────────────────────────────────────────── */

/* 整页铺图（封面/结尾截图） */
function renderCoverImage(slide, page) {
  slide.addImage({ path: page.image, x: 0, y: 0, w: PW, h: PH });
}

/* 概览页：标题 + TL;DR + 数据卡横排 */
function renderOverview(slide, t, page, meta) {
  shell(slide, t, page.color || 'blue', meta.footer);
  pageTitle(slide, t, page.color || 'blue', page.title || '概览');
  if (page.tlDr) {
    slide.addText(page.tlDr, { x: MARGIN_L, y: 1.06, w: CONTENT_W, h: 0.4, fontSize: 12.5, color: t.muted, fontFace: FONT, valign: 'middle' });
  }
  const stats = (page.stats || []).slice(0, 6);
  const n = stats.length;
  if (n === 0) return;
  const gap = 0.3;
  const cardW = (CONTENT_W - gap * (n - 1)) / n;
  const cardY = 1.72, cardH = 1.62;
  stats.forEach((s, i) => {
    const x = MARGIN_L + i * (cardW + gap);
    roundCard(slide, t, x, cardY, cardW, cardH);
    // 卡左侧节色小条
    slide.addShape(SHAPES.rect, {
      x: x + 0.12, y: cardY + 0.22, w: 0.05, h: cardH - 0.44, fill: { color: section(page.color || 'blue').c }, line: { color: section(page.color || 'blue').c, width: 0 }
    });
    slide.addText(String(s.value), { x: x + 0.26, y: cardY + 0.2, w: cardW - 0.4, h: 0.55, fontSize: 27, bold: true, color: section(page.color || 'blue').c, fontFace: FONT });
    slide.addText(s.label, { x: x + 0.26, y: cardY + 0.78, w: cardW - 0.4, h: 0.34, fontSize: 11.5, color: t.muted, fontFace: FONT, valign: 'middle' });
    if (s.delta) {
      const up = s.deltaUp !== false;
      slide.addText(s.delta, { x: x + 0.26, y: cardY + 1.12, w: cardW - 0.4, h: 0.3, fontSize: 10, bold: true, color: up ? t.up : t.down, fontFace: FONT, valign: 'middle' });
    }
  });
}

/* 时间线页：竖线 + 季度节点 + 条目（每页最多 8 条，自动续页） */
function renderTimeline(slide, t, page, meta, items) {
  shell(slide, t, page.color || 'green', meta.footer);
  pageTitle(slide, t, page.color || 'green', page.title || '时间线');
  const LX = 1.32;                       // 竖线 x
  const lineTop = 1.42, lineBottom = PH - 0.62;
  slide.addShape(SHAPES.line, {
    x: LX, y: lineTop, w: 0, h: lineBottom - lineTop, line: { color: section(page.color || 'green').c, width: 2 }
  });
  const maxH = lineBottom - lineTop;
  const n = items.length;
  const blockH = Math.min(maxH / n, 1.24);   // 每条块高
  let y = lineTop + 0.12;
  for (const it of items) {
    const q = it.q || '';
    timelineDot(slide, page.color || 'green', LX - 0.08, y + 0.1);
    if (q) {
      slide.addText(q, { x: 0.5, y: y + 0.02, w: 0.7, h: 0.3, fontSize: 12.5, bold: true, color: section(page.color || 'green').c, fontFace: FONT, align: 'right', valign: 'middle' });
    }
    slide.addText(it.desc, { x: 1.78, y: y - 0.04, w: PW - 2.2, h: 0.5, fontSize: 14.5, color: t.text, fontFace: FONT, valign: 'middle' });
    if (it.metric) {
      slide.addText(it.metric, { x: 1.78, y: y + 0.44, w: PW - 2.2, h: 0.32, fontSize: 11, color: t.muted, fontFace: FONT, valign: 'middle' });
    }
    y += blockH;
  }
}

/* 条目页：序号球 + 标题 + 描述（每页最多 6 条，自动续页；withImage 时右侧配图、文本区缩窄，仅第一页） */
function renderBullets(slide, t, page, meta, items, withImage) {
  shell(slide, t, page.color || 'purple', meta.footer);
  pageTitle(slide, t, page.color || 'purple', page.title || '条目');
  // 右侧配图（contain 等比内嵌，不裁切变形）
  let imgX = PW - 0.4;
  if (withImage && page.image) {
    const imgW = 3.35, imgX0 = PW - 0.5 - imgW, imgY0 = 1.5, imgH0 = PH - 2.15;
    slide.addShape(SHAPES.roundRect, {
      x: imgX0 - 0.1, y: imgY0 - 0.1, w: imgW + 0.2, h: imgH0 + 0.2, rectRadius: 0.06,
      fill: { color: t.panel }, line: { color: t.panelLine, width: 1 },
      shadow: { type: 'outer', color: '000000', blur: 6, offset: 2, angle: 90, opacity: 0.3 }
    });
    slide.addImage({ path: page.image, x: imgX0, y: imgY0, w: imgW, h: imgH0, sizing: { type: 'contain', w: imgW, h: imgH0 } });
    imgX = imgX0 - 0.3;
  }
  const top = 1.55, bottom = PH - 0.7;
  const step = Math.min((bottom - top) / items.length, 1.32);
  let y = top;
  items.forEach((it, i) => {
    const d = 0.42;
    badge(slide, t, page.color || 'purple', MARGIN_L + 0.06, y + 0.04, d, i + 1);
    const tx = MARGIN_L + 0.72;
    const textW = Math.max(imgX - tx - 0.25, 3.5);
    if (typeof it === 'string') it = { t: it };
    if (it.t) {
      slide.addText(it.t, { x: tx, y: y, w: textW, h: 0.42, fontSize: 15, bold: true, color: t.text, fontFace: FONT, valign: 'middle' });
    }
    if (it.d) {
      slide.addText(it.d, { x: tx, y: y + (it.t ? 0.42 : 0.05), w: textW, h: 0.62, fontSize: 12, color: t.muted, fontFace: FONT, valign: 'top' });
    }
    y += step;
  });
}

/* 柱图页：自绘柱（任意数量，自动算宽）+ 数值 + 标签 */
function renderChart(slide, t, page, meta) {
  shell(slide, t, page.color || 'orange', meta.footer);
  pageTitle(slide, t, page.color || 'orange', page.title || '图表');
  const values = (page.values || []).map(Number);
  const labels = page.labels || [];
  if (values.length === 0) return;
  const max = Math.max(...values, 1);
  const plotX = 0.95, plotW = PW - 1.55, plotY = 1.85, plotH = 4.35;
  // 基线
  slide.addShape(SHAPES.line, {
    x: plotX, y: plotY + plotH, w: plotW, h: 0, line: { color: t.border, width: 1.2 }
  });
  const n = values.length;
  const slot = plotW / n;
  const barW = Math.min(0.52, slot * 0.6);
  values.forEach((v, i) => {
    const bh = Math.max((v / max) * plotH, v > 0 ? 0.12 : 0);
    const x = plotX + slot * i + (slot - barW) / 2;
    const y = plotY + plotH - bh;
    const c = section(page.color || 'orange').c;
    // 柱 + 顶高光
    slide.addShape(SHAPES.roundRect, {
      x, y, w: barW, h: bh, rectRadius: 0.045,
      fill: { color: c, transparency: 14 }, line: { color: c, width: 0.75 },
      shadow: { type: 'outer', color: c, blur: 6, offset: 0, angle: 90, opacity: 0.35 }
    });
    slide.addText(String(v), { x: x - 0.15, y: y - 0.3, w: barW + 0.3, h: 0.26, fontSize: 10, bold: true, color: t.text, fontFace: FONT, align: 'center', valign: 'middle' });
    if (labels[i]) {
      slide.addText(labels[i], { x: plotX + slot * i, y: plotY + plotH + 0.1, w: slot, h: 0.3, fontSize: 10.5, color: t.muted, fontFace: FONT, align: 'center', valign: 'middle' });
    }
  });
}

/* 饼图页：原生饼图（可编辑），items=[{label,value}]，page.percent=true 时显示百分比 */
function renderChartPie(slide, t, page, meta, SHAPES_UNUSED) {
  shell(slide, t, page.color || 'green', meta.footer);
  pageTitle(slide, t, page.color || 'green', page.title || '占比');
  const items = (page.items || []).filter(function(i){ return i && Number(i.value) > 0; });
  if (items.length === 0) return;
  const pieData = [{
    name: page.seriesName || '占比',
    labels: items.map(function(i){ return i.label; }),
    values: items.map(function(i){ return Number(i.value); })
  }];
  const palette = ['38BDF8', '5EEAD4', 'A5B4FC', 'FDA4AF', 'FDBA74', '34D399', 'F472B6', 'FBBF24', 'A78BFA', 'F87171'];
  slide.addChart(CHART_TYPES.pie, pieData, {
    x: 1.05, y: 1.35, w: PW - 2.1, h: PH - 2.0,
    chartColors: palette,
    showLegend: true, legendPos: 'r', legendColor: t.muted, legendFontFace: FONT, legendFontSize: 11,
    dataLabelColor: t.text, dataLabelFontFace: FONT, dataLabelFontSize: 10.5,
    showValue: page.percent ? false : true,
    showPercent: !!page.percent,
    showLabel: true,
    dataLabelPosition: 'outEnd',
    holeSize: page.donut ? 45 : 0
  });
}

/* 折线页：原生折线（可编辑），series=[{name,values}] 多线；单线可直接用 values */
function renderChartLine(slide, t, page, meta, SHAPES_UNUSED) {
  shell(slide, t, page.color || 'blue', meta.footer);
  pageTitle(slide, t, page.color || 'blue', page.title || '趋势');
  const labels = page.labels || [];
  let series = page.series;
  if (!series) series = [{ name: page.seriesName || '数值', values: page.values || [] }];
  const c = section(page.color || 'blue').c;
  const chartData = series.map(function(s){ return { name: s.name, labels: labels, values: (s.values || []).map(Number) }; });
  if (chartData.length === 0 || labels.length === 0) return;
  slide.addChart(CHART_TYPES.line, chartData, {
    x: 1.05, y: 1.4, w: PW - 2.1, h: PH - 2.1,
    chartColors: [c, '34D399', 'FBBF24', 'F472B6'],
    lineSize: 2.5, lineSmooth: !!page.smooth,
    showLegend: series.length > 1, legendPos: 'b', legendColor: t.muted, legendFontFace: FONT, legendFontSize: 10.5,
    catAxisLabelColor: t.muted, catAxisLabelFontFace: FONT, catAxisLabelFontSize: 10,
    valAxisLabelColor: t.muted, valAxisLabelFontFace: FONT, valAxisLabelFontSize: 10,
    valGridLine: { color: t.border, style: 'solid', size: 0.5 },
    showValue: false,
    valAxisHidden: false
  });
}

/* 演讲备注：page.notes 写在该类型第一页；page.notesList 数组按分页依次写 */
function addNotesIfAny(slide, page, idx) {
  if (typeof page.notes === 'string' && idx === 0) slide.addNotes(page.notes);
  else if (Array.isArray(page.notesList) && page.notesList[idx]) slide.addNotes(String(page.notesList[idx]));
}

/* ── 主流程 ──────────────────────────────────────────────────────── */
function main() {
  const args = parseArgs(process.argv);
  let data;
  try {
    data = JSON.parse(require('fs').readFileSync(args.data, 'utf8'));
  } catch (e) {
    console.error('data.json 读取/解析失败:', e.message);
    process.exit(1);
  }
  const meta = data.meta || {};
  const theme = THEMES[data.theme] ? data.theme : 'tech';
  const t = THEMES[theme];

  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'WIDE', width: PW, height: PH });
  pptx.layout = 'WIDE';
  SHAPES = pptx.ShapeType;
  CHART_TYPES = pptx.ChartType;
  pptx.author = 'SPECCORE TEAM';
  pptx.title = meta.title || '报告';

  for (const page of data.pages || []) {
    switch (page.type) {
      case 'cover-image':
      case 'closing-image': {
        if (page.image) {
          const s = pptx.addSlide();
          renderCoverImage(s, page);
          addNotesIfAny(s, page, 0);
        } else console.warn('跳过图片页：缺 image 字段');
        break;
      }
      case 'overview': {
        const s = pptx.addSlide();
        renderOverview(s, t, page, meta);
        addNotesIfAny(s, page, 0);
        break;
      }
      case 'timeline': {
        const items = (page.items || []).flatMap(g => {
          if (g.items) return g.items.map(it => Object.assign({ q: g.q }, it));
          return [g];
        });
        let pi = 0;
        for (let i = 0; i < items.length; i += 8) {
          const sub = Object.assign({}, page, { items: items.slice(i, i + 8) });
          const s = pptx.addSlide();
          renderTimeline(s, t, sub, meta, sub.items);
          addNotesIfAny(s, page, pi++);
        }
        break;
      }
      case 'bullets': {
        const items = page.items || [];
        let pi = 0;
        for (let i = 0; i < items.length; i += 6) {
          const s = pptx.addSlide();
          renderBullets(s, t, page, meta, items.slice(i, i + 6), i === 0);
          addNotesIfAny(s, page, pi++);
        }
        break;
      }
      case 'chart': {
        const s = pptx.addSlide();
        renderChart(s, t, page, meta);
        addNotesIfAny(s, page, 0);
        break;
      }
      case 'chart-pie': {
        const s = pptx.addSlide();
        renderChartPie(s, t, page, meta);
        addNotesIfAny(s, page, 0);
        break;
      }
      case 'chart-line': {
        const s = pptx.addSlide();
        renderChartLine(s, t, page, meta);
        addNotesIfAny(s, page, 0);
        break;
      }
      default:
        console.warn('跳过未知页类型:', page.type);
    }
  }

  const outDir = path.dirname(args.out);
  require('fs').mkdirSync(outDir, { recursive: true });
  pptx.writeFile({ fileName: args.out }).then(f => {
    console.log('PPTX_OK ' + path.resolve(f));
  }).catch(e => {
    console.error('生成失败:', e.message);
    process.exit(1);
  });
}

main();
