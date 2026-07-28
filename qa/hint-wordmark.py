#!/usr/bin/env python3
"""Pixel-hint the Intercept wordmark paths in 324-unit viewBox space.

Renders at 30 CSS px height => scale s = 0.39 exactly (1 CSS px = 2.5641 units).
Iteration 5 snapped cap-top (4.0) and baseline (21.0). This pass finishes the
job like a font hinter, PER GLYPH (each of the 9 paths is one letter):

  - detect vertical stems (pairs of long vertical edges ~3.52 px apart)
  - snap every stem to uniform width 3.5 px with its left edge on the
    half-pixel grid (crisp both edges at DPR 2, uniform weight at DPR 1)
  - snap solo long vertical/horizontal edges to the half-pixel grid
    when the move is <= 0.35 px
  - warp all remaining coordinates (curve control points included) with a
    per-glyph piecewise-linear delta so curves stay smooth; guard against
    local stretch beyond [0.6, 1.6]

Emits qa/hinted-wordmark.json mapping old d-string -> hinted d-string.
"""
import json
import re

S = 0.39
PX = 1.0 / S
STEM_W = 3.5 * PX                 # uniform hinted stem width, viewBox units
STEM_GAP = (7.0, 12.0)            # accept canon stems in this unit range
SOLO_TOL = 0.35                   # max solo-edge shift, CSS px
STEM_TOL = 0.55                   # max per-edge shift when snapping a stem pair
MIN_EDGE_LEN = 8.0                # units of straight run that count as an edge
Y0 = 0.9583                       # viewBox y-origin

ROOT = "/Users/jontoewsinterceptgroup.com/Creative-Projects/intercept-home-concepts"

html = open(f"{ROOT}/concept-d/index.html").read()
m = re.search(r'<g fill="var\(--logo-ink\)">(.*?)</g>', html, re.S)
D_STRINGS = re.findall(r'<path d="([^"]+)"/>', m.group(1))
assert len(D_STRINGS) == 9, f"expected 9 wordmark paths, got {len(D_STRINGS)}"
LETTERS = list("Intercept")

TOK = re.compile(r"([MLHVCSQTAZmlhvcsqtaz])|(-?\d*\.?\d+(?:e-?\d+)?)")

def parse(d):
    tokens = [(t[0] or None, t[1] or None) for t in TOK.findall(d)]
    cmds, i = [], 0
    while i < len(tokens):
        c, _ = tokens[i]
        assert c is not None and c in "MLHVCZ", f"unsupported command {c!r}"
        i += 1
        nargs = {"M": 2, "L": 2, "H": 1, "V": 1, "C": 6, "Z": 0}[c]
        while True:
            args = []
            while len(args) < nargs and i < len(tokens) and tokens[i][0] is None:
                args.append(float(tokens[i][1])); i += 1
            if nargs and len(args) < nargs:
                break
            cmds.append((c, args))
            if c == "Z" or i >= len(tokens) or tokens[i][0] is not None:
                break
            if c == "M":
                c, nargs = "L", 2
    return cmds

def trace(cmds):
    x = y = sx = sy = 0.0
    for c, a in cmds:
        if c == "M":
            x, y = a; sx, sy = a
        elif c == "L":
            yield (x, y, a[0], a[1]); x, y = a
        elif c == "H":
            yield (x, y, a[0], y); x = a[0]
        elif c == "V":
            yield (x, y, x, a[0]); y = a[0]
        elif c == "C":
            x, y = a[4], a[5]     # curves don't contribute straight edges
        elif c == "Z":
            yield (x, y, sx, sy); x, y = sx, sy

def clusters(cmds, axis):
    w = {}
    for x0, y0, x1, y1 in trace(cmds):
        const_d = abs((x1 - x0) if axis == 0 else (y1 - y0))
        run = abs((y1 - y0) if axis == 0 else (x1 - x0))
        if const_d < 1e-6 and run >= MIN_EDGE_LEN:
            key = round(x0 if axis == 0 else y0, 4)
            w[key] = w.get(key, 0.0) + run
    return w

def css(v, origin): return (v - origin) * S

def best_halfgrid(v_css, tol):
    t = round(v_css * 2) / 2
    return t if abs(t - v_css) <= tol else None

