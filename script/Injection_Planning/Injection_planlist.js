//Select Data
$("#btnSelectPlan").click(function () {
    selPlanMonth = $("#selPlanMonth").val()
    selMachineNo = $("#selMachineNo").val()
    selStatus = $("#selStatus").val()
    if (!selPlanMonth||!selMachineNo||!selStatus) {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Warning',
            text: 'Please select Month',
            showConfirmButton: true,
            confirmButtonText: 'OK',
            confirmButtonColor: '#dc3545'
        })
    }else{
        A1 = $("#headingMachine option:selected").html(selMachineNo); //!
        console.log(A1);
        $( "#headingMachine option:selected" ).each(function() {
            str = $( this ).text();
            console.log(str);
        });
        $.trim($("#selMachineNo").text())
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "",
            data: JSON.stringify({
                selPlanMonth: selPlanMonth,
                selMachineNo:selMachineNo,
                selStatus:selStatus,
            }),
            success: function () {
            }
        });
    }
});

function fill_tbPlanNoList() { //!In btn PL LIST
    console.log("Testqqqqqq");
//     tbPlanNoList = $('#tbPlanNoList').DataTable({
//         "bDestroy":true,

//        "ajax":{
//            "url": '',
//            "dataSrc":""
//        },
//        "columns":[
//            {"data":"RunningNo"},
//            {"data":"McNo"},
//            {"data":"Part"},
//            {"data":"By"},
//            {"data":"Issue"}
//        ],
//         "initComplete": function(){
//             CountRows = tbPlanNoList.data().count();
//             $("#badgePrinting").text(CountRows)
//         },
//        "columnDefs": [
//            {
//                "targets": [],
//                "visible": false
   
//            },
//        ],
//    });
}

function fill_tbInjPlanList() {
    tbInjPlanList = $('#tbInjPlanList').DataTable({
        "bDestroy": true,

        "ajax": {
            "url": 'url',
            "dataSrc": ""
        },
        "columns": [
            {
                "data": "index"
            },
            {
                "render": function (data, type, row, meta) {
                    if (row.ovenStatus == '1') { //READY
                        return '<span class="fa fa-circle mx-1" style="font-size: 2em;color: var(--green);"></span><b class="mx-1 text-center">Ready</b>'
                    } else if (row.ovenStatus == '2') { //START
                        return '<span class="fa fa-circle btn--blink text-success mx-1" style="font-size: 2em;color: var(--green);""></span><b class="text-success mx-1 text-center">Start</b>'
                    } else if (row.ovenStatus == '3') { //RUN
                        return '<span class="fa fa-circle mx-1" style="font-size: 2em;color: #17a2b8;"></span><b class="text-info mx-1 text-center">Run</b>'
                    }
                }
            },
            {
                "data": "mcNo"
            },
            {
                "data": "PlanningNo"
            },
            {
                "data": "Customer"
            },
            {
                "data": "PartCode"
            },
            {
                "data": "PartName"
            },
            {
                "data": "BasicMold"
            },
            {
                "data": "Material"
            },
            {
                "data": "IssuedDate"
            },
            {
                "data": "RevisedDate"
            },
            {
                "defaultContent": '<td class="py-1"><button id="btnEditInjPlanList" class="btn btn-info p-0 mx-1" data-toggle="modal" data-target="#modalInjectionPlanAdd" style="width: 2rem;" type="button"><i class="fa fa-pencil-square-o"></i></button><button class="btn btn-danger p-0 mx-1" data-toggle="modal" data-target="#modalDeleteConfirm" style="width: 2rem;" type="button"><i class="fa fa-remove"></i></button></td>'
            },
        ],
        "columnDefs": [{
            "targets": [],
            "visible": false
        }, ],
        "initComplete": function () {
            CountRows = tableInj.data().count()
            $('#badgeInjection').text(CountRows)
        },
    });
}

$("#tbInjPlanList tbody").on('click', "tr", function () {

    $('#tbInjPlanList tr').removeClass('selected');
    $(this).toggleClass('selected');
    rows = $(this).closest('tr');
    // RefID = tableRefNumber.rows(rows).data()[0].RefID;
    // RefNo = tableRefNumber.rows(rows).data()[0].RefNo;
    // Index = rows.find('td:eq(0)').text();
    // PartCode = rows.find('td:eq(2)').text();
    // PartName = rows.find('td:eq(3)').text();
    // Model = rows.find('td:eq(5)').text();
    CustomerName = rows.find('td:eq(4)').text();
    $("#selInjPlan").val(CustomerName);
    console.log(CustomerName);


})







//=========Hide in modal==========//

$("#modal_InjplanPlantype").change(function () {
    selectPlantypeval = $("#modal_InjplanPlantype").val()
    console.log(selectPlantypeval);
    if (selectPlantypeval == "2") {
        // $("#modal_Plantype").hide();
        $(".assyHide").hide();
        
    } else {
        $(".assyHide").show();
    }
});

//===============Plan 1===============//
$("#btnSelEditBox01").click(function () {
    position = 1;
    if (!$("#selInjPlan").val()) {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Warning',
            text: 'Please Select Plan',
            showConfirmButton: true,
            confirmButtonText: 'OK',
            confirmButtonColor: '#dc3545'
        })
    } else {
        fill_InjPlan()
        fill_MatPlan()
        fill_PackingPlan()

    //=================Text in tap===================//
        // $("#iconNoti-"+position).val(Status);
        // $("#planIndex-"+position).val(position); 
        // $("#planPlanNo-"+position).val(PlanningNo);
        // $("#planCust-"+position).val(Customer);
        // $("#planPartName-"+position).val(PartName);

    //====================ScrollTo===================//
        $('html, body').animate({
            scrollTop: $("#collapsePlanIndex01").offset().top
        }, 1000);
    }
});

