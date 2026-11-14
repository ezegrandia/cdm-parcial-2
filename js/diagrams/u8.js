/* ============================================================
   diagrams/u8.js — diagramas SVG interactivos de la unidad 8
   ============================================================ */

const arrow = (id) => `
  <defs>
    <marker id="${id}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 1 L10 5 L0 9 z" fill="var(--muted)"/>
    </marker>
  </defs>`;

const nucleacion = {
  id: 'nucleacion',
  unit: 'u8',
  title: 'Energía libre vs. radio',
  subtitle: 'ΔGv, σ, ΔG total y radio crítico',
  key: 'nucleacion',
  notes: [
    'La curva total suma el término de volumen (negativo, r³) y el de superficie (positivo, r²).',
    'El máximo está en r*: por debajo el embrión se disuelve, por encima el núcleo crece.',
  ],
  legend: [
    { color: 'accent', text: 'ΔG superficie (+)' },
    { color: 'rose', text: 'ΔG volumen (−)' },
    { color: 'green', text: 'ΔG total' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'ΔG vs. r',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Energía libre versus radio del núcleo">
        ${arrow('ar-nu')}
        <line x1="52" y1="196" x2="344" y2="196" class="svg-axis" marker-end="url(#ar-nu)"/>
        <line x1="58" y1="288" x2="58" y2="26" class="svg-axis" marker-end="url(#ar-nu)"/>
        <text x="30" y="42" class="svg-text svg-text--strong" font-size="10">ΔG</text>
        <text x="44" y="72" class="svg-text svg-text--muted" font-size="8">+</text>
        <text x="44" y="272" class="svg-text svg-text--muted" font-size="8">−</text>
        <text x="48" y="192" class="svg-text svg-text--muted" font-size="8">0</text>
        <text x="326" y="216" class="svg-text svg-text--strong" font-size="10">r</text>

        <path d="M58 196 C 120 178, 200 96, 322 30" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-dasharray="7 4"/>
        <path d="M58 196 C 130 214, 200 260, 312 292" fill="none" stroke="var(--rose)" stroke-width="2.4" stroke-dasharray="7 4"/>

        <path d="M58 196 C 120 192, 150 158, 182 150 C 212 144, 248 208, 310 286" fill="none" stroke="var(--green)" stroke-width="3"/>
        <line x1="182" y1="150" x2="182" y2="196" stroke="var(--amber)" stroke-width="1.5" stroke-dasharray="5 4"/>
        <circle cx="182" cy="150" r="4.6" fill="var(--amber)"/>

        <text x="84" y="214" class="svg-text svg-text--strong" font-size="9">embriones</text>
        <text x="212" y="214" class="svg-text svg-text--strong" font-size="9">núcleos</text>
        <text x="86" y="170" class="svg-text svg-text--muted" font-size="8">inestable</text>
        <text x="228" y="170" class="svg-text svg-text--muted" font-size="8">estable</text>
        <text x="250" y="88" class="svg-text svg-text--accent" font-size="8">superficie</text>
        <text x="256" y="272" class="svg-text svg-text--rose" font-size="8">volumen</text>
        <text x="206" y="134" class="svg-text svg-text--green" font-size="8">ΔG total</text>
        <text x="188" y="172" class="svg-text svg-text--amber" font-size="9">r*</text>
      </svg>`,
      pins: [
        { n: 1, x: 250, y: 82, lx: 288, ly: 58, label: 'ΔG superficie (positiva)', q: '¿Qué curva representa el término de superficie?', detail: 'Crece con r² y es positiva: crear la interfase sólido–líquido cuesta energía y se opone a la nucleación.' },
        { n: 2, x: 250, y: 258, lx: 288, ly: 292, label: 'ΔG volumen (negativa)', q: '¿Qué curva representa el término de volumen?', detail: 'Crece en magnitud con r³ y es negativa: libera energía y favorece la solidificación.' },
        { n: 3, x: 206, y: 152, lx: 150, ly: 128, label: 'ΔG total (suma)', q: '¿Qué representa la curva verde?', detail: 'La energía libre total del sistema: suma algebraica del término de volumen y el de superficie.' },
        { n: 4, x: 182, y: 150, lx: 214, ly: 136, label: 'r*: radio crítico', q: '¿Qué representa el máximo de la curva total?', detail: 'El radio crítico r*: el máximo de ΔG. Es el punto de no retorno entre embrión y núcleo.' },
        { n: 5, x: 110, y: 186, lx: 104, ly: 226, label: 'Zona de embriones', q: '¿Cómo se llaman las partículas con r < r*?', detail: 'Embriones: son inestables, cualquier crecimiento aumenta ΔG y se vuelven a fundir.' },
        { n: 6, x: 250, y: 190, lx: 272, ly: 230, label: 'Zona de núcleos', q: '¿Cómo se llaman las partículas con r > r*?', detail: 'Núcleos: son estables; al crecer disminuye la energía total y el sólido crece.' },
        { n: 7, x: 96, y: 158, lx: 66, ly: 128, label: 'Se funde (inestable)', q: '¿Qué le ocurre a un embrión?', detail: 'Al no superar r*, reducir su radio disminuye ΔG: se redisuelve en el líquido.' },
        { n: 8, x: 228, y: 144, lx: 300, ly: 162, label: 'Crece (estable)', q: '¿Qué le ocurre a un núcleo?', detail: 'Superado r*, cada átomo que se agrega baja la energía del sistema: crece de manera constante y rápida.' },
        { n: 9, x: 58, y: 60, lx: 92, ly: 48, label: 'Eje ΔG (energía libre)', q: '¿Qué magnitud mide el eje vertical?', detail: 'El cambio de energía libre ΔG, con valores positivos arriba del origen y negativos abajo.' },
      ],
    },
  ],
};

const homogeneaHeterogenea = {
  id: 'homogenea-heterogenea',
  unit: 'u8',
  title: 'Nucleación homogénea vs. heterogénea',
  subtitle: 'Dónde nace el núcleo y cuánto cuesta',
  key: 'nucleacion-tipos',
  notes: [
    'La heterogénea necesita mucho menos subenfriamiento porque la superficie ya existe en parte.',
    'En la industria se agregan inoculantes para multiplicar los núcleos y obtener grano fino.',
  ],
  legend: [
    { color: 'accent', text: 'Núcleo formado' },
    { color: 'amber', text: 'Impurezas / pared' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'Comparación',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Nucleación homogénea y heterogénea">
        <rect x="14" y="46" width="158" height="180" rx="12" fill="var(--bg-soft)" stroke="var(--line-strong)"/>
        <rect x="188" y="46" width="158" height="180" rx="12" fill="var(--bg-soft)" stroke="var(--line-strong)"/>
        <text x="24" y="36" class="svg-text svg-text--strong" font-size="10">Homogénea</text>
        <text x="198" y="36" class="svg-text svg-text--strong" font-size="10">Heterogénea</text>

        <circle cx="58" cy="82" r="3" fill="var(--muted)"/>
        <circle cx="84" cy="70" r="3" fill="var(--muted)"/>
        <circle cx="112" cy="86" r="3" fill="var(--muted)"/>
        <circle cx="140" cy="74" r="3" fill="var(--muted)"/>
        <circle cx="64" cy="120" r="3" fill="var(--muted)"/>
        <circle cx="148" cy="118" r="3" fill="var(--muted)"/>
        <circle cx="94" cy="196" r="3" fill="var(--muted)"/>
        <circle cx="128" cy="182" r="3" fill="var(--muted)"/>
        <circle cx="62" cy="170" r="3" fill="var(--muted)"/>
        <circle cx="146" cy="202" r="3" fill="var(--muted)"/>

        <circle cx="96" cy="146" r="22" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
        <circle cx="88" cy="140" r="2.4" fill="var(--accent)"/>
        <circle cx="102" cy="140" r="2.4" fill="var(--accent)"/>
        <circle cx="96" cy="152" r="2.4" fill="var(--accent)"/>
        <text x="52" y="214" class="svg-text svg-text--muted" font-size="8">núcleo nace en el líquido</text>

        <path d="M268 60 l9 5 -9 5z" fill="var(--amber)"/>
        <path d="M240 106 l9 5 -9 5z" fill="var(--amber)"/>
        <path d="M292 130 l9 5 -9 5z" fill="var(--amber)"/>
        <path d="M256 176 l9 5 -9 5z" fill="var(--amber)"/>
        <circle cx="252" cy="92" r="16" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
        <circle cx="300" cy="118" r="13" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
        <circle cx="264" cy="188" r="11" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
        <line x1="330" y1="50" x2="330" y2="222" stroke="var(--amber)" stroke-width="5" stroke-linecap="round"/>
        <text x="196" y="214" class="svg-text svg-text--muted" font-size="8">el sólido se apoya: menos costo</text>

        <text x="22" y="276" class="svg-text svg-text--amber" font-size="8">requiere más subenfriamiento</text>
        <text x="204" y="276" class="svg-text svg-text--green" font-size="8">requiere menos subenfriamiento</text>
      </svg>`,
      pins: [
        { n: 1, x: 96, y: 146, lx: 66, ly: 118, label: 'Núcleo dentro del líquido', q: '¿Dónde nuclea la homogénea?', detail: 'En el líquido puro, formando el núcleo completo desde cero: hay que crear toda la interfase.' },
        { n: 2, x: 252, y: 92, lx: 214, ly: 72, label: 'Núcleo sobre una impureza', q: '¿Dónde nuclea la heterogénea?', detail: 'Sobre una superficie existente (impureza o pared del molde): gasta menos energía de interfase.' },
        { n: 3, x: 268, y: 65, lx: 300, ly: 62, label: 'Impureza (sustrato)', q: '¿Qué papel cumplen las impurezas?', detail: 'Ofrecen una superficie sobre la que el sólido se apoya: son sustratos de nucleación.' },
        { n: 4, x: 330, y: 150, lx: 322, ly: 176, label: 'Pared del molde', q: '¿Qué otra superficie puede actuar como sustrato?', detail: 'La pared del molde. Por eso en la práctica domina la nucleación heterogénea.' },
        { n: 5, x: 40, y: 240, lx: 104, ly: 232, label: 'Mayor subenfriamiento', q: '¿Qué requiere la homogénea?', detail: 'Más subenfriamiento, porque debe crear toda la interfase y eso cuesta energía.' },
        { n: 6, x: 242, y: 240, lx: 300, ly: 232, label: 'Menor subenfriamiento', q: '¿Qué requiere la heterogénea?', detail: 'Mucho menos subenfriamiento: la interfase ya existe en parte y el sólido se apoya.' },
      ],
    },
  ],
};

