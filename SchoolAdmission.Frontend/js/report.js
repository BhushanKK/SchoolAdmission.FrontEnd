$(document).ready(function () {

   const studentId = localStorage.getItem("studentId");

    if (!studentId) {
        alert("StudentId missing");
        return;
    }

    $.ajax({
        url: reportApi + studentId,
        type: "GET",
        headers: getTokenHeader(),
        success: function (res) {
            if (res.success) {
                $("#studentName").val(res.data.studentName);
                $("#motherName").val(res.data.motherName);
                $("#income").val(res.data.income);
                $("#dob").val(res.data.dob);
                $("#previousSchool").val(res.data.previousSchool);
                $("#permanentAddress").val(res.data.permanentAddress);
                $("#registrationNo").val(res.data.registrationNo);
                $("#parentContactNo").val(res.data.parentContactNo);
                $("#totalMarks").val(res.data.totalMarks);
                $("#casteReligion").val((res.data.religion || "") + " - " + (res.data.caste || ""));
                $("#seatNo").val(res.data.seatNo);
                $("#percentage").val(res.data.percentage);
                $("#passingYear").val(res.data.passingYear);
            }
        },
        error: function () {
            alert("API Error");
        }
    });

    function getStudentIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get("studentId");
    }
});