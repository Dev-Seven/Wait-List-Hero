@extends('layouts.app_admin')
@section('content')
<div class="header pb-6 d-flex align-items-center" style="min-height: 300px; background-image: url({{asset('img/theme/profile-cover.jpg')}}); background-size: cover; background-position: center top;">
    <span class="mask bg-gradient-default opacity-8"></span>
    <div class="container-fluid d-flex align-items-center">
        <div class="row">
            <div class="col-lg-12 col-md-12">
                <h1 class="display-2 text-white">Create Page</h1>
            </div>
        </div>
    </div>
</div>
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
                            <h3 class="mb-0">Create CMS Page</h3>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form method="post" action="{{route('admin.cms.store')}}" id="cms_page_form">
                        @csrf
                        <div class="pl-lg-4">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="form-group">
                                        <label class="form-control-label">Title</label>
                                        <input type="text" name="title" class="form-control" placeholder="Title">
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="form-group">
                                        <label class="form-control-label">Description</label>
                                            <textarea class="form-control" name="description" placeholder="Description" rows="5"></textarea>
                                        <label id="mce_0-error" class="error" for="mce_0"></label>
                                    </div>
                                </div>
                                <div class="col-lg-12">
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
                                        <a href="{{route('admin.cms.index')}}" class="btn btn_loader btn-danger">Cancel</a>
                                        <button type="submit" class="btn loader_class btn-success" value="Submit">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
<script src="https://cdn.tiny.cloud/1/5iyf0gkhkw4lp2cclyu2ebd4plvjzgmni1mzw27ss4amvgq2/tinymce/5/tinymce.min.js" referrerpolicy="origin"></script>
<script>tinymce.init({selector:'textarea'});</script>
@endsection