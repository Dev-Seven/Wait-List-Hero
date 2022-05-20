@extends('layouts.app_admin')

@section('content')
<div class="header pb-6 d-flex align-items-center" style="min-height: 300px; background-image: url({{asset('img/theme/profile-cover.jpg')}}); background-size: cover; background-position: center top;">
    <!-- Mask -->
    <span class="mask bg-gradient-default opacity-8"></span>
    <!-- Header container -->
    <div class="container-fluid d-flex align-items-center">
        <div class="row">
            <div class="col-lg-12 col-md-12">
                <h1 class="display-2 text-white">Edit Profile</h1>
            </div>
        </div>
    </div>
</div>
<!-- Page content -->
<div class="container-fluid mt--6">
<div class="row">
    <div class="col-xl-4 order-xl-2">
        <div class="card card-profile">
            <img src="{{asset('img/theme/img-1-1000x600.jpg')}}" alt="Image placeholder" class="card-img-top">
            <div class="row justify-content-center">
                <div class="col-lg-3 order-lg-2">
                    <div class="card-profile-image">
                        <a href="javascript:void(0)">
                            @if($user->image != '' && file_exists(public_path('img/user/'.$user->image)))
                                <img src="{{asset('img/user/'.$user->image)}}" class="rounded-circle">
                            @else
                                <img src="{{asset('img/avatar.png')}}" class="rounded-circle">
                            @endif
                        </a>
                    </div>
                </div>
            </div>
            <div class="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
            </div>
            <div class="card-body pt-4">
                <div class="text-center">
                    <h5 class="h3">{{ucfirst($user->name)}}</h5>
                    <div class="h5 font-weight-300">
                        <i class="ni location_pin mr-2"></i>{{$user->email}}
                    </div>
                    <div class="h5 mt-4">
                        <i class="ni business_briefcase-24 mr-2"></i>
                        @if($user->role == 1) Super Admin @else Admin @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-xl-8 order-xl-1">
        <div class="card">
            <div class="card-header">
                <div class="row align-items-center">
                    <div class="col-8">
                        <h3 class="mb-0">Edit profile</h3>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <form method="post" id="update_profile_form" action="{{route('admin.profile.update')}}" enctype="multipart/form-data">
                    @csrf
                    <h6 class="heading-small text-muted mb-4">User information</h6>
                    <div class="pl-lg-4">
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label class="form-control-label" for="input-first_name">First Name</label>
                                    <input type="text" id="input-first_name" class="form-control" placeholder="First Name" value="{{$user->first_name}}" name="first_name">
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label class="form-control-label" for="input-last_name">Last Name</label>
                                    <input type="text" id="input-last_name" value="{{$user->last_name}}" class="form-control" placeholder="Last Name" name="last_name">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label class="form-control-label">Email</label>
                                    <input type="email" value="{{$user->email}}" class="form-control" placeholder="Email" readonly="readonly">
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label class="form-control-label" for="input-phone">Phone</label>
                                    <input type="text" id="input-phone" value="{{$user->phone}}" name="phone" class="form-control" placeholder="Phone">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <label class="form-control-label" for="input-company_name">Company Name</label>
                                    <input type="text" id="input-company_name" class="form-control" name="company_name" value="{{$user->company_name}}" placeholder="Company Name">
                                </div>
                            </div>
                        </div>
                        <!-- <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <input type="file" name="image">
                                </div>
                            </div>
                        </div> -->
                        <div class="row">
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