# Phase 5: Concept D — Home Variant (light video + module cards) - Research

**Researched:** 2026-07-24
**Domain:** Porting a large, self-contained, deployed multi-revision static HTML page (inline CSS + inline JS data-templated modules) into a modal/card reveal shell, plus mirroring 3 sibling pages, inside a no-build static-HTML project.
**Confidence:** HIGH for the port map (verified by direct line-ranged reads of the actual source file and a live gate run against it). MEDIUM for the modal-stacking and copy-gate-coverage findings (verified against one authoritative source each, not cross-checked against a second). LOW/discretionary for visual card-field treatment (explicitly Jon's/Claude's discretion).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Source of truth = the deployed bundle (NOT the earlier concepts)**
- Mirror `~/Creative-Projects/intercept-website-staging/home.html` — "the latest content we've uploaded to the deploy server. The one with the about page and the insights and the chatb2b page."
- **Keep the sticky nav + logo treatment exactly as deployed**: header markup/CSS ported verbatim (nav: InterceptOS · Intercept Labs · Work · About · Insights · Contact).
- **Section modules ported intact**: markup + styles + behavior (problems tabs, agents grid + detail pane, FAQ accordion, work cards, convert form drawer etc.) lifted from the staging page. Copy stays byte-identical by construction. Do not restyle the modules; only their container changes (modal / page shell).
- Light mode: the deployed site IS light — port its light tokens/styles as-is.

