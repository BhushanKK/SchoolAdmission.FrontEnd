$('#submit').click(function ()
{
        var apiBase = "https://localhost:44328/api";
        const studentId = localStorage.getItem("userId");
        const payload = {
            registrationNo: "",
            schoolId: "",
            academicYearId: "",
            financialYearId: "",
            firstName: $("#firstName").val(),
            middleName: $("#middleName").val(),
            lastName: $("#lastName").val(),
            gender:false,
            dob : $("#dob").val(),
            saralId : "",
            aadharNo : $("#aadharNo").val(),
            nationality: $("#nationality").val(),
            motherTongue: $("#motherTongue").val(),
            religionId : "",
            casteId : "",
            CategoryId : "",
            isMinority : false,
            isHandicapped:false,
            isBpl : false,
            bpl_Type : "",
            photo : "",
            modifyBy : "",
            branchId : "",
        };
      
        const url = `${apiBase}/student/${studentId}`;

        $('#btnSaveStudentInfo').prop("disabled", true);



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
            },

            error: function (xhr) {
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