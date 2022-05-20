<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class StripeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function create_product_plan()
    {
        if(Auth::User()->role == 1){
            $response = node_response([],'api/admin/stripe/create_product');
            echo "<pre>";
            print_r($response);
            echo "</pre>";
            exit;
        } else {
            return redirect()->back();
        }
    }
}
