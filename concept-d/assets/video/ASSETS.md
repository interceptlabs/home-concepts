# Concept D video assets — provenance

**Source:** Pexels video #29448652 — "Abstract white wavy background design" by Chandresh Ulke
https://www.pexels.com/video/abstract-white-wavy-background-design-29448652/
License: Pexels license (free commercial use, no attribution). Downloaded 2026-07-24 (1920×1080 30fps master, 20s — archived at `reference/video-source/pexels-29448652-master-1080.mp4`).
Selection rationale: Jon's direction — light + positive "emergent motion graphics technology" feel; replaces the dark liquid direction. Soft white particle-wave field, leaves a clean central band for content legibility in light mode.

**Derived files (ffmpeg 8.1.1):**
- `hero-light-loop.mp4` — 20s seamless boomerang loop (10s fwd + reverse), H.264 crf24, ~5.5MB
- `hero-light-loop.webm` — same loop, VP9 crf36, ~2.3MB (list FIRST in `<source>` order)
- `hero-light-poster.jpg` — first frame, ~95KB (LCP protector + reduced-motion fallback)

## Work reel (added 2026-07-24, Phase 7)

- `work-reel-1080.mp4` / `.webm` / `work-reel-poster.jpg` — **v7 (2026-07-25, Jon: cut the stock clips, make it
  spectacular — generate with Weavy):** same two-part structure as v6, but every client footage beat is now
  GENERATED brand-native cinema (Veo 3.1 T2V, 1080p, via Jon's Weavy/Figma Weave account — flow "untitled",
  ~540 credits): WMB navy glass-planes bloom + dusk executive office; AMD gold circuit-trace macro + gold-lit
  server monoliths; HP white curved corridor w/ sweeping blue plane + royal-blue silk ribbons. Gen masters
  archived at `reference/video-source/weavy-gen/`. Reel section CSS now holds true 16:9 (height:min(100dvh-73px,
  56.25vw)) so the film's bottom-anchored titles never crop. MP4 crf24 14.9MB / WebM crf36 15.4MB (weight
  parked per Jon). (v6 (2026-07-25, Jon: stock beats read generic —
  "create more branded looking work using their branding, more cinematic"):** 33.3s, TWO PARTS.
  PART 1 (18.8s): SAP film beats bracketing three DESIGNED mini brand-films (SAP-film grammar: brand color
  card w/ kinetic word-by-word type -> brand panel sliding over graded footage -> full-bleed footage w/ brand
  chip -> closing brand card), rendered frame-by-frame in PIL (`qa/reel-brandfilm.py`):
  - WMB: navy #1B3073/#010F4B (sampled from the dVooy banner), Segoe Sans Display; "Windows means business.",
    "Security that's built in. / Not bolted on." (campaign lines); 4-pane Windows glyph end card.
  - AMD: near-black #02060A + LP gold #C0A764, Klavika Bold Cond Italic; "THE NEW AI DEMANDS", "INNOVATE ON /
    INTELLIGENT INFRASTRUCTURE", "YOUR PATH TO AI-READY INFRASTRUCTURE" (all LP lines); "together we advance_"
    sign-off w/ blinking gold cursor.
  - HP: #024AD8 + the 20-degree stripe system (wipes, angled panel edges), Forma DJR; "Smarter, more secure
    healthcare technology.", "Built for the environments where care happens." (LP lines).
  Footage (Pexels masters in reference/video-source/) is brand-tinted flat (never a gradient).
  PART 2 (15s): Frotion `intercept-campaign-reel-v3.mp4` verbatim. 0.4s dissolves in part 1, 0.5s between parts.
  MP4 crf24 11.1MB / WebM crf36 11.4MB — Jon: don't worry about weight yet.
  (v5 was 31.5s stock+supers;
  PART 1 (17s, client work, quicker pacing): 12 beats — hard cuts INSIDE each client group, 0.4s dissolves
  between groups. WMB glass-wall (#7423515) > typing hands (#18838444) > desk + "Windows means business.";
  AMD aerial campus (#38000679) > teal racks (#5028622) > dark servers + Klavika super; HP CT suite
  (#4468981, delogo'd) > bright doctor (#5234526) > warm tablet + Forma DJR super; SAP film beats open/mid/close.
  PART 2 (15s, Intercept campaign): `~/Creative-Projects/frotion/out/intercept-campaign-reel-v3.mp4` verbatim
  (Frotion output — Coolsweep/Wiretree cards, Intercept end card closes the loop). 0.5s dissolve between parts.
  MP4 crf29 5.8MB, WebM crf44 6.6MB. Muted.
  (v4 was 16.2s / 9 beats,
  all cinematic. Jon flagged v3's LP scroll captures as too busy / text heavy; v4 replaces every "static work"
  beat with SPECULATIVE brand-film beats for the clients — real Pexels footage + each campaign's real headline
  set in the campaign's real typeface (film-super grammar, white lower-left, soft shadow, no scrims):
  - WMB: glass-wall chart review (#7423515) → warm desk laptops (#8134593) + "Windows means business."
    (Segoe Sans Display Semibold, from the WMB project)
  - AMD: aerial data-center campus (#38000679) → dark server racks (#7140928) + "INNOVATE ON /
    INTELLIGENT INFRASTRUCTURE" (Klavika Bold Condensed Italic, gold second line — matches the built LP hero)
  - HP: CT imaging suite (#4468981, UHD source, scanner-maker roundel removed via delogo — can't sit in an
    HP film) → warm clinical tablet scene (#6010957) + "Smarter, more secure healthcare technology."
    (HP Forma DJR Office Bold, from the healthcare ABM LP). v4.1 swap: the two doctor-tablet shots read
    same-y; the imaging suite adds environment variety.
  Intercut with the same three SAP weavy-film excerpts as v3 (`~/Downloads/1003_05F.mp4`: spark type open,
  purple anvil layers, "Uniquely SAP" wheat closer). 0.5s dissolves. All Pexels clips Pexels-licensed, masters
  archived at `reference/video-source/pexels-<id>-master.mp4`. MP4 crf27 3.4MB, WebM crf38 3.1MB (listed
  first), poster 12KB. Muted. Supers rig: `qa/reel-type-supers.py` (PIL) — lines are the campaigns' own
  headlines, verbatim. (v1 stills, v2 SAP+push-ins, v3 LP scrolls — superseded.)

## Section background loops (added 2026-07-25, iteration 5)

Complementary light-family Pexels loops for the explore pages (all Pexels license, boomerang seamless, muted):
- `section-rings.*` — Pexels #30916553 "Elegant white 3D circular lines" → problems, insights
- `section-veil.*` — Pexels #31737798 "Seamless smooth white geometrical background loop" (1920w, natively
  seamless — first/last frame diff 0.5/255) → interceptos, agents. REPLACED section-cubes (Jon: cubes not
  working even slowed; veil is soft flowing white curves, harmonious with rings/geo). mp4 1.0MB / webm 149KB.
- `section-geo.*` — Pexels #34645209 "Seamless white geometric pattern" → labs + 3 case pages
