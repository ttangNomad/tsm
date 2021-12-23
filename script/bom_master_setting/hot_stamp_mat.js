$(document).ready(function () {
    let url = '/hot_stamp_material_master/data';
    let option = null;
    let HSMID, MFG, FoilCode, SupplyMatl, data;
    //MOSTRAR
    function fill_hotstamp() {
        tableHotStampMat = $('#tableHotStampMat').DataTable({
            "bDestroy": true,
            "ajax": {
                "url": url,
                "dataSrc": ""
            },
            "columns": [{
                    "data": "index"
                },
                {
                    "data": "MFG"
                },
                {
                    "data": "FoilCode"
                },
                {
                    "data": "SupplyMatl"
                },
                {
                    "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-primary p-1 m-2' id='btnEditHot' data-toggle='modal'  data-target='#modalHotStampMatMaster' style='width: 2rem;''><i class='fa fa-pencil-square-o'></i></button><button  class='btn btn-danger p-1 m-2 ' id='btnDelHot' data-toggle='modal' data-target='#modalDeleteConfirm' style='width: 2rem;''><i class='fa fa-remove'></i></button></div></div>"
                },
                {
                    "data": "HSMID"
                }
            ],
            "columnDefs":[
                {
                    "targets": [5],
                    "visible": false
                },
            ],
            "order": [[ 0 , 'asc' ]]
        });
    }
    fill_hotstamp()


    //     create
    $("#addHotStampMat").click(function () {
        option = 'create';
        id = null;
        $("#formHotStampMat").trigger("reset");
        $(".modal-title").text("Add Hot Stamp Material:");
    });

    //edit
    $(document).on("click", "#btnEditHot", function () {
        option = 'edit';
        rows = $(this).closest("tr");
        HSMID = tableHotStampMat.rows(rows).data()[0].HSMID;
        MFG = rows.find('td:eq(1)').text();
        FoilCode = rows.find('td:eq(2)').text();
        SupplyMatl = rows.find('td:eq(3)').text();
        $(".modal-title").text("Edit Hot Stamp Material:");
        $("#modalInpHotMatMFG").val(MFG);
        $("#modalInpHotMatCode").val(FoilCode);
        $("#modalHotMatSupplySelect").val(SupplyMatl);
    });

    //Delete
    $(document).on("click", "#btnDelHot", function () {
        rows = $(this).closest("tr");
        HSMID = tableHotStampMat.rows(rows).data()[0].HSMID;
        $(".modal-title").text("Confirm Delete");
        $(".btnYes").unbind("click")
        $(".btnYes").click(function () {
            $.ajax({
                url: "/hot_stamp_material_master/delete/"+HSMID,
                method: 'delete',
                contentType: 'application/json',
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Deleted',
                        text: 'Hot Stamp Material have been deleted',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableHotStampMat.ajax.reload(null, false);
                }
            })
            $('#modalDeleteConfirm').modal('hide');
        })
    });

    $('#formHotStampMat').submit(function (e) {
        e.preventDefault();
        MFG = $.trim($('#modalInpHotMatMFG').val());
        FoilCode = $.trim($('#modalInpHotMatCode').val());
        SupplyMatl = $.trim($('#modalHotMatSupplySelect').val());

        if (option == 'create') {
            $.ajax({
                url: "/hot_stamp_material_master/add",
                method: 'post',
                contentType: 'application/json',
                data: JSON.stringify({
                    MFG: MFG,
                    FoilCode: FoilCode,
                    SupplyMatl: SupplyMatl
                }),
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Created',
                        text: 'Hot Stamp Material have been created',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableHotStampMat.ajax.reload(null, false);
                    $('#modalHotStampMatMaster').modal('hide');
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
                url: "/hot_stamp_material_master/edit/"+HSMID,
                method: 'put',
                contentType: 'application/json',
                data: JSON.stringify({
                    MFG: MFG,
                    FoilCode: FoilCode,
                    SupplyMatl: SupplyMatl
                }),
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Hot Stamp Material have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableHotStampMat.ajax.reload(null, false);
                    $('#modalHotStampMatMaster').modal('hide');

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