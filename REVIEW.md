# Review guide

Four homepage concepts, one frozen content source, ready for side-by-side review. Everything here is local only — nothing has been deployed anywhere.

## How to run

From the repo root: `./serve.sh`, then open `http://localhost:4340/`. That starts a plain static file server on port 4340 — no build step, nothing to install. The root page is a gallery with a card for each concept; click a card to open that concept's homepage, and each concept links onward to its own sub-pages from there.

## The four concepts

**Concept A — Editorial** is a card-driven homepage in the "Accenture, but better" spirit: one strong hero statement with a single primary CTA, then an oversized-type editorial card grid where each card carries its own specific CTA label. Cards route to five derived sub-pages (InterceptOS, Insights, and three work case pages) using cross-document View Transitions where the browser supports them.

**Concept B — Full-Screen Video** opens on a full-bleed muted ambient video loop with labeled hotspots layered over it. Clicking a hotspot first opens an inline chapter panel — a preview, not a jump-cut — and from there you can continue to the full sub-page (Problems, InterceptOS, Work).

**Concept C — Experimental WebGL/3D** uses a three.js scene as the navigation metaphor: scrolling drives the camera through six topic objects in a spatial field, each with a clickable, keyboard-focusable label. Below the fold it's standard DOM. A semantic DOM mirror of the same navigation exists alongside the 3D layer and is shown outright when WebGL is unavailable, and rendering is device-tiered so it degrades gracefully on weaker GPUs rather than stalling or going blank.

**Concept D — Home Variant** is the odd one out on purpose: it's a speculative variant of the currently deployed homepage rather than a new structural idea, now in its third iteration. It keeps the deployed site's sticky nav and logo treatment and its full-screen light-mode motion-graphics video, but the homepage itself is restructured: a top-anchored hero sits close under the sticky nav with a full 5-card grid filling the remainder of the first viewport, hovering a card gives it an unmistakable lift with the CTA flipping to Flarepop, a full-screen cinematic work reel follows — a 31.5s two-part montage — part one intercuts the weavy.ai SAP film with designed mini brand-films for Windows, AMD, and HP — brand color cards, kinetic type, brand panels over graded footage, each in the campaign’s own palette and typeface; part two is the Frotion Intercept campaign reel — carrying a single “Explore our work +” button that routes to the work landing page (reel hero + case grid), and every card navigates to its own standalone quiet page with a prominent "back to home" link, showing one problem, one workflow stage, or one Challenge/Approach/Results section at a time instead of dumping the whole module at once. FAQs, the conversation starter, and the footer stay as plain below-fold sections. Nav items route to standalone pages built from the same modules, and About/Insights/ChatB2B are mirrored straight from the deployed bundle.

Look at Concept D first — it's the one Jon asked to be built and is the closest read on "does this direction work," with the other three as structural alternatives to weigh against it.

## What to try

**Concept A**
- Click a work card to open its case page
- Scroll — sections reveal sparingly, not all at once
- Open InterceptOS from the card grid

**Concept B**
- Click a hotspot label to open its chapter panel
- Continue from a panel to its full page
- Use the hero pause control

**Concept C**
- Scroll through the field
- Tab to a topic label and press Enter
- The topic index works without WebGL

**Concept D**
- Click a card and follow it to its quiet page, then use the back link to return home
- Hover a card and watch the fill thin, lift, and its CTA flip to Flarepop
- Scroll to the work reel and let the cinematic montage play (SAP film beats + speculative Windows / AMD / HP brand-film beats), then follow “Explore our work +” to the work landing page
- Open a case card for its Challenge/Approach/Results
- Try reduced-motion or no-JS — both have working fallbacks

States worth checking on any of them: reduced-motion (B falls back to its poster frame, C freezes to a static scene, D's video pauses on its poster), no-JS (A, C, and D all have working fallbacks without any script running), and keyboard-only paths (B's hotspots, C's topic labels, D's modals — Tab in, Esc out, focus returns to the card that opened it).

## Where the QA evidence lives

