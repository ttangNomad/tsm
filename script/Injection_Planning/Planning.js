
$("#btnSelectPlan").click(function () {  
    $("#FormRecpNameModal").trigger("reset");
    $("#M_RecpNameSavebtn").click(function () {
        Customer = $.trim($("#M_RecpCookCnt-1").val());
        PartName = $.trim($("#M_RecpCookCnt-2").val());
        PartCode = $.trim($("#M_RecpCookCnt-3").val());
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: url,
            data: JSON.stringify({
                Customer: Customer,
                PartName: PartName,
                PartCode: PartCode,
            }),
            success: function (data) {
                console.log(data);
                // RefID = data.RefID;
                // console.log(RefID);
                // fill_TablePart(RefID)
                // tableRefNumber.ajax.reload(null, false);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Saved',
                    text: 'Reference have been saved',
                    showConfirmButton: false,
                    timer: 1500
                })
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

tbInjPlanList = $('#tbInjPlanList').DataTable({
    "bDestroy": true,
    "ajax": {
        "url": url,
        "dataSrc": ""
    },
    "columns": [
        {"data": "index"},
        {"data": "status"},
        {"data": "MachineNo."},
        {"data": "PlanningNo."},
        {"data": "Customer"},
        {"data": "PartCode"},
        {"data": "PartName"},
        {"data": "BasicMole"},
        {"data": "Material"},
        {"data": "IssuedDate"},
        {"data": "RevisedDate"},
        {"defaultContent":'<input type="checkbox" name="check" id="checkbox">'},
        {"defaultContent": '<td class="d-xl-flex justify-content-xl-center p-0"><button class="btn btn-info p-0 mx-1" data-toggle="modal" data-target="#modalInjectionPlanAdd" id="editInjectionPlan" style="width: 2rem;" type="button"><i class="fa fa-pencil-square-o"></i></button><button class="btn btn-danger p-0 mx-1" data-toggle="modal" data-target="#modalDeleteConfirm" type="button" id="delInjectionPlan" style="width: 2rem;"><i class="fa fa-remove"></i></button></td>'}
        
    ],
    // "columnDefs": [{
    //     "targets": [9, 10, 11],
    //     "visible": false
    // }],
});


//*Add Inj Plan List
$("#IngAdd").click(function () {
    $("#FormRecpNameModal").trigger("reset");
    $("#M_RecpNameSavebtn").click(function () {
        Customer = $.trim($("#M_RecpCookCnt-1").val());
        PartName = $.trim($("#M_RecpCookCnt-2").val());
        PartCode = $.trim($("#M_RecpCookCnt-3").val());
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: url,
            data: JSON.stringify({
                Customer: Customer,
                PartName: PartName,
                PartCode: PartCode,
            }),
            success: function (data) {
                console.log(data);
                // RefID = data.RefID;
                // console.log(RefID);
                // fill_TablePart(RefID)
                // tableRefNumber.ajax.reload(null, false);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Saved',
                    text: 'Reference have been saved',
                    showConfirmButton: false,
                    timer: 1500
                })
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
        // $("#refPart").show("modal");
    })
});

//*=================================================Drop Down====================================================
$.ajax({
    url: urlMachineNo,
    method: 'get',
    contentType: 'application/json',
    dataType: 'json',
    success: function (response) {
        let len = response.length;
        for (let i = 0; i < len; i++) {
            let MachineID = response[i].MachineID;
            let MachineNo = response[i].MachineNo;
            $("#selMachineNo").append("<option value=" + MachineID + ">" + MachineNo + "</option>");
        }
    }
})

$.ajax({
    url: urlMachineNo,
    method: 'get',
    contentType: 'application/json',
    dataType: 'json',
    success: function (response) {
        let len = response.length;
        for (let i = 0; i < len; i++) {
            let MachineID = response[i].MachineID;
            let MachineNo = response[i].MachineNo;
            $("#modal_injMoldSelect").append("<option value=" + MachineID + ">" + MachineNo + "<span>(" + DieNo + ")</span></option>");
        }
    }
})
