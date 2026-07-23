# Project Research Summary

**Project:** Intercept Homepage Concepts
**Domain:** Marketing-agency homepage prototypes — three parallel static concepts (editorial/Accenture-style, full-screen video, experimental WebGL/3D), no-build HTML/CSS/JS, Fritz brand system
**Researched:** 2026-07-23
**Confidence:** HIGH

## Executive Summary

This is a "build three competing homepage concepts, review side by side" project, not a product build — three structurally unrelated static front ends (editorial card-grid, full-screen video with progressive reveal, experimental WebGL/3D navigation) fed from one frozen, verbatim content source and wearing one shared Fritz brand skin. Experts building this class of site in 2026 lean almost entirely on native browser platform features rather than frameworks: import maps + CDN-pinned three.js/GSAP for choreography, native `<video muted playsinline autoplay loop>` for background video, CSS scroll-driven animations with Intersection Observer fallback for reveals, and the native View Transitions API for the click-through "card → dedicated page" navigation pattern all three concepts share. No bundler, no framework, no backend is needed or justified — this matches the project's own "no build step unless clearly justified" constraint and is consistent with how this account already ships static Fritz-branded work.

The recommended approach is a **content-to-presentation fan-out architecture**: one canonical, verbatim, copy-diff-verified `content/homepage.json` (captured once from the live interceptgroup.com Variant A homepage) feeds three fully isolated concept directories that share only brand tokens/fonts/logo — never layout, never a component library. This is deliberate: sharing more than brand invariants would flatten three genuinely different structural ideas into one skin-swapped template, defeating the point of a comparative review. Each concept's click-through sub-pages derive from the same JSON chunks the homepage teasers use (summary on the homepage, fuller chunk on the sub-page), which is what actually delivers the core value proposition — no wall of text, click an area of interest, land on focused content.

The main risks cluster into three concept-specific categories plus one cross-cutting one. Concept B (video) risks iOS/Safari autoplay silent failure and LCP/CLS damage from unoptimized hero video — both fixed by disciplined `muted playsinline autoplay loop poster` markup, compressed dual-format sources, and `preload="metadata"`. Concept C (WebGL) risks a performance cliff on integrated-GPU/mobile hardware, a blank page when WebGL is unavailable, and canvas content that's invisible to screen readers/crawlers/no-JS visitors — all three require building the accessible DOM layer and device-tiered rendering *alongside* the 3D scene, not as a QA afterthought. The cross-cutting risk that touches all three concepts and is the single most process-relevant finding: with three teams-of-one building independently from the same source, copy verbatim drift and Fritz brand-token drift are likely unless a single canonical content file and a single shared token file exist before any concept-specific work starts, backed by an automated copy-diff gate. Scroll-jacking and hover-only ("mystery-meat") affordances are the other cross-cutting UX trap — both concept B and C's "clever reveal mechanisms" must remain scroll-input-respecting and touch-equivalent from day one, not retrofitted.

## Key Findings

### Recommended Stack

