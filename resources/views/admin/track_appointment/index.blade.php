@extends('layouts.app_admin')

@section('content')
<div class="header bg-primary pb-6">
    <div class="container-fluid">
        <div class="header-body">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">Track Appointments</h6>
                </div>
            </div>
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
<div class="container-fluid mt--6">
<div class="row">
    <div class="col-xl-12">
        <div class="card">
            <div class="card-header border-0">
                <div class="row align-items-center">
                    <div class="col">
                        <h3 class="mb-0">Track Appointments</h3>
                    </div>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table align-items-center table-flush" id="track_appointment_table" style="width: 100%;">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col">Stylist</th>
                            <th scope="col">Client</th>
                            <th scope="col">Appointment Date & Time</th>
                            <th scope="col">Booked Date</th>
                            <th scope="col">Paid Price</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if(!empty($data) && count($data) > 0)
                            @foreach($data as $track)
                            <tr>
                                @if(!empty($track->stylist))
                                    <td>{{ucfirst($track->stylist->name)}}</td>
                                @else
                                    <td>-</td>
                                @endif

                                @if(!empty($track->client))
                                    <td>{{ucfirst($track->client->name)}}</td>
                                @else
                                    <td>-</td>
                                @endif
                                @if(!empty($track->appointment))
                                <td>
                                    {{date("d F Y",strtotime($track->appointment->date))}} 
                                    <br>
                                    {{date("H:i:s",strtotime($track->appointment->start_time))}} - {{date("H:i:s",strtotime($track->appointment->end_time))}}
                                </td>
                                @else
                                <td>
                                    -
                                </td>
                                @endif
                                <td>{{date("d F Y H:i:s",strtotime($track->created_at))}}</td>
                                <td>$ {{number_format((float)$track->amount, 2, '.', '')}}</td>
                                <td>{{ucfirst($track->status)}}</td>
                                
                                <td>
                                    <a href="{{route('admin.track_appointment.view',$track->id)}}" class="btn btn-primary icon_loader btn-sm"><i class="fas fa-eye"></i></a>
                                </td>
                            </tr>
                            @endforeach
                        @else
                        <tr>
                            <td colspan="10">No Tracking Found.</td>
                        </tr>
                        @endif
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection