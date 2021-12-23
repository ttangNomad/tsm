function PackingPlan() {

    $("#plan01_packCustomer").val(Customer);
    $("#plan01_packPartName").val(PartName);
    $("#plan01_packPartCode").val(PartCode);
    $("#plan01_packRemark").val(Remark);
    $("#plan01_packDelivery").val(Delivery);

    plan01_tbPackingStandard = $("#plan01_tbPackingStandard").DataTable({
        "bDestroy":true,
        "ajax":{
            "url": 'url',
        },
        "columns":[
            {"data":"Type"},
            {"data":"No."},
            {"data":"Quantity"},
        ],
    });
}

//License 127.0.0.1
//jspreadsheet.license = 'YjE1OWZjZjJkYzhlNjczZTkxNTIzZTE2ZjQwNzEzOGNhZmYyMjhkMjg2NjNhODNkZjAxMDY0MzMzNjJmOTc5NTQwMjk5M2ExZjY0NjA1YWY2NTQ5MmE3MjU2OTc1MWI0ODE2NjQzOGEzNWE2ZTY3ZWU2MzJiYzJkZDE3YmI0M2QsZXlKdVlXMWxJam9pVTNWM2FXTm9ZU0JUY21sd2JHbGxibU5vWVc0aUxDSmtZWFJsSWpveE5qTXpOek0wTURBd0xDSmtiMjFoYVc0aU9sc2lNVEkzTGpBdU1DNHhJaXdpYkc5allXeG9iM04wSWwwc0luQnNZVzRpT2pBc0luTmpiM0JsSWpwYkluWTNJaXdpZGpnaVhYMD0=';

//License Red Hall
//jspreadsheet.license = "MmI1YTRmMmVmNWI0Yzc4ZDQ3ZGYxNGExZGNmNzdlNjg5ZTU0ODBiNmY3M2E2NTE1YWZhYzE2MDgxOGRhZjIxNzJlNGQ2MjBkZDE2N2QwNWE2ZjVlZmY5YThmZDE3NmZhZDgwNmJjODc2ZWM0OWI5ODNmNzBmZTlhOTc2Y2JiNGYsZXlKdVlXMWxJam9pVUc5dmJuTmhhME1pTENKa1lYUmxJam94TmpNMk9EUTRNREF3TENKa2IyMWhhVzRpT2xzaU1USTNMakF1TUM0eElpd2liRzlqWVd4b2IzTjBJbDBzSW5Cc1lXNGlPakFzSW5OamIzQmxJanBiSW5ZM0lpd2lkamdpWFgwPQ;

