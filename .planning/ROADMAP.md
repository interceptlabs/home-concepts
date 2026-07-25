# Roadmap: Intercept Homepage Concepts

## Overview

Three structurally unrelated homepage concepts (editorial card-grid, full-screen video, experimental WebGL/3D) are built from one frozen, verbatim content source and one shared Fritz brand layer, then reviewed side by side. Phase 1 builds the shared foundation every concept depends on — canonical content, brand tokens, and the copy-diff QA gate — so drift across three parallel builds is prevented mechanically rather than caught late. Phases 2, 3, and 4 build each concept as a fully isolated unit (lowest-risk editorial concept first, video second, experimental WebGL last), all depending only on Phase 1 and therefore buildable in parallel. Phase 5 (added 2026-07-24 pivot) builds Concept D — a speculative variant of the deployed homepage with light-mode full-screen video and expanding module cards. Phase 6 closes the project with a cross-concept QA pass and the side-by-side review gallery Jon actually looks at.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Content Foundation & Shared Brand Layer** - Canonical verbatim content, shared Fritz brand assets, copy-diff gate, and repo/server skeleton exist before any concept work starts (completed 2026-07-23)
- [x] **Phase 2: Concept A — Editorial ("Accenture, but better")** - Editorial card-grid homepage with single hero + primary CTA and click-through sub-pages (completed 2026-07-24)
- [x] **Phase 3: Concept B — Full-Screen Video** - Full-bleed ambient video hero with labeled hotspots, progressive reveal, and click-through sub-pages (completed 2026-07-24)
- [x] **Phase 4: Concept C — Experimental WebGL/3D** - three.js spatial navigation metaphor with an accessible DOM mirror and device-tiered rendering (completed 2026-07-24)
- [x] **Phase 5: Concept D — Home Variant (light video + module cards)** - Deployed sections revealed via enticing cards + modals over a light video field (completed 2026-07-24)
- [x] **Phase 6: Cross-Concept QA & Review Packaging** - Brand/copy verification across all three concepts and a side-by-side review gallery for Jon (completed 2026-07-24)
- [x] **Phase 7: Concept D — Iteration 2 (above-the-fold + work reel + quiet modules)** - Compact hero + 5-card grid above the fold, full-screen work-reel section, scaling card-to-window transitions into quiet reskinned module windows (completed 2026-07-25)

## Phase Details

### Phase 1: Content Foundation & Shared Brand Layer
**Goal**: The canonical content and brand foundation exists so all three concepts build from a single verified source without copy or brand drift.
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05
**Success Criteria** (what must be TRUE):
  1. A single `content/homepage.json` exists containing every homepage content chunk transcribed verbatim from the live interceptgroup.com homepage (Variant A), plus a `content/SOURCE.md` provenance note, and is frozen after capture.
  2. Every homepage content chunk has a corresponding derived sub-page entry with verbatim sub-page copy, ready for all three concepts to route to.
  3. Running `qa/copy-diff.py` against the canonical content source produces a pass/fail report the concepts can be checked against.
  4. Shared Fritz brand assets (design tokens, fonts, canonical 8-path logo) exist in `shared/`, mirrored from the intercept-brand-kit source of truth, ready for import by all three concepts.
  5. A local static server runs and serves the repo skeleton (`concept-a/`, `concept-b/`, `concept-c/`, asset directories) plus a placeholder gallery index on one port.
**Plans**: 4 plans (4/4 complete)

Plans:
- [x] 01-01-PLAN.md — Canonical verbatim content capture (homepage.json + subpages.json + SOURCE.md) (completed 2026-07-23)
- [x] 01-02-PLAN.md — Shared Fritz brand layer (tokens + aliases, fonts, motion, static 8-path lockup, rules README) (completed 2026-07-23)
- [x] 01-03-PLAN.md — Copy-diff QA gate (qa/copy-diff.py, fixture-proven, data-copy + fallback modes) (completed 2026-07-23)
- [x] 01-04-PLAN.md — Repo skeleton, serve.sh on :4340, Fritz-branded review gallery (completed 2026-07-23)

