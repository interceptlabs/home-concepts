# Concept B video assets — provenance

**Source:** Pexels video #29848606 — "Abstract black liquid motion background" by 3D Render
https://www.pexels.com/video/abstract-black-liquid-motion-background-29848606/
License: Pexels license (free for commercial use, no attribution required). Downloaded 2026-07-24 (1920×1080 30fps master, 60s — archived at `reference/video-source/pexels-29848606-master-1080.mp4`).

**Derived files (ffmpeg 8.1.1):**
- `hero-loop-1080.mp4` — 24s seamless boomerang loop (12s forward + reverse), H.264 crf29, 1920×1080, muted, faststart, ~5.9MB
- `hero-loop-1080.webm` — same loop, VP9 crf42, ~4.9MB (list FIRST in `<source>` order)
- `hero-poster.jpg` — first frame, q3, ~149KB (LCP protector + reduced-motion/static fallback)

Boomerang construction guarantees a seamless loop point (last frame = first frame).
