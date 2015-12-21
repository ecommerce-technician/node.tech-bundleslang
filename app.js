var express = require('express');
var http = require("http");
var https = require("https");
var app = express();

app.use(express.static('public')); //todo nginx in production
app.use(function(request, response, next) {
	next();
});

app.get('/', function(request, response){
	//loads index file + angular app
	response.sendFile(__dirname + '/public/index.html');
}); 

app.get('/api/v1/twitter/count-mentions/:mentions', function(request, response){

	var twitterKey = new Buffer(encodeURIComponent('XXXXXXXXXXX') + ':' + encodeURIComponent('XXXXXXXXXX')).toString('base64');
	console.log(twitterKey);
	var options = {
  		host: 'https://api.twitter.com',
  		path: '/oauth2/token',
  		method: 'POST',
  		headers: {
  			'Authorization' : 'Basic ' + twitterKey, 
  			'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8'
  		},
  		body: 'grant_type=client_credentials'
	};

	https.get(options, function(res) {
	  console.log("Got response: " + res.statusCode);
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});

	//response.send(resp.statusCode);
	response.end();
});

app.listen(1337, function(){
	console.log('listening on port 1337');	
});