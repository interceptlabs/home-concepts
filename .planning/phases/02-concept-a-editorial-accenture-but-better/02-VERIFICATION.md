---
phase: 02-concept-a-editorial-accenture-but-better
verified: 2026-07-24T05:00:00Z
status: passed
score: 6/6 must-haves verified
---

# Phase 2: Concept A — Editorial ("Accenture, but better") Verification Report

**Phase Goal:** Concept A homepage working locally — Accenture-style structure executed better with the Fritz brand system: single strong hero + ONE primary CTA, editorial card grid with distinct content-specific CTAs, restrained trust signals, click-through to derived sub-pages (View Transitions), sparing kinetic motion with reduced-motion guards, brand-compliant imagery.
**Verified:** 2026-07-24T05:00:00Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Homepage opens with verbatim hero + exactly ONE primary CTA, no carousel | ✓ VERIFIED | `index.html:35` single `data-copy="hero.cta.label"` anchor ("Explore more"); zero `carousel/autoplay/setInterval/slick/swiper` hits anywhere in concept-a/ |
| 2 | Editorial card grid with oversized clamp() type, distinct content-specific CTAs per card type | ✓ VERIFIED | Card grid (3 episodes + Labs), work cards, convert tile each carry distinct verbatim labels (`Explore more` / `Spotify`·`Apple`·`YouTube` / `Build with Labs` / case names / `start the conversation` / `Open the form.`); zero generic "Expand"/"Read more"/"Learn more" found |
| 3 | Restrained trust signals visible without interaction | ✓ VERIFIED | 12 `clients.logos.N` text wordmarks + 3 work-card metrics (398%, $70M, 55%) all render unconditionally (not behind disclosure) |
| 4 | Click-through to 5 derived sub-pages via View Transitions, graceful degradation | ✓ VERIFIED | 5 files in `concept-a/pages/`; `@view-transition { navigation: auto; }` present in concept-a.css; zero `view-transition-name` anywhere; link-integrity script passes 0 failures across all 6 pages |
| 5 | Sparing kinetic motion, sine ease-in-out, reduced-motion + no-JS guards | ✓ VERIFIED | `motion.js` IntersectionObserver reveal-once + reduced-motion short-circuit; CSS `.has-js`-scoped reveals/stagger; `@media (prefers-reduced-motion: reduce)` forces final state; all durations/easing pull only from `var(--dur-med)`/`var(--ease-inout-sine)` |
| 6 | Brand-compliant, zero imagery (graphics-first) | ✓ VERIFIED | No `<img>` photography (only the static SVG lockup); stepped-field uses `repeating-linear-gradient` with duplicated stop offsets (5 hard steps); no raw hex/deprecated hex/banned tagline/`<hr>`/non-Flarepop colored text anywhere |

