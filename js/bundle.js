/* CDM Repaso — bundle generado automáticamente por tools/build-bundle.mjs.
   No editar a mano: cambiá los módulos de js/ y volvé a ejecutar el script.
   Sirve para abrir index.html directamente (file://), donde los módulos ES no cargan. */
var __CDM_MODULES__ = Object.create(null);

/* ===== core/router.js ===== */
(function () {
  "use strict";
/* ============================================================
   router.js — enrutador por hash, sin dependencias
   ============================================================ */

const routes = [];

/**
 * Registra una ruta con parámetros estilo /teoria/leccion/:id
 */
function addRoute(pattern, view) {
  const keys = [];
  const rx = new RegExp(`^${pattern.replace(/:([A-Za-z0-9_]+)/g, (_, key) => {
    keys.push(key);
    return '([^/]+)';
  })}$`);
  routes.push({ rx, keys, view });
}

function resolve(path) {
  for (const route of routes) {
    const match = path.match(route.rx);
    if (match) {
      const params = {};
      route.keys.forEach((key, i) => { params[key] = decodeURIComponent(match[i + 1]); });
      return { view: route.view, params };
    }
  }
  return null;
}

function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/inicio';
  const [pathPart, queryPart] = raw.split('?');
  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  const query = {};
  if (queryPart) {
    new URLSearchParams(queryPart).forEach((value, key) => { query[key] = value; });
  }
  return { path: path.replace(/\/+$/, '') || '/inicio', query };
}

function navigate(path, { replace = false } = {}) {
  const target = `#${path.startsWith('/') ? path : `/${path}`}`;
  if (replace) {
    window.location.replace(target);
  } else if (window.location.hash === target) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = target;
  }
}

function startRouter(render) {
  window.addEventListener('hashchange', render);
  render();
}

function currentPath() {
  return parseHash().path;
}

  __CDM_MODULES__["core/router.js"] = { addRoute, resolve, parseHash, navigate, startRouter, currentPath };
})();

/* ===== core/utils.js ===== */
(function () {
  "use strict";
/* ============================================================
   utils.js — utilidades puras compartidas por toda la app
   ============================================================ */

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sample(list, n) {
  return shuffle(list).slice(0, Math.max(0, n));
}

function uniq(list) {
  return [...new Set(list)];
}

function groupBy(list, keyFn) {
  return list.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] = acc[key] || []).push(item);
    return acc;
  }, {});
}

function percent(part, total) {
  if (!total) return 0;
  return clamp(Math.round((part / total) * 100), 0, 100);
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

/** Clave local de día: YYYY-MM-DD (hora del dispositivo). */
function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function addDaysToKey(key, days) {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return dayKey(date);
}

function daysBetweenKeys(a, b) {
  if (!a || !b) return Infinity;
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const da = Date.UTC(ay, am - 1, ad);
  const db = Date.UTC(by, bm - 1, bd);
  return Math.round((db - da) / 86400000);
}

/** Convierte "1.570,8", "1570.8" o "12,5" a número. */
function parseNumber(raw) {
  if (typeof raw === 'number') return raw;
  let s = String(raw == null ? '' : raw).trim().replace(/\s/g, '').replace(/[^\d,.\-+eE]/g, '');
  if (!s) return NaN;
  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  if (lastComma > -1 && lastDot > -1) {
    if (lastComma > lastDot) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
  } else if (lastComma > -1) {
    s = s.replace(/,/g, '.');
  }
  return Number(s);
}

function formatNumber(value, decimals = 2) {
  if (!Number.isFinite(value)) return '—';
  const abs = Math.abs(value);
  const d = abs >= 1000 ? Math.min(decimals, 1) : decimals;
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: d,
    useGrouping: true,
  });
}

function formatPercent(value) {
  return `${Math.round(value)}%`;
}

function truncate(text, max) {
  const s = String(text || '');
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function plural(n, singular, pluralWord) {
  return n === 1 ? singular : (pluralWord || `${singular}s`);
}

function minutesLabel(min) {
  return `${min} min`;
}

function sum(list, fn = (x) => x) {
  return list.reduce((acc, item) => acc + (fn(item) || 0), 0);
}

function countWords(html) {
  return String(html || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
}

function downloadText(filename, text, type = 'application/json') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

  __CDM_MODULES__["core/utils.js"] = { esc, clamp, shuffle, sample, uniq, groupBy, percent, pad2, dayKey, addDaysToKey, daysBetweenKeys, parseNumber, formatNumber, formatPercent, truncate, uid, plural, minutesLabel, sum, countWords, downloadText };
})();

/* ===== core/srs.js ===== */
(function () {
  "use strict";
/* ============================================================
   srs.js — repetición espaciada simple (cajas de Leitner)
   ============================================================ */

const { addDaysToKey, dayKey } = __CDM_MODULES__["core/utils.js"];

const BOX_INTERVALS = [0, 1, 2, 4, 8, 16, 32];
const MAX_BOX = BOX_INTERVALS.length - 1;

/**
 * Calcula la nueva entrada de seguimiento después de responder.
 * Acierto → sube una caja; error → vuelve a la caja 0 (repaso inmediato).
 */
function gradeEntry(previous, ok) {
  const prev = previous || {};
  const box = ok ? Math.min((prev.box ?? 0) + 1, MAX_BOX) : 0;
  return {
    ...prev,
    box,
    due: addDaysToKey(dayKey(), BOX_INTERVALS[box]),
    seen: (prev.seen || 0) + 1,
    ok: (prev.ok || 0) + (ok ? 1 : 0),
    last: Date.now(),
    lastOk: !!ok,
  };
}

function isDue(entry) {
  if (!entry) return true;
  if (!entry.due) return true;
  return entry.due <= dayKey();
}

function isMastered(entry) {
  return !!entry && (entry.box || 0) >= 4;
}

/** 0..1 según la caja alcanzada. */
function masteryOf(entry) {
  if (!entry) return 0;
  return Math.min(1, (entry.box || 0) / MAX_BOX);
}

function dueCount(map) {
  return Object.values(map || {}).filter(isDue).length;
}

function dueIds(map, allIds) {
  return allIds.filter((id) => isDue(map[id]));
}

function weakIds(map, allIds) {
  return allIds.filter((id) => {
    const e = map[id];
    return e && e.seen >= 1 && !e.lastOk;
  });
}

function unseenIds(map, allIds) {
  return allIds.filter((id) => !map[id]);
}

/** Ordena primero lo más vencido y con caja más baja; las nuevas van al final. */
function sortByPriority(map, ids) {
  return [...ids].sort((a, b) => {
    const ea = map[a] || {};
    const eb = map[b] || {};
    const da = ea.due || '9999-12-31';
    const db = eb.due || '9999-12-31';
    if (da !== db) return da < db ? -1 : 1;
    return (ea.box || 0) - (eb.box || 0);
  });
}

/** Texto corto para la próxima revisión. */
function dueLabel(entry) {
  if (!entry) return 'Nueva';
  if (!entry.due) return 'Nueva';
  if (entry.due <= dayKey()) return 'Para hoy';
  return `En ${Math.round((new Date(entry.due) - new Date(dayKey())) / 86400000)} d`;
}

  __CDM_MODULES__["core/srs.js"] = { gradeEntry, isDue, isMastered, masteryOf, dueCount, dueIds, weakIds, unseenIds, sortByPriority, dueLabel, BOX_INTERVALS, MAX_BOX };
})();

/* ===== core/store.js ===== */
(function () {
  "use strict";
/* ============================================================
   store.js — estado persistente (localStorage) y acciones
   ============================================================ */

const { dayKey, daysBetweenKeys, percent } = __CDM_MODULES__["core/utils.js"];
const { gradeEntry, isDue } = __CDM_MODULES__["core/srs.js"];

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

function getState() {
  return state;
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  listeners.forEach((fn) => {
    try { fn(state); } catch (err) { console.warn(err); }
  });
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('No se pudo guardar el progreso:', err);
  }
  emit();
}

function update(mutator) {
  mutator(state);
  save();
}

/* ---------------- tema ---------------- */

function setTheme(theme) {
  state.theme = theme === 'light' ? 'light' : 'dark';
  save();
}

/* ---------------- racha y actividad ---------------- */

function touchActivity() {
  const today = dayKey();
  const { streak } = state;
  if (streak.last === today) return;
  const gap = streak.last ? daysBetweenKeys(streak.last, today) : Infinity;
  streak.days = gap === 1 ? (streak.days || 0) + 1 : 1;
  streak.last = today;
  state.daily[today] = state.daily[today] || { answers: 0, correct: 0, lessons: 0, diagrams: 0 };
}

function studiedToday() {
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

function dailySummary() {
  const day = state.daily[dayKey()] || { answers: 0, correct: 0 };
  return {
    answers: day.answers || 0,
    correct: day.correct || 0,
    goal: state.settings.dailyGoal || 20,
    accuracy: percent(day.correct || 0, day.answers || 0),
  };
}

function weeklyActivity() {
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

function markLessonRead(id) {
  if (state.lessons[id] && state.lessons[id].read) return;
  state.lessons[id] = { read: true, at: Date.now() };
  state.stats.lessonsRead += 1;
  state.lastLesson = id;
  state.daily[dayKey()] = state.daily[dayKey()] || { answers: 0, correct: 0, lessons: 0, diagrams: 0 };
  state.daily[dayKey()].lessons += 1;
  touchActivity();
  save();
}

function lessonRead(id) {
  return !!(state.lessons[id] && state.lessons[id].read);
}

function lessonsReadCount(ids) {
  return ids.filter(lessonRead).length;
}

/* ---------------- diagramas ---------------- */

function markDiagramPin(id, pinNum) {
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

function diagramSolvedPins(id) {
  return (state.diagrams[id] && state.diagrams[id].solved) || [];
}

function diagramCompleted(id, total) {
  return total > 0 && diagramSolvedPins(id).length >= total;
}

function resetDiagram(id) {
  delete state.diagrams[id];
  save();
}

/* ---------------- quiz / tarjetas ---------------- */

function quizEntry(id) {
  return state.quiz[id];
}

function cardEntry(id) {
  return state.cards[id];
}

function recordQuizResult(id, ok, unit) {
  state.quiz[id] = gradeEntry(state.quiz[id], ok);
  state.stats.quizAnswers += 1;
  logAnswer(ok);
  touchActivity();
  save();
  return state.quiz[id];
}

function recordCardResult(id, ok, unit) {
  state.cards[id] = gradeEntry(state.cards[id], ok);
  state.stats.cardsReviewed += 1;
  logAnswer(ok);
  touchActivity();
  save();
  return state.cards[id];
}

/* ---------------- sesiones ---------------- */

function recordSession(session) {
  state.sessions.unshift({ at: Date.now(), ...session });
  state.sessions = state.sessions.slice(0, MAX_SESSIONS);
  save();
}

function recentSessions(limit = 5) {
  return state.sessions.slice(0, limit);
}

/* ---------------- resumen ---------------- */

function dueSummary(quizIds, cardIds) {
  const quizDue = quizIds.filter((id) => isDue(state.quiz[id])).length;
  const cardDue = cardIds.filter((id) => isDue(state.cards[id])).length;
  return { quizDue, cardDue, total: quizDue + cardDue };
}

function setRoute(path) {
  state.lastRoute = path;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) { /* silencioso */ }
}

/* ---------------- respaldo / reinicio ---------------- */

function exportSnapshot() {
  return JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2);
}

function importSnapshot(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || !parsed.quiz) {
    throw new Error('El respaldo no tiene el formato esperado.');
  }
  const theme = state.theme;
  state = { ...defaultState(), ...parsed, theme };
  save();
}

function resetProgress() {
  const theme = state.theme;
  state = defaultState();
  state.theme = theme;
  save();
}

function setSetting(key, value) {
  state.settings[key] = value;
  save();
}

  __CDM_MODULES__["core/store.js"] = { getState, subscribe, save, update, setTheme, touchActivity, studiedToday, dailySummary, weeklyActivity, markLessonRead, lessonRead, lessonsReadCount, markDiagramPin, diagramSolvedPins, diagramCompleted, resetDiagram, quizEntry, cardEntry, recordQuizResult, recordCardResult, recordSession, recentSessions, dueSummary, setRoute, exportSnapshot, importSnapshot, resetProgress, setSetting };
})();

/* ===== core/ui.js ===== */
(function () {
  "use strict";
/* ============================================================
   ui.js — helpers de interfaz: íconos, anillos, toast y hojas
   ============================================================ */

const { esc, percent } = __CDM_MODULES__["core/utils.js"];
const { getState } = __CDM_MODULES__["core/store.js"];

function icon(name, cls = '') {
  return `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
}

function h(html) {
  const template = document.createElement('template');
  template.innerHTML = String(html).trim();
  return template.content.firstElementChild;
}

function ring(pct, label = '', opts = {}) {
  const size = opts.size || 74;
  const r = 18;
  const c = 2 * Math.PI * r;
  const value = Math.max(0, Math.min(100, pct || 0));
  const dash = (value / 100) * c;
  const strokeColor = opts.color || '';
  return `
    <div class="ring-wrap" style="width:${size}px;height:${size}px">
      <svg class="ring" viewBox="0 0 44 44" aria-hidden="true">
        <circle class="ring__track" cx="22" cy="22" r="${r}" stroke-width="4"></circle>
        <circle class="ring__value" cx="22" cy="22" r="${r}" stroke-width="4"
          stroke-dasharray="${dash.toFixed(2)} ${c.toFixed(2)}"
          ${strokeColor ? `style="stroke:${strokeColor}"` : ''}></circle>
      </svg>
      <div class="ring-wrap__inner">
        <div class="ring-wrap__pct">${Math.round(value)}%</div>
        ${label ? `<div class="ring-wrap__cap">${esc(label)}</div>` : ''}
      </div>
    </div>`;
}

function bar(pct, variant = '') {
  return `<div class="bar"><div class="bar__fill ${variant ? `bar__fill--${variant}` : ''}" style="width:${Math.max(0, Math.min(100, pct))}%"></div></div>`;
}

function statTile(value, label, opts = {}) {
  return `<div class="stat ${opts.accent ? 'stat--accent' : ''}">
    <div class="stat__value">${value}</div>
    <div class="stat__label">${esc(label)}</div>
  </div>`;
}

function emptyState({ iconName = 'info', title, text = '', action = '' }) {
  return `<div class="empty">
    ${icon(iconName)}
    <h3>${esc(title)}</h3>
    ${text ? `<p>${text}</p>` : ''}
    ${action ? `<div style="margin-top:12px">${action}</div>` : ''}
  </div>`;
}

/* ---------------- toast ---------------- */

let toastTimer = null;

function toast(message, tone = '', ms = 2300) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.className = `toast ${tone ? `toast--${tone}` : ''}`;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, ms);
}

/* ---------------- hoja inferior ---------------- */

let activeSheet = null;

function closeSheet() {
  if (!activeSheet) return;
  const { overlay, previousOverflow } = activeSheet;
  overlay.remove();
  document.body.style.overflow = previousOverflow;
  document.removeEventListener('keydown', activeSheet.onKey);
  if (activeSheet.onClose) activeSheet.onClose();
  activeSheet = null;
}

function openSheet({ title, subtitle = '', body = '', actions = [], onClose = null, dismissible = true }) {
  closeSheet();

  const overlay = h(`<div class="sheet-overlay">
    <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <div class="sheet__handle"></div>
      <div class="sheet__head">
        <div>
          <div class="sheet__title">${title}</div>
          ${subtitle ? `<div class="sheet__sub">${subtitle}</div>` : ''}
        </div>
        <button class="icon-btn" type="button" data-sheet-close aria-label="Cerrar">${icon('x')}</button>
      </div>
      <div class="sheet__body">${body}</div>
      ${actions.length ? `<div class="sheet__actions">${actions.map((a, i) => `<button class="btn ${a.className || 'btn--soft'}" type="button" data-sheet-action="${i}">${a.label}</button>`).join('')}</div>` : ''}
    </div>
  </div>`);

  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  const onKey = (event) => {
    if (event.key === 'Escape' && dismissible) closeSheet();
  };

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay && dismissible) closeSheet();
  });

  overlay.querySelector('[data-sheet-close]').addEventListener('click', () => {
    if (!dismissible) return;
    closeSheet();
  });

  actions.forEach((action, i) => {
    const btn = overlay.querySelector(`[data-sheet-action="${i}"]`);
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (action.onClick) {
        const keepOpen = action.onClick(overlay) === false;
        if (keepOpen) return;
      }
      if (action.close !== false) closeSheet();
    });
  });

  document.getElementById('sheetRoot').appendChild(overlay);
  document.addEventListener('keydown', onKey);
  activeSheet = { overlay, onKey, onClose, previousOverflow };

  const sheetEl = overlay.querySelector('.sheet');
  if (sheetEl) {
    sheetEl.setAttribute('tabindex', '-1');
    sheetEl.focus({ preventScroll: true });
  }

  return { overlay, close: closeSheet };
}

/* ---------------- háptica ---------------- */

function haptic(pattern = 12) {
  try {
    const state = getState();
    if (!state.settings.haptics) return;
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (err) { /* sin soporte */ }
}

/* ---------------- modo foco y scroll ---------------- */

function setFocusMode(on) {
  document.body.classList.toggle('is-focus', !!on);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function confirmSheet({ title, message, confirmLabel = 'Confirmar', danger = false, onConfirm }) {
  openSheet({
    title,
    body: `<p>${message}</p>`,
    actions: [
      { label: 'Cancelar', className: 'btn--ghost' },
      {
        label: confirmLabel,
        className: danger ? 'btn--danger' : 'btn--primary',
        onClick: () => { onConfirm(); },
      },
    ],
  });
}

function accuracyTone(pct) {
  if (pct >= 80) return 'ok';
  if (pct >= 55) return 'warn';
  return 'bad';
}

function applyTheme(theme) {
  const value = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = value;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', value === 'dark' ? '#070b13' : '#f2f5fb');
  const btn = document.getElementById('btnTheme');
  if (btn) {
    btn.innerHTML = icon(value === 'dark' ? 'sun' : 'moon');
    btn.setAttribute('aria-label', value === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
  }
}

function scoreMessage(accuracy, total) {
  if (!total) return 'Sin respuestas todavía.';
  if (accuracy >= 90) return 'Excelente. Ese tema ya está en memoria.';
  if (accuracy >= 75) return 'Muy bien: repasá sólo los errores y volvé mañana.';
  if (accuracy >= 50) return 'Vas bien. La repetición espaciada se encarga del resto.';
  return 'Tema para reforzar: leé la teoría y repetí la práctica.';
}

function unitProgress(quizEntries, cardEntries, lessonsRead, lessonsTotal, diagramsDone, diagramsTotal) {
  const parts = [];
  if (lessonsTotal) parts.push(percent(lessonsRead, lessonsTotal));
  if (diagramsTotal) parts.push(percent(diagramsDone, diagramsTotal));
  const quizMastery = quizEntries.length
    ? percent(quizEntries.filter((e) => e && e.box >= 3).length, quizEntries.length)
    : 0;
  const cardMastery = cardEntries.length
    ? percent(cardEntries.filter((e) => e && e.box >= 3).length, cardEntries.length)
    : 0;
  parts.push(quizMastery, cardMastery);
  return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
}

  __CDM_MODULES__["core/ui.js"] = { icon, h, ring, bar, statTile, emptyState, toast, closeSheet, openSheet, haptic, setFocusMode, scrollToTop, confirmSheet, accuracyTone, applyTheme, scoreMessage, unitProgress };
})();

/* ===== data/u6.js ===== */
(function () {
  "use strict";
/* ============================================================
   data/u6.js — Unidad 6: Ensayos y Propiedades Mecánicas
   Fuente: resumen de cátedra "Parcial 2 — Unidades 6 a 10" +
   apuntes manuscritos del usuario.
   ============================================================ */

const u6 = {
  id: 'u6',
  number: 6,
  title: 'Ensayos y Propiedades Mecánicas',
  shortTitle: 'Ensayos',
  subtitle: 'Tracción, flexión, dureza, impacto y fatiga',
  tag: 'Va seguro',
  examQuote: '«La unidad 6 va seguro en el examen, todo eso de Charpy y los distintos ensayos.»',
  intro:
    'La unidad responde una sola pregunta: ¿cómo sé si un material sirve para una pieza? ' +
    'La respuesta depende de cómo se va a cargar: estirada, doblada, golpeada, rayada o miles de veces con poca fuerza. ' +
    'Por eso hay un ensayo para cada situación y cada uno devuelve un número distinto.',
  priority: [
    'Tracción: probetas SA-370, curva σ–ε y propiedades de la curva.',
    'Fluencia convencional 0,2 % (offset) y cedencia superior/inferior.',
    'Flexión en 3 y 4 puntos: concepto y diferencia (sin cálculos).',
    'Dureza: Brinell, Rockwell, Vickers, Knoop y Shore.',
    'Impacto: péndulo, energía absorbida, % de fractura por corte y expansión lateral.',
    'Charpy vs. Izod (medidas, colocación y lado del golpe).',
    'Transición dúctil–frágil y fatiga: sólo conceptos (S–N y Marin no entran).',
  ],
  notPriority: 'Cálculos de tracción, Brinell, flexión, impacto y fatiga: no entran. La unidad se evalúa de forma conceptual.',

  lessons: [
    {
      id: 'u6-traccion',
      unit: 'u6',
      title: 'Ensayo de tracción y probetas SA-370',
      kicker: 'El ensayo base',
      minutes: 4,
      goal: 'Entender cómo se ensaya y de dónde salen F y Δl que alimentan toda la curva.',
      blocks: [
        {
          t: 'p',
          html: 'El <b>ensayo de tracción</b> mide la resistencia de un material a una fuerza <b>estática aplicada en forma gradual</b> (lenta). ' +
            'La probeta se sujeta por sus cabezas con dos mordazas en una <b>Máquina Universal de Ensayos</b> (en el ITU: INSTRON y WOLPERT) y el cabezal móvil la estira con una carga axial F creciente hasta romperla.',
        },
        {
          t: 'p',
          html: 'La probeta tiene una <b>zona reducida</b> a propósito: ahí se concentra la deformación y ahí se mide. ' +
            'Sobre esa zona se marca la <b>longitud calibrada inicial</b> (l₀ o G, gauge length) y, para medir con precisión en la zona elástica, se acopla un <b>extensómetro</b>.',
        },
        {
          t: 'ul',
          items: [
            '<b>Probeta plana / rectangular:</b> G = longitud calibrada (50 o 200 mm), W = ancho de la sección reducida, T o e = espesor, R = radio de empalme. La sección se identifica por su ancho y espesor.',
            '<b>Probeta cilíndrica:</b> la longitud calibrada guarda una relación fija con el diámetro. Estándar: D = 12,5 mm y G = 50,0 mm; las probetas subsize reducen ambos en la misma proporción.',
            'El <b>radio R</b> evita que la tensión se concentre en el cambio brusco de sección y rompa antes de medir nada.',
            'Si la probeta tiene cambios bruscos de sección, la tensión se concentra en esos rincones: por eso existen radios y dimensiones normalizadas (todos los laboratorios ensayan igual y los números se pueden comparar).',
          ],
        },
        {
          t: 'callout',
          tone: 'info',
          title: 'Orientación de la probeta (ASTM A370)',
          html: 'En productos laminados la probeta se extrae <b>longitudinal</b> (eje paralelo a la laminación) o <b>transversal</b>. Las propiedades no son iguales: la longitudinal suele tener más resistencia y ductilidad por el fibrado. Si el enunciado aclara la orientación, conviene mencionarlo.',
        },
        {
          t: 'callout',
          tone: 'tip',
          title: 'Por qué importa la forma',
          html: 'La zona calibrada concentra la deformación y las mordazas no la dañan. La medición se hace sobre la sección de esa zona, no con las cabezas.',
        },
        {
          t: 'diagram',
          id: 'curva-sigma-epsilon',
          label: 'Ver la curva σ–ε con sus propiedades',
        },
      ],
      keyPoints: [
        'Ensayo estático, carga axial lenta y creciente hasta rotura.',
        'La sección reducida es la zona de medición; su forma depende de si la probeta es plana o cilíndrica.',
        'La probeta cilíndrica mantiene una proporción fija entre longitud calibrada y diámetro.',
        'El extensómetro mide el alargamiento en la zona elástica.',
      ],
    },

    {
      id: 'u6-propiedades',
      unit: 'u6',
      title: 'Las propiedades A–H de la curva σ–ε',
      kicker: 'Puntos y áreas',
      minutes: 5,
      goal: 'Poder nombrar A→F y H en orden y ubicar cada una en el gráfico.',
      blocks: [
        {
          t: 'p',
          html: 'La curva de tracción es una película con tres actos: primero el material es como una banda elástica (se estira y vuelve); después empieza a deformarse para siempre (como un clavo que se dobla); al final se hace un cuello, se adelgaza y rompe. ' +
            'Cada propiedad de la lista es un punto o un área de esa película. En el examen suelen pedir «indique y explique los puntos característicos»: si nombrás A→F y H en orden no te podés olvidar de nada.',
        },
        {
          t: 'ol',
          items: [
            '<b>A · Esfuerzo de fluencia o cedencia (σy):</b> divide el comportamiento elástico del plástico. Si se supera, queda deformación permanente.',
            '<b>B · Fluencia convencional al 0,2 %:</b> cuando la curva no tiene un quiebre claro (aluminio, aceros de alta resistencia, cobre) se traza una recta <b>paralela a la zona elástica</b> desplazada 0,2 % desde el origen. El esfuerzo donde corta la curva es σ₀,₂.',
            '<b>C · Resistencia a la tracción (σut):</b> es el esfuerzo máximo de la curva, calculado con la fuerza máxima y la sección inicial. Es el punto más alto, pero <b>no es el punto de rotura</b>.',
            '<b>D · Estricción o encuellamiento (necking):</b> al llegar a σut la deformación deja de ser uniforme y se concentra en un «cuello». Como el área real cae, la fuerza baja: la curva desciende hasta la ruptura.',
            '<b>E · Módulo de Young (E):</b> pendiente de la zona lineal elástica. Mide la rigidez y depende de la energía de enlace entre átomos. Acero ≈ 207 GPa, aluminio ≈ 69 GPa.',
            '<b>F · Resiliencia (ER):</b> área bajo la zona elástica (triángulo). Energía elástica por unidad de volumen que el material absorbe y devuelve al descargarse.',
            '<b>H · Ductilidad:</b> deformación plástica que soporta antes de romper. Se informa como % de alargamiento y % de estricción.',
          ],
        },
        {
          t: 'note',
          html: 'La propiedad G no entra en el examen: la lista salta de F a H y conserva las letras de la cátedra.',
        },
        {
          t: 'callout',
          tone: 'trap',
          title: 'Resiliencia ≠ tenacidad',
          html: 'La <b>resiliencia</b> es el área elástica (el triángulo chico). La <b>tenacidad</b> es el área total bajo la curva hasta la ruptura: combina resistencia + ductilidad. No son sinónimos y el profesor puede preguntarlo.',
        },
        {
          t: 'callout',
          tone: 'info',
          title: 'Cedencia superior e inferior',
          html: 'En aceros de bajo carbono aparece una cedencia brusca: un <b>pico</b> (cedencia superior) y una <b>meseta ondulante</b> (cedencia inferior), producida por el anclaje y liberación de dislocaciones por los átomos de carbono. La denominación σ₁/σ₂ cambia según la fuente: quedate con «pico = superior, meseta = inferior».',
        },
        {
          t: 'diagram',
          id: 'curva-sigma-epsilon',
          label: 'Ubicar cada propiedad en el diagrama',
        },
      ],
      keyPoints: [
        'A fluencia · B fluencia 0,2 % · C resistencia máxima · D estricción · E módulo · F resiliencia · H ductilidad (G no entra).',
        'σut es el esfuerzo máximo, no la ruptura: después del máximo el área real cae.',
        'Resiliencia = triángulo elástico; tenacidad = área total.',
        'E es rigidez, no resistencia.',
      ],
    },

    {
      id: 'u6-rigidez',
      unit: 'u6',
      title: 'Rigidez, acero vs. aluminio y temperatura',
      kicker: 'Interpretación',
      minutes: 3,
      goal: 'Explicar por qué el acero es más rígido y qué pasa al calentar.',
      blocks: [
        {
          t: 'p',
          html: 'El <b>módulo de Young</b> mide la rigidez, no la resistencia, y depende de la <b>energía de enlace entre los átomos</b>, no del tratamiento térmico ni del tamaño de grano. Es constante a temperatura dada.',
        },
        {
          t: 'p',
          html: 'En el gráfico de cátedra, bajo un mismo esfuerzo de 30.000 psi el acero se deforma sólo 0,001 plg/plg (E ≈ 30×10⁶ psi) mientras que el aluminio se deforma 0,003 plg/plg (E ≈ 10×10⁶ psi): <b>el acero es tres veces más rígido</b>.',
        },
        {
          t: 'table',
          head: ['Al aumentar la temperatura…', 'Efecto'],
          rows: [
            ['Esfuerzo de fluencia (σy)', 'Disminuye'],
            ['Resistencia a la tracción (σut)', 'Disminuye'],
            ['Módulo de elasticidad (E)', 'Disminuye (la curva se «acuesta»)'],
            ['Deformación a rotura', 'Aumenta: el material es más dúctil'],
          ],
          caption: 'Si preguntan «¿cambia la pendiente inicial al calentar?», la respuesta es sí: baja E.',
        },
        {
          t: 'callout',
          tone: 'prof',
          title: 'Qué busca el profesor',
          html: 'La pregunta es sobre <b>rigidez</b>, no sobre resistencia. Diferenciá E (rigidez) de σy (resistencia). Y en temperatura: no digas que E «no cambia porque es una constante»: es constante a temperatura dada.',
        },
      ],
      keyPoints: [
        'E = rigidez; depende del enlace atómico, no del tratamiento térmico.',
        'Acero 207 GPa ≈ 3× el aluminio (69 GPa).',
        'Calor: bajan σy, σut y E; sube la ductilidad.',
      ],
    },

    {
      id: 'u6-flexion',
      unit: 'u6',
      title: 'Flexión en 3 y 4 puntos (concepto)',
      kicker: 'Materiales frágiles',
      minutes: 3,
      goal: 'Explicar por qué se usa en frágiles y la diferencia conceptual entre 3 y 4 puntos, sin cálculos.',
      blocks: [
        {
          t: 'p',
          html: 'A los materiales frágiles (cerámicos, vidrios, fundición gris, polímeros rígidos) no se les puede hacer tracción: las mordazas trituran las cabezas y cualquier desalineación rompe la pieza antes de ensayar. Por eso se apoya una viga y se la carga: eso es <b>flexión</b>. La cara de abajo se tracciona y la de arriba se comprime; el material falla por la cara traccionada.',
        },
        {
          t: 'ul',
          items: [
            '<b>3 puntos:</b> una carga en el centro. El momento flector es <b>triangular</b> y tiene su máximo justo en el centro; el cortante cambia de signo al pasar por la carga.',
            '<b>4 puntos:</b> dos cargas ubicadas a un cuarto de la luz desde cada apoyo. El momento es <b>constante en todo el tramo central</b> y el cortante es <b>cero</b>: eso es <b>flexión pura</b>. Se ensaya un volumen mayor de material, ideal para cerámicos con defectos distribuidos.',
          ],
        },
        {
          t: 'callout',
          tone: 'info',
          title: 'Sin cuentas en el parcial',
          html: 'Para esta unidad alcanza con explicar <b>por qué se ensaya en flexión</b> y <b>qué cambia entre 3 y 4 puntos</b>. No se piden σflex ni Eflex: no hace falta reemplazar fórmulas.',
        },
        {
          t: 'callout',
          tone: 'prof',
          title: 'Qué busca el profesor',
          html: 'La justificación del ensayo en frágiles y la diferencia conceptual: en 3 puntos el momento se concentra en el centro; en 4 puntos hay un tramo central con momento constante y cortante nulo (flexión pura).',
        },
      ],
      keyPoints: [
        'Frágiles → flexión porque las mordazas de tracción los dañan.',
        '3 puntos: una carga al centro, momento triangular.',
        '4 puntos: dos cargas, momento constante en el tramo central y V = 0 (flexión pura).',
        'En este parcial se evalúa el concepto, no el cálculo de σflex/Eflex.',
      ],
    },

    {
      id: 'u6-dureza',
      unit: 'u6',
      title: 'Dureza y microdureza',
      kicker: 'El ensayo más usado',
      minutes: 4,
      goal: 'Elegir el método correcto y no equivocarse con la fórmula Brinell.',
      blocks: [
        {
          t: 'p',
          html: 'La <b>dureza</b> es la resistencia de la superficie a la penetración por un objeto duro (resistencia a la deformación plástica localizada). Es el ensayo más usado en la industria porque es rápido, barato y casi no daña la pieza. ' +
            'Bonus: en aceros no austeníticos, la dureza permite <b>estimar la tensión de rotura</b> sin destruir la pieza (Tabla 2 de ASTM/ASME SA-370).',
        },
        {
          t: 'ul',
          items: [
            '<b>Brinell (HB/HBW):</b> esfera de acero duro o carburo de tungsteno D = 10 mm. Cargas: 3000 kgf (hierros y aceros) o 500 kgf (no ferrosos). Se mide ópticamente el diámetro promedio de la impronta d. Deja una huella grande: no sirve para piezas delgadas.',
            '<b>Rockwell (HR):</b> el durómetro mide automáticamente la <b>profundidad</b> de penetración (no hace falta microscopio). Blandos: bola de acero 1/16" (HRB, HRF) o 1/8" (HRE). Duros: cono de diamante 120° (HRA 60 kg, HRC 150 kg, HRD 100 kg). Aplica una precarga para asentar el penetrador.',
            '<b>Vickers (HV):</b> pirámide de diamante de base cuadrada, carga típica 10 kg; se miden las dos diagonales al microscopio.',
            '<b>Knoop (HK):</b> pirámide romboidal alargada y asimétrica, 500 g; se mide sólo la diagonal larga. Penetra menos → ideal para cerámicos y recubrimientos delgados.',
            '<b>Shore (A/D):</b> materiales no metálicos: cauchos, elastómeros y plásticos. Mide la profundidad de la marca. Shore A para cauchos blandos y Shore D para plásticos rígidos; no son linealmente convertibles entre sí.',
          ],
        },
        {
          t: 'table',
          head: ['Ensayo', 'Penetrador', 'Carga', 'Aplicación típica'],
          rows: [
            ['Brinell HB', 'Bola 10 mm', '3000 kgf', 'Hierro y acero fundido, aceros'],
            ['Brinell HB', 'Bola 10 mm', '500 kgf', 'No ferrosos (Al, Cu, bronce)'],
            ['Rockwell A', 'Cono de diamante', '60 kgf', 'Muy duros (carburos)'],
            ['Rockwell B', 'Bola 1/16"', '100 kgf', 'Latón, acero de baja resistencia'],
            ['Rockwell C', 'Cono de diamante', '150 kgf', 'Acero de alta resistencia / templado'],
            ['Rockwell D', 'Cono de diamante', '100 kgf', 'Acero cementado'],
            ['Rockwell E', 'Bola 1/8"', '100 kgf', 'Materiales muy suaves (magnesio)'],
            ['Rockwell F', 'Bola 1/16"', '60 kgf', 'Aluminio, chapas finas'],
            ['Vickers HV', 'Pirámide cuadrada', '10 kg', 'Duros / microdureza'],
            ['Knoop HK', 'Pirámide romboidal', '500 g', 'Cerámicos y capas delgadas'],
          ],
          caption: 'Tabla de cátedra. Si dudás, memorizá: Brinell = diámetro de huella; Rockwell = profundidad; Vickers/Knoop = diagonales al microscopio; Shore = polímeros.',
        },
        {
          t: 'callout',
          tone: 'trap',
          title: 'Cuidado con las unidades',
          html: 'En este parcial Brinell se pregunta por el método: esfera, carga y huella. No se reemplaza la fórmula; identificá el ensayo y qué se mide.',
        },
        {
          t: 'callout',
          tone: 'prof',
          title: 'Qué busca el profesor',
          html: 'Elegí <b>Knoop para capas delgadas</b> y <b>Shore para polímeros</b>: son las dos respuestas de aplicación que más pregunta. Y nombrá la norma SA-370 cuando expliques dureza → resistencia.',
        },
      ],
      keyPoints: [
        'Brinell: esfera 10 mm, 3000/500 kgf, se mide d.',
        'Rockwell: mide profundidad, es automático y rápido.',
        'Vickers: pirámide cuadrada, dos diagonales. Knoop: rombo, diagonal larga.',
        'La dureza permite estimar la resistencia en aceros no austeníticos; no se calcula en el parcial.',
      ],
    },

    {
      id: 'u6-impacto',
      unit: 'u6',
      title: 'Ensayo de impacto: péndulo, Charpy e Izod',
      kicker: 'El tema estrella',
      minutes: 6,
      goal: 'Explicar el ensayo, los 3 resultados y la diferencia Charpy/Izod sin dudar.',
      blocks: [
        {
          t: 'p',
          html: 'La tracción estira despacio; el impacto <b>golpea de golpe</b>. Muchos materiales que se portan bien estirando se rompen como vidrio ante un golpe rápido, sobre todo si están fríos. ' +
            'El ensayo mide <b>cuánta energía se lleva la probeta al romperse</b>: un péndulo cae desde una altura conocida y, después de romperla, llega a una altura menor. Esa diferencia de energía es la tenacidad al impacto.',
        },
        {
          t: 'p',
          html: '¿Por qué la probeta tiene una <b>entalla</b>? Porque en la realidad las piezas tienen esquinas, cambios de sección y defectos. La entalla hace que la fractura empiece en un lugar conocido y <b>concentra las tensiones</b>, que es justo lo que se quiere estudiar. Entalla normalizada: 45°, profundidad 2 mm, radio de raíz 0,25 mm.',
        },
        {
          t: 'table',
          head: ['Característica', 'Charpy (el más usado)', 'Izod'],
          rows: [
            ['Probeta', '10 × 10 × 55 mm', '10 × 10 × 75 mm'],
            ['Entalla', 'En el centro (L/2 = 27,5 mm), 45°, 2 mm de profundidad, r = 0,25 mm', '45°, 2 mm, desplazada del centro'],
            ['Colocación', 'Horizontal, simplemente apoyada en los dos extremos (viga)', 'Vertical, empotrada por la mitad inferior (voladizo)'],
            ['Lado del golpe', '<b>Cara opuesta a la entalla</b>', '<b>Del mismo lado de la entalla</b>, en el extremo libre'],
          ],
          caption: 'La diferencia del «lado del golpe» es la pregunta de examen más repetida de esta unidad.',
        },
        {
          t: 'p',
          html: '<b>Los 3 resultados del ensayo:</b>',
        },
        {
          t: 'ol',
          items: [
            '<b>Energía absorbida en la fractura</b>, en J o ft·lbf.',
            '<b>Porcentaje de fractura por cizallamiento (corte):</b> se observa la cara rota. El área de corte es el marco periférico opaco y fibroso (fractura dúctil); el área de clivaje es el recuadro central brillante y cristalino (fractura frágil). El % de corte es la proporción de la cara que falló por cizallamiento; si no hay zona de clivaje, la fractura es 100 % dúctil.',
            '<b>Expansión lateral opuesta a la entalla</b> (mm o mils): ensanchamiento por deformación plástica del lado que golpea el martillo. Más dúctil → mayor expansión.',
          ],
        },
        {
          t: 'callout',
          tone: 'tip',
          title: 'Cómo leer una cara de fractura',
          html: 'Marco periférico <b>opaco y fibroso</b> = corte (dúctil). Recuadro central <b>brillante y cristalino</b> = clivaje (frágil). Mayor % de corte = mayor ductilidad = mayor energía absorbida.',
        },
        {
          t: 'callout',
          tone: 'trap',
          title: 'No invertir el lado del golpe',
          html: '<b>Charpy golpea la cara opuesta a la entalla. Izod golpea del mismo lado de la entalla.</b> Decir que Charpy golpea del lado de la entalla es el error clásico.',
        },
        {
          t: 'diagram',
          id: 'impacto',
          label: 'Ver Charpy e Izod lado a lado (con el lado del golpe)',
        },
      ],
      keyPoints: [
        'Ensayo dinámico: la energía absorbida se lee por la diferencia de altura del péndulo.',
        '3 resultados: energía, % de corte y expansión lateral.',
        'Charpy: 10×10×55, horizontal apoyada, golpe opuesto a la entalla.',
        'Izod: 10×10×75, vertical empotrada, golpe del mismo lado de la entalla.',
        'Más % de corte y más expansión = más dúctil.',
      ],
    },

    {
      id: 'u6-transicion',
      unit: 'u6',
      title: 'Curva de transición dúctil–frágil',
      kicker: 'Temperatura y seguridad',
      minutes: 3,
      goal: 'Explicar la curva en S, la temperatura de transición y el caso FCC.',
      blocks: [
        {
          t: 'p',
          html: 'Hay materiales que cambian de dúctiles a frágiles al bajar la temperatura, y lo hacen de golpe. El caso clásico son los <b>aceros ferríticos (estructura BCC)</b>: barcos y tanques de la Segunda Guerra se rajaron porque el acero se volvió frágil en agua fría.',
        },
        {
          t: 'p',
          html: 'La curva cae en forma de «S» desde una <b>meseta superior dúctil</b> (alta absorción de energía) a una <b>meseta inferior frágil</b> (clivaje). La <b>temperatura de transición</b> separa ambos comportamientos y siempre hay que operar por encima de ella: por debajo, el material pasa de dúctil a frágil sin aviso.',
        },
        {
          t: 'callout',
          tone: 'info',
          title: 'Materiales FCC',
          html: 'Aluminio, cobre y aceros inoxidables austeníticos (FCC) <b>no presentan esta transición marcada</b>: mantienen alta energía de impacto a bajas temperaturas. Por eso los recipientes criogénicos se hacen de acero inoxidable austenítico.',
        },
        {
          t: 'callout',
          tone: 'prof',
          title: 'Qué busca el profesor',
          html: 'Nombrá la <b>estructura BCC</b> y la <b>consecuencia práctica</b>: la temperatura de transición es el límite de seguridad de servicio.',
        },
        {
          t: 'diagram',
          id: 'transicion',
          label: 'Ver la curva de transición BCC vs FCC',
        },
      ],
      keyPoints: [
        'Aceros BCC no austeníticos: curva en S al bajar T.',
        'Temperatura de transición = límite de seguridad.',
        'FCC (Al, Cu, austeníticos): sin transición marcada → criogenia.',
      ],
    },

    {
      id: 'u6-fatiga',
      unit: 'u6',
      title: 'Fatiga: conceptos básicos',
      kicker: 'Cargas repetidas',
      minutes: 3,
      goal: 'Explicar qué es la fatiga, sus 3 etapas y por qué es peligrosa, sin cálculos.',
      blocks: [
        {
          t: 'p',
          html: 'Si doblás un alambre muchas veces con poca fuerza, termina cortándose. No lo rompió una carga grande, lo rompió la <b>repetición</b>. En fatiga la probeta está sometida a la aplicación cíclica de un esfuerzo <b>inferior al de fluencia</b> (σ < σy). La falla ocurre <b>sin deformación plástica visible</b>, lo que la hace peligrosa.',
        },
        {
          t: 'ol',
          items: [
            '<b>Iniciación:</b> nace una grieta minúscula en la superficie (rayas, entallas, inclusiones o cambios de sección).',
            '<b>Propagación:</b> la grieta avanza ciclo a ciclo hacia el interior, dejando marcas de playa.',
            '<b>Fractura súbita:</b> el área sana remanente ya no soporta la carga y se rompe bruscamente.',
          ],
        },
        {
          t: 'p',
          html: 'Es peligrosa porque la pieza <b>no avisa</b>: no se deforma visiblemente antes de romper y el esfuerzo aplicado puede estar por debajo de σy. La grieta suele iniciarse en la <b>superficie</b>, por eso el acabado, las entallas y los cambios de sección importan tanto.',
        },
        {
          t: 'callout',
          tone: 'info',
          title: 'S–N y Marin no entran',
          html: 'Las curvas <b>S–N (Wöhler)</b> y los <b>coeficientes de Marin</b> quedaron fuera del parcial. De fatiga sólo se pide la <b>idea general y las 3 etapas</b>.',
        },
        {
          t: 'callout',
          tone: 'info',
          title: 'Fatiga térmica',
          html: 'Si el calentamiento o enfriamiento no es uniforme, unas partes dilatan y contraen restringidas por otras: aparecen tensiones cíclicas de signos opuestos que terminan provocando fatiga térmica. Es el mecanismo típico de moldes y piezas de horno.',
        },
        {
          t: 'callout',
          tone: 'prof',
          title: 'Qué busca el profesor',
          html: 'Las <b>3 etapas en orden</b>, la definición (σ < σy, sin deformación visible) y por qué es peligrosa. No hace falta estimar Se ni aplicar Marin.',
        },
      ],
      keyPoints: [
        'σ < σy, sin deformación visible, falla por repetición.',
        '3 etapas: iniciación → propagación → fractura súbita.',
        'La grieta nace en la superficie y avanza ciclo a ciclo.',
        'S–N y Marin no entran; sólo la teoría general.',
      ],
    },

    {
      id: 'u6-errores',
      unit: 'u6',
      title: 'Errores típicos y checklist de examen',
      kicker: 'Control final',
      minutes: 3,
      goal: 'Evitar los puntos que se pierden por unidades, datos o dibujos.',
      blocks: [
        {
          t: 'p',
          html: 'La mayoría de los puntos se pierden por no distinguir conceptos, confundir un ensayo con otro o no dibujar. Esta es la lista de control antes de entregar.',
        },
        {
          t: 'ul',
          items: [
            'Confundir <b>resiliencia</b> (área elástica) con <b>tenacidad</b> (área total).',
            'Decir que Charpy golpea del lado de la entalla: es al revés, golpea la cara opuesta. Izod sí golpea del mismo lado.',
            'Confundir σut (esfuerzo máximo) con la tensión de rotura.',
          ],
        },
        {
          t: 'callout',
          tone: 'tip',
          title: 'Checklist de 60 segundos',
          html: '¿Nombré los puntos de la curva? · ¿Diferencié Charpy de Izod? · ¿Expliqué qué mide cada ensayo? · Si piden comparar, ¿aclaré el montaje y el lado del golpe?',
        },
      ],
      keyPoints: [
        'Cada ensayo mide algo distinto: no mezclar propiedades.',
        'Nombrar las etapas, zonas o métodos sin fórmulas.',
        'Charpy opuesto a la entalla · Izod del mismo lado.',
      ],
    },
  ],

  formulas: [],

  cards: [
    { id: 'c6-01', unit: 'u6', topic: 'traccion', front: '¿Qué es el ensayo de tracción?', back: 'Ensayo estático: carga axial creciente y lenta hasta romper una probeta normalizada, sujeta con mordazas en una máquina universal (INSTRON, WOLPERT). De un solo ensayo salen las propiedades de la curva σ–ε.' },
    { id: 'c6-05', unit: 'u6', topic: 'traccion', front: '¿Para qué sirve el extensómetro?', back: 'Para medir con precisión el alargamiento de la zona calibrada, sobre todo en la zona elástica.' },
    { id: 'c6-06', unit: 'u6', topic: 'traccion', front: '¿Qué evita el radio R de la probeta?', back: 'La concentración de tensiones en el cambio de sección; si no existiera, la probeta rompería antes de medir.' },
    { id: 'c6-07', unit: 'u6', topic: 'traccion', front: 'Orientación de probeta en laminados', back: 'Longitudinal (paralela a la laminación) o transversal. La longitudinal suele tener más resistencia y ductilidad por el fibrado.' },
    { id: 'c6-08', unit: 'u6', topic: 'propiedades', front: 'Esfuerzo y deformación: definición', back: 'σ es la fuerza por unidad de área; ε es el cambio de longitud relativo y es adimensional.' },
    { id: 'c6-09', unit: 'u6', topic: 'propiedades', front: '¿Qué divide la zona elástica de la plástica?', back: 'El esfuerzo de fluencia o cedencia σy. Al superarlo queda deformación permanente.' },
    { id: 'c6-10', unit: 'u6', topic: 'propiedades', front: 'Resistencia a la tracción σut', back: 'σut es el esfuerzo máximo de la curva, pero NO es el de ruptura: después de σut empieza la estricción y el área real cae.' },
    { id: 'c6-11', unit: 'u6', topic: 'propiedades', front: '¿Cuándo comienza la estricción?', back: 'Exactamente en σut (el punto máximo). La deformación se localiza, se forma el cuello y la curva desciende hasta la ruptura.' },
    { id: 'c6-12', unit: 'u6', topic: 'propiedades', front: 'Módulo de Young: significado', back: 'E es la pendiente de la zona elástica: mide la rigidez, no la resistencia. Acero ≈ 207 GPa; aluminio ≈ 69 GPa.' },
    { id: 'c6-13', unit: 'u6', topic: 'propiedades', front: 'Resiliencia', back: 'Resiliencia = área bajo la zona elástica: energía elástica por unidad de volumen que se absorbe y devuelve al descargar.' },
    { id: 'c6-14', unit: 'u6', topic: 'propiedades', front: 'Tenacidad vs. resiliencia', back: 'Tenacidad = área total bajo la curva hasta la ruptura (resistencia + ductilidad). Resiliencia = sólo el área elástica.' },
    { id: 'c6-16', unit: 'u6', topic: 'propiedades', front: 'Ductilidad: ¿cómo se informa?', back: 'Se informa con % de alargamiento y % de estricción. Por encima del 5 % de alargamiento el acero se considera dúctil.' },
    { id: 'c6-17', unit: 'u6', topic: 'propiedades', front: 'Método del offset 0,2 %', back: 'Cuando no hay quiebre claro, se traza una recta paralela a la zona elástica desplazada 0,2 % y se lee el esfuerzo donde corta la curva: σ₀,₂.' },
    { id: 'c6-18', unit: 'u6', topic: 'propiedades', front: 'Cedencia superior e inferior', back: 'En aceros de bajo carbono: un pico (cedencia superior) y una meseta ondulante (cedencia inferior), por anclaje/liberación de dislocaciones por los átomos de carbono.' },
    { id: 'c6-19', unit: 'u6', topic: 'rigidez', front: '¿Por qué el acero es más rígido que el aluminio?', back: 'E depende de la energía de enlace entre átomos: acero ≈ 207 GPa vs. aluminio ≈ 69 GPa (3×). A igual esfuerzo, el aluminio se deforma el triple.' },
    { id: 'c6-20', unit: 'u6', topic: 'rigidez', front: 'Efecto de la temperatura en tracción', back: 'Bajan σy, σut y E (la curva se acuesta) y sube la deformación a rotura (más dúctil). La pendiente inicial sí cambia: baja E.' },
    { id: 'c6-21', unit: 'u6', topic: 'rigidez', front: '¿De qué depende E?', back: 'De la energía de enlace entre los átomos. NO del tratamiento térmico ni del tamaño de grano.' },
    { id: 'c6-22', unit: 'u6', topic: 'flexion', front: '¿Por qué los frágiles se ensayan en flexión?', back: 'Porque las mordazas de tracción trituran sus cabezas y cualquier desalineación los rompe antes de medir. Se ensaya una viga apoyada.' },
    { id: 'c6-23', unit: 'u6', topic: 'flexion', front: 'Flexión en 3 puntos: momento y cortante', back: 'Una carga en el centro: momento triangular con el máximo en el centro; el cortante cambia de signo al pasar por la carga.' },
    { id: 'c6-24', unit: 'u6', topic: 'flexion', front: 'Flexión en 4 puntos: momento y cortante', back: 'Dos cargas a L/4: momento trapecial, constante en todo el tramo central L/2; cortante V = 0 → flexión pura. Se ensaya más volumen de material.' },
    { id: 'c6-26', unit: 'u6', topic: 'dureza', front: 'Definición de dureza', back: 'Resistencia de la superficie a la penetración por un objeto duro (deformación plástica localizada). Ensayo rápido, barato y casi no daña la pieza.' },
    { id: 'c6-27', unit: 'u6', topic: 'dureza', front: 'Brinell: penetrador, cargas y qué se mide', back: 'Esfera de 10 mm (acero duro o carburo). 3000 kgf para hierros/aceros, 500 kgf para no ferrosos. Se mide el diámetro d de la huella con microscopio. Huella grande: no sirve en piezas delgadas.' },
    { id: 'c6-29', unit: 'u6', topic: 'dureza', front: 'Rockwell: ¿qué mide y por qué es el más rápido?', back: 'Mide la profundidad de penetración con lectura automática (sin microscopio). Usa precarga. Cono de diamante 120° o bolas de 1/16" y 1/8".' },
    { id: 'c6-30', unit: 'u6', topic: 'dureza', front: 'Vickers y Knoop', back: 'Vickers: pirámide de base cuadrada, se miden las dos diagonales. Knoop: pirámide romboidal alargada, sólo la diagonal larga, penetra menos (ideal cerámicos y capas delgadas).' },
    { id: 'c6-31', unit: 'u6', topic: 'dureza', front: 'Escalas Rockwell más usadas', back: 'HRC: cono de diamante, 150 kgf, acero templado. HRB: bola 1/16", 100 kgf, latón y acero blando. HRA: cono, 60 kgf, carburos.' },
    { id: 'c6-32', unit: 'u6', topic: 'dureza', front: 'Shore: ¿para qué materiales?', back: 'Cauchos, elastómeros y plásticos. Shore A para blandos, Shore D para rígidos. Mide la profundidad de la marca; no son linealmente convertibles.' },
    { id: 'c6-34', unit: 'u6', topic: 'impacto', front: '¿Qué tipo de ensayo es el de impacto?', back: 'Dinámico: golpe súbito a alta velocidad con un péndulo, sobre una probeta entallada. Mide la energía absorbida al fracturarla.' },
    { id: 'c6-35', unit: 'u6', topic: 'impacto', front: 'Energía absorbida en el péndulo', back: 'La energía absorbida es la diferencia de energía potencial del péndulo antes y después del golpe; se lee en la escala del equipo.' },
    { id: 'c6-36', unit: 'u6', topic: 'impacto', front: '¿Para qué sirve la entalla?', back: 'Para que la fractura empiece en un lugar conocido y para concentrar tensiones, simulando defectos y cambios de sección reales. Normalizada: 45°, 2 mm de profundidad, r = 0,25 mm.' },
    { id: 'c6-37', unit: 'u6', topic: 'impacto', front: 'Probeta y montaje Charpy', back: '10 × 10 × 55 mm, entalla al centro (L/2 = 27,5 mm). Se apoya horizontal en los dos extremos (viga) y el péndulo golpea la cara opuesta a la entalla.' },
    { id: 'c6-38', unit: 'u6', topic: 'impacto', front: 'Probeta y montaje Izod', back: '10 × 10 × 75 mm, entalla desplazada. Se empotra vertical por la mitad inferior (voladizo) y el péndulo golpea el extremo libre, del mismo lado de la entalla.' },
    { id: 'c6-39', unit: 'u6', topic: 'impacto', front: 'Los 3 resultados del ensayo de impacto', back: '1) Energía absorbida (J o ft·lbf). 2) % de fractura por cizallamiento (corte). 3) Expansión lateral opuesta a la entalla (mm o mils).' },
    { id: 'c6-40', unit: 'u6', topic: 'impacto', front: 'Cara de fractura: ¿qué es corte y qué es clivaje?', back: 'Corte (dúctil): marco periférico opaco y fibroso. Clivaje (frágil): recuadro central A×B, brillante y cristalino. % corte = (Atotal − A·B)/Atotal × 100; si A o B = 0, es 100 % dúctil.' },
    { id: 'c6-41', unit: 'u6', topic: 'impacto', front: 'Expansión lateral', back: 'Ensanchamiento por deformación plástica del lado opuesto a la entalla. Se mide con calibre, en mm o mils. Más dúctil → mayor expansión.' },
    { id: 'c6-42', unit: 'u6', topic: 'transicion', front: 'Curva de transición dúctil–frágil', back: 'Caída en S de la energía de impacto al bajar la temperatura, típica de aceros no austeníticos BCC: meseta superior dúctil, inferior frágil (clivaje) y temperatura de transición entre ambas.' },
    { id: 'c6-43', unit: 'u6', topic: 'transicion', front: '¿Qué materiales no tienen transición marcada?', back: 'Los FCC: aluminio, cobre y aceros inoxidables austeníticos. Conservan alta energía a baja temperatura; por eso se usan en servicios criogénicos.' },
    { id: 'c6-46', unit: 'u6', topic: 'fatiga', front: '¿Qué es la fatiga?', back: 'Falla por esfuerzos cíclicos menores que σy, sin deformación plástica visible. Es la causa más común de rotura en servicio (ejes, resortes, alas).' },
    { id: 'c6-47', unit: 'u6', topic: 'fatiga', front: 'Las 3 etapas de la fatiga', back: '1) Iniciación de una grieta superficial. 2) Propagación ciclo a ciclo (marcas de playa). 3) Fractura súbita cuando el área remanente no soporta la carga.' },
  ],

  quiz: [
    {
      id: 'q6-01', unit: 'u6', topic: 'traccion', type: 'mcq',
      q: '¿Cuál es la diferencia central entre el ensayo de tracción y el de impacto?',
      options: ['El de tracción aplica la carga lentamente (estático) y el de impacto da un golpe súbito (dinámico)', 'La tracción mide dureza y el impacto mide rigidez', 'El impacto se hace con mordazas y el de tracción con péndulo', 'No hay diferencia: ambos aplican la misma velocidad de carga'],
      correct: 0,
      explain: 'La tracción es un ensayo estático con carga axial creciente y lenta; el impacto es dinámico, con un péndulo que golpea la probeta entallada a alta velocidad.',
    },
    {
      id: 'q6-04', unit: 'u6', topic: 'traccion', type: 'mcq',
      q: '¿Para qué se acopla un extensómetro a la probeta?',
      options: ['Para medir con precisión el alargamiento en la zona calibrada', 'Para medir la dureza superficial', 'Para registrar la temperatura del ensayo', 'Para cortar la probeta al final'],
      correct: 0,
      explain: 'El extensómetro mide el alargamiento de la zona calibrada, especialmente en la zona elástica donde las deformaciones son pequeñas.',
    },
    {
      id: 'q6-05', unit: 'u6', topic: 'traccion', type: 'mcq',
      q: 'El radio R del cambio de sección de la probeta sirve para:',
      options: ['Evitar la concentración de tensiones que adelantaría la rotura', 'Aumentar la carga máxima del ensayo', 'Marcar la longitud calibrada', 'Sujetar la probeta a las mordazas'],
      correct: 0,
      explain: 'Un cambio brusco de sección concentra tensiones y la probeta rompería antes de medir. El radio R suaviza la transición.',
    },
    {
      id: 'q6-06', unit: 'u6', topic: 'traccion', type: 'mcq',
      q: 'En un laminado, la probeta extraída longitudinalmente suele presentar:',
      options: ['Más resistencia y ductilidad que la transversal, por el fibrado', 'Menos resistencia que la transversal', 'Exactamente las mismas propiedades', 'Mayor dureza pero nula ductilidad'],
      correct: 0,
      explain: 'El fibrado de la laminación hace que la dirección longitudinal tenga mejores propiedades. Si el enunciado aclara la orientación, conviene mencionarlo.',
    },
    {
      id: 'q6-07', unit: 'u6', topic: 'propiedades', type: 'mcq',
      q: 'La resistencia a la tracción σut se define como:',
      options: ['El esfuerzo máximo de la curva, asociado a la fuerza máxima', 'La fuerza en el momento de la ruptura', 'El esfuerzo de fluencia multiplicado por dos', 'El esfuerzo que se mantiene constante después de la estricción'],
      correct: 0,
      explain: 'σut es el esfuerzo máximo de la curva, pero no el de rotura: después del máximo aparece la estricción y la carga baja.',
    },
    {
      id: 'q6-08', unit: 'u6', topic: 'propiedades', type: 'mcq',
      q: '¿Qué ocurre exactamente en el punto σut?',
      options: ['Comienza la estricción: la deformación se localiza y se forma el cuello', 'El material recupera su forma original', 'Se alcanza el límite elástico', 'La probeta se separa en dos'],
      correct: 0,
      explain: 'En σut empieza el encuellamiento. Al reducirse el área real, la fuerza que soporta la probeta cae y la curva desciende hasta la ruptura.',
    },
    {
      id: 'q6-09', unit: 'u6', topic: 'propiedades', type: 'mcq',
      q: 'El módulo de Young E de la curva σ–ε es:',
      options: ['La pendiente de la zona lineal elástica', 'El área total bajo la curva', 'La altura del pico σut', 'La deformación en la ruptura'],
      correct: 0,
      explain: 'E es la pendiente de la zona elástica: mide la rigidez y depende de la energía de enlace atómico, no del tratamiento térmico.',
    },
    {
      id: 'q6-10', unit: 'u6', topic: 'propiedades', type: 'mcq',
      q: 'La resiliencia es:',
      options: ['El área del triángulo bajo la zona elástica', 'El área total bajo la curva hasta la ruptura', 'La energía absorbida en un golpe de péndulo', 'La deformación permanente después de romper'],
      correct: 0,
      explain: 'La resiliencia es el área elástica: energía por unidad de volumen que el material absorbe y devuelve. El área total es la tenacidad.',
    },
    {
      id: 'q6-11', unit: 'u6', topic: 'propiedades', type: 'mcq',
      q: 'La tenacidad de un material, leída en la curva σ–ε, corresponde a:',
      options: ['El área total bajo la curva hasta la ruptura', 'Sólo el área elástica', 'La pendiente inicial', 'El valor de σy'],
      correct: 0,
      explain: 'La tenacidad combina resistencia y ductilidad: es toda el área bajo la curva. No confundirla con la resiliencia (sólo el triángulo elástico).',
    },
    {
      id: 'q6-13', unit: 'u6', topic: 'propiedades', type: 'mcq',
      q: 'La ductilidad se informa con:',
      options: ['% de alargamiento y % de estricción', 'σy y σut', 'El módulo E y la resiliencia', 'La energía absorbida en J'],
      correct: 0,
      explain: 'Se informa con el porcentaje de alargamiento y el de estricción. Por encima del 5 % de alargamiento el acero se considera dúctil.',
    },
    {
      id: 'q6-14', unit: 'u6', topic: 'propiedades', type: 'mcq',
      q: '¿Cómo se obtiene la fluencia convencional al 0,2 %?',
      options: ['Trazando una paralela a la zona elástica desplazada 0,2 % desde el origen', 'Bajando una vertical desde σut', 'Dividiendo σut por 2', 'Midiendo el área del triángulo elástico'],
      correct: 0,
      explain: 'Se usa cuando la curva no tiene quiebre claro (aluminio, cobre, aceros de alta resistencia). El corte con la curva es σ₀,₂.',
    },
    {
      id: 'q6-15', unit: 'u6', topic: 'rigidez', type: 'mcq',
      q: 'Bajo un mismo esfuerzo de 30.000 psi, el acero se deforma 0,001 y el aluminio 0,003. Esto indica que:',
      options: ['El acero es tres veces más rígido (Eacero ≈ 3·Ealuminio)', 'El acero es tres veces más resistente', 'El aluminio es más dúctil y por eso tiene mayor E', 'Ambos tienen el mismo módulo de Young'],
      correct: 0,
      explain: 'La deformación es inversamente proporcional a E. Con 207 GPa vs. 69 GPa, el acero es tres veces más rígido.',
    },
    {
      id: 'q6-16', unit: 'u6', topic: 'rigidez', type: 'mcq',
      q: 'Al aumentar la temperatura, en el ensayo de tracción:',
      options: ['Disminuyen σy, σut y E, y aumenta la deformación a rotura', 'Aumentan σy, σut y E', 'Sólo cambia σut; E es invariante', 'Disminuye la ductilidad'],
      correct: 0,
      explain: 'El calor afloja los enlaces: la curva se acuesta (menor E), baja la altura (menor σy y σut) y aumenta el alargamiento final.',
    },
    {
      id: 'q6-17', unit: 'u6', topic: 'rigidez', type: 'mcq',
      q: '¿De qué depende el módulo de elasticidad E?',
      options: ['De la energía de enlace entre los átomos', 'Del tratamiento térmico aplicado', 'Del tamaño de grano', 'De la velocidad de enfriamiento del molde'],
      correct: 0,
      explain: 'E es una propiedad de enlace atómico. No cambia con el tratamiento térmico ni con el tamaño de grano, sí con la temperatura.',
    },
    {
      id: 'q6-18', unit: 'u6', topic: 'flexion', type: 'mcq',
      q: '¿Por qué los materiales frágiles se ensayan en flexión y no en tracción?',
      options: ['Porque las mordazas de tracción trituran las cabezas y la desalineación rompe la pieza antes de medir', 'Porque en flexión no se necesita medir fuerza', 'Porque la flexión siempre da valores más bajos', 'Porque los frágiles no tienen módulo de elasticidad'],
      correct: 0,
      explain: 'Se apoya una viga y se carga: la cara inferior trabaja a tracción. Se evita el daño de las mordazas y la flexión parásita.',
    },
    {
      id: 'q6-20', unit: 'u6', topic: 'flexion', type: 'mcq',
      q: 'La ventaja principal de la flexión en 4 puntos es que:',
      options: ['El momento es constante en el tramo central y el cortante es cero (flexión pura)', 'El momento máximo es el doble que en 3 puntos', 'No necesita apoyos', 'Se mide directamente la dureza'],
      correct: 0,
      explain: 'Con dos cargas a L/4 el momento es trapecial y constante en L/2, con V = 0. Se ensaya más volumen de material, útil para cerámicos con defectos distribuidos.',
    },
    {
      id: 'q6-22', unit: 'u6', topic: 'dureza', type: 'mcq',
      q: 'El ensayo Brinell mide:',
      options: ['El diámetro de la huella dejada por una esfera de 10 mm', 'La profundidad de penetración de un cono', 'La diagonal de una pirámide romboidal', 'La resistencia al rayado con una punta de diamante'],
      correct: 0,
      explain: 'Se mide ópticamente el diámetro promedio d de la impronta. F = 3000 kgf para aceros y hierros, 500 kgf para no ferrosos.',
    },
    {
      id: 'q6-24', unit: 'u6', topic: 'dureza', type: 'mcq',
      q: 'Rockwell es el ensayo de dureza más rápido porque:',
      options: ['El equipo mide automáticamente la profundidad de penetración, sin microscopio', 'No requiere aplicar carga', 'Usa una huella microscópica', 'Se hace sólo en polímeros'],
      correct: 0,
      explain: 'La lectura es directa de la profundidad. Aplica una precarga para asentar el penetrador. Es el típico ensayo de producción en serie.',
    },
    {
      id: 'q6-25', unit: 'u6', topic: 'dureza', type: 'mcq',
      q: 'Para medir la dureza de un recubrimiento delgado o un cerámico, el método más adecuado es:',
      options: ['Knoop, porque penetra muy poco y se mide la diagonal larga', 'Brinell, por su huella grande', 'Shore A, por ser no destructivo', 'Rockwell B, por usar bola de 1/16"'],
      correct: 0,
      explain: 'La pirámide romboidal de Knoop penetra menos que Vickers; es la elección para capas delgadas y cerámicos.',
    },
    {
      id: 'q6-26', unit: 'u6', topic: 'dureza', type: 'mcq',
      q: 'El ensayo Shore se usa para:',
      options: ['Cauchos, elastómeros y plásticos', 'Aceros templados', 'Cerámicos de alta dureza', 'Fundiciones grises'],
      correct: 0,
      explain: 'Shore mide la profundidad de la marca en materiales no metálicos: Shore A para cauchos blandos, Shore D para plásticos rígidos.',
    },
    {
      id: 'q6-28', unit: 'u6', topic: 'dureza', type: 'mcq',
      q: '¿Qué escala Rockwell usarías para un acero templado de alta resistencia?',
      options: ['HRC: cono de diamante y 150 kgf', 'HRB: bola de 1/16" y 100 kgf', 'HRE: bola de 1/8" y 100 kgf', 'Shore D'],
      correct: 0,
      explain: 'HRC (cono de diamante, 150 kgf) es la escala para aceros de alta resistencia y templados. HRB es para latón y aceros blandos.',
    },
    {
      id: 'q6-30', unit: 'u6', topic: 'impacto', type: 'mcq',
      q: '¿Por qué la probeta de impacto tiene una entalla?',
      options: ['Para que la fractura empiece en un lugar conocido y se concentren las tensiones, como en un defecto real', 'Para que el péndulo no resbale', 'Para aumentar la masa de la probeta', 'Para medir la dureza en el fondo de la entalla'],
      correct: 0,
      explain: 'La entalla normalizada (45°, 2 mm, r = 0,25 mm) reproduce una concentración de tensiones típica de esquinas y cambios de sección.',
    },
    {
      id: 'q6-31', unit: 'u6', topic: 'impacto', type: 'mcq',
      q: 'La probeta Charpy mide y se coloca:',
      options: ['10×10×55 mm, horizontal y simplemente apoyada en los extremos', '10×10×75 mm, vertical y empotrada', '10×10×55 mm, vertical y empotrada', '10×10×75 mm, horizontal y apoyada'],
      correct: 0,
      explain: 'Charpy trabaja como viga: 55 mm de largo, apoyada horizontalmente en los dos extremos. Izod es la de 75 mm, vertical y empotrada en voladizo.',
    },
    {
      id: 'q6-32', unit: 'u6', topic: 'impacto', type: 'mcq',
      q: 'En Charpy, el péndulo golpea:',
      options: ['La cara opuesta a la entalla', 'La cara de la entalla', 'El extremo apoyado', 'La cara lateral, paralela a la entalla'],
      correct: 0,
      explain: 'Charpy golpea la cara opuesta a la entalla: la probeta se flexiona y la entalla queda traccionada. Es la pregunta más repetida de la unidad.',
    },
    {
      id: 'q6-33', unit: 'u6', topic: 'impacto', type: 'mcq',
      q: 'En Izod, el péndulo golpea:',
      options: ['Del mismo lado de la entalla, en el extremo libre', 'En la cara opuesta a la entalla', 'En el empotramiento', 'En el centro de la probeta'],
      correct: 0,
      explain: 'Izod es una probeta vertical empotrada por la mitad inferior; el golpe llega al extremo libre, del mismo lado de la entalla.',
    },
    {
      id: 'q6-34', unit: 'u6', topic: 'impacto', type: 'mcq',
      q: '¿Cuáles son los tres resultados que entrega el ensayo de impacto?',
      options: ['Energía absorbida, % de fractura por corte y expansión lateral', 'σy, σut y alargamiento', 'Dureza, módulo y alargamiento', 'Longitud, ancho y espesor'],
      correct: 0,
      explain: 'La energía sale del péndulo; el % de corte se lee en la cara de fractura; la expansión lateral se mide con calibre en el lado opuesto a la entalla.',
    },
    {
      id: 'q6-35', unit: 'u6', topic: 'impacto', type: 'mcq',
      q: 'Una cara de fractura con un marco periférico opaco y fibroso y un centro brillante indica:',
      options: ['Zona de corte (dúctil) en el marco y de clivaje (frágil) en el centro', 'Fractura 100 % dúctil', 'Fractura 100 % frágil', 'Un ensayo de dureza mal hecho'],
      correct: 0,
      explain: 'El corte es el marco opaco y fibroso; el clivaje es el recuadro central A×B, brillante y cristalino. Si A o B es 0, el corte es 100 %.',
    },
    {
      id: 'q6-36', unit: 'u6', topic: 'impacto', type: 'mcq',
      q: 'La expansión lateral se mide:',
      options: ['En la cara opuesta a la entalla, y crece con la ductilidad', 'En la punta de la entalla, y crece con la fragilidad', 'En el empotramiento de la probeta', 'En el eje del péndulo'],
      correct: 0,
      explain: 'El ensanchamiento plástico aparece del lado que golpea el martillo (opuesto a la entalla). Más expansión = más dúctil.',
    },
    {
      id: 'q6-37', unit: 'u6', topic: 'impacto', type: 'mcq',
      q: 'Un acero que se comporta dúctil en tracción, pero a −40 °C absorbe muy poca energía de impacto, probablemente:',
      options: ['Tiene estructura BCC y está por debajo de su temperatura de transición', 'Tiene estructura FCC y no tiene transición', 'Es un acero inoxidable austenítico', 'No fue ensayado correctamente'],
      correct: 0,
      explain: 'Los aceros ferríticos BCC pierden tenacidad al impacto al bajar la temperatura. La temperatura de transición marca el límite de servicio.',
    },
    {
      id: 'q6-39', unit: 'u6', topic: 'transicion', type: 'mcq',
      q: 'La curva de transición dúctil–frágil tiene forma de S porque:',
      options: ['Pasa de una meseta superior dúctil a una inferior frágil (clivaje) al bajar la temperatura', 'Aumenta indefinidamente con la temperatura', 'Es una recta de pendiente constante', 'Sólo se aplica a polímeros'],
      correct: 0,
      explain: 'Es típica de aceros no austeníticos BCC. La temperatura de transición separa ambos comportamientos y se debe operar por encima de ella.',
    },
    {
      id: 'q6-40', unit: 'u6', topic: 'transicion', type: 'mcq',
      q: '¿Por qué los recipientes criogénicos se hacen de acero inoxidable austenítico?',
      options: ['Porque su estructura FCC no presenta transición dúctil–frágil marcada', 'Porque su estructura BCC es más tenaz en frío', 'Porque su tenacidad al impacto es muy baja', 'Porque no se pueden soldar otros aceros'],
      correct: 0,
      explain: 'Los FCC (austeníticos, aluminio, cobre) mantienen alta energía de impacto a baja temperatura, a diferencia de los BCC.',
    },
    {
      id: 'q6-43', unit: 'u6', topic: 'fatiga', type: 'mcq',
      q: 'En fatiga, la falla ocurre con esfuerzos:',
      options: ['Menores que σy y sin deformación plástica visible', 'Mayores que σut', 'Iguales a σy y con gran estricción', 'Sólo en compresión'],
      correct: 0,
      explain: 'La repetición de ciclos abre y propaga una grieta superficial aunque el esfuerzo nominal esté por debajo de la fluencia: por eso es peligrosa.',
    },
    {
      id: 'q6-44', unit: 'u6', topic: 'fatiga', type: 'mcq',
      q: 'El orden correcto de las etapas de fatiga es:',
      options: ['Iniciación → propagación → fractura súbita', 'Fractura → propagación → iniciación', 'Propagación → iniciación → fluencia', 'Iniciación → fluencia → estricción'],
      correct: 0,
      explain: 'La grieta nace en la superficie (rayas, entallas, inclusiones), avanza ciclo a ciclo y al final el área remanente se rompe de golpe.',
    },
    {
      id: 'q6-48', unit: 'u6', topic: 'fatiga', type: 'mcq',
      q: 'La fatiga térmica se produce por:',
      options: ['Dilataciones y contracciones no uniformes que generan tensiones cíclicas', 'Un golpe súbito del péndulo', 'La presencia de una grieta macroscópica', 'El exceso de dureza superficial'],
      correct: 0,
      explain: 'Si el calentamiento o enfriamiento no es uniforme, unas partes restringen a otras y aparecen tensiones cíclicas de signos opuestos (moldes, piezas de horno).',
    },
    {
      id: 'q6-61', unit: 'u6', topic: 'impacto', type: 'mcq',
      q: 'Dos probetas del mismo acero se ensayan a 20 °C y a −30 °C. Lo esperable es que a −30 °C:',
      options: ['La energía absorbida y el % de corte disminuyan', 'La energía absorbida aumente y el % de corte también', 'No cambie nada porque el acero no depende de la temperatura', 'La probeta no se rompa'],
      correct: 0,
      explain: 'En aceros BCC, al bajar la temperatura la fractura pasa de dúctil a frágil: cae la energía, cae el % de corte y baja la expansión lateral.',
    },
    {
      id: 'q6-62', unit: 'u6', topic: 'dureza', type: 'mcq',
      q: '¿Por qué Brinell no sirve para piezas delgadas?',
      options: ['Porque deja una huella grande que puede atravesar o deformar la pieza', 'Porque necesita un microscopio electrónico', 'Porque sólo mide polímeros', 'Porque su carga es de 500 g'],
      correct: 0,
      explain: 'La esfera de 10 mm con 3000 kgf deja una impronta grande. En piezas delgadas se usa Rockwell o microdureza Vickers/Knoop.',
    },
  ],
};

  __CDM_MODULES__["data/u6.js"] = { u6 };
})();

/* ===== data/u8.js ===== */
(function () {
  "use strict";
/* ============================================================
   data/u8.js — Unidad 8: Endurecimiento por Solidificación
   Fuente: resumen de cátedra "Parcial 2 — Unidades 6 a 10" +
   apuntes manuscritos del usuario.
   ============================================================ */

const frac = (num, den) => `<span class="frac"><span class="frac__num">${num}</span><span class="frac__den">${den}</span></span>`;
const lines = (...items) => `<span class="formula-lines">${items.map((item) => `<span class="fline">${item}</span>`).join('')}</span>`;

const u8 = {
  id: 'u8',
  number: 8,
  title: 'Endurecimiento por Solidificación',
  shortTitle: 'Solidificación',
  subtitle: 'Nucleación, grano fino y regla de Chvorinov',
  tag: 'Alta probabilidad',
  examQuote: '«Va un ejercicio de lo del tiempo de solidificación, donde hay que sacar el volumen de un cilindro, el volumen de la pieza o el área del molde; va a tomar una figura simple como un cilindro, un cubo o un prisma.»',
  intro:
    'La unidad responde cómo pasa un metal de líquido a sólido y de qué depende cómo queda. ' +
    'La primera parte es la nucleación: en el líquido se forman sólidos chicos; si no superan un tamaño crítico se vuelven a fundir, y si lo superan crecen. ' +
    'La segunda es el tiempo que tarda todo en solidificar: primero la curva de enfriamiento (líquido, meseta y sólido) y después la regla de Chvorinov, con el ejercicio que va seguro.',
  priority: [
    'Nucleación: balance de energía libre (ΔGv de volumen y σ de superficie).',
    'Embrión vs. núcleo (radio crítico) y subenfriamiento.',
    'Nucleación homogénea y heterogénea.',
    'Endurecimiento por tamaño de grano (refinamiento con impurezas).',
    'Curva de enfriamiento del metal puro: tres etapas, Tf y tiempos local/total.',
    'Regla de Chvorinov: ts = B·(V/A)ⁿ con n ≈ 2.',
    'Cálculo de V y A de cubo, prisma, cilindro y esfera.',
    'Ejercicio de ts: directo, comparación entre formas e inverso (sacar el área del molde).',
  ],
  notPriority: 'Páginas 11 a 28: crecimiento planar/dendrítico, EBDS, estructura de lingote, defectos, contracción y porosidad. La curva de enfriamiento (págs. 20–21) sí entra.',

  lessons: [
    {
      id: 'u8-nucleacion',
      unit: 'u8',
      title: 'Nucleación: el balance de energía libre',
      kicker: 'Por qué solidifica',
      minutes: 4,
      goal: 'Escribir ΔG, explicar el signo de cada término y saber cuándo gana cada uno.',
      blocks: [
        {
          t: 'p',
          html: 'Un material solidifica cuando el líquido se enfría por debajo de la temperatura de fusión, porque la energía asociada a la estructura cristalina del sólido es <b>menor</b> que la del líquido: el sólido es más estable. Pero aparece un problema: al crear el sólido se crea una <b>interfase</b>, y esa interfase cuesta energía.',
        },
        {
          t: 'formula',
          expr: 'ΔG = (4/3)·π·r³·ΔGv + 4·π·r²·σ', html: 'ΔG = <span class="frac"><span class="frac__num">4</span><span class="frac__den">3</span></span>π·r³·ΔGv + 4·π·r²·σ',
          note: 'Energía libre total de un núcleo esférico de radio r. ΔGv = energía libre de volumen; σ = energía libre de superficie.',
        },
        {
          t: 'ul',
          items: [
            '<b>Primer término (r³, ΔGv):</b> es negativo, libera energía y está <b>a favor</b> del sólido. Si el sólido crece, se libera más energía.',
            '<b>Segundo término (r², σ):</b> es positivo, cuesta energía y está <b>en contra</b>. Es el costo de crear la superficie de la interfase sólido–líquido.',
          ],
        },
        {
          t: 'p',
          html: 'Para radios chicos manda la superficie y el sólido se vuelve a fundir; para radios grandes manda el volumen y el sólido crece. El punto de equilibrio es el <b>radio crítico r*</b>.',
        },
        {
          t: 'callout',
          tone: 'tip',
          title: 'La idea en simple',
          html: 'Armar una pelota de nieve: al principio juntás poco y se desarma (embrión); si lográs un tamaño mínimo, después crece sola (núcleo). Crear la superficie de la agrupación cuesta energía; ganar volumen la libera.',
        },
        {
          t: 'callout',
          tone: 'prof',
          title: 'Qué busca el profesor',
          html: 'Escribí la ecuación y explicá el <b>signo de cada término</b>: eso demuestra que entendés el fenómeno. No alcanza con decir «el sólido tiene menos energía».',
        },
        {
          t: 'diagram',
          id: 'nucleacion',
          label: 'Ver las tres curvas y el radio crítico',
        },
      ],
      keyPoints: [
        'ΔG = (4/3)πr³ΔGv + 4πr²σ.',
        'Volumen (r³) a favor; superficie (r²) en contra.',
        'ΔG máximo en r*: el «punto de no retorno».',
      ],
    },

    {
      id: 'u8-radio-critico',
      unit: 'u8',
      title: 'Embrión, núcleo y radio crítico',
      kicker: 'r* y subenfriamiento',
      minutes: 3,
      goal: 'Distinguir embrión de núcleo y relacionar ΔT con r*.',
      blocks: [
        {
          t: 'p',
          html: 'El <b>radio crítico</b> es el «punto de no retorno»: si el sólido es más chico, le conviene fundirse; si es más grande, le conviene crecer. El <b>subenfriamiento</b> (cuánto se enfrió por debajo de la temperatura de fusión) achica ese radio: cuanto más frío está el líquido, más fácil es que aparezcan núcleos estables.',
        },
        {
          t: 'ul',
          items: [
            '<b>r < r* → embrión (inestable):</b> cualquier crecimiento adicional aumenta la energía libre, así que en vez de crecer se vuelve a fundir para reducir la energía.',
            '<b>r > r* → núcleo (estable):</b> el crecimiento adicional hace que la energía total disminuya; el sólido es estable y comienza el crecimiento de la partícula sólida.',
          ],
        },
        {
          t: 'formula',
          expr: 'r* = 2·σ·Tm / (ΔHf · ΔT)     con ΔT = Tm − T', html: '<span class="formula-lines"><span class="fline">r* = <span class="frac"><span class="frac__num">2·σ·Tm</span><span class="frac__den">ΔHf · ΔT</span></span></span><span class="fline">con ΔT = Tm − T</span></span>',
          note: 'σ = energía libre de superficie · ΔHf = calor latente de fusión · Tm = temperatura de solidificación · ΔT = subenfriamiento.',
        },
        {
          t: 'callout',
          tone: 'warn',
          title: 'Página 8: formalmente no va, pero cierra el tema',
          html: 'La fórmula de r* no está entre las páginas que entran, pero la <b>relación inversa</b> sí es la respuesta que se busca: cuanto mayor es el subenfriamiento ΔT, menor es el radio crítico y más fácil es que aparezcan núcleos estables. Con poco subenfriamiento hacen falta clusters enormes y la solidificación se dificulta.',
        },
        {
          t: 'diagram',
          id: 'nucleacion',
          label: 'Ver embriones y núcleos sobre la curva',
        },
      ],
      keyPoints: [
        'r < r*: embrión inestable, se funde.',
        'r > r*: núcleo estable, crece.',
        'ΔT grande → r* chico → nucleación más fácil.',
      ],
    },

    {
      id: 'u8-homogenea',
      unit: 'u8',
      title: 'Nucleación homogénea y heterogénea',
      kicker: 'Impurezas que ayudan',
      minutes: 3,
      goal: 'Explicar cuál necesita más subenfriamiento y por qué se usan inoculantes.',
      blocks: [
        {
          t: 'p',
          html: 'Nucleizar «desde cero» en el líquido es difícil (<b>homogénea</b>) porque hay que crear toda la superficie. Si hay una impureza o la pared del molde, el sólido se apoya ahí y gasta mucha menos energía (<b>heterogénea</b>). Por eso en la práctica los metales solidifican casi siempre sobre impurezas, y por eso se agregan <b>inoculantes</b>: para multiplicar los puntos de nucleación.',
        },
        {
          t: 'table',
          head: ['Aspecto', 'Homogénea', 'Heterogénea'],
          rows: [
            ['Dónde nuclea', 'En el líquido puro, desde cero', 'Sobre impurezas o paredes del molde'],
            ['Costo de superficie', 'Alto: debe crear toda la interfase', 'Bajo: la interfase ya existe en parte'],
            ['Subenfriamiento', 'Necesita mucho', 'Necesita mucho menos'],
            ['Frecuencia industrial', 'Rara', 'Dominante'],
          ],
        },
        {
          t: 'callout',
          tone: 'tip',
          title: 'Por qué importa en la industria',
          html: 'Como la nucleación heterogénea es mucho más fácil, se agregan <b>inoculantes</b> (partículas) al líquido para provocar gran cantidad de núcleos. Eso da muchos granos chicos en lugar de pocos granos grandes, y el material resultante es más resistente.',
        },
        {
          t: 'callout',
          tone: 'prof',
          title: 'Qué busca el profesor',
          html: 'La respuesta tiene que decir que la <b>heterogénea necesita menos subenfriamiento</b> y explicar por qué: menor costo de superficie porque el sólido se apoya en una superficie existente.',
        },
      ],
      keyPoints: [
        'Homogénea: todo el núcleo nace en el líquido, más ΔT.',
        'Heterogénea: sobre impurezas/pared, menos ΔT.',
        'Inoculantes → muchos núcleos → grano fino.',
      ],
    },

    {
      id: 'u8-grano',
      unit: 'u8',
      title: 'Endurecimiento por tamaño de grano',
      kicker: 'Grano fino = más resistencia',
      minutes: 3,
      goal: 'Explicar el mecanismo y su relación con la velocidad de enfriamiento.',
      blocks: [
        {
          t: 'p',
          html: 'Si hay muchos núcleos, nacen muchos granos y cada uno crece menos: el resultado es <b>grano fino</b>. Y grano fino significa mucha frontera de grano, que es lo que frena las dislocaciones. Es el mismo principio de la unidad 6: borde de grano = obstáculo = más resistencia.',
        },
        {
          t: 'p',
          html: 'Se introducen intencionalmente partículas de impurezas en el líquido. Eso produce un gran número de granos, cada uno de los cuales empieza a crecer a partir de un núcleo distinto.',
        },
        {
          t: 'callout',
          tone: 'tip',
          title: 'La frase que hay que saber',
          html: 'En los metales, cuanto mayor sea el área superficial de los bordes de grano, mayor será el endurecimiento. Con granos chicos hay más borde de grano por unidad de volumen, y los bordes actúan como <b>obstáculo al movimiento de dislocaciones</b>: el material es más resistente.',
        },
        {
          t: 'ul',
          items: [
            'Un metal de grano fino tiene <b>mayor límite elástico y mayor dureza</b>, aunque algo menos de ductilidad.',
            'La <b>velocidad de enfriamiento</b> importa: solidificar rápido = grano fino = material más resistente.',
            'La forma de la pieza también importa: las paredes finas se enfrían rápido (grano fino) y las zonas macizas tardan más (grano grueso).',
          ],
        },
        {
          t: 'callout',
          tone: 'prof',
          title: 'Qué busca el profesor',
          html: 'Relacioná con la unidad 6: <b>grano fino = mayor límite elástico y dureza, algo menos de ductilidad</b>. Y nombrá la velocidad de enfriamiento como herramienta práctica.',
        },
      ],
      keyPoints: [
        'Más núcleos → más granos → grano fino.',
        'Más borde de grano → más obstáculos a dislocaciones → más resistencia.',
        'Enfriar rápido deja grano fino.',
      ],
    },

    {
      id: 'u8-enfriamiento',
      unit: 'u8',
      title: 'Curva de enfriamiento y tiempos de solidificación',
      kicker: 'Metal puro',
      minutes: 4,
      goal: 'Leer la curva T–t, distinguir las tres etapas y no confundir tiempo local con tiempo total.',
      blocks: [
        {
          t: 'p',
          html: 'La <b>curva de enfriamiento</b> registra la temperatura del metal en función del tiempo desde el vaciado. En un <b>metal puro</b> aparecen tres tramos bien marcados: el líquido se enfría, la temperatura se estabiliza mientras solidifica y después el sólido se sigue enfriando. Las ramas líquida y sólida son curvas: la velocidad de enfriamiento cambia. La meseta es la única recta horizontal.',
        },
        {
          t: 'callout',
          tone: 'warn',
          title: 'Dato de cátedra',
          html: 'La curva de enfriamiento <b>entra sí o sí</b>. Memorizá los tres tramos, la meseta en Tf y las dos llaves de tiempo (local y total).',
        },
        {
          t: 'formula',
          expr: 'Rapidez de enfriamiento = ΔT / Δt', html: 'Rapidez de enfriamiento = <span class="frac"><span class="frac__num">ΔT</span><span class="frac__den">Δt</span></span>',
          note: 'Es la pendiente de la curva. Cuanto más empinada, más rápido se enfría el metal.',
        },
        {
          t: 'ol',
          items: [
            '<b>Líquido enfriándose (sobrecalentamiento):</b> el metal está 100 % líquido y se elimina <b>calor específico del líquido</b>. La temperatura baja siguiendo la pendiente ΔT/Δt.',
            '<b>Estabilización térmica (cambio de estado):</b> ocurre la solidificación y coexisten <b>líquido + sólido</b>. Se elimina únicamente <b>calor latente de fusión</b>, por eso la temperatura se mantiene constante en <b>Tf</b> (meseta).',
            '<b>Sólido enfriándose:</b> el metal ya es 100 % sólido y se elimina <b>calor específico del sólido</b>. La temperatura vuelve a bajar.',
          ],
        },
        {
          t: 'table',
          head: ['Tramo', 'Estado', 'Qué calor se elimina', 'Temperatura'],
          rows: [
            ['Líquido', '100 % líquido (sobrecalentado)', 'Calor específico del líquido', 'Baja'],
            ['Meseta', 'Líquido + sólido', 'Sólo calor latente de fusión', 'Constante en Tf'],
            ['Sólido', '100 % sólido', 'Calor específico del sólido', 'Baja'],
          ],
          caption: 'La meseta horizontal es la firma del cambio de estado en un metal puro.',
        },
        {
          t: 'formula',
          expr: 't_local = t_fin − t_inicio',
          note: 'Duración de la meseta: desde que empieza hasta que termina la solidificación. Sólo se elimina calor latente.',
        },
        {
          t: 'formula',
          expr: 't_total = t_fin − t_vaciado',
          note: 'Desde el vaciado hasta que se completa la solidificación. Incluye el calor específico del líquido sobrecalentado + el calor latente.',
        },
        {
          t: 'p',
          html: 'Para entender qué se extrae en cada tramo: el calor sensible se calcula con <span class="formula-inline">Q = m·c·ΔT</span> (cambia la temperatura) y el calor latente con <span class="formula-inline">Q = m·Lf</span> (cambia de estado sin cambiar la temperatura).',
        },
        {
          t: 'callout',
          tone: 'trap',
          title: 'Tiempo local ≠ tiempo total',
          html: 'El <b>local</b> es sólo la meseta (inicio → fin de solidificación). El <b>total</b> arranca en el vaciado, así que incluye el enfriamiento del líquido sobrecalentado. Si te piden “tiempo total”, no empieces a contar en el inicio de la meseta.',
        },
        {
          t: 'callout',
          tone: 'tip',
          title: 'Por qué la meseta es horizontal',
          html: 'Mientras hay líquido y sólido juntos, todo el calor que se extrae es <b>latente</b>: se usa para convertir líquido en sólido, no para bajar la temperatura. Por eso T se mantiene en Tf.',
        },
        {
          t: 'callout',
          tone: 'prof',
          title: 'Qué busca el profesor',
          html: 'Dibujá la curva completa: ejes T–t, ramas curvas en líquido y sólido, meseta horizontal en Tf y las dos llaves de tiempo. Después explicá qué calor se elimina en cada tramo. Con eso la pregunta está completa.',
        },
        {
          t: 'diagram',
          id: 'enfriamiento',
          label: 'Ver la curva interactiva con sus puntos',
        },
      ],
      keyPoints: [
        'Tres tramos: líquido → meseta (líquido + sólido) → sólido.',
        'En la meseta se elimina sólo calor latente y T = Tf constante.',
        'Tiempo local: inicio → fin de solidificación (la meseta).',
        'Tiempo total: vaciado → fin de solidificación (incluye el líquido sobrecalentado).',
        'La rapidez de enfriamiento es la pendiente ΔT/Δt.',
      ],
    },

    {
      id: 'u8-chvorinov',
      unit: 'u8',
      title: 'Regla de Chvorinov y mazarota',
      kicker: 'El ejercicio seguro',
      minutes: 5,
      goal: 'Aplicar ts = B·(V/A)², cuidar las unidades y explicar la mazarota.',
      blocks: [
        {
          t: 'p',
          html: 'Solidificar es sacar calor. El calor está en el <b>volumen</b> y se escapa por la <b>superficie</b>. Entonces lo que manda es la relación V/A: cuánto calor hay que sacar contra cuánta superficie hay para sacarlo. Una pieza «gordita» (poco A para su V) tarda mucho; una chapa fina (mucha A) solidifica en segundos.',
        },
        {
          t: 'formula',
          expr: 'ts = B · (V/A)ⁿ     con n ≈ 2  →  ts = B · V²/A²', html: '<span class="formula-lines"><span class="fline">ts = B · (<span class="frac"><span class="frac__num">V</span><span class="frac__den">A</span></span>)ⁿ</span><span class="fline">con n ≈ 2</span><span class="fline">ts = B · <span class="frac"><span class="frac__num">V²</span><span class="frac__den">A²</span></span></span></span>',
          note: 'ts = tiempo de solidificación · V = volumen de la fundición (calor a eliminar) · A = área de la superficie del molde por la que se extrae el calor · B = constante del molde.',
        },
        {
          t: 'ul',
          items: [
            '<b>V (volumen de la pieza):</b> cantidad de calor que hay que eliminar, en mm³ o cm³.',
            '<b>A (área del molde):</b> superficie por la cual se extrae el calor, en mm² o cm².',
            '<b>B (constante del molde):</b> depende de las propiedades y temperaturas iniciales del metal y del molde. Se expresa en min/cm² (si V/A está en cm) o min/mm² (si V/A está en mm).',
            '<b>n:</b> constante, generalmente 2.',
          ],
        },
        {
          t: 'callout',
          tone: 'trap',
          title: 'Cuidado con las unidades de B',
          html: 'Si el enunciado da las medidas en mm y B en min/cm², <b>pasá V y A a cm antes de dividir</b>. Un error de unidades acá cambia el resultado por 100. Verificación práctica: un cubo de 10 cm con B = 3,5 min/cm² debe dar ≈ 9,7 min; si da 970 min, hay un error de unidades.',
        },
        {
          t: 'p',
          html: 'A igual volumen, la forma con <b>menor superficie</b> (la esfera) tiene mayor V/A y tarda más en solidificar. Esa es la base del diseño de mazarotas: la mazarota debe tener <b>mayor V/A que la pieza</b> para solidificar al final y seguir alimentando el rechupe.',
        },
        {
          t: 'table',
          head: ['A igual volumen (2000 cm³)', 'A', 'V/A', 'ts (B = 3,5 min/cm²)'],
          rows: [
            ['Placa 20×20×5 cm', '1200 cm²', '1,67 cm', '≈ 9,7 min'],
            ['Cubo (12,6 cm de lado)', '953 cm²', '2,10 cm', '≈ 15,4 min'],
            ['Esfera (r = 7,8 cm)', '768 cm²', '2,60 cm', '≈ 23,7 min'],
          ],
          caption: 'El orden es siempre placa < cubo < esfera: más superficie por unidad de volumen → se enfría más rápido → solidifica antes.',
        },
        {
          t: 'callout',
          tone: 'info',
          title: 'Aplicación: la mazarota',
          html: 'La mazarota es el depósito de metal líquido que alimenta la contracción de la pieza. Debe solidificar <b>después</b> que la pieza, por lo que se diseña más «compacta» (mayor V/A). Si solidifica antes, la pieza queda con un <b>rechupe</b> interno que la inspección por rayos X detecta.',
        },
      ],
      keyPoints: [
        'ts = B·(V/A)²; n ≈ 2.',
        'V = calor a sacar; A = superficie de extracción; B = constante del molde.',
        'A igual volumen: placa < cubo < esfera en tiempo.',
        'Mazarota con mayor V/A → solidifica última → evita rechupe.',
      ],
    },

    {
      id: 'u8-formas',
      unit: 'u8',
      title: 'Volumen y área de las figuras básicas',
      kicker: 'Cubo, prisma, cilindro y esfera',
      minutes: 5,
      goal: 'Memorizar V, A y V/A de las cuatro figuras y no olvidar las dos tapas del cilindro.',
      blocks: [
        {
          t: 'p',
          html: 'El ejercicio de Chvorinov empieza identificando la figura y escribiendo sus fórmulas de V y A. Estas cuatro alcanzan para cualquier enunciado «simple»:',
        },
        {
          t: 'formula',
          expr: 'CUBO (lado a):  V = a³      A = 6a²      V/A = a/6', html: '<span class="formula-lines"><span class="fline"><b>CUBO (lado a)</b></span><span class="fline">V = a³</span><span class="fline">A = 6a²</span><span class="fline">V/A = <span class="frac"><span class="frac__num">a</span><span class="frac__den">6</span></span></span></span>',
          note: 'El caso más simple y el más probable en el examen.',
        },
        {
          t: 'formula',
          expr: 'PRISMA (a × b × c):  V = a·b·c      A = 2(ab + bc + ac)',
          note: 'Seis caras: tres pares iguales. Figura «tipo caja».',
        },
        {
          t: 'formula',
          expr: 'CILINDRO (r y D):  V = πr²h = (π/4)D²h      A = 2πr² + 2πrh = (π/2)D² + πDh',
          html: lines(
            '<b>CILINDRO (r y D)</b>',
            `V = πr²h = ${frac('π','4')}D²h`,
            `A = 2πr² + 2πrh = ${frac('π','2')}D² + πDh`,
            `V/A = ${frac('r·h','2(r+h)')} = ${frac('D·h','2(D+2h)')}`,
          ),
          note: 'No olvidar las DOS tapas: 2πr² = (π/2)D². La superficie lateral es 2πrh = πDh.',
        },
        {
          t: 'formula',
          expr: 'ESFERA (D):  V = (4/3)·π·r³      A = 4πr²      V/A = r/3', html: '<span class="formula-lines"><span class="fline"><b>ESFERA (D)</b></span><span class="fline">V = <span class="frac"><span class="frac__num">4</span><span class="frac__den">3</span></span>πr³</span><span class="fline">A = 4πr²</span><span class="fline">V/A = <span class="frac"><span class="frac__num">r</span><span class="frac__den">3</span></span></span></span>',
          note: 'La que más tarda a igual volumen: máxima V/A.',
        },
        {
          t: 'table',
          head: ['Figura', 'V', 'A', 'V/A'],
          rows: [
            ['Cubo', 'a³', '6a²', frac('a','6')],
            ['Prisma', 'a·b·c', '2(ab+bc+ac)', frac('abc','2(ab+bc+ac)')],
            ['Cilindro', 'πr²h<br><small>= ' + frac('π','4') + 'D²h</small>', '2πr² + 2πrh<br><small>= ' + frac('π','2') + 'D² + πDh</small>', frac('r·h','2(r+h)') + ' = ' + frac('D·h','2(D+2h)')],
            ['Esfera', frac('4','3') + 'πr³', '4πr²', frac('r','3')],
          ],
          caption: 'Cilindro: V = πr²h = (π/4)D²h; A = 2πr² + 2πrh = (π/2)D² + πDh; V/A = r·h/[2(r+h)] = D·h/[2(D+2h)]. Sirve para chequear el resultado sin calculadora.',
        },
        {
          t: 'callout',
          tone: 'trap',
          title: 'Errores que cuestan el ejercicio',
          html: '1) Olvidar las dos tapas del cilindro (usar sólo la lateral). 2) Usar el diámetro como radio. 3) Mezclar cm y mm con B en min/cm². 4) Redondear π a 3 (perdés precisión): usá 3,1416 o la tecla π.',
        },
        {
          t: 'callout',
          tone: 'tip',
          title: 'Comparar dos piezas sin calcular todo',
          html: 'Si ambas se cuelan en el mismo molde (misma B): <span class="formula-inline">ts1/ts2 = ((V/A)₁ / (V/A)₂)²</span>. No hace falta calcular ts por separado.',
        },
        {
          t: 'callout',
          tone: 'prof',
          title: 'Cómo se estudia esto',
          html: 'No memorices las cuatro fórmulas de golpe: practicá en el simulador hasta que puedas escribir V, A y V/A de cada figura en 20 segundos. El examen da una figura simple y pide V, A y ts.',
        },
        {
          t: 'lab',
          id: 'chvorinov',
          label: 'Abrir el simulador de formas y Chvorinov',
        },
      ],
      keyPoints: [
        'Cubo: a³ y 6a²; V/A = a/6.',
        'Prisma: abc y 2(ab+bc+ac).',
        'Cilindro: V = πr²h = (π/4)D²h; A = 2πr² + 2πrh = (π/2)D² + πDh (dos tapas).',
        'Esfera: 4/3πr³ y 4πr²; V/A = r/3.',
      ],
    },

    {
      id: 'u8-ejercicios',
      unit: 'u8',
      title: 'El ejercicio de Chvorinov, paso a paso',
      kicker: 'Directo, comparación e inverso',
      minutes: 6,
      goal: 'Resolver las tres variantes sin pensar de más.',
      blocks: [
        {
          t: 'p',
          html: 'La receta es siempre la misma: identificás la figura, escribís sus fórmulas de V y A, dividís y aplicás <span class="formula-inline">ts = B·(V/A)²</span>. Lo único que cambia es qué te piden: el tiempo, una comparación o una dimensión.',
        },
        {
          t: 'p',
          html: '<b>1) Directo — cubo de 10 cm, B = 3,5 min/cm²:</b>',
        },
        {
          t: 'ol',
          items: [
            'V = a³ = 10³ = 1000 cm³ · A = 6a² = 6 × 100 = 600 cm².',
            'V/A = 1000/600 = 1,6667 cm.',
            'ts = 3,5 × (1,6667)² = 3,5 × 2,7778 = <b>9,72 min</b>.',
          ],
        },
        {
          t: 'p',
          html: '<b>2) Directo — cilindro D = 10 cm, h = 20 cm, B = 3,5 min/cm²:</b>',
        },
        {
          t: 'ol',
          items: [
            'r = 5 cm. V = π × 5² × 20 = 1570,8 cm³.',
            'A = 2π(5)² + 2π(5)(20) = 157,1 + 628,3 = 785,4 cm².',
            'V/A = 2,00 cm → ts = 3,5 × 4 = <b>14,0 min</b>.',
          ],
        },
        {
          t: 'p',
          html: '<b>3) Comparación — placa y esfera de 2000 cm³, B = 3,5:</b>',
        },
        {
          t: 'ol',
          items: [
            'Placa 20×20×5: A = 2(20·20) + 4(20·5) = 800 + 400 = 1200 cm² → V/A = 1,667 cm → ts = 9,72 min.',
            'Esfera: r = (3V/4π)^(1/3) = 7,816 cm → A = 767,7 cm² → V/A = 2,605 cm → ts = 23,75 min.',
            'Relación: (2,605/1,667)² = 2,44. La esfera tarda 2,44 veces más.',
          ],
        },
        {
          t: 'p',
          html: '<b>4) Inverso — ¿qué lado debe tener un cubo que solidifique en 16 min con B = 4 min/cm²?</b>',
        },
        {
          t: 'ol',
          items: [
            '(V/A)² = ts/B = 16/4 = 4 → V/A = 2 cm.',
            'Para el cubo V/A = a/6 → a = 6 × 2 = 12 cm.',
            'Verificación: V = 1728 cm³, A = 864 cm², V/A = 2 cm, ts = 4 × 4 = 16 min.',
          ],
        },
        {
          t: 'p',
          html: '<b>5) Inverso — área del molde para 1500 cm³ en 9 min con B = 2,5:</b>',
        },
        {
          t: 'ol',
          items: [
            '(V/A)² = 9/2,5 = 3,6 → V/A = √3,6 = 1,897 cm.',
            'A = V / (V/A) = 1500 / 1,897 = <b>790,6 cm²</b>.',
          ],
        },
        {
          t: 'p',
          html: '<b>6) Trampa de unidades — cubo de 100 mm con B = 2 min/cm²:</b>',
        },
        {
          t: 'ol',
          items: [
            'En mm: V = 1.000.000 mm³ · A = 60.000 mm² → V/A = 16,67 mm.',
            'Como B está en min/cm², pasamos V/A a cm: 16,67 mm = 1,667 cm.',
            'ts = 2 × (1,667)² = <b>5,56 min</b>. Si te olvidás de pasar a cm, sale 555 min (9 horas): absurdo, y ahí te das cuenta del error.',
          ],
        },
        {
          t: 'callout',
          tone: 'tip',
          title: 'Atajo para comparar',
          html: 'Misma B: <span class="formula-inline">ts1/ts2 = ((V/A)₁/(V/A)₂)²</span>. Y para el cubo, <span class="formula-inline">V/A = a/6</span>; para la esfera, <span class="formula-inline">V/A = r/3</span>. Con esos dos atajos resolvés casi todo.',
        },
        {
          t: 'lab',
          id: 'chvorinov',
          label: 'Practicar en el simulador (con modo entrenamiento)',
        },
      ],
      keyPoints: [
        'Directo: V → A → V/A → ts = B·(V/A)².',
        'Comparación: ts1/ts2 = ((V/A)₁/(V/A)₂)².',
        'Inverso: despejá V/A y después la dimensión.',
        'Unidades: si B está en min/cm², V/A debe estar en cm.',
      ],
    },
  ],

  formulas: [
    { id: 'f8-01', group: 'Nucleación', name: 'Energía libre total', expr: 'ΔG = (4/3)πr³ΔGv + 4πr²σ', html: 'ΔG = <span class="frac"><span class="frac__num">4</span><span class="frac__den">3</span></span>πr³ΔGv + 4πr²σ', note: 'Volumen (a favor) + superficie (en contra)', tone: 'u8' },
    { id: 'f8-02', group: 'Nucleación', name: 'Radio crítico', expr: 'r* = 2σTm / (ΔHf · ΔT)', html: 'r* = <span class="frac"><span class="frac__num">2σTm</span><span class="frac__den">ΔHf · ΔT</span></span>', note: 'ΔT = Tm − T (subenfriamiento). Página 8: no entra formalmente.', tone: 'u8' },
    { id: 'f8-11', group: 'Enfriamiento', name: 'Rapidez de enfriamiento', expr: 'ΔT / Δt', html: '<span class="frac"><span class="frac__num">ΔT</span><span class="frac__den">Δt</span></span>', note: 'Pendiente de la curva T–t en cada tramo', tone: 'u8' },
    { id: 'f8-12', group: 'Enfriamiento', name: 'Tiempo de solidificación local', expr: 't_local = t_fin − t_inicio', note: 'Duración de la meseta: sólo calor latente', tone: 'u8' },
    { id: 'f8-13', group: 'Enfriamiento', name: 'Tiempo de solidificación total', expr: 't_total = t_fin − t_vaciado', note: 'Incluye calor específico del líquido sobrecalentado + latente', tone: 'u8' },
    { id: 'f8-14', group: 'Enfriamiento', name: 'Calor sensible', expr: 'Q = m · c · ΔT', note: 'Calor específico: cambia la temperatura', tone: 'u8' },
    { id: 'f8-15', group: 'Enfriamiento', name: 'Calor latente de fusión', expr: 'Q = m · Lf', note: 'Cambio de estado a temperatura constante (meseta)', tone: 'u8' },
    { id: 'f8-03', group: 'Chvorinov', name: 'Regla de Chvorinov', expr: 'ts = B · (V/A)ⁿ', html: 'ts = B · (<span class="frac"><span class="frac__num">V</span><span class="frac__den">A</span></span>)ⁿ', note: 'n ≈ 2 · B en min/cm² o min/mm²', tone: 'u8' },
    { id: 'f8-04', group: 'Chvorinov', name: 'Forma usual', expr: 'ts = B · V² / A²', html: 'ts = B · <span class="frac"><span class="frac__num">V²</span><span class="frac__den">A²</span></span>', note: 'La más usada en los ejercicios', tone: 'u8' },
    { id: 'f8-05', group: 'Comparación', name: 'Dos piezas, mismo molde', expr: 'ts1/ts2 = ((V/A)₁/(V/A)₂)²', html: '<span class="frac"><span class="frac__num">ts₁</span><span class="frac__den">ts₂</span></span> = (<span class="frac"><span class="frac__num">(V/A)₁</span><span class="frac__den">(V/A)₂</span></span>)²', note: 'Misma B: no hace falta calcular ts', tone: 'u8' },
    { id: 'f8-06', group: 'Formas', name: 'Cubo', expr: 'V = a³ · A = 6a² · V/A = a/6', html: '<span class="formula-lines"><span class="fline">V = a³</span><span class="fline">A = 6a²</span><span class="fline">V/A = <span class="frac"><span class="frac__num">a</span><span class="frac__den">6</span></span></span></span>', note: 'El caso más simple', tone: 'u8' },
    { id: 'f8-07', group: 'Formas', name: 'Prisma', expr: 'V = a·b·c · A = 2(ab+bc+ac)', note: 'Seis caras en tres pares', tone: 'u8' },
    { id: 'f8-08', group: 'Formas', name: 'Cilindro (r y D)', expr: 'V = πr²h = (π/4)D²h · A = 2πr² + 2πrh = (π/2)D² + πDh · V/A = r·h/[2(r+h)] = D·h/[2(D+2h)]', html: lines(`V = πr²h = ${frac('π','4')}D²h`, `A = 2πr² + 2πrh = ${frac('π','2')}D² + πDh`, `V/A = ${frac('r·h','2(r+h)')} = ${frac('D·h','2(D+2h)')}`), note: 'r = D/2 · incluye las dos tapas', tone: 'u8' },
    { id: 'f8-09', group: 'Formas', name: 'Esfera', expr: 'V = (4/3)πr³ · A = 4πr² · V/A = r/3', html: '<span class="formula-lines"><span class="fline">V = <span class="frac"><span class="frac__num">4</span><span class="frac__den">3</span></span>πr³</span><span class="fline">A = 4πr²</span><span class="fline">V/A = <span class="frac"><span class="frac__num">r</span><span class="frac__den">3</span></span></span></span>', note: 'Máximo V/A a igual volumen', tone: 'u8' },
    { id: 'f8-10', group: 'Aplicación', name: 'Mazarota', expr: '(V/A)mazarota > (V/A)pieza', note: 'Solidifica última y alimenta el rechupe', tone: 'u8' },
  ],

  cards: [
    { id: 'c8-01', unit: 'u8', topic: 'nucleacion', front: '¿Por qué solidifica un metal al enfriarse bajo su temperatura de fusión?', back: 'Porque la energía libre del sólido es menor que la del líquido: el sólido es el estado más estable. Pero crear la interfase sólido–líquido cuesta energía.' },
    { id: 'c8-02', unit: 'u8', topic: 'nucleacion', front: 'Energía libre total de un núcleo esférico', back: 'ΔG = (4/3)πr³ΔGv + 4πr²σ. El término de volumen es negativo (a favor) y el de superficie positivo (en contra).' },
    { id: 'c8-03', unit: 'u8', topic: 'nucleacion', front: '¿Cuál término de ΔG gana a radios chicos?', back: 'El de superficie (r², positivo): por eso el embrión se vuelve a fundir. A radios grandes gana el de volumen (r³, negativo) y el núcleo crece.' },
    { id: 'c8-04', unit: 'u8', topic: 'nucleacion', front: 'Signo y significado de ΔGv', back: 'Es negativo: energía que se libera al formar el volumen sólido. Crece con r³. Favorece la solidificación.' },
    { id: 'c8-05', unit: 'u8', topic: 'nucleacion', front: 'Signo y significado de σ', back: 'Es positivo: energía de la interfase sólido–líquido que se crea. Crece con r². Se opone a la nucleación (cuesta energía).' },
    { id: 'c8-06', unit: 'u8', topic: 'radio-critico', front: '¿Qué es el radio crítico r*?', back: 'El valor de r donde ΔG es máxima. Es el «punto de no retorno»: si el sólido es menor, le conviene fundirse; si es mayor, crecer.' },
    { id: 'c8-07', unit: 'u8', topic: 'radio-critico', front: 'Embrión (r < r*)', back: 'Sólido menor que r*. Cualquier crecimiento aumenta la energía libre, así que se vuelve a fundir para reducirla. Es inestable.' },
    { id: 'c8-08', unit: 'u8', topic: 'radio-critico', front: 'Núcleo (r > r*)', back: 'Sólido mayor que r*. Al crecer disminuye la energía total del sistema: es estable y comienza el crecimiento de la partícula sólida.' },
    { id: 'c8-09', unit: 'u8', topic: 'radio-critico', front: '¿Cómo influye el subenfriamiento en r*?', back: 'Relación inversa: cuanto mayor es ΔT, menor es r* y más fácil es que aparezcan núcleos estables. Con poco subenfriamiento hacen falta clusters enormes.' },
    { id: 'c8-10', unit: 'u8', topic: 'radio-critico', front: 'Fórmula del radio crítico', back: 'r* = 2σTm/(ΔHf·ΔT), con ΔT = Tm − T. Formalmente es la página 8, pero la relación ΔT↑ → r*↓ es la respuesta que se busca.' },
    { id: 'c8-11', unit: 'u8', topic: 'homogenea', front: 'Nucleación homogénea', back: 'Ocurre en el líquido puro: los átomos forman embriones desde cero. Necesita mayor subenfriamiento porque debe crear toda la interfase.' },
    { id: 'c8-12', unit: 'u8', topic: 'homogenea', front: 'Nucleación heterogénea', back: 'El sólido se apoya en una superficie existente (impureza o pared del molde). Gasta menos energía de interfase y requiere mucho menos subenfriamiento. Domina en la práctica industrial.' },
    { id: 'c8-13', unit: 'u8', topic: 'homogenea', front: '¿Para qué se agregan inoculantes?', back: 'Para multiplicar los puntos de nucleación: cada partícula es un sustrato. Resultado: muchos granos chicos, material más resistente y mejor acabado.' },
    { id: 'c8-14', unit: 'u8', topic: 'grano', front: '¿Cómo se logra grano fino?', back: 'Introduciendo partículas de impurezas en el líquido (muchos núcleos) y/o solidificando rápido: hay menos tiempo para que los granos crezcan.' },
    { id: 'c8-15', unit: 'u8', topic: 'grano', front: '¿Por qué el grano fino endurece al metal?', back: 'Porque hay más área de borde de grano por unidad de volumen. Los bordes son obstáculos al movimiento de dislocaciones: más borde = más resistencia.' },
    { id: 'c8-16', unit: 'u8', topic: 'grano', front: 'Efecto del grano fino en las propiedades', back: 'Mayor límite elástico y dureza, algo menos de ductilidad. Es el mismo principio de la unidad 6: borde de grano = obstáculo.' },
    { id: 'c8-17', unit: 'u8', topic: 'grano', front: 'Relación entre velocidad de enfriamiento y grano', back: 'Solidificar rápido = grano fino = material más resistente. Solidificar lento = grano grueso.' },
    { id: 'c8-18', unit: 'u8', topic: 'chvorinov', front: '¿Qué establece la regla de Chvorinov?', back: 'ts = B·(V/A)ⁿ con n ≈ 2: el tiempo de solidificación depende de la relación entre el volumen a enfriar y la superficie por la que se extrae el calor.' },
    { id: 'c8-19', unit: 'u8', topic: 'chvorinov', front: '¿Qué es V y qué es A en Chvorinov?', back: 'V = volumen de la fundición (cantidad de calor a eliminar, mm³ o cm³). A = área de la superficie del molde por la que se extrae el calor (mm² o cm²).' },
    { id: 'c8-20', unit: 'u8', topic: 'chvorinov', front: '¿De qué depende la constante B?', back: 'De las propiedades y las temperaturas iniciales del metal y del molde. Sus unidades son min/cm² o min/mm², según la unidad de V/A.' },
    { id: 'c8-21', unit: 'u8', topic: 'chvorinov', front: '¿Por qué a igual volumen la esfera tarda más?', back: 'Porque tiene la menor superficie posible: su V/A es máxima y el calor tiene menos área para escapar. Una placa delgada, con mucha superficie, solidifica antes.' },
    { id: 'c8-22', unit: 'u8', topic: 'chvorinov', front: '¿Cómo se diseña la mazarota?', back: 'Debe tener mayor V/A que la pieza para solidificar después y seguir alimentando líquido mientras la pieza se contrae. Si solidifica antes, aparece un rechupe interno.' },
    { id: 'c8-23', unit: 'u8', topic: 'chvorinov', front: 'Error de unidades en Chvorinov', back: 'Si B está en min/cm², V/A debe estar en cm. Si las medidas están en mm, pasá V y A a cm antes de dividir: un error acá cambia el resultado por 100.' },
    { id: 'c8-24', unit: 'u8', topic: 'formas', front: 'V, A y V/A del cubo', back: 'V = a³ · A = 6a² · V/A = a/6.' },
    { id: 'c8-25', unit: 'u8', topic: 'formas', front: 'V y A del prisma', back: 'V = a·b·c · A = 2(ab + bc + ac): tres pares de caras iguales.' },
    { id: 'c8-26', unit: 'u8', topic: 'formas', front: 'V y A del cilindro', back: 'Con radio: V = πr²h y A = 2πr² + 2πrh. Con diámetro: V = (π/4)D²h y A = (π/2)D² + πDh. No olvidar las dos tapas. r = D/2.' },
    { id: 'c8-27', unit: 'u8', topic: 'formas', front: 'V, A y V/A de la esfera', back: 'V = (4/3)πr³ · A = 4πr² · V/A = r/3. Tiene el máximo V/A a igual volumen.' },
    { id: 'c8-28', unit: 'u8', topic: 'formas', front: 'Relación de tiempos entre dos piezas', back: 'ts1/ts2 = ((V/A)₁/(V/A)₂)², si se cuelan en el mismo molde (misma B).' },
    { id: 'c8-29', unit: 'u8', topic: 'formas', front: '¿Qué superficie tiene más rápido enfriamiento?', back: 'La que tiene más área por unidad de volumen: la placa delgada. A igual volumen, el orden de ts es placa < cubo < esfera.' },
    { id: 'c8-30', unit: 'u8', topic: 'chvorinov', front: 'Atajo: V/A para cubo y esfera', back: 'Cubo: V/A = a/6. Esfera: V/A = r/3. Con esos dos y la fórmula de Chvorinov resolvés los inversos más comunes.' },
    { id: 'c8-31', unit: 'u8', topic: 'enfriamiento', front: 'Las tres etapas de la curva de enfriamiento de un metal puro', back: '1) Líquido enfriándose (sobrecalentamiento). 2) Estabilización térmica en Tf: solidificación con líquido + sólido. 3) Sólido enfriándose.' },
    { id: 'c8-32', unit: 'u8', topic: 'enfriamiento', front: '¿Qué calor se elimina en cada tramo de la curva?', back: 'Líquido: calor específico del líquido. Meseta: sólo calor latente de fusión. Sólido: calor específico del sólido.' },
    { id: 'c8-33', unit: 'u8', topic: 'enfriamiento', front: '¿Por qué la meseta de solidificación es horizontal?', back: 'Porque todo el calor extraído es latente: se usa para pasar de líquido a sólido, no para bajar la temperatura. Por eso T se mantiene constante en Tf.' },
    { id: 'c8-34', unit: 'u8', topic: 'enfriamiento', front: 'Tiempo de solidificación local', back: 'Desde que empieza hasta que termina la solidificación (la meseta). Sólo se elimina calor latente.' },
    { id: 'c8-35', unit: 'u8', topic: 'enfriamiento', front: 'Tiempo de solidificación total', back: 'Desde el vaciado hasta que se completa la solidificación. Incluye el calor específico del líquido sobrecalentado + el calor latente.' },
    { id: 'c8-36', unit: 'u8', topic: 'enfriamiento', front: 'Rapidez de enfriamiento', back: 'ΔT/Δt: la pendiente de la curva T–t. Cuanto más empinada, más rápido se enfría el metal.' },
    { id: 'c8-37', unit: 'u8', topic: 'enfriamiento', front: 'Calor sensible vs. calor latente', back: 'Sensible: Q = m·c·ΔT, cambia la temperatura. Latente: Q = m·Lf, cambia de estado a temperatura constante (la meseta).' },
  ],

  quiz: [
    {
      id: 'q8-01', unit: 'u8', topic: 'nucleacion', type: 'mcq',
      q: 'En la ecuación ΔG = (4/3)πr³ΔGv + 4πr²σ, el término de volumen es negativo porque:',
      options: ['Al formarse el sólido se libera energía, lo que favorece la solidificación', 'La superficie siempre cuesta energía', 'El radio crítico es negativo', 'El calor latente se absorbe'],
      correct: 0,
      explain: 'La energía libre del sólido es menor que la del líquido: ganar volumen libera energía (ΔGv < 0) y favorece el crecimiento.',
    },
    {
      id: 'q8-02', unit: 'u8', topic: 'nucleacion', type: 'mcq',
      q: 'El término 4πr²σ de la ecuación de nucleación representa:',
      options: ['La energía de la interfase sólido–líquido, que se opone a la nucleación', 'La energía liberada por el volumen', 'El calor latente de fusión', 'El subenfriamiento'],
      correct: 0,
      explain: 'Crear superficie cuesta energía: es el término positivo que domina a radios chicos y hace que el embrión se vuelva a fundir.',
    },
    {
      id: 'q8-03', unit: 'u8', topic: 'nucleacion', type: 'mcq',
      q: 'Para un radio muy pequeño, ¿qué término domina y qué ocurre?',
      options: ['Domina la superficie (r²) y el sólido se vuelve a fundir', 'Domina el volumen (r³) y el sólido crece', 'Se anulan ambos y no pasa nada', 'Domina el calor latente y el sólido se estabiliza'],
      correct: 0,
      explain: 'A radios chicos manda el costo de superficie; por eso los embriones son inestables y se disuelven.',
    },
    {
      id: 'q8-04', unit: 'u8', topic: 'radio-critico', type: 'mcq',
      q: 'El radio crítico r* corresponde al punto donde:',
      options: ['La energía libre total ΔG es máxima', 'La energía libre total es mínima', 'El embrión se disuelve', 'La temperatura llega a Tm'],
      correct: 0,
      explain: 'En el máximo de ΔG el sistema está en equilibrio inestable: por debajo del r* el embrión se funde, por encima crece.',
    },
    {
      id: 'q8-05', unit: 'u8', topic: 'radio-critico', type: 'mcq',
      q: 'Un sólido con r > r* es:',
      options: ['Un núcleo estable que crece, porque al crecer disminuye la energía libre', 'Un embrión inestable que se funde', 'Un grano que no puede crecer', 'Una fase líquida subenfriada'],
      correct: 0,
      explain: 'Una vez superado r*, cada átomo que se agrega baja la energía del sistema. El núcleo es estable y comienza el crecimiento.',
    },
    {
      id: 'q8-06', unit: 'u8', topic: 'radio-critico', type: 'mcq',
      q: 'Cuanto mayor es el subenfriamiento ΔT:',
      options: ['Menor es el radio crítico y más fácil es nucleizar', 'Mayor es el radio crítico y más difícil es nucleizar', 'No cambia el radio crítico', 'El radio crítico se vuelve infinito'],
      correct: 0,
      explain: 'r* = 2σTm/(ΔHf·ΔT): ΔT está en el denominador. Más subenfriamiento → r* más chico → aparecen núcleos estables con menos átomos.',
    },
    {
      id: 'q8-07', unit: 'u8', topic: 'radio-critico', type: 'mcq',
      q: 'Con muy poco subenfriamiento, la solidificación:',
      options: ['Se dificulta, porque hacen falta clusters enormes para superar r*', 'Es inmediata, porque r* es chico', 'No depende de ΔT', 'Ocurre sólo en materiales FCC'],
      correct: 0,
      explain: 'Si ΔT es pequeño, r* es grande y los embriones deben crecer mucho antes de ser estables: la nucleación se dificulta.',
    },
    {
      id: 'q8-08', unit: 'u8', topic: 'homogenea', type: 'mcq',
      q: 'La nucleación homogénea ocurre:',
      options: ['En el líquido puro, formando el núcleo desde cero', 'Sobre impurezas o la pared del molde', 'Sólo en la superficie de la pieza', 'Únicamente en metales FCC'],
      correct: 0,
      explain: 'En la homogénea no hay superficies que ayuden: los átomos deben formar el núcleo completo dentro del líquido.',
    },
    {
      id: 'q8-09', unit: 'u8', topic: 'homogenea', type: 'mcq',
      q: '¿Cuál requiere más subenfriamiento?',
      options: ['La homogénea, porque debe crear toda la interfase', 'La heterogénea, porque tiene impurezas', 'Ambas por igual', 'Ninguna: el subenfriamiento no depende del tipo'],
      correct: 0,
      explain: 'En la heterogénea el sólido se apoya en una superficie existente y gasta menos energía de interfase; por eso necesita menos ΔT.',
    },
    {
      id: 'q8-10', unit: 'u8', topic: 'homogenea', type: 'mcq',
      q: 'En la práctica industrial domina la nucleación:',
      options: ['Heterogénea, sobre impurezas y paredes del molde', 'Homogénea, en el líquido puro', 'No hay nucleación: el metal solidifica por enfriamiento uniforme', 'Sólo la nucleación en la superficie libre'],
      correct: 0,
      explain: 'Siempre hay impurezas y paredes: el sólido se apoya en ellas. Además se agregan inoculantes para multiplicar los núcleos.',
    },
    {
      id: 'q8-11', unit: 'u8', topic: 'homogenea', type: 'mcq',
      q: 'Los inoculantes se agregan para:',
      options: ['Provocar muchos núcleos y obtener grano fino', 'Aumentar el radio crítico', 'Evitar la nucleación heterogénea', 'Disminuir la velocidad de enfriamiento'],
      correct: 0,
      explain: 'Cada partícula de inoculante ofrece una superficie para nucleizar. Muchos núcleos → muchos granos chicos → material más resistente.',
    },
    {
      id: 'q8-12', unit: 'u8', topic: 'grano', type: 'mcq',
      q: 'El grano fino endurece al metal porque:',
      options: ['Hay más área de borde de grano, que obstaculiza el movimiento de dislocaciones', 'Los granos chicos tienen mayor módulo de Young', 'Disminuye la cantidad de dislocaciones', 'El borde de grano es más blando'],
      correct: 0,
      explain: 'Más borde de grano por unidad de volumen = más obstáculos para las dislocaciones = mayor límite elástico y dureza.',
    },
    {
      id: 'q8-13', unit: 'u8', topic: 'grano', type: 'mcq',
      q: 'Para obtener grano fino en una colada conviene:',
      options: ['Solidificar rápido y agregar inoculantes', 'Solidificar lento y sin impurezas', 'Aumentar el tamaño de la pieza', 'Disminuir el subenfriamiento'],
      correct: 0,
      explain: 'Enfriar rápido deja menos tiempo para el crecimiento y los inoculantes generan muchos núcleos: ambos caminos llevan a grano fino.',
    },
    {
      id: 'q8-14', unit: 'u8', topic: 'grano', type: 'mcq',
      q: 'Un metal de grano fino comparado con uno de grano grueso tendrá:',
      options: ['Mayor límite elástico y dureza, con algo menos de ductilidad', 'Menor límite elástico y mayor ductilidad', 'Las mismas propiedades mecánicas', 'Mayor módulo de Young'],
      correct: 0,
      explain: 'El borde de grano refuerza a costa de algo de ductilidad. El módulo E no depende del tamaño de grano.',
    },
    {
      id: 'q8-15', unit: 'u8', topic: 'chvorinov', type: 'mcq',
      q: 'La regla de Chvorinov establece que el tiempo de solidificación depende de:',
      options: ['La relación V/A entre el volumen a enfriar y la superficie de extracción de calor', 'Sólo del volumen de la pieza', 'Sólo de la temperatura del metal', 'La dureza del molde'],
      correct: 0,
      explain: 'ts = B·(V/A)ⁿ. V es el calor a eliminar y A la superficie disponible para eliminarlo; la relación manda.',
    },
    {
      id: 'q8-16', unit: 'u8', topic: 'chvorinov', type: 'mcq',
      q: 'El exponente n de la regla de Chvorinov vale generalmente:',
      options: ['2', '1', '3', '0,5'],
      correct: 0,
      explain: 'n ≈ 2, por eso la forma más usada es ts = B·V²/A². Si el enunciado no aclara n, se usa 2.',
    },
    {
      id: 'q8-17', unit: 'u8', topic: 'chvorinov', type: 'mcq',
      q: 'La constante B del molde depende de:',
      options: ['Las propiedades y temperaturas iniciales del metal y del molde', 'Sólo del volumen de la pieza', 'La forma geométrica de la pieza', 'El área de la pieza'],
      correct: 0,
      explain: 'B caracteriza el sistema metal–molde (materiales y temperaturas iniciales), no la geometría de la pieza. Sus unidades: min/cm² o min/mm².',
    },
    {
      id: 'q8-18', unit: 'u8', topic: 'chvorinov', type: 'mcq',
      q: 'Si B está en min/cm² y las medidas de la pieza están en mm, antes de aplicar Chvorinov hay que:',
      options: ['Pasar V y A a cm, para que V/A quede en cm', 'Dejar todo en mm y multiplicar por 10', 'Pasar B a min/mm² dividiendo por 1000', 'No hace falta convertir: el resultado sale igual'],
      correct: 0,
      explain: 'La unidad de V/A debe coincidir con la de B. Mezclar unidades cambia el resultado por 100 y es el error más caro del ejercicio.',
    },
    {
      id: 'q8-19', unit: 'u8', topic: 'chvorinov', type: 'mcq',
      q: 'A igual volumen, ¿qué forma solidifica última?',
      options: ['La esfera, porque tiene la menor superficie y la mayor V/A', 'La placa delgada, porque tiene mucha superficie', 'El cubo, siempre', 'Todas tardan lo mismo'],
      correct: 0,
      explain: 'La esfera minimiza el área para un volumen dado: máximo V/A y máximo tiempo. La placa delgada es el otro extremo.',
    },
    {
      id: 'q8-20', unit: 'u8', topic: 'chvorinov', type: 'mcq',
      q: 'La mazarota debe tener:',
      options: ['Mayor V/A que la pieza, para solidificar después y seguir alimentando', 'Menor V/A que la pieza, para solidificar primero', 'La misma V/A que la pieza', 'Mayor área y menor volumen'],
      correct: 0,
      explain: 'Solidificar última es la condición para alimentar la contracción. Si la mazarota solidifica antes, la pieza queda con rechupe interno.',
    },
    {
      id: 'q8-21', unit: 'u8', topic: 'formas', type: 'mcq',
      q: 'Para un cubo de lado a, la relación V/A es:',
      options: ['a/6', 'a/3', 'a/2', '6a'],
      correct: 0,
      explain: 'V = a³ y A = 6a²; al dividir queda a/6. Es el atajo más usado en los ejercicios inversos.',
    },
    {
      id: 'q8-22', unit: 'u8', topic: 'formas', type: 'mcq',
      q: 'El área total de un cilindro de radio r y altura h es:',
      options: ['2πr² + 2πrh', 'πr² + 2πrh', '2πrh', '4πr²'],
      correct: 0,
      explain: 'Dos tapas (2πr²) más la superficie lateral (2πrh). Olvidar las tapas es el error más común del ejercicio.',
    },
    {
      id: 'q8-23', unit: 'u8', topic: 'formas', type: 'mcq',
      q: 'El volumen de una esfera de radio r es:',
      options: ['(4/3)πr³', '4πr²', 'πr²h', '(1/3)πr³'],
      correct: 0,
      explain: 'V = (4/3)πr³ y A = 4πr². Su relación V/A = r/3 es máxima entre las figuras básicas.',
    },
    {
      id: 'q8-24', unit: 'u8', topic: 'formas', type: 'mcq',
      q: 'El área de un prisma de lados a, b y c es:',
      options: ['2(ab + bc + ac)', 'a·b·c', 'ab + bc + ac', '6a²'],
      correct: 0,
      explain: 'Tiene seis caras en tres pares iguales: 2(ab) + 2(bc) + 2(ac).',
    },
    {
      id: 'q8-25', unit: 'u8', topic: 'formas', type: 'mcq',
      q: 'Si dos piezas se cuelan en el mismo molde, la relación de tiempos es:',
      options: ['ts1/ts2 = ((V/A)₁/(V/A)₂)²', 'ts1/ts2 = (V/A)₁/(V/A)₂', 'ts1/ts2 = (V₁/V₂)', 'ts1 + ts2 = B'],
      correct: 0,
      explain: 'Al dividir las dos ecuaciones de Chvorinov se cancela B y queda el cociente de relaciones al cuadrado.',
    },
    {
      id: 'q8-26', unit: 'u8', topic: 'formas', type: 'mcq',
      q: 'En un cilindro, la relación V/A se puede escribir como:',
      options: ['r·h / [2(r + h)]', 'r/3', 'a/6', 'πr²h'],
      correct: 0,
      explain: 'V/A = πr²h/[2πr(r+h)] = r·h/[2(r+h)]. Sirve para chequear rápido sin calcular todos los decimales.',
    },
    {
      id: 'q8-27', unit: 'u8', topic: 'chvorinov', type: 'num',
      q: 'Un cubo de 10 cm de lado se cuela con B = 3,5 min/cm². ¿Cuál es su volumen? (cm³)',
      answer: 1000, tolerance: 1, answerUnit: 'cm³',
      steps: ['V = a³', 'V = 10³', 'V = 1000 cm³'],
      explain: 'Primer paso del ejercicio: identificar la figura y calcular V. Después A = 6a² = 600 cm².',
    },
    {
      id: 'q8-28', unit: 'u8', topic: 'chvorinov', type: 'num',
      q: 'Un cubo de 10 cm de lado, B = 3,5 min/cm². ¿Cuál es su tiempo de solidificación? (min)',
      answer: 9.72, tolerance: 0.08, answerUnit: 'min',
      steps: ['V = 1000 cm³ · A = 600 cm²', 'V/A = 1,6667 cm', 'ts = 3,5 × (1,6667)² = 3,5 × 2,7778', 'ts ≈ 9,72 min'],
      explain: 'Es el ejercicio tipo. Verificación rápida: un cubo de 10 cm con B = 3,5 debe dar alrededor de 9,7 min.',
    },
    {
      id: 'q8-29', unit: 'u8', topic: 'chvorinov', type: 'num',
      q: 'Cilindro D = 10 cm y h = 20 cm. ¿Cuál es su volumen? (cm³)',
      answer: 1570.8, tolerance: 3, answerUnit: 'cm³',
      steps: ['r = D/2 = 5 cm', 'V = πr²h = π × 25 × 20', 'V ≈ 1570,8 cm³'],
      explain: 'Con π ≈ 3,1416. Si usás π = 3 el volumen da 1500 cm³ y el tiempo cambia.',
    },
    {
      id: 'q8-30', unit: 'u8', topic: 'chvorinov', type: 'num',
      q: 'Cilindro D = 10 cm y h = 20 cm. ¿Cuál es su área total? (cm²)',
      answer: 785.4, tolerance: 2, answerUnit: 'cm²',
      steps: ['r = 5 cm', 'A = 2πr² + 2πrh', 'A = 157,1 + 628,3', 'A ≈ 785,4 cm²'],
      explain: 'Incluye las dos tapas (157,1 cm²) y la superficie lateral (628,3 cm²).',
    },
    {
      id: 'q8-31', unit: 'u8', topic: 'chvorinov', type: 'num',
      q: 'Ese cilindro (D = 10, h = 20) se cuela con B = 3,5 min/cm². ¿Cuánto tarda en solidificar? (min)',
      answer: 14, tolerance: 0.15, answerUnit: 'min',
      steps: ['V = 1570,8 cm³ · A = 785,4 cm²', 'V/A = 2,00 cm', 'ts = 3,5 × 2²', 'ts = 14,0 min'],
      explain: 'Tarda más que el cubo de 10 cm porque su V/A es mayor (2,00 vs. 1,67).',
    },
    {
      id: 'q8-32', unit: 'u8', topic: 'chvorinov', type: 'num',
      q: 'Prisma de 6 × 8 × 10 cm. ¿Cuál es su volumen? (cm³)',
      answer: 480, tolerance: 0.6, answerUnit: 'cm³',
      steps: ['V = a·b·c', 'V = 6 × 8 × 10', 'V = 480 cm³'],
      explain: 'Es la figura «tipo caja» que puede tomar el examen.',
    },
    {
      id: 'q8-33', unit: 'u8', topic: 'chvorinov', type: 'num',
      q: 'Prisma de 6 × 8 × 10 cm. ¿Cuál es su área total? (cm²)',
      answer: 376, tolerance: 0.6, answerUnit: 'cm²',
      steps: ['A = 2(ab + bc + ac)', 'A = 2(48 + 80 + 60)', 'A = 2 × 188', 'A = 376 cm²'],
      explain: 'Tres pares de caras: 6×8 = 48, 8×10 = 80 y 6×10 = 60.',
    },
    {
      id: 'q8-34', unit: 'u8', topic: 'chvorinov', type: 'num',
      q: 'El prisma de 6 × 8 × 10 cm con B = 3,5 min/cm². ¿Cuánto tarda? (min)',
      answer: 5.7, tolerance: 0.06, answerUnit: 'min',
      steps: ['V = 480 cm³ · A = 376 cm²', 'V/A = 1,2766 cm', 'ts = 3,5 × (1,2766)²', 'ts ≈ 5,70 min'],
      explain: 'Es el más «chato» de los ejemplos: tiene mucha superficie para su volumen, por eso solidifica antes.',
    },
    {
      id: 'q8-35', unit: 'u8', topic: 'chvorinov', type: 'num',
      q: 'Un cubo de 100 mm de lado se cuela con B = 2 min/cm². ¿Cuál es ts? (min)',
      answer: 5.56, tolerance: 0.06, answerUnit: 'min',
      steps: ['En mm: V = 1.000.000 mm³ · A = 60.000 mm²', 'V/A = 16,67 mm = 1,667 cm', 'ts = 2 × (1,667)²', 'ts ≈ 5,56 min'],
      explain: 'La trampa es no convertir: si dejás V/A en mm con B en min/cm², el resultado se va por 100 (555 min).',
    },
    {
      id: 'q8-36', unit: 'u8', topic: 'chvorinov', type: 'num',
      q: 'Se necesita un cubo que solidifique en 16 min con B = 4 min/cm². ¿Cuánto debe medir su lado? (cm)',
      answer: 12, tolerance: 0.1, answerUnit: 'cm',
      steps: ['(V/A)² = ts/B = 16/4 = 4', 'V/A = 2 cm', 'Para el cubo V/A = a/6', 'a = 6 × 2 = 12 cm'],
      explain: 'Ejercicio inverso típico: primero despejás V/A y después usás la geometría de la figura.',
    },
    {
      id: 'q8-37', unit: 'u8', topic: 'chvorinov', type: 'num',
      q: 'Una pieza de 1500 cm³ debe solidificar en 9 min con B = 2,5 min/cm². ¿Qué área de molde necesita? (cm²)',
      answer: 790.6, tolerance: 6, answerUnit: 'cm²',
      steps: ['(V/A)² = 9/2,5 = 3,6', 'V/A = √3,6 = 1,897 cm', 'A = V/(V/A) = 1500/1,897', 'A ≈ 790,6 cm²'],
      explain: 'Es el inverso que pidió el profesor: «sacar el área del molde». Si la pieza no tiene esa superficie, hay que cambiar la forma.',
    },
    {
      id: 'q8-38', unit: 'u8', topic: 'chvorinov', type: 'num',
      q: 'Se midió un cubo de 12 cm que solidificó en 14 min. ¿Cuál es la constante B del molde? (min/cm²)',
      answer: 3.5, tolerance: 0.05, answerUnit: 'min/cm²',
      steps: ['V = 1728 cm³ · A = 864 cm²', 'V/A = 2 cm', 'B = ts/(V/A)² = 14/4', 'B = 3,5 min/cm²'],
      explain: 'B caracteriza el molde: no depende de la forma. Con ese B, un cubo de 10 cm daría 9,7 min.',
    },
    {
      id: 'q8-39', unit: 'u8', topic: 'chvorinov', type: 'num',
      q: 'Una esfera tiene 2000 cm³. ¿Cuál es su relación V/A? (cm)',
      answer: 2.605, tolerance: 0.03, answerUnit: 'cm',
      steps: ['r = (3V/4π)^(1/3) = (6000/12,566)^(1/3) = 7,816 cm', 'A = 4πr² = 767,7 cm²', 'V/A = 2000/767,7', 'V/A ≈ 2,605 cm'],
      explain: 'La esfera tiene la menor área para ese volumen: por eso su V/A es la mayor de las cuatro figuras.',
    },
    {
      id: 'q8-40', unit: 'u8', topic: 'chvorinov', type: 'num',
      q: 'Placa de 20×20×5 cm y esfera de 2000 cm³, mismo B = 3,5. ¿Cuántas veces más tarda la esfera?',
      answer: 2.44, tolerance: 0.05, answerUnit: 'veces',
      steps: ['Placa: A = 1200 cm² · V/A = 1,667 cm', 'Esfera: r = 7,816 cm · A = 767,7 cm² · V/A = 2,605 cm', 'Relación = (2,605/1,667)² = (1,5628)²', '≈ 2,44 veces'],
      explain: 'Con el atajo ts1/ts2 = ((V/A)₁/(V/A)₂)² no hace falta calcular los tiempos por separado.',
    },
    {
      id: 'q8-41', unit: 'u8', topic: 'chvorinov', type: 'num',
      q: 'Una esfera debe solidificar en 20 min con B = 2,5 min/cm². ¿Qué diámetro necesita? (cm)',
      answer: 16.97, tolerance: 0.15, answerUnit: 'cm',
      steps: ['(V/A)² = 20/2,5 = 8', 'V/A = 2,828 cm', 'Para la esfera V/A = r/3 → r = 8,485 cm', 'D = 2r = 16,97 cm'],
      explain: 'Inverso avanzado: despejás V/A de Chvorinov y lo igualás a la expresión geométrica de la figura.',
    },
    {
      id: 'q8-42', unit: 'u8', topic: 'formas', type: 'mcq',
      q: 'Si por error usás el diámetro como radio en un cilindro, el volumen te queda:',
      options: ['4 veces mayor', '2 veces mayor', 'La mitad', 'Igual'],
      correct: 0,
      explain: 'V = πr²h: si en lugar de r usás 2r, el cuadrado da 4 veces más volumen. Por eso siempre r = D/2.',
    },
    {
      id: 'q8-43', unit: 'u8', topic: 'chvorinov', type: 'mcq',
      q: 'Una pieza con V/A muy grande (por ejemplo un lingote macizo) comparada con una chapa fina:',
      options: ['Tarda mucho más en solidificar y su grano es más grueso', 'Solidifica antes y tiene grano fino', 'Tarda lo mismo', 'No solidifica'],
      correct: 0,
      explain: 'Tiene poco superficie para evacuar el calor. La chapa fina, con mucha A, se enfría rápido y queda con grano fino.',
    },
    {
      id: 'q8-44', unit: 'u8', topic: 'chvorinov', type: 'mcq',
      q: 'La verificación «un cubo de 10 cm con B = 3,5 debe dar ≈ 9,7 min» sirve para:',
      options: ['Detectar un error de unidades o de fórmula', 'Calcular B con precisión', 'Demostrar que la esfera tarda más', 'Medir la dureza del molde'],
      correct: 0,
      explain: 'Es un control rápido: si el resultado da 970 min hay un error de unidades; si da 5 min, probablemente se usó A mal.',
    },
    {
      id: 'q8-45', unit: 'u8', topic: 'grano', type: 'mcq',
      q: 'Un enfriamiento muy lento produce:',
      options: ['Granos más grandes y menor resistencia', 'Granos más finos y mayor dureza', 'El mismo grano', 'Mayor cantidad de borde de grano'],
      correct: 0,
      explain: 'Con más tiempo, los granos crecen y se encuentran menos veces: menos borde de grano y menor resistencia.',
    },
    {
      id: 'q8-46', unit: 'u8', topic: 'enfriamiento', type: 'mcq',
      q: '¿Cuál es el orden correcto de las tres etapas de la curva de enfriamiento de un metal puro?',
      options: [
        'Líquido enfriándose → estabilización térmica en Tf → sólido enfriándose',
        'Sólido enfriándose → estabilización térmica → líquido enfriándose',
        'Estabilización térmica → líquido → sólido',
        'Líquido → sólido → estabilización térmica',
      ],
      correct: 0,
      explain: 'Primero baja la temperatura del líquido, después se mantiene en Tf mientras solidifica y al final baja la del sólido.',
    },
    {
      id: 'q8-47', unit: 'u8', topic: 'enfriamiento', type: 'mcq',
      q: 'En el tramo de líquido sobrecalentado, ¿qué calor se elimina?',
      options: ['Calor específico del líquido', 'Sólo calor latente de fusión', 'Calor específico del sólido', 'No se elimina calor'],
      correct: 0,
      explain: 'El metal está 100 % líquido: baja su temperatura y se extrae calor sensible (Q = m·c·ΔT) del líquido.',
    },
    {
      id: 'q8-48', unit: 'u8', topic: 'enfriamiento', type: 'mcq',
      q: 'Durante la meseta de solidificación, la temperatura se mantiene constante porque:',
      options: [
        'Se elimina únicamente calor latente de fusión',
        'No se extrae calor del metal',
        'El metal ya es 100 % sólido',
        'La rapidez de enfriamiento se vuelve infinita',
      ],
      correct: 0,
      explain: 'El calor extraído se usa para el cambio de estado, no para bajar la temperatura. Mientras coexisten líquido y sólido, T = Tf.',
    },
    {
      id: 'q8-49', unit: 'u8', topic: 'enfriamiento', type: 'mcq',
      q: 'En la meseta de la curva de enfriamiento coexisten:',
      options: ['Líquido y sólido', 'Sólo líquido', 'Sólo sólido', 'Vapor y líquido'],
      correct: 0,
      explain: 'Es la estabilización térmica: parte del metal ya solidificó y parte sigue líquida; por eso se llama zona bifásica.',
    },
    {
      id: 'q8-50', unit: 'u8', topic: 'enfriamiento', type: 'mcq',
      q: 'El tiempo de solidificación local se mide:',
      options: [
        'Desde que empieza hasta que termina la solidificación, y sólo incluye calor latente',
        'Desde el vaciado hasta el final, e incluye el líquido sobrecalentado',
        'Desde el final de la solidificación hasta el enfriamiento del sólido',
        'Sólo el tiempo de llenado del molde',
      ],
      correct: 0,
      explain: 'El local es la duración de la meseta: inicio → fin de solidificación. El calor eliminado en ese tramo es sólo latente.',
    },
    {
      id: 'q8-51', unit: 'u8', topic: 'enfriamiento', type: 'mcq',
      q: 'El tiempo de solidificación total se mide:',
      options: [
        'Desde el vaciado hasta que se completa la solidificación, incluyendo el calor específico del líquido sobrecalentado + el latente',
        'Sólo desde el inicio hasta el fin de la meseta',
        'Desde que el metal es 100 % sólido hasta que se enfría a ambiente',
        'El tiempo que tarda el molde en llenarse',
      ],
      correct: 0,
      explain: 'El total arranca en el vaciado, así que suma el enfriamiento del líquido sobrecalentado (calor sensible) y el calor latente de la meseta.',
    },
    {
      id: 'q8-52', unit: 'u8', topic: 'enfriamiento', type: 'mcq',
      q: 'La rapidez de enfriamiento se calcula como:',
      options: ['ΔT/Δt (pendiente de la curva T–t)', 'Δt/ΔT', 'm·Lf', 'B·(V/A)²'],
      correct: 0,
      explain: 'Es la pendiente de la curva: cuántos grados baja por unidad de tiempo. Más empinada = más rápido.',
    },
    {
      id: 'q8-53', unit: 'u8', topic: 'enfriamiento', type: 'mcq',
      q: 'En el tramo final, cuando el metal ya es 100 % sólido, se elimina:',
      options: ['Calor específico del sólido', 'Sólo calor latente de fusión', 'Calor específico del líquido', 'Calor latente de vaporización'],
      correct: 0,
      explain: 'Ya no hay cambio de estado: la temperatura del sólido baja y se extrae calor sensible del sólido.',
    },
    {
      id: 'q8-54', unit: 'u8', topic: 'enfriamiento', type: 'mcq',
      q: '¿Por qué el tiempo total es mayor que el local?',
      options: [
        'Porque el total incluye el enfriamiento del líquido sobrecalentado antes de llegar a Tf',
        'Porque el local incluye el enfriamiento del sólido',
        'Porque el total se mide en otra escala',
        'En realidad el total siempre es menor',
      ],
      correct: 0,
      explain: 'El total empieza en el vaciado; el local empieza recién cuando comienza la solidificación. La diferencia es el tramo de líquido.',
    },
    {
      id: 'q8-55', unit: 'u8', topic: 'enfriamiento', type: 'mcq',
      q: 'Si la curva de enfriamiento de un metal es más empinada que la de otro, significa que:',
      options: ['Se enfría más rápido (mayor ΔT/Δt)', 'Se enfría más lento', 'Tiene mayor calor latente', 'Solidifica a mayor temperatura'],
      correct: 0,
      explain: 'La pendiente es la rapidez de enfriamiento: más empinada, más grados por unidad de tiempo.',
    },
    {
      id: 'q8-56', unit: 'u8', topic: 'enfriamiento', type: 'num',
      q: 'El líquido pasa de 720 °C a 660 °C en 2 minutos. ¿Cuál es la rapidez de enfriamiento? (°C/min)',
      answer: 30, tolerance: 0.6, answerUnit: '°C/min',
      steps: ['ΔT = 720 − 660 = 60 °C', 'Δt = 2 min', 'Rapidez = ΔT/Δt = 60/2', 'Rapidez = 30 °C/min'],
      explain: 'La rapidez es la pendiente de la curva. Si el tramo fuera más empinado, el valor sería mayor.',
    },
    {
      id: 'q8-57', unit: 'u8', topic: 'enfriamiento', type: 'num',
      q: 'La solidificación comienza a los 4 min y termina a los 9 min. ¿Cuál es el tiempo de solidificación local? (min)',
      answer: 5, tolerance: 0.2, answerUnit: 'min',
      steps: ['t_local = t_fin − t_inicio', 't_local = 9 − 4', 't_local = 5 min'],
      explain: 'El local es sólo la meseta: desde que empieza hasta que termina la solidificación.',
    },
    {
      id: 'q8-58', unit: 'u8', topic: 'enfriamiento', type: 'num',
      q: 'El metal se vierte en t = 0, empieza a solidificar a los 4 min y termina a los 9 min. ¿Cuál es el tiempo total de solidificación? (min)',
      answer: 9, tolerance: 0.2, answerUnit: 'min',
      steps: ['t_total = t_fin − t_vaciado', 't_total = 9 − 0', 't_total = 9 min (no 5: el total incluye el líquido sobrecalentado)'],
      explain: 'La trampa es restar sólo la meseta. El total arranca en el vaciado, por eso son 9 min y no 5.',
    },
  ],
};

  __CDM_MODULES__["data/u8.js"] = { u8 };
})();

/* ===== data/u9.js ===== */
(function () {
  "use strict";
/* ============================================================
   data/u9.js — Unidad 9: Equilibrio de Fases y Solución Sólida
   Fuente: resumen de cátedra "Parcial 2 — Unidades 6 a 10"
   (páginas 49 a 61) + apuntes del usuario (diagrama isomorfo
   y curva de enfriamiento de la aleación).
   ============================================================ */

const u9 = {
  id: 'u9',
  number: 9,
  title: 'Equilibrio de Fases y Solución Sólida',
  shortTitle: 'Fases y palanca',
  subtitle: 'Solubilidad, diagrama isomorfo y regla de la palanca',
  tag: 'Va seguro',
  examQuote: '«Lo que es la regla de gases (Gibbs) no va en el parcial. Lo que sí va a tomar sí o sí es condiciones para la solubilidad sólida limitada; también la regla de la palanca es importante y la toma casi seguro.»',
  intro:
    'La unidad enseña a leer el mapa de una aleación: el diagrama de fases. Ese mapa dice qué fases hay, ' +
    'de qué composición son y en qué cantidad (eso último se calcula con la regla de la palanca). ' +
    'El profesor confirmó que Gibbs no entra, pero la palanca y las condiciones de solubilidad son de examen.',
  priority: [
    'Fase y diagrama de fases en equilibrio.',
    'Tipos de solubilidad con ejemplos: ilimitada (Ni–Cu), limitada (Zn–Cu) y nula (Cu–Pb).',
    'Las 4 condiciones de Hume-Rothery para solubilidad ilimitada y por qué la real es limitada.',
    'Endurecimiento por solución sólida: factores y efectos en las propiedades.',
    'Diagrama isomorfo Cu–Ni: liquidus, solidus, L + α y rango de solidificación.',
    'Regla de la palanca: %L y %S, control 100 % y masa de cada fase.',
    'Curva de enfriamiento de la aleación isomorfa y su diferencia con la del metal puro.',
    'Microsegregación (homogeneización) y macrosegregación (trabajo en caliente).',
  ],
  notPriority: 'Regla de fases de Gibbs (F = C − P + 2): confirmado que no entra. El resto de la unidad sí.',

  lessons: [
    {
      id: 'u9-fases',
      unit: 'u9',
      title: 'Fase y diagrama de fases',
      kicker: 'Qué es una fase',
      minutes: 4,
      goal: 'Definir fase con sus tres condiciones y explicar qué representa un diagrama de equilibrio.',
      blocks: [
        {
          t: 'p',
          html: 'Una <b>fase</b> es una porción del material que es igual a sí misma en todo su volumen. Si al microscopio ves dos zonas con distinta composición o estructura, son dos fases, aunque las dos sean sólidas. El <b>diagrama de fases</b> es el mapa que dice cuáles hay para cada temperatura y composición.',
        },
        {
          t: 'ol',
          items: [
            '<b>Misma estructura:</b> el arreglo atómico es igual en toda esa porción.',
            '<b>Misma composición y propiedades aproximadas:</b> no hay saltos internos de composición.',
            '<b>Interface definida:</b> entre esa fase y cualquier otra hay una superficie de separación clara.',
          ],
        },
        {
          t: 'callout',
          tone: 'info',
          title: 'Gibbs no entra',
          html: 'La regla de fases de Gibbs, <b>F = C − P + 2</b>, está confirmada como <b>fuera del parcial</b>. Sabé que existe y para qué sirve, pero no pierdas tiempo aplicándola.',
        },
        {
          t: 'p',
          html: 'Un diagrama binario de equilibrio tiene <b>temperatura</b> en el eje vertical y <b>composición</b> en el horizontal. Las líneas separan las zonas monofásicas (una sola fase) de las bifásicas (dos fases). Para leerlo se usa una <b>isoterma</b>: una horizontal a la temperatura que te interesa.',
        },
        {
          t: 'callout',
          tone: 'prof',
          title: 'Qué busca el profesor',
          html: 'La definición de fase con las <b>tres condiciones juntas</b>. Si falta una, no es una fase. Y que sepas que el diagrama es el mapa de fases en equilibrio, no una foto de lo que pasa con enfriamiento rapidísimo.',
        },
      ],
      keyPoints: [
        'Fase = misma estructura + misma composición/propiedades + interface definida.',
        'Dos sólidos con distinta composición son dos fases distintas.',
        'Diagrama de fases: mapa T vs. composición; las líneas separan zonas de 1 y 2 fases.',
        'Gibbs no entra; la palanca sí.',
      ],
    },

    {
      id: 'u9-solubilidad',
      unit: 'u9',
      title: 'Tipos de solubilidad y ejemplos',
      kicker: 'Ilimitada, limitada y nula',
      minutes: 5,
      goal: 'Distinguir los tres tipos de solubilidad, dar el ejemplo de cátedra de cada uno y reconocerlos en el diagrama.',
      blocks: [
        {
          t: 'p',
          html: 'Cuando mezclás dos metales, el soluto puede entrar en la red del solvente (solución sólida) o no. Si entran en <b>cualquier proporción</b>, la solubilidad es ilimitada. Si entran <b>solo hasta un máximo</b>, es limitada: pasado ese límite aparece una segunda fase. Y si directamente <b>no se mezclan</b>, cada uno forma su propia fase.',
        },
        {
          t: 'table',
          head: ['Tipo', 'Qué pasa', 'Ejemplo de cátedra'],
          rows: [
            ['<b>Ilimitada</b>', 'El soluto se disuelve en cualquier proporción: una sola fase sólida α con estructura y composición única.', '<b>Ni–Cu</b> (níquel en cobre)'],
            ['<b>Limitada</b>', 'Se disuelve hasta un máximo (solvus). Con exceso aparecen dos fases: α saturada + β.', '<b>Zn–Cu</b> (latones); <b>Pb–Sn</b>'],
            ['<b>Nula</b>', 'No se mezclan: cada componente forma su propia fase.', '<b>Cu–Pb</b> en estado sólido (o aceite y agua)'],
          ],
        },
        {
          t: 'p',
          html: 'En el diagrama, la solubilidad ilimitada muestra solo <b>liquidus</b> y <b>solidus</b>, con una única fase sólida α debajo. La limitada agrega una tercera línea, el <b>solvus</b>, que marca el máximo de soluto que admite α a cada temperatura; pasado ese límite se entra en <b>α + β</b>. La nula directamente muestra dos fases separadas.',
        },
        {
          t: 'callout',
          tone: 'trap',
          title: 'Limitada ≠ nula',
          html: 'En la limitada el soluto <b>sí entra</b>, pero hasta un máximo. En la nula no entra nada: son dos fases separadas. El error clásico es decir que Zn–Cu «no se mezcla»; el zinc sí se disuelve en el cobre, hasta ≈ 35 %.',
        },
        {
          t: 'p',
          html: 'Ejemplos para fijar: el <b>Pb–Sn</b> de las soldaduras disuelve estaño en plomo hasta ≈ <b>19 %</b> a 183 °C; con más estaño aparecen α + β. El <b>Zn–Cu</b> disuelve zinc en cobre hasta ≈ <b>35 %</b> (fase α); con más zinc aparece β, más dura y frágil. Ese es el origen del endurecimiento por solución sólida.',
        },
      ],
      keyPoints: [
        'Ilimitada: cualquier proporción, una sola fase sólida. Ejemplo: Ni–Cu.',
        'Limitada: hasta un máximo (solvus); después α + β. Ejemplos: Zn–Cu y Pb–Sn.',
        'Nula: no se mezclan; cada uno forma su fase. Ejemplo: Cu–Pb.',
        'La solubilidad limitada se reconoce por la tercera línea: el solvus.',
      ],
    },

    {
      id: 'u9-hume-rothery',
      unit: 'u9',
      title: 'Condiciones para solubilidad ilimitada',
      kicker: 'Hume-Rothery',
      minutes: 5,
      goal: 'Enunciar las cuatro condiciones, explicar qué pasa cuando falla cada una y cerrar con el solvus.',
      blocks: [
        {
          t: 'p',
          html: 'Para que un átomo entre cómodo en la red de otro, tienen que parecerse. Las <b>reglas de Hume-Rothery</b> se enuncian como condiciones para la <b>solubilidad ilimitada</b>; cuando alguna falla, la solubilidad pasa a ser <b>limitada</b>.',
        },
        {
          t: 'table',
          head: ['Condición', 'Para solubilidad ilimitada se exige…', 'Si no se cumple → limitada porque…'],
          rows: [
            ['<b>Tamaño atómico</b>', 'Átomos de tamaño similar: diferencia <b>&lt; 15 %</b>.', 'La red se distorsiona y solo admite soluto hasta cierto porcentaje.'],
            ['<b>Estructura cristalina</b>', 'La <b>misma</b> estructura cristalina.', 'No hay sitios compatibles; la solubilidad cae mucho.'],
            ['<b>Valencia</b>', 'La <b>misma valencia</b>.', 'Se generan electrones o vacancias de más y se limita la cantidad soluble.'],
            ['<b>Electronegatividad</b>', 'Electronegatividad <b>parecida</b>.', 'Tienden a formar compuestos intermetálicos en vez de solución sólida.'],
          ],
        },
        {
          t: 'p',
          html: 'Además de las reglas hay una <b>causa térmica</b>: incluso cumpliéndolas, la solubilidad máxima existe a una temperatura dada y <b>disminuye al bajar la temperatura</b>. Por eso el <b>solvus</b> marca el límite y, por debajo de él, el exceso de soluto precipita como segunda fase. Ese es el origen del endurecimiento por dispersión de la Unidad 10.',
        },
        {
          t: 'callout',
          tone: 'prof',
          title: 'Respuesta de examen',
          html: 'Enunciá las <b>cuatro condiciones</b>, decí qué pasa si falla cada una y cerrá con: «por eso aparece el solvus y, pasado el límite, una segunda fase». Esa es la respuesta completa a «condiciones para la solubilidad sólida limitada».',
        },
        {
          t: 'callout',
          tone: 'trap',
          title: 'No confundir Hume-Rothery con Gibbs',
          html: 'Hume-Rothery son las <b>condiciones físicas</b> para que el soluto entre (tamaño, estructura, valencia, electronegatividad). Gibbs es la regla de grados de libertad, que <b>no entra</b>.',
        },
      ],
      keyPoints: [
        'Tamaño < 15 % · misma estructura · misma valencia · electronegatividad parecida.',
        'Si falla una → solubilidad limitada, no ilimitada.',
        'Electronegatividades muy distintas → compuesto intermetálico.',
        'El solvus baja con la temperatura: el exceso precipita como 2.ª fase.',
      ],
    },

    {
      id: 'u9-solucion-solida',
      unit: 'u9',
      title: 'Endurecimiento por solución sólida',
      kicker: 'Átomos que frenan dislocaciones',
      minutes: 4,
      goal: 'Explicar el mecanismo, los dos factores que lo aumentan y los cuatro efectos sobre las propiedades.',
      blocks: [
        {
          t: 'p',
          html: 'Ocurre cuando el aleante entra como <b>átomo sustitucional</b> en la red del metal base. El átomo distinto <b>deforma la red</b> y dificulta el movimiento de las dislocaciones: la aleación queda más resistente que el metal puro. Es como poner una piedra en el camino de las dislocaciones.',
        },
        {
          t: 'ol',
          items: [
            '<b>Diferencia de tamaño atómico:</b> a mayor diferencia, más distorsión y más endurecimiento.',
            '<b>Cantidad de aleante:</b> cuanto más se agrega, mayor es el efecto, siempre hasta el límite de solubilidad.',
          ],
        },
        {
          t: 'ul',
          items: [
            'Suben la <b>tensión de fluencia</b>, la <b>tensión de rotura</b> y la <b>dureza</b> respecto del metal puro.',
            'Baja la <b>ductilidad</b>.',
            'Baja mucho la <b>conductividad eléctrica</b>: los átomos extraños dispersan los electrones.',
            'Mejora la <b>resistencia a la termofluencia</b>.',
          ],
        },
        {
          t: 'p',
          html: 'Ejemplo: el <b>latón</b> (Zn en Cu) es más duro que el cobre porque cada átomo de Zn distorsiona la red y frena las dislocaciones. Hasta ≈ 35 % de Zn queda una sola fase α; si se sigue agregando aparece β, más dura y frágil. Es endurecimiento por solución sólida puro.',
        },
        {
          t: 'callout',
          tone: 'info',
          title: 'No es dispersión',
          html: 'Acá el soluto está <b>disuelto en la red</b>, átomo por átomo. En la Unidad 10, el endurecimiento por dispersión usa <b>partículas</b> de otra fase. Son mecanismos distintos.',
        },
      ],
      keyPoints: [
        'Átomo sustitucional distorsiona la red y frena dislocaciones.',
        'Depende de la diferencia de tamaño y de la cantidad de aleante (hasta el límite).',
        'Sube σy, σut y dureza; baja ductilidad y conductividad; mejora termofluencia.',
        'Ejemplo: Zn en Cu (latón) hasta ≈ 35 %; después aparece β.',
      ],
    },

    {
      id: 'u9-isomorfo',
      unit: 'u9',
      title: 'Diagrama isomorfo Cu–Ni',
      kicker: 'Liquidus, solidus y L + α',
      minutes: 5,
      goal: 'Leer el diagrama isomorfo, ubicar las tres zonas y explicar por qué CL y CS son distintas de CA.',
      blocks: [
        {
          t: 'p',
          html: 'En un diagrama <b>isomorfo</b> los dos componentes son solubles en todo rango: hay una sola fase sólida, α. El Cu y el Ni lo son. El diagrama tiene dos líneas curvas: el <b>liquidus</b> (arriba: todo líquido) y el <b>solidus</b> (abajo: todo sólido α). Entre las dos, líquido y sólido conviven.',
        },
        {
          t: 'table',
          head: ['Zona / línea', 'Qué hay', 'Cómo se lee'],
          rows: [
            ['<b>Liquidus</b>', 'Por encima de la línea: todo líquido L.', 'Al cruzarla empieza a formarse el primer sólido α.'],
            ['<b>Solidus</b>', 'Por debajo de la línea: todo sólido α.', 'Al cruzarla desaparece la última gota de líquido.'],
            ['<b>L + α</b>', 'Entre liquidus y solidus: las dos fases.', 'Se traza una isoterma y se leen CL (liquidus) y CS (solidus).'],
          ],
        },
        {
          t: 'p',
          html: 'La composición global <b>CA</b> es una vertical fija: no cambia al enfriar. Lo que cambia son las composiciones de cada fase: el <b>líquido es más rico en el componente de menor punto de fusión</b> (Cu) y el <b>sólido en el de mayor</b> (Ni). En la zona bifásica, CL y CS se leen sobre la isoterma, una en cada curva. El eje horizontal es <b>% Ni</b>: 0 es Cu puro y 100 es Ni puro.',
        },
        {
          t: 'p',
          html: 'Ejemplo de cátedra: Cu–35 % Ni a 1250 °C. Ojo con el eje: es <b>% en peso de Ni</b>, así que <b>35 % Ni = 65 % Cu</b> (no 35 % Cu). La isoterma corta el liquidus en <b>CL = 32 % Ni (68 % Cu)</b> y el solidus en <b>CS = 43 % Ni (57 % Cu)</b>. La aleación está entre las dos composiciones; por eso hay L + α. El <b>rango de solidificación</b> es la diferencia entre las temperaturas de liquidus y solidus para esa composición.',
        },
        {
          t: 'diagram',
          id: 'isomorfo',
          label: 'Abrir el diagrama Cu–Ni con la isoterma de 1250 °C',
        },
        {
          t: 'callout',
          tone: 'trap',
          title: 'Tres errores clásicos',
          html: '<b>CA no cambia</b> al enfriar. <b>CL</b> se lee en el liquidus y <b>CS</b> en el solidus (no al revés). Y en la zona L + α no hay una sola composición: hay dos, una por fase.',
        },
      ],
      keyPoints: [
        'Isomorfo = solubilidad total; una sola fase sólida α.',
        'Liquidus: arriba todo L; al cruzarlo aparece el primer sólido.',
        'Solidus: debajo todo α; al cruzarlo desaparece el último líquido.',
        'Entre las curvas: L + α; se leen CL y CS con una isoterma.',
        'CA es vertical fija; el líquido es más rico en Cu y el sólido en Ni.',
      ],
    },

    {
      id: 'u9-palanca',
      unit: 'u9',
      title: 'Regla de la palanca: %L y %S',
      kicker: 'La cuenta más probable',
      minutes: 6,
      goal: 'Aplicar las fórmulas de %L y %S, controlar que sumen 100 % y calcular la masa de cada fase.',
      blocks: [
        {
          t: 'p',
          html: 'En la zona de dos fases necesitás saber <b>cuánto hay de cada una</b>. La regla de la palanca es una regla de proporciones: cuanto más cerca está la aleación de una fase, más hay de esa fase. El numerador es la <b>distancia opuesta</b> a la fase que calculás; el denominador es la <b>isoterma completa</b>.',
        },
        {
          t: 'formula',
          expr: '%L = (CS − CA) / (CS − CL) · 100', html: '%L = <span class="frac"><span class="frac__num">(CS − CA)</span><span class="frac__den">(CS − CL)</span></span> · 100',
          note: 'CL en el liquidus, CS en el solidus, CA es la composición global. El numerador es el brazo derecho.',
        },
        {
          t: 'formula',
          expr: '%S = (CA − CL) / (CS − CL) · 100', html: '%S = <span class="frac"><span class="frac__num">(CA − CL)</span><span class="frac__den">(CS − CL)</span></span> · 100',
          note: 'El denominador es siempre CS − CL, la longitud total de la isoterma.',
        },
        {
          t: 'callout',
          tone: 'tip',
          title: 'Control de 2 segundos',
          html: 'Siempre <b>%L + %S = 100 %</b>. Si no da 100, revisá los numeradores. La fase cuya composición está más lejos de CA es la que está en <b>menor</b> cantidad.',
        },
        {
          t: 'p',
          html: 'Ejemplo resuelto: Cu–35 % Ni a 1250 °C, con CL = 32 % y CS = 43 %. La isoterma mide 43 − 32 = <b>11</b>. Entonces %L = (43 − 35)/11 × 100 = 8/11 = <b>72,7 %</b> y %S = (35 − 32)/11 × 100 = 3/11 = <b>27,3 %</b>. Control: 72,7 + 27,3 = 100 %. Hay más líquido porque 35 está más cerca de 32 que de 43.',
        },
        {
          t: 'p',
          html: 'Si piden <b>masa</b>: multiplicá el porcentaje por la masa total. Para 2 kg: mL = 0,727 × 2000 g = <b>1454 g</b> y mS = 0,273 × 2000 g = <b>546 g</b>. La palanca reparte cantidades; <b>no cambia las composiciones</b>: el líquido sigue con 32 % Ni y el sólido con 43 % Ni.',
        },
        {
          t: 'callout',
          tone: 'trap',
          title: 'Los 4 errores que más se pagan',
          html: '1) Invertir los numeradores. 2) Usar otro denominador en vez de <b>CS − CL</b>. 3) Leer CL en el solidus o CS en el liquidus. 4) Olvidar el <b>× 100</b>. En zona monofásica no se aplica: la fase es el 100 %.',
        },
        {
          t: 'diagram',
          id: 'isomorfo',
          label: 'Ver la isoterma y los brazos de la palanca',
        },
        {
          t: 'lab',
          id: 'palanca',
          label: 'Practicar con el simulador de palanca',
        },
      ],
      keyPoints: [
        '%L = (CS − CA)/(CS − CL) × 100.',
        '%S = (CA − CL)/(CS − CL) × 100.',
        'Denominador siempre CS − CL; control %L + %S = 100 %.',
        'La fase más lejana a CA es la menos abundante.',
        'Masa: m = (%/100) × mtotal. La composición de cada fase no cambia.',
      ],
    },

    {
      id: 'u9-curva-aleacion',
      unit: 'u9',
      title: 'Curva de enfriamiento de la aleación',
      kicker: 'Dos quiebres, sin meseta',
      minutes: 5,
      goal: 'Dibujar la curva de una aleación isomorfa y explicar las diferencias con la del metal puro de la U8.',
      blocks: [
        {
          t: 'p',
          html: 'La aleación isomorfa <b>no solidifica a temperatura constante</b>. Su curva de enfriamiento tiene <b>dos cambios de pendiente</b>: uno en el <b>liquidus</b> (aparece el primer sólido α) y otro en el <b>solidus</b> (desaparece el último líquido). Entre los dos, la temperatura sigue bajando por la zona L + α. <b>No hay meseta horizontal.</b> Y no son rectas: la rama del líquido, el tramo L + α y la rama del sólido son curvas.',
        },
        {
          t: 'table',
          head: ['Tramo', 'Metal puro (U8)', 'Aleación isomorfa (U9)'],
          rows: [
            ['Enfriamiento del líquido', 'Baja hasta Tf.', 'Baja hasta el liquidus.'],
            ['Solidificación', 'Ocurre en una <b>meseta horizontal</b> a Tf.', 'Ocurre en un <b>rango</b> entre liquidus y solidus; T sigue bajando.'],
            ['Quiebres de la curva', '<b>Uno</b>: la meseta.', '<b>Dos</b>: liquidus y solidus (cambios de pendiente).'],
            ['Después de solidificar', 'Sólido baja de temperatura.', 'Sólido α baja de temperatura.'],
            ['Tiempo local', 'Duración de la meseta.', 'No hay meseta: el rango se mide entre liquidus y solidus.'],
          ],
        },
        {
          t: 'p',
          html: 'Ejemplo: Cu–40 % Ni. El liquidus está en <b>1280 °C</b> y el solidus en <b>1240 °C</b>. El rango de solidificación es ΔT = 1280 − 1240 = <b>40 °C</b>. La curva baja de 1280 a 1240 sin quedarse horizontal: el calor latente se libera <b>a lo largo de todo el intervalo</b>, no en un solo punto.',
        },
        {
          t: 'callout',
          tone: 'trap',
          title: 'No dibujar una meseta en la U9',
          html: 'La meseta horizontal es de la <b>U8 (metal puro)</b> y de la <b>U10 (eutéctica)</b>. La aleación isomorfa de la U9 tiene <b>dos quiebres</b> y un tramo inclinado L + α. Si dibujás una meseta en la U9, el gráfico está mal.',
        },
        {
          t: 'p',
          html: '¿Por qué cambia la pendiente? En el liquidus empieza a formarse sólido y se libera calor latente: la curva se hace <b>menos empinada</b>. En el solidus se termina el líquido y vuelve a enfriarse sólo el sólido: la pendiente <b>vuelve a aumentar</b>. El profesor toma las curvas de la U8, la U9 y la U10: tenelas las tres bien separadas.',
        },
        {
          t: 'diagram',
          id: 'curva-aleacion',
          label: 'Ver la curva de la aleación con liquidus y solidus',
        },
      ],
      keyPoints: [
        'Aleación isomorfa: dos quiebres (liquidus y solidus), no una meseta.',
        'Entre liquidus y solidus: L + α; la temperatura sigue bajando.',
        'ΔT = TL − TS; ejemplo Cu–40 % Ni: 1280 − 1240 = 40 °C.',
        'El calor latente se libera durante todo el rango, no a T constante.',
        'U8: meseta. U9: rampa con dos quiebres. U10: meseta eutéctica.',
      ],
    },

    {
      id: 'u9-segregacion',
      unit: 'u9',
      title: 'Solidificación fuera de equilibrio: segregación',
      kicker: 'Coring y macro',
      minutes: 4,
      goal: 'Distinguir micro y macrosegregación, explicar por qué se producen y cómo se corrigen.',
      blocks: [
        {
          t: 'p',
          html: 'Si el enfriamiento es demasiado rápido, los átomos no tienen tiempo de difundir y cada zona queda con la composición del momento en que solidificó. El sólido que se forma primero es más rico en el metal de <b>mayor</b> punto de fusión; el líquido que queda se enriquece en el de <b>menor</b>. Eso rompe la homogeneidad que predice el diagrama de equilibrio.',
        },
        {
          t: 'table',
          head: ['Tipo', 'Dónde ocurre', 'Cómo se corrige'],
          rows: [
            ['<b>Microsegregación</b> (coring)', 'Distancias cortas, entre brazos dendríticos. α tiene composición distinta en el centro y en el borde.', '<b>Homogeneización</b>: tratamiento térmico; la difusión funciona a corta distancia.'],
            ['<b>Macrosegregación</b>', 'Entre la superficie y el centro de la pieza. Las distancias son demasiado grandes para difundir.', '<b>Trabajo en caliente</b>: no se elimina con homogeneización.'],
          ],
        },
        {
          t: 'p',
          html: 'La clave para diferenciarlas es la <b>escala</b> y el <b>método de corrección</b>. La homogeneización sólo sirve a distancias cortas (brazos dendríticos). Para la superficie–centro hace falta deformación en caliente, que mezcla el material mecánicamente.',
        },
        {
          t: 'callout',
          tone: 'prof',
          title: 'Qué busca el profesor',
          html: 'Que expliques que el <b>coring</b> aparece por falta de difusión, que el centro del brazo es rico en el metal de mayor T de fusión y el borde en el de menor, y que la corrección cambia según la escala: homogeneización (micro) vs. trabajo en caliente (macro).',
        },
      ],
      keyPoints: [
        'Enfriamiento rápido → no hay difusión → segregación.',
        'Micro (coring): brazos dendríticos; se corrige con homogeneización.',
        'Macro: superficie–centro; se reduce con trabajo en caliente.',
        'El sólido primero es más rico en el metal de mayor punto de fusión.',
      ],
    },
  ],

  formulas: [
    { id: 'f9-01', group: 'Palanca', name: 'Porcentaje de líquido', expr: '%L = (CS − CA) / (CS − CL) · 100', html: '%L = <span class="frac"><span class="frac__num">(CS − CA)</span><span class="frac__den">(CS − CL)</span></span> · 100', note: 'CL en el liquidus; CS en el solidus; CA es la composición global.' },
    { id: 'f9-02', group: 'Palanca', name: 'Porcentaje de sólido', expr: '%S = (CA − CL) / (CS − CL) · 100', html: '%S = <span class="frac"><span class="frac__num">(CA − CL)</span><span class="frac__den">(CS − CL)</span></span> · 100', note: 'El denominador es siempre la isoterma completa CS − CL.' },
    { id: 'f9-03', group: 'Palanca', name: 'Control de la palanca', expr: '%L + %S = 100 %', note: 'Si no da 100, revisá los numeradores o el denominador.' },
    { id: 'f9-05', group: 'Palanca', name: 'Masa de una fase', expr: 'm_fase = (%fase / 100) · m_total', html: 'm_fase = <span class="frac"><span class="frac__num">%fase</span><span class="frac__den">100</span></span> · m_total', note: 'La palanca reparte cantidades; las composiciones CL y CS no cambian.' },
    { id: 'f9-06', group: 'Palanca', name: 'Palanca general', expr: '%fase = (C_opuesta − CA) / (C_opuesta − C_fase) · 100', html: '%fase = <span class="frac"><span class="frac__num">(C_opuesta − CA)</span><span class="frac__den">(C_opuesta − C_fase)</span></span> · 100', note: 'El numerador es el brazo opuesto a la fase que calculás.' },
    { id: 'f9-04', group: 'Solidificación', name: 'Rango de solidificación', expr: 'ΔT = TL − TS', note: 'TL: temperatura de liquidus; TS: temperatura de solidus, para la composición de la aleación.' },
  ],

  cards: [
    { id: 'c9-01', unit: 'u9', topic: 'fases', front: '¿Qué es una fase?', back: 'Una porción del material con la misma estructura, aproximadamente la misma composición y propiedades, y una interface bien definida con cualquier otra fase.' },
    { id: 'c9-02', unit: 'u9', topic: 'fases', front: 'Las 3 condiciones de una fase', back: '1) Misma estructura (arreglo atómico). 2) Misma composición y propiedades aproximadas. 3) Interface bien definida. Si falta una, no es una fase.' },
    { id: 'c9-03', unit: 'u9', topic: 'fases', front: '¿Qué representa un diagrama de fases?', back: 'El mapa de equilibrio: para cada temperatura y composición dice qué fases hay, de qué composición y en qué cantidad (con la palanca).' },
    { id: 'c9-04', unit: 'u9', topic: 'fases', front: '¿Entra la regla de Gibbs?', back: 'No. F = C − P + 2 está confirmada fuera del parcial. Sí entran la palanca y las condiciones de solubilidad.' },
    { id: 'c9-05', unit: 'u9', topic: 'solubilidad', front: 'Solubilidad ilimitada: definición y ejemplo', back: 'El soluto se disuelve en cualquier proporción y queda una sola fase sólida α. Ejemplo de cátedra: Ni–Cu.' },
    { id: 'c9-06', unit: 'u9', topic: 'solubilidad', front: 'Solubilidad limitada: definición y ejemplo', back: 'El soluto entra hasta un máximo (solvus); con exceso aparecen dos fases (α + β). Ejemplos: Zn–Cu (latones) y Pb–Sn.' },
    { id: 'c9-07', unit: 'u9', topic: 'solubilidad', front: 'Solubilidad nula: definición y ejemplo', back: 'No se mezclan: cada componente forma su propia fase. Ejemplo: Cu–Pb en estado sólido (o aceite y agua).' },
    { id: 'c9-08', unit: 'u9', topic: 'solubilidad', front: '¿Qué es el solvus?', back: 'La línea que marca el máximo de soluto que admite la fase sólida a cada temperatura. Pasado ese límite aparece una segunda fase.' },
    { id: 'c9-09', unit: 'u9', topic: 'solubilidad', front: 'Diferencia entre solubilidad limitada y nula', back: 'En la limitada el soluto sí entra hasta un máximo; en la nula no entra nada. Zn–Cu es limitada (hasta ≈ 35 %); Cu–Pb es nula.' },
    { id: 'c9-10', unit: 'u9', topic: 'hume-rothery', front: 'Condición de tamaño atómico', back: 'Diferencia de tamaño < 15 % para aspirar a solubilidad ilimitada. Si es mayor, la red se distorsiona y solo admite soluto hasta cierto porcentaje.' },
    { id: 'c9-11', unit: 'u9', topic: 'hume-rothery', front: 'Las otras 3 condiciones de Hume-Rothery', back: 'Misma estructura cristalina, misma valencia y electronegatividad parecida. Si falla una, la solubilidad es limitada.' },
    { id: 'c9-12', unit: 'u9', topic: 'hume-rothery', front: '¿Qué pasa si las electronegatividades son muy distintas?', back: 'Tienden a formar compuestos intermetálicos en lugar de una solución sólida, y la solubilidad se limita.' },
    { id: 'c9-13', unit: 'u9', topic: 'hume-rothery', front: 'Causa térmica de la solubilidad limitada', back: 'Aun cumpliendo Hume-Rothery, la solubilidad máxima existe a una temperatura y disminuye al enfriar. Por eso el solvus limita y el exceso precipita como segunda fase.' },
    { id: 'c9-14', unit: 'u9', topic: 'hume-rothery', front: 'Respuesta completa sobre condiciones de solubilidad', back: 'Enunciar las 4 condiciones, decir qué pasa si falla cada una y cerrar: «por eso aparece el solvus y, pasado el límite, una segunda fase».' },
    { id: 'c9-15', unit: 'u9', topic: 'solucion-solida', front: '¿Qué es el endurecimiento por solución sólida?', back: 'El aleante entra como átomo sustitucional, distorsiona la red y dificulta el movimiento de dislocaciones. La aleación queda más resistente que el metal puro.' },
    { id: 'c9-16', unit: 'u9', topic: 'solucion-solida', front: '¿De qué depende el endurecimiento por solución sólida?', back: 'De la diferencia de tamaño atómico (más diferencia → más distorsión) y de la cantidad de aleante (hasta el límite de solubilidad).' },
    { id: 'c9-17', unit: 'u9', topic: 'solucion-solida', front: 'Efectos sobre las propiedades', back: 'Suben σy, σut y dureza; baja la ductilidad; baja mucho la conductividad eléctrica; mejora la resistencia a la termofluencia.' },
    { id: 'c9-18', unit: 'u9', topic: 'solucion-solida', front: '¿Por qué el latón es más duro que el cobre?', back: 'El Zn disuelto distorsiona la red del Cu y frena dislocaciones. Hasta ≈ 35 % queda α; con más Zn aparece β, aún más dura y frágil.' },
    { id: 'c9-19', unit: 'u9', topic: 'isomorfo', front: '¿Qué es el liquidus?', back: 'La línea por encima de la cual todo es líquido. Al cruzarla empieza a formarse el primer sólido α.' },
    { id: 'c9-20', unit: 'u9', topic: 'isomorfo', front: '¿Qué es el solidus?', back: 'La línea por debajo de la cual todo es sólido α. Al cruzarla desaparece la última gota de líquido.' },
    { id: 'c9-21', unit: 'u9', topic: 'isomorfo', front: '¿Qué hay entre liquidus y solidus?', back: 'La zona bifásica L + α. Se traza una isoterma y se leen CL (en el liquidus) y CS (en el solidus).' },
    { id: 'c9-22', unit: 'u9', topic: 'isomorfo', front: '¿CA, CL y CS qué son?', back: 'CA: composición global de la aleación (vertical fija). CL: composición del líquido en el liquidus. CS: composición del sólido en el solidus.' },
    { id: 'c9-23', unit: 'u9', topic: 'isomorfo', front: 'En Cu–Ni, ¿qué fase es más rica en Cu?', back: 'El líquido es más rico en Cu (menor punto de fusión) y el sólido α en Ni (mayor punto de fusión).' },
    { id: 'c9-24', unit: 'u9', topic: 'palanca', front: 'Fórmula del % de líquido', back: '%L = (CS − CA)/(CS − CL) × 100. El numerador es el brazo derecho; el denominador es la isoterma completa.' },
    { id: 'c9-25', unit: 'u9', topic: 'palanca', front: 'Fórmula del % de sólido', back: '%S = (CA − CL)/(CS − CL) × 100. Siempre se controla que %L + %S = 100 %.' },
    { id: 'c9-26', unit: 'u9', topic: 'palanca', front: 'Errores clásicos de la palanca', back: 'Invertir numeradores, usar mal el denominador (siempre CS − CL), leer CL/CS en el eje equivocado y olvidar el × 100.' },
    { id: 'c9-27', unit: 'u9', topic: 'palanca', front: '¿Qué pasa en una zona monofásica?', back: 'La fase es el 100 %; no se aplica la palanca. La palanca solo se usa en la zona bifásica.' },
    { id: 'c9-28', unit: 'u9', topic: 'curva-aleacion', front: 'Curva de enfriamiento de una aleación isomorfa', back: 'Dos cambios de pendiente: liquidus (primer sólido) y solidus (último líquido). No hay meseta horizontal; la T sigue bajando en L + α.' },
    { id: 'c9-29', unit: 'u9', topic: 'curva-aleacion', front: '¿Qué significa el quiebre del liquidus?', back: 'Que aparece el primer sólido α y empieza a liberarse calor latente. La pendiente se hace menos empinada, pero la temperatura sigue bajando.' },
    { id: 'c9-30', unit: 'u9', topic: 'curva-aleacion', front: '¿Qué significa el quiebre del solidus?', back: 'Que desaparece el último líquido. Termina la solidificación y el sólido α vuelve a enfriarse: la pendiente se hace más empinada.' },
    { id: 'c9-31', unit: 'u9', topic: 'curva-aleacion', front: 'Diferencia U8 vs. U9', back: 'U8 (metal puro): una meseta horizontal a Tf. U9 (aleación isomorfa): dos quiebres y un tramo inclinado L + α, sin meseta.' },
    { id: 'c9-32', unit: 'u9', topic: 'segregacion', front: 'Micro vs. macrosegregación', back: 'Micro (coring): entre brazos dendríticos; se corrige con homogeneización. Macro: superficie–centro; se reduce con trabajo en caliente.' },
  ],

  quiz: [
    {
      id: 'q9-01', unit: 'u9', topic: 'fases', type: 'mcq',
      q: '¿Cuáles son las tres condiciones que debe cumplir una fase?',
      options: ['Misma estructura, misma composición/propiedades e interface definida', 'Ser líquida, sólida y gaseosa a la vez', 'Tener la misma densidad, color y brillo', 'Estar por encima del liquidus'],
      correct: 0,
      explain: 'Una fase es una porción homogénea: misma estructura, composición y propiedades aproximadas, y una interface bien definida con las demás fases.',
    },
    {
      id: 'q9-02', unit: 'u9', topic: 'fases', type: 'mcq',
      q: '¿La regla de fases de Gibbs entra en el parcial?',
      options: ['No, está confirmado que no entra', 'Sí, es el tema principal', 'Solo para diagramas isomorfos', 'Solo si el diagrama tiene solvus'],
      correct: 0,
      explain: 'El profesor confirmó que Gibbs (F = C − P + 2) no entra. Sí entran la palanca y las condiciones de solubilidad.',
    },
    {
      id: 'q9-03', unit: 'u9', topic: 'solubilidad', type: 'mcq',
      q: '¿Cuál es el ejemplo de cátedra de solubilidad ilimitada?',
      options: ['Ni–Cu', 'Zn–Cu', 'Cu–Pb', 'Pb–Sn'],
      correct: 0,
      explain: 'Ni–Cu es isomorfo: una sola fase sólida α en todo el rango de composición.',
    },
    {
      id: 'q9-04', unit: 'u9', topic: 'solubilidad', type: 'mcq',
      q: 'El Zn en Cu (latón) es un ejemplo de solubilidad:',
      options: ['Limitada: entra hasta ≈ 35 % y después aparece β', 'Ilimitada: entra en cualquier proporción', 'Nula: no se mezclan', 'Gaseosa'],
      correct: 0,
      explain: 'El Zn se disuelve en Cu hasta ≈ 35 % (fase α). Con más Zn aparece la fase β, más dura y frágil.',
    },
    {
      id: 'q9-05', unit: 'u9', topic: 'solubilidad', type: 'mcq',
      q: '¿Qué sistema es de solubilidad nula en estado sólido?',
      options: ['Cu–Pb', 'Ni–Cu', 'Zn–Cu', 'Pb–Sn en fase α'],
      correct: 0,
      explain: 'Cu y Pb no se mezclan en estado sólido: cada uno forma su propia fase. Es el ejemplo de solubilidad nula.',
    },
    {
      id: 'q9-06', unit: 'u9', topic: 'solubilidad', type: 'mcq',
      q: '¿Qué línea marca el máximo de soluto que admite la fase sólida?',
      options: ['El solvus', 'El liquidus', 'El solidus', 'La isoterma eutéctica'],
      correct: 0,
      explain: 'El solvus fija la solubilidad máxima a cada temperatura. Pasado ese límite aparece una segunda fase.',
    },
    {
      id: 'q9-07', unit: 'u9', topic: 'solubilidad', type: 'mcq',
      q: 'La diferencia entre solubilidad limitada y nula es que:',
      options: ['En la limitada el soluto entra hasta un máximo; en la nula no entra nada', 'En la nula el soluto entra en cualquier proporción', 'Son sinónimos', 'La limitada solo ocurre en líquidos'],
      correct: 0,
      explain: 'Limitada = entra hasta el solvus (Zn–Cu). Nula = no se mezclan (Cu–Pb).',
    },
    {
      id: 'q9-08', unit: 'u9', topic: 'hume-rothery', type: 'mcq',
      q: '¿Qué diferencia de tamaño atómico se exige para aspirar a solubilidad ilimitada?',
      options: ['Menor al 15 %', 'Menor al 50 %', 'Mayor al 15 %', 'No importa el tamaño'],
      correct: 0,
      explain: 'La regla de tamaño de Hume-Rothery pide una diferencia < 15 %. Si es mayor, la red se distorsiona y la solubilidad se limita.',
    },
    {
      id: 'q9-09', unit: 'u9', topic: 'hume-rothery', type: 'mcq',
      q: 'Además del tamaño, ¿qué otras condiciones pide Hume-Rothery?',
      options: ['Misma estructura, misma valencia y electronegatividad parecida', 'Distinta estructura y distinta valencia', 'Que uno sea líquido y el otro gaseoso', 'Solo que tengan distinto color'],
      correct: 0,
      explain: 'Las cuatro condiciones son: tamaño < 15 %, misma estructura cristalina, misma valencia y electronegatividad parecida.',
    },
    {
      id: 'q9-10', unit: 'u9', topic: 'hume-rothery', type: 'mcq',
      q: 'Si las electronegatividades son muy distintas, lo más probable es que:',
      options: ['Se forme un compuesto intermetálico en vez de una solución sólida', 'La solubilidad sea ilimitada', 'No cambie nada', 'El material se vuelva un gas'],
      correct: 0,
      explain: 'La diferencia de electronegatividad favorece compuestos intermetálicos y limita la solución sólida.',
    },
    {
      id: 'q9-11', unit: 'u9', topic: 'hume-rothery', type: 'mcq',
      q: '¿Por qué la solubilidad real suele ser limitada aunque se cumplan las reglas?',
      options: ['Porque la solubilidad máxima depende de la temperatura y baja al enfriar (solvus)', 'Porque los átomos dejan de existir', 'Porque el liquidus desaparece', 'Porque la palanca lo impide'],
      correct: 0,
      explain: 'Aun cumpliendo Hume-Rothery, la solubilidad máxima existe a una temperatura y disminuye al enfriar; el exceso precipita como segunda fase.',
    },
    {
      id: 'q9-12', unit: 'u9', topic: 'solucion-solida', type: 'mcq',
      q: 'El endurecimiento por solución sólida se produce porque:',
      options: ['El átomo sustitucional distorsiona la red y frena las dislocaciones', 'Se agregan partículas de otra fase', 'El material se calienta hasta fundirse', 'Disminuye la cantidad de átomos'],
      correct: 0,
      explain: 'El soluto sustitucional deforma la red y dificulta el movimiento de dislocaciones; la aleación queda más resistente.',
    },
    {
      id: 'q9-13', unit: 'u9', topic: 'solucion-solida', type: 'mcq',
      q: '¿De qué depende el grado de endurecimiento por solución sólida?',
      options: ['De la diferencia de tamaño atómico y de la cantidad de aleante', 'Solo del color del metal', 'De la presión atmosférica', 'De la regla de Gibbs'],
      correct: 0,
      explain: 'A mayor diferencia de tamaño y mayor cantidad de aleante (hasta el límite), mayor distorsión y endurecimiento.',
    },
    {
      id: 'q9-14', unit: 'u9', topic: 'solucion-solida', type: 'mcq',
      q: '¿Cuál es el efecto del endurecimiento por solución sólida sobre las propiedades?',
      options: ['Suben σy, σut y dureza; baja la ductilidad y la conductividad', 'Suben ductilidad y conductividad', 'Baja la dureza y sube la ductilidad', 'No cambia ninguna propiedad'],
      correct: 0,
      explain: 'Suben resistencia y dureza, baja la ductilidad, baja mucho la conductividad y mejora la resistencia a la termofluencia.',
    },
    {
      id: 'q9-15', unit: 'u9', topic: 'solucion-solida', type: 'mcq',
      q: '¿Por qué el latón es más duro que el cobre?',
      options: ['El Zn disuelto distorsiona la red del Cu y frena dislocaciones', 'El Zn forma una meseta eutéctica', 'El Cu se vuelve más dúctil', 'Porque el latón tiene menos átomos'],
      correct: 0,
      explain: 'Es endurecimiento por solución sólida: el Zn sustitucional distorsiona la red. Hasta ≈ 35 % queda α; después aparece β.',
    },
    {
      id: 'q9-16', unit: 'u9', topic: 'isomorfo', type: 'mcq',
      q: '¿Qué hay por encima de la línea de liquidus?',
      options: ['Todo líquido', 'Todo sólido α', 'Líquido + sólido', 'Solo la fase β'],
      correct: 0,
      explain: 'Por encima del liquidus todo es líquido. Al cruzar el liquidus empieza a formarse el primer sólido α.',
    },
    {
      id: 'q9-17', unit: 'u9', topic: 'isomorfo', type: 'mcq',
      q: '¿Qué hay por debajo del solidus?',
      options: ['Todo sólido α', 'Todo líquido', 'Líquido + α', 'Dos fases líquidas'],
      correct: 0,
      explain: 'Por debajo del solidus todo es sólido α. Al cruzar el solidus desaparece la última gota de líquido.',
    },
    {
      id: 'q9-18', unit: 'u9', topic: 'isomorfo', type: 'mcq',
      q: 'En la zona entre liquidus y solidus de un diagrama isomorfo hay:',
      options: ['L + α, con CL en el liquidus y CS en el solidus', 'Solo α', 'Solo líquido', 'α + β, dos sólidos'],
      correct: 0,
      explain: 'Entre las dos curvas coexisten líquido y sólido α. Se leen CL y CS con una isoterma.',
    },
    {
      id: 'q9-19', unit: 'u9', topic: 'isomorfo', type: 'mcq',
      q: 'En Cu–Ni, ¿qué fase es más rica en Ni?',
      options: ['El sólido α', 'El líquido', 'Las dos tienen igual composición', 'La fase β'],
      correct: 0,
      explain: 'El sólido α es más rico en Ni (mayor punto de fusión); el líquido es más rico en Cu (menor punto de fusión).',
    },
    {
      id: 'q9-20', unit: 'u9', topic: 'isomorfo', type: 'mcq',
      q: 'La composición global CA de la aleación, al enfriar:',
      options: ['No cambia: es una vertical fija', 'Se mueve hacia el líquido', 'Se mueve hacia el sólido', 'Desaparece en la zona bifásica'],
      correct: 0,
      explain: 'CA es la composición global y no cambia. Lo que cambian son las composiciones de cada fase, CL y CS.',
    },
    {
      id: 'q9-21', unit: 'u9', topic: 'palanca', type: 'mcq',
      q: 'La fórmula correcta del porcentaje de líquido es:',
      options: ['%L = (CS − CA)/(CS − CL) × 100', '%L = (CA − CL)/(CS − CL) × 100', '%L = (CS − CL)/(CS − CA) × 100', '%L = CA/CL × 100'],
      correct: 0,
      explain: 'El %L usa el brazo opuesto al líquido, CS − CA, sobre la isoterma completa CS − CL.',
    },
    {
      id: 'q9-22', unit: 'u9', topic: 'palanca', type: 'mcq',
      q: 'El denominador de la regla de la palanca es siempre:',
      options: ['CS − CL, la isoterma completa', 'CA − CL', 'CS − CA', 'CA + CL'],
      correct: 0,
      explain: 'El denominador es la longitud total de la isoterma, CS − CL. No cambia según la fase que calcules.',
    },
    {
      id: 'q9-23', unit: 'u9', topic: 'palanca', type: 'mcq',
      q: 'Si CA está más cerca de CL que de CS, entonces:',
      options: ['Hay más líquido que sólido', 'Hay más sólido que líquido', 'Hay partes iguales', 'No se puede saber'],
      correct: 0,
      explain: 'La fase cuya composición está más cerca de CA es la más abundante. Si CA está cerca de CL, hay más líquido.',
    },
    {
      id: 'q9-24', unit: 'u9', topic: 'palanca', type: 'mcq',
      q: 'En una zona monofásica, el porcentaje de fase es:',
      options: ['100 %; no se aplica la palanca', '50 %', '0 %', 'Depende de la temperatura'],
      correct: 0,
      explain: 'Si hay una sola fase, esa fase es el 100 %. La palanca solo se aplica en la zona bifásica.',
    },
    {
      id: 'q9-25', unit: 'u9', topic: 'curva-aleacion', type: 'mcq',
      q: '¿Cuál es la diferencia principal entre la curva del metal puro (U8) y la de la aleación isomorfa (U9)?',
      options: ['El metal puro tiene una meseta horizontal; la aleación tiene dos quiebres y un tramo inclinado', 'La aleación tiene una meseta y el metal puro no', 'Las dos tienen exactamente la misma forma', 'La aleación no se enfría'],
      correct: 0,
      explain: 'El metal puro solidifica a T constante (meseta). La aleación isomorfa solidifica en un rango: liquidus y solidus son dos quiebres, sin meseta.',
    },
    {
      id: 'q9-26', unit: 'u9', topic: 'curva-aleacion', type: 'mcq',
      q: '¿La curva de la aleación isomorfa tiene una meseta horizontal?',
      options: ['No; la temperatura sigue bajando entre liquidus y solidus', 'Sí, en el liquidus', 'Sí, en el solidus', 'Sí, pero solo si enfría rápido'],
      correct: 0,
      explain: 'No hay meseta: el calor latente se libera durante todo el rango de solidificación. La meseta es del metal puro (U8) y del eutéctico (U10).',
    },
    {
      id: 'q9-27', unit: 'u9', topic: 'curva-aleacion', type: 'mcq',
      q: 'El primer cambio de pendiente de la curva de la aleación ocurre cuando:',
      options: ['Se llega al liquidus y aparece el primer sólido α', 'Se llega al solidus y desaparece el líquido', 'Termina el enfriamiento', 'Se alcanza la temperatura ambiente'],
      correct: 0,
      explain: 'En el liquidus empieza la solidificación: aparece el primer sólido y se libera calor latente; la pendiente se hace menos empinada.',
    },
    {
      id: 'q9-28', unit: 'u9', topic: 'curva-aleacion', type: 'mcq',
      q: 'El segundo quiebre de la curva de la aleación marca:',
      options: ['El solidus: desaparece el último líquido', 'El liquidus: aparece el primer sólido', 'El inicio del calentamiento', 'La temperatura de fusión del metal puro'],
      correct: 0,
      explain: 'En el solidus termina la solidificación: ya no queda líquido y el sólido α vuelve a enfriarse.',
    },
    {
      id: 'q9-29', unit: 'u9', topic: 'curva-aleacion', type: 'num',
      q: 'Una aleación Cu–40 % Ni tiene liquidus a 1280 °C y solidus a 1240 °C. ¿Cuál es su rango de solidificación ΔT?',
      answer: 40, tolerance: 0.5, answerUnit: '°C',
      steps: ['ΔT = TL − TS', 'ΔT = 1280 − 1240', 'ΔT = 40 °C'],
      explain: 'El rango de solidificación es la diferencia entre la temperatura de liquidus y la de solidus para esa composición.',
    },
    {
      id: 'q9-30', unit: 'u9', topic: 'segregacion', type: 'mcq',
      q: 'La microsegregación (coring) se corrige con:',
      options: ['Homogeneización', 'Trabajo en caliente', 'Enfriamiento rápido', 'Agregar más soluto'],
      correct: 0,
      explain: 'El coring ocurre entre brazos dendríticos, a distancias cortas; la homogeneización permite que la difusión empareje la composición.',
    },
    {
      id: 'q9-31', unit: 'u9', topic: 'segregacion', type: 'mcq',
      q: 'La macrosegregación se reduce con:',
      options: ['Trabajo en caliente', 'Homogeneización', 'Recocido de recristalización', 'Nada, es imposible'],
      correct: 0,
      explain: 'La macro ocurre entre superficie y centro; las distancias son demasiado grandes para la difusión, así que se reduce con deformación en caliente.',
    },
    {
      id: 'q9-32', unit: 'u9', topic: 'palanca', type: 'num',
      q: 'Aleación Cu–35 % Ni a 1250 °C, con CL = 32 % y CS = 43 %. ¿Qué porcentaje de líquido hay?',
      answer: 72.7, tolerance: 0.4, answerUnit: '%',
      steps: ['%L = (CS − CA)/(CS − CL) × 100', '%L = (43 − 35)/(43 − 32) × 100', '%L = 8/11 × 100 = 72,7 %'],
      explain: 'La aleación está más cerca de CL, por eso hay más líquido. La isoterma completa mide 11.',
    },
    {
      id: 'q9-33', unit: 'u9', topic: 'palanca', type: 'num',
      q: 'Con los datos anteriores (CS = 43, CA = 35, CL = 32), ¿qué porcentaje de sólido hay?',
      answer: 27.3, tolerance: 0.4, answerUnit: '%',
      steps: ['%S = (CA − CL)/(CS − CL) × 100', '%S = (35 − 32)/11 × 100', '%S = 3/11 × 100 = 27,3 %'],
      explain: 'Control: 72,7 + 27,3 = 100 %. El sólido es la fase más lejana a CA y por eso está en menor cantidad.',
    },
    {
      id: 'q9-34', unit: 'u9', topic: 'palanca', type: 'num',
      q: 'En una zona bifásica se lee CL = 40 %, CS = 60 % y CA = 45 %. ¿Qué porcentaje de líquido hay?',
      answer: 75, tolerance: 0.4, answerUnit: '%',
      steps: ['%L = (CS − CA)/(CS − CL) × 100', '%L = (60 − 45)/(60 − 40) × 100', '%L = 15/20 × 100 = 75 %'],
      explain: 'El denominador es 20. El sólido sería 25 %; control 75 + 25 = 100 %.',
    },
    {
      id: 'q9-35', unit: 'u9', topic: 'palanca', type: 'num',
      q: 'Una aleación tiene CA = 25 % de B, CL = 20 % y CS = 32 %. ¿Qué porcentaje de líquido hay?',
      answer: 58.3, tolerance: 0.4, answerUnit: '%',
      steps: ['%L = (CS − CA)/(CS − CL) × 100', '%L = (32 − 25)/(32 − 20) × 100', '%L = 7/12 × 100 = 58,3 %'],
      explain: 'CA = 25 está más cerca de CL = 20, por eso hay más líquido. El sólido es 41,7 %.',
    },
    {
      id: 'q9-36', unit: 'u9', topic: 'palanca', type: 'num',
      q: 'Una pieza de 2 kg de la aleación Cu–35 % Ni está a 1250 °C. Si hay 72,7 % de líquido, ¿cuántos gramos de líquido hay?',
      answer: 1454, tolerance: 3, answerUnit: 'g',
      steps: ['mL = (%L/100) · mtotal', 'mL = 0,727 × 2000 g', 'mL = 1454 g'],
      explain: 'La masa total es 2 kg = 2000 g. La palanca reparte cantidades; la composición del líquido sigue siendo 32 % Ni.',
    },
    {
      id: 'q9-37', unit: 'u9', topic: 'palanca', type: 'num',
      q: 'Con 58,3 % de líquido y 41,7 % de sólido, ¿cuántos kilogramos de sólido hay en una pieza de 3 kg?',
      answer: 1.251, tolerance: 0.003, answerUnit: 'kg',
      steps: ['mS = (%S/100) · mtotal', 'mS = 0,417 × 3 kg', 'mS = 1,251 kg'],
      explain: 'Control: 1,749 kg de líquido + 1,251 kg de sólido = 3 kg.',
    },
    {
      id: 'q9-38', unit: 'u9', topic: 'palanca', type: 'num',
      q: 'En una zona bifásica, CL = 30 %, CS = 55 % y hay 40 % de líquido. ¿Cuál es la composición CA de la aleación?',
      answer: 45, tolerance: 0.4, answerUnit: '%',
      steps: ['%L = (CS − CA)/(CS − CL) × 100', '40 = (55 − CA)/(55 − 30) × 100', '55 − CA = 10 → CA = 45 %'],
      explain: 'Es la palanca al revés: conocés las composiciones de las fases y una fracción, y despejás CA.',
    },
  ],
};

  __CDM_MODULES__["data/u9.js"] = { u9 };
})();

/* ===== data/ensayos.js ===== */
(function () {
  "use strict";
/* ============================================================
   data/ensayos.js — catálogo de ensayos (unidad 6)
   Énfasis en impacto: Charpy e Izod.
   ============================================================ */

const ENSAYO_CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'estatico', label: 'Estático' },
  { id: 'flexion', label: 'Flexión' },
  { id: 'dureza', label: 'Dureza' },
  { id: 'dinamico', label: 'Dinámico' },
  { id: 'ciclico', label: 'Cíclico' },
];

const ENSAYOS = [
  {
    id: 'traccion',
    name: 'Tracción',
    category: 'estatico',
    tag: 'Ensayo base',
    icon: 'arrow-right',
    summary: 'Estira una probeta normalizada con carga axial creciente y lenta hasta romperla. De acá salen casi todas las propiedades mecánicas.',
    measures: 'Módulo E, fluencia σy, resistencia σut, ductilidad, resiliencia y estricción.',
    probeta: 'SA-370 plana o cilíndrica, con zona reducida, radios R y longitud calibrada G. No se calculan áreas en el parcial.',
    equipo: 'Máquina universal de ensayos (INSTRON, WOLPERT) con mordazas y extensómetro.',
    steps: [
      'Identificar la sección reducida de la probeta.',
      'Marcar la longitud calibrada l₀ y acoplar el extensómetro.',
      'Aplicar carga axial creciente y lenta, registrando F y Δl.',
      'Construir la curva σ–ε y ubicar los puntos característicos.',
    ],
    results: ['Curva σ–ε completa', 'σy y σ₀,₂', 'σut (esfuerzo máximo)', 'Alargamiento y estricción', 'E (rigidez)'],
    units: 'σ en MPa; ε adimensional; E en MPa o GPa.',
    whenUse: 'Material dúctil y pieza que trabaja estirada. Es el ensayo de referencia para comparar materiales.',
    errors: ['Usar el área de las cabezas en vez de la sección reducida', 'Confundir σut con la tensión de rotura'],
    examQ: { q: '¿Qué propiedades se obtienen de un solo ensayo de tracción?', a: 'Las propiedades de la curva: fluencia, fluencia 0,2 %, resistencia a la tracción, estricción, módulo de Young, resiliencia y ductilidad. En este parcial se interpretan, no se calculan.' },
    diagram: 'curva-sigma-epsilon',
  },
  {
    id: 'flexion-3',
    name: 'Flexión en 3 puntos',
    category: 'flexion',
    tag: 'Materiales frágiles',
    icon: 'layers',
    summary: 'Una viga simplemente apoyada con una carga en el centro. Evita las mordazas que trituran a los materiales frágiles.',
    measures: 'Comportamiento a flexión: por qué se usa en frágiles y cómo se distribuyen momento y cortante.',
    probeta: 'Barra prismática (w ancho, h altura) apoyada en dos apoyos separados por la luz L.',
    equipo: 'Máquina universal con dispositivo de flexión y comparador para la deflexión δ.',
    steps: [
      'Apoyar la barra dejando la luz L entre apoyos (¡no el largo total!).',
      'Aplicar F en el centro y observar la cara traccionada.',
      'Identificar el momento triangular y el cambio de signo del cortante.',
    ],
    results: ['Falla por la cara traccionada', 'Momento triangular con máximo en el centro', 'El cortante cambia de signo en el centro'],
    units: 'Conceptual: en este parcial no se calculan σflex ni Eflex.',
    whenUse: 'Cerámicos, vidrios, fundición gris y polímeros rígidos que se rompen en las mordazas de tracción.',
    errors: ['Confundir 3 y 4 puntos', 'Olvidar que el momento máximo está en el centro', 'No justificar por qué se usa en materiales frágiles'],
    examQ: { q: '¿Por qué se ensayan los frágiles en flexión?', a: 'Porque las mordazas de tracción trituran las cabezas y la desalineación rompe la pieza antes de medir. En flexión se apoya una viga y falla la cara traccionada, que es lo que se quiere caracterizar. Es un ensayo conceptual: no se calcula σflex en el parcial.' },
  },
  {
    id: 'flexion-4',
    name: 'Flexión en 4 puntos',
    category: 'flexion',
    tag: 'Flexión pura',
    icon: 'layers',
    summary: 'Dos cargas a L/4 de cada apoyo. El tramo central queda con momento constante y cortante nulo: se ensaya más volumen de material.',
    measures: 'Las mismas propiedades que en 3 puntos, pero con resultados más representativos.',
    probeta: 'Viga prismática simplemente apoyada, con dos puntos de carga.',
    equipo: 'Máquina universal con dispositivo de 4 puntos.',
    steps: [
      'Ubicar las cargas a L/4 de cada apoyo.',
      'Aplicar la carga y observar el tramo central.',
      'Identificar el momento constante en el tramo central y el cortante nulo.',
    ],
    results: ['Flexión pura en el tramo central', 'Mayor volumen de material ensayado', 'Resultado más representativo con defectos distribuidos'],
    units: 'Conceptual: no se calcula en el parcial.',
    whenUse: 'Cerámicos con defectos distribuidos, cuando se busca un resultado más representativo que el de 3 puntos.',
    errors: ['Confundir los diagramas con los de 3 puntos', 'Ubicar las cargas en el centro'],
    examQ: { q: '¿Qué diferencia hay entre 3 y 4 puntos?', a: 'En 3 puntos el momento es triangular y se concentra en el centro. En 4 puntos el momento es constante en todo el tramo central y el cortante es cero: flexión pura, se ensaya más volumen de material.' },
  },
  {
    id: 'brinell',
    name: 'Dureza Brinell',
    category: 'dureza',
    tag: 'Huella grande',
    icon: 'target',
    summary: 'Esfera de 10 mm que se hunde con 3000 o 500 kgf. Se mide el diámetro de la huella con microscopio.',
    measures: 'Dureza HB y diámetro de la huella. La conversión a resistencia es sólo una referencia, no se calcula en el parcial.',
    probeta: 'Superficie plana y pulida; espesor suficiente para que la huella no la atraviese.',
    equipo: 'Durómetro Brinell con esfera de acero duro o carburo de tungsteno, microscopio de medición.',
    steps: [
      'Apoyar la probeta y aplicar la carga (3000 kgf aceros/hierros; 500 kgf no ferrosos).',
      'Medir el diámetro d de la impronta con lupa o microscopio.',
      'Informar la dureza HB según la norma; en este parcial no se reemplaza la fórmula.',
    ],
    results: ['HB (escala de dureza)', 'Diámetro d de la huella', 'Tipo de huella'],
    units: 'HB en kgf/mm²; D y d en mm.',
    whenUse: 'Fundiciones y aceros, piezas grandes. No sirve para piezas delgadas ni para microdureza.',
    errors: ['Confundir Brinell con Rockwell', 'Medir mal d (promedio de dos lecturas perpendiculares)'],
    examQ: { q: '¿Por qué Brinell no sirve en piezas delgadas?', a: 'Porque la esfera de 10 mm con 3000 kgf deja una huella grande que puede atravesar o deformar la pieza. Para espesores chicos se usa Rockwell o microdureza Vickers/Knoop.' },
  },
  {
    id: 'rockwell',
    name: 'Dureza Rockwell',
    category: 'dureza',
    tag: 'Lectura automática',
    icon: 'target',
    summary: 'Mide la profundidad de penetración, no la huella. Es el ensayo más rápido y el típico de producción en serie.',
    measures: 'Dureza HR en distintas escalas (HRA, HRB, HRC, HRD, HRE, HRF).',
    probeta: 'Superficie plana; espesor mínimo según la escala.',
    equipo: 'Durómetro Rockwell con cono de diamante 120° o bolas de 1/16" y 1/8".',
    steps: [
      'Aplicar la precarga para asentar el penetrador.',
      'Aplicar la carga total (60, 100 o 150 kgf según la escala).',
      'Leer directamente la profundidad en el reloj o display.',
    ],
    results: ['HRC (acero templado)', 'HRB (latón, acero blando)', 'HRA (carburos)', 'HRE/HRF (materiales suaves)'],
    units: 'Adimensional (número de escala HR).',
    whenUse: 'Producción rápida en serie, piezas terminadas, control de tratamientos térmicos.',
    errors: ['Usar la escala equivocada (HRB en un acero templado)', 'No apoyar bien la pieza'],
    examQ: { q: '¿Por qué Rockwell es el más rápido?', a: 'Porque el equipo mide automáticamente la profundidad de penetración: no hace falta microscopio ni medir diagonales. Aplica una precarga y da lectura directa.' },
  },
  {
    id: 'vickers',
    name: 'Microdureza Vickers',
    category: 'dureza',
    tag: 'Pirámide cuadrada',
    icon: 'target',
    summary: 'Pirámide de diamante de base cuadrada con carga típica de 10 kg. Se miden las dos diagonales de la huella.',
    measures: 'Dureza HV, válida en un rango amplio de materiales.',
    probeta: 'Superficie pulida; puede ser una capa o una zona pequeña.',
    equipo: 'Microdurómetro Vickers con microscopio.',
    steps: ['Aplicar la carga (≈10 kg).', 'Medir las dos diagonales de la huella al microscopio.', 'Informar HV según la norma.'],
    results: ['HV', 'Huella cuadrada', 'Dos diagonales'],
    units: 'HV (kgf/mm²).',
    whenUse: 'Materiales duros, capas, zonas de soldadura, microdureza.',
    errors: ['Medir una sola diagonal', 'Confundir con Knoop (rombo alargado)'],
    examQ: { q: 'Vickers vs. Knoop', a: 'Vickers usa una pirámide de base cuadrada y se miden las dos diagonales; Knoop usa una pirámide romboidal alargada y asimétrica, se mide sólo la diagonal larga y penetra menos.' },
  },
  {
    id: 'knoop',
    name: 'Microdureza Knoop',
    category: 'dureza',
    tag: 'Capas delgadas',
    icon: 'target',
    summary: 'Pirámide romboidal alargada con 500 g. Penetra muy poco: ideal para cerámicos y recubrimientos delgados.',
    measures: 'Dureza HK.',
    probeta: 'Superficie pulida, recubrimientos o fases pequeñas.',
    equipo: 'Microdurómetro Knoop con microscopio.',
    steps: ['Aplicar 500 g.', 'Medir sólo la diagonal larga.', 'Informar HK según la norma.'],
    results: ['HK', 'Huella romboidal alargada'],
    units: 'HK (kgf/mm²).',
    whenUse: 'Cerámicos y capas delgadas donde Vickers penetraría demasiado.',
    errors: ['Intentar medir la diagonal corta', 'Usar cargas altas'],
    examQ: { q: '¿Qué método elegirías para la dureza de un recubrimiento?', a: 'Knoop: penetra menos que Vickers y permite medir sólo la capa sin afectar el sustrato.' },
  },
  {
    id: 'shore',
    name: 'Dureza Shore',
    category: 'dureza',
    tag: 'Polímeros',
    icon: 'target',
    summary: 'Mide la profundidad de la marca en cauchos, elastómeros y plásticos. Escalas Shore A y Shore D.',
    measures: 'Dureza Shore A (blandos) o D (rígidos).',
    probeta: 'Material no metálico, superficie plana y con espesor suficiente.',
    equipo: 'Durómetro Shore con punta con resorte.',
    steps: ['Apoyar el durómetro perpendicular a la superficie.', 'Leer la profundidad de la marca.', 'Usar escala A o D según el material.'],
    results: ['Shore A', 'Shore D'],
    units: 'Escala Shore (adimensional).',
    whenUse: 'Cauchos, elastómeros, plásticos rígidos y espumas.',
    errors: ['Convertir Shore A a D con una regla lineal', 'Medir sobre una superficie curva'],
    examQ: { q: '¿Se puede usar Brinell en un caucho?', a: 'No: para no metálicos se usa Shore, que mide la profundidad de la marca con una punta con resorte. Shore A para blandos y D para rígidos.' },
  },
  {
    id: 'impacto-charpy',
    name: 'Impacto Charpy',
    category: 'dinamico',
    tag: 'El más usado',
    icon: 'zap',
    summary: 'Péndulo que golpea una probeta entallada apoyada horizontalmente. Mide la energía absorbida y el tipo de fractura.',
    measures: 'Tenacidad al impacto: energía absorbida, % de fractura por corte y expansión lateral.',
    probeta: '10 × 10 × 55 mm, entalla en el centro (L/2 = 27,5 mm) de 45°, 2 mm de profundidad y r = 0,25 mm.',
    equipo: 'Péndulo de impacto Charpy con escala de energía.',
    steps: [
      'Apoyar la probeta horizontalmente en los dos extremos (viga).',
      'Soltar el péndulo desde h₀: golpea la cara opuesta a la entalla.',
      'Registrar la altura final y leer la energía absorbida en la escala del equipo.',
      'Leer la cara de fractura y medir la expansión lateral.',
    ],
    results: ['Energía absorbida (J)', '% de fractura por corte', 'Expansión lateral (mm)'],
    units: 'J (o ft·lbf); expansión en mm o mils.',
    whenUse: 'Evaluar el comportamiento ante golpe súbito, controlar transición dúctil–frágil y comparar aceros.',
    errors: ['Golpear del lado de la entalla (es al revés)', 'Mirar sólo la energía y no el % de corte ni la expansión lateral'],
    examQ: { q: 'Describí el ensayo Charpy y sus resultados.', a: 'Probeta 10×10×55 mm apoyada horizontalmente, entalla al centro y golpe en la cara opuesta. El péndulo cae, rompe la probeta y sube menos: esa diferencia de altura indica la energía absorbida. Entrega energía, % de corte y expansión lateral.' },
    diagram: 'impacto',
    highlight: true,
  },
  {
    id: 'impacto-izod',
    name: 'Impacto Izod',
    category: 'dinamico',
    tag: 'Voladizo',
    icon: 'zap',
    summary: 'Probeta vertical empotrada por la mitad inferior. El péndulo golpea el extremo libre, del mismo lado de la entalla.',
    measures: 'Las mismas tres respuestas que Charpy: energía, % de corte y expansión lateral.',
    probeta: '10 × 10 × 75 mm, entalla 45° de 2 mm desplazada del centro.',
    equipo: 'Péndulo de impacto Izod con mordaza de empotramiento.',
    steps: [
      'Empotrar la probeta vertical por la mitad inferior (voladizo).',
      'Golpear el extremo libre, del mismo lado de la entalla.',
      'Leer la energía absorbida en la escala y evaluar la cara de fractura.',
    ],
    results: ['Energía absorbida', '% de corte', 'Expansión lateral'],
    units: 'J; expansión en mm o mils.',
    whenUse: 'Cuando la norma o el material lo piden; es común en plásticos y en normas americanas antiguas.',
    errors: ['Golpear la cara opuesta (eso es Charpy)', 'Confundir la longitud de probeta (75 mm)'],
    examQ: { q: 'Diferencia clave entre Charpy e Izod', a: 'Charpy: 10×10×55 mm, horizontal apoyada, golpe en la cara opuesta a la entalla. Izod: 10×10×75 mm, vertical empotrada en voladizo, golpe del mismo lado de la entalla en el extremo libre.' },
    diagram: 'impacto',
    highlight: true,
  },
  {
    id: 'fatiga',
    name: 'Fatiga',
    category: 'ciclico',
    tag: 'Cargas repetidas',
    icon: 'refresh',
    summary: 'Aplica esfuerzos cíclicos menores que σy hasta la falla, sin deformación visible. Falla por iniciación y propagación de una grieta.',
    measures: 'Concepto de fatiga, etapas de falla y por qué es peligrosa. Sin cálculos de Se ni Marin.',
    probeta: 'Probeta pulida en flexión rotativa (ensayo base).',
    equipo: 'Máquina de fatiga rotativa o servo-hidráulica.',
    steps: [
      'Aplicar un esfuerzo cíclico de amplitud constante.',
      'Observar la iniciación superficial de la grieta.',
      'Seguir la propagación ciclo a ciclo hasta la fractura súbita.',
    ],
    results: ['Iniciación superficial', 'Propagación ciclo a ciclo', 'Fractura súbita sin deformación visible'],
    units: 'Conceptual: no se calculan Se ni coeficientes de Marin.',
    whenUse: 'Ejes, resortes, alas, piezas con cargas repetidas o vibración.',
    errors: ['Decir que la fatiga ocurre por encima de σy', 'Olvidar que no hay deformación plástica visible', 'Confundir el orden de las 3 etapas'],
    examQ: { q: 'Etapas de la fatiga', a: 'Iniciación superficial de la grieta → propagación ciclo a ciclo, con marcas de playa → fractura súbita cuando el área remanente ya no soporta la carga. Falla con σ < σy y sin deformación plástica visible.' },
  },
];

const CHARPY_VS_IZOD = {
  head: ['Característica', 'Charpy', 'Izod'],
  rows: [
    ['Dimensiones de la probeta', '10 × 10 × 55 mm', '10 × 10 × 75 mm'],
    ['Entalla', 'En el centro (L/2 = 27,5 mm), 45°, 2 mm, r = 0,25 mm', '45°, 2 mm, desplazada del centro'],
    ['Colocación', 'Horizontal, simplemente apoyada en los extremos (viga)', 'Vertical, empotrada por la mitad inferior (voladizo)'],
    ['Lado del golpe', 'Cara opuesta a la entalla', 'Del mismo lado de la entalla, en el extremo libre'],
    ['Resultados', 'Energía absorbida · % de corte · expansión lateral', 'Energía absorbida · % de corte · expansión lateral'],
  ],
};

  __CDM_MODULES__["data/ensayos.js"] = { ENSAYO_CATEGORIES, ENSAYOS, CHARPY_VS_IZOD };
})();

/* ===== data/index.js ===== */
(function () {
  "use strict";
/* ============================================================
   data/index.js — agregador de contenido y metadatos
   ============================================================ */

const { u6 } = __CDM_MODULES__["data/u6.js"];
const { u8 } = __CDM_MODULES__["data/u8.js"];
const { u9 } = __CDM_MODULES__["data/u9.js"];
const { ENSAYOS, ENSAYO_CATEGORIES, CHARPY_VS_IZOD } = __CDM_MODULES__["data/ensayos.js"];



const UNITS = { u6, u8, u9 };
const UNIT_LIST = [u6, u8, u9];

const TOPICS = {
  traccion: { label: 'Tracción', unit: 'u6' },
  propiedades: { label: 'Propiedades de la curva', unit: 'u6' },
  rigidez: { label: 'Rigidez y temperatura', unit: 'u6' },
  flexion: { label: 'Flexión', unit: 'u6' },
  dureza: { label: 'Dureza', unit: 'u6' },
  impacto: { label: 'Impacto', unit: 'u6' },
  transicion: { label: 'Transición', unit: 'u6' },
  fatiga: { label: 'Fatiga', unit: 'u6' },
  nucleacion: { label: 'Nucleación', unit: 'u8' },
  'radio-critico': { label: 'Radio crítico', unit: 'u8' },
  homogenea: { label: 'Homogénea / heterogénea', unit: 'u8' },
  grano: { label: 'Tamaño de grano', unit: 'u8' },
  enfriamiento: { label: 'Curva de enfriamiento', unit: 'u8' },
  chvorinov: { label: 'Chvorinov', unit: 'u8' },
  formas: { label: 'Formas y V/A', unit: 'u8' },
  fases: { label: 'Fase y diagrama', unit: 'u9' },
  solubilidad: { label: 'Tipos de solubilidad', unit: 'u9' },
  'hume-rothery': { label: 'Hume-Rothery', unit: 'u9' },
  'solucion-solida': { label: 'Solución sólida', unit: 'u9' },
  isomorfo: { label: 'Diagrama isomorfo', unit: 'u9' },
  palanca: { label: 'Regla de la palanca', unit: 'u9' },
  'curva-aleacion': { label: 'Curva de la aleación', unit: 'u9' },
  segregacion: { label: 'Segregación', unit: 'u9' },
};

const ALL_LESSONS = UNIT_LIST.flatMap((unit) =>
  unit.lessons.map((lesson) => ({ ...lesson, unit: unit.id })),
);

const ALL_CARDS = UNIT_LIST.flatMap((unit) => unit.cards);
const ALL_QUIZ = UNIT_LIST.flatMap((unit) => unit.quiz);
const ALL_FORMULAS = UNIT_LIST.flatMap((unit) =>
  unit.formulas.map((formula) => ({ ...formula, unit: unit.id })),
);

function getUnit(id) {
  return UNITS[id] || u6;
}

function getLesson(id) {
  return ALL_LESSONS.find((lesson) => lesson.id === id) || null;
}

function lessonsForUnit(unitId) {
  return getUnit(unitId).lessons;
}

function cardsForUnit(unitId) {
  return getUnit(unitId).cards;
}

function quizForUnit(unitId) {
  return getUnit(unitId).quiz;
}

function getTopic(topicId) {
  return TOPICS[topicId] || { label: topicId, unit: 'u6' };
}

function topicLessons(topicId) {
  return ALL_LESSONS.filter((lesson) => lesson.id.includes(topicId));
}

function getEnsayo(id) {
  return ENSAYOS.find((ensayo) => ensayo.id === id) || null;
}

function ensayosByUnit(unitId) {
  return ENSAYOS.filter((ensayo) => (unitId === 'u8' ? ensayo.category === 'dinamico' : true));
}

const COUNTS = {
  lessons: ALL_LESSONS.length,
  cards: ALL_CARDS.length,
  quiz: ALL_QUIZ.length,
  formulas: ALL_FORMULAS.length,
  ensayos: ENSAYOS.length,
};

function unitCounts(unitId) {
  const unit = getUnit(unitId);
  return {
    lessons: unit.lessons.length,
    cards: unit.cards.length,
    quiz: unit.quiz.length,
    formulas: unit.formulas.length,
  };
}

  __CDM_MODULES__["data/index.js"] = { getUnit, getLesson, lessonsForUnit, cardsForUnit, quizForUnit, getTopic, topicLessons, getEnsayo, ensayosByUnit, unitCounts, UNITS, UNIT_LIST, TOPICS, ALL_LESSONS, ALL_CARDS, ALL_QUIZ, ALL_FORMULAS, COUNTS, ENSAYOS, ENSAYO_CATEGORIES, CHARPY_VS_IZOD };
})();

/* ===== diagrams/u6.js ===== */
(function () {
  "use strict";
/* ============================================================
   diagrams/u6.js — diagramas SVG interactivos de la unidad 6
   Cada diagrama: variantes con svg + pines (n, x, y, lx, ly,
   label, q, detail).
   ============================================================ */

const arrow = (id) => `
  <defs>
    <marker id="${id}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 1 L10 5 L0 9 z" fill="var(--muted)"/>
    </marker>
  </defs>`;

const curvaSigmaEpsilon = {
  id: 'curva-sigma-epsilon',
  unit: 'u6',
  title: 'Curva esfuerzo–deformación',
  subtitle: 'Las propiedades A–H sobre un solo gráfico',
  key: 'curva',
  notes: [
    'Marcá siempre: pendiente E en la zona elástica, triángulo de resiliencia, cedencia, σut donde empieza la estricción y la recta offset al 0,2 %.',
    'La curva baja después de σut porque el área real disminuye, no porque el material se debilite.',
  ],
  legend: [
    { color: 'accent', text: 'Zona elástica / offset' },
    { color: 'green', text: 'Punto máximo σut' },
    { color: 'rose', text: 'Ruptura' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'Curva completa',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Curva esfuerzo deformación con sus puntos característicos">
        ${arrow('ar-cs')}
        <defs>
          <pattern id="hatch-cs" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--accent)" stroke-opacity="0.38" stroke-width="1.3"/>
          </pattern>
        </defs>

        <line x1="46" y1="244" x2="344" y2="244" class="svg-axis" marker-end="url(#ar-cs)"/>
        <line x1="46" y1="244" x2="46" y2="24" class="svg-axis" marker-end="url(#ar-cs)"/>
        <text x="30" y="34" class="svg-text svg-text--strong" font-size="12">σ</text>
        <text x="334" y="260" class="svg-text svg-text--strong" font-size="12">ε</text>
        <text x="37" y="254" class="svg-text svg-text--muted">0</text>

        <polygon points="46,244 120,128 120,244" fill="url(#hatch-cs)"/>

        <line x1="46" y1="128" x2="120" y2="128" stroke="var(--line-strong)" stroke-dasharray="3 4"/>
        <line x1="46" y1="62" x2="232" y2="62" stroke="var(--line-strong)" stroke-dasharray="3 4"/>
        <line x1="232" y1="62" x2="232" y2="244" stroke="var(--line-strong)" stroke-dasharray="3 4"/>
        <line x1="120" y1="128" x2="120" y2="244" stroke="var(--line-strong)" stroke-dasharray="3 4"/>
        <line x1="288" y1="150" x2="288" y2="244" stroke="var(--line-strong)" stroke-dasharray="3 4"/>

        <line x1="54" y1="244" x2="136" y2="112" stroke="var(--violet)" stroke-width="1.8" stroke-dasharray="6 4"/>
        <text x="92" y="102" class="svg-text svg-text--violet" font-size="8">offset 0,2 %</text>

        <path class="svg-curve svg-curve--accent" d="M46 244 L120 128 L126 144 L132 138 L138 146 L144 139 L151 145" />
        <path class="svg-curve" d="M151 145 C 182 140, 205 84, 232 62" />
        <path class="svg-curve svg-curve--rose" d="M232 62 C 254 66, 272 108, 288 150" />

        <circle cx="120" cy="128" r="4.2" fill="var(--amber)"/>
        <circle cx="232" cy="62" r="5" fill="var(--green)"/>
        <circle cx="288" cy="150" r="4.4" fill="var(--rose)"/>

        <text x="96" y="272" class="svg-text svg-text--muted">zona elástica</text>
        <text x="196" y="272" class="svg-text svg-text--muted">zona plástica (permanente)</text>
        <text x="252" y="54" class="svg-text svg-text--green" font-size="8">σut</text>
        <text x="290" y="140" class="svg-text svg-text--rose" font-size="8">ruptura</text>
      </svg>`,
      pins: [
        { n: 1, x: 46, y: 60, lx: 104, ly: 40, label: 'Esfuerzo σ (MPa)', q: '¿Qué magnitud representa el eje vertical?', detail: 'El esfuerzo ingenieril σ = F/A₀, en MPa (N/mm²).' },
        { n: 2, x: 86, y: 180, lx: 170, ly: 156, label: 'Módulo E = σ/ε', q: '¿Qué mide la pendiente de la zona recta inicial?', detail: 'El módulo de Young E: rigidez del material. Depende del enlace atómico, no del tratamiento térmico.' },
        { n: 3, x: 92, y: 214, lx: 142, ly: 226, label: 'Resiliencia (área elástica)', q: '¿Qué representa el triángulo rayado bajo la recta?', detail: 'ER = ½σyεy: energía elástica que el material absorbe y devuelve al descargar.' },
        { n: 4, x: 120, y: 128, lx: 76, ly: 112, label: 'σy: fluencia o cedencia', q: '¿Qué punto separa la zona elástica de la plástica?', detail: 'El esfuerzo de fluencia σy. Al superarlo queda deformación permanente.' },
        { n: 5, x: 60, y: 232, lx: 174, ly: 96, label: 'Offset 0,2 %', q: '¿Qué es la recta punteada paralela?', detail: 'Fluencia convencional: paralela a la zona elástica desplazada 0,2 % (ε = 0,002). Se usa cuando no hay quiebre claro.' },
        { n: 6, x: 138, y: 142, lx: 186, ly: 176, label: 'Meseta de fluencia', q: '¿Qué zona aparece justo después del pico de cedencia en aceros de bajo carbono?', detail: 'La meseta ondulante de cedencia inferior, por anclaje y liberación de dislocaciones.' },
        { n: 7, x: 232, y: 62, lx: 280, ly: 42, label: 'σut: resistencia a la tracción', q: '¿Qué representa el punto más alto de la curva?', detail: 'σut = Fmáx/A₀. Es el máximo, no la rotura: justo acá empieza la estricción.' },
        { n: 8, x: 262, y: 90, lx: 300, ly: 112, label: 'Estricción (encuellamiento)', q: '¿Qué fenómeno ocurre en el tramo descendente?', detail: 'Se forma un cuello localizado: el área real cae y la fuerza baja hasta la ruptura.' },
        { n: 9, x: 288, y: 150, lx: 314, ly: 172, label: 'Ruptura', q: '¿Qué punto marca la fractura final?', detail: 'El esfuerzo de ruptura, menor que σut porque el área del cuello ya era mucho menor.' },
        { n: 10, x: 84, y: 256, lx: 74, ly: 284, label: 'Zona elástica (reversible)', q: '¿Qué zona devuelve la deformación al descargar?', detail: 'Por debajo de σy la deformación es reversible: la pieza vuelve a su longitud inicial.' },
        { n: 11, x: 200, y: 256, lx: 238, ly: 288, label: 'Zona plástica (permanente)', q: '¿Qué zona deja deformación permanente?', detail: 'Desde σy hasta la ruptura: la deformación queda aunque se retire la carga.' },
      ],
    },
  ],
};

const impacto = {
  id: 'impacto',
  unit: 'u6',
  title: 'Impacto: Charpy vs. Izod',
  subtitle: 'Péndulo, entalla y lado del golpe',
  key: 'impacto',
  notes: [
    'Charpy: probeta horizontal apoyada, golpe en la cara opuesta a la entalla.',
    'Izod: probeta vertical empotrada, golpe del mismo lado de la entalla.',
    'En ambos: E = m·g·(h₀ − hf) y tres resultados (energía, % de corte, expansión lateral).',
  ],
  legend: [
    { color: 'accent', text: 'Probeta y apoyos' },
    { color: 'amber', text: 'Golpe del péndulo' },
    { color: 'green', text: 'Entalla normalizada' },
  ],
  variants: [
    {
      key: 'charpy',
      label: 'Charpy',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Ensayo Charpy">
        ${arrow('ar-ch')}
        <defs>
          <pattern id="hatch-ch" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--amber)" stroke-opacity="0.4" stroke-width="1.2"/>
          </pattern>
        </defs>

        <line x1="40" y1="252" x2="330" y2="252" stroke="var(--line-strong)" stroke-width="1.5"/>

        <polygon points="86,252 112,252 99,222" fill="var(--surface-2)" stroke="var(--line-strong)"/>
        <polygon points="242,252 268,252 255,222" fill="var(--surface-2)" stroke="var(--line-strong)"/>

        <rect x="58" y="204" width="238" height="18" rx="2" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.6"/>
        <path d="M170 222 L180 208 L190 222" fill="var(--bg-soft)" stroke="var(--green)" stroke-width="2"/>

        <circle cx="46" cy="46" r="5" fill="var(--surface-3)" stroke="var(--line-strong)"/>
        <line x1="46" y1="46" x2="168" y2="128" stroke="var(--muted)" stroke-width="2"/>
        <path d="M46 46 A 122 122 0 0 1 168 168" fill="none" stroke="var(--line-strong)" stroke-dasharray="4 5"/>
        <rect x="156" y="120" width="24" height="30" rx="4" fill="url(#hatch-ch)" stroke="var(--amber)" stroke-width="1.8"/>
        <line x1="168" y1="152" x2="180" y2="200" stroke="var(--amber)" stroke-width="2.4" marker-end="url(#ar-ch)"/>
        <text x="128" y="112" class="svg-text svg-text--amber" font-size="8">péndulo m</text>

        <line x1="318" y1="60" x2="318" y2="252" stroke="var(--line-strong)" stroke-width="1.2"/>
        <line x1="310" y1="60" x2="326" y2="60" stroke="var(--violet)" stroke-width="2"/>
        <line x1="310" y1="118" x2="326" y2="118" stroke="var(--violet)" stroke-width="2"/>
        <text x="330" y="56" class="svg-text svg-text--violet" font-size="8">h₀</text>
        <text x="330" y="122" class="svg-text svg-text--violet" font-size="8">hf</text>
        <line x1="300" y1="60" x2="300" y2="118" stroke="var(--violet)" stroke-width="1.4" marker-start="url(#ar-ch)" marker-end="url(#ar-ch)"/>
        <text x="272" y="94" class="svg-text svg-text--violet" font-size="8">Δh</text>

        <text x="66" y="196" class="svg-text svg-text--muted" font-size="8">probeta 10×10×55 mm</text>
        <text x="118" y="270" class="svg-text svg-text--muted" font-size="8">apoyos (viga)</text>
        <text x="204" y="146" class="svg-text svg-text--amber" font-size="8">golpe: cara opuesta</text>
        <text x="196" y="236" class="svg-text svg-text--green" font-size="8">entalla 45° · 2 mm · r 0,25</text>
      </svg>`,
      pins: [
        { n: 1, x: 168, y: 134, lx: 258, ly: 128, label: 'Golpe en la cara opuesta', q: '¿En qué cara golpea el péndulo en Charpy?', detail: 'En la cara opuesta a la entalla. La probeta se flexiona y la entalla queda traccionada.' },
        { n: 2, x: 180, y: 216, lx: 262, ly: 236, label: 'Entalla 45° de 2 mm', q: '¿Qué es la entalla y para qué sirve?', detail: 'Entalla normalizada: 45°, 2 mm de profundidad y r = 0,25 mm. Concentra tensiones y define dónde empieza la fractura.' },
        { n: 3, x: 99, y: 236, lx: 88, ly: 272, label: 'Probeta apoyada en los extremos', q: '¿Cómo se coloca la probeta Charpy?', detail: 'Horizontal, simplemente apoyada en los dos extremos: trabaja como viga de 55 mm.' },
        { n: 4, x: 66, y: 213, lx: 128, ly: 188, label: 'Probeta 10 × 10 × 55 mm', q: '¿Qué dimensiones tiene la probeta Charpy?', detail: '10 × 10 × 55 mm, con la entalla en el centro (L/2 = 27,5 mm).' },
        { n: 5, x: 318, y: 88, lx: 316, ly: 36, label: 'E = m·g·(h₀ − hf)', q: '¿Cómo se obtiene la energía absorbida?', detail: 'Por la diferencia de energía potencial del péndulo: E = m·g·(h₀ − hf), con g = 9,8 m/s².' },
        { n: 6, x: 100, y: 140, lx: 62, ly: 160, label: 'Péndulo / martillo', q: '¿Qué elemento golpea la probeta?', detail: 'El martillo del péndulo, que cae desde h₀ y describe un arco hasta el impacto.' },
      ],
    },
    {
      key: 'izod',
      label: 'Izod',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Ensayo Izod">
        ${arrow('ar-iz')}
        <defs>
          <pattern id="hatch-iz" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--amber)" stroke-opacity="0.4" stroke-width="1.2"/>
          </pattern>
        </defs>

        <line x1="56" y1="262" x2="330" y2="262" stroke="var(--line-strong)" stroke-width="1.5"/>
        <rect x="176" y="60" width="18" height="180" rx="2" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.6"/>
        <path d="M176 104 L190 112 L176 120" fill="var(--bg-soft)" stroke="var(--green)" stroke-width="2"/>
        <rect x="160" y="204" width="50" height="58" rx="4" fill="var(--surface-2)" stroke="var(--line-strong)" stroke-width="1.8"/>
        <line x1="160" y1="218" x2="210" y2="218" stroke="var(--line-strong)" stroke-dasharray="3 3"/>

        <circle cx="60" cy="64" r="5" fill="var(--surface-3)" stroke="var(--line-strong)"/>
        <line x1="60" y1="64" x2="132" y2="98" stroke="var(--muted)" stroke-width="2"/>
        <rect x="120" y="86" width="26" height="30" rx="4" fill="url(#hatch-iz)" stroke="var(--amber)" stroke-width="1.8"/>
        <line x1="146" y1="101" x2="172" y2="101" stroke="var(--amber)" stroke-width="2.4" marker-end="url(#ar-iz)"/>
        <text x="94" y="78" class="svg-text svg-text--amber" font-size="8">péndulo</text>

        <text x="226" y="96" class="svg-text svg-text--amber" font-size="8">golpe: mismo lado</text>
        <text x="230" y="128" class="svg-text svg-text--green" font-size="8">entalla</text>
        <text x="222" y="200" class="svg-text svg-text--muted" font-size="8">empotrado</text>
        <text x="222" y="214" class="svg-text svg-text--muted" font-size="8">(voladizo)</text>
        <text x="84" y="252" class="svg-text svg-text--muted" font-size="8">probeta 10×10×75 mm</text>
        <text x="252" y="284" class="svg-text svg-text--muted" font-size="8">vertical</text>
        <line x1="150" y1="196" x2="176" y2="196" stroke="var(--line-strong)" stroke-dasharray="3 3"/>
      </svg>`,
      pins: [
        { n: 1, x: 158, y: 101, lx: 262, ly: 84, label: 'Golpe del mismo lado de la entalla', q: '¿En qué cara golpea el péndulo en Izod?', detail: 'Del mismo lado de la entalla, en el extremo libre. Es la diferencia clave con Charpy.' },
        { n: 2, x: 182, y: 112, lx: 250, ly: 130, label: 'Entalla desplazada', q: '¿Dónde está la entalla en la probeta Izod?', detail: 'Entalla de 45° y 2 mm, desplazada del centro (no en L/2 como en Charpy).' },
        { n: 3, x: 185, y: 146, lx: 128, ly: 172, label: 'Probeta 10 × 10 × 75 mm', q: '¿Qué dimensiones tiene la probeta Izod?', detail: '10 × 10 × 75 mm: 20 mm más larga que la Charpy porque va empotrada.' },
        { n: 4, x: 185, y: 232, lx: 260, ly: 246, label: 'Empotrada (voladizo)', q: '¿Cómo se sostiene la probeta Izod?', detail: 'Vertical, empotrada por la mitad inferior: trabaja como voladizo.' },
        { n: 5, x: 78, y: 76, lx: 74, ly: 44, label: 'Péndulo del ensayo', q: '¿Qué golpea la probeta?', detail: 'El martillo del péndulo, que impacta el extremo libre de la probeta.' },
      ],
    },
  ],
};

const caraFractura = {
  id: 'cara-fractura',
  unit: 'u6',
  title: 'Cara de fractura y % de corte',
  subtitle: 'Clivaje central vs. corte periférico',
  key: 'fractura-cara',
  notes: [
    'El área brillante y cristalina es clivaje (frágil); el marco opaco y fibroso es corte (dúctil).',
    '% corte = (Atotal − A·B) / Atotal × 100. Si A o B valen 0, el corte es 100 %.',
  ],
  legend: [
    { color: 'rose', text: 'Clivaje (frágil)' },
    { color: 'green', text: 'Corte (dúctil)' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'Cara de fractura',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Cara de fractura de una probeta Charpy">
        <rect x="86" y="56" width="150" height="150" rx="6" fill="var(--green-soft)" stroke="var(--green)" stroke-width="2"/>
        <rect x="126" y="86" width="70" height="90" rx="3" fill="var(--rose-soft)" stroke="var(--rose)" stroke-width="2" stroke-dasharray="5 3"/>
        <path d="M96 66 l14 10 M96 86 l14 10 M96 106 l14 10 M96 126 l14 10 M96 146 l14 10 M96 166 l14 10 M96 186 l14 10" stroke="var(--green)" stroke-opacity="0.45" stroke-width="1.2"/>
        <path d="M216 66 l14 10 M216 86 l14 10 M216 106 l14 10 M216 126 l14 10 M216 146 l14 10 M216 166 l14 10 M216 186 l14 10" stroke="var(--green)" stroke-opacity="0.45" stroke-width="1.2"/>

        <line x1="126" y1="72" x2="196" y2="72" stroke="var(--rose)" stroke-width="1.4" marker-start="url(#ar-fr)" marker-end="url(#ar-fr)"/>
        <text x="152" y="66" class="svg-text svg-text--rose" font-size="9">A</text>
        <line x1="210" y1="86" x2="210" y2="176" stroke="var(--rose)" stroke-width="1.4" marker-start="url(#ar-fr)" marker-end="url(#ar-fr)"/>
        <text x="216" y="134" class="svg-text svg-text--rose" font-size="9">B</text>
        <text x="132" y="134" class="svg-text svg-text--rose" font-size="9">clivaje</text>
        <text x="132" y="146" class="svg-text svg-text--rose" font-size="8">(brillante)</text>
        <text x="206" y="200" class="svg-text svg-text--green" font-size="9">corte</text>
        <text x="206" y="212" class="svg-text svg-text--green" font-size="8">(opaco y fibroso)</text>
        <text x="86" y="48" class="svg-text svg-text--muted" font-size="8">10 × 8 mm (ejemplo)</text>

        <line x1="250" y1="60" x2="330" y2="60" stroke="var(--line-strong)" stroke-dasharray="3 3"/>
        <text x="250" y="80" class="svg-text svg-text--muted" font-size="8">% corte =</text>
        <text x="250" y="96" class="svg-text svg-text--strong" font-size="9" font-family="monospace">(Atotal − A·B)</text>
        <line x1="250" y1="102" x2="336" y2="102" stroke="var(--muted)" stroke-width="1"/>
        <text x="250" y="116" class="svg-text svg-text--strong" font-size="9" font-family="monospace">Atotal × 100</text>
        <text x="250" y="150" class="svg-text svg-text--muted" font-size="8">A o B = 0 →</text>
        <text x="250" y="164" class="svg-text svg-text--green" font-size="9">100 % dúctil</text>
      </svg>`,
      pins: [
        { n: 1, x: 160, y: 130, lx: 196, ly: 246, label: 'Clivaje (frágil, brillante)', q: '¿Qué zona de la cara de fractura es el clivaje?', detail: 'El recuadro central A × B, brillante y cristalino: es la fractura frágil.' },
        { n: 2, x: 96, y: 190, lx: 68, ly: 232, label: 'Corte (dúctil, opaco)', q: '¿Qué zona corresponde a la fractura por corte?', detail: 'El marco periférico opaco y fibroso: es la fractura dúctil por cizallamiento.' },
        { n: 3, x: 161, y: 72, lx: 168, ly: 40, label: 'Ancho A del clivaje', q: '¿Qué representa A en la fórmula del % de corte?', detail: 'El ancho del rectángulo de clivaje. Su área es A × B.' },
        { n: 4, x: 210, y: 130, lx: 262, ly: 40, label: 'Alto B del clivaje', q: '¿Qué representa B?', detail: 'El alto del rectángulo de clivaje. Si A o B valen 0, no hay zona frágil y el corte es 100 %.' },
        { n: 5, x: 330, y: 186, lx: 296, ly: 214, label: 'Cálculo del % de corte', q: '¿Cómo se calcula el porcentaje de fractura por corte?', detail: '% corte = (área total − A·B)/área total × 100. Se mide sobre la cara rota de la probeta.' },
      ],
    },
  ],
};

const flexion = {
  id: 'flexion',
  unit: 'u6',
  title: 'Flexión en 3 y 4 puntos',
  subtitle: 'Diagramas de momento y cortante',
  key: 'flexion',
  notes: [
    'En 3 puntos el momento es triangular (máximo FL/4 en el centro); en 4 puntos es constante en L/2 y V = 0 (flexión pura).',
    'Las cargas se ubican a L/4 de cada apoyo en el ensayo de 4 puntos.',
  ],
  legend: [
    { color: 'accent', text: 'Momento flector' },
    { color: 'amber', text: 'Esfuerzo cortante' },
  ],
  variants: [
    {
      key: 'tres',
      label: '3 puntos',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Flexión en 3 puntos">
        ${arrow('ar-fl')}
        <line x1="56" y1="84" x2="312" y2="84" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
        <polygon points="48,96 72,96 60,72" fill="var(--surface-2)" stroke="var(--line-strong)"/>
        <polygon points="296,96 320,96 308,72" fill="var(--surface-2)" stroke="var(--line-strong)"/>
        <line x1="184" y1="26" x2="184" y2="70" stroke="var(--amber)" stroke-width="2.6" marker-end="url(#ar-fl)"/>
        <text x="192" y="40" class="svg-text svg-text--amber" font-size="9">F</text>
        <line x1="60" y1="106" x2="308" y2="106" stroke="var(--line-strong)" stroke-dasharray="3 4"/>
        <text x="176" y="120" class="svg-text svg-text--muted" font-size="8">L</text>

        <text x="56" y="150" class="svg-text svg-text--muted" font-size="8">Momento flector</text>
        <line x1="60" y1="214" x2="308" y2="214" stroke="var(--muted)" stroke-width="1.4"/>
        <polygon points="60,214 184,160 308,214" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.8"/>
        <text x="166" y="180" class="svg-text svg-text--accent" font-size="8">Mmax = FL/4</text>

        <text x="56" y="236" class="svg-text svg-text--muted" font-size="8">Cortante</text>
        <line x1="60" y1="278" x2="308" y2="278" stroke="var(--line-strong)" stroke-dasharray="3 4"/>
        <path d="M60 258 L184 258 L184 292 L308 292" fill="none" stroke="var(--amber)" stroke-width="2.2"/>
        <text x="92" y="250" class="svg-text svg-text--amber" font-size="8">+F/2</text>
        <text x="248" y="284" class="svg-text svg-text--amber" font-size="8">−F/2</text>
      </svg>`,
      pins: [
        { n: 1, x: 158, y: 48, lx: 226, ly: 36, label: 'Carga F en el centro (L/2)', q: '¿Dónde se aplica la carga en 3 puntos?', detail: 'Una sola carga en el centro de la luz, a L/2 de cada apoyo.' },
        { n: 2, x: 150, y: 174, lx: 232, ly: 190, label: 'Momento máximo FL/4', q: '¿Cuánto vale el momento máximo en 3 puntos?', detail: 'Mmax = F·L/4, en el centro. El diagrama es un triángulo.' },
        { n: 3, x: 92, y: 274, lx: 128, ly: 300, label: 'Cortante +F/2 y −F/2', q: '¿Cómo es el diagrama de cortante?', detail: 'Constante: +F/2 a la izquierda del centro y −F/2 a la derecha.' },
        { n: 4, x: 60, y: 84, lx: 70, ly: 54, label: 'Apoyo simple (luz L)', q: '¿Cómo se apoya la viga?', detail: 'Simplemente apoyada en los extremos; la luz L es la distancia entre apoyos, no el largo total.' },
        { n: 5, x: 246, y: 90, lx: 268, ly: 112, label: 'Cara traccionada abajo', q: '¿Qué cara falla en un material frágil?', detail: 'La cara inferior, que trabaja a tracción: por eso el ensayo representa la resistencia a flexión.' },
      ],
    },
    {
      key: 'cuatro',
      label: '4 puntos',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Flexión en 4 puntos">
        ${arrow('ar-f4')}
        <line x1="56" y1="84" x2="312" y2="84" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
        <polygon points="48,96 72,96 60,72" fill="var(--surface-2)" stroke="var(--line-strong)"/>
        <polygon points="296,96 320,96 308,72" fill="var(--surface-2)" stroke="var(--line-strong)"/>
        <line x1="124" y1="26" x2="124" y2="70" stroke="var(--amber)" stroke-width="2.6" marker-end="url(#ar-f4)"/>
        <line x1="244" y1="26" x2="244" y2="70" stroke="var(--amber)" stroke-width="2.6" marker-end="url(#ar-f4)"/>
        <text x="103" y="40" class="svg-text svg-text--amber" font-size="9">F</text>
        <text x="250" y="40" class="svg-text svg-text--amber" font-size="9">F</text>
        <text x="74" y="124" class="svg-text svg-text--muted" font-size="8">L/4</text>
        <text x="166" y="124" class="svg-text svg-text--muted" font-size="8">L/2</text>
        <text x="276" y="124" class="svg-text svg-text--muted" font-size="8">L/4</text>

        <text x="56" y="150" class="svg-text svg-text--muted" font-size="8">Momento flector</text>
        <line x1="60" y1="214" x2="308" y2="214" stroke="var(--muted)" stroke-width="1.4"/>
        <polygon points="60,214 124,166 244,166 308,214" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.8"/>
        <text x="132" y="186" class="svg-text svg-text--accent" font-size="8">M = cte (flexión pura)</text>

        <text x="56" y="236" class="svg-text svg-text--muted" font-size="8">Cortante</text>
        <line x1="60" y1="278" x2="308" y2="278" stroke="var(--line-strong)" stroke-dasharray="3 4"/>
        <path d="M60 260 L124 260 L124 278 L244 278 L244 296 L308 296" fill="none" stroke="var(--amber)" stroke-width="2.2"/>
        <text x="78" y="252" class="svg-text svg-text--amber" font-size="8">+F/2</text>
        <text x="168" y="272" class="svg-text svg-text--green" font-size="8">V = 0</text>
        <text x="264" y="288" class="svg-text svg-text--amber" font-size="8">−F/2</text>
      </svg>`,
      pins: [
        { n: 1, x: 124, y: 52, lx: 86, ly: 36, label: 'Dos cargas a L/4', q: '¿Dónde se aplican las cargas en 4 puntos?', detail: 'Dos cargas iguales, cada una a L/4 de su apoyo, dejando el tramo central L/2.' },
        { n: 2, x: 184, y: 174, lx: 240, ly: 200, label: 'Momento constante en L/2', q: '¿Cómo es el momento en el tramo central?', detail: 'Trapecial: constante y máximo en todo el tramo central. Se ensaya más volumen de material.' },
        { n: 3, x: 184, y: 268, lx: 204, ly: 256, label: 'Cortante V = 0 (flexión pura)', q: '¿Cuánto vale el cortante en el tramo central?', detail: 'V = 0 en L/2: no hay corte, sólo momento. Eso es flexión pura.' },
        { n: 4, x: 184, y: 84, lx: 184, ly: 148, label: 'Tramo central L/2', q: '¿Qué abarca el tramo de momento constante?', detail: 'Desde la primera carga hasta la segunda: L/2 de la luz total.' },
        { n: 5, x: 60, y: 84, lx: 60, ly: 200, label: 'Apoyo simple', q: '¿Cómo se sostiene la viga?', detail: 'Simplemente apoyada en los extremos, igual que en 3 puntos; cambia la ubicación de las cargas.' },
      ],
    },
  ],
};

const transicion = {
  id: 'transicion',
  unit: 'u6',
  title: 'Transición dúctil–frágil',
  subtitle: 'Aceros BCC vs. materiales FCC',
  key: 'transicion',
  notes: [
    'La temperatura de transición es el límite de seguridad: siempre se trabaja por encima de ella.',
    'Aluminio, cobre y aceros austeníticos (FCC) no presentan una transición marcada.',
  ],
  legend: [
    { color: 'accent', text: 'Acero BCC' },
    { color: 'green', text: 'Material FCC' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'Curva',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Curva de transición dúctil frágil">
        ${arrow('ar-tr')}
        <line x1="46" y1="250" x2="342" y2="250" class="svg-axis" marker-end="url(#ar-tr)"/>
        <line x1="46" y1="250" x2="46" y2="26" class="svg-axis" marker-end="url(#ar-tr)"/>
        <text x="8" y="34" class="svg-text svg-text--strong" font-size="8">Energía</text>
        <text x="8" y="45" class="svg-text svg-text--strong" font-size="8">(J)</text>
        <text x="292" y="268" class="svg-text svg-text--strong" font-size="9">Temperatura</text>

        <rect x="148" y="40" width="52" height="210" fill="var(--amber-soft)" opacity="0.55"/>
        <line x1="174" y1="40" x2="174" y2="250" stroke="var(--amber)" stroke-width="1.4" stroke-dasharray="4 4"/>
        <text x="184" y="34" text-anchor="middle" class="svg-text svg-text--amber" font-size="8">T transición</text>

        <path class="svg-curve svg-curve--accent" d="M52 70 L126 76 C 150 80, 156 150, 178 176 C 196 198, 230 214, 320 218"/>
        <path d="M52 96 C 120 100, 160 120, 210 128 C 250 134, 290 136, 320 138" fill="none" stroke="var(--green)" stroke-width="2.2" stroke-dasharray="7 4"/>

        <text x="64" y="62" class="svg-text svg-text--muted" font-size="8">meseta superior (dúctil)</text>
        <text x="232" y="236" class="svg-text svg-text--muted" font-size="8">meseta inferior (clivaje)</text>
        <text x="232" y="124" class="svg-text svg-text--green" font-size="8">FCC: sin transición</text>
        <text x="84" y="268" class="svg-text svg-text--muted" font-size="8">−40 °C</text>
        <text x="172" y="268" class="svg-text svg-text--muted" font-size="8">0 °C</text>
        <text x="246" y="268" class="svg-text svg-text--muted" font-size="8">+40 °C</text>
      </svg>`,
      pins: [
        { n: 1, x: 86, y: 73, lx: 116, ly: 44, label: 'Meseta superior dúctil', q: '¿Qué representa la meseta superior?', detail: 'Alta absorción de energía: fractura dúctil, típica de temperaturas por encima de la transición.' },
        { n: 2, x: 260, y: 216, lx: 262, ly: 246, label: 'Meseta inferior frágil', q: '¿Qué representa la meseta inferior?', detail: 'Baja energía de impacto: clivaje, fractura frágil a baja temperatura.' },
        { n: 3, x: 174, y: 120, lx: 122, ly: 108, label: 'Temperatura de transición', q: '¿Qué marca la línea vertical?', detail: 'La temperatura de transición entre comportamiento dúctil y frágil: es el límite de seguridad de servicio.' },
        { n: 4, x: 306, y: 146, lx: 282, ly: 174, label: 'Material FCC sin transición', q: '¿Qué material representa la curva verde punteada?', detail: 'Un material FCC (aluminio, cobre, acero austenítico): mantiene alta energía a baja temperatura.' },
        { n: 5, x: 46, y: 150, lx: 74, ly: 190, label: 'Energía absorbida (J)', q: '¿Qué se mide en el eje vertical?', detail: 'La energía absorbida en el ensayo de impacto, en J o ft·lbf.' },
      ],
    },
  ],
};

const snWohler = {
  id: 'sn-wohler',
  unit: 'u6',
  title: 'Curva S–N (Wöhler)',
  subtitle: 'Acero vs. aluminio',
  key: 'sn',
  notes: [
    'El acero se aplana entre 10⁶ y 10⁷ ciclos: ese escalón es el límite de fatiga Se.',
    'El aluminio nunca se aplana: no tiene límite de fatiga definido.',
  ],
  legend: [
    { color: 'accent', text: 'Acero (con límite)' },
    { color: 'amber', text: 'Aluminio (sin límite)' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'S–N',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Curva S N de fatiga">
        ${arrow('ar-sn')}
        <line x1="50" y1="246" x2="340" y2="246" class="svg-axis" marker-end="url(#ar-sn)"/>
        <line x1="50" y1="246" x2="50" y2="30" class="svg-axis" marker-end="url(#ar-sn)"/>
        <text x="10" y="42" class="svg-text svg-text--strong" font-size="8">S (MPa)</text>
        <text x="312" y="288" class="svg-text svg-text--strong" font-size="8">N (log)</text>

        <text x="96" y="266" class="svg-text svg-text--muted" font-size="8">10³</text>
        <text x="166" y="266" class="svg-text svg-text--muted" font-size="8">10⁶</text>
        <text x="226" y="266" class="svg-text svg-text--muted" font-size="8">10⁷</text>
        <text x="300" y="266" class="svg-text svg-text--muted" font-size="8">10⁸</text>

        <path class="svg-curve svg-curve--accent" d="M60 62 C 110 96, 150 140, 180 158 L 320 158"/>
        <path class="svg-curve svg-curve--amber" d="M60 88 C 120 132, 180 180, 240 204 C 270 216, 300 224, 322 228"/>
        <line x1="50" y1="158" x2="180" y2="158" stroke="var(--line-strong)" stroke-dasharray="3 4"/>
        <text x="56" y="152" class="svg-text svg-text--accent" font-size="8">Se</text>
        <line x1="180" y1="158" x2="180" y2="246" stroke="var(--line-strong)" stroke-dasharray="3 4"/>
        <text x="196" y="146" class="svg-text svg-text--accent" font-size="8">meseta: ciclos infinitos</text>
        <text x="248" y="240" class="svg-text svg-text--amber" font-size="8">sigue bajando</text>
      </svg>`,
      pins: [
        { n: 1, x: 102, y: 96, lx: 154, ly: 60, label: 'Acero: curva con meseta', q: '¿Qué material tiene meseta horizontal?', detail: 'Los aceros (y el titanio) se aplanan entre 10⁶ y 10⁷ ciclos: existe un límite de fatiga Se.' },
        { n: 2, x: 268, y: 214, lx: 268, ly: 238, label: 'Aluminio: sin límite definido', q: '¿Qué material no tiene límite de fatiga definido?', detail: 'Los no ferrosos (aluminio, latón, magnesio) siguen bajando: se informa resistencia a la fatiga para un N fijo.' },
        { n: 3, x: 80, y: 158, lx: 86, ly: 136, label: 'Límite de fatiga Se', q: '¿Qué valor indica el nivel horizontal?', detail: 'El límite de fatiga: por debajo de ese esfuerzo el acero soporta ciclos infinitos.' },
        { n: 4, x: 204, y: 238, lx: 210, ly: 284, label: 'Entre 10⁶ y 10⁷ ciclos', q: '¿Entre qué ciclos aparece la meseta del acero?', detail: 'Entre 10⁶ y 10⁷ ciclos. Es el dato que no puede faltar en la respuesta de fatiga.' },
      ],
    },
  ],
};

const dureza = {
  id: 'dureza',
  unit: 'u6',
  title: 'Huellas de los ensayos de dureza',
  subtitle: 'Brinell, Rockwell, Vickers y Knoop',
  key: 'dureza-huellas',
  notes: [
    'Brinell y Vickers se miden con microscopio; Rockwell lee directamente la profundidad.',
    'Knoop penetra muy poco: ideal para cerámicos y recubrimientos delgados.',
  ],
  legend: [
    { color: 'amber', text: 'Brinell: diámetro d' },
    { color: 'violet', text: 'Rockwell: profundidad' },
    { color: 'accent', text: 'Vickers: dos diagonales' },
    { color: 'green', text: 'Knoop: diagonal larga' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'Huellas',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Huellas de dureza">
        ${arrow('ar-du')}
        <rect x="12" y="16" width="164" height="124" rx="10" fill="var(--surface)" stroke="var(--line)"/>
        <text x="26" y="36" class="svg-text svg-text--strong" font-size="9">Brinell (HB)</text>
        <circle cx="94" cy="86" r="34" fill="var(--amber-soft)" stroke="var(--amber)" stroke-width="2"/>
        <line x1="64" y1="86" x2="124" y2="86" stroke="var(--amber)" stroke-width="1.4" marker-start="url(#ar-du)" marker-end="url(#ar-du)"/>
        <text x="86" y="102" class="svg-text svg-text--amber" font-size="8">d</text>
        <text x="26" y="132" class="svg-text svg-text--muted" font-size="7.5">esfera 10 mm · 3000/500 kgf</text>

        <rect x="184" y="16" width="164" height="124" rx="10" fill="var(--surface)" stroke="var(--line)"/>
        <text x="198" y="36" class="svg-text svg-text--strong" font-size="9">Rockwell (HR)</text>
        <path d="M266 46 L290 96 L242 96 Z" fill="var(--violet-soft)" stroke="var(--violet)" stroke-width="2"/>
        <line x1="266" y1="46" x2="266" y2="118" stroke="var(--violet)" stroke-width="1.3" stroke-dasharray="3 3"/>
        <text x="272" y="112" class="svg-text svg-text--violet" font-size="7.5">profundidad</text>
        <text x="198" y="132" class="svg-text svg-text--muted" font-size="7.5">cono 120° o bola</text>

        <rect x="12" y="156" width="164" height="128" rx="10" fill="var(--surface)" stroke="var(--line)"/>
        <text x="26" y="176" class="svg-text svg-text--strong" font-size="9">Vickers (HV)</text>
        <path d="M94 196 L126 228 L94 260 L62 228 Z" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
        <line x1="62" y1="228" x2="126" y2="228" stroke="var(--accent)" stroke-width="1.3"/>
        <line x1="94" y1="196" x2="94" y2="260" stroke="var(--accent)" stroke-width="1.3"/>
        <text x="94" y="276" text-anchor="middle" class="svg-text svg-text--muted" font-size="7.5">pirámide cuadrada</text>

        <rect x="184" y="156" width="164" height="128" rx="10" fill="var(--surface)" stroke="var(--line)"/>
        <text x="198" y="176" class="svg-text svg-text--strong" font-size="9">Knoop (HK)</text>
        <path d="M266 196 L292 226 L266 256 L240 226 Z" fill="var(--green-soft)" stroke="var(--green)" stroke-width="2"/>
        <line x1="240" y1="226" x2="292" y2="226" stroke="var(--green)" stroke-width="1.3"/>
        <text x="266" y="276" text-anchor="middle" class="svg-text svg-text--muted" font-size="7.5">rombo alargado · 500 g</text>
      </svg>`,
      pins: [
        { n: 1, x: 94, y: 86, lx: 92, ly: 60, label: 'Brinell: se mide el diámetro d', q: '¿Qué se mide en la huella Brinell?', detail: 'El diámetro promedio d de la impronta dejada por una esfera de 10 mm, con lupa o microscopio.' },
        { n: 2, x: 266, y: 80, lx: 266, ly: 62, label: 'Rockwell: se mide la profundidad', q: '¿Qué mide el durómetro Rockwell?', detail: 'La profundidad de penetración, de forma automática y sin microscopio. Usa precarga.' },
        { n: 3, x: 94, y: 232, lx: 94, ly: 208, label: 'Vickers: dos diagonales', q: '¿Qué se mide en la huella Vickers?', detail: 'Las dos diagonales de la pirámide de base cuadrada, al microscopio.' },
        { n: 4, x: 266, y: 226, lx: 266, ly: 202, label: 'Knoop: sólo la diagonal larga', q: '¿Qué se mide en la huella Knoop?', detail: 'Sólo la diagonal larga de la pirámide romboidal alargada. Penetra menos: capas delgadas y cerámicos.' },
      ],
    },
  ],
};

const U6_DIAGRAMS = [
  curvaSigmaEpsilon,
  impacto,
  transicion,
];

  __CDM_MODULES__["diagrams/u6.js"] = { U6_DIAGRAMS };
})();

/* ===== diagrams/u8.js ===== */
(function () {
  "use strict";
/* ============================================================
   diagrams/u8.js — diagramas SVG interactivos de la unidad 8
   ============================================================ */

const arrow = (id) => `
  <defs>
    <marker id="${id}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 1 L10 5 L0 9 z" fill="var(--muted)"/>
    </marker>
  </defs>`;

const nucleacion = {
  id: 'nucleacion',
  unit: 'u8',
  title: 'Energía libre vs. radio',
  subtitle: 'ΔGv, σ, ΔG total y radio crítico',
  key: 'nucleacion',
  notes: [
    'La curva total suma el término de volumen (negativo, r³) y el de superficie (positivo, r²).',
    'El máximo está en r*: por debajo el embrión se disuelve, por encima el núcleo crece.',
  ],
  legend: [
    { color: 'accent', text: 'ΔG superficie (+)' },
    { color: 'rose', text: 'ΔG volumen (−)' },
    { color: 'green', text: 'ΔG total' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'ΔG vs. r',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Energía libre versus radio del núcleo">
        ${arrow('ar-nu')}
        <line x1="52" y1="196" x2="344" y2="196" class="svg-axis" marker-end="url(#ar-nu)"/>
        <line x1="58" y1="288" x2="58" y2="26" class="svg-axis" marker-end="url(#ar-nu)"/>
        <text x="30" y="42" class="svg-text svg-text--strong" font-size="10">ΔG</text>
        <text x="44" y="72" class="svg-text svg-text--muted" font-size="8">+</text>
        <text x="44" y="272" class="svg-text svg-text--muted" font-size="8">−</text>
        <text x="48" y="192" class="svg-text svg-text--muted" font-size="8">0</text>
        <text x="326" y="216" class="svg-text svg-text--strong" font-size="10">r</text>

        <path d="M58 196 C 120 178, 200 96, 322 30" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-dasharray="7 4"/>
        <path d="M58 196 C 130 214, 200 260, 312 292" fill="none" stroke="var(--rose)" stroke-width="2.4" stroke-dasharray="7 4"/>

        <path d="M58 196 C 120 192, 150 158, 182 150 C 212 144, 248 208, 310 286" fill="none" stroke="var(--green)" stroke-width="3"/>
        <line x1="182" y1="150" x2="182" y2="196" stroke="var(--amber)" stroke-width="1.5" stroke-dasharray="5 4"/>
        <circle cx="182" cy="150" r="4.6" fill="var(--amber)"/>

        <text x="84" y="214" class="svg-text svg-text--strong" font-size="9">embriones</text>
        <text x="212" y="214" class="svg-text svg-text--strong" font-size="9">núcleos</text>
        <text x="86" y="170" class="svg-text svg-text--muted" font-size="8">inestable</text>
        <text x="228" y="170" class="svg-text svg-text--muted" font-size="8">estable</text>
        <text x="250" y="88" class="svg-text svg-text--accent" font-size="8">superficie</text>
        <text x="256" y="272" class="svg-text svg-text--rose" font-size="8">volumen</text>
        <text x="206" y="134" class="svg-text svg-text--green" font-size="8">ΔG total</text>
        <text x="188" y="172" class="svg-text svg-text--amber" font-size="9">r*</text>
      </svg>`,
      pins: [
        { n: 1, x: 250, y: 82, lx: 288, ly: 58, label: 'ΔG superficie (positiva)', q: '¿Qué curva representa el término de superficie?', detail: 'Crece con r² y es positiva: crear la interfase sólido–líquido cuesta energía y se opone a la nucleación.' },
        { n: 2, x: 250, y: 258, lx: 288, ly: 292, label: 'ΔG volumen (negativa)', q: '¿Qué curva representa el término de volumen?', detail: 'Crece en magnitud con r³ y es negativa: libera energía y favorece la solidificación.' },
        { n: 3, x: 206, y: 152, lx: 150, ly: 128, label: 'ΔG total (suma)', q: '¿Qué representa la curva verde?', detail: 'La energía libre total del sistema: suma algebraica del término de volumen y el de superficie.' },
        { n: 4, x: 182, y: 150, lx: 214, ly: 136, label: 'r*: radio crítico', q: '¿Qué representa el máximo de la curva total?', detail: 'El radio crítico r*: el máximo de ΔG. Es el punto de no retorno entre embrión y núcleo.' },
        { n: 5, x: 110, y: 186, lx: 104, ly: 226, label: 'Zona de embriones', q: '¿Cómo se llaman las partículas con r < r*?', detail: 'Embriones: son inestables, cualquier crecimiento aumenta ΔG y se vuelven a fundir.' },
        { n: 6, x: 250, y: 190, lx: 272, ly: 230, label: 'Zona de núcleos', q: '¿Cómo se llaman las partículas con r > r*?', detail: 'Núcleos: son estables; al crecer disminuye la energía total y el sólido crece.' },
        { n: 7, x: 96, y: 158, lx: 66, ly: 128, label: 'Se funde (inestable)', q: '¿Qué le ocurre a un embrión?', detail: 'Al no superar r*, reducir su radio disminuye ΔG: se redisuelve en el líquido.' },
        { n: 8, x: 228, y: 144, lx: 300, ly: 162, label: 'Crece (estable)', q: '¿Qué le ocurre a un núcleo?', detail: 'Superado r*, cada átomo que se agrega baja la energía del sistema: crece de manera constante y rápida.' },
        { n: 9, x: 58, y: 60, lx: 92, ly: 48, label: 'Eje ΔG (energía libre)', q: '¿Qué magnitud mide el eje vertical?', detail: 'El cambio de energía libre ΔG, con valores positivos arriba del origen y negativos abajo.' },
      ],
    },
  ],
};

const homogeneaHeterogenea = {
  id: 'homogenea-heterogenea',
  unit: 'u8',
  title: 'Nucleación homogénea vs. heterogénea',
  subtitle: 'Dónde nace el núcleo y cuánto cuesta',
  key: 'nucleacion-tipos',
  notes: [
    'La heterogénea necesita mucho menos subenfriamiento porque la superficie ya existe en parte.',
    'En la industria se agregan inoculantes para multiplicar los núcleos y obtener grano fino.',
  ],
  legend: [
    { color: 'accent', text: 'Núcleo formado' },
    { color: 'amber', text: 'Impurezas / pared' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'Comparación',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Nucleación homogénea y heterogénea">
        <rect x="14" y="46" width="158" height="180" rx="12" fill="var(--bg-soft)" stroke="var(--line-strong)"/>
        <rect x="188" y="46" width="158" height="180" rx="12" fill="var(--bg-soft)" stroke="var(--line-strong)"/>
        <text x="24" y="36" class="svg-text svg-text--strong" font-size="10">Homogénea</text>
        <text x="198" y="36" class="svg-text svg-text--strong" font-size="10">Heterogénea</text>

        <circle cx="58" cy="82" r="3" fill="var(--muted)"/>
        <circle cx="84" cy="70" r="3" fill="var(--muted)"/>
        <circle cx="112" cy="86" r="3" fill="var(--muted)"/>
        <circle cx="140" cy="74" r="3" fill="var(--muted)"/>
        <circle cx="64" cy="120" r="3" fill="var(--muted)"/>
        <circle cx="148" cy="118" r="3" fill="var(--muted)"/>
        <circle cx="94" cy="196" r="3" fill="var(--muted)"/>
        <circle cx="128" cy="182" r="3" fill="var(--muted)"/>
        <circle cx="62" cy="170" r="3" fill="var(--muted)"/>
        <circle cx="146" cy="202" r="3" fill="var(--muted)"/>

        <circle cx="96" cy="146" r="22" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
        <circle cx="88" cy="140" r="2.4" fill="var(--accent)"/>
        <circle cx="102" cy="140" r="2.4" fill="var(--accent)"/>
        <circle cx="96" cy="152" r="2.4" fill="var(--accent)"/>
        <text x="52" y="214" class="svg-text svg-text--muted" font-size="8">núcleo nace en el líquido</text>

        <path d="M268 60 l9 5 -9 5z" fill="var(--amber)"/>
        <path d="M240 106 l9 5 -9 5z" fill="var(--amber)"/>
        <path d="M292 130 l9 5 -9 5z" fill="var(--amber)"/>
        <path d="M256 176 l9 5 -9 5z" fill="var(--amber)"/>
        <circle cx="252" cy="92" r="16" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
        <circle cx="300" cy="118" r="13" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
        <circle cx="264" cy="188" r="11" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
        <line x1="330" y1="50" x2="330" y2="222" stroke="var(--amber)" stroke-width="5" stroke-linecap="round"/>
        <text x="196" y="214" class="svg-text svg-text--muted" font-size="8">el sólido se apoya: menos costo</text>

        <text x="22" y="276" class="svg-text svg-text--amber" font-size="8">requiere más subenfriamiento</text>
        <text x="204" y="276" class="svg-text svg-text--green" font-size="8">requiere menos subenfriamiento</text>
      </svg>`,
      pins: [
        { n: 1, x: 96, y: 146, lx: 66, ly: 118, label: 'Núcleo dentro del líquido', q: '¿Dónde nuclea la homogénea?', detail: 'En el líquido puro, formando el núcleo completo desde cero: hay que crear toda la interfase.' },
        { n: 2, x: 252, y: 92, lx: 214, ly: 72, label: 'Núcleo sobre una impureza', q: '¿Dónde nuclea la heterogénea?', detail: 'Sobre una superficie existente (impureza o pared del molde): gasta menos energía de interfase.' },
        { n: 3, x: 268, y: 65, lx: 300, ly: 62, label: 'Impureza (sustrato)', q: '¿Qué papel cumplen las impurezas?', detail: 'Ofrecen una superficie sobre la que el sólido se apoya: son sustratos de nucleación.' },
        { n: 4, x: 330, y: 150, lx: 322, ly: 176, label: 'Pared del molde', q: '¿Qué otra superficie puede actuar como sustrato?', detail: 'La pared del molde. Por eso en la práctica domina la nucleación heterogénea.' },
        { n: 5, x: 40, y: 240, lx: 104, ly: 232, label: 'Mayor subenfriamiento', q: '¿Qué requiere la homogénea?', detail: 'Más subenfriamiento, porque debe crear toda la interfase y eso cuesta energía.' },
        { n: 6, x: 242, y: 240, lx: 300, ly: 232, label: 'Menor subenfriamiento', q: '¿Qué requiere la heterogénea?', detail: 'Mucho menos subenfriamiento: la interfase ya existe en parte y el sólido se apoya.' },
      ],
    },
  ],
};

const mazarota = {
  id: 'mazarota',
  unit: 'u8',
  title: 'Mazarota y rechupe',
  subtitle: 'Chvorinov aplicado al diseño de la colada',
  key: 'mazarota',
  notes: [
    'La mazarota debe tener mayor V/A que la pieza para solidificar después y seguir alimentando.',
    'Si solidifica antes, la contracción deja un rechupe interno que se detecta por rayos X.',
  ],
  legend: [
    { color: 'amber', text: 'Mazarota' },
    { color: 'accent', text: 'Pieza' },
    { color: 'rose', text: 'Rechupe' },
  ],
  variants: [
    {
      key: 'con',
      label: 'Con mazarota',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Colada con mazarota">
        ${arrow('ar-mz')}
        <rect x="58" y="28" width="244" height="236" rx="10" fill="var(--surface-2)" stroke="var(--line-strong)" stroke-width="2"/>
        <rect x="152" y="46" width="58" height="74" rx="6" fill="var(--amber-soft)" stroke="var(--amber)" stroke-width="2"/>
        <rect x="172" y="118" width="18" height="14" fill="var(--amber-soft)" stroke="var(--amber)" stroke-width="1.6"/>
        <rect x="88" y="130" width="184" height="104" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
        <text x="158" y="92" class="svg-text svg-text--amber" font-size="9">mazarota</text>
        <text x="146" y="184" class="svg-text svg-text--accent" font-size="9">pieza</text>
        <path d="M181 124 L181 152" stroke="var(--amber)" stroke-width="2" marker-end="url(#ar-mz)"/>
        <text x="196" y="140" class="svg-text svg-text--muted" font-size="8">alimenta</text>
        <text x="92" y="254" class="svg-text svg-text--muted" font-size="8">molde de arena</text>
        <text x="240" y="52" class="svg-text svg-text--muted" font-size="7.5">mayor V/A</text>
        <text x="240" y="64" class="svg-text svg-text--muted" font-size="7.5">solidifica última</text>
      </svg>`,
      pins: [
        { n: 1, x: 181, y: 62, lx: 118, ly: 62, label: 'Mazarota: mayor V/A', q: '¿Por qué la mazarota tiene mayor V/A?', detail: 'Se diseña más compacta (esférica o cilíndrica alta) para tardar más en solidificar que la pieza.' },
        { n: 2, x: 132, y: 180, lx: 96, ly: 160, label: 'Pieza fundida', q: '¿Qué representa la cavidad inferior?', detail: 'La pieza. Se contrae al solidificar y necesita metal líquido de la mazarota.' },
        { n: 3, x: 181, y: 134, lx: 232, ly: 124, label: 'Canal de alimentación', q: '¿Qué función cumple la conexión?', detail: 'Conduce el líquido de la mazarota a la pieza mientras esta se contrae.' },
        { n: 4, x: 300, y: 104, lx: 296, ly: 130, label: 'Solidifica después que la pieza', q: '¿Cuándo debe solidificar la mazarota?', detail: 'Después de la pieza, para seguir alimentando el rechupe hasta el final.' },
      ],
    },
    {
      key: 'sin',
      label: 'Sin mazarota',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Colada sin mazarota, con rechupe">
        ${arrow('ar-mz2')}
        <rect x="58" y="28" width="244" height="236" rx="10" fill="var(--surface-2)" stroke="var(--line-strong)" stroke-width="2"/>
        <rect x="152" y="46" width="58" height="74" rx="6" fill="none" stroke="var(--amber)" stroke-width="2" stroke-dasharray="6 4" opacity="0.7"/>
        <text x="158" y="42" class="svg-text svg-text--amber" font-size="8">falta mazarota</text>
        <rect x="88" y="130" width="184" height="104" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
        <path d="M212 160 c 16 -10 30 8 22 22 c -6 12 -24 16 -32 6 c -8 -8 -4 -20 10 -28 z" fill="var(--rose-soft)" stroke="var(--rose)" stroke-width="2"/>
        <text x="146" y="184" class="svg-text svg-text--accent" font-size="9">pieza</text>
        <text x="230" y="152" class="svg-text svg-text--rose" font-size="8">rechupe</text>
        <text x="92" y="254" class="svg-text svg-text--muted" font-size="8">sin depósito que alimente</text>
      </svg>`,
      pins: [
        { n: 1, x: 224, y: 178, lx: 268, ly: 214, label: 'Rechupe (cavidad interna)', q: '¿Qué defecto aparece sin mazarota?', detail: 'Una cavidad interna por contracción. La inspección por rayos X la detecta.' },
        { n: 2, x: 120, y: 178, lx: 92, ly: 140, label: 'Pieza que se contrae', q: '¿Por qué aparece el rechupe?', detail: 'El metal se contrae al solidificar y nadie repone el volumen perdido.' },
        { n: 3, x: 181, y: 84, lx: 116, ly: 92, label: 'Sin alimentación', q: '¿Por qué falla el diseño?', detail: 'No hay depósito con mayor V/A que solidifique después: el rechupe queda dentro de la pieza.' },
      ],
    },
  ],
};

const enfriamiento = {
  id: 'enfriamiento',
  unit: 'u8',
  title: 'Curva de enfriamiento (metal puro)',
  subtitle: 'Líquido, meseta y sólido · tiempos local y total',
  key: 'enfriamiento',
  notes: [
    'Los tramos líquido y sólido son curvos: la velocidad de enfriamiento cambia con la temperatura.',
    'La única recta horizontal es la meseta en Tf; ahí no baja la temperatura porque se extrae calor latente.',
    'Tiempo local = inicio → fin de solidificación. Tiempo total = vaciado → fin de solidificación.',
  ],
  legend: [
    { color: 'accent', text: 'Líquido' },
    { color: 'amber', text: 'Líquido + sólido' },
    { color: 'violet', text: 'Sólido' },
    { color: 'rose', text: 'Tf' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'Curva T–t',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Curva de enfriamiento de un metal puro">
        ${arrow('ar-cu')}
        <line x1="52" y1="244" x2="344" y2="244" class="svg-axis" marker-end="url(#ar-cu)"/>
        <line x1="52" y1="244" x2="52" y2="28" class="svg-axis" marker-end="url(#ar-cu)"/>
        <text x="24" y="40" class="svg-text svg-text--strong" font-size="9">T</text>
        <text x="326" y="262" class="svg-text svg-text--strong" font-size="9">t</text>

        <line x1="38" y1="150" x2="336" y2="150" stroke="var(--rose)" stroke-width="1.4" stroke-dasharray="5 4"/>
        <text x="28" y="145" class="svg-text svg-text--rose" font-size="9">Tf</text>

        <path d="M70 52 C 92 98, 122 140, 150 150" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
        <path d="M150 150 L250 150" fill="none" stroke="var(--amber)" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M250 150 C 262 190, 298 232, 320 244" fill="none" stroke="var(--violet)" stroke-width="3" stroke-linecap="round"/>

        <line x1="150" y1="150" x2="150" y2="252" stroke="var(--line-strong)" stroke-width="1.1" stroke-dasharray="4 4"/>
        <line x1="250" y1="150" x2="250" y2="270" stroke="var(--line-strong)" stroke-width="1.1" stroke-dasharray="4 4"/>
        <line x1="70" y1="52" x2="70" y2="290" stroke="var(--line-strong)" stroke-width="1.1" stroke-dasharray="4 4"/>

        <line x1="150" y1="262" x2="250" y2="262" stroke="var(--amber)" stroke-width="1.4"/>
        <line x1="150" y1="256" x2="150" y2="268" stroke="var(--amber)" stroke-width="1.4"/>
        <line x1="250" y1="256" x2="250" y2="268" stroke="var(--amber)" stroke-width="1.4"/>
        <text x="200" y="250" text-anchor="middle" class="svg-text svg-text--amber" font-size="8">tiempo local</text>

        <line x1="70" y1="284" x2="250" y2="284" stroke="var(--accent)" stroke-width="1.4"/>
        <line x1="70" y1="278" x2="70" y2="290" stroke="var(--accent)" stroke-width="1.4"/>
        <line x1="250" y1="278" x2="250" y2="290" stroke="var(--accent)" stroke-width="1.4"/>
        <text x="160" y="278" text-anchor="middle" class="svg-text svg-text--accent" font-size="8">tiempo total</text>

        <text x="108" y="62" class="svg-text svg-text--accent" font-size="8">líquido</text>
        <text x="158" y="140" class="svg-text svg-text--amber" font-size="8">líquido + sólido</text>
        <text x="300" y="172" class="svg-text svg-text--violet" font-size="8">sólido</text>
      </svg>`,
      pins: [
        { n: 1, x: 88, y: 85, lx: 130, ly: 74, label: 'Líquido: 100 % líquido', q: '¿Qué estado y qué calor se eliminan en el primer tramo?', detail: 'El metal está 100 % líquido y sobrecalentado: se elimina calor específico del líquido y la temperatura baja.' },
        { n: 2, x: 112, y: 120, lx: 172, ly: 92, label: 'Rapidez de enfriamiento ΔT/Δt', q: '¿Qué representa la pendiente de la curva?', detail: 'La rapidez de enfriamiento: grados que baja por unidad de tiempo. Más empinada = más rápido.' },
        { n: 3, x: 80, y: 150, lx: 50, ly: 130, label: 'Tf: temperatura de fusión', q: '¿Qué indica la línea horizontal punteada?', detail: 'La temperatura de fusión/solidificación del metal puro. La meseta ocurre exactamente en Tf.' },
        { n: 4, x: 195, y: 150, lx: 196, ly: 180, label: 'Meseta: líquido + sólido', q: '¿Qué ocurre en la meseta de la curva?', detail: 'Se está solidificando: coexisten líquido y sólido y sólo se elimina calor latente de fusión. Por eso T no baja.' },
        { n: 5, x: 150, y: 150, lx: 122, ly: 192, label: 'Inicio de la solidificación', q: '¿Qué marca el comienzo de la meseta?', detail: 'Empieza la solidificación y también el tiempo local.' },
        { n: 6, x: 250, y: 150, lx: 284, ly: 178, label: 'Fin de la solidificación', q: '¿Qué marca el final de la meseta?', detail: 'Termina la solidificación: ya no queda líquido. Ahí termina el tiempo local (y el total).' },
        { n: 7, x: 286, y: 212, lx: 300, ly: 190, label: 'Sólido: 100 % sólido', q: '¿Qué calor se elimina en el último tramo?', detail: 'El metal ya es 100 % sólido: se elimina calor específico del sólido y la temperatura sigue bajando.' },
        { n: 8, x: 200, y: 262, lx: 246, ly: 252, label: 'Tiempo local', q: '¿Cómo se mide el tiempo de solidificación local?', detail: 'Desde el inicio hasta el fin de la solidificación (la meseta). Sólo incluye calor latente.' },
        { n: 9, x: 215, y: 284, lx: 255, ly: 298, label: 'Tiempo total', q: '¿Cómo se mide el tiempo de solidificación total?', detail: 'Desde el vaciado hasta el fin de la solidificación. Incluye el calor específico del líquido sobrecalentado + el latente.' },
        { n: 10, x: 70, y: 52, lx: 100, ly: 36, label: 'Vaciado (t = 0)', q: '¿Dónde comienza a contarse el tiempo total?', detail: 'En el vaciado: t = 0. Por eso el tiempo total es mayor que el local.' },
      ],
    },
  ],
};

const U8_DIAGRAMS = [nucleacion, enfriamiento];

  __CDM_MODULES__["diagrams/u8.js"] = { U8_DIAGRAMS };
})();

/* ===== diagrams/u9.js ===== */
(function () {
  "use strict";
/* ============================================================
   diagrams/u9.js — diagramas SVG interactivos de la unidad 9
   ============================================================ */

const arrow = (id) => `
  <defs>
    <marker id="${id}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 1 L10 5 L0 9 z" fill="var(--muted)"/>
    </marker>
  </defs>`;

const isomorfo = {
  id: 'isomorfo',
  unit: 'u9',
  title: 'Diagrama isomorfo Cu–Ni',
  subtitle: 'Liquidus, solidus y la isoterma de 1250 °C',
  key: 'isomorfo',
  notes: [
    'Por encima del liquidus todo es líquido L; por debajo del solidus todo es sólido α.',
    'Entre las dos curvas hay L + α: a 1250 °C con CA = 35 % Ni se leen CL = 32 % Ni y CS = 43 % Ni.',
    'El isomorfo no tiene solvus: Cu y Ni son solubles en todo el rango.',
  ],
  legend: [
    { color: 'accent', text: 'Liquidus' },
    { color: 'green', text: 'Solidus' },
    { color: 'amber', text: 'L + α' },
    { color: 'rose', text: 'Isoterma' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'Diagrama Cu–Ni',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Diagrama de fases isomorfo cobre-níquel con la isoterma de 1250 grados">
        ${arrow('ar-iso')}
        <line x1="58" y1="250" x2="344" y2="250" class="svg-axis" marker-end="url(#ar-iso)"/>
        <line x1="58" y1="250" x2="58" y2="30" class="svg-axis" marker-end="url(#ar-iso)"/>
        <text x="18" y="24" class="svg-text svg-text--strong" font-size="8">T (°C)</text>
        <text x="200" y="288" text-anchor="middle" class="svg-text svg-text--strong" font-size="8">% en peso de Ni</text>
        <text x="70" y="281" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">Cu</text>
        <text x="330" y="281" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">Ni</text>

        <g class="svg-grid" stroke="var(--line)" stroke-width="0.6" stroke-dasharray="2 4">
          <line x1="58" y1="198" x2="330" y2="198"/>
          <line x1="58" y1="146" x2="330" y2="146"/>
          <line x1="58" y1="94" x2="330" y2="94"/>
          <line x1="58" y1="42" x2="330" y2="42"/>
          <line x1="122" y1="42" x2="122" y2="250"/>
          <line x1="174" y1="42" x2="174" y2="250"/>
          <line x1="226" y1="42" x2="226" y2="250"/>
          <line x1="278" y1="42" x2="278" y2="250"/>
        </g>

        <text x="52" y="201" text-anchor="end" class="svg-text svg-text--muted" font-size="7">1200</text>
        <text x="52" y="149" text-anchor="end" class="svg-text svg-text--muted" font-size="7">1300</text>
        <text x="52" y="97" text-anchor="end" class="svg-text svg-text--muted" font-size="7">1400</text>
        <text x="52" y="45" text-anchor="end" class="svg-text svg-text--muted" font-size="7">1500</text>
        <text x="52" y="253" text-anchor="end" class="svg-text svg-text--muted" font-size="7">1100</text>
        <text x="70" y="264" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">0</text>
        <text x="122" y="264" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">20</text>
        <text x="174" y="264" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">40</text>
        <text x="226" y="264" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">60</text>
        <text x="278" y="264" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">80</text>
        <text x="330" y="264" text-anchor="middle" class="svg-text svg-text--muted" font-size="7">100</text>

        <path d="M70 250 C 105 235, 135 210, 153 172 C 170 145, 200 135, 226 115 C 255 95, 300 72, 330 65"
          fill="none" stroke="var(--accent)" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M70 250 C 105 244, 145 228, 174 177 C 178 174, 180 173, 182 172 C 195 160, 210 148, 226 136 C 255 117, 300 80, 330 65"
          fill="none" stroke="var(--green)" stroke-width="2.6" stroke-linecap="round"/>

        <text x="100" y="110" class="svg-text svg-text--accent" font-size="9">L</text>
        <text x="196" y="142" class="svg-text svg-text--amber" font-size="8">L + α</text>
        <text x="244" y="224" class="svg-text svg-text--green" font-size="9">α</text>

        <line x1="153" y1="172" x2="182" y2="172" stroke="var(--rose)" stroke-width="2.2" stroke-dasharray="4 3"/>
        <text x="167" y="162" text-anchor="middle" class="svg-text svg-text--rose" font-size="6.5">isoterma</text>
        <line x1="161" y1="172" x2="161" y2="250" stroke="var(--line-strong)" stroke-width="1" stroke-dasharray="3 4"/>
        <text x="58" y="168" text-anchor="end" class="svg-text svg-text--rose" font-size="7">1250</text>
        <text x="161" y="246" text-anchor="middle" class="svg-text svg-text--muted" font-size="6.5">35</text>
      </svg>`,
      pins: [
        { n: 1, x: 100, y: 110, lx: 112, ly: 96, label: 'Zona líquida (L)', q: '¿Qué hay por encima del liquidus?', detail: 'Todo líquido. Al cruzar el liquidus empieza a formarse el primer sólido α.' },
        { n: 2, x: 132, y: 210, lx: 112, ly: 214, label: 'Liquidus', q: '¿Qué separa la línea de liquidus?', detail: 'Separa todo líquido (arriba) de la zona L + α. Es la temperatura a la que aparece el primer sólido para esa composición.' },
        { n: 3, x: 110, y: 242, lx: 96, ly: 258, label: 'Solidus', q: '¿Qué separa la línea de solidus?', detail: 'Separa la zona L + α (arriba) de todo sólido α (abajo). Al cruzarlo desaparece la última gota de líquido.' },
        { n: 4, x: 210, y: 140, lx: 236, ly: 128, label: 'Zona L + α', q: '¿Qué hay entre liquidus y solidus?', detail: 'Coexisten líquido y sólido α. Cada fase tiene su propia composición: CL en el liquidus y CS en el solidus.' },
        { n: 5, x: 250, y: 220, lx: 272, ly: 236, label: 'Fase sólida α', q: '¿Qué hay por debajo del solidus?', detail: 'Todo sólido α: una sola fase con estructura FCC, rica en Ni para esta aleación.' },
        { n: 6, x: 153, y: 172, lx: 140, ly: 158, label: 'CL = 32 % Ni (68 % Cu)', q: '¿Dónde se lee CL?', detail: 'En el liquidus, sobre la isoterma. Es la composición del líquido: 32 % Ni y 68 % Cu (más rica en Cu, el de menor punto de fusión).' },
        { n: 7, x: 182, y: 172, lx: 196, ly: 158, label: 'CS = 43 % Ni (57 % Cu)', q: '¿Dónde se lee CS?', detail: 'En el solidus, sobre la isoterma. Es la composición del sólido α: 43 % Ni y 57 % Cu (más rico en Ni, el de mayor punto de fusión).' },
        { n: 8, x: 161, y: 202, lx: 132, ly: 214, label: 'CA = 35 % Ni (65 % Cu)', q: '¿Qué es CA y cuánto vale?', detail: 'La composición global de la aleación es 35 % Ni y 65 % Cu. Es una vertical fija; no cambia al enfriar. CL y CS son las composiciones de cada fase.' },
      ],
    },
  ],
};

const curvaAleacion = {
  id: 'curva-aleacion',
  unit: 'u9',
  title: 'Curva de enfriamiento de la aleación',
  subtitle: 'Dos quiebres: liquidus y solidus, sin meseta',
  key: 'curva-aleacion',
  notes: [
    'La aleación isomorfa no tiene meseta: la temperatura sigue bajando entre liquidus y solidus.',
    'Las ramas del líquido y del sólido son curvas, y el tramo L + α también: no hay tramos rectos salvo la referencia de temperatura.',
    'El primer quiebre es el liquidus (aparece el primer sólido); el segundo es el solidus (desaparece el último líquido).',
    'En el metal puro de la U8 hay una sola meseta horizontal en Tf. En la U10, el eutéctico también tendrá una meseta.',
  ],
  legend: [
    { color: 'accent', text: 'Líquido' },
    { color: 'amber', text: 'L + α' },
    { color: 'green', text: 'Sólido α' },
    { color: 'rose', text: 'Liquidus / solidus' },
  ],
  variants: [
    {
      key: 'unica',
      label: 'Curva T–t',
      svg: `
      <svg viewBox="0 0 360 300" role="img" aria-label="Curva de enfriamiento de una aleación isomorfa con liquidus y solidus">
        ${arrow('ar-cu9')}
        <line x1="58" y1="250" x2="344" y2="250" class="svg-axis" marker-end="url(#ar-cu9)"/>
        <line x1="58" y1="250" x2="58" y2="30" class="svg-axis" marker-end="url(#ar-cu9)"/>
        <text x="20" y="40" class="svg-text svg-text--strong" font-size="9">T</text>
        <text x="326" y="268" class="svg-text svg-text--strong" font-size="9">t</text>

        <line x1="60" y1="156" x2="330" y2="156" stroke="var(--rose)" stroke-width="1.3" stroke-dasharray="5 4"/>
        <line x1="60" y1="177" x2="330" y2="177" stroke="var(--rose)" stroke-width="1.3" stroke-dasharray="5 4"/>
        <text x="245" y="150" text-anchor="start" class="svg-text svg-text--rose" font-size="6.5">1280 °C · liquidus</text>
        <text x="245" y="168" text-anchor="start" class="svg-text svg-text--rose" font-size="6.5">1240 °C · solidus</text>

        <path d="M70 45 C 96 76, 126 124, 140 156" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
        <path d="M140 156 C 166 157, 195 165, 215 177" fill="none" stroke="var(--amber)" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M215 177 C 236 200, 280 228, 315 244" fill="none" stroke="var(--green)" stroke-width="3" stroke-linecap="round"/>

        <text x="94" y="86" class="svg-text svg-text--accent" font-size="9">L</text>
        <text x="160" y="118" class="svg-text svg-text--amber" font-size="8">L + α</text>
        <text x="272" y="226" class="svg-text svg-text--green" font-size="9">α</text>

        <line x1="318" y1="156" x2="318" y2="177" stroke="var(--violet)" stroke-width="1.2"/>
        <line x1="313" y1="156" x2="323" y2="156" stroke="var(--violet)" stroke-width="1.2"/>
        <line x1="313" y1="177" x2="323" y2="177" stroke="var(--violet)" stroke-width="1.2"/>
        <text x="330" y="170" text-anchor="end" class="svg-text svg-text--violet" font-size="7">ΔT</text>
      </svg>`,
      pins: [
        { n: 1, x: 70, y: 45, lx: 100, ly: 34, label: 'Vaciado (t = 0)', q: '¿Dónde empieza la curva?', detail: 'En el vaciado, con el metal 100 % líquido. La temperatura baja mientras se enfría el líquido.' },
        { n: 2, x: 140, y: 156, lx: 122, ly: 142, label: 'Liquidus: primer sólido', q: '¿Qué ocurre en el primer quiebre?', detail: 'Se llega al liquidus y aparece el primer sólido α. Empieza a liberarse calor latente y la pendiente se hace menos empinada.' },
        { n: 3, x: 180, y: 168, lx: 166, ly: 190, label: 'Zona L + α', q: '¿Qué pasa entre los dos quiebres?', detail: 'Líquido y sólido α coexisten. La temperatura sigue bajando: no hay meseta. Las composiciones cambian siguiendo liquidus y solidus.' },
        { n: 4, x: 215, y: 177, lx: 238, ly: 190, label: 'Solidus: último líquido', q: '¿Qué ocurre en el segundo quiebre?', detail: 'Desaparece la última gota de líquido. Termina la solidificación y el sólido α vuelve a enfriarse: la pendiente se hace más empinada.' },
        { n: 5, x: 280, y: 225, lx: 298, ly: 238, label: 'Sólido α enfriándose', q: '¿Qué pasa después del solidus?', detail: 'Ya es 100 % sólido α. Se elimina calor específico del sólido y la temperatura sigue bajando.' },
        { n: 6, x: 300, y: 90, lx: 280, ly: 76, label: 'No hay meseta', q: '¿Por qué esta curva no tiene meseta?', detail: 'Porque la solidificación ocurre en un rango de temperaturas: el calor latente se libera entre liquidus y solidus, no a temperatura constante.' },
      ],
    },
  ],
};

const U9_DIAGRAMS = [isomorfo, curvaAleacion];

  __CDM_MODULES__["diagrams/u9.js"] = { U9_DIAGRAMS };
})();

/* ===== diagrams/index.js ===== */
(function () {
  "use strict";
/* ============================================================
   diagrams/index.js — registro de diagramas
   ============================================================ */

const { U6_DIAGRAMS } = __CDM_MODULES__["diagrams/u6.js"];
const { U8_DIAGRAMS } = __CDM_MODULES__["diagrams/u8.js"];
const { U9_DIAGRAMS } = __CDM_MODULES__["diagrams/u9.js"];

const ALL_DIAGRAMS = [...U6_DIAGRAMS, ...U8_DIAGRAMS, ...U9_DIAGRAMS];

function getDiagram(id) {
  return ALL_DIAGRAMS.find((diagram) => diagram.id === id) || null;
}

function diagramsForUnit(unitId) {
  return ALL_DIAGRAMS.filter((diagram) => diagram.unit === unitId);
}

function diagramPinCount(diagram, variantKey) {
  const variant = variantKey
    ? diagram.variants.find((item) => item.key === variantKey)
    : diagram.variants[0];
  return variant ? variant.pins.length : 0;
}

  __CDM_MODULES__["diagrams/index.js"] = { getDiagram, diagramsForUnit, diagramPinCount, ALL_DIAGRAMS };
})();

/* ===== core/sessions.js ===== */
(function () {
  "use strict";
/* ============================================================
   sessions.js — construcción de sesiones de quiz y tarjetas
   ============================================================ */

const { ALL_QUIZ, ALL_CARDS, getTopic } = __CDM_MODULES__["data/index.js"];
const { getState } = __CDM_MODULES__["core/store.js"];
const { isDue, sortByPriority } = __CDM_MODULES__["core/srs.js"];
const { shuffle } = __CDM_MODULES__["core/utils.js"];

const SCOPE_LABELS = {
  mix: 'Repaso mixto',
  u6: 'Unidad 6',
  u8: 'Unidad 8',
  u9: 'Unidad 9',
  due: 'Pendientes de hoy',
  weak: 'Puntos débiles',
  new: 'Preguntas nuevas',
  exam: 'Examen rápido',
  topic: 'Tema',
  calc: 'Cálculos',
};

function scopeLabel(scope, topic) {
  if (scope === 'topic') return topic ? getTopic(topic).label : 'Tema';
  return SCOPE_LABELS[scope] || 'Práctica';
}

function unitFiltered(items, scope) {
  if (['u6', 'u8', 'u9'].includes(scope)) return items.filter((item) => item.unit === scope);
  return items;
}

function quizDueCount(scope = 'mix', topic = '') {
  const state = getState();
  return baseQuizPool(scope, topic).filter((item) => isDue(state.quiz[item.id])).length;
}

function cardsDueCount(unit = 'mix') {
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
function buildQuizSession({ scope = 'mix', topic = '', n = 10 } = {}) {
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

function buildCardSession({ scope = 'mix', n = 20 } = {}) {
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

function quizCountForTopic(topic) {
  return ALL_QUIZ.filter((question) => question.topic === topic).length;
}

function newQuizCount() {
  const state = getState();
  return ALL_QUIZ.filter((question) => !state.quiz[question.id]).length;
}

function masteredQuizCount(unitId) {
  const state = getState();
  const pool = unitId ? ALL_QUIZ.filter((question) => question.unit === unitId) : ALL_QUIZ;
  return pool.filter((question) => (state.quiz[question.id]?.box || 0) >= 4).length;
}

  __CDM_MODULES__["core/sessions.js"] = { scopeLabel, quizDueCount, cardsDueCount, buildQuizSession, buildCardSession, quizCountForTopic, newQuizCount, masteredQuizCount, SCOPE_LABELS };
})();

/* ===== views/home.js ===== */
(function () {
  "use strict";
/* ============================================================
   views/home.js — pantalla de inicio
   ============================================================ */

const { ALL_LESSONS, ALL_QUIZ, ALL_FORMULAS, UNIT_LIST, getLesson, getUnit } = __CDM_MODULES__["data/index.js"];
const { ALL_DIAGRAMS } = __CDM_MODULES__["diagrams/index.js"];
const { getState, lessonRead, dailySummary } = __CDM_MODULES__["core/store.js"];
const { quizDueCount, cardsDueCount } = __CDM_MODULES__["core/sessions.js"];
const { icon, ring, bar } = __CDM_MODULES__["core/ui.js"];
const { percent, formatNumber } = __CDM_MODULES__["core/utils.js"];

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

function homeView() {
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
          <p class="card__sub">Chvorinov y regla de la palanca</p>
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

  __CDM_MODULES__["views/home.js"] = { homeView };
})();

/* ===== views/partials.js ===== */
(function () {
  "use strict";
/* ============================================================
   views/partials.js — piezas de interfaz reutilizables
   ============================================================ */

const { icon } = __CDM_MODULES__["core/ui.js"];
const { getTopic, TOPICS } = __CDM_MODULES__["data/index.js"];
const { esc } = __CDM_MODULES__["core/utils.js"];

function pageHead({ eyebrow = '', eyebrowTone = '', title, sub = '', action = '' }) {
  return `
    <div class="page-head">
      <div class="page-head__main">
        ${eyebrow ? `<div class="eyebrow ${eyebrowTone}">${eyebrow}</div>` : ''}
        <h2>${title}</h2>
        ${sub ? `<p>${sub}</p>` : ''}
      </div>
      ${action ? `<div class="page-head__action">${action}</div>` : ''}
    </div>`;
}

const UNIT_BADGE = { u6: 'badge--accent', u8: 'badge--warn', u9: 'badge--ok' };

function unitPill(unitId) {
  const number = String(unitId).replace(/^u/, '');
  return `<span class="badge ${UNIT_BADGE[unitId] || 'badge'}">U${number}</span>`;
}

function topicPill(topicId) {
  const topic = getTopic(topicId);
  return `<span class="badge">${esc(topic.label)}</span>`;
}

function lessonTopic(lesson) {
  const keys = Object.keys(TOPICS).sort((a, b) => b.length - a.length);
  return keys.find((key) => lesson.id.includes(key)) || null;
}

const calloutIcons = {
  warn: 'alert',
  tip: 'bulb',
  trap: 'alert',
  prof: 'graduation',
  info: 'info',
};

function renderBlocks(blocks = []) {
  return blocks.map((block) => {
    switch (block.t) {
      case 'p':
        return `<p>${block.html}</p>`;
      case 'ul':
        return `<ul class="ticks">${block.items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
      case 'ol':
        return `<ol class="steps">${block.items.map((item) => `<li>${item}</li>`).join('')}</ol>`;
      case 'formula':
        return `<div class="formula ${block.tone ? `formula--${block.tone}` : ''}">
          <div class="formula__expr">${block.html || block.expr}</div>
          ${block.note ? `<div class="formula__note">${block.note}</div>` : ''}
        </div>`;
      case 'callout':
        return `<div class="callout callout--${block.tone || 'info'}">
          <div class="callout__icon">${icon(calloutIcons[block.tone] || 'info')}</div>
          <div>
            ${block.title ? `<h4>${block.title}</h4>` : ''}
            <p>${block.html}</p>
          </div>
        </div>`;
      case 'table':
        return `<div class="table-wrap">
          <table class="data">
            <thead><tr>${block.head.map((th) => `<th>${th}</th>`).join('')}</tr></thead>
            <tbody>${block.rows.map((row) => `<tr>${row.map((td, index) => `<td data-label="${String(block.head[index] || '').replace(/"/g, '&quot;')}">${td}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>
        ${block.caption ? `<p class="tiny muted" style="margin-top:6px;line-height:1.4">${block.caption}</p>` : ''}`;
      case 'diagram':
        return `<a class="row-card" href="#/teoria/diagramas/${block.id}">
          <span class="row-card__num">${icon('chart')}</span>
          <span class="row-card__main">
            <span class="row-card__title">${block.label || 'Abrir diagrama interactivo'}</span>
            <span class="row-card__meta">Diagrama · estudiar o practicar con pines</span>
          </span>
          <svg class="row-card__chev"><use href="#i-chevron-right"></use></svg>
        </a>`;
      case 'lab':
        return `<a class="row-card" href="#/practica/simuladores/${block.id}">
          <span class="row-card__num">${icon('calculator')}</span>
          <span class="row-card__main">
            <span class="row-card__title">${block.label || 'Abrir simulador'}</span>
            <span class="row-card__meta">Simulador · calcular y entrenar</span>
          </span>
          <svg class="row-card__chev"><use href="#i-chevron-right"></use></svg>
        </a>`;
      case 'mini':
        return `<div class="mini-title">${block.html}</div>`;
      case 'note':
        return `<div class="note">${block.html}</div>`;
      default:
        return '';
    }
  }).join('');
}

function formulaCard(formula, { maskable = false } = {}) {
  return `<div class="fcard ${maskable ? 'is-masked' : ''}" data-formula="${formula.id}">
    <div class="fcard__head">
      <span class="fcard__name">${esc(formula.name)}</span>
      ${maskable ? `<button class="btn btn--xs btn--ghost" type="button" data-reveal="${formula.id}" aria-label="Mostrar u ocultar fórmula">${icon('bulb', 'icon--xs')}</button>` : ''}
    </div>
    <div class="fcard__expr" data-mask-target="${formula.id}">${formula.html || formula.expr}</div>
    ${formula.note ? `<div class="fcard__note">${formula.note}</div>` : ''}
  </div>`;
}

function segmentedTabs(items, activeKey, { hrefFor } = {}) {
  return `<div class="segmented" role="tablist">
    ${items.map((item) => {
      const active = item.key === activeKey;
      const href = hrefFor ? hrefFor(item.key) : item.href;
      return `<a role="tab" aria-selected="${active}" href="${href}" ${active ? 'aria-current="page"' : ''}>${item.label}</a>`;
    }).join('')}
  </div>`;
}

function diagramCard(diagram, solved, total) {
  return `<a class="diagram-card" href="#/teoria/diagramas/${diagram.id}">
    <span class="diagram-card__thumb diagram-card__thumb--${diagram.unit}">${icon('chart')}</span>
    <span class="row-card__main">
      <span class="row-card__title">${esc(diagram.title)}</span>
      <span class="row-card__meta">${esc(diagram.subtitle)} · ${solved}/${total} puntos</span>
    </span>
    <svg class="row-card__chev"><use href="#i-chevron-right"></use></svg>
  </a>`;
}

  __CDM_MODULES__["views/partials.js"] = { pageHead, unitPill, topicPill, lessonTopic, renderBlocks, formulaCard, segmentedTabs, diagramCard };
})();

/* ===== views/theory.js ===== */
(function () {
  "use strict";
/* ============================================================
   views/theory.js — hub de teoría y lección
   ============================================================ */

const { UNIT_LIST, getUnit, getLesson, TOPICS } = __CDM_MODULES__["data/index.js"];
const { lessonRead, lessonsReadCount, markLessonRead } = __CDM_MODULES__["core/store.js"];
const { icon, bar, toast } = __CDM_MODULES__["core/ui.js"];
const { percent } = __CDM_MODULES__["core/utils.js"];
const { pageHead, renderBlocks, unitPill, topicPill, lessonTopic, segmentedTabs } = __CDM_MODULES__["views/partials.js"];

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

function theoryView() {
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

function lessonView({ params }) {
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

  __CDM_MODULES__["views/theory.js"] = { theoryView, lessonView };
})();

/* ===== views/diagrams.js ===== */
(function () {
  "use strict";
/* ============================================================
   views/diagrams.js — lista y visor interactivo de diagramas
   ============================================================ */

const { ALL_DIAGRAMS, getDiagram, diagramsForUnit } = __CDM_MODULES__["diagrams/index.js"];
const { diagramSolvedPins, markDiagramPin, resetDiagram } = __CDM_MODULES__["core/store.js"];
const { icon, bar, openSheet, toast, haptic, closeSheet } = __CDM_MODULES__["core/ui.js"];
const { clamp, esc, shuffle, percent } = __CDM_MODULES__["core/utils.js"];
const { pageHead, unitPill, segmentedTabs, diagramCard } = __CDM_MODULES__["views/partials.js"];
const { UNIT_LIST } = __CDM_MODULES__["data/index.js"];

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
  isomorfo: 'isomorfo',
  'curva-aleacion': 'curva-aleacion',
};

const DIAGRAM_SECTION = {
  u6: 'Diagramas de ensayos',
  u8: 'Diagramas de solidificación',
  u9: 'Diagramas de fases',
};

const EYEBROW_TONE = { u6: '', u8: 'eyebrow--u8', u9: 'eyebrow--u9' };

function totalPins(diagram) {
  return diagram.variants.reduce((acc, variant) => acc + variant.pins.length, 0);
}

function totalSolved(diagram) {
  return diagram.variants.reduce((acc, variant) => {
    const solved = diagramSolvedPins(`${diagram.id}:${variant.key}`);
    return acc + variant.pins.filter((pin) => solved.includes(pin.n)).length;
  }, 0);
}

function diagramsListView() {
  const sections = UNIT_LIST.map((unit) => {
    const diagrams = diagramsForUnit(unit.id);
    return `<section class="section">
      <div class="section__head">
        <div class="section__title">${unitPill(unit.id)} ${DIAGRAM_SECTION[unit.id] || `Diagramas de la Unidad ${unit.number}`}</div>
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

function diagramView({ params, query }) {
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
      eyebrow: `Unidad ${Number(diagram.unit.slice(1))} · diagrama interactivo`,
      eyebrowTone: EYEBROW_TONE[diagram.unit] || '',
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
        <div style="flex:1">${bar(pct, diagram.unit)}</div>
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
    sub: `Unidad ${Number(diagram.unit.slice(1))}`,
    nav: 'teoria',
    back,
  };
}

function diagramCounts() {
  return ALL_DIAGRAMS.length;
}

  __CDM_MODULES__["views/diagrams.js"] = { diagramsListView, diagramView, diagramCounts };
})();

/* ===== core/text.js ===== */
(function () {
  "use strict";
/* ============================================================
   text.js — normalización de texto para búsquedas y respuestas
   ============================================================ */

function normalize(value) {
  return String(value == null ? '' : value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function includesNormalized(haystack, needle) {
  return normalize(haystack).includes(normalize(needle));
}

  __CDM_MODULES__["core/text.js"] = { normalize, includesNormalized };
})();

/* ===== views/formulas.js ===== */
(function () {
  "use strict";
/* ============================================================
   views/formulas.js — hoja de fórmulas con modo ocultar
   ============================================================ */

const { ALL_FORMULAS, UNIT_LIST } = __CDM_MODULES__["data/index.js"];
const { icon } = __CDM_MODULES__["core/ui.js"];
const { normalize } = __CDM_MODULES__["core/text.js"];
const { pageHead, formulaCard, segmentedTabs } = __CDM_MODULES__["views/partials.js"];

const TABS = [
  { key: 'temas', label: 'Temas', href: '#/teoria' },
  { key: 'diagramas', label: 'Diagramas', href: '#/teoria/diagramas' },
  { key: 'formulas', label: 'Fórmulas', href: '#/teoria/formulas' },
];

// Los grupos se derivan del contenido, en el orden en que aparecen las fórmulas.
const FORMULA_UNITS = UNIT_LIST.filter((unit) => unit.formulas.length > 0);

const GROUP_ORDER = [...new Set(ALL_FORMULAS.map((formula) => `${formula.unit}|${formula.group}`))]
  .map((key) => {
    const [unit, name] = key.split('|');
    return { unit, name };
  });

function formulasView() {
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
      ${FORMULA_UNITS.map((unit) => `<button class="chip" type="button" data-unit="${unit.id}" aria-pressed="false">Unidad ${unit.number}</button>`).join('')}
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

  __CDM_MODULES__["views/formulas.js"] = { formulasView };
})();

/* ===== views/ensayos.js ===== */
(function () {
  "use strict";
/* ============================================================
   views/ensayos.js — catálogo de ensayos y detalle
   ============================================================ */

const { ENSAYOS, ENSAYO_CATEGORIES, CHARPY_VS_IZOD, getEnsayo } = __CDM_MODULES__["data/index.js"];
const { icon } = __CDM_MODULES__["core/ui.js"];
const { pageHead } = __CDM_MODULES__["views/partials.js"];

const CATEGORY_LABEL = Object.fromEntries(ENSAYO_CATEGORIES.map((category) => [category.id, category.label]));

const TOPIC_BY_ENSAYO = {
  traccion: 'traccion',
  'flexion-3': 'flexion',
  'flexion-4': 'flexion',
  brinell: 'dureza',
  rockwell: 'dureza',
  vickers: 'dureza',
  knoop: 'dureza',
  shore: 'dureza',
  'impacto-charpy': 'impacto',
  'impacto-izod': 'impacto',
  fatiga: 'fatiga',
};

function ensayoCard(ensayo) {
  return `<a class="row-card" href="#/ensayos/${ensayo.id}" style="align-items:flex-start">
    <span class="row-card__num" style="color:${ensayo.highlight ? 'var(--amber)' : 'var(--accent)'}">${icon(ensayo.icon, 'icon--sm')}</span>
    <span class="row-card__main">
      <span class="row-card__title">${ensayo.name} ${ensayo.highlight ? '<span class="badge badge--warn" style="margin-left:4px">clave</span>' : ''}</span>
      <span class="row-card__meta">${ensayo.summary}</span>
      <span class="row-card__meta" style="color:var(--muted)">${CATEGORY_LABEL[ensayo.category]} · ${ensayo.tag}</span>
    </span>
    <svg class="row-card__chev"><use href="#i-chevron-right"></use></svg>
  </a>`;
}

function ensayosView() {
  const state = { category: 'todos' };

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: 'Unidad 6',
      title: 'Ensayos mecánicos',
      sub: 'Qué mide cada ensayo, cómo se hace y qué pregunta en el parcial. Impacto con Charpy e Izod en detalle.',
    })}
    <div class="chip-row" data-filters>
      ${ENSAYO_CATEGORIES.map((category) => `<button class="chip" type="button" data-category="${category.id}" aria-pressed="${category.id === 'todos'}">${category.label}</button>`).join('')}
    </div>
    <div id="ensayoList" class="stack stack--sm"></div>
    <section class="section">
      <div class="section__head"><div class="section__title">Comparación clave</div></div>
      <div class="card">
        <h3 style="font-size:0.95rem">Charpy vs. Izod</h3>
        <p class="card__sub">La diferencia del lado del golpe es la pregunta más repetida.</p>
        <div class="table-wrap" style="margin-top:10px">
          <table class="data">
            <thead><tr>${CHARPY_VS_IZOD.head.map((th) => `<th>${th}</th>`).join('')}</tr></thead>
            <tbody>${CHARPY_VS_IZOD.rows.map((row) => `<tr>${row.map((td, index) => `<td data-label="${CHARPY_VS_IZOD.head[index]}">${td}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>
        <a class="btn btn--soft btn--block" style="margin-top:10px" href="#/teoria/diagramas/impacto">${icon('chart')} Ver diagrama interactivo</a>
      </div>
    </section>
  `;

  const list = el.querySelector('#ensayoList');

  const render = () => {
    const filtered = ENSAYOS.filter((ensayo) => state.category === 'todos' || ensayo.category === state.category);
    list.innerHTML = filtered.length
      ? filtered.map(ensayoCard).join('')
      : `<div class="empty">${icon('flask')}<h3>Sin ensayos</h3><p>Cambiá el filtro para ver otros.</p></div>`;
  };

  el.querySelectorAll('[data-category]').forEach((chip) => {
    chip.addEventListener('click', () => {
      state.category = chip.dataset.category;
      el.querySelectorAll('[data-category]').forEach((item) => item.setAttribute('aria-pressed', String(item === chip)));
      render();
    });
  });

  render();

  return { el, title: 'Ensayos', sub: 'Unidad 6', nav: 'ensayos', back: null };
}

function ensayoView({ params }) {
  const ensayo = getEnsayo(params.id);
  if (!ensayo) {
    const el = document.createElement('div');
    el.className = 'page';
    el.innerHTML = `${pageHead({ eyebrow: 'Ensayos', title: 'Ensayo no encontrado' })}
      <a class="btn btn--primary" href="#/ensayos">Ver todos</a>`;
    return { el, title: 'Ensayos', nav: 'ensayos', back: '/ensayos' };
  }

  const index = ENSAYOS.findIndex((item) => item.id === ensayo.id);
  const previous = ENSAYOS[index - 1];
  const next = ENSAYOS[index + 1];
  const topic = TOPIC_BY_ENSAYO[ensayo.id];

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    <div class="row row--wrap">
      <span class="badge badge--accent">${CATEGORY_LABEL[ensayo.category]}</span>
      <span class="badge">${ensayo.tag}</span>
      ${ensayo.highlight ? '<span class="badge badge--warn">Tema estrella</span>' : ''}
    </div>

    ${pageHead({ title: ensayo.name, sub: ensayo.summary })}

    <div class="callout callout--info">
      <div class="callout__icon">${icon('target')}</div>
      <div><h4>Qué mide</h4><p>${ensayo.measures}</p></div>
    </div>

    <div class="grid grid--2">
      <div class="stat"><div class="stat__label">Probeta / muestra</div><div class="stat__value" style="font-size:0.82rem;font-family:var(--font);font-weight:550;margin-top:4px;line-height:1.4">${ensayo.probeta}</div></div>
      <div class="stat"><div class="stat__label">Equipo</div><div class="stat__value" style="font-size:0.82rem;font-family:var(--font);font-weight:550;margin-top:4px;line-height:1.4">${ensayo.equipo}</div></div>
    </div>

    <section class="section">
      <div class="section__head"><div class="section__title">Cómo se hace</div></div>
      <div class="lesson-body" style="font-size:0.88rem"><ol class="steps">${ensayo.steps.map((step) => `<li>${step}</li>`).join('')}</ol></div>
    </section>

    <section class="section">
      <div class="section__head"><div class="section__title">Resultados</div></div>
      <div class="row row--wrap">${ensayo.results.map((result) => `<span class="chip">${result}</span>`).join('')}</div>
      ${ensayo.formula ? `<div class="formula" style="margin-top:6px">
        <div class="formula__expr">${ensayo.formula.html || ensayo.formula.expr}</div>
        <div class="formula__note">${ensayo.formula.note}</div>
      </div>` : ''}
      <p class="tiny muted">Unidades: ${ensayo.units}</p>
    </section>

    <div class="callout callout--tip">
      <div class="callout__icon">${icon('check-circle')}</div>
      <div><h4>Cuándo usarlo</h4><p>${ensayo.whenUse}</p></div>
    </div>

    <div class="callout callout--trap">
      <div class="callout__icon">${icon('alert')}</div>
      <div><h4>Errores típicos</h4><p>${ensayo.errors.join(' · ')}</p></div>
    </div>

    <details class="acc">
      <summary>${icon('graduation', 'icon--sm')} Pregunta típica de examen</summary>
      <div class="acc__body">
        <p><b>${ensayo.examQ.q}</b></p>
        <p style="margin-top:6px;color:var(--text)">${ensayo.examQ.a}</p>
      </div>
    </details>

    ${ensayo.diagram ? `<a class="btn btn--soft btn--block" href="#/teoria/diagramas/${ensayo.diagram}">${icon('chart')} Ver el diagrama</a>` : ''}
    ${topic ? `<a class="btn btn--primary btn--block" href="#/practica/quiz?scope=topic&topic=${topic}">${icon('target')} Practicar preguntas de este tema</a>` : ''}

    <div class="row" style="gap:8px">
      ${previous ? `<a class="btn btn--ghost btn--sm" href="#/ensayos/${previous.id}" style="flex:1;text-align:left">← ${previous.name}</a>` : ''}
      ${next ? `<a class="btn btn--ghost btn--sm" href="#/ensayos/${next.id}" style="flex:1;justify-content:flex-end;text-align:right">${next.name} →</a>` : ''}
    </div>
  `;

  return {
    el,
    title: ensayo.name,
    sub: `${CATEGORY_LABEL[ensayo.category]} · Unidad 6`,
    nav: 'ensayos',
    back: '/ensayos',
  };
}

  __CDM_MODULES__["views/ensayos.js"] = { ensayosView, ensayoView };
})();

/* ===== views/practice.js ===== */
(function () {
  "use strict";
/* ============================================================
   views/practice.js — hub de práctica
   ============================================================ */

const { ALL_QUIZ, ALL_CARDS, ALL_FORMULAS } = __CDM_MODULES__["data/index.js"];
const { quizDueCount, cardsDueCount, newQuizCount } = __CDM_MODULES__["core/sessions.js"];
const { getState, dailySummary } = __CDM_MODULES__["core/store.js"];
const { icon, ring, statTile } = __CDM_MODULES__["core/ui.js"];
const { percent } = __CDM_MODULES__["core/utils.js"];
const { pageHead } = __CDM_MODULES__["views/partials.js"];

function accuracyStats() {
  const state = getState();
  const entries = Object.values(state.quiz);
  const attempts = entries.reduce((acc, entry) => acc + (entry.seen || 0), 0);
  const oks = entries.reduce((acc, entry) => acc + (entry.ok || 0), 0);
  return { attempts, oks, accuracy: percent(oks, attempts) };
}

function practiceView() {
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

  __CDM_MODULES__["views/practice.js"] = { practiceView };
})();

/* ===== views/quiz.js ===== */
(function () {
  "use strict";
/* ============================================================
   views/quiz.js — motor de quiz con repaso espaciado
   ============================================================ */

const { getTopic } = __CDM_MODULES__["data/index.js"];
const { buildQuizSession, scopeLabel } = __CDM_MODULES__["core/sessions.js"];
const { recordQuizResult, recordSession } = __CDM_MODULES__["core/store.js"];
const { icon, bar, ring, toast, haptic, openSheet, scoreMessage } = __CDM_MODULES__["core/ui.js"];
const { clamp, esc, formatNumber, parseNumber, percent, shuffle } = __CDM_MODULES__["core/utils.js"];
const { navigate } = __CDM_MODULES__["core/router.js"];

function correctAnswerText(question) {
  if (question.type === 'mcq') return question.options[question.correct];
  return `${formatNumber(question.answer, 2)}${question.answerUnit ? ` ${question.answerUnit}` : ''}`;
}

function quizView({ query }) {
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

  __CDM_MODULES__["views/quiz.js"] = { quizView };
})();

/* ===== views/flashcards.js ===== */
(function () {
  "use strict";
/* ============================================================
   views/flashcards.js — tarjetas de memoria con autoevaluación
   ============================================================ */

const { getTopic, getUnit } = __CDM_MODULES__["data/index.js"];
const { buildCardSession, scopeLabel } = __CDM_MODULES__["core/sessions.js"];
const { recordCardResult, recordSession } = __CDM_MODULES__["core/store.js"];
const { icon, bar, ring, haptic, toast, confirmSheet, scoreMessage } = __CDM_MODULES__["core/ui.js"];
const { clamp, esc, percent } = __CDM_MODULES__["core/utils.js"];
const { navigate } = __CDM_MODULES__["core/router.js"];

function flashcardsView({ query }) {
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

  __CDM_MODULES__["views/flashcards.js"] = { flashcardsView };
})();

/* ===== data/shapes.js ===== */
(function () {
  "use strict";
/* ============================================================
   data/shapes.js — figuras básicas para Chvorinov
   V, A y V/A + siluetas SVG para el simulador
   ============================================================ */

const frac = (num, den) => `<span class="frac"><span class="frac__num">${num}</span><span class="frac__den">${den}</span></span>`;

const cubeIcon = `<svg viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
  <path d="M9 18 26 9l17 9v18L26 45 9 36z"/><path d="M9 18l17 9 17-9M26 27v18"/></svg>`;

const prismIcon = `<svg viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
  <path d="M6 20 22 11h24v21L30 41H6z"/><path d="M6 20h24M30 20v21M30 20l16-9"/></svg>`;

const cylinderIcon = `<svg viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="2">
  <ellipse cx="26" cy="13" rx="15" ry="6"/><path d="M11 13v26a15 6 0 0 0 30 0V13"/></svg>`;

const sphereIcon = `<svg viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="26" cy="26" r="17"/><ellipse cx="26" cy="26" rx="17" ry="6"/></svg>`;

const SHAPES = [
  {
    id: 'cubo',
    name: 'Cubo',
    note: 'El caso más simple y el más probable en el examen.',
    icon: cubeIcon,
    dims: [{ key: 'a', label: 'Lado a', unit: 'cm', min: 1, max: 100, step: 0.5, value: 10 }],
    formulas: { v: 'V = a³', a: 'A = 6a²', va: 'V/A = a/6' },
    html: { v: 'V = a³', a: 'A = 6a²', va: `V/A = ${frac('a','6')}` },
    compute: ({ a }) => ({ V: a ** 3, A: 6 * a ** 2, VA: a / 6 }),
  },
  {
    id: 'prisma',
    name: 'Prisma',
    note: 'Figura «tipo caja»: seis caras en tres pares iguales.',
    icon: prismIcon,
    dims: [
      { key: 'a', label: 'Lado a', unit: 'cm', min: 1, max: 100, step: 0.5, value: 6 },
      { key: 'b', label: 'Lado b', unit: 'cm', min: 1, max: 100, step: 0.5, value: 8 },
      { key: 'c', label: 'Lado c', unit: 'cm', min: 1, max: 100, step: 0.5, value: 10 },
    ],
    formulas: { v: 'V = a·b·c', a: 'A = 2(ab + bc + ac)', va: 'V/A = abc / [2(ab+bc+ac)]' },
    html: { v: 'V = a·b·c', a: 'A = 2(ab + bc + ac)', va: `V/A = ${frac('abc','2(ab+bc+ac)')}` },
    compute: ({ a, b, c }) => {
      const V = a * b * c;
      const A = 2 * (a * b + b * c + a * c);
      return { V, A, VA: V / A };
    },
  },
  {
    id: 'cilindro',
    name: 'Cilindro',
    note: 'No olvidar las dos tapas: 2πr². r = D/2.',
    icon: cylinderIcon,
    dims: [
      { key: 'd', label: 'Diámetro D', unit: 'cm', min: 1, max: 100, step: 0.5, value: 10 },
      { key: 'h', label: 'Altura h', unit: 'cm', min: 1, max: 100, step: 0.5, value: 20 },
    ],
    formulas: { v: 'V = πr²h', a: 'A = 2πr² + 2πrh', va: 'V/A = r·h / [2(r+h)]' },
    html: { v: `V = πr²h = ${frac('π','4')}D²h`, a: `A = 2πr² + 2πrh = ${frac('π','2')}D² + πDh`, va: `V/A = ${frac('r·h','2(r+h)')} = ${frac('D·h','2(D+2h)')}` },
    compute: ({ d, h }) => {
      const r = d / 2;
      const V = Math.PI * r ** 2 * h;
      const A = 2 * Math.PI * r ** 2 + 2 * Math.PI * r * h;
      return { V, A, VA: V / A, r };
    },
  },
  {
    id: 'esfera',
    name: 'Esfera',
    note: 'Máximo V/A a igual volumen: es la que más tarda.',
    icon: sphereIcon,
    dims: [{ key: 'd', label: 'Diámetro D', unit: 'cm', min: 1, max: 100, step: 0.5, value: 20 }],
    formulas: { v: 'V = (4/3)πr³', a: 'A = 4πr²', va: 'V/A = r/3' },
    html: { v: `V = ${frac('4','3')}πr³`, a: 'A = 4πr²', va: `V/A = ${frac('r','3')}` },
    compute: ({ d }) => {
      const r = d / 2;
      const V = (4 / 3) * Math.PI * r ** 3;
      const A = 4 * Math.PI * r ** 2;
      return { V, A, VA: V / A, r };
    },
  },
];

function shapeById(id) {
  return SHAPES.find((shape) => shape.id === id) || SHAPES[0];
}

function shapeDefaults(shape) {
  return shape.dims.reduce((acc, dim) => {
    acc[dim.key] = dim.value;
    return acc;
  }, {});
}

/** Compara las cuatro figuras con el mismo volumen (cm³). */
function compareEqualVolume(volume) {
  const cubeSide = Math.cbrt(volume);
  const cubeA = 6 * cubeSide ** 2;

  const sphereR = Math.cbrt((3 * volume) / (4 * Math.PI));
  const sphereA = 4 * Math.PI * sphereR ** 2;

  // Prisma con lados proporcionales 1 : 2 : 3 → V = 6k³
  const k = Math.cbrt(volume / 6);
  const prismA = 2 * (k * 2 * k + 2 * k * 3 * k + k * 3 * k);

  // Placa de base 20 × 20 cm y espesor ajustado para el volumen pedido
  const plateThickness = volume / 400;
  const plateA = 2 * 400 + 4 * 20 * plateThickness;

  return [
    { name: 'Placa 20×20', A: plateA, color: 'placa' },
    { name: 'Prisma 1:2:3', A: prismA, color: 'prisma' },
    { name: 'Cubo', A: cubeA, color: 'cubo' },
    { name: 'Esfera', A: sphereA, color: 'esfera' },
  ].map((row) => ({ ...row, VA: volume / row.A }));
}

  __CDM_MODULES__["data/shapes.js"] = { shapeById, shapeDefaults, compareEqualVolume, SHAPES };
})();

/* ===== views/lab.js ===== */
(function () {
  "use strict";
/* ============================================================
   views/lab.js — simuladores: Chvorinov y palanca
   ============================================================ */

const { SHAPES, shapeById, shapeDefaults, compareEqualVolume } = __CDM_MODULES__["data/shapes.js"];
const { icon, bar } = __CDM_MODULES__["core/ui.js"];
const { formatNumber, parseNumber, shuffle } = __CDM_MODULES__["core/utils.js"];
const { pageHead } = __CDM_MODULES__["views/partials.js"];

function labHubView() {
  const tools = [
    {
      href: '#/practica/simuladores/chvorinov',
      icon: 'calculator',
      title: 'Chvorinov y formas básicas',
      meta: 'Calculá V, A, V/A y ts de cubo, prisma, cilindro y esfera. Compará formas y entrená las fórmulas.',
      badge: 'Unidad 8',
    },
    {
      href: '#/practica/simuladores/palanca',
      icon: 'layers',
      title: 'Regla de la palanca',
      meta: 'Calculá %L y %S con CL, CA y CS. Incluye masa de cada fase y retos rápidos.',
      badge: 'Unidad 9',
    },
  ];

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: 'Herramientas',
      title: 'Simuladores',
      sub: 'Cambiá los datos y mirá cómo se mueve el resultado. Después resolvé el mismo ejercicio a mano.',
    })}
    <div class="stack">
      ${tools.map((tool) => `<a class="card card--tap" href="${tool.href}" style="display:block">
        <div class="row">
          <span class="lab-head__icon">${icon(tool.icon)}</span>
          <div style="flex:1;min-width:0">
            <div class="row row--between" style="align-items:flex-start">
              <h3 style="font-size:0.98rem">${tool.title}</h3>
              <span class="badge">${tool.badge}</span>
            </div>
            <p class="card__sub" style="margin-top:4px">${tool.meta}</p>
          </div>
        </div>
      </a>`).join('')}
    </div>
    <div class="callout callout--tip">
      <div class="callout__icon">${icon('bulb')}</div>
      <div><h4>Cómo usarlo</h4><p>Hacé el cálculo a mano primero y después verificá en el simulador. Si no coincide, revisá unidades antes de cambiar la fórmula.</p></div>
    </div>
  `;
  return { el, title: 'Simuladores', sub: 'Herramientas', nav: 'practica', back: '/practica' };
}

/* ------------------------------------------------------------
   CHVORINOV
   ------------------------------------------------------------ */

function yFor(h) {
  return 140 - (h / 2) * 100;
}

function impactMiniSvg(m, h0, hf) {
  const y0 = yFor(h0);
  const yf = yFor(hf);
  return `<svg viewBox="0 0 360 170" aria-hidden="true" style="width:100%;height:auto">
    <line x1="40" y1="150" x2="330" y2="150" stroke="var(--line-strong)"/>
    <line x1="150" y1="20" x2="150" y2="150" stroke="var(--line)" stroke-dasharray="3 4"/>
    <line x1="290" y1="20" x2="290" y2="150" stroke="var(--line)" stroke-dasharray="3 4"/>
    <line x1="140" y1="${y0}" x2="300" y2="${y0}" stroke="var(--accent)" stroke-width="2.2"/>
    <line x1="140" y1="${yf}" x2="300" y2="${yf}" stroke="var(--amber)" stroke-width="2.2"/>
    <circle cx="150" cy="${y0}" r="5" fill="var(--accent)"/>
    <circle cx="150" cy="${yf}" r="5" fill="var(--amber)"/>
    <line x1="320" y1="${y0}" x2="320" y2="${yf}" stroke="var(--violet)" stroke-width="1.6" marker-start="url(#ar-lab)" marker-end="url(#ar-lab)"/>
    <text class="svg-text svg-text--accent" x="150" y="${y0 - 8}" text-anchor="middle" font-size="9" font-family="monospace">h₀ = ${formatNumber(h0, 2)} m</text>
    <text class="svg-text svg-text--amber" x="150" y="${yf + 16}" text-anchor="middle" font-size="9" font-family="monospace">hf = ${formatNumber(hf, 2)} m</text>
    <text class="svg-text svg-text--muted" x="150" y="166" text-anchor="middle" font-size="8">Δh = ${formatNumber(h0 - hf, 2)} m</text>
    <text class="svg-text svg-text--violet" x="326" y="${(y0 + yf) / 2 + 3}" font-size="8">Δh</text>
    <defs><marker id="ar-lab" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 1 L10 5 L0 9 z" fill="var(--violet)"/></marker></defs>
  </svg>`;
}

function chvorinovView() {
  const values = {};
  SHAPES.forEach((shape) => { values[shape.id] = shapeDefaults(shape); });

  const state = {
    shapeId: 'cubo',
    unit: 'cm',
    B: 3.5,
    volumeCompare: 2000,
  };

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: 'Unidad 8 · simulador',
      eyebrowTone: 'eyebrow--u8',
      title: 'Chvorinov y formas',
      sub: 'Calculá volumen, área del molde y tiempo de solidificación. Incluye comparación y entrenamiento de fórmulas.',
    })}

    <div class="segmented" role="tablist">
      <button type="button" role="tab" data-labtab="calc" aria-selected="true">Calculadora</button>
      <button type="button" role="tab" data-labtab="compare" aria-selected="false">Comparar</button>
      <button type="button" role="tab" data-labtab="train" aria-selected="false">Entrenar</button>
    </div>

    <section data-panel="calc" class="stack">
      <div class="card">
        <div class="row row--between">
          <div>
            <h3 style="font-size:0.95rem">Figura y medidas</h3>
            <p class="card__sub">Todo se convierte a cm para que B quede en min/cm².</p>
          </div>
          <div class="segmented" style="width:auto;padding:2px" role="tablist">
            <button type="button" role="tab" data-labunit="cm" aria-selected="true">cm</button>
            <button type="button" role="tab" data-labunit="mm" aria-selected="false">mm</button>
          </div>
        </div>
        <div class="shape-grid" style="margin-top:12px" data-shapes>
          ${SHAPES.map((shape) => `<button class="shape-opt ${shape.id === 'cubo' ? 'is-active' : ''}" type="button" data-shape="${shape.id}">
            ${shape.icon}<span>${shape.name}</span>
          </button>`).join('')}
        </div>
        <div class="lab-row" style="margin-top:12px" data-dims></div>
        <div class="lab-row" style="margin-top:9px">
          <div class="field">
            <label class="field__label" for="labB">Constante B</label>
            <div class="input-group">
              <input class="input" id="labB" type="text" inputmode="decimal" value="${state.B}">
              <span class="input-group__unit">min/cm²</span>
            </div>
          </div>
          <div class="field">
            <label class="field__label" for="labN">Exponente n</label>
            <input class="input" id="labN" type="text" inputmode="decimal" value="2" disabled>
          </div>
        </div>
        <div class="row row--wrap" style="margin-top:10px">
          <button class="btn btn--xs btn--soft" type="button" data-preset="cubo">Cubo 10 cm</button>
          <button class="btn btn--xs btn--soft" type="button" data-preset="cilindro">Cilindro D10 h20</button>
          <button class="btn btn--xs btn--soft" type="button" data-preset="prisma">Prisma 6×8×10</button>
          <button class="btn btn--xs btn--soft" type="button" data-preset="esfera">Esfera D20</button>
        </div>
      </div>

      <div class="lab-result">
        <div class="lab-result__label">Tiempo de solidificación</div>
        <div class="lab-result__value" data-out="ts">—</div>
        <div class="tiny muted" data-out="formula">ts = B · (V/A)²</div>
      </div>

      <div class="result-grid" data-out-grid>
        <div class="result-cell"><div class="result-cell__k">Volumen V</div><div class="result-cell__v" data-out="V">—</div></div>
        <div class="result-cell"><div class="result-cell__k">Área del molde A</div><div class="result-cell__v" data-out="A">—</div></div>
        <div class="result-cell"><div class="result-cell__k">Relación V/A</div><div class="result-cell__v" data-out="VA">—</div></div>
        <div class="result-cell"><div class="result-cell__k">B utilizada</div><div class="result-cell__v" data-out="B">—</div></div>
      </div>

      <div class="stack stack--sm" data-formulas></div>
      <div class="note" data-check></div>
    </section>

    <section data-panel="compare" class="stack" hidden>
      <div class="card">
        <h3 style="font-size:0.95rem">A igual volumen, ¿cuál tarda más?</h3>
        <p class="card__sub">La forma con menos superficie tiene mayor V/A y solidifica última.</p>
        <div class="lab-row" style="margin-top:12px">
          <div class="field">
            <label class="field__label" for="labVol">Volumen de la pieza</label>
            <div class="input-group"><input class="input" id="labVol" type="text" inputmode="decimal" value="2000"><span class="input-group__unit">cm³</span></div>
          </div>
          <div class="field">
            <label class="field__label" for="labB2">Constante B</label>
            <div class="input-group"><input class="input" id="labB2" type="text" inputmode="decimal" value="3.5"><span class="input-group__unit">min/cm²</span></div>
          </div>
        </div>
      </div>
      <div class="card" data-compare-rows></div>
      <div class="callout callout--tip"><div class="callout__icon">${icon('bulb')}</div><div><h4>Regla de oro</h4><p>Placa &lt; cubo &lt; esfera. La esfera es el extremo de máximo V/A; la placa delgada, el de mínimo.</p></div></div>
    </section>

    <section data-panel="train" class="stack" hidden>
      <div class="card">
        <div class="row row--between">
          <div><h3 style="font-size:0.95rem">Entrenamiento de fórmulas</h3><p class="card__sub">8 preguntas al azar: V, A y V/A de las cuatro figuras.</p></div>
          <span class="badge" data-train-score>0 / 0</span>
        </div>
      </div>
      <div data-train-area></div>
    </section>
  `;

  const calcPanel = el.querySelector('[data-panel="calc"]');
  const comparePanel = el.querySelector('[data-panel="compare"]');
  const trainPanel = el.querySelector('[data-panel="train"]');
  const dimsBox = el.querySelector('[data-dims]');
  const formulasBox = el.querySelector('[data-formulas]');
  const checkBox = el.querySelector('[data-check]');
  const compareRows = el.querySelector('[data-compare-rows]');

  function displayValue(cmValue) {
    return formatNumber(state.unit === 'mm' ? cmValue * 10 : cmValue, 2);
  }

  function renderDims() {
    const shape = shapeById(state.shapeId);
    const valuesCm = values[shape.id];
    dimsBox.innerHTML = shape.dims.map((dim) => `
      <div class="field">
        <label class="field__label" for="dim-${dim.key}">${dim.label}</label>
        <div class="input-group">
          <input class="input" id="dim-${dim.key}" data-dim="${dim.key}" type="text" inputmode="decimal" value="${displayValue(valuesCm[dim.key])}">
          <span class="input-group__unit">${state.unit}</span>
        </div>
      </div>`).join('');

    dimsBox.querySelectorAll('[data-dim]').forEach((input) => {
      input.addEventListener('input', () => {
        const parsed = parseNumber(input.value);
        if (!Number.isFinite(parsed) || parsed <= 0) return;
        valuesCm[input.dataset.dim] = state.unit === 'mm' ? parsed / 10 : parsed;
        updateResults();
      });
    });
  }

  function updateResults() {
    const shape = shapeById(state.shapeId);
    const valuesCm = values[shape.id];
    const B = parseNumber(el.querySelector('#labB').value);
    state.B = Number.isFinite(B) && B > 0 ? B : 3.5;
    const { V, A, VA } = shape.compute(valuesCm);
    const ts = state.B * VA ** 2;

    el.querySelector('[data-out="ts"]').innerHTML = `${formatNumber(ts, 2)} <span class="lab-result__unit">min</span>`;
    el.querySelector('[data-out="V"]').textContent = `${formatNumber(V, 1)} cm³`;
    el.querySelector('[data-out="A"]').textContent = `${formatNumber(A, 1)} cm²`;
    el.querySelector('[data-out="VA"]').textContent = `${formatNumber(VA, 3)} cm`;
    el.querySelector('[data-out="B"]').textContent = `${formatNumber(state.B, 2)} min/cm²`;
    el.querySelector('[data-out="formula"]').textContent =
      `ts = ${formatNumber(state.B, 2)} × (${formatNumber(VA, 3)})² = ${formatNumber(ts, 2)} min`;

    formulasBox.innerHTML = `
      <div class="formula formula--u8"><div class="formula__expr">${shape.html?.v || shape.formulas.v}</div><div class="formula__note">Volumen de la figura (calor a extraer).</div></div>
      <div class="formula formula--u8"><div class="formula__expr">${shape.html?.a || shape.formulas.a}</div><div class="formula__note">Área total del molde (superficie de extracción).</div></div>
      <div class="formula formula--u8"><div class="formula__expr">${shape.html?.va || shape.formulas.va}</div><div class="formula__note">Relación que entra en Chvorinov.</div></div>
    `;

    const cubeEquivalent = Math.cbrt(V);
    checkBox.innerHTML = `Verificación: con un cubo de lado ${formatNumber(cubeEquivalent, 2)} cm (mismo volumen) el tiempo sería ${formatNumber(state.B * (cubeEquivalent / 6) ** 2, 2)} min. ` +
      `La figura actual tarda ${formatNumber(ts, 2)} min porque su V/A es ${formatNumber(VA, 3)} cm.`;
  }

  el.querySelectorAll('[data-shape]').forEach((button) => {
    button.addEventListener('click', () => {
      state.shapeId = button.dataset.shape;
      el.querySelectorAll('[data-shape]').forEach((item) => item.classList.toggle('is-active', item === button));
      renderDims();
      updateResults();
    });
  });

  el.querySelectorAll('[data-labunit]').forEach((button) => {
    button.addEventListener('click', () => {
      state.unit = button.dataset.labunit;
      el.querySelectorAll('[data-labunit]').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
      renderDims();
      updateResults();
    });
  });

  el.querySelector('#labB').addEventListener('input', updateResults);

  el.querySelectorAll('[data-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const preset = button.dataset.preset;
      state.shapeId = preset;
      state.unit = 'cm';
      el.querySelectorAll('[data-labunit]').forEach((item) => item.setAttribute('aria-selected', String(item.dataset.labunit === 'cm')));
      el.querySelectorAll('[data-shape]').forEach((item) => item.classList.toggle('is-active', item.dataset.shape === preset));
      if (preset === 'cubo') values.cubo = { a: 10 };
      if (preset === 'cilindro') values.cilindro = { d: 10, h: 20 };
      if (preset === 'prisma') values.prisma = { a: 6, b: 8, c: 10 };
      if (preset === 'esfera') values.esfera = { d: 20 };
      renderDims();
      updateResults();
    });
  });

  /* --- comparación --- */

  function renderCompare() {
    const volume = Math.max(1, parseNumber(el.querySelector('#labVol').value) || 2000);
    const B = Math.max(0.01, parseNumber(el.querySelector('#labB2').value) || 3.5);
    const rows = compareEqualVolume(volume).map((row) => ({ ...row, ts: B * row.VA ** 2 }));
    const maxTs = Math.max(...rows.map((row) => row.ts));

    compareRows.innerHTML = `
      <div class="row row--between" style="margin-bottom:8px">
        <span class="section__title">V = ${formatNumber(volume, 0)} cm³</span>
        <span class="tiny muted mono">B = ${formatNumber(B, 2)}</span>
      </div>
      ${rows.map((row) => `<div class="compare-row">
        <span class="compare-row__name">${row.name}</span>
        <div class="compare-row__bar"><div class="compare-row__fill" style="width:${Math.max(4, (row.ts / maxTs) * 100)}%"></div></div>
        <span class="compare-row__val">${formatNumber(row.VA, 2)} cm<br>${formatNumber(row.ts, 1)} min</span>
      </div>`).join('')}
      <p class="tiny muted" style="margin-top:8px">V/A en cm y tiempo en min. Las barras comparan los tiempos entre formas del mismo volumen.</p>
    `;
  }

  el.querySelector('#labVol').addEventListener('input', renderCompare);
  el.querySelector('#labB2').addEventListener('input', renderCompare);

  /* --- entrenamiento --- */

  const train = { queue: [], index: 0, score: 0, answered: false, chosen: null };

  function buildTrainQueue() {
    const types = ['v', 'a', 'va'];
    const all = SHAPES.flatMap((shape) => types.map((type) => ({ shape, type })));
    return shuffle(all).slice(0, 8).map((item) => {
      const correct = item.shape.formulas[item.type];
      const options = shuffle([...new Set(SHAPES.map((shape) => shape.formulas[item.type]))]);
      return { ...item, correct, options };
    });
  }

  function renderTrain() {
    const area = el.querySelector('[data-train-area]');
    const score = el.querySelector('[data-train-score]');

    if (train.index >= train.queue.length) {
      const total = train.queue.length;
      score.textContent = `${train.score} / ${total}`;
      area.innerHTML = `<div class="card center">
        <div style="display:flex;justify-content:center">${''}</div>
        <h3>${train.score} de ${total} correctas</h3>
        <p class="card__sub">${train.score === total ? 'Dominás las fórmulas. Ahora practicá los cálculos numéricos.' : 'Repetí la ronda hasta que salga sin pensar.'}</p>
        <button class="btn btn--primary btn--block" type="button" data-train-restart style="margin-top:12px">${icon('refresh')} Otra ronda</button>
        <a class="btn btn--soft btn--block" href="#/practica/quiz?scope=topic&topic=chvorinov" style="margin-top:8px">Ir al quiz de Chvorinov</a>
      </div>`;
      area.querySelector('[data-train-restart]').addEventListener('click', () => {
        train.queue = buildTrainQueue();
        train.index = 0;
        train.score = 0;
        train.answered = false;
        renderTrain();
      });
      return;
    }

    const item = train.queue[train.index];
    const phrase = item.type === 'v' ? 'el volumen' : item.type === 'a' ? 'el área total' : 'la relación V/A';
    const preposition = item.shape.id === 'esfera' ? 'de la esfera' : `del ${item.shape.name.toLowerCase()}`;
    score.textContent = `${train.score} / ${train.queue.length}`;

    area.innerHTML = `<div class="q-card">
      <div class="q-meta"><span class="badge badge--warn">U8</span><span class="badge">Formas y V/A</span></div>
      <p class="q-text">¿Cuál es ${phrase} ${preposition}?</p>
      <div class="options options--long" data-train-options>
        ${item.options.map((option, index) => `<button class="opt" type="button" data-train-opt="${index}" ${train.answered ? 'disabled' : ''}>
          <span class="opt__key">${String.fromCharCode(65 + index)}</span><span>${option}</span>
        </button>`).join('')}
      </div>
      <div class="row" style="margin-top:12px;gap:8px">
        <button class="btn btn--outline btn--sm" type="button" data-train-skip>Saltar</button>
        <button class="btn btn--primary" style="flex:1" type="button" data-train-next ${train.answered ? '' : 'disabled'}>${train.index === train.queue.length - 1 ? 'Ver resultado' : 'Siguiente'}</button>
      </div>
      <div data-train-feedback></div>
    </div>`;

    if (train.answered && train.chosen != null) {
      area.querySelectorAll('[data-train-opt]').forEach((button) => {
        const option = item.options[Number(button.dataset.trainOpt)];
        if (option === item.correct) button.dataset.state = 'correct';
        else if (option === train.chosen) button.dataset.state = 'wrong';
        else button.dataset.state = 'dim';
      });
      area.querySelector('[data-train-feedback]').innerHTML = `<div class="explain ${train.chosen === item.correct ? 'explain--ok' : 'explain--bad'}">
        <div class="explain__title">${train.chosen === item.correct ? '¡Correcto!' : `La correcta es: ${item.correct}`}</div>
        <p>${item.shape.name}: ${item.shape.formulas.v} · ${item.shape.formulas.a} · ${item.shape.formulas.va}</p>
      </div>`;
    }

    area.querySelectorAll('[data-train-opt]').forEach((button) => {
      button.addEventListener('click', () => {
        if (train.answered) return;
        const option = item.options[Number(button.dataset.trainOpt)];
        train.answered = true;
        train.chosen = option;
        if (option === item.correct) train.score += 1;
        renderTrain();
      });
    });

    area.querySelector('[data-train-next]').addEventListener('click', () => {
      if (!train.answered) return;
      train.index += 1;
      train.answered = false;
      train.chosen = null;
      renderTrain();
    });

    area.querySelector('[data-train-skip]').addEventListener('click', () => {
      train.index += 1;
      train.answered = false;
      train.chosen = null;
      renderTrain();
    });
  }

  el.querySelectorAll('[data-labtab]').forEach((button) => {
    button.addEventListener('click', () => {
      const tab = button.dataset.labtab;
      el.querySelectorAll('[data-labtab]').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
      calcPanel.hidden = tab !== 'calc';
      comparePanel.hidden = tab !== 'compare';
      trainPanel.hidden = tab !== 'train';
      if (tab === 'compare') renderCompare();
      if (tab === 'train') {
        if (!train.queue.length) train.queue = buildTrainQueue();
        renderTrain();
      }
    });
  });

  renderDims();
  updateResults();
  renderCompare();
  train.queue = buildTrainQueue();
  renderTrain();

  return {
    el,
    title: 'Chvorinov',
    sub: 'Unidad 8 · simulador',
    nav: 'practica',
    back: '/practica/simuladores',
  };
}

/* ------------------------------------------------------------
   IMPACTO
   ------------------------------------------------------------ */

function impactoView() {
  const state = { m: 25, h0: 1.5, hf: 0.62, sectionW: 10, sectionH: 8, clivA: 5, clivB: 8 };

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: 'Unidad 6 · simulador',
      title: 'Impacto y energía',
      sub: 'Péndulo, energía absorbida y porcentaje de fractura por corte.',
    })}

    <div class="card">
      <div class="row row--between">
        <div><h3 style="font-size:0.95rem">Péndulo</h3><p class="card__sub">E = m·g·(h₀ − hf)</p></div>
        <span class="badge badge--warn">dinámico</span>
      </div>
      <div class="range-field" style="margin-top:12px">
        <div class="row row--between"><label class="field__label" for="im-m">Masa del péndulo</label><span class="mono small" data-lab="m">25 kg</span></div>
        <input class="range" id="im-m" type="range" min="5" max="30" step="1" value="25">
      </div>
      <div class="range-field" style="margin-top:8px">
        <div class="row row--between"><label class="field__label" for="im-h0">Altura inicial h₀</label><span class="mono small" data-lab="h0">1,50 m</span></div>
        <input class="range" id="im-h0" type="range" min="0.6" max="2" step="0.05" value="1.5">
      </div>
      <div class="range-field" style="margin-top:8px">
        <div class="row row--between"><label class="field__label" for="im-hf">Altura final hf</label><span class="mono small" data-lab="hf">0,62 m</span></div>
        <input class="range" id="im-hf" type="range" min="0.1" max="1.9" step="0.02" value="0.62">
      </div>
      <div style="margin-top:10px" data="svg"></div>
    </div>

    <div class="lab-result">
      <div class="lab-result__label">Energía absorbida</div>
      <div class="lab-result__value" data="energy">—</div>
      <div class="tiny muted" data="energyFormula"></div>
    </div>

    <div class="callout callout--info">
      <div class="callout__icon">${icon('info')}</div>
      <div><h4>Tres resultados del ensayo</h4><p>Energía absorbida (J) · % de fractura por corte · expansión lateral (mm). Una probeta Charpy es 10×10×55 mm con entalla de 45°, 2 mm y r = 0,25 mm.</p></div>
    </div>

    <div class="card">
      <h3 style="font-size:0.95rem">Cara de fractura y % de corte</h3>
      <p class="card__sub">El recuadro brillante central es clivaje (frágil); el marco opaco es corte (dúctil).</p>
      <div class="lab-row" style="margin-top:12px">
        <div class="field"><label class="field__label" for="im-w">Ancho de sección</label><div class="input-group"><input class="input" id="im-w" type="text" inputmode="decimal" value="10"><span class="input-group__unit">mm</span></div></div>
        <div class="field"><label class="field__label" for="im-h">Alto de sección</label><div class="input-group"><input class="input" id="im-h" type="text" inputmode="decimal" value="8"><span class="input-group__unit">mm</span></div></div>
        <div class="field"><label class="field__label" for="im-a">Clivaje A</label><div class="input-group"><input class="input" id="im-a" type="text" inputmode="decimal" value="5"><span class="input-group__unit">mm</span></div></div>
        <div class="field"><label class="field__label" for="im-b">Clivaje B</label><div class="input-group"><input class="input" id="im-b" type="text" inputmode="decimal" value="8"><span class="input-group__unit">mm</span></div></div>
      </div>
      <div class="lab-result" style="margin-top:12px">
        <div class="lab-result__label">Fractura por corte</div>
        <div class="lab-result__value" data="corte">—</div>
        <div class="tiny muted" data="corteFormula"></div>
      </div>
      <div class="note" style="margin-top:10px" data="corteNote"></div>
    </div>

    <div class="row row--wrap">
      <button class="btn btn--xs btn--soft" type="button" data-preset-impacto>Ejercicio de cátedra (215,6 J · 50 %)</button>
      <a class="btn btn--xs btn--ghost" href="#/teoria/diagramas/impacto">Ver diagrama Charpy/Izod</a>
    </div>
  `;

  const mInput = el.querySelector('#im-m');
  const h0Input = el.querySelector('#im-h0');
  const hfInput = el.querySelector('#im-hf');

  function readImpact() {
    const m = Number(mInput.value);
    const h0 = Number(h0Input.value);
    let hf = Number(hfInput.value);
    if (hf >= h0) {
      hf = Math.max(0.1, h0 - 0.05);
      hfInput.value = String(hf);
    }
    hfInput.max = String(Math.max(0.1, h0 - 0.05));
    state.m = m;
    state.h0 = h0;
    state.hf = hf;

    const energy = m * 9.8 * (h0 - hf);
    el.querySelector('[data-lab="m"]').textContent = `${formatNumber(m, 0)} kg`;
    el.querySelector('[data-lab="h0"]').textContent = `${formatNumber(h0, 2)} m`;
    el.querySelector('[data-lab="hf"]').textContent = `${formatNumber(hf, 2)} m`;
    el.querySelector('[data="energy"]').innerHTML = `${formatNumber(energy, 1)} <span class="lab-result__unit">J</span>`;
    el.querySelector('[data="energyFormula"]').textContent = `E = ${formatNumber(m, 0)} × 9,8 × (${formatNumber(h0, 2)} − ${formatNumber(hf, 2)}) = ${formatNumber(energy, 1)} J`;
    el.querySelector('[data="svg"]').innerHTML = impactMiniSvg(m, h0, hf);
  }

  function readCorte() {
    const w = parseNumber(el.querySelector('#im-w').value);
    const h = parseNumber(el.querySelector('#im-h').value);
    const a = parseNumber(el.querySelector('#im-a').value);
    const b = parseNumber(el.querySelector('#im-b').value);
    const total = w * h;
    const clivaje = a * b;
    const out = el.querySelector('[data="corte"]');
    const formula = el.querySelector('[data="corteFormula"]');
    const note = el.querySelector('[data="corteNote"]');

    if (![w, h, a, b].every((value) => Number.isFinite(value) && value >= 0) || total <= 0) {
      out.textContent = '—';
      formula.textContent = '';
      note.textContent = 'Completá las medidas de la sección.';
      return;
    }
    if (clivaje > total) {
      out.textContent = '—';
      formula.textContent = '';
      note.textContent = 'El área de clivaje no puede ser mayor que la sección total. Revisá los datos.';
      return;
    }
    const corte = ((total - clivaje) / total) * 100;
    out.innerHTML = `${formatNumber(corte, 1)} <span class="lab-result__unit">%</span>`;
    formula.textContent = `(${formatNumber(total, 1)} − ${formatNumber(a, 1)}·${formatNumber(b, 1)}) / ${formatNumber(total, 1)} × 100`;
    note.textContent = clivaje === 0
      ? 'Si A o B valen 0 no hay clivaje: la fractura es 100 % dúctil.'
      : corte >= 70
        ? 'Fractura predominantemente dúctil: alta energía absorbida y buena expansión lateral.'
        : corte >= 30
          ? 'Zona de transición: parte dúctil y parte frágil.'
          : 'Fractura predominantemente frágil: baja energía y poca expansión lateral.';
    state.sectionW = w;
    state.sectionH = h;
    state.clivA = a;
    state.clivB = b;
  }

  [mInput, h0Input, hfInput].forEach((input) => input.addEventListener('input', readImpact));
  ['#im-w', '#im-h', '#im-a', '#im-b'].forEach((selector) => {
    el.querySelector(selector).addEventListener('input', readCorte);
  });

  el.querySelector('[data-preset-impacto]').addEventListener('click', () => {
    mInput.value = '25';
    h0Input.value = '1.5';
    hfInput.value = '0.62';
    el.querySelector('#im-w').value = '10';
    el.querySelector('#im-h').value = '8';
    el.querySelector('#im-a').value = '5';
    el.querySelector('#im-b').value = '8';
    readImpact();
    readCorte();
  });

  readImpact();
  readCorte();

  return {
    el,
    title: 'Impacto',
    sub: 'Unidad 6 · simulador',
    nav: 'practica',
    back: '/practica/simuladores',
  };
}

/* ------------------------------------------------------------
   CALCULADORAS
   ------------------------------------------------------------ */

function calculadorasView() {
  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: 'Herramientas',
      title: 'Calculadoras',
      sub: 'Calculá la dureza Brinell y estimá la resistencia del acero. La fórmula va escrita antes de reemplazar.',
    })}

    <div class="card" data-calc="brinell">
      <div class="row row--between"><h3 style="font-size:0.95rem">Dureza Brinell</h3><span class="badge">kgf</span></div>
      <p class="card__sub">HBW = 2F / [πD(D − √(D² − d²))]</p>
      <div class="lab-row" style="margin-top:12px">
        <div class="field"><label class="field__label">Carga F</label><div class="input-group"><input class="input" data-in="F" type="text" inputmode="decimal" value="3000"><span class="input-group__unit">kgf</span></div></div>
        <div class="field"><label class="field__label">Diámetro esfera D</label><div class="input-group"><input class="input" data-in="D" type="text" inputmode="decimal" value="10"><span class="input-group__unit">mm</span></div></div>
        <div class="field"><label class="field__label">Huella d</label><div class="input-group"><input class="input" data-in="d" type="text" inputmode="decimal" value="6.25"><span class="input-group__unit">mm</span></div></div>
      </div>
      <div class="lab-result" style="margin-top:12px"><div class="lab-result__label">Dureza</div><div class="lab-result__value" data-out>—</div><div class="tiny muted" data-note></div></div>
    </div>

    <div class="note">Estas calculadoras son de verificación: en el parcial tenés que escribir la fórmula, reemplazar y aclarar las unidades del resultado.</div>
  `;

  function bindCalc(cardSelector, handler) {
    const card = el.querySelector(cardSelector);
    const run = () => {
      const data = {};
      card.querySelectorAll('[data-in]').forEach((input) => {
        data[input.dataset.in] = parseNumber(input.value);
      });
      handler(data, card);
    };
    card.querySelectorAll('[data-in]').forEach((input) => input.addEventListener('input', run));
    run();
  }

  bindCalc('[data-calc="brinell"]', (data, card) => {
    const { F, D, d } = data;
    const out = card.querySelector('[data-out]');
    const note = card.querySelector('[data-note]');
    if (![F, D, d].every(Number.isFinite) || D <= 0 || d <= 0 || d >= D) {
      out.textContent = '—';
      note.textContent = 'Revisá: D y d deben ser positivos y d < D.';
      return;
    }
    const hb = (2 * F) / (Math.PI * D * (D - Math.sqrt(D * D - d * d)));
    out.innerHTML = `${formatNumber(hb, 2)} <span class="lab-result__unit">HB</span>`;
    note.textContent = `σut ≈ 3,45 · HB = ${formatNumber(3.45 * hb, 0)} MPa (sólo aceros no austeníticos).`;
  });

  return {
    el,
    title: 'Calculadoras',
    sub: 'Dureza Brinell',
    nav: 'practica',
    back: '/practica/simuladores',
  };
}

  __CDM_MODULES__["views/lab.js"] = { labHubView, chvorinovView, impactoView, calculadorasView };
})();

/* ===== views/palanca.js ===== */
(function () {
  "use strict";
/* ============================================================
   views/palanca.js — simulador de la regla de la palanca (U9)
   ============================================================ */

const { pageHead } = __CDM_MODULES__["views/partials.js"];
const { icon } = __CDM_MODULES__["core/ui.js"];
const { formatNumber, parseNumber } = __CDM_MODULES__["core/utils.js"];

function tieSvg(CL, CA, CS) {
  const x = (value) => 42 + Math.max(0, Math.min(100, value)) * 2.8;
  return `<svg viewBox="0 0 360 74" role="img" aria-label="Isoterma con CL, CA y CS" style="width:100%;height:auto">
    <line x1="36" y1="40" x2="328" y2="40" stroke="var(--line-strong)" stroke-width="2"/>
    <line x1="36" y1="34" x2="36" y2="46" stroke="var(--line-strong)"/>
    <line x1="328" y1="34" x2="328" y2="46" stroke="var(--line-strong)"/>
    <line x1="${x(CL).toFixed(1)}" y1="40" x2="${x(CA).toFixed(1)}" y2="40" stroke="var(--accent)" stroke-width="5" opacity="0.35"/>
    <line x1="${x(CA).toFixed(1)}" y1="40" x2="${x(CS).toFixed(1)}" y2="40" stroke="var(--green)" stroke-width="5" opacity="0.35"/>
    <circle cx="${x(CL).toFixed(1)}" cy="40" r="5" fill="var(--accent)"/>
    <circle cx="${x(CA).toFixed(1)}" cy="40" r="5" fill="var(--amber)"/>
    <circle cx="${x(CS).toFixed(1)}" cy="40" r="5" fill="var(--green)"/>
    <text x="36" y="66" class="svg-text svg-text--muted" font-size="7">composición (% B) →</text>
  </svg>`;
}

function randomExercise() {
  const CL = 10 + Math.floor(Math.random() * 30);
  const CS = CL + 18 + Math.floor(Math.random() * 22);
  const CA = CL + 2 + Math.floor(Math.random() * (CS - CL - 4));
  return { CL, CA, CS };
}

function palancaView() {
  const state = { CL: 32, CA: 35, CS: 43, mass: 2000 };
  let train = randomExercise();

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: 'Unidad 9 · simulador',
      eyebrowTone: 'eyebrow--u9',
      title: 'Regla de la palanca',
      sub: 'Leé CL y CS del diagrama, calculá %L y %S y comprobá que sumen 100 %.',
    })}

    <div class="card">
      <div class="grid grid--2">
        <div class="field">
          <label class="field__label" for="pal-cl">CL · líquido (%)</label>
          <div class="input-group"><input class="input" id="pal-cl" data-pal="CL" type="text" inputmode="decimal" value="${state.CL}"><span class="input-group__unit">%</span></div>
        </div>
        <div class="field">
          <label class="field__label" for="pal-ca">CA · aleación (%)</label>
          <div class="input-group"><input class="input" id="pal-ca" data-pal="CA" type="text" inputmode="decimal" value="${state.CA}"><span class="input-group__unit">%</span></div>
        </div>
        <div class="field">
          <label class="field__label" for="pal-cs">CS · sólido (%)</label>
          <div class="input-group"><input class="input" id="pal-cs" data-pal="CS" type="text" inputmode="decimal" value="${state.CS}"><span class="input-group__unit">%</span></div>
        </div>
        <div class="field">
          <label class="field__label" for="pal-mass">Masa total (opcional)</label>
          <div class="input-group"><input class="input" id="pal-mass" data-pal="mass" type="text" inputmode="decimal" value="${state.mass}"><span class="input-group__unit">g</span></div>
        </div>
      </div>
      <p class="tiny" data-pal-error style="color:var(--rose);min-height:18px;margin:2px 0 0"></p>
      <div class="chip-row" style="margin-top:6px;flex-wrap:wrap">
        <button class="chip" type="button" data-ex='{"CL":32,"CA":35,"CS":43,"mass":2000}'>Cu–35 % Ni</button>
        <button class="chip" type="button" data-ex='{"CL":40,"CA":45,"CS":60,"mass":2000}'>Números redondos</button>
        <button class="chip" type="button" data-ex='{"CL":20,"CA":25,"CS":32,"mass":3000}'>CA = 25 %</button>
        <button class="chip" type="button" data-ex='{"CL":30,"CA":40,"CS":50,"mass":3000}'>Ejemplo 30/40/50</button>
      </div>
      <div data-pal-tie style="margin-top:10px"></div>
      <div class="row row--wrap" data-pal-tie-labels style="gap:6px;margin-top:2px"></div>
      <div class="grid grid--2" style="margin-top:4px">
        <div class="stat stat--accent"><div class="stat__value" data-pal-l>—</div><div class="stat__label">% líquido</div></div>
        <div class="stat"><div class="stat__value" data-pal-s>—</div><div class="stat__label">% sólido</div></div>
      </div>
      <div class="grid grid--2" style="margin-top:10px">
        <div class="stat"><div class="stat__value" data-pal-ml style="font-size:1.1rem">—</div><div class="stat__label">masa de líquido</div></div>
        <div class="stat"><div class="stat__value" data-pal-ms style="font-size:1.1rem">—</div><div class="stat__label">masa de sólido</div></div>
      </div>
      <div class="formula" data-pal-step style="margin-top:12px"></div>
      <p class="tiny muted" data-pal-check style="margin-top:8px"></p>
    </div>

    <div class="callout callout--tip">
      <div class="callout__icon">${icon('bulb')}</div>
      <div><h4>Cómo leerlo</h4><p>La isoterma es la palanca: <b>%L</b> usa el brazo opuesto <b>CS − CA</b>; <b>%S</b> usa <b>CA − CL</b>. El denominador siempre es <b>CS − CL</b>. La fase más cercana a CA es la más abundante.</p></div>
    </div>

    <div class="card" data-train-card>
      <div class="row row--between">
        <h3 style="font-size:1rem">${icon('target', 'icon--sm')} Reto rápido</h3>
        <span class="badge">%L</span>
      </div>
      <p class="card__sub" data-train-q style="margin-top:6px"></p>
      <div class="row" style="gap:8px;align-items:flex-end">
        <div class="field" style="flex:1">
          <label class="field__label" for="pal-train">Tu resultado (% líquido)</label>
          <div class="input-group"><input class="input" id="pal-train" data-train-input type="text" inputmode="decimal" placeholder="Ej.: 58,3"><span class="input-group__unit">%</span></div>
        </div>
      </div>
      <p class="tiny" data-train-msg style="min-height:18px;margin:4px 0 0"></p>
      <div class="row row--wrap" style="margin-top:4px">
        <button class="btn btn--primary btn--sm" type="button" data-train-check>Comprobar</button>
        <button class="btn btn--soft btn--sm" type="button" data-train-next>${icon('refresh', 'icon--sm')} Otro</button>
      </div>
    </div>
  `;

  const inputs = [...el.querySelectorAll('[data-pal]')];
  const errEl = el.querySelector('[data-pal-error]');
  const tieEl = el.querySelector('[data-pal-tie]');
  const tieLabels = el.querySelector('[data-pal-tie-labels]');
  const trainQ = el.querySelector('[data-train-q]');
  const trainInput = el.querySelector('[data-train-input]');
  const trainMsg = el.querySelector('[data-train-msg]');

  function read() {
    inputs.forEach((input) => {
      state[input.dataset.pal] = parseNumber(input.value);
    });
    return state;
  }

  function render() {
    const { CL, CA, CS, mass } = read();
    const valid = Number.isFinite(CL) && Number.isFinite(CA) && Number.isFinite(CS) && CL < CA && CA < CS;
    tieEl.innerHTML = tieSvg(Number.isFinite(CL) ? CL : 0, Number.isFinite(CA) ? CA : 0, Number.isFinite(CS) ? CS : 0);

    if (!valid) {
      tieLabels.innerHTML = '';
      errEl.textContent = 'Revisá los datos: tiene que cumplirse CL < CA < CS.';
      el.querySelector('[data-pal-l]').textContent = '—';
      el.querySelector('[data-pal-s]').textContent = '—';
      el.querySelector('[data-pal-ml]').textContent = '—';
      el.querySelector('[data-pal-ms]').textContent = '—';
      el.querySelector('[data-pal-step]').innerHTML = '<div class="formula__expr">%L = (CS − CA)/(CS − CL) · 100</div>';
      el.querySelector('[data-pal-check]').textContent = '';
      return;
    }

    errEl.textContent = '';
    tieLabels.innerHTML = `<span class="badge badge--accent">CL = ${formatNumber(CL, 1)} %</span>
      <span class="badge badge--warn">CA = ${formatNumber(CA, 1)} %</span>
      <span class="badge badge--ok">CS = ${formatNumber(CS, 1)} %</span>`;
    const pctL = ((CS - CA) / (CS - CL)) * 100;
    const pctS = ((CA - CL) / (CS - CL)) * 100;
    el.querySelector('[data-pal-l]').textContent = `${formatNumber(pctL, 1)} %`;
    el.querySelector('[data-pal-s]').textContent = `${formatNumber(pctS, 1)} %`;
    const m = Number.isFinite(mass) && mass > 0 ? mass : 0;
    el.querySelector('[data-pal-ml]').textContent = m ? `${formatNumber((pctL / 100) * m, 1)} g` : '—';
    el.querySelector('[data-pal-ms]').textContent = m ? `${formatNumber((pctS / 100) * m, 1)} g` : '—';
    el.querySelector('[data-pal-step]').innerHTML = `<div class="formula__expr">%L = (${formatNumber(CS, 1)} − ${formatNumber(CA, 1)}) / (${formatNumber(CS, 1)} − ${formatNumber(CL, 1)}) · 100 = ${formatNumber(pctL, 1)} %</div>
      <div class="formula__note">%S = (${formatNumber(CA, 1)} − ${formatNumber(CL, 1)}) / ${formatNumber(CS - CL, 1)} · 100 = ${formatNumber(pctS, 1)} %</div>`;
    el.querySelector('[data-pal-check]').textContent = `Control: ${formatNumber(pctL, 1)} % + ${formatNumber(pctS, 1)} % = 100 %. La fase más cercana a CA es la más abundante.`;
  }

  inputs.forEach((input) => input.addEventListener('input', render));

  el.querySelectorAll('[data-ex]').forEach((button) => {
    button.addEventListener('click', () => {
      const data = JSON.parse(button.dataset.ex);
      Object.entries(data).forEach(([key, value]) => {
        const input = el.querySelector(`[data-pal="${key}"]`);
        if (input) input.value = value;
      });
      render();
    });
  });

  function renderTrain() {
    trainQ.innerHTML = `CL = <b>${train.CL} %</b> · CS = <b>${train.CS} %</b> · CA = <b>${train.CA} %</b>. ¿Cuál es el % de líquido?`;
    trainInput.value = '';
    trainMsg.textContent = '';
    trainMsg.style.color = '';
  }

  el.querySelector('[data-train-next]').addEventListener('click', () => {
    train = randomExercise();
    renderTrain();
    trainInput.focus();
  });

  el.querySelector('[data-train-check]').addEventListener('click', () => {
    const answer = parseNumber(trainInput.value);
    const correct = ((train.CS - train.CA) / (train.CS - train.CL)) * 100;
    if (!Number.isFinite(answer)) {
      trainMsg.textContent = 'Escribí un número.';
      trainMsg.style.color = 'var(--rose)';
      return;
    }
    if (Math.abs(answer - correct) <= 0.6) {
      trainMsg.textContent = `¡Bien! ${formatNumber(correct, 1)} % de líquido. Control: el sólido es ${formatNumber(100 - correct, 1)} %.`;
      trainMsg.style.color = 'var(--green)';
    } else {
      trainMsg.textContent = `Todavía no: da ${formatNumber(correct, 1)} %. Numerador: CS − CA = ${train.CS - train.CA}; denominador: CS − CL = ${train.CS - train.CL}.`;
      trainMsg.style.color = 'var(--rose)';
    }
  });

  render();
  renderTrain();
  return { el, title: 'Regla de la palanca', sub: 'Unidad 9 · simulador', nav: 'practica', back: '/practica/simuladores' };
}

  __CDM_MODULES__["views/palanca.js"] = { palancaView };
})();

/* ===== views/progress.js ===== */
(function () {
  "use strict";
/* ============================================================
   views/progress.js — progreso, temas flojos, ajustes y respaldo
   ============================================================ */

const { ALL_LESSONS, ALL_CARDS, ALL_QUIZ, TOPICS, UNIT_LIST, getUnit } = __CDM_MODULES__["data/index.js"];
const { ALL_DIAGRAMS } = __CDM_MODULES__["diagrams/index.js"];
const { getState, dailySummary, weeklyActivity, lessonRead, recentSessions, exportSnapshot, importSnapshot, resetProgress, setSetting, setTheme } = __CDM_MODULES__["core/store.js"];
const { icon, bar, ring, toast, openSheet, confirmSheet, haptic, applyTheme } = __CDM_MODULES__["core/ui.js"];
const { percent, downloadText, esc } = __CDM_MODULES__["core/utils.js"];
const { pageHead } = __CDM_MODULES__["views/partials.js"];
const { navigate } = __CDM_MODULES__["core/router.js"];

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

function progressView() {
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
                  <span class="badge ${unit.id === 'u6' ? 'badge--accent' : unit.id === 'u8' ? 'badge--warn' : 'badge--ok'}">${unit.tag}</span>
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

  __CDM_MODULES__["views/progress.js"] = { progressView };
})();

/* ===== main.js ===== */
(function () {
  "use strict";
/* ============================================================
   main.js — arranque de la app, rutas, barra superior y temas
   ============================================================ */

const { addRoute, resolve, startRouter, parseHash, navigate } = __CDM_MODULES__["core/router.js"];
const { getState, setTheme, setRoute, subscribe } = __CDM_MODULES__["core/store.js"];
const { applyTheme, setFocusMode, toast } = __CDM_MODULES__["core/ui.js"];

const { homeView } = __CDM_MODULES__["views/home.js"];
const { theoryView, lessonView } = __CDM_MODULES__["views/theory.js"];
const { diagramsListView, diagramView } = __CDM_MODULES__["views/diagrams.js"];
const { formulasView } = __CDM_MODULES__["views/formulas.js"];
const { ensayosView, ensayoView } = __CDM_MODULES__["views/ensayos.js"];
const { practiceView } = __CDM_MODULES__["views/practice.js"];
const { quizView } = __CDM_MODULES__["views/quiz.js"];
const { flashcardsView } = __CDM_MODULES__["views/flashcards.js"];
const { labHubView, chvorinovView } = __CDM_MODULES__["views/lab.js"];
const { palancaView } = __CDM_MODULES__["views/palanca.js"];
const { progressView } = __CDM_MODULES__["views/progress.js"];

/* ---------------- rutas ---------------- */

addRoute('/inicio', homeView);
addRoute('/teoria', theoryView);
addRoute('/teoria/leccion/:id', lessonView);
addRoute('/teoria/diagramas', diagramsListView);
addRoute('/teoria/diagramas/:id', diagramView);
addRoute('/teoria/formulas', formulasView);
addRoute('/ensayos', ensayosView);
addRoute('/ensayos/:id', ensayoView);
addRoute('/practica', practiceView);
addRoute('/practica/quiz', quizView);
addRoute('/practica/tarjetas', flashcardsView);
addRoute('/practica/simuladores', labHubView);
addRoute('/practica/simuladores/chvorinov', chvorinovView);
addRoute('/practica/simuladores/palanca', palancaView);
addRoute('/progreso', progressView);

/* ---------------- estado de la shell ---------------- */

const viewEl = document.getElementById('view');
const backBtn = document.getElementById('btnBack');
const titleEl = document.getElementById('appbarTitle');
const subEl = document.getElementById('appbarSub');
const streakEl = document.getElementById('streakDays');
const themeBtn = document.getElementById('btnTheme');
const tabbar = document.getElementById('tabbar');

let cleanup = null;
let currentBack = '/inicio';

function updateStreak() {
  const state = getState();
  streakEl.textContent = String(state.streak.days || 0);
}

function setTabbar(nav) {
  tabbar.querySelectorAll('.tabbar__item').forEach((item) => {
    if (item.dataset.tab === nav) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
}

function renderError(error) {
  console.error(error);
  viewEl.innerHTML = `<div class="page">
    <div class="page-head"><div class="page-head__main"><div class="eyebrow">Error</div><h2>No se pudo abrir esta pantalla</h2><p>${String(error && error.message ? error.message : error)}</p></div></div>
    <a class="btn btn--primary" href="#/inicio">Volver al inicio</a>
  </div>`;
}

function render() {
  const { path, query } = parseHash();
  const match = resolve(path);

  if (!match) {
    navigate('/inicio', { replace: true });
    return;
  }

  if (typeof cleanup === 'function') {
    try { cleanup(); } catch (error) { console.warn(error); }
  }
  cleanup = null;
  setFocusMode(false);
  document.body.classList.remove('is-subpage');

  let result;
  try {
    result = match.view({ params: match.params, query, path });
  } catch (error) {
    renderError(error);
    return;
  }

  viewEl.replaceChildren(result.el);

  document.title = result.title === 'CDM · Repaso'
    ? 'CDM · Repaso — Unidades 6, 8 y 9'
    : `${result.title} · CDM Repaso`;
  titleEl.textContent = result.title || 'CDM · Repaso';
  subEl.textContent = result.sub || 'Parcial 2 · Unidades 6, 8 y 9';

  const hasBack = !!result.back;
  backBtn.hidden = !hasBack;
  document.body.classList.toggle('is-subpage', hasBack);
  currentBack = result.back || '/inicio';

  setTabbar(result.nav || '');
  setFocusMode(!!result.focus);

  cleanup = typeof result.cleanup === 'function' ? result.cleanup : null;

  setRoute(path);
  updateStreak();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

/* ---------------- acciones de la shell ---------------- */

backBtn.addEventListener('click', () => navigate(currentBack));

document.getElementById('btnStreak').addEventListener('click', () => navigate('/progreso'));

document.getElementById('appbarBrand').addEventListener('click', () => navigate('/inicio'));
document.getElementById('appbarBrand').addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    navigate('/inicio');
  }
});

themeBtn.addEventListener('click', () => {
  const next = getState().theme === 'dark' ? 'light' : 'dark';
  setTheme(next);
  applyTheme(next);
});

subscribe(updateStreak);

/* ---------------- tema inicial ---------------- */

const initialTheme = getState().theme === 'light' ? 'light' : 'dark';
applyTheme(initialTheme);

/* ---------------- arranque ---------------- */

if (!window.location.hash) {
  history.replaceState(null, '', '#/inicio');
}
startRouter(render);

/* ---------------- service worker (offline) ---------------- */

const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const forceSW = new URLSearchParams(window.location.search).has('sw');
if ('serviceWorker' in navigator && (forceSW || (window.location.protocol === 'https:' && !isLocal))) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => console.warn('SW no registrado:', error));
  });
}

window.addEventListener('offline', () => toast('Sin conexión: la app sigue funcionando', '', 2600));
window.addEventListener('online', () => toast('Conexión recuperada', 'ok'));

  __CDM_MODULES__["main.js"] = {};
})();
