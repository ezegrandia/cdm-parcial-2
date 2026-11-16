/* ============================================================
   views/progress.js — progreso, temas flojos, ajustes y respaldo
   ============================================================ */

import { ALL_LESSONS, ALL_CARDS, ALL_QUIZ, TOPICS, UNIT_LIST, getUnit } from '../data/index.js';
import { ALL_DIAGRAMS } from '../diagrams/index.js';
import {
  getState, dailySummary, weeklyActivity, lessonRead, recentSessions,
  exportSnapshot, importSnapshot, resetProgress, setSetting, setTheme,
} from '../core/store.js';
import { icon, bar, ring, toast, openSheet, confirmSheet, haptic, applyTheme } from '../core/ui.js';
import { percent, downloadText, esc } from '../core/utils.js';
import { pageHead } from './partials.js';
import { navigate } from '../core/router.js';

const KIND_LABEL = { quiz: 'Quiz', cards: 'Tarjetas' };

function unitStats(unitId) {
  const unit = getUnit(unitId);
  const state = getState();
  const lessons = unit.lessons;
  const lessonsRead = lessons.filter((lesson) => lessonRead(lesson.id)).length;
  const diagrams = ALL_DIAGRAMS.filter((diagram) => diagram.unit === unitId);
  const diagramPins = diagrams.reduce((acc, diagram) => acc + diagram.variants.reduce((sum, variant) => sum + variant.pins.length, 0), 0);
  const diagramSolved = diagrams.reduce((acc, diagram) => acc + diagram.variants.reduce((sum, variant) => {
    const solved = state.diagrams[`${diagram.id}:${variant.key}`]?.solved || [];
    return sum + solved.length;
  }, 0), 0);
  const quizMastered = unit.quiz.filter((question) => (state.quiz[question.id]?.box || 0) >= 4).length;
  const cardsMastered = unit.cards.filter((card) => (state.cards[card.id]?.box || 0) >= 4).length;
  const overall = Math.round(
    (percent(lessonsRead, lessons.length) +
      percent(diagramSolved, diagramPins) +
      percent(quizMastered, unit.quiz.length) +
      percent(cardsMastered, unit.cards.length)) / 4,
  );
  return { overall, lessonsRead, lessonsTotal: lessons.length, diagramSolved, diagramPins, quizMastered, quizTotal: unit.quiz.length, cardsMastered, cardsTotal: unit.cards.length };
}

function globalAccuracy() {
  const state = getState();
  const entries = Object.values(state.quiz);
  const seen = entries.reduce((acc, entry) => acc + (entry.seen || 0), 0);
  const ok = entries.reduce((acc, entry) => acc + (entry.ok || 0), 0);
  return { seen, ok, accuracy: percent(ok, seen) };
}

function topicStats() {
  const state = getState();
  return Object.entries(TOPICS).map(([id, meta]) => {
    const questions = ALL_QUIZ.filter((question) => question.topic === id);
    let attempts = 0;
    let oks = 0;
    let answered = 0;
    questions.forEach((question) => {
      const entry = state.quiz[question.id];
      if (entry) {
        answered += 1;
        attempts += entry.seen || 0;
        oks += entry.ok || 0;
      }
    });
    return { id, ...meta, total: questions.length, answered, attempts, oks, accuracy: percent(oks, attempts) };
  });
}

function boxesDistribution() {
  const state = getState();
  const boxes = [0, 0, 0, 0, 0, 0, 0];
  [...Object.values(state.quiz), ...Object.values(state.cards)].forEach((entry) => {
    const box = Math.min(6, Math.max(0, entry.box || 0));
    boxes[box] += 1;
  });
  return boxes;
}

function achievements() {
  const state = getState();
  const lessonsRead = ALL_LESSONS.filter((lesson) => lessonRead(lesson.id)).length;
  const quizEntries = Object.values(state.quiz);
  const attempts = quizEntries.reduce((acc, entry) => acc + (entry.seen || 0), 0);
  const impactMastered = ALL_QUIZ.filter((question) => question.topic === 'impacto' && (state.quiz[question.id]?.box || 0) >= 4).length;
  const anyDiagram = ALL_DIAGRAMS.some((diagram) => diagram.variants.every((variant) => {
    const solved = state.diagrams[`${diagram.id}:${variant.key}`]?.solved || [];
    return variant.pins.every((pin) => solved.includes(pin.n));
  }));
  return [
    { icon: 'book', name: 'Primera lección', done: lessonsRead >= 1 },
    { icon: 'book', name: '5 lecciones', done: lessonsRead >= 5 },
    { icon: 'graduation', name: 'Teoría completa', done: lessonsRead >= ALL_LESSONS.length },
    { icon: 'target', name: '10 respuestas', done: attempts >= 10 },
    { icon: 'zap', name: '100 respuestas', done: attempts >= 100 },
    { icon: 'flame', name: 'Racha de 3', done: (state.streak.days || 0) >= 3 },
    { icon: 'flame', name: 'Racha de 7', done: (state.streak.days || 0) >= 7 },
    { icon: 'layers', name: 'Diagrama completo', done: anyDiagram },
    { icon: 'trophy', name: 'Impacto dominado', done: impactMastered >= 5 },
  ];
}

