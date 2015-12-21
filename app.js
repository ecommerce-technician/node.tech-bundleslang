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

	var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: 'SCGiI36qKuzOubIT8LtSNDbJq',
  consumer_secret: 'XGUCOopoIsgr432qqWIPihABlf9vHmmm77iwcoUxHbkORFIKgZ',
  access_token_key: '3165869263-MWZFHU2K7KPyh3armcu22q3OWdPz9BUdNQnK5zs',
  access_token_secret: 'yNl7T6mBhKhmlha34KKZ4zDyEBsxtJI1RqYlcfHP8OCKi'
});
 
client.post('statuses/update', {status: 'Hello World - testing bundleslang! #nodejs'},  function(error, tweet, response){
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