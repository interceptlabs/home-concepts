---
phase: 07-concept-d-iteration-2
plan: 01
subsystem: ui
tags: [concept-d, homepage, css-grid, intersection-observer, translucency, above-the-fold]

# Dependency graph
requires:
  - phase: 05-concept-d-home-variant
    provides: concept-d/index.html, cards.js, hero-video.js, concept-d.css, deployed.js/deployed.css (verbatim port + 8-dialog card/modal system)
provides:
  - Compact above-the-fold hero + 5-card section grid sharing the first viewport at 1440x900 and 1280x800
  - Bottom-anchored .card architecture (flex-column + margin-top:auto) with a uniform "Open +" CTA, reused for both section cards and case cards
  - 75%/50% resting/hover card translucency with touch/keyboard/reduced-motion parity
  - Full-screen .work-reel section (IO-gated reel video + poster + toggle) with 3 case cards, inserted after the untouched client logo strip
  - 3 new dlg-case-* dialog shells (stat/client/tag/name/summary/image + an empty .q-case-detail hook) ready for 07-02's quiet render
  - FAQs/Convert/footer unwrapped to plain below-fold page-flow sections in the locked order
affects: [07-02-card-module-transition-and-quiet-reskin, 07-03-closeout-and-review-packaging]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "card-field--five grid modifier alongside the untouched base auto-fit .card-field rule (5-col explicit grid vs 3-col auto-fit, same class family)"
    - "IntersectionObserver-gated below-fold video (preload=none) porting hero-video.js's reduced-motion/userPaused/visibilitychange guards into a second, independent reel-video.js"
    - "Static dialog shells with an empty data-hook div (.q-case-detail) for a later plan's render function to fill from untouched JS data objects"

key-files:
  created:
    - concept-d/assets/js/reel-video.js
    - .planning/phases/07-concept-d-iteration-2/captures/index-fold-1440x900.png
    - .planning/phases/07-concept-d-iteration-2/captures/index-fold-1280x800.png
    - .planning/phases/07-concept-d-iteration-2/captures/card-hover-1440.png
    - .planning/phases/07-concept-d-iteration-2/captures/index-full-1440.png
  modified:
    - concept-d/index.html
    - concept-d/assets/css/concept-d.css
    - concept-d/assets/js/cards.js

key-decisions:
  - "Renamed the plan's suggested data-case-key attribute to data-key on the .q-case-detail hooks, since the literal substring 'data-case' would trip this same task's own no-data-case grep gate even though it's functionally unrelated to deployed.js's [data-case] selector"
  - "Compact-hero clamp values from 07-RESEARCH.md's calculated starting point (hero-viewport padding 32px 0 28px, gap 24px; hero-h1 clamp(26px,3.2vw,40px) max-width 32ch; hero-sub clamp(14px,1vw,15px)) needed zero tuning -- fold-proof passed cleanly at both 1440x900 (modules bottom 816.5 vs 900 innerHeight) and 1280x800 (765.2 vs 800) on first capture"
  - "Staged hover verdict: plain translucency shift (0.75 -> 0.5 alpha, sine 1.1s) reads as calm and sufficiently 'video passes through' on capture review -- shipped without the optional CSS wave accent"
  - "ITER-06 requirement left Pending in REQUIREMENTS.md despite being listed in this plan's frontmatter -- the plan's own success_criteria only claims the work-reel section SHELL is in place, with 07-02 completing ITER-06 via the card-to-module transition; marking it complete now would misrepresent unfinished scope"

patterns-established:
  - "Static dialog shell + empty data-hook div pattern for staging content that a later plan's render function fills from an untouched JS data object, without ever hand-typing the copy into new markup"

requirements-completed: [ITER-01, ITER-02, ITER-03, ITER-07, ITER-08]

# Metrics
duration: 51min
completed: 2026-07-25
---

# Phase 7 Plan 1: Compact Hero, 5-Card Grid, Work-Reel Section, Below-Fold Unwrap Summary

**Restructured concept-d's homepage for above-the-fold density (compact hero + 5 uniform bottom-anchored cards), added a full-screen IntersectionObserver-gated work-reel section with 3 case cards, and unwrapped FAQs/Convert into plain below-fold sections -- all verified against a real-Chrome Puppeteer fold-proof at 1440x900 and 1280x800.**

## Performance

- **Duration:** ~51 min
- **Started:** 2026-07-25T03:38:00Z (approx, following 07-CONTEXT/07-RESEARCH handoff)
- **Completed:** 2026-07-25T04:29:14Z
- **Tasks:** 3
- **Files modified:** 6 (3 modified across all tasks: index.html, concept-d.css, cards.js; 1 created: reel-video.js; 4 capture PNGs created)

## Accomplishments
- Compact hero + full 5-card section grid (Problems/InterceptOS/Agents/Labs/Insights) share the first viewport at both 1440x900 and 1280x800, mechanically asserted via Puppeteer
- Bottom-anchored `.card` architecture (flex-column, `margin-top:auto` on `.card-bottom`) with a uniform `Open +` CTA row, 2-line teaser clamp, and 75%/50% resting/hover translucency (touch/keyboard parity via `:focus-visible`/`:active`)
- New full-screen `.work-reel` section (IO-gated at threshold 0.25, `preload="none"`, poster, pause/play toggle) sitting immediately after the untouched client logo strip, with 3 case cards reusing the same `.card` composition
- 3 new static `dlg-case-*` dialogs (HP/Intel/SAP) with stat/client/tag/name/summary/image plus an empty `.q-case-detail` hook for 07-02's quiet render function
- Retired `dlg-work` and `#casePanel` from the homepage (pages/work.html keeps its own untouched copies); removed `casePanel` from cards.js's `SCAFFOLD_IDS`
- FAQs and Convert unwrapped from `<dialog>` wrappers into plain page-flow sections, in the locked order: hero -> clients -> work-reel -> faqs -> convert -> footer
- Both copy gates (`qa/copy-diff.py --mode substring`, `qa/concept-d-script-diff.py`) green after every task