The stack is deliberately platform-first and CDN-based, with zero bundler across all three concepts. A single foundation (plain HTML5/CSS3/ES modules + import maps + a trivial static file server) underlies everything; each concept then adds only what its specific mechanism needs. Concept A layers hand-authored CSS design tokens, CSS scroll-driven animations (with Intersection Observer fallback for Firefox's partial support), and — only where CSS can't express the choreography — GSAP 3.15 (now 100% free, including ScrollTrigger/SplitText, since the Webflow acquisition). Concept B is native `<video>` with dual WebM/MP4 sources, `ffmpeg`-based compression, and Intersection Observer-gated lazy reveal of secondary content — explicitly NOT a JS video-player library. Concept C is vanilla three.js r185 (0.185.x) via CDN + import map — explicitly not react-three-fiber, which would force React into a project scoped as build-step-free — with CSS 3D transforms as a documented lighter fallback and Spline's `<spline-viewer>` web component as an optional path if the 3D content is better designer-authored than hand-coded. A shared mechanism across all three — the View Transitions API (same-document and cross-document) — is the single most load-bearing pick: it delivers native "click a card → morph into its dedicated page" navigation with a few lines of CSS, no JS routing library, working in all three engines by mid-2026.

**Core technologies:**
- Native ES modules + import maps (Safari 16.4+/Chrome 89+/Firefox 108+): load three.js/GSAP/Lenis from CDN with zero bundler — matches the no-build constraint exactly
- GSAP 3.15.x (core + ScrollTrigger + SplitText, CDN, 100% free): only used where CSS scroll-driven animation can't express the choreography (pinning, scrub, cross-browser parity now)
- three.js r185 (vanilla, WebGL2 default target, WebGPURenderer available with fallback): sole Concept C rendering engine, ~168kB gzipped core, most documented option in the space
- View Transitions API (native, cross-document support in Chrome 126+/Safari 18.2+/Firefox 144+): the shared navigation primitive for all three concepts' "click → dedicated page" interaction
- Native `<video muted playsinline autoplay loop poster>` + dual WebM/MP4 sources: Concept B's entire video foundation, no JS player library needed

### Expected Features

Research confirms the brief's instinct that Accenture-class homepages have real structural strengths (specific, metric-bearing case studies; a working toggle-award-card trust pattern) alongside real, fixable weaknesses (19×19 mega-menu sprawl, one generic "Expand" CTA reused everywhere flattening distinct actions, abstract taglines with no concrete referent). A cross-check against McKinsey/BCG/Slalom/Deloitte homepages (Fishtank 2026 review) reinforces that reputation alone doesn't substitute for a legible, single-primary-CTA-per-section buyer journey — Deloitte's "5 competing CTAs" is the explicit anti-pattern to avoid across all three concepts.

**Must have (table stakes, all three concepts):**
- Responsive layout, fast/acceptable LCP, visible working primary nav (no mystery-meat), one clear primary CTA per section, footer with legal/contact/sitemap
- Accessible fallback (keyboard nav, `prefers-reduced-motion`, no sole reliance on hover/gesture) — Concept C needs a full semantic DOM mirror, not just a checkbox
- Click-through to derived content pages (the core value prop), verbatim copy transcription + copy-diff QA gate, Fritz brand QA pass, no sound-on-autoplay

**Should have (differentiators):**
- Concept A: single strong hero statement (no rotating carousel, no vague tagline), specific metric-bearing case-study cards, distinct CTA labels per content type, restrained kinetic type accents
- Concept B: full-bleed muted ambient video loop, clickable hotspot overlays tied to video regions, chaptered scroll-as-narrative structure, click-to-reveal inline chapter panel before full navigation
- Concept C: 3D scene as spatial nav metaphor, cursor-reactive shader/particle hero, scroll-driven camera fly-through (input-respecting, not scroll-jacked), clickable 3D hotspots routing to subpages, portal/morph transition into subpages

**Defer (v2+):**
- Full set of derived subpages covering all of Variant A's content (v1 needs only 2-3 per concept to prove the model), additional micro-interaction polish, command-palette power-user nav, CMS/backend integration, production deployment (gated on Jon's explicit go via intercept-deploy MCP)

### Architecture Approach

This is a content-to-presentation fan-out, not an application: one canonical, frozen `content/homepage.json` (captured once from the live site, verbatim, copy-diff verified) and one shared brand layer (`shared/tokens.css`, fonts, logo — mirrored from the Fritz Brand OS source of truth, never re-derived) feed three fully isolated concept directories. Concepts never reference each other's CSS/JS/assets; the only shared dependencies are `content/` and `shared/`. Sub-pages within a concept are assembled via a marker-based (not line-number-based) splicer reusing the account's proven `intercept-website-staging` pattern.

