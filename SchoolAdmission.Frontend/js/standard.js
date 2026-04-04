$(document).ready(function () {

    const apiBase = "http://localhost:5263/api";

    const table = $('#standardTable').DataTable({
        ajax: {
            url: `${apiBase}/standardmasters`,
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
                    showToast("Failed to load standards", "error");
                }
            }
        },
        columns: [
            { data: "standardId" },
            { data: "standardName" },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-info editBtn" data-id="${row.standardId}" title="Edit">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button class="btn btn-sm btn-danger deleteBtn" data-id="${row.standardId}" title="Delete">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    `;
                }
            }
        ]
    });

    // Add Standard
    $('#addStandardBtn').click(function () {
        $('#standardId').val('');
        $('#standardName').val('');
        const modal = new mdb.Modal(document.getElementById('standardModal'));
        modal.show();
    });

    // Save Standard
    $('#saveStandardBtn').click(function () {
        const id = $('#standardId').val();
        const standardName = $('#standardName').val().trim();

        if (!standardName) {
            showToast("Please enter Standard Name", "warning");
            return;
        }

        const payload = {
            standardId: parseInt(id) || 0,
            standardName: standardName
        };

        const method = id ? "PUT" : "POST";
        const url = id ? `${apiBase}/standardmasters/${id}` : `${apiBase}/standardmasters`;

        $.ajax({
            url: url,
            method: method,
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            contentType: "application/json",
            data: JSON.stringify(payload),

            success: function (res) {
                const modalEl = document.getElementById('standardModal');
                mdb.Modal.getInstance(modalEl)?.hide();

                table.ajax.reload(null, false);
                showToast(res.message || (id ? "Standard updated successfully" : "Standard added successfully"), "success");
            },

            error: function (xhr) {
                const modalEl = document.getElementById('standardModal');
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

    // Edit Standard
    $('#standardTable').on('click', '.editBtn', function () {
        const rowData = table.row($(this).closest('tr')).data();
        if (!rowData) {
            showToast("Unable to load record", "error");
            return;
        }

        $('#standardId').val(rowData.standardId);
        $('#standardName').val(rowData.standardName); // FIXED

        const modal = new mdb.Modal(document.getElementById('standardModal'));
        modal.show();
    });

    // Delete Standard
    let deleteId = 0;
    $('#standardTable').on('click', '.deleteBtn', function () {
        deleteId = $(this).data('id');
        const modal = new mdb.Modal(document.getElementById("deleteConfirmModal"));
        modal.show();
    });

    $('#confirmDeleteBtn').click(function () {
        if (!deleteId) return;

        $.ajax({
            url: `${apiBase}/standardmasters/${deleteId}`,
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },

            success: function (res) {
                const modalEl = document.getElementById("deleteConfirmModal");
                mdb.Modal.getInstance(modalEl)?.hide();

                table.ajax.reload(null, false);
                showToast(res.message || "Standard deleted successfully", "success");
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