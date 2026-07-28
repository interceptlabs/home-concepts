#!/usr/bin/env node
/* qa/no-rule-lines-check.mjs — permanent brand gate: NO decorative accent
 * rule-lines / highlight bars anywhere in Concept D.
 *
 * Fritz rule [[feedback_no_rule_lines]]: never a decorative underline / divider /
 * accent rule-line. This caught nothing before, so a ported staging article's
 * magenta card top-bar (.hero-numbers::before) + reading-progress bar shipped
 * (Jon, 2026-07-28). This gate flags them statically.
 *
 * A VIOLATION is a CSS rule that is BOTH:
 *   - accent-coloured  (background / border in the Flarepop ramp or var(--accent*),
 *                        or a gradient containing an accent hex), AND
 *   - shaped as an EDGE BAR or a coloured DIVIDER:
 *       · a thin bar (height<=6px) pinned to an edge (top:0|bottom:0 + left:0|right:0|width:100%), or
 *       · a thin vertical bar (width<=6px) pinned to an edge, or
 *       · an accent-coloured border-top/bottom/left/right (a coloured underline/divider).
 * Exempt: small markers (border-radius:50% dots, short list dashes not pinned to an
 * edge), data-viz swatches, and any selector neutralised elsewhere with display:none
 * / content:none (cascade-aware).
 *
 * Run: node qa/no-rule-lines-check.mjs   (exit 0 = clean, 1 = violations)
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CD = path.join(ROOT, 'concept-d');

const htmls = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!/node_modules|assets\/vendor/.test(p)) walk(p); }
    else if (e.name.endsWith('.html')) htmls.push(p);
  }
})(CD);

const ACCENT = /(var\(--accent[\w-]*\)|var\(--flarepop[\w-]*\)|#ff00e5|#df00be|#a8008c|#700063|#39003a|#ff44f9|#ff52f9)/i;
const ruleRe = /([^{}]+)\{([^{}]*)\}/g;

function num(body, prop) {
  const m = new RegExp(prop + '\\s*:\\s*(-?\\d+(?:\\.\\d+)?)px').exec(body);
  return m ? parseFloat(m[1]) : null;
}
function has(body, re) { return re.test(body); }

let violations = [];
for (const file of htmls) {
  const src = fs.readFileSync(file, 'utf8');
  // gather CSS from <style> blocks only, with comments stripped (so a comment
  // before a selector doesn't corrupt the selector string / break exemptions)
  const css = (src.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || []).join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  // selectors neutralised anywhere (cascade-aware exemption)
  const neutralised = new Set();
  let m;
  ruleRe.lastIndex = 0;
  const rules = [];
  while ((m = ruleRe.exec(css))) {
    const sel = m[1].trim().replace(/\s+/g, ' ');
    const body = m[2];
    rules.push({ sel, body });
    if (/display\s*:\s*none/i.test(body) || /content\s*:\s*none/i.test(body)) neutralised.add(sel);
  }
  for (const { sel, body } of rules) {
    if (neutralised.has(sel)) continue;
    if (/border-radius\s*:\s*50%/i.test(body)) continue;            // round dot marker
    const b = body.replace(/\s+/g, '');

    // accent-coloured background or gradient
    const bgAccent = /(background(-color)?|background-image)\s*:[^;}]*/i.test(body) &&
      ACCENT.test((/(background(-color)?|background-image)\s*:([^;}]*)/i.exec(body) || [,,,''])[3] || '') ||
      (/linear-gradient|radial-gradient/i.test(body) && ACCENT.test(body) && /height\s*:\s*[0-6]px/i.test(body));

    const h = num(b, 'height'), w = num(b, 'width');
    const pinnedTop = /top:0/.test(b) || /bottom:0/.test(b);
    const pinnedSide = /left:0/.test(b) || /right:0/.test(b) || /width:100%/.test(b);
    const pinnedV = /left:0/.test(b) || /right:0/.test(b);
    const horizBar = h !== null && h <= 6 && pinnedTop && pinnedSide;
    const vertBar = w !== null && w <= 6 && pinnedV && (/top:0/.test(b) || /bottom:0/.test(b) || /height:100%/.test(b));

    // accent-coloured border divider/underline — but NOT a CSS-triangle icon
    // (play buttons etc. draw a triangle with one solid + transparent borders)
    const borderDivider = /border-(top|bottom|left|right)\s*:[^;}]*/i.test(body) &&
      ACCENT.test((/border-(top|bottom|left|right)\s*:([^;}]*)/i.exec(body) || [,,''])[2] || '') &&
      !/transparent/i.test(body);

    if ((bgAccent && (horizBar || vertBar)) || borderDivider) {
      violations.push({ file: path.relative(ROOT, file), sel, snippet: body.replace(/\s+/g, ' ').trim().slice(0, 90) });
    }
  }
}

if (violations.length === 0) {
  console.log(`no-rule-lines-check: ALL PASS — scanned ${htmls.length} pages, 0 decorative accent rule-lines.`);
  process.exit(0);
}
console.error(`no-rule-lines-check: ${violations.length} VIOLATION(S) — decorative accent rule-lines/bars (banned):`);
for (const v of violations) console.error(`  ${v.file}\n    ${v.sel} { ${v.snippet} }`);
process.exit(1);
