#!/usr/bin/env node
// qa/lockup-crisp-check.mjs — permanent lockup rasterization gate (IT5; IT6;
// rebuilt IT6 round 12).
//
// History, so nobody re-fights it:
//   * IT5: the wordmark rendered crunchy because a runtime translate(0,-10)
//     sat against a fractional viewBox scale and the flex-centered logo
//     landed at fractional y (20.59375px). Fix: rebake the translate into
//     the viewBox y-origin (viewBox "0 0.9583 324.005 76.923") and pin the
//     topbar so the logo sits at integer y=21. Both still asserted here.
//   * IT6: the translucent blur topbar let the hero video shimmer through
//     the letter edges. Fix: opaque topbar, no backdrop-filter. Asserted.
//   * IT6 also introduced PIXEL-HINTED wordmark paths (qa/hint-wordmark.py
//     per-glyph warps). VERDICT REVERSED 07-26 (Jon: "crunchy again …
//     black artifacts"): the warps deformed the letterforms — chipped
//     corners, stepped curves, lumpy joins — visible at DPR 2 and worse at
//     any other scale. The canon Figma geometry is CORRECT; crispness comes
//     from the opaque bar + integer position + rebaked viewBox, not from
//     bending glyphs. The hinted paths are now BANNED (scan below); do not
//     reintroduce them, and do not "improve" the letterform geometry again.
//
// Asserts, per page/theme, at the listed DPRs:
//   (a) no computed CSS transform on the resting logo chain
//   (b) rendered logo height is integer CSS px; logo sits at integer CSS
//       x AND y (fractional position = smeared stems/edges)
//   (c) wordmark group carries no transform attribute (DOM + static scan);
//       header mark slot stays at the approved translate(0, 1.22)
//   (d) tight lockup crops written to the out-dir for human review
//   (e) zero pageerrors
//   (f) static scan: only the CANON wordmark ships (hinted d-strings banned)
//   (g) topbar opaque, no backdrop-filter
//   (i) NEVER-AGAIN pixel gate: the wordmark as rendered IN PAGE CONTEXT is
//       pixel-compared against the SAME svg rendered on an isolated page
//       (same rasterizer, same ink, same background, same DPR). Ghost
//       layers, shadows, filters, transforms, translucency, wrong ink, or
//       any other context corruption shows up as a diff and fails the gate.
//
// Run: node qa/lockup-crisp-check.mjs [out-dir]

import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'qa', 'lockup-crops'));
const BASE = process.env.LOCKUP_BASE || 'http://localhost:4340/concept-d';
const PAGES = [
  { url: `${BASE}/index.html`, tag: 'index', theme: 'light', dprs: [1, 2] },
  { url: `${BASE}/index.html`, tag: 'index-dark', theme: 'dark', dprs: [2] },
  { url: `${BASE}/pages/explore/problems.html`, tag: 'explore-problems', theme: 'light', dprs: [1, 2] },
  { url: `${BASE}/pages/work.html`, tag: 'work', theme: 'light', dprs: [2] },
  // mirror pages use the <use href="#intercept-lockup"> symbol rig: no
  // hover anchor, no mark-slot — structural checks are skipped, but the
  // integer-position, opacity, and dpr1 raster-swap checks all apply.
  { url: `${BASE}/about.html`, tag: 'mirror-about', theme: 'light', dprs: [1], rig: 'symbol' },
];

fs.mkdirSync(OUT, { recursive: true });

