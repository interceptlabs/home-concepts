# Requirements: Intercept Homepage Concepts

**Defined:** 2026-07-23
**Core Value:** A visitor never faces a wall of text — content is revealed as needed, and clicking an area of interest takes them to a focused page built from that content.

## v1 Requirements

Requirements for the side-by-side review deliverable. Each maps to roadmap phases.

### Foundation (shared content + brand layer)

- [x] **FOUND-01**: Canonical homepage copy is captured verbatim from the live interceptgroup.com homepage (Variant A) into a single chunked content source (`content/homepage.json`), frozen after capture
- [x] **FOUND-02**: Topic chunks are mapped to a derived sub-page content model — every "area of interest" has verbatim sub-page copy ready for all three concepts to route to
- [x] **FOUND-03**: Shared Fritz brand layer (design tokens, fonts, canonical 8-path logo assets) is mirrored from the intercept-brand-kit SSoT and used by all three concepts
- [ ] **FOUND-04**: A copy-diff QA gate script verifies each concept's rendered text against the canonical content source (verbatim rule mechanically enforced)
- [x] **FOUND-05**: A local preview server serves all three concepts plus a gallery index page for side-by-side review on one port

### Concept A — "Accenture, but better" (editorial)

- [ ] **CONA-01**: Homepage opens with a single strong hero statement and ONE primary CTA — no rotating hero, no abstract tagline sludge
- [ ] **CONA-02**: Content lives in an editorial card grid with oversized type; each section has one visually primary CTA with distinct, content-specific labels (no generic "Expand" everywhere)
- [ ] **CONA-03**: Trust-signal block (client work / proof points from existing copy) executed with restraint — specific over vague
- [ ] **CONA-04**: Clicking a card routes to its derived sub-page (cross-document View Transitions where supported, graceful without)
- [ ] **CONA-05**: Kinetic typography accents on scroll/hover — sparing, sine ease-in-out, no gratuitous motion
- [ ] **CONA-06**: Imagery is real-stock (Pexels-class) or ComfyUI-generated per brand rules — no neon/glow AI slop

### Concept B — full-screen video

- [ ] **CONB-01**: Full-bleed muted ambient video hero (autoplay muted + playsinline + loop, poster frame, WebM+MP4 sources) using quality stock video or ComfyUI-generated footage
- [ ] **CONB-02**: Clickable hotspot overlays tied to video regions — every hotspot has a visible label/affordance (no mystery meat)
- [ ] **CONB-03**: Clicking a hotspot first reveals an inline chapter panel (progressive disclosure preview), then routes to the full derived sub-page
- [ ] **CONB-04**: `prefers-reduced-motion` renders a static poster with standard visible navigation; no sound ever autoplays
- [ ] **CONB-05**: Video is compressed to a sane budget with poster-frame LCP protection (no CLS from late video load)

### Concept C — experimental WebGL/3D

- [ ] **CONC-01**: A three.js 3D scene serves as the spatial navigation metaphor, concentrated in the hero/nav zone — content below is standard performant DOM
- [ ] **CONC-02**: Clickable 3D objects/hotspots with visible hover AND focus labels route to derived sub-pages
- [ ] **CONC-03**: Scroll drives camera/scene movement while native scroll physics, back button, and deep links stay intact (no scroll-jacking)
- [ ] **CONC-04**: A semantic DOM mirror is built alongside the 3D layer — keyboard navigable, screen-reader readable, and shown outright when WebGL is unavailable or reduced-motion is set
- [ ] **CONC-05**: Device-tiered rendering (DPR clamp, capability detection, graceful degradation) keeps the scene usable on integrated GPUs and mobile

### Cross-cutting QA

- [ ] **QA-01**: Fritz brand QA pass on all three concepts before review (Flarepop-only colored text, apex-up triangles, mark never decoration, hard-step gradients, no rule lines, banned tagline absent)
- [ ] **QA-02**: Copy-diff gate passes on all three concepts (verbatim transcription confirmed)
- [ ] **QA-03**: All three concepts are responsive (mobile/tablet/desktop) with acceptable LCP; each concept ships at least 2-3 working derived sub-pages proving the click-through model
- [ ] **QA-04**: Review gallery presents all three concepts side-by-side with captures, ready for Jon

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
| FOUND-04 | Phase 1 | Pending |
| FOUND-05 | Phase 1 | Complete |
| CONA-01 | Phase 2 | Pending |
| CONA-02 | Phase 2 | Pending |
| CONA-03 | Phase 2 | Pending |
| CONA-04 | Phase 2 | Pending |
| CONA-05 | Phase 2 | Pending |
| CONA-06 | Phase 2 | Pending |
| CONB-01 | Phase 3 | Pending |
| CONB-02 | Phase 3 | Pending |
| CONB-03 | Phase 3 | Pending |
| CONB-04 | Phase 3 | Pending |
| CONB-05 | Phase 3 | Pending |
| CONC-01 | Phase 4 | Pending |
| CONC-02 | Phase 4 | Pending |
| CONC-03 | Phase 4 | Pending |
| CONC-04 | Phase 4 | Pending |
| CONC-05 | Phase 4 | Pending |
| QA-01 | Phase 5 | Pending |
| QA-02 | Phase 5 | Pending |
| QA-03 | Phase 5 | Pending |
| QA-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-23*
*Last updated: 2026-07-23 after roadmap creation*
