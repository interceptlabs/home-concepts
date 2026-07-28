import puppeteer from 'puppeteer';
import fs from 'node:fs';
const OUT = '/private/tmp/claude-501/-Users-jontoewsinterceptgroup-com/be9e6778-909e-4f8d-bd6f-ecedd7fe7516/scratchpad/r6';
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ headless: 'shell' });
const p = await browser.newPage();
const errs = [];
p.on('pageerror', e => errs.push(String(e)));
await p.setViewport({ width: 1440, height: 900 });
await p.goto('http://localhost:4340/concept-d/pages/explore/agents.html', { waitUntil: 'load' });
await new Promise(r => setTimeout(r, 900));

// open the first agent card
await p.click('.agent-card-v6');
await new Promise(r => setTimeout(r, 600));
console.log('open state:', await p.evaluate(() => {
  const o = document.getElementById('agentDetailOverlay');
  const b = document.getElementById('agentDetailBackdrop');
  const r = o.getBoundingClientRect();
  const bodyPane = o.querySelector('.ad-body');
  return JSON.stringify({
    isOpen: o.classList.contains('is-open'),
    backdropVisible: getComputedStyle(b).opacity === '1' && getComputedStyle(b).pointerEvents === 'auto',
    backdropCoversTopbar: b.getBoundingClientRect().top === 0,
    rect: { t: Math.round(r.top), l: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) },
    bodyScrollable: bodyPane.scrollHeight > bodyPane.clientHeight,
    name: document.getElementById('adName').textContent,
    focusInModal: o.contains(document.activeElement),
  });
}));
await p.screenshot({ path: `${OUT}/agent-modal.png` });

// Esc closes
await p.keyboard.press('Escape');
await new Promise(r => setTimeout(r, 400));
console.log('after Esc:', await p.evaluate(() => {
  const o = document.getElementById('agentDetailOverlay');
  const b = document.getElementById('agentDetailBackdrop');
  return JSON.stringify({ isOpen: o.classList.contains('is-open'), backdropOpacity: getComputedStyle(b).opacity });
}));

// reopen + CTA opens contact drawer
await p.click('.agent-card-v6');
await new Promise(r => setTimeout(r, 500));
await p.click('#agentDetailContact');
await new Promise(r => setTimeout(r, 500));
console.log('after CTA:', await p.evaluate(() => {
  const o = document.getElementById('agentDetailOverlay');
  const d = document.getElementById('convoDrawer');
  return JSON.stringify({ modalOpen: o.classList.contains('is-open'), drawerOpen: d.classList.contains('open'), context: document.getElementById('convoContext').textContent });
}));
await p.screenshot({ path: `${OUT}/agent-cta-drawer.png` });

// close drawer, reopen modal, click backdrop to close
await p.keyboard.press('Escape');
await new Promise(r => setTimeout(r, 400));
await p.click('.agent-card-v6');
await new Promise(r => setTimeout(r, 500));
await p.mouse.click(30, 450); // left edge = backdrop
await new Promise(r => setTimeout(r, 400));
console.log('after backdrop click:', await p.evaluate(() => JSON.stringify({ isOpen: document.getElementById('agentDetailOverlay').classList.contains('is-open') })));

console.log('pageerrors:', errs.length, errs.slice(0, 3));
await browser.close();
console.log('done');
