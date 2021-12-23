$(document).ready(function () {
    let url = '/ink_master/data';
    let option = null;
    let InkQtyID, Size, InkTray, rows, data;
    //MOSTRAR
    function fill_inkmaster() {
        tableInk = $('#tableInk').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": url,
                "dataSrc": ""
            },
            "columns": [{
                    "data": "index"
                },
                {
                    "data": "Size"
                },
                {
                    "data": "InkTray"
                },
                {
                    "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-primary p-1 m-2' id='btnEditInk' data-toggle='modal'  data-target='#modalInkMaster' style='width: 2rem;''><i class='fa fa-pencil-square-o'></i></button><button  class='btn btn-danger p-1 m-2' id='btnDelInk' data-toggle='modal' data-target='#modalDeleteConfirm' style='width: 2rem;''><i class='fa fa-remove'></i></button></div></div>"
                },
                {
                    "data": "InkQtyID"
                },
            ],
            "columnDefs":[
                {
                    "targets": [4],
                    "visible": false
                },
            ],
        });
    }
    fill_inkmaster()

    //create
    $("#addInk").click(function () {
        option = 'create';
        id = null;
        $("#formInkMaster").trigger("reset");
        $(".modal-title").text("Add Ink");

    });

    //edit
    $(document).on("click", "#btnEditInk", function () {
        option = 'edit';
        rows = $(this).closest("tr");
        InkQtyID = tableInk.rows(rows).data()[0].InkQtyID;
        Size = rows.find('td:eq(1)').text();
        InkTray = rows.find('td:eq(2)').text();
        $(".modal-title").text("Edit Ink");
        $("#modalInpInkSize").val(Size);
        $("#modalInpInkTray").val(InkTray);
    });

    //Delete
    $(document).on("click", "#btnDelInk", function () {
        rows = $(this).closest("tr");
        InkQtyID = tableInk.rows(rows).data()[0].InkQtyID;
        $(".modal-title").text("Confirm Delete");
        $(".btnYes").unbind("click")
        $(".btnYes").click(function () {
            $.ajax({
                url: "/ink_master/delete/"+InkQtyID,
                method: 'delete',
                contentType: 'application/json',
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Deleted',
                        text: 'Ink have been deleted',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableInk.ajax.reload(null, false);
                }
            })
            $('#modalDeleteConfirm').modal('hide');
        })
    });
    $('#formInkMaster').submit(function (e) {
        e.preventDefault();
        Size = $.trim($('#modalInpInkSize').val());
        InkTray = $.trim($('#modalInpInkTray').val());

        if (option == 'create') {
            $.ajax({
                url: "/ink_master/add",
                method: 'post',
                contentType: 'application/json',
                data: JSON.stringify({
                    Size: Size,
                    InkTray: InkTray
                }),
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Created',
                        text: 'Ink have been created',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableInk.ajax.reload(null, false);
                }
            });
        }
        if (option == 'edit') {
            $.ajax({
                url: "/ink_master/edit/"+InkQtyID,
                method: 'put',
                contentType: 'application/json',
                data: JSON.stringify({
                    Size: Size,
                    InkTray: InkTray
                }),
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Ink have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableInk.ajax.reload(null, false);
                }
            });
        }
        $('#modalInkMaster').modal('hide');
    });
});