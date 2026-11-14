/* ============================================================
   router.js — enrutador por hash, sin dependencias
   ============================================================ */

const routes = [];

/**
 * Registra una ruta con parámetros estilo /teoria/leccion/:id
 */
export function addRoute(pattern, view) {
  const keys = [];
  const rx = new RegExp(`^${pattern.replace(/:([A-Za-z0-9_]+)/g, (_, key) => {
    keys.push(key);
    return '([^/]+)';
  })}$`);
  routes.push({ rx, keys, view });
}

export function resolve(path) {
  for (const route of routes) {
    const match = path.match(route.rx);
    if (match) {
      const params = {};
      route.keys.forEach((key, i) => { params[key] = decodeURIComponent(match[i + 1]); });
      return { view: route.view, params };
    }
  }
  return null;
}

export function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/inicio';
  const [pathPart, queryPart] = raw.split('?');
  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  const query = {};
  if (queryPart) {
    new URLSearchParams(queryPart).forEach((value, key) => { query[key] = value; });
  }
  return { path: path.replace(/\/+$/, '') || '/inicio', query };
}

export function navigate(path, { replace = false } = {}) {
  const target = `#${path.startsWith('/') ? path : `/${path}`}`;
  if (replace) {
    window.location.replace(target);
  } else if (window.location.hash === target) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = target;
  }
}

export function startRouter(render) {
  window.addEventListener('hashchange', render);
  render();
}

export function currentPath() {
  return parseHash().path;
}
