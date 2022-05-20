<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class SubscriptionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $response = node_response([],'api/admin/subscription');
        $data = $response->data[0];
        return view('admin.subscription_view',compact('data'));
    }

    public function update(Request $request)
    {
        $data = ['amount' => $request->amount];
        $response = node_response($data,'api/admin/subscription/update');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.dashboard')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->back()->with('danger',$message);
        }
    }


    public function index_commission(Request $request)
    {
        $response = node_response([],'api/admin/commission');
        $data = $response->data[0];
        return view('admin.commission_view',compact('data'));
    }

    public function update_commission(Request $request)
    {
        $data = ['amount' => $request->amount, 'old_amount' => $request->old_amount];
        $response = node_response($data,'api/admin/commission/update');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.dashboard')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->back()->with('danger',$message);
        }
    }
}
