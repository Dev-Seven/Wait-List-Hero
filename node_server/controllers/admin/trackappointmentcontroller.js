var express = require('express');
var bcrypt = require('bcrypt');
var app     = express();
var connection = require('./../../config');

module.exports.index=async function(req,res){

	connection.query('SELECT * FROM payment_history ORDER BY id DESC',async function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {

			for (var i = 0; i < results.length; i++) {
				results[i]['stylist'] = await get_user_detail(results[i].stylist_id);
				results[i]['client'] = await get_user_detail(results[i].client_id);
				results[i]['appointment'] = await get_appointment(results[i].appointment_id);
			}
			res.json({status:true,status_code:200,message:'Appointment listing',data:results});
		}
	});
}

module.exports.detail=async function(req,res){

	var id = req.body.id;

	connection.query('SELECT * FROM payment_history WHERE id = ?',[id],async function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {

			var i = 0;
			results[i]['stylist'] = await get_user_detail(results[i].stylist_id);
			results[i]['client'] = await get_user_detail(results[i].client_id);
			results[i]['appointment'] = await get_appointment(results[i].appointment_id);

			res.json({status:true,status_code:200,message:'Appointment listing',data:results});
		}
	});
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
		connection.query('SELECT * FROM appointment_services WHERE appointment_id = ?',[id], async function (error, results) {
			if(error) {
				reject(error)
			}
			resolve(results)
		});
	})
}

async function get_user_detail(id){
	return new Promise(async function(resolve, reject){
		connection.query('SELECT * FROM users WHERE id = ?',[id], async function (error, results) {
			if(error) {
				reject(error)
			}
			resolve(results[0])
		});
	})
}

async function get_appointment(id){
	return new Promise(async function(resolve, reject){
		connection.query('SELECT * FROM appointments WHERE id = ?',[id], async function (error, results) {
			if(error) {
				reject(error)
			}

			let arr = [];
			if(results.length > 0){
				for (var i = 0; i < results.length; i++) {
					arr[i] = results[i];
					arr[i].services = await get_booked_services(results[i].id);
				}
			}
			resolve(arr[0])
		});
	})
}