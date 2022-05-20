<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class TrackAppointmentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $response = node_response([],'api/admin/track_appointment');
        $data = $response->data;

        return view('admin.track_appointment.index',compact('data'));
    }

    public function detail($id)
    {
        $response = node_response(['id' => $id],'api/admin/track_appointment/detail');
        $data = $response->data[0];

        $commission_response = node_response([],'api/admin/commission');
        $commission_data = $commission_response->data[0];

        $stylist_actual_price = 0;
        $commission_price = $commission_data->amount;
        $commission_price = number_format((float)$commission_price, 2, '.', '');
        $stylist_actual_price = $data->amount - $commission_price;
        $stylist_actual_price = number_format((float)$stylist_actual_price, 2, '.', '');

        return view('admin.track_appointment.view',compact('data','commission_price','stylist_actual_price','commission_data'));
    }
}
