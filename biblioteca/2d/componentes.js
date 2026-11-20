// Componentes 2D de Ascensus (SVG). Cada función recibe parámetros y devuelve un <svg> como texto,
// listo para insertar en una página, componer dentro de otro SVG (como <svg x y width height>) o
// guardar como archivo y abrir en Inkscape/Illustrator/Figma.
//
// Regla: ningún componente científico se usa en entregas si en biblioteca/registro.json no está
// "aprobado" para ese alcance. El catálogo (biblioteca/catalogo.html) muestra el estado de cada uno.
// Puro: sin DOM, funciona en el navegador y en Node (herramientas/exportar_svg.mjs).
import { COLORES as C, FUENTE_REVISTA } from '../estilo/colores.js';

let _n = 0;
const uid = (base) => `${base}-${++_n}`;
const svg = (w, h, cuerpo, { titulo = '' } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img"${titulo ? ` aria-label="${titulo}"` : ''}>${titulo ? `<title>${titulo}</title>` : ''}${cuerpo}</svg>`;
const r2 = (x) => Math.round(x * 100) / 100;

// Azar con semilla (mismas formas en cada exportación)
function azar(s = 1) { let a = s >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), a | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ---------- materiales ----------

/** Partícula esférica sombreada (por defecto TiO₂ anatasa). */
export function particula({ d = 80, relleno = C.tio2.relleno, sombra = C.tio2.sombra, titulo = 'TiO₂ particle' } = {}) {
  const g = uid('par'), r = d / 2;
  return svg(d, d, `<defs><radialGradient id="${g}" cx="35%" cy="32%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset="0.35" stop-color="${relleno}"/><stop offset="1" stop-color="${sombra}"/></radialGradient></defs>
<circle cx="${r}" cy="${r}" r="${r - 1}" fill="url(#${g})" stroke="${sombra}" stroke-width="${r2(d * 0.012)}"/>`, { titulo });
}

/** Nanoesfera porosa formada por partículas (corte 2D), con o sin metal decorando la superficie. */
export function nanoesferaPorosa({ d = 260, particula: dp = 22, porosidad = 0.18, metal = 'Ag', nMetal = 14, semilla = 2022, titulo = 'Porous TiO₂ nanosphere' } = {}) {
  const r = azar(semilla), R = d / 2 - dp * 0.3, g = uid('nsp'), gm = uid('nsm');
  const rp = dp / 2, paso = dp * 0.92, puntos = [];
  for (let y = -R; y <= R; y += paso * 0.87) {
    const fila = Math.round((y + R) / (paso * 0.87));
    for (let x = -R + (fila % 2) * paso / 2; x <= R; x += paso) {
      const jx = x + (r() - 0.5) * dp * 0.25, jy = y + (r() - 0.5) * dp * 0.25;
      if (Math.hypot(jx, jy) > R - rp * 0.4) continue;
      if (r() < porosidad && Math.hypot(jx, jy) < R - dp) continue; // poros interiores
      puntos.push([jx, jy]);
    }
  }
  puntos.sort((a, b) => a[1] - b[1]);
  let cuerpo = `<defs><radialGradient id="${g}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset="0.4" stop-color="${C.tio2.relleno}"/><stop offset="1" stop-color="${C.tio2.sombra}"/></radialGradient>`;
  const M = metal === 'Au' ? C.au : C.ag;
  cuerpo += `<radialGradient id="${gm}" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="${M.claro}"/><stop offset="0.45" stop-color="${M.medio}"/><stop offset="1" stop-color="${M.oscuro}"/></radialGradient></defs>`;
  cuerpo += `<circle cx="${d / 2}" cy="${d / 2}" r="${R}" fill="${C.tio2.sombra}" opacity="0.35"/>`;
  for (const [x, y] of puntos) cuerpo += `<circle cx="${r2(d / 2 + x)}" cy="${r2(d / 2 + y)}" r="${r2(rp * (0.88 + r() * 0.24))}" fill="url(#${g})" stroke="${C.tio2.sombra}" stroke-width="0.6"/>`;
  if (metal) {
    const borde = puntos.filter(([x, y]) => Math.hypot(x, y) > R - dp * 1.4);
    for (let i = 0; i < nMetal && borde.length; i++) {
      const [x, y] = borde.splice(Math.floor(r() * borde.length), 1)[0];
      const k = (Math.hypot(x, y) + rp * 0.6) / Math.hypot(x, y);
      cuerpo += `<circle cx="${r2(d / 2 + x * k)}" cy="${r2(d / 2 + y * k)}" r="${r2(dp * 0.22)}" fill="url(#${gm})"/>`;
    }
  }
  return svg(d, d, cuerpo, { titulo });
}

/** Nanopartícula metálica plasmónica (Ag o Au), con halo opcional. */
export function nanoparticulaMetal({ d = 60, metal = 'Ag', halo = true, titulo } = {}) {
  const M = metal === 'Au' ? C.au : C.ag, g = uid('met'), gh = uid('halo'), c = d / 2;
  return svg(d, d, `<defs><radialGradient id="${g}" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="${M.claro}"/><stop offset="0.45" stop-color="${M.medio}"/><stop offset="1" stop-color="${M.oscuro}"/></radialGradient>
<radialGradient id="${gh}"><stop offset="0.45" stop-color="${M.halo}" stop-opacity="0.7"/><stop offset="1" stop-color="${M.halo}" stop-opacity="0"/></radialGradient></defs>
${halo ? `<circle cx="${c}" cy="${c}" r="${c}" fill="url(#${gh})"/>` : ''}<circle cx="${c}" cy="${c}" r="${c * (halo ? 0.55 : 0.96)}" fill="url(#${g})"/>`, { titulo: titulo ?? `${metal} nanoparticle` });
}

/** Molécula de agua (O rojo, dos H blancos). */
export function moleculaAgua({ d = 60, titulo = 'H₂O' } = {}) {
  const a = C.atomos, c = d / 2;
  return svg(d, d, `<g stroke="${C.linea}" stroke-width="${r2(d * 0.02)}">
<circle cx="${r2(c - d * 0.27)}" cy="${r2(c + d * 0.17)}" r="${r2(d * 0.15)}" fill="${a.H}"/><circle cx="${r2(c + d * 0.27)}" cy="${r2(c + d * 0.17)}" r="${r2(d * 0.15)}" fill="${a.H}"/>
<circle cx="${c}" cy="${r2(c - d * 0.05)}" r="${r2(d * 0.25)}" fill="${a.O}"/></g>`, { titulo });
}

// ---------- especies y cargas ----------

const ESPECIES = { electron: C.electron, hueco: C.hueco, oh: C.oh, superoxido: C.superoxido };
/** Carga o especie: disco de color + símbolo (e⁻, h⁺, •OH, O₂•⁻). El símbolo es obligatorio (daltonismo). */
export function especie({ tipo = 'electron', d = 44, borde = true } = {}) {
  const e = ESPECIES[tipo], c = d / 2;
  const fs = d * (e.simbolo.length > 2 ? 0.3 : 0.42);
  return svg(d, d, `<circle cx="${c}" cy="${c}" r="${c - 1.5}" fill="${e.relleno}"${borde ? ` stroke="#ffffff" stroke-width="${r2(d * 0.05)}"` : ''}/>
<text x="${c}" y="${r2(c + fs * 0.36)}" text-anchor="middle" font-family="${FUENTE_REVISTA}" font-weight="700" font-size="${r2(fs)}" fill="${e.texto}">${e.simbolo}</text>`, { titulo: e.simbolo });
}

// ---------- luz y energía ----------

/** Fotón: onda con punta de flecha. color = un color o 'espectro' (luz blanca/UV-visible). */
export function foton({ largo = 160, alto = 40, ondas = 3.5, color = 'espectro', etiqueta = 'hν', grosor = 3 } = {}) {
  const g = uid('fot'), m = alto / 2, fin = largo - 16;
  let d = `M 4 ${m}`;
  for (let x = 4; x <= fin; x += 2) d += ` L ${x} ${r2(m + Math.sin(((x - 4) / (fin - 4)) * ondas * Math.PI * 2) * (alto * 0.3))}`;
  const trazo = color === 'espectro' ? `url(#${g})` : color;
  const defs = color === 'espectro' ? `<defs><linearGradient id="${g}" x1="0" x2="1">${C.luz.map((c, i) => `<stop offset="${r2(i / (C.luz.length - 1))}" stop-color="${c}"/>`).join('')}</linearGradient></defs>` : '';
  const punta = color === 'espectro' ? C.luz.at(-1) : color;
  return svg(largo, alto + (etiqueta ? 22 : 0), `${defs}<path d="${d}" fill="none" stroke="${trazo}" stroke-width="${grosor}" stroke-linecap="round"/>
<path d="M ${fin - 2} ${m - 8} L ${largo - 2} ${m} L ${fin - 2} ${m + 8} Z" fill="${punta}"/>
${etiqueta ? `<text x="${largo / 2}" y="${alto + 18}" text-anchor="middle" font-family="${FUENTE_REVISTA}" font-style="italic" font-size="16" fill="${C.texto.claro}">${etiqueta}</text>` : ''}`, { titulo: 'light (photon)' });
}

/** Sol (fuente de luz). */
export function sol({ d = 90, color = '#ffc93c' } = {}) {
  const c = d / 2, rr = d * 0.24;
  let rayos = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; rayos += `<line x1="${r2(c + Math.cos(a) * rr * 1.35)}" y1="${r2(c + Math.sin(a) * rr * 1.35)}" x2="${r2(c + Math.cos(a) * rr * 1.85)}" y2="${r2(c + Math.sin(a) * rr * 1.85)}"/>`; }
  return svg(d, d, `<g stroke="${color}" stroke-width="${r2(d * 0.045)}" stroke-linecap="round">${rayos}</g><circle cx="${c}" cy="${c}" r="${rr}" fill="${color}"/>`, { titulo: 'sun' });
}

