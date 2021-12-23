$(document).ready(function () {
    let url = '/mold_master/data';
    let option = null;
    let MoldID, AXMoldNo, BasicMold, DieNo, JigNo, MachineNo, ManPowID, rows, AxPartNo, data;

    //GET TABLE MOLD
    function fill_moldmaster() {
        tableMold = $('#tableMold').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": '/mold_master/data',
                "dataSrc": ""
            },
            "columns": [
                {"data": "index"},
                {"data": "BasicMold"},
                {"data": "DieNo"},
                {"data": "JigNo"},
                {"data": "MachineNo"},
                {"data": "Operator"},
                {"data": "AXMoldNo"},
                {"data": "MoldID"},
                {
                    "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-primary p-1 m-2' id='btnEditMold' data-toggle='modal'  data-target='#modalMoldMaster' style='width: 2rem;''><i class='fa fa-pencil-square-o'></i></button><button  class='btn btn-danger p-1 m-2' id='btnDelMold' data-toggle='modal' data-target='#modalDeleteConfirm' style='width: 2rem;''><i class='fa fa-remove'></i></button></div></div>"
                }
            ],
            "columnDefs": [
                {
                    "targets": [6,7],
                    "visible": false

                },
            ],
            "order": [[ 0 , 'asc' ]]
        });
    }
    fill_moldmaster()

    //ADD MOLD Rows
    $(document).on('click','#addMold',function(){
        $("#formMoldMaster").trigger("reset");
        $(".modal-title").text("Add Mold");
        $("#JigInformation").hide("");
        $("#MCInformation").hide("");
        $("#modalSaveMold").unbind("click")

        $("#modalSaveMold").click(function ()  {
            BasicMold = $.trim($('#modalInpBasicMold').val());
            AXMoldNo = $.trim($('#modalInpAXMoldNo').val());
            DieNo = $.trim($('#modalInpDieNo').val());
            ManPower = $.trim($('#modalInpManPower').val());
            if (BasicMold=="" || AXMoldNo=="" || DieNo=="" || ManPower=="") {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Warning',
                    text: 'Please fill input',
                    showConfirmButton: false,
                    timer: 1500
                })

            }else{
            $.ajax({
                url: "/mold_master/add_mold",
                method: 'post',
                contentType: 'application/json; charset=utf-8',
                data:JSON.stringify({
                    BasicMold: BasicMold,
                    AXMoldNo: AXMoldNo,
                    DieNo: DieNo,
                    ManPower: ManPower
                }),
                success: function (result) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Created',
                        text: 'Mold have been created',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    MoldID = result.MoldID
                    tableMold.ajax.reload(null, false);
                    fill_modalTableJigNo(MoldID)
                    fill_modalTableMC(MoldID);
                    fill_DropdownMC();
                    $('#MCInformation').show('modal');
                    $('#JigInformation').show('modal');
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
            })
        }
        })
        $('#modalSubmitMold').click(function (e) {
            $('#modalMoldMaster').modal('hide');
        })
    })
    
        //EDIT btn
    $(document).on("click", "#btnEditMold", function () {
        $('#MCInformation').show('modal');
        $('#JigInformation').show('modal');
        rows = $(this).closest("tr");
        MoldID = tableMold.rows(rows).data()[0].MoldID;
        BasicMold = rows.find('td:eq(1)').text();
        DieNo = rows.find('td:eq(2)').text();
        ManPowID = rows.find('td:eq(5)').text();
        AXMoldNo = tableMold.rows(rows).data()[0].AXMoldNo;

        //Funtion Fill Table in Modal
        fill_modalTableJigNo(MoldID);
        fill_modalTableMC(MoldID);
        fill_DropdownMC();

        $(".modal-title").text("Edit Mold");
        $("#modalInpBasicMold").val(BasicMold);
        $("#modalInpDieNo").val(DieNo);
        $("#modalInpManPower").val(ManPowID);
        $("#modalInpAXMoldNo").val(AXMoldNo);
        $("#modalInpJig").val(JigNo);
        $("#modalSaveMold").unbind("click")
        
        $('#modalSaveMold').click(function () {
            BasicMold = $.trim($('#modalInpBasicMold').val());
            AXMoldNo = $.trim($('#modalInpAXMoldNo').val());
            DieNo = $.trim($('#modalInpDieNo').val());
            ManPower = $.trim($('#modalInpManPower').val());
            if (BasicMold=="" || AXMoldNo=="" || DieNo=="" || ManPower=="") {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Warning',
                    text: 'Please fill input',
                    showConfirmButton: false,
                    timer: 1500
                })
            }else{
            $.ajax({
                url: "/mold_master/edit_mold/"+MoldID,
                method: 'put',
                contentType: 'application/json',
                data: JSON.stringify({
                    BasicMold: BasicMold,
                    AXMoldNo: AXMoldNo,
                    DieNo: DieNo,
                    ManPower: ManPower
                }),
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Mold have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableMold.ajax.reload(null, false);
                    //$('#modalMoldMaster').modal('hide');
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

     //DELETE
     $(document).on("click", "#btnDelMold", function () {
        rows = $(this).closest("tr");
        MoldID = tableMold.rows(rows).data()[0].MoldID;
        $(".modal-title").text("Confirm Delete");
        $(".btnYes").unbind("click")
        $(".btnYes").click(function () {
            $.ajax({
                url: "/mold_master/delete_mold/"+MoldID,
                method: 'delete',
                contentType: 'application/json',
                success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Deleted',
                        text: 'Mold have been deleted',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    tableMold.ajax.reload(null, false);
                }
            })
            $('#modalDeleteConfirm').modal('hide');
        })
    });

    //Fill Table JigNo
    function fill_modalTableJigNo(MoldID) {
        tableJig = $('#modalTableJigNo').DataTable({
            "bDestroy": true,
            "ajax": {
                "url": "/mold_master/jig_no/"+MoldID,
                "dataSrc": "",
                "method": "get",
            },
            "columns": [{
                    "data": "index"
                },
                {
                    "data": "JigNo"
                },
                {
                    "data": "MoldJigID"
                }
            ],
            "columnDefs":[
                {
                    "targets": [2],
                    "visible": false
                },
            ],
        });
    }

    //select jig show in input
    $("#modalTableJigNo tbody").on("click", "tr", function () {
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            MoldJigID = null;
        }
        else{
            $('#modalTableJigNo tr').removeClass('selected');
            $(this).toggleClass('selected');
            MoldJigID = tableJig.rows($(this)).data()[0].MoldJigID;
            JigNo = tableJig.rows($(this)).data()[0].JigNo;
            $("#modalInpJig").val(JigNo);
        }
    })

    //delete JigNo
    $("#modalMoldMaster").on("click", "#btndelJig" , function(){
        $.ajax({
            url: "/mold_master/delete_jig/"+MoldJigID,
            method: 'delete',
            contentType: 'application/json',
            data: JSON.stringify({
                MoldID: MoldID
            }),
            success: function () {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Deleted',
                    text: `Mold's Jig have been deleted`,
                    showConfirmButton: false,
                    timer: 1500
                })
                MoldJigID = null;
            },
            error: function(err) {
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
        fill_modalTableJigNo(MoldID);
    })

     //Add Jig
     $(document).on("click", "#btnaddJig", function () {
        JigNo = $.trim($('#modalInpJig').val());
        if (JigNo=="" ) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please fill input',
                showConfirmButton: false,
                timer: 1500
            })
        }else{
        $.ajax({
            url: "/mold_master/add_jig_no/"+MoldID,
            method: 'post',
            contentType: 'application/json',
            data: JSON.stringify({
                JigNo: JigNo
            }),
            success: function () {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Created',
                    text: `Mold's Jig have been created`,
                    showConfirmButton: false,
                    timer: 1500
                })
                tableJig.ajax.reload(null, false);
                tableMold.ajax.reload(null, false);
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
                })
            }
        })
    }
    })

    //Fill table M/C
    function fill_modalTableMC(MoldID) {
        tableMC = $('#modalTableMachineRelation').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": "/mold_master/machine/"+MoldID,
                "dataSrc": "",
                "method": "get",
            },
            "columns": [{
                    "data": "index"
                },
                {
                    "data": "MachineNo"
                },
                {
                    "data": "MCSize"
                },
                {
                    "render":

                        function (data, type, row, meta) {
                            if (row.IsDefault == true) {
                                return '<input type="checkbox" name="check" checked >'
                            } else {
                                return '<input type="checkbox" name="check" >'
                            }
                        }
                },
                {
                    "data": "MoldMCID"
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

    //Select M/C in Table
    $("#modalTableMachineRelation tbody").on("click", "tr", function () {
        if($(this).hasClass('selected')){
            $(this).removeClass('selected')
            MoldMCID = null;
        }
        else{
            $('#modalTableMachineRelation tr').removeClass('selected');
            $(this).toggleClass('selected');
            MoldMCID = tableMC.rows($(this)).data()[0].MoldMCID;
            $("#modalInpMachineSelect").val(MoldMCID);
        }
    })

    //DELETE M/C
    $("#modalMoldMaster").on("click", "#btndelMC" , function(){
        $.ajax({
            url: "/mold_master/delete_machine/"+MoldMCID,
            method: 'delete',
            contentType: 'application/json',
            success: function () {
                tableMC.ajax.reload(null,false);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Deleted',
                    text: `Mold's Machine have been deleted`,
                    showConfirmButton: false,
                    timer: 1500
                })
                MoldMCID = null;
            },
            error: function(err) {
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
        fill_modalTableMC(MoldID);
    })


    //Dropdown M/C No.
    function fill_DropdownMC() {
        $.ajax({
            url: '/mold_master/machine_no',
            type: 'get',
            contentType: 'application/json',
            dataType: 'json',
            data: {
                MachineNo: MachineNo
            },
            success: function (response) {
                var len = response.length;
                for (i = 0; i < len; i++) {
                    const MachineNo = response[i].MachineNo;
                    const MachineID = response[i].MachineID;
                    $("#modalInpMachineSelect").append("<option value='"+ MachineID +"'>" + MachineNo + "</option>");
                }
            }
        })
    }

    //Add M/C from dropdown
    $(document).on("click", "#btnaddMC", function () {
        MachineID = $('#modalInpMachineSelect').val();
        $.ajax({
            url: "/mold_master/add_machine_no/"+MoldID,
            method: 'post',
            contentType: 'application/json',
            data: JSON.stringify({
                MachineID: MachineID,
            }),
            success: function () {
                tableMC.ajax.reload(null,false);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Created',
                    text: `Mold's Machine have been created`,
                    showConfirmButton: false,
                    timer: 1500
                })
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
                })
            }
        });
    })

//* CHECK BOX is default
    $("#modalTableMachineRelation").on('click', "input[type='checkbox']", function(){
        let $box = $(this);
        if ($box.is(":checked")) {
            var group = "input:checkbox[name='" + $box.attr("name") + "']";
            $(group).prop("checked", false);
            $box.prop("checked", true);
            rows = $(this).closest("tr");
            MoldMCID = tableMC.rows(rows).data()[0].MoldMCID;
            $.ajax({
                url: '/mold_master/set_default/' + MoldMCID,
                method: 'put',
                contentType: 'application/json',
                data: JSON.stringify({
                    MoldID: MoldID
                })
            })

        } else {
            $box.prop("checked", false);
        }
    })

});