$(document).ready(function () {
    let url = '/injection_material_master/data';
    let option = null;
    let Code, MFG, MaterialID, SupplyMatl, Grade, Color, data;
    //MOSTRAR
    function fill_injMat() {
        tableInjectionMat = $('#tableInjectionMat').DataTable({
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
                    "data": "Grade"
                },
                {
                    "data": "Code"
                },
                {
                    "data": "Color"
                },
                {
                    "data": "SupplyMatl"
                },
                {
                    "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-primary p-1 m-2' id='btnEditInj' data-toggle='modal'  data-target='#modalInjectionMatMaster' style='width: 2rem;''><i class='fa fa-pencil-square-o'></i></button><button  class='btn btn-danger p-1 m-2' id='btnDelInj' data-toggle='modal' data-target='#modalDeleteConfirm' style='width: 2rem;''><i class='fa fa-remove'></i></button></div></div>"
                },
                {
                    "data": "MaterialID"
                }
            ],
            "columnDefs":[
                {
                    "targets": [7],
                    "visible": false
                },
            ],
        });
    }
    fill_injMat()


    //create
    $("#addInjectionMat").click(function () {
        option = 'create';
        id = null;
        $("#formInjectionMatMaster").trigger("reset");
        $(".modal-title").text("Add Injection Material");
    });

    //edit
    $(document).on("click", "#btnEditInj", function () {
        option = 'edit';
        rows = $(this).closest("tr");
        MaterialID = tableInjectionMat.rows(rows).data()[0].MaterialID;
        MFG = rows.find('td:eq(1)').text();
        Grade = rows.find('td:eq(2)').text();
        Code = rows.find('td:eq(3)').text();
        Color = rows.find('td:eq(4)').text();
        SupplyMatl = rows.find('td:eq(5)').text();
        $(".modal-title").text("Edit Injection Material");
        $("#modalInpInjMatMFG").val(MFG);
        $("#modalInpInjMatGrade").val(Grade);
        $("#modalInpInjMatCode").val(Code);
        $("#modalInpInjMatColor").val(Color);
        $("#modalInjMatSupplySelect").val(SupplyMatl);
    });

    //Delete
    $(document).on("click", "#btnDelInj", function () {
        rows = $(this).closest("tr");
        MaterialID = tableInjectionMat.rows(rows).data()[0].MaterialID;
        $(".modal-title").text("Confirm Delete");
        $(".btnYes").unbind("click")
        $(".btnYes").click(function () {
            $.ajax({
                url: "/injection_material_master/delete/"+MaterialID,
                method: 'delete',
                contentType: 'application/json',
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Deleted',
                        text: 'Injection Material have been deleted',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableInjectionMat.ajax.reload(null, false);
                }
            })
            $('#modalDeleteConfirm').modal('hide');
        })
    });

    $('#formInjectionMatMaster').submit(function (e) {
        e.preventDefault();
        MFG = $.trim($('#modalInpInjMatMFG').val());
        Grade = $.trim($('#modalInpInjMatGrade').val());
        Code = $.trim($('#modalInpInjMatCode').val());
        Color = $.trim($('#modalInpInjMatColor').val());
        SupplyMatl = $.trim($('#modalInjMatSupplySelect').val());
        if (option == 'create') {
            $.ajax({
                url: "/injection_material_master/add",
                method: 'post',
                contentType: 'application/json',
                data: JSON.stringify({
                    MFG: MFG,
                    Grade: Grade,
                    Code: Code,
                    Color: Color,
                    SupplyMatl: SupplyMatl
                }),
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Created',
                        text: 'Injection Material have been created',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableInjectionMat.ajax.reload(null, false);
                    $('#modalInjectionMatMaster').modal('hide');
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
                url: "/injection_material_master/edit/"+MaterialID,
                method: 'put',
                contentType: 'application/json',
                data: JSON.stringify({
                    MFG: MFG,
                    Grade: Grade,
                    Code: Code,
                    Color: Color,
                    SupplyMatl: SupplyMatl
                }),
                success: function (data) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Injection Material have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableInjectionMat.ajax.reload(null, false);
                    $('#modalInjectionMatMaster').modal('hide');
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