---
phase: 04-concept-c-experimental-webgl-3d
plan: 01
subsystem: ui
tags: [three.js, webgl2, canvas, scroll-driven-camera, meshtoonmaterial, dom-projection]

# Dependency graph
requires:
  - phase: 01-shared-foundation
    provides: shared/tokens.css, shared/motion.css, shared/logo/lockup.svg, content/homepage.json
provides:
  - concept-c/index.html — full homepage shell (topbar, scroll-runway, hero copy, 6 waypoints, label-field, topic-index, below-fold stubs)
  - concept-c/assets/css/concept-c.css — mode-gated layout (has-js/webgl/static-scene/no-webgl) + stepped-backdrop fallback
  - concept-c/assets/js/scene.js — WebGL2 probe, topic-field scene, scroll-driven camera dolly, DOM-projected labels, render-loop gating
affects: [04-02, 04-03]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "WebGL2 capability probe (throwaway canvas getContext) strictly before renderer construction, gating an explicit .no-webgl DOM-only path"
    - "Scroll-progress-driven CatmullRomCurve3 camera dolly + lookAt curve, both lerped toward target each frame — scrollY sampled as an absolute position, never a delta, zero wheel/touch listeners"
    - "Vector3.project(camera) per-frame DOM label projection with visibility:hidden (never display:none) for behind-camera labels"
    - "Render loop gated by the same scrollY read the camera needs (not IntersectionObserver, which is a no-op on a position:fixed full-viewport canvas)"
    - "MeshToonMaterial + NearestFilter DataTexture gradient map for hard-stepped (never smooth) toon shading"
    - "getComputedStyle().getPropertyValue() token->THREE.Color helper — zero raw hex/0x literals in scene.js"

key-files:
  created:
    - concept-c/assets/css/concept-c.css
    - concept-c/assets/js/scene.js
  modified:
    - concept-c/index.html

key-decisions:
  - "Static-scene (prefers-reduced-motion) renders a frozen real 3D overview rather than falling back to the flat .no-webgl backdrop, per the research's Open Question recommendation — reserves .no-webgl purely for genuine capability failures"
  - "Fixed a real matrixWorld-ordering bug (updateLabels() was projecting before the first-ever renderer.render() call, collapsing all 6 labels onto the same stale screen point) discovered via the static-scene capture, which exposed it because it never gets a second frame to self-correct"
  - "Static-scene overview camera reframed to a diagonal (not tunnel, not side) angle so the 40-unit Z-spread field doesn't converge all 6 projected labels onto the same point, while still preserving the prisms' triangular apex-up profile"
  - "Topic routing map: topics without a full sub-page (Problems/Labs/Contact) point straight at their below-fold section id; InterceptOS/Work/Insights point at not-yet-built 04-02/04-03 sub-page paths (expected 404s until those plans ship)"

requirements-completed: [CONC-01, CONC-02, CONC-03, CONC-04, CONC-05]

# Metrics
duration: 44min
completed: 2026-07-24
---

# Phase 4 Plan 1: Concept C topic-field scene + scroll dolly + DOM labels Summary

**Scroll-driven three.js "topic field" (6 procedural MeshToonMaterial objects, hard-stepped 4-tone shading) with a CatmullRomCurve3 camera dolly read purely from `scrollY`, six always-visible `Vector3.project()`-positioned DOM labels, and a complete `.no-webgl`/no-JS stepped-backdrop fallback — all built alongside, not retrofitted.**

## Performance

- **Duration:** 44 min
- **Started:** 2026-07-24T17:00:00Z (approx.)
- **Completed:** 2026-07-24T17:43:51Z
- **Tasks:** 3 completed
- **Files modified:** 3 (1 created CSS, 1 created JS, 1 modified HTML — across 4 commits including one in-flight bug fix)

