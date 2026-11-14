/* ============================================================
   ui.js — helpers de interfaz: íconos, anillos, toast y hojas
   ============================================================ */

import { esc, percent } from './utils.js';
import { getState } from './store.js';

export function icon(name, cls = '') {
  return `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
}

export function h(html) {
  const template = document.createElement('template');
  template.innerHTML = String(html).trim();
  return template.content.firstElementChild;
}

export function ring(pct, label = '', opts = {}) {
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

export function bar(pct, variant = '') {
  return `<div class="bar"><div class="bar__fill ${variant ? `bar__fill--${variant}` : ''}" style="width:${Math.max(0, Math.min(100, pct))}%"></div></div>`;
}

export function statTile(value, label, opts = {}) {
  return `<div class="stat ${opts.accent ? 'stat--accent' : ''}">
    <div class="stat__value">${value}</div>
    <div class="stat__label">${esc(label)}</div>
  </div>`;
}

export function emptyState({ iconName = 'info', title, text = '', action = '' }) {
  return `<div class="empty">
    ${icon(iconName)}
    <h3>${esc(title)}</h3>
    ${text ? `<p>${text}</p>` : ''}
    ${action ? `<div style="margin-top:12px">${action}</div>` : ''}
  </div>`;
}

/* ---------------- toast ---------------- */

let toastTimer = null;

export function toast(message, tone = '', ms = 2300) {
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

export function closeSheet() {
  if (!activeSheet) return;
  const { overlay, previousOverflow } = activeSheet;
  overlay.remove();
  document.body.style.overflow = previousOverflow;
  document.removeEventListener('keydown', activeSheet.onKey);
  if (activeSheet.onClose) activeSheet.onClose();
  activeSheet = null;
}

export function openSheet({ title, subtitle = '', body = '', actions = [], onClose = null, dismissible = true }) {
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

export function haptic(pattern = 12) {
  try {
    const state = getState();
    if (!state.settings.haptics) return;
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (err) { /* sin soporte */ }
}

/* ---------------- modo foco y scroll ---------------- */

export function setFocusMode(on) {
  document.body.classList.toggle('is-focus', !!on);
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'auto' });
}

export function confirmSheet({ title, message, confirmLabel = 'Confirmar', danger = false, onConfirm }) {
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

export function accuracyTone(pct) {
  if (pct >= 80) return 'ok';
  if (pct >= 55) return 'warn';
  return 'bad';
}

export function applyTheme(theme) {
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

export function scoreMessage(accuracy, total) {
  if (!total) return 'Sin respuestas todavía.';
  if (accuracy >= 90) return 'Excelente. Ese tema ya está en memoria.';
  if (accuracy >= 75) return 'Muy bien: repasá sólo los errores y volvé mañana.';
  if (accuracy >= 50) return 'Vas bien. La repetición espaciada se encarga del resto.';
  return 'Tema para reforzar: leé la teoría y repetí la práctica.';
}

export function unitProgress(quizEntries, cardEntries, lessonsRead, lessonsTotal, diagramsDone, diagramsTotal) {
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
