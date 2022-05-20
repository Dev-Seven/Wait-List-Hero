var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var app = require('./app');
var port = process.env.PORT || 8002;

var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

console.log('Your node server start....');

exports = module.exports = app;