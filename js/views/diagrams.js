/* ============================================================
   views/diagrams.js — lista y visor interactivo de diagramas
   ============================================================ */

import { ALL_DIAGRAMS, getDiagram, diagramsForUnit } from '../diagrams/index.js';
import { diagramSolvedPins, markDiagramPin, resetDiagram } from '../core/store.js';
import { icon, bar, openSheet, toast, haptic, closeSheet } from '../core/ui.js';
import { clamp, esc, shuffle, percent } from '../core/utils.js';
import { pageHead, unitPill, segmentedTabs, diagramCard } from './partials.js';
import { UNIT_LIST } from '../data/index.js';

const TABS = [
  { key: 'temas', label: 'Temas', href: '#/teoria' },
  { key: 'diagramas', label: 'Diagramas', href: '#/teoria/diagramas' },
  { key: 'formulas', label: 'Fórmulas', href: '#/teoria/formulas' },
];

const TOPIC_BY_DIAGRAM = {
  'curva-sigma-epsilon': 'propiedades',
  impacto: 'impacto',
  transicion: 'transicion',
  nucleacion: 'nucleacion',
  enfriamiento: 'enfriamiento',
};

function totalPins(diagram) {
  return diagram.variants.reduce((acc, variant) => acc + variant.pins.length, 0);
}

function totalSolved(diagram) {
  return diagram.variants.reduce((acc, variant) => {
    const solved = diagramSolvedPins(`${diagram.id}:${variant.key}`);
    return acc + variant.pins.filter((pin) => solved.includes(pin.n)).length;
  }, 0);
}