## Accomplishments
- Full `index.html` shell: fixed topbar (inline lockup SVG + CTA), 400vh scroll-runway with hero copy + 6 scroll-progress waypoints, 6-label projected-nav constellation (locked routing map), mono topic index, 3 below-fold stub sections for 04-02
- `concept-c.css`: mode-gated layout driving 4 mutually-exclusive states (`has-js webgl`, `webgl static-scene`, `no-webgl`, no class at all) off one bootstrap decision tree, with the concept-a stepped-gradient recipe as the sole (non-repeating-linear) gradient in the file
- `scene.js`: WebGL2 probe → decision tree, 6 procedural objects (3 apex-up prisms + 3 box slabs/cubes) with a shared 4-step `NearestFilter` toon gradient map, `CatmullRomCurve3` camera + lookAt dolly lerped from `scrollY`, per-frame `Vector3.project()` label placement, one-at-a-time Flarepop hover/focus accent, topic-index `aria-current` sync, `scrollY`-gated render loop (not IntersectionObserver), DPR clamp, `powerPreference: 'low-power'`, cursor parallax gated on `(hover: hover) and (pointer: fine)` + non-reduced-motion
- Caught and fixed a real correctness bug via the Task 3 capture review (see Deviations)

## Task Commits

1. **Task 1: index.html shell + concept-c.css** — `509f0dc` (feat)
2. **Task 2: scene.js — probe, decision tree, topic field, scroll dolly, projected labels** — `4edb440` (feat)
3. **Task 3: Browser smoke + composition self-check captures** — `55c9663` (fix, folded into Task 3's own capture-driven bug fix; no separate no-op commit needed since the fix *is* Task 3's deliverable)

**Plan metadata:** (pending — this commit)

## Files Created/Modified
- `concept-c/index.html` — full shell replacing the Phase-4 placeholder: scene-mount + field-backdrop, topbar, scroll-runway (hero copy + 6 waypoints), label-field nav, topic-index nav, below-fold stubs, scene.js module script tag
- `concept-c/assets/css/concept-c.css` — new file, mode-gated CSS contract for 04-02/04-03 to build against
- `concept-c/assets/js/scene.js` — new file, the entire 3D scene + camera + label + gating implementation

