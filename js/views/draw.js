/* ============================================================
   views/draw.js — práctica de dibujo desde cero (U10)
   ============================================================ */

import { ALL_DIAGRAMS } from '../diagrams/index.js';
import { icon } from '../core/ui.js';
import { pageHead } from './partials.js';

const STORE_KEY = 'cdm-draw-v1';

const CHALLENGES = [
  {
    id: 'eutectica', group: 'Reacciones', title: 'Eutéctica', diagram: 'reacciones', variant: 'eutectica',
    equation: 'L → α + β',
    labels: ['α', 'β', 'L', 'α + β'],
    prompt: 'Dibujá el esquema de la reacción eutéctica. Marcá α, β, L, la línea horizontal y la zona α + β. Escribí también la ecuación.',
    tip: 'Línea horizontal → α y β a los costados → cúspide con L arriba → α + β abajo.',
  },
  {
    id: 'peritectica', group: 'Reacciones', title: 'Peritéctica', diagram: 'reacciones', variant: 'peritectica',
    equation: 'α + L → β',
    labels: ['α', 'L', 'α + L', 'β'],
    prompt: 'Dibujá el esquema de la reacción peritéctica. Marcá α, L, α + L, β y la línea horizontal. Escribí la ecuación.',
    tip: 'α a la izquierda, L a la derecha, α + L arriba del centro y β en la cúspide de abajo.',
  },
  {
    id: 'monotectica', group: 'Reacciones', title: 'Monotéctica', diagram: 'reacciones', variant: 'monotectica',
    equation: 'L₁ → L₂ + α',
    labels: ['L₂', 'L₁', 'α', 'α + L₂'],
    prompt: 'Dibujá el esquema de la reacción monotéctica. Marcá la zona de miscibilidad, L₂, L₁, α y α + L₂. Escribí la ecuación.',
    tip: 'Domo de miscibilidad → L₂ afuera a la izquierda → L₁ adentro → α a la derecha → α + L₂ abajo.',
  },
  {
    id: 'eutectoide', group: 'Reacciones', title: 'Eutectoide', diagram: 'reacciones', variant: 'eutectoide',
    equation: 'γ → α + β',
    labels: ['α', 'β', 'γ', 'α + β'],
    prompt: 'Dibujá el esquema de la reacción eutectoide. Marcá α, β, γ, la línea horizontal y α + β. Escribí la ecuación.',
    tip: 'Como la eutéctica, pero la cúspide de arriba es γ (sólido) y no hay líquido.',
  },
  {
    id: 'peritectoide', group: 'Reacciones', title: 'Peritectoide', diagram: 'reacciones', variant: 'peritectoide',
    equation: 'α + β → γ',
    labels: ['α', 'β', 'α + β', 'γ'],
    prompt: 'Dibujá el esquema de la reacción peritectoide. Marcá α, β, α + β, γ y la línea horizontal. Escribí la ecuación.',
    tip: 'α a la izquierda, β a la derecha, α + β arriba y γ en la cúspide de abajo. Todo sólido.',
  },
  {
    id: 'curva-eutectica', group: 'Curvas', title: 'Curva eutéctica', diagram: 'curvas-u10', variant: 'eutectica',
    equation: 'L → α + β a TE',
    labels: ['L', 'L → α + β', 'α + β'],
    prompt: 'Dibujá la curva de enfriamiento de la aleación eutéctica. Ejes T–t, tramo líquido, meseta horizontal a TE y tramo sólido. Indicá por qué se detiene.',
    tip: 'Una sola meseta horizontal a TE: el calor latente compensa el calor extraído. Después baja el sólido α + β.',
  },
  {
    id: 'curva-hipoeutectica', group: 'Curvas', title: 'Curva hipoeutéctica', diagram: 'curvas-u10', variant: 'hipoeutectica',
    equation: 'α primaria + eutéctico',
    labels: ['L', 'α + L', 'L → eutéctico', 'α + eutéctico'],
    prompt: 'Dibujá la curva de una aleación hipoeutéctica. Marcá el codo del liquidus, la meseta eutéctica y la zona sólida final α + eutéctico.',
    tip: 'Primero precipita α primaria (codo), después la meseta eutéctica. No es una sola meseta: hay codo + meseta.',
  },
  {
    id: 'comparar-curvas', group: 'Curvas', title: 'Comparar U8 – U9 – U10', diagram: 'curvas-u10', variant: 'comparar',
    equation: 'U8: meseta · U9: sin meseta · U10: meseta',
    labels: ['U8', 'U9', 'U10'],
    prompt: 'Dibujá las tres curvas: metal puro (U8), aleación isomorfa (U9) y eutéctica (U10). Marcá la meseta de U8, los dos quiebres de U9 y la meseta de U10.',
    tip: 'U8: una meseta a Tf. U9: dos quiebres, sin meseta. U10: una meseta a TE.',
  },
];

