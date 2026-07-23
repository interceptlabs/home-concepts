# Pitfalls Research

**Domain:** Marketing-homepage prototypes — editorial (Accenture-style), full-screen video, WebGL/3D
**Researched:** 2026-07-23
**Confidence:** MEDIUM-HIGH

This research covers three parallel prototypes for `intercept-home-concepts`: Concept A (Accenture-style editorial), Concept B (full-screen video + progressive reveal), Concept C (WebGL/3D reveal mechanism). All three share the "no wall of text, progressive disclosure, click-through to derived pages" mandate and the Fritz brand/copy-immutability constraints from `.planning/PROJECT.md`.

## Critical Pitfalls

### Pitfall 1: iOS/Safari Autoplay Silent Failure (Concept B)

**What goes wrong:**
The full-screen video hero shows a black frame, a frozen first frame, or nothing at all on iPhone/iPad — the single most common failure mode for video-background homepages.

**Why it happens:**
Safari and iOS block autoplay unless the video is *actually* muted (a silenced audio track doesn't count — the `muted` attribute/property must be set), and it will force fullscreen takeover unless `playsinline` is present. Missing either attribute, or setting them in the wrong order/timing relative to `autoplay`, causes silent rejection with no error shown to the visitor.

**How to avoid:**
Always ship `<video autoplay muted playsinline loop>` together, verify `muted` is set as a real attribute (not just volume=0), and test on an actual iOS device or Safari simulator — not just Chrome DevTools device emulation, which does not reproduce this policy.

**Warning signs:**
Works perfectly in Chrome/Firefox desktop preview but shows blank/frozen hero when opened on an iPhone; QA only ever happens on the reviewer's Mac.

**Phase to address:**
Concept B build phase (video hero implementation) — verify on a real iOS device before calling the concept "done."

**Sources:** [WebKit: New `<video>` Policies for iOS](https://webkit.org/blog/6784/new-video-policies-for-ios/), [Mux: Best Practices for Video Playback 2025](https://www.mux.com/articles/best-practices-for-video-playback-a-complete-guide-2025)

---

### Pitfall 2: Video Asset Bloat, Missing Poster Frame, CLS/LCP Damage (Concept B)

**What goes wrong:**
The hero video (frequently the LCP element on a full-screen video homepage) loads slowly, has no poster image so the page flashes blank/white before it paints, and shifts layout once the video's real dimensions resolve — tanking both perceived performance and Lighthouse Core Web Vitals.

**Why it happens:**
Teams export one high-bitrate desktop-quality file and serve it to every device; they skip the `poster` attribute because "the video loads fast enough on my connection"; they don't reserve the hero's aspect-ratio/box size in CSS ahead of the video resolving.

**How to avoid:**
Provide a compressed poster frame matching the video's first frame; set `preload="metadata"` (not `auto`) for the hero video; encode a compressed WebM (VP9, CRF ~31-33) alongside an H.264 MP4 fallback, targeting well under 10MB for the hero clip; reserve height via `aspect-ratio` or fixed hero-container sizing so nothing shifts when the video loads.

**Warning signs:**
Lighthouse flags LCP >2.5s or CLS >0.1 on the homepage; a visible flash-of-blank-hero on slow connections; video file sizes in the repo exceeding 15-20MB for a 15-30s clip.

**Phase to address:**
Concept B build phase — bake compression/poster/aspect-ratio into the initial hero implementation, not as a later fix.

**Sources:** [Aaron T. Grogg: Improving LCP for Video Hero Components (2026)](https://aarontgrogg.com/blog/2026/01/06/improving-lcp-for-video-hero-components/), [Mux 2025 guide](https://www.mux.com/articles/best-practices-for-video-playback-a-complete-guide-2025), [ImageKit video optimization guide](https://imagekit.io/guides/video-optimization/)

---

### Pitfall 3: No Reduced-Motion / Battery-Data-Aware Fallback for Autoplay (Concept B, cross-cutting)

**What goes wrong:**
The video autoplays and loops indefinitely for every visitor regardless of `prefers-reduced-motion`, Low Power Mode, or a metered connection — draining battery/data and creating discomfort for vestibular/motion-sensitive visitors, with no way to pause it.

**Why it happens:**
`<video autoplay muted>` currently ignores `prefers-reduced-motion` in every browser by default — there is no built-in browser behavior that respects it, so it must be handled explicitly in code. Teams treat "it autoplays" as the finished feature and skip the accessibility/battery layer.

**How to avoid:**
Detect `prefers-reduced-motion: reduce` via `matchMedia` and render the video paused with visible play/pause controls instead of autoplaying; always expose an on-page pause control regardless (WCAG 2.2.2 "Pause, Stop, Hide"); on mobile, background video autoplay realistically costs 15-40MB per load and measurably drains battery — keep the hero clip short and compressed (Pitfall 2) as a mitigation even when autoplay is allowed.

**Warning signs:**
No pause/stop control anywhere near the hero; DevTools "Emulate CSS prefers-reduced-motion: reduce" doesn't change hero behavior; nothing in the design accounts for Low Power Mode (which many mobile OSes use to hard-block autoplay video regardless of markup).

**Phase to address:**
Concept B build phase, verified again at the cross-concept Fritz QA gate (motion rules already require sine ease-in-out, no jarring motion — extend that gate to check reduced-motion video behavior too).

**Sources:** [GitHub whatwg/html #11605 — autoplay + prefers-reduced-motion](https://github.com/whatwg/html/issues/11605), [scottohara.me: Reduced motion auto-playing videos](https://www.scottohara.me/note/2019/07/12/reduced-motion-video.html), [PCNMobile: autoplay video data/battery costs](https://pcnmobile.com/disable-auto-play-videos-on-mobile-devices-to-save-data/)

---

### Pitfall 4: WebGL Performance Cliff on Integrated GPUs & Mid-Range Mobile (Concept C)

**What goes wrong:**
The 3D-space navigation mechanism runs smoothly on the developer's discrete-GPU workstation, then chugs, drops to single-digit frame rates, or makes the fan spin audibly on a MacBook Air/integrated-GPU laptop or a mid-range Android phone — exactly the class of device most reviewers and eventual site visitors actually use.

**Why it happens:**
Three.js scenes are built and tuned against one high-end dev machine; geometry complexity, particle counts, texture resolution, and post-processing passes are never tiered down for weaker hardware; mobile GPUs have meaningfully less compute/memory bandwidth than desktop and need explicitly reduced assets, not just "the same scene, hopefully it's fine."

**How to avoid:**
Build in capability-tiered quality from the start: cap device pixel ratio, reduce geometry/particle counts and texture resolution on a detected "low tier" device, avoid expensive post-processing on mobile, and test against an actual integrated-GPU laptop and a mid-range Android phone (not just the dev's machine) before the concept is considered reviewable. If adopting Three.js's WebGPU path, confirm it automatically falls back to WebGL2 rather than failing outright on unsupported browsers.

**Warning signs:**
Scene was only ever tested on one machine; frame rate isn't monitored/logged anywhere; particle/geometry counts are hardcoded constants with no device-based scaling; fan noise or thermal throttling during a demo.

**Phase to address:**
Concept C build phase — treat device-tiered performance as a build requirement, not a stretch goal, given this is the "most experimental" and most performance-risky of the three concepts.

**Sources:** [AppScale: Three.js in Production 2026 — WebGPU, Perf & Fallback](https://appscale.blog/en/blog/threejs-production-3d-web-2026-webgpu-realtime-standards), [Utsubo: 100 Three.js Tips That Actually Improve Performance (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips)

---

### Pitfall 5: Missing WebGL-Unavailable Fallback (Concept C)

**What goes wrong:**
On a browser/device where WebGL is disabled, blocklisted (some GPUs are blocklisted in Firefox/Chrome for stability), unavailable in a private/incognito profile, or simply not supported, Concept C's homepage renders as a blank canvas — the entire navigation/reveal mechanism disappears with no content behind it.

**Why it happens:**
WebGL availability is treated as a given rather than feature-detected; no fallback path was designed because "it works when I test it."

**How to avoid:**
Feature-detect at load (`!!window.WebGLRenderingContext` plus an actual `getContext('webgl')` probe, respecting `failIfMajorPerformanceCaveat` where relevant) and render a genuine HTML/CSS fallback experience — not just an error message — that still delivers the progressive-disclosure homepage goal without 3D. This satisfies both the technical requirement (no blank page) and the project's own UI-convention mandate for Concept C.

**Warning signs:**
No `<noscript>` or non-WebGL code path exists anywhere in Concept C; the only test performed is "does it render for me."

**Phase to address:**
Concept C build phase — fallback is a first-class deliverable of the concept, not a polish item.

**Sources:** [xjavascript.com: How to Properly Detect WebGL Support](https://www.xjavascript.com/blog/proper-way-to-detect-webgl-support/), [Utsubo: WebGL & Three.js Site SEO — Make 3D Sites Rankable (2026)](https://www.utsubo.com/blog/webgl-three-js-site-seo-rankable-guide)

---

### Pitfall 6: Scroll-Jacking & Forced Camera Motion Break UX and Trigger Vestibular Discomfort (Concept B/C)

**What goes wrong:**
The "clever progressive-reveal mechanism" is implemented by hijacking native scroll (locking scroll into steps, remapping scroll delta to camera/animation position, or changing scroll speed/direction). This breaks the decades-old contract that scrolling moves the page predictably, confuses users who scroll to skim, can spike CPU/fans, and — specifically for Concept C's 3D-space navigation — large or fast camera/parallax motion is a documented trigger for nausea and disorientation in visitors with vestibular disorders or migraine sensitivity.

**Why it happens:**
Scroll-jacking looks impressive in a demo and is a common (mis)read of "clever reveal mechanism"; teams don't test with keyboard/trackpad/older hardware, and don't design an escape hatch for motion-sensitive users.

**How to avoid:**
Prefer click/tap-triggered or scroll-*position*-aware (not scroll-*hijacked*) reveals — i.e., content animates in as it enters view, but the user's scroll input is never remapped or intercepted. If any locked-step or camera-driven transition is used at all, keep movement gentle/subtle, always honor `prefers-reduced-motion` by switching to instant/no-motion transitions, and never trap the user inside a scroll sequence they can't exit with normal scroll/keyboard input.

**Warning signs:**
Scroll speed feels "different" from every other site; scrolling fast doesn't let the user skim ahead; trackpad/mouse-wheel scroll no longer maps 1:1 to visual movement; nothing changes when `prefers-reduced-motion: reduce` is toggled.

**Phase to address:**
Concept B and Concept C build phases — this is the single highest-risk UX decision in both concepts and should be settled in design/discuss-phase before implementation, not discovered afterward.

**Sources:** [Web Designer Depot: How Scrolljacking Breaks UX Fundamentals](https://webdesignerdepot.com/how-scrolljacking-breaks-ux-fundamentals/), [A List Apart: Designing Safer Web Animation for Motion Sensitivity](https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/), [Web Axe: Vestibular Issues in Parallax Design](https://www.webaxe.org/vestibular-issues-parallax-design/)

---

### Pitfall 7: Mystery-Meat Navigation & Hover-Only Affordances Fail on Touch (Concept C, also Concept B)

**What goes wrong:**
"Areas of interest" that reveal their purpose only on hover (a common shortcut for minimal-looking 3D/video interfaces) are invisible on every touch device, since touchscreens have no hover state. Visitors on phones/tablets — a large share of real traffic — see an unlabeled scene with no indication of what's clickable, and must tap blindly to discover anything.

**Why it happens:**
Hover reveals look clean in desktop mockups and demos (which is how these concepts will likely first be reviewed), so the touch-failure mode isn't visible until someone tests on an actual phone.

**How to avoid:**
Every interactive hotspot needs a touch-equivalent affordance that doesn't depend on hover: a persistent (if subtle) visual marker, a label, a cursor/icon change plus a first-visit hint animation, and a tap-to-reveal-then-tap-to-navigate (or single-tap-to-navigate) pattern that works identically across mouse, trackpad, and touch. This directly serves the project's own Concept C requirement ("clear affordances... no mystery-meat navigation").

**Warning signs:**
The only way to discover a hotspot is hovering; testing has only happened with a mouse; no visible marker exists until cursor position triggers it.

**Phase to address:**
Concept C build phase (and Concept B wherever "click an area of interest" hotspots exist over the video) — test on a real touchscreen device before sign-off.

**Sources:** [Wikipedia: Mystery meat navigation](https://en.wikipedia.org/wiki/Mystery_meat_navigation), [Bomberbot: Material Design and the Mystery Meat Navigation Problem](https://www.bomberbot.com/design/material-design-and-the-mystery-meat-navigation-problem/)

---

### Pitfall 8: Canvas/WebGL Content Invisible to Screen Readers, SEO Crawlers, and No-JS Visitors (Concept C)

**What goes wrong:**
Everything meaningful — headline, navigation labels, content teasers — lives inside a `<canvas>` element that has zero indexable text and zero accessibility-tree presence. Screen reader users get nothing; search crawlers see an empty page; anyone without JavaScript enabled (or hitting an error) sees a blank homepage.

**Why it happens:**
Canvas/WebGL rendering is treated as the entire UI rather than a rendering layer sitting on top of real content; teams assume "it looks like a website" is equivalent to "it is a website" for accessibility/SEO purposes.

**How to avoid:**
Mirror the meaningful content (headline, section labels, link destinations) in real semantic HTML that sits alongside or beneath the canvas — visually hidden if needed, but present in the DOM/accessibility tree — so screen readers, crawlers, and no-JS fallbacks all get the same substance a sighted mouse user gets from the 3D scene. Insert `<canvas>` fallback content and/or a `<noscript>` block with the same headline/summary/CTA. This is the same "hybrid approach" production WebGL sites use: 3D for the spectacle layer, semantic HTML for the content layer.

**Warning signs:**
View-source shows an essentially empty body except for a `<canvas>` tag and script tags; running a screen reader over the homepage produces nothing; Lighthouse SEO/Accessibility scores are notably lower on Concept C than Concepts A/B.

**Phase to address:**
Concept C build phase, verified at the cross-concept Fritz/accessibility QA gate.

**Sources:** [MDN: `<canvas>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas), [Utsubo: WebGL & Three.js Site SEO — Make 3D Sites Rankable (2026)](https://www.utsubo.com/blog/webgl-three-js-site-seo-rankable-guide), [Kooba: WebGL — The Pros, The Cons, The Possibilities](https://www.kooba.ie/journal/webgl-the-pros-the-cons-the-possibilities)

---

### Pitfall 9: Editorial Imitation Ships the Reference Site's Weaknesses, Not Just Its Confidence (Concept A)

**What goes wrong:**
Concept A copies Accenture's oversized-type, card-driven editorial structure but also inherits (or amplifies) the problems that pattern is prone to: desktop-sized headline type that dominates or overflows the mobile viewport instead of scaling down, and multi-column card grids that look great with placeholder copy but break — orphaned cards, ragged heights, awkward wraps — once real (verbatim, variable-length) transcribed copy is dropped in.

**Why it happens:**
"Bold editorial hero, oversized type" is treated as a fixed pixel size copied from the desktop reference rather than a fluid scale; card grids are designed and reviewed with short lorem-ipsum-style placeholder text instead of the actual, uneven-length copy that will populate them; brief only says "mimic the structure... but better," which can be read as "match the desktop screenshot" rather than "match the *effective, responsive* pattern."

**How to avoid:**
Use fluid type (`clamp()`-based headline scaling, not fixed desktop pixel values) so the hero reads as "oversized" at every viewport without overflowing on mobile; build and review the card grid with the actual verbatim-transcribed copy (Concept A's real headline/subhead lengths from Variant A), not placeholder text, specifically checking mid-range Android and small-iPhone breakpoints; use `grid-template-areas` or an explicit mobile-first column collapse (4-5 cols desktop -> stacked single column mobile) rather than letting card DOM order alone determine the mobile layout.

**Warning signs:**
Headline sizes are specified in fixed `px`/`rem` values copied straight from a desktop screenshot; the card grid has only been reviewed at one (desktop) viewport width; real transcribed copy hasn't been dropped into the layout yet when "it looks done."

**Phase to address:**
Concept A build phase — responsive type and real-copy card-grid testing should happen before the concept is presented, since this is precisely the gap between "mimics Accenture" and "mimics Accenture, but better."

**Sources:** [Framer: Breakpoints in responsive web design 2026 guide](https://www.framer.com/blog/responsive-breakpoints/), [Socialectric: mobile heading-size problems](https://www.socialectric.com/insights/mobile-heading-sizes-nonprofit-website), [NN/g: Breakpoints in Responsive Design](https://www.nngroup.com/articles/breakpoints-in-responsive-design/)

---

### Pitfall 10: Click-Through Derived Pages Orphan Users — No Way Back, Broken Deep Links (all three concepts)

**What goes wrong:**
A visitor clicks an "area of interest" and lands on a derived content page, but that page has no path back into the interactive homepage state (no persistent back-to-home affordance, browser back button doesn't behave predictably against a JS-driven reveal state), and/or the derived page 404s or shows a blank shell if loaded directly (bookmarked, shared, or refreshed) rather than navigated to via the homepage's own JS.

**Why it happens:**
The homepage's clever reveal state (which hotspot was "active," what content was showing) isn't reflected in the URL/history at all, or is only reflected via a hash fragment that a static file server or a fresh page load doesn't recognize; the derived pages are built as an afterthought to "prove the click-through model" rather than as real standalone routes; nobody tests opening a sub-page URL cold (not via in-app navigation).

**How to avoid:**
Give every derived page a real static route/URL (not just a hash or JS-only view swap) that resolves correctly on direct load from a local static server; put a persistent, always-visible "back to home" (or full nav) element on every derived page independent of the browser back button; if any concept uses hash-based state for its in-page reveal mechanism, keep that entirely separate from the URLs used for the actual derived content pages, which need to be real, linkable, loadable-standalone pages.

**Warning signs:**
Derived pages only exist as SPA view-swaps with no distinct URL; typing/refreshing a sub-page's URL directly produces a blank page or a 404 from the static file server; there's no home/back link on any derived page.

**Phase to address:**
Whichever phase builds the click-through/derived-page mechanism for each concept (likely a shared "content restructuring + derived pages" phase feeding all three) — verify direct-load and back-navigation for every derived page before cross-concept review.

**Sources:** [staticapps.org: Routing URLs in Static Web Apps](https://www.staticapps.org/articles/routing-urls-in-static-apps/), [Telerik: Please Respect The "Back" Button](https://www.telerik.com/blogs/please-respect-the-back-button), [Proxify: Main SPA SEO challenges](https://proxify.io/articles/single-page-app-spa-seo)

---

### Pitfall 11: Copy Verbatim Drift & Brand Drift Across Three Parallel Concepts (cross-cutting)

**What goes wrong:**
Because three different builds (Accenture-style, video-first, WebGL-first) are being restructured from the same source content independently, small paraphrases creep into transcribed copy in one or two concepts ("copy is immutable" gets silently violated), and each concept's execution of Fritz brand rules (exact Flarepop color usage, triangle orientation, gradient-as-steps, "no decorative rule lines," motion easing) diverges slightly from the other two and from the Figma SSoT — because each concept is styled/tuned independently rather than against one shared source of truth.

**Why it happens:**
Building three visually very different prototypes in parallel creates natural pressure to "smooth" a headline to fit a new layout, or to eyeball a color/spacing value per concept rather than pulling it from one shared token source; without an explicit copy-diff and shared-token check, drift is invisible until a side-by-side review surfaces it.

**How to avoid:**
Extract Variant A's homepage copy into one canonical source file once, and have every concept's content come from that single source (not independently retyped/paraphrased per concept); run a literal copy-diff QA pass (this project's existing "copy-diff QA gate") against that source for each concept before review; extract Fritz brand tokens (hex values, type scale, spacing, motion easing curves) from the Figma kit into one shared reference and check all three concepts against it at the Fritz QA gate, rather than reviewing each concept's brand compliance in isolation.

**Warning signs:**
Headlines/subheads in the built HTML don't match the live interceptgroup.com source character-for-character; any concept's color values, motion durations, or triangle orientation were chosen "by eye" rather than pulled from Figma; the Fritz QA gate happens once per concept in isolation rather than also checking cross-concept consistency.

**Phase to address:**
Content-extraction/foundation phase (canonical copy + token source created once, before any concept build starts) and the cross-concept Fritz QA/review phase (final drift check across all three).

**Sources:** [UXPin: Design System Governance — A Guide to Prevent Drift](https://www.uxpin.com/studio/blog/design-system-governance/), [UXPin: Prevent Design Drift](https://www.uxpin.com/studio/blog/design-drift/)

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|--------------------|-----------------|------------------|
| One desktop-quality video re-encode reused for all breakpoints | Simpler asset pipeline | Mobile users download a huge file; CLS/LCP fail on Lighthouse mobile | Never in the reviewable build; okay as a temporary stand-in during first rough layout pass only |
| Fixed `px`/`rem` hero headline sizes copied from a desktop screenshot | Pixel-perfect match to reference on one viewport | Breaks/overflows on small mobile viewports | Only for an early static screenshot draft; must convert to `clamp()`-based fluid type before review |
| One shared three.js scene with no LOD/quality tiers across devices | Less code, faster to build | Frame-rate collapse / fan noise / crashes on integrated GPUs and mobile | Never for the shipped Concept C — device tiering is a build requirement, not polish |
| Skipping WebGL feature-detection because "review happens on a modern Mac" | Faster to build | Blank homepage the moment anyone opens it elsewhere (older device, GPU-blocklisted browser, private mode) | Never — three concepts are explicitly meant to be reviewed side-by-side, likely across devices |
| Hash-based state/anchors used for the actual derived content-page URLs (not just in-page reveal state) | Fast to prototype, no server routing config needed | Direct-load/deep-link/back-button all break for the derived pages meant to demonstrate the click-through model | Acceptable only for a concept's *internal* reveal-state bookkeeping; never for the derived pages themselves |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|-----------------|-------------------|
| Stock/generated video (Pexels-class or ComfyUI) | Re-hosting a raw high-bitrate/4K export directly as the page background | Re-encode to 1080p or lower, VP9/H.264, ~1-2.5 Mbps, target well under 10MB for the hero clip; always pair with a compressed poster frame |
| three.js / WebGL bundle | Importing the full three.js library plus heavy addons (postprocessing, loaders) globally, so Concepts A and B also pay the WebGL byte cost | Scope three.js strictly to Concept C; import only the modules actually used; code-split so it never loads on the A/B pages |
| Fritz brand tokens (Figma kit `kBo4gZ2BvhqHCtqTVkBbYq`) | Eyeballing hex/spacing/motion values per concept from memory or screenshots | Pull tokens once into a shared reference file (colors, type scale, spacing, easing curves) and have all three concepts reference it, not re-derive it |
| Local preview/comparison server | Each concept spun up with its own ad hoc server on a different port with different relative-path assumptions, breaking the "side-by-side" review requirement | Serve all three concepts from one consistent local server/index shell with correct relative asset paths from the start |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| One video file size/quality for every breakpoint | Lighthouse mobile flags LCP >2.5s, CLS >0.1; visible flash-of-blank hero on slow connections | Responsive `<source>` variants sized per breakpoint; `preload="metadata"`; poster frame + reserved aspect-ratio | Any device below a fast desktop broadband connection |
| Full three.js scene complexity rendered identically on every device | Fan noise, frame-rate collapse, tab crashes on integrated-GPU laptops and mid-range Android | Capability-tiered quality: capped DPR, reduced geometry/particle counts, simplified shaders on detected low-tier devices | Integrated-GPU laptops (the class Jon/reviewers likely use), mid-range Android phones |
| Autoplaying video and running the WebGL scene simultaneously across adjacent browser tabs during a side-by-side review | Battery drain, review-session lag, audible fan noise during the actual demo | Pause offscreen/inactive-tab video via Intersection Observer/Page Visibility API; don't initialize Concept C's WebGL scene until its tab/pane is actually active | Any multi-tab or split-view review session comparing all three concepts at once |
| Unoptimized image/video assets duplicated per derived sub-page | Repo bloat, slow first load on the local static server | Shared asset pipeline; one compressed master image/video reused (not re-exported) across the homepage and its derived pages | As soon as more than a handful of derived pages exist per concept |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Embedding live API keys/endpoints (e.g., a ComfyUI server address) directly in client-side JS "since it's just a local prototype" | Exposed in view-source even for a throwaway prototype; could point at an internal/dev-only service | Keep all three concepts fully static with no live API calls from the browser; generate imagery/video ahead of time and bake the output in as static assets |
| Copying live interceptgroup.com HTML/scripts (analytics IDs, trackers, GTM containers) while "transcribing verbatim" | Prototype accidentally pings production analytics with fake pageviews, or leaks internal-only config/IDs | Strip all live tracking scripts/analytics IDs when porting markup; transcribe copy *text* only, never the surrounding script tags |
| Using a "stock" video/asset without checking license terms because it "looked free" | A concept ships with a watermarked or non-royalty-free clip that gets mistaken for cleared stock | Track source + license for every media asset in a simple manifest per concept |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|------------------|
| Gradient scrim over full-screen video for text legibility | Conflicts with Fritz's "no gradients = hard-edged steps" rule (a smooth gradient scrim is exactly what's banned) and can still fail depending on the video frame underneath | Use solid color blocks / hard-edged stepped overlays, a safe-zone text placement strategy, or a dedicated text-safe frame region of the video — verify with the Fritz agent before treating any overlay as final |
| Interactive hotspots revealed only on hover | Touch users (phones/tablets) never discover them at all, since there's no hover state | Persistent visible markers/labels + tap-to-reveal-then-tap-to-navigate that behaves identically for mouse, trackpad, and touch |
| Zero visible entry points under "minimize copy up front" | Visitor sees an empty-feeling scene/video and bounces, unsure anything is interactive | Visible hotspot markers, cursor/label affordances, and a first-visit hint animation that signals interactivity without adding a wall of text |
| Derived click-through pages with no persistent way back | Visitor navigates deep into a topic page and has no path back into the interactive homepage state | Always render a fixed "back to home" element (independent of the browser back button) on every derived page |
| 3D-space navigation prioritized over content scanability | B2B visitors who normally skim can't scan Concept C at all; the 3D metaphor becomes a novelty wall between the visitor and the content | Expose a flat, list-style HTML equivalent (a simple menu/sitemap toggle) reachable from the 3D view for visitors who just want to scan and click |

## "Looks Done But Isn't" Checklist

- [ ] **Full-screen video hero (Concept B):** Often missing a poster frame and a mobile-specific lower-bitrate source — verify on a throttled connection and an actual iOS Safari device, confirming the video paints (not a black box) with ~0 CLS.
- [ ] **WebGL/3D scene (Concept C):** Often missing behavior for when WebGL is unavailable (disabled GPU acceleration, blocklisted GPU, private browsing) — verify by forcing `getContext('webgl')` to return null and confirming a real HTML fallback renders, not a blank canvas.
- [ ] **Progressive-disclosure hotspots (Concept B/C):** Often missing keyboard-focus states and a touch-tap equivalent for what was designed as a hover reveal — verify by tabbing through with keyboard only, then testing on a real phone/tablet (not desktop dev-tools mobile emulation).
- [ ] **Derived content pages (all concepts):** Often missing direct-load support (opening/refreshing the sub-page URL cold 404s) and a persistent back-to-home path — verify by opening each derived page's URL fresh, not via in-app click.
- [ ] **Copy transcription (all concepts):** Often "looks right" but hasn't been diffed character-for-character against the live interceptgroup.com source — verify with an explicit copy-diff QA pass before calling any concept "content complete."
- [ ] **Cross-concept brand QA:** Each concept often independently "looks Fritz" when reviewed alone but diverges from the other two and from the Figma SSoT in exact hex values, type scale, or motion easing — verify against one shared token extraction, not per-concept judgment calls.
- [ ] **Reduced-motion/accessibility path (all concepts):** Often only tested with default OS settings — verify with `prefers-reduced-motion: reduce` toggled on and a screen reader pass over each homepage.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|-----------------|
| iOS Safari autoplay failure discovered late | LOW | Add/confirm `muted playsinline autoplay loop` attribute set and correct order; add poster frame; retest on device |
| WebGL performance collapse on a review device | MEDIUM | Add a device-capability check that drops to a simplified scene or the static HTML fallback, rather than reworking the entire 3D scene |
| Copy drift discovered at review | MEDIUM | Re-run the copy-diff against the canonical source; re-transcribe the exact string — never paraphrase to "fix" a layout problem |
| Brand drift discovered at the Fritz QA gate | MEDIUM-HIGH | Centralize into a shared token/style file retroactively and re-apply it across all three concepts, rather than patching each concept's values independently |
| Broken deep links/back-button on derived pages found late | LOW-MEDIUM | Add explicit static routes per derived page plus a persistent back-to-home nav element; avoid a full rearchitect if the underlying content is otherwise sound |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|-------------------|---------------|
| Copy verbatim drift & brand/token drift (11) | Foundation/content-extraction phase (canonical copy + Fritz token file created once, before any concept build) | Copy-diff QA pass per concept; shared-token spot-check at the cross-concept Fritz QA gate |
| iOS/Safari autoplay failure (1), video bloat/CLS/LCP (2), no reduced-motion fallback (3) | Concept B build phase | Test on a real iOS device + throttled connection; Lighthouse mobile run; `prefers-reduced-motion` toggle test |
| WebGL performance cliff (4), missing WebGL fallback (5) | Concept C build phase | Test on an integrated-GPU laptop and mid-range Android device; force WebGL-unavailable and confirm fallback renders |
| Scroll-jacking / forced motion (6) | Concept B and Concept C build phases (settle the interaction model in discuss-phase before implementation) | Manual scroll/keyboard test against normal scroll expectations; `prefers-reduced-motion` behavior check |
| Mystery-meat/hover-only navigation (7) | Concept C build phase (and Concept B wherever hotspots exist) | Test on a real touchscreen device; confirm visible affordances without hovering |
| Canvas content invisible to screen readers/SEO (8) | Concept C build phase | Screen reader pass; view-source check for real HTML content alongside the canvas |
| Editorial imitation ships reference-site weaknesses (9) | Concept A build phase | Test with real transcribed copy (not placeholder) at mobile/small-viewport breakpoints |
| Click-through pages orphan users / broken deep links (10) | Shared derived-page/content-restructuring phase feeding all three concepts | Direct-load test of every derived page URL; confirm persistent back-to-home element |
| Gradient scrim conflicting with Fritz "no gradients" rule | Concept B build phase, confirmed at Fritz QA gate | Fritz agent review of any text-legibility overlay treatment |

## Sources

- [WebKit: New `<video>` Policies for iOS](https://webkit.org/blog/6784/new-video-policies-for-ios/)
- [Mux: Best Practices for Video Playback — A Complete Guide (2025)](https://www.mux.com/articles/best-practices-for-video-playback-a-complete-guide-2025)
- [Aaron T. Grogg: Improving LCP for Video Hero Components (2026)](https://aarontgrogg.com/blog/2026/01/06/improving-lcp-for-video-hero-components/)
- [ImageKit: Video Optimization Guide](https://imagekit.io/guides/video-optimization/)
- [GitHub whatwg/html #11605 — autoplay + prefers-reduced-motion](https://github.com/whatwg/html/issues/11605)
- [scottohara.me: Reduced motion auto-playing videos and background animations](https://www.scottohara.me/note/2019/07/12/reduced-motion-video.html)
- [PCNMobile: Disable Auto-Play Videos on Mobile Devices to Save Data](https://pcnmobile.com/disable-auto-play-videos-on-mobile-devices-to-save-data/)
- [AppScale: Three.js in Production 2026 — WebGPU, Perf & Fallback](https://appscale.blog/en/blog/threejs-production-3d-web-2026-webgpu-realtime-standards)
- [Utsubo: 100 Three.js Tips That Actually Improve Performance (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- [xjavascript.com: How to Properly Detect WebGL Support](https://www.xjavascript.com/blog/proper-way-to-detect-webgl-support/)
- [Utsubo: WebGL & Three.js Site SEO — Make 3D Sites Rankable (2026)](https://www.utsubo.com/blog/webgl-three-js-site-seo-rankable-guide)
- [MDN: `<canvas>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas)
- [Kooba: WebGL — The Pros, The Cons, The Possibilities](https://www.kooba.ie/journal/webgl-the-pros-the-cons-the-possibilities)
- [Web Designer Depot: How Scrolljacking Breaks UX Fundamentals](https://webdesignerdepot.com/how-scrolljacking-breaks-ux-fundamentals/)
- [A List Apart: Designing Safer Web Animation for Motion Sensitivity](https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/)
- [Web Axe: Vestibular Issues in Parallax Design](https://www.webaxe.org/vestibular-issues-parallax-design/)
- [Wikipedia: Mystery meat navigation](https://en.wikipedia.org/wiki/Mystery_meat_navigation)
- [Bomberbot: Material Design and the Mystery Meat Navigation Problem](https://www.bomberbot.com/design/material-design-and-the-mystery-meat-navigation-problem/)
- [Framer: Breakpoints in Responsive Web Design — 2026 Guide](https://www.framer.com/blog/responsive-breakpoints/)
- [Socialectric: Best Mobile Heading Sizes for Nonprofit Websites](https://www.socialectric.com/insights/mobile-heading-sizes-nonprofit-website)
- [NN/g: Breakpoints in Responsive Design](https://www.nngroup.com/articles/breakpoints-in-responsive-design/)
- [staticapps.org: Routing URLs in Static Web Apps](https://www.staticapps.org/articles/routing-urls-in-static-apps/)
- [Telerik: Please Respect The "Back" Button](https://www.telerik.com/blogs/please-respect-the-back-button)
- [Proxify: Main SPA SEO challenges and ways to make your web app discoverable](https://proxify.io/articles/single-page-app-spa-seo)
- [UXPin: Design System Governance — A Guide to Prevent Drift](https://www.uxpin.com/studio/blog/design-system-governance/)
- [UXPin: Prevent Design Drift — Design System Governance Guide](https://www.uxpin.com/studio/blog/design-drift/)

---
*Pitfalls research for: marketing-homepage prototypes (editorial / full-screen video / WebGL-3D)*
*Researched: 2026-07-23*
