//Step 5: Previous School Information
$(document).ready(function () {

    const token = localStorage.getItem("accessToken");
    const studentId = localStorage.getItem("studentId");

    const headers = {
        "Authorization": "Bearer " + token
    };

    $(document).on("click", "#btnSavePreviousInfo", function (e) {

        e.preventDefault();

        if (!studentId) {
            showToast("StudentId not found", "error");
            return;
        }

        const previousSchool = $("#previousSchool").val();
        const schoolDOE = $("#schoolDOE").val();
        const progress = $("#progress").val();
        const behaviour = $("#behaviour").val();
        const passingYear = $("#passingYear").val();
        const seatNo = $("#seatNo").val();
        const totalMarks = $("#totalMarks").val();
        const percentage = $("#percentage").val();

        if (!previousSchool) {
            showToast("Previous school is required", "error");
            return;
        }

        if (!passingYear) {
            showToast("Passing year is required", "error");
            return;
        }

        const payload = {
            studentId: studentId,

            previousSchool: previousSchool,
            schoolDOE: schoolDOE ? new Date(schoolDOE).toISOString() : null,
            progress: progress,
            behaviour: behaviour,

            passingYear: passingYear ? Number(passingYear) : null,
            seatNo: seatNo,
            totalMarks: totalMarks ? Number(totalMarks) : null,
            percentage: percentage ? Number(percentage) : null
        };

        $("#btnSavePreviousInfo").prop("disabled", true);

        $.ajax({
            url: previousSchoolApi,
            method: "POST",
            headers: headers,
            contentType: "application/json",
            data: JSON.stringify(payload),

            success: function (res) {
                showToast("Previous school details saved successfully", "success");
                $("#btnSavePreviousInfo").prop("disabled", false);
            },

            error: function (xhr) {
                
                $("#btnSavePreviousInfo").prop("disabled", false);

                if (xhr.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                    return;
                }

                if (xhr.responseJSON?.message) {
                    showToast(xhr.responseJSON.message, "error");
                    return;
                }

                showToast("Failed to save previous school details", "error");
            }
        });

    });

});