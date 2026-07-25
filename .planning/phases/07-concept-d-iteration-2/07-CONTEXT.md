# Phase 7: Concept D — Iteration 2 - Context

**Gathered:** 2026-07-24 (Jon's iteration direction, verbatim intent below; work reel already cut)
**Status:** Ready for planning

<domain>
## Phase Boundary

Iteration 2 on `/concept-d/` only. Restructure the homepage for above-the-fold density, add a full-screen work-reel section, convert card expansion to a scaling transition into full-viewport module windows with RESKINNED quieter module content. Requirements ITER-01..08. The other concepts, section pages, and mirrored pages are untouched except where nav/module reuse requires.

</domain>

<decisions>
## Implementation Decisions

### Page structure (top to bottom — LOCKED)
1. **Compact hero (above the fold, shares the first viewport with the card grid)**: verbatim `hero.kicker` + `hero.h1_html` + `hero.sub` at REDUCED scale (think ~40-50% of current visual weight; h1 on one to two lines, blurb one compact paragraph, no oversized vertical padding). Deployed sticky nav + logo stay exactly as-is.
2. **Section-card grid (same first viewport)**: 5 small cards — Problems, InterceptOS, Agents, Labs, Insights. (Work/FAQs/Contact leave the grid: Work gets its own section; FAQs + convert go below-fold plain.)
3. **Client logo strip** — kept in between, exactly the current treatment/position (Jon: "keep the logos in between like you have them").
4. **Work section — full screen**: the campaign reel (ALREADY CUT: `concept-d/assets/video/work-reel-1080.webm/.mp4` + `work-reel-poster.jpg`, provenance in ASSETS.md — built from the 3 deployed case visuals + shipped HP Cashmere + WMB stills) playing full-bleed (muted autoplay loop, poster, reduced-motion static, pause control), with the verbatim work section heading (`work.eyebrow`/`work.h2`/`work.lead`) and **3 small case cards** (HP / Intel / SAP — verbatim `work.cases[i]` name + summary teaser) using the SAME card composition and the SAME scaling card→module transition as the section cards.
5. **Below the fold, plain sections (NOT cards, NOT modals)**: FAQs module, convert ("Give us a chewy problem...") module, footer — the ported deployed modules inline as they render today.

### Card system (ITER-02/03)
- Uniform tile height across the grid; content architecture inside every card: eyebrow/label top, then flexible space, then **copy anchored to the bottom uniformly** (title + one verbatim teaser line + CTA row all bottom-aligned so the baseline rhythm is identical tile to tile).
- Explicit expand CTA on every card (a visible mono label like the verbatim CTA labels where they exist; where the module has no verbatim CTA label, use the section's verbatim eyebrow as the CTA-adjacent label and a neutral affordance like "+" / "Open" — planner may choose the exact affordance but it must be visible, consistent, and not invented marketing copy).
- **Semi-opaque surfaces**: light translucent card fill over the video (flat translucency — NOT a gradient scrim), dark ink text.
- **Hover state that mimics the background video**: on hover the card should feel like the particle-wave field passes through it — acceptable techniques: increase translucency to reveal more video, a slow sine-eased wave/ripple on a card pseudo-element (CSS only), or backdrop-filter shift. Must be calm (sine, long duration), reduced-motion silent, and touch gets a non-hover equivalent (focus state matches).

### Scaling card→module transition (ITER-04)
- Clicking a card SCALES the card into the module window (FLIP-style transform from card rect → near-full-viewport window, sine ease, ~500-700ms; reduced-motion = instant swap). Use same-document View Transitions API where available with a FLIP fallback, or pure FLIP — planner's call, but it must read as "the card grows into the window", not a fade.
- The module window fills roughly the full first-viewport ("above the fold" size), keeps a visible close affordance, Esc + focus-return semantics from the existing cards.js, scroll inside the window if content exceeds it.

### Reskinned quiet modules (ITER-05 — this REPLACES the verbatim-design-port rule for modal content ONLY)
- Copy stays verbatim (chunks from the ported data; copy gates still apply). The PRESENTATION is redesigned: quieter, browsable, click-into-able — "not walls of text".
- Techniques to reach for (researcher to refine): progressive disclosure (one thing visible at a time — steppers/accordions/tabbed slices reusing the module's own interaction data), generous whitespace, type hierarchy over boxes, content revealed on interaction rather than listed, counts/labels as entry points ("13 agents" → grid of names → detail on click), single-column measure caps, no dense multi-column text fields.
- Keep each module's FUNCTIONAL interactions (problems tabs, agent detail, FAQ accordion pattern etc.) but re-clothed in the quieter skin. Light mode, shared tokens, Fritz rules bind this new chrome fully (no rule lines, Flarepop-only colored text, flat surfaces, sine motion).
- Nav-linked standalone pages (pages/os.html etc.) keep the deployed design — the reskin applies to the module windows on the homepage.

### Case-card module windows (ITER-06)
- The 3 case cards open module windows with the same scaling transition, presenting each case quietly: name, client, summary, then challenge/approach/results as progressive disclosure (verbatim copy from `work.cases[i]`), stat as the visual anchor.

### Claude's Discretion
- Exact grid columns (5 cards: e.g. 5-across at wide, 3+2, or asymmetric featured layout), the hover technique choice, module window internal layouts per section, FLIP vs View Transitions implementation
- Work reel section composition details (heading placement over reel, card row position)

</decisions>

<specifics>
## Specific Ideas

Jon, verbatim: "Reduce the size of all elements so most information is above the fold. Faqs and start a conversation and footer can be below and not in cards. After hero section should be a work showcase with large work reel full screen. (Find spec and create from existing known work). Above the fold is headline copy and blurb. Reduce size here so we have some space for the remaining cards with the sections. Card type needs to align to top and bottom consistently so tiles are at same height and copy is anchored below uniformly. Cards should have cta to expand. Card expansion is a scaling transition to modular window with reskinned section module content. The aim for these content modules is to not look like walls of text but something to click into. Find techniques to make this UI quieter but understandable. These cards should be small but modules go full 'above the fold' section. Small cards should be semi-opaque and have interesting hover state that mimics the background video. For next 'work' section go full screen with campaign reel and have three small cards linking to similar card to content module transitions and composition. oh and keep the logos in between like you have them."

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- Everything from Phase 5: `concept-d/assets/js/{deployed,cards,hero-video}.js`, `deployed.css`, `concept-d.css`, the 8 dialogs (to be restructured: 5 section modals reskinned, work/faqs/convert leave the dialog set; +3 case modals added)
- `concept-d/assets/video/hero-light-loop.*` (hero video, stays) + `work-reel-1080.*` (NEW, cut and committed)
- `qa/copy-diff.py` substring mode + `qa/concept-d-script-diff.py` (both must stay green)
- Drawer-scaffold reparenting + canvas resize idioms in cards.js (keep for modules that use drawers; the convert drawer moves inline below-fold — its scaffold interplay needs rechecking)

### Established Patterns
- Serve :4340 local ONLY (Jon: never deploy); captures via Puppeteer + installed Chrome + setViewport; honest capture review
- Brand greps scope: new chrome only; deployed.css/js exempt; but the reskinned module-window chrome is NEW chrome — fully bound by Fritz rules

### Integration Points
- Root gallery thumbnail for Concept D will be stale after this — refresh `assets/gallery/concept-d.png` at the end
- REVIEW.md's Concept D section needs a one-paragraph update

</code_context>

<deferred>
## Deferred Ideas

- Real client-footage work reel (current reel is stills-montage from known work; revisit if Jon supplies motion footage)
- Reskinning the standalone section pages to match the quiet modules (keep deployed design there for now)

</deferred>

---

*Phase: 07-concept-d-iteration-2*
*Context gathered: 2026-07-24*
