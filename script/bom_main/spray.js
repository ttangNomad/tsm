$(document).ready(function () {

    

    $("#linkSpray").click(function(){
        ColorName = HardenerName = ThinnerName = SprayID = JigID = PartID_IN = PartID_OUT = MFG = PcsHr = Viscosity = InkLife = McTypeID = ManPower = PartOUT=PartIN= null;
    })

    //Fill Spray List
    function fill_tableSprayList(RefID) {
        tableSprayList = $('#tableSprayList').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": '/spray/spray_list/' + RefID,
                "dataSrc": ""
            },
            "columns": [
                {"data": "index"},
                {"data": "PartIN"},
                {"data": "PartOUT"},
                {"data": "MFG"},
                {"data": "PcsHr"},
                {"data": "Viscosity"},
                {"data": "InkLife"},
                {"data": "McTypeName"},
                {"data": "Operator"},
                {"data": "SprayID"},
                {"data": "PartID_IN"},
                {"data": "PartID_OUT"},
                {"data": "McTypeID"}
            ],
            "initComplete": function(){
                CountRows = tableSprayList.data().count();
                $("#badgeSpray").text(CountRows)
            },
            "columnDefs": [
                {
                    "targets": [9,10,11,12],
                    "visible": false
                },
            ],
        });
        fill_tableSprayJig(null)
        fill_tableSprayMixRatio(null)
    }
    //click add btn Spray List
    $(document).on('click','#btnSprayAdd',function(e){
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
                    $('#modal_SprayAdd').addClass('programmatic');
                    $('#modal_SprayAdd').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        } else {
        $('#form_SprayAdd').trigger('reset');
        $('.modal-title').text('Add Spray List:')
        $(".selectpicker").selectpicker("refresh");
        $('#modalSaveSpray').unbind('click')

        $('#modalSaveSpray').click(function ()  {
            PartID_IN = $.trim($('#modal_SprayPartInput').val());
            PartID_OUT = $.trim($('#modal_SprayPartOutput').val());
            MFG = $.trim($('#modal_SprayMFG').val());
            PcsHr = $.trim($('#modal_SprayTarget').val());
            Viscosity = $.trim($('#modal_SprayViscosity').val());
            InkLife = $.trim($('#modal_SprayInkLife').val());
            McTypeID = $.trim($('#modal_SprayMachine').val());
            ManPower = $.trim($('#modal_SprayManpower').val());
            if (PartID_IN=="null"||PartID_OUT=="null"||MFG==""||PcsHr==""||Viscosity==""||InkLife==""||McTypeID=="null"||ManPower=="") {
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
                dataType: "json",
                url: "/spray/add_spray/"+RefID,
                data: JSON.stringify({
                    PartID_IN: PartID_IN,
                    PartID_OUT:PartID_OUT,
                    MFG:MFG,
                    PcsHr:PcsHr,
                    Viscosity:Viscosity,
                    InkLife:InkLife,
                    McTypeID:McTypeID,
                    ManPower:ManPower
                }),
                success: function (data) {
                    fill_tableSprayList(RefID)
                    $('#modal_SprayAdd').modal('hide')
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Added',
                        text: 'Spray List have been added',
                        showConfirmButton: false,
                        timer: 1500
                    });
            } });
        }
        })
    }})

    //click Edit btn Spray List
    $(document).on('click', '#btnSprayEdit', function (e) {
        if (!SprayID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Spray.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function(result){       //Close modal when Swal close
                if (result.value) {
                    $('#modal_SprayAdd').addClass('programmatic');
                    $('#modal_SprayAdd').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        $('#form_SprayAdd').trigger('reset');

        } else {
        $('.modal-title').text('Edit Spray List:')
        $('#modalSaveSpray').unbind('click')

        $('#modal_SprayPartInput').val(PartID_IN)
        $('#modal_SprayPartOutput').val(PartID_OUT)
        $("#modal_SprayMFG").val(MFG);
        $("#modal_SprayTarget").val(PcsHr);
        $("#modal_SprayViscosity").val(Viscosity);
        $("#modal_SprayInkLife").val(InkLife);
        $('#modal_SprayMachine').val(McTypeID)
        $("#modal_SprayManpower").val(ManPower);
        $(".selectpicker").selectpicker("refresh");

        $("#modalSaveSpray").click(function () {
            PartID_IN = $.trim($('#modal_SprayPartInput').val());
            PartID_OUT = $.trim($('#modal_SprayPartOutput').val());
            MFG = $.trim($('#modal_SprayMFG').val());
            PcsHr = $.trim($('#modal_SprayTarget').val());
            Viscosity = $.trim($('#modal_SprayViscosity').val());
            InkLife = $.trim($('#modal_SprayInkLife').val());
            McTypeID = $.trim($('#modal_SprayMachine').val());
            ManPower = $.trim($('#modal_SprayManpower').val());
            if (PartID_IN=="null"||PartID_OUT=="null"||MFG==""||PcsHr==""||Viscosity==""||InkLife==""||McTypeID=="null"||ManPower=="") {
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
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: "/spray/edit_spray/" + SprayID,
                data: JSON.stringify({
                    PartID_IN: PartID_IN,
                    PartID_OUT: PartID_OUT,
                    MFG: MFG,
                    PcsHr: PcsHr,
                    Viscosity: Viscosity,
                    InkLife: InkLife,
                    McTypeID: McTypeID,
                    ManPower: ManPower
                }),
                success: function (data) {
                    tableSprayList.ajax.reload(null,false)
                    $('#modal_SprayAdd').modal('hide')
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Spray List have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    SprayID = null;
                }
            });
        }
        })
    }})

    //click delete btn Spray List
    $(document).on('click','#btnSprayDel',function(e){
        if (!SprayID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Spray.',
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
        $("#btnYes").unbind("click");
    
        $("#btnYes").click(function(){
        $.ajax({
            type: "delete",
            url: "/spray/delete_spray/"+SprayID,
            contentType: "application/json",
            success: function (response) {
                fill_tableSprayList(RefID)
                $('#modalDeleteConfirm').modal('hide');
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Deleted',
                    text: 'Spray List have been Deleted',
                    showConfirmButton: false,
                    timer: 1500
                });
                }
            });
        })
    }})

    //Fill jig
    function fill_tableSprayJig(SprayID) {
        tableSprayJig = $('#tableSprayJig').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": '/spray/jig_list/'+SprayID,
                "dataSrc": ""
            },
            "columns": [
                {"data":"index"},
                {"data":"JigNo"},
                {"data":"JigID"}
            ],
            "columnDefs": [
            {
                "targets": [2],
                "visible": false
            },
        ],
    });
     tableSprayJig.on( 'order.dt search.dt', function () {
        tableSprayJig.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
         cell.innerHTML = i+1;
     } );
     } ).draw();
    }
    
    //click add btn Jig List
    $(document).on("click", "#btnSprayJigAdd", function(e){
        if (!SprayID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Spray.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function(result){       //Close modal when Swal close
                if (result.value) {
                    $('#modal_SprayJigAdd').addClass('programmatic');
                    $('#modal_SprayJigAdd').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        } else {
        $("#form_SprayJigAdd").trigger("reset");
        $(".modal-title").text("Add Jig List:");
        $("#modalSaveSprayJig").unbind('click') ; 

        $('#modalSaveSprayJig').click(function(){
            JigNo =  $.trim($('#modal_SprayJigInput').val());
            if (JigNo=="") {
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
                url:"/spray/add_jig/"+SprayID,
                method: 'post',
                contentType: 'application/json',
                data:  JSON.stringify(
                    {JigNo:JigNo}),
                success: function(response) {
                    tableSprayJig.ajax.reload(null,false)
                    $('#modal_SprayJigAdd').modal('hide');
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Added',
                        text: 'Jig List have been added',
                        showConfirmButton: false,
                        timer: 1500
                    });
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
                        confirmButtonColor: '#dc3545'
                    });
                }
        });
    }
        });
    }});

    //click on btn edit Jig List
    $(document).on("click", "#btnSprayJigEdit", function(e){
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
                    $('#modal_SprayJigAdd').addClass('programmatic');
                    $('#modal_SprayJigAdd').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        $("#form_SprayJigAdd").trigger("reset");

        } else {
        $(".modal-title").text("Edit Jig List:");
        $('#modal_SprayJigInput').val(JigNo)
        $("#modalSaveSprayJig").unbind('click') ;

        $('#modalSaveSprayJig').click(function(){
        JigNo =  $.trim($('#modal_SprayJigInput').val());
        if (JigNo=="") {
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
            url: "/spray/edit_jig/"+JigID, 
            method: 'put',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(
                {
                JigNo:JigNo,
                SprayID:SprayID
                }),
                success: function () {
                    tableSprayJig.ajax.reload(null,false)
                    $('#modal_SprayJigAdd').modal('hide');
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edit',
                        text: 'Jig List have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    });
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
                        confirmButtonColor: '#dc3545'
                    });
                    JigID = null;
                }
            })
        }

        })
    }})

    //click delete btn Jig List
    $(document).on('click','#btnSprayJigDel',function(e){
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
        $("#btnYes").unbind("click");
    
        $("#btnYes").click(function(){
        $.ajax({
            type: "delete",
            url: "/spray/delete_jig/"+JigID,
            contentType: "application/json",
            success: function (response) {
                tableSprayJig.ajax.reload(null,false);
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

    //fill table mix ratio
    function fill_tableSprayMixRatio(SprayID){
        if (SprayID==null) {
            $("#tableSprayMixRatio tbody").html("<tr>" +
                                                    "<th style ='width:280px ;'>Color</th>"+
                                                    "<td>-</td>" +
                                                    "<td>-</td>" +
                                                    "<td>-</td>" +
                                                    "</tr>"+
                                                    "<tr>" +
                                                    "<th>Hardener</th>"+
                                                    "<td>-</td>" +
                                                    "<td>-</td>" +
                                                    "<td>-</td>" +
                                                    "</tr>"+
                                                    "<tr>" +
                                                    "<th>Thinner</th>"+
                                                    "<td>-</td>" +
                                                    "<td>-</td>" +
                                                    "<td>-</td>" +
                                                    "</tr>");
        } else {
            tableSprayMixRatio = $('#tableSprayMixRatio').DataTable({
                "bDestroy": true,
                "ajax": {
                    "url": '/spray/mixing_new/'+SprayID,
                    "dataSrc": ""
                },
                "columns": [
                    // {"render": 
                    //     function(data,type,row,meta){
                    //         console.log(row);
                    //         return '<b>'+row.Material+'</b>'
                    //     }
                    // },
                    {"data":"Material"},
                    {"data":"Code"},
                    {"data":"MixRatioC"},
                    {"data":"MatPerPcsC"}
                ],
                "columnDefs": [
                    {
                        "targets": [0],
                        "className": "mixing-font",
                        "width": "280px"
                    },
                ],
                "searching": false,
                "paging": false,
                "info": false
        });
    }
}

    //click btn edit Mixing Ratio
    $(document).on("click","#btnSprayMixEdit",function(e){
        if (!SprayID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Spray.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function(result){       //Close modal when Swal close
                if (result.value) {
                    $('#modal_SprayMixingEdit').addClass('programmatic');
                    $('#modal_SprayMixingEdit').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
            $("#form_SprayMixingEdit").trigger("reset");
        } else {
        $('.modal-title').text('Edit Mixing Ratio:')

        ColorName = tableSprayMixRatio.row().cells().data()[1];
        MixRatioCSpray = tableSprayMixRatio.row().cells().data()[2];
        MatPerPcsCSpray = tableSprayMixRatio.row().cells().data()[3];
        HardenerName = tableSprayMixRatio.row().cells().data()[5];
        MixRatioHSpray = tableSprayMixRatio.row().cells().data()[6];
        MatPerPcsHSpray = tableSprayMixRatio.row().cells().data()[7];
        ThinnerName = tableSprayMixRatio.row().cells().data()[9];
        MixRatioTSpray = tableSprayMixRatio.row().cells().data()[10];
        MatPerPcsTSpray = tableSprayMixRatio.row().cells().data()[11];

        //get input form table
        $('#modal_SprayColorNameInput option').filter(function(){
            if(!ColorName){
                dropdowntext = $(this).val();
                return dropdowntext.startsWith("null");
            }else{
                dropdowntext = $(this).text();
                return dropdowntext.startsWith(ColorName);
            }}).prop('selected',true);
        
        $('#modal_SprayMixRatioCInput').val(MixRatioCSpray)
        $('#modal_SprayMatPerPcsCCInput').val(MatPerPcsCSpray)
        $('#modal_SprayHardenerNameInput option').filter(function(){
            if(!HardenerName){
                dropdowntext = $(this).val();
                return dropdowntext.startsWith("null");
            }else{
                dropdowntext = $(this).text();
                return dropdowntext.startsWith(HardenerName);
            }}).prop('selected',true);
        $('#modal_SprayMixRatioHInput').val(MixRatioHSpray)
        $('#modal_SprayMatPerPcsHInput').val(MatPerPcsHSpray)
        $('#modal_SprayThinnerNameInput option').filter(function(){
            if(!ThinnerName){
                dropdowntext = $(this).val();
                return dropdowntext.startsWith("null");
            }else{
                dropdowntext = $(this).text();
                return dropdowntext.startsWith(ThinnerName);
            }}).prop('selected',true);
        $('#modal_SprayMixRatioTInput').val(MixRatioTSpray)
        $('#modal_SprayMatPerPcsTInput').val(MatPerPcsTSpray)

        Convert_data()

        $('#modalSaveSprayMixing').click(function(){
            ColorID = $.trim($('#modal_SprayColorNameInput').val());
            MixRatioC = $.trim($('#modal_SprayMixRatioCInput').val());
            MatPerPcsC = $.trim($('#modal_SprayMatPerPcsCCInput').val());
            HardenerID = $.trim($('#modal_SprayHardenerNameInput').val());
            MixRatioH = $.trim($('#modal_SprayMixRatioHInput').val());
            MatPerPcsH = $.trim($('#modal_SprayMatPerPcsHInput').val());
            ThinnerID = $.trim($('#modal_SprayThinnerNameInput').val());
            MixRatioT = $.trim($('#modal_SprayMixRatioTInput').val());
            MatPerPcsT = $.trim($('#modal_SprayMatPerPcsTInput').val());
            if (ColorID=="null"||MixRatioC==""||MatPerPcsC==""||HardenerID=="null"||MixRatioH==""||MatPerPcsH==""||ThinnerID=="null"||MixRatioT==""||MatPerPcsT=="" ) {
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
                url: "/spray/edit_mixing/"+SprayID,
                data: JSON.stringify({
                    ColorID: ColorID,
                    MixRatioC:MixRatioC,
                    MatPerPcsC:MatPerPcsC,
                    HardenerID:HardenerID,
                    MixRatioH:MixRatioH,
                    MatPerPcsH:MatPerPcsH,
                    ThinnerID:ThinnerID,
                    MixRatioT:MixRatioT,
                    MatPerPcsT:MatPerPcsT,
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",

                success: function (response) {
                    fill_tableSprayMixRatio(SprayID)
                    $('#modal_SprayMixingEdit').modal('hide')
                    $('#modalSaveSprayMixing').unbind('click')
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Mixing Ratio have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        }
        })
    }})

    function Convert_data() {
        //covert value when Ratio change
        ColorRatio = $("#modal_SprayMixRatioCInput").val();
        ColorUsage = $("#modal_SprayMatPerPcsCCInput").val();
        HardenerRatio = $("#modal_SprayMixRatioHInput").val();
        ThinnerRatio = $("#modal_SprayMixRatioTInput").val();
        //Change ColorRatio
        $("#modal_SprayMixRatioCInput").on("input",function(){
            ColorRatio = $("#modal_SprayMixRatioCInput").val();
            var Ratio = ColorUsage/ColorRatio;
            let HardenerUsage = HardenerRatio*Ratio;
            $('#modal_SprayMatPerPcsHInput').val(HardenerUsage)
            let ThinnerUsage = ThinnerRatio*Ratio;
            $('#modal_SprayMatPerPcsTInput').val(ThinnerUsage)
        })
        //Change ColorUsage
        $("#modal_SprayMatPerPcsCCInput").on("input",function(){
            ColorUsage = $("#modal_SprayMatPerPcsCCInput").val();
            var Ratio = ColorUsage/ColorRatio;
            let HardenerUsage = HardenerRatio*Ratio;
            $('#modal_SprayMatPerPcsHInput').val(HardenerUsage)
            let ThinnerUsage = ThinnerRatio*Ratio;
            $('#modal_SprayMatPerPcsTInput').val(ThinnerUsage)
        })

        //Change HardenerRatio 
        $("#modal_SprayMixRatioHInput").on("input",function(){
            var Ratio = ColorUsage/ColorRatio;
            HardenerRatio = $("#modal_SprayMixRatioHInput").val();
            let HardenerUsage = HardenerRatio*Ratio;
            $('#modal_SprayMatPerPcsHInput').val(HardenerUsage)
        })
        //Change ThinnerRatio
        $("#modal_SprayMixRatioTInput").on("input",function(){
            var  Ratio = ColorUsage/ColorRatio;
            ThinnerRatio = $("#modal_SprayMixRatioTInput").val();
            let  ThinnerUsage = ThinnerRatio*Ratio;
            $('#modal_SprayMatPerPcsTInput').val(ThinnerUsage)
        })
    }

//==============================================================================//
    //click on Reference Number table
    $('#tableRefNumber').on('click', 'td', function(){
        fill_tableSprayList(RefID);
        ColorName = HardenerName = ThinnerName = SprayID = JigID = PartID_IN = PartID_OUT = MFG = PcsHr = Viscosity = InkLife = McTypeID = ManPower = PartOUT=PartIN= null;

    })

    //click on Spray List table
    $('#tableSprayList tbody').on('click', 'tr', function(){
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            SprayID = PartID_IN = PartID_OUT = MFG = PcsHr = Viscosity = InkLife = McType = ManPower = McTypeID = null;
        }
        else{
            $('#tableSprayList tr').removeClass('selected');
            $(this).toggleClass('selected');
            SprayID = tableSprayList.rows($(this)).data()[0].SprayID;
            PartID_IN = tableSprayList.rows($(this)).data()[0].PartID_IN;
            PartID_OUT = tableSprayList.rows($(this)).data()[0].PartID_OUT;
            McTypeID = tableSprayList.rows($(this)).data()[0].McTypeID;
            console.log(SprayID);
            MFG = $(this).find('td:eq(3)').text();
            PcsHr = $(this).find('td:eq(4)').text();
            Viscosity = $(this).find('td:eq(5)').text();
            InkLife = $(this).find('td:eq(6)').text();
            McType = $(this).find('td:eq(7)').text();
            ManPower = $(this).find('td:eq(8)').text();
            PartIN = tableSprayList.rows($(this)).data()[0].PartIN;

        }
        fill_tableSprayJig(SprayID)
        fill_tableSprayMixRatio(SprayID)
    })

    //click on Jig List table
    $('#tableSprayJig tbody').on('click', 'tr', function(){
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            JigID = JigNo =null;
        }
        else{
            $('#tableSprayJig tr').removeClass('selected');
            $(this).toggleClass('selected');
            JigID = tableSprayJig.rows($(this)).data()[0].JigID;
            JigNo = $(this).find('td:eq(1)').text();
        }
    })
    $("#modalSaveRef").click(function(){
        fill_tableSprayList(null)
    })
})