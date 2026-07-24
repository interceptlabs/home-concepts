---
phase: 02-concept-a-editorial-accenture-but-better
plan: 02
subsystem: ui
tags: [static-html, data-copy, view-transitions, link-integrity, editorial, fritz-tokens]

# Dependency graph
requires:
  - phase: 02-concept-a-editorial-accenture-but-better
    provides: "02-01's concept-a/index.html (dangling hrefs + anchor ids) and concept-a.css (dark editorial foundation, @view-transition opt-in)"
provides:
  - 5 derived sub-pages in concept-a/pages/ (interceptos, insights, 3 work cases) at full verbatim copy depth
  - concept-a.css "— sub-pages —" block: page-hero, os-flows/os-stage, agent-roster/agent-card, insights-index, case-hero/case-story layouts
  - Mechanically proven routing map: every internal href + fragment across all 6 concept-a pages resolves
affects: [02-03-motion-and-qa, 05-cross-concept-comparison]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "One-off Python generator script (scratchpad-only, not committed) reads content/homepage.json directly and interpolates every string + its data-copy dot-path programmatically (loops over JSON arrays, not hand-copied text) — eliminated transcription risk entirely rather than merely reducing it, and made the agent/flow/results index math (13 agents, 16 stages, variable agent-per-stage counts, variable results-per-case counts) self-consistent by construction"
    - "Header block copied byte-identical from index.html into all 5 sub-pages per the plan's interfaces contract (absolute /concept-a/... hrefs work unchanged from pages/ subdirectory)"
    - "Structural wayfinding labels (Challenge/Approach/Results/Agents on case pages) rendered as plain unannotated <p> text with a single HTML comment marking them as content-model field names, not brand copy — satisfies the interfaces contract without adding data-copy noise for non-leaf structural labels"
    - "Agent roster grouped by each item's `primary` field into the same 4 category buckets/order established in 02-01 (strategy/content/sales/channel), this time as full-depth cards (name/type/role/desc/solves/sample) instead of chips"

key-files:
  created:
    - concept-a/pages/interceptos.html
    - concept-a/pages/insights.html
    - concept-a/pages/work-hp-abx.html
    - concept-a/pages/work-intel-abm.html
    - concept-a/pages/work-sap-video.html
  modified:
    - concept-a/assets/css/concept-a.css

key-decisions:
  - "InterceptOS flows rendered as a 4-column stage grid per flow (os-stage-list) rather than a horizontal auto-advancing progression, keeping every stage visible without interaction or timers, consistent with the project's no-timed-carousels rule"
  - "Case-page kicker (client + tag) and insights-row kicker (episode + show) both reuse the CSS ::before middot separator pattern already established on index.html's card__kicker, rather than inventing a new separator treatment"
  - "os.lead rendered as plain annotated text on interceptos.html (no anchor), per the interfaces contract that this page is the destination, not a link source, for the 'See how it works.' sentence"

patterns-established:
  - "Sub-page layout primitives (.page-hero, .case-hero/.case-story, .insights-index) added under a single clearly-commented '/* — sub-pages — */' block in concept-a.css, kept separate from the homepage's section-specific classes"

requirements-completed: [CONA-04]

# Metrics
duration: 7min
completed: 2026-07-24
---

# Phase 2 Plan 2: Concept A Derived Sub-Pages Summary

**5 derived sub-pages (interceptos, insights, 3 work cases) built via a data-driven Python generator that interpolates content/homepage.json directly, with a mechanical link-integrity script proving every href and fragment across all 6 concept-a pages resolves.**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-07-24T03:52:00Z (approx., picking up immediately after 02-01)
- **Completed:** 2026-07-24T03:58:30Z
- **Tasks:** 3 (all `type="auto"`, no checkpoints)
- **Files modified:** 6 (5 new HTML pages + concept-a.css)

