if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });

  navigator.serviceWorker.ready.then((registration) => {
    if ('periodicSync' in registration) {
      registration.periodicSync.register('fetch-active-tasks', {
        minInterval: 24 * 60 * 60 * 1000, // 1 day interval
      }).catch((err) => console.error('Periodic Sync registration failed:', err));
    } else {
      console.log('Periodic Sync not supported.');
    }
  });

}

  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
        
        // new Notification("RapiTask", {
//             body: `You have ${} tasks remaining for the day`,
//             icon: '/assets/img/robot.png',
//         })
    }
  });
