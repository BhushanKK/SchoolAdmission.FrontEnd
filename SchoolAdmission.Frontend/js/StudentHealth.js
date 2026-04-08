$(document).ready(function () {

    const apiBase = "http://localhost:5263/api";
    const token = localStorage.getItem("accessToken");
    const studentId = localStorage.getItem("studentId");

    const headers = {
        "Authorization": "Bearer " + token
    };

    $(document).on("change", "#isHandicapped", function () {

        const value = $(this).val();

        if (value == "true") {
            $("#handicappedTypeId").prop("disabled", false);
        } else {
            $("#handicappedTypeId").val("").prop("disabled", true);
        }
    });

    $(document).on("click", "#btnSavePhysicalInfo", function (e) {

        e.preventDefault();
        if (!studentId) {
            showToast("StudentId not found", "error");
            return;
        }

        const height = $("#height").val();
        const weight = $("#weight").val();
        const isHandicapped = $("#isHandicapped").val();
        const handicappedTypeId = $("#handicappedTypeId").val();

        if (!height || !weight) {
            showToast("Height and Weight required", "error");
            return;
        }

        if (isHandicapped === "") {
            showToast("Select handicapped option", "error");
            return;
        }

        if (isHandicapped == "true" && !handicappedTypeId) {
            showToast("Select handicapped type", "error");
            return;
        }

        const payload = {
            studentId: studentId,
            height: Number(height),
            weight: Number(weight),
            isHandicapped: isHandicapped == "true",
            handicappedTypeId: handicappedTypeId ? Number(handicappedTypeId) : null
        };

        $("#btnSavePhysicalInfo").prop("disabled", true);

        $.ajax({
            url: apiBase + "/student-health",
            method: "POST",
            headers: headers,
            contentType: "application/json",
            data: JSON.stringify(payload),

            success: function (res) {
                showToast("Physical details saved successfully", "success");
                $("#btnSavePhysicalInfo").prop("disabled", false);
            },

            error: function (xhr) {
                
                $("#btnSavePhysicalInfo").prop("disabled", false);

                if (xhr.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                    return;
                }

                if (xhr.responseJSON?.message) {
                    showToast(xhr.responseJSON.message, "error");
                    return;
                }

                showToast("Failed to save physical details", "error");
            }
        });

    });

});