var express = require('express');
var bcrypt = require('bcrypt');
var app     = express();
var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var connection = require('./../../config');
var helper = require('./../../helper.js');
var mail_transporter = require('./../../mail_config');

module.exports.get=function(req,res){

	connection.query('SELECT * FROM users WHERE role = 3 ORDER BY id DESC',function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'Client listing',data:results});
		}
	});
}

module.exports.view=function(req,res){

	var id = req.body.id;
	connection.query('SELECT * FROM users WHERE id = ? AND role = 3',[id],function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'Client Detail',data:results});
		}
	});
}

module.exports.delete=function(req,res){

	var id = req.body.id;
	connection.query('DELETE FROM users WHERE id = ? AND role = 3',[id],function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'Client deleted successfully',data:[]});
		}
	});
}

module.exports.create=function(req,res){

	var first_name   = req.body.first_name;
	var last_name    = req.body.last_name;
	var name         = req.body.first_name+' '+req.body.last_name;
	var phone        = req.body.phone;
	var email        = req.body.email;
	var status       = req.body.status;
	var password     = bcrypt.hashSync(req.body.password, 10);
	var role         = 3;

	connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
		if (results.length > 0) {
			res.json({
				status:false,
				status_code:201,
				message:'This email already exists, try another email.'
			});
		} else {
			var sql = "INSERT INTO users (first_name, last_name, name, phone, email, password, role, status) VALUES ('"+first_name+"','"+last_name+"','"+name+"','"+phone+"','"+email+"','"+password+"','"+role+"','"+status+"')";
			connection.query(sql,function (error, results, fields) {
				if (error) {
					res.json({status:false,status_code:201,message:error})
				} else {

					var last_inserted_id = results.insertId;
					var customer_data = helper.createStripeCustomer(first_name, last_name, email, phone, last_inserted_id, res)

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

					readHTMLFile(__dirname + '/../email/account_register.html', function(err, html) {
					    var template = handlebars.compile(html);
					    var replacements = {
					        name: name,
					        site_name: "Wait List Hero",
					    };
					    var htmlToSend = template(replacements);

					    var subject = 'Account Registration';
				    	helper.sendMailData(subject,email, htmlToSend);
					});
					res.json({status:true,status_code:200,message:'Client added successfully',data:[]});
				}
			});
		}
	});
}

module.exports.update=function(req,res){

	var first_name   = req.body.first_name;
	var last_name    = req.body.last_name;
	var name         = req.body.first_name+' '+req.body.last_name;
	var phone        = req.body.phone;
	var status       = req.body.status;
	var id           = req.body.id;

	var sql = 'UPDATE users SET first_name = ?, last_name = ?, name = ?, phone = ?, status = ? WHERE id = ? AND role = 3';
	connection.query(sql,[first_name, last_name, name, phone, status, id],function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'Client updated successfully',data:[]});
		}
	});
}