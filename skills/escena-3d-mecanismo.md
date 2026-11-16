# Skill: escena 3D interactiva de un mecanismo (fotocatálisis y similares)

Aprendido en la demo Ag-TiO₂ (nov 2026). Sirve para cualquier paper con la historia problema → material → luz → mecanismo → resultado.

## Proceso

1. **Datos primero.** Sacar del paper (o de su resumen, si no hay PDF) solo lo verificable: tamaños, composición, % y tiempos, técnicas (PL, LC-MS, Microtox…). Escribirlo en `papers/README.md` con una lista de "lo que la demo supone y el autor debe validar".
2. **Guion en `pasos.js`.** Un paso = un mensaje. Cada paso define el encuadre de cámara (`vista`) e intensidades de procesos (`I`: fotones, pares, trampa, radicales, degradación). Los textos van en inglés.
3. **Escena con la biblioteca.** Componer con `biblioteca/js/*`. Lo nuevo que salga se escribe parametrizado y se mueve a la biblioteca.
4. **Mirar en capturas, de escritorio y celular, paso por paso** (`?paso=N&t=3` deja la escena en un paso e instante fijos). Arreglar lo que se vea mal, no lo que "debería" verse bien.
5. **Notas científicas en la página** (botón "Scientific notes"): fuente, datos del paper y decisiones esquemáticas. El cliente valida desde ahí.

## Decisiones que funcionaron

- **Escalas imposibles (250 nm contra 1,5 nm):** contar la historia con 3 encuadres (molécula en el agua → esfera completa → zoom a la superficie) y agrandar las moléculas (×6), avisando en la barra de escala y en las notas.
- **Procesos como función del tiempo:** cada sitio de reacción tiene un ciclo (fotón 0–0,22 → par e⁻/h⁺ → e⁻ a la Ag / h⁺ a •OH → impacto y degradación 0,86–1). Dos ramas (recombinación y trampa) que se mezclan con un peso permiten el interruptor "remove Ag" sin lógica extra.
- **Encuadre que respeta el panel:** `camera.setViewOffset` corre el centro óptico fuera del panel; `distAjuste(radio)` calcula la distancia para que el objeto quepa en la zona libre (escritorio: a la derecha del panel; celular: sobre el panel).
- **Etiquetas HTML proyectadas**, ancladas a objetos reales (una partícula de Ag concreta, no un punto inventado), que se voltean al acercarse al borde.

## Errores que ya pasaron (no repetir)

- Una regla CSS `display: grid` le gana al atributo `hidden`: el aviso "sin WebGL" salía encima de una escena que sí funcionaba. Siempre poner `[hidden] { display: none !important; }`.
- El TiO₂ blanco con luz fuerte queda como una pared blanca y se comen los brillos aditivos: usar un gris azulado (`#a9b7cc`), exposición ~0,9 y entorno ~0,4.
- Un zoom rasante pone los sitios activos en el horizonte (se ven chicos y cortados): mirar más desde arriba (componente normal ~0,8).
- Bola y varilla delgada desaparece a distancia: enlace 0,2 Å × escala, átomos 0,5 × radio covalente.
- Si el panel del navegador de Claude está oculto, las animaciones CSS y `document.timeline` quedan detenidas y las capturas muestran textos "a medio aparecer". Es el instrumento, no la página.

