/* ============================================================
   sessions.js — construcción de sesiones de quiz y tarjetas
   ============================================================ */

import { ALL_QUIZ, ALL_CARDS, getTopic } from '../data/index.js';
import { getState } from './store.js';
import { isDue, sortByPriority } from './srs.js';
import { shuffle } from './utils.js';

export const SCOPE_LABELS = {
  mix: 'Repaso mixto',
  u6: 'Unidad 6',
  u8: 'Unidad 8',
  u9: 'Unidad 9',
  u10: 'Unidad 10',
  due: 'Pendientes de hoy',
  weak: 'Puntos débiles',
  new: 'Preguntas nuevas',
  exam: 'Examen rápido',
  topic: 'Tema',
  calc: 'Cálculos',
};

export function scopeLabel(scope, topic) {
  if (scope === 'topic') return topic ? getTopic(topic).label : 'Tema';
  return SCOPE_LABELS[scope] || 'Práctica';
}

function unitFiltered(items, scope) {
  if (['u6', 'u8', 'u9', 'u10'].includes(scope)) return items.filter((item) => item.unit === scope);
  return items;
}

export function quizDueCount(scope = 'mix', topic = '') {
  const state = getState();
  return baseQuizPool(scope, topic).filter((item) => isDue(state.quiz[item.id])).length;
}

export function cardsDueCount(unit = 'mix') {
  const state = getState();
  return baseCardsPool(unit).filter((item) => isDue(state.cards[item.id])).length;
}

function baseQuizPool(scope, topic) {
  let pool = ALL_QUIZ;
  if (scope === 'calc') pool = pool.filter((question) => question.type === 'num');
  if (topic) pool = pool.filter((question) => question.topic === topic);
  if (scope === 'topic' || scope === 'calc') return pool;
  return unitFiltered(pool, scope);
}

function baseCardsPool(scope) {
  return unitFiltered(ALL_CARDS, scope);
}

/**
 * Arma una sesión de preguntas según el alcance pedido.
 * Para 'mix' prioriza vencidas y débiles, y completa con el resto.
 */
export function buildQuizSession({ scope = 'mix', topic = '', n = 10 } = {}) {
  const state = getState();
  const pool = baseQuizPool(scope, topic);
  const byId = new Map(pool.map((question) => [question.id, question]));
  const take = (ids) => ids.map((id) => byId.get(id)).filter(Boolean).slice(0, n);

  let ordered = [];

  if (scope === 'due') {
    ordered = take(sortByPriority(state.quiz, pool.map((q) => q.id)).filter((id) => isDue(state.quiz[id])));
  } else if (scope === 'weak') {
    ordered = take(sortByPriority(state.quiz, pool.filter((q) => state.quiz[q.id] && state.quiz[q.id].lastOk === false).map((q) => q.id)));
  } else if (scope === 'new') {
    ordered = take(shuffle(pool.filter((q) => !state.quiz[q.id]).map((q) => q.id)));
  } else if (scope === 'exam') {
    ordered = take(shuffle(pool.map((q) => q.id)));
  } else {
    const due = sortByPriority(state.quiz, pool.filter((q) => isDue(state.quiz[q.id])).map((q) => q.id));
    const weak = sortByPriority(state.quiz, pool.filter((q) => state.quiz[q.id] && state.quiz[q.id].lastOk === false && !due.includes(q.id)).map((q) => q.id));
    const rest = shuffle(pool.filter((q) => !due.includes(q.id) && !weak.includes(q.id)).map((q) => q.id));
    ordered = take([...due, ...weak, ...rest]);
  }

  if (!['due', 'weak', 'new'].includes(scope) && ordered.length < Math.min(n, pool.length)) {
    const used = new Set(ordered.map((q) => q.id));
    ordered = [...ordered, ...take(shuffle(pool.filter((q) => !used.has(q.id)).map((q) => q.id)))];
  }

  return ordered;
}

export function buildCardSession({ scope = 'mix', n = 20 } = {}) {
  const state = getState();
  const pool = baseCardsPool(scope);
  const byId = new Map(pool.map((card) => [card.id, card]));
  const due = sortByPriority(state.cards, pool.filter((card) => isDue(state.cards[card.id])).map((card) => card.id));

  if (scope === 'due') {
    return due.map((id) => byId.get(id)).filter(Boolean).slice(0, n);
  }

  const fresh = shuffle(pool.filter((card) => !state.cards[card.id]).map((card) => card.id));
  const rest = shuffle(pool.filter((card) => state.cards[card.id]).map((card) => card.id));
  const ids = [...due, ...fresh, ...rest].filter((id, index, array) => array.indexOf(id) === index).slice(0, n);
  return ids.map((id) => byId.get(id)).filter(Boolean);
}

export function quizCountForTopic(topic) {
  return ALL_QUIZ.filter((question) => question.topic === topic).length;
}

export function newQuizCount() {
  const state = getState();
  return ALL_QUIZ.filter((question) => !state.quiz[question.id]).length;
}

export function masteredQuizCount(unitId) {
  const state = getState();
  const pool = unitId ? ALL_QUIZ.filter((question) => question.unit === unitId) : ALL_QUIZ;
  return pool.filter((question) => (state.quiz[question.id]?.box || 0) >= 4).length;
}
