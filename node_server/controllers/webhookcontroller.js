var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var connection = require('./../config');
var mail_transporter = require('./../mail_config');
var helper = require('./../helper.js');
var stripe = require('./../stripe');

module.exports.update_account_status=function(req,res){

	var account_id = req.body.account; 
	var status = req.body.account.object.individual.verification.status;

	var reason = '';
	if(req.body.data.object.individual.verification.details != undefined){
		reason = req.body.data.object.individual.verification.details;
	}

	connection.query('SELECT * FROM users WHERE stripe_bank_account_id = ?',[account_id], function (error, results, fields) {
		if (error) {
			console.log(error);
		} else {
			if(results.length > 0){
				var data = results[0];
				connection.query('UPDATE users SET account_status = ?, account_reason = ? WHERE id = ?',[status, reason, data.id], function (error, results, fields) {
					if (error) {
						console.log(error);
					} else {
						console.log('status updated successfully');
					}
				});
			}
		}
	});
}


module.exports.update_subscription_data=async function(req,res){

	connection.query('SELECT * FROM stripe_subscription_price ORDER BY id DESC', async function (error, results, fields) {
		if (error) {
			console.log(error);
		} else {
			if(results.length > 0){
				var data = results[0];

				var sub_price = data.price;
				console.log('sub_price :',sub_price)
				var req_price = req.body.data.object.amount_paid;
				console.log('req_price :',req_price)
				var total_price = req.body.data.object.total;
				console.log('req_price :',total_price)
				var subscription_id = req.body.data.object.subscription;
				console.log('subscription_id :',subscription_id)
				var customer_id = req.body.data.object.customer;
				console.log('customer_id :',customer_id)
				var price_id = data.price_id;
				console.log('price_id :',price_id)

				if(sub_price != req_price){
					console.log('in')
					const subscription = await stripe.subscriptions.retrieve(subscription_id);
					const sub_updated = await stripe.subscriptions.update(subscription_id,{
						cancel_at_period_end: false,
							proration_behavior: 'create_prorations',
						items: [
							{id: subscription.items.data[0].id,price: price_id},
						],
					}).then(function(result){

						var subscription_id = result.id;
						var object = result.object;
						var billing_cycle_anchor = result.billing_cycle_anchor;
						var cancel_at_period_end = result.cancel_at_period_end;
						var collection_method = result.collection_method;
						var current_period_end = result.current_period_end;
						var current_period_start = result.current_period_start;
						var items = JSON.stringify(result.items);
						var latest_invoice = result.latest_invoice;
						var livemode = result.livemode;
						var plan = JSON.stringify(result.plan);
						var quantity = result.quantity;
						var start_date = result.start_date;
						var status_activation = result.status;

						connection.query('SELECT * FROM users WHERE stripe_customer_id = ?',[customer_id], async function (error, user_data, fields) {
							if (error) {
								console.log(error);
							} else {

								if(user_data.length > 0){
									var u_data = user_data[0];
									var stylist_id = u_data.id;

									var sql = "INSERT INTO subscription_history (user_id,subscription_id,object,billing_cycle_anchor,cancel_at_period_end,collection_method,current_period_start,current_period_end,items,latest_invoice,livemode,plan,quantity,start_date,status) VALUES ('"+stylist_id+"','"+subscription_id+"','"+object+"','"+billing_cycle_anchor+"','"+cancel_at_period_end+"','"+collection_method+"','"+current_period_start+"','"+current_period_end+"','"+items+"','"+latest_invoice+"','"+livemode+"','"+plan+"','"+quantity+"','"+start_date+"','"+status_activation+"')";
								    connection.query(sql, function (error, results, fields) {
										if (error) {
											console.log('subscription renew error :', error);
										} else {
											console.log('subscription history added');
										}
									});
									var sql = "UPDATE users SET subscription_id = ?, subscription_status = ? WHERE id = ?";
									connection.query(sql,[subscription_id,status_activation,stylist_id],async function (err, result, fields) {
										console.log('subscription status updated');
									});
								} else {
									console.log('No Customer found');
								}
							}
						});
					},function(err){
						console.log(err);
					});
				}
			}
		}
	});
}

module.exports.update_appointment_status=function(req,res){

	let date_ob = new Date();
	let date = ("0" + date_ob.getDate()).slice(-2);
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	let year = date_ob.getFullYear();
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	let seconds = date_ob.getSeconds();

	var check_date = date + "-" + month+ "-" +year;
	var check_time = hours + ":" + minutes + ":" + seconds;

	var sql = 'UPDATE appointments SET is_expired = 1 WHERE date < ? AND is_expired = 0';
	connection.query(sql,[check_date],function (error, results, fields) {
		if (error) {
			console.log(error);
		} else {
			console.log('updated expired data');
		}
	});

	var sql = 'UPDATE appointments SET is_expired = 1 WHERE is_expired = 0 AND date = ? AND start_time <= ?';
	connection.query(sql,[check_date, check_time],function (error, results, fields) {
		if (error) {
			console.log(error);
		} else {
			console.log('updated expired data');
		}
	});
}
