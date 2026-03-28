$(document).ready(function () {

    const apiBase = "http://localhost:5263/api";

    const table = $('#branchTable').DataTable({
        ajax: {
            url: `${apiBase}/branchmasters`,
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
            { data: "branchId" },
            { data: "branchName" },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-warning editBtn" data-id="${row.branchId}">Edit</button>
                        <button class="btn btn-sm btn-danger deleteBtn" data-id="${row.branchId}">Delete</button>
                    `;
                }
            }
        ]
    });

    $('#addBranchBtn').click(function () {
        $('#branchId').val('');
        $('#branchName').val('');
        const modal = new mdb.Modal(document.getElementById('branchModal'));
        modal.show();
    });

    $('#saveBranchBtn').click(function () {
        const id = $('#branchId').val();
        const payload = {
            branchId: parseInt(id) || 0,
            branchName: $('#branchName').val().trim()
        };

        if (!payload.branchName) {
            showToast("Please enter Branch Name", "warning");
            return;
        }

        const method = id ? "PUT" : "POST";
        const url = id ? `${apiBase}/branchmasters/${id}` : `${apiBase}/branchmasters`;

        $.ajax({
            url: url,
            method: method,
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function (res) {
                const modalEl = document.getElementById('branchModal');
                mdb.Modal.getInstance(modalEl)?.hide();

                table.ajax.reload(null, false);
                showToast(res.message || (id ? "Branch updated successfully" : "Branch added successfully"), "success");
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

    $('#branchTable').on('click', '.editBtn', function () {
        const rowData = table.row($(this).closest('tr')).data();
        if (!rowData) {
            showToast("Unable to load record", "error");
            return;
        }

        $('#branchId').val(rowData.branchId);
        $('#branchName').val(rowData.branchName);

        const modal = new mdb.Modal(document.getElementById('branchModal'));
        modal.show();
    });

    let deleteId = 0;
    $('#branchTable').on('click', '.deleteBtn', function () {
        deleteId = $(this).data('id');
        const modal = new mdb.Modal(document.getElementById("deleteConfirmModal"));
        modal.show();
    });

    $('#confirmDeleteBtn').click(function () {
        if (!deleteId) return;

        $.ajax({
            url: `${apiBase}/branchmasters/${deleteId}`,
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            success: function (res) {
                const modalEl = document.getElementById("deleteConfirmModal");
                mdb.Modal.getInstance(modalEl)?.hide();

                table.ajax.reload(null, false);
                showToast(res.message || "Branch deleted successfully", "success");
            },
            error: function () {
                const modalEl = document.getElementById("deleteConfirmModal");
                mdb.Modal.getInstance(modalEl)?.hide();

                showToast("Delete failed", "error");
            }
        });
    });
});