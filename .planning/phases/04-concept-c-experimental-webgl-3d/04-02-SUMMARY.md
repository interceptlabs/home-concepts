---
phase: 04-concept-c-experimental-webgl-3d
plan: 02
subsystem: ui
tags: [html, css, copy-diff, view-transitions, static-site]

# Dependency graph
requires:
  - phase: 04-concept-c-experimental-webgl-3d
    provides: "04-01's concept-c/index.html shell, mode-gated concept-c.css, scene.js topic-field scene, and the locked topic-label routing map"
  - phase: 01-shared-foundation
    provides: shared/tokens.css, shared/motion.css, shared/logo lockup markup, content/homepage.json
provides:
  - "concept-c/index.html below-fold sections filled: #problems teaser, #labs teaser, #convert non-link tile, footer"
  - "concept-c/pages/interceptos.html — full InterceptOS sub-page (4 flows x 4 stages + 13-agent roster)"
  - "concept-c/pages/work.html — consolidated 3-case work sub-page"
  - "concept-c/pages/insights.html — NEW layout-only 3-episode index with real external links"
  - "concept-c.css .subpage scaffold (page-header/page-hero/os-flows/agent-roster/work-page/insights-page) + reduced-motion-safe smooth scroll"
affects: ["04-03"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "One-off uncommitted Python generator reads content/homepage.json directly and writes finished HTML + CSS to disk, so rendered text and its data-copy dot-path are derived together — eliminates retype/paraphrase drift by construction (same technique as 02-01/02-02/03-02)"
    - "Empty content-model arrays (os.flows[i].stages[3].agents === []) are iterated as real (empty) arrays, never guarded by a key-existence check — the key is always present; an empty array simply renders zero child elements"
    - "Non-link conversion tile (convert.cta.href has no real prototype target) and CTA-href-rewrite-to-real-anchor (labs.cta.href literal #pitchLabs never rendered, always rewritten to #convert) both reused verbatim from 03-02's precedent"

key-files:
  created:
    - concept-c/pages/interceptos.html
    - concept-c/pages/work.html
    - concept-c/pages/insights.html
  modified:
    - concept-c/index.html
    - concept-c/assets/css/concept-c.css

key-decisions:
  - "Footer placed as a sibling of <main class=\"below-fold\"> (not nested inside it, keeping <footer> outside <main> semantically) but given its own position:relative/z-index:1/background:var(--page) rule, so it still opaquely occludes the fixed WebGL canvas exactly like the below-fold sections do"
  - "Sub-page CSS scaffold added as a plain top-level layer (page-header, page-hero, os-flows, agent-roster, work-page, insights-page, episode-block) rather than literally reusing concept-b's class names' behavior — same idiom, independently authored, per the architecture rule that concepts never reach into each other's directories"
  - "Kept sub-page stat numerals and stage/solves chips neutral (fg-2/fg-3, no new flarepop text) rather than mirroring concept-b's flarepop-colored solves chips — stays conservative against the single-sentence brand rule (\"no colored text beyond any Flarepop accents already licensed\") since concept-c's own homepage only licenses .hl in the labs h2"

requirements-completed: [CONC-01, CONC-02]

# Metrics
duration: 20min
completed: 2026-07-24
---

# Phase 4 Plan 2: Concept C content layer — below-fold sections + 3 sub-pages Summary

**Below-fold homepage sections (problems/labs/convert teasers + footer) and three derived sub-pages (interceptos.html, work.html, insights.html) generated verbatim from content/homepage.json via a data-driven Python script, wiring every topic-label destination to a real page or anchor with zero dead ends.**

## Performance

- **Duration:** 20 min
- **Started:** 2026-07-24T17:43:51Z (approx., immediately following 04-01)
- **Completed:** 2026-07-24T17:55:10Z
- **Tasks:** 2 completed
- **Files modified:** 5 (2 modified — index.html, concept-c.css; 3 created — interceptos.html, work.html, insights.html)

## Accomplishments
- Filled all three below-fold homepage sections plus the footer, completing CONC-01's "3D stays in the hero zone, everything below is standard opaque DOM" contract
- Built all three sub-pages the topic-label routing map already pointed at (previously expected 404s from 04-01 are now resolved), completing CONC-02's "every hotspot label routes somewhere real"
- 282 data-copy chunks verified verbatim across all 4 concept-c pages on the first copy-diff run (36 on index.html alone, 173/43/30 on the three sub-pages against required minimums of 150/40/25)
- Correctly rendered `os.flows[i].stages[3].agents` (the "Outcome" stage in every one of the 4 flows) as its real, present, empty array — zero `<li>` children, no key-existence guard — per this plan's explicit data-trap correction

## Task Commits

1. **Task 1: Below-fold homepage sections + footer + routing/transition CSS** - `56f004d` (feat)
2. **Task 2: Three sub-pages — interceptos.html, work.html (consolidated), insights.html (new)** - `5058566` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified
- `concept-c/index.html` - #problems teaser grid, #labs teaser with the one permitted `.hl` accent, #convert non-link tile, footer with real site_links routing
- `concept-c/pages/interceptos.html` - full InterceptOS depth: os framing, all 4 flows x 4-stage grids, full 13-agent roster grouped by 4 categories
- `concept-c/pages/work.html` - all 3 cases consolidated at full depth (challenge/approach/results/agents)
- `concept-c/pages/insights.html` - NEW layout-only 3-episode index with real Spotify/Apple/YouTube links
- `concept-c/assets/css/concept-c.css` - below-fold typography + footer rules, reduced-motion-safe `scroll-behavior: smooth`, and a `.subpage` scaffold shared by all 3 sub-pages

## Decisions Made
- Footer kept as a `<footer>` sibling of `<main>` (semantically correct, not nested) while still getting `.below-fold`-equivalent opaque z-index treatment via its own `.site-footer` rule
- Sub-page CSS scaffold independently authored (not copy-pasted from concept-b) per the architecture rule that concepts consume only `shared/`/`content/`, never each other
- Sub-page stat/chip accents kept neutral rather than reusing concept-b's flarepop-colored chips, staying conservative against the "Flarepop is the ONLY colored text" rule within concept-c's own already-licensed accent (`.hl` in the labs h2)

## Deviations from Plan

None - plan executed exactly as written. The one thing that looked like a deviation candidate — the interfaces note's claim that `os.flows[i].stages[3]` "has NO .agents key" — was pre-corrected by the task prompt's own data-trap heads-up (the key is present as an empty array), so the generator script was written correctly from the start with a plain loop and no guard; no fix was needed mid-task.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- 04-03 (motion/a11y polish + device-tier QA sweep) can now run its full capture suite against 4 complete pages instead of 1 — its own `must_haves` already expect `copy-diff --all concept-c` to pass and every href/anchor to resolve, both true as of this plan
- No blockers carried forward

## Self-Check: PASSED

- FOUND: concept-c/index.html
- FOUND: concept-c/pages/interceptos.html
- FOUND: concept-c/pages/work.html
- FOUND: concept-c/pages/insights.html
- FOUND: concept-c/assets/css/concept-c.css
- FOUND commit: 56f004d (Task 1)
- FOUND commit: 5058566 (Task 2)

---
*Phase: 04-concept-c-experimental-webgl-3d*
*Completed: 2026-07-24*
