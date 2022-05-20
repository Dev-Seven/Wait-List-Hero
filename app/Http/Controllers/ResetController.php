<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Auth;

class ResetController extends Controller
{
    public function forgot_password()
    {
        return view('forgot_password');
    }

    public function forgot_password_post(Request $request)
    {
        $data = ['email' => $request->email];
        $response = node_response($data,'api/forgot_password');

        if($response->status_code == 200){
            
            $message = 'Check your inbox for reset link';
            return redirect()->back()->with('success',$message);

        } else {
            $message = $response->message;
            return redirect()->back()->with('danger',$message);
        }
    }

    public function reset_password($token)
    {
        $data = ['token' => $token];
        $response_token = node_response($data,'api/check_forgot_password_token');

        if($response_token->status_code == 200){

            $email = $response_token->data[0]->email;
            $data_user = ['email' => $email];
            $response_token = node_response($data_user,'api/admin/find_by_email');            

            $user = $response_token->data;
            return view('reset_password',compact('user'));
        } else {
            $message = $response_token->message;
            return redirect()->route('login')->with('danger',$message);
        }
    }

    public function reset_password_post(Request $request)
    {
        $data = ['email' => $request->email, 'password' => $request->password];
        $response = node_response($data,'api/forgot_password_post');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('login')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->route('login')->with('danger',$message);
        }
    }
}
