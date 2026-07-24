---
phase: 05-concept-d-home-variant
plan: 01
subsystem: ui
tags: [static-html, css, javascript, copy-verification, verbatim-port, concept-d]

# Dependency graph
requires: []
provides:
  - "concept-d/assets/css/deployed.css — 7 of 8 staging style blocks, verbatim, original cascade order (.hero__video block excluded)"
  - "concept-d/assets/js/deployed.js — MAIN (PROBLEMS_RR/PROBLEM_FLOWS/AGENTS/CAT_LABELS/CASE_IMG/CASES), fritz-bg canvas engine, theme-toggle, logo hover-glitch, verbatim minus the 2 permitted edits"
  - "3 case-study PNGs extracted byte-identical from staging's inline base64"
  - "qa/concept-d-script-diff.py — mutation-tested, committed gate proving the ported JS-object copy is byte-identical to staging"
  - "concept-d/{about,insights-hub,chatb2b}.html — mirrored verbatim from staging, only hrefs rewritten"
  - "concept-d/assets/podcast/{chatb2b-trailer.mp4,chatb2b-trailer-poster.jpg} for the mirrored pages' existing relative src"
provides_summary: "Shared deployed.css/deployed.js foundation, byte-identical case images, a committed script-diff verification gate, and the 3 mirrored staging pages — everything Plans 05-02/05-03 build on"
affects: [05-02-card-modal-shell, 05-03-standalone-pages, 06-cross-concept-qa]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Verbatim multi-block CSS/JS porting: concatenate ALL revision-round style blocks in original file order (never cherry-pick per-module rules) to preserve cascade correctness across Jon-feedback rounds"
    - "Brace-counting const-object scanner (quote-state aware for '/\"/`) as a mechanical compensating gate for copy that lives only inside JS string literals, invisible to static-HTML copy-diff"

key-files:
  created:
    - concept-d/assets/css/deployed.css
    - concept-d/assets/js/deployed.js
    - concept-d/assets/img/case-hp-abx.png
    - concept-d/assets/img/case-intel-abm.png
    - concept-d/assets/img/case-sap-video.png
    - qa/concept-d-script-diff.py
    - concept-d/about.html
    - concept-d/insights-hub.html
    - concept-d/chatb2b.html
    - concept-d/assets/podcast/chatb2b-trailer.mp4
    - concept-d/assets/podcast/chatb2b-trailer-poster.jpg
  modified: []

key-decisions:
  - "Extraction used a one-off, uncommitted Python script (scratchpad) rather than hand-copying ~2700 lines of CSS/JS + ~1.4MB of image data — reconstruction-diffed byte-for-byte against the two categorized script/style block sets to prove zero incidental drift beyond the 2 permitted edits"
  - "Task 1's own verify block contains a false-positive-prone check (blanket `grep ig_theme`) that cannot distinguish the excluded head theme-flash-prevention one-liner from the theme-toggle IIFE's own `localStorage.setItem('ig_theme', next)` persistence call, which the interfaces block explicitly locks as 'kept verbatim' — resolved by porting the theme-toggle verbatim (correct behavior) and substituting a precise verification (absence of the head script's distinguishing `localStorage.getItem('ig_theme')` substring) for the overly-broad literal check"
  - "Found and excluded a 9th, unrelated <style> match: an empty `<style type=\"text/css\"></style>` tag embedded inside the inline BMC client-logo SVG artwork (Clients strip markup, not the page-level stylesheet) — filtered by non-empty content before the 8-block assert, since it carries zero characters and sits well outside the documented style-block line ranges"

requirements-completed: [COND-05, COND-06]

# Metrics
duration: 28min
completed: 2026-07-24
---

# Phase 5 Plan 01: Deployed Foundation Port Summary

**Ported the entire staging homepage's style/script content into shared `deployed.css`/`deployed.js` verbatim (7 of 8 style blocks, 4 of 7 script blocks, 2 permitted edits only), extracted 3 case-study PNGs byte-identical from inline base64, built and mutation-tested a script-diff gate proving the JS-object copy is byte-identical to source, and mirrored the 3 staging sibling pages with a 5-pattern href rewrite.**

## Performance

- **Duration:** 28 min
- **Tasks:** 3
- **Files created:** 11

