if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
        const remainingTasksCount = 3
        // registration.showNotification('Task Reminder', {
//             body: `You have ${remainingTasksCount} tasks remaining for the day.`,
//             icon: '/assets/img/robot.png',
//             badge: '/assets/img/robot.png',
//             requireInteraction: true, // Keeps the notification visible until user interacts
//           });
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });

}

  // Notification.requestPermission().then((permission) => {
//     if (permission === 'granted') {
        
        // new Notification("RapiTask", {
//             body: `You have ${} tasks remaining for the day`,
//             icon: '/assets/img/robot.png',
//         })
//     }
//   });
