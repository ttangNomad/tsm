$(document).ready(function () {

    

    $("#linkAssembly").click(function(){
        AssyProcID = PartID = ProcessName = PartID_OUT = null;
        CompID = PartCode = PartName = Qty = Supplier =  RefNo = null;
        JigID = ProcessName = JigName = JigNo = PcsHr = Operator = null;
    })

    //Fill tableAssyList
    function fill_tableAssyList(RefID) {
        tableAssyList = $('#tableAssyList').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": '/assembly/assembly_list/' + RefID,
                "dataSrc": ""
            },
            "columns": [
                {"data": "index"},
                {"data": "ProcessName"},
                {"data": "PartName"},
                {"data": "AssyProcID"},
                {"data": "PartID"}
            ],
            "columnDefs": [{
                    "targets": [3,4],
                    "visible": false
                }
            ],
            "initComplete": function () {
                CountRows = tableAssyList.data().count()
                $('#badgeAssembly').text(CountRows)
            },
        });
        fill_tableAssyPart(null)
        fill_tableAssyJig(null)
    }
    //click btn add AssyListAdd
    $(document).on('click', '#btnAssyListAdd', function (e) {
        if (!RefID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select RefNo.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function(result){       //Close modal when Swal close
                if (result.value) {
                    $('#modal_AssyProcessAdd').addClass('programmatic');
                    $('#modal_AssyProcessAdd').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        } else {
        $('#form_AssyAddProcess').trigger('reset');
        $('.modal-title').text('Add Process:')
        $(".selectpicker").selectpicker("refresh");
        $('#modalSaveAssyProcess').unbind('click')

        $('#modalSaveAssyProcess').click(function () {
            ProcessName = $.trim($('#modal_AssyProcessName').val());
            PartID_OUT = $.trim($('#modal_AssyPartOutput').val());
            if (ProcessName==""||PartID_OUT=="null") {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Warning',
                    text: "Please fill input",
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#dc3545'
                });
            }else{
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/assembly/add_assembly/" + RefID,
                data: JSON.stringify({
                    ProcessName: ProcessName,
                    PartID_OUT: PartID_OUT
                }),
                dataType: "json",
                success: function (response) {
                    fill_tableAssyList(RefID)
                    $('#modal_AssyProcessAdd').modal('hide')
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Added',
                        text: 'Assembly List have been added',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        }
        })
        }
    })

    //click btn Edit Assembly List
    $(document).on('click', '#btnAssyListEdit', function (e) {
        if (!AssyProcID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Assembly List.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function(result){       //Close modal when Swal close
                if (result.value) {
                    $('#modal_AssyProcessAdd').addClass('programmatic');
                    $('#modal_AssyProcessAdd').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        $('#form_AssyAddProcess').trigger('reset');

        } else {
        $('.modal-title').text('Edit Process:')
        $("#modalSaveAssyProcess").unbind('click')
        $("#modal_AssyProcessName").val(ProcessName);
        $('#modal_AssyPartOutput').val(PartID)
        $(".selectpicker").selectpicker("refresh");

        $('#modalSaveAssyProcess').click(function (e) {
            e.preventDefault();
            ProcessName = $.trim($('#modal_AssyProcessName').val());
            PartID_OUT = $.trim($('#modal_AssyPartOutput').val());
            if (ProcessName==""||PartID_OUT=="null") {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Warning',
                    text: "Please fill input",
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#dc3545'
                });
            }else{
            $.ajax({
                type: "put",
                contentType: "application/json; charset=utf-8",
                url: "/assembly/edit_assy_process/" + AssyProcID,
                data: JSON.stringify({
                    ProcessName: ProcessName,
                    PartID_OUT: PartID_OUT
                }),
                dataType: "json",
                success: function (response) {
                    tableAssyList.ajax.reload(null,false)
                    $('#modal_AssyProcessAdd').modal('hide')
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Assembly List have been Saved',
                        showConfirmButton: false,
                        imer: 1500
                    });
                    AssyProcID = null;
                }
            });
        }
        })
    }})
    //delete Assembly List
    $(document).on('click', '#btnAssyListDel', function (e) {
        if (!AssyProcID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Assembly List.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function(result){
                if (result.value) {
                    $('#modalDeleteConfirm').addClass('programmatic');
                    $('#modalDeleteConfirm').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        } else {
        $('.modal-title').text('Confirm Delete')
        $('#btnYes').unbind('click')

        $("#btnYes").click(function () {
        $.ajax({
            type: "delete",
            url: "/assembly/delete_assy_process/" + AssyProcID,
            contentType: "application/json",
            success: function (response) {
                fill_tableAssyList(RefID)
                $('#modalDeleteConfirm').modal('hide');
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Deleted',
                    text: 'Assembly List have been deleted',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
        })
    }})
    //Fill Part Component List
    function fill_tableAssyPart(AssyProcID) {
        tableAssyPart = $('#tableAssyPart').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": '/assembly/part_component_list/' + AssyProcID,
                "dataSrc": ""
            },
            "columns": [
                {"data": "index"},
                {"data": "PartCode"},
                {"data": "PartName"},
                {"data": "Qty"},
                {"data": "Supplier"},
                {"data": "RefNo"},
                {"data": "CompID"},
                {"data": "PartID"},
            ],
            "columnDefs": [{
                    "targets": [6,7],
                    "visible": false
                },
            ],
        });
    }
    //add Part Component List
    $(document).on('click', '#btnAssyPartAdd', function (e) {
        if (!AssyProcID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Assembly List.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function(result){       //Close modal when Swal close
                if (result.value) {
                    $('#modal_AssyPartAdd').addClass('programmatic');
                    $('#modal_AssyPartAdd').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        } else {
        $('#form_AssyAddPart').trigger('reset');
        $('.modal-title').text('Add Part:')
        $(".selectpicker").selectpicker("refresh");
        $('#modalSaveAssyPart').unbind('click')

        $('#modalSaveAssyPart').click(function () {
            PartID = $.trim($('#modal_AssyPartCode').val());
            Qty = $.trim($('#modal_AssyPartQuantity').val());
            if (PartID=="null"||Qty=="") {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Warning',
                    text: "Please fill input",
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#dc3545'
                });
            }else{
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/assembly/add_assy_comp/" + AssyProcID,
                data: JSON.stringify({
                    PartID: PartID,
                    Qty: Qty
                }),
                dataType: "json",
                success: function (response) {
                    $('#modal_AssyPartAdd').modal('hide')
                    tableAssyPart.ajax.reload(null,false)
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Added',
                        text: 'Part Component List have been added',
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
                        confirmButtonColor: '#dc3545'
                    });
                }
            });
        }
        })
    }})

    //Edit Part Component List
    $(document).on('click', '#btnAssyPartEdit', function (e) {
        if (!CompID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Part Component List.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function(result){       //Close modal when Swal close
                if (result.value) {
                    $('#modal_AssyPartAdd').addClass('programmatic');
                    $('#modal_AssyPartAdd').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        $('#form_AssyAddPart').trigger('reset');

        } else {
        $('.modal-title').text('Edit Part:')
        $('#modalSaveAssyPart').unbind('click')

        $('#modal_AssyPartCode').val(PartID)
        $("#modal_AssyPartName").val(PartName);
        $("#modal_AssyPartQuantity").val(Qty);
        $("#modal_AssyPartSupplier").val(Supplier);
        $("#modal_AssyPartRefNo").val(RefNo);
        $(".selectpicker").selectpicker("refresh");

        $('#modalSaveAssyPart').click(function () {
            PartID = $.trim($('#modal_AssyPartCode').val());
            Qty = $.trim($('#modal_AssyPartQuantity').val());
            if (PartID=="null"||Qty=="") {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Warning',
                    text: "Please fill input",
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#dc3545'
                });
            }else{
            $.ajax({
                type: "put",
                contentType: "application/json; charset=utf-8",
                url: "/assembly/edit_assy_comp/" + CompID,
                data: JSON.stringify({
                    PartID: PartID,
                    Qty: Qty,
                    AssyProcID:AssyProcID
                }),
                dataType: "json",
                success: function (response) {
                    $('#modal_AssyPartAdd').modal('hide')
                    tableAssyPart.ajax.reload(null,false)
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Part Component List have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    CompID = null;
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
                        confirmButtonColor: '#dc3545'
                    });
                }
            });
        }
        })
    }})

    //delete Part Component List
    $(document).on('click', '#btnAssyPartDel', function (e) {
        if (!CompID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Part Component List.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function(result){
                if (result.value) {
                    $('#modalDeleteConfirm').addClass('programmatic');
                    $('#modalDeleteConfirm').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        } else {
        $('.modal-title').text('Confirm Delete')
        $('#btnYes').unbind('click')

        $("#btnYes").click(function () {
            $.ajax({
                type: "delete",
                url: "/assembly/delete_assy_comp/" + CompID,
                contentType: "application/json",
                success: function (response) {
                    tableAssyPart.ajax.reload(null,false)
                    $('#modalDeleteConfirm').modal('hide');
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'deleted',
                        text: 'Part Component List have been deleted',
                        showConfirmButton: false,
                        timer: 1500
                    });

                }
            });

        })
    }})

    //Fill Jig List
    function fill_tableAssyJig(AssyProcID) {
        tableAssyJig = $('#tableAssyJig').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": '/assembly/jig_list/' + AssyProcID,
                "dataSrc": ""
            },
            "columns": [
                {"data": "index"},
                {"data": "ProcessName"},
                {"data": "JigName"},
                {"data": "JigNo"},
                {"data": "PcsHr"},
                {"data": "Operator"},
                {"data": "JigID"}
            ],
            "columnDefs": [{
                    "targets": [6],
                    "visible": false
                },
            ],
        });
    }

    //click btn Add Jig List
    $(document).on('click', '#btnAssyJigAdd', function (e) {
        if (!AssyProcID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Assembly List.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function(result){       //Close modal when Swal close
                if (result.value) {
                    $('#modal_AssyJigAdd').addClass('programmatic');
                    $('#modal_AssyJigAdd').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        } else {
        $('#form_AssyAddJig').trigger('reset');
        $('.modal-title').text('Add Jig:')
        $('#modalSaveAssyJig').unbind('click')

        $('#modalSaveAssyJig').click(function () {
            JigName = $.trim($('#modal_AssyJigName').val());
            JigNo = $.trim($('#modal_AssyJigNo').val());
            PcsHr = $.trim($('#modal_AssyJigPcsHr').val());
            ManPower = $.trim($('#modal_AssyJigManpower').val());
            if (JigName==""||JigNo==""||PcsHr==""||ManPower=="") {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Warning',
                    text: "Please fill input",
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#dc3545'
                });
            }else{
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/assembly/add_assy_jig/" + AssyProcID,
                data: JSON.stringify({
                    JigName: JigName,
                    JigNo: JigNo,
                    PcsHr: PcsHr,
                    ManPower: ManPower
                }),
                dataType: "json",
                success: function (response) {
                    $('#modal_AssyJigAdd').modal('hide')
                    tableAssyJig.ajax.reload(null,false)
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Added',
                        text: 'Jig List have been Added',
                        showConfirmButton: false,
                        timer: 1500
                    });

                }
            });
        }
        })
    }})

    //click btn Edit Part Jig List
    $(document).on('click', '#btnAssyJigEdit', function (e) {
        if (!JigID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Jig List.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function(result){       //Close modal when Swal close
                if (result.value) {
                    $('#modal_AssyJigAdd').addClass('programmatic');
                    $('#modal_AssyJigAdd').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        $('#form_AssyAddJig').trigger('reset');

        } else {
        $('.modal-title').text('Edit Jig:')

        $("#modal_AssyJigName").val(JigName);
        $("#modal_AssyJigNo").val(JigNo);
        $("#modal_AssyJigPcsHr").val(PcsHr);
        $("#modal_AssyJigManpower").val(Operator);
        $('#modalSaveAssyJig').unbind("click")

        $('#modalSaveAssyJig').click(function () {
            JigName = $.trim($('#modal_AssyJigName').val());
            JigNo = $.trim($('#modal_AssyJigNo').val());
            PcsHr = $.trim($('#modal_AssyJigPcsHr').val());
            ManPower = $.trim($('#modal_AssyJigManpower').val());
            if (JigName==""||JigNo==""||PcsHr==""||ManPower=="") {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Warning',
                    text: "Please fill input",
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#dc3545'
                });
            }else{
            $.ajax({
                type: "put",
                contentType: "application/json; charset=utf-8",
                url: "/assembly/edit_assy_jig/" + JigID,
                data: JSON.stringify({
                    JigNo: JigNo,
                    JigName: JigName,
                    PcsHr: PcsHr,
                    ManPower: ManPower
                }),
                dataType: "json",
                success: function (response) {
                    $('#modal_AssyJigAdd').modal('hide')
                    tableAssyJig.ajax.reload(null,false)
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Jig List have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    JigID = null;
                }
            });
        }
        })
    }})

    //delete Jig List
    $(document).on('click', '#btnAssyJigDel', function (e) {
        if (!JigID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Jig List.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function(result){
                if (result.value) {
                    $('#modalDeleteConfirm').addClass('programmatic');
                    $('#modalDeleteConfirm').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        } else {
        $('.modal-title').text('Confirm Delete')
        $('#btnYes').unbind('click')

        $("#btnYes").click(function () {
            $.ajax({
                type: "delete",
                url: "/assembly/delete_assy_jig/" + JigID,
                contentType: "application/json",
                success: function (response) {
                    tableAssyJig.ajax.reload(null,false)
                    $('#modalDeleteConfirm').modal('hide');
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Deleted',
                        text: 'Jig List have been deleted',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        })
    }})

//==================================================================================//
    //click on Reference Number table
    $('#tableRefNumber tbody').on('click', 'tr', function () {
        fill_tableAssyList(RefID);
        AssyProcID = PartID = ProcessName = PartID_OUT = null;
        CompID = PartCode = PartName = Qty = Supplier =  RefNo = null;
        JigID = ProcessName = JigName = JigNo = PcsHr = Operator = null;
    })

    //click on tableAssyList table
    $('#tableAssyList tbody').on('click', 'tr', function () {
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            AssyProcID = PartID = ProcessName = PartID_OUT = null;
        }
        else{
            $('#tableAssyList tr').removeClass('selected');
            $(this).toggleClass('selected');
            AssyProcID = tableAssyList.rows($(this)).data()[0].AssyProcID;
            PartID = tableAssyList.rows($(this)).data()[0].PartID;
            ProcessName = $(this).find('td:eq(1)').text();
            PartID_OUT = $(this).find('td:eq(2)').text();
        }
        fill_tableAssyPart(AssyProcID);
        fill_tableAssyJig(AssyProcID)
    })

    //click on Part Component List table
    $('#tableAssyPart tbody').on('click', 'tr', function () {
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            CompID = PartCode = PartName = Qty = Supplier =  RefNo = PartID =  null;
        }
        else{
            $('#tableAssyPart tr').removeClass('selected');
            $(this).toggleClass('selected');
            CompID = tableAssyPart.rows($(this)).data()[0].CompID;
            PartID = tableAssyPart.rows($(this)).data()[0].PartID;
            PartCode = $(this).find('td:eq(1)').text();
            PartName = $(this).find('td:eq(2)').text();
            Qty = $(this).find('td:eq(3)').text();
            Supplier = $(this).find('td:eq(4)').text();
            RefNo = $(this).find('td:eq(5)').text();
        }
    })

    //click on Jig List table
    $('#tableAssyJig tbody').on('click', 'tr', function () {
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            JigID = ProcessName = JigName = JigNo = PcsHr = Operator = null;
        }
        else{
            $('#tableAssyJig tr').removeClass('selected');
            $(this).toggleClass('selected');
            JigID = tableAssyJig.rows($(this)).data()[0].JigID;
            ProcessName = $(this).find('td:eq(1)').text();
            JigName = $(this).find('td:eq(2)').text();
            JigNo = $(this).find('td:eq(3)').text();
            PcsHr = $(this).find('td:eq(4)').text();
            Operator = $(this).find('td:eq(5)').text();
        }
    })


    //?-----------------------------------------------------------------------------?//

    //select dropdown to show Part
    $('#modal_AssyPartCode').change(function () {
        PartID = $("#modal_AssyPartCode").val();
        $.ajax({
            type: "get",
            url: "/dropdown/part_data/" + PartID,
            contentType: 'application/json',
            dataType: "json",
            success: function (response) {
                if (response.length) {
                    $("#modal_AssyPartName").val(response[0].PartName)
                    $("#modal_AssyPartSupplier").val(response[0].Supplier)
                    $("#modal_AssyPartRefNo").val(response[0].RefNo)
                } else {
                    $("#modal_AssyPartName").val('')
                    $("#modal_AssyPartSupplier").val('')
                    $("#modal_AssyPartRefNo").val('')
                }
                
            }
        })
    })
    $("#modalSaveRef").click(function(){
        fill_tableAssyList(null)
    })
})