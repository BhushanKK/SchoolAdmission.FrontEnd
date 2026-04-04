$('#btnSaveStudentInfo').click(function () {
    var apiBase = "https://localhost:44328/api";
    const studentId = localStorage.getItem("studentId");

    const payload = {
        registrationNo: "",
        schoolId: null,
        academicYearId: "",
        financialYearId: "",

        firstName: $("#firstName").val(),
        middleName: $("#middleName").val(),
        lastName: $("#LastName").val(),

        gender: $("#gender").val(),
        dob: $("#dob").val(),

        saralId: $("#saralId").val(),
        aadharNo: $("#aadharNo").val(),

        nationality: $("#nationality").val(),
        motherTongue: $("#motherTongue").val(),

        religionId: parseInt($("#religionId").val()),
        casteId: parseInt($("#casteId").val()),
        categoryId: parseInt($("#categoryId").val()),

        isMinority: $("#isMinority").val(),
        isHandicapped: false,
        isBpl: false,
        bpL_Type: "",

        photo: "",
        branchId: ""
    };

    const url = `${apiBase}/student/${studentId}`;

    //$('#btnSaveStudentInfo').prop("disabled", true);

    $.ajax({
        url: url,
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        },
        contentType: "application/json",
        data: JSON.stringify(payload),

        success: function (res) {
            showToast(res.message || "Student information saved successfully", "success");
            $('#btnSaveStudentInfo').prop("disabled", false);
        },

        error: function (xhr) {
            $('#btnSaveStudentInfo').prop("disabled", false);

            if (xhr.status === 401) {
                localStorage.clear();
                window.location.href = "../index.html";
                return;
            }

            if (xhr.status === 409 && xhr.responseJSON?.message) {
                showToast(xhr.responseJSON.message, "exists");
                return;
            }

            if (xhr.responseJSON?.errors) {
                const message = xhr.responseJSON.errors.join("\n");
                showToast(message, "error");
                return;
            }

            if (xhr.responseJSON?.message) {
                showToast(xhr.responseJSON.message, "error");
                return;
            }

            showToast("Something went wrong", "error");
        }
    });
});