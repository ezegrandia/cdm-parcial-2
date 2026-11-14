"""Genera los íconos PNG de la app (sin dependencias externas más allá de Pillow/numpy)."""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont

OUT = Path("assets/icons")
OUT.mkdir(parents=True, exist_ok=True)
FONT = "C:/Windows/Fonts/segoeuib.ttf"
DARK = (4, 18, 31, 255)


def gradient(size: int) -> Image.Image:
    y, x = np.mgrid[0:size, 0:size]
    t = np.clip(x / size * 0.62 + y / size * 0.42, 0, 1)
    c1 = np.array([34, 211, 238], dtype=float)
    c2 = np.array([99, 102, 241], dtype=float)
    arr = c1 + (c2 - c1) * t[..., None]
    # brillo suave arriba a la izquierda
    d = np.sqrt((x - size * 0.18) ** 2 + (y - size * 0.12) ** 2) / (size * 0.95)
    glow = np.clip(1 - d, 0, 1)[..., None] * 255 * 0.16
    arr = np.clip(arr + glow, 0, 255).astype(np.uint8)
    return Image.fromarray(arr, "RGB").convert("RGBA")


def rounded_mask(size: int, radius: int) -> Image.Image:
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    return mask


def draw_text(img: Image.Image, size: int, scale: float, text: str = "ΔG") -> None:
    font = ImageFont.truetype(FONT, int(size * scale))
    draw = ImageDraw.Draw(img)
    bbox = draw.textbbox((0, 0), text, font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(
        ((size - w) / 2 - bbox[0], (size - h) / 2 - bbox[1] - size * 0.015),
        text,
        font=font,
        fill=DARK,
    )


# Íconos normales (esquinas redondeadas)
for size in (512, 192, 180):
    img = gradient(size)
    draw_text(img, size, 0.43)
    img.putalpha(rounded_mask(size, int(size * 0.22)))
    img.save(OUT / f"icon-{size}.png")

# Ícono maskable: fondo a sangre y contenido dentro de la zona segura
size = 512
img = gradient(size)
draw_text(img, size, 0.30)
img.save(OUT / "icon-maskable-512.png")

# Favicon SVG
svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#22d3ee"/>
      <stop offset="1" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="15" fill="url(#g)"/>
  <text x="32" y="42" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="27" font-weight="700" fill="#04121f">ΔG</text>
</svg>
"""
(OUT / "favicon.svg").write_text(svg, encoding="utf-8")
print("OK:", sorted(p.name for p in OUT.iterdir()))
