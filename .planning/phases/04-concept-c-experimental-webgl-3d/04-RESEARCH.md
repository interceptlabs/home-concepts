# Phase 4: Concept C — Experimental WebGL/3D - Research

**Researched:** 2026-07-24
**Domain:** Vendored three.js 0.185.0 (no build step) — a scroll-driven, non-scroll-jacking camera dolly through 6 procedural toon-shaded objects, DOM-projected labels, device-tiered rendering, and a complete non-WebGL DOM path (below-fold sections + 3 full sub-pages)
**Confidence:** HIGH (repo files, vendored asset, content data shapes, Fritz/copy rules — read directly); HIGH (three.js core mechanics — MDN/three.js official docs + direct inspection of the vendored file itself); MEDIUM-HIGH (community-pattern idioms for scroll-camera lerp and hotspot layout — WebSearch cross-verified against three.js's own manual)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**The 3D metaphor (LOCKED): "the topic field"**
- A dark 3D void holds 6 procedural geometric objects — one per topic (Problems · InterceptOS · Work · Labs · Insights · Contact). No loaded model assets — fully procedural geometry (architecture research's recommendation to eliminate asset-loading risk).
- Geometry vocabulary honors Fritz: apex-up tetrahedra / triangular prisms (right angle at base, apex up — never inverted), plus rectangular slabs/cubes. The Intercept mark itself NEVER appears in the scene (mark is not decoration).
- Shading: flat-shaded with hard-stepped tones (MeshToonMaterial with a 3-5 step gradient map or equivalent posterized lighting) — this is the Fritz "no gradients = hard-edged equal steps" rule expressed in 3D. No smooth PBR falloff, no bloom/glow (no AI-slop neon).
- Palette: monochrome surface grays from tokens; Flarepop reserved for the focused/hovered object accent and label markers. One accent at a time.
- Subtle cursor parallax (scene tilts a few degrees toward the pointer, sine-eased, disabled on touch + reduced-motion).

**Scroll & camera (CONC-03 — no scroll-jacking)**
- The page is a normal, natively-scrolling document ~400vh tall. The canvas is `position: fixed` behind everything. Camera position = pure function of `scrollY` (eased dolly through the field, each topic object coming into focus in sequence). Wheel/trackpad/keyboard/scrollbar all remain native; back button and deep links intact.
- After the 3D scroll range, the page continues into standard DOM sections (below-fold): verbatim teaser blocks for topics without full sub-pages (problems, labs) + the convert block + footer. 3D is concentrated in the hero/nav zone per CONC-01.
- Scroll position indicator: a mono-font topic index (current topic highlighted) fixed at the edge — doubles as a visible nav that works by click (smooth-scrolls, reduced-motion → instant jump).

**Labels & hotspots (CONC-02 — no mystery meat)**
- Topic labels are real DOM `<a>`/`<button>` elements projected from 3D world positions (three.js `Vector3.project()` → CSS transform), NOT canvas-drawn text. Always visible (not hover-revealed), mono font, Flarepop marker dot, ≥44px hit area, `:focus-visible` treatment.
- Because labels are DOM: they're keyboard-tabbable in a logical order, screen-reader readable, and `data-copy` annotatable. Hover/focus highlights the linked 3D object (the Flarepop accent); the label itself is the click target (bigger, more reliable than raycasting; raycast click on the object is a bonus, not the primary affordance).
- Topics with full sub-pages route there (View Transition cross-fade, same idiom as A/B). Topics without full pages (problems, labs, contact) smooth-scroll to their below-fold DOM section — no dead ends, no invented routes.

**Sub-pages**
- Ship 3 full pages: `interceptos.html`, `work.html` (consolidated, B-style), `insights.html` — quiet, typographic, dark; NO WebGL on sub-pages (keeps weight down, proves the "3D as nav, DOM as content" split). Persistent way back.
- Below-fold homepage sections carry verbatim teaser refs for problems + labs and the full convert block, all `data-copy` annotated.

**Fallbacks & device tiering (CONC-04, CONC-05 — built ALONGSIDE, not after)**
- Semantic DOM mirror is the page itself: the projected labels + below-fold sections form a complete, working nav/content path with the canvas absent. `<canvas>` is `aria-hidden="true"`; an offscreen-but-focusable summary list mirrors the 6 topics for screen readers.
- WebGL2 capability check BEFORE renderer init; failure → `.no-webgl` class → canvas never created, a static hard-stepped CSS backdrop takes its place, labels lay out in a fixed constellation. Same path for `prefers-reduced-motion` (no camera dolly, no parallax — static composed scene at DPR 1, or the no-webgl layout; planner's choice, document it).
- DPR clamp: `Math.min(devicePixelRatio, 2)` desktop, 1.5 on small screens; `powerPreference: "low-power"`; render loop pauses on `visibilitychange` hidden and when canvas offscreen; degrade step-count/object detail on low tiers (simple heuristic: deviceMemory/hardwareConcurrency if present, else screen size).
- three.js vendored locally (single `three.module.js` file into `concept-c/assets/vendor/`, version pinned r185-line, downloaded once during build — record exact version in an ASSETS.md). No CDN dependency at runtime; import map or direct module import — no build step.

**Copy discipline**
- Same as A/B: every rendered text node from canonical refs with `data-copy`; `python3 qa/copy-diff.py concept-c/index.html concept-c/pages/*.html` exits 0 in task verifies; full brand grep suite including the border-hairline grep.

### Claude's Discretion
- Exact object shapes per topic, field composition, camera path keyframes
- Toon step count (3-5), light rig
- Whether the focused object gets a slight rotation idle (sine, long period) — keep it calm

### Deferred Ideas (OUT OF SCOPE)
- Cursor-reactive particle/shader hero accents (ENH-04, v2)
- Portal/morph transitions (ENH-03, v2)
- Raycast-driven object picking as primary interaction (labels stay primary in v1)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-------------------|
| CONC-01 | three.js 3D scene as spatial nav metaphor, concentrated in hero/nav zone — content below is standard performant DOM | Architecture Patterns (project structure, hero-zone containment) + Content Data Shapes routing map (which topics stay in the 3D/below-fold split) |
| CONC-02 | Clickable 3D objects/hotspots with visible hover AND focus labels route to derived sub-pages | Pattern: DOM-projected labels via `Vector3.project()` (Code Examples) + Pitfall: behind-camera hiding must not steal focus + Don't Hand-Roll (raycast is a bonus, not primary) |
| CONC-03 | Scroll drives camera/scene movement while native scroll, back button, deep links stay intact (no scroll-jacking) | Pattern: rAF-driven `scrollY` read + critically-damped lerp toward a `CatmullRomCurve3` path (Code Examples) — no `preventDefault`, no wheel remapping |
| CONC-04 | Semantic DOM mirror built alongside the 3D layer — keyboard navigable, screen-reader readable, shown outright when WebGL unavailable or reduced-motion set | Pattern: two-layer nav (persistent mono topic index + projected in-scene labels) + `.no-webgl` static fallback (reuses concept-a's stepped-field CSS recipe) + Open Question on collapsing the offscreen summary list into the topic index |
| CONC-05 | Device-tiered rendering (DPR clamp, capability detection, graceful degradation) keeps the scene usable on integrated GPUs/mobile | Pattern: WebGL2 capability probe BEFORE renderer construction (Code Examples) + Pitfall: IntersectionObserver is a no-op on a `position:fixed` full-viewport canvas — use the same `scrollY` threshold already computed for the camera to gate the render loop, not IO |

</phase_requirements>

## Summary

Concept C's build has one genuinely load-bearing correctness risk that isn't obvious from CONTEXT.md's own wording, and everything else is a well-documented, stable three.js/DOM pattern that just needs to be assembled correctly.

**The load-bearing finding:** CONTEXT.md describes the vendored asset as "a single `three.module.js` file... self-contained." This is not true for three.js 0.185.0 (or any recent release). Since three.js split its build into `three.module.js` + `three.core.js` (a packaging change made for tree-shaking/internal reasons, not a prototype-specific concern), `build/three.module.js` is now a thin re-export shim that does exactly one thing: `import {...} from './three.core.js'` and `export {...} from './three.core.js'`. It has no other relative or bare-specifier imports — confirmed by grepping the actual vendored file (`concept-c/assets/vendor/three.module.js`, 650,153 bytes, matches jsDelivr's reported 634.92KB `three.module.js` for 0.185.0). But `three.core.js` (1.38MB) was never fetched — `concept-c/assets/vendor/` currently contains only `three.module.js` and `ASSETS.md`. As shipped today, any page doing `import * as THREE from '../assets/vendor/three.module.js'` will fail at module-resolution time with a 404 on the sibling `./three.core.js`. This is a **Wave 0 gap**: fetch `https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.core.js` alongside the existing file, update `ASSETS.md` with both files' provenance, and the plain relative-import approach (no import map needed) works exactly as CONTEXT.md intends — just with two vendored files instead of one. No addon modules (`examples/jsm/...`) are needed at all: `MeshToonMaterial`, `CatmullRomCurve3`, `DataTexture`, `TetrahedronGeometry`, and every other primitive this phase needs are all exported directly from `three.core.js` and re-exported by `three.module.js`.

**The second finding worth flagging early:** CONTEXT.md's device-tiering bullet says pause "when canvas offscreen," implying an IntersectionObserver check — but the canvas is `position: fixed; inset: 0`, so its bounding rect is geometrically always intersecting the viewport (IntersectionObserver has no concept of z-index occlusion by opaque DOM content stacked on top). Don't build an IO watcher for this. The render loop already needs to read `scrollY` every frame to drive the camera — reuse that exact same read to gate the loop: once `scrollY` exceeds the ~400vh hero-zone height (plus a small buffer), stop calling `requestAnimationFrame`/`renderer.render()` entirely (the canvas is now fully covered by the below-fold sections' opaque backgrounds anyway). Resume when scrolling back up. This is simpler than it sounds and eliminates a whole category of "why does the fan keep spinning on a static page" bug.

**Third:** three.js 0.185.0's `WebGLRenderer` requests a WebGL2 context automatically and falls back to WebGL1 when WebGL2 isn't available (this has been the default since well before r180) — so the "WebGL2 capability check BEFORE renderer init" CONTEXT calls for is a *separate, explicit* probe (`canvas.getContext('webgl2')`, throwaway canvas) done before ever constructing `THREE.WebGLRenderer`, not something `WebGLRenderer`'s own fallback behavior can substitute for — the project's requirement is specifically to gate on WebGL2 (not silently accept a WebGL1 fallback), matching the "usable on integrated GPUs" tiering goal.

**Primary recommendation:** Vendor `three.core.js` alongside the existing `three.module.js` (Wave 0), gate everything behind an explicit `getContext('webgl2')` probe done on a throwaway canvas before constructing the real renderer, drive the camera from a `requestAnimationFrame` loop that reads `scrollY` and lerps toward a point on a `CatmullRomCurve3` (never touching wheel/touch events), project all 6 labels every frame via `Vector3.project()` into `translate3d` CSS transforms, and treat the always-visible mono-font topic index (not the in-scene projected labels) as the one nav element that must independently satisfy full keyboard/screen-reader access — the projected labels are a spatial *enhancement* on top of that, not the sole path.

## Content Data Shapes & Routing Map

**Reused verbatim from `03-RESEARCH.md`** (same `content/homepage.json` + `content/subpages.json`, same `qa/copy-diff.py` string-leaf mechanics — not re-derived): the per-topic ref classification (STRING_LEAF vs ARRAY vs OBJECT, and every trap: `problems.items.3.signalNum` empty string, `os.flows[i].stages[3].agents` absent key, `work.cases[i].agents` singular string despite the plural name, `work.cases[i].results` variable-length array). Only what's new for Concept C is documented below: **which topics get a full page vs. a below-fold teaser is different from Concept B's split**, and Insights gets a full page here (it didn't in B).

### Routing map (all 6 topics)

| Topic | 3D object in scene? | Destination when its label/hotspot is activated | Below-fold section? |
|---|---|---|---|
| Problems | yes | smooth-scroll to `#problems` below-fold section (no full page) | yes — teaser only |
| InterceptOS | yes | route to `pages/interceptos.html` (View Transition cross-fade) | no |
| Work | yes | route to `pages/work.html` (consolidated, all 3 cases — same idiom as `concept-b/pages/work.html`) | no |
| Labs | yes | smooth-scroll to `#labs` below-fold section (no full page) | yes — teaser only |
| Insights | yes | route to `pages/insights.html` (NEW full page — neither A nor B built this as a standalone page) | no |
| Contact | yes | smooth-scroll to `#convert` below-fold section (no full page, no modal) | yes — the convert block |

This is the opposite split from Concept B (which shipped `problems.html`/`interceptos.html`/`work.html` full pages and treated labs/insights/contact as panel-only) — don't reuse B's page list, only its *idioms* (per architecture rule: concepts consume `content/`/`shared/` only, never each other's directories or content decisions).

### Below-fold teaser sections (problems, labs, convert — reuse verbatim from 03-RESEARCH)

| Section | teaser_refs (all direct STRING_LEAF unless noted) | Traps |
|---|---|---|
| `#problems` | `problems.eyebrow`, `problems.h2`, `problems.lead`, `problems.items.{0-3}.tabEyebrow`, `problems.items.{0-3}.tabName` | None of the deeper `full_refs` (quote/attrib/tells/signalNum/bridge) are needed — there's no full Problems page in this concept, so don't build them |
| `#labs` | `labs.label`, `labs.h2_html` (HTML-fragment, `data-copy` on wrapper, inner `<span class="hl">` preserved), `labs.body`, `labs.cta` (**OBJECT** → expand `.label`/`.href`; `.href` is a routing hook, not copy — point it at `#convert` like A/B's precedent, never the literal `#pitchLabs`), `labs.stat` (**OBJECT** → expand `.num`/`.label`) | `full_refs: []` by design — never fabricate deeper Labs copy |
| `#convert` | `convert.eyebrow`, `convert.h2`, `convert.lead`, `convert.cta` (**OBJECT {heading,sub,href}** → expand `.heading`/`.sub`; `.href` is a routing hook) | `subpages.json` lists `faqs.*` as available `full_refs` for a hypothetical full Contact page — **OUT OF SCOPE here** (no `contact.html`), same as Concept B's precedent |

### Full page: `interceptos.html` (reuse verbatim from 03-RESEARCH's InterceptOS table)
`os.flows` is an ARRAY[4] of dict, each with `.tabLabel`, `.job`, `.layer`, `.stages` (ARRAY[4] of dict: `.tag`/`.name`/`.desc`/`.agents` — **`.agents` is present on stages 0-2, ABSENT on stage 3 "Outcome"**, guard for the missing key). `agents.categories` is ARRAY[4] of str. `agents.items` is ARRAY[13] of dict, each with `.name`/`.type`/`.role`/`.desc`/`.solves` (ARRAY of 1-2 str, needs its own per-index expansion)/`.sample`.

### Full page: `work.html` (consolidated — direct code precedent already exists at `concept-b/pages/work.html`)
All 3 cases on one page (`work.cases.0/1/2`), each: `.client`/`.tag`/`.name`/`.summary`/`.metric` (**OBJECT** → `.num`/`.label`), `.challenge`/`.approach` (STRING_LEAF), `.results` (**ARRAY, variable length: 4 items for cases 0-1, 5 for case 2** — render as `<li>` list, per-index expand), `.agents` (**STRING_LEAF despite the plural name** — e.g. `"Atom · Camille (multi-agent program)"` — render as one text node, never iterate). `concept-b/pages/work.html` is a working, already-built, copy-diff-passing implementation of exactly this consolidated structure — read it directly as the idiom precedent (own CSS file, no cross-linking).

### Full page: `insights.html` (NEW for Concept C — neither A nor B built this as a standalone page)
`insights.eyebrow`, `.h2`, `.lead` (STRING_LEAF, direct). `insights.episodes` is an **ARRAY[3] of dict**: `.episode`, `.show`, `.title`, `.guest.name`, `.guest.role` (nested 2 levels), `.summary`, `.links` (**ARRAY of {label,href}, 3 items per episode** — expand `.links.0.label`/`.href` etc.), `.tile_href` (routing hook, not copy). `full_refs: []` by design — `subpages.json`'s own note: "Insights has no separate teaser/full copy split... the sub-page may only change layout/presentation depth (e.g. a dedicated episodes index), never add or infer new episode copy." This directly licenses `insights.html` as a **layout-only** upgrade of the same episode data already on the homepage (one episode per section/row instead of a compact tease) — no new copy to source or invent.

### Hero (homepage only)
`hero.kicker` + `hero.h1_html` (Flarepop `<em>` treatment on "ambitious"/"proven" + `.dot` span) — same scope precedent as Concept B (locks out `hero.sub`/`hero.cta`, which is compliant; concepts aren't required to render every canonical field).

## Architecture Patterns

### Recommended Project Structure
```
concept-c/
├── index.html                   # canvas (fixed) + hero copy + mono topic-index nav + below-fold sections
├── pages/
│   ├── interceptos.html
│   ├── work.html                 # ALL 3 cases stacked (same idiom as concept-b/pages/work.html)
│   └── insights.html             # NEW — layout-only episode index, no new copy
├── assets/
│   ├── vendor/
│   │   ├── three.module.js       # already vendored (0.185.0)
│   │   └── three.core.js         # MISSING — Wave 0 gap, fetch from jsDelivr, same pin
│   ├── css/concept-c.css         # tokens only; .no-webgl fallback backdrop lives here
│   └── js/
│       ├── scene.js              # capability probe, renderer/scene/camera/objects, toon material
│       ├── camera-path.js        # CatmullRomCurve3 + scrollY→lerp, render-loop gating
│       ├── labels.js             # Vector3.project() → CSS transform per label, focus/behind-camera handling
│       └── reveal.js             # below-fold [data-reveal] idiom (own file, same pattern as A/B)
```

### Pattern 1: Capability probe strictly before renderer construction
**What:** A throwaway `<canvas>` (never attached to the DOM) calls `getContext('webgl2')`. If it returns `null`, add `.no-webgl` to `<html>`/`<body>` and stop — never construct `THREE.WebGLRenderer`, never create the real `<canvas>`.
**Why not just let `WebGLRenderer` fall back:** `WebGLRenderer` will happily construct a WebGL1 context if WebGL2 isn't available (its own internal fallback, true since well before r180) — but CONTEXT's requirement is to gate the *whole experimental scene* on WebGL2 specifically, not silently degrade to WebGL1 for a "device-tiered rendering... usable on integrated GPUs" requirement. The explicit probe is the only way to actually enforce that decision rather than inherit whatever `WebGLRenderer` chooses.
**Example:**
```js
function hasWebGL2() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2'));
  } catch (e) {
    return false;
  }
}
if (!hasWebGL2()) {
  document.documentElement.classList.add('no-webgl');
  // stop here — no renderer, no canvas element created at all
} else {
  initScene(); // dynamic import or plain function call into scene.js
}
```
Source: MDN `HTMLCanvasElement.getContext()`, cross-verified against multiple 2026 WebGL-detection write-ups (community consensus pattern, no single canonical spec doc for "the" detection idiom since this is standard practice rather than a platform API in itself).

### Pattern 2: Render loop gated by the same `scrollY` read the camera already needs (not IntersectionObserver)
**What:** Because the canvas is `position: fixed; inset: 0`, it is geometrically always "intersecting" the viewport — an `IntersectionObserver` on it is a no-op that will never fire a meaningful callback. Instead, reuse the `scrollY` value already read every frame for the camera dolly: once scroll has passed the ~400vh hero-zone height (plus a small buffer so the last camera position doesn't get cut off mid-ease), stop calling `requestAnimationFrame` and `renderer.render()`. Resume on scroll back up.
**When to use:** Any full-viewport `position: fixed` canvas — this is the general-purpose correction to CONTEXT's "pauses... when canvas offscreen" wording.
**Example:**
```js
const HERO_ZONE_PX = () => document.querySelector('.hero-zone').offsetHeight;
let rafId = null;
let running = false;

function shouldRun() {
  return !document.hidden && window.scrollY < HERO_ZONE_PX() + 200;
}

function tick() {
  updateCameraFromScroll(window.scrollY);
  updateLabels();
  renderer.render(scene, camera);
  if (shouldRun()) { rafId = requestAnimationFrame(tick); }
  else { running = false; }
}

function ensureRunning() {
  if (!running && shouldRun()) { running = true; rafId = requestAnimationFrame(tick); }
}

window.addEventListener('scroll', ensureRunning, { passive: true });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { if (rafId) cancelAnimationFrame(rafId); running = false; }
  else { ensureRunning(); }
});
ensureRunning();
```

### Pattern 3: Scroll-position-aware (not scroll-jacked) camera via `CatmullRomCurve3` + damped lerp
**What:** Native scroll is never intercepted (no `preventDefault`, no wheel/touch remapping). A `requestAnimationFrame` loop reads the current `scrollY`, normalizes it to a 0-1 progress value across the hero zone, evaluates a point/tangent on a `CatmullRomCurve3` built from a handful of keyframe positions (one per topic, planner's discretion on exact placement), and **lerps the actual camera position/lookAt a fraction of the way toward that target each frame** (critically-damped feel) rather than snapping directly to it — this is what gives "eased dolly" motion without ever touching the scroll event itself.
**Example:**
```js
const curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 20),   // start
  new THREE.Vector3(4, 1, 12),   // topic 1 framing
  new THREE.Vector3(-3, 2, 4),   // topic 2 framing
  // ... one point per topic + a start/end pad
], false, 'catmullrom', 0.5);

const targetPos = new THREE.Vector3();
const smoothPos = new THREE.Vector3().copy(curve.getPointAt(0));

function updateCameraFromScroll(scrollY) {
  const t = THREE.MathUtils.clamp(scrollY / HERO_ZONE_PX(), 0, 1);
  curve.getPointAt(t, targetPos);
  smoothPos.lerp(targetPos, 0.08); // 0.05-0.1 = "camera on a spring", not instant snap
  camera.position.copy(smoothPos);
  camera.lookAt(0, 0, 0); // or a second curve for look-at targets, planner's discretion
}
```
**Why this satisfies CONC-03:** the scroll input itself is never read as a delta or captured — it's sampled as an absolute position every frame, exactly like a parallax reveal would be, so keyboard scroll (Space/PageDown/arrow keys), scrollbar drag, and the back button/deep-link-to-anchor case all move the camera correctly with zero special-case code, because they all just change `window.scrollY`, which is all this loop reads. This is materially different from (and safe against) the "remap wheel-delta to camera position" scroll-jacking anti-pattern PITFALLS.md flags — no `wheel`/`touchmove` listeners exist at all in this pattern.
**Sources:** three.js `CatmullRomCurve3` is exported directly from `three.core.js` (confirmed present in the vendored file's export list — no addon needed); damped-lerp-toward-target-not-instant-snap is the community-consensus technique across multiple independent 2026 write-ups (Codrops, bradwoods.io, Builder.io) cross-checked against three.js's own manual "Align HTML elements to 3D" page for the projection half of this pattern.

### Pattern 4: DOM-projected labels via `Vector3.project()`
**What:** Every frame (same `tick()` as Pattern 2/3), for each of the 6 label elements, project that topic's 3D world position through the current camera into normalized device coordinates, convert to CSS pixel coordinates, and apply as a `transform`. Use the projected `z` to both hide labels whose object is behind/outside the frustum and to `z-index`-sort labels so nearer topics' labels sit above farther ones.
**Example (three.js's own documented idiom, from the official manual):**
```js
const tempV = new THREE.Vector3();

function updateLabels() {
  for (const { object3D, el } of labelBindings) {
    tempV.setFromMatrixPosition(object3D.matrixWorld);
    tempV.project(camera);

    if (Math.abs(tempV.z) > 1) {
      // point is outside the near/far frustum (behind camera or past far plane)
      el.classList.add('is-hidden');   // see Pitfall below — never display:none an element that may hold focus
      continue;
    }
    el.classList.remove('is-hidden');
    const x = (tempV.x *  0.5 + 0.5) * canvasEl.clientWidth;
    const y = (tempV.y * -0.5 + 0.5) * canvasEl.clientHeight;
    el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    el.style.zIndex = String((( -tempV.z * 0.5 + 0.5) * 100000) | 0);
  }
}
```
**Source:** [threejs.org manual — "Align HTML Elements to 3D"](https://threejs.org/manual/en/align-html-elements-to-3d.html) — WebFetched directly, this is the library's own canonical pattern, not a third-party derivation.

### Pattern 5: Two-layer navigation — persistent topic index (primary a11y path) + projected labels (spatial enhancement)
**What:** CONTEXT specifies both "a mono-font topic index... fixed at the edge... doubles as a visible nav that works by click" AND "an offscreen-but-focusable summary list [that] mirrors the 6 topics for screen readers" AND per-object projected DOM labels. Treat the **fixed mono topic index as the one real, always-present, always-tabbable, always-in-logical-order `<nav>`** that independently satisfies CONC-04's keyboard/screen-reader requirement on its own — regardless of camera position, WebGL availability, or which objects are currently in frustum. The per-object projected labels (Pattern 4) are a *supplementary* spatial affordance tied to the object's current on-screen position; they may legitimately be visually absent when their object is behind/outside the camera frustum during the scroll journey, because the topic index already guarantees full access to all 6 topics at all times.
**Why this resolves the "labels must not trap focus during camera motion" requirement:** since the topic index is the accessibility-guaranteeing layer, a projected label temporarily hiding (Pattern 4's `is-hidden` class, driven by `visibility: hidden` not `display: none` — see Pitfall below) never removes a visitor's ability to reach any topic; it only ever removes a secondary/enhanced entry point for objects not currently in view.
**Discretion flag:** whether the "offscreen-but-focusable summary list" CONTEXT separately describes should be the *same* element as the visible mono topic index (just styled to also be visually present), or a genuinely separate screen-reader-only duplicate, is not resolved by CONTEXT and is worth a planner decision — see Open Questions.

### Pattern 6: `MeshToonMaterial` + custom `DataTexture` gradient map for N-step hard shading
**What:** `MeshToonMaterial`'s default (no `gradientMap` set) already does a naive ~2-tone step, but a custom `gradientMap` gives exact control over step count (3-5, per CONTEXT's discretion range) and step contrast — required for the Fritz "hard-edged equal steps" rule.
**Example:**
```js
function makeStepGradientMap(steps) {
  const size = steps; // one texel per step
  const data = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    data[i] = Math.round((i / (size - 1)) * 255);
  }
  const gradientMap = new THREE.DataTexture(data, size, 1, THREE.RedFormat);
  gradientMap.minFilter = THREE.NearestFilter;   // REQUIRED — without Nearest, the GPU
  gradientMap.magFilter = THREE.NearestFilter;   // interpolates between texels and the
  gradientMap.needsUpdate = true;                // "hard step" effect silently becomes a smooth grade
  return gradientMap;
}

const material = new THREE.MeshToonMaterial({
  color: getComputedTokenColor('--surface-2'), // pull from shared/tokens.css, never a raw hex
  gradientMap: makeStepGradientMap(4),
});
```
**Pitfall this avoids:** forgetting `minFilter`/`magFilter = NearestFilter` on the `DataTexture` is the single most common mistake with this pattern — without it, the GPU linearly interpolates between the gradient map's texels and the "toon" stepped look silently degrades into exactly the smooth gradient the Fritz brand rule forbids, with no error or warning.
**Light rig needed:** `MeshToonMaterial` requires at least one light that produces a diffuse term — a single `DirectionalLight` plus a low-intensity `AmbientLight` (or `HemisphereLight` for a subtle sky/ground tint using two neutral tokens) is sufficient; CONTEXT leaves the exact rig to Claude's discretion.
**Sources:** three.js official `MeshToonMaterial`/`DataTexture` docs (WebSearch cross-verified against `threejs.org/docs`), community write-ups confirming the `NearestFilter` requirement.

### Pattern 7: `.no-webgl` static fallback — reuse Concept A's stepped-field CSS recipe
**What:** `concept-a/assets/css/concept-a.css` already has a working, Fritz-compliant "hard-edged equal steps, never a smooth grade" utility (`.section--stepped`, a `repeating-linear-gradient` with duplicated hard stop-offsets, used once for the InterceptOS band). Reuse this exact idiom (own copy, own file — concepts don't cross-link) as the `.no-webgl` backdrop, paired with the same percentage-anchored absolute-positioned hotspot layout Concept B already proved for labels-over-full-bleed-media (`concept-b`'s hotspot pattern), anchored against the static backdrop instead of video.
**Example (idiom, not a literal shared import):**
```css
.no-webgl .field-backdrop {
  background: repeating-linear-gradient(
    180deg,
    var(--surface-2) 0, var(--surface-2) 20%,
    var(--surface-3) 20%, var(--surface-3) 40%,
    var(--surface-2) 40%, var(--surface-2) 60%,
    var(--surface-3) 60%, var(--surface-3) 80%,
    var(--surface-2) 80%, var(--surface-2) 100%
  );
}
.no-webgl .topic-label { position: absolute; /* fixed constellation, percentage top/left per topic */ }
```

### Anti-Patterns to Avoid
- **Wheel/touch event remapping "for a cinematic feel":** this is scroll-jacking regardless of how gentle it looks in a demo — CONTEXT and PITFALLS.md both explicitly rule this out; Pattern 3 above is the compliant alternative.
- **`IntersectionObserver` on the fixed canvas to detect "offscreen":** see Pattern 2 — geometrically meaningless for a `position: fixed; inset: 0` element.
- **`display: none` on a projected label while it may hold keyboard focus:** removes focus unexpectedly (jumps to `<body>`); use `visibility: hidden` (or `opacity: 0; pointer-events: none;` while leaving it in normal flow) so a focused-but-currently-behind-camera label doesn't silently eject focus. Since Pattern 5 makes the topic index the real a11y guarantee, this is a belt-and-suspenders detail, not the sole safety net.
- **Constructing `THREE.WebGLRenderer` and relying on its own WebGL1 fallback instead of the explicit `getContext('webgl2')` probe:** silently ships a lower tier than CONTEXT's requirement, and skips the `.no-webgl` DOM-only path entirely for devices that could actually benefit from it (e.g., very old integrated GPUs where even a WebGL1 fallback would be a bad experience).
- **Bloom/glow post-processing:** CONTEXT explicitly bans this ("no bloom/glow, no AI-slop neon") — don't reach for `RenderPipeline`/`EffectComposer` at all; there is no post-processing pass in this phase's scope.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| N-step posterized/toon shading | A custom fragment shader with manual `floor()` banding via `onBeforeCompile` | `MeshToonMaterial` + a small `DataTexture` gradient map (Pattern 6) | Native material, zero shader authoring, exact step-count control — reserve `onBeforeCompile` only if toon shading is later found visually insufficient (CONTEXT itself only asks for this as a fallback path) |
| World-to-screen coordinate math for labels | Manual perspective-divide/NDC math from the projection matrix | `Vector3.project(camera)` (Pattern 4) | Exactly what this method does; it's three.js's own documented idiom, not a third-party trick |
| Smooth-scroll-to-anchor for the below-fold teaser links | A hand-rolled scroll-animation loop with easing math duplicated from Pattern 3 | native CSS `scroll-behavior: smooth` (with a `prefers-reduced-motion` override to `auto`/instant) or `Element.scrollIntoView({ behavior })` | Same idiom already established in concept-a/b for anchor nav; no reason to duplicate easing code for a different, simpler use case |
| Detecting a "low tier" device for step-count/geometry-detail degradation | A bespoke GPU-benchmarking probe | `navigator.deviceMemory` + `navigator.hardwareConcurrency` (both if present) with a screen-size fallback | Sufficient signal for a marketing-prototype tiering heuristic; see Pitfall below for the Safari/Firefox caveat on `deviceMemory` |
| Camera path spline | Hand-rolled Catmull-Rom or Bezier interpolation | `THREE.CatmullRomCurve3` (core export, no addon) | Already in the vendored file, already the community-standard choice for exactly this "camera path through keyframes" use case |

**Key insight:** every genuinely custom piece of code this phase needs is orchestration (reading `scrollY`, lerping toward a curve point, projecting label positions, gating the render loop) — none of it is "reimplement a three.js primitive." The only new custom logic beyond wiring is the capability-tiering heuristic and the reduced-motion/no-webgl decision tree, both of which are inherently project-specific judgment calls, not solved problems to import.

## Common Pitfalls

### Pitfall 1: Vendored `three.module.js` alone will not load — `three.core.js` is a required sibling file
**What goes wrong:** `import * as THREE from '../assets/vendor/three.module.js'` throws a module-resolution error (404 on `./three.core.js`) the moment it's actually loaded in a browser, because `three.module.js` in three.js 0.185.0 is a thin re-export shim over `three.core.js`, not a self-contained bundle.
**Why it happens:** three.js's npm/CDN package structure changed to split the two files (for internal tree-shaking reasons); CONTEXT.md's "single file, self-contained" description predates or wasn't checked against this packaging change.
**How to avoid:** Wave 0 task: fetch `https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.core.js` into `concept-c/assets/vendor/three.core.js` (same directory, same version pin), update `concept-c/assets/vendor/ASSETS.md` to document both files' provenance.
**Warning signs:** a blank page with a console error naming `three.core.js` as a failed fetch/module load; works if accidentally loaded from a CDN-based import map (which would resolve the sibling import against jsDelivr) but breaks the moment it's pointed at the local vendored copy.
**Source:** direct inspection — grepped the vendored file for `from '.` and confirmed the single reference; cross-checked jsDelivr's own directory listing for `three@0.185.0/build/` (WebFetch), which lists `three.core.js` as a separate 1.38MB file.

### Pitfall 2: `IntersectionObserver` cannot detect "past the 3D zone" for a `position: fixed` canvas
**What goes wrong:** A developer wires up an `IntersectionObserver` on the canvas expecting it to fire when the user scrolls past the hero zone (to pause the render loop) — it never does, because a `position: fixed; inset: 0` element's bounding rect is always fully inside the viewport, regardless of scroll position or what opaque DOM content is stacked on top of it.
**How to avoid:** see Architecture Pattern 2 — gate the render loop on the same `scrollY` value already being read for the camera, not on an observer.
**Warning signs:** fan noise / high GPU usage persists even after scrolling well past the 3D hero zone into the below-fold sections.

### Pitfall 3: `deviceMemory` is Chromium-only — the low-tier heuristic needs a fallback path
**What goes wrong:** `navigator.deviceMemory` is `undefined` in Safari and Firefox entirely (not just imprecise) — a tiering heuristic that only checks `deviceMemory` silently never degrades anything for ~40%+ of real-world traffic (all Safari/Firefox visitors), defeating CONC-05's device-tiering intent on exactly the browsers most likely to be on an integrated GPU (Safari on MacBook Air).
**How to avoid:** Check `navigator.hardwareConcurrency` (broadly supported across evergreen browsers) as the primary signal, treat `navigator.deviceMemory` as a Chromium-only bonus signal when present, and fall back to a `matchMedia`-based screen-size heuristic (e.g., narrow viewport width as a mobile-tier proxy) when neither API is available — never gate tiering on `deviceMemory` alone.
**Source:** MDN `Navigator.deviceMemory` — the API's own spec note states it's part of the (non-standardized-everywhere) Device Memory API, not implemented in Safari/Firefox as of this research.

### Pitfall 4: `MeshToonMaterial` gradient map without `NearestFilter` silently becomes a smooth gradient
**What goes wrong:** A `DataTexture` gradient map assigned to `gradientMap` without setting `minFilter`/`magFilter` to `THREE.NearestFilter` gets GPU-interpolated between texels — the hard-stepped toon look degrades into exactly the smooth falloff the Fritz "no gradients" rule forbids, with no console warning to flag the mistake.
**How to avoid:** always set both filters and `needsUpdate = true` before use (Pattern 6's code example does this correctly) — this is the single line most likely to be silently skipped by a developer copying a `MeshToonMaterial` example that doesn't happen to need custom banding.
**Warning signs:** the object's shading looks like ordinary Lambert/Phong smooth shading rather than distinct visible bands — visually identical to the exact anti-pattern the phase must avoid, making it easy to miss without a deliberate comparison against a working example.

### Pitfall 5: A projected label hidden via `display: none` steals focus mid-interaction
**What goes wrong:** If a visitor tabs to a projected label and then scrolls (moving the camera, potentially rotating that object's world position behind the frustum), and the label-hiding code uses `display: none`, focus is silently reset to `<body>` — the visitor loses their place in the tab order with no warning.
**How to avoid:** use `visibility: hidden` (removes from the accessibility tree and click/tab targeting without triggering a focus-loss reflow) or simply leave the element focusable but visually faded/`pointer-events: none` while off-frustum. Combined with Pattern 5 (the topic index as the real a11y guarantee), this is a secondary safety net, not the only one.
**Source:** general focus-management best practice (WCAG technique consensus); no single canonical spec doc for this exact "3D-projected DOM label" scenario since it's a novel combination, but the underlying `display:none`-loses-focus behavior is well-documented DOM/accessibility fact.

## Code Examples

### Wave-0 vendoring fix (shell, not application code)
```bash
curl -o concept-c/assets/vendor/three.core.js \
  https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.core.js
# then update concept-c/assets/vendor/ASSETS.md to document both files
```

### Import — direct relative, no import map needed
```html
<script type="module" src="/concept-c/assets/js/scene.js"></script>
```
```js
// scene.js
import * as THREE from '../vendor/three.module.js';
// three.module.js resolves its own sibling import to './three.core.js' relative
// to itself — as long as both files sit in the same vendor/ directory, this
// works with zero import map, exactly as CONTEXT intends (just two files, not one).
```

### Reduced-motion + no-webgl decision (recommended default)
```js
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!hasWebGL2()) {
  document.documentElement.classList.add('no-webgl');
} else if (prefersReducedMotion) {
  document.documentElement.classList.add('static-scene');
  initScene({ animated: false }); // renders once at a fixed "overview" camera framing
  // showing all 6 objects; labels projected once + recomputed on resize only;
  // no rAF loop, no cursor parallax, no scroll-driven lerp.
} else {
  initScene({ animated: true });
}
```
See Open Questions for the reasoning behind recommending a static-but-still-3D scene over reusing the flat `.no-webgl` CSS backdrop for the reduced-motion case.

## State of the Art

| Old/assumed approach | Current approach | Impact |
|---|---|---|
| Believing `WebGLRenderer` needs to be explicitly told to use WebGL2 (older three.js versions, and one WebSearch snippet that echoed this outdated claim) | Since well before r180 (and definitely at 0.185.0), `WebGLRenderer` requests WebGL2 automatically and falls back to WebGL1 transparently — no explicit context-passing needed for that fallback behavior itself | Don't hand-roll a manual `canvas.getContext('webgl2')` + pass-context-to-renderer dance for the *fallback* — that's automatic. The explicit probe this phase needs is for a different reason: gating the whole experimental scene on/off before the renderer is ever constructed (Pattern 1), not for enabling WebGL2 usage |
| `three.module.js` as historically distributed = one self-contained bundle | 0.185.0's `three.module.js` is a re-export shim requiring the sibling `three.core.js` (Pitfall 1) | Any "vendor a single file" plan for three.js written from pre-split-era knowledge needs correcting — this project's own CONTEXT.md is exactly that case |
| `EffectComposer`-based post-processing | `RenderPipeline` (three.js r183+) is the newer, simpler post-processing entry point | Not relevant to this phase — CONTEXT explicitly forbids bloom/glow, so no post-processing pass is in scope either way; noted only so the planner doesn't accidentally reach for either API |
| Firefox shipping cross-document View Transitions "at 144+" (this project's own prior `02-RESEARCH.md`/`STACK.md` claim, already corrected once in `03-RESEARCH.md`) | Still flag-gated/partial in Firefox as of this research date | Carries forward unchanged to Concept C's `interceptos.html`/`work.html`/`insights.html` navigation — treat Firefox as plain-navigation-no-transition, same as A and B already do; progressive enhancement means no code changes are needed either way |

## Open Questions

1. **Should `prefers-reduced-motion` fall back to the flat `.no-webgl` CSS backdrop, or to a static (non-animated) three.js scene?**
   - What we know: CONTEXT explicitly leaves this to "planner's choice, document it." Both are technically valid.
   - What's unclear: which reads better for the actual review — Jon (and any reduced-motion visitor with a perfectly capable GPU) would see a flat gradient placeholder under the `.no-webgl` choice, versus the actual procedural 3D objects (frozen, no camera dolly, no parallax) under the static-scene choice.
   - Recommendation: prefer the **static composed 3D scene** (Code Examples above) as the default — it still shows the actual "experimental WebGL/3D" concept being reviewed (which is the whole point of Concept C) rather than silently substituting the failure-case fallback for a group of visitors who have full WebGL2 capability and just asked for less motion. Reserve `.no-webgl` purely for genuine capability failures. This does mean the static-scene path still needs the full renderer/scene/material setup (just no rAF loop after first render + a resize-triggered one-shot re-layout), which is a small amount of extra code versus reusing `.no-webgl` outright — flagged as a discretionary tradeoff, not a hard requirement.

2. **Is the "offscreen-but-focusable summary list" (CONC-04) meant to be the same element as the visible mono-font topic index, or a separate hidden duplicate?**
   - What we know: CONTEXT's decisions section mentions both in adjacent bullets, without explicitly saying whether they're one element or two.
   - What's unclear: building both literally would create two tab stops per topic (12 total instead of 6), which is more likely to read as a bug (duplicate-sounding screen-reader output) than a deliberate redundancy.
   - Recommendation: collapse into **one** real `<nav>` element — the visible mono topic index — that is itself the complete, always-present, semantically-correct, keyboard-and-screen-reader-accessible list of all 6 topics (Pattern 5). Don't build a second hidden copy unless the visible index is deliberately terse (e.g., numerals/dots only, no full topic names) in which case a supplementary `aria-label`/visually-hidden text per index item (not a whole separate list) covers the gap more cleanly.

3. **Does a raycast-driven hover highlight on the 3D object itself (Flarepop accent, per CONTEXT's "hover/focus highlights the linked 3D object") need `Raycaster` + pointer events, and does that conflict with "labels are the primary click target, not raycasting"?**
   - What we know: CONTEXT is explicit that the label is the primary/reliable click target and raycast-click on the object is "a bonus, not the primary affordance." Deferred Ideas separately excludes "raycast-driven object picking as primary interaction" from v1 scope entirely.
   - What's unclear: whether even the *secondary/bonus* raycast interaction (hover-highlight-the-object, optional click-through) is in scope for this phase, or should be skipped entirely in v1 and revisited only if time allows.
   - Recommendation: treat raycast-based object highlighting as optional polish, not a phase requirement — CONC-02 is fully satisfied by the DOM label alone (visible hover AND focus states, routes on click/Enter). If implemented, gate it behind pointer-fine media query (`@media (hover: hover) and (pointer: fine)`) so it never becomes an expected-but-missing affordance on touch.

## Sources

### Primary (HIGH confidence)
- `concept-c/assets/vendor/three.module.js` (the actual vendored file, 650,153 bytes) — grepped directly for every `from '.` import to confirm the single sibling dependency on `./three.core.js`
- `concept-c/assets/vendor/ASSETS.md`, `concept-c/index.html`, `content/homepage.json`, `content/subpages.json`, `shared/tokens.css`, `shared/motion.css`, `shared/README.md`, `concept-a/assets/css/concept-a.css` (stepped-field recipe), `concept-b/pages/work.html` (consolidated-work precedent), `.planning/phases/03-.../03-RESEARCH.md`, `.planning/research/STACK.md`, `.planning/research/PITFALLS.md`, `.planning/REQUIREMENTS.md`, `.planning/STATE.md` — read directly from repo
- [jsDelivr directory listing, three@0.185.0/build/](https://cdn.jsdelivr.net/npm/three@0.185.0/build/) — WebFetched directly; confirms `three.core.js` (1.38MB) exists as a separate file from `three.module.js` (634.92KB, matches the vendored file's size)
- [threejs.org manual — Align HTML Elements to 3D](https://threejs.org/manual/en/align-html-elements-to-3d.html) — WebFetched directly; the library's own canonical `Vector3.project()` → CSS transform pattern, including the `Math.abs(z) > 1` behind-camera check and z-index sort formula
- [MDN: `HTMLCanvasElement.getContext()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext) — capability probe idiom
- [three.js docs — `WebGLRenderer`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) — WebFetched; confirms automatic WebGL2-with-WebGL1-fallback default behavior, constructor options (`powerPreference`, `antialias`, `failIfMajorPerformanceCaveat`)

### Secondary (MEDIUM confidence)
- `MeshToonMaterial`/`DataTexture` gradient-map + `NearestFilter` requirement — WebSearch, cross-verified across three.js's own docs page, a Medium walkthrough, and sbcode.net's MeshToonMaterial tutorial (multiple independent sources agreeing on the exact mechanic and the NearestFilter gotcha)
- Scroll-driven camera lerp/damping idiom (`CatmullRomCurve3` + fractional-lerp-toward-target each frame) — WebSearch, cross-verified across Codrops' "Crafting Scroll Based Animations in Three.js," bradwoods.io's scroll-driven-camera-animation note, and Builder.io's Apple-style scroll animation write-up (independent sources, consistent technique)
- `navigator.deviceMemory` Chromium-only limitation — MDN's own API reference (spec-status note), consistent with general browser-compat knowledge
- WebGL2 capability-detection idiom (`getContext('webgl2')` throwaway probe) — WebSearch, community-consensus pattern across multiple 2026 write-ups, no single canonical spec doc since this is standard practice rather than a documented platform API pattern in itself

### Tertiary (LOW confidence)
- None — every finding above was either read directly from repo files, WebFetched from an official/library source, or cross-verified across 2+ independent sources.

## Metadata

**Confidence breakdown:**
- Vendoring gap (`three.core.js` missing) — HIGH: directly grepped the actual vendored file and cross-checked file sizes against jsDelivr's own directory listing, not inferred
- Content data shapes / routing map — HIGH: reused 03-RESEARCH's already-verified per-topic ref classification (built by resolving every ref against the real `content/homepage.json`), re-mapped only the page-vs-teaser split per this phase's own CONTEXT
- Core three.js mechanics (`Vector3.project()`, `MeshToonMaterial`/gradientMap, `WebGLRenderer` WebGL2-default behavior, `CatmullRomCurve3`) — HIGH: WebFetched from three.js's own docs/manual, not solely training-data recall
- Scroll-camera lerp idiom and hotspot/label layout conventions — MEDIUM-HIGH: community-pattern (no single platform spec), but cross-verified across 3+ independent 2026 sources each, consistent conclusions
- Device-tiering heuristic (`deviceMemory`/`hardwareConcurrency`) — MEDIUM: MDN-verified for the Safari/Firefox gap specifically; the broader "combine both, fall back to screen size" heuristic is project-specific judgment, not a documented standard

**Research date:** 2026-07-24
**Valid until:** ~30 days for the content-data-shape and repo-internal findings (stable); ~14 days for the three.js version-specific packaging fact (`three.core.js` split) and browser-support specifics, since these are tied to a specific pinned release and an actively-shipping browser feature respectively
