---
phase: 05-concept-d-home-variant
plan: 02
subsystem: ui
tags: [dialog-modal, static-html, css, javascript, copy-verification, verbatim-port, concept-d]

# Dependency graph
requires:
  - phase: 05-concept-d-home-variant
    provides: "05-01: concept-d/assets/css/deployed.css, concept-d/assets/js/deployed.js, extracted case images, qa/concept-d-script-diff.py"
provides:
  - "concept-d/index.html — hero video layer + verbatim hero copy + 8 real-button cards (+7 anchor fallbacks +1 static fallback) + 8 DOM-resident <dialog> module wrappers + verbatim footer/clients-strip/SVG-defs/drawer-scaffold/JSON-LD"
  - "concept-d/assets/css/concept-d.css — new chrome only: video layer, hero viewport, card field, modal shell (with the no-transform/filter/backdrop-filter/perspective/contain invariant), no-JS toggles"
  - "concept-d/assets/js/cards.js — card->dialog wiring with both research-identified landmine fixes (drawer-scaffold reparenting + synthetic resize dispatch) plus an ownership guard for the InterceptOS->Agents bridge race"
  - "concept-d/assets/js/hero-video.js — concept-b video.js idioms adapted for a position:fixed, always-in-view video layer"
provides_summary: "Concept D's homepage reveal shell: a full-screen light video hero with verbatim copy, 8 small card buttons that expand into <dialog> modals each carrying one complete, unmodified deployed module, verified end-to-end with a 41-assertion Puppeteer suite"
affects: [05-03-standalone-pages, 06-cross-concept-qa]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "DOM-resident <dialog> per module (never lazy-injected) so the ported deployed.js's one-time init (fritz-bg, buildSolve, renderFlow, renderAgents, [data-case]/[data-open] wiring) runs exactly as it does on the live site"
    - "Single-instance drawer-scaffold reparenting (dialog.appendChild on open, document.body.appendChild on close) rather than duplicating #scrim/#casePanel/#convoDrawer/#pitchLabs per dialog — locked in the plan's interfaces block, ids stay unique"
    - "Dialog close-listener ownership guard: only reparent the scaffold home if it's still parented inside the closing dialog, since a dialog's native 'close' event fires via a queued task and can resolve after a different dialog has already claimed the scaffold"
    - "Card copy sourced as either the module's full single-sentence lede/heading (verbatim, unmodified) or an exact prefix ending at a sentence-terminating period — never a mid-word cut — verified against the whole staging document by a parser-based visible-text substring check"

key-files:
  created:
    - concept-d/index.html
    - concept-d/assets/css/concept-d.css
    - concept-d/assets/js/cards.js
    - concept-d/assets/js/hero-video.js
  modified: []

key-decisions:
  - "Assembled index.html with a one-off, uncommitted Python extraction script reading exact staging line ranges (same pattern as 05-01) — never hand-retyped the ~700-line header/footer/SVG-defs/module markup"
  - "Dropped the .hero-a class from the new hero section (kept only .hero) — .hero-a carries deployed.css's light-theme override that forces a dark-island color set (--fg:#fff etc.), correct for the ORIGINAL dark hero video but illegible white-on-white against concept-d's new light video; .hero alone supplies every needed typography rule (.kick/.hero-h1/.hero-sub/.hero-ctas)"
  - "Followed the PLAN's interfaces block (single-instance scaffold reparenting) over 05-RESEARCH.md's alternate per-dialog-duplication suggestion — the plan is the authoritative, locked design for this phase"
  - "Card teaser copy: used the module's full section-lead paragraph verbatim when it's already one sentence (Problems, Labs, Convert), or an exact prefix ending at the first sentence's period for multi-sentence ledes (InterceptOS, Agents, Work, Insights) — FAQs has no lede paragraph at all, so its teaser borrows a different verbatim sentence from within the module (the 'How do I get started?' answer)"
  - "No-JS visitors inherit the ported theme system's own pre-existing behavior: the theme only becomes 'light' via the inline head script, so a no-JS visitor sees the base (dark) `:root` tokens — confirmed identical on the staging source itself (no `<noscript>`/`prefers-color-scheme` fallback there either), so this is not a concept-d regression and is out of scope for COND-07 (which requires no-JS card/nav degradation to work, not full no-JS theme parity — verified working)"

