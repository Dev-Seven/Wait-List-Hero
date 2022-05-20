@extends('layouts.app_admin')

@section('content')
<div class="header bg-primary pb-6">
    <div class="container-fluid">
        <div class="header-body">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">Track Appointment Detail</h6>
                </div>
                <div class="col-lg-6 col-7 text-right">
                    <a href="{{route('admin.track_appointment.index')}}" class="btn btn_loader btn-success">Back</a>
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
                            <h3 class="mb-0">Appointment Detail</h3>
                        </div>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table align-items-center table-flush">
                        <tbody>
                            <tr>
                                <th>Stylist Detail</th>
                                <td>
                                    <strong>Name :</strong> {{ucfirst($data->stylist->name)}}
                                    <br>
                                    <strong>Email :</strong> <a href="mailto:{{$data->stylist->email}}">{{$data->stylist->email}}</a>
                                    <br>
                                    <strong>Phone :</strong> <a href="tel:{{$data->stylist->phone}}">{{$data->stylist->phone}}</a>
                                </td>
                            </tr>
                            @if(!empty($data->client))
                            <tr>
                                <th>Client Detail</th>
                                <td>
                                    <strong>Name :</strong> {{ucfirst($data->client->name)}}
                                    <br>
                                    <strong>Email :</strong> <a href="mailto:{{$data->client->email}}">{{$data->client->email}}</a>
                                    <br>
                                    <strong>Phone :</strong> <a href="tel:{{$data->client->phone}}">{{$data->client->phone}}</a>
                                </td>
                            </tr>
                            @endif
                            @if(!empty($data->appointment->services) && count($data->appointment->services) > 0)
                            <tr>
                                <th>Appointment Services</th>
                                <td>
                                    <?php 
                                        foreach($data->appointment->services as $i => $service){
                                          echo ucfirst($service->service);
                                          echo '<br>';
                                        }
                                    ?>
                                </td>
                            </tr>
                            @endif
                            <tr>
                                <th>Appointment Timing</th>
                                <td>
                                    {{date("d F Y",strtotime($data->appointment->date))}}
                                    <br>
                                    {{date("H:i:s",strtotime($data->appointment->start_time))}} - {{date("H:i:s",strtotime($data->appointment->end_time))}}
                                </td>
                            </tr>
                            <tr>
                                <th>Create Date</th>
                                <td>{{date("d F Y H:i:s",strtotime($data->appointment->created_at))}}</td>
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
                            <h3 class="mb-0">Amount Detail</h3>
                        </div>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table align-items-center table-flush">
                        <tbody>
                            <tr>
                                <th>Amount</th>
                                <th>Admin Commission</th>
                                <th>Stylist amount</th>
                            </tr>
                            <tr>
                                <td>$ {{number_format((float)$data->amount, 2, '.', '')}}</td>
                                <td>$ {{$commission_price}}</td>
                                <td>$ {{$stylist_actual_price}}</td>
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
                                <th>Balance Transaction</th>
                                <td>{{$data->balance_transaction}}</td>
                            </tr>
                            <tr>
                                <th>Payment Method</th>
                                <td>{{$data->payment_method}}</td>
                            </tr>
                            <tr>
                                <th>Description</th>
                                <td>{{$data->description}}</td>
                            </tr>
                            <tr>
                                <th>Paid Amount</th>
                                <td>$ {{number_format((float)$data->amount, 2, '.', '')}}</td>
                            </tr>
                            <tr>
                                <th>Receipt</th>
                                <td><a target="_blank" href="{{$data->receipt_url}}">Click Here</a></td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td>{{ucfirst($data->status)}}</td>
                            </tr>
                            <tr>
                                <th>Payment Date</th>
                                <td>{{date("d F Y H:i:s",strtotime($data->created_at))}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection