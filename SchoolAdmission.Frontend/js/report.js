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