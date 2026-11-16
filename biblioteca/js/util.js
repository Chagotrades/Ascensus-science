// Utilidades comunes de la biblioteca 3D de Ascensus.
// Regla: nada de Math.random() en las escenas → siempre azar con semilla,
// para que cada visita y cada captura sean idénticas.
import * as THREE from 'three';

/** Generador con semilla (mulberry32). Devuelve una función → [0, 1). */
export function azar(semilla = 1) {
  let a = semilla >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t) => 1 - Math.pow(1 - clamp(t), 3);
/** Fase 0..1 dentro de un ciclo de `periodo` segundos con desfase. */
export const fase = (t, periodo, desfase = 0) => (((t / periodo + desfase) % 1) + 1) % 1;

/** Punto uniforme en la esfera unitaria. */
export function puntoEsfera(r, out = new THREE.Vector3()) {
  const u = r() * 2 - 1, th = r() * Math.PI * 2, s = Math.sqrt(1 - u * u);
  return out.set(s * Math.cos(th), u, s * Math.sin(th));
}

/** Textura de brillo radial (para halos aditivos). */
export function texturaBrillo(tam = 128) {
  const c = document.createElement('canvas'); c.width = c.height = tam;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(tam / 2, tam / 2, 0, tam / 2, tam / 2, tam / 2);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  gr.addColorStop(0.6, 'rgba(255,255,255,0.12)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, tam, tam);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/** Textura de una carga: disco luminoso con símbolo (p. ej. "e⁻", "h⁺"). */
export function texturaCarga(simbolo, color, tam = 128) {
  const c = document.createElement('canvas'); c.width = c.height = tam;
  const g = c.getContext('2d'), m = tam / 2;
  const gr = g.createRadialGradient(m, m, 0, m, m, m);
  gr.addColorStop(0, color); gr.addColorStop(0.42, color);
  gr.addColorStop(0.5, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.beginPath(); g.arc(m, m, m, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff';
  // el texto debe caber dentro del disco (radio ~0.42·tam): se achica para símbolos largos como •OH u O₂•⁻
  let fs = tam * 0.34; g.font = `700 ${fs}px system-ui, sans-serif`;
  const maxW = tam * 0.56; const ancho = g.measureText(simbolo).width; if (ancho > maxW) { fs *= maxW / ancho; g.font = `700 ${fs}px system-ui, sans-serif`; }
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(simbolo, m, m + tam * 0.02);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/** Libera recursivamente geometrías, materiales y texturas de un objeto. */
export function liberar(obj) {
  obj.traverse((o) => {
    o.geometry?.dispose();
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    mats.forEach((m) => { Object.values(m).forEach((v) => v?.isTexture && v.dispose()); m.dispose(); });
  });
}
