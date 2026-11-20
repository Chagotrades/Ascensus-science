# Estado del negocio — Ascensus Science Visuals

> Archivo vivo. Se actualiza al final de cada sesión de trabajo y cada vez que pasa algo en el negocio (cliente nuevo, pago, entrega, decisión, reunión).

## Ahora mismo

- **Fase actual:** Fase 1 — Piloto (0–2 meses)
- **Foco de esta semana:** fotos del grupo el lunes 23 a las 16:00, revisar precios con Mathias, averiguar cómo formalizarnos (factura) y preparar los pedidos de la reunión (video de postulación sobre arsénico, roadmap, visualizaciones para la web del lab). Ver `HOJA-DE-RUTA.md`
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
| Prof. Pugazhenthiran (USM) | Visualización de su investigación (proyecto aparte) | Reunión 17-nov hecha: pagará por proyecto, ~5 graphical abstracts al año. Pedidos: video de postulación (arsénico), roadmap, visualizaciones para la web del lab. Kit gratis listo: demo 3D, video, figura, graphical abstract, carrusel, página | Propuesta: 180k / 490k / 890k por paper, plan anual 2,2M (a validar) | Validar precios con Mathias → reunión: mostrar kit, que valide lo científico, preguntar próximo paper, FONDECYT y PDFs |

## Herramienta interna y biblioteca 3D

| Pieza | Estado |
|---|---|
| Estructura del proyecto | Lista (papers/, biblioteca/, demos/, skills/) |
| Demo Ag-TiO₂ | Publicada (Artifact privado, link en la bitácora). v0.2 en `demos/ag-tio2/`: 8 pasos, escritorio y celular, interruptor "sin Ag", notas científicas. Falta validar con el profesor |
| Biblioteca 2D + 3D (TiO₂, Ag/Au, radicales, moléculas…) | Unificada con registro de validación y catálogo (`biblioteca/catalogo.html`). 0 aprobados aún. Primeras piezas 3D: nanoesfera porosa, Ag/Au plasmónicas, moléculas desde SDF, fotones/e⁻/h⁺/•OH (ver `biblioteca/README.md`) |
| Exportador (video MP4, PNG alta resolución) | Listo: `biblioteca/js/exportador.js` + `herramientas/servidor.py` (guarda en `entregas/`) |
| Página del investigador | Maqueta en `paginas/pugazhenthiran/` |
| CRM v0 (contactos, proyectos, agenda) | Publicado (Artifact privado, base compartida). Código en `crm/index.html`. Falta compartirlo con Mathias |
| Skills documentadas | 2: `skills/escena-3d-mecanismo.md`, `skills/graphical-abstract.md` |

## Bitácora (más reciente arriba)

- **2026-11-19** — **CRM v0** publicado como Artifact privado: https://claude.ai/artifact/9Z6mM85ymjbgG95WkoS6h4 (código en `crm/index.html`). Tres vistas: pipeline de contactos por etapa (prospecto → cliente), proyectos con los precios del catálogo de PLAN.md §6 (permite marcar "sin costo" y mostrar el valor como incluido) y agenda de próximos pasos con vencidos. Cada contacto tiene historial (reuniones, correos, entregas, pagos). Los datos viven en una base compartida del Artifact: Claude los puede leer y actualizar. Cargado con lo real de hoy: el profesor, sus 4 proyectos y 3 hitos del historial. **Para que Mathias edite, hay que compartírselo como Editor desde el menú Share.** Desde ahora, clientes y cobros se registran ahí; ESTADO.md sigue siendo el resumen.

