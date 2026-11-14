/* ============================================================
   views/partials.js — piezas de interfaz reutilizables
   ============================================================ */

import { icon } from '../core/ui.js';
import { getTopic, TOPICS } from '../data/index.js';
import { esc } from '../core/utils.js';

export function pageHead({ eyebrow = '', eyebrowTone = '', title, sub = '', action = '' }) {
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

export function unitPill(unitId) {
  const isU6 = unitId === 'u6';
  return `<span class="badge ${isU6 ? 'badge--accent' : 'badge--warn'}">U${isU6 ? 6 : 8}</span>`;
}

export function topicPill(topicId) {
  const topic = getTopic(topicId);
  return `<span class="badge">${esc(topic.label)}</span>`;
}

export function lessonTopic(lesson) {
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

export function renderBlocks(blocks = []) {
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
          <div class="formula__expr">${block.expr}</div>
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

export function formulaCard(formula, { maskable = false } = {}) {
  return `<div class="fcard ${maskable ? 'is-masked' : ''}" data-formula="${formula.id}">
    <div class="fcard__head">
      <span class="fcard__name">${esc(formula.name)}</span>
      ${maskable ? `<button class="btn btn--xs btn--ghost" type="button" data-reveal="${formula.id}" aria-label="Mostrar u ocultar fórmula">${icon('bulb', 'icon--xs')}</button>` : ''}
    </div>
    <div class="fcard__expr" data-mask-target="${formula.id}">${formula.expr}</div>
    ${formula.note ? `<div class="fcard__note">${formula.note}</div>` : ''}
  </div>`;
}

export function segmentedTabs(items, activeKey, { hrefFor } = {}) {
  return `<div class="segmented" role="tablist">
    ${items.map((item) => {
      const active = item.key === activeKey;
      const href = hrefFor ? hrefFor(item.key) : item.href;
      return `<a role="tab" aria-selected="${active}" href="${href}" ${active ? 'aria-current="page"' : ''}>${item.label}</a>`;
    }).join('')}
  </div>`;
}

export function diagramCard(diagram, solved, total) {
  return `<a class="diagram-card" href="#/teoria/diagramas/${diagram.id}">
    <span class="diagram-card__thumb ${diagram.unit === 'u8' ? 'diagram-card__thumb--u8' : ''}">${icon('chart')}</span>
    <span class="row-card__main">
      <span class="row-card__title">${esc(diagram.title)}</span>
      <span class="row-card__meta">${esc(diagram.subtitle)} · ${solved}/${total} puntos</span>
    </span>
    <svg class="row-card__chev"><use href="#i-chevron-right"></use></svg>
  </a>`;
}
