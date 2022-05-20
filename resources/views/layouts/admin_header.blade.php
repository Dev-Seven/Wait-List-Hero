<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="{{env('APP_NAME')}}">
    <title>{{env('APP_NAME')}}</title>
    <link rel="icon" href="{{asset('img/brand/favicon.png')}}" type="image/png">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700">
    <link rel="stylesheet" href="{{asset('vendor/nucleo/css/nucleo.css')}}" type="text/css">
    <link rel="stylesheet" href="{{asset('vendor/@fortawesome/fontawesome-free/css/all.min.css')}}" type="text/css">
    <script type="text/javascript">
    var SITE_URL = '{{URL::to('/')}}'
    </script>
    <link rel="stylesheet" href="{{asset('css/argon.css?v=1.2.0')}}" type="text/css">
    <link rel="stylesheet" href="{{asset('css/jquery.dataTables.min.css')}}" type="text/css">
    <link rel="stylesheet" href="{{asset('css/custom.css')}}" type="text/css">
</head>

<body>
<!-- Sidenav -->
@include('layouts.admin_sidebar')
<!-- Main content -->
<div class="main-content" id="panel">
<!-- Topnav -->
<?php

$class = 'bg-primary';
// $route = \Request::route()->getName();
// if(in_array($route,['admin.profile','admin.change_password','admin.subscription.index','admin.commission.index'])){
// $class = 'bg-default';
// }

?>
<nav class="navbar navbar-top navbar-expand navbar-dark {{$class}} border-bottom">
    <div class="container-fluid">
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <!-- Navbar links -->
            <ul class="navbar-nav align-items-center  ml-md-auto ">
                <li class="nav-item d-xl-none">
                  <!-- Sidenav toggler -->
                  <div class="pr-3 sidenav-toggler sidenav-toggler-dark" data-action="sidenav-pin" data-target="#sidenav-main">
                    <div class="sidenav-toggler-inner">
                      <i class="sidenav-toggler-line"></i>
                      <i class="sidenav-toggler-line"></i>
                      <i class="sidenav-toggler-line"></i>
                    </div>
                  </div>
                </li>
            </ul>
            <ul class="navbar-nav align-items-center  ml-auto ml-md-0 ">
                <li class="nav-item dropdown">
                    <a class="nav-link pr-0" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <div class="media align-items-center">
                            <span class="avatar avatar-sm rounded-circle">
                            @if(\Auth::User()->image != '' && file_exists(public_path('img/user/'.\Auth::User()->image)))
                                <img src="{{asset('img/user/'.\Auth::User()->image)}}">
                            @else
                                <img src="{{asset('img/avatar.png')}}">
                            @endif
                            </span>
                            <div class="media-body  ml-2  d-none d-lg-block">
                                <span class="mb-0 text-sm  font-weight-bold">{{ucfirst(\Auth::User()->name)}}</span>
                            </div>
                        </div>
                    </a>
                    <div class="dropdown-menu  dropdown-menu-right ">
                        <div class="dropdown-header noti-title">
                            <h6 class="text-overflow m-0">Welcome!</h6>
                        </div>
                        <a href="{{route('admin.profile')}}" class="dropdown-item">
                            <i class="ni ni-single-02"></i>
                            <span>Edit profile</span>
                        </a>
                        <a href="{{route('admin.subscription.index')}}" class="dropdown-item">
                            <i class="ni ni-credit-card"></i>
                            <span>Subscriptions</span>
                        </a>
                        <a href="{{route('admin.commission.index')}}" class="dropdown-item">
                            <i class="far fa-money-bill-alt"></i>
                            <span>Commission</span>
                        </a>
                        <a href="{{route('admin.change_password')}}" class="dropdown-item">
                            <i class="ni ni-key-25"></i>
                            <span>Change Password</span>
                        </a>
                        <a href="{{route('admin.setting.index')}}" class="dropdown-item">
                            <i class="fa fa-cog"></i>
                            <span>Settings</span>
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="javascript:void(0)" class="logout_link dropdown-item">
                            <i class="ni ni-user-run"></i>
                            <span>Logout</span>
                        </a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</nav>
<!-- Header -->