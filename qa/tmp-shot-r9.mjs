import puppeteer from 'puppeteer';
import fs from 'node:fs';
const OUT = '/private/tmp/claude-501/-Users-jontoewsinterceptgroup-com/be9e6778-909e-4f8d-bd6f-ecedd7fe7516/scratchpad/r9';
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ headless: 'shell' });

// overflow sweep at both proof sizes
const PAGES = ['problems', 'interceptos', 'agents', 'insights', 'labs', 'case-sap-video'];
for (const [w, h] of [[1440, 900], [1280, 800]]) {
  for (const name of PAGES) {
    const p = await browser.newPage();
    await p.setViewport({ width: w, height: h });
    await p.goto(`http://localhost:4340/concept-d/pages/explore/${name}.html`, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 900));
    const over = await p.evaluate(() => document.documentElement.scrollHeight - document.documentElement.clientHeight);
    console.log(`${name} @${w}: overflow ${over}`);
    if (w === 1440) await p.screenshot({ path: `${OUT}/${name}.png` });
    await p.close();
  }
}

// interceptos: step twice, capture trail states
const p = await browser.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto('http://localhost:4340/concept-d/pages/explore/interceptos.html', { waitUntil: 'load' });
await new Promise(r => setTimeout(r, 900));
await p.click('.q-step-next');
await new Promise(r => setTimeout(r, 200));
await p.click('.q-step-next');
await new Promise(r => setTimeout(r, 300));
console.log('stepper trail:', await p.evaluate(() =>
  [...document.querySelectorAll('.q-step')].map(s => {
    const cs = getComputedStyle(s);
    return `${s.textContent}:${s.classList.contains('is-active') ? 'ACTIVE' : s.classList.contains('is-done') ? 'done bg=' + cs.backgroundColor : 'idle'}`;
  }).join(' | ')));
await p.screenshot({ path: `${OUT}/interceptos-stepped.png` });
await p.close();

// agents: modal open with blur
const a = await browser.newPage();
await a.setViewport({ width: 1440, height: 900 });
await a.goto('http://localhost:4340/concept-d/pages/explore/agents.html', { waitUntil: 'load' });
await new Promise(r => setTimeout(r, 900));
await a.click('.agent-card-v6');
await new Promise(r => setTimeout(r, 600));
console.log('backdrop filter:', await a.evaluate(() => getComputedStyle(document.getElementById('agentDetailBackdrop')).backdropFilter));
await a.screenshot({ path: `${OUT}/agent-modal-blur.png` });
await a.close();

// index reel controls grid alignment + footer state
const i = await browser.newPage();
await i.setViewport({ width: 1440, height: 900 });
await i.goto('http://localhost:4340/concept-d/', { waitUntil: 'load' });
await new Promise(r => setTimeout(r, 800));
await i.evaluate(() => document.getElementById('work-reel').scrollIntoView());
await new Promise(r => setTimeout(r, 900));
console.log('reel controls:', await i.evaluate(() => {
  const c = document.querySelector('.reel-controls');
  const r = c.getBoundingClientRect();
  const wrap = document.querySelector('.reel-top').getBoundingClientRect();
  return JSON.stringify({ controlsRight: Math.round(r.right), wrapRight: Math.round(wrap.right), h: Math.round(r.height) });
}));
await i.screenshot({ path: `${OUT}/index-reel.png` });
await i.close();

// work page: case modal close style check
const wpg = await browser.newPage();
await wpg.setViewport({ width: 1440, height: 900 });
await wpg.goto('http://localhost:4340/concept-d/pages/work.html', { waitUntil: 'load' });
await new Promise(r => setTimeout(r, 900));
await wpg.click('.case-v6');
await new Promise(r => setTimeout(r, 600));
await wpg.screenshot({ path: `${OUT}/case-modal.png` });
await wpg.close();

await browser.close();
console.log('done ->', OUT);
