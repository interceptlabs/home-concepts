---
phase: 08-concept-d-iteration-3
plan: 01
subsystem: ui
tags: [html, css, vanilla-js, view-transitions, concept-d, navigation]

requires:
  - phase: 07-concept-d-iteration-2
    provides: quiet module reskin (q-tabs/q-stepper/q-case-detail components), quiet-modules.js render layer, deployed.js null-guards
provides:
  - 8 standalone quiet explore pages replacing the homepage's 8 module dialogs
  - concept-d/index.html with zero <dialog> elements, all 8 cards + 3 case cards as real <a href> anchors
  - cross-document View Transition (@view-transition navigation:auto) covering every card->page navigation
  - retired concept-d/assets/js/cards.js (dialog wiring no longer needed)
affects: [08-02 (hover/motion polish + capture-based visual QA of the new navigation)]

tech-stack:
  added: []
  patterns:
    - "Standalone-page navigation instead of modal dialogs: card is a plain <a>, destination page repeats the deployed-style topbar/footer/drawer scaffold, first focusable element in <main> is a mono '.explore-back' link"
    - "Cross-document View Transitions via @view-transition{navigation:auto} loaded by both sides of every navigation (index.html + all pages/explore/*.html)"

key-files:
  created:
    - concept-d/pages/explore/problems.html
    - concept-d/pages/explore/interceptos.html
    - concept-d/pages/explore/agents.html
    - concept-d/pages/explore/labs.html
    - concept-d/pages/explore/insights.html
    - concept-d/pages/explore/case-hp-abx.html
    - concept-d/pages/explore/case-intel-abm.html
    - concept-d/pages/explore/case-sap-video.html
  modified:
    - concept-d/index.html
    - concept-d/assets/css/concept-d.css
    - concept-d/assets/js/quiet-modules.js
  deleted:
    - concept-d/assets/js/cards.js

key-decisions:
  - "Re-scoped every dialog.module-modal quiet-component selector in concept-d.css to .explore-page (mechanical rename, ~70 selectors) rather than duplicating the quiet CSS under a new scope; deleted the modal-shell/backdrop/close-button/morph-trio rules entirely since dialogs no longer exist"
  - "Fixed a real copy-diff regression found during Task 2's own verify gate: the InterceptOS/Agents/Insights homepage-card teasers were pre-existing truncated first-sentences of the os.lead/agents.lead/insights.lead canonical strings, previously masked by the full text living inside the now-deleted dialogs -- restored the full canonical lead text as the card teaser (matches the untruncated pattern already used by the Problems/Labs/case-study cards) rather than inventing a truncation escape hatch"
  - "Link-integrity checker's dead-link allowlist follows the plan's own instruction literally: zero new dead-link allowlist entries permitted from any pages/explore/*.html page, but pre-existing non-explore pages (index.html's 3 legal-page footer links, insights-hub.html's 8 un-mirrored article links) keep their already-documented 05-03/06-01/07-03 allowlist category unchanged -- 32 entries recorded, matching the ~33-34 historical count"

requirements-completed: [IT3-02]

duration: 35min
completed: 2026-07-25
---

# Phase 8 Plan 1: Concept D card-to-page navigation restructure Summary

**Converted Concept D's homepage from 8 module `<dialog>` popups to 8 real page navigations, each landing on a standalone quiet page with a prominent mono "Back to home" link and a cross-document View Transition cross-fade.**

## Performance

- **Duration:** ~35 min
- **Tasks:** 3
- **Files modified:** 4 (index.html, concept-d.css, quiet-modules.js, cards.js deleted)
- **Files created:** 8 (5 section explore pages + 3 case explore pages)

## Accomplishments
- 8 new standalone pages at `concept-d/pages/explore/` (problems, interceptos, agents, labs, insights, case-hp-abx, case-intel-abm, case-sap-video) — each with the deployed-style topbar, a `.explore-back` link as the first focusable element inside `<main>`, the full drawer scaffold (`#scrim`/`#convoDrawer`/`#pitchLabs`), a slim curio-only footer, and byte-identical module copy transplanted from the retired dialogs
- `concept-d/index.html` now has zero `<dialog>` elements: all 8 homepage cards + 3 work-reel case cards are plain `<a class="card" href="pages/explore/...">` anchors (no-JS works by construction, no duplicate fallback markup needed), CTA label changed `Open+` → `View+`, FAQ's Labs link retargeted to `pages/explore/labs.html`
- `concept-d/assets/css/concept-d.css`: ~70 `dialog.module-modal`-scoped quiet-component selectors re-scoped to `.explore-page`; the modal shell/backdrop/close-button/scaling-morph-trio rules deleted; added `@view-transition { navigation: auto; }` (exactly once) and the `.explore-back` mono chrome
- `concept-d/assets/js/quiet-modules.js`: InterceptOS→Agents bridge link retargeted from the dead in-page `#agents` anchor to the real `agents.html` page
- Deleted `concept-d/assets/js/cards.js` — its entire reason to exist (dialog open/close/morph/reparent wiring) is gone; drawers now live top-level on each explore page exactly like the deployed site

