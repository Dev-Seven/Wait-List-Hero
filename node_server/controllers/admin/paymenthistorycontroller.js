var express = require('express');
var bcrypt = require('bcrypt');
var app     = express();
var connection = require('./../../config');

module.exports.list=async function(req,res){

	connection.query('SELECT * FROM payment_history ORDER BY id DESC',async function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {

			for (var i = 0; i < results.length; i++) {
				results[i]['stylist'] = await get_user_data(results[i].stylist_id);
				results[i]['client'] = await get_user_data(results[i].client_id);
				results[i]['appointment'] = await get_appointment(results[i].appointment_id);
			}
			res.json({status:true,status_code:200,message:'History listing',data:results});
		}
	});
}

module.exports.find_by_id=async function(req,res){

	var id = req.body.id;
	connection.query('SELECT * FROM payment_history WHERE id = ?',[id],async function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:error})
		} else {

			for (var i = 0; i < results.length; i++) {
				results[i]['stylist'] = await get_user_data(results[i].stylist_id);
				results[i]['client'] = await get_user_data(results[i].client_id);
				results[i]['appointment'] = await get_appointment(results[i].appointment_id);
			}
			res.json({status:true,status_code:200,message:'Appointment Detail',data:results});
		}
	});
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

async function get_appointment(id){
	return new Promise(async function(resolve, reject){
		connection.query('SELECT * FROM appointments WHERE id = ?',[id], async function (error, results) {
			if(error) {
				reject(error)
			}
			resolve(results)
		});
	})
}

async function get_user_data(id){
	return new Promise(async function(resolve, reject){
		connection.query('SELECT * FROM users WHERE id = ?',[id], async function (error, results) {
			if(error) {
				reject(error)
			}
			resolve(results)
		});
	})
}