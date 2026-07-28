#!/usr/bin/env python3
"""Brand-type supers for the speculative client beats — real campaign lines,
real campaign fonts, film-super grammar (lower-left, white, soft shadow)."""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

S = "/private/tmp/claude-501/-Users-jontoewsinterceptgroup-com/e56891d5-7fca-44ee-b69c-2a26cc05bbad/scratchpad"
P = os.path.expanduser("~/Documents/Labs/Intercept Labs/projects")
W, H = 1920, 1080
MX = 132          # left margin

def super_png(out, lines, y_baseline_top):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    txt = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(txt)
    y = y_baseline_top
    for text, font, fill, tracking in lines:
        if tracking:
            x = MX
            for ch in text:
                d.text((x, y), ch, font=font, fill=fill)
                x += d.textlength(ch, font=font) + tracking
        else:
            d.text((MX, y), text, font=font, fill=fill)
        y += font.size * 1.16
    # soft shadow pass (legibility, not a scrim)
    shadow = txt.copy().filter(ImageFilter.GaussianBlur(7))
    black = Image.new("RGBA", (W, H), (10, 10, 15, 255))
    shadow = Image.composite(black, Image.new("RGBA", (W, H), (0,0,0,0)), shadow.split()[3].point(lambda a: a * 0.55))
    img.alpha_composite(shadow, (3, 5))
    img.alpha_composite(txt)
    img.save(out)
    print("wrote", out)

segoe = ImageFont.truetype(f"{P}/windows-mean-business/Segoe-Sans-Display-Semibold.ttf", 88)
super_png(f"{S}/super-wmb.png",
          [("Windows means business.", segoe, (255, 255, 255, 255), 0)],
          860)

klav_it = ImageFont.truetype(f"{S}/KlavikaBoldCondIt.ttf", 96)
super_png(f"{S}/super-amd.png",
          [("INNOVATE ON", klav_it, (255, 255, 255, 255), 2),
           ("INTELLIGENT INFRASTRUCTURE", klav_it, (226, 163, 57, 255), 2)],
          750)

forma = ImageFont.truetype(f"{P}/hp-abm-lp-healthcare/fonts/HPFormaDJROffice-Bold.ttf", 84)
super_png(f"{S}/super-hp.png",
          [("Smarter, more secure", forma, (255, 255, 255, 255), 0),
           ("healthcare technology.", forma, (255, 255, 255, 255), 0)],
          760)
