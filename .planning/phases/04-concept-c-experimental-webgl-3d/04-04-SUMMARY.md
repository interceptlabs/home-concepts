---
phase: 04-concept-c-experimental-webgl-3d
plan: 04
subsystem: webgl-3d
tags: [threejs, catmullrom, camera-framing, qa-gate, headless-testing]

# Dependency graph
requires:
  - phase: 04-concept-c-experimental-webgl-3d (04-01, 04-02, 04-03)
    provides: the 6-object topic field, scroll-driven dolly scaffold, device tiering, reduced-motion static overview, and mechanical QA suite (copy-diff, brand greps, module-parse gate) this plan builds on and re-verifies
provides:
  - "buildDollyRig(): a pure, headlessly-importable function deriving the scroll dolly's camera path FROM the object field (bounding-sphere radius + per-topic standoff multiplier), replacing the hand-tuned 8-point camera curve"
  - "qa/camera-framing-check.mjs: a permanent headless math gate (waypoint + 101-sample continuous-sweep invariants) importing the SAME derivation the scene runs"
  - "11 settle2-* captures proving all 6 topic waypoints and 3 transit zones frame legibly post-fix"
affects: [phase-05-verification, phase-05-gallery-packaging]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Derive animation curves from domain data (object positions + geometry-derived radii) rather than hand-authored control points, so the two curves a scroll-driven camera needs (position + look-at) are structurally identical and can never desync"
    - "Ship a headless math gate (qa/*.mjs) that imports the exact production function under test — never a reimplementation — as a permanent regression guard for a class of bug (camera/curve desync) that visual review alone missed twice"

key-files:
  created:
    - qa/camera-framing-check.mjs
  modified:
    - concept-c/assets/js/scene.js

key-decisions:
  - "Switched both CatmullRomCurve3 curves from 'catmullrom'/tension-0.5 to 'centripetal' (kept identically typed) — the tension-based type overshot enough between the InterceptOS and Work keyframes to graze InterceptOS's own bounding sphere mid-transit"
  - "Tuned the offset-direction mix to a forward-weighted (x:y:z = 0.6:0.45:2.0) unit vector rather than the plan's more-lateral starting recipe (1.0:0.45:1.5) — the more lateral mix let the mid-transit path swing close enough to InterceptOS's bounding sphere to fail the sweep's no-intrusion invariant and separately missed the look-angle floor near t=0.87 (Insights-to-Contact transit); the forward-weighted mix clears both invariants with margin (worst clearance 1.212x, worst look-angle 23.09deg)"
  - "Per-topic standoff multipliers: Problems 3.8x, InterceptOS 3.2x, Work 3.4x, Labs 3.6x, Insights 3.0x, Contact 2.9x — all within the plan's 2.8-3.8x guidance band and above the 2.5x hard floor; Problems/Contact anchors kept per 04-VERIFICATION.md's already-good framing"

requirements-completed: [CONC-01, CONC-03]

# Metrics
duration: 26min
completed: 2026-07-24
---

# Phase 4 Plan 4: Camera-Framing Gap Closure Summary

**Replaced the hand-tuned 8-point camera curve with a `buildDollyRig()` derivation from the object field's own positions and bounding-sphere radii, closing the desync between the camera path and look-at path that put the scroll dolly's camera inside (Work) or grazing (Labs) the very objects it was supposed to frame, and left ~40-50% of the scroll journey with an empty frame.**

## Performance

- **Duration:** 26 min
- **Started:** 2026-07-24T18:33:00Z (approx.)
- **Completed:** 2026-07-24T18:45:49Z
- **Tasks:** 3 completed
- **Files modified:** 2 code files + 11 new capture images

## Accomplishments

