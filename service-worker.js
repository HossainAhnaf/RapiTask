self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('rapitask-cache-v1').then((cache) => {
        return caches.delete('rapitask-cache-v1');
        cache.addAll([
          '/',
          '/index.html',
          '/tasks.html',
          '/cache.html',
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
  
  // Periodic background sync to fetch active tasks count
  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'fetch-active-tasks') {
      event.waitUntil(fetchActiveTasksCount());
    }
  });
  
  async function fetchActiveTasksCount() {
    // const response = await fetch('/api/active-tasks-count');
    // const data = await response.json();
    // const taskCount = data.activeTaskCount;
    const taskCount = 3
  
    if (taskCount > 0) {
      self.registration.showNotification('RapiTask Notification', {
        body: `You have ${taskCount} active tasks.`,
        icon: '/assets/img/robot.png',
        tag: 'active-tasks-notification',
      });
    }
  }
  