var dataPacking = [
    { header_name: "Box", D1: 26, D2: 3, D3: 4, D4: 5, D5: 6 },
    { header_name: "Bag", D1: 22, D2: 33, D3: 44, D4: 55, D5: 66 },
  ];
  var colPacking = [
    {
      type: "text",
      name: "header_name",
      title: "Date",
      width: "100px",
      readOnly: true,
    },
    { type: "number", name: "D1", title: "1", width: "53px" },
    { type: "number", name: "D2", title: "2", width: "53px" },
    { type: "number", name: "D3", title: "3", width: "53px" },
    { type: "number", name: "D4", title: "4", width: "53px" },
    { type: "number", name: "D5", title: "5", width: "53px" },
    { type: "number", name: "D6", title: "6", width: "53px" },
    { type: "number", name: "D7", title: "7", width: "53px" },
    { type: "number", name: "D8", title: "8", width: "53px" },
    { type: "number", name: "D9", title: "9", width: "53px" },
    { type: "number", name: "D10", title: "10", width: "53px" },
    { type: "number", name: "D11", title: "11", width: "53px" },
    { type: "number", name: "D12", title: "12", width: "53px" },
    { type: "number", name: "D13", title: "13", width: "53px" },
    { type: "number", name: "D14", title: "14", width: "53px" },
    { type: "number", name: "D15", title: "15", width: "53px" },
    { type: "number", name: "D16", title: "16", width: "53px" },
    { type: "number", name: "D17", title: "17", width: "53px" },
    { type: "number", name: "D18", title: "18", width: "53px" },
    { type: "number", name: "D19", title: "19", width: "53px" },
    { type: "number", name: "D20", title: "20", width: "53px" },
    { type: "number", name: "D21", title: "21", width: "53px" },
    { type: "number", name: "D22", title: "22", width: "53px" },
    { type: "number", name: "D23", title: "23", width: "53px" },
    { type: "number", name: "D24", title: "24", width: "53px" },
    { type: "number", name: "D25", title: "25", width: "53px" },
    { type: "number", name: "D26", title: "26", width: "53px" },
    { type: "number", name: "D27", title: "27", width: "53px" },
    { type: "number", name: "D21", title: "28", width: "53px" },
    { type: "number", name: "D29", title: "29", width: "53px" },
    { type: "number", name: "D30", title: "30", width: "53px" },
    { type: "number", name: "D31", title: "31", width: "53px" },
  ];
  
  var injspreadsheetpacking = jspreadsheet(document.getElementById("injspreadsheetpacking"), {
    tabs: false,
    toolbars: true,
    worksheets: [
      {
        data: dataPacking,
        //   columnDrag: true,
        columns: colPacking,
        copyCompatibility: false,
        allowInsertRow: false,
        textOverflow: true,
        allowInsertColumn: false,
        allowDeleteRow: false,
        allowDeleteColumn: false,
        allowRenameColumn: false,
        allowComments: false,
        columnSorting: false,
        columnDrag: false,
        columnResize: false,
        rowDrag: false,
        rowResize: false,
        minDimensions: [31, 2],
      },
    ],
    license: `MGRkMDI0NDRmZDhjYmZhN2JkYTNlMTQ2MjdjN2Q2MDBmZDYzM2I2ZTk1Yzk4MjljNzRhMDIwMjFlOTZiMDBjMGFhNDA1ZjMxOTlhNzllYjY2ZjE5ZDVmNjUzNTVlNjU3MDAzNjM4NmY0NmVhOTBiNzE4OTE5NGExZjAyZmE4NzEsZXlKdVlXMWxJam9pVUc5dmJuTmhhME1pTENKa1lYUmxJam94TmpReU1qQTBPREF3TENKa2IyMWhhVzRpT2xzaU1USTNMakF1TUM0eElpd2liRzlqWVd4b2IzTjBJbDBzSW5Cc1lXNGlPakFzSW5OamIzQmxJanBiSW5ZM0lpd2lkamdpWFgwPQ==`,
  });
  
  // Cell array as readonly
  let arrayCellLockPacking = [
    "A1",
    "A2",
    "B1",
    "B2",
    "C1",
    "C2",
    "D1",
    "D2",
    "E1",
    "E2",
    "F1",
    "F2",
    "G1",
    "G2",
    "H1",
    "H2",
    "I1",
    "I2",
    "J1",
    "J2",
    "K1",
    "K2",
    "L1",
    "L2",
    "M1",
    "M2",
    "N1",
    "N2",
    "O1",
    "O2",
    "P1",
    "P2",
    "Q1",
    "Q2",
    "R1",
    "R2",
    "S1",
    "S2",
    "T1",
    "T2",
    "U1",
    "U2",
    "V1",
    "V2",
    "W1",
    "W2",
    "X1",
    "X2",
    "Y1",
    "Y2",
    "Z1",
    "Z2",
    "AA1",
    "AA2",
    "AB1",
    "AB2",
    "AC1",
    "AC2",
    "AD1",
    "AD2",
    "AE1",
    "AE2",
    "AF1",
    "AF2",

  ];
  
  lockCellPacking(true); // false = Cell read/write , true = Cell readOnly
  function lockCellPacking(lock) {
    arrayCellLockPacking.forEach((cell) => {
        injspreadsheetpacking[0].setReadOnly(cell, lock);
    });
  }
  //  Load daata from Tale
  document.getElementById("loaddatapacking").addEventListener("click", getTableDataPacking);
  
  function getTableDataPacking() {
    console.log(injspreadsheetpacking[0].getJson().length);
    console.log(injspreadsheetpacking[0].getData(false, true)); //์Get value only - not Formula
    for (let i = 0; i < 31; i++) {
        console.log(injspreadsheetpacking[0].getColumnData([i]));
    }
    for (let i = 0; i < injspreadsheetpacking[0].getJson().length; i++) {
        console.log(injspreadsheetpacking[0].getRowData([i]));
    }
  }
  