**Major components:**
1. `content/homepage.json` + `SOURCE.md` — the single canonical, verbatim, chunked copy source; everything else reads from it, nothing writes back
2. `shared/` (tokens.css, fonts, logo, motion.css) — Fritz Brand OS invariants mirrored in, never forked or hand-retyped locally
3. `concept-a/`, `concept-b/`, `concept-c/` — three self-contained, independently deletable units, each with its own `index.html`, `styles.css`, `script.js`, `pages/`, and concept-local `assets/`
4. `qa/copy-diff.py` + Fritz `check.py`/`layout.mjs` — blocking verification gates run per concept before anything is shown to Jon
5. Repo-root `index.html` gallery + a single local static server — the side-by-side review delivery mechanism

### Critical Pitfalls

1. **iOS/Safari autoplay silent failure (Concept B)** — the hero video shows a black/frozen frame on iPhone because `muted` wasn't set as a real attribute or `playsinline` was missing; must be tested on an actual iOS device, not just Chrome DevTools emulation.
2. **WebGL performance cliff + missing WebGL-unavailable fallback (Concept C)** — a scene tuned only on a discrete-GPU dev machine collapses to single-digit FPS on integrated GPUs/mid-range mobile, and renders a blank canvas entirely if WebGL is disabled/blocklisted; device-tiered quality and feature-detected HTML fallback must be build requirements, not polish.
3. **Canvas content invisible to screen readers/SEO/no-JS (Concept C)** — if the only content is inside `<canvas>`, screen readers, crawlers, and no-JS visitors get nothing; a semantic DOM mirror must be built alongside the 3D layer, not retrofitted after.
4. **Scroll-jacking and hover-only "mystery-meat" affordances (Concept B/C)** — hijacking scroll input or hiding interactive hotspots behind hover-only states breaks the scroll contract, risks vestibular discomfort, and fails entirely on touch devices with no hover state; reveals must be scroll-position-aware (not scroll-hijacked) and touch-equivalent from the start.
5. **Copy verbatim drift + Fritz brand-token drift across three parallel builds (cross-cutting)** — three independently-built concepts create natural pressure to "smooth" a headline or eyeball a brand value per concept; must be prevented mechanically via one canonical content JSON + one shared token file + an automated copy-diff gate, not by vigilance alone.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Content Foundation & Shared Brand Layer
**Rationale:** Every downstream phase (all three concepts' navigation, copy, and brand compliance) depends on this existing first — research is unanimous that content/token drift across three parallel builds is only preventable if the canonical source exists *before* any concept-specific work starts, not as cleanup after.
**Delivers:** `content/homepage.json` (verbatim, chunked, copy-diff-verified against the live site) + `content/SOURCE.md` provenance note; `shared/tokens.css`, fonts, logo mirrored from the Fritz Brand OS source of truth; `qa/copy-diff.py` gate script; repo skeleton (`concept-a/`, `concept-b/`, `concept-c/`, `assets/sourced-video/`, `assets/comfyui/`) and the local static server / gallery shell.
**Addresses:** Copy-immutability and Fritz-brand-QA table stakes (FEATURES.md); the content-derivation dependency that gates all three concepts' click-through navigation (FEATURES.md dependency graph).
**Avoids:** Pitfall 11 (copy verbatim drift & brand drift across three parallel concepts) — the single cross-cutting pitfall that can only be prevented at this stage, not fixed cheaply later.

### Phase 2: Concept A — Editorial ("Accenture, but better")
**Rationale:** Lowest technical risk of the three (no video encoding pipeline, no WebGL performance/accessibility surface) and the most directly informed by a concrete, already-captured reference (live Accenture homepage anatomy) — good to build first to validate the content-fan-out + click-through pattern end-to-end before tackling the higher-risk concepts.
**Delivers:** Editorial card-grid homepage with a single strong hero statement + one primary CTA, specific metric-bearing case-study cards, restrained toggle/expand trust blocks, 2-3 click-through subpages, fluid `clamp()`-based type tested against real transcribed copy at mobile breakpoints.
**Uses:** Hand-authored CSS design tokens, CSS Grid, CSS scroll-driven animations with Intersection Observer fallback, View Transitions API for card-to-page navigation, GSAP/SplitText only if CSS can't express a specific choreography (STACK.md).
**Implements:** The Pattern-1/Pattern-3 architecture (canonical content + copy-diff, concept isolation) end-to-end for the first time, proving the mechanism before Concepts B/C reuse it.
**Avoids:** Pitfall 9 (editorial imitation ships the reference site's weaknesses — fixed-px headlines and lorem-ipsum-only card review); Deloitte's competing-CTA anti-pattern (FEATURES.md).

### Phase 3: Concept B — Full-Screen Video
**Rationale:** Second in sequence because its risk surface (video encoding/compression pipeline, iOS autoplay policy, LCP/CLS) is self-contained and well-documented, but distinct enough from Concept A's risk profile to warrant its own phase; also validates the "pre-decoded image-sequence vs. live `<video>`-seek" architectural decision before Concept C's higher-stakes 3D work begins.
**Delivers:** Full-bleed muted ambient video hero (`muted playsinline autoplay loop poster`, dual WebM/MP4 sources, compressed via ffmpeg), clickable hotspot overlays tied to video regions/moments, `prefers-reduced-motion` static-poster fallback, 2-3 click-through subpages via the shared View Transitions mechanism.
**Uses:** Native `<video>` foundation, Pexels/Coverr/Mixkit-sourced or ComfyUI-generated footage, Intersection Observer-gated lazy reveal for any below-the-fold video content (STACK.md).
**Implements:** Concept-local `assets/video/` isolation (Architecture Pattern 3) and the "raw sourced media stays in root `assets/sourced-video/` until compressed" staging-pool convention.
**Avoids:** Pitfall 1 (iOS/Safari autoplay silent failure), Pitfall 2 (video bloat/missing poster/LCP-CLS damage), Pitfall 3 (no reduced-motion/battery-aware fallback), and the Fritz "no gradients = hard-edged steps" conflict with gradient-scrim-over-video text treatments (PITFALLS.md UX table).

### Phase 4: Concept C — Experimental WebGL/3D
**Rationale:** Sequenced last because it carries the highest implementation risk (HIGH complexity across nearly every feature in FEATURES.md's prioritization matrix) and the most build-alongside (not bolt-on-after) accessibility requirement of the three — building it last means the content-fan-out and click-through mechanisms are already proven twice over by Concepts A and B, isolating what's genuinely new risk to this phase alone.
**Delivers:** Vanilla three.js scene as the spatial navigation/reveal metaphor with clickable hotspot objects, an accessible DOM fallback/semantic mirror built alongside (not after) the 3D layer, device-tiered rendering (capped DPR, reduced geometry/particle counts on detected low-tier hardware), a genuine non-WebGL HTML fallback path, 2-3 click-through subpages reachable identically whether WebGL is available or not.
**Uses:** three.js r185 via CDN + import map (vendor-pinned before handoff), Raycaster + DOM overlay for hit-testing, CSS 3D transforms as documented fallback if the WebGL build proves too fragile for prototype timelines (STACK.md).
**Implements:** Anti-Pattern 3's explicit sequencing rule (build the DOM-based accessible structure first, layer WebGL on top) and the "concentrate 3D in the hero/nav metaphor only" anti-feature boundary (FEATURES.md Anti-Features table).
**Avoids:** Pitfall 4 (WebGL performance cliff), Pitfall 5 (missing WebGL-unavailable fallback), Pitfall 6 (scroll-jacking/forced camera motion), Pitfall 7 (mystery-meat/hover-only hotspots failing on touch), Pitfall 8 (canvas content invisible to screen readers/SEO).

### Phase 5: Cross-Concept QA & Side-by-Side Review Packaging
**Rationale:** All three concepts individually pass their own Fritz QA gate, but research flags brand/copy drift as only reliably caught by a final cross-concept pass (each concept can "look Fritz" alone yet diverge from the others and from the Figma SSoT); this is also when the direct-load/back-button integrity of every derived page across all three concepts gets verified together.
**Delivers:** Final copy-diff pass across all three concepts against the one canonical source; cross-concept brand-token spot-check (hex values, type scale, motion easing) against the Figma SSoT; direct-load + back-navigation test of every derived subpage; repo-root gallery index wired to all three; device pass (integrated-GPU laptop + mid-range Android + real iOS Safari) across all three concepts.
**Addresses:** The full "Looks Done But Isn't" checklist (PITFALLS.md) as a single explicit gate rather than scattered per-concept judgment calls.

### Phase Ordering Rationale

- Content/brand foundation must exist before any concept work, because drift prevention (Pitfall 11) is mechanically impossible to bolt on after three concepts have already diverged — this is the one ordering constraint every research file agrees on independently.
- Concepts are sequenced roughly by ascending implementation risk (A: low, B: medium/self-contained, C: high/cross-cutting-accessibility) so that the content-fan-out and click-through navigation patterns are validated on the cheapest concept first, and the riskiest concept (C) benefits from two prior working reference implementations of the shared mechanisms (View Transitions, copy-diff gate, marker-based subpage assembly).
- A final cross-concept QA phase is separated out rather than folded into each concept's own build phase, because several pitfalls (brand-token drift, broken deep links) are specifically the kind that only surface when reviewed *together*, not in isolation.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Concept B):** the scroll-scrubbed-video vs. ambient-loop distinction (image-sequence-on-canvas vs. live `<video>` seeking) needs a planning-time decision on which chaptered/hotspot mechanism to actually build — STACK.md and FEATURES.md both flag this as the highest-uncertainty implementation choice within the concept.
- **Phase 4 (Concept C):** the specific 3D interaction mechanism (orbit/fly-through camera vs. click-to-navigate object scene vs. Spline-authored scene) is still an open design choice with meaningfully different accessibility/performance implications per option — worth a `/gsd:research-phase` or at minimum a `/gsd:discuss-phase` pass before implementation to settle scroll-vs-click interaction model (Pitfall 6 explicitly recommends settling this in discuss-phase, not discovering it mid-build).

Phases with standard patterns (skip research-phase):
- **Phase 1 (Content Foundation):** directly reuses this account's own proven `intercept-website-staging` and `.fritz/qa` patterns — no new research needed, just execution.
- **Phase 2 (Concept A):** editorial card-grid + CSS scroll-driven reveal + View Transitions is a well-documented, current-browser-support pattern with a concrete reference (live Accenture capture) already in hand.
- **Phase 5 (Cross-Concept QA):** reuses existing Fritz QA gate tooling (`check.py`, `layout.mjs`) and the copy-diff script built in Phase 1 — no new tooling required.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Versions/support verified via direct WebSearch across multiple current, mostly first-party sources (MDN, Chrome for Developers, gsap.com, three.js GitHub releases); no Context7 library IDs applicable since these are browser-platform/CDN libraries, not npm-doc-driven. |
| Features | MEDIUM | Accenture anatomy section is HIGH confidence (live WebFetch capture of the actual reference site); broader trend/example claims (Awwwards showcases, 2026 trend roundups) are MEDIUM — cross-verified across 3+ independent sources but remain third-party blog/aggregator analysis rather than primary vendor documentation. |
| Architecture | HIGH | Grounded directly in this account's own proven prior art (`intercept-website-staging`, `.fritz/qa` gates, `intercept-brand-kit/tokens.css`) rather than external inference; the WebGL/video-hero-specific recommendations are MEDIUM confidence external sources but consistent across multiple practitioner sources. |
| Pitfalls | MEDIUM-HIGH | Individual pitfalls each cite 2-3 independent, mostly current (2025-2026) sources (WebKit, Mux, web.dev, three.js community forum); this is standard-web-platform-pitfall research, not niche-domain research, so consensus is strong. |

**Overall confidence:** HIGH

### Gaps to Address

- Concept B's exact "clever progressive-reveal mechanism" (scroll-scrubbed chaptered video vs. simple ambient loop + hotspot overlay vs. click-to-reveal inline panel) is described as several viable options in FEATURES.md rather than a single settled design — this needs to be decided during Phase 3 planning/discuss-phase, not assumed from research alone.
- Concept C's specific 3D interaction metaphor (orbit-and-click object scene, scroll-driven camera fly-through, or Spline-authored scene) is likewise presented as multiple valid reference patterns (Hubtown, Lusion, R3F+Theatre.js fly-through, Thibault Introvigne's clickable-collectibles scene) rather than one recommendation — settle this explicitly in Phase 4 discuss-phase given how much downstream accessibility/performance work depends on which one is chosen.
- Video/asset licensing verification (Pexels/Coverr/Mixkit license pages) was cross-checked via aggregator sources rather than fetched directly from each site's own current ToS page — low-risk given the project's non-commercial prototype status, but worth a direct confirmation before any asset is used past the review stage.
- No stakeholder-device inventory exists yet for the "test on an actual integrated-GPU laptop and mid-range Android phone" requirement (Concept C) — flag this as a concrete task in Phase 4 rather than an assumed capability.

## Sources

### Primary (HIGH confidence)
- [Webflow: GSAP becomes free](https://webflow.com/updates/gsap-becomes-free) / [gsap.com/pricing](https://gsap.com/pricing/) — current GSAP licensing
- [three.js GitHub releases](https://github.com/mrdoob/three.js/releases) / [npm three](https://www.npmjs.com/package/three) — r185/0.185.1 confirmed current
- [MDN: CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations) / [MDN: View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [Chrome for Developers: Autoplay policy](https://developer.chrome.com/blog/autoplay) / [WebKit: New `<video>` Policies for iOS](https://webkit.org/blog/6784/new-video-policies-for-ios/)
- Accenture homepage — live WebFetch capture, https://www.accenture.com/ca-en (2026-07-23)
- Internal precedent: `~/Creative-Projects/intercept-website-staging/`, `~/Creative-Projects/intercept-brand-kit/tokens.css` + `.fritz/qa/check.py` + `.fritz/qa/layout.mjs`

### Secondary (MEDIUM confidence)
- Fishtank, "Best Websites in Professional Services 2026" — McKinsey/BCG/Slalom/Deloitte comparative anatomy
- Awwwards Sites of the Day/Month (Lusion, Unseen Studio's Hubtown) — current award-winning three.js/WebGL reference sites
- [Aaron T. Grogg: Improving LCP for Video Hero Components (2026)](https://aarontgrogg.com/blog/2026/01/06/improving-lcp-for-video-hero-components/), [Mux 2025 video guide](https://www.mux.com/articles/best-practices-for-video-playback-a-complete-guide-2025)
- [AppScale: Three.js in Production 2026](https://appscale.blog/en/blog/threejs-production-3d-web-2026-webgpu-realtime-standards), [Utsubo: 100 Three.js Tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- [three.js forum — Accessibility for 3D websites](https://discourse.threejs.org/t/accessibility-for-3d-websites/87092)
- [Web Designer Depot: How Scrolljacking Breaks UX Fundamentals](https://webdesignerdepot.com/how-scrolljacking-breaks-ux-fundamentals/), [Wikipedia: Mystery meat navigation](https://en.wikipedia.org/wiki/Mystery_meat_navigation)

### Tertiary (LOW confidence)
- Pexels/Coverr/Mixkit license terms — verified via multiple independent aggregator sources, not fetched directly from each site's own ToS page in this pass; re-verify before any asset outlives the prototype stage
- [WebGPU.com showcase, cursor-reactive particle field examples](https://www.webgpu.com/showcase/particles-cursor-image-shader-field/) — single-source example, illustrative only
- [Design Shack: 10 UI Patterns That Users Still Love in 2026](https://designshack.net/articles/ux-design/best-ui-patterns/) — command-palette pattern applied by analogy from a SaaS context, not direct marketing-homepage precedent

---
*Research completed: 2026-07-23*
*Ready for roadmap: yes*
