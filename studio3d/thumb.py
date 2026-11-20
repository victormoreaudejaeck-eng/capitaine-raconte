#!/usr/bin/env python3
"""Miniature « putaclic » automatique : image la plus forte du film + gros texte choc + flèche + cercle rouge.

usage: python3 studio3d/thumb.py <histoire>   -> videos/<histoire>_cover.jpg
Réglages dans stories/<histoire>.json, clé "thumb":
  {"time": 1.6, "lines": ["IL A SURVÉCU", "4 JOURS", "SOUS SON BATEAU"], "hl": 1,
   "emoji": "😱", "circle": [540, 760, 230], "arrow": [880, 420, 640, 640]}
"""
import json, os, subprocess, sys, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
STORY = sys.argv[1]
story = json.load(open(os.path.join(HERE, "stories", STORY + ".json"), encoding="utf-8"))
cfg = story.get("thumb", {})
video = os.path.join(ROOT, "videos", STORY + ".mp4")
frame = os.path.join(ROOT, "out", "3d_" + STORY, "cover_frame.png")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(cfg.get("time", 1.5)), "-i", video, "-frames:v", "1", frame], check=True)

W, H = 1080, 1920
im = Image.open(frame).convert("RGB").resize((W, H))
# hide the burned-in single-word caption (bottom band) with a blurred patch of the frame itself
band = im.crop((0, 1430, W, 1610)).filter(ImageFilter.GaussianBlur(28)); im.paste(band, (0, 1430))
im = ImageEnhance.Contrast(im).enhance(1.18); im = ImageEnhance.Color(im).enhance(1.25)
# vignette for punch
vig = Image.new("L", (W, H), 0); dv = ImageDraw.Draw(vig)
for i in range(60):
    dv.ellipse((-300 + i * 8, -200 + i * 10, W + 300 - i * 8, H + 200 - i * 10), fill=int(i * 4.2))
im = Image.composite(im, Image.new("RGB", (W, H), (0, 0, 0)), vig.filter(ImageFilter.GaussianBlur(60)))
d = ImageDraw.Draw(im)

FONT = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
def fit(text, maxw, size):
    while size > 40:
        f = ImageFont.truetype(FONT, size)
        if d.textlength(text, font=f) <= maxw: return f
        size -= 4
    return ImageFont.truetype(FONT, size)

# red circle + arrow (drawn first, text goes on top)
red = (255, 40, 40)
if cfg.get("circle"):
    x, y, r = cfg["circle"]
    for k in range(3):
        d.ellipse((x - r - k * 2, y - r * .78 - k * 2, x + r + k * 2, y + r * .78 + k * 2), outline=(0, 0, 0), width=22)
    d.ellipse((x - r, y - r * .78, x + r, y + r * .78), outline=red, width=16)
if cfg.get("arrow"):
    x1, y1, x2, y2 = cfg["arrow"]; ang = math.atan2(y2 - y1, x2 - x1)
    for col, w in (((0, 0, 0), 46), (red, 30)):
        d.line((x1, y1, x2, y2), fill=col, width=w)
        hl = 95 if col == red else 115; spread = .55
        pts = [(x2 + math.cos(ang) * 20, y2 + math.sin(ang) * 20), (x2 - hl * math.cos(ang - spread), y2 - hl * math.sin(ang - spread)), (x2 - hl * math.cos(ang + spread), y2 - hl * math.sin(ang + spread))]
        d.polygon(pts, fill=col)

# headline block (top), highlight one line in yellow box
lines = cfg.get("lines", [story.get("title1", ""), story.get("title2", "")])
y = cfg.get("top", 200); hl = cfg.get("hl", 1)
for i, line in enumerate(lines):
    f = fit(line, 980, 210 if i == hl else 132)
    tw = d.textlength(line, font=f); x = (W - tw) / 2; asc, desc = f.getmetrics(); hgt = asc + desc
    if i == hl:
        pad = 26; d.rounded_rectangle((x - pad, y - 6, x + tw + pad, y + hgt + 4), radius=26, fill=(255, 214, 0)); d.text((x, y), line, font=f, fill=(15, 15, 15))
    else:
        d.text((x, y), line, font=f, fill=(255, 255, 255), stroke_width=12, stroke_fill=(0, 0, 0))
    y += hgt + 18

# emoji badge
if cfg.get("emoji"):
    try:
        ef = ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf", 109)
        em = Image.new("RGBA", (140, 140), (0, 0, 0, 0)); ImageDraw.Draw(em).text((6, 6), cfg["emoji"], font=ef, embedded_color=True)
        em = em.resize((230, 230)); im.paste(em, tuple(cfg.get("emoji_pos", [800, y - 40])), em)
    except Exception as e:
        print("emoji ignoré:", e)

out = os.path.join(ROOT, "videos", STORY + "_cover.jpg")
im.save(out, quality=92); print("✅", out)
