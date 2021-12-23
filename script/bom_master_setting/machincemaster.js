$(document).ready(function () {
    let url = '/machine_master/data';
    let option = null;
    let MachineID, MachineNo, MCSize, rows, data;
    //MOSTRAR
    function fill_machinemaster() {
        tableMachine = $('#tableMachine').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": url,
                "dataSrc": ""
            },
            "columns": [{
                    "data": "index"
                },
                {
                    "data": "MachineNo"
                },
                {
                    "data": "MCSize"
                },
                {
                    "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-primary p-1 m-2' id='btnEditMachine' data-toggle='modal'  data-target='#modalMachineMaster' style='width: 2rem;''><i class='fa fa-pencil-square-o'></i></button><button  class='btn btn-danger p-1 m-2' id='btnDelMachine' data-toggle='modal' data-target='#modalDeleteConfirm' style='width: 2rem;''><i class='fa fa-remove'></i></button></div></div>"
                },
                {
                    "data": "MachineID"
                }
            ],
            "columnDefs":[
                {
                    "targets": [4],
                    "visible": false
                },
            ],
        });
    }
    fill_machinemaster();
    
    //create
    $("#addMachine").click(function () {
        option = 'create';
        id = null;
        $("#formMachineMaster").trigger("reset");
        $(".modal-title").text("Add Machine");
    });

    //edit
    $(document).on("click", "#btnEditMachine", function () {
        option = 'edit';
        rows = $(this).closest("tr");
        MachineID = tableMachine.rows(rows).data()[0].MachineID;
        MachineNo = rows.find('td:eq(1)').text();
        MCSize = rows.find('td:eq(2)').text();
        $(".modal-title").text("Edit Machine");
        $("#modalInpMachineNo").val(MachineNo);
        $("#modalInpMachineSize").val(MCSize);
    });

    //Delete
    $(document).on("click", "#btnDelMachine", function () {
        rows = $(this).closest("tr");
        MachineID = tableMachine.rows(rows).data()[0].MachineID;
        $(".modal-title").text("Confirm Delete");
        $(".btnYes").unbind("click")
        $(".btnYes").click(function () {
            $.ajax({
                url: "/machine_master/delete/"+MachineID,
                method: 'delete',
                contentType: 'application/json',

                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Deleted',
                        text: 'Machine have been deleted',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableMachine.ajax.reload(null, false);
                }
            })
            $('#modalDeleteConfirm').modal('hide');
        });
    });


    $('#formMachineMaster').submit(function (e) {
        e.preventDefault();
        MachineNo = $.trim($('#modalInpMachineNo').val());
        MCSize = $.trim($('#modalInpMachineSize').val());
        if (option == 'create') {
            $.ajax({
                url: "/machine_master/add",
                method: 'post',
                contentType: 'application/json',
                data: JSON.stringify({
                    MachineNo: MachineNo,
                    MCSize: MCSize
                }),
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Created',
                        text: 'Machine have been created',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableMachine.ajax.reload(null, false);
                    $('#modalMachineMaster').modal('hide');

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
                url: "/machine_master/edit/"+MachineID,
                method: 'put',
                contentType: 'application/json',
                data: JSON.stringify({

                    MachineNo: MachineNo,
                    MCSize: MCSize
                }),
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Machine have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableMachine.ajax.reload(null, false);
                    $('#modalMachineMaster').modal('hide');
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