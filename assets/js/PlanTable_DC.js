//License 127.0.0.1
 /*jspreadsheet.license = 'YjE1OWZjZjJkYzhlNjczZTkxNTIzZTE2ZjQwNzEzOGNhZmYyMjhkMjg2NjNhODNkZjAxMDY0MzMzNjJmOTc5NTQwMjk5M2ExZjY0NjA1YWY2NTQ5MmE3MjU2OTc1MWI0ODE2NjQzOGEzNWE2ZTY3ZWU2MzJiYzJkZDE3YmI0M2QsZXlKdVlXMWxJam9pVTNWM2FXTm9ZU0JUY21sd2JHbGxibU5vWVc0aUxDSmtZWFJsSWpveE5qTXpOek0wTURBd0xDSmtiMjFoYVc0aU9sc2lNVEkzTGpBdU1DNHhJaXdpYkc5allXeG9iM04wSWwwc0luQnNZVzRpT2pBc0luTmpiM0JsSWpwYkluWTNJaXdpZGpnaVhYMD0='; */

//License Red Hall
jspreadsheet.license = 'Mjk4Y2MxNWJhZTE4M2MwZjFlMGYwZWEzZjczZmE4YjMzNTRlNmU0ZTRiMDI0YmFmYjcyMmZmNjA0MDBmMzI0ZThjYzUxMzhkOTMzOGQzNjQ3OWM2YzA3OGVjYWRkZjg3NDI1NWRlNzhmZTg1MTY4YzNmZmRhZDdhMTQxNTU0ZDIsZXlKdVlXMWxJam9pVTNWM2FXTm9ZU0JUY21sd2JHbGxibU5vWVc0aUxDSmtZWFJsSWpveE5qTTBOamcwTkRBd0xDSmtiMjFoYVc0aU9sc2ljMmhwYm5rdGFHbHNiQzB3TXpBMUxtSnpjeTVrWlhOcFoyNGlMQ0pzYjJOaGJHaHZjM1FpWFN3aWNHeGhiaUk2TUN3aWMyTnZjR1VpT2xzaWRqY2lMQ0oyT0NKZGZRPT0=';

var dataDC = [
    [ 'Plan', '2', '3', '4', '5', '6' ],
    [ 'Acc', '22', '33', '44', '55', '66' ],
    [ 'DC OK', '22', '33', '44', '55', '66' ],
    [ 'DC Acc', '2', '3', '4', '5', '6' ],
    [ 'Due', '22', '33', '44', '55', '66' ],
    [ 'Acc Due', '22', '33', '44', '55', '66'  ],
    [ 'Stock', '2', '3', '4', '5', '6' ],
    [ 'Acc', '22', '33', '44', '55', '66' ],
    [ 'WIP', '', '', '', '', '' ],
    [ '-', '2', '3', '4', '5', '6' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ '-', '22', '33', '44', '55', '66' ],
    [ 'PTotal', '22', '33', '44', '55', '66' ],
   
    
];
var colDC = [
            { title:'Item', width:'100px', readOnly: true },
            { title:'1', width:'53px' },
            { title:'2', width:'53px' },
            { title:'3', width:'53px' },
            { title:'4', width:'53px' },
            { title:'5', width:'53px' },
            { title:'6', width:'53px' },
            { title:'7', width:'53px' },
            { title:'8', width:'53px' },
            { title:'9', width:'53px' },
            { title:'10', width:'53px' },
            { title:'11', width:'53px' },
            { title:'12', width:'53px' },
            { title:'13', width:'53px' },
            { title:'14', width:'53px' },
            { title:'15', width:'53px' },
            { title:'16', width:'53px' },
            { title:'17', width:'53px' },
            { title:'18', width:'53px' },
            { title:'19', width:'53px' },
            { title:'20', width:'53px' },
            { title:'21', width:'53px' },
            { title:'22', width:'53px' },
            { title:'23', width:'53px' },
            { title:'24', width:'53px' },
            { title:'25', width:'53px' },
            { title:'26', width:'53px' },
            { title:'27', width:'53px' },
            { title:'28', width:'53px' },
            { title:'29', width:'53px' },
            { title:'30', width:'53px' },
            { title:'31', width:'53px' }
        ];


