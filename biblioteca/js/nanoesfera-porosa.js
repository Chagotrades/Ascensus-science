// Nanoesfera porosa formada por nanopartículas (p. ej. anatasa TiO₂).
// Unidades: 1 unidad = 1 nm. Todo es parámetro, nada fijo.
//
//   const esfera = crearNanoesferaPorosa({ diametro: 250, diametroParticula: 10 });
//   escena.add(esfera.grupo);
//   esfera.superficie → [{ pos, normal }] partículas expuestas (para decorar o reaccionar)
import * as THREE from 'three';
import { azar } from './util.js';

export function crearNanoesferaPorosa({
  diametro = 250,            // nm, diámetro de la esfera completa
  diametroParticula = 10,    // nm, partículas primarias
  empaque = 0.9,             // separación de la red / diámetro de partícula (<1 = partículas fusionadas)
  porosidad = 0.28,          // fracción aprox. de volumen convertida en canales
  escalaPoro = 0.07,         // frecuencia de los canales (1/nm); más alto = poros más finos
  grosorCapa = 45,           // nm desde la superficie hacia adentro (el interior no se ve); null = esfera llena
  color = '#dfe7f2',
  variacionColor = 0.06,
  segmentos = 14,            // resolución de cada partícula (bajar en celular)
  semilla = 2022,
} = {}) {
  const r = azar(semilla);
  const R = diametro / 2, rp = diametroParticula / 2;
  const paso = diametroParticula * empaque;

  // Canales de poro: suma de ondas con direcciones al azar (barato, sin tabla de ruido).
  const ondas = Array.from({ length: 6 }, () => {
    const k = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize().multiplyScalar(escalaPoro * (0.7 + r() * 0.6));
    return { k, f: r() * Math.PI * 2 };
  });
  const ruido = (p) => ondas.reduce((s, o) => s + Math.sin(o.k.dot(p) + o.f), 0) / Math.sqrt(ondas.length * 0.5);
  // Umbral aproximado para la porosidad pedida (la suma se comporta ~ normal(0,1)).
  const umbral = 1.0 - porosidad * 2.4;

  const posiciones = [];
  const n = Math.ceil(R / paso) + 1;
  const p = new THREE.Vector3();
  for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) for (let k = -n; k <= n; k++) {
    p.set(i, j, k).multiplyScalar(paso);
    p.x += (r() - 0.5) * paso * 0.35; p.y += (r() - 0.5) * paso * 0.35; p.z += (r() - 0.5) * paso * 0.35;
    const d = p.length();
    if (d > R - rp * 0.4) continue;
    if (grosorCapa != null && d < R - grosorCapa) continue;
    if (ruido(p) > umbral && d < R - rp * 1.5) continue; // canal (deja una piel exterior más cerrada pero agujereada)
    if (ruido(p) > umbral + 0.35) continue;               // poros que sí abren en la superficie
    posiciones.push(p.clone());
  }

  const geo = new THREE.SphereGeometry(rp, segmentos, Math.max(6, Math.round(segmentos * 0.7)));
  const mat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.55, metalness: 0.05 });
  const malla = new THREE.InstancedMesh(geo, mat, posiciones.length);
  const base = new THREE.Color(color), c = new THREE.Color(), m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3();
  const superficie = [];
  posiciones.forEach((pos, i) => {
    const esc = 0.85 + r() * 0.3;
    m.compose(pos, q, s.setScalar(esc));
    malla.setMatrixAt(i, m);
    c.copy(base).offsetHSL(0, 0, (r() - 0.5) * variacionColor * 2);
    malla.setColorAt(i, c);
    if (pos.length() > R - diametroParticula * 1.4) superficie.push({ pos, normal: pos.clone().normalize(), radio: rp * esc });
  });
  malla.instanceMatrix.needsUpdate = true;
  if (malla.instanceColor) malla.instanceColor.needsUpdate = true;

  const grupo = new THREE.Group();
  grupo.add(malla);

  /** Partícula de superficie más cercana a una dirección (vector unitario). */
  function superficieHacia(dir) {
    let mejor = superficie[0], md = -Infinity;
    for (const s2 of superficie) { const d = s2.normal.dot(dir) * 4 + s2.pos.length() / R; if (d > md) { md = d; mejor = s2; } }
    return mejor;
  }

  return {
    grupo, malla, superficie, radio: R, cantidad: posiciones.length, superficieHacia,
    material: mat,
    liberar() { geo.dispose(); mat.dispose(); },
  };
}
