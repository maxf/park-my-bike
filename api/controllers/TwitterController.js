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
        function (callback) { sails.services.twitter.getToken(callback); },
        function (authObject, callback) {
          var get = sails.services.twitter.getTweets;
          async.parallel(
            [
              function (callback) { get('bike', authObject, req.query.lat, req.query.lon, callback); },
              function (callback) { get('bicycle', authObject, req.query.lat, req.query.lon, callback); },
              function (callback) { get('steal', authObject, req.query.lat, req.query.lon, callback); },
              function (callback) { get('nicked', authObject, req.query.lat, req.query.lon, callback); },
              function (callback) { get('theft', authObject, req.query.lat, req.query.lon, callback); }
            ],
            function (error, tweetArray) {
              callback(null, tweetArray);
            }
          );
        }
      ],
      function (error, results) {
        console.log(results[3]);
        if (error) return res.send(error);
        else return res.json(results);
      }
    );
  }
};
