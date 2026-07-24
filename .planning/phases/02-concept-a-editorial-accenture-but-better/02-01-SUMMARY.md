---
phase: 02-concept-a-editorial-accenture-but-better
plan: 01
subsystem: ui
tags: [static-html, css-clamp, view-transitions, editorial, data-copy, fritz-tokens]

# Dependency graph
requires:
  - phase: 01-content-foundation-shared-brand-layer
    provides: content/homepage.json (frozen copy), shared/tokens.css, shared/fonts.css, shared/motion.css, shared/logo/lockup.svg, qa/copy-diff.py gate
provides:
  - Complete Concept A homepage (concept-a/index.html) — all 9 locked sections, fully data-copy annotated, copy-diff green (182/182 chunks)
  - concept-a/assets/css/concept-a.css — dark editorial stylesheet: fluid clamp() type, card grid, stepped-field utility, @view-transition opt-in, zero raw hex
  - Card → sub-page routing map realized as live hrefs (dangling until plan 02-02 builds the targets)
  - Section anchor ids (problems, interceptos, work, labs, convert) plan 02-02/02-03 route against
affects: [02-02-derived-subpages, 02-03-motion-and-qa, 05-cross-concept-comparison]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "JSON-to-HTML generation script (Python, scratchpad-only, not committed) used to interpolate every data-copy string directly from content/homepage.json rather than hand-retyping — eliminates curly-quote/em-dash transcription drift by construction; structure/classes remained hand-authored in the generator template"
    - "Repeated-array card kickers (episode/show) rendered as two adjacent data-copy spans with the middot separator injected via CSS ::before, keeping the decorative glyph out of the annotated text nodes"
    - "Conditional signalNum rendering (problems.items.3 has an empty string) — omit the stat-number element entirely rather than rendering an empty/orphaned node"
    - "Agent chips grouped by each item's `primary` field into 4 category buckets (strategy/content/sales/channel), preserving JSON array order within each bucket"

key-files:
  created:
    - concept-a/index.html
    - concept-a/assets/css/concept-a.css
  modified: []

key-decisions:
  - "Plan explicitly out of scope for CONA-05 (kinetic/scroll-reveal motion) — no data-reveal attributes, no JS, no .has-js bootstrap added; that layer belongs entirely to plan 02-03 per its own files_modified list"
  - "InterceptOS band built as ONE <section id=\"interceptos\"> wrapping both the os framing and the agents roster as two inner divs, sharing one stepped-field background — matches CONTEXT's 'full-bleed band' framing rather than splitting into two separate sections"
  - "Problem-item separation between the 4 <details> entries uses a rgba(255,255,255,0.12) border-top on each list item (accordion-row boundary), judged as a 'box keyline on a content block' rather than a banned free-floating divider line — no <hr>, no standalone decorative rule"
  - "Verified zero horizontal overflow at true 320/375/768px viewports via Chrome DevTools Protocol Emulation.setDeviceMetricsOverride (proper mobile emulation), after headless Chrome's --window-size CLI flag was found to silently clamp to a ~500px minimum viewport, which had produced a false-positive mid-word-clipping artifact in an initial screenshot"

patterns-established:
  - "Stepped-field utility (.section--stepped, repeating-linear-gradient with duplicated stop offsets) reserved for exactly one section (InterceptOS band) — restraint per the brief"
  - "Buttons use solid Flarepop background + dark (--page) text, never Flarepop text-on-dark — keeps the 'Flarepop is the only colored TEXT' rule intact while still using the brand color prominently"

requirements-completed: [CONA-01, CONA-02, CONA-03, CONA-06]

# Metrics
duration: 25min
completed: 2026-07-23
---

# Phase 2 Plan 1: Concept A Editorial Homepage Scaffold Summary

**Full 9-section dark-editorial Concept A homepage (concept-a/index.html + concept-a.css) with fluid clamp() type, Flarepop-only accents, and 182/182 data-copy chunks passing the verbatim gate on the first run.**

## Performance

- **Duration:** ~25 min
- **Completed:** 2026-07-23
- **Tasks:** 3 (all `type="auto"`, no checkpoints)
- **Files modified:** 2 (`concept-a/index.html`, `concept-a/assets/css/concept-a.css`)