## Task Commits

Each task was committed atomically:

1. **Task 1: Compact hero + uniform 5-card grid with translucency system** - `fae0013` (feat)
2. **Task 2: Full-screen work-reel section + 3 case cards + case dialog shells; retire dlg-work/#casePanel** - `0a14fcd` (feat)
3. **Task 3: Unwrap FAQs/convert below-fold + fold-proof assertion + staged hover review** - `667f5c8` (feat)

**Plan metadata:** (this commit, docs: complete plan)

## Files Created/Modified
- `concept-d/index.html` - Compact hero (hero-ctas removed), 5-card `card-field--five` grid restructured to bottom-anchored architecture, new `.work-reel` section + 3 case cards + 3 case dialogs, `dlg-work`/`#casePanel` removed, `dlg-faqs`/`dlg-convert` unwrapped to plain sections
- `concept-d/assets/css/concept-d.css` - Compact-hero clamp overrides, `.card` flex-column + translucency system, `.card-field--five` grid modifier, `.work-reel`/`.reel-video`/`.reel-toggle`/`.work-reel-heading`/`.case-window` chrome, extended occlusion selector
- `concept-d/assets/js/cards.js` - Removed `casePanel` from `SCAFFOLD_IDS` and its header comment
- `concept-d/assets/js/reel-video.js` - New file: IntersectionObserver play/pause gate for the below-fold reel, porting hero-video.js's reduced-motion/userPaused/visibilitychange guards
- `.planning/phases/07-concept-d-iteration-2/captures/*.png` - Fold-proof (2 breakpoints), staged hover, and full-page state captures

## Decisions Made
- Renamed `data-case-key` to `data-key` on the `.q-case-detail` hooks (see key-decisions above) -- a Rule 3 blocking-issue auto-fix since the plan's own verify gate would otherwise fail on its own prescribed markup
- Kept ITER-06 Pending in REQUIREMENTS.md rather than marking it complete from this plan's frontmatter list, matching the plan's own success_criteria language ("section shell... in place for 07-02's transition")
- Shipped the hover state as translucency-only after a real capture review, per 07-RESEARCH.md's own recommendation to try the cheapest technique first

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Renamed data-case-key to data-key on the .q-case-detail hooks**
- **Found during:** Task 2 (case dialog shells)
- **Issue:** The plan's action text specified `data-case-key="{key}"` attributes on the 3 `.q-case-detail` divs, but Task 2's own verify command runs `! grep -q 'data-case' concept-d/index.html` -- a plain substring grep that would also match `data-case-key`, failing the gate on the plan's own prescribed markup even though the attribute is functionally unrelated to deployed.js's `[data-case]` global-listener selector (CSS attribute selectors match by exact name only, so `data-case-key` was never at risk of triggering `openCase()`).
- **Fix:** Renamed the attribute to `data-key` (kept the `.q-case-detail` class and per-case value unchanged) so the hook still works for 07-02's render function while satisfying the literal gate.
- **Files modified:** concept-d/index.html
- **Verification:** `grep -n 'data-case' concept-d/index.html` returns nothing; all three case dialogs still carry a working `data-key` hook.
- **Committed in:** `0a14fcd` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary to satisfy the task's own verify gate as literally written; no functional or scope change -- 07-02's render function can select on `data-key` exactly as it would have on `data-case-key`.

## Issues Encountered
None beyond the deviation above. All three tasks' automated verify chains passed on the first run after the deviation fix.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- 07-02 has a structurally final page to work with: 8 dialogs (5 section + 3 case), all wired via `data-modal`, all reachable from a `button.card[data-modal]`
- Dialog inventory handed to 07-02: **5 section dialogs to reskin** (`dlg-problems`, `dlg-os`, `dlg-agents`, `dlg-labs`, `dlg-insights`) via new quiet render functions reading the untouched `PROBLEMS_RR`/`PROBLEM_FLOWS`/`AGENTS`/`CASES` data objects, plus **3 case shells to fill** (`dlg-case-hp-abx`, `dlg-case-intel-abm`, `dlg-case-sap-video`) via their `.q-case-detail[data-key="..."]` hooks
- The card->module scaling transition (ITER-04) is not yet built -- clicking any card still opens its dialog via the existing instant `showModal()`/`close()` path from Phase 5; 07-02 owns wiring the View Transitions morph (or FLIP fallback, scoped to an inner wrapper per the Phase-5 no-transform invariant on `dialog.module-modal`)
- No blockers. Compact-hero values needed zero tuning against the research's calculated starting point, and the staged hover verdict shipped translucency-only with no follow-up needed.

---
*Phase: 07-concept-d-iteration-2*
*Completed: 2026-07-25*

## Self-Check: PASSED

All 5 created/referenced files confirmed present on disk; all 3 task commit hashes (`fae0013`, `0a14fcd`, `667f5c8`) confirmed present in git history.
