$(document).ready(function () {

    const apiBase = "http://localhost:5263/api";

    const table = $('#commiteTable').DataTable({
        ajax: {
            url: `${apiBase}/commitemasters`,
            type: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },

            dataSrc: function (json) {
                console.log("API RESPONSE:", json);
                if (json.data) return json.data;
                return [json];
            },
            error: function (xhr) {
                if (xhr.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                } else {
                    showToast("Failed to load committee", "error");
                }
            }
        },

        columns: [
            { data: "committeeId", defaultContent: "-" },
            { data: "committeeName", defaultContent: "-" },
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-warning editBtn" data-id="${row.committeeId}">Edit</button>
                        <button class="btn btn-sm btn-danger deleteBtn" data-id="${row.committeeId}">Delete</button>
                    `;
                }
            }
        ]
    });

    $('#addCommitteeBtn').click(function () {
        $('#committeeId').val('');
        $('#committeeName').val('');

        const modal = new mdb.Modal(document.getElementById('commiteModal'));
        modal.show();
    });

     
    $('#saveCommitteeBtn').click(function () {

        const id = $('#committeeId').val();
        const committeeName = $('#committeeName').val().trim();

        if (!committeeName) {
            showToast("Please enter Committee Name", "warning");
            return;
        }

        const payload = {
            committeeId: parseInt(id) || 0,
            committeeName: committeeName
        };

        const method = id ? "PUT" : "POST";
        const url = id
            ? `${apiBase}/commitemasters/${id}`
            : `${apiBase}/commitemasters`;

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
                showToast(res.message || (id ? "Committee updated successfully" : "Committee added successfully"), "success");
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


    $('#commiteTable').on('click', '.editBtn', function () {

        const rowData = table.row($(this).closest('tr')).data();

        if (!rowData) {
            showToast("Unable to load record", "error");
            return;
        }

        $('#committeeId').val(rowData.committeeId);
        $('#committeeName').val(rowData.committeeName);

        const modal = new mdb.Modal(document.getElementById('commiteModal'));
        modal.show();
    });

    
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
                showToast(res.message || "Committee deleted successfully", "success");
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