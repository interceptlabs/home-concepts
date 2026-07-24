---
phase: 04-concept-c-experimental-webgl-3d
plan: 03
subsystem: ui
tags: [three.js, webgl, accessibility, device-tiering, qa, focus-visible, reduced-motion]

# Dependency graph
requires:
  - phase: 04-concept-c-experimental-webgl-3d (04-01, 04-02)
    provides: scene.js topic-field foundation (capability probe, static-scene, camera dolly, projected labels), below-fold sections, 3 sub-pages
provides:
  - deviceTier() heuristic (hardwareConcurrency primary, deviceMemory Chromium-only bonus, viewport fallback) applied before renderer/material construction
  - Locked-spec static-scene refinement (DPR 1 unconditional, no rAF/parallax/scroll work, orientationchange re-render)
  - Consistent 2px solid var(--fg) :focus-visible treatment across every interactive element in concept-c (labels, index, CTAs, sub-page links, footer links)
  - @media (prefers-reduced-motion: reduce) CSS-level animation/transition kill switch (belt-and-braces alongside the JS gate)
  - Topic-label backing chip (fixes a real narrow-viewport label/hero-copy collision found via capture review)
  - Full phase-closing mechanical QA: copy-diff, 8-grep brand suite, scratchpad link-integrity script, 18 reviewed captures, functional spot checks
affects: [05-gallery-and-cross-concept-qa]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "deviceTier() computed once in boot(), before ANY THREE.WebGLRenderer/material is constructed, logged via document.documentElement.dataset.sceneTier for capture-time/SUMMARY inspection"
    - "Solid var(--surface) backing chip on floating DOM labels projected over unpredictable 3D/DOM backgrounds — same treatment as existing btn-cta/btn-secondary/convert-tile, not a new visual idiom"

key-files:
  created: []
  modified:
    - concept-c/assets/js/scene.js
    - concept-c/assets/css/concept-c.css

key-decisions:
  - "Standardized every :focus-visible outline in concept-c to 2px solid var(--fg) (was var(--flarepop) on the two CTA buttons) with a 2-3px offset — one consistent focus language across labels, topic index, buttons, and every sub-page/footer link, per the plan's explicit 'no color-based-only focus signal, consistent treatment' spec"
  - "Fixed a real (not capture-artifact) narrow-viewport bug found via capture review: the top-of-page camera framing projects the Problems label directly over the hero headline at widths <= ~390px, both rendering in white with no backing — reproduced at a realistic 390x844 mobile viewport, not just the capture rig's 390x900. Fixed with a solid var(--surface) chip on .topic-label rather than touching camera/curve math, since it robustly resolves legibility against any background (hero text, below-fold sections, or the 3D void) without risking new composition regressions elsewhere in the field"
  - "Low device tier drops antialias, forces DPR 1, uses a 3-step (not 4-step) gradient map, and disables cursor parallax outright — full tier is unchanged 04-01 behavior; tier is a single heuristic computed once in boot() and threaded through initScene(), never recomputed mid-session"

patterns-established:
  - "Reduced-motion CSS kill switch pattern: @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } } scoped to .concept-c and .subpage, as belt-and-braces alongside JS-level reduced-motion branching — reusable idiom for any future concept needing the same double gate"

requirements-completed: [CONC-04, CONC-05]

# Metrics
duration: 24min
completed: 2026-07-24
---

# Phase 4 Plan 3: Concept C Motion/A11y Polish + QA Sweep Summary

**Device-tiered three.js rendering (hardwareConcurrency-primary heuristic), a locked-spec frozen reduced-motion scene, one consistent focus-visible language across all of concept-c, and a full phase-closing QA sweep that caught and fixed a real white-on-white label/hero-copy collision at narrow viewports.**

## Performance

- **Duration:** 24 min
- **Started:** 2026-07-24T17:47:00Z
- **Completed:** 2026-07-24T18:11:01Z
- **Tasks:** 2 completed
- **Files modified:** 2 (`concept-c/assets/js/scene.js`, `concept-c/assets/css/concept-c.css`) + 18 new capture PNGs

## Accomplishments

