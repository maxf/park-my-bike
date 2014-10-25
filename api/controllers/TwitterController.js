/**
 * TwitterController
 *
 * @description :: Server-side logic for managing twitters
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require('request');
var async = require('async');

module.exports = {

  twitter: function (req, res) {
    'use strict';
    async.waterfall(
      [
        function (callback) {
          sails.services.twitter.getToken(callback);
        },
        function (authObject, callback) {
          sails.services.twitter.getTweets(authObject, req.query.lat, req.query.lon, callback);
        }
      ],
      function (error, tweets) {
        if (error) return res.send(error);
        else return res.send(tweets);
      }
    );
  }
};
