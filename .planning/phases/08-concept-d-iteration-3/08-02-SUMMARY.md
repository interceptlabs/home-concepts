---
phase: 08-concept-d-iteration-3
plan: 02
subsystem: ui
tags: [css, vanilla-js, puppeteer, concept-d, hover-state, gallery, review-doc]

requires:
  - phase: 08-concept-d-iteration-3
    provides: "08-01's 8 standalone quiet explore pages + real <a class=\"card\"> anchor navigation replacing the 8 module dialogs"
provides:
  - "Top-anchored, enlarged Concept D hero (IT3-01): .hero-viewport justify-content flex-start + min-height calc(100dvh - 73px) subtracting the sticky topbar's own rendered height, .hero-d padding-top:0 neutralizing deployed.css's ported 100px hero padding, .hero-h1 clamp(34px,3.7vw,54px)"
  - "Unmistakable card hover/focus state (IT3-03): 400ms sine transitions, 40% white fill, translateY(-6px) scale(1.02), larger shadow, CTA flip to Flarepop -- identical on :focus-visible, fill-drop-only on :active (touch)"
  - "Reel v2 (IT3-04) verified playing via IntersectionObserver, budget-compliant, paused under reduced-motion"
  - "30-assertion Puppeteer behavior suite (fold x2, hover+focus parity, nav round-trips, drawers, reel, reduced-motion, no-JS) all green"
  - "12 judged captures (3 homepage + 9 explore-page) confirming composition, no regressions"
  - "Refreshed 16:10 gallery thumbnail and REVIEW.md Concept D section describing iteration 3"
affects: []

tech-stack:
  added: []
  patterns:
    - "Additive neutralization of a ported deployed.css ancestor rule via an explicit override on the more-specific new-chrome class (.hero-d padding-top:0 defeats .hero's ported padding:100px 0 0) rather than editing deployed.css itself"
    - "hero-viewport min-height subtracts the sticky topbar's measured rendered height via calc(100dvh - Npx) since a sticky element still consumes layout space above a sibling min-height:100dvh block"

key-files:
  created:
    - .planning/phases/08-concept-d-iteration-3/captures/home-1440x900.png
    - .planning/phases/08-concept-d-iteration-3/captures/home-1280x800.png
    - .planning/phases/08-concept-d-iteration-3/captures/card-hover-1440.png
    - .planning/phases/08-concept-d-iteration-3/captures/explore-problems-1440.png
    - .planning/phases/08-concept-d-iteration-3/captures/explore-interceptos-1440.png
    - .planning/phases/08-concept-d-iteration-3/captures/explore-agents-1440.png
    - .planning/phases/08-concept-d-iteration-3/captures/explore-labs-1440.png
    - .planning/phases/08-concept-d-iteration-3/captures/explore-labs-drawer-1440.png
    - .planning/phases/08-concept-d-iteration-3/captures/explore-insights-1440.png
    - .planning/phases/08-concept-d-iteration-3/captures/explore-case-hp-abx-1440.png
    - .planning/phases/08-concept-d-iteration-3/captures/explore-case-intel-abm-1440.png
    - .planning/phases/08-concept-d-iteration-3/captures/explore-case-sap-video-1440.png
    - .planning/phases/08-concept-d-iteration-3/deferred-items.md
  modified:
    - concept-d/assets/css/concept-d.css
    - assets/gallery/concept-d.png
    - REVIEW.md

