# Phase 9: Concept D — Iteration 4 (quick round, orchestrator-executed)

**Jon's notes (2026-07-25):** headline down 69px; cards up underneath the copy; break headline after "ambitious"; headline +15pt; Inter (not Geist) for eyebrows/labels; hover tinting (cards too spare); reel: no big center overlay — discreet landscape cards at the bottom with a CTA headline beside them.

**Shipped (index.html + concept-d.css only):**
- `.hero-viewport` padding-top 20→69px; card grid `margin-top: auto→0` (cards sit under the blurb); gap 24→36px
- `<br class="hero-br">` after `<em>ambitious</em>` (hidden <700px); h1 clamp 34-54px → 42-74px, line-height 1.08
- Inter override block for `.kick/.card-eyebrow/.card-cta/.explore-back/.idx/.clients-lbl/.reel-toggle/.video-toggle` (Inter already in the fonts link; deployed.css untouched)
- Hover: Flarepop-tinted wash `rgba(255,220,250,.62)` + Flarepop border + eyebrow flips Flarepop (focus/active parity)
- Reel: center heading panel removed; bottom grid `.reel-bottom` = `.reel-cta` (verbatim eyebrow/h2/lead) beside `.reel-cards` (3 stacked `.card--landscape`: eyebrow | title | VIEW +, teaser display:none, copy stays in DOM); section justify-content flex-end

**Gates:** copy-diff substring index 35/35 clean; script-diff 13/13; captures judged (fold 1440 + reel + hover + fold 1280 taken; fold-1440 and reel read correct).
