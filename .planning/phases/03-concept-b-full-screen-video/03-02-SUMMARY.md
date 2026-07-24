---
phase: 03-concept-b-full-screen-video
plan: 02
subsystem: ui
tags: [dialog, view-transitions, copy-diff, vanilla-js, static-html]

# Dependency graph
requires:
  - phase: 03-01
    provides: Concept B homepage shell (video hero, hotspot nav, top bar, no-JS fallback) with `[data-panel]` hotspots already wired to topic ids
provides:
  - Six statically-authored chapter-panel `<dialog>`s in concept-b/index.html, every teaser ref data-copy annotated
  - panels.js — open/close/swap/focus-return, close-before-navigate, zero copy assignment
  - Three full derived sub-pages (problems/interceptos/work) at full depth, one @view-transition rule serving all four concept-b pages
  - reveal.js — concept-b's own has-js scroll-reveal idiom for the 3 sub-pages
affects: [03-03 (motion polish — @starting-style transitions on .chapter-panel, hero fade-back while a panel is open)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Six pre-authored <dialog> elements (never one JS-templated dialog) so copy-diff can verify all panel content statically"
    - "One-off uncommitted Python generator script reading content/homepage.json to emit HTML + data-copy dot-paths together, writing directly to disk (no manual transcription)"
    - "Native showModal()/close event for focus trap + Esc + inert background; only focus-RETURN is hand-wired"
    - "Close-before-navigate: dialog.close() runs synchronously in the same click handler as a panel-cta anchor, before default navigation proceeds"

key-files:
  created:
    - concept-b/pages/problems.html
    - concept-b/pages/interceptos.html
    - concept-b/pages/work.html
    - concept-b/assets/js/panels.js
    - concept-b/assets/js/reveal.js
  modified:
    - concept-b/index.html
    - concept-b/assets/css/concept-b.css

key-decisions:
  - "Panel CTA wording (problems/interceptos/work) authored as distinct plain structural labels referencing each topic by name, never a generic 'Expand'"
  - "Contact conversion tile rendered as a non-link block (convert.cta.href has no real target in this prototype) rather than an anchor to nowhere"
  - "Labs panel CTA reuses concept-a's precedent: a panel-swap to Contact (never a dead link, never an invented full page)"
  - "Sub-page scroll-reveal idiom reimplemented as concept-b's own reveal.js (not shared with concept-a) — concepts stay fully isolated"

patterns-established:
  - "Chapter-panel content generation via Python script writing directly to disk end-to-end (JSON -> HTML file), eliminating hand-transcription risk for high copy-chunk-count pages"
  - "grep -c on data-copy counts LINES not occurrences — multi-attribute lines must be split one-per-line when a plan's verify step sets a numeric data-copy threshold"

requirements-completed: [CONB-03]

# Metrics
duration: 40min
completed: 2026-07-24
---

# Phase 3 Plan 2: Chapter Panels + Sub-Pages Summary

**Six statically-authored `<dialog>` chapter panels wired via a vanilla panels.js (open/close/swap/focus-return), plus three full derived sub-pages (problems/interceptos/work) sharing one `@view-transition` rule — 426 copy-diff chunks pass across all four concept-b pages.**

## Performance

- **Duration:** ~40 min
- **Completed:** 2026-07-24T16:15:21Z
- **Tasks:** 3
- **Files modified:** 7 (2 modified, 5 created)

## Accomplishments
- CONB-03 complete: hotspot -> inline chapter-panel teaser -> full sub-page, two-step progressive disclosure live for all six topics, with Labs/Insights/Contact ending in panels only (never a dead link, never a fabricated destination)
- All copy statically authored and `data-copy` annotated; panels.js and reveal.js contain zero copy assignment (verified by grep + manual review)
- Browser-verified end-to-end with Puppeteer + installed Chrome: every hotspot opens its panel, Esc and the close button both dismiss with focus returned to the invoking hotspot (including through a Labs -> Contact swap), panel CTAs close-before-navigate and land on the correct sub-page, the back link returns to `/concept-b/`, and the ambient video keeps playing behind the flat dimmed backdrop throughout

## Task Commits

Each task was committed atomically:

1. **Task 1: Six statically-authored chapter-panel dialogs + panel CSS** - `4a239be` (feat)
2. **Task 2: panels.js — open/close/swap/focus-return, close-before-navigate** - `ca3c4dd` (feat)
3. **Task 3: Three full sub-pages + @view-transition wiring** - `4b4c8f3` (feat)

**Plan metadata:** (this commit) - docs: complete plan

_Note: no TDD tasks in this plan — all three are `type="auto"` static-content/interaction builds._

## Files Created/Modified
- `concept-b/index.html` - Six closed-by-default `<dialog id="panel-{id}">` elements appended (problems/interceptos/work/labs/insights/contact), 86 data-copy chunks
- `concept-b/assets/css/concept-b.css` - Panel styling (flat single-alpha `::backdrop`, no dividers), shared reset/`.wrap`/`.kicker` primitives, one `@view-transition` rule, full sub-page CSS (page-header, page-hero, problem-item, os-flow/os-stage, agent-roster/agent-card, case-block/case-story), `[data-reveal]` scroll-reveal styling
- `concept-b/assets/js/panels.js` - Vanilla IIFE: opens/closes/swaps the six dialogs, restores focus to the invoking hotspot on close, closes panels before any `a.panel-cta` navigation fires
- `concept-b/assets/js/reveal.js` - concept-b's own has-js `[data-reveal]` IntersectionObserver (idiom borrowed from concept-a's `motion.js`, own file — concepts stay isolated)
- `concept-b/pages/problems.html` - All 4 problem items at full depth (quote/attrib/3 tells/signal stat/bridge); item 3's empty `signalNum` never rendered as a data-copy element
- `concept-b/pages/interceptos.html` - All 4 flows x 4 stages in a grid (no tabs/carousel/timers); stage-3 "Outcome" agents iterated as the real empty array; full 13-agent roster grouped by category
- `concept-b/pages/work.html` - ONE consolidated page, all 3 cases stacked at full depth; variable-length results (4/4/5) iterated per-index; `agents` rendered as the single pre-formatted string it is (never iterated, despite the plural field name)

