var express = require('express');
var http = require("http");
var https = require("https");
var Twitter = require('twitter');
var GoogleNews, googleNews, track;
var GoogleNews = require('google-news')
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

app.get('/api/v1/markit/search/:search', function(request, response){

    fetch('http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input=' + request.params.search)
        .then(function(res) {
            console.log(res);
            return res.json();
        }).then(function(json) {
            console.log(json);
        });

    //response.send(resp.statusCode);
    response.end();
});

app.get('/api/v1/markit/search/quote/:ticker', function(request, response){

    fetch('http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=' + request.params.ticker)
        .then(function(res) {
            console.log(res);
            return res.json();
        }).then(function(json) {
            console.log(json);
        });

    //response.send(resp.statusCode);
    response.end();
});

app.get('/api/v1/markit/search/interactive/:ticker', function(request, response){

    fetch('http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=%7B%22Normalized%22%3Afalse%2C%22NumberOfDays%22%3A365%2C%22DataPeriod%22%3A%22Day%22%2C%22Elements%22%3A%5B%7B%22Symbol%22%3A%22' + request.params.ticker + '%22%2C%22Type%22%3A%22price%22%2C%22Params%22%3A%5B%22c%22%5D%7D%5D%7D')
        .then(function(res) {
            console.log(res);
            return res.json();
        }).then(function(json) {
            console.log(json);
        });

    //response.send(resp.statusCode);
    response.end();
});

app.get('/api/v1/google-news/search/:search', function(request, response){
    googleNews = new GoogleNews();


    googleNews.stream(request.params.search, function(stream) {

        stream.on(GoogleNews.DATA, function(data) {
            return console.log('Data Event received... ' + data.title);
        });

        stream.on(GoogleNews.ERROR, function(error) {
            return console.log('Error Event received... ' + error);
        });
    });

    //response.send(resp.statusCode);
    response.end();
});

app.listen(7777, function(){
	console.log('listening on port 7777');
});