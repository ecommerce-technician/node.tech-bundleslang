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

app.get('/api/v1/twitter/post/statuses/update/:status', function(request, response){

	var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: 'XXX',
  consumer_secret: 'XXX',
  access_token_key: 'XXX',
  access_token_secret: 'XXX'
});
 
client.post('statuses/update', {status: request.params.status},  function(error, tweet, response){
  if(error) throw error;
  console.log(tweet);  // Tweet body. 
  console.log(response);  // Raw response object. 
});

	//response.send(resp.statusCode);
	response.end();
});

app.listen(1337, function(){
	console.log('listening on port 1337');	
});