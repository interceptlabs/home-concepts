#!/usr/bin/env python3
"""
copy-diff — the mechanical verbatim-copy gate for intercept-home-concepts.

Copy drift from re-typing is this project's known failure mode: a builder
paraphrases, truncates wrong, or fat-fingers a canonical string while wiring
a concept page together. This gate turns "trust the builder pasted
correctly" into "trust the gate" — every concept page (Phases 2-5) must
pass it before it is shown to Jon.

Two verification modes:

  annotated  — pages that mark their copy-bearing elements with
               `data-copy="dot.path.into.homepage.json"` (and, for the one
               permitted case of a truncated teaser,
               `data-copy-truncated="true"`). Exact-match verification,
               scoped to exactly the annotated element.

  substring  — pages with no `data-copy` attributes at all. Falls back to
               scanning the page's full visible text for chunks of
               canonical copy (long strings only) and verifying that any
               chunk found is verbatim, not partially reproduced/corrupted.

`--mode auto` (the default) picks per-page: annotated if the page has any
`data-copy` attribute, substring otherwise.

Usage:
    python3 qa/copy-diff.py PAGE.html [PAGE2.html ...]
    python3 qa/copy-diff.py --all [ROOT ...]
    python3 qa/copy-diff.py --content path/to/homepage.json PAGE.html
    python3 qa/copy-diff.py --mode annotated PAGE.html

Exit codes: 0 = all pages/chunks pass, 1 = at least one failure, 2 = usage/IO error.

Stdlib only: argparse, json, re, sys, difflib, pathlib, html.parser.
"""
import argparse
import difflib
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

SCRIPT_PATH = Path(__file__).resolve()
QA_DIR = SCRIPT_PATH.parent          # qa/
REPO_ROOT = QA_DIR.parent            # repo root (script's parent's parent)
CONTENT_DEFAULT = REPO_ROOT / "content" / "homepage.json"
DEFAULT_ALL_ROOTS = ["concept-a", "concept-b", "concept-c"]

SKIP_TAGS = {"script", "style", "svg", "symbol", "noscript", "template"}
VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}

WHITESPACE_RE = re.compile(r"\s+")
SUBSTRING_MIN_LEN = 40   # only leaves this long (normalized) are worth fallback-detecting
SUBSTRING_PROBE_LEN = 30  # first N normalized chars used to detect presence


# ─── Extraction ─────────────────────────────────────────────────────────────

class _DataCopyChunk:
    """Accumulates the visible text of one data-copy-annotated subtree."""

    __slots__ = ("data_copy", "truncated", "parts")

    def __init__(self, data_copy, truncated):
        self.data_copy = data_copy
        self.truncated = truncated
        self.parts = []

    def text(self):
        return "".join(self.parts)


