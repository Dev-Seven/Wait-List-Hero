var nodemailer = require('nodemailer');
var fs = require('fs');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');

// var mail_transporter = nodemailer.createTransport({
// 	service: 'gmail',
// 	auth: {
// 		user: 'sevensquare.testing@gmail.com',
// 		pass: 'Seven@test123'
// 	},
// 	from:'"Wait List Hero" sevensquare.testing@gmail.com'
// });


var mail_transporter = nodemailer.createTransport({
	service: 'SendGrid',
	auth: {
		user: 'apikey',
		pass: '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'
	},
	from:'"Wait List Hero" chirag.c@upsquare.in'
});

module.exports = mail_transporter;