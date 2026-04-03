$(document).ready(function () {

    const apiBase = "http://localhost:5263/api";

    const table = $('#studentTable').DataTable({
        ajax: {
            url: `${apiBase}/student`,
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
                    showToast("Failed to load students", "error");
                }
            }
        },

        columns: [
            { data: "studentId" },
            { data: "name" },
            { data: "email" },
            { data: "course" },

            {
                data: "isActive",
                render: function (data, type, row) {
                    return `
                        <label class="toggle-switch">
                            <input type="checkbox" class="status-toggle"
                                data-id="${row.studentId}"
                                ${data ? "checked" : ""}>
                            <span class="slider"></span>
                        </label>
                    `;
                }
            }
        ]
    });

    $('#studentTable').on('change', '.status-toggle', function () {

        var checkbox = $(this);
        var studentId = checkbox.data("id");
        var isChecked = checkbox.is(":checked");

        let url = isChecked
            ? `${apiBase}/users/activate/${studentId}`
            : `${apiBase}/users/deactivate/${studentId}`;

        $.ajax({
            url: url,
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },

            success: function (res) {

                if (res.success) {
                    showToast(res.message || "Status updated", "success");
                } else {
                    showToast(res.message || "Operation failed", "error");
                    checkbox.prop("checked", !isChecked); 
                }
            },

            error: function (xhr) {

                if (xhr.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                    return;
                }

                showToast("Error updating status", "error");
                checkbox.prop("checked", !isChecked); 
            }
        });
    });

});