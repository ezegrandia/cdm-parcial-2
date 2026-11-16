/* ============================================================
   diagrams/u10.js — reacciones de 3 fases, fronteras y curvas
   ============================================================ */

const arrow = (id) => `
  <defs>
    <marker id="${id}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 1 L10 5 L0 9 z" fill="var(--muted)"/>
    </marker>
  </defs>`;

/* ---------- 5 reacciones en un solo esquema ---------- */

const panel = (x, y, title, equation, drawing, pin) => `
  <g>
    <rect x="${x}" y="${y}" width="170" height="78" rx="7" fill="var(--bg-soft)" stroke="var(--line)"/>
    <text x="${x + 8}" y="${y + 14}" class="svg-text svg-text--strong" font-size="7.5">${title}</text>
    <text x="${x + 8}" y="${y + 25}" class="svg-text svg-text--rose" font-size="6.6">${equation}</text>
    ${drawing}
  </g>`;

const reacciones = {
  id: 'reacciones',
  unit: 'u10',
  title: 'Las 5 reacciones de tres fases',
  subtitle: 'Los esquemas del PDF, uno por pestaña',
  key: 'reacciones',
  cta: { href: '#/practica/dibujar', label: 'Dibujar las reacciones desde cero' },
  notes: [
    'La línea horizontal es la temperatura de la reacción. Mirá qué fases hay arriba y abajo del punto central.',
    'Eu = 1 fase → 2 · Peri = 2 fases → 1 · -oide = todo sólido, sin líquido.',
    'Cada pestaña reproduce el esquema de la cátedra: α y β a los costados, L o γ en la cúspide y la mezcla debajo.',
    'Para entrenar de verdad, <a class="inline-link" href="#/practica/dibujar">dibujá cada reacción desde cero</a>.',
  ],
  legend: [
    { color: 'rose', text: 'Línea de reacción' },
    { color: 'accent', text: 'Líquido' },
    { color: 'green', text: 'Sólidos' },
  ],
  variants: [
    {
      key: 'eutectica',
      label: 'Eutéctica',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Esquema de la reacción eutéctica L a alfa más beta">
        <text x="180" y="25" text-anchor="middle" class="svg-text svg-text--rose" font-size="9">L → α + β</text>
        <line x1="82" y1="170" x2="278" y2="170" stroke="var(--rose)" stroke-width="1.6"/>
        <path d="M82 170 C72 160, 64 151, 58 142" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M82 170 C72 180, 64 189, 58 198" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M278 170 C288 160, 296 151, 302 142" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M278 170 C288 180, 296 189, 302 198" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M150 72 L180 170 L210 72" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
        <text x="82" y="158" class="svg-text svg-text--green" font-size="10">α</text>
        <text x="278" y="158" class="svg-text svg-text--green" font-size="10">β</text>
        <text x="180" y="103" text-anchor="middle" class="svg-text svg-text--accent" font-size="10">L</text>
        <text x="180" y="205" text-anchor="middle" class="svg-text svg-text--muted" font-size="9">α + β</text>
        <text x="180" y="286" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">Una fase líquida se separa en dos sólidos</text>
      </svg>`,
      pins: [
        { n: 1, x: 180, y: 170, lx: 180, ly: 145, label: 'Línea eutéctica', q: '¿Qué reacción ocurre en la línea?', detail: 'L → α + β: un líquido se transforma en dos sólidos distintos a temperatura constante.' },
        { n: 2, x: 180, y: 78, lx: 180, ly: 60, label: 'Líquido L', q: '¿Qué fase hay arriba del centro?', detail: 'Líquido. La cúspide con forma de V es la zona líquida que llega hasta el punto eutéctico.' },
        { n: 3, x: 55, y: 145, lx: 55, ly: 127, label: 'Fase α', q: '¿Qué fase hay a la izquierda?', detail: 'α: solución sólida rica en el componente de la izquierda.' },
        { n: 4, x: 305, y: 145, lx: 305, ly: 127, label: 'Fase β', q: '¿Qué fase hay a la derecha?', detail: 'β: solución sólida rica en el componente de la derecha.' },
        { n: 5, x: 180, y: 230, lx: 180, ly: 250, label: 'Zona α + β', q: '¿Qué hay debajo de la línea?', detail: 'Las dos fases sólidas α y β. Es el microconstituyente eutéctico.' },
      ],
    },
    {
      key: 'peritectica',
      label: 'Peritéctica',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Esquema de la reacción peritéctica alfa más líquido a beta">
        <text x="180" y="25" text-anchor="middle" class="svg-text svg-text--rose" font-size="9">α + L → β</text>
        <line x1="82" y1="170" x2="296" y2="170" stroke="var(--rose)" stroke-width="1.6"/>
        <path d="M82 170 C72 160, 64 151, 58 142" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M82 170 C72 180, 64 189, 58 198" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M296 170 C286 158, 278 150, 272 140" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M296 170 C306 180, 314 189, 320 198" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M180 170 L162 200 M180 170 L198 200" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <text x="82" y="158" class="svg-text svg-text--green" font-size="10">α</text>
        <text x="296" y="158" class="svg-text svg-text--green" font-size="10">L</text>
        <text x="142" y="125" class="svg-text svg-text--amber" font-size="9">α + L</text>
        <text x="180" y="192" text-anchor="middle" class="svg-text svg-text--green" font-size="10">β</text>
        <text x="180" y="286" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">Un sólido y un líquido se combinan en un sólido</text>
      </svg>`,
      pins: [
        { n: 1, x: 180, y: 170, lx: 180, ly: 145, label: 'Línea peritéctica', q: '¿Qué reacción ocurre en la línea?', detail: 'α + L → β: dos fases (un sólido y un líquido) se combinan para formar un nuevo sólido.' },
        { n: 2, x: 112, y: 100, lx: 100, ly: 82, label: 'Zona α + L', q: '¿Qué hay arriba, a la izquierda?', detail: 'α + L: el sólido α y el líquido conviven antes de la reacción.' },
        { n: 3, x: 55, y: 145, lx: 55, ly: 127, label: 'Fase α', q: '¿Qué fase hay a la izquierda?', detail: 'α: el sólido que entra en la reacción peritéctica.' },
        { n: 4, x: 318, y: 138, lx: 318, ly: 120, label: 'Líquido L', q: '¿Qué fase hay a la derecha?', detail: 'L: el líquido que entra en la reacción peritéctica.' },
        { n: 5, x: 180, y: 210, lx: 180, ly: 228, label: 'Fase β', q: '¿Qué fase hay debajo del centro?', detail: 'β: el nuevo sólido que se forma por la reacción α + L → β.' },
      ],
    },
    {
      key: 'monotectica',
      label: 'Monotéctica',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Esquema de la reacción monotéctica L uno a L dos más alfa">
        <text x="180" y="25" text-anchor="middle" class="svg-text svg-text--rose" font-size="9">L₁ → L₂ + α</text>
        <line x1="60" y1="170" x2="316" y2="170" stroke="var(--rose)" stroke-width="1.6"/>
        <path d="M28 210 C38 190, 48 180, 60 170 C78 120, 112 84, 148 80 C188 78, 214 118, 224 170" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M224 170 C244 152, 264 138, 286 128" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M316 170 C324 158, 330 150, 336 142" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M316 170 C324 180, 330 189, 336 198" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <text x="72" y="132" class="svg-text svg-text--violet" font-size="10">L₂</text>
        <text x="232" y="112" class="svg-text svg-text--accent" font-size="10">L₁</text>
        <text x="316" y="155" class="svg-text svg-text--green" font-size="10">α</text>
        <text x="180" y="208" text-anchor="middle" class="svg-text svg-text--muted" font-size="9">α + L₂</text>
        <text x="102" y="62" class="svg-text svg-text--muted" font-size="7">zona de miscibilidad</text>
        <path d="M138 68 C150 80, 160 98, 168 118" fill="none" stroke="var(--muted)" stroke-width="1" marker-end="url(#ar-mono)"/>
        <defs><marker id="ar-mono" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 1 L10 5 L0 9 z" fill="var(--muted)"/></marker></defs>
        <text x="180" y="286" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">Un líquido se separa en otro líquido y un sólido</text>
      </svg>`,
      pins: [
        { n: 1, x: 180, y: 170, lx: 180, ly: 145, label: 'Línea monotéctica', q: '¿Qué reacción ocurre en la línea?', detail: 'L₁ → L₂ + α: un líquido se separa en otro líquido de distinta composición y un sólido.' },
        { n: 2, x: 55, y: 145, lx: 52, ly: 124, label: 'Líquido L₂', q: '¿Qué líquido queda a la izquierda?', detail: 'L₂: el líquido pobre en soluto que queda separado del L₁.' },
        { n: 3, x: 258, y: 90, lx: 258, ly: 72, label: 'Líquido L₁', q: '¿Qué líquido está en la cúpula?', detail: 'L₁: el líquido rico en soluto, dentro de la zona de miscibilidad.' },
        { n: 4, x: 336, y: 135, lx: 330, ly: 118, label: 'Fase α', q: '¿Qué sólido se forma?', detail: 'α: el sólido que precipita junto con L₂.' },
        { n: 5, x: 180, y: 235, lx: 180, ly: 255, label: 'Zona α + L₂', q: '¿Qué hay debajo de la línea?', detail: 'α + L₂: el sólido α y el líquido L₂ en equilibrio.' },
      ],
    },
    {
      key: 'eutectoide',
      label: 'Eutectoide',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Esquema de la reacción eutectoide gamma a alfa más beta">
        <text x="180" y="25" text-anchor="middle" class="svg-text svg-text--rose" font-size="9">γ → α + β</text>
        <line x1="82" y1="170" x2="278" y2="170" stroke="var(--rose)" stroke-width="1.6"/>
        <path d="M82 170 C72 160, 64 151, 58 142" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M82 170 C72 180, 64 189, 58 198" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M278 170 C288 160, 296 151, 302 142" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M278 170 C288 180, 296 189, 302 198" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M150 72 L180 170 L210 72" fill="none" stroke="var(--amber)" stroke-width="2.2"/>
        <text x="82" y="158" class="svg-text svg-text--green" font-size="10">α</text>
        <text x="278" y="158" class="svg-text svg-text--green" font-size="10">β</text>
        <text x="180" y="103" text-anchor="middle" class="svg-text svg-text--amber" font-size="10">γ</text>
        <text x="180" y="205" text-anchor="middle" class="svg-text svg-text--muted" font-size="9">α + β</text>
        <text x="180" y="286" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">Un sólido se transforma en dos sólidos</text>
      </svg>`,
      pins: [
        { n: 1, x: 180, y: 170, lx: 180, ly: 145, label: 'Línea eutectoide', q: '¿Qué reacción ocurre en la línea?', detail: 'γ → α + β: un sólido γ se transforma en dos sólidos α y β. Todo ocurre en estado sólido.' },
        { n: 2, x: 180, y: 78, lx: 180, ly: 60, label: 'Fase γ', q: '¿Qué fase hay arriba del centro?', detail: 'γ: el sólido que se descompone en α + β. La cúspide es de fase sólida, no líquida.' },
        { n: 3, x: 55, y: 145, lx: 55, ly: 127, label: 'Fase α', q: '¿Qué fase hay a la izquierda?', detail: 'α: uno de los dos sólidos que se forman.' },
        { n: 4, x: 305, y: 145, lx: 305, ly: 127, label: 'Fase β', q: '¿Qué fase hay a la derecha?', detail: 'β: el otro sólido que se forma.' },
        { n: 5, x: 180, y: 230, lx: 180, ly: 250, label: 'Zona α + β', q: '¿Qué hay debajo de la línea?', detail: 'α + β: los dos sólidos resultantes, sin líquido.' },
      ],
    },
    {
      key: 'peritectoide',
      label: 'Peritectoide',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Esquema de la reacción peritectoide alfa más beta a gamma">
        <text x="180" y="25" text-anchor="middle" class="svg-text svg-text--rose" font-size="9">α + β → γ</text>
        <line x1="82" y1="170" x2="278" y2="170" stroke="var(--rose)" stroke-width="1.6"/>
        <path d="M82 170 C72 160, 64 151, 58 142" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M82 170 C72 180, 64 189, 58 198" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M278 170 C288 160, 296 151, 302 142" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M278 170 C288 180, 296 189, 302 198" fill="none" stroke="var(--green)" stroke-width="2.2"/>
        <path d="M180 170 L162 200 M180 170 L198 200" fill="none" stroke="var(--amber)" stroke-width="2.2"/>
        <text x="82" y="158" class="svg-text svg-text--green" font-size="10">α</text>
        <text x="278" y="158" class="svg-text svg-text--green" font-size="10">β</text>
        <text x="180" y="115" text-anchor="middle" class="svg-text svg-text--amber" font-size="9">α + β</text>
        <text x="180" y="192" text-anchor="middle" class="svg-text svg-text--amber" font-size="10">γ</text>
        <text x="180" y="286" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">Dos sólidos se combinan en un tercer sólido</text>
      </svg>`,
      pins: [
        { n: 1, x: 180, y: 170, lx: 180, ly: 145, label: 'Línea peritectoide', q: '¿Qué reacción ocurre en la línea?', detail: 'α + β → γ: dos sólidos se combinan para formar un tercer sólido γ. Todo en estado sólido.' },
        { n: 2, x: 180, y: 72, lx: 180, ly: 54, label: 'Zona α + β', q: '¿Qué hay arriba del centro?', detail: 'α + β: los dos sólidos que entran en la reacción.' },
        { n: 3, x: 55, y: 145, lx: 55, ly: 127, label: 'Fase α', q: '¿Qué fase hay a la izquierda?', detail: 'α: uno de los sólidos de entrada.' },
        { n: 4, x: 305, y: 145, lx: 305, ly: 127, label: 'Fase β', q: '¿Qué fase hay a la derecha?', detail: 'β: el otro sólido de entrada.' },
        { n: 5, x: 180, y: 210, lx: 180, ly: 228, label: 'Fase γ', q: '¿Qué fase hay debajo del centro?', detail: 'γ: el nuevo sólido que se forma por la reacción α + β → γ.' },
      ],
    },
  ],
};

/* ---------- fronteras liquidus / solidus / solvus ---------- */

const fronteras = {
  id: 'fronteras',
  unit: 'u10',
  title: 'Liquidus, solidus y solvus',
  subtitle: 'Esquema de una aleación eutéctica',
  key: 'fronteras',
  notes: [
    'Liquidus: L ↔ L + sólido. Solidus: sólido ↔ sólido + líquido. Solvus: α ↔ α + β.',
    'El eutéctico Pb–Sn está en 61,9 % Sn y 183 °C; α máxima 19 % Sn, β 97,5 % Sn.',
    'El diagrama Pb–Sn completo no entra como tema: este esquema es para leer las fronteras y la curva.',
  ],
  legend: [
    { color: 'accent', text: 'Liquidus' },
    { color: 'green', text: 'Solidus / solvus' },
    { color: 'rose', text: 'Isoterma eutéctica' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'Esquema Pb–Sn',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Esquema de fronteras liquidus, solidus y solvus en una aleación eutéctica">
        ${arrow('ar-fr10')}
        <line x1="55" y1="250" x2="344" y2="250" class="svg-axis" marker-end="url(#ar-fr10)"/>
        <line x1="55" y1="250" x2="55" y2="28" class="svg-axis" marker-end="url(#ar-fr10)"/>
        <text x="20" y="40" class="svg-text svg-text--strong" font-size="9">T</text>
        <text x="198" y="286" text-anchor="middle" class="svg-text svg-text--strong" font-size="8">% en peso de Sn</text>
        <text x="55" y="266" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">Pb</text>
        <text x="340" y="266" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">Sn</text>

        <line x1="104" y1="160" x2="326" y2="160" stroke="var(--rose)" stroke-width="1.6" stroke-dasharray="5 4"/>
        <text x="210" y="180" text-anchor="middle" class="svg-text svg-text--rose" font-size="6.8">183 °C</text>

        <path d="M55 60 C105 84, 170 122, 230 160" fill="none" stroke="var(--accent)" stroke-width="2.4"/>
        <path d="M340 50 C300 84, 260 122, 230 160" fill="none" stroke="var(--accent)" stroke-width="2.4"/>
        <path d="M55 60 C72 92, 90 130, 104 160" fill="none" stroke="var(--green)" stroke-width="2.1"/>
        <path d="M340 50 C334 92, 330 130, 326 160" fill="none" stroke="var(--green)" stroke-width="2.1"/>
        <path d="M104 160 C92 196, 82 224, 72 250" fill="none" stroke="var(--green)" stroke-width="2.1"/>
        <path d="M326 160 C330 196, 332 224, 334 250" fill="none" stroke="var(--green)" stroke-width="2.1"/>

        <text x="110" y="105" class="svg-text svg-text--accent" font-size="8">L + α</text>
        <text x="276" y="105" class="svg-text svg-text--accent" font-size="8">L + β</text>
        <text x="170" y="72" class="svg-text svg-text--accent" font-size="9">L</text>
        <text x="235" y="235" class="svg-text svg-text--amber" font-size="8">α + β</text>

        <text x="162" y="95" class="svg-text svg-text--accent" font-size="6.5">liquidus</text>
        <text x="54" y="140" class="svg-text svg-text--green" font-size="6.5">solidus</text>
        <text x="50" y="228" class="svg-text svg-text--green" font-size="6.5">solvus</text>
        <text x="262" y="182" class="svg-text svg-text--rose" font-size="6.5">eutéctico</text>
      </svg>`,
      pins: [
        { n: 1, x: 143, y: 104, lx: 145, ly: 88, label: 'Liquidus', q: '¿Qué separa el liquidus?', detail: 'Separa L (todo líquido) de L + sólido. Al cruzarlo empieza a formarse el primer sólido.' },
        { n: 2, x: 82, y: 116, lx: 100, ly: 128, label: 'Solidus', q: '¿Qué separa el solidus?', detail: 'Separa sólido de sólido + líquido. Al cruzarlo desaparece la última gota de líquido.' },
        { n: 3, x: 83, y: 220, lx: 110, ly: 232, label: 'Solvus', q: '¿Qué separa el solvus?', detail: 'Separa una solución sólida α de α + β (dos sólidos). Al cruzarlo precipita la segunda fase sólida; no hay líquido.' },
        { n: 4, x: 230, y: 160, lx: 260, ly: 142, label: 'Punto eutéctico', q: '¿Qué indica el punto eutéctico?', detail: 'Composición y temperatura donde el líquido se transforma en α + β a temperatura constante. En Pb–Sn: 61,9 % Sn y 183 °C.' },
        { n: 5, x: 70, y: 185, lx: 88, ly: 170, label: 'Fase α', q: '¿Qué hay en la zona α?', detail: 'Una solución sólida de Sn en Pb, con solubilidad máxima de 19 % Sn.' },
        { n: 6, x: 334, y: 195, lx: 310, ly: 180, label: 'Fase β', q: '¿Qué hay en la zona β?', detail: 'Una solución sólida de Pb en Sn, con solubilidad máxima de 97,5 % Sn.' },
        { n: 7, x: 150, y: 140, lx: 160, ly: 156, label: 'Zona L + α', q: '¿Qué hay entre liquidus y solidus?', detail: 'Líquido y α en equilibrio. La composición y cantidad de cada fase cambian con la temperatura.' },
        { n: 8, x: 190, y: 235, lx: 220, ly: 250, label: 'Zona α + β', q: '¿Qué hay por debajo del solvus?', detail: 'Dos fases sólidas, α y β. Es la región del eutéctico sólido; no hay líquido.' },
      ],
    },
  ],
};

