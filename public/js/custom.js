$(document).ready(function(){
    
    setTimeout(function(){ $('.alert').fadeOut(3000); }, 3000);

    $(document).on('click','.logout_link',function(){
        $('#logoutModal').modal('show');
    });

    $(document).on('click','.btn_loader',function(){
        var $this = $(this);
        var html = $this.html();

        var loadingText = '<i class="fa fa-spinner fa-spin" role="status" aria-hidden="true"></i> Loading...';
        $(this).html(loadingText);
        $(this).prop("disabled", true);

        setTimeout(function(){ 
            $('.btn_loader').html(html);
            $('.btn_loader').prop("disabled", false);
        }, 5000);
    });

    $(document).on('click','.icon_loader',function(){
        var $this = $(this);
        var html = $this.html();

        var loadingText = '<i class="fa fa-spinner fa-spin" role="status" aria-hidden="true"></i>';
        $(this).html(loadingText);
        $(this).prop("disabled", true);

        setTimeout(function(){ 
            $('.icon_loader').html(html);
            $('.icon_loader').prop("disabled", false);
        }, 5000);
    });

    $(document).on('click','.delete_btn',function(){
    	var href = $(this).attr('data-url');
    	$('.delete_record_btn').attr('href',href)
        $('#deleterecord').modal('show');
    });

    $(document).on('click','.stop_subscription_class',function(){
        var id = $(this).attr('data-id');
        $('.hidden_user_id').val(id)
        $('#stopSubstriptionModal').modal('show');
    });

    $(document).on('click','.payment_popup_click',function(){
        var appointment_id = $(this).attr('data-appointment_id');
        var stylist_id = $(this).attr('data-stylist_id');
        $('.hidden_appointment_id').val(appointment_id)
        $('.hidden_stylist_id').val(stylist_id)
        $('#payment_popupModal').modal('show');
    });

    $('#cms_page_table').dataTable({
        "bDestroy": true, 
        "lengthChange": false, 
        "bFilter": true,
        "pageLength": 10,
        "bPaginate": true, 
        "paging": true, 
        "bInfo": true,
        "stateSave": true,
        "scrollY": true,
        "scrollX": true,
        "language": { 
            searchPlaceholder: 'Search'
        },
        "order": [],
        "columnDefs": [
            { "orderable": false, "targets": [4] },
            { "orderable": true, "targets": [0, 1, 2, 3] }
        ]
    });

    $('#service_table').dataTable({
        "bDestroy": true, 
        "lengthChange": false, 
        "bFilter": true,
        "pageLength": 10,
        "bPaginate": true, 
        "paging": true, 
        "scrollY": true,
        "scrollX": true,
        "bInfo": true,
        "stateSave": true,
        "language": { 
            searchPlaceholder: 'Search'
        },
        "order": [],
        "columnDefs": [
            { "orderable": false, "targets": [2] },
            { "orderable": true, "targets": [0, 1] }
        ]
    });

    $('#admin_table').dataTable({
        "bDestroy": true, 
        "lengthChange": false, 
        "bFilter": true,
        "pageLength": 10,
        "bPaginate": true, 
        "paging": true, 
        "bInfo": true,
        "scrollY": true,
        "scrollX": true,
        "stateSave": true,
        "language": { 
            searchPlaceholder: 'Search'
        },
        "order": [],
        "columnDefs": [
            { "orderable": false, "targets": [0, 6] },
            { "orderable": true, "targets": [1, 2, 3, 4, 5] }
        ]
    });

    $('#client_table').dataTable({
        "bDestroy": true, 
        "lengthChange": false, 
        "bFilter": true,
        "pageLength": 10,
        "bPaginate": true, 
        "paging": true, 
        "bInfo": true,
        "scrollY": true,
        "scrollX": true,
        "stateSave": true,
        "language": { 
            searchPlaceholder: 'Search'
        },
        "order": [],
        "columnDefs": [
            { "orderable": false, "targets": [0, 5] },
            { "orderable": true, "targets": [1,2,3,4] }
        ]
    });

    $('#stylist_table').dataTable({
        "bDestroy": true, 
        "lengthChange": false, 
        "bFilter": true,
        "pageLength": 10,
        "bPaginate": true, 
        "paging": true, 
        "bInfo": true,
        "stateSave": true,
        "scrollY": true,
        "scrollX": true,
        "language": { 
            searchPlaceholder: 'Search'
        },
        "order": [],
        "columnDefs": [
            { "orderable": false, "targets": [0, 5] },
            { "orderable": true, "targets": [1,2,3,4] }
        ]
    });

    $('#payment_table').dataTable({
        "bDestroy": true, 
        "lengthChange": false, 
        "bFilter": true,
        "pageLength": 10,
        "bPaginate": true, 
        "paging": true, 
        "bInfo": true,
        "stateSave": true,
        "scrollY": true,
        "scrollX": true,
        "language": { 
            searchPlaceholder: 'Search'
        },
        "order": [],
        "columnDefs": [
            { "orderable": false, "targets": [7] },
            { "orderable": true, "targets": [0, 1, 2, 3, 4, 5, 6] }
        ]
    });

    $('#appointment_table').dataTable({
        "bDestroy": true, 
        "lengthChange": false, 
        "bFilter": true,
        "pageLength": 10,
        "bPaginate": true, 
        "paging": true, 
        "bInfo": true,
        "stateSave": true,
        "scrollY": true,
        "scrollX": true,
        "language": { 
            searchPlaceholder: 'Search'
        },
        "order": [],
        "columnDefs": [
            { "orderable": false, "targets": [6] },
            { "orderable": true, "targets": [0, 1, 2, 3, 4, 5] }
        ]
    });

    $('#track_appointment_table').dataTable({
        "bDestroy": true, 
        "lengthChange": false, 
        "bFilter": true,
        "pageLength": 10,
        "bPaginate": true, 
        "paging": true, 
        "bInfo": true,
        "stateSave": true,
        "scrollY": true,
        "scrollX": true,
        "language": { 
            searchPlaceholder: 'Search'
        },
        "order": [],
        "columnDefs": [
            { "orderable": false, "targets": [6] },
            { "orderable": true, "targets": [0, 1, 2, 3, 4, 5] }
        ]
    });

    $('#subscription_table').dataTable({
        "bDestroy": true, 
        "lengthChange": false, 
        "bFilter": true,
        "pageLength": 10,
        "bPaginate": true, 
        "paging": true, 
        "bInfo": true,
        "stateSave": true,
        "scrollY": true,
        "scrollX": true,
        "language": { 
            searchPlaceholder: 'Search'
        },
        "order": [],
        "columnDefs": [
            { "orderable": false, "targets": [5] },
            { "orderable": true, "targets": [0, 1, 2, 3, 4] }
        ]
    });

    $('#subscribed_table').dataTable({
        "bDestroy": true, 
        "lengthChange": false, 
        "bFilter": true,
        "pageLength": 10,
        "bPaginate": true, 
        "paging": true, 
        "bInfo": true,
        "stateSave": true,
        "scrollY": true,
        "scrollX": true,
        "language": { 
            searchPlaceholder: 'Search'
        },
        "order": [],
        "columnDefs": [
            { "orderable": false, "targets": [0, 6] },
            { "orderable": true, "targets": [1, 2, 3, 4, 5] }
        ]
    });

    $('#log_table_subscription').dataTable({
        "bDestroy": true, 
        "lengthChange": false, 
        "bFilter": false,
        "pageLength": 100,
        "bPaginate": false, 
        "paging": false, 
        "bInfo": false,
        "stateSave": true,
        "scrollY": true,
        "scrollX": true,
        "language": { 
            searchPlaceholder: 'Search'
        },
        "order": [],
        "columnDefs": [
            { "orderable": true, "targets": [0, 1, 2, 3, 4] }
        ]
    });
});