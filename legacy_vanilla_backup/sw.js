// HireIQ Service Worker
// Handles: offline caching, push notifications, background alert messages
const CACHE = 'hireiq-v7';
const ASSETS = ['/'];

// Install — cache the app shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate — clean up old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — serve from cache, fall back to network, cache new responses
self.addEventListener('fetch', e => {
  // Only handle GET requests for same-origin or CDN assets
  if(e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Don't cache API calls
  if(url.hostname.includes('groq.com') || url.hostname.includes('rapidapi.com')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;
      return fetch(e.request).then(res => {
        // Cache successful same-origin responses
        if(res.ok && (url.origin === self.location.origin || url.hostname.includes('cdnjs'))) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached || new Response('Offline', {status: 503}));
    })
  );
});

// Messages from the main thread (job alert checks)
self.addEventListener('message', e => {
  if(e.data?.type === 'CHECK_ALERT') {
    self.clients.matchAll().then(clients =>
      clients.forEach(c => c.postMessage({ type: 'RUN_CHECK', alertId: e.data.alertId }))
    );
  }
  if(e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

// Push notifications
self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : {};
  e.waitUntil(self.registration.showNotification(d.title || 'HireIQ', {
    body:  d.body  || 'New jobs found matching your alerts!',
    icon:  '/icon-192.png',
    badge: '/icon-192.png',
    tag:   d.tag   || 'hireiq-alert',
    data:  d.data  || {},
    actions: [
      { action: 'open',    title: 'View jobs' },
      { action: 'dismiss', title: 'Dismiss'   }
    ]
  }));
});

// Notification click
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if(e.action === 'dismiss') return;
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cls => {
      const hireiq = cls.find(c => c.url.includes(self.location.origin));
      if(hireiq) return hireiq.focus();
      return clients.openWindow('/');
    })
  );
});
