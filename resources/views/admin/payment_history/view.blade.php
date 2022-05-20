@extends('layouts.app_admin')
@section('content')
<div class="header bg-primary pb-6">
    <div class="container-fluid">
        <div class="header-body">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">Payment Detail</h6>
                </div>
                <div class="col-lg-6 col-7 text-right">
                    <a href="{{route('admin.payment.index')}}" class="btn btn_loader btn-success">Back</a>
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
                            <h3 class="mb-0">Payment Detail</h3>
                        </div>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table align-items-center table-flush">
                        <tbody>
                            <tr>
                                <th>Payment Id</th>
                                <td>{{$data->payment_id}}</td>
                            </tr>
                            <tr>
                                <th>Transaction Id</th>
                                <td>{{$data->balance_transaction}}</td>
                            </tr>
                            <tr>
                                <th>Amount</th>
                                <td>$ {{$data->amount}}</td>
                            </tr>
                            <tr>
                                <th>Description</th>
                                <td>{{$data->description}}</td>
                            </tr>
                            <tr>
                                <th>Receipt</th>
                                <td>
                                    <a target="_blank" href="{{$data->receipt_url}}">Click Here for receipt</a>
                                    <!-- <br>
                                    OR
                                    <br>
                                    <a target="_blank" href="{{$data->receipt_url}}">{{$data->receipt_url}}</a> -->
                                </td>
                            </tr>
                            <tr>
                                <th>Appointment Detail</th>
                                <td>
                                    <strong>Appointment Date :</strong> {{date("d F Y",strtotime($data->appointment[0]->date))}}
                                    <br>
                                    <strong>Start time - End time :</strong> {{date("H:i:s",strtotime($data->appointment[0]->start_time))}} - {{date("H:i:s",strtotime($data->appointment[0]->end_time))}}
                                    <br>
                                    <strong>Created date :</strong> {{date("d F Y H:i:s",strtotime($data->appointment[0]->created_at))}}
                                </td>
                            </tr>
                            <tr>
                                <th>Stylist Detail</th>
                                <td>
                                    <strong>Name :</strong> {{ucfirst($data->stylist[0]->name)}}
                                    <br>
                                    <strong>Email :</strong> <a href="mailto:{{$data->stylist[0]->email}}">{{$data->stylist[0]->email}}</a>
                                    <br>
                                    <strong>Phone :</strong> <a href="tel:{{$data->stylist[0]->phone}}">{{$data->stylist[0]->phone}}</a>
                                </td>
                            </tr>
                            @if(!empty($data->client) && count($data->client) > 0)
                            <tr>
                                <th>Client Detail</th>
                                <td>
                                    <strong>Name :</strong> {{ucfirst($data->client[0]->name)}}
                                    <br>
                                    <strong>Email :</strong> <a href="mailto:{{$data->client[0]->email}}">{{$data->client[0]->email}}</a>
                                    <br>
                                    <strong>Phone :</strong> <a href="tel:{{$data->client[0]->phone}}">{{$data->client[0]->phone}}</a>
                                </td>
                            </tr>
                            @endif
                            <tr>
                                <th>Status</th>
                                <td>{{ucfirst($data->status)}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection