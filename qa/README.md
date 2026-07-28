# qa/ — copy-diff verbatim gate

`qa/copy-diff.py` is the blocking gate that enforces this project's copy-immutability rule (see `shared/README.md` § Copy rules): every concept page must reproduce `content/homepage.json` verbatim. Re-typing copy by hand is this project's known failure mode — a paraphrased word, a bad truncation, or a stale path all look fine at a glance and only get caught by a mechanical diff. This gate turns "trust the builder pasted correctly" into "trust the gate," and it must exit 0 before anything is shown to Jon.

Stdlib only (`argparse`, `json`, `re`, `sys`, `difflib`, `pathlib`, `html.parser`) — no dependencies to install.

## What it enforces

For every page it checks, `copy-diff.py` extracts the page's visible text (ignoring anything inside `<script>`, `<style>`, `<svg>`, `<symbol>`, `<noscript>`, `<template>`) and compares it against the canonical strings in `content/homepage.json`, using one of two modes.

### Annotated mode

Used for any page that marks its copy-bearing elements with `data-copy`. This is the required convention for all concept pages (Phases 2-5):

```html
<h1 data-copy="hero.h1_html">We turn your most <em>ambitious</em> briefs into <em>proven</em> outcomes<span class="dot">.</span></h1>
<p data-copy="hero.sub">Marketing teams are increasingly pressured to adopt AI, …</p>
<p data-copy="work.cases.0.summary" data-copy-truncated="true">Cross-sell GTM across HP’s Workforce Solutions portfolio, with…</p>
```

Rules:

- `data-copy="<dot.path>"` must resolve against `content/homepage.json` (dict keys + numeric array indices, e.g. `hero.sub`, `work.cases.0.summary`, `faqs.items.3.q`) and land on a **string** leaf. A missing key, an out-of-range index, or a path that resolves to an object/array is a FAIL ("unresolvable path or non-string leaf").
- Fields with an `_html` suffix (e.g. `hero.h1_html`) carry inline markup. Both sides of the comparison are tag-stripped to visible text before comparing, so the element's inline `<em>`/`<span>` markup is expected to match the canonical markup, but only the visible words are actually compared.
- Every other field must match **exactly** (whitespace-normalized: runs of whitespace collapse to a single space, and the string is trimmed).
- The only permitted deviation is `data-copy-truncated="true"`: the rendered text (minus a single trailing `…` or `...`) must be an exact, non-empty **prefix** of the canonical string, and the canonical string must have a whitespace/punctuation character immediately after that prefix (a truncation may only land on a word boundary — cutting mid-word, or dropping/rewording a word before the cut point, is a FAIL).

### Substring fallback mode

Used automatically for any page with **no** `data-copy` attributes at all (e.g. very early scaffolding, or non-concept pages). The gate extracts the page's full visible text and walks every string leaf in `content/homepage.json`. For any canonical leaf whose normalized length is at least 40 characters, if the leaf's first 30 normalized characters appear anywhere in the page text, the **entire** normalized leaf must also appear — otherwise it's a FAIL ("detected chunk corrupted"), which catches a corrupted/partial reproduction of a real chunk of canonical copy. Short leaves are never fallback-checked (too many incidental matches). A page where nothing is detected PASSes with the note "no canonical copy detected" — this is not a false negative, it just means the page currently carries no long-form canonical copy to verify.

`--mode` can force a specific mode instead of the default per-page auto-detection (see Usage).

## Usage

```bash
# Check one or more specific pages
python3 qa/copy-diff.py concept-a/index.html
python3 qa/copy-diff.py concept-a/index.html concept-a/work/hp-abx.html

# Check everything under the default concept roots (concept-a, concept-b, concept-c),
# recursively. Roots that don't exist yet are skipped with a warning — never a crash
# and never a silent pass without that warning.
python3 qa/copy-diff.py --all

# Check specific roots instead of the defaults
python3 qa/copy-diff.py --all concept-a some/other/dir

# Point at a different canonical content file (default: content/homepage.json,
# resolved relative to this script, so it works from any current directory)
python3 qa/copy-diff.py --content path/to/other.json concept-a/index.html

# Force a mode instead of per-page auto-detection
python3 qa/copy-diff.py --mode annotated concept-a/index.html
python3 qa/copy-diff.py --mode substring concept-a/index.html
```

