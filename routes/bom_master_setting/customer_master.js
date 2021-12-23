const express = require('express');
const router = express.Router();
const dbCon = require('../../lib/db');

router.get('/data', (req, res) => {
    let SelectCustomer = `SELECT
    row_number() over(order by CustomerID) as 'index',
    * FROM MasterCustomer`;
    dbCon.query(SelectCustomer, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

router.post('/add', (req, res) => {
    let CustomerName = req.body.CustomerName;
    let InsertCustomer = `INSERT INTO MasterCustomer(CustomerName) VALUES('${CustomerName}')`;
    dbCon.query(InsertCustomer, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(201).send({message: 'Successfully add customer'})
        }
    })
})

router.put('/edit/:CustomerId', (req, res) => {
    let CustomerId = req.params.CustomerId;
    let CustomerName = req.body.CustomerName;
    let UpdateCustomer = `UPDATE MasterCustomer SET CustomerName = '${CustomerName}' WHERE CustomerId = ${CustomerId}`;
    dbCon.query(UpdateCustomer, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send({message: `Successfully edit customer`})
        }
    })
})

router.delete('/delete/:CustomerId', (req, res) => {
    let CustomerId = req.params.CustomerId;
    let UpdateCustomer = `UPDATE MasterReferenceNo SET CustomerID = null WHERE CustomerID = ${CustomerId}`;
    let DeleteCustomer = `DELETE FROM MasterCustomer WHERE CustomerID = ${CustomerId}`;
    dbCon.query(UpdateCustomer, (err) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            dbCon.query(DeleteCustomer, (err) => {
                if(err){
                    res.status(500).send({message: `${err}`})
                } else{
                    res.status(200).send({message: 'Successfully delete customer'})
                }
            })
        }
    })
})

module.exports = router;
