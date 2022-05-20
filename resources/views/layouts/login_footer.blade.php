<footer class="py-5" id="footer-main">
    <div class="container">
        <div class="row align-items-center justify-content-xl-between">
            <div class="col-xl-12">
                <div class="copyright text-center text-xl-left text-muted">
                &copy; {{date('Y')}} <a href="javascript:void(0)" class="font-weight-bold ml-1">{{env('APP_NAME')}}</a>
                </div>
            </div>
        </div>
    </div>
</footer>
<script src="{{asset('vendor/jquery/dist/jquery.min.js')}}"></script>
<script src="{{asset('vendor/bootstrap/dist/js/bootstrap.bundle.min.js')}}"></script>
<script src="{{asset('vendor/js-cookie/js.cookie.js')}}"></script>
<script src="{{asset('vendor/jquery.scrollbar/jquery.scrollbar.min.js')}}"></script>
<script src="{{asset('vendor/jquery-scroll-lock/dist/jquery-scrollLock.min.js')}}"></script>
<script src="{{asset('js/argon.js?v=1.2.0')}}"></script>
<script src="{{asset('js/jquery.validate.min.js')}}"></script>
<script src="{{asset('js/additional-methods.min.js')}}"></script>
<script src="{{asset('js/jquery_validation.js')}}"></script>
</body>
</html>