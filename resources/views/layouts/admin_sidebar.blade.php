<?php $route_name = \Request::route()->getName(); ?>
<nav class="sidenav navbar navbar-vertical  fixed-left  navbar-expand-xs navbar-light bg-white" id="sidenav-main">
    <div class="scrollbar-inner">
        <!-- Brand -->
        <div class="sidenav-header  align-items-center">
            <a class="navbar-brand" href="javascript:void(0)">
            <img src="{{asset('img/logo.png')}}" class="navbar-brand-img">
            </a>
        </div>
        <div class="navbar-inner">
            <!-- Collapse -->
            <div class="collapse navbar-collapse" id="sidenav-collapse-main">
                <!-- Nav items -->
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <?php 
                        $dashboard_active = '';
                        if(in_array($route_name, ['admin.dashboard'])) { $dashboard_active = "active"; }
                        ?>
                        <a class="nav-link {{$dashboard_active}}" href="{{route('admin.dashboard')}}">
                            <i class="ni ni-tv-2 text-primary"></i>
                            <span class="nav-link-text">Dashboard</span>
                        </a>
                    </li>
                    @if(\Auth::User()->role == 1)
                    <li class="nav-item">
                        <?php 
                        $user_active = '';
                        if(in_array($route_name, ['admin.user.index','admin.user.create','admin.user.edit'])) { $user_active = "active"; }
                        ?>
                        <a class="nav-link {{$user_active}}" href="{{route('admin.user.index')}}">
                        <i class="fa fa-users text-primary"></i>
                        <span class="nav-link-text">Admin List</span>
                        </a>
                    </li>
                    @endif
                    <li class="nav-item">
                    <?php 
                        $client_active = '';
                        if(in_array($route_name, ['admin.client.index','admin.client.create','admin.client.edit'])) { $client_active = "active"; }
                        ?>
                        <a class="nav-link {{$client_active}}" href="{{route('admin.client.index')}}">
                        <i class="fa fa-users text-primary"></i>
                        <span class="nav-link-text">Client List</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <?php 
                        $stylist_active = '';
                        if(in_array($route_name, ['admin.stylist.index','admin.stylist.create','admin.stylist.edit'])) { $stylist_active = "active"; }
                        ?>
                        <a class="nav-link {{$stylist_active}}" href="{{route('admin.stylist.index')}}">
                        <i class="fa fa-users text-primary"></i>
                        <span class="nav-link-text">Stylist List</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <?php 
                        $appointment_active = '';
                        if(in_array($route_name, ['admin.appointment.index','admin.appointment.detail'])) { $appointment_active = "active"; }
                        ?>
                        <a class="nav-link {{$appointment_active}}" href="{{route('admin.appointment.index')}}">
                        <i class="ni ni-bullet-list-67 text-primary"></i>
                        <span class="nav-link-text">Appointment List</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <?php 
                        $subscribed_active = '';
                        if(in_array($route_name, ['admin.subscribed.index','admin.subscribed.detail'])) { $subscribed_active = "active"; }
                        ?>
                        <a class="nav-link {{$subscribed_active}}" href="{{route('admin.subscribed.index')}}">
                        <i class="ni ni-bullet-list-67 text-primary"></i>
                        <span class="nav-link-text">Subscribed Users</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <?php 
                        $track_appointment = '';
                        if(in_array($route_name, ['admin.track_appointment.index','admin.track_appointment.view'])) { $track_appointment = "active"; }
                        ?>
                        <a class="nav-link {{$track_appointment}}" href="{{route('admin.track_appointment.index')}}">
                        <i class="ni ni-money-coins text-primary"></i>
                        <span class="nav-link-text">Appointment Transactions</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <?php 
                        $payment_active = '';
                        if(in_array($route_name, ['admin.payment.index','admin.payment.view'])) { $payment_active = "active"; }
                        ?>
                        <a class="nav-link {{$payment_active}}" href="{{route('admin.payment.index')}}">
                        <i class="ni ni-bullet-list-67 text-primary"></i>
                        <span class="nav-link-text">Payment History</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <?php 
                        $subscription_active = '';
                        if(in_array($route_name, ['admin.sub_history.index','admin.sub_history.detail'])) { $subscription_active = "active"; }
                        ?>
                        <a class="nav-link {{$subscription_active}}" href="{{route('admin.sub_history.index')}}">
                        <i class="ni ni-bullet-list-67 text-primary"></i>
                        <span class="nav-link-text">Subscription History</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <?php 
                        $cms_active = '';
                        if(in_array($route_name, ['admin.cms.index','admin.cms.create','admin.cms.edit'])) { $cms_active = "active"; }
                        ?>
                        <a class="nav-link {{$cms_active}}" href="{{route('admin.cms.index')}}">
                        <i class="ni ni-ungroup text-primary"></i>
                        <span class="nav-link-text">CMS Pages</span>
                        </a>
                    </li>
                    <!-- <li class="nav-item"> -->
                        <?php 
                        // $service_active = '';
                        //if(in_array($route_name, ['admin.service.index','admin.service.create','admin.service.edit'])) { $service_active = "active"; }
                        ?>
                        <!-- <a class="nav-link" href="{{route('admin.service.index')}}">
                        <i class="ni ni-ungroup text-primary"></i>
                        <span class="nav-link-text">Service List</span>
                        </a> -->
                    <!-- </li> -->
                </ul>
            </div>
        </div>
    </div>
</nav>