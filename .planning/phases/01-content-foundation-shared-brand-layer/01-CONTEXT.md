# Phase 1: Content Foundation & Shared Brand Layer - Context

**Gathered:** 2026-07-23 (auto mode — decisions resolved from research, memory canon, and codebase scouting; no open questions required Jon)
**Status:** Ready for planning

<domain>
## Phase Boundary

Canonical verbatim content source + shared Fritz brand layer + copy-diff QA gate + local preview server with gallery index. All three concept phases (2-4) depend on this and ONLY this. No concept-specific design work happens here.

</domain>

<decisions>
## Implementation Decisions

### Content source & capture
- Source of truth: the live interceptgroup.com homepage (Variant A). A snapshot is already captured at `reference/live-homepage/index.html` (2MB, fetched 2026-07-23). Cross-check against the local Variant A source `~/Creative-Projects/intercept-website-staging/home.html`; if they differ, the live site wins.
- Copy is transcribed VERBATIM — the copy-is-immutable rule is absolute. No paraphrasing, no title-casing, no "improvements". Entities (e.g. `&rsquo;`) decode to their literal characters.
- Chunk by the homepage's own 10 sections (confirmed by scout): `hero`, `clients`, `problems` ("We love a chewy problem."), `os` ("The AI-native layer behind better work."), `agents` ("Meet the capabilities inside InterceptOS."), `work` ("Three engagements that delivered verified outcomes." — 3 case studies), `labs`, `insights` ("How other B2B marketers are putting AI to work." — 3 articles), `faqs`, `convert` ("Give us a chewy problem. Let's solve it together.").
- Output: `content/homepage.json` — per section: id, heading, body copy, CTA labels+hrefs, and item arrays (case studies, insight cards, capability/agent entries, FAQ q&a pairs). Frozen after capture; any later change requires Jon's explicit OK.
- Note: some homepage content is JS-rendered (e.g. agent detail panes populated from JS data). Capture from the staging source's inline data where the static HTML is empty — still verbatim.

### Sub-page content model (the "areas of interest")
- v1 sub-page topics derived from sections: `problems`, `interceptos` (os + agents combined — one coherent topic), `work` (or per-case-study pages if copy volume supports it), `labs`, `insights`, `contact` (convert + FAQs). Concepts each ship 2-3 of these minimum (QA-03); the model must support all.
- Sub-page copy = the verbatim chunks for that topic, presented at focused depth. Where the homepage has only a teaser, the sub-page presents that teaser copy well — NEVER fabricate extension copy.
- Sub-page content lives in the same canonical source (`content/homepage.json` + a `content/subpages.json` mapping, or one file — planner's choice) so the copy-diff gate covers both.

### Shared Fritz brand layer
- Mirror (copy, don't symlink) from the brand-kit SSoT: `~/Creative-Projects/intercept-brand-kit/tokens.css` → `shared/tokens.css`. Core tokens confirmed in Variant A: flarepop `#ff00e5`, coolsweep `#1a7aff`, wiretree `#00d862`, band-blue `#08285c`, page/fg/surface neutrals with dark+light modes.
- Canonical 8-path logo lockup only, static `centered` variant (web_animated is SUSPENDED). Mirror SVG into `shared/logo/`. Sanity grep: deprecated 12-path mark colors `#A855F7|#6366F1|#22D3EE` must appear nowhere.
- Fonts: extract exactly what the live Variant A uses (from its `<head>`/inline `@font-face`) into `shared/fonts.css` + font files. No new typefaces.
- Brand rules that bind ALL concepts (encode in a `shared/README.md` so concept phases inherit them): Flarepop is the only colored text; triangles apex-up (right angle at base, lean L/R only); mark never decoration; "no gradients" = 3-9 hard-edged equal steps; NO decorative rule lines; NO invented marks; tagline "Fresh thinking starts here." BANNED; sine ease-in-out motion, long durations.

### Copy-diff QA gate
- `qa/copy-diff.py` (Python, stdlib-only preferred): extracts human-visible text from a rendered/parsed concept HTML page, normalizes whitespace, and verifies every canonical chunk used on that page appears verbatim. Exit non-zero on any mismatch with a readable diff.
- Modeled on the existing `.fritz` QA gate discipline (check.py precedent). Must be runnable per-page and across all pages (`--all`).
- Gate is a Phase 1 deliverable proven against a tiny fixture page; Phases 2-5 consume it.

### Preview server + gallery
- `python3 -m http.server` serving the repo root on port **4340** (precedent: other Intercept tools live on 4xxx ports; 4340 unclaimed per memory).
- Root `index.html` = review gallery: Fritz-branded, dark, minimal — three concept cards (A/B/C) with name, one-line description, and link; placeholder states until concepts land in later phases. This gallery is the side-by-side review surface for Jon (FOUND-05/QA-04).
- A tiny `serve.sh` so anyone can start it with one command.

### Claude's Discretion
- Exact JSON schema shape, file naming, and whether subpage mapping is separate or inline
- HTML text-extraction approach in copy-diff.py (html.parser vs regex over rendered DOM)
- Gallery card layout details (within Fritz rules)

</decisions>

<specifics>
## Specific Ideas

- Jon's brief: "we don't want a wall of text to scroll through. Clicking on an area of interest will take you to a page with that content (derived from content on home page)." The sub-page model IS the product — treat it as first-class, not plumbing.
- Jon: "use /fritz too" — the Fritz agent QAs deliverables; Phase 1's gallery page is itself subject to Fritz QA in Phase 5.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `~/Creative-Projects/intercept-brand-kit/tokens.css`: canonical design tokens — mirror into shared/
- `~/Creative-Projects/intercept-website-staging/home.html`: self-contained Variant A source (inline tokens, all copy, JS data for agents/FAQ) — the cross-check source and fallback for JS-rendered copy
- `reference/live-homepage/index.html`: live-site snapshot (primary copy source)
- `reference/accenture/*.jpg`: 9 live captures of accenture.com/ca-en for Phase 2
- `.fritz` QA tooling patterns (check.py, headless-Chrome layout checks) in intercept-brand-kit/intercept-website-staging — model for copy-diff.py

### Established Patterns
- fritzweb ships single-file, self-contained HTML pages — concepts may follow suit, but shared/tokens.css + content JSON are the canonical upstream
- `python3 -m http.server` for local review bundles
- QA gates are scripts with exit codes, run before anything is shown to Jon

### Integration Points
- Concepts A/B/C (Phases 2-4) consume ONLY `content/` + `shared/` — never each other
- Phase 5 runs copy-diff + Fritz QA across all three and finalizes the gallery

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-content-foundation-shared-brand-layer*
*Context gathered: 2026-07-23*
