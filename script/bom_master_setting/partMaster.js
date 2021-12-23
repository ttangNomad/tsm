$(document).ready(function () {
    let url = '/part_master/data';
    let option = null;
    let PartID, PartCode, PartName, Supplier,SupplyMatl, rows,AxPartNo,data;
    //MOSTRAR
    function fill_Partmaster(){
        tablePart = $('#tablePart').DataTable({
            "bDestroy":true,
            "ajax":{
                "url": url,
                "dataSrc":""
            },
            "columns":[
                {"data":"index"},
                {"data":"PartCode"},
                {"data":"PartName"},
                {"data":"Supplier"},
                {"data":"SupplyMatl"},
                {"data":"AxPartNo"},
                {"defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-primary p-1 m-2' id='btnEditPart'  data-toggle='modal'  data-target='#modalPartMaster' style='width: 2rem;''><i class='fa fa-pencil-square-o'></i></button><button  class='btn btn-danger p-1 m-2' id='btnDelPart' data-toggle='modal' data-target='#modalDeleteConfirm' style='width: 2rem;''><i class='fa fa-remove'></i></button></div></div>"},
                {"data":"PartID"}
            ],
            "columnDefs":[
                {
                    "targets": [7],
                    "visible": false
                },
            ],
        });
    }
    fill_Partmaster()



    //create
    $("#addPart").click(function(){
        option='create';
        id=null;
        $("#formPartMaster").trigger("reset");
        $(".modal-title").text("Add Part");
    });

    //edit
    $(document).on("click", "#btnEditPart", function(){
        option='edit';
        rows = $(this).closest("tr");
        PartID = tablePart.rows(rows).data()[0].PartID;
        PartCode = rows.find('td:eq(1)').text();
        PartName = rows.find('td:eq(2)').text();
        Supplier = rows.find('td:eq(3)').text();
        SupplyMatl = rows.find('td:eq(4)').text();
        AxPartNo = rows.find('td:eq(5)').text();
        $(".modal-title").text("Edit Part");
        $("#modalInpPartCode").val(PartCode);
        $("#modalInpPartName").val(PartName);
        $("#modalInpSupplier").val(Supplier);
        $("#modalInpSupplyMat").val(SupplyMatl);
        $("#modalInpAX").val(AxPartNo);
    });

    //Delete
    $(document).on("click", "#btnDelPart", function(){
        rows = $(this).closest("tr");
        $(".btnYes").unbind("click")
        PartID = tablePart.rows(rows).data()[0].PartID;
        $(".modal-title").text("Confirm Delete");
        $(".btnYes").click(function(){
            $.ajax({
                url: "/part_master/delete/"+PartID,
                method: 'delete',
                contentType: 'application/json',
                success: function(data) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Deleted',
                        text: 'Part have been deleted',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tablePart.ajax.reload(null, false)
                },
                error: function(err){
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Warning',
                        text: `Can't delete. This data has relationship with other tables`,
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#FF5733'
                    })
                }
            })
        $('#modalDeleteConfirm').modal('hide');
        })
     })

    $('#formPartMaster').submit(function(e){
        e.preventDefault();
        PartCode = $.trim($('#modalInpPartCode').val());
        PartName = $.trim($('#modalInpPartName').val());
        Supplier = $.trim($('#modalInpSupplier').val());
        SupplyMatl = $.trim($('#modalInpSupplyMat').val());
        AxPartNo = $.trim($('#modalInpAX').val());
        if(option=='create'){
            $.ajax({
                url: "/part_master/add",
                method: 'post',
                contentType: 'application/json',
                data:  JSON.stringify({PartCode:PartCode, PartName:PartName, Supplier:Supplier,SupplyMatl:SupplyMatl,AxPartNo:AxPartNo}),
                success: function() {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Created',
                        text: 'Part have been created',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tablePart.ajax.reload(null, false)
                    $('#modalPartMaster').modal('hide');
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
        if(option=='edit'){
            $.ajax({
                url: "/part_master/edit/"+PartID,
                method: 'put',
                contentType: 'application/json',
                data:  JSON.stringify({PartCode:PartCode, PartName:PartName, Supplier:Supplier,SupplyMatl:SupplyMatl,AxPartNo:AxPartNo}),
                success: function() {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Part have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tablePart.ajax.reload(null, false)
                    $('#modalPartMaster').modal('hide');

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







