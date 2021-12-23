const express = require('express');
const router = express.Router();
const dbCon = require('../../lib/db');


router.get('/data', (req, res, next) => {
    let SelectPart = `SELECT
	row_number() over(order by PartID desc) as 'index'
	,* FROM MasterPart`;
    dbCon.query(SelectPart,(err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})


router.post('/add', (req, res) => {
    let PartCode = req.body.PartCode;
    let PartName = req.body.PartName;
    let Supplier = req.body.Supplier;
    let SupplyMatl = req.body.SupplyMatl;
    let AxPartNo = req.body.AxPartNo;
    let InsertPartMaster = `INSERT INTO MasterPart(PartCode, PartName, Supplier, SupplyMatl, AxPartNo) VALUES('${PartCode}', '${PartName}','${Supplier}','${SupplyMatl}','${AxPartNo}')`;
    let CheckPart = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MasterPart
         WHERE PartCode = '${PartCode}'
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(CheckPart, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Already have this part code.'})
            } else{
                dbCon.query(InsertPartMaster, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`})
                    }else{
                        res.status(201).send({message: 'Successfully add Part'})
                    }
                })
            }
        }
    })
})

router.put('/edit/:PartID', (req, res) => {
    let PartID = req.params.PartID;
    let PartCode = req.body.PartCode;
    let PartName = req.body.PartName;
    let Supplier = req.body.Supplier;
    let SupplyMatl = req.body.SupplyMatl;
    let AxPartNo = req.body.AxPartNo;
    let UpdatePartMaster = `UPDATE MasterPart SET PartCode='${PartCode}', PartName='${PartName}', Supplier='${Supplier}', SupplyMatl='${SupplyMatl}', AxPartNo='${AxPartNo}' WHERE PartID = ${PartID} `;
    let CheckPart = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MasterPart
         WHERE PartCode = '${PartCode}' AND NOT PartID = ${PartID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(CheckPart, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'already have this part code.'})
            } else{
                dbCon.query(UpdatePartMaster, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`})
                    }else{
                        res.status(200).send({message: `Successfully edit Part`});
                    }
                })
            }
        }
    })
})

router.delete('/delete/:PartID', (req, res) => {
    let PartID = req.params.PartID;
    let DeletePartMaster = `DELETE FROM MasterPart WHERE PartID = ${PartID} `;
    dbCon.query(DeletePartMaster, (err) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send({message: `Successfully delete Part`})
        }
    })
})




module.exports = router;