# Phase 5: Cross-Concept QA & Review Packaging - Context

**Gathered:** 2026-07-24 (auto mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

The gate before Jon sees anything: cross-concept brand + copy verification and the final side-by-side review gallery. Requirements QA-01..04. No new concept features.

</domain>

<decisions>
## Implementation Decisions

### Fritz brand QA (QA-01) — split responsibility
- The ORCHESTRATOR (not a gsd-executor) spawns the **Fritz brand agent** to review all three concepts against the Fritz Brand OS: it reads the concept pages + representative captures and returns a findings report, committed to the phase dir as `05-FRITZ-QA.md`. Any violations become fix tasks before the phase completes.
- The mechanical layer still runs first (executor): the 8-grep brand suite per concept + cross-concept token drift check (each concept's CSS uses only var() tokens from shared/tokens.css; no local hex redefinitions of brand hues).

### Copy-diff (QA-02)
- One run of `python3 qa/copy-diff.py --all concept-a concept-b concept-c` (or equivalent per-concept invocations) — must exit 0 across all 14 pages (A: 6, B: 4, C: 4). Record chunk totals in the phase SUMMARY (expected 430 + 340 + 282).

### Responsive + sub-page proof (QA-03)
- Verify from existing evidence + fresh spot-checks: each concept has ≥2-3 working derived sub-pages (A: 5, B: 3, C: 3 — already true; link-integrity re-run cross-concept), responsive captures exist at 390/768/1440 for each concept's homepage, no horizontal overflow.
- LCP sanity: gallery + three homepages served locally; check poster/hero load path (no render-blocking regressions). Lightweight — full Lighthouse is out of scope for a local prototype review.

### Review gallery (QA-04)
- Rebuild root `index.html` as the final review surface: dark Fritz page, lockup, three concept cards side-by-side, each with:
  - A real screenshot thumbnail (copy the best 1440 homepage capture per concept into `assets/gallery/`)
  - Concept name + one-line wayfinding description (gallery chrome is meta-UI wayfinding text, NOT site copy — the copy-immutability rule governs site content; keep gallery text minimal and factual)
  - A "what to try" hint list (3 bullets max per concept: e.g. A "click a work card", B "click a hotspot label", C "scroll through the field")
  - Link to the concept homepage
- Gallery obeys every Fritz rule (no rule lines, Flarepop-only colored text, static lockup, no banned tagline) and is itself part of the Fritz agent's review scope.
- Footer note with serve instructions (`./serve.sh` → http://localhost:4340/).

### Completion
- Phase completes only when: mechanical gates green across all 14 pages + gallery, Fritz agent findings resolved (or explicitly accepted as noted-for-Jon), captures embedded, and the milestone summary written for Jon's review.

### Claude's Discretion
- Gallery layout details within Fritz rules; which capture per concept is the thumbnail
- How to present the Fritz findings report structure

</decisions>

<specifics>
## Specific Ideas

- Jon: "use /fritz too" — this phase is where Fritz signs off. The Fritz agent's canon: Figma kit `kBo4gZ2BvhqHCtqTVkBbYq` SSoT, triangles apex-up, mark never decoration, Flarepop-only colored text, hard-step gradients, NO rule lines, banned tagline, static centered lockup, sine easing.
- The deliverable is a side-by-side review for Jon at http://localhost:4340/ — one page that lets him open all three concepts and compare.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- All three concepts complete + verified; captures in each phase dir's captures/
- `qa/copy-diff.py`, `qa/camera-framing-check.mjs`, the 8-grep suite idiom, link-integrity script idioms in phase SUMMARYs
- Root `index.html` = Phase 1 placeholder gallery to be replaced; `serve.sh` :4340

### Established Patterns
- Puppeteer + installed Chrome + setViewport capture rig
- Atomic commits per task; SUMMARY/STATE/ROADMAP updates with known gsd-tools hand-correction quirks

### Integration Points
- Gallery links to /concept-a/, /concept-b/, /concept-c/
- This phase touches ONLY root index.html, assets/gallery/, qa docs — never concept internals except for approved Fritz fixes

</code_context>

<deferred>
## Deferred Ideas

- Deploy/staging (Jon-gated, intercept-deploy MCP only)
- Lighthouse/perf-lab pass (ENH-05)

</deferred>

---

*Phase: 05-cross-concept-qa-review-packaging*
*Context gathered: 2026-07-24*