## Decisions Made
- Reduced-motion renders a frozen real 3D scene (not the flat CSS backdrop) — keeps the actual "experimental WebGL/3D" concept visible to reduced-motion reviewers who have full WebGL2 capability, per the research's own recommendation
- Below-fold stub sections deliberately carry zero copy (04-02's scope) — only empty `<section id="...">` anchors, matching the plan's `files_modified` boundary for this plan

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Plan's own Task 1 verify grep over-counted `.topic-label` elements**
- **Found during:** Task 1 verification
- **Issue:** `grep -o 'class="topic-label' concept-c/index.html | wc -l` returns 18, not 6, because the pattern (no closing quote) also matches the child `topic-label__marker`/`topic-label__text` spans required by the same task's own action text — the verify command as literally written can never pass 6 while the required markup exists
- **Fix:** Confirmed correctness with an equivalent anchored check (`grep -oE 'class="topic-label"'` → exactly 6) before proceeding; markup itself needed no change
- **Files modified:** none (verification-only)
- **Verification:** `grep -oE 'class="topic-label"' concept-c/index.html | wc -l` → 6; `grep -oE 'class="topic-label__(marker|text)"'` → 12
- **Committed in:** 509f0dc (Task 1 commit; no code change needed)

**2. [Rule 1 - Bug] Own explanatory code comment tripped the raw-hex/0x brand grep**
- **Found during:** Task 2 verification
- **Issue:** A comment explaining *why* light color uses an `undefined` constructor arg literally contained the string `0xffffff`, matching the plan's own `(0x[0-9a-fA-F]{6}|'#|"#)` grep (line-based, doesn't distinguish comments from code)
- **Fix:** Reworded the comment to describe the technique without embedding a hex-shaped token
- **Files modified:** concept-c/assets/js/scene.js
- **Verification:** re-ran the full brand-grep suite — clean
- **Committed in:** 4edb440 (Task 2 commit)

**3. [Rule 1 - Bug] `updateLabels()` read matrixWorld before the first-ever render, collapsing all 6 labels onto one point**
- **Found during:** Task 3 (capture self-check, reduced-motion static-scene overview)
- **Issue:** Both `tick()` and the static one-shot branch called `updateLabels()` (which reads `mesh.matrixWorld` via `Vector3.project()`) *before* the first `renderer.render()` call, which is what actually populates matrixWorld from each mesh's local transform. On the very first frame, every mesh's matrixWorld was still at its default (identity) state, so all 6 labels projected to the identical (wrong) screen position. The animated path masked this because Puppeteer's `waitForFunction(sceneReady)` resolves after several rAF ticks have already elapsed by the time a screenshot is taken, so frame 2+ self-corrects using the *previous* frame's now-current matrices — but the static (non-looping) path only ever renders once, exposing the bug directly and unambiguously.
- **Fix:** Reordered `renderer.render(scene, camera)` before `updateLabels()` in `tick()`, the static one-shot block, and the static-only branch of `resize()`
- **Files modified:** concept-c/assets/js/scene.js
- **Verification:** re-captured the static overview — all 6 labels now report distinct `transform` values matching their objects' actual screen positions; re-ran the full Task 2 verify chain (parse + all 8 brand greps) — clean
- **Committed in:** 55c9663

**4. [Rule 1 - Bug] Static-scene overview camera converged all 6 labels visually even after the matrixWorld fix**
- **Found during:** Task 3 (same capture)
- **Issue:** The original static-overview camera looked nearly straight down the field's -Z "tunnel" axis; because the 6 objects are spread across only ±3.6 world units of X but 40 units of Z, far objects' small X-offsets shrink toward the vanishing point relative to the near object's — all 6 labels legibly distinct in data, but visually crowded within a small screen region
- **Fix:** Repositioned the static-only camera to a diagonal vantage (`(26, 6, 6)` looking at `(-2, 0.5, -20)`) — enough of a side-angle component to spread the Z-spread across screen width, while retaining enough of a forward (tunnel) component that the prisms' triangular apex-up profile doesn't flatten into a rectangle (which a pure 90°-side view would do, since the triangle lives in the local XY plane)
- **Files modified:** concept-c/assets/js/scene.js
- **Verification:** re-captured — all 6 topic labels now land at visibly distinct, monotonically-ordered screen positions; all 6 object silhouettes distinguishable (3 boxes, 3 apex-up prisms, none inverted)
- **Committed in:** 55c9663

---

**Total deviations:** 4 auto-fixed (2 plan/comment verification-script issues, 2 real scene.js bugs found via the mandated capture review)
**Impact on plan:** The two scene.js fixes are exactly what Task 3's capture-review step exists to catch ("this is the check that catches what greps cannot") — no scope creep, both fixes are within `scene.js`'s own `files_modified` for this plan.

## Issues Encountered
- Puppeteer/puppeteer-core was not yet installed anywhere reachable (scratchpad had no prior `node_modules`) — installed via `npm install puppeteer-core --no-save` inside the scratchpad directory only, per the established repo convention (never in the project's own `node_modules`)
- `GET /favicon.ico` returns 404 on every concept-c page load (confirmed via Puppeteer response listener) — logged to `.planning/phases/04-concept-c-experimental-webgl-3d/deferred-items.md` since no favicon exists anywhere in the repo (site-wide pre-existing gap, out of this plan's scope, not fixed)

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 5 phase requirements (CONC-01 through CONC-05) have their foundational implementation in place; 04-02 can now build the below-fold sections' real content directly into the 3 stub `<section>` ids, and 04-03 can build the 3 routed sub-pages (`interceptos.html`, `work.html`, `insights.html`) plus any further motion/a11y polish
- The `<interfaces>` contract from 04-01-PLAN.md (mode classes, element contracts, label routing map, `sceneReady` hook) is implemented exactly as specified — 04-02/04-03 can rely on it without re-deriving
- No blockers. Two scene.js correctness bugs were caught and fixed within this same plan (see Deviations) rather than carrying forward

## Self-Check: PASSED

- FOUND: concept-c/index.html
- FOUND: concept-c/assets/css/concept-c.css
- FOUND: concept-c/assets/js/scene.js
- FOUND commit: 509f0dc (Task 1)
- FOUND commit: 4edb440 (Task 2)
- FOUND commit: 55c9663 (Task 3)

---
*Phase: 04-concept-c-experimental-webgl-3d*
*Completed: 2026-07-24*
