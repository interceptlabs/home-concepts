---
phase: 02-concept-a-editorial-accenture-but-better
plan: 03
subsystem: ui
tags: [motion, intersection-observer, css-animation, qa, copy-diff, headless-chrome, puppeteer]

# Dependency graph
requires:
  - phase: 02-01
    provides: concept-a homepage (hero, card grid, problems, InterceptOS band, work, clients, convert, footer)
  - phase: 02-02
    provides: concept-a derived sub-pages (interceptos.html, insights.html, work-*.html)
provides:
  - Sparing IntersectionObserver-driven scroll reveal across all 6 concept-a pages
  - One-time hero load stagger (kicker/h1-lines/sub/CTA) built on shared motion tokens only
  - Single permitted hover accent (card kicker weight/color shift to Flarepop)
  - prefers-reduced-motion + no-JS safety guarantees (belt-and-braces, verified)
  - Full mechanical QA sweep closing out Phase 2: copy-diff --all, brand grep suite, 9 responsive captures
affects: [phase-05-cross-concept-qa]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "has-js bootstrap class (synchronous inline script in <head>, before stylesheets take effect) gates all hide-then-reveal CSS so JS-disabled visitors see full content immediately"
    - "IntersectionObserver reveal-once pattern: observe [data-reveal], add .is-visible, unobserve — no continuous/scroll-scrubbed motion"
    - "prefers-reduced-motion checked in both CSS (@media query forcing final state) and JS (skips observing, marks everything visible) — belt-and-braces per research"
    - "Hero stagger is pure CSS (@keyframes + animation-delay), not JS-driven — runs once on load regardless of scroll position"
    - "Responsive QA captures via Puppeteer driving the real installed Google Chrome (not the puppeteer-bundled 'Chrome for Testing', which hung on Page.captureScreenshot in this sandbox) with page.setViewport() + setJavaScriptEnabled(false) for full-page, all-content-visible layout review"

