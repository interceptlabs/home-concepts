# Intercept Homepage Concepts

## What This Is

Three new homepage concepts for interceptgroup.com, each built as a working, snazzy modern marketing site prototype. All three attack the same problem: the current homepage is a wall of text to scroll through. Each concept reveals content progressively and routes visitors to focused sub-pages instead of dumping everything on one scroll.

## Core Value

A visitor never faces a wall of text — content is revealed as needed, and clicking an area of interest takes them to a focused page built from that content.

## The Three Concepts

### Concept A — "Accenture, but better"
Mimics the structure and confidence of https://www.accenture.com/ca-en (bold editorial hero, oversized type, card-driven content blocks, work/insights-led storytelling) but executed better: tighter craft, Fritz brand system, faster, less corporate sludge. Reference site must be studied (live capture, not memory).

### Concept B — Full-screen video
Full-bleed video homepage with a clever progressive-reveal mechanism for content. No scrolling wall of text. Areas of interest are interactive; clicking one navigates to a dedicated content page derived from the current homepage's content. Video sourced via web search (quality stock video — Pexels/Coverr class) or generated via ComfyUI.

### Concept C — Experimental WebGL/3D
The most experimental of the three — WebGL / three.js or similar 3D-space mechanism as the navigation/reveal metaphor — while still adhering to UI conventions and best practices (clear affordances, accessible fallbacks, no mystery-meat navigation). Same progressive-disclosure principle: minimal copy up front, content revealed as needed, click-through to derived pages.

### Concept D — Home Variant (2026-07-24 pivot, Jon's direction)
A speculative variant of the deployed homepage, for Jon + Claude to iterate on: keep the sticky nav and logo treatment; light mode; full-screen light/positive "emergent motion graphics" video background; the existing home sections (fine functionally and visually) are NOT redesigned — they are revealed independently via small enticing cards that expand into modal windows carrying the complete section modules; nav clicks go to full pages. Content mirrors the latest deployed bundle (the one with about.html, insights hub, chatb2b.html).

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Concept A homepage working locally: Accenture-style structure, Fritz-branded, better than the reference
- [ ] Concept B homepage working locally: full-screen video + progressive content reveal + click-through pages
- [ ] Concept C homepage working locally: WebGL/3D reveal mechanism, UI-convention compliant
- [ ] Content for all concepts derived from the live interceptgroup.com homepage (Variant A) — copy transcribed verbatim, restructured into progressive-disclosure chunks and sub-pages
- [ ] Each concept passes Fritz brand QA before being shown to Jon
- [ ] All three concepts presentable side-by-side for review (local preview server)

### Out of Scope

- Production deployment — interceptgroup.com deploys ONLY via intercept-deploy MCP and only on Jon's explicit go; these are concepts for review
- CMS / backend integration — static prototypes only
- Full-site rebuild — homepage + the derived content pages needed to demonstrate the click-through model
- Rewriting brand copy — copy is immutable; transcribe verbatim from the live site, restructure only

## Context

Jon (Intercept Group) asked for three new homepage concepts, verbatim brief:
1. One that mimics the Accenture page (https://www.accenture.com/ca-en) but better.
2. One using full-screen video with a clever way to reveal page content as needed — no wall of text; clicking an area of interest goes to a page with that content (derived from homepage content).
3. A third, even more experimental concept that still adheres to UI conventions and best practices — again minimizing walls of text, revealing content as needed. Look into WebGL and other 3D-space mechanisms.

All should feel like snazzy modern marketing sites. Use all available tools: VizForge (/viz) for any data-viz moments, ComfyUI for imagery, web searches for video content and trending web patterns, WebGL/3D research. **/fritz is in the loop** — the Fritz brand agent owns brand integrity and QA for everything.

Existing state:
- Live homepage = Variant A (shipped via fritzweb pipeline); its content is the source for all derived pages
- Fritz brand SSoT = Figma kit `kBo4gZ2BvhqHCtqTVkBbYq`; Fritz agent + /fritzweb skill encode the rules
- Prior art: fritzweb production-HTML pipeline, /fritz-ab presets (Signal/Editorial/Studio), intercept-website-staging repo

## Constraints

- **Brand**: Fritz Brand OS is law — Flarepop as only colored text, triangles apex-up, mark never decoration, static `centered` lockup (web_animated suspended), "no gradients" = 3–9 hard-edged equal steps, NO decorative rule lines, NO invented marks, tagline "Fresh thinking starts here." BANNED
- **Copy**: immutable — transcribe verbatim from live interceptgroup.com; copy-diff QA gate applies
- **Imagery**: real stock (Pexels-class) or ComfyUI generations — never fal-ai, no neon/glow AI slop
- **Motion**: sine ease-in-out, long durations, no jarring landings
- **Tech**: static HTML/CSS/JS prototypes; three.js (or equivalent) permitted for Concept C; must run from a simple local server
- **Deploy boundary**: nothing ships to interceptgroup.com without Jon's explicit go, and then only via intercept-deploy MCP
- **UX**: Concept C experimental but convention-compliant — visible affordances, keyboard/reduced-motion fallbacks, no walls of text anywhere

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Three separate working prototypes, one repo | Side-by-side comparison is the deliverable | — Pending |
| Content derived from live Variant A homepage | Copy is immutable; concepts restructure, not rewrite | — Pending |
| Fritz agent QA gate on every concept | Jon: "use /fritz too" — brand integrity owned by Fritz | — Pending |
| Auto-advance GSD chain | Jon: "go /gsd with auto advance" | — Pending |
| 07-24 pivot: Concept D home variant | Jon: sections are fine as designed — reveal them independently (cards→modals) over a light positive video; mirror deployed bundle | — Pending |

---
*Last updated: 2026-07-23 after initialization*
