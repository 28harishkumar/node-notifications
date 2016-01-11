"use strict";

var util = require('util');
var mysequel = require('mysequel');
//var dbslave = require('ticket-config').dbslave;
var dbmaster = require('../config').db;
function configure(config) {
  var dbConfig = { 
                  url: util.format('mysql://%s:%s@%s:3306/%s',
                                    encodeURIComponent(config.user),
                                    encodeURIComponent(config.password),
                                    config.host,
                                    config.database),
                  connections: { min: config.min, max: config.max }
                };

  var db = mysequel(dbConfig);

  return db;
}


module.exports = { 
  dbmaster: configure(dbmaster)
};