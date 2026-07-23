---
phase: 01-content-foundation-shared-brand-layer
plan: 03
subsystem: testing
tags: [python, stdlib, html-parser, qa-gate, copy-immutable]

# Dependency graph
requires:
  - phase: 01-01
    provides: "content/homepage.json — canonical verbatim homepage copy the gate compares pages against"
provides:
  - "qa/copy-diff.py — stdlib-only blocking verbatim-copy gate (annotated data-copy mode + substring-fallback mode for unannotated pages), exit 0/1/2"
  - "qa/fixtures/{pass-annotated,fail-annotated,pass-substring}.html — the gate's own regression-proof fixtures, generated programmatically from content/homepage.json"
  - "qa/README.md — gate usage, annotation convention, exit codes, fixtures-as-regression-proof note"
affects: [02-concept-a-editorial, 03-concept-b-video, 04-concept-c-webgl]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "data-copy=\"<dot.path>\" / data-copy-truncated=\"true\" annotation convention (already documented in shared/README.md, now backed by a working gate) — every concept page's copy-bearing elements must carry this"
    - "Gate CLI modeled on ~/Creative-Projects/intercept-brand-kit/.fritz/qa/check.py's argparse/report/exit-code discipline: 0 pass, 1 content failure, 2 usage/IO error"
    - "Substring-fallback mode as a safety net for any page that hasn't yet adopted data-copy annotation, so the gate is never silently bypassable by omission"

key-files:
  created:
    - qa/copy-diff.py
    - qa/fixtures/pass-annotated.html
    - qa/fixtures/fail-annotated.html
    - qa/fixtures/pass-substring.html
    - qa/README.md
  modified: []

key-decisions:
  - "Diff granularity is word-level (difflib.unified_diff on space-split tokens), not line-level — a paragraph-length canonical string is one line, so a single paraphrased/dropped word needs word-level diffing to be readable at a glance"
  - "Default --all roots (concept-a/b/c) resolve relative to the script's own location (REPO_ROOT), not cwd, matching the --content default's cwd-independence requirement"
  - "Truncation legality is a word-boundary rule on the CANONICAL string (the character immediately following the rendered prefix must be non-alphanumeric), not merely 'is a prefix' — this catches a truncation that lands mid-word"

patterns-established:
  - "Any HTML fixture or generated page whose copy must match content/homepage.json is produced by a small generator script that pulls strings via json.load — never retyped by hand, per this project's own copy-immutability rule applied recursively to its own QA tooling"

requirements-completed: [FOUND-04]

# Metrics
duration: 35min
completed: 2026-07-23
---

# Phase 1 Plan 3: Copy-Diff QA Gate Summary

**Stdlib-only `qa/copy-diff.py` verbatim-copy gate — HTMLParser-based visible-text extraction with exact `data-copy`-scoped comparison (including word-boundary-safe truncation) plus a substring-fallback mode for unannotated pages, proven against three purpose-built fixtures and wired into `qa/README.md` as the mandatory pre-review check for Phases 2-5.**

## Performance

- **Duration:** ~35 min
- **Started:** 2026-07-23T18:47:00Z (approx.)
- **Completed:** 2026-07-23T20:00:03Z
- **Tasks:** 3 completed
- **Files modified:** 5 (all newly created)

## Accomplishments

- Built three proof fixtures with every canonical string pulled programmatically from `content/homepage.json` via a one-off generator script (never retyped): `pass-annotated.html` (exact match, inline-markup `_html` field, permitted word-boundary truncation, array-index path resolution, decoy `<script>`/`<svg>` text), `fail-annotated.html` (one-word paraphrase, illegal non-prefix truncation, unresolvable path), `pass-substring.html` (unannotated page carrying two verbatim canonical chunks)
- Implemented `qa/copy-diff.py`: a `VisibleTextExtractor(HTMLParser)` that skip-depth-tracks `script`/`style`/`svg`/`symbol`/`noscript`/`template` and tag-stack-captures each `data-copy` element's own subtree text without void elements (`img`/`br`/...) corrupting depth tracking
- Annotated mode: dot-path resolution into `homepage.json` (dict keys + numeric indices, must land on a string leaf), exact whitespace-normalized match required unless `data-copy-truncated="true"`, in which case the rendered text (minus a trailing ellipsis) must be a non-empty prefix landing on a word boundary in the canonical string
- Substring-fallback mode: walks every canonical string leaf, flags any leaf whose opening 30 normalized characters appear on the page but whose full normalized text does not (a corrupted partial reproduction); pages with nothing detected pass with an explicit note rather than silently passing
- Proved the full CLI surface: default `--all` (now finds the real `concept-a/b/c` placeholders from the concurrently-executing 01-04 plan), an explicit missing root (warns, no crash), a scratch `--all` run over 2 copied fixtures (both annotated- and substring-mode pages reported, proving `--all` never silently skips unannotated pages), multi-page invocation, and cwd-independence of the default `--content` path
- Wrote `qa/README.md`: what the gate enforces, every CLI invocation form, the `data-copy`/`data-copy-truncated` convention with a markup example, substring-fallback semantics, exit codes, and the note that `qa/fixtures/` is the gate's own regression proof (`fail-annotated.html` must always fail)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create proof fixtures that define the gate's expected behavior** - `8d62efc` (feat)
2. **Task 2: Implement qa/copy-diff.py (stdlib only)** - `c3f0488` (feat)
3. **Task 3: Prove the full gate surface and write qa/README.md** - `cf21f76` (docs)

