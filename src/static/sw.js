self.addEventListener('push', function(event) {
	var payload = event.data ? event.data.text() : 'no payload';
	try {
		payload = JSON.parse(payload);
		event.waitUntil(
			self.registration.showNotification(payload.title, {
				body: payload.body,
				icon: '/static/push-icon.png'
			})
		)
	} catch(err) {
		event.waitUntil(
			self.registration.showNotification("Oops, something went wrong.", {
				body: payload,
				icon: '/static/push-icon.png'
			})
		)
	}	
})
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
	event.waitUntil(async function() {
    const allClients = await clients.matchAll({
      includeUncontrolled: true
    });

    let nfClient;

    // Let's see if we already have a notification window open:
    for (const client of allClients) {
      const url = new URL(client.url);

      if (url.pathname == '/') {
        // Excellent, let's use it!
        client.focus();
        nfClient = client;
        break;
      }
    }

    // If we didn't find an existing window,
    // open a new one:
    if (!nfClient) {
      nfClient = await clients.openWindow('/');
    }

    // you can send message to the client
    nfClient.postMessage("New messages!");
  }());
});
