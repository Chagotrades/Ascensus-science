"""Junta láminas PNG en un PDF para carrusel de LinkedIn.

    python herramientas/carrusel_pdf.py entregas/ag-tio2/carrusel salida.pdf
"""
import sys
from pathlib import Path
from PIL import Image

carpeta, salida = Path(sys.argv[1]), Path(sys.argv[2])
laminas = sorted(carpeta.glob("lamina-*.png"), key=lambda p: int(p.stem.split("-")[1]))
imgs = [Image.open(p).convert("RGB") for p in laminas]
imgs[0].save(salida, save_all=True, append_images=imgs[1:], resolution=144, quality=92)
print(f"{salida} · {len(imgs)} láminas")
