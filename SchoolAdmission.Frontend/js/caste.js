$(document).ready(function () {

    const apiBase = "http://localhost:5263/api";
    const categoryApi = apiBase + "/categorymasters";

    function getTokenHeader() {
        return {
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        };
    }

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

    /* ⭐ DataTable */
    const table = $('#casteTable').DataTable({
        ajax: {
            url: apiBase + "/castemaster",
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
                        <button class="btn btn-sm btn-warning editBtn" data-id="${row.casteId}">Edit</button>
                        <button class="btn btn-sm btn-danger deleteBtn" data-id="${row.casteId}">Delete</button>
                    `;
                }
            }
        ]
    });

    /* ⭐ Add Button */
    $('#addCasteBtn').click(function () {

        $('#casteId').val('');
        $('#casteName').val('');
        loadCategories();

        const modal = new mdb.Modal(document.getElementById("casteModal"));
        modal.show();
    });

    /* ⭐ Save */
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
            ? `${apiBase}/castemaster/${id}`
            : `${apiBase}/castemaster`;

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

                if (xhr.responseJSON && xhr.responseJSON.errors) {

                    const message = xhr.responseJSON.errors.join("\n");

                    if (message.toLowerCase().includes("already")) {
                        showToast(message, "exists"); 
                    }
                    else {
                        showToast(message, "error");
                    }
                    return;
                }

                showToast("Something went wrong", "error");
            }
        });

    });

    /* ⭐ Edit */
    $('#casteTable').on('click', '.editBtn', function () {

        /* ⭐ get datatable row data directly */
        const rowData = $('#casteTable')
            .DataTable()
            .row($(this).parents('tr'))
            .data();

        console.log("Edit Row:", rowData);

        if (!rowData) {
            showToast("Unable to load record", "error");
            return;
        }

        /* ⭐ fill modal fields */
        $('#casteId').val(rowData.casteId);
        $('#casteName').val(rowData.caste);

        /* ⭐ load category dropdown */
        loadCategories(rowData.categoryId);

        /* ⭐ open modal */
        const modal = new mdb.Modal(document.getElementById("casteModal"));
        modal.show();

    });

    let deleteId = 0;

    /* ⭐ open confirmation modal */
    $('#casteTable').on('click', '.deleteBtn', function () {

        deleteId = $(this).data('id');

        const modal = new mdb.Modal(
            document.getElementById("deleteConfirmModal")
        );
        modal.show();
    });


    /* ⭐ confirmed delete */
    $('#confirmDeleteBtn').click(function () {

        if (!deleteId) return;

        $.ajax({
            url: `${apiBase}/castemaster/${deleteId}`,
            type: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            success: function (res) {

                mdb.Modal.getInstance(
                    document.getElementById("deleteConfirmModal")
                ).hide();

                $('#casteTable').DataTable().ajax.reload(null, false);

                showToast(res.message, "success");
            },
            error: function () {

                mdb.Modal.getInstance(
                    document.getElementById("deleteConfirmModal")
                ).hide();

                showToast("Delete failed", "info");
            }
        });

    });

    /* ⭐ Toast */
    function showToast(message, type = "success") {

        const toastEl = document.getElementById("casteToast");
        const toastMsg = document.getElementById("toastMessage");

        toastMsg.innerText = message;

        toastEl.classList.remove(
            "bg-success",
            "bg-danger",
            "bg-warning",
            "bg-info"
        );

        if (type === "success")
            toastEl.classList.add("bg-success");

        else if (type === "exists" || type === "warning")
            toastEl.classList.add("bg-warning");

        else if (type === "info") 
            toastEl.classList.add("bg-info");

        else
            toastEl.classList.add("bg-danger");

        const toast = new mdb.Toast(toastEl);
        toast.show();
    }

    function handle401(xhr) {
        if (xhr.status === 401) {
            alert("Session expired. Please login again.");
            localStorage.clear();
            window.location.href = "../index.html";
        }
    }

});