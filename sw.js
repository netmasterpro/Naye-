self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("culebrita-v1").then(cache => {
      return cache.addAll([
        "index.html",
        "estilos.css",
        "juego.js",
        "manifest.json",
        "icon-192.png",
        "icon-512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