**Score:** 6/6 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `concept-a/index.html` | Full 9-section homepage, fully annotated | ✓ VERIFIED | 325 lines; header→hero→card grid→statement→OS band→work→clients→convert→footer, all present in order; 182 data-copy chunks; passes copy-diff |
| `concept-a/assets/css/concept-a.css` | Editorial stylesheet: fluid type, card grid, stepped field, `@view-transition`, motion layer | ✓ VERIFIED | `@view-transition` at line 7; clamp()-fluid hero/statement type; stepped-field utility (1 use, InterceptOS band); kinetic layer block (reveal, hero stagger, hover accent, reduced-motion) |
| `concept-a/assets/js/motion.js` | IntersectionObserver reveal + reduced-motion guard | ✓ VERIFIED | `node --check` syntax OK; `prefers-reduced-motion` checked; observer fallback for no-IO support; reveal-once (unobserve after reveal) |
| `concept-a/pages/interceptos.html` | Full-depth: 4 flows × 4 stages + 13 agents | ✓ VERIFIED | copy-diff clean; 13/13 `agents.items.N.sample`; ≥48 `os.flows.N.stages.*` annotations; header present |
| `concept-a/pages/insights.html` | Episodes index, external listen links | ✓ VERIFIED | copy-diff clean; 3 episode rows, exact external Spotify/Apple/YouTube hrefs preserved |
| `concept-a/pages/work-hp-abx.html` | HP case, full depth (4 results) | ✓ VERIFIED | copy-diff clean; 4 `results.N` li's |
| `concept-a/pages/work-intel-abm.html` | Intel case, full depth (4 results) | ✓ VERIFIED | copy-diff clean; 4 `results.N` li's |
| `concept-a/pages/work-sap-video.html` | SAP case, full depth (5 results) | ✓ VERIFIED | copy-diff clean; 5 `results.N` li's |
| `.planning/phases/.../captures/` | 9 responsive QA captures | ✓ VERIFIED | 9 PNGs present, all well above the 8KB floor; visually reviewed at 390/1440 (index) — no horizontal overflow, hero type unclipped, grid collapses correctly, Flarepop-only accent colors |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `index.html` | `/shared/tokens.css`, `/shared/fonts.css`, `/shared/motion.css` | shared head block | ✓ WIRED | 5-line block present, correct order |
| `index.html` | `content/homepage.json` | `data-copy` dot-path annotations | ✓ WIRED | 430/430 chunks pass `qa/copy-diff.py --all concept-a` (0 failures) |
| hero CTA | statement moment section | `href="#problems"` → `id="problems"` | ✓ WIRED | confirmed via link-integrity script (fragment resolves) |
| work case cards | `concept-a/pages/work-*.html` | card-wrapping anchors | ✓ WIRED | 3/3 hrefs resolve to real files (built in 02-02) |
| os.lead sentence | `interceptos.html` | anchor inside annotated `os.lead` | ✓ WIRED | link-integrity confirms target exists; only one navigating link in the OS band |
| insights h2 | `insights.html` | anchor inside annotated `insights.h2` | ✓ WIRED | resolves; episode cards still link externally to Spotify (untouched) |
| every sub-page | `concept-a.css` (VT carrier) | stylesheet link | ✓ WIRED | 6/6 pages link it |
| every sub-page | homepage | lockup anchor + persistent header nav | ✓ WIRED | header present with `href="/concept-a/"` on all 6 pages |
| all 6 pages | `motion.js` | deferred script tag + `has-js` bootstrap | ✓ WIRED | 6/6 pages have both the bootstrap script and the deferred `motion.js` tag |
| `motion.js`/CSS | `[data-reveal]` elements | IntersectionObserver + `.has-js` CSS scoping | ✓ WIRED | reveal transitions read `var(--ease-inout-sine)`/`var(--dur-med)`; JS toggles `.is-visible` |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|--------------|--------|----------|
| CONA-01 | 02-01 | Single strong hero + ONE primary CTA, no rotation | ✓ SATISFIED | 1 hero CTA, zero carousel/autoplay code |
| CONA-02 | 02-01 | Editorial card grid, oversized type, distinct content-specific CTAs | ✓ SATISFIED | clamp() type scale; distinct verbatim CTA labels per card type |
| CONA-03 | 02-01 | Trust signals restrained, specific over vague | ✓ SATISFIED | 12 real client names + 3 concrete metrics, no invented logos |
| CONA-04 | 02-02 | Click-through to derived sub-pages, View Transitions where supported | ✓ SATISFIED | 5 sub-pages, link-integrity clean, `@view-transition` present, no `view-transition-name` |
| CONA-05 | 02-03 | Sparing kinetic typography, sine ease-in-out, reduced-motion guard | ✓ SATISFIED | motion.js + CSS reveal/stagger/hover-accent, all guarded, only shared motion tokens used |
| CONA-06 | 02-01 | Brand-compliant imagery / compliant by absence | ✓ SATISFIED | zero photography; stepped-field graphics only, hard-edged steps confirmed in CSS |

No orphaned requirements — REQUIREMENTS.md traceability table maps CONA-01 through CONA-06 to Phase 2, and all 6 IDs appear across the three plans' `requirements` frontmatter with no gaps.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | none found | — | TODO/FIXME/placeholder/console.log-only/empty-return scans across concept-a/ (html, css, js) all returned zero hits |

Leftover `border-top: none` / `border-bottom: none` reset rules on `:first-child` selectors (os-flow, insights-row, case-story__block) were checked and confirmed to be harmless no-op resets left over from commit `6cb9b19` (which removed the actual hairline divider rules per the Fritz no-rule-lines canon) — not active dividers. No visible rule lines render; separation is via `background: var(--surface)` box-toning and spacing only, consistent with brand rules.

### Human Verification Required

None required for gate-passing status — all must-haves are mechanically verifiable (copy gate, brand greps, link integrity, motion guards, static captures) and were confirmed directly against the codebase, including visual review of 2 of the 9 responsive captures (index at 390/1440) showing correct hero type, Flarepop-only accents, stepped-field band, and 4/2/1-column grid behavior.

Optional (not blocking): Jon may still want to eyeball the live cross-document View Transition cross-fade in an actual Chromium/Safari browser (`serve.sh` + `http://localhost:4340/concept-a/`) — this is a felt/visual-timing check that a screenshot capture cannot represent, though the underlying CSS mechanism and its absence of `view-transition-name` per-element morphing is mechanically confirmed.

### Gaps Summary

None. All 6 observable truths verified, all 9 required artifacts pass all three levels (exists/substantive/wired), all 10 key links wired, all 6 requirement IDs satisfied with no orphans, zero anti-patterns, and the full mechanical gate suite (copy-diff --all: 430/430 chunks; brand grep suite: banned tagline/deprecated hex/`<hr>`/raw hex/non-Flarepop text-color/radial-conic-gradient/`view-transition-name` all clean; link-integrity: 0 failures across 6 pages; 9/9 non-trivial responsive captures) passes clean on independent re-run, not just per SUMMARY claims.

---

*Verified: 2026-07-24T05:00:00Z*
*Verifier: Claude (gsd-verifier)*
