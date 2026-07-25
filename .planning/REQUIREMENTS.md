# Requirements: Intercept Homepage Concepts

**Defined:** 2026-07-23
**Core Value:** A visitor never faces a wall of text — content is revealed as needed, and clicking an area of interest takes them to a focused page built from that content.

## v1 Requirements

Requirements for the side-by-side review deliverable. Each maps to roadmap phases.

### Foundation (shared content + brand layer)

- [x] **FOUND-01**: Canonical homepage copy is captured verbatim from the live interceptgroup.com homepage (Variant A) into a single chunked content source (`content/homepage.json`), frozen after capture
- [x] **FOUND-02**: Topic chunks are mapped to a derived sub-page content model — every "area of interest" has verbatim sub-page copy ready for all three concepts to route to
- [x] **FOUND-03**: Shared Fritz brand layer (design tokens, fonts, canonical 8-path logo assets) is mirrored from the intercept-brand-kit SSoT and used by all three concepts
- [x] **FOUND-04**: A copy-diff QA gate script verifies each concept's rendered text against the canonical content source (verbatim rule mechanically enforced)
- [x] **FOUND-05**: A local preview server serves all three concepts plus a gallery index page for side-by-side review on one port

### Concept A — "Accenture, but better" (editorial)

- [x] **CONA-01**: Homepage opens with a single strong hero statement and ONE primary CTA — no rotating hero, no abstract tagline sludge
- [x] **CONA-02**: Content lives in an editorial card grid with oversized type; each section has one visually primary CTA with distinct, content-specific labels (no generic "Expand" everywhere)
- [x] **CONA-03**: Trust-signal block (client work / proof points from existing copy) executed with restraint — specific over vague
- [x] **CONA-04**: Clicking a card routes to its derived sub-page (cross-document View Transitions where supported, graceful without)
- [x] **CONA-05**: Kinetic typography accents on scroll/hover — sparing, sine ease-in-out, no gratuitous motion
- [x] **CONA-06**: Imagery is real-stock (Pexels-class) or ComfyUI-generated per brand rules — no neon/glow AI slop

### Concept B — full-screen video

- [x] **CONB-01**: Full-bleed muted ambient video hero (autoplay muted + playsinline + loop, poster frame, WebM+MP4 sources) using quality stock video or ComfyUI-generated footage
- [x] **CONB-02**: Clickable hotspot overlays tied to video regions — every hotspot has a visible label/affordance (no mystery meat)
- [x] **CONB-03**: Clicking a hotspot first reveals an inline chapter panel (progressive disclosure preview), then routes to the full derived sub-page
- [x] **CONB-04**: `prefers-reduced-motion` renders a static poster with standard visible navigation; no sound ever autoplays
- [x] **CONB-05**: Video is compressed to a sane budget with poster-frame LCP protection (no CLS from late video load)

### Concept C — experimental WebGL/3D

- [x] **CONC-01**: A three.js 3D scene serves as the spatial navigation metaphor, concentrated in the hero/nav zone — content below is standard performant DOM
- [x] **CONC-02**: Clickable 3D objects/hotspots with visible hover AND focus labels route to derived sub-pages
- [x] **CONC-03**: Scroll drives camera/scene movement while native scroll physics, back button, and deep links stay intact (no scroll-jacking)
- [x] **CONC-04**: A semantic DOM mirror is built alongside the 3D layer — keyboard navigable, screen-reader readable, and shown outright when WebGL is unavailable or reduced-motion is set
- [x] **CONC-05**: Device-tiered rendering (DPR clamp, capability detection, graceful degradation) keeps the scene usable on integrated GPUs and mobile

### Concept D — Home Variant (light video + module cards) — ADDED 2026-07-24 pivot

- [x] **COND-01**: Sticky nav + logo treatment mirrored from the latest deployed bundle (staging home.html): InterceptOS, Intercept Labs, Work, About, Insights, Contact
- [x] **COND-02**: Full-screen light, positive motion-graphics video background (autoplay muted playsinline loop, poster, WebM+MP4, reduced-motion static fallback) with light-mode UI
- [x] **COND-03**: Small enticing topic cards (redundant with nav), one per home-page section module, laid over the video
- [x] **COND-04**: Clicking a card expands a modal window containing the COMPLETE existing section module — deployed design preserved (markup/styles/behavior ported from the staging bundle)
- [x] **COND-05**: Nav routes to standalone pages carrying that content (section pages from the same modules; About/Insights/ChatB2B mirrored from the deployed bundle)
- [x] **COND-06**: Module fidelity gate — module copy verbatim vs canonical source (copy-diff substring mode) and modules visually faithful to the deployed sections
- [x] **COND-07**: Modals are accessible (focus trap, Esc, focus return), cards are real buttons, keyboard path complete, no scroll-jacking

### Cross-cutting QA

- [x] **QA-01**: Fritz brand QA pass on all concepts before review (Flarepop-only colored text, apex-up triangles, mark never decoration, hard-step gradients, no rule lines, banned tagline absent)
- [x] **QA-02**: Copy-diff gate passes on all concepts (verbatim transcription confirmed)
- [x] **QA-03**: All concepts are responsive (mobile/tablet/desktop) with acceptable LCP; each concept ships at least 2-3 working derived sub-pages proving the click-through model
- [x] **QA-04**: Review gallery presents all concepts side-by-side with captures, ready for Jon

