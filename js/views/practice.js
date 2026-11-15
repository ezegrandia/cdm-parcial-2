/* ============================================================
   views/practice.js — hub de práctica
   ============================================================ */

import { ALL_QUIZ, ALL_CARDS, ALL_FORMULAS } from '../data/index.js';
import { quizDueCount, cardsDueCount, newQuizCount } from '../core/sessions.js';
import { getState, dailySummary } from '../core/store.js';
import { icon, ring, statTile } from '../core/ui.js';
import { percent } from '../core/utils.js';
import { pageHead } from './partials.js';

function accuracyStats() {
  const state = getState();
  const entries = Object.values(state.quiz);
  const attempts = entries.reduce((acc, entry) => acc + (entry.seen || 0), 0);
  const oks = entries.reduce((acc, entry) => acc + (entry.ok || 0), 0);
  return { attempts, oks, accuracy: percent(oks, attempts) };
}

export function practiceView() {
  const state = getState();
  const summary = dailySummary();
  const dueQuiz = quizDueCount('mix');
  const dueCards = cardsDueCount('mix');
  const newCount = newQuizCount();
  const weak = ALL_QUIZ.filter((question) => state.quiz[question.id]?.lastOk === false).length;
  const { attempts, accuracy } = accuracyStats();
  const masteredCards = ALL_CARDS.filter((card) => (state.cards[card.id]?.box || 0) >= 4).length;

  const modes = [
    { href: '#/practica/quiz?scope=mix&n=10', icon: 'play', title: 'Quiz rápido', meta: '10 preguntas mixtas · prioriza lo que tenés pendiente', badge: `${dueQuiz} pendientes` },
    { href: '#/practica/quiz?scope=exam&n=20', icon: 'trophy', title: 'Examen rápido', meta: '20 preguntas al azar de las tres unidades', badge: '20' },
    { href: '#/practica/quiz?scope=u6&n=12', icon: 'flask', title: 'Práctica Unidad 6', meta: 'Ensayos, impacto, dureza y fatiga', badge: `${ALL_QUIZ.filter((q) => q.unit === 'u6').length}` },
    { href: '#/practica/quiz?scope=u8&n=12', icon: 'layers', title: 'Práctica Unidad 8', meta: 'Nucleación, grano y Chvorinov', badge: `${ALL_QUIZ.filter((q) => q.unit === 'u8').length}` },
    { href: '#/practica/quiz?scope=u9&n=12', icon: 'layers', title: 'Práctica Unidad 9', meta: 'Fases, solubilidad, diagrama isomorfo y palanca', badge: `${ALL_QUIZ.filter((q) => q.unit === 'u9').length}` },
    { href: '#/practica/quiz?scope=weak&n=10', icon: 'target', title: 'Puntos débiles', meta: 'Sólo preguntas en las que fallaste la última vez', badge: `${weak}` },
    { href: '#/practica/quiz?scope=calc&n=8', icon: 'calculator', title: 'Cálculos numéricos', meta: 'Chvorinov, formas y palanca', badge: `${ALL_QUIZ.filter((q) => q.type === 'num').length}` },
    { href: '#/practica/quiz?scope=new&n=10', icon: 'sparkles', title: 'Preguntas nuevas', meta: 'Todavía no las respondiste', badge: `${newCount}` },
    { href: '#/practica/tarjetas?scope=mix&n=20', icon: 'layers', title: 'Tarjetas', meta: 'Memorizá definiciones y fórmulas con autoevaluación', badge: `${dueCards} para hoy` },
    { href: '#/practica/simuladores', icon: 'calculator', title: 'Simuladores', meta: 'Chvorinov, formas y regla de la palanca', badge: '2' },
    { href: '#/teoria/formulas', icon: 'book', title: 'Hoja de fórmulas', meta: 'Repaso rápido con fórmulas tapadas', badge: `${ALL_FORMULAS.length}` },
  ];

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: 'Entrenamiento',
      title: 'Práctica',
      sub: 'La repetición espaciada te vuelve a traer lo que fallás. Constancia > sesiones largas.',
    })}

    <div class="card" style="background:var(--hero-bg)">
      <div class="row row--between">
        <div>
          <h3 style="font-size:1.02rem">Repaso de hoy</h3>
          <p class="card__sub">${dueQuiz + dueCards > 0 ? `Tenés ${dueQuiz} preguntas y ${dueCards} tarjetas para repasar.` : 'Estás al día. Un repaso libre siempre suma.'}</p>
        </div>
        ${ring(percent(summary.answers, summary.goal), 'meta', { size: 54 })}
      </div>
      <div class="grid grid--2" style="margin-top:12px">
        ${statTile(dueQuiz, 'Preguntas pendientes', { accent: true })}
        ${statTile(dueCards, 'Tarjetas pendientes')}
      </div>
      <div class="stack stack--sm" style="margin-top:12px">
        <a class="btn btn--primary btn--block" href="#/practica/quiz?scope=due&n=10">${icon('play')} Empezar repaso de preguntas</a>
        <a class="btn btn--soft btn--block" href="#/practica/tarjetas?scope=due&n=20">${icon('layers')} Repasar tarjetas vencidas</a>
      </div>
    </div>

    <div class="grid grid--3">
      ${statTile(attempts, 'Respuestas')}
      ${statTile(`${accuracy}%`, 'Precisión')}
      ${statTile(masteredCards, 'Tarjetas dominadas')}
    </div>

    <section class="section">
      <div class="section__head"><div class="section__title">Elegí un modo</div></div>
      <div class="stack stack--sm">
        ${modes.map((mode) => `<a class="row-card" href="${mode.href}">
          <span class="row-card__num">${icon(mode.icon, 'icon--sm')}</span>
          <span class="row-card__main">
            <span class="row-card__title">${mode.title}</span>
            <span class="row-card__meta">${mode.meta}</span>
          </span>
          <span class="badge">${mode.badge}</span>
        </a>`).join('')}
      </div>
    </section>

    <div class="note">La estrategia que elegiste funciona: sesiones cortas, muchas veces. Cada respuesta actualiza tu caja de repaso y la pregunta vuelve a aparecer en 1, 2, 4, 8, 16 o 32 días.</div>
  `;

  return { el, title: 'Práctica', sub: 'Quiz y tarjetas', nav: 'practica', back: null };
}
