var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var crypto = require("crypto");
var connection = require('./../config');
var mail_transporter = require('./../mail_config');
var helper = require('./../helper.js');

module.exports.forgot_pwd=function(req,res){

	var email=req.body.email;

	console.log(email);

	if (!(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/).test(String(email))) {
		res.json({
			status:false,
			status_code:201,
			message:'Email is not valid.'
		})
	}
	
	connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
		if (error) {
			res.json({
				status:false,
				status_code:201,
				message:'there are some error with query'
			})
		} else {
			if(results.length >0){

				var sql1 = "DELETE FROM password_resets WHERE email = '"+email+"'";
				connection.query(sql1, function (err, result) {
				    if (err) throw err;
				 	console.log("Number of records deleted");
				});

				var token = Math.floor(1000 + Math.random() * 9000);

				var sql = "INSERT INTO password_resets (email, token) VALUES ('"+email+"','"+token+"')";
				connection.query(sql, function (err, result) {

					var readHTMLFile = function(path, callback) {
					    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
					        if (err) {
					            throw err;
					            callback(err);
					        }
					        else {
					            callback(null, html);
					        }
					    });
					};

					readHTMLFile(__dirname + '/email/reset_password_code.html', function(err, html) {
					    var template = handlebars.compile(html);
					    var replacements = {
					        email: email,
					        otp: token,
					        site_name: "Wait List Hero",
					    };
					    var htmlToSend = template(replacements);

					    var subject = 'Reset Password Code';
				    	helper.sendMailData(subject,email, htmlToSend);
					});
					res.json({
						status:true,
						status_code:200,
						message:'OTP has been sent to your email!',
						data:[]
					});
				});

			} else {
				res.json({
					status:false,
					status_code:201,
					message:"Email does not exists"
				});
			}
		}
	});
}

module.exports.check_token=function(req,res){

	var token=req.body.token;

	if (!token) {
		res.json({
			status:false,
			status_code:201,
			message:'Token is required.'
		})
	}
	
	connection.query('SELECT * FROM password_resets WHERE token = ?',[token], function (error, results, fields) {
		if (error) {
			res.json({
				status:false,
				status_code:201,
				message:'there are some error with query'
			})
		} else {
			if(results.length > 0){
				res.json({
					status:true,
					status_code:200,
					message:'Valid token',
					data:results
				});
			} else {
				res.json({
					status:false,
					status_code:201,
					message:"Invalid token"
				});
			}
		}
	});
}

module.exports.forgot_pwd_post=function(req,res){

	var email = req.body.email;
	var password = bcrypt.hashSync(req.body.password, 10);

	if (!(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/).test(String(email))) {
		res.json({
			status:false,
			status_code:201,
			message:'Email is not valid.'
		})
	}

	if (!req.body.password) {
		res.json({
			status:false,
			status_code:201,
			message:'Password is required.'
		})
	}
	
	connection.query('UPDATE users SET password = ? WHERE email = ?',[password,email], function (error, results, fields) {
		if (error) {
			res.json({
				status:false,
				status_code:201,
				message:'there are some error with query'
			})
		} else {

			var sql1 = "DELETE FROM password_resets WHERE email = '"+email+"'";
			connection.query(sql1, function (err, result) {
			    if (err) throw err;
			 	console.log("Number of records deleted");
			});
			res.json({
				status:true,
				status_code:200,
				message:'Your password has been reset successfully!',
				data:[]
			});
		}
	});
}

module.exports.check_password_otp=function(req,res){

	var otp=req.body.otp;
	var email=req.body.email;

	if (!otp || !email) {

		if(!otp){
			res.json({status:false,status_code:201,message:'OTP is required.'})
		} else {
			res.json({status:false,status_code:201,message:'Email is required.'})
		}

	} else {
		connection.query('SELECT * FROM password_resets WHERE token = ? AND email = ?',[otp,email], function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {
				if(results.length > 0){
					res.json({status:true,status_code:200,message:'Valid OTP',data:[]});
				} else {
					res.json({status:false,status_code:201,message:"Invalid OTP"});
				}
			}
		});
	}
}
