---
phase: 04-concept-c-experimental-webgl-3d
verified: 2026-07-24T18:52:15Z
status: passed
score: 5/5 must-haves verified
re_verification:
  previous_status: gaps_found
  previous_score: 4/5
  gaps_closed:
    - "Scrolling the runway dollies the camera through the field such that each topic's waypoint frames its 3D object legibly, and the transitions between waypoints never present empty/unrecognizable frames"
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Scroll continuously (not via anchor jump) from top to bottom of the concept-c homepage runway on a real trackpad/mouse wheel, watching the whole transit"
    expected: "A continuously legible 'flight through a field of objects' feel — objects should grow, recede, and hand off to each other without ever going fully blank or clipping through geometry"
    why_human: "Automated capture + the new headless math gate confirm every waypoint and 101 sampled transit points are legible/non-empty; a full continuous-scroll pass is still best judged by a human for overall pacing/feel, since 'feel' during continuous motion is not fully captured by discrete-sample review"
  - test: "On an actual low-tier / integrated-GPU or older mobile device, load /concept-c/ and confirm the scene neither stalls nor renders blank"
    expected: "deviceTier() code path (antialias off, DPR 1, 3-step gradient map, no parallax) runs smoothly"
    why_human: "SUMMARY and this verification confirm the tiering logic by code review only — no real low-tier hardware fixture was available to this session, the original implementation, or the 04-04 gap-closure session"
---

# Phase 4: Concept C — Experimental WebGL/3D Verification Report

**Phase Goal:** A visitor navigates a 3D-space homepage that uses WebGL as the reveal/navigation metaphor while remaining fully usable through standard web conventions, with or without WebGL.
**Verified:** 2026-07-24T18:52:15Z
**Status:** passed
**Re-verification:** Yes — after gap closure (plan 04-04)

## Re-verification After 04-04

**Gap under test:** the single Phase 4 gap from the initial verification — the scroll-driven camera's dolly path (8 hand-tuned camera points vs. a separately-shaped 6-point look-at curve) put the camera at/inside the Work object's bounding sphere (1.70 vs radius 1.82), grazing Labs (1.37 vs 1.02), and left the look direction 79.5-131 degrees off every object at mid-transit (t≈0.45) — an empty frame across ~40-50% of the scroll journey.

**Fix verified in this session:** 04-04 replaced the two independently-authored curves with `buildDollyRig()` — a pure function that derives both a `cameraPosCurve` and `lookTargetCurve` from the object field's own positions and `computeBoundingSphere()`-measured radii, sampled with `getPoint(t)` (uniform per-segment) instead of `getPointAt(t)` (arc-length reparametrized), so the two curves can no longer desync.

### 1. Headless math gate

```
node qa/camera-framing-check.mjs
```
Exit code 0. Output re-run independently in this session, values match 04-04-SUMMARY.md exactly:

| Waypoint | t | Distance | Radius | Multiplier | Look-angle |
|---|---|---|---|---|---|
| Problems | 0.00 | 6.760 | 1.779 | 3.800x | 0.0000deg |
| InterceptOS | 0.20 | 6.659 | 2.081 | 3.200x | 0.0000deg |
| Work | 0.40 | 6.183 | 1.819 | 3.400x | 0.0000deg |
| Labs | 0.60 | 3.676 | 1.021 | 3.600x | 0.0000deg |
| Insights | 0.80 | 5.883 | 1.961 | 3.000x | 0.0000deg |
| Contact | 1.00 | 4.594 | 1.584 | 2.900x | 0.0000deg |

Worst 101-sample continuous-sweep clearance: 1.212x radius at t=0.92 (comfortably above the 1.15x no-intrusion floor). Worst look-angle: 23.09deg at t=0.87 (comfortably under the 30deg "meaningfully in frame" threshold). Both directly gate the three failure modes the initial verification measured (1.70 vs 1.82 at Work, 1.37 vs 1.02 at Labs, 79.5deg off everything at t=0.45) and both pass with margin.

### 2. Capture review — read 8 of 11 settle2-* captures directly (all 6 waypoints + 2 intermediate transits + reduced-motion + 390px mode)

