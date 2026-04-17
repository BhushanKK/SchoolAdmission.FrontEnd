$(document).ready(function () {

    const table = $('#subjectTable').DataTable({
        ajax: {
            url: subjectApi,
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
                    showToast("Failed to load subjects", "error");
                }
            }
        },

        columns: [
            { data: "subjectId" },
            { data: "branchId" },
            {
                data: "groupId",
                render: function (data) {

                    if (data == 1) return "Mandatory";
                    if (data == 2) return "Optional";

                    return data;
                }
            },
            { data: "subjectName" },

            {
                data: null,
                render: function (data, type, row) {

                    return `
                        <button class="btn btn-sm btn-info editBtn"
                            data-id="${row.subjectId}" title="Edit">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                    `;
                }
            }
        ]
    });


    function loadBranches(selectedId = null) {

        $.ajax({
            url: branchApi,
            type: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },

            success: function (res) {

                $('#branchId').html(
                    '<option value="">Select Branch</option>'
                );

                res.data.forEach(function (item) {

                    const selected =
                        selectedId == item.branchId
                            ? "selected"
                            : "";

                    $('#branchId').append(`
                        <option value="${item.branchId}" ${selected}>
                            ${item.branchName}
                        </option>
                    `);

                });

            },

            error: function (xhr) {

                if (xhr.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                } else {
                    showToast("Failed to load branches", "error");
                }
            }

        });

    }


    $('#addSubjectBtn').click(function () {

        $('#subjectId').val('');
        $('#branchId').val('');
        $('#groupId').val('');
        $('#subjectName').val('');

        loadBranches();

        const modal = new mdb.Modal(
            document.getElementById('subjectModal')
        );

        modal.show();

    });

    $('#saveSubjectBtn').click(function () {

        const id = $('#subjectId').val();

        const payload = {
            subjectId: parseInt(id) || 0,
            branchId: parseInt($('#branchId').val()) || 0,
            groupId: parseInt($('#groupId').val()) || 0,
            subjectName: $('#subjectName').val().trim()
        };

        if (!payload.branchId) {
            showToast("Please select Branch", "warning");
            return;
        }

        if (!payload.groupId) {
            showToast("Please select Group", "warning");
            return;
        }

        if (!payload.subjectName) {
            showToast("Please enter Subject Name", "warning");
            return;
        }

        const method = id ? "PUT" : "POST";
        const url = id
            ? `${subjectApi}/${id}`
            : subjectApi;


        $.ajax({

            url: url,
            method: method,

            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },

            contentType: "application/json",
            data: JSON.stringify(payload),

            success: function (res) {

                const modalEl =
                    document.getElementById("subjectModal");

                mdb.Modal.getInstance(modalEl)?.hide();

                table.ajax.reload(null, false);

                showToast(
                    res.message ||
                    (id
                        ? "Subject updated successfully"
                        : "Subject added successfully"),
                    "success"
                );

            },

            error: function (xhr) {

                const modalEl =
                    document.getElementById("subjectModal");

                mdb.Modal.getInstance(modalEl)?.hide();

                if (xhr.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                    return;
                }

                if (xhr.status === 409 &&
                    xhr.responseJSON?.message) {

                    showToast(
                        xhr.responseJSON.message,
                        "exists"
                    );

                    return;
                }

                if (xhr.responseJSON?.errors) {

                    const message =
                        xhr.responseJSON.errors.join("\n");

                    showToast(message, "error");
                    return;
                }

                if (xhr.responseJSON?.message) {

                    showToast(
                        xhr.responseJSON.message,
                        "error"
                    );

                    return;
                }

                showToast(
                    "Something went wrong",
                    "error"
                );

            }

        });

    });


    $('#subjectTable').on('click', '.editBtn', function () {

        const id = $(this).data('id');

        $.ajax({

            url: `${subjectApi}/${id}`,
            type: "GET",

            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },

            success: function (res) {

                const rowData = res.data;

                $('#subjectId').val(rowData.subjectId);
                $('#groupId').val(rowData.groupId);
                $('#subjectName').val(rowData.subjectName);

                loadBranches(rowData.branchId);

                const modal = new mdb.Modal(
                    document.getElementById('subjectModal')
                );

                modal.show();

            },

            error: function (xhr) {

                if (xhr.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                    return;
                }

                showToast( "Unable to load record", "error");

            }

        });

    });

});