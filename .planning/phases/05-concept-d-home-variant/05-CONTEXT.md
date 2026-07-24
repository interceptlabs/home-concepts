# Phase 5: Concept D — Home Variant (light video + module cards) - Context

**Gathered:** 2026-07-24 (from Jon's redirect message, verbatim intent below; video already sourced)
**Status:** Ready for planning

<domain>
## Phase Boundary

A speculative variant of the DEPLOYED homepage at `/concept-d/`, for Jon + Claude to iterate on. The existing home sections are fine functionally and visually — they are NOT redesigned. What changes is the reveal: light-mode UI over a full-screen light motion-graphics video, small enticing cards that expand into modals carrying the complete section modules, and nav routing to full pages. Requirements COND-01..07.

</domain>

<decisions>
## Implementation Decisions

### Source of truth = the deployed bundle (NOT the earlier concepts)
- Mirror `~/Creative-Projects/intercept-website-staging/home.html` — "the latest content we've uploaded to the deploy server. The one with the about page and the insights and the chatb2b page."
- **Keep the sticky nav + logo treatment exactly as deployed**: header markup/CSS ported verbatim (nav: InterceptOS · Intercept Labs · Work · About · Insights · Contact).
- **Section modules ported intact**: markup + styles + behavior (problems tabs, agents grid + detail pane, FAQ accordion, work cards, convert form drawer etc.) lifted from the staging page. Copy stays byte-identical by construction. Do not restyle the modules; only their container changes (modal / page shell).
- Light mode: the deployed site IS light — port its light tokens/styles as-is.

### The reveal model (Jon's spec, verbatim intent)
- Full-screen light positive motion-graphics video background (ALREADY SOURCED — `concept-d/assets/video/hero-light-loop.webm/.mp4` + `hero-light-poster.jpg`, provenance in ASSETS.md; muted+playsinline+loop+poster, WebM first, reduced-motion → static poster, pause control, visibility pause — the proven Concept B idioms).
- Over the video: the deployed hero copy (kicker + h1 + sub, verbatim) plus a field of **small cards, one per home section module** — Problems, InterceptOS, Agents/Capabilities, Work, Labs, Insights, FAQs, Contact. Cards are enticing but small: verbatim eyebrow/heading + one verbatim teaser line, on light surfaces legible over the video. Cards are real `<button>`s.
- **Card click → modal-type window containing the COMPLETE section module** (the deployed section, fully functional — tabs/accordions/drawers work inside the modal). `<dialog>` + showModal, focus trap, Esc, focus-return (Concept B's proven panels.js idioms, adapted; module JS runs inside).
- Clients logo strip: shown as a quiet inline trust strip on the homepage (not hidden behind a card).
- **Nav click → full page with that content**: `os.html` (InterceptOS + agents modules), `labs.html`, `work.html`, `contact.html` (convert + FAQs) generated from the same ported modules in a standard page shell (deployed header/footer). About + Insights nav items link to `about.html` and `insights-hub.html` **mirrored verbatim from the staging bundle** into concept-d (plus `chatb2b.html` since insights links to it); their internal links may point back within concept-d where trivial, otherwise left as-is and noted.
- No scroll-jacking; if the card field overflows small viewports it scrolls natively. No-JS fallback: cards degrade to plain anchor links to the section pages.

### Copy discipline
- Module porting is verbatim by construction. Gate: `qa/copy-diff.py` in **substring mode** against concept-d homepage + generated section pages (canonical chunks must appear verbatim). Mirrored staging pages (about/insights-hub/chatb2b) are exempt from the gate (they ARE the source).
- Brand greps still apply to NEW chrome we author (card field, modal shell): no banned tagline, no deprecated hexes, no invented rule lines in new CSS (ported deployed CSS is exempt — it is the approved live design), Flarepop-only colored text in new chrome.

### Claude's Discretion
- Card field layout/geometry over the video; modal sizing/scroll behavior for long modules
- How much of staging's inline JS ports wholesale vs scoped per-module
- Section page composition details (within "deployed design intact")

</decisions>

<specifics>
## Specific Ideas

Jon, verbatim intent: "Keep sticky nav, logo treatment, show full screen emergent motion graphics technology video (nothing dark and ominous like the one you picked, so something lighter and more positive feeling) then small cards that entice the user to explore the modules that now exist as sections on the home page. These can then expand to modal type windows to explore more. If a user uses the nav, they'll go to pages with that content."
- "The sections on the home page are fine for now functionally, and designed fine, we just want to reveal it independently. Same for all the sections."
- "We can keep the navigation, but redundantly show small cards that can expand to show the complete section module."
- This is "a variant of our home page as a speculative thing for you and I to work on" — expect iteration; build it clean and easy to tweak.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `~/Creative-Projects/intercept-website-staging/home.html` — THE source: self-contained deployed homepage (inline tokens/CSS/JS data objects); also `about.html`, `insights-hub.html`, `chatb2b.html` (+ insights article pages they link to) and `assets/video|podcast`
- `concept-d/assets/video/*` — the sourced light loop (see ASSETS.md)
- `qa/copy-diff.py` substring mode; `content/homepage.json` (canonical chunks, prose byte-identical to staging sections)
- Concept B's dialog/panels + video.js idioms (focus trap, Esc, focus return, play-rejection fallback, visibility pause) — copy the idioms into concept-d's own JS
- Puppeteer + installed Chrome + setViewport capture rig

### Established Patterns
- Serve via ./serve.sh :4340; concepts isolated (concept-d never references concept-a/b/c)
- Atomic commits; mechanical verify blocks; captures reviewed honestly

### Integration Points
- Consumes staging bundle (read-only mirror) + concept-d/assets; the root gallery gains a Concept D card in Phase 6
- Phase 6 covers Fritz QA + packaging across A/B/C/D

</code_context>

<deferred>
## Deferred Ideas

- Generating a true company work reel from Intercept motion assets (social-builder renders have baked-in copy; revisit if Jon supplies reel footage)
- Card-to-modal morph transitions (View Transitions named morphs)
- Insights article pages beyond the hub (mirror only what nav needs)

</deferred>

---

*Phase: 05-concept-d-home-variant*
*Context gathered: 2026-07-24*