## Accomplishments
- `concept-d/assets/css/deployed.css` reproduces the staging stylesheet's cascade order exactly (7 of 8 `<style>` blocks concatenated in original order; only the `.hero__video`-specific block dropped), preserving every Jon-feedback revision override (`.solve*`, `.agent-card-v6`, `.case-v6`, `.prob-flow-head`, `.labs*`, `.ep-tile*` all carry their LAST-in-file-order definition)
- `concept-d/assets/js/deployed.js` carries the MAIN block (`PROBLEMS_RR`/`PROBLEM_FLOWS`/`AGENTS`/`CAT_LABELS`/`CASE_IMG`/`CASES` + all render/drawer functions), the fritz-bg canvas IIFE, the theme-toggle IIFE, and the logo hover-glitch IIFE — verbatim except the 2 explicitly permitted edits
- 3 case-study images (`case-hp-abx.png`, `case-intel-abm.png`, `case-sap-video.png`) decoded from staging's inline base64 and byte-verified identical; `CASE_IMG` rewritten to point at `/concept-d/assets/img/...` paths
- The nav/footer Contact-click JS hijack (`navContactBtn`/`footContactBtn` → `openConvo()`) deleted so Contact becomes a plain navigation link, per COND-05 — `agentContactBtn`/`caseContactBtn` wiring left untouched
- `qa/concept-d-script-diff.py` — a committed, mutation-tested gate that brace-counts and byte-compares all 5 data objects between staging and deployed.js, byte-verifies the 3 case images against decoded staging base64, and asserts the 4 required exclusions
- `about.html`, `insights-hub.html`, `chatb2b.html` mirrored verbatim into `concept-d/` root with exactly the 5-pattern href rewrite applied (verified byte-identical to staging via a sed-neutralized diff) plus the podcast trailer/poster assets they depend on

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract deployed.css + deployed.js + case images from staging home.html** - `ef2a6b5` (feat)
2. **Task 2: Committed script-diff gate proving JS-object copy is byte-identical to source** - `9414474` (test)
3. **Task 3: Mirror about/insights-hub/chatb2b + podcast assets with the 5-pattern href rewrite** - `437b464` (feat)

## Files Created/Modified
- `concept-d/assets/css/deployed.css` - 7 of 8 staging style blocks, verbatim, original order (2111 lines)
- `concept-d/assets/js/deployed.js` - 4 staging script blocks, verbatim minus 2 permitted edits (589 lines)
- `concept-d/assets/img/case-hp-abx.png`, `case-intel-abm.png`, `case-sap-video.png` - decoded from staging's inline `CASE_IMG` base64
- `qa/concept-d-script-diff.py` - brace-counting byte-compare gate for the JS-templated copy
- `concept-d/about.html`, `concept-d/insights-hub.html`, `concept-d/chatb2b.html` - mirrored staging pages, hrefs rewritten
- `concept-d/assets/podcast/chatb2b-trailer.mp4`, `chatb2b-trailer-poster.jpg` - copied for the mirrored pages' relative src

## Decisions Made

