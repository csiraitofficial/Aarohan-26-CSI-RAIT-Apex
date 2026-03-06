const CACHE_NAME = 'krishi-v1';
const URLS_TO_CACHE = [
  '/', 
  '/index.html', 
  '/styles.css', 
  '/app.js', 
  '/blockchain-simulator.js', 
  '/i18n.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      // Return cached version or fetch from network
      return resp || fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          // Do not cache firebase or external dynamic requests
          if(!event.request.url.includes('firestore') && !event.request.url.includes('identitytoolkit')) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      });
    }).catch(() => {
        // Fallback for offline if not found
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
