var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var connection = require('./../config');
var mail_transporter = require('./../mail_config');

module.exports.getBySlug=function(req,res){

	function buildConditions(params) {
		var conditions = [];
		var values = [];
		var conditionsStr;

		if (typeof params.slug !== 'undefined') {
			conditions.push("slug LIKE ?");
			values.push("%" + params.slug + "%");
		}

		return {
			where: conditions.length ? conditions.join(' AND ') : '1',values: values
		};
	}
	
	var conditions = buildConditions(req.body);
	var sql = 'SELECT * FROM cms_pages WHERE ' + conditions.where;

	connection.query(sql,conditions.values, function (error, results, fields) {
		if (results.length > 0) {
			res.json({status:true,status_code:200,message:'Page Detail.',data:results[0]})
		} else {
			res.json({status:false,status_code:201,message:'Page not found.'})
		}
	});
}

module.exports.cms_page=function(req,res){

	function buildConditions(params) {
		var conditions = [];
		var values = [];
		var conditionsStr;

		if (typeof params.slug !== 'undefined') {
			conditions.push("slug LIKE ?");
			values.push("%" + params.slug + "%");
		}

		return {
			where: conditions.length ? conditions.join(' AND ') : '1',values: values
		};
	}
	
	var conditions = buildConditions(req.body);
	var sql = 'SELECT * FROM cms_pages WHERE ' + conditions.where;

	connection.query(sql,conditions.values, function (error, results, fields) {
		if (results.length > 0) {
			res.json({status:true,status_code:200,message:'Page Detail.',data:results[0]})
		} else {
			res.json({status:false,status_code:201,message:'Page not found.'})
		}
	});
}
