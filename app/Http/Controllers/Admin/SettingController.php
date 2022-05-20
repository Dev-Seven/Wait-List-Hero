<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class SettingController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $response = node_response(['name' => 'facebook_link'],'api/admin/settings');
        $facebook_link = $response->data[0]->amount;

        $insta_res = node_response(['name' => 'instagram_link'],'api/admin/settings');
        $instagram_link = $insta_res->data[0]->amount;

        $res_mail = node_response(['name' => 'support_mail'],'api/admin/settings');
        $support_mail = $res_mail->data[0]->amount;

        $res_contact = node_response(['name' => 'support_contact'],'api/admin/settings');
        $support_contact = $res_contact->data[0]->amount;

        return view('admin.setting',compact('facebook_link','instagram_link','support_mail','support_contact'));
    }

    public function store(Request $request){

        $data = ['facebook_link' => $request->facebook_link, 'instagram_link' => $request->instagram_link, 'support_mail' => $request->support_mail, 'support_contact' => $request->support_contact];

        $response = node_response($data,'api/admin/settings/post');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->back()->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->back()->with('danger',$message);
        }
    }
}
