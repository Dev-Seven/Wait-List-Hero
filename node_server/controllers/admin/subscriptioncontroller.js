var express = require('express');
var bcrypt = require('bcrypt');
var app     = express();
var connection = require('./../../config');
var helper = require('./../../helper.js');

module.exports.view=function(req,res){

	var name = 'subscription_amount';
	connection.query('SELECT * FROM subscription_data WHERE name = ?',[name],function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			if(results.length > 0){
				res.json({status:true,status_code:200,message:'Subscription Detail',data:results});
			} else {
				var amount = 2;
				connection.query('INSERT INTO subscription_data(name,amount)',[name,amount],function (error, results, fields) {
					if (error) {
						res.json({status:false,status_code:201,message:'there are some error with query'})
					} else {
						connection.query('SELECT * FROM subscription_data WHERE name = ?',[name],function (error, results, fields) {
							if (error) {
								res.json({status:false,status_code:201,message:'there are some error with query'})
							} else {
								res.json({status:true,status_code:200,message:'Subscription Detail',data:results});
							}
						});
					}
				});
			}
		}
	});
}

module.exports.update=function(req,res){

	var name = 'subscription_amount';
	var amount = req.body.amount;
	var sql = 'UPDATE subscription_data SET amount = ? WHERE name = ?';
	connection.query(sql,[amount,name],function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'Subscription Amount updated successfully',data:[]});
		}
	});
}

module.exports.view_commission=function(req,res){

	var name = 'admin_commission';
	connection.query('SELECT * FROM subscription_data WHERE name = ?',[name],function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			if(results.length > 0){
				res.json({status:true,status_code:200,message:'Commission Detail',data:results});
			} else {
				var amount = 5;
				connection.query('INSERT INTO subscription_data(name,amount)',[name,amount],function (error, results, fields) {
					if (error) {
						res.json({status:false,status_code:201,message:'there are some error with query'})
					} else {
						connection.query('SELECT * FROM subscription_data WHERE name = ?',[name],function (error, results, fields) {
							if (error) {
								res.json({status:false,status_code:201,message:'there are some error with query'})
							} else {
								res.json({status:true,status_code:200,message:'Commission Detail',data:results});
							}
						});
					}
				});
			}
		}
	});
}

module.exports.update_commission=function(req,res){

	var name = 'admin_commission';
	var amount = req.body.amount;
	var old_amount = req.body.old_amount;

	if(old_amount == amount){
		res.json({status:true,status_code:200,message:'Commission price updated successfully'});
	} else {
		var sql = 'UPDATE subscription_data SET amount = ? WHERE name = ?';
		connection.query(sql,[amount,name],function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {

				var sql = 'SELECT * FROM stripe_subscription_products ORDER BY id DESC';
			    connection.query(sql, function (error, results, fields) {
					if (error) {
						res.json({status:false,status_code:201,message:error})
					} else {
						var product_id = results[0].product_id;
						var plan_price = amount * 100;
						helper.createStripePlan(product_id,plan_price,res)
					}
				});
			}
		});
	}
}