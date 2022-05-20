var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var firebase = require('./firebase');
var mail_transporter = require('./mail_config');
var stripe = require('./stripe');
var connection  = require('./config');
var fs          = require('fs');

const sendPushNotification = function sendPushNotification(registrationToken,message){

    const notification_options = {
        priority: "high",
        timeToLive: 60 * 60 * 24,
    };

    console.log(message)


    firebase.messaging().sendToDevice(registrationToken, message, notification_options).then( response => {
        console.log("Notification sent successfully", response)
    }).catch( error => { console.log(error); });
}

const createStripeCustomer = async function createStripeCustomer(first_name, last_name, email, phone, user_id, res){

    const customer = await stripe.customers.create({
	  name : first_name+" "+last_name,
	  email : email,
	  phone : phone
	}).then(function(result){
		var customer_id = result.id;
		//console.log(customer_id); return;
	    connection.query('UPDATE users SET stripe_customer_id = ? WHERE id = ?',[customer_id,user_id], function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {
				console.log('key added successfully');
			}
		});
	}, function(error){
		res.json({status:false,status_code:500,message:error.message})
	});
}

const unsubscribe_user = async function unsubscribe_user(user_data, res){

    const customer = await stripe.subscriptions.del(user_data.subscription_id).then(function(result){
			
		var status_change = result.status;
		var canceled_date = new Date();

	    connection.query('UPDATE users SET subscription_status = ? WHERE id = ?',[status_change,user_data.id], function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {
				console.log('key added successfully');
			}
		});

		connection.query('UPDATE subscription_history SET status = ?, canceled_date = ? WHERE subscription_id = ?',[status_change, canceled_date, user_data.subscription_id], function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:'there are some error with query'})
			} else {
				res.json({status:true,status_code:200,message:'Stylist unsubscribed successfully.',data:[]})
			}
		});

	}, function(error){
		res.json({status:false,status_code:500,message:error.message})
	});
}

const clientPayment = async function clientPayment(client_id, stripe_token, appointment_id, service_id, res){

	var sql = "SELECT * FROM appointment_services WHERE id = ?";
	connection.query(sql,[service_id],async function (err, result, fields) {
		if(result.length > 0){
			
			var stylist_id = result[0].user_id;
			var total_price = result[0].price;
			var service_name = result[0].service;
			var service_price = result[0].price;

			total_price = parseInt(total_price);
			total_price = total_price/2;

			const payment = await stripe.charges.create({
				amount: parseInt(total_price) * 100,
				currency: "usd",
				description: "Appointment booking payment",
				source:stripe_token
			});

			if(payment.status == "succeeded"){
				var payment_id = payment.id;
				var type = 1;
				var amount = payment.amount/100;
				var balance_transaction = payment.balance_transaction;
				var currency = payment.currency;
				var description = payment.description;
				var payment_method = payment.payment_method;
				var payment_method_detail = JSON.stringify(payment.payment_method_details);
				var receipt_url = payment.receipt_url;
				var refunds = JSON.stringify(payment.refunds);
				var source = JSON.stringify(payment.source);
				var status = payment.status;
				var sql = "INSERT INTO payment_history (appointment_id, client_id, stylist_id, payment_id, amount, balance_transaction, currency, description, payment_method, payment_method_detail, receipt_url, refunds, source, status) VALUES ('"+appointment_id+"','"+client_id+"','"+stylist_id+"','"+payment_id+"','"+amount+"','"+balance_transaction+"','"+currency+"','"+description+"','"+payment_method+"','"+payment_method_detail+"','"+receipt_url+"','"+refunds+"','"+source+"','"+status+"')";
				connection.query(sql,function (err, result, fields) {
					console.log(err);
					if (err) {
						res.json({status:false,status_code:201,message:'Payment failed'})
					} else {

						var user_id = client_id;
						var service = service_name;
						var price = service_price;

						var add_sql = "INSERT INTO appointment_service_booked (appointment_id, user_id, service, price) VALUES ('"+appointment_id+"','"+user_id+"','"+service+"','"+price+"')";
						connection.query(add_sql,function (err, result, fields) {
							if (err) throw err;
							var add_sql = "INSERT INTO appointment_received (appointment_id, stylist_id, client_id) VALUES ('"+appointment_id+"','"+stylist_id+"','"+user_id+"')";
			    			connection.query(add_sql,function (err, result, fields) {
			    				if (err) throw err;

			    				var sql = "SELECT * FROM users WHERE id = ?";
								connection.query(sql,[user_id],function (err, result, fields) {

									if(result.length > 0){

										var username = result[0].name;
										var sql1 = "SELECT * FROM appointments WHERE id = ?";
										connection.query(sql1,[appointment_id],async function (err, app_result, fields) {

											if(app_result.length > 0){

												var appoint_data = app_result[0];
					        					const message = {
											    	notification : {
											    		title : username+' is booked appointment',
											    		body : username+' has booked your appointment for '+appoint_data.start_time+'. Tap to know details!',
											    		click_action: 'FLUTTER_NOTIFICATION_CLICK',
											    	},
											    	data : {
											    		type : "3",
											    		appointment_id : appointment_id,
											    		click_action: 'FLUTTER_NOTIFICATION_CLICK',
											    	}
											    }

											    var sql = "SELECT * FROM user_device_tokens WHERE user_id = ?";
					        					connection.query(sql,[stylist_id],function (err, res1, fields) {
					        						if(res1.length > 0){
					        							for(let i=0; i < res1.length; i++) {
															let row = res1[i]
														    sendPushNotification(row.device_token,message);
														}
					        						}
					        					})
											}
										});
									}
								});
			    				res.json({status:true,status_code:200,message:'Appointment booked successfully.',data:[]})
			    			});
						});	
					}
				});
			} else {
				res.json({status:false,status_code:201,message:'Payment failed'})
			}
		}
	});
}