## Accomplishments
- `interceptos.html`: all 4 flows × 4 stages (16 stages total, 66 `os.flows.N.stages.*` annotations) with per-stage agent lists rendered only where non-empty (Outcome stages correctly render zero agents), plus the complete 13-agent roster grouped into 4 categories with name/type/role/desc/solves/sample all individually annotated (13/13 `sample` chunks present).
- `insights.html`: dedicated episodes index — 3 editorial rows, each with episode/show kicker, title linked to the exact external Spotify URL (`tile_href`), guest name/role, summary, and all 3 listen links (Spotify/Apple/YouTube) with their exact external hrefs preserved.
- 3 work case pages (`work-hp-abx.html`, `work-intel-abm.html`, `work-sap-video.html`): case hero (client/tag kicker, name, summary, metric) + Challenge/Approach/Results/Agents under unannotated structural labels (single HTML comment marking them as content-model field names per the interfaces contract) — results rendered as individually annotated `<li>` items (HP 4, Intel 4, SAP 5, matching the plan's expected counts exactly).
- `qa/copy-diff.py` exits 0 across all 6 concept-a pages combined: 430/430 chunks pass with zero failures on the first generation run (no retries needed) — the data-driven generator (looping over JSON structures rather than hand-copying text) eliminated the project's documented curly-quote/retype drift risk by construction, same technique as 02-01.
- Link-integrity script (every local href + fragment across `concept-a/index.html` + all 5 sub-pages) passed clean on the first run: zero missing targets, zero missing anchors. No routing-map fixes were needed.
- All 6 pages link `/concept-a/assets/css/concept-a.css` (the `@view-transition` carrier); `view-transition-name` appears nowhere in `concept-a/`; brand greps (banned tagline, deprecated hex, `<hr>`) all clean.

## Task Commits

Each task was committed atomically:

1. **Task 1: interceptos.html — the full-depth InterceptOS page** - `9adf087` (feat)
2. **Task 2: insights.html and the 3 work case pages** - `a356a81` (feat)
3. **Task 3: View Transition + routing integrity across all 6 pages** - no commit (verification-only task; all checks passed against the artifacts from Tasks 1-2 with zero fixes required)

## Files Created/Modified
- `concept-a/pages/interceptos.html` (174 data-copy chunks) — full-depth InterceptOS page
- `concept-a/pages/insights.html` (episodes index, external listen links preserved)
- `concept-a/pages/work-hp-abx.html`, `work-intel-abm.html`, `work-sap-video.html` — full case depth (74 combined data-copy chunks across the 4 Task-2 pages)
- `concept-a/assets/css/concept-a.css` — added a `/* — sub-pages — */` block (page-hero, os-flows/os-stage, agent-roster/agent-card, insights-index, case-hero/case-story/case-results); zero raw hex added, consistent with the file's existing no-raw-hex discipline

## Decisions Made
- Used the same one-off Python generator technique as 02-01 (script kept in scratchpad, not committed) — but this time looping over the JSON's own array structures (flows/stages/agents/results/episodes) to derive both the rendered text and its data-copy dot-path together, rather than hand-templating each index. This made the plan's precise per-stage agent counts (3/2/1/0, 1/1/1/0, 1/1/2/0, 1/1/3/0) and per-case results counts (4/4/5) self-consistent by construction instead of requiring manual verification against the spec.
- Rendered the InterceptOS flows as a responsive 4-column stage grid per flow (`.os-stage-list`) rather than a tabbed/stepped horizontal progression, since the plan left the layout to discretion and a static grid keeps all 16 stages visible with zero interaction/timers.
- Reused the existing `::before` middot kicker-separator pattern (already established in 02-01's `card__kicker`) for both the case-hero kicker (client · tag) and the insights-row kicker (episode · show), rather than inventing a new separator treatment.

## Deviations from Plan

None — plan executed exactly as written. Task 3's link-integrity script and all brand/routing greps passed on the first run against the pages built in Tasks 1-2; no anchor fixes, slug corrections, or stylesheet-path fixes were needed.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 6 concept-a pages (homepage + 5 sub-pages) are copy-diff-clean, link-integrity-clean, and share the `@view-transition`-carrying stylesheet with zero `view-transition-name` usage anywhere — plan 02-03 can layer motion (scroll-reveal, hero stagger, hover accents) onto a fully-routed, content-complete page set with no dangling links remaining.
- No blockers or concerns for plan 02-03.

---
*Phase: 02-concept-a-editorial-accenture-but-better*
*Completed: 2026-07-24*

## Self-Check: PASSED

- FOUND: concept-a/pages/interceptos.html
- FOUND: concept-a/pages/insights.html
- FOUND: concept-a/pages/work-hp-abx.html
- FOUND: concept-a/pages/work-intel-abm.html
- FOUND: concept-a/pages/work-sap-video.html
- FOUND: 9adf087 (Task 1 commit)
- FOUND: a356a81 (Task 2 commit)