### Phase 2: Concept A — Editorial ("Accenture, but better")
**Goal**: A visitor can browse an editorial, card-driven homepage with one strong hero statement and click through to focused sub-pages — executed with tighter craft than the Accenture reference.
**Depends on**: Phase 1
**Requirements**: CONA-01, CONA-02, CONA-03, CONA-04, CONA-05, CONA-06
**Success Criteria** (what must be TRUE):
  1. The homepage opens with one strong hero statement and one primary CTA — no rotating hero carousel, no abstract tagline.
  2. Content is organized into an editorial card grid with oversized type, and each card/section shows one visually primary, content-specific CTA label (never a generic "Expand" reused everywhere).
  3. A trust-signal block presents specific proof points transcribed from the canonical content, executed with restraint rather than vague claims.
  4. Clicking a card navigates to its derived sub-page (via cross-document View Transition where supported, plain navigation otherwise) showing that card's full verbatim content.
  5. Kinetic type accents animate sparingly on scroll/hover with sine ease-in-out (no gratuitous motion), and all imagery is real-stock (Pexels-class) or ComfyUI-generated per brand rules (no neon/glow AI slop).
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Editorial homepage: all 9 locked sections, fully data-copy annotated, dark canvas + oversized fluid type (completed 2026-07-23)
- [ ] 02-02-PLAN.md — 5 derived sub-pages (interceptos, insights, 3 work cases) + cross-document View Transitions + routing integrity
- [ ] 02-03-PLAN.md — Motion layer (IO scroll reveals, hero stagger, reduced-motion guards) + mechanical QA pass (copy-diff all pages, brand greps, 390/768/1440 captures)

### Phase 3: Concept B — Full-Screen Video
**Goal**: A visitor experiences a full-bleed video homepage with a clear progressive-reveal mechanism instead of a wall of text, and can click through to focused sub-pages.
**Depends on**: Phase 1
**Requirements**: CONB-01, CONB-02, CONB-03, CONB-04, CONB-05
**Success Criteria** (what must be TRUE):
  1. The homepage hero plays a full-bleed muted ambient video automatically (`autoplay muted playsinline loop`, poster frame, WebM+MP4 sources) sourced from quality stock footage or ComfyUI generation.
  2. Visible, labeled hotspot overlays sit over video regions — no mystery-meat — and each hotspot shows its label on hover and on keyboard focus.
  3. Clicking a hotspot first reveals an inline chapter preview panel, then navigates to the full derived sub-page for that content area.
  4. With `prefers-reduced-motion` set, the homepage renders a static poster frame with standard visible navigation instead of video, and no sound ever autoplays.
  5. The video hero stays within a sane byte budget with poster-frame LCP protection and produces no layout shift when the video loads.
**Plans**: 3 plans

Plans:
- [x] 03-01-PLAN.md — Video hero homepage shell: full-bleed loop (existing encoded assets), minimal top bar, verbatim hero, 6 labeled hotspots, pause/play control, has-js bootstrap (completed 2026-07-24)
- [x] 03-02-PLAN.md — Six statically-authored chapter-panel dialogs + panels.js (open/close/swap/focus-return) + 3 full sub-pages + @view-transition wiring (completed 2026-07-24)
- [ ] 03-03-PLAN.md — Motion polish (@starting-style panels, hero entrance, reduced-motion/visibility/rejection guards) + mechanical QA (copy-diff, brand greps, budget, captures)

### Phase 4: Concept C — Experimental WebGL/3D
**Goal**: A visitor navigates a 3D-space homepage that uses WebGL as the reveal/navigation metaphor while remaining fully usable through standard web conventions, with or without WebGL.
**Depends on**: Phase 1
**Requirements**: CONC-01, CONC-02, CONC-03, CONC-04, CONC-05
**Success Criteria** (what must be TRUE):
  1. The hero/nav zone renders a three.js 3D scene as the spatial navigation metaphor, while content below the fold remains standard performant DOM.
  2. Clickable 3D objects/hotspots show visible hover AND keyboard-focus labels, and activating one (mouse, keyboard, or touch) routes to its derived sub-page.
  3. Scrolling drives camera/scene movement while native scroll physics, the browser back button, and deep links all continue to work normally — no scroll-jacking.
  4. A semantic DOM mirror of the same navigation is keyboard-navigable and screen-reader readable, and is shown outright instead of the 3D scene when WebGL is unavailable or reduced-motion is set.
  5. On lower-tier hardware (integrated GPU / mobile), the scene runs at a clamped, degraded quality tier instead of stalling, crashing, or rendering blank.
