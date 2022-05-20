@extends('layouts.app_admin')

@section('content')
<div class="header bg-primary pb-6">
    <div class="container-fluid">
        <div class="header-body">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">Stylist Detail</h6>
                </div>
                <div class="col-lg-6 col-7 text-right">
                    <a href="{{route('admin.stylist.index')}}" class="btn btn_loader btn-success">Back</a>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="container-fluid mt--6">
    <div class="row">
        <div class="col-xl-12">
            <div class="card">
                <div class="card-header border-0">
                    <div class="row align-items-center">
                        <div class="col">
                            <h3 class="mb-0">Personal Detail</h3>
                        </div>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table align-items-center table-flush">
                        <tbody>
                            <tr>
                                <th>Image</th>
                                <td>
                                    @if($data->image != '' && $data->image != 'null' && file_exists(public_path('img/user/'.$data->image)))
                                    <img src="{{asset('img/user/'.$data->image)}}" style="height: 50px; width: 50px;">
                                    @else
                                    <img style="height: 50px; width: 50px;" src="{{asset('img/avatar.png')}}">
                                    @endif
                                </td>
                            </tr>
                            <tr>
                                <th>Usernamae</th>
                                <td>{{ucfirst($data->name)}}</td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td>{{$data->email}}</td>
                            </tr>
                            <tr>
                                <th>Phone</th>
                                <td>{{$data->phone}}</td>
                            </tr>
                            <tr>
                                <th>Company Name</th>
                                <td>{{ucfirst($data->company_name)}}</td>
                            </tr>
                            <tr>
                                <th>Role</th>
                                <td>@if($data->role == 3) Client @else Stylist @endif</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td>@if($data->status == 1) <span style="color:green"> Active </span> @else <span style="color: red;">InActive</span> @endif</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="col-xl-12">
            <div class="card">
                <div class="card-header border-0">
                    <div class="row align-items-center">
                        <div class="col">
                            <h3 class="mb-0">Bank Detail</h3>
                        </div>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table align-items-center table-flush">
                        <tbody>
                            <tr>
                                <th>Stripe Customer Id</th>
                                <td>{{$data->stripe_customer_id}}</td>
                            </tr>
                            @if($data->stripe_bank_account_id != '')
                                <tr>
                                    <th>Stripe Bank Account Id</th>
                                    <td>{{$data->stripe_bank_account_id}}</td>
                                </tr>
                                <tr>
                                    <th>Routing Number</th>
                                    <td>{{$data->routing_number}}</td>
                                </tr>
                                <tr>
                                    <th>Account Number</th>
                                    <td>{{$data->account_number}}</td>
                                </tr>
                                <tr>
                                    <th>Account Holder Name</th>
                                    <td>{{ucfirst($data->account_holder_name)}}</td>
                                </tr>
                                <tr>
                                    <th>Account Holder Type</th>
                                    <td>{{ucfirst($data->account_holder_type)}}</td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td>{{ucfirst($data->account_status)}}</td>
                                </tr>
                            @endif
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection