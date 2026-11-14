/* ============================================================
   diagrams/index.js — registro de diagramas
   ============================================================ */

import { U6_DIAGRAMS } from './u6.js';
import { U8_DIAGRAMS } from './u8.js';

export const ALL_DIAGRAMS = [...U6_DIAGRAMS, ...U8_DIAGRAMS];

export function getDiagram(id) {
  return ALL_DIAGRAMS.find((diagram) => diagram.id === id) || null;
}

export function diagramsForUnit(unitId) {
  return ALL_DIAGRAMS.filter((diagram) => diagram.unit === unitId);
}

export function diagramPinCount(diagram, variantKey) {
  const variant = variantKey
    ? diagram.variants.find((item) => item.key === variantKey)
    : diagram.variants[0];
  return variant ? variant.pins.length : 0;
}
