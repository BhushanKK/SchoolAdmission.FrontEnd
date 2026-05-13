const token = localStorage.getItem("accessToken");
const studentId = localStorage.getItem("studentId");

const headers = getTokenHeader();

function BindBranches() {
    $.ajax({
        url: branchApi,
        type: "GET",
        headers: headers,
        success: function (response) {

            let dropdown = $("#ddlBranch");
            dropdown.empty().append(`<option value="">Select Branch</option>`);

            if (response.success && response.data) {
                response.data.forEach(item => {
                    dropdown.append(`
                        <option value="${item.branchId}">
                            ${item.branchName}
                        </option>
                    `);
                });
            }
        },
        error: function () {
            $("#errorMsg").text("Failed to load branches");
        }
    });
}

function BindStandards() {
    $.ajax({
        url: standardApi,
        type: "GET",
        headers: headers,
        success: function (response) {

            let dropdown = $("#ddlStandard");
            dropdown.empty().append(`<option value="">Select Standard</option>`);

            if (response.success && response.data) {
                response.data.forEach(item => {
                    dropdown.append(`
                        <option value="${item.standardId}">
                            ${item.standardName}
                        </option>
                    `);
                });
            }
        },
        error: function () {
            $("#errorMsg").text("Failed to load standards");
        }
    });
}

function BindSubjects(branchId) {

    if (!branchId) return;

    $.ajax({
        url: subjectChoiceApi + branchId,
        type: "GET",
        headers: headers,
        success: function (res) {

            if (!res.success) return;

            const groups = res.data.groups;

            $("#subjectsContainer").empty();
            $("#optionalSubjectsContainer").empty();

            if (groups["1"]) {
                groups["1"].forEach(s => {
                    $("#subjectsContainer").append(`
                        <tr>
                            <td>${s.subjectId}</td>
                            <td>${s.subjectName}</td>
                        </tr>
                    `);
                });
            }

            $.each(groups, function (groupKey, subjects) {

                if (groupKey === "1") return;

                let html = `
                    <div class="mb-3 border rounded p-2">
                        <div class="fw-bold mb-2">
                            Group ${groupKey}
                        </div>
                `;

                if (branchId == 3 && groupKey == "3") {

                    html += `
                        <small class="text-danger">
                            Select exactly 2 subjects
                        </small>
                    `;

                    subjects.forEach(s => {
                        html += `
                            <div class="form-check">
                                <input class="form-check-input branch3-checkbox"
                                       type="checkbox"
                                       value="${s.subjectId}"
                                       id="sub_${s.subjectId}">
                                <label class="form-check-label" for="sub_${s.subjectId}">
                                    ${s.subjectName}
                                </label>
                            </div>
                        `;
                    });

                }

                else {

                    subjects.forEach(s => {
                        html += `
                            <div class="form-check">
                                <input class="form-check-input"
                                       type="radio"
                                       name="group_${groupKey}"
                                       value="${s.subjectId}"
                                       id="sub_${s.subjectId}">
                                <label class="form-check-label" for="sub_${s.subjectId}">
                                    ${s.subjectName}
                                </label>
                            </div>
                        `;
                    });
                }

                html += `</div>`;

                $("#optionalSubjectsContainer").append(html);
            });

            $(document).off("change", ".branch3-checkbox").on("change", ".branch3-checkbox", function () {

                let checked = $(".branch3-checkbox:checked");

                if (checked.length > 2) {
                    this.checked = false;
                    showToast("Only 2 subjects allowed for Group 3", "error");
                }
            });

        }
    });
}


$("#ddlBranch").on("change", function () {
    const branchId = $(this).val();

    $("#subjectsContainer").empty();
    $("#optionalSubjectsContainer").empty();

    if (branchId) {
        BindSubjects(branchId);
    }
});


$(document).ready(function () {
    BindBranches();
    BindStandards();
});




$("#btnSaveSubjectInfo").click(function () {

    let branchId = parseInt($("#ddlBranch").val());
    let studentId = localStorage.getItem("studentId");

    if (!branchId) {
        showToast("Select Branch", "error");
        return;
    }

    if (!studentId) {
        showToast("Student not found", "error");
        return;
    }

    let payload = [];

    // =========================
    // GROUP 1 (MANDATORY)
    // =========================
    $("#subjectsContainer tr").each(function () {

        let subjectId = $(this).find("td:first").text().trim();

        if (subjectId) {
            payload.push({
                branchId: branchId,
                subjectId: parseInt(subjectId),
                groupId: 1,
                studentId: studentId
            });
        }
    });

    // =========================
    // GROUP 2,3,4... (ALL RADIO GROUPS)
    // =========================
    $("input[type='radio']:checked").each(function () {

        let name = $(this).attr("name"); // group_2, group_3, group_4
        let groupId = parseInt(name.split("_")[1]);

        payload.push({
            branchId: branchId,
            subjectId: parseInt($(this).val()),
            groupId: groupId,
            studentId: studentId
        });
    });

    // =========================
    // SCIENCE ONLY (MULTI CHECKBOX GROUP 3)
    // =========================
    if (branchId === 3) {

        $(".branch3-checkbox:checked").each(function () {

            payload.push({
                branchId: branchId,
                subjectId: parseInt($(this).val()),
                groupId: 3,
                studentId: studentId
            });
        });
    }

    // =========================
    // VALIDATION
    // =========================
    if (payload.length === 0) {
        showToast("Please select subjects", "error");
        return;
    }

    // =========================
    // API CALL
    // =========================
    $.ajax({
        url: studentSubjectChoiceApi,
        type: "POST",
        headers: headers,
        contentType: "application/json",
        data: JSON.stringify(payload),

        success: function () {
            showToast("Subject Info Saved Successfully", "success");
        },

        error: function (xhr) {
            console.error(xhr);
            showToast("Error saving subject info", "error");
        }
    });
});