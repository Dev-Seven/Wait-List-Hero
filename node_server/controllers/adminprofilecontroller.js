var jwt = require('jsonwebtoken');
var express = require('express');
var app     = express();
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var connection = require('./../config');
var mail_transporter = require('./../mail_config');
const multer = require('multer');
const path = require('path');

module.exports.profile_update=function(req,res){

	var first_name = req.body.first_name;
	var user_id = req.body.user_id;
	var last_name = req.body.last_name;
	var company_name = req.body.company_name;
	var phone_number = req.body.phone_number;
	var name = first_name+" "+last_name;

	if (req.body.image) {
	    var file_name = req.body.image.filename;
	} else {
	    var file_name = null;
	}

	connection.query('UPDATE users SET first_name = ?, last_name = ?, company_name = ?, phone = ?, name = ?, image = ? WHERE id = ?',[first_name,last_name,company_name,phone_number,name,file_name,user_id], function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'Personal information is updated successfully!',data:[]});
		}
	});
}