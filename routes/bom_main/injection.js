const express = require('express');
const router = express.Router();
const dbCon = require('../../lib/db');

router.get('/mold_list/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let SelectMoldList = `SELECT
	row_number() over(order by a.InjectionID desc) as 'index',
	a.InjectionID, c.BasicMold, c.DieNo,
    SUBSTRING(
		(
			SELECT ('/ ' + RTRIM(MoldJig.JigNo))
			FROM InjectionMold
			LEFT JOIN MasterMold ON InjectionMold.MoldID = MasterMold.MoldID
			LEFT JOIN MoldJig ON MasterMold.MoldID = MoldJig.MoldID
			WHERE InjectionMold.InjectionID = a.InjectionID
			FOR XML PATH('')
		)
	,2,100) AS 'JigNo',
    SUBSTRING(
        (
            SELECT ('/ ' + RTRIM(MasterMachine.MachineNo))
            FROM InjectionMold
            LEFT JOIN MasterMold ON InjectionMold.MoldID = MasterMold.MoldID
            LEFT JOIN MoldMachine ON MasterMold.MoldID = MoldMachine.MoldID
            LEFT JOIN MasterMachine ON MoldMachine.MachineID = MasterMachine.MachineID
            WHERE InjectionMold.InjectionID = a.InjectionID
            FOR XML PATH('')
        )
    ,2,100) AS 'MachineNo',
    c.AXMoldNo, g.AddonName,c.MoldID
    FROM [ProcessInjection] a
    LEFT JOIN [InjectionMold] b ON a.InjectionID = b.InjectionID
    LEFT JOIN [MasterMold] c ON b.MoldID = c.MoldID
    LEFT JOIN [MoldJig] d ON c.MoldID = d.MoldID
    LEFT JOIN [MoldMachine] e ON c.MoldID = e.MoldID
    LEFT JOIN [MoldAddon] g ON b.InjectionID = g.InjectionID
    WHERE RefID = ${RefID}
    GROUP BY a.InjectionID, c.BasicMold, c.DieNo, c.AXMoldNo, g.AddonName, c.MoldID
    `;
    dbCon.query(SelectMoldList, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/material_list/:InjectionID', (req, res, next) => {
    let InjectionID = req.params.InjectionID;
    let SelectMaterialList = `SELECT
	row_number() over(order by InjMat.InjectionMatID desc) as 'index',
	InjMat.InjectionMatID, MasInjMat.MFG, MasInjMat.Code, MasInjMat.Color, InjMat.CycleTime, InjMat.PcsHr, InjMat.RunnerWeight, MasInjMat.MaterialID
    FROM [InjectionMaterial] InjMat
    LEFT JOIN [MasterInjectionMaterial] MasInjMat ON InjMat.MaterialID = MasInjMat.MaterialID
    WHERE InjMat.InjectionID = ${InjectionID}`;
    dbCon.query(SelectMaterialList, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/cavity/:InjectionMatID', (req, res, next) => {
    let InjectionMatID = req.params.InjectionMatID;
    let SelectCavity = `SELECT
	row_number() over(order by MoldCav.CavID desc) as 'index',
	MoldCav.CavID, MasterPart.PartCode, MoldCav.PcsWeight, MoldCav.Qty, MasterPart.PartID
    FROM MoldCav
    LEFT JOIN MasterPart ON MoldCav.PartID = MasterPart.PartID
    WHERE MoldCav.InjectionMatID = ${InjectionMatID}`;
    dbCon.query(SelectCavity, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/component_part/:InjectionID', (req, res, next) => {
    let InjectionID = req.params.InjectionID
    let SelectComponentPart = `SELECT
	row_number() over(order by a.CompID desc) as 'index',
	a.CompID, b.PartCode, b.PartName, a.Qty, b.Supplier,b.PartID,
	(
		SELECT top(1) RefNo FROM MasterReferenceNo
		LEFT JOIN PartReferentNoHistory ON PartReferentNoHistory.RefID = MasterReferenceNo.RefID
		WHERE a.PartID = PartReferentNoHistory.PartID
		ORDER BY PartReferentNoHistory.PRefID desc
	) AS 'RefNo'
    FROM [InsertMoldComponentPart] a
    LEFT JOIN [MasterPart] b ON a.PartID = b.PartID
    WHERE a.InjectionID = ${InjectionID}`;
    //! RefNo show Which RefNo
    dbCon.query(SelectComponentPart, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/mold_dropdown', (req, res, next) => {
    let SelectMoldDropdown = `SELECT MoldID, BasicMold FROM MasterMold ORDER BY BasicMold`
    dbCon.query(SelectMoldDropdown, (err,rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

router.get('/mold_dropdown_data/:MoldID', (req, res, next) =>{
    let MoldID = req.params.MoldID;
    let SelectMoldDropdownData = `SELECT a.MoldID, a.BasicMold, a.DieNo, a.AXMoldNo, 
    SUBSTRING(
        (
            SELECT ('/' + RTRIM(JigNo))
            FROM MoldJig
            WHERE MoldID = a.MoldID
            FOR XML Path('')
        )
    ,2,1000) AS 'JigNo'
    ,
    SUBSTRING(
        (
            SELECT ('/' + RTRIM(MasterMachine.MachineNo))
            FROM MoldMachine
            LEFT JOIN MasterMachine ON MoldMachine.MachineID = MasterMachine.MachineID
            WHERE MoldMachine.MoldID = a.MoldID
            FOR XML Path('')
        )
    ,2,100) AS 'MachineNo',
    c.Operator
    FROM [MasterMold] a
    LEFT JOIN [MoldJig] b ON a.MoldID = b.MoldID
    LEFT JOIN [ManPower] c ON a.ManPowID = c.ManPowID
    LEFT JOIN [MoldMachine] d ON a.MoldID = d.MoldID
    LEFT JOIN [MasterMachine] e ON d.MachineID = e.MachineID
    WHERE a.MoldID = ${MoldID}
    GROUP BY a.MoldID, a.BasicMold, a.DieNo, c.Operator, a.AXMoldNo
    ORDER BY a.MoldID
    `;
    dbCon.query(SelectMoldDropdownData, (err,rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

router.get('/material_dropdown', (req, res, next) => {
    let SelectMaterial = `SELECT MaterialID, Code FROM MasterInjectionMaterial`;
    dbCon.query(SelectMaterial, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

router.get('/material_dropdown_data/:MaterialID', (req, res, next) => {
    let MaterialID = req.params.MaterialID;
    let SelectMaterial = `SELECT MFG, Code, Color FROM MasterInjectionMaterial WHERE MaterialID = ${MaterialID}`;
    dbCon.query(SelectMaterial, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})


//====================================================================ADD
router.post('/add_inj_mold/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let MoldID = req.body.MoldID;
    let AddonName = req.body.AddonName;
    let SelectProcessIndex = `SELECT ProcessIndex, RefID FROM ProcessInjection WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessHotStamp WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessAssembly WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessSpray WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessPrinting WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessWelding WHERE RefID = ${RefID}
    ORDER BY ProcessIndex desc`;

    let checkDuplicate = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM [ProcessInjection] a
		 LEFT JOIN [InjectionMold] b ON a.InjectionID = b.InjectionID
         WHERE a.RefID = ${RefID} AND b.MoldID = ${MoldID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;

    let CheckMold = new Promise(function(resolve, reject) {
        dbCon.query(checkDuplicate, (err, row) => {
            if(err){
                res.status(500).send({message: `${err}`})
            }else{
                if(row.recordset[0].check){
                    res.status(400).send({message: 'Duplicate Mold'})
                } else{
                    resolve();
                }
            }
        })
    })

    let AddProcessInj = new Promise(function(resolve, reject) {
        CheckMold.then(function(){
            dbCon.query(SelectProcessIndex, (err, rows) => {
                if(err){
                    res.status(500).send({message: `${err}`});
                } else{
                    if(!rows.recordset[0]){
                        var ProcessIndex = 1;
                    } else{
                        var ProcessIndex = rows.recordset[0].ProcessIndex + 1 ;
                    }
                    let InsertInj = `INSERT INTO ProcessInjection(RefID, ProcessIndex) VALUES(${RefID}, ${ProcessIndex})`;
                    dbCon.query(InsertInj, (err) => {
                        if(err){
                            res.status(500).send({message: `${err}`});
                        } else{
                            resolve();
                        }
                    })
                }
            })
        })
    })
    let AddInjMold = new Promise(function(resolve, reject){
        AddProcessInj.then(function(){
            let SelectInjectionID = 'SELECT InjectionID FROM ProcessInjection ORDER By InjectionID desc';
            dbCon.query(SelectInjectionID, (err, rows) => {
                if(err){
                    res.status(500).send({message: `${err}`});
                } else{
                    let InjectionID = rows.recordset[0].InjectionID;
                    let InsertInjectionMold = `INSERT INTO InjectionMold(InjectionID, MoldID) VALUES(${InjectionID}, ${MoldID})`;
                    dbCon.query(InsertInjectionMold, (err) => {
                        if(err){
                            res.status(500).send({message: `${err}`});
                        } else{
                            let SelectInjMoldID = `SELECT InjMoldID FROM InjectionMold ORDER BY InjMoldID desc`;
                            dbCon.query(SelectInjMoldID, (err, rows) => {
                                if(err){
                                    res.status(500).send({message: `${err}`});
                                } else{
                                    let InjMoldID = rows.recordset[0].InjMoldID;
                                    let InsertAddon = `INSERT INTO MoldAddon(InjectionID, AddonName, InjMoldID) VALUES(${InjectionID}, '${AddonName}', ${InjMoldID})`;
                                    dbCon.query(InsertAddon, (err) => {
                                        if(err){
                                            res.status(500).send({message: `${err}`});
                                        } else{
                                            resolve()
                                            res.status(201).send({message: 'Succesfully add inj mold'});
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        })
    })
})

router.post('/add_inj_matl/:InjectionID', (req, res, next) => {
    let InjectionID = req.params.InjectionID;
    let MaterialID = req.body.MaterialID;
    let CycleTime = req.body.CycleTime;
    let PcsHr = req.body.PcsHr;
    let RunnerWeight = req.body.RunnerWeight;
    let InsertInjMatl = `INSERT INTO InjectionMaterial(InjectionID, MaterialID, CycleTime, PcsHr, RunnerWeight) VALUES(${InjectionID}, ${MaterialID}, ${CycleTime}, ${PcsHr}, ${RunnerWeight})`;
    let checkDuplicate = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM InjectionMaterial
         WHERE InjectionID = ${InjectionID} AND MaterialID = ${MaterialID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(checkDuplicate, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate Material'})
            } else{
                dbCon.query(InsertInjMatl, (err) => {
                    if(err){
                        res.status(500).send({message: `Please fill in all fields.`});
                    } else{
                        res.status(201).send({message: 'Successfully add Material'});
                    }
                })
            }
        }
    })
})

router.post('/add_inj_cavity/:InjectionMatID', (req, res, next) => {
    let InjectionMatID = req.params.InjectionMatID;
    let PartID = req.body.PartID;
    let MoldID = req.body.MoldID;
    let PcsWeight = req.body.PcsWeight;
    let Qty = req.body.Qty
    let InsertCav = `INSERT INTO MoldCav(PartID, MoldID, Qty, PcsWeight, InjectionMatID) VALUES(${PartID}, ${MoldID}, ${Qty}, ${PcsWeight}, ${InjectionMatID})`;
    dbCon.query(InsertCav, (err) => {
        if(err){
            res.status(500).send({message : `${err}`});
        } else{
            res.status(201).send({message: 'Successfully add cavity'})
        }
    })
})

router.post('/add_component_part/:InjectionID', (req, res, next) => {
    let InjectionID = req.params.InjectionID;
    let PartID = req.body.PartID;
    let Qty = req.body.Qty;
    let InsertMoldComp = `INSERT INTO InsertMoldComponentPart(InjectionID, PartID, Qty) VALUES(${InjectionID}, ${PartID}, ${Qty})`;
    let UpdateProcessInj = `UPDATE ProcessInjection SET InsertMold = '1'`; // set injection InsertMold
    let checkDuplicate = `SELECT CASE
    WHEN EXISTS(
         SELECT * FROM InsertMoldComponentPart
		 WHERE InjectionID = ${InjectionID} AND PartID = ${PartID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(checkDuplicate, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: `Duplicate part.`})
            } else{
                dbCon.query(InsertMoldComp, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`});
                    } else{
                        dbCon.query(UpdateProcessInj, (err) => {
                            if(err){
                                res.status(500).send({message: `${err}`});
                            } else{
                                res.status(201).send({message: 'Successfully add Component Part'})
                            }
                        })
                    }
                })
            }
        }
    })
})

//======================================================================EDIT

router.put('/edit_inj_mold/:InjectionID', (req, res, next) => {
    let InjectionID = req.params.InjectionID;
    let MoldID = req.body.MoldID
    let AddonName = req.body.AddonName;
    let RefID = req.body.RefID
    let UpdateInjMold = `UPDATE InjectionMold SET MoldID = ${MoldID} WHERE InjectionID= ${InjectionID}`;
    let UpdateMoldAddon = `UPDATE MoldAddon SET AddonName = '${AddonName}' WHERE InjectionID=${InjectionID}`;
    let checkDuplicate = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM [ProcessInjection] a
		 LEFT JOIN [InjectionMold] b ON a.InjectionID = b.InjectionID
         WHERE b.MoldID = ${MoldID} AND NOT a.InjectionID = ${InjectionID} AND a.RefID = ${RefID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(checkDuplicate, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate Mold'})
            } else{
                dbCon.query(UpdateInjMold, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`});
                    } else{
                        dbCon.query(UpdateMoldAddon, (err) => {
                            if(err){
                                res.status(500).send({message: `${err}`});
                            } else{
                                res.status(200).send({message: 'Successfully edit Injection Mold'});
                            }
                        })
                    }
                })
            }
        }
    })
})

