<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class AppointmentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $response = node_response([],'api/admin/appointment/list');
        $data = $response->data;

        return view('admin.appointment.index',compact('data'));
    }

    public function detail($id)
    {
        $response = node_response(['id' => $id],'api/admin/appointment/detail');
        $data = $response->data[0];
        return view('admin.appointment.view',compact('data'));
    }
}
