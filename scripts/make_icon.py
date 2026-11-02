"""Genera el icono de la app (fondo arcade + título) en public/ y assets/.

Uso: python3 scripts/make_icon.py
Si existen imágenes en assets/icon-characters/*.png (fondo transparente), se colocan en el icono.
"""
import glob
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / 'node_modules/@expo-google-fonts/bangers/400Regular/Bangers_400Regular.ttf'
S = 1024


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def background():
    img = Image.new('RGB', (S, S))
    d = ImageDraw.Draw(img)
    horizon = int(S * 0.62)
    for y in range(horizon):
        d.line([(0, y), (S, y)], fill=lerp((11, 2, 33), (59, 11, 89), y / horizon))
    # Sol de neón con franjas
    sun = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sun)
    r = int(S * 0.3)
    cy = horizon - int(r * 0.2)
    for y in range(cy - r, horizon):
        t = (y - (cy - r)) / (horizon - (cy - r))
        col = lerp((255, 211, 25), (255, 41, 117), t)
        dx = int(max(0, r * r - (y - cy) ** 2) ** 0.5)
        sd.line([(S // 2 - dx, y), (S // 2 + dx, y)], fill=col + (255,))
    for i in range(6):
        y = cy + i * int(r * 0.13)
        sd.rectangle([0, y, S, y + 4 + i * 3], fill=(0, 0, 0, 0))
    img.paste(sun, (0, 0), sun)
    # Suelo con cuadrícula en perspectiva
    for y in range(horizon, S):
        d.line([(0, y), (S, y)], fill=lerp((26, 4, 51), (7, 1, 15), (y - horizon) / (S - horizon)))
    for i in range(12):
        y = horizon + int(((i / 11) ** 2.2) * (S - horizon))
        d.line([(0, y), (S, y)], fill=(255, 43, 214), width=3 + i // 3)
    for i in range(-10, 11):
        d.line([(S / 2 + i * S * 0.05, horizon), (S / 2 + i * S * 0.6, S)], fill=(255, 43, 214), width=3)
    d.line([(0, horizon), (S, horizon)], fill=(94, 246, 255), width=6)
    return img


def title(img):
    d = ImageDraw.Draw(img)
    for text, size, y in [('DRAFT', 300, 0.06), ('BATTLE', 250, 0.70)]:
        font = ImageFont.truetype(str(FONT), size)
        w = d.textlength(text, font=font)
        x = (S - w) / 2
        yy = S * y
        # sombra roja desplazada + contorno oscuro, como el título de la app
        d.text((x + 14, yy + 14), text, font=font, fill=(230, 57, 70), stroke_width=10, stroke_fill=(20, 0, 30))
        d.text((x, yy), text, font=font, fill=(255, 183, 3), stroke_width=10, stroke_fill=(20, 0, 30))


def characters(img):
    files = sorted(glob.glob(str(ROOT / 'assets/icon-characters/*.png')))
    if not files:
        return
    n = len(files)
    band_top, band_h = int(S * 0.30), int(S * 0.42)
    slot = S / n
    for i, f in enumerate(files):
        c = Image.open(f).convert('RGBA')
        c = c.crop(c.getbbox())
        scale = min(band_h / c.height, slot * 1.35 / c.width)
        c = c.resize((max(1, int(c.width * scale)), max(1, int(c.height * scale))), Image.LANCZOS)
        # contorno blanco para que destaquen sobre el fondo
        glow = c.getchannel('A').filter(ImageFilter.MaxFilter(15))
        outline = Image.new('RGBA', c.size, (255, 255, 255, 255))
        outline.putalpha(glow)
        x = int(slot * i + slot / 2 - c.width / 2)
        y = band_top + band_h - c.height
        img.paste(outline, (x, y), outline)
        img.paste(c, (x, y), c)


img = background()
characters(img)
title(img)
(ROOT / 'public').mkdir(exist_ok=True)
img.save(ROOT / 'assets/icon.png')
img.resize((180, 180), Image.LANCZOS).save(ROOT / 'public/apple-touch-icon.png')
img.resize((192, 192), Image.LANCZOS).save(ROOT / 'public/icon-192.png')
img.resize((512, 512), Image.LANCZOS).save(ROOT / 'public/icon-512.png')
img.resize((48, 48), Image.LANCZOS).save(ROOT / 'assets/favicon.png')
print('icono generado')