const subscriptionCharge = async function subscriptionCharge(stylist_id, stripe_token, res){

	var sql = "SELECT * FROM users WHERE id = ?";
	connection.query(sql,[stylist_id],async function (err, result, fields) {
		//console.log(result)
		if(result.length > 0){
			var data = result[0];
			//console.log("data",data);
			var sql = 'SELECT * FROM stripe_subscription_price ORDER BY id DESC';
		    connection.query(sql, async function (error, results, fields) {
				if (error) {
					res.json({status:false,status_code:201,message:error})
				} else {
					//console.log(results)
					if(results.length > 0){

						var price_data = results[0];
						if(data.stripe_customer_id != '' && data.stripe_customer_id != null){

							stripe.customers.update(
								data.stripe_customer_id, {
								source : stripe_token
							}).then(customer => {

								var subscription = stripe.subscriptions.create({
									customer: customer.id,
									items: [{
										price: price_data.price_id
							        }]
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

									var sql = "INSERT INTO subscription_history (user_id,subscription_id,object,billing_cycle_anchor,cancel_at_period_end,collection_method,current_period_start,current_period_end,items,latest_invoice,livemode,plan,quantity,start_date,status) VALUES ('"+stylist_id+"','"+subscription_id+"','"+object+"','"+billing_cycle_anchor+"','"+cancel_at_period_end+"','"+collection_method+"','"+current_period_start+"','"+current_period_end+"','"+items+"','"+latest_invoice+"','"+livemode+"','"+plan+"','"+quantity+"','"+start_date+"','"+status_activation+"')";
								    connection.query(sql, function (error, results, fields) {
										if (error) {
											res.json({status:false,status_code:201,message:error})
										} else {
											res.json({status:true,status_code:200,message:'Stylist Subscribe successfully.',data:[]})
										}
									});
									var sql = "UPDATE users SET subscription_id = ?, subscription_status = ? WHERE id = ?";
									connection.query(sql,[subscription_id,status_activation,stylist_id],async function (err, result, fields) {
										console.log('Status Updated');
									});
								}, function(error){
									res.json({status:false,status_code:500,message:error.message})
								});
							});

						} else {

							stripe.customers.create({
								source : stripe_token,
								email : data.email
							}).then(customer => {

								var sql = "UPDATE users SET stripe_customer_id = ? WHERE id = ?";
								connection.query(sql,[customer.id,stylist_id],async function (err, result, fields) {
									console.log('stripe customer key added');
								});

								var subscription = stripe.subscriptions.create({
									customer: customer.id,
									items: [{
										price: price_data.price_id
							        }]
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

									var sql = "INSERT INTO subscription_history (user_id,subscription_id,object,billing_cycle_anchor,cancel_at_period_end,collection_method,current_period_start,current_period_end,items,latest_invoice,livemode,plan,quantity,start_date,status) VALUES ('"+stylist_id+"','"+subscription_id+"','"+object+"','"+billing_cycle_anchor+"','"+cancel_at_period_end+"','"+collection_method+"','"+current_period_start+"','"+current_period_end+"','"+items+"','"+latest_invoice+"','"+livemode+"','"+plan+"','"+quantity+"','"+start_date+"','"+status_activation+"')";
								    connection.query(sql, function (error, results, fields) {
										if (error) {
											res.json({status:false,status_code:201,message:error})
										} else {
											res.json({status:true,status_code:200,message:'Stylist Subscribe successfully.',data:[]})
										}
									});

									var sql = "UPDATE users SET subscription_id = ?, subscription_status = ? WHERE id = ?";
									connection.query(sql,[subscription_id,status_activation,stylist_id],async function (err, result, fields) {
										console.log('Status Updated');
									});

									console.log(result)
								}, function(error){
									res.json({status:false,status_code:500,message:error.message})
								});
							});
						}
					}
				}
			});
		}
	});
}

