"""Arma la carpeta sitio/ para subir a un hosting estático (Netlify).

    python herramientas/armar_sitio.py

Incluye solo lo que se muestra: la página del investigador, la demo, la biblioteca que la demo
usa y los entregables. NUNCA copia papers/, propuestas/, herramientas/, ESTADO.md ni PLAN.md.
La raíz (/) redirige a la página del investigador. Todo va con noindex (no aparece en Google).
"""
import shutil
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DST = RAIZ / "sitio"
PROHIBIDO = {"papers", "propuestas", "herramientas", "despliegue", "skills", ".claude"}

if DST.exists():
    shutil.rmtree(DST)
DST.mkdir()


def copiar(rel, ignorar=()):
    src = RAIZ / rel
    assert src.parts[len(RAIZ.parts)] not in PROHIBIDO, rel
    dst = DST / rel
    if src.is_dir():
        shutil.copytree(src, dst, ignore=shutil.ignore_patterns(*ignorar))
    else:
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy(src, dst)


copiar("paginas/pugazhenthiran")
copiar("demos/ag-tio2", ignorar=("exportar.js",))
for f in ["util.js", "molecula.js", "nanoesfera-porosa.js", "nanoparticulas-plasmonicas.js", "particulas-fx.js"]:
    copiar(f"biblioteca/js/{f}")
copiar("biblioteca/vendor/three")
copiar("biblioteca/datos/ceftiofur.sdf")
copiar("entregas/ag-tio2", ignorar=("control", "README.md", "post-linkedin.md"))

(DST / "_redirects").write_text("/  /paginas/pugazhenthiran/  302\n", encoding="utf-8")
(DST / "netlify.toml").write_text('''[[headers]]
  for = "/*"
  [headers.values]
    X-Robots-Tag = "noindex, nofollow"
    Referrer-Policy = "same-origin"

[[headers]]
  for = "/biblioteca/vendor/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/biblioteca/datos/*.sdf"
  [headers.values]
    Content-Type = "text/plain; charset=utf-8"
''', encoding="utf-8")
(DST / "robots.txt").write_text("User-agent: *\nDisallow: /\n", encoding="utf-8")

archivos = sorted(p for p in DST.rglob("*") if p.is_file())
total = sum(p.stat().st_size for p in archivos)
for p in archivos:
    assert not (set(p.relative_to(DST).parts) & PROHIBIDO), p
print(f"sitio/ · {len(archivos)} archivos · {total / 1e6:.1f} MB")
for p in archivos:
    print(f"  {p.stat().st_size / 1e6:7.2f} MB  {p.relative_to(DST).as_posix()}")
