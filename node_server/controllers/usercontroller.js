var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var connection = require('./../config');
var mail_transporter = require('./../mail_config');

module.exports.getByToken=function(req,res){

	if (req.headers && req.headers.usertoken) {
		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({
        		status_code:401,
        		status:false,
        		token:token,
        		message:'unauthorized'
        	})
        }
        // decoded.data.token = token;

        var user_id = decoded.data.id;

        connection.query('SELECT * FROM users WHERE id = ?',[user_id], function (error, results, fields) {
			console.log(results[0])
			if (results.length > 0) {
				results[0].token = token;
				res.json({status:true,status_code:200,message:'User Detail.',data:results[0] })
			} else {
				res.json({status:false,status_code:201,message:'User not found.'})
			}
		});
	}
}

module.exports.getByUserId=function(req,res){

	var user_id = req.body.user_id;
	connection.query('SELECT * FROM users WHERE id = ?',[user_id], function (error, results, fields) {
		console.log(results[0])
		if (results.length > 0) {
			res.json({
				status:true,
				status_code:200,
				message:'User Detail.',
				data:results[0]
			})
		} else {
			res.json({
				status:false,
				status_code:201,
				message:'User not found.'
			})
		}
	});
}

module.exports.change_password=function(req,res){

	var old_password = req.body.old_password;
	var new_password = req.body.new_password;

	if (req.headers && req.headers.usertoken) {
		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({
        		status_code:401,
        		status:false,
        		token:token,
        		message:'unauthorized'
        	})
        }

        var hash = decoded.data.password;
		hash = hash.replace(/^\$2y(.+)$/i, '$2a$1');
		bcrypt.compare(old_password, hash, function(err, ress) {
			if(!ress){
				res.json({
					status:false,
					status_code:201,
					message:"Old password does not match"
				});
			}else{

				new_password = bcrypt.hashSync(new_password, 10);
				connection.query('UPDATE users SET password = ? WHERE id = ?',[new_password,decoded.data.id], function (error, results, fields) {

					if (error) {
						res.json({
							status:false,
							status_code:201,
							message:'there are some error with query'
						})
					} else {
						res.json({
							status:true,
							status_code:200,
							message:'Password is updated successfully!',
							data:[]
						})
					}
				});
			}
		});
	}
}