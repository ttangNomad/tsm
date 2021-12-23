const express = require('express');
const router = express.Router();
const dbCon = require('../../lib/db');

router.get('/data', (req, res) => {
    let SelectInjMat = `SELECT
	row_number() over(order by MaterialID desc) as 'index',
	* FROM MasterInjectionMaterial`;
    dbCon.query(SelectInjMat, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.post('/add', (req, res) => {
    let MFG = req.body.MFG;
    let Grade = req.body.Grade;
    let Code = req.body.Code;
    let Color = req.body.Color;
    let SupplyMatl = req.body.SupplyMatl;
    let InsertInjMatl = `INSERT INTO MasterInjectionMaterial(MFG, Grade, Code, Color, SupplyMatl) VALUES('${MFG}','${Grade}', '${Code}','${Color}','${SupplyMatl}')`;
    let CheckInjMat = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MasterInjectionMaterial
         WHERE Code = '${Code}'
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(CheckInjMat, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate Material'})
            } else{
                dbCon.query(InsertInjMatl, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`})
                    }else{
                        res.status(201).send({message: `Successfully add Injection Mat'l`});
                    }
                })
            }
        }
    })
})

router.put('/edit/:MaterialID', (req, res) => {
    let MaterialID = req.params.MaterialID;
    let MFG = req.body.MFG;
    let Grade = req.body.Grade;
    let Code = req.body.Code;
    let Color = req.body.Color;
    let SupplyMatl = req.body.SupplyMatl;
    let UpdateInjMatl = `UPDATE MasterInjectionMaterial SET MFG='${MFG}', Grade='${Grade}', Code='${Code}', Color='${Color}', SupplyMatl='${SupplyMatl}' WHERE MaterialID = ${MaterialID} `;
    let CheckInjMat = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MasterInjectionMaterial
         WHERE Code = '${Code}' AND NOT MaterialID = ${MaterialID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(CheckInjMat, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate Material'})
            } else{
                dbCon.query(UpdateInjMatl, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`})
                    }else{
                        res.status(200).send({message: `Successfully edit Injection Mat'l`});
                    }
                })
            }
        }
    })
})

router.delete('/delete/:MaterialID', (req, res) => {
    let MaterialID = req.params.MaterialID;
    let DeleteInjMatl = `DELETE FROM MasterInjectionMaterial WHERE MaterialID = ${MaterialID} `;
    dbCon.query(DeleteInjMatl, (err) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send({message: `Successfully delete Injection Mat'l`});
        }
    })
})

module.exports = router;