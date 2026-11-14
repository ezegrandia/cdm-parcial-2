/* ============================================================
   views/lab.js — simuladores: Chvorinov, impacto y calculadoras
   ============================================================ */

import { SHAPES, shapeById, shapeDefaults, compareEqualVolume } from '../data/shapes.js';
import { icon, bar } from '../core/ui.js';
import { formatNumber, parseNumber, shuffle } from '../core/utils.js';
import { pageHead } from './partials.js';

export function labHubView() {
  const tools = [
    {
      href: '#/practica/simuladores/chvorinov',
      icon: 'calculator',
      title: 'Chvorinov y formas básicas',
      meta: 'Calculá V, A, V/A y ts de cubo, prisma, cilindro y esfera. Compará formas y entrená las fórmulas.',
      badge: 'Unidad 8',
    },
    {
      href: '#/practica/simuladores/impacto',
      icon: 'zap',
      title: 'Impacto y energía',
      meta: 'Péndulo con h₀ y hf, energía absorbida, % de fractura por corte y expansión lateral.',
      badge: 'Unidad 6',
    },
    {
      href: '#/practica/simuladores/calculadoras',
      icon: 'target',
      title: 'Calculadoras rápidas',
      meta: 'Brinell, flexión y fatiga con Marin: verificá tus resultados del TP.',
      badge: 'U6',
    },
  ];

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: 'Herramientas',
      title: 'Simuladores',
      sub: 'Cambiá los datos y mirá cómo se mueve el resultado. Después resolvé el mismo ejercicio a mano.',
    })}
    <div class="stack">
      ${tools.map((tool) => `<a class="card card--tap" href="${tool.href}" style="display:block">
        <div class="row">
          <span class="lab-head__icon">${icon(tool.icon)}</span>
          <div style="flex:1;min-width:0">
            <div class="row row--between" style="align-items:flex-start">
              <h3 style="font-size:0.98rem">${tool.title}</h3>
              <span class="badge">${tool.badge}</span>
            </div>
            <p class="card__sub" style="margin-top:4px">${tool.meta}</p>
          </div>
        </div>
      </a>`).join('')}
    </div>
    <div class="callout callout--tip">
      <div class="callout__icon">${icon('bulb')}</div>
      <div><h4>Cómo usarlo</h4><p>Hacé el cálculo a mano primero y después verificá en el simulador. Si no coincide, revisá unidades antes de cambiar la fórmula.</p></div>
    </div>
  `;
  return { el, title: 'Simuladores', sub: 'Herramientas', nav: 'practica', back: '/practica' };
}

/* ------------------------------------------------------------
   CHVORINOV
   ------------------------------------------------------------ */

function yFor(h) {
  return 140 - (h / 2) * 100;
}

function impactMiniSvg(m, h0, hf) {
  const y0 = yFor(h0);
  const yf = yFor(hf);
  return `<svg viewBox="0 0 360 170" aria-hidden="true" style="width:100%;height:auto">
    <line x1="40" y1="150" x2="330" y2="150" stroke="var(--line-strong)"/>
    <line x1="150" y1="20" x2="150" y2="150" stroke="var(--line)" stroke-dasharray="3 4"/>
    <line x1="290" y1="20" x2="290" y2="150" stroke="var(--line)" stroke-dasharray="3 4"/>
    <line x1="140" y1="${y0}" x2="300" y2="${y0}" stroke="var(--accent)" stroke-width="2.2"/>
    <line x1="140" y1="${yf}" x2="300" y2="${yf}" stroke="var(--amber)" stroke-width="2.2"/>
    <circle cx="150" cy="${y0}" r="5" fill="var(--accent)"/>
    <circle cx="150" cy="${yf}" r="5" fill="var(--amber)"/>
    <line x1="320" y1="${y0}" x2="320" y2="${yf}" stroke="var(--violet)" stroke-width="1.6" marker-start="url(#ar-lab)" marker-end="url(#ar-lab)"/>
    <text class="svg-text svg-text--accent" x="150" y="${y0 - 8}" text-anchor="middle" font-size="9" font-family="monospace">h₀ = ${formatNumber(h0, 2)} m</text>
    <text class="svg-text svg-text--amber" x="150" y="${yf + 16}" text-anchor="middle" font-size="9" font-family="monospace">hf = ${formatNumber(hf, 2)} m</text>
    <text class="svg-text svg-text--muted" x="150" y="166" text-anchor="middle" font-size="8">Δh = ${formatNumber(h0 - hf, 2)} m</text>
    <text class="svg-text svg-text--violet" x="326" y="${(y0 + yf) / 2 + 3}" font-size="8">Δh</text>
    <defs><marker id="ar-lab" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 1 L10 5 L0 9 z" fill="var(--violet)"/></marker></defs>
  </svg>`;
}

export function chvorinovView() {
  const values = {};
  SHAPES.forEach((shape) => { values[shape.id] = shapeDefaults(shape); });

  const state = {
    shapeId: 'cubo',
    unit: 'cm',
    B: 3.5,
    volumeCompare: 2000,
  };

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: 'Unidad 8 · simulador',
      eyebrowTone: 'eyebrow--u8',
      title: 'Chvorinov y formas',
      sub: 'Calculá volumen, área del molde y tiempo de solidificación. Incluye comparación y entrenamiento de fórmulas.',
    })}

    <div class="segmented" role="tablist">
      <button type="button" role="tab" data-labtab="calc" aria-selected="true">Calculadora</button>
      <button type="button" role="tab" data-labtab="compare" aria-selected="false">Comparar</button>
      <button type="button" role="tab" data-labtab="train" aria-selected="false">Entrenar</button>
    </div>

    <section data-panel="calc" class="stack">
      <div class="card">
        <div class="row row--between">
          <div>
            <h3 style="font-size:0.95rem">Figura y medidas</h3>
            <p class="card__sub">Todo se convierte a cm para que B quede en min/cm².</p>
          </div>
          <div class="segmented" style="width:auto;padding:2px" role="tablist">
            <button type="button" role="tab" data-labunit="cm" aria-selected="true">cm</button>
            <button type="button" role="tab" data-labunit="mm" aria-selected="false">mm</button>
          </div>
        </div>
        <div class="shape-grid" style="margin-top:12px" data-shapes>
          ${SHAPES.map((shape) => `<button class="shape-opt ${shape.id === 'cubo' ? 'is-active' : ''}" type="button" data-shape="${shape.id}">
            ${shape.icon}<span>${shape.name}</span>
          </button>`).join('')}
        </div>
        <div class="lab-row" style="margin-top:12px" data-dims></div>
        <div class="lab-row" style="margin-top:9px">
          <div class="field">
            <label class="field__label" for="labB">Constante B</label>
            <div class="input-group">
              <input class="input" id="labB" type="text" inputmode="decimal" value="${state.B}">
              <span class="input-group__unit">min/cm²</span>
            </div>
          </div>
          <div class="field">
            <label class="field__label" for="labN">Exponente n</label>
            <input class="input" id="labN" type="text" inputmode="decimal" value="2" disabled>
          </div>
        </div>
        <div class="row row--wrap" style="margin-top:10px">
          <button class="btn btn--xs btn--soft" type="button" data-preset="cubo">Cubo 10 cm</button>
          <button class="btn btn--xs btn--soft" type="button" data-preset="cilindro">Cilindro D10 h20</button>
          <button class="btn btn--xs btn--soft" type="button" data-preset="prisma">Prisma 6×8×10</button>
          <button class="btn btn--xs btn--soft" type="button" data-preset="esfera">Esfera D20</button>
        </div>
      </div>

      <div class="lab-result">
        <div class="lab-result__label">Tiempo de solidificación</div>
        <div class="lab-result__value" data-out="ts">—</div>
        <div class="tiny muted" data-out="formula">ts = B · (V/A)²</div>
      </div>

      <div class="result-grid" data-out-grid>
        <div class="result-cell"><div class="result-cell__k">Volumen V</div><div class="result-cell__v" data-out="V">—</div></div>
        <div class="result-cell"><div class="result-cell__k">Área del molde A</div><div class="result-cell__v" data-out="A">—</div></div>
        <div class="result-cell"><div class="result-cell__k">Relación V/A</div><div class="result-cell__v" data-out="VA">—</div></div>
        <div class="result-cell"><div class="result-cell__k">B utilizada</div><div class="result-cell__v" data-out="B">—</div></div>
      </div>

      <div class="stack stack--sm" data-formulas></div>
      <div class="note" data-check></div>
    </section>

    <section data-panel="compare" class="stack" hidden>
      <div class="card">
        <h3 style="font-size:0.95rem">A igual volumen, ¿cuál tarda más?</h3>
        <p class="card__sub">La forma con menos superficie tiene mayor V/A y solidifica última.</p>
        <div class="lab-row" style="margin-top:12px">
          <div class="field">
            <label class="field__label" for="labVol">Volumen de la pieza</label>
            <div class="input-group"><input class="input" id="labVol" type="text" inputmode="decimal" value="2000"><span class="input-group__unit">cm³</span></div>
          </div>
          <div class="field">
            <label class="field__label" for="labB2">Constante B</label>
            <div class="input-group"><input class="input" id="labB2" type="text" inputmode="decimal" value="3.5"><span class="input-group__unit">min/cm²</span></div>
          </div>
        </div>
      </div>
      <div class="card" data-compare-rows></div>
      <div class="callout callout--tip"><div class="callout__icon">${icon('bulb')}</div><div><h4>Regla de oro</h4><p>Placa &lt; cubo &lt; esfera. La esfera es el extremo de máximo V/A; la placa delgada, el de mínimo.</p></div></div>
    </section>

    <section data-panel="train" class="stack" hidden>
      <div class="card">
        <div class="row row--between">
          <div><h3 style="font-size:0.95rem">Entrenamiento de fórmulas</h3><p class="card__sub">8 preguntas al azar: V, A y V/A de las cuatro figuras.</p></div>
          <span class="badge" data-train-score>0 / 0</span>
        </div>
      </div>
      <div data-train-area></div>
    </section>
  `;

  const calcPanel = el.querySelector('[data-panel="calc"]');
  const comparePanel = el.querySelector('[data-panel="compare"]');
  const trainPanel = el.querySelector('[data-panel="train"]');
  const dimsBox = el.querySelector('[data-dims]');
  const formulasBox = el.querySelector('[data-formulas]');
  const checkBox = el.querySelector('[data-check]');
  const compareRows = el.querySelector('[data-compare-rows]');

  function displayValue(cmValue) {
    return formatNumber(state.unit === 'mm' ? cmValue * 10 : cmValue, 2);
  }

  function renderDims() {
    const shape = shapeById(state.shapeId);
    const valuesCm = values[shape.id];
    dimsBox.innerHTML = shape.dims.map((dim) => `
      <div class="field">
        <label class="field__label" for="dim-${dim.key}">${dim.label}</label>
        <div class="input-group">
          <input class="input" id="dim-${dim.key}" data-dim="${dim.key}" type="text" inputmode="decimal" value="${displayValue(valuesCm[dim.key])}">
          <span class="input-group__unit">${state.unit}</span>
        </div>
      </div>`).join('');

    dimsBox.querySelectorAll('[data-dim]').forEach((input) => {
      input.addEventListener('input', () => {
        const parsed = parseNumber(input.value);
        if (!Number.isFinite(parsed) || parsed <= 0) return;
        valuesCm[input.dataset.dim] = state.unit === 'mm' ? parsed / 10 : parsed;
        updateResults();
      });
    });
  }

  function updateResults() {
    const shape = shapeById(state.shapeId);
    const valuesCm = values[shape.id];
    const B = parseNumber(el.querySelector('#labB').value);
    state.B = Number.isFinite(B) && B > 0 ? B : 3.5;
    const { V, A, VA } = shape.compute(valuesCm);
    const ts = state.B * VA ** 2;

    el.querySelector('[data-out="ts"]').innerHTML = `${formatNumber(ts, 2)} <span class="lab-result__unit">min</span>`;
    el.querySelector('[data-out="V"]').textContent = `${formatNumber(V, 1)} cm³`;
    el.querySelector('[data-out="A"]').textContent = `${formatNumber(A, 1)} cm²`;
    el.querySelector('[data-out="VA"]').textContent = `${formatNumber(VA, 3)} cm`;
    el.querySelector('[data-out="B"]').textContent = `${formatNumber(state.B, 2)} min/cm²`;
    el.querySelector('[data-out="formula"]').textContent =
      `ts = ${formatNumber(state.B, 2)} × (${formatNumber(VA, 3)})² = ${formatNumber(ts, 2)} min`;

    formulasBox.innerHTML = `
      <div class="formula formula--u8"><div class="formula__expr">${shape.formulas.v}</div><div class="formula__note">Volumen de la figura (calor a extraer).</div></div>
      <div class="formula formula--u8"><div class="formula__expr">${shape.formulas.a}</div><div class="formula__note">Área total del molde (superficie de extracción).</div></div>
      <div class="formula formula--u8"><div class="formula__expr">${shape.formulas.va}</div><div class="formula__note">Relación que entra en Chvorinov.</div></div>
    `;

    const cubeEquivalent = Math.cbrt(V);
    checkBox.innerHTML = `Verificación: con un cubo de lado ${formatNumber(cubeEquivalent, 2)} cm (mismo volumen) el tiempo sería ${formatNumber(state.B * (cubeEquivalent / 6) ** 2, 2)} min. ` +
      `La figura actual tarda ${formatNumber(ts, 2)} min porque su V/A es ${formatNumber(VA, 3)} cm.`;
  }

  el.querySelectorAll('[data-shape]').forEach((button) => {
    button.addEventListener('click', () => {
      state.shapeId = button.dataset.shape;
      el.querySelectorAll('[data-shape]').forEach((item) => item.classList.toggle('is-active', item === button));
      renderDims();
      updateResults();
    });
  });

  el.querySelectorAll('[data-labunit]').forEach((button) => {
    button.addEventListener('click', () => {
      state.unit = button.dataset.labunit;
      el.querySelectorAll('[data-labunit]').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
      renderDims();
      updateResults();
    });
  });

  el.querySelector('#labB').addEventListener('input', updateResults);

  el.querySelectorAll('[data-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const preset = button.dataset.preset;
      state.shapeId = preset;
      state.unit = 'cm';
      el.querySelectorAll('[data-labunit]').forEach((item) => item.setAttribute('aria-selected', String(item.dataset.labunit === 'cm')));
      el.querySelectorAll('[data-shape]').forEach((item) => item.classList.toggle('is-active', item.dataset.shape === preset));
      if (preset === 'cubo') values.cubo = { a: 10 };
      if (preset === 'cilindro') values.cilindro = { d: 10, h: 20 };
      if (preset === 'prisma') values.prisma = { a: 6, b: 8, c: 10 };
      if (preset === 'esfera') values.esfera = { d: 20 };
      renderDims();
      updateResults();
    });
  });

  /* --- comparación --- */

  function renderCompare() {
    const volume = Math.max(1, parseNumber(el.querySelector('#labVol').value) || 2000);
    const B = Math.max(0.01, parseNumber(el.querySelector('#labB2').value) || 3.5);
    const rows = compareEqualVolume(volume).map((row) => ({ ...row, ts: B * row.VA ** 2 }));
    const maxTs = Math.max(...rows.map((row) => row.ts));

    compareRows.innerHTML = `
      <div class="row row--between" style="margin-bottom:8px">
        <span class="section__title">V = ${formatNumber(volume, 0)} cm³</span>
        <span class="tiny muted mono">B = ${formatNumber(B, 2)}</span>
      </div>
      ${rows.map((row) => `<div class="compare-row">
        <span class="compare-row__name">${row.name}</span>
        <div class="compare-row__bar"><div class="compare-row__fill" style="width:${Math.max(4, (row.ts / maxTs) * 100)}%"></div></div>
        <span class="compare-row__val">${formatNumber(row.VA, 2)} cm<br>${formatNumber(row.ts, 1)} min</span>
      </div>`).join('')}
      <p class="tiny muted" style="margin-top:8px">V/A en cm y tiempo en min. Las barras comparan los tiempos entre formas del mismo volumen.</p>
    `;
  }

  el.querySelector('#labVol').addEventListener('input', renderCompare);
  el.querySelector('#labB2').addEventListener('input', renderCompare);

  /* --- entrenamiento --- */

  const train = { queue: [], index: 0, score: 0, answered: false, chosen: null };

  function buildTrainQueue() {
    const types = ['v', 'a', 'va'];
    const all = SHAPES.flatMap((shape) => types.map((type) => ({ shape, type })));
    return shuffle(all).slice(0, 8).map((item) => {
      const correct = item.shape.formulas[item.type];
      const options = shuffle([...new Set(SHAPES.map((shape) => shape.formulas[item.type]))]);
      return { ...item, correct, options };
    });
  }

  function renderTrain() {
    const area = el.querySelector('[data-train-area]');
    const score = el.querySelector('[data-train-score]');

    if (train.index >= train.queue.length) {
      const total = train.queue.length;
      score.textContent = `${train.score} / ${total}`;
      area.innerHTML = `<div class="card center">
        <div style="display:flex;justify-content:center">${''}</div>
        <h3>${train.score} de ${total} correctas</h3>
        <p class="card__sub">${train.score === total ? 'Dominás las fórmulas. Ahora practicá los cálculos numéricos.' : 'Repetí la ronda hasta que salga sin pensar.'}</p>
        <button class="btn btn--primary btn--block" type="button" data-train-restart style="margin-top:12px">${icon('refresh')} Otra ronda</button>
        <a class="btn btn--soft btn--block" href="#/practica/quiz?scope=topic&topic=chvorinov" style="margin-top:8px">Ir al quiz de Chvorinov</a>
      </div>`;
      area.querySelector('[data-train-restart]').addEventListener('click', () => {
        train.queue = buildTrainQueue();
        train.index = 0;
        train.score = 0;
        train.answered = false;
        renderTrain();
      });
      return;
    }

    const item = train.queue[train.index];
    const phrase = item.type === 'v' ? 'el volumen' : item.type === 'a' ? 'el área total' : 'la relación V/A';
    const preposition = item.shape.id === 'esfera' ? 'de la esfera' : `del ${item.shape.name.toLowerCase()}`;
    score.textContent = `${train.score} / ${train.queue.length}`;

    area.innerHTML = `<div class="q-card">
      <div class="q-meta"><span class="badge badge--warn">U8</span><span class="badge">Formas y V/A</span></div>
      <p class="q-text">¿Cuál es ${phrase} ${preposition}?</p>
      <div class="options options--long" data-train-options>
        ${item.options.map((option, index) => `<button class="opt" type="button" data-train-opt="${index}" ${train.answered ? 'disabled' : ''}>
          <span class="opt__key">${String.fromCharCode(65 + index)}</span><span>${option}</span>
        </button>`).join('')}
      </div>
      <div class="row" style="margin-top:12px;gap:8px">
        <button class="btn btn--outline btn--sm" type="button" data-train-skip>Saltar</button>
        <button class="btn btn--primary" style="flex:1" type="button" data-train-next ${train.answered ? '' : 'disabled'}>${train.index === train.queue.length - 1 ? 'Ver resultado' : 'Siguiente'}</button>
      </div>
      <div data-train-feedback></div>
    </div>`;

    if (train.answered && train.chosen != null) {
      area.querySelectorAll('[data-train-opt]').forEach((button) => {
        const option = item.options[Number(button.dataset.trainOpt)];
        if (option === item.correct) button.dataset.state = 'correct';
        else if (option === train.chosen) button.dataset.state = 'wrong';
        else button.dataset.state = 'dim';
      });
      area.querySelector('[data-train-feedback]').innerHTML = `<div class="explain ${train.chosen === item.correct ? 'explain--ok' : 'explain--bad'}">
        <div class="explain__title">${train.chosen === item.correct ? '¡Correcto!' : `La correcta es: ${item.correct}`}</div>
        <p>${item.shape.name}: ${item.shape.formulas.v} · ${item.shape.formulas.a} · ${item.shape.formulas.va}</p>
      </div>`;
    }

    area.querySelectorAll('[data-train-opt]').forEach((button) => {
      button.addEventListener('click', () => {
        if (train.answered) return;
        const option = item.options[Number(button.dataset.trainOpt)];
        train.answered = true;
        train.chosen = option;
        if (option === item.correct) train.score += 1;
        renderTrain();
      });
    });

    area.querySelector('[data-train-next]').addEventListener('click', () => {
      if (!train.answered) return;
      train.index += 1;
      train.answered = false;
      train.chosen = null;
      renderTrain();
    });

    area.querySelector('[data-train-skip]').addEventListener('click', () => {
      train.index += 1;
      train.answered = false;
      train.chosen = null;
      renderTrain();
    });
  }

  el.querySelectorAll('[data-labtab]').forEach((button) => {
    button.addEventListener('click', () => {
      const tab = button.dataset.labtab;
      el.querySelectorAll('[data-labtab]').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
      calcPanel.hidden = tab !== 'calc';
      comparePanel.hidden = tab !== 'compare';
      trainPanel.hidden = tab !== 'train';
      if (tab === 'compare') renderCompare();
      if (tab === 'train') {
        if (!train.queue.length) train.queue = buildTrainQueue();
        renderTrain();
      }
    });
  });

  renderDims();
  updateResults();
  renderCompare();
  train.queue = buildTrainQueue();
  renderTrain();

  return {
    el,
    title: 'Chvorinov',
    sub: 'Unidad 8 · simulador',
    nav: 'practica',
    back: '/practica/simuladores',
  };
}

