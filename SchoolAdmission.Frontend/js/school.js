$(document).ready(function () {

    const apiBase = "http://localhost:5263/api";

    const table = $('#schoolTable').DataTable({
        ajax: {
            url: `${apiBase}/schoolmasters/AllSchools`,
            type: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            dataSrc: "data",
            error: function (xhr) {
                if (xhr.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                } else {
                    showToast("Failed to load School", "error");
                }
            }
        },
        columns: [
            { data: "schoolId" },
            { data: "schoolName" },
            { data: "committeeName"},
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-info editBtn" data-id="${row.schoolId}" title="Edit">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button class="btn btn-sm btn-danger deleteBtn" data-id="${row.schoolId}" title="Delete">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        `;
                }
            }
        ]
    });

    // Show add school modal
    $('#addSchoolBtn').click(function () {
        $('#schoolId').val('');
        $('#schoolName').val('');
        const modal = new mdb.Modal(document.getElementById('schoolModal'));
        modal.show();
    });

    // Save school
    $('#saveSchoolBtn').click(function () {
        const id = $('#schoolId').val();
        const schoolName = $('#schoolName').val().trim();

        if (!schoolName) {
            showToast("Please enter School Name", "warning");
            return;
        }

        const payload = {
            schoolId: parseInt(id) || 0,
            schoolName: schoolName
        };

        const method = id ? "PUT" : "POST";
        const url = id ? `${apiBase}/schoolmasters/${id}` : `${apiBase}/schoolmasters`;

        $.ajax({
            url: url,
            method: method,
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            contentType: "application/json",
            data: JSON.stringify(payload),

            success: function (res) {
                const modalEl = document.getElementById('schoolModal');
                mdb.Modal.getInstance(modalEl)?.hide();

                table.ajax.reload(null, false);
                showToast(res.message || (id ? "School updated successfully" : "School added successfully"), "success");
            },

            error: function (xhr) {
                const modalEl = document.getElementById('schoolModal');
                mdb.Modal.getInstance(modalEl)?.hide();

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

    // Edit school
    $('#schoolTable').on('click', '.editBtn', function () {
        const rowData = table.row($(this).closest('tr')).data();
        if (!rowData) {
            showToast("Unable to load record", "error");
            return;
        }

        $('#schoolId').val(rowData.schoolId);
        $('#schoolName').val(rowData.schoolName);

        const modal = new mdb.Modal(document.getElementById('schoolModal'));
        modal.show();
    });

    // Delete School
    let deleteId = 0;
    $('#schoolTable').on('click', '.deleteBtn', function () {
        deleteId = $(this).data('id');
        const modal = new mdb.Modal(document.getElementById("deleteConfirmModal"));
        modal.show();
    });

    $('#confirmDeleteBtn').click(function () {
        if (!deleteId) return;

        $.ajax({
            url: `${apiBase}/schoolmasters/${deleteId}`,
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },

            success: function (res) {
                const modalEl = document.getElementById("deleteConfirmModal");
                mdb.Modal.getInstance(modalEl)?.hide();

                table.ajax.reload(null, false);
                showToast(res.message || "School deleted successfully", "success");
            },

            error: function (xhr) {
                const modalEl = document.getElementById("deleteConfirmModal");
                mdb.Modal.getInstance(modalEl)?.hide();

                if (xhr.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                    return;
                }

                if (xhr.status === 409 && xhr.responseJSON?.message) {
                    showToast(xhr.responseJSON.message, "exists");
                    return;
                }

                showToast("Delete failed", "error");
            }
        });
    });

});