$('a[href="#tabMaterialPlan01"]').click(function () {  
    console.log();
    $("#plan01_matCustomer").val();
    $("#plan01_matPartName").val();
    $("#plan01_matPartNo").val();
    $("#plan01_matBasicMold").val();
    $("#plan01_matDieNo").val();
    $("#plan01_matMaterial").val();
    $("#plan01_matColor").val();
    $("#plan01_matNetWeight").val();
    $("#plan01_matRunnerWeight").val();
    $("#plan01_matCycleTime").val();
    $("#plan01_matCavity").val();
    $("#plan01_matMaterialUsed").val();
    $("#plan01_matVirgin").val();
    $("#plan01_matRemark").val();
    $("#plan01_matDelivery").val();    
});


//======================end Plan 1========================//

$("#btnSelEditBox02").click(function () {
    position = 2;
    if (!$("#selInjPlan").val()) {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Warning',
            text: 'Please Select Plan',
            showConfirmButton: true,
            confirmButtonText: 'OK',
            confirmButtonColor: '#dc3545'
        })
    } else {
        fill_InjPlan()
        fill_MatPlan()
        fill_PackingPlan()

        $('html, body').animate({
            scrollTop: $("#collapsePlanIndex02").offset().top
        }, 1000);
    }
});

$("#btnSelEditBox03").click(function () {
    position = 3;
    if (!$("#selInjPlan").val()) {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Warning',
            text: 'Please Select Plan',
            showConfirmButton: true,
            confirmButtonText: 'OK',
            confirmButtonColor: '#dc3545'
        })
    } else {
        fill_InjPlan()
        fill_MatPlan()
        fill_PackingPlan()

        $('html, body').animate({
            scrollTop: $("#collapsePlanIndex03").offset().top
        }, 1500);
    }
});

function fill_InjPlan() {
    $.ajax({
        type: "get",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/dropdown/part_data/"+1,

        success: function (response) {
            console.log(position);
            $("#plan0"+position+"_InjCustomer").val(response[0].Customer);
            $("#plan0"+position+"_injPartName").val(response[0].PartName);
            $("#plan0"+position+"_injPartNo").val(response[0].PartNo);
            $("#plan0"+position+"_injBasicMold").val(response[0].BasicMold);
            $("#plan0"+position+"_injDieNo").val(response[0].DieNo);
            $("#plan0"+position+"_injMaterial").val(response[0].Material);
            $("#plan0"+position+"_injColor").val(response[0].Color);
            $("#plan0"+position+"_injNetWeight").val(response[0].NetWeight);
            $("#plan0"+position+"_injRunnerWeight").val(response[0].RunnerWeight);
            $("#plan0"+position+"_injCycleTime").val(response[0].CycleTime);
            $("#plan0"+position+"_injCavity").val(response[0].Cavity);
            $("#plan0"+position+"_injMaterialUsed").val(response[0].MaterialUsed);
            $("#plan0"+position+"_injVirgin").val(response[0].Virgin);
            $("#plan0"+position+"_injRemark").val(response[0].Remark);
            $("#plan0"+position+"_injDelivery").val(response[0].Delivery);

            $("#plan0"+position+"_MatAckDate").val();
            $("#plan0"+position+"_PackAckDate").val();
            $("#plan0"+position+"_MatAckDate").val();

            fill_InjPlanList()
        }
    });
}

function fill_MatPlan() {
    $.ajax({
        type: "get",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/dropdown/part_data/"+1,

        success: function (response) {
            console.log(position);
            $("#plan0"+position+"_matCustomer").val(response[0].Customer);
            $("#plan0"+position+"_matPartName").val(response[0].PartName);
            $("#plan0"+position+"_matPartNo").val(response[0].PartNo);
            $("#plan0"+position+"_matBasicMold").val(response[0].BasicMold);
            $("#plan0"+position+"_matDieNo").val(response[0].DieNo);
            $("#plan0"+position+"_matMaterial").val(response[0].Material);
            $("#plan0"+position+"_matColor").val(response[0].Color);
            $("#plan0"+position+"_matNetWeight").val(response[0].NetWeight);
            $("#plan0"+position+"_matRunnerWeight").val(response[0].RunnerWeight);
            $("#plan0"+position+"_matCycleTime").val(response[0].CycleTime);
            $("#plan0"+position+"_matCavity").val(response[0].Cavity);
            $("#plan0"+position+"_matMaterialUsed").val(response[0].MaterialUsed);
            $("#plan0"+position+"_matVirGin").val(response[0].Virgin);
            $("#plan0"+position+"_matRemark").val(response[0].Remark);
            $("#plan0"+position+"_matDelivery").val(response[0].Delivery);
            fill_InjPlanList()
        }
    });
}

function fill_PackingPlan() {
    $.ajax({
        type: "get",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: "/dropdown/part_data/"+1,

        success: function (response) {
            console.log(position);
            $("#plan0"+position+"_packCustomer").val(response[0].Customer);
            $("#plan0"+position+"_packPartName").val(response[0].PartName);
            $("#plan0"+position+"_packPartCode").val(response[0].PartCode);
            $("#plan0"+position+"_packRemark").val(response[0].Remark);
            $("#plan0"+position+"_packDelivery").val(response[0].Delivery);
            fill_InjPlanList()
        }
    });
}

function fill_InjPlanList() {  
    if (position == "1") {

    } else {
        
    }
}

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
})