const createBankAccount = async function (req, stylist_id,routing_number,account_number,account_holder_name,account_holder_type,dob,ssn,res){
	
	connection.query("UPDATE users SET routing_number = ?, account_number = ?, account_holder_name = ?, account_holder_type = ?, dob = ?, ssn = ? WHERE id = ?",[routing_number,account_number,account_holder_name,account_holder_type,dob,ssn,stylist_id],async function(err, result, fields){
		if (err) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			console.log('adding bank account start');
			connection.query('SELECT * FROM users WHERE id = ?',[stylist_id], async function (error, results, fields) {
				if (error) {
					res.json({status:false,status_code:201,message:'there are some error with query'})
				} else {
					var row = results[0];
					if(row.stripe_customer_id == '' || row.stripe_customer_id == null){

						const customer = await stripe.customers.create({
							name : row.first_name+" "+row.last_name,
							email : row.email,
							phone : row.phone
						}).then(function(result){
							var stripe_customer_id = result.id;
						    connection.query('UPDATE users SET stripe_customer_id = ? WHERE id = ?',[stripe_customer_id,stylist_id], async function (error, results, fields) {
								if (error) {
									res.json({status:false,status_code:201,message:'there are some error with query'})
								} else {
									console.log('Stripe Customer Id added successfully');
								}
							});
						}, function(err){
							res.json({status:false,status_code:500,message:err.message})
						});
					}

					connection.query('SELECT * FROM users WHERE id = ?',[stylist_id], async function (error, users, fields) {
						if (error) {
							res.json({status:false,status_code:201,message:'there are some error with query'})
						} else {
							if(users.length > 0){

								var user_detail = users[0];
								var user_dob = user_detail.dob;

								if(user_dob){

									var dob_arr = user_dob.split('/');
									var date = dob_arr[1];
									var month = dob_arr[0];
									var year = dob_arr[2];
								} else {
									var date = '01';
									var month = '07';
									var year = '1991';
								}

								const account = await stripe.accounts.create({
									type: 'custom',
									country: 'US',
									email: user_detail.email,
									business_type: 'individual',
									business_profile : {
										mcc : '7230',
										url : user_detail.url
									},
									individual: {
										address : {
											line1: user_detail.address,
											line2: user_detail.city,
											city: user_detail.city,
											state: user_detail.state,
											country: 'US',
											postal_code: user_detail.zip_code,
										},
										dob : {
											day: date,
											month:month,
											year:year,
										},
										first_name: user_detail.first_name,
										last_name: user_detail.last_name,
										phone: user_detail.phone,
										email: user_detail.email,
										id_number:user_detail.ssn
									},
									capabilities: {
										card_payments: {requested: true},
										transfers: {requested: true},
									},
									external_account: {
										object: 'bank_account',
										country: 'US',
										currency: 'usd',
										account_holder_name: account_holder_name,
										account_holder_type: account_holder_type,
										routing_number: routing_number,
										account_number: account_number,
									}
								}).then(async function(results){

									var bank_account_id = results.id;
									var bank_account_status = 'pending';

									const account = await stripe.accounts.update(bank_account_id,{
										tos_acceptance: {
											date: Math.floor(Date.now() / 1000),
											ip: req.connection.remoteAddress,
										},
									});

									connection.query('UPDATE users SET stripe_bank_account_id = ?, account_status = ? WHERE id = ?',[bank_account_id,bank_account_status,stylist_id], function (error, results, fields) {
										if (error) {
											res.json({status:false,status_code:201,message:'there are some error with query'})
										} else {
											res.json({status:true,status_code:200,message:'Bank account added successfully.',data:[]})
										}
									});
								}, function(error){
									res.json({status:false,status_code:500,message:error.message})
								});
							} else {
								res.json({status:false,status_code:500,message:"No Stylist Found"})
							}
						}
					});
				}
			});
		}
	});
}

