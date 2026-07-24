---
phase: 04-concept-c-experimental-webgl-3d
verified: 2026-07-24T18:35:00Z
status: gaps_found
score: 4/5 must-haves verified
gaps:
  - truth: "Scrolling the runway dollies the camera through the field such that each topic's waypoint frames its 3D object legibly, and the transitions between waypoints never present empty/unrecognizable frames"
    status: failed
    reason: >
      Confirmed as a real, deterministic composition bug (not a capture-timing
      artifact) via real-Chrome Puppeteer capture at all 6 locked waypoints
      with a 2.8s settle (well past the 0.08-factor damped lerp's convergence
      window) plus exact CatmullRomCurve3 math computed with the actual
      vendored three.js. At t=0 (Problems) and t=1.0 (Contact) framing is
      clean and legible. At t=0.2 (InterceptOS), t=0.4 (Work), and t=0.6
      (Labs) the camera is positioned at or inside the object's own bounding
      radius (Work: camera-to-object distance 1.70 vs bounding radius 1.82 —
      the camera is effectively touching/inside the mesh), producing an
      extreme, unrecognizable close-up of a single flat face filling almost
      the entire viewport instead of a legible view of the object. Between
      waypoints (confirmed at t=0.45, the original suspect capture
      `index-middolly-1440.png`), the independently-shaped camera-path curve
      (8 control points) and look-at curve (6 control points, one per object)
      desynchronize: the camera sits ~1.96 units from the Work object but its
      look direction is 79.5 degrees off that object's actual bearing (and
      45-131 degrees off every other object), so literally nothing is in the
      ~35-40 degree half-FOV — the frame shows only the fixed topbar and
      topic index over pure background, exactly as the original capture
      showed. Because scrollY continuously drives t across the whole 400vh
      runway, any normal scroll (not just anchor-jumps) passes through these
      broken zones, affecting roughly 40-50% of the total scroll journey.
      This undermines the core "topic field spatial navigation metaphor"
      deliverable, not just a polish/cosmetic issue.
    artifacts:
      - path: "concept-c/assets/js/scene.js"
        issue: "CAMERA_PATH_POINTS (lines 90-99) does not maintain a consistent, sufficient standoff distance from each corresponding OBJECT_DEFS position (lines 79-86); combined with lookCurve being a separately-shaped CatmullRomCurve3 through only the 6 object positions vs. the camera curve's 8 points, the two curves drift out of alignment between waypoints, and at the Work/Labs waypoints the camera curve itself passes at or inside the object's bounding volume."
    missing:
      - "Increase camera standoff distance at the Work (t=0.4) and Labs (t=0.6) framing points so the camera clears each object's bounding radius with a legible margin (e.g., >=2x the bounding radius, matching the Problems/Contact framing that already works)."
      - "Either couple the two curves' parametrization (e.g., derive each camera path point as object_position + a fixed offset vector, rather than two independently-fit CatmullRom curves with different point counts) or add denser intermediate keyframes so no scrollY position within the runway produces a look direction more than ~30 degrees off every object's actual bearing."
      - "Re-verify with the same settle methodology used in this report (screenshot all 6 `#t-*` waypoints after a >=2.5s settle, plus several intermediate t values e.g. 0.1/0.3/0.5/0.7/0.9) confirming each shows a recognizable, hard-stepped-shaded object and no dead/empty frames anywhere in the scroll range."
human_verification:
  - test: "Scroll continuously (not via anchor jump) from top to bottom of the concept-c homepage runway on a real trackpad/mouse wheel, watching the whole transit"
    expected: "A continuously legible 'flight through a field of objects' feel — objects should grow, recede, and hand off to each other without ever going fully blank or clipping through geometry"
    why_human: "Automated capture confirms the specific broken zones at fixed t values; a full continuous-scroll pass is best judged by a human for overall pacing/feel once the framing fix above is made"
  - test: "On an actual low-tier / integrated-GPU or older mobile device, load /concept-c/ and confirm the scene neither stalls nor renders blank"
    expected: "deviceTier() code path (antialias off, DPR 1, 3-step gradient map, no parallax) runs smoothly"
    why_human: "SUMMARY and this verification confirm the tiering logic by code review only — no real low-tier hardware fixture was available to this session or the original implementation"
---

# Phase 4: Concept C — Experimental WebGL/3D Verification Report

**Phase Goal:** A visitor navigates a 3D-space homepage that uses WebGL as the reveal/navigation metaphor while remaining fully usable through standard web conventions, with or without WebGL.
**Verified:** 2026-07-24T18:35:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Priority Check Resolution

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

**Verdict: real gap**, filed under CONC-01/CONC-03 in the frontmatter above.

## Goal Achievement

### Observable Truths (Roadmap Success Criteria)

