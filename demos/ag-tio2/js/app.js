// Demo Ag-TiO₂ · nanoesferas porosas que oxidan ceftiofur con luz.
// Escena: 1 unidad = 1 nm. Los procesos son función del tiempo (sin acumular).
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { crearNanoesferaPorosa } from '../../../biblioteca/js/nanoesfera-porosa.js';
import { crearNanoparticulasPlasmonicas } from '../../../biblioteca/js/nanoparticulas-plasmonicas.js';
import { parsearSDF, crearMolecula } from '../../../biblioteca/js/molecula.js';
import { crearFotones, crearPoolSprites, crearDestellos } from '../../../biblioteca/js/particulas-fx.js';
import { azar, clamp, lerp, smooth, fase, easeInOut } from '../../../biblioteca/js/util.js';
import { PASOS } from './pasos.js';

const $ = (s) => document.querySelector(s);
const params = new URLSearchParams(location.search);
const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esMovil = matchMedia('(max-width: 760px)').matches || matchMedia('(pointer: coarse)').matches;

// ---------- parámetros científicos (del paper; ver papers/README.md) ----------
const CFG = {
  diametroEsfera: 250,      // nm
  diametroTiO2: 10,         // nm
  diametroAg: [3, 4],       // nm
  escalaMolecula: 6,        // ×, solo visual (se avisa en pantalla)
  sitios: 8,
  moleculas: 6,
  periodo: 4.6,             // s por ciclo fotón → degradación (visual)
};

// ---------- arranque ----------
function hayWebGL2() { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } }
if (!hayWebGL2()) { $('#cargando').hidden = true; $('#sin-webgl').hidden = false; throw new Error('Sin WebGL 2'); }

const contenedor = $('#lienzo');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, esMovil ? 1.75 : 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.92;
renderer.setClearColor(0x000000, 0);
contenedor.appendChild(renderer.domElement);

const escena = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
escena.environmentIntensity = 0.4;

const camara = new THREE.PerspectiveCamera(38, 1, 0.5, 4000);
const controles = new OrbitControls(camara, renderer.domElement);
controles.enableDamping = true; controles.dampingFactor = 0.08;
controles.minDistance = 12; controles.maxDistance = 900; controles.enablePan = false;

// Luces: llave cálida desde la dirección de la luz incidente + relleno frío.
escena.add(new THREE.HemisphereLight('#a9c4f0', '#0b1426', 0.35));
const llave = new THREE.DirectionalLight('#fff6e8', 1.6); escena.add(llave);
const contra = new THREE.DirectionalLight('#6fa8ff', 0.9); escena.add(contra);

// ---------- geometría de referencia ----------
const F = new THREE.Vector3(0.35, 0.55, 0.76).normalize();          // zona que enfoca el zoom
const T1 = new THREE.Vector3().crossVectors(F, new THREE.Vector3(0, 1, 0)).normalize();
const T2 = new THREE.Vector3().crossVectors(T1, F).normalize();
const R = CFG.diametroEsfera / 2;
const Ps = F.clone().multiplyScalar(R);                               // punto de la superficie enfocado
const L = F.clone().multiplyScalar(0.85).addScaledVector(T2, 0.55).addScaledVector(T1, -0.3).normalize(); // de dónde viene la luz
llave.position.copy(L).multiplyScalar(600);
contra.position.copy(F).multiplyScalar(-400).addScaledVector(T1, 300);

// ---------- objetos ----------
const esfera = crearNanoesferaPorosa({
  diametro: CFG.diametroEsfera, diametroParticula: CFG.diametroTiO2,
  segmentos: esMovil ? 10 : 14, grosorCapa: esMovil ? 60 : null, escalaPoro: 0.1, porosidad: 0.34, color: '#a9b7cc',
});
escena.add(esfera.grupo);

const ag = crearNanoparticulasPlasmonicas({
  superficie: esfera.superficie, cantidad: esMovil ? 150 : 190, diametro: CFG.diametroAg,
  zonaPreferente: { dir: F, peso: 0.14 },
});
escena.add(ag.grupo);

