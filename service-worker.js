self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('albihns-qa-v1').then((cache) => cache.addAll([
      './',
      './index.html',
      './manifest.json',
      './service-worker.js',
      './icons/icon-192.png',
      './icons/icon-512.png',
      './icons/splash-2048x2732.png',
      './icons/splash-2732x2048.png'
    ]))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request))
  );
});
