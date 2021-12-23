const express = require('express');
const dbCon = require('../../lib/db');
const router = express.Router();

router.get('/part', (req, res, next) => {
    let SelectPart = 'SELECT * FROM MasterPart order by PartCode';
    dbCon.query(SelectPart, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/customer', (req, res) => {
    let selectCustomer = `SELECT * FROM masterCustomer order by CustomerName`;
    dbCon.query(selectCustomer, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})


router.get('/mold', (req, res, next) => {
    let SelectMold = 'SELECT * FROM MasterMold ORDER BY BasicMold';
    dbCon.query(SelectMold, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/inj_mat', (req, res, next) => {
    let SelectInjMat = 'SELECT * FROM MasterInjectionMaterial ORDER BY MFG';
    dbCon.query(SelectInjMat, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/hot_stamp_mat', (req, res, next) => {
    let SelectHotStampMat = 'SELECT * FROM MasterHotStampMaterial MFG';
    dbCon.query(SelectHotStampMat, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/printing_box', (req, res, next) => {
    let SelectBox = 'SELECT * FROM MasterInkQty';
    dbCon.query(SelectBox, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})


//use in dropdown Spray, Printing, Welding
router.get('/color', (req, res, next) => {
    let SelectColor = 'SELECT * FROM MasterColorMaterial ORDER By ColorName';
    dbCon.query(SelectColor, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

router.get('/hardener', (req, res, next) => {
    let SelectHardener = 'SELECT * FROM MasterHardenerMaterial ORDER BY HardenerName';
    dbCon.query(SelectHardener, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

router.get('/thinner', (req, res, next) =>{
    let SelectThinner = 'SELECT * FROM MasterThinnerMaterial ORDER BY ThinnerName';
    dbCon.query(SelectThinner, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

//=======================================================================Get Data
router.get('/part_data/:PartID', (req, res, next) => {
    let PartID = req.params.PartID;
    let SelectPart = `SELECT MP.PartID, MP.PartCode, MP.PartName, MP.Supplier, MP.AxPartNo, MasterReferenceNo.RefNo 
    FROM [MasterPart] MP
    LEFT JOIN PartReferentNoHistory ON MP.PartID = PartReferentNoHistory.PartID
    LEFT JOIN MasterReferenceNo ON PartReferentNoHistory.RefID = MasterReferenceNo.RefID
    WHERE MP.PartID = ${PartID}`;
    dbCon.query(SelectPart, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
}) //! beware PartID is related to more than 1 RefNo

router.get('/mold_data/:MoldID', (req, res, next) => {
    let MoldID = req.params.MoldID;
    let SelectMold = `SELECT  MM.MoldID, MM.BasicMold, MM.DieNo, MM.JigNo, MM.AXMoldNo, MasterMachine.MachineNo
    FROM [MasterMold] MM
    LEFT JOIN MoldMachine ON MM.MoldID = MoldMachine.MoldID
    LEFT JOIN MasterMachine ON MoldMachine.MachineID = MasterMachine.MachineID
    WHERE MoldID = ${MoldID}`;
    dbCon.query(SelectMold, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

router.get('/hot_stamp/McType', (req, res) => {
    let selectMcType = `SELECT * FROM ProcessHotStampMcType`;
    dbCon.query(selectMcType, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

router.get('/spray/McType', (req, res) => {
    let selectMcType = `SELECT * FROM ProcessSprayMcType`;
    dbCon.query(selectMcType, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

router.get('/packing/type', (req, res) => {
    let selectPackingType = `SELECT * FROM PackingType`
    dbCon.query(selectPackingType, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

router.get('/packing/delivery', (req, res) => {
    let selectPackingDelivery = `SELECT * FROM PackingDelivery`
    dbCon.query(selectPackingDelivery, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

module.exports = router;