Each concept has its own capture set and QA record:
- Concept A: `.planning/phases/02-concept-a-editorial-accenture-but-better/captures/` (9 captures) and the QA table in `02-03-SUMMARY.md`
- Concept B: `.planning/phases/03-concept-b-full-screen-video/captures/` (11 captures) and the QA table in `03-03-SUMMARY.md`
- Concept C: `.planning/phases/04-concept-c-experimental-webgl-3d/captures/` (33 captures), `04-VERIFICATION.md`, and the `04-03`/`04-04` summaries
- Concept D: `.planning/phases/08-concept-d-iteration-3/captures/` (12 captures covering the top-anchored/enlarged hero at both fold sizes, the obvious card hover state, and all 8 standalone explore pages plus the Labs drawer open), with the full behavior pass (fold, hover, nav round-trips, drawers, reel v2 playback, reduced-motion, no-JS) recorded in `08-02-SUMMARY.md` and the QA table in `08-01-SUMMARY.md`. Iteration 2's evidence — `.planning/phases/07-concept-d-iteration-2/captures/` (23 captures covering the compact hero/card grid, work reel, card-to-window morph, all 8 quiet module windows, reduced-motion, and no-JS) and `07-01-SUMMARY.md`/`07-02-SUMMARY.md`/`07-03-SUMMARY.md` — documents the module-dialog structure this iteration replaced with standalone pages. The original build's evidence — `.planning/phases/05-concept-d-home-variant/captures/` (10 captures) and `05-VERIFICATION.md` — still documents the deployed-bundle port this iteration builds on.

Cross-concept evidence lives in `.planning/phases/06-cross-concept-qa-review-packaging/`: `06-01-SUMMARY.md` has the consolidated mechanical QA table (copy-diff, script-diff, link integrity, brand greps, video budgets, all four concepts in one pass), `captures/gallery-390.png` and `captures/gallery-1440.png` are the reviewed gallery captures, and `06-FRITZ-QA.md` is the Fritz brand agent's sign-off — the judgment layer on top of the mechanical checks, covering logo geometry, color-role discipline, and mark-placement rules across all five surfaces (the four concepts plus this gallery).

## Known notes

**A Fritz brand review ran on this phase and found three things worth flagging even though they're now fixed.** The static lockup SVG (used by the gallery, Concept B, and Concept C) had its wordmark shifted down by a stray transform, dropping the triangle base to descender depth instead of the wordmark baseline; Concept A was embedding that same lockup via `<img src>`, which made the wordmark render invisible (black-on-dark) since `currentColor` can't inherit through an image reference; and Concept C's fixed topbar had no background, so the hero headline could scroll underneath and collide with the lockup, with a similar label-over-headline collision at narrow widths. All three were fixed and re-verified against fresh renders — see `06-FRITZ-QA.md` for the full finding-by-finding detail, including a short list of lower-priority style notes (off-scale opacity values, missing display-type letter-spacing, a couple of blurred card shadows on Concept D) that were left as-is and noted for Jon rather than treated as blocking.

**Concept C's device-tier degradation is verified by code heuristic and capture, not by hand on real low-tier hardware.** The tiering logic and its effects are confirmed in the source and in captures at different simulated tiers, but actually running it on an integrated GPU or a mid-range phone is the one check left for a human to do on-device.

**`concept-d/about.html`'s skip-link points at `#main`, and there's no `id="main"` on that page.** This is a pre-existing bug in the staging site itself — verified byte-identical at the same line numbers in the source being mirrored — and About is a locked, verbatim-mirrored page, so it was deliberately left alone rather than fixed in the mirror. Documented in `.planning/phases/05-concept-d-home-variant/deferred-items.md`.

**Concept D's JS-templated copy is gated by a script-diff check, not a rendered-DOM diff.** `qa/concept-d-script-diff.py` byte-compares the ported `deployed.js` data objects against the canonical source, plus a substring copy-diff on the static HTML — together they cover the verbatim rule for this concept. A Puppeteer-rendered-DOM copy-diff variant (diffing the page after the deployed script has actually run and templated its content into the page) was identified as the more thorough version of this check back in the concept's own research phase, but was never built — it remains a deferred idea, not a gap that was missed.
