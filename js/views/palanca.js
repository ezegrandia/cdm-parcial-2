/* ============================================================
   views/palanca.js — simulador de la regla de la palanca (U9)
   ============================================================ */

import { pageHead } from './partials.js';
import { icon } from '../core/ui.js';
import { formatNumber, parseNumber } from '../core/utils.js';

function tieSvg(CL, CA, CS) {
  const x = (value) => 42 + Math.max(0, Math.min(100, value)) * 2.8;
  return `<svg viewBox="0 0 360 74" role="img" aria-label="Isoterma con CL, CA y CS" style="width:100%;height:auto">
    <line x1="36" y1="40" x2="328" y2="40" stroke="var(--line-strong)" stroke-width="2"/>
    <line x1="36" y1="34" x2="36" y2="46" stroke="var(--line-strong)"/>
    <line x1="328" y1="34" x2="328" y2="46" stroke="var(--line-strong)"/>
    <line x1="${x(CL).toFixed(1)}" y1="40" x2="${x(CA).toFixed(1)}" y2="40" stroke="var(--accent)" stroke-width="5" opacity="0.35"/>
    <line x1="${x(CA).toFixed(1)}" y1="40" x2="${x(CS).toFixed(1)}" y2="40" stroke="var(--green)" stroke-width="5" opacity="0.35"/>
    <circle cx="${x(CL).toFixed(1)}" cy="40" r="5" fill="var(--accent)"/>
    <circle cx="${x(CA).toFixed(1)}" cy="40" r="5" fill="var(--amber)"/>
    <circle cx="${x(CS).toFixed(1)}" cy="40" r="5" fill="var(--green)"/>
    <text x="36" y="66" class="svg-text svg-text--muted" font-size="7">composición (% B) →</text>
  </svg>`;
}

function randomExercise() {
  const CL = 10 + Math.floor(Math.random() * 30);
  const CS = CL + 18 + Math.floor(Math.random() * 22);
  const CA = CL + 2 + Math.floor(Math.random() * (CS - CL - 4));
  return { CL, CA, CS };
}

