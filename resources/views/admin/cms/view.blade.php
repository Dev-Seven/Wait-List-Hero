@extends('layouts.app_admin')

@section('content')
<div class="header bg-primary pb-6">
    <div class="container-fluid">
        <div class="header-body">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">CMS Page</h6>
                </div>
                <div class="col-lg-6 col-7 text-right">
                    <a href="{{route('admin.cms.index')}}" class="btn btn_loader btn-success">Back</a>
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
                            <h3 class="mb-0">CMS Page Detail</h3>
                        </div>
                    </div>
                </div>
                <div class="table-responsive">
                    <!-- Projects table -->
                    <table class="table align-items-center table-flush">
                        <tbody>
                            <tr>
                                <th>Title</th>
                                <td>{{$data->title}}</td>
                            </tr>
                            <tr>
                                <th>Description</th>
                                <td>{{$data->description}}</td>
                            </tr>
                            <tr>
                                <th>Slug</th>
                                <td>{{$data->slug}}</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td>@if($data->status == 1) Active @else InActive @endif</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection