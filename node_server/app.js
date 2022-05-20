var express = require('express');
var app = express();
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');
var connection = require('./config');
var path = require('path');
var multer = require('multer');
var firebase = require('./firebase');
var mail_transporter = require('./mail_config');
var env = require('./../env.js');
var router = express.Router();
const DIR = './../public/img/user';
var CronJob = require('cron').CronJob;
process.env.TZ = 'Asia/Kolkata';

console.log(env);
if (env != 'local') {
    base_url = 'http://67.205.148.222/waitlisthero';
} else {
    base_url = 'http://localhost';
}
console.log(base_url)

var job = new CronJob('1 * * * * *', function() {

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    var check_date = month + "/" + date + "/" + year;
    var check_time = hours + ":" + minutes;
    var start_date_time = check_date + " " + check_time;

    console.log(start_date_time);

    var sql = 'SELECT * FROM appointments WHERE start_date_time <= ? AND is_expired = 0';
    connection.query(sql, [start_date_time], function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            console.log(results.length);
            if (results.length > 0) {
                for (var i = 0; i < results.length; i++) {

                    var data = results[i];
                    var appointment_id = data.id;
                    var sql = 'SELECT * FROM appointment_received WHERE appointment_id = ?';
                    connection.query(sql, [appointment_id], function(error, result_ap, fields) {

                        console.log('count', result_ap);
                        if (result_ap.length == '0') {
                            var sql = 'UPDATE appointments SET is_expired = 1 WHERE id = ?';
                            connection.query(sql, [appointment_id], function(error, results, fields) {
                                console.log(error);
                            });
                        }
                    });
                }
            }
        }
    });
}, null, true, 'Asia/Kolkata');
job.start();

let storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, DIR);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let upload = multer({ storage: storage });
//app.use(upload.array()); 

// jwt secret key
process.env.SECRET_KEY = "FersEP33MI1kJMzTWs9kz1fxJ6Jrn8fRjUts9T6Zim8CM3bZ3WBDSw4MunDXLWtz";

// middleware for check jwt token
function authenticateToken(req, res, next) {
    var token = req.body.usertoken || req.headers['usertoken'];
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function(err, ress) {
            if (err) {
                // res.status(500).send('Token Invalid');
                res.json({
                    status: false,
                    status_code: 500,
                    message: 'User Token Invalid.'
                });
            } else {
                next();
            }
        })
    } else {
        res.json({
            status: false,
            status_code: 201,
            message: 'User Token is required.'
        });
    }
}

function basicAuthenticateToken(req, res, next) {
    var token = req.body.authenticatetoken || req.headers['authenticatetoken'];
    if (token) {

        var originalString = 'qgP5yrgtM231O7u65k5oPGE8BiBGluVQJizg9JfIvvig3iMzAe';
        let bufferObj = Buffer.from(token, "base64");
        let base64String = bufferObj.toString("utf8");

        if (originalString != base64String) {
            res.json({
                status: false,
                status_code: 500,
                message: 'Token Invalid.'
            });
        } else {
            next();
        }
    } else {
        res.json({
            status: false,
            status_code: 201,
            message: 'Basic authenticate token is required.'
        });
    }
}

// controllers
var loginController = require('./controllers/logincontroller');
var registerController = require('./controllers/registercontroller');
var userController = require('./controllers/usercontroller');
var adminusercontroller = require('./controllers/adminusercontroller');
var adminprofilecontroller = require('./controllers/adminprofilecontroller');
var cmscontroller = require('./controllers/cmscontroller');
var supportmailcontroller = require('./controllers/supportmailcontroller');
var admin_usercontroller = require('./controllers/admin/usercontroller');
var resetController = require('./controllers/resetController');

/* Basic Authnticated routes start without login  */

app.post('/api/login', [upload.none(), basicAuthenticateToken], loginController.login);
app.post('/api/social_login', [upload.none(), basicAuthenticateToken], loginController.social_login);
app.post('/api/auto_login', [upload.none(), basicAuthenticateToken], loginController.auto_login);
app.post('/api/register', upload.single('image'), registerController.register);
app.post('/api/register_verification', [upload.none(), basicAuthenticateToken], registerController.register_verification);
app.post('/api/resend_otp', [upload.none(), basicAuthenticateToken], registerController.resend_otp);
app.post('/api/forgot_pwd', [upload.none(), basicAuthenticateToken], resetController.forgot_pwd);
app.post('/api/forgot_pwd_post', [upload.none(), basicAuthenticateToken], resetController.forgot_pwd_post);
app.post('/api/check_otp', [upload.none(), basicAuthenticateToken], resetController.check_password_otp);
app.post('/api/cms_page', cmscontroller.cms_page);

