var jwt = require('jsonwebtoken');
var express = require('express');
var bcrypt = require('bcrypt');
var app     = express();
var connection = require('./../../config');
var helper = require('./../../helper.js');

module.exports.add_appointment=function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

		var stylist_id  = decoded.data.id;
		var date = req.body.date;
		var start_time = req.body.start_time;
		var end_time = req.body.end_time;
		
		var ap_date_time = req.body.date+" "+req.body.start_time;

		var sql = 'INSERT INTO appointments (stylist_id,date,start_time,end_time,start_date_time) VALUES ("'+stylist_id+'","'+date+'","'+start_time+'","'+end_time+'","'+ap_date_time+'")';
		connection.query(sql, function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:error})
			} else {

				var appointment_id = results.insertId;
				if(req.body.data != undefined && req.body.data != ''){

					var data = JSON.parse(req.body.data);
					for (var i = 0; i < data.length; i++) 
					{
						var service = data[i].service;
						var price = data[i].price;

						var sql = 'INSERT INTO appointment_services (appointment_id,user_id,service,price) VALUES ("'+appointment_id+'","'+stylist_id+'","'+service+'","'+price+'")';
						connection.query(sql, function (error, results, fields) {
							if (error) {
								res.json({status:false,status_code:201,message:error})
							} else {
								console.log('Service added successfully');
							}
						});

						var sql = 'SELECT * FROM stylist_follows WHERE stylist_id = ?';
						connection.query(sql,[stylist_id], function (error, results, fields) {
							if (error) {
								res.json({status:false,status_code:201,message:error})
							} else {
								var client_arr = [];
								for (var i = 0; i < results.length; i++){
									client_arr[i] = results[i].client_id;
								}

								if(client_arr.length > 0){

									var sql = "SELECT * FROM users WHERE id = ?";
									connection.query(sql,[stylist_id],function (err, result, fields) {

										if(result.length > 0){


											appointment_id = appointment_id.toString();

				        					var username = result[0].company_name;
				        					const message_notification = {
										    	notification : {
										    		title : 'New appointment published',
										    		body : 'There is a new appointment from '+username+'. Tap to book now!',
										    		click_action: 'FLUTTER_NOTIFICATION_CLICK',
										    	},
										    	data : {
										    		type : "2",
										    		appointment_id : appointment_id,
										    		click_action: 'FLUTTER_NOTIFICATION_CLICK',
										    	}
										    }
										    var sql1 = "SELECT * FROM user_device_tokens WHERE user_id IN (?)";
				        					connection.query(sql1,[client_arr],function (error, res1, fields) {
				        						if (error) {
													res.json({status:false,status_code:201,message:error})
												} else {
					        						if(res1.length > 0){
					        							for(let i=0; i < res1.length; i++) {
															let row = res1[i]
														    helper.sendPushNotification(row.device_token,message_notification);
														}
					        						}
					        					}
				        					})
										}
									});
								}
							}
						});
					}
				}
				res.json({status:true,status_code:200,message:'New Appointment Added successfully.',data:[]});
			}
		});
	}
}

module.exports.delete_appointment=function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

		var appointment_id = req.body.appointment_id;

		var sql = 'DELETE FROM appointments WHERE id = ?';
		connection.query(sql,[appointment_id],function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'Something went wrong!'})
			} else {

				var sql = 'DELETE FROM appointment_services WHERE appointment_id = ?';
				connection.query(sql,[appointment_id], function (error, results, fields) {
					if (error) {
						res.json({status:false,status_code:201,message:'Something went wrong!'})
					} else {
						console.log('Service Deleted successfully');
					}
				});
				res.json({status:true,status_code:200,message:'Appointment Deleted successfully.',data:[]});
			}
		});
	}
}

