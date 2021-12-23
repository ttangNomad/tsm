$(document).ready(function () {
    let url = '/customer_master/data';
    let option = null;
    // let MachineID, MachineNo, MCSize, rows, data;
    //MOSTRAR
    function fill_customermaster() {
        tableCustomer = $('#tableCustomer').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": url,
                "dataSrc": ""
            },
            "columns": [
                {
                    "data": "index"
                },
                {
                    "data": "CustomerName"
                },
                {
                    "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-primary p-1 m-2' id='btnEditCustomer' data-toggle='modal'  data-target='#modalCustomerMaster' style='width: 2rem;''><i class='fa fa-pencil-square-o'></i></button><button  class='btn btn-danger p-1 m-2' id='btnDelCustomer' data-toggle='modal' data-target='#modalDeleteConfirm' style='width: 2rem;''><i class='fa fa-remove'></i></button></div></div>"
                },
                {
                    "data": "CustomerID"
                }
            ],
            "columnDefs":[
                {
                    "targets": [3],
                    "visible": false
                },
            ],
        });
    }
    fill_customermaster();
    
    //create
    $("#addCustomer").click(function () {
        option = 'create';
        id = null;
        $("#formCustomer").trigger("reset");
        $(".modal-title").text("Add Customer");
    });

    //edit
    $(document).on("click", "#btnEditCustomer", function () {
        option = 'edit';
        rows = $(this).closest("tr");
        CustomerID = tableCustomer.rows(rows).data()[0].CustomerID;
        CustomerName = rows.find('td:eq(1)').text();
        $(".modal-title").text("Edit Machine");
        $("#modalCustomerName").val(CustomerName);
    });

    //Delete
    $(document).on("click", "#btnDelCustomer", function () {
        rows = $(this).closest("tr");
        CustomerID = tableCustomer.rows(rows).data()[0].CustomerID;
        $(".modal-title").text("Confirm Delete");
        $(".btnYes").unbind("click")
        console.log(CustomerID);
        $(".btnYes").click(function () {
            $.ajax({
                url: "/customer_master/delete/"+CustomerID,
                method: 'delete',
                contentType: 'application/json',

                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Deleted',
                        text: 'Customer have been deleted',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableCustomer.ajax.reload(null, false);
                }
            })
            $('#modalDeleteConfirm').modal('hide');
        });
    });

    //event
    $('#formCustomer').submit(function (e) {
        e.preventDefault();
        CustomerName = $.trim($('#modalCustomerName').val());
        console.log(CustomerName);
        if (option == 'create') {
            $.ajax({
                url: "/customer_master/add",
                method: 'post',
                contentType: 'application/json',
                data: JSON.stringify({
                    CustomerName: CustomerName
                }),
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Created',
                        text: 'Customer have been created',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableCustomer.ajax.reload(null, false);
                    $('#modalCustomerMaster').modal('hide');

                },
                error: function(err){
                    errorText = err.responseJSON.message;
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Warning',
                        text: errorText,
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#FF5733'
                    });
                }
            });
        }
        if (option == 'edit') {
            $.ajax({
                url: "/customer_master/edit/"+CustomerID,
                method: 'put',
                contentType: 'application/json',
                data: JSON.stringify({

                    CustomerName: CustomerName
                }),
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Customer have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableCustomer.ajax.reload(null, false);
                    $('#modalCustomerMaster').modal('hide');
                },
                error: function(err){
                    errorText = err.responseJSON.message;
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Warning',
                        text: errorText,
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#FF5733'
                    });
                }
            });
        }
    });
});