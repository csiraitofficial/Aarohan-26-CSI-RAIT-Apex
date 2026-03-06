// Service Worker
// Handles offline functionality and caching for PWA

const CACHE_NAME = 'krishi-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/auth.js',
  '/firebase-config.js',
  '/blockchain-simulator.js',
  '/smart-contracts-enhanced.js',
  '/notifications.js',
  '/search.js',
  '/exports.js',
  '/chatbot.js',
  '/i18n.js',
  '/sw.js',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  '/assets/images/logo.png',
  '/assets/fonts/Inter-Regular.woff2',
  '/assets/fonts/Inter-Bold.woff2'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // Clone the request because it's consumed by fetch
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response because it's consumed by cache.put
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        ).catch(() => {
          // Return offline fallback for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          
          // Return cached response for other requests
          return caches.match('/offline.html');
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data when connection is restored
async function syncOfflineData() {
  try {
    // Get offline data from IndexedDB or cache
    const offlineData = await getOfflineData();
    
    if (offlineData.length > 0) {
      // Sync each item
      for (const data of offlineData) {
        try {
          await syncDataToServer(data);
          await removeOfflineData(data.id);
        } catch (error) {
          console.error('Failed to sync data:', error);
        }
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Get offline data (placeholder implementation)
async function getOfflineData() {
  // This would retrieve data from IndexedDB
  return [];
}

// Sync data to server (placeholder implementation)
async function syncDataToServer(data) {
  // This would send data to the server
  return fetch('/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

// Remove offline data (placeholder implementation)
async function removeOfflineData(id) {
  // This would remove data from IndexedDB
}

// Push notification support
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from Krishi',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/assets/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/cross.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Krishi Platform', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background fetch for large files
self.addEventListener('backgroundfetch', (event) => {
  if (event.tag === 'blockchain-data') {
    event.waitUntil(
      handleBackgroundFetch(event)
    );
  }
});

async function handleBackgroundFetch(event) {
  try {
    // Handle background fetch completion
    const registration = await event.updateUI({
      title: 'Blockchain Data Download Complete'
    });
    
    // Show notification when complete
    self.registration.showNotification('Download Complete', {
      body: 'Blockchain data has been downloaded successfully',
      icon: '/assets/icons/icon-192x192.png'
    });
  } catch (error) {
    console.error('Background fetch failed:', error);
  }
}
