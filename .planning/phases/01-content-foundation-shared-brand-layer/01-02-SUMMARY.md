---
phase: 01-content-foundation-shared-brand-layer
plan: 02
subsystem: brand-tokens
tags: [css-custom-properties, google-fonts, svg, design-tokens]

# Dependency graph
requires: []
provides:
  - "shared/tokens.css — byte-identical mirror of intercept-brand-kit SSoT + Variant-A shorthand alias layer"
  - "shared/fonts.css — Google Fonts CDN delivery matching live site exactly"
  - "shared/motion.css — sine ease-in-out easing + duration custom properties"
  - "shared/logo/lockup.svg — static canonical 8-path logo lockup (wordmark + mark, no JS)"
  - "shared/README.md — binding brand rules, copy rules, and consumption instructions for Phases 2-4"
affects: [02-concept-a, 03-concept-b, 04-concept-c]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Brand values consumed via shared/ import only — concepts never re-declare hex/tokens locally"
    - "Shorthand-to-canonical alias layer: Variant-A shorthand custom properties (--flarepop, --page, --surface, --fg, --surface-2, --surface-3, --fg-2, --fg-3) all resolve through var() to canonical ramp/semantic tokens — never hold raw hex"
    - "Static-bake pattern for animated source assets: resolved the live site's data-driven/JS-hover lockup down to a plain static SVG for the at-rest canon state"

key-files:
  created:
    - shared/tokens.css
    - shared/fonts.css
    - shared/motion.css
    - shared/logo/lockup.svg
    - shared/README.md
  modified: []

key-decisions:
  - "Aliased 4 additional Variant-A shorthands beyond the plan's mandatory six (--surface-2 → --bg-surface-hi, --surface-3 → --bg-surface-max, --fg-2 → --fg-muted, --fg-3 → --fg-secondary) after verifying exact hex equivalence against the live site's dark-theme :root block"
  - "Skipped aliasing --line/--line-2/--topbar-bg/--tint/--maxw/--logo-ink — no clean canonical equivalent exists (translucent white borders vs. the solid --divider token, or non-color layout values); documented as intentional in tokens.css comment"
  - "--logo-ink resolved via currentColor on the wordmark <g>, not via a token alias, per Task 2's explicit instruction"
  - "lockup.svg built from the live symbol's own pre-resolved static markup (lines 2158-2184) rather than re-deriving fill values from the JS-driven fritz-canon template group — the symbol already contains the exact baked at-rest state"

patterns-established:
  - "Shared brand layer is the only place hex values are declared; all consumers reference var()"

requirements-completed: [FOUND-03]

# Metrics
duration: 20min
completed: 2026-07-23
---

# Phase 1 Plan 2: Shared Brand Layer Mirror Summary

**Mirrored Fritz brand tokens, fonts, motion easing, and a JS-free static 8-path logo lockup from source-of-truth files into `shared/`, plus a binding-rules README for Phases 2-4.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-07-23T18:12:00Z (approx)
- **Completed:** 2026-07-23T18:32:45Z
- **Tasks:** 3
- **Files modified:** 5 (all created)

## Accomplishments
- `shared/tokens.css` is a byte-identical prefix mirror of `intercept-brand-kit/tokens.css` with an appended, fully `var()`-based alias block mapping 10 Variant-A shorthand names onto canonical tokens
- `shared/fonts.css` reproduces the exact Google Fonts CSS2 URL the live homepage requests — no fabricated self-hosted font files
- `shared/motion.css` establishes the sine ease-in-out + long-duration motion vocabulary
- `shared/logo/lockup.svg` bakes the live header's centered/at-rest lockup state (wordmark + canonical 8-path mark) into a standalone static SVG with zero JS and zero deprecated colors
- `shared/README.md` encodes every binding brand rule, the copy-immutability + copy-in-markup constraints, the `data-copy` annotation convention, and concept consumption instructions

## Task Commits

Each task was committed atomically:

1. **Task 1: Mirror tokens.css + alias block; create fonts.css and motion.css** - `61cd8e7` (feat)
2. **Task 2: Build the static canonical 8-path logo lockup** - `7da7b12` (feat)
3. **Task 3: Write shared/README.md — binding brand rules + authoring conventions** - `3091a8e` (docs)

## Files Created/Modified
- `shared/tokens.css` - Canonical brand-kit token ramp (byte-identical mirror) + Variant-A shorthand alias layer
- `shared/fonts.css` - Google Fonts CDN `@import` matching the live site's CSS2 URL
- `shared/motion.css` - `--ease-inout-sine` + `--dur-short`/`--dur-med`/`--dur-long`
- `shared/logo/lockup.svg` - Static wordmark + canonical 8-path mark (base `#FF00E5` + 7 accent paths across 6 hexes)
- `shared/README.md` - Binding brand rules, copy rules, architecture rules, consumption instructions

## Decisions Made
- Extended the alias block with 4 additional Variant-A shorthands (`--surface-2`, `--surface-3`, `--fg-2`, `--fg-3`) after confirming exact hex-value equivalence with canonical semantic tokens in the live snapshot's dark-theme `:root` block — each documented inline in `tokens.css`
- Deliberately skipped aliasing shorthands with no clean canonical match (`--line`, `--line-2`, `--topbar-bg`, `--tint`, `--maxw`, `--logo-ink`) rather than inventing tokens, per plan instruction; reasoning documented in a `tokens.css` comment and in `shared/README.md`'s scope note
- Built `lockup.svg` from the live `<symbol id="intercept-lockup">` markup (already a pre-resolved static rendering of the at-rest state) rather than reconstructing from the JS-driven `fritz-canon` template group — lower risk of transcription error, and verified identical path data against the canon group

## Deviations from Plan

None - plan executed exactly as written. The plan's own optional guidance ("add aliases for any OTHER shorthand names... map cleanly") was exercised as designed, not a deviation.

## Issues Encountered

The plan-level `<verification>` section's blanket `grep -rEi 'A855F7|6366F1|22D3EE' shared/` matches a hit in `shared/README.md` — but this is expected and correct: Task 3's own automated verify explicitly requires the literal string `A855F7` to appear in the README as prose documenting the deprecated-color enforcement gate (`grep -rEi 'A855F7|6366F1|22D3EE' <files>` must return nothing — as an instruction, not a functional color value). Confirmed the substantive requirement holds: `grep -rEi 'A855F7|6366F1|22D3EE' shared/tokens.css shared/fonts.css shared/motion.css shared/logo/lockup.svg` returns nothing — no deprecated colors exist in any functional brand asset.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `shared/` is fully populated and ready for import by Concepts A, B, and C (Phases 2-4)
- All three concepts can now link `shared/tokens.css` → `shared/fonts.css` → `shared/motion.css` and embed `shared/logo/lockup.svg` without re-declaring any brand value
- `shared/README.md` is the binding contract phase executors must follow — no further action needed before Phase 2 planning

---
*Phase: 01-content-foundation-shared-brand-layer*
*Completed: 2026-07-23*

## Self-Check: PASSED

- FOUND: shared/tokens.css
- FOUND: shared/fonts.css
- FOUND: shared/motion.css
- FOUND: shared/logo/lockup.svg
- FOUND: shared/README.md
- FOUND: 61cd8e7 (Task 1 commit)
- FOUND: 7da7b12 (Task 2 commit)
- FOUND: 3091a8e (Task 3 commit)
