var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var connection = require('./../config');
var mail_transporter = require('./../mail_config');
var helper = require('./../helper.js');

module.exports.register=function(req,res){

	var first_name   = req.body.first_name;
	var last_name    = req.body.last_name;
	var name         = req.body.first_name+' '+req.body.last_name;
	var company_name = req.body.company_name;
	var phone        = req.body.phone;
	var email        = req.body.email;
	var password     = bcrypt.hashSync(req.body.password, 10);
	var role         = req.body.role;
	var dob          = req.body.dob;
	var latitude     = req.body.latitude;
	var longitude    = req.body.longitude;

	if(!dob){
		dob = null;
	}

	if(!latitude){
		latitude = null;
	}

	if(!longitude){
		longitude = null;
	}

	console.log(req.body)

	connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
		if (results.length > 0) {
			res.json({
				status:false,
				status_code:201,
				message:'The email you entered is already registered with us!'
			});
		} else {

			if (req.file) {
			    var file_name = req.file.filename;
			} else {
			    var file_name = null;
			}

			var rand_number = Math.floor(1000 + Math.random() * 9000);
			var sql = "INSERT INTO users (first_name, last_name, name, phone, email, password, role, otp, image, company_name, dob, latitude, longitude) VALUES ('"+first_name+"','"+last_name+"','"+name+"','"+phone+"','"+email+"','"+password+"','"+role+"','"+rand_number+"','"+file_name+"','"+company_name+"','"+dob+"','"+latitude+"','"+longitude+"')";
			connection.query(sql, function (err, result) {
			    if (err) throw err;

			    last_inserted_id = result.insertId;

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

				readHTMLFile(__dirname + '/email/confirmation_register.html', function(err, html) {
				    var template = handlebars.compile(html);
				    var replacements = {
				        name: name,
				        otp: rand_number,
				        site_name: "Wait List Hero",
				    };
				    var htmlToSend = template(replacements);
				    var subject = 'Account verification';
				    helper.sendMailData(subject,email, htmlToSend);
				});

				var sql = "SELECT * FROM users WHERE id = ?";
				connection.query(sql,[last_inserted_id], function (err, results) {
			    	if (err) throw err;
			    	if(results.length > 0){
			    		var user_data = results[0];

			    		var token=jwt.sign({data: results[0]},process.env.SECRET_KEY);
						user_data['token'] = token;

					    res.json({
					    	status:true,
					    	status_code:200,
					    	message:'Account is created successfully!',
					    	data:user_data
					    });
			    	} else {
			    		res.json({
					    	status:false,
					    	status_code:201,
					    	message:'Something went wrong!'
					    });
			    	}
			    });
			});
		}
	});
}

module.exports.register_verification=function(req,res){

	var email = req.body.email;
	var otp   = req.body.otp;

	if (!(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/).test(String(email))) {
		res.json({
			status:false,
			status_code:201,
			message:'Email is not valid.'
		})
	}

	if (!otp) {
		res.json({
			status:false,
			status_code:201,
			message:'verification code is required.'
		})
	}

	connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
		if (results.length > 0) {

			if(results[0].otp == otp){

				var otp_update = null;
				var active = 1;

				connection.query('UPDATE users SET otp = ?, status = ? WHERE email = ?',[otp_update,active,email], function (error, result, fields) {

					if (error) {
						res.json({
							status:false,
							status_code:201,
							message:'there are some error with query'
						})
					} else {

						var user_data = results[0];
						var token=jwt.sign({data: results[0]},process.env.SECRET_KEY);
						user_data['token'] = token;

						res.json({
							status:true,
							status_code:200,
							message:'Account Varified successfully.',
							data:user_data
						})
					}
				});
			} else {
				res.json({
					status:false,
					status_code:201,
					message:'Entered verification code is wrong!'
				})
			}
		} else {
		    res.json({
		    	status:false,
		    	status_code:201,
		    	message:'Entered email is not exist!'
		    })
		}
	});
}

module.exports.resend_otp=function(req,res){

	var email = req.body.email;

	if (!(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/).test(String(email))) {
		res.json({
			status:false,
			status_code:201,
			message:'Email is not valid.'
		})
	}

	connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
		if (results.length > 0) {

			var rand_number = Math.floor(1000 + Math.random() * 9000);

			connection.query('UPDATE users SET otp = ? WHERE email = ?',[rand_number,email], function (error, results, fields) {

				if (error) throw error;

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

				readHTMLFile(__dirname + '/email/confirmation_register.html', function(err, html) {
				    var template = handlebars.compile(html);
				    var replacements = {
				        name: email,
				        otp: rand_number,
				        site_name: "Wait List Hero",
				    };
				    var htmlToSend = template(replacements);
				    var subject = 'Account verification code';
				    helper.sendMailData(subject,email, htmlToSend);
				});
				res.json({
					status:true,
					status_code:200,
					message:'OTP has been sent to your email!',
					data:[]
				})
			});
			
		} else {
		    res.json({
		    	status:false,
		    	status_code:201,
		    	message:'Entered email is not exist!'
		    })
		}
	});
}