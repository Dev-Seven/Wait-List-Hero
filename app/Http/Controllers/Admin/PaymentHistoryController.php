<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class PaymentHistoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $response = node_response([],'api/admin/payment-history');
        $data = $response->data;
        return view('admin.payment_history.index',compact('data'));
    }

    public function view($id)
    {
        $response = node_response(['id' => $id],'api/admin/payment-history/view');
        $data = $response->data[0];

        return view('admin.payment_history.view',compact('data'));
    }
}
