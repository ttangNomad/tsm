const express = require('express');
const router = express.Router();
const dbCon = require('../../lib/db');

router.get('/welding_list/:RefID' ,(req, res, next) => {
    let RefID = req.params.RefID
    //! process name =  part Name
    let SelectWeldingList = `SELECT
	row_number() over(order by PW.WeldingID) as 'index',
	PW.WeldingID, MasterPart.PartName, MasterPart.PartCode,PW.CycleTime, PW.PcsHr, ManPower.Operator,MasterPart.PartID
    FROM [ProcessWelding] PW
    LEFT JOIN ManPower ON PW.ManPowerID = ManPower.ManPowID
    LEFT JOIN MasterPart ON PW.PartID_OUT = MasterPart.PartID
    WHERE PW.RefID = ${RefID}`;
    dbCon.query(SelectWeldingList, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/part_component_list/:WeldingID', (req, res, next) => {
    let WeldingID = req.params.WeldingID;
    let SelectPartComponentList = `SELECT
	ROW_NUMBER() over(order by a.CompID) as 'index',
	a.CompID, b.PartCode, b.PartName, a.Qty, b.Supplier,b.PartID,
	(
		SELECT top(1) RefNo FROM MasterReferenceNo
		LEFT JOIN PartReferentNoHistory ON MasterReferenceNo.RefID = PartReferentNoHistory.RefID
		WHERE a.PartID = PartReferentNoHistory.PartID
		ORDER BY PartReferentNoHistory.PRefID desc
	) AS 'RefNo'
    FROM [WeldingComponentPart] a
    LEFT JOIN [MasterPart] b ON b.PartID = a.PartID
    WHERE a.WeldingID = ${WeldingID}`;
    dbCon.query(SelectPartComponentList, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

router.get('/jig_list/:WeldingID', (req, res, next) => {
    let WeldingID = req.params.WeldingID;
    let SelectJigList = `SELECT
    row_number() over(order by JigID) as 'index',
    JigID, JigNo FROM WeldingJig WHERE WeldingID = ${WeldingID}`;
    dbCon.query(SelectJigList, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

//========================================================================================ADD
router.post('/add_welding/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let PartID_OUT = req.body.PartID_OUT;
    let PcsHr = req.body.PcsHr;
    let CycleTime = req.body.CycleTime;
    let ManPower = req.body.ManPower
    let SelectProcessIndex = `SELECT ProcessIndex, RefID FROM ProcessInjection WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessHotStamp WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessAssembly WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessSpray WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessPrinting WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessWelding WHERE RefID = ${RefID}
    ORDER BY ProcessIndex desc`;
    let AddMan = new Promise(function (resolve, reject){
        let InsertManPower = `INSERT INTO ManPower(Operator) VALUES(${ManPower})`;
        dbCon.query(InsertManPower, (err) => {
            if(err){
                res.status(500).send({message: `${err}`});
            } else{
                resolve();
            }
        })
    })

    let AddWelding = new Promise(function(resolve, reject){
        AddMan.then(function (){
            let SelectManPowID = 'SELECT ManPowID FROM ManPower ORDER BY ManPowID desc';
            dbCon.query(SelectManPowID, (err, rows) => {
                if(err){
                    res.status(500).send({message: `${err}`});
                } else{
                    let ManPowID = rows.recordset[0].ManPowID;
                    dbCon.query(SelectProcessIndex, (err, row) => {
                        if(err){
                            res.status(500).send({message: `${err}`});
                        } else{
                            if(!row.recordset[0]){
                                var ProcessIndex = 1;
                            } else{
                                var ProcessIndex = row.recordset[0].ProcessIndex + 1 ;
                            }
                            let InsertWelding = `INSERT INTO ProcessWelding(PartID_OUT, PcsHr, CycleTime, ManPowerID, ProcessIndex, RefID) VALUES(${PartID_OUT}, ${PcsHr}, ${CycleTime}, ${ManPowID}, ${ProcessIndex}, ${RefID})`;
                            dbCon.query(InsertWelding, (err) => {
                                if(err){
                                    res.status(500).send({message: `${err}`});
                                } else{
                                    resolve();
                                    res.status(201).send({message: 'Successfully add welding'})
                                }
                            })
                        }
                    })
                }
            })
        })
    })
})

router.post('/add_welding_comp/:WeldingID', (req, res, next) =>{
    let WeldingID = req.params.WeldingID;
    let PartID = req.body.PartID;
    let Qty = req.body.Qty;
    let checkDuplicate = `SELECT CASE
    WHEN EXISTS(
         SELECT * FROM WeldingComponentPart
		 WHERE WeldingID = ${WeldingID} AND PartID = ${PartID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    let InsertWeldingComp = `INSERT INTO WeldingComponentPart(WeldingID, PartID, Qty) VALUES(${WeldingID}, ${PartID}, ${Qty})`;
    dbCon.query(checkDuplicate, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: `Duplicate part.`})
            } else{
                dbCon.query(InsertWeldingComp, (err) => {
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

router.post('/add_jig/:WeldingID', (req, res, next) => {
    let WeldingID = req.params.WeldingID;
    let JigNo = req.body.JigNo;
    let InsertJig = `INSERT INTO WeldingJig(WeldingID, JigNo) VALUES(${WeldingID}, '${JigNo}')`;
    let checkDuplicate = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM WeldingJig
         WHERE JigNo = '${JigNo}' AND WeldingID = ${WeldingID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(checkDuplicate, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate JigNo for this process'})
            } else{
                dbCon.query(InsertJig, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`});
                    } else{
                        res.status(201).send({message: 'Successfully add Jig'})
                    }
                })
            }
        }
    })
})

