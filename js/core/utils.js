/* ============================================================
   utils.js — utilidades puras compartidas por toda la app
   ============================================================ */

export function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function sample(list, n) {
  return shuffle(list).slice(0, Math.max(0, n));
}

export function uniq(list) {
  return [...new Set(list)];
}

export function groupBy(list, keyFn) {
  return list.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] = acc[key] || []).push(item);
    return acc;
  }, {});
}

export function percent(part, total) {
  if (!total) return 0;
  return clamp(Math.round((part / total) * 100), 0, 100);
}

export function pad2(n) {
  return String(n).padStart(2, '0');
}

/** Clave local de día: YYYY-MM-DD (hora del dispositivo). */
export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function addDaysToKey(key, days) {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return dayKey(date);
}

export function daysBetweenKeys(a, b) {
  if (!a || !b) return Infinity;
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const da = Date.UTC(ay, am - 1, ad);
  const db = Date.UTC(by, bm - 1, bd);
  return Math.round((db - da) / 86400000);
}

/** Convierte "1.570,8", "1570.8" o "12,5" a número. */
export function parseNumber(raw) {
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

export function formatNumber(value, decimals = 2) {
  if (!Number.isFinite(value)) return '—';
  const abs = Math.abs(value);
  const d = abs >= 1000 ? Math.min(decimals, 1) : decimals;
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: d,
    useGrouping: true,
  });
}

export function formatPercent(value) {
  return `${Math.round(value)}%`;
}

export function truncate(text, max) {
  const s = String(text || '');
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

export function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function plural(n, singular, pluralWord) {
  return n === 1 ? singular : (pluralWord || `${singular}s`);
}

export function minutesLabel(min) {
  return `${min} min`;
}

export function sum(list, fn = (x) => x) {
  return list.reduce((acc, item) => acc + (fn(item) || 0), 0);
}

export function countWords(html) {
  return String(html || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
}

export function downloadText(filename, text, type = 'application/json') {
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
