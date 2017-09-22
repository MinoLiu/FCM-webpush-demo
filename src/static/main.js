var endpoint;
var key;
var authSecret;
var isPushEnabled = false;
var useNotification = false;


var subBtn = document.querySelector('#subscribe');
var submit = document.querySelector('#doIt');

window.addEventListener('load', () => {
	subBtn.addEventListener('click', () => {
		if(isPushEnabled){
			unsubscribe();
		} else {
			subscribe();
		}
	})
	if('serviceWorker' in navigator){
		navigator.serviceWorker.register('/static/sw.js').then((reg) => {
			if(reg.installing) {
				console.log('Service worker installing');
			} else if(reg.waiting) {
				console.log('Service worker installed');
			} else if(reg.active) {
				console.log('Service worker active');
			}

			navigator.serviceWorker.addEventListener('message', event => {
				  console.log(event.data);
			});
			initialiseState(reg);
		})
	} else {
		console.log('Service workers aren\'t supported in this browser.');
	}
})

const initialiseState = (reg) => {
	//Are Notifications supported in the service worker?
	if(!(reg.showNotification)){
		console.log('Notifications aren\'t supported on service workers.');
		useNotification = false;
	} else {
		useNotification = true;
	}
	// Check the current Notification permission.  
	// If its denied, it's a permanent block until the  
	// user changes the permission  
	if(Notification.permission === 'denied'){
		console.log('The user has blocked notifications.')
		return;
	}

	//check if push messaging is supported
	if(!('PushManager' in window)){
		console.log('The user has blocked notifications.');
	}
	reg.pushManager.getSubscription()
		.then( (subscription) => {
			// Enable any UI which subscribes / unsubscribes from push messages.
			subBtn.disabled = false
			if(!subscription){
				console.log('Not yet subscribed to Push')
				// We aren't subscribed to push, so set UI
				// to allow the user to enable push
				return;
			}
			subBtn.textContent = 'Unsubscribe from push Messaging';
			isPushEnabled = true;

			var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
			key = rawKey ?
				btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) :
				'';
			var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
			authSecret = rawAuthSecret ?
				btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) :
				'';
			endpoint = subscription.endpoint;
			updateStatus('init');
		})
}

const subscribe = () => {
	subBtn.disabled = true;
	navigator.serviceWorker.getRegistrations() // get all registrations
		.then( regs => {
			let reg = regs[0]; // take the first one
			if(reg && 'pushManager' in reg){ // check it exist
				reg.pushManager.subscribe({ userVisibleOnly: true })
					.then(subscription => {
						var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
						key = rawKey ?
							btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) :
							'';
						var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
						authSecret = rawAuthSecret ?
							btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) :
							'';
						endpoint = subscription.endpoint;
						updateStatus('subscribe');
						updateStatus('init');
						subBtn.textContent = 'Unsubscribe from push Messaging';
						isPushEnabled = true;
						subBtn.disabled = false;
					})
			}
		})
}

const unsubscribe = () => {
	subBtn.disabled = true;
	navigator.serviceWorker.getRegistrations()
		.then( regs => {
			let reg = regs[0];
			if(reg && 'pushManager' in reg){
				reg.pushManager.getSubscription()
					.then(subscription => {
						subscription.unsubscribe()
							.then( () => {
								console.log('unsubscribe success');
								updateStatus('unsubscribe');
								submit.style.display = 'none';
								isPushEnabled = false;
								subBtn.disabled = false;
								subBtn.textContent = 'Subscribe to Push Messaging';
								return;
							})
							.catch( err => console.log('unsubscribe got error'))})
					.catch( err => console.log('can\'t get subscription'))
			}
		})
}

const updateStatus = (statusType) => {
	switch(statusType){
		case 'subscribe':
			fetch('./register', {
				method: 'post',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					endpoint: endpoint,
					key: key,
					authSecret: authSecret,
				}),
			});
			return
		case 'unsubscribe':
			fetch('./unregister', {
				method: 'post',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					endpoint: endpoint,
				})
			})
			return
		case 'init':
			submit.style.display = 'block';
			return
		default:
			return
	}
}

submit.onclick = function() {
	var body = document.querySelector('#notification-body').value;
	var title = document.querySelector('#notification-title').value;
	var delay = document.querySelector('#notification-delay').value;
	var ttl = document.querySelector('#notification-ttl').value;
	var payload = JSON.stringify({
		body: body,
		title: title
	});
	fetch('./sendNotification', {
		method: 'post',
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify({
			endpoint: endpoint,
			key: key,
			authSecret: authSecret,
			payload: payload,
			delay: delay,
			ttl: ttl,
		}),
	});
};
