/* ============================================================
   views/formulas.js — hoja de fórmulas con modo ocultar
   ============================================================ */

import { ALL_FORMULAS, UNIT_LIST } from '../data/index.js';
import { icon } from '../core/ui.js';
import { normalize } from '../core/text.js';
import { pageHead, formulaCard, segmentedTabs } from './partials.js';

const TABS = [
  { key: 'temas', label: 'Temas', href: '#/teoria' },
  { key: 'diagramas', label: 'Diagramas', href: '#/teoria/diagramas' },
  { key: 'formulas', label: 'Fórmulas', href: '#/teoria/formulas' },
];

// Los grupos se derivan del contenido, en el orden en que aparecen las fórmulas.
const GROUP_ORDER = [...new Set(ALL_FORMULAS.map((formula) => `${formula.unit}|${formula.group}`))]
  .map((key) => {
    const [unit, name] = key.split('|');
    return { unit, name };
  });

export function formulasView() {
  const state = { unit: 'todas', query: '', masked: false };

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: 'Referencia rápida',
      title: 'Hoja de fórmulas',
      sub: 'Tocá una fórmula para taparla y comprobar si la recordás.',
    })}
    ${segmentedTabs(TABS, 'formulas')}
    <div class="search-wrap">
      ${icon('search')}
      <input class="input input-text" type="search" placeholder="Buscar fórmula, variable o tema…" data-search aria-label="Buscar fórmula">
    </div>
    <div class="chip-row" data-controls>
      <button class="chip" type="button" data-unit="todas" aria-pressed="true">Todas</button>
      ${UNIT_LIST.map((unit) => `<button class="chip" type="button" data-unit="${unit.id}" aria-pressed="false">Unidad ${unit.number}</button>`).join('')}
      <button class="chip" type="button" data-mask aria-pressed="false">${icon('bulb', 'icon--xs')} <span>Ocultar todas</span></button>
    </div>
    <div id="formulaList" class="stack"></div>
  `;

  const list = el.querySelector('#formulaList');
  const maskToggle = el.querySelector('[data-mask]');

  function render() {
    const query = normalize(state.query);
    const filtered = ALL_FORMULAS.filter((formula) => {
      if (state.unit !== 'todas' && formula.unit !== state.unit) return false;
      if (!query) return true;
      return normalize(`${formula.name} ${formula.expr} ${formula.note || ''} ${formula.group}`).includes(query);
    });

    if (!filtered.length) {
      list.innerHTML = `<div class="empty">${icon('search')}<h3>Sin fórmulas</h3><p>Probá con otra palabra o cambiá el filtro.</p></div>`;
      return;
    }

    const groups = GROUP_ORDER.filter((group) => filtered.some((formula) => formula.group === group.name && formula.unit === group.unit));

    list.innerHTML = groups.map((group) => {
      const rows = filtered.filter((formula) => formula.group === group.name && formula.unit === group.unit);
      if (!rows.length) return '';
      return `<section class="section">
        <div class="section__head">
          <div class="section__title">U${Number(group.unit.slice(1))} · ${group.name}</div>
          <span class="tiny muted mono">${rows.length}</span>
        </div>
        <div class="stack stack--sm">${rows.map((formula) => formulaCard(formula, { maskable: state.masked })).join('')}</div>
      </section>`;
    }).join('');

    list.querySelectorAll('[data-reveal]').forEach((button) => {
      button.addEventListener('click', () => {
        const card = button.closest('.fcard');
        card.classList.toggle('is-masked');
      });
    });
    list.querySelectorAll('.fcard__expr').forEach((expr) => {
      expr.addEventListener('click', () => {
        const card = expr.closest('.fcard');
        if (card.classList.contains('is-masked')) card.classList.remove('is-masked');
      });
    });
  }

  el.querySelectorAll('[data-unit]').forEach((chip) => {
    chip.addEventListener('click', () => {
      state.unit = chip.dataset.unit;
      el.querySelectorAll('[data-unit]').forEach((item) => item.setAttribute('aria-pressed', String(item === chip)));
      render();
    });
  });

  el.querySelector('[data-search]').addEventListener('input', (event) => {
    state.query = event.target.value;
    render();
  });

  maskToggle.addEventListener('click', () => {
    state.masked = !state.masked;
    maskToggle.setAttribute('aria-pressed', String(state.masked));
    maskToggle.querySelector('span').textContent = state.masked ? 'Mostrar todas' : 'Ocultar todas';
    render();
  });

  render();

  return { el, title: 'Fórmulas', sub: 'Referencia rápida', nav: 'teoria', back: '/teoria' };
}