export function progressView() {
  const state = getState();
  const summary = dailySummary();
  const weekly = weeklyActivity();
  const accuracy = globalAccuracy();
  const unitData = UNIT_LIST.map((unit) => ({ unit, stats: unitStats(unit.id) }));
  const topics = topicStats();
  const practicedTopics = topics.filter((topic) => topic.attempts > 0);
  const boxes = boxesDistribution();
  const sessions = recentSessions(5);
  const badges = achievements();
  const maxWeek = Math.max(1, ...weekly.map((day) => day.answers));
  const weakTopics = [...topics].filter((topic) => topic.attempts >= 2).sort((a, b) => a.accuracy - b.accuracy).slice(0, 3);
  const totalMasteredQuiz = unitData.reduce((acc, item) => acc + item.stats.quizMastered, 0);
  const totalMasteredCards = unitData.reduce((acc, item) => acc + item.stats.cardsMastered, 0);

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: 'Tu avance',
      title: 'Progreso',
      sub: 'Medido en preguntas dominadas, no en tiempo de pantalla. Se guarda en tu teléfono.',
    })}

    <div class="grid grid--2">
      <div class="stat stat--accent">
        <div class="stat__value">🔥 ${state.streak.days || 0}</div>
        <div class="stat__label">Días de racha</div>
      </div>
      <div class="stat">
        <div class="stat__value">${summary.answers}<span class="muted" style="font-size:0.8rem">/${summary.goal}</span></div>
        <div class="stat__label">Respuestas hoy</div>
      </div>
      <div class="stat">
        <div class="stat__value">${accuracy.seen ? `${accuracy.accuracy}%` : '—'}</div>
        <div class="stat__label">Precisión global</div>
      </div>
      <div class="stat">
        <div class="stat__value">${totalMasteredQuiz}<span class="muted" style="font-size:0.8rem">/${ALL_QUIZ.length}</span></div>
        <div class="stat__label">Preguntas dominadas</div>
      </div>
    </div>

    <div class="card">
      <div class="row row--between" style="margin-bottom:10px">
        <h3 style="font-size:0.95rem">Últimos 7 días</h3>
        <span class="tiny muted">meta diaria: ${summary.goal} respuestas</span>
      </div>
      <div class="week-chart">
        ${weekly.map((day) => `<div class="week-col">
          <span class="week-count">${day.answers}</span>
          <div class="week-track"><div class="week-bar ${day.isToday ? 'is-today' : ''}" style="height:${Math.max(4, (day.answers / maxWeek) * 100)}%"></div></div>
          <span class="week-label ${day.isToday ? 'is-today' : ''}">${day.label}</span>
        </div>`).join('')}
      </div>
    </div>

    <section class="section">
      <div class="section__head"><div class="section__title">Por unidad</div></div>
      <div class="stack">
        ${unitData.map(({ unit, stats }) => `
          <div class="card">
            <div class="row" style="gap:14px">
              ${ring(stats.overall, 'dominio', { size: 66 })}
              <div style="flex:1;min-width:0">
                <div class="row row--between">
                  <h3 style="font-size:0.95rem">Unidad ${unit.number}</h3>
                  <span class="badge ${unit.id === 'u6' ? 'badge--accent' : unit.id === 'u8' ? 'badge--warn' : unit.id === 'u9' ? 'badge--ok' : 'badge--violet'}">${unit.tag}</span>
                </div>
                <p class="card__sub">${unit.subtitle}</p>
              </div>
            </div>
            <div class="mini-stats">
              <div><b>${stats.lessonsRead}/${stats.lessonsTotal}</b><span>lecciones</span></div>
              <div><b>${stats.diagramSolved}/${stats.diagramPins}</b><span>puntos de diagrama</span></div>
              <div><b>${stats.quizMastered}/${stats.quizTotal}</b><span>preguntas</span></div>
              <div><b>${stats.cardsMastered}/${stats.cardsTotal}</b><span>tarjetas</span></div>
            </div>
          </div>`).join('')}
      </div>
    </section>

    ${weakTopics.length ? `<section class="section">
      <div class="section__head"><div class="section__title">Temas para reforzar</div><span class="tiny muted">menor precisión</span></div>
      <div class="stack stack--sm">
        ${weakTopics.map((topic) => `<a class="row-card" href="#/practica/quiz?scope=topic&topic=${topic.id}">
          <span class="row-card__num" style="color:var(--rose)">${topic.accuracy}%</span>
          <span class="row-card__main">
            <span class="row-card__title">${esc(topic.label)}</span>
            <span class="row-card__meta">${topic.oks}/${topic.attempts} respuestas correctas · ${topic.answered}/${topic.total} preguntas vistas</span>
          </span>
          <svg class="row-card__chev"><use href="#i-chevron-right"></use></svg>
        </a>`).join('')}
      </div>
    </section>` : ''}

    <section class="section">
      <div class="section__head"><div class="section__title">Precisión por tema</div><span class="tiny muted">${practicedTopics.length}/${topics.length} con datos</span></div>
      ${practicedTopics.length ? `<div class="card">
        ${practicedTopics.map((topic) => {
          const tone = topic.accuracy >= 75 ? 'ok' : topic.accuracy >= 50 ? 'warn' : 'bad';
          return `<div class="topic-row">
            <div>
              <div class="topic-row__name">${esc(topic.label)}</div>
              <div style="margin-top:5px">${bar(topic.accuracy, tone)}</div>
            </div>
            <div class="topic-row__pct">${topic.oks}/${topic.attempts}</div>
          </div>`;
        }).join('')}
      </div>` : `<div class="empty">
        ${icon('chart')}
        <h3>Todavía no hay datos</h3>
        <p>Cuando respondas preguntas, acá vas a ver la precisión de cada tema y detectar los flojos.</p>
        <div style="margin-top:12px"><a class="btn btn--primary btn--sm" href="#/practica/quiz?scope=mix&n=10">Hacer un quiz corto</a></div>
      </div>`}
    </section>

    <section class="section">
      <div class="section__head"><div class="section__title">Cajas de repaso</div><span class="tiny muted">0 = nueva · 6 = madura</span></div>
      <div class="card">
        <div class="box-chart">
          ${boxes.map((count, index) => `<div class="box-col">
            <div class="week-track"><div class="week-bar" style="height:${Math.max(3, (count / Math.max(1, ...boxes)) * 100)}%;background:${index >= 4 ? 'var(--green)' : index >= 2 ? 'var(--accent)' : 'var(--amber)'}"></div></div>
            <span class="week-label">${index}</span>
            <span class="tiny muted">${count}</span>
          </div>`).join('')}
        </div>
        <p class="tiny muted" style="margin-top:8px">${totalMasteredCards} tarjetas y ${totalMasteredQuiz} preguntas ya están en cajas altas (4–6).</p>
      </div>
    </section>

    <section class="section">
      <div class="section__head"><div class="section__title">Logros</div><span class="tiny muted">${badges.filter((badge) => badge.done).length}/${badges.length}</span></div>
      <div class="badge-grid">
        ${badges.map((badge) => `<div class="achievement ${badge.done ? '' : 'is-locked'}">
          ${icon(badge.icon)}
          <div class="achievement__name">${badge.name}</div>
        </div>`).join('')}
      </div>
    </section>

    ${sessions.length ? `<section class="section">
      <div class="section__head"><div class="section__title">Últimas sesiones</div></div>
      <div class="stack stack--sm">
        ${sessions.map((session) => `<div class="row-card">
          <span class="row-card__num">${session.kind === 'quiz' ? icon('target', 'icon--sm') : icon('layers', 'icon--sm')}</span>
          <span class="row-card__main">
            <span class="row-card__title">${KIND_LABEL[session.kind] || 'Sesión'} · ${session.correct}/${session.total}</span>
            <span class="row-card__meta">${new Date(session.at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })} · ${Math.round((session.seconds || 0) / 60)} min</span>
          </span>
          <span class="badge ${session.correct / Math.max(1, session.total) >= 0.8 ? 'badge--ok' : ''}">${percent(session.correct, session.total)}%</span>
        </div>`).join('')}
      </div>
    </section>` : ''}

    <section class="section">
      <div class="section__head"><div class="section__title">Ajustes</div></div>
      <div class="card stack stack--sm">
        <div class="row row--between">
          <div><div class="topic-row__name">Tema</div><div class="tiny muted">Claro u oscuro</div></div>
          <button class="btn btn--sm btn--soft" type="button" data-theme>${icon(state.theme === 'dark' ? 'sun' : 'moon', 'icon--sm')} ${state.theme === 'dark' ? 'Oscuro' : 'Claro'}</button>
        </div>
        <div class="row row--between">
          <div><div class="topic-row__name">Vibración al responder</div><div class="tiny muted">Háptica en el celular</div></div>
          <button class="btn btn--sm ${state.settings.haptics ? 'btn--soft' : 'btn--ghost'}" type="button" data-haptics aria-pressed="${state.settings.haptics}">
            ${state.settings.haptics ? 'Activada' : 'Desactivada'}
          </button>
        </div>
        <div class="row row--between">
          <div><div class="topic-row__name">Meta diaria</div><div class="tiny muted">Respuestas por día</div></div>
          <div class="row" style="gap:4px">
            ${[10, 20, 30].map((goal) => `<button class="chip" type="button" data-goal="${goal}" aria-pressed="${summary.goal === goal}">${goal}</button>`).join('')}
          </div>
        </div>
        <hr class="divider">
        <div class="row" style="gap:8px">
          <button class="btn btn--sm btn--soft" style="flex:1" type="button" data-export>${icon('download', 'icon--sm')} Exportar</button>
          <button class="btn btn--sm btn--soft" style="flex:1" type="button" data-import>${icon('upload', 'icon--sm')} Importar</button>
        </div>
        <button class="btn btn--sm btn--danger" type="button" data-reset>${icon('trash', 'icon--sm')} Borrar todo el progreso</button>
      </div>
    </section>

    <div class="callout callout--info">
      <div class="callout__icon">${icon('info')}</div>
      <div><h4>Guardar en el teléfono</h4><p>En Chrome o Safari, abrí el menú y elegí <b>“Agregar a pantalla de inicio”</b>. La app funciona sin internet después de la primera visita y tu progreso queda guardado en el navegador. Exportá un respaldo de vez en cuando.</p></div>
    </div>

    <p class="tiny muted center">Repaso CDM · Unidades 6, 8 y 9 · Hecho para estudiar en el celular</p>
  `;

  const refresh = () => navigate(`/progreso?r=${Date.now()}`);

  el.querySelector('[data-theme]').addEventListener('click', () => {
    const next = getState().theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    refresh();
  });

  el.querySelector('[data-haptics]').addEventListener('click', () => {
    const next = !getState().settings.haptics;
    setSetting('haptics', next);
    if (next) haptic(14);
    refresh();
  });

  el.querySelectorAll('[data-goal]').forEach((button) => {
    button.addEventListener('click', () => {
      setSetting('dailyGoal', Number(button.dataset.goal));
      toast(`Meta diaria: ${button.dataset.goal} respuestas`, 'ok');
      refresh();
    });
  });

  el.querySelector('[data-export]').addEventListener('click', () => {
    downloadText(`cdm-repaso-${new Date().toISOString().slice(0, 10)}.json`, exportSnapshot());
    toast('Respaldo descargado', 'ok');
  });

  el.querySelector('[data-import]').addEventListener('click', () => {
    openSheet({
      title: 'Importar respaldo',
      subtitle: 'Pegá el contenido del archivo JSON',
      body: `<textarea class="input" style="min-height:140px;padding:10px;font-family:var(--mono);font-size:0.75rem" data-import-text placeholder='{"quiz": ...}'></textarea>
        <p class="tiny muted" style="margin-top:6px">Se reemplaza el progreso actual.</p>`,
      actions: [
        { label: 'Cancelar', className: 'btn--ghost' },
        {
          label: 'Restaurar',
          className: 'btn--primary',
          onClick: (overlay) => {
            const text = overlay.querySelector('[data-import-text]').value;
            try {
              importSnapshot(text);
              toast('Respaldo restaurado', 'ok');
              refresh();
            } catch (error) {
              toast('No se pudo importar: revisá el JSON', 'bad');
              return false;
            }
            return true;
          },
        },
      ],
    });
  });

  el.querySelector('[data-reset]').addEventListener('click', () => {
    confirmSheet({
      title: 'Borrar todo el progreso',
      message: 'Se pierden lecciones leídas, respuestas, tarjetas, racha y diagramas. Esta acción no se puede deshacer.',
      confirmLabel: 'Borrar todo',
      danger: true,
      onConfirm: () => {
        resetProgress();
        toast('Progreso borrado');
        refresh();
      },
    });
  });

  return { el, title: 'Progreso', sub: 'Tu avance', nav: 'progreso', back: null };
}
