var express = require('express');
var http = require("http");
var https = require("https");
var Twitter = require('twitter');
var app = express();


var twitterClient = new Twitter({
  consumer_key: 'xxxxxx',
  consumer_secret: 'xxxxxx',
  access_token_key: 'xxxxxx',
  access_token_secret: 'xxxxxx'
});

app.use(express.static('public')); //todo nginx in production
app.use(function(request, response, next) {
	next();
});

app.get('/', function(request, response){
	//loads index file + angular app
	response.sendFile(__dirname + '/public/index.html');
}); 

app.get('/api/v1/twitter/post/statuses/update/:status', function(request, response){
 
	twitterClient.post('statuses/update', {status: request.params.status},  function(error, tweet, response){
	  if(error) throw error;
	  console.log(tweet);  // Tweet body. 
	  console.log(response);  // Raw response object. 
	});

	//response.send(resp.statusCode);
	response.end();
});

app.get('/api/v1/twitter/search/:search', function(request, response){
	twitterClient.get('search/tweets', {q: request.params.search}, function(error, tweets, response){
   		console.log(tweets);
	});

	//response.send(resp.statusCode);
	response.end();
});



app.listen(1337, function(){
	console.log('listening on port 1337');	
});