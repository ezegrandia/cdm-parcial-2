/* ============================================================
   diagrams/u6.js — diagramas SVG interactivos de la unidad 6
   Cada diagrama: variantes con svg + pines (n, x, y, lx, ly,
   label, q, detail).
   ============================================================ */

const arrow = (id) => `
  <defs>
    <marker id="${id}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 1 L10 5 L0 9 z" fill="var(--muted)"/>
    </marker>
  </defs>`;

const curvaSigmaEpsilon = {
  id: 'curva-sigma-epsilon',
  unit: 'u6',
  title: 'Curva esfuerzo–deformación',
  subtitle: 'Las 8 propiedades A–H sobre un solo gráfico',
  key: 'curva',
  notes: [
    'Marcá siempre: pendiente E en la zona elástica, triángulo de resiliencia, cedencia, σut donde empieza la estricción y la recta offset al 0,2 %.',
    'La curva baja después de σut porque el área real disminuye, no porque el material se debilite.',
  ],
  legend: [
    { color: 'accent', text: 'Zona elástica / offset' },
    { color: 'green', text: 'Punto máximo σut' },
    { color: 'rose', text: 'Ruptura' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'Curva completa',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Curva esfuerzo deformación con sus puntos característicos">
        ${arrow('ar-cs')}
        <defs>
          <pattern id="hatch-cs" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--accent)" stroke-opacity="0.38" stroke-width="1.3"/>
          </pattern>
        </defs>

        <line x1="46" y1="244" x2="344" y2="244" class="svg-axis" marker-end="url(#ar-cs)"/>
        <line x1="46" y1="244" x2="46" y2="24" class="svg-axis" marker-end="url(#ar-cs)"/>
        <text x="30" y="34" class="svg-text svg-text--strong" font-size="12">σ</text>
        <text x="334" y="260" class="svg-text svg-text--strong" font-size="12">ε</text>
        <text x="37" y="254" class="svg-text svg-text--muted">0</text>

        <polygon points="46,244 120,128 120,244" fill="url(#hatch-cs)"/>

        <line x1="46" y1="128" x2="120" y2="128" stroke="var(--line-strong)" stroke-dasharray="3 4"/>
        <line x1="46" y1="62" x2="232" y2="62" stroke="var(--line-strong)" stroke-dasharray="3 4"/>
        <line x1="232" y1="62" x2="232" y2="244" stroke="var(--line-strong)" stroke-dasharray="3 4"/>
        <line x1="120" y1="128" x2="120" y2="244" stroke="var(--line-strong)" stroke-dasharray="3 4"/>
        <line x1="288" y1="150" x2="288" y2="244" stroke="var(--line-strong)" stroke-dasharray="3 4"/>

        <line x1="54" y1="244" x2="136" y2="112" stroke="var(--violet)" stroke-width="1.8" stroke-dasharray="6 4"/>
        <text x="92" y="102" class="svg-text svg-text--violet" font-size="8">offset 0,2 %</text>

        <path class="svg-curve svg-curve--accent" d="M46 244 L120 128 L126 144 L132 138 L138 146 L144 139 L151 145" />
        <path class="svg-curve" d="M151 145 C 182 140, 205 84, 232 62" />
        <path class="svg-curve svg-curve--rose" d="M232 62 C 254 66, 272 108, 288 150" />

        <circle cx="120" cy="128" r="4.2" fill="var(--amber)"/>
        <circle cx="232" cy="62" r="5" fill="var(--green)"/>
        <circle cx="288" cy="150" r="4.4" fill="var(--rose)"/>

        <text x="96" y="272" class="svg-text svg-text--muted">zona elástica</text>
        <text x="196" y="272" class="svg-text svg-text--muted">zona plástica (permanente)</text>
        <text x="252" y="54" class="svg-text svg-text--green" font-size="8">σut</text>
        <text x="290" y="140" class="svg-text svg-text--rose" font-size="8">ruptura</text>
      </svg>`,
      pins: [
        { n: 1, x: 46, y: 60, lx: 104, ly: 40, label: 'Esfuerzo σ (MPa)', q: '¿Qué magnitud representa el eje vertical?', detail: 'El esfuerzo ingenieril σ = F/A₀, en MPa (N/mm²).' },
        { n: 2, x: 86, y: 180, lx: 170, ly: 156, label: 'Módulo E = σ/ε', q: '¿Qué mide la pendiente de la zona recta inicial?', detail: 'El módulo de Young E: rigidez del material. Depende del enlace atómico, no del tratamiento térmico.' },
        { n: 3, x: 92, y: 214, lx: 142, ly: 226, label: 'Resiliencia (área elástica)', q: '¿Qué representa el triángulo rayado bajo la recta?', detail: 'ER = ½σyεy: energía elástica que el material absorbe y devuelve al descargar.' },
        { n: 4, x: 120, y: 128, lx: 76, ly: 112, label: 'σy: fluencia o cedencia', q: '¿Qué punto separa la zona elástica de la plástica?', detail: 'El esfuerzo de fluencia σy. Al superarlo queda deformación permanente.' },
        { n: 5, x: 60, y: 232, lx: 174, ly: 96, label: 'Offset 0,2 %', q: '¿Qué es la recta punteada paralela?', detail: 'Fluencia convencional: paralela a la zona elástica desplazada 0,2 % (ε = 0,002). Se usa cuando no hay quiebre claro.' },
        { n: 6, x: 138, y: 142, lx: 186, ly: 176, label: 'Meseta de fluencia', q: '¿Qué zona aparece justo después del pico de cedencia en aceros de bajo carbono?', detail: 'La meseta ondulante de cedencia inferior, por anclaje y liberación de dislocaciones.' },
        { n: 7, x: 232, y: 62, lx: 280, ly: 42, label: 'σut: resistencia a la tracción', q: '¿Qué representa el punto más alto de la curva?', detail: 'σut = Fmáx/A₀. Es el máximo, no la rotura: justo acá empieza la estricción.' },
        { n: 8, x: 262, y: 90, lx: 300, ly: 112, label: 'Estricción (encuellamiento)', q: '¿Qué fenómeno ocurre en el tramo descendente?', detail: 'Se forma un cuello localizado: el área real cae y la fuerza baja hasta la ruptura.' },
        { n: 9, x: 288, y: 150, lx: 314, ly: 172, label: 'Ruptura', q: '¿Qué punto marca la fractura final?', detail: 'El esfuerzo de ruptura, menor que σut porque el área del cuello ya era mucho menor.' },
        { n: 10, x: 84, y: 256, lx: 74, ly: 284, label: 'Zona elástica (reversible)', q: '¿Qué zona devuelve la deformación al descargar?', detail: 'Por debajo de σy la deformación es reversible: la pieza vuelve a su longitud inicial.' },
        { n: 11, x: 200, y: 256, lx: 238, ly: 288, label: 'Zona plástica (permanente)', q: '¿Qué zona deja deformación permanente?', detail: 'Desde σy hasta la ruptura: la deformación queda aunque se retire la carga.' },
      ],
    },
  ],
};

const impacto = {
  id: 'impacto',
  unit: 'u6',
  title: 'Impacto: Charpy vs. Izod',
  subtitle: 'Péndulo, entalla y lado del golpe',
  key: 'impacto',
  notes: [
    'Charpy: probeta horizontal apoyada, golpe en la cara opuesta a la entalla.',
    'Izod: probeta vertical empotrada, golpe del mismo lado de la entalla.',
    'En ambos: E = m·g·(h₀ − hf) y tres resultados (energía, % de corte, expansión lateral).',
  ],
  legend: [
    { color: 'accent', text: 'Probeta y apoyos' },
    { color: 'amber', text: 'Golpe del péndulo' },
    { color: 'green', text: 'Entalla normalizada' },
  ],
  variants: [
    {
      key: 'charpy',
      label: 'Charpy',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Ensayo Charpy">
        ${arrow('ar-ch')}
        <defs>
          <pattern id="hatch-ch" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--amber)" stroke-opacity="0.4" stroke-width="1.2"/>
          </pattern>
        </defs>

        <line x1="40" y1="252" x2="330" y2="252" stroke="var(--line-strong)" stroke-width="1.5"/>

        <polygon points="86,252 112,252 99,222" fill="var(--surface-2)" stroke="var(--line-strong)"/>
        <polygon points="242,252 268,252 255,222" fill="var(--surface-2)" stroke="var(--line-strong)"/>

        <rect x="58" y="204" width="238" height="18" rx="2" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.6"/>
        <path d="M170 222 L180 208 L190 222" fill="var(--bg-soft)" stroke="var(--green)" stroke-width="2"/>

        <circle cx="46" cy="46" r="5" fill="var(--surface-3)" stroke="var(--line-strong)"/>
        <line x1="46" y1="46" x2="168" y2="128" stroke="var(--muted)" stroke-width="2"/>
        <path d="M46 46 A 122 122 0 0 1 168 168" fill="none" stroke="var(--line-strong)" stroke-dasharray="4 5"/>
        <rect x="156" y="120" width="24" height="30" rx="4" fill="url(#hatch-ch)" stroke="var(--amber)" stroke-width="1.8"/>
        <line x1="168" y1="152" x2="180" y2="200" stroke="var(--amber)" stroke-width="2.4" marker-end="url(#ar-ch)"/>
        <text x="128" y="112" class="svg-text svg-text--amber" font-size="8">péndulo m</text>

        <line x1="318" y1="60" x2="318" y2="252" stroke="var(--line-strong)" stroke-width="1.2"/>
        <line x1="310" y1="60" x2="326" y2="60" stroke="var(--violet)" stroke-width="2"/>
        <line x1="310" y1="118" x2="326" y2="118" stroke="var(--violet)" stroke-width="2"/>
        <text x="330" y="56" class="svg-text svg-text--violet" font-size="8">h₀</text>
        <text x="330" y="122" class="svg-text svg-text--violet" font-size="8">hf</text>
        <line x1="300" y1="60" x2="300" y2="118" stroke="var(--violet)" stroke-width="1.4" marker-start="url(#ar-ch)" marker-end="url(#ar-ch)"/>
        <text x="272" y="94" class="svg-text svg-text--violet" font-size="8">Δh</text>

        <text x="66" y="196" class="svg-text svg-text--muted" font-size="8">probeta 10×10×55 mm</text>
        <text x="118" y="270" class="svg-text svg-text--muted" font-size="8">apoyos (viga)</text>
        <text x="204" y="146" class="svg-text svg-text--amber" font-size="8">golpe: cara opuesta</text>
        <text x="196" y="236" class="svg-text svg-text--green" font-size="8">entalla 45° · 2 mm · r 0,25</text>
      </svg>`,
      pins: [
        { n: 1, x: 168, y: 134, lx: 258, ly: 128, label: 'Golpe en la cara opuesta', q: '¿En qué cara golpea el péndulo en Charpy?', detail: 'En la cara opuesta a la entalla. La probeta se flexiona y la entalla queda traccionada.' },
        { n: 2, x: 180, y: 216, lx: 262, ly: 236, label: 'Entalla 45° de 2 mm', q: '¿Qué es la entalla y para qué sirve?', detail: 'Entalla normalizada: 45°, 2 mm de profundidad y r = 0,25 mm. Concentra tensiones y define dónde empieza la fractura.' },
        { n: 3, x: 99, y: 236, lx: 88, ly: 272, label: 'Probeta apoyada en los extremos', q: '¿Cómo se coloca la probeta Charpy?', detail: 'Horizontal, simplemente apoyada en los dos extremos: trabaja como viga de 55 mm.' },
        { n: 4, x: 66, y: 213, lx: 128, ly: 188, label: 'Probeta 10 × 10 × 55 mm', q: '¿Qué dimensiones tiene la probeta Charpy?', detail: '10 × 10 × 55 mm, con la entalla en el centro (L/2 = 27,5 mm).' },
        { n: 5, x: 318, y: 88, lx: 316, ly: 36, label: 'E = m·g·(h₀ − hf)', q: '¿Cómo se obtiene la energía absorbida?', detail: 'Por la diferencia de energía potencial del péndulo: E = m·g·(h₀ − hf), con g = 9,8 m/s².' },
        { n: 6, x: 100, y: 140, lx: 62, ly: 160, label: 'Péndulo / martillo', q: '¿Qué elemento golpea la probeta?', detail: 'El martillo del péndulo, que cae desde h₀ y describe un arco hasta el impacto.' },
      ],
    },
    {
      key: 'izod',
      label: 'Izod',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Ensayo Izod">
        ${arrow('ar-iz')}
        <defs>
          <pattern id="hatch-iz" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--amber)" stroke-opacity="0.4" stroke-width="1.2"/>
          </pattern>
        </defs>

        <line x1="56" y1="262" x2="330" y2="262" stroke="var(--line-strong)" stroke-width="1.5"/>
        <rect x="176" y="60" width="18" height="180" rx="2" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.6"/>
        <path d="M176 104 L190 112 L176 120" fill="var(--bg-soft)" stroke="var(--green)" stroke-width="2"/>
        <rect x="160" y="204" width="50" height="58" rx="4" fill="var(--surface-2)" stroke="var(--line-strong)" stroke-width="1.8"/>
        <line x1="160" y1="218" x2="210" y2="218" stroke="var(--line-strong)" stroke-dasharray="3 3"/>

        <circle cx="60" cy="64" r="5" fill="var(--surface-3)" stroke="var(--line-strong)"/>
        <line x1="60" y1="64" x2="132" y2="98" stroke="var(--muted)" stroke-width="2"/>
        <rect x="120" y="86" width="26" height="30" rx="4" fill="url(#hatch-iz)" stroke="var(--amber)" stroke-width="1.8"/>
        <line x1="146" y1="101" x2="172" y2="101" stroke="var(--amber)" stroke-width="2.4" marker-end="url(#ar-iz)"/>
        <text x="94" y="78" class="svg-text svg-text--amber" font-size="8">péndulo</text>

        <text x="226" y="96" class="svg-text svg-text--amber" font-size="8">golpe: mismo lado</text>
        <text x="230" y="128" class="svg-text svg-text--green" font-size="8">entalla</text>
        <text x="222" y="200" class="svg-text svg-text--muted" font-size="8">empotrado</text>
        <text x="222" y="214" class="svg-text svg-text--muted" font-size="8">(voladizo)</text>
        <text x="84" y="252" class="svg-text svg-text--muted" font-size="8">probeta 10×10×75 mm</text>
        <text x="252" y="284" class="svg-text svg-text--muted" font-size="8">vertical</text>
        <line x1="150" y1="196" x2="176" y2="196" stroke="var(--line-strong)" stroke-dasharray="3 3"/>
      </svg>`,
      pins: [
        { n: 1, x: 158, y: 101, lx: 262, ly: 84, label: 'Golpe del mismo lado de la entalla', q: '¿En qué cara golpea el péndulo en Izod?', detail: 'Del mismo lado de la entalla, en el extremo libre. Es la diferencia clave con Charpy.' },
        { n: 2, x: 182, y: 112, lx: 250, ly: 130, label: 'Entalla desplazada', q: '¿Dónde está la entalla en la probeta Izod?', detail: 'Entalla de 45° y 2 mm, desplazada del centro (no en L/2 como en Charpy).' },
        { n: 3, x: 185, y: 146, lx: 128, ly: 172, label: 'Probeta 10 × 10 × 75 mm', q: '¿Qué dimensiones tiene la probeta Izod?', detail: '10 × 10 × 75 mm: 20 mm más larga que la Charpy porque va empotrada.' },
        { n: 4, x: 185, y: 232, lx: 260, ly: 246, label: 'Empotrada (voladizo)', q: '¿Cómo se sostiene la probeta Izod?', detail: 'Vertical, empotrada por la mitad inferior: trabaja como voladizo.' },
        { n: 5, x: 78, y: 76, lx: 74, ly: 44, label: 'Péndulo del ensayo', q: '¿Qué golpea la probeta?', detail: 'El martillo del péndulo, que impacta el extremo libre de la probeta.' },
      ],
    },
  ],
};

const caraFractura = {
  id: 'cara-fractura',
  unit: 'u6',
  title: 'Cara de fractura y % de corte',
  subtitle: 'Clivaje central vs. corte periférico',
  key: 'fractura-cara',
  notes: [
    'El área brillante y cristalina es clivaje (frágil); el marco opaco y fibroso es corte (dúctil).',
    '% corte = (Atotal − A·B) / Atotal × 100. Si A o B valen 0, el corte es 100 %.',
  ],
  legend: [
    { color: 'rose', text: 'Clivaje (frágil)' },
    { color: 'green', text: 'Corte (dúctil)' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'Cara de fractura',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Cara de fractura de una probeta Charpy">
        <rect x="86" y="56" width="150" height="150" rx="6" fill="var(--green-soft)" stroke="var(--green)" stroke-width="2"/>
        <rect x="126" y="86" width="70" height="90" rx="3" fill="var(--rose-soft)" stroke="var(--rose)" stroke-width="2" stroke-dasharray="5 3"/>
        <path d="M96 66 l14 10 M96 86 l14 10 M96 106 l14 10 M96 126 l14 10 M96 146 l14 10 M96 166 l14 10 M96 186 l14 10" stroke="var(--green)" stroke-opacity="0.45" stroke-width="1.2"/>
        <path d="M216 66 l14 10 M216 86 l14 10 M216 106 l14 10 M216 126 l14 10 M216 146 l14 10 M216 166 l14 10 M216 186 l14 10" stroke="var(--green)" stroke-opacity="0.45" stroke-width="1.2"/>

        <line x1="126" y1="72" x2="196" y2="72" stroke="var(--rose)" stroke-width="1.4" marker-start="url(#ar-fr)" marker-end="url(#ar-fr)"/>
        <text x="152" y="66" class="svg-text svg-text--rose" font-size="9">A</text>
        <line x1="210" y1="86" x2="210" y2="176" stroke="var(--rose)" stroke-width="1.4" marker-start="url(#ar-fr)" marker-end="url(#ar-fr)"/>
        <text x="216" y="134" class="svg-text svg-text--rose" font-size="9">B</text>
        <text x="132" y="134" class="svg-text svg-text--rose" font-size="9">clivaje</text>
        <text x="132" y="146" class="svg-text svg-text--rose" font-size="8">(brillante)</text>
        <text x="206" y="200" class="svg-text svg-text--green" font-size="9">corte</text>
        <text x="206" y="212" class="svg-text svg-text--green" font-size="8">(opaco y fibroso)</text>
        <text x="86" y="48" class="svg-text svg-text--muted" font-size="8">10 × 8 mm (ejemplo)</text>

        <line x1="250" y1="60" x2="330" y2="60" stroke="var(--line-strong)" stroke-dasharray="3 3"/>
        <text x="250" y="80" class="svg-text svg-text--muted" font-size="8">% corte =</text>
        <text x="250" y="96" class="svg-text svg-text--strong" font-size="9" font-family="monospace">(Atotal − A·B)</text>
        <line x1="250" y1="102" x2="336" y2="102" stroke="var(--muted)" stroke-width="1"/>
        <text x="250" y="116" class="svg-text svg-text--strong" font-size="9" font-family="monospace">Atotal × 100</text>
        <text x="250" y="150" class="svg-text svg-text--muted" font-size="8">A o B = 0 →</text>
        <text x="250" y="164" class="svg-text svg-text--green" font-size="9">100 % dúctil</text>
      </svg>`,
      pins: [
        { n: 1, x: 160, y: 130, lx: 196, ly: 246, label: 'Clivaje (frágil, brillante)', q: '¿Qué zona de la cara de fractura es el clivaje?', detail: 'El recuadro central A × B, brillante y cristalino: es la fractura frágil.' },
        { n: 2, x: 96, y: 190, lx: 68, ly: 232, label: 'Corte (dúctil, opaco)', q: '¿Qué zona corresponde a la fractura por corte?', detail: 'El marco periférico opaco y fibroso: es la fractura dúctil por cizallamiento.' },
        { n: 3, x: 161, y: 72, lx: 168, ly: 40, label: 'Ancho A del clivaje', q: '¿Qué representa A en la fórmula del % de corte?', detail: 'El ancho del rectángulo de clivaje. Su área es A × B.' },
        { n: 4, x: 210, y: 130, lx: 262, ly: 40, label: 'Alto B del clivaje', q: '¿Qué representa B?', detail: 'El alto del rectángulo de clivaje. Si A o B valen 0, no hay zona frágil y el corte es 100 %.' },
        { n: 5, x: 330, y: 186, lx: 296, ly: 214, label: 'Cálculo del % de corte', q: '¿Cómo se calcula el porcentaje de fractura por corte?', detail: '% corte = (área total − A·B)/área total × 100. Se mide sobre la cara rota de la probeta.' },
      ],
    },
  ],
};

