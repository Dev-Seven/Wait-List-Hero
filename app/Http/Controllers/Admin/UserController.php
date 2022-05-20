<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $id = Auth::User()->id;
        $check_auth = node_response(['id' => $id],'api/admin/user/view');
        $auth_data = $check_auth->data[0];

        if($auth_data->role != 1){
            $message = 'You have no permission for that section';
            return redirect()->back()->with('danger',$message);
        }

        $response = node_response([],'api/admin/user/get');
        $data = $response->data;
        return view('admin.user.index',compact('data'));
    }

    public function create()
    {
        $id = Auth::User()->id;
        $check_auth = node_response(['id' => $id],'api/admin/user/view');
        $auth_data = $check_auth->data[0];

        if($auth_data->role != 1){
            $message = 'You have no permission for that section';
            return redirect()->back()->with('danger',$message);
        }
        return view('admin.user.create');
    }

    public function view($id)
    {
        $auth_id = Auth::User()->id;
        $check_auth = node_response(['id' => $auth_id],'api/admin/user/view');
        $auth_data = $check_auth->data[0];

        if($auth_data->role != 1){
            $message = 'You have no permission for that section';
            return redirect()->back()->with('danger',$message);
        }
        $response = node_response(['id' => $id],'api/admin/user/view');
        $data = $response->data[0];
        return view('admin.user.view',compact('data'));
    }

    public function store(Request $request){

        $id = Auth::User()->id;
        $check_auth = node_response(['id' => $id],'api/admin/user/view');
        $auth_data = $check_auth->data[0];

        if($auth_data->role != 1){
            $message = 'You have no permission for that section';
            return redirect()->back()->with('danger',$message);
        }

        $data = ['first_name' => $request->first_name, 'last_name' => $request->last_name, 'status' => $request->status, 'email' => $request->email, 'password' => $request->password, 'phone' => $request->phone];

        $response = node_response($data,'api/admin/user/create');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.user.index')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->back()->with('danger',$message);
        }
    }

    public function edit($id)
    {
        $auth_id = Auth::User()->id;
        $check_auth = node_response(['id' => $auth_id],'api/admin/user/view');
        $auth_data = $check_auth->data[0];

        if($auth_data->role != 1){
            $message = 'You have no permission for that section';
            return redirect()->back()->with('danger',$message);
        }
        $response = node_response(['id' => $id],'api/admin/user/view');
        $data = $response->data[0];
        return view('admin.user.edit',compact('data'));
    }

    public function delete($id)
    {
        $auth_id = Auth::User()->id;
        $check_auth = node_response(['id' => $auth_id],'api/admin/user/view');
        $auth_data = $check_auth->data[0];

        if($auth_data->role != 1){
            $message = 'You have no permission for that section';
            return redirect()->back()->with('danger',$message);
        }
        $response = node_response(['id' => $id],'api/admin/user/delete');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.user.index')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->route('admin.user.index')->with('danger',$message);
        }
    }

    public function update(Request $request){

        $id = Auth::User()->id;
        $check_auth = node_response(['id' => $id],'api/admin/user/view');
        $auth_data = $check_auth->data[0];

        if($auth_data->role != 1){
            $message = 'You have no permission for that section';
            return redirect()->back()->with('danger',$message);
        }

        if($auth_data->role == 1){
            $status = 1;
        } else {
            $status = $request->status;
        }

        $data = ['first_name' => $request->first_name, 'last_name' => $request->last_name, 'status' => $status, 'phone' => $request->phone,'id' => $request->id];

        $response = node_response($data,'api/admin/user/update');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.user.index')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->back()->with('danger',$message);
        }
    }

    public function check_email(Request $request)
    {
        $data = ['email' => $request->email];

        $response = node_response($data,'api/admin/find_by_email');

        if($response->status_code == 200){
            return "false";
        } else {
            return "true";
        }
    }
}
