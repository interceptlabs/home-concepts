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

- `work-reel-1080.mp4` / `.webm` / `work-reel-poster.jpg` — 20.6s campaign-reel montage cut from EXISTING KNOWN WORK on disk:
  the three deployed case visuals (`assets/img/case-{hp-abx,intel-abm,sap-video}.png`, extracted from the deployed homepage)
  + HP Cashmere EliteBook static (HP Campaign/boeing, shipped) + WMB_044.png (Windows Means Business campaign).
  ffmpeg zoompan slow push-ins (~7%/segment), 0.6s crossfades, 5 segments × 4.6s. MP4 crf25 ~4.0MB, WebM crf38 ~3.3MB, poster 144KB. Muted, loop via hard cut (montage beat).
