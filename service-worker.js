self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('rapitask-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/tasks.html',
        '/cache.html',
        '/styles.css',
        '/assets/js/app.js',
        '/assets/js/global.js',
        '/assets/js/profile.js',
        '/assets/js/tasks.js',
        '/assets/img/robot.png',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
