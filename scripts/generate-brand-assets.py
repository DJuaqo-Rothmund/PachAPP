"""
Genera los íconos y logos de Pachapp a partir de branding/pachapp-logo.jpg.

    pip install pillow
    python3 scripts/generate-brand-assets.py

Escribe:
  - public/brand/logo.webp, public/brand/emblem.webp     (logo completo y emblema para la web)
  - public/icons/*.png                                   (favicon, PWA y apple-touch-icon)
  - mobile/assets/*.png                                  (ícono, ícono adaptativo, splash y logo de la app)
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'branding' / 'pachapp-logo.jpg'

# Emblema (escudo, espiga y herramientas) sin el texto "PACHAPP".
EMBLEM_BOX = (176, 92, 848, 700)
# Color de fondo de los íconos: la piedra oscura del muro del logo.
ICON_BG = (20, 27, 32)
# Fondo de la app (--color-void): el splash y las pantallas de carga se funden con él.
APP_BG = (11, 15, 12)


def feather_mask(size, radius, feather):
    """Máscara de rectángulo redondeado con borde difuminado (para fundir el muro con el fondo)."""
    w, h = size
    mask = Image.new('L', size, 0)
    inset = feather
    ImageDraw.Draw(mask).rounded_rectangle((inset, inset, w - inset, h - inset), radius=radius, fill=255)
    return mask.filter(ImageFilter.GaussianBlur(feather / 2))


def feathered(img, radius_ratio=0.18, feather_ratio=0.07):
    w, h = img.size
    out = img.convert('RGBA')
    out.putalpha(feather_mask(img.size, int(min(w, h) * radius_ratio), int(min(w, h) * feather_ratio)))
    return out


def radial_bg(size, inner, outer):
    w, h = size
    small = Image.new('RGB', (64, 64))
    px = small.load()
    for y in range(64):
        for x in range(64):
            d = min(1.0, (((x - 31.5) ** 2 + (y - 31.5) ** 2) ** 0.5) / 45)
            px[x, y] = tuple(int(inner[i] + (outer[i] - inner[i]) * d) for i in range(3))
    return small.resize(size, Image.BICUBIC)


def fit(img, max_w, max_h):
    scale = min(max_w / img.width, max_h / img.height)
    return img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)


def centered(canvas, img):
    canvas.alpha_composite(img, ((canvas.width - img.width) // 2, (canvas.height - img.height) // 2))
    return canvas


def save(img, path, **kwargs):
    path = ROOT / path
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.suffix == '.png':
        kwargs.setdefault('optimize', True)
    img.save(path, **kwargs)
    print(f'  {path.relative_to(ROOT)}  {img.size[0]}×{img.size[1]}')


def main():
    logo = Image.open(SRC).convert('RGB')
    emblem = feathered(logo.crop(EMBLEM_BOX))
    full_logo = feathered(logo, radius_ratio=0.12, feather_ratio=0.06)

    # Ícono cuadrado: emblema sobre piedra oscura con viñeta.
    def square_icon(size, scale=0.9):
        canvas = radial_bg((size, size), (34, 46, 48), (10, 14, 16)).convert('RGBA')
        return centered(canvas, fit(emblem, size * scale, size * scale))

    icon_1024 = square_icon(1024)

    print('Web')
    save(full_logo.resize((640, 640), Image.LANCZOS), 'public/brand/logo.webp', quality=88)
    save(fit(emblem, 256, 256), 'public/brand/emblem.webp', quality=90)
    save(icon_1024.resize((512, 512), Image.LANCZOS).convert('RGB'), 'public/icons/icon-512.png')
    save(icon_1024.resize((192, 192), Image.LANCZOS).convert('RGB'), 'public/icons/icon-192.png')
    save(square_icon(512, 0.72).convert('RGB'), 'public/icons/maskable-512.png')  # zona segura del 80 %
    save(icon_1024.resize((180, 180), Image.LANCZOS).convert('RGB'), 'public/icons/apple-touch-icon.png')
    save(square_icon(64, 0.98).resize((32, 32), Image.LANCZOS).convert('RGB'), 'public/icons/favicon-32.png')

    print('Android (Expo)')
    save(icon_1024.convert('RGB'), 'mobile/assets/icon.png')
    # Ícono adaptativo: el sistema recorta en círculo/squircle; el emblema queda en la zona segura (66 %).
    foreground = centered(Image.new('RGBA', (1024, 1024), (0, 0, 0, 0)), fit(emblem, 620, 620))
    save(foreground, 'mobile/assets/android-icon-foreground.png')
    # Monocromo (íconos temáticos de Android 13+): la silueta de la espiga dorada.
    mono = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    gold = fit(emblem, 620, 620)
    px = gold.load()
    for y in range(gold.height):
        for x in range(gold.width):
            r, g, b, a = px[x, y]
            # Solo la espiga central: dorada, opaca y en la franja del centro.
            in_ear = abs(x - gold.width / 2) < gold.width * 0.17 and gold.height * 0.15 < y < gold.height * 0.97
            px[x, y] = (255, 255, 255, 255 if in_ear and a > 200 and r > 170 and g > 120 and b < 110 else 0)
    alpha = gold.getchannel('A').filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(3))
    gold.putalpha(alpha)
    save(centered(mono, gold), 'mobile/assets/android-icon-monochrome.png')
    # Splash nativo: el emblema (Android 12+ lo muestra dentro de un círculo).
    save(centered(Image.new('RGBA', (768, 768), (0, 0, 0, 0)), fit(emblem, 750, 750)), 'mobile/assets/splash-icon.png')
    # Logo completo para la pantalla de carga y el login de la app.
    save(full_logo.resize((640, 640), Image.LANCZOS), 'mobile/assets/logo.png')
    save(square_icon(96, 0.98).resize((48, 48), Image.LANCZOS).convert('RGB'), 'mobile/assets/favicon.png')


if __name__ == '__main__':
    main()
