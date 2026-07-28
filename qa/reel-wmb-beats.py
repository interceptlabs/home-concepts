#!/usr/bin/env python3
"""WMB reel beats rendered with PIL — subpixel-smooth, zero stepping.

Beat A (wmb-pan):  vertical pan down the FY26 Win11Pro LP render.
Beat B (wmb-wall): IAB banner-suite wall with a slow scale drift,
                   composed at 2x and float-cropped per frame.
"""
import math
import os
from PIL import Image, ImageFilter

P = os.path.expanduser("~/Documents/Labs/Intercept Labs/projects/windows-mean-business")
OUT = "/private/tmp/claude-501/-Users-jontoewsinterceptgroup-com/e56891d5-7fca-44ee-b69c-2a26cc05bbad/scratchpad/reel-frames"
FPS, W, H = 30, 1920, 1080

def ease(t):  # sine in-out
    return 0.5 - 0.5 * math.cos(math.pi * t)

# ── Beat A: LP pan ─────────────────────────────────────────────────────────
lp = Image.open(f"{P}/layouts/landing-pages/pngs/FY26 Win11Pro - Distributor CLE - Desktop.png").convert("RGB")
scale = W / lp.width                       # 1768 -> 1920
lp2 = lp.resize((W, round(lp.height * scale)), Image.LANCZOS)
frames = round(3.0 * FPS)
travel = min(2200, lp2.height - H)
d = f"{OUT}/wmb-pan"; os.makedirs(d, exist_ok=True)
for i in range(frames):
    y = travel * ease(i / (frames - 1))
    yi = int(y)
    # float-precision: crop 1px extra and resample shifted by fraction
    frac = y - yi
    box = lp2.crop((0, yi, W, min(yi + H + 1, lp2.height)))
    if frac > 0 and box.height > H:
        box = box.transform((W, H), Image.AFFINE, (1, 0, 0, 0, 1, frac), Image.BILINEAR)
    else:
        box = box.crop((0, 0, W, H))
    box.save(f"{d}/f{i:04d}.png")
print("wmb-pan", frames, "frames, travel", travel)

# ── Beat B: banner-suite wall ──────────────────────────────────────────────
S = 2  # compose at 2x for subpixel drift
cw, ch = W * S, H * S
canvas = Image.new("RGB", (cw, ch), (244, 245, 247))

def place(img_path, sc, x, y):
    im = Image.open(img_path).convert("RGBA")
    im = im.resize((round(im.width * sc * S), round(im.height * sc * S)), Image.LANCZOS)
    # soft shadow
    sh = Image.new("RGBA", (im.width + 40, im.height + 40), (0, 0, 0, 0))
    box = Image.new("RGBA", (im.width, im.height), (10, 10, 15, 70))
    sh.paste(box, (20, 26))
    sh = sh.filter(ImageFilter.GaussianBlur(14))
    canvas.paste(sh, (x * S - 20, y * S - 14), sh)
    canvas.paste(im, (x * S, y * S), im)

place(f"{P}/WMB Exports/V1/ZsWhr.png", 0.72, 128, 108)     # 600x1200 skyscraper
place(f"{P}/WMB Exports/V1/dVooy.png", 0.92, 660, 108)     # 600x500 MPU
place(f"{P}/WMB Exports/V2 Life/GSlsq.png", 0.92, 1290, 108)  # V2 MPU
place(f"{P}/WMB Exports/V1/j9W4K.png", 0.80, 660, 640)     # 1456x180 leaderboard
place(f"{P}/WMB Exports/V1/n19Ix.png", 0.60, 660, 810)     # 320x1200 sky (crop below canvas)
place(f"{P}/WMB Exports/V2 Life/tkUn4.png", 0.80, 900, 810)  # 640x100

frames = round(2.6 * FPS)
d = f"{OUT}/wmb-wall"; os.makedirs(d, exist_ok=True)
for i in range(frames):
    t = ease(i / (frames - 1))
    z = 1.0 + 0.035 * t                    # slow push-in
    vw, vh = cw / z, ch / z
    cx = cw / 2
    cy = ch / 2 + (ch * 0.46 - ch / 2) * t # drift slightly upward while zooming
    cy = max(vh / 2, min(ch - vh / 2, cy)) # keep the crop box inside the canvas
    box = (cx - vw / 2, cy - vh / 2, cx + vw / 2, cy + vh / 2)
    canvas.resize((W, H), Image.LANCZOS, box=box).save(f"{d}/f{i:04d}.png")
print("wmb-wall", frames, "frames")
