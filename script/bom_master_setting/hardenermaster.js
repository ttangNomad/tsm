$(document).ready(function () {
    let url = '/hardener_master/data';
    let option = null;
    let HardenerID, HardenerName, SupplyMatl, rows, data;
    //MOSTRAR
    function fill_hardener() {
        tableHardener = $('#tableHardener').DataTable({
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
                    "data": "HardenerName"
                },
                {
                    "data": "SupplyMatl"
                },
                {
                    "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-primary p-1 m-2' id='btnEditHardener'  data-toggle='modal'  data-target='#modalHardenerMaster' style='width: 2rem;''><i class='fa fa-pencil-square-o'></i></button><button  class='btn btn-danger p-1 m-2' id='btnDelHardener' data-toggle='modal' data-target='#modalDeleteConfirm' style='width: 2rem;''><i class='fa fa-remove'></i></button></div></div>"
                },
                {
                    "data": "HardenerID"
                }
            ],"columnDefs":[
                {
                    "targets": [4],
                    "visible": false
                },
            ],
            "order": [[ 0 , 'asc' ]]
        });
    }
    fill_hardener()

    //create
    $("#addHardener").click(function () {
        option = 'create';
        id = null;
        $("#formHardenerMaster").trigger("reset");
        $(".modal-title").text("Add Hardener");
    });

    //edit
    $(document).on("click", "#btnEditHardener", function () {
        option = 'edit';
        rows = $(this).closest("tr");
        HardenerID = tableHardener.rows(rows).data()[0].HardenerID;
        HardenerName = rows.find('td:eq(1)').text();
        SupplyMatl = rows.find('td:eq(2)').text();
        $(".modal-title").text("Edit Hardener");
        $("#modalInpHardener").val(HardenerName);
        $("#modalHardenerSupplySelect").val(SupplyMatl);
    });

    //BORRAR
    $(document).on("click", "#btnDelHardener", function () {
        rows = $(this).closest("tr");
        HardenerID = tableHardener.rows(rows).data()[0].HardenerID;
        $(".modal-title").text("Confirm Delete");
        $(".btnYes").unbind("click")
        $(".btnYes").click(function () {
            $.ajax({
                url: "/hardener_master/delete/"+HardenerID,
                method: 'delete',
                contentType: 'application/json',
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Deleted',
                        text: 'Hardener have been deleted',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableHardener.ajax.reload(null, false);
                }
            })
            $('#modalDeleteConfirm').modal('hide');
        })
    });

    $('#formHardenerMaster').submit(function (e) {
        e.preventDefault();
        HardenerName = $.trim($('#modalInpHardener').val());
        SupplyMatl = $.trim($('#modalHardenerSupplySelect').val());
        if (option == 'create') {
            $.ajax({
                url: "/hardener_master/add",
                method: 'post',
                contentType: 'application/json',
                data: JSON.stringify({
                    HardenerName: HardenerName,
                    SupplyMatl: SupplyMatl
                }),
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Created',
                        text: 'Hardener have been created',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableHardener.ajax.reload(null, false);
                }
            });
        }
        if (option == 'edit') {
            $.ajax({
                url: "/hardener_master/edit/"+HardenerID,
                method: 'put',
                contentType: 'application/json',
                data: JSON.stringify({
                    HardenerName: HardenerName,
                    SupplyMatl: SupplyMatl
                }),
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Hardener have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableHardener.ajax.reload(null, false);
                }
            });

        }
        $('#modalHardenerMaster').modal('hide');
    });
});