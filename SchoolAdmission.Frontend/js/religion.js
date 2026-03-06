// religion.js
$(document).ready(function () {

    const apiBase = "http://localhost:5263/api/religionmasters";

    // ------------------------------
    // Toast helper
    // ------------------------------
    function showToast(message, type = "success") {
        const toastEl = document.getElementById('religionToast');
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
    const table = $('#religionTable').DataTable({
        ajax: {
            url: apiBase,
            type: "GET",
            dataSrc: function (res) {
                if (res.success && Array.isArray(res.data)) return res.data;
                showToast(res.message || "Failed to load religions", "error");
                return [];
            }
        },
        columns: [
            { data: "religionId" },
            { data: "religion" },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-warning editBtn">Edit</button>
                        <button class="btn btn-sm btn-danger deleteBtn">Delete</button>
                    `;
                }
            }
        ]
    });

    // ------------------------------
    // Show modal for Add
    // ------------------------------
    $('#addReligionBtn').click(function () {
        $('#religionId').val('');
        $('#religionName').val('');
        const modal = new bootstrap.Modal(document.getElementById('religionModal'));
        modal.show();
    });

    // ------------------------------
    // Save Add/Edit
    // ------------------------------
    $('#saveReligionBtn').click(function () {
        const id = $('#religionId').val();
        const payload = {
            religionId: parseInt(id) || 0,
            religion: $('#religionName').val().trim()
        };

        if (!payload.religion) {
            alert("Please enter Religion Name");
            return;
        }

        if (id) {
            // Update
            $.ajax({
                url: `${apiBase}/${id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                success: function (res) {
                    if (!res.success) {
                        showToast(res.message || "Failed to update religion", "error");
                        return;
                    }

                    const modalEl = document.getElementById('religionModal');
                    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                    modal.hide();

                    table.ajax.reload(null, false);
                    showToast(res.message || "Religion updated successfully", "success");
                },
                error: function (xhr) {
                    console.error("Update failed:", xhr.responseText);
                    showToast("Failed to update religion", "error");
                }
            });
        } else {
            // Add
            $.ajax({
                url: apiBase,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                success: function (res) {
                    if (!res.success) {
                        showToast(res.message || "Failed to add religion", "error");
                        return;
                    }

                    const modalEl = document.getElementById('religionModal');
                    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                    modal.hide();

                    table.ajax.reload(null, false);
                    showToast(res.message || "Religion added successfully", "success");
                },
                error: function () {
                    showToast("Failed to add religion", "error");
                }
            });
        }
    });

    // ------------------------------
    // Edit button
    // ------------------------------
    $('#religionTable').on('click', '.editBtn', function () {
        const rowData = table.row($(this).closest('tr')).data();
        if (!rowData) {
            showToast("Failed to get religion data", "error");
            return;
        }

        $('#religionId').val(rowData.religionId);
        $('#religionName').val(rowData.religion);

        const modalEl = document.getElementById('religionModal');
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    });

    // ------------------------------
    // Delete button
    // ------------------------------
    $('#religionTable').on('click', '.deleteBtn', function () {
        const rowData = table.row($(this).closest('tr')).data();
        if (!rowData) {
            showToast("Failed to get religion data", "error");
            return;
        }

        if (confirm("Are you sure to delete this religion?")) {
            $.ajax({
                url: `${apiBase}/${rowData.religionId}`,
                method: 'DELETE',
                success: function (res) {
                    if (!res.success) {
                        showToast(res.message || "Failed to delete religion", "error");
                        return;
                    }
                    table.ajax.reload(null, false);
                    showToast(res.message || "Religion deleted successfully", "success");
                },
                error: function () {
                    showToast("Failed to delete religion", "error");
                }
            });
        }
    });

});