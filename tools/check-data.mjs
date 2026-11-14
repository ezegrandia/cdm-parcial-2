/**
 * Verificación de contenido: IDs únicos, respuestas válidas y referencias.
 * Uso: node tools/check-data.mjs
 */
import { UNIT_LIST, ALL_QUIZ, ALL_CARDS, ALL_LESSONS, TOPICS, ALL_FORMULAS, ENSAYOS } from '../js/data/index.js';
import { ALL_DIAGRAMS } from '../js/diagrams/index.js';

const errors = [];
const warnings = [];
const seen = new Set();

function unique(id, kind) {
  if (seen.has(id)) errors.push(`ID duplicado (${kind}): ${id}`);
  seen.add(id);
}

UNIT_LIST.forEach((unit) => {
  unit.lessons.forEach((lesson) => {
    unique(lesson.id, 'lección');
    const valid = new Set(['p', 'ul', 'ol', 'formula', 'callout', 'table', 'diagram', 'lab', 'mini', 'note']);
    lesson.blocks.forEach((block, index) => {
      if (!valid.has(block.t)) errors.push(`Bloque inválido en ${lesson.id}[${index}]: ${block.t}`);
      if (block.t === 'diagram' && !ALL_DIAGRAMS.some((diagram) => diagram.id === block.id)) {
        errors.push(`Diagrama inexistente referenciado en ${lesson.id}: ${block.id}`);
      }
      if (block.t === 'lab' && !['chvorinov', 'impacto'].includes(block.id)) {
        errors.push(`Laboratorio inexistente referenciado en ${lesson.id}: ${block.id}`);
      }
    });
    if (!lesson.goal || !lesson.keyPoints?.length) warnings.push(`Lección sin objetivo o keyPoints: ${lesson.id}`);
  });

  unit.cards.forEach((card) => unique(card.id, 'tarjeta'));

  unit.quiz.forEach((question) => {
    unique(question.id, 'pregunta');
    if (!TOPICS[question.topic]) errors.push(`Tema desconocido en ${question.id}: ${question.topic}`);
    if (!['u6', 'u8'].includes(question.unit)) errors.push(`Unidad inválida en ${question.id}: ${question.unit}`);
    if (question.type === 'mcq') {
      if (!Array.isArray(question.options) || question.options.length < 2) errors.push(`Opciones inválidas en ${question.id}`);
      if (!Number.isInteger(question.correct) || question.correct < 0 || question.correct >= (question.options?.length || 0)) {
        errors.push(`Índice correcto inválido en ${question.id}`);
      }
      if (new Set(question.options).size !== question.options.length) warnings.push(`Opciones repetidas en ${question.id}`);
    } else if (question.type === 'num') {
      if (!Number.isFinite(question.answer)) errors.push(`Respuesta numérica inválida en ${question.id}`);
      if (!Number.isFinite(question.tolerance) || question.tolerance <= 0) errors.push(`Tolerancia inválida en ${question.id}`);
      if (!question.answerUnit) errors.push(`Falta answerUnit en ${question.id}`);
      if (question.options) errors.push(`Pregunta numérica con opciones en ${question.id}`);
    } else {
      errors.push(`Tipo de pregunta desconocido en ${question.id}: ${question.type}`);
    }
    if (!question.explain) errors.push(`Sin explicación: ${question.id}`);
  });

  unit.formulas.forEach((formula) => unique(formula.id, 'fórmula'));
});

ENSAYOS.forEach((ensayo) => {
  unique(ensayo.id, 'ensayo');
  if (!ensayo.measures || !ensayo.probeta || !ensayo.formula) errors.push(`Ensayo incompleto: ${ensayo.id}`);
  if (ensayo.diagram && !ALL_DIAGRAMS.some((diagram) => diagram.id === ensayo.diagram)) {
    errors.push(`Diagrama inexistente en ensayo ${ensayo.id}: ${ensayo.diagram}`);
  }
});

ALL_DIAGRAMS.forEach((diagram) => {
  unique(`diagram:${diagram.id}`, 'diagrama');
  diagram.variants.forEach((variant) => {
    const numbers = variant.pins.map((pin) => pin.n);
    if (new Set(numbers).size !== numbers.length) errors.push(`Pines repetidos en ${diagram.id}/${variant.key}`);
    const labels = variant.pins.map((pin) => pin.label);
    if (new Set(labels).size !== labels.length) warnings.push(`Etiquetas repetidas en ${diagram.id}/${variant.key}`);
    if (!variant.svg.includes('</svg>')) errors.push(`SVG inválido en ${diagram.id}/${variant.key}`);
    variant.pins.forEach((pin) => {
      if (!pin.q || !pin.detail || !pin.label) errors.push(`Pin incompleto en ${diagram.id}/${variant.key} #${pin.n}`);
      if (pin.x < 0 || pin.x > 360 || pin.y < 0 || pin.y > 300) warnings.push(`Pin fuera del viewBox en ${diagram.id}/${variant.key} #${pin.n}`);
    });
  });
});

const counts = {
  lecciones: ALL_LESSONS.length,
  tarjetas: ALL_CARDS.length,
  preguntas: ALL_QUIZ.length,
  numericas: ALL_QUIZ.filter((q) => q.type === 'num').length,
  formulas: ALL_FORMULAS.length,
  ensayos: ENSAYOS.length,
  diagramas: ALL_DIAGRAMS.length,
  pines: ALL_DIAGRAMS.reduce((acc, diagram) => acc + diagram.variants.reduce((sum, variant) => sum + variant.pins.length, 0), 0),
};

console.log('Conteos:', counts);
if (warnings.length) {
  console.log(`\nAdvertencias (${warnings.length}):`);
  warnings.forEach((warning) => console.log(' -', warning));
}
if (errors.length) {
  console.log(`\nERRORES (${errors.length}):`);
  errors.forEach((error) => console.log(' ✗', error));
  process.exitCode = 1;
} else {
  console.log('\nSin errores de contenido.');
}