router.put('/edit_inj_mat/:InjectionMatID', (req, res, next) => {
    let InjectionMatID = req.params.InjectionMatID;
    let MaterialID = req.body.MaterialID;
    let CycleTime = req.body.CycleTime;
    let PcsHr = req.body.PcsHr;
    let RunnerWeight = req.body.RunnerWeight;
    let InjectionID = req.body.InjectionID;
    let UpdateInjMat = `UPDATE InjectionMaterial SET MaterialID=${MaterialID}, CycleTime=${CycleTime}, PcsHr=${PcsHr}, RunnerWeight=${RunnerWeight} WHERE InjectionMatID=${InjectionMatID}`;
    let checkDuplicate = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM InjectionMaterial
         WHERE MaterialID = ${MaterialID} AND InjectionID = ${InjectionID} AND NOT InjectionMatID = ${InjectionMatID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(checkDuplicate, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate Material'})
            } else{
                dbCon.query(UpdateInjMat, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`});
                    } else{
                        res.status(200).send({message: 'Successfully edit Material'});
                    }
                })
            }
        }
    })
})

router.put('/edit_cav/:CavID', (req, res, next) => {
    let CavID = req.params.CavID;
    let PartID = req.body.PartID;
    let PcsWeight = req.body.PcsWeight;
    let Qty = req.body.Qty;
    let UpdateCav = `UPDATE MoldCav SET PartID=${PartID} ,PcsWeight=${PcsWeight}, Qty=${Qty} WHERE CavID=${CavID}`;
    dbCon.query(UpdateCav, (err) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send({message: 'Successfully edit Cavity'});
        }
    })
})

router.put('/edit_inj_comp/:CompID', (req, res, next) => {
    let CompID = req.params.CompID;
    let PartID = req.body.PartID;
    let Qty = req.body.Qty;
    let InjectionID = req.body.InjectionID;
    let checkDuplicate = `SELECT CASE
    WHEN EXISTS(
         SELECT * FROM InsertMoldComponentPart
		 WHERE InjectionID = ${InjectionID} AND PartID = ${PartID} AND NOT CompID = ${CompID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    let UpdateInjComp = `UPDATE InsertMoldComponentPart SET Qty = ${Qty},PartID = ${PartID} WHERE CompID=${CompID}`;
    dbCon.query(checkDuplicate, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate part.'});
            } else{
                dbCon.query(UpdateInjComp, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`});
                    } else{
                        res.status(200).send({message: 'Successfully edit Component Part.'});
                    }
                })
            }
        }
    })
})

//======================================================================DELETE
router.delete('/delete_inj_mold/:InjectionID', (req, res, next) => {
    let InjectionID = req.params.InjectionID;
    let DeleteInjMold = `DELETE ProcessInjection WHERE InjectionID=${InjectionID}`;
    if(InjectionID == 'null'){
        res.status(400).send({message: 'Please select Mold'})
    } else{
        dbCon.query(DeleteInjMold, (err) => {
            if(err){
                res.status(500).send({message: `${err}`})
            } else{
                res.status(200).send({message: 'Successfully delete Injection Mold'});
            }
        })
    }
})

router.delete('/delete_inj_material/:InjectionMatID', (req, res, next) => {
    let InjectionMatID = req.params.InjectionMatID;
    let DeleteInjMaterial = `DELETE InjectionMaterial WHERE InjectionMatID=${InjectionMatID}`;
    if(InjectionMatID=='null'){
        res.status(400).send({message: 'Please select material'})
    } else{
        dbCon.query(DeleteInjMaterial, (err) => {
            if(err){
                res.status(500).send({message: `${err}`});
            } else{
                res.status(200).send({message: 'Successfully delete Material'});
            }
        })
    }
})

router.delete('/delete_cavity/:CavID' ,(req, res, next) => {
    let CavID = req.params.CavID;
    let DeleteInjCav = `DELETE MoldCav WHERE CavID=${CavID}`;
    if(CavID == 'null'){
        res.status(400).send({message: 'Please select cavity'})
    } else{
        dbCon.query(DeleteInjCav, (err) => {
            if(err){
                res.status(500).send({message: `${err}`});
            } else{
                res.status(200).send({message: 'Successfully delete Cavity'});
            }
        })
    }
})

router.delete('/delete_component_part/:CompID', (req, res, next) => {
    let CompID = req.params.CompID;
    let InjectionID = req.body.InjectionID; //! new
    console.log(InjectionID);
    let DeleteInjCompPart = `DELETE InsertMoldComponentPart WHERE CompID=${CompID}`;
    if(CompID == 'null'){
        res.status(400).send({message: 'Please select component'})
    } else{
        dbCon.query(DeleteInjCompPart, (err) => {
            if(err){
                res.status(500).send({message: `${err}`});
            } else{
                //! new
                console.log('new');
                let updateInsertMold = `UPDATE ProcessInjection SET InsertMold = 0 WHERE InjectionID = ${InjectionID}`;
                let checkInsertMold = `SELECT CompID FROM [InsertMoldComponentPart] a WHERE a.InjectionID = ${InjectionID}`;
                dbCon.query(checkInsertMold, (err, row) => {
                    if(err){
                        res.status(500).send({message: `${err}`})
                    } else{
                        console.log('new1');
                        console.log(row.recordset);
                        if(!row.recordset.length){
                            dbCon.query(updateInsertMold, (err) => {
                                if(err){
                                    res.status(500).send({message: `${err}`})
                                } else{
                                    console.log('new2');
                                    res.status(200).send({message: 'Successfully delete Component Part'});
                                }
                            })
                        }
                    }
                })
                // res.status(200).send({message: 'Successfully delete Component Part'});
            }
        })
    }
})

module.exports = router;

