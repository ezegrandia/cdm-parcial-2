/* ============================================================
   text.js — normalización de texto para búsquedas y respuestas
   ============================================================ */

export function normalize(value) {
  return String(value == null ? '' : value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function includesNormalized(haystack, needle) {
  return normalize(haystack).includes(normalize(needle));
}