export function diagramsListView() {
  const sections = UNIT_LIST.map((unit) => {
    const diagrams = diagramsForUnit(unit.id);
    return `<section class="section">
      <div class="section__head">
        <div class="section__title">${unitPill(unit.id)} ${unit.id === 'u6' ? 'Diagramas de ensayos' : 'Diagramas de solidificación'}</div>
        <span class="tiny muted mono">${diagrams.length} diagramas</span>
      </div>
      <div class="stack stack--sm">
        ${diagrams.map((diagram) => diagramCard(diagram, totalSolved(diagram), totalPins(diagram))).join('')}
      </div>
    </section>`;
  }).join('');

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: 'Teoría visual',
      title: 'Diagramas interactivos',
      sub: 'Tocá los números para estudiar cada punto. En modo practicar, adiviná qué representa.',
    })}
    ${segmentedTabs(TABS, 'diagramas')}
    ${sections}
    <div class="note">Tip: después de estudiar un diagrama, pasá a <b>Practicar</b> y resolvelo sin mirar las etiquetas. Es la forma más rápida de fijar los puntos de examen.</div>
  `;
  return { el, title: 'Diagramas', sub: 'Teoría visual', nav: 'teoria', back: '/teoria' };
}

export function diagramView({ params, query }) {
  const diagram = getDiagram(params.id);
  if (!diagram) {
    const el = document.createElement('div');
    el.className = 'page';
    el.innerHTML = `${pageHead({ eyebrow: 'Diagramas', title: 'Diagrama no encontrado' })}
      <a class="btn btn--primary" href="#/teoria/diagramas">Ver todos</a>`;
    return { el, title: 'Diagramas', nav: 'teoria', back: '/teoria/diagramas' };
  }

  const state = {
    mode: query.m === 'practica' ? 'practice' : 'study',
    variantKey: diagram.variants.some((variant) => variant.key === query.v) ? query.v : diagram.variants[0].key,
    active: null,
    showLabels: false,
    completedShown: false,
  };

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: `Unidad ${diagram.unit === 'u6' ? 6 : 8} · diagrama interactivo`,
      eyebrowTone: diagram.unit === 'u8' ? 'eyebrow--u8' : '',
      title: diagram.title,
      sub: diagram.subtitle,
    })}
    ${diagram.variants.length > 1 ? '<div id="variantTabs"></div>' : ''}
    <div id="modeTabs"></div>
    <div id="stage"></div>
  `;

  const modeTabs = el.querySelector('#modeTabs');
  modeTabs.innerHTML = `<div class="segmented" role="tablist">
    <button type="button" role="tab" data-mode="study" aria-selected="${state.mode === 'study'}">Estudiar</button>
    <button type="button" role="tab" data-mode="practice" aria-selected="${state.mode === 'practice'}">Practicar</button>
  </div>`;

  const variantTabs = el.querySelector('#variantTabs');
  if (variantTabs) {
    variantTabs.innerHTML = `<div class="segmented" role="tablist">
      ${diagram.variants.map((variant) => `<button type="button" role="tab" data-variant="${variant.key}" aria-selected="${variant.key === state.variantKey}">${variant.label}</button>`).join('')}
    </div>`;
  }

  const stage = el.querySelector('#stage');
  const back = '/teoria/diagramas';

  const currentVariant = () => diagram.variants.find((variant) => variant.key === state.variantKey) || diagram.variants[0];
  const storeKey = () => `${diagram.id}:${state.variantKey}`;

  function labelsSvg(pins) {
    const placed = [];
    return pins.map((pin) => {
      const text = pin.label;
      const width = Math.min(178, Math.max(38, text.length * 4.55 + 11));
      let cx = clamp(pin.lx ?? pin.x, width / 2 + 5, 356 - width / 2);
      let cy = clamp(pin.ly ?? pin.y, 15, 291);
      const collides = (x, y) => placed.some((box) => (
        Math.abs(box.x - x) < (box.w + width) / 2 + 3 &&
        Math.abs(box.y - y) < (box.h + 14) / 2 + 2
      ));
      let tries = 0;
      while (collides(cx, cy) && tries < 14) {
        const step = 17 * Math.ceil((tries + 1) / 2);
        cy = clamp(cy + (tries % 2 === 0 ? step : -step), 15, 291);
        tries += 1;
      }
      placed.push({ x: cx, y: cy, w: width, h: 14 });
      return `<g class="d-label">
        <line class="d-label__line" x1="${pin.x}" y1="${pin.y}" x2="${cx}" y2="${cy}"></line>
        <rect class="d-label__box" x="${(cx - width / 2).toFixed(1)}" y="${(cy - 7).toFixed(1)}" width="${width.toFixed(1)}" height="14" rx="4"></rect>
        <text class="d-label__text" x="${cx}" y="${(cy + 2.7).toFixed(1)}" text-anchor="middle">${esc(text)}</text>
      </g>`;
    }).join('');
  }

  function pinSvg(pin, solved) {
    const active = state.active === pin.n;
    return `<g class="d-pin ${solved ? 'is-solved' : ''} ${active ? 'is-active' : ''}" data-pin="${pin.n}" tabindex="0" role="button"
      aria-label="Punto ${pin.n}: ${esc(pin.label)}" transform="translate(${pin.x} ${pin.y})">
      <circle class="d-pin__hit" r="16"></circle>
      <circle class="d-pin__circle" r="7.8"></circle>
      <text class="d-pin__num" y="2.8" text-anchor="middle">${pin.n}</text>
    </g>`;
  }

  function draw() {
    const variant = currentVariant();
    const solved = diagramSolvedPins(storeKey());
    const labelPins = variant.pins.filter((pin) => state.mode === 'study' && (state.showLabels || state.active === pin.n));
    const labels = labelsSvg(labelPins);
    const pins = variant.pins.map((pin) => pinSvg(pin, solved.includes(pin.n))).join('');
    const svg = variant.svg.replace('</svg>', `${labels}${pins}</svg>`);
    const pct = percent(solved.length, variant.pins.length);

    const list = variant.pins.map((pin) => {
      const isSolved = solved.includes(pin.n);
      const text = state.mode === 'study' || isSolved ? pin.label : `Punto ${pin.n}`;
      return `<button type="button" class="pin-chip ${isSolved ? 'is-done' : ''}" data-pin="${pin.n}">
        <b>${pin.n}</b><span>${esc(text)}</span>
      </button>`;
    }).join('');

    stage.innerHTML = `
      <div class="card card--plain" style="padding:0;overflow:hidden">
        <div class="diagram-toolbar">
          <span class="diagram-toolbar__title">${state.mode === 'study' ? 'Tocá un número' : '¿Qué representa cada número?'}</span>
          <div class="row" style="gap:6px">
            ${state.mode === 'study'
              ? `<button class="btn btn--xs ${state.showLabels ? 'btn--soft' : 'btn--ghost'}" type="button" data-labels aria-pressed="${state.showLabels}">${icon('list', 'icon--xs')} Etiquetas</button>`
              : `<button class="btn btn--xs btn--ghost" type="button" data-key>${icon('list', 'icon--xs')} Respuestas</button>`}
            <span class="badge ${pct === 100 ? 'badge--ok' : ''}">${solved.length}/${variant.pins.length}</span>
          </div>
        </div>
        <div class="diagram-frame" id="frame">${svg}</div>
        <div class="diagram-legend">
          ${(diagram.legend || []).map((item) => `<span><i class="legend-dot legend-dot--${item.color}"></i>${item.text}</span>`).join('')}
        </div>
      </div>

      <div class="row" style="margin-top:10px;gap:8px">
        <div style="flex:1">${bar(pct, diagram.unit === 'u8' ? 'u8' : '')}</div>
        <span class="tiny muted mono">${pct}%</span>
        ${solved.length ? `<button class="btn btn--xs btn--ghost" type="button" data-reset>${icon('refresh', 'icon--xs')} Reiniciar</button>` : ''}
      </div>

      <details class="acc" ${state.mode === 'study' ? 'open' : ''}>
        <summary>${icon('list', 'icon--sm')} Puntos del diagrama</summary>
        <div class="acc__body"><div class="pins-list">${list}</div></div>
      </details>

      <div class="stack stack--sm" style="margin-top:10px">
        ${(diagram.notes || []).map((note) => `<div class="callout callout--tip"><div class="callout__icon">${icon('bulb')}</div><div><p>${note}</p></div></div>`).join('')}
      </div>
    `;

    const labelsBtn = stage.querySelector('[data-labels]');
    if (labelsBtn) {
      labelsBtn.addEventListener('click', () => {
        state.showLabels = !state.showLabels;
        draw();
      });
    }

    const keyBtn = stage.querySelector('[data-key]');
    if (keyBtn) keyBtn.addEventListener('click', openAnswerKey);

    stage.querySelectorAll('.pin-chip').forEach((chip) => {
      chip.addEventListener('click', () => handlePin(Number(chip.dataset.pin)));
    });

    const reset = stage.querySelector('[data-reset]');
    if (reset) {
      reset.addEventListener('click', () => {
        resetDiagram(storeKey());
        state.completedShown = false;
        toast('Diagrama reiniciado');
        draw();
      });
    }

    const frame = stage.querySelector('#frame');
    frame.addEventListener('click', (event) => {
      const pin = event.target.closest('.d-pin');
      if (pin) handlePin(Number(pin.dataset.pin));
    });
    frame.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const pin = event.target.closest('.d-pin');
      if (!pin) return;
      event.preventDefault();
      handlePin(Number(pin.dataset.pin));
    });
  }

  function handlePin(num) {
    const variant = currentVariant();
    const pin = variant.pins.find((item) => item.n === num);
    if (!pin) return;
    const solved = diagramSolvedPins(storeKey());

    if (state.mode === 'study') {
      state.active = pin.n;
      draw();
      openSheet({
        title: `Punto ${pin.n} · ${variant.label}`,
        subtitle: diagram.title,
        body: `<p><b>${esc(pin.label)}</b></p><p>${pin.detail}</p>`,
        actions: [{ label: 'Cerrar', className: 'btn--soft' }],
        onClose: () => {
          state.active = null;
          draw();
        },
      });
      return;
    }

    state.active = pin.n;
    draw();
    const others = variant.pins.filter((item) => item.n !== pin.n).map((item) => item.label);
    const options = shuffle([pin.label, ...shuffle(others).slice(0, 3)]);
    const order = variant.pins.map((item) => item.n);
    const startAt = order.indexOf(pin.n);
    const nextPin = [...order.slice(startAt + 1), ...order.slice(0, startAt)]
      .find((number) => !solved.includes(number));
    const { overlay } = openSheet({
      title: `¿Qué representa el punto ${pin.n}?`,
      subtitle: `${diagram.title} · ${variant.label}`,
      body: `<div class="options options--long" data-options>
        ${options.map((option, index) => `<button type="button" class="opt" data-option="${esc(option)}">
          <span class="opt__key">${String.fromCharCode(65 + index)}</span>
          <span>${esc(option)}</span>
        </button>`).join('')}
      </div>
      <button class="btn btn--sm btn--ghost" type="button" data-reveal style="margin-top:8px">${icon('bulb', 'icon--sm')} Ver respuesta</button>
      <div class="explain" data-reveal-detail hidden></div>
      <p class="tiny muted" data-msg style="margin-top:8px">Tocá la respuesta correcta. Si fallás, podés seguir intentando.</p>`,
      actions: [
        { label: 'Cerrar', className: 'btn--soft' },
        ...(nextPin ? [{
          label: 'Siguiente punto',
          className: 'btn--primary',
          onClick: () => { setTimeout(() => handlePin(nextPin), 260); },
        }] : []),
      ],
      onClose: () => {
        state.active = null;
        draw();
      },
    });

    const msg = overlay.querySelector('[data-msg]');
    const revealBtn = overlay.querySelector('[data-reveal]');
    revealBtn.addEventListener('click', () => {
      overlay.querySelectorAll('[data-option]').forEach((button) => {
        if (button.dataset.option === pin.label) button.dataset.state = 'correct';
        else if (!button.dataset.state) button.dataset.state = 'dim';
        button.disabled = true;
      });
      const detail = overlay.querySelector('[data-reveal-detail]');
      detail.hidden = false;
      detail.innerHTML = `<div class="explain__title">${icon('bulb', 'icon--sm')} ${esc(pin.label)}</div><p>${esc(pin.detail)}</p>`;
      msg.textContent = 'Respuesta revelada: este punto no se marca como resuelto.';
      msg.style.color = 'var(--violet)';
      revealBtn.remove();
    });

    overlay.querySelectorAll('[data-option]').forEach((button) => {
      button.addEventListener('click', () => {
        const chosen = button.dataset.option;
        if (chosen === pin.label) {
          button.dataset.state = 'correct';
          markDiagramPin(storeKey(), pin.n);
          haptic(18);
          msg.textContent = '¡Correcto!';
          msg.className = 'tiny';
          msg.style.color = 'var(--green)';
          setTimeout(() => {
            closeSheet();
            draw();
            maybeCelebrate();
          }, 650);
        } else {
          button.dataset.state = 'wrong';
          button.disabled = true;
          haptic([12, 40, 12]);
          msg.textContent = 'No es esa. Mirá el gráfico y probá otra opción.';
          msg.className = 'tiny';
          msg.style.color = 'var(--rose)';
        }
      });
    });
  }

  function openAnswerKey() {
    const variant = currentVariant();
    const rows = variant.pins.map((pin) => `<div class="row-card" style="align-items:flex-start">
      <span class="row-card__num">${pin.n}</span>
      <span class="row-card__main">
        <span class="row-card__title">${esc(pin.label)}</span>
        <span class="row-card__meta">${esc(pin.detail)}</span>
      </span>
    </div>`).join('');
    openSheet({
      title: 'Respuestas del diagrama',
      subtitle: `${diagram.title} · ${variant.label}`,
      body: `<p class="tiny muted" style="margin-bottom:8px">Consultar esta lista no marca puntos como resueltos.</p>
        <div class="stack stack--sm">${rows}</div>`,
      actions: [{ label: 'Cerrar', className: 'btn--soft' }],
    });
  }

  function maybeCelebrate() {
    if (state.completedShown) return;
    const variant = currentVariant();
    const solved = diagramSolvedPins(storeKey());
    if (solved.length < variant.pins.length) return;
    state.completedShown = true;
    const topicGuess = TOPIC_BY_DIAGRAM[diagram.id] || '';
    openSheet({
      title: '¡Diagrama completo!',
      subtitle: `${solved.length} de ${variant.pins.length} puntos`,
      body: `<p>Ya identificás todos los puntos de <b>${esc(diagram.title)}</b>. Ahora fijalos con preguntas del tema.</p>`,
      actions: [
        { label: 'Seguir repasando', className: 'btn--soft' },
        {
          label: 'Ir al quiz',
          className: 'btn--primary',
          onClick: () => {
            window.location.hash = topicGuess
              ? `#/practica/quiz?scope=topic&topic=${topicGuess}`
              : '#/practica/quiz?scope=mix&n=10';
          },
        },
      ],
    });
    haptic([20, 60, 20, 60, 20]);
  }

  modeTabs.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      state.mode = button.dataset.mode;
      state.active = null;
      modeTabs.querySelectorAll('[data-mode]').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
      draw();
    });
  });

  if (variantTabs) {
    variantTabs.querySelectorAll('[data-variant]').forEach((button) => {
      button.addEventListener('click', () => {
        state.variantKey = button.dataset.variant;
        state.active = null;
        state.completedShown = false;
        variantTabs.querySelectorAll('[data-variant]').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
        draw();
      });
    });
  }

  draw();

  return {
    el,
    title: diagram.title,
    sub: `Unidad ${diagram.unit === 'u6' ? 6 : 8}`,
    nav: 'teoria',
    back,
  };
}

export function diagramCounts() {
  return ALL_DIAGRAMS.length;
}
