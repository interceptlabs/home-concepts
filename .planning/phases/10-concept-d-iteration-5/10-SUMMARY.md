# Phase 10: Concept D — Iteration 5 (directly-briefed round)

**Jon's notes (2026-07-25):** clean up all the sections (pages launched from the cards) so they fit above the fold, reorganized into a coherent, balanced composition; back-to-home button misaligned (too close to viewport edge); work section better but the headline module should equal the stacked work cards' height; the other sections should also have background video (different but complementary imagery); light-mode pass for button/label contrast.

**One-liner:** All 8 explore pages became viewport-fit two-zone compositions (5fr lede rail / 7fr content panel on flat translucent surfaces) over per-family fixed background footage, with an aligned chip back-link, an equal-height reel bottom bar, and a measured light-mode contrast pass.

## Shipped

**1. Viewport-fit explore compositions (all 8 pages + concept-d.css)**
- Every page in `concept-d/pages/explore/` is one balanced above-the-fold composition at ≥900px: `body.explore-body` flex column locked to `100dvh`, sticky topbar → back-link row → section → compact footer, zero page scroll at 1440×900 (verified `scrollHeight == clientHeight == 900` on all 8).
- Two-zone grid `.explore-split` (minmax(320px,5fr) / 7fr): lede = eyebrow + heading + lead + that page's controls (q-tabs, agent-tabs, archive link); panel = the active content (#quietSolve, #quietFlow, agents stage, episode tiles, case image + detail). Overflow scrolls INSIDE the panel (`overflow-y:auto`, min-height:0 chain, `:focus-visible` outline), never the page. Below 900px the lock releases to natural flow.
- Lighter pages compose balanced, not stretched-sparse: labs lede + panel, insights panel, and all 3 case ledes center vertically (`--center` modifiers). Control-rail pages (problems/interceptos/agents) stay top-anchored.
- All quiet-module functionality intact (tabs, stepper, details disclosures, agent overlay/drawers); copy untouched.
- deployed.css's `#os` navy band neutralized on the explore page at matching specificity (`:root[data-theme="light"] .explore-page #os`), with panel-level ink-token re-pins so InterceptOS reads on the same light panels as the other 7 pages.

**2. Back-link alignment**
- `.explore-back` moved inside `<div class="wrap explore-back-row">` on all 8 pages — measured x=148px, identical to the wrap content edge below it (was hugging the viewport edge).
- Given the `.video-toggle` chip treatment (0.92 white pill) so it stays legible over footage.

**3. Section background videos**
- New shared `assets/js/section-video.js` (hero-video.js adaptation): reduced-motion → poster only + pause, visibilitychange pause/resume, userPaused guard (WCAG 2.2.2), autoplay-rejection fallback. Zero pageerrors on all 8 pages.
- Fixed layer idiom (`.section-video-layer`, z-index:0), `autoplay muted playsinline loop preload="metadata"`, poster, WebM-first. Assignment: **rings** → problems + insights, **cubes** → interceptos + agents, **geo** → labs + all 3 case pages.
- Pause chip (`.section-video-toggle`) is a *sibling* of the aria-hidden layer — accessible to AT and clickable above the stacked content (a button inside the z-index:0 fixed layer is unreachable under the z-index:1 main). Includes the `html:not(.has-js)` hide rule. Click verified: aria-pressed true→false, label Pause→Play.
- Panels are flat translucent white (0.82) — never a gradient scrim — so dark ink stays AA over any frame (see contrast table).

**4. Work-reel equal heights (homepage)**
- `.reel-bottom` align-items end→stretch; `.reel-cta` is a flex column with the headline+lead group bottom-anchored via the codebase's `margin-top:auto` idiom (eyebrow anchors top, space breathes mid). Measured `.reel-cta` height == `.reel-cards` height == 229px.

**5. Light-mode contrast pass (measured, before → after)**

Effective backgrounds measured from the actual posters (PIL, WCAG relative luminance): geo p1-darkest L=0.753 (near-white), rings p1 L=0.407, **cubes p1 L=0.000 (true black regions)**. 82% white panels compose to L≥0.82 even over cubes black.

