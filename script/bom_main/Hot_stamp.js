$(document).ready(function () {

    
    $("#linkHostStamp").click(function () {
        HSID = Part_IN = Part_OUT = McType = PcsHr = FoilCode = FoilSize = ManPower = JigID =PartID_OUT = PartID_IN =McTypeID =HSMID =null;

    })

    //Fill tableHotStampList
    function fill_tableHotStampList(RefID) {
        tableHotStampList = $('#tableHotStampList').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": '/hot_stamp/hot_stamp_list/' + RefID,
                "dataSrc": ""
            },
            "columns": [{
                    "data": "index"
                },
                {
                    "data": "Part_IN"
                },
                {
                    "data": "Part_OUT"
                },
                {
                    "data": "McTypeName"
                },
                {
                    "data": "PcsHr"
                },
                {
                    "data": "FoilCode"
                },
                {
                    "data": "FoilSize"
                },
                {
                    "data": "Operator"
                },
                {
                    "data": "HSID"
                },
                {
                    "data": "PartID_OUT"
                },
                {
                    "data": "PartID_IN"
                },
                {
                    "data": "McTypeID"
                },
                {
                    "data": "HSMID"
                }
            ],
            "columnDefs": [{
                "targets": [8,9,10,11,12],
                "visible": false
            }, ],
            "initComplete": function () {
                CountRows = tableHotStampList.data().count()
                $("#badgeHotStamp").text(CountRows)
            }
        });
        fill_tableHotStampJig(null)
    }
    //click add btn Hot Stamp List
    $(document).on('click', '#btnHSAdd', function (e) {
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
                    $('#modal_HotStampAdd').addClass('programmatic');
                    $('#modal_HotStampAdd').modal('hide');
                    e.stopPropagation();
                } else {
                    e.stopPropagation();
                }
            })
        } else {
            $('#form_HotStampAdd').trigger('reset');
            $('.modal-title').text('Add Hot Stamp:')
            $(".selectpicker").selectpicker("refresh");
            $('#modalSaveHotStamp').unbind('click');
            $('#modalSaveHotStamp').click(function () {
                PartID_IN = $.trim($('#modal_HotStampPartInput').val());
                PartID_OUT = $.trim($('#modal_HotStampPartOutput').val());
                McTypeID = $.trim($('#modal_HotStampMachine').val());
                PcsHr = $.trim($('#modal_HotStampTarget').val());
                HSMID = $.trim($('#modal_HotStampMatCode').val());
                FoilSize = $.trim($('#modal_HotStampFoilSize').val());
                ManPower = $.trim($('#modal_HotStampManpower').val());
                if (PartID_IN == "null" || PartID_OUT == "null" || McTypeID == "null" || PcsHr == "" || HSMID == "null" || FoilSize == "" || ManPower == "") {
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
                        dataType: "json",
                        url: "/hot_stamp/add_hot_stamp/" + RefID,
                        data: JSON.stringify({
                            PartID_IN: PartID_IN,
                            PartID_OUT: PartID_OUT,
                            McTypeID: McTypeID,
                            PcsHr: PcsHr,
                            HSMID: HSMID,
                            FoilSize: FoilSize,
                            ManPower: ManPower
                        }),
                        success: function (data) {
                            fill_tableHotStampList(RefID);
                            $('#modal_HotStampAdd').modal('hide')
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Added',
                                text: 'Hot Stamp List have been added',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                    });
                }
            })
        }
    })

    //click Edit btn Hot Stamp List
    $(document).on('click', '#btnHSEdit', function (e) {
        if (!HSID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Hot Stamp.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function (result) { //Close modal when Swal close
                if (result.value) {
                    $('#modal_HotStampAdd').addClass('programmatic');
                    $('#modal_HotStampAdd').modal('hide');
                    e.stopPropagation();
                } else {
                    e.stopPropagation();
                }
            })
            $('#form_HotStampAdd').trigger('reset');

        } else {
            $('.modal-title').text('Edit Hot Stamp:')
            $('#modal_HotStampPartInput').val(PartID_IN)
            $('#modal_HotStampPartOutput').val(PartID_OUT)
            $('#modal_HotStampMachine').val(McTypeID)
            $("#modal_HotStampTarget").val(PcsHr);
            $('#modal_HotStampMatCode').val(HSMID)
            $("#modal_HotStampFoilSize").val(FoilSize);
            $("#modal_HotStampManpower").val(ManPower);
            $(".selectpicker").selectpicker("refresh");

            $('#modalSaveHotStamp').unbind('click')

            $("#modalSaveHotStamp").click(function () {
                PartID_IN = $.trim($('#modal_HotStampPartInput').val());
                PartID_OUT = $.trim($('#modal_HotStampPartOutput').val());
                McTypeID = $.trim($('#modal_HotStampMachine').val());
                PcsHr = $.trim($('#modal_HotStampTarget').val());
                HSMID = $.trim($('#modal_HotStampMatCode').val());
                FoilSize = $.trim($('#modal_HotStampFoilSize').val());
                ManPower = $.trim($('#modal_HotStampManpower').val());
                if (PartID_IN == "null" || PartID_OUT == "null" || McTypeID == "null" || PcsHr == "" || HSMID == "null" || FoilSize == "" || ManPower == "") {
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
                        type: "PUT",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        url: "/hot_stamp/edit_hot_stamp/" + HSID,
                        data: JSON.stringify({
                            PartID_IN: PartID_IN,
                            PartID_OUT: PartID_OUT,
                            McTypeID: McTypeID,
                            PcsHr: PcsHr,
                            HSMID: HSMID,
                            FoilSize: FoilSize,
                            ManPower: ManPower
                        }),
                        success: function (data) {
                            tableHotStampList.ajax.reload(null, false);
                            $('#modal_HotStampAdd').modal('hide')
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Edited',
                                text: 'Hot Stamp List have been saved',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            HSID = null;
                        }
                    });
                }
            })
        }
    })

    //click delete btn Hot Stamp List
    $(document).on('click', '#btnHSDel', function (e) {
        if (!HSID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Hot Stamp',
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
            $("#btnYes").unbind("click");

            $("#btnYes").click(function () {
                $.ajax({
                    type: "delete",
                    url: "/hot_stamp/delete_hot_stamp/" + HSID,
                    contentType: "application/json",
                    success: function (response) {
                        fill_tableHotStampList(RefID);
                        $('#modalDeleteConfirm').modal('hide');
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Deleted',
                            text: 'Mold List have been deleted',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                });

            })
        }
    })

    //Fill tableHotStampJig
    function fill_tableHotStampJig(HSID) {
        tableHotStampJig = $('#tableHotStampJig').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": '/hot_stamp/jig_list/' + HSID,
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
                }
            ],
            "columnDefs": [{
                "targets": [2],
                "visible": false
            }, ],
        });
    }



    //click add btn JigHSList
    $(document).on("click", "#btnHSJigAdd", function (e) {
        if (!HSID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Hot Stamp.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function (result) { //Close modal when Swal close
                if (result.value) {
                    $('#modal_HotStampJigAdd').addClass('programmatic');
                    $('#modal_HotStampJigAdd').modal('hide');
                    e.stopPropagation();
                } else {
                    e.stopPropagation();
                }
            })
        } else {
            $("#modalSaveHotStampJig").unbind('click');
            $("#form_HotStampJigAdd").trigger("reset");
            $(".modal-title").text("Add Jig List:");

            $('#modalSaveHotStampJig').click(function () {
                JigNo = $.trim($('#modal_HotStampJigInput').val());
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
                        url: "/hot_stamp/add_jig/" + HSID,
                        method: 'post',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            JigNo: JigNo
                        }),
                        success: function (response) {
                            tableHotStampJig.ajax.reload(null, false)
                            $('#modal_HotStampJigAdd').modal('hide');
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Added',
                                text: 'Mold List have been added',
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
            });
        }
    });

    //click on btn edit Jig List
    $(document).on("click", "#btnHSJigEdit", function (e) {
        if (!JigID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Jig.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function (result) { //Close modal when Swal close
                if (result.value) {
                    $('#modal_HotStampJigAdd').addClass('programmatic');
                    $('#modal_HotStampJigAdd').modal('hide');
                    e.stopPropagation();
                } else {
                    e.stopPropagation();
                }
            })
            $("#form_HotStampJigAdd").trigger("reset");

        } else {
            $("#modalSaveHotStampJig").unbind('click');
            $(".modal-title").text("Edit Jig List:");
            $('#modal_HotStampJigInput').val(JigNo)

            $('#modalSaveHotStampJig').click(function () {
                JigNo = $.trim($('#modal_HotStampJigInput').val());
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
                        url: "/hot_stamp/edit_jig/" + JigID,
                        method: 'put',
                        contentType: 'application/json',
                        dataType: 'json',
                        data: JSON.stringify({
                            HSID: HSID,
                            JigNo: JigNo
                        }),
                        success: function (response) {
                            tableHotStampJig.ajax.reload(null, false)
                            $('#modal_HotStampJigAdd').modal('hide');
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Edited',
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
                    })
                }
            })
        }
    })

    //click delete btn Jig List
    $(document).on('click', '#btnHSJigDel', function (e) {
        if (!JigID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Jig.',
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
            $("#btnYes").unbind("click");

            $("#btnYes").click(function () {
                $.ajax({
                    type: "delete",
                    url: "/hot_stamp/delete_jig/" + JigID,
                    contentType: "application/json",
                    success: function (response) {
                        tableHotStampJig.ajax.reload(null, false)
                        $('#modalDeleteConfirm').modal('hide');
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Deleted',
                            text: 'Mold List have been deleted',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        JigID = null;
                    }
                });
            })
        }
    })

    //click on Reference Number table
    $("#tableRefNumber").on('click', "td", function () {
        fill_tableHotStampList(RefID);
        HSID = Part_IN = Part_OUT = McType = PcsHr = FoilCode = FoilSize = ManPower = JigID =PartID_OUT = PartID_IN =McTypeID =HSMID =null;

        
    })

    //click on Hot Stamp List table
    $('#tableHotStampList tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            HSID = Part_IN = Part_OUT = McType = PcsHr = FoilCode = FoilSize = ManPower = PartID_OUT = PartID_IN =McTypeID =HSMID = null;
        } else {
            $('#tableHotStampList tr').removeClass('selected');
            $(this).toggleClass('selected');
            HSID = tableHotStampList.rows($(this)).data()[0].HSID;
            PartID_OUT = tableHotStampList.rows($(this)).data()[0].PartID_OUT;
            PartID_IN = tableHotStampList.rows($(this)).data()[0].PartID_IN;
            McTypeID = tableHotStampList.rows($(this)).data()[0].McTypeID;
            HSMID = tableHotStampList.rows($(this)).data()[0].HSMID;
            Part_IN = $(this).find('td:eq(1)').text();
            Part_OUT = $(this).find('td:eq(2)').text();
            McType = $(this).find('td:eq(3)').text();
            PcsHr = $(this).find('td:eq(4)').text();
            FoilCode = $(this).find('td:eq(5)').text();
            FoilSize = $(this).find('td:eq(6)').text();
            ManPower = $(this).find('td:eq(7)').text();
        }

        fill_tableHotStampJig(HSID);
    })

    //click Jig table
    $('#tableHotStampJig tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            JigID = JigNo = null;
        } else {
            $('#tableHotStampJig tr').removeClass('selected');
            $(this).toggleClass('selected');
            JigNo = $(this).find('td:eq(1)').text();
            JigID = tableHotStampJig.rows($(this)).data()[0].JigID;
        }
    })

    $("#modalSaveRef").click(function(){
        fill_tableHotStampList(null)
    })

})