def stem_anchor_pair(left, right):
    """Snap stem pair to width 3.5 with left edge on best half-grid slot."""
    lc, rc = css(left, 0), css(right, 0)
    cands = []
    for slot in (round(lc * 2) / 2, round(lc * 2) / 2 - 0.5, round(lc * 2) / 2 + 0.5):
        shift_l, shift_r = slot - lc, (slot + 3.5) - rc
        if abs(shift_l) <= STEM_TOL and abs(shift_r) <= STEM_TOL:
            # prefer integer slots on near-ties (0.05px bonus)
            score = abs(shift_l) + abs(shift_r) - (0.05 if slot == int(slot) else 0)
            cands.append((score, slot))
    if not cands:
        return None
    slot = min(cands)[1]
    return {left: slot * PX, right: (slot + 3.5) * PX}

def guard(anchors, weights):
    """Drop weaker anchors until consecutive local stretch is within [0.6,1.6]."""
    while True:
        keys = sorted(anchors)
        bad = None
        for a, b in zip(keys, keys[1:]):
            if b - a < 1e-9:
                continue
            r = (anchors[b] - anchors[a]) / (b - a)
            if not (0.6 <= r <= 1.6):
                bad = (a, b); break
        if not bad:
            return anchors
        a, b = bad
        drop = a if weights.get(a, 0) < weights.get(b, 0) else b
        del anchors[drop]

def warp_fn(anchors):
    if not anchors:
        return lambda v: v
    keys = sorted(anchors)
    def f(v):
        if v <= keys[0]:
            return v + (anchors[keys[0]] - keys[0])
        if v >= keys[-1]:
            return v + (anchors[keys[-1]] - keys[-1])
        for a, b in zip(keys, keys[1:]):
            if a <= v <= b:
                t = (v - a) / (b - a) if b > a else 0.0
                da, db = anchors[a] - a, anchors[b] - b
                return v + da + (db - da) * t
        return v
    return f

def fmt(v):
    s = f"{v:.4f}".rstrip("0").rstrip(".")
    return s if s else "0"

mapping = {}
report = []
for idx, d in enumerate(D_STRINGS):
    cmds = parse(d)
    cx, cy = clusters(cmds, 0), clusters(cmds, 1)

    ax = {}
    xs = sorted(cx)
    used = set()
    for i, left in enumerate(xs):          # stem pairs
        if left in used:
            continue
        for right in xs[i + 1:]:
            if right in used:
                continue
            if STEM_GAP[0] <= right - left <= STEM_GAP[1]:
                pair = stem_anchor_pair(left, right)
                if pair:
                    ax.update(pair); used.update((left, right))
                    report.append(f"{LETTERS[idx]}[{idx}] stem {css(left,0):.3f}-{css(right,0):.3f}px -> {css(pair[left],0):.2f}-{css(pair[right],0):.2f}px")
                break
    for x in xs:                            # solo edges
        if x in used:
            continue
        t = best_halfgrid(css(x, 0), SOLO_TOL)
        if t is not None:
            ax[x] = t * PX
            report.append(f"{LETTERS[idx]}[{idx}] solo-x {css(x,0):.3f} -> {t:.2f} ({t-css(x,0):+.3f}px)")

    ay = {}
    for y in sorted(cy):
        t = best_halfgrid(css(y, Y0), SOLO_TOL)
        if t is not None:
            ay[y] = t * PX + Y0
            if abs(t - css(y, Y0)) > 0.005:
                report.append(f"{LETTERS[idx]}[{idx}] y {css(y,Y0):.3f} -> {t:.2f} ({t-css(y,Y0):+.3f}px)")

    ax = guard(ax, cx); ay = guard(ay, cy)
    fx, fy = warp_fn(ax), warp_fn(ay)

    out = []
    for c, a in cmds:
        if c in ("M", "L"):
            out.append(f"{c}{fmt(fx(a[0]))} {fmt(fy(a[1]))}")
        elif c == "H":
            out.append(f"H{fmt(fx(a[0]))}")
        elif c == "V":
            out.append(f"V{fmt(fy(a[0]))}")
        elif c == "C":
            p = [fx(a[0]), fy(a[1]), fx(a[2]), fy(a[3]), fx(a[4]), fy(a[5])]
            out.append("C" + " ".join(fmt(v) for v in p))
        else:
            out.append("Z")
    mapping[d] = "".join(out)

print("\n".join(report))
with open(f"{ROOT}/qa/hinted-wordmark.json", "w") as f:
    json.dump(mapping, f, indent=1)
print("\nwrote qa/hinted-wordmark.json")
