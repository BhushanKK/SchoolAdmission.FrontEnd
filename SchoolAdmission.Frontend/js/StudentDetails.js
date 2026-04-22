$(document).ready(function () {

    /*Step 1: Load Student Information Fetching */

    const token = localStorage.getItem("accessToken");
    const studentId = localStorage.getItem("studentId");
    const headers = { "Authorization": "Bearer " + token };
    console.log("StudentId:", localStorage.getItem("studentId"));
    $.ajax({
        url: studentApi + '/' + studentId,
        type: 'GET',
        dataType: 'json',
        headers: headers,
        success: function(response) {
            if(response.success && response.data) {
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
        error: function(xhr, status, error) {
            showToast('Failed to load student information', 'error');
        }
    });

    // Populate dropdown with optional selected value
    function populateDropdown(url, $dropdown, valueField, textField, placeholder, selectedValue = null) {
        $dropdown.empty().append(`<option value="">${placeholder}</option>`);

        $.ajax({
            url: url,
            type: 'GET',
            headers: headers,
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
            headers: headers,
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
    const HINDU_ID = "7";
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
        headers: headers,

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

   
    $(document).on('click', '#btnSaveAddressInfo', function (e) {

        e.preventDefault();

        const payload = {

            studentId: studentId,

            pVillage: $("#permanent_village").val(),
            pCity: $("#permanent_city").val(),
            pTaluka: $("#permanent_taluka").val(),
            pDistrict: $("#permanent_district").val(),
            pState: $("#permanent_state").val(),
            pCountry: "India",
            pPincode: $("#permanent_pincode").val(),
            pLandmark: $("#permanent_landmark").val(),

            cVillage: $("#current_village").val(),
            cCity: $("#current_city").val(),
            cTaluka: $("#current_taluka").val(),
            cDistrict: $("#current_district").val(),
            cState: $("#current_state").val(),
            cCountry: "India",
            cPincode: $("#current_pincode").val(),
            cLandmark: $("#current_landmark").val(),

            isSameAddress: $('#sameAddress').is(':checked')
        };

        $.ajax({
            url: studentAddressApi,
            type: "POST",
            headers: headers,
            contentType: "application/json",
            data: JSON.stringify(payload),

            success: function () {
                showToast("Address saved successfully", "success");
            },

            error: function () {
                showToast("Failed to save address", "error");
            }
        });
    });

    window.copyPermanent = function () {

        const isChecked = $('#sameAddress').is(':checked');

        const fields = [
            'village',
            'city',
            'taluka',
            'district',
            'state',
            'pincode',
            'landmark'
        ];

        fields.forEach(function (field) {

            const permanent = $('#permanent_' + field).val();

            if (isChecked) {
                $('#current_' + field).val(permanent).prop('disabled', true);
            }
            else {
                $('#current_' + field).val('').prop('disabled', false);
            }

        });
    };

    $('#sameAddress').change(function () {
        copyPermanent();
    });

});
/*End Step 2: Student Address Details */

/*Start Step 3: Student Health Details */
$.ajax({
        url: healthApi + '/' + studentId,
        type: 'GET',
        dataType: 'json',
        headers: headers,

        success: function (response) {

            console.log("Health API:", response);

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
            console.log("Health Error:", xhr.responseText);
            showToast("Failed to load health details", "error");
        }
});
/*End Step 3: Student Health Details */

/*Start Step 4: Student Parents Details */

$.ajax({
        url: guardianApi + '/' + studentId,
        type: 'GET',
        dataType: 'json',
        headers: headers,

        success: function (response) {

            console.log("Guardian API:", response);

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

            console.log("Guardian Error:", xhr.responseText);

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
        headers: headers,

        success: function (response) {

            console.log("Previous School Response:", response);

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

            console.log("Error fetching previous school:", xhr.responseText);

            if (xhr.status === 401) {
                localStorage.clear();
                window.location.href = "../index.html";
                return;
            }

            showToast("Failed to load previous school details", "error");
        }
    });

/*End Step 5: Student Previous School Details */

/*Start Step 7: Student Document Details */
$.ajax({
    url: documentUploadApi + '/' + studentId,
    type: "GET",
    dataType: "json",
    headers: headers,

    success: function (response) {

        console.log("Student Documents Response:", response);

        const data = response.data || response.result || response;

        if (!data || data.length === 0) {
            showToast("No documents found", "info");
            return;
        }

        // You can store or process data here
        data.forEach(function (item) {

            console.log("Document ID:", item.documentId);
            console.log("Type:", item.documentType);
            console.log("Path:", item.documentPath);
            console.log("Uploaded:", item.uploadedDate);

        });
    },

    error: function (xhr) {

        console.log("Error fetching documents:", xhr.responseText);

        if (xhr.status === 401) {
            localStorage.clear();
            window.location.href = "../index.html";
            return;
        }

        showToast("Failed to load documents", "error");
    }
});
/*End Step 7: Student Document Details */