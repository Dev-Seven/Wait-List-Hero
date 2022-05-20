var express = require('express');
var bcrypt = require('bcrypt');
var app     = express();
var connection = require('./../../config');
var stripe = require('./../../stripe');

module.exports.transfer_money=async function(req,res){

	var appointment_id = req.body.appointment_id;
	var stylist_id = req.body.stylist_id;

	connection.query('SELECT * FROM appointments WHERE id = ?',[appointment_id],async function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:error})
		} else {
			connection.query('SELECT * FROM users WHERE id = ?',[stylist_id],async function (error, results, fields) {
				if (error) {
					res.json({status:false,status_code:201,message:error})
				} else {

					var stylist_account_id = results[0].stripe_bank_account_id;

					connection.query('SELECT * FROM subscription_data WHERE name = "admin_commission"',async function (error, results, fields) {
						if (error) {
							res.json({status:false,status_code:201,message:error})
						} else {

							var price_commission = results[0].amount;

							var sql = "SELECT * FROM appointment_services WHERE appointment_id = ?";
							connection.query(sql,[appointment_id],async function (err, result, fields) {
								if(result.length > 0){
									
									var total_price = 0;
									for(let i=0; i < result.length; i++) {
										total_price += parseInt(result[i].price);
									}
									console.log(total_price)
									total_price = total_price/2;
									console.log(total_price)
									total_price = total_price - price_commission;
									console.log(total_price)
									total_price = total_price * 100;
									console.log(total_price)

									const transfer = await stripe.transfers.create({
										amount: total_price,
										currency: 'usd',
										destination: stylist_account_id,
										transfer_group: 'APPOINTMENT_'+appointment_id,
									}).then(function(results){
										res.json({status:true,status_code:200,message:'Payment transfer to stylist successfully',data:results});
									}, function(error){
										res.json({status:false,status_code:500,message:error.message})
									});
								}
							});
						}
					});
				}
			});
		}
	});
}