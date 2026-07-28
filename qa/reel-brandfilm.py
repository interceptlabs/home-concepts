#!/usr/bin/env python3
"""Reel v6 — designed mini brand-films per client (SAP-film grammar).

Each client sequence = color card w/ kinetic type -> brand panel over footage
-> full-bleed footage w/ small brand tag -> closing brand card. All colors,
lines, and typefaces are the campaigns' own (WMB navy + Segoe Sans Display,
AMD near-black + LP gold Klavika CondIt, HP #024AD8 + Forma DJR + 20-degree
stripe system). Rendered frame-by-frame with PIL — deterministic, subpixel.
"""
import math
import os
import glob
from PIL import Image, ImageDraw, ImageFont

S = "/private/tmp/claude-501/-Users-jontoewsinterceptgroup-com/e56891d5-7fca-44ee-b69c-2a26cc05bbad/scratchpad"
FX = f"{S}/clips/fx"
P = os.path.expanduser("~/Documents/Labs/Intercept Labs/projects")
W, H, FPS = 1920, 1080, 30

# fonts
SEGOE = f"{P}/windows-mean-business/Segoe-Sans-Display-Semibold.ttf"
KLAV_IT = f"{S}/KlavikaBoldCondIt.ttf"
KLAV = f"{S}/KlavikaBold.ttf"
FORMA = f"{P}/hp-abm-lp-healthcare/fonts/HPFormaDJROffice-Bold.ttf"
def F(path, size): return ImageFont.truetype(path, size)

# brand inks
WMB_NAVY = (27, 48, 115)      # #1B3073 — dVooy headline panel
WMB_DEEP = (1, 15, 75)        # #010F4B
AMD_BLACK = (2, 6, 10)        # #02060A
AMD_GOLD = (192, 167, 100)    # #C0A764 — LP gold
HP_BLUE = (2, 74, 216)        # #024AD8
WHITE = (255, 255, 255)

def ease(t): return 0.5 - 0.5 * math.cos(math.pi * max(0.0, min(1.0, t)))

def frames(tag):
    return sorted(glob.glob(f"{FX}/{tag}-*.png"))

