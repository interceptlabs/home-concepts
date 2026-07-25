---
phase: 07-concept-d-iteration-2
verified: 2026-07-25T05:35:26Z
status: passed
score: 8/8 must-haves verified
---

# Phase 7: Concept D — Iteration 2 Verification Report

**Phase Goal:** Jon's iteration direction on the variant: most information above the fold (compact hero + uniform semi-opaque section cards with expand CTAs), a full-screen work-reel section with three case cards, scaling card-to-module transitions into reskinned quieter module windows, FAQs/convert/footer as plain below-fold sections, logos kept in between.
**Verified:** 2026-07-25T05:35:26Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Desktop first viewport contains the compact hero + full 5-card section grid (ITER-01) | VERIFIED | Puppeteer assertion `#modules` bottom (816.5) <= 900 innerHeight and (765.2) <= 800 at 1280x800; `index-fold-1440x900.png`/`index-fold-1280x800.png` read — compact hero + all 5 cards fully visible at both breakpoints, no clipping |
| 2 | Cards uniform height, top/bottom aligned, copy anchored bottom, explicit expand CTA (ITER-02) | VERIFIED | `.card{display:flex;flex-direction:column}` + `.card-bottom{margin-top:auto}` in concept-d.css:146/204; 16 `card-cta` occurrences (8 real cards x 2, incl. no-JS fallbacks) all reading "Open +"; captures confirm bottom-anchored rhythm |
| 3 | Cards semi-opaque with a hover state echoing the background video (ITER-03) | VERIFIED | `rgba(255,255,255,0.75)` resting / `rgba(255,255,255,0.5)` hover+focus-visible+active (concept-d.css:160/184/189); behavior suite measured alpha 0.75→0.5 on hover; `card-hover-1440.png` read, calm and legible |
| 4 | Clicking a card scales it into a full-viewport modular window (ITER-04) | VERIFIED | `cards.js` implements View-Transitions primary path (`startViewTransition` + `viewTransitionName` handoff invoker↔dialog) with FLIP-on-`.modal-body` fallback (never on `dialog.module-modal` — INVARIANT comment + Python brace-scan confirms no `transform:` in that rule) and instant swap under reduced-motion; morph coverage assertion 96.0% x 92.0% of viewport at 1440x900; Esc→focus-return confirmed; `window-os-1440.png`/`morph-midflight-1440.png` read |
| 5 | Module window content reskinned quieter — verbatim copy, progressive disclosure (ITER-05) | VERIFIED | `quiet-modules.js` reads `PROBLEMS_RR[key]`/`PROBLEM_FLOWS[flow]` as live globals (never a re-typed string); Problems shows one problem + collapsed `<details class="q-more">` tells; OS shows one stage of 4 via a stepper; `quiet-problems-1440.png`/`window-problems-390.png`/`window-os-1440.png` read — one thing visible at a time, generous whitespace, no wall of text |
| 6 | Full-screen work section with campaign reel + 3 case cards, same card-to-module composition (ITER-06) | VERIFIED | `#work-reel` section (min-height:100dvh) sits immediately after `.clients`; `reel-video.js` IO-gates play/pause (threshold 0.25, preload="none", verified `readyState 0` at load, plays in view, pauses out of view); 3 case cards use the identical `.card`/`data-modal` composition; 3 `dlg-case-*` windows render stat+client+tag+name+summary+image (static) plus single-open Challenge/Approach/Results from `CASES[key]` (quiet-modules.js); `work-reel-1440.png`/`window-case-1440.png`/`window-case-detail-1440.png` read |
| 7 | FAQs/Start-a-Conversation/footer are plain below-fold sections, not cards/modals (ITER-07) | VERIFIED | `id="dlg-faqs"`/`id="dlg-convert"` absent from index.html; `id="faqs"`/`id="convert"` present as plain `<section>`s in page flow; page order mechanically confirmed hero→clients→work-reel→faqs→convert→footer; occlusion CSS extended to `.clients, .work-reel, #faqs, #convert, footer` |
| 8 | Client logo strip kept in between sections, unchanged (ITER-08) | VERIFIED | `<section class="clients" id="clients">` sits between the hero-viewport and `#work-reel`, same treatment as Phase 5; captures confirm no bleed-through |

