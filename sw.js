/* ============================================================
   sw.js — service worker: app offline después de la 1.ª visita
   ============================================================ */

const VERSION = 'cdm-v1.4.0';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './css/components-extra.css',
  './js/main.js',
  './js/core/router.js',
  './js/core/store.js',
  './js/core/srs.js',
  './js/core/ui.js',
  './js/core/utils.js',
  './js/core/text.js',
  './js/core/sessions.js',
  './js/data/index.js',
  './js/data/u6.js',
  './js/data/u8.js',
  './js/data/ensayos.js',
  './js/data/shapes.js',
  './js/diagrams/index.js',
  './js/diagrams/u6.js',
  './js/diagrams/u8.js',
  './js/views/home.js',
  './js/views/theory.js',
  './js/views/diagrams.js',
  './js/views/formulas.js',
  './js/views/ensayos.js',
  './js/views/practice.js',
  './js/views/quiz.js',
  './js/views/flashcards.js',
  './js/views/lab.js',
  './js/views/progress.js',
  './js/views/partials.js',
  './assets/icons/favicon.svg',
  './assets/icons/icon-180.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navegación: index.html desde caché si no hay red.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('./index.html')),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
