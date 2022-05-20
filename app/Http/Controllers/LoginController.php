<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Auth;

class LoginController extends Controller
{
    public function login()
    {
        return view('login');
    }

    public function login_post(Request $request)
    {
        $data = ['email' => $request->email, 'password' => $request->password];
        $response = node_response($data,'api/login_admin');

        if($response->status_code == 200){
            
            $email = $request->email;
            $pass = $request->password;

            Auth::attempt(array('email' => $email, 'password' => $pass));
            
            $message = 'You are successfully logged in';
            return redirect()->route('admin.dashboard')->with('success',$message);

        } else {
            $message = $response->message;
            return redirect()->back()->with('danger',$message);
        }
    }
}
