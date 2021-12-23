//==================================================MoldDropdown=================================\\
$.ajax({
    url: "/dropdown/mold",
    method: 'get',
    contentType: 'application/json',

    dataType: 'json',
    success: function (response) {
        let len = response.length;
        for (let i = 0; i < len; i++) {
            let BasicMold = response[i].BasicMold;
            let MoldID = response[i].MoldID;
            let DieNo = response[i].DieNo;
            $("#modal_InjplanBasicMold").append("<option value=" + MoldID + ">" + BasicMold + "<span>(" + DieNo + ")</span></option>");
        }
        $(".selectpicker").selectpicker('refresh');

    }
})