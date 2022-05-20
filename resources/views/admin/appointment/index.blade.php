@extends('layouts.app_admin')

@section('content')
<div class="header bg-primary pb-6">
    <div class="container-fluid">
        <div class="header-body">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">Appointment List</h6>
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
<!-- Page content -->
<div class="container-fluid mt--6">
<div class="row">
    <div class="col-xl-12">
        <div class="card">
            <div class="card-header border-0">
                <div class="row align-items-center">
                    <div class="col">
                        <h3 class="mb-0">Appointment List</h3>
                    </div>
                </div>
            </div>
            <div class="table-responsive">
                <!-- Projects table -->
                <table class="table align-items-center table-flush" id="appointment_table" style="width: 100%;">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col">Stylist</th>
                            <th scope="col">Services</th>
                            <th scope="col">Date</th>
                            <th scope="col">Time</th>
                            <th scope="col">Total Price</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if(!empty($data) && count($data) > 0)
                            @foreach($data as $appointment)
                            <tr>
                                @if(!empty($appointment->stylist) && count($appointment->stylist) > 0)
                                    <td>{{ucfirst($appointment->stylist[0]->name)}}</td>
                                @else
                                    <td>-</td>
                                @endif
                                @if(!empty($appointment->services) && count($appointment->services) > 0)
                                <td>
                                    <?php 
                                    foreach($appointment->services as $service){
                                        echo ucfirst($service->service);
                                        echo '<br>';
                                    }
                                    ?>
                                </td>
                                @else
                                    <td>-</td>
                                @endif
                                    <td>{{date("d F Y",strtotime($appointment->date))}}</td>
                                    <td>{{date("H:i:s",strtotime($appointment->start_time))}} - {{date("H:i:s",strtotime($appointment->end_time))}}</td>
                                @if(!empty($appointment->services) && count($appointment->services) > 0)
                                <?php 
                                $price_arr = [];
                                foreach($appointment->services as $i => $service){
                                    $price_arr[$i] = $service->price;
                                }
                                ?>
                                    <td>$ {{array_sum($price_arr)}}</td>
                                @else
                                    <td>-</td>
                                @endif
                                @if($appointment->is_completed != 1)
                                    <td style="color: orange;">Pending</td>
                                @else
                                    <td style="color: green;">Completed</td>
                                @endif
                                <td>
                                    <a href="{{route('admin.appointment.detail',$appointment->id)}}" class="btn btn-primary icon_loader btn-sm"><i class="fas fa-eye"></i></a>
                                    @if($appointment->is_completed == 1)
                                    <a href="javascript:void(0)" data-appointment_id="{{$appointment->id}}" data-stylist_id="{{$appointment->stylist_id}}" class="btn btn-warning payment_popup_click btn-sm"><i class="fas fa-comment-dollar"></i></a>
                                    @endif
                                </td>
                            </tr>
                            @endforeach
                        @else
                        <tr>
                            <td colspan="10">No Appointment Found.</td>
                        </tr>
                        @endif
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<!-- Unsubscribe Modal-->
<div class="modal fade" id="payment_popupModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Pay to Stylist?</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
                </button>
            </div>
            <form method="post" action="{{route('admin.payment.transfer')}}">
            <div class="modal-body">
                Are you sure to pay this Stylist ?
                @csrf
                <input type="hidden" name="appointment_id" class="hidden_appointment_id">
                <input type="hidden" name="stylist_id" class="hidden_stylist_id">
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                <button type="submit" value="Agree" class="btn btn-danger" href="#">Agree</button>
            </div>
            </form>
        </div>
    </div>
</div>
@endsection