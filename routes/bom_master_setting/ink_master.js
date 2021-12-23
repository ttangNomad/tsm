const express = require('express');
const router = express.Router();
const dbCon = require('../../lib/db');

router.get('/data', (req, res) => {
    let SelectInk = `SELECT
	row_number() over(order by InkQtyID desc) as 'index',
	* FROM MasterInkQty`;
    dbCon.query(SelectInk, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.post('/add', (req, res) => {
    let Size = req.body.Size;
    let InkTray = req.body.InkTray;
    let InsertInk = `INSERT INTO MasterInkQty(Size, InkTray) VALUES('${Size}', ${InkTray})`;
    dbCon.query(InsertInk, (err) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(201).send({message: 'Successfully add Ink'});
        }
    })
})

router.put('/edit/:InkQtyID', (req, res) => {
    let InkQtyID = req.params.InkQtyID;
    let Size = req.body.Size;
    let InkTray = req.body.InkTray;
    let UpdateInk = `UPDATE MasterInkQty SET Size='${Size}', InkTray=${InkTray} WHERE InkQtyID = ${InkQtyID} `;
    dbCon.query(UpdateInk, (err) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send({message: `Successfully edit Ink`});
        }
    })
})

router.delete('/delete/:InkQtyID', (req, res) => {
    let InkQtyID = req.params.InkQtyID;
    let DeleteInk = `DELETE FROM MasterInkQty WHERE InkQtyID = ${InkQtyID} `;
    dbCon.query(DeleteInk, (err) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send({message: `Successfully delete Ink`});
        }
    })
})

module.exports = router;