- **settle2-problems.png** (t=0): Tower fully in frame, clean silhouette, "PROBLEMS" label legible. Unchanged from the already-good prior framing.
- **settle2-interceptos.png** (t=0.2, prior "tight/cropped" waypoint): Full apex-up prism visible, not clipped by viewport edges, "INTERCEPTOS" label legible, topic index correctly highlights INTERCEPTOS. **Fixed.**
- **settle2-work.png** (t=0.4, prior camera-inside-mesh failure): Large cube fully in frame with two distinct shaded faces, clean straight edges, camera unambiguously outside the mesh, "WORK" label legible. **Fixed — the harshest prior failure now passes clean.**
- **settle2-labs.png** (t=0.6, prior grazing failure): Full apex-up prism silhouette, clean edges top-to-bottom, "LABS" label legible, topic index highlights LABS. **Fixed.**
- **settle2-insights.png** (t=0.8): Long slab fully in frame, "INSIGHTS" label legible. Clear pass.
- **settle2-contact.png** (t=1.0): Full prism silhouette, "CONTACT" label legible. Unchanged from the already-good prior framing.
- **settle2-mid-010.png** (t=0.1, transit): InterceptOS prism clearly recognizable and well inside frame, topic index correctly highlights INTERCEPTOS. Not empty.
- **settle2-mid-045.png** (t=0.45, the original empty-frame reproduction point): No longer empty. A large recognizable surface (the Work object, viewed close, with a visible corner edge and two distinct shaded faces) fills a large portion of frame; topic index correctly highlights WORK. This is a close, cropped transit view (not held to the "fully framed" waypoint standard) but is unambiguously **not** the original bug's signature (bare topbar + topic index floating over empty background) — confirmed directly against the original `index-middolly-1440.png` capture on file.
- **settle2-reduced-1440.png**: Frozen real 3D overview — all 6 objects (tower, prism, cube, small prism, slab, prism) plus all 6 labels visible simultaneously, unchanged in character from the prior verified capture. Confirms the static/reduced-motion path is untouched by the dolly-curve fix, as required.
- **settle2-top-390.png**: At 390x844, the "PROBLEMS" chip renders as a legible, opaque dark label over the hero headline text with no white-on-white collision — the 04-03 surface-chip fix still holds with the new t=0 camera keyframe.

(settle2-mid-080.png not independently re-read this session — 04-04-SUMMARY.md documents it as coincident with the t=0.8 Insights waypoint, which this session did independently verify as clean.)

**Verdict:** all read captures pass judgment. The two worst prior failures (Work, Labs) and the original empty-frame reproduction point (t=0.45) are each independently confirmed fixed by direct image review, not just by the math gate.

### 3. Regression spot-checks (fix touched only scene.js + qa/)

| Check | Result |
|---|---|
| `node --input-type=module -e "import('./concept-c/assets/js/scene.js')..."` (module-parse gate) | PASS — imports cleanly, no side effects thrown |
| `python3 qa/copy-diff.py --all concept-c` | PASS — 4 pages, **282/282** chunks, 0 failures |
| 8-grep brand suite (fresh-thinking tagline, deprecated pixelated-logo hex, `<hr`, border-top/bottom rules, raw hex `color:`, non-canonical `var(--...)` colors, any `linear/radial/conic-gradient`, `view-transition-name`) | PASS — all 8 greps return zero matches across `concept-c/` (vendor excluded) |
| `grep -n "wheel\|touchmove\|preventDefault\|Raycaster"` in scene.js | 0 matches — scroll-jacking still absent |
| `grep -n "CAMERA_PATH_POINTS\|getPointAt"` in scene.js | 0 matches — confirms the old broken curve pair and arc-length sampling are fully removed |
| `?nowebgl=1` fallback (independent live capture, this session, real Chrome via Puppeteer) | PASS — `documentElement.className` = `has-js no-webgl`, 6 `.topic-label` elements present, zero canvas, stepped backdrop renders correctly (screenshot reviewed) |
| Reduced-motion mode (settle2-reduced-1440.png) | PASS — frozen overview unchanged in character |

No regressions found. The single 404 observed during the independent `?nowebgl=1` re-capture was `favicon.ico` (unrelated static-asset noise, not a scene.js or page-load defect).

