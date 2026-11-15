/* ============================================================
   views/theory.js — hub de teoría y lección
   ============================================================ */

import { UNIT_LIST, getUnit, getLesson, TOPICS } from '../data/index.js';
import { lessonRead, lessonsReadCount, markLessonRead } from '../core/store.js';
import { icon, bar, toast } from '../core/ui.js';
import { percent } from '../core/utils.js';
import { pageHead, renderBlocks, unitPill, topicPill, lessonTopic, segmentedTabs } from './partials.js';

const TABS = [
  { key: 'temas', label: 'Temas', href: '#/teoria' },
  { key: 'diagramas', label: 'Diagramas', href: '#/teoria/diagramas' },
  { key: 'formulas', label: 'Fórmulas', href: '#/teoria/formulas' },
];

function lessonRow(lesson, index) {
  const isRead = lessonRead(lesson.id);
  return `<a class="row-card ${isRead ? 'is-done' : ''}" href="#/teoria/leccion/${lesson.id}">
    <span class="row-card__num">${String(index + 1).padStart(2, '0')}</span>
    <span class="row-card__main">
      <span class="row-card__title">${lesson.title}</span>
      <span class="row-card__meta">${lesson.kicker} · ${lesson.minutes} min${isRead ? ' · leída' : ''}</span>
    </span>
    ${isRead ? `<span class="badge badge--ok">✓</span>` : `<svg class="row-card__chev"><use href="#i-chevron-right"></use></svg>`}
  </a>`;
}

export function theoryView() {
  const body = UNIT_LIST.map((unit) => {
    const total = unit.lessons.length;
    const read = lessonsReadCount(unit.lessons.map((lesson) => lesson.id));
    return `<section class="section">
      <div class="section__head">
        <div class="section__title">${unitPill(unit.id)} ${unit.title}</div>
        <span class="tiny muted mono">${read}/${total} leídas</span>
      </div>
      ${bar(percent(read, total), unit.id)}
      <div class="stack stack--sm">
        ${unit.lessons.map((lesson, index) => lessonRow(lesson, index)).join('')}
      </div>
      <details class="acc">
        <summary>${icon('alert', 'icon--sm')} Qué entra y qué no · Unidad ${unit.number}</summary>
        <div class="acc__body">
          <div class="callout callout--${unit.id === 'u6' ? 'info' : unit.id === 'u8' ? 'warn' : 'tip'}" style="margin-bottom:10px">
            <div class="callout__icon">${icon('graduation')}</div>
            <div><h4>Indicación de cátedra</h4><p>${unit.examQuote}</p></div>
          </div>
          <p class="mini-title" style="margin-top:0">Priorizar</p>
          <ul class="ticks">${unit.priority.map((item) => `<li>${item}</li>`).join('')}</ul>
          <p class="mini-title">Dejar para lo último</p>
          <p>${unit.notPriority}</p>
        </div>
      </details>
    </section>`;
  }).join('');

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: 'Unidades 6, 8 y 9',
      title: 'Teoría esencial',
      sub: 'Lecciones cortas, diagramas interactivos y hoja de fórmulas.',
    })}
    ${segmentedTabs(TABS, 'temas')}
    ${body}
    <div class="note">Consejo: leé una lección, abrí su diagrama y recién después hacé el quiz del tema. La repetición espaciada te va a volver a traer lo que falles.</div>
  `;

  return { el, title: 'Teoría', sub: 'Unidades 6, 8 y 9', nav: 'teoria', back: null };
}

function practiceHref(topic) {
  return topic ? `#/practica/quiz?scope=topic&topic=${encodeURIComponent(topic)}` : '#/practica/quiz?scope=u6';
}

