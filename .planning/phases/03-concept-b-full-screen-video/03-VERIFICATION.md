---
phase: 03-concept-b-full-screen-video
verified: 2026-07-24T16:48:53Z
status: passed
score: 5/5 must-haves verified
---

# Phase 3: Concept B — Full-Screen Video Verification Report

**Phase Goal:** A visitor experiences a full-bleed video homepage with a clear progressive-reveal mechanism instead of a wall of text, and can click through to focused sub-pages.
**Verified:** 2026-07-24T16:48:53Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Homepage hero plays full-bleed muted ambient video automatically (autoplay muted playsinline loop, poster, WebM+MP4) | ✓ VERIFIED | `concept-b/index.html:18-24` — `<video class="hero-stage__video" autoplay muted playsinline loop preload="metadata" poster="/concept-b/assets/video/hero-poster.jpg" aria-hidden="true" tabindex="-1" disablepictureinpicture>` with `<source ...webm>` listed before `<source ...mp4>` |
| 2 | Visible, labeled hotspot overlays sit over video regions with visible labels always shown (no mystery-meat), keyboard-focusable | ✓ VERIFIED | 6 `<button class="hotspot" data-panel="…">` inside `<nav aria-label="Explore">` with always-visible `.hotspot__label` spans (never opacity:0/hover-reveal), `.hotspot:focus-visible` Flarepop outline ring at `concept-b.css:192-195`, `min-width/min-height: 44px` hit areas |
| 3 | Clicking a hotspot first reveals an inline chapter preview panel, then navigates to the full derived sub-page | ✓ VERIFIED | 6 statically-authored `<dialog id="panel-{id}" class="chapter-panel">` in index.html (grep count = 6), `panels.js` wires every `[data-panel]` to `showModal()`, panel CTAs (`a.panel-cta`) close-before-navigate to `/concept-b/pages/{problems,interceptos,work}.html`; Labs swaps to Contact via `data-panel-swap`; Insights/Contact remain teaser-only by design (never a dead link) |
| 4 | With prefers-reduced-motion set, homepage renders static poster with standard visible navigation, no autoplay, no sound | ✓ VERIFIED | `video.js` explicitly calls `video.pause()` + `setToggleState(false)` when `prefersReducedMotion` is true (overriding the native `autoplay` HTML attribute, a real bug caught and fixed during 03-03's QA sweep); CSS `@media (prefers-reduced-motion: reduce)` block forces `animation:none; transition:none` on hero/hotspots/toggle/panels; hotspot nav stays fully visible/usable; video files carry no audio track (structural no-sound) |
| 5 | Video hero stays within a sane byte budget with poster-frame LCP protection, no layout shift on video load | ✓ VERIFIED | WebM (4,858,475B) + poster (148,609B) = 5,007,084B, mechanically confirmed ≤ 7,340,032B (7MB) budget; poster preloaded via `<link rel="preload" as="image" fetchpriority="high">` (LCP protector, since `fetchpriority` is invalid on `<video>`); `.hero-stage { height:100vh; height:100svh; }` reserves the full viewport at load (zero CLS) |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `concept-b/index.html` | Video hero shell + 6 dialogs + hotspots + topbar + no-JS fallback | ✓ VERIFIED | 24,906 bytes; all structural elements present, wired |
| `concept-b/assets/css/concept-b.css` | hero-stage/hotspot/panel/motion styling, tokens-only | ✓ VERIFIED | 23,400 bytes; `100svh`, `@starting-style`, `allow-discrete`, `@view-transition`, `prefers-reduced-motion` block all present |
| `concept-b/assets/js/video.js` | Reduced-motion-gated attemptPlay + battery/rejection guards | ✓ VERIFIED | `prefers-reduced-motion`, `aria-pressed`, `visibilitychange`, `IntersectionObserver`, `userPaused`, rejection `.catch()` all present; `node --check` clean |
| `concept-b/assets/js/panels.js` | Dialog open/close/swap/focus-return, close-before-navigate | ✓ VERIFIED | `showModal`, `addEventListener('close'...)`, `data-panel-swap` all present; zero `innerHTML`/`textContent=` copy assignment; `node --check` clean |
| `concept-b/pages/problems.html` | Full Problems sub-page, 4 items at full depth | ✓ VERIFIED | 15,407 bytes; copy-diff passes 36 chunks; item 3's empty `signalNum` correctly skipped |
| `concept-b/pages/interceptos.html` | Full InterceptOS sub-page, 4 flows × 4 stages + 13-agent roster | ✓ VERIFIED | 35,730 bytes; copy-diff passes 173 chunks; stage-3 empty `agents: []` iterated correctly (renders nothing, no key-existence guard) |
| `concept-b/pages/work.html` | ONE consolidated Work page, all 3 cases at full depth | ✓ VERIFIED | 17,465 bytes; copy-diff passes 40 chunks; variable-length results (4/4/5) iterated per-index; `agents` rendered as single string, never iterated |
| `.planning/phases/03-concept-b-full-screen-video/captures/` | ≥11 reviewed QA captures | ✓ VERIFIED | 11 PNGs present (9 responsive JS-off + 2 panel-open JS-on), all >8KB (no blank/trivial captures) |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `concept-b/index.html` | `concept-b/assets/video/hero-loop-1080.webm` | `<source>` before MP4 | ✓ WIRED | Line 22 (webm) precedes line 23 (mp4) |
| `concept-b/index.html` | `concept-b/assets/js/video.js` / `panels.js` | deferred `<script>` tags | ✓ WIRED | Both present at end of `<body>`, `defer` attribute set |
| `.hotspot[data-panel]` | `dialog#panel-{id}` | `panels.js` → `showModal()` | ✓ WIRED | All 6 hotspot ids match 6 dialog ids 1:1; topbar CTA (`data-panel="contact"`) also wired |
| Panel full-page CTA anchors | `/concept-b/pages/{problems,interceptos,work}.html` | `dialog.close()` then default navigation | ✓ WIRED | 3 `a.panel-cta` elements with correct hrefs; `panels.js` closes dialog synchronously in the same click handler before navigation |
| `panel-labs` CTA | `panel-contact` | `data-panel-swap="contact"` handled in panels.js | ✓ WIRED | `data-panel-swap` attribute present + handled; `lastInvoker` preserved through the swap for correct focus-return |
| `concept-b/assets/css/concept-b.css` | cross-document View Transitions | `@view-transition { navigation: auto; }` | ✓ WIRED | Exactly one `@view-transition` rule (line 8), serves all 4 pages; no `view-transition-name` anywhere (no named morphs) |
| Sub-pages | `/concept-b/` | persistent back link | ✓ WIRED | All 3 sub-pages have both a lockup link and an explicit `← Concept B` back link to `/concept-b/` |
| `video.js` | document visibility + hero-stage intersection | `visibilitychange` + `IntersectionObserver` | ✓ WIRED | Both pause on hide/scroll-away, resume only if `!userPaused` |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| CONB-01 | 03-01 | Full-bleed muted ambient video hero, autoplay muted playsinline loop, poster, WebM+MP4 | ✓ SATISFIED | Video markup verified with all 7 attributes; WebM-before-MP4 order confirmed |
| CONB-02 | 03-01 | Clickable hotspot overlays with visible label/affordance, no mystery meat | ✓ SATISFIED | 6 always-visible labeled hotspot buttons, `:focus-visible` rings, ≥44px hit areas |
| CONB-03 | 03-02 | Hotspot → inline chapter preview panel → full derived sub-page | ✓ SATISFIED | 6 dialogs, panels.js open/close/swap/focus-return, close-before-navigate, 3 full sub-pages, no dead links |
| CONB-04 | 03-03 | prefers-reduced-motion renders static poster + standard nav, no autoplay sound | ✓ SATISFIED | video.js pauses + overrides native autoplay attribute under reduced motion (bug found and fixed in 03-03); CSS reduced-motion block forces instant final states; no audio track in files |
| CONB-05 | 03-01 + 03-03 | Byte budget with poster-frame LCP protection, no CLS | ✓ SATISFIED | WebM+poster = 5.01MB ≤ 7MB budget; poster `fetchpriority="high"` preload; `100svh` hero-stage reserves viewport |

No orphaned requirements — all 5 CONB-IDs declared in REQUIREMENTS.md are claimed across the three phase plans (03-01: CONB-01/02/05; 03-02: CONB-03; 03-03: CONB-04/05).

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | None found | — | Full 8-grep brand suite (banned tagline, deprecated 12-path hexes, `<hr>`, border-top/bottom hairlines, raw-hex colored text, non-Flarepop colored-text vars, `gradient(`, `view-transition-name`) returns zero matches across all of `concept-b/` |

No stub patterns detected: `video.js` and `panels.js` both contain functioning logic (not `console.log`-only or empty-handler stubs); `panels.js` verified to contain zero `innerHTML`/`textContent=` writes (copy stays 100% static/annotated); no `return null`/`return {}` placeholder functions found.

### Human Verification Required

None required for programmatic pass — all must-haves were mechanically verifiable (copy-diff exit codes, grep patterns, byte-size arithmetic, file existence, static code inspection of event wiring). The phase's own 03-03 plan already performed the browser-behavior checks that would otherwise need a human (Puppeteer functional checks for reduced-motion pause, visibilitychange/IntersectionObserver pausing, focus-return through Esc/Close/swap, and 11 reviewed responsive/panel captures), and those results are corroborated by the static code present in `video.js`/`panels.js`/`concept-b.css`.

Optional (not blocking) follow-up for Jon during Phase 5's cross-concept review:
- Confirm the loop-wide contrast fix (hero-copy-wrap overlay strengthened to 58%, hotspot overlay to 48%/65%) reads correctly on a real display, not just in the reviewed capture PNGs.

### Gaps Summary

No gaps. All 5 observable truths verified, all 8 required artifacts pass exists/substantive/wired checks, all 8 key links wired, all 5 CONB requirements satisfied with no orphans, and the full brand anti-pattern grep suite is clean. `qa/copy-diff.py --all concept-b` exits 0 with 340 chunks checked across 4 pages, 0 failures.

---

*Verified: 2026-07-24T16:48:53Z*
*Verifier: Claude (gsd-verifier)*
