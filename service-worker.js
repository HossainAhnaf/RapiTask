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


document.addEventListener('DOMContentLoaded', () => {
  showRemainingTasksNotification();
});

function showRemainingTasksNotification() {
  const remainingTasksCount = getRemainingTasksCount(); // Fetch task count from storage

  if (Notification.permission === 'granted' && remainingTasksCount > 0) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification('Task Reminder', {
        body: `You have ${remainingTasksCount} tasks remaining for the day.`,
        icon: '/assets/img/robot.png',
        badge: '/assets/img/robot.png',
        requireInteraction: true, // Keeps the notification visible until user interacts
      });
    });
  }
}

function getRemainingTasksCount() {
  // This function should return the count of remaining tasks.
  // Example: Replace this with your logic to fetch the actual count of remaining tasks from local storage or IndexedDB.
  return 5; // Placeholder value, replace with actual task count
}

