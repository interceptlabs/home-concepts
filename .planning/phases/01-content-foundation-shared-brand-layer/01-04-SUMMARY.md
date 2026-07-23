---
phase: 01-content-foundation-shared-brand-layer
plan: 04
subsystem: infra
tags: [static-server, html, css-custom-properties, repo-scaffold]

# Dependency graph
requires:
  - phase: 01-content-foundation-shared-brand-layer (plan 02)
    provides: "shared/tokens.css, shared/fonts.css, shared/motion.css, shared/logo/lockup.svg, shared/README.md binding rules"
provides:
  - "serve.sh — one-command static server on port 4340 serving the repo root"
  - "concept-a/, concept-b/, concept-c/ directories each with index.html placeholder, pages/, assets/"
  - "Root index.html — Fritz-branded review gallery linking all three concepts"
affects: [02-concept-a, 03-concept-b, 04-concept-c, 05-cross-concept-qa]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Concept placeholder pages consume shared/ via root-relative links (/shared/tokens.css → /shared/fonts.css → /shared/motion.css) exactly per shared/README.md order"
    - "Gallery chrome (headings, card copy) authored fresh and explicitly kept out of content/homepage.json so the copy-diff fallback scan (Plan 01-03) stays quiet on this page"
    - "Single python3 -m http.server process on :4340 serves gallery + all three concept directories + shared/ + content/ — one port for everything, matching FOUND-05"

key-files:
  created:
    - serve.sh
    - index.html
    - concept-a/index.html
    - concept-b/index.html
    - concept-c/index.html
    - concept-a/pages/.gitkeep
    - concept-a/assets/.gitkeep
    - concept-b/pages/.gitkeep
    - concept-b/assets/.gitkeep
    - concept-c/pages/.gitkeep
    - concept-c/assets/.gitkeep
  modified: []

key-decisions:
  - "Card status colored accent (var(--flarepop)) is the sole colored text on the gallery page; every other element uses fg/neutral aliases, satisfying the Flarepop-only rule"
  - "Card separation uses surface-color contrast + spacing + hover transform only — no border-bottom accents, no <hr>, no divider lines, per shared/README.md"
  - "Concept placeholders intentionally do NOT reference content/homepage.json strings — chrome-only copy keeps the copy-diff fallback scan quiet until real per-concept builds land in Phases 2-4"

patterns-established:
  - "Any future page consuming the shared layer follows the exact 5-line head block (2 preconnects + 3 stylesheet links in tokens→fonts→motion order) established here and in shared/README.md"

requirements-completed: [FOUND-05]

# Metrics
duration: 15min
completed: 2026-07-23
---

# Phase 1 Plan 4: Repo Skeleton, Preview Server & Review Gallery Summary

**One-command `serve.sh` on port 4340 serving a Fritz-branded root gallery plus three shared-layer-consuming concept placeholders (concept-a/b/c), passing every mechanical brand gate (no banned tagline, no rule lines, no deprecated mark hexes, Flarepop-only color).**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-07-23T18:41:40Z (approx, after prior plan commit)
- **Completed:** 2026-07-23T18:44:14Z
- **Tasks:** 2
- **Files modified:** 11 (all created)

## Accomplishments
- `serve.sh` — executable one-command static server (`python3 -m http.server 4340`) serving the repo root, verified live with a start/curl/kill smoke test
- `concept-a/`, `concept-b/`, `concept-c/` scaffolded with `pages/` + `assets/` dirs and a placeholder `index.html` each, all three proven to load `/shared/tokens.css` over the server
- Fritz-branded root `index.html` gallery: lockup identity header, fresh gallery-chrome copy (not canonical content), three linked concept cards with status chips, hover motion using shared easing tokens
- Both task verify blocks (curl-based smoke tests + mechanical brand greps) pass; overall plan verification block (`serve.sh` foreground reachability + shared asset serving) also confirmed

## Task Commits

Each task was committed atomically:

1. **Task 1: Repo skeleton + serve.sh** - `1e14112` (feat)
2. **Task 2: Fritz-branded review gallery (root index.html)** - `ea498f5` (feat)

**Plan metadata:** (this commit, follows)

## Files Created/Modified
- `serve.sh` - executable server launcher, cds to repo root, serves port 4340
- `index.html` - root review gallery: lockup header, intro copy, 3-card grid linking concept-a/b/c
- `concept-a/index.html` - Editorial placeholder consuming shared layer, links back to `/`
- `concept-b/index.html` - Full-Screen Video placeholder consuming shared layer, links back to `/`
- `concept-c/index.html` - Experimental WebGL/3D placeholder consuming shared layer, links back to `/`
- `concept-{a,b,c}/pages/.gitkeep`, `concept-{a,b,c}/assets/.gitkeep` - directory structure committed ahead of Phase 2-4 builds

## Decisions Made
- Flarepop reserved for the status-chip text only on the gallery card, per shared/README.md's Flarepop-only-colored-text rule
- No `<hr>`/border-accent dividers anywhere; card separation via `var(--surface)` panel contrast + `var(--sp-*)` spacing only
- Placeholder pages deliberately avoid `content/homepage.json` strings to keep the copy-diff fallback scan (Plan 01-03, parallel wave) quiet on non-canonical chrome

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- FOUND-05 satisfied: one static server on :4340 serves the full repo skeleton plus the placeholder review gallery
- Concept directories (`concept-a/`, `concept-b/`, `concept-c/`) are scaffolded and proven to consume the shared brand layer, ready for Phase 2-4 builds to replace placeholder `index.html` content
- Root `index.html` gallery is the same surface that graduates into the Phase 5 side-by-side review page — card hrefs and status chips will need updating as each concept ships
- Phase 1 plan 01-03 (copy-diff QA gate) runs independently in the same wave and does not block this plan's completion

---
*Phase: 01-content-foundation-shared-brand-layer*
*Completed: 2026-07-23*

## Self-Check: PASSED

All 11 created files confirmed present on disk; both task commits (`1e14112`, `ea498f5`) confirmed in git log.
