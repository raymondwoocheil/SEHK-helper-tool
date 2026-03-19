const CACHE_NAME = 'magic-link-creator-offline';

// 1. Install: Prepare the cache
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME));
  self.skipWaiting(); // Force active status
});

// 2. Fetch: Intercept requests, cache pages, and serve offline
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Clone and cache the current page
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Serve from cache if offline
          return caches.match(event.request);
        })
    );
  }
});
