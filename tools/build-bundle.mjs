/**
 * Genera js/bundle.js: una versión clásica (sin módulos ES) de toda la app,
 * para que index.html funcione al abrirse directamente con file://.
 *
 * Uso: node tools/build-bundle.mjs
 * Después de editar cualquier archivo de js/, volvé a ejecutarlo.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('../js', import.meta.url)));
const ENTRY = 'main.js';
const OUT = path.join(ROOT, 'bundle.js');

const modules = new Map();
const visiting = new Set();
const visited = new Set();
const order = [];

const keyOf = (file) => file.split(path.sep).join('/');
const read = (key) => fs.readFileSync(path.join(ROOT, key), 'utf8');

function resolveImport(fromKey, spec) {
  if (!spec.startsWith('.')) throw new Error(`Import no relativo en ${fromKey}: ${spec}`);
  const target = path.posix.normalize(path.posix.join(path.posix.dirname(fromKey), spec));
  if (!fs.existsSync(path.join(ROOT, target))) throw new Error(`No existe ${target} (importado desde ${fromKey})`);
  return target;
}

function parseExportNames(source) {
  const names = [];
  for (const match of source.matchAll(/^export\s+(?:async\s+)?function\s+([A-Za-z0-9_$]+)/gm)) names.push(match[1]);
  for (const match of source.matchAll(/^export\s+(?:const|let|var|class)\s+([A-Za-z0-9_$]+)/gm)) names.push(match[1]);
  for (const match of source.matchAll(/^export\s*\{([^}]*)\}\s*;?[ \t]*$/gm)) {
    match[1].split(',').map((part) => part.trim()).filter(Boolean).forEach((part) => {
      const [original, alias] = part.split(/\s+as\s+/);
      names.push((alias || original).trim());
    });
  }
  return [...new Set(names)];
}

function visit(key) {
  if (visited.has(key)) return;
  if (visiting.has(key)) throw new Error(`Dependencia circular en ${key}`);
  visiting.add(key);
  const source = read(key);
  const imports = [];
  const importRegex = /^import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"];?[ \t]*$/gm;
  for (const match of source.matchAll(importRegex)) {
    imports.push({ clause: match[1].trim(), spec: match[2], key: resolveImport(key, match[2]) });
  }
  modules.set(key, { source, imports, exports: parseExportNames(source) });
  imports.forEach((item) => visit(item.key));
  visiting.delete(key);
  visited.add(key);
  order.push(key);
}

function namedClause(clause) {
  const inner = clause.trim().replace(/^\{|\}$/g, '').trim();
  if (!inner) return '';
  return inner.split(',').map((part) => part.trim()).filter(Boolean).map((part) => {
    const pieces = part.split(/\s+as\s+/);
    return pieces.length === 2 ? `${pieces[0].trim()}: ${pieces[1].trim()}` : part;
  }).join(', ');
}

function transform(key) {
  const mod = modules.get(key);
  let source = mod.source;
  const importRegex = /^import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"];?[ \t]*$/gm;

  source = source.replace(importRegex, (full, clause, spec) => {
    const depKey = resolveImport(key, spec);
    if (clause.trim().startsWith('{')) {
      return `const { ${namedClause(clause)} } = __CDM_MODULES__[${JSON.stringify(depKey)}];`;
    }
    if (clause.trim().startsWith('* as ')) {
      return `const ${clause.trim().slice(5).trim()} = __CDM_MODULES__[${JSON.stringify(depKey)}];`;
    }
    return `const ${clause.trim()} = __CDM_MODULES__[${JSON.stringify(depKey)}].default;`;
  });

  // Quita export { ... } y deja los nombres en el ámbito (son imports o declaraciones locales).
  source = source.replace(/^export\s*\{[^}]*\}\s*;?[ \t]*$/gm, '');
  // Quita la palabra export de las declaraciones.
  source = source.replace(/^export\s+(?=(?:async\s+)?function\s|const\s|let\s|var\s|class\s)/gm, '');

  const exported = mod.exports.length
    ? `  __CDM_MODULES__[${JSON.stringify(key)}] = { ${mod.exports.join(', ')} };`
    : `  __CDM_MODULES__[${JSON.stringify(key)}] = {};`;

  return `/* ===== ${key} ===== */
(function () {
  "use strict";
${source}
${exported}
})();`;
}

visit(ENTRY);

const banner = `/* CDM Repaso — bundle generado automáticamente por tools/build-bundle.mjs.
   No editar a mano: cambiá los módulos de js/ y volvé a ejecutar el script.
   Sirve para abrir index.html directamente (file://), donde los módulos ES no cargan. */
var __CDM_MODULES__ = Object.create(null);
`;

const output = banner + '\n' + order.map(transform).join('\n\n') + '\n';
fs.writeFileSync(OUT, output, 'utf8');

console.log(`Bundle generado: ${path.relative(process.cwd(), OUT)}`);
console.log(`Módulos: ${order.length} · ${(output.length / 1024).toFixed(1)} KB`);
console.log(order.join(' → '));
