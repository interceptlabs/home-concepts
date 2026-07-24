# Deferred Items — Phase 5 (Concept D)

Out-of-scope discoveries found during 05-03's mechanical QA sweep. Not fixed
per the deviation rules' scope boundary (pre-existing issues in files this
phase did not author, unrelated to the current task's changes).

## `concept-d/about.html` skip-link targets a `<main>` with no `id="main"`

- **Found during:** 05-03 Task 2, link-integrity pass
- **What:** `<a class="skip" href="#main">Skip to content</a>` (line 424) has
  no matching `id="main"` — the page's `<main>` element (line 487) carries
  no id at all, so the skip-to-content link is a dead in-page anchor.
- **Verified pre-existing, not a concept-d regression:** the exact same
  `href="#main"` / id-less `<main>` pair exists at the identical line
  numbers in the source itself
  (`~/Creative-Projects/intercept-website-staging/about.html`), confirmed
  via direct grep. 05-01 mirrored `about.html` verbatim (only the 5
  documented `home.html*` href patterns were rewritten) — this bug predates
  concept-d entirely.
- **Why not fixed:** `about.html` is a mirrored page, explicitly locked by
  CONTEXT as "left as-is" outside the 5-pattern href rewrite; it is also
  out of this phase's authored-file scope (05-03 built the 4 standalone
  section pages, not the mirrored pages). Fixing it would mean editing a
  file whose fidelity to the live/staging site is the entire point of
  mirroring it.
- **Disposition:** allowlisted in the 05-03 link-integrity checker (see
  05-03-SUMMARY.md's QA table) as a documented, pre-existing dead anchor —
  same category as the 3 legal-page links and the un-mirrored insights
  article pages already called out in the plan's own allowlist. Left for
  Jon/a future pass on the live staging site itself, not concept-d.
