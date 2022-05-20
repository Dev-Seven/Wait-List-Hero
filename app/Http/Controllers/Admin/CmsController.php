<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class CmsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $response = node_response([],'api/admin/cms/get_page');
        $data = $response->data;
        return view('admin.cms.index',compact('data'));
    }

    public function create()
    {
        return view('admin.cms.create');
    }

    public function view($id)
    {
        $response = node_response(['id' => $id],'api/admin/cms/view_page');
        $data = $response->data[0];
        return view('admin.cms.view',compact('data'));
    }

    public function store(Request $request){
        
        $slug = str_replace(' ', '_', $request->title);
        $slug = strtolower($slug);

        $data = ['title' => $request->title, 'description' => $request->description, 'status' => $request->status, 'slug' => $slug];

        $response = node_response($data,'api/admin/cms/create_page');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.cms.index')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->back()->with('danger',$message);
        }
    }

    public function edit($id)
    {
        $response = node_response(['id' => $id],'api/admin/cms/view_page');
        $data = $response->data[0];
        return view('admin.cms.edit',compact('data'));
    }

    public function delete($id)
    {
        $response = node_response(['id' => $id],'api/admin/cms/delete_page');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.cms.index')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->route('admin.cms.index')->with('danger',$message);
        }
    }

    public function update(Request $request){

        $data = ['title' => $request->title, 'description' => $request->description, 'status' => $request->status, 'id' => $request->id];

        $response = node_response($data,'api/admin/cms/update_page');

        if($response->status_code == 200){
            $message = $response->message;
            return redirect()->route('admin.cms.index')->with('success',$message);
        } else {
            $message = $response->message;
            return redirect()->back()->with('danger',$message);
        }
    }
}
