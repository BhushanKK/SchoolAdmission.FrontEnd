$(document).ready(function () {

    const table = $('#categoryTable').DataTable({
        ajax: {
            url: categoryApi,
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
            { data: "categoryId" },
            { data: "category" },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-warning editBtn" data-id="${row.categoryId}">Edit</button>
                        <button class="btn btn-sm btn-danger deleteBtn" data-id="${row.categoryId}">Delete</button>
                    `;
                }
            }
        ]
    });

    $('#addCategoryBtn').click(function () {
        $('#categoryId').val('');
        $('#categoryName').val('');
        const modal = new mdb.Modal(document.getElementById('categoryModal'));
        modal.show();
    });

    $('#saveCategoryBtn').click(function () {
        const id = $('#categoryId').val();
        const payload = {
            categoryId: parseInt(id) || 0,
            category: $('.categoryInput').val().trim()
        };

        if (!payload.category) {
            showToast("Please enter Category Name", "warning");
            return;
        }

        const method = id ? "PUT" : "POST";
        const url = id ? `${apiBase}/categorymasters/${id}` : `${apiBase}/categorymasters`;

        $.ajax({
            url: url,
            method: method,
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function (res) {
                const modalEl = document.getElementById('categoryModal');
                mdb.Modal.getInstance(modalEl)?.hide();

                table.ajax.reload(null, false);
                showToast(res.message || (id ? "Category updated successfully" : "Category added successfully"), "success");
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

    $('#categoryTable').on('click', '.editBtn', function () {
        const rowData = table.row($(this).closest('tr')).data();
        if (!rowData) {
            showToast("Unable to load record", "error");
            return;
        }

        $('#categoryId').val(rowData.categoryId);
        $('#categoryName').val(rowData.category);

        const modal = new mdb.Modal(document.getElementById('categoryModal'));
        modal.show();
    });

    let deleteId = 0;
    $('#categoryTable').on('click', '.deleteBtn', function () {
        deleteId = $(this).data('id');
        const modal = new mdb.Modal(document.getElementById("deleteConfirmModal"));
        modal.show();
    });

    $('#confirmDeleteBtn').click(function () {
        if (!deleteId) return;

        $.ajax({
            url: `${apiBase}/categorymasters/${deleteId}`,
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            success: function (res) {
                const modalEl = document.getElementById("deleteConfirmModal");
                mdb.Modal.getInstance(modalEl)?.hide();

                table.ajax.reload(null, false);
                showToast(res.message || "Category deleted successfully", "success");
            },
            error: function () {
                const modalEl = document.getElementById("deleteConfirmModal");
                mdb.Modal.getInstance(modalEl)?.hide();

                showToast("Delete failed", "error");
            }
        });
    });
});