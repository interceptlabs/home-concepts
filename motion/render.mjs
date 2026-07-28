/* Deterministic frame renderer for the About motion pieces.
 *
 * Loads a page that exposes window.seek(frac) + window.__ready, then drives
 * the animation frame-by-frame (no wall-clock) and screenshots each frame as
 * a PNG. ffmpeg (in build.sh) turns the PNG sequence into a seamless loop.
 *
 * Usage: node render.mjs <url> <outDir> <frames> [width] [height]
 */
import fs from 'node:fs';
import path from 'node:path';

const puppeteer = (await import(
  'file:///Users/jontoewsinterceptgroup.com/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
)).default;

const [url, outDir, framesArg, wArg, hArg] = process.argv.slice(2);
const W = parseInt(wArg || '1280', 10);
const H = parseInt(hArg || '720', 10);
// framesArg: a number, or "@FPS" to derive frame count from the page's window.__total (seconds)
const fpsMode = /^@(\d+(?:\.\d+)?)$/.exec(framesArg);

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=metal', '--enable-webgl',
         '--ignore-gpu-blocklist', '--no-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.error('PAGEERROR:', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.error('CONSOLE:', m.text()); });

await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
await page.waitForFunction('window.__ready === true', { timeout: 60000 });

let FRAMES;
if (fpsMode) {
  const total = await page.evaluate(() => window.__total);
  FRAMES = Math.round(total * parseFloat(fpsMode[1]));
  console.log(`loop ${total.toFixed(2)}s @ ${fpsMode[1]}fps -> ${FRAMES} frames`);
} else {
  FRAMES = parseInt(framesArg, 10);
}

const t0 = Date.now();
for (let f = 0; f < FRAMES; f++) {
  await page.evaluate((frac) => window.seek(frac), f / FRAMES);
  await page.screenshot({
    path: path.join(outDir, `frame_${String(f).padStart(4, '0')}.png`),
    clip: { x: 0, y: 0, width: W, height: H },
    optimizeForSpeed: true,
  });
  if (f % 24 === 0) process.stdout.write(`  frame ${f}/${FRAMES}\r`);
}
console.log(`\nrendered ${FRAMES} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${outDir}`);
await browser.close();
