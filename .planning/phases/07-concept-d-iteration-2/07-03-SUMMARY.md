---
phase: 07-concept-d-iteration-2
plan: 03
subsystem: testing
tags: [concept-d, qa, puppeteer, view-transitions, gallery, review, closeout]

# Dependency graph
requires:
  - phase: 07-concept-d-iteration-2
    provides: "07-01/07-02's structurally final Concept D homepage: compact hero + 5-card grid + work-reel section (07-01), View Transitions card-to-window morph + full quiet progressive-disclosure reskin of all 8 module windows (07-02)"
provides:
  - Full mechanical QA gate suite green on Concept D's final state (copy-diff, script-diff, brand greps, sine-timing assertion, link integrity, video budgets)
  - New sine-only ::view-transition-timing assertion (scratchpad) replacing the retired `! grep view-transition-name` ban
  - 20/20 Puppeteer behavior assertions across fold (x2), hover, both videos' IntersectionObserver gating, card-to-window morph coverage + Esc/focus-return, the #convoDrawer drawer invariant, reduced-motion, and no-JS
  - 23 reviewed captures in .planning/phases/07-concept-d-iteration-2/captures/ (14 touched/created this plan)
  - Refreshed assets/gallery/concept-d.png (iteration-2 layout, exact 16:10)
  - Refreshed REVIEW.md Concept D walkthrough, what-to-try hints, and evidence line
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Sine-only ::view-transition timing assertion (brace-scan the concept-d.css rule body, assert animation-duration/animation-timing-function exactly, exempt the reduced-motion animation:none block) replacing a literal-substring ban that a legitimate later plan (07-02) made obsolete"
    - "Comment-aware / value-aware Python re-checks substituted for two of this same task's own literal grep verify commands, after both were found to false-positive on fully-compliant CSS (see key-decisions)"

key-files:
  created:
    - .planning/phases/07-concept-d-iteration-2/captures/index-390.png
    - .planning/phases/07-concept-d-iteration-2/captures/index-nojs-1440.png
    - .planning/phases/07-concept-d-iteration-2/captures/index-reduced-1440.png
    - .planning/phases/07-concept-d-iteration-2/captures/morph-midflight-1440.png
    - .planning/phases/07-concept-d-iteration-2/captures/window-agents-drawer-1440.png
    - .planning/phases/07-concept-d-iteration-2/captures/window-case-1440.png
    - .planning/phases/07-concept-d-iteration-2/captures/window-case-detail-1440.png
    - .planning/phases/07-concept-d-iteration-2/captures/window-os-1440.png
    - .planning/phases/07-concept-d-iteration-2/captures/window-problems-390.png
    - .planning/phases/07-concept-d-iteration-2/captures/work-reel-1440.png
  modified:
    - .planning/phases/07-concept-d-iteration-2/captures/card-hover-1440.png
    - .planning/phases/07-concept-d-iteration-2/captures/index-fold-1440x900.png
    - assets/gallery/concept-d.png
    - REVIEW.md

key-decisions:
  - "Task 1's own literal verify command for 'no border-top/bottom rule lines' (`grep -IE 'border-(top|bottom)[[:space:]]*:[[:space:]]*[^0n]'`) false-positives on every already-compliant `border-top: 0;` neutralization in concept-d.css: the regex's `[[:space:]]*` before `[^0n]` can back off to zero-width, letting the required-non-0/n character be satisfied by the whitespace itself. Substituted a corrected Python check (parse the actual declared value, flag only values that are neither `0` nor `none`) and confirmed zero real violations -- the CSS itself was always compliant, only the gate's regex was wrong."
  - "Task 1's own literal verify command for 'no gradients' also false-positives: one CSS comment (documenting deployed.css's own EXEMPT light-theme override, quoted verbatim for a specificity explanation) contains the substring 'linear-gradient', which a plain grep can't distinguish from a real declaration. Substituted a comment-stripped Python check and confirmed zero real gradient declarations in new chrome."
  - "Reused 05-03's existing scratchpad link-integrity checker (concept-d-linkcheck.py) verbatim rather than writing a new one -- its allowlist already matches this plan's interfaces block exactly (insights-hub.html#episodes JS-hash-route, about.html's #main pre-existing bug) and it passed with 0 non-allowlisted failures across all 8 concept-d HTML files on first run"
  - "Added a 14th capture (window-case-detail-1440.png, scrolled ~250px inside the case dialog's own overflow:auto scroll container) beyond the plan's named list, since the case window's stat/name/summary anchor and its single-open Challenge/Approach/Results disclosure can't both fit in one unscrolled 828px-tall dialog frame (total content is 1064px) -- both pieces of required evidence are now honestly captured across the two related shots"
  - "Tasks 1 and 2 made zero changes to concept-d's shipped code (every mechanical gate and every behavior assertion passed against the page as 07-02 left it) -- following 06-01's own precedent, neither task has a code commit; Task 1 is verification-only and Task 2's only repo changes are the capture PNGs themselves, committed together with the passing suite"

