# Phase 3: Concept B — Full-Screen Video - Research

**Researched:** 2026-07-24
**Domain:** Full-bleed ambient autoplay video hero + native `<dialog>`-based progressive-reveal navigation + 3 consolidated derived sub-pages; static HTML/CSS/vanilla-JS, no build tooling, no libraries
**Confidence:** HIGH (content data shapes, copy-diff mechanics, video asset facts, Fritz rules — read directly from source files); MEDIUM-HIGH (`<dialog>`/View Transitions/viewport-unit browser support — WebSearch + MDN-verified, one correction to the project's own STACK.md/02-RESEARCH.md found)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Video (asset ALREADY SOURCED — do not re-source)**
- Files exist at `concept-b/assets/video/`: `hero-loop-1080.webm` (VP9, ~4.9MB, list first), `hero-loop-1080.mp4` (H.264, ~5.9MB), `hero-poster.jpg` (~149KB). Provenance in `concept-b/assets/video/ASSETS.md` (Pexels #29848606, license clean, seamless 24s boomerang loop).
- The footage: slow monochrome black liquid-chrome motion — dark, premium, no competing color; Flarepop overlays own the accent layer.
- `<video autoplay muted playsinline loop preload="metadata" poster=".../hero-poster.jpg">` with WebM source first, MP4 second. `muted` attribute IN MARKUP (not just JS volume) — iOS policy.
- Poster is the LCP element and is also used as the static fallback; the video element is absolutely positioned behind everything with `object-fit: cover`; reserve the full viewport at load (no CLS).
- `prefers-reduced-motion: reduce` → JS never calls play(), CSS shows poster; also pause the video when the tab is hidden (battery). A visible pause/play control on the hero (WCAG 2.2.2).
- No sound exists in the files (audio stripped at encode) — the no-sound rule is structural.

**The reveal mechanism (the concept's defining interaction)**
- Homepage viewport = video + minimal top bar (lockup left, convert CTA right) + verbatim hero (`hero.kicker`, `hero.h1_html` with Flarepop em treatment) + **6 labeled topic hotspots** laid out over the video: Problems · InterceptOS · Work · Labs · Insights · Contact (the 6 topics from content/subpages.json).
- Hotspots are REAL `<button>`s in a `<nav>` landmark with visible text labels at all times (no mystery meat, no hover-only affordances — touch works). Visual: mono-font labels with a Flarepop marker/dot, generous hit areas.
- Click/Enter on a hotspot → **inline chapter panel** slides/fades in (sine ease, long duration): shows that topic's teaser refs (from `subpages.json` teaser_refs, verbatim) + ONE clear "open the full page" CTA + a close affordance (Esc works, focus is trapped while open, returns to the hotspot on close).
- Chapter panel is a `<dialog>` or equivalent with proper aria; the video keeps playing behind it, dimmed by a solid translucent scrim — flat overlay, NOT a gradient scrim (no-scrims rule: no gradient overlays; a uniform translucent layer is acceptable and required for text legibility).
- "Open the full page" routes to `concept-b/pages/{topic}.html` (cross-document View Transition cross-fade, same as Concept A, no named morphs).
- NO scroll-jacking: the homepage doesn't need scroll at all (single viewport); if content overflows on small screens it scrolls natively.

**Sub-pages (CONB path of the click-through model)**
- Ship 3 full pages: `problems.html`, `interceptos.html`, `work.html` (all 3 cases at full depth on one page — a deliberate contrast with Concept A's per-case split; both prove the model).
- Labs/Insights/Contact hotspots still open chapter panels (teaser refs + external episode links for insights, convert copy for contact) — their "full page" CTA is omitted where no deeper copy exists (Labs) per the Phase 2 routing-map precedent; never a dead link.
- Sub-pages are dark, quiet, typographic — video does NOT continue onto sub-pages (keeps weight down); poster-derived styling only. Persistent way back to the concept homepage.

**Copy discipline**
- Same as Concept A: every text node from canonical refs, `data-copy` annotated; `python3 qa/copy-diff.py concept-b/index.html concept-b/pages/*.html` exits 0 as a task verify step.
- Brand greps apply (banned tagline, deprecated hexes, no `<hr>`/rule-line dividers — including CSS border-top/bottom hairlines, Flarepop-only colored text, no smooth gradients).

### Claude's Discretion
- Hotspot layout geometry (constellation over the liquid vs edge-anchored list) and responsive behavior
- Chapter panel composition details within the rules above
- Whether the hero h1 fades back while a panel is open

### Deferred Ideas (OUT OF SCOPE)
- Scroll-scrubbed image-sequence narrative (ENH-02, v2)
- Portal/morph transitions shared with Concept C (ENH-03, v2)
- Multiple video scenes per topic (one ambient loop is v1)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-------------------|
| CONB-01 | Full-bleed muted ambient video hero (autoplay muted + playsinline + loop, poster frame, WebM+MP4 sources) | Asset facts + LCP/poster reasoning + `100svh`/`100dvh` sizing pattern in Code Examples — asset is already sourced, phase only needs correct markup/CSS wiring |
| CONB-02 | Clickable hotspot overlays tied to video regions, every hotspot has a visible label/affordance | Hotspot Layout section (percentage-based positioning, min 44×44 hit area, `:focus-visible`, real `<button>`s in a `<nav>`) |
| CONB-03 | Hotspot click → inline chapter panel (progressive disclosure) → routes to full derived sub-page | `<dialog>` Architecture Pattern (six static dialogs, not one JS-templated dialog — see Don't Hand-Roll) + Content Data Shapes table below resolves exactly what copy each panel/page needs |
| CONB-04 | `prefers-reduced-motion` → static poster + standard nav; no sound ever autoplays | Reduced-Motion/Battery pattern in Code Examples (extends concept-a's `motion.js` guard to also gate `video.play()`) |
| CONB-05 | Video compressed to sane budget with poster-frame LCP protection, no CLS | ASSETS.md facts (4.9–5.9MB, well under the 10MB budget PITFALLS.md flags) + poster-is-LCP-element reasoning below |
</phase_requirements>

## Summary

Concept B is architecturally the simplest of the three concepts to build (no framework, no 3D, one video asset already encoded and sitting on disk) but has the highest count of small, easy-to-miss correctness details: the video attribute order/values, the exact dot-paths for six topics' worth of teaser/full copy (several of which are arrays or objects that must be expanded to individual string leaves before they can be annotated with `data-copy`, exactly as Concept A already had to do), and the interaction contract for a `<dialog>`-based reveal mechanism whose behavior differs meaningfully between `showModal()` defaults and what the project's copy-immutability rule allows for how that dialog's content may be authored.

The single most important architectural finding from this research: **the six chapter panels must be six separate, statically-authored `<dialog>` elements already present in `concept-b/index.html`'s markup at load — not one reusable `<dialog>` whose innerHTML gets swapped by JavaScript per topic.** The project's own binding rule (`shared/README.md`) states copy must live as literal HTML text nodes and JS "must never be the sole storage location for copy... JS-injected copy is invisible to [the copy-diff] gate and will fail review." A single dynamic dialog templated from a JS object satisfies the *interaction* spec but fails the *copy* gate. Six pre-rendered dialogs, each annotated with `data-copy`, toggled open/closed by a small amount of JS that never constructs text, satisfies both.

The second load-bearing finding: with `poster` + `autoplay` both present, the **poster image — not the video frame — is the LCP candidate** (Chrome ≥116 treats video posters as LCP candidates). This validates the CONTEXT-locked `preload="metadata"` choice: because the poster already protects LCP, there is no need for `preload="auto"` to eagerly fetch the full ~5MB video before first paint — that generic advice applies only when there's no poster and the video itself is the LCP element. `preload="metadata"` is the correct, more bandwidth-conscious choice here, not a shortcut.

The third finding worth flagging early: cross-document View Transitions browser support is **narrower in mid-2026 than the project's own `.planning/research/STACK.md` and Concept A's `02-RESEARCH.md` state.** Fresh WebSearch (multiple independent 2026 sources) shows Firefox still ships cross-document transitions behind a flag (versions 146–151, partial), not shipped by default at 144+ as STACK.md claims. Treat Firefox as no-transition/plain-navigation for Concept B exactly as Concept A should — this doesn't change any code (progressive enhancement, no fallback needed) but the planner/executor should not describe Firefox support as "shipped."

**Primary recommendation:** Build the homepage as one `<video>` (absolutely positioned, `object-fit: cover`, sized via `100svh`/`100dvh` fallback stack) behind a `<nav>` of 6 real `<button>`s and six pre-authored, closed-by-default `<dialog>` elements (one per topic, each populated with that topic's exact `teaser_refs` as annotated text nodes); JS only opens/closes dialogs, gates video `play()` behind reduced-motion/visibility checks, and restores focus on close — it never generates copy. The 3 full sub-pages (`problems.html`, `interceptos.html`, `work.html`) reuse Concept A's proven idioms (has-js bootstrap, `@view-transition` CSS, `[data-reveal]` + IntersectionObserver, reduced-motion CSS) almost unchanged, styled dark/quiet/typographic with no video.

## Content Data Shapes — All 6 Topics (from `content/subpages.json` + `content/homepage.json`)

**Critical mechanic:** `qa/copy-diff.py`'s `resolve_path()` requires every `data-copy` dot-path to land on a **string leaf**. Several `teaser_refs`/`full_refs` entries in `subpages.json` are *collection-level* shorthand (an array or object), not literal annotation targets — these must be expanded to per-index/per-key leaf paths in the actual markup, exactly as Concept A already did (see `concept-a/pages/interceptos.html`, which is the working precedent to copy the *idiom* from — file, not content, per CONTEXT). The table below classifies every ref so the planner doesn't have to re-derive this.

### Problems (chapter panel only shown in teaser; `problems.html` is a full page)
| Ref group | Refs | Type | Note |
|---|---|---|---|
| teaser_refs | `problems.eyebrow`, `problems.h2`, `problems.lead`, `problems.items.{0-3}.tabEyebrow`, `problems.items.{0-3}.tabName` | all STRING_LEAF | direct annotation, no expansion needed |
| full_refs | `problems.items.{i}.quote`, `.attrib`, `.signalNum`, `.signalLbl`, `.bridge` | STRING_LEAF | direct |
| full_refs | `problems.items.{i}.tells` | **ARRAY[3] of str** | **expand to `.tells.0`/`.tells.1`/`.tells.2`**, three `<li>`s |
| trap | `problems.items.3.signalNum` | STRING_LEAF but **empty string `""`** | item 3 (Activation) has no stat number — Concept A's precedent renders only the `signalLbl` span with a `--no-num` modifier class and omits the num span entirely; do the same, never render an empty `data-copy` element |

### InterceptOS (chapter panel teaser; `interceptos.html` is a full page)
| Ref group | Refs | Type | Note |
|---|---|---|---|
| teaser_refs | `os.eyebrow`, `os.h2`, `os.lead`, `os.flows.{0-3}.tabLabel`, `agents.eyebrow`, `agents.h2`, `agents.lead` | all STRING_LEAF | direct |
| full_refs | `os.flows` | **ARRAY[4] of dict** | expand: each flow has `.tabLabel` (already teased), `.job`, `.layer`, `.stages` (**ARRAY[4] of dict**: `.tag`, `.name`, `.desc`, and `.agents` — **ARRAY[0-3] of str, present on stages 0-2, ABSENT on stage 3 "Outcome"** — guard for missing key, don't render an empty list) |
| full_refs | `agents.categories` | **ARRAY[4] of str** | expand to `.categories.0`–`.categories.3` |
| full_refs | `agents.items` | **ARRAY[13] of dict** | expand: each has `.name`, `.type`, `.role`, `.desc`, `.solves` (**ARRAY of str, 1-2 items**), `.sample` — `.solves` needs its own per-index expansion (`.solves.0`, `.solves.1`) |

### Work (chapter panel teaser; `work.html` is ONE consolidated full page — NOT the 3-slug split `subpages.json`'s own `pages` array describes)
| Ref group | Refs | Type | Note |
|---|---|---|---|
| teaser_refs | `work.eyebrow`, `work.h2`, `work.lead`, `work.cases.{0-2}.client/.tag/.name/.summary` | STRING_LEAF | direct |
| teaser_refs | `work.cases.{0-2}.metric` | **OBJECT {num,label}** | expand to `.metric.num` / `.metric.label` |
| full_refs | `work.cases.{i}.challenge`, `.approach` | STRING_LEAF | direct |
| full_refs | `work.cases.{i}.results` | **ARRAY of str** (4 items for cases 0-1, 5 for case 2 — variable length) | expand per-index, render as `<li>` list |
| full_refs | `work.cases.{i}.agents` | **STRING_LEAF despite the plural name** (e.g. `"Atom"`, `"Atom · Camille (multi-agent program)"`, `"Cam"`) | trap: this is NOT an array to iterate — it's one already-formatted descriptive string, render as a single text node like Concept A's `case-story__agents` paragraph |
| trap | `subpages.json`'s `topics[].pages` array (slugs `work-hp-abx`/`work-intel-abm`/`work-sap-video`) | — | this is Concept A's per-case routing baked into the content model; CONTEXT explicitly overrides it for Concept B — do not follow it, build one `work.html` with all 3 cases stacked |

### Labs (chapter panel ONLY — teaser_only, no full page, no "open full page" CTA)
| Ref group | Refs | Type | Note |
|---|---|---|---|
| teaser_refs | `labs.label`, `labs.h2_html`, `labs.body` | STRING_LEAF (`h2_html` is HTML-fragment) | `_html`-suffixed fields carry inline markup (`<span class="hl">…</span>`) — `data-copy` goes on the wrapping element, inner tags are preserved in markup; `qa/copy-diff.py` strips tags on both sides before comparing (verified in script source) |
| teaser_refs | `labs.cta` | **OBJECT {label, href}** | expand: `.label` is the visible CTA text (`data-copy="labs.cta.label"`); `.href` (`"#pitchLabs"`) is a **routing hook, not annotated copy** — each concept substitutes its own real link target (Concept A used `#convert` instead of the literal `#pitchLabs` value) |
| teaser_refs | `labs.stat` | **OBJECT {num, label}** | expand to `.stat.num` / `.stat.label` |
| full_refs | `[]` | — | empty by design — never fabricate deeper Labs copy (`subpages.json`'s own `fabrication_note`) |

### Insights (chapter panel ONLY — teaser_only, no full page; teaser already IS the full episode data)
| Ref group | Refs | Type | Note |
|---|---|---|---|
| teaser_refs | `insights.eyebrow`, `insights.h2`, `insights.lead` | STRING_LEAF | direct |
| teaser_refs | `insights.episodes` | **ARRAY[3] of dict** | expand per episode: `.episode`, `.show`, `.title`, `.guest.name`, `.guest.role` (nested object, 2 more levels), `.summary`, `.links` (**ARRAY of {label,href}**, 3 items per episode — expand `.links.0.label`/`.href` etc.), `.tile_href` (routing hook, not copy) |
| trap | panel content volume | — | because `teaser_refs` here already contains 3 full episodes' worth of copy (title + guest + summary + 3 links each), this chapter panel is the densest of the six — plan for internal scroll inside the `<dialog>`, not a cramped single view |
| full_refs | `[]` | — | empty by design — `subpages.json`'s own note: "sub-page may only change layout/presentation depth... never add or infer new episode copy" |

### Contact (chapter panel ONLY — teaser_only in scope for Phase 3; the FAQ full_refs exist in the content model but are OUT OF SCOPE)
| Ref group | Refs | Type | Note |
|---|---|---|---|
| teaser_refs | `convert.eyebrow`, `convert.h2`, `convert.lead` | STRING_LEAF | direct |
| teaser_refs | `convert.cta` | **OBJECT {heading, sub, href}** | expand: `.heading`/`.sub` are copy, `.href` (`"#convoDrawer"`) is a routing hook |
| trap | `subpages.json` lists `full_refs: [convert.*, faqs.eyebrow, faqs.h2, faqs.items]` for the `contact` topic | — | **this documents what a full Contact page COULD show — CONTEXT's locked decision only ships full pages for Problems/InterceptOS/Work.** Contact gets a chapter panel only, using `teaser_refs`; the 11-item `faqs.items` array is not built in this phase. Do not build a `contact.html` page. |
| note | top-bar CTA precedent | — | Concept A's header CTA uses `data-copy="convert.eyebrow"` as its visible button text ("start the conversation"), not `convert.cta.label` (that field doesn't exist — the object is `{heading,sub,href}`) — reuse this exact precedent for Concept B's top-bar CTA |

### Hero (homepage only — scope is intentionally narrower than Concept A's hero)
CONTEXT locks the homepage hero to exactly `hero.kicker` + `hero.h1_html` (Flarepop `<em>` treatment). `hero.sub` and `hero.cta` exist in `content/homepage.json` but are not part of Concept B's locked hero — omitting them is compliant (concepts are not required to render every canonical field; Phase 1's own precedent already establishes this). The `<em>ambitious</em>`/`<em>proven</em>` inline markup and the `.dot` span both get `color: var(--flarepop); font-style: normal;` exactly as Concept A's `.hero__h1 em`/`.hero__h1 .dot` rules do — same idiom, own CSS file.

## Architecture Patterns

### Recommended Project Structure
```
concept-b/
├── index.html                  # video hero + top bar + 6 hotspots + 6 static <dialog>s
├── pages/
│   ├── problems.html
│   ├── interceptos.html
│   └── work.html                # ALL 3 cases stacked, not 3 separate pages
├── assets/
│   ├── video/                   # already exists — do not modify
│   ├── css/concept-b.css        # own stylesheet, no raw hex, tokens only
│   └── js/
│       ├── video.js             # autoplay-guard + IO/visibilitychange pause + pause-button
│       └── panels.js            # dialog open/close/focus-return only — never builds copy
```

### Pattern 1: Six static `<dialog>` elements, not one templated dialog
**What:** Author all six chapter panels' full markup (topic title, teaser copy, CTA, close button) directly in `concept-b/index.html`, each as its own `<dialog id="panel-problems">` etc., each closed by default (no `open` attribute). A `<button>` hotspot's click handler calls `document.getElementById('panel-'+topic).showModal()` — it never sets `.textContent`/`.innerHTML` with copy.
**When to use:** Always, for this phase — it's the only way to satisfy both CONB-03 (progressive-disclosure panel) and the project's binding copy-immutability/`data-copy` gate simultaneously.
**Why it matters:** `qa/copy-diff.py`'s annotated-mode check only sees text present in the static HTML file it reads from disk; anything assembled by JS at runtime is invisible to it and will silently fail review the moment someone actually runs the gate against rendered output vs. source.

### Pattern 2: Percentage-anchored hotspots over the full-bleed video
**What:** A `relative`-positioned wrapper containing the `<video>` and a `<nav>` of `absolute`-positioned `<button>`s, each positioned with percentage `top`/`left` (not fixed pixels, not CSS Grid areas tied to a fixed column count) so hotspot position scales proportionally with the container at every viewport from 320px to 4K.
**When to use:** Full-bleed background media where the "constellation" needs to track proportionally with the visual composition of the footage (liquid-chrome has no fixed focal grid to anchor a `grid-template-areas` scheme to).
**Example:**
```css
.hero-stage { position: relative; isolation: isolate; }
.hero-stage__video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
.hotspot-nav { position: absolute; inset: 0; z-index: 1; }
.hotspot { position: absolute; /* top/left set per-hotspot as percentages */ }
.hotspot {
  min-width: 44px; min-height: 44px;   /* WCAG 2.5.5 AAA best-practice target size (2.5.8 AA minimum is 24px) */
  display: inline-flex; align-items: center; gap: var(--sp-8);
  padding: var(--sp-8) var(--sp-16);
  font-family: var(--font-mono); color: var(--fg);
  background: transparent; border: none; cursor: pointer;
}
.hotspot:focus-visible {
  outline: 2px solid var(--flarepop); outline-offset: 4px;   /* on-brand: Concept A already uses Flarepop for non-text borders/backgrounds (buttons, hover borders), so a Flarepop focus ring is consistent, not a new invented mark */
}
```
**Alternative considered:** CSS Grid `grid-template-areas` anchoring — rejected as the primary mechanism because it works best when hotspots map to a fixed compositional grid (e.g., quadrants of a photo); the liquid-chrome footage has no such structure, and percentage-based absolute positioning is what the community's established pattern for hotspots-over-responsive-media actually recommends (freefrontend/w3collective/CSS-Tricks pattern survey, cross-verified across multiple sources).

### Pattern 3: Video pause/play + visibility gating
**What:** Never assume `play()` succeeds. Attempt autoplay only if `prefers-reduced-motion` is not set; catch rejection (iOS Low Power Mode, autoplay policy) and fall back to the poster + a visible "Play" affordance rather than showing a broken/frozen state. Separately, pause on `visibilitychange` (tab hidden) and resume respecting the same reduced-motion/rejection-aware logic.
**When to use:** Any ambient autoplay background video — this is not optional per CONB-04/WCAG 2.2.2.
**Example:** see Code Examples below.

### Pattern 4: Reuse Concept A's idioms verbatim (as idiom, not as shared file) on the 3 full sub-pages
`has-js` bootstrap, `@view-transition { navigation: auto; }`, `[data-reveal]` + IntersectionObserver reveal-once, `prefers-reduced-motion` CSS override block — copy the pattern from `concept-a/assets/js/motion.js` and `concept-a/assets/css/concept-a.css` into Concept B's own `.css`/`.js` files (concepts stay isolated, no cross-linking). The homepage itself does NOT need `[data-reveal]`/scroll-reveal — it's a single, non-scrolling viewport; the reveal mechanism there is click-triggered dialogs, not scroll-triggered sections. The 3 sub-pages are ordinary scrolling content pages and should use the scroll-reveal idiom the same way Concept A's sub-pages do.

### Anti-Patterns to Avoid
- **Gradient scrim on the dialog backdrop:** violates the project's "no gradients = hard-edged steps" rule. Use a **flat, single-alpha `background-color`** on `::backdrop` (e.g. `rgba(10,10,15,0.72)`), never a `linear-gradient`.
- **Named `view-transition-name` morph on the video or poster element:** cross-document view transitions capture a flat bitmap screenshot of the old/new page; `object-fit` does not apply to that captured bitmap, so a named morph on a full-bleed video/poster risks a stretched "taffy" artifact if the two pages' boxes differ in aspect ratio. Concept A's own decision was a simple default root cross-fade, no named morphs — Concept B is locked to the same (CONTEXT: "no named morphs").
- **Hover-only hotspot affordances:** fails on touch entirely (no hover state) — CONTEXT already locks visible-always labels; don't regress to a hover-reveal "clean look" during implementation.
- **One shared `<dialog>` innerHTML-swapped per topic:** see Pattern 1 — fails the copy-diff gate.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal focus trap + Esc-to-close + background inertness | A custom JS focus-trap (tabindex cycling, keydown Esc listener, manual `aria-hidden` toggling on siblings) | Native `<dialog>` + `showModal()` | Browser-native: focus trap, Esc→`cancel` event, and automatic `inert` on everything outside the dialog are all built in and spec-guaranteed — a hand-rolled version is exactly the kind of thing that silently regresses (missed keydown case, wrong tab order) and was already flagged as a known risk pattern in this project's own PITFALLS.md |
| Panel entry/exit animation with a `display:none`→visible jump | A JS-driven class-toggle animation library or manual `setTimeout` sequencing to fake animating `display` | CSS `@starting-style` + `transition-behavior: allow-discrete` (Baseline since 2024) | Native CSS now animates the `display`/`overlay` jump itself — no JS animation orchestration needed for a dialog open/close transition |
| Detecting "is this video visible right now" | Scroll-position math on `scroll`/`resize` listeners | `IntersectionObserver` | Purpose-built, off-main-thread-friendly, and is the community-consensus replacement for scroll-position polling for exactly this check |
| Poster-image load prioritization | Nothing (leaving it to default fetch priority) | `<link rel="preload" as="image" href="hero-poster.jpg" fetchpriority="high">` in `<head>` | `fetchpriority` is not a valid attribute on `<video>` itself (it only applies to `img`/`link`/`script`/`iframe`) — the documented pattern for prioritizing a video's poster is a separate preload link, not an attribute on the video tag |

**Key insight:** Every interaction primitive this phase needs (modal, backdrop, focus trap, Esc handling, entry/exit animation) already exists natively in 2024-2026 browsers. The only genuinely custom JS this phase needs is: (1) the reduced-motion/visibility-gated `play()` wrapper, (2) opening/closing the correct one of six pre-authored dialogs, (3) restoring focus to the invoking hotspot on close (the one piece of dialog behavior that is NOT automatic — see Common Pitfalls).

## Common Pitfalls

### Pitfall 1: Focus does not return to the invoking hotspot automatically
**What goes wrong:** After closing a chapter panel (Esc or close button), keyboard focus is lost (reset to `<body>`) instead of landing back on the hotspot that opened it — CONTEXT explicitly requires focus return.
**Why it happens:** `showModal()` sets initial focus INTO the dialog automatically, but the native dialog does **not** automatically restore focus to the invoking element on close — this must be done manually via the `close` event.
**How to avoid:**
```js
function openPanel(dialog, invokerBtn) {
  dialog.showModal();
  dialog.addEventListener('close', function onClose() {
    invokerBtn.focus();
    dialog.removeEventListener('close', onClose);
  });
}
```
**Warning signs:** Tabbing after closing a panel starts from the top of the page instead of the hotspot just used.
**Source:** MDN `<dialog>` docs (verified directly).

### Pitfall 2: Reaching for `preload="auto"` because "video hero = LCP element" generic advice
**What goes wrong:** Someone "corrects" the CONTEXT-locked `preload="metadata"` to `preload="auto"` based on generic video-LCP advice, causing the browser to eagerly fetch the full ~5-6MB video file even on constrained connections.
**Why it happens:** Most video-LCP guidance assumes no poster is set, in which case the video frame itself is the LCP candidate and needs eager preloading. Here, `poster` + `autoplay` means **the poster image is the LCP candidate** (confirmed: Chrome ≥116 treats video posters as LCP candidates) — the poster (149KB) already protects LCP, so `preload="metadata"` (fetch just enough to know duration/dimensions) is the correct, deliberate choice, not an oversight.
**How to avoid:** Keep `preload="metadata"` as locked. If LCP still measures against the video for some reason, add `<link rel="preload" as="image" href="hero-poster.jpg" fetchpriority="high">` to further prioritize the poster fetch — never flip preload to `auto` as the fix.
**Source:** Aaron T. Grogg, "Improving LCP for Video Hero Components" (2026) — WebFetched directly.

### Pitfall 3: `<video>` becomes keyboard-focusable / announced to screen readers as meaningful content
**What goes wrong:** A background video with no `tabindex`/`aria-hidden` handling either becomes an unexpected stop in the tab order, or (worse) a screen reader announces "video, 24 seconds" as if it were meaningful content, when it's purely decorative (the real content is the hero text + hotspots + panels).
**How to avoid:** Add `aria-hidden="true" tabindex="-1"` to the `<video>` element itself, and `disablepictureinpicture` to suppress the browser's floating PiP affordance on an ambient/decorative clip.
**Warning signs:** Tabbing through the homepage stops on the video element with no visible focus purpose; VoiceOver/NVDA announces video duration/controls.

### Pitfall 4: Text-legibility contrast checked only against the poster frame, not the whole loop
**What goes wrong:** Hero kicker/h1 contrast is checked once against the static poster frame and passes, but the 24-second loop has brighter/more-reflective moments (liquid-chrome motion) where contrast could dip below WCAG 1.4.3 thresholds (4.5:1 body / 3:1 large text) during playback.
**How to avoid:** Spot-check contrast against a few frames spread across the loop (not just frame 0), not only the poster. If any moment is marginal, that's the justification for a light, flat, uniform scrim under the hero text specifically (distinct from the dialog's own scrim) — must still be a flat solid color per the no-gradients rule, not a vignette/gradient.

### Pitfall 5: 4-second cross-document view-transition timeout silently drops the "back to homepage" fade
**What goes wrong:** Navigating from a sub-page back to the video-heavy homepage is exactly the direction where the *incoming* page (the homepage, with its video/poster) needs to reach a renderable state within a hard 4-second budget from navigation start, or Chromium/Safari silently abandon the transition (plain navigation, no animation, no error).
**Why it happens:** The timeout counts from when navigation begins, not from when HTML starts arriving — slow font loads (`font-display: block`) or render-blocking resources on the homepage can eat the budget.
**How to avoid:** Given the poster is only ~149KB and fonts are already shared/preconnected per `shared/README.md`'s established pattern, this should not be a real risk here — but it's worth a manual check (throttled network) specifically on the sub-page→homepage direction, since that's the direction most likely to be skipped in testing (people naturally test homepage→subpage more).
**Source:** CSS-Tricks, "Cross-Document View Transitions: The Gotchas Nobody Mentions" (2026) — WebFetched directly.

### Pitfall 6: `100vh` sizing causes the video container to visibly resize as the mobile toolbar collapses
**What goes wrong:** On mobile Safari/Chrome, `height: 100vh` is calculated against the largest possible viewport (toolbars hidden); if any incidental scroll happens on a small screen (CONTEXT explicitly allows native overflow scroll on small viewports), the toolbar hide/show can cause a visible reflow/resize of the video container mid-interaction if `100dvh` (dynamic) is used instead, since dvh recalculates live as the toolbar animates.
**How to avoid:** Prefer `100svh` (small viewport height — stable, matches the toolbar-visible state, no live recalculation) for the hero container over `100dvh`, with a `100vh` fallback for older browsers: `height: 100vh; height: 100svh;`. `dvh`/`svh`/`lvh` reached Baseline Widely Available in June 2025 (Chrome 108+, Firefox 101+, Safari 15.4+) — no polyfill needed.

## Code Examples

### Video hero markup + sizing
```html
<div class="hero-stage">
  <video class="hero-stage__video"
    autoplay muted playsinline loop preload="metadata"
    poster="/concept-b/assets/video/hero-poster.jpg"
    aria-hidden="true" tabindex="-1" disablepictureinpicture>
    <source src="/concept-b/assets/video/hero-loop-1080.webm" type="video/webm">
    <source src="/concept-b/assets/video/hero-loop-1080.mp4" type="video/mp4">
  </video>
  <!-- hotspot nav + hero text + pause button layered above, all position:absolute -->
</div>
```
```css
.hero-stage { position: relative; width: 100%; height: 100vh; height: 100svh; overflow: hidden; }
.hero-stage__video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
```

### Reduced-motion + visibility-gated autoplay (extends `concept-a/assets/js/motion.js`'s guard idiom)
```js
(function () {
  "use strict";
  var video = document.querySelector(".hero-stage__video");
  if (!video) return;

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function attemptPlay() {
    if (prefersReducedMotion) return;      // never call play() — CSS/poster shows static frame
    var p = video.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () {
        // Autoplay rejected (iOS Low Power Mode, policy, etc.) — poster
        // is already visible as the video's own fallback frame; surface
        // the visible play control's state instead of erroring.
        setPauseButtonState(false);
      });
    }
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { video.pause(); }
    else { attemptPlay(); }
  });

  attemptPlay();
})();
```

### Six static dialogs + open/close/focus-return (never builds copy)
```html
<dialog id="panel-labs" class="chapter-panel" aria-labelledby="panel-labs-title">
  <h2 id="panel-labs-title" data-copy="labs.label">Intercept Labs</h2>
  <p data-copy="labs.h2_html">For the work that <span class="hl">has no playbook.</span></p>
  <p data-copy="labs.body">Intercept Labs is how we co-invest with clients…</p>
  <p><span class="stat-num mono" data-copy="labs.stat.num">Up to 50%</span> <span data-copy="labs.stat.label">Project co-investment</span></p>
  <button type="button" class="btn-secondary" data-copy="labs.cta.label" onclick="/* no full page for Labs — omit CTA per locked scope, or wire to convert per routing precedent */">Build with Labs</button>
  <button type="button" class="chapter-panel__close" aria-label="Close">Close</button>
</dialog>
```
```js
function wireHotspot(hotspotBtn, dialog) {
  hotspotBtn.addEventListener("click", function () {
    dialog.showModal();
  });
  dialog.addEventListener("close", function () {
    hotspotBtn.focus();
  });
  dialog.querySelector(".chapter-panel__close")
    .addEventListener("click", function () { dialog.close(); });
}
```
```css
.chapter-panel {
  border: none; padding: var(--sp-32); max-width: 40rem; background: var(--surface); color: var(--fg);
  opacity: 0; transform: translateY(16px);
  transition: opacity var(--dur-med) var(--ease-inout-sine),
              transform var(--dur-med) var(--ease-inout-sine),
              overlay var(--dur-med) allow-discrete,
              display var(--dur-med) allow-discrete;
}
.chapter-panel[open] { opacity: 1; transform: none; }
@starting-style { .chapter-panel[open] { opacity: 0; transform: translateY(16px); } }

.chapter-panel::backdrop {
  background-color: transparent;
  transition: background-color var(--dur-med) allow-discrete;
}
.chapter-panel[open]::backdrop { background-color: rgb(10 10 15 / 72%); } /* flat, no gradient */
@starting-style { .chapter-panel[open]::backdrop { background-color: transparent; } }
```

### Prioritizing the poster (not `fetchpriority` on `<video>` — invalid there)
```html
<link rel="preload" as="image" href="/concept-b/assets/video/hero-poster.jpg" fetchpriority="high">
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| Hand-rolled JS focus trap + manual `aria-hidden` toggling for modals | Native `<dialog>` + `showModal()` (auto focus-trap, auto `inert` background, Esc→`cancel`) | Widely available across evergreen browsers by 2022-2023 | Less code, spec-guaranteed correctness for exactly the behaviors this phase needs |
| JS-driven fake-`display`-animation for modal open/close | CSS `@starting-style` + `transition-behavior: allow-discrete` | Baseline since August 2024 | Pure-CSS entry/exit animation for the chapter panels, no JS animation library |
| `<meta name="view-transition" content="same-origin">` | `@view-transition { navigation: auto; }` CSS rule | Chrome 126 replaced the meta-tag approach | Many tutorials still show the deprecated meta tag — it now silently no-ops; verify Concept B's CSS uses the rule, not the tag |
| `100vh` for full-viewport hero sizing | `100svh` (stable) with `100vh` fallback, or `100dvh` only if intentional live-resize is acceptable | `dvh`/`svh`/`lvh` Baseline Widely Available June 2025 | Avoids visible video-container resize as mobile toolbars hide/show |
| Believing Firefox ships cross-document View Transitions at 144+ (per this project's own STACK.md / 02-RESEARCH.md) | Firefox cross-document support remains **flag-gated/partial** (versions 146-151) as of mid-2026, per fresh multi-source WebSearch | Ongoing — not yet shipped by default | No code change (progressive enhancement already handles this), but don't describe/document Firefox as supporting it — this is a correction to carry forward, same as Concept A's own research already corrected once |

**Deprecated/outdated:**
- `<meta name="view-transition">` tag syntax — replaced by the `@view-transition` CSS at-rule; still shows up in older tutorials.
- Assuming `preload="auto"` is always correct for "the video is the hero" — only true when there's no poster; false here.

## Open Questions

1. **Does an open `<dialog>` visually interfere with the outgoing cross-document view-transition snapshot when "open full page" is clicked from inside a panel?**
   - What we know: cross-document transitions capture a bitmap of the whole old-document render state at navigation time; an open modal dialog + its backdrop would be part of that captured "old" frame.
   - What's unclear: no source (including a dedicated 2026 "gotchas" article) documents this specific scenario — it's a genuine documentation gap, not just an unresearched corner.
   - Recommendation: since Concept B is locked to a simple default root cross-fade (no named morphs), the practical risk is low — a fade-through-the-open-panel-state should look acceptable. If the executor finds it jarring in browser testing, close the dialog synchronously before/on the same click that triggers navigation (`dialog.close()` then let the `<a>`'s default navigation proceed) as a cheap mitigation; verify empirically rather than guessing.

2. **Should the Labs chapter panel's CTA route anywhere, given Labs has no full page?**
   - What we know: CONTEXT says "their 'full page' CTA is omitted where no deeper copy exists (Labs)... never a dead link."
   - What's unclear: whether "omitted" means no button at all, or a button that routes to the homepage's Contact hotspot/panel (i.e., become a conversion CTA instead of a "read more" CTA) — `labs.cta.label` is literally "Build with Labs," which reads naturally as a contact-intent CTA already (matches Concept A's own choice to point the Labs card at `#convert`).
   - Recommendation: reuse Concept A's precedent directly — the Labs panel's CTA button (visible text `labs.cta.label`, verbatim) opens/routes to the Contact hotspot's panel rather than a full page, so it's never a dead link and never an invented destination.

## Sources

### Primary (HIGH confidence)
- `content/homepage.json`, `content/subpages.json`, `shared/README.md`, `concept-a/pages/interceptos.html`, `concept-a/index.html`, `concept-a/assets/css/concept-a.css`, `concept-a/assets/js/motion.js`, `qa/copy-diff.py`, `concept-b/assets/video/ASSETS.md` — read directly from repo, exact data shapes and working precedent
- [MDN: `<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) — WebFetched directly; `showModal()` vs `show()`, focus behavior, `closedby`, `::backdrop`, inert background
- [MDN: `HTMLMediaElement.play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) — WebFetched directly; Promise rejection handling pattern
- [MDN: `@starting-style`](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style) — WebFetched directly; Baseline 2024 status + dialog animation recipe
- [Aaron T. Grogg: Improving LCP for Video Hero Components (2026)](https://aarontgrogg.com/blog/2026/01/06/improving-lcp-for-video-hero-components/) — WebFetched directly; poster-as-LCP-candidate confirmation, preload reasoning
- `.planning/research/PITFALLS.md`, `.planning/research/STACK.md`, `.planning/phases/02-.../02-RESEARCH.md` — project's own prior research, one correction found (Firefox cross-document view-transitions support)

### Secondary (MEDIUM confidence)
- [CSS-Tricks: Cross-Document View Transitions — The Gotchas Nobody Mentions (2026)](https://css-tricks.com/cross-document-view-transitions-part-1/) — WebFetched; 4s timeout, deprecated meta tag, image-stretch gotchas; confirms Firefox still flag-gated
- Cross-document View Transitions browser support (Chrome 126+, Safari 18.2+, Firefox 146-151 partial/flagged) — cross-verified across TestMu AI, Trade Assistance LLC, and the CSS-Tricks article (WebSearch, multiple independent sources agreeing)
- `dialog closedby` attribute support (Chrome/Edge 134, Firefox 141, Safari 18.2) — WebSearch, multiple sources (web-platform-dx, caniuse via search snippet, MDN)
- `100vh`/`100dvh`/`100svh` Baseline Widely Available June 2025 (Chrome 108+, Firefox 101+, Safari 15.4+) — WebSearch, multiple sources agreeing
- WCAG 2.5.8 Target Size Minimum (24×24 CSS px, AA) vs 2.5.5 (44×44, AAA best practice) — WebSearch, multiple accessibility-focused sources agreeing
- WCAG 2.2.2 Pause/Stop/Hide + `aria-pressed` toggle pattern — WebSearch, multiple sources agreeing
- IntersectionObserver + `visibilitychange` combined pause pattern for background video — WebSearch, community-consensus pattern (web.dev/Chrome guidance + multiple implementation write-ups), no single canonical spec doc but consistent across sources
- `fetchpriority` is invalid on `<video>` directly; use a separate `<link rel="preload" as="image" fetchpriority="high">` for the poster — WebSearch, multiple sources (web.dev, MDN attribute reference, Shopify/Hydrogen discussion) agreeing

### Tertiary (LOW confidence)
- None — all findings above were either read directly from repo files or cross-verified against MDN/official docs/multiple independent 2026 sources.

## Metadata

**Confidence breakdown:**
- Content data shapes (per-topic ref classification, traps): HIGH — derived by writing and running a script that resolves every `subpages.json` ref against the actual `content/homepage.json`, not by inspection alone
- `<dialog>`/View Transitions/viewport-unit browser mechanics: MEDIUM-HIGH — MDN-verified for core behavior; support-version specifics cross-checked across 3+ independent 2026 sources each, with one correction surfaced against the project's own prior research
- Video/LCP/autoplay pitfalls: HIGH — asset facts read directly from `ASSETS.md`; LCP/preload reasoning WebFetched from a dedicated 2026 technical article; play()-rejection handling WebFetched from MDN
- Hotspot layout pattern: MEDIUM — WebSearch-derived community consensus (no single canonical spec source for "hotspots over responsive media," since this is a UI pattern rather than a platform feature), cross-verified across multiple independent write-ups

**Research date:** 2026-07-24
**Valid until:** ~30 days for the content-data-shape findings (stable, project-internal); ~14 days for the browser-support specifics (dialog `closedby`, cross-document View Transitions Firefox status) given both are actively shipping features mid-transition as of this research date
