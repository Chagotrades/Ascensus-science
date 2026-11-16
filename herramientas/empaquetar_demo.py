"""Empaqueta una demo para publicarla (Artifact u otro hosting estático).

    python herramientas/empaquetar_demo.py ag-tio2

Resultado: despliegue/<demo>/ con rutas planas (sin ../../), solo los archivos que la
demo usa en navegación normal. Nunca copia papers/, propuestas/ ni el exportador.
El index.html sale sin <!doctype>/<html>/<head>/<body> porque el Artifact lo envuelve
con su propio esqueleto (y ya trae charset y viewport).
"""
import re
import shutil
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
demo = sys.argv[1] if len(sys.argv) > 1 else "ag-tio2"
SRC = RAIZ / "demos" / demo
DST = RAIZ / "despliegue" / demo
BIB = RAIZ / "biblioteca"

if DST.exists():
    shutil.rmtree(DST)
(DST / "css").mkdir(parents=True)
(DST / "js").mkdir()

# --- archivos de la demo ---
shutil.copy(SRC / "css" / "demo.css", DST / "css" / "demo.css")
shutil.copy(SRC / "js" / "pasos.js", DST / "js" / "pasos.js")
app = (SRC / "js" / "app.js").read_text(encoding="utf-8")
app = app.replace("'../../../biblioteca/", "'../biblioteca/")
app = app.replace("'../../biblioteca/datos/ceftiofur.sdf'", "'biblioteca/datos/ceftiofur.txt'")
assert "../../" not in app, "quedó una ruta ../../ en app.js"
(DST / "js" / "app.js").write_text(app, encoding="utf-8")

# --- biblioteca: solo lo que importa la demo ---
usados = sorted(set(re.findall(r"biblioteca/js/([\w-]+\.js)", app)))
(DST / "biblioteca" / "js").mkdir(parents=True)
for nombre in usados:
    if nombre == "exportador.js":
        continue
    shutil.copy(BIB / "js" / nombre, DST / "biblioteca" / "js" / nombre)
shutil.copy(BIB / "js" / "util.js", DST / "biblioteca" / "js" / "util.js")  # la importan los demás módulos
for rel in ["three/three.module.min.js", "three/LICENSE",
            "three/addons/controls/OrbitControls.js", "three/addons/environments/RoomEnvironment.js"]:
    d = DST / "biblioteca" / "vendor" / rel
    d.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy(BIB / "vendor" / rel, d)
(DST / "biblioteca" / "datos").mkdir()
shutil.copy(BIB / "datos" / "ceftiofur.sdf", DST / "biblioteca" / "datos" / "ceftiofur.txt")  # .txt = tipo web estándar

# --- index.html sin esqueleto ---
html = (SRC / "index.html").read_text(encoding="utf-8")
html = re.sub(r"<!doctype html>\s*", "", html, flags=re.I)
html = re.sub(r"</?html[^>]*>\s*|</?head>\s*|</?body>\s*", "", html)
html = re.sub(r'<meta charset="utf-8">\s*', "", html)
html = re.sub(r'<meta name="viewport"[^>]*>\s*', "", html)
html = html.replace('"three": "../../biblioteca/vendor/three/three.module.min.js"', '"three": "./biblioteca/vendor/three/three.module.min.js"')
html = html.replace('"three/addons/": "../../biblioteca/vendor/three/addons/"', '"three/addons/": "./biblioteca/vendor/three/addons/"')
html = re.sub(r'\s+data-inicio="[^"]*"', "", html)  # la página de inicio no viaja con la demo publicada sola
assert "../../" not in html, "quedó una ruta ../../ en index.html"
(DST / "index.html").write_text(html, encoding="utf-8")

archivos = sorted(p.relative_to(DST).as_posix() for p in DST.rglob("*") if p.is_file())
total = sum((DST / a).stat().st_size for a in archivos)
print(f"{DST.relative_to(RAIZ)} · {len(archivos)} archivos · {total / 1024:.0f} KB")
for a in archivos:
    print("  ", a)
