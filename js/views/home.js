/* ============================================================
   views/home.js — pantalla de inicio
   ============================================================ */

import { ALL_LESSONS, ALL_QUIZ, ALL_FORMULAS, UNIT_LIST, getLesson, getUnit } from '../data/index.js';
import { ALL_DIAGRAMS } from '../diagrams/index.js';
import { getState, lessonRead, dailySummary } from '../core/store.js';
import { quizDueCount, cardsDueCount } from '../core/sessions.js';
import { icon, ring, bar } from '../core/ui.js';
import { percent, formatNumber } from '../core/utils.js';

function masteryFor(unit) {
  const state = getState();
  const lessonsRead = unit.lessons.filter((lesson) => lessonRead(lesson.id)).length;
  const diagrams = ALL_DIAGRAMS.filter((diagram) => diagram.unit === unit.id);
  const pins = diagrams.reduce((acc, diagram) => acc + diagram.variants.reduce((sum, variant) => sum + variant.pins.length, 0), 0);
  const solved = diagrams.reduce((acc, diagram) => acc + diagram.variants.reduce((sum, variant) => {
    return sum + (state.diagrams[`${diagram.id}:${variant.key}`]?.solved?.length || 0);
  }, 0), 0);
  const quiz = unit.quiz.filter((question) => (state.quiz[question.id]?.box || 0) >= 4).length;
  const cards = unit.cards.filter((card) => (state.cards[card.id]?.box || 0) >= 4).length;
  const pct = Math.round((percent(lessonsRead, unit.lessons.length) + percent(solved, pins) + percent(quiz, unit.quiz.length) + percent(cards, unit.cards.length)) / 4);
  return { pct, lessonsRead, lessonsTotal: unit.lessons.length, solved, pins, quiz, quizTotal: unit.quiz.length, cards, cardsTotal: unit.cards.length };
}

function unitCard(unit, stats) {
  const thirdLink = unit.id === 'u6'
    ? { href: '#/ensayos', icon: 'flask', label: 'Ensayos' }
    : unit.id === 'u8'
      ? { href: '#/practica/simuladores/chvorinov', icon: 'calculator', label: 'Chvorinov' }
      : { href: '#/practica/simuladores/palanca', icon: 'calculator', label: 'Palanca' };

  return `<div class="unit-card unit-card--${unit.id}">
    <div class="unit-card__head">
      <span class="unit-num">${unit.number}</span>
      <div class="unit-card__titles">
        <h3>${unit.title}</h3>
        <p>${unit.subtitle}</p>
      </div>
      <span class="unit-card__badge">${unit.tag}</span>
    </div>

    <div class="row row--between" style="margin-top:13px">
      <span class="tiny muted">Dominio estimado</span>
      <span class="tiny mono" style="color:var(--text)">${stats.pct}%</span>
    </div>
    <div style="margin-top:5px">${bar(stats.pct, unit.id)}</div>

    <div class="unit-card__meta">
      <span><b>${stats.lessonsRead}/${stats.lessonsTotal}</b> lecciones</span>
      <span><b>${stats.quiz}/${stats.quizTotal}</b> preguntas</span>
      <span><b>${stats.cards}/${stats.cardsTotal}</b> tarjetas</span>
    </div>

    <div class="unit-card__links">
      <a class="mini-link" href="#/teoria">${icon('book')} Teoría</a>
      <a class="mini-link" href="#/teoria/diagramas">${icon('chart')} Diagramas</a>
      <a class="mini-link" href="${thirdLink.href}">${icon(thirdLink.icon)} ${thirdLink.label}</a>
      <a class="mini-link" href="#/practica/quiz?scope=${unit.id}&n=12">${icon('target')} Practicar</a>
    </div>
  </div>`;
}

