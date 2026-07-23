# Phase 1: Content Foundation & Shared Brand Layer - Research

**Researched:** 2026-07-23
**Domain:** Verbatim content extraction/chunking, static-asset brand mirroring, stdlib copy-verification tooling, zero-build local preview serving
**Confidence:** HIGH — every finding below is grounded in directly-read source files on this machine (the live-site snapshot, the staging site, the brand-kit SSoT, and the existing Fritz QA-gate precedent), not external/training-data claims.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Content source & capture**
- Source of truth: the live interceptgroup.com homepage (Variant A). A snapshot is already captured at `reference/live-homepage/index.html` (2MB, fetched 2026-07-23). Cross-check against the local Variant A source `~/Creative-Projects/intercept-website-staging/home.html`; if they differ, the live site wins.
- Copy is transcribed VERBATIM — the copy-is-immutable rule is absolute. No paraphrasing, no title-casing, no "improvements". Entities (e.g. `&rsquo;`) decode to their literal characters.
- Chunk by the homepage's own 10 sections (confirmed by scout): `hero`, `clients`, `problems` ("We love a chewy problem."), `os` ("The AI-native layer behind better work."), `agents` ("Meet the capabilities inside InterceptOS."), `work` ("Three engagements that delivered verified outcomes." — 3 case studies), `labs`, `insights` ("How other B2B marketers are putting AI to work." — 3 articles), `faqs`, `convert` ("Give us a chewy problem. Let's solve it together.").
- Output: `content/homepage.json` — per section: id, heading, body copy, CTA labels+hrefs, and item arrays (case studies, insight cards, capability/agent entries, FAQ q&a pairs). Frozen after capture; any later change requires Jon's explicit OK.
- Note: some homepage content is JS-rendered (e.g. agent detail panes populated from JS data). Capture from the staging source's inline data where the static HTML is empty — still verbatim.

