/* ============================================================
   views/ensayos.js — catálogo de ensayos y detalle
   ============================================================ */

import { ENSAYOS, ENSAYO_CATEGORIES, CHARPY_VS_IZOD, getEnsayo } from '../data/index.js';
import { icon } from '../core/ui.js';
import { pageHead } from './partials.js';

const CATEGORY_LABEL = Object.fromEntries(ENSAYO_CATEGORIES.map((category) => [category.id, category.label]));

const TOPIC_BY_ENSAYO = {
  traccion: 'traccion',
  'flexion-3': 'flexion',
  'flexion-4': 'flexion',
  brinell: 'dureza',
  rockwell: 'dureza',
  vickers: 'dureza',
  knoop: 'dureza',
  shore: 'dureza',
  'impacto-charpy': 'impacto',
  'impacto-izod': 'impacto',
  fatiga: 'fatiga',
};

function ensayoCard(ensayo) {
  return `<a class="row-card" href="#/ensayos/${ensayo.id}" style="align-items:flex-start">
    <span class="row-card__num" style="color:${ensayo.highlight ? 'var(--amber)' : 'var(--accent)'}">${icon(ensayo.icon, 'icon--sm')}</span>
    <span class="row-card__main">
      <span class="row-card__title">${ensayo.name} ${ensayo.highlight ? '<span class="badge badge--warn" style="margin-left:4px">clave</span>' : ''}</span>
      <span class="row-card__meta">${ensayo.summary}</span>
      <span class="row-card__meta" style="color:var(--muted)">${CATEGORY_LABEL[ensayo.category]} · ${ensayo.tag}</span>
    </span>
    <svg class="row-card__chev"><use href="#i-chevron-right"></use></svg>
  </a>`;
}

