var express = require('express');
var http = require("http");
var https = require("https");
var Twitter = require('twitter');
var fetch = require('node-fetch');
var app = express();


var twitterClient = new Twitter({
  consumer_key: 'xfkjzRkTIKc33Z0l6KWySl56U',
  consumer_secret: 'JuOetPqYVC929L9O42erKfX0aF6Dqb9ph1pJ9P684duiVn4CB8',
  access_token_key: '3165869263-MWZFHU2K7KPyh3armcu22q3OWdPz9BUdNQnK5zs',
  access_token_secret: 'yNl7T6mBhKhmlha34KKZ4zDyEBsxtJI1RqYlcfHP8OCKi'
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