## Task Commits

Each task was committed atomically:

1. **Task 1: CSS/JS groundwork + 5 quiet section explore pages** - `e399072` (feat)
2. **Task 2: 3 case pages + homepage cards→anchors conversion (dialogs retire)** - `fb4d16e` (feat)
3. **Task 3: Plan gates — copy, script-diff, link integrity, brand greps** - no commit (verification-only task; all gates passed on first run given Tasks 1-2's work, once the Task-2 copy-diff regression below was fixed)

## Files Created/Modified
- `concept-d/pages/explore/problems.html` - Quiet Problems page (q-tabs + #quietSolve render)
- `concept-d/pages/explore/interceptos.html` - Quiet InterceptOS page (q-tabs + #quietFlow stepper)
- `concept-d/pages/explore/agents.html` - Agent roster page (deployed renderAgents grid + detail overlay + 13 glyph-* symbol defs)
- `concept-d/pages/explore/labs.html` - Quiet Labs page with working pitchLabs drawer CTA
- `concept-d/pages/explore/insights.html` - Quiet Insights page (3 ep-tiles + q-more details)
- `concept-d/pages/explore/case-hp-abx.html` / `case-intel-abm.html` / `case-sap-video.html` - Case pages (.q-case-detail render, case image, back link)
- `concept-d/index.html` - Homepage with 8 real `<a class="card">` navigations + 3 case-card anchors, zero dialogs, no cards.js/quiet-modules.js script tags
- `concept-d/assets/css/concept-d.css` - `.explore-page`-scoped quiet styles (dialog.module-modal scope retired), `@view-transition navigation:auto`, `.explore-back` chrome
- `concept-d/assets/js/quiet-modules.js` - InterceptOS bridge link retargeted from `#agents` to `agents.html`
- `concept-d/assets/js/cards.js` - deleted (git rm)

## Decisions Made
See `key-decisions` in frontmatter: the CSS re-scoping mechanics, the card-teaser copy-diff regression fix, and the link-integrity allowlist policy.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Restored full canonical `lead` text as homepage card teaser for InterceptOS/Agents/Insights cards**
- **Found during:** Task 2's own verify gate (`python3 qa/copy-diff.py --mode substring concept-d/index.html ...`)
- **Issue:** The InterceptOS/Agents/Insights card teasers on `index.html` had always been truncated first-sentences of the `os.lead`/`agents.lead`/`insights.lead` canonical strings (e.g. "You get the latest AI models and tools, plus our proprietary capabilities, working on your campaigns." — missing the field's final two sentences). This was invisible to the substring copy-diff gate before Task 2 because the full untruncated text also lived inside the now-deleted `<dialog>` blocks on the same page. Deleting the dialogs (Task 2's own job) removed that masking text, and the gate correctly flagged the truncated teaser as "chunk corrupted: page contains the opening words... but not the full text verbatim."
- **Fix:** Replaced the 3 truncated card-teaser strings with the complete, unmodified canonical `lead` text (no paraphrasing — this is MORE complete than before, matching the pattern already used by the Problems/Labs/case-study cards, whose teasers were always the full canonical string). `.card-teaser`'s existing `-webkit-line-clamp: 2` handles the visual truncation instead of a hard-coded text cut.
- **Files modified:** `concept-d/index.html`
- **Verification:** `python3 qa/copy-diff.py --mode substring` — 0 failures across all 40 chunks on index.html + the 3 new case pages (re-confirmed again in Task 3 across all 9 files, 54 chunks, 0 failures)
- **Committed in:** `fb4d16e` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Necessary correctness fix surfaced by the plan's own restructure (removing the dialogs that had coincidentally masked a pre-existing truncation); no scope creep, no copy paraphrasing — the fix uses more of the existing canonical string, never less.

## Issues Encountered
None beyond the deviation above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- IT3-02 is complete at the code level: all 8 cards + 3 case cards are real anchor navigations, every explore page has a clear consistent way back (mono `.explore-back` link + lockup), no module dialogs remain, drawers still function on the pages that need them (Labs' pitchLabs CTA, the Agents detail-overlay's contact CTA opening convoDrawer), and every mechanical gate is green (both copy gates, script-diff, link integrity at 32 pre-existing-only allowlist entries, brand greps, structural `@view-transition`/`.explore-back`-first-in-main checks).
- 08-02 (hover/motion polish + capture-based visual QA) can proceed directly against this committed state — live behavior verification (actually clicking through the cross-document View Transition, confirming the drawer scaffolds open correctly on each explore page, no-JS click-through) is explicitly deferred to 08-02 per this plan's own success criteria.
- No blockers.

---
*Phase: 08-concept-d-iteration-3*
*Completed: 2026-07-25*

## Self-Check: PASSED

All 8 created explore-page files found on disk, cards.js confirmed deleted, both task commits (`e399072`, `fb4d16e`) confirmed present in git history.
