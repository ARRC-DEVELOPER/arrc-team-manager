self.addEventListener('push', function (event) {
  if (event.data) {
    const payload = event.data.json();

    // Ensure the payload has the required fields
    const title = payload.notification ? payload.notification.title : 'Default Title';
    const body = payload.notification ? payload.notification.body : 'No message';

    const options = {
      body: body,
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } else {
    console.error('Push event does not contain any data:', event);
  }
});
