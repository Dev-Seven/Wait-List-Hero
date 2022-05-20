@extends('layouts.app_admin')

@section('content')
<div class="header bg-primary pb-6">
<div class="container-fluid">
<div class="header-body">
  <div class="row align-items-center py-4">
    <div class="col-lg-6 col-7">
      <h6 class="h2 text-white d-inline-block mb-0">Client Detail</h6>
    </div>
    <div class="col-lg-6 col-7 text-right">
      <a href="{{route('admin.client.index')}}" class="btn btn_loader btn-success">Back</a>
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
              <h3 class="mb-0">Client Detail</h3>
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <!-- Projects table -->
          <table class="table align-items-center table-flush">
            <tbody>
              <tr>
                <th>Image</th>
                <td>
                  @if($data->image != '' && $data->image != 'null' && file_exists(public_path('img/user/'.$data->image)))
                    <img src="{{asset('img/user/'.$data->image)}}" style="height: 50px; width: 50px;">
                    @else
                    <img style="height: 50px; width: 50px;" src="{{asset('img/avatar.png')}}">
                    @endif
                </td>
              </tr>
              <tr>
                <th>Usernamae</th>
                <td>{{ucfirst($data->name)}}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{{$data->email}}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{{$data->phone}}</td>
              </tr>
              <tr>
                <th>Role</th>
                <td>@if($data->role == 3) Client @else Stylist @endif</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>@if($data->status == 1) <span style="color:green"> Active </span> @else <span style="color: red;">InActive</span> @endif</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</div>
@endsection