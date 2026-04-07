$(document).ready(function () {

    var maxLength = 50;

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


    $(".emailValidation").on("input", function () {
    var email = $(this).val().trim();

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        $(this).css("border", "2px solid red");
    } else {
        $(this).css("border", "2px solid green");
    }
    });

    $(".passwordValidation").on("input", function () {
    var password = $(this).val();

    
    var passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/;

    if (!passwordRegex.test(password)) {
        $(this).css("border", "2px solid red");
    } else {
        $(this).css("border", "2px solid green");
    }
    });

    $(".confirmPasswordValidation").on("input", function () {
    var password = $(".passwordValidation").val();
    var confirmPassword = $(this).val();

    if (confirmPassword !== password) {
        $(this).css("border", "2px solid red");
    } else {
        $(this).css("border", "2px solid green");
    }
    });

});