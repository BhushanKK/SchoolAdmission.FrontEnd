$(document).ready(function () {

    const apiBase = "http://localhost:5263/api";
    const token = localStorage.getItem("accessToken");
    const studentId = localStorage.getItem("studentId");

    const headers = {
        "Authorization": "Bearer " + token
    };

    $(document).on("click", "#btnSaveDocumentInfo", function (e) {

        e.preventDefault();

        if (!studentId) {
            showToast("StudentId not found", "error");
            return;
        }

        const documentType = $("#documentType").val();
        const fileInput = $("#documentFile")[0];

        if (!documentType) {
            showToast("Please select document type", "error");
            return;
        }

        if (fileInput.files.length === 0) {
            showToast("Please select a file", "error");
            return;
        }

        const file = fileInput.files[0];

        const formData = new FormData();
        formData.append("StudentId", studentId);
        formData.append("DocumentType", documentType);
        formData.append("File", file);

        $("#btnSaveDocumentInfo").prop("disabled", true);

        $.ajax({
            url: apiBase + "/student-document",
            method: "POST",
            headers: headers,
            data: formData,
            contentType: false,
            processData: false,

            success: function (res) {
                showToast("Document uploaded successfully", "success");

                $("#documentType").val("");
                $("#documentFile").val("");
                $("#btnSaveDocumentInfo").prop("disabled", false);
            },

            error: function (xhr) {

                $("#btnSaveDocumentInfo").prop("disabled", false);

                if (xhr.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                    return;
                }

                if (xhr.responseJSON?.message) {
                    showToast(xhr.responseJSON.message, "error");
                    return;
                }

                showToast("Failed to upload document", "error");
            }
        });

    });

});