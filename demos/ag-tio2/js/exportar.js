// Entregables de la demo Ag-TiO₂, generados desde la misma escena.
//   ?exportar=video     → entregas/ag-tio2/video-mecanismo.mp4 (1920×1080, ~49 s)
//   ?exportar=figura    → figura del mecanismo con rótulos + versión limpia + render de la esfera
//   ?exportar=carrusel  → láminas 1080×1350 para LinkedIn
//   ?exportar=abstract  → graphical abstract formato Elsevier (2656×1062, 2× el mínimo)
// Textos en inglés (cara al cliente). Datos: solo los del resumen del paper.
import * as THREE from 'three';
import { guardar, aPNG, grabarMP4, lineas, rectRedondeado, fondoMarca, fuentesListas } from '../../../biblioteca/js/exportador.js';

const CARPETA = 'entregas/ag-tio2';
const REF = 'Based on J. Ind. Eng. Chem. 105 (2022) 384–392 · doi:10.1016/j.jiec.2021.09.038';
const MARCA = 'Visual: Ascensus Science Visuals';
const COL = { e: '#3da5ff', h: '#ff9f1c', oh: '#ff4d6d', o2: '#22c3a6', ag: '#dfe6f0', texto: '#e8eef8', texto2: '#9fb0c8', acento: '#7cc4ff' };

const estado = (txt) => { document.title = txt; window.EXPORT_ESTADO = txt; console.log('[exportar]', txt); };

export async function iniciar(D, modo, params) {
  document.body.classList.add('exportando');
  await fuentesListas();
  window.EXPORT_ESTADO = 'iniciando';
  try {
    const tareas = { video, figura, carrusel, abstract };
    const lista = modo === 'todo' ? Object.keys(tareas) : modo.split(',');
    const hechos = [];
    for (const m of lista) hechos.push(...(await tareas[m](D, params)));
    estado('listo: ' + hechos.join(', '));
  } catch (e) { estado('error: ' + e.message); console.error(e); }
}

