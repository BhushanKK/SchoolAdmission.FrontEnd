// Step: Student Information Update
$(document).ready(function () {

    const apiBase = "http://localhost:5263/api";
    const token = localStorage.getItem("accessToken");
    const studentId = localStorage.getItem("studentId");

    const headers = {
        "Authorization": "Bearer " + token
    };

    $(document).on("click", "#btnSaveStudentInfo", function (e) {

        e.preventDefault();

        if (!studentId) {
            showToast("StudentId not found", "error");
            return;
        }

        const height = $("#height").val();
        const weight = $("#weight").val();
        const handicappedTypeId = $("#handicappedTypeId").val();

        // Validation (basic)
        if (!height || !weight) {
            showToast("Height and Weight are required", "error");
            return;
        }

        const payload = {
            height: height ? Number(height) : null,
            weight: weight ? Number(weight) : null,
            handicappedTypeID: handicappedTypeId ? Number(handicappedTypeId) : null
        };

        const url = `${apiBase}/student/${studentId}`;

        $("#btnSaveStudentInfo").prop("disabled", true);

        $.ajax({
            url: url,
            method: "PUT",
            headers: headers,
            contentType: "application/json",
            data: JSON.stringify(payload),

            success: function (res) {
                showToast(res.message || "Student information saved successfully", "success");
                $("#btnSaveStudentInfo").prop("disabled", false);
            },

            error: function (xhr) {

                $("#btnSaveStudentInfo").prop("disabled", false);

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

});