var webhookcontroller = require('./controllers/webhookcontroller');
app.post('/api/webhook/call', webhookcontroller.update_account_status);
app.post('/api/appointment/expire/status', webhookcontroller.update_appointment_status);
app.post('/api/webhook/update_subscription_data', webhookcontroller.update_subscription_data);

/* Basic Authnticated routes End without login  */

app.post('/api/get_user', [upload.none(), basicAuthenticateToken, authenticateToken], userController.getByToken);
app.post('/api/user/change_password', [upload.none(), basicAuthenticateToken, authenticateToken], userController.change_password);
app.post('/api/user/change_password', [upload.none(), basicAuthenticateToken, authenticateToken], userController.change_password);

// routes
app.post('/api/add_device_token', [upload.none(), basicAuthenticateToken, authenticateToken], loginController.add_device_token);

app.post('/api/login_admin', loginController.login_admin);
app.post('/api/forgot_password', loginController.forgot_password);
app.post('/api/check_forgot_password_token', loginController.check_forgot_password_token);
app.post('/api/forgot_password_post', loginController.forgot_password_post);

app.post('/api/logout', authenticateToken, loginController.logout);

app.post('/api/cms', cmscontroller.getBySlug);
app.post('/api/send_support_mail', supportmailcontroller.send_support_mail);

// admin APIS controller
app.post('/api/admin/find_by_email', adminusercontroller.find_by_email);
app.post('/api/admin/find_by_id', adminusercontroller.find_by_id);
app.post('/api/admin/forgot_password_post', adminusercontroller.forgot_password_post);
app.post('/api/admin/profile_update', upload.single('image'), adminprofilecontroller.profile_update);

app.post('/api/admin/check_old_password', adminusercontroller.check_old_password);
app.post('/api/admin/change_password', adminusercontroller.change_password_post);

// admin users controller route
app.post('/api/admin/user/get', admin_usercontroller.get);
app.post('/api/admin/user/view', admin_usercontroller.view);
app.post('/api/admin/user/update', admin_usercontroller.update);
app.post('/api/admin/user/delete', admin_usercontroller.delete);
app.post('/api/admin/user/create', admin_usercontroller.create);

// stylist routes
var stylistcontroller = require('./controllers/admin/stylistcontroller');
var stylist_common_path = '/api/admin/stylist/';

app.post(stylist_common_path + 'get', stylistcontroller.get);
app.post(stylist_common_path + 'view', stylistcontroller.view);
app.post(stylist_common_path + 'update', stylistcontroller.update);
app.post(stylist_common_path + 'delete', stylistcontroller.delete);
app.post(stylist_common_path + 'create', stylistcontroller.create);

//Client routes
var clientcontroller = require('./controllers/admin/clientcontroller');
var client_common_path = '/api/admin/client/';

app.post(client_common_path + 'get', clientcontroller.get);
app.post(client_common_path + 'view', clientcontroller.view);
app.post(client_common_path + 'update', clientcontroller.update);
app.post(client_common_path + 'delete', clientcontroller.delete);
app.post(client_common_path + 'create', clientcontroller.create);

// Settings page routes
var adminsettingscontroller = require('./controllers/admin/settingscontroller');
app.post('/api/admin/settings', adminsettingscontroller.support_details);
app.post('/api/admin/settings/post', adminsettingscontroller.update_support_details);

//CMS Page routes
var cmscontroller = require('./controllers/admin/cmscontroller');
var cms_common_path = '/api/admin/cms/';

app.post(cms_common_path + 'get_page', cmscontroller.get_page);
app.post(cms_common_path + 'view_page', cmscontroller.view_page);
app.post(cms_common_path + 'update_page', cmscontroller.update_page);
app.post(cms_common_path + 'delete_page', cmscontroller.delete_page);
app.post(cms_common_path + 'create_page', cmscontroller.create_page);

