#!/usr/bin/env node
// qa/lockup-crisp-check.mjs — permanent lockup rasterization gate (IT5).
//
// The concept-d header lockup once rendered crunchy at DPR 1: the wordmark
// group carried a runtime translate(0,-10) against a fractional viewBox
// scale (30px / 76.2147 units), and the flex-centered logo sat at a
// near-half-pixel y offset (20.59375px), smearing every horizontal
// letterform edge across two pixel rows. The fix rebaked the translate into
// the viewBox y-origin (viewBox "0 0.9583 324.005 76.923" -> 0.39 scale,
// cap top and baseline on integer device pixels) and pinned .cta-nav to
// 42px so the logo centers at integer y=21. This gate keeps all of that
// true mechanically. The deployed-header exemption does NOT apply to
// rendering quality.
//
// Asserts, per page, at DPR 1 and DPR 2:
//   (a) no computed CSS transform (other than 'none') on the resting logo
//       chain: a[data-fritz-hover-lockup], svg.logo, wordmark group
//   (b) the rendered logo height is an integer CSS px value (and the logo
//       sits at an integer CSS y — fractional y is what smeared the type)
//   (c) the wordmark group carries no transform attribute in markup (DOM
//       check on tested pages + static scan of every concept-d HTML file),
//       and the header mark slot stays at the approved translate(0, 1.22)
//   (d) captures tight DPR-1/DPR-2 header-lockup crops to the out-dir for
//       human review
//   (e) zero pageerrors
//
// Run: node qa/lockup-crisp-check.mjs [out-dir]
//   out-dir defaults to qa/lockup-crops (crops are for human review, not
//   pixel-diffed). Exits 0 on pass, 1 on any assertion failure.

import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'qa', 'lockup-crops'));
const BASE = process.env.LOCKUP_BASE || 'http://localhost:4340/concept-d';
const PAGES = [
  { url: `${BASE}/index.html`, tag: 'index' },
  { url: `${BASE}/pages/explore/problems.html`, tag: 'explore-problems' },
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

// ── (c) static scan: no wordmark group anywhere in concept-d markup may
//        carry a transform attribute ──────────────────────────────────────
function* htmlFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}
const offenders = [];
for (const f of htmlFiles(path.join(ROOT, 'concept-d'))) {
  const src = fs.readFileSync(f, 'utf8');
  if (/<g transform="[^"]*"[^>]*fill="var\(--logo-ink\)"/.test(src)) {
    offenders.push(path.relative(ROOT, f));
  }
}
check(
  offenders.length === 0,
  'static: no wordmark group carries a transform attribute in concept-d markup',
  offenders.join(', ')
);

const browser = await puppeteer.launch({
  headless: 'shell',
  protocolTimeout: 60000,
  args: ['--disable-gpu'],
});

for (const { url, tag } of PAGES) {
  for (const dpr of [1, 2]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: dpr });
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
      const a = document.querySelector('header [data-fritz-hover-lockup]');
      if (!a) return { missing: true };
      const svg = a.querySelector('svg.logo');
      const wordmark = svg.querySelector(':scope > g[fill="var(--logo-ink)"]');
      const markSlot = svg.querySelector('#mark-slot');
      const grab = (el) => ({
        transform: getComputedStyle(el).transform,
        attrTransform: el.getAttribute('transform'),
        rect: (({ x, y, width, height }) => ({ x, y, width, height }))(
          el.getBoundingClientRect()
        ),
      });
      return {
        a: grab(a),
        svg: grab(svg),
        wordmark: wordmark ? grab(wordmark) : null,
        markSlotTransform: markSlot ? markSlot.getAttribute('transform') : null,
      };
    });

    const id = `${tag} dpr${dpr}`;
    if (info.missing || !info.wordmark) {
      check(false, `${id}: header lockup + wordmark group present`);
      await page.close();
      continue;
    }

    // (a) resting chain must carry no CSS transform
    check(info.a.transform === 'none', `${id}: (a) anchor computed transform is none`, info.a.transform);
    check(info.svg.transform === 'none', `${id}: (a) svg.logo computed transform is none`, info.svg.transform);
    check(info.wordmark.transform === 'none', `${id}: (a) wordmark group computed transform is none`, info.wordmark.transform);

    // (b) integer rendered logo height + integer y position
    const { height, y } = info.svg.rect;
    check(height > 0 && height % 1 === 0, `${id}: (b) rendered logo height is integer CSS px`, `height=${height}`);
    check(y % 1 === 0, `${id}: (b) logo sits at integer CSS y`, `y=${y}`);

    // (c) wordmark group carries no transform attribute; mark slot pinned
    check(info.wordmark.attrTransform === null, `${id}: (c) wordmark group has no transform attribute`, String(info.wordmark.attrTransform));
    check(info.markSlotTransform === 'translate(0, 1.22)', `${id}: (c) mark slot at approved translate(0, 1.22)`, String(info.markSlotTransform));

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

    await page.close();
  }
}

await browser.close();

console.log(failures === 0 ? `\nlockup-crisp-check: ALL PASS (crops in ${OUT})` : `\nlockup-crisp-check: ${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
