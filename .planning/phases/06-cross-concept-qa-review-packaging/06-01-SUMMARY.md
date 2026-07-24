---
phase: 06-cross-concept-qa-review-packaging
plan: 01
subsystem: qa
tags: [copy-diff, link-integrity, puppeteer, gallery, fritz-brand, static-html]

requires:
  - phase: 02-concept-a-editorial-accenture-but-better
    provides: concept-a (6 pages, 430 copy-diff chunks, brand-grep clean)
  - phase: 03-concept-b-full-screen-video
    provides: concept-b (4 pages, 340 copy-diff chunks, brand-grep clean)
  - phase: 04-concept-c-experimental-webgl-3d
    provides: concept-c (4 pages, 282 copy-diff chunks, camera-framing-check, brand-grep clean)
  - phase: 05-concept-d-home-variant
    provides: concept-d (index + 4 section pages + 3 mirrored pages, 71 substring chunks, 13 script-diff checks, brand-grep clean)
provides:
  - Full mechanical QA suite run across all four concepts in one consolidated pass, every gate green with expected counts
  - New cross-concept link-integrity checker (scratchpad, stdlib Python) covering root + all 22 concept HTML files
  - Rebuilt root index.html as the final Fritz review gallery — 4 concept cards with real thumbnails, working links, inlined lockup
  - assets/gallery/ with 4 pre-cropped 1440x900 thumbnails
  - 2 honestly-reviewed gallery captures (390/1440)
affects: [06-02, 06-FRITZ-QA]

tech-stack:
  added: []
  patterns:
    - "Cross-concept link-integrity checker: stdlib-only Python, scans root + all concept HTML, resolves relative/absolute/directory/fragment targets, applies a documented allowlist (never a blanket ignore)"
    - "Gallery thumbnails pre-cropped server-side (PIL, top 900px) to exact 16:10 aspect rather than shipping full fullPage captures and relying solely on CSS object-fit:cover"
    - "Inlined lockup SVG (not <img src>) is the only way currentColor wordmark renders correctly on a dark page — same fix pattern as concept-b's 03-03"

key-files:
  created:
    - assets/gallery/concept-a.png
    - assets/gallery/concept-b.png
    - assets/gallery/concept-c.png
    - assets/gallery/concept-d.png
    - .planning/phases/06-cross-concept-qa-review-packaging/captures/gallery-390.png
    - .planning/phases/06-cross-concept-qa-review-packaging/captures/gallery-1440.png
  modified:
    - index.html

key-decisions:
  - "Thumbnails pre-cropped to exactly 1440x900 (top-of-page region, PIL) from each concept's best existing 1440 capture, rather than shipping full fullPage-height PNGs and relying purely on CSS object-fit:cover — guarantees zero further clipping at the card's 16:10 aspect box and keeps gallery asset sizes reasonable (78KB-666KB vs the multi-MB fullPage originals)"
  - "New link-integrity allowlist entry added and documented (interfaces block permits new entries if documented in SUMMARY): concept-d/index.html's 'Browse the full episode archive' link to insights-hub.html#episodes has no matching id=\"episodes\" element in the mirrored/gate-exempt insights-hub.html — verified functionally correct by reading insights-hub.html's own inline script (`if (location.hash === '#episodes' && t) setTimeout(...t.click()...)`), which opens the episode drawer on load. A JS-hash-route pattern the checker's static id= assertion can't see, not a dead link. Read-only finding, zero concept-d files touched."
  - "Gallery card grid inverted from Phase 1's 3-col-default/1-col-mobile to 1-col-default/2-col-at->=900px to accommodate the fourth (Concept D) card while keeping the same dark-Fritz foundation, sine-eased hover, and Flarepop-only status idiom"

patterns-established:
  - "Cross-concept link-integrity checker (scratchpad) is the reusable pattern for any future full-repo link sweep: resolves href/src across relative, /absolute, directory-as-index, and same-file/cross-file fragment targets, with an explicit, documented, non-growing-without-justification allowlist"

requirements-completed: [QA-02, QA-03, QA-04]

duration: 24min
completed: 2026-07-24
---

# Phase 6 Plan 1: Cross-Concept Mechanical QA + Final Review Gallery Summary

**Full mechanical QA suite (copy-diff, script-diff, camera-framing, brand greps, token-drift, video budgets, and a new stdlib cross-concept link-integrity checker) run green across all four concepts, then root `index.html` rebuilt as the final four-card Fritz review gallery with real capture thumbnails and an inlined (not `<img src>`) 8-path lockup.**

## Performance

- **Duration:** 24 min
- **Started:** 2026-07-24T21:45:00Z (approx.)
- **Completed:** 2026-07-24T22:09:35Z
- **Tasks:** 2 completed
- **Files modified:** 7 (index.html + 4 gallery thumbnails + 2 gallery captures)

## Accomplishments