- **Verbatim-port-via-script, not hand-transcription:** a one-off Python extraction script (scratchpad, not committed — same pattern proven in 02-01/03-02) split staging `home.html`'s `<style>`/`<script>` blocks by content marker, applied only the 2 permitted edits, and wrote the results directly. A second, independent reconstruction pass re-derived the expected `deployed.css`/`deployed.js` content from the categorized staging blocks and byte-compared it against what was written to disk — both matched exactly (66,675 / 39,556 chars), proving zero incidental drift.
- **The `ig_theme` false-positive:** Task 1's own verify block includes `! grep -q 'ig_theme' concept-d/assets/js/deployed.js`, but the theme-toggle IIFE (interfaces-locked as "kept verbatim") itself calls `localStorage.setItem('ig_theme', next)` to persist the user's manual light/dark choice — a different call from the excluded head one-liner (`localStorage.getItem('ig_theme')`, which reads the flag before first paint to avoid a theme flash, and is intentionally NOT ported here per the interfaces block; Plans 05-02/05-03 inline it directly in each page's `<head>`). Porting the toggle verbatim (correct, required behavior) means the literal grep check reports a false positive. Resolved by keeping the sacrosanct verbatim port intact and substituting the precise check (absence of the head script's own distinguishing substring, `localStorage.getItem('ig_theme')`) — confirmed absent.
- **The 9th `<style>` match:** the raw regex scan of staging `home.html` initially found 9 `<style>` tags, not the interfaces' documented 8. The extra one is an empty `<style type="text/css"></style>` tag embedded inside the inline BMC client-logo SVG artwork within the Clients strip's markup (line ~2375, well outside the documented 25–2138 stylesheet range) — it carries zero content and is unrelated to the page-level stylesheet. Filtered out by dropping empty-content matches before the 8-block assert; the 8 non-empty matches matched the interfaces block exactly.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Task 1's own verify block's `ig_theme` exclusion check is a false positive against a locked-verbatim requirement**
- **Found during:** Task 1 (extracting deployed.js)
- **Issue:** The plan's automated verify command asserts `! grep -q 'ig_theme' concept-d/assets/js/deployed.js`, intending to confirm the excluded head theme-flash-prevention script wasn't ported. But the theme-toggle IIFE — a DIFFERENT script, explicitly documented in the plan's own interfaces block as "PORT (block 3) — locked call: theme toggle kept verbatim" — independently contains the substring `ig_theme` via its own `localStorage.setItem('ig_theme', next)` persistence call. A blanket substring grep cannot distinguish the two scripts that happen to share a localStorage key name.
- **Fix:** Ported the theme-toggle IIFE verbatim as locked (no edit to the sacrosanct source). Ran the plan's literal verify command to document the expected false-positive, then performed the precise, meaningful check instead: confirmed `localStorage.getItem('ig_theme')` (the head script's own distinguishing marker) is absent from deployed.js, while `localStorage.setItem('ig_theme'` (the toggle's own write) is present, as required.
- **Files modified:** None beyond the Task 1 port itself (concept-d/assets/js/deployed.js) — no code was changed to satisfy this check; the check's own limitation was documented instead.
- **Verification:** Ran both the literal plan command (documented, expected non-zero) and the corrected precise substring checks (both pass); `qa/concept-d-script-diff.py`'s own exclusion asserts (Task 2) do not include this ambiguous check and pass cleanly.
- **Committed in:** ef2a6b5 (Task 1 commit)

**2. [Rule 1 - Bug] Regex-scanned 9 `<style>` tags in staging home.html, not the documented 8**
- **Found during:** Task 1 (style block extraction)
- **Issue:** A raw `<style>...</style>` regex scan over the whole staging file found 9 matches, one more than the interfaces block's verified count of 8. The 9th is an empty `<style type="text/css"></style>` tag nested inside the inline BMC client-logo SVG artwork in the Clients strip markup — unrelated to the page-level stylesheet, and outside the documented 25–2138 line range.
- **Fix:** Filtered out empty-content `<style>` matches before asserting the block count, since none of the 8 real stylesheet blocks are empty. The remaining 8 matched the interfaces block's line ranges and content exactly.
- **Files modified:** None (extraction-script-only adjustment; no change to ported output).
- **Verification:** Post-filter count == 8; 7 kept after the `.hero__video` exclusion; reconstruction-diff against the written `deployed.css` matched byte-for-byte.
- **Committed in:** ef2a6b5 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1 - verification-methodology bugs found in the plan itself, not in the ported code). **Impact:** Zero impact on the sacrosanct verbatim port — both deviations are about correcting how a check was performed, not about changing any ported CSS/JS/markup beyond the plan's 2 explicitly permitted edits (CASE_IMG paths, nav/footer hijack deletion) and the 5-pattern href rewrite (Task 3).

## Issues Encountered
None beyond the two documented deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `concept-d/assets/css/deployed.css` and `concept-d/assets/js/deployed.js` are ready for Plans 05-02 (card/modal shell) and 05-03 (standalone pages) to reference without re-deriving anything from staging
- `qa/concept-d-script-diff.py` will run in every subsequent plan's verification and again in Phase 6
- `about.html`, `insights-hub.html`, `chatb2b.html` are live and serving at `concept-d/` root; their 6 insights-article hrefs (insights-hub.html) and 3 legal-page hrefs (all 3 files' footers) are known, documented dead links out of this phase's scope — will 404, matching staging's own pre-existing behavior (not a concept-d regression)
- No blockers for 05-02/05-03

---
*Phase: 05-concept-d-home-variant*
*Completed: 2026-07-24*

## Self-Check: PASSED

All 11 created files verified present on disk (`[ -f ]`); all 3 task commits (`ef2a6b5`, `9414474`, `437b464`) verified present in `git log --oneline --all`.
