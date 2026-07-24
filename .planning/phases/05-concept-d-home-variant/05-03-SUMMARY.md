---
phase: 05-concept-d-home-variant
plan: 03
subsystem: ui
tags: [static-html, css, javascript, link-integrity, responsive-qa, copy-verification, concept-d]

# Dependency graph
requires:
  - phase: 05-concept-d-home-variant
    provides: "05-01: concept-d/assets/css/deployed.css, concept-d/assets/js/deployed.js, qa/concept-d-script-diff.py, mirrored about/insights-hub/chatb2b.html"
  - phase: 05-concept-d-home-variant
    provides: "05-02: concept-d/index.html (hero video + 8 cards + 8 module dialogs), concept-d/assets/css/concept-d.css, concept-d/assets/js/cards.js"
provides:
  - "concept-d/pages/{os,labs,work,contact}.html — the 4 standalone section pages (InterceptOS+Agents, Labs, Work, Convert+FAQs) in the deployed header/footer shell, unmodified global drawer scaffold"
  - "deployed.js null-guards making the shared script safe to load on a page carrying only a subset of the 8 modules (a genuinely new deployment shape the single-page deployed site never needed)"
  - "concept-d.css fixes for a real 768px card-grid overflow and a no-JS/dark-theme-fallback legibility gap, both found via honest capture review"
  - "Phase-closing mechanical QA sweep: link-integrity checker (378 links, 0 non-allowlisted failures), 34-assertion Puppeteer nav suite, brand grep suite, both copy gates, 10 reviewed responsive/modal/reduced-motion/no-JS captures, video budget check"
provides_summary: "The 4 standalone section pages wired end-to-end into concept-d's nav, plus the phase's full mechanical + honest-visual QA closing COND-05/COND-06/COND-07"
affects: [06-cross-concept-qa]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Shared deployed.js must null-guard every DOM lookup it uses at top-level init (buildSolve/renderFlow/renderAgents/closeAgentDetail/agentDetailClose+Backdrop) once it's loaded on pages that carry only a SUBSET of the 8 modules — the single continuously-scrolling deployed site never needed this, since every module was always present"
    - "html:not(.has-js) legibility overrides, scoped to new chrome only, reusing deployed.css's own light-theme hex values (named as custom properties, never a literal `color:#hex`, to keep the brand-invented-color grep meaningful) — the correct way to patch a no-JS/dark-fallback contrast gap without touching deployed.css's actual tokens"
    - "width:100% on a grid item is sometimes load-bearing, not decorative: nested inside a flex column, repeat(auto-fit, minmax(...)) can resolve against an ambiguous available size and overflow"

key-files:
  created:
    - concept-d/pages/os.html
    - concept-d/pages/labs.html
    - concept-d/pages/work.html
    - concept-d/pages/contact.html
    - .planning/phases/05-concept-d-home-variant/deferred-items.md
    - .planning/phases/05-concept-d-home-variant/captures/index-390.png
    - .planning/phases/05-concept-d-home-variant/captures/index-768.png
    - .planning/phases/05-concept-d-home-variant/captures/index-1440.png
    - .planning/phases/05-concept-d-home-variant/captures/index-modal-agents-1440.png
    - .planning/phases/05-concept-d-home-variant/captures/index-modal-problems-390.png
    - .planning/phases/05-concept-d-home-variant/captures/os-390.png
    - .planning/phases/05-concept-d-home-variant/captures/os-768.png
    - .planning/phases/05-concept-d-home-variant/captures/os-1440.png
    - .planning/phases/05-concept-d-home-variant/captures/index-reduced-1440.png
    - .planning/phases/05-concept-d-home-variant/captures/index-nojs-1440.png
  modified:
    - concept-d/assets/js/deployed.js
    - concept-d/assets/css/concept-d.css

key-decisions:
  - "contact.html renders Convert before FAQs (not FAQs-then-Convert) — the page's purpose is contact, FAQs support it; a discretion call per the plan's own note"
  - "Concept D uses substring-mode copy-diff + qa/concept-d-script-diff.py instead of the shared/README annotated data-copy convention every other concept uses — a documented, locked exception for this phase only, since Concept D ports the deployed page's own JS-templated copy verbatim rather than hand-authoring data-copy-annotated markup"
  - "The Puppeteer-rendered-DOM copy-diff variant that would close copy-diff's JS-templated-copy blind spot is deferred to Phase 6, not built here (per 05-RESEARCH's own recommendation)"
  - "Mirrored pages (about.html, insights-hub.html, chatb2b.html) are gate-exempt (copy-diff, script-diff) — they ARE the source, not a port"

