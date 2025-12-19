const CACHE_NAME = "shadowfx-pwa-v1";
const urlsToCache = [
  "/cryp/index.html",
  "/cryp/manifest.json",
  "/cryp/icon-192.png",
  "/cryp/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
