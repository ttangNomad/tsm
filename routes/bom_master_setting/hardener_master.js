const express = require('express');
const router = express.Router();
const dbCon = require('../../lib/db');

router.get('/data', (req, res) => {
    let SelectHardener = `SELECT
        row_number() over(order by HardenerID desc) as 'index',
        * FROM MasterHardenerMaterial`;
    dbCon.query(SelectHardener, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.post('/add', (req, res) => {
    let HardenerName = req.body.HardenerName;
    let SupplyMatl = req.body.SupplyMatl;
    let InsertHardener = `INSERT INTO MasterHardenerMaterial(HardenerName, SupplyMatl) VALUES('${HardenerName}','${SupplyMatl}')`;
    let CheckHardener = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MasterHardenerMaterial
         WHERE HardenerName = '${HardenerName}'
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(CheckHardener, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate HardenerMaterial.'})
            } else{
                dbCon.query(InsertHardener, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`})
                    }else{
                        res.status(201).send({message: 'Successfully add Hardener'});
                    }
                })
            }
        }
    })
})

router.put('/edit/:HardenerID', (req, res) => {
    let HardenerID = req.params.HardenerID;
    let HardenerName = req.body.HardenerName;
    let SupplyMatl = req.body.SupplyMatl;
    let UpdateHardener = `UPDATE MasterHardenerMaterial SET HardenerName='${HardenerName}', SupplyMatl='${SupplyMatl}' WHERE HardenerID = ${HardenerID} `;
    let CheckHardener = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MasterHardenerMaterial
         WHERE HardenerName = '${HardenerName}' AND NOT HardenerID = ${HardenerID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(CheckHardener, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate HardenerMaterial.'})
            } else{
                dbCon.query(UpdateHardener, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`})
                    }else{
                        res.status(200).send({message: `Successfully edit Hardener`});
                    }
                })
            }
        }
    })
})

router.delete('/delete/:HardenerID', (req, res) => {
    let HardenerID = req.params.HardenerID;
    let DeleteHardener = `DELETE FROM MasterHardenerMaterial WHERE HardenerID = ${HardenerID} `;
    dbCon.query(DeleteHardener, (err) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send({message: `Successfully delete Hardener`});
        }
    })
})

module.exports = router;