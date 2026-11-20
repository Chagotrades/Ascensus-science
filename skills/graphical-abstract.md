# Skill: graphical abstract, figuras 2D y uso de la biblioteca

Cómo hacemos graphical abstracts, figuras de mecanismo, roadmaps e ilustraciones 2D en Ascensus. Respaldo: `investigacion/visualizacion-cientifica-2026-11.md`. Para escenas 3D, ver `skills/escena-3d-mecanismo.md`.

## Regla número uno: aprobación científica

**Nada entra a una entrega ni queda como "aprobado" en la biblioteca sin la aprobación del científico.**

Cada componente de `biblioteca/` (2D o 3D) tiene una ficha en `biblioteca/registro.json`:

| Estado | Qué significa | Se puede usar en… |
|---|---|---|
| `borrador` | Lo hicimos nosotros y nadie lo ha revisado | Bocetos internos, siempre marcados como borrador |
| `en-revision` | Se lo mandamos al científico y esperamos respuesta | Bocetos que se le muestran **a ese** científico |
| `aprobado` | El científico lo aprobó por escrito (correo, WhatsApp o comentario), **para un alcance concreto** | Entregas a clientes, **solo dentro de ese alcance** |
| `grafico` | Pieza sin contenido científico (flecha, marco, sol, vaso genérico) | Cualquier pieza |

- **La aprobación es por alcance.** "TiO₂ anatasa en nanoesfera porosa, según el paper de 2022 (DOI…)" no aprueba la misma esfera para ZnO ni para otro tamaño. Para otro uso, nueva revisión.
- **Se guarda la evidencia:** quién, cuándo, por qué medio y qué dijo, en el campo `aprobacion` de la ficha. Sin evidencia, no está aprobado.
- **Si el científico pide un cambio,** la pieza vuelve a `en-revision` y se anota qué cambió.
- **Lo que se simula o se mueve** (flujos, fuerzas, trayectorias) necesita además **la ecuación o el dato que lo respalda** (pedido explícito del profesor en la reunión del 17-nov).

## Antes de empezar (brief de 1 página)

1. **Revista objetivo** y su guía del autor: medida exacta, formato, fuente, si acepta IA.
2. **Mensaje único:** el hallazgo principal en una frase.
3. **Recorrido:** problema → material o proceso → resultado (izquierda a derecha, salvo que el contenido pida otra cosa).
4. **Fuente científica de cada elemento:** figura o sección del paper de donde sale.
5. **Componentes de la biblioteca que reutilizamos** y su estado de aprobación.

## Medidas por editorial (verificar siempre en la revista)

| Editorial | Medida | Texto |
|---|---|---|
| Elsevier | 1328 × 531 px mínimo (5:2), 300 dpi; legible a 500 × 200 px | Arial (o Times/Courier/Symbol); sin la palabra "Graphical abstract" |
| ACS | 8,25 × 4,45 cm a tamaño real (excepciones: ACS Nano 9 × 4 cm, Energy Lett. 3 × 2 in) | sans-serif, 8 pt (mínimo 6) |
| Cell Press | cuadrado, un panel | Arial 12–16 pt; **sin datos**, todo visual |

## Estilo Ascensus

- **Colores:** los de `biblioteca/estilo/colores.json`, iguales en 2D y 3D (TiO₂, Ag, e⁻ azul, h⁺ naranja, •OH, O₂•⁻, luz…). Máximo 2–4 colores protagonistas por pieza.
- **Daltonismo:** e⁻ (azul) y h⁺ (naranja) son un par seguro (Okabe-Ito). •OH (rojo) y h⁺ (naranja) se parecen para algunos daltónicos: **siempre llevan símbolo escrito** (nunca solo color). Revisar cada pieza en escala de grises.
- **Tipografía:** Inter en pantalla. En archivos para revistas, **Arial** o texto convertido a curvas.
- **Texto mínimo:** rótulos cortos, sin párrafos. Unidades reales (nm, eV, min).
- **Escala:** si algo está agrandado para que se vea, se dice ("molecules ×6, not to scale").
- **Espacio:** márgenes generosos, pocas líneas divisorias, una sola flecha de recorrido principal.

## Proceso de producción

1. Brief aprobado por el cliente.
2. **Boceto en línea, sin color**, armado con componentes de la biblioteca (los que no estén aprobados van marcados como borrador).
3. Correcciones del científico por escrito → actualizar las fichas de los componentes nuevos (`en-revision` → `aprobado`).
4. Color y pulido con los tokens de estilo.
5. Revisión: escala de grises, simulador de daltonismo, tamaño real de la revista, ortografía científica (subíndices, superíndices, símbolos).
6. Entrega en el formato de la revista + versión para redes.
7. **Lo que se creó nuevo y quedó aprobado se suma a la biblioteca**, con su ficha.

## Checklist antes de entregar
- [ ] Todos los componentes científicos están `aprobado` para este alcance (o son `grafico`).
- [ ] Medida, formato y fuente de la revista objetivo.
- [ ] Un solo mensaje, legible en el celular.
- [ ] Se entiende en escala de grises y con daltonismo.
- [ ] Nada exagerado ni inventado; lo agrandado, avisado.
- [ ] Créditos: "Visual: Ascensus Science Visuals" (si el cliente lo permite).
