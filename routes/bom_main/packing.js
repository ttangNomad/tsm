const express = require('express');
const router = express.Router();
const dbCon = require('../../lib/db');


router.get('/dropdown_part/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let SelectPartCode = `SELECT a.RefID, b.PartID, c.PartCode, c.PartName
    FROM [MasterReferenceNo] a
    LEFT JOIN [PartReferentNoHistory] b ON a.RefID = b.RefID
    LEFT JOIN [MasterPart] c ON b.PartID = c.PartID
    WHERE a.RefID = ${RefID}`;
    dbCon.query(SelectPartCode, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/dropdown_mold/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let SelectMold = `SELECT a.RefID, a.InjectionID, c.MoldID, c.BasicMold, c.DieNo
    FROM [ProcessInjection] a
    LEFT JOIN [InjectionMold] b ON a.InjectionID = b.InjectionID
    LEFT JOIN [MasterMold] c ON b.MoldID = c.MoldID
    WHERE a.RefID = ${RefID}`;
    dbCon.query(SelectMold, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`});
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/packing_list/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let SelectPacking = `SELECT
    row_number() over(order by a.PackingID desc)  as 'index',
	a.PackingID, a.PartID, b.PartCode, a.PackingType, a.MoldID,
	c.DieNo, a.DieID, a.RefID, d.PackingTypeName, e.PackingDeliveryName,d.PackingTypeID,e.PackingDeliveryID
    FROM [PartPackingStandard] a
    LEFT JOIN [MasterPart] b ON a.PartID = b.PartID
	LEFT JOIN [MasterMold] c on a.MoldID = c.MoldID
	LEFT JOIN [PackingType] d ON a.PackingTypeID = d.PackingTypeID
	LEFT JOIN [PackingDelivery] e ON a.PackingDeliveryID = e.PackingDeliveryID
    WHERE a.RefID = ${RefID}`;
    dbCon.query(SelectPacking, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send(JSON.stringify(rows.recordset));
        }
    })
})

router.get('/detail/:PackingID', (req, res, next) => {
    let PackingID = req.params.PackingID;
    let SelectPacking = `SELECT * FROM PartPackingStandard WHERE PackingID = ${PackingID}`;
    dbCon.query(SelectPacking, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})


router.post('/add/:RefID', (req, res, next) => {
    let RefID = req.params.RefID;
    let PartID = req.body.PartID;
    let MoldID = req.body.MoldID;
    let PackingTypeID = req.body.PackingTypeID;
    let PackingDeliveryID = req.body.PackingDeliveryID;
    let InsertPacking = `INSERT INTO PartPackingStandard(RefID, PartID, MoldID, PackingTypeID, PackingDeliveryID) VALUES(${RefID}, ${PartID},${MoldID}, ${PackingTypeID}, ${PackingDeliveryID})`;
    let checkDuplicate = `SELECT CASE
    WHEN EXISTS(
         SELECT *
         FROM PartPackingStandard
         WHERE PartID = ${PartID} AND PackingTypeID = ${PackingTypeID} AND RefID = ${RefID} AND PackingDeliveryID = ${PackingDeliveryID}
    )
    THEN CAST (1 AS BIT)
    ELSE CAST (0 AS BIT) END AS 'check'`;
    dbCon.query(checkDuplicate, (err, row) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            if(row.recordset[0].check){
                res.status(400).send({message: 'Duplicate Packing'})
            } else{
                dbCon.query(InsertPacking, (err) => {
                    if(err){
                        res.status(500).send({message: `${err}`})
                    } else{
                        res.status(201).send({message: 'Successfully added packing'})
                    }
                })
            }
        }
    })
})


