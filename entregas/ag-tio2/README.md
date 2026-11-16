# Entregables · Ag-TiO₂ (paper 2022, J. Ind. Eng. Chem.)

Todo sale de la misma escena (`demos/ag-tio2/`). Para regenerar: levantar `python herramientas/servidor.py` y abrir
`http://localhost:8123/demos/ag-tio2/?exportar=<modo>` (modos: `video`, `figura`, `carrusel`, `abstract`, `todo`).
El estado queda en el título de la pestaña ("listo: …").

| Archivo | Qué es | Cómo se regenera |
|---|---|---|
| `video-mecanismo.mp4` | Video 1920×1080, 53 s, 14 Mbps, subtítulos en inglés | `?exportar=video` |
| `video-mecanismo-ligero.mp4` | Mismo video a 4 Mbps (~26 MB), para correo/WhatsApp y la página | `?exportar=video&mbps=4&nombre=video-mecanismo-ligero` |
| `figura-mecanismo.png` / `-limpia.png` | Figura 3600×2400 con y sin rótulos | `?exportar=figura` (instante elegido solo; fijar con `&t=`) |
| `render-nanoesfera.png` | Esfera completa 3600×2400 (portada de página, redes) | `?exportar=figura` |
| `graphical-abstract.png` / `-1328x531.png` | Formato Elsevier (2× y tamaño mínimo) | `?exportar=abstract` |
| `carrusel/lamina-1..6.png`, `carrusel-linkedin.pdf` | Carrusel 1080×1350 + PDF para LinkedIn | `?exportar=carrusel` y luego `python herramientas/carrusel_pdf.py entregas/ag-tio2/carrusel entregas/ag-tio2/carrusel/carrusel-linkedin.pdf` |
| `web/*.webp` | Versiones livianas (~300 KB en total) que muestra la página del investigador. Los PNG grandes quedan solo para descargar | `python herramientas/miniaturas.py entregas/ag-tio2` (después de re-exportar) |
| `carrusel/post-linkedin.md` | Texto sugerido del post (el profesor lo edita) | a mano |

Control de calidad del video: `?exportar=video&cuadros=10,24,38` guarda esos instantes como PNG en `control/`.
Todo es borrador hasta que el profesor valide las notas científicas.
