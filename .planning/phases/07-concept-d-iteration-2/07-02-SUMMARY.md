---
phase: 07-concept-d-iteration-2
plan: 02
subsystem: ui
tags: [concept-d, view-transitions, dialog, progressive-disclosure, quiet-ui]

# Dependency graph
requires:
  - phase: 07-concept-d-iteration-2
    provides: "07-01's structurally final 8-dialog page (5 section + 3 case), compact hero + 5-card grid, work-reel section, .q-case-detail[data-key] hooks"
provides:
  - "View Transitions card->window morph (invoker<->dialog view-transition-name handoff, sine 600ms) with instant swap under reduced-motion and a FLIP-on-.modal-body fallback for unsupported browsers, never touching dialog.module-modal's own transform (Phase-5 no-transform invariant preserved end to end)"
  - "Esc/cancel interception with a capture-phase keydown snapshot so an open drawer/agent-detail overlay consumes the first Esc and the dialog itself only closes on a second Esc, restoring the pre-existing two-step semantics against the new transitioned close"
  - "concept-d/assets/js/quiet-modules.js: new render functions for Problems (one problem/tells-details/signal/bridge), InterceptOS (one-stage-at-a-time stepper), and the 3 case windows (single-open Challenge/Approach/Results), all reading PROBLEMS_RR/PROBLEM_FLOWS/CASES as live globals at render time"
  - "Quiet dialog-scoped CSS for all 8 windows: full-viewport modal shell (min(1500px,96vw)/92vh), q-tab/q-step components using border+color shifts only (never a var(--surface*) fill, which breaks inside InterceptOS's permanent dark navy band), neutralized rule lines/washes on Labs and Insights, calmer neutral Agents cards"
affects: [07-03-closeout-and-review-packaging]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "View Transitions API primary (document.startViewTransition + view-transition-name handoff) / FLIP-on-inner-wrapper fallback / instant-swap-under-reduced-motion, mirrored on both open and close paths, with dialog 'cancel' (Esc) explicitly intercepted via preventDefault so Esc gets the same transition as the close button"
    - "Capture-phase keydown snapshot (bound before deployed.js's own bubble-phase document keydown listener) to sequence 'Esc closes an open drawer first, Esc closes the dialog second' against a native <dialog> whose 'cancel' event fires independently of any nested non-native drawer's own state"
    - "New render functions reading untouched top-level `const` data objects (PROBLEMS_RR/PROBLEM_FLOWS/CASES) as bare global identifiers from a later classic <script> — never re-typing a copy string — preserving qa/concept-d-script-diff.py's byte-identical guarantee while completely changing the presentation"
    - "Border+color-only active-state styling for new quiet tab/step components, deliberately avoiding var(--surface*) fills, because InterceptOS's dialog sits on deployed.css's unconditional dark #os{background:var(--band-blue)} band which locally redefines --fg to white while leaving --surface at light-theme white -- a background fill would silently render white-on-white for any new element outside deployed.css's own .prob-flow-scoped re-flip"

key-files:
  created:
    - concept-d/assets/js/quiet-modules.js
    - .planning/phases/07-concept-d-iteration-2/captures/quiet-problems-1440.png
    - .planning/phases/07-concept-d-iteration-2/captures/quiet-os-1440.png
    - .planning/phases/07-concept-d-iteration-2/captures/quiet-os-stage2-1440.png
    - .planning/phases/07-concept-d-iteration-2/captures/quiet-agents-1440.png
    - .planning/phases/07-concept-d-iteration-2/captures/quiet-labs-1440.png
    - .planning/phases/07-concept-d-iteration-2/captures/quiet-insights-1440.png
    - .planning/phases/07-concept-d-iteration-2/captures/quiet-insights-expanded-1440.png
    - .planning/phases/07-concept-d-iteration-2/captures/quiet-case-sap-1440.png
    - .planning/phases/07-concept-d-iteration-2/captures/quiet-case-sap-results-1440.png
  modified:
    - concept-d/index.html
    - concept-d/assets/js/cards.js
    - concept-d/assets/css/concept-d.css

