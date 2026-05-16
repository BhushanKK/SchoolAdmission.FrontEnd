$(document).ready(function () {

    loadDocuments();

    const studentId = localStorage.getItem("studentId");

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
            showToast("Please select file", "error");
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

                showToast("Upload failed", "error");
            }
        });
    });

    let deleteDocId = 0;

    $(document).on('click', '.deleteDocumentBtn', function () {
        deleteDocId = $(this).data('id');

        const modal = new mdb.Modal(document.getElementById("deleteConfirmModal"));
        modal.show();
    });

    $('#confirmDeleteBtn').click(function () {

        if (!deleteDocId) return;

        $.ajax({
            url: documentUploadApi + "/" + deleteDocId,
            method: "DELETE",
            headers: getTokenHeader(),

            success: function () {

                const modalEl = document.getElementById("deleteConfirmModal");
                mdb.Modal.getInstance(modalEl)?.hide();

                showToast("Document deleted successfully", "success");

                loadDocuments();
            },

            error: function (xhr) {

                const modalEl = document.getElementById("deleteConfirmModal");
                mdb.Modal.getInstance(modalEl)?.hide();

                if (xhr.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                    return;
                }

                if (xhr.status === 404) {
                    showToast("API not found", "error");
                    return;
                }

                showToast("Delete failed", "error");
            }
        });
    });

});


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

                            <button class="btn btn-danger btn-sm ms-2 deleteDocumentBtn"
                                data-id="${item.documentId}">
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


function viewDocument(path) {

    const fullUrl = path.startsWith("http")
        ? path
        : "http://localhost:5263/" + path;

    window.open(fullUrl, "_blank");
}