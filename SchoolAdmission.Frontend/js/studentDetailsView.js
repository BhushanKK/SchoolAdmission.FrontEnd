$(document).ready(function () {
 const token = localStorage.getItem("accessToken");
    $('#casteTable').DataTable({
        ajax: {
            url: studentDetailsApi,
            type: "GET",
            headers: getTokenHeader(),
            dataSrc: function (json) {
                if (json.success && json.data) {
                    return json.data;
                } else {
                    showToast("Failed to load student details", "error");
                    return [];
                }
            },
            error: function (xhr) {
                showToast("Failed to load student details", "error");
                return [];
            }
        },
        
        columns: [
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-primary printBtn" data-id="${row.studentId}">
                            <i class="fas fa-print"></i> Print
                        </button>
                    `;
                }
            },
            {data:"studentId",defaultContent:""},
            {data:"registrationNo",defaultContent:""},
            {data:"schoolName",defaultContent:""},
            {data:"academicYearName",defaultContent:""},
            {data:"financialYearName",defaultContent:""},
            {data:"studentName", defaultContent: "" },
            {data:"gender", defaultContent: ""},
            {data:"dob",defaultContent:""},
            {data:"saralId",defaultContent:""},
            {data:"aadharNo",defaultContent:""},
            {data:"nationality",defaultContent:""},
            {data:"motherTongue",defaultContent:""},
            {data:"religion",defaultContent:""},
            {data:"caste",defaultContent:""},
            {data:"isMinority",defaultContent:""},
            {data:"isHandicapped",defaultContent:""},
            {data:"isBpl",defaultContent:""},
            {data:"bplType",defaultContent:""},
            {data:"photoPath",defaultContent:""},
            {data:"branchName",defaultContent:""},
            {data:"permanentAddress",defaultContent:""},
            {data:"currentAddress",defaultContent:""},
            {data:"previousSchool",defaultContent:""},
            {data:"schoolDOE",defaultContent:""},
            {data:"progress",defaultContent:""},
            {data:"behaviour",defaultContent:""},
            {data:"passingYear",defaultContent:""},
            {data:"seatNo",defaultContent:""},
            {data:"totalMarks",defaultContent:""},
            {data:"percentage",defaultContent:""},
            {data:"height",defaultContent:""},
            {data:"weight",defaultContent:""},
            {data:"handicappedTypeId",defaultContent:""},
            {data:"fatherName",defaultContent:""},
            {data:"parentName",defaultContent:""},
            {data:"grandFatherName",defaultContent:""},
            {data:"motherName",defaultContent:""},
            {data:"parentContactNo",defaultContent:""},
            {data:"parentEmail",defaultContent:""},
            {data:"income",defaultContent:""},
            {data:"occupation",defaultContent:""}
            
        ],
        responsive: true,
        pageLength: 10
    });

});