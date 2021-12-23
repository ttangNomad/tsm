$(document).ready(function () {
    let url = '/color_master/data';
    let option = null;
    let ColorName, ColorID, SupplyMatl, rows, data;
    //MOSTRAR
    function fill_colormaster() {
        tableColor = $('#tableColor').DataTable({
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
                    "data": "ColorName"
                },
                {
                    "data": "SupplyMatl"
                },
                {
                    "data": "ColorID"
                },
                {
                    "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-primary p-1 m-2' id='btnEditColor'  data-toggle='modal'  data-target='#modalColorMaster' style='width: 2rem;''><i class='fa fa-pencil-square-o'></i></button><button  class='btn btn-danger p-1 m-2' id='btnDelColor' data-toggle='modal' data-target='#modalDeleteConfirm' style='width: 2rem;''><i class='fa fa-remove'></i></button></div></div>"
                }
            ],"columnDefs":[
                {
                    "targets": [3],
                    "visible": false
                },
            ],
        });
    }
    fill_colormaster()
    
    //CREATE
    $("#addColor").click(function () {
        option = 'create';
        id = null;
        $("#formColorMaster").trigger("reset");
        $(".modal-title").text("Add Color");
    });

    //EDITER
    $(document).on("click", "#btnEditColor", function () {
        option = 'edit';
        rows = $(this).closest("tr");
        ColorID = tableColor.rows(rows).data()[0].ColorID;
        ColorName = rows.find('td:eq(1)').text();
        SupplyMatl = rows.find('td:eq(2)').text();
        $(".modal-title").text("Edit Color");
        $("#modalInpInkNo").val(ColorName);
        $("#modalColorSupplySelect").val(SupplyMatl);
    });

    //Delete
    $(document).on("click", "#btnDelColor", function () {
        rows = $(this).closest('tr');
        ColorID = tableColor.rows(rows).data()[0].ColorID;
        $(".modal-title").text("Confirm Delete");
        $("#btnYes").unbind("click");
        $(".btnYes").click(function () {
            $.ajax({
                url: "/color_master/delete/"+ColorID,
                method: 'delete',
                contentType: 'application/json',
                success: function(){
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Deleted',
                        text: 'Color have been deleted',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableColor.ajax.reload(null, false);
                }
            })
            $('#modalDeleteConfirm').modal('hide');
        })
    });

    $('#formColorMaster').submit(function (e) {
        e.preventDefault();
        ColorName = $.trim($('#modalInpInkNo').val());
        SupplyMatl = $.trim($('#modalColorSupplySelect').val());
        if (option == 'create') {
            $.ajax({
                url: "/color_master/add",
                method: 'post',
                contentType: 'application/json',
                data: JSON.stringify({
                    ColorName: ColorName,
                    SupplyMatl: SupplyMatl
                }),
                success: function (){
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Created',
                        text: 'Color have been created',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableColor.ajax.reload(null, false);
                    $('#modalColorMaster').modal('hide');
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
                url: "/color_master/edit/"+ColorID,
                method: 'put',
                contentType: 'application/json',
                data: JSON.stringify({
                    ColorName: ColorName,
                    SupplyMatl: SupplyMatl
                }),
                success: function (){
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Color have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableColor.ajax.reload(null, false);
                    $('#modalColorMaster').modal('hide');
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