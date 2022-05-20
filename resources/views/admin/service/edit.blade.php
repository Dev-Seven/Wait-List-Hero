@extends('layouts.app_admin')

@section('content')
<div class="header pb-6 d-flex align-items-center" style="min-height: 300px; background-image: url({{asset('img/theme/profile-cover.jpg')}}); background-size: cover; background-position: center top;">
      <!-- Mask -->
      <span class="mask bg-gradient-default opacity-8"></span>
      <!-- Header container -->
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-lg-12 col-md-12">
            <h1 class="display-2 text-white">Edit Service</h1>
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
                  <h3 class="mb-0">Edit Service</h3>
                </div>
              </div>
            </div>
            <div class="card-body">
              <form method="post" action="{{route('admin.service.update')}}" id="service_form">
                @csrf
                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-lg-12">
                      <input type="hidden" name="id" value="{{$data->id}}">
                      <div class="form-group">
                        <label class="form-control-label">Name</label>
                        <input type="text" value="{{$data->name}}" name="name" class="form-control" placeholder="Name">
                      </div>
                    </div>
                    <div class="col-lg-12">
                      <div class="form-group">
                        <label class="form-control-label">Status</label>
                        <select class="form-control" name="status">
                          <option value="">Select...</option>
                          <option @if($data->status == 1) selected="selected" @endif value="1">Active</option>
                          <option @if($data->status == 0) selected="selected" @endif value="0">InActive</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-lg-12">
                      <div class="form-group text-right">
                        <a href="{{route('admin.service.index')}}" class="btn btn-danger">Cancel</a>
                        <button type="submit" class="btn btn-success" value="Submit">Submit</button>
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