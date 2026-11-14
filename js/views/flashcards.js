/* ============================================================
   views/flashcards.js — tarjetas de memoria con autoevaluación
   ============================================================ */

import { getTopic, getUnit } from '../data/index.js';
import { buildCardSession, scopeLabel } from '../core/sessions.js';
import { recordCardResult, recordSession } from '../core/store.js';
import { icon, bar, ring, haptic, toast, confirmSheet, scoreMessage } from '../core/ui.js';
import { clamp, esc, percent } from '../core/utils.js';
import { navigate } from '../core/router.js';

export function flashcardsView({ query }) {
  const scope = query.scope || 'mix';
  const n = clamp(Number.parseInt(query.n, 10) || 20, 4, 60);
  const cards = buildCardSession({ scope, n });

  if (!cards.length) {
    const el = document.createElement('div');
    el.className = 'page';
    el.innerHTML = `
      <div class="page-head"><div class="page-head__main"><div class="eyebrow">Práctica</div><h2>No hay tarjetas para este filtro</h2><p>Cambiá la unidad o volvé a práctica.</p></div></div>
      <a class="btn btn--primary btn--block" href="#/practica/tarjetas?scope=mix&n=20">${icon('layers')} Repaso mixto</a>
      <a class="btn btn--soft btn--block" href="#/practica">Volver</a>`;
    return { el, title: 'Tarjetas', nav: 'practica', back: '/practica' };
  }

  let index = 0;
  let flipped = false;
  const results = [];
  const startedAt = Date.now();
  let finished = false;

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    <div class="quiz-top">
      <button class="icon-btn" type="button" data-exit aria-label="Salir de las tarjetas">${icon('x')}</button>
      <div style="flex:1;min-width:0">
        <div class="row row--between" style="margin-bottom:6px">
          <span class="quiz-top__label">Tarjetas · ${scopeLabel(scope)}</span>
          <span class="quiz-top__count" data-count>1 / ${cards.length}</span>
        </div>
        <div data-progress></div>
      </div>
    </div>
    <div id="cardArea"></div>
  `;

  const cardArea = el.querySelector('#cardArea');
  const countLabel = el.querySelector('[data-count]');
  const progressBox = el.querySelector('[data-progress]');

  function drawProgress() {
    countLabel.textContent = `${Math.min(index + 1, cards.length)} / ${cards.length}`;
    progressBox.innerHTML = bar(percent(index, cards.length));
  }

  function renderCard() {
    flipped = false;
    const card = cards[index];
    const unit = getUnit(card.unit);
    const topic = card.topic ? getTopic(card.topic).label : '';

    cardArea.innerHTML = `
      <div class="flash-stage">
        <div class="flash-card" data-flash role="button" tabindex="0" aria-label="Tocar para ver la respuesta">
          <div class="flash-inner">
            <div class="flash-face">
              <div class="flash-face__tag">${icon(card.unit === 'u6' ? 'flask' : 'layers', 'icon--xs')} U${unit.number} · ${esc(topic)}</div>
              <div class="flash-face__text">${esc(card.front)}</div>
              ${card.hint ? `<div class="flash-face__hint">Pista: ${esc(card.hint)}</div>` : ''}
              <div class="flash-tap">${icon('refresh', 'icon--xs')} Tocá para ver la respuesta</div>
            </div>
            <div class="flash-face flash-back">
              <div class="flash-face__tag">${icon('check-circle', 'icon--xs')} Respuesta</div>
              <div class="flash-face__text">${esc(card.back)}</div>
              <div class="flash-face__hint">¿La sabías antes de dar vuelta la tarjeta?</div>
            </div>
          </div>
        </div>
      </div>
      <div class="flash-controls">
        <button class="btn btn--soft" type="button" data-grade="0" disabled>
          ${icon('refresh', 'icon--sm')} No la sabía
          <small>Vuelve a la caja 0</small>
        </button>
        <button class="btn btn--soft" type="button" data-grade="1" disabled>
          ${icon('check', 'icon--sm')} La sabía
          <small>Sube una caja</small>
        </button>
      </div>
      <button class="btn btn--outline btn--sm btn--block" type="button" data-skip style="margin-top:8px">Saltar esta tarjeta</button>
      <p class="tiny muted center" style="margin-top:8px">Primero intentá recordarla. Después girala y calificate con honestidad.</p>
    `;

    drawProgress();
    window.scrollTo({ top: 0, behavior: 'auto' });

    const flash = cardArea.querySelector('[data-flash]');
    const flip = () => {
      flipped = !flipped;
      flash.classList.toggle('is-flipped', flipped);
      cardArea.querySelectorAll('[data-grade]').forEach((button) => { button.disabled = !flipped; });
    };

    flash.addEventListener('click', flip);
    flash.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        flip();
      }
    });

    cardArea.querySelectorAll('[data-grade]').forEach((button) => {
      button.addEventListener('click', () => {
        if (!flipped) {
          toast('Girá la tarjeta antes de calificarte');
          return;
        }
        grade(button.dataset.grade === '1');
      });
    });

    cardArea.querySelector('[data-skip]').addEventListener('click', skip);
  }

  function advance() {
    if (index >= cards.length - 1) {
      renderSummary();
      return;
    }
    index += 1;
    renderCard();
  }

  function skip() {
    if (finished) return;
    haptic(8);
    advance();
  }

  function grade(ok) {
    if (finished) return;
    const card = cards[index];
    recordCardResult(card.id, ok, card.unit);
    results.push({ card, ok });
    haptic(ok ? 14 : [10, 40, 10]);
    advance();
  }

  function renderSummary() {
    finished = true;
    const correct = results.filter((result) => result.ok).length;
    const total = results.length;
    const omitted = cards.length - total;
    const accuracy = total ? percent(correct, total) : 0;
    const seconds = Math.round((Date.now() - startedAt) / 1000);
    if (total > 0) recordSession({ kind: 'cards', scope, total, correct, omitted, seconds });
    const heroTitle = total === 0 ? 'No calificaste ninguna tarjeta' : omitted > 0 ? `Ronda parcial: ${correct} de ${total}` : scoreMessage(accuracy, total);

    el.innerHTML = `
      <div class="result-hero">
        ${ring(accuracy, 'sabidas', { size: 108 })}
        <h2>${heroTitle}</h2>
        <p>${total ? `${correct} de ${total} tarjetas` : 'Las omitidas no cuentan'}${omitted ? ` · ${omitted} omitidas` : ''} · ${seconds}s</p>
      </div>
      <div class="grid grid--3">
        <div class="stat"><div class="stat__value" style="color:var(--green)">${correct}</div><div class="stat__label">Sabidas</div></div>
        <div class="stat"><div class="stat__value" style="color:var(--rose)">${total - correct}</div><div class="stat__label">A repasar</div></div>
        <div class="stat"><div class="stat__value">${total ? `${accuracy}%` : '—'}</div><div class="stat__label">Precisión</div></div>
      </div>
      ${total - correct > 0 ? `
        <section class="section">
          <div class="section__head"><div class="section__title">Tarjetas para volver</div></div>
          <div class="review-list">
            ${results.filter((result) => !result.ok).map((result) => `
              <div class="review-item">
                <div class="review-item__q">${esc(result.card.front)}</div>
                <div class="review-item__note">${esc(result.card.back)}</div>
              </div>`).join('')}
          </div>
        </section>` : total === 0 ? `
        <div class="callout callout--info"><div class="callout__icon">${icon('info')}</div><div><h4>Sin registros</h4><p>Saltaste todas las tarjetas: no se modificó tu progreso.</p></div></div>` : ''}
      <div class="stack stack--sm">
        <button class="btn btn--primary btn--block" type="button" data-repeat>${icon('refresh')} Otra ronda</button>
        <a class="btn btn--soft btn--block" href="#/practica/quiz?scope=${scope}&n=10">${icon('target')} Pasar al quiz</a>
        <a class="btn btn--ghost btn--block" href="#/practica">Volver a práctica</a>
      </div>
    `;

    el.querySelector('[data-repeat]').addEventListener('click', () => {
      const params = new URLSearchParams({ scope, n: String(n), r: String(Date.now()) });
      navigate(`/practica/tarjetas?${params.toString()}`);
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  const onExit = () => {
    if (results.length && !finished) {
      confirmSheet({
        title: 'Salir de las tarjetas',
        message: 'Las tarjetas que ya calificaste quedaron guardadas.',
        confirmLabel: 'Salir',
        danger: true,
        onConfirm: () => navigate('/practica'),
      });
    } else {
      navigate('/practica');
    }
  };
  el.querySelectorAll('[data-exit]').forEach((button) => button.addEventListener('click', onExit));

  const onKey = (event) => {
    if (event.target.matches('input, textarea')) return;
    const flash = cardArea.querySelector('[data-flash]');
    if (!flash) return;
    if (event.key === ' ' || event.key === 'Enter') {
      if (event.target === flash) return;
      event.preventDefault();
      flash.click();
    }
    if (flipped && (event.key === '1' || event.key === '2')) {
      const gradeValue = event.key === '2' ? '1' : '0';
      const button = cardArea.querySelector(`[data-grade="${gradeValue}"]`);
      if (button) button.click();
    }
  };
  window.addEventListener('keydown', onKey);

  renderCard();

  return {
    el,
    title: 'Tarjetas',
    sub: scopeLabel(scope),
    nav: 'practica',
    back: '/practica',
    focus: true,
    cleanup: () => window.removeEventListener('keydown', onKey),
  };
}
