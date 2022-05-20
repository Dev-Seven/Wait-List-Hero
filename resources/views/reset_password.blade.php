@extends('layouts.app_login')

@section('content')
<!-- Header -->
<div class="header bg-gradient-primary py-7 py-lg-8 pt-lg-9">
    <div class="container">
        <div class="header-body text-center mb-7">
            <div class="row justify-content-center">
                <div class="col-xl-5 col-lg-6 col-md-8 px-5">
                    <h1 class="text-white">Reset Password</h1>
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

            <div class="card-body px-lg-5 py-lg-5">
                <div class="text-center text-muted mb-4">
                    <small>Reset Password</small>
                </div>
                <form id="reset_password_form" method="post" action="{{route('password.reset_password.post')}}">
                    @csrf
                    <div class="form-group mb-3">
                        <div class="input-group input-group-merge input-group-alternative">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="ni ni-email-83"></i></span>
                            </div>
                            <input type="hidden" name="id" value="{{$user->id}}">
                            <input class="form-control" name="email" value="{{$user->email}}" placeholder="Email" type="text" readonly="readonly">
                        </div>
                    </div>
                    <div class="form-group mb-3">
                        <div class="input-group input-group-merge input-group-alternative">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="ni ni-lock-circle-open"></i></span>
                            </div>
                            <input class="form-control" name="password" placeholder="Password" type="password" id="password">
                        </div>
                        <label id="password-error" style="display: none;" class="error" for="password"></label>
                    </div>
                    <div class="form-group mb-3">
                        <div class="input-group input-group-merge input-group-alternative">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="ni ni-lock-circle-open"></i></span>
                            </div>
                            <input id="confirm_password" name="confirm_password" class="form-control" placeholder="Confirm Password" type="password">
                        </div>
                        <label id="confirm_password-error" style="display: none;" class="error" for="confirm_password"></label>
                    </div>
                    <div class="text-center">
                        <button type="submit" name="submit" class="btn loader_class btn-primary my-4">Submit</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-6">
                <a href="{{route('login')}}" class="text-light"><small>Login</small></a>
            </div>
        </div>
        </div>
    </div>
</div>
</div>
@endsection