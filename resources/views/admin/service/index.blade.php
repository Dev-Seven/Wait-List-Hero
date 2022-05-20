@extends('layouts.app_admin')

@section('content')
<div class="header bg-primary pb-6">
<div class="container-fluid">
<div class="header-body">
  <div class="row align-items-center py-4">
    <div class="col-lg-6 col-7">
      <h6 class="h2 text-white d-inline-block mb-0">Service List</h6>
    </div>
    <div class="col-lg-6 col-7 text-right">
      <a href="{{route('admin.service.create')}}" class="btn btn-success">Create Service</a>
    </div>
  </div>
  <!-- Card stats -->
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
<!-- Page content -->
<div class="container-fluid mt--6">
    <div class="row">
    <div class="col-xl-12">
      <div class="card">
        <div class="card-header border-0">
          <div class="row align-items-center">
            <div class="col">
              <h3 class="mb-0">Services</h3>
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <!-- Projects table -->
          <table class="table align-items-center table-flush" id="service_table">
            <thead class="thead-light">
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
                @if(!empty($data) && count($data) > 0)
                    @foreach($data as $service)
                    <tr>
                        <td>{{ucfirst($service->name)}}</td>
                        <td>@if($service->status == 1) Active @else InActive @endif</td>
                        <td>
                            <a href="{{route('admin.service.edit',$service->id)}}" class="btn btn-warning btn-sm"><i class="fas fa-pen"></i></a>
                            <a href="javascript::void(0)" data-url="{{route('admin.service.delete',$service->id)}}" class="btn btn-danger delete_btn btn-sm"><i class="fas fa-trash"></i></a>
                        </td>
                    </tr>
                    @endforeach
                @else
                  <tr>
                    <td colspan="10">No Service Found.</td>
                  </tr>
                @endif
            </tbody>
          </table>
        </div>
      </div>
    </div>
</div>
@endsection