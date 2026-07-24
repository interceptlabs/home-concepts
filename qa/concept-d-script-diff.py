#!/usr/bin/env python3
"""
concept-d-script-diff — the compensating verbatim gate for Concept D's
JS-templated copy.

copy-diff.py (see qa/copy-diff.py) only sees copy that lives as literal HTML
text nodes. Concept D ports the deployed staging homepage's own JS data
objects verbatim instead of hand-authoring static markup, so the bulk of
Problems/InterceptOS/Agents/Work-detail copy (113 of 155 long canonical
chunks, per 05-RESEARCH.md) lives ONLY inside `<script>` string literals and
is invisible to copy-diff's static-HTML extraction. This gate closes that
blind spot mechanically: it re-derives each ported data object's source
region from staging `home.html` using a brace-counting scanner (so braces
inside string/template literals never desync the count) and byte-compares it
against the same region in `concept-d/assets/js/deployed.js`.

This is Phase 5's verification for the JS-templated copy; a Puppeteer
rendered-DOM copy-diff variant is deferred to Phase 6.

Checks:
  1. PROBLEMS_RR, PROBLEM_FLOWS, AGENTS, CAT_LABELS, CASES — each `const NAME
     = {...};` region extracted from both staging home.html and deployed.js,
     byte-compared. On mismatch: object name + a +/-60-char context window
     around the first differing byte.
  2. CASE_IMG — the 3 base64 data URIs in STAGING are decoded and
     byte-compared against the corresponding concept-d/assets/img/case-*.png
     files; deployed.js's CASE_IMG is asserted to contain exactly the 3
     expected /concept-d/assets/img/ paths (the one permitted CASE_IMG edit).
  3. Exclusion asserts — mobile.html, assets/video/hero.mp4 NOT in
     deployed.js; .hero__video NOT in deployed.css; navContactBtn NOT in
     deployed.js (the deployed page's own contact-click JS hijack, deleted
     per the plan's second permitted edit).

Usage:
    python3 qa/concept-d-script-diff.py
    python3 qa/concept-d-script-diff.py --staging PATH --js PATH --css PATH

Exit codes: 0 = all checks pass, 1 = at least one failure, 2 = usage/IO error.

Stdlib only: argparse, base64, re, sys, pathlib.
"""
import argparse
import base64
import re
import sys
from pathlib import Path

SCRIPT_PATH = Path(__file__).resolve()
QA_DIR = SCRIPT_PATH.parent          # qa/
REPO_ROOT = QA_DIR.parent            # repo root

STAGING_DEFAULT = "/Users/jontoewsinterceptgroup.com/Creative-Projects/intercept-website-staging/home.html"
JS_DEFAULT = REPO_ROOT / "concept-d" / "assets" / "js" / "deployed.js"
CSS_DEFAULT = REPO_ROOT / "concept-d" / "assets" / "css" / "deployed.css"

DATA_OBJECT_NAMES = ["PROBLEMS_RR", "PROBLEM_FLOWS", "AGENTS", "CAT_LABELS", "CASES"]

CASE_IMG_KEY_TO_FILE = {
    "hp-abx": "case-hp-abx.png",
    "intel-abm": "case-intel-abm.png",
    "sap-video": "case-sap-video.png",
}

CONTEXT_RADIUS = 60


# ─── Brace-counting const-object scanner ───────────────────────────────────

def extract_const_object(text, name):
    """Find `const NAME` then scan forward from the next `{` counting
    braces, tracking quote state (', ", `) so braces inside string/template
    literals never desync the count. Returns the exact substring from the
    `const NAME` token through the matching closing brace (plus a trailing
    `;` if immediately present), or None if not found / unbalanced."""
    marker_re = re.compile(r"\bconst\s+" + re.escape(name) + r"\b")
    m = marker_re.search(text)
    if m is None:
        return None
    start = m.start()
    brace_start = text.find("{", m.end())
    if brace_start == -1:
        return None

    i = brace_start
    n = len(text)
    depth = 0
    quote_char = None
    while i < n:
        c = text[i]
        if quote_char is not None:
            if c == "\\":
                i += 2
                continue
            if c == quote_char:
                quote_char = None
            i += 1
            continue
        if c in ("'", '"', "`"):
            quote_char = c
            i += 1
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                if end < n and text[end] == ";":
                    end += 1
                return text[start:end]
        i += 1
    return None  # unbalanced braces — never reached with well-formed JS


def context_window(text, pos, radius=CONTEXT_RADIUS):
    start = max(0, pos - radius)
    end = min(len(text), pos + radius)
    return text[start:end]


def first_diff_offset(a, b):
    n = min(len(a), len(b))
    for i in range(n):
        if a[i] != b[i]:
            return i
    if len(a) != len(b):
        return n
    return None


# ─── Checks ─────────────────────────────────────────────────────────────────

def check_data_objects(staging_text, js_text):
    results = []
    for name in DATA_OBJECT_NAMES:
        staging_region = extract_const_object(staging_text, name)
        js_region = extract_const_object(js_text, name)

        if staging_region is None:
            results.append((False, name, f"could not locate 'const {name}' in staging source"))
            continue
        if js_region is None:
            results.append((False, name, f"could not locate 'const {name}' in deployed.js"))
            continue

        if staging_region == js_region:
            results.append((True, name, f"byte-identical ({len(staging_region)} chars)"))
            continue

        diff_at = first_diff_offset(staging_region, js_region)
        expected_ctx = context_window(staging_region, diff_at)
        got_ctx = context_window(js_region, diff_at)
        msg = (
            f"byte mismatch at offset {diff_at} within the object region\n"
            f"    expected (staging): {expected_ctx!r}\n"
            f"    got (deployed.js):  {got_ctx!r}"
        )
        results.append((False, name, msg))
    return results


