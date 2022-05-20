<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
	//return redirect()->route('login');
    return view('welcome');
    //return view('login');
});

// Auth::routes();

// Route::get('/home', 'HomeController@index')->name('home');
// Route::get('/home_admin', 'HomeController@index_admin')->name('home.admin');


Route::group(['middleware' => 'guest'], function ($router) {

	Route::get('login', 'LoginController@login')->name('login');
	Route::post('login/post', 'LoginController@login_post')->name('admin.login.post');
	Route::get('password/forgot', 'ResetController@forgot_password')->name('forgot_password');
	Route::post('password/forgot/post', 'ResetController@forgot_password_post')->name('forgot.password.post');
	Route::get('password/reset/{token}', 'ResetController@reset_password')->name('password.reset_password');
	Route::post('password/post/reset', 'ResetController@reset_password_post')->name('password.reset_password.post');
});

Route::group(['middleware' => 'auth', 'namespace' => 'Admin', 'prefix' => 'admin'], function ($router) {

	Route::get('dashboard', 'DashboardController@dashboard')->name('admin.dashboard');
	Route::get('logout', 'DashboardController@logout')->name('admin.logout');
	Route::get('profile', 'ProfileController@profile')->name('admin.profile');
	Route::post('profile/update', 'ProfileController@profile_update')->name('admin.profile.update');
	Route::get('change-password', 'ProfileController@change_password')->name('admin.change_password');
	Route::get('check/old/password', 'ProfileController@old_password_check');
	Route::post('change/password/post', 'ProfileController@change_password_post')->name('admin.change_password.post');
	
	Route::get('flush/data', 'FlushController@index');

	Route::group(['prefix' => 'user'], function ($router) {
		Route::get('/', 'UserController@index')->name('admin.user.index');
		Route::get('/create', 'UserController@create')->name('admin.user.create');
		Route::post('/store', 'UserController@store')->name('admin.user.store');
		Route::get('/detail/{id}', 'UserController@view')->name('admin.user.view');
		Route::get('/edit/{id}', 'UserController@edit')->name('admin.user.edit');
		Route::post('/update', 'UserController@update')->name('admin.user.update');
		Route::get('/delete/{id}', 'UserController@delete')->name('admin.user.delete');
		Route::get('/check/email', 'UserController@check_email');
	});

	Route::group(['prefix' => 'stylist'], function ($router) {
		Route::get('/', 'StylistController@index')->name('admin.stylist.index');
		Route::get('/create', 'StylistController@create')->name('admin.stylist.create');
		Route::post('/store', 'StylistController@store')->name('admin.stylist.store');
		Route::get('/detail/{id}', 'StylistController@view')->name('admin.stylist.view');
		Route::get('/edit/{id}', 'StylistController@edit')->name('admin.stylist.edit');
		Route::post('/update', 'StylistController@update')->name('admin.stylist.update');
		Route::get('/delete/{id}', 'StylistController@delete')->name('admin.stylist.delete');
	});

	Route::group(['prefix' => 'client'], function ($router) {
		Route::get('/', 'ClientController@index')->name('admin.client.index');
		Route::get('/create', 'ClientController@create')->name('admin.client.create');
		Route::post('/store', 'ClientController@store')->name('admin.client.store');
		Route::get('/detail/{id}', 'ClientController@view')->name('admin.client.view');
		Route::get('/edit/{id}', 'ClientController@edit')->name('admin.client.edit');
		Route::post('/update', 'ClientController@update')->name('admin.client.update');
		Route::get('/delete/{id}', 'ClientController@delete')->name('admin.client.delete');
	});

	Route::group(['prefix' => 'cms'], function ($router) {
		Route::get('/', 'CmsController@index')->name('admin.cms.index');
		Route::get('/create', 'CmsController@create')->name('admin.cms.create');
		Route::post('/store', 'CmsController@store')->name('admin.cms.store');
		Route::get('/detail/{id}', 'CmsController@view')->name('admin.cms.view');
		Route::get('/edit/{id}', 'CmsController@edit')->name('admin.cms.edit');
		Route::post('/update', 'CmsController@update')->name('admin.cms.update');
		Route::get('/delete/{id}', 'CmsController@delete')->name('admin.cms.delete');
	});

	Route::group(['prefix' => 'service'], function ($router) {
		Route::get('/', 'ServiceController@index')->name('admin.service.index');
		Route::get('/create', 'ServiceController@create')->name('admin.service.create');
		Route::post('/store', 'ServiceController@store')->name('admin.service.store');
		Route::get('/edit/{id}', 'ServiceController@edit')->name('admin.service.edit');
		Route::post('/update', 'ServiceController@update')->name('admin.service.update');
		Route::get('/delete/{id}', 'ServiceController@delete')->name('admin.service.delete');
	});

	Route::group(['prefix' => 'appointment'], function ($router) {
		Route::get('/', 'AppointmentController@index')->name('admin.appointment.index');
		Route::get('/detail/{id}', 'AppointmentController@detail')->name('admin.appointment.detail');
	});

	Route::group(['prefix' => 'payment-history'], function ($router) {
		Route::get('/', 'PaymentHistoryController@index')->name('admin.payment.index');
		Route::get('/view/{id}', 'PaymentHistoryController@view')->name('admin.payment.view');
	});

	Route::group(['prefix' => 'subscription'], function ($router) {
		Route::get('/', 'SubscriptionController@index')->name('admin.subscription.index');
		Route::post('/update', 'SubscriptionController@update')->name('admin.subscription.update');
	});

	Route::group(['prefix' => 'commission'], function ($router) {
		Route::get('/', 'SubscriptionController@index_commission')->name('admin.commission.index');
		Route::post('/update', 'SubscriptionController@update_commission')->name('admin.commission.update');
	});

	Route::group(['prefix' => 'track-appointment'], function ($router) {
		Route::get('/', 'TrackAppointmentController@index')->name('admin.track_appointment.index');
		Route::get('/detail/{id}', 'TrackAppointmentController@detail')->name('admin.track_appointment.view');
	});

	Route::group(['prefix' => 'subscription-history'], function ($router) {
		Route::get('/', 'SubscriptionHistoryController@index')->name('admin.sub_history.index');
		Route::get('/detail/{id}', 'SubscriptionHistoryController@detail')->name('admin.sub_history.detail');
	});

	Route::group(['prefix' => 'subscribed-user'], function ($router) {
		Route::get('/', 'SubscribedController@index')->name('admin.subscribed.index');
		Route::get('/detail/{id}', 'SubscribedController@detail')->name('admin.subscribed.detail');
		Route::post('/unsubscribe', 'SubscribedController@unsubscribe')->name('admin.subscribed.unsubscribe');
	});

	Route::group(['prefix' => 'settings'], function ($router) {
		Route::get('/', 'SettingController@index')->name('admin.setting.index');
		Route::post('/', 'SettingController@store')->name('admin.settings.post');
	});

	Route::group(['prefix' => 'stripe'], function ($router) {
		Route::get('/create', 'StripeController@create_product_plan');
	});

	Route::group(['prefix' => 'payment'], function ($router) {
		Route::post('/transfer', 'PaymentTransferController@create_stylist_payment')->name('admin.payment.transfer');
	});
});