# Content Source & Provenance

## Canonical source

- URL: https://interceptgroup.com/ (live, Variant A homepage)
- Captured: 2026-07-23
- Snapshot file: `reference/live-homepage/index.html` (~2,069,744 bytes)

## Extraction method

Copy was pulled in two passes, both required — a static-HTML-only pass would have missed most of the page's actual prose, since the interactive sections render their detail copy from JavaScript data objects rather than markup.

**Pass 1 — static HTML sections** (`content/homepage.json` schema keys, read via line-ranged reads of `reference/live-homepage/index.html`):
- hero (line 2338), clients (2355), problems shell (2387), os shell (2419), agents shell (2439), work (2486), labs (2562), insights (2582), faqs (2655), convert (2674), footer (2690)

**Pass 2 — JS data-object copy** (same file, merged into the matching homepage.json nodes):
- `PROBLEMS_RR` (line 2807) — per-problem quote/attrib/tells/signal/bridge, merged into `problems.items[]`
- `PROBLEM_FLOWS` (line 2892) — per-problem job/layer/stages, merged into `os.flows[]`
- `AGENTS` (line 2969) + `CAT_LABELS` (line 3036) — 13 agents and the 4 category labels, written to `agents.items[]` / `agents.categories`
- `CASES` (line 3156) — per-case challenge/approach/results/agents, merged into `work.cases[]`
- `CASE_IMG` (line 3151) — image data URIs only, not copy, skipped entirely

The `problems`, `os`, and `agents` sections in particular carry almost none of their real copy in static markup — their tab shells are populated at runtime from `PROBLEMS_RR`, `PROBLEM_FLOWS`, and `AGENTS`/`CAT_LABELS` respectively. The `work` section is the inverse case: its teaser copy (`c-summary`) lives only in static HTML, while the full challenge/approach/results detail lives only in `CASES` — both were captured as separate, independently-authored fields per case (never one synthesized from the other).

## Cross-check

Compared against `~/Creative-Projects/intercept-website-staging/home.html`. Prose across all 10 sections is byte-identical between live and staging. Differences are limited to:
- Analytics and form-wiring script differences (out of scope for content)
- A canonical `<link>` tag present only on staging
- Richer, out-of-scope nav/footer link sets on staging (additional trust/legal pages not part of this project)
- The 3 ChatB2B insights episodes' per-episode outbound links (live points every "Listen On" link at the generic show page; staging carries the precise per-episode Spotify/Apple/YouTube URLs)

## Resolved discrepancy: insights episode hrefs

**Decision (locked):** insights episode copy uses LIVE prose, but the outbound `links` and `tile_href` hrefs use STAGING's per-episode URLs. Hrefs are not governed by the verbatim-copy-is-immutable rule (that rule protects words a visitor reads, not link destinations); staging's per-episode links are the more precise, superseding URLs and were adopted for all three episodes:

- Episode 19 (Patrick Vuong): Spotify https://open.spotify.com/episode/0vnMR61WLUmS94YUeNRTby · Apple https://podcasts.apple.com/us/podcast/building-the-backend-for-ai-agents-with-patrick-vuong/id1840415344?i=1000770795263 · YouTube https://www.youtube.com/watch?v=t3xY3tqU9YI
- Episode 18 (Jaynie Miller): Spotify https://open.spotify.com/episode/1vD0gtTpZppIt61dcVH56r · Apple https://podcasts.apple.com/us/podcast/the-rise-of-the-senior-ic-in-the-ai-era-with-jaynie-miller/id1840415344?i=1000768597543 · YouTube https://www.youtube.com/watch?v=uDJIwLfLeBA
- Episode 17 (Megan Cabrera / Sophos): Spotify https://open.spotify.com/episode/63Cj9IIK1SYCgCS3BBdAtv · Apple https://podcasts.apple.com/us/podcast/optimizing-ai-search-lessons-from-sophos-with-megan/id1840415344?i=1000762801591 · YouTube https://www.youtube.com/watch?v=jIv_AFVh-Rc

## Freeze declaration

This content is FROZEN as of 2026-07-23. Any change to `content/homepage.json` or `content/subpages.json` requires Jon's explicit OK.
