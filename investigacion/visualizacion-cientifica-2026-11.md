# Cómo mejorar en visualización científica — investigación (noviembre 2026)

> Documento interno. Objetivo: aprender cómo trabajan los mejores, qué piden las revistas, qué software se usa y cómo dejar de partir de cero en cada proyecto. Casi todo viene de guías de editoriales, artículos de revisión y blogs de proveedores; se indica cuándo un dato es dudoso. Fuentes al final.

## 1. Lo que piden las revistas (graphical abstract / TOC)

| Editorial | Tamaño | Formato y texto | Ojo |
|---|---|---|---|
| **Elsevier** (J. Ind. Eng. Chem., Chem. Eng. J., etc.) | mínimo **1328 × 531 px** (proporción 5:2), 300 dpi | TIFF, EPS, PDF o Office; fuentes Arial, Times, Courier o Symbol; legible al verse en **500 × 200 px** | No escribir "Graphical abstract" dentro de la imagen. Una fuente dice que Elsevier prohíbe imágenes de IA generativa: **verificar** en la guía del autor de cada revista |
| **ACS** (JACS, ACS Catalysis, ACS AMI…) | **8,25 × 4,45 cm** (3,25 × 1,75 in) a tamaño real | TIFF 300 dpi color (1200 dpi B/N) o EPS; texto sans-serif, **8 pt (mínimo 6 pt)** | Hay excepciones: ACS Nano 9 × 4 cm, ACS Energy Letters 3 × 2 in, ACS Catalysis 3,33 × 1,87 in. Siempre usar la medida de la revista concreta |
| **Cell Press** | imagen cuadrada, **un solo panel** (fuentes discrepan: ~5,5 in o 1200 px) | Arial 12–16 pt para rótulos | **Sin datos** (ni gráficos ni números): todo visual. Sin antecedentes ni especulación. Colores poco saturados |

**Regla práctica para nosotros:** antes de empezar cualquier graphical abstract, abrir la **guía del autor de la revista objetivo** y anotar en el brief: medida exacta, formato, fuente y si acepta IA. Los tamaños cambian de revista a revista, incluso dentro de una misma editorial.

## 2. ¿Sirven los graphical abstracts? (lo que dice la evidencia)

Conviene saberlo para vender con honestidad:
- Una **revisión sistemática** (investigación médica) concluye que los GA **aumentan la atención y el interés temprano** (confianza moderada), pero su efecto sobre **descargas y citas es incierto** (confianza baja a muy baja).
- Estudios individuales se contradicen: en gastroenterología se asociaron a **más citas y más presencia en redes**; en ciencias del deporte, a **más atención en Altmetric pero no a más citas**; en revistas médicas, sin diferencia; en una revista de química (*Molecules*), los artículos **sin** GA tuvieron más descargas y citas.
- Lo consistente: **más visibilidad en redes sociales**. Todos son estudios observacionales (asociación, no causa).

**Cómo lo usamos en la venta:** no prometer "más citas". Prometer lo que sí está respaldado: **más atención y difusión** (redes, congresos, web, postulaciones), cumplir el formato de la revista sin perder tiempo, y piezas que el investigador reutiliza en charlas, clases e informes.

## 3. Buenas prácticas de diseño (en qué coinciden las guías)

1. **Un solo mensaje.** El GA cuenta el hallazgo principal. "Si intentas mostrar todos los resultados, no se ve ninguno."
2. **Recorrido de lectura evidente:** de izquierda a derecha para procesos y causa → efecto (lo habitual en revistas en inglés), o de arriba hacia abajo si el proceso lo pide. Flechas solo donde el orden no es obvio.
3. **Poco texto:** rótulos cortos, nada de párrafos. Sans-serif legible en el celular.
4. **Color con intención:** una paleta de **2 a 4 colores** principales, con contraste suficiente para daltónicos. Cell Press pide colores poco saturados.
5. **Espacio:** márgenes y separaciones generosas; pocas líneas divisorias.
6. **Integridad científica:** no exagerar resultados ni sugerir detalles que el estudio no respalda. Lo mismo dijo el profesor en la reunión: **nada inventado; lo que se mueve o se simula tiene que estar justificado**.
7. **Probar con alguien de fuera del área:** si entiende el hallazgo sin leer el paper, el GA funciona.

