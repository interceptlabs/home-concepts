# Shared Brand Layer

This directory is the single source of truth all three concepts (A, B, C) link into. Concepts never re-declare brand values locally — they consume `shared/` and `content/` only, and never reach into each other's directories.

## How to consume this layer

Link order in every concept page's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="/shared/tokens.css">
<link rel="stylesheet" href="/shared/fonts.css">
<link rel="stylesheet" href="/shared/motion.css">
```

Embed the logo via `<img src="/shared/logo/lockup.svg" alt="Intercept">` or inline the SVG directly (inlining lets `currentColor` pick up the surrounding text color).

Never re-declare brand hex values locally — always reference a `var()`, using either the canonical ramp names (`--flarepop-100`, `--bg-page`, `--fg-primary`, etc.) or the Variant-A shorthand aliases (`--flarepop`, `--page`, `--surface`, `--fg`, etc.), both defined in `tokens.css`.

## Brand rules

These are binding on all three concepts.

Flarepop (`--flarepop`) is the ONLY colored text. Everything else renders in ink/neutrals.

Triangles are apex-up with the right angle at the base. They may lean left or right — never inverted, never rotated.

The mark is never decoration or an icon. The only exceptions are patterning or explicit CD approval.

"No gradients" means 3-9 hard-edged equal steps, never a smooth grade.

No decorative rule lines, underlines, or divider accents. Use space, weight, and alignment instead.

No invented decorative marks.

The tagline "Fresh thinking starts here." is banned. It must not appear anywhere.

Motion uses sine ease-in-out (`--ease-inout-sine`) with long durations (`--dur-med` / `--dur-long`) and no jarring landings.

The web_animated glitch lockup is suspended. Use the static `lockup.svg` only.

Deprecated 12-path mark colors `#A855F7`, `#6366F1`, `#22D3EE` must appear nowhere. Gate: `grep -rEi 'A855F7|6366F1|22D3EE' <files>` must return nothing.

## Copy rules

These are binding on all three concepts.

Copy is immutable. Transcribe verbatim from `content/homepage.json` — no paraphrasing, no case changes, no "improvements." Never fabricate extension copy.

Canonical copy must live as literal HTML text nodes in the page markup. JS may drive interaction and visibility, but must never be the sole storage location for copy — a static-file gate verifies pages, and JS-injected copy is invisible to it and will fail review.

Annotate every copy-bearing element with `data-copy="<dot-path>"` pointing into `homepage.json` (for example `data-copy="hero.sub"`, `data-copy="work.cases.0.summary"`). Paths must resolve to string leaves. Truncation at a natural boundary is permitted only with `data-copy-truncated="true"`, and the truncated text must be an exact prefix of the canonical string.

Gate: `python3 qa/copy-diff.py <page.html>` (or `--all`) must exit 0 before anything is shown to Jon.

## Architecture rules

Concepts consume only `content/` and `shared/` — never each other. Each concept is fully self-contained in its own directory with its own assets.
