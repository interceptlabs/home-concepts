---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_plan: 4
status: in_progress
stopped_at: Completed 04-04-PLAN.md
last_updated: "2026-07-24T18:48:19.417Z"
last_activity: 2026-07-24
progress:
  total_phases: 5
  completed_phases: 4
  total_plans: 14
  completed_plans: 14
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-07-23)

**Core value:** A visitor never faces a wall of text — content is revealed as needed, and clicking an area of interest takes them to a focused page built from that content.
**Current focus:** Phase 4 (Concept C — Experimental WebGL/3D) FULLY COMPLETE — 3 build plans (04-01 topic field/dolly/labels/fallback, 04-02 below-fold sections + 3 sub-pages, 04-03 device tiering + reduced-motion polish + phase-closing QA sweep) plus one gap-closure plan (04-04, closing the camera-framing gap 04-VERIFICATION.md found). Next: plan Phase 5 (cross-concept QA + gallery packaging).

## Current Position

Phase: 4 of 5 (Concept C — Experimental WebGL/3D) — COMPLETE (incl. gap closure)
Plan: 4 of 4 complete in current phase (04-01, 04-02, 04-03, 04-04 all done — 04-04 was a gap-closure plan added after verification, not part of the original phase count)
Current Plan: 4
Total Plans in Phase: 4
Status: Phase 4 complete (including gap closure) — ready for Phase 5 planning
Last activity: 2026-07-24

Progress: [██████████] 100% (14 of 14 known plans across all phases — will re-baseline once Phase 5 is planned)

## Performance Metrics

**Velocity:**
- Total plans completed: 14
- Average duration: 26 min
- Total execution time: 5.96 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| Phase 04 P04 (gap closure) | 26min | 3 tasks | 13 files |
| Phase 04 P03 | 24min | 2 tasks | 2 files |
| Phase 04 P02 | 20min | 2 tasks | 5 files |
| Phase 04 P01 | 44min | 3 tasks | 3 files |
| Phase 03 P03 | 22min | 2 tasks | 17 files |
| Phase 03 P02 | 40min | 3 tasks | 7 files |
| Phase 03 P01 | 38min | 2 tasks | 3 files |
| Phase 02 P03 | 22min | 2 tasks | 8 files |
| Phase 02 P02 | 7min | 3 tasks | 6 files |
| Phase 02 P01 | 25min | 3 tasks | 2 files |
| Phase 01 P03 | 35min | 3 tasks | 5 files |
| Phase 01 P04 | 15min | 2 tasks | 11 files |
| Phase 01 P02 | 20min | 3 tasks | 5 files |
| Phase 01 P01 | 20min | 3 tasks | 3 files |

