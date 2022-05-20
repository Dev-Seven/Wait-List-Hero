<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class ClientController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $response = node_response([],'api/admin/client/get');
        $data = $response->data;
        return view('admin.client.index',compact('data'));
    }

    public function create()
    {
        return view('admin.client.create');
    }

    public function view($id)
    {
        $response = node_response(['id' => $id],'api/admin/client/view');
        $data = $response->data[0];
        return view('admin.client.view',compact('data'));
    }

    public function store(Request $request){

        $data = ['first_name' => $request->first_name, 'last_name' => $request->last_name, 'status' => $request->status, 'email' => $request->email, 'password' => $request->password, 'phone' => $request->phone];

        $response = node_response($data,'api/admin/client/create');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.client.index')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->back()->with('danger',$message);
        }
    }

    public function edit($id)
    {
        $response = node_response(['id' => $id],'api/admin/client/view');
        $data = $response->data[0];
        return view('admin.client.edit',compact('data'));
    }

    public function delete($id)
    {
        $response = node_response(['id' => $id],'api/admin/client/delete');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.client.index')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->route('admin.client.index')->with('danger',$message);
        }
    }

    public function update(Request $request){

        $data = ['first_name' => $request->first_name, 'last_name' => $request->last_name, 'status' => $request->status, 'phone' => $request->phone, 'password' => $request->password, 'id' => $request->id];

        $response = node_response($data,'api/admin/client/update');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.client.index')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->back()->with('danger',$message);
        }
    }
}
