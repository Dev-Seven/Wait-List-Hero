<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class ProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function change_password()
    {
        return view('admin.change_password');
    }

    public function old_password_check(Request $request)
    {
        $user_id = Auth::User()->id;
        $data = ['user_id' => $user_id, 'password' => $request->password];
        $response = node_response($data,'api/admin/check_old_password');

        if($response->status_code != 200){
            return 'false';
        } else {
            return 'true';
        }
    }

    public function change_password_post(Request $request)
    {
        $user_id = Auth::User()->id;
        $old_password = $request->current_password;
        $password = $request->new_password;

        $data = ['user_id' => $user_id, 'old_password' => $old_password, 'password' => $password];
        $response = node_response($data,'api/admin/change_password');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.dashboard')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->back()->with('danger',$message);
        }
    }

    public function profile()
    {
        $user_id = Auth::User()->id;
        $data = ['id' => $user_id];
        $response = node_response($data,'api/admin/find_by_id');
        $user = $response->data;
        return view('admin.profile',compact('user'));
    }

    public function profile_update(Request $request)
    {   
        $user_id = Auth::User()->id;

        $data = ['user_id' => $user_id, 
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'company_name' => $request->company_name,
                'phone_number' => $request->phone,
                // 'image' => $_FILES['image']
            ];

        $response = node_response($data,'api/admin/profile_update');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.dashboard')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->back()->with('danger',$message);
        }
    }
}