class VisibleTextExtractor(HTMLParser):
    """Stdlib-only visible-text extractor.

    - Skips text inside SKIP_TAGS (script/style/svg/symbol/noscript/template),
      tracked via a skip-depth counter so nested skip tags stay correct.
    - Collects the page's full visible text (`self.text_parts`).
    - Collects, per `data-copy`-bearing element, that element's own subtree
      visible text plus its `data-copy`/`data-copy-truncated` attributes
      (`self.chunks`), via a tag stack so void elements (img/br/...) never
      corrupt depth tracking.
    """

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.text_parts = []
        self.tag_stack = []      # [{"tag": str, "is_skip": bool, "chunk": _DataCopyChunk|None}]
        self.active_chunks = []  # currently-open _DataCopyChunk objects (any depth)
        self.chunks = []         # completed _DataCopyChunk objects, in document order

    def handle_starttag(self, tag, attrs):
        self._open(tag, attrs)

    def handle_startendtag(self, tag, attrs):
        # HTMLParser's default handle_startendtag calls starttag then endtag;
        # we override explicitly to keep the void/self-closing logic in one place.
        self._open(tag, attrs)
        if tag not in VOID_TAGS:
            self._close(tag)

    def _open(self, tag, attrs):
        attrs_d = dict(attrs)

        # Decide chunk membership BEFORE incrementing skip_depth for this
        # tag, so an element that is itself a skip tag (e.g. a stray
        # data-copy on an <svg>) is never treated as copy-bearing.
        chunk = None
        data_copy = attrs_d.get("data-copy")
        if data_copy and self.skip_depth == 0:
            truncated = attrs_d.get("data-copy-truncated") == "true"
            chunk = _DataCopyChunk(data_copy, truncated)
            self.active_chunks.append(chunk)

        is_skip = tag in SKIP_TAGS
        if is_skip:
            self.skip_depth += 1

        if tag in VOID_TAGS:
            # void elements never receive a matching handle_endtag; don't
            # push them onto the tag stack, and close any chunk they opened
            # immediately (data-copy on a void element is unusual, but
            # handle it rather than corrupting the stack).
            if chunk is not None:
                self.active_chunks.remove(chunk)
                self.chunks.append(chunk)
            if is_skip:
                self.skip_depth -= 1
        else:
            self.tag_stack.append({"tag": tag, "is_skip": is_skip, "chunk": chunk})

    def handle_endtag(self, tag):
        self._close(tag)

    def _close(self, tag):
        if tag in VOID_TAGS:
            return
        for i in range(len(self.tag_stack) - 1, -1, -1):
            if self.tag_stack[i]["tag"] == tag:
                entry = self.tag_stack.pop(i)
                if entry["chunk"] is not None:
                    chunk = entry["chunk"]
                    if chunk in self.active_chunks:
                        self.active_chunks.remove(chunk)
                    self.chunks.append(chunk)
                if entry["is_skip"]:
                    self.skip_depth -= 1
                break
            # tags between i and the stack top are unclosed (malformed HTML);
            # leave them — we only pop back to the first match found.

    def handle_data(self, data):
        if self.skip_depth > 0:
            return
        self.text_parts.append(data)
        for chunk in self.active_chunks:
            chunk.parts.append(data)

    def full_text(self):
        return "".join(self.text_parts)


def extract(html_text):
    ext = VisibleTextExtractor()
    ext.feed(html_text)
    ext.close()
    return ext


def strip_tags_to_text(html_fragment):
    """Run an inline-markup fragment (an `_html` canonical value) through the
    same extractor used for pages, so both sides of a comparison are
    apples-to-apples visible text."""
    return extract(html_fragment).full_text()


# ─── Normalization ──────────────────────────────────────────────────────────

def normalize(text):
    return WHITESPACE_RE.sub(" ", text).strip()


def strip_trailing_ellipsis(text):
    if text.endswith("…"):
        return text[:-1].rstrip()
    if text.endswith("..."):
        return text[:-3].rstrip()
    return text


def canonical_normalized(dot_path, value):
    """Normalize a canonical JSON leaf for comparison. `_html`-suffixed
    fields carry inline markup — strip tags before comparing visible text."""
    last_segment = dot_path.rsplit(".", 1)[-1]
    if last_segment.endswith("_html"):
        return normalize(strip_tags_to_text(value))
    return normalize(value)


# ─── Canonical JSON dot-path resolution ────────────────────────────────────

def resolve_path(data, dot_path):
    """Resolve a dot-path (dict keys + numeric list indices) to a STRING
    leaf. Returns (value, True) on success, (None, False) if the path is
    missing, out of range, or does not land on a string."""
    node = data
    for part in dot_path.split("."):
        if isinstance(node, dict):
            if part not in node:
                return None, False
            node = node[part]
        elif isinstance(node, list):
            if not part.lstrip("-").isdigit():
                return None, False
            idx = int(part)
            if idx < 0 or idx >= len(node):
                return None, False
            node = node[idx]
        else:
            return None, False
    if not isinstance(node, str):
        return None, False
    return node, True


