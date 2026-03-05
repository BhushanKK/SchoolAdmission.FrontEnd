$(document).ready(function () {

    const apiBase = "http://localhost:5263/api";

    // ------------------------------
    // Toast helper
    // ------------------------------
    function showToast(message, type = "success") {
        const toastEl = document.getElementById('categoryToast');
        const toastMessage = document.getElementById('toastMessage');

        toastMessage.textContent = message;

        toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning');
        if (type === "success") toastEl.classList.add('bg-success');
        else if (type === "error") toastEl.classList.add('bg-danger');
        else if (type === "warning") toastEl.classList.add('bg-warning');

        new bootstrap.Toast(toastEl).show();
    }

    // ------------------------------
    // Initialize DataTable
    // ------------------------------
    const table = $('#categoryTable').DataTable({
        ajax: {
            url: `${apiBase}/categorymasters`,
            type: "GET",
            dataSrc: "" // raw array from API
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

    // ------------------------------
    // Show modal for Add
    // ------------------------------
    $('#addCategoryBtn').click(function () {
        $('#categoryId').val('');
        $('#categoryName').val('');
        const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
        modal.show();
    });

    // ------------------------------
    // Save Add/Edit
    // ------------------------------
    $('#saveCategoryBtn').click(function () {
        const id = $('#categoryId').val();
        const payload = {
            categoryId: parseInt(id) || 0,
            Category: $('#categoryName').val().trim()
        };

        if (!payload.Category) {
            alert("Please enter Category Name");
            return;
        }

        if (id) {
            // Edit
            $.ajax({
                url: `${apiBase}/categorymasters/${id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                success: function (res) {
                    $('#categoryModal').modal('hide');
                    table.ajax.reload();
                    showToast(res.message || "Category updated successfully", "success");
                },
                error: function () {
                    showToast("Failed to update category", "error");
                }
            });
        } else {
            // Add
            $.ajax({
                url: `${apiBase}/categorymasters`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                success: function (res) {
                    $('#categoryModal').modal('hide');
                    table.ajax.reload();
                    showToast(res.message || "Category added successfully", "success");
                    console.log("New Category ID:", res.data); // number only
                },
                error: function () {
                    showToast("Failed to add category", "error");
                }
            });
        }
    });

    // ------------------------------
    // Edit button
    // ------------------------------
    $('#categoryTable').on('click', '.editBtn', function () {
        const id = $(this).data('id');
        $.get(`${apiBase}/categorymasters/${id}`, function (res) {
            // API returns raw object
            $('#categoryId').val(res.categoryId);
            $('#categoryName').val(res.category);

            const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
            modal.show();
        });
    });

    // ------------------------------
    // Delete button
    // ------------------------------
    $('#categoryTable').on('click', '.deleteBtn', function () {
        const id = $(this).data('id');
        if (confirm("Are you sure to delete this category?")) {
            $.ajax({
                url: `${apiBase}/categorymasters/${id}`,
                method: 'DELETE',
                success: function (res) {
                    table.ajax.reload();
                    showToast(res.message || "Category deleted successfully", "success");
                },
                error: function () {
                    showToast("Failed to delete category", "error");
                }
            });
        }
    });
});