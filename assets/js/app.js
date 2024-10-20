if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
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
