var express = require('express');
var bcrypt = require('bcrypt');
var app     = express();
var connection = require('./../../config');

module.exports.get=function(req,res){

	connection.query('SELECT * FROM users WHERE role IN (1,2) ORDER BY id DESC',function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'Admin listing',data:results});
		}
	});
}

module.exports.view=function(req,res){

	var id = req.body.id;
	connection.query('SELECT * FROM users WHERE id = ?',[id],function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'Admin Detail',data:results});
		}
	});
}

module.exports.delete=function(req,res){

	var id = req.body.id;
	connection.query('DELETE FROM users WHERE id = ? AND role = 2',[id],function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'Admin deleted successfully',data:[]});
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
	var role         = 2;

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
					res.json({status:true,status_code:200,message:'Admin added successfully',data:[]});
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

	var sql = 'UPDATE users SET first_name = ?, last_name = ?, name = ?, phone = ?, status = ? WHERE id = ?';
	connection.query(sql,[first_name, last_name, name, phone, status, id],function (error, results, fields) {
		if (error) {
			console.log(error)
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'Admin updated successfully',data:[]});
		}
	});
}