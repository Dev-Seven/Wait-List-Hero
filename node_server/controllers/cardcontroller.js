var jwt = require('jsonwebtoken');
var express = require('express');
var app     = express();
var bcrypt = require('bcrypt');
var connection = require('./../config');
var stripe = require('./../stripe');

module.exports.add_card_detail=async function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

		var user_id  = decoded.data.id;

		var card_number  = req.body.card_number;
		var card_name    = req.body.card_name;
		var zipcode      = req.body.zipcode;
		var expiry_year  = req.body.expiry_year;
		var expiry_month = req.body.expiry_month;
		var cvv          = req.body.cvv;

		var sql = "SELECT * FROM users WHERE id = ?";
		connection.query(sql,[user_id], async function (err, result, fields) {
		    if (err) throw err;
		    if(result.length > 0){
		    	var data = result[0];
		    	if(!data.stripe_customer_id){
		    		const customer = await stripe.customers.create({
					  name : data.name,
					  email : data.email,
					  phone : data.phone
					}).then(function(result){
						var customer_id = result.id;
					    connection.query('UPDATE users SET stripe_customer_id = ? WHERE id = ?',[customer_id,user_id], function (error, results, fields) {
							if (error) {
								res.json({status:false,status_code:201,message:'there are some error with query'})
							} else {
								console.log('key added successfully');
							}
						});
					}, function(error){
						res.json({status:false,status_code:500,message:error.message})
					});
		    	}

		    	var sql = "SELECT * FROM users WHERE id = ?";
				connection.query(sql,[user_id], async function (err, result, fields) {
					if (err) throw err;

					var user_data = result[0];

			    	const token = await stripe.tokens.create({
						card: {
							number: card_number,
							exp_month: expiry_month,
							exp_year: expiry_year,
							cvc: cvv,
						},
					}).then(async function(result){

						const card = await stripe.customers.createSource(user_data.stripe_customer_id,
						  {source: result.id}).then(function(result){
							card_number = card_number.replace(/\d(?=\d{4})/g, "*");

							var card_id = result.id;
							var sql = "INSERT INTO user_card_details (user_id, card_id, card_number, card_name, expiry_month, expiry_year, cvv) VALUES ('"+user_id+"','"+card_id+"','"+card_number+"','"+card_name+"','"+expiry_month+"','"+expiry_year+"','"+cvv+"')";
							connection.query(sql, function (err, result, fields) {
							    if (err) throw err;
							    res.json({status:true,status_code:200,message:'New card is added successfully!',data:[]})
							});

						}, function(error){
							res.json({status:false,status_code:500,message:error.message})
						});

					}, function(error){
						res.json({status:false,status_code:500,message:error.message})
					});

				});
		    }
		});
	}
}

module.exports.delete_card_detail=async function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

		var user_id = decoded.data.id;
		var card_id = req.body.card_id;

		var sql = "SELECT * FROM user_card_details WHERE user_id = ? AND id = ?";
		connection.query(sql,[user_id, card_id],async function (err, result, fields) {
		    if (err) throw err;

		    if(result.length > 0) {

		    	var data = result[0];
		    	var customer_id = decoded.data.stripe_customer_id;

		    	const deleted = await stripe.customers.deleteSource(
				  customer_id,data.card_id
				).then(function(result){
					var sql = "DELETE FROM user_card_details WHERE user_id = ? AND id = ?";
					connection.query(sql,[user_id, card_id],function (err, result, fields) {
					    if (err) throw err;
					    res.json({status:true,status_code:200,message:'Card is deleted successfully!',data:[]})
					});
				}, function(error){
					res.json({status:false,status_code:500,message:error.message})
				});
		    } else {
		    	res.json({status:false,status_code:201,message:'Card not found.'})
		    }
		});
	}
}

module.exports.card_list=function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

		var user_id = decoded.data.id;

		var sql = "SELECT * FROM user_card_details WHERE user_id = ?";
		connection.query(sql,[user_id],function (err, result, fields) {
		    if (err) throw err;

		    if(result.length > 0) {
		    	res.json({status:true,status_code:200,message:'Card List.',data:result})
		    } else {
		    	res.json({status:false,status_code:201,message:'Card not found.'})
		    }
		});
	}
}