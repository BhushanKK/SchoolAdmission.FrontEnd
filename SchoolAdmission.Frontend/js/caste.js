$(document).ready(function () {

    const apiBase = "http://localhost:5263/api";
    const categoryApi = apiBase + "/categorymasters";

    // Function to load categories into dropdown
    function loadCategories(selectedId = null) {
        $.get(categoryApi, function (response) {
            const select = $('#categoryId');
            select.empty();
            select.append('<option value="">-- Select Category --</option>');

            response.data.forEach(cat => {
                const isSelected = selectedId && selectedId == cat.categoryId ? 'selected' : '';
                select.append(`<option value="${cat.categoryId}" ${isSelected}>${cat.category}</option>`);
            });
        });
    }

    // Initialize DataTable
    const table = $('#casteTable').DataTable({
        ajax: {
            url: apiBase + "/castemaster",
            type: "GET",
            dataSrc: "data"
        },
        columns: [
            { data: "casteId" },
            { data: "categoryName" },
            { data: "caste" },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-warning editBtn" data-id="${row.casteId}">Edit</button>
                        <button class="btn btn-sm btn-danger deleteBtn" data-id="${row.casteId}">Delete</button>
                    `;
                }
            }
        ],
        responsive: true,
        lengthChange: true,
        autoWidth: false
    });

    // Show modal for Add
    $('#addCasteBtn').click(function () {
        $('#casteId').val('');
        $('#caste').val('');
        loadCategories(); // load dropdown for Add
        var modal = new bootstrap.Modal(document.getElementById('casteModal'));
        modal.show();
    });

    // Save button (Add or Edit)
    $('#saveCasteBtn').click(function () {
        const id = $('#casteId').val();
        const payload = {
            casteId: parseInt(id) || 0,
            categoryId: parseInt($('#categoryId').val()),
            caste: $('#caste').val()
        };

        if (!payload.categoryId || !payload.caste) {
            alert("Please select category and enter caste");
            return;
        }

        if (id) {
            // Edit / Update
            $.ajax({
                url: `${apiBase}/castemaster/${id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                success: function (res) {
                    $('#casteModal').modal('hide'); // hide modal
                    table.ajax.reload();
                    if (res.success) {
                        showToast(res.message, "success");
                    } else {
                        showToast(res.message, "error");
                    }
                },
                error: function () {
                    alert("Failed to update caste");
                }
            });
        } else {
            // Add / Create
            $.ajax({
                url: `${apiBase}/castemaster`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                success: function (res) {
                    $('#casteModal').modal('hide'); // hide modal
                    table.ajax.reload();
                    if (res.success) {
                        showToast(res.message, "success");
                    } else {
                        showToast(res.message, "error");
                    }
                },
                error: function () {
                    alert("Failed to add caste");
                }
            });
        }
    });

    // Edit button click
    $('#casteTable').on('click', '.editBtn', function () {
        const id = $(this).data('id');
        $.get(`${apiBase}/castemaster/${id}`, function (res) {
            $('#casteId').val(res.data.casteId);
            $('#caste').val(res.data.caste);
            loadCategories(res.data.categoryId); // load categories and select current
            var modal = new bootstrap.Modal(document.getElementById('casteModal'));
            modal.show();
        });
    });

    // Delete button click
    $('#casteTable').on('click', '.deleteBtn', function () {
        const id = $(this).data('id');
        if (confirm("Are you sure to delete this caste?")) {
            $.ajax({
                url: `${apiBase}/castemaster/${id}`,
                method: 'DELETE',
                success: function (res) {
                    table.ajax.reload();
                    if (res.success) {
                        showToast(res.message, "success");
                    } else {
                        showToast(res.message, "error");
                    }
                },
                error: function () {
                    alert("Failed to delete caste");
                }
            });
        }
    });
    function showToast(message, type = "success") {
        const toastEl = document.getElementById('casteToast');
        const toastMessage = document.getElementById('toastMessage');

        // Change message
        toastMessage.textContent = message;

        // Change color based on type
        toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning');
        if (type === "success") toastEl.classList.add('bg-success');
        else if (type === "error") toastEl.classList.add('bg-danger');
        else if (type === "warning") toastEl.classList.add('bg-warning');

        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }
});