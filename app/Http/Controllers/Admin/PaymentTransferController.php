<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class PaymentTransferController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function create_stylist_payment(Request $request)
    {
        $arr = ['appointment_id' => $request->appointment_id, 'stylist_id' => $request->stylist_id];

        $response = node_response($arr,'api/admin/payment/transfer');

        if($response->status_code == 500){
            return redirect()->back()->with('danger',$response->message);
        } else {
            return redirect()->back()->with('success',$response->message);
        }
    }
}
