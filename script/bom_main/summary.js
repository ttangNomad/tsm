$(document).ready(function (){

    

    function fill_overview(RefID) {
        tableOverview = $('#tableOverview').DataTable({
            "bDestroy": true,
            "ajax": {
                "url": "/summary/overview/" + RefID,
                "dataSrc": ''
            },
            "columns": [
                {"data": null},
                {"data": "Process"},
                {"data": "Detail"},
                {"data": "ProcessIndex"},

            ],
            "columnDefs": [{
                    "targets": [3],
                    "visible": false

                },
                {
                    "searchable": false,
                    "orderable": false,
                    "targets": 0

                }
            ],
            "order": [
                [0, 'asc']
            ],

        });
        tableOverview.on('order.dt search.dt', function () {
            tableOverview.column(0, {
                search: 'applied',
                order: 'applied'
            }).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();
    }


    $('#tableRefNumber tbody').on('click', 'tr', function(){
        fill_overview(RefID);
    })

    $("#modalSaveRef").click(function(){
        fill_overview(null)
    })
})