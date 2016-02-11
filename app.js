var express = require('express');
var http = require("http");
var https = require("https");
var request = require('request');
var Twitter = require('twitter');
var GoogleNews, googleNews, track;
var GoogleNews = require('google-news')
var fetch = require('node-fetch');
var env = require('./env.js');
var fs = require('fs');

var app = express();


var twitterClient = new Twitter({
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
    access_token_key: access_token_key,
    access_token_secret: access_token_secret
});

app.use(express.static('public')); //todo nginx in production
app.use(function(req, res, next) {
    next();
});

app.get('/', function(req, res){
    //loads index file + angular app
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/v1/twitter/post/statuses/update/:status', function(req, res){
    twitterClient.post('statuses/update', {status: req.params.status},  function(error, tweet, res){
        if(error) throw error;
        console.log(tweet);  // Tweet body.
        console.log(res);  // Raw res object.
    });

    //res.send(resp.statusCode);
    res.end();
});

app.get('/api/v1/twitter/search/:search', function(req, res){
    twitterClient.get('search/tweets', {q:req.params.search,result_type:'recent',count:99,lang:'en'}, function(error, tweets, res){
        shipIt(tweets)
    });

    function shipIt(tweets) {
        res.send(tweets);
    }
});

app.get('/api/v1/twitter/count/:search', function(req, res){
    twitterClient.get('search/tweets', {q:req.params.search,result_type:'recent',count:99,lang:'en'}, function(error, tweets, res){
        var count = [];
        for (i = 0; i < tweets.statuses.length; i++) {
            count.push({
                headline: "Retweeted " + tweets.statuses[i].retweet_count,
                description: tweets.statuses[i].text,
                url: $sce.trustAsHtml(tweets.statuses[i].source),
                time: tweets.statuses[i].created_at
            });
        }
        shipIt(count.length)
    });

    function shipIt(count) {
        res.send(count);
    }
});

app.get('/api/v1/twitter/mentions', function(req, res){
    twitterClient.get('statuses/mentions_timeline', {result_type:'recent'}, function(error, tweets, res){
        shipIt(tweets);
    });

    //res.send(resp.statusCode);
    function shipIt(tweets) {
        res.send(tweets);
    }
});

app.get('/api/v1/reddit/search/:search', function(req, res){

    fetch('https://www.reddit.com/search.json?q='+ req.params.search +'&sort=new')
        .then(function(res) {
            return res.json();
        }).then(function(json) {
            console.log(json);
        });

    //res.send(resp.statusCode);
    res.end();
});

app.get('/api/v1/markit/search/:search', function(req, res){

    fetch('http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input=' + req.params.search)
        .then(function(res) {
            console.log(res);
            return res.json();
        }).then(function(json) {
            console.log(json);
        });

    //res.send(resp.statusCode);
    res.end();
});

app.get('/api/v1/markit/search/quote/:ticker', function(req, res){

    fetch('http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=' + req.params.ticker)
        .then(function(res) {
            console.log(res);
            return res.json();
        }).then(function(json) {
            console.log(json);
        });

    //res.send(resp.statusCode);
    res.end();
});

app.get('/api/v1/markit/search/interactive/:ticker', function(req, res){

    fetch('http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=%7B%22Normalized%22%3Afalse%2C%22NumberOfDays%22%3A365%2C%22DataPeriod%22%3A%22Day%22%2C%22Elements%22%3A%5B%7B%22Symbol%22%3A%22' + req.params.ticker + '%22%2C%22Type%22%3A%22price%22%2C%22Params%22%3A%5B%22c%22%5D%7D%5D%7D')
        .then(function(res) {
            console.log(res);
            return res.json();
        }).then(function(json) {
            console.log(json);
        });

    //res.send(resp.statusCode);
    res.end();
});

app.get('/api/v1/google-news/search/:search', function(req, res){
    googleNews = new GoogleNews();


    googleNews.stream(req.params.search, function(stream) {

        stream.on(GoogleNews.DATA, function(data) {
            return console.log('Data Event received... ' + data.title);
        });

        stream.on(GoogleNews.ERROR, function(error) {
            return console.log('Error Event received... ' + error);
        });
    });

    //res.send(resp.statusCode);
    res.end();
});

app.get('/api/v1/politics/lobbyingdisclosure/state/:search', function(req, res){

    var url = 'https://api.enigma.io/v2/data/b3c7ce1c0cd6bf220a99c7390de60e61/us.gov.senate.lobbyingdisclosure.org.2006?search[]=(%22'+ req.params.search +'%22)&conjunction=and';
    request(url).pipe(res);

});

app.listen(7777, function(){
    console.log('listening on port 7777');
});