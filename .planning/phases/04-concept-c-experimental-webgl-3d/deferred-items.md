# Deferred Items — Phase 04 (Concept C)

Out-of-scope discoveries surfaced during plan execution, logged per the
executor's scope-boundary rule (pre-existing issues unrelated to the current
task are not auto-fixed).

## 04-01

- **`GET /favicon.ico` → 404** — observed during Task 3's Puppeteer capture
  smoke test (`page.on('response')`). No favicon exists anywhere in the repo
  (`find . -iname favicon*` returns nothing) — this is a site-wide,
  pre-existing gap across all three concepts, not something introduced by or
  scoped to Concept C. Not fixed here.