export function ensayosView() {
  const state = { category: 'todos' };

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: 'Unidad 6',
      title: 'Ensayos mecánicos',
      sub: 'Qué mide cada ensayo, cómo se hace y qué pregunta en el parcial. Impacto con Charpy e Izod en detalle.',
    })}
    <div class="chip-row" data-filters>
      ${ENSAYO_CATEGORIES.map((category) => `<button class="chip" type="button" data-category="${category.id}" aria-pressed="${category.id === 'todos'}">${category.label}</button>`).join('')}
    </div>
    <div id="ensayoList" class="stack stack--sm"></div>
    <section class="section">
      <div class="section__head"><div class="section__title">Comparación clave</div></div>
      <div class="card">
        <h3 style="font-size:0.95rem">Charpy vs. Izod</h3>
        <p class="card__sub">La diferencia del lado del golpe es la pregunta más repetida.</p>
        <div class="table-wrap" style="margin-top:10px">
          <table class="data">
            <thead><tr>${CHARPY_VS_IZOD.head.map((th) => `<th>${th}</th>`).join('')}</tr></thead>
            <tbody>${CHARPY_VS_IZOD.rows.map((row) => `<tr>${row.map((td, index) => `<td data-label="${CHARPY_VS_IZOD.head[index]}">${td}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>
        <a class="btn btn--soft btn--block" style="margin-top:10px" href="#/teoria/diagramas/impacto">${icon('chart')} Ver diagrama interactivo</a>
      </div>
    </section>
  `;

  const list = el.querySelector('#ensayoList');

  const render = () => {
    const filtered = ENSAYOS.filter((ensayo) => state.category === 'todos' || ensayo.category === state.category);
    list.innerHTML = filtered.length
      ? filtered.map(ensayoCard).join('')
      : `<div class="empty">${icon('flask')}<h3>Sin ensayos</h3><p>Cambiá el filtro para ver otros.</p></div>`;
  };

  el.querySelectorAll('[data-category]').forEach((chip) => {
    chip.addEventListener('click', () => {
      state.category = chip.dataset.category;
      el.querySelectorAll('[data-category]').forEach((item) => item.setAttribute('aria-pressed', String(item === chip)));
      render();
    });
  });

  render();

  return { el, title: 'Ensayos', sub: 'Unidad 6', nav: 'ensayos', back: null };
}

export function ensayoView({ params }) {
  const ensayo = getEnsayo(params.id);
  if (!ensayo) {
    const el = document.createElement('div');
    el.className = 'page';
    el.innerHTML = `${pageHead({ eyebrow: 'Ensayos', title: 'Ensayo no encontrado' })}
      <a class="btn btn--primary" href="#/ensayos">Ver todos</a>`;
    return { el, title: 'Ensayos', nav: 'ensayos', back: '/ensayos' };
  }

  const index = ENSAYOS.findIndex((item) => item.id === ensayo.id);
  const previous = ENSAYOS[index - 1];
  const next = ENSAYOS[index + 1];
  const topic = TOPIC_BY_ENSAYO[ensayo.id];

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    <div class="row row--wrap">
      <span class="badge badge--accent">${CATEGORY_LABEL[ensayo.category]}</span>
      <span class="badge">${ensayo.tag}</span>
      ${ensayo.highlight ? '<span class="badge badge--warn">Tema estrella</span>' : ''}
    </div>

    ${pageHead({ title: ensayo.name, sub: ensayo.summary })}

    <div class="callout callout--info">
      <div class="callout__icon">${icon('target')}</div>
      <div><h4>Qué mide</h4><p>${ensayo.measures}</p></div>
    </div>

    <div class="grid grid--2">
      <div class="stat"><div class="stat__label">Probeta / muestra</div><div class="stat__value" style="font-size:0.82rem;font-family:var(--font);font-weight:550;margin-top:4px;line-height:1.4">${ensayo.probeta}</div></div>
      <div class="stat"><div class="stat__label">Equipo</div><div class="stat__value" style="font-size:0.82rem;font-family:var(--font);font-weight:550;margin-top:4px;line-height:1.4">${ensayo.equipo}</div></div>
    </div>

    <section class="section">
      <div class="section__head"><div class="section__title">Cómo se hace</div></div>
      <div class="lesson-body" style="font-size:0.88rem"><ol class="steps">${ensayo.steps.map((step) => `<li>${step}</li>`).join('')}</ol></div>
    </section>

    <section class="section">
      <div class="section__head"><div class="section__title">Resultados</div></div>
      <div class="row row--wrap">${ensayo.results.map((result) => `<span class="chip">${result}</span>`).join('')}</div>
      <div class="formula" style="margin-top:6px">
        <div class="formula__expr">${ensayo.formula.expr}</div>
        <div class="formula__note">${ensayo.formula.note}</div>
      </div>
      <p class="tiny muted">Unidades: ${ensayo.units}</p>
    </section>

    <div class="callout callout--tip">
      <div class="callout__icon">${icon('check-circle')}</div>
      <div><h4>Cuándo usarlo</h4><p>${ensayo.whenUse}</p></div>
    </div>

    <div class="callout callout--trap">
      <div class="callout__icon">${icon('alert')}</div>
      <div><h4>Errores típicos</h4><p>${ensayo.errors.join(' · ')}</p></div>
    </div>

    <details class="acc">
      <summary>${icon('graduation', 'icon--sm')} Pregunta típica de examen</summary>
      <div class="acc__body">
        <p><b>${ensayo.examQ.q}</b></p>
        <p style="margin-top:6px;color:var(--text)">${ensayo.examQ.a}</p>
      </div>
    </details>

    ${ensayo.diagram ? `<a class="btn btn--soft btn--block" href="#/teoria/diagramas/${ensayo.diagram}">${icon('chart')} Ver el diagrama</a>` : ''}
    ${topic ? `<a class="btn btn--primary btn--block" href="#/practica/quiz?scope=topic&topic=${topic}">${icon('target')} Practicar preguntas de este tema</a>` : ''}

    <div class="row" style="gap:8px">
      ${previous ? `<a class="btn btn--ghost btn--sm" href="#/ensayos/${previous.id}" style="flex:1;text-align:left">← ${previous.name}</a>` : ''}
      ${next ? `<a class="btn btn--ghost btn--sm" href="#/ensayos/${next.id}" style="flex:1;justify-content:flex-end;text-align:right">${next.name} →</a>` : ''}
    </div>
  `;

  return {
    el,
    title: ensayo.name,
    sub: `${CATEGORY_LABEL[ensayo.category]} · Unidad 6`,
    nav: 'ensayos',
    back: '/ensayos',
  };
}