| # | Truth | Status | Evidence |
|---|---|---|---|
| 1 | Hero/nav zone renders a three.js 3D scene as the spatial nav metaphor; below-fold is standard performant DOM | PARTIAL | Scene renders (6 toon-stepped objects, hard steps confirmed at Problems/Contact/reduced-motion captures); below-fold sections are opaque DOM (`position:relative;z-index:1;background:var(--page)` — verified in CSS) and copy-diff passes. BUT the "spatial navigation metaphor" itself is broken for ~40-50% of the scroll journey — see gap above. |
| 2 | Clickable 3D objects/hotspots show visible hover AND keyboard-focus labels; activating (mouse/keyboard/touch) routes to derived sub-page | VERIFIED | 6 real `<a class="topic-label">` elements, `min-width/min-height:44px`, `:focus-visible` (2px solid `var(--fg)`, offset) confirmed in CSS at 11 selectors incl. labels/index/CTAs/footer/subpage links; `setAccent`/`clearAccent` fire on both `mouseenter`/`focusin` and `mouseleave`/`focusout` (hover/focus parity); link-integrity script (62 href/src across 4 pages in 04-03, re-verified independently here with a fresh script — 0 failures) confirms every href resolves to a real target. |
| 3 | Scrolling drives camera/scene movement; native scroll physics, back button, deep links all continue to work — no scroll-jacking | VERIFIED (mechanism) | `grep` confirms zero `wheel`/`touchmove`/`preventDefault`/`Raycaster` registrations; camera is a pure function of `window.scrollY` read every frame; deep-link `#t-work` independently reproduced landing at `scrollY=1080` = exactly `t=0.4`; all 6 waypoint anchors landed at their exact intended `t` values in this session's own capture run. The *mechanism* is sound — the *result* of that movement is the framing gap above. |
| 4 | Semantic DOM mirror is keyboard-navigable/screen-reader readable, shown outright when WebGL unavailable or reduced-motion is set | VERIFIED | `?nowebgl=1` capture (`index-nowebgl-1440.png`) shows stepped backdrop + full 6-label constellation, zero canvas. JS-off capture (`index-390.png`, full page) shows the same fallback plus complete below-fold content and footer, fully navigable with no script. Reduced-motion capture (`index-reduced-1440.png`) shows a frozen real 3D overview with all 6 objects + labels legible (a CONTEXT.md-documented discretion choice — CONTEXT.md line 39 explicitly leaves "static composed scene… or the no-webgl layout" to the planner, and 04-01 documented choosing the frozen-scene option) — DPR 1, no rAF, canvas pixels confirmed byte-identical before/after a scroll+settle in 04-03's own QA. Tab order independently re-verified in this session: CTA → 6 topic labels (DOM order) → topic index items, logical, no traps. |
| 5 | On lower-tier hardware, the scene runs at a clamped/degraded quality tier instead of stalling, crashing, or rendering blank | VERIFIED (code review only) | `deviceTier()` computed before any `WebGLRenderer`/material construction: `hardwareConcurrency <= 4` primary signal, `deviceMemory <= 4` Chromium-only bonus (never sole gate), `max-width:768px` fallback for Safari/Firefox. Low tier: `antialias:false`, `setPixelRatio(1)`, 3-step gradient map (vs 4), parallax never registered. No real low-tier hardware fixture was available to verify at runtime (flagged for human verification). |

**Score:** 4/5 truths fully verified (1 partial due to the camera-framing gap, which cuts across both Truth 1 and Truth 3)

### Required Artifacts

| Artifact | Expected | Status | Details |
|---|---|---|---|
| `concept-c/index.html` | Full shell: mount, backdrop, topbar, runway, 6 waypoints, label-field, topic-index, filled below-fold sections, footer | VERIFIED | 164 lines; all contract elements present; 282-chunk copy-diff passes |
| `concept-c/assets/css/concept-c.css` | Mode-gated layout, stepped backdrop, focus-visible, reduced-motion overrides | VERIFIED | 725 lines; `repeating-linear-gradient` sole gradient; 11 `:focus-visible` selectors; `prefers-reduced-motion` handling present |
| `concept-c/assets/js/scene.js` | WebGL2 probe, 6 objects, CatmullRom dolly, projected labels, device tiering, render-loop gating | VERIFIED (mechanically) / GAP (composition) | 408 lines; parses cleanly via `node --input-type=module`; all required idioms present (probe, `NearestFilter`, `.project(camera)`, `visibilitychange`, `powerPreference`, `getPropertyValue`, `sceneReady`, `deviceTier`); zero wheel/touch/preventDefault/Raycaster; **but** the camera/lookAt curve pair produces the framing gap documented above |
| `concept-c/pages/interceptos.html` | Full InterceptOS sub-page (4 flows × 4 stages + 13-agent roster) | VERIFIED | 372 lines (≥200 required); all `os.*`/`agents.*` chunks pass copy-diff; inline lockup + persistent back link present |
| `concept-c/pages/work.html` | Consolidated 3-case work sub-page | VERIFIED | 140 lines (≥100 required); all `work.*` chunks pass; back link present |
| `concept-c/pages/insights.html` | New layout-only 3-episode index with real external links | VERIFIED | 85 lines (≥80 required); all `insights.*` chunks pass; back link present |
| `.planning/phases/04.../captures/` | ≥16 reviewed QA captures | VERIFIED (+6 new) | 18 captures from 04-03 + 6 new `settle-<topic>.png` captures added by this verification |

