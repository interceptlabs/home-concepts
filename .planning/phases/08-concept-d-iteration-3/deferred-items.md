# Deferred Items — Phase 8 (Concept D — Iteration 3)

Out-of-scope discovery found during 08-02 Task 3's REVIEW.md refresh. Not
fixed per the deviation rules' scope boundary (Task 3's own instructions
enumerate exactly three things to touch in REVIEW.md — the Concept D
paragraph, the Concept D what-to-try hints, and the captures pointer line —
and explicitly say "touch nothing else").

## REVIEW.md's shared "States worth checking" paragraph still says "D's modals"

- **Found during:** 08-02 Task 3, REVIEW.md refresh
- **What:** The cross-concept paragraph under "What to try" ("States worth
  checking on any of them: ... and keyboard-only paths (B's hotspots, C's
  topic labels, D's modals — Tab in, Esc out, focus returns to the card that
  opened it).") still describes Concept D's retired module-dialog pattern.
  Since 08-01, D has no modals — cards navigate to standalone explore pages
  (Tab in, Enter to navigate, Tab to the `.explore-back` link, Enter to
  return home), with Esc/drawer behavior now scoped to individual explore
  pages that open a drawer (Labs' pitch CTA, Agents' contact CTA), not to
  homepage-level card navigation.
- **Why not fixed:** this sentence is shared across all three of B/C/D and
  sits outside Task 3's explicitly enumerated edit list (paragraph / hints /
  captures pointer only, "touch nothing else"). Editing it risked overreach
  beyond the plan's literal scope.
- **Suggested fix (next REVIEW.md pass):** split the parenthetical so B/C
  keep their existing "Tab in, Esc out, focus returns to the label that
  opened it" description, and D gets its own accurate clause describing
  card → explore-page → back-link keyboard flow.