key-files:
  created:
    - concept-a/assets/js/motion.js
    - .planning/phases/02-concept-a-editorial-accenture-but-better/captures/*.png (9 files)
  modified:
    - concept-a/assets/css/concept-a.css
    - concept-a/index.html
    - concept-a/pages/interceptos.html
    - concept-a/pages/insights.html
    - concept-a/pages/work-hp-abx.html
    - concept-a/pages/work-intel-abm.html
    - concept-a/pages/work-sap-video.html

key-decisions:
  - "20 data-reveal targets on the homepage (card-grid cards, problems statement + 4 entries, InterceptOS band framing + 4 chip groups, 3 work cards, clients strip, convert, footer) and 4-10 per sub-page — sparing section-level reveals, never per-word theatrics"
  - "Hero h1 split into exactly two `.line` spans (matching the plan's literal markup) so hero.h1_html still passes copy-diff's tag-stripped comparison; kicker/sub/CTA staggered in the same cascade (0/120/240/360/480ms) since it read well composed, though the plan only mandated the two `.line` delays"
  - "ONE hover accent added: `.card:hover .card__kicker` shifts to Flarepop with a color-only transition — pre-existing hover states from 02-01/02-02 (link colors, button opacity, work-card border) were left untouched as out-of-scope prior work, not new motion"
  - "Puppeteer's bundled 'Chrome for Testing' binary hung indefinitely on any Page.captureScreenshot call in this sandbox (even a plain viewport screenshot) — switched executablePath to the real installed Google Chrome, which worked immediately; also found that mixing a raw CDP Emulation.setDeviceMetricsOverride session with Puppeteer's own screenshot call produced a corrupted partial-width render (agent-groups grid appeared 1-column), while Puppeteer's own page.setViewport() rendered correctly — confirmed via live getBoundingClientRect/getComputedStyle that the actual DOM/CSS layout was always correct (4 equal grid columns), so the artifact was capture-tooling-only, not a product bug"
  - "Final captures taken with JS disabled (page.setJavaScriptEnabled(false)) rather than JS-enabled with a post-load wait: this makes every [data-reveal]/hero-stagger element fully visible for a meaningful layout review AND simultaneously verifies the no-JS content-visibility guarantee, exactly as the plan's contingency note anticipated"

# Metrics
duration: 22min
completed: 2026-07-24
---

# Phase 2 Plan 3: Kinetic Layer + Phase-Closing QA Summary

**Sparing IntersectionObserver scroll-reveal + one-time hero load stagger + single card hover accent, all built on shared motion tokens, followed by a full mechanical QA sweep (copy-diff, brand greps, 9 responsive captures) closing out Concept A.**

## Performance

- **Duration:** 22 min
- **Started:** 2026-07-24T04:00:00Z (approx.)
- **Completed:** 2026-07-24T04:22:16Z
- **Tasks:** 2 completed
- **Files modified:** 8 (7 concept-a source files + 9 new capture PNGs)

## Accomplishments
- Vanilla-JS scroll-reveal system (`concept-a/assets/js/motion.js`): one `IntersectionObserver` (threshold 0.15), reveal-once, with a `prefers-reduced-motion` short-circuit and a no-`IntersectionObserver` fallback — both mark everything visible immediately rather than hiding it forever
- CSS-only hero load stagger: the h1 split into two `.line` phrase spans, cascading in with the kicker/sub/CTA via `@keyframes hero-rise` on `var(--dur-med)`/`var(--ease-inout-sine)`, entirely scoped under `.has-js` so no-JS visitors see the finished state instantly
- Single permitted hover accent (`.card:hover .card__kicker` → Flarepop, color-only transition) — no other new hover motion added
- `prefers-reduced-motion` forces every animated thing (`[data-reveal]`, hero kicker/lines/sub/CTA) to its final visible state with `animation: none; transition: none;`, in addition to the JS-side check
- All 6 concept-a pages wired: `has-js` bootstrap script + deferred `motion.js` + `data-reveal` on section-level targets only (20 on the homepage, 4-10 per sub-page) — never per-word or continuous motion
- Phase-closing mechanical QA: `copy-diff --all concept-a` (430/430 chunks, 0 failures), full brand grep suite (banned tagline, deprecated mark hexes, `<hr>`, raw hex text colors, non-Flarepop colored text, radial/conic gradients, `view-transition-name`) all clean, gradient audit confirms the one remaining hit is the pre-existing hard-step `repeating-linear-gradient`
- 9 responsive captures (index/interceptos/work-hp-abx × 390/768/1440) reviewed for layout correctness: no horizontal overflow at any width, hero type never clips, card/chip/work grids collapse correctly (4→2→1 columns as designed)

## Task Commits

Each task was committed atomically:

1. **Task 1: Motion layer — scroll reveal, hero stagger, one hover accent, guards everywhere** - `67e89f5` (feat)
2. **Task 2: Mechanical QA pass — full gate, brand greps, responsive captures** - `83e21f7` (test)

**Plan metadata:** (this commit, following SUMMARY/STATE/ROADMAP update)

## Files Created/Modified
- `concept-a/assets/js/motion.js` - IntersectionObserver reveal-once scroll motion with reduced-motion + no-observer-support fallbacks
- `concept-a/assets/css/concept-a.css` - `[data-reveal]` transition rules, `@keyframes hero-rise` + per-element delays, `.card:hover .card__kicker` accent, `@media (prefers-reduced-motion: reduce)` override block
- `concept-a/index.html` - `has-js` bootstrap, `motion.js` script tag, hero `.line` spans + `hero__kicker`/`hero__cta` classes, 20 `data-reveal` targets
- `concept-a/pages/interceptos.html` - same wiring, 10 `data-reveal` targets (page-hero, 4 os-flow articles, agent-roster section-head, 4 agent-roster groups)
- `concept-a/pages/insights.html` - same wiring, 4 `data-reveal` targets (page-hero + 3 episode rows)
- `concept-a/pages/work-hp-abx.html`, `work-intel-abm.html`, `work-sap-video.html` - same wiring, 5 `data-reveal` targets each (case-hero + 4 case-story blocks)
- `.planning/phases/02-concept-a-editorial-accenture-but-better/captures/*.png` - 9 QA captures (3 pages × 3 widths), no-JS mode, full-page

## Decisions Made
- Homepage reveal count (20) and per-sub-page counts (4-10) land within the plan's "roughly 10-20 / 4-10" sparing guidance by targeting exactly the section-level groups the plan named (card-grid cards, statement moment, problem entries, OS band framing + chip groups, work cards, client strip, convert, footer) rather than every possible sub-element
- Hero stagger cascades the kicker/sub/CTA alongside the two mandated `.line` delays (0/120/240/360/480ms) since it read as one composed load moment, per the plan's "if it reads well" discretion clause
- Kept the single new hover accent scoped to `.card__kicker` only; left 02-01/02-02's pre-existing hover states (nav links, buttons, work-card border, title-link color) untouched since they predate this plan's motion scope and aren't gratuitous additions
- Diagnosed and worked around two headless-Chrome capture quirks specific to this sandbox (documented below) rather than accepting broken/misleading QA captures

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Puppeteer's bundled Chrome binary hung on screenshot; real Chrome + correct viewport API required for valid captures**
- **Found during:** Task 2 (responsive captures)
- **Issue:** The plan's literal bash script uses bare-CLI `--window-size`. Testing confirmed this CLI flag does NOT clamp in this environment (unlike the concern noted from 02-01) — three widths (390/768/1440) all measured pixel-accurate via `sips`. However, that CLI screenshot mode only captures a fixed viewport height (not true full-page), truncating most of the page below ~3400px — unacceptable for reviewing sections like InterceptOS band, work, clients, convert, and footer on tall pages (actual scrollHeight up to 12,302px at 390 width). Switching to Puppeteer for full-page capture, the puppeteer-bundled "Chrome for Testing" binary hung indefinitely on `Page.captureScreenshot` in this sandbox (reproduced on a trivial viewport-only screenshot with no page content involved). Separately, driving a raw CDP `Emulation.setDeviceMetricsOverride` session alongside Puppeteer's own screenshot call produced a visually corrupted capture where the InterceptOS agent-groups grid appeared to render as a single column at 1440px width — cross-checked live via `getBoundingClientRect`/`getComputedStyle` and confirmed the actual DOM layout was always correct (4 equal 307px columns); the corruption was a capture-tooling artifact from mixing manual CDP calls with Puppeteer's internal viewport state, not a CSS/HTML bug.
- **Fix:** Launched Puppeteer with `executablePath` pointing at the real installed Google Chrome (not the bundled Testing binary), used Puppeteer's own `page.setViewport()` (not manual CDP `Emulation.setDeviceMetricsOverride`) for width emulation, and used `page.setJavaScriptEnabled(false)` + `fullPage: true` screenshots — this simultaneously produces full-page, all-content-visible captures (bypassing the has-js reveal-gating for a meaningful layout review) and independently verifies the no-JS content-visibility guarantee.
- **Files modified:** None (QA tooling only, `.planning/phases/.../captures/*.png` are the output)
- **Verification:** All 9 captures measured pixel-accurate widths via `sips`, all well above the 8KB size floor, and were read/visually reviewed — no overflow, no clipping, correct 4/2/1-column grid collapse at every breakpoint on every page
- **Committed in:** `83e21f7` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking — QA tooling only, no product code touched)
**Impact on plan:** No impact on shipped concept-a code; this was purely a capture-tooling diagnosis needed to produce trustworthy QA evidence. The plan's literal CLI script would have produced captures that were technically valid dimensions but silently truncated most of the page content, which could have hidden real layout bugs below the fold.

## Issues Encountered
None beyond the QA tooling deviation documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Concept A (Phase 2) is complete: homepage (02-01) + derived sub-pages (02-02) + kinetic layer and full mechanical QA (02-03), all verified — copy-diff clean across all 6 pages, brand grep suite clean, responsive layout confirmed at 390/768/1440
- CONA-05 satisfied: sparing scroll reveals + one-time hero stagger + one hover accent, all on shared motion tokens, fully guarded by `prefers-reduced-motion` and no-JS fallbacks
- Ready for Phase 5's cross-concept QA and Jon's side-by-side review at `http://localhost:4340/concept-a/`
- No blockers carried forward from this plan

---
*Phase: 02-concept-a-editorial-accenture-but-better*
*Completed: 2026-07-24*

## Self-Check: PASSED

- FOUND: concept-a/assets/js/motion.js
- FOUND: .planning/phases/02-concept-a-editorial-accenture-but-better/captures/index-390.png
- FOUND: .planning/phases/02-concept-a-editorial-accenture-but-better/02-03-SUMMARY.md
- FOUND: commit 67e89f5 (Task 1)
- FOUND: commit 83e21f7 (Task 2)
