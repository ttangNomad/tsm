$(document).ready(function () {
    let url = '/thinner_master/data';
    let option = null;
    let ThinnerID, ThinnerName, SupplyMatl, rows, data;
    //MOSTRAR
    function fill_Thinnermaster() {
        tableThinner = $('#tableThinner').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": url,
                "dataSrc": ""
            },
            "columns": [{
                    "data": "index"
                },
                {
                    "data": "ThinnerName"
                },
                {
                    "data": "SupplyMatl"
                },

                {
                    "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-primary p-1 m-2' id='btnEditThin' data-toggle='modal'  data-target='#modalThinnerMaster' style='width: 2rem;''><i class='fa fa-pencil-square-o'></i></button><button  class='btn btn-danger p-1 m-2' id='btnDelThin' data-toggle='modal' data-target='#modalDeleteConfirm' style='width: 2rem;''><i class='fa fa-remove'></i></button></div></div>"
                },
                {
                    "data": "ThinnerID"
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
    fill_Thinnermaster()

    //create
    $("#addThinner").click(function () {
        option = 'create';
        id = null;
        $("#formThinnerMaster").trigger("reset");
        $(".modal-title").text("Add Thinner");
    });

    //edit
    $(document).on("click", "#btnEditThin", function () {
        option = 'edit';
        rows = $(this).closest("tr");
        ThinnerID = tableThinner.rows(rows).data()[0].ThinnerID;
        ThinnerName = rows.find('td:eq(1)').text();
        SupplyMatl = rows.find('td:eq(2)').text();
        $(".modal-title").text("Edit Thinner");
        $("#modalInpThinner").val(ThinnerName);
        $("#modalThinnerSupplySelect").val(SupplyMatl);

    });

    //BORRAR
    $(document).on("click", "#btnDelThin", function () {
        rows = $(this).closest("tr");
        ThinnerID = tableThinner.rows(rows).data()[0].ThinnerID;
        $(".modal-title").text("Confirm Delete");
        $(".btnYes").unbind("click")
        $(".btnYes").click(function () {
            $.ajax({
                url: "/thinner_master/delete/"+ThinnerID,
                method: 'delete',
                contentType: 'application/json',
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Deleted',
                        text: 'Thinner have been deleted',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableThinner.ajax.reload(null, false);
                }
            })
            $('#modalDeleteConfirm').modal('hide');
        })
    })

    $('#formThinnerMaster').submit(function (e) {
        e.preventDefault();
        ThinnerName = $.trim($('#modalInpThinner').val());
        SupplyMatl = $.trim($('#modalThinnerSupplySelect').val());
        if (option == 'create') {
            $.ajax({
                url: "/thinner_master/add",
                method: 'post',
                contentType: 'application/json',
                data: JSON.stringify({
                    ThinnerName: ThinnerName,
                    SupplyMatl: SupplyMatl
                }),
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Created',
                        text: 'Thinner have been created',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableThinner.ajax.reload(null, false);
                    $('#modalThinnerMaster').modal('hide');
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
                url: "/thinner_master/edit/"+ThinnerID,
                method: 'put',
                contentType: 'application/json',
                data: JSON.stringify({
                    ThinnerName: ThinnerName,
                    SupplyMatl: SupplyMatl
                }),
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Thinner have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableThinner.ajax.reload(null, false);
                    $('#modalThinnerMaster').modal('hide');

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