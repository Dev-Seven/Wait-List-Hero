var jwt = require('jsonwebtoken');
var express = require('express');
var bcrypt = require('bcrypt');
var app     = express();
var connection = require('./../../config');
var helper = require('./../../helper.js');

module.exports.follow=function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

		var client_id  = decoded.data.id;
		var stylist_id = req.body.stylist_id;

		connection.query('SELECT * FROM stylist_follows WHERE stylist_id = ? AND client_id = ?',[stylist_id,client_id], function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {

				if(results.length > 0){
					res.json({status:false,status_code:201,message:'You are already following this stylist.',data:[]});
				} else {
					connection.query('INSERT INTO stylist_follows (stylist_id,client_id) VALUES ("'+stylist_id+'","'+client_id+'") ', function (error, results, fields) {
						if (error) {
							res.json({status:false,status_code:201,message:'there are some error with query'})
						} else {

							connection.query('SELECT * FROM users WHERE id = ?',[client_id], function (error, results, fields) {
								if (error) {
									res.json({status:false,status_code:201,message:'there are some error with query'})
								} else {
									var username = results[0].name;
									
									var sql1 = "SELECT * FROM user_device_tokens WHERE user_id = ?";
		        					connection.query(sql1,[stylist_id],function (error, res1, fields) {
		        						if (error) {
											res.json({status:false,status_code:201,message:error})
										} else {

				        					const message = {
										    	notification : {
										    		title : username+' following you',
										    		body : username+' has started following you..',
										    		click_action: 'FLUTTER_NOTIFICATION_CLICK',
										    	},
										    	data : {
										    		type : "1",
										    		click_action: 'FLUTTER_NOTIFICATION_CLICK',
										    	}
										    }

			        						if(res1.length > 0){
			        							for(let i=0; i < res1.length; i++) {
													let row = res1[i]
												    helper.sendPushNotification(row.device_token,message);
												}
			        						}
			        					}
		        					})
								}
							});

							res.json({status:true,status_code:200,message:'following successfully.',data:[]});
						}
					});
				}
			}
		});
	}
}

module.exports.unfollow=function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

		var client_id  = decoded.data.id;
		var stylist_id = req.body.stylist_id;

		console.log(client_id)
		console.log(stylist_id)

		connection.query('SELECT * FROM stylist_follows WHERE stylist_id = ? AND client_id = ?',[stylist_id,client_id], function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {

				if(results.length == 0){
					res.json({status:false,status_code:201,message:'You are already unfollowed this stylist.',data:[]});
				} else {
					connection.query('DELETE FROM stylist_follows WHERE stylist_id = ? AND client_id = ?',[stylist_id,client_id] , function (error, results, fields) {
						if (error) {
							res.json({status:false,status_code:201,message:'there are some error with query'})
						} else {
							res.json({status:true,status_code:200,message:'Unfollowing successfully.',data:[]});
						}
					});
				}
			}
		});
	}
}

module.exports.follow_list=function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

		var client_id  = decoded.data.id;

		connection.query('SELECT * FROM stylist_follows WHERE client_id = ?',[client_id], function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {

				if(results.length > 0){

					let stylist_arr = [];
					for (var i = 0; i < results.length; i++) 
					{
						stylist_arr[i] = results[i].stylist_id;
					}

					if(stylist_arr.length > 0){
						connection.query('SELECT * FROM users WHERE id IN (?)',[stylist_arr], function (error, results, fields) {
							if (error) {
								res.json({status:false,status_code:201,message:'there are some error with query'})
							} else {
								res.json({status:true,status_code:200,message:'Followed Stylist List', data:results})
							}
						});
					} else {
						res.json({status:false,status_code:201,message:'No followed stylist'})
					}
				} else {
					res.json({status:false,status_code:201,message:'No followed stylist'})
				}
			}
		});
	}
}

module.exports.stylist_list=async function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

		var client_id  = decoded.data.id;
		var role = 4;

		connection.query('SELECT * FROM users WHERE role = ?',[role], async function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {

				for (var i = 0; i < results.length; i++) 
				{
					var stylist_id = results[i].id;
					results[i].follow = await check_following(stylist_id,client_id);
				}
				res.json({status:true,status_code:200,message:'Stylist List', data:results})
			}
		});
	}
}

async function check_following(stylist_id,client_id){
	
	return new Promise(async function(resolve, reject){
		connection.query('SELECT * FROM stylist_follows WHERE stylist_id = ? AND client_id = ?',[stylist_id, client_id],async function (error, res, fields) {
			if(error) { reject(error) }
			if(res.length > 0){	var follow = true;
			} else { var follow = false; }
			resolve(follow)
		});
	});
}