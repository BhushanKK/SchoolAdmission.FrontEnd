$(document).ready(function () {

    const token = localStorage.getItem("accessToken");
    const studentId = localStorage.getItem("studentId");
    const headers = { "Authorization": "Bearer " + token };

    $.ajax({
        url: 'http://localhost:5263/api/student/' + studentId,
        type: 'GET',
        dataType: 'json',
        headers: headers,
        success: function(response) {
            if(response.success && response.data) {
                $('#firstName').val(response.data.firstName);
                $('#middleName').val(response.data.middleName);
                $('#lastName').val(response.data.lastName);

                //bind remaining fields similarly... @@ Kunal
                
            } else {
                alert('No data found for this student.');
            }
        },
        error: function(xhr, status, error) {
            console.error('API Error:', error);
        }
    });

    function populateDropdown(url, $dropdown, valueField, textField, placeholder) {
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

                    $dropdown.append(
                        $('<option>')
                            .val(item[valueField] || '')
                            .text(item[textField] || 'Unknown')
                    );
                });
            },
            error: function () {
                alert('Failed to load ' + placeholder);
            }
        });
    }

    populateDropdown(
        'http://localhost:5263/api/religionmasters',
        $('#religionId'),
        'religionId',
        'religion',
        'Select Religion'
    );

    populateDropdown(
        'http://localhost:5263/api/Categorymasters',
        $('#categoryId'),
        'categoryId',
        'category',
        'Select Category'
    );

    $('#categoryId').on('change', function () {

        const categoryId = $(this).val();
        const $caste = $('#casteId');

        $caste.empty()
            .append('<option value="">Select Caste</option>')
            .prop('disabled', true);

        if (!categoryId) return;

        $.ajax({
            url: `http://localhost:5263/api/castemaster/${categoryId}`,
            type: 'GET',
            headers: headers,
            success: function (response) {

                if (!response || !response.data) return;

                const data = Array.isArray(response.data) ? response.data : [response.data];

                data.forEach(item => {
                    if (!item) return;

                    $caste.append(
                        $('<option>')
                            .val(item.casteId || '')
                            .text(item.caste || 'Unknown')
                    );
                });

                $caste.prop('disabled', false);
            },
            error: function () {
                alert('Failed to load caste data');
            }
        });
    });

    const HINDU_ID = "7";

    $('#religionId').on('change', function () {
        const religionId = $(this).val();
        $('#isMinority').prop('checked', religionId && religionId !== HINDU_ID);
    });

    window.copyPermanent = function () {

        const isChecked = $('#sameAddress').is(':checked');

        const fields = ['village', 'city', 'district', 'state', 'pincode'];

        fields.forEach(field => {
            const $current = $(`#current_${field}`);
            const $permanent = $(`#permanent_${field}`);

            if (isChecked) {
                $current.val($permanent.val()).prop('disabled', true);
            } else {
                $current.val('').prop('disabled', false);
            }
        });
    };

    $('#permanent_village, #permanent_city, #permanent_district, #permanent_state, #permanent_pincode')
        .on('input', function () {
            if ($('#sameAddress').is(':checked')) {
                copyPermanent();
            }
        });

    function validateStep1() {

        let isValid = true;

        // required fields
        const fields = [
            '#firstName',
            '#lastName',
            '#dob',
            '#aadharNo',
            '#religionId',
            '#categoryId'
        ];

        fields.forEach(function (selector) {
            const value = $(selector).val();

            if (!value) {
                isValid = false;
                $(selector).addClass('is-invalid');
            } else {
                $(selector).removeClass('is-invalid');
            }
        });

        // Aadhar validation (12 digits)
        const aadhar = $('#aadharNo').val();
        if (aadhar && aadhar.length !== 12) {
            isValid = false;
            $('#aadharNo').addClass('is-invalid');
        }

        // Toggle buttons
        if (isValid) {
            $('#nextBtn').removeClass('d-none');
            $('#submitBtn').removeClass('d-none');
        } else {
            $('#nextBtn').addClass('d-none');
            $('#submitBtn').addClass('d-none');
        }
    }
});