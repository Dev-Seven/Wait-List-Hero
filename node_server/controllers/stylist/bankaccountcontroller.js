var jwt = require('jsonwebtoken');
var express = require('express');
var bcrypt = require('bcrypt');
var app     = express();
var multer = require('multer');
const DIR = './../../../public/img/user';
var connection = require('./../../config');
var helper = require('./../../helper.js');

module.exports.addBankAccount=function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

        console.log(req.body);
        //return;

		var user_id  = decoded.data.id;

		var routing_number = req.body.routing_number;
		var account_number = req.body.account_number;
		var account_holder_name = req.body.account_holder_name;
		var account_holder_type = req.body.account_holder_type;
		var dob = req.body.dob;
		var ssn = req.body.ssn;

		helper.createBankAccount(req,user_id,routing_number,account_number,account_holder_name,account_holder_type,dob,ssn,res);
	}
}

module.exports.verifyBankAccount=function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

		var user_id  = decoded.data.id;
		helper.verifyBankAccount(user_id,res);
	}
}

module.exports.subscriptionAmountDetail=function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

		var user_id  = decoded.data.id;
		var name = 'subscription_amount';
		connection.query('SELECT * FROM subscription_data WHERE name = ?',[name], function (error, results, fields) {
			if (error) {
				res.json({
					status:false,
					status_code:201,
					message:'there are some error with query'
				})
			} else {
				if(results.length > 0){
					var result_data = results[0];
					res.json({status:true,status_code:200,message:'Subscription Detail.',data:result_data})
				} else {
					res.json({
						status:false,
						status_code:201,
						message:'there are some error with query'
					})
				}
			}
		});
	}
}

module.exports.subscribeStylist=function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

		var user_id  = decoded.data.id;
		var stripe_token = req.body.stripe_token;
		console.log('start');
		helper.subscriptionCharge(user_id, stripe_token, res);
	}
}

module.exports.unsubscribe_user=async function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }
		
		var user_id  = decoded.data.id;

		connection.query('SELECT * FROM users WHERE id = ?',[user_id],async function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {
				helper.unsubscribe_user(results[0],res);
			}
		});
    }
}

module.exports.upload_document=async function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }
		
		var user_id  = decoded.data.id;

		var first_img = req.files[0];
		var second_img = req.files[1];

		connection.query('SELECT * FROM users WHERE id = ?',[user_id], function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {
				if(results.length > 0){
					var account_number = results[0].stripe_bank_account_id;
					helper.uploadDocumentStripe(account_number,first_img,second_img,res);
				} else {
					res.json({status:false,status_code:201,message:'No user detail found'})
				}
			}
		});	
    }
}