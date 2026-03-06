$(document).ready(function () {

    const apiBase = "http://localhost:5263/api/standardmasters";

    function showToast(message, type = "success") {
        const toastEl = document.getElementById('standardToast');
        const toastMessage = document.getElementById('toastMessage');

        toastMessage.textContent = message;

        toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning');
        if (type === "success") toastEl.classList.add('bg-success');
        else if (type === "error") toastEl.classList.add('bg-danger');
        else if (type === "warning") toastEl.classList.add('bg-warning');

        new bootstrap.Toast(toastEl).show();
    }

    // Initialize DataTable
    const table = $('#standardTable').DataTable({
        ajax: {
            url: apiBase,
            type: "GET",
            dataSrc: function (res) {
                if (res.success && Array.isArray(res.data)) return res.data;
                showToast(res.message || "Failed to load standards", "error");
                return [];
            }
        },
        columns: [
            { data: "standardId" },
            { data: "standardName" }, // <-- corrected property
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

    // Show modal for Add
    $('#addStandardBtn').click(function () {
        $('#standardId').val('');
        $('#standardName').val('');
        const modal = new bootstrap.Modal(document.getElementById('standardModal'));
        modal.show();
    });

    // Save Add/Edit
    $('#saveStandardBtn').click(function () {
        const id = $('#standardId').val();
        const payload = {
            standardId: parseInt(id) || 0,
            standardName: $('#standardName').val().trim() // <-- corrected property
        };

        if (!payload.standardName) {
            alert("Please enter Standard Name");
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
                        showToast(res.message || "Failed to update standard", "error");
                        return;
                    }

                    const modalEl = document.getElementById('standardModal');
                    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                    modal.hide();

                    table.ajax.reload(null, false);
                    showToast(res.message || "Standard updated successfully", "success");
                },
                error: function (xhr) {
                    console.error("Update failed:", xhr.responseText);
                    showToast("Failed to update standard", "error");
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
                        showToast(res.message || "Failed to add standard", "error");
                        return;
                    }

                    const modalEl = document.getElementById('standardModal');
                    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                    modal.hide();

                    table.ajax.reload(null, false);
                    showToast(res.message || "Standard added successfully", "success");
                },
                error: function () {
                    showToast("Failed to add standard", "error");
                }
            });
        }
    });

    // Edit button
    $('#standardTable').on('click', '.editBtn', function () {
        const rowData = table.row($(this).closest('tr')).data();
        if (!rowData) {
            showToast("Failed to get standard data", "error");
            return;
        }

        $('#standardId').val(rowData.standardId);
        $('#standardName').val(rowData.standardName); // <-- corrected property

        const modalEl = document.getElementById('standardModal');
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    });

    // Delete button
    $('#standardTable').on('click', '.deleteBtn', function () {
        const rowData = table.row($(this).closest('tr')).data();
        if (!rowData) {
            showToast("Failed to get standard data", "error");
            return;
        }

        if (confirm("Are you sure to delete this standard?")) {
            $.ajax({
                url: `${apiBase}/${rowData.standardId}`,
                method: 'DELETE',
                success: function (res) {
                    if (!res.success) {
                        showToast(res.message || "Failed to delete standard", "error");
                        return;
                    }
                    table.ajax.reload(null, false);
                    showToast(res.message || "Standard deleted successfully", "success");
                },
                error: function () {
                    showToast("Failed to delete standard", "error");
                }
            });
        }
    });

});