const e = require('express');
const express = require('express');
const router = express.Router();
const dbCon = require('../../lib/db');



router.get('/assembly_list/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let SelectAssemblyList = `SELECT
	row_number() over(order by ProcAssy.AssyProcID desc) as 'index',
	ProcAssy.AssyProcID, ProcAssy.ProcessName, MasterPart.PartName, MasterPart.PartID
    FROM [ProcessAssembly] ProcAssy
    LEFT JOIN MasterPart ON ProcAssy.PartID_OUT = MasterPart.PartID
    WHERE ProcAssy.RefID = ${RefID}`;
    dbCon.query(SelectAssemblyList, (err, rows) => {
        if(err) {
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/part_component_list/:AssyProcID', (req, res, next) => {
    let AssyProcID = req.params.AssyProcID;
    let SelectPartComponentList = `SELECT  
	row_number() over(order by a.CompID desc) as 'index',
    a.CompID, b.PartCode, b.PartName, a.Qty, b.Supplier, a.PartID,
	(
		SELECT top(1) RefNo FROM MasterReferenceNo
		LEFT JOIN PartReferentNoHistory ON PartReferentNoHistory.RefID = MasterReferenceNo.RefID
		WHERE a.PartID = PartReferentNoHistory.PartID
		ORDER BY PartReferentNoHistory.PRefID desc
	) AS 'RefNo'
    FROM [AssemblyComponentPart] a
    LEFT JOIN [MasterPart] b ON a.PartID = b.PartID
    WHERE a.AssyProcID = ${AssyProcID}`;
    dbCon.query(SelectPartComponentList, (err, rows) => {
        if(err) {
            res.status(500).send({message: `${err}`});
        } else {
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/jig_list/:AssyProcID', (req, res, next) => {
    let AssyProcID = req.params.AssyProcID
    let SelectJigList = `SELECT
	row_number() over(order by AssyJig.JigID desc) as 'index',
	AssyJig.JigID, ProcAssy.ProcessName, AssyJig.JigName, AssyJig.JigNo, AssyJig.PcsHr, ManPower.Operator
    FROM [AssemblyJigTool] AssyJig
    LEFT JOIN [ProcessAssembly] ProcAssy ON AssyJig.AssyProcID = ProcAssy.AssyProcID
    LEFT JOIN ManPower ON AssyJig.ManPowerID = ManPower.ManPowID
    WHERE AssyJig.AssyProcID = ${AssyProcID}`;
    dbCon.query(SelectJigList, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

//===================================================================ADD
router.post('/add_assembly/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let ProcessName = req.body.ProcessName;
    let PartID_OUT = req.body.PartID_OUT;
    let SelectProcessIndex = `SELECT ProcessIndex, RefID FROM ProcessInjection WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessHotStamp WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessAssembly WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessSpray WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessPrinting WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessWelding WHERE RefID = ${RefID}
    ORDER BY ProcessIndex desc`;
    dbCon.query(SelectProcessIndex, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            if(!rows.recordset[0]){
                var ProcessIndex = 1;
            } else{
                var ProcessIndex = rows.recordset[0].ProcessIndex + 1;
            }
            let InsertProcess = `INSERT INTO ProcessAssembly(ProcessName, PartID_OUT, RefID, ProcessIndex) VALUES('${ProcessName}', ${PartID_OUT}, ${RefID}, ${ProcessIndex})`;
            dbCon.query(InsertProcess, (err) => {
                if(err){
                    res.status(500).send({message: `${err}`});
                } else{
                    res.status(201).send({message: 'Successfully add Assembly'});
                }
            })
        }
    })
})

router.post('/add_assy_comp/:AssyProcID', (req, res, next) => {
    let AssyProcID = req.params.AssyProcID;
    let PartID = req.body.PartID;
    let Qty = req.body.Qty;
    let checkDuplicate = `SELECT CASE
        WHEN EXISTS(
            SELECT * FROM AssemblyComponentPart
            WHERE AssyProcID = ${AssyProcID} AND PartID = ${PartID} )
        THEN CAST (1 AS BIT)
        ELSE CAST (0 AS BIT) END AS 'check'`;
    let InsertAssyComp = `INSERT INTO AssemblyComponentPart(AssyProcID, PartID, Qty) VALUES(${AssyProcID}, ${PartID}, ${Qty})`;
    dbCon.query(checkDuplicate, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate part.'})
            } else{
                dbCon.query(InsertAssyComp, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`});
                    } else{
                        res.status(201).send({message: 'Successfully add Component Part'});
                    }
                })
            }
        }
    })
})

router.post('/add_assy_jig/:AssyProcID', (req, res, next) => {
    let AssyProcID = req.params.AssyProcID;
    let JigName = req.body.JigName;
    let JigNo = req.body.JigNo;
    let PcsHr = req.body.PcsHr;
    let ManPower = req.body.ManPower;
    let InsertManPower = `INSERT INTO ManPower(Operator) VALUES(${ManPower})`;
    let AddMan = new Promise(function(resolve, reject){
        dbCon.query(InsertManPower, (err) => {
            if(err){
                res.status(500).send({message: `${err}`});
            } else{
                resolve();
            }
        })
    })
    let AddAssyJig = new Promise(function(resolve, reject){
        AddMan.then(function(){
            let SelectManPowID = 'SELECT ManPowID FROM ManPower ORDER BY ManPowID desc';
            dbCon.query(SelectManPowID, (err, rows) => {
                if(err){
                    res.status(500).send({message: `${err}`});
                } else{
                    let ManPowID = rows.recordset[0].ManPowID;
                    let InsertAssyJig = `INSERT INTO AssemblyJigTool(AssyProcID, JigNo, JigName, PcsHr, ManPowerID) VALUES(${AssyProcID}, '${JigNo}', '${JigName}', ${PcsHr}, ${ManPowID})`;
                    dbCon.query(InsertAssyJig, (err) => {
                        if(err){
                            res.status(500).send({message: `${err}`});
                        } else{
                            resolve();
                            res.status(201).send({message: 'Successfully add Jig'})
                        }
                    })
                }
            })
        })
    })
})

