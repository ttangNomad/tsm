const express = require('express');
const router = express.Router();
const dbCon = require('../../lib/db');

router.get('/hot_stamp_list/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let SelectHotStampList = `SELECT
    row_number() over(order by ProcHS.HSID desc) as 'index',
    ProcHS.HSID,
    (
        SELECT PartCode
        FROM MasterPart
        WHERE ProcHS.PartID_IN = MasterPart.PartID
    ) AS Part_IN,
    (
        SELECT PartCode
        FROM MasterPart
        WHERE ProcHS.PartID_OUT = MasterPart.PartID
    ) AS Part_OUT,
    ProcMC.McTypeName, ProcHS.PcsHr, MHSM.FoilCode, ProcHS.FoilSize, ManPower.Operator, ProcHS.PartID_IN, ProcHS.PartID_OUT, ProcMC.McTypeID, ProcHS.HSMID
        FROM [ProcessHotStamp] ProcHS
        LEFT JOIN [MasterPart] MPart ON ProcHS.PartID_IN = MPart.PartID AND ProcHS.PartID_OUT = MPart.PartID
        LEFT JOIN [MasterHotStampMaterial] MHSM ON ProcHS.HSMID = MHSM.HSMID
        LEFT JOIN ManPower ON ProcHS.ManPowerID = ManPower.ManPowID
		LEFT JOIN [ProcessHotStampMcType]ProcMC ON ProcHS.McTypeID = ProcMC.McTypeID
    WHERE ProcHS.RefID = ${RefID}`;
    dbCon.query(SelectHotStampList, (err, rows) => {
        if(err) {
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/jig_list/:HSID', (req, res, next) => {
    let HSID = req.params.HSID;
    let SelectJigList = `SELECT
    row_number() over(order by JigID desc) as 'index',
    JigID, JigNo FROM HotStampJig WHERE HSID = ${HSID}`;
    dbCon.query(SelectJigList, (err, rows) => {
        if(err) {
            res.status(500).send({message: `${err}`});
        } else {
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

//============================================================================Add
router.post('/add_hot_stamp/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let PartID_IN = req.body.PartID_IN;
    let PartID_OUT = req.body.PartID_OUT;
    let McTypeID = req.body.McTypeID;
    let PcsHr =  req.body.PcsHr;
    let HSMID = req.body.HSMID; //Foil Code
    let FoilSize = req.body.FoilSize;
    let ManPower = req.body.ManPower;
    let InsertManpower = `INSERT INTO ManPower(Operator) VALUES(${ManPower})`;
    let SelectManPowID = 'SELECT ManPowID FROM ManPower ORDER By ManPowID desc';
    let SelectProcessIndex = `SELECT ProcessIndex, RefID FROM ProcessInjection WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessHotStamp WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessAssembly WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessSpray WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessPrinting WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessWelding WHERE RefID = ${RefID}
    ORDER BY ProcessIndex desc`;
    let AddMan = new Promise(function(resolve, reject){
        dbCon.query(InsertManpower, (err) => {
            if(err){
                res.status(500).send({message: `${err}`});
            } else{
                resolve();
            }
        })
    })
    let AddHotStamp = new Promise (function(resolve, reject) {
        AddMan.then(function(){
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
                            }else{
                                var ProcessIndex = row.recordset[0].ProcessIndex + 1;
                            }
                            let InsertHotStamp = `INSERT INTO ProcessHotStamp(PartID_IN, PartID_OUT, McTypeID, PcsHr, FoilSize, HSMID, RefID, ManPowerID, ProcessIndex) VALUES(${PartID_IN}, ${PartID_OUT}, ${McTypeID},${PcsHr},'${FoilSize}', ${HSMID}, ${RefID}, ${ManPowID}, '${ProcessIndex}')`;
                            dbCon.query(InsertHotStamp, (err) => {
                                if(err){
                                    res.status(500).send({message: `${err}`});
                                } else{
                                    res.status(201).send({message: 'Successfully add HotStamp'});
                                    resolve();
                                }
                            })
                        }
                    })
                }
            })
        })
    })
})

router.post('/add_jig/:HSID', (req, res, next) => {
    let HSID = req.params.HSID;
    let JigNo = req.body.JigNo;
    let InsertJig = `INSERT INTO HotStampJig(HSID, JigNo) VALUES(${HSID},'${JigNo}')`
    let checkDuplicate = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM HotStampJig
         WHERE JigNo = '${JigNo}' AND HSID = ${HSID}
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
                        res.status(201).send({message: 'Successfully add Jig'});
                    }
                })
            }
        }
    })
})

//================================================================Edit
router.put('/edit_hot_stamp/:HSID', (req, res, next) => {
    let HSID = req.params.HSID;
    let PartID_IN = req.body.PartID_IN;
    let PartID_OUT = req.body.PartID_OUT;
    let McTypeID = req.body.McTypeID;
    let PcsHr =  req.body.PcsHr;
    let HSMID = req.body.HSMID; // Foil code
    let FoilSize = req.body.FoilSize;
    let ManPower = req.body.ManPower;
    let SelectManPowID = `SELECT ManPowerID FROM ProcessHotStamp WHERE HSID='${HSID}'`;
    let UpdateHotStamp = `UPDATE ProcessHotStamp SET PartID_IN=${PartID_IN}, PartID_OUT=${PartID_OUT}, McTypeID=${McTypeID}, PcsHr=${PcsHr}, FoilSize='${FoilSize}', HSMID=${HSMID} WHERE HSID=${HSID}`;
    dbCon.query(SelectManPowID, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            let ManPowID = rows.recordset[0].ManPowerID;
            let UpdateManPower = `UPDATE ManPower SET Operator=${ManPower} WHERE ManPowID=${ManPowID}`;
            dbCon.query(UpdateManPower, (err) => {
                if(err){
                    res.status(500).send({message: `${err}`});
                } else{
                    dbCon.query(UpdateHotStamp, (err) => {
                        if(err){
                            res.status(500).send({message: `${err}`});
                        } else{
                            res.status(200).send({message: 'Successfully edit HotStamp'});
                        }
                    })
                }
            })
        }
    })
})

router.put('/edit_jig/:JigID', (req, res, next) => {
    let JigID = req.params.JigID;
    let JigNo = req.body.JigNo;
    let HSID = req.body.HSID;
    let UpdateJig = `UPDATE HotStampJig SET JigNo = '${JigNo}' WHERE JigID = ${JigID}`;
    let checkDuplicate = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM HotStampJig
         WHERE JigNo = '${JigNo}' AND HSID = ${HSID} AND NOT JigID = ${JigID}
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
                        res.status(200).send({message: 'Successfully edit JigNo'})
                    }
                })
            }
        }
    })
})

//===========================================================================delete
router.delete('/delete_hot_stamp/:HSID', (req, res, next) => {
    let HSID = req.params.HSID;
    let DeleteHotStamp = `DELETE ProcessHotStamp WHERE HSID=${HSID}`;
    let SelectManPowID = `SELECT ManPowerID FROM ProcessHotStamp WHERE HSID = ${HSID}`;
    dbCon.query(SelectManPowID, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            let ManPowID = row.recordset[0].ManPowerID;
            let DeleteManPower = `DELETE ManPower WHERE ManPowID = ${ManPowID}`;
            dbCon.query(DeleteHotStamp, (err) => {
                if(err){
                    res.status(500).send({message: `${err}`})
                } else{
                    dbCon.query(DeleteManPower, (err) => {
                        if(err){
                            res.status(500).send({message: `${err}`});
                        } else{
                            res.status(200).send({message: 'Successfully delete HotStamp'});
                        }
                    })
                }
            })
        }
    })
})

router.delete('/delete_jig/:JigID', (req, res, next) => {
    let JigID = req.params.JigID;
    let DeleteJig = `DELETE HotStampJig WHERE JigID=${JigID}`;
    dbCon.query(DeleteJig, (err) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send({message: 'Successfully delete Jig'});
        }
    })
})

module.exports = router;