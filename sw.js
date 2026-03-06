// sw.js — Service Worker for PWA

const CACHE_NAME = 'krishi-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/auth.js',
  '/firebase-config.js',
  '/blockchain-simulator.js',
  '/smart-contracts-enhanced.js',
  '/notifications.js',
  '/chatbot.js',
  '/search.js',
  '/exports.js',
  '/i18n.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(err => console.error('Cache failed:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Skip Firebase and external API requests
  if (event.request.url.includes('firebasestorage') ||
      event.request.url.includes('googleapis') ||
      event.request.url.includes('gstatic') ||
      event.request.url.includes('unpkg') ||
      event.request.url.includes('cdn.jsdelivr') ||
      event.request.url.includes('cdnjs.cloudflare') ||
      event.request.url.includes('tile.openstreetmap')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200) return response;
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        });
      })
      .catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});