//========================================================EDIT
router.put('/edit_assy_process/:AssyProcID', (req, res, next) => {
    let AssyProcID = req.params.AssyProcID;
    let ProcessName = req.body.ProcessName;
    let PartID_OUT = req.body.PartID_OUT;
    let UpdateProcess = `UPDATE ProcessAssembly SET ProcessName='${ProcessName}', PartID_OUT=${PartID_OUT} WHERE AssyProcID=${AssyProcID}`;
    dbCon.query(UpdateProcess, (err) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send({message: 'Successfully edit Assembly'});
        }
    })
})

router.put('/edit_assy_comp/:CompID', (req, res, next) => {
    let CompID = req.params.CompID;
    let PartID = req.body.PartID;
    let Qty = req. body.Qty;
    let AssyProcID = req.body.AssyProcID;
    let checkDuplicate = `SELECT CASE
        WHEN EXISTS(
            SELECT * FROM AssemblyComponentPart
            WHERE AssyProcID = ${AssyProcID} AND PartID = ${PartID} AND NOT CompID = ${CompID}
            )
        THEN CAST (1 AS BIT)
        ELSE CAST (0 AS BIT) END AS 'check'`;
    let UpdateAssyComp = `UPDATE AssemblyComponentPart SET PartID=${PartID}, Qty=${Qty} WHERE CompID=${CompID}`;
    dbCon.query(checkDuplicate, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate part.'})
            } else{
                dbCon.query(UpdateAssyComp, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`});
                    } else{
                        res.status(200).send({message: 'Successfully edit Component Part'});
                    }
                })
            }
        }
    })
})

router.put('/edit_assy_jig/:JigID', (req, res, next) => {
    let JigID = req.params.JigID;
    let JigNo = req.body.JigNo;
    let JigName = req.body.JigName;
    let PcsHr = req.body.PcsHr;
    let ManPower = req.body.ManPower;
    let SelectManPowID = `SELECT ManPowerID FROM AssemblyJigTool WHERE JigID=${JigID}`;
    dbCon.query(SelectManPowID, (err, rows) =>{
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            let ManPowID = rows.recordset[0].ManPowerID;
            let UpdateManPower = `UPDATE ManPower SET Operator=${ManPower} WHERE ManPowID=${ManPowID}`;
            dbCon.query(UpdateManPower, (err) => {
                if(err){
                    res.status(500).send({message: `${err}`});
                }
            })
        }
    })
    let UpdateAssyJig = `UPDATE AssemblyJigTool SET JigNo='${JigNo}', JigName='${JigName}', PcsHr=${PcsHr} WHERE JigID=${JigID}`;
    dbCon.query(UpdateAssyJig, (err) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send({message: 'Successfully edit Jig'});
        }
    })
})

//=========================================================DELETE
router.delete('/delete_assy_process/:AssyProcID', (req, res, next) => {
    let AssyProcID = req.params.AssyProcID;
    let DeleteAssyProc = `DELETE ProcessAssembly WHERE AssyProcID=${AssyProcID}`;
    let SelectManPowID = `SELECT ManPowerID FROM AssemblyJigTool WHERE AssyProcID = ${AssyProcID}`;
    let DeleteAssyJig = `DELETE AssemblyJigTool WHERE AssyProcID = ${AssyProcID}`;
    dbCon.query(SelectManPowID, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            let ManPowID = row.recordset;
            ManPowID.forEach(element => {
                let DeleteManPower = `DELETE ManPower WHERE ManPowID = ${element.ManPowerID}`;
                dbCon.query(DeleteManPower, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`});
                    }
                })
            });
            dbCon.query(DeleteAssyJig, (err) => {
                if(err){
                    res.status(500).send({message: `${err}`});
                } else{
                    dbCon.query(DeleteAssyProc, (err) => {
                        if(err){
                            res.status(500).send({message: `${err}`});
                        } else{
                            res.status(200).send({message: 'Successfully delete Assembly.'});
                        }
                    })
                }
            })
        }
    })
})

router.delete('/delete_assy_comp/:CompID', (req, res, next) => {
    let CompID = req.params.CompID;
    let DeleteAssyComp = `DELETE AssemblyComponentPart WHERE CompID=${CompID}`;
    dbCon.query(DeleteAssyComp, (err) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send({message: 'Successfully delete Component Part.'});
        }
    })
})

router.delete('/delete_assy_jig/:JigID', (req, res, next) => {
    let JigID = req.params.JigID;
    let DeleteAssyJig = `DELETE AssemblyJigTool WHERE JigID = ${JigID}`;
    dbCon.query(DeleteAssyJig, (err) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send({message: 'Successfully delete Jig'})
        }
    })
})

module.exports = router;