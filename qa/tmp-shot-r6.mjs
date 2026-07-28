import puppeteer from 'puppeteer';
import fs from 'node:fs';
const OUT = '/private/tmp/claude-501/-Users-jontoewsinterceptgroup-com/be9e6778-909e-4f8d-bd6f-ecedd7fe7516/scratchpad/r6';
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ headless: 'shell' });

// explore pages at both proof sizes
const PAGES = ['problems', 'interceptos', 'agents', 'insights', 'labs', 'case-sap-video'];
for (const [w, h] of [[1440, 900], [1280, 800]]) {
  for (const name of PAGES) {
    const p = await browser.newPage();
    await p.setViewport({ width: w, height: h });
    await p.goto(`http://localhost:4340/concept-d/pages/explore/${name}.html`, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 900));
    const over = await p.evaluate(() => document.documentElement.scrollHeight - document.documentElement.clientHeight);
    if (w === 1440) await p.screenshot({ path: `${OUT}/${name}.png` });
    console.log(`${name} @${w}: overflow ${over}`);
    // headline alignment measure on problems
    if (name === 'problems' && w === 1440) {
      // round 11: problems moved to the single-surface P-B layout — the old
      // lede/panel align probe no longer applies; keep nulls non-fatal.
      const m = await p.evaluate(() => {
        const h2 = document.querySelector('.explore-lede .section-h2');
        const q = document.querySelector('.explore-panel .q-quote');
        return { h2Top: h2 ? h2.getBoundingClientRect().top : null, quoteTop: q ? q.getBoundingClientRect().top : null };
      });
      console.log('  align (legacy probe):', JSON.stringify(m));
    }
    await p.close();
  }
}

// homepage: hero (no pause chip) + reel (sound chip)
const p = await browser.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto('http://localhost:4340/concept-d/', { waitUntil: 'load' });
await new Promise(r => setTimeout(r, 900));
console.log('hero pause chips on page:', await p.evaluate(() => document.querySelectorAll('.hero-video-layer .video-toggle').length));
console.log('hero video playing:', await p.evaluate(() => { const v = document.querySelector('.hero-video'); return v && !v.paused; }));
await p.screenshot({ path: `${OUT}/index-hero.png` });
await p.evaluate(() => document.getElementById('work-reel').scrollIntoView());
await new Promise(r => setTimeout(r, 1200));
console.log('reel state:', await p.evaluate(() => {
  const v = document.querySelector('.reel-video');
  const s = document.querySelector('.reel-sound');
  return JSON.stringify({ playing: v && !v.paused, muted: v && v.muted, soundLabel: s && s.textContent, hasAudioTrack: v && (v.mozHasAudio || Boolean(v.webkitAudioDecodedByteCount) || 'unknown') });
}));
await p.screenshot({ path: `${OUT}/index-reel.png` });
// click sound chip
await p.click('.reel-sound');
await new Promise(r => setTimeout(r, 400));
console.log('after sound click:', await p.evaluate(() => {
  const v = document.querySelector('.reel-video');
  const s = document.querySelector('.reel-sound');
  return JSON.stringify({ playing: v && !v.paused, muted: v.muted, soundLabel: s.textContent, pressed: s.getAttribute('aria-pressed') });
}));
await p.close();

// work.html reel
const wp = await browser.newPage();
await wp.setViewport({ width: 1440, height: 900 });
await wp.goto('http://localhost:4340/concept-d/pages/work.html', { waitUntil: 'load' });
await new Promise(r => setTimeout(r, 1200));
console.log('work reel:', await wp.evaluate(() => {
  const v = document.querySelector('.reel-video');
  const s = document.querySelector('.reel-sound');
  return JSON.stringify({ playing: v && !v.paused, muted: v && v.muted, soundChip: Boolean(s) });
}));
await wp.screenshot({ path: `${OUT}/work-reel.png` });
await wp.close();

await browser.close();
console.log('done ->', OUT);
