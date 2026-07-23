# Deferred Items — Phase 01

Out-of-scope discoveries logged during execution, not fixed (per scope boundary rules).

## gsd-tools state.cjs schema mismatch (found during 01-02 execution)

- **`state advance-plan`** errors with `Cannot parse Current Plan or Total Plans in Phase from STATE.md`. It looks for literal `Current Plan:` / `Total Plans in Phase:` fields, but this project's STATE.md uses a combined human-readable line instead: `Plan: 0 of TBD in current phase`. Pre-existing schema mismatch between the STATE.md this project was bootstrapped with and the field names `lib/state.cjs` expects.
- **`state update-progress`** reports `{ updated: true }` but never actually changes the body's `Progress: [...] %` line. Root cause: `cmdStateUpdateProgress`'s regex `/^(Progress:\s*).*/im` is case-insensitive and matches the YAML frontmatter's own `progress:` key (which appears earlier in the raw file, before the intended body `Progress:` field) rather than the body field. This is harmless to data integrity because `writeStateMd` → `syncStateFrontmatter` regenerates the frontmatter wholesale from the body afterward, but the body's Progress bar itself is never updated by this command.
- **`state record-metric`** appends the new table row after the entire Performance Metrics section (including the trailing italic note), not inside the actual markdown table, because its capture group extends to the next `##` heading rather than stopping at the table's last row.

None of these were caused by 01-02's plan content — they are pre-existing tool/schema issues. Worked around by hand-editing STATE.md's body text directly for this plan's completion. Flagging here so a future phase (or a gsd-tools maintenance pass) can either update STATE.md's schema to match `lib/state.cjs`'s expected field names, or fix the three functions above.

## gsd-tools roadmap.cjs schema mismatch (found during 01-02 execution)

- **`roadmap update-plan-progress`** reports `{ updated: true }` but silently no-ops on this project's ROADMAP.md. It looks for a pipe-table progress row (`| <phase> | ... |`) and a `**Plans:**` (colon-inside-bold) field in each phase detail section; this project's ROADMAP.md instead uses a `**Plans**: N plans` (colon-outside-bold) line followed by a per-plan markdown checkbox list (`- [ ] 01-02-PLAN.md — ...`). Neither regex matches, so `.replace()` returns the content unchanged and the function writes/reports success regardless. Worked around by hand-editing the `**Plans**:` line and checking off the `01-02-PLAN.md` list item directly.