### Key Link Verification

| From | To | Via | Status | Details |
|---|---|---|---|---|
| `scene.js` rAF tick | camera position | `window.scrollY` → `CatmullRomCurve3.getPointAt` → lerp | WIRED (mechanically), GAP (composition) | Curve read is correct and pure-function-of-scrollY; the *curve shape itself* produces bad framing at 3/6 waypoints + mid-transit — see gap |
| `scene.js updateLabels` | `.topic-label` DOM elements | `Vector3.project(camera)` → `style.transform translate3d` | WIRED | Confirmed via own capture run: every label's `transform` reflects a distinct, camera-relative screen position; `is-hidden` correctly toggled off-frustum |
| `index.html` bootstrap | `scene.js` init | WebGL2 probe gate | WIRED | `?nowebgl=1` forces `.no-webgl`, confirmed zero canvas in that capture |
| `scene.js` materials | `shared/tokens.css` | `getComputedStyle().getPropertyValue` | WIRED | Zero raw hex/0x literals found in scene.js (grep clean) |
| `a.topic-label[data-topic]` hrefs | sub-pages / anchors | locked routing map | WIRED | Independent link-integrity script (this session): 0 failures across all 4 pages, all local paths + anchors resolve |
| `concept-c.css` | cross-document View Transitions | `@view-transition { navigation: auto }` | WIRED | Present in CSS, no `view-transition-name` anywhere (grep clean) |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|---|---|---|---|---|
| CONC-01 | 04-01, 04-02 | 3D as spatial nav metaphor in hero zone; below-fold standard DOM | PARTIAL | Below-fold/DOM split fully verified; the "3D as spatial nav metaphor" half has the camera-framing gap above |
| CONC-02 | 04-01, 04-02 | Clickable hotspots, hover+focus labels, routes to sub-pages | SATISFIED | Labels, focus-visible, routing all verified |
| CONC-03 | 04-01 | Scroll drives camera, no scroll-jacking, back/deep-links work | PARTIAL | Mechanism (native scroll, no interception, deep-links land at correct `t`) fully verified; the resulting camera movement is frequently illegible — same root cause as CONC-01's gap |
| CONC-04 | 04-01, 04-03 | Semantic DOM mirror; shown when WebGL unavailable/reduced-motion | SATISFIED | no-webgl, no-JS, reduced-motion all independently re-verified this session |
| CONC-05 | 04-01, 04-03 | Device-tiered rendering, no stall/crash/blank on lower tier | SATISFIED (code review) | Tiering heuristic and degradation path verified in code; no real low-tier hardware fixture available (flagged for human verification) |

No orphaned requirements — REQUIREMENTS.md's Phase 4 list (CONC-01 through CONC-05) matches exactly what the three plans (04-01, 04-02, 04-03) collectively declare.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|---|---|---|---|---|
| `concept-c/assets/js/scene.js` | 90-99 | `CAMERA_PATH_POINTS` control points too close to (or inside) several `OBJECT_DEFS` positions | Blocker | Root cause of the camera-framing gap above |

No TODO/FIXME/placeholder comments, no empty stub implementations, no console.log-only handlers found anywhere in concept-c.

### Human Verification Required

See `human_verification` in the frontmatter — a full continuous-scroll pass (once the framing fix lands) and real low-tier hardware confirmation of the device-tier code path.

### Gaps Summary

Everything in Concept C is solid except one specific, well-isolated defect: the scroll-driven camera's dolly path was authored with two independently-shaped `CatmullRomCurve3` curves (an 8-point camera path and a 6-point look-at path built from the object positions) without checking that the resulting camera position always maintains legible standoff distance from — and directional alignment with — the topic it's supposed to be framing at that scroll position. The endpoints (Problems, Contact) happen to work because the path's start/end pads were placed generously; the interior waypoints (InterceptOS, Work, Labs) were not, and Work in particular puts the camera essentially touching the object. This is a real, reproducible, and significant defect in the core "topic field" spatial-navigation metaphor (the phase's headline goal), confirmed with real-Chrome captures at all 6 locked waypoints after a 2.8-second settle (ruling out a timing artifact) and corroborated with exact `CatmullRomCurve3` math. Every other dimension of the phase — copy fidelity (282/282), brand compliance (8/8 greps clean), accessibility (focus-visible, tab order, ≥44px targets, DOM mirror, hover/focus parity), fallback modes (no-webgl, no-JS, reduced-motion), routing/link integrity (0 failures), and device-tiering code — is fully verified and passes cleanly. This is a narrowly-scoped, fixable gap (adjust `CAMERA_PATH_POINTS`/curve coupling), not a structural problem with the concept.

---

*Verified: 2026-07-24T18:35:00Z*
*Verifier: Claude (gsd-verifier)*
