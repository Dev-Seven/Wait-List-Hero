@extends('layouts.app_admin')

@section('content')
<div class="header bg-primary pb-6">
      <div class="container-fluid">
        <div class="header-body">
          <div class="row align-items-center py-4">
            <div class="col-lg-6 col-7">
              <h6 class="h2 text-white d-inline-block mb-0">Dashboard</h6>
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
          <div class="row">
            <div class="col-xl-3 col-md-6">
              <div class="card card-stats">
                <!-- Card body -->
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title text-uppercase text-muted mb-0">Total Revenue</h5>
                      <span class="h2 font-weight-bold mb-0">$ 350</span>
                    </div>
                    <div class="col-auto">
                      <div class="icon icon-shape bg-gradient-red text-white rounded-circle shadow">
                        <i class="ni ni-active-40"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-md-6">
              <div class="card card-stats">
                <!-- Card body -->
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title text-uppercase text-muted mb-0">New Appointment</h5>
                      <span class="h2 font-weight-bold mb-0">15</span>
                    </div>
                    <div class="col-auto">
                      <div class="icon icon-shape bg-gradient-orange text-white rounded-circle shadow">
                        <i class="ni ni-chart-pie-35"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-md-6">
              <div class="card card-stats">
                <!-- Card body -->
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title text-uppercase text-muted mb-0">Repeat Clients</h5>
                      <span class="h2 font-weight-bold mb-0">5</span>
                    </div>
                    <div class="col-auto">
                      <div class="icon icon-shape bg-gradient-green text-white rounded-circle shadow">
                        <i class="ni ni-money-coins"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-md-6">
              <div class="card card-stats">
                <!-- Card body -->
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title text-uppercase text-muted mb-0">Performance of Today</h5>
                      <span class="h2 font-weight-bold mb-0">20%</span>
                    </div>
                    <div class="col-auto">
                      <div class="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                        <i class="ni ni-chart-bar-32"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                  <h3 class="mb-0">Appointment visits</h3>
                </div>
                <div class="col text-right">
                  <a href="#!" class="btn btn-sm btn-primary">See all</a>
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <!-- Projects table -->
              <table class="table align-items-center table-flush">
                <thead class="thead-light">
                  <tr>
                    <th scope="col">Stylist Name</th>
                    <th scope="col">Customer Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Start Time</th>
                    <th scope="col">End Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John cary</td>
                    <td>Robert dev</td>
                    <td>12-01-2020</td>
                    <td>10:12 AM</td>
                    <td>12:12 PM</td>
                  </tr>
                  <tr>
                    <td>Seven square</td>
                    <td>Charles brown</td>
                    <td>12-01-2020</td>
                    <td>10:12 AM</td>
                    <td>12:12 PM</td>
                  </tr>
                  <tr>
                    <td>Stylist user</td>
                    <td>John doe</td>
                    <td>12-01-2020</td>
                    <td>10:12 AM</td>
                    <td>12:12 PM</td>
                  </tr>
                  <tr>
                    <td>Henry mark</td>
                    <td>Robert dev</td>
                    <td>12-01-2020</td>
                    <td>10:12 AM</td>
                    <td>12:12 PM</td>
                  </tr>
                  <tr>
                    <td>Methews</td>
                    <td>John williams</td>
                    <td>12-01-2020</td>
                    <td>10:12 AM</td>
                    <td>12:12 PM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

@endsection