//=========================================================================================EDIT
router.put('/edit_welding/:WeldingID', (req, res, next) => {
    let WeldingID = req.params.WeldingID;
    let PartID_OUT = req.body.PartID;
    let CycleTime = req.body.CycleTime;
    let PcsHr = req.body.PcsHr;
    let ManPower = req.body.ManPower;
    let UpdateWelding = `UPDATE ProcessWelding SET PartID_OUT=${PartID_OUT}, CycleTime=${CycleTime}, PcsHr=${PcsHr} WHERE WeldingID=${WeldingID}`;
    let SelectManPowerID = `SELECT ManPowerID FROM ProcessWelding WHERE WeldingID = ${WeldingID}`;
    dbCon.query(UpdateWelding, (err) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            dbCon.query(SelectManPowerID, (err, rows) => {
                if(err){
                    res.status(500).send({message: `${err}`});
                } else{
                    let ManPowerID = rows.recordset[0].ManPowerID
                    let UpdateManPower = `UPDATE ManPower SET Operator = ${ManPower} WHERE ManPowID = ${ManPowerID}`;
                    dbCon.query(UpdateManPower, (err) => {
                        if(err){
                            res.status(500).send({message: `${err}`});
                        } else{
                            res.status(200).send({message: 'Successfilly edit welding'})
                        }
                     })
                }
            })
        }
    })
})

router.put('/edit_comp/:CompID', (req, res, next) => {
    let CompID = req.params.CompID;
    let PartID = req.body.PartID;
    let Qty = req.body.Qty;
    let WeldingID = req.body.WeldingID;
    let checkDuplicate = `SELECT CASE
    WHEN EXISTS(
         SELECT * FROM WeldingComponentPart
		 WHERE WeldingID = ${WeldingID} AND PartID = ${PartID} AND NOT CompID = ${CompID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    let UpdateComp = `UPDATE WeldingComponentPart SET PartID=${PartID}, Qty=${Qty} WHERE CompID=${CompID}`;
    dbCon.query(checkDuplicate, (err,row) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: `Duplicate part.`})
            } else{
                dbCon.query(UpdateComp, (err) => {
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

router.put('/edit_jig/:JigID', (req, res, next) => {
    let JigID = req.params.JigID;
    let JigNo = req.body.JigNo;
    let WeldingID = req.body.WeldingID;
    let UpdateJig = `UPDATE WeldingJig SET JigNo = '${JigNo}' WHERE JigID = ${JigID}`
    let checkDuplicate = `SELECT CASE
    WHEN EXISTS(
	SELECT *
         FROM WeldingJig
         WHERE JigNo = '${JigNo}' AND WeldingID = ${WeldingID} AND NOT JigID = ${JigID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(checkDuplicate, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate JigNo for this process'})
            } else{
                dbCon.query(UpdateJig, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`})
                    } else{
                        res.status(200).send({message: 'Successfully edit jig'})
                    }
                })
            }
        }
    })
})
//=========================================================================================DELETE
router.delete('/delete_welding/:WeldingID', (req, res, next) => {
    let WeldingID = req.params.WeldingID;
    let DeleteWelding = `DELETE ProcessWelding WHERE WeldingID = ${WeldingID}`;
    let SelectManPowID = `SELECT ManPowerID FROM ProcessWelding WHERE WeldingID = ${WeldingID}`;
    dbCon.query(SelectManPowID, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            let ManPowID = row.recordset[0].ManPowerID;
            let DeleteManPower = `DELETE FROM ManPower WHERE ManPowID = ${ManPowID}`;
            dbCon.query(DeleteWelding, (err) => {
                if(err){
                    res.status(500).send({message: `${err}`})
                } else{
                    dbCon.query(DeleteManPower, (err) => {
                        if(err){
                            res.status(500).send({message: `${err}`});
                        } else{
                            res.status(200).send({message: 'Successfully delete welding'});
                        }
                    })
                }
            })
        }
    })
})

router.delete('/delete_comp/:CompID', (req, res, next) => {
    let CompID = req.params.CompID;
    let DeleteComp = `DELETE WeldingComponentPart WHERE CompID = ${CompID}`;
    dbCon.query(DeleteComp, (err) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send({message: 'Successfully delete Component Part'})
        }
    })
})

router.delete('/delete_jig/:JigID', (req, res, next) => {
    let JigID = req.params.JigID;
    let DeleteJig = `DELETE WeldingJig WHERE JigID=${JigID}`;
    dbCon.query(DeleteJig, (err) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send('Successfully delete jig');
        }
    })
})

module.exports = router;