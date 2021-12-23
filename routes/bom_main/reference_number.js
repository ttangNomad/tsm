const express = require('express');
const router = express.Router();
const dbCon = require('../../lib/db');


router.get('/ref', (req, res, next) => {
    let SelectRefNo = `SELECT
    row_number() over(order by a.RefID desc) as 'index',
    a.RefID, a.RefNo,a.CustomerID,
    SUBSTRING(
        (
            SELECT ('/' + RTRIM(MasterPart.PartCode))
            FROM PartReferentNoHistory
            LEFT JOIN MasterPart ON PartReferentNoHistory.PartID = MasterPart.PartID
            WHERE PartReferentNoHistory.RefID = a.RefID
            FOR XML Path('')
        )
    ,2,100) AS 'PartCode',
    SUBSTRING(
        (
            SELECT ('/' + RTRIM(MasterPart.PartName))
            FROM PartReferentNoHistory
            LEFT JOIN MasterPart ON PartReferentNoHistory.PartID = MasterPart.PartID
            WHERE PartReferentNoHistory.RefID = a.RefID
            FOR XML Path('')
        )
    ,2,100) AS 'PartName',
    d.CustomerName, a.Model, a.Status, a.IssueDate,
    SUBSTRING(
        (
            SELECT ('/' + RTRIM(MasterPart.AxPartNo))
            FROM PartReferentNoHistory
            LEFT JOIN MasterPart ON PartReferentNoHistory.PartID = MasterPart.PartID
            WHERE PartReferentNoHistory.RefID = a.RefID
            FOR XML Path('')
        )
    ,2,100) AS 'AxPartNo', CONVERT(nvarchar(max),a.Remark) AS 'Remark', CONVERT(nvarchar(max), a.Description) AS 'Description'
    FROM [MasterReferenceNo] a
    LEFT JOIN [PartReferentNoHistory] b ON b.RefID = a.RefID
    LEFT JOIN [MasterPart] c ON c.PartID = b.PartID
	LEFT JOIN [MasterCustomer] d ON a.CustomerId = d.CustomerId

    GROUP BY a.RefID, a.RefNo, a.Model, a.IssueDate, a.Status, d.CustomerName,a.CustomerID,
    CONVERT(nvarchar(max),a.Remark), CONVERT(nvarchar(max), a.Description)
    ORDER bY a.RefID desc`;
    dbCon.query(SelectRefNo, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        }else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/part_dropdown', (req, res, next) => {
    let SelectPart = 'SELECT PartID, PartCode FROM MasterPart ORDER by PartCode'
    dbCon.query(SelectPart, (err, rows) => {
        if(err){
            res.status(500).send({message : `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

router.get('/part_no/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let SelectPart = `SELECT
	row_number() over(order by c.PartID desc) as 'index',
	c.PartID, c.PartCode, c.PartName
    FROM [MasterReferenceNo] a
    INNER JOIN [PartReferentNoHistory] b ON a.RefID = b.RefID
    INNER JOIN [MasterPart] c ON b.PartID = c.PartID
    WHERE a.RefID = ${RefID}`;
    dbCon.query(SelectPart, (err,rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})


router.post('/add_ref', (req, res, next) => {
    let RefNo = req.body.RefNo;
    let Model = req.body.Model;
    let CustomerId = req.body.CustomerId;
    let Status = req.body.Status;
    let IssueDate = req.body.IssueDate;
    let Description = req.body.Description;
    let Remark = req.body.Remark;
    let InsertRef = `INSERT INTO MasterReferenceNo(RefNo, Model, CustomerId, Status, IssueDate, Description, Remark) VALUES('${RefNo}','${Model}','${CustomerId}','${Status}','${IssueDate}','${Description}','${Remark}')`
    let checkRefNo = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MasterReferenceNo
         WHERE RefNo = '${RefNo}'
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(checkRefNo, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate Ref.No.'})
            } else{
                dbCon.query(InsertRef, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`});
                    } else{
                        let SelectLatest =`SELECT RefID FROM MasterReferenceNo ORDER by RefID desc`;
                        dbCon.query(SelectLatest, (err, rows) => {
                            if(err){
                                res.status(500).send({message: `${err}`});
                            } else{
                                let RefID = rows.recordset[0].RefID;
                                res.status(201).send({message: 'Successfully add Ref.No.', RefID});
                            }
                        })
                    }
                })
            }
        }
    })
})

router.post('/add_part/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let PartID = req.body.PartID;
    let InsertPart = `INSERT INTO PartReferentNoHistory(RefID, PartID) VALUES(${RefID}, ${PartID})`;
    let CheckPart = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM PartReferentNoHistory
         WHERE PartID = '${PartID}' AND RefID = ${RefID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(CheckPart, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'This part is currently in this Ref.No.'})
            } else{
                dbCon.query(InsertPart, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`});
                    } else{
                        res.status(201).send({message: 'Successfully add PartID'});
                    }
                })
            }
        }
    })
})

router.put('/edit_ref/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let RefNo = req.body.RefNo;
    let Model = req.body.Model;
    let CustomerId = req.body.CustomerId;
    let Status = req.body.Status;
    let IssueDate = req.body.IssueDate;
    let Description = req.body.Description;
    let Remark = req.body.Remark;
    let UpdateRef = `UPDATE MasterReferenceNo SET RefNo='${RefNo}', Model='${Model}', CustomerId='${CustomerId}', Status='${Status}', IssueDate='${IssueDate}',
     Description='${Description}', Remark='${Remark}' WHERE RefID=${RefID}`;
     let checkRefNo = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM MasterReferenceNo
         WHERE RefNo = '${RefNo}' AND NOT RefID = ${RefID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(checkRefNo, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: `Duplicate Ref.No.`})
            } else{
                dbCon.query(UpdateRef, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`});
                    } else{
                        res.status(200).send({message: 'Successfully edit Reference'});
                    }
                })
            }
        }
    })
})

router.delete('/delete_ref/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let DeleteRef = `DELETE MasterReferenceNo WHERE RefID=${RefID}`;
    let DeletePart = `DELETE PartReferentNoHistory WHERE RefID=${RefID}`
    dbCon.query(DeletePart, (err) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            dbCon.query(DeleteRef, (err) => {
                if(err){
                    res.status(500).send({message: `${err}`});
                } else{
                    res.status(200).send({message: 'Successfully delete Reference'});
                }
            })
        }
    })
})

router.delete('/delete_part/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let PartID = req.body.PartID;
    let DeletePart = `DELETE PartReferentNoHistory WHERE RefID=${RefID} AND PartID=${PartID}`;
    if(PartID==null){
        res.status(400).send({message: 'Please select part'})
    } else{
        dbCon.query(DeletePart, (err) => {
            if(err){
                res.status(500).send({message: `${err}`});
            } else{
                res.status(200).send({message: 'Successfully delete PartID'});
            }
        })
    }
})



module.exports = router;