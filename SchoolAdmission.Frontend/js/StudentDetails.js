$(document).ready(function () {

    /*Step 1: Load Student Information Fetching */

    const token = localStorage.getItem("accessToken");
    const studentId = localStorage.getItem("studentId");
    const headers = { "Authorization": "Bearer " + token };

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
    
    /* Load Student Health Details */

    $.ajax({
        url: healthApi + '/' + studentId,
        type: 'GET',
        dataType: 'json',
        headers: headers,

        success: function (response) {

            if (response.success && response.data) {

                const data = response.data;

                $('#height').val(data.height);
                $('#weight').val(data.weight);

                if (data.isHandicapped !== null) {
                    $('#isHandicapped').val(data.isHandicapped.toString());
                }

                $('#handicappedTypeId').val(data.handicappedTypeId);

                if (data.isHandicapped == true) {
                    $('#handicappedTypeId').prop('disabled', false);
                }
                else {
                    $('#handicappedTypeId').val('').prop('disabled', true);
                }
            }
        },

        error: function () {
            showToast("Failed to load health details", "error");
        }
    });


    $(document).on("change", "#isHandicapped", function () {

        const value = $(this).val();

        if (value == "true") {
            $("#handicappedTypeId").prop("disabled", false);
        }
        else {
            $("#handicappedTypeId").val("").prop("disabled", true);
        }
    });


    $(document).on("click", "#btnSavePhysicalInfo", function (e) {

        e.preventDefault();

        if (!studentId) {
            showToast("StudentId not found", "error");
            return;
        }

        const height = $("#height").val();
        const weight = $("#weight").val();
        const isHandicapped = $("#isHandicapped").val();
        const handicappedTypeId = $("#handicappedTypeId").val();

        if (!height || !weight) {
            showToast("Height and Weight required", "error");
            return;
        }

        if (isHandicapped === "") {
            showToast("Select handicapped option", "error");
            return;
        }

        if (isHandicapped == "true" && !handicappedTypeId) {
            showToast("Select handicapped type", "error");
            return;
        }

        const payload = {
            studentId: studentId,
            height: Number(height),
            weight: Number(weight),
            isHandicapped: isHandicapped == "true",
            handicappedTypeId: handicappedTypeId ? Number(handicappedTypeId) : null
        };

        $("#btnSavePhysicalInfo").prop("disabled", true);

        $.ajax({
            url: healthApi,
            type: "POST",
            headers: headers,
            contentType: "application/json",
            data: JSON.stringify(payload),

            success: function () {
                showToast("Physical details saved successfully", "success");
                $("#btnSavePhysicalInfo").prop("disabled", false);
            },

            error: function (xhr) {

                $("#btnSavePhysicalInfo").prop("disabled", false);

                if (xhr.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                    return;
                }

                if (xhr.responseJSON?.message) {
                    showToast(xhr.responseJSON.message, "error");
                    return;
                }

                showToast("Failed to save physical details", "error");
            }
        });

    });

/*End Step 3: Student Health Details */