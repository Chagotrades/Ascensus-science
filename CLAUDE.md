# Ascensus Science Visuals

Estudio de visualización científica interactiva para química, materiales y energía. Empresa: Ascensus (Santiago Barrios + Mathias). Parte como agencia; la meta es convertir la herramienta interna en un SaaS ("BioRender para química y materiales, en 3D").

**Al empezar cada sesión, lee `ESTADO.md` (dónde estamos) y `PLAN.md` (hacia dónde vamos).**

## Mantener el negocio al día (obligatorio)

- `ESTADO.md` es el tablero vivo del negocio: fase actual, foco, clientes, ingresos, bloqueos y bitácora.
- **Al final de cada sesión**, o cuando Santiago cuente algo nuevo (cliente, pago, entrega, reunión, decisión), actualiza `ESTADO.md`:
  - agrega una línea fechada arriba en la Bitácora,
  - actualiza "Ahora mismo", las tablas de clientes y de herramienta, y el avance por fase.
- Cuando se cumpla el hito de una fase, márcala como cumplida y pasa la siguiente a "En curso".
- `PLAN.md` es la estrategia: se cambia solo cuando cambia una decisión de fondo (precios, fases, modelo, equipo). Si cambia, deja una línea en la Bitácora explicando qué y por qué.
- No borres historia: lo que ya no aplica se marca como reemplazado, no se elimina.

## Cliente actual

Prof. Pugazhenthiran Nalandhiran (Química, USM). Fotocatálisis con TiO₂ modificado para degradar antibióticos y colorantes. Este proyecto es personal del profesor y NO va en la web del laboratorio de la USM.

## Primera tarea

Demo 3D interactiva de su paper de 2022: nanoesferas porosas de Ag-TiO₂ que oxidan el antibiótico ceftiofur con luz (datos en `PLAN.md`, sección 3). La escena debe mostrar: luz llegando → separación e⁻/h⁺ → Ag atrapando electrones → formación de radicales •OH → degradación de la molécula. Incluir el resultado (92% en 90 min vs 71% TiO₂ comercial).

## Estructura

```
ESTADO.md        tablero vivo del negocio (fase, clientes, bitácora)
PLAN.md          plan maestro (estrategia)
papers/          PDFs del profesor (no compartir fuera)
biblioteca/      modelos y componentes 3D reutilizables
demos/ag-tio2/   primera demo
skills/          procesos documentados para repetir el trabajo
```

## Reglas

- Calidad profesional: el estándar son Ella Maru Studio y Animate Your Science.
- Exactitud científica primero: no inventar datos; marcar lo que el profesor debe validar.
- Todo componente 3D debe ser reutilizable para la biblioteca (parámetros, no valores fijos).
- Debe funcionar en el celular y en navegadores normales, sin instalar nada.
- Stack: Three.js para escenas, 3Dmol.js para moléculas, Blender (scripts Python) para renders de portada.
- Textos de cara al cliente en inglés; documentación interna en español.
- Lo que aprendamos en cada proyecto se documenta como skill en `skills/`.