- **2026-11-19** — Investigación de cómo mejorar (`investigacion/visualizacion-cientifica-2026-11.md`): requisitos de Elsevier, ACS y Cell; la evidencia dice que los graphical abstracts suben la atención en redes, pero no está demostrado que aumenten las citas; buenas prácticas; software (Inkscape/Affinity 2D, Blender + Molecular Nodes 3D, VESTA, ChemDraw); íconos libres. Nueva guía `skills/graphical-abstract.md`. **Biblioteca unificada 2D + 3D** con paleta común, 21 componentes 2D en SVG, catálogo visual y **registro de validación científica**: nada se usa en entregas sin aprobación del científico (regla de Santiago). Hoy: 0 aprobados, 4 en revisión (3D, mostrados el 17-nov), 13 borradores 2D y 8 gráficos.
- **2026-11-19** — **Precios aprobados por Santiago y Mathias.** Se reemplaza el catálogo de PLAN.md §6 (el anterior queda tachado como historia). Por qué: la investigación de mercado mostró que los paquetes anteriores quedaban casi al nivel de Fiverr; los nuevos quedan 25–60% bajo los especialistas internacionales, con una hora de ~$25.000–35.000. Roadmap ajustado: simple $60.000 / ilustrado $110.000; pack postulación (video + roadmap) $520.000.
- **2026-11-19** — Decisión: las visualizaciones 2D de las líneas de investigación para la web del lab van **sin costo**, porque son parte del compromiso de dejar la web bien y son la entrada con el profesor. En la cotización se muestran como "incluido" con su valor ($420.000). El precio sigue vigente para otros laboratorios.
- **2026-11-19** — Investigación de precios de mercado con fuentes (`investigacion/precios-mercado-2026-11.md`). Propuesta de precios de lanzamiento (−30–40% sobre el precio normal), con todas las piezas bajo $500.000 para poder cobrar con boleta desde un FONDECYT: graphical abstract $150.000, plan anual de 5 por $650.000, línea de investigación 2D $95.000 (pack de 5 por $420.000), roadmap $110.000, video de postulación $480.000, portada $320.000, escena 3D $990.000. **Pendiente: validar con Mathias.**
- **2026-11-19** — Decisión: la web del lab lleva visualizaciones **2D** de cada línea de investigación (sin 3D), pedidas por el profesor. Es la vitrina frente a los otros laboratorios de la USM. CLAUDE.md actualizado con la excepción. Se inicia una investigación de precios de mercado con datos para fijar tarifas.
- **2026-11-17** — Reunión con el Prof. Pugazhenthiran (47 min, transcrita localmente). Va a pagar **por proyecto** con fondos de sus proyectos y quiere **~5 graphical abstracts al año**. Pedidos nuevos: video para postular un proyecto (detección de arsénico en agua potable, dispositivo IoT), imagen del roadmap de esa postulación y visualizaciones de las líneas de investigación **para la web del lab** (cambia la regla de no poner visualizaciones en la web de la USM: hay que confirmarlo). Fotos del grupo el lunes 23 a las 16:00. Recomendó formalizar una empresa para facturar y usar Instagram; ofrece coautoría si el trabajo es grande. No se habló de montos. Hoja de ruta en `HOJA-DE-RUTA.md`.
- **2026-11-16** — Proyecto subido a GitHub, repo **privado**: https://github.com/Chagotrades/Ascensus-science. Fuera del repo (por `.gitignore`): PDFs del profesor, entregables generados (videos/PNG grandes) y las carpetas `sitio/` y `despliegue/`. Sitio armado para Netlify (subido por Santiago con Netlify Drop, visibilidad pública por link + noindex).
- **2026-11-16** — Demo Ag-TiO₂ publicada como Artifact privado en claude.ai: https://claude.ai/artifact/D3uAYsonp8cq5xJZbAM1e1 (solo Santiago la ve hasta compartirla desde el menú Share). Paquete reproducible con `python herramientas/empaquetar_demo.py ag-tio2` → `despliegue/ag-tio2/`. La página del investigador NO se publicó así (los videos superan el límite de 15 MB por archivo): sigue pendiente un hosting propio de Ascensus.
- **2026-11-16** — Segundo bug visto por Santiago: si la demo carga con el panel oculto (tamaño 0×0), la cámara quedaba inválida y el texto del panel invisible. Corregido y probado cargando en 0×0 y agrandando después.
- **2026-11-16** — Bug en la demo detectado por Santiago ("no carga / 3D bugeado"): el bucle de animación pasaba la hora como paso de tiempo → reloj disparado y cámara en NaN. Corregido. Además: la cámara ya no entra en la esfera al girarla, la esfera está rellena de partículas con poros finos (antes era hueca y tenía un cráter). Entregables re-exportados con la versión corregida.
- **2026-11-16** — Kit completo del paper Ag-TiO₂ para venderle la idea al profesor: portada en la demo, video de 53 s con subtítulos (maestro de 89 MB + versión liviana de 26 MB), figura del mecanismo con y sin rótulos, render de la nanoesfera, graphical abstract en formato Elsevier, carrusel de LinkedIn (PDF + texto del post) y una página del investigador que junta todo. Nuevo exportador: todo sale de la misma escena cuadro a cuadro (WebCodecs + mp4-muxer, sin ffmpeg). Borrador de propuesta "Research Visuals" en `propuestas/` con 3 paquetes por paper + plan anual; **precios sin validar con Mathias**. Producto bautizado internamente como "Interactive Paper".
- **2026-11-15** — Demo 3D Ag-TiO₂ v0.1 construida (Three.js, 8 pasos: problema → material → luz → e⁻/h⁺ → Ag atrapa e⁻ → •OH → degradación → 92% vs 71%). Primeras piezas de la biblioteca 3D y primera skill. Los PDF no se pudieron conseguir (acceso cerrado, no están en el correo); se usó el resumen oficial y se dejaron en `papers/README.md` los supuestos a validar. Ojo: la ficha de la UCSC no lista al profesor como primer autor; confirmar con el PDF antes de decir "primer autor".
- **2026-11-15** — Análisis de los papers del profesor terminado (firma: TiO₂ modificado + luz contra antibióticos). Elegida la demo: nanoesferas de Ag-TiO₂ (2022). Se crea la carpeta del proyecto con PLAN.md, ESTADO.md y CLAUDE.md para trabajar en Claude Code.
- **2026-11-14** — Reunión con el profesor: se vende la web del laboratorio por $300.000 + mantención gratis hasta 2027. Él quiere visualizar sus investigaciones y ofrece recomendarnos. Se arma el plan maestro: agencia → SaaS, bootstrapping, Claude como orquestador.
