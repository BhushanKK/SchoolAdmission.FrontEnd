const registerApi = "http://localhost:5263/api/student";
const committeeApi = "http://localhost:5263/api/CommiteMasters";
const schoolApi = "http://localhost:5263/api/schoolmasters/AllSchools";

function loadCommittees() {
    $.ajax({
        url: committeeApi,
        type: "GET",
        success: function (response) {
            let dropdown = $("#committee");
            dropdown.empty().append(`<option value="">Select Committee</option>`);
            if (response.success && response.data) {
                response.data.forEach(item => {
                    dropdown.append(`<option value="${item.commiteeId}">${item.commiteeName}</option>`);
                });
            }
        },
        error: function () {
            $("#errorMsg").text("Failed to load committees");
        }
    });
}

function loadSchools(committeeId) {
    $("#school").prop("disabled", true);
    $.ajax({
        url: `${schoolApi}/${committeeId}`,
        type: "GET",
        success: function (response) {
            let dropdown = $("#school");
            dropdown.empty().append(`<option value="">Select School</option>`);
            if (response.success && response.data) {
                response.data.forEach(item => {
                    dropdown.append(`<option value="${item.schoolId}">${item.schoolName}</option>`);
                });
                dropdown.prop("disabled", false);
                if (response.data.length > 0) {
                    dropdown.val(response.data[0].schoolId); // auto-select first
                }
            }
        },
        error: function () {
            $("#errorMsg").text("Failed to load schools");
        }
    });
}

$(document).ready(function () {
    loadCommittees();

    // Cascade: Committee -> School
    $("#committee").change(function () {
        const committeeId = $(this).val();
        if (committeeId) {
            loadSchools(committeeId);
        } else {
            $("#school").prop("disabled", true).html(`<option value="">Select School</option>`);
        }
    });

    $("#registerForm").submit(function (e) {
        e.preventDefault();

        const password = $("#password").val();
        const confirmPassword = $("#confirmPassword").val();
        const schoolId = $("#school").val();

        if (password !== confirmPassword) {
            $("#errorMsg").text("Passwords do not match");
            return;
        }

        if (!schoolId) {
            $("#errorMsg").text("Please select a school");
            return;
        }

        const payload = {
            firstName: $("#firstName").val(),
            middleName: $("#middleName").val(),
            lastName: $("#lastName").val(),
            emailId: $("#emailId").val(),
            mobileNo: $("#mobileNo").val(),
            passwordHash: password,
            schoolId: parseInt(schoolId)
        };

        $.ajax({
            url: registerApi,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function (response) {
                if (response.success) {
                    $("#successMsg").text("Registration successful!");
                    $("#errorMsg").text("");
                    setTimeout(() => window.location.href = "../index.html", 2000);
                } else {
                    $("#errorMsg").text(response.message);
                }
            },
            error: function (xhr) {
                console.log(xhr.responseText);
                $("#errorMsg").text("Server error. Please try again.");
            }
        });
    });
});