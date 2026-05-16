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
                $("#EnStudentName").val(res.data.studentName);
                $("#EnMotherName").val(res.data.motherName);
                $("#commiteeName").text(res.data.commiteeName);
                $("#collegeName").text(res.data.schoolName);
                $(".totalMarks").val(res.data.totalMarks);
                $("#casteAndCategory").val(res.data.religion + " - " + res.data.caste);
                $("#category").val(res.data.category);
                $("#permanentAddress").val(res.data.permanentAddress);
                $("#currentAddress").val(res.data.currentAddress);
                $("#mobileNumber").val(res.data.mobileNumber);
                $("#birthDate").val(res.data.birthDate);
                $("#annualIncome").val(res.data.income);
                $("#mobileNumber").val(res.data.parentContactNo);
                $(".previousSchool").val(res.data.previousSchool);
                $("#Standard").text(res.data.standardName + " - " + res.data.branchName);
                $(".StandardAndBranch").text(res.data.standardName + " - " + res.data.branchName);
                $("#PassingYear").text(res.data.passingYear);
                $("#SeatNo").text(res.data.seatNo);
                $("#percentage").val(res.data.percentage);
                $(".formNo").text(res.data.registrationNo);
                $(".applicationDate").text(new Date().toLocaleDateString());
                const date = new Date(res.data.dob);

                const formatted =
                    String(date.getDate()).padStart(2, '0') + '-' +
                    String(date.getMonth() + 1).padStart(2, '0') + '-' +
                    date.getFullYear();
                $("#birthDate").val(formatted);
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