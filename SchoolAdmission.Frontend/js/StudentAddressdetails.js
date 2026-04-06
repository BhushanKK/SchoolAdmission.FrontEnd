$(document).ready(function () {

    const apiBase = "http://localhost:5263/api";
    const token = localStorage.getItem("accessToken");
    const studentId = localStorage.getItem("studentId");

    const headers = { "Authorization": "Bearer " + token };

    $(document).on('click', '#btnSaveAddressInfo', function (e) {
        e.preventDefault();

        console.log("Clicked");

        if (!studentId) {
            alert("StudentId not found. Please complete student registration first.");
            return;
        }

        const payload = {
            studentId: studentId,   

            pVillage: $("#permanent_village").val(),
            pCity: $("#permanent_city").val(),
            pTaluka: "",
            pDistrict: $("#permanent_district").val(),
            pState: $("#permanent_state").val(),
            pCountry: "India",
            pPincode: $("#permanent_pincode").val(),
            pLandmark: $("#permanent_landmark").val(),

            cVillage: $("#current_village").val(),
            cCity: $("#current_city").val(),
            cTaluka: "",
            cDistrict: $("#current_district").val(),
            cState: $("#current_state").val(),
            cCountry: "India",
            cPincode: $("#current_pincode").val(),
            cLandmark: $("#current_landmark").val(),

            isSameAddress: $('#sameAddress').is(':checked')
        };

        console.log("Payload:", payload);

        $('#btnSaveAddressInfo').prop("disabled", true);

        $.ajax({
            url: `${apiBase}/student-address`,
            method: "POST",
            headers: headers,
            contentType: "application/json",
            data: JSON.stringify(payload),

            success: function (res) {
                showToast("Address saved successfully", "success");
                $('#btnSaveAddressInfo').prop("disabled", false);
            },

            error: function (xhr) {
                $('#btnSaveAddressInfo').prop("disabled", false);

                if (xhr.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                    return;
                }

                if (xhr.responseJSON?.message) {
                    showToast(xhr.responseJSON.message, "error");
                    return;
                }

                showToast("Failed to save address", "error");
            }
        });
    });

    window.copyPermanent = function () {
        const isChecked = $('#sameAddress').is(':checked');
        const fields = ['village', 'city', 'district', 'state', 'pincode', 'landmark'];

        fields.forEach(function (field) {
            const $current = $('#current_' + field);
            const $permanent = $('#permanent_' + field);

            if (isChecked) {
                $current.val($permanent.val()).prop('disabled', true);
            } else {
                $current.val('').prop('disabled', false);
            }
        });
    };

    $('#permanent_village, #permanent_city, #permanent_district, #permanent_state, #permanent_pincode, #permanent_landmark')
        .on('input', function () {
            if ($('#sameAddress').is(':checked')) {
                copyPermanent();
            }
        });

});