def check_case_img(staging_text, js_text, img_dir):
    results = []

    b64_pattern = re.compile(
        r"'(hp-abx|intel-abm|sap-video)':'data:image/png;base64,([A-Za-z0-9+/=]+)'"
    )
    staging_matches = {m.group(1): m.group(2) for m in b64_pattern.finditer(staging_text)}

    for key, fname in CASE_IMG_KEY_TO_FILE.items():
        label = f"CASE_IMG:{key}"
        b64 = staging_matches.get(key)
        if b64 is None:
            results.append((False, label, "could not find this key's base64 data URI in staging source"))
            continue
        try:
            decoded = base64.b64decode(b64)
        except Exception as e:  # noqa: BLE001 - report any decode failure as a FAIL, not a crash
            results.append((False, label, f"staging base64 failed to decode: {e}"))
            continue

        img_path = img_dir / fname
        try:
            on_disk = img_path.read_bytes()
        except OSError as e:
            results.append((False, label, f"cannot read {img_path}: {e}"))
            continue

        if decoded == on_disk:
            results.append((True, label, f"{img_path} byte-identical to decoded staging base64 ({len(on_disk)} bytes)"))
        else:
            results.append((False, label, f"{img_path} does NOT match decoded staging base64 "
                                           f"(decoded {len(decoded)} bytes vs on-disk {len(on_disk)} bytes)"))

    path_pattern = re.compile(
        r"'(hp-abx|intel-abm|sap-video)':'(/concept-d/assets/img/case-[\w-]+\.png)'"
    )
    js_paths = {m.group(1): m.group(2) for m in path_pattern.finditer(js_text)}
    expected_paths = {key: f"/concept-d/assets/img/{fname}" for key, fname in CASE_IMG_KEY_TO_FILE.items()}
    label = "CASE_IMG:paths"
    if js_paths == expected_paths:
        results.append((True, label, f"deployed.js CASE_IMG contains exactly the 3 expected /concept-d/assets/img/ paths"))
    else:
        results.append((False, label, f"deployed.js CASE_IMG paths mismatch\n"
                                       f"    expected: {expected_paths}\n"
                                       f"    got:      {js_paths}"))
    return results


def check_exclusions(js_text, css_text):
    results = []
    checks = [
        ("exclusion:mobile.html", "mobile.html" not in js_text, "deployed.js"),
        ("exclusion:hero.mp4", "assets/video/hero.mp4" not in js_text, "deployed.js"),
        ("exclusion:hero__video-css", ".hero__video" not in css_text, "deployed.css"),
        ("exclusion:navContactBtn", "navContactBtn" not in js_text, "deployed.js"),
    ]
    for label, ok, where in checks:
        if ok:
            results.append((True, label, f"absent from {where}, as required"))
        else:
            results.append((False, label, f"FOUND in {where} — must not be ported"))
    return results


# ─── CLI ─────────────────────────────────────────────────────────────────────

def build_arg_parser():
    p = argparse.ArgumentParser(
        description="concept-d-script-diff — verbatim gate for Concept D's JS-templated copy.",
    )
    p.add_argument("--staging", default=STAGING_DEFAULT, help=f"path to staging home.html (default: {STAGING_DEFAULT})")
    p.add_argument("--js", default=str(JS_DEFAULT), help=f"path to concept-d's deployed.js (default: {JS_DEFAULT})")
    p.add_argument("--css", default=str(CSS_DEFAULT), help=f"path to concept-d's deployed.css (default: {CSS_DEFAULT})")
    return p


def main(argv=None):
    parser = build_arg_parser()
    args = parser.parse_args(argv)

    staging_path = Path(args.staging)
    js_path = Path(args.js)
    css_path = Path(args.css)

    try:
        staging_text = staging_path.read_text(encoding="utf-8")
    except OSError as e:
        print(f"error: cannot read staging source {staging_path}: {e}", file=sys.stderr)
        return 2
    try:
        js_text = js_path.read_text(encoding="utf-8")
    except OSError as e:
        print(f"error: cannot read {js_path}: {e}", file=sys.stderr)
        return 2
    try:
        css_text = css_path.read_text(encoding="utf-8")
    except OSError as e:
        print(f"error: cannot read {css_path}: {e}", file=sys.stderr)
        return 2

    img_dir = REPO_ROOT / "concept-d" / "assets" / "img"

    all_results = []
    all_results.extend(check_data_objects(staging_text, js_text))
    all_results.extend(check_case_img(staging_text, js_text, img_dir))
    all_results.extend(check_exclusions(js_text, css_text))

    failures = 0
    for ok, label, message in all_results:
        status = "PASS" if ok else "FAIL"
        print(f"{status} {label} — {message}")
        if not ok:
            failures += 1

    print(f"\n{len(all_results)} check(s), {failures} failure(s)")
    return 0 if failures == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
