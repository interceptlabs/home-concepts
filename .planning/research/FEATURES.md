# Feature Research

**Domain:** Modern marketing/consulting-firm homepages — three concepts (editorial "Accenture but better," full-screen video, experimental WebGL/3D)
**Researched:** 2026-07-23
**Confidence:** MEDIUM (Accenture anatomy is HIGH — live WebFetch; trend/example claims are MEDIUM — WebSearch cross-verified across multiple 2025/2026 lists; a few pattern notes are LOW where only one source surfaced)

## Accenture Homepage Anatomy (Concept A Reference — Live Capture)

Fetched directly from https://www.accenture.com/ca-en on 2026-07-23. This is the literal reference Concept A must beat.

**Navigation:** Sticky header, mega-menu with four top buckets ("What we do," "What we think," "Who we are," "Careers"). "What we do" alone spans roughly 19 capability areas and 19 industries — a genuinely huge flyout. Country/language selector, search icon. Social icons (LinkedIn, Facebook, Instagram) live in the header, not the footer.

**Hero:** No video hero. Instead, a rotating **announcement carousel** — cards for things like the "Accenture Edge" mid-market AI launch and "Consumer Pulse" research, each with imagery, a headline, and an "Expand" CTA. It's a content module, not a cinematic moment.

**Content blocks, in order:**
1. 360° Value Report — big headline + short body + "See the report" link
2. Case-study carousel — 4 rotating stories (YMCA, UNICEF, Philipstown, Google Cloud, Bristol Myers Squibb), each "Read more"
3. Awards section — three toggle-able cards (WSJ Top 30, Great Place to Work, Gartner Magic Quadrant) with specific, credible metrics
4. Careers module — image + headline + "Join us"
5. News carousel — play/pause control, 7 recent announcements with dates
6. App download promo (Foresight app, iOS/Android)

