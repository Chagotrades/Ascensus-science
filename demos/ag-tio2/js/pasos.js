// Guion de la demo (textos de cara al cliente: inglés).
// I = intensidades objetivo de cada proceso; vista = encuadre de cámara.
// Todo dato numérico sale del resumen del paper (ver papers/README.md).
export const PASOS = [
  {
    kicker: 'The problem', titulo: 'An antibiotic that stays in the water', vista: 'agua', dur: 9,
    I: { fot: 0, par: 0, trap: 0, oh: 0, deg: 0, mol: 0, molVis: 1 },
    html: `<p><span class="dato">Ceftiofur</span> is a veterinary cephalosporin antibiotic. Residues reach wastewater, where they are hard to remove and can contribute to antibiotic resistance.</p>
           <p>Goal: break it down using only light and a catalyst.</p>`,
  },
  {
    kicker: 'The material', titulo: 'Porous Ag–TiO₂ nanospheres', vista: 'general', dur: 10,
    I: { fot: 0, par: 0, trap: 0, oh: 0, deg: 0, mol: 1, molVis: 1 },
    html: `<p>Each sphere is <span class="dato">~250 nm</span> wide and built from <span class="dato">~10 nm anatase TiO₂</span> particles, made by a green synthesis route. The pores give the water access to a large surface.</p>
           <p>The surface is decorated with <span class="dato">3–4 nm plasmonic silver</span> nanoparticles.</p>`,
  },
  {
    kicker: 'Step 1 · Light', titulo: 'Light reaches the surface', vista: 'zoom', dur: 8,
    I: { fot: 1, par: 0, trap: 0, oh: 0, deg: 0, mol: 1, molVis: 1 },
    html: `<p>Under UV–visible (white) light, photons are absorbed by the TiO₂ nanoparticles.</p>
           <p>Molecules here are drawn 6× larger so they can be seen next to the catalyst.</p>`,
  },
  {
    kicker: 'Step 2 · Charge separation', titulo: 'Electrons and holes', vista: 'zoom', dur: 10, bandas: 3,
    I: { fot: 1, par: 1, trap: 0, oh: 0, deg: 0, mol: 1, molVis: 1 },
    html: `<p>A photon with enough energy lifts an <span class="dato">electron (e⁻)</span> to the conduction band and leaves a positive <span class="dato">hole (h⁺)</span> behind.</p>
           <p>On bare TiO₂, most pairs <b>recombine</b> within moments and the energy is lost as light or heat.</p>
           <p class="eq">TiO₂ + hν → e⁻(CB) + h⁺(VB)</p>`,
  },
  {
    kicker: 'Step 3 · The role of silver', titulo: 'Silver traps the electrons', vista: 'zoom', dur: 11, bandas: 4, comparar: true,
    I: { fot: 1, par: 1, trap: 1, oh: 0, deg: 0, mol: 1, molVis: 1 },
    html: `<p>Electrons flow into the Ag nanoparticles, which act as electron sinks. Separated from the electrons, the holes survive long enough to react.</p>
           <p>Photoluminescence measurements in the paper confirm that Ag suppresses recombination.</p>`,
  },
  {
    kicker: 'Step 4 · Radicals', titulo: 'Holes make hydroxyl radicals', vista: 'zoom', dur: 10, bandas: 5, comparar: true,
    I: { fot: 1, par: 1, trap: 1, oh: 1, deg: 0, mol: 1, molVis: 1 },
    html: `<p>Holes oxidize water at the surface into <span class="dato">hydroxyl radicals (•OH)</span>, among the strongest oxidants in water treatment.</p>
           <p class="eq">h⁺ + H₂O → •OH + H⁺</p>
           <p>Trapped electrons may also reduce dissolved O₂ to superoxide (O₂•⁻). <span class="val">See scientific notes.</span></p>`,
  },
  {
    kicker: 'Step 5 · Degradation', titulo: 'The antibiotic is oxidized', vista: 'zoom', dur: 11, bandas: 6, comparar: true,
    I: { fot: 1, par: 1, trap: 1, oh: 1, deg: 1, mol: 1, molVis: 1 },
    html: `<p>•OH radicals attack ceftiofur and break it into smaller fragments.</p>
           <p>LC-MS identified the oxidation products, and Microtox bioassays showed they are <span class="dato">non-toxic</span> compared with the original antibiotic.</p>`,
  },
  {
    kicker: 'Result', titulo: '92% of the antibiotic oxidized in 90 minutes', vista: 'medio', dur: 14, resultado: true,
    I: { fot: 1, par: 1, trap: 1, oh: 1, deg: 1, mol: 1, molVis: 1 },
    html: `<p>The silver traps and the continuous anatase framework work together, which explains why the porous nanospheres beat silver on commercial TiO₂.</p>`,
  },
];
