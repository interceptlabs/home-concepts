# Phase 4: Concept C — Experimental WebGL/3D - Context

**Gathered:** 2026-07-24 (auto mode — 3D interaction metaphor locked by orchestrator from project research + Fritz canon; flagged open since roadmap)
**Status:** Ready for planning

<domain>
## Phase Boundary

Concept C homepage + its derived sub-pages, working locally at `/concept-c/`. The most experimental of the three: a three.js 3D space is the navigation metaphor — while still adhering to UI conventions (visible labels, native scroll, keyboard/screen-reader/no-WebGL fallbacks). Consumes ONLY `content/` + `shared/`. Requirements CONC-01..05.

</domain>

<decisions>
## Implementation Decisions

### The 3D metaphor (LOCKED): "the topic field"
- A dark 3D void holds **6 procedural geometric objects — one per topic** (Problems · InterceptOS · Work · Labs · Insights · Contact). No loaded model assets — fully procedural geometry (architecture research's recommendation to eliminate asset-loading risk).
- Geometry vocabulary honors Fritz: apex-up tetrahedra / triangular prisms (right angle at base, apex up — never inverted), plus rectangular slabs/cubes. The Intercept mark itself NEVER appears in the scene (mark is not decoration).
- Shading: **flat-shaded with hard-stepped tones** (MeshToonMaterial with a 3-5 step gradient map or equivalent posterized lighting) — this is the Fritz "no gradients = hard-edged equal steps" rule expressed in 3D. No smooth PBR falloff, no bloom/glow (no AI-slop neon).
- Palette: monochrome surface grays from tokens; **Flarepop reserved for the focused/hovered object accent** and label markers. One accent at a time.
- Subtle cursor parallax (scene tilts a few degrees toward the pointer, sine-eased, disabled on touch + reduced-motion).

### Scroll & camera (CONC-03 — no scroll-jacking)
- The page is a normal, natively-scrolling document ~400vh tall. The canvas is `position: fixed` behind everything. Camera position = pure function of `scrollY` (eased dolly through the field, each topic object coming into focus in sequence). Wheel/trackpad/keyboard/scrollbar all remain native; back button and deep links intact.
- After the 3D scroll range, the page continues into **standard DOM sections** (below-fold): verbatim teaser blocks for topics without full sub-pages (problems, labs) + the convert block + footer. 3D is concentrated in the hero/nav zone per CONC-01.
- Scroll position indicator: a mono-font topic index (current topic highlighted) fixed at the edge — doubles as a visible nav that works by click (smooth-scrolls, reduced-motion → instant jump).

### Labels & hotspots (CONC-02 — no mystery meat)
- Topic labels are **real DOM `<a>`/`<button>` elements projected from 3D world positions** (three.js `Vector3.project()` → CSS transform), NOT canvas-drawn text. Always visible (not hover-revealed), mono font, Flarepop marker dot, ≥44px hit area, `:focus-visible` treatment.
- Because labels are DOM: they're keyboard-tabbable in a logical order, screen-reader readable, and `data-copy` annotatable. Hover/focus highlights the linked 3D object (the Flarepop accent); the label itself is the click target (bigger, more reliable than raycasting; raycast click on the object is a bonus, not the primary affordance).
- Topics with full sub-pages route there (View Transition cross-fade, same idiom as A/B). Topics without full pages (problems, labs, contact) smooth-scroll to their below-fold DOM section — no dead ends, no invented routes.

### Sub-pages
- Ship 3 full pages: `interceptos.html`, `work.html` (consolidated, B-style), `insights.html` — quiet, typographic, dark; NO WebGL on sub-pages (keeps weight down, proves the "3D as nav, DOM as content" split). Persistent way back.
- Below-fold homepage sections carry verbatim teaser refs for problems + labs and the full convert block, all `data-copy` annotated.

### Fallbacks & device tiering (CONC-04, CONC-05 — built ALONGSIDE, not after)
- **Semantic DOM mirror is the page itself**: the projected labels + below-fold sections form a complete, working nav/content path with the canvas absent. `<canvas>` is `aria-hidden="true"`; an offscreen-but-focusable summary list mirrors the 6 topics for screen readers.
- WebGL2 capability check BEFORE renderer init; failure → `.no-webgl` class → canvas never created, a static hard-stepped CSS backdrop takes its place, labels lay out in a fixed constellation. Same path for `prefers-reduced-motion` (no camera dolly, no parallax — static composed scene at DPR 1, or the no-webgl layout; planner's choice, document it).
- DPR clamp: `Math.min(devicePixelRatio, 2)` desktop, 1.5 on small screens; `powerPreference: "low-power"`; render loop pauses on `visibilitychange` hidden and when canvas offscreen; degrade step-count/object detail on low tiers (simple heuristic: deviceMemory/hardwareConcurrency if present, else screen size).
- three.js **vendored locally** (single `three.module.js` file into `concept-c/assets/vendor/`, version pinned r185-line, downloaded once during build — record exact version in an ASSETS.md). No CDN dependency at runtime; import map or direct module import — no build step.

### Copy discipline
- Same as A/B: every rendered text node from canonical refs with `data-copy`; `python3 qa/copy-diff.py concept-c/index.html concept-c/pages/*.html` exits 0 in task verifies; full brand grep suite including the border-hairline grep.

### Claude's Discretion
- Exact object shapes per topic, field composition, camera path keyframes
- Toon step count (3-5), light rig
- Whether the focused object gets a slight rotation idle (sine, long period) — keep it calm

</decisions>

<specifics>
## Specific Ideas

- Jon's brief: "even more experimental but still adhere to UI conventions and best practices... Look into WEB GL and other 3d space mechanisms."
- Research references for the family of interaction: Hubtown (Awwwards SOTD 06/2026, cursor-reveal 3D), Lusion (SOTM 04/2026), scroll-driven camera fly-through (Design Awards winner 10/2025), clickable collectibles (FWA SOTD 10/2025). We take the scroll-driven camera + labeled-object nav, not the scroll-jack or mystery-meat parts.
- The accessibility research is emphatic: DOM mirror built alongside the 3D layer, not retrofitted — that's why labels ARE DOM.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `content/homepage.json` + `content/subpages.json` (teaser/full ref splits; traps documented in 03-RESEARCH: `problems.items.3.signalNum` empty string, `os.flows[i].stages[3].agents` = empty array, `work.cases[i].agents` single string, variable-length arrays)
- `shared/tokens.css`, `shared/fonts.css`, `shared/motion.css`, `shared/logo/lockup.svg`, `shared/README.md`
- `qa/copy-diff.py` annotated mode; concept-b/pages/work.html shows the consolidated-work annotation idiom
- Concept B's logo lesson: `fill="currentColor"` doesn't inherit through `<img src>` — inline the lockup SVG in concept-c pages
- The Puppeteer + installed Chrome + setViewport capture rig (02-03/03-03 precedent)

### Established Patterns
- has-js bootstrap class; @view-transition cross-fade only; reduced-motion guards in both CSS and JS; serve via ./serve.sh :4340
- Executor QA: copy-diff + 8-grep brand suite + responsive captures + link integrity

### Integration Points
- Consumes `content/` + `shared/` only; never references concept-a/ or concept-b/
- Phase 5 re-runs all gates and finalizes the gallery

</code_context>

<deferred>
## Deferred Ideas

- Cursor-reactive particle/shader hero accents (ENH-04, v2)
- Portal/morph transitions (ENH-03, v2)
- Raycast-driven object picking as primary interaction (labels stay primary in v1)

</deferred>

---

*Phase: 04-concept-c-experimental-webgl-3d*
*Context gathered: 2026-07-24*
