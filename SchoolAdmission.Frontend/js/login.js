$(document).ready(function () {
    $("#loginForm").submit(function (e) {
        e.preventDefault();

        var userName = $("#email").val();
        var password = $("#password").val();

        $.ajax({
            url: "http://localhost:5263/api/auth/login", // update this
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                emailOrMobile: userName,
                password: password
            }),
            
            success: function (response) {

                if (response.success) {

                    localStorage.setItem("accessToken", response.data.accessToken);
                    localStorage.setItem("refreshToken", response.data.refreshToken);
                    localStorage.setItem("userId", response.data.userId);
                    localStorage.setItem("role", response.data.role);
                    localStorage.setItem("userEmail", response.data.emailId);
                    localStorage.setItem("studentId", response.data.studentId);
                    if (response.data.role === "Admin") 
                        window.location.href = "pages/AdminDashboard.html";
                     else 
                        window.location.href = "pages/StudentDashboard.html";
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