/** Diagrama de bandas: BC y BV, excitación e⁻ y hueco. etiquetaEg = texto del gap (por defecto sin número: el valor lo da el científico). */
export function diagramaBandas({ ancho = 220, alto = 200, etiquetaEg = 'E<tspan baseline-shift="sub" font-size="9">g</tspan>', conTrampa = false } = {}) {
  const f = FUENTE_REVISTA, cb = C.bandas.conduccion, vb = C.bandas.valencia, xa = ancho * 0.08, wb = ancho * (conTrampa ? 0.55 : 0.84);
  const flecha = uid('fl');
  let s = `<defs><marker id="${flecha}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${C.linea}"/></marker></defs>
<rect x="${xa}" y="${alto * 0.12}" width="${wb}" height="${alto * 0.13}" rx="4" fill="${cb}" fill-opacity="0.22" stroke="${cb}"/>
<text x="${xa + wb / 2}" y="${alto * 0.205}" text-anchor="middle" font-family="${f}" font-size="11" fill="${C.texto.claro}">CB</text>
<rect x="${xa}" y="${alto * 0.75}" width="${wb}" height="${alto * 0.13}" rx="4" fill="${vb}" fill-opacity="0.22" stroke="${vb}"/>
<text x="${xa + wb / 2}" y="${alto * 0.835}" text-anchor="middle" font-family="${f}" font-size="11" fill="${C.texto.claro}">VB</text>
<line x1="${xa + wb * 0.3}" y1="${alto * 0.74}" x2="${xa + wb * 0.3}" y2="${alto * 0.27}" stroke="${C.linea}" stroke-width="1.6" marker-end="url(#${flecha})"/>
<circle cx="${xa + wb * 0.3}" cy="${alto * 0.185}" r="9" fill="${C.electron.relleno}"/><text x="${xa + wb * 0.3}" y="${alto * 0.185 + 3.5}" text-anchor="middle" font-family="${f}" font-weight="700" font-size="9" fill="#fff">e⁻</text>
<circle cx="${xa + wb * 0.3}" cy="${alto * 0.815}" r="9" fill="${C.hueco.relleno}"/><text x="${xa + wb * 0.3}" y="${alto * 0.815 + 3.5}" text-anchor="middle" font-family="${f}" font-weight="700" font-size="9" fill="#fff">h⁺</text>
<text x="${xa + wb * 0.42}" y="${alto * 0.52}" font-family="${f}" font-size="12" fill="${C.texto.secundario}">${etiquetaEg}</text>`;
  if (conTrampa) {
    const xm = xa + wb + ancho * 0.1;
    s += `<rect x="${xm}" y="${alto * 0.2}" width="${ancho * 0.22}" height="${alto * 0.3}" rx="4" fill="${C.ag.medio}"/><text x="${xm + ancho * 0.11}" y="${alto * 0.3}" text-anchor="middle" font-family="${f}" font-size="11" fill="${C.texto.claro}">Ag</text>
<line x1="${xm + 4}" y1="${alto * 0.4}" x2="${xm + ancho * 0.22 - 4}" y2="${alto * 0.4}" stroke="${C.texto.claro}" stroke-dasharray="3 2"/>
<path d="M ${xa + wb} ${alto * 0.185} C ${xa + wb + ancho * 0.06} ${alto * 0.185} ${xm - 10} ${alto * 0.3} ${xm} ${alto * 0.38}" fill="none" stroke="${C.electron.relleno}" stroke-width="1.6" marker-end="url(#${flecha})"/>`;
  }
  return svg(ancho, alto, s, { titulo: 'band diagram' });
}

