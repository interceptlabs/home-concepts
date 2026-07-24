# Concept C vendored libraries — provenance

- `three.module.js` — three.js **0.185.0** (MIT license), fetched 2026-07-24 from
  https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.module.js
- `three.core.js` — same release; `three.module.js` does `import './three.core.js'`, so BOTH files are required.
  Vendored locally so the prototype runs with no CDN/network dependency and no build step. Verified loadable via `node --input-type=module`.
