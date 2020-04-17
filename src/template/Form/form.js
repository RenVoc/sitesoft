$(document).ready(function() {
    $('.select2').niceSelect();
    $('#main__form').validate({
        rules: {
            fName: {
                required: true
            },
            lName: {
                required: true
            },
            Email: {
                required: true,
                email: true
            },
            address: {
                required: true
            }
        },
        errorPlacement: function (error, element) {
            $(element).parent().addClass('label__wrapper_alert');
        },
        submitHandler: function (form) {
            return false;
        }
    });
});