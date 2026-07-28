import puppeteer from 'puppeteer';
import fs from 'node:fs';
const OUT = '/private/tmp/claude-501/-Users-jontoewsinterceptgroup-com/e56891d5-7fca-44ee-b69c-2a26cc05bbad/scratchpad/r5';
fs.mkdirSync(OUT, { recursive: true });
const PAGES = ['problems', 'interceptos', 'agents', 'insights', 'labs', 'case-sap-video'];
const browser = await puppeteer.launch({ headless: 'shell' });
for (const name of PAGES) {
  const p = await browser.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(`http://localhost:4340/concept-d/pages/explore/${name}.html`, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 900));
  const over = await p.evaluate(() => document.documentElement.scrollHeight - document.documentElement.clientHeight);
  await p.screenshot({ path: `${OUT}/${name}.png` });
  console.log(name, 'overflow:', over);
  await p.close();
}
await browser.close();
