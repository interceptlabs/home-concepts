---
phase: 03-concept-b-full-screen-video
plan: 03
subsystem: ui
tags: [css-starting-style, allow-discrete, prefers-reduced-motion, intersection-observer, visibilitychange, puppeteer, wcag-2.2.2]

# Dependency graph
requires:
  - phase: 03-01
    provides: Video hero shell, hotspot nav, top bar, video.js baseline (attemptPlay/toggle-sync)
  - phase: 03-02
    provides: Six statically-authored chapter-panel dialogs, panels.js, three full sub-pages
provides:
  - Native @starting-style + allow-discrete open/close motion on .chapter-panel and its ::backdrop (sine ease, no JS orchestration)
  - One-time .has-js hero entrance stagger (kicker, two h1 lines, then hotspots/topbar/toggle quiet-fade)
  - Full prefers-reduced-motion coverage: CSS instant-final-state block + JS video.pause() override of the native autoplay attribute
  - video.js battery guards: visibilitychange + IntersectionObserver(.hero-stage) pausing, userPaused guard (WCAG 2.2.2), hardened iOS play()-rejection fallback
  - Phase-closing mechanical QA: copy-diff --all, full brand grep suite, video byte-budget check, 11 reviewed responsive/panel captures
  - Inlined SVG logo in concept-b (fixes a pre-existing invisible-wordmark bug)
