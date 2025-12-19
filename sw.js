// ShadowFX Service Worker
const CACHE = "shadowfx-cache-v1";

// Verwende die Hauptseite als Offline-Fallback
const offlineFallbackPage = "/cryp/index.html";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Cache beim Installieren
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.add(offlineFallbackPage))
  );
});

// Navigation Preload aktivieren
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Alle Seiten mit StaleWhileRevalidate cachen
workbox.routing.registerRoute(
  new RegExp('/cryp/.*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);

// Offline-Fallback für Navigationsanfragen
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;
        if (preloadResp) return preloadResp;

        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {
        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});
