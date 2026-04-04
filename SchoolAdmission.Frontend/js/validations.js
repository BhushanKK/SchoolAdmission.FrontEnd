$(document).ready(function () {

    var maxLength = 15;

    $(".nameValidation").on("keypress", function (e) { //Events
        var charCode = e.which;
        var char = String.fromCharCode(e.which);
        var currentVal = $(this).val();
        var char = String.fromCharCode(charCode);

        if (currentVal.length >= maxLength) {
            e.preventDefault();
            return;
        }

        if (charCode === 32) {
            e.preventDefault();
            return;
        }

        if (!/^[a-zA-Z\s]+$/.test(char)) {
            e.preventDefault();
        }
    });

    $(".nameValidationWithSpace").on("keypress", function (e) { //Events
        var charCode = e.which;
        var char = String.fromCharCode(e.which);
        var currentVal = $(this).val();
        var char = String.fromCharCode(charCode);

        if (currentVal.length >= maxLength) {
            e.preventDefault();
            return;
        }

        if (!/^[a-zA-Z\s]+$/.test(char)) {
            e.preventDefault();
        }
    });

    $(".numberValidation").on("keypress", function (e) {
        var char = String.fromCharCode(e.which);
        if (!/^[0-9]$/.test(char)) {
            e.preventDefault();
        }
    });
});