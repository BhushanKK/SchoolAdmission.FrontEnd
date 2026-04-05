$(document).ready(function () {
    const token = localStorage.getItem("accessToken");

    const table = $('#studentTable').DataTable({
        ajax: {
            url: "http://localhost:5263/api/student-details",
            type: "GET",
            headers: { "Authorization": "Bearer " + token },
            dataSrc: function (json) {
                return json.success && json.data ? json.data : [];
            }
        },
        columns: [
            { data: "studentName", defaultContent: "" },
            { data: "schoolName", defaultContent: "" },
            { data: "dob", defaultContent: "" },
            { data: "gender", defaultContent: "" },
            { data: "aadharNo", defaultContent: "" },
            { data: "standard", defaultContent: "" },
            { data: "division", defaultContent: "" },
            {
                data: null,
                render: function (data, type, row) {
                    const isChecked = row.status ? "checked" : "";
                    return `
                        <div class="form-check form-switch">
                            <input 
                                class="form-check-input status-toggle" 
                                type="checkbox" 
                                data-id="${row.studentId}" 
                                ${isChecked}>
                        </div>
                    `;
                },
                orderable: false
            }
        ]
    });

    $('#studentTable').on('change', '.status-toggle', function () {
        const checkbox = $(this);
        const studentId = checkbox.data('id');
        const isActive = checkbox.is(':checked');
        const status = isActive;

        checkbox.prop('disabled', true);

        $.ajax({
            url: `http://localhost:5263/api/users/student-status/${studentId}/${status}`,
            type: "PUT",
            headers: { "Authorization": "Bearer " + token },
            success: function () {
            },
            error: function () {
                checkbox.prop('checked', !isActive);
            },
            complete: function () {
                checkbox.prop('disabled', false);
            }
        });
    });
});