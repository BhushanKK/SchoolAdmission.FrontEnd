$(document).ready(function () {
    $('#btnSaveStudentInfo').click(function () {
        
        const studentId = localStorage.getItem("studentId");
        const payload = {
            firstName: $("#firstName").val(),
            middleName: $("#middleName").val(),
            lastName: $("#lastName").val(),
            gender: $("#gender").val() === "true",
            dob: new Date($("#dob").val()).toISOString(),
            saralId: $("#saralId").val(),
            aadharNo: $("#aadharNo").val(),
            nationality: $("#nationality").val(),
            motherTongue: $("#motherTongue").val(),
            religionId: parseInt($("#religionId").val()),
            casteId: parseInt($("#casteId").val()),
            categoryId: parseInt($("#categoryId").val()),
            isMinority: $("#isMinority").is(":checked"),
            isHandicapped: false,
            isBpl: false
        };

        
        $('#btnSaveStudentInfo').prop("disabled", true);
        const url = `${studentApi}/${studentId}`;
        $.ajax({
            url: url,
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function (res) {
                showToast("Student saved successfully", "success");
                $('#btnSaveStudentInfo').prop("disabled", false);
            },
            error: function (xhr) {
                $('#btnSaveStudentInfo').prop("disabled", false);
                if (xhr.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                    return;
                }
                if (xhr.responseJSON?.message) {
                    alert(xhr.responseJSON.message);
                    return;
                }
            }
        });

    });

});