const CACHE_NAME = 'culebrita-v2';
const ASSETS = [
  "/",
  "index.html",
  "estilos.css",
  "juego.js",
  "manifest.json",
  "icon-192.png",
  "icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request)
      .then(res => res || fetch(e.request))
      .catch(() => {
        if (e.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      })
  );
});
