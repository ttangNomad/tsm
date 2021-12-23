$(document).ready(function () {

   

    $("#linkWelding").click(function () {
        CompID = PartCode = PartName = Qty = Supplier = RefNo = null;
        WeldingID = ProcessIndex = PartID_OUT = CycleTime = PcsHr = ManPower = null;
        JigID = JigNo = PartID = null;
    })

    //Fill tableWeldList
    function fill_tableWeldList(RefID) {
        tableWeldList = $('#tableWeldList').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": '/welding/welding_list/' + RefID,
                "dataSrc": ""
            },
            "columns": [{
                    "data": "index"
                },
                {
                    "data": "PartName"
                },
                {
                    "data": "PartCode"
                },
                {
                    "data": "CycleTime"
                },
                {
                    "data": "PcsHr"
                },
                {
                    "data": "Operator"
                },
                {
                    "data": "WeldingID"
                },
                {
                    "data": "PartID"
                }
            ],
            "columnDefs": [{
                "targets": [6, 7],
                "visible": false

            }, ],
            "initComplete": function () {
                CountRows = tableWeldList.data().count();
                $("#badgeWelding").text(CountRows)
            }
        });
        fill_tableWeldPart(null)
        fill_tableWeldJig(null)
    }
    //click btn add Welding List
    $(document).on('click', '#btnWeldListAdd', function (e) {
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
            }).then(function (result) { //Close modal when Swal close
                if (result.value) {
                    $('#modal_WeldAdd').addClass('programmatic');
                    $('#modal_WeldAdd').modal('hide');
                    e.stopPropagation();
                } else {
                    e.stopPropagation();
                }
            })
        } else {
            $('#form_WeldAdd').trigger('reset');
            $('.modal-title').text('Add Process:')
            $(".selectpicker").selectpicker("refresh");
            $('#modalSaveWeld').unbind('click')

            $('#modalSaveWeld').click(function () {
                CycleTime = $.trim($('#modal_WeldCycleTime').val());
                PartID_OUT = $.trim($('#modal_WeldPartOutput').val());
                PcsHr = $.trim($('#modal_WeldTarget').val());
                ManPower = $.trim($('#modal_WeldManpower').val());
                if (PartID_OUT == "null" || CycleTime == "" || PcsHr == "" || ManPower == "") {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Warning',
                        text: "Please fill input",
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#dc3545'
                    });
                } else {
                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/welding/add_welding/" + RefID,
                        data: JSON.stringify({
                            CycleTime: CycleTime,
                            PartID_OUT: PartID_OUT,
                            PcsHr: PcsHr,
                            ManPower: ManPower
                        }),
                        dataType: "json",
                        success: function (response) {
                            fill_tableWeldList(RefID)
                            $('#modal_WeldAdd').modal('hide')
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Added',
                                text: 'Welding List have been added',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                    });
                }
            })
        }
    })

    //click btn Edit Welding List
    $(document).on('click', '#btnWeldListEdit', function (e) {
        if (!WeldingID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Welding List.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function (result) { //Close modal when Swal close
                if (result.value) {
                    $('#modal_WeldAdd').addClass('programmatic');
                    $('#modal_WeldAdd').modal('hide');
                    e.stopPropagation();
                } else {
                    e.stopPropagation();
                }
            })
            $('#form_WeldAdd').trigger('reset');

        } else {
            $('.modal-title').text('Edit Process:')
            $("#modalSaveWeld").unbind('click')

            $('#modal_WeldPartOutput').val(PartID)
            $("#modal_WeldCycleTime").val(CycleTime);
            $("#modal_WeldTarget").val(PcsHr);
            $("#modal_WeldManpower").val(ManPower);
            $(".selectpicker").selectpicker("refresh");
            $('#modalSaveWeld').click(function () {
                PartID = $.trim($('#modal_WeldPartOutput').val());
                CycleTime = $.trim($('#modal_WeldCycleTime').val());
                PcsHr = $.trim($('#modal_WeldTarget').val());
                ManPower = $.trim($('#modal_WeldManpower').val());
                if (PartID == "null" || CycleTime == "" || PcsHr == "" || ManPower == "") {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Warning',
                        text: "Please fill input",
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#dc3545'
                    });
                } else {
                    $.ajax({
                        type: "put",
                        contentType: "application/json; charset=utf-8",
                        url: "/welding/edit_welding/" + WeldingID,
                        data: JSON.stringify({
                            PartID: PartID,
                            CycleTime: CycleTime,
                            PcsHr: PcsHr,
                            ManPower: ManPower
                        }),
                        dataType: "json",
                        success: function (response) {
                            WeldingID = null;
                            tableWeldList.ajax.reload(null, false)
                            $('#modal_WeldAdd').modal('hide')
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Edited',
                                text: 'Welding List have been saved',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                    });
                }
            })
        }
    })
    //delete Welding List
    $(document).on('click', '#btnWeldListDel', function (e) {
        if (!WeldingID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Welding List.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function (result) {
                if (result.value) {
                    $('#modalDeleteConfirm').addClass('programmatic');
                    $('#modalDeleteConfirm').modal('hide');
                    e.stopPropagation();
                } else {
                    e.stopPropagation();
                }
            })
        } else {
            $('.modal-title').text('Confirm Delete')
            $('#btnYes').unbind('click')

            $("#btnYes").click(function () {
                $.ajax({
                    type: "delete",
                    url: "/welding/delete_welding/" + WeldingID,
                    contentType: "application/json",
                    success: function (response) {
                        fill_tableWeldList(RefID)
                        $('#modalDeleteConfirm').modal('hide');
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Deleted',
                            text: 'Welding List have been Deleted',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                });

            })
        }
    })

    //Fill Part Component List
    function fill_tableWeldPart(WeldingID) {
        tableWeldPart = $('#tableWeldPart').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": '/welding/part_component_list/' + WeldingID,
                "dataSrc": ""
            },
            "columns": [


                {
                    "data": "index"
                },
                {
                    "data": "PartCode"
                },
                {
                    "data": "PartName"
                },
                {
                    "data": "Qty"
                },
                {
                    "data": "Supplier"
                },
                {
                    "data": "RefNo"
                },
                {
                    "data": "CompID"
                },
                {
                    "data": "PartID"
                }

            ],
            "columnDefs": [{
                "targets": [6, 7],
                "visible": false

            }, ],
        });
    }

    //click btn add Part Component List
    $(document).on('click', '#btnWeldPartAdd', function (e) {
        if (!WeldingID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Welding List.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function (result) { //Close modal when Swal close
                if (result.value) {
                    $('#modal_AssyPartAdd').addClass('programmatic');
                    $('#modal_AssyPartAdd').modal('hide');
                    e.stopPropagation();
                } else {
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
                if (PartID == "null" || Qty == "") {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Warning',
                        text: "Please fill input",
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#dc3545'
                    });
                } else {
                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/welding/add_welding_comp/" + WeldingID,
                        data: JSON.stringify({
                            PartID: PartID,
                            Qty: Qty
                        }),
                        dataType: "json",
                        success: function (response) {
                            tableWeldPart.ajax.reload(null, false)
                            $('#modal_AssyPartAdd').modal('hide')
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
        }
    })

    //click btn Edit Part Component List
    $(document).on('click', '#btnWeldPartEdit', function (e) {
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
            }).then(function (result) { //Close modal when Swal close
                if (result.value) {
                    $('#modal_AssyPartAdd').addClass('programmatic');
                    $('#modal_AssyPartAdd').modal('hide');
                    e.stopPropagation();
                } else {
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
                if (PartID == "null" || Qty == "") {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Warning',
                        text: "Please fill input",
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#dc3545'
                    });
                } else {
                    $.ajax({
                        type: "put",
                        contentType: "application/json; charset=utf-8",
                        url: "/welding/edit_comp/" + CompID,
                        data: JSON.stringify({
                            PartID: PartID,
                            Qty: Qty,
                            WeldingID:WeldingID
                        }),
                        dataType: "json",
                        success: function (response) {
                            tableWeldPart.ajax.reload(null, false)
                            $('#modal_AssyPartAdd').modal('hide')
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
        }
    })

    //delete Part Component List
    $(document).on('click', '#btnWeldPartDel', function (e) {
        if (!WeldingID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Part Component List.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function (result) {
                if (result.value) {
                    $('#modalDeleteConfirm').addClass('programmatic');
                    $('#modalDeleteConfirm').modal('hide');
                    e.stopPropagation();
                } else {
                    e.stopPropagation();
                }
            })
        } else {
            $('.modal-title').text('Confirm Delete')
            $('#btnYes').unbind('click')

            $("#btnYes").click(function () {
                $.ajax({
                    type: "delete",
                    url: "/welding/delete_comp/" + CompID,
                    contentType: "application/json",
                    success: function (response) {
                        tableWeldPart.ajax.reload(null, false)
                        $('#modalDeleteConfirm').modal('hide');
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Added',
                            text: 'Part Component List have been added',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                });
            })
        }
    })

    //Fill Jig List
    function fill_tableWeldJig(WeldingID) {
        tableWeldJig = $('#tableWeldJig').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": '/welding/jig_list/' + WeldingID,
                "dataSrc": ""
            },
            "columns": [{
                    "data": "index"
                },
                {
                    "data": "JigNo"
                },
                {
                    "data": "JigID"
                },
            ],
            "columnDefs": [{
                "targets": [2],
                "visible": false
            }, ],
        });
    }
    //click btn Add Jig List
    $(document).on('click', '#btnWeldJigAdd', function (e) {
        if (!WeldingID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Welding List.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function (result) { //Close modal when Swal close
                if (result.value) {
                    $('#modal_WeldJigAdd').addClass('programmatic');
                    $('#modal_WeldJigAdd').modal('hide');
                    e.stopPropagation();
                } else {
                    e.stopPropagation();
                }
            })
        } else {
            $('#form_WeldJigAdd').trigger('reset');
            $('.modal-title').text('Add Jig:')
            $('#modalSaveWeldJig').unbind('click')

            $('#modalSaveWeldJig').click(function () {
                JigNo = $.trim($('#modal_WeldJigInput').val());
                if (JigNo == "") {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Warning',
                        text: "Please fill input",
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#dc3545'
                    });
                } else {
                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/welding/add_jig/" + WeldingID,
                        data: JSON.stringify({
                            JigNo: JigNo
                        }),
                        dataType: "json",
                        success: function (response) {
                            tableWeldJig.ajax.reload(null, false)
                            $('#modal_WeldJigAdd').modal('hide');
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Added',
                                text: 'Jig List have been added',
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
        }
    })

    //click btn Edit Jig List
    $(document).on('click', '#btnWeldJigEdit', function (e) {
        if (!JigID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Welding Jig.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function (result) { //Close modal when Swal close
                if (result.value) {
                    $('#modal_WeldJigAdd').addClass('programmatic');
                    $('#modal_WeldJigAdd').modal('hide');
                    e.stopPropagation();
                } else {
                    e.stopPropagation();
                }
            })
            $('#form_WeldJigAdd').trigger('reset');

        } else {
            $('.modal-title').text('Edit Jig:')
            $("#modal_WeldJigInput").val(JigNo);
            $('#modalSaveWeldJig').unbind('click')
            $('#modalSaveWeldJig').click(function () {
                JigNo = $.trim($('#modal_WeldJigInput').val());
                if (JigNo == "") {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Warning',
                        text: "Please fill input",
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#dc3545'
                    });
                } else {
                    $.ajax({
                        type: "put",
                        contentType: "application/json; charset=utf-8",
                        url: "/welding/edit_jig/" + JigID,
                        data: JSON.stringify({
                            JigNo: JigNo,
				WeldingID:WeldingID
                        }),
                        dataType: "json",
                        success: function (response) {
                            tableWeldJig.ajax.reload(null, false)
                            $('#modal_WeldJigAdd').modal('hide');
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Edit',
                                text: 'Jig List have been saved',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            JigID = null;
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
        }
    })

    //delete Jig List
    $(document).on('click', '#btnWeldJigDel', function (e) {
        if (!JigID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Welding Jig.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function (result) {
                if (result.value) {
                    $('#modalDeleteConfirm').addClass('programmatic');
                    $('#modalDeleteConfirm').modal('hide');
                    e.stopPropagation();
                } else {
                    e.stopPropagation();
                }
            })
        } else {
            $('.modal-title').text('Confirm Delete')
            $('#btnYes').unbind('click')

            $("#btnYes").click(function () {
                $.ajax({
                    type: "delete",
                    url: "/welding/delete_jig/" + JigID,
                    contentType: "application/json",
                    success: function (response) {
                        tableWeldJig.ajax.reload(null, false)
                        $('#modalDeleteConfirm').modal('hide');
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Deleted',
                            text: 'Hot Stamp List have been deleted',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                });
            })
        }
    })

    //============================================================================//
    //click on Reference Number table
    $('#tableRefNumber').on('click', 'td', function () {

        fill_tableWeldList(RefID);
        CompID = PartCode = PartName = Qty = Supplier = RefNo = null;
        WeldingID = ProcessIndex = PartID_OUT = CycleTime = PcsHr = ManPower = null;
        JigID = JigNo = PartID = null;
    })

    //click on Welding List table
    $('#tableWeldList tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            WeldingID = ProcessIndex = PartID_OUT = CycleTime = PcsHr = ManPower = PartID = null;
        } else {
            $('#tableWeldList tr').removeClass('selected');
            $(this).toggleClass('selected');
            WeldingID = tableWeldList.rows($(this)).data()[0].WeldingID;
            PartID = tableWeldList.rows($(this)).data()[0].PartID;
            ProcessIndex = $(this).find('td:eq(1)').text();
            PartID_OUT = $(this).find('td:eq(2)').text();
            CycleTime = $(this).find('td:eq(3)').text();
            PcsHr = $(this).find('td:eq(4)').text();
            ManPower = $(this).find('td:eq(5)').text();
        }
        fill_tableWeldPart(WeldingID);
        fill_tableWeldJig(WeldingID)
    })

    //click on Part Component List table
    $('#tableWeldPart tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            CompID = PartCode = PartName = Qty = Supplier = RefNo = PartID = null;
        } else {
            $('#tableWeldPart tr').removeClass('selected');
            $(this).toggleClass('selected');
            CompID = tableWeldPart.rows($(this)).data()[0].CompID;
            PartID = tableWeldPart.rows($(this)).data()[0].PartID;
            PartCode = $(this).find('td:eq(1)').text();
            PartName = $(this).find('td:eq(2)').text();
            Qty = $(this).find('td:eq(3)').text();
            Supplier = $(this).find('td:eq(4)').text();
            RefNo = $(this).find('td:eq(5)').text();
        }
    })

    //click on Jig List table
    $('#tableWeldJig').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            JigID = JigNo = null;
        } else {
            $('#tableWeldJig tr').removeClass('selected');
            $(this).toggleClass('selected');
            JigID = tableWeldJig.rows($(this)).data()[0].JigID;
            JigNo = $(this).find('td:eq(1)').text();
        }
    })

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
        fill_tableWeldList(null)
    })
})