const flexion = {
  id: 'flexion',
  unit: 'u6',
  title: 'Flexión en 3 y 4 puntos',
  subtitle: 'Diagramas de momento y cortante',
  key: 'flexion',
  notes: [
    'En 3 puntos el momento es triangular (máximo FL/4 en el centro); en 4 puntos es constante en L/2 y V = 0 (flexión pura).',
    'Las cargas se ubican a L/4 de cada apoyo en el ensayo de 4 puntos.',
  ],
  legend: [
    { color: 'accent', text: 'Momento flector' },
    { color: 'amber', text: 'Esfuerzo cortante' },
  ],
  variants: [
    {
      key: 'tres',
      label: '3 puntos',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Flexión en 3 puntos">
        ${arrow('ar-fl')}
        <line x1="56" y1="84" x2="312" y2="84" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
        <polygon points="48,96 72,96 60,72" fill="var(--surface-2)" stroke="var(--line-strong)"/>
        <polygon points="296,96 320,96 308,72" fill="var(--surface-2)" stroke="var(--line-strong)"/>
        <line x1="184" y1="26" x2="184" y2="70" stroke="var(--amber)" stroke-width="2.6" marker-end="url(#ar-fl)"/>
        <text x="192" y="40" class="svg-text svg-text--amber" font-size="9">F</text>
        <line x1="60" y1="106" x2="308" y2="106" stroke="var(--line-strong)" stroke-dasharray="3 4"/>
        <text x="176" y="120" class="svg-text svg-text--muted" font-size="8">L</text>

        <text x="56" y="150" class="svg-text svg-text--muted" font-size="8">Momento flector</text>
        <line x1="60" y1="214" x2="308" y2="214" stroke="var(--muted)" stroke-width="1.4"/>
        <polygon points="60,214 184,160 308,214" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.8"/>
        <text x="166" y="180" class="svg-text svg-text--accent" font-size="8">Mmax = FL/4</text>

        <text x="56" y="236" class="svg-text svg-text--muted" font-size="8">Cortante</text>
        <line x1="60" y1="278" x2="308" y2="278" stroke="var(--line-strong)" stroke-dasharray="3 4"/>
        <path d="M60 258 L184 258 L184 292 L308 292" fill="none" stroke="var(--amber)" stroke-width="2.2"/>
        <text x="92" y="250" class="svg-text svg-text--amber" font-size="8">+F/2</text>
        <text x="248" y="284" class="svg-text svg-text--amber" font-size="8">−F/2</text>
      </svg>`,
      pins: [
        { n: 1, x: 158, y: 48, lx: 226, ly: 36, label: 'Carga F en el centro (L/2)', q: '¿Dónde se aplica la carga en 3 puntos?', detail: 'Una sola carga en el centro de la luz, a L/2 de cada apoyo.' },
        { n: 2, x: 150, y: 174, lx: 232, ly: 190, label: 'Momento máximo FL/4', q: '¿Cuánto vale el momento máximo en 3 puntos?', detail: 'Mmax = F·L/4, en el centro. El diagrama es un triángulo.' },
        { n: 3, x: 92, y: 274, lx: 128, ly: 300, label: 'Cortante +F/2 y −F/2', q: '¿Cómo es el diagrama de cortante?', detail: 'Constante: +F/2 a la izquierda del centro y −F/2 a la derecha.' },
        { n: 4, x: 60, y: 84, lx: 70, ly: 54, label: 'Apoyo simple (luz L)', q: '¿Cómo se apoya la viga?', detail: 'Simplemente apoyada en los extremos; la luz L es la distancia entre apoyos, no el largo total.' },
        { n: 5, x: 246, y: 90, lx: 268, ly: 112, label: 'Cara traccionada abajo', q: '¿Qué cara falla en un material frágil?', detail: 'La cara inferior, que trabaja a tracción: por eso el ensayo representa la resistencia a flexión.' },
      ],
    },
    {
      key: 'cuatro',
      label: '4 puntos',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Flexión en 4 puntos">
        ${arrow('ar-f4')}
        <line x1="56" y1="84" x2="312" y2="84" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
        <polygon points="48,96 72,96 60,72" fill="var(--surface-2)" stroke="var(--line-strong)"/>
        <polygon points="296,96 320,96 308,72" fill="var(--surface-2)" stroke="var(--line-strong)"/>
        <line x1="124" y1="26" x2="124" y2="70" stroke="var(--amber)" stroke-width="2.6" marker-end="url(#ar-f4)"/>
        <line x1="244" y1="26" x2="244" y2="70" stroke="var(--amber)" stroke-width="2.6" marker-end="url(#ar-f4)"/>
        <text x="103" y="40" class="svg-text svg-text--amber" font-size="9">F</text>
        <text x="250" y="40" class="svg-text svg-text--amber" font-size="9">F</text>
        <text x="74" y="124" class="svg-text svg-text--muted" font-size="8">L/4</text>
        <text x="166" y="124" class="svg-text svg-text--muted" font-size="8">L/2</text>
        <text x="276" y="124" class="svg-text svg-text--muted" font-size="8">L/4</text>

        <text x="56" y="150" class="svg-text svg-text--muted" font-size="8">Momento flector</text>
        <line x1="60" y1="214" x2="308" y2="214" stroke="var(--muted)" stroke-width="1.4"/>
        <polygon points="60,214 124,166 244,166 308,214" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.8"/>
        <text x="132" y="186" class="svg-text svg-text--accent" font-size="8">M = cte (flexión pura)</text>

        <text x="56" y="236" class="svg-text svg-text--muted" font-size="8">Cortante</text>
        <line x1="60" y1="278" x2="308" y2="278" stroke="var(--line-strong)" stroke-dasharray="3 4"/>
        <path d="M60 260 L124 260 L124 278 L244 278 L244 296 L308 296" fill="none" stroke="var(--amber)" stroke-width="2.2"/>
        <text x="78" y="252" class="svg-text svg-text--amber" font-size="8">+F/2</text>
        <text x="168" y="272" class="svg-text svg-text--green" font-size="8">V = 0</text>
        <text x="264" y="288" class="svg-text svg-text--amber" font-size="8">−F/2</text>
      </svg>`,
      pins: [
        { n: 1, x: 124, y: 52, lx: 86, ly: 36, label: 'Dos cargas a L/4', q: '¿Dónde se aplican las cargas en 4 puntos?', detail: 'Dos cargas iguales, cada una a L/4 de su apoyo, dejando el tramo central L/2.' },
        { n: 2, x: 184, y: 174, lx: 240, ly: 200, label: 'Momento constante en L/2', q: '¿Cómo es el momento en el tramo central?', detail: 'Trapecial: constante y máximo en todo el tramo central. Se ensaya más volumen de material.' },
        { n: 3, x: 184, y: 268, lx: 204, ly: 256, label: 'Cortante V = 0 (flexión pura)', q: '¿Cuánto vale el cortante en el tramo central?', detail: 'V = 0 en L/2: no hay corte, sólo momento. Eso es flexión pura.' },
        { n: 4, x: 184, y: 84, lx: 184, ly: 148, label: 'Tramo central L/2', q: '¿Qué abarca el tramo de momento constante?', detail: 'Desde la primera carga hasta la segunda: L/2 de la luz total.' },
        { n: 5, x: 60, y: 84, lx: 60, ly: 200, label: 'Apoyo simple', q: '¿Cómo se sostiene la viga?', detail: 'Simplemente apoyada en los extremos, igual que en 3 puntos; cambia la ubicación de las cargas.' },
      ],
    },
  ],
};