let failures = 0;
function check(ok, label, detail) {
  if (ok) {
    console.log(`PASS  ${label}`);
  } else {
    failures += 1;
    console.log(`FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

// ── static scans (REPO-WIDE: every concept + the gallery + shared assets;
//     reference/ is the untouchable live-site archive and node_modules is
//     noise — both excluded) ────────────────────────────────────────────────
const SCAN_EXCLUDE = new Set(['node_modules', 'reference', '.planning', '.git']);
function* htmlFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SCAN_EXCLUDE.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith('.html') || e.name.endsWith('.svg')) yield p;
  }
}

// (c) no wordmark group anywhere may carry a transform attribute (either
//     attribute order)
const offenders = [];
for (const f of htmlFiles(ROOT)) {
  const src = fs.readFileSync(f, 'utf8');
  if (
    /<g transform="[^"]*"[^>]*fill="var\(--logo-ink\)"/.test(src) ||
    /<g fill="var\(--logo-ink\)"[^>]*transform="/.test(src)
  ) {
    offenders.push(path.relative(ROOT, f));
  }
}
check(
  offenders.length === 0,
  'static: no wordmark group carries a transform attribute (repo-wide)',
  offenders.join(', ')
);

// (f) canon-only, repo-wide: the IT6 hinted variant (first glyph
//     "M5.1282 54.8045") is banned everywhere — its per-glyph warps read as
//     chipped/lumpy letterforms. Any lockup that names the wordmark ink
//     must carry the canon rebaked geometry (first glyph "M4.85695").
const hintedFiles = [];
const missingCanon = [];
for (const f of htmlFiles(ROOT)) {
  const src = fs.readFileSync(f, 'utf8');
  if (src.includes('M5.1282 54.8045')) hintedFiles.push(path.relative(ROOT, f));
  if (src.includes('fill="var(--logo-ink)"') && !src.includes('M4.85695')) {
    missingCanon.push(path.relative(ROOT, f));
  }
}
check(
  hintedFiles.length === 0,
  'static: no page ships the banned pixel-hinted wordmark (repo-wide)',
  hintedFiles.join(', ')
);
check(
  missingCanon.length === 0,
  'static: every inked lockup uses the canon wordmark geometry (M4.85695)',
  missingCanon.join(', ')
);

const browser = await puppeteer.launch({
  headless: 'shell',
  protocolTimeout: 60000,
  args: ['--disable-gpu'],
});

// in-browser pixel diff of two same-sized PNGs (base64); returns stats
async function diffPngs(b64a, b64b) {
  const page = await browser.newPage();
  const result = await page.evaluate(async (a, b) => {
    const load = (src) =>
      new Promise((res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = 'data:image/png;base64,' + src;
      });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    if (ia.width !== ib.width || ia.height !== ib.height) {
      return { error: `size mismatch ${ia.width}x${ia.height} vs ${ib.width}x${ib.height}` };
    }
    const cv = (img) => {
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      return ctx.getImageData(0, 0, img.width, img.height).data;
    };
    const da = cv(ia);
    const db = cv(ib);
    let diff = 0;
    let inkA = 0;
    for (let i = 0; i < da.length; i += 4) {
      const d = Math.max(
        Math.abs(da[i] - db[i]),
        Math.abs(da[i + 1] - db[i + 1]),
        Math.abs(da[i + 2] - db[i + 2])
      );
      if (d > 24) diff += 1;
      // rough ink detection: pixel far from the top-left/background pixel
      const bd = Math.max(
        Math.abs(da[i] - da[0]),
        Math.abs(da[i + 1] - da[1]),
        Math.abs(da[i + 2] - da[2])
      );
      if (bd > 96) inkA += 1;
    }
    return { total: da.length / 4, diff, inkA };
  }, b64a, b64b);
  await page.close();
  return result;
}

for (const { url, tag, theme, dprs, rig } of PAGES) {
  for (const dpr of dprs) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: dpr });
    await page.evaluateOnNewDocument((t) => {
      try { localStorage.setItem('ig_theme', t); } catch (e) {}
    }, theme);
    await page.setRequestInterception(true);
    page.on('request', (req) =>
      req.resourceType() === 'media' || /\.(mp4|webm|mov)(\?|$)/.test(req.url())
        ? req.abort()
        : req.continue()
    );
    const pageErrors = [];
    page.on('pageerror', (e) => pageErrors.push(String(e)));
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    // Let the load-time glitch play settle back to the canon mark.
    await new Promise((r) => setTimeout(r, 2500));

    const info = await page.evaluate(() => {
      const a =
        document.querySelector('header [data-fritz-hover-lockup]') ||
        document.querySelector('header a[aria-label="Intercept home"]');
      if (!a) return { missing: true };
      const svg = a.querySelector('svg.logo');
      const wordmark =
        svg.querySelector(':scope > g[fill="var(--logo-ink)"]') ||
        document.querySelector('#intercept-lockup g[fill="currentColor"]');
      const markSlot = svg.querySelector('#mark-slot');
      const grab = (el) => ({
        transform: getComputedStyle(el).transform,
        attrTransform: el.getAttribute('transform'),
        rect: (({ x, y, width, height }) => ({ x, y, width, height }))(
          el.getBoundingClientRect()
        ),
      });
      const topbar = document.querySelector('.topbar');
      return {
        a: grab(a),
        svg: grab(svg),
        svgHtml: svg.outerHTML,
        ink: wordmark ? getComputedStyle(wordmark).fill : null,
        wordmark: wordmark ? grab(wordmark) : null,
        markSlotTransform: markSlot ? markSlot.getAttribute('transform') : null,
        topbarBg: topbar ? getComputedStyle(topbar).backgroundColor : null,
        topbarBackdrop: topbar
          ? (getComputedStyle(topbar).backdropFilter || 'none')
          : null,
      };
    });

    const id = `${tag} dpr${dpr}`;
    if (info.missing || !info.wordmark) {
      check(false, `${id}: header lockup + wordmark group present`);
      await page.close();
      continue;
    }

    // (a) resting chain must carry no CSS transform (inline rig only — the
    //     symbol rig's internals live inside the <symbol> definition)
    if (rig !== 'symbol') {
      check(info.a.transform === 'none', `${id}: (a) anchor computed transform is none`, info.a.transform);
      check(info.svg.transform === 'none', `${id}: (a) svg.logo computed transform is none`, info.svg.transform);
      check(info.wordmark.transform === 'none', `${id}: (a) wordmark group computed transform is none`, info.wordmark.transform);
    }

    // (b) integer rendered logo height + integer x/y position
    const { x, y, height } = info.svg.rect;
    check(height > 0 && height % 1 === 0, `${id}: (b) rendered logo height is integer CSS px`, `height=${height}`);
    check(y % 1 === 0, `${id}: (b) logo sits at integer CSS y`, `y=${y}`);
    check(x % 1 === 0, `${id}: (b) logo sits at integer CSS x`, `x=${x}`);

    // (c) wordmark group carries no transform attribute; mark slot pinned
    //     (inline rig only)
    if (rig !== 'symbol') {
      check(info.wordmark.attrTransform === null, `${id}: (c) wordmark group has no transform attribute`, String(info.wordmark.attrTransform));
      check(info.markSlotTransform === 'translate(0, 1.22)', `${id}: (c) mark slot at approved translate(0, 1.22)`, String(info.markSlotTransform));
    }

    // (g) topbar must be opaque with no backdrop blur
    const opaque = /^rgb\(/.test(String(info.topbarBg));
    check(opaque, `${id}: (g) topbar background is opaque`, String(info.topbarBg));
    check(info.topbarBackdrop === 'none', `${id}: (g) topbar has no backdrop-filter`, String(info.topbarBackdrop));

    // (e) zero pageerrors
    check(pageErrors.length === 0, `${id}: (e) zero pageerrors`, pageErrors.join(' | '));

    // (d) tight lockup crop for human review
    const r = info.svg.rect;
    const clip = {
      x: Math.floor(r.x) - 6,
      y: Math.floor(r.y) - 6,
      width: Math.ceil(r.width) + 12,
      height: Math.ceil(r.height) + 12,
    };
    const cropPath = path.join(OUT, `${tag}-dpr${dpr}.png`);
    await page.screenshot({ path: cropPath, clip });
    check(fs.existsSync(cropPath), `${id}: (d) crop captured`, cropPath);

    // (i) context-vs-reference wordmark pixel gate. Crop only the wordmark
    //     span (the mark animates and is diffed nowhere). The reference
    //     depends on DPR:
    //       - DPR 1 (round 12c): true-1x screens ship the pre-rendered
    //         supersampled raster (uneven live path rasterization varies by
    //         GPU raster path — the "crunchy" Jon saw). First ASSERT the
    //         swap is actually active, then diff the live crop against the
    //         shipped raster file itself.
    //       - DPR 2+: pure vector; diff against the same svg rendered on an
    //         isolated bare page (same rasterizer/ink/background).
    const wordW = Math.floor(r.width * 0.74); // wordmark ends ~75.6% in; mark starts ~80%
    const liveClip = { x: r.x, y: r.y, width: wordW, height: r.height };

    let refB64;
    const refPage = await browser.newPage();
    await refPage.setViewport({ width: 800, height: 200, deviceScaleFactor: dpr });
    if (dpr === 1) {
      const swap = await page.evaluate(() => {
        const svg = document.querySelector('header svg.logo');
        const g = svg.querySelector('g[fill="var(--logo-ink)"], use');
        // symbol-rig pages: check the symbol's own group
        const target =
          g && g.tagName.toLowerCase() === 'use'
            ? document.querySelector(
                '#intercept-lockup g[fill="var(--logo-ink)"], #intercept-lockup g[fill="currentColor"]'
              )
            : g;
        return {
          bg: getComputedStyle(svg).backgroundImage,
          wordmarkDisplay: target ? getComputedStyle(target).display : null,
        };
      });
      check(
        /wordmark-30/.test(swap.bg),
        `${id}: (i) 1x raster swap active (svg background is the shipped wordmark)`,
        swap.bg
      );
      check(
        swap.wordmarkDisplay === 'none',
        `${id}: (i) 1x vector wordmark hidden under the raster`,
        String(swap.wordmarkDisplay)
      );
      const variant = theme === 'dark' ? 'white' : 'ink';
      const rasterB64 = fs.readFileSync(
        path.join(ROOT, 'concept-d', 'assets', 'img', `wordmark-30-${variant}.png`),
        'base64'
      );
      await refPage.setContent(
        `<!doctype html><html><body style="margin:0;background:${info.topbarBg}">` +
        `<img style="position:absolute;left:20px;top:20px;width:127px;height:30px" ` +
        `src="data:image/png;base64,${rasterB64}"></body></html>`
      );
    } else {
      const svgIsolated = info.svgHtml.replace(/fill="var\(--logo-ink\)"/, `fill="${info.ink}"`);
      await refPage.setContent(
        `<!doctype html><html><body style="margin:0;background:${info.topbarBg}">` +
        `<div style="position:absolute;left:20px;top:20px;height:${r.height}px;line-height:0">` +
        svgIsolated.replace('<svg ', `<svg style="height:${r.height}px;width:auto;display:block" `) +
        `</div></body></html>`
      );
    }
    await new Promise((rr) => setTimeout(rr, 300));
    const liveB64 = await page.screenshot({ clip: liveClip, encoding: 'base64' });
    refB64 = await refPage.screenshot({
      clip: { x: 20, y: 20, width: wordW, height: r.height },
      encoding: 'base64',
    });
    await refPage.close();

    const d = await diffPngs(liveB64, refB64);
    if (d.error) {
      check(false, `${id}: (i) wordmark context render matches isolated render`, d.error);
    } else {
      const budget = Math.max(24, Math.round(d.total * 0.002));
      check(
        d.inkA > 400,
        `${id}: (i) wordmark crop actually contains letterforms`,
        `ink pixels=${d.inkA}`
      );
      check(
        d.diff <= budget,
        `${id}: (i) wordmark context render matches isolated render`,
        `diff=${d.diff} px of ${d.total} (budget ${budget})`
      );
      if (d.diff > budget) {
        fs.writeFileSync(path.join(OUT, `${tag}-dpr${dpr}-live.png`), Buffer.from(liveB64, 'base64'));
        fs.writeFileSync(path.join(OUT, `${tag}-dpr${dpr}-ref.png`), Buffer.from(refB64, 'base64'));
      }
    }

    await page.close();
  }
}

await browser.close();

console.log(failures === 0 ? `\nlockup-crisp-check: ALL PASS (crops in ${OUT})` : `\nlockup-crisp-check: ${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