//Service routes
var servicecontroller = require('./controllers/admin/servicecontroller');
var service_path = '/api/admin/service/';

app.post(service_path + 'get', servicecontroller.get);
app.post(service_path + 'create', servicecontroller.create);
app.post(service_path + 'find_by_id', servicecontroller.find_by_id);
app.post(service_path + 'update', servicecontroller.update);
app.post(service_path + 'delete', servicecontroller.delete);

// Appointment Modules
var admin_appointment = require('./controllers/admin/appointmentcontroller');
var admin_appointment_path = '/api/admin/appointment/';
app.post(admin_appointment_path + 'list', admin_appointment.list);
app.post(admin_appointment_path + 'detail', admin_appointment.find_by_id);

// Payment History routes
var paymenthistorycontroller = require('./controllers/admin/paymenthistorycontroller');
var history_path = '/api/admin/payment-history';

app.post(history_path, paymenthistorycontroller.list);
app.post(history_path + '/view', paymenthistorycontroller.find_by_id);

// Subscription Amount routes
var subscriptioncontroller = require('./controllers/admin/subscriptioncontroller');
var subscription_path = '/api/admin/subscription';

app.post(subscription_path, subscriptioncontroller.view);
app.post(subscription_path + '/update', subscriptioncontroller.update);

var commission_path = '/api/admin/commission';
app.post(commission_path, subscriptioncontroller.view_commission);
app.post(commission_path + '/update', subscriptioncontroller.update_commission);

// Subscription Amount routes
var trackcontroller = require('./controllers/admin/trackappointmentcontroller');
var track_path = '/api/admin/track_appointment';

app.post(track_path, trackcontroller.index);
app.post(track_path + '/detail', trackcontroller.detail);

// Subscription Amount routes
var stripecontroller = require('./controllers/admin/stripecontroller');
var stripe_path = '/api/admin/stripe';

app.post(stripe_path + '/create_product', stripecontroller.create_product);

// app.post('/api/getByUserId',userController.getByUserId);

// Subscription history routes
var sub_historycontroller = require('./controllers/admin/subscriptionhistorycontroller');
var sub_history_path = '/api/admin/subscription-history';

app.post(sub_history_path, sub_historycontroller.index);
app.post(sub_history_path + '/detail', sub_historycontroller.view);

// Subscription history routes
var subscribedcontroller = require('./controllers/admin/subscribeduserscontroller');
var subscribed_path = '/api/admin/subscribed';

app.post(subscribed_path, subscribedcontroller.index);
app.post(subscribed_path + '/detail', subscribedcontroller.view);
app.post(subscribed_path + '/unsubscribe_user', subscribedcontroller.unsubscribe_user);

// Transfer money to stylist account route
var banktransfercontroller = require('./controllers/admin/banktransfercontroller');
var banktransfer_path = '/api/admin/payment/transfer';

app.post(banktransfer_path, banktransfercontroller.transfer_money);

/* ************************ Card App APIs Start *********************** */

var cardcontroller = require('./controllers/cardcontroller');
var card_api_path = '/api/user/card/';

app.post(card_api_path + 'add', [upload.none(), basicAuthenticateToken, authenticateToken], cardcontroller.add_card_detail);
app.post(card_api_path + 'delete', [upload.none(), basicAuthenticateToken, authenticateToken], cardcontroller.delete_card_detail);
app.post(card_api_path + 'list', [upload.none(), basicAuthenticateToken, authenticateToken], cardcontroller.card_list);

/* ************************ Card App APIs End *********************** */

/* ************************ Stylist App APIs Start *********************** */

var stylist_appointment = require('./controllers/stylist/appointmentcontroller');
var stylist_api_common_path = '/api/stylist/';

