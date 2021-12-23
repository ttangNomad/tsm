$(document).ready(function () {

    

    $("#linkPrinting").click(function(){
            ColorName = HardenerName = ThinnerName = PrintingID = PartID_IN = PartID_OUT = MFG = PcsHr = Size = InkLife = ManPower = JigID = InkQtyID = null;
    })
   
    //Fill table Printing List
    function fill_tablePrintList(RefID){
        tablePrintList = $('#tablePrintList').DataTable({
         "bDestroy":true,

        "ajax":{
            "url": '/printing/printing_list/'+RefID,
            "dataSrc":""
        },
        "columns":[
            {"data":"index"},
            {"data":"PartIN"},
            {"data":"PartOUT"},
            {"data":"MFG"},
            {"data":"PcsHr"},
            {"data":"Size"},
            {"data":"InkLife"},
            {"data":"Operator"},
            {"data":"PrintingID"},
            {"data":"PartID_IN"},
            {"data":"PartID_OUT"},
            {"data":"InkQtyID"}
        ],
        "initComplete": function(){
            CountRows = tablePrintList.data().count();
            $("#badgePrinting").text(CountRows)
        },
        "columnDefs": [
            {
                "targets": [8,9,10,11],
                "visible": false
    
            },
        ],
    });
    fill_tablePrintJig(null)
    fill_tablePrintMixRatio(null)
    }

    //add btn Printing List
    $(document).on('click','#btnPrintAdd',function(e){
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
                    $('#modal_PrintAdd').addClass('programmatic');
                    $('#modal_PrintAdd').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        } else {
        $('#form_PrintAdd').trigger('reset');
        $('.modal-title').text('Add Printing List:')
        $(".selectpicker").selectpicker("refresh");
        $('#modalSavePrint').unbind('click')

        $('#modalSavePrint').click(function ()  {
            PartID_IN = $.trim($('#modal_PrintPartInput').val());
            PartID_OUT = $.trim($('#modal_PrintPartOutput').val());
            MFG = $.trim($('#modal_PrintMFG').val());
            PcsHr = $.trim($('#modal_PrintTarget').val());
            InkQtyID = $.trim($('#modal_PrintPlateSizeBox').val());
            InkLife = $.trim($('#modal_PrintInkLife').val());
            ManPower = $.trim($('#modal_PrintManpower').val());
            if (PartID_IN=="null"||PartID_OUT=="null"||MFG==""||PcsHr==""||InkQtyID=="null"||InkLife==""||ManPower=="") {
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
                url: "/printing/add_printing/"+RefID,
                data: JSON.stringify({
                    PartID_IN: PartID_IN,
                    PartID_OUT:PartID_OUT,
                    MFG:MFG,
                    PcsHr:PcsHr,
                    InkQtyID:InkQtyID,
                    InkLife:InkLife,
                    ManPower:ManPower
                }),
                success: function (data) {
                    fill_tablePrintList(RefID)
                    $('#modal_PrintAdd').modal('hide')
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Added',
                        text: 'Printing List have been added',
                        showConfirmButton: false,
                        timer: 1500
                    });
            } });
        }
        })
    
    }})

    //Edit btn Printing List
    $(document).on('click', '#btnPrintEdit', function (e) {
        if (!PrintingID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Printing.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function(result){       //Close modal when Swal close
                if (result.value) {
                    $('#modal_PrintAdd').addClass('programmatic');
                    $('#modal_PrintAdd').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        $('#form_PrintAdd').trigger('reset');

        } else {
        $('.modal-title').text('Edit Printing List:')
        $('#modalSavePrint').unbind('click')

        $('#modal_PrintPartInput').val(PartID_IN)
        $('#modal_PrintPartOutput').val(PartID_OUT)
        $("#modal_PrintMFG").val(MFG);
        $("#modal_PrintTarget").val(PcsHr);
        $('#modal_PrintPlateSizeBox').val(InkQtyID)
        $("#modal_PrintInkLife").val(InkLife);
        $("#modal_PrintManpower").val(ManPower);
        $(".selectpicker").selectpicker("refresh");

        $("#modalSavePrint").click(function () {
            PartID_IN = $.trim($('#modal_PrintPartInput').val());
            PartID_OUT = $.trim($('#modal_PrintPartOutput').val());
            MFG = $.trim($('#modal_PrintMFG').val());
            PcsHr = $.trim($('#modal_PrintTarget').val());
            InkQtyID = $.trim($('#modal_PrintPlateSizeBox').val());
            InkLife = $.trim($('#modal_PrintInkLife').val());
            ManPower = $.trim($('#modal_PrintManpower').val());
            if (PartID_IN=="null"||PartID_OUT=="null"||MFG==""||PcsHr==""||InkQtyID==""||InkLife==""||ManPower=="") {
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
                url: "/printing/edit_printing/" + PrintingID,
                data: JSON.stringify({
                    PartID_IN: PartID_IN,
                    PartID_OUT:PartID_OUT,
                    MFG:MFG,
                    PcsHr:PcsHr,
                    InkQtyID:InkQtyID,
                    InkLife:InkLife,
                    ManPower:ManPower
                }),
                success: function (data) {
                    tablePrintList.ajax.reload(null,false)
                    $('#modal_PrintAdd').modal('hide')
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Printing List have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    PrintingID = null;
                }
            });
        }
        })
    }})

    //click delete btn Printing List
    $(document).on('click','#btnPrintDel',function(e){
        if (!PrintingID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Printing.',
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
            url: "/printing/delete_printing/"+PrintingID,
            contentType: "application/json",
            success: function (response) {
                fill_tablePrintList(RefID)
                $('#modalDeleteConfirm').modal('hide');
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Deleted',
                    text: 'Printing List have been Deleted',
                    showConfirmButton: false,
                    timer: 1500
                });

                }
            });
        })
    }})

    //Fill jig
    function fill_tablePrintJig(PrintingID) {
        tablePrintJig = $('#tablePrintJig').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": '/printing/jig_list/'+PrintingID,
                "dataSrc": ""
            },
            "columns": [
                {"data": "index"},
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
    }

    //click add btn Jig List
    $(document).on("click", "#btnPrintJigAdd", function(e){
        if (!PrintingID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Printing.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function(result){       //Close modal when Swal close
                if (result.value) {
                    $('#modal_PrintJigAdd').addClass('programmatic');
                    $('#modal_PrintJigAdd').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        } else {
        $("#form_PrintJigAdd").trigger("reset");
        $(".modal-title").text("Add Jig List:");
        $("#modalSavePrintJig").unbind('click') ; 

        $('#modalSavePrintJig').click(function(){
            JigNo =  $.trim($('#modal_PrintJigInput').val());
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
                url:"/printing/add_jig/"+PrintingID,
                method: 'post',
                contentType: 'application/json',
                data:  JSON.stringify(
                    {JigNo:JigNo}),
                success: function(response) {
                    tablePrintJig.ajax.reload(null,false)
                    $('#modal_PrintJigAdd').modal('hide');
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
    $(document).on("click", "#btnPrintJigEdit", function(e){
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
            }).then(function(result){       //Close modal when Swal close
                if (result.value) {
                    $('#modal_PrintJigAdd').addClass('programmatic');
                    $('#modal_PrintJigAdd').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        $("#form_PrintJigAdd").trigger("reset");

        } else {
        $(".modal-title").text("Edit Jig List:");
        $('#modal_PrintJigInput').val(JigNo)
        $("#modalSavePrintJig").unbind('click') ; 

        $('#modalSavePrintJig').click(function(){
        JigNo =  $.trim($('#modal_PrintJigInput').val());
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
            url: "/printing/edit_jig/"+JigID, 
            method: 'put',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(
                {
                JigNo:JigNo,
                PrintingID:PrintingID
                }),
                success: function () {
                    tablePrintJig.ajax.reload(null,false)
                    $('#modal_PrintJigAdd').modal('hide');
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
            })
        }
        })
    }})

     //click delete btn Jig List
     $(document).on('click','#btnPrintJigDel',function(e){
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
            url: "/printing/delete_jig/"+JigID,
            contentType: "application/json",
            success: function (response) {
                tablePrintJig.ajax.reload(null,false);
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
    function fill_tablePrintMixRatio(PrintingID){
        if (PrintingID==null) {
            $("#tablePrintMixRatio tbody").html("<tr>" +
                                                    "<th style ='width:280px;'>Color</th>"+
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
            tablePrintMixRatio = $('#tablePrintMixRatio').DataTable({
                "bDestroy": true,
    
                "ajax": {
                    "url": '/printing/mixing/'+PrintingID,
                    "dataSrc": ""
                },
                "columns": [
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
        })
    }};
    function Convert_data() {
        //covert value when Ratio change
        ColorRatio = $("#modal_PrintMixRatioCInput").val();
        ColorUsage = $("#modal_PrintMatPerPcsCCInput").val();
        HardenerRatio = $("#modal_PrintMixRatioHInput").val();
        ThinnerRatio = $("#modal_PrintMixRatioTInput").val();
        //Change ColorRatio
        $("#modal_PrintMixRatioCInput").on("input",function(){
            ColorRatio = $("#modal_PrintMixRatioCInput").val();
            var Ratio = ColorUsage/ColorRatio;
            let HardenerUsage = HardenerRatio*Ratio;
            $('#modal_PrintMatPerPcsHInput').val(HardenerUsage)
            let ThinnerUsage = ThinnerRatio*Ratio;
            $('#modal_PrintMatPerPcsTInput').val(ThinnerUsage)
        })
        //Change ColorUsage
        $("#modal_PrintMatPerPcsCCInput").on("input",function(){
            ColorUsage = $("#modal_PrintMatPerPcsCCInput").val();
            var Ratio = ColorUsage/ColorRatio;
            let HardenerUsage = HardenerRatio*Ratio;
            $('#modal_PrintMatPerPcsHInput').val(HardenerUsage)
            let ThinnerUsage = ThinnerRatio*Ratio;
            $('#modal_PrintMatPerPcsTInput').val(ThinnerUsage)
        })

        //Change HardenerRatio 
        $("#modal_PrintMixRatioHInput").on("input",function(){
            var Ratio = ColorUsage/ColorRatio;
            HardenerRatio = $("#modal_PrintMixRatioHInput").val();
            let HardenerUsage = HardenerRatio*Ratio;
            $('#modal_PrintMatPerPcsHInput').val(HardenerUsage)
        })
        //Change ThinnerRatio
        $("#modal_PrintMixRatioTInput").on("input",function(){
            var  Ratio = ColorUsage/ColorRatio;
            ThinnerRatio = $("#modal_PrintMixRatioTInput").val();
            let  ThinnerUsage = ThinnerRatio*Ratio;
            $('#modal_PrintMatPerPcsTInput').val(ThinnerUsage)
        })
    }

    //click btn edit Mixing Ratio
    $(document).on("click","#btnPrintMixEdit",function(e){
        if (!PrintingID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Printing.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function(result){       //Close modal when Swal close
                if (result.value) {
                    $('#modal_PrintMixingEdit').addClass('programmatic');
                    $('#modal_PrintMixingEdit').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        $("#form_SprayMixingEdit").trigger("reset");

        } else {
        $('.modal-title').text('Edit Mixing Ratio:')
        ColorName = tablePrintMixRatio.row().cells().data()[1];
        MixRatioCSpray = tablePrintMixRatio.row().cells().data()[2];
        MatPerPcsCSpray = tablePrintMixRatio.row().cells().data()[3];
        HardenerName = tablePrintMixRatio.row().cells().data()[5];
        MixRatioHSpray = tablePrintMixRatio.row().cells().data()[6];
        MatPerPcsHSpray = tablePrintMixRatio.row().cells().data()[7];
        ThinnerName = tablePrintMixRatio.row().cells().data()[9];
        MixRatioTSpray = tablePrintMixRatio.row().cells().data()[10];
        MatPerPcsTSpray = tablePrintMixRatio.row().cells().data()[11];

        //get data from table to show in modal edit
        $('#modal_PrintColorNameInput option').filter(function(){
            if(!ColorName){
                dropdowntext = $(this).val();
                return dropdowntext.startsWith("null");
            }else{
                dropdowntext = $(this).text();
                return dropdowntext.startsWith(ColorName);
            }}).prop('selected',true);

        $('#modal_PrintMixRatioCInput').val(MixRatioCSpray)
        $('#modal_PrintMatPerPcsCCInput').val(MatPerPcsCSpray)
        $('#modal_PrintHardenerNameInput option').filter(function(){
            if(!HardenerName){
                dropdowntext = $(this).val();
                return dropdowntext.startsWith("null");
            }else{
                dropdowntext = $(this).text();
                return dropdowntext.startsWith(HardenerName);
            }}).prop('selected',true);
        $('#modal_PrintMixRatioHInput').val(MixRatioHSpray)
        $('#modal_PrintMatPerPcsHInput').val(MatPerPcsHSpray)
        $('#modal_PrintThinnerNameInput option').filter(function(){
            if(!ThinnerName){
                dropdowntext = $(this).val();
                return dropdowntext.startsWith("null");
            }else{
                dropdowntext = $(this).text();
                return dropdowntext.startsWith(ThinnerName);
            }}).prop('selected',true);
        $('#modal_PrintMixRatioTInput').val(MixRatioTSpray)
        $('#modal_PrintMatPerPcsTInput').val(MatPerPcsTSpray)

        Convert_data()

        $('#modalSavePrintMixing').click(function(){
            ColorID = $.trim($('#modal_PrintColorNameInput').val());
            MixRatioC = $.trim($('#modal_PrintMixRatioCInput').val());
            MatPerPcsC = $.trim($('#modal_PrintMatPerPcsCCInput').val());
            HardenerID = $.trim($('#modal_PrintHardenerNameInput').val());
            MixRatioH = $.trim($('#modal_PrintMixRatioHInput').val());
            MatPerPcsH = $.trim($('#modal_PrintMatPerPcsHInput').val());
            ThinnerID = $.trim($('#modal_PrintThinnerNameInput').val());
            MixRatioT = $.trim($('#modal_PrintMixRatioTInput').val());
            MatPerPcsT = $.trim($('#modal_PrintMatPerPcsTInput').val());
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
                url: "/printing/edit_mixing/"+PrintingID,
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
                    // fill_tablePrintMixRatio(PrintingID)
                    tablePrintMixRatio.ajax.reload(null,false)
                    $('#modal_PrintMixingEdit').modal('hide')
                    $('#modalSavePrintMixing').unbind('click')
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
    


//==============================================================================//
    //click on Reference Number table
    $("#tableRefNumber tbody").on('click',"tr",function(){
        fill_tablePrintList(RefID)
        ColorName = HardenerName = ThinnerName = PrintingID = PartID_IN = PartID_OUT = MFG = PcsHr = Size = InkLife = ManPower = JigID = InkQtyID = null;

    })

    //click on Printing List table
    $('#tablePrintList tbody').on('click', 'tr', function(){
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            PrintingID = PartID_IN = PartID_OUT = MFG = PcsHr = Size = InkLife = ManPower = InkQtyID= null;
        }
        else{
            $('#tablePrintList tr').removeClass('selected');
            $(this).toggleClass('selected');
            PrintingID = tablePrintList.rows($(this)).data()[0].PrintingID;
            PartID_IN = tablePrintList.rows($(this)).data()[0].PartID_IN;
            PartID_OUT = tablePrintList.rows($(this)).data()[0].PartID_OUT;
            InkQtyID = tablePrintList.rows($(this)).data()[0].InkQtyID;

            MFG = $(this).find('td:eq(3)').text();
            PcsHr = $(this).find('td:eq(4)').text();
            Size = $(this).find('td:eq(5)').text();
            InkLife = $(this).find('td:eq(6)').text();
            ManPower = $(this).find('td:eq(7)').text();
        }
        fill_tablePrintMixRatio(PrintingID)
        fill_tablePrintJig(PrintingID)
    })

    //click on Jig List table
    $('#tablePrintJig tbody').on('click', 'tr', function(){
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            JigID = JigNo =null;
        }
        else{
            $('#tablePrintJig tr').removeClass('selected');
            $(this).toggleClass('selected');
            JigID = tablePrintJig.rows($(this)).data()[0].JigID;
            JigNo = $(this).find('td:eq(1)').text();
        }
    })
    $("#modalSaveRef").click(function(){
        fill_tablePrintList(null)
    })
})