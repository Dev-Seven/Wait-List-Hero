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

module.exports.login=function(req,res){

	var email=req.body.email;
	var password=req.body.password;
	var device_token=req.body.device_token;
	var device_type=req.body.device_type;
	// var role=req.body.role;
	//console.log(req.body)
	
	connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,
				message:'there are some error with query'
			})
		} else {
			//console.log(results[0]);
			if(results.length >0){

				if(results[0].status == 0){
					res.json({status:true,status_code:200,
						message:"Success",data:results[0]
					})
				} else {
					var hash = results[0].password;
					hash = hash.replace(/^\$2y(.+)$/i, '$2a$1');
					bcrypt.compare(password, hash, function(err, ress) {
						//console.log(ress);
						if(!ress){
							res.json({status:false,status_code:201,
								message:"Email and password does not match"
							});
						}else{	
							var token=jwt.sign({data: results[0]},process.env.SECRET_KEY);
							results[0]['token'] = token;
							res.json({status:true,status_code:200,
								message:"Success",data:results[0]
							})
						}
					});
				}
			} else {
				res.json({status:false,status_code:201,
					message:"Email does not exits"
				});
			}
		}
	});
}
module.exports.auto_login=function(req,res){

	var user_id=req.body.user_id;
	
	connection.query('SELECT * FROM users WHERE id = ?',[user_id], function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,
				message:'there are some error with query'
			})
		} else {
			//console.log(results[0]);
			if(results.length >0){

				if(results[0].status == 0){
					res.json({status:true,status_code:200,
						message:"Success",data:results[0]
					})
				} else {
					var token=jwt.sign({data: results[0]},process.env.SECRET_KEY);
					results[0]['token'] = token;
					res.json({status:true,status_code:200,
						message:"Success",data:results[0]
					})
				}
			} else {
				res.json({status:false,status_code:201,
					message:"Email does not exits"
				});
			}
		}
	});
}

module.exports.social_login=function(req,res){

	var google_id = req.body.google_id;
	var name      = req.body.name;
	var email     = req.body.email;
	var role      = req.body.role;
	var is_login  = req.body.is_login;
	var status    = 1;

	if(is_login == 1){

		connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {
				if(results.length > 0){
					console.log(results[0].google_id)
					if(results[0].google_id == null || results[0].google_id == ''){
						res.json({status:false,status_code:201,message:'This email already registered in app'})
					} else {
						if(results[0].status == 0){
							res.json({status:false,status_code:201,
								message:"Your account is deactivated"
							});
						} else {
							var token=jwt.sign({data: results[0]},process.env.SECRET_KEY);
							results[0]['token'] = token;
							res.json({status:true,status_code:200,
								message:"Success",data:results[0]
							})
						}
					}
				} else {
					res.json({status:false,status_code:201,
						message:"User not registered"
					});
				}
			}
		});
	} else {

		connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {
				if(results.length > 0){
					res.json({status:false,status_code:201,
						message:"User already registered"
					});	
				} else {
					connection.query('SELECT * FROM users WHERE google_id = ?',[google_id], function (error, results, fields) {
						if (error) {
							res.json({status:false,status_code:201,message:'there are some error with query'})
						} else {
							if(results.length >0){

								if(results[0].status == 0){
									res.json({status:false,status_code:201,
										message:"Your account is deactivated"
									});
								} else {
									res.json({status:false,status_code:201,
										message:"User already registered"
									});
								}
							} else {
								
								var sql = "INSERT INTO users (first_name, name, email, role, google_id, status) VALUES ('"+name+"','"+name+"','"+email+"','"+role+"','"+google_id+"','"+status+"')";
								connection.query(sql, function (err, result) {
							    	if (err) throw err;

							    	var last_id = result.insertId;
							    	connection.query('SELECT * FROM users WHERE id = ?',[last_id], function (error, results, fields) {
										if (error) {
											res.json({status:false,status_code:201,
												message:'there are some error with query'
											})
										} else {
											
											var token=jwt.sign({data: results[0]},process.env.SECRET_KEY);
											results[0]['token'] = token;
											res.json({status:true,status_code:200,
												message:"Success",data:results[0]
											})
										}
									});
							    });
							}
						}
					});
				}
			}
		});
	}
}

