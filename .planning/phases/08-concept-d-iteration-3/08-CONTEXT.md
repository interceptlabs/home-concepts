# Phase 8: Concept D — Iteration 3 - Context

**Gathered:** 2026-07-25 (Jon's third-round notes; reel v2 already cut and committed)
**Status:** Ready for planning

<domain>
## Phase Boundary

Third iteration on `/concept-d/` only: hero position/scale, cards navigate to pages instead of modals, obvious hover, reel v2 (done). Requirements IT3-01..04.

</domain>

<decisions>
## Implementation Decisions

### Hero (IT3-01)
- Headline moves UP close under the sticky nav: `.hero-viewport` stops center-justifying — content starts near the top (small gap under the topbar), cards fill the remainder of the viewport.
- Headline gets BIGGER: raise the `.hero-d .hero-h1` clamp meaningfully (target roughly 44-56px at 1440 — planner computes the exact clamp so the fold still holds at 1440×900 AND 1280×800 with all 5 cards; the freed vertical space from top-anchoring pays for the larger type).
- Kicker + blurb stay compact; blurb measure unchanged.

### Cards → pages (IT3-02 — replaces the modal system on the homepage)
- All 8 cards (5 sections + 3 cases) become real `<a>` navigations to standalone QUIET pages: `concept-d/pages/explore/{problems,interceptos,agents,labs,insights,case-hp-abx,case-intel-abm,case-sap-video}.html`.
- Each page hosts the SAME quiet module content that lived in the dialogs (quiet-modules.js renders; copy read live from the deployed data objects — port the quiet render calls to run on these pages; the deployed data script must load there).
- Page shell: deployed sticky header (as other concept-d pages) + a **clear, consistent way back**: a prominent "← Back to home" affordance at the top of the content (mono, visible, first focusable element after the header) AND the lockup still links home. Footer optional/slim.
- Homepage dialogs removed (the 8 module `<dialog>`s + morph JS retire; keep Esc/focus code only where drawers remain). Drawer scaffold: agents detail contact + labs pitch still need drawers ON THE EXPLORE PAGES — the scaffold + deployed drawer logic must exist on those pages (same reparent/no-transform constraints do not apply since there are no dialogs — drawers work as on the deployed site).
- Cross-document View Transitions (`@view-transition { navigation: auto; }` — already proven in this repo) give the navigation a soft cross-fade; the card scaling morph retires with the modals.
- No-JS: cards are plain anchors — they now work without JS by construction (the old fallback links retire).

### Obvious hover (IT3-03)
- Make it unmistakable, still brand-calm: combine (a) translucency drop 75%→~40%, (b) a visible lift + larger shadow, (c) the card's expand CTA (`OPEN +` → now reads as a visit affordance, keep label or switch to `VIEW +` — keep neutral chrome wording) flipping to Flarepop text, and (d) a slight scale (~1.02). Sine-eased, 300-450ms; focus-visible gets the identical state; touch unaffected.
- This replaces the "subtle" staged decision from Phase 7 — Jon explicitly wants obvious.

### Reel (IT3-04 — DONE, verify only)
- `concept-d/assets/video/work-reel-1080.{mp4,webm}` + poster are ALREADY v2 (weavy.ai SAP brand film excerpts intercut with the case visuals; provenance in ASSETS.md). The phase only verifies playback/budget and refreshes any stale captures.

### Claude's Discretion
- Exact clamp numbers, explore-page layout composition (within quiet-module patterns), whether case pages share one template

</decisions>

<specifics>
## Specific Ideas

Jon, verbatim: "On homepage the main headline can move up closer to the sticky [nav]. It can also be bigger. The cards should open up a new page not a mod[a]l window, but with a clear way to get back to the homepage, create a more obvious ho[v]er state for those cards[.] for the work section use the weavy.ai work we just made and incorporate into this re[e]l"

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `quiet-modules.js` (all quiet renders — reusable on pages), `cards.js` (morph/dialog logic to retire), `concept-d.css` (card + window styles — window styles become page styles), the 8 dialog interiors in index.html (their markup seeds the explore pages)
- Deployed header/footer idioms from concept-d/pages/*.html; drawer scaffold markup portable
- `qa/copy-diff.py` substring + `qa/concept-d-script-diff.py` gates; capture rig

### Established Patterns
- LOCAL ONLY (:4340); honest capture review; fold proofs at 1440×900 + 1280×800; link integrity with the documented allowlist

### Integration Points
- REVIEW.md Concept D paragraph + gallery thumbnail refresh at the end
- pages/os.html etc. (deployed-design nav pages) unchanged

</code_context>

<deferred>
## Deferred Ideas

- Named-element cross-document View Transition morph (card→page hero) — v2 polish
- Reel motion-graphics treatment of the case stills (current push-ins fine)

</deferred>

---

*Phase: 08-concept-d-iteration-3*
*Context gathered: 2026-07-25*
