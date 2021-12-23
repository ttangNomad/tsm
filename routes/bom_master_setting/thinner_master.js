const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const dbCon = require('../../lib/db');

router.get('/data', (req, res) => {
    let SelectThinner = `SELECT
	row_number() over(order by ThinnerID desc) as 'index',
	* FROM MasterThinnerMaterial`;
    dbCon.query(SelectThinner, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.post('/add', (req, res) => {
    let ThinnerName = req.body.ThinnerName;
    let SupplyMatl = req.body.SupplyMatl;
    let InsertThinner = `INSERT INTO MasterThinnerMaterial(ThinnerName, SupplyMatl) VALUES('${ThinnerName}', '${SupplyMatl}')`;
    let CheckThinner = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MasterThinnerMaterial
         WHERE ThinnerName = '${ThinnerName}'
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(CheckThinner, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate ThinnerMaterial.'})
            } else{
                dbCon.query(InsertThinner, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`})
                    }else{
                        res.status(201).send({message: `Successfully add Thinner`});
                    }
                })
            }
        }
    })
})

router.put('/edit/:ThinnerID', (req, res) => {
    let ThinnerID = req.params.ThinnerID;
    let ThinnerName = req.body.ThinnerName;
    let SupplyMatl = req.body.SupplyMatl;
    let UpdateThinner = `UPDATE MasterThinnerMaterial SET ThinnerName='${ThinnerName}', SupplyMatl='${SupplyMatl}' WHERE ThinnerID = ${ThinnerID} `;
    let CheckThinner = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MasterThinnerMaterial
         WHERE ThinnerName = '${ThinnerName}' AND NOT ThinnerID = ${ThinnerID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(CheckThinner, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate ThinnerMaterial'})
            } else{
                dbCon.query(UpdateThinner, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`})
                    }else{
                        res.status(200).send({message: `Successfully edit Thinner`});
                    }
                })
            }
        }
    })
})

router.delete('/delete/:ThinnerID', (req, res) => {
    let ThinnerID = req.params.ThinnerID;
    let DeleteThinner = `DELETE FROM MasterThinnerMaterial WHERE ThinnerID = ${ThinnerID} `;
    dbCon.query(DeleteThinner, (err) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send({mssage: `Successfully delete Thinner`});
        }
    })
})

module.exports = router;