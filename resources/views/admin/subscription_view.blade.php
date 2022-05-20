@extends('layouts.app_admin')

@section('content')
<div class="header pb-6 d-flex align-items-center" style="min-height: 300px; background-image: url({{asset('img/theme/profile-cover.jpg')}}); background-size: cover; background-position: center top;">
    <span class="mask bg-gradient-default opacity-8"></span>
    <div class="container-fluid d-flex align-items-center">
        <div class="row">
            <div class="col-lg-12 col-md-12">
                <h1 class="display-2 text-white">Subscriptions</h1>
            </div>
        </div>
    </div>
</div>
<div class="container-fluid mt--6">
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
<div class="row">
    <div class="col-xl-10 order-xl-1">
        <div class="card">
            <div class="card-header">
                <div class="row align-items-center">
                    <div class="col-8">
                        <h3 class="mb-0">Subscriptions Amount</h3>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <form method="post" action="{{route('admin.subscription.update')}}" id="change_subscription_data">
                    @csrf
                    <div class="pl-lg-4">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <label class="form-control-label" for="input-amount">Subscription Amount ($)</label>
                                    <input type="text" value="{{$data->amount}}" name="amount" class="form-control" placeholder="Subscription Amount ($)">
                                </div>
                            </div>
                            <div class="col-lg-12">
                                <div class="form-group text-right">
                                    <a href="{{route('admin.dashboard')}}" class="btn btn-danger btn_loader">Cancel</a>
                                    <button type="submit" class="btn btn-success loader_class" value="Submit">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection