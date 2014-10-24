/**
 * TwitterController
 *
 * @description :: Server-side logic for managing twitters
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require('request');

module.exports = {

  get_tweets: function () {
    return 'yay';
  },

  twitter: function (req, res) {
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

    request.post({url:url,headers:headers,formData: {'grant_type':'client_credentials'}}, function(error, response, body) {
      if (!error) {
        var token = JSON.parse(body).access_token;
      // get tweets
        request({'url':'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=therealmaxf',
                 'headers': { 'Authorization':'Bearer ' + token }
                }, function (error, response, body) {
                  if (!error) {
                    return res.send(body);
                  }
                });
     }
    });
  }
};
