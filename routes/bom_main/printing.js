const express = require('express');
const router = express.Router();
const dbCon = require('../../lib/db');

router.get('/printing_list/:RefID', (req, res, nexst) => {
    let RefID = req.params.RefID;
    let SelectPrintingList = `SELECT
	row_number() over(order by ProcP.PrintingID desc) as 'index',
	ProcP.PrintingID,
    (
        SELECT PartCode FROM MasterPart WHERE PartID = ProcP.PartID_IN
    ) AS 'PartIN',
    (
        SELECT PartCode FROM MasterPart WHERE PartID = ProcP.PartID_OUT
    ) AS 'PartOUT',
    ProcP.MFG, ProcP.PcsHr, MI.Size, ProcP.InkLife, ManPower.Operator, ProcP.PartID_IN, ProcP.PartID_OUT , ProcP.InkQtyID
    FROM [ProcessPrinting] ProcP
    LEFT JOIN ManPower ON ProcP.ManPowID = ManPower.ManPowID
    LEFT JOIN [MasterInkQty] MI ON ProcP.InkQtyID = MI.InkQtyID
    WHERE ProcP.RefID= ${RefID}`;
    dbCon.query(SelectPrintingList, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/mixing_ratio/:PrintingID' ,(req, res, next) => {
    let PrintingID = req.params.PrintingID;
    let SelectMixingRatio = `SELECT PP.PrintingID, PP.ColorID, MCM.ColorName, PP.HardenerID, MHM.HardenerName, PP.ThinnerID, MTM.ThinnerName, PP.MixRatioC, PP.MixRatioH, PP.MixRatioT, PP.MatPerPcsC, PP.MatPerPcsH, PP.MatPerPcsT
    FROM [ProcessPrinting] PP
    LEFT JOIN [MasterColorMaterial] MCM ON PP.ColorID = MCM.ColorID
    LEFT JOIN [MasterHardenerMaterial] MHM ON PP.HardenerID = MHM.HardenerID
    LEFT JOIN [MasterThinnerMaterial] MTM ON PP.ThinnerID = MTM.ThinnerID
    WHERE PP.PrintingID = ${PrintingID}`;
    dbCon.query(SelectMixingRatio, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/mixing/:PrintingID', (req, res, next) => {
    let PrintingID = req.params.PrintingID;
    let SelectMixing = `SELECT 'Color' AS 'Material',
        CASE
            WHEN a.ColorID IS NULL THEN ''
            ELSE a.ColorID
        END AS 'ID',
        b.ColorName AS 'Code', a.MixRatioC, a.MatPerPcsC
    FROM ProcessPrinting a
    LEFT JOIN MasterColorMaterial b ON a.ColorID = b.ColorID
    WHERE a.PrintingID = ${PrintingID}
    UNION

    SELECT 'Hardener' AS 'Material',
        CASE
            WHEN a.HardenerID IS NULL THEN ''
            ELSE a.HardenerID
        END AS 'ID',
        b.HardenerName As 'Code', a.MixRatioH, a.MatPerPcsH
    FROM ProcessPrinting a
    LEFT JOIN MasterHardenerMaterial b ON a.HardenerID = b.HardenerID
    WHERE a.PrintingID = ${PrintingID}
    UNION

    SELECT 'Thinner' AS 'Material',
        CASE
            WHEN a.ThinnerID IS NULL THEN ''
            ELSE a.ThinnerID
        END AS 'ID',
        b.ThinnerName AS 'Code', a.MixRatioT, a.MatPerPcsT
    From ProcessPrinting a
    LEFT JOIN MasterThinnerMaterial b on a.ThinnerID = b.ThinnerID
    WHERE a.PrintingID = ${PrintingID}`;
    dbCon.query(SelectMixing, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

router.get('/jig_list/:PrintingID', (req, res, next) => {
    let PrintingID = req.params.PrintingID;
    let SelectJigList = `SELECT
    row_number() over(order by JigID desc) as 'index',
    JigID, JigNo FROM PrintingJig WHERE PrintingID = ${PrintingID}`;
    dbCon.query(SelectJigList, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

//=================================================================================ADD
router.post('/add_printing/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let PartID_IN = req.body.PartID_IN;
    let PartID_OUT = req.body.PartID_OUT;
    let MFG = req.body.MFG;
    let PcsHr = req.body.PcsHr;
    let InkQtyID = req.body.InkQtyID;
    let InkLife = req.body.InkLife;
    let ManPower = req.body.ManPower
    let SelectProcessIndex = `SELECT ProcessIndex, RefID FROM ProcessInjection WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessHotStamp WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessAssembly WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessSpray WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessPrinting WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessWelding WHERE RefID = ${RefID}
    ORDER BY ProcessIndex desc`;
    let AddMan = new Promise(function(resolve, reject){
        let InsertManPower = `INSERT INTO ManPower(Operator) VALUES(${ManPower})`;
        dbCon.query(InsertManPower, (err) => {
            if(err){
                res.status(500).send({message: `${err}`});
            } else{
                resolve();
            }
        })
    })
    let AddPrinting = new Promise(function(resolve, reject){
        AddMan.then(function(){
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
                            let InsertPrinting = `INSERT INTO ProcessPrinting(PartID_IN, PartID_OUT, MFG, PcsHr, InkQtyID, InkLife, ManPowID, ProcessIndex, RefID) VALUES(${PartID_IN}, ${PartID_OUT}, '${MFG}', ${PcsHr}, ${InkQtyID}, ${InkLife}, ${ManPowID}, ${ProcessIndex}, ${RefID})`;
                            dbCon.query(InsertPrinting, (err) => {
                                if(err){
                                    res.status(500).send({message: `${err}`});
                                } else{
                                    res.status(201).send({message: 'Successfully add printing'});
                                }
                            })
                        }
                    })
                }
            })
        })
    })
})

router.post('/add_jig/:PrintingID', (req, res, next) => {
    let PrintingID = req.params.PrintingID;
    let JigNo = req.body.JigNo;
    let InsertJig = `INSERT INTO PrintingJig(PrintingID, JigNo) VALUES(${PrintingID}, '${JigNo}')`;
    let checkDuplicate = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM PrintingJig
         WHERE JigNo = '${JigNo}' AND PrintingID = ${PrintingID}
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

//================================================================================EDIT
router.put('/edit_printing/:PrintingID', (req, res, next) => {
    let PrintingID = req.params.PrintingID;
    let PartID_IN = req.body.PartID_IN;
    let PartID_OUT = req.body.PartID_OUT;
    let MFG = req.body.MFG;
    let PcsHr = req.body.PcsHr;
    let InkQtyID = req.body.InkQtyID;
    let InkLife = req.body.InkLife;
    let ManPower = req.body.ManPower;
    let UpdatePrinting = `UPDATE ProcessPrinting SET PartID_IN=${PartID_IN}, PartID_OUT=${PartID_OUT}, MFG='${MFG}', PcsHr=${PcsHr}, InkLife=${InkLife}, InkQtyID=${InkQtyID} WHERE PrintingID=${PrintingID}`;
    dbCon.query(UpdatePrinting, (err) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            let SelectManPowID = `SELECT ManPowID FROM ProcessPrinting WHERE PrintingID = ${PrintingID}`;
            dbCon.query(SelectManPowID, (err, row) => {
                if(err){
                    res.status(500).send({message: `${err}`});
                } else{
                    let ManPowID = row.recordset[0].ManPowID;
                    let UpdateManPower = `UPDATE ManPower SET Operator = ${ManPower} WHERE ManPowID = ${ManPowID}`;
                    dbCon.query(UpdateManPower, (err) => {
                        if(err){
                            res.status(500).send({message: `${err}`});
                        } else{
                            res.status(200).send({message: 'Successfully edit Printing'});
                        }
                    })
                }
            })
        }
    })
})


router.put('/edit_mixing/:PrintingID', (req, res, next) => {
    let PrintingID = req.params.PrintingID;
    let ColorID = req.body.ColorID;
    let HardenerID = req.body.HardenerID;
    let ThinnerID = req.body.ThinnerID;
    let MixRatioC = req.body.MixRatioC;
    let MixRatioH = req.body.MixRatioH;
    let MixRatioT = req.body.MixRatioT;
    let MatPerPcsC = req.body.MatPerPcsC;
    let MatPerPcsH = req.body.MatPerPcsH;
    let MatPerPcsT = req.body.MatPerPcsT;
    let UpdateMixing = `UPDATE ProcessPrinting SET ColorID=${ColorID}, HardenerID=${HardenerID}, ThinnerID=${ThinnerID}, MixRatioC=${MixRatioC}, MixRatioH=${MixRatioH}, MixRatioT=${MixRatioT},
    MatPerPcsC=${MatPerPcsC}, MatPerPcsH=${MatPerPcsH}, MatPerPcsT=${MatPerPcsT} WHERE PrintingID=${PrintingID}`;
    dbCon.query(UpdateMixing, (err) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send({message: 'Successfully edit mixing'});
        }
    })
})

