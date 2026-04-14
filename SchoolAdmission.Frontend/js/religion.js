$(document).ready(function () {

    const table = $('#religionTable').DataTable({
        ajax: {
            url: religionApi,
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
                    showToast("Failed to load religions", "error");
                }
            }
        },
        columns: [
            { data: "religionId" },
            { data: "religion" },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-info editBtn" data-id="${row.religionId}" title="Edit">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="btn btn-sm btn-danger deleteBtn" data-id="${row.religionId}" title="Delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
                    `;
                }
            }
        ]
    });

    // Show Add Religion Modal
    $('#addReligionBtn').click(function () {
        $('#religionId').val('');
        $('#religionName').val('');
        const modal = new mdb.Modal(document.getElementById('religionModal'));
        modal.show();
    });

    // Save Religion
    $('#saveReligionBtn').click(function () {
        const id = $('#religionId').val();
        const religionName = $('#religionName').val().trim();

        if (!religionName) {
            showToast("Please enter Religion Name", "warning");
            return;
        }

        const payload = {
            religionId: parseInt(id) || 0,
            religion: religionName
        };

        const method = id ? "PUT" : "POST";
        const url = id ? `${religionApi}/${id}` : religionApi;

        $.ajax({
            url: url,
            method: method,
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            contentType: "application/json",
            data: JSON.stringify(payload),

            success: function (res) {
                const modalEl = document.getElementById('religionModal');
                mdb.Modal.getInstance(modalEl)?.hide();

                table.ajax.reload(null, false);
                showToast(res.message || (id ? "Religion updated successfully" : "Religion added successfully"), "success");
            },

            error: function (xhr) {
                const modalEl = document.getElementById('religionModal');
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
    $('#religionTable').on('click', '.editBtn', function () {
        const rowData = table.row($(this).closest('tr')).data();
        if (!rowData) {
            showToast("Unable to load record", "error");
            return;
        }

        $('#religionId').val(rowData.religionId);
        $('#religionName').val(rowData.religion);

        const modal = new mdb.Modal(document.getElementById('religionModal'));
        modal.show();
    });

    // Delete Religion
    let deleteId = 0;
    $('#religionTable').on('click', '.deleteBtn', function () {
        deleteId = $(this).data('id');
        const modal = new mdb.Modal(document.getElementById("deleteConfirmModal"));
        modal.show();
    });

    $('#confirmDeleteBtn').click(function () {
        if (!deleteId) return;

        $.ajax({
            url: `${religionApi}/${deleteId}`,
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },

            success: function (res) {
                const modalEl = document.getElementById("deleteConfirmModal");
                mdb.Modal.getInstance(modalEl)?.hide();

                table.ajax.reload(null, false);
                showToast(res.message || "Religion deleted successfully", "success");
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