### Conclusion

The gap is closed. `CONC-01` and `CONC-03` move from PARTIAL to SATISFIED. All prior VERIFIED/SATISFIED items in the initial verification were re-checked (or are unaffected by a scene.js/qa-only diff) and show no regression. Phase 4 status flips to **passed**.

---

## Priority Check Resolution (from initial verification — retained for history)

The suspected framing bug (`captures/index-middolly-1440.png` showing an empty viewport at ~45% scroll, only topbar + topic index visible, WORK highlighted) is a **real bug**, not a capture-timing artifact.

Method used: started the existing `:4340` static server, drove real installed Google Chrome via Puppeteer (`executablePath` = bundled Chrome, `page.setViewport`), navigated to each of the 6 `#t-*` waypoints, waited 2.8s (comfortably past the `smoothPos.lerp(target, 0.08)` convergence point — at 60fps, 90 frames at that lerp factor leaves <0.1% residual error), then screenshotted each (`captures/settle-problems.png`, `settle-interceptos.png`, `settle-work.png`, `settle-labs.png`, `settle-insights.png`, `settle-contact.png`).

Cross-checked against the exact `CatmullRomCurve3` math (computed with the actual vendored `three.module.js`, not a hand approximation):

| Waypoint (t) | Topic | camera→object distance | object bounding radius | Result |
|---|---|---|---|---|
| 0 | Problems | 6.83 | 1.78 | Clear, legible framing (screenshot confirms) |
| 0.2 | InterceptOS | 3.44 | 2.08 | Tight — object fills most of frame, edges cropped |
| 0.4 | Work | **1.70** | **1.82** | **Camera at/inside the object's bounding volume** — extreme unrecognizable close-up |
| 0.6 | Labs | **1.37** | **1.02** | **Camera grazing the object surface** — extreme unrecognizable close-up |
| 0.8 | Insights | 2.70 | 1.96 | Close but recognizable |
| 1.0 | Contact | 4.59 | 1.58 | Clear, legible framing (screenshot confirms) |

At the mid-transit point t=0.45 (the original suspect capture), the camera sits 1.96 units from the Work object but the look-curve (independently parametrized through the 6 object positions) points the camera 79.5 degrees away from Work and 45-131 degrees away from every other object — nothing is within the ~35-40 degree half-FOV, producing the observed empty frame. This reproduces exactly with a fresh capture and a much longer settle window, ruling out capture timing.

**Verdict at the time: real gap** (now closed by 04-04 — see Re-verification section above).

## Goal Achievement

### Observable Truths (Roadmap Success Criteria)

| # | Truth | Status | Evidence |
|---|---|---|---|
| 1 | Hero/nav zone renders a three.js 3D scene as the spatial nav metaphor; below-fold is standard performant DOM | VERIFIED | Scene renders (6 toon-stepped objects, hard steps confirmed at all 6 settle2 waypoint captures); below-fold sections are opaque DOM (verified in CSS) and copy-diff passes. The "spatial navigation metaphor" is now legible across all 6 waypoints and the sampled transit zones — closed via 04-04. |
| 2 | Clickable 3D objects/hotspots show visible hover AND keyboard-focus labels; activating (mouse/keyboard/touch) routes to derived sub-page | VERIFIED | 6 real `<a class="topic-label">` elements, `min-width/min-height:44px`, `:focus-visible` confirmed in CSS; `setAccent`/`clearAccent` fire on hover and focus; link-integrity re-confirmed. Unaffected by the 04-04 camera fix (touched only camera curves, not label DOM/routing). |
| 3 | Scrolling drives camera/scene movement; native scroll physics, back button, deep links all continue to work — no scroll-jacking | VERIFIED | `grep` confirms zero `wheel`/`touchmove`/`preventDefault`/`Raycaster` registrations (re-confirmed post-fix); camera is a pure function of `window.scrollY`; all 6 waypoint anchors land at their exact `t` values with the new `getPoint(t)` sampling (uniform per-segment — lands exactly on keyframes at t=i/5, an improvement over the old arc-length `getPointAt`). The *result* of that movement (framing legibility) is now verified via the headless math gate + 8 independently-read captures. |
| 4 | Semantic DOM mirror is keyboard-navigable/screen-reader readable, shown outright when WebGL unavailable or reduced-motion is set | VERIFIED | `?nowebgl=1` independently re-captured this session (real Chrome via Puppeteer): `no-webgl` class applied, 6 labels present, zero canvas, stepped backdrop renders. Reduced-motion (`settle2-reduced-1440.png`) shows a frozen 3D overview with all 6 objects + labels legible, unchanged from the prior verified capture — confirms the static path is untouched by the dolly-curve fix. |
| 5 | On lower-tier hardware, the scene runs at a clamped/degraded quality tier instead of stalling, crashing, or rendering blank | VERIFIED (code review only) | `deviceTier()` logic untouched by 04-04 (fix was scoped to camera curves only). No real low-tier hardware fixture available — flagged for human verification (unchanged from initial verification). |

