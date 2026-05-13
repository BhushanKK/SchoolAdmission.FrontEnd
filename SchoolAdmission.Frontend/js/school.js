$(document).ready(function () {
    loadCommittees();
    const table = $('#schoolTable').DataTable({
        ajax: {
            url: `${schoolApi}/AllSchools`,
            type: "GET",
            headers: getTokenHeader(),
            dataSrc: "data",
            error: function (xhr) {
                if (xhr.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                } else {
                    showToast("Failed to load School", "error");
                }
            }
        },
        columns: [
            { data: "schoolId" },
            { data: "schoolName" },
            { data: "committeeName" },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-info editBtn" data-id="${row.schoolId}" title="Edit">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button class="btn btn-sm btn-danger deleteBtn" data-id="${row.schoolId}" title="Delete">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        `;
                }
            }
        ]
    });

    // Show add school modal
    $('#addSchoolBtn').click(function () {
        $('#schoolId').val('');
        $('#schoolName').val('');
        $('#committee').val('');
        const modal = new mdb.Modal(document.getElementById('schoolModal'));
        modal.show();
    });

    // Save school
    $('#saveSchoolBtn').click(function () {
        const id = $('#schoolId').val();
        const schoolName = $('#schoolName').val().trim();
        const committeeValue = $('#committee').val();
        const committeeId = committeeValue ? parseInt(committeeValue, 10) : NaN;

        if (!schoolName) {
            showToast("Please enter School Name", "warning");
            return;
        }
        if (!committeeValue || isNaN(committeeId)) {
            showToast("Please select a Committee", "warning");
            return;
        }
        const payload = {
            schoolId: parseInt(id, 10) || 0,
            schoolName: schoolName,
            committeeId: committeeId,
            commiteeId: committeeId
        };

        const method = id ? "PUT" : "POST";
        const url = id ? `${schoolApi}/${id}` : schoolApi;

        $.ajax({
            url: url,
            method: method,
            headers: getTokenHeader(),
            contentType: "application/json",
            data: JSON.stringify(payload),

            success: function (res) {
                const modalEl = document.getElementById('schoolModal');
                mdb.Modal.getInstance(modalEl)?.hide();

                table.ajax.reload(null, false);
                showToast(res.message || (id ? "School updated successfully" : "School added successfully"), "success");
            },

            error: function (xhr) {
                const modalEl = document.getElementById('schoolModal');
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

    // Edit school
    $('#schoolTable').on('click', '.editBtn', function () {
        const rowData = table.row($(this).closest('tr')).data();
        if (!rowData) {
            showToast("Unable to load record", "error");
            return;
        }

        $('#schoolId').val(rowData.schoolId);
        $('#schoolName').val(rowData.schoolName);
        const selectedCommitteeId = rowData.committeeId ?? rowData.commiteeId;
        $('#committee').val(selectedCommitteeId);

        const modal = new mdb.Modal(document.getElementById('schoolModal'));
        modal.show();
    });

    // Delete School
    let deleteId = 0;
    $('#schoolTable').on('click', '.deleteBtn', function () {
        deleteId = $(this).data('id');
        const modal = new mdb.Modal(document.getElementById("deleteConfirmModal"));
        modal.show();
    });

    $('#confirmDeleteBtn').click(function () {
        if (!deleteId) return;

        $.ajax({
            url: `${schoolApi}/${deleteId}`,
            method: "DELETE",
            headers: getTokenHeader(),

            success: function (res) {
                const modalEl = document.getElementById("deleteConfirmModal");
                mdb.Modal.getInstance(modalEl)?.hide();

                table.ajax.reload(null, false);
                showToast(res.message || "School deleted successfully", "success");
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

function loadCommittees() {
    $.ajax({
        url: registerCommitteeApi,
        type: "GET",
        success: function (response) {
            let dropdown = $("#committee");
            dropdown.empty().append(`<option value="">Select Committee</option>`);
            if (response.success && response.data) {
                response.data.forEach(item => {
                    const committeeId = item.committeeId ?? item.commiteeId;
                    dropdown.append(`<option value="${committeeId}">${item.commiteeName}</option>`);
                });
            }
        },
        error: function () {
            $("#errorMsg").text("Failed to load committees");
        }
    });
}