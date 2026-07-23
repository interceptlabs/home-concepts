# Architecture Research

**Domain:** Multi-concept static marketing-homepage prototype repo (3 independent homepages + derived click-through pages, Fritz-branded, no backend)
**Researched:** 2026-07-23
**Confidence:** HIGH (structure/content-pipeline recommendations grounded in this codebase's own proven prior art — `intercept-website-staging`, `/fritzweb`, `.fritz` QA gates); MEDIUM (WebGL/video-hero specifics, verified against current external sources, listed below)

## Standard Architecture

This is not an app with a backend — it's a **content-to-presentation fan-out**: one verbatim content source feeds three structurally unrelated static front ends, all wearing the same brand skin, all servable from one static file server.

### System Overview

```
┌───────────────────────────────────────────────────────────────────────┐
│  SOURCE (read once, verified, then frozen)                            │
│  live interceptgroup.com (Variant A) ──extract+verbatim-transcribe──▶ │
│  content/homepage.json  (chunked: hero/clients/problems/os/agents/    │
│                          work/labs/insights/faqs/convert)             │
├───────────────────────────────────────────────────────────────────────┤
│  SHARED BRAND LAYER (identical across all 3 concepts, never forked)   │
│  shared/tokens.css   shared/fonts/*.woff2   shared/logo/*.svg         │
├────────────────┬──────────────────┬──────────────────┬───────────────┤
│  CONCEPT A      │  CONCEPT B       │  CONCEPT C        │  (independent,│
│  editorial/     │  full-video/     │  webgl/            │   isolated)  │
│  index.html     │  index.html      │  index.html        │              │
│  styles.css     │  styles.css      │  styles.css        │              │
│  script.js      │  script.js       │  script.js         │              │
│  pages/*.html   │  pages/*.html    │  pages/*.html      │              │
│  assets/ (own)  │  assets/video/   │  vendor/three.js   │              │
│                 │                  │  assets/ (rare)    │              │
├────────────────┴──────────────────┴──────────────────┴───────────────┤
│  VERIFICATION (blocking, run before anything is shown to Jon)         │
│  qa/copy-diff.py (text vs homepage.json) · Fritz check.py/layout.mjs  │
├───────────────────────────────────────────────────────────────────────┤
│  DELIVERY                                                              │
│  index.html (repo-root gallery, links to all 3) + one static server   │
└───────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|-------------------------|
| `content/homepage.json` | Single canonical, verbatim, chunked copy of the live homepage — the only place copy is "typed in" | Hand-verified JSON, one key per homepage section (matches the live Variant A section ids: `clients`, `problems`, `os`, `agents`, `work`, `labs`, `insights`, `faqs`, `convert`), plus a `SOURCE.md` provenance note (URL, capture date, capture method) |
| `shared/` (tokens, fonts, logo) | Fritz Brand OS invariants — colors, type scale, logo, motion-easing custom properties | Mirrored copy of `intercept-brand-kit/tokens.css` + `.fritz/assets/logo/*.svg`, self-hosted `.woff2` fonts; concepts `<link>` to it, never re-declare brand hex values locally |
| `concept-a/`, `concept-b/`, `concept-c/` | One independent visual/interaction grammar each, consuming shared brand + content, otherwise fully self-contained | Hand-authored HTML/CSS/JS, no shared component library, own local `assets/` for concept-specific media |
| `qa/copy-diff.py` (new) | Blocking gate: extracts visible text nodes from each concept's rendered HTML and diffs against `content/homepage.json` values | Headless-Chrome (CDP) text extraction + strict string compare, same discipline as the copy-diff rule already in force on every Fritz build |
| Fritz QA gates (`check.py`, `layout.mjs`) | Brand-compliance + layout-convention gate, reused as-is from `intercept-brand-kit/.fritz/qa/` | Run per concept homepage + per sub-page before review |
| `index.html` (repo root, gallery) | Side-by-side entry point for Jon's review — links + short descriptor per concept, nothing else | Static links only; no shared render logic, no live data |
| Local static server | Serves all three concepts + gallery from one root, one port | `python3 -m http.server` (zero-install, matches existing `intercept-website-staging` precedent) or `npx five-server` if live-reload is wanted during iteration |

## Recommended Project Structure

```
intercept-home-concepts/
├── index.html                  # gallery/comparison page — links to concept-a/b/c, no logic
├── content/
│   ├── homepage.json           # canonical verbatim content, chunked by section id
│   └── SOURCE.md               # provenance: source URL, capture date, capture method, sha/diff note
├── shared/
│   ├── tokens.css              # mirrored from intercept-brand-kit/tokens.css — never edited here
│   ├── fonts/                  # self-hosted Instrument Sans / Inter / Geist Mono .woff2
│   ├── logo/                   # canonical mark + lockup SVGs, copied from .fritz/assets/logo/
│   └── motion.css              # shared easing custom properties (sine ease-in-out, long durations)
├── concept-a/                  # "Accenture, but better" — editorial
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── pages/                  # click-through sub-pages (work.html, insights.html, ...)
│   └── assets/                 # concept-local imagery only
├── concept-b/                  # full-screen video + progressive reveal
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── pages/
│   └── assets/
│       └── video/              # hero.mp4 + hero-poster.jpg (concept-local, not shared)
├── concept-c/                  # WebGL/3D experimental
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── vendor/three.module.js  # pinned local copy, no bundler/npm required to view
│   └── pages/                  # DOM-based fallback pages, same content as the 3D scene's nodes
├── assets/
│   ├── sourced-video/          # raw stock/ComfyUI-generated pool before per-concept selection+compression
│   └── comfyui/                # generated stills, pre-selection
├── qa/
│   ├── copy-diff.py            # verbatim-copy verification gate
│   └── README.md               # how to run against each concept
├── _build/
│   └── extract_content.py      # one-time (re-runnable) live-site → content/homepage.json extractor
└── README.md                   # how to run the local server, how to add a 4th concept later
```

### Structure Rationale

- **`content/` is upstream of everything, and nothing else is upstream of it.** Once `homepage.json` is captured and copy-diff-verified against the live site, it is frozen — concepts read from it, they never edit it. This is what makes "copy is immutable" enforceable mechanically instead of by vigilance alone.
- **`shared/` holds brand invariants only, not layout.** Tokens, fonts, logo, motion vars — never a shared header/hero/card component. The three concepts are deliberately *not* a component library with three skins; they are three different structural ideas that happen to share a palette. Sharing more than that would make them stop being three genuinely different concepts.
- **Each `concept-*/` is a self-contained, deletable unit.** No concept imports another concept's CSS/JS/assets. This lets Jon (or a future agent) delete concept B entirely without touching A or C, and lets the three be built/reviewed in any order or in parallel.
- **Concept-local `assets/`, not one shared media pool consumed directly.** Concept B's cinematic full-bleed hero video and Concept C's low-poly/shader-driven visuals have completely different weight and compression targets; a shared `assets/` folder that all three concepts pull from directly invites "which concept uses this file" ambiguity and accidental cross-contamination of size budgets. Root-level `assets/sourced-video/` and `assets/comfyui/` are a *staging pool* for raw sourced/generated media — each concept copies and compresses what it actually uses into its own `concept-x/assets/`.
- **`qa/` and `_build/` are tooling, not shipped pages.** They mirror the proven `intercept-website-staging/_build/assemble_*.py` pattern already in use elsewhere in this account (marker-based, deterministic, re-runnable) rather than inventing a new pipeline.
- **No `node_modules`, no bundler, no framework.** Concept C's only exception is a single pinned `three.module.js` (ES module, loadable via `<script type="module">` directly by any modern browser) — this satisfies "three.js permitted for Concept C" without requiring a build step for the other two concepts or the gallery.

## Architectural Patterns

### Pattern 1: Canonical-Content-JSON + Copy-Diff Gate

**What:** All homepage/sub-page copy lives in one verified JSON file, chunked by section. Every concept's HTML is hand-authored (copy-pasted, never retyped) from that JSON. A verification script then extracts the *rendered* text nodes from each concept's HTML and diffs them character-for-character against the JSON values.
**When to use:** Any time copy is declared immutable and must fan out to multiple independent presentations. This is exactly the failure mode Jon has flagged repeatedly (dropped words, re-cased headings, paraphrased sentences from re-typing instead of copying).
**Trade-offs:** Requires an extra verification script and one extra manual step (pasting, not typing) per content block. In exchange it converts "trust the builder" into "trust the gate" — the same shift already made for brand compliance via `check.py`/`layout.mjs`.

**Example (`content/homepage.json` shape):**
```json
{
  "hero": { "h1": "We turn your most ambitious briefs into proven outcomes." },
  "problems": { "intro": "...", "cards": [ { "quote": "...", "label": "..." } ] },
  "os": { "h2": "...", "tabs": [ "Brief", "Work", "Outcome" ] },
  "work": { "cases": [ { "client": "...", "summary": "..." } ] }
}
```

### Pattern 2: Shared Brand Layer via Token Mirroring, Not Re-Derivation

**What:** `shared/tokens.css` is a byte-for-byte mirror of the Fritz Brand OS source of truth (`intercept-brand-kit/tokens.css`), copied in, not hand-retyped from memory. Same for logo SVGs and fonts.
**When to use:** Whenever a new repo needs to consume an existing, actively-maintained brand system rather than become a second source of truth for it.
**Trade-offs:** Mirroring means a manual re-sync step if the brand kit's tokens change mid-project — acceptable here because this is a short-lived prototype repo, not a long-lived product. Never fork/edit brand hex values locally; if a concept needs a value not in the token set, that is a signal to ask Fritz, not to invent one (`feedback_sap_no_invented_marks`-class rule generalizes here).

### Pattern 3: Concept Isolation (No Cross-Concept Coupling)

**What:** Concepts never `@import`, `<script src>`, or copy-reference each other's CSS/JS/assets. The only things all three depend on are `shared/` and `content/homepage.json`.
**When to use:** Whenever multiple genuinely-different design explorations must be reviewed side by side without one's implementation quietly constraining the others.
**Trade-offs:** Some duplication (e.g., all three need *a* nav, *a* footer) is accepted and expected — DRY-ing that across concepts would flatten the very differences the side-by-side review exists to surface. Duplication of markup patterns is fine; duplication (or divergence) of *copy* is not, which is why the content JSON — not a shared template — is the thing kept singular.

### Pattern 4: Marker-Based Sub-Page Assembly (within one concept)

**What:** Where a single concept has multiple sub-pages that share chrome (nav, footer, brand head block), generate them with a small deterministic Python assembler that extracts shared regions from that concept's own `index.html` by content markers (`<footer>...</footer>`, not line numbers) and splices them into each sub-page template.
**When to use:** Only *within* one concept, once it has more than ~2 sub-pages sharing structure. Do not use this to share structure *across* concepts (see Pattern 3).
**Trade-offs:** Line-number-based slicing is fragile — this exact codebase hit a real bug from it (a footer comment leaked, closing tag dropped, because an earlier edit shifted line numbers after the slice points were pinned). Content-marker regex extraction is drift-proof and is the corrected version of the same pattern; use it, not the line-number version.

## Data Flow

### Content Flow (one-directional, source → presentation)

```
live interceptgroup.com (Variant A homepage)
        │  one-time capture, verbatim transcription
        ▼
content/homepage.json  ◀────────── qa/copy-diff.py (source-side sanity: JSON matches live capture)
        │  manual, copy-pasted per concept (never retyped)
        ├───────────────┬────────────────┬────────────────┐
        ▼               ▼                ▼                │
  concept-a/*.html  concept-b/*.html  concept-c/*.html     │
        │               │                │                │
        └───────┬───────┴───────┬────────┘                │
                ▼               ▼                         │
         shared/tokens.css  shared/logo,fonts ◀────────────┘
                │
                ▼
   qa/copy-diff.py (render-side: rendered text == homepage.json)
                │
                ▼
   Fritz check.py + layout.mjs (per concept + per sub-page)
                │
                ▼
   repo-root index.html gallery ──▶ local static server ──▶ Jon's review
```

### Key Data Flows

1. **Content extraction → freeze:** the live site is read *once* (well-defined capture event, documented in `content/SOURCE.md` with date/URL), transcribed verbatim into JSON, and verified against the live capture before any concept work starts. After that point `content/homepage.json` is treated as read-only law, identically to how a Figma text node is treated as law in every other Fritz-adjacent build in this account.
2. **Fan-out with no back-flow:** all three concepts read from `content/` and `shared/`; none of them write back to either. If a concept needs new copy or a new token, that need routes back through Jon/Fritz to update the source, not through ad hoc local overrides.
3. **Sub-page derivation:** each concept's click-through pages are derived from the *same* JSON chunks the homepage teaser/card used (e.g., `work.cases[]` feeds both the homepage's "Work" card grid and the dedicated work sub-page's fuller write-up) — same source value, different amount of it shown, matching the progressive-disclosure brief (homepage = summary chunk, sub-page = fuller chunk from the same JSON node, never new invented copy).
4. **Verification before visibility:** nothing is shown to Jon until `qa/copy-diff.py` and the Fritz gates both pass for that concept — this mirrors the existing blocking-gate discipline (`check.py --bundle landing_page`, `layout.mjs --spec ...`) already proven across dozens of builds in this account.

## Scaling Considerations

There is no user-traffic scaling concern here — this is a local review artifact, not a production service. The real "scale" axes are *asset weight* and *review distribution*.

| Concern | Local-only review (Jon, this machine) | Shared local review (Jon + 1-2 teammates) | If Jon wants an external shareable link |
|---------|----------------------------------------|---------------------------------------------|-------------------------------------------|
| Serving | `python3 -m http.server` from repo root, one port | Same, plus point teammates at `http://<local-ip>:PORT` on the same network | Zip the built repo and run it through the **existing** `intercept-deploy` MCP staging pipeline used for `intercept-website-staging` — same deploy boundary rule applies: only on Jon's explicit go, never a raw `git push` |
| Video/media weight | No constraint beyond good sense | Same | Compress hero video to the same order of magnitude already proven live (`hero.mp4` ≈ 2.4MB, poster ≈ 90KB in the existing staging bundle) so a preview worker doesn't choke on cold starts |
| WebGL asset weight (Concept C) | Prefer procedural/shader-driven scenes (particles, primitives, shader materials) over loaded 3D models — zero asset-loading risk, zero accessibility-fallback complexity beyond the DOM layer | Same | Same — if a model becomes necessary, keep it low-poly and glTF+Draco compressed |

### Scaling Priorities

1. **First likely bottleneck: Concept B's hero video weight / LCP.** A full-bleed autoplaying hero video is a classic Largest Contentful Paint risk. Mitigation (verified current best practice, see Sources): serve a `poster` image with `fetchpriority="high"`, `preload="metadata"` (not `"auto"`) on the `<video>`, `muted playsinline autoplay loop`, and keep the compressed mp4 in the low single-digit MB range like the existing `hero.mp4` precedent in this account.
2. **Second likely bottleneck: Concept C's WebGL accessibility/fallback completeness.** The most likely thing to eat unplanned time is not the 3D scene itself but building the required non-WebGL-capable / reduced-motion / keyboard-only fallback path. Budget for this explicitly in the roadmap rather than treating it as a QA afterthought — see Anti-Patterns below.

## Anti-Patterns

### Anti-Pattern 1: One shared template/render function across all three concepts

**What people do:** Build a single "page shell" component and swap CSS themes per concept to save time.
**Why it's wrong:** It quietly turns three concepts into one concept with three skins, defeating the actual purpose of the exercise (structurally distinct explorations for Jon to compare) and makes it impossible to delete or radically restructure one concept without risking the others.
**Do this instead:** Share only `content/` and `shared/` (brand tokens/fonts/logo). Structure, markup, and interaction code are concept-owned and independent.

### Anti-Pattern 2: Retyping copy into each concept "in the concept's voice"

**What people do:** Reference the JSON for meaning but hand-write the actual heading/paragraph text into each concept's HTML, sometimes "tightening" it to fit a card.
**Why it's wrong:** This is the exact, repeatedly-flagged failure mode in this account — dropped words, re-cased headings, silently paraphrased sentences. Three concepts means three independent chances for copy drift instead of one.
**Do this instead:** Copy-paste the JSON string value directly into markup; if a section genuinely needs less text to fit a card, truncate at a natural boundary and link to the sub-page with the fuller chunk — never re-write.

### Anti-Pattern 3: Scroll-jacking without replacing native scroll affordances

**What people do:** Hijack the scroll/wheel event for Concept C's 3D navigation without also providing keyboard navigation, a way to reach every piece of content without a mouse, or a `prefers-reduced-motion` branch.
**Why it's wrong:** Documented, current community consensus (three.js forum, see Sources) calls this out by name as the thing that breaks the experience for anyone not interacting exactly as the developer intended — and it directly conflicts with this project's own stated constraint that Concept C must remain "UI-convention compliant... no mystery-meat navigation."
**Do this instead:** Build the DOM-based content structure and navigation first (same nav/click-through model as concepts A and B), then layer the WebGL scene as the *visual* reveal mechanism on top of — not instead of — that accessible structure. Concept C's `pages/` should be reachable and readable with WebGL entirely disabled.

### Anti-Pattern 4: Committing raw/unoptimized source media

**What people do:** Drop multi-hundred-MB raw ComfyUI renders or uncompressed 4K stock footage straight into the repo "to sort out later."
**Why it's wrong:** Bloats the repo, slows every clone/zip/deploy-preview step, and makes it unclear what's actually being served versus what's raw material.
**Do this instead:** Raw/sourced material stays in `assets/sourced-video/` and `assets/comfyui/` only long enough to pick and compress; what ships into a `concept-x/assets/` folder is already web-ready (compressed mp4, sized/optimized jpg/webp posters, compressed glTF if any).

## Integration Points

### External Services / Prior-Art Tooling

| Service / Tool | Integration Pattern | Notes |
|----------------|----------------------|-------|
| `intercept-brand-kit/.fritz/qa/check.py` | Run per concept homepage + sub-page: `python3 check.py <file> --bundle landing_page` | Reuse as-is, do not fork; already proven across dozens of Intercept builds in this account |
| `intercept-brand-kit/.fritz/qa/layout.mjs` | Run per concept: `node layout.mjs <file> --spec logo-beside-nav,nav-bar,hero,card-grid,cta-button,footer,section-rhythm` | Same — reuse the existing spec vocabulary; add a Concept-C-specific spec only if the 3D nav genuinely needs new assertions (e.g., "webgl-fallback-present") |
| `intercept-deploy` MCP | Only if/when Jon wants a shareable external link | Deploy boundary is absolute: never `git push`/raw deploy; matches `feedback_intercept_deploy_boundary` and the existing `intercept-website-staging` precedent |
| three.js (Concept C) | Single pinned ES module file in `concept-c/vendor/`, loaded via `<script type="module">` | No npm/bundler required; pin a specific version so the prototype doesn't silently change behavior from a CDN update |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|----------------|-------|
| `content/` ↔ `concept-*/` | One-way, build/author-time only (copy-paste, not fetch) | Keeps each concept a fully static, dependency-free set of files — no runtime JSON fetch required, no CORS/`file://` friction when opening a concept directly |
| `shared/` ↔ `concept-*/` | One-way, via `<link>`/relative path at author time | Concepts reference `../shared/tokens.css` etc.; never inline a copy of brand CSS locally |
| `concept-*/` ↔ `concept-*/` | None | Enforced by directory isolation (Pattern 3); a lint/grep check (`grep -r "concept-a" concept-b/` returns nothing) is a cheap way to verify this holds |
| `qa/` ↔ `concept-*/` | One-way, read-only verification | QA scripts read rendered HTML, never mutate it |

## Sources

- Internal precedent (HIGH confidence, this account's own proven pattern): `~/Creative-Projects/intercept-website-staging/` (marker-based assemblers, `assets/video` + `assets/podcast` layout, `python3 -m http.server` local preview, verbatim-copy discipline), `~/Creative-Projects/intercept-brand-kit/tokens.css` + `.fritz/qa/check.py` + `.fritz/qa/layout.mjs` (brand/layout gates to reuse, not fork).
- [three.js forum — Accessibility for 3D websites](https://discourse.threejs.org/t/accessibility-for-3d-websites/87092) — MEDIUM confidence, community consensus: WebGL sites need static/2D fallback for unsupported devices, keyboard nav, reduced-motion option, DOM elements positioned in front of canvas for accessibility.
- [Frontend Masters — Virtual Scroll-Driven 3D Scenes](https://frontendmasters.com/blog/virtual-scroll-driven-3d-scenes/) — MEDIUM confidence: names "scroll-jacking" as the failure mode when custom scroll behavior doesn't replace native affordances (keyboard nav, screen reader context).
- [web.dev — Video performance](https://web.dev/learn/performance/video-performance) and [Aaron T. Grogg — Improving LCP for Video Hero Components (2026)](https://aarontgrogg.com/blog/2026/01/06/improving-lcp-for-video-hero-components/) — MEDIUM confidence, official/practitioner sources agree: poster image with `fetchpriority="high"`, `preload="metadata"`/`"none"` (not `"auto"`) for hero video, never lazy-load the actual LCP poster.
- [DebugBear — Lazy Loading Without Hurting Performance](https://www.debugbear.com/blog/lazy-loading-performance) — MEDIUM confidence, corroborates: never lazy-load above-the-fold hero media.

---
*Architecture research for: multi-concept static marketing-homepage prototype repo*
*Researched: 2026-07-23*