**Sub-page content model (the "areas of interest")**
- v1 sub-page topics derived from sections: `problems`, `interceptos` (os + agents combined — one coherent topic), `work` (or per-case-study pages if copy volume supports it), `labs`, `insights`, `contact` (convert + FAQs). Concepts each ship 2-3 of these minimum (QA-03); the model must support all.
- Sub-page copy = the verbatim chunks for that topic, presented at focused depth. Where the homepage has only a teaser, the sub-page presents that teaser copy well — NEVER fabricate extension copy.
- Sub-page content lives in the same canonical source (`content/homepage.json` + a `content/subpages.json` mapping, or one file — planner's choice) so the copy-diff gate covers both.

**Shared Fritz brand layer**
- Mirror (copy, don't symlink) from the brand-kit SSoT: `~/Creative-Projects/intercept-brand-kit/tokens.css` → `shared/tokens.css`. Core tokens confirmed in Variant A: flarepop `#ff00e5`, coolsweep `#1a7aff`, wiretree `#00d862`, band-blue `#08285c`, page/fg/surface neutrals with dark+light modes.
- Canonical 8-path logo lockup only, static `centered` variant (web_animated is SUSPENDED). Mirror SVG into `shared/logo/`. Sanity grep: deprecated 12-path mark colors `#A855F7|#6366F1|#22D3EE` must appear nowhere.
- Fonts: extract exactly what the live Variant A uses (from its `<head>`/inline `@font-face`) into `shared/fonts.css` + font files. No new typefaces.
- Brand rules that bind ALL concepts (encode in a `shared/README.md` so concept phases inherit them): Flarepop is the only colored text; triangles apex-up (right angle at base, lean L/R only); mark never decoration; "no gradients" = 3-9 hard-edged equal steps; NO decorative rule lines; NO invented marks; tagline "Fresh thinking starts here." BANNED; sine ease-in-out motion, long durations.

**Copy-diff QA gate**
- `qa/copy-diff.py` (Python, stdlib-only preferred): extracts human-visible text from a rendered/parsed concept HTML page, normalizes whitespace, and verifies every canonical chunk used on that page appears verbatim. Exit non-zero on any mismatch with a readable diff.
- Modeled on the existing `.fritz` QA gate discipline (check.py precedent). Must be runnable per-page and across all pages (`--all`).
- Gate is a Phase 1 deliverable proven against a tiny fixture page; Phases 2-5 consume it.

**Preview server + gallery**
- `python3 -m http.server` serving the repo root on port **4340** (precedent: other Intercept tools live on 4xxx ports; 4340 unclaimed per memory).
- Root `index.html` = review gallery: Fritz-branded, dark, minimal — three concept cards (A/B/C) with name, one-line description, and link; placeholder states until concepts land in later phases. This gallery is the side-by-side review surface for Jon (FOUND-05/QA-04).
- A tiny `serve.sh` so anyone can start it with one command.

### Claude's Discretion
- Exact JSON schema shape, file naming, and whether subpage mapping is separate or inline
- HTML text-extraction approach in copy-diff.py (html.parser vs regex over rendered DOM)
- Gallery card layout details (within Fritz rules)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-------------------|
| FOUND-01 | Canonical homepage copy captured verbatim into `content/homepage.json`, frozen after capture | Section-by-section extraction map below (10 sections, exact source location for each — static HTML vs. JS data object); confirmed live vs. staging diff is limited to non-prose fields |
| FOUND-02 | Topic chunks mapped to a derived sub-page content model | Concrete per-topic field mapping below (`problems`, `interceptos`, `work`, `labs`, `insights`, `contact`) showing exactly which JSON fields are "teaser" vs "full" per topic, sourced from the actual JS data objects (`PROBLEMS_RR`, `PROBLEM_FLOWS`, `AGENTS`, `CASES`) |
| FOUND-03 | Shared Fritz brand layer mirrored from intercept-brand-kit SSoT | `tokens.css` read and reconciled against Variant A's actual custom-property names (naming mismatch flagged); logo canon-path location and exact hex palette identified; font delivery mechanism identified (Google Fonts CDN, not self-hosted files) |
| FOUND-04 | Copy-diff QA gate verifies each concept's rendered text against canonical source | `check.py` precedent read in full (stdlib argparse/re/json pattern to model against); `html.parser` feasibility confirmed given the "hand-paste copy into markup" authoring constraint; recommended `data-copy` element-scoping pattern to make verification exact rather than fuzzy |
| FOUND-05 | Local preview server serves all three concepts + gallery index on one port | Port 4340 confirmed free via `lsof`; `python3 -m http.server` is zero-code and matches existing account precedent |
</phase_requirements>

## Summary

This phase is not "library research" — it is source-of-truth reconnaissance. The two candidate content sources (`reference/live-homepage/index.html`, the 2MB live-site snapshot, and `~/Creative-Projects/intercept-website-staging/home.html`, the staging Variant A source) were diffed directly: **all prose copy in the 10 homepage sections is byte-identical between them.** The only differences are non-prose: analytics/Supabase wiring scripts, a `<link rel="canonical">` tag, a richer footer/nav link set in staging (which points at `about.html`/`chatb2b.html`/`insights-hub.html` — real, already-built sub-pages for a *different, larger* site that are explicitly **out of scope** for this phase's "derive from homepage chunks only" rule), and three podcast-episode outbound links that are generic in the live capture but per-episode-precise in staging.

The homepage's richest content — the InterceptOS problem-flow detail, the full 13-agent roster (descriptions, "solves", sample work), and the three case studies' challenge/approach/results — is **not in the static HTML body at all**. It lives in five JS object literals in a single `<script>` block: `PROBLEMS_RR`, `PROBLEM_FLOWS`, `AGENTS`, `CASE_IMG`, `CASES` (exact line numbers below). A naive "view-source and copy the visible text" pass would miss most of this. Conversely, the homepage's card-level teaser text (e.g. each case study's one-paragraph `.c-summary`) is *not* in those JS objects — it's separate, hand-authored prose sitting in the static markup next to the JS-populated modal trigger. Extraction must read **both** the static HTML and the JS data objects, per section, and the mapping of which is which is now fully documented below.

The Fritz brand mirror is straightforward for tokens (hex values match exactly what Variant A actually renders) but has one real gap: **there are no font files or `@font-face` rules anywhere in this project** — both live and staging load Instrument Sans/Inter/Geist Mono from the Google Fonts CDN (`fonts.googleapis.com/css2?family=...`). The CONTEXT.md instruction to extract "`@font-face`... into shared/fonts.css + font files" describes an artifact that doesn't exist; the correct mirror is the CDN `<link>` itself. Also: `intercept-brand-kit/tokens.css` uses a full 100–500 color-ramp naming convention (`--flarepop-100`, `--bg-page`) that does **not** match the shorthand custom-property names Variant A's own CSS actually references (`--flarepop`, `--page`, `--fg`) — mirroring the file verbatim (as instructed) is correct, but concepts that want to reuse Variant-A-style CSS will need an alias layer or must switch to the tokens.css native names.

The canonical logo is confirmed: an 8-path group (`class="fritz-layout fritz-canon"`, `data-node=""`) using base fill `#FF00E5` plus six named accent hex values (`#8846C9 #1DABC1 #5154C4 #FF44F9 #FFA9F8 #FF52F9`) sitting inside a `<symbol id="intercept-lockup">` wordmark. None of the deprecated 12-path mark's colors (`#A855F7`, `#6366F1`, `#22D3EE`) appear anywhere in the live site, the staging site, or `tokens.css` — the grep gate is a correctly-scoped, currently-passing sanity check to carry forward, not a fix that needs making.

For the copy-diff gate: because this project's own architecture pattern (see `ARCHITECTURE.md` Anti-Pattern 2) mandates that concepts hand-paste copy directly into markup rather than store it in JS and inject it — exactly the opposite of what the live site itself does for `agents`/`work`/`os` — a plain Python `html.parser` pass over the static `.html` file is fully sufficient to verify rendered text. No headless browser is needed for this gate (that's what `layout.mjs`, a separate tool, is for). The one real risk is a concept copying the live site's own JS-data-object pattern for copy storage, which would make that copy invisible to a static-file text scan; this is flagged as a pitfall with a concrete mitigation.

**Primary recommendation:** Extract `content/homepage.json` directly from `reference/live-homepage/index.html`'s static HTML *and* its five JS data objects (not staging, not a headless render); build `qa/copy-diff.py` as a stdlib `html.parser` subclass that skips `<script>/<style>/<svg>/<symbol>` and walks a `data-copy="section.path"`-annotated concept page for exact (not fuzzy) verification; mirror `tokens.css` verbatim plus a small alias block for Variant-A-style shorthand names; mirror the Google Fonts `<link>` (there is no font file to copy); serve everything with unmodified `python3 -m http.server 4340`.

## Standard Stack

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|---------------|
| Python 3 stdlib `html.parser.HTMLParser` | 3.14.5 confirmed on this machine | Rendered-text extraction for `qa/copy-diff.py` | Zero dependencies (no `bs4`/`lxml` installed or needed); `convert_charrefs=True` by default since Py3.5 auto-decodes entities (`&rsquo;` → `’`), satisfying the verbatim/entity-decode requirement for free |
| Python 3 stdlib `http.server` | ships with Python | Local preview server, port 4340 | Already the proven pattern in `intercept-website-staging`; zero install, zero config |
| Python 3 stdlib `json`, `re`, `argparse`, `pathlib` | ships with Python | `qa/copy-diff.py` CLI + content loading | Exact toolset `intercept-brand-kit/.fritz/qa/check.py` already uses — same discipline, same dependencies (none) |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| `grep -E` (or Python `re`) | n/a | Deprecated-mark sanity check (`#A855F7\|#6366F1\|#22D3EE`) | Run once at mirror time on `shared/logo/*.svg`, and again as a gate step alongside copy-diff |
| Google Fonts CDN `<link>` | `css2?family=Instrument+Sans...&family=Inter...&family=Geist+Mono...` (exact URL confirmed identical in both live and staging `<head>`) | Typography delivery | This is what the live site ITSELF does — no self-hosted files exist to mirror; reuse the same CDN link unless Jon explicitly wants offline/self-hosted resilience (open question below) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| stdlib `html.parser` | `BeautifulSoup`/`lxml` | Neither is installed on this machine (`ModuleNotFoundError` confirmed); would add a pip dependency for a static-file text-extraction job stdlib already handles cleanly — no reason to add it |
| stdlib `html.parser` | Headless-Chrome/CDP (the pattern `layout.mjs` uses) | Only needed if concepts render copy via runtime JS/innerJS injection (as the live site itself does for `agents`/`work`/`os`) — but the project's own architecture rule bans that pattern for concepts, so a static parse suffices; adding Chrome/Node as a FOUND-04 dependency would be unjustified overhead |
| Google Fonts CDN | Self-hosted `.woff2` download of the 3 families | Live site itself uses the CDN, not self-hosted files — mirroring self-hosted fonts would be "improving" beyond what Variant A actually does; only worth doing if Jon wants the concepts to work fully offline (flagged as open question) |

**Installation:**
```bash
# Nothing to install. Python 3.14.5 stdlib covers everything qa/copy-diff.py needs.
python3 -m http.server 4340   # preview server, zero install
```

## Architecture Patterns

### Recommended Project Structure
(Matches `.planning/research/ARCHITECTURE.md` exactly — repeated here only where Phase 1 file shapes need to be concrete.)
```
intercept-home-concepts/
├── index.html                  # gallery — Phase 1 deliverable (FOUND-05)
├── content/
│   ├── homepage.json           # FOUND-01 — see schema below
│   ├── subpages.json           # FOUND-02 — see mapping below (or merge into homepage.json; discretion)
│   └── SOURCE.md               # provenance: URL, capture date/method, live-vs-staging diff note
├── shared/
│   ├── tokens.css              # verbatim mirror of intercept-brand-kit/tokens.css + alias block (see Pitfall 7)
│   ├── fonts.css                # Google Fonts CDN @import/<link> equivalent — NOT self-hosted files (see Pitfall 5)
│   ├── logo/
│   │   └── lockup.svg          # <symbol id="intercept-lockup"> wordmark + static 8-path canon mark (no hover JS)
│   ├── motion.css               # sine ease-in-out custom properties
│   └── README.md                # brand rules all 3 concepts inherit
├── qa/
│   ├── copy-diff.py             # FOUND-04
│   ├── fixtures/
│   │   └── tiny-page.html       # the "tiny fixture page" the gate must be proven against per CONTEXT.md
│   └── README.md
└── serve.sh                     # `python3 -m http.server 4340` wrapper
```

### Pattern 1: Section-by-Section Extraction Map (FOUND-01)

**What:** For each of the 10 homepage sections, the exact source of the verbatim text — static HTML vs. JS data object — confirmed by direct inspection of `reference/live-homepage/index.html`.

| Section (`id`) | Static HTML has | JS data object has (line # in `reference/live-homepage/index.html`) | Extraction note |
|---|---|---|---|
| `hero` (no id, `.hero.hero-a`) | Full copy: kicker, `<h1>` (with inline `<em>`/`<span class="dot">` markup), sub-paragraph, one CTA (`Explore more` → `#problems`) | — | 100% static; no JS dependency |
| `clients` | Full copy: label "You're in good company" + 12 inline brand `<svg>` logos (Microsoft, SAP, HP, Lenovo, Cisco, AMD, Qualcomm, Logitech, Nokia, TELUS, Staples, BMC) with `title=`/`aria-label=` per logo | — | Logo names are the only "copy"; the SVG paths themselves are decorative brand assets, not prose to diff |
| `problems` | Static: eyebrow "what we solve", h2 "We love a chewy problem.", lead, 4 tab buttons (eyebrow + tabName each) | `PROBLEMS_RR` object, **line 2807** — full per-problem: `num`, `name`, `quote`, `attrib`, `tells[]` (3 items), `signalNum`, `signalLbl`, `bridge` | The tab buttons' short "tabName" text is DIFFERENT prose from the JS object's `quote` — both are real copy, capture both |
| `os` | Static: eyebrow "InterceptOS", h2 "The AI-native layer behind better work.", lead, 4 tab labels ("The Intelligence Problem" etc.) | `PROBLEM_FLOWS` object, **line 2892** — per problem: `job`, `layer`, `stages[]` (each: `tag`, `name`, `agents[]`, `desc`) | This is the deepest/most structured content chunk on the page — 4 problems × 4 stages each |
| `agents` | Static: eyebrow "the agent roster", h2, lead, 4 category tab labels; grid itself renders empty (`id="agentsGrid"`, populated by JS) | `AGENTS` object, **line 2969** (13 agents) + `CAT_LABELS`, **line 3036** — per agent: `name`, `type`, `role`, `desc`, `solves[]`, `sample` | ALL agent card/detail copy is JS-only — nothing to scrape from static HTML for individual agents |
| `work` | Static: eyebrow "the proof", h2, lead, PLUS per-case teaser: `client`, `tag`, `h3` name, **`c-summary` paragraph** (this exists ONLY in static HTML), metric number + label | `CASES` object, **line 3156** (3 cases) — per case: `client`, `tag`, `name`, `challenge`, `approach`, `results[]`, `agents`. `CASE_IMG`, **line 3151**, has hero image data URIs (not copy) | **The teaser summary and the full challenge/approach/results are different prose living in different places** — homepage shows the static summary; sub-page should show the JS object's challenge/approach/results (see Pattern 2) |
| `labs` | Full copy: lockup label, h2 (with inline `<span class="hl">`), body paragraph, one CTA ("Build with Labs"), one stat (`Up to 50%` / "Project co-investment") | — | 100% static; no deeper JS data exists — there is nothing more to show on a "labs" sub-page beyond this teaser (per CONTEXT.md: never fabricate) |
| `insights` | Full copy per episode tile: eyebrow, h2, lead, then 3× (`episode num + show`, `<h3>` title, guest name + role, summary paragraph, 3 outbound links) | — | 100% static; the only live-vs-staging difference in this section is outbound-link precision (see Pitfall 4) |
| `faqs` | Full copy: eyebrow "common questions", h2 "FAQs.", **11** `<details><summary>Q</summary><div class="a">A</div></details>` pairs, already fully expanded in markup (not JS-gated) | — | 100% static; this section is ALREADY at "full depth" on the homepage — nothing more exists for a sub-page to add |
| `convert` | Full copy: eyebrow, h2, lead, one CTA tile (heading "Open the form.", sub-copy, arrow) | — | 100% static; the actual form fields are UI chrome, not brand prose |
| (footer, not a numbered section but visible copy) | Site links, Trust links (`AI Policy`/`Privacy Policy`/`Terms of Service` — pages that don't exist in this repo, out of scope), Socials links, tagline "Powered by curiosity." | — | Capture the footer tagline + link LABELS as copy if the gallery/concepts render a footer; the Trust-page hrefs point to pages this project doesn't build — link the footer nav to the concept's own anchors/sub-pages instead |

**Example (`content/homepage.json` shape, illustrative, not a mandate — schema shape is Claude's Discretion):**
```json
{
  "meta": {
    "source_url": "https://interceptgroup.com/",
    "source_file": "reference/live-homepage/index.html",
    "capture_date": "2026-07-23",
    "cross_checked_against": "intercept-website-staging/home.html (prose identical; nav/hrefs differ, see SOURCE.md)"
  },
  "hero": {
    "kicker": "Award-winning B2B marketing for global tech",
    "h1_html": "We turn your most <em>ambitious</em> briefs into <em>proven</em> outcomes<span class=\"dot\">.</span>",
    "sub": "Marketing teams are increasingly pressured to adopt AI, but most don’t know where to start. Intercept is the frontier B2B agency for global tech, helping clients use AI to make the keep-the-lights-on work more efficient and power the innovation that redefines the buyer experience.",
    "cta": { "label": "Explore more", "href": "#problems" }
  },
  "problems": {
    "eyebrow": "what we solve",
    "h2": "We love a chewy problem.",
    "lead": "Four that global tech keeps bringing us.",
    "items": [
      {
        "key": "intelligence",
        "tabEyebrow": "Intelligence",
        "tabName": "Research is stale by the time you act.",
        "num": "01", "name": "The Intelligence Problem",
        "quote": "My research is stale by the time we act on it, and we’re always a step behind the market.",
        "attrib": "A CMO, networking infrastructure brand",
        "tells": ["Traditional research is too slow and too expensive for the pace we move at.", "..."],
        "signalNum": "45%",
        "signalLbl": "of the data marketers use to make business decisions is incomplete, inaccurate, or out of date. (Adverity, State of Marketing Data Quality, 2025)",
        "bridge": "We triangulate live signals no single source can see on its own, keeping go-to-market current and putting on-demand account research in sellers’ hands."
      }
    ]
  }
}
```
*(Full 10-section shape follows the same per-section table above — `os`, `agents`, `work`, `labs`, `insights`, `faqs`, `convert` each nest their static + JS-object fields the same way.)*

### Pattern 2: Sub-Page Topic → Field Mapping (FOUND-02)

**What:** For each of the 6 v1 sub-page topics locked in CONTEXT.md, the concrete JSON fields available (confirmed to exist, not invented) for a "focused depth" presentation distinct from the homepage teaser.

| Topic | Homepage teaser fields | Sub-page ("focused depth") fields | Fabrication risk |
|---|---|---|---|
| `problems` | 4 tab buttons (eyebrow + short tabName) | Full `PROBLEMS_RR` per problem: quote, attrib, 3 tells, signal stat, bridge sentence | None — sub-page is strictly the JS object already used to populate the homepage's own tab-detail panel |
| `interceptos` (os + agents combined) | `os`'s 4 tab labels + `agents`'s 4 category tabs (grid itself is empty until clicked) | `PROBLEM_FLOWS` (job/layer/4 stages per problem) **plus** full `AGENTS` roster (13 agents: name/type/role/desc/solves/sample) | None — every field is JS-object copy already shipped to the live homepage's own DOM at runtime; nothing new is written |
| `work` | Per-case: client, tag, name, one summary paragraph, one metric | Per-case: `challenge`, `approach`, `results[]` (3-4 bullet outcomes each), `agents` attribution — from `CASES` | None — this is literally what the homepage's own "Learn more" modal already shows; a sub-page just makes it a real URL instead of a JS drawer. Consider one URL per case (`work/hp-abx.html` etc.) since 3 cases × full copy is substantial — "or per-case-study pages if copy volume supports it" per CONTEXT.md is confirmed appropriate given the volume |
| `labs` | Full teaser (lockup label, h2, body, CTA, one stat) | **Nothing deeper exists.** Per CONTEXT.md: "present that teaser copy well — NEVER fabricate extension copy" | HIGH if not disciplined — Labs is the one topic where a sub-page could tempt inventing case examples or a longer body; don't |
| `insights` | 3 episode tiles, each already at full depth (title, guest, summary, 3 links) | Same 3 tiles — a sub-page here is a layout change (full-width reading list) not a copy-depth change | Low — homepage already shows full episode copy; nothing to add |
| `contact` (convert + faqs) | `convert`'s CTA tile teaser | Full `convert` copy + **all 11** FAQ Q&A pairs (already fully expanded in static HTML, not JS-gated) | None — FAQs are already complete verbatim text sitting in the homepage's own markup |

**Scoping note confirmed by direct diff:** `intercept-website-staging/` already contains real, richer sub-pages (`about.html`, `chatb2b.html`, `insights-hub.html`, 6× individual insight-article pages) for a larger, separately-scoped site. These are **not** valid sources for this phase's `content/subpages.json` — CONTEXT.md's rule is "derived from homepage chunks," and pulling in `about.html`'s copy (which doesn't exist anywhere on the homepage) would be exactly the fabrication the rule prohibits. They're useful precedent for chrome/structure only, and are explicitly the kind of thing `ENH-01` ("Full derived sub-page set covering every content area") defers to v2 — flag this distinction for the planner so Phase 1 doesn't over-scope by "discovering" these files mid-build.

### Pattern 3: `data-copy`-Scoped Verbatim Verification (FOUND-04, recommended approach for Claude's Discretion item)

**What:** Rather than a whole-page fuzzy substring scan (which can't distinguish "this exact sentence is missing" from "this page just doesn't use that chunk," and can't safely validate an intentionally-truncated teaser), tag any HTML element that carries canonical copy with `data-copy="section.path"` (dot-path into `content/homepage.json`/`subpages.json`). `qa/copy-diff.py` then does element-scoped exact comparison: full match required by default, or a declared `data-copy-truncated="true"` for teaser truncation at a natural boundary (verified as a true prefix of the canonical string, not an arbitrary substring).

**When to use:** Every concept page (Phases 2-4) that renders canonical copy. This turns "trust the builder pasted correctly" into "trust the gate," which is exactly the shift this project's own `ARCHITECTURE.md` already recommends making for copy (mirroring what `check.py` already does for brand tokens/type/logo/forbidden-phrases).

**Trade-offs:** Requires concept authors to add one `data-copy` attribute per copy-bearing element — a small extra authoring step in exchange for exact (not approximate) verification, and for teaser-truncation to be provable rather than assumed. A whole-page fallback substring mode (see Code Examples) should still exist for the Phase 1 self-test fixture and for any page that hasn't been annotated yet, so `--all` never silently skips a page.

**Example (concept markup convention):**
```html
<h1 data-copy="hero.h1_html">We turn your most <em>ambitious</em> briefs into <em>proven</em> outcomes.</h1>
<p data-copy="hero.sub" data-copy-truncated="true">Marketing teams are increasingly pressured to adopt AI…</p>
```

### Pattern 4: Brand Token Mirror + Alias Layer (FOUND-03)

**What:** `shared/tokens.css` = byte-for-byte copy of `intercept-brand-kit/tokens.css` (per CONTEXT.md, do not hand-retype). Confirmed the file defines a full 100–500 ramp (`--flarepop-100` … `--flarepop-500`, `--bg-page`, `--fg-primary`, `--font-display`, etc.) — all hex values match what Variant A actually renders (`#ff00e5` flarepop, `#1a7aff` coolsweep, `#00d862` wiretree, `#08285c` band-blue/coolsweep-500 all confirmed present in both files).

**Gap found:** Variant A's own inline `<style>` block does **not** use tokens.css's names — it defines its own shorthand custom properties directly in the page (`--flarepop:#ff00e5; --coolsweep:#1a7aff; --wiretree:#00d862; --page:#0a0a0f; --fg:#ffffff; --surface:#14141c;` etc., confirmed at the top of `reference/live-homepage/index.html`'s `<style>` block). These shorthand names do not exist in `tokens.css` at all.

**Recommendation:** Append a small alias block to `shared/tokens.css` (or a separate `shared/aliases.css` loaded after it) mapping the shorthand names Variant A's CSS actually uses onto the canonical ramp, e.g.:
```css
/* Aliases so concept CSS can use Variant-A-style shorthand names against brand-kit's canonical ramp */
:root {
  --flarepop: var(--flarepop-100);
  --coolsweep: var(--coolsweep-100);
  --wiretree: var(--wiretree-100);
  --page: var(--bg-page);
  --surface: var(--bg-surface);
  --fg: var(--fg-primary);
}
```
This costs nothing, doesn't fork brand values (every alias points at a canonical token), and means concepts can pattern-match Variant A's own CSS directly if useful, without requiring them to learn two different naming systems.

### Pattern 5: Static 8-Path Canonical Logo (FOUND-03)

**What:** The canonical mark is the `class="fritz-layout fritz-canon"` group inside `<svg id="fritz-glitch-source">` (found in both `reference/live-homepage/index.html` and `intercept-website-staging/home.html`, byte-identical): exactly 1 `path.base` + 7 `path.accent` = 8 paths, filled `#FF00E5` (base) plus 6 named accents (`#8846C9`, `#1DABC1`, `#5154C4`, `#FF44F9`, `#FFA9F8`, `#FF52F9`). It sits alongside a `<symbol id="intercept-lockup">` containing the "Intercept" wordmark paths (fixed ink color `var(--logo-ink)`) with an empty `<g id="mark-slot">`/`<g id="footer-mark-slot">` that JS fills at runtime.

**The live site's own JS (`initLockup()`) is the SUSPENDED `web_animated` hover behavior** (memory: `feedback_fritz_web_animated_suspended.md` — default is static `centered`). For `shared/logo/lockup.svg`, do not port that JS: statically inline the `.fritz-canon` group's 8 paths directly into the `mark-slot` group (i.e., bake the "centered/at-rest" state as the permanent, non-interactive markup) and ship the wordmark `<symbol>` as-is. No hover wiring, no `data-fritz-hover-lockup` attribute, no JS file needed for this shared asset.

**Verified sanity check:** `grep -c 'A855F7\|6366F1\|22D3EE'` returns `0` in the live snapshot, the staging source, and `tokens.css` — the deprecated 12-path mark is confirmed absent everywhere already; the grep is a regression guard to keep passing, not a fix to make.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|--------------|-----|
| Verbatim-copy verification across 3+ independent HTML files | Manual eyeballing / ad hoc diffing before each review | `qa/copy-diff.py` (stdlib `html.parser`, exact `data-copy`-scoped comparison) | This project's own repeatedly-flagged failure mode is exactly copy drift from re-typing; a mechanical gate is the only fix that scales past one concept |
| HTML text extraction | Naive regex tag-stripping (`re.sub(r'<[^>]+>', '', html)`) | `html.parser.HTMLParser` subclass tracking a tag stack, explicitly suppressing `<script>/<style>/<svg>/<symbol>` bodies | Naive regex-strip cannot correctly skip `<script>` JSON/JS blobs or nested `<svg>` decorative markup — it will either miss real copy or falsely "verify" JS source text as rendered content |
| Brand hex/token values in concept CSS | Retyping `#ff00e5` etc. from memory into each concept's stylesheet | Mirrored `shared/tokens.css` (file copy, not retype), referenced via `var(--flarepop-100)`/alias | Retyping is exactly how token drift happens; the file-copy-then-reference pattern already proven for `.fritz/qa/check.py`'s own `gate_color()` (loads tokens.css, diffs any hex not present) generalizes cleanly here |
| Static file serving with directory listing | A hand-rolled Python `http.server` subclass with custom routing/CORS | `python3 -m http.server 4340` unmodified | Zero-install, already the proven pattern in `intercept-website-staging`; this repo has no backend, no API, nothing a custom server would add value for |
| Deprecated-mark detection | Visual-only QA (\"look at it and see if it looks wrong\") | `grep -E '#A855F7|#6366F1|#22D3EE'` over `shared/logo/*.svg` (and any concept file that inlines the mark) | Same discipline as `check.py`'s `gate_color` — a 3-token regex is cheap, deterministic, and already proven to currently pass on every source file in this project |

**Key insight:** Every "don't hand-roll" item above already has a proven, working precedent *somewhere in this same account* (`check.py`'s gate pattern, `intercept-website-staging`'s `http.server` usage, the live site's own tokens-file discipline). Phase 1's job is to reuse those patterns for this new repo, not invent new ones.

## Common Pitfalls

### Pitfall 1: Assuming static HTML = complete content
**What goes wrong:** A "view-source and copy visible text" pass captures `hero`, `clients`, `labs`, `insights`, `faqs`, `convert` completely — but for `problems`, `os`, `agents`, and `work`, it captures only the shallow tab labels/teasers and misses the actual detail copy entirely (it's in JS object literals, not the DOM).
**Why it happens:** The live site intentionally pre-renders only teaser/tab-chrome in static HTML and populates rich detail panels via JS on interaction (a legitimate progressive-disclosure pattern for a live, JS-enabled site) — but that means "verbatim from the page" requires reading the JS source, not just the rendered DOM.
**How to avoid:** Use the section-by-section extraction map in Pattern 1 above; specifically locate and transcribe `PROBLEMS_RR` (line 2807), `PROBLEM_FLOWS` (line 2892), `AGENTS`+`CAT_LABELS` (lines 2969/3036), `CASES`+`CASE_IMG` (lines 3156/3151) in `reference/live-homepage/index.html`.
**Warning signs:** If `content/homepage.json`'s `agents` or `os` sections only contain tab/category labels and no `desc`/`sample`/`stages` fields, extraction missed the JS data.

### Pitfall 2: Copy stored in JS defeats the static copy-diff gate
**What goes wrong:** If a concept mirrors the live site's OWN architecture — store copy in a JS object, inject via `innerHTML` at runtime — `qa/copy-diff.py` (a static-file `html.parser` pass, not a headless-browser render) will not see that text as "rendered," producing false negatives (can't confirm) or requiring an unplanned headless-Chrome dependency.
**Why it happens:** It's a completely reasonable pattern in general (the live site does it), but it's explicitly banned for concepts by this project's own `ARCHITECTURE.md` Anti-Pattern 2 ("copy-paste the JSON string value directly into markup").
**How to avoid:** State this constraint plainly in `shared/README.md` or the phase's task instructions for Phases 2-4: canonical copy must be literal HTML text nodes; JS may drive interaction/visibility but must never be the sole storage location for brand copy.
**Warning signs:** A concept's `script.js` contains string literals matching phrases from `content/homepage.json`, while its `.html` files' matching elements are empty until JS runs.

### Pitfall 3: Teaser prose and full-detail prose are NOT the same string, don't assume one contains the other
**What goes wrong:** Assuming the homepage case-study teaser (`.c-summary`, static HTML) is a truncation of the `CASES` JS object's `challenge`/`approach` fields, and trying to auto-derive one from the other.
**Why it happens:** They look related (same case, same client) but were independently hand-authored — the summary is a distinct marketing paragraph, not a substring of challenge+approach.
**How to avoid:** Capture both as separate, independent verbatim fields (`summary` from static HTML, `challenge`/`approach`/`results` from the JS object) — never synthesize one from the other.
**Warning signs:** A sub-page's "full" case copy reads suspiciously identical to the homepage teaser, or vice versa.

### Pitfall 4: Live-vs-staging drift on hrefs, not prose — a judgment call, not a "live wins" auto-resolve
**What goes wrong:** The three `insights` episode tiles have generic Spotify **show**-page links in the live capture but precise per-**episode** Spotify/Apple/YouTube links in staging (confirmed via direct diff). Applying CONTEXT.md's "if they differ, live wins" rule literally to hrefs would mean shipping the less-precise, already-superseded links.
**Why it happens:** The "live wins" rule was written for prose-copy conflicts; hrefs aren't prose, and staging genuinely looks like an in-flight fix not yet deployed live.
**How to avoid:** Don't silently resolve this either direction — flag it in `content/SOURCE.md` as a noted discrepancy and let the planner/Jon decide (recommendation: use live's prose text, staging's more precise hrefs, since verbatim-copy rules govern text not links).
**Warning signs:** None automated — this is a one-time manual call to document, not an ongoing gate concern.

### Pitfall 5: There is no font file to mirror — don't invent a self-hosting step
**What goes wrong:** CONTEXT.md's brand-layer instructions say to extract "`@font-face`... into shared/fonts.css + font files," but neither `reference/live-homepage/index.html` nor `intercept-website-staging/home.html` contains any `@font-face` rule or local font file. Both load Instrument Sans/Inter/Geist Mono from Google Fonts' CDN via a `<link href="https://fonts.googleapis.com/css2?family=...">`.
**Why it happens:** The instruction assumed a self-hosted font setup that doesn't exist in this codebase; the live site itself depends on the Google Fonts CDN at runtime.
**How to avoid:** Mirror the CDN `<link>` tag (or its `@import` equivalent) into `shared/fonts.css`/a shared partial — don't fabricate local `.woff2` files that were never part of the source. If Jon later wants full offline capability, that's a new, explicit decision (see Open Questions), not an assumption to bake in silently.
**Warning signs:** A `shared/fonts/*.woff2` directory with files that don't trace back to any font file that existed in the source repos.

### Pitfall 6: tokens.css variable names won't resolve against Variant-A-style CSS out of the box
**What goes wrong:** A concept author copies a CSS pattern from Variant A (`color: var(--fg); background: var(--surface);`) directly against `shared/tokens.css` and gets unstyled/invalid-var fallback behavior, because tokens.css defines `--fg-primary`/`--bg-surface`, not `--fg`/`--surface`.
**Why it happens:** Two different naming conventions exist for the same brand values in two different files (documented in Pattern 4).
**How to avoid:** Add the small alias block from Pattern 4 to `shared/tokens.css` at mirror time.
**Warning signs:** Concept CSS with `var(--page)`/`var(--fg)`/`var(--flarepop)` (no `-100` suffix) referencing a `shared/tokens.css` that only defines the `-100`..`-500` ramp names.

### Pitfall 7: Truncated teaser copy will fail a naive full-string copy-diff
**What goes wrong:** CONTEXT.md explicitly permits truncating a chunk "at a natural boundary" for card-fit reasons. A copy-diff implementation that requires the full canonical string to appear verbatim on every page that references it will incorrectly fail legitimate, permitted truncation.
**Why it happens:** "Verbatim" (no paraphrasing) and "complete" (no truncation) are different properties; the project explicitly wants the former enforced strictly while permitting the latter.
**How to avoid:** Use the `data-copy-truncated="true"` prefix-check mode from Pattern 3, or, at minimum, treat "rendered text is an exact prefix of the canonical string up to a sentence/word boundary" as a pass, not just "rendered text === canonical string."
**Warning signs:** The gate fails on a legitimately-truncated homepage card even though no word was changed.

## Code Examples

### `qa/copy-diff.py` — extraction core (illustrative skeleton, modeled on `check.py`'s stdlib-only discipline)
```python
# Source pattern: intercept-brand-kit/.fritz/qa/check.py (argparse + json report + exit codes)
# Source pattern: Python 3 stdlib html.parser docs (convert_charrefs default True since 3.5)
from html.parser import HTMLParser

SKIP_TAGS = {"script", "style", "svg", "symbol", "noscript", "template"}

class VisibleTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)   # auto-decodes &rsquo; etc. to literal chars
        self._skip_depth = 0
        self.chunks = []

    def handle_starttag(self, tag, attrs):
        if tag in SKIP_TAGS:
            self._skip_depth += 1

    def handle_endtag(self, tag):
        if tag in SKIP_TAGS and self._skip_depth > 0:
            self._skip_depth -= 1

    def handle_data(self, data):
        if self._skip_depth == 0:
            self.chunks.append(data)

    def text(self):
        import re
        return re.sub(r"\s+", " ", "".join(self.chunks)).strip()
```

### `content/SOURCE.md` — provenance note shape (illustrative)
```markdown
# Content Source

- Canonical source: https://interceptgroup.com/ (live Variant A), captured 2026-07-23
- Snapshot file: reference/live-homepage/index.html (2,069,744 bytes)
- Cross-checked against: intercept-website-staging/home.html — prose content in all 10
  homepage sections is byte-identical; differences are limited to analytics/form-wiring
  scripts, a canonical <link>, richer nav/footer links to pages outside this project's
  scope (about.html, chatb2b.html, insights-hub.html), and 3 podcast-episode outbound
  links (generic show-link live vs. per-episode-precise staging — see note below).
- Known discrepancy (not auto-resolved): insights episode outbound links. Recommendation:
  keep live's prose text, use staging's more precise per-episode hrefs (hrefs are not
  governed by the verbatim-copy rule).
```

## State of the Art

| Old approach (what this project's other tools use for similar problems) | Approach for THIS phase's copy-diff | When it changed | Impact |
|---|---|---|---|
| Headless-Chrome via CDP (`layout.mjs`) for real-geometry/rendering checks | Plain stdlib `html.parser` static-file text scan | N/A — different problem, not a version change | No Node/Chrome dependency needed for FOUND-04 specifically, because concepts must hand-author copy as literal text (Pitfall 2) rather than JS-inject it the way the live site itself does |
| Google Fonts CDN `<link>` | Same — no change | N/A | Confirms `shared/fonts.css` should mirror the CDN link, not fabricate self-hosted files that never existed (Pitfall 5) |

**Deprecated/outdated:** Nothing in this phase's scope is version-deprecated; the one "old vs new" distinction worth recording is architectural (static parse vs. headless render), not a library-version issue.

## Open Questions

1. **Insights episode outbound-link precision (live generic vs. staging per-episode)**
   - What we know: prose is identical; only the 3 episodes' Spotify/Apple/YouTube hrefs differ, staging's being more specific/correct.
   - What's unclear: whether "live wins" should apply to hrefs at all, or only to prose.
   - Recommendation: use live's prose, staging's hrefs; document the choice in `content/SOURCE.md` rather than silently picking one.

2. **Font self-hosting**
   - What we know: neither source has local font files; both use the Google Fonts CDN.
   - What's unclear: whether Jon wants the concepts to work fully offline (no external CDN dependency) for review purposes.
   - Recommendation: mirror the CDN `<link>` as-is (matches what the actual live site does) unless Jon flags an offline requirement; this is a one-line change to revisit later if needed, not a blocker now.

3. **tokens.css alias layer — add now or leave to concept phases?**
   - What we know: Variant A's own CSS uses shorthand names tokens.css doesn't define.
   - What's unclear: whether Phase 1 should ship the alias block (Pattern 4) as part of `shared/tokens.css`, or whether that's a Phase 2-4 concern each concept handles independently.
   - Recommendation: ship it in Phase 1's `shared/tokens.css` — it's brand-invariant, costs nothing, and prevents 3 concepts from independently reinventing (or forgetting) the same alias.

4. **`data-copy` annotation convention — mandate or optional?**
   - What we know: it produces exact, provable verification instead of fuzzy substring matching, and directly supports permitted truncation (Pitfall 7).
   - What's unclear: this is explicitly Claude's Discretion per CONTEXT.md, and it does add a small authoring convention Phases 2-4 need to follow consistently.
   - Recommendation: adopt it as the primary mode with a whole-page substring fallback for any unannotated page, so `--all` never hard-fails on a page that simply hasn't adopted the convention yet.

## Sources

### Primary (HIGH confidence — all directly read from disk on this machine, 2026-07-23)
- `reference/live-homepage/index.html` (2,069,744 bytes) — full read of `<head>`, all 10 `<section>` elements, and the `<script>` block containing `PROBLEMS_RR`/`PROBLEM_FLOWS`/`AGENTS`/`CAT_LABELS`/`CASE_IMG`/`CASES`
- `~/Creative-Projects/intercept-website-staging/home.html` — full-file diff against the live snapshot (164-line diff, fully reviewed)
- `~/Creative-Projects/intercept-brand-kit/tokens.css` — full read (192 lines)
- `~/Creative-Projects/intercept-brand-kit/.fritz/qa/check.py` — full read (323 lines), modeled for `qa/copy-diff.py`
- `~/Creative-Projects/intercept-brand-kit/.fritz/qa/layout.mjs` — partial read (80 lines), confirmed as a separate headless-Chrome tool not needed for FOUND-04
- `lsof -i :4340` and `lsof -iTCP -sTCP:LISTEN` — confirmed port 4340 free, port 4330 (meredith site) the only nearby listener
- `python3 -c "import bs4"` / `import lxml` — confirmed neither installed, supporting the stdlib-only recommendation
- `.planning/phases/01-content-foundation-shared-brand-layer/01-CONTEXT.md`, `.planning/REQUIREMENTS.md`, `.planning/STATE.md`, `.planning/research/ARCHITECTURE.md` — upstream project context and constraints

### Secondary (MEDIUM confidence)
None — no external/web sources were needed for this phase; every finding was verifiable directly against project files.

### Tertiary (LOW confidence)
None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — stdlib-only tooling confirmed present and sufficient by direct test on this machine
- Architecture (extraction map, sub-page mapping, logo/tokens): HIGH — every field/line-number reference was located and read directly, not inferred
- Pitfalls: HIGH — each pitfall is grounded in an actual diff or grep result, not a hypothetical

**Research date:** 2026-07-23
**Valid until:** Until `content/homepage.json` is captured and frozen (this research describes a one-time extraction event, not an evolving dependency — no expiry concern beyond the live site changing before capture happens)
