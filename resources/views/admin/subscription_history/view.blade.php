@extends('layouts.app_admin')
@section('content')
<div class="header bg-primary pb-6">
    <div class="container-fluid">
        <div class="header-body">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">Subscription Detail</h6>
                </div>
                <div class="col-lg-6 col-7 text-right">
                    <a href="{{route('admin.sub_history.index')}}" class="btn btn_loader btn-success">Back</a>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Page content -->
<div class="container-fluid mt--6">
    <div class="row">
        <div class="col-xl-12">
            <div class="card">
                <div class="card-header border-0">
                    <div class="row align-items-center">
                        <div class="col">
                            <h3 class="mb-0">Subscription Detail</h3>
                        </div>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table align-items-center table-flush">
                        <tbody>
                            <tr>
                                <th>Stylist Detail</th>
                                <td>
                                    <strong>Name :</strong> {{ucfirst($data->username)}}
                                    <br>
                                    <strong>Email :</strong> <a href="mailto:{{$data->user_email}}">{{$data->user_email}}</a>
                                    <br>
                                    <strong>Phone :</strong> <a href="tel:{{$data->user_phone}}">{{$data->user_phone}}</a>
                                </td>
                            </tr>
                            <tr>
                                <th>Subscription Id</th>
                                <td>{{$data->subscription_id}}</td>
                            </tr>
                            <tr>
                                <th>Invoice Id</th>
                                <td>{{$data->latest_invoice}}</td>
                            </tr>
                            <tr>
                                <th>Object</th>
                                <td>{{$data->object}}</td>
                            </tr>
                            <tr>
                                <th>Collection Method</th>
                                <td>{{$data->collection_method}}</td>
                            </tr>
                            <tr>
                                <th>Start Subscription</th>
                                <td>{{date('d F Y',$data->current_period_start)}}</td>
                            </tr>
                            <tr>
                                <th>End Subscription</th>
                                <td>{{date('d F Y',$data->current_period_end)}}</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                @if($data->status == 'active')
                                <td style="color: green;">{{ucfirst($data->status)}}</td>
                                @else
                                <td style="color: red;">{{ucfirst($data->status)}}</td>
                                @endif
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection