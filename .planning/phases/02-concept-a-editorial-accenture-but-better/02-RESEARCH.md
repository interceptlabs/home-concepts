# Phase 2: Concept A — Editorial ("Accenture, but better") - Research

**Researched:** 2026-07-23
**Domain:** Static-HTML editorial marketing homepage (Accenture-style dark editorial canvas) + 3 derived sub-pages; View Transitions, fluid type, scroll reveal; content data-shape mapping and copy-diff annotation mechanics
**Confidence:** HIGH (data shapes, copy-diff mechanics, Fritz rules — read directly from source files); MEDIUM-HIGH (View Transitions / text-wrap browser support — WebSearch-verified against multiple 2026 sources, one correction to project's own STACK.md found)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Page structure (Accenture-mapped to Intercept's verbatim sections, in order)**
1. **Header**: sticky, minimal — lockup left, curated nav (Problems · InterceptOS · Work · Labs · Insights) + one CTA button (convert). NO mega-menu, no search theater.
2. **Hero**: oversized editorial display type using verbatim `hero.h1_html` ("We turn your most ambitious briefs into proven outcomes.") with `hero.kicker` as eyebrow and `hero.sub` as the right-rail/below intro (Accenture's hero layout pattern from reference/accenture/screenshot-*-0.jpg: giant type left, short intro right). ONE primary CTA (`hero.cta.label` "Explore more"). NO rotating hero.
3. **Card grid** (Accenture's announcement/report card row, done better): insights episodes + labs as cards, each with its verbatim eyebrow as the card kicker (Accenture's "RESEARCH REPORT" label pattern) and a distinct CTA label per content type.
4. **Statement moment** (Accenture's "360° VALUE" analog): `problems.h2` "We love a chewy problem." as an oversized centered statement with `problems.lead`, followed by the 4 problem tabs as compact editorial entries.
5. **InterceptOS band**: `os` section + the 13 `agents` as a capability chip/grid moment (this is Intercept's genuinely differentiated content — give it real estate).
6. **Work showcase**: 3 case studies with specific outcomes surfaced up front (Accenture's case carousel minus auto-rotation — stacked or user-stepped, never timed).
7. **Client trust strip**: 12 client logos from `clients`.
8. **Convert**: `convert.h2` "Give us a chewy problem. Let's solve it together." + form CTA. This is the page's terminal action.
9. **Footer**: from `footer` key, restrained.

**"Better than Accenture" moves (locked — these ARE the brief)**
- Concrete outcome headline instead of abstract tagline (our verbatim copy already does this — do not dilute it)
- ONE visually primary CTA per section; distinct verbatim CTA labels per content type (never a generic "Expand" everywhere)
- Curated 5-item nav vs 19×19 mega-menu
- Case studies with named clients/outcomes visible without interaction
- Static (fast, no framework) — Accenture's slow module soup is part of what "better" means
- No timed carousels anywhere

**Visual language**
- Dark editorial canvas (`--page` dark `#0a0a0f` per shared tokens) — matches Accenture's confidence, differentiates from the live light Variant A
- Flarepop `#ff00e5` is the ONLY colored text (em words in hero + the lockup dot are the natural Flarepop moments)
- Card/section backgrounds: solid fields or 3-9 hard-edged equal-step fields (Fritz "no gradients" rule) — Accenture's purple gradient cards become Fritz stepped fields
- Triangles apex-up only if patterning is used; the mark is NEVER decoration; NO decorative rule lines (space/weight/alignment for separation)
- Imagery: v1 is graphics-first (stepped fields, keyline motifs, oversized type) — NO photography required; if any photographic moment is added it must be real-stock files already present in `concept-a/assets/img/` (never AI slop, never invented marks). Absence of photos satisfies CONA-06.
- Typography from shared/fonts.css only

**Motion (CONA-05)**
- Scroll-reveal of sections via IntersectionObserver + CSS transitions (sine ease-in-out, long durations 600-900ms, small translate distances) with `prefers-reduced-motion` disabling all of it
- Kinetic type accent: hero display lines stagger-reveal on load; ONE hover accent on cards (weight/color shift on kicker) — sparing, nothing gratuitous
- Cross-document View Transitions API for card → sub-page navigation (`@view-transition { navigation: auto; }`), graceful no-op in browsers without support

**Sub-pages (CONA-04, QA-03)**
- Ship 3: `interceptos`, `work`, `insights` (the content-richest topics per content/subpages.json)
- Located at `concept-a/pages/{topic}.html`, styled in Concept A's own editorial language, copy strictly from subpages.json refs
- Every sub-page has persistent header nav + a clear way back to the concept homepage (no orphaning)

**Copy discipline**
- Every rendered text node comes from content/homepage.json / subpages.json refs — annotate elements with `data-copy="dot.path"` per shared/README.md convention so `qa/copy-diff.py` verifies mechanically
- Run `python3 qa/copy-diff.py concept-a/index.html concept-a/pages/*.html` as a task verify step — must exit 0

### Claude's Discretion
- Exact grid columns/breakpoints, type scale ratios, chip vs list treatment for agents
- Which stepped-field color sequences to use per section (within token palette)
- How the work showcase steps between cases (buttons/tabs) as long as it's user-initiated

### Deferred Ideas (OUT OF SCOPE)
- Photographic editorial moments (real-stock, duotone-treated) as a polish pass if Jon wants them after review
- Kinetic type on scroll for section headings beyond the hero (keep v1 sparing)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-------------------|
| CONA-01 | Single strong hero statement, ONE primary CTA, no rotating hero, no abstract tagline | `hero.*` data shape below; fluid-type Code Example; `hero.cta.href="#problems"` is a same-page anchor — give the statement-moment section `id="problems"` |
| CONA-02 | Editorial card grid, oversized type, one visually primary CTA per section with distinct content-specific labels | Card→Subpage Routing Map below resolves which cards get which CTA/destination; CSS Grid pattern in Code Examples |
| CONA-03 | Trust-signal block executed with restraint, specific over vague | `clients` data shape (12 logos, no per-logo copy beyond name strings) + `work.cases[].metric` (concrete numbers) already satisfy "specific over vague" — no invention needed |
| CONA-04 | Clicking a card routes to derived sub-page (cross-document View Transitions, graceful degradation) | View Transitions section (browser support corrected from project STACK.md), Card→Subpage Routing Map (resolves Labs/Insights ambiguity), Code Examples |
| CONA-05 | Kinetic typography accents on scroll/hover, sparing, sine ease-in-out | IntersectionObserver reveal pattern + `shared/motion.css` tokens (`--ease-inout-sine`, `--dur-med`/`--dur-long`) in Code Examples |
| CONA-06 | Imagery real-stock or ComfyUI-generated, no AI slop | Satisfied by CONTEXT's locked "graphics-first, no photography required" decision — absence of photos is compliant; if added later, must come from `concept-a/assets/img/` real-stock files only |
</phase_requirements>

## Summary

Concept A is a fully static, no-build HTML/CSS/JS page consuming only `content/homepage.json`, `content/subpages.json`, and `shared/`. The hard technical work isn't framework selection (there is none) — it's three things: (1) correctly wiring 10 homepage.json sections into the exact locked page structure with per-leaf `data-copy` annotations that will pass `qa/copy-diff.py` on the first try, (2) making "oversized editorial type" survive real, variable-length verbatim copy at mobile widths without overflow, and (3) resolving a routing ambiguity the CONTEXT decisions don't fully spell out — not every homepage section that reads as a "card" has a derived sub-page in this phase (Labs and the individual Insights episodes do not), so CONA-04's "clicking a card routes to its derived sub-page" needs a concrete per-section map, provided below, so the planner doesn't have to invent one mid-build.

Every homepage.json field the page will render is enumerated below with exact dot-paths, so task specs can cite paths directly instead of re-deriving them from the JSON. The View Transitions API is the one area where fresh WebSearch corrected the project's own `.planning/research/STACK.md`: cross-document view transitions remain Chromium + Safari 18.2+ only in 2026 — Firefox 144 shipped *same-document* transitions, not cross-document, contradicting STACK.md's claim of "Firefox 144+" for cross-document support. Treat Firefox as graceful-degradation-only (plain navigation, no morph) for the whole phase.

**Primary recommendation:** Build the page as literal, hand-authored HTML with inline `data-copy` attributes matching JSON dot-paths one-for-one (including every array index — `problems.items.0.tells.0`, not `problems.items.0.tells`), ship the `@view-transition { navigation: auto; }` opt-in with no per-element `view-transition-name` morphing in v1 (Safari's main-thread scaling jank makes matched-element morphs a Discretion-tier polish item, not a v1 requirement), use `clamp()`-based fluid type tested against the actual verbatim hero string (not placeholder text) at 320-375px viewports, and resolve card→subpage routing per the map below before writing any task's verify block.

## Content Data Shapes (per homepage.json section)

Concept A renders 9 of `content/homepage.json`'s 11 top-level keys (`faqs` is excluded — see Card→Subpage Routing Map). All dot-paths below resolve to **string leaves** unless noted; `qa/copy-diff.py` requires `data-copy` to point at a string leaf exactly — pointing it at an array or object path is a hard FAIL ("unresolvable path or non-string leaf").

### `hero` — Header/Hero (page structure #2)
| Path | Type | Notes |
|------|------|-------|
| `hero.kicker` | string | Eyebrow: "Award-winning B2B marketing for global tech" |
| `hero.h1_html` | string, HTML markup | Contains 2× `<em>` (wraps "ambitious", "proven") + `<span class="dot">.</span>`. Copy-diff strips tags on both sides for `_html`-suffixed paths — only visible words must match, so the em/span markup itself is free-form as long as the visible text and word order match. |
| `hero.sub` | string | Intro paragraph, ~50 words |
| `hero.cta.label` | string | "Explore more" |
| `hero.cta.href` | string, NOT copy-diffed | `"#problems"` in canonical JSON — hrefs are never checked by copy-diff (only rendered text is). Give the statement-moment section `id="problems"` to keep this a working in-page anchor, or repoint freely. |

### `clients` — Trust strip (page structure #7)
| Path | Type | Notes |
|------|------|-------|
| `clients.label` | string | "You're in good company" |
| `clients.logos.0` … `clients.logos.11` | 12× string | Plain client names (Microsoft, SAP, HP, Lenovo, Cisco, AMD, Qualcomm, Logitech, Nokia, TELUS, Staples, BMC). No logo image assets exist in content — render as wordmarks/text, not image files, unless real SVG logo assets are separately sourced (out of scope signal: no such assets are referenced anywhere in `shared/` or `content/`). |

### `problems` — Statement moment + 4 tabs (page structure #4)
| Path | Type | Notes |
|------|------|-------|
| `problems.eyebrow`, `problems.h2`, `problems.lead` | string | Section eyebrow/heading/lead |
| `problems.items` | array of 4 objects | Each item: `key`, `tabEyebrow`, `tabName` (teaser, shown on homepage per subpages.json) — plus `num`, `name`, `quote`, `attrib`, `tells` (array of 3 strings), `signalNum`, `signalLbl`, `bridge` (full-depth copy, per subpages.json's `full_refs` — **but no `problems` sub-page ships this phase**, so this full-depth copy has nowhere to go except displayed inline on the homepage itself when a tab is active/expanded). |
| `problems.items.N.tells.0/1/2` | 3× string each | Must be annotated per-index — `tells` itself is an array, not a string leaf |
| `problems.items.3.signalNum` | string, **empty `""`** | Item 4 ("Activation Problem") has no signal number, only `signalLbl`. Do not fabricate a placeholder number or a "0%" — render conditionally (omit the stat-number element for this one tab) or the rendered text will be empty and copy-diff will pass trivially but the layout must not show a broken "%" with nothing before it. |

**Routing note:** `problems` has a subpages.json topic entry (teaser/full split identical to the pattern above) but is **not** in CONTEXT's "Ship 3" list (`interceptos`, `work`, `insights`). The 4 problem tabs are therefore an **in-page progressive-disclosure interaction** (click a tab → reveal quote/tells/signal/bridge inline, e.g. via `<details>` or a JS tab panel), not a page-navigation target. No View Transition applies here.

### `os` + `agents` — InterceptOS band (page structure #5)
| Path | Type | Notes |
|------|------|-------|
| `os.eyebrow`, `os.h2`, `os.lead` | string | Section framing |
| `os.flows` | array of 4 objects | Each: `key`, `tabLabel` (teaser, shown on homepage), `job`, `layer`, `stages` (array of 4 objects, **full depth — lives on the `interceptos` sub-page**, not homepage) |
| `os.flows.N.stages.M` | object | `tag`, `name`, `agents` (array of 0-3 strings), `desc` — all string leaves need individual index paths on the sub-page (e.g. `os.flows.0.stages.0.agents.0`) |
| `agents.eyebrow`, `agents.h2`, `agents.lead` | string | Section framing |
| `agents.categories.0..3` | 4× string | "Strategy", "Content & Creative", "Sales Enablement", "Channel Empowerment" |
| `agents.items` | array of **13** objects | Each: `key`, `name`, `type`, `role`, `primary`, `cats` (array), `desc`, `solves` (array of 1-2 strings), `sample` — full depth per agent lives on the `interceptos` sub-page; homepage teaser per subpages.json shows only the category shells (`agents.eyebrow/h2/lead`), not individual agent cards, unless CONTEXT's "capability chip/grid" decision means the homepage itself lists all 13 (CONTEXT text explicitly says "the 13 agents as a capability chip/grid moment... give it real estate" — so the homepage DOES render all 13, at minimum `name` + `role` or `type` per chip; the deeper `desc`/`solves`/`sample` fields are `interceptos` sub-page-only depth per subpages.json). |

**Confirm before planning tasks:** the homepage renders all 13 agent chips (name + short role), while `desc`/`solves`/`sample` per agent are reserved for the `interceptos` sub-page — this reconciles CONTEXT's "give it real estate" instruction with subpages.json's teaser/full split without contradicting either document.

### `work` — Work showcase (page structure #6)
| Path | Type | Notes |
|------|------|-------|
| `work.eyebrow`, `work.h2`, `work.lead` | string | Section framing |
| `work.cases` | array of **3** objects | Each: `key`, `client`, `tag`, `name`, `summary`, `metric` (object: `num`, `label` — both string leaves, index separately), `challenge`, `approach`, `results` (array of 3-4 strings), `agents` (**single string**, e.g. `"Atom"` or `"Atom · Camille (multi-agent program)"` — NOT an array) |
| `work.cases.N.results.0..3` | 3-4× string each | Per-index annotation required |

Homepage card per case shows: `client`, `tag`, `name`, `summary`, `metric.num`, `metric.label` (teaser_refs). Full depth (`challenge`, `approach`, `results`, `agents`) lives exclusively on 3 dedicated case pages (see Card→Subpage Routing Map — **`work` is 3 physical files, not 1**).

### `labs` — Card grid entry (page structure #3)
| Path | Type | Notes |
|------|------|-------|
| `labs.label` | string | "Intercept Labs" |
| `labs.h2_html` | string, HTML markup | Contains `<span class="hl">has no playbook.</span>` — same tag-stripped comparison rule as `hero.h1_html` |
| `labs.body` | string | Body copy |
| `labs.cta.label` | string | "Build with Labs" |
| `labs.cta.href` | string, NOT copy-diffed | Canonical `"#pitchLabs"` (an original-site modal drawer that doesn't exist here) — free to repoint |
| `labs.stat.num`, `labs.stat.label` | string | "Up to 50%" / "Project co-investment" |

**No `labs` sub-page ships this phase** (subpages.json marks `labs` `teaser_only` with zero deeper copy available — `fabrication_note` explicitly forbids inventing more). The Labs card in the card grid is copy-complete as a card; it has no derived page to route to.

### `insights` — Card grid entries (page structure #3)
| Path | Type | Notes |
|------|------|-------|
| `insights.eyebrow`, `insights.h2`, `insights.lead` | string | Section framing |
| `insights.episodes` | array of **3** objects | Each: `episode`, `show`, `title`, `guest` (object: `name`, `role`), `summary`, `links` (array of 3 objects: `label`, `href` — hrefs are external Spotify/Apple/YouTube URLs, not copy-diffed), `tile_href` (string, NOT copy-diffed — external Spotify URL matching the original homepage's own card-click behavior, per `STATE.md`'s locked Phase 01 decision to keep per-episode external links) |

**Routing nuance:** each episode card's own click target (`tile_href`) is an **external** Spotify link per the frozen content and prior project decision — it is not expected to route to the `insights` sub-page via View Transition. The `insights` sub-page (which does ship this phase) is reached via the section-level heading/eyebrow or a distinct "browse insights" affordance, not via the individual episode cards themselves. See Card→Subpage Routing Map.

### `convert` — Terminal CTA (page structure #8)
| Path | Type | Notes |
|------|------|-------|
| `convert.eyebrow`, `convert.h2`, `convert.lead` | string | Section framing |
| `convert.cta.heading`, `convert.cta.sub` | string | "Open the form." / "Take two minutes..." |
| `convert.cta.href` | string, NOT copy-diffed | Canonical `"#convoDrawer"` — a modal form that doesn't exist in this static prototype (CMS/backend integration is explicitly out of scope project-wide). Recommend: repoint to a static on-page anchor or `mailto:` — building a working form is not a CONA requirement and would violate the "static prototypes only" constraint. |

### `footer` — Footer (page structure #9)
| Path | Type | Notes |
|------|------|-------|
| `footer.tagline` | string | "Powered by curiosity." |
| `footer.site_links.0..4` | 5× string | InterceptOS, Intercept Labs, Work, Insights, Contact |
| `footer.trust_links.0..2` | 3× string | AI Policy, Privacy Policy, Terms of Service |
| `footer.social_links.0..2` | 3× string | LinkedIn, YouTube, Spotify · ChatB2B |

**Not used by Concept A this phase:** `faqs` (11 Q&A items) — only referenced by subpages.json's `contact` topic, which is not in the Ship-3 list. Do not build a FAQ section or a contact sub-page in Phase 2.

## Card → Subpage Routing Map (resolves CONA-04 ambiguity)

CONTEXT locks "clicking a card routes to its derived sub-page," but only 3 sub-page topics ship this phase, and one of those (`work`) is **3 separate physical pages, not 1**. This table is the concrete resolution the planner should build tasks against:

| Homepage element | Routes to (this phase) | Mechanism |
|---|---|---|
| Work case card 1 (`work.cases.0`, HP) | `concept-a/pages/work-hp-abx.html` | Cross-document View Transition |
| Work case card 2 (`work.cases.1`, Intel) | `concept-a/pages/work-intel-abm.html` | Cross-document View Transition |
| Work case card 3 (`work.cases.2`, SAP) | `concept-a/pages/work-sap-video.html` | Cross-document View Transition |
| InterceptOS band (section heading/CTA area, or an agent chip) | `concept-a/pages/interceptos.html` | Cross-document View Transition |
| Insights section heading/eyebrow (NOT individual episode cards) | `concept-a/pages/insights.html` | Cross-document View Transition |
| Individual insight episode card (any of the 3) | External Spotify/Apple/YouTube (`links[].href` / `tile_href`) | Plain external link, matches original site + `STATE.md` locked decision — no View Transition (cross-origin navigations never undergo a view transition per spec) |
| Labs card | No derived page this phase — `labs.cta.href` stays a same-page anchor/no-op, or points at the card itself | None — Labs is `teaser_only` with zero deeper copy to build a page from |
| Problems statement moment (4 tabs) | Stays on `index.html`, in-page reveal only | `<details>`/JS tab toggle, not navigation — no `problems` sub-page ships this phase |
| Header nav "Work" | `index.html#work` (in-page anchor to the Work showcase section) | Plain anchor — there is no single work-index page; each case routes individually from its own card |
| Header nav "Problems" | `index.html#problems` | Plain anchor (matches `hero.cta.href` target already) |
| Header nav "InterceptOS" / "Insights" | `pages/interceptos.html` / `pages/insights.html` | Cross-document View Transition |
| Header nav "Labs" | `index.html#labs` (in-page anchor to the card) | Plain anchor |

**Net file count for `concept-a/pages/`:** 5 HTML files (`interceptos.html`, `insights.html`, `work-hp-abx.html`, `work-intel-abm.html`, `work-sap-video.html`) — exceeds QA-03's "2-3 working derived sub-pages" floor.

## Reference Captures (reference/accenture/)

9 files exist: `screenshot-1784829229499-0.jpg` through `screenshot-1784829229504-8.jpg` (indices 0-8, undifferentiated filenames — no per-section naming). This research agent cannot view images; the planner/executor should open them directly and cross-reference against the anatomy already documented in `.planning/research/FEATURES.md`'s "Accenture Homepage Anatomy" section (fetched live from accenture.com/ca-en, HIGH confidence): sticky nav+mega-menu → announcement carousel hero → 360°-Value statement → case carousel → toggle-able awards → careers module → news carousel → app promo → heavy-legal footer. Index 0 is very likely the top-of-page hero per CONTEXT's own reference (`screenshot-*-0.jpg` cited directly as the hero layout reference), with ascending indices moving down the page.

## Standard Stack

No new dependencies beyond what `.planning/research/STACK.md` already recommends project-wide. Concept A specifically needs only:

### Core
| Technology | Version | Purpose | Why Standard |
|---|---|---|---|
| Hand-authored HTML5 + CSS3 (custom properties from `shared/tokens.css`) | native | All structure/styling | No-build constraint; Fritz tokens already define the palette/type/motion this concept must use verbatim |
| `clamp()`-based fluid type | native CSS | Hero + statement-moment "oversized" headlines | Fixed px/rem sizes copied from the Accenture desktop screenshots is the #1 named pitfall (Pitfall 9, `.planning/research/PITFALLS.md`) — must scale, not just look big on desktop |
| `IntersectionObserver` | native, universal support since ~2019 | Section scroll-reveal (CONA-05) | Zero-dependency, matches CONTEXT's locked mechanism exactly |
| Cross-document View Transitions API (`@view-transition { navigation: auto; }`) | native, Chrome/Edge 126+, Safari 18.2+ | Card → sub-page navigation (CONA-04) | CONTEXT-locked mechanism; verified current in 2026 (see State of the Art correction below) |
| `text-wrap: balance` / `text-wrap: pretty` | native CSS, see support table below | Heading line-wrap quality on the oversized statement moment and card headlines | Progressive enhancement — unsupported browsers fall back to normal wrapping with zero breakage; directly mitigates Pitfall 9's "card grids break with real variable-length copy" |

### Supporting
| Technology | Version | Purpose | When to Use |
|---|---|---|---|
| GSAP + SplitText (from project STACK.md, free since the Webflow/GreenSock acquisition) | 3.15.x, CDN | Hero display-line stagger-reveal on load | Only if plain CSS `animation-delay` staggering across `<span>`-wrapped words proves insufficient — CONTEXT's ask ("hero display lines stagger-reveal on load") is achievable with zero dependencies by wrapping each line in its own element and CSS-animating with staggered `animation-delay`; reach for GSAP only if that feels janky in practice |
| `<details>`/`<summary>` or minimal JS tabs | native | Problems section's 4-tab progressive disclosure | Native `<details>` gives free keyboard/AT support; use plain JS only if a true single-open-at-a-time tab behavior (not independently-collapsible accordion) is wanted |

### Alternatives Considered
| Instead of | Could use | Tradeoff |
|---|---|---|
| Named-element View Transition morphing (`view-transition-name` matching card thumbnail → page hero) | Simple document-level cross-fade (no per-element naming) | Safari does view-transition scaling on the main thread and visibly stutters when old/new element sizes or aspect ratios differ (verified via WebSearch, css-tricks/2026 sources) — recommend shipping the zero-config cross-fade for v1 and treating matched-element morphing as a Claude's-Discretion polish item, not a base requirement |
| GSAP ScrollTrigger for section reveals | Plain IntersectionObserver + CSS transitions | CONTEXT already locks IO as the mechanism; GSAP is unnecessary weight for straightforward fade/slide-in reveals |
| Lenis smooth-scroll | Native scroll | Not requested in CONTEXT; adds a dependency for a subjective feel improvement not called for in the locked decisions |

**Installation:** No new packages. If GSAP is used for the hero stagger (optional escalation), add via CDN per `.planning/research/STACK.md`'s existing installation block — no other concept touches GSAP, so it must not leak into a shared `shared/` file if used, to keep Concept A self-contained per the architecture rule.

## Architecture Patterns

### Recommended file structure
```
concept-a/
├── index.html                       # full homepage, all 9 sections per locked page structure
├── assets/
│   ├── css/                         # concept-a-only stylesheet(s), consuming shared/tokens.css etc.
│   └── js/                          # scroll-reveal + tab-toggle + (optional) hero stagger script
└── pages/
    ├── interceptos.html
    ├── insights.html
    ├── work-hp-abx.html
    ├── work-intel-abm.html
    └── work-sap-video.html
```

### Pattern 1: Per-array-index `data-copy` annotation
**What:** Every string inside a JSON array (`tells`, `results`, `logos`, `categories`, `links`, etc.) needs its own `data-copy` with the full index path — never point at the array itself.
**When to use:** Any list rendered from homepage.json/subpages.json.
**Example:**
```html
<!-- WRONG — "tells" is an array, not a string leaf; copy-diff FAILs as "unresolvable path" -->
<ul data-copy="problems.items.0.tells">...</ul>

<!-- RIGHT — one data-copy per <li>, one per array index -->
<ul>
  <li data-copy="problems.items.0.tells.0">Traditional research is too slow and too expensive for the pace we move at.</li>
  <li data-copy="problems.items.0.tells.1">The findings come back telling us what we already knew.</li>
  <li data-copy="problems.items.0.tells.2">We can never be sure we're not hearing from the same panel of people again.</li>
</ul>
```

### Pattern 2: `_html`-suffixed fields keep real markup, only visible text is locked
**What:** `hero.h1_html` and `labs.h2_html` carry inline `<em>`/`<span>` markup in the canonical JSON. `qa/copy-diff.py` strips tags from both the canonical value and the rendered element before comparing — so the rendered element's exact tag structure is free, but the visible words (in order) must match exactly.
**Example:**
```html
<!-- Source: content/homepage.json hero.h1_html -->
<h1 data-copy="hero.h1_html">
  We turn your most <em class="flarepop">ambitious</em> briefs into <em class="flarepop">proven</em> outcomes<span class="dot">.</span>
</h1>
```
The `class="flarepop"` attributes are free additions (copy-diff only reads text nodes); Flarepop is the only permitted colored text per `shared/README.md`, so this is exactly where it belongs — on the two `<em>` words, matching CONTEXT's "em words in hero... are the natural Flarepop moments."

### Pattern 3: Truncated teasers require `data-copy-truncated="true"` and a real prefix
**What:** Where a homepage card teases a string that's fuller elsewhere (e.g. `work.cases.N.summary` shown in full on the card per subpages.json's teaser_refs — note `summary` is NOT truncated in this dataset, it's shown in full as a teaser). If any section chooses to truncate a longer field for card display, the rendered text (minus a trailing `…`) must be an exact prefix of the canonical string, cut at a non-alphanumeric boundary.
**When to use:** Only if a task deliberately shortens a long field for card layout — check subpages.json's `teaser_refs` vs `full_refs` split first; most homepage-vs-subpage depth differences in this dataset are **field selection** (show fewer fields), not **string truncation** (cut a string short). Truncation is the exception, not the default.

### Pattern 4: Fluid type tested against real verbatim strings
**What:** `clamp(MIN, PREFERRED, MAX)` sized headings, verified specifically against the actual verbatim hero string (an 11-word full sentence with 2 emphasized words and a trailing period-span) at 320-375px viewport widths — not a placeholder/lorem string.
**When to use:** `hero.h1_html`, `problems.h2` (statement moment), and any card headline.
**Example:**
```css
.hero h1 {
  font-size: clamp(2.25rem, 1.4rem + 4.2vw, 5.5rem);
  line-height: 1.05;
  text-wrap: balance; /* or pretty — see State of the Art support table */
}
```
Because the hero string is a full sentence (not a 2-3 word Accenture-style fragment), "oversized" should read as dramatically larger than body/kicker text at every breakpoint, not as a fixed desktop pixel value — verify no horizontal overflow/clipping at 320px in the actual build, per Pitfall 9.

### Pattern 5: IntersectionObserver reveal with reduced-motion guard
**What:** Reveal sections/cards on scroll into view; fully no-op under `prefers-reduced-motion: reduce`.
**Example:**
```js
// Source: pattern verified against 2026 vanilla-JS scroll-reveal guides (see Sources)
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target); // reveal once, stop observing
      }
    }
  }, { threshold: 0.15 });

  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
} else {
  // No JS animation at all — elements must be visible by default via CSS,
  // not hidden-then-revealed, so reduced-motion users see content immediately.
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
}
```
```css
/* Source: shared/motion.css tokens */
[data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity var(--dur-long) var(--ease-inout-sine),
              transform var(--dur-long) var(--ease-inout-sine);
}
[data-reveal].is-visible { opacity: 1; transform: translateY(0); }
```

### Pattern 6: Cross-document View Transitions opt-in (zero JS)
**What:** Opt every concept-a page into the browser's native page-transition animation for same-origin navigations.
**Example:**
```css
/* Source: MDN @view-transition at-rule, verified current 2026 */
@view-transition {
  navigation: auto;
}
```
Place this in the shared concept-a stylesheet, included on `index.html` and all 5 `pages/*.html` files. Browsers without support (Firefox, as of this research) simply navigate normally — **no fallback code is needed or possible to write**; this is pure CSS progressive enhancement. Cross-document view transitions additionally require: same-origin navigation, and (for push/replace navigation types) the navigation must be user-initiated, not programmatic/browser-UI-initiated — a plain `<a href="pages/work-hp-abx.html">` click satisfies this trivially.

### Anti-Patterns to Avoid
- **Fixed px hero type copied from a desktop screenshot:** breaks/overflows on mobile with the real (longer than a typical Accenture fragment) verbatim sentence — use `clamp()`, test at 320px with the actual string.
- **Pointing `data-copy` at an array or object path** (`problems.items.0.tells`, `work.cases.0.metric`): always resolves to a hard FAIL in `qa/copy-diff.py` — index or key into the final string leaf.
- **Retyping copy instead of copy-pasting it:** canonical strings use curly quotes/apostrophes (`'`, `"`, `"`) and special characters (`×`, `→` where present, em dashes) — a straight-quote retype is an exact-match FAIL, not a warning.
- **Treating `href` values as copy-locked:** they are not checked by `qa/copy-diff.py` at all (only visible text is) — don't hesitate to repoint `#pitchLabs`/`#convoDrawer`/etc. to real, working targets.
- **Building a `problems` or `labs` or `contact` sub-page:** not in scope this phase (see Card → Subpage Routing Map) — building one anyway wastes effort and risks pulling in `faqs` copy that has no locked home in Concept A.
- **Named `view-transition-name` morphing as a v1 baseline:** Safari's known main-thread jank on mismatched-size elements makes this a discretionary polish item, not a base requirement — CONTEXT only locks the page-level `@view-transition` opt-in.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| Page-to-page transition animation | A JS page-transition library (Barba.js/Highway.js-style) or a custom fetch+DOM-swap "SPA-lite" router | Native `@view-transition { navigation: auto; }` | Zero JS, zero routing logic, graceful degradation is automatic — CONTEXT explicitly locks this as the mechanism |
| Scroll-triggered reveal animation | A custom scroll-position-polling loop, or a third-party library (AOS.js/ScrollReveal.js) | Native `IntersectionObserver` | Native API has been universally supported since ~2019; a dependency here adds nothing CONTEXT's locked mechanism doesn't already give for free |
| Balanced heading line-wraps | A JS text-balancing script (e.g. re-measuring and inserting `<br>` tags) | Native CSS `text-wrap: balance` / `text-wrap: pretty` | Progressive enhancement, literally free where supported, silently falls back elsewhere — no JS needed at all |
| Copy verbatim verification | A custom string-diff script per concept | The project's existing `qa/copy-diff.py` | Already built, already the project's mechanical gate — re-deriving it per concept is exactly the kind of drift Pitfall 11 warns about |
| Client "logo" trust strip | Sourcing/generating logo image files | Plain text/wordmark rendering of the 12 `clients.logos` strings | No logo image assets exist anywhere in `content/` or `shared/` for this phase — inventing image assets is out of scope and risks brand/trademark issues the project hasn't cleared |

**Key insight:** every "clever mechanism" this phase might reach for (page transitions, scroll reveal, text balancing) already has a zero-dependency native browser API that does the job, and CONTEXT has already locked those exact native mechanisms as the required approach — there is no legitimate reason to add a JS library for any of Concept A's motion/navigation behavior.

## Common Pitfalls

### Pitfall 1: Editorial imitation ships Accenture's mobile-overflow weakness, not just its confidence
**What goes wrong:** Hero/statement-moment type is sized to look "oversized" on the desktop reference screenshot, then overflows or wraps awkwardly on mobile once the actual (longer, full-sentence) verbatim copy is dropped in.
**Why it happens:** Type scale is chosen and reviewed against one desktop viewport with the headline already known; Accenture's own headlines are short fragments, Intercept's verbatim hero is a complete sentence with two emphasized words — a different shape entirely.
**How to avoid:** `clamp()`-based fluid type (Code Pattern 4 above), reviewed specifically at 320-375px with the real `hero.h1_html` string, not lorem ipsum.
**Warning signs:** Font sizes specified in fixed `rem`/`px`; the layout has only ever been opened at desktop width.
*(Source: `.planning/research/PITFALLS.md` Pitfall 9, MEDIUM-HIGH confidence)*

### Pitfall 2: `data-copy` pointed at a non-string path silently seems fine until the gate runs
**What goes wrong:** A builder annotates a `<ul>` or a card wrapper with `data-copy="work.cases.0.results"` (an array) or `data-copy="work.cases.0.metric"` (an object) instead of indexing into each string leaf — this is an immediate hard FAIL ("unresolvable path or non-string leaf"), not a partial-match warning.
**Why it happens:** It reads naturally to annotate "the whole results list" or "the whole metric" as one unit; the gate's actual contract requires one leaf per attribute.
**How to avoid:** Before annotating any array/object field, check `qa/copy-diff.py`'s `resolve_path()` contract: it walks dict keys and numeric list indices only, and returns FAIL unless the final node is a Python `str`. Annotate the deepest leaf, every time.
**Warning signs:** Any `data-copy` value that doesn't end in a plain field name or numeric index pointing at a JSON string.
*(Source: direct read of `qa/copy-diff.py`, HIGH confidence)*

### Pitfall 3: Curly quotes / special characters retyped as straight ASCII
**What goes wrong:** Canonical copy uses `'` `"` `"` `—` `×` throughout (e.g. `work.cases.1.metric.num = "$70M"`, `agents.items.2.sample` uses `—`, `problems.items.0.quote` uses curly apostrophes) — retyping instead of copy-pasting silently introduces straight-quote/hyphen substitutions that are exact-match FAILs.
**Why it happens:** Manual transcription of long paragraphs is error-prone even when the transcriber is trying to be verbatim; autocorrect/editor smart-quote settings can also silently "fix" characters the wrong direction.
**How to avoid:** Copy-paste directly from `content/homepage.json`/`content/subpages.json` into HTML, never retype by hand; run `qa/copy-diff.py` per section as it's built, not only at the end.
**Warning signs:** Any FAIL with a word-diff showing only a quote/dash character difference.
*(Source: direct read of `content/homepage.json`, HIGH confidence)*

### Pitfall 4: `problems.items.3.signalNum` is an empty string, not a missing field
**What goes wrong:** A stat-number UI component built for the other 3 problem tabs (which all have real percentages) breaks or shows a bare "%"/empty box for the 4th tab (Activation Problem), which has no signal number in the canonical data.
**Why it happens:** Building against the first 1-2 items in an array and assuming the shape is uniform across all 4.
**How to avoid:** Render the stat-number element conditionally (only if `signalNum` is non-empty); `signalLbl` alone still renders for tab 4.
**Warning signs:** A visible orphaned "%" or empty stat-box on the Activation Problem tab.
*(Source: direct read of `content/homepage.json`, HIGH confidence)*

### Pitfall 5: Building a page for a topic that isn't in the Ship-3 list
**What goes wrong:** Time spent building `pages/problems.html`, `pages/labs.html`, or `pages/contact.html` — all of which exist as topics in `content/subpages.json` but are explicitly excluded from CONTEXT's locked "Ship 3: interceptos, work, insights."
**Why it happens:** `subpages.json` lists 6 topics total; without cross-referencing CONTEXT's decision, it's natural to assume all 6 get pages.
**How to avoid:** Build exactly the 5 files in the Card → Subpage Routing Map above (interceptos, insights, and 3 work-case pages) — no more, no less.
**Warning signs:** A `pages/` directory with more than 5 files, or a `faqs`/`problems`/`labs` HTML file appearing anywhere.
*(Source: cross-reading CONTEXT.md decisions against `content/subpages.json`, HIGH confidence)*

### Pitfall 6: Assuming Firefox supports cross-document View Transitions in 2026
**What goes wrong:** Building or QA-ing under the assumption (present in this project's own `.planning/research/STACK.md`) that "Firefox added support at version 144" for cross-document view transitions — multiple independent 2026 sources (CSS-Tricks, Trade Assistance, TestMu AI) confirm Firefox 144 shipped **same-document** view transitions only; native cross-document transitions remain unshipped in Firefox as of this research, a candidate for Interop 2026 rather than a shipped feature.
**Why it happens:** Same-document and cross-document view transitions are easy to conflate — they share an API surface and a version number gets attached to "view transitions" generally without the same-vs-cross-document distinction being carried through.
**How to avoid:** Treat Firefox as **plain-navigation-only** for the card→subpage click-through (no morph, no cross-fade) — this requires zero extra code since `@view-transition { navigation: auto; }` degrades to a no-op automatically. Do not build or test expecting a Firefox transition effect.
**Warning signs:** A QA checklist item that says "verify the transition animates in Firefox" — it will not, and that's expected, not a bug.
*(Source: WebSearch cross-verified across 3 independent 2026 sources, MEDIUM-HIGH confidence — corrects project's own STACK.md)*

### Pitfall 7: Copy verbatim drift across the three parallel concepts
**What goes wrong:** Because Concepts A/B/C are built independently from the same source, small paraphrases or brand-token deviations creep in per-concept.
**How to avoid:** Copy-paste from the JSON, run `copy-diff.py` continuously (not just at phase end), never eyeball Fritz token values — always `var()` from `shared/tokens.css`.
*(Source: `.planning/research/PITFALLS.md` Pitfall 11, MEDIUM-HIGH confidence — cross-cutting, applies here too)*

## Code Examples

### Card grid — responsive collapse (mobile-first, not DOM-order-dependent)
```css
/* Source: pattern per .planning/research/PITFALLS.md Pitfall 9 recommendation */
.card-grid {
  display: grid;
  grid-template-columns: 1fr; /* mobile: single column, explicit */
  gap: var(--space-md, 1.5rem);
}
@media (min-width: 768px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1200px) {
  .card-grid { grid-template-columns: repeat(4, 1fr); } /* insights x3 + labs x1 */
}
```

### Stepped-field background (Fritz "no gradients" rule)
```css
/* 3-9 hard-edged equal steps, never a smooth grade — shared/README.md binding rule */
.section--stepped {
  background: repeating-linear-gradient(
    180deg,
    var(--surface-2) 0, var(--surface-2) 20%,
    var(--surface-3) 20%, var(--surface-3) 40%,
    var(--surface-2) 40%, var(--surface-2) 60%,
    var(--surface-3) 60%, var(--surface-3) 80%,
    var(--surface-2) 80%, var(--surface-2) 100%
  ); /* 5 hard steps, no interpolation between stops at identical offsets */
}
```

### Hero stagger-reveal on load (no library)
```css
/* Source: shared/motion.css tokens, applied per-line */
.hero h1 .line {
  display: block;
  opacity: 0;
  transform: translateY(0.4em);
  animation: line-in var(--dur-med) var(--ease-inout-sine) forwards;
}
.hero h1 .line:nth-child(1) { animation-delay: 0ms; }
.hero h1 .line:nth-child(2) { animation-delay: 120ms; }
@keyframes line-in {
  to { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .hero h1 .line { animation: none; opacity: 1; transform: none; }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|---|---|---|---|
| JS scroll-reveal libraries (AOS.js, ScrollReveal.js) | Native `IntersectionObserver` + CSS transitions | Widely since ~2019-2020 | Zero dependency, already CONTEXT's locked mechanism |
| JS text-balancing scripts | Native `text-wrap: balance` (Safari 17.5+/Firefox 121+/Chrome-Edge 130+) and `text-wrap: pretty` (Chrome/Edge 117+, Safari 26+, **not yet Firefox**) | 2024-2026 rollout | Free heading-wrap quality with automatic fallback to normal wrapping — directly helps oversized-headline + card-title layouts survive real copy lengths |
| Custom JS page-transition routers (Barba.js, Highway.js) | Native cross-document View Transitions (`@view-transition { navigation: auto; }`) | Chrome/Edge 126+ (mid-2025), Safari 18.2+ (late 2025) | CONTEXT's locked mechanism; **correction to this project's own STACK.md:** Firefox 144 shipped same-document transitions only — cross-document remains unshipped in Firefox as of this research (candidate for Interop 2026, not confirmed) |

**Deprecated/outdated:**
- Treating "Firefox 144+ supports cross-document view transitions" as fact (present in `.planning/research/STACK.md`) — superseded by the more precise mid-2026 finding above; update mental model to "Chromium + Safari only" for cross-document.

## Open Questions

1. **Does the InterceptOS band route to `interceptos.html` from a specific element, or from the whole section?**
   - What we know: CONTEXT says the band gets "real estate" for 13 agent chips; subpages.json confirms deep agent detail lives only on the sub-page.
   - What's unclear: whether every agent chip is individually clickable (13 View Transition targets, all landing on the same `interceptos.html`, perhaps scrolled/anchored to that agent) or whether there's one section-level "see how it works" affordance (echoing `os.lead`'s own sentence "See how it works" — note this phrase is literally in `os.lead`, so it could double as the visible link text without inventing new copy).
   - Recommendation: use the existing `os.lead` sentence fragment "See how it works" (already verbatim in the JSON) as the section's single CTA link text into `interceptos.html`, and make each of the 13 chips a plain non-navigating visual element (name + role only) on the homepage — simplest, fully verbatim, avoids 13 redundant identical-destination links.

2. **What does the `convert` section's form actually do, given no backend exists?**
   - What we know: `convert.cta.href` is `"#convoDrawer"` in canonical data (an original-site modal); "CMS/backend integration" is explicitly out of scope project-wide.
   - What's unclear: whether Concept A should render `convert.cta.heading`/`convert.cta.sub` as inert display text under a disabled-looking CTA, or link `mailto:` somewhere, or simply anchor to itself.
   - Recommendation: render the CTA as a real clickable element (satisfies "one visually primary CTA per section," CONA-02) pointing at a plain in-page anchor or `mailto:` placeholder — do not attempt to build a working form; this is consistent with "static prototypes only."

3. **Named-element View Transition morphing: v1 or deferred?**
   - What we know: CONTEXT locks the page-level `@view-transition { navigation: auto; }` opt-in only; it does not explicitly require matched-element (`view-transition-name`) morphing between a homepage card and its destination page's hero.
   - What's unclear: whether Jon expects to visually see a card "morph into" the page (more impressive, more Safari-risk) vs. a plain cross-fade (safer, zero extra work).
   - Recommendation: ship the zero-config cross-fade for v1 (satisfies CONA-04 literally and safely); note matched-element morphing as a Claude's-Discretion enhancement only if time allows and Safari jank is checked first-hand.

## Sources

### Primary (HIGH confidence)
- `content/homepage.json`, `content/subpages.json` — direct read, exact field shapes and array lengths
- `qa/copy-diff.py`, `qa/README.md` — direct read, exact gate mechanics (`resolve_path`, `_html` tag-stripping, truncation rule)
- `shared/README.md` — direct read, binding brand/copy rules
- `.planning/phases/02-concept-a-editorial-accenture-but-better/02-CONTEXT.md` — locked decisions
- `.planning/REQUIREMENTS.md`, `.planning/STATE.md` — requirement IDs, Phase 01 decisions (work = 3 pages, insights external links)
- [MDN: @view-transition CSS at-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition) — HIGH confidence, official spec docs
- [MDN: View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) — HIGH confidence

### Secondary (MEDIUM confidence, WebSearch cross-verified)
- [Trade Assistance LLC: Cross-Document View Transitions Are Finally Cross-Browser — A Practical Guide for 2026](https://trade-assistance.com/blog/cross-document-view-transitions-mpa-2026/) — Firefox cross-document status
- [CSS-Tricks: Cross-Document View Transitions — The Gotchas Nobody Mentions](https://css-tricks.com/cross-document-view-transitions-part-1/) — Safari main-thread scaling jank on mismatched element sizes; Firefox same-doc-only 144
- [TestMu AI: View Transitions API Browser Support](https://www.testmuai.com/learning-hub/view-transitions-api-browser-support/) — cross-document support matrix
- [Savvy: CSS text-wrap Property — pretty and balance Explained](https://savvy.co.il/en/blog/css/css-text-wrap-pretty-balance/) — balance/pretty support versions
- [MDN: text-wrap CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap) — official support notes
- `.planning/research/STACK.md`, `.planning/research/PITFALLS.md`, `.planning/research/FEATURES.md` — project-level research, cross-referenced (one correction identified re: Firefox cross-document VT support, flagged above)

### Tertiary (LOW confidence — none used; all View Transition / text-wrap claims above were cross-verified against 2+ independent sources before inclusion)

## Metadata

**Confidence breakdown:**
- Content data shapes / copy-diff mechanics: HIGH — read directly from source JSON and the gate's own source code, not inferred
- Card→subpage routing map: HIGH reasoning from locked CONTEXT + subpages.json + STATE.md, though genuinely underspecified by CONTEXT itself (flagged as Open Questions with recommendations, not asserted as the only valid answer)
- Standard stack / architecture patterns: HIGH — native browser APIs already locked by CONTEXT, versions verified via WebSearch
- View Transitions Firefox support: MEDIUM-HIGH — WebSearch only (no Context7 entry for a browser platform feature), but cross-verified across 3 independent 2026 sources and directly contradicts a claim in this project's own prior research, which is exactly the kind of correction worth flagging rather than silently repeating
- Pitfalls: HIGH for data-shape/gate-mechanic pitfalls (direct source read); MEDIUM-HIGH for the editorial-imitation/mobile-type pitfall (carried from project's own prior PITFALLS.md research, itself WebSearch-sourced)

**Research date:** 2026-07-23
**Valid until:** 30 days for the content-shape/gate-mechanic findings (stable, tied to frozen JSON files); 7-14 days for the View Transitions/text-wrap browser-support claims (fast-moving web-platform area, Firefox cross-document support is explicitly in flux for 2026)