**Score:** 5/5 truths fully verified (1 remains code-review-only pending real low-tier hardware, flagged for human verification — this does not block phase-passed status per the initial verification's own scoring, which treated code-review-verified items as VERIFIED)

### Required Artifacts

| Artifact | Expected | Status | Details |
|---|---|---|---|
| `concept-c/index.html` | Full shell: mount, backdrop, topbar, runway, 6 waypoints, label-field, topic-index, filled below-fold sections, footer | VERIFIED | Unchanged by 04-04; 282-chunk copy-diff re-confirmed passing |
| `concept-c/assets/css/concept-c.css` | Mode-gated layout, stepped backdrop, focus-visible, reduced-motion overrides | VERIFIED | Unchanged by 04-04 |
| `concept-c/assets/js/scene.js` | WebGL2 probe, 6 objects, derived dolly rig, projected labels, device tiering, render-loop gating | VERIFIED | `CAMERA_PATH_POINTS` and `getPointAt` fully removed (grep-confirmed); `buildDollyRig()` exported and headless-importable; `computeBoundingSphere` present; module-parse gate passes; zero wheel/touch/preventDefault/Raycaster; the camera/lookAt curve pair now passes the headless math gate and 8 independently-read captures — **the prior composition gap is closed** |
| `qa/camera-framing-check.mjs` | Permanent headless math gate importing the real `buildDollyRig()` | VERIFIED | Exists, imports `buildDollyRig` (not a reimplementation, grep-confirmed), exits 0 on independent re-run this session with results matching 04-04-SUMMARY.md to 3 decimal places |
| `concept-c/pages/interceptos.html` | Full InterceptOS sub-page (4 flows × 4 stages + 13-agent roster) | VERIFIED | Unchanged by 04-04 |
| `concept-c/pages/work.html` | Consolidated 3-case work sub-page | VERIFIED | Unchanged by 04-04 |
| `concept-c/pages/insights.html` | New layout-only 3-episode index with real external links | VERIFIED | Unchanged by 04-04 |
| `.planning/phases/04.../captures/` | ≥16 reviewed QA captures | VERIFIED (+11 new) | 18 captures from 04-03 + 6 from initial verification + 11 new `settle2-*.png` captures added by 04-04, 8 independently re-read in this re-verification |

### Key Link Verification

| From | To | Via | Status | Details |
|---|---|---|---|---|
| `scene.js` rAF tick | camera position | `window.scrollY` → `buildDollyRig()`'s `cameraPosCurve`/`lookTargetCurve` → `getPoint(t)` → lerp | WIRED | Curve read is a pure function of scrollY; both curves are structurally identical (same 6 points, same construction args), sampled with uniform `getPoint(t)` — the composition-level gap (bad framing at 3/6 waypoints + mid-transit) is closed and gated by `qa/camera-framing-check.mjs` |
| `scene.js updateLabels` | `.topic-label` DOM elements | `Vector3.project(camera)` → `style.transform translate3d` | WIRED | Unaffected by 04-04; re-confirmed via settle2 captures showing correctly positioned labels at every waypoint |
| `index.html` bootstrap | `scene.js` init | WebGL2 probe gate | WIRED | Independently re-captured this session: `?nowebgl=1` forces `.no-webgl`, zero canvas |
| `scene.js` materials | `shared/tokens.css` | `getComputedStyle().getPropertyValue` | WIRED | Zero raw hex/0x literals (grep re-confirmed clean) |
| `a.topic-label[data-topic]` hrefs | sub-pages / anchors | locked routing map | WIRED | Unaffected by 04-04 (fix touched only camera curves) |
| `concept-c.css` | cross-document View Transitions | `@view-transition { navigation: auto }` | WIRED | Unaffected by 04-04; grep re-confirmed clean |
| `qa/camera-framing-check.mjs` | `concept-c/assets/js/scene.js` | imports the SAME exported `buildDollyRig` (never a reimplementation) | WIRED | Grep-confirmed import statement; gate re-run independently this session, exits 0 |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|---|---|---|---|---|
| CONC-01 | 04-01, 04-02, 04-04 | 3D as spatial nav metaphor in hero zone; below-fold standard DOM | SATISFIED | Camera-framing gap closed; below-fold/DOM split fully verified |
| CONC-02 | 04-01, 04-02 | Clickable hotspots, hover+focus labels, routes to sub-pages | SATISFIED | Unaffected by 04-04, re-confirmed |
| CONC-03 | 04-01, 04-04 | Scroll drives camera, no scroll-jacking, back/deep-links work | SATISFIED | Mechanism and resulting camera movement (framing legibility) both fully verified now |
| CONC-04 | 04-01, 04-03 | Semantic DOM mirror; shown when WebGL unavailable/reduced-motion | SATISFIED | no-webgl and reduced-motion independently re-verified this session |
| CONC-05 | 04-01, 04-03 | Device-tiered rendering, no stall/crash/blank on lower tier | SATISFIED (code review) | Tiering logic untouched by 04-04; no real low-tier hardware fixture available (flagged for human verification) |

No orphaned requirements — REQUIREMENTS.md's Phase 4 list (CONC-01 through CONC-05) matches exactly what the four plans (04-01, 04-02, 04-03, 04-04) collectively declare.

### Anti-Patterns Found

None. The prior blocker (`CAMERA_PATH_POINTS` control points too close to/inside object positions, scene.js lines 90-99) is resolved — those lines are deleted and replaced by the derived `buildDollyRig()`. No TODO/FIXME/placeholder comments, no empty stub implementations, no console.log-only handlers found anywhere in concept-c.

### Human Verification Required

See `human_verification` in the frontmatter — a full continuous-scroll pass for pacing/feel (mechanically confirmed non-empty/legible at 101 sampled points, but continuous "feel" is a human judgment), and real low-tier hardware confirmation of the device-tier code path (unchanged scope from initial verification).

### Gaps Summary

No open gaps. The one defect identified in the initial verification — the scroll-driven camera's dolly path used two independently-shaped `CatmullRomCurve3` curves that could desync, putting the camera inside (Work) or grazing (Labs) the objects it was supposed to frame and leaving ~40-50% of the scroll journey with an illegible or empty frame — was closed by plan 04-04's `buildDollyRig()` derivation (camera position and look target computed together from the same object positions/bounding radii, sampled with matching `getPoint(t)` calls). The fix is verified three ways in this re-verification: (1) an independent re-run of the new permanent headless gate `qa/camera-framing-check.mjs`, which exits 0 with the worst-case sweep clearance (1.212x) and worst-case look-angle (23.09deg) both comfortably inside their thresholds; (2) direct review of 8 of the 11 new settle2-* captures, including the two prior worst-offender waypoints (Work, Labs) and the exact original empty-frame reproduction point (t=0.45), all judged legible/non-empty; (3) a full regression spot-check confirming copy-diff (282/282), the 8-grep brand suite, the module-parse gate, and both fallback modes (`?nowebgl=1`, reduced-motion) are all unaffected by the scene.js-and-qa-only diff. Phase 4 (Concept C) has no remaining open gaps; the two items still flagged for human verification (continuous-scroll feel, real low-tier hardware) are unchanged in scope from the initial verification and do not block phase-passed status.

---

*Verified: 2026-07-24T18:52:15Z*
*Verifier: Claude (gsd-verifier)*