/* ------------------------------------------------------------
   IMPACTO
   ------------------------------------------------------------ */

export function impactoView() {
  const state = { m: 25, h0: 1.5, hf: 0.62, sectionW: 10, sectionH: 8, clivA: 5, clivB: 8 };

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: 'Unidad 6 · simulador',
      title: 'Impacto y energía',
      sub: 'Péndulo, energía absorbida y porcentaje de fractura por corte.',
    })}

    <div class="card">
      <div class="row row--between">
        <div><h3 style="font-size:0.95rem">Péndulo</h3><p class="card__sub">E = m·g·(h₀ − hf)</p></div>
        <span class="badge badge--warn">dinámico</span>
      </div>
      <div class="range-field" style="margin-top:12px">
        <div class="row row--between"><label class="field__label" for="im-m">Masa del péndulo</label><span class="mono small" data-lab="m">25 kg</span></div>
        <input class="range" id="im-m" type="range" min="5" max="30" step="1" value="25">
      </div>
      <div class="range-field" style="margin-top:8px">
        <div class="row row--between"><label class="field__label" for="im-h0">Altura inicial h₀</label><span class="mono small" data-lab="h0">1,50 m</span></div>
        <input class="range" id="im-h0" type="range" min="0.6" max="2" step="0.05" value="1.5">
      </div>
      <div class="range-field" style="margin-top:8px">
        <div class="row row--between"><label class="field__label" for="im-hf">Altura final hf</label><span class="mono small" data-lab="hf">0,62 m</span></div>
        <input class="range" id="im-hf" type="range" min="0.1" max="1.9" step="0.02" value="0.62">
      </div>
      <div style="margin-top:10px" data="svg"></div>
    </div>

    <div class="lab-result">
      <div class="lab-result__label">Energía absorbida</div>
      <div class="lab-result__value" data="energy">—</div>
      <div class="tiny muted" data="energyFormula"></div>
    </div>

    <div class="callout callout--info">
      <div class="callout__icon">${icon('info')}</div>
      <div><h4>Tres resultados del ensayo</h4><p>Energía absorbida (J) · % de fractura por corte · expansión lateral (mm). Una probeta Charpy es 10×10×55 mm con entalla de 45°, 2 mm y r = 0,25 mm.</p></div>
    </div>

    <div class="card">
      <h3 style="font-size:0.95rem">Cara de fractura y % de corte</h3>
      <p class="card__sub">El recuadro brillante central es clivaje (frágil); el marco opaco es corte (dúctil).</p>
      <div class="lab-row" style="margin-top:12px">
        <div class="field"><label class="field__label" for="im-w">Ancho de sección</label><div class="input-group"><input class="input" id="im-w" type="text" inputmode="decimal" value="10"><span class="input-group__unit">mm</span></div></div>
        <div class="field"><label class="field__label" for="im-h">Alto de sección</label><div class="input-group"><input class="input" id="im-h" type="text" inputmode="decimal" value="8"><span class="input-group__unit">mm</span></div></div>
        <div class="field"><label class="field__label" for="im-a">Clivaje A</label><div class="input-group"><input class="input" id="im-a" type="text" inputmode="decimal" value="5"><span class="input-group__unit">mm</span></div></div>
        <div class="field"><label class="field__label" for="im-b">Clivaje B</label><div class="input-group"><input class="input" id="im-b" type="text" inputmode="decimal" value="8"><span class="input-group__unit">mm</span></div></div>
      </div>
      <div class="lab-result" style="margin-top:12px">
        <div class="lab-result__label">Fractura por corte</div>
        <div class="lab-result__value" data="corte">—</div>
        <div class="tiny muted" data="corteFormula"></div>
      </div>
      <div class="note" style="margin-top:10px" data="corteNote"></div>
    </div>

    <div class="row row--wrap">
      <button class="btn btn--xs btn--soft" type="button" data-preset-impacto>Ejercicio de cátedra (215,6 J · 50 %)</button>
      <a class="btn btn--xs btn--ghost" href="#/teoria/diagramas/impacto">Ver diagrama Charpy/Izod</a>
    </div>
  `;

  const mInput = el.querySelector('#im-m');
  const h0Input = el.querySelector('#im-h0');
  const hfInput = el.querySelector('#im-hf');

  function readImpact() {
    const m = Number(mInput.value);
    const h0 = Number(h0Input.value);
    let hf = Number(hfInput.value);
    if (hf >= h0) {
      hf = Math.max(0.1, h0 - 0.05);
      hfInput.value = String(hf);
    }
    hfInput.max = String(Math.max(0.1, h0 - 0.05));
    state.m = m;
    state.h0 = h0;
    state.hf = hf;

    const energy = m * 9.8 * (h0 - hf);
    el.querySelector('[data-lab="m"]').textContent = `${formatNumber(m, 0)} kg`;
    el.querySelector('[data-lab="h0"]').textContent = `${formatNumber(h0, 2)} m`;
    el.querySelector('[data-lab="hf"]').textContent = `${formatNumber(hf, 2)} m`;
    el.querySelector('[data="energy"]').innerHTML = `${formatNumber(energy, 1)} <span class="lab-result__unit">J</span>`;
    el.querySelector('[data="energyFormula"]').textContent = `E = ${formatNumber(m, 0)} × 9,8 × (${formatNumber(h0, 2)} − ${formatNumber(hf, 2)}) = ${formatNumber(energy, 1)} J`;
    el.querySelector('[data="svg"]').innerHTML = impactMiniSvg(m, h0, hf);
  }

  function readCorte() {
    const w = parseNumber(el.querySelector('#im-w').value);
    const h = parseNumber(el.querySelector('#im-h').value);
    const a = parseNumber(el.querySelector('#im-a').value);
    const b = parseNumber(el.querySelector('#im-b').value);
    const total = w * h;
    const clivaje = a * b;
    const out = el.querySelector('[data="corte"]');
    const formula = el.querySelector('[data="corteFormula"]');
    const note = el.querySelector('[data="corteNote"]');

    if (![w, h, a, b].every((value) => Number.isFinite(value) && value >= 0) || total <= 0) {
      out.textContent = '—';
      formula.textContent = '';
      note.textContent = 'Completá las medidas de la sección.';
      return;
    }
    if (clivaje > total) {
      out.textContent = '—';
      formula.textContent = '';
      note.textContent = 'El área de clivaje no puede ser mayor que la sección total. Revisá los datos.';
      return;
    }
    const corte = ((total - clivaje) / total) * 100;
    out.innerHTML = `${formatNumber(corte, 1)} <span class="lab-result__unit">%</span>`;
    formula.textContent = `(${formatNumber(total, 1)} − ${formatNumber(a, 1)}·${formatNumber(b, 1)}) / ${formatNumber(total, 1)} × 100`;
    note.textContent = clivaje === 0
      ? 'Si A o B valen 0 no hay clivaje: la fractura es 100 % dúctil.'
      : corte >= 70
        ? 'Fractura predominantemente dúctil: alta energía absorbida y buena expansión lateral.'
        : corte >= 30
          ? 'Zona de transición: parte dúctil y parte frágil.'
          : 'Fractura predominantemente frágil: baja energía y poca expansión lateral.';
    state.sectionW = w;
    state.sectionH = h;
    state.clivA = a;
    state.clivB = b;
  }

  [mInput, h0Input, hfInput].forEach((input) => input.addEventListener('input', readImpact));
  ['#im-w', '#im-h', '#im-a', '#im-b'].forEach((selector) => {
    el.querySelector(selector).addEventListener('input', readCorte);
  });

  el.querySelector('[data-preset-impacto]').addEventListener('click', () => {
    mInput.value = '25';
    h0Input.value = '1.5';
    hfInput.value = '0.62';
    el.querySelector('#im-w').value = '10';
    el.querySelector('#im-h').value = '8';
    el.querySelector('#im-a').value = '5';
    el.querySelector('#im-b').value = '8';
    readImpact();
    readCorte();
  });

  readImpact();
  readCorte();

  return {
    el,
    title: 'Impacto',
    sub: 'Unidad 6 · simulador',
    nav: 'practica',
    back: '/practica/simuladores',
  };
}

/* ------------------------------------------------------------
   CALCULADORAS
   ------------------------------------------------------------ */

export function calculadorasView() {
  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: 'Herramientas',
      title: 'Calculadoras',
      sub: 'Verificá tus cuentas del TP. La fórmula siempre va escrita antes de reemplazar.',
    })}

    <div class="card" data-calc="brinell">
      <div class="row row--between"><h3 style="font-size:0.95rem">Dureza Brinell</h3><span class="badge">kgf</span></div>
      <p class="card__sub">HBW = 2F / [πD(D − √(D² − d²))]</p>
      <div class="lab-row" style="margin-top:12px">
        <div class="field"><label class="field__label">Carga F</label><div class="input-group"><input class="input" data-in="F" type="text" inputmode="decimal" value="3000"><span class="input-group__unit">kgf</span></div></div>
        <div class="field"><label class="field__label">Diámetro esfera D</label><div class="input-group"><input class="input" data-in="D" type="text" inputmode="decimal" value="10"><span class="input-group__unit">mm</span></div></div>
        <div class="field"><label class="field__label">Huella d</label><div class="input-group"><input class="input" data-in="d" type="text" inputmode="decimal" value="6.25"><span class="input-group__unit">mm</span></div></div>
      </div>
      <div class="lab-result" style="margin-top:12px"><div class="lab-result__label">Dureza</div><div class="lab-result__value" data-out>—</div><div class="tiny muted" data-note></div></div>
    </div>

    <div class="card" data-calc="flexion">
      <div class="row row--between"><h3 style="font-size:0.95rem">Flexión en 3 puntos</h3><span class="badge">MPa</span></div>
      <p class="card__sub">σflex = 3FL/(2wh²) · Eflex = L³F/(4wh³δ)</p>
      <div class="lab-row" style="margin-top:12px">
        <div class="field"><label class="field__label">Carga F</label><div class="input-group"><input class="input" data-in="F" type="text" inputmode="decimal" value="1200"><span class="input-group__unit">N</span></div></div>
        <div class="field"><label class="field__label">Luz L</label><div class="input-group"><input class="input" data-in="L" type="text" inputmode="decimal" value="400"><span class="input-group__unit">mm</span></div></div>
        <div class="field"><label class="field__label">Ancho w</label><div class="input-group"><input class="input" data-in="w" type="text" inputmode="decimal" value="23.5"><span class="input-group__unit">mm</span></div></div>
        <div class="field"><label class="field__label">Altura h</label><div class="input-group"><input class="input" data-in="h" type="text" inputmode="decimal" value="4.5"><span class="input-group__unit">mm</span></div></div>
        <div class="field"><label class="field__label">Deflexión δ</label><div class="input-group"><input class="input" data-in="delta" type="text" inputmode="decimal" value="10.2"><span class="input-group__unit">mm</span></div></div>
      </div>
      <div class="grid grid--2" style="margin-top:12px">
        <div class="lab-result"><div class="lab-result__label">σflex</div><div class="lab-result__value" data-out="sigma">—</div></div>
        <div class="lab-result" style="border-color:var(--line)"><div class="lab-result__label">Eflex</div><div class="lab-result__value" data-out="E" style="color:var(--violet);font-size:1.15rem">—</div></div>
      </div>
      <p class="tiny muted" style="margin-top:8px" data-note>Ojo con h al cubo y con δ en mm. El resultado del TP es alto: verificá que δ sea la deflexión central medida.</p>
    </div>

    <div class="card" data-calc="fatiga">
      <div class="row row--between"><h3 style="font-size:0.95rem">Fatiga y Marin</h3><span class="badge">MPa</span></div>
      <p class="card__sub">Se′ = 0,5·Sut (Sut ≤ 1400) · Se = ka·kb·kc·kd·ke·Se′</p>
      <div class="lab-row" style="margin-top:12px">
        <div class="field"><label class="field__label">Sut</label><div class="input-group"><input class="input" data-in="Sut" type="text" inputmode="decimal" value="900"><span class="input-group__unit">MPa</span></div></div>
        <div class="field"><label class="field__label">ka · acabado</label><input class="input" data-in="ka" type="text" inputmode="decimal" value="0.85"></div>
        <div class="field"><label class="field__label">kb · tamaño</label><input class="input" data-in="kb" type="text" inputmode="decimal" value="0.90"></div>
        <div class="field"><label class="field__label">kc · carga</label><input class="input" data-in="kc" type="text" inputmode="decimal" value="1"></div>
        <div class="field"><label class="field__label">kd · temperatura</label><input class="input" data-in="kd" type="text" inputmode="decimal" value="1"></div>
        <div class="field"><label class="field__label">ke · confiabilidad</label><input class="input" data-in="ke" type="text" inputmode="decimal" value="0.897"></div>
      </div>
      <div class="grid grid--2" style="margin-top:12px">
        <div class="lab-result"><div class="lab-result__label">Se′</div><div class="lab-result__value" data-out="sep" style="font-size:1.15rem">—</div></div>
        <div class="lab-result" style="border-color:var(--line)"><div class="lab-result__label">Se corregido</div><div class="lab-result__value" data-out="se" style="color:var(--violet);font-size:1.15rem">—</div></div>
      </div>
      <p class="tiny muted" style="margin-top:8px" data-note></p>
    </div>

    <div class="note">Estas calculadoras son de verificación: en el parcial tenés que escribir la fórmula, reemplazar y aclarar las unidades del resultado.</div>
  `;

  function bindCalc(cardSelector, handler) {
    const card = el.querySelector(cardSelector);
    const run = () => {
      const data = {};
      card.querySelectorAll('[data-in]').forEach((input) => {
        data[input.dataset.in] = parseNumber(input.value);
      });
      handler(data, card);
    };
    card.querySelectorAll('[data-in]').forEach((input) => input.addEventListener('input', run));
    run();
  }

  bindCalc('[data-calc="brinell"]', (data, card) => {
    const { F, D, d } = data;
    const out = card.querySelector('[data-out]');
    const note = card.querySelector('[data-note]');
    if (![F, D, d].every(Number.isFinite) || D <= 0 || d <= 0 || d >= D) {
      out.textContent = '—';
      note.textContent = 'Revisá: D y d deben ser positivos y d < D.';
      return;
    }
    const hb = (2 * F) / (Math.PI * D * (D - Math.sqrt(D * D - d * d)));
    out.innerHTML = `${formatNumber(hb, 2)} <span class="lab-result__unit">HB</span>`;
    note.textContent = `σut ≈ 3,45 · HB = ${formatNumber(3.45 * hb, 0)} MPa (sólo aceros no austeníticos).`;
  });

  bindCalc('[data-calc="flexion"]', (data, card) => {
    const { F, L, w, h, delta } = data;
    const sigma = (3 * F * L) / (2 * w * h * h);
    const eflex = (L ** 3 * F) / (4 * w * h ** 3 * delta);
    card.querySelector('[data-out="sigma"]').innerHTML = Number.isFinite(sigma)
      ? `${formatNumber(sigma, 1)} <span class="lab-result__unit">MPa</span>` : '—';
    card.querySelector('[data-out="E"]').innerHTML = Number.isFinite(eflex)
      ? `${formatNumber(eflex, 0)} <span class="lab-result__unit">MPa</span>` : '—';
  });

  bindCalc('[data-calc="fatiga"]', (data, card) => {
    const { Sut, ka, kb, kc, kd, ke } = data;
    const sep = Sut > 1400 ? 700 : 0.5 * Sut;
    const k = ka * kb * kc * kd * ke;
    const se = sep * k;
    const note = card.querySelector('[data-note]');
    card.querySelector('[data-out="sep"]').innerHTML = Number.isFinite(sep)
      ? `${formatNumber(sep, 0)} <span class="lab-result__unit">MPa</span>` : '—';
    card.querySelector('[data-out="se"]').innerHTML = Number.isFinite(se)
      ? `${formatNumber(se, 0)} <span class="lab-result__unit">MPa</span>` : '—';
    note.textContent = Sut > 1400
      ? 'Sut > 1400 MPa: se adopta Se′ = 700 MPa. Producto de factores: ' + formatNumber(k, 4)
      : 'Producto de factores de Marin: ' + formatNumber(k, 4) + ' (Se′ de probeta pulida en flexión rotativa).';
  });

  return {
    el,
    title: 'Calculadoras',
    sub: 'Brinell · flexión · fatiga',
    nav: 'practica',
    back: '/practica/simuladores',
  };
}