Every invocation prints a per-page report: the mode used, then one `PASS <dot.path> — …` or `FAIL <dot.path> — …` line per chunk checked. Failures include the expected (canonical) and got (rendered) text plus a word-level `difflib.unified_diff`, so a single paraphrased or dropped word is easy to spot in a long paragraph. A final summary line reports total pages/chunks/failures.

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Every chunk on every checked page passed |
| `1` | At least one chunk failed (paraphrase, illegal truncation, unresolvable path, or corrupted substring) |
| `2` | Usage error or I/O error (no pages given, page not found, canonical content file missing/invalid JSON) |

**Every concept page must exit 0 from this gate before it is shown to Jon.**

## Fixtures are the gate's own regression proof

`qa/fixtures/` holds three small pages that exercise every branch of the gate's logic — they are not concept content, they are the gate's test suite:

- `pass-annotated.html` — must always PASS: exact match, inline-markup (`_html`) field, permitted word-boundary truncation, and array-index path resolution, plus a decoy `<script>`/`<svg>` block proving those never count as visible copy.
- `fail-annotated.html` — must always FAIL, three independent ways: a one-word paraphrase, an illegal (non-prefix) truncation, and an unresolvable dot-path.
- `pass-substring.html` — an unannotated page proving the substring-fallback mode detects and verifies canonical chunks with no `data-copy` present.

If `fail-annotated.html` ever starts passing, the gate itself is broken — that is its entire job.

# qa/lockup-crisp-check.mjs — lockup rasterization gate

Permanent gate born from the IT5 crunchy-wordmark fix: the concept-d header lockup's black wordmark paths once rasterized crunchy at DPR 1 because the wordmark group carried a runtime `translate(0,-10)` against a fractional viewBox scale, and the flex-centered logo sat at a near-half-pixel y offset that smeared every horizontal letterform edge. Root cause, fix, and before/after crops: `.planning/phases/10-concept-d-iteration-5/LOCKUP-FIX.md`. The deployed-header exemption does **not** apply to rendering quality.

Requires a running local server on `:4340` (`./serve.sh`) and Puppeteer (resolved from the home-directory `node_modules`, same as other headless QA here).

```bash
# Default: crops land in qa/lockup-crops/ (untracked, human review only)
node qa/lockup-crisp-check.mjs

# Or send crops to a specific out-dir
node qa/lockup-crisp-check.mjs .planning/phases/10-concept-d-iteration-5/captures/lockup
```

Checks `concept-d/index.html` and `concept-d/pages/explore/problems.html` at deviceScaleFactor 1 **and** 2 (override base URL with `LOCKUP_BASE`):

- **(a)** no computed CSS `transform` (other than `none`) on the resting logo chain — anchor, `svg.logo`, wordmark group (hover/glitch animation transforms are fine; the *resting* state must be transform-free)
- **(b)** rendered logo height is an integer CSS px value, and the logo sits at integer CSS y (fractional y is what smeared the type)
- **(c)** the wordmark group carries no `transform` attribute in markup — DOM check on the tested pages plus a static scan of every `concept-d/**/*.html` — and the header mark slot stays at the approved `translate(0, 1.22)`
- **(d)** captures tight DPR-1/DPR-2 header-lockup crops to the out-dir for human review (crops are evidence, not pixel-diffed)
- **(e)** zero pageerrors

Exits `0` only when every assertion passes; any failure exits `1` with a `FAIL` line naming the assertion. **The lockup must pass this gate before any concept-d work is shown to Jon.**

---

## The full gate suite — `qa/run-all.sh`

`bash qa/run-all.sh` runs every gate in sequence and exits non-zero if any fail.
The two rendered gates need the dev server up on :4340 (`./serve.py &`).

| Gate | File | Catches |
|---|---|---|
| copy-diff | `copy-diff.py` | paraphrased / corrupted verbatim copy |
| script-diff | `concept-d-script-diff.py` | drift from the deployed JS |
| lockup-crisp | `lockup-crisp-check.mjs` | non-canon / warped / fractionally-placed wordmark |
| **no-rule-lines** | `no-rule-lines-check.mjs` | decorative accent **rule-lines / highlight bars** (banned by the no-rule-lines brand rule). Static, cascade-aware: a bar is exempt if its selector is neutralised (`display:none`/`content:none`) elsewhere. Skips round-dot markers, short list dashes, data-viz swatches, and CSS-triangle icons. |
| **lockup-contrast** | `lockup-contrast-check.mjs` | the wordmark rendering **invisible against its surface** (header + footer, dpr1 + dpr2). Resolves the wordmark's effective luminance (1× raster tone or vector ink/currentColor) vs the surface behind it — the dark-footer-in-light-theme raster mismatch that shipped 2026-07-28. |

Both new gates ship with negative tests verified against the exact defects they were written for.