**Daltonismo:** cerca de la mitad de las figuras en un estudio de 580 artículos de biología no se podían leer con daltonismo rojo-verde. Nature recomienda figuras accesibles. Paleta de referencia: **Okabe-Ito / Wong** (Nature Methods, 2011), con 8 colores distinguibles por todos. Además: **no codificar solo con color** (sumar símbolo, forma o rótulo) y **revisar en escala de grises**.

## 4. Cómo trabajan los estudios profesionales

El proceso que se repite (NIH Medical Arts, estudios médicos e ilustradores):
1. **Brief:** objetivo, público, mensaje clave, dónde se va a usar, restricciones (tamaño, revista).
2. **Boceto de composición** antes de pulir nada. El estudio **no calca** el boceto del investigador: lo rediseña para comunicar mejor y cumplir las normas.
3. **Primer borrador en línea, sin color** → correcciones marcadas por el cliente.
4. **Dos o más rondas formales de corrección**, por escrito.
5. Color, pulido y entrega en el formato de la revista.

Ya tenemos este proceso en PLAN.md §7. Lo que nos faltaba era la **biblioteca de componentes y una guía de estilo**, que es lo que permite a los estudios ser rápidos y consistentes.

## 5. Software del mercado

| Para qué | Herramienta | Costo | Comentario |
|---|---|---|---|
| Estructuras y esquemas de reacción | **ChemDraw** | caro, licencia institucional (la USM puede tenerla) | El estándar en química. Ideal para que el profesor nos pase estructuras exactas |
| Ilustración vectorial (2D) | **Adobe Illustrator** | ~USD 240–250 al año | El estándar profesional; curva de aprendizaje alta |
| | **Affinity** | gratis (según una fuente) | Muy recomendada como alternativa a Illustrator |
| | **Inkscape** | gratis, código abierto | Más limitada, pero suficiente y abre SVG directo |
| Plantillas listas (biología) | **BioRender** | USD 420–1.188 al año | Fuerte en biología, débil en química y materiales: **ese es nuestro hueco** |
| Estructuras cristalinas | **VESTA** | gratis | Para TiO₂, ZnO y celdas cristalinas exactas |
| Moléculas 3D | **ChimeraX, PyMOL, 3Dmol.js, Mol\*** | gratis | Visualización exacta; exportan a formatos que Blender puede abrir (.glb) |
| Render 3D de calidad (portadas) | **Blender** + **Molecular Nodes** | gratis | Molecular Nodes trae ~160 nodos para moléculas y cristales; render con Cycles + GPU, fondo transparente para componer |
| IA para figuras | SciFig, SciDraw, Illustrae | variable | Útiles para bocetos rápidos. El profesor ya notó que lo hecho **solo con IA no se puede editar**. Usarla para idear, nunca como entrega final |

**Lo que nos conviene:** **Inkscape o Affinity** para 2D (gratis, editan nuestros SVG), **Blender + Molecular Nodes** para renders 3D de portada (gratis, y ya está en el stack del CLAUDE.md), **VESTA** para estructuras cristalinas y **ChemDraw** de la USM para estructuras químicas. Nuestro diferencial frente a BioRender: **química y materiales, más 3D interactivo**.

**Recursos gratuitos de íconos** (revisar la licencia de cada pieza y dar crédito cuando se pida):
- **Bioicons**: SVG, ~2.000–2.800 íconos, incluye química; licencias por ícono (CC0, MIT, CC BY…).
- **SciDraw**: SVG, CC BY 4.0 o CC0.
- **Servier Medical Art**: ~3.000 imágenes CC BY 4.0, sobre todo medicina.
- **NIH BioArt**, **Reactome**: CC BY 4.0 o dominio público.

