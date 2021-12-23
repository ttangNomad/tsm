const express = require('express');
const router = express.Router();
const dbCon = require('../../lib/db');

router.get('/data', (req, res) => {
    let SelectMold = `SELECT
	row_number() over(order by a.MoldID desc) as 'index'
	,a.MoldID, a.BasicMold, a.DieNo,
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
    c.Operator, a.AXMoldNo
    FROM [MasterMold] a
    LEFT JOIN [MoldJig] b ON a.MoldID = b.MoldID
    LEFT JOIN [ManPower] c ON a.ManPowID = c.ManPowID
    LEFT JOIN [MoldMachine] d ON a.MoldID = d.MoldID
    LEFT JOIN [MasterMachine] e ON d.MachineID = e.MachineID
    GROUP BY a.MoldID, a.BasicMold, a.DieNo, c.Operator, a.AXMoldNo
    
    `;
    dbCon.query(SelectMold, (err, rows) => {
        if (err) {
            res.status(500).send({message: `${err}`})
        } else {
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/jig_no/:MoldID', (req, res) => {
    let MoldID = req.params.MoldID;
    let SelectJigNo = `SELECT
    row_number() over(order by MoldJigID desc) as 'index',
    MoldJigID, JigNo FROM MoldJig WHERE MoldID = '${MoldID}'`;
    dbCon.query(SelectJigNo, (err, rows) => {
        if (err) {
            res.status(500).send({message: `${err}`})
        } else {
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/machine/:MoldID', (req, res) => {
    let MoldID = req.params.MoldID;
    let SelectMachineNo = `SELECT
    row_number() over(order by b.MoldMCID desc) as 'index',
    b.MoldMCID, a.MachineNo, a.MCSize,a.MachineID, b.IsDefault
    FROM [MasterMachine] a
    LEFT JOIN [MoldMachine] b ON b.MachineID = a.MachineID
    WHERE MoldID = ${MoldID}`;
    dbCon.query(SelectMachineNo, (err, rows) => {
        if (err) {
            res.status(500).send({message: `${err}`})
        } else {
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

router.get('/machine_no', (req, res) => {
    let SelectMachineNo = 'SELECT MachineNo, MachineID FROM MasterMachine ORDER by MachineID';
    dbCon.query(SelectMachineNo, (err, rows) => {
        if (err) {
            res.status(500).send({message: `${err}`});
        } else {
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

router.post('/add_mold', (req, res) => {
    let BasicMold = req.body.BasicMold;
    let AXMoldNo = req.body.AXMoldNo;
    let DieNo = req.body.DieNo;
    let ManPower = req.body.ManPower;
    let InsertManPower = `INSERT INTO ManPower(Operator) VALUES('${ManPower}')`;
    let SelectManPowerID = `SELECT ManPowID FROM ManPower ORDER By ManPowID desc`;
    let CheckMold = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MasterMold
         WHERE BasicMold = '${BasicMold}' AND DieNo = '${DieNo}'
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(CheckMold, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate BasicMold With DieNo.'})
            } else{
                dbCon.query(InsertManPower, (err) => {
                    if (err) {
                        res.status(500).send({message: `${err}`})
                    } else {
                        dbCon.query(SelectManPowerID, (err, rows) => {
                            if (err) {
                                res.status(500).send({message: `${err}`})
                            } else {
                                let ManPowID = rows.recordset[0].ManPowID
                                let InsertMold = `INSERT INTO MasterMold(BasicMold, DieNo, AXMoldNo, ManPowID) VALUES('${BasicMold}', '${DieNo}', '${AXMoldNo}', ${ManPowID})`;
                                dbCon.query(InsertMold, (err) => {
                                    if (err) {
                                        res.status(500).send({message: `${err}`})
                                    } else {
                                        let SelectLatest = `SELECT * FROM MasterMold ORDER BY MoldID desc`;
                                        dbCon.query(SelectLatest, (err, row) => {
                                            if(err){
                                                res.status(500).send({message: `${err}`});
                                            } else{
                                                let MoldID = row.recordset[0].MoldID;
                                                res.status(201).send({message: 'Successfully add Mold', MoldID: MoldID});
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
    })
})

router.post('/add_jig_no/:MoldID', (req, res) => {
    let MoldID = req.params.MoldID;
    let JigNo = req.body.JigNo;
    let InsertJigNo = `INSERT INTO MoldJig(MoldID, JigNo) VALUES('${MoldID}', '${JigNo}')
    `;
    let CheckJig = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MoldJig
         WHERE JigNo = '${JigNo}' AND MoldID = ${MoldID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(CheckJig, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate JigNo'})
            } else{;
                dbCon.query(InsertJigNo, (err) => {
                    if (err) {
                        res.status(500).send({message: `${err}`})
                    } else {
                        res.status(201).send({message: `Successfully add JigNo`});
                    }
                });
            }
        }
    })
})

router.post('/add_machine_no/:MoldID', (req, res) => {
    let MoldID = req.params.MoldID;
    let MachineID = req.body.MachineID;
    let InsertMachineID = `INSERT INTO MoldMachine(MoldID, MachineID) VALUES('${MoldID}', '${MachineID}')`;
    let CheckMachine = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MoldMachine
         WHERE MachineID = '${MachineID}' AND MoldID = ${MoldID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;

    dbCon.query(CheckMachine, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate Machine'})
            } else{
                dbCon.query(InsertMachineID, (err) => {
                    if (err) {
                        res.status(500).send({message: `${err}`});
                    } else {
                        res.status(201).send({message: `Successfully add MachineNo`});
                    }
                })
            }
        }
    })
})

router.put('/edit_mold/:MoldID', (req, res) => {
    let MoldID = req.params.MoldID;
    let BasicMold = req.body.BasicMold;
    let AXMoldNo = req.body.AXMoldNo;
    let DieNo = req.body.DieNo;
    let ManPower = req.body.ManPower;
    let UpdateMold = `UPDATE MasterMold SET BasicMold='${BasicMold}', AXMoldNo='${AXMoldNo}', DieNo='${DieNo}' WHERE MoldID = '${MoldID}'`;
    let SelectManPowerID = `SELECT ManPowID FROM MasterMold WHERE MoldID = '${MoldID}'`;
    let CheckMold = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MasterMold
         WHERE BasicMold = '${BasicMold}' AND DieNo = '${DieNo}' AND NOT MoldID = ${MoldID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(CheckMold, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate BasicMold with DieNo.'})
            } else{
                dbCon.query(UpdateMold, (err) => {
                    if (err) {
                        res.status(500).send({message: `${err}`});
                    }
                })
                dbCon.query(SelectManPowerID, (err, rows) => {
                    if (err) {
                        res.status(500).send({message: `${err}`})
                    } else{
                        let ManPowID = rows.recordset[0].ManPowID;
                        let UpdateManPower = `UPDATE ManPower SET Operator=${ManPower} WHERE ManPowID=${ManPowID}`;
                        dbCon.query(UpdateManPower, (err) => {
                            if(err){
                                res.status(500).send({message: `${err}`});
                            } else{
                                res.status(200).send({message: `Successfully edit Mold`});
                            }
                        })
                    }
                })
            }
        }
    })
})


router.put('/set_default/:MoldMCID', (req, res) => {
    let MoldMCID = req.params.MoldMCID;
    let MoldID = req.body.MoldID;
    let SetDefaultFalse = `UPDATE MoldMachine SET IsDefault = 0 WHERE MoldID = ${MoldID}`;
    let SetDefaultTrue = `UPDATE MoldMachine SET IsDefault = 1 WHERE MoldMCID = '${MoldMCID}'`;
    dbCon.query(SetDefaultFalse, (err) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else {
            dbCon.query(SetDefaultTrue, (err) => {
                if(err) {
                    res.status(500).send({message: `${err}`})
                } else {
                    res.status(200).send({message: 'Successfully set default'});
                }
            })
        }
    })
})

router.delete('/delete_mold/:MoldID', (req, res) => {
    let MoldID = req.params.MoldID;
    let DeleteMold = `DELETE FROM MasterMold WHERE MoldID = ${MoldID} `;
    let SelectManPowID = `SELECT ManPowID FROM MasterMold WHERE MoldID = ${MoldID}`;
    dbCon.query(SelectManPowID, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            let ManPowID = row.recordset[0].ManPowID;
            let DeleteManPower = `DELETE FROM ManPower WHERE ManPowID = ${ManPowID}`;
            dbCon.query(DeleteManPower, (err) => {
                if(err){
                    res.status(500).send({message: `${err}`})
                } else{
                    dbCon.query(DeleteMold, (err) => {
                        if(err){
                            res.status(500).send({message: `${err}`})
                        }else{
                            res.status(200).send({message: `Successfully delete Mold`});
                        }
                    })
                }
            })
        }
    })
})

router.delete('/delete_jig/:MoldJigID', (req, res) => {
    let MoldJigID = req.params.MoldJigID;
    let DeleteMoldJig = `DELETE MoldJig WHERE MoldJigID='${MoldJigID}'`;
    if(MoldJigID=='null'){
        res.status(400).send({message: 'Please select Jig'})
    } else{
        dbCon.query(DeleteMoldJig, (err) => {
            if(err){
                res.status(500).send({message: `${err}`})
            } else{
                res.status(200).send({message: `Successfully delete JigNo`});
            }
        })
    }
})

router.delete('/delete_machine/:MoldMCID', (req, res) => {
    let MoldMCID = req.params.MoldMCID;
    let DeleteMoldMachine = `DELETE MoldMachine WHERE MoldMCID='${MoldMCID}'`;
    if(MoldMCID=='null'){
        res.status(400).send({message: 'Please select Machine'})
    } else{
        dbCon.query(DeleteMoldMachine, (err) => {
            if(err){
                    res.status(500).send({message: `${err}`})
            } else{
                res.status(200).send({message: `Successfully delete MachineNo`});
            }
        })
    }
})

module.exports = router;