const transicion = {
  id: 'transicion',
  unit: 'u6',
  title: 'Transición dúctil–frágil',
  subtitle: 'Aceros BCC vs. materiales FCC',
  key: 'transicion',
  notes: [
    'La temperatura de transición es el límite de seguridad: siempre se trabaja por encima de ella.',
    'Aluminio, cobre y aceros austeníticos (FCC) no presentan una transición marcada.',
  ],
  legend: [
    { color: 'accent', text: 'Acero BCC' },
    { color: 'green', text: 'Material FCC' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'Curva',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Curva de transición dúctil frágil">
        ${arrow('ar-tr')}
        <line x1="46" y1="250" x2="342" y2="250" class="svg-axis" marker-end="url(#ar-tr)"/>
        <line x1="46" y1="250" x2="46" y2="26" class="svg-axis" marker-end="url(#ar-tr)"/>
        <text x="8" y="34" class="svg-text svg-text--strong" font-size="8">Energía</text>
        <text x="8" y="45" class="svg-text svg-text--strong" font-size="8">(J)</text>
        <text x="292" y="268" class="svg-text svg-text--strong" font-size="9">Temperatura</text>

        <rect x="148" y="40" width="52" height="210" fill="var(--amber-soft)" opacity="0.55"/>
        <line x1="174" y1="40" x2="174" y2="250" stroke="var(--amber)" stroke-width="1.4" stroke-dasharray="4 4"/>
        <text x="184" y="34" text-anchor="middle" class="svg-text svg-text--amber" font-size="8">T transición</text>

        <path class="svg-curve svg-curve--accent" d="M52 70 L126 76 C 150 80, 156 150, 178 176 C 196 198, 230 214, 320 218"/>
        <path d="M52 96 C 120 100, 160 120, 210 128 C 250 134, 290 136, 320 138" fill="none" stroke="var(--green)" stroke-width="2.2" stroke-dasharray="7 4"/>

        <text x="64" y="62" class="svg-text svg-text--muted" font-size="8">meseta superior (dúctil)</text>
        <text x="232" y="236" class="svg-text svg-text--muted" font-size="8">meseta inferior (clivaje)</text>
        <text x="232" y="124" class="svg-text svg-text--green" font-size="8">FCC: sin transición</text>
        <text x="84" y="268" class="svg-text svg-text--muted" font-size="8">−40 °C</text>
        <text x="172" y="268" class="svg-text svg-text--muted" font-size="8">0 °C</text>
        <text x="246" y="268" class="svg-text svg-text--muted" font-size="8">+40 °C</text>
      </svg>`,
      pins: [
        { n: 1, x: 86, y: 73, lx: 116, ly: 44, label: 'Meseta superior dúctil', q: '¿Qué representa la meseta superior?', detail: 'Alta absorción de energía: fractura dúctil, típica de temperaturas por encima de la transición.' },
        { n: 2, x: 260, y: 216, lx: 262, ly: 246, label: 'Meseta inferior frágil', q: '¿Qué representa la meseta inferior?', detail: 'Baja energía de impacto: clivaje, fractura frágil a baja temperatura.' },
        { n: 3, x: 174, y: 120, lx: 122, ly: 108, label: 'Temperatura de transición', q: '¿Qué marca la línea vertical?', detail: 'La temperatura de transición entre comportamiento dúctil y frágil: es el límite de seguridad de servicio.' },
        { n: 4, x: 306, y: 146, lx: 282, ly: 174, label: 'Material FCC sin transición', q: '¿Qué material representa la curva verde punteada?', detail: 'Un material FCC (aluminio, cobre, acero austenítico): mantiene alta energía a baja temperatura.' },
        { n: 5, x: 46, y: 150, lx: 74, ly: 190, label: 'Energía absorbida (J)', q: '¿Qué se mide en el eje vertical?', detail: 'La energía absorbida en el ensayo de impacto, en J o ft·lbf.' },
      ],
    },
  ],
};

const snWohler = {
  id: 'sn-wohler',
  unit: 'u6',
  title: 'Curva S–N (Wöhler)',
  subtitle: 'Acero vs. aluminio',
  key: 'sn',
  notes: [
    'El acero se aplana entre 10⁶ y 10⁷ ciclos: ese escalón es el límite de fatiga Se.',
    'El aluminio nunca se aplana: no tiene límite de fatiga definido.',
  ],
  legend: [
    { color: 'accent', text: 'Acero (con límite)' },
    { color: 'amber', text: 'Aluminio (sin límite)' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'S–N',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Curva S N de fatiga">
        ${arrow('ar-sn')}
        <line x1="50" y1="246" x2="340" y2="246" class="svg-axis" marker-end="url(#ar-sn)"/>
        <line x1="50" y1="246" x2="50" y2="30" class="svg-axis" marker-end="url(#ar-sn)"/>
        <text x="10" y="42" class="svg-text svg-text--strong" font-size="8">S (MPa)</text>
        <text x="312" y="288" class="svg-text svg-text--strong" font-size="8">N (log)</text>

        <text x="96" y="266" class="svg-text svg-text--muted" font-size="8">10³</text>
        <text x="166" y="266" class="svg-text svg-text--muted" font-size="8">10⁶</text>
        <text x="226" y="266" class="svg-text svg-text--muted" font-size="8">10⁷</text>
        <text x="300" y="266" class="svg-text svg-text--muted" font-size="8">10⁸</text>

        <path class="svg-curve svg-curve--accent" d="M60 62 C 110 96, 150 140, 180 158 L 320 158"/>
        <path class="svg-curve svg-curve--amber" d="M60 88 C 120 132, 180 180, 240 204 C 270 216, 300 224, 322 228"/>
        <line x1="50" y1="158" x2="180" y2="158" stroke="var(--line-strong)" stroke-dasharray="3 4"/>
        <text x="56" y="152" class="svg-text svg-text--accent" font-size="8">Se</text>
        <line x1="180" y1="158" x2="180" y2="246" stroke="var(--line-strong)" stroke-dasharray="3 4"/>
        <text x="196" y="146" class="svg-text svg-text--accent" font-size="8">meseta: ciclos infinitos</text>
        <text x="248" y="240" class="svg-text svg-text--amber" font-size="8">sigue bajando</text>
      </svg>`,
      pins: [
        { n: 1, x: 102, y: 96, lx: 154, ly: 60, label: 'Acero: curva con meseta', q: '¿Qué material tiene meseta horizontal?', detail: 'Los aceros (y el titanio) se aplanan entre 10⁶ y 10⁷ ciclos: existe un límite de fatiga Se.' },
        { n: 2, x: 268, y: 214, lx: 268, ly: 238, label: 'Aluminio: sin límite definido', q: '¿Qué material no tiene límite de fatiga definido?', detail: 'Los no ferrosos (aluminio, latón, magnesio) siguen bajando: se informa resistencia a la fatiga para un N fijo.' },
        { n: 3, x: 80, y: 158, lx: 86, ly: 136, label: 'Límite de fatiga Se', q: '¿Qué valor indica el nivel horizontal?', detail: 'El límite de fatiga: por debajo de ese esfuerzo el acero soporta ciclos infinitos.' },
        { n: 4, x: 204, y: 238, lx: 210, ly: 284, label: 'Entre 10⁶ y 10⁷ ciclos', q: '¿Entre qué ciclos aparece la meseta del acero?', detail: 'Entre 10⁶ y 10⁷ ciclos. Es el dato que no puede faltar en la respuesta de fatiga.' },
      ],
    },
  ],
};

