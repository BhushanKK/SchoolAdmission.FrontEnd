const token = localStorage.getItem("accessToken");
const studentId = localStorage.getItem("studentId");

const headers = {
    "Authorization": "Bearer " + token
};

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