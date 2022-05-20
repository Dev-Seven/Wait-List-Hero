@extends('layouts.app_admin')

@section('content')
<div class="header bg-primary pb-6">
    <div class="container-fluid">
        <div class="header-body">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">Subscribed Users</h6>
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
                        <h3 class="mb-0">Subscribed Users</h3>
                    </div>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table align-items-center table-flush" id="subscribed_table" style="width: 100%;">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col">Image</th>
                            <th scope="col">Username</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Subscription Id</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    @if(!empty($data) && count($data) > 0)
                        @foreach($data as $user)
                        <tr>
                            <td>
                                @if($user->image != '' && $user->image != 'null' && file_exists(public_path('img/user/'.$user->image)))
                                <img src="{{asset('img/user/'.$user->image)}}" style="height: 50px; width: 50px;">
                                @else
                                <img style="height: 50px; width: 50px;" src="{{asset('img/avatar.png')}}">
                                @endif
                            </td>
                            <td>{{ucfirst($user->name)}}</td>
                            <td><a href="mailto:{{$user->email}}"> {{$user->email}}</a></td>
                            <td><a href="tel:{{$user->phone}}"> {{$user->phone}}</a></td>
                            <td>{{$user->subscription_id}}</td>
                            @if($user->subscription_status == 'active')
                            <td style="color: green;">Active</td>
                            @elseif($user->subscription_status == 'canceled')
                            <td style="color: orange;">Canceled</td>
                            @else
                            <td style="color: red;">InActive</td>
                            @endif
                            <td>
                                <a href="{{route('admin.subscribed.detail',$user->id)}}" class="btn icon_loader btn-primary btn-sm"><i class="fas fa-eye"></i></a>
                                @if($user->subscription_status != 'canceled')
                                <a title="Cancel Subscription" data-id="{{$user->id}}" href="javascript:void(0)" class="btn btn-danger btn-sm stop_subscription_class"><i class="fas fa-ban"></i></a>
                                @endif
                            </td>
                        </tr>
                        @endforeach
                    @else
                        <tr>
                            <td colspan="10">No User Found.</td>
                        </tr>
                    @endif
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<!-- Unsubscribe Modal-->
<div class="modal fade" id="stopSubstriptionModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Cancel Subscription?</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
                </button>
            </div>
            <form method="post" action="{{route('admin.subscribed.unsubscribe')}}">
            <div class="modal-body">
                Are you sure to cancel subscription for this Stylist ?
                @csrf
                <input type="hidden" name="id" class="hidden_user_id">
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                <button type="submit" value="Agree" class="btn btn-danger" href="#">Agree</button>
            </div>
            </form>
        </div>
    </div>
</div>
@endsection