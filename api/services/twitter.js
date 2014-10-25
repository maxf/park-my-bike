var Promise = require('promise');
var request = require('request');



exports.getToken = function() {
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

  return new Promise(function (fulfill, reject) {
    request.post({
      url:url,
      headers:headers,
      formData: {'grant_type':'client_credentials'}
    },
    function(error, response, body) {
      if (error) reject(error);
      else fulfill(body);
    });
  });

};

exports.getTweets = function(authObject, lat, lon) {
  var token = JSON.parse(authObject).access_token;
  // get tweets
  var words = 'bike stolen';
  var url = 'https://api.twitter.com/1.1/search/tweets.json?q='+encodeURIComponent(words)+'&geocode='+lat+','+lon+',1km';
  return new Promise(function (fulfill, reject) {
    request({
      'url': url,
      'headers': { 'Authorization':'Bearer ' + token }
    }, function (error, response, body) {
      if (error) reject(error);
      else fulfill(JSON.parse(body));
    });
  });
};