def walk_leaves(node, prefix=""):
    """Yield (dot_path, string_value) for every string leaf in the canonical
    JSON tree."""
    if isinstance(node, dict):
        for key, value in node.items():
            yield from walk_leaves(value, f"{prefix}.{key}" if prefix else key)
    elif isinstance(node, list):
        for idx, value in enumerate(node):
            yield from walk_leaves(value, f"{prefix}.{idx}" if prefix else str(idx))
    elif isinstance(node, str):
        yield prefix, node


# ─── Comparison / diff ──────────────────────────────────────────────────────

def word_diff(expected, got):
    """Readable unified diff at word granularity, so a single paraphrased or
    dropped word is easy to spot in a long paragraph."""
    diff = difflib.unified_diff(
        expected.split(" "), got.split(" "),
        fromfile="expected (canonical)", tofile="got (rendered)", lineterm="",
    )
    return list(diff)


# ─── Annotated mode ─────────────────────────────────────────────────────────

def check_annotated(chunks, homepage_data):
    results = []
    for chunk in chunks:
        dot_path = chunk.data_copy
        rendered_norm = normalize(chunk.text())
        canonical_value, resolved = resolve_path(homepage_data, dot_path)

        if not resolved:
            results.append({
                "path": dot_path, "status": "FAIL",
                "message": f"unresolvable path or non-string leaf: {dot_path!r}",
            })
            continue

        canonical_norm = canonical_normalized(dot_path, canonical_value)

        if chunk.truncated:
            rendered_check = strip_trailing_ellipsis(rendered_norm)
            if rendered_check and canonical_norm.startswith(rendered_check):
                boundary_ok = True
                cut_at = len(rendered_check)
                if cut_at < len(canonical_norm):
                    next_char = canonical_norm[cut_at]
                    boundary_ok = not (next_char.isalnum())
                if boundary_ok:
                    results.append({
                        "path": dot_path, "status": "PASS",
                        "message": "prefix-verified (permitted truncation)",
                    })
                else:
                    results.append({
                        "path": dot_path, "status": "FAIL",
                        "message": "truncation does not land on a word boundary",
                        "expected": canonical_norm, "got": rendered_norm,
                        "diff": word_diff(canonical_norm[:cut_at + 12], rendered_check),
                    })
            else:
                results.append({
                    "path": dot_path, "status": "FAIL",
                    "message": "data-copy-truncated text is not an exact prefix of the canonical string",
                    "expected": canonical_norm, "got": rendered_norm,
                    "diff": word_diff(canonical_norm, rendered_check),
                })
        else:
            if rendered_norm == canonical_norm:
                results.append({"path": dot_path, "status": "PASS", "message": "exact match"})
            else:
                results.append({
                    "path": dot_path, "status": "FAIL",
                    "message": "rendered text does not match canonical string verbatim",
                    "expected": canonical_norm, "got": rendered_norm,
                    "diff": word_diff(canonical_norm, rendered_norm),
                })
    return results


# ─── Substring fallback mode ────────────────────────────────────────────────

def check_substring(page_text_norm, homepage_data):
    results = []
    for dot_path, value in walk_leaves(homepage_data):
        norm = canonical_normalized(dot_path, value)
        if len(norm) < SUBSTRING_MIN_LEN:
            continue
        probe = norm[:SUBSTRING_PROBE_LEN]
        if probe not in page_text_norm:
            continue  # this chunk isn't on this page at all — not an error
        if norm in page_text_norm:
            results.append({"path": dot_path, "status": "PASS", "message": "substring-verified"})
        else:
            results.append({
                "path": dot_path, "status": "FAIL",
                "message": "detected chunk corrupted: page contains the opening words of this "
                           "canonical string but not the full text verbatim",
                "expected": norm,
            })
    if not results:
        results.append({"path": None, "status": "PASS", "message": "no canonical copy detected"})
    return results


# ─── Per-page dispatch ──────────────────────────────────────────────────────

