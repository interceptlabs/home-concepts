# Phase 2: Concept A — Editorial ("Accenture, but better") - Context

**Gathered:** 2026-07-23 (auto mode — decisions resolved from Jon's brief, the live Accenture captures in reference/accenture/, features research, and Fritz canon)
**Status:** Ready for planning

<domain>
## Phase Boundary

Concept A homepage + its derived sub-pages, working locally at `/concept-a/`. Accenture's structural confidence (dark editorial canvas, oversized type, card-driven content, work-led storytelling) executed better with the Fritz brand system. Consumes ONLY `content/` + `shared/` from Phase 1. Requirements CONA-01..06.

</domain>

<decisions>
## Implementation Decisions

### Page structure (Accenture-mapped to Intercept's verbatim sections, in order)
1. **Header**: sticky, minimal — lockup left, curated nav (Problems · InterceptOS · Work · Labs · Insights) + one CTA button (convert). NO mega-menu, no search theater.
2. **Hero**: oversized editorial display type using verbatim `hero.h1_html` ("We turn your most ambitious briefs into proven outcomes.") with `hero.kicker` as eyebrow and `hero.sub` as the right-rail/below intro (Accenture's hero layout pattern from reference/accenture/screenshot-*-0.jpg: giant type left, short intro right). ONE primary CTA (`hero.cta.label` "Explore more"). NO rotating hero.
3. **Card grid** (Accenture's announcement/report card row, done better): insights episodes + labs as cards, each with its verbatim eyebrow as the card kicker (Accenture's "RESEARCH REPORT" label pattern) and a distinct CTA label per content type.
4. **Statement moment** (Accenture's "360° VALUE" analog): `problems.h2` "We love a chewy problem." as an oversized centered statement with `problems.lead`, followed by the 4 problem tabs as compact editorial entries.
5. **InterceptOS band**: `os` section + the 13 `agents` as a capability chip/grid moment (this is Intercept's genuinely differentiated content — give it real estate).
6. **Work showcase**: 3 case studies with specific outcomes surfaced up front (Accenture's case carousel minus auto-rotation — stacked or user-stepped, never timed).
7. **Client trust strip**: 12 client logos from `clients`.
8. **Convert**: `convert.h2` "Give us a chewy problem. Let's solve it together." + form CTA. This is the page's terminal action.
9. **Footer**: from `footer` key, restrained.

### "Better than Accenture" moves (locked — these ARE the brief)
- Concrete outcome headline instead of abstract tagline (our verbatim copy already does this — do not dilute it)
- ONE visually primary CTA per section; distinct verbatim CTA labels per content type (never a generic "Expand" everywhere)
- Curated 5-item nav vs 19×19 mega-menu
- Case studies with named clients/outcomes visible without interaction
- Static (fast, no framework) — Accenture's slow module soup is part of what "better" means
- No timed carousels anywhere

### Visual language
- Dark editorial canvas (`--page` dark `#0a0a0f` per shared tokens) — matches Accenture's confidence, differentiates from the live light Variant A
- Flarepop `#ff00e5` is the ONLY colored text (em words in hero + the lockup dot are the natural Flarepop moments)
- Card/section backgrounds: solid fields or 3-9 hard-edged equal-step fields (Fritz "no gradients" rule) — Accenture's purple gradient cards become Fritz stepped fields
- Triangles apex-up only if patterning is used; the mark is NEVER decoration; NO decorative rule lines (space/weight/alignment for separation)
- Imagery: v1 is graphics-first (stepped fields, keyline motifs, oversized type) — NO photography required; if any photographic moment is added it must be real-stock files already present in `concept-a/assets/img/` (never AI slop, never invented marks). Absence of photos satisfies CONA-06.
- Typography from shared/fonts.css only

### Motion (CONA-05)
- Scroll-reveal of sections via IntersectionObserver + CSS transitions (sine ease-in-out, long durations 600-900ms, small translate distances) with `prefers-reduced-motion` disabling all of it
- Kinetic type accent: hero display lines stagger-reveal on load; ONE hover accent on cards (weight/color shift on kicker) — sparing, nothing gratuitous
- Cross-document View Transitions API for card → sub-page navigation (`@view-transition { navigation: auto; }`), graceful no-op in browsers without support

### Sub-pages (CONA-04, QA-03)
- Ship 3: `interceptos`, `work`, `insights` (the content-richest topics per content/subpages.json)
- Located at `concept-a/pages/{topic}.html`, styled in Concept A's own editorial language, copy strictly from subpages.json refs
- Every sub-page has persistent header nav + a clear way back to the concept homepage (no orphaning)

### Copy discipline
- Every rendered text node comes from content/homepage.json / subpages.json refs — annotate elements with `data-copy="dot.path"` per shared/README.md convention so `qa/copy-diff.py` verifies mechanically
- Run `python3 qa/copy-diff.py concept-a/index.html concept-a/pages/*.html` as a task verify step — must exit 0

### Claude's Discretion
- Exact grid columns/breakpoints, type scale ratios, chip vs list treatment for agents
- Which stepped-field color sequences to use per section (within token palette)
- How the work showcase steps between cases (buttons/tabs) as long as it's user-initiated

</decisions>

<specifics>
## Specific Ideas

- Jon's brief: "One that mimics the accenture page, but better." — the reference captures live in `reference/accenture/*.jpg` (hero, card grid, quote block, 360° VALUE statement, case carousel, awards, footer). Mimic the structural rhythm and editorial confidence, not the buzzwords or the sludge.
- Features research names the specific Accenture weaknesses to beat: abstract tagline, generic "Expand" CTAs, mega-menu wall-of-text, undifferentiated CTA hierarchy. Beat them with the moves locked above.
- The whole project's core value: no walls of text — homepage sections are teasers; depth lives on the sub-pages.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `content/homepage.json` + `content/subpages.json` — ALL copy, frozen; dot-path refs
- `shared/tokens.css` (+ alias layer), `shared/fonts.css`, `shared/motion.css`, `shared/logo/lockup.svg` (canonical 8-path, static centered)
- `shared/README.md` — binding brand rules + data-copy convention
- `qa/copy-diff.py` — the mechanical verbatim gate (annotated mode via data-copy)
- `concept-a/index.html` placeholder + `concept-a/pages/`, `concept-a/assets/` dirs from Phase 1
- `reference/accenture/*.jpg` — 9 live captures of the reference site

### Established Patterns
- Self-contained static pages, no build step; serve via `./serve.sh` on :4340
- Gallery at repo root links to `/concept-a/` — keep that path working
- Task verify blocks run mechanical greps (banned tagline, rule lines, deprecated hexes) + copy-diff

### Integration Points
- Consumes `content/` + `shared/` only; never references concept-b/ or concept-c/
- Phase 5 will re-run copy-diff + Fritz QA across everything

</code_context>

<deferred>
## Deferred Ideas

- Photographic editorial moments (real-stock, duotone-treated) as a polish pass if Jon wants them after review
- Kinetic type on scroll for section headings beyond the hero (keep v1 sparing)

</deferred>

---

*Phase: 02-concept-a-editorial-accenture-but-better*
*Context gathered: 2026-07-23*
