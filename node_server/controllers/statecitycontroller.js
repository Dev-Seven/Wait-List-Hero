var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var connection = require('./../config');
var mail_transporter = require('./../mail_config');

module.exports.state_list=function(req,res){
	
	var sql = 'SELECT * FROM us_states';
	connection.query(sql,function (error, results, fields) {
		if (results.length > 0) {
			res.json({status:true,status_code:200,message:'State List.',data:results})
		} else {
			res.json({status:false,status_code:201,message:'State not found.'})
		}
	});
}

module.exports.city_list_as_per_state=function(req,res){
	
	var state_id = req.body.state_id;

	console.log(state_id)

	var sql = 'SELECT * FROM us_cities WHERE state_id = ?';
	connection.query(sql,[state_id],function (error, results, fields) {
		if (results.length > 0) {
			res.json({status:true,status_code:200,message:'City List.',data:results})
		} else {
			res.json({status:false,status_code:201,message:'City not found.'})
		}
	});
}