export function homeView() {
  const state = getState();
  const summary = dailySummary();
  const dueQuiz = quizDueCount('mix');
  const dueCards = cardsDueCount('mix');
  const units = UNIT_LIST.map((unit) => ({ unit, stats: masteryFor(unit) }));
  const overall = Math.round(units.reduce((acc, item) => acc + item.stats.pct, 0) / units.length);
  const lastLesson = state.lastLesson ? getLesson(state.lastLesson) : null;
  const lastLessonUnit = lastLesson ? getUnit(lastLesson.unit) : null;
  const initialLesson = lastLesson || ALL_LESSONS[0];

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    <section class="hero">
      <div class="hero__top">
        <div class="hero__copy">
          <span class="hero__kicker">Parcial 2 · CDM</span>
          <h2>Unidades <em>6, 8 y 9</em><br>para repasar en el celular</h2>
          <p class="hero__sub">Ensayos, impacto Charpy/Izod, fases, solubilidad y regla de la palanca. Sesiones cortas, repetidas hasta que quede en memoria.</p>
        </div>
        <div class="hero__ring">
          ${ring(overall, 'dominio', { size: 78 })}
        </div>
      </div>

      <div class="hero__actions">
        <a class="btn btn--primary" href="#/practica/quiz?scope=${dueQuiz ? 'due' : 'mix'}&n=10">
          ${icon('play')} ${dueQuiz ? 'Repaso de hoy' : 'Repaso mixto · 10'}
        </a>
        <a class="btn btn--soft" href="#/practica/quiz?scope=exam&n=20">${icon('trophy')} Examen 20</a>
      </div>

      <div class="hero__foot">
        <span>🔥 Racha <b style="color:var(--amber)">${state.streak.days || 0}</b> ${state.streak.days === 1 ? 'día' : 'días'}</span>
        <span>Hoy <b style="color:var(--text)">${summary.answers}</b>/${summary.goal}</span>
        <span><b style="color:var(--text)">${dueQuiz}</b> preguntas y <b style="color:var(--text)">${dueCards}</b> tarjetas</span>
      </div>
    </section>

    <a class="row-card" href="#/teoria/leccion/${initialLesson.id}">
      <span class="row-card__num" style="color:var(--accent)">${icon('play', 'icon--sm')}</span>
      <span class="row-card__main">
        <span class="row-card__title">${lastLesson ? 'Seguí donde quedaste' : 'Empezá por acá'}: ${initialLesson.title}</span>
        <span class="row-card__meta">${lastLesson ? `Unidad ${lastLessonUnit.number} · ${lastLesson.minutes} min` : 'La lección base de la unidad 6'} · repaso de ${formatNumber(ALL_LESSONS.length, 0)} lecciones</span>
      </span>
      <svg class="row-card__chev"><use href="#i-chevron-right"></use></svg>
    </a>

    <section class="section">
      <div class="section__head">
        <div class="section__title">Unidades</div>
        <span class="tiny muted">${ALL_LESSONS.length} lecciones · ${ALL_QUIZ.length} preguntas</span>
      </div>
      <div class="stack">
        ${units.map(({ unit, stats }) => unitCard(unit, stats)).join('')}
      </div>
    </section>

    <section class="section">
      <div class="section__head"><div class="section__title">El tema estrella</div><span class="badge badge--warn">Charpy e Izod</span></div>
      <div class="card" style="background:radial-gradient(120% 120% at 100% 0%, var(--amber-soft), transparent 60%), linear-gradient(170deg, var(--surface), var(--bg-soft))">
        <div class="row" style="align-items:flex-start">
          <span class="lab-head__icon" style="background:var(--amber-soft);color:var(--amber)">${icon('zap')}</span>
          <div style="flex:1">
            <h3 style="font-size:0.98rem">Ensayo de impacto</h3>
            <p class="card__sub">Péndulo, energía absorbida, % de fractura por corte y el lado del golpe que más preguntan.</p>
          </div>
        </div>
        <div class="row row--wrap" style="margin-top:10px">
          <a class="chip" href="#/ensayos/impacto-charpy">Charpy</a>
          <a class="chip" href="#/ensayos/impacto-izod">Izod</a>
          <a class="chip" href="#/teoria/diagramas/impacto">Diagrama</a>
          <a class="chip" href="#/practica/quiz?scope=topic&topic=impacto">Quiz</a>
        </div>
        <a class="btn btn--primary btn--block" style="margin-top:12px" href="#/practica/quiz?scope=topic&topic=impacto">${icon('target')} Practicar impacto</a>
      </div>
    </section>

    <section class="section">
      <div class="section__head"><div class="section__title">Herramientas</div></div>
      <div class="grid grid--2">
        <a class="card card--tap" href="#/teoria/diagramas" style="display:block">
          <div class="row" style="gap:8px">${icon('chart', 'icon--sm')}<b style="font-size:0.85rem">Diagramas</b></div>
          <p class="card__sub">${ALL_DIAGRAMS.length} interactivos con pines</p>
        </a>
        <a class="card card--tap" href="#/practica/simuladores" style="display:block">
          <div class="row" style="gap:8px">${icon('calculator', 'icon--sm')}<b style="font-size:0.85rem">Simuladores</b></div>
          <p class="card__sub">Chvorinov, impacto, palanca y calculadoras</p>
        </a>
        <a class="card card--tap" href="#/teoria/formulas" style="display:block">
          <div class="row" style="gap:8px">${icon('book', 'icon--sm')}<b style="font-size:0.85rem">Fórmulas</b></div>
          <p class="card__sub">${ALL_FORMULAS.length} para tapar y repasar</p>
        </a>
        <a class="card card--tap" href="#/progreso" style="display:block">
          <div class="row" style="gap:8px">${icon('chart', 'icon--sm')}<b style="font-size:0.85rem">Progreso</b></div>
          <p class="card__sub">Racha, temas flojos y respaldo</p>
        </a>
      </div>
    </section>

    <div class="note">Atajo para el celular: agregá esta página a la pantalla de inicio. Queda como una app, abre sin internet y guarda tu avance. Recomendado: una sesión corta por día y una extra antes del parcial.</div>
  `;

  return { el, title: 'CDM · Repaso', sub: 'Parcial 2 · Unidades 6, 8 y 9', nav: 'inicio', back: null };
}