const mazarota = {
  id: 'mazarota',
  unit: 'u8',
  title: 'Mazarota y rechupe',
  subtitle: 'Chvorinov aplicado al diseño de la colada',
  key: 'mazarota',
  notes: [
    'La mazarota debe tener mayor V/A que la pieza para solidificar después y seguir alimentando.',
    'Si solidifica antes, la contracción deja un rechupe interno que se detecta por rayos X.',
  ],
  legend: [
    { color: 'amber', text: 'Mazarota' },
    { color: 'accent', text: 'Pieza' },
    { color: 'rose', text: 'Rechupe' },
  ],
  variants: [
    {
      key: 'con',
      label: 'Con mazarota',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Colada con mazarota">
        ${arrow('ar-mz')}
        <rect x="58" y="28" width="244" height="236" rx="10" fill="var(--surface-2)" stroke="var(--line-strong)" stroke-width="2"/>
        <rect x="152" y="46" width="58" height="74" rx="6" fill="var(--amber-soft)" stroke="var(--amber)" stroke-width="2"/>
        <rect x="172" y="118" width="18" height="14" fill="var(--amber-soft)" stroke="var(--amber)" stroke-width="1.6"/>
        <rect x="88" y="130" width="184" height="104" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
        <text x="158" y="92" class="svg-text svg-text--amber" font-size="9">mazarota</text>
        <text x="146" y="184" class="svg-text svg-text--accent" font-size="9">pieza</text>
        <path d="M181 124 L181 152" stroke="var(--amber)" stroke-width="2" marker-end="url(#ar-mz)"/>
        <text x="196" y="140" class="svg-text svg-text--muted" font-size="8">alimenta</text>
        <text x="92" y="254" class="svg-text svg-text--muted" font-size="8">molde de arena</text>
        <text x="240" y="52" class="svg-text svg-text--muted" font-size="7.5">mayor V/A</text>
        <text x="240" y="64" class="svg-text svg-text--muted" font-size="7.5">solidifica última</text>
      </svg>`,
      pins: [
        { n: 1, x: 181, y: 62, lx: 118, ly: 62, label: 'Mazarota: mayor V/A', q: '¿Por qué la mazarota tiene mayor V/A?', detail: 'Se diseña más compacta (esférica o cilíndrica alta) para tardar más en solidificar que la pieza.' },
        { n: 2, x: 132, y: 180, lx: 96, ly: 160, label: 'Pieza fundida', q: '¿Qué representa la cavidad inferior?', detail: 'La pieza. Se contrae al solidificar y necesita metal líquido de la mazarota.' },
        { n: 3, x: 181, y: 134, lx: 232, ly: 124, label: 'Canal de alimentación', q: '¿Qué función cumple la conexión?', detail: 'Conduce el líquido de la mazarota a la pieza mientras esta se contrae.' },
        { n: 4, x: 300, y: 104, lx: 296, ly: 130, label: 'Solidifica después que la pieza', q: '¿Cuándo debe solidificar la mazarota?', detail: 'Después de la pieza, para seguir alimentando el rechupe hasta el final.' },
      ],
    },
    {
      key: 'sin',
      label: 'Sin mazarota',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Colada sin mazarota, con rechupe">
        ${arrow('ar-mz2')}
        <rect x="58" y="28" width="244" height="236" rx="10" fill="var(--surface-2)" stroke="var(--line-strong)" stroke-width="2"/>
        <rect x="152" y="46" width="58" height="74" rx="6" fill="none" stroke="var(--amber)" stroke-width="2" stroke-dasharray="6 4" opacity="0.7"/>
        <text x="158" y="42" class="svg-text svg-text--amber" font-size="8">falta mazarota</text>
        <rect x="88" y="130" width="184" height="104" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
        <path d="M212 160 c 16 -10 30 8 22 22 c -6 12 -24 16 -32 6 c -8 -8 -4 -20 10 -28 z" fill="var(--rose-soft)" stroke="var(--rose)" stroke-width="2"/>
        <text x="146" y="184" class="svg-text svg-text--accent" font-size="9">pieza</text>
        <text x="230" y="152" class="svg-text svg-text--rose" font-size="8">rechupe</text>
        <text x="92" y="254" class="svg-text svg-text--muted" font-size="8">sin depósito que alimente</text>
      </svg>`,
      pins: [
        { n: 1, x: 224, y: 178, lx: 268, ly: 214, label: 'Rechupe (cavidad interna)', q: '¿Qué defecto aparece sin mazarota?', detail: 'Una cavidad interna por contracción. La inspección por rayos X la detecta.' },
        { n: 2, x: 120, y: 178, lx: 92, ly: 140, label: 'Pieza que se contrae', q: '¿Por qué aparece el rechupe?', detail: 'El metal se contrae al solidificar y nadie repone el volumen perdido.' },
        { n: 3, x: 181, y: 84, lx: 116, ly: 92, label: 'Sin alimentación', q: '¿Por qué falla el diseño?', detail: 'No hay depósito con mayor V/A que solidifique después: el rechupe queda dentro de la pieza.' },
      ],
    },
  ],
};