// Sitios de reacción: partículas de TiO₂ expuestas cerca del punto enfocado.
const r = azar(90);
const candidatos = esfera.superficie
  .filter((s) => s.normal.dot(F) > 0.988 && s.pos.length() > R - CFG.diametroTiO2 * 0.9)
  .sort((a, b) => b.normal.dot(F) - a.normal.dot(F));
const sitios = [];
for (const c of candidatos) {
  if (sitios.length >= CFG.sitios) break;
  if (sitios.some((s) => s.pos.distanceTo(c.pos) < 7.5)) continue;
  const tope = c.pos.clone().addScaledVector(c.normal, c.radio * 0.9);
  const iAg = ag.masCercana(tope);
  sitios.push({ ...c, tope, iAg, desf: r() });
}
const brilloAg = new Float32Array(ag.particulas.length);

// Fotones, portadores y especies
const fotones = crearFotones({ cantidad: CFG.sitios, puntos: 64, tam: 2.2, amplitud: 1.1 });
escena.add(fotones.objeto);
const poolE = crearPoolSprites({ simbolo: 'e⁻', color: '#3da5ff', cantidad: CFG.sitios * 2, tam: 3.6 });
const poolH = crearPoolSprites({ simbolo: 'h⁺', color: '#ff9f1c', cantidad: CFG.sitios * 2, tam: 3.6 });
const poolOH = crearPoolSprites({ simbolo: '•OH', color: '#ff4d6d', cantidad: CFG.sitios, tam: 4 });
const poolO2 = crearPoolSprites({ simbolo: 'O₂•⁻', color: '#22c3a6', cantidad: CFG.sitios, tam: 3.6 });
const destRec = crearDestellos({ color: '#ffe2b0', cantidad: CFG.sitios, tam: 7 });
const destAbs = crearDestellos({ color: '#b9a5ff', cantidad: CFG.sitios, tam: 6 });
const destImp = crearDestellos({ color: '#ff8fa3', cantidad: CFG.sitios, tam: 5 });
[poolE, poolH, poolOH, poolO2, destRec, destAbs, destImp].forEach((p) => escena.add(p.grupo));

