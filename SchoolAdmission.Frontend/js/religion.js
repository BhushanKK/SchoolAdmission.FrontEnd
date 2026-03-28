$(document).ready(function () {

    const apiBase = "http://localhost:5263/api";

    const table = $('#religionTable').DataTable({
        ajax: {
            url: `${apiBase}/religionmasters`,
            type: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            dataSrc: "data",
            error: function (xhr) {
                if (xhr.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
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
                        <button class="btn btn-sm btn-warning editBtn" data-id="${row.religionId}">Edit</button>
                        <button class="btn btn-sm btn-danger deleteBtn" data-id="${row.religionId}">Delete</button>
                    `;
                }
            }
        ]
    });

    $('#addReligionBtn').click(function () {
        $('#religionId').val('');
        $('#religionName').val('');
        const modal = new mdb.Modal(document.getElementById('religionModal'));
        modal.show();
    });

    $('#saveReligionBtn').click(function () {
        const id = $('#religionId').val();
        const payload = {
            religionId: parseInt(id) || 0,
            religion: $('#religionName').val().trim()
        };

        if (!payload.religion) {
            showToast("Please enter Religion Name", "warning");
            return;
        }

        const method = id ? "PUT" : "POST";
        const url = id ? `${apiBase}/religionmasters/${id}` : `${apiBase}/religionmasters`;

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
                let message = "Something went wrong";
                if (xhr.responseJSON && xhr.responseJSON.errors) {
                    message = xhr.responseJSON.errors.join("\n");
                }
                showToast(message, "error");
            }
        });
    });

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

    let deleteId = 0;
    $('#religionTable').on('click', '.deleteBtn', function () {
        deleteId = $(this).data('id');
        const modal = new mdb.Modal(document.getElementById("deleteConfirmModal"));
        modal.show();
    });

    $('#confirmDeleteBtn').click(function () {
        if (!deleteId) return;

        $.ajax({
            url: `${apiBase}/religionmasters/${deleteId}`,
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
            error: function () {
                const modalEl = document.getElementById("deleteConfirmModal");
                mdb.Modal.getInstance(modalEl)?.hide();

                showToast("Delete failed", "error");
            }
        });
    });
});