**Plans**: 3 plans

Plans:
- [x] 04-01-PLAN.md — "Topic field" 3D homepage core: WebGL2 probe, 6 toon-stepped procedural objects, scroll-driven CatmullRom dolly, DOM-projected labels, topic index, no-webgl/no-JS fallback layout (completed 2026-07-24)
- [x] 04-02-PLAN.md — Below-fold verbatim sections (problems/labs/convert/footer) + 3 sub-pages (interceptos, consolidated work, new insights) + @view-transition and smooth-scroll routing (completed 2026-07-24)
- [x] 04-03-PLAN.md — Reduced-motion frozen scene, focus-visible treatment, device-tier degradation + phase-closing QA (copy-diff all, 8-grep suite, link integrity, 18 reviewed captures) (completed 2026-07-24)

### Phase 5: Concept D — Home Variant (light video + module cards)
**Goal**: A speculative variant of the deployed homepage: sticky nav + logo kept, light-mode UI over a full-screen light motion-graphics video, small enticing cards that expand into modals carrying the complete existing section modules, nav routing to full pages.
**Depends on**: Phase 1 (content), staging bundle (deployed section modules)
**Requirements**: COND-01, COND-02, COND-03, COND-04, COND-05, COND-06, COND-07
**Success Criteria** (what must be TRUE):
  1. The homepage shows the staging bundle's sticky nav/logo over a full-screen light positive motion-graphics video (already sourced at concept-d/assets/video/) in light mode.
  2. Every home-page section module is reachable as a small card that expands into an accessible modal containing the complete module with its deployed design intact.
  3. Nav items route to standalone pages carrying that content; About/Insights link to mirrored deployed pages.
  4. Module copy verifies verbatim against the canonical source (substring mode) and the modules read visually faithful to the deployed sections.
  5. Reduced-motion, no-JS, keyboard, and Esc/focus-return paths all work.
**Plans**: 3 plans

Plans:
- [ ] 05-01-PLAN.md — Port foundation: deployed.css/deployed.js verbatim lift, case-image extraction, script-diff gate, 3 mirrored pages + podcast assets
- [ ] 05-02-PLAN.md — Variant homepage: light video layer, verbatim hero copy, 8 button-cards -> module modals (landmine fixes), clients strip, no-JS/reduced-motion paths
- [ ] 05-03-PLAN.md — Section pages (os/labs/work/contact) + phase QA: link integrity, copy gates, brand greps, reviewed captures, video budget

### Phase 6: Cross-Concept QA & Review Packaging
**Goal**: All three concepts are verified together against brand and copy rules, and Jon can review all three side by side in one place.
**Depends on**: Phase 2, Phase 3, Phase 4
**Requirements**: QA-01, QA-02, QA-03, QA-04
**Success Criteria** (what must be TRUE):
  1. The Fritz brand QA pass confirms all three concepts comply (Flarepop-only colored text, apex-up triangles, mark never decoration, hard-step gradients, no rule lines, banned tagline absent) with no outstanding violations.
  2. The copy-diff gate confirms 100% verbatim match between each concept's rendered text and the canonical content source, for all three concepts.
  3. Each concept renders responsively across mobile/tablet/desktop with acceptable LCP, and each concept has at least 2-3 working derived sub-pages reachable by direct load, click-through, and browser back button.
  4. The repo-root gallery index shows all three concepts side by side with representative captures, ready for Jon's review.
**Plans**: 2 plans

