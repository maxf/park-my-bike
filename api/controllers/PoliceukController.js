/**
 * PoliceukController
 *
 * @description :: Server-side logic for managing policeuks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require('request');

module.exports = {

  /**
   * `PoliceukController.bicycletheft()`
   * example: http://localhost:1337/policeuk/bicycletheft?lat=51.496664&lon=-0.128617&year=2014&month=01
   */
  bicycletheft: function (req, res) {
    'use strict';
    var crimes, bicycleThefts;
    var lat = req.query.lat;
    var lon = req.query.lon;
    var month = req.query.month;
    var year = req.query.year;
    var url = 'http://data.police.uk/api/crimes-street/all-crime?date='+year+'-'+
          month+'&lat='+lat+'&lng='+lon;

    if (!(lat&&lon&&month&&year)) {
      return res.badRequest('bad request');
    } else {
      request(url, function(error, response, body) {
        if (error) {
          return res.badRequest('error: '+error);
        }
        crimes = JSON.parse(body);
        bicycleThefts = crimes.filter(function(c) {
          return c.category === 'bicycle-theft';
        });
        return res.json(bicycleThefts);
      });
       return true;
    }
  }
};