requirements-completed: [COND-01, COND-05, COND-06, COND-07]

# Metrics
duration: 30min
completed: 2026-07-24
---

# Phase 5 Plan 03: Standalone Section Pages + Phase-Closing QA Summary

**Built the 4 standalone section pages (os/labs/work/contact.html) from the same ported modules in the deployed shell, then closed Phase 5 with a full mechanical + honest-visual QA sweep that found and fixed 5 real bugs: 2 deployed.js DOM-guard crashes, 1 dead in-page anchor, 1 768px card-grid overflow, and 1 no-JS contrast failure.**

## Performance

- **Duration:** 30 min
- **Tasks:** 3
- **Files created:** 15 (4 pages, 10 captures, 1 deferred-items log)
- **Files modified:** 2 (deployed.js, concept-d.css)

## Accomplishments
- `concept-d/pages/os.html` (InterceptOS + Agents), `labs.html`, `work.html`, `contact.html` (Convert + FAQs) assembled via a one-off extraction script that lifts exact verbatim blocks out of the already-verified `index.html` (header/footer rewritten for `pages/` context, SVG defs, `fritz-glitch-source`, global drawer scaffold, JSON-LD FAQ schema on contact.html only) — never hand-retyped
- Discovered and fixed a genuine architectural gap in `deployed.js`: its top-level init (`buildSolve()`, `renderFlow()`, `renderAgents()`, `closeAgentDetail()`, the `agentDetailClose`/`agentDetailBackdrop` listeners) assumed every one of the 8 modules always lives on the same page — true for `index.html`, never true for a standalone page carrying only a subset. Without null-guards, the very first uncaught exception (`buildSolve()` against a missing `#solveDetail`) would have silently aborted the rest of the shared script — fritz-bg canvases, theme-toggle, logo-glitch — on every standalone page. Fixed with 6 minimal `if(!el) return;` guards; the mutation-tested `concept-d-script-diff.py` gate (which only checks the 5 data-object regions) confirms zero impact on the ported copy
- Link-integrity checker (scratchpad): 8 files scanned, 378 non-external links checked, 33 allowlisted (3 legal pages + un-mirrored insights articles + 1 verified-pre-existing about.html anchor), **0 non-allowlisted failures**
- 34-assertion Puppeteer nav suite: nav round-trips in both directions including mirrored-page re-entry (index→os→work→labs→contact→About→Insights→logo), every drawer/tab/accordion works on its standalone page, **zero page errors** (`page.on('pageerror')`) across all 8 concept-d pages
- 10 responsive/modal/reduced-motion/no-JS captures, every one READ and judged honestly — found and fixed 2 more real bugs (768px card-grid overflow, no-JS contrast failure) before this SUMMARY was written
- Video budget holds: webm 2.29MB (≤4MB), poster 92KB (≤200KB), `autoplay muted playsinline loop` + `poster=` present, webm listed before mp4
- Both copy gates green on the final state of all 5 gated pages: `copy-diff.py --mode substring` (5 pages, 71 chunks, 0 failures) and `concept-d-script-diff.py` (13 checks, 0 failures)

## Task Commits

Each task was committed atomically:

1. **Task 1: Build the 4 standalone section pages from the ported modules** - `afc8f64` (feat)
2. **Task 2: Link integrity + end-to-end nav and page-behavior verification** - `504426a` (fix — the task itself is scratchpad-only per the plan; the real bugs it surfaced were fixed and committed)
3. **Task 3: Responsive/reduced-motion/no-JS captures + video budget + honest review** - `a5a7df4` (fix)

## Files Created/Modified
- `concept-d/pages/os.html` - InterceptOS + Agents modules, deployed header/footer shell (pages/ context hrefs)
- `concept-d/pages/labs.html` - Labs module, deployed header/footer shell
- `concept-d/pages/work.html` - Work module, deployed header/footer shell
- `concept-d/pages/contact.html` - Convert + FAQs modules (in that order — discretion call), JSON-LD FAQ schema
- `concept-d/assets/js/deployed.js` - 6 null-guards preventing crashes on pages with a subset of modules
- `concept-d/assets/css/concept-d.css` - `.card-field{width:100%}` overflow fix; `html:not(.has-js)` legibility overrides for hero-sub/card text
- `.planning/phases/05-concept-d-home-variant/deferred-items.md` - 1 pre-existing, out-of-scope about.html bug logged (not fixed)
- `.planning/phases/05-concept-d-home-variant/captures/*.png` - 10 reviewed captures