const verifyBankAccount = async function verifyBankAccount(stylist_id,res){
	
	connection.query('SELECT * FROM users WHERE id = ?',[stylist_id], async function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			var row = results[0];
			const bankAccount = await stripe.customers.verifySource(
				row.stripe_customer_id,
				row.stripe_bank_account_id,{amounts: [32, 45]}
			);

			var bank_account_status = bankAccount.status;

			connection.query('UPDATE users SET account_status = ? WHERE id = ?',[bank_account_status,stylist_id], function (error, results, fields) {
				if (error) {
					res.json({status:false,status_code:201,message:'there are some error with query'})
				} else {
					res.json({status:true,status_code:200,message:'Bank account varified successfully.',data:[]})
				}
			});
		}
	});
}

const createStripeProduct = async function createStripeProduct(res){
	
	const PRODUCT_NAME = "Monthly Subscription";
    const PRODUCT_TYPE = 'service'

    const product = await stripe.products.create({
		name: PRODUCT_NAME,
		type: PRODUCT_TYPE,
    }).then(function(result){
		
		var product_id = result.id;
		var name = result.name;
		var type = result.type;
		var status1 = result.active;
		var live_mode = result.livemode;
		
		var sql = 'INSERT INTO stripe_subscription_products (product_id,name,type,status,live_mode) VALUES ("'+product_id+'","'+name+'","'+type+'","'+status1+'","'+live_mode+'")';
	    connection.query(sql, function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:error})
			} else {
				var plan_price = 500;
				createStripePlan(product_id,plan_price,res)
				res.json({status:true,status_code:200,message:'Product added successfully'});
			}
		});
	}, function(error){
		res.json({status:false,status_code:500,message:error.message})
	});
}

const createStripePlan = async function createStripePlan(product_id,plan_price,res){

	const price = await stripe.prices.create({
		unit_amount: plan_price,
		currency: 'usd',
		recurring: {interval: 'month'},
		product: product_id,
	}).then(function(result){

		var price_id = result.id;
		var currency = result.currency;
		var price = result.unit_amount;
		var interval_time = 'month';
		var interval_count = 1;

		var sql = 'INSERT INTO stripe_subscription_price (product_id,price_id,currency,price,interval_time,interval_count) VALUES ("'+product_id+'","'+price_id+'","'+currency+'","'+price+'","'+interval_time+'","'+interval_count+'")';
	    connection.query(sql, function (error, results, fields) {
			if (error) {
				res.json({status:false,status_code:201,message:error});
			} else {
				console.log('Price added successfully');
				res.json({status:true,status_code:200,message:'Price added successfully',data:[]})
			}
		});
	},function(error){
		res.json({status:false,status_code:500,message:error.message})
	});
}

const updateStripeStatus = async function updateStripeStatus(stylist_id){
		
	var sql = 'SELECT * FROM users WHERE id = ?';
    connection.query(sql,[stylist_id], async function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:error})
		} else {
			var data = results[0];

			const account = await stripe.accounts.retrieve(
			  data.account_number
			).then(function(result){
				res.json({status:true,status_code:200,message:'account data',data:result})
			}, function(error){
				res.json({status:false,status_code:500,message:error.message})
			});
		}
	});
}

const uploadDocumentStripe = async function uploadDocumentStripe(acct_id,front_img,back_img,res){

	var fp_front = fs.readFileSync(front_img.path);
	var file_front = await stripe.files.create({
		purpose: 'identity_document',
		file: {
			data: fp_front,
			name: front_img.filename,
			type: front_img.mimetype,
		},
	});

	var fp_back = fs.readFileSync(back_img.path);
	var file_back = await stripe.files.create({
		purpose: 'identity_document',
		file: {
			data: fp_back,
			name: back_img.filename,
			type: back_img.mimetype,
		},
	});

	var front_file = file_front.id;
	var back_file = file_back.id;

	const account = await stripe.accounts.update(acct_id,
	{
	  	individual: {
	  		verification: {
	  			document : {
	  				front : front_file,
	  				back : back_file
	  			}
	  		}
	  	}
	}).then(function(result){
		res.json({status:true,status_code:200,message:'document uploaded successfully',data:[]})
	}, function(error){
		res.json({status:false,status_code:500,message:error.message})
	});
}

const sendMailData = async function sendMailData(subject,email,htmlToSend){
	var mailOptions = {
        from:'"Wait List Hero" chirag.c@upsquare.in',
		to: email,
        subject : subject,
        html : htmlToSend
    };

    mail_transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            //callback(error);
        } else {
			console.log('Email sent:');
		}	
    });
}

module.exports = { sendMailData, uploadDocumentStripe, createStripePlan, unsubscribe_user, subscriptionCharge, createStripeProduct, sendPushNotification, createStripeCustomer, clientPayment, createBankAccount, verifyBankAccount }