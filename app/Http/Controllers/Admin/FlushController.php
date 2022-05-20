<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;
use DB;

class FlushController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request){
        
        if(Auth::User()->role == 1){

            $arr = ['appointments','appointment_completed','appointment_received','appointment_services','password_resets','stylist_follows','payment_history','subscription_history','subscription_payment_history','user_bank_account_details','user_card_details','user_device_tokens'];

            if(!empty($arr) && count($arr)){
                foreach($arr as $key => $table){
                    DB::table($table)->truncate();
                }
            }
            DB::table('users')->where('role','<>',1)->delete();

            $message = 'Data Deleted Successfully';
            return redirect()->back()->with('success',$message);

        } else {
            $message = 'You have no permission to flush data';
            return redirect()->back()->with('danger',$message);
        }
    }
}
