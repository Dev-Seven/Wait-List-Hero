var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var connection = require('./../config');
var mail_transporter = require('./../mail_config');

module.exports.find_by_email=function(req,res){

	var email = req.body.email;
	connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
		if (results.length > 0) {
			res.json({status:true,status_code:200,message:'User Detail.',data:results[0]})
		} else {
			res.json({status:false,status_code:201,message:'User not found.'})
		}
	});
}

module.exports.find_by_id=function(req,res){

	var id = req.body.id;
	connection.query('SELECT * FROM users WHERE id = ?',[id], function (error, results, fields) {
		console.log(results[0])
		if (results.length > 0) {
			res.json({status:true,status_code:200,message:'User Detail.',data:results[0]})
		} else {
			res.json({status:false,status_code:201,message:'User not found.'})
		}
	});
}

module.exports.forgot_password_post=function(req,res){

	var email = req.body.email;
	var password = bcrypt.hashSync(req.body.password, 10);
	
	connection.query('UPDATE users SET password = ? WHERE email = ?',[password,email], function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {

			var sql1 = "DELETE FROM password_resets WHERE email = '"+email+"'";
			connection.query(sql1, function (err, result) {
			    if (err) throw err;
			 	console.log("Number of records deleted");
			});

			res.json({status:true,status_code:200,message:'Password updated successfully.',data:[]});
		}
	});
}

module.exports.check_old_password=function(req,res){

	var user_id=req.body.user_id;
	var password=req.body.password;
	
	connection.query('SELECT * FROM users WHERE id = ?',[user_id], function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			console.log(results[0])
			var hash = results[0].password;
			hash = hash.replace(/^\$2y(.+)$/i, '$2a$1');
			bcrypt.compare(password, hash, function(err, ress) {
				if(!ress){
					res.json({status:false,status_code:201,message:"fail"});
				}else{
					res.json({status:true,status_code:200,message:"Success",data:[]})
				}
			});
		}
	});
}

module.exports.change_password_post=function(req,res){

	var old_password = req.body.old_password;
	var password     = req.body.password;
	var user_id      = req.body.user_id;
	
	connection.query('SELECT * FROM users WHERE id = ?',[user_id], function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'});
		} else {
			if(results.length >0){

				var hash = results[0].password;
				hash = hash.replace(/^\$2y(.+)$/i, '$2a$1');
				bcrypt.compare(old_password, hash, function(err, ress) {
					if(!ress){
						res.json({status:false,status_code:201,message:"Current password does not match with cridentials"});
					}else{
						var new_password = bcrypt.hashSync(req.body.password, 10);
						connection.query('UPDATE users SET password = ? WHERE id = ?',[new_password,user_id], function (error, results, fields) {
							if (error) throw error;
							if (error) {
								res.json({status:false,status_code:201,message:'there are some error with query'});
							} else {
								res.json({status:true,status_code:200,message:"Password changed successfully.",data:[]});
							}
						});
					}
				});
			}
		}
	});
}