function readDone() {
  try {
    const value = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    return new Set(Array.isArray(value) ? value : []);
  } catch (e) {
    return new Set();
  }
}

function saveDone(done) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify([...done])); } catch (e) {}
}

function referenceSvg(challenge) {
  const diagram = ALL_DIAGRAMS.find((item) => item.id === challenge.diagram);
  const variant = diagram?.variants.find((item) => item.key === challenge.variant);
  return variant?.svg || '<p class="muted">Referencia no disponible.</p>';
}

export function drawView() {
  const done = readDone();
  let index = 0;
  let strokes = [];
  let labels = [];
  let activeLabel = null;
  let drawing = false;
  let current = null;
  let ctx = null;
  let canvas = null;
  let stage = null;

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: 'Dibujo a mano',
      title: 'Dibujar desde cero',
      sub: 'Sin plantilla: dibujá el esquema, ubicá las etiquetas obligatorias y recién después compará con la referencia.',
    })}

    <div class="card draw-intro">
      <div class="row" style="gap:10px;align-items:flex-start">
        <span class="draw-intro__icon">${icon('pencil')}</span>
        <div>
          <h3>El desafío es producirlo, no reconocerlo</h3>
          <p class="card__sub">Dibujá primero la línea horizontal, después las fases de los costados y al final la cúspide. Después ubicá todas las etiquetas en el canvas y escribí la ecuación al costado. No podés marcar el desafío hasta que estén el dibujo y todas las etiquetas.</p>
        </div>
      </div>
      <div class="row row--between" style="margin-top:12px">
        <span class="badge badge--violet" id="drawCount">${done.size}/${CHALLENGES.length} practicados</span>
        <span class="muted" style="font-size:0.78rem">Se guarda en este teléfono</span>
      </div>
    </div>

    <section class="section">
      <div class="section__head"><div class="section__title">Elegí el desafío</div></div>
      <div class="draw-groups">
        <div class="draw-group">
          <div class="draw-group__title">5 reacciones</div>
          <div class="draw-chips">
            ${CHALLENGES.filter((c) => c.group === 'Reacciones').map((c) => `<button type="button" class="draw-chip" data-challenge="${c.id}">${c.title}</button>`).join('')}
          </div>
        </div>
        <div class="draw-group">
          <div class="draw-group__title">3 curvas</div>
          <div class="draw-chips">
            ${CHALLENGES.filter((c) => c.group === 'Curvas').map((c) => `<button type="button" class="draw-chip" data-challenge="${c.id}">${c.title}</button>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <div class="card draw-card">
      <div class="row row--between" style="align-items:flex-start;gap:10px">
        <div>
          <div class="eyebrow eyebrow--u10" id="drawGroup">Reacciones</div>
          <h3 id="drawTitle" style="margin-top:2px">Eutéctica</h3>
        </div>
        <span class="badge" id="drawBadge">1 / 8</span>
      </div>

      <p class="draw-prompt" id="drawPrompt"></p>

      <div class="draw-stage" id="drawStage">
        <canvas id="drawCanvas" aria-label="Área para dibujar el esquema"></canvas>
      </div>

      <div class="draw-labels">
        <div class="row row--between">
          <div class="section__title" style="font-size:0.9rem">Etiquetas obligatorias</div>
          <span class="badge badge--warn" id="drawLabelCount">0/4</span>
        </div>
        <p class="draw-muted">Elegí una etiqueta y tocá el canvas para ubicarla. Sin todas las etiquetas no podés marcar el desafío.</p>
        <div class="draw-label-chips" id="drawLabelChips"></div>
        <div class="draw-toolbar">
          <button type="button" class="btn btn--soft btn--sm" id="drawLabelRemove">${icon('trash')} Quitar última etiqueta</button>
          <button type="button" class="btn btn--soft btn--sm is-active" id="drawPencil">${icon('pencil')} Lápiz</button>
        </div>
      </div>

      <div class="draw-toolbar">
        <button type="button" class="btn btn--soft btn--sm" id="drawUndo">${icon('undo')} Deshacer</button>
        <button type="button" class="btn btn--soft btn--sm" id="drawClear">${icon('trash')} Borrar</button>
        <button type="button" class="btn btn--soft btn--sm" id="drawReveal">${icon('eye')} Ver referencia</button>
      </div>

      <div class="draw-ref" id="drawRef" hidden>
        <div class="row row--between" style="margin-bottom:8px">
          <div class="section__title" style="font-size:0.9rem">Referencia del PDF</div>
          <span class="badge badge--bad" id="drawEq"></span>
        </div>
        <div class="draw-ref__frame" id="drawRefFrame"></div>
        <div class="draw-ref__labels" id="drawRefLabels"></div>
      </div>

      <div class="draw-actions">
        <button type="button" class="btn btn--primary btn--block" id="drawMark">${icon('check')} Me salió de memoria</button>
        <button type="button" class="btn btn--soft btn--block" id="drawNext">Siguiente desafío →</button>
      </div>
      <p class="draw-muted" id="drawTip" hidden></p>
    </div>
  `;

  const $ = (selector) => el.querySelector(selector);
  const title = $('#drawTitle');
  const group = $('#drawGroup');
  const badge = $('#drawBadge');
  const prompt = $('#drawPrompt');
  const tip = $('#drawTip');
  const ref = $('#drawRef');
  const refFrame = $('#drawRefFrame');
  const refLabels = $('#drawRefLabels');
  const eq = $('#drawEq');
  const reveal = $('#drawReveal');
  const mark = $('#drawMark');
  const count = $('#drawCount');
  const chips = [...el.querySelectorAll('[data-challenge]')];
  const labelChips = $('#drawLabelChips');
  const labelCount = $('#drawLabelCount');

  const challenge = () => CHALLENGES[index];

  const updateChips = () => {
    chips.forEach((chip) => {
      const active = chip.dataset.challenge === challenge().id;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
  };

  const requiredLabels = () => challenge().labels || [];
  const missingLabels = () => requiredLabels().filter((label) => !labels.some((item) => item.text === label));

  const updateMark = () => {
    const missing = missingLabels();
    const isDone = done.has(challenge().id);
    const noDrawing = strokes.length === 0;
    mark.disabled = missing.length > 0 || noDrawing;
    mark.classList.toggle('is-done', isDone && missing.length === 0 && !noDrawing);
    mark.innerHTML = missing.length
      ? `${icon('list')} Faltan ${missing.length} etiquetas`
      : noDrawing
        ? `${icon('pencil')} Dibujá el esquema`
        : `${icon('check')} ${isDone ? 'Practicado' : 'Me salió de memoria'}`;
  };

  const updateDone = () => {
    count.textContent = `${done.size}/${CHALLENGES.length} practicados`;
    updateMark();
  };

  const updateLabelsUI = () => {
    const required = requiredLabels();
    const placed = required.filter((label) => labels.some((item) => item.text === label));
    labelCount.textContent = `${placed.length}/${required.length}`;
    labelChips.innerHTML = required.map((label) => {
      const isPlaced = labels.some((item) => item.text === label);
      return `<button type="button" class="draw-label-chip ${activeLabel === label ? 'is-active' : ''} ${isPlaced ? 'is-placed' : ''}" data-label="${label}" aria-pressed="${activeLabel === label}">${label}</button>`;
    }).join('');
    $('#drawPencil').classList.toggle('is-active', !activeLabel);
    updateMark();
  };

  const redraw = () => {
    if (!ctx || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    const ink = getComputedStyle(document.documentElement).getPropertyValue('--draw-ink').trim() || '#7dd3fc';
    ctx.strokeStyle = ink;
    ctx.fillStyle = ink;
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const stroke of strokes) {
      if (!stroke.points.length) continue;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      if (stroke.points.length === 1) {
        ctx.arc(stroke.points[0].x, stroke.points[0].y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      } else {
        for (const point of stroke.points.slice(1)) ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 15px system-ui, -apple-system, Segoe UI, sans-serif';
    for (const label of labels) {
      const width = ctx.measureText(label.text).width;
      ctx.fillStyle = 'rgba(8, 15, 28, 0.88)';
      ctx.fillRect(label.x - width / 2 - 4, label.y - 12, width + 8, 22);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(label.text, label.x, label.y);
    }
  };

  const resizeCanvas = () => {
    if (!canvas || !stage) return;
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw();
  };

  const pointFromEvent = (event) => {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const placeLabel = (text, point) => {
    const existing = labels.find((item) => item.text === text);
    if (existing) {
      existing.x = point.x;
      existing.y = point.y;
    } else {
      labels.push({ text, x: point.x, y: point.y });
    }
    activeLabel = null;
    updateLabelsUI();
    redraw();
  };

  const startStroke = (event) => {
    if (event.button !== undefined && event.button !== 0 && event.pointerType === 'mouse') return;
    event.preventDefault();
    const point = pointFromEvent(event);
    if (activeLabel) {
      placeLabel(activeLabel, point);
      return;
    }
    canvas.setPointerCapture(event.pointerId);
    drawing = true;
    current = { points: [point] };
    strokes.push(current);
    updateMark();
    redraw();
  };

  const moveStroke = (event) => {
    if (!drawing || !current) return;
    event.preventDefault();
    current.points.push(pointFromEvent(event));
    redraw();
  };

  const endStroke = (event) => {
    if (!drawing) return;
    drawing = false;
    current = null;
    if (event?.pointerId !== undefined && canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
  };

  const setChallenge = (nextIndex) => {
    index = (nextIndex + CHALLENGES.length) % CHALLENGES.length;
    strokes = [];
    labels = [];
    activeLabel = null;
    drawing = false;
    current = null;
    const item = challenge();
    title.textContent = item.title;
    group.textContent = item.group;
    badge.textContent = `${index + 1} / ${CHALLENGES.length}`;
    prompt.textContent = item.prompt;
    tip.textContent = '';
    tip.hidden = true;
    eq.textContent = item.equation;
    refFrame.innerHTML = referenceSvg(item);
    refLabels.textContent = `Etiquetas: ${(item.labels || []).join(' · ')}`;
    ref.hidden = true;
    reveal.innerHTML = `${icon('eye')} Ver referencia`;
    updateChips();
    updateDone();
    updateLabelsUI();
    requestAnimationFrame(resizeCanvas);
  };

  canvas = $('#drawCanvas');
  stage = $('#drawStage');
  ctx = canvas.getContext('2d');
  canvas.addEventListener('pointerdown', startStroke);
  canvas.addEventListener('pointermove', moveStroke);
  canvas.addEventListener('pointerup', endStroke);
  canvas.addEventListener('pointercancel', endStroke);
  canvas.addEventListener('pointerleave', (event) => { if (drawing) endStroke(event); });
  window.addEventListener('resize', resizeCanvas);

  chips.forEach((chip) => chip.addEventListener('click', () => {
    const next = CHALLENGES.findIndex((item) => item.id === chip.dataset.challenge);
    if (next >= 0) setChallenge(next);
  }));

  $('#drawUndo').addEventListener('click', () => { strokes.pop(); updateMark(); redraw(); });
  $('#drawClear').addEventListener('click', () => { strokes = []; labels = []; activeLabel = null; updateLabelsUI(); updateMark(); redraw(); });
  $('#drawLabelRemove').addEventListener('click', () => { labels.pop(); activeLabel = null; updateLabelsUI(); redraw(); });
  $('#drawPencil').addEventListener('click', () => { activeLabel = null; updateLabelsUI(); });
  labelChips.addEventListener('click', (event) => {
    const button = event.target.closest('[data-label]');
    if (!button) return;
    activeLabel = button.dataset.label;
    updateLabelsUI();
  });
  reveal.addEventListener('click', () => {
    ref.hidden = !ref.hidden;
    reveal.innerHTML = `${icon('eye')} ${ref.hidden ? 'Ver referencia' : 'Ocultar referencia'}`;
    tip.textContent = ref.hidden ? '' : challenge().tip;
    tip.hidden = ref.hidden;
    if (!ref.hidden) ref.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  mark.addEventListener('click', () => {
    if (missingLabels().length) return;
    if (done.has(challenge().id)) done.delete(challenge().id); else done.add(challenge().id);
    saveDone(done);
    updateDone();
  });
  $('#drawNext').addEventListener('click', () => setChallenge(index + 1));

  setChallenge(0);
  requestAnimationFrame(resizeCanvas);

  return { el, title: 'Dibujar desde cero', sub: 'Práctica de dibujo', nav: 'practica', back: '/practica' };
}