**Footer:** Multi-column — Preference Center, Careers, About, Contact, Locations, Sitemap, then a heavy legal stack (Privacy, Terms, Cookie Policy, Accessibility, Modern Slavery Statement). No social icons here (they're in the header).

**Typography/hierarchy:** Large bold headlines on cards, body copy kept to 2-4 lines, generous whitespace between sections, consistent button styling (blue text + arrow) across every CTA type.

**What works:** Case studies name real clients and real outcomes rather than vague claims. The awards section is specific ("No. 4," "highest on Ability to Execute axis") instead of just badge-dropping. Rotating carousels keep the page feeling current without adding scroll length.

**Where it's corporate sludge (the opportunity for "better"):**
- Tagline "Let There Be Change" and headline "Together We Reinvented" are abstract marketing-speak with no concrete referent
- Heavy buzzword density: "reinvention," "human in the lead," "agentic AI," "capability at scale" — words that could belong to any consultancy
- The CEO-quote block reads as generic ("greater technology landscape...") rather than specific
- 19×19 mega-menu is a wall of text disguised as navigation — the exact problem this project exists to solve, just moved into a dropdown instead of the page body
- Generic "Expand" CTA label repeated across unrelated content types flattens what should be distinct actions (read a report vs. read a case study vs. apply for a job)
- A single CTA style, applied everywhere with zero variation in visual weight, means nothing actually looks primary

**Cross-check against other professional-services homepages (Fishtank 2026 comparative review of McKinsey, Deloitte, BCG, Slalom — MEDIUM confidence, single scored article but concrete and specific):**
- **Slalom** scored highest (17/20) for having a clear above-the-fold CTA, client logos/testimonials visible immediately, and explicit industry segmentation
- **McKinsey** pairs a stable customer-outcome headline ("What's your next brilliant move?") with a live "Ask McKinsey" AI chatbot — the only homepage in the set that demonstrates AI rather than just talking about it
- **BCG** uses a self-select dropdown ("How can we assist you today?") — called the most buyer-centric information architecture of the four
- **Deloitte** was marked down for a rotating hero (undermines consistent first impression) and **five competing CTAs with no visual hierarchy**
- Core critique applicable to Concept A: reputation/scale is not a substitute for a legible buyer journey — don't let editorial confidence excuse the absence of a clear primary action per section

## Feature Landscape

### Table Stakes (All Three Concepts)

These are non-negotiable regardless of which concept — missing any of these reads as amateur, not experimental.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Responsive layout (mobile/tablet/desktop) | Baseline expectation for any 2026 marketing site | LOW (A/B) / MEDIUM (C) | Concept C needs device-tiered rendering (canvas resize, DPR scaling, GPU capability checks) |
| Fast/acceptable LCP | Users bounce on slow loads; especially scrutinized on video/3D-heavy sites | LOW (A) / MEDIUM (B) / HIGH (C) | B needs a compressed poster-frame + progressive video load; C needs bundle-size discipline and a low-end-device fallback path |
| Visible, working primary navigation | No mystery-meat nav — explicit project constraint | LOW | Even Concept C's 3D scene needs a persistent, labeled way to reach every section without discovering it by accident |
| One clear primary CTA per section | Deloitte's "5 competing CTAs" problem is the counter-example to avoid | LOW | Visual hierarchy (size/weight/position), not just presence of a button |
| Footer with legal/contact/sitemap | Baseline trust signal, expected by any B2B visitor | LOW | Follow Accenture's structure (Privacy/Terms/Accessibility/Sitemap) minus the sprawl |
| Accessible fallback (keyboard nav, `prefers-reduced-motion`, no sole reliance on hover/gesture) | Explicit project constraint ("UI-convention compliant... accessible fallbacks") | LOW (A) / MEDIUM (B) / HIGH (C) | C requires a semantic DOM mirror of 3D content for screen readers (see Anti-Patterns/PITFALLS) |
| Click-through to derived content pages | Core value prop: click an area of interest → dedicated page with that content | MEDIUM | Requires the content-derivation step (breaking Variant A's copy into per-topic chunks) to happen before any concept's nav can be wired |
| Verbatim copy transcription + QA gate | Copy is immutable per project constraint | LOW (process, not code) | Copy-diff QA gate already exists in this org's workflow |
| Fritz brand QA pass | Explicit project gate before showing Jon | LOW (process) | Flarepop-only colored text, apex-up triangles, no decorative rule lines, no invented marks |
| No sound-on autoplay | WCAG 1.4.2 / basic UX hygiene; autoplay audio is a top user-frustration pattern | LOW | Applies most directly to Concept B's video hero |

### Differentiators — Concept A: "Accenture, but better" (Editorial)

| Feature | Value Proposition | Complexity | Notes / Reference Sites |
|---------|--------------------|------------|--------------------------|
| Oversized editorial type + tight card-grid content blocks | Accenture's structure without the bloat — fewer, better-chosen blocks | MEDIUM | Reference: accenture.com/ca-en (structure), Slalom homepage (CTA clarity), McKinsey (stable outcome-framed headline) |
| Single strong hero statement, one CTA, no rotating-carousel hero | Avoids Deloitte's "rotating hero undermines consistency" critique | LOW | Concrete headline over abstract tagline — no "Let There Be Change"-style vagueness |
| Specific, metric-bearing case-study/work cards | Real client outcomes read as credible; vague claims read as sludge | MEDIUM | Content-dependent — requires real numbers/outcomes pulled from Variant A source copy |
| Toggle/expand trust-signal blocks (awards, credentials) done with restraint | Accenture's toggle-award-card pattern works; keep it, tighten the visual craft | LOW-MEDIUM | Direct refinement of an Accenture pattern that already works |
| Kinetic typography accents (weight shift on scroll/hover, no gratuitous motion) | 2026 trend: "type is no longer static" — differentiates from Accenture's static card headlines | MEDIUM | Verified trend across multiple 2026 trend roundups (Figma, Envato) — apply sparingly per sine-ease-in-out motion constraint |
| Distinct CTA labels per content type (not one generic "Expand" everywhere) | Fixes Accenture's flattened-CTA problem directly | LOW | "Read the case study" / "See the report" / "Explore careers" — each visually and verbally distinct |

### Differentiators — Concept B: Full-Screen Video

| Feature | Value Proposition | Complexity | Notes / Reference Sites |
|---------|--------------------|------------|--------------------------|
| Full-bleed muted ambient video loop as background | Establishes mood/craft immediately without a word of copy | LOW-MEDIUM | Standard technique; must default muted, user-controlled sound if offered at all |
| Clickable hotspot overlays tied to video regions/moments | Lets a visitor click "an area of interest" straight from the video, satisfying the core value prop without any text wall | MEDIUM-HIGH | Pattern proven in enterprise demo tooling (Supademo/Mindstamp/Cinema8) and in agency use (Locomotive's site cited as proof "you don't need walls of text — just precision, emotion, and flow"); build bespoke rather than adopting a SaaS widget |
| Scroll-scrubbed video (frame position tied to scroll position) | Turns passive video into a controlled, chaptered narrative | HIGH | Reference: Four Pillars Studio, Zajno ("Motion") — **implementation note (MEDIUM confidence, technical consensus across sources): use a pre-decoded image-sequence on canvas for scroll-scrub, not a live `<video>` element** — real `<video>` seeking has latency/buffering that makes true frame-accurate scroll-scrub janky; reserve actual `<video>` playback for the ambient background loop only |
| Chaptered structure (scroll = narrative device, each section a distinct "beat": entrance / hold / exit) | Matches how 2026 WebGL/video sites are being built — each section reads as a staged moment | MEDIUM | Cross-verified pattern across multiple three.js/GSAP showcase write-ups |
| Click-to-reveal inline chapter panel before full navigation | Lets a visitor preview a topic without committing to a full page load — genuine progressive disclosure | MEDIUM | Expandable-card pattern (inline vs. overlay expansion) applied to a video chapter context |

### Differentiators — Concept C: Experimental WebGL/3D

| Feature | Value Proposition | Complexity | Notes / Reference Sites |
|---------|--------------------|------------|--------------------------|
| 3D scene as spatial navigation metaphor | Most literal read of the brief ("3D-space mechanism as the navigation/reveal metaphor") | HIGH | Reference: **Hubtown** by Unseen Studio — glowing 3D monolith hero, WebGL + GSAP, cursor-reveal interaction uncovers geometry detail (Awwwards Site of the Day, June 2026); **Lusion** — hero object rendered live in three.js (Awwwards Site of the Month, April 2026); Lusion generally cited as "the most influential WebGL/shader studio working today" |
| Cursor-reactive shader/particle field as hero backdrop | Provides immediate "experimental" signal while staying passive/non-blocking to scroll | MEDIUM-HIGH | Reference: 50k cursor-reactive three.js particles woven into a torus-knot; WebGL2 cursor-reactive "energy-core" shader fields; Gabriel Villanueva's image-to-particle-grid GLSL displacement experiment |
| Scroll-driven camera fly-through of a 3D space | Lets scroll (a familiar gesture) drive spatial navigation instead of scroll-jacking or gesture-only control | HIGH | Reference: a scroll-based 3D experience built with Next.js 15 + React Three Fiber + Theatre.js (Design Awards Winner, October 2025) — proves the scroll-driven-camera approach is current and awarded |
| Clickable 3D objects/hotspots that route to subpages | Direct expression of "click an area of interest → dedicated page" inside a 3D scene | HIGH | Reference: Thibault Introvigne's exploration site — visitor controls a character, clicks collectibles scattered through the scene to surface content (FWA Site of the Day, October 2025) |
| Mandatory accessible DOM fallback / semantic mirror | Required by project constraint ("accessible fallbacks, no mystery-meat navigation") and by WCAG | MEDIUM (but non-negotiable) | Pattern (MEDIUM confidence): `react-three-a11y` makes meshes keyboard-focusable; alternative is a visually-hidden but screen-reader-accessible DOM structure that mirrors the canvas content 1:1 |
| Portal/morph transition from 3D scene into a subpage | Makes the click-through feel continuous with the 3D metaphor rather than a jarring page-load | MEDIUM | Reference pattern: SVG-morph and color-wipe page transitions, cited across multiple 2025 award-winning-transitions roundups |

### Anti-Features (Do Not Build)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|------------------|-------------|
| Scroll-jacking (page overrides native scroll speed/direction across the whole site) | Feels "cinematic," commonly seen on award-site showcases | Breaks the fundamental scroll contract users have relied on for decades; a top-cited UX-mistake pattern that causes disorientation and complaints | Scroll can *drive* an animation or camera position (Concept B/C), but never fully override native scroll physics or trap the user in a section with no visible way out |
| Autoplay video/audio with sound | "Immersive," used in some video-hero showcases | Disrupts task focus, can trigger vestibular/motion discomfort, violates baseline accessibility expectations | Muted-by-default ambient loop only; sound is opt-in and clearly controlled |
| Mystery-meat navigation (icons/3D objects/gestures with no label or discoverable affordance) | Looks clean/minimal in mockups | Users can't predict what will happen before clicking — explicitly called out as a failure mode in the project brief itself | Every clickable region gets a visible label, cursor change, or on-hover caption before commitment; Concept C's 3D objects need on-hover labels, not silent discovery |
| Command-palette-only navigation (Cmd+K as *the* nav) | Trendy in 2026 SaaS UI (Linear, Slack "gold standard") | It's a power-user pattern for repeat users of a product with dozens of destinations; first-time marketing-site visitors have no trained expectation to press Cmd+K, so it fails as a *sole* nav mechanism | If used at all, only as an optional enhancement layered on top of a fully visible primary nav — never the only way to move around |
| 19×19-style mega-menu sprawl (Accenture's full capability/industry grid) | Feels "complete," mirrors the literal reference site | Recreates the exact wall-of-text problem this project exists to solve, just relocated into a dropdown | Curated top-level nav (roughly 5-7 items) with a single "explore everything" link to a full sitemap page for the rare visitor who wants the whole list |
| Competing CTAs with no hierarchy (Deloitte's 5-CTA problem) | Wanting to "cover all bases" per section | Visitors default to inaction when no action is visually primary | One clearly primary CTA per section; secondary actions demoted in weight/position |
| True `<video>`-element scroll-scrubbing for an entire long hero sequence | Seems like the direct way to "scrub video on scroll" | Native video seek latency/buffering makes frame-accurate scroll response janky on real-world connections and devices | Pre-decoded image-sequence on canvas for anything that must scrub frame-accurately with scroll; real `<video>` reserved for looped ambient playback |
| 3D/WebGL applied to every element on the page, not just the hero/nav metaphor | "If some 3D is impressive, more must be more impressive" | Compounds performance cost and accessibility burden across the whole page instead of one contained, fallback-able zone | Concentrate 3D in the hero/nav metaphor; everything below it (cards, footer, subpages) is standard performant DOM |

## Feature Dependencies

```
[Content derivation from Variant A homepage] (cross-cutting, precedes all three concepts)
    └──requires──> [Per-topic content chunks + subpage content model]
                       └──requires──> [Click-through navigation wiring in each concept]

Concept A: [Editorial card grid]
    └──requires──> [Subpage content model]
    └──enhances──> [Toggle/expand trust-signal blocks] (same interaction primitive, different content)

Concept B: [Scroll-scrubbed video]
    └──requires──> [Pre-decoded image-sequence asset pipeline] (not live <video> seeking)
[Clickable video hotspots]
    └──requires──> [Chapter/region-to-subpage content mapping]
[Click-to-reveal inline chapter panel]
    └──enhances──> [Clickable video hotspots] (adds a preview step before full navigation)

Concept C: [3D scene as nav metaphor]
    └──requires──> [Accessible DOM fallback / semantic mirror] (must exist BEFORE or alongside the 3D layer, not bolted on after)
[Clickable 3D hotspot objects]
    └──requires──> [3D scene as nav metaphor]
    └──requires──> [On-hover/on-focus visible labels] (prevents mystery-meat nav)
[Scroll-driven camera fly-through]
    └──conflicts──> [Full page scroll-jacking] (camera should respond to scroll, but native scroll/back-button behavior must remain intact)
[Portal/morph page transition]
    └──enhances──> [Clickable 3D hotspot objects] and [Clickable video hotspots] (same transition primitive reused across B and C)
```

### Dependency Notes

- **All three concepts require content derivation first:** none of the click-through navigation (the whole point of the brief) can be wired until Variant A's homepage copy has been broken into per-topic chunks and mapped to subpages. This is the actual first phase regardless of which concept ships first.
- **Concept C's accessible fallback must be built alongside, not after, the 3D layer:** retrofitting accessibility onto a finished WebGL scene is significantly harder than building the semantic DOM mirror as the scene is constructed — this should be sequenced as parallel work, not a final QA pass.
- **Scroll-driven camera movement conflicts with scroll-jacking:** the fly-through pattern (R3F + Theatre.js example) ties camera position to scroll offset, but critically preserves the browser's native scroll/back-button semantics — it must not be built as a full scroll-override.
- **Portal transitions are a shared primitive across B and C:** the same SVG-morph/color-wipe transition technique that makes a 3D-object click feel continuous also works for a video-hotspot click — build it once, reuse across both concepts.

## MVP Definition

### Launch With (v1) — presentable to Jon for side-by-side review

- [ ] All three homepages responsive and running from a local server — required for the side-by-side comparison deliverable
- [ ] Each concept's single defining interaction working end-to-end: A's editorial card grid, B's video + hotspot reveal, C's 3D scene + clickable hotspots
- [ ] 2-3 derived click-through subpages per concept (not the full content set) — enough to prove the "click area of interest → dedicated page" model
- [ ] Accessible fallback present in each concept (keyboard nav, reduced-motion respected, no mystery-meat nav)
- [ ] Fritz brand QA pass on all three
- [ ] Copy-diff QA pass confirming verbatim transcription

### Add After Validation (v1.x)

- [ ] Full set of derived subpages covering all of Variant A's original content areas — once the click-through model itself is validated as the right approach
- [ ] Additional micro-interaction polish (hover states, kinetic type accents in A; additional hotspot regions in B; additional 3D-scene detail in C)
- [ ] Performance pass: video/image compression, WebGL bundle-size trimming, device-tiered rendering for low-end hardware

### Future Consideration (v2+)

- [ ] CMS/backend integration — explicitly out of scope for this milestone
- [ ] Command-palette power-user nav layer — only if a validated need for repeat-visitor power navigation emerges (unlikely for a marketing homepage, per the anti-features analysis above)
- [ ] Production deployment — gated entirely on Jon's explicit go via intercept-deploy MCP; not part of this concept-building phase

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Content derivation / subpage model (cross-cutting) | HIGH | MEDIUM | P1 |
| Concept A: editorial card grid + single-CTA hero | HIGH | MEDIUM | P1 |
| Concept B: muted ambient video hero | HIGH | LOW-MEDIUM | P1 |
| Concept B: clickable video hotspots | HIGH | MEDIUM-HIGH | P1 |
| Concept B: true scroll-scrubbed frame-accurate video | MEDIUM | HIGH | P2 |
| Concept C: 3D scene as nav metaphor + hotspots | HIGH | HIGH | P1 |
| Concept C: accessible DOM fallback | HIGH | MEDIUM | P1 (non-negotiable, not deferrable) |
| Concept C: cursor-reactive particle/shader hero | MEDIUM | MEDIUM-HIGH | P2 |
| Portal/morph page transitions (B & C shared) | MEDIUM | MEDIUM | P2 |
| Kinetic typography accents (A) | MEDIUM | MEDIUM | P2 |
| Command-palette nav enhancement | LOW (for this use case) | MEDIUM | P3 |

**Priority key:**
- P1: Must have for the side-by-side review deliverable
- P2: Should have, adds craft/polish once P1 is solid
- P3: Nice to have, likely out of scope for this milestone

## Competitor / Reference Feature Analysis

| Feature Area | Accenture (ca-en) | Slalom / McKinsey / BCG (Fishtank 2026 review) | Our Approach |
|---------------|--------------------|-----------------------------------------------|--------------|
| Hero | Rotating announcement carousel, no video | McKinsey: stable outcome-framed headline; BCG: self-select dropdown | Concept-specific hero (editorial / video / 3D), but always ONE primary message + ONE primary CTA |
| CTA strategy | Single generic "Expand" label reused everywhere | Slalom: clear above-fold CTA; Deloitte: 5 competing CTAs (flagged as a weakness) | Distinct, specific CTA copy per content type; one visually primary per section |
| Navigation breadth | 19×19 mega-menu | Not detailed in source, but implied simpler | Curated 5-7 top-level items + single "explore all" link |
| Trust signals | Toggle-able award cards with specific metrics | Slalom: client logos/testimonials above the fold | Keep Accenture's toggle pattern (it works), tighten craft, ensure metrics are specific |
| AI/innovation signaling | Mentioned but not demonstrated | McKinsey: live "Ask McKinsey" chatbot (only live AI feature across the 4 firms reviewed) | Not in scope for this milestone, but a reminder that *showing* over *narrating* is the credible move if this ever comes up |

## Sources

- Accenture homepage — live WebFetch capture, https://www.accenture.com/ca-en (2026-07-23) — HIGH confidence, primary source
- Fishtank, "Best Websites in Professional Services: Who's Setting the Digital Standard? (2026)" — https://www.getfishtank.com/insights/best-professional-services-websites-2026 — MEDIUM confidence
- Awwwards Sites of the Day / Horizontal Layout collections — https://www.awwwards.com/websites/sites-of-the-day/ , https://www.awwwards.com/websites/horizontal-layout/ — MEDIUM confidence
- Scrollytelling examples index — https://scrollytelling.ai/examples/ — MEDIUM confidence
- HTMLBurger, "18 Best Scrolling Websites to See in 2025/2026" — https://htmlburger.com/blog/best-scrolling-websites/ — MEDIUM confidence
- Figma, "Top Web Design Trends for 2026" — https://www.figma.com/resource-library/web-design-trends/ — MEDIUM confidence
- Envato Elements, "Web design trends for 2026" — https://elements.envato.com/learn/web-design-trends — MEDIUM confidence
- Orpetron, "10 Award-Winning Websites Pushing Boundaries with Three.js" — https://orpetron.com/blog/10-award-winning-websites-pushing-boundaries-with-three-js/ — MEDIUM confidence
- Orpetron, "10 Award-Winning Websites Mastering the Art of Page Transitions" — https://orpetron.com/blog/10-award-winning-websites-mastering-the-art-of-page-transitions/ — MEDIUM confidence
- Utsubo, "Best Three.js Websites 2026: 8 Sites + Techniques" — https://www.utsubo.com/blog/best-threejs-websites-2026 — MEDIUM confidence
- WebDesignAwards.io, Three.js technology nominees — https://www.webdesignawards.io/technology/three-js — MEDIUM confidence
- Awwwards, Lusion / Lusion v3 / Unseen Studio profiles — https://www.awwwards.com/sites/lusion , https://www.awwwards.com/sites/lusion-v3 , https://www.awwwards.com/unseenstudio/ — MEDIUM confidence
- WebGPU.com showcase, cursor-reactive particle field examples — https://www.webgpu.com/showcase/particles-cursor-image-shader-field/ — LOW-MEDIUM confidence
- Web Designer Depot, "How Scrolljacking Breaks UX Fundamentals" — https://webdesignerdepot.com/how-scrolljacking-breaks-ux-fundamentals/ — MEDIUM confidence
- Anneka Goss, "Accessible WebGL" (Medium) — https://annekagoss.medium.com/accessible-webgl-43d15f9caa21 — MEDIUM confidence
- Pip Lev, "Three.js & Accessibility" (Medium) — https://medium.com/@piplev/three-js-accessibility-c4f45d83f2c6 — MEDIUM confidence
- A11Y Collective, "How to Create Engaging and Accessible WCAG-Compliant Animations" — https://www.a11y-collective.com/blog/wcag-animation/ — MEDIUM confidence
- Design Shack, "10 UI Patterns That Users Still Love in 2026" (command-palette pattern context) — https://designshack.net/articles/ux-design/best-ui-patterns/ — LOW-MEDIUM confidence (SaaS-context pattern, applied here by analogy, not direct precedent)

---
*Feature research for: marketing-agency homepage concepts (editorial / video / WebGL-3D)*
*Researched: 2026-07-23*
