const express = require('express');
const router = express.Router();
const dbCon = require('../../../lib/db');

router.get('/machine', (req, res) => {
    dbCon.query('SELECT * FROM MasterMachine order by MachineNo', (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/part', (req, res) => {
    let selectPart = `SELECT * FROM MasterPart order by PartCode`;

})

router.get('/mold/:MachineID', (req, res) => {
    let MachineID = req.params.MachineID;
    let selectMold = `SELECT a.BasicMold
    FROM [MasterMold] a
    LEFT JOIN [MoldMachine] b ON a.MoldID = b.MoldID
    LEFT JOIN [MasterMachine] c ON b.MachineID = c.MachineID
    WHERE c.MachineID = ${MachineID}`;
    dbCon.query(selectMold, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/die/:BasicMold', (req, res) => {
    let BasicMold = req.params.BasicMold;
    let selectDieNo = `SELECT DieNo FROM MasterMold WHERE BasicMold = '${BasicMold}'`;
    dbCon.query(selectDieNo, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/material', (req, res) => {
})


module.exports = router;