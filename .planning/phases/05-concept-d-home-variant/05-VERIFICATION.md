---
phase: 05-concept-d-home-variant
verified: 2026-07-24T21:41:59Z
status: passed
score: 5/5 must-haves verified
human_verification:
  - test: "Real-device video autoplay / play-rejection fallback (iOS Safari, Android Chrome)"
    expected: "hero-video.js's iOS play()-rejection handling keeps the poster visible and the toggle in a correct 'paused/play' state on a real mobile browser, not just headless Chrome"
    why_human: "Puppeteer/headless Chrome cannot reproduce mobile browser autoplay-permission heuristics; hero-video.js's play-rejection branch is unexercised by any automated check"
  - test: "Subjective judgment: are the 8 cards genuinely 'small and enticing' rather than a wall of tiles, and does the video read as 'positive/light motion graphics' rather than generic stock texture"
    expected: "Jon's own aesthetic sign-off on the speculative variant"
    why_human: "COND-03's 'enticing' and the phase goal's 'positive motion-graphics' are subjective brand-fit judgments outside mechanical verification"
---

# Phase 5: Concept D — Home Variant (light video + module cards) Verification Report

**Phase Goal:** A speculative variant of the deployed homepage: sticky nav + logo kept (deployed design), light-mode UI over a full-screen light motion-graphics video, small enticing cards that expand into modals carrying the complete existing section modules (deployed design intact), nav routing to full pages (os/labs/work/contact + mirrored about/insights-hub/chatb2b), accessible (focus trap/Esc/focus-return, real buttons, no-JS fallback, reduced-motion).
**Verified:** 2026-07-24T21:41:59Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Homepage shows deployed sticky nav/logo over a full-screen light motion-graphics video, light-mode UI | ✓ VERIFIED | `concept-d/index.html` header ported verbatim (theme-toggle, logo-glitch intact); `.hero-video-layer` fixed full-bleed video; `<video autoplay muted playsinline loop preload="metadata" poster="assets/video/hero-light-poster.jpg">` with webm source before mp4; captures `index-1440/768/390.png` confirm light theme, legible dark-ink hero copy over grey/white motion-graphics footage |
| 2 | Every section module reachable as a small card that expands into an accessible modal with the complete deployed module intact | ✓ VERIFIED | 8 `<dialog class="module-modal">` DOM-resident, 8 `button.card[data-modal="dlg-*"]`; Puppeteer suite (re-run live, not just trusting SUMMARY): all 8 open on click, close on Esc, focus returns to the invoking card, zero page errors; Problems tabs change content inside the modal, fritz-bg canvas measures >0 width after open, Agents→convo-drawer renders above the dialog top layer (`elementFromPoint` proof), scaffold reparents back to `document.body` on close, Work case image (`/concept-d/assets/img/case-hp-abx.png`) loads with `naturalWidth=960`, InterceptOS→Agents bridge closes dlg-os and opens dlg-agents |
| 3 | Nav routes to standalone pages (os/labs/work/contact) + mirrored pages (about/insights-hub/chatb2b) | ✓ VERIFIED | All 6 targets exist and serve 200 (`pages/os.html`, `pages/labs.html`, `pages/work.html`, `pages/contact.html`, `about.html`, `insights-hub.html`); nav hrefs on index.html point at exactly these targets; independent link-integrity scan (378 links, 8 files) found exactly 1 non-external failure — the pre-existing `about.html#main` skip-link (documented in `deferred-items.md` as inherited from the staging source itself, not a concept-d regression) |
| 4 | Module copy verbatim vs canonical source + visually faithful to deployed sections | ✓ VERIFIED | `qa/copy-diff.py --mode substring` on index+4 pages: 5 pages, 71 chunks, 0 failures (re-run live). `qa/concept-d-script-diff.py`: 13/13 checks pass (re-run live) — all 5 JS data objects byte-identical to staging, 3 case images byte-verified against decoded staging base64, all 4 exclusions hold. Captures of `os-1440.png` show the InterceptOS/Agents modules rendering identically to the deployed design (navy band, mosaic pattern, Flarepop pink accents, tab/card structure) |
| 5 | Reduced-motion, no-JS, keyboard, and Esc/focus-return paths all work | ✓ VERIFIED (1 minor non-blocking anti-pattern) | Reduced-motion: fresh page with `prefers-reduced-motion:reduce` emulated → `video.paused === true` (re-verified live). No-JS: `setJavaScriptEnabled(false)` → 7 fallback anchors + 1 static card visible, all 8 `button.card[data-modal]` hidden (re-verified live). Keyboard/Esc/focus-return: proven per-dialog in Truth 2. One anti-pattern found during my own capture review (see Anti-Patterns table): the new `.video-toggle` button's "Pause" text is invisible (white-on-near-white) in the no-JS path, because the button is new chrome hardcoded to the light-surface background but inherits `--fg` from the base (dark) theme when the JS-only theme-init script never runs. Non-blocking because the button has no click handler at all without JS (hero-video.js wires it), so this is a cosmetic legibility gap on an already-inert control, not a functional or accessibility-path failure |

