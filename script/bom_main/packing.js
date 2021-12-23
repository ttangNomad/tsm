$(document).ready(function () {

    $("#linkPacking").click(function () {
        Fill_DropdownPartCode(RefID);
        Fill_DropdownMold(RefID);
        PackingID = null
    });

    function Fill_DropdownPartCode(RefID) {
        if (!RefID) {
            $("#selPackingPartCode").attr("placeholder", "One");
        } else {
            $("#selPackingPartCode").empty();
            $.ajax({
                url: "/packing/dropdown_part/" + RefID,
                method: 'get',
                contentType: 'application/json',
                dataType: 'json',
                success: function (response) {
                    let len = response.length;
                    for (let i = 0; i < len; i++) {
                        let PartCode = response[i].PartCode;
                        let PartID = response[i].PartID;
                        let PartName = response[i].PartName;
                        $("#selPackingPartCode").append("<option value=" + PartID + ">" + PartCode + "<span>(" + PartName + ")</span></option>");
                    }
                }
            })
        }
    }

    function Fill_DropdownMold(RefID) {
        if (!RefID) {
            $("#selPackingMold").attr("placeholder", "Please select RefNo");
        } else {
            $("#selPackingMold").empty();
            $.ajax({
                url: "/packing/dropdown_mold/" + RefID,
                method: 'get',
                contentType: 'application/json',
                dataType: 'json',
                success: function (response) {
                    let len = response.length;
                    for (let i = 0; i < len; i++) {
                        let BasicMold = response[i].BasicMold;
                        let MoldID = response[i].MoldID;
                        let DieNo = response[i].DieNo;
                        $("#selPackingMold").append("<option value=" + MoldID + ">" + BasicMold + "<span>(" + DieNo + ")</span></option>");

                    }
                }
            })
        }
    }


    function Fill_PackingDetail(PackingID) {
        if (!PackingID) {
            $("#tablePackingDetail input").val('');

        } else {
            $.ajax({
                type: "get",
                url: "/packing/detail/" + PackingID,
                data: "data",
                contentType: 'application/json',
                dataType: 'json',
                success: function (response) {

                    $("#inpPackingBoxNo-1").val(response[0].BoxNo_1);
                    $("#inpPackingBoxName-1").val(response[0].BoxName_1);
                    $("#inpPackingBoxNo-2").val(response[0].BoxNo_2);
                    $("#inpPackingBoxName-2").val(response[0].BoxName_2);
                    $("#inpPackingBoxQty").val(response[0].BoxQty);

                    $("#inpPackingPatternNo-1").val(response[0].PatternNo_1);
                    $("#inpPackingPatternName-1").val(response[0].PatternName_1);
                    $("#inpPackingPatternNo-2").val(response[0].PatternNo_2);
                    $("#inpPackingPatternName-2").val(response[0].PatternName_2);
                    $("#inpPackingPatternQty").val(response[0].PatternQty);


                    $("#inpPackingQuantityNo").val(response[0].QtyPcsBoxNo);
                    $("#inpPackingQuantityQty").val(response[0].QtyPcsBoxQty);


                    $("#inpPackingPlasticNo").val(response[0].PlasticSheetNo);
                    $("#inpPackingPlasticQty").val(response[0].PlasticSheetQty);
                    $("#inpPackingPartitionNo").val(response[0].PartitionNo);
                    $("#inpPackingPartitionQty").val(response[0].PartitionQty);
                    $("#inpPackingEPENo").val(response[0].EPENo);
                    $("#inpPackingEPEQty").val(response[0].EPEQty);
                    $("#inpPackingTrayNo").val(response[0].TrayNo);
                    $("#inpPackingTrayQty").val(response[0].TrayQty);
                    $("#inpPackingProtectionFilmNo").val(response[0].ProtectionFilmNo);
                    $("#inpPackingProtectionFilmQty").val(response[0].ProtectionFilmQty);
                    $("#inpPackingDiecutNo").val(response[0].DiecutNo);
                    $("#inpPackingDiecutQty").val(response[0].DiecutQty);
                    $("#inpPackingBubbleNo").val(response[0].BubbleNo);
                    $("#inpPackingBubbleQty").val(response[0].BubbleQty);
                    $("#inpPackingPadEvaNo").val(response[0].PadEVANo);
                    $("#inpPackingPadEvaQty").val(response[0].PadEVAQty);
                    $("#inpPackingBagNo").val(response[0].BagNo);
                    $("#inpPackingBagQty").val(response[0].BagQty);
                    $("#inpPackingGluePaperNo").val(response[0].MaskingTapeNo);
                    $("#inpPackingGluePaperQty").val(response[0].MaskingTapeQty);
                    $("#inpPackingRubberNo").val(response[0].RubberNo);
                    $("#inpPackingRubberQty").val(response[0].RubberQty);
                    $("#inpPackingOPPNo").val(response[0].OPPTapeNo);
                    $("#inpPackingOPPQty").val(response[0].OPPTapeQty);
                    $("#inpPackingOPPNo-1").val(response[0].BoardNo);
                    $("#inpPackingOPPQty-1").val(response[0].BoardQty);
                    $("#inpPackingOPPNo-5").val(response[0].CapNo);
                    $("#inpPackingOPPQty-5").val(response[0].CapQty);
                    $("#inpPackingOPPNo-4").val(response[0].CornerNo); //
                    $("#inpPackingOPPQty-4").val(response[0].CornerQty);
                    $("#inpPackingOPPNo-3").val(response[0].CoverNo);
                    $("#inpPackingOPPQty-3").val(response[0].CoverQty);
                    $("#inpPackingOPPNo-2").val(response[0].RoundDieCutNo);
                    $("#inpPackingOPPQty-2").val(response[0].RoundDieCutQty);
                    $("#inpPackingOPPNo-13").val(response[0].EVANo);
                    $("#inpPackingOPPQty-13").val(response[0].EVAQty);
                    $("#inpPackingOPPNo-12").val(response[0].InnerNo);
                    $("#inpPackingOPPQty-12").val(response[0].InnerQty);
                    $("#inpPackingOPPNo-11").val(response[0].PadNo);
                    $("#inpPackingOPPQty-11").val(response[0].PadQty);
                    $("#inpPackingOPPNo-10").val(response[0].PalletNo);
                    $("#inpPackingOPPQty-10").val(response[0].PalletQty);
                    $("#inpPackingOPPNo-9").val(response[0].SheetNo);
                    $("#inpPackingOPPQty-9").val(response[0].SheetQty);
                    $("#inpPackingOPPNo-8").val(response[0].SilicaGelNo);
                    $("#inpPackingOPPQty-8").val(response[0].SilicaGelQty);
                    $("#inpPackingOPPNo-7").val(response[0].SleeveNo);
                    $("#inpPackingOPPQty-7").val(response[0].SleeveQty);

                    $("#inpPackingOPPNo-15").val(response[0].MetalStrapNo); // กิ๊บลอค No
                    $("#inpPackingOPPQty-15").val(response[0].MetalStrapQty); // กิ๊บลอค Qty
                    $("#inpPackingOPPNo-14").val(response[0].PlasticStrapNo); // สายรัดกล่อง
                    $("#inpPackingOPPQty-14").val(response[0].PlasticStrapQty); // สายรัดกล่อง
                    $("#inpPackingOPPNo-6").val(response[0].PartitionNo_T); // กระดาษคั่นกล่อง
                    $("#inpPackingOPPQty-6").val(response[0].PartitionQty_T); // กระดาษคั่นกล่อง

                    //กระดาษคั่นกล่อง = response[0].กระดาษคั่นกล่อง; // No db

                    $("#inpPackingNetWeightQty").val(response[0].NetWeight);
                    $("#inpPackingGrossWeightQty").val(response[0].GrossWeight);



                }
            });
        }
    }

    function fill_Packing(RefID) {
        tablePacking = $('#tablePacking').DataTable({
            "bDestroy": true,
            "ajax": {
                "url": '/packing/packing_list/' + RefID,
                "dataSrc": ""
            },
            "columns": [{
                    "data": "index"
                },
                {
                    "data": "PartCode"
                },
                {
                    "data": "DieNo"
                },
                {
                    "data": "PackingTypeName"
                },
                {
                    "data": "PackingDeliveryName"
                },
                {
                    "data": "PackingID"
                },
                {
                    "data": "MoldID"
                },
                {
                    "data": "PartID"
                },
                {
                    "data": "PackingTypeID"
                },
                {
                    "data": "PackingDeliveryID"
                }
            ],
            "columnDefs": [{
                "targets": [5, 6, 7 ,8 ,9],
                "visible": false
            }, ],
        });
    }



    //click btn Add
    $(document).on("click", "#btnPackingAdd", function () {
        PartID = $.trim($('#selPackingPartCode').val());
        MoldID = $.trim($('#selPackingMold').val());
        PackingTypeID = $.trim($('#selPackingType').val());
        PackingDeliveryID = $.trim($('#selPackingType-1').val());
        $.ajax({
            url: "/packing/add/" + RefID,
            method: 'post',
            contentType: 'application/json',
            data: JSON.stringify({
                PartID: PartID,
                MoldID: MoldID,
                PackingTypeID: PackingTypeID,
                PackingDeliveryID: PackingDeliveryID
            }),
            success: function (response) {
                tablePacking.ajax.reload(null, false);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Added',
                    text: 'Packing have been added',
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
    });

    //click btn Update
    $(document).on("click", "#btnPackingEdit", function () {

        if (!PackingID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Packing.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: true
            })
        } else {
            QtyPcsBoxNo = $.trim($('#inpPackingQuantityNo').val());
            QtyPcsBoxQty = $.trim($('#inpPackingQuantityQty').val());

            BoxNo_1 = $.trim($('#inpPackingBoxNo-1').val());
            BoxNo_2 = $.trim($('#inpPackingBoxNo-2').val());
            BoxName_1 = $.trim($('#inpPackingBoxName-1').val());
            BoxName_2 = $.trim($('#inpPackingBoxName-2').val());
            BoxQty = $.trim($('#inpPackingBoxQty').val());

            PlasticSheetNo = $.trim($('#inpPackingPlasticNo').val());
            PlasticSheetQty = $.trim($('#inpPackingPlasticQty').val());

            PartitionNo = $.trim($('#inpPackingPartitionNo').val());
            PartitionQty = $.trim($('#inpPackingPartitionQty').val());

            EPENo = $.trim($('#inpPackingEPENo').val());
            EPEQty = $.trim($('#inpPackingEPEQty').val());

            TrayNo = $.trim($('#inpPackingTrayNo').val());
            TrayQty = $.trim($('#inpPackingTrayQty').val());

            ProtectionFilmNo = $.trim($('#inpPackingProtectionFilmNo').val());
            ProtectionFilmQty = $.trim($('#inpPackingProtectionFilmQty').val());

            DiecutNo = $.trim($('#inpPackingDiecutNo').val());
            DiecutQty = $.trim($('#inpPackingDiecutQty').val());

            BubbleNo = $.trim($('#inpPackingBubbleNo').val());
            BubbleQty = $.trim($('#inpPackingBubbleQty').val());

            PadEVANo = $.trim($('#inpPackingPadEvaNo').val());
            PadEVAQty = $.trim($('#inpPackingPadEvaQty').val());

            BagNo = $.trim($('#inpPackingBagNo').val());
            BagQty = $.trim($('#inpPackingBagQty').val());

            MaskingTapeNo = $.trim($('#inpPackingGluePaperNo').val());
            MaskingTapeQty = $.trim($('#inpPackingGluePaperQty').val());

            RubberNo = $.trim($('#inpPackingRubberNo').val());
            RubberQty = $.trim($('#inpPackingRubberQty').val());

            OPPTapeNo = $.trim($('#inpPackingOPPNo').val());
            OPPTapeQty = $.trim($('#inpPackingOPPQty').val());

            BoardNo = $.trim($('#inpPackingOPPNo-1').val());
            BoardQty = $.trim($('#inpPackingOPPQty-1').val());

            CapNo = $.trim($('#inpPackingOPPNo-5').val());
            CapQty = $.trim($('#inpPackingOPPQty-5').val());

            CornerNo = $.trim($('#inpPackingOPPNo-4').val());
            CornerQty = $.trim($('#inpPackingOPPQty-4').val());

            CoverNo = $.trim($('#inpPackingOPPNo-3').val());
            CoverQty = $.trim($('#inpPackingOPPQty-3').val());

            RoundDieCutNo = $.trim($('#inpPackingOPPNo-2').val());
            RoundDieCutQty = $.trim($('#inpPackingOPPQty-2').val());

            EVANo = $.trim($('#inpPackingOPPNo-13').val());
            EVAQty = $.trim($('#inpPackingOPPQty-13').val());

            InnerNo = $.trim($('#inpPackingOPPNo-12').val());
            InnerQty = $.trim($('#inpPackingOPPQty-12').val());

            PadNo = $.trim($('#inpPackingOPPNo-11').val());
            PadQty = $.trim($('#inpPackingOPPQty-11').val());

            PalletNo = $.trim($('#inpPackingOPPNo-10').val());
            PalletQty = $.trim($('#inpPackingOPPQty-10').val());

            SheetNo = $.trim($('#inpPackingOPPNo-9').val());
            SheetQty = $.trim($('#inpPackingOPPQty-9').val());

            SilicaGelNo = $.trim($('#inpPackingOPPNo-8').val());
            SilicaGelQty = $.trim($('#inpPackingOPPQty-8').val());

            SleeveNo = $.trim($('#inpPackingOPPNo-7').val());
            SleeveQty = $.trim($('#inpPackingOPPQty-7').val());

            PartitionNo_T = $.trim($('#inpPackingOPPNo-6').val());
            PartitionQty_T = $.trim($('#inpPackingOPPQty-6').val());

            MetalStrapNo = $.trim($('#inpPackingOPPNo-15').val());
            MetalStrapQty = $.trim($('#inpPackingOPPQty-15').val());

            PlasticStrapNo = $.trim($('#inpPackingOPPNo-14').val());
            PlasticStrapQty = $.trim($('#inpPackingOPPQty-14').val());

            PatternNo_1 = $.trim($('#inpPackingPatternNo-1').val());
            PatternNo_2 = $.trim($('#inpPackingPatternNo-2').val());
            PatternName_1 = $.trim($('#inpPackingPatternName-1').val());
            PatternName_2 = $.trim($('#inpPackingPatternName-2').val());
            PatternQty = $.trim($('#inpPackingPatternQty').val());

            NetWeight = $.trim($('#inpPackingNetWeightQty').val());
            GrossWeight = $.trim($('#inpPackingGrossWeightQty').val());
            $.ajax({
                url: "/packing/edit/" + PackingID,
                method: 'put',
                contentType: 'application/json',
                data: JSON.stringify({

                    QtyPcsBoxNo: QtyPcsBoxNo,
                    QtyPcsBoxQty: QtyPcsBoxQty,
                    BoxNo_1: BoxNo_1,
                    BoxNo_2: BoxNo_2,
                    BoxName_1: BoxName_1,
                    BoxName_2: BoxName_2,
                    BoxQty: BoxQty,
                    PlasticSheetNo: PlasticSheetNo,
                    PlasticSheetQty: PlasticSheetQty,
                    PartitionNo: PartitionNo,
                    PartitionQty: PartitionQty,
                    EPENo: EPENo,
                    EPEQty: EPEQty,
                    TrayNo: TrayNo,
                    TrayQty: TrayQty,
                    ProtectionFilmNo: ProtectionFilmNo,
                    ProtectionFilmQty: ProtectionFilmQty,
                    DiecutNo: DiecutNo,
                    DiecutQty: DiecutQty,
                    BubbleNo: BubbleNo,
                    BubbleQty: BubbleQty,
                    PadEVANo: PadEVANo,
                    PadEVAQty: PadEVAQty,
                    BagNo: BagNo,
                    BagQty: BagQty,
                    MaskingTapeNo: MaskingTapeNo,
                    MaskingTapeQty: MaskingTapeQty,
                    RubberNo: RubberNo,
                    RubberQty: RubberQty,
                    OPPTapeNo: OPPTapeNo,
                    OPPTapeQty: OPPTapeQty,
                    BoardNo: BoardNo,
                    BoardQty: BoardQty,
                    CapNo: CapNo,
                    CapQty: CapQty,
                    CornerNo: CornerNo,
                    CornerQty: CornerQty,
                    CoverNo: CoverNo,
                    CoverQty: CoverQty,
                    RoundDieCutNo: RoundDieCutNo,
                    RoundDieCutQty: RoundDieCutQty,
                    EVANo: EVANo,
                    EVAQty: EVAQty,
                    InnerNo: InnerNo,
                    InnerQty: InnerQty,
                    PadNo: PadNo,
                    PadQty: PadQty,
                    PalletNo: PalletNo,
                    PalletQty: PalletQty,
                    SheetNo: SheetNo,
                    SheetQty: SheetQty,
                    SilicaGelNo: SilicaGelNo,
                    SilicaGelQty: SilicaGelQty,
                    SleeveNo: SleeveNo,
                    SleeveQty: SleeveQty,
                    PartitionNo_T: PartitionNo_T,
                    PartitionQty_T: PartitionQty_T,
                    MetalStrapNo: MetalStrapNo,
                    MetalStrapQty: MetalStrapQty,
                    PlasticStrapNo: PlasticStrapNo,
                    PlasticStrapQty: PlasticStrapQty,
                    PatternNo_1: PatternNo_1,
                    PatternNo_2: PatternNo_2,
                    PatternName_1: PatternName_1,
                    PatternName_2: PatternName_2,
                    PatternQty: PatternQty,
                    NetWeight: NetWeight,
                    GrossWeight: GrossWeight

                }),
                success: function (data) {
                    tableInjMaterial.ajax.reload(null, false);
                    $("#modal_InjAddMaterial").modal("hide");
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Packing have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    InjectionMatID = null;
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


    //click btn delete
    $(document).on("click", "#btnPackingDel", function (e) {
        if (!PackingID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select to delete.',
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
                    url: "/packing/delete/" + PackingID,
                    method: 'delete',
                    contentType: 'application/json',
                    success: function (response) {
                        tablePacking.ajax.reload(null, false)
                        $('#modalDeleteConfirm').modal('hide');
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Deleted',
                            text: 'Packing have been deleted',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                })

            });
        }
    });
    //=========================================================================//

    $("#tableRefNumber").on("click", "tr", function () {
        PackingID = null;
        fill_Packing(RefID)
        Fill_DropdownPartCode(RefID);
        Fill_DropdownMold(RefID);
    })

    //click on Packing table
    $('#tablePacking tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            PackingID = null;
        } else {
            $('#tablePacking tr').removeClass('selected');
            $(this).toggleClass('selected');
            PackingID = tablePacking.rows($(this)).data()[0].PackingID;
            PartID = tablePacking.rows($(this)).data()[0].PartID;
            MoldID = tablePacking.rows($(this)).data()[0].MoldID;
            PackingTypeName = tablePacking.rows($(this)).data()[0].PackingTypeName;
        }
        Fill_PackingDetail(PackingID)
    })















});