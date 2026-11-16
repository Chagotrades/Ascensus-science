// Moléculas bola-y-varilla desde un archivo SDF (MOL V2000), p. ej. el
// confórmero 3D de PubChem. Coordenadas reales, no dibujadas a mano.
//
//   const datos = parsearSDF(await (await fetch('ceftiofur.sdf')).text());
//   const mol = crearMolecula(datos, { escala: 4, fragmentos: 4 });
//   escena.add(mol.grupo);  mol.degradar(0..1);  mol.opacidad(0..1);
//
// Unidades de salida: nm (las coordenadas SDF vienen en Å) × `escala`.
// `escala` > 1 agranda la molécula para que se vea junto a objetos de
// cientos de nm: SIEMPRE decirlo en pantalla ("no a escala").
import * as THREE from 'three';
import { azar, easeOut, clamp } from './util.js';

export const CPK = {
  H: '#f2f4f7', C: '#5b6472', N: '#3d6bff', O: '#ff3b3b', S: '#ffd23f', Na: '#ab5cf2', Cl: '#1ff01f', F: '#90e050', P: '#ff8000',
};
const RADIO_COV = { H: 0.31, C: 0.76, N: 0.71, O: 0.66, S: 1.05, Na: 1.66, Cl: 1.02, F: 0.57, P: 1.07 }; // Å

/** Lee el primer bloque MOL V2000 de un SDF. */
export function parsearSDF(texto) {
  const l = texto.split(/\r?\n/);
  const na = parseInt(l[3].slice(0, 3)), nb = parseInt(l[3].slice(3, 6));
  const atomos = [], enlaces = [];
  for (let i = 0; i < na; i++) {
    const s = l[4 + i];
    atomos.push({ x: +s.slice(0, 10), y: +s.slice(10, 20), z: +s.slice(20, 30), el: s.slice(31, 34).trim() });
  }
  for (let i = 0; i < nb; i++) {
    const s = l[4 + na + i];
    enlaces.push({ a: parseInt(s.slice(0, 3)) - 1, b: parseInt(s.slice(3, 6)) - 1, orden: parseInt(s.slice(6, 9)) });
  }
  const nombre = l[0].trim();
  return { nombre, atomos, enlaces };
}

/** Fórmula molecular (Hill) a partir de los átomos. */
export function formula({ atomos }) {
  const c = {}; atomos.forEach((a) => (c[a.el] = (c[a.el] || 0) + 1));
  const orden = Object.keys(c).sort((a, b) => (a === 'C' ? -1 : b === 'C' ? 1 : a === 'H' ? -1 : b === 'H' ? 1 : a.localeCompare(b)));
  return orden.map((e) => e + (c[e] > 1 ? c[e] : '')).join('');
}

// Une geometrías ya transformadas en una sola (posición, normal, color).
function unir(partes) {
  let nv = 0, ni = 0; partes.forEach((p) => { nv += p.attributes.position.count; ni += p.index.count; });
  const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), col = new Float32Array(nv * 3), idx = new Uint32Array(ni);
  let ov = 0, oi = 0;
  for (const p of partes) {
    pos.set(p.attributes.position.array, ov * 3); nor.set(p.attributes.normal.array, ov * 3); col.set(p.attributes.color.array, ov * 3);
    const ix = p.index.array; for (let i = 0; i < ix.length; i++) idx[oi + i] = ix[i] + ov;
    ov += p.attributes.position.count; oi += ix.length; p.dispose();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  g.computeBoundingSphere();
  return g;
}
function pintar(g, color) {
  const c = new THREE.Color(color), n = g.attributes.position.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g;
}

