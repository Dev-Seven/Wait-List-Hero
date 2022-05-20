@extends('layouts.app_admin')

@section('content')
<div class="header bg-primary pb-6">
    <div class="container-fluid">
        <div class="header-body">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">Client List</h6>
                </div>
                <div class="col-lg-6 col-7 text-right">
                    <a href="{{route('admin.client.create')}}" class="btn btn_loader btn-success">Create Client</a>
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
                        <h3 class="mb-0">Client List</h3>
                    </div>
                </div>
            </div>
            <div class="table-responsive">
                <!-- Projects table -->
                <table class="table align-items-center table-flush" id="client_table" style="width: 100%;">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col">Image</th>
                            <th scope="col">Username</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if(!empty($data) && count($data) > 0)
                            @foreach($data as $client)
                            <tr>
                                <td>
                                    @if($client->image != '' && $client->image != 'null' && file_exists(public_path('img/user/'.$client->image)))
                                    <img src="{{asset('img/user/'.$client->image)}}" style="height: 50px; width: 50px;">
                                    @else
                                    <img style="height: 50px; width: 50px;" src="{{asset('img/avatar.png')}}">
                                    @endif
                                </td>
                                <td>{{ucfirst($client->name)}}</td>
                                <td><a href="mailto:{{$client->email}}"> {{$client->email}}</a></td>
                                <td><a href="tel:{{$client->phone}}"> {{$client->phone}}</a></td>
                                @if($client->status == 1)
                                <td style="color: green;">Active</td>
                                @else
                                <td style="color: red;">InActive</td>
                                @endif
                                <td>
                                    <a href="{{route('admin.client.view',$client->id)}}" class="btn icon_loader btn-primary btn-sm"><i class="fas fa-eye"></i></a>
                                    <a href="{{route('admin.client.edit',$client->id)}}" class="btn icon_loader btn-warning btn-sm"><i class="fas fa-pen"></i></a>
                                    <a href="javascript::void(0)" data-url="{{route('admin.client.delete',$client->id)}}" class="btn btn-danger delete_btn btn-sm"><i class="fas fa-trash"></i></a>
                                </td>
                            </tr>
                            @endforeach
                        @else
                        <tr>
                            <td colspan="10">No Page Found.</td>
                        </tr>
                        @endif
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection