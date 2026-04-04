$(document).ready(function () {
 const token = localStorage.getItem("accessToken");
    const headers = { "Authorization": "Bearer " + token };
    $('#casteTable').DataTable({
        ajax: {
            url: "http://localhost:5263/api/student-details",
            type: "GET",
            headers: headers,
            dataSrc: function (json) {
                if (json.success && json.data) {
                    return json.data;
                } else {
                    console.error("Failed to load student data");
                    return [];
                }
            },
            error: function (xhr) {
                console.error("Server error while fetching student details:", xhr);
                return [];
            }
        },
        columns: [
            {data:"studentName", defaultContent: "" },
            {data:"schoolName", defaultContent: ""},
            {data:"dob",defaultContent:""},
            {data:"gender",defaultContent:""},
            {data:"aadharNo",defaultContent:""},
            {data:"standard",defaultContent:""},
            {data:"division",defaultContent:""}
        ],
        responsive: true,
        pageLength: 10
    });

});