patterns-established:
  - "Gate-correctness deviations (a verify command's own regex is wrong, not the code it's checking) get the same Rule 1 auto-fix treatment as product bugs: fix the assertion, re-verify the real code is compliant, document why the literal command as written would have false-failed"

requirements-completed: [ITER-01, ITER-02, ITER-03, ITER-04, ITER-05, ITER-06, ITER-07, ITER-08]

# Metrics
duration: 20min
completed: 2026-07-25
---

# Phase 7 Plan 3: Closeout QA, Behavior Suite, Gallery + REVIEW.md Refresh Summary

**Full mechanical + Puppeteer-behavior QA suite (33 total checks: 13 mechanical gate categories plus 20 behavior assertions) run green against Concept D's iteration-2 homepage with zero code fixes needed, then the root gallery thumbnail and REVIEW.md's Concept D section refreshed to describe the new compact-hero/card-grid/work-reel/quiet-window structure.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-07-25T05:04:00Z (approx, immediately following 07-02's completion)
- **Completed:** 2026-07-25T05:24:48Z
- **Tasks:** 3
- **Files modified:** 14 (12 new + 2 refreshed captures, assets/gallery/concept-d.png, REVIEW.md)

## Accomplishments

- Full mechanical gate suite green on Concept D's final state: both copy gates (71 substring chunks across 5 pages + 13 script-diff checks), 6 brand-grep categories, a new sine-only `::view-transition` timing assertion, cross-file link integrity (384 links, 33 documented allowlist entries, 0 real failures), and all 5 video-budget/markup checks
- Wrote and ran a 20-assertion Puppeteer behavior suite (real installed Chrome, `page.setViewport`, `--autoplay-policy=no-user-gesture-required`) covering fold at both 1440x900 and 1280x800, the card hover translucency shift, both videos' IntersectionObserver gating (hero playing at load, reel byte-idle with `readyState 0` until `#work-reel` scrolls into view, paused again on scroll-out), the reel toggle's pause/play + `aria-pressed` sync, the card-to-window morph's >=85%-both-axes coverage + Esc/focus-return, the `#convoDrawer` full-viewport invariant through Agents -> detail -> contact, reduced-motion (both videos paused, dialog opens instantly with no morph), and the no-JS fallback
- 23 total captures in the phase's captures directory (14 touched this plan), every one read with the Read tool and honestly judged -- zero bugs found in new chrome
- Found and corrected two bugs in this task's own literal verify-command regexes (not in the shipped code -- see key-decisions): the border-top/bottom "no rule lines" grep and the "no gradients" grep both false-positive against fully-compliant CSS
- Refreshed `assets/gallery/concept-d.png` (1440x900, exact 16:10) to show the iteration-2 compact hero + 5-card grid, replacing the stale Phase-5 thumbnail
- Rewrote REVIEW.md's Concept D paragraph, what-to-try hints, and evidence line to describe the new structure and point at this phase's captures, touching nothing else in the document

## Task Commits

Each task was committed atomically:

1. **Task 1: Mechanical gate suite -- copy, brand, links, budgets** -- no commit (verification-only; every gate already passed against 07-02's committed state, zero code changes needed)
2. **Task 2: Behavior suite + full capture set + honest review** -- `86619cf` (test)
3. **Task 3: Refresh gallery thumbnail + REVIEW.md Concept D paragraph** -- `57c06ba` (feat)

**Plan metadata:** (this commit, docs: complete plan)

## QA Results Table

### Task 1 — Mechanical gates

| Gate | Command | Result |
|------|---------|--------|
| Copy gate (substring) | `qa/copy-diff.py --mode substring` on index + 4 section pages | PASS -- 5 pages, 71 chunks, 0 failures |
| Script-diff (JS-templated copy) | `qa/concept-d-script-diff.py` | PASS -- 13 checks, 0 failures |
| Banned tagline | `grep -rIiE 'fresh thinking starts here' concept-d` | PASS -- 0 matches |
| Deprecated mark hex | `grep -rIiE 'a855f7\|6366f1\|22d3ee' concept-d` | PASS -- 0 matches |
| No `<hr` elements | `grep -Ii '<hr' concept-d/index.html` | PASS -- 0 matches |
| Token-only colors | `grep -IE '(^\|[^-])color:[^;}]*#' concept-d.css` | PASS -- 0 matches |
| No gradients (real declarations) | corrected comment-stripped Python check (raw grep had 1 comment-only false positive -- see key-decisions) | PASS -- 0 real gradient declarations |
| No rule-line borders (real values) | corrected Python value check (raw grep had 3 false positives on compliant `border-top: 0;` -- see key-decisions) | PASS -- 0 real violations |
| Sine-only `::view-transition` timing | new `vt-sine-check.py` (brace-scan rule body, assert 600ms + cubic-bezier(0.37, 0, 0.63, 1), exempt reduced-motion block) | PASS -- 1 rule block, exempt block verified |
| No `data-case` substring | `grep -q 'data-case' concept-d/index.html` | PASS -- 0 matches |
| No `data-copy` substring | `grep -rI 'data-copy' concept-d` | PASS -- 0 matches |
| Link integrity | `concept-d-linkcheck.py` (05-03's existing scratchpad script, reused as-is) | PASS -- 8 files, 384 links checked, 33 allowlisted, 0 failures |
| Video budgets + markup | file sizes + attribute grep | PASS -- hero webm 2.29MB, hero poster 94.6KB, reel webm 2.45MB, reel mp4 3.94MB, reel poster 143.6KB (all under budget); reel markup `preload="none"` + poster + muted/playsinline/loop + no autoplay attr + webm-before-mp4 confirmed |

### Task 2 — Behavior suite (20/20 assertions passed)

| # | Assertion | Result |
|---|-----------|--------|
| 1-2 | Fold 1440x900: `#modules` bottom <= innerHeight; `.hero-h1` top >= 0 | PASS (816.5 <= 900; 360.7 >= 0) |
| 3 | Hover: card background alpha thins on hover | PASS (0.75 -> 0.5) |
| 4-6 | Videos at load: hero playing, reel paused, reel `readyState` 0 | PASS (all three) |
| 7 | Reel plays once `#work-reel` scrolls into view | PASS |
| 8 | Reel pauses again after scrolling back to top | PASS |
| 9-10 | Reel toggle: click 1 pauses (aria-pressed=false), click 2 resumes (aria-pressed=true) | PASS |
| 11 | Transition: `dlg-os` open, covers >=85% both axes | PASS (96.0% x 92.0%) |
| 12-13 | Esc closes `dlg-os`; focus returns to invoking card | PASS |
| 14 | Drawer invariant: `#convoDrawer` spans full viewport via Agents -> detail -> contact | PASS |
| 15-16 | Fold 1280x800: `#modules` bottom <= innerHeight; `.hero-h1` top >= 0 | PASS (765.2 <= 800; 312.0 >= 0) |
| 17-18 | Reduced-motion: both videos paused at load | PASS |
| 19 | Reduced-motion: card click opens dialog instantly (no morph) | PASS |
| 20 | Mobile 390: no horizontal overflow with a dialog open | PASS |

Re-run after the suite: `qa/copy-diff.py --mode substring concept-d/index.html` and `qa/concept-d-script-diff.py` both green on the final state.

### Captures (23 total in the phase captures directory; 14 touched this plan, all read and judged)

| Capture | Verdict |
|---------|---------|
| index-fold-1440x900.png (refreshed) | Compact hero + all 5 cards fully visible, uniform tiles, bottom-anchored copy, legible CTAs |
| index-fold-1280x800.png | Same read at the narrower breakpoint; byte-identical to 07-01's own capture (no regression) |
| card-hover-1440.png (refreshed) | Fill visibly thins on hover, calm, still AA-legible |
| work-reel-1440.png | Heading panel legible over the montage; 3 case cards match section-card composition |
| morph-midflight-1440.png | Best-effort ~250ms mid-morph frame; card growing toward the window mid-transition, as expected for a snapshot mid-animation |
| window-os-1440.png | One stage visible, quiet stepper rail, dark navy band with legible border+color-only active states (07-02's contrast fix holds) |
| window-case-1440.png | Stat anchor (55%), client/tag, heading, summary, image all visible unscrolled |
| window-case-detail-1440.png (new) | Scrolled ~250px inside the dialog's own overflow container: Challenge/Approach/Results tabs + agents credit line render correctly, one section open at a time |
| window-agents-drawer-1440.png | `#convoDrawer` fills the true viewport from inside the Agents dialog -- invariant holds |
| index-reduced-1440.png | Problems dialog open instantly (no morph); hero toggle reads "PLAY" confirming the paused reduced-motion state |
| index-nojs-1440.png | Card fallbacks render identically to the JS cards (same markup/CSS); custom video toggles correctly hidden; FAQs/convert/footer readable inline. One benign observation: Chrome renders its own native video scrub-bar UI when JavaScript is disabled site-wide (the `autoplay` HTML attribute still plays the muted video independent of JS) -- an accessible browser fallback, not a defect in this phase's markup |
| index-390.png | 5 cards responsively reflow to a 2-column mobile grid, no cropping or overlap |
| window-problems-390.png | Problems window fits at 390px with a reachable close button and readable stacked tab list, no horizontal overflow |

### Task 3 — Gallery + REVIEW.md

| Check | Result |
|-------|--------|
| `assets/gallery/concept-d.png` is exactly 16:10 | PASS (1440x900) |
| Thumbnail refreshed (newer than 07-02-PLAN.md) | PASS |
| REVIEW.md mentions "work reel" and "quiet" | PASS |
| REVIEW.md evidence line points at this phase's captures | PASS |
| No other REVIEW.md content touched | Confirmed via `git diff REVIEW.md` -- only the Concept D paragraph, what-to-try list, and evidence line changed |

## Files Created/Modified

- `.planning/phases/07-concept-d-iteration-2/captures/*.png` -- 12 new + 2 refreshed captures from the behavior suite (fold x2, hover, work-reel, morph-midflight, both windows for InterceptOS and the SAP case incl. its scrolled detail state, the Agents drawer invariant, reduced-motion, no-JS, and two mobile-390 shots)
- `assets/gallery/concept-d.png` -- refreshed 1440x900 (16:10) gallery thumbnail showing the iteration-2 homepage
- `REVIEW.md` -- Concept D paragraph, what-to-try hints, and evidence line rewritten for iteration 2; nothing else touched

## Decisions Made

See key-decisions in frontmatter. In summary: two of this task's own literal grep verify commands (border-top/bottom rule-line ban, gradient ban) were found to false-positive against CSS that is actually fully compliant -- both were corrected with equivalent, intent-accurate Python checks rather than treated as real code violations, since re-reading the flagged lines by hand confirmed the CSS itself needed no changes. A 14th capture was added beyond the plan's named list to honestly cover both halves of the case-window review criteria (stat anchor + C/A/R disclosure), since they don't both fit in one unscrolled dialog frame. Tasks 1 and 2 needed no commits for code (matching 06-01's own precedent) since every gate and assertion passed against 07-02's already-committed state.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Task 1's own "no rule-line borders" verify regex false-positives on compliant CSS**
- **Found during:** Task 1 (running the plan's literal verify command)
- **Issue:** `grep -IE 'border-(top|bottom)[[:space:]]*:[[:space:]]*[^0n]' concept-d/assets/css/concept-d.css` matched all 3 existing `border-top: 0;` neutralizations (07-02's own "no rule lines" fix). The regex's `[[:space:]]*` immediately before `[^0n]` can back off to a zero-width match, letting the required "not 0 or n" character be satisfied by the whitespace character itself rather than the actual declared value.
- **Fix:** Substituted a corrected Python check that parses the actual `border-top`/`border-bottom` value and flags only values that are neither `0` nor `none`.
- **Files modified:** None (concept-d.css was already compliant; only the verification method changed, scratchpad-only)
- **Verification:** Corrected check reports 0 real violations; manual read of all 3 flagged lines confirms each is `border-top: 0;` or `border-bottom: 0;` (07-02's intended neutralization).
- **Committed in:** N/A (verification-only, no repo files changed)

**2. [Rule 1 - Bug] Task 1's own "no gradients" verify regex false-positives on a documentation comment**
- **Found during:** Task 1 (running the plan's literal verify command)
- **Issue:** `grep -IE 'linear-gradient|radial-gradient|conic-gradient' concept-d/assets/css/concept-d.css` matched a CSS comment (line 810) that quotes deployed.css's own EXEMPT light-theme override verbatim, for a cascade-specificity explanation -- not a real declaration in new chrome.
- **Fix:** Substituted a comment-stripped Python check (`re.sub(r'/\*.*?\*/', '', css, flags=re.S)` before searching).
- **Files modified:** None (scratchpad-only)
- **Verification:** Corrected check reports 0 real gradient occurrences outside comments.
- **Committed in:** N/A (verification-only, no repo files changed)

**3. [Rule 1 - Bug] behavior-suite.mjs's own click timing was too early during the Agents dialog's open morph**
- **Found during:** Task 2's first suite run
- **Issue:** Clicking `#agentsGrid [data-agent]` only 500ms after `#dlg-agents[open]` (before the 600ms open morph settles) caused Puppeteer's `page.click()` to miss -- `openAgent()` never ran, so `#agentDetailOverlay.is-open` never appeared and the subsequent `waitForSelector` timed out. Isolated testing confirmed the click target itself was never obstructed (`elementFromPoint` always resolved inside the button); a longer wait (900ms) reliably fixed it.
- **Fix:** Extended the wait after `#dlg-agents[open]` from 500ms to 900ms before interacting with the grid.
- **Files modified:** None (scratchpad test script only)
- **Verification:** Re-run of the full suite: 20/20 assertions pass, including the drawer invariant.
- **Committed in:** N/A (test-script fix, not a repo file)

---

**Total deviations:** 3 auto-fixed (all Rule 1 - bugs in this plan's own verification tooling, none in shipped concept-d code)
**Impact on plan:** Zero impact on Concept D's shipped code -- every real assertion, once correctly expressed, passes against 07-02's committed state with no fixes needed. All three deviations were caught and resolved within this plan's own QA-writing process, documented per the "gate correctness" pattern established here for future plans that hit the same class of issue (07-01 and 07-02 both logged similar literal-substring-vs-intent collisions in their own verify gates).

## Issues Encountered

None beyond the deviations above, all resolved within this plan's own execution.

## User Setup Required

None -- no external service configuration required. Everything ran locally against `./serve.sh` on :4340; nothing deployed anywhere, per the project's standing local-only instruction for this phase.

## Next Phase Readiness

- **Phase 7 (Concept D -- Iteration 2) is now FULLY COMPLETE** -- all 3 plans (07-01, 07-02, 07-03) done. ITER-01 through ITER-08 (all 8 phase requirements) were completed by 07-01/07-02 and are now backed by this plan's full mechanical + behavior QA suite, with zero regressions and zero code fixes needed.
- This closes out the last remaining phase in the current roadmap (7/7 phases, 22/22 known plans). Jon can open `http://localhost:4340/` and see the current Concept D iteration represented in both the gallery thumbnail and REVIEW.md.
- No blockers, no deferred items, no open concerns specific to this plan. The project's pre-existing, out-of-scope notes (Concept C's on-device low-tier GPU check, `concept-d/about.html`'s pre-existing `#main` skip-link bug) remain unchanged and are not part of this phase's scope.
- The two gate-correctness fixes documented above (border-top/bottom regex, gradient-comment false-positive) are scratchpad-only and not committed to `qa/`; if a future phase wants a permanent, reusable version of this plan's sine-timing or gate-correctness checks, promoting them into `qa/*.py` (following the `qa/camera-framing-check.mjs` precedent) would be the next step -- not required for this plan's own completion.

---
*Phase: 07-concept-d-iteration-2*
*Completed: 2026-07-25*

## Self-Check: PASSED

All 10 created/refreshed capture files, `assets/gallery/concept-d.png`, `REVIEW.md`, and this SUMMARY.md confirmed present on disk; both task commit hashes (`86619cf`, `57c06ba`) confirmed present in git history.