**Plan metadata:** (this commit, following)

## Files Created/Modified

- `qa/copy-diff.py` - The gate: stdlib-only HTML visible-text extraction, annotated + substring-fallback comparison modes, CLI with `--all`/`--content`/`--mode`, exit 0/1/2
- `qa/fixtures/pass-annotated.html` - Proof fixture: must always PASS (exact match, `_html` field, permitted truncation, array-index path, decoy script/svg text)
- `qa/fixtures/fail-annotated.html` - Proof fixture: must always FAIL three independent ways (paraphrase, illegal truncation, bad path)
- `qa/fixtures/pass-substring.html` - Proof fixture: unannotated page exercising the substring-fallback mode
- `qa/README.md` - Gate usage, annotation convention, exit codes, fixtures-as-regression-proof note

## Decisions Made

- Diff output is word-level unified diff (not line-level) so a single paraphrased or dropped word inside a long paragraph is immediately visible in the report
- Truncation legality requires the character immediately following the rendered prefix, in the CANONICAL string, to be non-alphanumeric — a stricter rule than "is a prefix," since it also catches a truncation that happens to land mid-word
- `--all`'s default roots (`concept-a`, `concept-b`, `concept-c`) resolve relative to the script's own location, matching the same cwd-independence already required of the default `--content` path, so the gate behaves identically no matter which directory it's invoked from

## Deviations from Plan

### Auto-fixed Issues

None — no bugs, missing-critical-functionality, or blocking issues surfaced during implementation. All three tasks' automated verification blocks passed on first attempt.

**1. [Environment drift, not a defect] Task 3's "concept-a/b/c don't exist yet" assumption was overtaken by concurrent plan 01-04**
- **Found during:** Task 3
- **Issue:** The plan's Task 3 verify step assumed `python3 qa/copy-diff.py --all` (no explicit roots) would warn that `concept-a`/`concept-b`/`concept-c` don't exist yet. Plan 01-04 (parallel wave-2 sibling, depends only on 01-01 same as this plan) had already built real placeholder pages at those paths by the time this plan reached Task 3, deliberately keeping them free of `content/homepage.json` strings ("no canonical copy detected" note is expected and correct).
- **Fix:** No code change needed — the gate's actual behavior against the now-real roots is exactly what the requirement demands (found 3 real pages, all substring mode, all reported with the explicit "no canonical copy detected" note, exit 0). Proved the missing-root warning path separately using an explicit nonexistent root name (`--all concept-does-not-exist-yet`) and a mixed real+missing-root invocation, both behaving correctly (warning printed, no crash, real root still processed).
- **Files modified:** None
- **Verification:** All Task 3 automated checks pass unchanged, plus the two additional ad hoc missing-root proofs
- **Committed in:** cf21f76 (Task 3 commit)

---

**Total deviations:** 1 (environment drift from concurrent parallel execution, not a plan defect — no code changes required)
**Impact on plan:** None on scope; the gate's `--all` missing-root behavior was proven via an explicit nonexistent root instead of the now-populated defaults.

## Issues Encountered

- Ran concurrently with plan 01-04 (same wave, same dependency on 01-01) building the repo skeleton and concept placeholders. Both plans wrote to `.planning/STATE.md`/`.planning/ROADMAP.md`/`.planning/REQUIREMENTS.md`. 01-04 completed and committed first, hand-correcting those files to reflect "3/4 plans done, 01-03 remains" (per its own SUMMARY). This plan's state-update step (below) hand-corrects on top of that committed state to reflect the phase's actual completion (4/4).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `qa/copy-diff.py` is ready for Phases 2-5 to run against every concept page before showing work to Jon, per the binding rule already documented in `shared/README.md`
- `qa/fixtures/` fixtures double as the gate's own permanent regression suite — re-run them any time the gate itself changes
- Phase 1 is now fully complete: all 4 plans (01-01 content foundation, 01-02 shared brand layer, 01-03 copy-diff gate, 01-04 repo skeleton + gallery) done
- No blockers for Phase 2 (Concept A — editorial), which can now build against `content/`, `shared/`, and `qa/copy-diff.py` as its complete Phase 1 foundation

---
*Phase: 01-content-foundation-shared-brand-layer*
*Completed: 2026-07-23*

## Self-Check: PASSED

All claimed files and commits verified present:
- qa/copy-diff.py — FOUND
- qa/README.md — FOUND
- qa/fixtures/pass-annotated.html — FOUND
- qa/fixtures/fail-annotated.html — FOUND
- qa/fixtures/pass-substring.html — FOUND
- .planning/phases/01-content-foundation-shared-brand-layer/01-03-SUMMARY.md — FOUND
- Commit 8d62efc — FOUND
- Commit c3f0488 — FOUND
- Commit cf21f76 — FOUND
