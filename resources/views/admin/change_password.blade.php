@extends('layouts.app_admin')

@section('content')
<div class="header pb-6 d-flex align-items-center" style="min-height: 300px; background-image: url({{asset('img/theme/profile-cover.jpg')}}); background-size: cover; background-position: center top;">
      <!-- Mask -->
      <span class="mask bg-gradient-default opacity-8"></span>
      <!-- Header container -->
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-lg-12 col-md-12">
            <h1 class="display-2 text-white">Change Password</h1>
          </div>
        </div>
      </div>
    </div>
    <!-- Page content -->
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
                  <h3 class="mb-0">Change Password </h3>
                </div>
              </div>
            </div>
            <div class="card-body">
              <form method="post" action="{{route('admin.change_password.post')}}" id="change_password_form">
                @csrf
                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="form-group">
                        <label class="form-control-label" for="input-current_password">Current Password</label>
                        <input type="password" id="current_password" name="current_password" class="form-control" placeholder="Current Password">
                      </div>
                    </div>
                    <div class="col-lg-12">
                      <div class="form-group">
                        <label class="form-control-label" for="new_password">New Password</label>
                        <input type="password" id="new_password" name="new_password" class="form-control" placeholder="New Password">
                      </div>
                    </div>
                    <div class="col-lg-12">
                      <div class="form-group">
                        <label class="form-control-label" for="confirm_password">Confirm password</label>
                        <input type="password" id="confirm_password" name="confirm_password" class="form-control" placeholder="Confirm password">
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