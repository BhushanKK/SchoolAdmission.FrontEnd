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
                } else {
                    showToast("Failed to load categories", "error");
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
                        <button class="btn btn-sm btn-info editBtn" data-id="${row.categoryId}" title="Edit">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="btn btn-sm btn-danger deleteBtn" data-id="${row.categoryId}" title="Delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
                    `;
                }
            }
        ]
    });

    // Show add modal
    $('#addCategoryBtn').click(function () {
        $('#categoryId').val('');
        $('#categoryName').val('');
        const modal = new mdb.Modal(document.getElementById('categoryModal'));
        modal.show();
    });

    // Save category
    $('#saveCategoryBtn').click(function () {
        const id = $('#categoryId').val();
        const categoryName = $('#categoryName').val().trim();

        if (!categoryName) {
            showToast("Please enter Category Name", "warning");
            return;
        }

        const payload = {
            categoryId: parseInt(id) || 0,
            category: categoryName
        };

        const method = id ? "PUT" : "POST";
        const url = id
            ? `${categoryApi}/${id}`
            : categoryApi;

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
                const modalEl = document.getElementById('categoryModal');
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

    // Edit category
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

    // Delete category
    let deleteId = 0;
    $('#categoryTable').on('click', '.deleteBtn', function () {
        deleteId = $(this).data('id');
        const modal = new mdb.Modal(document.getElementById("deleteConfirmModal"));
        modal.show();
    });

    $('#confirmDeleteBtn').click(function () {
        if (!deleteId) return;

        $.ajax({
            url: `${categoryApi}/${deleteId}`,
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