var dcspreadsheet = jspreadsheet(document.getElementById('dcspreadsheet'), {
    
    tabs: false,
    toolbars: true,
    worksheets: [{
        data: dataDC,
        columns: colDC,
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
        minDimensions: [31, 24], 
        mergeCells: {
            A10: [1,2],
            A12: [1,2],
            A14: [1,2],
            A16: [1,2],
            A18: [1,2],
            A20: [1,2],
            A22: [1,2],
            A24: [1,2],
            A26: [1,2],
            A28: [1,2],
            A30: [1,2],
            A32: [1,2],
            A34: [1,2],
            A36: [1,2],
            A38: [1,2],
        },
    },],
    onload: function(dcspreadsheet, cell, x, y, source, value, label) {
        for (let i = 8; i <= 39; i++) {
            document.getElementById('dcspreadsheet').jspreadsheet[0].hideRow(i);
            }
    },
    updateTable: function(dcspreadsheet, cell, x, y, source, value, label) {
        if ( y == 8) {
            cell.classList.add('readonly');
        }
    },
    
    
});
var dcspreadsheet = jspreadsheet(document.getElementById('dcspreadsheet02'), {
    
    tabs: false,
    toolbars: true,
    worksheets: [{
        data: dataDC,
        columns: colDC,
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
        minDimensions: [31, 24], 
        mergeCells: {
            A10: [1,2],
            A12: [1,2],
            A14: [1,2],
            A16: [1,2],
            A18: [1,2],
            A20: [1,2],
            A22: [1,2],
            A24: [1,2],
            A26: [1,2],
            A28: [1,2],
            A30: [1,2],
            A32: [1,2],
            A34: [1,2],
            A36: [1,2],
            A38: [1,2],
        },
    },],
    onload: function(dcspreadsheet, cell, x, y, source, value, label) {
        for (let i = 8; i <= 39; i++) {
            document.getElementById('dcspreadsheet02').jspreadsheet[0].hideRow(i);
            }
    },
    updateTable: function(dcspreadsheet, cell, x, y, source, value, label) {
        if ( y == 8) {
            cell.classList.add('readonly');
        }
    },
    
    
});
var dcspreadsheet = jspreadsheet(document.getElementById('dcspreadsheet03'), {
    
    tabs: false,
    toolbars: true,
    worksheets: [{
        data: dataDC,
        columns: colDC,
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
        minDimensions: [31, 24], 
        mergeCells: {
            A10: [1,2],
            A12: [1,2],
            A14: [1,2],
            A16: [1,2],
            A18: [1,2],
            A20: [1,2],
            A22: [1,2],
            A24: [1,2],
            A26: [1,2],
            A28: [1,2],
            A30: [1,2],
            A32: [1,2],
            A34: [1,2],
            A36: [1,2],
            A38: [1,2],
        },
    },],
    onload: function(dcspreadsheet, cell, x, y, source, value, label) {
        for (let i = 8; i <= 39; i++) {
            document.getElementById('dcspreadsheet03').jspreadsheet[0].hideRow(i);
            }
    },
    updateTable: function(dcspreadsheet, cell, x, y, source, value, label) {
        if ( y == 8) {
            cell.classList.add('readonly');
        }
    },
    
    
});

$("#plan01_btnHideWIP").click(function(){
    var btnDisplayText = document.getElementById("plan01_btnHideWIP");
    if (btnDisplayText.innerHTML === "Hide WIP") {
        for (let i = 8; i <= 39; i++) {
            document.getElementById('dcspreadsheet').jspreadsheet[0].hideRow(i);
            }   
        btnDisplayText.innerHTML = "Show WIP";
    }
    else {
        for (let i = 8; i <= 39; i++) {
            document.getElementById('dcspreadsheet').jspreadsheet[0].showRow(i);
            }
        btnDisplayText.innerHTML = "Hide WIP";
    }
  
});

$("#plan02_btnHideWIP").click(function(){
    var btnDisplayText = document.getElementById("plan02_btnHideWIP");
    if (btnDisplayText.innerHTML === "Hide WIP") {
        for (let i = 8; i <= 39; i++) {
            document.getElementById('dcspreadsheet02').jspreadsheet[0].hideRow(i);
            }   
        btnDisplayText.innerHTML = "Show WIP";
    }
    else {
        for (let i = 8; i <= 39; i++) {
            document.getElementById('dcspreadsheet02').jspreadsheet[0].showRow(i);
            }
        btnDisplayText.innerHTML = "Hide WIP";
    }
  
});

$("#plan03_btnHideWIP").click(function(){
    var btnDisplayText = document.getElementById("plan03_btnHideWIP");
    if (btnDisplayText.innerHTML === "Hide WIP") {
        for (let i = 8; i <= 39; i++) {
            document.getElementById('dcspreadsheet03').jspreadsheet[0].hideRow(i);
            }   
        btnDisplayText.innerHTML = "Show WIP";
    }
    else {
        for (let i = 8; i <= 39; i++) {
            document.getElementById('dcspreadsheet03').jspreadsheet[0].showRow(i);
            }
        btnDisplayText.innerHTML = "Hide WIP";
    }
  
});