**Score:** 8/8 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `concept-d/index.html` | Restructured homepage: compact hero, 5-card grid, work-reel + 3 case cards, 8 dialogs, FAQs/convert inline | VERIFIED | 8 `<dialog>`, 8 `data-modal` cards (5 section + 3 case), `card-field--five`, no `dlg-work`/`dlg-faqs`/`dlg-convert`/`casePanel`/`data-case`, no "Explore more" |
| `concept-d/assets/css/concept-d.css` | Compact hero, card translucency + bottom-anchor, work-reel chrome, full-viewport windows, quiet chrome, sine-only VT timing | VERIFIED | `card-bottom`, `repeat(5, 1fr)`, 0.75/0.5 translucency, `dialog.module-modal{width:min(1500px,96vw);height:92vh}` with INVARIANT intact, `::view-transition-group(modal-morph)` at 600ms/cubic-bezier(0.37,0,0.63,1) |
| `concept-d/assets/js/reel-video.js` | IntersectionObserver-gated reel play/pause + toggle + guards | VERIFIED | IO threshold 0.25, `prefersReducedMotion`/`userPaused`/`visibilitychange` guards ported from hero-video.js, `node --check` passes |
| `concept-d/assets/js/cards.js` | View-Transition open/close + FLIP fallback + Esc/focus semantics | VERIFIED | `startViewTransition`, `viewTransitionName` handoff both directions, `cancel` interception with `preventDefault`, drawer-first-Esc capture-phase snapshot, FLIP transform scoped to `.modal-body` only, `node --check` passes |
| `concept-d/assets/js/quiet-modules.js` | Quiet render functions reading data globals at render time | VERIFIED | `PROBLEMS_RR[`, `PROBLEM_FLOWS[`, `CASES[` all read as live globals; zero hard-coded copy; `node --check` passes |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `index.html .card[data-modal]` | `cards.js openModal()` | `data-modal` attribute | WIRED | 8 `button.card[data-modal]` elements match 8 `dialog#dlg-*` ids exactly |
| `reel-video.js` | `.reel-video` element | IntersectionObserver on `#work-reel`, threshold 0.25 | WIRED | Confirmed in source; behavior suite: plays in view, pauses out of view, byte-idle (`readyState 0`) until first intersection |
| `cards.js` transition | `dialog.module-modal` | View Transitions / FLIP-on-`.modal-body` | WIRED, invariant preserved | Python brace-scan: no `transform:` inside `dialog.module-modal` rule body; FLIP code path applies `transform` only to `.modal-body` |
| `quiet-modules.js` | `deployed.js` data objects | direct global reads (`PROBLEMS_RR`, `PROBLEM_FLOWS`, `CASES`) | WIRED | No re-typed literals; `qa/concept-d-script-diff.py` (byte-identical source objects) stays the sufficient verbatim guarantee |
| `#dlg-agents`/`#dlg-labs` drawers | `#convoDrawer`/`#pitchLabs` | `reparentInto(dialog)` | WIRED, invariant preserved | Behavior suite: `#convoDrawer` rect covers full viewport from inside the Agents dialog (regression-tested through the new morph) |
| inline `#convert` convo-tile | `#convoDrawer` | `data-open="convoDrawer"` (deployed.js listener) | WIRED | `#convert` is plain page flow post-unwrap; no reparenting needed |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| ITER-01 | 07-01 | Above-the-fold density (compact hero + full card grid) | SATISFIED | Fold assertion + captures at both breakpoints |
| ITER-02 | 07-01 | Uniform bottom-anchored cards + explicit CTA | SATISFIED | `.card`/`.card-bottom` flex architecture, uniform "Open +" |
| ITER-03 | 07-01 | Semi-opaque cards + video-echo hover | SATISFIED | 0.75→0.5 translucency, touch/keyboard parity, staged hover verdict |
| ITER-04 | 07-02 | Scaling card→window transition | SATISFIED | View Transitions + FLIP fallback + reduced-motion instant, Esc/focus semantics |
| ITER-05 | 07-02 | Quiet reskinned module windows | SATISFIED | quiet-modules.js progressive disclosure, verbatim data reads |
| ITER-06 | 07-01 (shell) + 07-02 (transition/content) | Work section + 3 case cards, same transition | SATISFIED | Section shell (07-01) + case-window quiet render + shared `.card`/morph composition (07-02) |
| ITER-07 | 07-01 | FAQs/convert/footer plain below-fold | SATISFIED | Page-order assertion, dialogs removed |
| ITER-08 | 07-01 | Logo strip kept in between | SATISFIED | `.clients` section position unchanged |

All 8 requirement IDs declared across 07-01/07-02/07-03 plan frontmatter are accounted for and marked Complete in REQUIREMENTS.md. No orphaned requirements found for Phase 7.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | None found (TODO/FIXME/placeholder/stub scan clean across index.html, concept-d.css, cards.js, reel-video.js, quiet-modules.js) | — | — |

Two false-positive gate regexes were identified and corrected during Plan 07-03 (border-top/bottom rule-line grep, gradient grep) — both were verification-tooling bugs, not code issues; re-checked with corrected logic and independently re-confirmed here with the same corrected logic (0 real violations of either kind).

### Human Verification Required

None required to determine phase status — the mechanical gate suite plus a 20-assertion Puppeteer behavior suite plus honest capture review across 23 captures (all independently re-read during this verification) together cover fold geometry, hover translucency, video IO-gating, transition coverage/focus-return, the drawer invariant, reduced-motion, and no-JS. Two lower-priority, out-of-phase-scope items remain (both pre-existing, documented before this phase, not regressions): Concept D's un-mirrored legal-page links (`ai-policy.html` etc.) and un-mirrored Insights article pages, both logged in Phase 6's `06-01-SUMMARY.md` and carried forward unchanged.

### Gaps Summary

None. All 8 must-have observable truths verified against the live codebase (not just SUMMARY claims): both copy gates independently re-run and green, brand greps independently re-run and green (including corrected gradient/rule-line checks), the sine-only view-transition timing rule independently confirmed (600ms + cubic-bezier(0.37, 0, 0.63, 1)), the `dialog.module-modal` no-transform invariant independently confirmed via brace-scan, cards.js/reel-video.js/quiet-modules.js independently read line-by-line and confirmed to match their documented wiring, and 10 of the phase's 23 captures independently re-read (fold x2, hover, work-reel, morph mid-flight, OS window, case window + detail, no-JS, mobile, mobile window, reduced-motion) with consistent honest judgment matching the SUMMARYs. Link integrity independently re-run with a fresh scanner: 32 non-allowlisted-by-me failures, all of which match exactly the pre-existing, Phase-6-documented legal-page and un-mirrored-article link set — zero new/regressed links from this phase.

---

*Verified: 2026-07-25T05:35:26Z*
*Verifier: Claude (gsd-verifier)*
