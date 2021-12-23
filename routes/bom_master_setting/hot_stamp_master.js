const express = require('express');
const router = express.Router();
const dbCon = require('../../lib/db');

router.get('/data', (req, res) => {
    let SelectHotStampMat = `SELECT
	row_number() over(order by HSMID desc) as 'index',
	* FROM MasterHotStampMaterial`;
    dbCon.query(SelectHotStampMat, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.post('/add', (req, res) => {
    let MFG = req.body.MFG;
    let FoilCode = req.body.FoilCode;
    let SupplyMatl = req.body.SupplyMatl;
    let InsertHotStamp = `INSERT INTO MasterHotStampMaterial(MFG, FoilCode, SupplyMatl) VALUES('${MFG}','${FoilCode}','${SupplyMatl}')`;
    let CheckHotMat = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MasterHotStampMaterial
         WHERE FoilCode = '${FoilCode}'
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(CheckHotMat, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate Material.'})
            } else{
                dbCon.query(InsertHotStamp, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`})
                    }else{
                        res.status(201).send({message: `Successfully add HotStamp Mat'l`});
                    }
                })
            }
        }
    })
})

router.put('/edit/:HSMID', (req, res) => {
    let HSMID = req.params.HSMID;
    let MFG = req.body.MFG;
    let FoilCode = req.body.FoilCode;
    let SupplyMatl = req.body.SupplyMatl;
    let UpdateHotStamp = `UPDATE MasterHotStampMaterial SET MFG='${MFG}', FoilCode='${FoilCode}',SupplyMatl='${SupplyMatl}' WHERE HSMID = ${HSMID} `;
    let CheckHotMat = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MasterHotStampMaterial
         WHERE FoilCode = '${FoilCode}' AND NOT HSMID =${HSMID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(CheckHotMat, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate Material.'})
            } else{
                dbCon.query(UpdateHotStamp, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`})
                    }else{
                        res.status(200).send({message: `Successfully edit HotStamp Mat'l`});
                    }
                })
            }
        }
    })
})

router.delete('/delete/:HSMID', (req, res) => {
    let HSMID = req.params.HSMID;
    let DeleteHotStamp = `DELETE FROM MasterHotStampMaterial WHERE HSMID = ${HSMID} `;
    dbCon.query(DeleteHotStamp, (err) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send({message: `Successfully delete HotStamp Mat'l`});
        }
    })
})

module.exports = router;