## Accomplishments
- Built the entire Concept A homepage — header, hero, card grid (3 insights episodes + Labs), statement moment (4 keyboard-accessible `<details>` problem entries), full-bleed InterceptOS band (4 flow labels + 13 grouped agent chips), work showcase (3 case cards), 12-name client strip, terminal convert CTA, and a restrained footer — in the exact locked page order.
- Every rendered string is `data-copy`-annotated per JSON dot-path and generated directly from `content/homepage.json` via a one-off Python interpolation script (kept in scratchpad, not committed), which produced byte-exact curly quotes/apostrophes/em-dashes on the first attempt — `qa/copy-diff.py` passed 182/182 chunks with zero failures across all three task-level runs.
- `concept-a.css` ships the `@view-transition { navigation: auto; }` opt-in, a fluid clamp()-based type scale verified against the real verbatim hero sentence (not lorem ipsum) at 320/375/768px with zero horizontal overflow, a card-grid responsive breakpoint ladder (1/2/4 columns), and a single stepped-field utility used exactly once (InterceptOS band) — no raw hex anywhere in the file.
- Flarepop discipline held throughout: the only colored *text* is the hero's two `<em>` words and the `.dot` span; CTA buttons use solid Flarepop *backgrounds* with dark text, which is a fill, not a text-color violation.

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold, stylesheet foundation, header, hero, and the editorial card grid** - `38545cd` (feat)
2. **Task 2: Statement moment (problems) and the InterceptOS band** - `a02ec8f` (feat)
3. **Task 3: Work showcase, client strip, convert, footer — full-page gate** - `aa9facc` (feat)

_No TDD tasks in this plan — all three are `type="auto"` static-markup builds._

## Files Created/Modified
- `concept-a/index.html` (325 lines) — full homepage, all 9 sections, 182 `data-copy` annotations
- `concept-a/assets/css/concept-a.css` (571 lines) — dark editorial stylesheet consuming `shared/tokens.css`/`fonts.css`/`motion.css` only

## Decisions Made
- Used a generator script (Python, scratchpad-only) to interpolate homepage.json strings directly into hand-authored HTML templates, rather than manually retyping ~180 copy chunks — this is a build-time authoring aid, not a runtime dependency; the shipped `index.html` is fully static, hand-structured markup with the copy pasted in verbatim by the script instead of by hand. This eliminated the project's own documented #1 failure mode (curly-quote/retype drift) by construction.
- Kept CONA-05 (motion/kinetic typography) entirely out of scope, per this plan's own `requirements` frontmatter (`[CONA-01, CONA-02, CONA-03, CONA-06]`) and per plan 02-03's `files_modified` already covering `concept-a/index.html` for the motion layer — added no `data-reveal` attributes, no JS, no `.has-js` bootstrap class, so plan 02-03 lands cleanly on a static baseline.
- Single `<section id="interceptos">` wraps both the `os` framing and the `agents` roster (rather than two separate sections) so the stepped-field background reads as one full-bleed band, matching CONTEXT's "give it real estate" framing.
- Resolved the card-kicker "RESEARCH REPORT"-style separator (episode number · show name) via a CSS `::before` middot on the second span rather than a literal character in either `data-copy` chunk, per the plan's explicit instruction.

## Deviations from Plan

None — plan executed exactly as written. One clarification worth recording: the plan's Task 3 instruction to "open the page at 320px-equivalent width mentally" was upgraded to an actual verification pass using Chrome DevTools Protocol (`Emulation.setDeviceMetricsOverride`) at 320/375/768px, which confirmed zero horizontal overflow (`scrollWidth === clientWidth === innerWidth` at every width, 0 overflowing elements). This was prompted by an initial headless-Chrome `--screenshot --window-size=320,900` CLI capture that appeared to show mid-word text clipping; investigation traced this to a Chrome headless CLI quirk (the `--window-size` flag silently clamps below a ~500px floor rather than actually shrinking the rendered viewport) rather than a real CSS bug — worth flagging for plan 02-03's own headless-Chrome capture work, which should use CDP device-metrics overrides (or Puppeteer/Playwright's built-in viewport emulation) rather than the bare `--window-size` CLI flag for widths below ~500px.

## Issues Encountered
- Headless Chrome CLI `--window-size` flag does not reliably shrink the rendered CSS viewport below ~500px (confirmed at 320 and 400 requested widths, both rendered at an actual 500px viewport) — worked around with a direct CDP `Emulation.setDeviceMetricsOverride` call for accurate mobile-width verification. No code change was needed once verified with the correct tooling; flagging this for whoever builds plan 02-03's responsive capture step.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `concept-a/index.html` is ready for plan 02-02 to build the 5 dangling sub-pages it already links to (`pages/interceptos.html`, `pages/insights.html`, `pages/work-hp-abx.html`, `pages/work-intel-abm.html`, `pages/work-sap-video.html`) — all hrefs, anchor ids, and the routing map are in place.
- `concept-a.css` is ready for plan 02-03 to layer in `data-reveal` scroll-reveal markup, hero stagger keyframes, the one permitted hover accent, and the `.has-js` bootstrap — no existing motion code to conflict with.
- No blockers or concerns for downstream plans.

---
*Phase: 02-concept-a-editorial-accenture-but-better*
*Completed: 2026-07-23*

## Self-Check: PASSED

- FOUND: concept-a/index.html
- FOUND: concept-a/assets/css/concept-a.css
- FOUND: 38545cd (Task 1 commit)
- FOUND: a02ec8f (Task 2 commit)
- FOUND: aa9facc (Task 3 commit)
