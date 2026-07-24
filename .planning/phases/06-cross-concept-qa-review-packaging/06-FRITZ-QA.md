# Fritz Brand QA — intercept-home-concepts (Phase 06 sign-off)

Reviewer: Fritz (Intercept brand gate). Date: 2026-07-24.
Scope: root review gallery + Concepts A–D, judged against the Fritz Brand OS canon
(hero-channel roles, Flarepop-only colored text, logo integrity + baseline canon,
mark-never-decoration / mark-never-overlaps, no-gradients-except-hard-steps,
no decorative rule lines, typography canon, sine-eased motion).
Mechanical grep layers (banned tagline, deprecated 12-path hexes, rule-line greps,
Flarepop-only text) ran green upstream — this pass is the judgment layer.
Binding exemptions honored: concept-d `deployed.css`/`deployed.js`/mirrored chatb2b page
(verbatim ports of the approved live site) and `concept-c/assets/vendor/` were not judged.

## Verification method

- Canonical geometry diffed against `~/Creative-Projects/intercept-brand-kit/assets/template.svg`
  (path-set + transform comparison in Python).
- Rendered overlay comparison (headless Chrome): canonical lockup vs `shared/logo/lockup.svg`
  at identical width — screenshot inspected.
- Every capture set inspected visually, with full-res crops of each lockup placement
  (Concept A topbar/footer, B topbar, C topbar @1440 + @390 + scroll positions, D topbar/footer,
  root gallery header).

---

## Finding 1 — cross-concept MUST-FIX: static lockup is descender-aligned (broken baseline canon)

`shared/logo/lockup.svg` — and every inline copy of it — pairs the canonical mark group
(`translate(0, -8.78)`, triangle base at y=55.08) with a wordmark group carrying an extra
`transform="translate(0, -10)"` (baseline lifted to y=44.80). The canonical lockup has the
wordmark **untranslated** (baseline y=54.80, flush with the triangle base).

Result: the triangle base sits ~10.3 viewBox units below the wordmark baseline — i.e. at
descender depth. That is exactly the descender-aligned reading Jon rejected (2026-05-20:
triangle base aligns to the wordmark **baseline**, not descenders). Confirmed visually in a
rendered overlay against the canonical template and in-situ in the Concept B topbar crop
(triangle droops to the "p" descender) and the root gallery header. There is also ~10 units
of dead space at the bottom of the viewBox, so the lockup floats high inside any box it's
centered in.

Why it happened (root cause): the `-10` wordmark translate was copied from the deployed
site's lockup markup — but the deployed lockup injects its mark via the `mark-slot` /
glitch-source mechanism at *different* coordinates (tuned to that shifted wordmark). Copying
the wordmark shift while pasting the *canonical* mark paths produced a Franken-lockup.
Concept D, which ports the full deployed mechanism, renders baseline-correct (verified in
crop); the static file does not.

Affected surfaces (all in scope):
- `shared/logo/lockup.svg`
- root `index.html` (inline copy)
- `concept-b/index.html` + `concept-b/pages/{work,interceptos,problems}.html` (inline copies)
- `concept-c/index.html` + `concept-c/pages/{work,interceptos,insights}.html` (inline copies)
- `concept-a` (consumes the shared file via `<img>` — see Finding 2)

Fix (small, mechanical): delete `transform="translate(0, -10)"` from the wordmark group in
the shared file and every inline copy (canon wordmark group carries no transform; mark group
keeps `translate(0, -8.78)`; viewBox `0 -9 324.005 76.21` stays). Then re-render and re-crop
each lockup placement per the logo-QA protocol (baseline, apex clearance, descender, 4.25:1
aspect) before re-capture.

## Finding 2 — Concept A MUST-FIX: lockup via `<img src>` renders an invisible wordmark

`concept-a/index.html` (header line 17, footer line 303) — and its sub-pages — embed the
lockup as `<img src="/shared/logo/lockup.svg">`. The shared SVG's wordmark is filled with
`currentColor`, which inside an `<img>` context resolves to the SVG's own initial color —
**black**. On Concept A's Carbon-500 page the wordmark is effectively invisible; only the
magenta triangle shows. Confirmed in full-res crops of `index-1440.png` (topbar + footer)
and `interceptos-1440.png`.

This is the exact failure mode the inline-only rule exists to prevent (lockup must be inlined
as `<svg>`, never `<img src>`): a broken logo on the single most visible brand element, plus
loss of CSS theming. Concepts B/C/D already inline theirs.