- `deviceTier()` heuristic (hardwareConcurrency primary → deviceMemory Chromium-only bonus → narrow-viewport fallback, never gated on deviceMemory alone) computed before any renderer/material construction; low tier drops antialias, forces DPR 1, uses a 3-step gradient map, and disables cursor parallax entirely; tier logged via `dataset.sceneTier` for capture/SUMMARY inspection
- Static-scene (reduced-motion) mode confirmed already at the locked spec from 04-01 (dedicated overview keyframe, DPR 1 unconditional, no rAF/parallax/idle-rotation/scroll-listener registration) and hardened further: `orientationchange` now re-triggers the same one-shot render+relabel path as `resize`
- CSS-level `@media (prefers-reduced-motion: reduce)` kill switch added (belt-and-braces alongside the JS static-scene gate) forcing every animation/transition in concept-c + the subpage scaffold to complete instantly
- Every interactive element in concept-c now shares one `:focus-visible` language — 2px solid `var(--fg)`, 2-3px offset, no color-only signal: topic labels, topic index, topbar CTA, labs CTA, both page-header links (lockup + back), footer site links, and both insights episode link groups
- Full mechanical QA sweep run and passed: `copy-diff --all concept-c` (4 pages, 282 chunks, 0 failures), full 8-grep brand suite (gradient audit confirms the sole hit is the licensed `.field-backdrop` stepped utility), a scratchpad link-integrity script (62 href/src checked across 4 pages, 0 failures, all 6 waypoint ids exactly match the topic-index hrefs), and 18 captures reviewed (12 JS-off responsive + 6 JS-on scene states)
- Found and fixed a real narrow-viewport bug during capture review (see Deviations)

## Task Commits

Each task was committed atomically:

1. **Task 1: Frozen-scene refinement + focus-visible + device-tier degradation** - `c55b142` (feat)
2. **Task 2: Mechanical QA — copy gate, brand greps, link integrity, full capture sweep** - `a136018` (fix, includes the Task-2-discovered label/hero-copy collision fix + all 18 captures)

**Plan metadata:** committed alongside this SUMMARY.

## Files Created/Modified

- `concept-c/assets/js/scene.js` - `deviceTier()` heuristic; tier threaded through renderer construction (antialias/DPR), `makeStepGradientMap` step count, and parallax gating; tier logged via `dataset.sceneTier`; `orientationchange` listener added alongside `resize`
- `concept-c/assets/css/concept-c.css` - reduced-motion CSS kill switch; standardized `:focus-visible` outlines across all interactive elements; solid `var(--surface)` backing chip on `.topic-label`
- `.planning/phases/04-concept-c-experimental-webgl-3d/captures/*.png` (18 files) - reviewed QA captures: `{index,interceptos,work,insights}-{390,768,1440}.png` (JS-off, fullPage), `index-scene-{390,1440}.png`, `index-middolly-{390,1440}.png`, `index-nowebgl-1440.png`, `index-reduced-1440.png`

## Decisions Made

