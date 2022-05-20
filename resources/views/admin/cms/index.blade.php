@extends('layouts.app_admin')

@section('content')
<div class="header bg-primary pb-6">
    <div class="container-fluid">
        <div class="header-body">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">CMS Pages</h6>
                </div>
                <div class="col-lg-6 col-7 text-right">
                    <a href="{{route('admin.cms.create')}}" class="btn btn_loader btn-success">Create Page</a>
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
                            <h3 class="mb-0">CMS Pages</h3>
                        </div>
                    </div>
                </div>
                <div class="table-responsive">
                    <!-- Projects table -->
                    <table class="table align-items-center table-flush" id="cms_page_table" style="width: 100%;">
                        <thead class="thead-light">
                            <tr>
                                <th scope="col">Title</th>
                                <th scope="col">Slug</th>
                                <th scope="col">Description</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @if(!empty($data) && count($data) > 0)
                                @foreach($data as $cms)
                                <tr>
                                    <td>{{ucfirst($cms->title)}}</td>
                                    <td>{{ucfirst($cms->slug)}}</td>
                                    <?php $desc = strip_tags($cms->description); ?>
                                    <td>@if(strlen($desc) > 50) {{substr($desc,0,50)}}...
                                    @else {{$desc}} @endif </td>
                                    <td>@if($cms->status == 1) Active @else InActive @endif</td>
                                    <td>
                                        <a href="{{route('admin.cms.view',$cms->id)}}" class="btn btn-primary icon_loader btn-sm">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a href="{{route('admin.cms.edit',$cms->id)}}" class="btn btn-warning icon_loader btn-sm">
                                            <i class="fas fa-pen"></i>
                                        </a>
                                        <a href="javascript::void(0)" data-url="{{route('admin.cms.delete',$cms->id)}}" class="btn btn-danger delete_btn btn-sm">
                                            <i class="fas fa-trash"></i>
                                        </a>
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