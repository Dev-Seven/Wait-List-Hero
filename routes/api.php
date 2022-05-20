<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::match(['get','post'],'webhook/update_account_status', 'WebhookController@update_account_status');
Route::match(['get','post'],'webhook/update_subscription_data', 'WebhookController@update_subscription_data');

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
