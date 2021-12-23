function LoadDropDown() {

    $.ajax({
        url: "/dropdown/part",
        method: 'get',
        contentType: 'application/json',

        dataType: 'json',
        success: function (response) {
            let len = response.length;
            for (let i = 0; i < len; i++) {
                let PartCode = response[i].PartCode;
                let PartID = response[i].PartID;
                let PartName = response[i].PartName;
                $("#modalSelPart").append("<option value=" + PartID + ">" + PartCode + "<span>(" + PartName + ")</span></option>");
                $("#modal_injComponentPartSelect").append("<option value=" + PartID + ">" + PartCode + "<span>(" + PartName + ")</span></option>");
                $("#modal_injCavitytPartSelect").append("<option value=" + PartID + ">" + PartCode + "<span>(" + PartName + ")</span></option>");
                $("#modal_HotStampPartInput").append("<option value=" + PartID + ">" + PartCode + "<span>(" + PartName + ")</span></option>");
                $("#modal_HotStampPartOutput").append("<option value=" + PartID + ">" + PartCode + "<span>(" + PartName + ")</span></option>");
                $("#modal_AssyPartOutput").append("<option value=" + PartID + ">" + PartCode + "<span>(" + PartName + ")</span></option>");
                $("#modal_AssyPartCode").append("<option value=" + PartID + ">" + PartCode + "<span>(" + PartName + ")</span></option>");
                $("#modal_SprayPartInput").append("<option value=" + PartID + ">" + PartCode + "<span>(" + PartName + ")</span></option>");
                $("#modal_SprayPartOutput").append("<option value=" + PartID + ">" + PartCode + "<span>(" + PartName + ")</span></option>");
                $("#modal_PrintPartInput").append("<option value=" + PartID + ">" + PartCode + "<span>(" + PartName + ")</span></option>");
                $("#modal_PrintPartOutput").append("<option value=" + PartID + ">" + PartCode + "<span>(" + PartName + ")</span></option>");
                $("#modal_WeldPartOutput").append("<option value=" + PartID + ">" + PartCode + "<span>(" + PartName + ")</span></option>");
            }
            $(".selectpicker").selectpicker('refresh');
        }

    })

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
                $("#modal_injMoldSelect").append("<option value=" + MoldID + ">" + BasicMold + "<span>(" + DieNo + ")</span></option>");
            }
            $(".selectpicker").selectpicker('refresh');

        }
    })


    //==================================Machine Dropdown============================\\
    $.ajax({
        url: "/dropdown/hot_stamp/McType",
        method: 'get',
        contentType: 'application/json',

        dataType: 'json',
        success: function (response) {
            let len = response.length;
            for (let i = 0; i < len; i++) {
                let McTypeID = response[i].McTypeID;
                let McTypeName = response[i].McTypeName;
                $("#modal_HotStampMachine").append("<option value=" + McTypeID + ">" + McTypeName + "</option>");
            }
            $(".selectpicker").selectpicker('refresh');
        }
    })

    $.ajax({
        url: "/dropdown/spray/McType",
        method: 'get',
        contentType: 'application/json',

        dataType: 'json',
        success: function (response) {
            let len = response.length;
            for (let i = 0; i < len; i++) {
                let McTypeID = response[i].McTypeID;
                let McTypeName = response[i].McTypeName;
                $("#modal_SprayMachine").append("<option value=" + McTypeID + ">" + McTypeName + "</option>");
            }
            $(".selectpicker").selectpicker('refresh');
        }
    })

    //================================InjMat Dropdown=========================\\
    $.ajax({
        url: "/dropdown/inj_mat",
        method: 'get',

        contentType: 'application/json',

        dataType: 'json',
        success: function (response) {
            let len = response.length;
            for (let i = 0; i < len; i++) {
                let Code = response[i].Code;
                let MaterialID = response[i].MaterialID;

                $("#modal_injMaterialSelect").append("<option value=" + MaterialID + ">" + Code + "</option>");
            }
            $(".selectpicker").selectpicker('refresh');

        }
    })

    //================================HotstampMat Dropdown=========================\\
    $.ajax({
        url: "/dropdown/hot_stamp_mat",
        method: 'get',

        contentType: 'application/json',

        dataType: 'json',
        success: function (response) {
            let len = response.length;
            for (let i = 0; i < len; i++) {
                let HSMID = response[i].HSMID;
                let FoilCode = response[i].FoilCode;
                // let MaterialID=response[i].MaterialID;

                $("#modal_HotStampMatCode").append("<option value=" + HSMID + ">" + FoilCode + "</option>");
            }
            $(".selectpicker").selectpicker('refresh');

        }
    })

    //================================PrintingBox Dropdown=========================\\
    $.ajax({
        url: "/dropdown/printing_box",
        method: 'get',

        contentType: 'application/json',

        dataType: 'json',
        success: function (response) {
            let len = response.length;
            for (let i = 0; i < len; i++) {
                let InkQtyID = response[i].InkQtyID;
                let Size = response[i].Size;
                let InkTray = response[i].InkTray;
                $("#modal_PrintPlateSizeBox").append("<option value=" + InkQtyID + ">" + Size + "<span>(" + InkTray + ")</span></option>");
            }
            $(".selectpicker").selectpicker('refresh');

        }
    })

    //================================Color Dropdown=========================\\
    $.ajax({
        url: "/dropdown/color",
        method: 'get',

        contentType: 'application/json',

        dataType: 'json',
        success: function (response) {
            let len = response.length;
            for (let i = 0; i < len; i++) {
                let ColorID = response[i].ColorID;
                let ColorName = response[i].ColorName;
                $("#modal_PrintColorNameInput").append("<option value=" + ColorID + ">" + ColorName + "</option>");
                $("#modal_SprayColorNameInput").append("<option value=" + ColorID + ">" + ColorName + "</option>");
            }
            $(".selectpicker").selectpicker('refresh');

        }
    })
    //================================Thinner Dropdown=========================\\
    $.ajax({
        url: "/dropdown/thinner",
        method: 'get',

        contentType: 'application/json',

        dataType: 'json',
        success: function (response) {
            let len = response.length;
            for (let i = 0; i < len; i++) {
                let ThinnerID = response[i].ThinnerID;
                let ThinnerName = response[i].ThinnerName;
                $("#modal_PrintThinnerNameInput").append("<option value=" + ThinnerID + ">" + ThinnerName + "</option>");
                $("#modal_SprayThinnerNameInput").append("<option value=" + ThinnerID + ">" + ThinnerName + "</option>");
            }
            $(".selectpicker").selectpicker('refresh');

        }
    })
    //================================Hardener Dropdown=========================\\
    $.ajax({
        url: "/dropdown/hardener",
        method: 'get',

        contentType: 'application/json',

        dataType: 'json',
        success: function (response) {
            let len = response.length;
            for (let i = 0; i < len; i++) {
                let HardenerID = response[i].HardenerID;
                let HardenerName = response[i].HardenerName;
                $("#modal_PrintHardenerNameInput").append("<option value=" + HardenerID + ">" + HardenerName + "</option>");
                $("#modal_SprayHardenerNameInput").append("<option value=" + HardenerID + ">" + HardenerName + "</option>");
            }
            $(".selectpicker").selectpicker('refresh');

        }
    })


    $.ajax({
        url: "/dropdown/customer",
        method: 'get',
        contentType: 'application/json',

        dataType: 'json',
        success: function (response) {
            let len = response.length;
            for (let i = 0; i < len; i++) {
                let CustomerName = response[i].CustomerName;
                let CustomerID = response[i].CustomerID;
                
                $("#modalInpCustomer").append("<option value=" + CustomerID + ">" + CustomerName + "</option>");
            }

        }
    })

    //======================================Packing=======================================//
    $.ajax({
        url: "/dropdown/packing/type",
        method: 'get',
        contentType: 'application/json',

        dataType: 'json',
        success: function (response) {
            let len = response.length;
            for (let i = 0; i < len; i++) {
                let PackingTypeName = response[i].PackingTypeName;
                let PackingTypeID = response[i].PackingTypeID;
                
                $("#selPackingType").append("<option value=" + PackingTypeID + ">" + PackingTypeName + "</option>");
            }
        }
    })

    $.ajax({
        url: "/dropdown/packing/delivery",
        method: 'get',
        contentType: 'application/json',

        dataType: 'json',
        success: function (response) {
            let len = response.length;
            for (let i = 0; i < len; i++) {
                let PackingDeliveryName = response[i].PackingDeliveryName;
                let PackingDeliveryID = response[i].PackingDeliveryID;
                
                $("#selPackingType-1").append("<option value=" + PackingDeliveryID + ">" + PackingDeliveryName + "</option>");
            }
        }
    })
}
LoadDropDown();