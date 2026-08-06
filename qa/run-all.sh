#!/usr/bin/env bash
# qa/run-all.sh — run every Concept D QA gate in sequence.
# Rendered gates (lockup-crisp, lockup-contrast) need the dev server up on :4340
# (./serve.py &).  Exits non-zero if any gate fails.
set -u
cd "$(dirname "$0")/.."
fail=0
run() { local name="$1"; shift; echo "── $name"; if "$@"; then :; else echo "  ✗ $name FAILED"; fail=1; fi; echo; }

run "copy-diff        (verbatim copy immutability)"      python3 qa/copy-diff.py --all
run "script-diff      (deployed-JS parity)"              python3 qa/concept-d-script-diff.py
run "lockup-crisp     (wordmark crisp, integer-placed)"  node qa/lockup-crisp-check.mjs
run "no-rule-lines    (no decorative accent rule-lines)" node qa/no-rule-lines-check.mjs
run "lockup-contrast  (wordmark visible on its surface)" node qa/lockup-contrast-check.mjs
run "type-discipline  (one ladder, no mono, panels unclipped)" node qa/type-discipline-check.mjs

if [ "$fail" -eq 0 ]; then echo "✅ ALL GATES PASS"; else echo "❌ SOME GATES FAILED"; exit 1; fi
