// Paleta de Ascensus: una sola fuente de colores para 2D (SVG) y 3D (Three.js).
// Si un color cambia aquí, cambia en todas las piezas. Valores = los de la demo Ag-TiO₂.
// Daltonismo: e⁻ (azul) / h⁺ (naranja) es un par Okabe-Ito seguro; •OH (rojo) se distingue
// de h⁺ solo por el símbolo escrito → las especies SIEMPRE llevan su símbolo, nunca solo color.

export const COLORES = {
  // Materiales
  tio2: { relleno: '#dfe7f2', sombra: '#8a97ab', medio: '#a9b7cc', nota: 'TiO₂ (anatasa): gris azulado claro' },
  ag: { claro: '#ffffff', medio: '#c7ced9', oscuro: '#6d7685', halo: '#cfe3ff', nota: 'Plata metálica' },
  au: { claro: '#fff4d1', medio: '#ffcf6b', oscuro: '#a87a1f', halo: '#ffd27a', nota: 'Oro metálico' },
  agua: { relleno: '#cfeeff', borde: '#5ec8f2', nota: 'Agua / solución' },

  // Especies y cargas (con símbolo siempre)
  electron: { relleno: '#3da5ff', texto: '#ffffff', simbolo: 'e⁻' },
  hueco: { relleno: '#ff9f1c', texto: '#ffffff', simbolo: 'h⁺' },
  oh: { relleno: '#ff4d6d', texto: '#ffffff', simbolo: '•OH' },
  superoxido: { relleno: '#22c3a6', texto: '#ffffff', simbolo: 'O₂•⁻' },

  // Luz (espectro UV-visible, de violeta a rojo)
  luz: ['#8f6bff', '#5b8cff', '#3fd0ff', '#5cff9d', '#fff35c', '#ffb347', '#ff6b6b'],
  uv: '#b9a5ff',

  // Átomos (CPK ajustado, igual que biblioteca/js/molecula.js)
  atomos: { H: '#f2f4f7', C: '#5b6472', N: '#3d6bff', O: '#ff3b3b', S: '#ffd23f', Na: '#ab5cf2', Cl: '#1ff01f', As: '#bd80e3' },

  // Bandas de energía
  bandas: { conduccion: '#3da5ff', valencia: '#ff9f1c' },

  // Interfaz y texto (sobre fondo claro de revista y fondo oscuro de marca)
  texto: { claro: '#1a2333', secundario: '#5a6578', sobreOscuro: '#e8eef8' },
  linea: '#5a6578',
  acento: '#3da5ff',
  fondoMarca: '#050a14',
};

/** Fuente para piezas de revista: Arial (pedida por Elsevier/ACS) con alternativas. */
export const FUENTE_REVISTA = "Arial, Helvetica, 'Liberation Sans', sans-serif";
/** Fuente de marca (pantalla). */
export const FUENTE_MARCA = "Inter, 'Segoe UI', Arial, sans-serif";
