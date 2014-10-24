/**
 * TwitterController
 *
 * @description :: Server-side logic for managing twitters
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require('request');

var twitter, twitterToken, twitterSecret, token;

module.exports = {

  get_tweets: function () {
    return 'yay';
  },

  twitter: function (req, res) {
    'use strict';
    var t = sails.config.twitter;
    if (!t.requestToken) {
      if (!t.object) {
        var twitterAPI = require('node-twitter-api');
        t.object = new twitterAPI({
          consumerKey: t.api_key,
          consumerSecret: t.api_secret
        });
      }
      t.object.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
        if (error) {
          console.log("Error getting OAuth request token : ", error);
          return res.send('{}');
        } else {
          console.log("got token");
          t.requestToken = requestToken;
          t.requestTokenSecret = requestTokenSecret;
          return res.send('{}');
        }
      });
    }
    return res.send('{}');
  }
};