- Every mechanical QA gate across all four concepts (A/B/C/D) passes with counts matching the expected table exactly — zero drift since phase close
- Wrote a new stdlib-only cross-concept link-integrity checker (broader than any prior per-concept script) covering the root gallery + all 22 concept HTML files in one pass
- Rebuilt the root gallery as the final Jon-facing review surface: 4 cards, real thumbnails, working links, inlined lockup that actually renders white on the dark page
- Both gallery captures (390/1440) read and honestly judged — no issues found, no fixes needed

## Task Commits

1. **Task 1: Full mechanical QA suite across all four concepts** — no repo files modified (verification-only; scratchpad script + SUMMARY evidence), no commit
2. **Task 2: Rebuild root index.html as the final Fritz review gallery** — `9b33b5a` (feat)

**Plan metadata:** (this SUMMARY + STATE/ROADMAP commit, see below)

## QA Results Table (Task 1 — verbatim)

| Gate | Command | Result |
|---|---|---|
| Copy A | `python3 qa/copy-diff.py --all concept-a` | **PASS** — 6 pages, 430 chunks, 0 failures |
| Copy B | `python3 qa/copy-diff.py --all concept-b` | **PASS** — 4 pages, 340 chunks, 0 failures |
| Copy C | `python3 qa/copy-diff.py --all concept-c` | **PASS** — 4 pages, 282 chunks, 0 failures |
| Copy D | `python3 qa/copy-diff.py --mode substring concept-d/index.html concept-d/pages/{os,labs,work,contact}.html` | **PASS** — 5 pages, 71 chunks, 0 failures |
| Script D | `python3 qa/concept-d-script-diff.py` | **PASS** — 13 checks, 0 failures |
| Camera C | `node qa/camera-framing-check.mjs` | **PASS** — exit 0; worst sweep clearance 1.212x radius (t=0.92), worst min-angle 23.09° (t=0.87) — both within floors |
| Brand grep — concept-a | 8-check chain (tagline/hex/hr/color/token-var/gradient/view-transition) | **PASS** — exit 0 |
| Brand grep — concept-b | 8-check chain | **PASS** — exit 0 |
| Brand grep — concept-c | 8-check chain (vendor-excluded) | **PASS** — exit 0 |
| Brand grep — concept-d | 8-check chain (new-chrome-only) | **PASS** — exit 0 |
| Concept-c gradient audit | `grep -n 'gradient(' concept-c/assets/css/concept-c.css` | 1 hit: `.field-backdrop`'s `repeating-linear-gradient`, confirmed the licensed 5-step hard-edged stepped utility (duplicated-stop offsets, never a smooth grade) |
| Token drift | cross-concept `--flarepop\|--coolsweep\|...` redefinition grep | **PASS** — exit 0, zero hits across all four concepts' CSS |
| Cross-concept link integrity | new scratchpad checker (root + concept-a/b/c/d, pre-rebuild) | **PASS** — 23 files scanned, 557 links checked, 34 allowlisted, 0 non-allowlisted failures |
| Video budget B | webm+poster ≤ 7,340,032 B; `preload="metadata"`; `fetchpriority="high"` | **PASS** — 5,007,084 B total (4,858,475 + 148,609); both attrs present |
| Video budget D | webm ≤ 4,000,000 B; poster ≤ 200,000 B; `autoplay muted playsinline loop`; webm-before-mp4 | **PASS** — webm 2,287,061 B; poster 94,646 B; attr order correct; source order correct |

**Sub-page inventory (QA-03 evidence, no suites rebuilt):**

| Concept | Sub-pages | Detail |
|---|---|---|
| A | 5 | InterceptOS, Insights, 3 work case pages (hp-abx, intel-abm, sap-video) — click-through verified in 02-03 |
| B | 3 | Problems, InterceptOS, Work — hotspot/panel/continue flow verified in 03-03 |
| C | 3 | InterceptOS, Work, Insights — topic-index-without-WebGL verified in 04-03 |
| D | 4 + 3 mirrored | os/labs/work/contact.html (new standalone pages) + about/insights-hub/chatb2b.html (mirrored, gate-exempt) — 34-assertion nav suite in 05-03 |

**Link-integrity allowlist as run (documented, reproduced exactly + 1 new entry):**

1. Concept-d legal-page links: `ai-policy.html`, `privacy-policy.html`, `terms-of-service.html` (mirrored pages reference real staging pages never ported into this repo)
2. Concept-d un-mirrored insights article hrefs (8 distinct filenames referenced from `insights-hub.html`, e.g. `insights-h1-2026-trends-brief.html`, `insights-the-ai-confidence-gap.html`, etc.) — teaser hub, no standalone article pages built
3. `concept-d/about.html`'s `#main` skip-link — verified pre-existing dead anchor in the staging source itself (`.planning/phases/05-concept-d-home-variant/deferred-items.md`)
4. **NEW, documented this run:** `concept-d/index.html` → `insights-hub.html#episodes` — no `id="episodes"` in the mirrored target; the fragment is consumed by `insights-hub.html`'s own inline script (`if (location.hash === '#episodes' && t) setTimeout(function(){ t.click(); }, 400);`), which opens the episode drawer on load. Verified functionally correct by reading the script — a JS-hash-route pattern the checker's static `id=` assertion structurally can't see, not a broken link.

