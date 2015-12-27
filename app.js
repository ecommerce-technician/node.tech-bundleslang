var express = require('express');
var http = require("http");
var https = require("https");
var Twitter = require('twitter');
var fetch = require('node-fetch');
var env = require('./env.js');

var app = express();


var twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
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
	twitterClient.get('search/tweets', {q:request.params.search,result_type:'recent',count:99,lang:'en'}, function(error, tweets, response){
   		console.log(tweets);
	});

	//response.send(resp.statusCode);
	response.end();
});

app.get('/api/v1/twitter/mentions', function(request, response){
	twitterClient.get('statuses/mentions_timeline', {result_type:'recent'}, function(error, tweets, response){
   		console.log(tweets);
	});

	//response.send(resp.statusCode);
	response.end();
});

app.get('/api/v1/reddit/search/:search', function(request, response){

    fetch('https://www.reddit.com/search.json?q='+ request.params.search +'&sort=new')
        .then(function(res) {
            return res.json();
        }).then(function(json) {
            console.log(json);
        });

    //response.send(resp.statusCode);
    response.end();
});

app.listen(1337, function(){
	console.log('listening on port 1337');	
});