## Decisions Made

- **contact.html order (Convert then FAQs):** the plan's own interfaces block calls this out as a discretion point — the page's purpose is contact, so FAQs support it rather than lead it.
- **Concept D's copy-fidelity gate is substring-mode + script-diff, not annotated data-copy:** locked by 05-CONTEXT.md and documented again here as the explicit exception to `shared/README.md`'s binding "canonical copy must live as `data-copy`-annotated text nodes" rule — Concept D ports the deployed page's own JS-templated data objects verbatim instead of hand-authoring markup from `content/homepage.json`, so annotating with `data-copy` would mean re-authoring, not porting.
- **The Puppeteer-rendered-DOM copy-diff variant is a deferred Phase 6 upgrade, not built here** — 05-RESEARCH.md's own recommendation, re-confirmed: the mechanical `concept-d-script-diff.py` brace-counting gate is the cheaper, deterministic compensating control for this phase.
- **Mirrored pages (about/insights-hub/chatb2b) stay gate-exempt** — they ARE the staging source, not a port, so copy-diff/script-diff don't run against them.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `deployed.js`'s top-level init crashed on any standalone page missing a module**
- **Found during:** Task 1 assembly, confirmed by Task 2's nav suite
- **Issue:** `buildSolve()`, `renderFlow()`, `renderAgents()` unconditionally set `.innerHTML` on `#solveDetail`/`#probFlow`/`#agentsGrid` with no null check; `closeAgentDetail()` and the `agentDetailClose`/`agentDetailBackdrop` click listeners unconditionally read `.classList`/called `.addEventListener` on `agentDetailOverlay`/`agentDetailBackdrop`. Every one of these elements only exists inside the Problems/InterceptOS/Agents modules — present together only on `index.html` (all 8 modules) and (for the Agents-only case) `os.html`. On `labs.html`/`work.html`/`contact.html`, the very first of these calls (`buildSolve()`) threw an uncaught `TypeError`, which — since this is all one non-module `<script>` file — aborted every remaining top-level statement in `deployed.js`, silently killing the fritz-bg canvas engine, the theme-toggle, and the logo-glitch animation on those pages too.
- **Fix:** Added 6 minimal `if(!el) return;` guards (or an inline null check before dereferencing), zero behavior change on any page where the element exists.
- **Files modified:** `concept-d/assets/js/deployed.js`
- **Verification:** `qa/concept-d-script-diff.py` (checks only the 5 data-object regions, unaffected) stays 13/13 green; the 34-assertion nav suite proves every guarded function still works correctly wherever its module IS present (os.html: flow/agents render + detail pane + convo bridge all pass).
- **Committed in:** `afc8f64` (4 of the 6 guards, found during Task 1) and `504426a` (`closeAgentDetail`'s guard, found during Task 2's nav suite when `labs.html`'s pitch-drawer click crashed)

**2. [Rule 1 - Bug] `contact.html`'s ported FAQ answer links to a `#labs` anchor that doesn't exist on that page**
- **Found during:** Task 2, link-integrity pass
- **Issue:** The verbatim "What is Intercept Labs?" FAQ answer ends with `<a href="#labs">Read more.</a>` — a same-page anchor that resolves on `index.html` (Labs lives there as a dialog) but is dead on `contact.html`, which has no Labs section (Labs is its own standalone page in this architecture).
- **Fix:** Rewrote the href to `labs.html` — a link-target change, not a copy change; the visible text "Read more." is byte-identical.
- **Files modified:** `concept-d/pages/contact.html` (via the build script's rewrite step)
- **Verification:** Link checker: 0 failures; both copy gates unaffected (hrefs aren't extracted as visible text).
- **Committed in:** `504426a`

**3. [Rule 1 - Bug] Card grid silently clipped 2 of 8 cards at 768px width**
- **Found during:** Task 3, honest 768px capture review
- **Issue:** `.card-field` (a grid item inside `.hero-viewport`'s flex column) had no explicit width. `repeat(auto-fit, minmax(220px,1fr))` resolved against an ambiguous available size and computed 4 fixed 220px tracks (984px total) instead of 3 stretched ones, overflowing past the 768px viewport. `html,body{overflow-x:clip}` (deployed.css, unmodified) silently hid that overflow instead of showing a scrollbar — 2 of the 8 homepage cards were rendered fully off-screen and unreachable, invisible to any mechanical gate.
- **Fix:** Added `width:100%` to `.card-field`, giving the grid a definite size before track-count resolution. Cards now wrap correctly into 3/3/2 at 768px.
- **Files modified:** `concept-d/assets/css/concept-d.css`
- **Verification:** Direct `getBoundingClientRect()` check confirmed `.card-field` width dropped from 984px to 768px with 3 proper 227px columns; re-captured `index-768.png` shows all 8 cards, no clipping; both copy gates + script-diff + nav suite re-verified green.
- **Committed in:** `a5a7df4`

**4. [Rule 1 - Bug] No-JS fallback rendered hero-sub and all 8 fallback cards nearly illegible**
- **Found during:** Task 3, honest no-JS capture review
- **Issue:** Without JS, the inline theme-init script never runs, so the page falls back to the base (dark) `:root` tokens — documented, accepted behavior from 05-02 (COND-07 requires card/nav degradation, not full no-JS theme parity). But `.hero-sub`/`.card-eyebrow`/`.card-teaser`/`.card-heading` use `--fg-2`/`--fg` tokens, and the dark theme's `--fg-2` (`#d1d6e6`, a light-on-dark color) rendered against two pieces of new chrome that are hardcoded always-light (the video, and `.card`'s near-white surface) — producing washed-out, near-invisible text on both the hero subhead and every one of the 8 fallback cards.
- **Fix:** Added `html:not(.has-js)` overrides reusing deployed.css's own light-theme `--fg`/`--fg-2` hex values verbatim (not invented colors — named as custom properties so the brand grep's bare `color:#hex` check stays meaningful), scoped to exactly the affected elements.
- **Files modified:** `concept-d/assets/css/concept-d.css`
- **Verification:** Re-captured `index-nojs-1440.png` — hero-sub and all 8 fallback card headings/eyebrows/teasers now render in dark ink, fully legible; brand grep suite (no invented hex colors) re-verified clean; both copy gates + script-diff + nav suite re-verified green.
- **Committed in:** `a5a7df4`

---

**Total deviations:** 4 auto-fixed (all Rule 1 — bugs found via a combination of the mechanical link/nav gates and honest capture review, exactly the two complementary QA modes this task exists to run). **Impact:** All four are scoped to new chrome (concept-d.css) or the shared script's own defensive null-guards (deployed.js) — no ported module markup, styles, or copy were touched. No scope creep.

### Logged, Not Fixed (Out of Scope)

**`concept-d/about.html`'s "Skip to content" link (`href="#main"`) has no matching `id="main"`** — verified pre-existing in the staging source itself (identical line numbers), predating concept-d's 05-01 mirror. Mirrored pages are locked "as-is" per CONTEXT and this bug is outside 05-03's authored-file scope. Logged to `.planning/phases/05-concept-d-home-variant/deferred-items.md`; allowlisted in the link-integrity checker as a documented pre-existing dead anchor (same category as the 3 legal-page links and the un-mirrored insights articles).

## Issues Encountered
None beyond the four documented deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness

- All 4 requirements this plan targets are complete: **COND-05** (nav → standalone pages, About/Insights → mirrored pages), **COND-01** (header/footer/logo shell consistent across index + 4 pages), **COND-06** (copy verbatim mechanically proven via substring + script-diff gates, visual fidelity judged via reviewed captures), **COND-07** (keyboard/focus/Esc paths proven on index in 05-02, drawers/accordions proven on standalone pages here, no-JS path captured and legible)
- **Phase 6 handoff notes** (per the plan's own output spec):
  1. Concept D uses substring-mode `copy-diff.py` + `qa/concept-d-script-diff.py` instead of the shared/README annotated `data-copy` convention every other concept uses — a documented, locked exception for this phase, not an oversight.
  2. The Puppeteer-rendered-DOM copy-diff variant that would close the JS-templated-copy blind spot completely is the deferred Phase 6 upgrade (per 05-RESEARCH.md's own recommendation).
  3. Mirrored pages (`about.html`, `insights-hub.html`, `chatb2b.html`) are gate-exempt — they ARE the staging source, not a port — and carry one logged, pre-existing, out-of-scope bug (`deferred-items.md`).
- Phase 5 (Concept D) is now fully complete: 05-01, 05-02, 05-03 all done, all 7 requirements (COND-01 through COND-07) satisfied. Ready for `/gsd:plan-phase 6` (cross-concept QA + gallery packaging).
- No blockers.

---
*Phase: 05-concept-d-home-variant*
*Completed: 2026-07-24*

## Self-Check: PASSED

All 17 created/modified files verified present on disk (`[ -f ]`); all 3 task commits (`afc8f64`, `504426a`, `a5a7df4`) verified present in `git log --oneline --all`.
