"""Transcribe un audio en este computador (sin enviarlo a servicios externos).

    .venv-whisper/Scripts/python.exe herramientas/transcribir.py reuniones/2026-11-17-pugazhenthiran.mp4 [modelo]

Requiere el entorno .venv-whisper (Python 3.12, ctranslate2 4.4.0, av 12.3.0): con Python 3.14 se cae.
Modelo por defecto: large-v3-turbo (bueno con inglés de acento indio y español mezclado).
La primera vez descarga el modelo (~1,6 GB) desde Hugging Face; después queda en caché.
Escribe <audio>.txt (con marcas de tiempo) junto al audio. Detecta el idioma de cada tramo.
"""
import sys
import time
from pathlib import Path
from faster_whisper import WhisperModel

audio = Path(sys.argv[1])
modelo = sys.argv[2] if len(sys.argv) > 2 else "large-v3-turbo"
salida = audio.with_suffix(".txt")

t0 = time.time()
m = WhisperModel(modelo, device="cpu", compute_type="int8", cpu_threads=8)
print(f"modelo {modelo} cargado en {time.time() - t0:.0f} s", flush=True)

segmentos, info = m.transcribe(
    str(audio),
    language=None,               # autodetección (la charla puede mezclar inglés y español)
    multilingual=True,           # permite cambiar de idioma entre tramos
    vad_filter=False,            # el VAD (onnxruntime) se cae con segfault en este equipo (Ryzen 2600, nov 2026)
    beam_size=5,
    condition_on_previous_text=False,  # evita que un error se arrastre
)
print(f"idioma principal: {info.language} ({info.language_probability:.0%}) · duración {info.duration / 60:.1f} min", flush=True)


def hms(s):
    s = int(s)
    return f"{s // 3600:02d}:{s % 3600 // 60:02d}:{s % 60:02d}"


with open(salida, "w", encoding="utf-8") as f:
    f.write(f"# Transcripción automática · {audio.name}\n# Modelo {modelo} · revisar nombres propios y cifras\n\n")
    for seg in segmentos:
        linea = f"[{hms(seg.start)}] {seg.text.strip()}"
        f.write(linea + "\n")
        f.flush()
        print(f"{seg.end / info.duration:5.0%} {linea[:100]}", flush=True)

print(f"listo en {(time.time() - t0) / 60:.1f} min → {salida}", flush=True)
