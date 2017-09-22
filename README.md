# FCM-webpush-demo

> A FCM web push demo

#### Build Setup

``` bash
# install dependencies
npm install

# setting.js config

Go to firebase fill your Authorization key

and

use node run
const vapidKeys = require('web-push').generateVAPIDKeys();
vapidKeys.publicKey
vapidKeys.privateKey 
fill to setting

# change /src/static/manifest.json

 "gcm_sender_id": "<YOUR_SENDER_ID>"
 
 # run server on 127.0.0.1:5000
 npm start