const enfriamiento = {
  id: 'enfriamiento',
  unit: 'u8',
  title: 'Curva de enfriamiento (metal puro)',
  subtitle: 'Líquido, meseta y sólido · tiempos local y total',
  key: 'enfriamiento',
  notes: [
    'En la meseta la temperatura no baja porque se extrae calor latente, no calor sensible.',
    'Tiempo local = inicio → fin de solidificación. Tiempo total = vaciado → fin de solidificación.',
  ],
  legend: [
    { color: 'accent', text: 'Líquido' },
    { color: 'amber', text: 'Líquido + sólido' },
    { color: 'violet', text: 'Sólido' },
    { color: 'rose', text: 'Tf' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'Curva T–t',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Curva de enfriamiento de un metal puro">
        ${arrow('ar-cu')}
        <line x1="52" y1="244" x2="344" y2="244" class="svg-axis" marker-end="url(#ar-cu)"/>
        <line x1="52" y1="244" x2="52" y2="28" class="svg-axis" marker-end="url(#ar-cu)"/>
        <text x="24" y="40" class="svg-text svg-text--strong" font-size="9">T</text>
        <text x="326" y="262" class="svg-text svg-text--strong" font-size="9">t</text>

        <line x1="38" y1="150" x2="336" y2="150" stroke="var(--rose)" stroke-width="1.4" stroke-dasharray="5 4"/>
        <text x="28" y="145" class="svg-text svg-text--rose" font-size="9">Tf</text>

        <path d="M70 52 L150 150" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
        <path d="M150 150 L250 150" fill="none" stroke="var(--amber)" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M250 150 L320 244" fill="none" stroke="var(--violet)" stroke-width="3" stroke-linecap="round"/>

        <line x1="150" y1="150" x2="150" y2="252" stroke="var(--line-strong)" stroke-width="1.1" stroke-dasharray="4 4"/>
        <line x1="250" y1="150" x2="250" y2="270" stroke="var(--line-strong)" stroke-width="1.1" stroke-dasharray="4 4"/>
        <line x1="70" y1="52" x2="70" y2="290" stroke="var(--line-strong)" stroke-width="1.1" stroke-dasharray="4 4"/>

        <line x1="150" y1="262" x2="250" y2="262" stroke="var(--amber)" stroke-width="1.4"/>
        <line x1="150" y1="256" x2="150" y2="268" stroke="var(--amber)" stroke-width="1.4"/>
        <line x1="250" y1="256" x2="250" y2="268" stroke="var(--amber)" stroke-width="1.4"/>
        <text x="200" y="250" text-anchor="middle" class="svg-text svg-text--amber" font-size="8">tiempo local</text>

        <line x1="70" y1="284" x2="250" y2="284" stroke="var(--accent)" stroke-width="1.4"/>
        <line x1="70" y1="278" x2="70" y2="290" stroke="var(--accent)" stroke-width="1.4"/>
        <line x1="250" y1="278" x2="250" y2="290" stroke="var(--accent)" stroke-width="1.4"/>
        <text x="160" y="278" text-anchor="middle" class="svg-text svg-text--accent" font-size="8">tiempo total</text>

        <text x="108" y="62" class="svg-text svg-text--accent" font-size="8">líquido</text>
        <text x="158" y="140" class="svg-text svg-text--amber" font-size="8">líquido + sólido</text>
        <text x="300" y="172" class="svg-text svg-text--violet" font-size="8">sólido</text>
      </svg>`,
      pins: [
        { n: 1, x: 100, y: 78, lx: 130, ly: 58, label: 'Líquido: 100 % líquido', q: '¿Qué estado y qué calor se eliminan en el primer tramo?', detail: 'El metal está 100 % líquido y sobrecalentado: se elimina calor específico del líquido y la temperatura baja.' },
        { n: 2, x: 112, y: 104, lx: 172, ly: 90, label: 'Rapidez de enfriamiento ΔT/Δt', q: '¿Qué representa la pendiente de la curva?', detail: 'La rapidez de enfriamiento: grados que baja por unidad de tiempo. Más empinada = más rápido.' },
        { n: 3, x: 80, y: 150, lx: 50, ly: 130, label: 'Tf: temperatura de fusión', q: '¿Qué indica la línea horizontal punteada?', detail: 'La temperatura de fusión/solidificación del metal puro. La meseta ocurre exactamente en Tf.' },
        { n: 4, x: 195, y: 150, lx: 196, ly: 180, label: 'Meseta: líquido + sólido', q: '¿Qué ocurre en la meseta de la curva?', detail: 'Se está solidificando: coexisten líquido y sólido y sólo se elimina calor latente de fusión. Por eso T no baja.' },
        { n: 5, x: 150, y: 150, lx: 122, ly: 192, label: 'Inicio de la solidificación', q: '¿Qué marca el comienzo de la meseta?', detail: 'Empieza la solidificación y también el tiempo local.' },
        { n: 6, x: 250, y: 150, lx: 284, ly: 178, label: 'Fin de la solidificación', q: '¿Qué marca el final de la meseta?', detail: 'Termina la solidificación: ya no queda líquido. Ahí termina el tiempo local (y el total).' },
        { n: 7, x: 292, y: 205, lx: 300, ly: 184, label: 'Sólido: 100 % sólido', q: '¿Qué calor se elimina en el último tramo?', detail: 'El metal ya es 100 % sólido: se elimina calor específico del sólido y la temperatura sigue bajando.' },
        { n: 8, x: 200, y: 262, lx: 246, ly: 252, label: 'Tiempo local', q: '¿Cómo se mide el tiempo de solidificación local?', detail: 'Desde el inicio hasta el fin de la solidificación (la meseta). Sólo incluye calor latente.' },
        { n: 9, x: 215, y: 284, lx: 255, ly: 298, label: 'Tiempo total', q: '¿Cómo se mide el tiempo de solidificación total?', detail: 'Desde el vaciado hasta el fin de la solidificación. Incluye el calor específico del líquido sobrecalentado + el latente.' },
        { n: 10, x: 70, y: 52, lx: 100, ly: 36, label: 'Vaciado (t = 0)', q: '¿Dónde comienza a contarse el tiempo total?', detail: 'En el vaciado: t = 0. Por eso el tiempo total es mayor que el local.' },
      ],
    },
  ],
};

export const U8_DIAGRAMS = [nucleacion, homogeneaHeterogenea, mazarota, enfriamiento];