Fix: inline the (Finding-1-corrected) lockup as an `<svg>` in Concept A's header/footer —
same pattern the other concepts use; `currentColor` then inherits the intended `--fg`.

## Finding 3 — Concept C MUST-FIX: fixed chrome collides with the headline (lockup overlap included)

Two captured, reproducible collisions:

1. **Lockup over headline on scroll** (`settle2-interceptos.png`): `.topbar` is
   `position: fixed` with **no background** (concept-c.css:79–88), so the 88px hero headline
   scrolls directly beneath/through the lockup — "Intercept ▲" sits on top of
   "proven / briefs into". This violates the hard rule that the mark never overlaps
   headlines/copy (Jon, 2026-05-20: never let the mark overlap other design elements).
2. **Labels over headline at 390** (`settle2-top-390.png`): the projected "PROBLEMS" chip
   covers the Flarepop hero word ("ambitious" is unreadable) and the right-rail topic index
   overlaps "proven"/"INSIGHTS". The headline fails the squint test at the default mobile
   framing.

Fix options (any one per collision): give `.topbar` a solid `var(--page)`/`var(--surface)`
backing (Concepts A/B precedent); fade or translate hero copy out before it reaches topbar
depth; at narrow viewports suppress label projection over the hero-copy region (the 04-03
chip fix solved chip *legibility* but not headline occlusion) and hide the topic index while
the hero block is in view.

---

## Surface-by-surface findings

### 1. Root review gallery (`index.html` + gallery captures)

| # | Severity | Finding |
|---|----------|---------|
| G1 | MUST-FIX | Inline lockup carries the descender-aligned geometry (Finding 1). |
| G2 | NOTE | Otherwise clean: tokens-only styling, Flarepop-only colored text (`Ready for review` status), Instrument Sans/Inter/Geist Mono, sine-eased hover, no rule lines, sentence-case wordmark, thumbnails present (`assets/gallery/*.png`). |

### 2. Concept A — Editorial (`concept-a/`)