key-decisions:
  - "Discovered (via mechanical fold assertions, not just the capture review) that .hero-viewport's original min-height:100dvh always overflowed the first viewport by exactly the sticky topbar's rendered height (72.1875px measured identically at 1440 and 1280 widths) since the topbar consumes real layout space above the hero-viewport sibling -- fixed with calc(100dvh - 73px), not previously an issue because the plan's own top-anchor change (justify-content flex-start) is what first made the overflow visible/measurable at the card-field's bottom edge"
  - "Neutralized deployed.css's ported .hero{padding:100px 0 0} via a .hero-d padding-top:0 override rather than editing deployed.css -- that 100px padding is correct for the full-height standalone hero deployed.css was designed for, but fights directly against IT3-01's 'hug the sticky topbar' requirement once .hero-viewport itself already supplies its own top padding"
  - "Left REVIEW.md's shared cross-concept 'States worth checking' paragraph's stale 'D's modals' phrase untouched, per Task 3's own explicit 'touch nothing else in REVIEW.md' instruction limiting edits to exactly three named things (Concept D paragraph, what-to-try hints, captures pointer) -- logged as a deferred item instead of auto-fixing under Rule 1, since the instruction's literal scope took precedence over silently expanding an explicitly bounded edit list"

requirements-completed: [IT3-01, IT3-03, IT3-04]

duration: 15min
completed: 2026-07-25
---

# Phase 8 Plan 2: Concept D hero/hover/reel closeout + capture-based visual QA Summary

**Top-anchored the Concept D hero under the sticky topbar with a ~53px headline, replaced the subtle card hover with an unmistakable 400ms lift+fill+Flarepop-CTA state, verified the already-shipped v2 work reel plays in-budget, and closed the phase with a 30-assertion Puppeteer pass plus 12 honestly-judged captures.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-07-25T13:26:27Z
- **Completed:** 2026-07-25T13:41:26Z
- **Tasks:** 3
- **Files modified:** 3 (concept-d.css, assets/gallery/concept-d.png, REVIEW.md) + 12 new capture PNGs + 1 deferred-items.md

