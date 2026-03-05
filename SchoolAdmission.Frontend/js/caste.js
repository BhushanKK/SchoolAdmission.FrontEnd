$(document).ready(function () {

    $('#casteTable').DataTable({

        ajax: {
            url: "http://localhost:5263/api/castemaster",
            type: "GET",
            dataSrc: "data"
        },

        columns: [
            { data: "casteId" },
            { data: "categoryName" },
            { data: "caste" }
        ]

    });

});