| # | Severity | Finding |
|---|----------|---------|
| A1 | MUST-FIX | Lockup embedded via `<img src>` → black-on-Carbon invisible wordmark, header + footer, all pages (Finding 2). Inherits Finding 1 once inlined. |
| A2 | SHOULD-FIX | Display headlines (hero clamp→104px, statement→88px) set no negative tracking. Canon and the approved live homepage both track display type (`-.02em` global h1–h4, `-.03em` hero). Add matching `letter-spacing` to `.hero__h1`, `.statement`, `.section-head__title`, `.page-hero__title`, `.case-hero__title`. |
| A3 | NOTE | `.section--stepped` band: hard-edged, token-only, 5 equal steps — compliant with the no-smooth-gradients rule. It *alternates* two Carbon tones rather than stepping a progression; banding grammar is a still-open Brand OS topic — flagging the alternating variant for CD preference, not as a violation. |
| A4 | NOTE | Color-role discipline is good: Flarepop only for colored text/CTAs; Coolsweep/Wiretree unused (allowed — roles are locked, presence isn't mandatory); Siren/Volts absent. Card keylines are translucent-white hairlines consistent with the live site's `--line` idiom (functional container borders, not decorative rules). |

### 3. Concept B — Full-Screen Video (`concept-b/`)

| # | Severity | Finding |
|---|----------|---------|
| B1 | MUST-FIX | Inline lockup carries the descender-aligned geometry (Finding 1) — index + 3 sub-pages. Confirmed in topbar crop over the video. |
| B2 | SHOULD-FIX | Invented opacity values off the published scale (0/0.2/0.3/0.5/0.8/1): hero panel 58%, hotspots 48%/65%, pause chip 45%, dialog backdrop 72%. Snap to scale rungs (0.5 or 0.8 — 0.8 also strengthens the loop-wide contrast margin the 58% was hand-tuned for). |
| B3 | SHOULD-FIX | Same missing display tracking as A2 (hero, panel h2s, page-hero/case titles). |
| B4 | NOTE | Scrim discipline is right: flat single-alpha Carbon panels only, never a gradient/vignette — compliant with the no-scrims rule. But the translucent-panel-over-brand-video treatment itself, and the liquid-chrome ambient loop as brand imagery, are photography/video territory the Brand OS hasn't codified — CD sign-off needed on the footage direction before this concept advances. |
| B5 | NOTE | Motion canon clean: sine easing tokens throughout, one-time load stagger, reduced-motion collapses everything and never autoplays the video. Flarepop hotspot markers are background fills, not colored text — compliant. |

### 4. Concept C — WebGL topic field (`concept-c/`, settle2 captures)

| # | Severity | Finding |
|---|----------|---------|
| C1 | MUST-FIX | Fixed-chrome collisions with the hero headline: transparent topbar lets the headline scroll under the lockup (`settle2-interceptos.png`); at 390 the PROBLEMS chip covers "ambitious" and the topic index overlaps "proven" (`settle2-top-390.png`) (Finding 3). |
| C2 | MUST-FIX | Inline lockup carries the descender-aligned geometry (Finding 1) — index + 3 sub-pages. |
| C3 | NOTE | The three triangle prisms are Fritz-mark-shaped objects used as environmental 3D geometry. Geometry itself is canon-respecting (apex-up right triangles, right angle at base, lean via z-rotation only ±6–9°, never equilateral/upright/inverted; verified in scene.js and captures). But "the mark as scene object" sits outside the standing exceptions (patterning only) — this is precisely a flag-don't-invent item: Jon/CD should explicitly bless or kill the 3D-prism motif when reviewing this concept. |
| C4 | NOTE | Shading is toon-quantized to 3–4 hard steps with NearestFilter (no smooth grade — compliant in mechanism). The step shades are lighting-derived tints of the surface tokens rather than published ramp values; acceptable for real-time 3D, but it's new banding territory — same CD flag as C3. All material/clear colors read from tokens at runtime; accent highlight is Flarepop, one object at a time. |
| C5 | SHOULD-FIX | Same missing display tracking as A2. |
| C6 | NOTE | No-WebGL/no-JS fallback backdrop reuses the hard-stepped band (compliant); topic labels are real anchors with solid `--surface` chips; reduced-motion gets a static one-shot scene. Good degradation story. |

### 5. Concept D — Home Variant (`concept-d/` new chrome only)

| # | Severity | Finding |
|---|----------|---------|
| D1 | SHOULD-FIX | New card chrome uses soft blurred drop shadows (`0 12px 32px` / `0 18px 40px rgba(...)`). Fritz identity is crisp-edged; the approved deployed stylesheet's only shadows are **zero-blur rings** (`0 0 0 3/4px`). Replace the blur shadows with a solid near-opaque surface + `--line` keyline and/or a zero-blur ring for elevation. |
| D2 | NOTE | New-chrome alphas off the opacity scale (card 0.94, toggle 0.92, backdrop 0.55). Lower priority than B2 since the ported light theme already trades in translucent whites, but snap where painless. |
| D3 | NOTE | Header/footer lockups use the ported deployed `mark-slot` mechanism — exempt, and verified baseline-correct in crops (this is the reference rendering the static lockup should match). Modal content is ported approved modules (sanctioned triangle patterning, agent cards) — exempt. |
| D4 | NOTE | The new light ambient wave loop is new brand footage — same open photography/video topic as B4; needs CD sign-off on the footage direction. Motion in new chrome uses the exact sine bezier with long durations, reduced-motion handled — compliant. Flarepop hero ems over the light field stay the only colored text — compliant. |

### Cross-cutting notes

| # | Severity | Finding |
|---|----------|---------|
| X1 | NOTE | `shared/fonts.css` mirrors the live site's Google Fonts delivery, which requests Inter 400/500/600 and Geist Mono 400/500 — no real 700s, so `--fw-bold: 700` labels/stats render faux-bold. Matches the approved live delivery (precedent), but off type canon (Inter 400–700, Geist Mono accents at 700). Consider adding the 700 axes to the one `@import` when convenient. |
| X2 | NOTE | Verified clean across all five surfaces: banned tagline absent; deprecated 12-path colors (#A855F7/#6366F1/#22D3EE) absent — all inline marks are the 8-path canon; no channel mixing (no purple ramps); sentence-case "Intercept" everywhere; no decorative rule lines (surviving `border-top: none` overrides in A/B CSS are dead code, not renders); spacing/radius/stroke values on-scale. |

---

## Verdict reasoning

The system-level work is genuinely strong — token discipline, copy fidelity, motion canon,
degradation paths, and channel-role discipline are all better than most shipped Intercept
work. But the brand gate fails on the single most visible element: the logo. A
descender-aligned lockup on four of five surfaces (Finding 1), an invisible wordmark on
Concept A (Finding 2), and the lockup/headline collisions on Concept C (Finding 3) are each
independently blocking under the logo-QA and mark-overlap rules. All three have small,
mechanical fixes; after fixing, re-run the lockup crops and re-capture the affected pages.

MUST-FIX list: Finding 1 (shared lockup geometry — gallery, B, C, shared file),
Finding 2 (Concept A `<img>` embed), Finding 3 (Concept C chrome/headline collisions).

Original verdict (2026-07-24, pre-fix): BLOCKED.

---

## Re-review after fixes (2026-07-24)

Scope: the three MUST-FIX findings only, against commit `9a7633b`
("fix(06): resolve Fritz MUST-FIX findings"). Method: fresh Puppeteer renders
(installed Chrome, DPR 2) against the live :4340 server — header/footer crops at 1440,
Concept C at 1440 (settled at `#t-interceptos` + mid-scroll viewport shot) and 390,
plus DOM-level baseline measurement (wordmark "I"-stem bottom vs Flarepop triangle-body
bottom, client px) and source greps. Every claim below is from my own rendered output,
not the fix prose.

### Finding 1 — lockup baseline geometry: RESOLVED

- Source: `shared/logo/lockup.svg` and all 9 inline copies (gallery `index.html`,
  concept-b ×4, concept-c ×4) now carry the wordmark group as `<g fill="currentColor">`
  with **no transform**; mark group keeps `translate(0, -8.78)`; viewBox unchanged.
  Grep for `translate(0, -10)` across scope returns hits only in
  `reference/live-homepage/` (exempt verbatim port).
- Measured (rendered DOM, CSS px): triangle base sits 0.09–0.15 px below the wordmark
  baseline on gallery header, concept-b header, concept-a header + footer, concept-c
  header — flush within sub-pixel. Aspect 4.25:1 on every placement (no squish).
- Visual: zoomed crops of the gallery and concept-b lockups show the triangle base on
  the letter-bottom baseline with the "p" descender extending naturally below; apex and
  decorative top spikes fully inside the viewBox. Reads identical to the concept-d
  reference header crop (deployed mechanism, exempt), which remains baseline-correct.
  (Concept-d's DOM delta measures 4.2 px only because its glitch-stack layers extra
  Flarepop paths — the crop is the honest check there, and it passes.)

### Finding 2 — Concept A invisible wordmark: RESOLVED

- All concept-a pages (index + 5 sub-pages) now inline the corrected lockup as `<svg>`;
  zero `<img src>` lockup embeds remain anywhere in scope.
- Rendered at 1440: header lockup shows the white (`currentColor` → `--fg`) wordmark
  clearly on the Carbon surface; footer lockup ("Powered by curiosity." block) likewise
  white-on-dark, baseline-correct, 4.25:1.

### Finding 3 — Concept C chrome collisions: RESOLVED

- Topbar: computed `background-color` is `rgb(10, 10, 15)` (Carbon-500, opaque).
  Settled at `#t-interceptos` @1440, the Flarepop "proven" headline slices cleanly at
  the topbar's bottom edge — it passes **under** the bar; the lockup sits on solid
  Carbon with no glyph collision. Mid-scroll viewport shot (300 px) confirms the same
  pass-under behavior while a headline line crosses the bar zone.
- 390 hero: full headline legible — "ambitious" (Flarepop) reads completely; the
  PROBLEMS label chip now layers **behind** the hero copy (hero `z-index: 3` over
  label-field `z-index: 2`, `pointer-events: none` pass-through so labels stay
  clickable). Squint test passes.
- 390 topic index: bottom-anchored (16 px above viewport bottom), solid Carbon-300
  chips, no overlap with the hero block (hero copy ends well above the index).

### Carried forward (unchanged by this re-review)

- SHOULD-FIX, still open: display tracking missing (A2/B3/C5), concept-b off-scale
  alphas (B2), concept-d blurred card shadows (D1). Noted for Jon — none blocking.
- CD flags, noted for Jon: ambient video/liquid-chrome footage as new brand territory
  (B4/D4); concept-c mark-shaped 3D prisms + toon-step shading (C3/C4). Flag-don't-invent
  items — need explicit CD bless/kill, not silent adoption.

All three MUST-FIX findings verified resolved in rendered evidence.

## Verdict: RESOLVED
