const express = require('express');
const router = express.Router();
const dbConst = require('../../lib/db');

router.get('/overview/:RefID', (req, res) => {
    let RefID = req.params.RefID;
    let SelectProcess = `/****** Script for SelectTopNRows command from SSMS  ******/
    DECLARE @SearchRefID bigint;

    -- Initialize the variable.
    SET @SearchRefID = ${RefID};

    (SELECT
			row_number() over(order by b.ProcessIndex) as 'index',
			CASE
                WHEN b.InsertMold = 1 THEN 'Insert Mold'
                ELSE 'Injection'
            END AS Process,
            CASE
                WHEN b.InsertMold = 1 THEN 'Ins_' + LTRIM(STR(b.InjectionID,10))
                ELSE 'Inj_' + LTRIM(STR(b.InjectionID,10))
            END AS ProcessID,
            b.ProcessIndex,
            'Material : ' + (
            SELECT d.Code + ' , '
              FROM [dbo].[InjectionMaterial] c Left Join [dbo].[MasterInjectionMaterial] d on c.MaterialID = d.MaterialID
              WHERE c.InjectionID = b.InjectionID GROUP BY d.Code
              FOR XML PATH('')
            ) AS Detail
      FROM [TSMolymer_F].[dbo].[MasterReferenceNo] a Inner Join [dbo].[ProcessInjection] b on a.RefID = b.RefID WHERE a.RefID = @SearchRefID)
    UNION ALL
    (
    SELECT
			row_number() over(order by b.ProcessIndex) as 'index',
			CASE
            WHEN b.PrintingID IS NULL THEN NULL
            else 'Printing'
            END AS Process,
            'Prt_' + LTRIM(STR(b.PrintingID,10)) AS ProcessID,
            b.ProcessIndex,
            'MFG : ' + ISNULL(b.MFG, 'NaN') +
            ', Color : ' + ISNULL(c.ColorName, 'NaN') +
            ', Pcs/Hr : ' + LTRIM(STR(ISNULL(b.PcsHr, 0),10)) AS Detail
      FROM [TSMolymer_F].[dbo].[MasterReferenceNo] a Inner Join [dbo].[ProcessPrinting] b on a.RefID = b.RefID Left Join [dbo].[MasterColorMaterial] c on b.ColorID = c.ColorID WHERE a.RefID = @SearchRefID)
    UNION ALL
    (
    SELECT
			row_number() over(order by b.ProcessIndex) as 'index',
			CASE
            WHEN b.HSID IS NULL THEN NULL
            ELSE 'Hot Stamp'
            END AS Process,
            'HotStamp_' + LTRIM(STR(b.HSID,10)) AS ProcessID,
            b.ProcessIndex,
            'Code : ' + ISNULL(c.FoilCode , 'NaN') + ', Foil Size : ' + ISNULL(b.FoilSize, 10) AS Detail

      FROM [TSMolymer_F].[dbo].[MasterReferenceNo] a Inner Join [dbo].[ProcessHotStamp] b on a.RefID = b.RefID Left Join [dbo].[MasterHotStampMaterial] c on b.HSMID = c.HSMID WHERE a.RefID = @SearchRefID)
    UNION ALL
    (
    SELECT
			row_number() over(order by b.ProcessIndex) as 'index',
			CASE
            WHEN b.AssyProcID IS NULL THEN NULL
            ELSE 'Assembly'
            END AS Process,
            'Assy_' + LTRIM(STR(b.AssyProcID,10)) AS ProcessID,
            b.ProcessIndex,
            'Process Name : ' + ISNULL(b.ProcessName, '') AS Detail
      FROM [TSMolymer_F].[dbo].[MasterReferenceNo] a Inner Join [dbo].[ProcessAssembly] b on a.RefID = b.RefID WHERE a.RefID = @SearchRefID)
    UNION ALL
    (
    SELECT
			row_number() over(order by b.ProcessIndex) as 'index',
			CASE
            WHEN b.SprayID IS NULL THEN NULL
            ELSE 'Spray'
            END AS Process,
            'Spray_' + LTRIM(STR(b.SprayID,10)) AS ProcessID,
            b.ProcessIndex,
            'MFG : ' + ISNULL(b.MFG, 'NaN') +
            ', Color : ' + ISNULL(c.ColorName, 'NaN') +
            ', Pcs/Hr : ' + LTRIM(STR(ISNULL(b.PcsHr, 0),10))
      FROM [TSMolymer_F].[dbo].[MasterReferenceNo] a Inner Join [dbo].[ProcessSpray] b on a.RefID = b.RefID Left Join [dbo].[MasterColorMaterial] c on b.ColorID = c.ColorID WHERE a.RefID = @SearchRefID)
    UNION ALL
    (
    SELECT
			row_number() over(order by b.ProcessIndex) as 'index',
			CASE
            WHEN b.WeldingID IS NULL THEN NULL
            ELSE 'Welding'
            END AS Process,
            'Weld_' + LTRIM(STR(b.WeldingID,10)) AS ProcessID,
            b.ProcessIndex,
            'Part : ' + ISNULL(c.PartCode, 'NaN')
      FROM [TSMolymer_F].[dbo].[MasterReferenceNo] a Inner Join [dbo].[ProcessWelding] b on a.RefID = b.RefID Left Join [dbo].[MasterPart] c on b.PartID_OUT = c.PartID WHERE a.RefID = @SearchRefID)
    Order By ProcessIndex
    `;
    dbConst.query(SelectProcess, (err, rows) => {
        if(err){
            res.status(500).send({message: `${err}`})
        } else{
            res.status(200).send(JSON.stringify(rows.recordset))
        }
    })
})

module.exports = router;