- `buildDollyRig()` exported from `concept-c/assets/js/scene.js`: for each of the 6 topics, constructs the object's real geometry, calls `computeBoundingSphere()`, and places the camera at `standoff * radius` along a diagonal offset from the object — camera position and look target are now a single derivation, never two independently-authored curves
- Both curves sampled with `getPoint(t)` (uniform per-segment) instead of the old `getPointAt(t)` (arc-length reparametrized) — this alone fixes the "don't land on control points at t=i/5" bug the two curve shapes previously had
- New permanent headless gate `qa/camera-framing-check.mjs` — imports `buildDollyRig` directly (never a reimplementation) and checks both point-invariants (exact keyframe hits, >=2.5x standoff, <1deg look error) and a 101-sample continuous-sweep (no bounding-sphere intrusion at 1.15x margin, always >=1 object within 30deg of the look direction)
- 11 settle2-* captures re-run against the fixed scene with the same 2.8s-settle methodology 04-VERIFICATION.md used, all read and judged legible

## Task Commits

Each task was committed atomically:

1. **Task 1: Derive the dolly from the object field** - `5deee74` (fix)
2. **Task 2: Permanent headless camera-framing math gate** - `899bf2e` (feat) — includes the centripetal/offset-mix tuning discovered while building the gate
3. **Task 3: Settle-methodology re-capture + full regression suite** - `696882b` (fix)

**Plan metadata:** (this commit)

## Framing Gate — Waypoint Table

| Topic | t | Distance | Radius | Multiplier | Look-angle |
|---|---|---|---|---|---|
| Problems | 0.00 | 6.760 | 1.779 | 3.800x | 0.0000deg |
| InterceptOS | 0.20 | 6.659 | 2.081 | 3.200x | 0.0000deg |
| Work | 0.40 | 6.183 | 1.819 | 3.400x | 0.0000deg |
| Labs | 0.60 | 3.676 | 1.021 | 3.600x | 0.0000deg |
| Insights | 0.80 | 5.883 | 1.961 | 3.000x | 0.0000deg |
| Contact | 1.00 | 4.594 | 1.584 | 2.900x | 0.0000deg |

**Worst continuous-sweep sample:** clearance 1.212x radius at t=0.92 (Insights, distance=2.376, radius=1.961) — comfortably above the 1.15x no-intrusion floor.
**Worst look-angle sample:** 23.09deg at t=0.87 (Insights-to-Contact transit) — comfortably under the 30deg "meaningfully in frame" threshold.

Radii cross-check against 04-VERIFICATION.md's ground truth: Problems 1.78, InterceptOS 2.08, Work 1.82 (the prior camera-inside-mesh waypoint — camera now sits 6.183 units away, 3.4x its radius), Labs 1.02 (the prior grazing waypoint — now 3.676 units away, 3.6x its radius), Insights 1.96, Contact 1.58. All match to 3 decimal places, confirming `computeBoundingSphere()` reproduces the verifier's independently-measured values.

## Capture-Review Verdicts (11 settle2-* captures, all read and judged)

- **settle2-problems.png** (t=0): Box fully in frame, clean silhouette, "PROBLEMS" label visible. Clear pass (unchanged from the already-good prior framing).
- **settle2-interceptos.png** (t=0.2, prior "tight/cropped" waypoint): Full apex-up prism silhouette visible, not clipped, "INTERCEPTOS" label legible. Fixed.
- **settle2-work.png** (t=0.4, prior camera-inside-mesh failure): Cube fully in frame with two distinct shaded faces and edges visible — camera is clearly outside the mesh now, "WORK" label legible. Fixed — the plan's harshest test case passes.
- **settle2-labs.png** (t=0.6, prior grazing failure): Full apex-up prism silhouette, clean edges, "LABS" label legible. Fixed.
- **settle2-insights.png** (t=0.8): Long slab fully in frame, "INSIGHTS" label legible. Clear pass.
- **settle2-contact.png** (t=1.0): Full prism silhouette, "CONTACT" label legible. Clear pass (unchanged from the already-good prior framing).
- **settle2-mid-010.png** (t=0.1): InterceptOS prism recognizable and meaningfully in frame mid-transit.
- **settle2-mid-045.png** (t=0.45, the original empty-frame reproduction point): No longer empty — a large recognizable surface (the Work object, viewed close, with a visible corner edge and two distinct shaded faces) fills the frame, topic index correctly highlights WORK. This is a close, cropped view (transit framing is not held to the same "fully framed" standard as waypoints) but it is unambiguously NOT the original bug's signature (bare topbar + topic index over empty background).
- **settle2-mid-080.png** (t=0.8, coincides with the Insights waypoint): Identical to settle2-insights.png — fully framed, legible.
- **settle2-reduced-1440.png**: Frozen real 3D overview, all 6 objects + labels visible, unchanged in character from prior verified captures (this static path is untouched by the dolly fix, as required).
- **settle2-top-390.png**: The 04-03 surface-chip fix still holds with the new t=0 camera keyframe — the "PROBLEMS" label renders as a legible, opaque dark chip layered over the hero headline, no white-on-white collision.

