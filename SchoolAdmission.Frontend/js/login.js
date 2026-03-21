$(document).ready(function () {
    $("#loginForm").submit(function (e) {
        e.preventDefault();

        var email = $("#email").val();
        var password = $("#password").val();

        $.ajax({
            url: "http://localhost:5263/api/auth/login", 
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                emailId: email,
                password: password
            }),
            success: function (response) {

                if (response.success) {

                    localStorage.setItem("accessToken", response.data.accessToken);
                    localStorage.setItem("refreshToken", response.data.refreshToken);
                    localStorage.setItem("userId", response.data.userId);
                    localStorage.setItem("role", response.data.role);

                    window.location.href = "pages/AdminDashboard.html";
                }
                else {
                    $("#errorMsg").text(response.message);
                }
            },
            error: function () {
                $("#errorMsg").text("Server error. Please try again.");
            }
        });
    });
});