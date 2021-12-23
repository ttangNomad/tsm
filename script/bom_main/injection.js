$(document).ready(function () {

    //click tab Process
    $("#linkInjection").click(function(){

        MoldID =CompID = AddonName = DieNo = JigNo = MachineNo = AXMoldNo = InjectionMatID = InjectionID = Code = MFG = Color = CycleTime = PcsHr = RunnerWeight = PartCode = PcsWeight = Qty = CavID = PartName = Supplier = RefNo = null;
        })

    //Fill table MoldList
    function fill_Injection(RefID) {
        tableInj = $('#tableInjMold').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": '/injection/mold_list/' + RefID,
                "dataSrc": ""
            },
            "columns": [
                {"data": "index"},
                {"data": "BasicMold"},
                {"data": "DieNo"},
                {"data": "JigNo"},
                {"data": "MachineNo"},
                {"data": "AXMoldNo"},
                {"data": "InjectionID"},
                {"data": "AddonName"},
                {"data": "MoldID"}
            ],
            "columnDefs": [{
                    "targets": [6,7,8],
                    "visible": false
                },
            ],
            "initComplete": function () {
                CountRows = tableInj.data().count()
                $('#badgeInjection').text(CountRows)
            },
        });
        fill_tableInjComponent(null)
        fill_tableInjMaterial(null)
        fill_tableInjCavity(null)
    }
    //click Add btn MoldList
    $(document).on('click','#btnInjMoldAdd',function(e){
        if (!RefID) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Warning',
              text: 'Please select RefNo',
              showConfirmButton: true,
              confirmButtonText: 'OK',
              confirmButtonColor: '#dc3545',
              allowOutsideClick: false
        }).then(function(result){
            if (result.value) {
                $('#modal_InjAddMold').addClass('programmatic');
                $('#modal_InjAddMold').modal('hide');
                e.stopPropagation();
            }else{
                e.stopPropagation();
            }
        })
      
        } else {
        $('#form_InjAddMold').trigger('reset');
        $('#modalSaveInjMold').unbind('click')
        $(".selectpicker").selectpicker("refresh")
        $("#modalSaveInjMold").click(function (e) {
            e.preventDefault()
            MoldID = $.trim($('#modal_injMoldSelect').val());
            AddonName = $.trim($('#modal_InjMoldAddon').val());
            if (MoldID=="null"||AddonName=="") {
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
                url: "/injection/add_inj_mold/"+RefID,
                data: JSON.stringify({
                    MoldID: MoldID,
                    AddonName:AddonName,
                }),
                success: function () {
                    $('#modal_InjAddMold').modal('hide');

                    fill_Injection(RefID)
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Added',
                        text: 'Mold List have been added',
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
        })
    }
    })


    //click Edit btn MoldList
    $(document).on('click', '#btnInjMoldEdit', function (e) {
        if (!InjectionID) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Warning',
              text: 'Please select Mold',
              showConfirmButton: true,
              confirmButtonText: 'OK',
              confirmButtonColor: '#dc3545',
              allowOutsideClick: false
            }).then(function(result){
                if (result.value) {
                    $('#modal_InjAddMold').addClass('programmatic');
                    $('#modal_InjAddMold').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
            $('#form_InjAddMold').trigger('reset');
        } else {
            $('.modal-title').text('Edit Injection Mold:')
            $('#modal_injMoldSelect').val(MoldID)
            $("#modal_InjMoldAddon").val(AddonName);
            $("#modal_InjMoldDieNo").val(DieNo);
            $("#modal_InjMoldJigNo").val(JigNo);
            $("#modal_InjMoldMCNo").val(MachineNo);
            $("#modal_InjMoldAXMoldNo").val(AXMoldNo);
            $(".selectpicker").selectpicker("refresh")
            $('#modalSaveInjMold').unbind('click')

            $("#modalSaveInjMold").click(function () {
                MoldID = $.trim($('#modal_injMoldSelect').val());
                AddonName = $.trim($('#modal_InjMoldAddon').val());
                if (MoldID=="null"||AddonName=="") {
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
                    url: "/injection/edit_inj_mold/" + InjectionID,
                    data: JSON.stringify({
                        AddonName: AddonName,
                        MoldID: MoldID,
                        RefID:RefID
                    }),
                    success: function (data) {

                        tableInj.ajax.reload(null, false)
                        $('#modal_InjAddMold').modal('hide')
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Edited',
                            text: 'Mold List have been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        InjectionID = null;
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

    //click delete btn MoldList
    $(document).on('click', '#btnInjMoldDel', function (e) {
        if (!InjectionID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Mold',
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

        $("#btnYes").click(function () {
            $.ajax({
                type: "delete",
                url: "/injection/delete_inj_mold/" + InjectionID,
                contentType: "application/json",
                success: function (response) {
                    fill_Injection(RefID);

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

    //Fill table Material List
    function fill_tableInjMaterial(InjectionID) {
        tableInjMaterial = $('#tableInjMaterial').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": '/injection/material_list/' + InjectionID,
                "dataSrc": ""
            },
            "columns": [
                {"data": "index"},
                {"data": "MFG"},
                {"data": "Code"},
                {"data": "Color"},
                {"data": "CycleTime"},
                {"data": "PcsHr"},
                {"data": "RunnerWeight"},
                {"data": "InjectionMatID"},
                {"data": "MaterialID"}
            ],
            "columnDefs": [{
                    "targets": [7,8],
                    "visible": false
                },
            ],

        });
    }
    //click Add btn MaterialList
    $(document).on('click', '#btnInjMaterialAdd', function (e) {
        if (!InjectionID) {
                  Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Warning',
                    text: 'Please select Mold',
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#dc3545',
                    allowOutsideClick: false
            }).then(function(result){
                if (result.value) {
                    $('#modal_InjAddMaterial').addClass('programmatic');
                    $('#modal_InjAddMaterial').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
            
        } else {
            $('#form_InjAddMaterial').trigger('reset');
            $('.modal-title').text('Add Injection Material:')
            $(".selectpicker").selectpicker("refresh");
            $('#modalSaveInjMaterial').unbind('click')

            $("#modalSaveInjMaterial").click(function () {
                MaterialID = $.trim($('#modal_injMaterialSelect').val());
                CycleTime = $.trim($('#modal_InjMaterialCycleTime').val());
                PcsHr = $.trim($('#modal_InjMaterialPcsHr').val());
                RunnerWeight = $.trim($('#modal_InjMaterialRW').val());
                if (MaterialID=="null"||CycleTime==""||PcsHr==""||RunnerWeight=="") {
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
                    url: "/injection/add_inj_matl/" + InjectionID,
                    data: JSON.stringify({
                        MaterialID: MaterialID,
                        CycleTime: CycleTime,
                        PcsHr: PcsHr,
                        RunnerWeight: RunnerWeight
                    }),
                    success: function () {
                        $("#modal_InjAddMaterial").modal("hide");
                        tableInjMaterial.ajax.reload(null,false);
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Added',
                            text: 'Material List have been saved',
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

    //click btn edit MaterialList
    $(document).on('click', '#btnInjMaterialEdit', function (e) {
        if (!InjectionMatID) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Warning',
              text: 'Please select Material',
              showConfirmButton: true,
              confirmButtonText: 'OK',
              confirmButtonColor: '#dc3545',
              allowOutsideClick: false
            }).then(function(result){
                if (result.value) {
                    $('#modal_InjAddMaterial').addClass('programmatic');
                    $('#modal_InjAddMaterial').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        $('#form_InjAddMaterial').trigger('reset');

        } else {
        $(".modal-title").text("Edit Injection Material:");

        $('#modal_injMaterialSelect').val(MaterialID)
        $("#modal_InjMaterialMFG").val(MFG);
        $("#modal_InjMaterialCode").val(Code);
        $("#modal_InjMaterialColor").val(Color);
        $("#modal_InjMaterialCycleTime").val(CycleTime);
        $("#modal_InjMaterialPcsHr").val(PcsHr);
        $("#modal_InjMaterialRW").val(RunnerWeight);
        $(".selectpicker").selectpicker("refresh");
        $('#modalSaveInjMaterial').unbind('click')

        $("#modalSaveInjMaterial").click(function () {
            MaterialID = $.trim($('#modal_injMaterialSelect').val());
            CycleTime = $.trim($("#modal_InjMaterialCycleTime").val());
            PcsHr = $.trim($("#modal_InjMaterialPcsHr").val());
            RunnerWeight = $.trim($("#modal_InjMaterialRW").val());
            if (MaterialID=="null"||CycleTime==""||PcsHr==""||RunnerWeight=="") {
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
                url: "/injection/edit_inj_mat/" + InjectionMatID,
                data: JSON.stringify({
                    MaterialID: MaterialID,
                    CycleTime: CycleTime,
                    PcsHr: PcsHr,
                    RunnerWeight: RunnerWeight,
                    InjectionID: InjectionID
                }),
                success: function (data) {
                    tableInjMaterial.ajax.reload(null,false);
                    $("#modal_InjAddMaterial").modal("hide");
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Material List have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    InjectionMatID = null;
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
        })
    }
    })

    //click on btn delete Material List
    $(document).on('click', '#btnInjMaterialDel', function (e) {
        if (!InjectionMatID) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Warning',
              text: 'Please select Material',
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

        $("#btnYes").click(function () {
            $.ajax({
                type: "delete",
                url: "/injection/delete_inj_material/" + InjectionMatID,
                contentType: "application/json",
                success: function (response) {
                    tableInjMaterial.ajax.reload(null, false)
                    tableInjCavity.ajax.reload(null, false)
                    tableInjComponent.ajax.reload(null, false)
                    $('#modalDeleteConfirm').modal('hide');
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Deleted',
                        text: 'Material List have been deleted',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        })
    }
    })

    //Fill table Cavity
    function fill_tableInjCavity(InjectionMatID) {
        tableInjCavity = $('#tableInjCavity').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": '/injection/cavity/' + InjectionMatID,
                "dataSrc": ""
            },
            "columns": [
                {"data": 'index'},
                {"data": "PartCode"},
                {"data": "PcsWeight"},
                {"data": "Qty"},
                {"data": "CavID"},
                {"data": "PartID"}
            ],
            "columnDefs": [{
                    "targets": [4,5],
                    "visible": false
                },
            ],
        });
    }

     //click on add cavity
    $(document).on('click', '#btnInjCavityAdd', function (e) {
        if (!InjectionMatID) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select Material',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(function(result){
                if (result.value) {
                    $('#modal_InjAddCavity').addClass('programmatic');
                    $('#modal_InjAddCavity').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        } else {
        $('#form_InjAddCavity').trigger('reset');
        $('.modal-title').text('Add Injection Cavity:')
        $('#modalSaveInjCavity').unbind('click')
        $(".selectpicker").selectpicker("refresh");

        $("#modalSaveInjCavity").click(function () {
            PartID = $.trim($('#modal_injCavitytPartSelect').val());
            PcsWeight = $.trim($('#modal_injCavitytWeight').val());
            Qty = $.trim($('#modal_injCavitytQuantity').val());
            if (PartID=="null"||PcsWeight==""||Qty=="") {
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
                type: "post",
                url: "/injection/add_inj_cavity/" + InjectionMatID,
                data: JSON.stringify({
                    PartID: PartID,
                    MoldID:MoldID,
                    PcsWeight:PcsWeight,
                    Qty:Qty
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    tableInjCavity.ajax.reload(null,false);
                    $("#modal_InjAddCavity").modal("hide");
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Added',
                        text: 'Cavity have been Added',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        }
        })
    }
    })

    //click edit cavity
    $(document).on('click', '#btnInjCavityEdit', function (e) {
        if (!CavID) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Warning',
              text: 'Please select Cavity',
              showConfirmButton: true,
              confirmButtonText: 'OK',
              confirmButtonColor: '#dc3545',
              allowOutsideClick: false
            }).then(function(result){
                if (result.value) {
                    $('#modal_InjAddCavity').addClass('programmatic');
                    $('#modal_InjAddCavity').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        $('#form_InjAddCavity').trigger('reset');

        } else {
        $('.modal-title').text('Edit Injection Cavity:')

        $('#modal_injCavitytPartSelect').val(PartID)
        $("#modal_injCavitytWeight").val(PcsWeight);
        $("#modal_injCavitytQuantity").val(Qty);
        $(".selectpicker").selectpicker("refresh");

        $('#modalSaveInjCavity').unbind('click')

        $("#modalSaveInjCavity").click(function () {
            PartID = $.trim($('#modal_injCavitytPartSelect').val());
            PcsWeight = $.trim($('#modal_injCavitytWeight').val());
            Qty = $.trim($('#modal_injCavitytQuantity').val());
            if (PartID=="null"||PcsWeight==""||Qty=="") {
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
                url: "/injection/edit_cav/" + CavID,
                data: JSON.stringify({
                    PartID: PartID,
                    PcsWeight:PcsWeight,
                    Qty:Qty
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    tableInjCavity.ajax.reload(null,false);
                    $("#modal_InjAddCavity").modal("hide");
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Cavity have been saved',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    CavID = null;
                }
            });
        }
        })
    }
    })

    //delete Cavity
    $(document).on('click', '#btnInjCavityDel', function (e) {
        if (!CavID) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Warning',
              text: 'Please select Cavity',
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

        $("#btnYes").click(function () {
            $.ajax({
                type: "delete",
                url: "/injection/delete_cavity/" + CavID,
                contentType: "application/json",
                success: function (response) {
                    tableInjCavity.ajax.reload(null,false);
                    $('#modalDeleteConfirm').modal('hide');
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Deleted',
                        text: 'Cavity have been deleted',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        })
    }
    })

    //Fill table Component
    function fill_tableInjComponent(InjectionID) {
        tableInjComponent = $('#tableInjComponent').DataTable({
            "bDestroy": true,

            "ajax": {
                "url": '/injection/component_part/' + InjectionID,
                "dataSrc": ""
            },
            "columns": [
                {"data": "index"},
                {"data": "PartCode"},
                {"data": "PartName"},
                {"data": "Qty"},
                {"data": "Supplier"},
                {"data": "RefNo"},
                {"data": "CompID"},
                {"data": "PartID"},
            ],
            "columnDefs": [{
                    "targets": [6,7],
                    "visible": false
                },
            ],
        });
    }
    //click on add Component Part
    $(document).on('click', '#btnInjComponentAdd', function (e) {
        if (!InjectionID) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Warning',
              text: 'Please select Mold',
              showConfirmButton: true,
              confirmButtonText: 'OK',
              confirmButtonColor: '#dc3545',
              allowOutsideClick: false
            }).then(function(result){
                if (result.value) {
                    $('#modal_InjAddComponent').addClass('programmatic');
                    $('#modal_InjAddComponent').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        } else {
        
        $('#form_InjAddComponent').trigger('reset');
        $('.modal-title').text('Add Injection Component:')
        $(".selectpicker").selectpicker("refresh");
        $('#modalSaveInjComponent').unbind('click')

        $("#modalSaveInjComponent").click(function () {
            PartID = $.trim($('#modal_injComponentPartSelect').val());
            Qty = $.trim($('#modal_InjComponentQuantity').val());
            if (PartID=="null"||Qty=="") {
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
                type: "post",
                url: "/injection/add_component_part/" + InjectionID,
                data: JSON.stringify({
                    PartID: PartID,
                    Qty:Qty
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    tableInjComponent.ajax.reload(null,false);
                    $("#modal_InjAddComponent").modal("hide");
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Added',
                        text: 'Component part have been added',
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

    //click edit Component Part
    $(document).on('click', '#btnInjComponentEdit', function (e) {
        if (!CompID) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Warning',
              text: 'Please select Component Part',
              showConfirmButton: true,
              confirmButtonText: 'OK',
              confirmButtonColor: '#dc3545',
              allowOutsideClick: false
            }).then(function(result){
                if (result.value) {
                    $('#modal_InjAddComponent').addClass('programmatic');
                    $('#modal_InjAddComponent').modal('hide');
                    e.stopPropagation();
                }else{
                    e.stopPropagation();
                }
            })
        $('#form_InjAddComponent').trigger('reset');
        } else {
        $('.modal-title').text('Edit Injection Component:')

        $('#modal_injComponentPartSelect').val(PartID);
        $("#modal_InjComponentPartName").val(PartName);
        $("#modal_InjComponentQuantity").val(Qty);
        $("#modal_InjComponentSupplier").val(Supplier);
        $("#modal_InjComponentRef").val(RefNo);
        $(".selectpicker").selectpicker("refresh");

        $('#modalSaveInjComponent').unbind('click')

        $("#modalSaveInjComponent").click(function () {
            PartID = $.trim($('#modal_injComponentPartSelect').val());
            Qty = $.trim($('#modal_InjComponentQuantity').val());
            if (PartID=="null"||Qty=="") {
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
                url: "/injection/edit_inj_comp/" + CompID,
                data: JSON.stringify({
                    PartID: PartID,
                    Qty:Qty,
                    InjectionID:InjectionID
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    tableInjComponent.ajax.reload(null,false);
                    $("#modal_InjAddComponent").modal("hide");
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Edited',
                        text: 'Component part have been ',
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
        })}
    })

    //delete Component Part
    $(document).on('click', '#btnInjComponentDel', function (e) {
        if (!CompID) {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Warning',
              text: 'Please select Component Part',
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

        $("#btnYes").click(function () {
            $.ajax({
                type: "delete",
                url: "/injection/delete_component_part/" + CompID,
                contentType: "application/json",
                success: function (response) {
                    tableInjComponent.ajax.reload(null,false);
                    $('#modalDeleteConfirm').modal('hide');
                }
            });
        })
    }
    })
//====================================================================================//
    //select dropdown to show
    $('#modal_injMoldSelect').change(function () {
        MoldID = $("#modal_injMoldSelect").val();
        $.ajax({
            type: "get",
            url: "/injection/mold_dropdown_data/" + MoldID,
            contentType: 'application/json',
            dataType: "json",
            success: function (response) {
                console.log(response);
                if(response.length){
                    $("#modal_InjMoldDieNo").val(response[0].DieNo)
                    $("#modal_InjMoldAXMoldNo").val(response[0].AXMoldNo)
                    $("#modal_InjMoldMCNo").val(response[0].MachineNo)
                    $("#modal_InjMoldJigNo").val(response[0].JigNo)
                } else{
                    $("#modal_InjMoldDieNo").val('')
                    $("#modal_InjMoldAXMoldNo").val('')
                    $("#modal_InjMoldMCNo").val('')
                    $("#modal_InjMoldJigNo").val('')
                }
            }
        });
    });

    //select dropdown to show Part
    $('#modal_injComponentPartSelect').change(function () {
        PartID = $("#modal_injComponentPartSelect").val();
        $.ajax({
            type: "get",
            url: "/dropdown/part_data/" + PartID,
            contentType: 'application/json',
            dataType: "json",
            success: function (response) {
                if (response.length) {
                    $("#modal_InjComponentPartName").val(response[0].PartName)
                    $("#modal_InjComponentSupplier").val(response[0].Supplier)
                    $("#modal_InjComponentRef").val(response[0].RefNo)
                }else{
                    $("#modal_InjComponentPartName").val('')
                    $("#modal_InjComponentSupplier").val('')
                    $("#modal_InjComponentRef").val('')
                }
                
            }
        })
    })

    //select dropdown to show
    $('#modal_injMaterialSelect').change(function () {
        MaterialID = $("#modal_injMaterialSelect").val();
        $.ajax({
            type: "get",
            url: "/injection/material_dropdown_data/" + MaterialID,
            contentType: 'application/json',
            dataType: "json",
            success: function (response) {
                if (response.length) {
                    $("#modal_InjMaterialMFG").val(response[0].MFG)
                    $("#modal_InjMaterialCode").val(response[0].Code)
                    $("#modal_InjMaterialColor").val(response[0].Color)
                } else {
                    $("#modal_InjMaterialMFG").val('')
                    $("#modal_InjMaterialCode").val('')
                    $("#modal_InjMaterialColor").val('')
                }
                
            }
        })
    })

    //click on Reference Number table
    $("#tableRefNumber").on('click', "td", function () {
        fill_Injection(RefID);
        MoldID = CompID = AddonName = DieNo = JigNo = MachineNo = AXMoldNo = InjectionMatID = InjectionID = Code = MFG = Color = CycleTime = PcsHr = RunnerWeight = PartCode = PcsWeight = Qty = CavID = PartName = Supplier = RefNo = null;

    })

    //click on Mold List table
    $('#tableInjMold tbody').on('click', 'tr', function () {
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            InjectionID = BasicMold = DieNo = JigNo = MachineNo = AXMoldNo = AddonName = MoldID = null;
        }
        else{
            $('#tableInjMold tr').removeClass('selected');
            $(this).toggleClass('selected');
            InjectionID = tableInj.rows($(this)).data()[0].InjectionID;
            BasicMold = $(this).find('td:eq(1)').text();
            DieNo = $(this).find('td:eq(2)').text();
            JigNo = $(this).find('td:eq(3)').text();
            MachineNo = $(this).find('td:eq(4)').text();
            AXMoldNo = $(this).find('td:eq(5)').text();
            AddonName = tableInj.rows($(this)).data()[0].AddonName
            MoldID = tableInj.rows($(this)).data()[0].MoldID

            InjectionMatID = null
        }
        fill_tableInjMaterial(InjectionID);
        fill_tableInjComponent(InjectionID)
        fill_tableInjCavity(null)
    })


    //click on Material List table
    $('#tableInjMaterial tbody').on('click', 'tr', function () {
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            InjectionMatID = MFG = Code = Color = CycleTime = PcsHr = RunnerWeight = MaterialID = null;
        }
        else{
            $('#tableInjMaterial tr').removeClass('selected');
            $(this).toggleClass('selected');
            InjectionMatID = tableInjMaterial.rows($(this)).data()[0].InjectionMatID;
            MFG = $(this).find('td:eq(1)').text();
            Code = $(this).find('td:eq(2)').text();
            Color = $(this).find('td:eq(3)').text();
            CycleTime = $(this).find('td:eq(4)').text();
            PcsHr = $(this).find('td:eq(5)').text();
            RunnerWeight = $(this).find('td:eq(6)').text();
            MaterialID= tableInjMaterial.rows($(this)).data()[0].MaterialID;

        }
        fill_tableInjCavity(InjectionMatID);
    })

    //click on Cavity table
    $('#tableInjCavity tbody').on('click', 'tr', function () {
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            CavID = PartCode = PcsWeight = Qty = PartID = null;
        }
        else{
            $('#tableInjCavity tr').removeClass('selected');
            $(this).toggleClass('selected');
            CavID = tableInjCavity.rows($(this)).data()[0].CavID;
            PartCode = $(this).find('td:eq(1)').text();
            PcsWeight = $(this).find('td:eq(2)').text();
            Qty = $(this).find('td:eq(3)').text();
            PartID = tableInjCavity.rows($(this)).data()[0].PartID;

        }
    })

    //click on Component Part table
    $('#tableInjComponent tbody').on('click', 'tr', function () {
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            CompID = PartCode = PartName = Qty = Supplier = RefNo = PartID =null;
        }
        else{
            $('#tableInjComponent tr').removeClass('selected');
            $(this).toggleClass('selected');
            CompID = tableInjComponent.rows($(this)).data()[0].CompID;
            PartID = tableInjComponent.rows($(this)).data()[0].PartID;
            PartCode = $(this).find('td:eq(1)').text();
            PartName = $(this).find('td:eq(2)').text();
            Qty = $(this).find('td:eq(3)').text();
            Supplier = $(this).find('td:eq(4)').text();
            RefNo = $(this).find('td:eq(5)').text();
            console.log(PartID);
        }
    })

    $("#modalSaveRef").click(function(){
        fill_Injection(null)
    })
});