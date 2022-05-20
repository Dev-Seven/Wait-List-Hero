var express = require('express');
var bcrypt = require('bcrypt');
var app     = express();
var connection = require('./../../config');

module.exports.index=function(req,res){

	connection.query('SELECT subscription_history.*, users.name AS username, users.email AS user_email, users.phone AS user_phone FROM subscription_history LEFT JOIN users ON users.id = subscription_history.user_id ORDER BY subscription_history.id DESC',function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'Subscription Detail',data:results});
		}
	});
}

module.exports.view = function(req,res){

	var id = req.body.id;
	
	connection.query('SELECT subscription_history.*, users.name AS username, users.email AS user_email, users.phone AS user_phone FROM subscription_history LEFT JOIN users ON users.id = subscription_history.user_id WHERE subscription_history.id = ?',[id],function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			if(results.length > 0){
				res.json({status:true,status_code:200,message:'Subscription Detail',data:results[0]});
			} else {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			}
		}
	});	
}