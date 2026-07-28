#!/usr/bin/env node
/* qa/lockup-contrast-check.mjs — permanent gate: the wordmark must be VISIBLE
 * against whatever surface it sits on, at BOTH 1× and 2×, in header AND footer.
 *
 * The 1× raster-swap picks the wordmark raster by THEME, but a footer band is
 * dark regardless of theme — so a light-theme dark footer got the INK raster on
 * a dark surface = invisible wordmark (Jon, 2026-07-28, non-retina display).
 * The crispness gate only checked the header, so it slipped through.
 *
 * For every svg.logo on every page, at dpr 1 and 2, this resolves the wordmark's
 * effective luminance (raster tone when the 1× swap is active, else the vector
 * ink/currentColor) and the luminance of the surface behind it, and asserts they
 * differ enough to be seen.  Exit 0 = all visible, 1 = any near-invisible.
 *
 * Run:  node qa/lockup-contrast-check.mjs   (server must be up on :4340)
 */
import path from 'node:path';
const puppeteer = (await import(
  'file:///Users/jontoewsinterceptgroup.com/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
)).default;

const BASE = 'http://localhost:4340/concept-d';
const PAGES = [
  '/index.html', '/about.html', '/insights-hub.html', '/chatb2b.html',
  '/ai-policy.html', '/privacy-policy.html', '/terms-of-service.html',
  '/insights-the-ai-confidence-gap.html', '/insights-h1-2026-trends-brief.html',
  '/pages/work.html', '/pages/explore/interceptos.html',
];
const MIN_CONTRAST = 0.25;   // luminance delta; invisible ≈ 0, white-on-ink ≈ 0.94

const IN_PAGE = () => {
  const relLum = (r, g, b) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const parse = (s) => { const m = /rgba?\(([^)]+)\)/.exec(s); if (!m) return null;
    const p = m[1].split(',').map(x => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] }; };
  const hasCC = !!document.querySelector('#intercept-lockup g[fill="currentColor"]');
  return [...document.querySelectorAll('svg.logo')].map((svg) => {
    const ctx = svg.closest('footer') ? 'footer' : (svg.closest('header,.topbar') ? 'header' : 'other');
    const bgi = getComputedStyle(svg).backgroundImage || '';
    let wmLum, mode;
    if (bgi.includes('wordmark-')) { mode = 'raster'; wmLum = /white/.test(bgi) ? 0.95 : 0.03; }
    else if (hasCC) { mode = 'vector'; const c = parse(getComputedStyle(svg).color); wmLum = c ? relLum(c.r, c.g, c.b) : 0.03; }
    else { mode = 'vector-fixed'; wmLum = 0.03; }   // article lockup hardcodes #0a0a0f
    let el = svg, surf = null;
    while (el) { const c = parse(getComputedStyle(el).backgroundColor); if (c && c.a > 0.5) { surf = relLum(c.r, c.g, c.b); break; } el = el.parentElement; }
    if (surf === null) surf = 1;   // default page bg is white
    return { ctx, mode, wmLum: +wmLum.toFixed(3), surf: +surf.toFixed(3), contrast: +Math.abs(wmLum - surf).toFixed(3) };
  });
};

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=metal'] });
const page = await browser.newPage();
let fails = 0, checked = 0;
for (const p of PAGES) {
  for (const dpr of [1, 2]) {
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: dpr });
    await page.goto(BASE + p, { waitUntil: 'networkidle0', timeout: 45000 });
    const logos = await page.evaluate(IN_PAGE);
    for (const l of logos) {
      if (l.ctx === 'other') continue;
      checked++;
      const ok = l.contrast >= MIN_CONTRAST;
      if (!ok) { fails++; console.error(`  FAIL ${p} dpr${dpr} [${l.ctx}] wordmark(${l.mode}) lum=${l.wmLum} vs surface lum=${l.surf} → contrast ${l.contrast} < ${MIN_CONTRAST}`); }
    }
  }
}
await browser.close();
if (fails === 0) console.log(`lockup-contrast-check: ALL PASS — ${checked} lockup instances (header+footer, dpr1+dpr2) all visible.`);
else console.error(`lockup-contrast-check: ${fails} near-invisible lockup(s).`);
process.exit(fails === 0 ? 0 : 1);