// ---------- dispositivos y laboratorio ----------

/** Vaso de precipitado con líquido. */
export function vaso({ ancho = 120, alto = 140, nivel = 0.6, liquido = C.agua.relleno } = {}) {
  const x0 = ancho * 0.15, x1 = ancho * 0.85, y0 = alto * 0.08, y1 = alto * 0.95, yl = y1 - (y1 - y0) * nivel;
  return svg(ancho, alto, `<path d="M ${x0} ${yl} L ${x0} ${y1 - 8} Q ${x0} ${y1} ${x0 + 8} ${y1} L ${x1 - 8} ${y1} Q ${x1} ${y1} ${x1} ${y1 - 8} L ${x1} ${yl} Z" fill="${liquido}" opacity="0.85"/>
<path d="M ${x0 - 6} ${y0} L ${x0} ${y0 + 6} L ${x0} ${y1 - 8} Q ${x0} ${y1} ${x0 + 8} ${y1} L ${x1 - 8} ${y1} Q ${x1} ${y1} ${x1} ${y1 - 8} L ${x1} ${y0}" fill="none" stroke="${C.linea}" stroke-width="3" stroke-linejoin="round"/>
${[0.35, 0.5, 0.65].map((k) => `<line x1="${x1 - 14}" y1="${r2(y1 - (y1 - y0) * k)}" x2="${x1}" y2="${r2(y1 - (y1 - y0) * k)}" stroke="${C.linea}" stroke-width="1.5"/>`).join('')}`, { titulo: 'beaker' });
}

