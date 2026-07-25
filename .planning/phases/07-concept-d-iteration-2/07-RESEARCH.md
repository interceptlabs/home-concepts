# Phase 7: Concept D — Iteration 2 - Research

**Researched:** 2026-07-24
**Domain:** Restructuring an already-shipped static-HTML card/modal homepage (Concept D, Phase 5) for above-the-fold density, a new full-screen video section, a card→full-viewport-window scaling transition, and a "quiet" progressive-disclosure reskin of ported JS-templated module content — all within a no-build, vanilla-JS, native-`<dialog>` architecture.
**Confidence:** HIGH for the concrete architectural deltas (verified by direct reads of `concept-d/index.html`, `cards.js`, `concept-d.css`, `deployed.js`, `deployed.css`, the QA gates, and arithmetic run against the actual measured assets — poster brightness, CSS token values, grid math). MEDIUM for the View Transitions / native-`<dialog>` interaction claims (cross-checked against two independent 2025/2026 articles plus MDN/web.dev, but not empirically re-tested against this specific codebase's markup — flagged for a capture-review verification step). LOW/discretionary only for exact pixel tuning of the new compact-hero clamp values (presented as a calculated starting point, not a gate-verified fact).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Page structure (top to bottom — LOCKED)**
1. **Compact hero (above the fold, shares the first viewport with the card grid)**: verbatim `hero.kicker` + `hero.h1_html` + `hero.sub` at REDUCED scale (think ~40-50% of current visual weight; h1 on one to two lines, blurb one compact paragraph, no oversized vertical padding). Deployed sticky nav + logo stay exactly as-is.
2. **Section-card grid (same first viewport)**: 5 small cards — Problems, InterceptOS, Agents, Labs, Insights. (Work/FAQs/Contact leave the grid: Work gets its own section; FAQs + convert go below-fold plain.)
3. **Client logo strip** — kept in between, exactly the current treatment/position (Jon: "keep the logos in between like you have them").
4. **Work section — full screen**: the campaign reel (ALREADY CUT: `concept-d/assets/video/work-reel-1080.webm/.mp4` + `work-reel-poster.jpg`, provenance in ASSETS.md — built from the 3 deployed case visuals + shipped HP Cashmere + WMB stills) playing full-bleed (muted autoplay loop, poster, reduced-motion static, pause control), with the verbatim work section heading (`work.eyebrow`/`work.h2`/`work.lead`) and **3 small case cards** (HP / Intel / SAP — verbatim `work.cases[i]` name + summary teaser) using the SAME card composition and the SAME scaling card→module transition as the section cards.
5. **Below the fold, plain sections (NOT cards, NOT modals)**: FAQs module, convert ("Give us a chewy problem...") module, footer — the ported deployed modules inline as they render today.

**Card system (ITER-02/03)**
- Uniform tile height across the grid; content architecture inside every card: eyebrow/label top, then flexible space, then **copy anchored to the bottom uniformly** (title + one verbatim teaser line + CTA row all bottom-aligned so the baseline rhythm is identical tile to tile).
- Explicit expand CTA on every card (a visible mono label like the verbatim CTA labels where they exist; where the module has no verbatim CTA label, use the section's verbatim eyebrow as the CTA-adjacent label and a neutral affordance like "+" / "Open" — planner may choose the exact affordance but it must be visible, consistent, and not invented marketing copy).
- **Semi-opaque surfaces**: light translucent card fill over the video (flat translucency — NOT a gradient scrim), dark ink text.
- **Hover state that mimics the background video**: on hover the card should feel like the particle-wave field passes through it — acceptable techniques: increase translucency to reveal more video, a slow sine-eased wave/ripple on a card pseudo-element (CSS only), or backdrop-filter shift. Must be calm (sine, long duration), reduced-motion silent, and touch gets a non-hover equivalent (focus state matches).

**Scaling card→module transition (ITER-04)**
- Clicking a card SCALES the card into the module window (FLIP-style transform from card rect → near-full-viewport window, sine ease, ~500-700ms; reduced-motion = instant swap). Use same-document View Transitions API where available with a FLIP fallback, or pure FLIP — planner's call, but it must read as "the card grows into the window", not a fade.
- The module window fills roughly the full first-viewport ("above the fold" size), keeps a visible close affordance, Esc + focus-return semantics from the existing cards.js, scroll inside the window if content exceeds it.

**Reskinned quiet modules (ITER-05 — this REPLACES the verbatim-design-port rule for modal content ONLY)**
- Copy stays verbatim (chunks from the ported data; copy gates still apply). The PRESENTATION is redesigned: quieter, browsable, click-into-able — "not walls of text".
- Techniques to reach for (researcher to refine): progressive disclosure (one thing visible at a time — steppers/accordions/tabbed slices reusing the module's own interaction data), generous whitespace, type hierarchy over boxes, content revealed on interaction rather than listed, counts/labels as entry points ("13 agents" → grid of names → detail on click), single-column measure caps, no dense multi-column text fields.
- Keep each module's FUNCTIONAL interactions (problems tabs, agent detail, FAQ accordion pattern etc.) but re-clothed in the quieter skin. Light mode, shared tokens, Fritz rules bind this new chrome fully (no rule lines, Flarepop-only colored text, flat surfaces, sine motion).
- Nav-linked standalone pages (pages/os.html etc.) keep the deployed design — the reskin applies to the module windows on the homepage.

**Case-card module windows (ITER-06)**
- The 3 case cards open module windows with the same scaling transition, presenting each case quietly: name, client, summary, then challenge/approach/results as progressive disclosure (verbatim copy from `work.cases[i]`), stat as the visual anchor.

### Claude's Discretion
- Exact grid columns (5 cards: e.g. 5-across at wide, 3+2, or asymmetric featured layout), the hover technique choice, module window internal layouts per section, FLIP vs View Transitions implementation
- Work reel section composition details (heading placement over reel, card row position)

### Deferred Ideas (OUT OF SCOPE)
- Real client-footage work reel (current reel is stills-montage from known work; revisit if Jon supplies motion footage)
- Reskinning the standalone section pages to match the quiet modules (keep deployed design there for now)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-------------------|
| ITER-01 | Desktop first viewport contains compact hero + full section-card grid | Above-the-fold budget math below (topbar 72px + hero-copy + card-row arithmetic at 1440×900 and 1280×800); finds `--maxw:1200px` means both breakpoints share one budget |
| ITER-02 | Uniform-height cards, top/bottom anchored copy, explicit expand CTA | `.card` restructure to flex-column + `margin-top:auto` (idiom already proven in-repo on `.agent-card-v6 .ac-go`); explicit CTA-row recommendation |
| ITER-03 | Semi-opaque cards over video, video-mimicking hover, reduced-motion/touch parity | Measured `hero-light-poster.jpg` luminance + WCAG contrast math; hover-technique ranking (translucency shift primary, CSS wave secondary, backdrop-filter tertiary with iOS caveat); `@media(hover:hover)` touch-parity pattern |
| ITER-04 | Card→full-viewport scaling transition | View Transitions API + native `<dialog>` compatibility findings (top-layer-safe, does not touch the live dialog's `transform`); FLIP fallback must target an inner wrapper, never `dialog.module-modal` itself (the Phase-5 no-transform invariant) |
| ITER-05 | Reskinned quiet module windows, progressive disclosure, no walls of text | Per-module data-shape read (`buildSolve()`/`renderFlow()`/`renderAgents()` source confirmed) + concrete disclosure pattern recommended per module; "read from existing JS data, don't re-type copy" verbatim-safety finding |
| ITER-06 | Full-screen work section: reel + 3 case cards → case module windows | Work-section restructure map (old `dlg-work`/`openCase()`/`#casePanel` retired on homepage only); reel autoplay/IntersectionObserver/poster/LCP pattern (web.dev-verified) |
| ITER-07 | FAQs/Convert/footer plain below-fold, not cards/modals | Restructure map: unwrap `dlg-faqs`/`dlg-convert` to plain `<section>`s; top-layer stacking issue no longer applies to them once un-dialogued |
| ITER-08 | Client logo strip kept in current position | Confirmed structurally already sits exactly between the hero-viewport and where Work must be inserted — zero repositioning needed |
</phase_requirements>

## Summary

This phase is a restructuring of an already-built, already-QA'd page (`concept-d/index.html`, its `cards.js`, and `concept-d.css` from Phase 5/6), not a new build from scratch. The single most load-bearing existing fact is the Phase-5 invariant documented directly in `concept-d.css`: `dialog.module-modal` must **never** receive `transform`/`filter`/`backdrop-filter`/`perspective`/`contain`, because `cards.js` reparents the shared drawer scaffold (`#scrim`/`#convoDrawer`/`#pitchLabs`) *into* the open dialog on click, and any of those properties would create a new containing block that traps the reparented `position:fixed` drawers inside the dialog's own box instead of letting them cover the viewport. Every recommendation below was checked against this constraint. The good news, verified against two independent 2025/2026 sources (Medienbäcker's and web-standards.dev's dialog-view-transition writeups) plus the CSS positioned-layout spec's containing-block trigger list: the View Transitions API's scale/morph animation runs on a browser-generated **snapshot pseudo-element** (`::view-transition-group`/`::view-transition-new`), not by mutating the live dialog's own `transform` property, and `view-transition-name` is not one of the properties that establishes a new containing block for `position:fixed` descendants. So View Transitions is compatible with the existing invariant; a manual FLIP fallback is NOT automatically compatible — if implemented, the scale transform must land on an inner `.modal-body` wrapper *inside* the dialog, never on `dialog.module-modal` itself, or it will reintroduce the exact Phase-5 landmine the invariant exists to prevent.

The second major finding is architectural rather than visual: three of the eight existing dialogs are not being reskinned so much as **retired from the homepage entirely**. `dlg-work` (the old "the proof" modal, using `.case-v6`/`openCase()`/`#casePanel`) is replaced outright by a new full-screen Work section whose 3 case cards must use fresh dialogs (`dlg-case-*`) built the same way as the 5 section modules — critically, **not** wired via the deployed `[data-case]`/`openCase()` global listener, which calls `document.getElementById('cType')` etc. with no null guard and will throw if those elements (which live only inside the now-removed `#casePanel`) don't exist. `dlg-faqs` and `dlg-convert` are unwrapped into plain page-flow `<section>`s (with their `<dialog>`/`.modal-close` wrapper simply removed) — which has the pleasant side effect of making the Phase-5 top-layer/drawer-stacking problem moot for those two modules, since un-dialogued content never needs its drawer scaffold reparented. That leaves exactly 5 cards and 5+3=8 dialogs total, matching the locked page structure precisely.

The third finding, verified by direct code reads of `renderFlow()`/`buildSolve()`/`renderAgents()` in `deployed.js`, is that the modules are NOT equally "wall of text": Agents already renders a quiet name+icon+one-line-role grid with detail-on-click (`renderAgents()`) — it needs the least restructuring, mostly a visual quieting pass. InterceptOS's `renderFlow()` is the densest offender, rendering all 4 stages of a flow simultaneously with full descriptions always visible — this is the strongest candidate for a stepper. Because all of Problems/InterceptOS/Agents/Work-cases' real copy lives inside `deployed.js`'s `PROBLEMS_RR`/`PROBLEM_FLOWS`/`AGENTS`/`CASES` objects (verified verbatim-gated by `qa/concept-d-script-diff.py`, which byte-compares those exact object regions against the staging source), the safe way to reskin them is to **write new render functions that read from these same untouched data objects**, not to hand-type new HTML — this preserves the verbatim guarantee exactly the way Phase 5 already established, and requires zero changes to the gated regions of `deployed.js`.

**Primary recommendation:** Use the View Transitions API (`document.startViewTransition()` wrapping `showModal()`/`close()`, with `view-transition-name` handed off from card to dialog) as the primary card→window mechanism, falling back to a plain instant `showModal()` (not a manual FLIP, and not a fade) when `document.startViewTransition` is unsupported or `prefers-reduced-motion` is set — Baseline support (Chrome/Edge 111+, Firefox 133+, Safari 18+) makes the fallback population small enough that hand-rolling FLIP is not worth the risk of violating the no-transform invariant. Retire `dlg-work`/`openCase()`/`#casePanel` from the homepage; build 3 new case dialogs the same way as the 5 section dialogs. Unwrap FAQs/Convert into plain below-fold sections. Reskin Problems/InterceptOS/Agents/Labs/Insights/case-windows by writing new render functions against the existing untouched JS data objects, applying one concrete progressive-disclosure pattern per module (detailed below). Shrink the hero and fix the 5-card grid's column math (auto-fit at `minmax(220px,1fr)` does not cleanly resolve 5 columns inside the 1200px `--maxw` — verified by arithmetic below) to fit the above-the-fold budget at both 1440×900 and 1280×800.

## Standard Stack

No new libraries — this remains a no-build, vanilla-JS static project. Every API below is either already proven in this exact codebase or newly verified as Baseline-safe for 2026.

### Core
| API / Pattern | Where already proven / verified | Purpose | Confidence |
|---|---|---|---|
| `document.startViewTransition()` + `view-transition-name` handoff | Verified via Medienbäcker (medienbaecker.com/articles/dialog-view-transitions) and web-standards.dev (Dec 2025), cross-checked against web.dev's "Same-document view transitions are now Baseline Newly available" (Chrome/Edge 111+, Firefox 133+/144, Safari 18+) | Card→dialog scale/morph transition | MEDIUM — pattern verified by 2 independent recent articles + Baseline data; not yet tested against THIS codebase's specific markup |
| Native `<dialog>` + `.showModal()`/`.close()` | `cards.js` (already shipped, Phase 5/6) | Modal window, focus-trap, Esc, top-layer | HIGH — already live in this repo |
| `IntersectionObserver` | Phase 5 hero-video research; web.dev's lazy-loading-video article | Gate the below-fold work-reel's play/pause to visibility | HIGH — standard, well-documented pattern |
| `@media (prefers-reduced-motion: reduce)` | `hero-video.js`, `cards.js` (already shipped) | Instant swap for card→modal, freeze reel to poster | HIGH |
| `@media (hover: hover) and (pointer: fine)` | New — not yet used in this codebase | Scope true mouse-hover-only card effects away from touch, giving touch its own `:focus-visible`/`:active` parity state | HIGH — standard responsive-hover idiom |
| `<details>/<summary>` | `dlg-faqs` (already shipped) | Reuse for Insights-episode and Problems "the tells" progressive disclosure — no new JS needed | HIGH |
| `@property` (typed custom properties) | New — for an animatable CSS-only wave/ripple hover if chosen | Baseline Newly Available since July 2024, universal 2026 support (Safari/Firefox/Chrome) — verified via web.dev's "@property: Next-gen CSS variables now with universal browser support" | HIGH |

### Supporting
| Asset | Purpose | State |
|---|---|---|
| `concept-d/assets/video/work-reel-1080.webm/.mp4` + `work-reel-poster.jpg` | Full-screen Work-section reel | Already cut and committed (per `ASSETS.md`: 20.6s montage, 5 segments, crossfades, muted, hard-cut loop) — no new asset work needed |
| `hero-light-poster.jpg` | Hero video's own poster; measured for the card-contrast math below | Already present |

### Alternatives Considered
| Instead of | Could use | Tradeoff |
|---|---|---|
| View Transitions primary + instant-swap fallback | Manual FLIP as the primary mechanism (getBoundingClientRect-based, per the tahazsh.com pattern) | Rejected as primary — that pattern scales a single element that IS the modal (`position:fixed` on the modal itself during the transition), which is exactly what the Phase-5 no-transform invariant forbids on `dialog.module-modal`. Usable only as a documented fallback, and only if scoped to an inner wrapper div, never the dialog box |
| Reskin via new render functions reading existing JS data objects | Hand-author new static HTML with the same copy re-typed for each module | Rejected — re-typing risks the exact copy-drift failure mode `qa/copy-diff.py`/`concept-d-script-diff.py` exist to catch, and duplicates data that's already correct in `deployed.js` |
| Explicit `grid-template-columns: repeat(5, 1fr)` for the section-card grid | Keep `repeat(auto-fit, minmax(220px, 1fr))` unchanged from Phase 5 | The unchanged version does not resolve to a clean single row of 5 at `--maxw:1200px` (see math below) — auto-fit was tuned for the ORIGINAL 8-card grid, not this phase's 5-card grid |

**Installation:** None — no package manager, no build step.

## Architecture Patterns

### 1. Scaling card→window transition (ITER-04)

**Recommended: View Transitions API, primary; instant swap, fallback. No manual FLIP as the default path.**

Verified sequence (cross-checked against Medienbäcker's and web-standards.dev's Dec-2025 writeups, both independently describing the same handoff pattern):

```javascript
// Source: pattern verified via medienbaecker.com/articles/dialog-view-transitions
// and web-standards.dev/news/2025/12/dialog-view-transitions/ — adapted to this
// codebase's existing cards.js openModal()/reparentInto() shape.
function openModal(dialog, invoker, card) {
  if (!dialog) return;
  lastInvoker = invoker || lastInvoker;

  var reduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function doOpen() {
    reparentInto(dialog);           // existing Phase-5 fix, unchanged
    dialog.showModal();
    window.dispatchEvent(new Event("resize")); // existing fritz-bg fix, unchanged
  }

  if (reduced || typeof document.startViewTransition !== "function") {
    doOpen();                        // instant swap — no morph, no fade
    return;
  }

  card.style.viewTransitionName = "modal-morph";
  document.startViewTransition(function () {
    card.style.viewTransitionName = "";
    dialog.style.viewTransitionName = "modal-morph";
    doOpen();
  }).finished.finally(function () {
    dialog.style.viewTransitionName = "";
  });
}
```

Close should mirror this (handing the name back to the invoking card and wrapping `dialog.close()`), and must intercept the dialog's `cancel` event (fired by Esc) with `preventDefault()` so the close can also be wrapped in a transition — both source articles flag this as the one non-obvious gotcha, since `cancel`+immediate close would otherwise skip the transition.

**Why this doesn't violate the no-transform invariant (MEDIUM confidence, logically verified, not yet empirically tested in this codebase):** the CSS Positioned Layout spec's containing-block triggers for `position:fixed` descendants are `transform`, `filter`, `perspective`, `contain` (paint/layout/strict/content), `backdrop-filter`, and a matching `will-change`. `view-transition-name` is not among them — assigning it captures the element into the browser's separate view-transition pseudo-element tree for the duration of the transition, but does not add a live `transform` to the dialog's own box. The morph/scale animation plays out on `::view-transition-group(modal-morph)`/`::view-transition-new(modal-morph)` (snapshot pseudo-elements, rendered in their own top-layer slot), and once the transition finishes those pseudo-elements are discarded and the real, untransformed `dialog.module-modal` remains. **Recommend a real capture-review check once implemented** (this codebase's own established practice) specifically confirming the reparented drawer scaffold still renders full-viewport from inside a dialog that has an active/recent view-transition-name — this is the one interaction in this phase that hasn't been directly tested, only reasoned from spec.

**FLIP fallback, if pursued instead:** never apply the FLIP scale transform to `dialog.module-modal` itself. Wrap the module's rendered content in an inner `.modal-body` div (a new, purely-cosmetic wrapper, harmless to add) and apply `transform: scale()`/`translate()` to THAT element only. The dialog box itself stays untransformed at all times, preserving the drawer-reparenting invariant. Given Baseline coverage is now broad, recommend treating manual FLIP as unnecessary complexity rather than building it defensively — same instant-swap fallback covers the same non-View-Transitions population reduced-motion already covers.

**Naming scheme:** a single reused `view-transition-name` (e.g. `"modal-morph"`) assigned/cleared per open/close is sufficient — only one dialog can be open at a time in this architecture (native `<dialog>` + this codebase's own single-`lastInvoker` model), so cross-talk between concurrent transitions isn't a real risk.

### 2. Above-the-fold budget (ITER-01/02)

**Both target breakpoints share the same content-width budget**, because `--maxw:1200px` (deployed.css) caps `.wrap` at 1200px regardless of whether the viewport is 1280 or 1440 wide — the only difference between the two breakpoints is *available height*, not width.

| Metric | 1440×900 | 1280×800 |
|---|---|---|
| Topbar (sticky, measured from `.topbar .row` padding `15px×2` + ~40px content row + 1px border) | ~72px | ~72px |
| Available height below topbar | 828px | 728px |

**Confirmed the CURRENT (pre-iteration) hero already overflows badly**, which is the arithmetic justification for why this restructuring is necessary, not just an aesthetic preference: original hero copy (`.hero{padding:100px 0 0}` + `.kick{margin-bottom:24px}` + `h1.hero-h1{font-size:clamp(40px,6.6vw,86px);max-width:15ch}` wrapping the 58-character headline across ~3-4 lines at that width + `.hero-sub{max-width:60ch}` wrapping the ~285-character sub across ~5 lines + `.hero-ctas{margin-top:36px}` + a button) totals roughly **585px** by itself. The CURRENT 8-card grid (`repeat(auto-fit,minmax(220px,1fr))` inside 1144px usable width resolves to exactly 4 columns — see grid math below — so 8 cards wrap to 2 rows at ~180px/row) adds another **~376px**. Combined with the current `.hero-viewport{padding:132px 0 64px;gap:56px}`, total need is **~1213px** — roughly 1.35× the 900px viewport itself. This confirms Jon's "~40-50% of current visual weight" instruction is not just stylistic — a straightforward proportional cut is exactly what's needed to reach a single-viewport fit.

**Recommended compact-hero values (calculated starting point, not gate-verified — confirm via the project's established Puppeteer capture-review practice once built):**

| Element | Current | Recommended compact |
|---|---|---|
| `.hero-d .kick` margin-bottom | 24px | 8px |
| `h1.hero-h1` font-size | `clamp(40px,6.6vw,86px)` | `clamp(26px,3.2vw,40px)` |
| `h1.hero-h1` max-width | `15ch` | `32ch` (wraps the 58-char h1 text to ~2 lines at this size — matches "one to two lines") |
| `h1.hero-h1` line-height | 1.03 | 1.12 (slightly looser reads calmer at smaller size) |
| `.hero-sub` margin-top | 30px | 12px |
| `.hero-sub` font-size | `clamp(17px,1.7vw,21px)` | `clamp(14px,1vw,15px)` |
| `.hero-sub` max-width | 60ch | 62-64ch |
| `.hero-ctas` | kept, margin-top 36px | recommend dropping or shrinking to margin-top 14px — redundant once cards are immediately visible below (Claude's Discretion) |
| `.hero-viewport` padding | `132px 0 64px` | `32px 0 28px` |
| `.hero-viewport` gap | 56px | 24-28px |

Rough total with these values: kick ~23px + h1 2 lines ~76px + sub ~4-5 lines ~110-130px ≈ **210-230px hero copy**, well under half the original 585px estimate. Combined with padding/gap (32+28+28=88px) and a 5-card row (below), total lands around **440-460px** at both breakpoints — comfortably inside 728px (the tighter of the two available-height budgets), leaving margin for capture-review tuning.

**Card grid column math (verified arithmetic, concrete finding, not a guess):** `.wrap` usable width at `--maxw:1200px` minus `28px×2` padding = **1144px**. Current `.card-field{grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}` resolves column count as `floor((1144+16)/(220+16)) = floor(1160/236) = 4` — **4 columns, not 5**. Unchanged, 5 cards would wrap to a 4+1 layout, breaking the "uniform tile height, identical rhythm" requirement (a lone 5th card on its own row reads as a leftover, not a considered layout). **Recommend an explicit modifier**, e.g. `.card-field--five{grid-template-columns:repeat(5,1fr)}` active above a ~900-960px breakpoint, falling back to `repeat(auto-fit,minmax(200px,1fr))` below it — keep the original `.card-field` (unmodified `auto-fit,minmax(220px,1fr)`) for the 3-card Work-section row, where 3×220px+2×16px=692px fits with room to spare inside 1144px and doesn't need the override.

**Card height budget:** recommend `min-height` on `.card` (~140-150px) plus `-webkit-line-clamp:2` on `.card-teaser` to force genuinely uniform tile height regardless of natural per-card text length (currently teaser text varies from ~40 to ~110 characters across the 5 modules, which without a clamp would make cards visibly uneven — the opposite of the "identical tile to tile" requirement).

### 3. Card content architecture: top/bottom anchoring + explicit CTA (ITER-02)

**Don't hand-roll a new top/bottom-anchor idiom — one already exists in this exact codebase.** `deployed.css`'s `.agent-card-v6 .ac-go{margin-top:auto}` (on a `display:flex;flex-direction:column` parent) is the exact "pin this to the bottom of an otherwise-top-aligned flex column" pattern ITER-02 needs. Recommend restructuring `.card` from `display:block` to `display:flex;flex-direction:column`, with the eyebrow at the top (unchanged), an empty/flexible spacer (implicit — flex children with no `flex-grow` on the top elements leaves the gap naturally if the bottom block gets `margin-top:auto`), and a new bottom block containing the heading + one verbatim teaser line (line-clamped) + a new CTA row, all wrapped together with `margin-top:auto` so it's flush to the card's bottom edge regardless of how much top content precedes it.

**CTA affordance recommendation:** use a **uniform** label across all 8 cards (5 section + 3 case), not a mix of verbatim per-module CTA phrases of differing length — CONTEXT permits either, but a uniform label (e.g. `Open` with a small `+` or `→` glyph) is what actually delivers the locked "baseline rhythm is identical tile to tile" requirement; mixing "Build with Labs" (Labs' own verbatim CTA) against a generic "+" on the other 4 cards would reintroduce visible unevenness the flex restructure just fixed. Style it like the existing `.card-eyebrow` (mono, small, uppercase) for visual consistency with the rest of the card.

### 4. Semi-opaque card + video-mimicking hover (ITER-03)

**Measured, not assumed:** `hero-light-poster.jpg` (the video's own first frame, used as its `poster`) has a grayscale luminance range of **166-255** (8-bit), mean **212.4** — confirms the source is genuinely light throughout, with no dark patches. Computing WCAG relative luminance and contrast ratio for dark ink text (`--fg:#0a0a0f` in light theme) against this poster's **darkest** measured pixel value (166) with **zero** white overlay yields **≈8.1:1** — already comfortably above AA (4.5:1). Adding the current 94%-white card fill (`rgba(255,255,255,0.94)`) pushes the composited background to ≈250/255 regardless of what's underneath, yielding **≈18.9:1** — meaning the current implementation has enormous, unnecessary contrast headroom to spend on translucency.

**Recommendation:** lower the RESTING-state fill to roughly **72-78% white** (down from 94%) and drop to **45-55% white on hover/focus** to genuinely "let the particle-wave field pass through," while both states remain comfortably AA-compliant per the math above (even a fully-transparent card over this specific poster clears AA against dark ink). *Caveat:* this analysis used a grayscale conversion of the poster (a reasonable proxy, not an exact per-channel WCAG measurement) — recommend a quick capture-review spot-check once implemented, particularly on any colorful/saturated frame of the actual looping video (not just its static poster), since a strongly-saturated color channel could locally reduce contrast more than the grayscale proxy suggests.

**Hover technique ranking (all three are CONTEXT-permitted; ranked by cost/robustness):**
1. **Primary — translucency shift.** Animate `background-color`'s alpha channel (72-78% → 45-55%) on `:hover`/`:focus-visible`, `transition: background-color 1.1s cubic-bezier(...)` (matches the sine-ish "calm, long duration" easing already used elsewhere in `concept-d.css`). Cheapest possible technique — no GPU layer promotion needed, trivially disabled via `prefers-reduced-motion` (`transition:none`), and touch parity is free (see below).
2. **Secondary/additive — CSS-only sine-eased wave.** A `::after` pseudo-element with a `repeating-linear-gradient` or soft radial highlight, animated via an `@property`-typed custom property (Baseline-safe in 2026 per web.dev) so the gradient position/opacity can be smoothly interpolated by a CSS `@keyframes` or transition, gated to `:hover`/`:focus-visible` only and fully CSS — matches Jon's "ripple/wave" language literally. Can be layered on top of the translucency shift for a richer effect without materially increasing cost.
3. **Tertiary, use sparingly if at all — `backdrop-filter`.** Verified (2026 sources): GPU-accelerated and generally cheap on desktop, but (a) mobile blur values above ~10px can drop frames, and (b) there is a well-known iOS Safari bug where `backdrop-filter` on a `position:fixed` element causes scroll-jank as the browser re-blurs every scroll frame. The `.card` elements here are NOT themselves `position:fixed` (only the video layer behind them is), so the worst form of that bug doesn't directly apply, but the cards do sit permanently within `.hero-viewport`, stacked over an always-fixed video for the section's lifetime — if used, keep blur radius small (≤6px), apply it only on `:hover`/`:focus-visible` (not persistently), and treat it as an optional accent, not the primary mechanism.

**Reduced-motion + touch parity:** wrap the hover-only rules (particularly any animated wave) in `@media (hover: hover) and (pointer: fine)` so touch devices never get a "stuck hover" from a simulated tap-hover; give touch/keyboard the SAME end-state via `:focus-visible` (already the existing pattern in `.card:hover,.card:focus-visible{...}` in `concept-d.css` — extend it, don't replace it) plus an explicit `:active` press state for genuine touch taps. `prefers-reduced-motion` should disable transitions/animations only (`transition:none`), not the different alpha/state values themselves — silent means "instant," not "absent."

### 5. Quiet progressive-disclosure per module (ITER-05)

Verified by direct reads of `deployed.js`'s render functions — module data shapes are NOT equally dense, and the reskin effort differs accordingly:

| Module | Current density (verified from `deployed.js`) | Recommended quiet pattern |
|---|---|---|
| **Problems** (4 items: quote/attrib/tells/signal/bridge) | `buildSolve()`/`activateSolve()` already show only ONE of 4 problems at a time via tab-select (already quiet at the top level) — but the active panel shows quote+attrib+3 tells+signal+bridge all simultaneously | Keep the tab-select mechanism unchanged. Within the active panel, treat the quote as the headline (large, generous whitespace) and collapse the 3 "tells" bullets behind a small `<details>` toggle ("What we're hearing" — reuses the FAQ's proven native accordion, zero new JS), with the signal stat and bridge sentence remaining as the closing beats. |
| **InterceptOS** (4 flows × 4 stages) | `renderFlow()` renders ALL 4 stages of the selected flow simultaneously, each with tag+name+agent-chips+full description paragraph — this is the single densest module, confirmed by code read, not assumption | Restructure into a numbered stepper: show ONE stage at a time (Diagnostic → Core → Innovation → Outcome) with Prev/Next or a small progress rail; reveal that stage's description + agent chips only when it's the active step. Flow-picker tabs (existing) stay as the outer selector. |
| **Agents** (13 items, 4 categories, detail fields) | `renderAgents()` ALREADY renders a quiet grid: icon + name + one-line role + "Learn more" per card, with full desc/solves/sample revealed only in `agentDetailOverlay` on click — this is already almost exactly the "13 agents → grid of names → detail on click" pattern CONTEXT itself describes | Least restructuring needed of any module — mostly a visual quieting pass (whitespace, lighter card borders, calmer typography), not a structural rebuild. |
| **Labs** (teaser + stat + cta) | Already the smallest data shape — 1 heading, 1 paragraph, 1 stat, 1 cta | No progressive disclosure needed (nothing to disclose) — treat the single stat as a strong visual anchor with generous whitespace around the heading/body; keep near-verbatim. |
| **Insights** (3 episodes × links) | Each `ep-tile` currently shows image + episode# + title + guest + FULL 2-3 sentence summary + 3 platform links, all always visible — 3 of these stacked reads dense | Show episode#/title/guest by default; collapse the summary paragraph + platform-link row behind a per-tile `<details>` ("Read more" / "Listen on") — reuses the same native accordion idiom as FAQs and Problems' "tells," zero new JS. |
| **Work cases** (challenge/approach/results/agents/stat) | Currently all three prose blocks (`cChallenge`/`cApproach`/`cResults`) render simultaneously in the old `#casePanel` drawer | Metric/stat as the visual anchor at top (already the "visual anchor" CONTEXT names), name+client+summary always visible, then challenge/approach/results as a 3-way tab or single-open accordion (one section visible at a time) rather than three always-visible paragraph blocks. |

**Verbatim-safety finding (HIGH confidence, empirically confirmed):** `qa/concept-d-script-diff.py` byte-compares the `PROBLEMS_RR`/`PROBLEM_FLOWS`/`AGENTS`/`CAT_LABELS`/`CASES` object regions in `deployed.js` against the staging source — these regions must stay byte-identical. Because the reskin only needs a different PRESENTATION of this same data, the correct and only-verbatim-safe approach is: **write new render functions (in a new file, or appended to `cards.js`/a new `reskin.js`) that read from these same untouched global objects and build the new, quieter DOM** — never hand-type the copy again into new static markup. This is a direct continuation of the exact pattern Phase 5 already established for the ported modules, applied to the new stepper/accordion presentation instead of the old dense one. `qa/copy-diff.py`'s static-HTML substring gate cannot see JS-injected text either way (an already-documented, accepted blind spot from Phase 5/6) — `concept-d-script-diff.py` remains the correct compensating gate and needs NO changes for this phase, since it verifies the DATA, not how it's rendered.

### 6. Full-screen Work section (ITER-06)

**Two autoplaying videos on one page — confirmed manageable, verified pattern (web.dev):** the hero video (`.hero-video-layer`, always-fixed, plays for the page's lifetime) and the new below-fold reel are architecturally independent; the risk is not "two videos" per se but making sure the SECOND one doesn't autoplay/download until it's actually in view.

**Recommended reel markup, verified against web.dev's lazy-loading-video guidance directly:**
```html
<!-- Source: pattern verified via web.dev/articles/lazy-loading-video —
     preload="none" + poster avoids downloading video bytes until an
     IntersectionObserver confirms the section is in view; NOT autoplay
     in markup (unlike the hero, which needs an immediate first frame). -->
<video class="reel-video" muted playsinline loop preload="none"
       poster="assets/video/work-reel-poster.jpg">
  <source src="assets/video/work-reel-1080.webm" type="video/webm">
  <source src="assets/video/work-reel-1080.mp4" type="video/mp4">
</video>
```
JS: an `IntersectionObserver` on the Work `<section>` calls `.play()` when it enters the viewport (a real user gesture isn't required since the video is `muted`) and `.pause()` when it leaves — the same idiom Phase 5's research already cited (`fritz-bg` canvas engine, `concept-b/video.js`) is directly reusable here, just observing the Work section instead of the hero. Because `preload="none"`, the poster image is the only thing painted before the observer fires — verified via web.dev: "the best chance of avoiding loading the video is with preload='none'," with the poster giving immediate visual context. This also protects LCP: since the reel is below the fold, it is not a candidate for the initial paint's LCP element regardless, but `preload="none"` additionally means its poster/video bytes don't compete for bandwidth with the hero video and hero poster during the critical initial-load window.

**Reduced-motion:** same freeze-to-poster treatment as the hero (`hero-video.js`'s pattern is directly portable — pause immediately, sync a pause-control affordance, never auto-resume against an explicit user pause).

### 7. What restructures — concrete file-level delta map

Verified by direct reads of `concept-d/index.html`, `cards.js`, `concept-d.css`:

- **`#modules` card-field**: drop the Work/FAQs/Contact `.card`+`.card-fallback`+`.card-static` triples entirely (3 of the current 8 removed); the remaining 5 (Problems/InterceptOS/Agents/Labs/Insights) get the flex-column/CTA-row restructure from §3 and the explicit `grid-template-columns` fix from §2.
- **`dlg-problems`, `dlg-os`, `dlg-agents`, `dlg-labs`, `dlg-insights`**: kept as dialogs, reskinned per §5. `dlg-agents`' bridge-to-`#agents` wiring (already in `cards.js`) and its `agentDetailContact` → `#convoDrawer` dependency both stay.
- **`dlg-work`**: REMOVED (dialog, markup, and its `.card`/`.card-fallback` pair). Replaced by a new full-screen `<section class="work-reel">` (placed after the Clients strip, per the locked page order) containing the reel video (§6), verbatim `work.eyebrow`/`work.h2`/`work.lead`, and 3 new `.card`-composition buttons (reusing the SAME `.card` component/CTA row as the section cards, NOT `.case-v6`).
- **3 new dialogs** (e.g. `dlg-case-hp-abx`, `dlg-case-intel-abm`, `dlg-case-sap-video`): built the same way as the 5 section dialogs — a new render function reading `CASES[key]` (untouched, gate-verified data), NOT wired through `openCase()`/`#casePanel`. **Concrete pitfall to avoid:** do not put a `data-case="..."` attribute on these new case-card buttons — `deployed.js` already has a page-load-time global listener (`document.querySelectorAll('[data-case]').forEach(b => b.addEventListener('click', () => openCase(b.dataset.case)))`) that will fire `openCase()` on ANY element carrying that attribute; `openCase()` calls `document.getElementById('cType')` etc. with no null guard, and those ids only exist inside the now-removed `#casePanel` — this WILL throw a runtime error if triggered. Use `data-modal="dlg-case-..."` (the existing `cards.js` convention) instead.
- **`#casePanel`** (`<aside class="drawer" id="casePanel">...</aside>`): safe to remove from `index.html` entirely — nothing on the restructured homepage references it once `dlg-work`'s case buttons are gone. (`pages/work.html` keeps its own independent copy, untouched — this is a per-document scaffold, not shared.) Recommend also dropping `"casePanel"` from `cards.js`'s `SCAFFOLD_IDS` array for cleanliness, though `document.getElementById()` returning `null` and being `.filter(Boolean)`-ed out means this is not a hard requirement.
- **`dlg-faqs`, `dlg-convert`**: unwrap — remove the `<dialog class="module-modal">`/`.modal-close` wrapper, keep the inner `<section id="faqs">`/`<section id="convert">` markup verbatim, move both (plus the existing `<footer>`) into plain page flow after the new Work section. Also remove their `.card`/`.card-fallback` pair from `#modules`. Once un-dialogued, their drawer dependency (`convert`'s `convo-tile` → `#convoDrawer`) needs NO reparenting fix — the Phase-5 top-layer/stacking problem only exists for content living INSIDE a `<dialog>`; plain page-flow content reaches the global end-of-body scaffold exactly the way the standalone `pages/*.html` already do.
- **Clients strip (`<section class="clients">`)**: requires ZERO repositioning — it already sits structurally between the closing `</div>` of `.hero-viewport` and where the new Work section needs to be inserted, matching the locked page order exactly as-is.
- **Closing tasks** (per CONTEXT's `code_context`): refresh `assets/gallery/concept-d.png` (now stale after this restructuring) and update `REVIEW.md`'s Concept D paragraph (currently describes the Phase-5 "click a card to expand its full module" behavior, which is still roughly accurate but should mention the new work-reel section and quieter modules).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| Card→modal top/bottom content anchoring | A new flex/grid recipe | `display:flex;flex-direction:column` + `margin-top:auto` on the bottom block | This exact idiom already exists in this codebase (`.agent-card-v6 .ac-go{margin-top:auto}`) |
| Progressive disclosure for Problems' "tells" and Insights' summaries | New custom accordion JS | Native `<details>/<summary>` | Already the proven, zero-JS pattern for FAQs in this exact file |
| Below-fold video visibility gating | A new scroll-position calculator | `IntersectionObserver` | Already used 3 ways in this codebase (fritz-bg canvas, hero video precedent research, this phase's reel) |
| Card→modal scale animation | Manual FLIP applied to `dialog.module-modal` itself | View Transitions API (or FLIP on an inner `.modal-body` wrapper only) | Manual FLIP on the dialog box directly reintroduces the exact drawer-reparenting containing-block landmine the Phase-5 invariant exists to prevent |
| Reskinned module copy | Re-typing Problems/OS/Agents/Case copy into new static HTML | New render functions reading the existing `PROBLEMS_RR`/`PROBLEM_FLOWS`/`AGENTS`/`CASES` objects | Preserves the byte-identical verbatim guarantee `concept-d-script-diff.py` already gates; re-typing risks the exact copy-drift failure mode this project's gates exist to catch |

**Key insight:** almost everything this phase needs is either already built in this exact codebase (drawer/focus-trap system, bottom-anchor flex idiom, native `<details>` accordion, `IntersectionObserver` video gating) or is a small, well-scoped net-new addition (View Transitions wiring, 3 new case-render functions + dialogs, one new full-screen section, CSS restructuring of `.card`/`.hero-viewport`/`.card-field`).

## Common Pitfalls

### Pitfall 1: Wiring the new case cards through the deployed `openCase()`/`#casePanel` path
**What goes wrong:** clicking a new work-section case card throws a runtime error (`Cannot set properties of null`) instead of opening the new case dialog.
**Why it happens:** `deployed.js` has a page-load-time global listener on `[data-case]` that calls `openCase()`, which does `document.getElementById('cType').innerHTML = ...` with no null check — those elements only exist inside `#casePanel`, which this phase removes from the homepage.
**How to avoid:** use `data-modal="dlg-case-..."` (the existing `cards.js` convention already used by all 5 section cards) on the new case-card buttons, never `data-case`.
**Warning signs:** a JS console error on click, or (if caught silently) nothing visibly happening.

### Pitfall 2: Applying the scale/morph transform to `dialog.module-modal` itself
**What goes wrong:** the reparented drawer scaffold (`#convoDrawer`/`#pitchLabs`) renders trapped inside the dialog's own box instead of covering the viewport, the exact Phase-5 landmine.
**Why it happens:** `transform` (and `filter`/`perspective`/`contain`/`backdrop-filter`) on an element establishes a new containing block for `position:fixed` descendants — `dialog.module-modal` carries reparented `position:fixed` drawers as (temporary) descendants during their open state.
**How to avoid:** if using View Transitions, this is naturally avoided (the morph runs on a snapshot pseudo-element, not the live box). If a manual FLIP fallback is built, apply the scale transform to an inner `.modal-body` wrapper only, never the `dialog.module-modal` element.
**Warning signs:** a drawer opened from inside a reskinned module (e.g. Agents' "Talk to us" CTA, or a case window's contact CTA) appears to do nothing, or flashes briefly at an edge.

### Pitfall 3: 5-card grid silently wrapping to 4+1 instead of a clean row
**What goes wrong:** the section-card grid shows 4 cards on one row and a lone 5th card alone on the next, breaking the "uniform tile height, identical rhythm" requirement and very likely blowing the above-the-fold budget (an extra card row costs ~150-165px).
**Why it happens:** `repeat(auto-fit,minmax(220px,1fr))` inside the 1144px usable width (`--maxw:1200px` minus 56px padding) resolves to exactly 4 columns by CSS Grid's own auto-fit algorithm (`floor((1144+16)/(220+16))=4`) — this was tuned in Phase 5 for an 8-card grid, not this phase's 5-card grid.
**How to avoid:** add an explicit `grid-template-columns:repeat(5,1fr)` modifier (behind an appropriate min-width breakpoint) for the section-card grid specifically; leave the original `auto-fit,minmax(220px,1fr)` untouched for the 3-card Work-section row, where it already resolves cleanly.
**Warning signs:** visible in any capture at ≥1024px width — an uneven last row.

### Pitfall 4: Treating "reskin" as license to re-type copy
**What goes wrong:** copy drift (paraphrase, truncation, typo) in the reskinned Problems/OS/Agents/Case content that neither `qa/copy-diff.py` (static-HTML only) nor `concept-d-script-diff.py` (checks the SOURCE data object, not what's rendered from it) will catch, if the new render code stops reading from the existing data objects and starts embedding hand-typed strings instead.
**Why it happens:** ITER-05's "PRESENTATION is redesigned" instruction could be misread as license to rewrite the markup AND the strings together.
**How to avoid:** the new render functions must read `PROBLEMS_RR[key]`/`PROBLEM_FLOWS[key]`/`AGENTS[key]`/`CASES[key]` directly at render time — never copy a string value out of them into a new hard-coded template literal.
**Warning signs:** none automatically detectable by the existing gates — this is exactly why the discipline matters; a manual spot-check diff (render the new module, compare visible text against the JSON) is the only backstop.

### Pitfall 5: Manual FLIP fallback silently broken by the `.card` becoming `display:flex`
**What goes wrong:** if a manual FLIP fallback is built, `getBoundingClientRect()` measurements taken before/after the §3 flex restructure could be inconsistent if the restructure and the transition code are written by different people/sessions without re-testing together.
**Why it happens:** FLIP is sensitive to the exact box model of the measured element; changing `.card` from `block` to `flex` mid-phase changes its rendered box.
**How to avoid:** sequence the `.card` flex restructure (§3) before writing any FLIP fallback code, so the fallback is measured against the FINAL card shape, not the old one.
**Warning signs:** a visibly incorrect start position for the morph animation, most noticeable at fast interaction speed.

## Code Examples

### View Transitions card→dialog handoff (adapt into `cards.js`)
```javascript
// Source: pattern verified via medienbaecker.com/articles/dialog-view-transitions
// and web-standards.dev/news/2025/12/dialog-view-transitions/
function openModalWithTransition(dialog, invoker) {
  var reduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var supported = typeof document.startViewTransition === "function";

  function doOpen() {
    reparentInto(dialog);
    dialog.showModal();
    window.dispatchEvent(new Event("resize"));
  }

  if (reduced || !supported) { doOpen(); return; }

  invoker.style.viewTransitionName = "modal-morph";
  document.startViewTransition(function () {
    invoker.style.viewTransitionName = "";
    dialog.style.viewTransitionName = "modal-morph";
    doOpen();
  }).finished.finally(function () {
    dialog.style.viewTransitionName = "";
  });
}
```

### Below-fold reel, IntersectionObserver-gated (new file or appended to `hero-video.js`)
```javascript
// Source: pattern verified via web.dev/articles/lazy-loading-video
var reel = document.querySelector(".reel-video");
if (reel && "IntersectionObserver" in window) {
  var reelObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (!prefersReducedMotion) reel.play();
      } else {
        reel.pause();
      }
    });
  }, { threshold: 0.25 });
  reelObserver.observe(document.querySelector(".work-reel"));
}
```

### Bottom-anchored card content (reuses the in-repo `.agent-card-v6 .ac-go` idiom)
```css
/* Source: pattern already proven in deployed.css's .agent-card-v6 .ac-go */
.card { display: flex; flex-direction: column; }
.card-bottom { margin-top: auto; }
.card-teaser {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

## State of the Art

| Old approach | Current approach (2026) | Impact for this phase |
|---|---|---|
| Cross-fade-only page/element transitions, or hand-rolled FLIP for shared-element morphs | Same-document View Transitions API with `view-transition-name` handoff, Baseline across Chrome/Edge 111+, Firefox 133+/144, Safari 18+ | Directly usable as the primary ITER-04 mechanism; FLIP demoted to a documented, carefully-scoped fallback rather than the default |
| Unconditional `:hover` rules applied identically to mouse and touch | `@media (hover: hover) and (pointer: fine)` scoping, with explicit `:focus-visible`/`:active` touch parity | Recommended for the ITER-03 hover state to avoid "stuck hover" on touch |
| Untyped CSS custom properties (no smooth interpolation for gradient/position values) | `@property`-typed custom properties, Baseline Newly Available since July 2024, universal by 2026 | Enables a clean CSS-only animated wave/ripple hover accent if pursued as the secondary hover technique |

## Open Questions

1. **Should the hero's "Explore more" CTA button survive the compact redesign?**
   - What we know: CONTEXT locks kicker+h1+sub as the compact hero's content; it doesn't explicitly mention the existing `.hero-ctas`/"Explore more" button.
   - What's unclear: whether keeping it (scrolled to `#modules`, which is now immediately visible below) is redundant now that the card grid shares the same viewport.
   - Recommendation: Claude's Discretion per CONTEXT's own framing — lean toward dropping it or shrinking it substantially, since its destination is already visible without scrolling once the hero is compact; flag to Jon during plan-check if kept.

2. **Exact hover-technique combination (translucency-only vs. translucency + CSS wave vs. + backdrop-filter accent).**
   - What we know: all three are CONTEXT-permitted; the contrast math confirms ample headroom for any combination.
   - What's unclear: the specific visual result reads as "calm" only in an actual capture — arithmetic can confirm contrast safety and performance cost but not the subjective "feels like the particle-wave field passes through it" bar.
   - Recommendation: implement the translucency-shift primary first (cheapest, safest), capture-review it, then layer the CSS wave accent only if the plain translucency shift reads as insufficient — avoid committing to `backdrop-filter` unless the simpler options are visually inadequate.

3. **Whether the View Transitions morph needs per-dialog-type tuning (section modules vs. case windows) or one shared recipe suffices.**
   - What we know: the handoff mechanism itself (name assignment, `startViewTransition` wrapping) is identical regardless of which of the 8 dialogs is opening.
   - What's unclear: whether the DEFAULT browser-generated morph (which interpolates size/position/border-radius automatically between the captured old and new states) looks right without any `::view-transition-*` CSS tuning, or whether custom easing/duration overrides are needed to hit the CONTEXT-specified "sine ease, ~500-700ms."
   - Recommendation: start with default browser timing, override `animation-duration`/`animation-timing-function` on `::view-transition-group(modal-morph)` only if a capture review shows the default feels too fast/linear — this is a CSS-only tuning step, not an architectural one.

## Sources

### Primary (HIGH confidence)
- Direct reads of `concept-d/index.html`, `concept-d/assets/js/cards.js`, `concept-d/assets/css/concept-d.css`, `concept-d/assets/css/deployed.css`, `concept-d/assets/js/deployed.js` (this session) — all line-level findings (invariants, grid math, render function bodies, drawer wiring) verified directly against current source
- `python3 -c "PIL..."` — direct pixel measurement of `hero-light-poster.jpg` (min 166, max 255, mean 212.4), run in this session
- `qa/copy-diff.py`, `qa/concept-d-script-diff.py` docstrings — read directly, confirms gate scope/blind-spot behavior unchanged by this phase
- `.planning/phases/05-concept-d-home-variant/05-RESEARCH.md` — the Phase-5 module port map and no-transform invariant, reused not re-derived
- `.planning/phases/07-concept-d-iteration-2/07-CONTEXT.md` — locked decisions, quoted verbatim above
- `.planning/REQUIREMENTS.md` — ITER-01..08 exact wording
- `content/homepage.json` — verbatim copy shapes for all modules (character counts for hero h1/sub used in the fold-budget math)
- [Same-document view transitions have become Baseline Newly available — web.dev](https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available) — Chrome/Edge 111+, Firefox 133+/144, Safari 18+
- [@property: Next-gen CSS variables now with universal browser support — web.dev](https://web.dev/blog/at-property-baseline) — Baseline Newly Available July 2024
- [Lazy loading video — web.dev](https://web.dev/articles/lazy-loading-video) — `preload="none"` + poster + `IntersectionObserver` pattern, directly quoted

### Secondary (MEDIUM confidence)
- [Dialog view transitions — Medienbäcker, Thomas Günther](https://medienbaecker.com/articles/dialog-view-transitions) — the exact card→dialog `view-transition-name` handoff pattern, `cancel`-event interception gotcha
- [Smooth view transitions for dialogs — web-standards.dev, Dec 2025](https://web-standards.dev/news/2025/12/dialog-view-transitions/) — independently corroborates the same handoff pattern and browser-support caveats (Safari missing `closedby`)
- [Creating a Smooth Card-to-Modal Transition with Vanilla JavaScript — tahazsh.com](https://tahazsh.com/blog/smooth-card-to-modal-transition/) — the manual-FLIP alternative pattern, confirms it scales the modal element itself (informs the "apply to an inner wrapper, not the dialog" fallback guidance)
- CSS Positioned Layout spec's containing-block trigger list (transform/filter/perspective/contain/backdrop-filter/will-change) — general web-platform knowledge, not independently re-verified against a single canonical MDN page in this session; the conclusion that `view-transition-name` is NOT among these triggers is a reasoned inference from this list, not a directly-quoted spec citation — flagged MEDIUM, recommend a capture-review confirmation once built (see Open Question 3 / §1's own caveat)

### Tertiary (LOW confidence)
- Backdrop-filter mobile/iOS performance claims (blur >10px dropping frames, `position:fixed`+backdrop-filter scroll-jank) — WebSearch-sourced summary across several 2026 CSS-guide articles, not cross-checked against a single canonical WebKit bug report; presented as a caveat/ranking rationale (tertiary technique), not a blocking fact

## Metadata

**Confidence breakdown:**
- File-level restructure map (what to remove/keep/add in `index.html`/`cards.js`): HIGH — every claim verified by direct source reads in this session
- Above-the-fold arithmetic (grid columns, current-vs-compact hero budget): HIGH — computed directly from measured/read CSS values, shown with formulas so the planner can re-verify
- Contrast/luminance math for card translucency: HIGH for the arithmetic itself (measured pixel data, standard WCAG formula); MEDIUM for its real-world sufficiency (grayscale proxy, not full-color video frames)
- View Transitions + native `<dialog>` compatibility with the no-transform invariant: MEDIUM — logically sound, cross-checked against 2 independent recent sources plus Baseline data, but not empirically re-tested against this codebase's actual nested-dialog+reparented-drawer markup
- Progressive-disclosure pattern per module: HIGH for the density assessment (verified by reading `deployed.js`'s render functions directly); MEDIUM for which specific quiet pattern reads best (a design judgment call, not a technical fact)

**Research date:** 2026-07-24
**Valid until:** As long as `concept-d/index.html`/`cards.js`/`concept-d.css`/`deployed.js` remain in their current (Phase 5/6-shipped) state — re-verify line-level claims if any of those files change before this phase is planned/implemented. The View Transitions Baseline-support claim is stable (already Baseline, not an emerging feature) but worth a quick recheck if implementation slips more than a few months.