- Standardized every focus-visible outline to `var(--fg)` (previously `var(--flarepop)` on the two CTA buttons) for one consistent, non-color-exclusive focus language across the whole concept, per the plan's explicit spec
- Fixed the narrow-viewport label/hero-copy collision with a solid backing chip on `.topic-label` rather than adjusting camera/curve keyframes — a lower-risk, broadly-applicable fix that also improves legibility in the no-webgl/no-js constellation and reduced-motion overview, not just the collision case that surfaced it
- Device tier is computed once in `boot()` (not per-frame or per-resize) and threaded as a plain parameter into `initScene()` — matches the existing `animated` parameter pattern, no new state-management machinery needed

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Topic-label collided illegibly with hero copy at narrow viewports**
- **Found during:** Task 2, capture review step (`index-scene-390.png`)
- **Issue:** At the top-of-page camera framing, the Problems object (nearest to camera, first in the topic field) projects its label near screen-center on narrow/tall viewports, landing directly over the hero headline text. Both the label and the overlapping hero text render in `var(--fg)` (white) with no backing, so where they intersected neither was legible — confirmed reproducible at a realistic 390x844 mobile viewport (not just the capture rig's synthetic 390x900), so this was a genuine cross-viewport issue, not a capture-tooling artifact.
- **Fix:** Added a solid `background: var(--surface); border-radius: var(--r-s);` backing chip to `.topic-label` (same flat-surface treatment already used on `.btn-cta`/`.btn-secondary`/`.convert-tile` — no new visual idiom, no gradient, no border-line). This makes every label independently legible regardless of what renders behind it (hero copy, below-fold sections, or the 3D void), and also improves legibility of the no-webgl/no-js fixed constellation and the reduced-motion frozen overview.
- **Files modified:** `concept-c/assets/css/concept-c.css`
- **Verification:** Re-ran the full `copy-diff --all` + 8-grep brand suite (all clean, no new gradient/border/hex introduced), re-captured all 18 PNGs, visually confirmed the label now reads clearly as a distinct chip in every affected capture (`index-scene-390.png`, `index-reduced-1440.png`, `index-nowebgl-1440.png`, `index-middolly-*.png`)
- **Committed in:** `a136018` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Necessary correctness fix caught by the plan's own mandated capture-review step; no scope creep — same file already in scope for Task 1's focus-visible work, single small CSS addition.

## QA Results Table

| Check | Result |
|---|---|
| `copy-diff --all concept-c` | PASS — 4 pages, 282 chunks, 0 failures |
| Brand grep: banned tagline | clean |
| Brand grep: deprecated 12-path hexes | clean |
| Brand grep: `<hr>` | clean |
| Brand grep: border-top/bottom hairlines | clean |
| Brand grep: raw-hex colored text | clean |
| Brand grep: non-Flarepop colored text vars | clean |
| Brand grep: smooth/radial/conic gradients | clean — sole `gradient(` hit is `.field-backdrop`'s licensed `repeating-linear-gradient` stepped utility |
| Brand grep: `view-transition-name` | clean |
| Link integrity (scratchpad script) | PASS — 62 href/src checked across 4 pages (29 local-path, 13 anchor, 20 external well-formedness), 0 failures; all 6 runway waypoint ids exactly match topic-index hrefs |
| Captures | 18 reviewed (>= 16 required): 12 JS-off responsive (390/768/1440 x 4 pages) + `index-scene-390/1440`, `index-middolly-390/1440`, `index-nowebgl-1440`, `index-reduced-1440` |
| Device tier observed (test machine) | `full` (hardwareConcurrency > 4, no narrow-viewport fallback triggered at 1440) — low-tier code path verified by code review (antialias off, DPR 1, 3-step gradient map, parallax never registered), not by hardware fixture |
| Reduced-motion frozen-scene proof | Programmatic: `canvas.toDataURL()` byte-identical before/after `scrollTo(0,400)` + 1.2s settle in `index-reduced-1440` capture — confirms zero rAF/dolly work after first render |
| Functional: keyboard PageDown scroll | Native physics confirmed — `scrollY` moved 0 → 860px on a single PageDown at 1440x900, no scroll-jacking |
| Functional: deep-link `#t-work` | Lands at `t=0.40` exactly (Work's waypoint), topic-index `aria-current` correctly shows `work` |
| Functional: sub-page navigate + back | `scrollY` restored to the exact pre-navigation value (900px), `dataset.sceneReady` re-set to `1` promptly after back-navigation |
| Functional: tab order | CTA → 6 topic labels (DOM order) → topic index items — logical, no unexpected stops |
| Functional: focus retention while scrolling | A focused `topic-label[data-topic="labs"]` remained `document.activeElement` after a 600px `scrollTo` (never ejected to `<body>`) |

## Issues Encountered

None beyond the one deviation documented above (found and fixed within the plan's own QA step, not a blocker).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 5 phase requirements (CONC-01 through CONC-05) are now complete and verified for Concept C: the topic-field 3D nav, DOM-projected labels with hover/focus parity, native non-scroll-jacked camera dolly, a fully verified reduced-motion/no-webgl fallback pair, and device-tiered rendering with a cross-browser-safe heuristic.
- Concept C is ready for Phase 5's cross-concept QA sweep and gallery packaging alongside Concepts A and B.
- No blockers. The one bug found during this plan's own QA step was fixed and re-verified within the same plan, not carried forward.
- Scratchpad artifacts (`link-integrity.py`, `capture-04-03.js`, `functional-checks.js`) are session-local only and were not committed to the repo, per the established scratchpad-only convention for Puppeteer tooling.

## Self-Check: PASSED

- FOUND: concept-c/assets/js/scene.js
- FOUND: concept-c/assets/css/concept-c.css
- FOUND: .planning/phases/04-concept-c-experimental-webgl-3d/captures/ (18 PNG files)
- FOUND commit: c55b142 (Task 1)
- FOUND commit: a136018 (Task 2)

---
*Phase: 04-concept-c-experimental-webgl-3d*
*Completed: 2026-07-24*