/** Par de electrodos sumergidos (genérico; los materiales y la geometría reales los define el científico). */
export function electrodos({ ancho = 140, alto = 170, colorA = '#7b8794', colorB = '#c9a227' } = {}) {
  const s = vaso({ ancho, alto, nivel: 0.55 }).replace(/^<svg[^>]*>|<\/svg>$/g, '').replace(/<title>.*?<\/title>/, '');
  const xa = ancho * 0.36, xb = ancho * 0.6, w = ancho * 0.07;
  return svg(ancho, alto, `${s}<rect x="${xa}" y="${alto * 0.02}" width="${w}" height="${alto * 0.75}" rx="2" fill="${colorA}"/><rect x="${xb}" y="${alto * 0.02}" width="${w}" height="${alto * 0.75}" rx="2" fill="${colorB}"/>`, { titulo: 'electrodes' });
}

/** Chip sensor con señal inalámbrica (genérico, para dispositivos IoT). */
export function chipSensor({ d = 120, color = '#2a3446' } = {}) {
  const c = d / 2, l = d * 0.42;
  let pines = '';
  for (let i = 0; i < 4; i++) { const p = c - l / 2 + (i + 0.5) * (l / 4); pines += `<rect x="${r2(p - 2)}" y="${r2(c - l / 2 - 8)}" width="4" height="8" fill="${C.linea}"/><rect x="${r2(p - 2)}" y="${r2(c + l / 2)}" width="4" height="8" fill="${C.linea}"/><rect x="${r2(c - l / 2 - 8)}" y="${r2(p - 2)}" width="8" height="4" fill="${C.linea}"/><rect x="${r2(c + l / 2)}" y="${r2(p - 2)}" width="8" height="4" fill="${C.linea}"/>`; }
  const ondas = [1, 2, 3].map((k) => `<path d="M ${r2(c + l * 0.55 + k * 7)} ${r2(c - l * 0.75 - k * 7)} a ${k * 9} ${k * 9} 0 0 1 ${k * 9} ${k * 9}" fill="none" stroke="${C.acento}" stroke-width="2.5" stroke-linecap="round"/>`).join('');
  return svg(d, d, `${pines}<rect x="${c - l / 2}" y="${c - l / 2}" width="${l}" height="${l}" rx="6" fill="${color}"/><rect x="${c - l / 4}" y="${c - l / 4}" width="${l / 2}" height="${l / 2}" rx="3" fill="none" stroke="#8a97ab"/>${ondas}`, { titulo: 'sensor chip' });
}

