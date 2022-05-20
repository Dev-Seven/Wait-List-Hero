@extends('layouts.app_admin')
@section('content')
<div class="header bg-primary pb-6">
    <div class="container-fluid">
        <div class="header-body">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">Payment History</h6>
                </div>
            </div>
            @if (Session::has('danger'))
                <div class="flash-message">
                    <p class="alert alert-danger">{{ Session::get('danger') }}</p>
                </div>
            @endif
            @if (Session::has('success'))
                <div class="flash-message">
                    <p class="alert alert-success">{{ Session::get('success') }}</p>
                </div>
            @endif
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
                        <h3 class="mb-0">Payment History</h3>
                    </div>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table align-items-center table-flush" id="payment_table" style="width: 100%;">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col">Payment Id</th>
                            <th scope="col">Stylist</th>
                            <th scope="col">Client</th>
                            <th scope="col">Date & time</th>
                            <th scope="col">Price</th>
                            <th scope="col">Description</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if(!empty($data) && count($data) > 0)
                            @foreach($data as $history)
                            <tr>
                                <td>{{$history->payment_id}}</td>
                                <td>{{ucfirst($history->stylist[0]->name)}}</td>
                                <td>{{ucfirst($history->client[0]->name)}}</td>
                                <td>
                                    {{date('d F Y',strtotime($history->appointment[0]->date))}}
                                    <br>
                                    {{date('H:i:s',strtotime($history->appointment[0]->start_time))}} - {{date('H:i:s',strtotime($history->appointment[0]->end_time))}}
                                </td>
                                <td>$ {{$history->amount}}</td>
                                <td>{{$history->description}}</td>
                                <td>{{$history->status}}</td>
                                <td>
                                    <a href="{{route('admin.payment.view',$history->id)}}" class="btn btn-primary icon_loader btn-sm"><i class="fas fa-eye"></i></a>
                                </td>
                            </tr>
                        @endforeach
                        @else
                        <tr>
                            <td colspan="10">No History Found.</td>
                        </tr>
                        @endif
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection