$(document).ready(function () {

    const studentId = localStorage.getItem("studentId");

    loadDocuments();

    // =========================
    // UPLOAD DOCUMENT
    // =========================
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
            url: documentUploadApi,
            method: "POST",
            headers: getTokenHeader(),
            data: formData,
            contentType: false,
            processData: false,

            success: function () {

                showToast("Document uploaded successfully", "success");

                $("#documentType").val("");
                $("#documentFile").val("");

                $("#btnSaveDocumentInfo").prop("disabled", false);

                loadDocuments();
            },

            error: function (xhr) {

                $("#btnSaveDocumentInfo").prop("disabled", false);

                if (xhr.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                    return;
                }

                showToast("Failed to upload document", "error");
            }
        });
    });
});


// =========================
// LOAD DOCUMENTS
// =========================
function loadDocuments() {

    const studentId = localStorage.getItem("studentId");

    $.ajax({
        url: documentUploadApi + "/" + studentId,
        method: "GET",
        headers: getTokenHeader(),

        success: function (response) {

            $("#documentTableBody").empty();

            const data = response.data;

            if (!data || data.length === 0) {

                $("#documentTableBody").append(`
                    <tr>
                        <td colspan="4" class="text-center text-muted">
                            No Documents Uploaded
                        </td>
                    </tr>
                `);

                return;
            }

            for (let i = 0; i < data.length; i++) {

                const item = data[i];

                let documentName = "";

                switch (item.documentType) {
                    case 1: documentName = "Aadhar Card"; break;
                    case 2: documentName = "PAN Card"; break;
                    case 3: documentName = "Birth Certificate"; break;
                    case 4: documentName = "Caste Certificate"; break;
                    case 5: documentName = "Income Certificate"; break;
                    case 6: documentName = "Leaving Certificate"; break;
                    case 7: documentName = "Passport Size Photo"; break;
                    case 8: documentName = "Domicile Certificate"; break;
                    case 9: documentName = "Nationality Certificate"; break;
                    default: documentName = "Unknown";
                }

                $("#documentTableBody").append(`
                    <tr>
                        <td>${i + 1}</td>
                        <td>${item.documentId}</td>
                        <td>${documentName}</td>
                        <td>
                            <button class="btn btn-primary btn-sm"
                                onclick="viewDocument('${item.documentPath}')">
                                View
                            </button>

                            <button class="btn btn-danger btn-sm ms-2"
                                onclick="deleteDocument(${item.documentId})">
                                Delete
                            </button>
                        </td>
                    </tr>
                `);
            }
        },

        error: function () {
            showToast("Failed to load documents", "error");
        }
    });
}


// =========================
// VIEW DOCUMENT
// =========================
function viewDocument(path) {

    const fullUrl = path.startsWith("http")
        ? path
        : "http://localhost:5263/" + path;

    window.open(fullUrl, "_blank");
}


// =========================
// DELETE DOCUMENT
// =========================
function deleteDocument(documentId) {

    if (!confirm("Are you sure you want to delete this document?")) {
        return;
    }

    $.ajax({
        url: "http://localhost:5263/api/student-document/" + documentId,
        method: "DELETE",
        headers: getTokenHeader(),

        success: function () {
            showToast("Document deleted successfully", "success");
            loadDocuments();
        },

        error: function (xhr) {
            console.log(xhr.responseText);

            if (xhr.status === 404) {
                showToast("API not found", "error");
                return;
            }

            showToast("Delete failed", "error");
        }
    });
}