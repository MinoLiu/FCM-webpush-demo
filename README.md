# FCM-webpush-demo

> A FCM web push demo

### Requirements

+ [node](https://github.com/nodejs/node) (v8.3.0+)
+ [npm](https://github.com/npm/npm)

### Build Setup

``` bash
# install dependencies
npm install
# after config
# run server on 127.0.0.1:5000
npm start
```

### If you don't have vapidkey, you can generate a new key
``` node
const vapidKeys = require('web-push').generateVAPIDKeys();
vapidKeys.publicKey;
vapidKeys.privateKey;
```

### Config setting.js
``` node
// After using vapid the GCM_KEY is not important
// if you don't want to use that just comment the webpush.setGCMAPIKey(String(GCM_KEY));
// in webpush.js line 14
exports.GCM_KEY = "<YOUR GCM_KEY HERE>"
exports.vapidPublicKey = "<YOUR VAPID PUBLICKEY HERE>"
exports.vapidPrivateKey = "<YOUR VAPID PRIVATEKEY HERE>"
```
### Config /src/static/main.js line 6
``` node
var vapidPublicKey = "<YOUR VAPID PUBLICKEY HERE>";
```

### Config /src/static/manifest.json
``` json
"gcm_sender_id": "<YOUR_SENDER_ID>"
```


## Usage for sender.js
#### It can send notification to all subscribes 
``` bash
node sender.js test_title test_body
```
