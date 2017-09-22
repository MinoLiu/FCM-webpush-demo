var push = require('./webpush.js');
var fs = require('fs');
var path = require('path');
var myArgs = process.argv.slice(2)

//usage node sender.js test_title test_body

var lineReader = require('readline').createInterface({
	  input: fs.createReadStream('endpoint')
});

lineReader.on('line', function (line) {
	let body = JSON.parse(line)
		push( 
			body.endpoint,
			body.ttl,
			body.authSecret,
			body.key,
			JSON.stringify({
				"title": myArgs[0],
				"body": myArgs[1]
			})
		)
	console.log(myArgs[0], 'sent!')
});
