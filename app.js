var express = require('express');
var http = require("http");
var https = require("https");
var request = require('request');
var Twitter = require('twitter');
var env = require('./env.json');
var fs = require('fs');

var app = express();


var twitterClient = new Twitter({
    consumer_key: env.TWITTER_CONSUMER_KEY,
    consumer_secret: env.TWITTER_CONSUMER_SECRET,
    access_token_key: env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: env.TWITTER_ACCESS_TOKEN_SECRET
});

app.use(express.static('public')); //todo nginx in production

app.use(function(req, res, next) {
    next();
});

app.get('/', function(req, res){
    //loads index file + angular app
    res.sendFile(__dirname + '/public/index.html');
});

//Twitter
app.get('/api/v1/twitter/post/statuses/update/:status', function(req, res){
    twitterClient.post('statuses/update', {status: req.params.status},  function(error, tweet, res){
        if(error) throw error;
        console.log(tweet);  // Tweet body.
        console.log(res);  // Raw res object.
    });

    //res.send(resp.statusCode);
    res.end();
});

//Twitter
app.get('/api/v1/twitter/search/:search', function(req, res){
    twitterClient.get('search/tweets', {q:req.params.search,result_type:'recent',count:99,lang:'en'}, function(error, tweets, res){
        shipIt(tweets)
    });

    function shipIt(tweets) {
        res.send(tweets);
    }
});

//Twitter
app.get('/api/v1/twitter/mentions', function(req, res){
    twitterClient.get('statuses/mentions_timeline', {result_type:'recent'}, function(error, tweets, res){
        console.log(tweets.statuses);
    });

    //res.send(resp.statusCode);
    res.end();
});

//Google News
app.get('/api/v1/google-news/search/:search', function(req, res){
    var url='http://ajax.googleapis.com/ajax/services/search/news?v=1.0&q=' + req.params.search;
    request(url).pipe(res);
});

//Reddit
app.get('/api/v1/google-news/search/:search', function(req, res){
    var url='http://www.reddit.com/search.json?q=' + req.params.search + 'ferrari&sort=new';
    request(url).pipe(res);
});

//Pagespeed
app.get('/api/v1/pagespeed/search/:search', function(req, res){
    var url='https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url=http://'+ req.params.search +'&key=AIzaSyDVqAOfmeJJsgDQqERAmodrAbnp1XVnv88' ;
    request(url).pipe(res);
});

//Scrape HTTP
app.get('/api/v1/scrape/http/:search', function(req, res){
    var url='http://'+ req.params.search;
    request(url).pipe(res);
});

//Scrape HTTPS
app.get('/api/v1/scrape/https/:search', function(req, res){
    var url='https://'+ req.params.search;
    request(url).pipe(res);
});


app.listen(7777, function(){
    console.log('listening on port 7777');
});