Plans:
- [x] 06-01-PLAN.md — Mechanical cross-concept QA (copy-diff A/B/C 430/340/282 + D substring 71 + script-diff 13, four brand grep suites, token drift, link integrity, camera gate, video budgets) + final four-card Fritz review gallery with real capture thumbnails
- [x] 06-02-PLAN.md — Review packaging: REVIEW.md for Jon + REQUIREMENTS closeout (QA-01 marked only on the orchestrator-run Fritz agent gate 06-FRITZ-QA.md committed between the two waves) (completed 2026-07-24)


### Phase 7: Concept D — Iteration 2 (above-the-fold + work reel + quiet modules)
**Goal**: Jon's iteration direction on the variant: most information above the fold (compact hero + uniform semi-opaque section cards with expand CTAs), a full-screen work-reel section with three case cards, scaling card-to-module transitions into reskinned quieter module windows, FAQs/convert/footer as plain below-fold sections, logos kept in between.
**Depends on**: Phase 5 (Concept D v1)
**Requirements**: ITER-01, ITER-02, ITER-03, ITER-04, ITER-05, ITER-06, ITER-07, ITER-08
**Success Criteria** (what must be TRUE):
  1. At desktop, the first viewport shows the compact hero (reduced headline+blurb) plus the full section-card grid over the video.
  2. Cards are uniform-height, top/bottom aligned with copy anchored bottom, semi-opaque, carry an explicit expand CTA, and have a hover state that echoes the background video.
  3. Clicking a card scales it into a full-viewport modular window whose module content is reskinned quieter (verbatim copy, progressive disclosure, no wall of text).
  4. A full-screen work section follows the hero: the campaign reel (existing encoded asset) plays behind three small case cards using the same card-to-module composition.
  5. FAQs, Start a Conversation, and footer render as plain below-fold sections (not cards/modals); the client logo strip stays in between as before.
**Plans**: 3 plans

Plans:
- [x] 07-01-PLAN.md — Restructure: compact hero, uniform 5-card grid w/ translucency + expand CTAs, work-reel section + case shells, FAQs/convert/footer plain below-fold
- [x] 07-02-PLAN.md — Scaling card-to-window transition (View Transitions + FLIP-on-inner-body fallback, sine 600ms) + quiet reskinned section/case windows from untouched data objects
- [x] 07-03-PLAN.md — Phase QA: copy/brand/link/budget gates, Puppeteer behavior suite + reviewed captures, gallery thumbnail + REVIEW.md refresh (completed 2026-07-25)


### Phase 8: Concept D — Iteration 3 (hero up/bigger, cards to pages, reel v2)
**Goal**: Jon's third round: headline moves up toward the sticky nav and gets bigger; cards navigate to real pages (not modal windows) with a clear way back to the homepage; a more obvious card hover state; the work reel features the weavy.ai SAP brand film.
**Depends on**: Phase 7
**Requirements**: IT3-01, IT3-02, IT3-03, IT3-04
**Success Criteria** (what must be TRUE):
  1. The hero headline sits close under the sticky nav and is visibly larger, with hero + cards still above the fold at 1440×900.
  2. Clicking any card (5 sections + 3 cases) navigates to a standalone quiet page with a clear, consistent way back to the homepage; no module modals remain on the homepage.
  3. Card hover is unmistakably obvious while staying brand-calm.
  4. The work-reel section plays the v2 reel featuring the weavy.ai film excerpts (asset already cut and committed).
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 (Phases 2, 3, 4 depend only on Phase 1 and may be built in parallel; Phase 5 depends on Phase 1 + the staging bundle; Phase 7 depends on Phase 5)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Content Foundation & Shared Brand Layer | 4/4 | Complete    | 2026-07-23 |
| 2. Concept A — Editorial | 3/3 | Complete    | 2026-07-24 |
| 3. Concept B — Full-Screen Video | 3/3 | Complete    | 2026-07-24 |
| 4. Concept C — Experimental WebGL/3D | 4/4 | Complete    | 2026-07-24 |
| 5. Concept D — Home Variant (light video + module cards) | 3/3 | Complete    | 2026-07-24 |
| 6. Cross-Concept QA & Review Packaging | 2/2 | Complete    | 2026-07-24 |
| 7. Concept D — Iteration 2 | 3/3 | Complete    | 2026-07-25 |
