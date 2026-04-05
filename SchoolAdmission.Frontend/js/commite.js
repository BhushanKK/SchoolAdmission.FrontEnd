$(document).ready(function () {

    const apiBase = "http://localhost:5263/api";

    const table = $('#commiteTable').DataTable({
        ajax: {
            url: `${apiBase}/commitemasters`,
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
                    showToast("Failed to load Commite", "error");
                }
            }
        },
        columns: [
            { data: "commiteeId" },
            { data: "commiteeName" },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-info editBtn" data-id="${row.commiteeId}" title="Edit">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="btn btn-sm btn-danger deleteBtn" data-id="${row.commiteeId}" title="Delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
                    `;
                }
            }
        ]
    });

    // Show Add Religion Modal
    $('#addCommiteBtn').click(function () {
        $('#commiteeId').val('');
        $('#commiteeName').val('');
        const modal = new mdb.Modal(document.getElementById('commiteModal'));
        modal.show();
    });

    // Save Religion
    $('#saveCommiteBtn').click(function () {
        const id = $('#commiteeId').val();
        const commiteeName = $('#commiteeName').val().trim();

        if (!commiteeName) {
            showToast("Please enter Commitee Name", "warning");
            return;
        }

        const payload = {
            commiteeId: parseInt(id) || 0,
            commiteeName: commiteeName
        };

        const method = id ? "PUT" : "POST";
        const url = id ? `${apiBase}/commitemasters/${id}` : `${apiBase}/commitemasters`;

        $.ajax({
            url: url,
            method: method,
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            contentType: "application/json",
            data: JSON.stringify(payload),

            success: function (res) {
                const modalEl = document.getElementById('commiteModal');
                mdb.Modal.getInstance(modalEl)?.hide();

                table.ajax.reload(null, false);
                showToast(res.message || (id ? "Commite updated successfully" : "Commite added successfully"), "success");
            },

            error: function (xhr) {
                const modalEl = document.getElementById('commiteModal');
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

    // Edit Religion
    $('#commiteTable').on('click', '.editBtn', function () {
        const rowData = table.row($(this).closest('tr')).data();
        if (!rowData) {
            showToast("Unable to load record", "error");
            return;
        }

        $('#commiteeId').val(rowData.commiteeId);
        $('#commiteeName').val(rowData.commiteeName);

        const modal = new mdb.Modal(document.getElementById('commiteModal'));
        modal.show();
    });

    // Delete Religion
    let deleteId = 0;
    $('#commiteTable').on('click', '.deleteBtn', function () {
        deleteId = $(this).data('id');
        const modal = new mdb.Modal(document.getElementById("deleteConfirmModal"));
        modal.show();
    });

    $('#confirmDeleteBtn').click(function () {
        if (!deleteId) return;

        $.ajax({
            url: `${apiBase}/commitemasters/${deleteId}`,
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },

            success: function (res) {
                const modalEl = document.getElementById("deleteConfirmModal");
                mdb.Modal.getInstance(modalEl)?.hide();

                table.ajax.reload(null, false);
                showToast(res.message || "Commite deleted successfully", "success");
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