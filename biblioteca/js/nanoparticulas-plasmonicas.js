// Nanopartículas metálicas plasmónicas (Ag, Au…) sobre una superficie.
// Metal real (PBR, necesita mapa de entorno en la escena) + halo aditivo
// cuyo brillo se controla por partícula (p. ej. al recibir un electrón).
//
//   const ag = crearNanoparticulasPlasmonicas({ superficie: esfera.superficie, cantidad: 160 });
//   ag.brillo(i, 0..1)   // en cada cuadro
import * as THREE from 'three';
import { azar, texturaBrillo } from './util.js';

export const METALES = {
  Ag: { color: '#e4e7ec', halo: '#cfe3ff', rugosidad: 0.22 },
  Au: { color: '#ffcf6b', halo: '#ffd27a', rugosidad: 0.25 },
};

export function crearNanoparticulasPlasmonicas({
  superficie,                 // [{ pos, normal, radio }] de crearNanoesferaPorosa
  cantidad = 150,
  diametro = [3, 4],          // nm (rango)
  metal = 'Ag',
  tamHalo = 5,                // múltiplo del radio
  brilloBase = 0.18,
  segmentos = 18,
  semilla = 7,
  zonaPreferente = null,      // { dir: Vector3, peso: 0..1 } para asegurar partículas en una zona (p. ej. la que enfoca la cámara)
} = {}) {
  const r = azar(semilla), M = METALES[metal] ?? METALES.Ag;
  const grupo = new THREE.Group();
  const geo = new THREE.SphereGeometry(1, segmentos, Math.round(segmentos * 0.75));
  const mat = new THREE.MeshStandardMaterial({ color: M.color, metalness: 1, roughness: M.rugosidad });
  const malla = new THREE.InstancedMesh(geo, mat, cantidad);
  const texHalo = texturaBrillo();
  const usadas = new Set(), particulas = [];
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3();

  for (let i = 0; i < cantidad && usadas.size < superficie.length; i++) {
    let idx;
    if (zonaPreferente && r() < zonaPreferente.peso) {
      // elegir entre las más cercanas a la zona
      let mejor = -1, md = -Infinity;
      for (let k = 0; k < 40; k++) { const j = Math.floor(r() * superficie.length); if (usadas.has(j)) continue; const d = superficie[j].normal.dot(zonaPreferente.dir) + r() * 0.08; if (d > md) { md = d; mejor = j; } }
      idx = mejor;
    } else {
      do { idx = Math.floor(r() * superficie.length); } while (usadas.has(idx));
    }
    if (idx < 0) continue;
    usadas.add(idx);
    const sup = superficie[idx];
    const rad = (diametro[0] + r() * (diametro[1] - diametro[0])) / 2;
    const pos = sup.pos.clone().addScaledVector(sup.normal, sup.radio + rad * 0.55);
    m.compose(pos, q, s.setScalar(rad));
    malla.setMatrixAt(particulas.length, m);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: texHalo, color: M.halo, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: brilloBase }));
    halo.position.copy(pos); halo.scale.setScalar(rad * tamHalo);
    grupo.add(halo);
    particulas.push({ pos, radio: rad, normal: sup.normal, halo });
  }
  malla.count = particulas.length;
  malla.instanceMatrix.needsUpdate = true;
  grupo.add(malla);

  return {
    grupo, malla, particulas,
    /** Brillo de una partícula (0 = base, 1 = máximo). */
    brillo(i, v) { const h = particulas[i].halo; h.material.opacity = brilloBase + v * 0.55; h.scale.setScalar(particulas[i].radio * tamHalo * (1 + v * 0.45)); },
    /** Índice de la partícula más cercana a un punto. */
    masCercana(p) { let mi = 0, md = Infinity; particulas.forEach((a, i) => { const d = a.pos.distanceToSquared(p); if (d < md) { md = d; mi = i; } }); return mi; },
    liberar() { geo.dispose(); mat.dispose(); texHalo.dispose(); particulas.forEach((p) => p.halo.material.dispose()); },
  };
}
