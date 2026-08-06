#!/usr/bin/env node
/* qa/type-discipline-check.mjs — Round 16 typography gate (Jon, 2026-08-05).
 *
 * Jon on concept-d/pages/explore/problems.html:
 *   "There are too many text styles. It's messy and doesn't look tight.
 *    Simplify the typography strategy. Avoid using Geist as much as
 *    possible. Use Geist Mono for labels discreetly but not all over the
 *    place. Don't create so many sizes in a content block. Think Swiss
 *    grid but modern. Don't create this modal window so small it has to
 *    scroll, give it the room it needs but focus content above the fold."
 *
 * A CSS-source grep cannot answer any of that — the messy surface was built
 * entirely from allowed faces, and what mattered was what actually RENDERED.
 * So this gate renders each explore/case page and measures the real thing:
 *
 *   1. ZERO Geist Mono anywhere in <main>. Mono is a data voice; these pages
 *      carry no data readouts, so the correct count is zero.
 *   2. At most MAX_SIZES distinct rendered font-sizes per page.
 *   3. No panel scrolls internally (`scrollHeight <= clientHeight`) — the
 *      page scrolls, the card doesn't.
 *   4. No horizontal overflow, desktop or phone.
 *
 * Needs the dev server on :4340 (./serve.py &). Exits non-zero on any fail.
 */
import puppeteer from 'puppeteer';

const BASE = 'http://localhost:4340/concept-d/pages/explore/';
const PAGES = ['problems', 'interceptos', 'agents', 'insights', 'labs',
               'case-hp-abx', 'case-intel-abm', 'case-sap-video'];
const VIEWPORTS = [
  { name: '1440×900', width: 1440, height: 900 },
  { name: '1280×800', width: 1280, height: 800 },
  { name: '390×844',  width: 390,  height: 844 },
];
// 7 rungs of the ladder + the page-hero display sizes the labs/case heroes
// legitimately own. A page needing more must be argued, not nudged into.
const MAX_SIZES = 9;

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
let fails = 0, checks = 0;
const ok = (m) => { checks++; console.log('PASS  ' + m); };
const bad = (m) => { checks++; fails++; console.log('FAIL  ' + m); };

for (const vp of VIEWPORTS) {
  for (const p of PAGES) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.goto(`${BASE}${p}.html`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 350));

    const m = await page.evaluate(() => {
      const sizes = new Set(), mono = new Set();
      const w = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
      let n;
      while ((n = w.nextNode())) {
        if (!n.nodeValue.trim()) continue;
        const el = n.parentElement;
        if (!el) continue;
        const c = getComputedStyle(el);
        if (c.display === 'none' || c.visibility === 'hidden') continue;
        if (el.closest('svg')) continue;
        sizes.add(c.fontSize);
        if (c.fontFamily.split(',')[0].replace(/["']/g, '').includes('Geist')) {
          mono.add(`${el.className || el.tagName} "${n.nodeValue.trim().slice(0, 28)}"`);
        }
      }
      return {
        sizes: [...sizes].map(parseFloat).sort((a, b) => a - b),
        mono: [...mono],
        clipped: [...document.querySelectorAll('.explore-solo,.explore-panel,.explore-lede')]
          .filter(e => e.scrollHeight > e.clientHeight + 2)
          .map(e => `${e.className.split(' ')[0]} ${e.scrollHeight}>${e.clientHeight}`),
        overflowX: document.documentElement.scrollWidth - window.innerWidth,
      };
    });

    const tag = `${p} @${vp.name}`;
    m.mono.length ? bad(`${tag}: (a) Geist Mono in main — ${m.mono.join(' | ')}`)
                  : ok(`${tag}: (a) zero Geist Mono in main`);
    m.sizes.length <= MAX_SIZES
      ? ok(`${tag}: (b) ${m.sizes.length} rendered sizes [${m.sizes.join('/')}]`)
      : bad(`${tag}: (b) ${m.sizes.length} rendered sizes (max ${MAX_SIZES}) [${m.sizes.join('/')}]`);
    m.clipped.length ? bad(`${tag}: (c) panel scrolls internally — ${m.clipped.join(' | ')}`)
                     : ok(`${tag}: (c) no panel scrolls internally`);
    m.overflowX > 1 ? bad(`${tag}: (d) horizontal overflow ${m.overflowX}px`)
                    : ok(`${tag}: (d) no horizontal overflow`);
    if (errs.length) bad(`${tag}: (e) pageerror — ${errs.join(' | ')}`);
    await page.close();
  }
}
await browser.close();
console.log(fails === 0
  ? `\ntype-discipline-check: ALL PASS — ${checks} assertions across ${PAGES.length} pages × ${VIEWPORTS.length} viewports.`
  : `\ntype-discipline-check: ${fails} FAILED of ${checks}.`);
process.exit(fails ? 1 : 0);