def kinetic_words(draw_img, words, font, x, y, t, color=WHITE, stagger=0.14, per=0.38, gap=None, line_h=None, max_w=1660):
    """Word-by-word reveal: alpha + 16px y-drift, sine-eased, wrapping."""
    layer = Image.new("RGBA", draw_img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    gap = gap if gap is not None else font.size * 0.28
    line_h = line_h or font.size * 1.14
    cx, cy = x, y
    for i, w in enumerate(words):
        ww = d.textlength(w, font=font)
        if cx + ww > x + max_w:
            cx = x; cy += line_h
        wt = ease((t - i * stagger) / per)
        if wt > 0:
            col = color[i] if isinstance(color, list) else color
            d.text((cx, cy + (1 - wt) * 16), w, font=font, fill=col + (int(255 * wt),))
        cx += ww + gap
    draw_img.alpha_composite(layer)

def load_fit(path):
    im = Image.open(path).convert("RGB")
    if im.size != (W, H):
        s = max(W / im.width, H / im.height)
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        im = im.crop(((im.width - W) // 2, (im.height - H) // 2, (im.width - W) // 2 + W, (im.height - H) // 2 + H))
    return im

def grade(im, tint, alpha):
    """flat brand tint blend (never a gradient)"""
    return Image.blend(im, Image.new("RGB", im.size, tint), alpha)

def poly_panel(img, poly, color, alpha=255):
    ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(ov).polygon(poly, fill=color + (alpha,))
    img.alpha_composite(ov)

def out_dir(name):
    d = f"{S}/film-{name}"
    os.makedirs(d, exist_ok=True)
    return d

def save(img, d, i):
    img.convert("RGB").save(f"{d}/f{i:04d}.png")

# ══════════════════════════ WMB — 5.2s / 156f ══════════════════════════
def wmb():
    d = out_dir("wmb")
    i = 0
    seg_glass, seg_type = frames("wmb-glass"), frames("wmb-type")
    f_big, f_panel, f_tag = F(SEGOE, 116), F(SEGOE, 62), F(SEGOE, 34)
    f_eyebrow = F(SEGOE, 30)

    # B1 42f: navy card, kinetic type
    for k in range(42):
        t = k / FPS
        img = Image.new("RGBA", (W, H), WMB_NAVY)
        e = ImageDraw.Draw(img)
        et = ease((t - 0.05) / 0.3)
        if et > 0:
            e.text((150, 300), "WINDOWS 11 PRO", font=f_eyebrow, fill=(157, 184, 255, int(255 * et)))
        kinetic_words(img, ["Windows", "means", "business."], f_big, 146, 380, t - 0.25)
        save(img, d, i); i += 1
    # B2 45f: glass footage + navy panel slides in from left
    for k in range(45):
        t = k / FPS
        img = load_fit(seg_glass[min(k, len(seg_glass) - 1)])
        img = grade(img, WMB_NAVY, 0.10).convert("RGBA")
        pw = int(760 * ease(t / 0.5))
        if pw > 0:
            poly_panel(img, [(0, 0), (pw, 0), (pw, H), (0, H)], WMB_NAVY, 245)
        if pw > 700:
            f_p = F(SEGOE, 54)
            kinetic_words(img, ["Security", "that’s", "built", "in."], f_p, 120, 400, t - 0.55, max_w=580)
            kinetic_words(img, ["Not", "bolted", "on."], f_p, 120, 610, t - 0.95, max_w=580)
        save(img, d, i); i += 1
    # B3 39f: typing footage full-bleed + deep-navy chip
    for k in range(39):
        t = k / FPS
        img = load_fit(seg_type[min(k, len(seg_type) - 1)])
        img = grade(img, WMB_DEEP, 0.08).convert("RGBA")
        ct = ease((t - 0.1) / 0.35)
        if ct > 0:
            ch = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            cd = ImageDraw.Draw(ch)
            cd.rectangle([120, 880, 120 + 460, 880 + 76], fill=WMB_DEEP + (int(245 * ct),))
            cd.text((152, 898), "Windows 11 Pro", font=f_tag, fill=WHITE + (int(255 * ct),))
            img.alpha_composite(ch)
        save(img, d, i); i += 1
    # B4 30f: deep card, 4-pane Windows glyph + lockup
    for k in range(30):
        t = k / FPS
        img = Image.new("RGBA", (W, H), WMB_DEEP)
        e = ImageDraw.Draw(img)
        gt = ease(t / 0.45)
        g, s2, gap2 = int(64 * gt), 0, 8
        cx, cy = W // 2, 400
        if g > 2:
            for dx in (-1, 1):
                for dy in (-1, 1):
                    e.rectangle([cx + (gap2 // 2 if dx > 0 else -gap2 // 2 - g),
                                 cy + (gap2 // 2 if dy > 0 else -gap2 // 2 - g),
                                 cx + (gap2 // 2 + g if dx > 0 else -gap2 // 2),
                                 cy + (gap2 // 2 + g if dy > 0 else -gap2 // 2)], fill=WHITE + (int(255 * gt),))
        lt = ease((t - 0.25) / 0.4)
        if lt > 0:
            f_lock = F(SEGOE, 84)
            e2 = ImageDraw.Draw(img)
            tw = e2.textlength("Windows means business.", font=f_lock)
            e2.text(((W - tw) / 2, 560 + (1 - lt) * 14), "Windows means business.", font=f_lock, fill=WHITE + (int(255 * lt),))
        save(img, d, i); i += 1
    print("wmb", i, "frames")

# ══════════════════════════ AMD — 5.2s / 156f ══════════════════════════
def amd():
    d = out_dir("amd")
    i = 0
    seg_air, seg_srv = frames("amd-air"), frames("amd-srv")
    f_big, f_panel, f_line, f_tag = F(KLAV_IT, 128), F(KLAV_IT, 74), F(KLAV_IT, 58), F(KLAV, 82)

    # B1 39f: black card, kinetic caps
    for k in range(39):
        t = k / FPS
        img = Image.new("RGBA", (W, H), AMD_BLACK)
        kinetic_words(img, ["THE", "NEW", "AI", "DEMANDS"], f_big, 150, 440, t - 0.1,
                      color=[WHITE, WHITE, AMD_GOLD, WHITE])
        save(img, d, i); i += 1
    # B2 45f: aerial + black panel slide
    for k in range(45):
        t = k / FPS
        img = load_fit(seg_air[min(k, len(seg_air) - 1)])
        img = grade(img, AMD_BLACK, 0.14).convert("RGBA")
        pw = int(780 * ease(t / 0.5))
        if pw > 0:
            poly_panel(img, [(0, 0), (pw, 0), (pw, H), (0, H)], AMD_BLACK, 235)
        if pw > 720:
            kinetic_words(img, ["INNOVATE", "ON"], f_panel, 120, 430, t - 0.55, max_w=600)
            kinetic_words(img, ["INTELLIGENT", "INFRASTRUCTURE"], f_panel, 120, 530, t - 0.8, color=AMD_GOLD, max_w=600)
        save(img, d, i); i += 1
    # B3 42f: servers full-bleed + gold line
    for k in range(42):
        t = k / FPS
        img = load_fit(seg_srv[min(k, len(seg_srv) - 1)]).convert("RGBA")
        kinetic_words(img, ["YOUR", "PATH", "TO", "AI-READY", "INFRASTRUCTURE"], f_line, 132, 900, t - 0.15,
                      color=AMD_GOLD, stagger=0.1, per=0.3)
        save(img, d, i); i += 1
    # B4 30f: black card, sign-off
    for k in range(30):
        t = k / FPS
        img = Image.new("RGBA", (W, H), AMD_BLACK)
        e = ImageDraw.Draw(img)
        lt = ease(t / 0.4)
        line = "together we advance_"
        tw = e.textlength(line, font=f_tag)
        e.text(((W - tw) / 2, 500 + (1 - lt) * 14), "together we advance", font=f_tag, fill=WHITE + (int(255 * lt),))
        if (k // 8) % 2 == 0 or k > 20:   # blinking cursor underscore, settles on
            uw = e.textlength("together we advance", font=f_tag)
            e.rectangle([(W - tw) / 2 + uw + 6, 500 + (1 - lt) * 14 + 70, (W - tw) / 2 + uw + 50, 500 + (1 - lt) * 14 + 82],
                        fill=AMD_GOLD + (int(255 * lt),))
        save(img, d, i); i += 1
    print("amd", i, "frames")

# ══════════════════════════ HP — 5.2s / 156f ══════════════════════════
STRIPE_ANG = math.tan(math.radians(20))
def hp_stripe_poly(x0, width):
    """20-degree stripe (leaning like HP's system), full height."""
    dx = H * STRIPE_ANG
    return [(x0 + dx, 0), (x0 + width + dx, 0), (x0 + width, H), (x0, H)]

def hp():
    d = out_dir("hp")
    i = 0
    seg_ct, seg_tab = frames("hp-ct"), frames("hp-tab")
    f_big, f_panel, f_tag = F(FORMA, 104), F(FORMA, 58), F(FORMA, 34)

    # B1 39f: stripe wipe reveals HP blue, kinetic type
    for k in range(39):
        t = k / FPS
        img = Image.new("RGBA", (W, H), WHITE)
        wt = ease(t / 0.45)
        # three 20-deg stripes sweep left->right to fill the card
        for si, (start, wfrac) in enumerate([(0.0, 0.45), (0.3, 0.4), (0.55, 0.4)]):
            sw = ease((t - si * 0.08) / 0.4) * W * wfrac * 1.6
            if sw > 0:
                poly_panel(img, hp_stripe_poly(-500 + si * (W * 0.38), sw), HP_BLUE, 255)
        if wt >= 1.0 or t > 0.5:
            poly_panel(img, [(0, 0), (W, 0), (W, H), (0, H)], HP_BLUE, int(255 * ease((t - 0.45) / 0.2)))
        kinetic_words(img, ["Smarter,", "more", "secure."], f_big, 150, 440, t - 0.55)
        save(img, d, i); i += 1
    # B2 45f: CT footage + HP-blue panel with 20-deg edge
    for k in range(45):
        t = k / FPS
        img = load_fit(seg_ct[min(k, len(seg_ct) - 1)]).convert("RGBA")
        pw = int(820 * ease(t / 0.5))
        if pw > 0:
            dx = H * STRIPE_ANG
            poly_panel(img, [(0, 0), (pw + dx, 0), (pw, H), (0, H)], HP_BLUE, 240)
        if pw > 760:
            f_p = F(FORMA, 54)
            kinetic_words(img, ["Smarter,", "more", "secure"], f_p, 120, 400, t - 0.55, max_w=600)
            kinetic_words(img, ["healthcare", "technology."], f_p, 120, 610, t - 0.95, max_w=600)
        save(img, d, i); i += 1
    # B3 42f: tablet footage + blue chip
    for k in range(42):
        t = k / FPS
        img = load_fit(seg_tab[min(k, len(seg_tab) - 1)]).convert("RGBA")
        ct = ease((t - 0.1) / 0.35)
        if ct > 0:
            ch = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            cd = ImageDraw.Draw(ch)
            cd.rectangle([120, 880, 120 + 430, 880 + 76], fill=HP_BLUE + (int(250 * ct),))
            cd.text((152, 900), "HP  |  Healthcare", font=f_tag, fill=WHITE + (int(255 * ct),))
            img.alpha_composite(ch)
        save(img, d, i); i += 1
    # B4 30f: HP blue card, closing line + white stripe accents
    for k in range(30):
        t = k / FPS
        img = Image.new("RGBA", (W, H), HP_BLUE)
        st = ease(t / 0.45)
        poly_panel(img, hp_stripe_poly(int(W * 0.78 + (1 - st) * 300), 34), WHITE, int(255 * st))
        poly_panel(img, hp_stripe_poly(int(W * 0.84 + (1 - st) * 380), 90), WHITE, int(255 * st))
        f_close = F(FORMA, 76)
        kinetic_words(img, ["Built", "for", "the", "environments"], f_close, 150, 430, t - 0.1, stagger=0.1, per=0.32, max_w=1200)
        kinetic_words(img, ["where", "care", "happens."], f_close, 150, 530, t - 0.5, stagger=0.1, per=0.32, max_w=1200)
        save(img, d, i); i += 1
    print("hp", i, "frames")

wmb(); amd(); hp()