**Score:** 5/5 truths verified (4 clean, 1 verified-with-documented-minor-issue)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `concept-d/assets/css/deployed.css` | 7/8 staging style blocks verbatim | ✓ VERIFIED | 2111 lines, cascade order preserved, `.hero__video` excluded, `data-theme="light"` present |
| `concept-d/assets/js/deployed.js` | 4 staging script blocks + 5 data objects, 2 permitted edits | ✓ VERIFIED | `node --check` passes; script-diff gate 13/13; contains 6 added null-guards (05-03 fix) for multi-page safety |
| `qa/concept-d-script-diff.py` | Byte-compare gate for JS-templated copy | ✓ VERIFIED | Runs clean, 13 checks, mutation-tested per 05-01-SUMMARY |
| `concept-d/{about,insights-hub,chatb2b}.html` | Mirrored staging pages, hrefs rewritten | ✓ VERIFIED | All 3 exist, serve 200, href-neutralized diff vs staging holds |
| `concept-d/index.html` | Hero video + verbatim hero copy + 8 cards + 8 dialogs + clients strip + scaffold | ✓ VERIFIED | All structural greps pass; 8 dialogs, 8 card buttons, 7 fallback anchors + 1 static; nav/footer/SVG-defs/JSON-LD present |
| `concept-d/assets/css/concept-d.css` | New chrome only (video layer, card field, modal shell, no-JS toggles) | ✓ VERIFIED | All brand greps clean; no transform/filter/backdrop-filter/perspective/contain on `dialog.module-modal` (invariant documented in a comment); 1 legibility gap noted above |
| `concept-d/assets/js/cards.js` | Card→dialog wiring, reparenting, resize dispatch, os→agents bridge | ✓ VERIFIED | `node --check` passes; all wiring proven live via Puppeteer |
| `concept-d/assets/js/hero-video.js` | Reduced-motion pause, play-rejection fallback, visibility pause | ✓ VERIFIED | `node --check` passes; reduced-motion pause proven live |
| `concept-d/pages/{os,labs,work,contact}.html` | Standalone section pages in deployed shell | ✓ VERIFIED | All 4 exist, serve 200, correct module composition + section ids, correct shell (theme-init, deployed.css+concept-d.css, rewritten header/footer, full scaffold, deployed.js only) |
| `.planning/phases/05-concept-d-home-variant/captures/` | ≥10 reviewed QA captures | ✓ VERIFIED | 10 PNGs present, all read and independently judged in this verification (not just trusting the SUMMARY's claims) |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `qa/concept-d-script-diff.py` | `concept-d/assets/js/deployed.js` | brace-counting extraction + byte-compare | ✓ WIRED | 13/13 checks pass on live re-run |
| `concept-d/assets/js/deployed.js` | `concept-d/assets/img/case-*.png` | CASE_IMG paths | ✓ WIRED | Puppeteer proved `img.src` contains `/concept-d/assets/img/case-` and `naturalWidth=960` |
| `concept-d/index.html` | `concept-d/assets/js/deployed.js` | script order (deployed.js before cards.js) | ✓ WIRED | Verified via grep + functional Puppeteer proof (globals like `closeAll`/`openCase` work from cards.js) |
| `concept-d/assets/js/cards.js` | fritz-bg canvases inside dialogs | `showModal()` + synthetic `resize` dispatch | ✓ WIRED | Live Puppeteer: `canvas.fritz-bg` width>0 after Problems dialog opens |
| `concept-d/assets/js/cards.js` | `#scrim/#casePanel/#convoDrawer/#pitchLabs` | reparent into dialog on open, back to body on close | ✓ WIRED | Live Puppeteer: `elementFromPoint` at drawer center resolves inside `#convoDrawer` while a dialog is open (top-layer fix proven); scaffold's `parentElement === document.body` confirmed after dialog close |
| `concept-d/index.html` cards | `pages/*.html` | no-JS fallback anchors | ✓ WIRED | Live Puppeteer with JS disabled: 7 fallback anchors visible, 0 buttons visible |
| `concept-d/pages/os.html` | `#agents` | renderFlow's generated bridge link (same-page anchor) | ✓ WIRED | `id="agents"` present on os.html; link-integrity scan confirms fragment resolves |
| nav hrefs | `pages/os.html, pages/labs.html, pages/work.html, pages/contact.html, about.html, insights-hub.html` | direct href attributes | ✓ WIRED | All 6 targets exist, serve 200; nav hrefs on index.html verified by direct DOM read |

### Requirements Coverage

| Requirement | Source Plan(s) | Description | Status | Evidence |
|-------------|-----------------|-------------|--------|----------|
| COND-01 | 05-02, 05-03 | Sticky nav + logo treatment mirrored from staging, consistent across index + 4 pages | ✓ SATISFIED | Header ported verbatim on all 6 concept-d pages incl. theme-toggle; captures confirm identical rendering |
| COND-02 | 05-02 | Full-screen light motion-graphics video (autoplay muted playsinline loop, poster, WebM+MP4, reduced-motion fallback), light-mode UI | ✓ SATISFIED | Video attrs present, webm-first, budget holds (webm 2.29MB + poster 92KB ≈ 2.38MB), reduced-motion pause proven live |
| COND-03 | 05-02 | Small enticing topic cards, one per section module, over the video | ✓ SATISFIED | 8 cards present, verbatim eyebrow/heading/teaser sourced from staging (parser-checked in 05-02's own Task 1 verify); visual read confirmed via captures |
| COND-04 | 05-02 | Card click expands modal with COMPLETE deployed module intact | ✓ SATISFIED | 8/8 dialogs proven functional live (tabs, drawers, accordion, case images all work inside modals) |
| COND-05 | 05-01, 05-03 | Nav routes to standalone pages; About/Insights/ChatB2B mirrored | ✓ SATISFIED | All 6 destinations exist and serve; link-integrity scan confirms |
| COND-06 | 05-01, 05-02, 05-03 | Module fidelity gate — verbatim copy + visual faithfulness | ✓ SATISFIED | Both copy-diff (substring) and script-diff gates pass on live re-run; visual captures judged faithful |
| COND-07 | 05-02, 05-03 | Modals accessible (focus trap/Esc/focus-return), real buttons, keyboard complete, no scroll-jacking | ✓ SATISFIED | All proven live via Puppeteer; cards are real `<button>` elements; no scroll-jacking observed in captures (natural viewport scroll) |

No orphaned requirements — REQUIREMENTS.md maps exactly COND-01 through COND-07 to Phase 5, and all 7 are claimed across the 3 plans' `requirements` frontmatter fields.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `concept-d/assets/css/concept-d.css` / `concept-d/index.html` | `.video-toggle` rule / `<button class="video-toggle">` | White "Pause" text (`color:var(--fg)` = `#ffffff` in the base/no-JS dark theme) on a near-white `rgba(255,255,255,.92)` background — text is invisible without JS | ⚠️ Warning | Cosmetic only: the button has no click handler without JS (wired by `hero-video.js`), so no functional/accessibility path is broken. Same bug class the 05-03 honest-review pass already found and fixed for `.hero-sub`/`.card-eyebrow`/`.card-teaser`/`.card-heading`, but this one instance on `.video-toggle` was missed. Recommend a follow-up one-line fix using the same `html:not(.has-js)` ink-override pattern already established in concept-d.css. |

No blocker-level anti-patterns found. No TODO/FIXME/placeholder stubs in any phase-authored file (the `placeholder="..."` matches found are legitimate HTML form-input placeholder attributes, not stub markers). No banned tagline, no deprecated hex, no invented hex colors, no gradients, no non-zero border-top/bottom, no `view-transition-name`, no `data-copy`, no `<hr>` in any new-chrome file (all re-verified live).

### Human Verification Required

#### 1. Real-device video autoplay / play-rejection fallback

**Test:** Load `concept-d/index.html` on an actual iOS Safari and Android Chrome device (not just headless Chrome).
**Expected:** `hero-video.js`'s play()-rejection branch keeps the poster frame visible and syncs the toggle to a "paused" state if the browser blocks autoplay; explicit tap-to-play still works.
**Why human:** Headless Chrome always permits `autoplay muted playsinline`; the rejection-handling code path is real but mechanically unexercised by any automated check in this phase.

#### 2. Subjective "small and enticing" / "positive motion-graphics" judgment

**Test:** Review the reveal model as a whole — card sizing/density, and whether the video reads as "positive" motion graphics rather than generic stock texture.
**Expected:** Jon's own aesthetic sign-off, since this is explicitly a speculative variant for his judgment.
**Why human:** COND-03's "enticing" and the phase goal's "positive motion-graphics" are brand-fit/taste calls outside mechanical or even honest-capture-review verification.

### Gaps Summary

No gaps block phase-goal achievement. Every COND-01 through COND-07 requirement is independently confirmed against the live codebase (not just the SUMMARY narratives): both copy-fidelity gates re-run clean, the full 8-dialog reveal model was independently re-tested with a fresh Puppeteer suite (not the SUMMARY's own scratchpad script) covering focus-trap/Esc/focus-return, the two landmine fixes (drawer top-layer stacking, hidden-canvas re-measure), the InterceptOS→Agents bridge, reduced-motion pause, and no-JS degradation — all passed. Nav routing and link integrity were independently re-scanned (378 links, exactly 1 pre-existing non-regression failure matching `deferred-items.md`). Ten captures were read and visually judged in this verification, confirming legibility at 390/768/1440, correct modal composition, deployed-faithful section pages, and correct reduced-motion/no-JS states.

One minor, non-blocking anti-pattern was found during this independent review that the phase's own honest-capture-review pass missed: the new `.video-toggle` "Pause" label is illegible (white-on-white) in the no-JS path. It does not affect any COND requirement (the control is inert without JS regardless of label visibility) and is a trivial follow-up fix using the pattern concept-d.css already established for the other no-JS contrast gaps. Recommend Jon or a future micro-plan apply the same `html:not(.has-js)` ink-override to `.video-toggle` for full polish, but it does not block declaring Phase 5 complete.

---

*Verified: 2026-07-24T21:41:59Z*
*Verifier: Claude (gsd-verifier)*
