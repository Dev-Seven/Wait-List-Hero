<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class StylistController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $response = node_response([],'api/admin/stylist/get');
        $data = $response->data;
        return view('admin.stylist.index',compact('data'));
    }

    public function create()
    {
        return view('admin.stylist.create');
    }

    public function view($id)
    {
        $response = node_response(['id' => $id],'api/admin/stylist/view');
        $data = $response->data[0];
        return view('admin.stylist.view',compact('data'));
    }

    public function store(Request $request){

        $data = ['first_name' => $request->first_name, 'last_name' => $request->last_name, 'status' => $request->status, 'email' => $request->email, 'password' => $request->password, 'phone' => $request->phone, 'company_name' => $request->company_name];

        $response = node_response($data,'api/admin/stylist/create');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.stylist.index')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->back()->with('danger',$message);
        }
    }

    public function edit($id)
    {
        $response = node_response(['id' => $id],'api/admin/stylist/view');
        $data = $response->data[0];
        return view('admin.stylist.edit',compact('data'));
    }

    public function delete($id)
    {
        $response = node_response(['id' => $id],'api/admin/stylist/delete');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.stylist.index')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->route('admin.stylist.index')->with('danger',$message);
        }
    }

    public function update(Request $request){

        $data = ['first_name' => $request->first_name, 'last_name' => $request->last_name, 'status' => $request->status, 'phone' => $request->phone, 'company_name' => $request->company_name, 'id' => $request->id];

        $response = node_response($data,'api/admin/stylist/update');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.stylist.index')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->back()->with('danger',$message);
        }
    }
}