module.exports.find_by_id=async function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

		var appointment_id = req.body.appointment_id;

		var sql = 'SELECT * FROM appointments WHERE id = ?';
		connection.query(sql,[appointment_id],async function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'Something went wrong!'})
			} else {

				for (var i = 0; i < results.length; i++) {
					results[i]['services'] = await get_services(results[i].id);
					results[i]['stylist'] = await get_stylist(results[i].stylist_id);
					results[i]['clients'] = await get_clients(results[i].id);
				}
				res.json({status:true,status_code:200,message:'Appointment Detail.',data:results});
			}
		});
	}
}

module.exports.complete_appointment=async function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

		var appointment_id = req.body.appointment_id;
		var client_id = req.body.client_id;
		var stylist_id = decoded.data.id;

		var review = '';
		if(req.body.review != undefined && req.body.review != ''){
			var review = req.body.review;
		}

		var sql = 'SELECT * FROM appointments WHERE id = ?';
		connection.query(sql,[appointment_id],async function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'Something went wrong!'})
			} else {

				var sql = 'UPDATE appointments SET is_completed = 1 WHERE id = ?';
				connection.query(sql,[appointment_id],function (error, results, fields) {	
					if (error) {
						res.json({status:false,status_code:201,message:'Something went wrong!'})
					} else {
						console.log('appointment updated successfully');
					}	
				});

				var sql = 'INSERT INTO appointment_completed (appointment_id,client_id,stylist_id,review) VALUES("'+appointment_id+'","'+client_id+'","'+stylist_id+'","'+review+'")';
				connection.query(sql,function (error, results, fields) {	
					if (error) {
						res.json({status:false,status_code:201,message:'Something went wrong!'})
					} else {
						res.json({status:true,status_code:200,message:'Appointment Completed successfully.',data:[]});
					}	
				});
			}
		});
	}
}

module.exports.update_appointment=function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

		var stylist_id  = decoded.data.id;
		var date = req.body.date;
		var start_time = req.body.start_time;
		var end_time = req.body.end_time;
		var appointment_id = req.body.appointment_id;
		var ap_date_time = req.body.date+" "+req.body.start_time;

		var sql = 'UPDATE appointments SET date = ?, start_time = ?, end_time = ?, start_date_time = ? WHERE id = ?';
		connection.query(sql, [date,start_time,end_time,start_date_time,appointment_id],function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:error})
			} else {

				if(req.body.data != undefined && req.body.data != ''){

					var data = JSON.parse(req.body.data);
					var sql = 'DELETE FROM appointment_services WHERE appointment_id = ?';
					connection.query(sql,[appointment_id], function (error, results, fields) {
						if (error) {
							res.json({status:false,status_code:201,message:error})
						} else {
							console.log('Old service deleted successfully');
						}
					});
					for (var i = 0; i < data.length; i++) 
					{
						var service = data[i].service;
						var price = data[i].price;

						var sql = 'INSERT INTO appointment_services (appointment_id,user_id,service,price) VALUES ("'+appointment_id+'","'+stylist_id+'","'+service+'","'+price+'")';
						connection.query(sql, function (error, results, fields) {
							if (error) {
								res.json({status:false,status_code:201,message:error})
							} else {
								console.log('Service added successfully');
							}
						});
					}
				}
				res.json({status:true,status_code:200,message:'Appointment Updated successfully.',data:[]});
			}
		});
	}
}

