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

    var lat = req.query.lat, lon = req.query.lon;
    async.waterfall(
      [
        function (callback) { sails.services.twitter.getToken(callback); },
        function (authObject, callback) {
          var get = sails.services.twitter.getTweets;
          async.parallel(
            [
              function (callback) { get('bike', authObject, lat, lon, callback); },
              function (callback) { get('bicycle', authObject, lat, lon, callback); },
              function (callback) { get('steal', authObject, lat, lon, callback); },
              function (callback) { get('stolen', authObject, lat, lon, callback); },
              function (callback) { get('nicked', authObject, lat, lon, callback); },
              function (callback) { get('theft', authObject, lat, lon, callback); }
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
        ['bike', 'bicycle', 'steal', 'nicked', 'theft', 'stolen'].forEach(function(word) {
          for (var i=0; i<r.length; i++) {
            if (r[i].text.toLowerCase().indexOf(word) != -1) {
              r[i].bikeScore++;
            }
          }
        });

        for (var i=0; i<r.length; i++) {
          // weigh score by some distance measure between tweet and location
          r[i].bikeScore *=
            ((lat-r[i].geo.coordinates[1])*(lat-r[i].geo.coordinates[1]) +
            (lon-r[i].geo.coordinates[0])*(lon-r[i].geo.coordinates[0]))-5320;
        }

        return res.json(r.sort(function(tweet1, tweet2) { return tweet2.bikeScore - tweet1.bikeScore; }));
      }
    );
  }
};
