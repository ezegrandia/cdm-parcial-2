/* ============================================================
   data/shapes.js — figuras básicas para Chvorinov
   V, A y V/A + siluetas SVG para el simulador
   ============================================================ */

const frac = (num, den) => `<span class="frac"><span class="frac__num">${num}</span><span class="frac__den">${den}</span></span>`;

const cubeIcon = `<svg viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
  <path d="M9 18 26 9l17 9v18L26 45 9 36z"/><path d="M9 18l17 9 17-9M26 27v18"/></svg>`;

const prismIcon = `<svg viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
  <path d="M6 20 22 11h24v21L30 41H6z"/><path d="M6 20h24M30 20v21M30 20l16-9"/></svg>`;

const cylinderIcon = `<svg viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="2">
  <ellipse cx="26" cy="13" rx="15" ry="6"/><path d="M11 13v26a15 6 0 0 0 30 0V13"/></svg>`;

const sphereIcon = `<svg viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="26" cy="26" r="17"/><ellipse cx="26" cy="26" rx="17" ry="6"/></svg>`;

export const SHAPES = [
  {
    id: 'cubo',
    name: 'Cubo',
    note: 'El caso más simple y el más probable en el examen.',
    icon: cubeIcon,
    dims: [{ key: 'a', label: 'Lado a', unit: 'cm', min: 1, max: 100, step: 0.5, value: 10 }],
    formulas: { v: 'V = a³', a: 'A = 6a²', va: 'V/A = a/6' },
    html: { v: 'V = a³', a: 'A = 6a²', va: `V/A = ${frac('a','6')}` },
    compute: ({ a }) => ({ V: a ** 3, A: 6 * a ** 2, VA: a / 6 }),
  },
  {
    id: 'prisma',
    name: 'Prisma',
    note: 'Figura «tipo caja»: seis caras en tres pares iguales.',
    icon: prismIcon,
    dims: [
      { key: 'a', label: 'Lado a', unit: 'cm', min: 1, max: 100, step: 0.5, value: 6 },
      { key: 'b', label: 'Lado b', unit: 'cm', min: 1, max: 100, step: 0.5, value: 8 },
      { key: 'c', label: 'Lado c', unit: 'cm', min: 1, max: 100, step: 0.5, value: 10 },
    ],
    formulas: { v: 'V = a·b·c', a: 'A = 2(ab + bc + ac)', va: 'V/A = abc / [2(ab+bc+ac)]' },
    html: { v: 'V = a·b·c', a: 'A = 2(ab + bc + ac)', va: `V/A = ${frac('abc','2(ab+bc+ac)')}` },
    compute: ({ a, b, c }) => {
      const V = a * b * c;
      const A = 2 * (a * b + b * c + a * c);
      return { V, A, VA: V / A };
    },
  },
  {
    id: 'cilindro',
    name: 'Cilindro',
    note: 'No olvidar las dos tapas: 2πr². r = D/2.',
    icon: cylinderIcon,
    dims: [
      { key: 'd', label: 'Diámetro D', unit: 'cm', min: 1, max: 100, step: 0.5, value: 10 },
      { key: 'h', label: 'Altura h', unit: 'cm', min: 1, max: 100, step: 0.5, value: 20 },
    ],
    formulas: { v: 'V = πr²h', a: 'A = 2πr² + 2πrh', va: 'V/A = r·h / [2(r+h)]' },
    html: { v: `V = πr²h = ${frac('π','4')}D²h`, a: `A = 2πr² + 2πrh = ${frac('π','2')}D² + πDh`, va: `V/A = ${frac('r·h','2(r+h)')} = ${frac('D·h','2(D+2h)')}` },
    compute: ({ d, h }) => {
      const r = d / 2;
      const V = Math.PI * r ** 2 * h;
      const A = 2 * Math.PI * r ** 2 + 2 * Math.PI * r * h;
      return { V, A, VA: V / A, r };
    },
  },
  {
    id: 'esfera',
    name: 'Esfera',
    note: 'Máximo V/A a igual volumen: es la que más tarda.',
    icon: sphereIcon,
    dims: [{ key: 'd', label: 'Diámetro D', unit: 'cm', min: 1, max: 100, step: 0.5, value: 20 }],
    formulas: { v: 'V = (4/3)πr³', a: 'A = 4πr²', va: 'V/A = r/3' },
    html: { v: `V = ${frac('4','3')}πr³`, a: 'A = 4πr²', va: `V/A = ${frac('r','3')}` },
    compute: ({ d }) => {
      const r = d / 2;
      const V = (4 / 3) * Math.PI * r ** 3;
      const A = 4 * Math.PI * r ** 2;
      return { V, A, VA: V / A, r };
    },
  },
];

export function shapeById(id) {
  return SHAPES.find((shape) => shape.id === id) || SHAPES[0];
}

export function shapeDefaults(shape) {
  return shape.dims.reduce((acc, dim) => {
    acc[dim.key] = dim.value;
    return acc;
  }, {});
}

/** Compara las cuatro figuras con el mismo volumen (cm³). */
export function compareEqualVolume(volume) {
  const cubeSide = Math.cbrt(volume);
  const cubeA = 6 * cubeSide ** 2;

  const sphereR = Math.cbrt((3 * volume) / (4 * Math.PI));
  const sphereA = 4 * Math.PI * sphereR ** 2;

  // Prisma con lados proporcionales 1 : 2 : 3 → V = 6k³
  const k = Math.cbrt(volume / 6);
  const prismA = 2 * (k * 2 * k + 2 * k * 3 * k + k * 3 * k);

  // Placa de base 20 × 20 cm y espesor ajustado para el volumen pedido
  const plateThickness = volume / 400;
  const plateA = 2 * 400 + 4 * 20 * plateThickness;

  return [
    { name: 'Placa 20×20', A: plateA, color: 'placa' },
    { name: 'Prisma 1:2:3', A: prismA, color: 'prisma' },
    { name: 'Cubo', A: cubeA, color: 'cubo' },
    { name: 'Esfera', A: sphereA, color: 'esfera' },
  ].map((row) => ({ ...row, VA: volume / row.A }));
}