module.exports.appointment_list=async function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

        var user_id = decoded.data.id;

        if(req.body.search != undefined || req.body.search != ''){
        	var search = req.body.search;
        } else {
        	var search = 1;
        }

        connection.query('SELECT * FROM appointment_received WHERE stylist_id = ?',[user_id],async function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {

				let appointment_arr = [];
				for (var i = 0; i < results.length; i++) {
					appointment_arr[i] = results[i].appointment_id;
				}

				if(search == 1){
					var sql = 'SELECT * FROM appointments WHERE stylist_id = ? AND is_completed = 0 AND is_expired = 0 ORDER BY id DESC';
					connection.query(sql,[user_id],async function (error, results, fields) {
						if (error) {
							res.json({status:false,status_code:201,message:error})
						} else {

							if(results.length > 0){
								for (var i = 0; i < results.length; i++) {

									var booked_at = await get_received_client(results[i].id);
									results[i]['booked'] = await get_received_client(results[i].id);
									if(booked_at == "true"){
										results[i]['services'] = await get_booked_services(results[i].id);
									} else {
										results[i]['services'] = await get_services(results[i].id);
									}
									results[i]['stylist'] = await get_stylist(results[i].stylist_id);
								}
								res.json({status:true,status_code:200,message:'Appointment listing',data:results});
							} else {
								res.json({status:false,status_code:201,message:'No Appointment found'});
							}
						}
					});
				} else if(search == 2){

					var sql_param = [];
	        		sql_param.push(user_id);
					sql_param.push(appointment_arr);

					var sql = 'SELECT * FROM appointments WHERE stylist_id = ? AND is_completed = 0 AND is_expired = 0 AND id IN (?) ORDER BY id DESC';
					if(appointment_arr.length > 0){
						connection.query(sql,sql_param,async function (error, results, fields) {
							if (error) {
								res.json({status:false,status_code:201,message:error})
							} else {

								if(results.length > 0){
									for (var i = 0; i < results.length; i++) {
										results[i]['booked'] = await get_received_client(results[i].id);
										results[i]['services'] = await get_booked_services(results[i].id);
										results[i]['stylist'] = await get_stylist(results[i].stylist_id);
									}
									res.json({status:true,status_code:200,message:'Appointment listing',data:results});
								} else {
									res.json({status:false,status_code:201,message:'No Appointment found'});
								}
							}
						});
					} else {
						res.json({status:false,status_code:201,message:'No Appointment found'});
					}
				} else {

					if(appointment_arr.length > 0){

						var sql_param = [];
		        		sql_param.push(user_id);
						sql_param.push(appointment_arr);

						var sql = 'SELECT * FROM appointments WHERE stylist_id = ? AND is_completed = 0 AND is_expired = 0 AND id NOT IN (?) ORDER BY id DESC';
						connection.query(sql,sql_param,async function (error, results, fields) {
							if (error) {
								res.json({status:false,status_code:201,message:'there are some error with query'})
							} else {

								if(results.length > 0){
									for (var i = 0; i < results.length; i++) {
										results[i]['booked'] = await get_received_client(results[i].id);
										results[i]['services'] = await get_services(results[i].id);
										results[i]['stylist'] = await get_stylist(results[i].stylist_id);
									}
									res.json({status:true,status_code:200,message:'Appointment listing',data:results});
								} else {
									res.json({status:false,status_code:201,message:'No Appointment found'});
								}
							}
						});
					} else {
						var sql = 'SELECT * FROM appointments WHERE stylist_id = ? AND is_completed = 0 AND is_expired = 0 ORDER BY id DESC'
						connection.query(sql,[user_id],async function (error, results, fields) {
							if (error) {
								res.json({status:false,status_code:201,message:'there are some error with query'})
							} else {

								if(results.length > 0){
									for (var i = 0; i < results.length; i++) {
										results[i]['booked'] = await get_received_client(results[i].id);
										results[i]['services'] = await get_services(results[i].id);
										results[i]['stylist'] = await get_stylist(results[i].stylist_id);
									}
									res.json({status:true,status_code:200,message:'Appointment listing',data:results});
								} else {
									res.json({status:false,status_code:201,message:'No Appointment found'});
								}
							}
						});
					}
				}
			}
		});
    }
}

