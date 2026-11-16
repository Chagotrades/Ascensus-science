// Exportador de Ascensus: convierte una escena en entregables (MP4, PNG) y los
// guarda en entregas/ a través de herramientas/servidor.py.
//
// La escena debe poder avanzar con un dt fijo (cuadro(dt)) para que el video
// sea determinista: mismo resultado en cualquier equipo, sin saltos.
import { Muxer, ArrayBufferTarget } from '../vendor/mp4-muxer/mp4-muxer.mjs';

/** Guarda bytes/Blob en el disco del proyecto (solo dentro de entregas/). */
export async function guardar(ruta, datos) {
  const r = await fetch(`/guardar?ruta=${encodeURIComponent(ruta)}`, { method: 'POST', body: datos });
  if (!r.ok) throw new Error(`No se pudo guardar ${ruta}: ${r.status}`);
  return ruta;
}

export const aPNG = (canvas) => new Promise((ok) => canvas.toBlob(ok, 'image/png'));

/**
 * Graba un MP4 (H.264) cuadro a cuadro.
 * dibujar(k, tiempo) debe dejar listo `canvas` para el cuadro k.
 */
export async function grabarMP4({ canvas, fps = 30, duracion, dibujar, bitrate = 14e6, alProgreso = () => {} }) {
  const { width, height } = canvas;
  const target = new ArrayBufferTarget();
  const muxer = new Muxer({ target, video: { codec: 'avc', width, height, frameRate: fps }, fastStart: 'in-memory' });
  let error = null;
  const enc = new VideoEncoder({ output: (c, m) => muxer.addVideoChunk(c, m), error: (e) => (error = e) });
  const codec = height > 1080 ? 'avc1.640033' : 'avc1.640028';
  enc.configure({ codec, width, height, bitrate, framerate: fps, bitrateMode: 'variable' });
  const total = Math.round(duracion * fps);
  for (let k = 0; k < total; k++) {
    if (error) throw error;
    await dibujar(k, k / fps);
    const frame = new VideoFrame(canvas, { timestamp: Math.round((k * 1e6) / fps), duration: Math.round(1e6 / fps) });
    enc.encode(frame, { keyFrame: k % (fps * 2) === 0 });
    frame.close();
    if (enc.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 0));
    if (k % 15 === 0) alProgreso(k / total);
  }
  await enc.flush();
  muxer.finalize();
  return new Blob([target.buffer], { type: 'video/mp4' });
}

// ---------- ayudas de dibujo 2D para componer encima del render ----------

/** Parte un texto en líneas que caben en `ancho`. */
export function lineas(ctx, texto, ancho) {
  const out = []; let linea = '';
  for (const p of texto.split(' ')) {
    const prueba = linea ? linea + ' ' + p : p;
    if (ctx.measureText(prueba).width > ancho && linea) { out.push(linea); linea = p; } else linea = prueba;
  }
  if (linea) out.push(linea);
  return out;
}

export function rectRedondeado(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

/** Fondo oscuro de marca (el lienzo WebGL es transparente). */
export function fondoMarca(ctx, w, h, { base = '#050a14', luz1 = '#0f2346', luz2 = '#0a1a33', cx = 0.7, cy = 0.35 } = {}) {
  ctx.fillStyle = base; ctx.fillRect(0, 0, w, h);
  let g = ctx.createRadialGradient(w * cx, h * cy, 0, w * cx, h * cy, Math.max(w, h) * 0.6);
  g.addColorStop(0, luz1); g.addColorStop(1, 'rgba(5,10,20,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  g = ctx.createRadialGradient(w * 0.15, h * 0.9, 0, w * 0.15, h * 0.9, Math.max(w, h) * 0.45);
  g.addColorStop(0, luz2); g.addColorStop(1, 'rgba(5,10,20,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
}

/** Espera a que las fuentes web estén listas antes de dibujar texto en canvas. */
export async function fuentesListas(familias = ['600 40px Inter', '400 40px Inter', '500 20px "JetBrains Mono"']) {
  await Promise.all(familias.map((f) => document.fonts.load(f)));
  await document.fonts.ready;
}