/** Celular (lectura de datos). */
export function celular({ ancho = 70, alto = 130 } = {}) {
  return svg(ancho, alto, `<rect x="3" y="3" width="${ancho - 6}" height="${alto - 6}" rx="12" fill="#1a2333"/><rect x="9" y="16" width="${ancho - 18}" height="${alto - 34}" rx="4" fill="#e8eef8"/>
<polyline points="${[0, 0.25, 0.45, 0.6, 0.8, 1].map((k, i) => `${r2(14 + k * (ancho - 28))},${r2(alto * 0.62 - [0, 18, 8, 26, 14, 30][i])}`).join(' ')}" fill="none" stroke="${C.acento}" stroke-width="2.5"/>
<circle cx="${ancho / 2}" cy="${alto - 10}" r="3" fill="#5a6578"/>`, { titulo: 'phone' });
}

/** Cápsula (pictograma genérico de fármaco o antibiótico). */
export function capsula({ ancho = 110, alto = 50, colorA = '#ff6b6b', colorB = '#f2f4f7' } = {}) {
  const r = alto / 2 - 2;
  return svg(ancho, alto, `<g stroke="${C.linea}" stroke-width="2"><path d="M ${ancho / 2} 2 L ${2 + r} 2 A ${r} ${r} 0 0 0 ${2 + r} ${alto - 2} L ${ancho / 2} ${alto - 2} Z" fill="${colorA}"/><path d="M ${ancho / 2} 2 L ${ancho - 2 - r} 2 A ${r} ${r} 0 0 1 ${ancho - 2 - r} ${alto - 2} L ${ancho / 2} ${alto - 2} Z" fill="${colorB}"/></g>`, { titulo: 'drug capsule' });
}

// ---------- composición ----------

