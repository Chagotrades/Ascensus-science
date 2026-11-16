"""Versiones livianas (WebP) de los entregables para mostrarlas en páginas web.
Los originales en alta resolución quedan solo para descargar.

    python herramientas/miniaturas.py entregas/ag-tio2
"""
import sys
from pathlib import Path
from PIL import Image

carpeta = Path(sys.argv[1])
salida = carpeta / "web"
salida.mkdir(exist_ok=True)
# nombre → ancho máximo en píxeles
TAMANOS = {"render-nanoesfera": 2000, "figura-mecanismo": 1200, "figura-mecanismo-limpia": 1200,
           "graphical-abstract": 1200, "carrusel/lamina-1": 800}
for nombre, ancho in TAMANOS.items():
    src = carpeta / f"{nombre}.png"
    if not src.exists():
        continue
    im = Image.open(src).convert("RGB")
    if im.width > ancho:
        im = im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)
    dst = salida / f"{nombre.replace('/', '-')}.webp"
    im.save(dst, "WEBP", quality=82, method=6)
    print(f"{dst}  {im.width}x{im.height}  {dst.stat().st_size // 1024} KB")
