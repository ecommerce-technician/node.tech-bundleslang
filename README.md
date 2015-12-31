# bundleslang
Bundles Lang - A quick and easy aliasing syntax to mine the social web
 - Designed to quickly connect to node.tech-basic
 
## Restful API Endpoints
Consume these endpoints using get requests to query twitter and reddit apis

### Twitter
 - Post a status update ```/api/v1/twitter/post/statuses/update/:status```
 - Search for a mention ```/api/v1/twitter/search/:search```
 
### Reddit
 - Search for a mention ```/api/v1/reddit/search/:search```
 
### Markit
 - Search for company data by Ticker ```/api/v1/markit/search/:search```
 - Get stock quotes by Ticker ```/api/v1/markit/search/quote/:ticker```

### Google News
 - Streaming news by Search Term ```/api/v1/google-news/search/:search```


