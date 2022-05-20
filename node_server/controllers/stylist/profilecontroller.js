var jwt = require('jsonwebtoken');
var express = require('express');
var bcrypt = require('bcrypt');
var app     = express();
var connection = require('./../../config');

module.exports.edit_profile=function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

        var user_id  = decoded.data.id;

        connection.query('SELECT * FROM users  WHERE id = ?',[user_id], function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {

				var user = results[0];
				var user_id = user.id;

				if(req.body.first_name != undefined){
					var first_name = req.body.first_name;
				} else {
					var first_name = user.first_name;
				}

				if(req.body.last_name != undefined){
					var last_name = req.body.last_name;
				} else {
					var last_name = user.last_name;
				}
				var name = first_name+" "+last_name;

				if(req.body.phone_number != undefined){
					var phone_number = req.body.phone_number;
				} else {
					var phone_number = user.phone_number;
				}

				if(req.body.dob != undefined){
					var dob = req.body.dob;
				} else {
					var dob = user.dob;
				}
				
				if(req.body.ssn != undefined){
					var ssn = req.body.ssn;
				} else {
					var ssn = user.ssn;
				}

				if(req.body.url != undefined){
					var url = req.body.url;
				} else {
					var url = user.url;
				}

				console.log(req.file);

				if (req.file != undefined) {
				    var file_name = req.file.filename;
				} else {
				    var file_name = user.image;
				}

				if(req.body.latitude != undefined){
					var latitude = req.body.latitude;
				} else {
					var latitude = user.latitude;
				}

				if(req.body.longitude != undefined){
					var longitude = req.body.longitude;
				} else {
					var longitude = user.longitude;
				}

				console.log(file_name)

				connection.query('UPDATE users SET first_name = ?, last_name = ?, phone = ?, name = ?, image = ?, ssn = ?, url = ?, dob = ?, latitude = ?, longitude = ? WHERE id = ?',[first_name,last_name,phone_number,name,file_name,ssn,url,dob,latitude,longitude,user_id], function (error, results, fields) {
					if (error) {
						res.json({status:false,status_code:201,message:'there are some error with query'})
					} else {
						res.json({status:true,status_code:200,message:'Personal information is updated successfully!',data:[]});
					}
				});
			}
		});
	}
}

module.exports.edit_company_detail=function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

		var user_id  = decoded.data.id;

		connection.query('SELECT * FROM users WHERE id = ?',[user_id], function (error, user_data, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {

				var user_detail = user_data[0];

				var company_name = req.body.company_name;
				var address = req.body.address;
				var city = req.body.city;
				var state = req.body.state;
				var zipcode = req.body.zipcode;
				var about = req.body.about;

				if(req.body.url != undefined){
					var url = req.body.url;
				} else {
					var url = user_detail.url;
				}

				if(req.body.latitude != undefined){
					var latitude = req.body.latitude;
				} else {
					var latitude = user_detail.latitude;
				}			

				if(req.body.longitude != undefined){
					var longitude = req.body.longitude;
				} else {
					var longitude = user_detail.longitude;
				}

				connection.query('UPDATE users SET company_name = ?, address = ?, city = ?, state = ?, zip_code = ?, about = ?, url = ?, latitude = ?, longitude = ? WHERE id = ?',[company_name,address,city,state,zipcode,about,url,latitude,longitude,user_id], function (error, results, fields) {
					if (error) {
						res.json({status:false,status_code:201,message:'there are some error with query'})
					} else {
						res.json({status:true,status_code:200,message:'Company information is updated successfully!',data:[]});
					}
				});
			}
		});
	}
}