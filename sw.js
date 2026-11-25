/**
 * Service Worker - Calendario de Adviento (sw.js)
 * Permite que la aplicación funcione offline y se instale en celulares (PWA).
 */

const CACHE_NAME = 'adviento-amor-v1';

// Archivos esenciales que se guardan en el dispositivo
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './css/wallet.css',
  './css/animations.css',
  './js/days-data.js',
  './js/app.js',
  './js/wallet.js',
  './js/day31.js',
  './js/lib/qrcode.min.js',
  './js/lib/confetti.min.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

// 1. Instalación del Service Worker y guardado en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activación y limpieza de versiones viejas de caché
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Estrategia de respuesta: Cache first, fallback to network
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones que no sean GET (o esquemas no http/https)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Solo cachear respuestas válidas de nuestro propio origen
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        var responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Si no hay red y no está en caché
        return caches.match('./index.html');
      });
    })
  );
});
