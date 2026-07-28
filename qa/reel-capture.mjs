// Reel v3 scroll captures: deterministic frame-stepped scrolls of built LPs.
// Each beat: sine-eased scroll 0 -> DIST over N frames at 1920x1080, one
// screenshot per frame (exact scroll position per frame = zero jitter).
import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';

const OUT = '/private/tmp/claude-501/-Users-jontoewsinterceptgroup-com/e56891d5-7fca-44ee-b69c-2a26cc05bbad/scratchpad/reel-frames';
const P = '/Users/jontoewsinterceptgroup.com/Documents/Labs/Intercept Labs/projects';

const FPS = 30;
const BEATS = [
  { tag: 'hp-deep', url: `file://${P}/hp-abm-lp-healthcare/index.html`, secs: 3.2, startY: 2600 },
];

const ease = (t) => 0.5 - 0.5 * Math.cos(Math.PI * t); // sine in-out

const browser = await puppeteer.launch({ headless: 'shell', args: ['--disable-gpu', '--allow-file-access-from-files'] });
for (const b of BEATS) {
  const dir = path.join(OUT, b.tag);
  fs.mkdirSync(dir, { recursive: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto(b.url, { waitUntil: 'networkidle0', timeout: 45000 });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    // freeze CSS animations/transitions so stepped capture can't tear them
    const s = document.createElement('style');
    s.textContent = '*{animation-play-state:paused !important;transition:none !important;}';
    document.head.appendChild(s);
  });
  await new Promise((r) => setTimeout(r, 1200)); // fonts/images settle
  const metrics = await page.evaluate(() => ({
    scrollH: document.documentElement.scrollHeight,
    innerH: window.innerHeight,
  }));
  const start = b.startY || 0;
  const maxScroll = metrics.scrollH - metrics.innerH;
  const dist = Math.min(maxScroll - start, Math.round(metrics.innerH * 1.7));
  const frames = Math.round(b.secs * FPS);
  for (let i = 0; i < frames; i++) {
    const y = start + Math.round(dist * ease(i / (frames - 1)));
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.png`) });
  }
  console.log(`${b.tag}: scrollH=${metrics.scrollH} dist=${dist} frames=${frames}`);
  await page.close();
}
await browser.close();
