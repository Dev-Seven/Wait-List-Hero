<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WebhookController extends Controller
{
    public function update_account_status(Request $request)
    {
        $data = $request->all();
        $response = node_response($data,'api/webhook/call');
    }

    public function update_subscription_data(Request $request)
    {
        $data = $request->all();
        $response = node_response($data,'api/webhook/update_subscription_data');
    }
}
