//Step 4: Parent / Guardian Info
$(document).ready(function () {

    const token = localStorage.getItem("accessToken");
    const studentId = localStorage.getItem("studentId");

    const headers = {
        "Authorization": "Bearer " + token
    };

    $(document).on("click", "#btnSaveParentInfo", function (e) {

        e.preventDefault();

        if (!studentId) {
            showToast("StudentId not found", "error");
            return;
        }

        const fatherName = $("#fatherName").val();
        const motherName = $("#motherName").val();
        const grandFatherName = $("#grandFatherName").val();
        const parentName = $("#parentName").val();
        const contactNo = $("#contactNo").val();
        const emailId = $("#emailId").val();
        const income = $("#income").val();
        const occupation = $("#occupation").val();

        if (!fatherName || !motherName) {
            showToast("Father and Mother name required", "error");
            return;
        }

        if (!contactNo) {
            showToast("Contact number required", "error");
            return;
        }

        if (contactNo.length !== 10) {
            showToast("Contact number must be 10 digits", "error");
            return;
        }

        const payload = {
            studentId: studentId,

            fatherName: fatherName,
            motherName: motherName,
            grandFatherName: grandFatherName,
            parentName: parentName,

            contactNo: contactNo,
            emailId: emailId,

            income: income ? Number(income) : null,
            occupation: occupation
        };

        $("#btnSaveParentInfo").prop("disabled", true);

        $.ajax({
            url: guardianApi,
            method: "POST",
            headers: headers,
            contentType: "application/json",
            data: JSON.stringify(payload),

            success: function (res) {
                showToast("Parent details saved successfully", "success");
                $("#btnSaveParentInfo").prop("disabled", false);
            },

            error: function (xhr) {

                console.log("Error:", xhr.responseText);

                $("#btnSaveParentInfo").prop("disabled", false);

                if (xhr.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                    return;
                }

                if (xhr.responseJSON?.message) {
                    showToast(xhr.responseJSON.message, "error");
                    return;
                }

                showToast("Failed to save parent details", "error");
            }
        });

    });

});