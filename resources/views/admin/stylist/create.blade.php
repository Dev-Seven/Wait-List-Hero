@extends('layouts.app_admin')

@section('content')
<div class="header pb-6 d-flex align-items-center" style="min-height: 300px; background-image: url({{asset('img/theme/profile-cover.jpg')}}); background-size: cover; background-position: center top;">
      <!-- Mask -->
      <span class="mask bg-gradient-default opacity-8"></span>
      <!-- Header container -->
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-lg-12 col-md-12">
            <h1 class="display-2 text-white">Create Stylist</h1>
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
        <div class="col-xl-12 order-xl-1">
          <div class="card">
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col-8">
                  <h3 class="mb-0">Create Stylist</h3>
                </div>
              </div>
            </div>
            <div class="card-body">
              <form method="post" action="{{route('admin.stylist.store')}}" id="stylist_create_form">
                @csrf
                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label class="form-control-label">First Name</label>
                        <input type="text" name="first_name" class="form-control" placeholder="First Name">
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label class="form-control-label">Last Name</label>
                        <input type="text" name="last_name" class="form-control" placeholder="Last Name">
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label class="form-control-label">Company Name</label>
                        <input type="text" name="company_name" class="form-control" placeholder="Company Name">
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label class="form-control-label">Email</label>
                        <input type="text" name="email" class="form-control" placeholder="Email">
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label class="form-control-label">Password</label>
                        <input type="password" name="password" id="password" class="form-control" placeholder="Password">
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label class="form-control-label">Confirm Password</label>
                        <input type="password" name="c_password" class="form-control" placeholder="Confirm Password">
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label class="form-control-label">Phone</label>
                        <input type="text" name="phone" class="form-control" placeholder="Phone">
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label class="form-control-label">Status</label>
                        <select class="form-control" name="status">
                          <option value="">Select...</option>
                          <option value="1">Active</option>
                          <option value="0">InActive</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-lg-12">
                      <div class="form-group text-right">
                        <a href="{{route('admin.stylist.index')}}" class="btn btn_loader btn-danger">Cancel</a>
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