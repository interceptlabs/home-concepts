---
phase: 01-content-foundation-shared-brand-layer
plan: 01
subsystem: content
tags: [json, content-model, provenance, copy-immutable]

# Dependency graph
requires: []
provides:
  - "content/homepage.json — canonical verbatim homepage copy (12 top-level keys: meta, hero, clients, problems, os, agents, work, labs, insights, faqs, convert, footer), frozen"
  - "content/subpages.json — derived 6-topic sub-page content model with resolvable dot-path refs into homepage.json"
  - "content/SOURCE.md — provenance note (source, extraction method, cross-check, insights-href decision, freeze declaration)"
affects: [02-concept-a-editorial, 03-concept-b-video, 04-concept-c-webgl]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Single source-of-truth content model: all concepts route through content/homepage.json + content/subpages.json, never re-transcribing copy"
    - "Dot-path content refs (e.g. work.cases.0.challenge) resolved against homepage.json, validated by a resolver walk over subpages.json"
    - "Separate teaser vs. full-depth fields per case study (c-summary vs. CASES challenge/approach/results) — never synthesized from one another"

key-files:
  created:
    - content/homepage.json
    - content/subpages.json
    - content/SOURCE.md
  modified: []

key-decisions:
  - "Insights episode copy uses LIVE prose but STAGING's per-episode Spotify/Apple/YouTube hrefs (locked decision — hrefs aren't governed by copy-immutability; staging's per-episode links are more precise than live's generic show-page links)"
  - "FAQ #3 (What is Intercept Labs?) carries both a plain-text 'a' field and an 'a_html' field, since its answer contains a functional inline link (<a href=\"#labs\">Read more.</a>) that the fixed {q,a} schema doesn't otherwise accommodate"
  - "labs.label and insights episode 'episode'/'show' fields split single compound source strings (e.g. 'Episode 19 · ChatB2B') into separate schema fields — structural recombination only, no words changed or invented"
  - "work topic gets 3 dedicated per-case sub-pages (not folded into a single work index) given the copy volume of challenge/approach/results/agents per case"
  - "labs and insights topics marked teaser_only with fabrication_note — no deeper copy exists in the source for either, and none may be invented downstream"

patterns-established:
  - "Verbatim transcription with _html suffix convention for fields carrying inline emphasis markup (h1_html, h2_html); all other fields are plain text with HTML entities decoded to literal characters"

requirements-completed: [FOUND-01, FOUND-02]

# Metrics
duration: 20min
completed: 2026-07-23
---

# Phase 1 Plan 1: Content Foundation Summary

**Canonical verbatim homepage content (13 agents, 4 problems, 4 InterceptOS flows, 3 case studies, 11 FAQs, 3 podcast episodes) transcribed into content/homepage.json, with a derived 6-topic sub-page routing model in content/subpages.json — both frozen per content/SOURCE.md.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-07-23T18:16:00Z (approx.)
- **Completed:** 2026-07-23T18:37:28Z
- **Tasks:** 3 completed
- **Files modified:** 3 (all newly created)

## Accomplishments

- Transcribed all 10 homepage sections + footer verbatim from `reference/live-homepage/index.html`, entities decoded to literal characters (’, ·, ×, &, →)
- Merged the five JS data-object copy sources (`PROBLEMS_RR`, `PROBLEM_FLOWS`, `AGENTS`/`CAT_LABELS`, `CASES`) into the matching homepage.json nodes — this is where most of the page's actual prose lives, since `problems`, `os`, and `agents` render their detail at runtime from these objects rather than static markup
- Preserved case-study teaser (`c-summary`, static HTML) and full detail (`challenge`/`approach`/`results`, JS `CASES`) as independently-authored, never-synthesized fields for all 3 cases
- Resolved the insights-episode-hrefs cross-check discrepancy: live prose + staging's precise per-episode Spotify/Apple/YouTube links (locked decision, documented in SOURCE.md)
- Built `content/subpages.json`: 6 topics (problems, interceptos, work, labs, insights, contact), every dot-path ref verified to resolve into `homepage.json`; labs/insights flagged `teaser_only` with fabrication notes; work carries 3 per-case page entries

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract static-HTML sections into content/homepage.json** - `5f788d6` (feat)
2. **Task 2: Merge JS-object copy and write content/SOURCE.md** - `b0d7bda` (feat)
3. **Task 3: Build the derived sub-page content model (content/subpages.json)** - `821c69b` (feat)

**Plan metadata:** (this commit, following)

## Files Created/Modified

- `content/homepage.json` - Canonical verbatim homepage copy, all 12 schema keys, frozen
- `content/subpages.json` - 6-topic sub-page routing model with resolvable content refs
- `content/SOURCE.md` - Provenance: source, extraction method, cross-check, href decision, freeze declaration

## Decisions Made

- Insights episodes: live prose + staging per-episode hrefs (see key-decisions above and content/SOURCE.md for the six locked URLs)
- FAQ #3 gets a companion `a_html` field to preserve its inline `<a href="#labs">Read more.</a>` link without breaking the fixed `{q,a}` schema used by the other 10 FAQs
- Compound source strings (episode tile label, labs lockup) split into separate structured fields where the schema calls for it — no prose was altered or invented in doing so
- Work topic gets 3 dedicated case-study sub-pages rather than one shared work index, given the depth of challenge/approach/results/agents copy per case
- Labs and insights sub-page topics marked `teaser_only`: labs has no copy beyond its homepage teaser; insights already shows full episode copy on the homepage, so its sub-page is a layout change only

## Deviations from Plan

None — plan executed exactly as written. All three tasks' automated verification blocks passed on first attempt, plus the additional verbatim spot-checks (static HTML, JS-object, FAQ answer) all confirmed matches in the source file.

## Issues Encountered

None. One incidental note (not a deviation, no action needed): the static HTML case-study heading for `sap-video` reads "...multilingual videos at scale" while the JS `CASES.name` field for the same case reads "...multilingual video at scale" (singular). Per the plan's field ownership rules, `work.cases[].name` is sourced from the static HTML heading only (Task 2 doesn't touch it), so this pre-existing single-word discrepancy in the live site's own source material doesn't affect homepage.json — it's simply not surfaced as a separate field.

## Next Phase Readiness

- `content/homepage.json` and `content/subpages.json` are frozen and ready for Phases 2-4 (Concepts A/B/C) to build against as their single shared content source
- No blockers for downstream phases from this plan
- Sibling wave-1 plan 01-02 (Shared Brand Layer Mirror) already completed in parallel; wave-2 plans 01-03/01-04 remain

---
*Phase: 01-content-foundation-shared-brand-layer*
*Completed: 2026-07-23*

## Self-Check: PASSED

All claimed files and commits verified present:
- content/homepage.json — FOUND
- content/subpages.json — FOUND
- content/SOURCE.md — FOUND
- .planning/phases/01-content-foundation-shared-brand-layer/01-01-SUMMARY.md — FOUND
- Commit 5f788d6 — FOUND
- Commit b0d7bda — FOUND
- Commit 821c69b — FOUND