**Recent Trend:**
- Last 5 plans: 04-04 (26min), 04-03 (24min), 04-02 (20min), 04-01 (44min), 03-03 (22min)
- Trend: 04-04 was a gap-closure plan (not part of the original phase scope) fixing the camera-framing desync 04-VERIFICATION.md found. Task 1's derivation landed clean on the first pass (`buildDollyRig()` reproduced the verifier's ground-truth bounding-sphere radii to 3 decimal places); Task 2's new permanent headless gate immediately caught two real invariant failures in the plan's own suggested starting recipe (mid-transit bounding-sphere intrusion + a missed look-angle floor), both resolved by retuning within the plan's explicit discretion bounds — the mandated capture review then confirmed the fix visually at all 6 waypoints plus 3 transit zones.

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Roadmap: Phases 2, 3, 4 (Concepts A, B, C) each depend only on Phase 1, not on each other — architecture keeps concepts fully isolated (share only `content/` and `shared/`), enabling parallel builds per config.json `parallelization: true`.
- Roadmap: Concept sequencing follows ascending implementation risk (A editorial lowest, B video self-contained-medium, C WebGL highest) per research recommendation, even though all three could build in parallel.
- [Phase 01]: Extended Variant-A alias layer with 4 additional clean-match shorthands (--surface-2/-3, --fg-2/-3); skipped --line/--topbar-bg/--tint/--maxw/--logo-ink as having no sane canonical equivalent
- [Phase 01]: Insights episode links use live prose + staging's per-episode Spotify/Apple/YouTube hrefs (locked decision, documented in content/SOURCE.md)
- [Phase 01]: Work sub-page topic gets 3 dedicated per-case pages (not one shared index) given challenge/approach/results/agents copy volume per case
- [Phase 01]: Labs and insights sub-page topics marked teaser_only — no deeper copy exists in the source to present at greater depth
- [Phase 01]: Card status accent is the sole colored text on the gallery page (Flarepop-only rule); no divider/hr elements anywhere; concept placeholders deliberately skip content/homepage.json strings to keep the copy-diff fallback scan quiet
- [Phase 01]: copy-diff gate diffs at word-level granularity (not line-level) so a single paraphrased/dropped word inside a long canonical paragraph is readable at a glance; truncation legality requires the character after the rendered prefix, in the canonical string, to be non-alphanumeric (catches mid-word cuts, not just non-prefix text)
- [02-01]: Homepage copy was generated by interpolating content/homepage.json directly into hand-authored HTML templates via a one-off Python script (not committed) rather than hand-retyping ~180 copy chunks — copy-diff passed 182/182 chunks with zero failures on first run, eliminating the project's documented curly-quote/retype drift risk by construction
- [02-01]: InterceptOS band built as one full-bleed `<section id="interceptos">` wrapping both `os` framing and `agents` roster (not two sections) to match CONTEXT's "give it real estate" framing; stepped-field background used exactly once across the whole homepage (restraint)
- [02-01]: CONA-05 (motion/kinetic type) deliberately left out of 02-01 — no data-reveal/JS/`.has-js` added — reserved entirely for plan 02-03 per its own files_modified scope
- [02-01]: Headless Chrome's `--window-size` CLI flag was found to silently clamp below a ~500px viewport floor (confirmed via CDP Emulation.setDeviceMetricsOverride cross-check) — plan 02-03's responsive capture step should use CDP/Puppeteer/Playwright viewport emulation, not the bare CLI flag, for widths under ~500px
- [02-02]: Sub-page copy generated via the same data-driven Python generator technique as 02-01, but looping directly over homepage.json's array structures (flows/stages/agents/results/episodes) so both rendered text and its data-copy dot-path are derived together — copy-diff passed 430/430 chunks across all 6 pages and the link-integrity script passed with zero fixes needed, both on the first run
- [02-02]: InterceptOS flows rendered as a responsive 4-column stage grid per flow (no tabs/carousel) so all 16 stages stay visible with zero interaction or timers; the interfaces contract's unannotated structural labels (Challenge/Approach/Results/Agents) implemented as plain text with a single HTML comment per page marking them as content-model field names, not brand copy
- [Phase 02-concept-a-editorial-accenture-but-better]: [02-03]: 20 data-reveal targets on the homepage and 4-10 per sub-page — sparing section-level scroll reveals only, hero excluded (uses its own one-time load stagger instead); single permitted hover accent added (card kicker weight/color shift to Flarepop), all pre-existing 02-01/02-02 hover states left untouched as out-of-scope prior work
- [Phase 02-concept-a-editorial-accenture-but-better]: [02-03]: Puppeteer's bundled "Chrome for Testing" binary hung indefinitely on any Page.captureScreenshot in this sandbox, and mixing manual CDP Emulation.setDeviceMetricsOverride with Puppeteer's own screenshot call produced a corrupted partial-width render (cross-checked live via getBoundingClientRect/getComputedStyle to confirm the actual CSS grid was always correct) -- fix was executablePath pointing at the real installed Google Chrome plus Puppeteer's own page.setViewport(), with page.setJavaScriptEnabled(false) used for the final captures so all data-reveal content is visible for layout review while simultaneously verifying the no-JS guarantee
- [03-01]: Hotspot constellation coordinates and topbar/hero-copy geometry were built as this plan's own discretionary composition (CONTEXT explicitly left layout geometry + responsive behavior to Claude's discretion); visual balance is deferred to 03-03's capture-based review, not gated in 03-01
- [03-01]: Topbar CTA and all 6 hotspot buttons are real, correctly `data-panel`-tagged, keyboard-focusable elements that intentionally do nothing on click yet — 03-02's `panels.js` owns wiring every `[data-panel]` element to its dialog
- [03-01]: `attemptPlay(userInitiated)` in `video.js` gates ambient autoplay behind `prefers-reduced-motion` but always allows an explicit user-initiated play(), with toggle state driven off the video element's own `play`/`pause` events (not manually tracked) so 03-03's visibilitychange/IntersectionObserver pausing bolts on without a rewrite
- [03-02]: Chapter-panel and sub-page markup generated end-to-end by one-off uncommitted Python scripts that read `content/homepage.json` directly and write the finished HTML files to disk — 426 data-copy chunks across 4 pages passed copy-diff on the first run
- [03-02]: Discovered `grep -c 'data-copy='` counts matching lines, not attribute occurrences — any generator that packs multiple data-copy spans on one line will undercount against a plan's numeric verify threshold; fixed by splitting every multi-attribute construct to one data-copy element per line
- [03-02]: Labs panel CTA reuses concept-a's precedent (panel-swap to Contact, never a dead link); Contact's conversion tile is a non-link block since `convert.cta.href` has no real target in this prototype
- [03-02]: Sub-page scroll-reveal reimplemented as concept-b's own `reveal.js` (idiom borrowed from concept-a's `motion.js`, not a shared file) — concepts stay fully isolated per architecture rules
- [Phase 03-concept-b-full-screen-video]: [03-03]: Panel/backdrop @starting-style transitions kept at var(--dur-med) (800ms), matching 03-RESEARCH.md's code recipe exactly, rather than bumping to --dur-long; the hero h1 fade-back-while-panel-open discretion item was left unimplemented since the panel's own flat backdrop already dims the hero copy adequately
- [Phase 03-concept-b-full-screen-video]: [03-03]: Fixed a pre-existing invisible-logo bug (fill="currentColor" can't inherit page color through an <img src> reference to an external SVG) by inlining the SVG directly in concept-b's own 4 pages rather than editing the shared/logo/lockup.svg file — scoped fix, zero cross-concept impact on already-shipped concept-a
- [Phase 03-concept-b-full-screen-video]: [03-03]: Discovered the native <video autoplay> HTML attribute plays independent of any JS-side prefers-reduced-motion gating (JS only skips its OWN play() calls) — fixed with an explicit video.pause() + manual toggle-state sync for reduced-motion visitors, run before the play/pause listeners are attached, since pausing an element that never started playing doesn't reliably fire a native 'pause' event
- [Phase 04-01]: Static-scene (prefers-reduced-motion) renders a frozen real 3D overview rather than the flat .no-webgl backdrop, reserving .no-webgl purely for genuine WebGL2 capability failures
- [Phase 04-01]: Fixed a matrixWorld-ordering bug (updateLabels projected before the first renderer.render(), collapsing all 6 labels onto one point) found via the static-scene capture, which exposed it because it never gets a second self-correcting frame
- [04-02]: Footer placed as a `<footer>` sibling of `<main class="below-fold">` (not nested inside it) but given its own `position:relative; z-index:1; background:var(--page)` rule, so it still opaquely occludes the fixed WebGL canvas exactly like the below-fold sections do
- [04-02]: Sub-page `.subpage` CSS scaffold (page-header/page-hero/os-flows/agent-roster/work-page/insights-page) independently authored rather than reused from concept-b, per the architecture rule that concepts never reach into each other's directories; sub-page stat/chip accents kept neutral (no new flarepop text) to stay conservative against concept-c's own single already-licensed accent (`.hl` in the labs h2)
- [04-02]: `os.flows[i].stages[3].agents` (every flow's "Outcome" stage) is a real, present, empty array — rendered as a plain loop with zero `<li>` children, no key-existence guard needed (corrects 04-01-SUMMARY's own inherited assumption that the key was absent)
- [04-03]: Standardized every :focus-visible outline in concept-c to 2px solid var(--fg) (was var(--flarepop) on the two CTA buttons) with a 2-3px offset — one consistent focus language across labels, topic index, buttons, and every sub-page/footer link
- [04-03]: Fixed a real narrow-viewport bug found via mandated capture review — the top-of-page camera framing projects the Problems label directly over the hero headline at widths <= ~390px, both white-on-white and mutually illegible (reproduced at a realistic 390x844 viewport, not a capture-rig artifact) — fixed with a solid var(--surface) backing chip on .topic-label (reusing the existing btn-cta/btn-secondary/convert-tile flat-surface treatment) rather than touching camera/curve math
- [04-03]: Device tier (`deviceTier()`: hardwareConcurrency primary, deviceMemory Chromium-only bonus, narrow-viewport fallback) computed once in boot() before any renderer/material construction and threaded through initScene() as a plain parameter, matching the existing `animated` parameter pattern — low tier drops antialias, forces DPR 1, uses a 3-step (not 4-step) gradient map, and disables cursor parallax entirely
- [Phase 04-04]: Switched both CatmullRomCurve3 curves from catmullrom/tension-0.5 to centripetal (kept identically typed) and retuned the offset-direction mix to a forward-weighted 0.6:0.45:2.0 (x:y:z), since the plan's starting recipe overshot into InterceptOS's bounding sphere mid-transit and missed the look-angle floor near t=0.87

### Pending Todos

None yet.

### Blockers/Concerns

- Phase 4 (Concept C) is now FULLY COMPLETE INCLUDING GAP CLOSURE — all 5 requirements (CONC-01 through CONC-05) implemented and verified across 04-01/04-02/04-03, and the single gap 04-VERIFICATION.md found (camera-framing desync, CONC-01/CONC-03) is closed by 04-04 with a permanent headless regression gate (`qa/camera-framing-check.mjs`). No open items remain for this phase.
- Phase 3 (Concept B) is fully complete — CONB-01 through CONB-05 all done and verified in 03-03. No open items remain for this phase.
- Tooling: `gsd-tools state advance-plan`/`update-progress`/`record-metric`/`add-decision`/`record-session` continue to need hand-correction after each run. Recurred again on 04-04's update: `advance-plan` returned `advanced:false, reason:"last_plan"` and left `current_plan`/`Total Plans in Phase` at the stale value of 3 because it doesn't know 04-04 is a 4th, gap-closure plan added after the phase's original 3-plan count — hand-corrected to 4/4 here. `add-decision` also silently reset the frontmatter `status` field back to `planning` as a side effect of its own write (independent of `advance-plan`'s separate `status` mangling seen in prior plans) — hand-corrected to `in_progress` again. `record-metric` again appended its new table row below the `*Updated after each plan completion*` footer instead of inside the table — moved by hand. This has now recurred on every plan since at least 04-01 — still worth a tooling fix.

## Session Continuity

Last session: 2026-07-24T18:47:41.137Z
Stopped at: Completed 04-04-PLAN.md
Resume file: None