requirements-completed: [COND-01, COND-02, COND-03, COND-04, COND-06, COND-07]

# Metrics
duration: 23min
completed: 2026-07-24
---

# Phase 5 Plan 02: Card/Modal Reveal Shell Summary

**Built the Concept D homepage reveal shell — a full-screen light video hero with verbatim ported copy, 8 small real-button cards that expand into native `<dialog>` modals each carrying one complete, unmodified deployed module (Problems/InterceptOS/Agents/Work/Labs/Insights/FAQs/Contact) — and verified it end-to-end with a 41-assertion Puppeteer suite covering both research-identified landmine fixes.**

## Performance

- **Duration:** 23 min
- **Tasks:** 3
- **Files created:** 4

## Accomplishments
- `concept-d/index.html` assembled via a one-off extraction script from exact staging line ranges: verbatim header/footer/hero-copy/clients-strip/SVG-defs/drawer-scaffold/JSON-LD with root-context href rewrites, a new hero-video layer + hero-viewport, 8 card buttons + 7 anchor fallbacks + 1 static fallback (Problems, modal-only), and 8 `<dialog>` wrappers each holding one complete ported module section
- `concept-d/assets/css/concept-d.css` — new chrome only: video layer, near-opaque card surfaces (legible over moving footage, unlike the deployed page's flat-white-on-white pattern), modal shell with the transform/filter/backdrop-filter/perspective/contain invariant documented in a CSS comment, additive section-padding neutralization, no-JS toggles — clean on every brand grep (banned tagline, deprecated hex, hex colors, gradients, non-zero border-top/bottom, view-transition-name)
- `concept-d/assets/js/cards.js` — card->dialog wiring implementing both 05-RESEARCH.md landmine fixes: single-instance drawer-scaffold reparenting (dialog.appendChild on open, body on close) so `#convoDrawer`/`#casePanel`/`#pitchLabs`/`#scrim` render ABOVE a module dialog's top layer instead of underneath it, and a synthetic `resize` dispatch so hidden fritz-bg canvases re-measure once their dialog is visible; plus an InterceptOS->Agents bridge for the modal-only context
- `concept-d/assets/js/hero-video.js` — concept-b's video.js idioms (reduced-motion pause, iOS play-rejection fallback, visibility pause) adapted for a position:fixed, always-in-viewport video layer (IntersectionObserver deliberately omitted, documented in a comment)
- A 41-assertion Puppeteer suite (scratchpad, never committed) proved: all 8 dialogs open/close/focus-return, Problems tabs work inside the modal, the fritz-bg canvas re-measure fix (width>0 after open), the Agents/Labs drawer-above-dialog top-layer fix (via `elementFromPoint`), scaffold reparents back to `document.body` on close, the Work case-image loads, the FAQ accordion and InterceptOS->Agents bridge both work, reduced-motion pauses the video, and no-JS correctly swaps buttons for anchors — zero page errors across the whole run
- `qa/copy-diff.py --mode substring` passes 42/42 chunks (matching the documented Phase 5 baseline) and `qa/concept-d-script-diff.py` passes all 13 checks (regression-clean)

## Task Commits

Each task was committed atomically:

1. **Task 1: Assemble index.html — ported chrome + hero video layer + cards + 8 module dialogs** - `4eae712` (feat)
2. **Task 2: New chrome — concept-d.css, hero-video.js, cards.js** - `314a70a` (feat)
3. **Task 3 fixes: mechanical verification — theme legibility, dialog race, modal-close** - `ac92034` (fix)

_Note: Task 3 itself is scratchpad-only (Puppeteer suite, no repo files) per the plan; the real bugs it surfaced were fixed and committed above._

## Files Created/Modified
- `concept-d/index.html` - hero video layer, verbatim hero copy, 8 cards + fallbacks, 8 module dialogs, verbatim footer/clients/scaffold/defs/JSON-LD
- `concept-d/assets/css/concept-d.css` - video layer, card field, modal shell, no-JS toggles (new chrome only)
- `concept-d/assets/js/cards.js` - card->dialog wiring, scaffold reparenting, resize dispatch, os->agents bridge
- `concept-d/assets/js/hero-video.js` - reduced-motion/visibility/play-rejection video control

## Decisions Made

- **Verbatim-port-via-script:** an uncommitted, one-off Python extraction script read exact staging line ranges (matching the 05-01 pattern) rather than hand-retyping ~700 lines of header/footer/SVG-defs/module markup.
- **Dropped `.hero-a` from the new hero section:** kept only `.hero`. `.hero-a` carries deployed.css's `:root[data-theme="light"] .hero-a{--fg:#fff...}` override — correct for the ORIGINAL dark hero video (a dark island even in light mode) but wrong for concept-d's new light video, where it rendered the hero copy nearly illegible white-on-white. Found via an honest capture review, not the Puppeteer suite (which doesn't check color contrast) — a reminder that mechanical gates and visual review catch different classes of bugs.
- **Single-instance scaffold reparenting, not per-dialog duplication:** followed the plan's own interfaces block (dialog.appendChild the 4 scaffold nodes on open, document.body.appendChild on close) rather than 05-RESEARCH.md's alternate suggestion of duplicating the scaffold inside every dialog that needs it — the plan is the locked, authoritative design.
- **Dialog close-listener ownership guard:** a dialog's native `close` event fires via a browser-queued task, not synchronously with `.close()`. This meant the InterceptOS->Agents bridge (which calls `dlgOs.close()` then immediately `openModal(dlgAgents,...)` in the same tick) could have dlg-os's belated close listener fire AFTER dlg-agents had already claimed the scaffold, yanking it back out to `document.body` from underneath the now-active dialog. Fixed by checking `scaffoldNodes.some(n => n.parentElement === dialog)` before reparenting home — only the dialog that currently owns the scaffold is allowed to send it home.
- **modal-close button CSS:** the original `float:right` + `position:sticky` combination silently demoted the button out of the "positioned" paint layer, so the ported module `<section>` painted on top of it and silently absorbed every click (discovered because Task 3's Test5 hung for 30s waiting for a dialog that would never close). Replaced with `margin-left:auto` (a block element with a fixed width right-aligns without floats) plus an explicit `z-index:2` and flex centering.
- **No-JS theme inheritance is out of scope, not a bug:** without JS, the theme-init script never runs, so the page falls back to the base (dark) `:root` tokens — confirmed the staging `home.html` itself has the exact same characteristic (no `<noscript>`/`prefers-color-scheme` fallback). COND-07's no-JS requirement is specifically about cards degrading to anchors (verified working), not full no-JS theme parity.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Hero copy rendered illegible white-on-white over the new light video**
- **Found during:** Task 1/2 honest capture review (after Task 3's Puppeteer suite passed cleanly — mechanical assertions don't check color contrast)
- **Issue:** The new hero section carried both `.hero` and `.hero-a` classes per the initial build. `.hero-a` triggers deployed.css's `:root[data-theme="light"] .hero-a{--fg:#ffffff;...}` override, built for the ORIGINAL deployed hero (a dark video with a dark scrim, always a "dark island" even in light mode). Concept D's new video is light, so this override made the kicker/h1/sub render white-on-near-white — nearly invisible.
- **Fix:** Removed `.hero-a` from the section's class list (kept `.hero`, which supplies all needed typography with no color override). Documented the reasoning in both `index.html`'s generating script and a concept-d.css comment so a future editor doesn't re-add `.hero-a` for "consistency with the deployed markup" without realizing why it was deliberately dropped.
- **Files modified:** concept-d/index.html, concept-d/assets/css/concept-d.css (comment only)
- **Verification:** Capture re-review confirms dark ink text, fully legible over the light video; all brand/copy gates still pass unchanged.
- **Committed in:** ac92034

**2. [Rule 1 - Bug] InterceptOS->Agents bridge could strand the drawer scaffold outside the active dialog**
- **Found during:** Task 3, discovered while investigating a scaffold-reparent-timing failure in the modal suite (initially looked like a test race, but traced to a genuine ordering bug)
- **Issue:** `dialog.close()`'s native `close` event fires via a queued browser task, not synchronously. The bridge handler calls `dlgOs.close()` then immediately `openModal(dlgAgents, lastInvoker)` in the same synchronous tick — if dlg-os's belated close listener then runs (reparenting the scaffold to `document.body`) AFTER dlg-agents has already reparented it into itself, the scaffold gets yanked out from under the now-active dlg-agents.
- **Fix:** Added an ownership guard in the close listener — only reparent to `document.body` if the scaffold is still actually parented inside the dialog that's closing.
- **Files modified:** concept-d/assets/js/cards.js
- **Verification:** Puppeteer suite Test3 (scaffold reparented home) and Test5b (bridge) both pass; re-ran the full suite twice for stability.
- **Committed in:** ac92034

**3. [Rule 1 - Bug] modal-close button silently absorbed no clicks — the ported section painted over it**
- **Found during:** Task 3, Test5 (Labs modal-close hung for the full 30s Puppeteer timeout)
- **Issue:** `.modal-close{position:sticky; float:right;}` — floating a sticky-positioned element is a well-known footgun: it can be demoted out of the "positioned, z-index:auto" paint layer that sticky elements normally occupy, so the later-in-DOM-order `<section>` (a plain static block) painted on top of it. `elementFromPoint` at the button's own coordinates resolved to the section, not the button, so Puppeteer's (and a real user's) click landed on the section instead.
- **Fix:** Removed `float:right`; used `margin-left:auto` (works for a block-level element with a fixed width) plus an explicit `z-index:2` to make the paint order unambiguous, and `display:flex;align-items:center;justify-content:center` to center the × glyph as a bonus polish.
- **Files modified:** concept-d/assets/css/concept-d.css
- **Verification:** `elementFromPoint` at the button's center now resolves to `BUTTON.modal-close`; full Puppeteer suite passes; capture review confirms the × is now centered.
- **Committed in:** ac92034

**4. [Rule 1 - Verification methodology] The plan's own border-top/bottom brand grep has a whitespace false-positive**
- **Found during:** Task 2 verify
- **Issue:** `grep -IE 'border-(top|bottom)[[:space:]]*:[[:space:]]*[^0n]'` is meant to permit only `0`/`none` values, but the space character itself satisfies the negated `[^0n]` class — so `border-bottom: 0;` (with a space after the colon) matches the "forbidden" pattern even though `0` is exactly the permitted value.
- **Fix:** Wrote `border-bottom:0;` (no space after the colon) in both places this rule appears — a pure formatting change, same value, satisfies the check's actual intent without touching the underlying CSS logic.
- **Files modified:** concept-d/assets/css/concept-d.css
- **Verification:** Ran the literal plan check (passes with the space removed); confirmed the value is still `0` in both cases.
- **Committed in:** 314a70a

---

**Total deviations:** 4 auto-fixed (3 real functional/visual bugs found via honest review + Puppeteer, 1 verification-methodology quirk). **Impact:** All three real bugs were caught before this SUMMARY was written, not deferred — the homepage now renders correctly (legible hero, working modal-close on every dialog, no scaffold-ownership race). No scope creep; all fixes are scoped to new chrome (concept-d.css/cards.js) or the new hero section's class list, never touching deployed.css/deployed.js.

## Issues Encountered
None beyond the four documented deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `concept-d/index.html` + the 3 new-chrome files are complete and verified: COND-01, COND-02, COND-03, COND-04, COND-06 (homepage half), and COND-07 are all satisfied
- The 8 card->dialog->module reveal pattern, the drawer-scaffold reparenting idiom, and the fritz-bg resize-on-open fix are all proven and ready to reference (though 05-03's standalone pages don't need them — no enclosing dialog there, the original global-scaffold pattern works unmodified per 05-RESEARCH.md)
- Nav hrefs (`pages/os.html`, `pages/labs.html`, `pages/work.html`, `pages/contact.html`) are wired and asserted by attribute — 05-03 needs to build those 4 pages next
- No blockers for 05-03

---
*Phase: 05-concept-d-home-variant*
*Completed: 2026-07-24*

## Self-Check: PASSED

All 4 created files verified present on disk (`[ -f ]`); all 3 task commits (`4eae712`, `314a70a`, `ac92034`) verified present in `git log --oneline --all`.
