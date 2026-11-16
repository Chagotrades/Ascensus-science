"""Servidor local de Ascensus: sirve el proyecto y guarda lo que exportan las escenas.

    python herramientas/servidor.py            # http://localhost:8123
    POST /guardar?ruta=entregas/ag-tio2/video.mp4   (cuerpo = bytes del archivo)

Solo escucha en 127.0.0.1 y solo escribe dentro de entregas/.
Para publicar algo en internet NO uses este servidor: sube solo la carpeta de la demo
y biblioteca/ (nunca papers/).
"""
import http.server
import os
import sys
import urllib.parse
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ENTREGAS = (RAIZ / "entregas").resolve()
PUERTO = int(sys.argv[1]) if len(sys.argv) > 1 else 8123
MAX_BYTES = 400 * 1024 * 1024


class Manejador(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(RAIZ), **k)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_POST(self):
        url = urllib.parse.urlparse(self.path)
        if url.path != "/guardar":
            return self.send_error(404)
        ruta = urllib.parse.parse_qs(url.query).get("ruta", [""])[0]
        destino = (RAIZ / ruta).resolve()
        if ENTREGAS not in destino.parents:
            return self.send_error(403, "Solo se puede escribir dentro de entregas/")
        largo = int(self.headers.get("Content-Length", 0))
        if largo <= 0 or largo > MAX_BYTES:
            return self.send_error(413)
        destino.parent.mkdir(parents=True, exist_ok=True)
        restante = largo
        with open(destino, "wb") as f:
            while restante > 0:
                trozo = self.rfile.read(min(restante, 1 << 20))
                if not trozo:
                    break
                f.write(trozo)
                restante -= len(trozo)
        print(f"guardado {destino.relative_to(RAIZ)} ({largo/1e6:.1f} MB)", flush=True)
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.end_headers()
        self.wfile.write(f"ok {largo}".encode())


if __name__ == "__main__":
    os.chdir(RAIZ)
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", PUERTO), Manejador)
    print(f"Ascensus · http://localhost:{PUERTO}/  (guarda en {ENTREGAS.relative_to(RAIZ)}/)", flush=True)
    srv.serve_forever()