module.exports.history=async function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

        var user_id = decoded.data.id;

        //var sql = 'SELECT * FROM appointments WHERE stylist_id = ? AND (NOT id IN (SELECT appointment_id FROM appointment_received WHERE stylist_id = ?)) OR is_completed = 1 AND is_expired = 1';
        var sql = 'SELECT * FROM appointments WHERE stylist_id = ? AND (is_completed = 1 OR is_expired = 1)';
		connection.query(sql,[user_id],async function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:error})
			} else {
				if(results.length > 0){
					for (var i = 0; i < results.length; i++) {
						if(results[i].is_expired == 1){ 
							results[i]['services'] = await get_services(results[i].id);
						}else {
							results[i]['services'] = await get_booked_services(results[i].id);
						}
						results[i]['clients'] = await get_clients(results[i].id);
					}
					res.json({status:true,status_code:200,message:'Appointment History Listing',data:results});
				} else {
					res.json({status:false,status_code:201,message:'No Appointment found'});
				}
			}
		});
    }
}

module.exports.booked_appointment_list=async function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

        var user_id = decoded.data.id;

        connection.query('SELECT * FROM appointment_received WHERE stylist_id = ?',[user_id],async function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {

				let appointment_arr = [];
				for (var i = 0; i < results.length; i++) {
					appointment_arr[i] = results[i].appointment_id
				}

				if(appointment_arr.length > 0){

					connection.query('SELECT * FROM appointments WHERE id IN (?) ORDER BY id DESC',[appointment_arr],async function (error, results, fields) {
						if (error) {
							res.json({status:false,status_code:201,message:'there are some error with query'})
						} else {

							for (var i = 0; i < results.length; i++) {
								results[i]['services'] = await get_booked_services(results[i].id);
								results[i]['stylist'] = await get_stylist(results[i].stylist_id);
								results[i]['clients'] = await get_clients(results[i].id);
							}
							res.json({status:true,status_code:200,message:'Appointment listing',data:results});
						}
					});
				} else {
					res.json({status:false,status_code:201,message:'No Booked appointment'})
				}
			}
		});
    }
}

async function get_booked_services(id){
	return new Promise(async function(resolve, reject){
		connection.query('SELECT * FROM appointment_service_booked WHERE appointment_id = ?',[id], async function (error, results) {
			if(error) {
				reject(error)
			}
			resolve(results)
		});
	})
}

async function get_services(id){
	return new Promise(async function(resolve, reject){
		connection.query('SELECT appointment_services.*, services.name AS service_name FROM appointment_services LEFT JOIN services ON services.id = appointment_services.service WHERE appointment_services.appointment_id = ?',[id], async function (error, results) {
			if(error) {
				reject(error)
			}
			resolve(results)
		});
	})
}

async function get_clients_data(id){
	return new Promise(async function(resolve, reject){
		connection.query('SELECT * FROM users WHERE id = ?',[id], async function (error, results) {
			if(error) {
				reject(error)
			}
			if(results.length > 0){
				resolve(results[0])
			} else {
				resolve(results)
			}
		});
	})
}

async function get_received_client(id){
	return new Promise(async function(resolve, reject){
		connection.query('SELECT * FROM appointment_received WHERE appointment_id = ?',[id], async function (error, results) {
			if(error) {
				reject(error)
			}
			if(results.length > 0){
				resolve('true')
			} else {
				resolve('false')
			}
		});
	})
}

async function get_clients(id){
	return new Promise(async function(resolve, reject){
		connection.query('SELECT * FROM appointment_received WHERE appointment_id = ?',[id], async function (error, results) {
			if(error) {
				reject(error)
			}

			let arr = [];
			if(results.length > 0){
				for (var i = 0; i < results.length; i++) {
					arr[i] = await get_clients_data(results[i].client_id);
				}
			}
			resolve(arr)
		});
	})
}

async function get_stylist(id){
	return new Promise(async function(resolve, reject){
		connection.query('SELECT * FROM users WHERE id = ?',[id], async function (error, results) {
			if(error) {
				reject(error)
			}
			resolve(results)
		});
	})
}

