@extends('layouts.app_admin')
@section('content')
<div class="header bg-primary pb-6">
    <div class="container-fluid">
        <div class="header-body">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">Subscription History</h6>
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
                        <h3 class="mb-0">Subscription History</h3>
                    </div>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table align-items-center table-flush" id="subscription_table" style="width: 100%;">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col">Username</th>
                            <th scope="col">Subscription Id</th>
                            <!-- <th scope="col">Email</th> -->
                            <th scope="col">Object</th>
                            <!-- <th scope="col">Collection Method</th> -->
                            <th scope="col">Subscription Period</th>
                            <!-- <th scope="col">Invoice Id</th> -->
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if(!empty($data) && count($data) > 0)
                            @foreach($data as $history)
                            <tr>
                                <td>{{ucfirst($history->username)}}</td>
                                <td>{{$history->subscription_id}}</td>
                                <!-- <td>{{ucfirst($history->user_email)}}</td> -->
                                <td>{{ucfirst($history->object)}}</td>
                                <!-- <td>{{ucfirst($history->collection_method)}}</td> -->
                                <td>{{date('d F Y',$history->current_period_start)}} - {{date('d F Y',$history->current_period_end)}}</td>
                                <!-- <td>{{$history->latest_invoice}}</td> -->
                                @if($history->status == 'active')
                                <td style="color: green;">{{ucfirst($history->status)}}</td>
                                @else
                                <td style="color: red;">{{ucfirst($history->status)}}</td>
                                @endif
                                <td>
                                    <a href="{{route('admin.sub_history.detail',$history->id)}}" class="btn btn-primary icon_loader btn-sm"><i class="fas fa-eye"></i></a>
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