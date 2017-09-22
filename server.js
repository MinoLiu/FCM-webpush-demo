var express = require('express');
var app = express();
var path = require('path');
var push = require('./webpush.js')
var bodyParser = require('body-parser');
var fs = require('fs');


const checkRepeat = (endpoint) => {
	let f = fs.readFileSync('endpoint').toString().split("\n")
	for(x in f){
		try{
			let regex = /endpoint\":\"(https.*)\",\"key/.exec(f[x]) //get endpoint
			if(regex && regex[1] == endpoint){
				return false
			}
		} catch(err){
			console.log(err)
		}
	}
	return true
}

app.use(bodyParser.json()); // to resolve res body 
app.use('/static', express.static(__dirname + '/src/static'))
app.use('/', express.static(__dirname + '/src/views'));

app.post('/sendNotification', function (req,res) {
	setTimeout( () => {
		push(
			req.body.endpoint,
			req.body.ttl,
			req.body.authSecret,
			req.body.key,
			req.body.payload
		)
		res.sendStatus(201);
	}, req.body.delay *1000)
})

app.post('/register', function(req,res) {
	let endpoint = req.body.endpoint;
	let key = req.body.key;
	let authSecret = req.body.authSecret;
	if(checkRepeat(req.body.endpoint)){
		fs.appendFile(path.join(__dirname,'endpoint'), JSON.stringify(req.body)+'\n', (err) => {
			if(err) throw err;
		})

	}
	res.sendStatus(201);
})

app.post('/unregister', function(req,res){
	let endpoint = req.body.endpoint;
	// TODO: delete the endpoint
})



app.listen(5000, '127.0.0.1', () => {
	console.log('Node.js web server at port 5000 is running...')
})
