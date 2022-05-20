var jwt = require('jsonwebtoken');
var connection = require('./../../config');

module.exports.support_details=function(req,res){

	var name = req.body.name;
	var sql = "SELECT * FROM subscription_data WHERE name = ?";
	connection.query(sql,[name], function (err, result) {
	    if (err) throw err;

	    if(result.length > 0){
	    	var data = result;
	    	res.json({status:true,status_code:200,message:'Detail found',data:data});
	    } else {
	    	res.json({status:true,status_code:201,message:'No Data found'});
	    }
	});
}

module.exports.update_support_details=function(req,res){

	var support_mail    = req.body.support_mail;
	var support_contact = req.body.support_contact;
	var facebook_link   = req.body.facebook_link;
	var instagram_link  = req.body.instagram_link;

	var sql = "UPDATE subscription_data SET amount = ? WHERE name = ?";
	connection.query(sql,[facebook_link,'facebook_link'], function (err, result) {
	    if (err) throw err;
	    console.log('updated')
	});
	var sql = "UPDATE subscription_data SET amount = ? WHERE name = ?";
	connection.query(sql,[instagram_link,'instagram_link'], function (err, result) {
	    if (err) throw err;
	    console.log('updated')
	});
	var sql = "UPDATE subscription_data SET amount = ? WHERE name = ?";
	connection.query(sql,[support_mail,'support_mail'], function (err, result) {
	    if (err) throw err;
	    console.log('updated')
	});
	var sql = "UPDATE subscription_data SET amount = ? WHERE name = ?";
	connection.query(sql,[support_contact,'support_contact'], function (err, result) {
	    if (err) throw err;
	    console.log('updated')
	});

	res.json({status:true,status_code:200,message:'Settings updated successfully',data:[]});
}