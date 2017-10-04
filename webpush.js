const webpush = require('web-push');
const fs = require('fs');
const path = require('path');
const GCM_KEY = require('./setting.js').GCM_KEY;//<Your GCM API Key Here>
const vapidPublicKey = require('./setting.js').vapidPublicKey;//vapidkey
const vapidPrivateKey = require('./setting.js').vapidPrivateKey;

//const vapidKeys = webpush.generateVAPIDKeys(); generate a new key
//vapidKeys.publicKey
//vapidKeys.privateKey save to setting


// if your subscribe has applicationServerKey: convertedVapidKey, you can comment setGCM_KEY
webpush.setGCMAPIKey(String(GCM_KEY));
webpush.setVapidDetails(
   'mailto:example@',//your email
	vapidPublicKey,
	vapidPrivateKey
   	);

module.exports = push = (endpoint,ttl = 0, auth, p256dh, payload)=> {
	let pushSubscription = {
      endpoint: endpoint,
	  TTL: Number(ttl),
      keys: {
               auth: auth,
               p256dh: p256dh
        }
	}
	webpush.sendNotification(pushSubscription, payload)
		.then( res => console.log(res.statusCode))
		.catch( (err) => { console.log(JSON.parse(err.body));console.log(`endpoint: ${err.endpoint}`); })
	pushSubscription.payload = payload;
	fs.appendFile(path.join(__dirname,'push.log'), JSON.stringify(pushSubscription)+'\n', (err) => { //log
		if(err) throw err;
	});
};

