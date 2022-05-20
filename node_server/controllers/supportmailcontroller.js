var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var connection = require('./../config');
var mail_transporter = require('./../mail_config');
var helper = require('./../helper.js');

module.exports.send_support_mail=function(req,res){

	var email = req.body.email;

	var sql = "INSERT INTO support_mails (email) VALUES ('"+email+"')";
	connection.query(sql, function (err, result) {
	    if (err) throw err;

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

		readHTMLFile(__dirname + '/email/support_mail.html', function(err, html) {
		    var template = handlebars.compile(html);
		    var replacements = {
		        email: email,
		        site_name: "Wait List Hero",
		    };
		    var htmlToSend = template(replacements);

		    var subject = 'Support Mail';
			helper.sendMailData(subject,email, htmlToSend);
		});
	    res.json({
	    	status:true,
	    	status_code:200,
	    	message:'Mail sent',
	    	data:[]
	    });
	});
}