const express = require('express');
const router = express.Router();
const dbCon = require('../../../lib/db');

router.get('/:Machine_No', (req, res) => { //! which plan
    let MachineNo = req.params.Machine_No;
    let month = req.body.month;
    let year = req.body.year;
    let selectInjPlan = `SELECT
    ROW_NUMBER() over(order by Planning_No) as 'index', (Planning_No + Planning_Revise_No) as 'Planing', *
    FROM Plan_Inject`;
    dbCon.query(selectInjPlan, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/list', (req, res) => {
    let selectPlan = `SELECT (Planning_No + Planning_Revise_No) as 'Planing', Machine_No, Part_Code, Part_Name, Issued_Date FROM Plan_Inject`;
    dbCon.query(selectPlan, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.put('/edit/:Planning_No', (req, res) => { //! not finish
    let PlanningNo = req.params.Planning_No;
    let PlanType = req.body.PlanType;
    let CustomerName = req.body.CustomerName;
    let PartCode = req.body.PartCode;
    let BasicMold = req.body.BasicMold;
    let Material = req.body.Material;
    let Virgin = req.body.Virgin;
    let Packing = req.body.Packing;
    let Delivery = req.body.Delivery;
    let updatePlan = `UPDATE Plan_Inject SET PlanType = '${PlanType}', Customer_Name = '${CustomerName}', Part_Code = '${PartCode}', BasicMold = '${BasicMold}', Material = '${Material}',
    Virgin = '${Virgin}', PackingTypeName = '${Packing}', PackingDeliveryName = '${Delivery}'`;
    dbCon.query(updatePlan, (err) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            let updatePartName;
        }
    })
})

router.delete('/delete/:Planning_No', (req, res) => {
    let Planning_No = req.params.Planning_No;
    let deletePlan = `DELETE FROM Plan_Inject WHERE Planning_No = ${Planning_No}`;
    dbCon.query(deletePlan, (err) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send({message: 'Successfully delete plan'});
        }
    })
})

router.get('/plan/:Planning_No', (req, res) => {
    let Planning_No = req.params.Planning_No;
    let selectPlan = `SELECT * FROM Plan_Inject`;
    dbCon.query(selectPlan, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