## Decisions Made
- Chapter-panel and sub-page markup generated end-to-end by one-off uncommitted Python scripts that read `content/homepage.json` directly and write the finished HTML files to disk — chosen over hand-authoring given the 86 (index.html) + 340 (three sub-pages) total data-copy chunks in this plan, following the project's own documented 02-01/02-02 precedent that this technique passes copy-diff on the first run
- `grep -c 'data-copy='` counts matching **lines**, not attribute occurrences — the first draft of the chapter-panel generator packed two/three data-copy spans per line (e.g. client+tag, num+label) and undercounted against Task 1's `>= 80` threshold (63 lines for 86 attrs); fixed by splitting every multi-attribute construct to one data-copy element per line across all three tasks' generators
- Panel CSS keeps the close button `position: absolute` inside a `position: relative` `.chapter-panel` (not the originally-drafted `position: sticky; float: right`, which doesn't compose predictably inside an `overflow-y: auto` container)
- A new base `.kicker` CSS rule was inserted **before** `.hero-stage` in concept-b.css specifically so the homepage's existing `.hero__kicker` override (which appears later in the file) continues to win on shared properties — avoids an unreviewed visual regression to 03-01's already-committed hero

## Deviations from Plan

None — plan executed exactly as written. The three tasks matched the plan's structure precisely (six dialogs + panel CSS; panels.js; three sub-pages + view-transition); no Rule 1-4 auto-fixes were needed. The `data-copy` line-count fix described above was corrective work within Task 1 itself (a self-caught generator bug before the task's verify step was run), not a deviation from the plan's scope.

## Issues Encountered
- Puppeteer's `page.waitForNavigation({ waitUntil: 'networkidle0' })` intermittently timed out against Python's `http.server` (likely keep-alive connection behavior never reaching network-idle); switched verification scripts to `domcontentloaded` + short explicit waits, which is what the working verification runs above used. No project code was affected — this was purely a test-harness detail.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- 03-03 (motion polish) can now add `@starting-style` open/close transitions directly to `.chapter-panel`/`.chapter-panel::backdrop` — this plan deliberately left panels transition-free and un-overridden on `display`, per the 03-01 interface contract
- 03-03 also owns the open question logged in 03-RESEARCH.md about whether an open dialog visually interferes with the outgoing cross-document view-transition snapshot; this plan's close-before-navigate wiring is the documented cheap mitigation, empirically confirmed not to break navigation (dialog closes synchronously, then the anchor's default navigation proceeds and lands on the correct sub-page every time in Puppeteer testing)
- All CONB-03 success criteria are met; no blockers for 03-03

---
*Phase: 03-concept-b-full-screen-video*
*Completed: 2026-07-24*

## Self-Check: PASSED

All 7 files created/modified verified present on disk; all 3 task commit hashes (4a239be, ca3c4dd, 4b4c8f3) verified in git log.