## Accomplishments
- `.hero-viewport` top-anchored (`justify-content: flex-start`) with `min-height: calc(100dvh - 73px)` — subtracts the sticky topbar's own measured rendered height (72.1875px at both 1440 and 1280 widths) so the hero + full 5-card grid provably fit inside the first viewport at both sizes, mechanically confirmed via `getBoundingClientRect()` (`#modules` bottom ≤ viewport height, h1 top ≤ 180px from viewport top)
- `.hero-d { padding-top: 0 }` neutralizes deployed.css's ported `.hero{padding:100px 0 0}` so the kicker/headline hug the topbar instead of floating 100px lower
- `.hero-d .hero-h1` enlarged `clamp(26px,3.2vw,40px)` → `clamp(34px,3.7vw,54px)` (~53px computed at 1440, ~47px at 1280, both inside Jon's 44–56px target band, confirmed by computed-style assertions)
- Card hover/focus rebuilt: 1.1s → 400ms sine transitions, fill thins to 40% white (was 50%), `translateY(-6px) scale(1.02)` (was `-3px` only), larger shadow, CTA flips to Flarepop — identical `:focus-visible` end-state, `:active` (touch) keeps the fill-drop only, reduced-motion block extended to cover `.card-cta`
- 30/30 Puppeteer assertions green: fold mechanics ×2 viewports, hover + keyboard-focus parity, card→explore-page nav round-trips (section + case page), Labs drawer open/Esc-close, Agents detail overlay + convoDrawer, work-reel v2 IntersectionObserver playback (`currentSrc` contains `work-reel-1080`), reduced-motion (hero + reel both stay paused), no-JS card/back-link navigation
- Video budgets confirmed: webm 2.82MB (≤4.5MB), mp4 4.16MB (≤6MB), poster 20.7KB (≤300KB)
- 12 captures (3 homepage states + 8 explore pages + Labs drawer-open) READ and judged: no findings requiring a fix — deployed header intact everywhere, back link prominent, quiet modules render correctly as standalone pages, InterceptOS navy band stays legible, no white-on-white regressions
- Gallery thumbnail re-cropped to exact 16:10 showing the new top-anchored hero + card grid; REVIEW.md's Concept D paragraph, what-to-try hints, and captures pointer all updated to describe iteration 3 (everything else byte-identical)
- Final gate re-run all green: copy-diff substring (54 chunks/9 files), script-diff (13 checks), deployed.js/deployed.css byte-unchanged, banned tagline absent, comment-aware rule-line/gradient re-check (0 real violations)

## Task Commits

Each task was committed atomically:

1. **Task 1: Hero up/bigger + obvious hover (CSS) with judged fold + hover captures** - `e2f8597` (feat)
2. **Task 2: Puppeteer behavior suite + reel v2 verification + explore-page captures** - `ba421b8` (test)
3. **Task 3: Gallery thumbnail + REVIEW.md refresh + final gate re-run** - `8f4da22` (docs)

## Files Created/Modified
- `concept-d/assets/css/concept-d.css` - Top-anchored hero viewport (calc-based min-height, hero-d padding-top:0, enlarged h1 clamp), rebuilt obvious card hover/focus state, card-cta transition + reduced-motion coverage
- `assets/gallery/concept-d.png` - Refreshed 16:10 gallery thumbnail (1440-wide capture, PIL-cropped) showing the iteration-3 homepage
- `REVIEW.md` - Concept D paragraph, what-to-try hints, and captures pointer updated for iteration 3
- `.planning/phases/08-concept-d-iteration-3/captures/*.png` - 12 new judged captures (fold ×2, hover, 8 explore pages, Labs drawer)
- `.planning/phases/08-concept-d-iteration-3/deferred-items.md` - Logged one out-of-scope REVIEW.md staleness (see below)

## Decisions Made
See `key-decisions` in frontmatter: the topbar-height fold-overflow fix, the `.hero-d` padding neutralization, and the REVIEW.md scope-boundary decision.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `.hero-viewport`'s `min-height:100dvh` overflowed the first viewport by the topbar's own height**
- **Found during:** Task 2's own mechanical fold assertions (not the Task 1 capture review, which didn't visually flag it since the overflow was a modest ~44-72px at the very bottom edge)
- **Issue:** `.hero-viewport` sits in normal document flow *after* the sticky `.topbar` (which still consumes real layout space, sticky positioning doesn't remove it from flow). With `min-height: 100dvh`, total content height was topbar-height + 100dvh, always exceeding the actual viewport by exactly the topbar's rendered height (measured 72.1875px identically at both 1440 and 1280 widths, since the topbar's `padding:15px 28px` is fixed, non-responsive). This meant `#modules`' bottom edge sat 44–72px below the fold at both required sizes, failing the plan's own "full 5-card grid still fits inside the first viewport" truth.
- **Fix:** Changed `.hero-viewport`'s `min-height` to `calc(100dvh - 73px)`, subtracting the topbar's measured height (rounded up 1px for safety). Re-measured: `#modules` bottom now 871px (≤900) at 1440x900 and 771px (≤800) at 1280x800.
- **Files modified:** `concept-d/assets/css/concept-d.css`
- **Verification:** Puppeteer fold assertions pass at both viewport sizes; re-captured screenshots confirm the full 5-card grid visually inside the fold.
- **Committed in:** `e2f8597` (Task 1 commit)

**2. [Rule 1 - Bug] `.hero-d`'s inherited 100px top padding pushed the headline ~100px below the target zone**
- **Found during:** Task 2's h1-top-position mechanical assertion (h1 top must be within ~180px of viewport top)
- **Issue:** `section.hero.hero-d` inherits deployed.css's ported `.hero{padding:100px 0 0}` rule (designed for a full-height standalone hero section). Combined with `.hero-viewport`'s own 20px top padding, the kicker rendered at ~192px from viewport top and the h1 at ~221px — both well outside the plan's "close under the sticky topbar" requirement, even after the min-height fix above.
- **Fix:** Added `.hero-d { padding-top: 0 }` (additive neutralization of the ported rule, deployed.css itself never edited — same established pattern as the existing `.hero-d { border-bottom: 0 }` neutralization already in the file). Kicker now renders at ~92px, h1 at ~121px from viewport top.
- **Files modified:** `concept-d/assets/css/concept-d.css`
- **Verification:** Puppeteer h1-top assertion passes at both viewport sizes (120.98px, well under the 180px threshold); capture review confirms the headline visually hugs the topbar.
- **Committed in:** `e2f8597` (Task 1 commit)

**3. [Rule 1 - Bug] Task 1's own literal verify-command regex false-positives on compliant, consistently-formatted CSS**
- **Found during:** Running Task 1's own verify command as written
- **Issue:** `grep -q 'rgba(255,255,255,0.4)'` (no internal whitespace) never matches because the entire file — including all pre-existing rgba() declarations from prior phases — consistently uses comma-spaced formatting (`rgba(255, 255, 255, 0.75)` etc). The CSS itself was correct; the verify command's literal string just didn't match the codebase's own established style. Same class of false-positive already documented and fixed in 07-03 for a different pair of grep checks.
- **Fix:** Substituted a whitespace-tolerant check (`grep -qE 'rgba\(255,\s*255,\s*255,\s*0\.4\)'`) to confirm the rule genuinely exists rather than reformatting new CSS to break from the file's own established comma-spacing convention.
- **Files modified:** None (verification-only; CSS was never non-compliant)
- **Verification:** Corrected check passes; re-read the actual hover rule by hand to confirm it uses the exact 40% white value the plan specifies.
- **Committed in:** N/A (verification-only, no code change needed)

---

**Total deviations:** 3 auto-fixed (3 bugs — 2 real CSS fixes surfaced by this plan's own mechanical assertions, 1 verify-command false-positive matching 07-03's precedent)
**Impact on plan:** Both CSS fixes were necessary corrections to actually satisfy IT3-01's fold/positioning truths (the plan's starting-recipe CSS values were correct, but didn't account for the sticky topbar's layout footprint or the ported `.hero` padding) — no scope creep, no architectural changes. The verify-command fix required no code change at all.

## Issues Encountered

One out-of-scope documentation staleness was found and deliberately NOT fixed (logged instead), per the plan's own explicit scope boundary:

- **REVIEW.md's shared "States worth checking" paragraph still references "D's modals"** in its keyboard-only-paths clause, alongside B's hotspots and C's topic labels. Since 08-01, D has no modals (cards navigate to standalone explore pages instead). Task 3's instructions enumerated exactly three things to edit in REVIEW.md (the Concept D paragraph, the Concept D what-to-try hints, and the captures pointer line) and explicitly said "touch nothing else" — this shared cross-concept sentence wasn't in that list, so it was left alone and logged in `.planning/phases/08-concept-d-iteration-3/deferred-items.md` with a suggested fix for a future REVIEW.md pass.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness

- IT3-01, IT3-03, and IT3-04 are all complete and observably true: mechanical fold assertions pass at both 1440x900 and 1280x800, the hover/focus state is unmistakable by both computed-style assertion and capture review, and the v2 work reel plays via IntersectionObserver within budget.
- IT3-02 (proven complete in 08-01) is now additionally verified live by this plan's own behavior suite (nav round-trips, drawers, no-JS all green against the actual running site, not just static code inspection).
- **Phase 8 (Concept D — Iteration 3) is now FULLY COMPLETE** — both plans (08-01, 08-02) done, all 4 phase requirements (IT3-01 through IT3-04) satisfied, gallery thumbnail and REVIEW.md refreshed for iteration 3. This is the last remaining phase in the roadmap per STATE.md — 8/8 phases, 24/24 known plans now done.
- One minor, deliberately-deferred documentation staleness remains in REVIEW.md (see Issues Encountered / deferred-items.md above) — not blocking, not a code defect, purely a doc-prose accuracy nit outside this plan's explicit edit scope.
- No blockers.

---
*Phase: 08-concept-d-iteration-3*
*Completed: 2026-07-25*

## Self-Check: PASSED

All 12 new capture PNGs, `deferred-items.md`, the modified `concept-d.css`/`assets/gallery/concept-d.png`/`REVIEW.md`, and this SUMMARY.md itself were all confirmed present on disk. All 3 task commits (`e2f8597`, `ba421b8`, `8f4da22`) confirmed present in git history.
