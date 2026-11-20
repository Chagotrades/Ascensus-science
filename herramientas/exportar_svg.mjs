// Exporta cada componente 2D a un archivo .svg (para Inkscape, Illustrator, Figma o Affinity).
//   node herramientas/exportar_svg.mjs
// Los archivos llevan el estado de validación en el nombre si NO están aprobados ni son gráficos,
// para que nadie los use por error en una entrega (p. ej. "particula-tio2.BORRADOR.svg").
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMPONENTES_2D } from '../biblioteca/2d/componentes.js';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const registro = JSON.parse(readFileSync(join(raiz, 'biblioteca/registro.json'), 'utf8')).componentes;
const salida = join(raiz, 'biblioteca/2d/svg');
rmSync(salida, { recursive: true, force: true });
mkdirSync(salida, { recursive: true });

const resumen = { aprobado: 0, grafico: 0, 'en-revision': 0, borrador: 0, 'sin-ficha': 0 };
for (const { id, fn } of COMPONENTES_2D) {
  const ficha = registro[id];
  const estado = ficha?.estado ?? 'sin-ficha';
  resumen[estado]++;
  const sufijo = estado === 'aprobado' || estado === 'grafico' ? '' : `.${estado.toUpperCase()}`;
  const nombre = id.split('/')[1] + sufijo + '.svg';
  const contenido = `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Ascensus Science Visuals · ${id} · estado: ${estado}${ficha?.alcance ? ' · alcance: ' + ficha.alcance : ''} -->\n${fn()}\n`;
  writeFileSync(join(salida, nombre), contenido, 'utf8');
  if (estado === 'sin-ficha') console.warn(`⚠ ${id} no tiene ficha en registro.json`);
}
console.log(`biblioteca/2d/svg · ${COMPONENTES_2D.length} componentes ·`, resumen);
