@extends('layouts.app_login')

@section('content')
<!-- Header -->
<div class="header bg-gradient-primary py-7 py-lg-8 pt-lg-9">
    <div class="container">
        <div class="header-body text-center mb-7">
            <div class="row justify-content-center">
                <div class="col-xl-5 col-lg-6 col-md-8 px-5">
                    <h1 class="text-white">Forgot Password</h1>
                </div>
            </div>
        </div>
    </div>
    <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
        </svg>
    </div>
</div>
<!-- Page content -->
<div class="container mt--8 pb-5">
    <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
        <div class="card bg-secondary border-0 mb-0">

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
            <div class="card-body px-lg-5 py-lg-5">
                <div class="text-center text-muted mb-4">
                    <small>Forgot Password</small>
                </div>
                <form id="fogot_password_form" method="post" action="{{route('forgot.password.post')}}">
                    @csrf
                    <div class="form-group mb-3">
                        <div class="input-group input-group-merge input-group-alternative">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="ni ni-email-83"></i></span>
                            </div>
                            <input class="form-control" value="{{old('email')}}" id="email" name="email" placeholder="Email" type="email">
                        </div>
                        <label id="email-error" style="display: none;" class="error" for="email"></label>
                    </div>
                    <div class="text-center">
                        <button type="submit" name="submit" class="btn loader_class btn-primary my-4">Submit</button>
                    </div>
                </form>
                <br>
                <div class="col-12 text-center">
                    <a href="{{route('login')}}" class="text-dark"><small>Login</small></a>
                </div>
            </div>
        </div>
        </div>
    </div>
</div>
</div>
@endsection