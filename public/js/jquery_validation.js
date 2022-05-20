var customurl = SITE_URL;
$(document).ready(function(){
    
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $("#login_form").validate({
        ignore: "not:hidden",
        onfocusout: function(element) {
            this.element(element);  
        },
        rules: {
            "email":{
                required:true,
                email:true,
                emailCheck:true,
            },
            "password":{
                required:true,
            },
        },
        messages: {
            "email":{
                required:'Please enter e-mail address',
                email:'Please enter valid e-mail address',
                emailCheck:'Please enter valid e-mail address',
            },
            "password":{
                required:'Please enter password',
            },
        },
        submitHandler: function(form) {
            var $this = $('.loader_class');
            var loadingText = '<i class="fa fa-spinner fa-spin" role="status" aria-hidden="true"></i> Loading...';
            $('.loader_class').prop("disabled", true);
            $this.html(loadingText);
            form.submit();
        }
    });

    $("#fogot_password_form").validate({
        ignore: "not:hidden",
        onfocusout: function(element) {
            this.element(element);  
        },
        rules: {
            "email":{
                required:true,
                email:true,
                emailCheck:true,
            },
        },
        messages: {
            "email":{
                required:'Please enter e-mail address',
                email:'Please enter valid e-mail address',
                emailCheck:'Please enter valid e-mail address',
            },
        },
        submitHandler: function(form) {
            var $this = $('.loader_class');
            var loadingText = '<i class="fa fa-spinner fa-spin" role="status" aria-hidden="true"></i> Loading...';
            $('.loader_class').prop("disabled", true);
            $this.html(loadingText);
            form.submit();
        }
    });

    $("#reset_password_form").validate({
        ignore: "not:hidden",
        onfocusout: function(element) {
            this.element(element);  
        },
        rules: {
            "password":{
                required:true,
                minlength:6,
            },
            "confirm_password":{
                equalTo:'#password',
            },
        },
        messages:{
            "password":{
                required:'Please Enter Password',
                minlength:'Please Password must be 6 character',
            },
            "confirm_password":'Password and Re-type Password must match',
        },
        submitHandler: function(form) {
            var $this = $('.loader_class');
            var loadingText = '<i class="fa fa-spinner fa-spin" role="status" aria-hidden="true"></i> Loading...';
            $('.loader_class').prop("disabled", true);
            $this.html(loadingText);
            form.submit();
        },
    });

    $("#client_create_form").validate({
        ignore: "not:hidden",
        onfocusout: function(element) {
            this.element(element);  
        },
        rules: {
            "first_name":{
                required:true,
            },
            "last_name":{
                required:true,
            },
            "email":{
                required:true,
                email:true,
                emailCheck:true,
            },
            "phone":{
                required:true,
                maxlength:10,
                minlength:10,
                number: true,
            },
            "password":{
                required:true,
                minlength:6,
            },
            "c_password":{
                equalTo:'#password',
            },
            "status":{
                required:true,
            },
        },
        messages:{
            "password":{
                required:'Please Enter Password',
                minlength:'Please Password must be 6 character',
            },
            "c_password":'Password and Confirm Password must match',
            "status":'Please select status',
            "email":{
                required:'Please enter e-mail address',
                email:'Please enter valid e-mail address',
                emailCheck:'Please enter valid e-mail address',
            },
            "first_name":{
                required:'Please enter First Name',
            },
            "last_name":{
                required:'Please enter Last Name',
            },
            "phone":{
                required:'Please enter Phone number',
                maxlength:"Phone Number must be 10 digits",
                minlength:"Phone Number must be 10 digits",
                number: "Please enter valid Phone Number",
            },
        },
        submitHandler: function(form) {
            var $this = $('.loader_class');
            var loadingText = '<i class="fa fa-spinner fa-spin" role="status" aria-hidden="true"></i> Loading...';
            $('.loader_class').prop("disabled", true);
            $this.html(loadingText);
            form.submit();
        },
    });

    $("#setting_page").validate({
        ignore: "not:hidden",
        onfocusout: function(element) {
            this.element(element);  
        },
        rules: {
            "facebook_link":{
                required:true,
                url: true
            },
            "instagram_link":{
                required:true,
                url: true
            },
            "support_mail":{
                required:true,
                email:true,
                emailCheck:true,
            },
            "support_contact":{
                required:true,
                maxlength:10,
                minlength:10,
                number: true,
            }
        },
        messages:{
            "facebook_link":{
                required:'Please enter Facebook shared link',
                url:'Please enter valid link',
            },
            "instagram_link":{
                required:'Please enter Instagram shared link',
                url:'Please enter valid link',
            },
            "support_mail":{
                required:'Please enter support e-mail address',
                email:'Please enter valid e-mail address',
                emailCheck:'Please enter valid e-mail address',
            },
            "support_contact":{
                required:'Please enter Support contact number',
                maxlength:"Contact number must be 10 digits",
                minlength:"Contact number must be 10 digits",
                number: "Please enter valid Contact number",
            },
        },
        submitHandler: function(form) {
            var $this = $('.loader_class');
            var loadingText = '<i class="fa fa-spinner fa-spin" role="status" aria-hidden="true"></i> Loading...';
            $('.loader_class').prop("disabled", true);
            $this.html(loadingText);
            form.submit();
        },
    });

    $("#admin_create_form").validate({
        ignore: "not:hidden",
        onfocusout: function(element) {
            this.element(element);  
        },
        rules: {
            "first_name":{
                required:true,
            },
            "last_name":{
                required:true,
            },
            "email":{
                required:true,
                email:true,
                emailCheck:true,
                remote: {
                    url : customurl+"/admin/user/check/email",
                    type: "get",
                    data: {
                        email: function() {
                          return $("#email").val();
                        },
                    },
                },
            },
            "phone":{
                required:true,
                maxlength:10,
                minlength:10,
                number: true,
            },
            "password":{
                required:true,
                minlength:6,
            },
            "c_password":{
                equalTo:'#password',
            },
            "status":{
                required:true,
            },
        },
        messages:{
            "password":{
                required:'Please Enter Password',
                minlength:'Please Password must be 6 character',
            },
            "c_password":'Password and Confirm Password must match',
            "status":'Please select status',
            "email":{
                required:'Please enter e-mail address',
                email:'Please enter valid e-mail address',
                emailCheck:'Please enter valid e-mail address',
                remote:"Entered email is already exists in our record.",
            },
            "first_name":{
                required:'Please enter First Name',
            },
            "last_name":{
                required:'Please enter Last Name',
            },
            "phone":{
                required:'Please enter Phone number',
                maxlength:"Phone Number must be 10 digits",
                minlength:"Phone Number must be 10 digits",
                number: "Please enter valid Phone Number",
            },
        },
        submitHandler: function(form) {
            var $this = $('.loader_class');
            var loadingText = '<i class="fa fa-spinner fa-spin" role="status" aria-hidden="true"></i> Loading...';
            $('.loader_class').prop("disabled", true);
            $this.html(loadingText);
            form.submit();
        },
    });

    $("#change_subscription_data").validate({
        ignore: "not:hidden",
        onfocusout: function(element) {
            this.element(element);  
        },
        rules: {
            "amount":{
                required:true,
                number: true,
            }
        },
        messages:{
            "amount":{
                required:'Please enter Amount',
                number: "Please enter valid Amount",
            },
        },
        submitHandler: function(form) {
            var $this = $('.loader_class');
            var loadingText = '<i class="fa fa-spinner fa-spin" role="status" aria-hidden="true"></i> Loading...';
            $('.loader_class').prop("disabled", true);
            $this.html(loadingText);
            form.submit();
        },
    });

    $("#commission_data").validate({
        ignore: "not:hidden",
        onfocusout: function(element) {
            this.element(element);  
        },
        rules: {
            "amount":{
                required:true,
                number: true,
            }
        },
        messages:{
            "amount":{
                required:'Please enter Amount',
                number: "Please enter valid Amount",
            },
        },
        submitHandler: function(form) {
            var $this = $('.loader_class');
            var loadingText = '<i class="fa fa-spinner fa-spin" role="status" aria-hidden="true"></i> Loading...';
            $('.loader_class').prop("disabled", true);
            $this.html(loadingText);
            form.submit();
        },
    });

    $("#stylist_create_form").validate({
        ignore: "not:hidden",
        onfocusout: function(element) {
            this.element(element);  
        },
        rules: {
            "first_name":{
                required:true,
            },
            "last_name":{
                required:true,
            },
            "company_name":{
                required:true,
            },
            "email":{
                required:true,
                email:true,
                emailCheck:true,
            },
            "phone":{
                required:true,
                maxlength:10,
                minlength:10,
                number: true,
            },
            "password":{
                required:true,
                minlength:6,
            },
            "c_password":{
                equalTo:'#password',
            },
            "status":{
                required:true,
            },
        },
        messages:{
            "password":{
                required:'Please enter Password',
                minlength:'Please Password must be 6 character',
            },
            "company_name":{
                required:'Please enter Company Name',
            },
            "c_password":'Password and Confirm Password must match',
            "status":'Please select status',
            "email":{
                required:'Please enter e-mail address',
                email:'Please enter valid e-mail address',
                emailCheck:'Please enter valid e-mail address',
            },
            "first_name":{
                required:'Please enter First Name',
            },
            "last_name":{
                required:'Please enter Last Name',
            },
            "phone":{
                required:'Please enter Phone number',
                maxlength:"Phone Number must be 10 digits",
                minlength:"Phone Number must be 10 digits",
                number: "Please enter valid Phone Number",
            },
        },
        submitHandler: function(form) {
            var $this = $('.loader_class');
            var loadingText = '<i class="fa fa-spinner fa-spin" role="status" aria-hidden="true"></i> Loading...';
            $('.loader_class').prop("disabled", true);
            $this.html(loadingText);
            form.submit();
        },
    });

    $("#client_update_form").validate({
        ignore: "not:hidden",
        onfocusout: function(element) {
            this.element(element);  
        },
        rules: {
            "first_name":{
                required:true,
            },
            "last_name":{
                required:true,
            },
            "phone":{
                required:true,
                maxlength:10,
                minlength:10,
                number: true,
            },
            "status":{
                required:true,
            },
        },
        messages:{
            "first_name":{
                required:'Please enter First Name',
            },
            "last_name":{
                required:'Please enter Last Name',
            },
            "phone":{
                required:'Please enter Phone number',
                maxlength:"Phone Number must be 10 digits",
                minlength:"Phone Number must be 10 digits",
                number: "Please enter valid Phone Number",
            },
            "status" : {
                required : "Please select status",
            }
        },
        submitHandler: function(form) {
            var $this = $('.loader_class');
            var loadingText = '<i class="fa fa-spinner fa-spin" role="status" aria-hidden="true"></i> Loading...';
            $('.loader_class').prop("disabled", true);
            $this.html(loadingText);
            form.submit();
        },
    });

    $("#admin_update_form").validate({
        ignore: "not:hidden",
        onfocusout: function(element) {
            this.element(element);  
        },
        rules: {
            "first_name":{
                required:true,
            },
            "last_name":{
                required:true,
            },
            "phone":{
                required:true,
                maxlength:10,
                minlength:10,
                number: true,
            },
            "status":{
                required:true,
            },
        },
        messages:{
            "first_name":{
                required:'Please enter First Name',
            },
            "last_name":{
                required:'Please enter Last Name',
            },
            "phone":{
                required:'Please enter Phone number',
                maxlength:"Phone Number must be 10 digits",
                minlength:"Phone Number must be 10 digits",
                number: "Please enter valid Phone Number",
            },
            "status" : {
                required : "Please select status",
            }
        },
        submitHandler: function(form) {
            var $this = $('.loader_class');
            var loadingText = '<i class="fa fa-spinner fa-spin" role="status" aria-hidden="true"></i> Loading...';
            $('.loader_class').prop("disabled", true);
            $this.html(loadingText);
            form.submit();
        },
    });
    $("#stylist_update_form").validate({
        ignore: "not:hidden",
        onfocusout: function(element) {
            this.element(element);  
        },
        rules: {
            "first_name":{
                required:true,
            },
            "company_name":{
                required:true,
            },
            "last_name":{
                required:true,
            },
            "phone":{
                required:true,
                maxlength:10,
                minlength:10,
                number: true,
            },
            "status":{
                required:true,
            },
        },
        messages:{
            "first_name":{
                required:'Please enter First Name',
            },
            "last_name":{
                required:'Please enter Last Name',
            },
            "company_name":{
                required:'Please enter Company Name',
            },
            "phone":{
                required:'Please enter Phone number',
                maxlength:"Phone Number must be 10 digits",
                minlength:"Phone Number must be 10 digits",
                number: "Please enter valid Phone Number",
            },
            "status" : {
                required : "Please select status",
            }
        },
        submitHandler: function(form) {
            var $this = $('.loader_class');
            var loadingText = '<i class="fa fa-spinner fa-spin" role="status" aria-hidden="true"></i> Loading...';
            $('.loader_class').prop("disabled", true);
            $this.html(loadingText);
            form.submit();
        },
    });

    $("#change_password_form").validate({
        ignore: "not:hidden",
        onfocusout: function(element) {
            this.element(element);  
        },
        rules: {
            "current_password":{
                required:true,
                minlength:6,
            },
            "new_password":{
                required:true,
                minlength:6,
            },
            "confirm_password":{
                required:true,
                minlength:6,
                equalTo:'#new_password'
            },
        },
        messages:{
            "current_password":{
                required:'Please enter current password',
            },
            "new_password":{
                required:'Please enter new password',
                minlength:'Please Password must be 8 character',
            },
            "confirm_password":{
                required:'Please enter confirm password',
                equalTo:'New password and confirm new password are not match',
                minlength:'Please Password must be 8 character',
            },
        },
        submitHandler: function(form) {
            var $this = $('.loader_class');
            var loadingText = '<i class="fa fa-spinner fa-spin" role="status" aria-hidden="true"></i>Loading...';
            $('.loader_class').prop("disabled", true);
            $this.html(loadingText);
            form.submit();
        },
    });

    $("#update_profile_form").validate({
        ignore: "not:hidden",
        onfocusout: function(element) {
            this.element(element);  
        },
        rules: {
            "email":{
                required:true,
                email:true,
                emailCheck:true,
            },
            "first_name":{
                required:true,
            },
            "last_name":{
                required:true,
            },
            "company_name":{
                required:true,
            },
            "phone":{
                required:true,
                maxlength:10,
                minlength:10,
                number: true,
            },
            "image":{
                extension:true
            },
        },
        messages: {
            "email":{
                required:'Please enter e-mail address',
                email:'Please enter valid e-mail address',
                emailCheck:'Please enter valid e-mail address',
            },
            "first_name":{
                required:'Please enter First Name',
            },
            "last_name":{
                required:'Please enter Last Name',
            },
            "company_name":{
                required:'Please enter Company Name',
            },
            "phone":{
                required:'Please enter Phone number',
                maxlength:"Phone Number must be 10 digits",
                minlength:"Phone Number must be 10 digits",
                number: "Please enter valid Phone Number",
            },
        },
        submitHandler: function(form) {
            var $this = $('.loader_class');
            var loadingText = '<i class="fa fa-spinner fa-spin" role="status" aria-hidden="true"></i> Loading...';
            $('.loader_class').prop("disabled", true);
            $this.html(loadingText);
            form.submit();
        }
    });

    $("#cms_page_form").validate({
        ignore: "not:hidden",
        onfocusout: function(element) {
            this.element(element);  
        },
        rules: {
            "title":{
                required:true,
            },
            "description":{
                required:true,
            },
            "status":{
                required:true,
            },
        },
        messages: {
            "title":{
                required:'Please enter Title',
            },
            "description":{
                required:'Please enter Description',
            },
            "status":{
                required:'Please select status',
            },
        },
        submitHandler: function(form) {
            var $this = $('.loader_class');
            var loadingText = '<i class="fa fa-spinner fa-spin" role="status" aria-hidden="true"></i> Loading...';
            $('.loader_class').prop("disabled", true);
            $this.html(loadingText);
            form.submit();
        }
    });

    $("#service_form").validate({
        ignore: "not:hidden",
        onfocusout: function(element) {
            this.element(element);  
        },
        rules: {
            "name":{
                required:true,
            },
            "status":{
                required:true,
            }
        },
        messages: {
            "name":{
                required:'Please enter Name',
            },
            "status":{
                required:'Please select status',
            }
        },
        submitHandler: function(form) {
            var $this = $('.loader_class');
            var loadingText = '<i class="fa fa-spinner fa-spin" role="status" aria-hidden="true"></i> Loading...';
            $('.loader_class').prop("disabled", true);
            $this.html(loadingText);
            form.submit();
        }
    });

    $.validator.addMethod("time24", function(value, element) {
        if (!/^\d{2}:\d{2}:\d{2}$/.test(value)) return false;
        var parts = value.split(':');
        if (parts[0] > 23 || parts[1] > 59 || parts[2] > 59) return false;
        return true;
    }, "Invalid time format.");


    $.validator.addMethod("emailCheck", function (value, element, param) {
        var check_result = false;
        result = this.optional( element ) || /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/.test( value );
        return result;
    });

    $.validator.addMethod('filesize', function (value, element, param) {
        return this.optional(element) || (element.files[0].size <= param)
    }, 'File size must be less than 40MB');

    $.validator.addMethod("extension", function (value, element, param) {
        param = typeof param === "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
        return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
    }, "Please enter a value with a valid extension.");

});