- **`renderer.setAnimationLoop(cuadro)` le pasa la hora en ms como primer argumento.** Si `cuadro(dt)` acepta un dt fijo (para exportar), hay que envolverlo: `setAnimationLoop(() => cuadro())`. Si no, cada cuadro "avanza" miles de segundos, la autorreproducción salta al final y la cámara queda en NaN (pantalla vacía). Pasó en la v0.2 y el cliente interno lo vio antes que nosotros: **después de tocar el bucle, abrir la demo normal y no solo las exportaciones.**
- **Una página que carga en una pestaña oculta mide la ventana como 0×0.** Cualquier cálculo de encuadre divide por 0 y la cámara queda en NaN, y si después se mezcla (`lerp`) con esa posición inválida, sigue en NaN para siempre. Reglas: medida de respaldo cuando el tamaño es 0, no llamar a `medir()` con tamaño 0, re-encuadrar cuando cambie el tamaño (revisarlo en cada cuadro, porque un panel que aparece no siempre dispara `resize`) y nunca interpolar desde una cámara inválida. Prueba: cargar la demo en un iframe de 0×0 y después agrandarlo.
- Las animaciones de entrada del texto no usan opacidad: si la animación no corre (pestaña oculta) o se reinicia en cada cuadro, el texto queda invisible.
- Con cámara libre, el centro de órbita del zoom está en la superficie y la cámara puede entrar en la esfera: limitar su distancia al centro (`R + margen`).
- Modelar la esfera como cáscara hueca deja ver el vacío por los poros, y un núcleo liso dentro parece una bola falsa. Mejor rellenarla de partículas (en escritorio aguanta ~6.000 instancias) y usar poros finos (`escalaPoro` ~0,1). Con poros gruesos (0,07) sale un cráter único que parece un error.

## Exportar entregables desde la escena (video, figura, abstract, carrusel)

- **Una escena, todos los formatos.** La escena expone `cuadro(dt)` con dt fijo y `exportar(w, h, encuadre)`; `exportar.js` de la demo arma cada pieza componiendo en un canvas 2D: fondo de marca + render WebGL + textos. Ver `entregas/ag-tio2/README.md`.
- **Video sin ffmpeg:** WebCodecs (H.264) + `mp4-muxer` en el navegador, cuadro a cuadro, determinista (~8 s para 53 s a 1080p en una GTX 1070). El servidor local (`herramientas/servidor.py`) recibe el archivo por POST y lo guarda solo dentro de `entregas/`.
- **Control de calidad:** `&cuadros=10,24` guarda esos instantes como PNG y se revisan antes de dar el video por bueno. Para confirmar que el MP4 cambia de verdad: el tamaño de los cuadros (`stsz`) varía por escena.
- **Encuadre por formato:** `encuadre = { ox, oy, fw, fh }` corre el centro óptico y define la zona libre (el subtítulo abajo a la izquierda en video, márgenes para rótulos en la figura).
- **Rótulos de la figura anclados a especies reales** del cuadro (no a puntos inventados): se elige el instante con más e⁻, h⁺ y •OH visibles a la vez, el ancla es un anillo hueco que no tapa la especie y las etiquetas se reparten a los lados sin cruzar líneas (máx. 5 por lado).
- Errores ya vistos: con el panel del navegador oculto, `<video>` no decodifica al buscar (el visor mostraba siempre el mismo cuadro aunque el MP4 estaba bien); símbolos largos (•OH, O₂•⁻) se cortaban en el sprite → el texto se achica para caber en el disco de color; destellos aditivos grandes queman la imagen en la figura.

## Entrega y hosting

- **Páginas: nunca mostrar los PNG de entrega como miniaturas.** La primera versión de la página del investigador bajaba ~40 MB en imágenes; con `herramientas/miniaturas.py` (WebP) bajó a ~300 KB. Los originales se enlazan solo para descargar.
- Servir desde la raíz del proyecto (`python -m http.server 8123` → `/demos/<demo>/`). Los módulos no funcionan con doble clic (`file://`).
- **Al publicar, subir solo `demos/<demo>/`, `biblioteca/`, `entregas/<demo>/` y `paginas/<investigador>/`. Nunca `papers/` ni `propuestas/`.** Las páginas llevan `noindex`.
- Servir con `python herramientas/servidor.py` (sirve el proyecto y habilita el guardado de exportaciones).
- Hosting en dominio de Ascensus, nunca en servidores de la USM.
