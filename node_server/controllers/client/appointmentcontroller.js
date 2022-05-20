var jwt = require('jsonwebtoken');
var express = require('express');
var bcrypt = require('bcrypt');
var app     = express();
var connection = require('./../../config');
var helper = require('./../../helper.js');
process.env.TZ = 'Asia/Kolkata';

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
				}
				res.json({status:true,status_code:200,message:'Appointment Detail.',data:results});
			}
		});
	}
}

module.exports.book_appointment=async function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

		var appointment_id = req.body.appointment_id;
		var client_id = decoded.data.id;
		var stripe_token = req.body.stripe_token;
		var service_id = req.body.service_id;

		var sql = 'SELECT * FROM payment_history WHERE appointment_id = ? AND client_id = ?';
		connection.query(sql,[appointment_id,client_id],async function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'Something went wrong!'})
			} else {

				if(results.length > 0){
					res.json({status:false,status_code:201,message:'Appointment is already booked by you!'})

				} else {
					helper.clientPayment(client_id,stripe_token,appointment_id,service_id,res);
				}
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

        var client_id = decoded.data.id;
        connection.query('SELECT * FROM appointment_received WHERE client_id = ?',[client_id],async function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:error})
			} else {

				var client_app_arr = [];
				if(results.length > 0){
					for (var i = 0; i < results.length; i++) {
						client_app_arr[i] = results[i].appointment_id;
					}
				}

				let date_ob = new Date();
			    let date = ("0" + date_ob.getDate()).slice(-2);
			    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
			    let year = date_ob.getFullYear();
			    let hours = date_ob.getHours();
			    let minutes = date_ob.getMinutes();
			    let seconds = date_ob.getSeconds();

			    var check_date = month+"/"+date+"/"+year;
			    var check_time = hours + ":" + minutes;

			    var start_date_time = check_date+" "+check_time;

				if(client_app_arr.length > 0){

					connection.query('SELECT * FROM appointments WHERE is_completed = 0 AND is_expired = 0 AND start_date_time >= ? AND id NOT IN (?) ORDER BY id DESC',[start_date_time,client_app_arr],async function (error, results, fields) {
						if (error) {
							res.json({status:false,status_code:201,message:error})
						} else {

							if(results.length > 0){
								for (var i = 0; i < results.length; i++) {
									results[i]['services'] = await get_services(results[i].id);
									results[i]['stylist'] = await get_stylist(results[i].stylist_id);
								}
								res.json({status:true,status_code:200,message:'Appointment listing',data:results});
							} else {
								res.json({status:false,status_code:201,message:'No Appointment listed'})
							}
						}
					});
				} else {

					connection.query('SELECT * FROM appointments WHERE is_completed = 0 AND start_date_time >= ? AND is_expired = 0 ORDER BY id DESC',[start_date_time],async function (error, results, fields) {
						if (error) {
							res.json({status:false,status_code:201,message:error})
						} else {

							if(results.length > 0){
								for (var i = 0; i < results.length; i++) {
									results[i]['services'] = await get_services(results[i].id);
									results[i]['stylist'] = await get_stylist(results[i].stylist_id);
								}
								res.json({status:true,status_code:200,message:'Appointment listing',data:results});
							} else {
								res.json({status:false,status_code:201,message:'No Appointment listed'})
							}
						}
					});
				}
			}
		});
    }
}

module.exports.appointment_history=async function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

        var client_id = decoded.data.id;

        connection.query('SELECT * FROM appointment_received WHERE client_id = ? ORDER BY id DESC',[client_id],async function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {

				let appointment_id_arr = [];
				if(results.length > 0){
					for (var i = 0; i < results.length; i++) {
						appointment_id_arr[i] = results[i].appointment_id;
					}

					if(appointment_id_arr.length > 0)
					{
						connection.query('SELECT * FROM appointments WHERE id IN (?) AND is_completed = 1 ORDER BY id DESC',[appointment_id_arr],async function (error, results, fields) {
							if (error) {
								res.json({status:false,status_code:201,message:'there are some error with query'})
							} else {
								if(results.length > 0){
									for (var i = 0; i < results.length; i++) {
										results[i]['services'] = await get_booked_services(results[i].id);
										results[i]['stylist'] = await get_stylist(results[i].stylist_id);
									}
									res.json({status:true,status_code:200,message:'Appointment History',data:results});
								} else {
									res.json({status:false,status_code:201,message:'No Appointment History found'})
								}
							}
						});
					} else {
						res.json({status:false,status_code:201,message:'No Appointment History found'})
					}
				} else {
					res.json({status:false,status_code:201,message:'No Appointment History found'})
				}
			}
		});
    }
}

module.exports.my_appointments=async function(req,res){

	if (req.headers && req.headers.usertoken) {

		var token = req.headers.usertoken,
            decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (e) {
        	res.json({status_code:401,status:false,token:token,message:'unauthorized'})
        }

        var client_id = decoded.data.id;
        connection.query('SELECT * FROM appointment_received WHERE client_id = ? ORDER BY id DESC',[client_id],async function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {

				let appointment_id_arr = [];
				if(results.length > 0){
					for (var i = 0; i < results.length; i++) {
						appointment_id_arr[i] = results[i].appointment_id;
					}

					if(appointment_id_arr.length > 0)
					{
						connection.query('SELECT * FROM appointments WHERE id IN (?) AND is_completed = 0 ORDER BY id DESC',[appointment_id_arr],async function (error, results, fields) {
							if (error) {
								res.json({status:false,status_code:201,message:'there are some error with query'})
							} else {
								if(results.length > 0){
									for (var i = 0; i < results.length; i++) {
										results[i]['services'] = await get_booked_services(results[i].id);
										results[i]['stylist'] = await get_stylist(results[i].stylist_id);
									}
									res.json({status:true,status_code:200,message:'Appointment History',data:results});
								} else {
									res.json({status:false,status_code:201,message:'No Appointment History found'})
								}
							}
						});
					} else {
						res.json({status:false,status_code:201,message:'No Appointment found'})
					}
				} else {
					res.json({status:false,status_code:201,message:'No Appointment History found'})
				}
			}
		});
    }
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