// Partículas de "agua" (motas) para dar profundidad en los planos cercanos
const motas = (() => {
  const n = 500, pos = new Float32Array(n * 3), rr = azar(5);
  const centro = Ps.clone().addScaledVector(F, 40);
  for (let i = 0; i < n; i++) { pos[i * 3] = centro.x + (rr() - 0.5) * 160; pos[i * 3 + 1] = centro.y + (rr() - 0.5) * 160; pos[i * 3 + 2] = centro.z + (rr() - 0.5) * 160; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({ color: '#7cc4ff', size: 0.35, transparent: true, opacity: 0.35, depthWrite: false });
  const p = new THREE.Points(g, m); escena.add(p); return p;
})();

// Moléculas (se crean al cargar el SDF)
let moleculas = [];
async function cargarMoleculas() {
  const txt = await (await fetch('../../biblioteca/datos/ceftiofur.sdf')).text();
  const datos = parsearSDF(txt);
  moleculas = Array.from({ length: CFG.moleculas }, (_, j) => {
    const mol = crearMolecula(datos, { escala: CFG.escalaMolecula, fragmentos: 4, segmentos: esMovil ? 9 : 12, semilla: 11 + j });
    const s = sitios[j % sitios.length];
    const rr = azar(300 + j);
    const homeAgua = Ps.clone().addScaledVector(F, 68 + (rr() - 0.5) * 24).addScaledVector(T1, (j - (CFG.moleculas - 1) / 2) * 11 + (rr() - 0.5) * 4).addScaledVector(T2, (rr() - 0.5) * 22);
    const homeSup = s.tope.clone().addScaledVector(s.normal, 13 + (j % 3) * 2.5).addScaledVector(T1, (rr() - 0.5) * 4).addScaledVector(T2, (rr() - 0.5) * 4);
    const eje = new THREE.Vector3(rr() - 0.5, rr() - 0.5, rr() - 0.5).normalize();
    escena.add(mol.grupo);
    return { mol, homeAgua, homeSup, eje, f: rr() * 6.28 };
  });
  return datos;
}

// ---------- estado animado (se interpola al cambiar de paso) ----------
const I = { fot: 0, par: 0, trap: 0, oh: 0, deg: 0, mol: 0, molVis: 1, orbita: 0 };
const camPos = new THREE.Vector3(), camTgt = new THREE.Vector3();
let desde = null, hacia = null, tTrans = 1, durTrans = 1.8;
let agActiva = true, Iag = 1;

// Modo exportación (video/figura): tamaño fijo, sin panel. null = navegación normal.
let exportando = null;
const W = () => (exportando ? exportando.w : innerWidth), H = () => (exportando ? exportando.h : innerHeight);
// Distancia de cámara para que un radio `rad` quepa en la zona libre (sin el panel).
function distAjuste(rad) {
  // pestaña oculta al cargar = ventana 0×0 → usar una medida de respaldo en vez de dividir por 0
  const w = W() || 1280, h = H() || 800, panel = document.querySelector('#panel').getBoundingClientRect();
  const libreW = exportando ? w * exportando.fw : w > 760 ? w - panel.right - 20 : w, libreH = exportando ? h * exportando.fh : w > 760 ? h : panel.top - 10;
  const tV = Math.tan(THREE.MathUtils.degToRad(camara.fov / 2)) * (libreH / h);
  const tH = Math.tan(THREE.MathUtils.degToRad(camara.fov / 2)) * (libreW / h);
  return rad / Math.min(tV, tH);
}
const dirLateral = () => T2.clone().multiplyScalar(0.9).addScaledVector(F, 0.3).addScaledVector(T1, 0.15).normalize();
const VISTAS = {
  agua: () => { const t = Ps.clone().addScaledVector(F, 66); return { tgt: t, pos: t.clone().add(dirLateral().multiplyScalar(distAjuste(30))) }; },
  general: () => ({ tgt: new THREE.Vector3(), pos: F.clone().addScaledVector(T1, 0.7).addScaledVector(T2, 0.25).normalize().multiplyScalar(distAjuste(R * 1.12)) }),
  zoom: () => { const t = Ps.clone().addScaledVector(F, 9); return { tgt: t, pos: t.clone().add(F.clone().multiplyScalar(0.82).addScaledVector(T1, 0.5).addScaledVector(T2, 0.28).normalize().multiplyScalar(distAjuste(20))) }; },
  medio: () => { const t = Ps.clone().multiplyScalar(0.55); return { tgt: t, pos: t.clone().add(F.clone().addScaledVector(T1, 0.9).addScaledVector(T2, 0.3).normalize().multiplyScalar(distAjuste(R * 0.95))) }; },
};

let paso = 0, modoLibre = false;
/** Recalcula tamaño y cámara del paso actual sin tocar la interfaz (texto, puntos, etc.). */
function reencuadrar() {
  medir();
  const v = VISTAS[PASOS[paso].vista]();
  camPos.copy(v.pos); camTgt.copy(v.tgt);
  camara.position.copy(v.pos); controles.target.copy(v.tgt);
  if (desde) { desde.pos = v.pos.clone(); desde.tgt = v.tgt.clone(); }
  if (hacia) { hacia.pos = v.pos.clone(); hacia.tgt = v.tgt.clone(); }
}
let tamVisto = '';
function irA(n, { instantaneo = false } = {}) {
  paso = clamp(n, 0, PASOS.length - 1);
  const P = PASOS[paso];
  const v = VISTAS[P.vista]();
  desde = { ...I, pos: camara.position.clone(), tgt: controles.target.clone() };
  hacia = { ...P.I, pos: v.pos, tgt: v.tgt };
  tTrans = instantaneo ? 1 : 0;
  durTrans = P.vista === PASOS[Math.max(0, paso - 1)]?.vista ? 1.2 : 2.2;
  if (instantaneo) aplicarTrans(1);
  modoLibre = false; $('#vista').hidden = true;
  actualizarUI();
}
function aplicarTrans(k) {
  if (!Number.isFinite(desde.pos.x) || !Number.isFinite(desde.tgt.x)) k = 1; // nunca mezclar con una cámara inválida
  const e = easeInOut(k);
  for (const key of Object.keys(hacia)) if (typeof hacia[key] === 'number') I[key] = lerp(desde[key], hacia[key], e);
  if (!modoLibre) {
    if (k >= 1) { camPos.copy(hacia.pos); camTgt.copy(hacia.tgt); }
    else { camPos.lerpVectors(desde.pos, hacia.pos, e); camTgt.lerpVectors(desde.tgt, hacia.tgt, e); }
  }
}

// ---------- Volver ----------
// Visible solo si se llegó desde otra página del mismo sitio (p. ej. la página del investigador)
// o si la URL trae ?volver=<ruta del mismo sitio>. history.back() devuelve al mismo punto de esa página.
(function configurarVolver() {
  const btn = $('#volver');
  let destino = null, usarHistorial = false;
  try {
    const ref = document.referrer ? new URL(document.referrer) : null;
    if (ref && ref.origin === location.origin && ref.pathname !== location.pathname) { destino = ref.href; usarHistorial = history.length > 1; }
    const q = params.get('volver');
    if (!destino && q) { const u = new URL(q, location.href); if (u.origin === location.origin) destino = u.href; }
  } catch { /* referrer o URL inválida */ }
  const mostrar = (url, etiqueta) => {
    btn.href = url; btn.hidden = false;
    document.body.classList.add('con-volver');
    btn.setAttribute('aria-label', etiqueta);
  };
  btn.addEventListener('click', (e) => { if (usarHistorial) { e.preventDefault(); history.back(); } });
  if (destino) return mostrar(destino, 'Back to the previous page');
  // Sin página de origen: si la página de inicio del proyecto existe en este sitio (data-inicio), enlazarla.
  // Donde no existe (p. ej. la demo publicada sola) el botón queda oculto.
  const inicio = btn.dataset.inicio;
  if (!inicio) return;
  const url = new URL(inicio, location.href);
  if (url.origin !== location.origin) return;
  fetch(url, { method: 'HEAD' }).then((r) => { if (r.ok) mostrar(url.href, 'Back to the research page'); }).catch(() => {});
})();

// ---------- UI ----------
const puntos = $('#puntos');
PASOS.forEach((P, i) => { const b = document.createElement('button'); b.className = 'punto'; b.setAttribute('aria-label', `Step ${i + 1}: ${P.titulo}`); b.onclick = () => { parar(); irA(i); }; puntos.appendChild(b); });

function actualizarUI() {
  const P = PASOS[paso];
  $('#paso-num').textContent = `${String(paso + 1).padStart(2, '0')} / ${String(PASOS.length).padStart(2, '0')}`;
  $('#paso-kicker').textContent = P.kicker;
  $('#paso-titulo').textContent = P.titulo;
  const tx = $('#paso-texto'); tx.innerHTML = P.html; tx.classList.remove('entra'); void tx.offsetWidth; tx.classList.add('entra');
  [...puntos.children].forEach((b, i) => (i === paso ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')));
  const res = $('#resultado'); res.hidden = !P.resultado; res.classList.remove('activo'); if (P.resultado) requestAnimationFrame(() => requestAnimationFrame(() => res.classList.add('activo')));
  $('#comparar').hidden = !P.comparar; actualizarNotaComparar();
  const b = $('#bandas'); b.classList.toggle('visible', !!P.bandas); b.dataset.paso = P.bandas ?? ''; document.body.classList.toggle('con-bandas', !!P.bandas);
  document.querySelectorAll('.ley').forEach((el) => el.classList.toggle('apagada', +el.dataset.desde > paso));
  $('#ant').disabled = paso === 0; $('#sig').disabled = paso === PASOS.length - 1;
}
function actualizarNotaComparar() {
  $('#comparar-nota').textContent = agActiva
    ? 'With Ag: electrons are trapped, so holes live long enough to react.'
    : 'Without Ag: most pairs recombine (seen as stronger photoluminescence in the paper).';
  $('#bandas').classList.toggle('sin-ag', !agActiva);
}
$('#sin-ag').addEventListener('change', (e) => { agActiva = !e.target.checked; actualizarNotaComparar(); });

let reproduciendo = !reducido && !params.has('paso'), tPaso = 0;
function parar() { reproduciendo = false; $('#play').textContent = '▶'; $('#play').setAttribute('aria-label', 'Play'); }
function seguir() { reproduciendo = true; tPaso = 0; $('#play').textContent = '❚❚'; $('#play').setAttribute('aria-label', 'Pause'); if (paso === PASOS.length - 1) irA(0); }
if (!reproduciendo) parar();
$('#play').onclick = () => (reproduciendo ? parar() : seguir());
$('#ant').onclick = () => { parar(); irA(paso - 1); };
$('#sig').onclick = () => { parar(); irA(paso + 1); };
$('#vista').onclick = () => irA(paso);
addEventListener('keydown', (e) => {
  if (e.target.closest?.('input, textarea')) return;
  if (e.key === 'ArrowRight') { parar(); irA(paso + 1); }
  if (e.key === 'ArrowLeft') { parar(); irA(paso - 1); }
  if (e.key === ' ') { e.preventDefault(); reproduciendo ? parar() : seguir(); }
  if (e.key === 'Escape') cerrarNotas();
});
controles.addEventListener('start', () => { modoLibre = true; parar(); $('#vista').hidden = false; });

const notas = $('#notas');
function cerrarNotas() { notas.hidden = true; $('#notas-btn').setAttribute('aria-expanded', 'false'); }
$('#notas-btn').onclick = () => { notas.hidden = !notas.hidden; $('#notas-btn').setAttribute('aria-expanded', String(!notas.hidden)); };
$('#notas-cerrar').onclick = cerrarNotas;

// Etiquetas 3D (HTML proyectado)
const capaEtq = $('#etiquetas');
const ETIQUETAS = [];
function etiqueta(html, pos, pasos) {
  const el = document.createElement('div'); el.className = 'etq'; el.innerHTML = `<div class="etq-caja">${html}</div>`;
  capaEtq.appendChild(el); ETIQUETAS.push({ el, pos, pasos });
}

// ---------- tamaño y encuadre (el panel tapa parte de la pantalla) ----------
function medir() {
  const w = W(), h = H();
  if (!w || !h) return; // pestaña oculta: se mide cuando tenga tamaño
  renderer.setSize(w, h, false);
  camara.aspect = w / h;
  if (exportando) { if (exportando.ox || exportando.oy) camara.setViewOffset(w, h, exportando.ox, exportando.oy, w, h); else camara.clearViewOffset(); camara.updateProjectionMatrix(); return; }
  const panel = $('#panel').getBoundingClientRect();
  if (w > 760) camara.setViewOffset(w, h, -(panel.right + 10) / 2 * 0.9, 0, w, h);
  else camara.setViewOffset(w, h, 0, (h - panel.top) / 2 * 0.95, w, h);
  camara.updateProjectionMatrix();
}
new ResizeObserver(medir).observe($('#panel'));
let tResize; addEventListener('resize', () => { if (exportando) return; medir(); clearTimeout(tResize); tResize = setTimeout(() => { if (!modoLibre && hacia) irA(paso, { instantaneo: true }); }, 200); });

// ---------- procesos fotocatalíticos (función del tiempo) ----------
const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3();
const bump = (u, a, b) => { const m = (a + b) / 2; return u < a || u > b ? 0 : u < m ? smooth(a, m, u) : 1 - smooth(m, b, u); };
function arco(a, b, n, alto, k, out) { return out.lerpVectors(a, b, k).addScaledVector(n, Math.sin(Math.PI * k) * alto); }

function procesos(t) {
  brilloAg.fill(0);
  const W = I.trap * Iag; // peso de la rama "Ag atrapa el electrón"
  sitios.forEach((s, i) => {
    const u = fase(t, CFG.periodo, s.desf);
    const n = s.normal;
    // 1) fotón llega
    if (I.fot > 0.01 && u < 0.3) fotones.fijar(i, v1.copy(s.tope).addScaledVector(L, 70), s.tope, u / 0.22, I.fot); else fotones.apagar(i);
    destAbs.fijar(i, s.tope, bump(u, 0.19, 0.34) * I.fot * (1 - I.par * 0.6) * 0.9);

    // 2) par e⁻/h⁺
    const vis = I.par * (u >= 0.22 ? 1 : 0);
    const sep = smooth(0.22, 0.36, u);
    const eSep = v1.copy(s.tope).addScaledVector(n, 2.2 * sep).addScaledVector(T1, 1.6 * sep);
    const hSep = v2.copy(s.tope).addScaledVector(n, -0.6 * sep).addScaledVector(T1, -1.4 * sep);
    const eSepC = eSep.clone(), hSepC = hSep.clone();

    // rama A: recombinación (sin trampa)
    const wA = vis * (1 - W);
    if (wA > 0.01 && u < 0.56) {
      const k = smooth(0.38, 0.52, u);
      const medio = v3.lerpVectors(eSepC, hSepC, 0.5);
      poolE.fijar(i + CFG.sitios, eSep.clone().lerp(medio, k), wA * (1 - smooth(0.5, 0.54, u)));
      poolH.fijar(i + CFG.sitios, hSep.clone().lerp(medio, k), wA * (1 - smooth(0.5, 0.54, u)));
    } else { poolE.fijar(i + CFG.sitios, eSep, 0); poolH.fijar(i + CFG.sitios, hSep, 0); }
    destRec.fijar(i, v3.lerpVectors(eSepC, hSepC, 0.5), bump(u, 0.48, 0.66) * wA);

    // rama B: Ag atrapa el electrón
    const wB = vis * W;
    const a = ag.particulas[s.iAg];
    const sobreAg = v3.copy(a.pos).addScaledVector(a.normal, a.radio + 0.9);
    let pe;
    if (u < 0.36) pe = eSepC.clone();
    else pe = arco(eSepC, sobreAg, n, 3, smooth(0.36, 0.58, u), new THREE.Vector3());
    poolE.fijar(i, pe, wB * (1 - smooth(0.8, 0.86, u)));
    brilloAg[s.iAg] = Math.max(brilloAg[s.iAg], bump(u, 0.52, 0.92) * wB);
    // O₂•⁻ (camino secundario, a validar)
    const kO2 = smooth(0.82, 1.0, u);
    poolO2.fijar(i, sobreAg.clone().addScaledVector(a.normal, 1 + kO2 * 9).addScaledVector(T2, kO2 * 2), wB * I.oh * 0.75 * bump(u, 0.8, 1.0) * 2);

    // h⁺ queda en la superficie y oxida agua → •OH
    const hSup = s.tope.clone().addScaledVector(n, 0.6);
    const ph = u < 0.36 ? hSepC : hSepC.clone().lerp(hSup, smooth(0.36, 0.52, u));
    poolH.fijar(i, ph, wB * (1 - I.oh * smooth(0.58, 0.64, u)) * (1 - smooth(0.86, 0.96, u)));

    const m = moleculas[i];
    const kOH = smooth(0.62, 0.86, u);
    let fin;
    if (m) fin = m.posActual.clone().addScaledVector(n, -m.mol.radio * 0.3);
    else fin = hSup.clone().addScaledVector(n, 10).addScaledVector(T1, 4);
    const pOH = arco(hSup.clone().addScaledVector(n, 1.2), fin, T2, 2, kOH, new THREE.Vector3());
    poolOH.fijar(i, pOH, wB * I.oh * smooth(0.6, 0.64, u) * (1 - smooth(0.86, 0.9, u)) * (m ? 1 : 1 - smooth(0.7, 0.86, u)));
    destImp.fijar(i, fin, 0.6 * bump(u, 0.84, 0.98) * wB * I.oh * I.deg * (m ? 1 : 0));

    // 3) degradación de la molécula ligada a este sitio
    if (m) {
      const dg = I.deg * wB / Math.max(vis, 1e-3) * (u > 0.86 ? smooth(0.86, 1.0, u) : 0);
      m.mol.degradar(dg);
      m.mol.opacidad(I.molVis * (1 - I.deg * W * (1 - smooth(0.0, 0.14, u))));
    }
  });
  ag.particulas.forEach((_, i) => ag.brillo(i, brilloAg[i]));
  fotones.actualizar();
}

function moverMoleculas(t) {
  for (const m of moleculas) {
    const p = m.homeAgua.clone().lerp(m.homeSup, I.mol);
    p.addScaledVector(T1, Math.sin(t * 0.4 + m.f) * 1.2).addScaledVector(T2, Math.cos(t * 0.33 + m.f) * 1.0).addScaledVector(F, Math.sin(t * 0.27 + m.f * 2) * 0.8);
    m.mol.grupo.position.copy(p);
    m.mol.grupo.setRotationFromAxisAngle(m.eje, t * 0.25 + m.f);
    m.posActual = p;
  }
}

// ---------- barra de escala ----------
const NICE = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500];
function escalaBarra() {
  const d = camara.position.distanceTo(controles.target);
  const nmPorPx = (2 * d * Math.tan(THREE.MathUtils.degToRad(camara.fov / 2))) / H();
  const objetivo = 70 * nmPorPx;
  const nm = NICE.reduce((a, b) => (Math.abs(b - objetivo) < Math.abs(a - objetivo) ? b : a));
  $('#escala-barra').style.width = `${nm / nmPorPx}px`;
  $('#escala-txt').innerHTML = `${nm} nm${['zoom', 'agua'].includes(PASOS[paso].vista) ? ' <small>· molecules ×' + CFG.escalaMolecula + '</small>' : ''}`;
}

// ---------- bucle ----------
const reloj = new THREE.Timer(); reloj.connect?.(document);
let t = 0, tVisto = 0;
function cuadro(dtFijo) {
  if (!exportando) { const tam = innerWidth + 'x' + innerHeight; if (tam !== tamVisto && innerWidth && innerHeight) { tamVisto = tam; if (!modoLibre) reencuadrar(); else medir(); } }
  let dt;
  if (typeof dtFijo === 'number') dt = dtFijo; else { reloj.update(); dt = Math.min(reloj.getDelta(), 0.05); }
  t += dt * (reducido ? 0.45 : 1);
  if (tTrans < 1) { tTrans = Math.min(1, tTrans + dt / durTrans); aplicarTrans(tTrans); }
  Iag = lerp(Iag, agActiva ? 1 : 0, 1 - Math.exp(-dt * 4));
  ag.grupo.visible = Iag > 0.05;
  ag.malla.scale.setScalar(1); // (las Ag se ocultan con el grupo al comparar)

  if (!modoLibre) {
    // órbita suave en vistas generales
    const orb = PASOS[paso].vista === 'general' || PASOS[paso].vista === 'medio';
    const ang = orb && !reducido ? Math.sin(t * 0.08) * 0.35 : 0;
    const p = camPos.clone().sub(camTgt).applyAxisAngle(F.clone().cross(T1).normalize(), ang * 0.3).applyAxisAngle(new THREE.Vector3(0, 1, 0), ang);
    camara.position.copy(camTgt).add(p);
    controles.target.copy(camTgt);
  }
  controles.update();
  // La cámara nunca entra en la esfera (al girar en el zoom el centro de órbita está en la superficie)
  const minR = R + 5;
  if (camara.position.length() < minR) { camara.position.setLength(minR); camara.lookAt(controles.target); }
  // Red de seguridad: si algo deja la cámara en NaN, volver al encuadre del paso
  if (!Number.isFinite(camara.position.x)) { modoLibre = false; reencuadrar(); }

  moverMoleculas(t);
  procesos(t);
  motas.material.opacity = 0.3 * (PASOS[paso].vista === 'general' ? 0 : 1);

  // etiquetas
  for (const E of ETIQUETAS) {
    const on = E.pasos.includes(paso) && tTrans > 0.85;
    v1.copy(E.pos).project(camara);
    const visible = on && v1.z < 1;
    E.el.classList.toggle('visible', visible);
    if (visible) {
      const x = (v1.x * 0.5 + 0.5) * W();
      E.el.style.transform = `translate(${x}px, ${(-v1.y * 0.5 + 0.5) * H()}px)`;
      E.el.classList.toggle('izq', x > W() * 0.66); E.el.classList.toggle('der', x < W() * 0.34);
      E.x = x; E.y = (-v1.y * 0.5 + 0.5) * H();
    }
  }
  escalaBarra();
  renderer.render(escena, camara);

  if (reproduciendo) { tPaso += dt; if (tPaso > PASOS[paso].dur) { tPaso = 0; if (paso < PASOS.length - 1) irA(paso + 1); else parar(); } }
  tVisto++;
}

// ---------- inicio ----------
const datos = await cargarMoleculas();
window.DEMO = {
  escena, camara, renderer, esfera, ag, sitios, moleculas, I, irA, cuadro, medir, PASOS, CFG, ETIQUETAS,
  pools: { e: poolE, h: poolH, oh: poolOH, o2: poolO2 }, fotones,
  get t() { return t; }, set t(v) { t = v; },
  get paso() { return paso; },
  parar: () => parar(),
  /** Entra en modo exportación a un tamaño fijo en píxeles (sin panel ni bucle propio). */
  exportar(w, h, { ox = 0, oy = 0, fw = 1, fh = 1 } = {}) { exportando = { w, h, ox, oy, fw, fh }; parar(); renderer.setAnimationLoop(null); renderer.setPixelRatio(1); medir(); },
  info: { tio2: esfera.cantidad, ag: ag.particulas.length, sitios: sitios.length, formula: moleculas[0]?.mol.formula } };

// etiquetas ancladas a objetos reales (en direcciones relativas a la vista general)
const C = VISTAS.general().pos.clone().normalize(), ARR = new THREE.Vector3(0, 1, 0);
const DER = new THREE.Vector3().crossVectors(ARR, C).normalize(), ARRv = new THREE.Vector3().crossVectors(C, DER).normalize();
const hacia3 = (c, d, a) => C.clone().multiplyScalar(c).addScaledVector(DER, d).addScaledVector(ARRv, a).normalize();
etiqueta('<b>Porous TiO₂ nanosphere</b><span>~250 nm</span>', esfera.superficieHacia(hacia3(0.35, -0.15, 0.95)).pos, [1]);
const supEtq = esfera.superficieHacia(hacia3(0.6, 0.45, -0.6));
etiqueta('<b>Anatase nanoparticles</b><span>~10 nm</span>', supEtq.pos.clone().addScaledVector(supEtq.normal, 5), [1]);
etiqueta('<b>Ag nanoparticles</b><span>3–4 nm</span>', ag.particulas[ag.masCercana(hacia3(0.75, 0.5, 0.3).multiplyScalar(R))].pos, [1]);
if (moleculas[0]) etiqueta(`<b>Ceftiofur</b><span>${moleculas[0].mol.formula.replace(/(\d+)/g, '<sub>$1</sub>')}</span>`, moleculas[0].homeAgua.clone().addScaledVector(ARR, 7), [0]);

medir();
camara.position.copy(VISTAS.agua().pos); controles.target.copy(VISTAS.agua().tgt);
const inicial = clamp(parseInt(params.get('paso') || '1') - 1, 0, PASOS.length - 1);
irA(inicial, { instantaneo: true });
if (params.has('sinag')) { agActiva = false; $('#sin-ag').checked = true; actualizarNotaComparar(); }
if (params.has('t')) t = +params.get('t');
await renderer.compileAsync(escena, camara);
$('#cargando').classList.add('fuera');
setTimeout(() => ($('#cargando').hidden = true), 700);
const modoExport = params.get('exportar');
if (modoExport) {
  $('#portada').hidden = true;
  const m = await import('./exportar.js');
  m.iniciar(window.DEMO, modoExport, params);
} else {
  // OJO: setAnimationLoop pasa la hora en ms como 1er argumento; cuadro(dt) lo tomaría como dt fijo
  renderer.setAnimationLoop(() => cuadro());
  // Portada: solo al entrar sin ?paso. La escena ya corre detrás.
  if (params.has('paso')) $('#portada').hidden = true;
  else {
    parar();
    $('#portada-entrar').onclick = () => { $('#portada').classList.add('fuera'); setTimeout(() => ($('#portada').hidden = true), 600); if (!reducido) seguir(); };
  }
}
