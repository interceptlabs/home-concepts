#!/usr/bin/env python3
"""Composite canon Fritz triangles onto a top-down plaza plate, under the people.

Why this exists: Veo can shoot a plaza with pedestrians reliably, but it cannot
draw our geometry (it returns apex-down / near-equilateral triangles) and it
cannot hit a brand hex (Flarepop #FF00E5 comes back around #c5319e). So we let
Veo supply the plate and we supply the graphics.

Pipeline
  1. track    per-frame camera translation by phase correlation (the pan is a
              near-pure 2D translation at top-down, so this is exact enough)
  2. ground   draw the triangles ONCE into an oversized ground canvas, in ground
              space, at the exact token colours
  3. matte    pedestrians read dark against pale paving -> soft luma key
  4. comp     triangles painted on the ground, then the people back over the top
              so they walk ON the colour

Canon (locked): right angle at the base, apex UP, lean left or right only.
Never equilateral, never upright, never inverted. Flip horizontally, never
vertically. Hard edges, flat fill, no gradient.

Usage
  python3 motion/plaza-composite.py PLATE.mp4 OUT.mp4 [--layout a|b|c]
"""
import argparse, pathlib, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

FLAREPOP  = (0xFF, 0x00, 0xE5)   # channel primary
COOLSWEEP = (0x1A, 0x7A, 0xFF)   # secondary
WIRETREE  = (0x00, 0xD8, 0x62)   # tertiary

TRACK_W, TRACK_H = 480, 270      # phase-correlation working size


def probe(path):
    out = subprocess.run(
        ['ffprobe', '-v', 'error', '-select_streams', 'v:0',
         '-show_entries', 'stream=width,height,nb_frames,r_frame_rate',
         '-of', 'default=nw=1:nk=1', str(path)],
        capture_output=True, text=True).stdout.split()
    w, h = int(out[0]), int(out[1])
    num, den = out[2].split('/')
    fps = float(num) / float(den)
    return w, h, fps


def read_gray(path, w, h):
    raw = subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', str(path), '-vf', f'scale={w}:{h}',
         '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True).stdout
    n = len(raw) // (w * h)
    return np.frombuffer(raw, dtype=np.uint8)[:n * w * h].reshape(n, h, w).astype(np.float32)


def track(frames):
    """Cumulative (dy, dx) per frame, in frames' own pixel units."""
    h, w = frames.shape[1:]
    win = np.outer(np.hanning(h), np.hanning(w))
    def shift(a, b):
        A, B = np.fft.rfft2(a * win), np.fft.rfft2(b * win)
        R = A * np.conj(B)
        R /= (np.abs(R) + 1e-9)
        c = np.fft.irfft2(R, s=a.shape)
        dy, dx = np.unravel_index(np.argmax(c), c.shape)
        if dy > h // 2: dy -= h
        if dx > w // 2: dx -= w
        return dy, dx
    acc, cy, cx = [(0, 0)], 0, 0
    for i in range(1, len(frames)):
        dy, dx = shift(frames[i - 1], frames[i])
        cy += dy; cx += dx
        acc.append((cy, cx))
    return acc


def right_triangle(draw, apex_x, base_y, size, colour, lean):
    """Right angle at the base, apex directly above it. lean='right' puts the
    vertical leg on the left and the hypotenuse falling to the right."""
    run = int(size * 0.86)
    if lean == 'right':
        pts = [(apex_x, base_y), (apex_x, base_y - size), (apex_x + run, base_y)]
    else:
        pts = [(apex_x, base_y), (apex_x, base_y - size), (apex_x - run, base_y)]
    draw.polygon(pts, fill=colour)


# Three layouts. All apex-up, leans mixed, three channels never blended.
# Sized and spaced so (a) each whole shape sits inside frame including its run,
# (b) no two shapes touch — adjacent hypotenuses read as one bowtie, not two
# triangles — and (c) the set survives a ~4.4:1 band crop. One big centred shape
# does NOT survive that crop: it reads as colour, not form.
# fields: (apex_x/W, base_y/H, size/H, colour, lean)
LAYOUTS = {
    'a': [(0.073, 0.72, 0.34, FLAREPOP,  'right'),
          (0.510, 0.66, 0.28, COOLSWEEP, 'left'),
          (0.646, 0.80, 0.40, WIRETREE,  'right')],
    'b': [(0.100, 0.66, 0.26, COOLSWEEP, 'right'),
          (0.470, 0.80, 0.38, FLAREPOP,  'left'),
          (0.620, 0.70, 0.32, WIRETREE,  'right')],
    'c': [(0.310, 0.82, 0.36, WIRETREE,  'left'),
          (0.420, 0.64, 0.24, FLAREPOP,  'right'),
          (0.930, 0.76, 0.34, COOLSWEEP, 'left')],
}


