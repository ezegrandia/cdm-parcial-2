/* ============================================================
   srs.js — repetición espaciada simple (cajas de Leitner)
   ============================================================ */

import { addDaysToKey, dayKey } from './utils.js';

export const BOX_INTERVALS = [0, 1, 2, 4, 8, 16, 32];
export const MAX_BOX = BOX_INTERVALS.length - 1;

/**
 * Calcula la nueva entrada de seguimiento después de responder.
 * Acierto → sube una caja; error → vuelve a la caja 0 (repaso inmediato).
 */
export function gradeEntry(previous, ok) {
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

export function isDue(entry) {
  if (!entry) return true;
  if (!entry.due) return true;
  return entry.due <= dayKey();
}

export function isMastered(entry) {
  return !!entry && (entry.box || 0) >= 4;
}

/** 0..1 según la caja alcanzada. */
export function masteryOf(entry) {
  if (!entry) return 0;
  return Math.min(1, (entry.box || 0) / MAX_BOX);
}

export function dueCount(map) {
  return Object.values(map || {}).filter(isDue).length;
}

export function dueIds(map, allIds) {
  return allIds.filter((id) => isDue(map[id]));
}

export function weakIds(map, allIds) {
  return allIds.filter((id) => {
    const e = map[id];
    return e && e.seen >= 1 && !e.lastOk;
  });
}

export function unseenIds(map, allIds) {
  return allIds.filter((id) => !map[id]);
}

/** Ordena primero lo más vencido y con caja más baja; las nuevas van al final. */
export function sortByPriority(map, ids) {
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
export function dueLabel(entry) {
  if (!entry) return 'Nueva';
  if (!entry.due) return 'Nueva';
  if (entry.due <= dayKey()) return 'Para hoy';
  return `En ${Math.round((new Date(entry.due) - new Date(dayKey())) / 86400000)} d`;
}