export function lessonView({ params }) {
  const lesson = getLesson(params.id);
  if (!lesson) {
    return {
      el: (() => {
        const el = document.createElement('div');
        el.className = 'page';
        el.innerHTML = `${pageHead({ eyebrow: 'Teoría', title: 'Lección no encontrada' })}
          <a class="btn btn--primary" href="#/teoria">Volver a teoría</a>`;
        return el;
      })(),
      title: 'Teoría',
      nav: 'teoria',
      back: '/teoria',
    };
  }

  const unit = getUnit(lesson.unit);
  const topic = lessonTopic(lesson);
  const topicLabel = topic ? TOPICS[topic].label : null;
  const quizCount = unit.quiz.filter((q) => (topic ? q.topic === topic : q.unit === lesson.unit)).length;
  const index = unit.lessons.findIndex((item) => item.id === lesson.id);
  const previous = unit.lessons[index - 1];
  const next = unit.lessons[index + 1];
  const isRead = lessonRead(lesson.id);

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    <div class="lesson-top">
      ${unitPill(unit.id)}
      ${topicLabel ? topicPill(topic) : ''}
      <span class="badge">${icon('clock', 'icon--xs')} ${lesson.minutes} min</span>
      <span class="badge ${isRead ? 'badge--ok' : ''}" data-read-badge>${isRead ? '✓ Leída' : 'Sin leer'}</span>
    </div>

    <div>
      <div class="eyebrow">${lesson.kicker}</div>
      <h2 class="lesson-title">${lesson.title}</h2>
    </div>

    <div class="callout callout--info">
      <div class="callout__icon">${icon('target')}</div>
      <div><h4>Objetivo</h4><p>${lesson.goal}</p></div>
    </div>

    <article class="lesson-body">${renderBlocks(lesson.blocks)}</article>

    <div class="card">
      <div class="row row--between" style="margin-bottom:8px">
        <h3 style="font-size:0.9rem">Para recordar</h3>
        ${icon('sparkles', 'icon--sm')}
      </div>
      <ul class="ticks lesson-body" style="font-size:0.85rem">
        ${lesson.keyPoints.map((point) => `<li>${point}</li>`).join('')}
      </ul>
    </div>

    <button class="btn btn--soft btn--block" type="button" data-mark-read>
      ${icon('check-circle')} <span>${isRead ? 'Lección leída' : 'Marcar como leída'}</span>
    </button>

    <a class="btn btn--primary btn--block" href="${practiceHref(topic)}">
      ${icon('target')} Practicar ${topicLabel ? `“${topicLabel}”` : 'esta unidad'} · ${quizCount} preguntas
    </a>

    <div class="row" style="gap:8px">
      ${previous ? `<a class="btn btn--ghost btn--sm" href="#/teoria/leccion/${previous.id}" style="flex:1;text-align:left">← ${previous.title}</a>` : ''}
      ${next ? `<a class="btn btn--ghost btn--sm" href="#/teoria/leccion/${next.id}" style="flex:1;justify-content:flex-end;text-align:right">${next.title} →</a>` : ''}
    </div>
  `;

  const markBtn = el.querySelector('[data-mark-read]');
  const readBadge = el.querySelector('[data-read-badge]');
  let marked = isRead;

  const setRead = (notify = false) => {
    if (marked) return;
    marked = true;
    markLessonRead(lesson.id);
    markBtn.innerHTML = `${icon('check-circle')} <span>Lección leída</span>`;
    markBtn.classList.add('btn--primary');
    markBtn.classList.remove('btn--soft');
    if (readBadge) {
      readBadge.classList.add('badge--ok');
      readBadge.textContent = '✓ Leída';
    }
    if (notify) toast('Lección marcada como leída', 'ok');
  };

  markBtn.addEventListener('click', () => setRead(true));

  const onScroll = () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 220) {
      setRead(false);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  setTimeout(onScroll, 400);

  return {
    el,
    title: lesson.title,
    sub: `Unidad ${unit.number} · ${lesson.minutes} min`,
    nav: 'teoria',
    back: '/teoria',
    cleanup: () => window.removeEventListener('scroll', onScroll),
  };
}
