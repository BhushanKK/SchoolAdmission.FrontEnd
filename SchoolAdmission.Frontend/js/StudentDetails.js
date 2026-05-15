$(document).ready(function () {
    const studentId = localStorage.getItem("studentId");
    /*Step 1: Load Student Information Fetching */

    $.ajax({
        url: studentApi + '/' + studentId,
        type: 'GET',
        dataType: 'json',
        headers: getTokenHeader(),
        success: function (response) {
            if (response.success && response.data) {
                const data = response.data;

                // Basic info
                $('#firstName').val(data.firstName);
                $('#middleName').val(data.middleName);
                $('#lastName').val(data.lastName);

                $('#dob').val(data.dob ? data.dob.split('T')[0] : '');
                $('#aadharNo').val(data.aadharNo);
                $('#saralId').val(data.saralId);
                $('#motherTongue').val(data.motherTongue);
                $('#nationality').val(data.nationality || 'Indian');

                if (data.gender !== null) {
                    $('#gender').val(data.gender.toString());
                }
                // Religion / Category / Caste
                populateDropdown(
                    religionApi,
                    $('#religionId'),
                    'religionId',
                    'religion',
                    'Select Religion',
                    data.religionId
                );

                populateDropdown(
                    categoryApi,
                    $('#categoryId'),
                    'categoryId',
                    'category',
                    'Select Category',
                    data.categoryId
                );

                if (data.categoryId) {
                    loadCasteDropdown(data.categoryId, data.casteId);
                }

                $('#isMinority').prop('checked', !!data.isMinority);
            }
        },
        error: function (xhr, status, error) {
            showToast('Failed to load student information', 'error');
        }
    });

    // Populate dropdown with optional selected value
    function populateDropdown(url, $dropdown, valueField, textField, placeholder, selectedValue = null) {
        $dropdown.empty().append(`<option value="">${placeholder}</option>`);

        $.ajax({
            url: url,
            type: 'GET',
            headers: getTokenHeader(),
            success: function (response) {
                if (!response || !response.data) return;

                const data = Array.isArray(response.data) ? response.data : [response.data];

                data.forEach(item => {
                    if (!item) return;

                    const option = $('<option>')
                        .val(item[valueField] || '')
                        .text(item[textField] || 'Unknown');

                    if (selectedValue && selectedValue.toString() === (item[valueField] || '').toString()) {
                        option.prop('selected', true);
                    }

                    $dropdown.append(option);
                });
            },
            error: function () {
                showToast('Failed to load ' + placeholder, 'error');
            }
        });
    }

    // Load caste dropdown based on category
    function loadCasteDropdown(categoryId, selectedCasteId = null) {
        const $caste = $('#casteId');
        $caste.empty().append('<option value="">Select Caste</option>').prop('disabled', true);

        if (!categoryId) return;

        $.ajax({
            url: `${casteApi}/${categoryId}`,
            type: 'GET',
            headers: getTokenHeader(),
            success: function (response) {
                if (!response || !response.data) return;

                const data = Array.isArray(response.data) ? response.data : [response.data];

                data.forEach(item => {
                    if (!item) return;

                    const option = $('<option>')
                        .val(item.casteId || '')
                        .text(item.caste || 'Unknown');

                    if (selectedCasteId && selectedCasteId.toString() === (item.casteId || '').toString()) {
                        option.prop('selected', true);
                    }

                    $caste.append(option);
                });

                $caste.prop('disabled', false);
            },
            error: function () {
                showToast('Failed to load caste data', 'error');
            }
        });
    }

    // When category changes, reload caste
    $('#categoryId').on('change', function () {
        const categoryId = $(this).val();
        loadCasteDropdown(categoryId);
    });

    // Minority checkbox based on religion
    const HINDU_ID = "1"; // Assuming Hindu has ID 1, adjust as needed
    $('#religionId').on('change', function () {
        const religionId = $(this).val();
        $('#isMinority').prop('checked', religionId && religionId !== HINDU_ID);
    });
    /*--End of Step I - Student Information Fetching and Dropdown Population--*/

    /*Start Step 2: Student Address Details */

    $.ajax({
        url: studentAddressApi + '/' + studentId,
        type: 'GET',
        dataType: 'json',
        headers: getTokenHeader(),

        success: function (response) {

            if (response.success && response.data) {

                const data = response.data;

                /* Permanent Address */
                $('#permanent_village').val(data.pVillage);
                $('#permanent_city').val(data.pCity);
                $('#permanent_taluka').val(data.pTaluka);
                $('#permanent_district').val(data.pDistrict);
                $('#permanent_state').val(data.pState);
                $('#permanent_pincode').val(data.pPincode);
                $('#permanent_landmark').val(data.pLandmark);

                /* Current Address */
                $('#current_village').val(data.cVillage);
                $('#current_city').val(data.cCity);
                $('#current_taluka').val(data.cTaluka);
                $('#current_district').val(data.cDistrict);
                $('#current_state').val(data.cState);
                $('#current_pincode').val(data.cPincode);
                $('#current_landmark').val(data.cLandmark);

                $('#sameAddress').prop('checked', data.isSameAddress);

                if (data.isSameAddress) {
                    copyPermanent();
                }
            }
        },

        error: function () {
            showToast("Failed to load address details", "error");
        }
    });


    /*End Step 2: Student Address Details */

    /*Start Step 3: Student Health Details */
    $.ajax({
        url: healthApi + '/' + studentId,
        type: 'GET',
        dataType: 'json',
        headers: getTokenHeader(),

        success: function (response) {

            const data = response.data || response.result || response;

            if (!data) return;

            $('#height').val(data.height || "");
            $('#weight').val(data.weight || "");

            $('#isHandicapped').val(data.isHandicapped?.toString() || "false");
            $('#handicappedTypeId').val(data.handicappedTypeId || "");

            if (data.isHandicapped == true) {
                $('#handicappedTypeId').prop('disabled', false);
            } else {
                $('#handicappedTypeId').val('').prop('disabled', true);
            }
        },

        error: function (xhr) {
            showToast("Failed to load health details", "error");
        }
    });
    /*End Step 3: Student Health Details */

    /*Start Step 4: Student Parents Details */

    $.ajax({
        url: guardianApi + '/' + studentId,
        type: 'GET',
        dataType: 'json',
        headers: getTokenHeader(),

        success: function (response) {

            const data = response.data || response.result || response;

            if (!data) {
                showToast("No parent data found", "info");
                return;
            }

            $('#fatherName').val(data.fatherName || "");
            $('#motherName').val(data.motherName || "");
            $('#grandFatherName').val(data.grandFatherName || "");
            $('#parentName').val(data.parentName || "");

            $('#contactNo').val(data.contactNo || "");
            $('#emailId').val(data.emailId || "");

            $('#income').val(data.income || "");
            $('#occupation').val(data.occupation || "");
        },

        error: function (xhr) {

            if (xhr.status === 401) {
                localStorage.clear();
                window.location.href = "../index.html";
                return;
            }

            showToast("Failed to load parent details", "error");
        }
    });
    /*End Step 4: Student Parents Details */

    /*Start Step 5: Student Previous School Details */

    $.ajax({
        url: previousSchoolApi + '/' + studentId,
        type: "GET",
        dataType: "json",
        headers: getTokenHeader(),

        success: function (response) {

            const data = response.data || response.result || response;

            if (!data) {
                showToast("No previous school data found", "info");
                return;
            }

            $("#previousSchool").val(data.previousSchool || "");
            $("#schoolDOE").val(data.schoolDOE ? data.schoolDOE.split('T')[0] : "");
            $("#progress").val(data.progress || "");
            $("#behaviour").val(data.behaviour || "");

            $("#passingYear").val(data.passingYear || "");
            $("#seatNo").val(data.seatNo || "");
            $("#totalMarks").val(data.totalMarks || "");
            $("#percentage").val(data.percentage || "");
        },

        error: function (xhr) {

            if (xhr.status === 401) {
                localStorage.clear();
                window.location.href = "../index.html";
                return;
            }

            showToast("Failed to load previous school details", "error");
        }
    });

    /*End Step 5: Student Previous School Details */

    /*Start Step 6: Student subject Choice Details */
    loadStudentSubjectChoiceDetails();

    function loadStudentSubjectChoiceDetails() {

        $.ajax({
            url: studentSubjectChoiceByStudentApi + studentId,
            type: "GET",
            headers: getTokenHeader(),

            success: function (response) {

                if (!response || !response.data) return;

                const { branchId, standardId } = response.data;

                console.log("Branch ID:", branchId);
                console.log("Standard ID:", standardId);

                loadBranchDropdown(function () {

                    $("#ddlBranch").val(branchId);

                    loadStandardDropdown(function () {

                        $("#ddlStandard").val(standardId);

                        // Render subjects first
                        BindSubjects(branchId).done(function () {

                            // Then select saved subjects
                            loadSelectedSubjects();
                        });

                    });
                });
            }
        });
    }

    function loadSelectedSubjects() {

        $.ajax({
            url: fetchStudentSubjectsApi + studentId,
            type: "GET",
            headers: getTokenHeader(),

            success: function (response) {

                if (!response.success || !response.data) return;

                response.data.forEach(function (item) {

                    $("#sub_" + item.subjectId)
                        .prop("checked", true)
                        .trigger("change");
                });
            }
        });
    }

    function loadStandardDropdown(callback) {

        $.ajax({
            url: standardApi,
            type: "GET",
            headers: getTokenHeader(),

            success: function (response) {

                $("#ddlStandard")
                    .empty()
                    .append('<option value="">Select Standard</option>');

                response.data.forEach(function (item) {

                    $("#ddlStandard").append(`
                    <option value="${item.standardId}">
                        ${item.standardName}
                    </option>
                `);
                });

                if (callback) callback();
            }
        });
    }

    function loadBranchDropdown(callback) {

        $.ajax({
            url: branchApi,
            type: "GET",
            headers: getTokenHeader(),

            success: function (response) {

                $("#ddlBranch")
                    .empty()
                    .append('<option value="">Select Branch</option>');

                response.data.forEach(function (item) {

                    $("#ddlBranch").append(`
                    <option value="${item.branchId}">
                        ${item.branchName}
                    </option>
                `);
                });

                if (callback) callback();
            }
        });
    }

    function BindSubjects(branchId) {

        if (!branchId) {
            return $.Deferred().resolve();
        }

        return $.ajax({
            url: subjectChoiceApi + branchId,
            type: "GET",
            headers: getTokenHeader(),

            success: function (res) {

                if (!res.success) return;

                const groups = res.data.groups;

                $("#subjectsContainer").empty();
                $("#optionalSubjectsContainer").empty();

                // Mandatory Subjects
                if (groups["1"]) {

                    groups["1"].forEach(function (subject) {

                        $("#subjectsContainer").append(`
                        <tr>
                            <td>${subject.subjectId}</td>
                            <td>${subject.subjectName}</td>
                        </tr>
                    `);
                    });
                }

                // Optional Subject Groups
                $.each(groups, function (groupKey, subjects) {

                    if (groupKey === "1") return;

                    let html = `
                    <div class="mb-3 border rounded p-2">
                        <div class="fw-bold mb-2">
                            Group ${groupKey}
                        </div>
                `;

                    // Branch 3 - Group 3 Checkbox Logic
                    if (branchId == 3 && groupKey == "3") {

                        html += `
                        <small class="text-danger">
                            Select exactly 2 subjects
                        </small>
                    `;

                        subjects.forEach(function (subject) {

                            html += `
                            <div class="form-check">
                                <input class="form-check-input branch3-checkbox"
                                       type="checkbox"
                                       value="${subject.subjectId}"
                                       id="sub_${subject.subjectId}">

                                <label class="form-check-label"
                                       for="sub_${subject.subjectId}">
                                    ${subject.subjectName}
                                </label>
                            </div>
                        `;
                        });

                    } else {

                        // Radio Button Groups
                        subjects.forEach(function (subject) {

                            html += `
                            <div class="form-check">

                                <input class="form-check-input"
                                       type="radio"
                                       name="group_${groupKey}"
                                       value="${subject.subjectId}"
                                       id="sub_${subject.subjectId}">

                                <label class="form-check-label"
                                       for="sub_${subject.subjectId}">
                                    ${subject.subjectName}
                                </label>

                            </div>
                        `;
                        });
                    }

                    html += `</div>`;

                    $("#optionalSubjectsContainer").append(html);
                });

                bindBranch3CheckboxValidation();
            }
        });
    }

    function bindBranch3CheckboxValidation() {

        $(document)
            .off("change", ".branch3-checkbox")
            .on("change", ".branch3-checkbox", function () {
                const checked = $(".branch3-checkbox:checked");

                if (checked.length > 2) {

                    this.checked = false;

                    showToast(
                        "Only 2 subjects allowed for Group 3",
                        "error"
                    );
                }
            });
    }

    /*End Step 6: Student subject choice Details */

    /*Start Step 7: Student Document Details */
    $.ajax({
        url: documentUploadApi + '/' + studentId,
        type: 'GET',
        dataType: 'json',
        headers: getTokenHeader(),

        success: function (response) {

            const data = response.data || response.result || response;

            if (!data || data.length === 0) {
                showToast("No documents found", "info");
                return;
            }

            const selectedDocumentType = $("#documentType").val();

            const doc = data.find(d =>
                d.documentType?.toString() === selectedDocumentType
            );

            if (!doc) {
                //showToast("Selected document not found", "error");
                return;
            }

            $("#documentType").val(doc.documentType?.toString() || "");
            $("#uploadedDate").val(
                doc.uploadedDate ? doc.uploadedDate.split('T')[0] : ""
            );

        },

        error: function (xhr) {

            if (xhr.status === 401) {
                localStorage.clear();
                window.location.href = "../index.html";
                return;
            }

            showToast("Failed to load documents", "error");
        }
    });
});
/*End Step 7: Student Document Details */