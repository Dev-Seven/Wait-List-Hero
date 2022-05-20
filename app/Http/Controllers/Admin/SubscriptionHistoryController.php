<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class SubscriptionHistoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $response = node_response([],'api/admin/subscription-history');
        $data = $response->data;

        return view('admin.subscription_history.index',compact('data'));
    }

    public function detail($id)
    {
        $data = ['id' => $id];
        $response = node_response($data,'api/admin/subscription-history/detail');
        $data = $response->data;

        return view('admin.subscription_history.view',compact('data'));
    }
}
