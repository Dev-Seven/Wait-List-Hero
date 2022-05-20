<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class ServiceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $response = node_response([],'api/admin/service/get');
        $data = $response->data;
        return view('admin.service.index',compact('data'));
    }

    public function create()
    {
        return view('admin.service.create');
    }

    public function store(Request $request){
        
        $data = ['name' => $request->name, 'status' => $request->status];

        $response = node_response($data,'api/admin/service/create');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.service.index')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->back()->with('danger',$message);
        }
    }

    public function edit($id)
    {
        $response = node_response(['id' => $id],'api/admin/service/find_by_id');
        $data = $response->data[0];
        return view('admin.service.edit',compact('data'));
    }

    public function delete($id)
    {
        $response = node_response(['id' => $id],'api/admin/service/delete');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.service.index')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->route('admin.service.index')->with('danger',$message);
        }
    }

    public function update(Request $request){

        $data = ['name' => $request->name, 'status' => $request->status, 'id' => $request->id];

        $response = node_response($data,'api/admin/service/update');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.service.index')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->back()->with('danger',$message);
        }
    }
}
