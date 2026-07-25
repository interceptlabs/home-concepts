# LOCKUP-FIX — concept-d header wordmark rasterization

**Direction (Jon):** the lockup wordmark renders crunchy/unsmooth — it's the black text paths, not the glitch. Fix the translate/viewBox mismatch on the wordmark group, make the rendered logo height map to a pixel-clean scale, remove any resting CSS transform on the logo, verify with zoomed header crops at DPR 1 and 2, and add that crop check as a permanent gate. The deployed-header exemption does not apply to rendering quality.

## Root cause (measured, not guessed)

Three compounding sub-pixel offsets, all measured headless at 1440×900:

1. **Translate/viewBox mismatch on the wordmark group.** Every lockup SVG was `viewBox="0 -9 324.005 76.2147"` with the black wordmark inside `<g transform="translate(0, -10)">`. At the rendered scale (30px / 76.2147 units = 0.3936772) that runtime translate is a **-3.9368px fractional pixel shift** applied to every letterform path.
2. **Fractional rendered scale with no pixel anchor.** deployed.css sizes `.logo` at `height:30px` against the 76.2147-unit viewBox — scale 0.3936772, so the cap band (43.5892 user units) mapped to 17.16px with cap tops and baseline landing mid-pixel.
3. **Near-half-pixel logo position.** The topbar row's tallest child was `.cta-nav` at 41.1875px (9px vertical padding + a fractional line box), so flex centering parked the 30px logo at **y = 20.59375** — a 0.59px offset that smeared every horizontal edge (cap tops, baseline, crossbars) across two pixel rows. This was the dominant DPR-1 crunch.

Resting CSS transforms were checked across the chain (`a[data-fritz-hover-lockup]`, `svg.logo`, inner groups) in deployed.css + concept-d.css: none existed (computed `transform: none` throughout) — the gate now asserts this permanently anyway. The glitch animation was confirmed innocent: it only swaps SVG paths inside the mark slot.

## Fix

**Markup** (all 13 scoped pages: `index.html`, `pages/{os,labs,work,contact}.html`, `pages/explore/*.html` ×8 — header + footer lockups + the unused `#intercept-lockup` symbol, normalized identically for consistency):

- Wordmark group's `translate(0, -10)` **rebaked into the viewBox y-origin and removed** — the wordmark group now carries no transform attribute.
- `viewBox="0 -9 324.005 76.2147"` → `viewBox="0 0.9583 324.005 76.923"`. Height 76.923 = 30/0.39, so deployed.css's untouched `height:30px` now lands a **pixel-clean 0.39 scale**: the cap band (43.5892 units × 0.39 = 16.9998px ≈ 17) puts **cap top and baseline on integer device pixels at both DPR 1 and DPR 2** (cap top svg+4px, baseline svg+21px); the x-height top lands within 0.04px of a pixel boundary. The y-origin 0.9583 places cap top exactly 4px below the svg top. Letterform scale change vs before: -0.93% (imperceptible; the 30px logo box is unchanged).
- Mark slots (`#mark-slot`, `#footer-mark-slot`) `translate(0, -8.78)` → `translate(0, 1.22)`: the mark↔wordmark relative offset stays exactly 1.22 user units, identical to before.

**CSS** (`concept-d.css`, additive only — deployed.css/deployed.js never edited, script-diff stays 13/13):

- `.logo { aspect-ratio: 324.005/76.923; }` — overrides deployed.css's stale 324.005/76.2147 so the box matches the new viewBox (no letterboxing/implicit rescale).
- `.nav .cta-nav { height:42px; display:inline-flex; align-items:center; padding-top:0; padding-bottom:0; }` — pins the row's tallest child to an integer, so the logo flex-centers at **integer y = 21** (42 device px at DPR 2). Bonus: the topbar is now exactly 73px, which `.hero-viewport`'s `min-height: calc(100dvh - 73px)` already assumed (it was rounding up from the old measured 72.1875px — the subtraction is now exact). The stale comment in concept-d.css was updated.

## Alignment verification (approved baseline unchanged)

Mark/wordmark relative alignment, overlay-verified numerically from rendered bounding boxes (normalized by wordmark width):

| Metric | Before | After |
| --- | --- | --- |
| (markX − wmX) / wmW | 1.06008 | 1.06009 |
| (markY − wmY) / wmW | −0.038105 | −0.038104 |
| markW / wmW | 0.269700 | 0.269700 |
| markH / wmW | 0.264300 | 0.264307 |

Identical to 4–5 decimal places — pure re-origin, the approved baseline alignment is untouched.

## Crop evidence (zoomed header crops, read and judged)

In `.planning/phases/10-concept-d-iteration-5/captures/lockup/` (committed; the after-crops regenerate via the gate):

- `before-dpr1.png`, `before-dpr2.png` — pre-fix: smeared cap tops/baseline, uneven stems, muddy counters at DPR 1
- `index-dpr1.png`, `index-dpr2.png`, `explore-problems-dpr1.png`, `explore-problems-dpr2.png` — post-fix: clean single-pixel cap/baseline edges, even stems at DPR 1; DPR 2 fully crisp
- `compare-dpr1.png` — before (top) vs after (bottom) at 6× nearest-neighbor

Measured post-fix: logo rect y=21 h=30 (integers), wordmark cap top at y=25.0002, computed `transform: none` across the resting chain, zero pageerrors.

## Permanent gate

`node qa/lockup-crisp-check.mjs` (documented in `qa/README.md`) — asserts (a) no resting transforms on the logo chain, (b) integer rendered logo height + integer y, (c) no wordmark transform attribute in any concept-d markup + mark slot pinned at `translate(0, 1.22)`, (d) writes DPR-1/DPR-2 crops for human review, (e) zero pageerrors. Exits non-zero on any failure. Current run: 37/37 PASS.

## Other gates after the fix

- `python3 qa/copy-diff.py --mode substring concept-d/index.html concept-d/pages/explore/*.html` → 54 chunks, 0 failures, exit 0
- `python3 qa/concept-d-script-diff.py` → 13 checks, 0 failures (deployed.css/deployed.js untouched)