## Task 2 Details — Gallery Rebuild

**Thumbnail source choices (all per the plan's interfaces block, no substitutions needed):**

| Concept | Source capture | Original size | Cropped to |
|---|---|---|---|
| A | `.planning/phases/02-.../captures/index-1440.png` | 1440×5337 (fullPage) | 1440×900 (top region — hero + intro, matches B/C/D framing) |
| B | `.planning/phases/03-.../captures/index-1440.png` | 1440×900 | 1440×900 (no-op copy) |
| C | `.planning/phases/04-.../captures/index-scene-1440.png` (JS-on scene, per plan) | 1440×900 | 1440×900 (no-op copy) |
| D | `.planning/phases/05-.../captures/index-1440.png` | 1440×2141 | 1440×900 (top region — light hero) |

All four crops read as recognizable, representative first impressions of each concept in the reviewed 1440 gallery capture — no re-crop or capture substitution needed.

**Gallery rebuild:**
- Kept the Phase 1 foundation: `/shared/tokens.css` + `/shared/fonts.css` + `/shared/motion.css`, `var(--page)`/`var(--fg)`, sine-eased hover (`var(--ease-inout-sine)`, `var(--dur-med)`)
- Header: canonical 8-path lockup inlined as SVG markup (verbatim from `shared/logo/lockup.svg`, `id="mark"` preserved), never edited the shared file, never referenced via `<img src>`
- Grid changed from Phase 1's 3-col/1-col to 1-col-default/2-col-at-≥900px to fit the fourth card
- Each card: full-bleed thumbnail (pre-cropped 16:10), mono kicker, h2, one-line factual description, plain `<ul>` "what to try" (2-3 items, unordered), sole-colored-text Flarepop status ("Ready for review" ×3, "Start here" for D), entire card is the link
- Footer: plain quiet serve instructions, no rule lines anywhere on the page

**Captures + honest review (mandatory, both read with the Read tool):**
- `gallery-1440.png`: lockup wordmark visibly white (not missing/black) — confirmed; all four thumbnails recognizable and representative; text legible at every size used; cards read as one obvious click target each; calm dark Fritz surface, not a dashboard
- `gallery-390.png`: single-column stack, no horizontal overflow, thumbnails/text/status all legible, lockup still renders white
- **No issues found — no fixes needed, no re-capture required.**

**Task 2 verify chain:** re-ran in full after the rebuild — all static greps clean, link-integrity re-passed (23 files, 561 links [4 more than pre-rebuild: img-src thumbnail references], 34 allowlisted, 0 failures), all curl direct-loads 200 (gallery, 4 thumbnails, one sub-page per concept), both captures ≥8KB.

## Files Created/Modified

- `index.html` — rebuilt as the final 4-card Fritz review gallery (inlined lockup, real thumbnails, factual copy, working links)
- `assets/gallery/concept-{a,b,c,d}.png` — pre-cropped 1440×900 thumbnails
- `.planning/phases/06-cross-concept-qa-review-packaging/captures/gallery-{390,1440}.png` — reviewed responsive captures

## Decisions Made

See `key-decisions` in frontmatter: thumbnail pre-cropping approach, the one new documented link-integrity allowlist entry, and the 2-col grid inversion.

## Deviations from Plan

None requiring the Rule 1-4 auto-fix protocol — no bugs found, no missing critical functionality, no blocking issues, no architectural changes needed. The one notable finding (concept-d/index.html's `#episodes` JS-hash-route link) was a checker-limitation false-positive, not a concept defect; resolved by extending the documented allowlist per the interfaces block's own "no new entries without documenting" clause, with zero concept-d files touched.

## Issues Encountered

None. All gates passed on first run with expected counts; the gallery rebuild passed its full verify chain and honest capture review with zero fixes needed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**For the orchestrator:** the gallery and all four concepts are now mechanically green and ready for the Fritz brand agent gate (`06-FRITZ-QA.md`) that must run BEFORE `06-02`. This plan is the mechanical layer of QA-01 only — the actual Fritz brand agent review (reading concept pages + captures against the Fritz Brand OS) is the orchestrator's job between waves, not this executor's.

- QA-02 (verbatim copy): proven mechanically across all four concepts in one consolidated run
- QA-03 (responsive/sub-page/LCP): consolidated existing evidence + fresh spot-checks + budget re-checks + full-repo link integrity, all green
- QA-04 (review gallery): built, reviewed, working — the surface Jon actually opens

No blockers. `06-02` can proceed once the Fritz brand agent gate clears.

---
*Phase: 06-cross-concept-qa-review-packaging*
*Completed: 2026-07-24*

## Self-Check: PASSED

All claimed created/modified files confirmed present on disk (index.html, 4 gallery thumbnails, 2 gallery captures, this SUMMARY). Task 2 commit `9b33b5a` confirmed present in git log.
