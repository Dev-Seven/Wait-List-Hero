<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class SubscribedController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $response = node_response([],'api/admin/subscribed');
        $data = $response->data;

        return view('admin.subscribed_user.index',compact('data'));
    }

    public function detail($id)
    {
        $data = ['id' => $id];
        $response = node_response($data,'api/admin/subscribed/detail');
        $data = $response->data;

        return view('admin.subscribed_user.view',compact('data'));
    }

    public function unsubscribe(Request $request)
    {
        $data = ['id' => $request->id];
        $response = node_response($data,'api/admin/subscribed/unsubscribe_user');
            
        if($response->status_code != 200){
            $message = $response->message;
            return redirect()->back()->with('danger',$message);
        } else {
            $message = 'Stylist unsubscribed successfully!';
            return redirect()->back()->with('success',$message);
        }
    }
}
