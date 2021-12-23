const express = require('express');
const router = express.Router();
const dbCon = require('../../lib/db');



router.get('/spray_list/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let SelectSparyList = `SELECT
	row_number() over(order by a.SprayID desc) as 'index',
	a.SprayID,
    (
        SELECT PartCode FROM MasterPart WHERE a.PartID_IN = MasterPart.PartID
    ) AS 'PartIN',
    (
        SELECT PartCode FROM MasterPart WHERE a.PartID_OUT = MasterPart.PartID
    ) AS 'PartOUT',
    a.MFG, a.PcsHr, a.Viscosity, a.InkLife, b.McTypeName, a.McTypeID, ManPower.Operator, a.PartID_IN, a.PartID_OUT
    FROM [ProcessSpray] a
    LEFT JOIN ManPower ON a.ManPowID = ManPower.ManPowID
	LEFT JOIN [ProcessSprayMcType] b ON a.McTypeID = b.McTypeID
    WHERE a.RefID = ${RefID}`;
    dbCon.query(SelectSparyList, (err, rows) => {
        if(err) {
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/mixing_ratio/:SprayID', (req, res, next) => {
    let SprayID = req.params.SprayID;
    let SelectMixingRatio = `SELECT PS.SprayID, PS.ColorID, MCM.ColorName, PS.HardenerID, MHM.HardenerName, PS.ThinnerID, MTM.ThinnerName, PS.MixRatioC, PS.MixRatioH, PS.MixRatioT, PS.MatPerPcsC, PS.MatPerPcsH, PS.MatPerPcsT
    FROM [ProcessSpray] PS
    LEFT JOIN [MasterColorMaterial] MCM ON PS.ColorID = MCM.ColorID
    LEFT JOIN [MasterHardenerMaterial] MHM ON PS.HardenerID = MHM.HardenerID
    LEFT JOIN [MasterThinnerMaterial] MTM ON PS.ThinnerID = MTM.ThinnerID
    WHERE PS.SprayID = ${SprayID}`;
    dbCon.query(SelectMixingRatio, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/mixing_new/:SprayID', (req, res, next) =>{
    let SprayID = req.params.SprayID;
    let SelectMixing = `SELECT 'Color' AS 'Material',
        CASE
            WHEN a.ColorID IS NULL THEN ''
            ELSE a.ColorID
        END AS 'ID',
        b.ColorName AS 'Code', a.MixRatioC, a.MatPerPcsC
    FROM ProcessSpray a
    LEFT JOIN MasterColorMaterial b ON a.ColorID = b.ColorID
    WHERE a.SprayID = ${SprayID}
    UNION

    SELECT 'Hardener' AS 'Material',
        CASE
            WHEN a.HardenerID IS NULL THEN ''
            ELSE a.HardenerID
        END AS 'ID',
        b.HardenerName As 'Code', a.MixRatioH, a.MatPerPcsH
    FROM ProcessSpray a
    LEFT JOIN MasterHardenerMaterial b ON a.HardenerID = b.HardenerID
    WHERE a.SprayID = ${SprayID}
    UNION

    SELECT 'Thinner' AS 'Material',
        CASE
            WHEN a.ThinnerID IS NULL THEN ''
            ELSE a.ThinnerID
        END AS 'ID',
        b.ThinnerName AS 'Code', a.MixRatioT, a.MatPerPcsT
    From ProcessSpray a
    LEFT JOIN MasterThinnerMaterial b on a.ThinnerID = b.ThinnerID
    WHERE a.SprayID = ${SprayID}
    `;
    dbCon.query(SelectMixing, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

router.get('/jig_list/:SprayID', (req, res, next) => {
    let SprayID = req.params.SprayID;
    let SelectJigList = `SELECT
    row_number() over(order by JigID desc) as 'index',
    JigID, JigNo FROM SprayJig WHERE SprayID = ${SprayID}`;
    dbCon.query(SelectJigList, (err, rows)  => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

//============================================================================ADD

router.post('/add_spray/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let PartID_IN = req.body.PartID_IN;
    let PartID_OUT = req.body.PartID_OUT;
    let MFG = req.body.MFG;
    let PcsHr =  req.body.PcsHr;
    let Viscosity = req.body.Viscosity;
    let InkLife = req.body.InkLife;
    let McTypeID = req.body.McTypeID;
    let ManPower = req.body.ManPower;
    let SelectProcessIndex = `SELECT ProcessIndex, RefID FROM ProcessInjection WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessHotStamp WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessAssembly WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessSpray WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessPrinting WHERE RefID = ${RefID}
    UNION ALL SELECT ProcessIndex,RefID FROM ProcessWelding WHERE RefID = ${RefID}
    ORDER BY ProcessIndex desc`;
    let AddMan = new Promise(function(resolve, reject) {
        let InsertManPower = `INSERT INTO ManPower(Operator) VALUES(${ManPower})`;
        dbCon.query(InsertManPower, (err) => {
            if(err){
                res.status(500).send({message: `${err}`});
            } else{
                resolve();
            }
        })
    })

    let Addspray = new Promise(function(resolve, reject){
        AddMan.then(function(){
            let SelectManPowID = 'SELECT ManPowID FROM ManPower ORDER BY ManPowID desc';
            dbCon.query(SelectManPowID, (err, rows) => {
                if(err){
                    res.status(500).send({message: `${err}`});
                } else{
                    let ManPowID = rows.recordset[0].ManPowID;
                    dbCon.query(SelectProcessIndex, (err, row) =>{
                        if(err){
                            res.status(500).send({message: `${err}`});
                        } else{
                            if(!row.recordset[0]){
                                var ProcessIndex = 1;
                            } else{
                                var ProcessIndex = row.recordset[0].ProcessIndex + 1 ;
                            }
                            let InsertSpray = `INSERT INTO ProcessSpray(PartID_IN, PartID_OUT, MFG, PcsHr, Viscosity, InkLife, McTypeID, ProcessIndex, RefID, ManPowID) VALUES(${PartID_IN}, ${PartID_OUT}, '${MFG}', ${PcsHr}, '${Viscosity}', ${InkLife}, '${McTypeID}', ${ProcessIndex}, ${RefID}, ${ManPowID})`;
                            dbCon.query(InsertSpray, (err) => {
                                if(err){
                                    res.status(500).send({message: `${err}`});
                                } else{
                                    res.status(201).send({message: 'Successfully add Spray'})
                                }
                            })
                        }
                    })
                }
            })
        })
    })
})

router.post('/add_jig/:SprayID', (req, res, next) => {
    let SprayID = req.params.SprayID;
    let JigNo = req.body.JigNo;
    let InsertJig = `INSERT INTO SprayJig(SprayID, JigNo) VALUES(${SprayID}, '${JigNo}')`;
    let checkDuplicate = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM SprayJig
         WHERE JigNo = '${JigNo}' AND SprayID = ${SprayID}
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

//==========================================================================EDIT
router.put('/edit_spray/:SprayID', (req, res, next) => {
    let SprayID = req.params.SprayID;
    let PartID_IN = req.body.PartID_IN;
    let PartID_OUT = req.body.PartID_OUT;
    let MFG = req.body.MFG;
    let PcsHr = req.body.PcsHr;
    let Viscosity = req.body.Viscosity;
    let InkLife = req.body.InkLife;
    let McTypeID = req.body.McTypeID;
    let ManPower = req.body.ManPower;
    let UpdateSpray = `UPDATE ProcessSpray SET PartID_IN=${PartID_IN}, PartID_OUT=${PartID_OUT}, MFG='${MFG}', PcsHr=${PcsHr}, Viscosity='${Viscosity}', InkLife=${InkLife}, McTypeID='${McTypeID}' WHERE SprayID=${SprayID}`;
    dbCon.query(UpdateSpray, (err) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            let SelectManPowID = `SELECT ManPowID FROM ProcessSpray WHERE SprayID = ${SprayID}`;
            dbCon.query(SelectManPowID, (err, rows) => {
                if(err){
                    res.status(500).send({message: `${err}`});
                } else{
                    let ManPowID = rows.recordset[0].ManPowID;
                    let UpdateManPower = `UPDATE ManPower SET Operator = ${ManPower} WHERE ManPowID=${ManPowID}`;
                    dbCon.query(UpdateManPower, (err) => {
                        if(err){
                            res.status(500).send({message: `${err}`});
                        } else{
                            res.status(200).send({message: 'Successfully edit spray'})
                        }
                    })
                }
            })
        }
    })
})

router.put('/edit_mixing/:SprayID', (req, res, next) => {
    let SprayID = req.params.SprayID;
    let ColorID = req.body.ColorID;
    let HardenerID = req.body.HardenerID;
    let ThinnerID = req.body.ThinnerID;
    let MixRatioC = req.body.MixRatioC;
    let MixRatioH = req.body.MixRatioH;
    let MixRatioT = req.body.MixRatioT;
    let MatPerPcsC = req.body.MatPerPcsC;
    let MatPerPcsH = req.body.MatPerPcsH;
    let MatPerPcsT = req.body.MatPerPcsT;
    let UpdateMixing = `UPDATE ProcessSpray SET ColorID=${ColorID}, HardenerID=${HardenerID}, ThinnerID=${ThinnerID}, MixRatioC=${MixRatioC}, MixRatioH=${MixRatioH}, MixRatioT=${MixRatioT},
    MatPerPcsC=${MatPerPcsC}, MatPerPcsH=${MatPerPcsH}, MatPerPcsT=${MatPerPcsT} WHERE SprayID=${SprayID}`;
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
    let SprayID = req.body.SprayID;
    let UpdateJig = `UPDATE SprayJig SET JigNo = '${JigNo}' WHERE JigID = ${JigID}`
    let checkDuplicate = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM SprayJig
         WHERE JigNo = '${JigNo}' AND SprayID = ${SprayID} AND NOT JigID = ${JigID}
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

//===========================================================================DELETE
router.delete('/delete_spray/:SprayID', (req, res, next) => {
    let SprayID = req.params.SprayID;
    let DeleteSpray = `DELETE ProcessSpray WHERE SprayID = ${SprayID}`;
    let SelectManPowID = `SELECT ManPowID FROM ProcessSpray WHERE SprayID = ${SprayID}`;
    dbCon.query(SelectManPowID, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            let ManPowID = row.recordset[0].ManPowID;
            let DeleteManPower = `DELETE FROM ManPower WHERE ManPowID = ${ManPowID}`;
            dbCon.query(DeleteSpray, (err) => {
                if(err){
                    res.status(500).send({message: `${err}`})
                } else{
                    dbCon.query(DeleteManPower, (err) => {
                        if(err){
                            res.status(500).send({message: `${err}`});
                        } else{
                            res.status(200).send({message: 'Successfully delete spray'});
                        }
                    })
                }
            })
        }
    })
})

router.delete('/delete_jig/:JigID', (req, res, next) => {
    let JigID = req.params.JigID;
    let DeleteJig = `DELETE SprayJig WHERE JigID=${JigID}`;
    dbCon.query(DeleteJig, (err) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send({message: 'Successfully delete jig'});
        }
    })
})

module.exports = router;