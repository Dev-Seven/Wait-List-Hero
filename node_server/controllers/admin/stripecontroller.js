var express = require('express');
var bcrypt = require('bcrypt');
var app     = express();
var connection = require('./../../config');
var helper = require('./../../helper.js');

module.exports.create_product=async function(req,res){
	helper.createStripeProduct(res);
}