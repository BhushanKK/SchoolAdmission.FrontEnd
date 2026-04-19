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

/*End Step 2: Student Address Details */
});