app.post(stylist_api_common_path + 'appointment/create', [upload.none(), basicAuthenticateToken, authenticateToken], stylist_appointment.add_appointment);
app.post(stylist_api_common_path + 'appointment/detail', [upload.none(), basicAuthenticateToken, authenticateToken], stylist_appointment.find_by_id);
app.post(stylist_api_common_path + 'appointment/update', [upload.none(), basicAuthenticateToken, authenticateToken], stylist_appointment.update_appointment);
app.post(stylist_api_common_path + 'appointment/delete', [upload.none(), basicAuthenticateToken, authenticateToken], stylist_appointment.delete_appointment);
app.post(stylist_api_common_path + 'appointment/list', [upload.none(), basicAuthenticateToken, authenticateToken], stylist_appointment.appointment_list);
app.post(stylist_api_common_path + 'appointment/booked', [upload.none(), basicAuthenticateToken, authenticateToken], stylist_appointment.booked_appointment_list);
app.post(stylist_api_common_path + 'appointment/complete', [upload.none(), basicAuthenticateToken, authenticateToken], stylist_appointment.complete_appointment);
app.post(stylist_api_common_path + 'appointment/history', [upload.none(), basicAuthenticateToken, authenticateToken], stylist_appointment.history);

var stylist_profile = require('./controllers/stylist/profilecontroller');
var stylist_profile_path = '/api/stylist/';
app.post(stylist_profile_path + 'profile_update', [upload.single('image'), basicAuthenticateToken, authenticateToken], stylist_profile.edit_profile);
app.post(stylist_profile_path + 'update_company_detail', [upload.none(), basicAuthenticateToken, authenticateToken], stylist_profile.edit_company_detail);

var bank_account = require('./controllers/stylist/bankaccountcontroller');
var bank_account_path = '/api/stylist/';
app.post(bank_account_path + 'bank/account-add', [upload.none(), basicAuthenticateToken, authenticateToken], bank_account.addBankAccount);
app.post(bank_account_path + 'bank/account-varify', [upload.none(), basicAuthenticateToken, authenticateToken], bank_account.verifyBankAccount);
app.post(bank_account_path + 'subscription-detail', [upload.none(), basicAuthenticateToken, authenticateToken], bank_account.subscriptionAmountDetail);
app.post(bank_account_path + 'subscribe', [upload.none(), basicAuthenticateToken, authenticateToken], bank_account.subscribeStylist);
app.post(bank_account_path + 'unsubscribe', [upload.none(), basicAuthenticateToken, authenticateToken], bank_account.unsubscribe_user);
app.post(bank_account_path + 'stripe/upload_document', [upload.any(), basicAuthenticateToken, authenticateToken], bank_account.upload_document);

/* ************************ Stylist App APIs End *********************** */

/* ************************ Client App APIs Start *********************** */

var followcontroller = require('./controllers/client/followcontroller');
var client_follow = '/api/client/';

app.post(client_follow + 'follow', [upload.none(), basicAuthenticateToken, authenticateToken], followcontroller.follow);
app.post(client_follow + 'unfollow', [upload.none(), basicAuthenticateToken, authenticateToken], followcontroller.unfollow);
app.post(client_follow + 'following_list', [upload.none(), basicAuthenticateToken, authenticateToken], followcontroller.follow_list);
app.post(client_follow + 'stylist_list', [upload.none(), basicAuthenticateToken, authenticateToken], followcontroller.stylist_list);

/* *******************APPOINTMENT ROUTES START******************* */
var client_appointment = require('./controllers/client/appointmentcontroller');
var client_api_common_path = '/api/client/';

app.post(client_api_common_path + 'appointment/detail', [upload.none(), basicAuthenticateToken, authenticateToken], client_appointment.find_by_id);
app.post(client_api_common_path + 'appointment/list', [upload.none(), basicAuthenticateToken, authenticateToken], client_appointment.appointment_list);
app.post(client_api_common_path + 'appointment/history', [upload.none(), basicAuthenticateToken, authenticateToken], client_appointment.appointment_history);
app.post(client_api_common_path + 'appointment/booked', [upload.none(), basicAuthenticateToken, authenticateToken], client_appointment.book_appointment);
app.post(client_api_common_path + 'appointment/my_appointments', [upload.none(), basicAuthenticateToken, authenticateToken], client_appointment.my_appointments);

/* *******************APPOINTMENT ROUTES END******************* */

var citystatecontroller = require('./controllers/statecitycontroller');
app.post('/api/state/list', [upload.none(), basicAuthenticateToken], citystatecontroller.state_list);
app.post('/api/city/list', [upload.none(), basicAuthenticateToken], citystatecontroller.city_list_as_per_state);

var settingscontroller = require('./controllers/settingscontroller');
app.post('/api/settings', [upload.none(), basicAuthenticateToken], settingscontroller.support_details);

/* ************************ Client App APIs End *********************** */

module.exports = app;