## Files Created/Modified

- `concept-c/assets/js/scene.js` - Deleted `CAMERA_PATH_POINTS`; added `standoff` field to each `OBJECT_DEFS` entry; added exported `buildDollyRig()`; `initScene`'s animated path now consumes it via `getPoint(t)` on two structurally-identical `centripetal` `CatmullRomCurve3` curves
- `qa/camera-framing-check.mjs` - New permanent headless gate: waypoint invariants (A1-A3) + 101-sample continuous-sweep invariants (B1-B2), fixed thresholds taken from 04-VERIFICATION.md
- `.planning/phases/04-concept-c-experimental-webgl-3d/captures/settle2-*.png` (11 files) - Re-capture evidence

## Decisions Made

See `key-decisions` in frontmatter: centripetal curve type, forward-weighted offset-direction mix (0.6:0.45:2.0), and per-topic standoff multipliers (2.9x-3.8x).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Plan's starting offset-direction recipe failed the continuous-sweep gate; retuned within the plan's own stated discretion**
- **Found during:** Task 2 (building qa/camera-framing-check.mjs against the just-built Task 1 rig)
- **Issue:** The plan's suggested starting recipe (`offsetDir = normalize([sideSign*1.0, 0.45, 1.5])` with `catmullrom`/tension-0.5 curves) failed two sweep invariants: camera clearance dipped to ~0.99x-1.14x InterceptOS's bounding radius between the InterceptOS and Work keyframes (below the 1.15x floor), and the look-angle floor was missed by ~1.25deg at t=0.87 (Insights-to-Contact transit)
- **Fix:** Followed the plan's own explicit contingency ("if the continuous-sweep gate catches catmullrom-0.5 overshoot... switch BOTH curves to 'centripetal'") and additionally retuned the offset-direction mix to be more forward-weighted (0.6:0.45:2.0) after empirically testing ~15 combinations against the gate — this fixed both the clearance and the look-angle failures simultaneously
- **Files modified:** concept-c/assets/js/scene.js
- **Verification:** `node qa/camera-framing-check.mjs` passes with margin (worst clearance 1.212x, worst look-angle 23.09deg)
- **Committed in:** 899bf2e (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug, explicitly anticipated and pre-authorized by the plan's own contingency language).
**Impact on plan:** No scope creep — the retuning stayed entirely within the plan's stated standoff range (2.8x-3.8x) and offset-direction constraints (positive z, non-zero x, small positive y).

## Issues Encountered

None beyond the tuning iteration documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The gap's failed truth is now verified: `qa/camera-framing-check.mjs` exits 0, all 11 settle2-* captures read and pass judgment, and the full mechanical regression suite (copy-diff 282/282, all 8 brand greps, headless module-parse gate) is green.
- CONC-01 and CONC-03 move from PARTIAL to SATISFIED; Phase 4 (Concept C) has no remaining open gaps.
- Ready for Phase 5 (cross-concept QA + gallery packaging) — this plan adds a new permanent gate (`qa/camera-framing-check.mjs`) that future phases should keep running if concept-c's scene.js is ever touched again.

---
*Phase: 04-concept-c-experimental-webgl-3d*
*Completed: 2026-07-24*

## Self-Check: PASSED

- FOUND: concept-c/assets/js/scene.js
- FOUND: qa/camera-framing-check.mjs
- FOUND: .planning/phases/04-concept-c-experimental-webgl-3d/captures/settle2-work.png
- FOUND commit: 5deee74 (Task 1)
- FOUND commit: 899bf2e (Task 2)
- FOUND commit: 696882b (Task 3)