/** Flecha de proceso (paso de una etapa a otra). */
export function flechaProceso({ largo = 120, grosor = 16, color = C.acento } = {}) {
  const h = grosor * 2.4, m = h / 2;
  return svg(largo, h, `<path d="M 0 ${m - grosor / 2} L ${largo - h * 0.6} ${m - grosor / 2} L ${largo - h * 0.6} 2 L ${largo} ${m} L ${largo - h * 0.6} ${h - 2} L ${largo - h * 0.6} ${m + grosor / 2} L 0 ${m + grosor / 2} Z" fill="${color}"/>`, { titulo: 'arrow' });
}

/** Hito de roadmap: círculo numerado + título + detalle. */
export function hito({ n = 1, titulo = 'Stage', detalle = '', ancho = 220, color = C.acento } = {}) {
  const f = FUENTE_REVISTA;
  return svg(ancho, 110, `<circle cx="26" cy="26" r="22" fill="${color}"/><text x="26" y="33" text-anchor="middle" font-family="${f}" font-weight="700" font-size="20" fill="#fff">${n}</text>
<text x="58" y="24" font-family="${f}" font-weight="700" font-size="16" fill="${C.texto.claro}">${titulo}</text>
<text x="58" y="44" font-family="${f}" font-size="12.5" fill="${C.texto.secundario}">${detalle}</text>`, { titulo });
}

/** Rótulo con línea guía opcional. */
export function etiqueta({ texto = 'Label', color = C.texto.claro, borde = C.linea, fs = 14 } = {}) {
  const w = Math.round(texto.length * fs * 0.56 + 24), h = Math.round(fs * 2);
  return svg(w, h, `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${h / 2 - 1}" fill="#ffffff" stroke="${borde}"/><text x="${w / 2}" y="${r2(h / 2 + fs * 0.35)}" text-anchor="middle" font-family="${FUENTE_REVISTA}" font-size="${fs}" fill="${color}">${texto}</text>`, { titulo: texto });
}

/** Lista de componentes (para el catálogo y el exportador). id = clave en biblioteca/registro.json. */
export const COMPONENTES_2D = [
  { id: '2d/particula-tio2', fn: () => particula() },
  { id: '2d/nanoesfera-porosa-ag', fn: () => nanoesferaPorosa() },
  { id: '2d/nanoparticula-ag', fn: () => nanoparticulaMetal({ metal: 'Ag' }) },
  { id: '2d/nanoparticula-au', fn: () => nanoparticulaMetal({ metal: 'Au' }) },
  { id: '2d/molecula-agua', fn: () => moleculaAgua() },
  { id: '2d/especie-electron', fn: () => especie({ tipo: 'electron' }) },
  { id: '2d/especie-hueco', fn: () => especie({ tipo: 'hueco' }) },
  { id: '2d/especie-oh', fn: () => especie({ tipo: 'oh' }) },
  { id: '2d/especie-superoxido', fn: () => especie({ tipo: 'superoxido' }) },
  { id: '2d/diagrama-bandas', fn: () => diagramaBandas() },
  { id: '2d/diagrama-bandas-trampa-ag', fn: () => diagramaBandas({ conTrampa: true, ancho: 300 }) },
  { id: '2d/foton-uv-visible', fn: () => foton() },
  { id: '2d/sol', fn: () => sol() },
  { id: '2d/vaso', fn: () => vaso() },
  { id: '2d/electrodos', fn: () => electrodos() },
  { id: '2d/chip-sensor', fn: () => chipSensor() },
  { id: '2d/celular', fn: () => celular() },
  { id: '2d/capsula', fn: () => capsula() },
  { id: '2d/flecha-proceso', fn: () => flechaProceso() },
  { id: '2d/hito-roadmap', fn: () => hito({ n: 1, titulo: 'Electrode synthesis', detalle: 'Year 1' }) },
  { id: '2d/etiqueta', fn: () => etiqueta({ texto: 'Ag nanoparticle' }) },
];
