# Phase 3: Concept B — Full-Screen Video - Context

**Gathered:** 2026-07-24 (auto mode — decisions resolved from Jon's brief, features/pitfalls research, and the sourced video asset; orchestrator pre-sourced footage per Jon's "web searches for video content" instruction)
**Status:** Ready for planning

<domain>
## Phase Boundary

Concept B homepage + its derived sub-pages, working locally at `/concept-b/`. Full-bleed ambient video with a progressive-reveal interface: NO wall of text anywhere — the homepage is video + verbatim hero + labeled topic hotspots; clicking a hotspot reveals an inline chapter panel (teaser), and "going deeper" routes to a full sub-page. Consumes ONLY `content/` + `shared/`. Requirements CONB-01..05.

</domain>

<decisions>
## Implementation Decisions

### Video (asset ALREADY SOURCED — do not re-source)
- Files exist at `concept-b/assets/video/`: `hero-loop-1080.webm` (VP9, ~4.9MB, list first), `hero-loop-1080.mp4` (H.264, ~5.9MB), `hero-poster.jpg` (~149KB). Provenance in `concept-b/assets/video/ASSETS.md` (Pexels #29848606, license clean, seamless 24s boomerang loop).
- The footage: slow monochrome black liquid-chrome motion — dark, premium, no competing color; Flarepop overlays own the accent layer.
- `<video autoplay muted playsinline loop preload="metadata" poster=".../hero-poster.jpg">` with WebM source first, MP4 second. `muted` attribute IN MARKUP (not just JS volume) — iOS policy.
- Poster is the LCP element and is also used as the static fallback; the video element is absolutely positioned behind everything with `object-fit: cover`; reserve the full viewport at load (no CLS).
- `prefers-reduced-motion: reduce` → JS never calls play(), CSS shows poster; also pause the video when the tab is hidden (battery). A visible pause/play control on the hero (WCAG 2.2.2).
- No sound exists in the files (audio stripped at encode) — the no-sound rule is structural.

### The reveal mechanism (the concept's defining interaction)
- Homepage viewport = video + minimal top bar (lockup left, convert CTA right) + verbatim hero (`hero.kicker`, `hero.h1_html` with Flarepop em treatment) + **6 labeled topic hotspots** laid out over the video: Problems · InterceptOS · Work · Labs · Insights · Contact (the 6 topics from content/subpages.json).
- Hotspots are REAL `<button>`s in a `<nav>` landmark with visible text labels at all times (no mystery meat, no hover-only affordances — touch works). Visual: mono-font labels with a Flarepop marker/dot, generous hit areas.
- Click/Enter on a hotspot → **inline chapter panel** slides/fades in (sine ease, long duration): shows that topic's teaser refs (from `subpages.json` teaser_refs, verbatim) + ONE clear "open the full page" CTA + a close affordance (Esc works, focus is trapped while open, returns to the hotspot on close).
- Chapter panel is a `<dialog>` or equivalent with proper aria; the video keeps playing behind it, dimmed by a solid translucent scrim — flat overlay, NOT a gradient scrim (no-scrims rule: no gradient overlays; a uniform translucent layer is acceptable and required for text legibility).
- "Open the full page" routes to `concept-b/pages/{topic}.html` (cross-document View Transition cross-fade, same as Concept A, no named morphs).
- NO scroll-jacking: the homepage doesn't need scroll at all (single viewport); if content overflows on small screens it scrolls natively.

### Sub-pages (CONB path of the click-through model)
- Ship 3 full pages: `problems.html`, `interceptos.html`, `work.html` (all 3 cases at full depth on one page — a deliberate contrast with Concept A's per-case split; both prove the model).
- Labs/Insights/Contact hotspots still open chapter panels (teaser refs + external episode links for insights, convert copy for contact) — their "full page" CTA is omitted where no deeper copy exists (Labs) per the Phase 2 routing-map precedent; never a dead link.
- Sub-pages are dark, quiet, typographic — video does NOT continue onto sub-pages (keeps weight down); poster-derived styling only. Persistent way back to the concept homepage.

### Copy discipline
- Same as Concept A: every text node from canonical refs, `data-copy` annotated; `python3 qa/copy-diff.py concept-b/index.html concept-b/pages/*.html` exits 0 as a task verify step.
- Brand greps apply (banned tagline, deprecated hexes, no <hr>/rule-line dividers — including CSS border-top/bottom hairlines, Flarepop-only colored text, no smooth gradients).

### Claude's Discretion
- Hotspot layout geometry (constellation over the liquid vs edge-anchored list) and responsive behavior
- Chapter panel composition details within the rules above
- Whether the hero h1 fades back while a panel is open

</decisions>

<specifics>
## Specific Ideas

- Jon's brief: "full screen video and has a clever way to reveal the content on the page as needed... Clicking on an area of interest will take you to a page with that content."
- The pitfalls research is explicit for this concept: iOS autoplay (muted+playsinline in markup), poster-frame LCP, no autoplay sound, no scroll-jacking, hover-only affordances fail on touch.
- The chapter-panel preview step is the "clever reveal" — progressive disclosure in two steps (teaser panel → full page), so a visitor never commits to a page load to find out what a topic is.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `concept-b/assets/video/*` — the sourced, encoded video assets (see ASSETS.md)
- `content/homepage.json` + `content/subpages.json` — all copy + teaser/full ref splits per topic
- `shared/tokens.css`, `shared/fonts.css`, `shared/motion.css`, `shared/logo/lockup.svg`, `shared/README.md`
- `qa/copy-diff.py` — annotated-mode gate; Concept A pages show the annotation idiom (see concept-a/pages/*.html)
- Concept A's `@view-transition` CSS + motion.js reduced-motion guard idioms are proven — reuse the patterns, NOT the files (concepts stay isolated; copy the idiom into concept-b's own css/js)

### Established Patterns
- Serve via `./serve.sh` :4340; gallery at root links to `/concept-b/`
- Executor QA: copy-diff + brand greps + responsive captures (Puppeteer + installed Chrome + setViewport, NOT bare --window-size)

### Integration Points
- Consumes `content/` + `shared/` only; no references to other concepts
- Phase 5 re-runs all gates across concepts

</code_context>

<deferred>
## Deferred Ideas

- Scroll-scrubbed image-sequence narrative (ENH-02, v2)
- Portal/morph transitions shared with Concept C (ENH-03, v2)
- Multiple video scenes per topic (one ambient loop is v1)

</deferred>

---

*Phase: 03-concept-b-full-screen-video*
*Context gathered: 2026-07-24*
