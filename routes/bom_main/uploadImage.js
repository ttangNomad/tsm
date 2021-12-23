const express = require('express');
const dbCon = require('../../lib/db');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../public/images'),
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1]
        cb(null, 'image-' + Date.now() +'.'+ ext);
    }
})

const upload = multer({storage: storage}).single('partImage');

router.post('/upload/:RefID', (req, res) => {
    let RefID = req.params.RefID;

    upload(req, res,(err) => {
        if(err){
            console.log('error');
        } else{
            console.log('success');
            let image = "/images/" + req.file.filename;
            let UpdateImagePath = `UPDATE MasterReferenceNo SET PictureRootPath = '${image}' WHERE RefID = ${RefID}`;
            dbCon.query(UpdateImagePath, (err) => {
                if(err){
                    res.status(500).send({message: `${err}`})
                } else{
                    res.status(200).send({message: 'success upload image'})
                }
            })
        }
    })
})

router.get('/:RefID', (req, res) => {
    let RefID = req.params.RefID;
    let SelectPath = `SELECT PictureRootPath FROM MasterReferenceNo WHERE RefID = ${RefID}`;
    dbCon.query(SelectPath, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send(JSON.stringify(row.recordset[0]))
        }
    })
})


module.exports = router;