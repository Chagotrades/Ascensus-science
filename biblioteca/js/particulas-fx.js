// Efectos de partículas reutilizables para mecanismos fotocatalíticos:
//   - crearFotones: paquetes de onda que viajan de A a B (luz incidente)
//   - crearPoolSprites: portadores y especies (e⁻, h⁺, •OH, O₂•⁻…) con símbolo
//   - crearDestellos: flashes breves (recombinación, impacto)
// La animación la decide quien llama: cada cuadro se fija el estado de cada
// elemento en función del tiempo (sin acumular), así un cuadro quieto sale bien.
import * as THREE from 'three';
import { texturaBrillo, texturaCarga, clamp } from './util.js';

/** Paleta de "luz blanca" (UV-visible): de violeta a rojo. */
export const ESPECTRO = ['#8f6bff', '#5b8cff', '#3fd0ff', '#5cff9d', '#fff35c', '#ffb347', '#ff6b6b'];

export function crearFotones({ cantidad = 16, puntos = 34, tam = 2.2, amplitud = 1.2, ondas = 3.5, largoPaquete = 0.22, colores = ESPECTRO } = {}) {
  const n = cantidad * puntos;
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const tex = texturaBrillo(64);
  const mat = new THREE.PointsMaterial({ size: tam, map: tex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
  const objeto = new THREE.Points(geo, mat); objeto.frustumCulled = false;
  const tono = Array.from({ length: cantidad }, (_, i) => new THREE.Color(colores[i % colores.length]));
  const d = new THREE.Vector3(), perp = new THREE.Vector3(), p = new THREE.Vector3(), aux = new THREE.Vector3(0, 0, 1);

  /** Fija el fotón i: viaja de `a` a `b`, cabeza en `prog` (0..1), intensidad 0..1. */
  function fijar(i, a, b, prog, intensidad = 1) {
    d.subVectors(b, a); const L = d.length(); d.divideScalar(L || 1);
    perp.crossVectors(d, Math.abs(d.z) < 0.9 ? aux : p.set(1, 0, 0)).normalize();
    const c = tono[i];
    for (let k = 0; k < puntos; k++) {
      const u = k / (puntos - 1);                       // 0 = cola, 1 = cabeza
      const s = prog - largoPaquete * (1 - u);          // posición a lo largo del rayo
      const vis = s >= 0 && s <= 1 ? 1 : 0;
      const env = Math.sin(Math.PI * u) * vis * intensidad; // envolvente del paquete
      p.copy(a).addScaledVector(d, s * L).addScaledVector(perp, Math.sin(u * ondas * Math.PI * 2) * amplitud * Math.sin(Math.PI * u));
      const j = (i * puntos + k) * 3;
      pos[j] = p.x; pos[j + 1] = p.y; pos[j + 2] = p.z;
      col[j] = c.r * env; col[j + 1] = c.g * env; col[j + 2] = c.b * env;
    }
  }
  function apagar(i) { for (let k = 0; k < puntos; k++) { const j = (i * puntos + k) * 3; col[j] = col[j + 1] = col[j + 2] = 0; } }
  function actualizar() { geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true; }
  return { objeto, fijar, apagar, actualizar, cantidad, liberar() { geo.dispose(); mat.dispose(); tex.dispose(); } };
}

/** Pool de sprites con símbolo. `tam` en unidades de la escena. */
export function crearPoolSprites({ simbolo, color, cantidad = 24, tam = 2, renderEncima = true }) {
  const tex = texturaCarga(simbolo, color);
  const grupo = new THREE.Group();
  const items = Array.from({ length: cantidad }, () => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: !renderEncima }));
    s.scale.setScalar(tam); s.visible = false; s.renderOrder = 10; grupo.add(s); return s;
  });
  return {
    grupo, items,
    fijar(i, p, opac = 1, escala = 1) { const s = items[i]; s.visible = opac > 0.01; s.position.copy(p); s.material.opacity = clamp(opac); s.scale.setScalar(tam * escala); },
    ocultarTodo() { items.forEach((s) => (s.visible = false)); },
    liberar() { tex.dispose(); items.forEach((s) => s.material.dispose()); },
  };
}

/** Destellos aditivos (recombinación, impacto). */
export function crearDestellos({ color = '#ffffff', cantidad = 16, tam = 6 } = {}) {
  const tex = texturaBrillo();
  const grupo = new THREE.Group();
  const items = Array.from({ length: cantidad }, () => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.visible = false; s.renderOrder = 11; grupo.add(s); return s;
  });
  return {
    grupo,
    fijar(i, p, v) { const s = items[i]; s.visible = v > 0.01; s.position.copy(p); s.material.opacity = clamp(v); s.scale.setScalar(tam * (0.4 + v)); },
    ocultarTodo() { items.forEach((s) => (s.visible = false)); },
    liberar() { tex.dispose(); items.forEach((s) => s.material.dispose()); },
  };
}
