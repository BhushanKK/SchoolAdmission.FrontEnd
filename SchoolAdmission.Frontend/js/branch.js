$(document).ready(function () {

    const table = $('#branchTable').DataTable({
        ajax: {
            url: branchApi,
            type: "GET",
            headers: getTokenHeader(),
            dataSrc: "data",
            error: function (xhr) {
                handle401(xhr);
            }
        },
        columns: [
            { data: "branchId" },
            { data: "branchName" },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-info editBtn" data-id="${row.branchId}">
                            <i class="fas fa-pencil-alt"></i>
                        </button>

                        <button class="btn btn-sm btn-danger deleteBtn" data-id="${row.branchId}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    `;
                }
            }
        ]
    });

    $('#addBranchBtn').click(function () {

        $('#branchId').val('');
        $('#branchName').val('');

        const modal = new mdb.Modal(document.getElementById("branchModal"));
        modal.show();
    });

    $('#saveBranchBtn').click(function () {

        const id = $('#branchId').val();

        const payload = {
            branchId: parseInt(id) || 0,
            branchName: $('#branchName').val().trim()
        };

        if (!payload.branchName) {
            showToast("Please enter branch name", "warning");
            return;
        }

        const method = id ? "PUT" : "POST";
        const url = id ? `${branchApi}/${id}` : branchApi;

        $.ajax({
            url: url,
            method: method,
            headers: getTokenHeader(),
            contentType: "application/json",
            data: JSON.stringify(payload),

            success: function (res) {

                mdb.Modal.getInstance(
                    document.getElementById("branchModal")
                ).hide();

                table.ajax.reload();

                showToast(res.message, "success");
            },

            error: function (xhr) {

                if (xhr.status === 401) {
                    handle401(xhr);
                    return;
                }

                if (xhr.responseJSON) {

                    if (xhr.status === 409) {
                        showToast(xhr.responseJSON.message, "exists");
                        return;
                    }

                    if (xhr.responseJSON.message) {
                        showToast(xhr.responseJSON.message, "error");
                        return;
                    }
                }

                showToast("Something went wrong", "error");
            }
        });

    });

    $('#branchTable').on('click', '.editBtn', function () {

        const rowData = $('#branchTable')
            .DataTable()
            .row($(this).parents('tr'))
            .data();

        if (!rowData) {
            showToast("Unable to load record", "error");
            return;
        }

        $('#branchId').val(rowData.branchId);
        $('#branchName').val(rowData.branchName);

        const modal = new mdb.Modal(document.getElementById("branchModal"));
        modal.show();
    });

    let deleteId = 0;

    $('#branchTable').on('click', '.deleteBtn', function () {

        deleteId = $(this).data('id');

        const modal = new mdb.Modal(
            document.getElementById("deleteConfirmModal")
        );
        modal.show();
    });

    $('#confirmDeleteBtn').click(function () {

        if (!deleteId) return;

        $.ajax({
            url: `${branchApi}/${deleteId}`,
            type: "DELETE",
            headers: getTokenHeader(),

            success: function (res) {
                
                document.activeElement.blur();
                mdb.Modal.getInstance(
                    document.getElementById("deleteConfirmModal")
                ).hide();

                $('#branchTable').DataTable().ajax.reload(null, false);

                showToast(res.message, "success");
            },

            error: function (xhr) {
                document.activeElement.blur();
                mdb.Modal.getInstance(
                    document.getElementById("deleteConfirmModal")
                ).hide();

                if (xhr.status === 401) {
                    handle401(xhr);
                    return;
                }

                showToast("Delete failed", "error");
            }
        });
    });

});