/* ============================================================
   main.js — arranque de la app, rutas, barra superior y temas
   ============================================================ */

import { addRoute, resolve, startRouter, parseHash, navigate } from './core/router.js';
import { getState, setTheme, setRoute, subscribe } from './core/store.js';
import { applyTheme, setFocusMode, toast } from './core/ui.js';

import { homeView } from './views/home.js';
import { theoryView, lessonView } from './views/theory.js';
import { diagramsListView, diagramView } from './views/diagrams.js';
import { formulasView } from './views/formulas.js';
import { ensayosView, ensayoView } from './views/ensayos.js';
import { practiceView } from './views/practice.js';
import { quizView } from './views/quiz.js';
import { flashcardsView } from './views/flashcards.js';
import { labHubView, chvorinovView, impactoView, calculadorasView } from './views/lab.js';
import { palancaView } from './views/palanca.js';
import { progressView } from './views/progress.js';

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
addRoute('/practica/simuladores/impacto', impactoView);
addRoute('/practica/simuladores/calculadoras', calculadorasView);
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