| Element | Before | After |
|---|---|---|
| `.explore-back` | bare `--fg` ink straight on footage (unbounded; would sit on video) + flarepop hover 3.3:1 FAIL | 0.92 white chip → 17.9–19:1; hover = bg/border shift only |
| `.q-tab` / `.q-step` / `.q-step-prev/next` borders (`--line-2`) | composites ~#B5B5B7 on panel = **1.9:1** (non-text 3:1 FAIL) | rgba(10,10,15,.48) → ~#8A8A8D = **3.3:1** PASS; active keeps full-ink border |
| `.agent-tab` border (`--line`) | **1.4:1** FAIL | rgba(10,10,15,.48) → **3.3:1** PASS |
| `.agent-tab[aria-selected]` label | white on flarepop = **3.3:1** FAIL | `#0a0a0f` on flarepop = **6.0:1** (deployed's own `.btn-primary` pairing) |
| `.agent-detail-close` border | 1.9:1 | 3.3:1 |
| Insights archive link | inline 14px flarepop = **3.3:1** FAIL | `--fg` ink = 17.9:1; hover flarepop-200 |
| Footer "Powered by curiosity." | bare `--fg-3` over footage: **1.9:1 over cubes black** | 0.82 white chip + `#2c2c3a` ink ≥ **11:1** |
| `.video-toggle` / `.reel-toggle` (homepage) | `var(--fg)` on the hard-coded light chip = invisible white-on-white in dark theme | fixed `#0a0a0f` ink (Rule 1 fix; 17.4:1 light) |
| Panel body ink (`--fg-2` #2c2c3a) | — | 11.4–13.2:1 on panels (no change needed) |
| `.q-step` resting ink (`--fg-3`) | — | 9.5:1 (no change needed) |
| Focus rings | — | 2px `--fg`/#0a0a0f outlines ≥3:1 everywhere (no change needed) |

**Left as-is (documented for Jon):** the ported `.idx` flarepop eyebrow (12px, 3.3:1) is deployed.css's own site-wide treatment — restyling it would break the "never restyle a ported module" covenant; flag if it should change. `.card-cta` hover flarepop on the homepage cards is a transient enhancement on an AA-resting element (card also lifts/scales), kept from the approved iteration-4 behavior. Agent-card "LEARN MORE" flarepop is ported deployed chrome.

## Deviations from the brief

1. **[Rule 1] Split-grid display bug (own work, caught in capture review):** the `section > .wrap { display:flex }` media rule silently discarded `.explore-split`'s `display:grid` (same element, later in the file) — zones rendered content-sized and the agents grid collapsed to one column. Fixed by dropping the display from the wrap rule. Commit 8d5b037.
2. **[Rule 1] Homepage toggle dark-theme ink** (white-on-white button) fixed additively while auditing the same chip pattern. Commit 5c3041f.
3. **[Rule 2] Pause chip placed outside the aria-hidden layer** (the homepage puts it inside, which hides it from AT and — for a z-index:0 fixed layer under z-index:1 content — makes it unclickable in this page structure). New pages use the corrected placement; homepage markup untouched.

## Gates

- `qa/copy-diff.py --mode substring` (index + 8 explore pages): 54/54 chunks clean after every task
- `qa/concept-d-script-diff.py`: 13/13 (deployed.css / deployed.js byte-frozen)
- Puppeteer 1440×900: zero pageerrors ×8; no page scroll ×8; back-link x=148 ×8; correct video family playing ×8; toggle functional; reel 229px == 229px
- Captures read and judged: `captures/` (8 pages, homepage reel, contrast crop); two rounds — round 1 findings (inverted zone ratio, top-heavy light pages) fixed and re-verified in round 2

## Commits

- ff00799 feat(10-01): viewport-fit two-zone explore compositions + aligned back link
- a80cd26 feat(10-01): fixed background video layer on all 8 explore pages
- 2f7f922 feat(10-01): work-reel headline module matches stacked card height
- 5c3041f fix(10-01): light-mode contrast pass on concept-d new chrome
- 8d5b037 fix(10-01): restore 5fr/7fr split grid + center the light-content zones

## Self-Check: PASSED

10-SUMMARY.md, section-video.js, and 10 captures on disk; all 5 commits present; copy-diff 54/54 and script-diff 13/13 green at close.
