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
        if (error) return res.send(error);
        var r = results.reduce(function(a,b) { return a.concat(b); });
        // score tweet depending on words they contain
        for (var i=0; i<r.length; i++) r[i].bikeScore=0;
        ['bike', 'bicycle', 'steal', 'nicked', 'theft'].forEach(function(word) {
          for (var i=0; i<r.length; i++) {
            if (r[i].text.toLowerCase().indexOf(word) != -1) {
              r[i].bikeScore++;
            }
          }
        });
        console.log(r);
        return res.json(r.sort(function(tweet1, tweet2) { return tweet2.score - tweet1.score; }));
      }
    );
  }
};