router.put('/edit_jig/:JigID', (req, res, next) => {
    let JigID = req.params.JigID;
    let JigNo = req.body.JigNo;
    let PrintingID = req.body.PrintingID;
    let UpdateJig = `UPDATE PrintingJig SET JigNo = '${JigNo}' WHERE JigID = ${JigID}`;
    let checkDuplicate = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM PrintingJig
         WHERE JigNo = '${JigNo}' AND PrintingID = ${PrintingID} AND NOT JigID=${JigID}
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

//=================================================================================Delete
router.delete('/delete_printing/:PrintingID', (req, res, next) => {
    let PrintingID = req.params.PrintingID;
    let DeletePrinting = `DELETE ProcessPrinting WHERE PrintingID = ${PrintingID}`;
    let SelectManPowID = `SELECT ManPowID FROM ProcessPrinting WHERE PrintingID = ${PrintingID}`;
    dbCon.query(SelectManPowID, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            let ManPowID = row.recordset[0].ManPowID;
            let DeleteManPower = `DELETE FROM ManPower WHERE ManPowID = ${ManPowID}`;
            dbCon.query(DeletePrinting, (err) => {
                if(err){
                    res.status(500).send({message: `${err}`})
                } else{
                    dbCon.query(DeleteManPower, (err) => {
                        if(err){
                            res.status(500).send({message: `${err}`});
                        } else{
                            res.status(200).send({message: 'Successfully delete Printing'});
                        }
                    })
                }
            })
        }
    })
})

router.delete('/delete_jig/:JigID', (req, res, next) => {
    let JigID = req.params.JigID;
    let DeleteJig = `DELETE PrintingJig WHERE JigID=${JigID}`;
    dbCon.query(DeleteJig, (err) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send('Successfully delete jig');
        }
    })
})

module.exports = router;