router.put('/edit/:PackingID', (req, res) => {
    let PackingID = req.params.PackingID;
    //=====
    let QtyPcsBoxNo = req.body.QtyPcsBoxNo;
    let QtyPcsBoxQty = req.body.QtyPcsBoxQty;
    let BoxNo_1 = req.body.BoxNo_1;
    let BoxNo_2 = req.body.BoxNo_2;
    let BoxName_1 = req.body.BoxName_1;
    let BoxName_2 = req.body.BoxName_2;
    let BoxQty = req.body.BoxQty;
    //! let BoxNo_2 = req.body.BoxNo;

    let PlasticSheetNo = req.body.PlasticSheetNo;
    let PlasticSheetQty = req.body.PlasticSheetQty;
    let PartitionNo = req.body.PartitionNo;
    let PartitionQty = req.body.PartitionQty;
    let EPENo = req.body.EPENo;
    let EPEQty = req.body.EPEQty;
    let TrayNo = req.body.TrayNo;
    let TrayQty = req.body.TrayQty;
    let ProtectionFilmNo = req.body.ProtectionFilmNo;
    let ProtectionFilmQty = req.body.ProtectionFilmQty;
    let DiecutNo = req.body.DiecutNo;
    let DiecutQty = req.body.DiecutQty;
    let BubbleNo = req.body.BubbleNo;
    let BubbleQty = req.body.BubbleQty;
    let PadEVANo = req.body.PadEVANo;
    let PadEVAQty = req.body.PadEVAQty;
    let BagNo = req.body.BagNo;
    let BagQty = req.body.BagQty;
    let MaskingTapeNo = req.body.MaskingTapeNo;
    let MaskingTapeQty = req.body.MaskingTapeQty;
    let RubberNo = req.body.RubberNo;
    let RubberQty = req.body.RubberQty;
    let OPPTapeNo = req.body.OPPTapeNo;
    let OPPTapeQty = req.body.OPPTapeQty;
     
    let PatternNo_1 = req.body.PatternNo_1;
    let PatternNo_2 = req.body.PatternNo_2;
    let PatternName_1 = req.body.PatternName_1;
    let PatternName_2 = req.body.PatternName_2;
    let PatternQty = req.body.PatternQty;
    //! let PatternNo_2 = req.body.PatternNo;
    //======================================
    let BoardNo = req.body.BoardNo;
    let BoardQty = req.body.BoardQty;
    let CapNo = req.body.CapNo;
    let CapQty = req.body.CapQty;
    let CornerNo = req.body.CornerNo;
    let CornerQty = req.body.CornerQty;
    let CoverNo = req.body.CoverNo;
    let CoverQty = req.body.CoverQty;
    let RoundDieCutNo = req.body.RoundDieCutNo;   // DieCut กลม
    let RoundDieCutQty = req.body.RoundDieCutQty; // DieCut กลม
    let EVANo = req.body.EVANo;
    let EVAQty = req.body.EVAQty;
    let InnerNo = req.body.InnerNo;
    let InnerQty = req.body.InnerQty;
    let PadNo = req.body.PadNo;
    let PadQty = req.body.PadQty;
    let PalletNo = req.body.PalletNo;
    let PalletQty = req.body.PalletQty;
    let SheetNo = req.body.SheetNo;
    let SheetQty = req.body.SheetQty;
    let SilicaGelNo = req.body.SilicaGelNo;
    let SilicaGelQty = req.body.SilicaGelQty;
    let SleeveNo = req.body.SleeveNo;
    let SleeveQty = req.body.SleeveQty;
    let PartitionNo_T = req.body.PartitionNo_T;    // กระดาษคั่นกล่อง
    let PartitionQty_T = req.body.PartitionQty_T;  // กระดาษคั่นกล่อง
    let MetalStrapNo = req.body.MetalStrapNo;    // กิ๊บล็อค
    let MetalStrapQty = req.body.MetalStrapQty;  // กิํบล็อค
    let PlasticStrapNo = req.body.PlasticStrapNo;    // สายรัดกล่อง
    let PlasticStrapQty = req.body.PlasticStrapQty;  // สายรัดกล่อง
    //====================================
    let NetWeight = req.body.NetWeight;
    let GrossWeight = req.body.GrossWeight;

    let UpdatePacking = `UPDATE PartPackingStandard SET QtyPcsBoxNo='${QtyPcsBoxNo}', QtyPcsBoxQty='${QtyPcsBoxQty}', BoxNo_1='${BoxNo_1}', BoxName_1='${BoxName_1}', BoxNo_2='${BoxNo_2}', BoxName_2='${BoxName_2}',BoxQty='${BoxQty}',PlasticSheetNo='${PlasticSheetNo}', PlasticSheetQty='${PlasticSheetQty}',
    PartitionNo='${PartitionNo}', PartitionQty='${PartitionQty}', EPENo='${EPENo}', EPEQty='${EPEQty}', TrayNo='${TrayNo}', TrayQty='${TrayQty}',
    ProtectionFilmNo='${ProtectionFilmNo}', ProtectionFilmQty='${ProtectionFilmQty}', DiecutNo='${DiecutNo}', DiecutQty='${DiecutQty}', BubbleNo='${BubbleNo}', BubbleQty='${BubbleQty}',
    PadEVANo='${PadEVANo}', PadEVAQty='${PadEVAQty}', BagNo='${BagNo}', BagQty='${BagQty}', MaskingTapeNo='${MaskingTapeNo}', MaskingTapeQty='${MaskingTapeQty}',
    RubberNo='${RubberNo}', RubberQty='${RubberQty}', OPPTapeNo='${OPPTapeNo}', OPPTapeQty='${OPPTapeQty}', PatternNo_1='${PatternNo_1}', PatternName_1='${PatternName_1}',PatternNo_2='${PatternNo_2}', PatternName_2='${PatternName_2}' , PatternQty='${PatternQty}',
    BoardNo='${BoardNo}', BoardQty='${BoardQty}', CapNo='${CapNo}', CapQty='${CapQty}', CornerNo='${CornerNo}', CornerQty='${CornerQty}', CoverNo='${CoverNo}', CoverQty='${CoverQty}', RoundDieCutNo='${RoundDieCutNo}', RoundDieCutQty='${RoundDieCutQty}',
    EVANo='${EVANo}', EVAQty='${EVAQty}', InnerNo='${InnerNo}', InnerQty='${InnerQty}', PadNo='${PadNo}', PadQty='${PadQty}', PalletNo='${PalletNo}', PalletQty='${PalletQty}', SheetNo='${SheetNo}', SheetQty='${SheetQty}', SilicaGelNo='${SilicaGelNo}', SilicaGelQty='${SilicaGelQty}',
    SleeveNo='${SleeveNo}', SleeveQty='${SleeveQty}', PartitionNo_T='${PartitionNo_T}', PartitionQty_T='${PartitionQty_T}', MetalStrapNo='${MetalStrapNo}', MetalStrapQty='${MetalStrapQty}', PlasticStrapNo='${PlasticStrapNo}', PlasticStrapQty='${PlasticStrapQty}',
    NetWeight='${NetWeight}', GrossWeight='${GrossWeight}'
    WHERE PackingID = ${PackingID}`;
    console.log(UpdatePacking);
    dbCon.query(UpdatePacking, (err) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send({message: 'Successfully edited packing'})
        }
    })
})

router.delete('/delete/:PackingID', (req, res, next) => {
    let PackingID = req.params.PackingID;
    let DeletePacking = `DELETE FROM PartPackingStandard WHERE PackingID = ${PackingID}`;
    dbCon.query(DeletePacking, (err) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send({message: 'Successfully delete packing'})
        }
    })
})

module.exports = router;