// ---------- utilidades ----------
function lienzo(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function proyectar(D, p, w, h) { const v = p.clone().project(D.camara); return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, z: v.z }; }
/** Prepara la escena en un paso e instante, sin transición. */
function posar(D, paso, t, w, h, encuadre) {
  D.exportar(w, h, encuadre);
  D.irA(paso, { instantaneo: true });
  D.t = t;
  D.cuadro(0);
}
function chip(ctx, x, y, color, simbolo, texto, esc = 1) {
  ctx.save();
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, 13 * esc, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = `700 ${simbolo.length > 2 ? 8.5 * esc : 11 * esc}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(simbolo, x, y + 0.5 * esc);
  ctx.fillStyle = COL.texto; ctx.font = `500 ${17 * esc}px Inter`; ctx.textAlign = 'left'; ctx.fillText(texto, x + 24 * esc, y + 1);
  ctx.restore();
}
function leyenda(ctx, x, y, esc = 1, items = [['e', 'e⁻', 'Electron'], ['h', 'h⁺', 'Hole'], ['oh', '•OH', 'Hydroxyl radical'], ['ag', '', 'Ag nanoparticle']]) {
  ctx.save();
  const alto = items.length * 34 * esc + 22 * esc, ancho = 230 * esc;
  ctx.fillStyle = 'rgba(9,18,36,.72)'; rectRedondeado(ctx, x - ancho, y, ancho, alto, 14 * esc); ctx.fill();
  ctx.strokeStyle = 'rgba(160,190,230,.16)'; ctx.stroke();
  items.forEach(([k, s, t], i) => {
    const cy = y + 28 * esc + i * 34 * esc, cx = x - ancho + 28 * esc;
    if (k === 'ag') {
      const g = ctx.createRadialGradient(cx - 4 * esc, cy - 4 * esc, 1, cx, cy, 13 * esc);
      g.addColorStop(0, '#fff'); g.addColorStop(0.5, '#c7ced9'); g.addColorStop(1, '#6d7685');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 12 * esc, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = COL.texto; ctx.font = `500 ${17 * esc}px Inter`; ctx.textBaseline = 'middle'; ctx.fillText(t, cx + 24 * esc, cy + 1);
    } else chip(ctx, cx, cy, COL[k], s, t, esc);
  });
  ctx.restore();
}
function barras(ctx, x, y, ancho, esc = 1, progreso = 1) {
  const filas = [['Porous Ag–TiO₂ nanospheres', 0.92, ['#3da5ff', '#7cc4ff']], ['Ag on commercial TiO₂ (P25)', 0.71, ['#6b7c95', '#6b7c95']]];
  filas.forEach(([nom, v, [c1, c2]], i) => {
    const yy = y + i * 74 * esc;
    ctx.fillStyle = '#cdd8e8'; ctx.font = `500 ${19 * esc}px Inter`; ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
    ctx.fillText(nom, x, yy);
    const pista = ancho - 90 * esc;
    ctx.fillStyle = 'rgba(255,255,255,.08)'; rectRedondeado(ctx, x, yy + 12 * esc, pista, 16 * esc, 8 * esc); ctx.fill();
    const g = ctx.createLinearGradient(x, 0, x + pista, 0); g.addColorStop(0, c1); g.addColorStop(1, c2);
    const p = Math.min(1, Math.max(0, progreso * 1.25 - i * 0.25));
    ctx.fillStyle = g; rectRedondeado(ctx, x, yy + 12 * esc, Math.max(16 * esc, pista * v * p), 16 * esc, 8 * esc); ctx.fill();
    ctx.fillStyle = COL.texto; ctx.font = `700 ${28 * esc}px Inter`; ctx.textAlign = 'right';
    ctx.fillText(`${Math.round(v * 100 * p)}%`, x + ancho, yy + 28 * esc);
    ctx.textAlign = 'left';
  });
}
function marcaPie(ctx, w, h, esc = 1, ref = true) {
  ctx.save(); ctx.fillStyle = COL.texto2; ctx.font = `500 ${14 * esc}px Inter`; ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'right'; ctx.fillText(MARCA, w - 28 * esc, h - 24 * esc);
  if (ref) { ctx.textAlign = 'left'; ctx.fillText(REF, 28 * esc, h - 24 * esc); }
  ctx.restore();
}

// ---------- 1) video ----------
const GUION = [
  { paso: 0, dur: 6, kicker: 'The problem', txt: 'Antibiotics such as ceftiofur persist in wastewater.' },
  { paso: 1, dur: 7.5, kicker: 'The material', txt: 'Porous anatase TiO₂ nanospheres (~250 nm), built from ~10 nm particles and decorated with 3–4 nm silver.' },
  { paso: 3, dur: 7, kicker: 'Light', txt: 'Light creates electron–hole pairs in TiO₂. On their own, most of them recombine.', leyenda: true },
  { paso: 4, dur: 7, kicker: 'Silver', txt: 'Silver nanoparticles trap the electrons, so the holes survive long enough to react.', leyenda: true },
  { paso: 5, dur: 6.5, kicker: 'Radicals', txt: 'Holes oxidize water into hydroxyl radicals (•OH).', leyenda: true },
  { paso: 6, dur: 7, kicker: 'Degradation', txt: '•OH breaks ceftiofur down into smaller, non-toxic products.', leyenda: true },
  { paso: 7, dur: 7.5, kicker: 'Result', txt: 'Ceftiofur oxidized after 90 min of white light', barras: true },
  { fin: true, dur: 4.5 },
];

async function video(D, params) {
  const w = +(params.get('w') || 1920), h = +(params.get('h') || 1080), fps = +(params.get('fps') || 30), esc = h / 1080;
  const total = GUION.reduce((s, g) => s + g.dur, 0);
  const [comp, ctx] = lienzo(w, h);
  // contenido corrido a la derecha y arriba: el subtítulo vive abajo a la izquierda
  D.exportar(w, h, { ox: -0.12 * w, oy: 0.05 * h, fw: 0.72, fh: 0.8 });
  D.irA(0, { instantaneo: true }); D.t = 2;
  let actual = -1;
  // ?cuadros=10,40 guarda esos instantes como PNG (control de calidad sin decodificar el MP4)
  const control = (params.get('cuadros') || '').split(',').filter(Boolean).map((x) => Math.round(+x * fps));
  const pendientes = [];
  const blob = await grabarMP4({
    canvas: comp, fps, duracion: total,
    bitrate: +(params.get('mbps') || 14) * 1e6,
    alProgreso: (p) => estado(`video ${Math.round(p * 100)}%`),
    dibujar: (k, tt) => {
      let acum = 0, i = 0;
      while (i < GUION.length - 1 && tt >= acum + GUION[i].dur) { acum += GUION[i].dur; i++; }
      const g = GUION[i], tl = tt - acum;
      if (i !== actual) { actual = i; if (!g.fin) D.irA(g.paso); }
      D.cuadro(1 / fps);
      fondoMarca(ctx, w, h);
      ctx.drawImage(D.renderer.domElement, 0, 0, w, h);

      if (g.fin) {
        const a = Math.min(1, tl / 0.8);
        ctx.fillStyle = `rgba(5,10,20,${0.88 * a})`; ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = COL.acento; ctx.font = `500 ${22 * esc}px "JetBrains Mono"`; ctx.fillText('INTERACTIVE PAPER', w / 2, h * 0.36);
        ctx.fillStyle = COL.texto; ctx.font = `650 ${52 * esc}px Inter`;
        lineas(ctx, 'Photocatalytic oxidation of ceftiofur with porous Ag–TiO₂ nanospheres', w * 0.7).forEach((l, j) => ctx.fillText(l, w / 2, h * 0.36 + (78 + j * 64) * esc));
        ctx.fillStyle = COL.texto2; ctx.font = `400 ${24 * esc}px Inter`;
        ctx.fillText('J. Ind. Eng. Chem. 105 (2022) 384–392 · doi:10.1016/j.jiec.2021.09.038', w / 2, h * 0.36 + 260 * esc);
        ctx.fillText(MARCA, w / 2, h * 0.36 + 300 * esc);
        ctx.globalAlpha = 1; ctx.textAlign = 'left';
        if (control.includes(k)) pendientes.push(aPNG(comp).then((b) => guardar(`${CARPETA}/control/video-${(k / fps).toFixed(1)}s.png`, b)));
        return;
      }
      // subtítulo (entra y sale con fundido)
      const a = Math.min(1, tl / 0.6, (g.dur - tl) / 0.5);
      ctx.save(); ctx.globalAlpha = Math.max(0, a);
      const x = 64 * esc, anchoTxt = 980 * esc;
      ctx.font = `600 ${40 * esc}px Inter`;
      const ls = g.barras ? [g.txt] : lineas(ctx, g.txt, anchoTxt);
      const altoCaja = (g.barras ? 250 : 70 + ls.length * 52) * esc;
      const y0 = h - 70 * esc - altoCaja;
      ctx.fillStyle = 'rgba(5,10,20,.66)'; rectRedondeado(ctx, x - 28 * esc, y0 - 24 * esc, anchoTxt + 56 * esc, altoCaja + 24 * esc, 18 * esc); ctx.fill();
      ctx.fillStyle = COL.acento; ctx.font = `500 ${18 * esc}px "JetBrains Mono"`; ctx.fillText(g.kicker.toUpperCase(), x, y0 + 16 * esc);
      if (g.barras) {
        ctx.fillStyle = COL.texto2; ctx.font = `500 ${22 * esc}px Inter`; ctx.fillText(g.txt, x, y0 + 54 * esc);
        barras(ctx, x, y0 + 104 * esc, anchoTxt, esc, Math.min(1, tl / 2.2));
      } else {
        ctx.fillStyle = COL.texto; ctx.font = `600 ${40 * esc}px Inter`;
        ls.forEach((l, j) => ctx.fillText(l, x, y0 + (66 + j * 52) * esc));
      }
      ctx.restore();
      if (g.leyenda) { ctx.globalAlpha = Math.max(0, a); leyenda(ctx, w - 36 * esc, 36 * esc, esc); ctx.globalAlpha = 1; }
      if ([0, 3, 4, 5, 6].includes(g.paso)) { ctx.fillStyle = '#ffcf7a'; ctx.font = `500 ${15 * esc}px "JetBrains Mono"`; ctx.textAlign = 'right'; ctx.fillText(`Schematic · molecules shown ×${D.CFG.escalaMolecula}`, w - 36 * esc, h - 52 * esc); ctx.textAlign = 'left'; }
      marcaPie(ctx, w, h, esc, false);
      if (control.includes(k)) pendientes.push(aPNG(comp).then((b) => guardar(`${CARPETA}/control/video-${(k / fps).toFixed(1)}s.png`, b)));
    },
  });
  await Promise.all(pendientes);
  const ruta = `${CARPETA}/${params.get('nombre') || 'video-mecanismo'}.mp4`;
  await guardar(ruta, blob);
  return [ruta];
}

// ---------- 2) figura del mecanismo ----------
/** Busca el instante con más especies visibles a la vez (y bien repartidas). */
function mejorInstante(D, paso, w, h) {
  posar(D, paso, 0, w, h);
  let mejor = 0, puntaje = -1;
  for (let t = 0; t < D.CFG.periodo; t += 0.05) {
    D.t = t; D.cuadro(0);
    const n = (pool) => pool.items.filter((s) => s.visible && s.material.opacity > 0.75).length;
    const p = Math.min(n(D.pools.e), n(D.pools.h), n(D.pools.oh)) * 10 + n(D.pools.e) + n(D.pools.h) + n(D.pools.oh);
    if (p > puntaje) { puntaje = p; mejor = t; }
  }
  return mejor;
}

async function figura(D, params) {
  const w = +(params.get('w') || 3600), h = +(params.get('h') || 2400), esc = h / 1080;
  const salidas = [];
  // la escena ocupa el centro; los rótulos van en los márgenes
  const encuadre = { fw: 0.62, fh: 0.8, oy: -0.02 * h };
  const t = params.has('t') ? +params.get('t') : mejorInstante(D, 6, w, h);
  D.exportar(w, h, encuadre); D.irA(6, { instantaneo: true }); D.t = t; D.cuadro(0);
  const [c, ctx] = lienzo(w, h);
  fondoMarca(ctx, w, h);
  ctx.drawImage(D.renderer.domElement, 0, 0);
  salidas.push(await guardar(`${CARPETA}/figura-mecanismo-limpia.png`, await aPNG(c)));

  // Bandas oscuras arriba y abajo para el título y la referencia
  let g = ctx.createLinearGradient(0, 0, 0, h * 0.2); g.addColorStop(0, 'rgba(5,10,20,.95)'); g.addColorStop(1, 'rgba(5,10,20,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h * 0.2);
  g = ctx.createLinearGradient(0, h * 0.88, 0, h); g.addColorStop(0, 'rgba(5,10,20,0)'); g.addColorStop(1, 'rgba(5,10,20,.95)');
  ctx.fillStyle = g; ctx.fillRect(0, h * 0.88, w, h * 0.12);

  // Anclas: especies reales del cuadro, en la zona central, lejos de otras especies
  const zona = (p) => p.z < 1 && p.x > w * 0.3 && p.x < w * 0.7 && p.y > h * 0.2 && p.y < h * 0.84;
  const visibles = [D.pools.e, D.pools.h, D.pools.oh, D.pools.o2].flatMap((pl) => pl.items.filter((s) => s.visible && s.material.opacity > 0.3).map((s) => proyectar(D, s.position, w, h)));
  const libre = (p, r = 70 * esc) => visibles.every((q) => q === p || Math.hypot(q.x - p.x, q.y - p.y) > r);
  const usados = [];
  const lejos = (p) => usados.every((q) => Math.hypot(q.x - p.x, q.y - p.y) > 120 * esc);
  const tomar = (cands) => { const p = cands.find((p) => zona(p) && lejos(p)); if (p) usados.push(p); return p; };
  const especie = (pool) => tomar(pool.items.filter((s) => s.visible && s.material.opacity > 0.75).map((s) => proyectar(D, s.position, w, h)).sort((a, b) => Math.hypot(a.x - w / 2, a.y - h / 2) - Math.hypot(b.x - w / 2, b.y - h / 2)));
  const rotulos = [];
  const pe = especie(D.pools.e); if (pe) rotulos.push([pe, 'Electron trapped by Ag', COL.e]);
  const ph = especie(D.pools.h); if (ph) rotulos.push([ph, 'Hole (h⁺) on TiO₂', COL.h]);
  const po = especie(D.pools.oh); if (po) rotulos.push([po, 'Hydroxyl radical (•OH)', COL.oh]);
  const agProy = D.ag.particulas.map((a) => proyectar(D, a.pos, w, h));
  const pag = tomar(D.ag.particulas.map((a) => proyectar(D, a.pos, w, h)).filter((p) => libre(p, 110 * esc)).sort((a, b) => b.y - a.y));
  if (pag) rotulos.push([pag, 'Ag nanoparticle (3–4 nm)', COL.ag]);
  const pm = tomar(D.moleculas.map((m) => proyectar(D, m.posActual, w, h)).sort((a, b) => a.y - b.y));
  if (pm) rotulos.push([pm, 'Ceftiofur (enlarged ×' + D.CFG.escalaMolecula + ')', '#cdd8e8']);
  const pt = tomar(D.esfera.superficie.map((s) => proyectar(D, s.pos, w, h)).filter((p) => p.y > h * 0.62 && libre(p, 140 * esc) && agProy.every((q) => Math.hypot(q.x - p.x, q.y - p.y) > 120 * esc)).sort((a, b) => a.x - b.x));
  if (pt) rotulos.push([pt, 'Anatase TiO₂ (~10 nm)', '#cdd8e8']);
  const geo = D.fotones.objeto.geometry, pos = geo.attributes.position, col = geo.attributes.color;
  let hv = null, bri = 0;
  for (let i = 0; i < pos.count; i++) { const b = col.getX(i) + col.getY(i) + col.getZ(i); const p = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)); if (b > bri && zona(proyectar(D, p, w, h))) { bri = b; hv = p; } }
  if (hv && bri > 0.6) rotulos.push([proyectar(D, hv, w, h), 'Light (hν, UV–visible)', '#b9a5ff']);

  const fs = 24 * esc;
  ctx.font = `600 ${fs}px Inter`;
  const lados = { izq: [], der: [] };
  rotulos.forEach((r) => (r[0].x < w / 2 ? lados.izq : lados.der).push(r));
  // equilibrar: si un lado tiene más de 5, pasar los del centro al otro
  while (lados.izq.length > 5) lados.der.push(lados.izq.sort((a, b) => a[0].x - b[0].x).pop());
  while (lados.der.length > 5) lados.izq.push(lados.der.sort((a, b) => b[0].x - a[0].x).pop());
  for (const [lado, lista] of Object.entries(lados)) {
    lista.sort((a, b) => a[0].y - b[0].y);
    let yMin = h * 0.22;
    lista.forEach(([p, txt, color]) => {
      const tw = ctx.measureText(txt).width, bw = tw + 40 * esc, bh = fs * 1.8;
      const bx = lado === 'izq' ? w * 0.04 : w * 0.96 - bw;
      const by = Math.max(yMin, Math.min(h * 0.84 - bh, p.y - bh / 2));
      yMin = by + bh + 26 * esc;
      ctx.strokeStyle = color; ctx.lineWidth = 2.4 * esc;
      const x0 = lado === 'izq' ? bx + bw : bx, y0 = by + bh / 2, ang = Math.atan2(y0 - p.y, x0 - p.x);
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(p.x + Math.cos(ang) * 22 * esc, p.y + Math.sin(ang) * 22 * esc); ctx.stroke();
      ctx.fillStyle = 'rgba(5,10,20,.86)'; rectRedondeado(ctx, bx, by, bw, bh, 12 * esc); ctx.fill(); ctx.stroke();
      // anillo hueco: marca la especie sin taparla
      ctx.strokeStyle = color; ctx.lineWidth = 3 * esc; ctx.beginPath(); ctx.arc(p.x, p.y, 22 * esc, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = COL.texto; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillText(txt, bx + 20 * esc, by + bh / 2 + 1);
    });
  }
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = COL.texto; ctx.font = `650 ${40 * esc}px Inter`; ctx.textAlign = 'left';
  ctx.fillText('Photocatalytic oxidation of ceftiofur on porous Ag–TiO₂ nanospheres', w * 0.04, 72 * esc);
  ctx.fillStyle = COL.texto2; ctx.font = `400 ${20 * esc}px Inter`;
  ctx.fillText('Schematic mechanism: light → e⁻/h⁺ separation → electron trapping by Ag → •OH formation → oxidation of ceftiofur. Not to scale.', w * 0.04, 110 * esc);
  marcaPie(ctx, w, h, esc * 1.3);
  salidas.push(await guardar(`${CARPETA}/figura-mecanismo.png`, await aPNG(c)));

  // Render de la esfera completa (portada de la página, redes)
  D.exportar(w, h, { fw: 0.9, fh: 0.9 }); D.irA(1, { instantaneo: true }); D.t = 3; D.cuadro(0);
  fondoMarca(ctx, w, h); ctx.drawImage(D.renderer.domElement, 0, 0);
  salidas.push(await guardar(`${CARPETA}/render-nanoesfera.png`, await aPNG(c)));
  estado(`figura t=${t.toFixed(2)}`);
  return salidas;
}

// ---------- 3) carrusel LinkedIn (1080×1350) ----------
const LAMINAS = [
  { paso: 0, t: 2, kicker: 'Paper explained', titulo: 'How do you destroy an antibiotic with light?', txt: 'Ceftiofur, a veterinary antibiotic, persists in wastewater. Here is how porous Ag–TiO₂ nanospheres break it down.' },
  { paso: 1, t: 3, kicker: 'The material', titulo: 'Porous Ag–TiO₂ nanospheres', txt: '~250 nm spheres of ~10 nm anatase particles, decorated with 3–4 nm plasmonic silver.' },
  { paso: 3, t: 1.3, kicker: '1 · Light', titulo: 'Light creates electron–hole pairs', txt: 'On bare TiO₂, most pairs recombine within moments and the energy is lost.', leyenda: true },
  { paso: 4, t: 2.6, kicker: '2 · Silver', titulo: 'Silver traps the electrons', txt: 'With electrons pulled into Ag, the holes survive long enough to react.', leyenda: true },
  { paso: 6, t: 3.9, kicker: '3 · Radicals', titulo: '•OH radicals oxidize the antibiotic', txt: 'Holes turn water into •OH, which breaks ceftiofur into smaller, non-toxic products.', leyenda: true },
  { paso: 7, t: 3, kicker: 'Result', titulo: '92% oxidized in 90 minutes', txt: 'vs 71% with silver on commercial TiO₂.', barras: true },
];
async function carrusel(D, params) {
  const w = 1080, h = 1350, esc = 1;
  const [c, ctx] = lienzo(w, h);
  const salidas = [];
  for (const [i, L] of LAMINAS.entries()) {
    const rh = Math.round(h * (L.barras ? 0.58 : 0.72));
    posar(D, L.paso, L.t, w, rh, L.barras ? { fw: 0.85, fh: 0.85 } : undefined);
    fondoMarca(ctx, w, h, { cy: 0.3 });
    ctx.drawImage(D.renderer.domElement, 0, 0);
    // degradado: el render termina fundido, nunca con un borde duro
    const g = ctx.createLinearGradient(0, rh * 0.72, 0, rh); g.addColorStop(0, 'rgba(5,10,20,0)'); g.addColorStop(1, 'rgba(5,10,20,1)');
    ctx.fillStyle = g; ctx.fillRect(0, rh * 0.72, w, rh * 0.28 + 1); ctx.fillStyle = '#050a14'; ctx.fillRect(0, rh, w, h - rh);
    const x = 72, y0 = rh + 30;
    ctx.fillStyle = COL.acento; ctx.font = '500 22px "JetBrains Mono"'; ctx.fillText(L.kicker.toUpperCase(), x, y0);
    ctx.fillStyle = COL.texto; ctx.font = '650 52px Inter';
    const lt = lineas(ctx, L.titulo, w - 2 * x); lt.forEach((l, j) => ctx.fillText(l, x, y0 + 66 + j * 62));
    let y = y0 + 66 + lt.length * 62 + 6;
    ctx.fillStyle = '#cdd8e8'; ctx.font = '400 30px Inter';
    const lx = lineas(ctx, L.txt, w - 2 * x); lx.forEach((l, j) => ctx.fillText(l, x, y + j * 42)); y += lx.length * 42 + 40;
    if (L.barras) barras(ctx, x, y + 20, w - 2 * x, 1.25);
    if (L.leyenda) leyenda(ctx, w - 36, 36, 0.95);
    ctx.fillStyle = COL.texto2; ctx.font = '500 20px "JetBrains Mono"'; ctx.textAlign = 'right'; ctx.fillText(`${i + 1}/${LAMINAS.length}`, w - 72, h - 56); ctx.textAlign = 'left';
    ctx.font = '500 17px Inter'; ctx.fillText(i === LAMINAS.length - 1 ? 'J. Ind. Eng. Chem. 105 (2022) 384–392 · ' + MARCA : MARCA, x, h - 56);
    salidas.push(await guardar(`${CARPETA}/carrusel/lamina-${i + 1}.png`, await aPNG(c)));
  }
  return salidas;
}

// ---------- 4) graphical abstract (Elsevier: mín. 1328×531, se entrega al doble) ----------
async function abstract(D, params) {
  const w = 2656, h = 1062, esc = 2;
  const [c, ctx] = lienzo(w, h);
  fondoMarca(ctx, w, h, { cx: 0.5, cy: 0.5 });
  const panelW = Math.round(w * 0.3), gap = (w - 3 * panelW) / 4, py = 150, ph = h - 300;
  const paneles = [
    { x: gap, paso: 0, t: 2, tit: 'Antibiotic in water', sub: 'Ceftiofur sodium' },
    { x: gap * 2 + panelW, paso: 6, t: params.has('t') ? +params.get('t') : null, tit: 'Porous Ag–TiO₂ nanospheres + light', sub: 'Ag traps e⁻ → h⁺ form •OH' },
    { x: gap * 3 + panelW * 2, paso: 1, t: 3, tit: '92% oxidized in 90 min', sub: 'vs 71% Ag/P25 · non-toxic products' },
  ];
  for (const P of paneles) {
    const t = P.t ?? mejorInstante(D, P.paso, panelW, ph);
    posar(D, P.paso, t, panelW, ph);
    ctx.save(); rectRedondeado(ctx, P.x, py, panelW, ph, 28); ctx.clip();
    ctx.fillStyle = 'rgba(15,35,70,.35)'; ctx.fillRect(P.x, py, panelW, ph);
    ctx.drawImage(D.renderer.domElement, P.x, py);
    ctx.restore();
    ctx.strokeStyle = 'rgba(160,190,230,.25)'; ctx.lineWidth = 2; rectRedondeado(ctx, P.x, py, panelW, ph, 28); ctx.stroke();
    ctx.fillStyle = COL.texto; ctx.font = '650 46px Inter'; ctx.textAlign = 'center'; ctx.fillText(P.tit, P.x + panelW / 2, py - 44);
    ctx.fillStyle = COL.texto2; ctx.font = '500 34px Inter'; ctx.fillText(P.sub, P.x + panelW / 2, py + ph + 62);
    ctx.textAlign = 'left';
  }
  // resultado: barras sobre el tercer panel
  const P3 = paneles[2];
  ctx.fillStyle = 'rgba(5,10,20,.78)'; rectRedondeado(ctx, P3.x + 30, py + ph - 260, panelW - 60, 230, 20); ctx.fill();
  barras(ctx, P3.x + 60, py + ph - 200, panelW - 120, 1.6);
  // flechas entre paneles
  ctx.fillStyle = COL.acento;
  for (const i of [1, 2]) {
    const ax = gap * i + panelW * i + gap / 2, ay = py + ph / 2;
    ctx.beginPath(); ctx.moveTo(ax - 26, ay - 34); ctx.lineTo(ax + 26, ay); ctx.lineTo(ax - 26, ay + 34); ctx.closePath(); ctx.fill();
  }
  // leyenda mínima en el panel central
  leyenda(ctx, paneles[1].x + panelW - 20, py + 20, 1.5, [['e', 'e⁻', 'Electron'], ['h', 'h⁺', 'Hole'], ['oh', '•OH', '•OH radical']]);
  const [c1] = lienzo(1328, 531); c1.getContext('2d').drawImage(c, 0, 0, 1328, 531);
  return [await guardar(`${CARPETA}/graphical-abstract.png`, await aPNG(c)), await guardar(`${CARPETA}/graphical-abstract-1328x531.png`, await aPNG(c1))];
}
