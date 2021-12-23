const express = require('express');
const router = express.Router();
const dbCon = require('../../lib/db');

router.get('/data', (req, res) => {
    let SelectMachine = `SELECT
        row_number() over(order by MachineID desc) as 'index',
        * FROM MasterMachine`;
    dbCon.query(SelectMachine, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.post('/add', (req, res) => {
    let MachineNo = req.body.MachineNo;
    let MCSize = req.body.MCSize;
    let InsertMachine = `INSERT INTO MasterMachine(MachineNo, MCSize) VALUES('${MachineNo}', '${MCSize}')`;
    let CheckMachine = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MasterMachine
         WHERE MachineNo = '${MachineNo}'
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(CheckMachine, (err, row) => {
        if(err){
            res.status(500).send({message})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate Machine.'})
            } else{
                dbCon.query(InsertMachine, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`})
                    }else{
                        res.status(201).send({message: 'Successfully add Machine'});
                    }
                })
            }
        }
    })
})

router.put('/edit/:MachineID', (req, res) => {
    let MachineID = req.params.MachineID;
    let MachineNo = req.body.MachineNo;
    let MCSize = req.body.MCSize;
    let UpdateMachine = `UPDATE MasterMachine SET MachineNo='${MachineNo}', MCSize=${MCSize} WHERE MachineID = ${MachineID} `;
    let CheckMachine = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MasterMachine
         WHERE MachineNo = '${MachineNo}' AND NOT MachineID = ${MachineID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(CheckMachine, (err, row) => {
        if(err){
            res.status(500).send({message})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate Machine.'})
            } else{
                dbCon.query(UpdateMachine, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`})
                    }else{
                        res.status(200).send({message: `Successfully edit Machine`});
                    }
                })
            }
        }
    })
})

router.delete('/delete/:MachineID', (req, res) => {
    let MachineID = req.params.MachineID;
    let DeleteMachine = `DELETE FROM MasterMachine WHERE MachineID = ${MachineID} `;
    dbCon.query(DeleteMachine, (err) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send({message: `Successfully delete Machine`});
        }
    })
})

module.exports = router;