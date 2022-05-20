var express = require('express');
var bcrypt = require('bcrypt');
var app     = express();
var connection = require('./../../config');
var helper = require('./../../helper.js');

module.exports.index=function(req,res){

	connection.query('SELECT * FROM users WHERE subscription_id != ""',function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'Subscription Detail',data:results});	
		}
	});
}

module.exports.view=async function(req,res){

	var id = req.body.id;
	connection.query('SELECT * FROM users WHERE id = ?',[id],async function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			results[0].history = await get_subscription_data(results[0].id);
			res.json({status:true,status_code:200,message:'Subscription Detail',data:results[0]});
		}
	});
}

module.exports.unsubscribe_user=async function(req,res){

	var id = req.body.id;
	connection.query('SELECT * FROM users WHERE id = ?',[id],async function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			helper.unsubscribe_user(results[0],res);
		}
	});
}

async function get_subscription_data(id){
	return new Promise(async function(resolve, reject){
		connection.query('SELECT * FROM subscription_history WHERE user_id = ? ORDER BY id DESC',[id], async function (error, results) {
			if(error) {
				reject(error)
			}
			resolve(results)
		});
	})
}