def process_page(path, homepage_data, mode_arg):
    text = path.read_text(errors="ignore")
    ext = extract(text)

    if mode_arg == "annotated":
        mode = "annotated"
    elif mode_arg == "substring":
        mode = "substring"
    else:  # auto
        mode = "annotated" if ext.chunks else "substring"

    if mode == "annotated":
        if not ext.chunks:
            return mode, [{"path": None, "status": "PASS",
                            "message": "no data-copy elements found; nothing to verify"}]
        return mode, check_annotated(ext.chunks, homepage_data)

    page_text_norm = normalize(ext.full_text())
    return mode, check_substring(page_text_norm, homepage_data)


# ─── --all root discovery ───────────────────────────────────────────────────

def resolve_roots(custom_roots):
    if custom_roots:
        return [Path(r) for r in custom_roots]
    return [REPO_ROOT / r for r in DEFAULT_ALL_ROOTS]


def find_html_files(root):
    if not root.exists():
        print(f"warning: --all root does not exist yet, skipping: {root}", file=sys.stderr)
        return []
    return sorted(root.rglob("*.html"))


# ─── Report / CLI ───────────────────────────────────────────────────────────

def print_report(page, mode, results):
    print(f"\n== {page} ==")
    print(f"mode: {mode}")
    failures = 0
    for r in results:
        label = r["path"] or ""
        if r["status"] == "PASS":
            print(f"PASS {label} — {r['message']}".rstrip() if label else f"PASS — {r['message']}")
        else:
            failures += 1
            print(f"FAIL {label} — {r['message']}".rstrip() if label else f"FAIL — {r['message']}")
            if "expected" in r:
                print(f"  expected: {r['expected']!r}")
            if "got" in r:
                print(f"  got:      {r['got']!r}")
            if r.get("diff"):
                for line in r["diff"]:
                    print(f"  {line}")
    return failures


def build_arg_parser():
    p = argparse.ArgumentParser(
        description="copy-diff — blocking verbatim-copy gate for intercept-home-concepts.",
    )
    p.add_argument("pages", nargs="*", help="HTML page(s) to check")
    p.add_argument(
        "--all", nargs="*", default=None, metavar="ROOT",
        help=f"recursively check all *.html under ROOT(s) (default: {' '.join(DEFAULT_ALL_ROOTS)}); "
             "missing roots are skipped with a warning, never a crash",
    )
    p.add_argument(
        "--content", default=None,
        help=f"path to canonical JSON content (default: {CONTENT_DEFAULT}, resolved relative to "
             "this script regardless of cwd)",
    )
    p.add_argument(
        "--mode", choices=["auto", "annotated", "substring"], default="auto",
        help="auto (default): annotated mode if the page has any data-copy attribute, else substring fallback",
    )
    return p


def main(argv=None):
    parser = build_arg_parser()
    args = parser.parse_args(argv)

    if args.all is None and not args.pages:
        parser.print_usage(sys.stderr)
        print("error: provide one or more PAGE.html arguments, or --all", file=sys.stderr)
        return 2

    content_path = Path(args.content) if args.content else CONTENT_DEFAULT
    try:
        homepage_data = json.loads(content_path.read_text())
    except OSError as e:
        print(f"error: cannot read canonical content file {content_path}: {e}", file=sys.stderr)
        return 2
    except json.JSONDecodeError as e:
        print(f"error: canonical content file {content_path} is not valid JSON: {e}", file=sys.stderr)
        return 2

    pages = []
    if args.all is not None:
        for root in resolve_roots(args.all):
            pages.extend(find_html_files(root))
    pages.extend(Path(p) for p in args.pages)

    total_chunks = 0
    total_failures = 0

    for page in pages:
        if not page.exists():
            print(f"error: page not found: {page}", file=sys.stderr)
            return 2
        try:
            mode, results = process_page(page, homepage_data, args.mode)
        except OSError as e:
            print(f"error: cannot read page {page}: {e}", file=sys.stderr)
            return 2
        total_chunks += len(results)
        total_failures += print_report(page, mode, results)

    print(f"\n{len(pages)} page(s) checked, {total_chunks} chunk(s) checked, {total_failures} failure(s)")
    return 0 if total_failures == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