key-decisions:
  - "Drawer-first Esc semantics required a NEW capture-phase keydown listener (not just the dialog's own 'cancel' handler) because deployed.js's document-level Escape listener (closeAll()) and the dialog's native 'cancel' event both fire from the SAME physical Escape keypress -- without snapshotting drawer-open state before closeAll() strips it, the dialog's cancel handler would always see 'no drawer open' and close the dialog on the same press that closed the drawer"
  - "q-tab/q-step/q-flow-chip active states use border-color + font-weight shifts only, never background:var(--surface*) -- caught via honest capture review, not the mechanical gates: InterceptOS's permanent navy band redefines --fg to white while leaving --surface untouched (light-theme white), so a background fill rendered invisible white-on-white text"
  - "Agents' pale-pink card wash required an additional :root[data-theme=\"light\"]-prefixed override selector (not just !important) to out-specificity deployed.css's own light-theme-scoped rule (3 class-level selectors vs. the plain dialog-scoped override's 2 classes + 1 type) -- the first override attempt silently lost the cascade despite being present in the stylesheet"
  - "Labs' quiet pass needed TWO separate border-top neutralizations (.labs and .labs-stats are sibling-adjacent classes, each carrying its own ported hairline) -- fixing only the section wrapper left the stats-block divider visible"
  - "Case windows' Challenge/Approach/Results disclosure reuses the .q-tabs/.q-tab component verbatim (not a distinct accordion pattern) for visual consistency with Problems/InterceptOS, per the plan's own 'plain structural labels, the 02-02 precedent' framing"
  - "Renamed two of Task 3's own case-dialog HTML comments (which literally contained the substring 'q-case-detail') since the plan's own verify gate ($(grep -c 'q-case-detail' ...) = 3) counts ALL occurrences including comments -- same class of literal-substring-vs-intent collision 07-01-SUMMARY already logged for data-case-key"

patterns-established:
  - "Puppeteer smoke scripts import the globally-installed puppeteer package by its absolute ESM entry path (/Users/jontoewsinterceptgroup.com/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js) since this project has no local node_modules/package.json and Node's ESM resolver does not consult NODE_PATH the way CJS require() does"

requirements-completed: [ITER-04, ITER-05, ITER-06]

# Metrics
duration: 65min
completed: 2026-07-25
---

# Phase 7 Plan 2: Scaling Card-to-Window Transition + Quiet Module Reskin Summary

**View Transitions morph (sine 600ms, FLIP/instant fallbacks) turning all 8 cards into near-full-viewport windows, plus a new quiet-modules.js that re-renders Problems/InterceptOS/case-detail as one-thing-at-a-time progressive disclosure reading live from deployed.js's untouched data objects.**

## Performance

- **Duration:** ~65 min
- **Started:** 2026-07-25T03:57:00Z (approx)
- **Completed:** 2026-07-25T05:02:44Z
- **Tasks:** 3
- **Files modified:** 4 (index.html, cards.js, concept-d.css modified; quiet-modules.js created) plus 10 capture PNGs

