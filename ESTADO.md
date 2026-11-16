# Estado del negocio — Ascensus Science Visuals

> Archivo vivo. Se actualiza al final de cada sesión de trabajo y cada vez que pasa algo en el negocio (cliente nuevo, pago, entrega, decisión, reunión).

## Ahora mismo

- **Fase actual:** Fase 1 — Piloto (0–2 meses)
- **Foco de esta semana:** validar precios de la propuesta con Mathias, definir hosting y reunirse con el profesor con el kit completo (un link + propuesta)
- **Clientes activos:** 1 (Prof. Pugazhenthiran Nalandhiran, USM)
- **Ingresos acumulados:** $300.000 CLP (web del laboratorio)
- **Bloqueos:** faltan los PDF de los papers (acceso cerrado; pedírselos al profesor o bajarlos con la cuenta USM) y confirmar el tema de su tesis. Falta definir hosting/dominio de Ascensus para mostrar la demo

## Avance por fase

| Fase | Estado | Hito para darla por cumplida |
|---|---|---|
| 1. Piloto (0–2 meses) | En curso | Web del lab entregada + demo piloto mostrada al profesor |
| 2. Portafolio y USM (2–6 meses) | Pendiente | Primer graphical abstract pagado + 3–5 académicos de la USM |
| 3. Región y Chile (6–12 meses) | Pendiente | Clientes en otras universidades + primera portada postulada |
| 4. Internacional / producto (12+ meses) | Pendiente | Herramienta abierta como SaaS + CTO socio |

## Clientes y proyectos

| Cliente | Proyecto | Estado | Monto (CLP) | Próximo paso |
|---|---|---|---|---|
| Prof. Pugazhenthiran (USM) | Web del laboratorio | Vendida, mantención gratis hasta 2027 | 300.000 | Entregar impecable |
| Prof. Pugazhenthiran (USM) | Visualización de su investigación (proyecto aparte) | Kit gratis listo (interno): demo 3D, video, figura, graphical abstract, carrusel, página | Propuesta: 180k / 490k / 890k por paper, plan anual 2,2M (a validar) | Validar precios con Mathias → reunión: mostrar kit, que valide lo científico, preguntar próximo paper, FONDECYT y PDFs |

## Herramienta interna y biblioteca 3D

| Pieza | Estado |
|---|---|
| Estructura del proyecto | Lista (papers/, biblioteca/, demos/, skills/) |
| Demo Ag-TiO₂ | Publicada (Artifact privado, link en la bitácora). v0.2 en `demos/ag-tio2/`: 8 pasos, escritorio y celular, interruptor "sin Ag", notas científicas. Falta validar con el profesor |
| Biblioteca 3D (TiO₂, Ag/Au, radicales, moléculas…) | Primeras piezas: nanoesfera porosa, Ag/Au plasmónicas, moléculas desde SDF, fotones/e⁻/h⁺/•OH (ver `biblioteca/README.md`) |
| Exportador (video MP4, PNG alta resolución) | Listo: `biblioteca/js/exportador.js` + `herramientas/servidor.py` (guarda en `entregas/`) |
| Página del investigador | Maqueta en `paginas/pugazhenthiran/` |
| Skills documentadas | 1: `skills/escena-3d-mecanismo.md` (actualizada con exportación) |

## Bitácora (más reciente arriba)

- **2026-11-16** — Proyecto subido a GitHub, repo **privado**: https://github.com/Chagotrades/Ascensus-science. Fuera del repo (por `.gitignore`): PDFs del profesor, entregables generados (videos/PNG grandes) y las carpetas `sitio/` y `despliegue/`. Sitio armado para Netlify (subido por Santiago con Netlify Drop, visibilidad pública por link + noindex).
- **2026-11-16** — Demo Ag-TiO₂ publicada como Artifact privado en claude.ai: https://claude.ai/artifact/D3uAYsonp8cq5xJZbAM1e1 (solo Santiago la ve hasta compartirla desde el menú Share). Paquete reproducible con `python herramientas/empaquetar_demo.py ag-tio2` → `despliegue/ag-tio2/`. La página del investigador NO se publicó así (los videos superan el límite de 15 MB por archivo): sigue pendiente un hosting propio de Ascensus.
- **2026-11-16** — Segundo bug visto por Santiago: si la demo carga con el panel oculto (tamaño 0×0), la cámara quedaba inválida y el texto del panel invisible. Corregido y probado cargando en 0×0 y agrandando después.
- **2026-11-16** — Bug en la demo detectado por Santiago ("no carga / 3D bugeado"): el bucle de animación pasaba la hora como paso de tiempo → reloj disparado y cámara en NaN. Corregido. Además: la cámara ya no entra en la esfera al girarla, la esfera está rellena de partículas con poros finos (antes era hueca y tenía un cráter). Entregables re-exportados con la versión corregida.
- **2026-11-16** — Kit completo del paper Ag-TiO₂ para venderle la idea al profesor: portada en la demo, video de 53 s con subtítulos (maestro de 89 MB + versión liviana de 26 MB), figura del mecanismo con y sin rótulos, render de la nanoesfera, graphical abstract en formato Elsevier, carrusel de LinkedIn (PDF + texto del post) y una página del investigador que junta todo. Nuevo exportador: todo sale de la misma escena cuadro a cuadro (WebCodecs + mp4-muxer, sin ffmpeg). Borrador de propuesta "Research Visuals" en `propuestas/` con 3 paquetes por paper + plan anual; **precios sin validar con Mathias**. Producto bautizado internamente como "Interactive Paper".
- **2026-11-15** — Demo 3D Ag-TiO₂ v0.1 construida (Three.js, 8 pasos: problema → material → luz → e⁻/h⁺ → Ag atrapa e⁻ → •OH → degradación → 92% vs 71%). Primeras piezas de la biblioteca 3D y primera skill. Los PDF no se pudieron conseguir (acceso cerrado, no están en el correo); se usó el resumen oficial y se dejaron en `papers/README.md` los supuestos a validar. Ojo: la ficha de la UCSC no lista al profesor como primer autor; confirmar con el PDF antes de decir "primer autor".
- **2026-11-15** — Análisis de los papers del profesor terminado (firma: TiO₂ modificado + luz contra antibióticos). Elegida la demo: nanoesferas de Ag-TiO₂ (2022). Se crea la carpeta del proyecto con PLAN.md, ESTADO.md y CLAUDE.md para trabajar en Claude Code.
- **2026-11-14** — Reunión con el profesor: se vende la web del laboratorio por $300.000 + mantención gratis hasta 2027. Él quiere visualizar sus investigaciones y ofrece recomendarnos. Se arma el plan maestro: agencia → SaaS, bootstrapping, Claude como orquestador.