const dureza = {
  id: 'dureza',
  unit: 'u6',
  title: 'Huellas de los ensayos de dureza',
  subtitle: 'Brinell, Rockwell, Vickers y Knoop',
  key: 'dureza-huellas',
  notes: [
    'Brinell y Vickers se miden con microscopio; Rockwell lee directamente la profundidad.',
    'Knoop penetra muy poco: ideal para cerámicos y recubrimientos delgados.',
  ],
  legend: [
    { color: 'amber', text: 'Brinell: diámetro d' },
    { color: 'violet', text: 'Rockwell: profundidad' },
    { color: 'accent', text: 'Vickers: dos diagonales' },
    { color: 'green', text: 'Knoop: diagonal larga' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'Huellas',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Huellas de dureza">
        ${arrow('ar-du')}
        <rect x="12" y="16" width="164" height="124" rx="10" fill="var(--surface)" stroke="var(--line)"/>
        <text x="26" y="36" class="svg-text svg-text--strong" font-size="9">Brinell (HB)</text>
        <circle cx="94" cy="86" r="34" fill="var(--amber-soft)" stroke="var(--amber)" stroke-width="2"/>
        <line x1="64" y1="86" x2="124" y2="86" stroke="var(--amber)" stroke-width="1.4" marker-start="url(#ar-du)" marker-end="url(#ar-du)"/>
        <text x="86" y="102" class="svg-text svg-text--amber" font-size="8">d</text>
        <text x="26" y="132" class="svg-text svg-text--muted" font-size="7.5">esfera 10 mm · 3000/500 kgf</text>

        <rect x="184" y="16" width="164" height="124" rx="10" fill="var(--surface)" stroke="var(--line)"/>
        <text x="198" y="36" class="svg-text svg-text--strong" font-size="9">Rockwell (HR)</text>
        <path d="M266 46 L290 96 L242 96 Z" fill="var(--violet-soft)" stroke="var(--violet)" stroke-width="2"/>
        <line x1="266" y1="46" x2="266" y2="118" stroke="var(--violet)" stroke-width="1.3" stroke-dasharray="3 3"/>
        <text x="272" y="112" class="svg-text svg-text--violet" font-size="7.5">profundidad</text>
        <text x="198" y="132" class="svg-text svg-text--muted" font-size="7.5">cono 120° o bola</text>

        <rect x="12" y="156" width="164" height="128" rx="10" fill="var(--surface)" stroke="var(--line)"/>
        <text x="26" y="176" class="svg-text svg-text--strong" font-size="9">Vickers (HV)</text>
        <path d="M94 196 L126 228 L94 260 L62 228 Z" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
        <line x1="62" y1="228" x2="126" y2="228" stroke="var(--accent)" stroke-width="1.3"/>
        <line x1="94" y1="196" x2="94" y2="260" stroke="var(--accent)" stroke-width="1.3"/>
        <text x="94" y="276" text-anchor="middle" class="svg-text svg-text--muted" font-size="7.5">pirámide cuadrada</text>

        <rect x="184" y="156" width="164" height="128" rx="10" fill="var(--surface)" stroke="var(--line)"/>
        <text x="198" y="176" class="svg-text svg-text--strong" font-size="9">Knoop (HK)</text>
        <path d="M266 196 L292 226 L266 256 L240 226 Z" fill="var(--green-soft)" stroke="var(--green)" stroke-width="2"/>
        <line x1="240" y1="226" x2="292" y2="226" stroke="var(--green)" stroke-width="1.3"/>
        <text x="266" y="276" text-anchor="middle" class="svg-text svg-text--muted" font-size="7.5">rombo alargado · 500 g</text>
      </svg>`,
      pins: [
        { n: 1, x: 94, y: 86, lx: 92, ly: 60, label: 'Brinell: se mide el diámetro d', q: '¿Qué se mide en la huella Brinell?', detail: 'El diámetro promedio d de la impronta dejada por una esfera de 10 mm, con lupa o microscopio.' },
        { n: 2, x: 266, y: 80, lx: 266, ly: 62, label: 'Rockwell: se mide la profundidad', q: '¿Qué mide el durómetro Rockwell?', detail: 'La profundidad de penetración, de forma automática y sin microscopio. Usa precarga.' },
        { n: 3, x: 94, y: 232, lx: 94, ly: 208, label: 'Vickers: dos diagonales', q: '¿Qué se mide en la huella Vickers?', detail: 'Las dos diagonales de la pirámide de base cuadrada, al microscopio.' },
        { n: 4, x: 266, y: 226, lx: 266, ly: 202, label: 'Knoop: sólo la diagonal larga', q: '¿Qué se mide en la huella Knoop?', detail: 'Sólo la diagonal larga de la pirámide romboidal alargada. Penetra menos: capas delgadas y cerámicos.' },
      ],
    },
  ],
};

export const U6_DIAGRAMS = [
  curvaSigmaEpsilon,
  impacto,
  transicion,
];