export function crearMolecula(datos, {
  escala = 1,
  radioAtomo = 0.5,       // × radio covalente
  radioEnlace = 0.2,      // Å
  ocultarH = false,
  fragmentos = 1,          // >1 parte la molécula en trozos para animar su degradación (ilustrativo)
  segmentos = 12,
  semilla = 3,
} = {}) {
  const r = azar(semilla), k = 0.1 * escala; // Å → nm × escala
  const atomos = datos.atomos.map((a, i) => ({ ...a, i, p: new THREE.Vector3(a.x, a.y, a.z) }));
  const centro = atomos.reduce((s, a) => s.add(a.p), new THREE.Vector3()).divideScalar(atomos.length);
  atomos.forEach((a) => a.p.sub(centro));
  const visibles = atomos.filter((a) => !(ocultarH && a.el === 'H'));

  // Fragmentos: k-means simple sobre los átomos pesados (los H siguen a su vecino).
  const grupoDe = new Array(atomos.length).fill(0);
  if (fragmentos > 1) {
    const pesados = atomos.filter((a) => a.el !== 'H');
    let cs = Array.from({ length: fragmentos }, () => pesados[Math.floor(r() * pesados.length)].p.clone());
    for (let it = 0; it < 12; it++) {
      const suma = cs.map(() => [new THREE.Vector3(), 0]);
      pesados.forEach((a) => { let mi = 0, md = Infinity; cs.forEach((c, j) => { const d = c.distanceToSquared(a.p); if (d < md) { md = d; mi = j; } }); grupoDe[a.i] = mi; suma[mi][0].add(a.p); suma[mi][1]++; });
      cs = suma.map(([s, n], j) => (n ? s.divideScalar(n) : cs[j]));
    }
    datos.enlaces.forEach(({ a, b }) => { if (atomos[a].el === 'H') grupoDe[a] = grupoDe[b]; if (atomos[b].el === 'H') grupoDe[b] = grupoDe[a]; });
  }

  const nf = Math.max(1, fragmentos);
  const partes = Array.from({ length: nf }, () => []);
  const esf = new THREE.SphereGeometry(1, segmentos, Math.round(segmentos * 0.75));
  const cil = new THREE.CylinderGeometry(1, 1, 1, Math.max(6, segmentos - 4), 1, true);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), arriba = new THREE.Vector3(0, 1, 0);

  visibles.forEach((a) => {
    const g = esf.clone(); const rad = (RADIO_COV[a.el] ?? 0.8) * radioAtomo * k;
    g.applyMatrix4(m.compose(a.p.clone().multiplyScalar(k), q.identity(), new THREE.Vector3(rad, rad, rad)));
    partes[grupoDe[a.i]].push(pintar(g, CPK[a.el] ?? '#ff66cc'));
  });
  datos.enlaces.forEach(({ a, b, orden }) => {
    const A = atomos[a], B = atomos[b];
    if (ocultarH && (A.el === 'H' || B.el === 'H')) return;
    if (grupoDe[a] !== grupoDe[b]) return; // enlace que se rompe al degradar
    const pa = A.p.clone().multiplyScalar(k), pb = B.p.clone().multiplyScalar(k);
    const dir = pb.clone().sub(pa), largo = dir.length(); dir.normalize();
    q.setFromUnitVectors(arriba, dir);
    const desplaz = orden >= 2 ? [-1, 1] : [0];
    const perp = new THREE.Vector3().crossVectors(dir, Math.abs(dir.y) < 0.9 ? arriba : new THREE.Vector3(1, 0, 0)).normalize();
    for (const d of desplaz) {
      const off = perp.clone().multiplyScalar(d * radioEnlace * k * 1.4);
      const rr = radioEnlace * k * (orden >= 2 ? 0.75 : 1);
      // mitad del color de cada átomo
      [[pa, A.el], [pb, B.el]].forEach(([p0], h) => {
        const g = cil.clone();
        const medio = pa.clone().lerp(pb, h ? 0.75 : 0.25).add(off);
        g.applyMatrix4(m.compose(medio, q, new THREE.Vector3(rr, largo / 2, rr)));
        partes[grupoDe[a]].push(pintar(g, CPK[h ? B.el : A.el] ?? '#ccc'));
      });
    }
  });

  const grupo = new THREE.Group();
  const trozos = partes.map((ps) => {
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.35, metalness: 0.05, transparent: true });
    const malla = new THREE.Mesh(ps.length ? unir(ps) : new THREE.BufferGeometry(), mat);
    const c = new THREE.Vector3(); let n = 0;
    atomos.forEach((a, i) => { if (grupoDe[i] === partes.indexOf(ps)) { c.add(a.p); n++; } });
    const dir = (n ? c.divideScalar(n) : new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5)).normalize();
    const giro = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize();
    grupo.add(malla);
    return { malla, mat, dir, giro };
  });
  esf.dispose(); cil.dispose();

  const radio = visibles.reduce((mx, a) => Math.max(mx, a.p.length()), 0) * k;
  let opac = 1, prog = 0;
  function aplicar() {
    trozos.forEach((t) => { t.mat.opacity = opac * (1 - clamp((prog - 0.45) / 0.55)); t.mat.depthWrite = t.mat.opacity > 0.98; t.malla.visible = t.mat.opacity > 0.01; });
  }

  return {
    grupo, radio, formula: formula(datos), nAtomos: atomos.length,
    /** 0 = intacta, 1 = trozos alejados y desvanecidos (ilustrativo, no los productos reales). */
    degradar(p) {
      prog = clamp(p);
      const e = easeOut(prog);
      trozos.forEach((t) => { t.malla.position.copy(t.dir).multiplyScalar(e * radio * 1.6); t.malla.setRotationFromAxisAngle(t.giro, e * 1.4); });
      aplicar();
    },
    opacidad(v) { opac = clamp(v); aplicar(); },
    liberar() { trozos.forEach((t) => { t.malla.geometry.dispose(); t.mat.dispose(); }); },
  };
}
