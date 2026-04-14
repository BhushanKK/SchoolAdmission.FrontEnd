$(document).ready(function () {

    const table = $('#divisionTable').DataTable({
        ajax: {
            url: divisionApi,
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
                    showToast("Failed to load division", "error");
                }
            }
        },
        columns: [
            { data: "divisionId" },
            { data: "divisionName" },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                         <button class="btn btn-sm btn-info editBtn" data-id="${row.divisionId}" title="Edit">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button class="btn btn-sm btn-danger deleteBtn" data-id="${row.divisionId}" title="Delete">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    `;
                }
            }
        ]
    });

    // Show add division modal
    $('#addDivisionBtn').click(function () {
        $('#divisionId').val('');
        $('#divisionName').val('');
        const modal = new mdb.Modal(document.getElementById('divisionModal'));
        modal.show();
    });

    // Save division
    $('#savedivisionBtn').click(function () {
        const id = $('#divisionId').val();
        const divisionName = $('#divisionName').val().trim();

        if (!divisionName) {
            showToast("Please enter Division Name", "warning");
            return;
        }

        const payload = {
            divisionId: parseInt(id) || 0,
            divisionName: divisionName
        };

        const method = id ? "PUT" : "POST";
        const url = id ? `${divisionApi}/${id}` : divisionApi;

        $.ajax({
            url: url,
            method: method,
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            contentType: "application/json",
            data: JSON.stringify(payload),

            success: function (res) {
                const modalEl = document.getElementById('divisionModal');
                mdb.Modal.getInstance(modalEl)?.hide();

                table.ajax.reload(null, false);
                showToast(res.message || (id ? "Division updated successfully" : "Division added successfully"), "success");
            },

            error: function (xhr) {
                const modalEl = document.getElementById('divisionModal');
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

    // Edit Division
    $('#divisionTable').on('click', '.editBtn', function () {
        const rowData = table.row($(this).closest('tr')).data();
        if (!rowData) {
            showToast("Unable to load record", "error");
            return;
        }

        $('#divisionId').val(rowData.divisionId);
        $('#divisionName').val(rowData.divisionName);

        const modal = new mdb.Modal(document.getElementById('divisionModal'));
        modal.show();
    });

    // Delete division
    let deleteId = 0;
    $('#divisionTable').on('click', '.deleteBtn', function () {
        deleteId = $(this).data('id');
        const modal = new mdb.Modal(document.getElementById("deleteConfirmModal"));
        modal.show();
    });

    $('#confirmDeleteBtn').click(function () {
        if (!deleteId) return;

        $.ajax({
            url: `${divisionApi}/${deleteId}`,
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },

            success: function (res) {
                const modalEl = document.getElementById("deleteConfirmModal");
                mdb.Modal.getInstance(modalEl)?.hide();

                table.ajax.reload(null, false);
                showToast(res.message || "Division deleted successfully", "success");
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