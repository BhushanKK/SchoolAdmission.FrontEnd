$(document).ready(function () {

    function loadCategories(selectedId = null) {
        $.ajax({
            url: categoryApi,
            method: "GET",
            headers: getTokenHeader(),
            success: function (response) {

                const select = $('#categoryId');
                select.empty();
                select.append('<option value="">-- Select Category --</option>');

                response.data.forEach(cat => {

                    const selected =
                        selectedId && selectedId == cat.categoryId
                            ? "selected"
                            : "";

                    select.append(
                        `<option value="${cat.categoryId}" ${selected}>
                            ${cat.category}
                        </option>`
                    );
                });
            },
            error: function (xhr) {
                handle401(xhr);
            }
        });
    }

    const table = $('#casteTable').DataTable({
        ajax: {
            url: casteApi,
            type: "GET",
            headers: getTokenHeader(),
            dataSrc: "data",
            error: function (xhr) {
                handle401(xhr);
            }
        },
        columns: [
            { data: "casteId" },
            { data: "category" },
            { data: "caste" },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-info editBtn" data-id="${row.casteId}" title="Edit">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button class="btn btn-sm btn-danger deleteBtn" data-id="${row.casteId}" title="Delete">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    `;
                }
            }
        ]
    });

    $('#addCasteBtn').click(function () {

        $('#casteId').val('');
        $('#casteName').val('');
        loadCategories();

        const modal = new mdb.Modal(document.getElementById("casteModal"));
        modal.show();
    });

    $('#saveCasteBtn').click(function () {

        const id = $('#casteId').val();

        const payload = {
            casteId: parseInt(id) || 0,
            categoryId: parseInt($('#categoryId').val()),
            caste: $('#casteName').val().trim()
        };

        if (!payload.categoryId || !payload.caste) {
            showToast("Please select category and enter caste", "warning");
            return;
        }

        const method = id ? "PUT" : "POST";
        const url = id
            ? `${casteApi}/${id}`
            : casteApi;

        $.ajax({
            url: url,
            method: method,
            headers: getTokenHeader(),
            contentType: "application/json",
            data: JSON.stringify(payload),

            success: function (res) {

                mdb.Modal.getInstance(
                    document.getElementById("casteModal")
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

                    if (xhr.responseJSON.errors) {
                        const message = xhr.responseJSON.errors.join("\n");
                        showToast(message, "warning");
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

    $('#casteTable').on('click', '.editBtn', function () {

        const rowData = $('#casteTable')
            .DataTable()
            .row($(this).parents('tr'))
            .data();

        if (!rowData) {
            showToast("Unable to load record", "error");
            return;
        }

        $('#casteId').val(rowData.casteId);
        $('#casteName').val(rowData.caste);

        loadCategories(rowData.categoryId);

        const modal = new mdb.Modal(document.getElementById("casteModal"));
        modal.show();

    });

    let deleteId = 0;

    $('#casteTable').on('click', '.deleteBtn', function () {

        deleteId = $(this).data('id');

        const modal = new mdb.Modal(
            document.getElementById("deleteConfirmModal")
        );
        modal.show();
    });

    $('#confirmDeleteBtn').click(function () {

        if (!deleteId) return;

        $.ajax({
            url: `${casteApi}/${deleteId}`,
            type: "DELETE",
            headers: getTokenHeader(),

            success: function (res) {

                mdb.Modal.getInstance(
                    document.getElementById("deleteConfirmModal")
                ).hide();

                $('#casteTable').DataTable().ajax.reload(null, false);

                showToast(res.message, "success");
            },

            error: function (xhr) {

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