## Accomplishments
- View Transitions primary path (`document.startViewTransition` + `view-transition-name` handoff invoker<->dialog) with instant swap under `prefers-reduced-motion` and a FLIP-on-`.modal-body` fallback for unsupported browsers — `dialog.module-modal`'s own INVARIANT (never transform/filter/backdrop-filter/perspective/contain) verified intact via a Python brace-scan assertion on every commit
- Esc (`cancel` event) intercepted on both open and close so it morphs identically to the close button, with a capture-phase keydown snapshot restoring the expected "Esc closes an open drawer first, Esc closes the dialog second" two-step semantics
- `concept-d/assets/js/quiet-modules.js`: Problems (one problem/tells-details/signal/bridge), InterceptOS (one-stage-at-a-time 4-step stepper), Labs/Insights (visual quieting pass), and all 3 case windows (single-open Challenge/Approach/Results) — every render function reads `PROBLEMS_RR`/`PROBLEM_FLOWS`/`CASES` as live globals, never a re-typed string
- The Phase-5 drawer-reparenting invariant regression-tested THROUGH the new morph for the first time (07-RESEARCH.md's flagged "one untested interaction"): `#pitchLabs` from Labs and `#convoDrawer` from Agents' detail overlay both still span the true viewport, not the dialog's own box
- Both copy gates (`qa/copy-diff.py --mode substring`, `qa/concept-d-script-diff.py`) green after every task; `pages/*.html` confirmed byte-untouched across all 3 tasks (`git diff --stat` empty)

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaling card-to-window transition + full-viewport window sizing** - `df13e2b` (feat)
2. **Task 2: Quiet windows — Problems tabs+disclosure and InterceptOS stepper** - `db0837e` (feat)
3. **Task 3: Quiet windows — Agents/Labs/Insights + 3 case windows** - `6b4066e` (feat)

**Plan metadata:** (this commit, docs: complete plan)

## Files Created/Modified
- `concept-d/index.html` - All 8 dialogs wrapped in `.modal-body`; Problems/InterceptOS old markup (`solveDetail`/`probFlow`/`.solve-tab`/`.prob-tab`) replaced with quiet `q-tab` rails + render hooks; Agents/Insights `fritz-bg` canvases removed; Insights `ep-tile`s restructured with per-tile `<details class="q-more">`; Labs CTA relocated below the stat
- `concept-d/assets/js/cards.js` - View Transitions open/close, FLIP fallback, `cancel`-event interception, capture-phase drawer-first-Esc bookkeeping
- `concept-d/assets/js/quiet-modules.js` - New file: Problems/InterceptOS/case-detail render functions reading deployed.js's data objects at render time
- `concept-d/assets/css/concept-d.css` - Full-viewport modal shell, `::view-transition-group` sine/600ms tuning, `.q-tabs`/`.q-problem`/`.q-flow-*`/`.q-stepper`/`.q-case-*` quiet chrome (border+color only, no `var(--surface*)` fills), Labs/Insights hairline neutralization, Agents card-wash neutralization (incl. a `:root[data-theme="light"]`-prefixed specificity-matching override)
- `.planning/phases/07-concept-d-iteration-2/captures/*.png` - Honest capture-review evidence for all 5 section windows + a case window, both default and interacted states

## Decisions Made
See key-decisions in frontmatter — five decisions, all found via honest capture/behavior review rather than the mechanical gates (which stayed green throughout): the drawer-first-Esc event-ordering fix, the border+color-only quiet-tab design (InterceptOS navy-band bug), the Agents specificity fix, Labs' two separate hairlines, and one HTML-comment literal-substring collision with the plan's own verify gate (same class of issue as 07-01's `data-case-key` rename).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Drawer-first Esc required a capture-phase keydown snapshot, not just a 'cancel' handler**
- **Found during:** Task 1's own transition-smoke.mjs assertion ("Esc closes drawer then Esc closes dialog")
- **Issue:** deployed.js's document-level `keydown` listener (`closeAll()`) and the dialog's native `cancel` event both fire from the same physical Escape keypress; the `cancel` handler's own `document.querySelector('.drawer.open')` check ran AFTER `closeAll()` had already stripped the `.open` class, so the dialog closed on the same Esc that closed the drawer.
- **Fix:** Added a capture-phase `keydown` listener (fires before any bubble-phase listener on the same target, regardless of script/registration order) that snapshots whether a drawer/agent-detail overlay was open at the moment Escape was pressed; the `cancel` handler reads that snapshot instead of live DOM state.
- **Files modified:** concept-d/assets/js/cards.js
- **Verification:** transition-smoke.mjs's "First Esc closed drawer / dialog still open" and "Second Esc closed dialog" assertions both pass.
- **Committed in:** `df13e2b` (Task 1 commit)

**2. [Rule 1 - Bug] Quiet tab/step active-state styling silently broke inside InterceptOS's dark navy band**
- **Found during:** Task 2's honest capture review (mechanical gates don't check color contrast)
- **Issue:** `.q-tab.is-active`/`.q-step.is-active`/`.q-flow-chip` used `background: var(--surface-2)` for the active/chip fill. deployed.css's `#os` scope permanently redefines `--fg` to white (a dark navy band, unconditional across themes) while leaving `--surface`/`--surface-2` at their light-theme white value — any new element relying on a surface-token background for its fill rendered invisible white-on-white text.
- **Fix:** Redesigned all three components to use border-color + font-weight/color shifts only, never a `var(--surface*)` background — a design that survives both the flat light-theme dialogs and the dark navy band without needing a second scoped token override.
- **Files modified:** concept-d/assets/css/concept-d.css
- **Verification:** Fresh capture review at 1440×900 confirms both the active tab (Problems, light context) and the active step/tab (InterceptOS, dark-band context) read clearly.
- **Committed in:** `db0837e` (Task 2 commit)

**3. [Rule 1 - Bug] Agents card wash needed a specificity-matching override, not just a plain dialog-scoped rule**
- **Found during:** Task 3's honest capture review
- **Issue:** `dialog.module-modal .agent-card-v6 { background: var(--surface); }` never took visual effect — deployed.css's own `:root[data-theme="light"] .agent-card-v6{background:linear-gradient(rgba(255,0,229,.055),...),var(--surface);}` carries higher cascade specificity (3 class-level selectors vs. 2 classes + 1 type) and won outright, keeping the flarepop-wash gradient.
- **Fix:** Added a second rule matching the same `:root[data-theme="light"]` prefix plus the dialog scope, giving the override higher specificity without `!important`.
- **Files modified:** concept-d/assets/css/concept-d.css
- **Verification:** `getComputedStyle(...).backgroundImage` confirmed `none` (was the gradient string) after the fix; capture review confirms neutral card surfaces.
- **Committed in:** `6b4066e` (Task 3 commit)

**4. [Rule 1 - Bug] Labs' quiet pass needed two separate hairline neutralizations**
- **Found during:** Task 3's honest capture review
- **Issue:** Neutralizing `.labs{border-top:0}` alone left a second, separate `.labs-stats{border-top:1px solid var(--line-2)}` rule visible between the intro paragraph and the stat.
- **Fix:** Added `dialog.module-modal .labs-stats{border-top:0}` alongside the existing `.labs` override.
- **Files modified:** concept-d/assets/css/concept-d.css
- **Verification:** Fresh capture confirms a single continuous quiet surface with no visible divider.
- **Committed in:** `6b4066e` (Task 3 commit)

**5. [Rule 3 - Blocking] Renamed two HTML-comment mentions of "q-case-detail" to satisfy the plan's own literal verify gate**
- **Found during:** Task 3's own verify command (`[ "$(grep -c 'q-case-detail' concept-d/index.html)" = "3" ]`)
- **Issue:** Task 1's case-dialog comments (added while wrapping `.modal-body`) described the render target as "fills .q-case-detail from CASES[...]" — a plain substring grep counts these comment occurrences too, making the count 6 instead of the expected 3 actual hook `<div>`s.
- **Fix:** Reworded the comments to say "fills the case-detail hook (data-key ...)" instead of the literal class name, preserving the same documentation intent without the substring collision.
- **Files modified:** concept-d/index.html
- **Verification:** `grep -c 'q-case-detail' concept-d/index.html` returns exactly 3.
- **Committed in:** `6b4066e` (Task 3 commit)

---

**Total deviations:** 5 auto-fixed (4 bugs, 1 blocking)
**Impact on plan:** All five were necessary for correctness (illegible text, broken two-step Esc semantics, a gate the plan's own markup would otherwise fail) or honest-review findings the mechanical gates cannot see (color contrast, cascade specificity). No scope creep — every fix stayed within Task 1-3's own files_modified list.

## Issues Encountered
None beyond the deviations above. All three tasks' automated verify chains (grep/node --check/copy-diff/script-diff/Puppeteer smoke) passed after the fixes; no unresolved issues remain.

## User Setup Required
None - no external service configuration required. Local review only (`./serve.sh` on :4340, already running); nothing deployed anywhere per project standing order.

## Next Phase Readiness
- ITER-04 (scaling transition), ITER-05 (quiet section windows), and ITER-06 (quiet case windows) are all complete and mechanically + visually verified — 07-03 can proceed straight to closeout (gallery thumbnail refresh, REVIEW.md update, final cross-concept QA sweep) without further module-window work.
- 07-03's own verify gates should assert against the NEW quiet markup/classes (`q-tab`, `q-more`, `q-case-detail` render output, `::view-transition-group(modal-morph)` sine timing) rather than Phase 5's old `! grep view-transition-name` check, which this plan intentionally made obsolete (noted in the plan's own Task 1 action text).
- Three scratchpad Puppeteer smoke scripts (transition-smoke.mjs, quiet-smoke.mjs, case-smoke.mjs) exist only in the session scratchpad directory, not committed to the repo — 07-03 should decide whether any of these mechanical assertions are worth promoting into a permanent `qa/*.mjs` gate (following the `qa/camera-framing-check.mjs` precedent) if this transition/reskin work is likely to regress.
- No blockers. All capture-review findings (drawer-first-Esc, navy-band contrast, Agents specificity, Labs hairlines) were fixed within this plan's own scope, not deferred.

---
*Phase: 07-concept-d-iteration-2*
*Completed: 2026-07-25*

## Self-Check: PASSED

All 10 created/referenced files confirmed present on disk; all 3 task commit hashes (`df13e2b`, `db0837e`, `6b4066e`) confirmed present in git history.
