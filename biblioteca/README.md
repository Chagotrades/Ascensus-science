# Biblioteca de Ascensus (2D + 3D)

**Catálogo visual:** `biblioteca/catalogo.html` (con el servidor: http://localhost:8123/biblioteca/catalogo.html). Muestra cada pieza 2D y 3D con su sello de validación.

## Aprobación científica (obligatoria)

Cada componente tiene una ficha en **`registro.json`**: estado (`borrador` → `en-revision` → `aprobado`, o `grafico` si no tiene contenido científico), **alcance** de la aprobación, fuente y evidencia (quién aprobó, cuándo, por qué medio). **En entregas a clientes solo se usan piezas `aprobado` (dentro de su alcance) o `grafico`.** Detalle en `skills/graphical-abstract.md`.

## Paleta común

`estilo/colores.js` es la única fuente de colores para 2D y 3D (TiO₂, Ag, Au, e⁻, h⁺, •OH, O₂•⁻, luz, átomos CPK). Las especies llevan siempre su símbolo escrito (daltonismo).

## 2D (SVG)

`2d/componentes.js`: funciones con parámetros que devuelven SVG (partícula y nanoesfera de TiO₂, Ag/Au, H₂O, e⁻, h⁺, •OH, O₂•⁻, diagrama de bandas, fotón, sol, vaso, electrodos, chip sensor, celular, cápsula, flecha, hito de roadmap, rótulo). Para Inkscape, Illustrator o Figma: `node herramientas/exportar_svg.mjs` → `2d/svg/` (lo no aprobado sale con `.BORRADOR` en el nombre).

## 3D (Three.js)

Componentes Three.js reutilizables para química y materiales. **1 unidad = 1 nm.** Todo entra por parámetros; ningún valor de un cliente queda escrito adentro.

| Archivo | Qué hace | Parámetros clave |
|---|---|---|
| `js/nanoesfera-porosa.js` | Esfera porosa hecha de nanopartículas (TiO₂, ZnO…) con `InstancedMesh` | `diametro`, `diametroParticula`, `porosidad`, `grosorCapa`, `color`, `segmentos` |
| `js/nanoparticulas-plasmonicas.js` | Ag / Au metálicas (PBR) sobre una superficie, con halo controlable por partícula | `superficie`, `cantidad`, `diametro: [min,max]`, `metal: 'Ag'\|'Au'`, `zonaPreferente` |
| `js/molecula.js` | Bola y varilla desde un SDF (p. ej. PubChem 3D), fórmula de Hill, degradación en fragmentos | `escala`, `ocultarH`, `fragmentos`, `radioAtomo`, `radioEnlace` |
| `js/particulas-fx.js` | Fotones (paquetes de onda, espectro UV-vis), sprites de especies (e⁻, h⁺, •OH, O₂•⁻), destellos | `cantidad`, `tam`, `simbolo`, `color` |
| `js/util.js` | Azar con semilla, curvas de suavizado, texturas de brillo y de carga, `liberar()` | |
| `datos/ceftiofur.sdf` | Ceftiofur, PubChem CID 6328657, confórmero 3D | |
| `vendor/three/` | Three.js **0.186.0** + addons de la misma versión (OrbitControls, RoomEnvironment). No editar | |

## Uso mínimo

```js
import { crearNanoesferaPorosa } from '../biblioteca/js/nanoesfera-porosa.js';
import { crearNanoparticulasPlasmonicas } from '../biblioteca/js/nanoparticulas-plasmonicas.js';

const esfera = crearNanoesferaPorosa({ diametro: 250, diametroParticula: 10 });
const ag = crearNanoparticulasPlasmonicas({ superficie: esfera.superficie, diametro: [3, 4] });
escena.add(esfera.grupo, ag.grupo);
// Ag/Au necesitan un mapa de entorno para verse metálicas:
escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
```

Import map de la página (rutas relativas a la página):

```html
<script type="importmap">{ "imports": {
  "three": "<ruta>/biblioteca/vendor/three/three.module.min.js",
  "three/addons/": "<ruta>/biblioteca/vendor/three/addons/" } }</script>
```

## Reglas

- Azar siempre con semilla (`azar(n)`), nunca `Math.random()`: misma imagen en cada visita y en cada captura.
- La animación es función del tiempo `t`, no acumula estado: así un cuadro quieto (movimiento reducido) sale bien y se puede saltar a cualquier momento (`?t=`).
- Si se agranda algo para que se vea (moléculas junto a una esfera de 250 nm), se dice en pantalla.
- Moléculas: coordenadas reales (PubChem), nunca dibujadas a mano.

## Pendiente (ver PLAN.md §8)

Nanotubo y nanorod de TiO₂, ZnO, MoS₂, diagrama de bandas como componente 3D (hoy es SVG en la demo), radical SO₄•⁻, ciprofloxacino y azul de metileno (bajar SDF de PubChem), reactor.