### Concept D — Iteration 2 (Jon direction 2026-07-24 evening)

- [x] **ITER-01**: Desktop first viewport contains the compact hero (reduced headline + blurb) AND the full section-card grid — most information above the fold
- [x] **ITER-02**: Section cards are uniform height, aligned top and bottom, copy anchored bottom uniformly, each with an explicit expand CTA
- [x] **ITER-03**: Cards are semi-opaque over the video with a hover state that mimics/echoes the background video
- [x] **ITER-04**: Card expansion is a scaling transition into a full-viewport modular window
- [x] **ITER-05**: Module content inside the windows is reskinned quieter — verbatim copy, progressive disclosure, no walls of text
- [x] **ITER-06**: A full-screen work section follows the hero: campaign reel background (existing asset) + three small case cards with the same card-to-module transition and composition
- [x] **ITER-07**: FAQs, Start the Conversation, and footer are plain below-fold sections — not cards, not modals
- [x] **ITER-08**: Client logo strip kept in between sections as currently placed

### Concept D — Iteration 3 (Jon direction 2026-07-25)

- [x] **IT3-01**: Hero headline sits closer to the sticky nav and is bigger; fold budget still holds at 1440×900 and 1280×800
- [x] **IT3-02**: Cards open standalone quiet pages (not modals) — 5 section pages + 3 case pages — each with a clear, consistent way back to the homepage; homepage module dialogs removed
- [x] **IT3-03**: Card hover state is clearly obvious (not subtle) while staying within brand motion/color rules
- [x] **IT3-04**: Work-reel section plays the v2 reel featuring the weavy.ai SAP brand film excerpts

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhancements

- **ENH-01**: Full derived sub-page set covering every content area of the original homepage
- **ENH-02**: Scroll-scrubbed frame-accurate video via pre-decoded image-sequence-on-canvas (Concept B)
- **ENH-03**: Portal/morph page transitions shared across Concepts B and C
- **ENH-04**: Cursor-reactive particle/shader hero accents (Concept C)
- **ENH-05**: Deep performance pass (device-lab testing, asset budget audit)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Production deployment | interceptgroup.com deploys ONLY via intercept-deploy MCP on Jon's explicit go — these are review concepts |
| CMS/backend integration | Static prototypes only |
| Command-palette-only navigation | Power-user SaaS pattern; fails as sole nav for first-time marketing visitors |
| Scroll-jacking | Breaks the native scroll contract; anti-feature per research |
| Autoplay with sound | WCAG 1.4.2 / baseline UX hygiene |
| 19×19 mega-menu | Recreates the wall-of-text problem inside a dropdown |
| Rewriting brand copy | Copy is immutable — transcribe verbatim, restructure only |
| react-three-fiber / build tooling | Doubles bundle vs vanilla three.js; violates no-build static constraint |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| FOUND-05 | Phase 1 | Complete |
| CONA-01 | Phase 2 | Complete |
| CONA-02 | Phase 2 | Complete |
| CONA-03 | Phase 2 | Complete |
| CONA-04 | Phase 2 | Complete |
| CONA-05 | Phase 2 | Complete |
| CONA-06 | Phase 2 | Complete |
| CONB-01 | Phase 3 | Complete |
| CONB-02 | Phase 3 | Complete |
| CONB-03 | Phase 3 | Complete |
| CONB-04 | Phase 3 | Complete |
| CONB-05 | Phase 3 | Complete |
| CONC-01 | Phase 4 | Complete |
| CONC-02 | Phase 4 | Complete |
| CONC-03 | Phase 4 | Complete |
| CONC-04 | Phase 4 | Complete |
| CONC-05 | Phase 4 | Complete |
| COND-01 | Phase 5 | Complete |
| COND-02 | Phase 5 | Complete |
| COND-03 | Phase 5 | Complete |
| COND-04 | Phase 5 | Complete |
| COND-05 | Phase 5 | Complete |
| COND-06 | Phase 5 | Complete |
| COND-07 | Phase 5 | Complete |
| ITER-01 | Phase 7 | Complete |
| ITER-02 | Phase 7 | Complete |
| ITER-03 | Phase 7 | Complete |
| ITER-04 | Phase 7 | Complete |
| ITER-05 | Phase 7 | Complete |
| ITER-06 | Phase 7 | Complete |
| ITER-07 | Phase 7 | Complete |
| ITER-08 | Phase 7 | Complete |
| IT3-01 | Phase 8 | Complete |
| IT3-02 | Phase 8 | Complete |
| IT3-03 | Phase 8 | Complete |
| IT3-04 | Phase 8 | Complete |
| QA-01 | Phase 6 | Complete |
| QA-02 | Phase 6 | Complete |
| QA-03 | Phase 6 | Complete |
| QA-04 | Phase 6 | Complete |

**Coverage:**
- v1 requirements: 44 total
- Mapped to phases: 44
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-23*
*Last updated: 2026-07-24 after Phase 6 closeout (all 32 v1 requirements complete)*