export function palancaView() {
  const state = { CL: 32, CA: 35, CS: 43, mass: 2000 };
  let train = randomExercise();

  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    ${pageHead({
      eyebrow: 'Unidad 9 · simulador',
      eyebrowTone: 'eyebrow--u9',
      title: 'Regla de la palanca',
      sub: 'Leé CL y CS del diagrama, calculá %L y %S y comprobá que sumen 100 %.',
    })}

    <div class="card">
      <div class="grid grid--2">
        <div class="field">
          <label class="field__label" for="pal-cl">CL · líquido (%)</label>
          <div class="input-group"><input class="input" id="pal-cl" data-pal="CL" type="text" inputmode="decimal" value="${state.CL}"><span class="input-group__unit">%</span></div>
        </div>
        <div class="field">
          <label class="field__label" for="pal-ca">CA · aleación (%)</label>
          <div class="input-group"><input class="input" id="pal-ca" data-pal="CA" type="text" inputmode="decimal" value="${state.CA}"><span class="input-group__unit">%</span></div>
        </div>
        <div class="field">
          <label class="field__label" for="pal-cs">CS · sólido (%)</label>
          <div class="input-group"><input class="input" id="pal-cs" data-pal="CS" type="text" inputmode="decimal" value="${state.CS}"><span class="input-group__unit">%</span></div>
        </div>
        <div class="field">
          <label class="field__label" for="pal-mass">Masa total (opcional)</label>
          <div class="input-group"><input class="input" id="pal-mass" data-pal="mass" type="text" inputmode="decimal" value="${state.mass}"><span class="input-group__unit">g</span></div>
        </div>
      </div>
      <p class="tiny" data-pal-error style="color:var(--rose);min-height:18px;margin:2px 0 0"></p>
      <div class="chip-row" style="margin-top:6px;flex-wrap:wrap">
        <button class="chip" type="button" data-ex='{"CL":32,"CA":35,"CS":43,"mass":2000}'>Cu–35 % Ni</button>
        <button class="chip" type="button" data-ex='{"CL":40,"CA":45,"CS":60,"mass":2000}'>Números redondos</button>
        <button class="chip" type="button" data-ex='{"CL":20,"CA":25,"CS":32,"mass":3000}'>CA = 25 %</button>
        <button class="chip" type="button" data-ex='{"CL":30,"CA":40,"CS":50,"mass":3000}'>Ejemplo 30/40/50</button>
      </div>
      <div data-pal-tie style="margin-top:10px"></div>
      <div class="row row--wrap" data-pal-tie-labels style="gap:6px;margin-top:2px"></div>
      <div class="grid grid--2" style="margin-top:4px">
        <div class="stat stat--accent"><div class="stat__value" data-pal-l>—</div><div class="stat__label">% líquido</div></div>
        <div class="stat"><div class="stat__value" data-pal-s>—</div><div class="stat__label">% sólido</div></div>
      </div>
      <div class="grid grid--2" style="margin-top:10px">
        <div class="stat"><div class="stat__value" data-pal-ml style="font-size:1.1rem">—</div><div class="stat__label">masa de líquido</div></div>
        <div class="stat"><div class="stat__value" data-pal-ms style="font-size:1.1rem">—</div><div class="stat__label">masa de sólido</div></div>
      </div>
      <div class="formula" data-pal-step style="margin-top:12px"></div>
      <p class="tiny muted" data-pal-check style="margin-top:8px"></p>
    </div>

    <div class="callout callout--tip">
      <div class="callout__icon">${icon('bulb')}</div>
      <div><h4>Cómo leerlo</h4><p>La isoterma es la palanca: <b>%L</b> usa el brazo opuesto <b>CS − CA</b>; <b>%S</b> usa <b>CA − CL</b>. El denominador siempre es <b>CS − CL</b>. La fase más cercana a CA es la más abundante.</p></div>
    </div>

    <div class="card" data-train-card>
      <div class="row row--between">
        <h3 style="font-size:1rem">${icon('target', 'icon--sm')} Reto rápido</h3>
        <span class="badge">%L</span>
      </div>
      <p class="card__sub" data-train-q style="margin-top:6px"></p>
      <div class="row" style="gap:8px;align-items:flex-end">
        <div class="field" style="flex:1">
          <label class="field__label" for="pal-train">Tu resultado (% líquido)</label>
          <div class="input-group"><input class="input" id="pal-train" data-train-input type="text" inputmode="decimal" placeholder="Ej.: 58,3"><span class="input-group__unit">%</span></div>
        </div>
      </div>
      <p class="tiny" data-train-msg style="min-height:18px;margin:4px 0 0"></p>
      <div class="row row--wrap" style="margin-top:4px">
        <button class="btn btn--primary btn--sm" type="button" data-train-check>Comprobar</button>
        <button class="btn btn--soft btn--sm" type="button" data-train-next>${icon('refresh', 'icon--sm')} Otro</button>
      </div>
    </div>
  `;

  const inputs = [...el.querySelectorAll('[data-pal]')];
  const errEl = el.querySelector('[data-pal-error]');
  const tieEl = el.querySelector('[data-pal-tie]');
  const tieLabels = el.querySelector('[data-pal-tie-labels]');
  const trainQ = el.querySelector('[data-train-q]');
  const trainInput = el.querySelector('[data-train-input]');
  const trainMsg = el.querySelector('[data-train-msg]');

  function read() {
    inputs.forEach((input) => {
      state[input.dataset.pal] = parseNumber(input.value);
    });
    return state;
  }

  function render() {
    const { CL, CA, CS, mass } = read();
    const valid = Number.isFinite(CL) && Number.isFinite(CA) && Number.isFinite(CS) && CL < CA && CA < CS;
    tieEl.innerHTML = tieSvg(Number.isFinite(CL) ? CL : 0, Number.isFinite(CA) ? CA : 0, Number.isFinite(CS) ? CS : 0);

    if (!valid) {
      tieLabels.innerHTML = '';
      errEl.textContent = 'Revisá los datos: tiene que cumplirse CL < CA < CS.';
      el.querySelector('[data-pal-l]').textContent = '—';
      el.querySelector('[data-pal-s]').textContent = '—';
      el.querySelector('[data-pal-ml]').textContent = '—';
      el.querySelector('[data-pal-ms]').textContent = '—';
      el.querySelector('[data-pal-step]').innerHTML = '<div class="formula__expr">%L = (CS − CA)/(CS − CL) · 100</div>';
      el.querySelector('[data-pal-check]').textContent = '';
      return;
    }

    errEl.textContent = '';
    tieLabels.innerHTML = `<span class="badge badge--accent">CL = ${formatNumber(CL, 1)} %</span>
      <span class="badge badge--warn">CA = ${formatNumber(CA, 1)} %</span>
      <span class="badge badge--ok">CS = ${formatNumber(CS, 1)} %</span>`;
    const pctL = ((CS - CA) / (CS - CL)) * 100;
    const pctS = ((CA - CL) / (CS - CL)) * 100;
    el.querySelector('[data-pal-l]').textContent = `${formatNumber(pctL, 1)} %`;
    el.querySelector('[data-pal-s]').textContent = `${formatNumber(pctS, 1)} %`;
    const m = Number.isFinite(mass) && mass > 0 ? mass : 0;
    el.querySelector('[data-pal-ml]').textContent = m ? `${formatNumber((pctL / 100) * m, 1)} g` : '—';
    el.querySelector('[data-pal-ms]').textContent = m ? `${formatNumber((pctS / 100) * m, 1)} g` : '—';
    el.querySelector('[data-pal-step]').innerHTML = `<div class="formula__expr">%L = (${formatNumber(CS, 1)} − ${formatNumber(CA, 1)}) / (${formatNumber(CS, 1)} − ${formatNumber(CL, 1)}) · 100 = ${formatNumber(pctL, 1)} %</div>
      <div class="formula__note">%S = (${formatNumber(CA, 1)} − ${formatNumber(CL, 1)}) / ${formatNumber(CS - CL, 1)} · 100 = ${formatNumber(pctS, 1)} %</div>`;
    el.querySelector('[data-pal-check]').textContent = `Control: ${formatNumber(pctL, 1)} % + ${formatNumber(pctS, 1)} % = 100 %. La fase más cercana a CA es la más abundante.`;
  }

  inputs.forEach((input) => input.addEventListener('input', render));

  el.querySelectorAll('[data-ex]').forEach((button) => {
    button.addEventListener('click', () => {
      const data = JSON.parse(button.dataset.ex);
      Object.entries(data).forEach(([key, value]) => {
        const input = el.querySelector(`[data-pal="${key}"]`);
        if (input) input.value = value;
      });
      render();
    });
  });

  function renderTrain() {
    trainQ.innerHTML = `CL = <b>${train.CL} %</b> · CS = <b>${train.CS} %</b> · CA = <b>${train.CA} %</b>. ¿Cuál es el % de líquido?`;
    trainInput.value = '';
    trainMsg.textContent = '';
    trainMsg.style.color = '';
  }

  el.querySelector('[data-train-next]').addEventListener('click', () => {
    train = randomExercise();
    renderTrain();
    trainInput.focus();
  });

  el.querySelector('[data-train-check]').addEventListener('click', () => {
    const answer = parseNumber(trainInput.value);
    const correct = ((train.CS - train.CA) / (train.CS - train.CL)) * 100;
    if (!Number.isFinite(answer)) {
      trainMsg.textContent = 'Escribí un número.';
      trainMsg.style.color = 'var(--rose)';
      return;
    }
    if (Math.abs(answer - correct) <= 0.6) {
      trainMsg.textContent = `¡Bien! ${formatNumber(correct, 1)} % de líquido. Control: el sólido es ${formatNumber(100 - correct, 1)} %.`;
      trainMsg.style.color = 'var(--green)';
    } else {
      trainMsg.textContent = `Todavía no: da ${formatNumber(correct, 1)} %. Numerador: CS − CA = ${train.CS - train.CA}; denominador: CS − CL = ${train.CS - train.CL}.`;
      trainMsg.style.color = 'var(--rose)';
    }
  });

  render();
  renderTrain();
  return { el, title: 'Regla de la palanca', sub: 'Unidad 9 · simulador', nav: 'practica', back: '/practica/simuladores' };
}
