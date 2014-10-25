/**
 * TwitterController
 *
 * @description :: Server-side logic for managing twitters
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require('request');

module.exports = {

  twitter: function (req, res) {
    'use strict';
    sails.services.twitter.getToken()
      .then(function(authObject) {
        sails.services.twitter.getTweets(authObject, req.query.lat, req.query.lon)
        .then(function(tweets) {
          return res.send(tweets);
        });
      });
  }
};