affects: [05 (cross-concept QA re-runs all these gates against concept-b again)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "@starting-style + transition-behavior: allow-discrete for dialog open/close — no JS animation orchestration, native display/overlay jump animates itself"
    - "One-time .has-js hero-rise keyframe stagger (kicker 0ms, h1 lines 120/240ms) + a separate quieter chrome-fade keyframe (topbar/hotspots/toggle, 300-720ms) — both frozen to final state and de-animated under prefers-reduced-motion"
    - "Explicit video.pause() + manual toggle-state sync for reduced-motion visitors, run BEFORE registering play/pause listeners — the native <video autoplay> HTML attribute plays independent of any JS gating, and pausing an element that never started playing does not reliably fire a 'pause' event"
    - "Inline SVG (not <img src>) for the shared logo when the surrounding page needs `fill=\"currentColor\"` to resolve to the page's actual text color — an externally-referenced SVG via <img> is a separate document context and can't inherit host CSS"

key-files:
  created:
    - .planning/phases/03-concept-b-full-screen-video/captures/index-390.png
    - .planning/phases/03-concept-b-full-screen-video/captures/index-768.png
    - .planning/phases/03-concept-b-full-screen-video/captures/index-1440.png
    - .planning/phases/03-concept-b-full-screen-video/captures/interceptos-390.png
    - .planning/phases/03-concept-b-full-screen-video/captures/interceptos-768.png
    - .planning/phases/03-concept-b-full-screen-video/captures/interceptos-1440.png
    - .planning/phases/03-concept-b-full-screen-video/captures/work-390.png
    - .planning/phases/03-concept-b-full-screen-video/captures/work-768.png
    - .planning/phases/03-concept-b-full-screen-video/captures/work-1440.png
    - .planning/phases/03-concept-b-full-screen-video/captures/panel-insights-390.png
    - .planning/phases/03-concept-b-full-screen-video/captures/panel-insights-1440.png
  modified:
    - concept-b/assets/css/concept-b.css
    - concept-b/assets/js/video.js
    - concept-b/index.html
    - concept-b/pages/problems.html
    - concept-b/pages/interceptos.html
    - concept-b/pages/work.html

key-decisions:
  - "Panel/backdrop transition duration kept at var(--dur-med) (800ms), matching 03-RESEARCH.md's code recipe exactly, rather than bumping to --dur-long — reviewed as not feeling crisp in the settled-transition capture checks"
  - "Hero h1 fade-back while a panel is open was left unimplemented (CONTEXT's own discretion item) — the panel's flat backdrop already dims the hero copy sufficiently; adding a second independent fade would be gratuitous motion the brand rules discourage"
  - "Logo inlined directly in concept-b's own 4 pages (not a shared/ file change) — scoped fix, zero cross-concept impact on already-shipped concept-a"

requirements-completed: [CONB-04, CONB-05]

# Metrics
duration: 22min
completed: 2026-07-24
---

# Phase 3 Plan 3: Motion Polish + Phase-Closing QA Summary

**Native `@starting-style`/`allow-discrete` panel transitions, a one-time `.has-js` hero stagger, full `prefers-reduced-motion` + battery/rejection guards in video.js, and an 11-capture mechanical QA sweep that caught and fixed three real bugs (invisible logo wordmark, reduced-motion not actually stopping playback, marginal loop-wide hero-copy contrast).**

## Performance

- **Duration:** ~22 min
- **Started:** 2026-07-24T16:18:28Z
- **Completed:** 2026-07-24T16:40:30Z
- **Tasks:** 2
- **Files modified:** 6 (CSS/JS/HTML), 11 created (QA captures)

## Accomplishments
- CONB-04 complete: reduced-motion visitors get a genuinely static poster (video.js now explicitly pauses and overrides the native `autoplay` attribute, not just skips its own `play()` calls), the hotspot nav stays fully visible/usable, and no sound can ever play (structural — no audio track in the encoded files)
- CONB-05 complete: WebM + poster = 5,007,084 bytes, mechanically enforced under the 7,340,032-byte (7MB) budget; `preload="metadata"` and the poster's `fetchpriority="high"` preload link both verified intact
- Chapter panels now animate open/close natively via `@starting-style` + `transition-behavior: allow-discrete` (opacity + `translateY(16px)`, sine ease, `--dur-med`) with a flat single-alpha backdrop fade — zero JS animation orchestration
- One-time hero entrance stagger (`.has-js`-scoped): kicker → h1 line 1 → h1 line 2, then a quieter chrome-fade for the topbar, all 6 hotspots, and the pause/play toggle
- video.js hardened with a `userPaused` guard (WCAG 2.2.2 — an explicit user pause is never auto-resumed), `visibilitychange` + `IntersectionObserver(.hero-stage)` battery pausing, and a reviewed (not device-exercisable) iOS `play()`-rejection fallback that leaves the poster + a working Play control with no scheduled retries
- 11 captures (9 responsive JS-off + 2 panel-open JS-on) reviewed at 390/768/1440: no overflow, no clipping, no hotspot collisions, panel internal scroll confirmed, back-navigation confirmed prompt (~75ms, no view-transition timeout hang)

## Task Commits

Each task was committed atomically:

1. **Task 1: Motion polish + complete reduced-motion/battery/rejection guards** - `d1ccf5d` (feat)
2. **Task 2: Mechanical QA — full gate, brand greps, budget check, responsive + panel captures** - `10f5363` (fix, folds in 3 bugs found during the review step)

**Plan metadata:** (this commit) - docs: complete plan

_Note: no TDD tasks in this plan — both are `type="auto"` CSS/JS/QA work; Task 2's commit is typed `fix` rather than `chore` because its most consequential content is the three bug fixes below, not the capture files themselves._

## Files Created/Modified
- `concept-b/assets/css/concept-b.css` - `@starting-style`/`allow-discrete` panel + backdrop transitions; `hero-rise`/`chrome-fade` keyframes + `.has-js` stagger delays; `prefers-reduced-motion` override block; strengthened hero-copy-wrap (40%→58%) and hotspot (35%/55%→48%/65%) flat overlay alphas after a loop-wide contrast check; broadened `.topbar__brand`/`.page-header__lockup` sizing selectors to include `.lockup-svg`
- `concept-b/assets/js/video.js` - `userPaused` guard; `visibilitychange` + `IntersectionObserver(.hero-stage, threshold 0.2)` battery pausing; hardened rejection fallback; explicit `video.pause()` + manual toggle sync for reduced-motion visitors (overrides the native `autoplay` attribute, which JS gating alone can't stop)
- `concept-b/index.html` - `<img src="/shared/logo/lockup.svg">` replaced with the inlined SVG (class `lockup-svg`) so `fill="currentColor"` resolves to the page's actual white text color
- `concept-b/pages/problems.html`, `concept-b/pages/interceptos.html`, `concept-b/pages/work.html` - same logo-inlining fix applied to each page-header
- `.planning/phases/03-concept-b-full-screen-video/captures/*.png` - 11 reviewed QA captures (index/interceptos/work × 390/768/1440 with JS disabled, panel-insights × 390/1440 with JS enabled)

## QA Results

| Check | Result |
|---|---|
| `copy-diff.py --all concept-b` | PASS — 4 pages, 340 chunks, 0 failures |
| Brand grep suite (banned tagline, deprecated hexes, `<hr>`, border-top/bottom, raw-hex/non-Flarepop colored text, `gradient(`, `view-transition-name`) | All 8 clean |
| Video budget (CONB-05) | WebM (4,858,475 B) + poster (148,609 B) = 5,007,084 B ≤ 7,340,032 B budget |
| LCP wiring | `preload="metadata"` + poster `fetchpriority="high"` both present |
| Loop-wide contrast (frames at 4s/12s/20s of the 24s loop) | Marginal at frame 0 alone; bright specular highlights pass through the hero-copy/hotspot regions at other points — fixed by strengthening the flat overlays (see Deviations) |
| Responsive captures (9, JS off) | index/interceptos/work × 390/768/1440 — no overflow, no clipped type, no hotspot collisions, no-JS fallback links visible on index |
| Panel-open captures (2, JS on) | insights panel × 390/1440 — internal scroll confirmed (episode 3 clipped by design), flat dimmed backdrop over the still-visible hero copy, no collision |
| Reduced-motion functional check (Puppeteer `emulateMediaFeatures`) | Video stays paused on load, toggle correctly shows "Play"; an explicit toggle click still plays it (WCAG allows explicit request) |
| Battery guards functional check | Tab-hidden pauses, tab-visible resumes; an explicit user pause survives a hide/show cycle and stays paused (never auto-resumed) |
| Panel regression (6 hotspots × open/Esc-close, plus focus-return) | All pass after the `@starting-style` transition changes |
| Back-navigation (sub-page → homepage) | ~75ms, no view-transition timeout hang (03-RESEARCH.md pitfall 5) |
| Dialog-close-before-navigate (inherited from 03-02) | Re-confirmed still wired: `panels.js` closes the dialog synchronously before any `a.panel-cta` navigation proceeds |

## Decisions Made
- Kept panel/backdrop transitions at `var(--dur-med)` (800ms) rather than bumping to `--dur-long` — this matches 03-RESEARCH.md's code recipe exactly and read as unhurried, not crisp, once observed settled in the panel-open captures
- Left the hero `h1` fade-back-while-panel-open question (CONTEXT's own discretion item) unimplemented — the panel's flat backdrop already dims the hero copy adequately; a second independent fade layered on top would be motion for its own sake
- Fixed the invisible-logo bug by inlining the SVG in concept-b's own 4 pages rather than editing `shared/logo/lockup.svg` — keeps the fix scoped to this concept with zero risk to already-shipped concept-a

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Logo wordmark invisible on the dark hero/page-header background**
- **Found during:** Task 2, review step 7 (reading the 390-width homepage capture)
- **Issue:** `shared/logo/lockup.svg`'s wordmark uses `fill="currentColor"`, but concept-b embedded it via `<img src="/shared/logo/lockup.svg">`. An externally-referenced SVG loaded through `<img>` is rendered in its own document context and cannot inherit the host page's CSS `color` — so `currentColor` resolved to the SVG's own black default, rendering the "Intercept" wordmark invisible against both the dark video hero and the dark `--surface` page-header background on all 3 sub-pages. This was a pre-existing bug from 03-01/03-02, not introduced by this plan, but directly visible in every one of this task's own review captures.
- **Fix:** Inlined the raw SVG markup (with an added `class="lockup-svg"` for CSS targeting) in place of the `<img>` tag in `concept-b/index.html` and all 3 sub-page headers — `fill="currentColor"` now resolves to the page's real white `--fg` text color. No change to the shared file itself, so concept-a (already shipped) and concept-c (not yet built) are unaffected.
- **Files modified:** concept-b/index.html, concept-b/pages/problems.html, concept-b/pages/interceptos.html, concept-b/pages/work.html, concept-b/assets/css/concept-b.css (broadened `.topbar__brand`/`.page-header__lockup` sizing selectors)
- **Verification:** Re-ran copy-diff --all (still 340/340) and the full brand grep suite (clean — the inlined SVG's own decorative hex fills don't match any banned/deprecated pattern); re-captured all 3 widths and confirmed the full wordmark renders in white
- **Committed in:** 10f5363

**2. [Rule 1 - Bug] `prefers-reduced-motion` did not actually stop video playback**
- **Found during:** Task 2, functional verification (Puppeteer `emulateMediaFeatures` check run after the capture review, since CONB-04's reduced-motion requirement can't be confirmed from a static screenshot alone)
- **Issue:** `video.js`'s `attemptPlay(userInitiated)` correctly skipped its own `.play()` call under reduced motion, but the `<video>` element also carries the native HTML `autoplay` attribute in markup — that attribute plays the element on its own, independent of any JS gating. The reduced-motion check only ever stopped OUR code from calling `play()`; it never stopped the browser's own native autoplay from having already started it. A functional check confirmed the video was actually playing (`paused: false`) under emulated reduced motion, contradicting the plan's own must_have truth.
- **Fix:** Added an explicit `video.pause()` for reduced-motion visitors, placed before the `play`/`pause` event listeners are registered, with a manual `setToggleState(false)` call alongside it — pausing an element that never actually started playing doesn't reliably fire a native `pause` event, so the toggle button would otherwise still (wrongly) read "Pause" even though the video was static.
- **Files modified:** concept-b/assets/js/video.js
- **Verification:** Puppeteer functional check with `emulateMediaFeatures([{name: 'prefers-reduced-motion', value: 'reduce'}])`: video stays paused on load, toggle correctly reads "Play"; a subsequent explicit toggle click still plays it (confirms WCAG's allowance for an explicit user request survives the gate). Also re-verified normal (non-reduced-motion) autoplay, visibilitychange pause/resume, and the userPaused-survives-hide/show-cycle guard all still behave correctly.
- **Committed in:** 10f5363

**3. [Rule 2 - Missing Critical] Loop-wide hero-copy/hotspot contrast was marginal, not just at frame 0**
- **Found during:** Task 2, action step 4 (extracting frames at 4s/12s/20s of the 24s loop, per 03-RESEARCH.md's explicit "don't judge contrast on frame 0 alone" pitfall)
- **Issue:** The liquid-chrome footage has bright specular highlights that sweep through the hero-copy region (left ~46% of the viewport) and several hotspot positions at points across the loop, not visible in a frame-0-only check. The original flat overlay alphas (hero-copy-wrap 40%, hotspot 35%/hover 55%) left legibility marginal at those brighter moments.
- **Fix:** Strengthened both overlays — hero-copy-wrap to 58%, hotspot to 48%/hover 65% — while keeping them flat single-alpha layers (never a gradient, per the no-scrims rule).
- **Files modified:** concept-b/assets/css/concept-b.css
- **Verification:** Re-ran copy-diff --all and the full brand grep suite (both clean); re-captured and reviewed all 3 index.html widths with the new alphas
- **Committed in:** 10f5363

---

**Total deviations:** 3 auto-fixed (2 bugs, 1 missing-critical contrast fix)
**Impact on plan:** All three were caught by this plan's own mandated QA steps (capture review, functional reduced-motion check, loop-wide contrast spot-check) and are exactly the class of defect those steps exist to catch. No scope creep — all fixes are scoped to concept-b's own files.

## Issues Encountered
- Puppeteer's `page.goto(..., { waitUntil: 'networkidle0' })` intermittently timed out against Python's `http.server` when the page contained the autoplaying `<video>` (likely a persistent connection never reaching network-idle) — switched functional-check scripts to `domcontentloaded` + a short explicit wait, consistent with the same fix already noted in 03-02's SUMMARY. No project code affected.
- The first panel-open capture attempt (400ms wait after `waitForSelector('dialog[open]')`) caught the `@starting-style` transition mid-flight (opacity ~50%, backdrop ~half-strength), producing a double-exposure-looking screenshot — this was purely a capture-script timing issue, not a CSS bug; increased the wait to 1100ms (comfortably past the 800ms `--dur-med` transition) and the recapture showed the correctly settled panel.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Concept B (Phase 3) is now fully complete: CONB-01 through CONB-05 all done and verified
- Phase 5 (cross-concept QA) will re-run copy-diff, the brand grep suite, and responsive captures against concept-b again alongside concepts A and C — no known blockers
- The 11 captures in this phase's `captures/` directory remain available for that cross-concept review as a before-state reference

---
*Phase: 03-concept-b-full-screen-video*
*Completed: 2026-07-24*

## Self-Check: PASSED

All 6 modified files and all 11 QA capture PNGs verified present on disk; both task commit hashes (d1ccf5d, 10f5363) verified in git log.