**The reveal model (Jon's spec, verbatim intent)**
- Full-screen light positive motion-graphics video background (ALREADY SOURCED — `concept-d/assets/video/hero-light-loop.webm/.mp4` + `hero-light-poster.jpg`, provenance in ASSETS.md; muted+playsinline+loop+poster, WebM first, reduced-motion → static poster, pause control, visibility pause — the proven Concept B idioms).
- Over the video: the deployed hero copy (kicker + h1 + sub, verbatim) plus a field of **small cards, one per home section module** — Problems, InterceptOS, Agents/Capabilities, Work, Labs, Insights, FAQs, Contact. Cards are enticing but small: verbatim eyebrow/heading + one verbatim teaser line, on light surfaces legible over the video. Cards are real `<button>`s.
- **Card click → modal-type window containing the COMPLETE section module** (the deployed section, fully functional — tabs/accordions/drawers work inside the modal). `<dialog>` + showModal, focus trap, Esc, focus-return (Concept B's proven panels.js idioms, adapted; module JS runs inside).
- Clients logo strip: shown as a quiet inline trust strip on the homepage (not hidden behind a card).
- **Nav click → full page with that content**: `os.html` (InterceptOS + agents modules), `labs.html`, `work.html`, `contact.html` (convert + FAQs) generated from the same ported modules in a standard page shell (deployed header/footer). About + Insights nav items link to `about.html` and `insights-hub.html` **mirrored verbatim from the staging bundle** into concept-d (plus `chatb2b.html` since insights links to it); their internal links may point back within concept-d where trivial, otherwise left as-is and noted.
- No scroll-jacking; if the card field overflows small viewports it scrolls natively. No-JS fallback: cards degrade to plain anchor links to the section pages.

**Copy discipline**
- Module porting is verbatim by construction. Gate: `qa/copy-diff.py` in **substring mode** against concept-d homepage + generated section pages (canonical chunks must appear verbatim). Mirrored staging pages (about/insights-hub/chatb2b) are exempt from the gate (they ARE the source).
- Brand greps still apply to NEW chrome we author (card field, modal shell): no banned tagline, no deprecated hexes, no invented rule lines in new CSS (ported deployed CSS is exempt — it is the approved live design), Flarepop-only colored text in new chrome.

### Claude's Discretion
- Card field layout/geometry over the video; modal sizing/scroll behavior for long modules
- How much of staging's inline JS ports wholesale vs scoped per-module
- Section page composition details (within "deployed design intact")

### Deferred Ideas (OUT OF SCOPE)
- Generating a true company work reel from Intercept motion assets (social-builder renders have baked-in copy; revisit if Jon supplies reel footage)
- Card-to-modal morph transitions (View Transitions named morphs)
- Insights article pages beyond the hub (mirror only what nav needs)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-------------------|
| COND-01 | Sticky nav + logo treatment mirrored from staging home.html | Header/nav port map below (exact lines 2304–2327); logo hover-glitch script (lines 3335–3428) and SVG defs (2151–2303) it depends on identified |
| COND-02 | Full-screen light positive video background, light-mode UI | Asset already sourced (`concept-d/assets/video/`); Concept B's `video.js` idiom (autoplay/reduced-motion/visibility-pause/iOS-rejection) verified reusable near-verbatim; deployed light-theme tokens identified (all light surfaces are flat white — see Pitfall on card legibility) |
| COND-03 | Small topic cards, one per section module, over the video | 8-card mapping table below (Problems/InterceptOS/Agents/Work/Labs/Insights/FAQs/Contact); Clients excluded (inline strip per decisions) |
| COND-04 | Card click → modal with complete module | Full port map (markup lines + CSS dependency groups + JS wiring) for all 8 modules; modal-feasibility findings (native `<dialog>` top-layer vs. global drawer scaffold conflict; canvas zero-dimension-when-hidden bug) with concrete fixes |
| COND-05 | Nav → standalone pages; About/Insights/ChatB2B mirrored | Page composition table (which modules → which of os.html/labs.html/work.html/contact.html); exact href-rewrite map for the 3 mirrored pages' `home.html`/`home.html#os`/etc. links; full relative-href table for every page in both root and `pages/` contexts |
| COND-06 | Module fidelity gate — copy verbatim + visual fidelity | copy-diff substring-mode smoke test run against staging home.html itself (42/42 pass, 0 fail) — and the gate's blind spot for JS-templated copy (113 of 155 long canonical chunks in `problems`/`os`/`agents`/`work.cases` are injected via JS and invisible to a static-HTML gate) documented with a compensating verification recommendation |
| COND-07 | Accessible modals, real `<button>` cards, no scroll-jacking | Concept B's `panels.js` (native `<dialog>`, free focus-trap/inert/Esc, manual focus-return only) is the exact idiom to reuse; deployed page's OWN existing focus-trap code (for its slide-in drawers) documented as a second pattern that must be reconciled with nested dialogs |
</phase_requirements>

## Summary

The staging homepage (`~/Creative-Projects/intercept-website-staging/home.html`, 3,430 lines) is one self-contained file: a single ~1,880-line `<style>` block (plus 6 small follow-on `<style>` patches applying later revision rounds), full inline SVG defs (client-logo marks, 13 agent glyphs, the animated Fritz lockup source, a hero RGB-glitch filter that Concept D does NOT need), and five `<script>` blocks totaling ~630 lines of logic plus ~1.85M characters of inline base64 case-study images. Every "module" the phase needs to port — Problems ("What we solve"), InterceptOS, Agents, Work, Labs, Insights, FAQs, Convert — already exists in this one file as an `id`-addressed `<section>` whose visible content is assembled at page-load by dedicated JS (`buildSolve()`, `renderFlow()`, `renderAgents()`, `openCase()`) reading from four JS data objects (`PROBLEMS_RR`, `PROBLEM_FLOWS`, `AGENTS`, `CASES`). This is the single most important architectural fact for planning: **most of this page's actual prose is not in the HTML — it's inside `<script>` string literals**, which has two direct consequences: (1) porting must be a verbatim copy-paste of the JS blocks, not a re-authoring from `content/homepage.json`, and (2) `qa/copy-diff.py`'s static-HTML gate can only verify the fraction of copy that happens to sit in static markup (confirmed empirically: 42 of 155 long canonical chunks, 0 failures, but 113 chunks silently un-checked because they only exist inside JS).

Given the sheer amount of cross-revision CSS layering (the stylesheet visibly iterates through r2/r4/r6/r7/r8 revision rounds, each overriding earlier rules for the same classes), the only safe porting strategy is to lift the **entire** stylesheet and the **entire** relevant script content near-verbatim into two shared files (`concept-d/assets/css/deployed.css`, `concept-d/assets/js/deployed.js`), rather than hand-picking "the CSS a module needs" — cherry-picking risks silently reverting a class to an earlier, superseded revision. Two script blocks and one head script must NOT be ported (the phone-redirect script, since `mobile.html` doesn't exist in this project; the hero's own 3-clip video-queue script, since Concept D's own new full-bleed video replaces it entirely). Everything else — the fritz-bg canvas pattern engine, the drawer/focus-trap system, the four data objects and their render functions, the logo hover-glitch animation — is directly reusable.

The reveal architecture that best satisfies "deployed design intact, least surgery" is: **render every module's full markup in the homepage DOM at all times** (each wrapped in its own `<dialog>`), rather than injecting HTML into a modal on click. This matters because several of the deployed page's init scripts (the fritz-bg canvas engine, `buildSolve()`, `renderFlow('intelligence')`, `renderAgents('strategy')`, the `[data-case]`/`[data-open]` listener wiring) run exactly once at page load and query the DOM as it exists then — a lazy "stamp this section's HTML into the modal only when opened" approach would silently break every one of them. The two genuine technical risks this research surfaced, both with concrete fixes documented below, are: (1) the deployed drawer system (case-study drawer, convo drawer, pitch drawer) uses `position:fixed` + `z-index`, but native `<dialog>` renders in the browser's "top layer" which ignores z-index entirely — a drawer opened from *inside* a module `<dialog>` will render underneath it unless the drawer scaffold is duplicated inside that dialog (or converted to a nested `<dialog>` itself); and (2) canvases measured via `clientWidth/clientHeight` at script-init time read `0×0` while sitting inside a closed (hidden) `<dialog>`, so the Fritz triangle-pattern backgrounds on Problems/Agents/Insights/Convert will render blank forever unless the modal-open handler re-fires a resize/re-measure.

**Primary recommendation:** Port the ENTIRE staging `<style>`/`<script>` content near-verbatim into two shared files, keep every module's markup live in the homepage DOM (wrapped in native `<dialog>`s, not lazily injected), reuse Concept B's `panels.js`/`video.js` idioms for the open/close/focus-trap and the new hero video, and treat the copy-diff gate's blind spot on JS-templated modules as a known, accepted gap compensated by a mechanical diff of the ported `<script>` block against the source (not a re-typed re-transcription).

## Standard Stack

This is a no-build static-HTML project (per project `Out of Scope`: no react-three-fiber/build tooling). There is no framework to select — the "stack" is entirely native browser APIs, all already proven in this codebase:

### Core
| API / Pattern | Where already proven in this repo | Purpose | Why standard here |
|---|---|---|---|
| `<dialog>` + `.showModal()` / `.close()` | `concept-b/assets/js/panels.js` | Accessible modal (focus trap, `inert` outside, Esc-to-close, top-layer rendering) | Native, zero-dependency, exactly what COND-07 requires; Concept B already validated it end-to-end |
| `IntersectionObserver` | staging `home.html` fritz-bg engine (line ~3285); `concept-b/assets/js/reveal.js`, `video.js` | Pause off-screen animation/video; scroll-reveal on sub-pages | Already used 3 different ways in this codebase; no need for a scroll library |
| `matchMedia('(prefers-reduced-motion: reduce)')` | staging `home.html` (hero video, fritz-bg); `concept-b/video.js` | Respect reduced-motion for the new hero video and any ported animation | Required by COND-02 and the project's global motion rule |
| `<details>/<summary>` | staging `home.html` `#faqs` (native, zero JS) | FAQ accordion | Already how the deployed FAQ module works; no re-implementation needed |
| `HTMLMediaElement` events (`play`, `pause`, `visibilitychange`) | `concept-b/assets/js/video.js` | Ambient hero video control | Directly portable near-verbatim (see Code Examples) |

### Supporting
| Asset | Purpose | When to use |
|---|---|---|
| `concept-d/assets/video/hero-light-loop.webm` (2.3MB) + `.mp4` (5.5MB) + `hero-light-poster.jpg` (95KB) | Already-sourced light hero video (Pexels #29448652, licensed for commercial use) | Hero background; WebM listed first in `<source>` order per ASSETS.md |
| Staging `assets/podcast/chatb2b-trailer.mp4` + `-poster.jpg` | Used by mirrored `insights-hub.html` and `chatb2b.html` | Must be copied alongside those two mirrored pages or they'll show broken video |

### Alternatives Considered
| Instead of | Could use | Tradeoff |
|---|---|---|
| Lifting the whole staging `<style>`/`<script>` verbatim | Hand-authoring fresh CSS/JS per module from `content/homepage.json`, as Concepts A/B/C did | Rejected — CONTEXT explicitly locks "deployed design intact... do not restyle"; hand-authoring also reintroduces the exact re-typing risk the project's copy-immutability rule exists to prevent |
| DOM-resident `<dialog>` per module, always in the page | Lazy-fetch/inject each module's HTML into one shared modal `<dialog>` on click | Rejected — breaks every one-time init script in the ported `deployed.js` (fritz-bg canvas engine, `buildSolve()`, `renderFlow()`, `renderAgents()`, `[data-case]`/`[data-open]` wiring all query the DOM once at parse time) |
| Global drawer scaffold (scrim + 3 drawers) once per page | Nested `<dialog>`-in-`<dialog>` drawers, duplicated per module dialog that needs them | The global-once approach is simpler on **standalone pages** (os.html/labs.html/work.html/contact.html — no enclosing dialog, works unmodified); duplication is only needed on the **homepage**, where modules sit inside dialogs (see Common Pitfalls) |

**Installation:** None — no package manager, no build step. All files are static assets copied into `concept-d/`.

## Architecture Patterns

### Recommended Project Structure
```
concept-d/
├── index.html                 # hero video + copy + 8 cards + inline Clients strip
│                               #   + all 8 module <dialog>s present in DOM (hidden)
│                               #   + footer + global drawer scaffold (scrim/casePanel/pitchLabs)
│                               #   NOTE: convoDrawer nested inside #convert + #agents dialogs (see Pitfalls)
├── about.html                  # mirrored verbatim from staging, hrefs rewritten (see table below)
├── insights-hub.html           # mirrored verbatim from staging, hrefs rewritten
├── chatb2b.html                # mirrored verbatim from staging, hrefs rewritten
├── pages/
│   ├── os.html                 # InterceptOS module + Agents module, deployed header/footer shell
│   ├── labs.html                # Labs module, deployed header/footer shell
│   ├── work.html                # Work module + its own casePanel/scrim, deployed header/footer shell
│   └── contact.html             # Convert module + FAQs module + convoDrawer/scrim, deployed header/footer shell
└── assets/
    ├── css/deployed.css         # staging's full <style> content, near-verbatim (minus nothing — see rationale)
    ├── js/deployed.js           # staging's data objects + render/drawer/agent/case/fritz-bg logic (minus 2 blocks — see below)
    ├── js/hero-video.js         # NEW — adapted from concept-b/assets/js/video.js
    ├── js/cards.js              # NEW — wires card buttons to dialog.showModal(), no-JS <a> fallback
    ├── video/hero-light-loop.{webm,mp4}, hero-light-poster.jpg   # already present
    ├── img/case-hp-abx.png, case-intel-abm.png, case-sap-video.png  # RECOMMEND extracting from CASE_IMG base64 (see Pitfalls)
    └── podcast/chatb2b-trailer.mp4, chatb2b-trailer-poster.jpg  # copied for insights-hub.html/chatb2b.html
```

### Full Module Port Map

All line numbers below are 1-indexed lines in `~/Creative-Projects/intercept-website-staging/home.html` as it exists today (3,430 lines total). CSS is grouped because the stylesheet is NOT organized per-module — it is organized chronologically by revision round, and the same class is very often redefined 2–3 times at increasing line numbers as later feedback rounds landed (e.g. `.prob-chapter`, `.agent-card-v6`, `.case-v6`, `.prob-flow-head` are each defined at 2–3 separate points; the LAST one in file order wins). **This is why "port the whole stylesheet" is the recommendation, not "extract just this module's rules" — a partial extract that stops before the final revision block will silently render the pre-feedback version.**

| Module | Markup lines | Static or JS-rendered? | CSS dependency | JS dependency | Cross-module coupling |
|---|---|---|---|---|---|
| **Header/nav** | 2304–2327 | Static | `.topbar`/`.nav`/`.logo`/`.fritz-lockup-hover`/`.theme-toggle` (defined throughout the shared stylesheet, not isolable) | Logo hover-glitch IIFE (3335–3428, needs `#fritz-glitch-source` SVG at 2208–2303); theme-toggle IIFE (line 3334, optional) | Contact CTA (`#navContact`) is **JS-hijacked**: `navContactBtn.addEventListener('click', e=>{e.preventDefault(); openConvo(null,'Contact')})` (~3231) opens the global convo drawer instead of navigating — **must be removed/repointed to `contact.html` on concept-d's homepage** (see Pitfalls) |
| **SVG defs (logos, glyphs, lockup)** | 2140–2303 | n/a (defs) | n/a | Referenced via `<use href="#glyph-…">`/`#logo-…`/`#intercept-lockup` from header, footer, clients strip, agents module | The `#hero-glitch` filter (2140–2150) and `.hero__video*` CSS (2129–2138) belong ONLY to the deployed hero's own video queue — **do not port**, Concept D's hero is a different video system |
| **Hero (copy only)** | 2332–2346 | Static (kicker, h1, sub, one CTA) | `.hero`/`.hero-h1`/`.hero-sub`/`.hero-ctas`/`.btn*` | none for the copy itself | The `.hero__videos`/`.hero__video`/`.hero__scrim` markup (2333–2337) and its queue script (3291–3333) are the deployed page's OWN hero video system — **replace entirely** with Concept D's sourced video + `hero-video.js`; only the `<p class="kick">`/`<h1 class="hero-h1">`/`<p class="hero-sub">`/CTA text is ported |
| **Clients strip** | 2349–2378 | Static (10 real brand-mark `<svg>`s inline) | `.clients`/`.clients-lbl`/`.logos`/`.brand-link`/`.brand` | none | Shown inline per decisions, NOT a card |
| **Problems / "What we solve"** | 2380–2410 | Shell static, panel content **JS-rendered** | `.solve`/`.solve-nav`/`.solve-tab*`/`.solve-detail`/`.solve-panel`/`.solve-quote` etc. (the CURRENT rules are the "r8.1" block at 1951–2001 — earlier `.prob-chapter`/`.rr-section` rules for the SAME visual slot exist earlier in the file at 158–218 and 1506–1663 as superseded history; do not use those) | `PROBLEMS_RR` object + `buildSolve()`/`activateSolve()` (2802–2884) | None — self-contained once `#solveDetail` exists |
| **InterceptOS** | 2412–2430 | Shell static, flow content **JS-rendered** | `.prob-selector`/`.prob-tabs`/`.prob-tab`/`.prob-flow*` (base rules 1070–1239, keyline-tab override at 2003–2014, subgrid override at 2022–2034 — again, LATEST wins) | `PROBLEM_FLOWS` object + `renderFlow()` (2887–2961) | `renderFlow()`'s generated "bridge" link (`href="#agents"`) is an in-page anchor to the Agents section — **on concept-d, if InterceptOS and Agents are both on `pages/os.html`, this anchor works unmodified (same page); if InterceptOS is ever shown in a homepage modal alone, this link needs to point to the agents card/modal instead** |
| **Agents / Capabilities** | 2432–2477 | Shell + tabs static, grid + detail **JS-rendered** | `.agent-tabs`/`.agent-tab`/`.agents-grid-v6`/`.agent-card-v6`/`.agent-detail-*` (base 427–501, hover-animation additions 1241–1289, gradient-sweep + compact-card-detail rewrite 1740–1900) | `AGENTS` + `CAT_LABELS` + `renderAgents()`/`openAgent()`/`closeAgentDetail()` (2964–3140) | Agent detail's CTA (`#agentDetailContact`) calls `closeAgentDetail(); openConvo(...)` (~3236) → opens the **global** `#convoDrawer` — this module needs the convo drawer scaffold present wherever it's shown (see Pitfalls) |
| **Work / Proof** | 2479–2553 | Card grid teaser text is static; full case detail is **JS-rendered into a drawer** | `.cases-v6`/`.case-v6*` (base 503–599, visual-header rewrite 1291–1329, subgrid alignment 2047–2057) | `CASE_IMG` (3 base64 images, 3147–3149) + `CASES` object (3151–3166) + `openCase()` (3167–3180) | `[data-case]` buttons open the **global** `#casePanel` drawer (2715–2726) — this module needs that drawer scaffold present wherever it's shown |
| **Labs** | 2555–2573 | Fully static | `.labs*`/`.labs-lockup`/`.labs-intro`/`.labs-stats*` (base 601–667, purple-reduction rewrite 1331–1370, decluttered-ledger rewrite 2059–2085) | "Build with Labs" button (`data-open="pitchLabs"`) — generic `[data-open]` wiring (3108–3113) opens the **global** `#pitchLabs` drawer (2759–2781) | Needs pitch-drawer scaffold present wherever shown |
| **Insights / ChatB2B episodes** | 2575–2647 | Fully static (3 hardcoded episode tiles + one link to `insights-hub.html#episodes`) | `.insights-grid`/`.ep-tile*` (base 669–776, full-cover-thumbnail rewrite 2087–2110) | None — pure links, no drawer dependency | The `insights-hub.html#episodes` link at the bottom (line 2645) is a DIFFERENT destination than the nav's own "Insights" link — both are labeled "Insights" but one is this homepage module (3 episode teasers, modal-only) and the other is the full mirrored hub page (see Open Questions) |
| **FAQs** | 2649–2666 | Fully static, native `<details>` | `.faq`/`#faqs .faq:first-of-type` (779–787) | None (no JS at all — the JSON-LD FAQ schema at 2784–2798 duplicates this copy for SEO; optional to port, harmless if kept) | None |
| **Convert / Contact** | 2668–2681 | Shell static, drawer form is static markup (not JS-templated — the form itself is real HTML with real `<input>`/`<textarea>`) | `.convo-tile*` (1417–1494) plus `.drawer`/`.drawer-form` (789–911, shared with all 3 drawers) | `resetConvo()`/`openConvo()`/convoForm submit handler (3186–3238) | Opens the **global** `#convoDrawer` — same drawer the nav CTA, footer CTA, agent-detail CTA, and case-drawer CTA all also target |
| **Footer** | 2685–2707 | Static | `footer`/`.foot-grid`/`.foot-col*`/`.foot-bot` (995–1004, contrast tweak 1902–1903) | Footer logo reuses the hover-glitch IIFE; `#footContact` is **JS-hijacked** exactly like `#navContact` (~3233) — same fix needed | 3 links to pages that don't exist anywhere in the staging bundle: `ai-policy.html`, `privacy-policy.html`, `terms-of-service.html` (verified absent even in staging — pre-existing broken links, not a concept-d regression; leave as-is per "mirrored pages left as-is where non-trivial") |
| **Global drawer scaffold** | 2709–2781 (`#scrim`, `#casePanel`, `#convoDrawer`, `#pitchLabs`) | Static shells, filled by JS above | `.drawer-scrim`/`.drawer*`/`.case-hero`/`.form-success`/`.convo-context` (837–911, case-hero addition 2113–2117) | `openDrawer()`/`closeAll()`/`_openModal()`/`_closeModal()` focus-trap core (3060–3107) | **Every module above that has a "talk to us" CTA needs this scaffold present in the same document** — see Pitfalls for why this is harder than it looks once modules sit inside `<dialog>`s |
| **Fritz triangle-pattern canvas backgrounds** | 4 canvases: `#problems` (2381), `#agents` (2433), `#insights` (2576), `#convert` (2669) | n/a (decorative, `aria-hidden`) | `.fritz-bg`/`.has-bg` (2118–2122) | Self-contained canvas-pattern IIFE (3242–3290) — queries `canvas.fritz-bg` ONCE at script load | **Zero-dimension-when-hidden bug** — see Pitfalls |

### Card / Modal / Page composition map

The 8 homepage cards (COND-03) do not map 1:1 to the 4 standalone pages (COND-05) — some modules are modal-only, some pages bundle two modules, and "Insights" is used as a label for two different things:

| Home card (modal-only content) | Standalone page (nav destination) |
|---|---|
| Problems ("What we solve") | **None assigned by CONTEXT** — modal-only, no nav item points at it (flag this explicitly to the planner — see Open Questions) |
| InterceptOS | `pages/os.html` (InterceptOS + Agents together) |
| Agents / Capabilities | `pages/os.html` (same page as InterceptOS) |
| Work | `pages/work.html` |
| Labs | `pages/labs.html` |
| Insights (3 ChatB2B episode teasers, homepage module) | **Not this** — nav's "Insights" instead goes to the separately-mirrored `insights-hub.html` (a different, larger page). Do not conflate the two. |
| FAQs | `pages/contact.html` (bundled with Convert, per CONTEXT: "contact.html (convert + FAQs)") |
| Contact / Convert | `pages/contact.html` |
| *(not a card)* Clients | Inline strip on homepage only, no modal, no page |

### Porting strategy recommendation: single shared `deployed.css` / `deployed.js`

**Recommendation: port the full stylesheet and full (minus 2 blocks) script content verbatim into two shared files, referenced by every concept-d page. Do not attempt per-module CSS/JS extraction.**

Rationale, in order of weight:
1. **Cross-revision override risk.** As shown in the port map, at least 6 classes central to the ported modules (`.prob-chapter`→superseded by `.solve*`, `.agent-card-v6`, `.case-v6`, `.prob-flow-head`, `.labs*`, `.ep-tile*`) are defined 2–3 times at increasing line numbers, each redefinition a documented Jon-feedback round. A hand-picked "just the rules `.agent-card-v6` needs" extraction is exactly the kind of task where it's easy to grab the FIRST definition and miss the LAST (correct, currently-live) one. Porting the whole file in original order preserves the cascade exactly as authored.
2. **The stylesheet is already using CSS custom properties for theme (`--page`/`--surface`/`--fg`/etc.) scoped per-section** (`:root[data-theme="light"] #os, #convert{...}` at lines 65–81) — these section-scoped variable overrides are easy to miss if extracting rule-by-rule, but are load-bearing for the navy-band/light-module contrast the deployed page relies on.
3. **The JS data objects are the actual canonical copy** for 4 of 8 modules (see Summary) — copy-pasting the entire `<script>` blocks is the only way to guarantee verbatim fidelity for that copy, since it can't be verified any other way (see COND-06 finding).

**What must be excluded from the port (2 script blocks + 1 head script + 1 CSS/markup pair), because they are specific to systems Concept D replaces or doesn't have:**
- Lines 9–18 (head): the mobile-device redirect (`location.replace('mobile.html?routed=1'+...)`) — **must not be ported**. `mobile.html` does not exist anywhere in this project; porting this verbatim would silently redirect any real-phone reviewer to a 404.
- Lines 2129–2138 (CSS) + 2140–2150 (SVG filter) + 2333–2337 (markup) + 3291–3333 (script): the deployed hero's own 3-clip video queue + RGB-glitch transition. Concept D's hero uses a different, already-sourced video and Concept B's simpler `video.js` idiom — this entire system is dead weight if ported.
- The 3 CASE_IMG base64 strings (3147–3149, ~1.85M characters / ~1.4MB decoded) — **recommend extracting to real files** (`assets/img/case-hp-abx.png` etc.) and changing `CASE_IMG` to store paths instead of data URIs. This is a byte-identical image, zero visible/behavioral change, and avoids a ~1.4MB inline-script bloat on every concept-d page that includes `deployed.js`. This is the one place "near-verbatim, not byte-verbatim" is the right call — flag it to Jon as a deliberate, harmless deviation if strict verbatim-JS is preferred instead.

**Layout rules that must be neutralized for modal use (additive override only — do not edit the ported file):**
- `section{padding:90px 0;border-bottom:1px solid var(--line);scroll-margin-top:72px;}` (line 153) assumes the section is one of many in a continuously scrolling page. Inside a bounded `<dialog>` this is merely generous, not broken — recommend a small additive rule in concept-d's OWN new CSS (e.g. `dialog.module-modal section{padding:32px 0 8px}`), scoped so it never touches `deployed.css` itself, keeping the "only the container changes" rule intact.
- `scroll-margin-top`/`html{scroll-behavior:smooth}` are both inert (harmless no-ops) once a section lives inside a `<dialog>` instead of the page flow — no action needed, just don't be surprised they do nothing there.
- The 4 `has-bg` sections' Fritz canvas backgrounds need the re-measure fix described in Pitfalls, which is a JS concern, not a CSS one.

### Header/Nav + Footer port

**Header (2304–2327), verbatim structure to port:**
```html
<header class="topbar">
  <div class="row">
    <a class="fritz-lockup-hover" href="#main" ...><svg class="logo" ...>...</svg></a>
    <nav class="nav" aria-label="Primary">
      <a href="#os">InterceptOS</a>
      <a href="#labs">Intercept Labs</a>
      <a href="#work">Work</a> <a href="about.html">About</a>
      <a href="insights-hub.html">Insights</a>
      <button class="theme-toggle" ...>...</button>
      <a class="cta-nav" href="#convert" id="navContact">Contact</a>
    </nav>
  </div>
</header>
```
Per COND-05, the four in-page-anchor hrefs (`#os`, `#labs`, `#work`, `#convert`) must be rewritten to point at the standalone pages on every concept-d page EXCEPT nowhere does the deployed page keep them as anchors — concept-d has no single continuously-scrolling page anymore. **Concrete rewrite, identical on every concept-d page's header/footer:**

| Deployed href | Concept-d target (from root-level pages) | Concept-d target (from `pages/*.html`) |
|---|---|---|
| `#os` | `pages/os.html` | `os.html` |
| `#labs` | `pages/labs.html` | `labs.html` |
| `#work` | `pages/work.html` | `work.html` |
| `#convert` (nav CTA + footer Contact) | `pages/contact.html` — **and the JS click-hijack (`navContactBtn`/`footContactBtn` → `openConvo()`) must be deleted**, letting it be a plain navigation link | `contact.html` — same JS-hijack removal |
| `about.html` | `about.html` (unchanged) | `../about.html` |
| `insights-hub.html` | `insights-hub.html` (unchanged) | `../insights-hub.html` |
| `chatb2b.html` (footer only) | `chatb2b.html` (unchanged) | `../chatb2b.html` |
| logo → `#main` | `index.html` (or `#main` only on `index.html` itself) | `../index.html` |

**Mobile menu:** there isn't one. At `max-width:900px` the deployed CSS simply hides every nav link except the Contact CTA (`@media(max-width:900px){.nav a:not(.cta-nav){display:none;}}`, line 112) — there is no hamburger/drawer to port. This is a real, if minimal, mobile nav gap in the deployed source itself (not a concept-d regression) — worth a one-line note in the plan since Jon may notice it during review, but it's out of scope to fix (that's the deployed site's own behavior, faithfully preserved).

**Logo treatment:** the animated lockup-hover-glitch (data-fritz-hover-lockup, driven by the IIFE at 3335–3428 reading `#fritz-glitch-source`, 2208–2303) fires once automatically 500ms after load (`dispatchEvent(new Event("mouseenter"))`, line ~3423) so every visitor sees it animate once even without hovering — this is intentional deployed behavior, port it as-is for both header and footer logo instances.

**Footer (2685–2707):** structurally identical rewrite needs, plus the 3 dead legal links noted above (pre-existing, leave as-is).

### Mirrored pages: about.html, insights-hub.html, chatb2b.html

All three are independently self-contained (each has its own single `<style>` + 2–3 `<script>` blocks, not shared with `home.html`) — confirmed by direct inspection: 701/1097/919 lines respectively, no external stylesheet/script references between them beyond Google Fonts.

**External references enumerated per file (`grep -o 'href="[^"]*"\|src="[^"]*"'`, deduplicated):**
- **Common to all three:** Google Fonts preconnect/stylesheet (external, no action needed); social links (LinkedIn/YouTube/Spotify/Apple Podcasts, external); the `#intercept-lockup` SVG symbol (each file defines its OWN local copy of this symbol — confirmed `grep -c 'id="intercept-lockup"'` returns exactly 1 in each of the 4 files, so no cross-file symbol dependency).
- **`about.html`-specific:** links to 4 LinkedIn profile pages (leadership bios, external); no local image/video assets referenced (the `.podcast-trailer` CSS class exists in its `<style>` block but is unused dead CSS — harmless).
- **`insights-hub.html`-specific:** `assets/podcast/chatb2b-trailer.mp4` + `chatb2b-trailer-poster.jpg` (must be copied into `concept-d/assets/podcast/`); links to 6 individual insights-article pages (`insights-h1-2026-trends-brief.html`, `insights-signals-*.html` ×3, `insights-the-*.html` ×2) — **per Deferred Ideas, these are explicitly OUT OF SCOPE to mirror; leave these hrefs as-is, they will 404 in concept-d, and note this in the plan** (matches CONTEXT's "otherwise left as-is and noted").
- **`chatb2b.html`-specific:** same `assets/podcast/chatb2b-trailer.*` pair; links to the same set of individual episode pages via Spotify/Apple/YouTube (all external, fine).

**`home.html` reference count and exact rewrite map** (verified via `grep -o 'href="home\.html[^"]*"'` across all 3 files — identical pattern set in each):
| Pattern | Count per file (about/chatb2b/insights-hub) | Rewrite to |
|---|---|---|
| `href="home.html"` | 1/1/1 | `index.html` |
| `href="home.html#convert"` | 4/3/2 | `pages/contact.html` |
| `href="home.html#labs"` | 2/2/2 | `pages/labs.html` |
| `href="home.html#os"` | 2/2/2 | `pages/os.html` |
| `href="home.html#work"` | 3/2/2 | `pages/work.html` |

This is a small, closed, purely-mechanical set (5 patterns × 3 files = 15 total substitutions) — a single scripted find/replace pass is sufficient and safe; it touches only `href` attribute values, never visible text, so it cannot violate copy-immutability or trip the copy-diff gate (hrefs are not extracted as "visible text" by the parser).

**Placement recommendation:** keep `about.html`, `insights-hub.html`, `chatb2b.html` at the `concept-d/` ROOT (siblings of `index.html`), not inside `pages/` — this keeps their existing bare-filename cross-links to each other (`about.html`↔`insights-hub.html`↔`chatb2b.html`) correct with zero edits, and only the 5 `home.html*` patterns above need rewriting.

### Modal feasibility check per module

Every module was checked for document-level-scope assumptions (global `querySelector`/`getElementById`, listeners attached once at parse time, size-dependent JS) that could break inside a `<dialog>`:

| Module | Feasible in a `<dialog>` as-is? | Notes |
|---|---|---|
| Problems (`.solve`) | Yes | `buildSolve()`/`activateSolve()` only touch `#solveDetail`/`.solve-tab` — no size dependency, no global drawer dependency |
| InterceptOS (`.prob-selector`) | Yes | Same shape as Problems; `renderFlow()`'s `#agents` bridge link only matters if Agents isn't reachable from the same page (see port map note) |
| Agents | **Needs the convo drawer present in the same document** | `agent-detail-overlay` (the "grid-morph" detail card) is ALREADY an in-section overlay (not the global drawer) — it works fine nested inside a dialog since it's `position:absolute` within `.agents-stage` (which is `position:relative`). But its CTA button opens the GLOBAL `#convoDrawer` — that drawer must be reachable from wherever this module's dialog lives (see top-layer issue below) |
| Work (`.cases-v6`) | **Needs the case-study drawer (`#casePanel`) + scrim present in the same document** | Same top-layer issue as Agents, for `#casePanel` instead |
| Labs | **Needs the pitch drawer (`#pitchLabs`) + scrim present in the same document** | Same top-layer issue, for `#pitchLabs` |
| Insights (episode tiles) | Yes, fully static, no drawer dependency | Simplest module to port |
| FAQs | Yes | Native `<details>`, zero JS |
| Convert | **Needs `#convoDrawer` + scrim present in the same document** | Its own primary interaction IS opening the global convo drawer |

**The `#convo`/`#casePanel`/`#pitchLabs` "drawer" scaffolding is already effectively a modal system in the deployed page — but it is NOT built on native `<dialog>`.** It's a hand-rolled `position:fixed` slide-in panel + a separate `.drawer-scrim` overlay, with its own hand-rolled focus-trap (`_openModal()`/`_closeModal()`/the Tab-key interceptor at 3080–3087, functionally equivalent to what native `<dialog>` gives for free — this is a "don't hand-roll it again" opportunity if these drawers get converted to `<dialog>`, but CONTEXT says "port intact," so the recommendation is to KEEP this hand-rolled system exactly as it is, not replace it — see Don't Hand-Roll section for the nuance).

**Verified technical risk — native `<dialog>` top-layer vs. `position:fixed` drawers:** Per Chrome for Developers' own documentation on the CSS top layer (see Sources): elements promoted to the top layer (which is exactly what `<dialog>.showModal()` does) render above the entire normal stacking context "needn't worry about z-index or DOM hierarchy... z-index has no effect in the top layer." Because the deployed drawer scaffold (`#scrim`, `#casePanel`, `#convoDrawer`, `#pitchLabs`) are plain `position:fixed` elements OUTSIDE any dialog (siblings at the end of `<body>` in the source), if they stay siblings of a homepage `<dialog id="workModal">` and the user clicks a case card inside that dialog, `openDrawer('casePanel')` will slide `#casePanel` in — but it will render **underneath** the open dialog's own top-layer content, appearing to do nothing. **Fix: on the homepage specifically (where modules sit inside dialogs), nest a copy of the specific drawer(s) each module's dialog needs INSIDE that dialog's own markup** (e.g., `<dialog id="workModal">` contains its own local `#casePanel`+scrim; `<dialog id="agentsModal">` and `<dialog id="convertModal">` each contain their own local `#convoDrawer`+scrim). This is small, well-scoped, mechanical markup duplication — NOT needed at all on the 4 standalone pages (`pages/*.html`), where there is no enclosing dialog and the original global-scaffold pattern works completely unmodified.

**Verified technical risk — canvas zero-dimension-when-hidden:** the fritz-bg IIFE (3242–3290) sizes each canvas via `cv.clientWidth`/`clientHeight` once, either at script load or on a debounced `window.resize` listener (150ms, line 3288) — there is no re-measure hook tied to a `<dialog>` opening. A closed `<dialog>` renders `display:none` per the UA stylesheet, so any canvas inside it reads `0×0` at measurement time and `it.frame()` bails silently (`if(!it.W||!it.H)return;`, in the `it.frame` function) forever — the triangle-pattern background for Problems/Agents/Insights/Convert will simply never appear once ported into a closed-by-default dialog. **Fix: in the card→modal open handler (`cards.js`), after `dialog.showModal()`, dispatch a synthetic resize** (`window.dispatchEvent(new Event('resize'))`) or call a small exposed re-measure function — either is sufficient since the existing IIFE already listens for exactly this.

### Video-over-light-UI legibility

The deployed light theme (`:root[data-theme="light"]`, lines 44–53) sets `--page: #ffffff` AND `--surface`/`--surface-2`/`--surface-3` all to the SAME flat white — meaning the deployed page relies entirely on 1px hairline borders (`var(--line)` = `rgba(10,10,15,.14)`) for section/card separation, not background contrast, because it assumes a plain white page behind everything. **This has zero effect on the ported MODULE content** — because each module will live inside its own `<dialog>` with its own opaque backdrop (native `<dialog>` gets a `::backdrop` for free, and the dialog box itself renders as a normal opaque element once the modal shell gives it a background), so a module's internal white-on-white card system looks exactly as it does on the live site once inside the modal "room."

**It only matters for the NEW card field** sitting directly on top of the video (COND-03) — since this is genuinely new chrome (not ported), it needs real elevation to read over moving footage: recommend an opaque or near-opaque light surface (not the deployed page's flat-white-on-white pattern) with either a soft shadow or a subtle backdrop-blur, distinct enough from the video that Fritz's "no invented decorative marks" rule isn't triggered by treating this as branding — it's functional legibility chrome, same category as Concept B's hotspot-label treatment. This is explicitly Claude's discretion per CONTEXT ("Card field layout/geometry over the video") — the only firm constraint is: real `<button>`s, verbatim eyebrow + one verbatim teaser line, legible over a moving light video.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| Modal focus trap / Esc / focus-return for the NEW card→module reveal | A custom keydown/Tab interceptor | Native `<dialog>.showModal()` (gives focus-move, Tab-trap, Esc-close, and `inert` outside for free) + Concept B's `panels.js` idiom for the one manual piece (focus-return via a `close` event listener) | Concept B already built and proved this exact pattern (see Code Examples) — zero reason to re-derive it |
| Ambient hero video autoplay/pause/reduced-motion/iOS-rejection handling | New video-control logic | Concept B's `assets/js/video.js`, adapted (selector rename only) | Already handles WCAG 2.2.2 (never auto-resume over an explicit user pause), battery (visibilitychange + IntersectionObserver pause), and iOS `play()` rejection without a broken state |
| The existing slide-in drawer system (case/convo/pitch) | Rebuilding it as native `<dialog>`s to "fix" the top-layer issue | Keep it exactly as deployed; only fix the STACKING problem by nesting scaffold copies inside each home-page module dialog that needs them | CONTEXT explicitly locks "do not restyle the modules; only their container changes" — converting the drawers to `<dialog>` would be a real behavior change (they'd gain native focus-trap/backdrop, lose their custom slide transition target etc.), a bigger surgery than the nesting workaround |
| A JS re-implementation of the FAQ accordion | — | Ported `<details>/<summary>` (native, zero JS already) | Nothing to hand-roll — this is the one module needing no JS port at all |
| Per-canvas resize-on-modal-open logic from scratch | A new observer system | A single `window.dispatchEvent(new Event('resize'))` call in `cards.js`'s open handler, reusing the ported fritz-bg IIFE's EXISTING resize listener | The ported code already has the exact hook needed; it just needs to be triggered once more, at modal-open time |

**Key insight:** almost everything this phase needs already exists, built and (mostly) proven, either in the staging bundle itself or in Concept B's `assets/js/`. The actual net-new code for this phase is small: a hero-video adapter, a card→dialog wiring script, and the handful of small dialog-nesting/href-rewrite mechanical edits documented above.

## Common Pitfalls

### Pitfall 1: Porting the mobile-redirect script
**What goes wrong:** A real-phone reviewer opening concept-d's homepage gets redirected to `mobile.html?routed=1`, which doesn't exist in this project → 404, or (worse, silent) a blank page depending on the static server's 404 handling.
**Why it happens:** Lines 9–18 of the staging head are copy-pasted along with everything else "to be safe/verbatim."
**How to avoid:** Explicitly exclude this script when assembling `index.html`'s `<head>`. It's the ONE piece of the deployed head that must never be ported.
**Warning signs:** Testing only on desktop Chrome during development will never catch this — it only manifests on an actual phone or a coarse-pointer emulated device.

### Pitfall 2: Cherry-picking CSS per module
**What goes wrong:** A module renders using a pre-feedback, superseded visual (e.g., Agents section without the gradient-sweep hover, or Work cards without the subgrid alignment fix).
**Why it happens:** The stylesheet is chronological-by-revision, not organized by module — the SAME class is redefined at multiple, widely-separated line numbers, and a manual "extract what X needs" pass is likely to grab an early definition and miss a later override 800+ lines further down.
**How to avoid:** Port the entire `<style>` content (all ~7 blocks, lines 25–2122) verbatim, in original order, into one `deployed.css`. Never assemble a module's CSS by selecting individual rule blocks out of file order.
**Warning signs:** A visual diff against a fresh capture of the live/staging page showing a module looking "almost right, but from an earlier iteration."

### Pitfall 3: copy-diff's blind spot on JS-templated modules
**What goes wrong:** `qa/copy-diff.py` reports a clean PASS on concept-d's homepage/pages even though the bulk of Problems/InterceptOS/Agents/Work-detail copy was never actually checked, because that copy exists only inside `<script>` string literals and the gate explicitly excludes script content from "visible text."
**Why it happens:** Confirmed empirically — running `python3 qa/copy-diff.py --mode substring` against the staging `home.html` ITSELF (not even a port, the actual canonical source) returns **42 chunks checked, 0 failures** — but `content/homepage.json` contains **155 long-form (≥40 char) canonical leaves** for this same content. The other 113 (mostly under `problems.items[]`, `os.flows[].stages[]`, `agents.items[]`, `work.cases[].{challenge,approach,results}`) are simply never detected, because they only exist inside the `PROBLEMS_RR`/`PROBLEM_FLOWS`/`AGENTS`/`CASES` JS objects — confirmed directly in `content/SOURCE.md`, which documents that these three sections "carry almost none of their real copy in static markup." This is also a direct, acknowledged exception to the project's own binding rule in `shared/README.md` ("Canonical copy must live as literal HTML text nodes in the page markup... JS-injected copy is invisible to it and will fail review") — that rule was written for Concepts A/B/C, which hand-authored static copy; Concept D is structurally different because it ports the deployed page's own JS-templating verbatim, per this phase's locked CONTEXT.
**How to avoid:** Do not treat "copy-diff exits 0" as proof that Problems/InterceptOS/Agents/Work-detail copy is verbatim. The actual verbatim guarantee for those specific chunks comes from copy-PASTING the `PROBLEMS_RR`/`PROBLEM_FLOWS`/`AGENTS`/`CASES` `<script>` blocks unedited — recommend the plan include an explicit mechanical verification step (e.g., `diff` the ported `<script>` block's text against the corresponding lines of staging `home.html`) as a stand-in for what copy-diff cannot see. Document this exception explicitly in the plan so it isn't mistaken for an oversight during Phase 6's QA-02 pass.
**Warning signs:** None visible in the gate output itself — this is a silent gap, which is exactly why it needs to be documented rather than discovered later.

### Pitfall 4: Native `<dialog>` top-layer vs. `position:fixed` drawers
**What goes wrong:** Clicking "Talk to us about this agent →" (or a case card, or "Build with Labs") from inside a homepage module dialog appears to do nothing — the drawer slides in but renders invisibly underneath the open dialog.
**Why it happens:** Verified via Chrome for Developers' documentation (see Sources): elements in the browser's "top layer" (which is exactly what `<dialog>.showModal()` promotes to) ignore z-index entirely and always render above the normal stacking context; the deployed drawer scaffold is plain `position:fixed` siblings at the end of `<body>`, outside any dialog, so it stays in the normal stacking context.
**How to avoid:** On the homepage ONLY, nest a local copy of whichever drawer(s) a module's dialog needs directly inside that dialog's own markup (Work needs its own `#casePanel`+scrim; Agents and Convert each need their own `#convoDrawer`+scrim; Labs needs its own `#pitchLabs`+scrim). The 4 standalone pages need no such duplication — they have no enclosing dialog.
**Warning signs:** A drawer's slide-in transition visibly starts (briefly seen at the very edge, or via a flash) but the drawer itself is not interactable/visible — this is the tell that it rendered behind the dialog's top-layer content.

### Pitfall 5: Canvas measured while hidden inside a closed dialog
**What goes wrong:** The Fritz triangle-pattern background canvases on Problems/Agents/Insights/Convert never render, even after the modal opens.
**Why it happens:** The fritz-bg IIFE measures `clientWidth`/`clientHeight` once (at script load, and again only on `window.resize`); a closed `<dialog>` is `display:none` per the UA stylesheet, so the canvas reads 0×0 at measurement time and its frame-draw function bails permanently.
**How to avoid:** Dispatch a synthetic `resize` event (or call an exposed re-measure hook) immediately after `dialog.showModal()` in the new `cards.js`.
**Warning signs:** The canvas element exists in devtools with the correct classes/data-attributes but a 0×0 (or stale) `width`/`height` attribute, and the background is visibly blank even though the rest of the module renders correctly.

### Pitfall 6: Nav/footer "Contact" links are JS-hijacked in the source
**What goes wrong:** Concept-d's homepage nav "Contact" link, ported verbatim including its JS wiring, opens the global convo drawer instead of navigating to `contact.html` as COND-05 requires.
**Why it happens:** The deployed source explicitly does this on purpose (`navContactBtn.addEventListener('click', e=>{e.preventDefault(); openConvo(null,'Contact')})`, ~line 3231, same pattern for `#footContact`) — appropriate for a single continuously-scrolling page, wrong for concept-d's multi-page nav model.
**How to avoid:** When porting `deployed.js`, drop (or feature-flag off) the `navContactBtn`/`footContactBtn` click-hijack listeners specifically on `index.html`; leave the CTA as a plain `<a href="pages/contact.html">`. The standalone pages can keep or drop this listener without consequence since it's a self-navigation no-op there.
**Warning signs:** Clicking "Contact" in concept-d's own header opens a drawer over the video/card field instead of navigating — easy to miss in a quick click-through since it "does something," just not the COND-05-required something.

## Code Examples

### Reusable modal open/close pattern (adapt directly — Concept B, `panels.js`)
```javascript
// Source: concept-b/assets/js/panels.js (already proven in this repo)
var lastInvoker = null;
function openDialog(dialog, invoker) {
  if (!dialog) return;
  lastInvoker = invoker || lastInvoker;
  dialog.showModal();           // free: focus-move, Tab-trap, Esc-close, inert-outside
}
// on the dialog's native 'close' event (fires for both Esc and a close button):
dialog.addEventListener("close", function () {
  if (lastInvoker) lastInvoker.focus();   // the ONE manual piece: focus-return
});
```
For Concept D's card field, `cards.js` should follow this exact shape: each card button is the `invoker`, its `data-modal-target` resolves to one of the 8 (or fewer, per the card/page map above) module `<dialog>` ids.

### Reusable ambient video control (adapt directly — Concept B, `video.js`)
```javascript
// Source: concept-b/assets/js/video.js (already proven; rename .hero-stage__video / .video-toggle / .hero-stage selectors for concept-d's own markup)
if (prefersReducedMotion) { video.pause(); setToggleState(false); }  // reduced-motion → static poster
document.addEventListener("visibilitychange", function () {          // battery guard
  if (document.hidden) video.pause(); else if (!userPaused) attemptPlay(false);
});
if (heroStage && "IntersectionObserver" in window) { /* pause when scrolled out of view */ }
```

### The re-measure fix for canvas-in-dialog (new, small addition to `cards.js`)
```javascript
// After opening a module dialog that contains a canvas.fritz-bg element:
dialog.showModal();
window.dispatchEvent(new Event('resize'));   // triggers the ported fritz-bg IIFE's existing resize handler (home.html line ~3288)
```

### The deployed drawer-open pattern (port verbatim into `deployed.js` — home.html 3089–3113)
```javascript
// Source: ~/Creative-Projects/intercept-website-staging/home.html, lines 3089-3113
function openDrawer(id){
  document.querySelectorAll('.drawer.open').forEach(d => d.classList.remove('open'));
  const el = document.getElementById(id);
  if(!el) return;
  el.classList.add('open');
  scrim.classList.add('open');
  document.body.style.overflow = 'hidden';
  _openModal(el);
}
```
Note `scrim` here is resolved once via `document.getElementById('scrim')` at script top — if a module dialog nests its own local `#scrim` copy (per Pitfall 4's fix), each nested copy needs its own `id` (e.g. `#scrimWork`, `#scrimAgents`) and the corresponding `openDrawer`/`closeAll` calls inside that module's local script scope must reference the matching local scrim — a small, mechanical adaptation of the otherwise-verbatim drawer logic per nested instance.

## State of the Art

Not particularly applicable here — the entire task is porting an existing, already-live implementation rather than adopting a new library or pattern. The one relevant "current vs. legacy" distinction:

| Older approach | Current approach (already used in this repo) | Impact for this phase |
|---|---|---|
| Hand-rolled overlay + manual `inert`/focus-trap polyfill | Native `<dialog>` + `.showModal()` (broad browser support as of 2026; Concept B already ships it) | Confirms the card→module reveal should use native `<dialog>`, NOT a rebuild of the deployed page's own hand-rolled drawer pattern, even though the drawer pattern must be preserved unmodified for the modules that already use it internally |

## Open Questions

1. **Does "Problems" get a standalone page at all?**
   - What we know: CONTEXT's page list is explicit — `os.html` (InterceptOS + agents), `labs.html`, `work.html`, `contact.html` (convert + FAQs). "Problems" ("What we solve") is not named.
   - What's unclear: Whether this is an intentional omission (Problems is modal-only, reachable from the card field but not the nav, which matches "nav: InterceptOS · Intercept Labs · Work · About · Insights · Contact" having no "Problems"/"What we solve" item) or a gap to fill.
   - Recommendation: Treat as intentional (matches the nav list exactly) — Problems is a card→modal-only module with no derived page, unless Jon says otherwise during plan-check.

2. **Is the copy-diff gate's blind spot on JS-templated modules acceptable as a permanent, documented exception, or does it need new tooling (e.g., a Puppeteer-rendered-DOM variant of the gate) built in this phase?**
   - What we know: Puppeteer + a headless-Chrome capture rig is already an established project dependency (used for QA screenshots per CONTEXT's code_context). A rendered-DOM copy-diff variant (render the page, execute JS, extract `document.body.innerText`, run the existing homepage.json leaf-substring check against that) would close the gap completely and is buildable with existing tools.
   - What's unclear: Whether this phase's scope includes building that tooling, or whether the mechanical-diff-of-the-ported-script-block compensating control (documented above) is sufficient for this phase, with the tooling improvement deferred.
   - Recommendation: Default to the mechanical-diff compensating control for Phase 5 (cheaper, deterministic, no new tooling risk) and flag the Puppeteer-rendered gate as a good candidate for Phase 6 (cross-concept QA) if Jon wants stronger automated proof before final review.

3. **Should the theme toggle (dark/light) be kept, given Concept D is committed to light-mode-only per CONTEXT?**
   - What we know: The deployed header includes a working light/dark toggle; CONTEXT says "Light mode: the deployed site IS light — port its light tokens/styles as-is" but doesn't explicitly forbid keeping the toggle.
   - What's unclear: Whether keeping a functioning dark-mode toggle makes sense for a video-hero reveal explicitly designed around a LIGHT positive video (switching to dark would leave the hero video's light footage looking mismatched against a suddenly-dark module modal, though the modal's own content would simply re-theme correctly since it's just CSS custom properties).
   - Recommendation: Keep the toggle button in the ported header markup (verbatim, per COND-01), but this is genuinely low-stakes either way — Claude's Discretion already covers "how much of staging's inline JS ports wholesale vs scoped per-module," and the toggle's own script (line 3334) is a 1-line addition with no interaction with anything else.

## Sources

### Primary (HIGH confidence)
- `~/Creative-Projects/intercept-website-staging/home.html` (3,430 lines) — read in full via line-ranged reads; all line numbers cited above verified directly against this file, current as of 2026-07-24
- `~/Creative-Projects/intercept-website-staging/about.html`, `insights-hub.html`, `chatb2b.html` — read for external/internal reference enumeration (`grep -o 'href="[^"]*"\|src="[^"]*"'`)
- `.planning/phases/05-concept-d-home-variant/05-CONTEXT.md` — locked decisions, quoted verbatim above
- `.planning/REQUIREMENTS.md` — COND-01..07 exact wording
- `concept-d/assets/video/ASSETS.md` — video provenance
- `qa/README.md` and a live run of `python3 qa/copy-diff.py --mode substring ~/Creative-Projects/intercept-website-staging/home.html` (42 PASS, 0 FAIL, verified by direct execution in this session)
- `content/homepage.json` + `content/SOURCE.md` — canonical leaf count (435 total, 155 long-form) and the explicit documented note that Problems/InterceptOS/Agents/Work-detail copy "carries almost none of their real copy in static markup"
- `shared/README.md` — the project-wide binding copy rule that JS-injected copy "will fail review," cross-referenced against Concept D's CONTEXT to surface the documented tension
- `concept-b/assets/js/panels.js`, `video.js`, `reveal.js` — read in full; the exact reusable idioms cited in Code Examples
- Existing `concept-a`/`concept-b`/`concept-c` directory structure (`index.html` + `pages/` + `assets/`) — used to derive concept-d's recommended file layout

### Secondary (MEDIUM confidence)
- [Meet the top layer: a solution to z-index:10000 — Chrome for Developers](https://developer.chrome.com/blog/what-is-the-top-layer) — verified via WebSearch, official Google/Chrome documentation, directly supports the top-layer-vs-z-index finding in Pitfall 4. Not cross-checked against a second independent source, hence MEDIUM rather than HIGH, though this is well-established, standard CSS spec behavior.

### Tertiary (LOW confidence)
None — every finding in this document is either a direct read of project files, a live command run in this session, or a single authoritative external source. Nothing here rests on unverified training-data recall alone.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries; every API cited is already proven working in this exact repo (Concept B) or is native browser behavior
- Architecture / port map: HIGH — every line range, class name, and JS function cited was read directly from the source file in this session, not recalled from training
- Modal-stacking pitfall (top-layer vs. fixed drawers): MEDIUM — logically sound and backed by one official source, but not independently re-tested by rendering concept-d's actual nested markup (that verification belongs in the implementation/verification phase, not research)
- Copy-diff blind-spot finding: HIGH — empirically reproduced in this session (42/155 chunks, 0 failures) against the live source file, not just inferred

**Research date:** 2026-07-24
**Valid until:** Effectively as long as the staging bundle at `~/Creative-Projects/intercept-website-staging/` and this repo's `concept-b/assets/js/` remain unchanged — both are local, Jon-controlled files with no external-vendor drift risk. Re-verify line numbers if either source file is edited before this phase is planned/implemented.