Sirven de apoyo, pero lo nuestro (TiO₂, Ag, cargas, radicales, sensores) casi no existe. Por eso hacemos **nuestra propia biblioteca**.

## 6. Lo que vamos a hacer con esto

1. **Guía de estilo Ascensus** (`skills/graphical-abstract.md`): colores, tipografía, tamaños por editorial, reglas de composición y checklist.
2. **Biblioteca única 2D + 3D** (`biblioteca/`): los mismos colores en las dos (TiO₂, Ag, e⁻, h⁺, •OH…), para que una figura 2D, un video y una escena 3D se vean de la misma familia.
3. **Plantillas por formato:** Elsevier 1328 × 531, ACS 8,25 × 4,45 cm, Cell cuadrado, roadmap de postulación.
4. **Aprender herramientas profesionales** (consejo del profesor): Inkscape/Affinity primero (gratis), Blender después.
5. **Revisar cada pieza en escala de grises y con un simulador de daltonismo** antes de entregar.

## Fuentes
- Requisitos por editorial: https://researcherlife.in/blog/graphical-abstract-size-requirements-by-publisher.html · https://sci.latticevisual.com/blog/elsevier-graphical-abstract-requirements/ · https://scientificfigure.com/blog/graphical-abstract-requirements · https://sci-draw.com/blog/graphical-abstract-requirements-by-journal
- ACS TOC: https://abfig.com/journals/acs · https://www.labcanvas.com/graphical-abstracts/acs · https://conceptviz.app/blog/toc-graphic-requirements-by-journal
- Cell Press: https://crosstalk.cell.com/blog/attract-readers-at-a-glance-with-your-graphical-abstract · https://mindthegraph.com/blog/cell-press-what-you-need-to-know-tips-for-creating-a-graphical-abstract/ · https://rupress.org/jcb/pages/graphical-abstract
- Evidencia de impacto: revisión sistemática https://www.researchgate.net/publication/412260340 · gastroenterología https://pmc.ncbi.nlm.nih.gov/articles/PMC9678657/ · deporte https://link.springer.com/article/10.1007/s11192-023-04709-2 · revistas médicas https://pubmed.ncbi.nlm.nih.gov/34192421/ · comunicación científica https://pmc.ncbi.nlm.nih.gov/articles/PMC10724116/
- Buenas prácticas: Ten simple rules https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10833524/ · Springer Nature https://authorservices.springernature.com/featured-articles/graphical-abstracts-a-visual-way-to-expand-the-reach-of-your-research/ · Editage https://www.editage.com/insights/graphical-abstract-tips-colors-layout-and-more · FEBS Letters 2025 https://febs.onlinelibrary.wiley.com/doi/10.1002/1873-3468.70163 · CASRAI https://casrai.org/guides/graphical-abstract-examples-and-guidelines
- Daltonismo: NCEAS https://nceas.ucsb.edu/sites/default/files/2022-06/Colorblind%20Safe%20Color%20Schemes.pdf · NKI https://nki.nl/about-us/responsible-research/guidelines-color-blind-friendly-figures · Wong, Nature Methods 8:441 (2011) doi:10.1038/nmeth.1618
- Flujo de trabajo: NIH Medical Arts https://ors.od.nih.gov/mab/Documents/DMA-MI-guide.pdf · Nucleus https://www.nucleusmedicalmedia.com/medical-animation-illustration-production-workflow
- Software: https://www.simplifiedsciencepublishing.com/resources/biorender-alternatives-scientific-illustration-software-comparison · https://sci-draw.com/blog/best-scientific-illustration-software-2026 · Molecular Nodes https://github.com/BradyAJohnston/MolecularNodes
- Íconos: Bioicons https://casrai.org/guides/bioicons · SciDraw https://casrai.org/guides/scidraw · recursos abiertos https://blog.stephenturner.us/p/free-open-source-images-tools-scientific-illustrations
