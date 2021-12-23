const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const dbCon = require('../../lib/db');

router.get('/data', (req, res) => {
    let SelectColor = `SELECT
        row_number() over(order by ColorID desc) as 'index',
        * FROM MasterColorMaterial`;
    dbCon.query(SelectColor, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.post('/add', (req, res) => {
    let ColorName = req.body.ColorName;
    let SupplyMatl = req.body.SupplyMatl;
    let InsertColor = `INSERT INTO MasterColorMaterial(ColorName, SupplyMatl) VALUES('${ColorName}', '${SupplyMatl}')`;
    let CheckColor = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MasterColorMaterial
         WHERE ColorName = '${ColorName}'
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(CheckColor, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate Ink No.'})
            } else{
                dbCon.query(InsertColor, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`})
                    }else{
                        res.status(201).send({message: 'Successfully add ColorMaterial'});
                    }
                })
            }
        }
    })
})

router.put('/edit/:ColorID', (req, res) => {
    let ColorID = req.params.ColorID;
    let ColorName = req.body.ColorName;
    let SupplyMatl = req.body.SupplyMatl;
    let UpdateColor = `UPDATE MasterColorMaterial SET ColorName='${ColorName}', SupplyMatl='${SupplyMatl}' WHERE ColorID = ${ColorID} `;
    let CheckColor = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MasterColorMaterial
         WHERE ColorName = '${ColorName}' AND NOT ColorID = ${ColorID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(CheckColor, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            if(row.recordset[0].check){
                console.log(row.recordset[0].check);
                res.status(400).send({message: 'Duplicate Ink No.'})
            } else{
                dbCon.query(UpdateColor, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`})
                    }else{
                        res.status(200).send({message: `Successfully edit Color`});
                    }
                })
            }
        }
    })
})

router.delete('/delete/:ColorID', (req, res) => {
    let ColorID = req.params.ColorID;
    let DeleteColor = `DELETE FROM MasterColorMaterial WHERE ColorID = ${ColorID} `;
    dbCon.query(DeleteColor, (err) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send({message: `Successfully delete Color`});
        }
    })
})

module.exports = router;