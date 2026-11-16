/* ============================================================
   data/index.js — agregador de contenido y metadatos
   ============================================================ */

import { u6 } from './u6.js';
import { u8 } from './u8.js';
import { u9 } from './u9.js';
import { u10 } from './u10.js';
import { ENSAYOS, ENSAYO_CATEGORIES, CHARPY_VS_IZOD } from './ensayos.js';

export { ENSAYOS, ENSAYO_CATEGORIES, CHARPY_VS_IZOD };

export const UNITS = { u6, u8, u9, u10 };
export const UNIT_LIST = [u6, u8, u9, u10];

export const TOPICS = {
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
  dispersion: { label: 'Dispersión', unit: 'u10' },
  reacciones: { label: 'Reacciones de 3 fases', unit: 'u10' },
  fronteras: { label: 'Liquidus / solidus / solvus', unit: 'u10' },
  eutectica: { label: 'Aleación eutéctica', unit: 'u10' },
  curvas: { label: 'Curvas U10', unit: 'u10' },
  aplicaciones: { label: 'Aplicaciones U10', unit: 'u10' },
};

export const ALL_LESSONS = UNIT_LIST.flatMap((unit) =>
  unit.lessons.map((lesson) => ({ ...lesson, unit: unit.id })),
);

export const ALL_CARDS = UNIT_LIST.flatMap((unit) => unit.cards);
export const ALL_QUIZ = UNIT_LIST.flatMap((unit) => unit.quiz);
export const ALL_FORMULAS = UNIT_LIST.flatMap((unit) =>
  unit.formulas.map((formula) => ({ ...formula, unit: unit.id })),
);

export function getUnit(id) {
  return UNITS[id] || u6;
}

export function getLesson(id) {
  return ALL_LESSONS.find((lesson) => lesson.id === id) || null;
}

export function lessonsForUnit(unitId) {
  return getUnit(unitId).lessons;
}

export function cardsForUnit(unitId) {
  return getUnit(unitId).cards;
}

export function quizForUnit(unitId) {
  return getUnit(unitId).quiz;
}

export function getTopic(topicId) {
  return TOPICS[topicId] || { label: topicId, unit: 'u6' };
}

export function topicLessons(topicId) {
  return ALL_LESSONS.filter((lesson) => lesson.id.includes(topicId));
}

export function getEnsayo(id) {
  return ENSAYOS.find((ensayo) => ensayo.id === id) || null;
}

export function ensayosByUnit(unitId) {
  return ENSAYOS.filter((ensayo) => (unitId === 'u8' ? ensayo.category === 'dinamico' : true));
}

export const COUNTS = {
  lessons: ALL_LESSONS.length,
  cards: ALL_CARDS.length,
  quiz: ALL_QUIZ.length,
  formulas: ALL_FORMULAS.length,
  ensayos: ENSAYOS.length,
};

export function unitCounts(unitId) {
  const unit = getUnit(unitId);
  return {
    lessons: unit.lessons.length,
    cards: unit.cards.length,
    quiz: unit.quiz.length,
    formulas: unit.formulas.length,
  };
}