/* ---------- curvas U10 ---------- */

const curvasU10 = {
  id: 'curvas-u10',
  unit: 'u10',
  title: 'Curvas de enfriamiento U10',
  subtitle: 'Eutéctica, hipoeutéctica y comparación U8–U9–U10',
  key: 'curvas-u10',
  cta: { href: '#/practica/dibujar', label: 'Dibujar las curvas desde cero' },
  notes: [
    'Eutéctica: una sola meseta horizontal porque solidifica a una sola temperatura.',
    'Hipoeutéctica: codo en el liquidus (α primaria) y después la meseta eutéctica.',
    'Comparación: U8 = una meseta; U9 = dos quiebres sin meseta; U10 = meseta eutéctica.',
    'Para practicar, <a class="inline-link" href="#/practica/dibujar">dibujá las curvas desde cero</a>.',
  ],
  legend: [
    { color: 'accent', text: 'Líquido' },
    { color: 'amber', text: 'L + sólido / primaria' },
    { color: 'green', text: 'Sólido' },
    { color: 'rose', text: 'Meseta / liquidus' },
  ],
  variants: [
    {
      key: 'eutectica',
      label: 'Eutéctica',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Curva de enfriamiento de una aleación eutéctica">
        ${arrow('ar-c10e')}
        <line x1="56" y1="250" x2="344" y2="250" class="svg-axis" marker-end="url(#ar-c10e)"/>
        <line x1="56" y1="250" x2="56" y2="28" class="svg-axis" marker-end="url(#ar-c10e)"/>
        <text x="20" y="40" class="svg-text svg-text--strong" font-size="9">T</text>
        <text x="326" y="268" class="svg-text svg-text--strong" font-size="9">t</text>
        <line x1="58" y1="165" x2="336" y2="165" stroke="var(--rose)" stroke-width="1.4" stroke-dasharray="5 4"/>
        <text x="64" y="158" class="svg-text svg-text--rose" font-size="7">TE · 183 °C</text>
        <path d="M72 48 Q112 145 152 165" fill="none" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M152 165 L250 165" fill="none" stroke="var(--amber)" stroke-width="4" stroke-linecap="round"/>
        <path d="M250 165 Q290 190 318 244" fill="none" stroke="var(--green)" stroke-width="2.8" stroke-linecap="round"/>
        <text x="90" y="95" class="svg-text svg-text--accent" font-size="9">L</text>
        <text x="152" y="140" text-anchor="middle" class="svg-text svg-text--amber" font-size="7.5">L → α + β</text>
        <text x="322" y="210" class="svg-text svg-text--green" font-size="9">α + β</text>
        <text x="195" y="192" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">una sola meseta</text>
      </svg>`,
      pins: [
        { n: 1, x: 72, y: 48, lx: 105, ly: 36, label: 'Líquido', q: '¿Qué hay antes de la meseta?', detail: 'La aleación está 100 % líquida y se enfría hasta la temperatura eutéctica.' },
        { n: 2, x: 152, y: 165, lx: 120, ly: 180, label: 'Inicio de la meseta', q: '¿Qué ocurre al llegar a TE?', detail: 'Empieza la reacción eutéctica L → α + β. La temperatura se detiene porque el calor latente compensa el calor extraído.' },
        { n: 3, x: 250, y: 165, lx: 275, ly: 148, label: 'Fin de la meseta', q: '¿Qué marca el final de la meseta?', detail: 'Se terminó el líquido: todo es α + β. Desde acá el sólido vuelve a enfriarse y la temperatura baja.' },
        { n: 4, x: 300, y: 226, lx: 310, ly: 242, label: 'Sólido α + β', q: '¿Qué hay después de la meseta?', detail: 'El eutéctico sólido α + β se sigue enfriando. No hay más cambios de fase.' },
        { n: 5, x: 200, y: 165, lx: 200, ly: 210, label: 'Meseta = estabilización simple', q: '¿Por qué hay una sola meseta?', detail: 'Porque la aleación eutéctica solidifica a una sola temperatura. Es la estabilización térmica simple.' },
      ],
    },
    {
      key: 'hipoeutectica',
      label: 'Hipoeutéctica',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Curva de enfriamiento de una aleación hipoeutéctica">
        ${arrow('ar-c10h')}
        <line x1="56" y1="250" x2="344" y2="250" class="svg-axis" marker-end="url(#ar-c10h)"/>
        <line x1="56" y1="250" x2="56" y2="28" class="svg-axis" marker-end="url(#ar-c10h)"/>
        <text x="20" y="40" class="svg-text svg-text--strong" font-size="9">T</text>
        <text x="326" y="268" class="svg-text svg-text--strong" font-size="9">t</text>
        <line x1="58" y1="165" x2="336" y2="165" stroke="var(--rose)" stroke-width="1.4" stroke-dasharray="5 4"/>
        <text x="64" y="158" class="svg-text svg-text--rose" font-size="7">TE · 183 °C</text>
        <path d="M72 48 Q95 100 125 108" fill="none" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M125 108 Q160 160 182 165" fill="none" stroke="var(--amber)" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M182 165 L252 165" fill="none" stroke="var(--amber)" stroke-width="4" stroke-linecap="round"/>
        <path d="M252 165 Q292 190 318 244" fill="none" stroke="var(--green)" stroke-width="2.8" stroke-linecap="round"/>
        <text x="88" y="88" class="svg-text svg-text--accent" font-size="9">L</text>
        <text x="120" y="148" class="svg-text svg-text--amber" font-size="7.5">α + L</text>
        <text x="215" y="152" text-anchor="middle" class="svg-text svg-text--amber" font-size="7">L → eutéctico</text>
        <text x="282" y="192" class="svg-text svg-text--green" font-size="8">α + eutéctico</text>
        <text x="158" y="92" class="svg-text svg-text--rose" font-size="6.5">codo liquidus</text>
      </svg>`,
      pins: [
        { n: 1, x: 72, y: 48, lx: 102, ly: 36, label: 'Líquido', q: '¿Qué hay al inicio?', detail: 'La aleación está líquida y se enfría hasta el liquidus.' },
        { n: 2, x: 125, y: 108, lx: 105, ly: 120, label: 'Codo del liquidus', q: '¿Qué significa el codo?', detail: 'Empieza a precipitar la fase primaria α, rica en el componente principal. La temperatura sigue bajando por α + L.' },
        { n: 3, x: 215, y: 165, lx: 222, ly: 145, label: 'Meseta eutéctica', q: '¿Qué solidifica en la meseta?', detail: 'El líquido restante se transforma en eutéctico α + β a TE. La meseta es la misma que en la eutéctica.' },
        { n: 4, x: 300, y: 226, lx: 300, ly: 242, label: 'Sólido α + eutéctico', q: '¿Cuál es la estructura final?', detail: 'α primaria (más gruesa, formada antes) rodeada de eutéctico laminar. Es una aleación hipoeutéctica.' },
        { n: 5, x: 150, y: 132, lx: 178, ly: 118, label: 'α primaria', q: '¿Qué fase primaria precipita?', detail: 'En la hipoeutéctica precipita α primaria. En la hipereutéctica precipitaría β primaria.' },
      ],
    },
    {
      key: 'comparar',
      label: 'Comparar U8–U9–U10',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Comparación de las curvas de enfriamiento de U8, U9 y U10">
        ${arrow('ar-c10c')}
        <g>
          <rect x="8" y="26" width="108" height="232" rx="7" fill="var(--bg-soft)" stroke="var(--line)"/>
          <text x="62" y="42" text-anchor="middle" class="svg-text svg-text--strong" font-size="7.5">U8 · puro</text>
          <line x1="24" y1="222" x2="104" y2="222" stroke="var(--line-strong)"/>
          <line x1="24" y1="222" x2="24" y2="54" stroke="var(--line-strong)"/>
          <path d="M28 66 Q42 120 54 140" fill="none" stroke="var(--accent)" stroke-width="2.4"/>
          <path d="M82 140 Q90 145 98 204" fill="none" stroke="var(--accent)" stroke-width="2.4"/>
          <line x1="54" y1="140" x2="82" y2="140" stroke="var(--amber)" stroke-width="3.4"/>
          <text x="86" y="132" text-anchor="middle" class="svg-text svg-text--amber" font-size="6">Tf</text>
        </g>
        <g>
          <rect x="126" y="26" width="108" height="232" rx="7" fill="var(--bg-soft)" stroke="var(--line)"/>
          <text x="180" y="42" text-anchor="middle" class="svg-text svg-text--strong" font-size="7.5">U9 · isomorfa</text>
          <line x1="142" y1="222" x2="222" y2="222" stroke="var(--line-strong)"/>
          <line x1="142" y1="222" x2="142" y2="54" stroke="var(--line-strong)"/>
          <path d="M146 66 Q158 120 182 142 Q205 190 218 210" fill="none" stroke="var(--accent)" stroke-width="2.4"/>
          <text x="188" y="112" class="svg-text svg-text--accent" font-size="6">2 quiebres</text>
          <text x="184" y="214" class="svg-text svg-text--green" font-size="6">sin meseta</text>
        </g>
        <g>
          <rect x="244" y="26" width="108" height="232" rx="7" fill="var(--bg-soft)" stroke="var(--line)"/>
          <text x="298" y="42" text-anchor="middle" class="svg-text svg-text--strong" font-size="7.5">U10 · eutéctica</text>
          <line x1="260" y1="222" x2="340" y2="222" stroke="var(--line-strong)"/>
          <line x1="260" y1="222" x2="260" y2="54" stroke="var(--line-strong)"/>
          <path d="M264 66 Q278 145 294 160" fill="none" stroke="var(--accent)" stroke-width="2.4"/>
          <path d="M324 160 Q330 195 336 204" fill="none" stroke="var(--accent)" stroke-width="2.4"/>
          <line x1="294" y1="160" x2="324" y2="160" stroke="var(--amber)" stroke-width="3.4"/>
          <text x="326" y="150" text-anchor="middle" class="svg-text svg-text--amber" font-size="6">TE</text>
          <text x="300" y="214" text-anchor="middle" class="svg-text svg-text--green" font-size="6">1 meseta</text>
        </g>
        <text x="180" y="282" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">U8: meseta a Tf · U9: dos quiebres, sin meseta · U10: meseta eutéctica</text>
      </svg>`,
      pins: [
        { n: 1, x: 68, y: 140, lx: 62, ly: 24, label: 'U8 · metal puro', q: '¿Cómo es la curva del metal puro (U8)?', detail: 'Una sola meseta horizontal a Tf. Solidifica a una sola temperatura, sin codo.' },
        { n: 2, x: 184, y: 160, lx: 180, ly: 24, label: 'U9 · aleación isomorfa', q: '¿Cómo es la curva de la U9?', detail: 'Dos quiebres (liquidus y solidus) y un tramo inclinado L + α. No tiene meseta: solidifica en un rango de temperaturas.' },
        { n: 3, x: 310, y: 160, lx: 298, ly: 24, label: 'U10 · eutéctica', q: '¿Cómo es la curva de la U10?', detail: 'Una sola meseta horizontal a TE (menor que la fusión de los componentes puros). L → α + β a temperatura constante.' },
      ],
    },
  ],
};

export const U10_DIAGRAMS = [reacciones, fronteras, curvasU10];