def check_layout(w, h, layout):
    """Warn on anything that clips frame or collides with a neighbour."""
    spans = []
    for fx, fy, fs, _c, lean in LAYOUTS[layout]:
        x, s = fx * w, fs * h
        run = s * 0.86
        x0, x1 = (x, x + run) if lean == 'right' else (x - run, x)
        if x0 < 0 or x1 > w:
            print(f'  WARN layout {layout}: shape spans {x0:.0f}..{x1:.0f}, frame is 0..{w}')
        if fy * h > h:
            print(f'  WARN layout {layout}: base below frame')
        spans.append((x0, x1))
    for i in range(len(spans) - 1):
        for j in range(i + 1, len(spans)):
            a0, a1 = spans[i]; b0, b1 = spans[j]
            if a0 < b1 and b0 < a1:
                print(f'  WARN layout {layout}: shapes {i} and {j} overlap in x')


def build_ground(w, h, offsets, layout):
    """Oversized canvas so the triangles stay put while the camera pans over."""
    # symmetric padding: the sample window is oy-cy / ox-cx, and cy/cx swing both
    # ways, so pad every side by the full peak drift or the crop runs off-canvas.
    ys = [o[0] for o in offsets]; xs = [o[1] for o in offsets]
    m = 8
    pad_t = pad_b = max(abs(min(ys)), abs(max(ys)))
    pad_l = pad_r = max(abs(min(xs)), abs(max(xs)))
    CW, CH = w + pad_l + pad_r + 2 * m, h + pad_t + pad_b + 2 * m
    layer = Image.new('RGB', (CW, CH), (0, 0, 0))
    mask = Image.new('L', (CW, CH), 0)
    dl, dm = ImageDraw.Draw(layer), ImageDraw.Draw(mask)
    for fx, fy, fs, colour, lean in LAYOUTS[layout]:
        x = int(pad_l + m + fx * w); y = int(pad_t + m + fy * h); s = int(fs * h)
        right_triangle(dl, x, y, s, colour, lean)
        right_triangle(dm, x, y, s, 255, lean)
    return (np.asarray(layer).astype(np.float32),
            np.asarray(mask).astype(np.float32) / 255.0,
            pad_t + m, pad_l + m)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('plate'); ap.add_argument('out')
    ap.add_argument('--layout', default='a', choices=list(LAYOUTS))
    ap.add_argument('--crf', type=int, default=30)
    ap.add_argument('--lo', type=float, default=60.0, help='luma fully person')
    ap.add_argument('--hi', type=float, default=135.0, help='luma fully ground')
    a = ap.parse_args()

    W, H, fps = probe(a.plate)
    print(f'plate {W}x{H} @ {fps:.3f}fps')

    small = read_gray(a.plate, TRACK_W, TRACK_H)
    n = len(small)
    sx, sy = W / TRACK_W, H / TRACK_H
    offs = [(int(round(dy * sy)), int(round(dx * sx))) for dy, dx in track(small)]
    print(f'tracked {n} frames; cumulative drift dy {offs[-1][0]:+d} dx {offs[-1][1]:+d} px')

    check_layout(W, H, a.layout)
    ground, gmask, oy, ox = build_ground(W, H, offs, a.layout)
    print(f'ground canvas {ground.shape[1]}x{ground.shape[0]}, layout {a.layout}')

    enc = subprocess.Popen(
        ['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
         '-s', f'{W}x{H}', '-r', f'{fps}', '-i', '-',
         '-c:v', 'libx264', '-crf', str(a.crf), '-preset', 'slow',
         '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', str(a.out)],
        stdin=subprocess.PIPE)

    dec = subprocess.Popen(
        ['ffmpeg', '-v', 'error', '-i', str(a.plate),
         '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)

    lum_w = np.array([0.299, 0.587, 0.114], dtype=np.float32)
    fsize = W * H * 3
    for i in range(n):
        buf = dec.stdout.read(fsize)
        if len(buf) < fsize:
            break
        plate = np.frombuffer(buf, dtype=np.uint8).reshape(H, W, 3).astype(np.float32)

        # pedestrians: dark against pale paving, soft ramp so edges don't halo
        luma = plate @ lum_w
        alpha = np.clip((a.hi - luma) / (a.hi - a.lo), 0.0, 1.0)
        sat = plate.max(axis=2) - plate.min(axis=2)
        alpha[sat > 70] *= 0.2           # anything already saturated is ground
        alpha = np.asarray(
            Image.fromarray((alpha * 255).astype(np.uint8), 'L')
                 .filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32) / 255.0
        alpha = alpha[..., None]

        cy, cx = offs[i]
        y0 = min(max(oy - cy, 0), ground.shape[0] - H)
        x0 = min(max(ox - cx, 0), ground.shape[1] - W)
        tri = ground[y0:y0 + H, x0:x0 + W]
        tm = gmask[y0:y0 + H, x0:x0 + W][..., None]

        painted = plate * (1 - tm) + tri * tm
        out = painted * (1 - alpha) + plate * alpha
        enc.stdin.write(np.clip(out, 0, 255).astype(np.uint8).tobytes())
        if i % 48 == 0:
            print(f'  frame {i}/{n}')

    enc.stdin.close(); enc.wait(); dec.wait()
    print('wrote', a.out)


if __name__ == '__main__':
    main()
