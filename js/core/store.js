/* ============================================================
   store.js — estado persistente (localStorage) y acciones
   ============================================================ */

import { dayKey, daysBetweenKeys, percent } from './utils.js';
import { gradeEntry, isDue } from './srs.js';

const STORAGE_KEY = 'cdm-repaso-v2';
const MAX_SESSIONS = 40;
const MAX_DAYS = 70;

const listeners = new Set();

function defaultState() {
  return {
    version: 2,
    createdAt: Date.now(),
    theme: 'dark',
    streak: { days: 0, last: null },
    lessons: {},
    diagrams: {},
    quiz: {},
    cards: {},
    daily: {},
    sessions: [],
    settings: { haptics: true, dailyGoal: 20 },
    lastRoute: '/inicio',
    lastLesson: null,
    stats: { quizAnswers: 0, cardsReviewed: 0, lessonsRead: 0 },
  };
}

function loadState() {
  const base = defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== 'object') return base;
    return {
      ...base,
      ...saved,
      streak: { ...base.streak, ...(saved.streak || {}) },
      settings: { ...base.settings, ...(saved.settings || {}) },
      stats: { ...base.stats, ...(saved.stats || {}) },
      lessons: saved.lessons || {},
      diagrams: saved.diagrams || {},
      quiz: saved.quiz || {},
      cards: saved.cards || {},
      daily: saved.daily || {},
      sessions: Array.isArray(saved.sessions) ? saved.sessions : [],
    };
  } catch (err) {
    console.warn('No se pudo leer el progreso guardado:', err);
    return base;
  }
}

let state = loadState();

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  listeners.forEach((fn) => {
    try { fn(state); } catch (err) { console.warn(err); }
  });
}

export function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('No se pudo guardar el progreso:', err);
  }
  emit();
}

export function update(mutator) {
  mutator(state);
  save();
}

/* ---------------- tema ---------------- */

export function setTheme(theme) {
  state.theme = theme === 'light' ? 'light' : 'dark';
  save();
}

/* ---------------- racha y actividad ---------------- */

export function touchActivity() {
  const today = dayKey();
  const { streak } = state;
  if (streak.last === today) return;
  const gap = streak.last ? daysBetweenKeys(streak.last, today) : Infinity;
  streak.days = gap === 1 ? (streak.days || 0) + 1 : 1;
  streak.last = today;
  state.daily[today] = state.daily[today] || { answers: 0, correct: 0, lessons: 0, diagrams: 0 };
}

export function studiedToday() {
  return state.streak.last === dayKey();
}

function pruneDaily() {
  const keys = Object.keys(state.daily).sort();
  if (keys.length <= MAX_DAYS) return;
  keys.slice(0, keys.length - MAX_DAYS).forEach((key) => delete state.daily[key]);
}

function logAnswer(ok) {
  const today = dayKey();
  const day = state.daily[today] || (state.daily[today] = { answers: 0, correct: 0, lessons: 0, diagrams: 0 });
  day.answers += 1;
  if (ok) day.correct += 1;
  pruneDaily();
}

export function dailySummary() {
  const day = state.daily[dayKey()] || { answers: 0, correct: 0 };
  return {
    answers: day.answers || 0,
    correct: day.correct || 0,
    goal: state.settings.dailyGoal || 20,
    accuracy: percent(day.correct || 0, day.answers || 0),
  };
}

export function weeklyActivity() {
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = dayKey(date);
    const day = state.daily[key] || { answers: 0, correct: 0 };
    out.push({
      key,
      label: ['D', 'L', 'M', 'M', 'J', 'V', 'S'][date.getDay()],
      answers: day.answers || 0,
      correct: day.correct || 0,
      isToday: i === 0,
    });
  }
  return out;
}

/* ---------------- teoría ---------------- */

export function markLessonRead(id) {
  if (state.lessons[id] && state.lessons[id].read) return;
  state.lessons[id] = { read: true, at: Date.now() };
  state.stats.lessonsRead += 1;
  state.lastLesson = id;
  state.daily[dayKey()] = state.daily[dayKey()] || { answers: 0, correct: 0, lessons: 0, diagrams: 0 };
  state.daily[dayKey()].lessons += 1;
  touchActivity();
  save();
}

export function lessonRead(id) {
  return !!(state.lessons[id] && state.lessons[id].read);
}

export function lessonsReadCount(ids) {
  return ids.filter(lessonRead).length;
}

/* ---------------- diagramas ---------------- */

export function markDiagramPin(id, pinNum) {
  const entry = state.diagrams[id] || (state.diagrams[id] = { solved: [], at: 0 });
  if (!entry.solved.includes(pinNum)) {
    entry.solved.push(pinNum);
    entry.at = Date.now();
  }
  state.daily[dayKey()] = state.daily[dayKey()] || { answers: 0, correct: 0, lessons: 0, diagrams: 0 };
  state.daily[dayKey()].diagrams = (state.daily[dayKey()].diagrams || 0) + 1;
  touchActivity();
  save();
}

export function diagramSolvedPins(id) {
  return (state.diagrams[id] && state.diagrams[id].solved) || [];
}

export function diagramCompleted(id, total) {
  return total > 0 && diagramSolvedPins(id).length >= total;
}

export function resetDiagram(id) {
  delete state.diagrams[id];
  save();
}

/* ---------------- quiz / tarjetas ---------------- */

export function quizEntry(id) {
  return state.quiz[id];
}

export function cardEntry(id) {
  return state.cards[id];
}

export function recordQuizResult(id, ok, unit) {
  state.quiz[id] = gradeEntry(state.quiz[id], ok);
  state.stats.quizAnswers += 1;
  logAnswer(ok);
  touchActivity();
  save();
  return state.quiz[id];
}

export function recordCardResult(id, ok, unit) {
  state.cards[id] = gradeEntry(state.cards[id], ok);
  state.stats.cardsReviewed += 1;
  logAnswer(ok);
  touchActivity();
  save();
  return state.cards[id];
}

/* ---------------- sesiones ---------------- */

export function recordSession(session) {
  state.sessions.unshift({ at: Date.now(), ...session });
  state.sessions = state.sessions.slice(0, MAX_SESSIONS);
  save();
}

export function recentSessions(limit = 5) {
  return state.sessions.slice(0, limit);
}

/* ---------------- resumen ---------------- */

export function dueSummary(quizIds, cardIds) {
  const quizDue = quizIds.filter((id) => isDue(state.quiz[id])).length;
  const cardDue = cardIds.filter((id) => isDue(state.cards[id])).length;
  return { quizDue, cardDue, total: quizDue + cardDue };
}

export function setRoute(path) {
  state.lastRoute = path;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) { /* silencioso */ }
}

/* ---------------- respaldo / reinicio ---------------- */

export function exportSnapshot() {
  return JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2);
}

export function importSnapshot(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || !parsed.quiz) {
    throw new Error('El respaldo no tiene el formato esperado.');
  }
  const theme = state.theme;
  state = { ...defaultState(), ...parsed, theme };
  save();
}

export function resetProgress() {
  const theme = state.theme;
  state = defaultState();
  state.theme = theme;
  save();
}

export function setSetting(key, value) {
  state.settings[key] = value;
  save();
}
