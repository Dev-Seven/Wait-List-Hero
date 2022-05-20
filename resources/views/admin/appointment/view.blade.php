@extends('layouts.app_admin')

@section('content')
<div class="header bg-primary pb-6">
    <div class="container-fluid">
        <div class="header-body">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">Appointment Detail</h6>
                </div>
                <div class="col-lg-6 col-7 text-right">
                    <a href="{{route('admin.appointment.index')}}" class="btn btn_loader btn-success">Back</a>
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
                            <h3 class="mb-0">Appointment Detail</h3>
                        </div>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table align-items-center table-flush">
                        <tbody>
                            <tr>
                                <th>Stylist Detail</th>
                                <td>
                                    <strong>Name :</strong> {{ucfirst($data->stylist[0]->name)}}
                                    <br>
                                    <strong>Email :</strong> <a href="mailto:{{$data->stylist[0]->email}}">{{$data->stylist[0]->email}}</a>
                                    <br>
                                    <strong>Phone :</strong> <a href="tel:{{$data->stylist[0]->phone}}">{{$data->stylist[0]->phone}}</a>
                                </td>
                            </tr>
                            @if(!empty($data->client) && count($data->client) > 0)
                            <tr>
                                <th>Client Detail</th>
                                <td>
                                    <strong>Name :</strong> {{ucfirst($data->client[0]->name)}}
                                    <br>
                                    <strong>Email :</strong> <a href="mailto:{{$data->client[0]->email}}">{{$data->client[0]->email}}</a>
                                    <br>
                                    <strong>Phone :</strong> <a href="tel:{{$data->client[0]->phone}}">{{$data->client[0]->phone}}</a>
                                </td>
                            </tr>
                            @endif
                            <tr>
                                <th>Service</th>
                                @if(!empty($data->services) && count($data->services) > 0)
                                    <td>
                                        <?php 
                                            foreach($data->services as $i => $service){
                                              echo ucfirst($service->service);
                                              echo '<br>';
                                            }
                                        ?>
                                    </td>
                                @else
                                <td>-</td>
                                @endif
                            </tr>
                            <tr>
                                <th>Appointment Date</th>
                                <td>{{date("d F Y",strtotime($data->date))}}</td>
                            </tr>
                            <tr>
                                <th>Start time and End time</th>
                                <td>{{date("H:i:s",strtotime($data->start_time))}} - {{date("H:i:s",strtotime($data->end_time))}}</td>
                            </tr>
                            <tr>
                                <th>Created Date and time</th>
                                <td>{{date("d F Y H:i:s",strtotime($data->created_at))}}</td>
                            </tr>
                            <tr>
                                <th>Total Price</th>
                                @if(!empty($data->services) && count($data->services) > 0)
                                    <?php 
                                        $price_arr = [];
                                        foreach($data->services as $i => $service){
                                          $price_arr[$i] = $service->price;
                                        }
                                    ?>
                                <td>$ {{array_sum($price_arr)}}</td>
                                @else
                                <td>-</td>
                                @endif
                            </tr>
                            <tr>
                                <th>Status</th>
                                @if($data->is_completed != 1)
                                    <td style="color: orange;">Pending</td>
                                @else
                                    <td style="color: green;">Completed</td>
                                @endif
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection