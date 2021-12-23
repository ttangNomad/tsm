$(document).ready(function () {
    //Fill RefNo_table
    function fill_RefNo() {
        tableRefNumber = $('#tableRefNumber').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": '/reference_no/ref',
                "dataSrc": ""
            },
            "columns": [{
                    "data": "index"
                },
                {
                    "data": "RefNo"
                },
                {
                    "data": "PartCode"
                },
                {
                    "data": "PartName"
                },
                {
                    "data": "CustomerName"
                },
                {
                    "data": "Model"
                },
                {
                    "data": "AxPartNo"
                },
                {
                    "data": "Status"
                },
                {
                    "render": function (data, type, row, meta) {
                        DateTime = row.IssueDate
                        if (!DateTime) {
                            return null
                        } else {
                            DataShow = DateTime.split('T')[0];
                            return DataShow
                        }
                    }
                },
                {
                    "data": "Description"
                },
                {
                    "data": "Remark"
                },
                {
                    "data": "RefID"
                },
                {
                    "data": "CustomerID"
                },
                {
                    "defaultContent": '<td class="d-xl-flex justify-content-xl-center p-0"><button class="btn btn-info p-1 m-2" data-toggle="modal" data-target="#modalAddRef" id="editRef" style="width: 2rem;" type="button"><i class="fa fa-pencil-square-o"></i></button><button class="btn btn-danger p-1 m-2" data-toggle="modal" data-target="#modalDeleteConfirm" type="button" id="delRef" style="width: 2rem;"><i class="fa fa-remove"></i></button></td>'
                }

            ],
            "columnDefs": [{
                "targets": [9, 10, 11,12],
                "visible": false
            }, ],
        });

        RefID = null;
    }
    fill_RefNo()

    // Click to select RefID in table
    $("#tableRefNumber tbody").on('click', "tr", function () {

        $('#tableRefNumber tr').removeClass('selected');
        $(this).toggleClass('selected');
        rows = $(this).closest('tr');
        RefID = tableRefNumber.rows(rows).data()[0].RefID;
        RefNo = tableRefNumber.rows(rows).data()[0].RefNo;
        Index = rows.find('td:eq(0)').text();
        PartCode = rows.find('td:eq(2)').text();
        PartName = rows.find('td:eq(3)').text();
        CustomerName = rows.find('td:eq(4)').text();
        Model = rows.find('td:eq(5)').text();
        AxPartNo = rows.find('td:eq(6)').text();
        Status = rows.find('td:eq(7)').text();
        IssueDate = rows.find('td:eq(8)').text();
        Description = tableRefNumber.rows(rows).data()[0].Description;
        Remark = tableRefNumber.rows(rows).data()[0].Remark;
        CustomerId = tableRefNumber.rows(rows).data()[0].CustomerID;
        $.ajax({
            url: '/image/' + RefID,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                let path = response.PictureRootPath;
                if (path == null) {
                    $("#preview").attr("src", "/img/201-image.svg");
                } else {
                    $("#preview").attr("src", path);
                }
            },
            error: function () {
                alert('ajax upload error')
            }
        })
        $('#indexBOM').text(Index);
        $('#custBOM').text(CustomerName);
        $('#refBOM').text(RefNo);
    })


    //BTN Add Ref
    $(document).on("click", "#addRef", function () {
        $("#formAddRef").trigger("reset");
        $(".modal-title").text("Add Ref:");
        $("#refPart").hide("");
        // RefNo = $.trim($("#modalInpRefNo").val());
        $("#modalSaveRef").unbind("click")
        $("#modalSaveRef").click(function () {
            RefNo = $.trim($("#modalInpRefNo").val());
            Model = $.trim($("#modalInpModel").val());
            CustomerId = $.trim($("#modalInpCustomer").val());
            Status = $.trim($("#ModalSelStatus").val());
            IssueDate = $.trim($("#modalSelDate").val());
            Description = $.trim($("#modalInpDescription").val());
            Remark = $.trim($("#modalInpRemark").val());
            if (RefNo == "" || Model == "" || CustomerId == "" || Status == "" || IssueDate == "") {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Warning',
                    text: "Please fill input",
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#FF5733'
                });
            } else {
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    url: "/reference_no/add_ref",
                    data: JSON.stringify({
                        RefNo: RefNo,
                        Model: Model,
                        CustomerId: CustomerId,
                        Status: Status,
                        IssueDate: IssueDate,
                        Description: Description,
                        Remark: Remark
                    }),
                    success: function (data) {
                        fill_RefNo()
                        RefID = data.RefID;
                        fill_TablePart(RefID)

                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Saved',
                            text: 'Reference have been saved',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        $("#refPart").show("modal");
                        tableRefNumber.ajax.reload(null, false)

                        // $.getScript("injection.js",function(){
                        //     fill_Injection(null)
                        // })
                        // fill_Injection(null)
                        // fill_tableHotStampList(null)
                        // fill_tableAssyList(null)
                        // fill_tableSprayList(null)
                        // fill_tablePrintList(null)
                        // fill_tableWeldList(null)

                    },
                    error: function (err) {
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
                })
            }
        })
    });
    //BTN edit
    $(document).on('click', '#editRef', function () {
        $('#refPart').show('modal')

        fill_TablePart(RefID)
        $(".modal-title").text("Edit Ref:");
        $(this).toggleClass('selected');
        rows = $(this).closest('tr');
        RefNo = rows.find('td:eq(1)').text();

        $("#modalInpRefNo").val(RefNo);
        $("#modalInpModel").val(Model);
        $('#modalInpCustomer').val(CustomerId)
        // $('#modalInpCustomer option').filter(function () {
        //     dropdowntext = $(this).text();
        //     return dropdowntext.startsWith(CustomerName);
        // }).prop('selected', true);
        $("#ModalSelStatus").val(Status);
        $("#modalSelDate").val(IssueDate);
        $("#modalInpDescription").val(Description);
        $("#modalInpRemark").val(Remark);
        $(".selectpicker").selectpicker("refresh")
        $("#modalSaveRef").unbind('click')
        $("#modalSaveRef").click(function () {
            RefNo = $.trim($("#modalInpRefNo").val());
            Model = $.trim($("#modalInpModel").val());
            CustomerId = $.trim($("#modalInpCustomer").val());
            Status = $.trim($("#ModalSelStatus").val());
            IssueDate = $.trim($("#modalSelDate").val());
            Description = $.trim($("#modalInpDescription").val());
            Remark = $.trim($("#modalInpRemark").val());
            $.ajax({
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/reference_no/edit_ref/" + RefID,
                data: JSON.stringify({
                    RefNo: RefNo,
                    Model: Model,
                    CustomerId: CustomerId,
                    Status: Status,
                    IssueDate: IssueDate,
                    Description: Description,
                    Remark: Remark
                }),
                success: function () {
                    tableRefNumber.ajax.reload(null, false);
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Reference have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        })
    })

    // BTN delete ref
    $(document).on('click', '#delRef', function () {
        $('.modal-title').text('Confirm Delete')
        rows = $(this).closest('tr');
        RefID = tableRefNumber.rows(rows).data()[0].RefID;
        $("#btnYes").unbind("click")
        $("#btnYes").click(function () {
            $.ajax({
                type: "delete",
                url: "/reference_no/delete_ref/" + RefID,
                contentType: "application/json",
                success: function () {
                    fill_RefNo()
                    $('#modalDeleteConfirm').modal('hide');
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Deleted',
                        text: 'Reference have been deleted',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    window.location.reload();


                }
            });
        })
    })


    //Fill Table part
    function fill_TablePart(RefID) {
        $('#modalSelPart').val("null")
        tablePartDetail = $("#modalTablePartDetail").DataTable({
            "bDestroy": true,

            "ajax": {
                "url": "/reference_no/part_no/" + RefID,
                "dataSrc": "",
                "method": "get",
            },
            "columns": [{
                    "data": "index"
                },
                {
                    "data": "PartCode"
                },
                {
                    "data": "PartName"
                },
                {
                    "data": "PartID"
                }
            ],
            "columnDefs": [{
                "targets": [3],
                "visible": false
            }, ],
        });
    }

    //Add Part No.
    $(document).on('click', '#btnAddPart', function () {
        PartID = $('#modalSelPart').val();
        $.ajax({
            url: "/reference_no/add_part/" + RefID,
            method: 'post',
            contentType: 'application/json',
            data: JSON.stringify({
                PartID: PartID,
                RefID: RefID
            }),
            success: function () {
                tableRefNumber.ajax.reload(null, false);
                tablePartDetail.ajax.reload(null, false);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Added',
                    text: 'Part have been added',
                    showConfirmButton: false,
                    timer: 1500
                });
            },
            error: function (err) {
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
    })

    //Select Part No in Table
    $("#modalTablePartDetail").on("click", "tr", function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            PartID = null;
        } else {
            $('#modalTablePartDetail tr').removeClass('selected');
            $(this).toggleClass('selected');
            PartID = tablePartDetail.rows($(this)).data()[0].PartID;
        }
    })

    //delete part
    $(document).on('click', '#btnDelPart', function () {
        $.ajax({
            type: "delete",
            url: "/reference_no/delete_part/" + RefID,
            data: JSON.stringify({
                PartID: PartID
            }),
            contentType: 'application/json',
            success: function () {
                fill_TablePart(RefID);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Deleted',
                    text: 'Part have been deleted.',
                    showConfirmButton: false,
                    timer: 1500
                });
            },
            error: function (err) {
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
    })
});