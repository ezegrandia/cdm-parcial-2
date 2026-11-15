/* ============================================================
   diagrams/u9.js — diagramas SVG interactivos de la unidad 9
   ============================================================ */

const arrow = (id) => `
  <defs>
    <marker id="${id}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 1 L10 5 L0 9 z" fill="var(--muted)"/>
    </marker>
  </defs>`;

const isomorfo = {
  id: 'isomorfo',
  unit: 'u9',
  title: 'Diagrama isomorfo Cu–Ni',
  subtitle: 'Liquidus, solidus y la isoterma de 1250 °C',
  key: 'isomorfo',
  notes: [
    'Por encima del liquidus todo es líquido L; por debajo del solidus todo es sólido α.',
    'Entre las dos curvas hay L + α: a 1250 °C con CA = 35 % Ni se leen CL = 32 % Ni y CS = 43 % Ni.',
    'El isomorfo no tiene solvus: Cu y Ni son solubles en todo el rango.',
  ],
  legend: [
    { color: 'accent', text: 'Liquidus' },
    { color: 'green', text: 'Solidus' },
    { color: 'amber', text: 'L + α' },
    { color: 'rose', text: 'Isoterma' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'Diagrama Cu–Ni',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Diagrama de fases isomorfo cobre-níquel con la isoterma de 1250 grados">
        ${arrow('ar-iso')}
        <line x1="58" y1="250" x2="344" y2="250" class="svg-axis" marker-end="url(#ar-iso)"/>
        <line x1="58" y1="250" x2="58" y2="30" class="svg-axis" marker-end="url(#ar-iso)"/>
        <text x="18" y="24" class="svg-text svg-text--strong" font-size="8">T (°C)</text>
        <text x="200" y="288" text-anchor="middle" class="svg-text svg-text--strong" font-size="8">% en peso de Ni</text>
        <text x="70" y="281" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">Cu</text>
        <text x="330" y="281" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">Ni</text>

        <g class="svg-grid" stroke="var(--line)" stroke-width="0.6" stroke-dasharray="2 4">
          <line x1="58" y1="198" x2="330" y2="198"/>
          <line x1="58" y1="146" x2="330" y2="146"/>
          <line x1="58" y1="94" x2="330" y2="94"/>
          <line x1="58" y1="42" x2="330" y2="42"/>
          <line x1="122" y1="42" x2="122" y2="250"/>
          <line x1="174" y1="42" x2="174" y2="250"/>
          <line x1="226" y1="42" x2="226" y2="250"/>
          <line x1="278" y1="42" x2="278" y2="250"/>
        </g>

        <text x="52" y="201" text-anchor="end" class="svg-text svg-text--muted" font-size="7">1200</text>
        <text x="52" y="149" text-anchor="end" class="svg-text svg-text--muted" font-size="7">1300</text>
        <text x="52" y="97" text-anchor="end" class="svg-text svg-text--muted" font-size="7">1400</text>
        <text x="52" y="45" text-anchor="end" class="svg-text svg-text--muted" font-size="7">1500</text>
        <text x="52" y="253" text-anchor="end" class="svg-text svg-text--muted" font-size="7">1100</text>
        <text x="70" y="264" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">0</text>
        <text x="122" y="264" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">20</text>
        <text x="174" y="264" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">40</text>
        <text x="226" y="264" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">60</text>
        <text x="278" y="264" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">80</text>
        <text x="330" y="264" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">100</text>

        <path d="M70 250 C 105 235, 135 210, 153 172 C 170 145, 200 135, 226 115 C 255 95, 300 72, 330 65"
          fill="none" stroke="var(--accent)" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M70 250 C 105 244, 145 228, 174 177 C 178 174, 180 173, 182 172 C 195 160, 210 148, 226 136 C 255 117, 300 80, 330 65"
          fill="none" stroke="var(--green)" stroke-width="2.6" stroke-linecap="round"/>

        <text x="100" y="110" class="svg-text svg-text--accent" font-size="9">L</text>
        <text x="196" y="142" class="svg-text svg-text--amber" font-size="8">L + α</text>
        <text x="244" y="224" class="svg-text svg-text--green" font-size="9">α</text>

        <line x1="153" y1="172" x2="182" y2="172" stroke="var(--rose)" stroke-width="2.2" stroke-dasharray="4 3"/>
        <text x="167" y="162" text-anchor="middle" class="svg-text svg-text--rose" font-size="6.5">isoterma</text>
        <line x1="161" y1="172" x2="161" y2="250" stroke="var(--line-strong)" stroke-width="1" stroke-dasharray="3 4"/>
        <text x="58" y="168" text-anchor="end" class="svg-text svg-text--rose" font-size="7">1250</text>
        <text x="161" y="246" text-anchor="middle" class="svg-text svg-text--muted" font-size="6.5">35</text>
      </svg>`,
      pins: [
        { n: 1, x: 100, y: 110, lx: 112, ly: 96, label: 'Zona líquida (L)', q: '¿Qué hay por encima del liquidus?', detail: 'Todo líquido. Al cruzar el liquidus empieza a formarse el primer sólido α.' },
        { n: 2, x: 132, y: 210, lx: 112, ly: 214, label: 'Liquidus', q: '¿Qué separa la línea de liquidus?', detail: 'Separa todo líquido (arriba) de la zona L + α. Es la temperatura a la que aparece el primer sólido para esa composición.' },
        { n: 3, x: 110, y: 242, lx: 96, ly: 258, label: 'Solidus', q: '¿Qué separa la línea de solidus?', detail: 'Separa la zona L + α (arriba) de todo sólido α (abajo). Al cruzarlo desaparece la última gota de líquido.' },
        { n: 4, x: 210, y: 140, lx: 236, ly: 128, label: 'Zona L + α', q: '¿Qué hay entre liquidus y solidus?', detail: 'Coexisten líquido y sólido α. Cada fase tiene su propia composición: CL en el liquidus y CS en el solidus.' },
        { n: 5, x: 250, y: 220, lx: 272, ly: 236, label: 'Fase sólida α', q: '¿Qué hay por debajo del solidus?', detail: 'Todo sólido α: una sola fase con estructura FCC, rica en Ni para esta aleación.' },
        { n: 6, x: 153, y: 172, lx: 140, ly: 158, label: 'CL = 32 % Ni', q: '¿Dónde se lee CL?', detail: 'En el liquidus, sobre la isoterma. Es la composición del líquido: 32 % Ni (más rica en Cu, el de menor punto de fusión).' },
        { n: 7, x: 182, y: 172, lx: 196, ly: 158, label: 'CS = 43 % Ni', q: '¿Dónde se lee CS?', detail: 'En el solidus, sobre la isoterma. Es la composición del sólido α: 43 % Ni (más rico en Ni, el de mayor punto de fusión).' },
        { n: 8, x: 161, y: 202, lx: 132, ly: 214, label: 'CA = 35 % Ni', q: '¿Qué es CA y cuánto vale?', detail: 'La composición global de la aleación: 35 % Ni. Es una vertical fija; no cambia al enfriar. CL y CS son las composiciones de cada fase.' },
      ],
    },
  ],
};

const curvaAleacion = {
  id: 'curva-aleacion',
  unit: 'u9',
  title: 'Curva de enfriamiento de la aleación',
  subtitle: 'Dos quiebres: liquidus y solidus, sin meseta',
  key: 'curva-aleacion',
  notes: [
    'La aleación isomorfa no tiene meseta: la temperatura sigue bajando entre liquidus y solidus.',
    'El primer quiebre es el liquidus (aparece el primer sólido); el segundo es el solidus (desaparece el último líquido).',
    'En el metal puro de la U8 hay una sola meseta horizontal en Tf. En la U10, el eutéctico también tendrá una meseta.',
  ],
  legend: [
    { color: 'accent', text: 'Líquido' },
    { color: 'amber', text: 'L + α' },
    { color: 'green', text: 'Sólido α' },
    { color: 'rose', text: 'Liquidus / solidus' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'Curva T–t',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Curva de enfriamiento de una aleación isomorfa con liquidus y solidus">
        ${arrow('ar-cu9')}
        <line x1="58" y1="250" x2="344" y2="250" class="svg-axis" marker-end="url(#ar-cu9)"/>
        <line x1="58" y1="250" x2="58" y2="30" class="svg-axis" marker-end="url(#ar-cu9)"/>
        <text x="20" y="40" class="svg-text svg-text--strong" font-size="9">T</text>
        <text x="326" y="268" class="svg-text svg-text--strong" font-size="9">t</text>

        <line x1="60" y1="156" x2="330" y2="156" stroke="var(--rose)" stroke-width="1.3" stroke-dasharray="5 4"/>
        <line x1="60" y1="177" x2="330" y2="177" stroke="var(--rose)" stroke-width="1.3" stroke-dasharray="5 4"/>
        <text x="245" y="150" text-anchor="start" class="svg-text svg-text--rose" font-size="6.5">1280 °C · liquidus</text>
        <text x="245" y="168" text-anchor="start" class="svg-text svg-text--rose" font-size="6.5">1240 °C · solidus</text>

        <path d="M70 45 C 92 94, 118 136, 140 156" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
        <path d="M140 156 C 166 163, 192 171, 215 177" fill="none" stroke="var(--amber)" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M215 177 C 236 200, 280 228, 315 244" fill="none" stroke="var(--green)" stroke-width="3" stroke-linecap="round"/>

        <text x="94" y="86" class="svg-text svg-text--accent" font-size="9">L</text>
        <text x="160" y="118" class="svg-text svg-text--amber" font-size="8">L + α</text>
        <text x="272" y="226" class="svg-text svg-text--green" font-size="9">α</text>

        <line x1="318" y1="156" x2="318" y2="177" stroke="var(--violet)" stroke-width="1.2"/>
        <line x1="313" y1="156" x2="323" y2="156" stroke="var(--violet)" stroke-width="1.2"/>
        <line x1="313" y1="177" x2="323" y2="177" stroke="var(--violet)" stroke-width="1.2"/>
        <text x="330" y="170" text-anchor="end" class="svg-text svg-text--violet" font-size="7">ΔT</text>
      </svg>`,
      pins: [
        { n: 1, x: 70, y: 45, lx: 100, ly: 34, label: 'Vaciado (t = 0)', q: '¿Dónde empieza la curva?', detail: 'En el vaciado, con el metal 100 % líquido. La temperatura baja mientras se enfría el líquido.' },
        { n: 2, x: 140, y: 156, lx: 122, ly: 142, label: 'Liquidus: primer sólido', q: '¿Qué ocurre en el primer quiebre?', detail: 'Se llega al liquidus y aparece el primer sólido α. Empieza a liberarse calor latente y la pendiente se hace menos empinada.' },
        { n: 3, x: 175, y: 166, lx: 166, ly: 190, label: 'Zona L + α', q: '¿Qué pasa entre los dos quiebres?', detail: 'Líquido y sólido α coexisten. La temperatura sigue bajando: no hay meseta. Las composiciones cambian siguiendo liquidus y solidus.' },
        { n: 4, x: 215, y: 177, lx: 238, ly: 190, label: 'Solidus: último líquido', q: '¿Qué ocurre en el segundo quiebre?', detail: 'Desaparece la última gota de líquido. Termina la solidificación y el sólido α vuelve a enfriarse: la pendiente se hace más empinada.' },
        { n: 5, x: 280, y: 225, lx: 298, ly: 238, label: 'Sólido α enfriándose', q: '¿Qué pasa después del solidus?', detail: 'Ya es 100 % sólido α. Se elimina calor específico del sólido y la temperatura sigue bajando.' },
        { n: 6, x: 300, y: 90, lx: 280, ly: 76, label: 'No hay meseta', q: '¿Por qué esta curva no tiene meseta?', detail: 'Porque la solidificación ocurre en un rango de temperaturas: el calor latente se libera entre liquidus y solidus, no a temperatura constante.' },
      ],
    },
  ],
};

export const U9_DIAGRAMS = [isomorfo, curvaAleacion];
