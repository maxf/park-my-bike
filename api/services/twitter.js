var request = require('request');



exports.getToken = function(callback) {
  'use strict';
  var t = sails.config.twitter;

  // URL encode key/secret
  var enc_key	= encodeURIComponent(t.api_key);
  var enc_secret = encodeURIComponent(t.api_secret);

  // Concatenate key/secret (seperated with colon)
  var keysecret = enc_key + ':' + enc_secret;

  // Base64 encode key/secret string
  var keysecret_64 = new Buffer(keysecret).toString('base64');

  // oAuth URL
  var url = "https://api.twitter.com/oauth2/token";

  // oAuth POST header
  var headers = {
    'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
    'Authorization':'Basic '+ keysecret_64
  };

  request.post({
    url:url,
    headers:headers,
    formData: {'grant_type':'client_credentials'}
  }, function(error, response, body) {
    callback(null, body);
  });
};

exports.getTweets = function(authObject, lat, lon, callback) {
  var token = JSON.parse(authObject).access_token;
  // get tweets
  var words = 'bike stolen';
  var url = 'https://api.twitter.com/1.1/search/tweets.json?q='+encodeURIComponent(words)+'&geocode='+lat+','+lon+',1km';
  request({
    'url': url,
    'headers': { 'Authorization':'Bearer ' + token }
    }, function (error, response, body) {
        callback(null, JSON.parse(body));
    });
};
