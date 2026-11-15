/* ============================================================
   views/quiz.js — motor de quiz con repaso espaciado
   ============================================================ */

import { getTopic } from '../data/index.js';
import { buildQuizSession, scopeLabel } from '../core/sessions.js';
import { recordQuizResult, recordSession } from '../core/store.js';
import { icon, bar, ring, toast, haptic, openSheet, scoreMessage } from '../core/ui.js';
import { clamp, esc, formatNumber, parseNumber, percent, shuffle } from '../core/utils.js';
import { navigate } from '../core/router.js';

function correctAnswerText(question) {
  if (question.type === 'mcq') return question.options[question.correct];
  return `${formatNumber(question.answer, 2)}${question.answerUnit ? ` ${question.answerUnit}` : ''}`;
}

export function quizView({ query }) {
  const scope = query.scope || 'mix';
  const topic = query.topic || '';
  const n = clamp(Number.parseInt(query.n, 10) || 10, 3, 30);
  const session = buildQuizSession({ scope, topic, n });

  if (!session.length) {
    const el = document.createElement('div');
    el.className = 'page';
    el.innerHTML = `
      <div class="page-head"><div class="page-head__main"><div class="eyebrow">Práctica</div><h2>No hay preguntas para este filtro</h2><p>${scope === 'due' ? 'No tenés preguntas pendientes: ya repasaste todo lo de hoy.' : 'Probá con otro alcance o con una sesión mixta.'}</p></div></div>
      <a class="btn btn--primary btn--block" href="#/practica/quiz?scope=mix&n=10">${icon('shuffle')} Empezar repaso mixto</a>
      <a class="btn btn--soft btn--block" href="#/practica">Volver a práctica</a>
    `;
    return { el, title: 'Quiz', nav: 'practica', back: '/practica' };
  }

  const items = session.map((question) => ({
    q: question,
    order: question.type === 'mcq' ? shuffle(question.options.map((_, index) => index)) : null,
  }));

  let index = 0;
  let answered = false;
  let chosen = null;
  const results = [];
  const startedAt = Date.now();
  let savedSession = false;

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    <div class="quiz-top">
      <button class="icon-btn" type="button" data-exit aria-label="Salir del quiz">${icon('x')}</button>
      <div style="flex:1;min-width:0">
        <div class="row row--between" style="margin-bottom:6px">
          <span class="quiz-top__label">${scopeLabel(scope, topic)}</span>
          <span class="quiz-top__count" data-count>1 / ${items.length}</span>
        </div>
        <div data-progress></div>
      </div>
    </div>
    <div id="qArea"></div>
    <div class="action-dock">
      <div class="action-dock__inner">
        <button class="btn btn--outline btn--sm" type="button" data-skip>Saltar</button>
        <button class="btn btn--primary" type="button" data-next disabled>Siguiente ${icon('arrow-right', 'icon--sm')}</button>
      </div>
    </div>
  `;

  const qArea = el.querySelector('#qArea');
  const countLabel = el.querySelector('[data-count]');
  const progressBox = el.querySelector('[data-progress]');
  const nextBtn = el.querySelector('[data-next]');
  const dock = el.querySelector('.action-dock');

  const current = () => items[index];

  function drawProgress() {
    countLabel.textContent = `${Math.min(index + 1, items.length)} / ${items.length}`;
    progressBox.innerHTML = bar(percent(index + (answered ? 1 : 0), items.length));
  }

  function feedbackHtml(question, ok) {
    return `<div class="explain ${ok ? 'explain--ok' : 'explain--bad'}">
      <div class="explain__title">${icon(ok ? 'check-circle' : 'x-circle')} ${ok ? '¡Correcto!' : `Respuesta correcta: ${esc(correctAnswerText(question))}`}</div>
      <p>${esc(question.explain)}</p>
      ${question.steps ? `<ol>${question.steps.map((step) => `<li>${esc(step)}</li>`).join('')}</ol>` : ''}
    </div>`;
  }

  function renderQuestion() {
    answered = false;
    chosen = null;
    nextBtn.disabled = true;
    nextBtn.innerHTML = index === items.length - 1 ? `Ver resultados ${icon('check', 'icon--sm')}` : `Siguiente ${icon('arrow-right', 'icon--sm')}`;

    const item = current();
    const question = item.q;
    const topicInfo = getTopic(question.topic);

    qArea.innerHTML = `
      <div class="q-card">
        <div class="q-meta">
          <span class="badge badge--${question.unit === 'u6' ? 'accent' : question.unit === 'u8' ? 'warn' : 'ok'}">U${Number(question.unit.slice(1))}</span>
          <span class="badge">${esc(topicInfo.label)}</span>
          ${question.type === 'num' ? '<span class="badge badge--violet">cálculo</span>' : ''}
        </div>
        <p class="q-text">${esc(question.q)}</p>
        ${question.type === 'mcq' ? `
          <div class="options" data-options>
            ${item.order.map((originalIndex, displayIndex) => `
              <button type="button" class="opt" data-opt="${displayIndex}" data-original="${originalIndex}">
                <span class="opt__key">${String.fromCharCode(65 + displayIndex)}</span>
                <span>${esc(question.options[originalIndex])}</span>
              </button>`).join('')}
          </div>` : `
          <div class="numeric-row">
            <div class="input-group" style="flex:1">
              <input class="input" type="text" inputmode="decimal" autocomplete="off" placeholder="Tu resultado" aria-label="Resultado numérico" data-numeric>
              ${question.answerUnit ? `<span class="input-group__unit">${esc(question.answerUnit)}</span>` : ''}
            </div>
            <button class="btn btn--primary" type="button" data-check>${icon('check', 'icon--sm')}</button>
          </div>
          <p class="q-hint">Podés escribir con coma o punto decimal. Se acepta un margen de redondeo.</p>`}
        <div data-feedback></div>
      </div>
    `;

    drawProgress();
    window.scrollTo({ top: 0, behavior: 'auto' });

    if (question.type === 'mcq') {
      qArea.querySelectorAll('[data-opt]').forEach((button) => {
        button.addEventListener('click', () => chooseOption(Number(button.dataset.original), button));
      });
    } else {
      const input = qArea.querySelector('[data-numeric]');
      const checkBtn = qArea.querySelector('[data-check]');
      checkBtn.addEventListener('click', checkNumeric);
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          checkNumeric();
        }
      });
      setTimeout(() => input.focus({ preventScroll: true }), 150);
    }
  }

  function finishAnswer(ok) {
    answered = true;
    chosen = ok;
    const question = current().q;
    recordQuizResult(question.id, ok, question.unit);
    results.push({ id: question.id, unit: question.unit, topic: question.topic, ok, q: question });
    nextBtn.disabled = false;
    drawProgress();
    haptic(ok ? 16 : [12, 50, 12]);
  }

  function chooseOption(originalIndex, button) {
    if (answered) return;
    const question = current().q;
    const ok = originalIndex === question.correct;
    qArea.querySelectorAll('[data-opt]').forEach((option) => {
      const original = Number(option.dataset.original);
      if (original === question.correct) option.dataset.state = 'correct';
      else if (option === button && !ok) option.dataset.state = 'wrong';
      else option.dataset.state = 'dim';
      option.disabled = true;
    });
    qArea.querySelector('[data-feedback]').innerHTML = feedbackHtml(question, ok);
    finishAnswer(ok);
  }

  function checkNumeric() {
    if (answered) return;
    const question = current().q;
    const input = qArea.querySelector('[data-numeric]');
    const value = parseNumber(input.value);
    if (!Number.isFinite(value)) {
      toast('Escribí un número para comprobar', 'bad');
      input.focus();
      return;
    }
    const tolerance = question.tolerance != null ? question.tolerance : Math.max(0.05, Math.abs(question.answer) * 0.02);
    const ok = Math.abs(value - question.answer) <= tolerance;
    input.disabled = true;
    qArea.querySelector('[data-check]').disabled = true;
    qArea.querySelector('[data-feedback]').innerHTML = feedbackHtml(question, ok);
    if (ok) {
      qArea.querySelector('[data-feedback]').insertAdjacentHTML(
        'afterbegin',
        `<p class="tiny" style="color:var(--green);margin-bottom:6px">Tu respuesta: ${esc(formatNumber(value, 2))} ${esc(question.answerUnit || '')}</p>`,
      );
    }
    finishAnswer(ok);
  }

  function advance() {
    if (index >= items.length - 1) {
      renderResults();
      return;
    }
    index += 1;
    renderQuestion();
  }

  function next() {
    if (!answered) return;
    advance();
  }

  function skip() {
    if (savedSession) return;
    haptic(8);
    advance();
  }

  function renderResults() {
    if (savedSession) return;
    savedSession = true;
    const correct = results.filter((result) => result.ok).length;
    const total = results.length;
    const omitted = items.length - total;
    const accuracy = total ? percent(correct, total) : 0;
    const seconds = Math.round((Date.now() - startedAt) / 1000);
    if (total > 0) recordSession({ kind: 'quiz', scope, topic, total, correct, omitted, seconds });
    const heroTitle = total === 0 ? 'Sesión sin respuestas' : omitted > 0 ? `Sesión parcial: ${correct} de ${total}` : scoreMessage(accuracy, total);

    dock.remove();
    el.innerHTML = `
      <div class="result-hero">
        ${ring(accuracy, 'aciertos', { size: 108 })}
        <h2>${heroTitle}</h2>
        <p>${total ? `${correct} de ${total} correctas` : 'No respondiste ninguna pregunta'}${omitted ? ` · ${omitted} omitidas` : ''} · ${seconds}s</p>
      </div>

      <div class="grid grid--3">
        <div class="stat"><div class="stat__value" style="color:var(--green)">${correct}</div><div class="stat__label">Bien</div></div>
        <div class="stat"><div class="stat__value" style="color:var(--rose)">${total - correct}</div><div class="stat__label">Para repasar</div></div>
        <div class="stat"><div class="stat__value">${total ? `${accuracy}%` : '—'}</div><div class="stat__label">Precisión</div></div>
      </div>

      ${total - correct > 0 ? `
        <section class="section">
          <div class="section__head"><div class="section__title">Repaso de errores</div></div>
          <div class="review-list">
            ${results.filter((result) => !result.ok).map((result) => `
              <div class="review-item">
                <div class="review-item__q">${esc(result.q.q)}</div>
                <div class="review-item__a">✓ ${esc(correctAnswerText(result.q))}</div>
                <div class="review-item__note">${esc(result.q.explain)}</div>
              </div>`).join('')}
          </div>
        </section>` : total > 0 ? `
        <div class="callout callout--tip"><div class="callout__icon">${icon('trophy')}</div><div><h4>Sin errores</h4><p>${omitted ? `Respondiste ${total} y omitiste ${omitted}: las omitidas no cuentan como error.` : 'Sesión perfecta. Volvé mañana: las preguntas van a reaparecer cuando toque repasarlas.'}</p></div></div>` : `
        <div class="callout callout--info"><div class="callout__icon">${icon('info')}</div><div><h4>No se guardó nada</h4><p>Las preguntas omitidas no cuentan como error ni afectan tu repaso. Podés volver cuando quieras.</p></div></div>`}

      <div class="stack stack--sm">
        <button class="btn btn--primary btn--block" type="button" data-repeat>${icon('refresh')} Repetir sesión</button>
        ${total - correct > 0 ? `<a class="btn btn--soft btn--block" href="#/practica/quiz?scope=weak&n=${Math.max(5, total - correct)}">${icon('target')} Practicar solo los errores</a>` : ''}
        <a class="btn btn--ghost btn--block" href="#/practica">Volver a práctica</a>
      </div>
    `;

    el.querySelector('[data-repeat]').addEventListener('click', () => {
      const params = new URLSearchParams({ scope, n: String(n), r: String(Date.now()) });
      if (topic) params.set('topic', topic);
      navigate(`/practica/quiz?${params.toString()}`);
    });

    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  const onExit = () => {
    if (savedSession) {
      navigate('/practica');
      return;
    }
    openSheet({
      title: 'Salir del quiz',
      subtitle: savedSession ? '' : 'Tu avance queda guardado pregunta por pregunta',
      body: `<p>Podés seguir, ver los resultados de lo que respondiste hasta ahora o salir.</p>`,
      actions: [
        { label: 'Seguir', className: 'btn--ghost' },
        ...(results.length ? [{ label: 'Ver resultados', className: 'btn--soft', onClick: () => renderResults() }] : []),
        { label: 'Salir', className: 'btn--danger', onClick: () => navigate('/practica') },
      ],
    });
  };

  el.querySelectorAll('[data-exit]').forEach((button) => button.addEventListener('click', onExit));
  el.querySelector('[data-skip]').addEventListener('click', skip);
  nextBtn.addEventListener('click', next);

  const onKey = (event) => {
    if (event.target.matches('input, textarea')) return;
    if (event.key === 'Enter' && answered) {
      event.preventDefault();
      next();
      return;
    }
    if (!answered && current().q.type === 'mcq' && /^[1-4]$/.test(event.key)) {
      const displayIndex = Number(event.key) - 1;
      const button = qArea.querySelector(`[data-opt="${displayIndex}"]`);
      if (button) button.click();
    }
  };
  window.addEventListener('keydown', onKey);

  renderQuestion();

  return {
    el,
    title: 'Quiz',
    sub: scopeLabel(scope, topic),
    nav: 'practica',
    back: '/practica',
    focus: true,
    cleanup: () => window.removeEventListener('keydown', onKey),
  };
}