module.exports.login_admin=function(req,res){

	console.log('123');
	var email=req.body.email;
	var password=req.body.password;

	if (!(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/).test(String(email))) {
		res.json({
			status:false,
			status_code:201,
			message:'Email is not valid.'
		})
	}
	if (!password) {
		res.json({
			status:false,
			status_code:201,
			message:'Password is required.'
		})
	}	

	console.log(req.body)

	connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
		if (error) {
			res.json({
				status:false,
				status_code:201,
				message:error
			})
		} else {
			if(results.length >0){
				
				//console.log(results[0]);
				let role_array = [3,4];

				if(results[0].status == 0){
					res.json({
						status:false,
						status_code:201,
						message:"Your account is deactivated"
					});
				} else if(role_array.indexOf(results[0].role) !== -1){
					res.json({
						status:false,
						status_code:201,
						message:"Please enter valid cridentials"
					});
				} else {
					let hash = results[0].password;
					hash = hash.replace(/^\$2y(.+)$/i, '$2a$1');
					bcrypt.compare(password, hash, function(err, ress) {
						//console.log(ress);
						if(!ress){
							res.json({
								status:false,
								status_code:201,
								message:"Email and password does not match"
							});
						}else{
							//console.log('login' , results[0])
							res.json({
								status:true,
								status_code:200,
								message:"success",data:results[0]
							})
						}
					});
				}
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
module.exports.forgot_password=function(req,res){

	var email=req.body.email;

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
			console.log(results[0]);
			if(results.length >0){

				var sql1 = "DELETE FROM password_resets WHERE email = '"+email+"'";
				connection.query(sql1, function (err, result) {
				    if (err) throw err;
				 	console.log("Number of records deleted");
				});

				var token = crypto.randomBytes(20).toString('hex');

				var site_url = req.headers.host;

				var link = base_url+'/password/reset/'+token;
				var site_url = base_url;

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

					readHTMLFile(__dirname + '/email/forgot_password.html', function(err, html) {
					    var template = handlebars.compile(html);
					    var replacements = {
					        email: email,
					        link: link,
					        site_url: site_url,
					        site_name: "Wait List Hero",
					    };
					    var htmlToSend = template(replacements);

					    var subject = 'Reset Password Request';
				    	helper.sendMailData(subject,email, htmlToSend);
					});
					res.json({
						status:true,
						status_code:200,
						message:'Mail sent successfully.',
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

module.exports.check_forgot_password_token=function(req,res){

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

module.exports.forgot_password_post=function(req,res){

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
				message:'Password updated successfully.',
				data:[]
			});
		}
	});
}

module.exports.add_device_token=function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

        var device_token=req.body.device_token;
		var device_type=req.body.device_type;
		var user_id = decoded.data.id;

		var sql_check = "SELECT * FROM user_device_tokens WHERE user_id = ? AND device_token =?";
		connection.query(sql_check,[user_id, device_token], function (err, results) {
			console.log(err)
			if(results.length == 0){	
				var sql = "INSERT INTO user_device_tokens (user_id, device_token, device_type) VALUES ('"+user_id+"','"+device_token+"','"+device_type+"')";
				connection.query(sql, function (err, result) {
					res.json({status:true,status_code:200,message:'Token added successfully.',data:[]})
				});
			}
		});
    }
}

module.exports.logout=function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

		var user_id = decoded.data.id;
		var sql_check = "DELETE FROM user_device_tokens WHERE user_id = ?";
		connection.query(sql_check,[user_id],function (err, result) {
			res.json({status:true,status_code:200,message:'Logout successfully.',data:[]})
		});
    }
}