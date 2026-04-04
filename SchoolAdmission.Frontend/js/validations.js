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

    $(".nameValidation").on("keypress", function (e) { //Events
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

    $(".passwordValidation").on("blur", function () {

        var password = $(this).val();

        var regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{7,}$/;

        if (!regex.test(password)) {
            alert("Password must be at least 7 characters long and include at least one uppercase letter, one number, and one special character.");
            e.preventDefault();
            
        }

    });
});