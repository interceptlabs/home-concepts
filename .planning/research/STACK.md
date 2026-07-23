# Stack Research

**Domain:** Marketing-agency homepage prototypes — three concepts (editorial/Accenture-style, full-screen video, experimental WebGL/3D), static HTML/CSS/JS, no build step, Fritz brand system
**Researched:** 2026-07-23
**Confidence:** HIGH (versions/support verified via WebSearch across multiple current sources; no Context7 library IDs used — these are browser-platform and CDN-distributed libraries, not npm-package-doc-driven)

## Recommended Stack

### Foundation (shared across all three concepts)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Plain HTML5 + CSS3 + vanilla JS (ES modules) | native | Core of every concept | Project constraint is "no build step unless clearly justified." Fritz brand system is already hand-authored static HTML from the `fritzweb`/`figma-web-factory` pipelines — matching that pattern keeps these prototypes consistent with production practice and trivially portable into the real deploy pipeline later. |
| Native ES modules (`<script type="module">`) + **import maps** | native (Safari 16.4+, Chrome/Edge 89+, Firefox 108+ — all evergreen browsers as of 2026) | Load CDN packages (three.js, GSAP, Lenis) with clean bare specifiers (`import * as THREE from "three"`) with zero bundler | Import maps are now supported across all major evergreen browsers. This is the "no-build npm-style import" trick: define a `<script type="importmap">` block per page mapping `"three"` and `"three/addons/"` to jsDelivr/unpkg URLs, then write normal `import` statements. No Vite/Webpack/esbuild required. One caveat: the import map JSON must be inline in the HTML (external map files aren't supported yet), so duplicate the map on every page or template it during static generation. |
| A trivial static file server (`npx serve`, `python3 -m http.server`, or VS Code Live Server) | n/a | Local preview | Concepts must "run from a simple local server" per project constraints — `fetch()`/ES module imports fail under `file://`. No dev server tooling (no Vite dev server needed) since there's no bundling step to justify it. |

### Concept A — Editorial ("Accenture, but better")

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Hand-authored CSS with custom properties (design tokens) | native | Type scale, spacing, color, card grid | Fritz brand system already defines exact tokens (Flarepop-only colored text, hard-edged "no gradient" steps, triangle marks, type scale). A bespoke token-driven stylesheet enforces those rules directly; a utility framework fights against a locked design system instead of encoding it. CSS Grid + `clamp()` fluid type gives the "oversized editorial type" look Accenture-class sites use, with zero dependencies. |
| CSS Scroll-Driven Animations (`animation-timeline: view()` / `scroll()`) with `@supports` progressive enhancement, **Intersection Observer** fallback | native | Card/section reveal-on-scroll, oversized headline reveals | As of 2026: full support in Chrome/Edge 115+, Opera 101+, and **Safari 26**; Firefox still ships it behind the `layout.css.scroll-driven-animations.enabled` flag (partial support only). For a client-facing prototype, treat CSS scroll-driven animations as the primary mechanism (near-zero JS, runs off the compositor thread, cannot be blocked by long tasks) and gate it behind `@supports (animation-timeline: scroll())`; fall back to a small Intersection Observer + CSS class toggle for Firefox. Do NOT rely on it exclusively yet — Firefox gap is real. |
| GSAP 3.15 (core + ScrollTrigger + SplitText) — CDN, only if choreography needs exceed what CSS can do | 3.15.x | Complex, scrubbed, pinned scroll sequences; staggered card entrances; text-splitting reveals | GSAP became **100% free for all users, including every previously-paid Club plugin (ScrollTrigger, SplitText, MorphSVG, DrawSVG), after Webflow acquired GreenSock** (announced Oct 2024, rolled out fully by April 2025) — confirmed current on gsap.com's pricing page as of this research. Since npm/CDN builds moved to a single public package (3.13+), there's no more separate "club" install step. Use GSAP only where CSS scroll-driven animations can't express the effect (e.g., pinning a section while inner elements animate independently, or pixel-perfect scrub-synced choreography) — for straightforward fade/slide-in card reveals, CSS + Intersection Observer is lighter and should be preferred. |
| **Lenis** (darkroom.engineering) — optional | latest (≈1.3.x) | Buttery smooth-scroll feel for the "confident, tight" Accenture-class scroll experience | ~3-4kB, keeps native DOM scroll structure (unlike Locomotive Scroll, which hijacks the scroll container and fights ScrollTrigger). Pairs cleanly with GSAP ScrollTrigger via its documented `lenis.on('scroll', ScrollTrigger.update)` sync pattern. Optional — only add if plain native scroll feels insufficiently "premium"; adds a dependency for a subjective feel improvement. |
| View Transitions API (cross-document) | native | Native page transition when clicking a card into its derived content page | Chrome 126+ and Safari 18.2+ now both support **cross-document view transitions** (multi-page apps), and Firefox added support at version 144 — meaning by mid-2026 this works in all three major engines without any JS animation library. This directly serves the "click a card → navigate to focused content page" interaction central to all three concepts: opt in per-page with `@view-transition { navigation: auto; }` in CSS, no library needed. Treat as progressive enhancement (browsers without support just navigate normally — no fallback code required). |

### Concept B — Full-screen video

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Native `<video>` with `muted playsinline autoplay loop` + `poster` | native | Full-bleed autoplaying background video | Verified 2026 browser policy: **muted autoplay is universally allowed** in Chrome and Safari; unmuted autoplay is blocked everywhere. `playsinline` is mandatory for iOS Safari to prevent the video from hijacking into native fullscreen player. Always pair with a `poster` frame (a still from the video, exported once) so there's no flash-of-empty-hero before the video buffers, and provide a visible mute/unmute affordance rather than fighting the muted-autoplay policy. |
| Dual `<source>`: WebM (VP9/AV1) + MP4 (H.264) fallback | n/a | Format compatibility + file size | H.264/MP4 remains the universal-compatibility baseline (~98% device/browser support, fastest to encode) — keep it as the required fallback `<source>`. Serve **WebM (VP9)** as the first `<source>` for Chrome/Firefox/Edge, which typically saves 30-50% file size over the MP4 at equal visual quality. AV1 (via SVT-AV1 at speed preset 4-6, not the much slower reference libaom encoder) is viable as a *third* modern-first source for further savings but is optional for a prototype — the encode-time cost isn't worth it unless final assets need to ship in production. |
| `ffmpeg` for encoding/compression | current (any 2026 build; libx264, libvpx-vp9, and libsvtav1 all bundled in standard builds) | Compress and format-convert sourced/generated footage for the web | Two-pass or CRF-based H.264 encode (CRF ~ 20-23 for hero footage) plus a scaled-down, muted, silent-audio-stripped WebM pass is the standard hero-video pipeline. Strip audio entirely (`-an`) since the video is always muted — this alone often halves file size. Keep hero background videos short (6-15s), loopable, and under ~5MB where possible; scale to the actual max display width needed (rarely need 4K source delivered — 1920×1080 or 1280×720 is usually sufficient for a background layer under text). |
| Lazy loading strategy: `preload="metadata"` for the above-the-fold hero, `preload="none"` + Intersection Observer-triggered `<video>` `src` swap for any below-the-fold video | native + small JS shim | Performance | For the single above-the-fold hero video, `preload="metadata"` is the right balance (fetches enough to show dimensions/poster fast without downloading the whole file up front — actual playback start still requires further buffering, browsers vary). For any secondary video content revealed further down (e.g., a video-backed content section reached via the progressive-reveal mechanism), don't set `src` until an Intersection Observer confirms the section is about to enter view — avoids paying for video bandwidth nobody scrolls to. |
| `prefers-reduced-motion` static-poster fallback | native CSS/JS media query | Accessibility + policy compliance | When `prefers-reduced-motion: reduce` is set, swap the autoplaying video for the static `poster` image and pause/hide the `<video>` element entirely. This is table-stakes for any autoplaying full-bleed video site in 2026 and is explicitly required by this project's UX constraints. |

**Where to source video (verified licensing, 2026):**

| Source | License | Notes |
|--------|---------|-------|
| **Pexels Videos** (pexels.com/videos) | Pexels License (CC0-like) — free for commercial and personal use, no attribution required | Reaffirmed May 2026 per Pexels; largest curated library of the three, most "premium marketing site" footage (abstract, lifestyle, tech b-roll). Primary recommendation — matches the project's existing "Pexels-class real stock" imagery rule already in force for Fritz work. |
| **Coverr** (coverr.co) | Free, no watermark, no attribution required, commercial use permitted (no resale of raw footage) | Strong curated "brand site hero" aesthetic (slow-motion abstract/nature/tech loops) — good fit for Concept B's loopable ambient background. |
| **Mixkit** (mixkit.co) | Mixkit Free License — commercial and non-commercial use permitted, no resale | Deep catalog, HD/4K options; same license class as Coverr. |
| ComfyUI-generated video | n/a (locally generated) | Per project constraints, ComfyUI is the approved generation path (never fal-ai). Use only if stock footage can't match the desired abstract/brand-specific look; still must clear the "no neon/glow AI slop" bar and pass Fritz QA. |

### Concept C — Experimental WebGL/3D

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **three.js** | **r185 (0.185.x)**, published mid-2026 | Core WebGL/WebGPU rendering engine for the 3D navigation/reveal metaphor | Confirmed current release as of this research. Three.js is explicitly permitted per project constraints and is the dominant, most-documented option — "the most widely used [rendering library] in the space by a wide margin," at a lean ~168kB gzipped core (vs. much heavier Babylon.js). Since 2026 it also ships a production-ready `WebGPURenderer` (stable since r171 / Sept 2025) with a transparent fallback to WebGL2 — useful headroom but WebGL2 remains the safe default target for a marketing prototype that must work everywhere. Load via CDN + import map (see Installation) — **no bundler needed**, keeping it consistent with the no-build constraint. |
| three.js `addons/` (OrbitControls, GLTFLoader, RenderPipeline / post-processing, if needed) | matches core version | Camera controls for dev/QA, model loading, optional bloom/DOF polish | Ship as ES modules from the same CDN under an aliased `three/addons/` import-map entry (`jsdelivr.net/npm/three@0.185.x/examples/jsm/...`). r183 introduced `RenderPipeline` as a simpler modern replacement for the older `EffectComposer` post-processing setup — prefer it for any bloom/vignette treatment if the 3D scene needs polish. |
| Vanilla three.js (NOT react-three-fiber) | — | Confirms architecture choice | React Three Fiber only makes sense inside an existing React app: it roughly doubles bundle size (adds React + R3F on top of three.js itself) and, more importantly, would force introducing a whole framework + build tooling into a project explicitly scoped as "static HTML/CSS/JS, no framework build step." Verified via multiple 2026 sources: "for a static site specifically... vanilla Three.js is likely the better choice." Not recommended here under any circumstance. |
| **CSS 3D transforms** (`transform-style: preserve-3d`, `perspective`, `translate3d`/`rotate3d`) | native | Lightweight fallback / alternate mechanism for simpler "3D-space" navigation without WebGL | If the WebGL build proves too heavy, too fragile across devices, or too complex for the reveal metaphor actually chosen, CSS 3D gives a GPU-accelerated pseudo-3D card/plane rotation system (think: a rotating cube of content panels) using only CSS — no canvas, no shader compilation, trivially accessible fallback (can be disabled entirely under `prefers-reduced-motion` by freezing the transform). Recommended as the documented "lighter fallback" path per the project brief, and as what to reach for if three.js's affordance/accessibility requirements (keyboard, reduced motion parity) prove hard to retrofit onto a full WebGL scene in prototype time. |
| **Spline** (`@splinetool/viewer` web component via CDN) — alternative/optional | 1.9.x | Designer-authored 3D scenes embedded as a `<spline-viewer>` custom element | Genuinely no-build: `<script type="module" src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js">` + `<spline-viewer url="...scene.splinecode">`. Best fit if the 3D asset itself (models, materials, camera path) should be visually authored/iterated in Spline's editor rather than hand-coded — "makes web-friendly 3D feel approachable... for designers, creative developers... who want 3D scenes without a heavy traditional pipeline." Tradeoff: scenes are hosted on Spline's CDN (`prod.spline.design`) unless exported/self-hosted, less granular control over interaction logic than raw three.js, and it's a proprietary authoring tool outside this project's existing toolchain (Figma/ComfyUI/Fritz). Use if Concept C's chosen mechanism is closer to "a few polished branded 3D objects the user orbits/clicks" than "a custom shader-driven navigation system" — otherwise three.js gives full control. |
| PlayCanvas — considered, not recommended for this project | — | Full game-engine-style editor + runtime | PlayCanvas "wins for collaborative team-based 3D web with non-developer content editors" and has the most mature WebGPU/Gaussian-splatting tooling — but it's architected around its own hosted editor/project model, which is a heavier commitment than this prototype needs and doesn't fit a git-based, no-build static-file workflow as cleanly as three.js's plain-script CDN usage. Reasonable escalation path only if Concept C is greenlit for real production investment later. |
| Raw WebGPU / hand-written shaders (no library) — considered, not recommended | — | Maximum experimental control | Explicitly the highest-risk, most training-data-stale-prone option (WebGPU semantics/API surface are still evolving faster than most other web platform features) and the most time-expensive to hand-roll for a prototype-stage deliverable. three.js's `WebGPURenderer`/`TSL` (Three Shading Language) node system already gives access to custom shader-like effects with far less boilerplate and far more current documentation. Reserve raw WebGPU for a future dedicated shader-art side project, not this homepage concept. |
| Intersection Observer / raycasting for click affordances + explicit visible UI hints (cursor change, tooltip labels, focus outlines) | native + three.js `Raycaster` | Keeps the 3D scene "convention-compliant" per project constraint | Project explicitly requires "clear affordances, no mystery-meat navigation" for Concept C. Use three.js `Raycaster` + pointer events for hit-testing interactive 3D objects, but always pair with a real DOM overlay (visible label, hover state, `tabindex` + keyboard handler) so the interactive zones are discoverable and operable without a mouse — do not rely on the 3D scene alone to communicate what's clickable. |

### Shared scroll/reveal animation stack (all three concepts)

| Technology | Version/Support | Purpose | Why Recommended |
|------------|------------------|---------|-----------------|
| **Intersection Observer API** | native, universal support since ~2019 | Simple reveal-on-scroll triggers (fade/slide-in), lazy-loading video/3D-asset triggers, "has this card entered view" checks | The lightest-weight, most battle-tested mechanism for "does this element exist in the viewport yet" — zero dependency, works identically across all evergreen browsers. Default choice for straightforward reveal patterns across all three concepts before reaching for GSAP. |
| **CSS Scroll-Driven Animations** (`animation-timeline: scroll()`/`view()`) | Chrome/Edge 115+, Opera 101+, Safari 26 full support; **Firefox partial, behind flag** as of 2026 | Scroll-progress-linked effects (progress bars, parallax, scrub) without JS, running off-main-thread | Use as the primary mechanism where visual richness matters and Firefox degrading to a static/instant state (via `@supports` fallback) is acceptable — appropriate for decorative reveal polish in Concept A/B. Not yet safe as the *sole* mechanism for anything functionally load-bearing (e.g., don't gate content visibility/access purely behind it) because of the Firefox gap. |
| **GSAP 3.15 + ScrollTrigger** | 3.15.x, 100% free (see Concept A entry) | Complex/pinned/scrubbed sequences, cross-browser consistency (works identically in Firefox, unlike the CSS spec) | Reach for GSAP specifically when: (a) the effect needs pixel-perfect cross-browser parity right now (can't wait on Firefox's flag), or (b) the choreography is too complex for `animation-timeline` alone (e.g., pinning + independently-scrubbed child elements + horizontal scroll hijacking for Concept C's 3D navigation). |
| **View Transitions API** (same-document + cross-document) | Same-document: Chrome/Edge since 111, Safari 18+; Cross-document: Chrome 126+, Safari 18.2+, Firefox 144+ | Native "morph" transitions between homepage and derived content pages (the click-through model central to all three concepts) | This is the single most load-bearing recommendation for the shared "click a card → land on its focused content page" interaction pattern requested across all three concepts. As of mid-2026 it works natively in all three engines with a few lines of CSS (`@view-transition { navigation: auto; }` + optional `view-transition-name` on the clicked element for a shared-element morph) — no JS routing library, no SPA framework, no Barba.js-style page-transition library needed. |

## Supporting Libraries (use only if genuinely needed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Lenis | ~1.3.x | Smooth-scroll feel | Concept A/C, only if native scroll feels insufficiently "premium" for the editorial/experiential tone — optional polish, not required. |
| GSAP SplitText plugin | bundled in gsap 3.15 | Character/word/line text-splitting for headline reveal animations | Concept A oversized-type reveals, now free (see above) — don't reach for a separate splitting library (e.g., Splitting.js) when GSAP's own SplitText ships free in the same package. |
| `es-module-shims` | latest | Import-map polyfill | Only needed if the prototype must support browsers older than Safari 16.4/Chrome 89 (unlikely for an internal review prototype) — skip unless a stakeholder demo device turns out to need it. |

## Installation (no-build, CDN-based)

```html
<!-- One inline import map per HTML page (must be inline — external map files not yet supported) -->
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.185.1/examples/jsm/"
  }
}
</script>

<!-- GSAP core + ScrollTrigger + SplitText, all free in the single public package -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/SplitText.min.js"></script>

<!-- Lenis (optional smooth scroll) -->
<script src="https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.min.js"></script>

<!-- Spline viewer (Concept C, only if using Spline-authored scenes) -->
<script type="module" src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js"></script>

<!-- Then, in a module script -->
<script type="module">
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";
  // ...
</script>
```

**CDN vs. vendored files — recommendation: vendor-lock a copy for the review/deploy handoff, develop against CDN.**
Use jsDelivr/unpkg CDN URLs (pinned to exact versions, never `@latest`) during active prototyping for fast iteration with zero local dependency management. Before handing prototypes to Jon for review or considering any of them for the eventual production pipeline, download and vendor the exact pinned files into a local `/vendor/` directory and repoint the import map to local paths — this removes a runtime dependency on third-party CDN uptime/version-pinning drift for anything that might outlive the prototype stage, and matches the project's existing deploy-boundary discipline (interceptgroup.com deploys only via the intercept-deploy MCP; a stray CDN outage should never be able to break a "shipped" homepage). For the pure comparison/review phase, CDN is fine and faster.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vanilla three.js | react-three-fiber | Only if this project were already a React app — it isn't, and adding React solely for R3F would violate the no-framework-build-step constraint and roughly double payload. |
| CSS scroll-driven animations + Intersection Observer (default) | GSAP ScrollTrigger (escalation) | When cross-browser parity is needed immediately (Firefox flag gap) or choreography exceeds what the CSS timeline model can express (pinning + independent child scrub, horizontal hijack). |
| Native `<video>` + dual-format sources | A JS video library (Plyr, Video.js) | Only if custom player chrome (scrub bar, captions UI) is needed — not applicable here since this is a muted, looping, chrome-less background video, not a media player. |
| Hand-authored CSS with Fritz design tokens | Tailwind CSS (via Play CDN, no-build) | Only if the team explicitly wants utility-class velocity over token fidelity — not recommended here (see below). |
| Lenis | Locomotive Scroll | Never, for new work in 2026 — Locomotive hijacks the scroll container in a way that actively fights ScrollTrigger and non-Locomotive-aware libraries; the ecosystem has broadly migrated to Lenis. |
| three.js (self-hosted control) | Spline (`<spline-viewer>`) | When the 3D content is a small number of designer-authored branded objects/scenes rather than a fully custom interaction/shader system — trades control for authoring speed. |
| WebGL2 via three.js (default target) | three.js `WebGPURenderer` | Only if targeting cutting-edge visual effects (advanced compute-driven particle systems, TSL node shaders) and willing to accept WebGPU's still-maturing device/browser coverage versus WebGL2's near-universal support. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Locomotive Scroll | Actively fights GSAP ScrollTrigger by disabling native scroll and altering DOM scroll origin; community has largely migrated off it. | Lenis |
| A GSAP "Club" install step / bower-era GSAP licensing docs (anything pre-3.13 mental model of "ScrollTrigger/SplitText are paid") | Outdated — as of the Webflow acquisition (2024-2025) all plugins are bundled free in the single public `gsap` package. Building around a paid-plugin assumption wastes budget/time unnecessarily. | Plain `npm`/CDN install of `gsap@3.15.x`, which includes everything. |
| React Three Fiber / any React-based 3D wrapper in this project | Forces in a full framework + build tooling the project explicitly says isn't justified; roughly doubles bundle weight versus vanilla three.js for no architectural benefit here. | Vanilla three.js via CDN + import map |
| Tailwind Play CDN for "production-looking" output | Explicitly discouraged by Tailwind's own docs for anything beyond quick demos (ships the full JIT compiler + generates styles at runtime in-browser — real performance cost, and awkward to align 1:1 with Fritz's exact locked design tokens vs. hand-authored custom properties). | Hand-authored CSS custom properties matching the Fritz Figma kit tokens |
| Unmuted/forced autoplay video, or autoplay without `playsinline` | Blocked by both Chrome and Safari's 2026 autoplay policies; on iOS, missing `playsinline` forces the video into the native fullscreen player, breaking the full-bleed background effect entirely. | `muted playsinline autoplay loop` + visible unmute affordance |
| Reference-libaom AV1 encode for iterative prototype work | 10-50x slower than an equivalent H.264 encode — burns iteration time for marginal-in-a-prototype file-size gains. | H.264 (required fallback) + SVT-AV1 at speed preset 4-6 if a modern-codec source is wanted, only once assets are finalized |
| Raw hand-rolled WebGPU shaders for Concept C | Highest implementation risk/time cost for a prototype-stage deliverable; WebGPU API surface still evolving faster than other web-platform features covered here. | three.js `WebGPURenderer`/TSL, with WebGL2 as the safe default renderer target |
| Relying on CSS scroll-driven animations alone for anything functionally load-bearing | Firefox ships only partial/flagged support in 2026 — a Firefox visitor could see broken or static content if it's the *only* mechanism. | Pair with `@supports` fallback to Intersection Observer + CSS classes, or use GSAP where parity matters now |

## Stack Patterns by Variant

**If Concept A (editorial/Accenture-style):**
- Use hand-authored CSS design tokens + CSS Grid card layout + CSS scroll-driven reveal (with IO fallback) + View Transitions API for card-to-page navigation
- Escalate to GSAP/SplitText only for headline text-splitting or choreography CSS can't express
- Because the brief calls for "tighter craft, faster" than Accenture — the lightest-weight mechanism that achieves the effect keeps load time and iteration speed on the project's side

**If Concept B (full-screen video):**
- Use native `<video muted playsinline autoplay loop poster>` with dual WebM/MP4 sources, Intersection Observer-gated reveal of interactive hotspots over the video, View Transitions API for click-through navigation
- Because the "clever progressive-reveal mechanism" is a UI/interaction design problem layered on top of a deliberately simple, standards-based video foundation — don't over-engineer the video delivery itself

**If Concept C (experimental WebGL/3D):**
- Use vanilla three.js (WebGL2 target, `addons/` via CDN import map) as the default; consider Spline `<spline-viewer>` only if the 3D content is better authored visually than coded; use CSS 3D transforms as an explicit lighter fallback if the WebGL build proves too fragile/time-expensive for prototype timelines
- Always pair 3D interaction zones with a real DOM overlay (visible label/focus state/keyboard handler) — the project explicitly requires convention-compliant affordances, not mystery-meat 3D navigation
- Because this is "the most experimental" concept but still must satisfy the same accessible/reduced-motion/no-walls-of-text rules as A and B

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| three@0.185.1 | GSAP 3.15.x (ScrollTrigger driving camera/object animation) | No direct API coupling — GSAP just tweens plain JS values/three.js object properties (`gsap.to(mesh.rotation, {...})`); version pairing is not a hard constraint, just use current releases of both. |
| GSAP 3.15.x | Lenis ~1.3.x | Documented sync pattern: `lenis.on('scroll', ScrollTrigger.update)` + drive Lenis's RAF loop through `gsap.ticker` instead of Lenis's own `requestAnimationFrame` call, per Lenis's own GSAP integration docs — get this wrong and scroll-triggered animations desync from the smoothed scroll position. |
| Import maps | Safari 16.4+, Chrome/Edge 89+, Firefox 108+ | All evergreen browsers as of 2026 — no polyfill needed for a modern-browser review prototype; only add `es-module-shims` if a specific old stakeholder device demands it. |
| CSS `animation-timeline` | Chrome/Edge 115+, Opera 101+, Safari 26; Firefox partial/flagged | Always wrap in `@supports (animation-timeline: scroll())` and ship a working default state for Firefox rather than a broken/invisible one. |
| Cross-document View Transitions | Chrome 126+, Safari 18.2+, Firefox 144+ | Purely progressive enhancement — browsers below these versions just get a normal navigation with no transition, no fallback code required. |

## Sources

- [Webflow: GSAP becomes free](https://webflow.com/updates/gsap-becomes-free) — HIGH confidence, official announcement
- [gsap.com/pricing](https://gsap.com/pricing/) — HIGH confidence, official current licensing page (fetched directly)
- [GSAP GitHub](https://github.com/greensock/GSAP) / [npm gsap](https://www.npmjs.com/package/gsap) — HIGH confidence, version 3.15.0 confirmed current
- [three.js GitHub releases](https://github.com/mrdoob/three.js/releases) / [npm three](https://www.npmjs.com/package/three) — HIGH confidence, r185/0.185.1 confirmed current, WebGPURenderer since r171
- [MDN: CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations) / [MDN: scroll()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline/scroll) — HIGH confidence, official spec docs
- [MDN: View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) / [Chrome for Developers: View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions) — HIGH confidence, cross-referenced with community browser-support trackers for cross-document support versions (Chrome 126+, Safari 18.2+, Firefox 144+)
- [Lenis (darkroom.engineering)](https://lenis.darkroom.engineering/) / [Lenis GitHub](https://github.com/darkroomengineering/lenis) — HIGH confidence, official docs
- [web.dev: Import maps in all modern browsers](https://web.dev/blog/import-maps-in-all-modern-browsers) — HIGH confidence
- Pexels License page (pexels.com license terms, reaffirmed May 2026 per search results), Coverr and Mixkit license pages — MEDIUM confidence (verified via multiple independent aggregator sources, not fetched directly from each site's own ToS page in this pass)
- [Chrome for Developers: Autoplay policy](https://developer.chrome.com/blog/autoplay) — HIGH confidence, official
- [@splinetool/viewer on npm](https://www.npmjs.com/package/@splinetool/viewer) / [jsDelivr package page](https://www.jsdelivr.com/package/npm/@splinetool/viewer) — HIGH confidence, official CDN embed pattern
- Multiple 2026 comparison articles (Three.js vs. Babylon.js vs. PlayCanvas; React Three Fiber vs. vanilla Three.js; AV1 vs. H.264 encoding guides) — MEDIUM confidence, cross-checked across 3+ independent sources per topic and consistent in conclusions; flagged as MEDIUM (not HIGH) since these are third-party blog/aggregator analyses rather than first-party vendor documentation

---
*Stack research for: marketing-agency homepage prototypes (editorial / full-screen-video / WebGL-3D), static no-build HTML/CSS/JS*
*Researched: 2026-07-23*
